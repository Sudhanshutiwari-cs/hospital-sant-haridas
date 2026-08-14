-- =============================================================================
-- MAX HEALTHCARE PORTAL — SUPABASE FULL SCHEMA
-- =============================================================================
-- Sections:
--   0.  Extensions
--   1.  Enums
--   2.  Storage buckets
--   3.  Core reference tables  (hospitals, specialities, languages)
--   4.  Doctors & schedules    (doctors, education, awards, slots, locations)
--   5.  Services               (services, service_features)
--   6.  Blog                   (blog_posts, blog_post_specialities)
--   7.  Website CMS            (hero_slides, stats_bar, nav_items, faqs,
--                               values, about_us, team_members)
--   8.  Appointments           (appointments, appointment_status_history)
--   9.  Contact Us             (contact_submissions)
--  10.  Admin / Auth           (admin_users, audit_log)
--  11.  Row Level Security (RLS) policies
--  12.  Helper functions & triggers
--  13.  Storage bucket policies
-- =============================================================================


-- =============================================================================
-- 0. EXTENSIONS
-- =============================================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";       -- fast ILIKE search
CREATE EXTENSION IF NOT EXISTS "unaccent";       -- accent-insensitive search


-- =============================================================================
-- 1. ENUMS
-- =============================================================================

CREATE TYPE appointment_type     AS ENUM ('hospital_visit', 'video_consult');
CREATE TYPE appointment_status   AS ENUM ('pending', 'confirmed', 'completed', 'cancelled', 'no_show');
CREATE TYPE slot_status          AS ENUM ('available', 'booked', 'blocked');
CREATE TYPE blog_status          AS ENUM ('draft', 'published', 'archived');
CREATE TYPE service_status       AS ENUM ('active', 'inactive');
CREATE TYPE contact_status       AS ENUM ('new', 'in_progress', 'resolved', 'spam');
CREATE TYPE admin_role           AS ENUM ('super_admin', 'content_manager', 'doctor_manager', 'appointment_manager');
CREATE TYPE day_of_week          AS ENUM ('monday','tuesday','wednesday','thursday','friday','saturday','sunday');
CREATE TYPE gender               AS ENUM ('male', 'female', 'other');
CREATE TYPE consultation_mode    AS ENUM ('hospital_visit', 'video_consult', 'both');


-- =============================================================================
-- 2. STORAGE BUCKETS
--    Created via SQL helper — bucket policies are defined in section 13.
-- =============================================================================

-- doctor profile photos
INSERT INTO storage.buckets (id, name, public)
VALUES ('doctor-photos', 'doctor-photos', true)
ON CONFLICT (id) DO NOTHING;

-- blog article cover images / banner images
INSERT INTO storage.buckets (id, name, public)
VALUES ('blog-images', 'blog-images', true)
ON CONFLICT (id) DO NOTHING;

-- service card images
INSERT INTO storage.buckets (id, name, public)
VALUES ('service-images', 'service-images', true)
ON CONFLICT (id) DO NOTHING;

-- hero / banner slides on the home page
INSERT INTO storage.buckets (id, name, public)
VALUES ('hero-images', 'hero-images', true)
ON CONFLICT (id) DO NOTHING;

-- general CMS assets (logos, icons, team photos, about images)
INSERT INTO storage.buckets (id, name, public)
VALUES ('cms-assets', 'cms-assets', true)
ON CONFLICT (id) DO NOTHING;

-- appointment-related documents (prescriptions, reports) — PRIVATE
INSERT INTO storage.buckets (id, name, public)
VALUES ('appointment-docs', 'appointment-docs', false)
ON CONFLICT (id) DO NOTHING;


-- =============================================================================
-- 3. CORE REFERENCE TABLES
-- =============================================================================

