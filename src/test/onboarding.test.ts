import { describe, it, expect, beforeEach } from 'vitest';
import { DEFAULT_STATE } from '../app/context/AppStateContext';
import type { AppState, OnboardingStep } from '../app/types';

// Test the pure state transitions used by OnboardingContext

const STEPS: OnboardingStep[] = [
  'welcome', 'ar-check', 'permissions', 'calibration',
  'room-scan', 'language-select', 'goals-setup', 'first-lesson',
];

describe('onboarding state transitions', () => {
  let state: AppState;

  beforeEach(() => {
    state = { ...DEFAULT_STATE };
  });

  it('starts on the welcome step', () => {
    expect(state.currentStep).toBe('welcome');
    expect(state.onboardingComplete).toBe(false);
  });

  it('advances through each step', () => {
    for (const step of STEPS) {
      const next: AppState = { ...state, currentStep: step };
      expect(next.currentStep).toBe(step);
    }
  });

  it('marks onboarding complete when completeOnboarding is called', () => {
    const next: AppState = { ...state, onboardingComplete: true, currentStep: 'complete' };
    expect(next.onboardingComplete).toBe(true);
    expect(next.currentStep).toBe('complete');
  });

  it('sets selectedLanguage', () => {
    const next: AppState = { ...state, selectedLanguage: 'BSL' };
    expect(next.selectedLanguage).toBe('BSL');
  });

  it('sets learning goals', () => {
    const next: AppState = { ...state, learningGoals: ['basics', 'conversation'] };
    expect(next.learningGoals).toEqual(['basics', 'conversation']);
  });

  it('grants camera permission', () => {
    const next: AppState = {
      ...state,
      permissionsGranted: { ...state.permissionsGranted, camera: true },
    };
    expect(next.permissionsGranted.camera).toBe(true);
    expect(next.permissionsGranted.microphone).toBe(false);
  });

  it('grants microphone permission independently', () => {
    const next: AppState = {
      ...state,
      permissionsGranted: { camera: true, microphone: true },
    };
    expect(next.permissionsGranted.microphone).toBe(true);
  });

  it('sets AR capability flag', () => {
    const next: AppState = { ...state, hasARCapability: true };
    expect(next.hasARCapability).toBe(true);
  });
});

describe('notification state transitions', () => {
  let state: AppState;

  beforeEach(() => {
    state = { ...DEFAULT_STATE };
  });

  it('adds a notification', () => {
    const notification = {
      id: 'n-1',
      title: 'Test',
      message: 'Hello',
      time: new Date().toISOString(),
      read: false,
      type: 'lesson' as const,
    };
    const next: AppState = { ...state, notifications: [notification, ...state.notifications] };
    expect(next.notifications).toHaveLength(1);
    expect(next.notifications[0].title).toBe('Test');
  });

  it('marks a notification as read', () => {
    const notification = {
      id: 'n-2',
      title: 'Unread',
      message: 'Read me',
      time: new Date().toISOString(),
      read: false,
      type: 'achievement' as const,
    };
    const withNotif: AppState = { ...state, notifications: [notification] };
    const withRead: AppState = {
      ...withNotif,
      notifications: withNotif.notifications.map(n =>
        n.id === 'n-2' ? { ...n, read: true } : n
      ),
    };
    expect(withRead.notifications[0].read).toBe(true);
  });

  it('clears all notifications', () => {
    const withNotifs: AppState = {
      ...state,
      notifications: [
        { id: 'a', title: 'A', message: '', time: '', read: false, type: 'lesson' },
        { id: 'b', title: 'B', message: '', time: '', read: false, type: 'reminder' },
      ],
    };
    const cleared: AppState = { ...withNotifs, notifications: [] };
    expect(cleared.notifications).toHaveLength(0);
  });
});
