"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { supabase } from "@/lib/supabase-client";

// ── Shared TopBar ─────────────────────────────────────────────────────────────

function TopBar() {
  return (
    <div className="w-full bg-[#1a9fa8] text-white text-[12px]">
      <div className="max-w-[1200px] mx-auto px-4 flex items-center justify-between h-9 gap-4">
        <nav className="flex items-center gap-5"></nav>
        <div className="flex items-center gap-4">
          <a href="#" className="flex items-center gap-1.5 hover:underline whitespace-nowrap">
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M20 10.5C20 16 12 22 12 22C12 22 4 16 4 10.5C4 6.358 7.582 3 12 3C16.418 3 20 6.358 20 10.5Z" stroke="white" strokeWidth="1.8" />
              <circle cx="12" cy="10.5" r="3" stroke="white" strokeWidth="1.8" />
            </svg>
            WhatsApp Us (24/7)
          </a>
          <a href="tel:+919268880303" className="flex items-center gap-1.5 hover:underline whitespace-nowrap">
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.81 19.79 19.79 0 01.01 1.17 2 2 0 012 0h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.09 7.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 14.92v2z" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            +91 926 888 0303 (24/7)
          </a>
        </div>
      </div>
    </div>
  );
}

// ── Shared MainNav ────────────────────────────────────────────────────────────

const navItems = ["Doctors", "Services", "Blogs", "About Us", "Contact Us"];

