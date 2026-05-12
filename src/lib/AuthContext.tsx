import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  ReactNode,
} from 'react';
import type { User, Session } from '@supabase/supabase-js';
import { supabase, signIn, signUp, signOut as sbSignOut } from './supabase';

// ── Types ─────────────────────────────────────────────────────────────────────

export type AuthMode = 'loading' | 'guest' | 'authenticated';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  /** loading = checking session, guest = no account, authenticated = logged in */
  mode: AuthMode;
  /** true while a sign-in/sign-up/sign-out network call is in flight */
  submitting: boolean;
  authError: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  continueAsGuest: () => void;
  clearAuthError: () => void;
}

// ── Context ───────────────────────────────────────────────────────────────────

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// ── Provider ──────────────────────────────────────────────────────────────────

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser]           = useState<User | null>(null);
  const [session, setSession]     = useState<Session | null>(null);
  const [mode, setMode]           = useState<AuthMode>('loading');
  const [submitting, setSubmitting] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  // Restore session on mount, then listen for auth state changes
  useEffect(() => {
    if (!supabase) {
      // Supabase not configured — drop straight to guest mode
      setMode('guest');
      return;
    }

    supabase.auth.getSession().then(({ data }) => {
      const s = data.session;
      setSession(s);
      setUser(s?.user ?? null);
      setMode(s ? 'authenticated' : 'guest');
    });

    const { data: listener } = supabase.auth.onAuthStateChange((_event, s) => {
      setSession(s);
      setUser(s?.user ?? null);
      setMode(s ? 'authenticated' : 'guest');
    });

    return () => listener.subscription.unsubscribe();
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    setSubmitting(true);
    setAuthError(null);
    try {
      await signIn(email, password);
      // mode updates via onAuthStateChange
    } catch (err) {
      setAuthError(err instanceof Error ? err.message : 'Sign in failed');
    } finally {
      setSubmitting(false);
    }
  }, []);

  const register = useCallback(async (email: string, password: string) => {
    setSubmitting(true);
    setAuthError(null);
    try {
      await signUp(email, password);
      // Supabase sends a confirmation email; session may or may not be set
      // depending on "Confirm email" setting in Supabase Auth settings
    } catch (err) {
      setAuthError(err instanceof Error ? err.message : 'Sign up failed');
    } finally {
      setSubmitting(false);
    }
  }, []);

  const logout = useCallback(async () => {
    setSubmitting(true);
    try {
      if (supabase) await sbSignOut();
    } finally {
      setUser(null);
      setSession(null);
      setMode('guest');
      setSubmitting(false);
    }
  }, []);

  const continueAsGuest = useCallback(() => {
    setMode('guest');
  }, []);

  const clearAuthError = useCallback(() => setAuthError(null), []);

  return (
    <AuthContext.Provider value={{
      user, session, mode, submitting, authError,
      login, register, logout, continueAsGuest, clearAuthError,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

// ── Hook ──────────────────────────────────────────────────────────────────────

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
