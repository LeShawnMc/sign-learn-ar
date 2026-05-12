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
