import { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { useTheme } from '../context/ThemeContext';
import { useApp } from '../context/AppContext';
import { 
  X, 
  MapPin,
  Clock,
  Calendar,
  Sun,
  Moon,
  Coffee,
  Home,
  Briefcase,
  ShoppingCart,
  Utensils,
  GraduationCap,
  Dumbbell,
  Bus,
  Heart,
  Target,
  TrendingUp,
  Activity,
  Zap,
  ChevronRight,
  Play,
  Lock,
  Crown,
  CheckCircle2,
  RefreshCw,
  Settings,
  Info,
} from 'lucide-react';

interface ContextAwareDashboardProps {
  onExit: () => void;
  onStartLesson?: (lessonId: string) => void;
  onUpgrade?: () => void;
}

interface ContextualLesson {
  id: string;
  title: string;
  description: string;
  context: string;
  duration: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  isPremium: boolean;
  relevanceScore: number;
  icon: any;
  signs: number;
}

interface LocationContext {
  id: string;
  name: string;
  icon: any;
  isActive: boolean;
  lessons: ContextualLesson[];
}

interface TimeBasedRecommendation {
  id: string;
  title: string;
  description: string;
  timeOfDay: 'morning' | 'afternoon' | 'evening' | 'night';
  duration: string;
  difficulty: string;
  isPremium: boolean;
}

interface RecentContext {
  id: string;
  location: string;
  time: string;
  lessonsCompleted: number;
  timestamp: string;
}

export function ContextAwareDashboard({ 
  onExit,
  onStartLesson,
  onUpgrade,
}: ContextAwareDashboardProps) {
  const { theme } = useTheme();
  const { userProgress } = useApp();

  // Current Context State
  const [currentLocation, setCurrentLocation] = useState<string>('Home');
  const [currentTime, setCurrentTime] = useState<Date>(new Date());
  const [weatherContext, setWeatherContext] = useState<string>('Clear');
  const [timeOfDay, setTimeOfDay] = useState<'morning' | 'afternoon' | 'evening' | 'night'>('afternoon');

  // Settings State
  const [autoDetectLocation, setAutoDetectLocation] = useState(true);
  const [useTimeBasedSuggestions, setUseTimeBasedSuggestions] = useState(true);
  const [enableContextualNotifications, setEnableContextualNotifications] = useState(true);
  const [privacyMode, setPrivacyMode] = useState(false);

  // Contextual Lessons
  const [suggestedLessons, setSuggestedLessons] = useState<ContextualLesson[]>([
    {
      id: 'home-greetings',
      title: 'Home & Family Signs',
      description: 'Essential signs for family interactions at home',
      context: 'You\'re at home - perfect time to practice family signs',
      duration: '15 min',
      difficulty: 'beginner',
      isPremium: false,
      relevanceScore: 95,
      icon: Home,
      signs: 12,
    },
    {
      id: 'daily-routines',
      title: 'Daily Routine Vocabulary',
      description: 'Signs for everyday activities and routines',
      context: 'Afternoon routine - learn signs for daily tasks',
      duration: '20 min',
      difficulty: 'beginner',
      isPremium: false,
      relevanceScore: 88,
      icon: Clock,
      signs: 15,
    },
    {
      id: 'cooking-kitchen',
      title: 'Kitchen & Cooking Signs',
      description: 'Food preparation and kitchen vocabulary',
      context: 'Near dinner time - practice cooking signs',
      duration: '18 min',
      difficulty: 'intermediate',
      isPremium: true,
      relevanceScore: 82,
      icon: Utensils,
      signs: 20,
    },
  ]);

  // Location-Based Content
  const [locationContexts] = useState<LocationContext[]>([
    {
      id: 'home',
      name: 'At Home',
      icon: Home,
      isActive: true,
      lessons: [
        {
          id: 'home-1',
          title: 'Family Members',
          description: 'Signs for mom, dad, sister, brother, etc.',
          context: 'Home',
          duration: '12 min',
          difficulty: 'beginner',
          isPremium: false,
          relevanceScore: 92,
          icon: Heart,
          signs: 10,
        },
        {
          id: 'home-2',
          title: 'Household Items',
          description: 'Common objects around the house',
          context: 'Home',
          duration: '15 min',
          difficulty: 'beginner',
          isPremium: false,
          relevanceScore: 85,
          icon: Home,
          signs: 18,
        },
      ],
    },
    {
      id: 'work',
      name: 'At Work',
      icon: Briefcase,
      isActive: false,
      lessons: [
        {
          id: 'work-1',
          title: 'Office Vocabulary',
          description: 'Professional and workplace signs',
          context: 'Work',
          duration: '20 min',
          difficulty: 'intermediate',
          isPremium: true,
          relevanceScore: 78,
          icon: Briefcase,
          signs: 25,
        },
        {
          id: 'work-2',
          title: 'Business Communication',
          description: 'Meetings, presentations, and discussions',
          context: 'Work',
          duration: '25 min',
          difficulty: 'advanced',
          isPremium: true,
          relevanceScore: 72,
          icon: GraduationCap,
          signs: 30,
        },
      ],
    },
    {
      id: 'shopping',
      name: 'Shopping',
      icon: ShoppingCart,
      isActive: false,
      lessons: [
        {
          id: 'shop-1',
          title: 'Shopping & Numbers',
          description: 'Price negotiation and shopping vocabulary',
          context: 'Shopping',
          duration: '18 min',
          difficulty: 'intermediate',
          isPremium: false,
          relevanceScore: 80,
          icon: ShoppingCart,
          signs: 22,
        },
      ],
    },
    {
      id: 'gym',
      name: 'At Gym',
      icon: Dumbbell,
      isActive: false,
      lessons: [
        {
          id: 'gym-1',
          title: 'Exercise & Fitness',
          description: 'Gym equipment and workout vocabulary',
          context: 'Gym',
          duration: '15 min',
          difficulty: 'intermediate',
          isPremium: true,
          relevanceScore: 75,
          icon: Dumbbell,
          signs: 16,
        },
      ],
    },
  ]);

  // Time-Based Recommendations
  const [timeBasedRecommendations] = useState<TimeBasedRecommendation[]>([
    {
      id: 'morning-1',
      title: 'Morning Greetings',
      description: 'Start your day with essential greeting signs',
      timeOfDay: 'morning',
      duration: '10 min',
      difficulty: 'beginner',
      isPremium: false,
    },
    {
      id: 'morning-2',
      title: 'Breakfast Vocabulary',
      description: 'Food and meal-related signs for breakfast',
      timeOfDay: 'morning',
      duration: '12 min',
      difficulty: 'beginner',
      isPremium: false,
    },
    {
      id: 'afternoon-1',
      title: 'Work & Activities',
      description: 'Afternoon routine and activity signs',
      timeOfDay: 'afternoon',
      duration: '15 min',
      difficulty: 'intermediate',
      isPremium: false,
    },
    {
      id: 'afternoon-2',
      title: 'Social Interactions',
      description: 'Conversation and social situation signs',
      timeOfDay: 'afternoon',
      duration: '20 min',
      difficulty: 'intermediate',
      isPremium: true,
    },
    {
      id: 'evening-1',
      title: 'Dinner & Family Time',
      description: 'Evening meal and family conversation signs',
      timeOfDay: 'evening',
      duration: '18 min',
      difficulty: 'beginner',
      isPremium: false,
    },
    {
      id: 'evening-2',
      title: 'Relaxation & Hobbies',
      description: 'Leisure activity and hobby vocabulary',
      timeOfDay: 'evening',
      duration: '16 min',
      difficulty: 'intermediate',
      isPremium: true,
    },
    {
      id: 'night-1',
      title: 'Bedtime Routine',
      description: 'Night time and bedtime-related signs',
      timeOfDay: 'night',
      duration: '10 min',
      difficulty: 'beginner',
      isPremium: false,
    },
    {
      id: 'night-2',
      title: 'Feelings & Emotions',
      description: 'Express how you feel before sleep',
      timeOfDay: 'night',
      duration: '14 min',
      difficulty: 'beginner',
      isPremium: false,
    },
  ]);

  // Nearby Activities (simulated)
  const [nearbyActivities] = useState([
    {
      id: 'nearby-1',
      title: 'ASL Meetup Downtown',
      location: '2.3 miles away',
      time: 'Tonight at 7:00 PM',
      attendees: 12,
    },
    {
      id: 'nearby-2',
      title: 'Deaf Coffee Chat',
      location: '3.1 miles away',
      time: 'Saturday at 10:00 AM',
      attendees: 8,
    },
    {
      id: 'nearby-3',
      title: 'Sign Language Practice',
      location: '1.5 miles away',
      time: 'Tomorrow at 6:30 PM',
      attendees: 15,
    },
  ]);

  // Recent Learning Activities
  const [recentActivities] = useState([
    {
      id: 'activity-1',
      lesson: 'Basic Greetings',
      time: '2 hours ago',
      progress: 100,
      location: 'Home',
    },
    {
      id: 'activity-2',
      lesson: 'Food & Drinks',
      time: 'Yesterday',
      progress: 75,
      location: 'Coffee Shop',
    },
    {
      id: 'activity-3',
      lesson: 'Numbers 1-20',
      time: '2 days ago',
      progress: 100,
      location: 'Home',
    },
    {
      id: 'activity-4',
      lesson: 'Colors',
      time: '3 days ago',
      progress: 90,
      location: 'Park',
    },
  ]);

  // Recent Contexts
  const [recentContexts] = useState<RecentContext[]>([
    {
      id: 'ctx-1',
      location: 'Home',
      time: 'Evening',
      lessonsCompleted: 3,
      timestamp: 'Today',
    },
    {
      id: 'ctx-2',
      location: 'Coffee Shop',
      time: 'Afternoon',
      lessonsCompleted: 1,
      timestamp: 'Yesterday',
    },
    {
      id: 'ctx-3',
      location: 'Office',
      time: 'Morning',
      lessonsCompleted: 2,
      timestamp: '2 days ago',
    },
    {
      id: 'ctx-4',
      location: 'Gym',
      time: 'Evening',
      lessonsCompleted: 1,
      timestamp: '3 days ago',
    },
  ]);

  // Update time of day based on current time
  useEffect(() => {
    const updateTimeOfDay = () => {
      const hour = currentTime.getHours();
      if (hour >= 5 && hour < 12) {
        setTimeOfDay('morning');
      } else if (hour >= 12 && hour < 17) {
        setTimeOfDay('afternoon');
      } else if (hour >= 17 && hour < 21) {
        setTimeOfDay('evening');
      } else {
        setTimeOfDay('night');
      }
    };

    updateTimeOfDay();
    const interval = setInterval(() => {
      setCurrentTime(new Date());
      updateTimeOfDay();
    }, 60000); // Update every minute

    return () => clearInterval(interval);
  }, [currentTime]);

  const handleRefreshContext = () => {
    // Simulate context refresh
    setCurrentTime(new Date());
  };

  const handleStartLesson = (lessonId: string, isPremium: boolean) => {
    if (isPremium && !userProgress.isPremium) {
      onUpgrade?.();
    } else {
      onStartLesson?.(lessonId);
    }
  };

  const getTimeIcon = () => {
    switch (timeOfDay) {
      case 'morning':
        return <Sun className="w-5 h-5" />;
      case 'afternoon':
        return <Sun className="w-5 h-5" />;
      case 'evening':
        return <Moon className="w-5 h-5" />;
      case 'night':
        return <Moon className="w-5 h-5" />;
      default:
        return <Clock className="w-5 h-5" />;
    }
  };

  const getTimeLabel = () => {
    switch (timeOfDay) {
      case 'morning':
        return 'Morning';
      case 'afternoon':
        return 'Afternoon';
      case 'evening':
        return 'Evening';
      case 'night':
        return 'Night';
      default:
        return 'Day';
    }
  };

  // Filter time-based recommendations
  const currentTimeRecommendations = timeBasedRecommendations.filter(
    rec => rec.timeOfDay === timeOfDay
  );

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

  return (
    <div 
      className="h-full flex flex-col"
      style={{ background: colors.bg, color: colors.textPrimary }}
      role="main"
      aria-labelledby="context-aware-title"
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
            aria-label="Exit context-aware dashboard"
            className="flex-shrink-0"
          >
            <X className="w-6 h-6" />
          </Button>
          <div className="flex-1 min-w-0">
            <h1 
              id="context-aware-title" 
              className="text-xl sm:text-2xl font-bold truncate"
              style={{ fontFamily: 'Poppins, sans-serif' }}
            >
              Context-Aware Learning
            </h1>
            <p className="text-sm truncate" style={{ color: colors.textSecondary }}>
              Personalized lessons based on your location and time
            </p>
          </div>
          <button
            onClick={handleRefreshContext}
            className="p-2 rounded-lg flex-shrink-0"
            style={{ background: colors.iconBg }}
            aria-label="Refresh context"
          >
            <RefreshCw className="w-5 h-5" style={{ color: colors.iconColor }} />
          </button>
        </div>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6">
        
        {/* Current Context Display */}
        <section aria-labelledby="current-context-heading" className="mb-6">
          <h2 id="current-context-heading" className="text-lg font-semibold mb-4" style={{ color: colors.textPrimary }}>
            Current Context
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
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {/* Location */}
              <div className="flex items-center gap-3">
                <div 
                  className="w-12 h-12 rounded-xl flex items-center justify-center"
                  style={{ background: colors.iconBg }}
                  aria-hidden="true"
                >
                  <MapPin className="w-6 h-6" style={{ color: colors.iconColor }} />
                </div>
                <div>
                  <div className="text-xs font-semibold uppercase tracking-wide mb-1" style={{ color: colors.textTertiary }}>
                    Location
                  </div>
                  <div className="font-semibold" style={{ color: colors.textPrimary }}>
                    {currentLocation}
                  </div>
                </div>
              </div>

              {/* Time of Day */}
              <div className="flex items-center gap-3">
                <div 
                  className="w-12 h-12 rounded-xl flex items-center justify-center"
                  style={{ background: colors.warningBg }}
                  aria-hidden="true"
                >
                  {getTimeIcon()}
                </div>
                <div>
                  <div className="text-xs font-semibold uppercase tracking-wide mb-1" style={{ color: colors.textTertiary }}>
                    Time of Day
                  </div>
                  <div className="font-semibold" style={{ color: colors.textPrimary }}>
                    {getTimeLabel()}
                  </div>
                </div>
              </div>

              {/* Weather/Mood */}
              <div className="flex items-center gap-3">
                <div 
                  className="w-12 h-12 rounded-xl flex items-center justify-center"
                  style={{ background: colors.successBg }}
                  aria-hidden="true"
                >
                  <Activity className="w-6 h-6" style={{ color: colors.successColor }} />
                </div>
                <div>
                  <div className="text-xs font-semibold uppercase tracking-wide mb-1" style={{ color: colors.textTertiary }}>
                    Activity Level
                  </div>
                  <div className="font-semibold" style={{ color: colors.textPrimary }}>
                    Relaxed
                  </div>
                </div>
              </div>
            </div>

            {/* Context Insights */}
            <div 
              className="mt-4 pt-4 border-t flex items-start gap-3"
              style={{ borderTopColor: colors.border }}
            >
              <Zap className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: colors.iconColor }} aria-hidden="true" />
              <div>
                <div className="font-semibold text-sm mb-1" style={{ color: colors.textPrimary }}>
                  Perfect time for practice!
                </div>
                <div className="text-xs leading-relaxed" style={{ color: colors.textSecondary }}>
                  You're at home in the {timeOfDay}. We've prepared {suggestedLessons.length} contextual lessons 
                  that match your current situation and learning pattern.
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Suggested Contextual Lessons */}
        <section aria-labelledby="suggested-lessons-heading" className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 id="suggested-lessons-heading" className="text-lg font-semibold" style={{ color: colors.textPrimary }}>
              Suggested for You Now
            </h2>
            <span className="text-xs px-3 py-1 rounded-full" style={{ background: colors.successBg, color: colors.successColor }}>
              Live Updates
            </span>
          </div>

          <div className="space-y-3">
            {suggestedLessons.map((lesson, index) => {
              const Icon = lesson.icon;
              return (
                <div
                  key={lesson.id}
                  className="rounded-xl p-4"
                  style={{
                    background: colors.cardBg,
                    backdropFilter: colors.blur,
                    WebkitBackdropFilter: colors.blur,
                    border: colors.glassBorder,
                    boxShadow: colors.shadow,
                  }}
                >
                  <div className="flex items-start gap-4">
                    <div 
                      className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                      style={{ background: colors.iconBg }}
                      aria-hidden="true"
                    >
                      <Icon className="w-6 h-6" style={{ color: colors.iconColor }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-semibold truncate" style={{ color: colors.textPrimary }}>
                          {lesson.title}
                        </h3>
                        {lesson.isPremium && (
                          <Crown className="w-4 h-4 flex-shrink-0" style={{ color: colors.warningColor }} aria-label="Premium" />
                        )}
                        <span 
                          className="ml-auto text-xs font-semibold px-2 py-1 rounded-full flex-shrink-0"
                          style={{ 
                            background: colors.successBg,
                            color: colors.successColor,
                          }}
                        >
                          {lesson.relevanceScore}% Match
                        </span>
                      </div>
                      <p className="text-sm mb-2" style={{ color: colors.textSecondary }}>
                        {lesson.description}
                      </p>
                      <div 
                        className="flex items-center gap-2 text-xs p-2 rounded-lg mb-3"
                        style={{ background: colors.iconBg }}
                      >
                        <Target className="w-4 h-4" style={{ color: colors.iconColor }} aria-hidden="true" />
                        <span style={{ color: colors.textSecondary }}>{lesson.context}</span>
                      </div>
                      <div className="flex items-center gap-4 mb-3 text-xs" style={{ color: colors.textTertiary }}>
                        <span>{lesson.duration}</span>
                        <span>•</span>
                        <span className="capitalize">{lesson.difficulty}</span>
                        <span>•</span>
                        <span>{lesson.signs} signs</span>
                      </div>
                      <Button
                        onClick={() => handleStartLesson(lesson.id, lesson.isPremium)}
                        className="w-full h-10 rounded-lg font-semibold"
                        style={{ 
                          background: colors.iconColor,
                          color: theme === 'dark' ? 'var(--color-bg-deep)' : '#FFFFFF',
                        }}
                        aria-label={`Start ${lesson.title} lesson`}
                      >
                        <Play className="w-4 h-4 mr-2" />
                        Start Learning
                      </Button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Location-Based Content */}
        <section aria-labelledby="location-content-heading" className="mb-6">
          <h2 id="location-content-heading" className="text-lg font-semibold mb-4" style={{ color: colors.textPrimary }}>
            Lessons by Location
          </h2>

          <div className="grid grid-cols-2 gap-3 mb-4">
            {locationContexts.map((location) => {
              const Icon = location.icon;
              return (
                <button
                  key={location.id}
                  onClick={() => setCurrentLocation(location.name)}
                  className="rounded-xl p-4 text-left transition-all"
                  style={{
                    background: location.isActive ? colors.iconBg : colors.cardBg,
                    backdropFilter: colors.blur,
                    WebkitBackdropFilter: colors.blur,
                    border: location.isActive ? `2px solid ${colors.iconColor}` : colors.glassBorder,
                    boxShadow: colors.shadow,
                  }}
                  onMouseEnter={(e) => {
                    if (!location.isActive) {
                      e.currentTarget.style.background = colors.cardHover;
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!location.isActive) {
                      e.currentTarget.style.background = colors.cardBg;
                    }
                  }}
                  aria-label={`${location.name}. ${location.lessons.length} lessons available. ${location.isActive ? 'Currently selected' : ''}`}
                  aria-pressed={location.isActive}
                >
                  <div 
                    className="w-10 h-10 rounded-lg flex items-center justify-center mb-3"
                    style={{ background: location.isActive ? colors.iconColor : colors.iconBg }}
                    aria-hidden="true"
                  >
                    <Icon 
                      className="w-5 h-5" 
                      style={{ color: location.isActive ? (theme === 'dark' ? 'var(--color-bg-deep)' : '#FFFFFF') : colors.iconColor }} 
                    />
                  </div>
                  <div className="font-semibold mb-1" style={{ color: colors.textPrimary }}>
                    {location.name}
                  </div>
                  <div className="text-xs" style={{ color: colors.textSecondary }}>
                    {location.lessons.length} lessons
                  </div>
                </button>
              );
            })}
          </div>

          {/* Show lessons for active location */}
          {locationContexts.find(loc => loc.isActive)?.lessons.map((lesson) => {
            const Icon = lesson.icon;
            return (
              <div
                key={lesson.id}
                className="rounded-xl p-4 mb-3"
                style={{
                  background: colors.cardBg,
                  backdropFilter: colors.blur,
                  WebkitBackdropFilter: colors.blur,
                  border: colors.glassBorder,
                  boxShadow: colors.shadow,
                }}
              >
                <div className="flex items-center gap-3 mb-3">
                  <div 
                    className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                    style={{ background: colors.iconBg }}
                    aria-hidden="true"
                  >
                    <Icon className="w-5 h-5" style={{ color: colors.iconColor }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <div className="font-semibold truncate" style={{ color: colors.textPrimary }}>
                        {lesson.title}
                      </div>
                      {lesson.isPremium && (
                        <Crown className="w-4 h-4 flex-shrink-0" style={{ color: colors.warningColor }} aria-label="Premium" />
                      )}
                    </div>
                    <div className="text-xs" style={{ color: colors.textSecondary }}>
                      {lesson.description}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3 text-xs mb-3" style={{ color: colors.textTertiary }}>
                  <span>{lesson.duration}</span>
                  <span>•</span>
                  <span className="capitalize">{lesson.difficulty}</span>
                  <span>•</span>
                  <span>{lesson.signs} signs</span>
                </div>
                <Button
                  onClick={() => handleStartLesson(lesson.id, lesson.isPremium)}
                  className="w-full h-9 rounded-lg font-semibold text-sm"
                  style={{ 
                    background: colors.cardHover,
                    color: colors.textPrimary,
                    border: `1px solid ${colors.border}`,
                  }}
                  aria-label={`Start ${lesson.title}`}
                >
                  <Play className="w-4 h-4 mr-2" />
                  Start Lesson
                </Button>
              </div>
            );
          })}
        </section>

        {/* Time-Based Recommendations */}
        <section aria-labelledby="time-recommendations-heading" className="mb-6">
          <div className="flex items-center gap-2 mb-4">
            {getTimeIcon()}
            <h2 id="time-recommendations-heading" className="text-lg font-semibold" style={{ color: colors.textPrimary }}>
              Perfect for {getTimeLabel()}
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-3">
            {currentTimeRecommendations.map((rec) => (
              <div
                key={rec.id}
                className="rounded-xl p-4"
                style={{
                  background: colors.cardBg,
                  backdropFilter: colors.blur,
                  WebkitBackdropFilter: colors.blur,
                  border: colors.glassBorder,
                  boxShadow: colors.shadow,
                }}
              >
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold truncate" style={{ color: colors.textPrimary }}>
                        {rec.title}
                      </h3>
                      {rec.isPremium && (
                        <Crown className="w-4 h-4 flex-shrink-0" style={{ color: colors.warningColor }} aria-label="Premium" />
                      )}
                    </div>
                    <p className="text-sm" style={{ color: colors.textSecondary }}>
                      {rec.description}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3 text-xs mb-3" style={{ color: colors.textTertiary }}>
                  <span>{rec.duration}</span>
                  <span>•</span>
                  <span className="capitalize">{rec.difficulty}</span>
                </div>
                <Button
                  onClick={() => handleStartLesson(rec.id, rec.isPremium)}
                  className="w-full h-9 rounded-lg font-semibold text-sm"
                  style={{ 
                    background: colors.cardHover,
                    color: colors.textPrimary,
                    border: `1px solid ${colors.border}`,
                  }}
                  aria-label={`Start ${rec.title}`}
                >
                  <Play className="w-4 h-4 mr-2" />
                  Start Now
                </Button>
              </div>
            ))}
          </div>
        </section>

        {/* Nearby Activities */}
        <section aria-labelledby="nearby-activities-heading" className="mb-6">
          <h2 id="nearby-activities-heading" className="text-lg font-semibold mb-4" style={{ color: colors.textPrimary }}>
            Nearby ASL Events
          </h2>

          <div className="space-y-3">
            {nearbyActivities.map((activity) => (
              <div
                key={activity.id}
                className="rounded-xl p-4"
                style={{
                  background: colors.cardBg,
                  backdropFilter: colors.blur,
                  WebkitBackdropFilter: colors.blur,
                  border: colors.glassBorder,
                  boxShadow: colors.shadow,
                }}
              >
                <div className="flex items-start gap-3">
                  <div 
                    className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                    style={{ background: colors.accentBg }}
                    aria-hidden="true"
                  >
                    <MapPin className="w-5 h-5" style={{ color: colors.accentColor }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold mb-1" style={{ color: colors.textPrimary }}>
                      {activity.title}
                    </h3>
                    <div className="text-xs space-y-1" style={{ color: colors.textSecondary }}>
                      <div className="flex items-center gap-2">
                        <MapPin className="w-3 h-3" aria-hidden="true" />
                        <span>{activity.location}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="w-3 h-3" aria-hidden="true" />
                        <span>{activity.time}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span>{activity.attendees} attending</span>
                      </div>
                    </div>
                  </div>
                  <button
                    className="px-3 py-2 rounded-lg text-xs font-semibold flex-shrink-0"
                    style={{ 
                      background: colors.accentBg,
                      color: colors.accentColor,
                    }}
                    aria-label={`Join ${activity.title}`}
                  >
                    Join
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Recent Learning Activities */}
        <section aria-labelledby="recent-activities-heading" className="mb-6">
          <h2 id="recent-activities-heading" className="text-lg font-semibold mb-4" style={{ color: colors.textPrimary }}>
            Recent Learning Activities
          </h2>

          <div className="space-y-2">
            {recentActivities.map((activity) => (
              <div
                key={activity.id}
                className="rounded-lg p-3 flex items-center gap-3"
                style={{
                  background: colors.cardBg,
                  backdropFilter: colors.blur,
                  WebkitBackdropFilter: colors.blur,
                  border: colors.glassBorder,
                }}
              >
                <CheckCircle2 
                  className="w-5 h-5 flex-shrink-0" 
                  style={{ color: activity.progress === 100 ? colors.successColor : colors.iconColor }} 
                  aria-hidden="true"
                />
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-sm truncate" style={{ color: colors.textPrimary }}>
                    {activity.lesson}
                  </div>
                  <div className="text-xs" style={{ color: colors.textSecondary }}>
                    {activity.location} • {activity.time}
                  </div>
                </div>
                <div className="text-sm font-semibold flex-shrink-0" style={{ color: colors.iconColor }}>
                  {activity.progress}%
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Recent Contexts */}
        <section aria-labelledby="recent-contexts-heading" className="mb-6">
          <h2 id="recent-contexts-heading" className="text-lg font-semibold mb-4" style={{ color: colors.textPrimary }}>
            Recent Contexts
          </h2>

          <div className="space-y-2">
            {recentContexts.map((ctx) => (
              <div
                key={ctx.id}
                className="rounded-lg p-3"
                style={{
                  background: colors.cardBg,
                  backdropFilter: colors.blur,
                  WebkitBackdropFilter: colors.blur,
                  border: colors.glassBorder,
                }}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="font-semibold text-sm" style={{ color: colors.textPrimary }}>
                    {ctx.location}
                  </div>
                  <div className="text-xs" style={{ color: colors.textTertiary }}>
                    {ctx.timestamp}
                  </div>
                </div>
                <div className="text-xs" style={{ color: colors.textSecondary }}>
                  {ctx.time} • {ctx.lessonsCompleted} lesson{ctx.lessonsCompleted !== 1 ? 's' : ''} completed
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Learning Settings */}
        <section aria-labelledby="learning-settings-heading" className="mb-6">
          <h2 id="learning-settings-heading" className="text-lg font-semibold mb-4" style={{ color: colors.textPrimary }}>
            Context Settings
          </h2>

          <div 
            className="rounded-xl p-4 space-y-4"
            style={{
              background: colors.cardBg,
              backdropFilter: colors.blur,
              WebkitBackdropFilter: colors.blur,
              border: colors.glassBorder,
              boxShadow: colors.shadow,
            }}
          >
            {/* Auto-Detect Location */}
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="font-semibold text-sm mb-1" style={{ color: colors.textPrimary }}>
                  Auto-Detect Location
                </div>
                <div className="text-xs" style={{ color: colors.textSecondary }}>
                  Automatically detect your location for context
                </div>
              </div>
              <button
                onClick={() => setAutoDetectLocation(!autoDetectLocation)}
                className="relative w-12 h-6 rounded-full transition-colors ml-3 flex-shrink-0"
                style={{ 
                  background: autoDetectLocation ? colors.iconColor : colors.border,
                }}
                role="switch"
                aria-checked={autoDetectLocation}
                aria-label="Toggle auto-detect location"
              >
                <div 
                  className="absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white transition-transform"
                  style={{
                    transform: autoDetectLocation ? 'translateX(24px)' : 'translateX(0)',
                  }}
                />
              </button>
            </div>

            {/* Time-Based Suggestions */}
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="font-semibold text-sm mb-1" style={{ color: colors.textPrimary }}>
                  Time-Based Suggestions
                </div>
                <div className="text-xs" style={{ color: colors.textSecondary }}>
                  Get lessons based on time of day
                </div>
              </div>
              <button
                onClick={() => setUseTimeBasedSuggestions(!useTimeBasedSuggestions)}
                className="relative w-12 h-6 rounded-full transition-colors ml-3 flex-shrink-0"
                style={{ 
                  background: useTimeBasedSuggestions ? colors.iconColor : colors.border,
                }}
                role="switch"
                aria-checked={useTimeBasedSuggestions}
                aria-label="Toggle time-based suggestions"
              >
                <div 
                  className="absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white transition-transform"
                  style={{
                    transform: useTimeBasedSuggestions ? 'translateX(24px)' : 'translateX(0)',
                  }}
                />
              </button>
            </div>

            {/* Contextual Notifications */}
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="font-semibold text-sm mb-1" style={{ color: colors.textPrimary }}>
                  Contextual Notifications
                </div>
                <div className="text-xs" style={{ color: colors.textSecondary }}>
                  Notify when relevant lessons are available
                </div>
              </div>
              <button
                onClick={() => setEnableContextualNotifications(!enableContextualNotifications)}
                className="relative w-12 h-6 rounded-full transition-colors ml-3 flex-shrink-0"
                style={{ 
                  background: enableContextualNotifications ? colors.iconColor : colors.border,
                }}
                role="switch"
                aria-checked={enableContextualNotifications}
                aria-label="Toggle contextual notifications"
              >
                <div 
                  className="absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white transition-transform"
                  style={{
                    transform: enableContextualNotifications ? 'translateX(24px)' : 'translateX(0)',
                  }}
                />
              </button>
            </div>

            {/* Privacy Mode */}
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="font-semibold text-sm mb-1" style={{ color: colors.textPrimary }}>
                  Privacy Mode
                </div>
                <div className="text-xs" style={{ color: colors.textSecondary }}>
                  Limit location and activity tracking
                </div>
              </div>
              <button
                onClick={() => setPrivacyMode(!privacyMode)}
                className="relative w-12 h-6 rounded-full transition-colors ml-3 flex-shrink-0"
                style={{ 
                  background: privacyMode ? colors.iconColor : colors.border,
                }}
                role="switch"
                aria-checked={privacyMode}
                aria-label="Toggle privacy mode"
              >
                <div 
                  className="absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white transition-transform"
                  style={{
                    transform: privacyMode ? 'translateX(24px)' : 'translateX(0)',
                  }}
                />
              </button>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
