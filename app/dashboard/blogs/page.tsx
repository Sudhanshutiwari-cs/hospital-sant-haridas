"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Plus,
  Search,
  Pencil,
  Trash2,
  X,
  Save,
  Eye,
  EyeOff,
  Loader2,
  AlertCircle,
  CheckCircle2,
  Star,
  StarOff,
  FileText,
  Filter,
  RefreshCw,
} from "lucide-react";

// ── Types ─────────────────────────────────────────────────────────────────────

type BlogStatus = "draft" | "published" | "archived";

type Blog = {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string;
  category: string | null;
  specialty: string | null;
  tags: string[] | null;
  author_name: string | null;
  author_role: string | null;
  featured_image: string | null;
  featured_image_alt: string | null;
  reading_time: number | null;
  status: BlogStatus;
  published_at: string | null;
  is_featured: boolean;
  display_order: number | null;
  meta_title: string | null;
  meta_description: string | null;
  keywords: string[] | null;
  canonical_url: string | null;
  views: number;
  created_at: string;
  updated_at: string;
  banner_title?: string | null;
  banner_subtitle?: string | null;
};

type FormState = {
  id?: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  category: string;
  specialty: string;
  tags: string;
  author_name: string;
  author_role: string;
  featured_image: string;
  featured_image_alt: string;
  reading_time: string;
  status: BlogStatus;
  is_featured: boolean;
  display_order: string;
  meta_title: string;
  meta_description: string;
  keywords: string;
  canonical_url: string;
  banner_title: string;
  banner_subtitle: string;
};

const EMPTY_FORM: FormState = {
  title: "",
  slug: "",
  excerpt: "",
  content: "",
  category: "",
  specialty: "",
  tags: "",
  author_name: "",
  author_role: "",
  featured_image: "",
  featured_image_alt: "",
  reading_time: "",
  status: "draft",
  is_featured: false,
  display_order: "0",
  meta_title: "",
  meta_description: "",
  keywords: "",
  canonical_url: "",
  banner_title: "",
  banner_subtitle: "",
};

// ── Helpers ───────────────────────────────────────────────────────────────────

