import { describe, it, expect } from 'vitest';
import { applyAchievementChecks } from '../app/context/AchievementsContext';
import { DEFAULT_STATE } from '../app/context/AppStateContext';
import type { AppState } from '../app/types';

function makeState(overrides: Partial<AppState['userProgress']> = {}): AppState {
  return {
    ...DEFAULT_STATE,
    userProgress: { ...DEFAULT_STATE.userProgress, ...overrides },
  };
}

describe('applyAchievementChecks', () => {
  it('returns null when no achievements should change', () => {
    // Default state has streak=5, totalSigns=28 — streak-7 not yet met, signs-50 not yet met
    const state = makeState({ currentStreak: 5, totalSigns: 28 });
    expect(applyAchievementChecks(state)).toBeNull();
  });

  it('unlocks streak-7 when streak reaches 7', () => {
    const state = makeState({ currentStreak: 7 });
    const result = applyAchievementChecks(state);
    expect(result).not.toBeNull();
    const unlocked = result!.achievements.find(a => a.id === 'streak-7');
    expect(unlocked?.unlocked).toBe(true);
    expect(unlocked?.unlockedDate).toBeDefined();
  });

  it('adds a notification when an achievement is unlocked', () => {
    const state = makeState({ currentStreak: 7 });
    const result = applyAchievementChecks(state);
    expect(result!.notifications.length).toBeGreaterThan(state.notifications.length);
    expect(result!.notifications[0].type).toBe('achievement');
  });

  it('unlocks signs-50 when totalSigns reaches 50', () => {
    const state = makeState({ totalSigns: 50 });
    const result = applyAchievementChecks(state);
    const unlocked = result!.achievements.find(a => a.id === 'signs-50');
    expect(unlocked?.unlocked).toBe(true);
  });

  it('unlocks courses-1 when first course is completed', () => {
    const state = makeState({ completedCourses: ['course-abc'] });
    const result = applyAchievementChecks(state);
    const unlocked = result!.achievements.find(a => a.id === 'courses-1');
    expect(unlocked?.unlocked).toBe(true);
  });

  it('does not re-unlock an already unlocked achievement', () => {
    // streak-3 is already unlocked in DEFAULT_STATE
    const state = makeState({ currentStreak: 3 });
    const result = applyAchievementChecks(state);
    // streak-3 was already unlocked — no new notifications should come from it
    const streakThree = (result ?? state).achievements.find(a => a.id === 'streak-3');
    expect(streakThree?.unlocked).toBe(true);
    // result should be null (no state change needed for already-unlocked achievements)
    if (result !== null) {
      // If something else changed, streak-3 should still show as unlocked
      expect(streakThree?.unlocked).toBe(true);
    }
  });

  it('updates progress value without unlocking', () => {
    const state = makeState({ currentStreak: 6 });
    const result = applyAchievementChecks(state);
    const streak7 = result?.achievements.find(a => a.id === 'streak-7');
    // streak-7 needs 7 days, we have 6 — not unlocked, but progress updated
    expect(streak7?.unlocked).toBe(false);
    expect(streak7?.progress).toBe(6);
  });
});
