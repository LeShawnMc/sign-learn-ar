import type { UserProgress } from '../types';
import { useAppState } from './AppStateContext';
import { applyAchievementChecks } from './AchievementsContext';
import { track } from '../../lib/analytics';

export function useProgress() {
  const { state, setState } = useAppState();

  return {
    userProgress: state.userProgress,

    updateUserProgress: (progress: Partial<UserProgress>) =>
      setState(prev => {
        const next = { ...prev, userProgress: { ...prev.userProgress, ...progress } };
        return applyAchievementChecks(next) ?? next;
      }),

    completeLesson: (lessonId: string, score: number) => {
      track('lesson_completed', { lessonId, score });
      setState(prev => {
        const pointsEarned = Math.floor(score / 10) * 5;
        const next: typeof prev = {
          ...prev,
          userProgress: {
            ...prev.userProgress,
            completedLessons: prev.userProgress.completedLessons + 1,
            totalPoints: prev.userProgress.totalPoints + pointsEarned,
          },
          notifications: [{
            id: `notif-${Date.now()}`,
            title: 'Lesson Complete! 🎉',
            message: `You scored ${score}% and earned ${pointsEarned} points!`,
            time: new Date().toISOString(),
            read: false,
            type: 'lesson' as const,
          }, ...prev.notifications],
        };
        return applyAchievementChecks(next) ?? next;
      });
    },

    practiceSign: (signId: string) =>
      setState(prev => {
        const already = prev.userProgress.practicedToday.includes(signId);
        return {
          ...prev,
          userProgress: {
            ...prev.userProgress,
            practicedToday: already ? prev.userProgress.practicedToday : [...prev.userProgress.practicedToday, signId],
            todayProgress: already ? prev.userProgress.todayProgress : prev.userProgress.todayProgress + 1,
          },
        };
      }),

    updateSignMastery: (signId: string, masteryLevel: number) =>
      setState(prev => {
        if (masteryLevel < 80 || prev.userProgress.masteredSigns.includes(signId)) return prev;
        const next: typeof prev = {
          ...prev,
          userProgress: {
            ...prev.userProgress,
            masteredSigns: [...prev.userProgress.masteredSigns, signId],
            totalSigns: prev.userProgress.totalSigns + 1,
            totalPoints: prev.userProgress.totalPoints + 10,
          },
        };
        return applyAchievementChecks(next) ?? next;
      }),

    updateDailyProgress: (signsCompleted: number) =>
      setState(prev => ({
        ...prev,
        userProgress: {
          ...prev.userProgress,
          todayProgress: Math.min(
            prev.userProgress.todayProgress + signsCompleted,
            prev.userProgress.dailyGoal
          ),
        },
      })),

    incrementStreak: () =>
      setState(prev => {
        const newStreak = prev.userProgress.currentStreak + 1;
        const next: typeof prev = {
          ...prev,
          userProgress: {
            ...prev.userProgress,
            currentStreak: newStreak,
            longestStreak: Math.max(newStreak, prev.userProgress.longestStreak),
          },
        };
        return applyAchievementChecks(next) ?? next;
      }),

    addStudyTime: (minutes: number) =>
      setState(prev => ({
        ...prev,
        userProgress: {
          ...prev.userProgress,
          totalStudyTime: prev.userProgress.totalStudyTime + minutes,
        },
      })),

    upgradeToPremium: () =>
      setState(prev => ({
        ...prev,
        userProgress: { ...prev.userProgress, isPremium: true },
        notifications: [{
          id: `notif-${Date.now()}`,
          title: 'Welcome to Premium! 👑',
          message: 'You now have access to all premium features!',
          time: new Date().toISOString(),
          read: false,
          type: 'achievement' as const,
        }, ...prev.notifications],
      })),
  };
}
