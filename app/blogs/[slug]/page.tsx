"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase-client";

// ── Shared TopBar ─────────────────────────────────────────────────────────────

function TopBar() {
  return (
    <div className="w-full bg-[#1a9fa8] text-white text-[11px] sm:text-[12px]">
      <div className="max-w-[1200px] mx-auto px-3 sm:px-4 flex items-center justify-center sm:justify-between h-9 gap-3 sm:gap-4">
        <nav className="hidden sm:flex items-center gap-5"></nav>
        <div className="flex items-center gap-3 sm:gap-4">
          <a
            href="https://wa.me/919540740947"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 hover:underline whitespace-nowrap"
          >
            <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
              <path d="M11.998 2C6.477 2 2 6.477 2 12c0 1.82.487 3.53 1.338 5.01L2 22l5.118-1.318C8.578 21.527 10.248 22 11.998 22 17.523 22 22 17.523 22 12S17.523 2 11.998 2z" />
            </svg>
            <span className="hidden xs:inline">WhatsApp Us</span>
            <span className="xs:hidden">WhatsApp</span>
          </a>
          <a href="tel:+919540740947" className="flex items-center gap-1.5 hover:underline whitespace-nowrap">
            <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.81 19.79 19.79 0 01.01 1.17 2 2 0 012 0h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.09 7.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 14.92v2z" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <span className="hidden sm:inline">+91 95407 40947</span>
            <span className="sm:hidden">Call</span>
          </a>
        </div>
      </div>
    </div>
  );
}

// ── Shared MainNav ────────────────────────────────────────────────────────────

const navItems = [
  { label: "Doctors", href: "/doctors" },
  { label: "Services", href: "/services" },
  { label: "Blogs", href: "/blogs" },
  { label: "About Us", href: "/about" },
  { label: "Contact Us", href: "/contact" },
];

function MenuIcon({ open }: { open: boolean }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-[#1a3a5c]">
      {open ? (
        <path d="M6 6l12 12M6 18L18 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      ) : (
        <path d="M4 7h16M4 12h16M4 17h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      )}
    </svg>
  );
}

function MainNav() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="w-full bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-[1200px] mx-auto px-3 sm:px-4 flex items-center justify-between h-14 sm:h-16 gap-3">
        <Link href="/" className="flex items-center gap-2 flex-shrink-0">
          <img
            src="https://res.cloudinary.com/df01whs60/image/upload/v1785656956/Sant_haridas_hospital_logo_page-0001_vu9ssi.jpg"
            alt="Sant Haridas Hospital"
            className="h-9 sm:h-10 md:h-12 w-auto object-contain"
          />
        </Link>

        <nav className="hidden lg:flex items-center gap-4 xl:gap-6">
          {navItems.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className="text-[14px] font-medium text-gray-700 hover:text-[#1a9fa8] transition-colors"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2 sm:gap-3">
          <Link
            href="/doctors"
            className="hidden md:inline-flex items-center bg-[#e07234] hover:bg-[#c5602a] text-white text-[12px] sm:text-[13px] font-bold px-3 sm:px-4 py-2 rounded transition-colors whitespace-nowrap"
          >
            Book an Appointment
          </Link>

          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="lg:hidden p-2 -mr-1"
            aria-label="Toggle menu"
            aria-expanded={mobileOpen}
          >
            <MenuIcon open={mobileOpen} />
          </button>
        </div>
      </div>

      {mobileOpen && (
        <nav className="lg:hidden bg-white border-t border-gray-100 shadow-md">
          <div className="max-w-[1200px] mx-auto px-3 sm:px-4 py-2 flex flex-col">
            {navItems.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className="py-3 px-2 text-[15px] font-semibold text-gray-700 hover:text-[#1a9fa8] border-b border-gray-50 last:border-0 transition-colors"
              >
                {item.label}
              </Link>
            ))}
            <Link
              href="/doctors"
              onClick={() => setMobileOpen(false)}
              className="mt-3 mb-2 bg-[#e07234] hover:bg-[#c5602a] text-white font-semibold text-sm px-5 py-2.5 rounded transition-colors text-center"
            >
              Book an Appointment
            </Link>
          </div>
        </nav>
      )}
    </header>
  );
}