-- ---------------------------------------------------------------------------
-- 3a. Hospitals / Facilities
-- ---------------------------------------------------------------------------
CREATE TABLE hospitals (
    id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name          TEXT        NOT NULL,
    slug          TEXT        NOT NULL UNIQUE,
    address       TEXT,
    city          TEXT,
    state         TEXT,
    pincode       TEXT,
    phone         TEXT,
    email         TEXT,
    latitude      NUMERIC(10,7),
    longitude     NUMERIC(10,7),
    map_embed_url TEXT,
    description   TEXT,
    image_url     TEXT,       -- stored in cms-assets bucket
    is_active     BOOLEAN     NOT NULL DEFAULT true,
    sort_order    INT         NOT NULL DEFAULT 0,
    created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ---------------------------------------------------------------------------
-- 3b. Specialities  (shared by doctors, blog, services)
-- ---------------------------------------------------------------------------
CREATE TABLE specialities (
    id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name        TEXT    NOT NULL UNIQUE,
    slug        TEXT    NOT NULL UNIQUE,
    description TEXT,
    icon_svg    TEXT,           -- raw inline SVG markup for the icon
    is_active   BOOLEAN NOT NULL DEFAULT true,
    sort_order  INT     NOT NULL DEFAULT 0,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ---------------------------------------------------------------------------
-- 3c. Languages  (used in blog "select language" dropdown)
-- ---------------------------------------------------------------------------
CREATE TABLE languages (
    id        UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    code      TEXT NOT NULL UNIQUE,   -- e.g. 'en', 'hi', 'bn'
    label     TEXT NOT NULL,          -- e.g. 'English', 'Hindi'
    is_active BOOLEAN NOT NULL DEFAULT true,
    sort_order INT NOT NULL DEFAULT 0
);

INSERT INTO languages (code, label, sort_order) VALUES
('en',    'English',    1),
('hi',    'Hindi',      2),
('bn',    'Bengali',    3),
('ta',    'Tamil',      4),
('te',    'Telugu',     5),
('mr',    'Marathi',    6),
('gu',    'Gujarati',   7),
('kn',    'Kannada',    8),
('ml',    'Malayalam',  9),
('pa',    'Punjabi',   10);


-- =============================================================================
-- 4. DOCTORS & SCHEDULES
-- =============================================================================

-- ---------------------------------------------------------------------------
-- 4a. Doctors  (core profile)
-- ---------------------------------------------------------------------------
CREATE TABLE doctors (
    id                UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    slug              TEXT        NOT NULL UNIQUE,
    name              TEXT        NOT NULL,
    designation       TEXT        NOT NULL,     -- e.g. 'Director Neurology'
    hospital_id       UUID        REFERENCES hospitals(id) ON DELETE SET NULL,
    speciality_id     UUID        REFERENCES specialities(id) ON DELETE SET NULL,
    speciality_bold   TEXT        NOT NULL,     -- displayed label (bold part)
    speciality_light  TEXT        NOT NULL,     -- displayed label (light part)
    experience_years  INT         NOT NULL DEFAULT 0,
    consultation_fee  NUMERIC(10,2) NOT NULL DEFAULT 0,
    photo_url         TEXT,                     -- stored in doctor-photos bucket
    about_short       TEXT,                     -- 2-3 line bio for listing card
    about_full        TEXT,                     -- full biography (markdown ok)
    gender            gender,
    languages_spoken  TEXT[],                   -- ['English','Hindi','Bengali']
    consultation_mode consultation_mode NOT NULL DEFAULT 'both',
    is_active         BOOLEAN     NOT NULL DEFAULT true,
    is_featured       BOOLEAN     NOT NULL DEFAULT false,
    sort_order        INT         NOT NULL DEFAULT 0,
    meta_title        TEXT,
    meta_description  TEXT,
    created_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at        TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Full-text search index on doctors
CREATE INDEX idx_doctors_fts ON doctors
    USING GIN (to_tsvector('english', name || ' ' || COALESCE(designation,'') || ' ' || COALESCE(about_short,'')));

-- ---------------------------------------------------------------------------
-- 4b. Doctor — multiple hospital locations
-- ---------------------------------------------------------------------------
CREATE TABLE doctor_hospitals (
    id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    doctor_id   UUID NOT NULL REFERENCES doctors(id) ON DELETE CASCADE,
    hospital_id UUID NOT NULL REFERENCES hospitals(id) ON DELETE CASCADE,
    is_primary  BOOLEAN NOT NULL DEFAULT false,
    UNIQUE (doctor_id, hospital_id)
);

-- ---------------------------------------------------------------------------
-- 4c. Doctor Education  (one-to-many)
-- ---------------------------------------------------------------------------
CREATE TABLE doctor_education (
    id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    doctor_id   UUID NOT NULL REFERENCES doctors(id) ON DELETE CASCADE,
    degree      TEXT NOT NULL,              -- e.g. 'MBBS'
    institution TEXT NOT NULL,             -- e.g. 'Calcutta Medical College'
    university  TEXT,
    year        INT,
    sort_order  INT NOT NULL DEFAULT 0
);

-- ---------------------------------------------------------------------------
-- 4d. Doctor Awards & Accolades  (one-to-many)
-- ---------------------------------------------------------------------------
CREATE TABLE doctor_awards (
    id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    doctor_id   UUID NOT NULL REFERENCES doctors(id) ON DELETE CASCADE,
    title       TEXT NOT NULL,
    awarded_by  TEXT,
    year        INT,
    sort_order  INT NOT NULL DEFAULT 0
);

-- ---------------------------------------------------------------------------
-- 4e. Doctor Weekly Schedule Template
--     Defines recurring availability per day-of-week
-- ---------------------------------------------------------------------------
CREATE TABLE doctor_schedule_templates (
    id               UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    doctor_id        UUID    NOT NULL REFERENCES doctors(id) ON DELETE CASCADE,
    hospital_id      UUID    REFERENCES hospitals(id) ON DELETE SET NULL,
    day_of_week      day_of_week NOT NULL,
    start_time       TIME    NOT NULL,           -- e.g. 09:00
    end_time         TIME    NOT NULL,           -- e.g. 13:00
    slot_duration    INT     NOT NULL DEFAULT 15, -- minutes per slot
    consultation_mode consultation_mode NOT NULL DEFAULT 'hospital_visit',
    max_patients     INT     NOT NULL DEFAULT 20,
    is_active        BOOLEAN NOT NULL DEFAULT true,
    UNIQUE (doctor_id, day_of_week, start_time, consultation_mode)
);

-- ---------------------------------------------------------------------------
-- 4f. Doctor Time Slots  (generated from template or manually created)
-- ---------------------------------------------------------------------------
CREATE TABLE doctor_slots (
    id               UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    doctor_id        UUID        NOT NULL REFERENCES doctors(id) ON DELETE CASCADE,
    hospital_id      UUID        REFERENCES hospitals(id) ON DELETE SET NULL,
    slot_date        DATE        NOT NULL,
    start_time       TIME        NOT NULL,
    end_time         TIME        NOT NULL,
    consultation_mode consultation_mode NOT NULL DEFAULT 'hospital_visit',
    status           slot_status NOT NULL DEFAULT 'available',
    max_bookings     INT         NOT NULL DEFAULT 1,
    current_bookings INT         NOT NULL DEFAULT 0,
    created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE (doctor_id, slot_date, start_time, consultation_mode)
);

CREATE INDEX idx_doctor_slots_date     ON doctor_slots (doctor_id, slot_date);
CREATE INDEX idx_doctor_slots_available ON doctor_slots (doctor_id, slot_date, status)
    WHERE status = 'available';


-- =============================================================================
-- 5. SERVICES
-- =============================================================================

-- ---------------------------------------------------------------------------
-- 5a. Services
-- ---------------------------------------------------------------------------
CREATE TABLE services (
    id               UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    slug             TEXT        NOT NULL UNIQUE,
    title            TEXT        NOT NULL,
    category         TEXT        NOT NULL,          -- matches filter pill labels
    description      TEXT,
    icon_svg         TEXT,                          -- inline SVG string
    image_url        TEXT,                          -- stored in service-images bucket
    availability     TEXT,                          -- e.g. '24 / 7', '8 AM – 7 PM'
    highlight_badge  TEXT,                          -- e.g. 'Level 1 Trauma'
    status           service_status NOT NULL DEFAULT 'active',
    is_featured      BOOLEAN     NOT NULL DEFAULT false,
    sort_order       INT         NOT NULL DEFAULT 0,
    meta_title       TEXT,
    meta_description TEXT,
    created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ---------------------------------------------------------------------------
-- 5b. Service Features  (bullet-point list per service)
-- ---------------------------------------------------------------------------
CREATE TABLE service_features (
    id         UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    service_id UUID NOT NULL REFERENCES services(id) ON DELETE CASCADE,
    feature    TEXT NOT NULL,
    sort_order INT  NOT NULL DEFAULT 0
);

-- ---------------------------------------------------------------------------
-- 5c. Service <-> Speciality  (many-to-many)
-- ---------------------------------------------------------------------------
CREATE TABLE service_specialities (
    service_id    UUID NOT NULL REFERENCES services(id) ON DELETE CASCADE,
    speciality_id UUID NOT NULL REFERENCES specialities(id) ON DELETE CASCADE,
    PRIMARY KEY (service_id, speciality_id)
);


-- =============================================================================
-- 6. BLOG
-- =============================================================================

-- ---------------------------------------------------------------------------
-- 6a. Blog Posts
-- ---------------------------------------------------------------------------
CREATE TABLE blog_posts (
    id               UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    slug             TEXT        NOT NULL UNIQUE,
    banner_title     TEXT        NOT NULL,          -- ALL-CAPS banner overlay title
    banner_subtitle  TEXT,                          -- banner overlay subtitle
    image_url        TEXT,                          -- stored in blog-images bucket
    image_alt        TEXT,
    title            TEXT        NOT NULL,
    excerpt          TEXT,
    content          TEXT,                          -- full article (markdown / HTML)
    author_name      TEXT        NOT NULL,
    author_specialty TEXT,
    published_at     TIMESTAMPTZ,
    read_time        TEXT,                          -- e.g. '12 min read'
    status           blog_status NOT NULL DEFAULT 'draft',
    language_code    TEXT        NOT NULL DEFAULT 'en' REFERENCES languages(code),
    view_count       INT         NOT NULL DEFAULT 0,
    meta_title       TEXT,
    meta_description TEXT,
    created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_blog_posts_status     ON blog_posts (status, published_at DESC);
CREATE INDEX idx_blog_posts_fts        ON blog_posts
    USING GIN (to_tsvector('english', title || ' ' || COALESCE(excerpt,'') || ' ' || COALESCE(author_name,'')));

-- ---------------------------------------------------------------------------
-- 6b. Blog Post <-> Speciality  (many-to-many, drives sidebar filter)
-- ---------------------------------------------------------------------------
CREATE TABLE blog_post_specialities (
    blog_post_id  UUID NOT NULL REFERENCES blog_posts(id) ON DELETE CASCADE,
    speciality_id UUID NOT NULL REFERENCES specialities(id) ON DELETE CASCADE,
    PRIMARY KEY (blog_post_id, speciality_id)
);


-- =============================================================================
-- 7. WEBSITE CMS
-- =============================================================================

-- ---------------------------------------------------------------------------
-- 7a. Hero Slides  (home page carousel)
-- ---------------------------------------------------------------------------
CREATE TABLE hero_slides (
    id           UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    heading      TEXT,
    subheading   TEXT,
    cta_label    TEXT,
    cta_url      TEXT,
    image_url    TEXT    NOT NULL,  -- stored in hero-images bucket
    image_alt    TEXT,
    is_active    BOOLEAN NOT NULL DEFAULT true,
    sort_order   INT     NOT NULL DEFAULT 0,
    created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ---------------------------------------------------------------------------
-- 7b. Stats Bar  (the 4-stat row on the about page / home page)
-- ---------------------------------------------------------------------------
CREATE TABLE stats_bar (
    id         UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    label      TEXT    NOT NULL,    -- e.g. '36'
    sublabel   TEXT    NOT NULL,    -- e.g. 'Healthcare Facilities'
    icon_svg   TEXT,
    bg_color   TEXT    NOT NULL DEFAULT '#f9f9ff',
    sort_order INT     NOT NULL DEFAULT 0,
    is_active  BOOLEAN NOT NULL DEFAULT true
);

INSERT INTO stats_bar (label, sublabel, bg_color, sort_order) VALUES
('4 JCI & 33 NABH',  'Accredited Hospitals',      '#f4f0ff', 1),
('36',               'Healthcare Facilities',       '#fffdf0', 2),
('6,000+',           'Operational Beds',            '#f0f9ff', 3),
('17,900+',          'Healthcare Professionals',    '#fff0f2', 4);

-- ---------------------------------------------------------------------------
-- 7c. Navigation Items  (top nav links + dropdowns)
-- ---------------------------------------------------------------------------
CREATE TABLE nav_items (
    id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    label       TEXT    NOT NULL,
    url         TEXT,
    parent_id   UUID    REFERENCES nav_items(id) ON DELETE SET NULL,
    sort_order  INT     NOT NULL DEFAULT 0,
    is_active   BOOLEAN NOT NULL DEFAULT true,
    open_new_tab BOOLEAN NOT NULL DEFAULT false
);

-- ---------------------------------------------------------------------------
-- 7d. FAQ Items  (per page context)
-- ---------------------------------------------------------------------------
CREATE TABLE faqs (
    id         UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    page       TEXT    NOT NULL,    -- 'home','doctors','services','about','blogs'
    question   TEXT    NOT NULL,
    answer     TEXT    NOT NULL,
    sort_order INT     NOT NULL DEFAULT 0,
    is_active  BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ---------------------------------------------------------------------------
-- 7e. Our Values  (about page)
-- ---------------------------------------------------------------------------
CREATE TABLE our_values (
    id         UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title      TEXT    NOT NULL,
    icon_svg   TEXT,
    points     JSONB   NOT NULL DEFAULT '[]',
    -- points shape: [{"highlight": "Be principled...", "rest": " and honest"}]
    sort_order INT     NOT NULL DEFAULT 0,
    is_active  BOOLEAN NOT NULL DEFAULT true
);

-- ---------------------------------------------------------------------------
-- 7f. About Us  (CMS-controlled about page body text + vision / mission)
-- ---------------------------------------------------------------------------
CREATE TABLE about_us (
    id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    section_key TEXT NOT NULL UNIQUE,  -- 'body_text', 'vision', 'mission'
    heading     TEXT,
    content     TEXT NOT NULL,
    updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

INSERT INTO about_us (section_key, heading, content) VALUES
('body_text', 'About Us',
 'MAX Healthcare Limited is a leading integrated healthcare delivery service provider in India. The healthcare verticals of the company primarily comprise hospitals, diagnostics, and day care specialty facilities.'),
('vision', 'Vision',
 'To create a world-class integrated healthcare delivery system in India, entailing the finest medical skills combined with compassionate patient care.'),
('mission', 'Mission',
 'To be a globally respected healthcare organisation known for Clinical Excellence and Distinctive Patient Care.');

-- ---------------------------------------------------------------------------
-- 7g. Social Links  (footer)
-- ---------------------------------------------------------------------------
CREATE TABLE social_links (
    id         UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    platform   TEXT    NOT NULL UNIQUE,   -- 'instagram','facebook','x','youtube'
    url        TEXT    NOT NULL,
    icon_svg   TEXT,
    is_active  BOOLEAN NOT NULL DEFAULT true,
    sort_order INT     NOT NULL DEFAULT 0
);


-- =============================================================================
-- 8. APPOINTMENTS
-- =============================================================================

-- ---------------------------------------------------------------------------
-- 8a. Appointments
-- ---------------------------------------------------------------------------
CREATE TABLE appointments (
    id                UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

    -- Patient info (no auth required — guest booking supported)
    patient_name      TEXT        NOT NULL,
    patient_phone     TEXT        NOT NULL,
    patient_email     TEXT,
    patient_age       INT,
    patient_gender    gender,
    patient_message   TEXT,

    -- Doctor & slot
    doctor_id         UUID        NOT NULL REFERENCES doctors(id) ON DELETE RESTRICT,
    slot_id           UUID        REFERENCES doctor_slots(id) ON DELETE SET NULL,
    hospital_id       UUID        REFERENCES hospitals(id) ON DELETE SET NULL,

    -- Appointment details
    appointment_type  appointment_type  NOT NULL DEFAULT 'hospital_visit',
    appointment_date  DATE        NOT NULL,
    appointment_time  TIME        NOT NULL,
    status            appointment_status NOT NULL DEFAULT 'pending',

    -- Optional: link to a Supabase Auth user if they are logged in
    user_id           UUID        REFERENCES auth.users(id) ON DELETE SET NULL,

    -- Tracking
    booked_at         TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    confirmed_at      TIMESTAMPTZ,
    completed_at      TIMESTAMPTZ,
    cancelled_at      TIMESTAMPTZ,
    cancellation_reason TEXT,
    notes             TEXT,         -- admin/doctor internal notes

    created_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at        TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_appointments_doctor_date ON appointments (doctor_id, appointment_date);
CREATE INDEX idx_appointments_status      ON appointments (status);
CREATE INDEX idx_appointments_phone       ON appointments (patient_phone);

-- ---------------------------------------------------------------------------
-- 8b. Appointment Status History  (audit trail of status changes)
-- ---------------------------------------------------------------------------
CREATE TABLE appointment_status_history (
    id             UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    appointment_id UUID        NOT NULL REFERENCES appointments(id) ON DELETE CASCADE,
    old_status     appointment_status,
    new_status     appointment_status NOT NULL,
    changed_by     UUID        REFERENCES auth.users(id) ON DELETE SET NULL,
    note           TEXT,
    changed_at     TIMESTAMPTZ NOT NULL DEFAULT NOW()
);


-- =============================================================================
-- 9. CONTACT US FORM
-- =============================================================================

CREATE TABLE contact_submissions (
    id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    full_name     TEXT        NOT NULL,
    email         TEXT        NOT NULL,
    phone         TEXT,
    subject       TEXT,
    message       TEXT        NOT NULL,
    hospital_id   UUID        REFERENCES hospitals(id) ON DELETE SET NULL,
    status        contact_status NOT NULL DEFAULT 'new',
    admin_notes   TEXT,
    replied_at    TIMESTAMPTZ,
    ip_address    TEXT,
    submitted_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_contact_status ON contact_submissions (status, submitted_at DESC);


-- =============================================================================
-- 10. ADMIN / AUTH
-- =============================================================================

-- ---------------------------------------------------------------------------
-- 10a. Admin Users  (maps Supabase auth.users to portal admin roles)
-- ---------------------------------------------------------------------------
CREATE TABLE admin_users (
    id           UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name    TEXT        NOT NULL,
    email        TEXT        NOT NULL UNIQUE,
    role         admin_role  NOT NULL DEFAULT 'content_manager',
    is_active    BOOLEAN     NOT NULL DEFAULT true,
    last_login   TIMESTAMPTZ,
    created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ---------------------------------------------------------------------------
-- 10b. Audit Log  (record every admin mutation)
-- ---------------------------------------------------------------------------
CREATE TABLE audit_log (
    id           UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    admin_id     UUID        REFERENCES auth.users(id) ON DELETE SET NULL,
    action       TEXT        NOT NULL,   -- 'INSERT','UPDATE','DELETE'
    table_name   TEXT        NOT NULL,
    record_id    TEXT,                   -- stringified UUID of affected row
    old_data     JSONB,
    new_data     JSONB,
    ip_address   TEXT,
    performed_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_audit_log_table ON audit_log (table_name, performed_at DESC);
CREATE INDEX idx_audit_log_admin ON audit_log (admin_id, performed_at DESC);


-- =============================================================================
-- 11. ROW LEVEL SECURITY (RLS)
-- =============================================================================

-- Enable RLS on every table
ALTER TABLE hospitals                   ENABLE ROW LEVEL SECURITY;
ALTER TABLE specialities                ENABLE ROW LEVEL SECURITY;
ALTER TABLE languages                   ENABLE ROW LEVEL SECURITY;
ALTER TABLE doctors                     ENABLE ROW LEVEL SECURITY;
ALTER TABLE doctor_hospitals            ENABLE ROW LEVEL SECURITY;
ALTER TABLE doctor_education            ENABLE ROW LEVEL SECURITY;
ALTER TABLE doctor_awards               ENABLE ROW LEVEL SECURITY;
ALTER TABLE doctor_schedule_templates   ENABLE ROW LEVEL SECURITY;
ALTER TABLE doctor_slots                ENABLE ROW LEVEL SECURITY;
ALTER TABLE services                    ENABLE ROW LEVEL SECURITY;
ALTER TABLE service_features            ENABLE ROW LEVEL SECURITY;
ALTER TABLE service_specialities        ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_posts                  ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_post_specialities      ENABLE ROW LEVEL SECURITY;
ALTER TABLE hero_slides                 ENABLE ROW LEVEL SECURITY;
ALTER TABLE stats_bar                   ENABLE ROW LEVEL SECURITY;
ALTER TABLE nav_items                   ENABLE ROW LEVEL SECURITY;
ALTER TABLE faqs                        ENABLE ROW LEVEL SECURITY;
ALTER TABLE our_values                  ENABLE ROW LEVEL SECURITY;
ALTER TABLE about_us                    ENABLE ROW LEVEL SECURITY;
ALTER TABLE social_links                ENABLE ROW LEVEL SECURITY;
ALTER TABLE appointments                ENABLE ROW LEVEL SECURITY;
ALTER TABLE appointment_status_history  ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_submissions         ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_users                 ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_log                   ENABLE ROW LEVEL SECURITY;

-- ── Helper: is the current user a portal admin? ──────────────────────────────
CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN LANGUAGE sql SECURITY DEFINER STABLE AS $$
    SELECT EXISTS (
        SELECT 1 FROM admin_users
        WHERE id = auth.uid() AND is_active = true
    );
$$;

CREATE OR REPLACE FUNCTION has_role(required_role admin_role)
RETURNS BOOLEAN LANGUAGE sql SECURITY DEFINER STABLE AS $$
    SELECT EXISTS (
        SELECT 1 FROM admin_users
        WHERE id = auth.uid()
          AND is_active = true
          AND (role = required_role OR role = 'super_admin')
    );
$$;

-- ── Public read policies (anonymous visitors can read active content) ─────────

CREATE POLICY "public_read_hospitals"       ON hospitals         FOR SELECT USING (is_active = true);
CREATE POLICY "public_read_specialities"    ON specialities      FOR SELECT USING (is_active = true);
CREATE POLICY "public_read_languages"       ON languages         FOR SELECT USING (is_active = true);
CREATE POLICY "public_read_doctors"         ON doctors           FOR SELECT USING (is_active = true);
CREATE POLICY "public_read_doctor_hospitals" ON doctor_hospitals FOR SELECT USING (true);
CREATE POLICY "public_read_doctor_education" ON doctor_education FOR SELECT USING (true);
CREATE POLICY "public_read_doctor_awards"   ON doctor_awards     FOR SELECT USING (true);
CREATE POLICY "public_read_slots"           ON doctor_slots      FOR SELECT USING (status = 'available');
CREATE POLICY "public_read_services"        ON services          FOR SELECT USING (status = 'active');
CREATE POLICY "public_read_service_features" ON service_features FOR SELECT USING (true);
CREATE POLICY "public_read_service_spec"    ON service_specialities FOR SELECT USING (true);
CREATE POLICY "public_read_blog_posts"      ON blog_posts        FOR SELECT USING (status = 'published');
CREATE POLICY "public_read_blog_spec"       ON blog_post_specialities FOR SELECT USING (true);
CREATE POLICY "public_read_hero_slides"     ON hero_slides       FOR SELECT USING (is_active = true);
CREATE POLICY "public_read_stats_bar"       ON stats_bar         FOR SELECT USING (is_active = true);
CREATE POLICY "public_read_nav_items"       ON nav_items         FOR SELECT USING (is_active = true);
CREATE POLICY "public_read_faqs"            ON faqs              FOR SELECT USING (is_active = true);
CREATE POLICY "public_read_our_values"      ON our_values        FOR SELECT USING (is_active = true);
CREATE POLICY "public_read_about_us"        ON about_us          FOR SELECT USING (true);
CREATE POLICY "public_read_social_links"    ON social_links      FOR SELECT USING (is_active = true);

-- ── Appointment policies ──────────────────────────────────────────────────────

-- Anyone can INSERT a new appointment (guest booking)
CREATE POLICY "public_insert_appointment"   ON appointments      FOR INSERT WITH CHECK (true);

-- Logged-in patients can read their own appointments
CREATE POLICY "patient_read_own_appointments" ON appointments    FOR SELECT
    USING (user_id = auth.uid() OR is_admin());

-- Admins can read & manage all appointments
CREATE POLICY "admin_manage_appointments"   ON appointments
    FOR ALL USING (is_admin());

CREATE POLICY "admin_read_appt_history"     ON appointment_status_history
    FOR SELECT USING (is_admin());

CREATE POLICY "admin_insert_appt_history"   ON appointment_status_history
    FOR INSERT WITH CHECK (is_admin());

-- ── Contact form ──────────────────────────────────────────────────────────────

CREATE POLICY "public_insert_contact"       ON contact_submissions FOR INSERT WITH CHECK (true);
CREATE POLICY "admin_manage_contact"        ON contact_submissions FOR ALL   USING (is_admin());

-- ── Admin tables (only admins) ────────────────────────────────────────────────

CREATE POLICY "admin_manage_admin_users"    ON admin_users         FOR ALL USING (has_role('super_admin'));
CREATE POLICY "admin_read_audit_log"        ON audit_log           FOR SELECT USING (is_admin());
CREATE POLICY "admin_insert_audit_log"      ON audit_log           FOR INSERT WITH CHECK (is_admin());

-- ── CMS write policies (admins only) ─────────────────────────────────────────

CREATE POLICY "admin_write_hospitals"        ON hospitals              FOR ALL USING (is_admin());
CREATE POLICY "admin_write_specialities"     ON specialities           FOR ALL USING (is_admin());
CREATE POLICY "admin_write_doctors"          ON doctors                FOR ALL USING (has_role('doctor_manager'));
CREATE POLICY "admin_write_doctor_hospitals" ON doctor_hospitals       FOR ALL USING (has_role('doctor_manager'));
CREATE POLICY "admin_write_doctor_education" ON doctor_education       FOR ALL USING (has_role('doctor_manager'));
CREATE POLICY "admin_write_doctor_awards"    ON doctor_awards          FOR ALL USING (has_role('doctor_manager'));
CREATE POLICY "admin_write_schedule_tmpl"    ON doctor_schedule_templates FOR ALL USING (has_role('doctor_manager'));
CREATE POLICY "admin_write_slots"            ON doctor_slots           FOR ALL USING (has_role('doctor_manager'));
CREATE POLICY "admin_write_services"         ON services               FOR ALL USING (has_role('content_manager'));
CREATE POLICY "admin_write_service_features" ON service_features       FOR ALL USING (has_role('content_manager'));
CREATE POLICY "admin_write_service_spec"     ON service_specialities   FOR ALL USING (has_role('content_manager'));
CREATE POLICY "admin_write_blog_posts"       ON blog_posts             FOR ALL USING (has_role('content_manager'));
CREATE POLICY "admin_write_blog_spec"        ON blog_post_specialities FOR ALL USING (has_role('content_manager'));
CREATE POLICY "admin_write_hero_slides"      ON hero_slides            FOR ALL USING (has_role('content_manager'));
CREATE POLICY "admin_write_stats_bar"        ON stats_bar              FOR ALL USING (has_role('content_manager'));
CREATE POLICY "admin_write_nav_items"        ON nav_items              FOR ALL USING (is_admin());
CREATE POLICY "admin_write_faqs"             ON faqs                   FOR ALL USING (has_role('content_manager'));
CREATE POLICY "admin_write_our_values"       ON our_values             FOR ALL USING (has_role('content_manager'));
CREATE POLICY "admin_write_about_us"         ON about_us               FOR ALL USING (has_role('content_manager'));
CREATE POLICY "admin_write_social_links"     ON social_links           FOR ALL USING (is_admin());


-- =============================================================================
-- 12. HELPER FUNCTIONS & TRIGGERS
-- =============================================================================

-- ── 12a. Auto-update updated_at on every mutation ────────────────────────────

CREATE OR REPLACE FUNCTION trigger_set_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$;

-- Attach to every table that has updated_at
DO $$
DECLARE
    tbl TEXT;
BEGIN
    FOREACH tbl IN ARRAY ARRAY[
        'hospitals','specialities','doctors','services','blog_posts',
        'hero_slides','faqs','about_us','appointments',
        'contact_submissions','admin_users'
    ] LOOP
        EXECUTE format(
            'CREATE TRIGGER set_updated_at BEFORE UPDATE ON %I
             FOR EACH ROW EXECUTE FUNCTION trigger_set_updated_at()', tbl
        );
    END LOOP;
END;
$$;

-- ── 12b. Decrement / increment slot booking count on appointment changes ──────

CREATE OR REPLACE FUNCTION sync_slot_booking_count()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
    -- New booking confirmed
    IF (TG_OP = 'INSERT' OR (TG_OP = 'UPDATE' AND NEW.status = 'confirmed'))
       AND NEW.slot_id IS NOT NULL THEN
        UPDATE doctor_slots
        SET current_bookings = current_bookings + 1
        WHERE id = NEW.slot_id;
    END IF;

    -- Booking cancelled / no-show — free the slot
    IF TG_OP = 'UPDATE'
       AND OLD.status = 'confirmed'
       AND NEW.status IN ('cancelled', 'no_show')
       AND NEW.slot_id IS NOT NULL THEN
        UPDATE doctor_slots
        SET current_bookings = GREATEST(0, current_bookings - 1)
        WHERE id = NEW.slot_id;
    END IF;

    -- Mark slot as fully booked when capacity reached
    UPDATE doctor_slots
    SET status = CASE
        WHEN current_bookings >= max_bookings THEN 'booked'::slot_status
        ELSE 'available'::slot_status
    END
    WHERE id = COALESCE(NEW.slot_id, OLD.slot_id);

    RETURN NEW;
END;
$$;

CREATE TRIGGER trg_sync_slot_count
AFTER INSERT OR UPDATE ON appointments
FOR EACH ROW EXECUTE FUNCTION sync_slot_booking_count();

-- ── 12c. Auto-log appointment status changes to history ──────────────────────

CREATE OR REPLACE FUNCTION log_appointment_status_change()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
    IF TG_OP = 'UPDATE' AND OLD.status IS DISTINCT FROM NEW.status THEN
        INSERT INTO appointment_status_history
            (appointment_id, old_status, new_status, changed_by)
        VALUES
            (NEW.id, OLD.status, NEW.status, auth.uid());
    END IF;
    RETURN NEW;
END;
$$;

CREATE TRIGGER trg_log_appt_status
AFTER UPDATE ON appointments
FOR EACH ROW EXECUTE FUNCTION log_appointment_status_change();

-- ── 12d. Generate daily slots from schedule templates ────────────────────────
--    Call:  SELECT generate_slots_for_doctor('doctor-uuid', '2026-08-01', '2026-08-31');

CREATE OR REPLACE FUNCTION generate_slots_for_doctor(
    p_doctor_id UUID,
    p_from_date DATE,
    p_to_date   DATE
)
RETURNS INT LANGUAGE plpgsql SECURITY DEFINER AS $$
DECLARE
    tmpl        RECORD;
    cur_date    DATE;
    slot_start  TIME;
    slot_end    TIME;
    slots_added INT := 0;
BEGIN
    FOR tmpl IN
        SELECT * FROM doctor_schedule_templates
        WHERE doctor_id = p_doctor_id AND is_active = true
    LOOP
        cur_date := p_from_date;
        WHILE cur_date <= p_to_date LOOP
            -- Match day of week (PostgreSQL: 0=Sunday ... 6=Saturday)
            IF lower(to_char(cur_date, 'Day')) LIKE lower(tmpl.day_of_week::TEXT) || '%' THEN
                slot_start := tmpl.start_time;
                WHILE slot_start + (tmpl.slot_duration || ' minutes')::INTERVAL <= tmpl.end_time LOOP
                    slot_end := slot_start + (tmpl.slot_duration || ' minutes')::INTERVAL;

                    INSERT INTO doctor_slots
                        (doctor_id, hospital_id, slot_date, start_time, end_time,
                         consultation_mode, max_bookings)
                    VALUES
                        (p_doctor_id, tmpl.hospital_id, cur_date, slot_start, slot_end,
                         tmpl.consultation_mode, 1)
                    ON CONFLICT (doctor_id, slot_date, start_time, consultation_mode) DO NOTHING;

                    slots_added := slots_added + 1;
                    slot_start  := slot_end;
                END LOOP;
            END IF;
            cur_date := cur_date + INTERVAL '1 day';
        END LOOP;
    END LOOP;
    RETURN slots_added;
END;
$$;

-- ── 12e. Increment blog post view count (safe, no auth needed) ───────────────

CREATE OR REPLACE FUNCTION increment_blog_view(p_slug TEXT)
RETURNS VOID LANGUAGE sql SECURITY DEFINER AS $$
    UPDATE blog_posts SET view_count = view_count + 1 WHERE slug = p_slug;
$$;

-- ── 12f. Search doctors (full-text + fee + experience filters) ───────────────

CREATE OR REPLACE FUNCTION search_doctors(
    p_query         TEXT    DEFAULT NULL,
    p_speciality_id UUID    DEFAULT NULL,
    p_min_exp       INT     DEFAULT NULL,
    p_max_fee       NUMERIC DEFAULT NULL,
    p_hospital_id   UUID    DEFAULT NULL
)
RETURNS SETOF doctors LANGUAGE sql STABLE SECURITY DEFINER AS $$
    SELECT d.*
    FROM   doctors d
    WHERE  d.is_active = true
      AND (p_query IS NULL OR
           to_tsvector('english', d.name || ' ' || COALESCE(d.designation,''))
           @@ plainto_tsquery('english', p_query))
      AND (p_speciality_id IS NULL OR d.speciality_id = p_speciality_id)
      AND (p_min_exp       IS NULL OR d.experience_years >= p_min_exp)
      AND (p_max_fee       IS NULL OR d.consultation_fee <= p_max_fee)
      AND (p_hospital_id   IS NULL OR EXISTS (
               SELECT 1 FROM doctor_hospitals dh
               WHERE  dh.doctor_id = d.id AND dh.hospital_id = p_hospital_id))
    ORDER  BY d.is_featured DESC, d.sort_order, d.name;
$$;


-- =============================================================================
-- 13. STORAGE BUCKET POLICIES
-- =============================================================================

-- Public read on all public buckets
CREATE POLICY "public_read_doctor_photos"
    ON storage.objects FOR SELECT
    USING (bucket_id = 'doctor-photos');

CREATE POLICY "public_read_blog_images"
    ON storage.objects FOR SELECT
    USING (bucket_id = 'blog-images');

CREATE POLICY "public_read_service_images"
    ON storage.objects FOR SELECT
    USING (bucket_id = 'service-images');

CREATE POLICY "public_read_hero_images"
    ON storage.objects FOR SELECT
    USING (bucket_id = 'hero-images');

CREATE POLICY "public_read_cms_assets"
    ON storage.objects FOR SELECT
    USING (bucket_id = 'cms-assets');

-- Admin write on public buckets
CREATE POLICY "admin_upload_doctor_photos"
    ON storage.objects FOR INSERT
    WITH CHECK (bucket_id = 'doctor-photos' AND is_admin());

CREATE POLICY "admin_upload_blog_images"
    ON storage.objects FOR INSERT
    WITH CHECK (bucket_id = 'blog-images' AND is_admin());

CREATE POLICY "admin_upload_service_images"
    ON storage.objects FOR INSERT
    WITH CHECK (bucket_id = 'service-images' AND is_admin());

CREATE POLICY "admin_upload_hero_images"
    ON storage.objects FOR INSERT
    WITH CHECK (bucket_id = 'hero-images' AND is_admin());

CREATE POLICY "admin_upload_cms_assets"
    ON storage.objects FOR INSERT
    WITH CHECK (bucket_id = 'cms-assets' AND is_admin());

CREATE POLICY "admin_delete_public_objects"
    ON storage.objects FOR DELETE
    USING (bucket_id IN ('doctor-photos','blog-images','service-images','hero-images','cms-assets')
           AND is_admin());

-- Private appointment-docs: only the owning user or an admin
CREATE POLICY "owner_read_appt_docs"
    ON storage.objects FOR SELECT
    USING (
        bucket_id = 'appointment-docs'
        AND (auth.uid()::TEXT = (storage.foldername(name))[1] OR is_admin())
    );

CREATE POLICY "owner_upload_appt_docs"
    ON storage.objects FOR INSERT
    WITH CHECK (
        bucket_id = 'appointment-docs'
        AND auth.uid()::TEXT = (storage.foldername(name))[1]
    );


-- =============================================================================
-- END OF SCHEMA
-- =============================================================================
