// app/api/admin/blogs/route.ts
import { NextRequest, NextResponse } from "next/server";
import { createClient, SupabaseClient } from "@supabase/supabase-js";

// ── Lazy singleton (never throws at module load) ─────────────────────────────
let _supabase: SupabaseClient | null = null;

function getSupabase(): SupabaseClient {
  if (_supabase) return _supabase;

  const url =
    process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key =
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !key) {
    throw new Error(
      "Missing SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY env variables"
    );
  }

  _supabase = createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
  return _supabase;
}

type BlogPayload = {
  title?: string;
  slug?: string;
  excerpt?: string | null;
  content?: string;
  category?: string | null;
  specialty?: string | null;
  tags?: string[] | null;
  author_name?: string | null;
  author_role?: string | null;
  featured_image?: string | null;
  featured_image_alt?: string | null;
  reading_time?: number | null;
  status?: "draft" | "published" | "archived";
  published_at?: string | null;
  is_featured?: boolean;
  display_order?: number | null;
  meta_title?: string | null;
  meta_description?: string | null;
  keywords?: string[] | null;
  canonical_url?: string | null;
  banner_title?: string | null;
  banner_subtitle?: string | null;
};

function slugify(input: string) {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

function sanitizePayload(body: BlogPayload): BlogPayload {
  const out: BlogPayload = { ...body };
  if (typeof out.title === "string") out.title = out.title.trim();
  if (typeof out.slug === "string" && out.slug.trim()) out.slug = slugify(out.slug);
  else if (typeof out.title === "string") out.slug = slugify(out.title);

  if (out.tags && !Array.isArray(out.tags)) out.tags = [];
  if (out.keywords && !Array.isArray(out.keywords)) out.keywords = [];

  if (out.reading_time !== undefined && out.reading_time !== null) {
    const n = Number(out.reading_time);
    out.reading_time = Number.isFinite(n) ? Math.max(0, Math.round(n)) : null;
  }
  if (out.display_order !== undefined && out.display_order !== null) {
    const n = Number(out.display_order);
    out.display_order = Number.isFinite(n) ? Math.round(n) : 0;
  }

  if (out.status === "published" && !out.published_at) {
    out.published_at = new Date().toISOString();
  }

  return out;
}

// ── GET ──────────────────────────────────────────────────────────────────────
export async function GET(req: NextRequest) {
  try {
    const supabase = getSupabase();
    const id = req.nextUrl.searchParams.get("id");

    if (id) {
      const { data, error } = await supabase
        .from("blogs")
        .select("*")
        .eq("id", id)
        .maybeSingle();
      if (error) return NextResponse.json({ error: error.message }, { status: 400 });
      if (!data) return NextResponse.json({ error: "Not found" }, { status: 404 });
      return NextResponse.json({ blog: data });
    }

    const { data, error } = await supabase
      .from("blogs")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json({ blogs: data ?? [] });
  } catch (e: any) {
    return NextResponse.json(
      { error: e?.message || "Server error" },
      { status: 500 }
    );
  }
}

// ── POST ─────────────────────────────────────────────────────────────────────
export async function POST(req: NextRequest) {
  try {
    const supabase = getSupabase();
    const body = (await req.json()) as BlogPayload;
    if (!body.title || !body.content) {
      return NextResponse.json(
        { error: "title and content are required" },
        { status: 400 }
      );
    }
    const payload = sanitizePayload(body);
    const { data, error } = await supabase
      .from("blogs")
      .insert(payload)
      .select("*")
      .single();

    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json({ blog: data }, { status: 201 });
  } catch (e: any) {
    return NextResponse.json(
      { error: e?.message || "Server error" },
      { status: 500 }
    );
  }
}

// ── PUT ──────────────────────────────────────────────────────────────────────
export async function PUT(req: NextRequest) {
  try {
    const supabase = getSupabase();
    const id = req.nextUrl.searchParams.get("id");
    if (!id) return NextResponse.json({ error: "id is required" }, { status: 400 });

    const body = (await req.json()) as BlogPayload;
    const payload = sanitizePayload(body);

    delete (payload as any).id;
    delete (payload as any).created_at;
    delete (payload as any).views;

    const { data, error } = await supabase
      .from("blogs")
      .update(payload)
      .eq("id", id)
      .select("*")
      .single();

    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json({ blog: data });
  } catch (e: any) {
    return NextResponse.json(
      { error: e?.message || "Server error" },
      { status: 500 }
    );
  }
}

// ── DELETE ───────────────────────────────────────────────────────────────────
export async function DELETE(req: NextRequest) {
  try {
    const supabase = getSupabase();
    const id = req.nextUrl.searchParams.get("id");
    if (!id) return NextResponse.json({ error: "id is required" }, { status: 400 });

    const { error } = await supabase.from("blogs").delete().eq("id", id);
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json({ success: true });
  } catch (e: any) {
    return NextResponse.json(
      { error: e?.message || "Server error" },
      { status: 500 }
    );
  }
}