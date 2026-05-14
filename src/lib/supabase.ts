import { createClient } from '@supabase/supabase-js';
import type { AppState } from '../app/types';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

// Only create client when env vars are present (won't throw in local dev without Supabase)
export const supabase =
  supabaseUrl && supabaseAnonKey
    ? createClient(supabaseUrl, supabaseAnonKey)
    : null;

// ── Auth helpers ──────────────────────────────────────────────────────────────

export async function signUp(email: string, password: string) {
  if (!supabase) throw new Error('Supabase not configured');
  const { data, error } = await supabase.auth.signUp({ email, password });
  if (error) throw error;
  return data;
}

export async function signIn(email: string, password: string) {
  if (!supabase) throw new Error('Supabase not configured');
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) throw error;
  return data;
}

export async function signOut() {
  if (!supabase) throw new Error('Supabase not configured');
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
}

export async function getSession() {
  if (!supabase) return null;
  const { data } = await supabase.auth.getSession();
  return data.session;
}

// ── User profile ──────────────────────────────────────────────────────────────

export interface UserProfile {
  id?: string;
  user_id?: string;
  display_name?: string;
  first_name?: string;
  last_name?: string;
  username?: string;
  bio?: string;
  location?: string;
  occupation?: string;
  education?: string;
  phone?: string;
  avatar_id?: string;        // emoji avatar id e.g. "avatar-1"
  avatar_data?: string;      // base64 photo upload
  profile_visibility?: 'public' | 'friends' | 'private';
  show_email?: boolean;
  show_phone?: boolean;
  show_progress?: boolean;
  show_streak?: boolean;
  show_badges?: boolean;
  show_activity?: boolean;
  allow_messages?: boolean;
  allow_friend_requests?: boolean;
  show_on_leaderboard?: boolean;
  allow_tagging?: boolean;
  learning_goals?: string[];
  updated_at?: string;
}

const PROFILE_KEY = 'signlearn-profile';

export function saveProfileLocal(profile: UserProfile): void {
  try { localStorage.setItem(PROFILE_KEY, JSON.stringify(profile)); } catch { /* quota */ }
}

export function loadProfileLocal(): UserProfile | null {
  try {
    const raw = localStorage.getItem(PROFILE_KEY);
    return raw ? (JSON.parse(raw) as UserProfile) : null;
  } catch { return null; }
}

export async function saveProfile(userId: string, profile: UserProfile): Promise<void> {
  saveProfileLocal(profile);
  if (!supabase) return;
  const { error } = await supabase
    .from('user_profiles')
    .upsert({ id: userId, ...profile, updated_at: new Date().toISOString() });
  if (error) throw error;
}

export async function loadProfile(userId: string): Promise<UserProfile | null> {
  if (!supabase) return loadProfileLocal();
  const { data, error } = await supabase
    .from('user_profiles')
    .select('*')
    .eq('id', userId)
    .single();
  if (error) return loadProfileLocal();
  const profile = data as UserProfile;
  saveProfileLocal(profile);
  return profile;
}

// ── Progress persistence ──────────────────────────────────────────────────────

export async function saveProgress(userId: string, state: AppState) {
  if (!supabase) return;
  const { error } = await supabase
    .from('user_progress')
    .upsert({ user_id: userId, state, updated_at: new Date().toISOString() });
  if (error) throw error;
}

export async function loadProgress(userId: string): Promise<AppState | null> {
  if (!supabase) return null;
  const { data, error } = await supabase
    .from('user_progress')
    .select('state')
    .eq('user_id', userId)
    .single();
  if (error) return null;
  return (data as { state: AppState } | null)?.state ?? null;
}
