import type { Notification } from '../types';
import { useAppState } from './AppStateContext';

export function useNotifications() {
  const { state, setState } = useAppState();

  return {
    notifications: state.notifications,

    addNotification: (notification: Omit<Notification, 'id'>) =>
      setState(prev => ({
        ...prev,
        notifications: [{ id: `notif-${Date.now()}`, ...notification }, ...prev.notifications],
      })),

    markNotificationAsRead: (notificationId: string) =>
      setState(prev => ({
        ...prev,
        notifications: prev.notifications.map(n =>
          n.id === notificationId ? { ...n, read: true } : n
        ),
      })),

    clearAllNotifications: () =>
      setState(prev => ({ ...prev, notifications: [] })),
  };
}
