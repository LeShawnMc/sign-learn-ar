-- Sign Learn AR — Supabase Schema
-- Run this in your Supabase project: Dashboard → SQL Editor → New query → Paste → Run

-- ── user_progress table ───────────────────────────────────────────────────────
-- Stores the entire AppState JSON blob per user.
-- upsert by user_id so each user has exactly one row.

CREATE TABLE IF NOT EXISTS public.user_progress (
  id          uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     uuid        NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  state       jsonb       NOT NULL,
  updated_at  timestamptz NOT NULL DEFAULT now()
);

-- Index for fast lookups by user
CREATE INDEX IF NOT EXISTS user_progress_user_id_idx ON public.user_progress (user_id);

-- ── Row Level Security ────────────────────────────────────────────────────────
-- Each user can only read and write their own row.

ALTER TABLE public.user_progress ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own progress"
  ON public.user_progress FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own progress"
  ON public.user_progress FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own progress"
  ON public.user_progress FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own progress"
  ON public.user_progress FOR DELETE
  USING (auth.uid() = user_id);

-- ── user_profiles table (optional, for display name / avatar) ─────────────────
-- Created automatically when a user signs up via the trigger below.

CREATE TABLE IF NOT EXISTS public.user_profiles (
  id           uuid        PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name text,
  avatar_url   text,
  created_at   timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own profile"
  ON public.user_profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON public.user_profiles FOR UPDATE
  USING (auth.uid() = id);

-- Auto-create a profile row when a new user signs up
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER AS $$
BEGIN
  INSERT INTO public.user_profiles (id, display_name)
  VALUES (
    new.id,
    COALESCE(new.raw_user_meta_data->>'display_name', split_part(new.email, '@', 1))
  );
  RETURN new;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
