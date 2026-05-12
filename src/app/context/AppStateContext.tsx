import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import type { AppState, OnboardingStep, Language } from '../types';

export const DEFAULT_STATE: AppState = {
  onboardingComplete: false,
  currentStep: 'welcome' as OnboardingStep,
  selectedLanguage: 'ASL' as Language,
  learningGoals: [],
  userProgress: {
    currentStreak: 5,
    totalSigns: 28,
    completedLessons: 3,
    dailyGoal: 10,
    todayProgress: 7,
    isPremium: false,
    totalPoints: 450,
    level: 3,
    completedCourses: [],
    enrolledCourses: [],
    masteredSigns: [],
    practicedToday: [],
    lastActiveDate: new Date().toISOString().split('T')[0],
    totalStudyTime: 120,
    longestStreak: 12,
    weeklyGoal: 50,
    monthlyGoal: 200,
  },
  currentLesson: null,
  hasARCapability: false,
  permissionsGranted: { camera: false, microphone: false },
  certificates: [],
  achievements: [
    { id: 'first-sign', title: 'First Sign', description: 'Learn your first sign', icon: '👋', category: 'learning', unlocked: true, unlockedDate: '2025-01-01', progress: 1, maxProgress: 1, points: 10 },
    { id: 'streak-3', title: '3 Day Streak', description: 'Practice for 3 days in a row', icon: '🔥', category: 'streak', unlocked: true, unlockedDate: '2025-01-03', progress: 3, maxProgress: 3, points: 25 },
    { id: 'streak-7', title: '7 Day Streak', description: 'Practice for 7 days in a row', icon: '🔥', category: 'streak', unlocked: false, progress: 5, maxProgress: 7, points: 50 },
    { id: 'streak-30', title: '30 Day Streak', description: 'Practice for 30 days in a row', icon: '🔥', category: 'streak', unlocked: false, progress: 5, maxProgress: 30, points: 200 },
    { id: 'streak-100', title: '100 Day Streak', description: 'Practice for 100 days in a row', icon: '🔥', category: 'streak', unlocked: false, progress: 5, maxProgress: 100, points: 500 },
    { id: 'signs-10', title: '10 Signs Mastered', description: 'Master 10 different signs', icon: '⭐', category: 'mastery', unlocked: true, unlockedDate: '2025-01-05', progress: 10, maxProgress: 10, points: 50 },
    { id: 'signs-50', title: '50 Signs Mastered', description: 'Master 50 different signs', icon: '⭐', category: 'mastery', unlocked: false, progress: 28, maxProgress: 50, points: 150 },
    { id: 'signs-100', title: '100 Signs Mastered', description: 'Master 100 different signs', icon: '⭐', category: 'mastery', unlocked: false, progress: 28, maxProgress: 100, points: 300 },
    { id: 'signs-500', title: '500 Signs Mastered', description: 'Master 500 different signs', icon: '⭐', category: 'mastery', unlocked: false, progress: 28, maxProgress: 500, points: 1000 },
    { id: 'courses-1', title: 'First Course Complete', description: 'Complete your first course', icon: '🎓', category: 'learning', unlocked: false, progress: 0, maxProgress: 1, points: 100 },
    { id: 'courses-5', title: '5 Courses Complete', description: 'Complete 5 courses', icon: '🎓', category: 'learning', unlocked: false, progress: 0, maxProgress: 5, points: 300 },
    { id: 'courses-10', title: '10 Courses Complete', description: 'Complete 10 courses', icon: '🎓', category: 'learning', unlocked: false, progress: 0, maxProgress: 10, points: 600 },
  ],
  enrolledCourses: [],
  notifications: [],
};

interface AppStateContextType {
  state: AppState;
  setState: React.Dispatch<React.SetStateAction<AppState>>;
}

const AppStateContext = createContext<AppStateContextType | undefined>(undefined);

export function AppStateProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AppState>(() => {
    const saved = localStorage.getItem('signlearn-state');
    if (saved) {
      try { return JSON.parse(saved); } catch { /* fall through */ }
    }
    return DEFAULT_STATE;
  });

  useEffect(() => {
    localStorage.setItem('signlearn-state', JSON.stringify(state));
  }, [state]);

  // Reset daily progress on a new day
  useEffect(() => {
    const today = new Date().toISOString().split('T')[0];
    if (state.userProgress.lastActiveDate !== today) {
      setState(prev => ({
        ...prev,
        userProgress: { ...prev.userProgress, lastActiveDate: today, practicedToday: [], todayProgress: 0 },
      }));
    }
  }, [state.userProgress.lastActiveDate]);

  return <AppStateContext.Provider value={{ state, setState }}>{children}</AppStateContext.Provider>;
}

export function useAppState() {
  const ctx = useContext(AppStateContext);
  if (!ctx) throw new Error('useAppState must be used within AppStateProvider');
  return ctx;
}
