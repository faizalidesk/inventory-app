-- ===================================================
-- DESKTOPALIE DATABASE SCHEMA & INITIAL SEED DATA
-- ===================================================
-- Jalankan skrip ini di Supabase SQL Editor.

-- ---------------------------------------------------
-- 0. HAPUS TABEL INVENTARIS LAMA (CLEANUP)
-- ---------------------------------------------------
DROP TABLE IF EXISTS public.stock_in CASCADE;
DROP TABLE IF EXISTS public.stock_out CASCADE;
DROP TABLE IF EXISTS public.products CASCADE;
DROP TABLE IF EXISTS public.categories CASCADE;
DROP TABLE IF EXISTS public.suppliers CASCADE;
DROP TABLE IF EXISTS public.tenants CASCADE;

-- ---------------------------------------------------
-- TABEL PROFILES (Disesuaikan untuk Register & Login)
-- ---------------------------------------------------
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  username TEXT UNIQUE,
  bio TEXT DEFAULT 'Independent designer & developer',
  avatar_url TEXT,
  location TEXT DEFAULT 'Indonesia',
  website TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS for Profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow select profiles" ON public.profiles;
DROP POLICY IF EXISTS "Allow insert profiles" ON public.profiles;
DROP POLICY IF EXISTS "Allow update profiles" ON public.profiles;

CREATE POLICY "Allow select profiles" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Allow insert profiles" ON public.profiles FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow update profiles" ON public.profiles FOR UPDATE USING (true);

-- ---------------------------------------------------
-- TABEL 1: PROJECTS
-- ---------------------------------------------------
CREATE TABLE IF NOT EXISTS public.projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  type TEXT NOT NULL DEFAULT 'Web application',
  description TEXT,
  progress INTEGER DEFAULT 0,
  status TEXT DEFAULT 'In progress',
  tone TEXT DEFAULT 'violet',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS for Projects
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow select projects" ON public.projects;
DROP POLICY IF EXISTS "Allow insert projects" ON public.projects;
DROP POLICY IF EXISTS "Allow update projects" ON public.projects;
DROP POLICY IF EXISTS "Allow delete projects" ON public.projects;

CREATE POLICY "Allow select projects" ON public.projects FOR SELECT USING (true);
CREATE POLICY "Allow insert projects" ON public.projects FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow update projects" ON public.projects FOR UPDATE USING (true);
CREATE POLICY "Allow delete projects" ON public.projects FOR DELETE USING (true);

-- ---------------------------------------------------
-- TABEL 2: EXPERIMENTS
-- ---------------------------------------------------
CREATE TABLE IF NOT EXISTS public.experiments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  type TEXT NOT NULL DEFAULT 'Motion',
  description TEXT,
  status TEXT DEFAULT 'Draft',
  tone TEXT DEFAULT 'teal',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS for Experiments
ALTER TABLE public.experiments ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow select experiments" ON public.experiments;
DROP POLICY IF EXISTS "Allow insert experiments" ON public.experiments;
DROP POLICY IF EXISTS "Allow update experiments" ON public.experiments;
DROP POLICY IF EXISTS "Allow delete experiments" ON public.experiments;

CREATE POLICY "Allow select experiments" ON public.experiments FOR SELECT USING (true);
CREATE POLICY "Allow insert experiments" ON public.experiments FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow update experiments" ON public.experiments FOR UPDATE USING (true);
CREATE POLICY "Allow delete experiments" ON public.experiments FOR DELETE USING (true);

-- ---------------------------------------------------
-- TABEL 3: NOTES
-- ---------------------------------------------------
CREATE TABLE IF NOT EXISTS public.notes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  type TEXT NOT NULL DEFAULT 'Design note',
  description TEXT,
  status TEXT DEFAULT 'Draft',
  tone TEXT DEFAULT 'amber',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS for Notes
ALTER TABLE public.notes ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow select notes" ON public.notes;
DROP POLICY IF EXISTS "Allow insert notes" ON public.notes;
DROP POLICY IF EXISTS "Allow update notes" ON public.notes;
DROP POLICY IF EXISTS "Allow delete notes" ON public.notes;

CREATE POLICY "Allow select notes" ON public.notes FOR SELECT USING (true);
CREATE POLICY "Allow insert notes" ON public.notes FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow update notes" ON public.notes FOR UPDATE USING (true);
CREATE POLICY "Allow delete notes" ON public.notes FOR DELETE USING (true);

-- ---------------------------------------------------
-- TABEL 4: BOOKMARKS
-- ---------------------------------------------------
CREATE TABLE IF NOT EXISTS public.bookmarks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  url TEXT NOT NULL,
  source TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS for Bookmarks
ALTER TABLE public.bookmarks ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow select bookmarks" ON public.bookmarks;
DROP POLICY IF EXISTS "Allow insert bookmarks" ON public.bookmarks;
DROP POLICY IF EXISTS "Allow delete bookmarks" ON public.bookmarks;

CREATE POLICY "Allow select bookmarks" ON public.bookmarks FOR SELECT USING (true);
CREATE POLICY "Allow insert bookmarks" ON public.bookmarks FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow delete bookmarks" ON public.bookmarks FOR DELETE USING (true);

-- ---------------------------------------------------
-- SEED DATA (DATA AWAL)
-- ---------------------------------------------------
INSERT INTO public.projects (slug, title, type, description, progress, status, tone)
VALUES 
  ('orbit-analytics', 'Orbit Analytics', 'Web application', 'A focused analytics experience that turns complex product data into clear decisions.', 84, 'In progress', 'violet'),
  ('frame-archive', 'Frame Archive', 'Digital experience', 'A cinematic digital archive designed around discovery and thoughtful interaction.', 100, 'Published', 'teal'),
  ('mono-systems', 'Mono Systems', 'Design experiment', 'An exploration of modular interfaces and expressive typography.', 62, 'Exploring', 'rose')
ON CONFLICT (slug) DO NOTHING;

INSERT INTO public.experiments (slug, title, type, description, status, tone)
VALUES 
  ('kinetic-type', 'Kinetic type studies', 'Motion', 'Typographic interactions exploring rhythm, scale, and intent.', 'Published', 'violet'),
  ('ambient-interface', 'Ambient interface', 'UI', 'A responsive surface that changes character with context.', 'Draft', 'teal')
ON CONFLICT (slug) DO NOTHING;

INSERT INTO public.notes (slug, title, type, description, status, tone)
VALUES 
  ('designing-with-constraints', 'Designing with constraints', 'Design note', 'Constraints can create a clearer and more recognizable visual language.', 'May 20', 'amber'),
  ('motion-with-purpose', 'Motion with purpose', 'Interaction note', 'A checklist for using animation to explain change rather than decorate it.', 'May 18', 'amber')
ON CONFLICT (slug) DO NOTHING;

INSERT INTO public.bookmarks (title, url, source)
VALUES 
  ('Designing Better Interfaces', 'https://www.designbetter.co', 'Design Better'),
  ('Web Content Accessibility Guidelines', 'https://www.w3.org/WAI/standards-guidelines/wcag/', 'W3C'),
  ('React documentation', 'https://react.dev', 'React')
ON CONFLICT DO NOTHING;
