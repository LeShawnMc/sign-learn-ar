import React, { lazy, Suspense, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import { AppProvider, useApp } from './context/AppContext';
import { ThemeProvider } from './context/ThemeContext';
import { SkipToMain } from './hooks';
import { ErrorBoundary } from './components/ErrorBoundary';
import { AppContainer } from './components/AppContainer';
import { AuthProvider, useAuth } from '../lib/AuthContext';
import { AuthScreen } from './components/AuthScreen';
import { initAnalytics, track } from '../lib/analytics';
import { checkStreakReminder } from '../lib/pushNotifications';

initAnalytics();

const WelcomeScreen       = lazy(() => import('./components/onboarding/WelcomeScreen').then(m => ({ default: m.WelcomeScreen })));
const ARCheckScreen       = lazy(() => import('./components/onboarding/ARCheckScreen').then(m => ({ default: m.ARCheckScreen })));
const PermissionsScreen   = lazy(() => import('./components/onboarding/PermissionsScreen').then(m => ({ default: m.PermissionsScreen })));
const CalibrationScreen   = lazy(() => import('./components/onboarding/CalibrationScreen').then(m => ({ default: m.CalibrationScreen })));
const RoomScanScreen      = lazy(() => import('./components/onboarding/RoomScanScreen').then(m => ({ default: m.RoomScanScreen })));
const LanguageSelectScreen = lazy(() => import('./components/onboarding/LanguageSelectScreen').then(m => ({ default: m.LanguageSelectScreen })));
const GoalsSetupScreen    = lazy(() => import('./components/onboarding/GoalsSetupScreen').then(m => ({ default: m.GoalsSetupScreen })));
const FirstLessonScreen   = lazy(() => import('./components/onboarding/FirstLessonScreen').then(m => ({ default: m.FirstLessonScreen })));
const HomeScreen          = lazy(() => import('./components/HomeScreen').then(m => ({ default: m.HomeScreen })));
const PrivacyPolicy       = lazy(() => import('./components/PrivacyPolicy').then(m => ({ default: m.PrivacyPolicy })));
const TermsOfService      = lazy(() => import('./components/TermsOfService').then(m => ({ default: m.TermsOfService })));
const SignTrainer         = lazy(() => import('./components/SignTrainer').then(m => ({ default: m.SignTrainer })));

const ONBOARDING_ROUTES: Record<string, string> = {
  'welcome':         '/onboarding/welcome',
  'ar-check':        '/onboarding/ar-check',
  'permissions':     '/onboarding/permissions',
  'calibration':     '/onboarding/calibration',
  'room-scan':       '/onboarding/room-scan',
  'language-select': '/onboarding/language-select',
  'goals-setup':     '/onboarding/goals-setup',
  'first-lesson':    '/onboarding/first-lesson',
};

const ScreenFallback = () => (
  <div style={{
    position: 'fixed', inset: 0,
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    background: '#0F0F23',
    zIndex: 50,
  }}>
    <div style={{
      width: 40, height: 40,
      border: '3px solid #00F5FF',
      borderTopColor: 'transparent',
      borderRadius: '50%',
      animation: 'spin 0.7s linear infinite',
    }} />
  </div>
);

// Shows AuthScreen until the user is signed in or chose guest mode
function AuthGate({ children }: { children: React.ReactNode }) {
  const { mode } = useAuth();
  if (mode === 'loading') return null; // ScreenFallback already covers this via Suspense
  if (mode === 'guest' || mode === 'authenticated') return <>{children}</>;
  return <AuthScreen />;
}

// Keeps the URL in sync with AppContext step state
function OnboardingSync() {
  const { currentStep, onboardingComplete } = useApp();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (onboardingComplete) {
      navigate('/home', { replace: true });
      return;
    }
    const target = ONBOARDING_ROUTES[currentStep];
    if (target && location.pathname !== target) {
      navigate(target, { replace: true });
    }
  }, [currentStep, onboardingComplete, navigate, location.pathname]);

  return null;
}

function AppRoutes() {
  const { onboardingComplete } = useApp();

  useEffect(() => {
    track('page_view', { path: window.location.pathname });
    checkStreakReminder();
  }, []);

  return (
    <>
      <OnboardingSync />
      <ErrorBoundary>
        <Suspense fallback={<ScreenFallback />}>
          <Routes>
            {/* Root redirect */}
            <Route
              path="/"
              element={<Navigate to={onboardingComplete ? '/home' : '/onboarding/welcome'} replace />}
            />

            {/* Onboarding */}
            <Route path="/onboarding/welcome"         element={<WelcomeScreen />} />
            <Route path="/onboarding/ar-check"        element={<ARCheckScreen />} />
            <Route path="/onboarding/permissions"     element={<PermissionsScreen />} />
            <Route path="/onboarding/calibration"     element={<CalibrationScreen />} />
            <Route path="/onboarding/room-scan"       element={<RoomScanScreen />} />
            <Route path="/onboarding/language-select" element={<LanguageSelectScreen />} />
            <Route path="/onboarding/goals-setup"     element={<GoalsSetupScreen />} />
            <Route path="/onboarding/first-lesson"    element={<FirstLessonScreen />} />

            {/* Main app */}
            <Route path="/home" element={<HomeScreen />} />

            {/* Legal */}
            <Route path="/privacy" element={<PrivacyPolicy onBack={() => window.history.back()} />} />
            <Route path="/terms"   element={<TermsOfService onBack={() => window.history.back()} />} />

            {/* Tools */}
            <Route path="/train"   element={<SignTrainer onBack={() => window.history.back()} />} />

            {/* Catch-all */}
            <Route
              path="*"
              element={<Navigate to={onboardingComplete ? '/home' : '/onboarding/welcome'} replace />}
            />
          </Routes>
        </Suspense>
      </ErrorBoundary>
    </>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <AuthProvider>
          <ThemeProvider>
            <AppProvider>
              <AppContainer>
                <AuthGate>
                  <SkipToMain />
                  <AppRoutes />
                </AuthGate>
              </AppContainer>
            </AppProvider>
          </ThemeProvider>
        </AuthProvider>
      </BrowserRouter>
    </ErrorBoundary>
  );
}
