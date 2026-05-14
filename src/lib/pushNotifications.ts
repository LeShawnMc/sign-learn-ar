// src/lib/pushNotifications.ts

const ICON = '/pwa-192x192.png';
const SW_KEY = 'signlearn-push-prefs';

export type PushPrefs = {
  enabled: boolean;
  reminderTime: string; // "HH:MM"
  reminderDays: Record<string, boolean>;
};

export function savePushPrefs(prefs: PushPrefs): void {
  try { localStorage.setItem(SW_KEY, JSON.stringify(prefs)); } catch { /* quota */ }
}

export function loadPushPrefs(): PushPrefs {
  try {
    const raw = localStorage.getItem(SW_KEY);
    if (raw) return JSON.parse(raw) as PushPrefs;
  } catch { /* ignore */ }
  return {
    enabled: false,
    reminderTime: '18:00',
    reminderDays: { monday: true, tuesday: true, wednesday: true, thursday: true, friday: true, saturday: true, sunday: false },
  };
}

export async function requestPermission(): Promise<NotificationPermission> {
  if (!('Notification' in window)) return 'denied';
  if (Notification.permission === 'granted') return 'granted';
  return Notification.requestPermission();
}

export async function sendNotification(title: string, body: string): Promise<void> {
  const perm = await requestPermission();
  if (perm !== 'granted') return;

  const reg = 'serviceWorker' in navigator
    ? await navigator.serviceWorker.ready.catch(() => null)
    : null;

  if (reg) {
    await reg.showNotification(title, { body, icon: ICON, badge: ICON, tag: 'signlearn' });
  } else {
    new Notification(title, { body, icon: ICON });
  }
}

// Check on app open whether a streak reminder should fire today
export async function checkStreakReminder(): Promise<void> {
  const prefs = loadPushPrefs();
  if (!prefs.enabled) return;

  const now = new Date();
  const dayNames = ['sunday','monday','tuesday','wednesday','thursday','friday','saturday'];
  const todayKey = dayNames[now.getDay()];
  if (!prefs.reminderDays[todayKey]) return;

  const [hh, mm] = prefs.reminderTime.split(':').map(Number);
  const lastFiredKey = 'signlearn-reminder-last';
  const lastFired = localStorage.getItem(lastFiredKey);
  const todayStr = now.toISOString().slice(0, 10);

  // Don't fire twice on same day
  if (lastFired === todayStr) return;

  // Only fire within 5-minute window around the scheduled time
  const scheduled = new Date(now);
  scheduled.setHours(hh, mm, 0, 0);
  const diffMs = Math.abs(now.getTime() - scheduled.getTime());
  if (diffMs > 5 * 60 * 1000) return;

  localStorage.setItem(lastFiredKey, todayStr);
  await sendNotification('Time to practice! 🤟', "Don't break your streak — open Sign Learn AR for today's lesson.");
}
