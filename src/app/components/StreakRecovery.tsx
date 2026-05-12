import { useState } from 'react';
import { Button } from './ui/button';
import { useTheme } from '../context/ThemeContext';
import { useApp } from '../context/AppContext';
import exampleImage from 'figma:asset/86a11781b0ea6608317be293709b8b0170095a92.png';
import { 
  X, 
  Flame,
  TrendingUp,
  Award,
  Heart,
  Play,
  DollarSign,
  Target,
  Clock,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  Shield,
  Bell,
  Calendar,
  BarChart3,
  Users,
  Quote,
  Info,
  Zap,
  Crown,
  ArrowRight,
  Check,
  ChevronRight,
  Star,
  Trophy,
  Brain,
  Activity,
  MessageCircle,
  Settings,
  RefreshCcw,
  XCircle,
  PlayCircle,
  Lock,
  Unlock,
} from 'lucide-react';

interface StreakRecoveryProps {
  onExit: () => void;
  previousStreak?: number;
}

interface RecoveryOption {
  id: string;
  type: 'ad' | 'purchase' | 'challenge';
  title: string;
  description: string;
  cost?: string;
  available: boolean;
  cooldown?: string;
  effort?: string;
}

interface ProgressStats {
  totalDaysPracticed: number;
  totalVocabularyLearned: number;
  accuracyImprovement: number;
  longestStreak: number;
  totalXP: number;
  lessonsCompleted: number;
}

interface CommunityMessage {
  id: string;
  author: string;
  message: string;
  streak: number;
}