function MainNav() {
  const getNavLink = (item: string): string => {
    switch (item) {
      case "Doctors": return "/doctors";
      case "Services": return "/services";
      case "Blogs": return "/blogs";
      case "About Us": return "/about";
      case "Contact Us": return "#contact";
      default: return "#";
    }
  };

  return (
    <header className="w-full bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-[1200px] mx-auto px-4 flex items-center justify-between h-16">
        <a href="/" className="flex items-center gap-2 flex-shrink-0">
          <img
            src="https://res.cloudinary.com/df01whs60/image/upload/v1785656956/Sant_haridas_hospital_logo_page-0001_vu9ssi.jpg"
            alt="Sant Haridas Hospital"
            className="h-12 w-auto object-contain"
          />
        </a>
        <nav className="hidden lg:flex items-center gap-6">
          {navItems.map((item) => (
            <a key={item} href={getNavLink(item)} className="text-[14px] font-medium text-gray-700 hover:text-[#1a9fa8] transition-colors">
              {item}
            </a>
          ))}
        </nav>
        <div className="flex items-center gap-3">
          <a href="/doctors" className="hidden md:inline-flex items-center bg-[#e07234] hover:bg-[#c5602a] text-white text-[13px] font-bold px-4 py-2 rounded transition-colors whitespace-nowrap">
            Book an Appointment
          </a>
        </div>
      </div>
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
  views: number;
  created_at: string;
  updated_at: string;
  // Optional (add via ALTER TABLE, see notes)
  banner_title?: string | null;
  banner_subtitle?: string | null;
};

type BlogPost = {
  id: string;
  slug: string;
  bannerTitle: string;
  bannerSubtitle: string;
  image: string;
  imageAlt: string;
  title: string;
  excerpt: string;
  author: string;
  authorSpecialty: string;
  date: string;
  readTime: string;
};

// ── Constants ─────────────────────────────────────────────────────────────────

const PAGE_SIZE = 6;
const FALLBACK_IMAGE =
  "https://res.cloudinary.com/df01whs60/image/upload/v1785656956/Sant_haridas_hospital_logo_page-0001_vu9ssi.jpg";

// ── Helpers ───────────────────────────────────────────────────────────────────

function formatDate(iso: string | null): string {
  if (!iso) return "";
  try {
    return new Date(iso).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  } catch {
    return "";
  }
}

function mapRowToPost(row: BlogRow): BlogPost {
  const bannerTitle =
    (row.banner_title && row.banner_title.trim()) || row.title;
  const bannerSubtitle =
    (row.banner_subtitle && row.banner_subtitle.trim()) || row.excerpt || "";

  return {
    id: row.id,
    slug: row.slug,
    bannerTitle,
    bannerSubtitle,
    image: row.featured_image || FALLBACK_IMAGE,
    imageAlt: row.featured_image_alt || row.title,
    title: row.title,
    excerpt: row.excerpt || "",
    author: row.author_name || "Sant Haridas Hospital",
    authorSpecialty: row.author_role || row.specialty || "",
    date: formatDate(row.published_at ?? row.created_at),
    readTime: row.reading_time ? `${row.reading_time} min read` : "",
  };
}

// ── Skeleton ──────────────────────────────────────────────────────────────────

function BlogSkeleton() {
  return (
    <article className="flex flex-col animate-pulse">
      <div className="rounded-xl bg-gray-200" style={{ height: 210 }} />
      <div className="mt-4 flex flex-col gap-3">
        <div className="h-4 bg-gray-200 rounded w-11/12" />
        <div className="h-4 bg-gray-200 rounded w-8/12" />
        <div className="h-3 bg-gray-200 rounded w-full" />
        <div className="h-3 bg-gray-200 rounded w-10/12" />
      </div>
    </article>
  );
}

// ── Blog Card ─────────────────────────────────────────────────────────────────

function BlogCard({ post }: { post: BlogPost }) {
  return (
    <article className="flex flex-col group">
      <a href={`/blogs/${post.slug}`} className="block">
        {/* Banner */}
        <div className="relative rounded-xl overflow-hidden bg-[#d6eef2]" style={{ height: 210 }}>
          {/* Left text */}
          <div className="absolute inset-0 z-10 flex flex-col justify-center pl-5 pr-[46%]">
            <p className="text-[#1a3a5c] font-bold text-[14px] leading-tight whitespace-pre-line mb-3 line-clamp-3">
              {post.bannerTitle}
            </p>
            <div className="w-8 h-[3px] bg-[#1a9fa8] mb-3" />
            <p className="text-[#1a3a5c] text-[11px] leading-snug whitespace-pre-line line-clamp-3">
              {post.bannerSubtitle}
            </p>
          </div>

          {/* Wave cutout */}
          <div className="absolute inset-y-0 right-0 z-10" style={{ width: "52%" }}>
            <svg viewBox="0 0 120 200" preserveAspectRatio="none" className="absolute left-0 top-0 h-full w-8" xmlns="http://www.w3.org/2000/svg">
              <path d="M120 0 C60 50, 60 150, 120 200 L0 200 L0 0 Z" fill="#d6eef2" />
            </svg>
          </div>

          {/* Photo */}
          <div className="absolute right-0 top-0 bottom-0 z-0" style={{ width: "52%" }}>
            <Image
              src={post.image}
              alt={post.imageAlt}
              fill
              sizes="(max-width: 768px) 50vw, 300px"
              className="object-cover object-center"
              unoptimized
            />
            <div className="absolute inset-0 bg-[#1a9fa8]/10" />
          </div>

          {/* Teal arc corner */}
          <svg className="absolute top-0 right-0 z-20" width="56" height="56" viewBox="0 0 56 56" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M56 0 Q56 56 0 56" stroke="#1a9fa8" strokeWidth="3" fill="none" />
          </svg>
        </div>

        {/* Content below banner */}
        <div className="mt-4 flex flex-col gap-2.5 flex-1">
          <h2 className="text-[15px] font-bold text-[#1a3a5c] leading-snug group-hover:text-[#1a9fa8] transition-colors line-clamp-2 cursor-pointer">
            {post.title}
          </h2>
          <p className="text-[13px] text-gray-600 leading-relaxed line-clamp-2">
            {post.excerpt}
          </p>
          <div className="flex flex-col gap-0.5">
            <p className="text-[12px] text-[#1a9fa8] font-medium cursor-pointer hover:underline">
              {post.author} {post.authorSpecialty ? `In ${post.authorSpecialty}` : ""}
            </p>
            <div className="flex items-center gap-2 text-[12px] text-gray-500">
              <span>{post.date}</span>
              {post.readTime && (
                <>
                  <span className="text-gray-300">|</span>
                  <span>{post.readTime}</span>
                </>
              )}
            </div>
          </div>
        </div>
      </a>
    </article>
  );
}

// ── Sidebar ───────────────────────────────────────────────────────────────────

function Sidebar({
  specialities,
  selectedSpeciality,
  onSelect,
}: {
  specialities: string[];
  selectedSpeciality: string | null;
  onSelect: (s: string | null) => void;
}) {
  const [langOpen, setLangOpen] = useState(false);
  const [selectedLang, setSelectedLang] = useState("English");

  const languages = [
    "English", "Hindi", "Bengali", "Tamil", "Telugu",
    "Marathi", "Gujarati", "Kannada", "Malayalam", "Punjabi",
  ];

  return (
    <aside className="w-full lg:w-[260px] flex-shrink-0 flex flex-col gap-6">
      {/* Language selector */}
      <div className="relative">
        <button
          onClick={() => setLangOpen((o) => !o)}
          className="w-full flex items-center justify-between px-4 py-3 border border-gray-300 rounded-lg text-[14px] text-gray-700 bg-white hover:border-[#1a9fa8] transition-colors"
        >
          <span>{selectedLang}</span>
          <svg
            className={`w-4 h-4 text-gray-500 transition-transform duration-200 ${langOpen ? "rotate-180" : ""}`}
            viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
        {langOpen && (
          <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-20 overflow-hidden">
            {languages.map((lang) => (
              <button
                key={lang}
                onClick={() => { setSelectedLang(lang); setLangOpen(false); }}
                className={`w-full text-left px-4 py-2.5 text-[13px] hover:bg-[#f0faf9] transition-colors ${selectedLang === lang ? "text-[#1a9fa8] font-semibold bg-[#f0faf9]" : "text-gray-700"}`}
              >
                {lang}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* By Specialities */}
      <div>
        <h3 className="text-[17px] font-bold text-[#1a3a5c] mb-4">By Specialities</h3>
        {specialities.length === 0 ? (
          <p className="text-[13px] text-gray-400">No specialities available.</p>
        ) : (
          <div className="flex flex-wrap gap-2">
            {specialities.map((s) => {
              const active = selectedSpeciality === s;
              return (
                <button
                  key={s}
                  onClick={() => onSelect(active ? null : s)}
                  className={`px-3 py-1.5 rounded-full border text-[12px] font-medium transition-colors ${
                    active
                      ? "bg-[#1a9fa8] border-[#1a9fa8] text-white"
                      : "border-[#1a9fa8] text-[#1a7a90] hover:bg-[#f0faf9]"
                  }`}
                >
                  {s}
                </button>
              );
            })}
          </div>
        )}
      </div>
    </aside>
  );
}

// ── Footer ────────────────────────────────────────────────────────────────────

const socialLinks = [
  {
    label: "Instagram",
    href: "#",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5" xmlns="http://www.w3.org/2000/svg">
        <rect x="2" y="2" width="20" height="20" rx="6" stroke="url(#ig-blog)" strokeWidth="1.8" />
        <circle cx="12" cy="12" r="4.5" stroke="url(#ig-blog)" strokeWidth="1.8" />
        <circle cx="17.5" cy="6.5" r="1" fill="url(#ig-blog)" />
        <defs>
          <linearGradient id="ig-blog" x1="2" y1="22" x2="22" y2="2" gradientUnits="userSpaceOnUse">
            <stop stopColor="#f09433" /><stop offset="0.25" stopColor="#e6683c" />
            <stop offset="0.5" stopColor="#dc2743" /><stop offset="0.75" stopColor="#cc2366" />
            <stop offset="1" stopColor="#bc1888" />
          </linearGradient>
        </defs>
      </svg>
    ),
  },
  {
    label: "Facebook", href: "#",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5" xmlns="http://www.w3.org/2000/svg">
        <path d="M17 2h-3a5 5 0 00-5 5v3H6v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z" stroke="#1877f2" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    label: "X (Twitter)", href: "#",
    icon: (
      <svg viewBox="0 0 24 24" fill="#000" className="w-5 h-5" xmlns="http://www.w3.org/2000/svg">
        <path d="M4 4l16 16M4 20L20 4" stroke="#000" strokeWidth="2" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    label: "YouTube", href: "#",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5" xmlns="http://www.w3.org/2000/svg">
        <rect x="2" y="5" width="20" height="14" rx="4" stroke="#ff0000" strokeWidth="1.8" />
        <path d="M10 9l5 3-5 3V9z" fill="#ff0000" />
      </svg>
    ),
  },
];

function BlogsFooter() {
  return (
    <footer className="w-full bg-[#f0faf5] border-t border-gray-200">
      <div className="w-full" style={{ height: 200 }}>
        <iframe
          title="Sant Haridas Hospital Location"
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3504.2536096392!2d77.2088!3d28.5494!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390ce1c9af8e7ad3%3A0x5e1c3a2a2a2a2a2a!2sMAX%20Super%20Speciality%20Hospital%2C%20Saket!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin"
          width="100%" height="200" style={{ border: 0, display: "block" }} allowFullScreen loading="lazy" referrerPolicy="no-referrer-when-downgrade"
        />
      </div>
      <div className="max-w-[1200px] mx-auto px-4 py-5 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2 flex-shrink-0">
          <img
            src="https://res.cloudinary.com/df01whs60/image/upload/v1785656956/Sant_haridas_hospital_logo_page-0001_vu9ssi.jpg"
            alt="Sant Haridas Hospital"
            className="h-10 w-auto object-contain"
          />
        </div>
        <div className="flex flex-col items-center gap-3">
          <p className="text-[11px] font-bold tracking-widest text-[#1a3a5c] uppercase">Stay in Touch</p>
          <div className="flex items-center gap-3">
            {socialLinks.map((s) => (
              <a key={s.label} href={s.href} aria-label={s.label} className="w-10 h-10 rounded-full bg-white shadow-sm border border-gray-100 flex items-center justify-center hover:shadow-md transition-shadow">
                {s.icon}
              </a>
            ))}
          </div>
          <p className="text-[12px] text-gray-500">
            &copy; {new Date().getFullYear()} Sant Haridas Hospital. All Rights Reserved.
          </p>
        </div>
        <div className="flex flex-col items-end gap-1.5 text-right">
          <p className="text-[12px] font-semibold text-[#1a3a5c]">24/7 Emergency</p>
          <a href="tel:+919268880303" className="text-[15px] font-bold text-[#1a9fa8] hover:text-[#1a3a5c] transition-colors">+91 926 888 0303</a>
          <a href="#" className="mt-1 inline-flex items-center gap-1.5 bg-[#1a3a5c] text-white text-[12px] font-semibold px-4 py-2 rounded hover:bg-[#122b47] transition-colors">
            Book an Appointment
          </a>
        </div>
      </div>
    </footer>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function BlogsPage() {
  const [selectedSpeciality, setSelectedSpeciality] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");

  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [specialities, setSpecialities] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [loadingMore, setLoadingMore] = useState(false);

  // Debounce search
  useEffect(() => {
    const t = setTimeout(() => setDebouncedQuery(searchQuery.trim()), 350);
    return () => clearTimeout(t);
  }, [searchQuery]);

  // Fetch specialities once (distinct values from published blogs)
  useEffect(() => {
    let cancelled = false;
    (async () => {
      const { data, error } = await supabase
        .from("blogs")
        .select("specialty")
        .eq("status", "published")
        .not("specialty", "is", null);

      if (cancelled) return;
      if (error) return; // silent, chips just won't show

      const unique = Array.from(
        new Set((data as { specialty: string | null }[]).map((r) => r.specialty).filter(Boolean) as string[])
      ).sort((a, b) => a.localeCompare(b));

      setSpecialities(unique);
    })();
    return () => { cancelled = true; };
  }, []);

  // Fetch blogs (initial + on filter/search change + pagination)
  const fetchBlogs = useCallback(
    async (opts: { page: number; append: boolean }) => {
      const { page: pageNum, append } = opts;

      if (append) setLoadingMore(true);
      else setLoading(true);
      setError(null);

      const from = (pageNum - 1) * PAGE_SIZE;
      const to = from + PAGE_SIZE - 1;

      let query = supabase
        .from("blogs")
        .select(
          "id,title,slug,excerpt,content,category,specialty,tags,author_name,author_role,featured_image,featured_image_alt,reading_time,status,published_at,is_featured,display_order,views,created_at,updated_at,banner_title,banner_subtitle",
          { count: "exact" }
        )
        .eq("status", "published")
        .order("is_featured", { ascending: false })
        .order("published_at", { ascending: false, nullsFirst: false })
        .order("created_at", { ascending: false })
        .range(from, to);

      if (selectedSpeciality) {
        query = query.eq("specialty", selectedSpeciality);
      }

      if (debouncedQuery) {
        // Case-insensitive match across title, excerpt, author_name, tags
        const q = debouncedQuery.replace(/[%,]/g, "");
        query = query.or(
          `title.ilike.%${q}%,excerpt.ilike.%${q}%,author_name.ilike.%${q}%,author_role.ilike.%${q}%`
        );
      }

      const { data, error, count } = await query;

      if (error) {
        // Fallback: retry without banner_* columns in case they don't exist
        const { data: fallbackData, error: fallbackErr, count: fallbackCount } = await supabase
          .from("blogs")
          .select(
            "id,title,slug,excerpt,content,category,specialty,tags,author_name,author_role,featured_image,featured_image_alt,reading_time,status,published_at,is_featured,display_order,views,created_at,updated_at",
            { count: "exact" }
          )
          .eq("status", "published")
          .order("is_featured", { ascending: false })
          .order("published_at", { ascending: false, nullsFirst: false })
          .order("created_at", { ascending: false })
          .range(from, to);

        if (fallbackErr) {
          setError(fallbackErr.message);
          if (!append) setPosts([]);
          if (append) setLoadingMore(false); else setLoading(false);
          return;
        }

        const mapped = ((fallbackData ?? []) as unknown as BlogRow[]).map(mapRowToPost);
        setPosts((prev) => (append ? [...prev, ...mapped] : mapped));
        setTotalCount(fallbackCount ?? mapped.length);
        if (append) setLoadingMore(false); else setLoading(false);
        return;
      }

      const mapped = ((data ?? []) as unknown as BlogRow[]).map(mapRowToPost);
      setPosts((prev) => (append ? [...prev, ...mapped] : mapped));
      setTotalCount(count ?? mapped.length);
      if (append) setLoadingMore(false); else setLoading(false);
    },
    [selectedSpeciality, debouncedQuery]
  );

  // Reset to page 1 whenever filters change
  useEffect(() => {
    setPage(1);
    fetchBlogs({ page: 1, append: false });
  }, [fetchBlogs]);

  const canLoadMore = useMemo(
    () => posts.length < totalCount && !loading && !loadingMore,
    [posts.length, totalCount, loading, loadingMore]
  );

  const handleLoadMore = () => {
    const next = page + 1;
    setPage(next);
    fetchBlogs({ page: next, append: true });
  };

  return (
    <>
      <TopBar />
      <MainNav />

      <main className="bg-white min-h-screen">
        <div className="max-w-[1200px] mx-auto px-4 py-10">

          {/* Page header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-[#1a3a5c] mb-1">Health Blogs</h1>
            <p className="text-[14px] text-gray-500">
              Expert insights, health tips and the latest medical news from Sant Haridas Hospital specialists.
            </p>
          </div>

          {/* Search bar */}
          <div className="mb-8 flex items-center gap-3 border border-gray-300 rounded-xl px-4 py-3 bg-white shadow-sm focus-within:border-[#1a9fa8] transition-colors max-w-[520px]">
            <svg className="w-5 h-5 text-gray-400 flex-shrink-0" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="11" cy="11" r="8" stroke="currentColor" strokeWidth="1.8" />
              <path d="M21 21l-4.35-4.35" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
            </svg>
            <input
              type="text"
              placeholder="Search articles, topics, doctors..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 text-[14px] text-gray-700 placeholder-gray-400 outline-none bg-transparent"
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery("")} className="text-gray-400 hover:text-gray-600" aria-label="Clear search">
                <svg className="w-4 h-4" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M4 4l8 8M12 4l-8 8" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                </svg>
              </button>
            )}
          </div>

          {/* Active filter chip */}
          {selectedSpeciality && (
            <div className="mb-6 flex items-center gap-2">
              <span className="text-[13px] text-gray-500">Filtering by:</span>
              <span className="inline-flex items-center gap-1.5 bg-[#1a9fa8] text-white text-[12px] font-medium px-3 py-1.5 rounded-full">
                {selectedSpeciality}
                <button onClick={() => setSelectedSpeciality(null)} aria-label="Remove filter">
                  <svg className="w-3 h-3" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M3 3l6 6M9 3l-6 6" stroke="white" strokeWidth="1.8" strokeLinecap="round" />
                  </svg>
                </button>
              </span>
            </div>
          )}

          {/* Main layout */}
          <div className="flex flex-col lg:flex-row gap-10 items-start">

            {/* Articles grid */}
            <div className="flex-1 min-w-0">
              <h2 className="text-xl font-bold text-[#1a3a5c] mb-6 pb-2 border-b-2 border-gray-200">
                Recent Articles
              </h2>

              {loading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                  {Array.from({ length: PAGE_SIZE }).map((_, i) => (
                    <BlogSkeleton key={i} />
                  ))}
                </div>
              ) : error ? (
                <div className="py-20 text-center">
                  <p className="text-red-500 text-[15px] mb-3">Failed to load blogs: {error}</p>
                  <button
                    onClick={() => fetchBlogs({ page: 1, append: false })}
                    className="text-[#1a9fa8] text-[14px] font-medium hover:underline"
                  >
                    Retry
                  </button>
                </div>
              ) : posts.length === 0 ? (
                <div className="py-20 text-center">
                  <p className="text-gray-400 text-[15px]">No articles found for your search.</p>
                  <button
                    onClick={() => { setSearchQuery(""); setSelectedSpeciality(null); }}
                    className="mt-4 text-[#1a9fa8] text-[14px] font-medium hover:underline"
                  >
                    Clear filters
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                  {posts.map((post) => (
                    <BlogCard key={post.id} post={post} />
                  ))}
                </div>
              )}

              {/* Load more */}
              {!loading && !error && posts.length > 0 && canLoadMore && (
                <div className="mt-10 flex justify-center">
                  <button
                    onClick={handleLoadMore}
                    disabled={loadingMore}
                    className="px-8 py-3 border-2 border-[#1a9fa8] text-[#1a9fa8] text-[14px] font-semibold rounded-lg hover:bg-[#f0faf9] transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {loadingMore ? "Loading..." : "Load More Articles"}
                  </button>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <Sidebar
              specialities={specialities}
              selectedSpeciality={selectedSpeciality}
              onSelect={setSelectedSpeciality}
            />
          </div>

        </div>
      </main>

      <BlogsFooter />
    </>
  );
}