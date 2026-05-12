import { lazy, Suspense, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import { AppProvider, useApp } from './context/AppContext';
import { ThemeProvider } from './context/ThemeContext';
import { SkipToMain } from './hooks';
import { ErrorBoundary } from './components/ErrorBoundary';
import { AppContainer } from './components/AppContainer';

const WelcomeScreen       = lazy(() => import('./components/onboarding/WelcomeScreen').then(m => ({ default: m.WelcomeScreen })));
const ARCheckScreen       = lazy(() => import('./components/onboarding/ARCheckScreen').then(m => ({ default: m.ARCheckScreen })));
const PermissionsScreen   = lazy(() => import('./components/onboarding/PermissionsScreen').then(m => ({ default: m.PermissionsScreen })));
const CalibrationScreen   = lazy(() => import('./components/onboarding/CalibrationScreen').then(m => ({ default: m.CalibrationScreen })));
const RoomScanScreen      = lazy(() => import('./components/onboarding/RoomScanScreen').then(m => ({ default: m.RoomScanScreen })));
const LanguageSelectScreen = lazy(() => import('./components/onboarding/LanguageSelectScreen').then(m => ({ default: m.LanguageSelectScreen })));
const GoalsSetupScreen    = lazy(() => import('./components/onboarding/GoalsSetupScreen').then(m => ({ default: m.GoalsSetupScreen })));
const FirstLessonScreen   = lazy(() => import('./components/onboarding/FirstLessonScreen').then(m => ({ default: m.FirstLessonScreen })));
const HomeScreen          = lazy(() => import('./components/HomeScreen').then(m => ({ default: m.HomeScreen })));

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
  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
    <div style={{ width: 32, height: 32, border: '3px solid var(--color-primary, #4169E1)', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.7s linear infinite' }} />
  </div>
);

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
        <ThemeProvider>
          <AppProvider>
            <AppContainer>
              <SkipToMain />
              <AppRoutes />
            </AppContainer>
          </AppProvider>
        </ThemeProvider>
      </BrowserRouter>
    </ErrorBoundary>
  );
}
