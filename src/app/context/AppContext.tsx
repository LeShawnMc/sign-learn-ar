/**
 * AppContext — backward-compatible aggregation layer.
 *
 * Components continue calling useApp() as before.
 * State is now split across 5 focused context files:
 *   OnboardingContext, ProgressContext, CourseContext,
 *   AchievementsContext, NotificationsContext
 *
 * AppStateProvider (in AppStateContext.tsx) holds the single AppState
 * and persists it to localStorage. All domain hooks read/write via it.
 */

import { ReactNode } from 'react';
import { AppStateProvider } from './AppStateContext';
import { useOnboarding } from './OnboardingContext';
import { useProgress } from './ProgressContext';
import { useCourses } from './CourseContext';
import { useAchievements } from './AchievementsContext';
import { useNotifications } from './NotificationsContext';

export function AppProvider({ children }: { children: ReactNode }) {
  return <AppStateProvider>{children}</AppStateProvider>;
}

export function useApp() {
  return {
    ...useOnboarding(),
    ...useProgress(),
    ...useCourses(),
    ...useAchievements(),
    ...useNotifications(),
  };
}