// ── Types ─────────────────────────────────────────────────────────────────────

type BlogRow = {
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
  status: "draft" | "published" | "archived";
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
  banner_title: string | null;
  banner_subtitle: string | null;
};

type RelatedPost = {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  image: string;
  imageAlt: string;
  date: string;
  readTime: string;
};

// ── Constants ─────────────────────────────────────────────────────────────────

const FALLBACK_IMAGE =
  "https://res.cloudinary.com/df01whs60/image/upload/v1785656956/Sant_haridas_hospital_logo_page-0001_vu9ssi.jpg";

// ── Helpers ───────────────────────────────────────────────────────────────────

function formatDate(iso: string | null): string {
  if (!iso) return "";
  try {
    return new Date(iso).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  } catch {
    return "";
  }
}

function readingTimeFromContent(content: string, fallback: number | null): string {
  if (fallback && fallback > 0) return `${fallback} min read`;
  const words = content.replace(/<[^>]*>/g, " ").trim().split(/\s+/).filter(Boolean).length;
  const minutes = Math.max(1, Math.round(words / 200));
  return `${minutes} min read`;
}

// Very light HTML sanitizer: strips scripts/styles/event handlers/javascript: URLs.
// For untrusted content, replace with DOMPurify.
function sanitizeHtml(html: string): string {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, "")
    .replace(/<style[\s\S]*?<\/style>/gi, "")
    .replace(/\son\w+\s*=\s*"[^"]*"/gi, "")
    .replace(/\son\w+\s*=\s*'[^']*'/gi, "")
    .replace(/javascript:/gi, "");
}

// ── Skeleton ──────────────────────────────────────────────────────────────────

function ArticleSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="h-4 bg-gray-200 rounded w-40 mb-6" />
      <div className="h-8 sm:h-10 bg-gray-200 rounded w-11/12 mb-3" />
      <div className="h-8 sm:h-10 bg-gray-200 rounded w-7/12 mb-6" />
      <div className="flex items-center gap-3 mb-8">
        <div className="w-11 h-11 rounded-full bg-gray-200" />
        <div className="flex flex-col gap-2">
          <div className="h-3 bg-gray-200 rounded w-40" />
          <div className="h-3 bg-gray-200 rounded w-28" />
        </div>
      </div>
      <div className="rounded-xl bg-gray-200 w-full" style={{ height: 360 }} />
      <div className="mt-8 flex flex-col gap-3">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="h-4 bg-gray-200 rounded w-full" />
        ))}
      </div>
    </div>
  );
}

// ── Related Card ──────────────────────────────────────────────────────────────

function RelatedCard({ post }: { post: RelatedPost }) {
  return (
    <Link href={`/blogs/${post.slug}`} className="group flex flex-col">
      <div className="relative rounded-xl overflow-hidden bg-gray-100" style={{ height: 160 }}>
        <Image
          src={post.image}
          alt={post.imageAlt}
          fill
          sizes="(max-width: 768px) 100vw, 340px"
          className="object-cover object-center group-hover:scale-105 transition-transform duration-300"
          unoptimized
        />
      </div>
      <div className="mt-3 flex flex-col gap-2 flex-1">
        <h3 className="text-[14px] sm:text-[15px] font-bold text-[#1a3a5c] leading-snug group-hover:text-[#1a9fa8] transition-colors line-clamp-2">
          {post.title}
        </h3>
        <p className="text-[12px] sm:text-[13px] text-gray-600 leading-relaxed line-clamp-2">
          {post.excerpt}
        </p>
        <div className="flex items-center gap-2 text-[11px] sm:text-[12px] text-gray-500 mt-auto pt-1">
          <span>{post.date}</span>
          {post.readTime && (
            <>
              <span className="text-gray-300">|</span>
              <span>{post.readTime}</span>
            </>
          )}
        </div>
      </div>
    </Link>
  );
}

