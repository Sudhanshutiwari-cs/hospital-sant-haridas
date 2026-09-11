// app/api/patients/ensure-account/route.ts
import { NextRequest, NextResponse } from "next/server";
import { createClient, SupabaseClient } from "@supabase/supabase-js";

let _admin: SupabaseClient | null = null;
function getAdmin(): SupabaseClient {
  if (_admin) return _admin;
  const url = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) {
    throw new Error(
      "Missing SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY env variables"
    );
  }
  _admin = createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
  return _admin;
}

function normalizePhone(input: string): string {
  const digits = (input || "").replace(/\D/g, "");
  if (digits.length === 12 && digits.startsWith("91")) return digits.slice(2);
  if (digits.length === 11 && digits.startsWith("0")) return digits.slice(1);
  return digits;
}

export async function POST(req: NextRequest) {
  try {
    const admin = getAdmin();
    const body = await req.json();

    const phone = normalizePhone(body.phone);
    const full_name = String(body.full_name || "").trim();

    if (!phone || phone.length !== 10) {
      return NextResponse.json(
        { error: "Valid 10-digit phone is required" },
        { status: 400 }
      );
    }
    if (!full_name) {
      return NextResponse.json(
        { error: "full_name is required" },
        { status: 400 }
      );
    }

    const email = `${phone}@patients.local`;
    const password = phone;

    // 1) Look up existing patient row by phone
    const { data: existingPatient } = await admin
      .from("patients")
      .select("id, user_id")
      .eq("phone", phone)
      .maybeSingle();

    let userId: string | null = existingPatient?.user_id ?? null;

    // 2) Create auth user if none linked yet
    if (!userId) {
      const { data: created, error: createErr } =
        await admin.auth.admin.createUser({
          email,
          password,
          email_confirm: true,
          user_metadata: { phone, role: "patient", full_name },
        });

      if (createErr) {
        if (/already registered|already exists|duplicate/i.test(createErr.message)) {
          const { data: list, error: listErr } = await admin.auth.admin.listUsers({
            page: 1,
            perPage: 200,
          });
          if (listErr) throw listErr;
          const found = list.users.find((u) => u.email === email);
          if (!found) throw createErr;
          userId = found.id;
        } else {
          throw createErr;
        }
      } else {
        userId = created.user?.id ?? null;
      }
    }

    if (!userId) {
      return NextResponse.json(
        { error: "Could not resolve auth user id" },
        { status: 500 }
      );
    }

    // 3) Upsert patient row with user_id linked
    if (existingPatient?.id) {
      const { error: updErr } = await admin
        .from("patients")
        .update({
          user_id: userId,
          full_name,
          email: body.email ?? email,
          phone,
          gender: body.gender ?? null,
          date_of_birth: body.date_of_birth ?? null,
        })
        .eq("id", existingPatient.id);
      if (updErr) throw updErr;

      return NextResponse.json({
        success: true,
        patient_id: existingPatient.id,
        user_id: userId,
        created: false,
      });
    }

    const { data: newPatient, error: insErr } = await admin
      .from("patients")
      .insert({
        user_id: userId,
        full_name,
        email: body.email ?? email,
        phone,
        gender: body.gender ?? null,
        date_of_birth: body.date_of_birth ?? null,
        blood_group: body.blood_group ?? null,
      })
      .select("id")
      .single();

    if (insErr) throw insErr;

    return NextResponse.json({
      success: true,
      patient_id: newPatient.id,
      user_id: userId,
      created: true,
    });
  } catch (e: any) {
    return NextResponse.json(
      { error: e?.message || "Server error" },
      { status: 500 }
    );
  }
}