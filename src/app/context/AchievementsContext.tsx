import type { AppState } from '../types';
import { useAppState } from './AppStateContext';

// Pure function — returns updated state if any achievements were unlocked, otherwise null
export function applyAchievementChecks(state: AppState): AppState | null {
  const { userProgress, achievements } = state;
  let updated = [...achievements];
  let changed = false;
  const newNotifications = [...state.notifications];

  const checks: { id: string; met: boolean; progress: number }[] = [
    { id: 'streak-3',   met: userProgress.currentStreak >= 3,   progress: Math.min(userProgress.currentStreak, 3) },
    { id: 'streak-7',   met: userProgress.currentStreak >= 7,   progress: Math.min(userProgress.currentStreak, 7) },
    { id: 'streak-30',  met: userProgress.currentStreak >= 30,  progress: Math.min(userProgress.currentStreak, 30) },
    { id: 'streak-100', met: userProgress.currentStreak >= 100, progress: Math.min(userProgress.currentStreak, 100) },
    { id: 'signs-10',  met: userProgress.totalSigns >= 10,  progress: Math.min(userProgress.totalSigns, 10) },
    { id: 'signs-50',  met: userProgress.totalSigns >= 50,  progress: Math.min(userProgress.totalSigns, 50) },
    { id: 'signs-100', met: userProgress.totalSigns >= 100, progress: Math.min(userProgress.totalSigns, 100) },
    { id: 'signs-500', met: userProgress.totalSigns >= 500, progress: Math.min(userProgress.totalSigns, 500) },
    { id: 'courses-1',  met: userProgress.completedCourses.length >= 1,  progress: Math.min(userProgress.completedCourses.length, 1) },
    { id: 'courses-5',  met: userProgress.completedCourses.length >= 5,  progress: Math.min(userProgress.completedCourses.length, 5) },
    { id: 'courses-10', met: userProgress.completedCourses.length >= 10, progress: Math.min(userProgress.completedCourses.length, 10) },
  ];

  for (const check of checks) {
    const idx = updated.findIndex(a => a.id === check.id);
    if (idx === -1) continue;
    const a = updated[idx];

    if (!a.unlocked && check.met) {
      updated[idx] = { ...a, unlocked: true, unlockedDate: new Date().toISOString(), progress: a.maxProgress };
      newNotifications.unshift({
        id: `notif-${Date.now()}-${check.id}`,
        title: 'Achievement Unlocked! 🏆',
        message: `${a.title}: ${a.description}`,
        time: new Date().toISOString(),
        read: false,
        type: 'achievement',
      });
      changed = true;
    } else if (!a.unlocked && a.progress !== check.progress) {
      updated[idx] = { ...a, progress: check.progress };
      changed = true;
    }
  }

  if (!changed) return null;
  return { ...state, achievements: updated, notifications: newNotifications };
}

export function useAchievements() {
  const { state, setState } = useAppState();

  const checkAchievements = () =>
    setState(prev => applyAchievementChecks(prev) ?? prev);

  return {
    achievements: state.achievements,
    checkAchievements,

    unlockAchievement: (achievementId: string) =>
      setState(prev => {
        const achievement = prev.achievements.find(a => a.id === achievementId);
        if (!achievement || achievement.unlocked) return prev;

        return {
          ...prev,
          achievements: prev.achievements.map(a =>
            a.id === achievementId
              ? { ...a, unlocked: true, unlockedDate: new Date().toISOString(), progress: a.maxProgress }
              : a
          ),
          userProgress: {
            ...prev.userProgress,
            totalPoints: prev.userProgress.totalPoints + achievement.points,
          },
          notifications: [{
            id: `notif-${Date.now()}`,
            title: 'Achievement Unlocked! 🏆',
            message: `${achievement.title}: ${achievement.description}`,
            time: new Date().toISOString(),
            read: false,
            type: 'achievement' as const,
          }, ...prev.notifications],
        };
      }),

    updateAchievementProgress: (achievementId: string, progress: number) =>
      setState(prev => ({
        ...prev,
        achievements: prev.achievements.map(a =>
          a.id === achievementId ? { ...a, progress: Math.min(progress, a.maxProgress) } : a
        ),
      })),
  };
}