function slugify(input: string) {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

function fmtDate(iso: string | null) {
  if (!iso) return "—";
  try {
    return new Date(iso).toLocaleDateString("en-IN", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  } catch {
    return "—";
  }
}

function csvToArr(s: string): string[] {
  return s
    .split(",")
    .map((x) => x.trim())
    .filter(Boolean);
}

function blogToForm(b: Blog): FormState {
  return {
    id: b.id,
    title: b.title ?? "",
    slug: b.slug ?? "",
    excerpt: b.excerpt ?? "",
    content: b.content ?? "",
    category: b.category ?? "",
    specialty: b.specialty ?? "",
    tags: (b.tags ?? []).join(", "),
    author_name: b.author_name ?? "",
    author_role: b.author_role ?? "",
    featured_image: b.featured_image ?? "",
    featured_image_alt: b.featured_image_alt ?? "",
    reading_time: b.reading_time != null ? String(b.reading_time) : "",
    status: (b.status as BlogStatus) ?? "draft",
    is_featured: !!b.is_featured,
    display_order: b.display_order != null ? String(b.display_order) : "0",
    meta_title: b.meta_title ?? "",
    meta_description: b.meta_description ?? "",
    keywords: (b.keywords ?? []).join(", "),
    canonical_url: b.canonical_url ?? "",
    banner_title: b.banner_title ?? "",
    banner_subtitle: b.banner_subtitle ?? "",
  };
}

// ── Small UI primitives ───────────────────────────────────────────────────────

function Badge({ status }: { status: BlogStatus }) {
  const map: Record<BlogStatus, string> = {
    draft: "bg-amber-100 text-amber-800 border-amber-200",
    published: "bg-emerald-100 text-emerald-800 border-emerald-200",
    archived: "bg-gray-200 text-gray-700 border-gray-300",
  };
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold border ${map[status]}`}>
      {status}
    </span>
  );
}

function Toast({
  kind,
  message,
  onClose,
}: {
  kind: "success" | "error";
  message: string;
  onClose: () => void;
}) {
  return (
    <div
      className={`fixed bottom-6 right-6 z-[100] flex items-start gap-3 px-4 py-3 rounded-lg shadow-xl border max-w-sm ${
        kind === "success"
          ? "bg-emerald-50 border-emerald-200 text-emerald-800"
          : "bg-red-50 border-red-200 text-red-800"
      }`}
      role="status"
    >
      {kind === "success" ? (
        <CheckCircle2 className="w-5 h-5 flex-shrink-0 mt-0.5" />
      ) : (
        <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
      )}
      <p className="text-[13px] flex-1">{message}</p>
      <button onClick={onClose} className="opacity-70 hover:opacity-100">
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}

// ── Editor Modal ──────────────────────────────────────────────────────────────

function EditorModal({
  open,
  initial,
  onClose,
  onSaved,
}: {
  open: boolean;
  initial: FormState | null;
  onClose: () => void;
  onSaved: () => void;
}) {
  const [form, setForm] = useState<FormState>(initial ?? EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [slugTouched, setSlugTouched] = useState(false);

  useEffect(() => {
    if (open) {
      setForm(initial ?? EMPTY_FORM);
      setError(null);
      setSlugTouched(!!initial?.slug);
    }
  }, [open, initial]);

  const set = <K extends keyof FormState>(k: K, v: FormState[K]) =>
    setForm((f) => ({ ...f, [k]: v }));

  const handleTitleChange = (v: string) => {
    set("title", v);
    if (!slugTouched) set("slug", slugify(v));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!form.title.trim()) return setError("Title is required");
    if (!form.content.trim()) return setError("Content is required");

    setSaving(true);
    try {
      const payload = {
        title: form.title.trim(),
        slug: form.slug.trim() || slugify(form.title),
        excerpt: form.excerpt.trim() || null,
        content: form.content,
        category: form.category.trim() || null,
        specialty: form.specialty.trim() || null,
        tags: csvToArr(form.tags),
        author_name: form.author_name.trim() || null,
        author_role: form.author_role.trim() || null,
        featured_image: form.featured_image.trim() || null,
        featured_image_alt: form.featured_image_alt.trim() || null,
        reading_time: form.reading_time ? Number(form.reading_time) : null,
        status: form.status,
        is_featured: form.is_featured,
        display_order: form.display_order ? Number(form.display_order) : 0,
        meta_title: form.meta_title.trim() || null,
        meta_description: form.meta_description.trim() || null,
        keywords: csvToArr(form.keywords),
        canonical_url: form.canonical_url.trim() || null,
        banner_title: form.banner_title.trim() || null,
        banner_subtitle: form.banner_subtitle.trim() || null,
      };

      const isEdit = !!form.id;
      const url = isEdit
        ? `/api/admin/blogs?id=${encodeURIComponent(form.id!)}`
        : `/api/admin/blogs`;
      const method = isEdit ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json?.error || "Failed to save");
      onSaved();
      onClose();
    } catch (e: any) {
      setError(e?.message || "Something went wrong");
    } finally {
      setSaving(false);
    }
  };

  if (!open) return null;

  const inputCls =
    "w-full px-3 py-2 text-[13px] border border-gray-300 rounded-lg bg-white outline-none focus:border-[#1a9fa8] focus:ring-2 focus:ring-[#1a9fa8]/20 transition";
  const labelCls =
    "block text-[12px] font-semibold text-gray-700 mb-1.5";

  return (
    <div className="fixed inset-0 z-[90] bg-black/50 backdrop-blur-sm flex items-start justify-center overflow-y-auto p-4">
      <form
        onSubmit={handleSubmit}
        className="bg-white w-full max-w-[900px] rounded-xl shadow-2xl my-8"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 sticky top-0 bg-white rounded-t-xl z-10">
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-[#1a9fa8]" />
            <h2 className="text-[16px] font-bold text-[#1a3a5c]">
              {form.id ? "Edit Blog" : "New Blog"}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-gray-100 text-gray-500"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Title */}
          <div className="md:col-span-2">
            <label className={labelCls}>Title *</label>
            <input
              className={inputCls}
              value={form.title}
              onChange={(e) => handleTitleChange(e.target.value)}
              placeholder="e.g. World Lung Cancer Day 2026"
            />
          </div>

          {/* Slug */}
          <div className="md:col-span-2">
            <label className={labelCls}>Slug *</label>
            <input
              className={inputCls}
              value={form.slug}
              onChange={(e) => {
                setSlugTouched(true);
                set("slug", e.target.value);
              }}
              placeholder="world-lung-cancer-day-2026"
            />
            <p className="text-[11px] text-gray-500 mt-1">
              URL: /blogs/{form.slug || "your-slug"}
            </p>
          </div>

          {/* Excerpt */}
          <div className="md:col-span-2">
            <label className={labelCls}>Excerpt</label>
            <textarea
              className={inputCls + " min-h-[70px]"}
              value={form.excerpt}
              onChange={(e) => set("excerpt", e.target.value)}
              placeholder="Short summary shown on the blog card..."
            />
          </div>

          {/* Content */}
          <div className="md:col-span-2">
            <label className={labelCls}>Content * (Markdown supported)</label>
            <textarea
              className={inputCls + " min-h-[220px] font-mono text-[12.5px]"}
              value={form.content}
              onChange={(e) => set("content", e.target.value)}
              placeholder={"## Heading\n\nYour blog content here..."}
            />
          </div>

          {/* Banner */}
          <div>
            <label className={labelCls}>Banner Title</label>
            <textarea
              className={inputCls + " min-h-[60px]"}
              value={form.banner_title}
              onChange={(e) => set("banner_title", e.target.value)}
              placeholder={"WORLD LUNG\nCANCER DAY"}
            />
          </div>
          <div>
            <label className={labelCls}>Banner Subtitle</label>
            <textarea
              className={inputCls + " min-h-[60px]"}
              value={form.banner_subtitle}
              onChange={(e) => set("banner_subtitle", e.target.value)}
              placeholder={"United for Awareness,\nPrevention and Early Detection"}
            />
          </div>

          {/* Author */}
          <div>
            <label className={labelCls}>Author Name</label>
            <input
              className={inputCls}
              value={form.author_name}
              onChange={(e) => set("author_name", e.target.value)}
              placeholder="Dr. Kamran Ali"
            />
          </div>
          <div>
            <label className={labelCls}>Author Role / Specialty</label>
            <input
              className={inputCls}
              value={form.author_role}
              onChange={(e) => set("author_role", e.target.value)}
              placeholder="Lung Transplant Thoracic Surgery"
            />
          </div>

          {/* Category / Specialty */}
          <div>
            <label className={labelCls}>Category</label>
            <input
              className={inputCls}
              value={form.category}
              onChange={(e) => set("category", e.target.value)}
              placeholder="Oncology"
            />
          </div>
          <div>
            <label className={labelCls}>Specialty (for filter chips)</label>
            <input
              className={inputCls}
              value={form.specialty}
              onChange={(e) => set("specialty", e.target.value)}
              placeholder="Oncology"
            />
          </div>

          {/* Image */}
          <div>
            <label className={labelCls}>Featured Image URL</label>
            <input
              className={inputCls}
              value={form.featured_image}
              onChange={(e) => set("featured_image", e.target.value)}
              placeholder="https://..."
            />
          </div>
          <div>
            <label className={labelCls}>Featured Image Alt</label>
            <input
              className={inputCls}
              value={form.featured_image_alt}
              onChange={(e) => set("featured_image_alt", e.target.value)}
              placeholder="Describe the image"
            />
          </div>

          {/* Tags / Keywords */}
          <div className="md:col-span-2">
            <label className={labelCls}>Tags (comma separated)</label>
            <input
              className={inputCls}
              value={form.tags}
              onChange={(e) => set("tags", e.target.value)}
              placeholder="lung cancer, oncology, screening"
            />
          </div>
          <div className="md:col-span-2">
            <label className={labelCls}>SEO Keywords (comma separated)</label>
            <input
              className={inputCls}
              value={form.keywords}
              onChange={(e) => set("keywords", e.target.value)}
              placeholder="lung cancer, early detection"
            />
          </div>

          {/* Meta */}
          <div className="md:col-span-2">
            <label className={labelCls}>Meta Title</label>
            <input
              className={inputCls}
              value={form.meta_title}
              onChange={(e) => set("meta_title", e.target.value)}
            />
          </div>
          <div className="md:col-span-2">
            <label className={labelCls}>Meta Description</label>
            <textarea
              className={inputCls + " min-h-[60px]"}
              value={form.meta_description}
              onChange={(e) => set("meta_description", e.target.value)}
            />
          </div>
          <div className="md:col-span-2">
            <label className={labelCls}>Canonical URL</label>
            <input
              className={inputCls}
              value={form.canonical_url}
              onChange={(e) => set("canonical_url", e.target.value)}
              placeholder="https://santharidashospital.com/blogs/..."
            />
          </div>

          {/* Row: reading time / order / status */}
          <div>
            <label className={labelCls}>Reading Time (min)</label>
            <input
              type="number"
              min={0}
              className={inputCls}
              value={form.reading_time}
              onChange={(e) => set("reading_time", e.target.value)}
            />
          </div>
          <div>
            <label className={labelCls}>Display Order</label>
            <input
              type="number"
              className={inputCls}
              value={form.display_order}
              onChange={(e) => set("display_order", e.target.value)}
            />
          </div>

          <div>
            <label className={labelCls}>Status</label>
            <select
              className={inputCls}
              value={form.status}
              onChange={(e) => set("status", e.target.value as BlogStatus)}
            >
              <option value="draft">Draft</option>
              <option value="published">Published</option>
              <option value="archived">Archived</option>
            </select>
          </div>

          <div className="flex items-end">
            <label className="inline-flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                className="w-4 h-4 accent-[#1a9fa8]"
                checked={form.is_featured}
                onChange={(e) => set("is_featured", e.target.checked)}
              />
              <span className="text-[13px] text-gray-700">Mark as Featured</span>
            </label>
          </div>

          {error && (
            <div className="md:col-span-2 flex items-start gap-2 text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2 text-[13px]">
              <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
              {error}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-200 bg-gray-50 rounded-b-xl">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-[13px] font-semibold rounded-lg border border-gray-300 text-gray-700 hover:bg-white"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center gap-2 px-5 py-2 text-[13px] font-semibold rounded-lg bg-[#1a9fa8] text-white hover:bg-[#158089] disabled:opacity-60"
          >
            {saving ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Save className="w-4 h-4" />
            )}
            {form.id ? "Update" : "Create"}
          </button>
        </div>
      </form>
    </div>
  );
}

// ── Confirm Delete Modal ──────────────────────────────────────────────────────

function ConfirmModal({
  open,
  title,
  message,
  confirmLabel = "Delete",
  onConfirm,
  onClose,
  loading,
}: {
  open: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  onConfirm: () => void;
  onClose: () => void;
  loading?: boolean;
}) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[95] bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-[420px] rounded-xl shadow-2xl p-5">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0">
            <AlertCircle className="w-5 h-5 text-red-600" />
          </div>
          <div className="flex-1">
            <h3 className="text-[15px] font-bold text-[#1a3a5c]">{title}</h3>
            <p className="text-[13px] text-gray-600 mt-1">{message}</p>
          </div>
        </div>
        <div className="flex justify-end gap-2 mt-5">
          <button
            onClick={onClose}
            className="px-4 py-2 text-[13px] font-semibold rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className="inline-flex items-center gap-2 px-4 py-2 text-[13px] font-semibold rounded-lg bg-red-600 text-white hover:bg-red-700 disabled:opacity-60"
          >
            {loading && <Loader2 className="w-4 h-4 animate-spin" />}
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────

export default function AdminBlogsPage() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | BlogStatus>("all");
  const [sortBy, setSortBy] = useState<"created" | "updated" | "title" | "views">(
    "created"
  );

  const [editorOpen, setEditorOpen] = useState(false);
  const [editorInitial, setEditorInitial] = useState<FormState | null>(null);

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Blog | null>(null);
  const [deleting, setDeleting] = useState(false);

  const [toast, setToast] = useState<{
    kind: "success" | "error";
    message: string;
  } | null>(null);

  const showToast = (kind: "success" | "error", message: string) => {
    setToast({ kind, message });
    setTimeout(() => setToast(null), 3500);
  };

  const fetchBlogs = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/blogs", { cache: "no-store" });
      const json = await res.json();
      if (!res.ok) throw new Error(json?.error || "Failed to load blogs");
      setBlogs(json.blogs || []);
    } catch (e: any) {
      setError(e?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBlogs();
  }, [fetchBlogs]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    let list = blogs.filter((b) => {
      const matchesQ =
        !q ||
        b.title.toLowerCase().includes(q) ||
        b.slug.toLowerCase().includes(q) ||
        (b.author_name ?? "").toLowerCase().includes(q) ||
        (b.category ?? "").toLowerCase().includes(q) ||
        (b.specialty ?? "").toLowerCase().includes(q);
      const matchesStatus = statusFilter === "all" || b.status === statusFilter;
      return matchesQ && matchesStatus;
    });

    list = [...list].sort((a, b) => {
      switch (sortBy) {
        case "updated":
          return (b.updated_at || "").localeCompare(a.updated_at || "");
        case "title":
          return a.title.localeCompare(b.title);
        case "views":
          return (b.views || 0) - (a.views || 0);
        case "created":
        default:
          return (b.created_at || "").localeCompare(a.created_at || "");
      }
    });

    return list;
  }, [blogs, query, statusFilter, sortBy]);

  const stats = useMemo(() => {
    const total = blogs.length;
    const published = blogs.filter((b) => b.status === "published").length;
    const draft = blogs.filter((b) => b.status === "draft").length;
    const archived = blogs.filter((b) => b.status === "archived").length;
    const featured = blogs.filter((b) => b.is_featured).length;
    return { total, published, draft, archived, featured };
  }, [blogs]);

  const openCreate = () => {
    setEditorInitial(null);
    setEditorOpen(true);
  };

  const openEdit = (b: Blog) => {
    setEditorInitial(blogToForm(b));
    setEditorOpen(true);
  };

  const askDelete = (b: Blog) => {
    setDeleteTarget(b);
    setConfirmOpen(true);
  };

  const doDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      const res = await fetch(
        `/api/admin/blogs?id=${encodeURIComponent(deleteTarget.id)}`,
        { method: "DELETE" }
      );
      const json = await res.json();
      if (!res.ok) throw new Error(json?.error || "Failed to delete");
      showToast("success", "Blog deleted");
      setConfirmOpen(false);
      setDeleteTarget(null);
      fetchBlogs();
    } catch (e: any) {
      showToast("error", e?.message || "Delete failed");
    } finally {
      setDeleting(false);
    }
  };

  const toggleStatus = async (b: Blog) => {
    const next: BlogStatus = b.status === "published" ? "draft" : "published";
    try {
      const res = await fetch(
        `/api/admin/blogs?id=${encodeURIComponent(b.id)}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status: next }),
        }
      );
      const json = await res.json();
      if (!res.ok) throw new Error(json?.error || "Failed to update");
      showToast("success", `Blog marked as ${next}`);
      fetchBlogs();
    } catch (e: any) {
      showToast("error", e?.message || "Update failed");
    }
  };

  const toggleFeatured = async (b: Blog) => {
    try {
      const res = await fetch(
        `/api/admin/blogs?id=${encodeURIComponent(b.id)}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ is_featured: !b.is_featured }),
        }
      );
      const json = await res.json();
      if (!res.ok) throw new Error(json?.error || "Failed to update");
      showToast("success", b.is_featured ? "Removed from featured" : "Marked as featured");
      fetchBlogs();
    } catch (e: any) {
      showToast("error", e?.message || "Update failed");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-[1400px] mx-auto px-6 py-5 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-[#1a9fa8] flex items-center justify-center">
              <FileText className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-[18px] font-bold text-[#1a3a5c]">
                Blog Management
              </h1>
              <p className="text-[12px] text-gray-500">
                Create, edit, publish and organize your hospital blogs.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={fetchBlogs}
              className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-gray-300 text-[13px] font-semibold text-gray-700 hover:bg-gray-50"
            >
              <RefreshCw className="w-4 h-4" />
              Refresh
            </button>
            <button
              onClick={openCreate}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#1a9fa8] hover:bg-[#158089] text-white text-[13px] font-semibold"
            >
              <Plus className="w-4 h-4" />
              New Blog
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-[1400px] mx-auto px-6 py-6">
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-6">
          {[
            { label: "Total", value: stats.total, color: "text-[#1a3a5c]" },
            { label: "Published", value: stats.published, color: "text-emerald-600" },
            { label: "Draft", value: stats.draft, color: "text-amber-600" },
            { label: "Archived", value: stats.archived, color: "text-gray-600" },
            { label: "Featured", value: stats.featured, color: "text-[#e07234]" },
          ].map((s) => (
            <div
              key={s.label}
              className="bg-white border border-gray-200 rounded-xl px-4 py-3"
            >
              <p className="text-[11px] font-semibold text-gray-500 uppercase tracking-wide">
                {s.label}
              </p>
              <p className={`text-[22px] font-bold ${s.color}`}>{s.value}</p>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div className="bg-white border border-gray-200 rounded-xl p-4 mb-4 flex flex-col md:flex-row md:items-center gap-3">
          <div className="flex-1 flex items-center gap-2 px-3 py-2 rounded-lg border border-gray-300 bg-white focus-within:border-[#1a9fa8] focus-within:ring-2 focus-within:ring-[#1a9fa8]/20">
            <Search className="w-4 h-4 text-gray-400" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by title, slug, author, category..."
              className="flex-1 text-[13px] outline-none bg-transparent"
            />
            {query && (
              <button
                onClick={() => setQuery("")}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-gray-400" />
            <select
              value={statusFilter}
              onChange={(e) =>
                setStatusFilter(e.target.value as "all" | BlogStatus)
              }
              className="text-[13px] px-3 py-2 border border-gray-300 rounded-lg bg-white outline-none focus:border-[#1a9fa8]"
            >
              <option value="all">All statuses</option>
              <option value="published">Published</option>
              <option value="draft">Draft</option>
              <option value="archived">Archived</option>
            </select>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="text-[13px] px-3 py-2 border border-gray-300 rounded-lg bg-white outline-none focus:border-[#1a9fa8]"
            >
              <option value="created">Newest first</option>
              <option value="updated">Recently updated</option>
              <option value="title">Title (A–Z)</option>
              <option value="views">Most viewed</option>
            </select>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
          {loading ? (
            <div className="p-10 flex items-center justify-center gap-2 text-gray-500">
              <Loader2 className="w-5 h-5 animate-spin" />
              <span className="text-[13px]">Loading blogs...</span>
            </div>
          ) : error ? (
            <div className="p-10 text-center">
              <AlertCircle className="w-8 h-8 text-red-500 mx-auto mb-2" />
              <p className="text-[14px] text-red-600 mb-3">{error}</p>
              <button
                onClick={fetchBlogs}
                className="text-[13px] font-semibold text-[#1a9fa8] hover:underline"
              >
                Try again
              </button>
            </div>
          ) : filtered.length === 0 ? (
            <div className="p-14 text-center">
              <FileText className="w-10 h-10 text-gray-300 mx-auto mb-3" />
              <p className="text-[14px] text-gray-500 mb-3">
                {blogs.length === 0
                  ? "No blogs yet. Create your first one!"
                  : "No blogs match your filters."}
              </p>
              <button
                onClick={openCreate}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#1a9fa8] text-white text-[13px] font-semibold"
              >
                <Plus className="w-4 h-4" />
                New Blog
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-4 py-3 text-[11px] font-bold text-gray-600 uppercase tracking-wide">
                      Blog
                    </th>
                    <th className="px-4 py-3 text-[11px] font-bold text-gray-600 uppercase tracking-wide">
                      Status
                    </th>
                    <th className="px-4 py-3 text-[11px] font-bold text-gray-600 uppercase tracking-wide">
                      Specialty
                    </th>
                    <th className="px-4 py-3 text-[11px] font-bold text-gray-600 uppercase tracking-wide">
                      Author
                    </th>
                    <th className="px-4 py-3 text-[11px] font-bold text-gray-600 uppercase tracking-wide">
                      Views
                    </th>
                    <th className="px-4 py-3 text-[11px] font-bold text-gray-600 uppercase tracking-wide">
                      Updated
                    </th>
                    <th className="px-4 py-3 text-[11px] font-bold text-gray-600 uppercase tracking-wide text-right">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((b) => (
                    <tr
                      key={b.id}
                      className="border-b border-gray-100 hover:bg-[#f8fbfb]"
                    >
                      <td className="px-4 py-3 max-w-[420px]">
                        <div className="flex items-start gap-3">
                          <div className="w-12 h-12 rounded-lg bg-gray-100 overflow-hidden flex-shrink-0 border border-gray-200">
                            {b.featured_image ? (
                              // eslint-disable-next-line @next/next/no-img-element
                              <img
                                src={b.featured_image}
                                alt={b.featured_image_alt || b.title}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-gray-300">
                                <FileText className="w-5 h-5" />
                              </div>
                            )}
                          </div>
                          <div className="min-w-0">
                            <div className="flex items-center gap-2">
                              <p className="text-[13.5px] font-semibold text-[#1a3a5c] line-clamp-1">
                                {b.title}
                              </p>
                              {b.is_featured && (
                                <Star className="w-3.5 h-3.5 text-[#e07234] flex-shrink-0" />
                              )}
                            </div>
                            <p className="text-[11.5px] text-gray-500 truncate">
                              /blogs/{b.slug}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <Badge status={b.status} />
                      </td>
                      <td className="px-4 py-3 text-[12.5px] text-gray-700">
                        {b.specialty || "—"}
                      </td>
                      <td className="px-4 py-3 text-[12.5px] text-gray-700">
                        {b.author_name || "—"}
                      </td>
                      <td className="px-4 py-3 text-[12.5px] text-gray-700">
                        {b.views ?? 0}
                      </td>
                      <td className="px-4 py-3 text-[12.5px] text-gray-700">
                        {fmtDate(b.updated_at)}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            title={
                              b.status === "published"
                                ? "Unpublish"
                                : "Publish"
                            }
                            onClick={() => toggleStatus(b)}
                            className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 hover:text-[#1a9fa8]"
                          >
                            {b.status === "published" ? (
                              <EyeOff className="w-4 h-4" />
                            ) : (
                              <Eye className="w-4 h-4" />
                            )}
                          </button>
                          <button
                            title={
                              b.is_featured
                                ? "Remove from featured"
                                : "Mark as featured"
                            }
                            onClick={() => toggleFeatured(b)}
                            className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 hover:text-[#e07234]"
                          >
                            {b.is_featured ? (
                              <Star className="w-4 h-4 fill-[#e07234] text-[#e07234]" />
                            ) : (
                              <StarOff className="w-4 h-4" />
                            )}
                          </button>
                          <button
                            title="Edit"
                            onClick={() => openEdit(b)}
                            className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 hover:text-[#1a9fa8]"
                          >
                            <Pencil className="w-4 h-4" />
                          </button>
                          <button
                            title="Delete"
                            onClick={() => askDelete(b)}
                            className="p-2 rounded-lg text-gray-500 hover:bg-red-50 hover:text-red-600"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <p className="text-[12px] text-gray-500 mt-3">
          Showing {filtered.length} of {blogs.length} blogs.
        </p>
      </main>

      {/* Editor */}
      <EditorModal
        open={editorOpen}
        initial={editorInitial}
        onClose={() => setEditorOpen(false)}
        onSaved={() => {
          showToast("success", editorInitial ? "Blog updated" : "Blog created");
          fetchBlogs();
        }}
      />

      {/* Delete confirm */}
      <ConfirmModal
        open={confirmOpen}
        title="Delete this blog?"
        message={
          deleteTarget
            ? `"${deleteTarget.title}" will be permanently removed. This action cannot be undone.`
            : ""
        }
        confirmLabel="Delete"
        onConfirm={doDelete}
        onClose={() => {
          setConfirmOpen(false);
          setDeleteTarget(null);
        }}
        loading={deleting}
      />

      {/* Toast */}
      {toast && (
        <Toast
          kind={toast.kind}
          message={toast.message}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
}