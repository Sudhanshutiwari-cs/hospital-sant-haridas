// lib/patient-auth.ts
import { supabase } from "@/lib/supabase-client";

/** Strip non-digits, drop leading zeros / country code 91. */
export function normalizePhone(input: string): string {
  const digits = (input || "").replace(/\D/g, "");
  if (digits.length === 12 && digits.startsWith("91")) return digits.slice(2);
  if (digits.length === 11 && digits.startsWith("0")) return digits.slice(1);
  return digits;
}

/** Deterministic internal email derived from the phone. */
export function phoneToEmail(phone: string): string {
  return `${normalizePhone(phone)}@patients.local`;
}

/** Load the patient row linked to the current session. */
export async function getCurrentPatient() {
  const {
    data: { session },
  } = await supabase.auth.getSession();
  if (!session?.user) return null;

  const { data, error } = await supabase
    .from("patients")
    .select("*")
    .eq("user_id", session.user.id)
    .maybeSingle();

  if (error) {
    console.error("getCurrentPatient error:", error.message);
    return null;
  }
  return data;
}

/** Sign out the patient. */
export async function signOutPatient() {
  await supabase.auth.signOut();
}