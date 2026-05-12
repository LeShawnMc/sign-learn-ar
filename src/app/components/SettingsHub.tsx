import { useState } from 'react';
import { Button } from './ui/button';
import { useTheme } from '../context/ThemeContext';
import { useApp } from '../context/AppContext';
import { 
  X, 
  User,
  Settings,
  Crown,
  Globe,
  Eye,
  Shield,
  Bell,
  Smartphone,
  HelpCircle,
  Info,
  FileText,
  Lock,
  Mail,
  ChevronRight,
  LogOut,
  Trash2,
  Download,
  Upload,
  Database,
  Moon,
  Sun,
  Volume2,
  Camera,
  MessageSquare,
  Languages,
  Palette,
  Zap,
  BarChart3,
  Video,
  Sparkles,
  Clock,
  Filter,
} from 'lucide-react';

interface SettingsHubProps {
  onExit: () => void;
  onNavigateToSubscription?: () => void;
  onNavigateToLanguageSelection?: () => void;
  onNavigateToAccessibility?: () => void;
  onNavigateToNotifications?: () => void;
  onNavigateToProfile?: () => void;
  onNavigateToCameraAR?: () => void;
  onNavigateToFeedback?: () => void;
  onNavigateToTutorial?: () => void;
  onNavigateToPersonalization?: () => void;
}

