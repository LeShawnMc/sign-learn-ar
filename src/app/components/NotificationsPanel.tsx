import { motion, AnimatePresence } from 'motion/react';
import { X, Bell, Trophy, BookOpen, Clock } from 'lucide-react';
import { Button } from './ui/button';
import { notifications } from '../data/mockData';

interface NotificationsPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export function NotificationsPanel({ isOpen, onClose }: NotificationsPanelProps) {
  const iconMap = {
    achievement: Trophy,
    lesson: BookOpen,
    reminder: Clock,
    social: Bell,
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 z-40"
            aria-hidden="true"
          />

          {/* Panel */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 bottom-0 w-full max-w-md bg-gray-950 z-50 overflow-y-auto"
            role="dialog"
            aria-labelledby="notifications-title"
            aria-modal="true"
          >
            {/* Header */}
            <div className="sticky top-0 bg-gray-950 border-b border-gray-800 p-6 flex items-center justify-between">
              <h2 id="notifications-title" className="text-xl font-bold text-white">
                Notifications
              </h2>
              <Button
                variant="ghost"
                size="icon"
                className="w-10 h-10 rounded-full hover:bg-gray-900"
                onClick={onClose}
                aria-label="Close notifications"
              >
                <X className="w-5 h-5 text-white" />
              </Button>
            </div>

            {/* Notifications List */}
            <div className="p-6 space-y-3">
              {notifications.length === 0 ? (
                <div className="text-center py-12">
                  <Bell className="w-12 h-12 text-gray-600 mx-auto mb-3" aria-hidden="true" />
                  <p className="text-gray-400">No notifications yet</p>
                </div>
              ) : (
                notifications.map((notification, index) => {
                  const Icon = iconMap[notification.type];
                  return (
                    <motion.div
                      key={notification.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className={`p-4 rounded-xl border transition-colors ${
                        notification.read
                          ? 'bg-gray-900 border-gray-800'
                          : 'bg-blue-900/20 border-blue-800/30'
                      }`}
                      role="article"
                      aria-label={`${notification.title}. ${notification.message}. ${notification.time}`}
                    >
                      <div className="flex gap-3">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                          notification.read ? 'bg-gray-800' : 'bg-blue-600/20'
                        }`} aria-hidden="true">
                          <Icon className={`w-5 h-5 ${notification.read ? 'text-gray-400' : 'text-blue-400'}`} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2 mb-1">
                            <h3 className="font-semibold text-white">{notification.title}</h3>
                            {!notification.read && (
                              <div className="w-2 h-2 rounded-full bg-blue-500 flex-shrink-0 mt-2" aria-label="Unread" />
                            )}
                          </div>
                          <p className="text-sm text-gray-400 mb-2">{notification.message}</p>
                          <p className="text-xs text-gray-500">{notification.time}</p>
                        </div>
                      </div>
                    </motion.div>
                  );
                })
              )}
            </div>

            {/* Mark All as Read Button */}
            {notifications.some(n => !n.read) && (
              <div className="sticky bottom-0 bg-gray-950 border-t border-gray-800 p-6">
                <Button
                  variant="outline"
                  className="w-full bg-gray-900 border-gray-700 hover:bg-gray-800 text-white"
                  aria-label="Mark all notifications as read"
                >
                  Mark All as Read
                </Button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