// ── Footer ────────────────────────────────────────────────────────────────────

const socialLinks = [
  {
    label: "Instagram",
    href: "https://www.instagram.com/santharidashospital?stkn=MWN5bDAycm9qc2Zqag==",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="w-4 h-4 sm:w-5 sm:h-5" xmlns="http://www.w3.org/2000/svg">
        <rect x="2" y="2" width="20" height="20" rx="6" stroke="url(#ig-blog-detail)" strokeWidth="1.8" />
        <circle cx="12" cy="12" r="4.5" stroke="url(#ig-blog-detail)" strokeWidth="1.8" />
        <circle cx="17.5" cy="6.5" r="1" fill="url(#ig-blog-detail)" />
        <defs>
          <linearGradient id="ig-blog-detail" x1="2" y1="22" x2="22" y2="2" gradientUnits="userSpaceOnUse">
            <stop stopColor="#f09433" /><stop offset="0.25" stopColor="#e6683c" />
            <stop offset="0.5" stopColor="#dc2743" /><stop offset="0.75" stopColor="#cc2366" />
            <stop offset="1" stopColor="#bc1888" />
          </linearGradient>
        </defs>
      </svg>
    ),
  },
  {
    label: "Facebook",
    href: "https://www.facebook.com/100090027224112/",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="w-4 h-4 sm:w-5 sm:h-5" xmlns="http://www.w3.org/2000/svg">
        <path d="M17 2h-3a5 5 0 00-5 5v3H6v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z" stroke="#1877f2" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    label: "YouTube",
    href: "http://www.youtube.com/@SantHaridashospital",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="w-4 h-4 sm:w-5 sm:h-5" xmlns="http://www.w3.org/2000/svg">
        <rect x="2" y="5" width="20" height="14" rx="4" stroke="#ff0000" strokeWidth="1.8" />
        <path d="M10 9l5 3-5 3V9z" fill="#ff0000" />
      </svg>
    ),
  },
];