export function SettingsHub({ 
  onExit,
  onNavigateToSubscription,
  onNavigateToLanguageSelection,
  onNavigateToAccessibility,
  onNavigateToNotifications,
  onNavigateToProfile,
  onNavigateToCameraAR,
  onNavigateToFeedback,
  onNavigateToTutorial,
  onNavigateToPersonalization,
}: SettingsHubProps) {
  const { theme, toggleTheme } = useTheme();
  const { userProgress, selectedLanguage } = useApp();

  // App Preferences State
  const [autoPlayVideos, setAutoPlayVideos] = useState(true);
  const [hapticFeedback, setHapticFeedback] = useState(true);
  const [downloadOverWiFiOnly, setDownloadOverWiFiOnly] = useState(true);
  const [autoSaveProgress, setAutoSaveProgress] = useState(true);
  const [showSubtitles, setShowSubtitles] = useState(true);
  const [practiceReminders, setPracticeReminders] = useState(true);

  // Display Options State
  const [reducedMotion, setReducedMotion] = useState(false);
  const [highContrast, setHighContrast] = useState(false);
  const [largeFonts, setLargeFonts] = useState(false);
  const [showProgressBars, setShowProgressBars] = useState(true);

  // Privacy State
  const [dataSharingEnabled, setDataSharingEnabled] = useState(false);
  const [analyticsEnabled, setAnalyticsEnabled] = useState(true);
  const [personalizationEnabled, setPersonalizationEnabled] = useState(true);

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
        blur: 'blur(20px)',
        shadow: '0 8px 32px rgba(31, 38, 135, 0.15)',
        glassBorder: '1px solid rgba(255, 255, 255, 0.6)',
      };

  const handleLogout = () => {
    // Simulate logout
  };

  const handleDeleteAccount = () => {
    // Simulate account deletion
    confirm('Are you sure you want to delete your account? This action cannot be undone.');
  };

  const handleExportData = () => {
    // Simulate data export
  };

  const handleClearCache = () => {
    // Simulate clearing cache
  };

  return (
    <div 
      className="h-full flex flex-col"
      style={{ background: colors.bg, color: colors.textPrimary }}
      role="main"
      aria-labelledby="settings-hub-title"
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
            aria-label="Close settings"
            className="flex-shrink-0"
          >
            <X className="w-6 h-6" />
          </Button>
          <div className="flex-1 min-w-0">
            <h1 
              id="settings-hub-title" 
              className="text-xl sm:text-2xl font-bold truncate"
              style={{ fontFamily: 'Poppins, sans-serif' }}
            >
              Settings
            </h1>
            <p className="text-sm truncate" style={{ color: colors.textSecondary }}>
              Manage your account and preferences
            </p>
          </div>
        </div>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6">
        
        {/* Profile Section */}
        <section aria-labelledby="profile-heading" className="mb-6">
          <h2 id="profile-heading" className="text-lg font-semibold mb-4" style={{ color: colors.textPrimary }}>
            Profile
          </h2>

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
            {/* Profile Info */}
            <div className="flex items-center gap-4 mb-6 pb-6 border-b" style={{ borderBottomColor: colors.border }}>
              <div 
                className="w-16 h-16 rounded-full flex items-center justify-center text-3xl"
                style={{ background: colors.iconBg }}
                aria-hidden="true"
              >
                😊
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-semibold mb-1" style={{ color: colors.textPrimary }}>
                  Sarah Johnson
                </div>
                <div className="text-sm mb-1" style={{ color: colors.textSecondary }}>
                  sarah.johnson@email.com
                </div>
                <div className="flex items-center gap-2 text-xs" style={{ color: colors.textTertiary }}>
                  {userProgress.isPremium ? (
                    <>
                      <Crown className="w-4 h-4" style={{ color: colors.warningColor }} aria-hidden="true" />
                      <span>Premium Member</span>
                    </>
                  ) : (
                    <span>Free Account</span>
                  )}
                </div>
              </div>
            </div>

            {/* Profile Actions */}
            <nav aria-label="Profile actions">
              <button
                onClick={onNavigateToProfile}
                className="w-full flex items-center justify-between p-4 rounded-lg transition-all mb-2"
                style={{ background: 'transparent' }}
                onMouseEnter={(e) => e.currentTarget.style.background = colors.cardHover}
                onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                aria-label="Edit profile"
              >
                <div className="flex items-center gap-3">
                  <div 
                    className="w-10 h-10 rounded-lg flex items-center justify-center"
                    style={{ background: colors.iconBg }}
                    aria-hidden="true"
                  >
                    <User className="w-5 h-5" style={{ color: colors.iconColor }} />
                  </div>
                  <div className="text-left">
                    <div className="font-semibold text-sm" style={{ color: colors.textPrimary }}>
                      Edit Profile
                    </div>
                    <div className="text-xs" style={{ color: colors.textSecondary }}>
                      Update your personal information
                    </div>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5" style={{ color: colors.textTertiary }} aria-hidden="true" />
              </button>

              <button
                onClick={onNavigateToSubscription}
                className="w-full flex items-center justify-between p-4 rounded-lg transition-all"
                style={{ background: 'transparent' }}
                onMouseEnter={(e) => e.currentTarget.style.background = colors.cardHover}
                onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                aria-label="Manage subscription"
              >
                <div className="flex items-center gap-3">
                  <div 
                    className="w-10 h-10 rounded-lg flex items-center justify-center"
                    style={{ background: colors.warningBg }}
                    aria-hidden="true"
                  >
                    <Crown className="w-5 h-5" style={{ color: colors.warningColor }} />
                  </div>
                  <div className="text-left">
                    <div className="font-semibold text-sm" style={{ color: colors.textPrimary }}>
                      Subscription
                    </div>
                    <div className="text-xs" style={{ color: colors.textSecondary }}>
                      {userProgress.isPremium ? 'Manage your premium subscription' : 'Upgrade to Premium'}
                    </div>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5" style={{ color: colors.textTertiary }} aria-hidden="true" />
              </button>
            </nav>
          </div>
        </section>

        {/* App Preferences */}
        <section aria-labelledby="app-preferences-heading" className="mb-6">
          <h2 id="app-preferences-heading" className="text-lg font-semibold mb-4" style={{ color: colors.textPrimary }}>
            App Preferences
          </h2>

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
            <nav aria-label="App preferences">
              {/* Language */}
              <button
                onClick={onNavigateToLanguageSelection}
                className="w-full flex items-center justify-between p-4 rounded-lg transition-all mb-2"
                style={{ background: 'transparent' }}
                onMouseEnter={(e) => e.currentTarget.style.background = colors.cardHover}
                onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                aria-label={`Change sign language. Currently: ${selectedLanguage}`}
              >
                <div className="flex items-center gap-3">
                  <div 
                    className="w-10 h-10 rounded-lg flex items-center justify-center"
                    style={{ background: colors.iconBg }}
                    aria-hidden="true"
                  >
                    <Languages className="w-5 h-5" style={{ color: colors.iconColor }} />
                  </div>
                  <div className="text-left">
                    <div className="font-semibold text-sm" style={{ color: colors.textPrimary }}>
                      Sign Language
                    </div>
                    <div className="text-xs" style={{ color: colors.textSecondary }}>
                      {selectedLanguage} - American Sign Language
                    </div>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5" style={{ color: colors.textTertiary }} aria-hidden="true" />
              </button>

              {/* Notifications */}
              <button
                onClick={onNavigateToNotifications}
                className="w-full flex items-center justify-between p-4 rounded-lg transition-all mb-2"
                style={{ background: 'transparent' }}
                onMouseEnter={(e) => e.currentTarget.style.background = colors.cardHover}
                onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                aria-label="Notification preferences"
              >
                <div className="flex items-center gap-3">
                  <div 
                    className="w-10 h-10 rounded-lg flex items-center justify-center"
                    style={{ background: colors.iconBg }}
                    aria-hidden="true"
                  >
                    <Bell className="w-5 h-5" style={{ color: colors.iconColor }} />
                  </div>
                  <div className="text-left">
                    <div className="font-semibold text-sm" style={{ color: colors.textPrimary }}>
                      Notifications
                    </div>
                    <div className="text-xs" style={{ color: colors.textSecondary }}>
                      Manage notification settings
                    </div>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5" style={{ color: colors.textTertiary }} aria-hidden="true" />
              </button>

              {/* Personalization */}
              <button
                onClick={onNavigateToPersonalization}
                className="w-full flex items-center justify-between p-4 rounded-lg transition-all mb-2"
                style={{ background: 'transparent' }}
                onMouseEnter={(e) => e.currentTarget.style.background = colors.cardHover}
                onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                aria-label="Personalization preferences"
              >
                <div className="flex items-center gap-3">
                  <div 
                    className="w-10 h-10 rounded-lg flex items-center justify-center"
                    style={{ background: colors.accentBg }}
                    aria-hidden="true"
                  >
                    <Palette className="w-5 h-5" style={{ color: colors.accentColor }} />
                  </div>
                  <div className="text-left">
                    <div className="font-semibold text-sm" style={{ color: colors.textPrimary }}>
                      Personalization
                    </div>
                    <div className="text-xs" style={{ color: colors.textSecondary }}>
                      Customize your learning experience
                    </div>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5" style={{ color: colors.textTertiary }} aria-hidden="true" />
              </button>

              {/* Theme Toggle */}
              <div className="flex items-center justify-between p-4 rounded-lg mb-2">
                <div className="flex items-center gap-3">
                  <div 
                    className="w-10 h-10 rounded-lg flex items-center justify-center"
                    style={{ background: colors.iconBg }}
                    aria-hidden="true"
                  >
                    {theme === 'dark' ? (
                      <Moon className="w-5 h-5" style={{ color: colors.iconColor }} />
                    ) : (
                      <Sun className="w-5 h-5" style={{ color: colors.iconColor }} />
                    )}
                  </div>
                  <div className="text-left">
                    <div className="font-semibold text-sm" style={{ color: colors.textPrimary }}>
                      Dark Mode
                    </div>
                    <div className="text-xs" style={{ color: colors.textSecondary }}>
                      {theme === 'dark' ? 'Enabled' : 'Disabled'}
                    </div>
                  </div>
                </div>
                <button
                  onClick={toggleTheme}
                  className="relative w-12 h-6 rounded-full transition-colors"
                  style={{ 
                    background: theme === 'dark' ? colors.iconColor : colors.border,
                  }}
                  role="switch"
                  aria-checked={theme === 'dark'}
                  aria-label="Toggle dark mode"
                >
                  <div 
                    className="absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white transition-transform"
                    style={{
                      transform: theme === 'dark' ? 'translateX(24px)' : 'translateX(0)',
                    }}
                  />
                </button>
              </div>

              {/* Auto-play Videos */}
              <div className="flex items-center justify-between p-4 rounded-lg mb-2">
                <div className="flex items-center gap-3">
                  <div 
                    className="w-10 h-10 rounded-lg flex items-center justify-center"
                    style={{ background: colors.iconBg }}
                    aria-hidden="true"
                  >
                    <Video className="w-5 h-5" style={{ color: colors.iconColor }} />
                  </div>
                  <div className="text-left">
                    <div className="font-semibold text-sm" style={{ color: colors.textPrimary }}>
                      Auto-play Videos
                    </div>
                    <div className="text-xs" style={{ color: colors.textSecondary }}>
                      Automatically play lesson videos
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => setAutoPlayVideos(!autoPlayVideos)}
                  className="relative w-12 h-6 rounded-full transition-colors"
                  style={{ 
                    background: autoPlayVideos ? colors.iconColor : colors.border,
                  }}
                  role="switch"
                  aria-checked={autoPlayVideos}
                  aria-label="Toggle auto-play videos"
                >
                  <div 
                    className="absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white transition-transform"
                    style={{
                      transform: autoPlayVideos ? 'translateX(24px)' : 'translateX(0)',
                    }}
                  />
                </button>
              </div>

              {/* Show Subtitles */}
              <div className="flex items-center justify-between p-4 rounded-lg mb-2">
                <div className="flex items-center gap-3">
                  <div 
                    className="w-10 h-10 rounded-lg flex items-center justify-center"
                    style={{ background: colors.iconBg }}
                    aria-hidden="true"
                  >
                    <MessageSquare className="w-5 h-5" style={{ color: colors.iconColor }} />
                  </div>
                  <div className="text-left">
                    <div className="font-semibold text-sm" style={{ color: colors.textPrimary }}>
                      Show Subtitles
                    </div>
                    <div className="text-xs" style={{ color: colors.textSecondary }}>
                      Display captions on videos
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => setShowSubtitles(!showSubtitles)}
                  className="relative w-12 h-6 rounded-full transition-colors"
                  style={{ 
                    background: showSubtitles ? colors.iconColor : colors.border,
                  }}
                  role="switch"
                  aria-checked={showSubtitles}
                  aria-label="Toggle subtitles"
                >
                  <div 
                    className="absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white transition-transform"
                    style={{
                      transform: showSubtitles ? 'translateX(24px)' : 'translateX(0)',
                    }}
                  />
                </button>
              </div>

              {/* Haptic Feedback */}
              <div className="flex items-center justify-between p-4 rounded-lg mb-2">
                <div className="flex items-center gap-3">
                  <div 
                    className="w-10 h-10 rounded-lg flex items-center justify-center"
                    style={{ background: colors.iconBg }}
                    aria-hidden="true"
                  >
                    <Smartphone className="w-5 h-5" style={{ color: colors.iconColor }} />
                  </div>
                  <div className="text-left">
                    <div className="font-semibold text-sm" style={{ color: colors.textPrimary }}>
                      Haptic Feedback
                    </div>
                    <div className="text-xs" style={{ color: colors.textSecondary }}>
                      Vibration feedback on interactions
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => setHapticFeedback(!hapticFeedback)}
                  className="relative w-12 h-6 rounded-full transition-colors"
                  style={{ 
                    background: hapticFeedback ? colors.iconColor : colors.border,
                  }}
                  role="switch"
                  aria-checked={hapticFeedback}
                  aria-label="Toggle haptic feedback"
                >
                  <div 
                    className="absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white transition-transform"
                    style={{
                      transform: hapticFeedback ? 'translateX(24px)' : 'translateX(0)',
                    }}
                  />
                </button>
              </div>

              {/* Practice Reminders */}
              <div className="flex items-center justify-between p-4 rounded-lg">
                <div className="flex items-center gap-3">
                  <div 
                    className="w-10 h-10 rounded-lg flex items-center justify-center"
                    style={{ background: colors.iconBg }}
                    aria-hidden="true"
                  >
                    <Clock className="w-5 h-5" style={{ color: colors.iconColor }} />
                  </div>
                  <div className="text-left">
                    <div className="font-semibold text-sm" style={{ color: colors.textPrimary }}>
                      Practice Reminders
                    </div>
                    <div className="text-xs" style={{ color: colors.textSecondary }}>
                      Daily practice notifications
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => setPracticeReminders(!practiceReminders)}
                  className="relative w-12 h-6 rounded-full transition-colors"
                  style={{ 
                    background: practiceReminders ? colors.iconColor : colors.border,
                  }}
                  role="switch"
                  aria-checked={practiceReminders}
                  aria-label="Toggle practice reminders"
                >
                  <div 
                    className="absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white transition-transform"
                    style={{
                      transform: practiceReminders ? 'translateX(24px)' : 'translateX(0)',
                    }}
                  />
                </button>
              </div>
            </nav>
          </div>
        </section>

        {/* Display & Accessibility */}
        <section aria-labelledby="display-accessibility-heading" className="mb-6">
          <h2 id="display-accessibility-heading" className="text-lg font-semibold mb-4" style={{ color: colors.textPrimary }}>
            Display & Accessibility
          </h2>

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
            <nav aria-label="Display and accessibility settings">
              {/* Accessibility Settings */}
              <button
                onClick={onNavigateToAccessibility}
                className="w-full flex items-center justify-between p-4 rounded-lg transition-all mb-2"
                style={{ background: 'transparent' }}
                onMouseEnter={(e) => e.currentTarget.style.background = colors.cardHover}
                onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                aria-label="Accessibility settings"
              >
                <div className="flex items-center gap-3">
                  <div 
                    className="w-10 h-10 rounded-lg flex items-center justify-center"
                    style={{ background: colors.successBg }}
                    aria-hidden="true"
                  >
                    <Eye className="w-5 h-5" style={{ color: colors.successColor }} />
                  </div>
                  <div className="text-left">
                    <div className="font-semibold text-sm" style={{ color: colors.textPrimary }}>
                      Accessibility
                    </div>
                    <div className="text-xs" style={{ color: colors.textSecondary }}>
                      Screen reader, captions, voice control
                    </div>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5" style={{ color: colors.textTertiary }} aria-hidden="true" />
              </button>

              {/* Camera & AR Settings */}
              <button
                onClick={onNavigateToCameraAR}
                className="w-full flex items-center justify-between p-4 rounded-lg transition-all mb-2"
                style={{ background: 'transparent' }}
                onMouseEnter={(e) => e.currentTarget.style.background = colors.cardHover}
                onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                aria-label="Camera and AR settings"
              >
                <div className="flex items-center gap-3">
                  <div 
                    className="w-10 h-10 rounded-lg flex items-center justify-center"
                    style={{ background: colors.iconBg }}
                    aria-hidden="true"
                  >
                    <Camera className="w-5 h-5" style={{ color: colors.iconColor }} />
                  </div>
                  <div className="text-left">
                    <div className="font-semibold text-sm" style={{ color: colors.textPrimary }}>
                      Camera & AR
                    </div>
                    <div className="text-xs" style={{ color: colors.textSecondary }}>
                      Hand tracking, AR mode settings
                    </div>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5" style={{ color: colors.textTertiary }} aria-hidden="true" />
              </button>

              {/* Reduced Motion */}
              <div className="flex items-center justify-between p-4 rounded-lg mb-2">
                <div className="flex items-center gap-3">
                  <div 
                    className="w-10 h-10 rounded-lg flex items-center justify-center"
                    style={{ background: colors.iconBg }}
                    aria-hidden="true"
                  >
                    <Zap className="w-5 h-5" style={{ color: colors.iconColor }} />
                  </div>
                  <div className="text-left">
                    <div className="font-semibold text-sm" style={{ color: colors.textPrimary }}>
                      Reduced Motion
                    </div>
                    <div className="text-xs" style={{ color: colors.textSecondary }}>
                      Minimize animations
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => setReducedMotion(!reducedMotion)}
                  className="relative w-12 h-6 rounded-full transition-colors"
                  style={{ 
                    background: reducedMotion ? colors.iconColor : colors.border,
                  }}
                  role="switch"
                  aria-checked={reducedMotion}
                  aria-label="Toggle reduced motion"
                >
                  <div 
                    className="absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white transition-transform"
                    style={{
                      transform: reducedMotion ? 'translateX(24px)' : 'translateX(0)',
                    }}
                  />
                </button>
              </div>

              {/* High Contrast */}
              <div className="flex items-center justify-between p-4 rounded-lg mb-2">
                <div className="flex items-center gap-3">
                  <div 
                    className="w-10 h-10 rounded-lg flex items-center justify-center"
                    style={{ background: colors.iconBg }}
                    aria-hidden="true"
                  >
                    <Filter className="w-5 h-5" style={{ color: colors.iconColor }} />
                  </div>
                  <div className="text-left">
                    <div className="font-semibold text-sm" style={{ color: colors.textPrimary }}>
                      High Contrast
                    </div>
                    <div className="text-xs" style={{ color: colors.textSecondary }}>
                      Increase color contrast
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => setHighContrast(!highContrast)}
                  className="relative w-12 h-6 rounded-full transition-colors"
                  style={{ 
                    background: highContrast ? colors.iconColor : colors.border,
                  }}
                  role="switch"
                  aria-checked={highContrast}
                  aria-label="Toggle high contrast"
                >
                  <div 
                    className="absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white transition-transform"
                    style={{
                      transform: highContrast ? 'translateX(24px)' : 'translateX(0)',
                    }}
                  />
                </button>
              </div>

              {/* Show Progress Bars */}
              <div className="flex items-center justify-between p-4 rounded-lg">
                <div className="flex items-center gap-3">
                  <div 
                    className="w-10 h-10 rounded-lg flex items-center justify-center"
                    style={{ background: colors.iconBg }}
                    aria-hidden="true"
                  >
                    <BarChart3 className="w-5 h-5" style={{ color: colors.iconColor }} />
                  </div>
                  <div className="text-left">
                    <div className="font-semibold text-sm" style={{ color: colors.textPrimary }}>
                      Show Progress Bars
                    </div>
                    <div className="text-xs" style={{ color: colors.textSecondary }}>
                      Display visual progress indicators
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => setShowProgressBars(!showProgressBars)}
                  className="relative w-12 h-6 rounded-full transition-colors"
                  style={{ 
                    background: showProgressBars ? colors.iconColor : colors.border,
                  }}
                  role="switch"
                  aria-checked={showProgressBars}
                  aria-label="Toggle progress bars"
                >
                  <div 
                    className="absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white transition-transform"
                    style={{
                      transform: showProgressBars ? 'translateX(24px)' : 'translateX(0)',
                    }}
                  />
                </button>
              </div>
            </nav>
          </div>
        </section>

        {/* Privacy & Data */}
        <section aria-labelledby="privacy-data-heading" className="mb-6">
          <h2 id="privacy-data-heading" className="text-lg font-semibold mb-4" style={{ color: colors.textPrimary }}>
            Privacy & Data
          </h2>

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
            <nav aria-label="Privacy and data settings">
              {/* Analytics */}
              <div className="flex items-center justify-between p-4 rounded-lg mb-2">
                <div className="flex items-center gap-3">
                  <div 
                    className="w-10 h-10 rounded-lg flex items-center justify-center"
                    style={{ background: colors.iconBg }}
                    aria-hidden="true"
                  >
                    <BarChart3 className="w-5 h-5" style={{ color: colors.iconColor }} />
                  </div>
                  <div className="text-left">
                    <div className="font-semibold text-sm" style={{ color: colors.textPrimary }}>
                      Usage Analytics
                    </div>
                    <div className="text-xs" style={{ color: colors.textSecondary }}>
                      Help improve the app
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => setAnalyticsEnabled(!analyticsEnabled)}
                  className="relative w-12 h-6 rounded-full transition-colors"
                  style={{ 
                    background: analyticsEnabled ? colors.iconColor : colors.border,
                  }}
                  role="switch"
                  aria-checked={analyticsEnabled}
                  aria-label="Toggle usage analytics"
                >
                  <div 
                    className="absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white transition-transform"
                    style={{
                      transform: analyticsEnabled ? 'translateX(24px)' : 'translateX(0)',
                    }}
                  />
                </button>
              </div>

              {/* Personalization */}
              <div className="flex items-center justify-between p-4 rounded-lg mb-2">
                <div className="flex items-center gap-3">
                  <div 
                    className="w-10 h-10 rounded-lg flex items-center justify-center"
                    style={{ background: colors.iconBg }}
                    aria-hidden="true"
                  >
                    <Sparkles className="w-5 h-5" style={{ color: colors.iconColor }} />
                  </div>
                  <div className="text-left">
                    <div className="font-semibold text-sm" style={{ color: colors.textPrimary }}>
                      Personalized Learning
                    </div>
                    <div className="text-xs" style={{ color: colors.textSecondary }}>
                      AI-powered recommendations
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => setPersonalizationEnabled(!personalizationEnabled)}
                  className="relative w-12 h-6 rounded-full transition-colors"
                  style={{ 
                    background: personalizationEnabled ? colors.iconColor : colors.border,
                  }}
                  role="switch"
                  aria-checked={personalizationEnabled}
                  aria-label="Toggle personalized learning"
                >
                  <div 
                    className="absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white transition-transform"
                    style={{
                      transform: personalizationEnabled ? 'translateX(24px)' : 'translateX(0)',
                    }}
                  />
                </button>
              </div>

              {/* Data Sharing */}
              <div className="flex items-center justify-between p-4 rounded-lg mb-4 pb-4 border-b" style={{ borderBottomColor: colors.border }}>
                <div className="flex items-center gap-3">
                  <div 
                    className="w-10 h-10 rounded-lg flex items-center justify-center"
                    style={{ background: colors.iconBg }}
                    aria-hidden="true"
                  >
                    <Upload className="w-5 h-5" style={{ color: colors.iconColor }} />
                  </div>
                  <div className="text-left">
                    <div className="font-semibold text-sm" style={{ color: colors.textPrimary }}>
                      Share Usage Data
                    </div>
                    <div className="text-xs" style={{ color: colors.textSecondary }}>
                      Share with partners
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => setDataSharingEnabled(!dataSharingEnabled)}
                  className="relative w-12 h-6 rounded-full transition-colors"
                  style={{ 
                    background: dataSharingEnabled ? colors.iconColor : colors.border,
                  }}
                  role="switch"
                  aria-checked={dataSharingEnabled}
                  aria-label="Toggle data sharing"
                >
                  <div 
                    className="absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white transition-transform"
                    style={{
                      transform: dataSharingEnabled ? 'translateX(24px)' : 'translateX(0)',
                    }}
                  />
                </button>
              </div>

              {/* Auto-save Progress */}
              <div className="flex items-center justify-between p-4 rounded-lg mb-2">
                <div className="flex items-center gap-3">
                  <div 
                    className="w-10 h-10 rounded-lg flex items-center justify-center"
                    style={{ background: colors.successBg }}
                    aria-hidden="true"
                  >
                    <Database className="w-5 h-5" style={{ color: colors.successColor }} />
                  </div>
                  <div className="text-left">
                    <div className="font-semibold text-sm" style={{ color: colors.textPrimary }}>
                      Auto-save Progress
                    </div>
                    <div className="text-xs" style={{ color: colors.textSecondary }}>
                      Automatically save your learning data
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => setAutoSaveProgress(!autoSaveProgress)}
                  className="relative w-12 h-6 rounded-full transition-colors"
                  style={{ 
                    background: autoSaveProgress ? colors.successColor : colors.border,
                  }}
                  role="switch"
                  aria-checked={autoSaveProgress}
                  aria-label="Toggle auto-save progress"
                >
                  <div 
                    className="absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white transition-transform"
                    style={{
                      transform: autoSaveProgress ? 'translateX(24px)' : 'translateX(0)',
                    }}
                  />
                </button>
              </div>

              {/* Download Over WiFi Only */}
              <div className="flex items-center justify-between p-4 rounded-lg mb-4 pb-4 border-b" style={{ borderBottomColor: colors.border }}>
                <div className="flex items-center gap-3">
                  <div 
                    className="w-10 h-10 rounded-lg flex items-center justify-center"
                    style={{ background: colors.iconBg }}
                    aria-hidden="true"
                  >
                    <Download className="w-5 h-5" style={{ color: colors.iconColor }} />
                  </div>
                  <div className="text-left">
                    <div className="font-semibold text-sm" style={{ color: colors.textPrimary }}>
                      Download Over WiFi Only
                    </div>
                    <div className="text-xs" style={{ color: colors.textSecondary }}>
                      Save mobile data usage
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => setDownloadOverWiFiOnly(!downloadOverWiFiOnly)}
                  className="relative w-12 h-6 rounded-full transition-colors"
                  style={{ 
                    background: downloadOverWiFiOnly ? colors.iconColor : colors.border,
                  }}
                  role="switch"
                  aria-checked={downloadOverWiFiOnly}
                  aria-label="Toggle download over WiFi only"
                >
                  <div 
                    className="absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white transition-transform"
                    style={{
                      transform: downloadOverWiFiOnly ? 'translateX(24px)' : 'translateX(0)',
                    }}
                  />
                </button>
              </div>

              {/* Export Data */}
              <button
                onClick={handleExportData}
                className="w-full flex items-center justify-between p-4 rounded-lg transition-all mb-2"
                style={{ background: 'transparent' }}
                onMouseEnter={(e) => e.currentTarget.style.background = colors.cardHover}
                onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                aria-label="Export your data"
              >
                <div className="flex items-center gap-3">
                  <div 
                    className="w-10 h-10 rounded-lg flex items-center justify-center"
                    style={{ background: colors.iconBg }}
                    aria-hidden="true"
                  >
                    <Download className="w-5 h-5" style={{ color: colors.iconColor }} />
                  </div>
                  <div className="text-left">
                    <div className="font-semibold text-sm" style={{ color: colors.textPrimary }}>
                      Export My Data
                    </div>
                    <div className="text-xs" style={{ color: colors.textSecondary }}>
                      Download all your learning data
                    </div>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5" style={{ color: colors.textTertiary }} aria-hidden="true" />
              </button>

              {/* Clear Cache */}
              <button
                onClick={handleClearCache}
                className="w-full flex items-center justify-between p-4 rounded-lg transition-all"
                style={{ background: 'transparent' }}
                onMouseEnter={(e) => e.currentTarget.style.background = colors.cardHover}
                onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                aria-label="Clear app cache"
              >
                <div className="flex items-center gap-3">
                  <div 
                    className="w-10 h-10 rounded-lg flex items-center justify-center"
                    style={{ background: colors.warningBg }}
                    aria-hidden="true"
                  >
                    <Trash2 className="w-5 h-5" style={{ color: colors.warningColor }} />
                  </div>
                  <div className="text-left">
                    <div className="font-semibold text-sm" style={{ color: colors.textPrimary }}>
                      Clear Cache
                    </div>
                    <div className="text-xs" style={{ color: colors.textSecondary }}>
                      Free up storage space
                    </div>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5" style={{ color: colors.textTertiary }} aria-hidden="true" />
              </button>
            </nav>
          </div>
        </section>

        {/* Help & Support */}
        <section aria-labelledby="help-support-heading" className="mb-6">
          <h2 id="help-support-heading" className="text-lg font-semibold mb-4" style={{ color: colors.textPrimary }}>
            Help & Support
          </h2>

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
            <nav aria-label="Help and support">
              {/* Tutorial & Help Center */}
              <button
                onClick={onNavigateToTutorial}
                className="w-full flex items-center justify-between p-4 rounded-lg transition-all mb-2"
                style={{ background: 'transparent' }}
                onMouseEnter={(e) => e.currentTarget.style.background = colors.cardHover}
                onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                aria-label="Tutorial and help center"
              >
                <div className="flex items-center gap-3">
                  <div 
                    className="w-10 h-10 rounded-lg flex items-center justify-center"
                    style={{ background: colors.iconBg }}
                    aria-hidden="true"
                  >
                    <HelpCircle className="w-5 h-5" style={{ color: colors.iconColor }} />
                  </div>
                  <div className="text-left">
                    <div className="font-semibold text-sm" style={{ color: colors.textPrimary }}>
                      Help Center
                    </div>
                    <div className="text-xs" style={{ color: colors.textSecondary }}>
                      FAQs, tutorials, and guides
                    </div>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5" style={{ color: colors.textTertiary }} aria-hidden="true" />
              </button>

              {/* Feedback & Support */}
              <button
                onClick={onNavigateToFeedback}
                className="w-full flex items-center justify-between p-4 rounded-lg transition-all"
                style={{ background: 'transparent' }}
                onMouseEnter={(e) => e.currentTarget.style.background = colors.cardHover}
                onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                aria-label="Send feedback or get support"
              >
                <div className="flex items-center gap-3">
                  <div 
                    className="w-10 h-10 rounded-lg flex items-center justify-center"
                    style={{ background: colors.iconBg }}
                    aria-hidden="true"
                  >
                    <Mail className="w-5 h-5" style={{ color: colors.iconColor }} />
                  </div>
                  <div className="text-left">
                    <div className="font-semibold text-sm" style={{ color: colors.textPrimary }}>
                      Feedback & Support
                    </div>
                    <div className="text-xs" style={{ color: colors.textSecondary }}>
                      Contact us or report a bug
                    </div>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5" style={{ color: colors.textTertiary }} aria-hidden="true" />
              </button>
            </nav>
          </div>
        </section>

        {/* About & Legal */}
        <section aria-labelledby="about-legal-heading" className="mb-6">
          <h2 id="about-legal-heading" className="text-lg font-semibold mb-4" style={{ color: colors.textPrimary }}>
            About & Legal
          </h2>

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
            <nav aria-label="About and legal information">
              {/* About Sign Learn AR */}
              <div className="p-4 rounded-lg mb-2">
                <div className="flex items-center gap-3 mb-3">
                  <div 
                    className="w-10 h-10 rounded-lg flex items-center justify-center"
                    style={{ background: colors.iconBg }}
                    aria-hidden="true"
                  >
                    <Info className="w-5 h-5" style={{ color: colors.iconColor }} />
                  </div>
                  <div className="text-left">
                    <div className="font-semibold text-sm" style={{ color: colors.textPrimary }}>
                      About Sign Learn AR
                    </div>
                    <div className="text-xs" style={{ color: colors.textSecondary }}>
                      Version 2.4.1
                    </div>
                  </div>
                </div>
                <p className="text-xs leading-relaxed" style={{ color: colors.textSecondary }}>
                  Sign Learn AR is the world's leading augmented reality platform for learning sign language. 
                  Our mission is to make sign language accessible to everyone through innovative AR technology 
                  and comprehensive educational content.
                </p>
              </div>

              {/* Privacy Policy */}
              <button
                onClick={() => window.open('https://signlearnar.com/privacy', '_blank')}
                className="w-full flex items-center justify-between p-4 rounded-lg transition-all mb-2"
                style={{ background: 'transparent' }}
                onMouseEnter={(e) => e.currentTarget.style.background = colors.cardHover}
                onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                aria-label="View privacy policy (opens in new tab)"
              >
                <div className="flex items-center gap-3">
                  <div 
                    className="w-10 h-10 rounded-lg flex items-center justify-center"
                    style={{ background: colors.iconBg }}
                    aria-hidden="true"
                  >
                    <Shield className="w-5 h-5" style={{ color: colors.iconColor }} />
                  </div>
                  <div className="text-left">
                    <div className="font-semibold text-sm" style={{ color: colors.textPrimary }}>
                      Privacy Policy
                    </div>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5" style={{ color: colors.textTertiary }} aria-hidden="true" />
              </button>

              {/* Terms of Service */}
              <button
                onClick={() => window.open('https://signlearnar.com/terms', '_blank')}
                className="w-full flex items-center justify-between p-4 rounded-lg transition-all mb-2"
                style={{ background: 'transparent' }}
                onMouseEnter={(e) => e.currentTarget.style.background = colors.cardHover}
                onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                aria-label="View terms of service (opens in new tab)"
              >
                <div className="flex items-center gap-3">
                  <div 
                    className="w-10 h-10 rounded-lg flex items-center justify-center"
                    style={{ background: colors.iconBg }}
                    aria-hidden="true"
                  >
                    <FileText className="w-5 h-5" style={{ color: colors.iconColor }} />
                  </div>
                  <div className="text-left">
                    <div className="font-semibold text-sm" style={{ color: colors.textPrimary }}>
                      Terms of Service
                    </div>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5" style={{ color: colors.textTertiary }} aria-hidden="true" />
              </button>

              {/* Licenses */}
              <button
                onClick={() => window.open('https://signlearnar.com/licenses', '_blank')}
                className="w-full flex items-center justify-between p-4 rounded-lg transition-all mb-2"
                style={{ background: 'transparent' }}
                onMouseEnter={(e) => e.currentTarget.style.background = colors.cardHover}
                onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                aria-label="View open source licenses (opens in new tab)"
              >
                <div className="flex items-center gap-3">
                  <div 
                    className="w-10 h-10 rounded-lg flex items-center justify-center"
                    style={{ background: colors.iconBg }}
                    aria-hidden="true"
                  >
                    <FileText className="w-5 h-5" style={{ color: colors.iconColor }} />
                  </div>
                  <div className="text-left">
                    <div className="font-semibold text-sm" style={{ color: colors.textPrimary }}>
                      Open Source Licenses
                    </div>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5" style={{ color: colors.textTertiary }} aria-hidden="true" />
              </button>

              {/* Acknowledgements */}
              <button
                onClick={() => window.open('https://signlearnar.com/acknowledgements', '_blank')}
                className="w-full flex items-center justify-between p-4 rounded-lg transition-all"
                style={{ background: 'transparent' }}
                onMouseEnter={(e) => e.currentTarget.style.background = colors.cardHover}
                onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                aria-label="View acknowledgements (opens in new tab)"
              >
                <div className="flex items-center gap-3">
                  <div 
                    className="w-10 h-10 rounded-lg flex items-center justify-center"
                    style={{ background: colors.iconBg }}
                    aria-hidden="true"
                  >
                    <Info className="w-5 h-5" style={{ color: colors.iconColor }} />
                  </div>
                  <div className="text-left">
                    <div className="font-semibold text-sm" style={{ color: colors.textPrimary }}>
                      Acknowledgements
                    </div>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5" style={{ color: colors.textTertiary }} aria-hidden="true" />
              </button>
            </nav>
          </div>
        </section>

        {/* Account Actions */}
        <section aria-labelledby="account-actions-heading" className="mb-6">
          <h2 id="account-actions-heading" className="text-lg font-semibold mb-4" style={{ color: colors.textPrimary }}>
            Account Actions
          </h2>

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
            <nav aria-label="Account actions">
              {/* Log Out */}
              <button
                onClick={handleLogout}
                className="w-full flex items-center justify-between p-4 rounded-lg transition-all mb-2"
                style={{ background: 'transparent' }}
                onMouseEnter={(e) => e.currentTarget.style.background = colors.cardHover}
                onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                aria-label="Log out of your account"
              >
                <div className="flex items-center gap-3">
                  <div 
                    className="w-10 h-10 rounded-lg flex items-center justify-center"
                    style={{ background: colors.warningBg }}
                    aria-hidden="true"
                  >
                    <LogOut className="w-5 h-5" style={{ color: colors.warningColor }} />
                  </div>
                  <div className="text-left">
                    <div className="font-semibold text-sm" style={{ color: colors.textPrimary }}>
                      Log Out
                    </div>
                    <div className="text-xs" style={{ color: colors.textSecondary }}>
                      Sign out of your account
                    </div>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5" style={{ color: colors.textTertiary }} aria-hidden="true" />
              </button>

              {/* Delete Account */}
              <button
                onClick={handleDeleteAccount}
                className="w-full flex items-center justify-between p-4 rounded-lg transition-all"
                style={{ background: 'transparent' }}
                onMouseEnter={(e) => e.currentTarget.style.background = colors.errorBg}
                onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                aria-label="Delete your account permanently"
              >
                <div className="flex items-center gap-3">
                  <div 
                    className="w-10 h-10 rounded-lg flex items-center justify-center"
                    style={{ background: colors.errorBg }}
                    aria-hidden="true"
                  >
                    <Trash2 className="w-5 h-5" style={{ color: colors.errorColor }} />
                  </div>
                  <div className="text-left">
                    <div className="font-semibold text-sm" style={{ color: colors.errorColor }}>
                      Delete Account
                    </div>
                    <div className="text-xs" style={{ color: colors.textSecondary }}>
                      Permanently delete your account and data
                    </div>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5" style={{ color: colors.textTertiary }} aria-hidden="true" />
              </button>
            </nav>
          </div>
        </section>
      </div>
    </div>
  );
}
