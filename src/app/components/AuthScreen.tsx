import React, { useState, useRef } from 'react';
import { useAuth } from '../../lib/AuthContext';

export function AuthScreen() {
  const { login, register, continueAsGuest, submitting, authError, clearAuthError, mode } = useAuth();

  const [tab, setTab]           = useState<'signin' | 'signup'>('signin');
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm]   = useState('');
  const [localError, setLocalError] = useState<string | null>(null);
  const [signupDone, setSignupDone] = useState(false);

  const emailRef = useRef<HTMLInputElement>(null);

  const error = localError ?? authError;

  const switchTab = (t: 'signin' | 'signup') => {
    setTab(t);
    setLocalError(null);
    clearAuthError();
    setSignupDone(false);
    setPassword('');
    setConfirm('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError(null);
    clearAuthError();

    if (!email.trim()) { setLocalError('Email is required'); return; }
    if (password.length < 6) { setLocalError('Password must be at least 6 characters'); return; }

    if (tab === 'signup') {
      if (password !== confirm) { setLocalError('Passwords do not match'); return; }
      await register(email, password);
      // If no auth error after register, show confirmation message
      setSignupDone(true);
    } else {
      await login(email, password);
    }
  };

  // Show loading spinner while the session is being restored
  if (mode === 'loading') {
    return (
      <div style={{
        position: 'fixed', inset: 0,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: '#0F0F23',
      }}>
        <div style={{ width: 40, height: 40, border: '3px solid #00F5FF', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.7s linear infinite' }} />
      </div>
    );
  }

  return (
    <div style={{
      minHeight: '100dvh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      background: '#0F0F23',
      padding: '2rem 1.5rem',
    }}>

      {/* Logo / brand */}
      <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
        <div style={{
          width: 72, height: 72,
          borderRadius: 20,
          background: 'linear-gradient(135deg, #4169E1, #7B3FF2)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          margin: '0 auto 1rem',
          fontSize: '2rem',
        }}>
          ✋
        </div>
        <h1 style={{ color: '#F8FAFC', fontSize: '1.5rem', fontWeight: 700, marginBottom: '0.25rem' }}>
          Sign Learn AR
        </h1>
        <p style={{ color: '#94A3B8', fontSize: '0.875rem' }}>
          Learn sign language through augmented reality
        </p>
      </div>

      {/* Card */}
      <div style={{
        width: '100%',
        maxWidth: 380,
        background: '#1E1E3F',
        borderRadius: 20,
        padding: '1.75rem',
        border: '1px solid rgba(148,163,184,0.15)',
      }}>

        {/* Tabs */}
        <div style={{
          display: 'flex',
          background: 'rgba(15,15,35,0.6)',
          borderRadius: 10,
          padding: 3,
          marginBottom: '1.5rem',
        }}>
          {(['signin', 'signup'] as const).map(t => (
            <button
              key={t}
              onClick={() => switchTab(t)}
              style={{
                flex: 1,
                padding: '0.5rem',
                borderRadius: 8,
                border: 'none',
                cursor: 'pointer',
                fontWeight: 600,
                fontSize: '0.875rem',
                transition: 'all 0.15s',
                background: tab === t ? '#4169E1' : 'transparent',
                color: tab === t ? '#fff' : '#94A3B8',
              }}
            >
              {t === 'signin' ? 'Sign In' : 'Sign Up'}
            </button>
          ))}
        </div>

        {/* Success state after sign-up */}
        {signupDone && !authError ? (
          <div style={{ textAlign: 'center', padding: '1rem 0' }}>
            <div style={{ fontSize: '2.5rem', marginBottom: '0.75rem' }}>📧</div>
            <h2 style={{ color: '#F8FAFC', fontWeight: 600, marginBottom: '0.5rem' }}>Check your email</h2>
            <p style={{ color: '#94A3B8', fontSize: '0.875rem', lineHeight: 1.5 }}>
              We sent a confirmation link to <strong style={{ color: '#F8FAFC' }}>{email}</strong>.
              Click it to activate your account then sign in.
            </p>
            <button
              onClick={() => switchTab('signin')}
              style={{ marginTop: '1.25rem', color: '#00F5FF', background: 'none', border: 'none', cursor: 'pointer', fontSize: '0.875rem', fontWeight: 600 }}
            >
              Back to sign in →
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} noValidate>

            {/* Email */}
            <label style={{ display: 'block', marginBottom: '1rem' }}>
              <span style={{ color: '#94A3B8', fontSize: '0.8rem', fontWeight: 500, display: 'block', marginBottom: '0.4rem' }}>
                Email
              </span>
              <input
                ref={emailRef}
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="you@example.com"
                autoComplete="email"
                disabled={submitting}
                style={{
                  width: '100%',
                  padding: '0.65rem 0.875rem',
                  borderRadius: 10,
                  border: '1px solid rgba(148,163,184,0.25)',
                  background: 'rgba(15,15,35,0.6)',
                  color: '#F8FAFC',
                  fontSize: '0.95rem',
                  outline: 'none',
                  boxSizing: 'border-box',
                }}
              />
            </label>

            {/* Password */}
            <label style={{ display: 'block', marginBottom: tab === 'signup' ? '1rem' : '1.5rem' }}>
              <span style={{ color: '#94A3B8', fontSize: '0.8rem', fontWeight: 500, display: 'block', marginBottom: '0.4rem' }}>
                Password
              </span>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                autoComplete={tab === 'signin' ? 'current-password' : 'new-password'}
                disabled={submitting}
                style={{
                  width: '100%',
                  padding: '0.65rem 0.875rem',
                  borderRadius: 10,
                  border: '1px solid rgba(148,163,184,0.25)',
                  background: 'rgba(15,15,35,0.6)',
                  color: '#F8FAFC',
                  fontSize: '0.95rem',
                  outline: 'none',
                  boxSizing: 'border-box',
                }}
              />
            </label>

            {/* Confirm password (sign-up only) */}
            {tab === 'signup' && (
              <label style={{ display: 'block', marginBottom: '1.5rem' }}>
                <span style={{ color: '#94A3B8', fontSize: '0.8rem', fontWeight: 500, display: 'block', marginBottom: '0.4rem' }}>
                  Confirm Password
                </span>
                <input
                  type="password"
                  value={confirm}
                  onChange={e => setConfirm(e.target.value)}
                  placeholder="••••••••"
                  autoComplete="new-password"
                  disabled={submitting}
                  style={{
                    width: '100%',
                    padding: '0.65rem 0.875rem',
                    borderRadius: 10,
                    border: '1px solid rgba(148,163,184,0.25)',
                    background: 'rgba(15,15,35,0.6)',
                    color: '#F8FAFC',
                    fontSize: '0.95rem',
                    outline: 'none',
                    boxSizing: 'border-box',
                  }}
                />
              </label>
            )}

            {/* Error */}
            {error && (
              <div style={{
                background: 'rgba(255,107,107,0.12)',
                border: '1px solid rgba(255,107,107,0.3)',
                borderRadius: 8,
                padding: '0.6rem 0.875rem',
                color: '#FF6B6B',
                fontSize: '0.8rem',
                marginBottom: '1.25rem',
              }}>
                {error}
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={submitting}
              style={{
                width: '100%',
                padding: '0.75rem',
                borderRadius: 12,
                border: 'none',
                background: submitting ? 'rgba(65,105,225,0.5)' : 'linear-gradient(135deg, #4169E1, #7B3FF2)',
                color: '#fff',
                fontWeight: 700,
                fontSize: '0.95rem',
                cursor: submitting ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem',
              }}
            >
              {submitting && (
                <span style={{ width: 16, height: 16, border: '2px solid rgba(255,255,255,0.4)', borderTopColor: '#fff', borderRadius: '50%', animation: 'spin 0.7s linear infinite', display: 'inline-block' }} />
              )}
              {tab === 'signin' ? 'Sign In' : 'Create Account'}
            </button>
          </form>
        )}
      </div>

      {/* Guest mode */}
      <div style={{ marginTop: '1.5rem', textAlign: 'center' }}>
        <p style={{ color: '#475569', fontSize: '0.8rem', marginBottom: '0.5rem' }}>
          No account needed to explore
        </p>
        <button
          onClick={continueAsGuest}
          style={{
            color: '#94A3B8',
            background: 'none',
            border: '1px solid rgba(148,163,184,0.2)',
            borderRadius: 8,
            padding: '0.5rem 1.25rem',
            cursor: 'pointer',
            fontSize: '0.8rem',
            fontWeight: 500,
          }}
        >
          Continue as Guest
        </button>
        <p style={{ color: '#334155', fontSize: '0.7rem', marginTop: '0.75rem' }}>
          Progress saved locally only — create an account to sync across devices
        </p>
      </div>
    </div>
  );
}
