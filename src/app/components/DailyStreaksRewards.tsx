import { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { useTheme } from '../context/ThemeContext';
import { useApp } from '../context/AppContext';
import exampleImage from 'figma:asset/dae083ecfa58253ad110656151f56529203d91a1.png';
import { 
  X, 
  Flame,
  Trophy,
  Star,
  Calendar,
  Gift,
  Zap,
  Crown,
  Shield,
  Award,
  TrendingUp,
  Users,
  Share2,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Clock,
  Play,
  DollarSign,
  Target,
  Info,
  Lock,
  Unlock,
  Heart,
  Sparkles,
  Medal,
  CircleDot,
  ChevronRight,
  RefreshCw,
  ShoppingCart,
  PlayCircle,
  Check,
  AlertTriangle,
  PartyPopper,
  Rocket,
  BookOpen,
  Brain,
  Coffee,
  Moon,
  Sun,
  Sunrise,
  Sunset,
} from 'lucide-react';

interface DailyStreaksRewardsProps {
  onExit: () => void;
}

interface StreakDay {
  date: string;
  completed: boolean;
  lessonsCompleted?: number;
}

interface Milestone {
  days: number;
  title: string;
  description: string;
  reward: string;
  icon: string;
  unlocked: boolean;
  progress: number;
}

interface Friend {
  id: string;
  name: string;
  avatar: string;
  streak: number;
  rank: number;
}

interface RecoveryOption {
  id: string;
  type: 'ad' | 'purchase' | 'challenge';
  title: string;
  description: string;
  price?: string;
  available: boolean;
  cooldown?: string;
}

export function DailyStreaksRewards({ onExit }: DailyStreaksRewardsProps) {
  const { theme } = useTheme();
  const { userProgress } = useApp();

  const [currentStreak, setCurrentStreak] = useState(18);
  const [longestStreak, setLongestStreak] = useState(42);
  const [totalDays, setTotalDays] = useState(156);
  const [recoveryCount, setRecoveryCount] = useState(3);
  const [freezeInventory, setFreezeInventory] = useState(2);
  const [todayCompleted, setTodayCompleted] = useState(false);
  const [showRecoveryModal, setShowRecoveryModal] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);
  const [flameAnimation, setFlameAnimation] = useState(false);

  // Today's requirement
  const [todayRequirement] = useState({
    lessonsNeeded: 3,
    lessonsCompleted: 2,
    timeRemaining: '6 hours',
  });

  // Streak Calendar Data (Last 60 days)
  const [streakCalendar] = useState<StreakDay[]>(() => {
    const days: StreakDay[] = [];
    const today = new Date();
    for (let i = 59; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const isCompleted = i <= 18 && i !== 1; // Current streak is 18, with one missed day
      days.push({
        date: date.toISOString().split('T')[0],
        completed: isCompleted,
        lessonsCompleted: isCompleted ? Math.floor(Math.random() * 5) + 3 : 0,
      });
    }
    return days;
  });

  // Milestone Rewards
  const [milestones] = useState<Milestone[]>([
    {
      days: 7,
      title: '7-Day Warrior',
      description: 'Complete 7 consecutive days',
      reward: '500 XP + 1 Streak Freeze',
      icon: 'flame',
      unlocked: true,
      progress: 100,
    },
    {
      days: 30,
      title: '30-Day Champion',
      description: 'Maintain a 30-day streak',
      reward: '2000 XP + Premium Avatar',
      icon: 'trophy',
      unlocked: true,
      progress: 100,
    },
    {
      days: 100,
      title: '100-Day Legend',
      description: 'Achieve 100 days of dedication',
      reward: '10,000 XP + Exclusive Badge',
      icon: 'medal',
      unlocked: false,
      progress: 18,
    },
    {
      days: 365,
      title: 'Year-Long Master',
      description: 'One full year of commitment',
      reward: 'Lifetime Premium + Custom Avatar',
      icon: 'crown',
      unlocked: false,
      progress: 5,
    },
  ]);

  // Recovery Options
  const [recoveryOptions] = useState<RecoveryOption[]>([
    {
      id: 'rec-1',
      type: 'ad',
      title: 'Watch Ad to Recover',
      description: 'Watch a 30-second ad to restore your streak',
      available: true,
      cooldown: 'Available now (1/week)',
    },
    {
      id: 'rec-2',
      type: 'purchase',
      title: 'Instant Recovery - Basic',
      description: 'Restore streak immediately',
      price: '$0.99',
      available: true,
    },
    {
      id: 'rec-3',
      type: 'purchase',
      title: 'Instant Recovery - Premium',
      description: 'Restore streak + 1 free freeze',
      price: '$2.99',
      available: true,
    },
    {
      id: 'rec-4',
      type: 'challenge',
      title: 'Complete Special Challenge',
      description: 'Finish 10 lessons today to recover',
      available: true,
    },
  ]);

  // Friends Leaderboard
  const [friendsLeaderboard] = useState<Friend[]>([
    { id: 'f-1', name: 'You', avatar: 'YO', streak: 18, rank: 4 },
    { id: 'f-2', name: 'Emma Wilson', avatar: 'EW', streak: 42, rank: 1 },
    { id: 'f-3', name: 'Noah Martinez', avatar: 'NM', streak: 35, rank: 2 },
    { id: 'f-4', name: 'Olivia Brown', avatar: 'OB', streak: 28, rank: 3 },
    { id: 'f-5', name: 'Liam Davis', avatar: 'LD', streak: 15, rank: 5 },
    { id: 'f-6', name: 'Sophia Garcia', avatar: 'SG', streak: 12, rank: 6 },
    { id: 'f-7', name: 'Mason Johnson', avatar: 'MJ', streak: 9, rank: 7 },
    { id: 'f-8', name: 'Ava Rodriguez', avatar: 'AR', streak: 7, rank: 8 },
  ]);

  // Motivational Messages
  const [motivationalMessages] = useState([
    "You're on fire! 🔥 Keep that streak alive!",
    "18 days strong! You're building an amazing habit!",
    "Consistency is key - you're proving it every day!",
    "Just 12 more days to reach your 30-day milestone!",
    "Your dedication is inspiring! Keep it up!",
  ]);

  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);

  useEffect(() => {
    // Rotate motivational messages
    const interval = setInterval(() => {
      setCurrentMessageIndex((prev) => (prev + 1) % motivationalMessages.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [motivationalMessages.length]);

  useEffect(() => {
    // Flame animation
    const interval = setInterval(() => {
      setFlameAnimation((prev) => !prev);
    }, 500);

    return () => clearInterval(interval);
  }, []);

  const handleCompleteToday = () => {
    setTodayCompleted(true);
    setCurrentStreak((prev) => prev + 1);
    setTotalDays((prev) => prev + 1);
    setShowCelebration(true);
    setTimeout(() => setShowCelebration(false), 3000);
  };

  const handleShare = (platform: string) => {
    const shareText = `I've maintained an ${currentStreak}-day streak on Sign Learn AR! 🔥 Join me in learning ASL! #SignLanguage #StreakMaster`;
    
    if (platform === 'twitter') {
      window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}`, '_blank');
    } else if (platform === 'facebook') {
      window.open(`https://www.facebook.com/sharer/sharer.php?quote=${encodeURIComponent(shareText)}`, '_blank');
    }
    setShowShareModal(false);
  };

  const getStreakIntensity = (completed: boolean, lessonsCompleted: number = 0) => {
    if (!completed) return 0;
    if (lessonsCompleted >= 8) return 5;
    if (lessonsCompleted >= 6) return 4;
    if (lessonsCompleted >= 4) return 3;
    if (lessonsCompleted >= 2) return 2;
    return 1;
  };

  const getIntensityColor = (intensity: number) => {
    if (intensity === 0) return colors.border;
    if (intensity === 1) return colors.iconColor + '30';
    if (intensity === 2) return colors.iconColor + '50';
    if (intensity === 3) return colors.iconColor + '70';
    if (intensity === 4) return colors.iconColor + '90';
    return colors.iconColor;
  };

  const getMilestoneIcon = (iconName: string) => {
    const icons: Record<string, any> = {
      flame: Flame,
      trophy: Trophy,
      medal: Medal,
      crown: Crown,
    };
    return icons[iconName] || Trophy;
  };

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

  return (
    <div 
      className="h-full flex flex-col"
      style={{ background: colors.bg, color: colors.textPrimary }}
      role="main"
      aria-labelledby="streaks-title"
    >
      {/* Header */}
      <div 
        className="p-4 border-b"
        style={{ borderBottomColor: colors.border }}
      >
        <div className="flex items-center gap-2 sm:gap-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={onExit}
            style={{ color: colors.textSecondary }}
            aria-label="Exit daily streaks and rewards"
            className="flex-shrink-0"
          >
            <X className="w-6 h-6" />
          </Button>
          <div className="flex-1 min-w-0">
            <h1 
              id="streaks-title" 
              className="text-xl sm:text-2xl font-bold truncate"
              style={{ fontFamily: 'Poppins, sans-serif' }}
            >
              Daily Streaks & Rewards
            </h1>
            <p className="text-sm truncate" style={{ color: colors.textSecondary }}>
              Keep your learning streak alive
            </p>
          </div>
        </div>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto">
        {/* Current Streak Display */}
        <section aria-labelledby="current-streak-heading" className="p-4">
          <div 
            className="rounded-2xl p-6 text-center relative overflow-hidden"
            style={{
              background: `linear-gradient(135deg, ${colors.warningColor}20 0%, ${colors.errorColor}20 100%)`,
              border: colors.glassBorder,
            }}
          >
            {/* Animated Flame Icon */}
            <div className="flex justify-center mb-4">
              <div 
                className="relative"
                style={{
                  transform: flameAnimation ? 'scale(1.1)' : 'scale(1)',
                  transition: 'transform 0.3s ease',
                }}
              >
                <Flame 
                  className="w-20 h-20" 
                  style={{ color: colors.warningColor }}
                  fill={colors.warningColor}
                  aria-hidden="true"
                />
                <Sparkles 
                  className="w-6 h-6 absolute -top-2 -right-2" 
                  style={{ color: colors.iconColor }}
                  aria-hidden="true"
                />
              </div>
            </div>

            <div className="text-6xl font-bold mb-2" style={{ color: colors.textPrimary }}>
              {currentStreak}
            </div>
            <div className="text-xl font-semibold mb-1" style={{ color: colors.textPrimary }}>
              Day Streak
            </div>
            <div className="text-sm" style={{ color: colors.textTertiary }}>
              Keep going! You're on a roll! 🔥
            </div>

            {/* Freeze Inventory Badge */}
            {freezeInventory > 0 && (
              <div 
                className="absolute top-4 right-4 rounded-full px-3 py-1.5 flex items-center gap-1.5"
                style={{
                  background: colors.iconBg,
                  border: `2px solid ${colors.iconColor}`,
                }}
              >
                <Shield className="w-4 h-4" style={{ color: colors.iconColor }} />
                <span className="text-sm font-bold" style={{ color: colors.iconColor }}>
                  {freezeInventory} Freezes
                </span>
              </div>
            )}
          </div>

          {/* Motivational Message */}
          <div 
            className="rounded-xl p-4 mt-3 flex items-center gap-3"
            style={{
              background: colors.successBg,
              border: colors.glassBorder,
            }}
          >
            <Sparkles className="w-5 h-5 flex-shrink-0" style={{ color: colors.successColor }} aria-hidden="true" />
            <p className="text-sm font-medium" style={{ color: colors.textPrimary }}>
              {motivationalMessages[currentMessageIndex]}
            </p>
          </div>
        </section>

        {/* Today's Status */}
        <section aria-labelledby="today-status-heading" className="px-4 pb-4">
          <h2 id="today-status-heading" className="text-lg font-semibold mb-3" style={{ color: colors.textPrimary }}>
            Today's Progress
          </h2>

          <div 
            className="rounded-xl p-4"
            style={{
              background: colors.cardBg,
              backdropFilter: colors.blur,
              WebkitBackdropFilter: colors.blur,
              border: colors.glassBorder,
              boxShadow: colors.shadow,
            }}
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                {todayCompleted ? (
                  <CheckCircle2 className="w-6 h-6" style={{ color: colors.successColor }} />
                ) : (
                  <AlertCircle className="w-6 h-6" style={{ color: colors.warningColor }} />
                )}
                <div>
                  <div className="font-semibold" style={{ color: colors.textPrimary }}>
                    {todayCompleted ? 'Completed Today!' : 'Not Yet Complete'}
                  </div>
                  <div className="text-sm" style={{ color: colors.textTertiary }}>
                    {todayCompleted 
                      ? 'Great job! Streak continues tomorrow' 
                      : `${todayRequirement.lessonsNeeded - todayRequirement.lessonsCompleted} more lesson${todayRequirement.lessonsNeeded - todayRequirement.lessonsCompleted !== 1 ? 's' : ''} needed`}
                  </div>
                </div>
              </div>
              <Clock className="w-5 h-5" style={{ color: colors.textTertiary }} />
            </div>

            {!todayCompleted && (
              <>
                <div className="mb-3">
                  <div className="flex items-center justify-between mb-1 text-sm" style={{ color: colors.textTertiary }}>
                    <span>Lessons Today</span>
                    <span>{todayRequirement.lessonsCompleted}/{todayRequirement.lessonsNeeded}</span>
                  </div>
                  <div 
                    className="w-full h-2 rounded-full overflow-hidden"
                    style={{ background: colors.border }}
                    role="progressbar"
                    aria-valuenow={todayRequirement.lessonsCompleted}
                    aria-valuemin={0}
                    aria-valuemax={todayRequirement.lessonsNeeded}
                  >
                    <div 
                      className="h-full rounded-full transition-all"
                      style={{ 
                        background: colors.successColor,
                        width: `${(todayRequirement.lessonsCompleted / todayRequirement.lessonsNeeded) * 100}%`,
                      }}
                    />
                  </div>
                </div>

                <div 
                  className="rounded-lg p-3 mb-3 flex items-center gap-2"
                  style={{ background: colors.warningBg }}
                >
                  <AlertTriangle className="w-4 h-4 flex-shrink-0" style={{ color: colors.warningColor }} />
                  <span className="text-sm font-medium" style={{ color: colors.textPrimary }}>
                    ⏰ {todayRequirement.timeRemaining} remaining to maintain streak
                  </span>
                </div>

                <Button
                  onClick={handleCompleteToday}
                  className="w-full h-12 rounded-xl font-semibold"
                  style={{ 
                    background: colors.successColor,
                    color: '#FFFFFF',
                  }}
                  aria-label="Complete today's requirement"
                >
                  <Target className="w-5 h-5 mr-2" />
                  Complete Today's Requirement
                </Button>
              </>
            )}
          </div>
        </section>

        {/* Streak Calendar Heatmap */}
        <section aria-labelledby="calendar-heading" className="px-4 pb-4">
          <h2 id="calendar-heading" className="text-lg font-semibold mb-3" style={{ color: colors.textPrimary }}>
            Streak Calendar
          </h2>

          <div 
            className="rounded-xl p-4"
            style={{
              background: colors.cardBg,
              backdropFilter: colors.blur,
              WebkitBackdropFilter: colors.blur,
              border: colors.glassBorder,
              boxShadow: colors.shadow,
            }}
          >
            <div className="grid grid-cols-10 gap-1.5">
              {streakCalendar.map((day, index) => {
                const intensity = getStreakIntensity(day.completed, day.lessonsCompleted);
                const date = new Date(day.date);
                const dayOfMonth = date.getDate();
                
                return (
                  <div
                    key={index}
                    className="aspect-square rounded"
                    style={{
                      background: getIntensityColor(intensity),
                      border: day.completed ? `1px solid ${colors.iconColor}40` : `1px solid ${colors.border}`,
                    }}
                    role="gridcell"
                    aria-label={`${day.date}: ${day.completed ? `${day.lessonsCompleted} lessons completed` : 'No activity'}`}
                    title={`${day.date}: ${day.completed ? `${day.lessonsCompleted} lessons` : 'No activity'}`}
                  >
                    {index % 10 === 0 && (
                      <div className="text-xs text-center" style={{ color: colors.textTertiary }}>
                        {dayOfMonth}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            <div className="flex items-center justify-between mt-4 pt-4 border-t" style={{ borderTopColor: colors.border }}>
              <span className="text-xs" style={{ color: colors.textTertiary }}>
                Less
              </span>
              <div className="flex items-center gap-1">
                {[0, 1, 2, 3, 4, 5].map((intensity) => (
                  <div
                    key={intensity}
                    className="w-4 h-4 rounded"
                    style={{ background: getIntensityColor(intensity) }}
                    aria-hidden="true"
                  />
                ))}
              </div>
              <span className="text-xs" style={{ color: colors.textTertiary }}>
                More
              </span>
            </div>
          </div>
        </section>

        {/* Milestone Rewards */}
        <section aria-labelledby="milestones-heading" className="px-4 pb-4">
          <h2 id="milestones-heading" className="text-lg font-semibold mb-3" style={{ color: colors.textPrimary }}>
            Milestone Rewards
          </h2>

          <div className="space-y-3">
            {milestones.map((milestone) => {
              const IconComponent = getMilestoneIcon(milestone.icon);
              
              return (
                <div
                  key={milestone.days}
                  className="rounded-xl p-4"
                  style={{
                    background: colors.cardBg,
                    backdropFilter: colors.blur,
                    WebkitBackdropFilter: colors.blur,
                    border: colors.glassBorder,
                    boxShadow: colors.shadow,
                    opacity: milestone.unlocked ? 1 : 0.8,
                  }}
                >
                  <div className="flex items-start gap-3 mb-3">
                    <div 
                      className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                      style={{ background: milestone.unlocked ? colors.warningBg : colors.iconBg }}
                    >
                      {milestone.unlocked ? (
                        <IconComponent className="w-6 h-6" style={{ color: colors.warningColor }} />
                      ) : (
                        <Lock className="w-6 h-6" style={{ color: colors.textTertiary }} />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold" style={{ color: colors.textPrimary }}>
                          {milestone.title}
                        </h3>
                        {milestone.unlocked && (
                          <CheckCircle2 className="w-4 h-4" style={{ color: colors.successColor }} />
                        )}
                      </div>
                      <div className="text-sm mb-1" style={{ color: colors.textTertiary }}>
                        {milestone.description}
                      </div>
                      <div 
                        className="text-sm font-semibold px-2 py-1 rounded inline-block"
                        style={{ 
                          background: colors.successBg,
                          color: colors.successColor,
                        }}
                      >
                        🎁 {milestone.reward}
                      </div>
                    </div>
                  </div>

                  <div className="mb-2">
                    <div className="flex items-center justify-between mb-1 text-xs" style={{ color: colors.textTertiary }}>
                      <span>{milestone.unlocked ? 'Completed' : 'Progress'}</span>
                      <span>{milestone.progress}%</span>
                    </div>
                    <div 
                      className="w-full h-2 rounded-full overflow-hidden"
                      style={{ background: colors.border }}
                      role="progressbar"
                      aria-valuenow={milestone.progress}
                      aria-valuemin={0}
                      aria-valuemax={100}
                    >
                      <div 
                        className="h-full rounded-full transition-all"
                        style={{ 
                          background: milestone.unlocked ? colors.successColor : colors.iconColor,
                          width: `${milestone.progress}%`,
                        }}
                      />
                    </div>
                  </div>

                  <div className="text-xs" style={{ color: colors.textTertiary }}>
                    {milestone.unlocked 
                      ? `Unlocked at ${milestone.days} days` 
                      : `${milestone.days - currentStreak} more days to unlock`}
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Streak Protection */}
        <section aria-labelledby="protection-heading" className="px-4 pb-4">
          <h2 id="protection-heading" className="text-lg font-semibold mb-3" style={{ color: colors.textPrimary }}>
            Streak Protection
          </h2>

          <div className="grid grid-cols-2 gap-3 mb-3">
            <div 
              className="rounded-xl p-4"
              style={{
                background: colors.cardBg,
                backdropFilter: colors.blur,
                WebkitBackdropFilter: colors.blur,
                border: colors.glassBorder,
                boxShadow: colors.shadow,
              }}
            >
              <div 
                className="w-10 h-10 rounded-lg flex items-center justify-center mb-3"
                style={{ background: colors.iconBg }}
              >
                <Shield className="w-5 h-5" style={{ color: colors.iconColor }} />
              </div>
              <div className="text-2xl font-bold mb-1" style={{ color: colors.textPrimary }}>
                {freezeInventory}
              </div>
              <div className="text-sm" style={{ color: colors.textTertiary }}>
                Streak Freezes
              </div>
            </div>

            <div 
              className="rounded-xl p-4"
              style={{
                background: colors.cardBg,
                backdropFilter: colors.blur,
                WebkitBackdropFilter: colors.blur,
                border: colors.glassBorder,
                boxShadow: colors.shadow,
              }}
            >
              <div 
                className="w-10 h-10 rounded-lg flex items-center justify-center mb-3"
                style={{ background: colors.warningBg }}
              >
                <RefreshCw className="w-5 h-5" style={{ color: colors.warningColor }} />
              </div>
              <div className="text-2xl font-bold mb-1" style={{ color: colors.textPrimary }}>
                {recoveryCount}
              </div>
              <div className="text-sm" style={{ color: colors.textTertiary }}>
                Recoveries Used
              </div>
            </div>
          </div>

          <Button
            className="w-full h-12 rounded-xl font-semibold mb-2"
            style={{ 
              background: colors.iconBg,
              color: colors.iconColor,
              border: `2px solid ${colors.iconColor}`,
            }}
            aria-label="Purchase streak freeze"
          >
            <ShoppingCart className="w-5 h-5 mr-2" />
            Buy Streak Freeze - $1.99
          </Button>

          <Button
            onClick={() => setShowRecoveryModal(true)}
            className="w-full h-12 rounded-xl font-semibold"
            style={{ 
              background: colors.warningBg,
              color: colors.warningColor,
              border: `2px solid ${colors.warningColor}`,
            }}
            aria-label="View recovery options"
          >
            <RefreshCw className="w-5 h-5 mr-2" />
            Streak Recovery Options
          </Button>
        </section>

        {/* Friends Leaderboard */}
        <section aria-labelledby="leaderboard-heading" className="px-4 pb-4">
          <h2 id="leaderboard-heading" className="text-lg font-semibold mb-3" style={{ color: colors.textPrimary }}>
            Friends Leaderboard
          </h2>

          <div className="space-y-2">
            {friendsLeaderboard.map((friend) => (
              <div
                key={friend.id}
                className="rounded-xl p-3"
                style={{
                  background: friend.name === 'You' ? colors.iconBg : colors.cardBg,
                  backdropFilter: colors.blur,
                  WebkitBackdropFilter: colors.blur,
                  border: friend.name === 'You' ? `2px solid ${colors.iconColor}` : colors.glassBorder,
                  boxShadow: colors.shadow,
                }}
              >
                <div className="flex items-center gap-3">
                  <div 
                    className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 font-bold text-sm"
                    style={{ 
                      background: friend.rank === 1 ? colors.warningBg :
                                  friend.rank === 2 ? colors.textTertiary + '30' :
                                  friend.rank === 3 ? colors.errorBg :
                                  colors.iconBg,
                      color: friend.rank === 1 ? colors.warningColor :
                             friend.rank === 2 ? colors.textTertiary :
                             friend.rank === 3 ? colors.errorColor :
                             colors.iconColor,
                    }}
                  >
                    #{friend.rank}
                  </div>
                  <div 
                    className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 font-bold"
                    style={{ 
                      background: colors.iconBg,
                      color: colors.iconColor,
                    }}
                  >
                    {friend.avatar}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold" style={{ color: colors.textPrimary }}>
                      {friend.name}
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg" style={{ background: colors.warningBg }}>
                    <Flame className="w-4 h-4" style={{ color: colors.warningColor }} />
                    <span className="font-bold" style={{ color: colors.warningColor }}>
                      {friend.streak}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Personal Statistics */}
        <section aria-labelledby="stats-heading" className="px-4 pb-4">
          <h2 id="stats-heading" className="text-lg font-semibold mb-3" style={{ color: colors.textPrimary }}>
            Your Statistics
          </h2>

          <div className="grid grid-cols-3 gap-3">
            <div 
              className="rounded-xl p-4 text-center"
              style={{
                background: colors.cardBg,
                backdropFilter: colors.blur,
                WebkitBackdropFilter: colors.blur,
                border: colors.glassBorder,
                boxShadow: colors.shadow,
              }}
            >
              <Trophy className="w-6 h-6 mx-auto mb-2" style={{ color: colors.warningColor }} />
              <div className="text-xl font-bold mb-1" style={{ color: colors.textPrimary }}>
                {longestStreak}
              </div>
              <div className="text-xs" style={{ color: colors.textTertiary }}>
                Longest Streak
              </div>
            </div>

            <div 
              className="rounded-xl p-4 text-center"
              style={{
                background: colors.cardBg,
                backdropFilter: colors.blur,
                WebkitBackdropFilter: colors.blur,
                border: colors.glassBorder,
                boxShadow: colors.shadow,
              }}
            >
              <Calendar className="w-6 h-6 mx-auto mb-2" style={{ color: colors.iconColor }} />
              <div className="text-xl font-bold mb-1" style={{ color: colors.textPrimary }}>
                {totalDays}
              </div>
              <div className="text-xs" style={{ color: colors.textTertiary }}>
                Total Days
              </div>
            </div>

            <div 
              className="rounded-xl p-4 text-center"
              style={{
                background: colors.cardBg,
                backdropFilter: colors.blur,
                WebkitBackdropFilter: colors.blur,
                border: colors.glassBorder,
                boxShadow: colors.shadow,
              }}
            >
              <RefreshCw className="w-6 h-6 mx-auto mb-2" style={{ color: colors.successColor }} />
              <div className="text-xl font-bold mb-1" style={{ color: colors.textPrimary }}>
                {recoveryCount}
              </div>
              <div className="text-xs" style={{ color: colors.textTertiary }}>
                Recoveries
              </div>
            </div>
          </div>
        </section>

        {/* Share Achievement */}
        <section className="px-4 pb-6">
          <Button
            onClick={() => setShowShareModal(true)}
            className="w-full h-12 rounded-xl font-semibold"
            style={{ 
              background: colors.successColor,
              color: '#FFFFFF',
            }}
            aria-label="Share streak achievement"
          >
            <Share2 className="w-5 h-5 mr-2" />
            Share Your Streak Achievement
          </Button>
        </section>

        {/* Info Box */}
        <section className="px-4 pb-6">
          <div 
            className="rounded-xl p-4 flex items-start gap-3"
            style={{
              background: colors.iconBg,
              border: colors.glassBorder,
            }}
          >
            <Info className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: colors.iconColor }} aria-hidden="true" />
            <div className="text-sm" style={{ color: colors.textSecondary }}>
              <strong style={{ color: colors.textPrimary }}>Streak Tips:</strong> Complete at least 3 lessons daily to maintain your streak. Use streak freezes wisely for days when you can't practice. Your dedication builds real habits!
            </div>
          </div>
        </section>
      </div>

      {/* Recovery Options Modal */}
      {showRecoveryModal && (
        <div 
          className="fixed inset-0 bg-black/50 flex items-end sm:items-center justify-center z-50 p-4"
          onClick={() => setShowRecoveryModal(false)}
        >
          <div 
            className="w-full max-w-md rounded-2xl p-6 max-h-[85vh] overflow-y-auto"
            style={{
              background: colors.cardBg,
              backdropFilter: colors.blur,
              WebkitBackdropFilter: colors.blur,
              border: colors.glassBorder,
              boxShadow: colors.shadow,
            }}
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-labelledby="recovery-title"
            aria-modal="true"
          >
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 id="recovery-title" className="text-xl font-bold mb-1" style={{ color: colors.textPrimary }}>
                  Recover Your Streak
                </h3>
                <p className="text-sm" style={{ color: colors.textSecondary }}>
                  Choose a recovery method
                </p>
              </div>
              <button
                onClick={() => setShowRecoveryModal(false)}
                className="p-2 rounded-lg"
                style={{ color: colors.textSecondary }}
                aria-label="Close recovery options"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3">
              {recoveryOptions.map((option) => (
                <button
                  key={option.id}
                  disabled={!option.available}
                  className="w-full rounded-xl p-4 text-left"
                  style={{
                    background: option.available ? colors.cardHover : colors.border,
                    border: colors.glassBorder,
                    cursor: option.available ? 'pointer' : 'not-allowed',
                    opacity: option.available ? 1 : 0.6,
                  }}
                  aria-label={`${option.title}: ${option.description}`}
                >
                  <div className="flex items-start gap-3">
                    <div 
                      className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                      style={{ 
                        background: option.type === 'ad' ? colors.iconBg :
                                    option.type === 'purchase' ? colors.successBg :
                                    colors.warningBg,
                      }}
                    >
                      {option.type === 'ad' && <PlayCircle className="w-6 h-6" style={{ color: colors.iconColor }} />}
                      {option.type === 'purchase' && <ShoppingCart className="w-6 h-6" style={{ color: colors.successColor }} />}
                      {option.type === 'challenge' && <Target className="w-6 h-6" style={{ color: colors.warningColor }} />}
                    </div>
                    <div className="flex-1">
                      <div className="font-semibold mb-1" style={{ color: colors.textPrimary }}>
                        {option.title}
                        {option.price && (
                          <span className="ml-2 text-sm font-bold" style={{ color: colors.successColor }}>
                            {option.price}
                          </span>
                        )}
                      </div>
                      <div className="text-sm mb-2" style={{ color: colors.textTertiary }}>
                        {option.description}
                      </div>
                      {option.cooldown && (
                        <div className="text-xs" style={{ color: colors.iconColor }}>
                          {option.cooldown}
                        </div>
                      )}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Share Modal */}
      {showShareModal && (
        <div 
          className="fixed inset-0 bg-black/50 flex items-end sm:items-center justify-center z-50 p-4"
          onClick={() => setShowShareModal(false)}
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
            aria-labelledby="share-title"
            aria-modal="true"
          >
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 id="share-title" className="text-xl font-bold mb-1" style={{ color: colors.textPrimary }}>
                  Share Your Achievement
                </h3>
                <p className="text-sm" style={{ color: colors.textSecondary }}>
                  Show off your {currentStreak}-day streak!
                </p>
              </div>
              <button
                onClick={() => setShowShareModal(false)}
                className="p-2 rounded-lg"
                style={{ color: colors.textSecondary }}
                aria-label="Close share modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <Button
                onClick={() => handleShare('twitter')}
                className="h-16 rounded-xl font-semibold flex flex-col items-center justify-center gap-2"
                style={{ 
                  background: colors.iconBg,
                  color: colors.iconColor,
                }}
                aria-label="Share on Twitter"
              >
                <Share2 className="w-6 h-6" />
                Twitter
              </Button>
              <Button
                onClick={() => handleShare('facebook')}
                className="h-16 rounded-xl font-semibold flex flex-col items-center justify-center gap-2"
                style={{ 
                  background: colors.accentBg,
                  color: colors.accentColor,
                }}
                aria-label="Share on Facebook"
              >
                <Share2 className="w-6 h-6" />
                Facebook
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Celebration Overlay */}
      {showCelebration && (
        <div 
          className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none"
          role="status"
          aria-live="polite"
        >
          <div 
            className="rounded-2xl p-8 text-center"
            style={{
              background: colors.cardBg,
              backdropFilter: colors.blur,
              WebkitBackdropFilter: colors.blur,
              border: colors.glassBorder,
              boxShadow: colors.shadow,
            }}
          >
            <PartyPopper className="w-16 h-16 mx-auto mb-4" style={{ color: colors.warningColor }} />
            <div className="text-2xl font-bold mb-2" style={{ color: colors.textPrimary }}>
              Streak Extended! 🎉
            </div>
            <div className="text-lg" style={{ color: colors.textSecondary }}>
              {currentStreak} days and counting!
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