export function StreakRecovery({ onExit, previousStreak = 18 }: StreakRecoveryProps) {
  const { theme } = useTheme();
  const { userProgress } = useApp();

  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [showAdModal, setShowAdModal] = useState(false);
  const [showPurchaseModal, setShowPurchaseModal] = useState(false);
  const [showChallengeModal, setShowChallengeModal] = useState(false);
  const [showInsuranceModal, setShowInsuranceModal] = useState(false);
  const [showReminderSettings, setShowReminderSettings] = useState(false);
  const [adCountdown, setAdCountdown] = useState(30);
  const [adWatched, setAdWatched] = useState(false);
  const [challengeStarted, setChallengeStarted] = useState(false);
  const [challengeProgress, setChallengeProgress] = useState(0);
  const [streakRecovered, setStreakRecovered] = useState(false);

  // Progress statistics
  const [stats] = useState<ProgressStats>({
    totalDaysPracticed: 127,
    totalVocabularyLearned: 456,
    accuracyImprovement: 38,
    longestStreak: 45,
    totalXP: 8450,
    lessonsCompleted: 67,
  });

  // Recovery options
  const [recoveryOptions] = useState<RecoveryOption[]>([
    {
      id: 'watch-ad',
      type: 'ad',
      title: 'Watch Ad',
      description: 'Watch a 30-second ad to recover your streak instantly',
      available: true,
      cooldown: 'Available now • Next: 6 days',
      effort: '30 seconds',
    },
    {
      id: 'purchase',
      type: 'purchase',
      title: 'Purchase Recovery',
      description: 'Instantly restore your streak with a one-time purchase',
      cost: previousStreak < 10 ? '$0.99' : previousStreak < 30 ? '$1.99' : '$2.99',
      available: true,
      effort: 'Instant',
    },
    {
      id: 'challenge',
      type: 'challenge',
      title: 'Complete Challenge',
      description: 'Free recovery by completing a special challenge with 80%+ accuracy',
      available: true,
      effort: '10-15 minutes',
    },
  ]);

  // Encouragement quotes
  const [quotes] = useState([
    {
      text: "Every expert was once a beginner. Don't give up!",
      author: "Helen Hayes",
    },
    {
      text: "The only way to do great work is to love what you do.",
      author: "Steve Jobs",
    },
    {
      text: "Success is not final, failure is not fatal: it is the courage to continue that counts.",
      author: "Winston Churchill",
    },
  ]);

  // Community success stories
  const [communityMessages] = useState<CommunityMessage[]>([
    {
      id: 'msg1',
      author: 'Sarah_ASL',
      message: 'I lost my 45-day streak but recovered it and now I\'m at 120 days! Don\'t give up!',
      streak: 120,
    },
    {
      id: 'msg2',
      author: 'DeafPro_Mike',
      message: 'Missing a day doesn\'t erase your progress. Your brain remembers everything you learned!',
      streak: 87,
    },
    {
      id: 'msg3',
      author: 'ASLLearner_Jay',
      message: 'I\'ve recovered my streak 3 times and each time I came back stronger. You got this!',
      streak: 156,
    },
    {
      id: 'msg4',
      author: 'SignLanguagePro',
      message: 'Life happens! The important thing is that you\'re here now, ready to continue learning.',
      streak: 203,
    },
  ]);

  // Accuracy improvement data (last 30 days)
  const [accuracyData] = useState([
    { day: 1, accuracy: 67 },
    { day: 5, accuracy: 72 },
    { day: 10, accuracy: 76 },
    { day: 15, accuracy: 81 },
    { day: 20, accuracy: 85 },
    { day: 25, accuracy: 88 },
    { day: 30, accuracy: 92 },
  ]);

  const handleWatchAd = () => {
    setShowAdModal(true);
    // Simulate ad countdown
    const interval = setInterval(() => {
      setAdCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          setAdWatched(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleCompleteAdRecovery = () => {
    setStreakRecovered(true);
    setShowAdModal(false);
  };

  const handlePurchaseRecovery = () => {
    setStreakRecovered(true);
    setShowPurchaseModal(false);
  };

  const handleStartChallenge = () => {
    setChallengeStarted(true);
    // Simulate challenge progress
    const interval = setInterval(() => {
      setChallengeProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 10;
      });
    }, 500);
  };

  const handleCompleteChallengeRecovery = () => {
    setStreakRecovered(true);
    setShowChallengeModal(false);
  };

  const handleStartNewStreak = () => {
    // Reset and start new streak
    onExit();
  };

  // Theme-aware colors
  const colors = theme === 'dark'
    ? {
        bg: 'var(--color-bg-deep)',
        cardBg: 'var(--color-bg-card)',
        cardHover: '#252541',
        textPrimary: 'var(--color-text)',
        textSecondary: 'var(--color-text-muted)',
        textTertiary: '#64748B',
        border: 'rgba(148, 163, 184, 0.2)',
        iconBg: 'rgba(0, 245, 255, 0.1)',
        iconColor: 'var(--color-cyan)',
        accentBg: 'rgba(168, 85, 247, 0.1)',
        accentColor: 'var(--color-purple)',
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
        accentColor: 'var(--color-purple)',
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

  if (streakRecovered) {
    return (
      <div 
        className="h-full flex flex-col items-center justify-center p-4"
        style={{ background: colors.bg, color: colors.textPrimary }}
        role="main"
        aria-labelledby="recovery-success-title"
      >
        <div 
          className="w-full max-w-md rounded-2xl p-8 text-center"
          style={{
            background: colors.cardBg,
            backdropFilter: colors.blur,
            WebkitBackdropFilter: colors.blur,
            border: colors.glassBorder,
            boxShadow: colors.shadow,
          }}
        >
          <div 
            className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4"
            style={{ background: colors.successBg }}
          >
            <CheckCircle2 className="w-12 h-12" style={{ color: colors.successColor }} />
          </div>
          
          <h1 id="recovery-success-title" className="text-2xl font-bold mb-2" style={{ fontFamily: 'Poppins, sans-serif', color: colors.textPrimary }}>
            Streak Recovered!
          </h1>
          
          <p className="text-lg mb-6" style={{ color: colors.textSecondary }}>
            Your {previousStreak}-day streak is back on track!
          </p>

          <div className="flex items-center justify-center gap-2 mb-6">
            <Flame className="w-8 h-8" style={{ color: colors.warningColor }} />
            <span className="text-4xl font-bold" style={{ color: colors.textPrimary }}>
              {previousStreak}
            </span>
            <span className="text-xl" style={{ color: colors.textSecondary }}>days</span>
          </div>

          <p className="text-sm mb-6" style={{ color: colors.textTertiary }}>
            Keep up the momentum! Practice today to continue your streak.
          </p>

          <Button
            onClick={onExit}
            className="w-full h-12 rounded-xl font-semibold mb-3"
            style={{ 
              background: colors.successColor,
              color: '#FFFFFF',
            }}
            aria-label="Continue to practice"
          >
            <Play className="w-5 h-5 mr-2" />
            Continue Practicing
          </Button>

          <Button
            onClick={onExit}
            variant="ghost"
            className="w-full h-10"
            style={{ color: colors.textSecondary }}
            aria-label="Return to home"
          >
            Return to Home
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div 
      className="h-full flex flex-col"
      style={{ background: colors.bg, color: colors.textPrimary }}
      role="main"
      aria-labelledby="streak-recovery-title"
    >
      {/* Header */}
      <div 
        className="p-4 border-b"
        style={{ borderBottomColor: colors.border }}
      >
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <h1 
              id="streak-recovery-title" 
              className="text-xl sm:text-2xl font-bold"
              style={{ fontFamily: 'Poppins, sans-serif' }}
            >
              Streak Recovery
            </h1>
            <p className="text-sm" style={{ color: colors.textSecondary }}>
              Get your {previousStreak}-day streak back
            </p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onExit}
            style={{ color: colors.textSecondary }}
            aria-label="Exit streak recovery"
          >
            <X className="w-6 h-6" />
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* Broken Streak Notice */}
        <div 
          className="rounded-2xl p-6 text-center"
          style={{
            background: colors.cardBg,
            backdropFilter: colors.blur,
            WebkitBackdropFilter: colors.blur,
            border: colors.glassBorder,
            boxShadow: colors.shadow,
          }}
          role="region"
          aria-labelledby="broken-streak-heading"
        >
          <div 
            className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
            style={{ background: colors.errorBg }}
          >
            <Flame className="w-10 h-10" style={{ color: colors.errorColor }} aria-hidden="true" />
          </div>
          
          <h2 id="broken-streak-heading" className="text-2xl font-bold mb-2" style={{ fontFamily: 'Poppins, sans-serif', color: colors.textPrimary }}>
            We all have busy days!
          </h2>
          
          <p className="text-lg mb-4" style={{ color: colors.textSecondary }}>
            You missed your practice session and lost your <span className="font-bold" style={{ color: colors.warningColor }}>{previousStreak}-day streak</span>
          </p>

          <div 
            className="rounded-xl p-4 mb-4"
            style={{ background: colors.iconBg }}
          >
            <p className="text-sm font-semibold" style={{ color: colors.textPrimary }}>
              But don't worry! You can recover it right now.
            </p>
          </div>

          <p className="text-sm" style={{ color: colors.textTertiary }}>
            Choose one of the recovery options below to restore your streak and continue your learning journey.
          </p>
        </div>

        {/* Overall Statistics */}
        <div 
          className="rounded-2xl p-6"
          style={{
            background: colors.cardBg,
            backdropFilter: colors.blur,
            WebkitBackdropFilter: colors.blur,
            border: colors.glassBorder,
            boxShadow: colors.shadow,
          }}
          role="region"
          aria-labelledby="progress-heading"
        >
          <h3 id="progress-heading" className="text-lg font-semibold mb-4" style={{ color: colors.textPrimary }}>
            Your Amazing Progress
          </h3>
          
          <div className="grid grid-cols-2 gap-3 mb-4">
            <div 
              className="rounded-xl p-4 text-center"
              style={{ background: colors.successBg }}
            >
              <div className="text-3xl font-bold mb-1" style={{ color: colors.successColor }}>
                {stats.totalDaysPracticed}
              </div>
              <div className="text-sm" style={{ color: colors.textSecondary }}>
                Total Days Practiced
              </div>
            </div>

            <div 
              className="rounded-xl p-4 text-center"
              style={{ background: colors.iconBg }}
            >
              <div className="text-3xl font-bold mb-1" style={{ color: colors.iconColor }}>
                {stats.totalVocabularyLearned}
              </div>
              <div className="text-sm" style={{ color: colors.textSecondary }}>
                Signs Learned
              </div>
            </div>

            <div 
              className="rounded-xl p-4 text-center"
              style={{ background: colors.accentBg }}
            >
              <div className="text-3xl font-bold mb-1" style={{ color: colors.accentColor }}>
                {stats.accuracyImprovement}%
              </div>
              <div className="text-sm" style={{ color: colors.textSecondary }}>
                Accuracy Gain
              </div>
            </div>

            <div 
              className="rounded-xl p-4 text-center"
              style={{ background: colors.warningBg }}
            >
              <div className="text-3xl font-bold mb-1" style={{ color: colors.warningColor }}>
                {stats.longestStreak}
              </div>
              <div className="text-sm" style={{ color: colors.textSecondary }}>
                Longest Streak
              </div>
            </div>
          </div>

          {/* Accuracy Graph */}
          <div 
            className="rounded-xl p-4 mb-4"
            style={{ background: colors.iconBg }}
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-semibold" style={{ color: colors.textPrimary }}>
                Accuracy Improvement
              </span>
              <span className="text-sm" style={{ color: colors.successColor }}>
                +{stats.accuracyImprovement}%
              </span>
            </div>
            <div className="flex items-end gap-1 h-24">
              {accuracyData.map((data, idx) => (
                <div key={idx} className="flex-1 flex flex-col items-center gap-1">
                  <div 
                    className="w-full rounded-t transition-all"
                    style={{ 
                      background: colors.successColor,
                      height: `${data.accuracy}%`,
                    }}
                    role="progressbar"
                    aria-valuenow={data.accuracy}
                    aria-valuemin={0}
                    aria-valuemax={100}
                    aria-label={`Day ${data.day}: ${data.accuracy}% accuracy`}
                  />
                </div>
              ))}
            </div>
            <div className="flex justify-between mt-2 text-xs" style={{ color: colors.textTertiary }}>
              <span>Day 1</span>
              <span>Today</span>
            </div>
          </div>

          <div 
            className="rounded-xl p-4 text-center"
            style={{ background: colors.accentBg }}
          >
            <p className="text-sm font-bold" style={{ color: colors.accentColor }}>
              You've come too far to give up!
            </p>
          </div>
        </div>

        {/* Recovery Options */}
        <div 
          className="rounded-2xl p-6"
          style={{
            background: colors.cardBg,
            backdropFilter: colors.blur,
            WebkitBackdropFilter: colors.blur,
            border: colors.glassBorder,
            boxShadow: colors.shadow,
          }}
          role="region"
          aria-labelledby="recovery-options-heading"
        >
          <h3 id="recovery-options-heading" className="text-lg font-semibold mb-4" style={{ color: colors.textPrimary }}>
            Recovery Options
          </h3>

          <div className="space-y-3">
            {/* Option 1: Watch Ad */}
            <button
              onClick={() => {
                setSelectedOption('watch-ad');
                setShowAdModal(true);
              }}
              className="w-full rounded-xl p-4 text-left"
              style={{
                background: colors.iconBg,
                border: `2px solid ${selectedOption === 'watch-ad' ? colors.iconColor : 'transparent'}`,
              }}
              aria-label="Watch ad to recover streak"
            >
              <div className="flex items-start gap-3">
                <div 
                  className="w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0"
                  style={{ background: colors.iconColor }}
                >
                  <Play className="w-6 h-6" style={{ color: theme === 'dark' ? 'var(--color-bg-deep)' : '#FFFFFF' }} />
                </div>
                <div className="flex-1">
                  <div className="font-semibold mb-1" style={{ color: colors.textPrimary }}>
                    Watch Ad
                  </div>
                  <p className="text-sm mb-2" style={{ color: colors.textTertiary }}>
                    Watch a 30-second ad to recover your streak instantly
                  </p>
                  <div className="flex items-center gap-2 text-xs">
                    <span 
                      className="px-2 py-1 rounded-full"
                      style={{ background: colors.successBg, color: colors.successColor }}
                    >
                      FREE
                    </span>
                    <span style={{ color: colors.textTertiary }}>
                      • {recoveryOptions[0].effort}
                    </span>
                  </div>
                  <div className="mt-2 text-xs" style={{ color: colors.textSecondary }}>
                    {recoveryOptions[0].cooldown}
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 flex-shrink-0" style={{ color: colors.textTertiary }} />
              </div>
            </button>

            {/* Option 2: Purchase */}
            <button
              onClick={() => {
                setSelectedOption('purchase');
                setShowPurchaseModal(true);
              }}
              className="w-full rounded-xl p-4 text-left"
              style={{
                background: colors.successBg,
                border: `2px solid ${selectedOption === 'purchase' ? colors.successColor : 'transparent'}`,
              }}
              aria-label="Purchase streak recovery"
            >
              <div className="flex items-start gap-3">
                <div 
                  className="w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0"
                  style={{ background: colors.successColor }}
                >
                  <Zap className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <div className="font-semibold mb-1" style={{ color: colors.textPrimary }}>
                    Purchase Recovery
                  </div>
                  <p className="text-sm mb-2" style={{ color: colors.textTertiary }}>
                    Instantly restore your streak with a one-time purchase
                  </p>
                  <div className="flex items-center gap-2 text-xs">
                    <span 
                      className="px-2 py-1 rounded-full font-bold"
                      style={{ background: colors.warningBg, color: colors.warningColor }}
                    >
                      {recoveryOptions[1].cost}
                    </span>
                    <span style={{ color: colors.textTertiary }}>
                      • Instant recovery
                    </span>
                  </div>
                  <div className="mt-2 text-xs font-medium" style={{ color: colors.successColor }}>
                    Saving your {previousStreak}-day streak is worth it!
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 flex-shrink-0" style={{ color: colors.textTertiary }} />
              </div>
            </button>

            {/* Option 3: Challenge */}
            <button
              onClick={() => {
                setSelectedOption('challenge');
                setShowChallengeModal(true);
              }}
              className="w-full rounded-xl p-4 text-left"
              style={{
                background: colors.accentBg,
                border: `2px solid ${selectedOption === 'challenge' ? colors.accentColor : 'transparent'}`,
              }}
              aria-label="Complete challenge to recover streak"
            >
              <div className="flex items-start gap-3">
                <div 
                  className="w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0"
                  style={{ background: colors.accentColor }}
                >
                  <Target className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <div className="font-semibold mb-1" style={{ color: colors.textPrimary }}>
                    Complete Challenge
                  </div>
                  <p className="text-sm mb-2" style={{ color: colors.textTertiary }}>
                    Free recovery by completing a special challenge with 80%+ accuracy
                  </p>
                  <div className="flex items-center gap-2 text-xs">
                    <span 
                      className="px-2 py-1 rounded-full"
                      style={{ background: colors.successBg, color: colors.successColor }}
                    >
                      FREE
                    </span>
                    <span style={{ color: colors.textTertiary }}>
                      • {recoveryOptions[2].effort}
                    </span>
                  </div>
                  <div className="mt-2 text-xs" style={{ color: colors.textSecondary }}>
                    One attempt • Requires 80%+ accuracy
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 flex-shrink-0" style={{ color: colors.textTertiary }} />
              </div>
            </button>
          </div>
        </div>

        {/* Emotional Support */}
        <div 
          className="rounded-2xl p-6"
          style={{
            background: colors.cardBg,
            backdropFilter: colors.blur,
            WebkitBackdropFilter: colors.blur,
            border: colors.glassBorder,
            boxShadow: colors.shadow,
          }}
          role="region"
          aria-labelledby="support-heading"
        >
          <h3 id="support-heading" className="text-lg font-semibold mb-4" style={{ color: colors.textPrimary }}>
            You're Not Alone
          </h3>

          {/* Encouragement Quote */}
          <div 
            className="rounded-xl p-4 mb-4"
            style={{ background: colors.iconBg }}
          >
            <Quote className="w-6 h-6 mb-2" style={{ color: colors.iconColor }} aria-hidden="true" />
            <p className="text-sm italic mb-2" style={{ color: colors.textPrimary }}>
              "{quotes[0].text}"
            </p>
            <p className="text-xs text-right" style={{ color: colors.textTertiary }}>
              — {quotes[0].author}
            </p>
          </div>

          {/* Community Messages */}
          <div className="space-y-3">
            <div className="text-sm font-semibold mb-2" style={{ color: colors.textSecondary }}>
              Community Success Stories
            </div>
            {communityMessages.slice(0, 2).map((msg) => (
              <div
                key={msg.id}
                className="rounded-xl p-3"
                style={{ background: colors.accentBg }}
              >
                <div className="flex items-center gap-2 mb-2">
                  <Users className="w-4 h-4" style={{ color: colors.accentColor }} />
                  <span className="text-sm font-semibold" style={{ color: colors.textPrimary }}>
                    {msg.author}
                  </span>
                  <div className="flex items-center gap-1 ml-auto">
                    <Flame className="w-3 h-3" style={{ color: colors.warningColor }} />
                    <span className="text-xs" style={{ color: colors.textTertiary }}>
                      {msg.streak} days
                    </span>
                  </div>
                </div>
                <p className="text-sm" style={{ color: colors.textSecondary }}>
                  {msg.message}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Streak Insurance Promotion */}
        <div 
          className="rounded-2xl p-6"
          style={{
            background: `linear-gradient(135deg, ${colors.accentColor}20 0%, ${colors.iconColor}20 100%)`,
            border: colors.glassBorder,
            boxShadow: colors.shadow,
          }}
          role="region"
          aria-labelledby="insurance-heading"
        >
          <div className="flex items-start gap-3 mb-4">
            <div 
              className="w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0"
              style={{ background: colors.accentColor }}
            >
              <Shield className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 id="insurance-heading" className="font-bold mb-1" style={{ color: colors.textPrimary }}>
                Never Worry About Losing Your Streak Again
              </h3>
              <p className="text-sm" style={{ color: colors.textSecondary }}>
                Streak Insurance protects your progress automatically
              </p>
            </div>
          </div>

          <div className="space-y-2 mb-4">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 flex-shrink-0" style={{ color: colors.successColor }} />
              <span className="text-sm" style={{ color: colors.textPrimary }}>
                Automatic streak recovery
              </span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 flex-shrink-0" style={{ color: colors.successColor }} />
              <span className="text-sm" style={{ color: colors.textPrimary }}>
                Unlimited monthly protection
              </span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 flex-shrink-0" style={{ color: colors.successColor }} />
              <span className="text-sm" style={{ color: colors.textPrimary }}>
                Peace of mind for busy schedules
              </span>
            </div>
          </div>

          <Button
            onClick={() => setShowInsuranceModal(true)}
            className="w-full h-12 rounded-xl font-semibold"
            style={{ 
              background: colors.accentColor,
              color: '#FFFFFF',
            }}
            aria-label="Learn about streak insurance"
          >
            <Crown className="w-5 h-5 mr-2" />
            Get Protection for $1.99/month
          </Button>
        </div>

        {/* Statistics Comparison */}
        <div 
          className="rounded-2xl p-6"
          style={{
            background: colors.cardBg,
            backdropFilter: colors.blur,
            WebkitBackdropFilter: colors.blur,
            border: colors.glassBorder,
            boxShadow: colors.shadow,
          }}
          role="region"
          aria-labelledby="comparison-heading"
        >
          <h3 id="comparison-heading" className="text-lg font-semibold mb-4" style={{ color: colors.textPrimary }}>
            Missing One Day Doesn't Erase Your Progress
          </h3>

          <div className="space-y-3">
            <div 
              className="rounded-xl p-4"
              style={{ background: colors.successBg }}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-semibold" style={{ color: colors.textPrimary }}>
                  Lifetime Learning
                </span>
                <Brain className="w-5 h-5" style={{ color: colors.successColor }} />
              </div>
              <div className="grid grid-cols-3 gap-2 text-center">
                <div>
                  <div className="text-2xl font-bold" style={{ color: colors.successColor }}>
                    {stats.lessonsCompleted}
                  </div>
                  <div className="text-xs" style={{ color: colors.textTertiary }}>
                    Lessons
                  </div>
                </div>
                <div>
                  <div className="text-2xl font-bold" style={{ color: colors.successColor }}>
                    {stats.totalVocabularyLearned}
                  </div>
                  <div className="text-xs" style={{ color: colors.textTertiary }}>
                    Signs
                  </div>
                </div>
                <div>
                  <div className="text-2xl font-bold" style={{ color: colors.successColor }}>
                    {stats.totalXP.toLocaleString()}
                  </div>
                  <div className="text-xs" style={{ color: colors.textTertiary }}>
                    XP
                  </div>
                </div>
              </div>
            </div>

            <div 
              className="rounded-xl p-4"
              style={{ background: colors.iconBg }}
            >
              <div className="flex items-center gap-2 mb-2">
                <Activity className="w-5 h-5" style={{ color: colors.iconColor }} />
                <span className="text-sm font-semibold" style={{ color: colors.textPrimary }}>
                  Skill Retention
                </span>
              </div>
              <p className="text-sm" style={{ color: colors.textSecondary }}>
                Your brain remembers what you've learned. Studies show that missing a single day doesn't significantly impact long-term retention when you return to practice.
              </p>
            </div>

            <div 
              className="rounded-xl p-4 text-center"
              style={{ background: colors.accentBg }}
            >
              <p className="text-sm font-bold" style={{ color: colors.accentColor }}>
                All your progress is still here, waiting for you!
              </p>
            </div>
          </div>
        </div>

        {/* Start New Streak */}
        <div 
          className="rounded-2xl p-6"
          style={{
            background: colors.cardBg,
            backdropFilter: colors.blur,
            WebkitBackdropFilter: colors.blur,
            border: colors.glassBorder,
            boxShadow: colors.shadow,
          }}
        >
          <h3 className="text-lg font-semibold mb-3" style={{ color: colors.textPrimary }}>
            Or Start Fresh
          </h3>
          <p className="text-sm mb-4" style={{ color: colors.textTertiary }}>
            If you'd rather start a new streak, you can begin practicing right now and keep building momentum.
          </p>
          <Button
            onClick={handleStartNewStreak}
            className="w-full h-12 rounded-xl font-semibold"
            style={{ 
              background: colors.iconBg,
              color: colors.iconColor,
            }}
            aria-label="Start new streak"
          >
            <RefreshCcw className="w-5 h-5 mr-2" />
            Start New Streak (Day 1)
          </Button>
        </div>

        {/* Reminder Settings */}
        <div 
          className="rounded-2xl p-6"
          style={{
            background: colors.cardBg,
            backdropFilter: colors.blur,
            WebkitBackdropFilter: colors.blur,
            border: colors.glassBorder,
            boxShadow: colors.shadow,
          }}
        >
          <div className="flex items-center gap-3 mb-3">
            <Bell className="w-5 h-5" style={{ color: colors.warningColor }} />
            <h3 className="text-lg font-semibold" style={{ color: colors.textPrimary }}>
              Let's Make Sure This Doesn't Happen Again
            </h3>
          </div>
          <p className="text-sm mb-4" style={{ color: colors.textTertiary }}>
            Adjust your reminder settings to find the perfect time for your daily practice.
          </p>
          <Button
            onClick={() => setShowReminderSettings(true)}
            className="w-full h-12 rounded-xl font-semibold"
            style={{ 
              background: colors.warningBg,
              color: colors.warningColor,
            }}
            aria-label="Optimize reminder settings"
          >
            <Settings className="w-5 h-5 mr-2" />
            Optimize Reminder Settings
          </Button>
        </div>
      </div>

      {/* Watch Ad Modal */}
      {showAdModal && (
        <div 
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          onClick={() => !adWatched && setShowAdModal(false)}
        >
          <div 
            className="w-full max-w-md rounded-2xl p-6"
            style={{
              background: colors.cardBg,
              backdropFilter: colors.blur,
              WebkitBackdropFilter: colors.blur,
              border: colors.glassBorder,
              boxShadow: colors.shadow,
            }}
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-labelledby="ad-modal-title"
            aria-modal="true"
          >
            {!adWatched ? (
              <>
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 id="ad-modal-title" className="text-xl font-bold mb-1" style={{ color: colors.textPrimary }}>
                      Watch Ad
                    </h3>
                    <p className="text-sm" style={{ color: colors.textSecondary }}>
                      Recover your streak by watching a short ad
                    </p>
                  </div>
                  <button
                    onClick={() => setShowAdModal(false)}
                    className="p-2 rounded-lg"
                    style={{ color: colors.textSecondary }}
                    aria-label="Close ad modal"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div 
                  className="rounded-xl p-8 mb-4 text-center"
                  style={{ background: colors.iconBg }}
                >
                  <div 
                    className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4"
                    style={{ background: colors.iconColor }}
                  >
                    <Play className="w-10 h-10" style={{ color: theme === 'dark' ? 'var(--color-bg-deep)' : '#FFFFFF' }} />
                  </div>
                  <div className="text-4xl font-bold mb-2" style={{ color: colors.iconColor }}>
                    {adCountdown}s
                  </div>
                  <p className="text-sm" style={{ color: colors.textSecondary }}>
                    Ad playing...
                  </p>
                </div>

                <Button
                  onClick={handleWatchAd}
                  disabled={adCountdown > 0}
                  className="w-full h-12 rounded-xl font-semibold"
                  style={{ 
                    background: adCountdown > 0 ? colors.border : colors.iconColor,
                    color: adCountdown > 0 ? colors.textTertiary : (theme === 'dark' ? 'var(--color-bg-deep)' : '#FFFFFF'),
                    cursor: adCountdown > 0 ? 'not-allowed' : 'pointer',
                  }}
                  aria-label="Start watching ad"
                >
                  {adCountdown > 0 ? 'Please Wait...' : 'Start Ad'}
                </Button>
              </>
            ) : (
              <>
                <div className="text-center mb-6">
                  <div 
                    className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
                    style={{ background: colors.successBg }}
                  >
                    <CheckCircle2 className="w-10 h-10" style={{ color: colors.successColor }} />
                  </div>
                  <h3 className="text-xl font-bold mb-2" style={{ color: colors.textPrimary }}>
                    Ad Complete!
                  </h3>
                  <p className="text-sm" style={{ color: colors.textSecondary }}>
                    You can now recover your {previousStreak}-day streak
                  </p>
                </div>

                <Button
                  onClick={handleCompleteAdRecovery}
                  className="w-full h-12 rounded-xl font-semibold"
                  style={{ 
                    background: colors.successColor,
                    color: '#FFFFFF',
                  }}
                  aria-label="Recover streak"
                >
                  <Flame className="w-5 h-5 mr-2" />
                  Recover Streak
                </Button>
              </>
            )}
          </div>
        </div>
      )}

      {/* Purchase Modal */}
      {showPurchaseModal && (
        <div 
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          onClick={() => setShowPurchaseModal(false)}
        >
          <div 
            className="w-full max-w-md rounded-2xl p-6"
            style={{
              background: colors.cardBg,
              backdropFilter: colors.blur,
              WebkitBackdropFilter: colors.blur,
              border: colors.glassBorder,
              boxShadow: colors.shadow,
            }}
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-labelledby="purchase-modal-title"
            aria-modal="true"
          >
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 id="purchase-modal-title" className="text-xl font-bold mb-1" style={{ color: colors.textPrimary }}>
                  Purchase Recovery
                </h3>
                <p className="text-sm" style={{ color: colors.textSecondary }}>
                  Instantly restore your streak
                </p>
              </div>
              <button
                onClick={() => setShowPurchaseModal(false)}
                className="p-2 rounded-lg"
                style={{ color: colors.textSecondary }}
                aria-label="Close purchase modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div 
              className="rounded-xl p-6 mb-4 text-center"
              style={{ background: colors.warningBg }}
            >
              <Flame className="w-12 h-12 mx-auto mb-3" style={{ color: colors.warningColor }} />
              <div className="text-3xl font-bold mb-2" style={{ color: colors.textPrimary }}>
                {previousStreak} Days
              </div>
              <p className="text-sm mb-4" style={{ color: colors.textSecondary }}>
                Your dedication is worth protecting
              </p>
              <div className="text-4xl font-bold" style={{ color: colors.warningColor }}>
                {recoveryOptions[1].cost}
              </div>
            </div>

            <div className="space-y-2 mb-4">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5" style={{ color: colors.successColor }} />
                <span className="text-sm" style={{ color: colors.textPrimary }}>
                  Instant streak recovery
                </span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5" style={{ color: colors.successColor }} />
                <span className="text-sm" style={{ color: colors.textPrimary }}>
                  No waiting period
                </span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5" style={{ color: colors.successColor }} />
                <span className="text-sm" style={{ color: colors.textPrimary }}>
                  Continue your learning momentum
                </span>
              </div>
            </div>

            <Button
              onClick={handlePurchaseRecovery}
              className="w-full h-12 rounded-xl font-semibold mb-3"
              style={{ 
                background: colors.successColor,
                color: '#FFFFFF',
              }}
              aria-label={`Purchase streak recovery for ${recoveryOptions[1].cost}`}
            >
              <Zap className="w-5 h-5 mr-2" />
              Purchase for {recoveryOptions[1].cost}
            </Button>

            <Button
              onClick={() => setShowPurchaseModal(false)}
              variant="ghost"
              className="w-full h-10"
              style={{ color: colors.textSecondary }}
              aria-label="Cancel purchase"
            >
              Cancel
            </Button>
          </div>
        </div>
      )}

      {/* Challenge Modal */}
      {showChallengeModal && (
        <div 
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          onClick={() => !challengeStarted && setShowChallengeModal(false)}
        >
          <div 
            className="w-full max-w-md rounded-2xl p-6"
            style={{
              background: colors.cardBg,
              backdropFilter: colors.blur,
              WebkitBackdropFilter: colors.blur,
              border: colors.glassBorder,
              boxShadow: colors.shadow,
            }}
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-labelledby="challenge-modal-title"
            aria-modal="true"
          >
            {!challengeStarted ? (
              <>
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 id="challenge-modal-title" className="text-xl font-bold mb-1" style={{ color: colors.textPrimary }}>
                      Streak Recovery Challenge
                    </h3>
                    <p className="text-sm" style={{ color: colors.textSecondary }}>
                      Earn your streak back through practice
                    </p>
                  </div>
                  <button
                    onClick={() => setShowChallengeModal(false)}
                    className="p-2 rounded-lg"
                    style={{ color: colors.textSecondary }}
                    aria-label="Close challenge modal"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div 
                  className="rounded-xl p-6 mb-4 text-center"
                  style={{ background: colors.accentBg }}
                >
                  <Target className="w-12 h-12 mx-auto mb-3" style={{ color: colors.accentColor }} />
                  <h4 className="font-bold mb-2" style={{ color: colors.textPrimary }}>
                    Challenge Requirements
                  </h4>
                  <div className="space-y-2 text-sm text-left" style={{ color: colors.textSecondary }}>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4" style={{ color: colors.accentColor }} />
                      <span>Complete 15 sign recognition exercises</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4" style={{ color: colors.accentColor }} />
                      <span>Achieve 80% or higher accuracy</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4" style={{ color: colors.accentColor }} />
                      <span>10-15 minute time commitment</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <AlertCircle className="w-4 h-4" style={{ color: colors.warningColor }} />
                      <span>One attempt only</span>
                    </div>
                  </div>
                </div>

                <Button
                  onClick={handleStartChallenge}
                  className="w-full h-12 rounded-xl font-semibold mb-3"
                  style={{ 
                    background: colors.accentColor,
                    color: '#FFFFFF',
                  }}
                  aria-label="Start streak recovery challenge"
                >
                  <PlayCircle className="w-5 h-5 mr-2" />
                  Start Challenge
                </Button>

                <Button
                  onClick={() => setShowChallengeModal(false)}
                  variant="ghost"
                  className="w-full h-10"
                  style={{ color: colors.textSecondary }}
                  aria-label="Cancel challenge"
                >
                  Maybe Later
                </Button>
              </>
            ) : challengeProgress < 100 ? (
              <div className="text-center">
                <h3 className="text-xl font-bold mb-4" style={{ color: colors.textPrimary }}>
                  Challenge In Progress
                </h3>
                <div 
                  className="rounded-xl p-6 mb-4"
                  style={{ background: colors.accentBg }}
                >
                  <div className="text-5xl font-bold mb-2" style={{ color: colors.accentColor }}>
                    {challengeProgress}%
                  </div>
                  <div 
                    className="w-full h-3 rounded-full overflow-hidden mb-3"
                    style={{ background: colors.border }}
                  >
                    <div 
                      className="h-full transition-all duration-300"
                      style={{ 
                        background: colors.accentColor,
                        width: `${challengeProgress}%`,
                      }}
                      role="progressbar"
                      aria-valuenow={challengeProgress}
                      aria-valuemin={0}
                      aria-valuemax={100}
                      aria-label="Challenge progress"
                    />
                  </div>
                  <p className="text-sm" style={{ color: colors.textSecondary }}>
                    Keep going! You're doing great.
                  </p>
                </div>
              </div>
            ) : (
              <>
                <div className="text-center mb-6">
                  <div 
                    className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
                    style={{ background: colors.successBg }}
                  >
                    <Trophy className="w-10 h-10" style={{ color: colors.successColor }} />
                  </div>
                  <h3 className="text-xl font-bold mb-2" style={{ color: colors.textPrimary }}>
                    Challenge Complete!
                  </h3>
                  <div 
                    className="rounded-xl p-4 mb-4"
                    style={{ background: colors.successBg }}
                  >
                    <div className="text-4xl font-bold" style={{ color: colors.successColor }}>
                      87%
                    </div>
                    <div className="text-sm" style={{ color: colors.textSecondary }}>
                      Final Accuracy
                    </div>
                  </div>
                  <p className="text-sm" style={{ color: colors.textSecondary }}>
                    Excellent work! You've earned your streak back.
                  </p>
                </div>

                <Button
                  onClick={handleCompleteChallengeRecovery}
                  className="w-full h-12 rounded-xl font-semibold"
                  style={{ 
                    background: colors.successColor,
                    color: '#FFFFFF',
                  }}
                  aria-label="Recover streak"
                >
                  <Flame className="w-5 h-5 mr-2" />
                  Recover Streak
                </Button>
              </>
            )}
          </div>
        </div>
      )}

      {/* Insurance Modal */}
      {showInsuranceModal && (
        <div 
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          onClick={() => setShowInsuranceModal(false)}
        >
          <div 
            className="w-full max-w-md rounded-2xl p-6"
            style={{
              background: colors.cardBg,
              backdropFilter: colors.blur,
              WebkitBackdropFilter: colors.blur,
              border: colors.glassBorder,
              boxShadow: colors.shadow,
            }}
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-labelledby="insurance-modal-title"
            aria-modal="true"
          >
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 id="insurance-modal-title" className="text-xl font-bold mb-1" style={{ color: colors.textPrimary }}>
                  Streak Insurance
                </h3>
                <p className="text-sm" style={{ color: colors.textSecondary }}>
                  Protect your progress automatically
                </p>
              </div>
              <button
                onClick={() => setShowInsuranceModal(false)}
                className="p-2 rounded-lg"
                style={{ color: colors.textSecondary }}
                aria-label="Close insurance modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div 
              className="rounded-xl p-6 mb-4 text-center"
              style={{ background: colors.accentBg }}
            >
              <Shield className="w-16 h-16 mx-auto mb-3" style={{ color: colors.accentColor }} />
              <div className="text-3xl font-bold mb-2" style={{ color: colors.textPrimary }}>
                $1.99/month
              </div>
              <p className="text-sm" style={{ color: colors.textSecondary }}>
                Unlimited automatic recoveries
              </p>
            </div>

            <div className="space-y-3 mb-4">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: colors.successColor }} />
                <div>
                  <div className="font-semibold text-sm mb-1" style={{ color: colors.textPrimary }}>
                    Automatic Protection
                  </div>
                  <div className="text-xs" style={{ color: colors.textTertiary }}>
                    Your streak is recovered automatically if you miss a day
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: colors.successColor }} />
                <div>
                  <div className="font-semibold text-sm mb-1" style={{ color: colors.textPrimary }}>
                    Unlimited Recovery
                  </div>
                  <div className="text-xs" style={{ color: colors.textTertiary }}>
                    No limits on how many times per month
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: colors.successColor }} />
                <div>
                  <div className="font-semibold text-sm mb-1" style={{ color: colors.textPrimary }}>
                    Peace of Mind
                  </div>
                  <div className="text-xs" style={{ color: colors.textTertiary }}>
                    Never worry about losing your streak again
                  </div>
                </div>
              </div>
            </div>

            <Button
              onClick={() => setShowInsuranceModal(false)}
              className="w-full h-12 rounded-xl font-semibold mb-3"
              style={{ 
                background: colors.accentColor,
                color: '#FFFFFF',
              }}
              aria-label="Subscribe to streak insurance"
            >
              <Crown className="w-5 h-5 mr-2" />
              Subscribe Now
            </Button>

            <Button
              onClick={() => setShowInsuranceModal(false)}
              variant="ghost"
              className="w-full h-10"
              style={{ color: colors.textSecondary }}
              aria-label="Close insurance modal"
            >
              Maybe Later
            </Button>
          </div>
        </div>
      )}

      {/* Reminder Settings Modal */}
      {showReminderSettings && (
        <div 
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          onClick={() => setShowReminderSettings(false)}
        >
          <div 
            className="w-full max-w-md rounded-2xl p-6"
            style={{
              background: colors.cardBg,
              backdropFilter: colors.blur,
              WebkitBackdropFilter: colors.blur,
              border: colors.glassBorder,
              boxShadow: colors.shadow,
            }}
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-labelledby="reminder-modal-title"
            aria-modal="true"
          >
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 id="reminder-modal-title" className="text-xl font-bold mb-1" style={{ color: colors.textPrimary }}>
                  Reminder Settings
                </h3>
                <p className="text-sm" style={{ color: colors.textSecondary }}>
                  Optimize your practice time
                </p>
              </div>
              <button
                onClick={() => setShowReminderSettings(false)}
                className="p-2 rounded-lg"
                style={{ color: colors.textSecondary }}
                aria-label="Close reminder settings"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 mb-4">
              <div>
                <label className="text-sm font-semibold mb-2 block" style={{ color: colors.textPrimary }}>
                  Reminder Time
                </label>
                <input
                  type="time"
                  defaultValue="19:00"
                  className="w-full h-11 px-4 rounded-xl"
                  style={{
                    background: colors.cardHover,
                    border: colors.glassBorder,
                    color: colors.textPrimary,
                  }}
                  aria-label="Select reminder time"
                />
              </div>

              <div>
                <label className="text-sm font-semibold mb-2 block" style={{ color: colors.textPrimary }}>
                  Reminder Days
                </label>
                <div className="grid grid-cols-7 gap-2">
                  {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, idx) => (
                    <button
                      key={idx}
                      className="aspect-square rounded-lg text-sm font-bold"
                      style={{
                        background: idx < 5 ? colors.iconColor : colors.border,
                        color: idx < 5 ? (theme === 'dark' ? 'var(--color-bg-deep)' : '#FFFFFF') : colors.textTertiary,
                      }}
                      aria-label={`Toggle ${day}`}
                      aria-pressed={idx < 5}
                    >
                      {day}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold" style={{ color: colors.textPrimary }}>
                  Push Notifications
                </span>
                <button
                  className="w-12 h-6 rounded-full relative"
                  style={{ background: colors.successColor }}
                  aria-label="Toggle push notifications"
                  aria-pressed={true}
                >
                  <div 
                    className="w-5 h-5 rounded-full absolute top-0.5 right-0.5 transition-all"
                    style={{ background: '#FFFFFF' }}
                  />
                </button>
              </div>
            </div>

            <Button
              onClick={() => setShowReminderSettings(false)}
              className="w-full h-12 rounded-xl font-semibold"
              style={{ 
                background: colors.successColor,
                color: '#FFFFFF',
              }}
              aria-label="Save reminder settings"
            >
              <Check className="w-5 h-5 mr-2" />
              Save Settings
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
