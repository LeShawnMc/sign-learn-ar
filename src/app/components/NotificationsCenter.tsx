import { useState } from 'react';
import { Button } from './ui/button';
import { useTheme } from '../context/ThemeContext';
import { useApp } from '../context/AppContext';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, 
  Bell,
  BellOff,
  Mail,
  Smartphone,
  Clock,
  UserPlus,
  Award,
  Flame,
  Trophy,
  Calendar,
  Check,
  Trash2,
  Filter,
  Settings,
  Volume2,
  VolumeX,
  ChevronDown,
  ChevronUp,
  Users,
  MessageSquare,
  Heart,
  Star,
  Video,
  BookOpen,
  TrendingUp,
  Zap,
} from 'lucide-react';

interface NotificationsCenterProps {
  onExit: () => void;
}

interface Notification {
  id: string;
  type: 'friend_request' | 'achievement' | 'streak' | 'challenge' | 'event' | 'message' | 'progress' | 'social';
  title: string;
  message: string;
  time: string;
  read: boolean;
  actionable?: boolean;
  icon?: any;
}

export function NotificationsCenter({ onExit }: NotificationsCenterProps) {
  const { theme } = useTheme();
  const { userProgress } = useApp();

  // Notification History State
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: '1',
      type: 'streak',
      title: '🔥 7-Day Streak!',
      message: 'Congratulations! You\'ve maintained a 7-day learning streak. Keep it up!',
      time: '2 minutes ago',
      read: false,
      icon: Flame,
    },
    {
      id: '2',
      type: 'friend_request',
      title: 'New Friend Request',
      message: 'Alex Martinez wants to connect with you',
      time: '15 minutes ago',
      read: false,
      actionable: true,
      icon: UserPlus,
    },
    {
      id: '3',
      type: 'achievement',
      title: 'Achievement Unlocked!',
      message: 'You earned "ASL Alphabet Master" badge for completing all alphabet lessons',
      time: '1 hour ago',
      read: false,
      icon: Award,
    },
    {
      id: '4',
      type: 'event',
      title: 'Live Class Starting Soon',
      message: 'ASL Conversation Practice starts in 30 minutes with instructor Maria Lopez',
      time: '1 hour ago',
      read: false,
      icon: Video,
    },
    {
      id: '5',
      type: 'challenge',
      title: 'Challenge Completed!',
      message: 'You completed "Sign 50 Words Challenge" and earned 500 XP',
      time: '3 hours ago',
      read: true,
      icon: Trophy,
    },
    {
      id: '6',
      type: 'social',
      title: 'Sarah liked your post',
      message: 'Sarah Chen liked your Community Feed post about Deaf culture',
      time: '4 hours ago',
      read: true,
      icon: Heart,
    },
    {
      id: '7',
      type: 'progress',
      title: 'Weekly Progress Report',
      message: 'You practiced 5 hours this week - 25% more than last week!',
      time: '5 hours ago',
      read: true,
      icon: TrendingUp,
    },
    {
      id: '8',
      type: 'message',
      title: 'New Message from Jordan',
      message: 'Jordan Kim: "Hey! Want to practice signing together this weekend?"',
      time: '6 hours ago',
      read: true,
      icon: MessageSquare,
    },
    {
      id: '9',
      type: 'achievement',
      title: 'New Badge Available',
      message: 'You\'re only 3 lessons away from earning "Everyday Phrases Pro" badge',
      time: 'Yesterday',
      read: true,
      icon: Star,
    },
    {
      id: '10',
      type: 'event',
      title: 'Event Reminder',
      message: 'Virtual ASL Meetup tomorrow at 6:00 PM - Don\'t forget to join!',
      time: 'Yesterday',
      read: true,
      icon: Calendar,
    },
    {
      id: '11',
      type: 'streak',
      title: 'Streak at Risk!',
      message: 'You haven\'t practiced today. Complete a lesson to maintain your 6-day streak',
      time: '2 days ago',
      read: true,
      icon: Flame,
    },
    {
      id: '12',
      type: 'friend_request',
      title: 'Friend Request Accepted',
      message: 'Emma Wilson accepted your friend request',
      time: '2 days ago',
      read: true,
      icon: Users,
    },
    {
      id: '13',
      type: 'challenge',
      title: 'New Challenge Available',
      message: 'Try the "Speed Signing Challenge" - Sign 20 words in under 2 minutes',
      time: '3 days ago',
      read: true,
      icon: Zap,
    },
    {
      id: '14',
      type: 'progress',
      title: 'Milestone Reached!',
      message: 'You\'ve learned 100 ASL signs! You\'re making amazing progress',
      time: '3 days ago',
      read: true,
      icon: BookOpen,
    },
  ]);

  // Notification Preferences State
  const [pushNotifications, setPushNotifications] = useState(true);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [notificationSound, setNotificationSound] = useState(true);
  
  // Specific Notification Types
  const [friendRequests, setFriendRequests] = useState(true);
  const [achievements, setAchievements] = useState(true);
  const [streakReminders, setStreakReminders] = useState(true);
  const [challenges, setChallenges] = useState(true);
  const [events, setEvents] = useState(true);
  const [messages, setMessages] = useState(true);
  const [progressUpdates, setProgressUpdates] = useState(true);
  const [socialActivity, setSocialActivity] = useState(true);

  // Daily Reminder Settings
  const [dailyReminders, setDailyReminders] = useState(true);
  const [reminderTime, setReminderTime] = useState('18:00');
  const [reminderDays, setReminderDays] = useState({
    monday: true,
    tuesday: true,
    wednesday: true,
    thursday: true,
    friday: true,
    saturday: true,
    sunday: false,
  });

  // UI State
  const [activeTab, setActiveTab] = useState<'all' | 'unread'>('all');
  const [showPreferences, setShowPreferences] = useState(false);
  const [expandedSections, setExpandedSections] = useState({
    general: true,
    types: true,
    daily: true,
    email: true,
  });

  // Theme-aware colors
  const colors = theme === 'dark'
    ? {
        bg: '#0F0F23',
        cardBg: '#1E1E3F',
        cardHover: '#252541',
        textPrimary: '#F8FAFC',
        textSecondary: '#94A3B8',
        textTertiary: '#64748B',
        border: 'rgba(148, 163, 184, 0.2)',
        iconBg: 'rgba(0, 245, 255, 0.1)',
        iconColor: '#00F5FF',
        accentBg: 'rgba(168, 85, 247, 0.1)',
        accentColor: '#A855F7',
        successBg: 'rgba(34, 197, 94, 0.1)',
        successColor: '#22C55E',
        warningBg: 'rgba(251, 191, 36, 0.1)',
        warningColor: '#FBD500',
        errorBg: 'rgba(239, 68, 68, 0.1)',
        errorColor: '#EF4444',
        infoBg: 'rgba(0, 245, 255, 0.1)',
        infoColor: '#00F5FF',
        blur: 'none',
        shadow: 'none',
        glassBorder: 'none',
      }
    : {
        bg: 'linear-gradient(135deg, #E0F2FE 0%, #EDE9FE 50%, #FCE7F3 100%)',
        cardBg: 'rgba(255, 255, 255, 0.6)',
        cardHover: 'rgba(255, 255, 255, 0.8)',
        textPrimary: '#0F172A',
        textSecondary: '#334155',
        textTertiary: '#64748B',
        border: 'rgba(255, 255, 255, 0.6)',
        iconBg: 'rgba(14, 165, 233, 0.12)',
        iconColor: '#0EA5E9',
        accentBg: 'rgba(168, 85, 247, 0.1)',
        accentColor: '#A855F7',
        successBg: 'rgba(34, 197, 94, 0.1)',
        successColor: '#22C55E',
        warningBg: 'rgba(251, 191, 36, 0.1)',
        warningColor: '#F59E0B',
        errorBg: 'rgba(239, 68, 68, 0.1)',
        errorColor: '#EF4444',
        infoBg: 'rgba(14, 165, 233, 0.12)',
        infoColor: '#0EA5E9',
        blur: 'blur(20px)',
        shadow: '0 8px 32px rgba(31, 38, 135, 0.15)',
        glassBorder: '1px solid rgba(255, 255, 255, 0.6)',
      };

  const getNotificationColor = (type: string) => {
    switch (type) {
      case 'achievement':
        return { bg: colors.warningBg, color: colors.warningColor };
      case 'streak':
        return { bg: colors.errorBg, color: colors.errorColor };
      case 'friend_request':
        return { bg: colors.accentBg, color: colors.accentColor };
      case 'challenge':
        return { bg: colors.successBg, color: colors.successColor };
      case 'event':
        return { bg: colors.infoBg, color: colors.infoColor };
      case 'message':
        return { bg: colors.iconBg, color: colors.iconColor };
      case 'progress':
        return { bg: colors.successBg, color: colors.successColor };
      case 'social':
        return { bg: 'rgba(236, 72, 153, 0.1)', color: '#EC4899' };
      default:
        return { bg: colors.iconBg, color: colors.iconColor };
    }
  };

  const handleMarkAsRead = (id: string) => {
    setNotifications(notifications.map(n => 
      n.id === id ? { ...n, read: true } : n
    ));
  };

  const handleMarkAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
  };

  const handleDeleteNotification = (id: string) => {
    setNotifications(notifications.filter(n => n.id !== id));
  };

  const handleClearAll = () => {
    setNotifications([]);
  };

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections({
      ...expandedSections,
      [section]: !expandedSections[section],
    });
  };

  const toggleDay = (day: keyof typeof reminderDays) => {
    setReminderDays({
      ...reminderDays,
      [day]: !reminderDays[day],
    });
  };

  const unreadCount = notifications.filter(n => !n.read).length;
  const filteredNotifications = activeTab === 'unread' 
    ? notifications.filter(n => !n.read)
    : notifications;

  return (
    <div 
      className="h-full flex flex-col"
      style={{ background: colors.bg, color: colors.textPrimary }}
      role="main"
      aria-labelledby="notifications-center-title"
    >
      {/* Header */}
      <div 
        className="p-4 sm:p-6 border-b"
        style={{ borderBottomColor: colors.border }}
      >
        <div className="flex items-center gap-2 sm:gap-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={onExit}
            style={{ color: colors.textSecondary }}
            aria-label="Close notifications center"
            className="flex-shrink-0"
          >
            <X className="w-6 h-6" />
          </Button>
          <div className="flex-1 min-w-0">
            <h1 
              id="notifications-center-title" 
              className="text-xl sm:text-2xl font-bold truncate"
              style={{ fontFamily: 'Poppins, sans-serif' }}
            >
              Notifications
            </h1>
            <p className="text-sm truncate" style={{ color: colors.textSecondary }}>
              {unreadCount > 0 ? `${unreadCount} unread notification${unreadCount !== 1 ? 's' : ''}` : 'All caught up!'}
            </p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setShowPreferences(!showPreferences)}
            style={{ color: colors.textSecondary }}
            aria-label="Notification settings"
            aria-expanded={showPreferences}
            className="flex-shrink-0"
          >
            <Settings className="w-6 h-6" />
          </Button>
        </div>

        {/* Tabs */}
        {!showPreferences && (
          <div className="flex gap-2 mt-4" role="tablist" aria-label="Notification filters">
            <button
              onClick={() => setActiveTab('all')}
              className="flex-1 px-4 py-2 rounded-lg font-semibold text-sm transition-all"
              style={{
                background: activeTab === 'all' ? colors.iconBg : colors.cardBg,
                color: activeTab === 'all' ? colors.iconColor : colors.textSecondary,
                border: activeTab === 'all' ? `2px solid ${colors.iconColor}` : 'none',
              }}
              role="tab"
              aria-selected={activeTab === 'all'}
              aria-controls="all-notifications"
              tabIndex={activeTab === 'all' ? 0 : -1}
            >
              All ({notifications.length})
            </button>
            <button
              onClick={() => setActiveTab('unread')}
              className="flex-1 px-4 py-2 rounded-lg font-semibold text-sm transition-all"
              style={{
                background: activeTab === 'unread' ? colors.iconBg : colors.cardBg,
                color: activeTab === 'unread' ? colors.iconColor : colors.textSecondary,
                border: activeTab === 'unread' ? `2px solid ${colors.iconColor}` : 'none',
              }}
              role="tab"
              aria-selected={activeTab === 'unread'}
              aria-controls="unread-notifications"
              tabIndex={activeTab === 'unread' ? 0 : -1}
            >
              Unread ({unreadCount})
            </button>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        {!showPreferences ? (
          // Notifications List
          <div 
            className="p-4 sm:p-6"
            role="tabpanel"
            id={`${activeTab}-notifications`}
            aria-labelledby={`${activeTab}-tab`}
          >
            {/* Actions Bar */}
            {notifications.length > 0 && (
              <div className="flex items-center justify-between mb-4">
                <Button
                  variant="ghost"
                  onClick={handleMarkAllAsRead}
                  disabled={unreadCount === 0}
                  className="text-sm"
                  style={{ color: colors.iconColor }}
                  aria-label="Mark all notifications as read"
                >
                  <Check className="w-4 h-4 mr-2" />
                  Mark All Read
                </Button>
                <Button
                  variant="ghost"
                  onClick={handleClearAll}
                  className="text-sm"
                  style={{ color: colors.errorColor }}
                  aria-label="Clear all notifications"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Clear All
                </Button>
              </div>
            )}

            {/* Notifications */}
            {filteredNotifications.length > 0 ? (
              <div className="space-y-3" role="list" aria-label="Notifications">
                {filteredNotifications.map((notification) => {
                  const Icon = notification.icon;
                  const notifColor = getNotificationColor(notification.type);
                  
                  return (
                    <motion.div
                      key={notification.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: -100 }}
                      className="rounded-xl p-4 transition-all"
                      style={{
                        background: notification.read ? colors.cardBg : colors.cardHover,
                        backdropFilter: colors.blur,
                        WebkitBackdropFilter: colors.blur,
                        border: colors.glassBorder,
                        boxShadow: colors.shadow,
                        opacity: notification.read ? 0.7 : 1,
                      }}
                      role="listitem"
                      aria-label={`${notification.title} - ${notification.message} - ${notification.time}`}
                    >
                      <div className="flex gap-3">
                        {/* Icon */}
                        <div 
                          className="flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center"
                          style={{ background: notifColor.bg }}
                          aria-hidden="true"
                        >
                          <Icon className="w-5 h-5" style={{ color: notifColor.color }} />
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2 mb-1">
                            <div className="font-semibold text-sm" style={{ color: colors.textPrimary }}>
                              {notification.title}
                            </div>
                            {!notification.read && (
                              <div 
                                className="flex-shrink-0 w-2 h-2 rounded-full"
                                style={{ background: colors.iconColor }}
                                aria-label="Unread"
                              />
                            )}
                          </div>
                          <p className="text-sm mb-2" style={{ color: colors.textSecondary }}>
                            {notification.message}
                          </p>
                          <div className="flex items-center justify-between">
                            <span className="text-xs" style={{ color: colors.textTertiary }}>
                              {notification.time}
                            </span>
                            <div className="flex gap-2">
                              {!notification.read && (
                                <button
                                  onClick={() => handleMarkAsRead(notification.id)}
                                  className="text-xs px-3 py-1 rounded-lg transition-colors"
                                  style={{
                                    background: colors.iconBg,
                                    color: colors.iconColor,
                                  }}
                                  aria-label={`Mark ${notification.title} as read`}
                                >
                                  Mark Read
                                </button>
                              )}
                              <button
                                onClick={() => handleDeleteNotification(notification.id)}
                                className="text-xs px-3 py-1 rounded-lg transition-colors"
                                style={{
                                  background: colors.errorBg,
                                  color: colors.errorColor,
                                }}
                                aria-label={`Delete ${notification.title}`}
                              >
                                Delete
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-12">
                <div 
                  className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4"
                  style={{ background: colors.iconBg }}
                  aria-hidden="true"
                >
                  <Bell className="w-10 h-10" style={{ color: colors.iconColor }} />
                </div>
                <h3 className="text-lg font-semibold mb-2" style={{ color: colors.textPrimary }}>
                  No {activeTab === 'unread' ? 'unread' : ''} notifications
                </h3>
                <p className="text-sm" style={{ color: colors.textSecondary }}>
                  {activeTab === 'unread' 
                    ? "You're all caught up! Check back later for new updates."
                    : "You don't have any notifications yet."}
                </p>
              </div>
            )}
          </div>
        ) : (
          // Notification Preferences
          <div className="p-4 sm:p-6">
            <h2 className="text-lg font-semibold mb-6" style={{ color: colors.textPrimary }}>
              Notification Preferences
            </h2>

            {/* General Settings */}
            <section aria-labelledby="general-settings-heading" className="mb-6">
              <button
                onClick={() => toggleSection('general')}
                className="w-full flex items-center justify-between mb-4"
                aria-expanded={expandedSections.general}
                aria-controls="general-settings"
              >
                <h3 id="general-settings-heading" className="text-base font-semibold" style={{ color: colors.textPrimary }}>
                  General Settings
                </h3>
                {expandedSections.general ? (
                  <ChevronUp className="w-5 h-5" style={{ color: colors.textSecondary }} aria-hidden="true" />
                ) : (
                  <ChevronDown className="w-5 h-5" style={{ color: colors.textSecondary }} aria-hidden="true" />
                )}
              </button>

              <AnimatePresence>
                {expandedSections.general && (
                  <motion.div
                    id="general-settings"
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden"
                  >
                    <div 
                      className="rounded-xl p-6 space-y-4"
                      style={{
                        background: colors.cardBg,
                        backdropFilter: colors.blur,
                        WebkitBackdropFilter: colors.blur,
                        border: colors.glassBorder,
                        boxShadow: colors.shadow,
                      }}
                    >
                      {/* Push Notifications */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3 flex-1">
                          <Smartphone className="w-5 h-5" style={{ color: colors.textSecondary }} aria-hidden="true" />
                          <div>
                            <div className="font-semibold text-sm" style={{ color: colors.textPrimary }}>
                              Push Notifications
                            </div>
                            <div className="text-xs" style={{ color: colors.textSecondary }}>
                              Receive notifications on your device
                            </div>
                          </div>
                        </div>
                        <button
                          onClick={() => setPushNotifications(!pushNotifications)}
                          className="relative w-12 h-6 rounded-full transition-colors flex-shrink-0"
                          style={{ 
                            background: pushNotifications ? colors.iconColor : colors.border,
                          }}
                          role="switch"
                          aria-checked={pushNotifications}
                          aria-label="Toggle push notifications"
                        >
                          <div 
                            className="absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white transition-transform"
                            style={{
                              transform: pushNotifications ? 'translateX(24px)' : 'translateX(0)',
                            }}
                          />
                        </button>
                      </div>

                      {/* Email Notifications */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3 flex-1">
                          <Mail className="w-5 h-5" style={{ color: colors.textSecondary }} aria-hidden="true" />
                          <div>
                            <div className="font-semibold text-sm" style={{ color: colors.textPrimary }}>
                              Email Notifications
                            </div>
                            <div className="text-xs" style={{ color: colors.textSecondary }}>
                              Receive notifications via email
                            </div>
                          </div>
                        </div>
                        <button
                          onClick={() => setEmailNotifications(!emailNotifications)}
                          className="relative w-12 h-6 rounded-full transition-colors flex-shrink-0"
                          style={{ 
                            background: emailNotifications ? colors.iconColor : colors.border,
                          }}
                          role="switch"
                          aria-checked={emailNotifications}
                          aria-label="Toggle email notifications"
                        >
                          <div 
                            className="absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white transition-transform"
                            style={{
                              transform: emailNotifications ? 'translateX(24px)' : 'translateX(0)',
                            }}
                          />
                        </button>
                      </div>

                      {/* Notification Sound */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3 flex-1">
                          {notificationSound ? (
                            <Volume2 className="w-5 h-5" style={{ color: colors.textSecondary }} aria-hidden="true" />
                          ) : (
                            <VolumeX className="w-5 h-5" style={{ color: colors.textSecondary }} aria-hidden="true" />
                          )}
                          <div>
                            <div className="font-semibold text-sm" style={{ color: colors.textPrimary }}>
                              Notification Sound
                            </div>
                            <div className="text-xs" style={{ color: colors.textSecondary }}>
                              Play sound for new notifications
                            </div>
                          </div>
                        </div>
                        <button
                          onClick={() => setNotificationSound(!notificationSound)}
                          className="relative w-12 h-6 rounded-full transition-colors flex-shrink-0"
                          style={{ 
                            background: notificationSound ? colors.iconColor : colors.border,
                          }}
                          role="switch"
                          aria-checked={notificationSound}
                          aria-label="Toggle notification sound"
                        >
                          <div 
                            className="absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white transition-transform"
                            style={{
                              transform: notificationSound ? 'translateX(24px)' : 'translateX(0)',
                            }}
                          />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </section>

            {/* Notification Types */}
            <section aria-labelledby="notification-types-heading" className="mb-6">
              <button
                onClick={() => toggleSection('types')}
                className="w-full flex items-center justify-between mb-4"
                aria-expanded={expandedSections.types}
                aria-controls="notification-types"
              >
                <h3 id="notification-types-heading" className="text-base font-semibold" style={{ color: colors.textPrimary }}>
                  Notification Types
                </h3>
                {expandedSections.types ? (
                  <ChevronUp className="w-5 h-5" style={{ color: colors.textSecondary }} aria-hidden="true" />
                ) : (
                  <ChevronDown className="w-5 h-5" style={{ color: colors.textSecondary }} aria-hidden="true" />
                )}
              </button>

              <AnimatePresence>
                {expandedSections.types && (
                  <motion.div
                    id="notification-types"
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden"
                  >
                    <div 
                      className="rounded-xl p-6 space-y-4"
                      style={{
                        background: colors.cardBg,
                        backdropFilter: colors.blur,
                        WebkitBackdropFilter: colors.blur,
                        border: colors.glassBorder,
                        boxShadow: colors.shadow,
                      }}
                    >
                      {/* Friend Requests */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3 flex-1">
                          <UserPlus className="w-5 h-5" style={{ color: colors.textSecondary }} aria-hidden="true" />
                          <div className="font-semibold text-sm" style={{ color: colors.textPrimary }}>
                            Friend Requests
                          </div>
                        </div>
                        <button
                          onClick={() => setFriendRequests(!friendRequests)}
                          className="relative w-12 h-6 rounded-full transition-colors flex-shrink-0"
                          style={{ 
                            background: friendRequests ? colors.iconColor : colors.border,
                          }}
                          role="switch"
                          aria-checked={friendRequests}
                          aria-label="Toggle friend request notifications"
                        >
                          <div 
                            className="absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white transition-transform"
                            style={{
                              transform: friendRequests ? 'translateX(24px)' : 'translateX(0)',
                            }}
                          />
                        </button>
                      </div>

                      {/* Achievement Unlocks */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3 flex-1">
                          <Award className="w-5 h-5" style={{ color: colors.textSecondary }} aria-hidden="true" />
                          <div className="font-semibold text-sm" style={{ color: colors.textPrimary }}>
                            Achievement Unlocks
                          </div>
                        </div>
                        <button
                          onClick={() => setAchievements(!achievements)}
                          className="relative w-12 h-6 rounded-full transition-colors flex-shrink-0"
                          style={{ 
                            background: achievements ? colors.iconColor : colors.border,
                          }}
                          role="switch"
                          aria-checked={achievements}
                          aria-label="Toggle achievement notifications"
                        >
                          <div 
                            className="absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white transition-transform"
                            style={{
                              transform: achievements ? 'translateX(24px)' : 'translateX(0)',
                            }}
                          />
                        </button>
                      </div>

                      {/* Streak Reminders */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3 flex-1">
                          <Flame className="w-5 h-5" style={{ color: colors.textSecondary }} aria-hidden="true" />
                          <div className="font-semibold text-sm" style={{ color: colors.textPrimary }}>
                            Streak Reminders
                          </div>
                        </div>
                        <button
                          onClick={() => setStreakReminders(!streakReminders)}
                          className="relative w-12 h-6 rounded-full transition-colors flex-shrink-0"
                          style={{ 
                            background: streakReminders ? colors.iconColor : colors.border,
                          }}
                          role="switch"
                          aria-checked={streakReminders}
                          aria-label="Toggle streak reminder notifications"
                        >
                          <div 
                            className="absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white transition-transform"
                            style={{
                              transform: streakReminders ? 'translateX(24px)' : 'translateX(0)',
                            }}
                          />
                        </button>
                      </div>

                      {/* Challenge Notifications */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3 flex-1">
                          <Trophy className="w-5 h-5" style={{ color: colors.textSecondary }} aria-hidden="true" />
                          <div className="font-semibold text-sm" style={{ color: colors.textPrimary }}>
                            Challenge Notifications
                          </div>
                        </div>
                        <button
                          onClick={() => setChallenges(!challenges)}
                          className="relative w-12 h-6 rounded-full transition-colors flex-shrink-0"
                          style={{ 
                            background: challenges ? colors.iconColor : colors.border,
                          }}
                          role="switch"
                          aria-checked={challenges}
                          aria-label="Toggle challenge notifications"
                        >
                          <div 
                            className="absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white transition-transform"
                            style={{
                              transform: challenges ? 'translateX(24px)' : 'translateX(0)',
                            }}
                          />
                        </button>
                      </div>

                      {/* Event Reminders */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3 flex-1">
                          <Calendar className="w-5 h-5" style={{ color: colors.textSecondary }} aria-hidden="true" />
                          <div className="font-semibold text-sm" style={{ color: colors.textPrimary }}>
                            Event Reminders
                          </div>
                        </div>
                        <button
                          onClick={() => setEvents(!events)}
                          className="relative w-12 h-6 rounded-full transition-colors flex-shrink-0"
                          style={{ 
                            background: events ? colors.iconColor : colors.border,
                          }}
                          role="switch"
                          aria-checked={events}
                          aria-label="Toggle event reminder notifications"
                        >
                          <div 
                            className="absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white transition-transform"
                            style={{
                              transform: events ? 'translateX(24px)' : 'translateX(0)',
                            }}
                          />
                        </button>
                      </div>

                      {/* Messages */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3 flex-1">
                          <MessageSquare className="w-5 h-5" style={{ color: colors.textSecondary }} aria-hidden="true" />
                          <div className="font-semibold text-sm" style={{ color: colors.textPrimary }}>
                            Messages
                          </div>
                        </div>
                        <button
                          onClick={() => setMessages(!messages)}
                          className="relative w-12 h-6 rounded-full transition-colors flex-shrink-0"
                          style={{ 
                            background: messages ? colors.iconColor : colors.border,
                          }}
                          role="switch"
                          aria-checked={messages}
                          aria-label="Toggle message notifications"
                        >
                          <div 
                            className="absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white transition-transform"
                            style={{
                              transform: messages ? 'translateX(24px)' : 'translateX(0)',
                            }}
                          />
                        </button>
                      </div>

                      {/* Progress Updates */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3 flex-1">
                          <TrendingUp className="w-5 h-5" style={{ color: colors.textSecondary }} aria-hidden="true" />
                          <div className="font-semibold text-sm" style={{ color: colors.textPrimary }}>
                            Progress Updates
                          </div>
                        </div>
                        <button
                          onClick={() => setProgressUpdates(!progressUpdates)}
                          className="relative w-12 h-6 rounded-full transition-colors flex-shrink-0"
                          style={{ 
                            background: progressUpdates ? colors.iconColor : colors.border,
                          }}
                          role="switch"
                          aria-checked={progressUpdates}
                          aria-label="Toggle progress update notifications"
                        >
                          <div 
                            className="absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white transition-transform"
                            style={{
                              transform: progressUpdates ? 'translateX(24px)' : 'translateX(0)',
                            }}
                          />
                        </button>
                      </div>

                      {/* Social Activity */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3 flex-1">
                          <Heart className="w-5 h-5" style={{ color: colors.textSecondary }} aria-hidden="true" />
                          <div className="font-semibold text-sm" style={{ color: colors.textPrimary }}>
                            Social Activity
                          </div>
                        </div>
                        <button
                          onClick={() => setSocialActivity(!socialActivity)}
                          className="relative w-12 h-6 rounded-full transition-colors flex-shrink-0"
                          style={{ 
                            background: socialActivity ? colors.iconColor : colors.border,
                          }}
                          role="switch"
                          aria-checked={socialActivity}
                          aria-label="Toggle social activity notifications"
                        >
                          <div 
                            className="absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white transition-transform"
                            style={{
                              transform: socialActivity ? 'translateX(24px)' : 'translateX(0)',
                            }}
                          />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </section>

            {/* Daily Reminder Settings */}
            <section aria-labelledby="daily-reminders-heading" className="mb-6">
              <button
                onClick={() => toggleSection('daily')}
                className="w-full flex items-center justify-between mb-4"
                aria-expanded={expandedSections.daily}
                aria-controls="daily-reminders"
              >
                <h3 id="daily-reminders-heading" className="text-base font-semibold" style={{ color: colors.textPrimary }}>
                  Daily Reminder Settings
                </h3>
                {expandedSections.daily ? (
                  <ChevronUp className="w-5 h-5" style={{ color: colors.textSecondary }} aria-hidden="true" />
                ) : (
                  <ChevronDown className="w-5 h-5" style={{ color: colors.textSecondary }} aria-hidden="true" />
                )}
              </button>

              <AnimatePresence>
                {expandedSections.daily && (
                  <motion.div
                    id="daily-reminders"
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden"
                  >
                    <div 
                      className="rounded-xl p-6"
                      style={{
                        background: colors.cardBg,
                        backdropFilter: colors.blur,
                        WebkitBackdropFilter: colors.blur,
                        border: colors.glassBorder,
                        boxShadow: colors.shadow,
                      }}
                    >
                      {/* Enable Daily Reminders */}
                      <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-3 flex-1">
                          <Clock className="w-5 h-5" style={{ color: colors.textSecondary }} aria-hidden="true" />
                          <div>
                            <div className="font-semibold text-sm" style={{ color: colors.textPrimary }}>
                              Enable Daily Reminders
                            </div>
                            <div className="text-xs" style={{ color: colors.textSecondary }}>
                              Get reminded to practice every day
                            </div>
                          </div>
                        </div>
                        <button
                          onClick={() => setDailyReminders(!dailyReminders)}
                          className="relative w-12 h-6 rounded-full transition-colors flex-shrink-0"
                          style={{ 
                            background: dailyReminders ? colors.iconColor : colors.border,
                          }}
                          role="switch"
                          aria-checked={dailyReminders}
                          aria-label="Toggle daily reminders"
                        >
                          <div 
                            className="absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white transition-transform"
                            style={{
                              transform: dailyReminders ? 'translateX(24px)' : 'translateX(0)',
                            }}
                          />
                        </button>
                      </div>

                      {dailyReminders && (
                        <>
                          {/* Reminder Time */}
                          <div className="mb-6">
                            <label htmlFor="reminder-time" className="block font-semibold text-sm mb-2" style={{ color: colors.textPrimary }}>
                              Reminder Time
                            </label>
                            <input
                              id="reminder-time"
                              type="time"
                              value={reminderTime}
                              onChange={(e) => setReminderTime(e.target.value)}
                              className="w-full px-4 py-3 rounded-xl text-sm"
                              style={{
                                background: colors.cardHover,
                                color: colors.textPrimary,
                                border: colors.glassBorder,
                              }}
                              aria-label="Set daily reminder time"
                            />
                          </div>

                          {/* Reminder Days */}
                          <div>
                            <div className="font-semibold text-sm mb-3" style={{ color: colors.textPrimary }}>
                              Reminder Days
                            </div>
                            <div className="grid grid-cols-7 gap-2">
                              {Object.entries({
                                M: 'monday',
                                T: 'tuesday',
                                W: 'wednesday',
                                T2: 'thursday',
                                F: 'friday',
                                S: 'saturday',
                                S2: 'sunday',
                              }).map(([label, day], index) => {
                                const dayKey = day as keyof typeof reminderDays;
                                const isActive = reminderDays[dayKey];
                                const dayNames = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
                                
                                return (
                                  <button
                                    key={day}
                                    onClick={() => toggleDay(dayKey)}
                                    className="aspect-square rounded-lg font-semibold text-sm transition-all"
                                    style={{
                                      background: isActive ? colors.iconColor : colors.cardHover,
                                      color: isActive ? (theme === 'dark' ? '#0F0F23' : '#FFFFFF') : colors.textSecondary,
                                    }}
                                    role="checkbox"
                                    aria-checked={isActive}
                                    aria-label={`${dayNames[index]} reminder`}
                                  >
                                    {label.replace(/\d/g, '')}
                                  </button>
                                );
                              })}
                            </div>
                          </div>
                        </>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </section>

            {/* Email Preferences */}
            <section aria-labelledby="email-preferences-heading">
              <button
                onClick={() => toggleSection('email')}
                className="w-full flex items-center justify-between mb-4"
                aria-expanded={expandedSections.email}
                aria-controls="email-preferences"
              >
                <h3 id="email-preferences-heading" className="text-base font-semibold" style={{ color: colors.textPrimary }}>
                  Email Preferences
                </h3>
                {expandedSections.email ? (
                  <ChevronUp className="w-5 h-5" style={{ color: colors.textSecondary }} aria-hidden="true" />
                ) : (
                  <ChevronDown className="w-5 h-5" style={{ color: colors.textSecondary }} aria-hidden="true" />
                )}
              </button>

              <AnimatePresence>
                {expandedSections.email && (
                  <motion.div
                    id="email-preferences"
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden"
                  >
                    <div 
                      className="rounded-xl p-6"
                      style={{
                        background: colors.cardBg,
                        backdropFilter: colors.blur,
                        WebkitBackdropFilter: colors.blur,
                        border: colors.glassBorder,
                        boxShadow: colors.shadow,
                      }}
                    >
                      <p className="text-sm mb-4" style={{ color: colors.textSecondary }}>
                        Control which emails you receive from Sign Learn AR
                      </p>

                      <div className="space-y-3">
                        {[
                          { label: 'Daily Progress Summary', enabled: true },
                          { label: 'Weekly Report', enabled: true },
                          { label: 'Monthly Newsletter', enabled: true },
                          { label: 'Tips & Best Practices', enabled: false },
                          { label: 'New Course Announcements', enabled: true },
                          { label: 'Community Updates', enabled: false },
                        ].map((item, index) => (
                          <div key={index} className="flex items-center justify-between p-3 rounded-lg" style={{ background: colors.cardHover }}>
                            <span className="text-sm font-medium" style={{ color: colors.textPrimary }}>
                              {item.label}
                            </span>
                            <input
                              type="checkbox"
                              defaultChecked={item.enabled}
                              className="w-5 h-5 rounded"
                              style={{ accentColor: colors.iconColor }}
                              aria-label={`Receive ${item.label} emails`}
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </section>
          </div>
        )}
      </div>
    </div>
  );
}
