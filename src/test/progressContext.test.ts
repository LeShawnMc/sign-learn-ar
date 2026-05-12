import { describe, it, expect } from 'vitest';
import { DEFAULT_STATE } from '../app/context/AppStateContext';
import type { AppState } from '../app/types';

describe('progress state logic', () => {
  it('increments completedLessons and totalPoints on lesson complete', () => {
    const state: AppState = { ...DEFAULT_STATE };
    const score = 80;
    const pointsEarned = Math.floor(score / 10) * 5; // 40
    const next: AppState = {
      ...state,
      userProgress: {
        ...state.userProgress,
        completedLessons: state.userProgress.completedLessons + 1,
        totalPoints: state.userProgress.totalPoints + pointsEarned,
      },
    };
    expect(next.userProgress.completedLessons).toBe(state.userProgress.completedLessons + 1);
    expect(next.userProgress.totalPoints).toBe(state.userProgress.totalPoints + 40);
  });

  it('does not count the same sign twice when practicing today', () => {
    const state: AppState = {
      ...DEFAULT_STATE,
      userProgress: { ...DEFAULT_STATE.userProgress, practicedToday: ['sign-1'], todayProgress: 1 },
    };
    const signId = 'sign-1';
    const already = state.userProgress.practicedToday.includes(signId);
    const next: AppState = {
      ...state,
      userProgress: {
        ...state.userProgress,
        practicedToday: already ? state.userProgress.practicedToday : [...state.userProgress.practicedToday, signId],
        todayProgress: already ? state.userProgress.todayProgress : state.userProgress.todayProgress + 1,
      },
    };
    expect(next.userProgress.practicedToday).toHaveLength(1);
    expect(next.userProgress.todayProgress).toBe(1);
  });

  it('adds a new sign to masteredSigns at 80+ mastery', () => {
    const state: AppState = { ...DEFAULT_STATE };
    const signId = 'sign-hello';
    const masteryLevel = 85;
    const isMastered = masteryLevel >= 80;
    const alreadyMastered = state.userProgress.masteredSigns.includes(signId);
    const next = isMastered && !alreadyMastered
      ? {
          ...state,
          userProgress: {
            ...state.userProgress,
            masteredSigns: [...state.userProgress.masteredSigns, signId],
            totalSigns: state.userProgress.totalSigns + 1,
          },
        }
      : state;
    expect(next.userProgress.masteredSigns).toContain('sign-hello');
    expect(next.userProgress.totalSigns).toBe(state.userProgress.totalSigns + 1);
  });

  it('clamps todayProgress to dailyGoal', () => {
    const state: AppState = {
      ...DEFAULT_STATE,
      userProgress: { ...DEFAULT_STATE.userProgress, todayProgress: 9, dailyGoal: 10 },
    };
    const signsCompleted = 5;
    const next: AppState = {
      ...state,
      userProgress: {
        ...state.userProgress,
        todayProgress: Math.min(state.userProgress.todayProgress + signsCompleted, state.userProgress.dailyGoal),
      },
    };
    expect(next.userProgress.todayProgress).toBe(10);
  });

  it('updates longestStreak when new streak exceeds it', () => {
    const state: AppState = {
      ...DEFAULT_STATE,
      userProgress: { ...DEFAULT_STATE.userProgress, currentStreak: 12, longestStreak: 12 },
    };
    const newStreak = state.userProgress.currentStreak + 1;
    const next: AppState = {
      ...state,
      userProgress: {
        ...state.userProgress,
        currentStreak: newStreak,
        longestStreak: Math.max(newStreak, state.userProgress.longestStreak),
      },
    };
    expect(next.userProgress.currentStreak).toBe(13);
    expect(next.userProgress.longestStreak).toBe(13);
  });
});