function BlogsFooter() {
  return (
    <footer className="w-full bg-[#f0faf5] border-t border-gray-200">
      <div className="w-full" style={{ height: 180 }}>
        <iframe
          title="Sant Haridas Hospital Location"
          src="https://www.google.com/maps?q=Sant+Haridas+Hospital,+Ram+Nagar,+Najafgarh,+Delhi+110043&output=embed"
          width="100%"
          height="180"
          style={{ border: 0, display: "block" }}
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        />
      </div>
      <div className="max-w-[1200px] mx-auto px-3 sm:px-4 py-5 flex flex-col lg:flex-row items-center justify-between gap-5 lg:gap-4">
        <div className="flex items-center gap-2 flex-shrink-0">
          <img
            src="https://res.cloudinary.com/df01whs60/image/upload/v1785656956/Sant_haridas_hospital_logo_page-0001_vu9ssi.jpg"
            alt="Sant Haridas Hospital"
            className="h-8 sm:h-10 w-auto object-contain"
          />
        </div>
        <div className="flex flex-col items-center gap-3 order-last lg:order-none">
          <p className="text-[10px] sm:text-[11px] font-bold tracking-widest text-[#1a3a5c] uppercase">Stay in Touch</p>
          <div className="flex items-center gap-2 sm:gap-3">
            {socialLinks.map((s) => (
              <a
                key={s.label}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={s.label}
                className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white shadow-sm border border-gray-100 flex items-center justify-center hover:shadow-md transition-shadow"
              >
                {s.icon}
              </a>
            ))}
          </div>
          <p className="text-[11px] sm:text-[12px] text-gray-500 text-center">
            &copy; {new Date().getFullYear()} Sant Haridas Hospital. All Rights Reserved.
          </p>
        </div>
        <div className="flex flex-col items-center lg:items-end gap-1.5 text-center lg:text-right">
          <p className="text-[11px] sm:text-[12px] font-semibold text-[#1a3a5c]">Emergency Helpline</p>
          <a href="tel:+919540740947" className="text-[14px] sm:text-[15px] font-bold text-[#1a9fa8] hover:text-[#1a3a5c] transition-colors">
            +91 95407 40947
          </a>
          <Link
            href="/doctors"
            className="mt-1 inline-flex items-center gap-1.5 bg-[#1a3a5c] text-white text-[11px] sm:text-[12px] font-semibold px-4 py-2 rounded hover:bg-[#122b47] transition-colors"
          >
            Book an Appointment
          </Link>
        </div>
      </div>
    </footer>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function BlogDetailPage() {
  const params = useParams();
  const router = useRouter();
  const slug = typeof params?.slug === "string" ? params.slug : Array.isArray(params?.slug) ? params.slug[0] : "";

  const [post, setPost] = useState<BlogRow | null>(null);
  const [related, setRelated] = useState<RelatedPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [progress, setProgress] = useState(0);

  // Reading progress bar
  useEffect(() => {
    const onScroll = () => {
      const el = document.documentElement;
      const total = el.scrollHeight - el.clientHeight;
      setProgress(total > 0 ? Math.min(100, (el.scrollTop / total) * 100) : 0);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Fetch the post + related posts
  const fetchPost = useCallback(async () => {
    if (!slug) return;
    setLoading(true);
    setError(null);

    const { data, error } = await supabase
      .from("blogs")
      .select("*")
      .eq("slug", slug)
      .eq("status", "published")
      .maybeSingle();

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    if (!data) {
      setError("not-found");
      setLoading(false);
      return;
    }

    const row = data as unknown as BlogRow;
    setPost(row);

    // Increment views (fire and forget)
    supabase
      .from("blogs")
      .update({ views: (row.views ?? 0) + 1 })
      .eq("id", row.id)
      .then(() => {});

    // Fetch related posts by specialty (or category fallback)
    if (row.specialty || row.category) {
      let q = supabase
        .from("blogs")
        .select("id,slug,title,excerpt,featured_image,featured_image_alt,reading_time,published_at,created_at,specialty,category")
        .eq("status", "published")
        .neq("id", row.id)
        .order("is_featured", { ascending: false })
        .order("published_at", { ascending: false, nullsFirst: false })
        .limit(3);

      if (row.specialty) q = q.eq("specialty", row.specialty);
      else if (row.category) q = q.eq("category", row.category);

      const { data: rel } = await q;
      const mapped: RelatedPost[] = ((rel ?? []) as any[]).map((r) => ({
        id: r.id,
        slug: r.slug,
        title: r.title,
        excerpt: r.excerpt ?? "",
        image: r.featured_image || FALLBACK_IMAGE,
        imageAlt: r.featured_image_alt || r.title,
        date: formatDate(r.published_at ?? r.created_at),
        readTime: r.reading_time ? `${r.reading_time} min read` : "",
      }));
      setRelated(mapped);
    }

    setLoading(false);
  }, [slug]);

  useEffect(() => {
    fetchPost();
  }, [fetchPost]);

  // Update document title/meta on client
  useEffect(() => {
    if (!post) return;
    const title = post.meta_title || post.title;
    document.title = `${title} | Sant Haridas Hospital`;
    const desc = post.meta_description || post.excerpt || "";
    let tag = document.querySelector('meta[name="description"]');
    if (!tag) {
      tag = document.createElement("meta");
      tag.setAttribute("name", "description");
      document.head.appendChild(tag);
    }
    tag.setAttribute("content", desc);
  }, [post]);

  const handleShare = async () => {
    const url = typeof window !== "undefined" ? window.location.href : "";
    if (navigator.share) {
      try {
        await navigator.share({ title: post?.title ?? "Blog", url });
        return;
      } catch {
        /* fallthrough to copy */
      }
    }
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* ignore */
    }
  };

  // ── Loading ─────────────────────────────────────────────────────────────────
  if (loading) {
    return (
      <>
        <TopBar />
        <MainNav />
        <main className="bg-white min-h-screen">
          <div className="max-w-[820px] mx-auto px-3 sm:px-4 py-8 sm:py-12">
            <ArticleSkeleton />
          </div>
        </main>
        <BlogsFooter />
      </>
    );
  }

  // ── Not found / error ───────────────────────────────────────────────────────
  if (error || !post) {
    const notFound = error === "not-found";
    return (
      <>
        <TopBar />
        <MainNav />
        <main className="bg-white min-h-screen flex items-center justify-center px-4">
          <div className="text-center py-20">
            <h1 className="text-3xl sm:text-4xl font-bold text-[#1a3a5c] mb-3">
              {notFound ? "Article Not Found" : "Something went wrong"}
            </h1>
            <p className="text-[14px] sm:text-[15px] text-gray-500 mb-6 max-w-md mx-auto">
              {notFound
                ? "The article you're looking for may have been removed, renamed, or is not yet published."
                : `We couldn't load this article: ${error}`}
            </p>
            <div className="flex items-center justify-center gap-3">
              <Link
                href="/blogs"
                className="inline-flex items-center gap-2 bg-[#1a9fa8] hover:bg-[#158a92] text-white text-[13px] sm:text-[14px] font-semibold px-5 py-2.5 rounded-lg transition-colors"
              >
                Back to Blogs
              </Link>
              {!notFound && (
                <button
                  onClick={fetchPost}
                  className="inline-flex items-center gap-2 border-2 border-[#1a9fa8] text-[#1a9fa8] text-[13px] sm:text-[14px] font-semibold px-5 py-2.5 rounded-lg hover:bg-[#f0faf9] transition-colors"
                >
                  Retry
                </button>
              )}
            </div>
          </div>
        </main>
        <BlogsFooter />
      </>
    );
  }

  // ── Article ─────────────────────────────────────────────────────────────────
  const bannerTitle = (post.banner_title && post.banner_title.trim()) || post.title;
  const bannerSubtitle = (post.banner_subtitle && post.banner_subtitle.trim()) || post.excerpt || "";
  const image = post.featured_image || FALLBACK_IMAGE;
  const imageAlt = post.featured_image_alt || post.title;
  const author = post.author_name || "Sant Haridas Hospital";
  const authorRole = post.author_role || post.specialty || "";
  const date = formatDate(post.published_at ?? post.created_at);
  const readTime = readingTimeFromContent(post.content, post.reading_time);
  const safeContent = sanitizeHtml(post.content);

  return (
    <>
      {/* Reading progress bar */}
      <div className="fixed top-0 left-0 right-0 z-[60] h-[3px] bg-transparent">
        <div
          className="h-full bg-[#1a9fa8] transition-[width] duration-75"
          style={{ width: `${progress}%` }}
        />
      </div>

      <TopBar />
      <MainNav />

      <main className="bg-white min-h-screen">
        {/* ── Hero banner (mirrors the blog card banner design) ── */}
        <section className="w-full bg-[#d6eef2] relative overflow-hidden">
          <div className="max-w-[1200px] mx-auto px-3 sm:px-4 py-8 sm:py-12 relative">
            {/* Breadcrumb */}
            <nav className="flex items-center gap-1.5 text-[11px] sm:text-[12px] text-[#1a3a5c]/70 mb-5 sm:mb-6">
              <Link href="/" className="hover:text-[#1a9fa8] transition-colors">Home</Link>
              <span>/</span>
              <Link href="/blogs" className="hover:text-[#1a9fa8] transition-colors">Blogs</Link>
              <span>/</span>
              <span className="text-[#1a3a5c] font-medium truncate max-w-[160px] sm:max-w-none">
                {post.title}
              </span>
            </nav>

            <div className="flex flex-col lg:flex-row gap-6 lg:gap-10 items-start">
              {/* Left: text */}
              <div className="flex-1 min-w-0">
                {post.specialty && (
                  <span className="inline-block bg-[#1a9fa8] text-white text-[10px] sm:text-[11px] font-semibold uppercase tracking-wider px-3 py-1 rounded-full mb-4">
                    {post.specialty}
                  </span>
                )}
                <h1 className="text-[22px] sm:text-[30px] lg:text-[36px] font-bold text-[#1a3a5c] leading-tight mb-3 sm:mb-4 whitespace-pre-line">
                  {bannerTitle}
                </h1>
                <div className="w-12 h-[3px] bg-[#1a9fa8] mb-3 sm:mb-4" />
                {bannerSubtitle && (
                  <p className="text-[13px] sm:text-[15px] text-[#1a3a5c]/80 leading-relaxed max-w-2xl whitespace-pre-line">
                    {bannerSubtitle}
                  </p>
                )}

                {/* Author row */}
                <div className="mt-5 sm:mt-7 flex flex-wrap items-center gap-x-4 gap-y-2">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-[#1a9fa8] text-white flex items-center justify-center font-bold text-[14px] sm:text-[15px]">
                      {author.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[12px] sm:text-[13px] font-semibold text-[#1a3a5c]">
                        {author}
                      </span>
                      {authorRole && (
                        <span className="text-[11px] sm:text-[12px] text-[#1a9fa8] font-medium">
                          {authorRole}
                        </span>
                      )}
                    </div>
                  </div>
                  <span className="hidden sm:block text-[#1a3a5c]/30">|</span>
                  <div className="flex items-center gap-2 text-[11px] sm:text-[12px] text-[#1a3a5c]/70">
                    <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none">
                      <rect x="3" y="5" width="18" height="16" rx="2" stroke="currentColor" strokeWidth="1.8" />
                      <path d="M3 9h18M8 3v4M16 3v4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                    </svg>
                    <span>{date}</span>
                    <span className="text-[#1a3a5c]/30">|</span>
                    <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none">
                      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.8" />
                      <path d="M12 7v5l3 2" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                    </svg>
                    <span>{readTime}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Teal arc corner */}
          <svg className="absolute top-0 right-0" width="70" height="70" viewBox="0 0 70 70" fill="none">
            <path d="M70 0 Q70 70 0 70" stroke="#1a9fa8" strokeWidth="3" fill="none" />
          </svg>
        </section>

        {/* ── Featured image ── */}
        <div className="max-w-[1200px] mx-auto px-3 sm:px-4 -mt-4 sm:-mt-6 relative z-10">
          <div className="relative rounded-2xl overflow-hidden shadow-lg bg-gray-100" style={{ height: "clamp(220px, 45vw, 460px)" }}>
            <Image
              src={image}
              alt={imageAlt}
              fill
              sizes="(max-width: 1200px) 100vw, 1200px"
              className="object-cover object-center"
              priority
              unoptimized
            />
          </div>
        </div>

        {/* ── Body ── */}
        <div className="max-w-[1200px] mx-auto px-3 sm:px-4 py-8 sm:py-12">
          <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 items-start">
            {/* Article content */}
            <article className="flex-1 min-w-0 w-full">
              <div
                className="blog-content prose max-w-none text-[15px] sm:text-[16px] text-gray-700 leading-[1.8]"
                dangerouslySetInnerHTML={{ __html: safeContent }}
              />

              {/* Tags */}
              {post.tags && post.tags.length > 0 && (
                <div className="mt-8 pt-6 border-t border-gray-200">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-[12px] sm:text-[13px] font-semibold text-[#1a3a5c] mr-1">
                      Tags:
                    </span>
                    {post.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-3 py-1 rounded-full bg-[#f0faf9] text-[#1a7a90] text-[11px] sm:text-[12px] font-medium border border-[#1a9fa8]/20"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Share + back */}
              <div className="mt-8 pt-6 border-t border-gray-200 flex flex-wrap items-center justify-between gap-4">
                <Link
                  href="/blogs"
                  className="inline-flex items-center gap-2 text-[#1a9fa8] text-[13px] sm:text-[14px] font-semibold hover:underline"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none">
                    <path d="M19 12H5M5 12l7-7M5 12l7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  Back to all blogs
                </Link>

                <div className="flex items-center gap-2">
                  <span className="text-[12px] sm:text-[13px] text-gray-500 mr-1">Share:</span>
                  <button
                    onClick={handleShare}
                    className="w-9 h-9 rounded-full bg-[#f0faf9] border border-[#1a9fa8]/20 flex items-center justify-center text-[#1a9fa8] hover:bg-[#1a9fa8] hover:text-white transition-colors"
                    aria-label="Share article"
                  >
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none">
                      <circle cx="18" cy="5" r="3" stroke="currentColor" strokeWidth="1.8" />
                      <circle cx="6" cy="12" r="3" stroke="currentColor" strokeWidth="1.8" />
                      <circle cx="18" cy="19" r="3" stroke="currentColor" strokeWidth="1.8" />
                      <path d="M8.6 13.5l6.8 4M15.4 6.5l-6.8 4" stroke="currentColor" strokeWidth="1.8" />
                    </svg>
                  </button>
                  <a
                    href={`https://wa.me/?text=${encodeURIComponent(`${post.title} - ${typeof window !== "undefined" ? window.location.href : ""}`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-9 h-9 rounded-full bg-[#f0faf9] border border-[#1a9fa8]/20 flex items-center justify-center text-[#1a9fa8] hover:bg-[#1a9fa8] hover:text-white transition-colors"
                    aria-label="Share on WhatsApp"
                  >
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
                      <path d="M11.998 2C6.477 2 2 6.477 2 12c0 1.82.487 3.53 1.338 5.01L2 22l5.118-1.318C8.578 21.527 10.248 22 11.998 22 17.523 22 22 17.523 22 12S17.523 2 11.998 2z" />
                    </svg>
                  </a>
                  <a
                    href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(typeof window !== "undefined" ? window.location.href : "")}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-9 h-9 rounded-full bg-[#f0faf9] border border-[#1a9fa8]/20 flex items-center justify-center text-[#1a9fa8] hover:bg-[#1a9fa8] hover:text-white transition-colors"
                    aria-label="Share on Facebook"
                  >
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none">
                      <path d="M17 2h-3a5 5 0 00-5 5v3H6v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </a>
                </div>
              </div>

              {copied && (
                <p className="mt-3 text-[12px] text-[#1a9fa8] font-medium">Link copied to clipboard!</p>
              )}
            </article>

            {/* Sidebar */}
            <aside className="w-full lg:w-[300px] flex-shrink-0 flex flex-col gap-6">
              {/* CTA card */}
              <div className="rounded-2xl bg-[#1a3a5c] text-white p-6 sm:p-7">
                <h3 className="text-[17px] sm:text-[18px] font-bold mb-2 leading-snug">
                  Need medical advice?
                </h3>
                <p className="text-[12px] sm:text-[13px] text-white/80 leading-relaxed mb-4">
                  Our specialists at Sant Haridas Hospital are here to help. Book a consultation with the right doctor today.
                </p>
                <Link
                  href="/doctors"
                  className="inline-flex items-center gap-2 bg-[#e07234] hover:bg-[#c5602a] text-white text-[13px] font-bold px-4 py-2.5 rounded-lg transition-colors w-full justify-center"
                >
                  Book an Appointment
                </Link>
                <a
                  href="tel:+919540740947"
                  className="mt-3 flex items-center justify-center gap-2 text-[#1a9fa8] hover:text-white text-[12px] sm:text-[13px] font-semibold transition-colors"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none">
                    <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.81 19.79 19.79 0 01.01 1.17 2 2 0 012 0h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.09 7.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 14.92v2z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  Emergency: +91 95407 40947
                </a>
              </div>

              {/* Related posts */}
              {related.length > 0 && (
                <div>
                  <h3 className="text-[16px] sm:text-[17px] font-bold text-[#1a3a5c] mb-4 pb-2 border-b-2 border-gray-200">
                    Related Articles
                  </h3>
                  <div className="flex flex-col gap-5">
                    {related.map((r) => (
                      <RelatedCard key={r.id} post={r} />
                    ))}
                  </div>
                </div>
              )}

              {/* Back to blogs */}
              <Link
                href="/blogs"
                className="inline-flex items-center justify-center gap-2 border-2 border-[#1a9fa8] text-[#1a9fa8] text-[13px] font-semibold px-4 py-2.5 rounded-lg hover:bg-[#f0faf9] transition-colors"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none">
                  <path d="M19 12H5M5 12l7-7M5 12l7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                View all articles
              </Link>
            </aside>
          </div>
        </div>
      </main>

      <BlogsFooter />

      {/* Blog content typography styles */}
      <style jsx global>{`
        .blog-content h1,
        .blog-content h2,
        .blog-content h3,
        .blog-content h4 {
          color: #1a3a5c;
          font-weight: 700;
          line-height: 1.3;
          margin-top: 1.8em;
          margin-bottom: 0.6em;
        }
        .blog-content h1 { font-size: 1.75rem; }
        .blog-content h2 { font-size: 1.4rem; }
        .blog-content h3 { font-size: 1.2rem; }
        .blog-content h4 { font-size: 1.05rem; }
        .blog-content p { margin-bottom: 1.15em; }
        .blog-content a {
          color: #1a9fa8;
          text-decoration: underline;
          text-underline-offset: 2px;
        }
        .blog-content a:hover { color: #158a92; }
        .blog-content ul,
        .blog-content ol {
          margin: 1em 0 1.3em 1.4em;
          padding-left: 0.4em;
        }
        .blog-content ul { list-style: disc; }
        .blog-content ol { list-style: decimal; }
        .blog-content li { margin-bottom: 0.5em; }
        .blog-content blockquote {
          border-left: 4px solid #1a9fa8;
          background: #f0faf9;
          padding: 1em 1.2em;
          margin: 1.5em 0;
          border-radius: 0 8px 8px 0;
          color: #1a3a5c;
          font-style: italic;
        }
        .blog-content img {
          border-radius: 12px;
          margin: 1.5em 0;
          width: 100%;
          height: auto;
        }
        .blog-content strong { color: #1a3a5c; }
        .blog-content code {
          background: #f3f4f6;
          padding: 0.15em 0.4em;
          border-radius: 4px;
          font-size: 0.9em;
          color: #1a3a5c;
        }
        .blog-content pre {
          background: #1a3a5c;
          color: #f8fafc;
          padding: 1.2em;
          border-radius: 10px;
          overflow-x: auto;
          margin: 1.5em 0;
        }
        .blog-content pre code {
          background: transparent;
          color: inherit;
          padding: 0;
        }
        .blog-content hr {
          border: none;
          border-top: 1px solid #e5e7eb;
          margin: 2em 0;
        }
        .blog-content table {
          width: 100%;
          border-collapse: collapse;
          margin: 1.5em 0;
          font-size: 0.95em;
        }
        .blog-content th,
        .blog-content td {
          border: 1px solid #e5e7eb;
          padding: 0.6em 0.8em;
          text-align: left;
        }
        .blog-content th {
          background: #f0faf9;
          color: #1a3a5c;
          font-weight: 600;
        }
      `}</style>
    </>
  );
}