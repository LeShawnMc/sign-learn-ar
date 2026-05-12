import type { Notification } from '../types';

export const notifications: Notification[] = [
  {
    id: '1',
    title: 'Daily Streak!',
    message: 'You\'ve maintained a 5-day learning streak. Keep it up!',
    time: '2 hours ago',
    read: false,
    type: 'achievement',
  },
  {
    id: '2',
    title: 'New Lesson Available',
    message: 'Check out "Family & Friends" - perfect for your learning goals.',
    time: '5 hours ago',
    read: false,
    type: 'lesson',
  },
  {
    id: '3',
    title: 'Practice Reminder',
    message: 'Don\'t forget to practice today! You have 3 signs left to reach your daily goal.',
    time: '1 day ago',
    read: true,
    type: 'reminder',
  },
  {
    id: '4',
    title: 'Achievement Unlocked',
    message: 'Congratulations! You\'ve learned 25 signs!',
    time: '2 days ago',
    read: true,
    type: 'achievement',
  },
];

export const achievementBadges = [
  {
    id: 'first-sign',
    title: 'First Sign',
    description: 'Learned your first sign',
    icon: '👋',
    unlocked: true,
  },
  {
    id: '5-day-streak',
    title: '5-Day Streak',
    description: 'Practiced for 5 consecutive days',
    icon: '🔥',
    unlocked: true,
  },
  {
    id: '25-signs',
    title: 'Quick Learner',
    description: 'Mastered 25 signs',
    icon: '📚',
    unlocked: true,
  },
  {
    id: '50-signs',
    title: 'Sign Master',
    description: 'Mastered 50 signs',
    icon: '🏆',
    unlocked: false,
  },
  {
    id: 'first-conversation',
    title: 'Conversationalist',
    description: 'Completed your first conversation lesson',
    icon: '💬',
    unlocked: false,
  },
];

export const weeklyProgress = [
  { day: 'Mon', signs: 8 },
  { day: 'Tue', signs: 12 },
  { day: 'Wed', signs: 10 },
  { day: 'Thu', signs: 15 },
  { day: 'Fri', signs: 7 },
  { day: 'Sat', signs: 9 },
  { day: 'Sun', signs: 11 },
];
