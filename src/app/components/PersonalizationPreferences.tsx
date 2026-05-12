import { useState } from 'react';
import { Button } from './ui/button';
import { useTheme } from '../context/ThemeContext';
import { useApp } from '../context/AppContext';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, 
  Target, 
  Clock, 
  Bell, 
  TrendingUp, 
  Gamepad2, 
  BookOpen, 
  ChevronRight,
  Check,
  Info,
  Calendar,
  Zap,
  GraduationCap,
  Briefcase,
  Heart,
  Users,
  Globe,
  Brain,
  Star,
  Trophy,
  Sunrise,
  Sun,
  Sunset,
  Moon as MoonIcon,
  AlertCircle,
} from 'lucide-react';

interface PersonalizationPreferencesProps {
  onExit: () => void;
  onSave?: (preferences: UserPreferences) => void;
}

interface UserPreferences {
  learningGoal: string;
  targetFluency: string;
  dailyPracticeTime: number;
  reminderEnabled: boolean;
  reminderTimes: string[];
  difficultyPreference: 'beginner' | 'intermediate' | 'advanced' | 'adaptive';
  contentPreference: 'games' | 'structured' | 'balanced';
  practiceStyle: string[];
  focusAreas: string[];
}

const learningGoals = [
  {
    id: 'career',
    title: 'Career Development',
    subtitle: 'Professional communication',
    icon: Briefcase,
    description: 'Learn ASL for workplace communication and career advancement',
  },
  {
    id: 'personal',
    title: 'Personal Interest',
    subtitle: 'Hobby and self-improvement',
    icon: Heart,
    description: 'Explore sign language as a personal interest and learning journey',
  },
  {
    id: 'family',
    title: 'Family & Friends',
    subtitle: 'Communicate with loved ones',
    icon: Users,
    description: 'Connect with Deaf family members or friends through sign language',
  },
  {
    id: 'education',
    title: 'Academic/Education',
    subtitle: 'School or research purposes',
    icon: GraduationCap,
    description: 'Study sign language for academic requirements or research',
  },
  {
    id: 'community',
    title: 'Community Involvement',
    subtitle: 'Volunteer and outreach',
    icon: Globe,
    description: 'Engage with the Deaf community through volunteer work or events',
  },
  {
    id: 'cultural',
    title: 'Cultural Appreciation',
    subtitle: 'Learn about Deaf culture',
    icon: Star,
    description: 'Understand and appreciate Deaf culture and visual languages',
  },
];

const fluencyLevels = [
  {
    id: 'basic',
    title: 'Basic Conversational',
    subtitle: '3-6 months',
    description: 'Everyday greetings, common phrases, and simple conversations',
    level: 'A1-A2',
  },
  {
    id: 'intermediate',
    title: 'Intermediate Fluency',
    subtitle: '6-12 months',
    description: 'Complex conversations, storytelling, and nuanced expressions',
    level: 'B1-B2',
  },
  {
    id: 'advanced',
    title: 'Advanced Proficiency',
    subtitle: '12-24 months',
    description: 'Professional-level communication and cultural fluency',
    level: 'C1-C2',
  },
  {
    id: 'native',
    title: 'Native-Like Mastery',
    subtitle: '24+ months',
    description: 'Complete fluency with cultural nuances and regional variations',
    level: 'C2+',
  },
];

const practiceTimeOptions = [
  { value: 5, label: '5 min/day', subtitle: 'Quick daily practice', icon: Zap },
  { value: 10, label: '10 min/day', subtitle: 'Light commitment', icon: Clock },
  { value: 15, label: '15 min/day', subtitle: 'Recommended', icon: Target },
  { value: 30, label: '30 min/day', subtitle: 'Serious learner', icon: TrendingUp },
  { value: 60, label: '60 min/day', subtitle: 'Deep immersion', icon: Brain },
];

const reminderTimeSlots = [
  { id: 'morning', label: 'Morning', time: '8:00 AM', icon: Sunrise, description: 'Start your day with practice' },
  { id: 'midday', label: 'Midday', time: '12:00 PM', icon: Sun, description: 'Lunchtime learning' },
  { id: 'afternoon', label: 'Afternoon', time: '4:00 PM', icon: Sunset, description: 'After work/school' },
  { id: 'evening', label: 'Evening', time: '8:00 PM', icon: MoonIcon, description: 'Evening wind-down' },
];

const practiceStyles = [
  { id: 'ar-practice', label: 'AR Hand Tracking', icon: Target },
  { id: 'video-lessons', label: 'Video Lessons', icon: BookOpen },
  { id: 'games', label: 'Interactive Games', icon: Gamepad2 },
  { id: 'flashcards', label: 'Flashcards', icon: Brain },
  { id: 'stories', label: 'Story Mode', icon: Star },
  { id: 'social', label: 'Social Practice', icon: Users },
];

const focusAreas = [
  { id: 'vocabulary', label: 'Vocabulary Building' },
  { id: 'grammar', label: 'Grammar & Structure' },
  { id: 'fingerspelling', label: 'Fingerspelling' },
  { id: 'conversation', label: 'Conversation Skills' },
  { id: 'comprehension', label: 'Sign Comprehension' },
  { id: 'cultural', label: 'Cultural Understanding' },
];

export function PersonalizationPreferences({ onExit, onSave }: PersonalizationPreferencesProps) {
  const { theme } = useTheme();
  const { userProgress } = useApp();

  // Initialize with default preferences
  const [preferences, setPreferences] = useState<UserPreferences>({
    learningGoal: 'personal',
    targetFluency: 'intermediate',
    dailyPracticeTime: 15,
    reminderEnabled: true,
    reminderTimes: ['morning', 'evening'],
    difficultyPreference: 'adaptive',
    contentPreference: 'balanced',
    practiceStyle: ['ar-practice', 'video-lessons', 'games'],
    focusAreas: ['vocabulary', 'conversation'],
  });

  const [activeSection, setActiveSection] = useState<string | null>(null);
  const [showSaveConfirmation, setShowSaveConfirmation] = useState(false);

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
        blur: 'blur(20px)',
        shadow: '0 8px 32px rgba(31, 38, 135, 0.15)',
        glassBorder: '1px solid rgba(255, 255, 255, 0.6)',
      };

  const handleSave = () => {
    if (onSave) {
      onSave(preferences);
    }
    setShowSaveConfirmation(true);
    setTimeout(() => {
      setShowSaveConfirmation(false);
      onExit();
    }, 1500);
  };

  const toggleReminderTime = (timeId: string) => {
    if (preferences.reminderTimes.includes(timeId)) {
      setPreferences({
        ...preferences,
        reminderTimes: preferences.reminderTimes.filter(t => t !== timeId),
      });
    } else {
      setPreferences({
        ...preferences,
        reminderTimes: [...preferences.reminderTimes, timeId],
      });
    }
  };

  const togglePracticeStyle = (styleId: string) => {
    if (preferences.practiceStyle.includes(styleId)) {
      setPreferences({
        ...preferences,
        practiceStyle: preferences.practiceStyle.filter(s => s !== styleId),
      });
    } else {
      setPreferences({
        ...preferences,
        practiceStyle: [...preferences.practiceStyle, styleId],
      });
    }
  };

  const toggleFocusArea = (areaId: string) => {
    if (preferences.focusAreas.includes(areaId)) {
      setPreferences({
        ...preferences,
        focusAreas: preferences.focusAreas.filter(a => a !== areaId),
      });
    } else {
      setPreferences({
        ...preferences,
        focusAreas: [...preferences.focusAreas, areaId],
      });
    }
  };

  return (
    <div 
      className="h-full flex flex-col"
      style={{ background: colors.bg, color: colors.textPrimary }}
      role="main"
      aria-labelledby="preferences-title"
    >
      {/* Header */}
      <div 
        className="p-4 sm:p-6 border-b"
        style={{ borderBottomColor: colors.border }}
      >
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={onExit}
            style={{ color: colors.textSecondary }}
            aria-label="Close preferences"
          >
            <X className="w-6 h-6" />
          </Button>
          <div className="flex-1 min-w-0">
            <h1 
              id="preferences-title" 
              className="text-xl sm:text-2xl font-bold"
              style={{ fontFamily: 'Poppins, sans-serif' }}
            >
              Personalization
            </h1>
            <p className="text-sm" style={{ color: colors.textSecondary }}>
              Customize your learning experience
            </p>
          </div>
        </div>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6">
        {/* Learning Goals Section */}
        <section aria-labelledby="learning-goals-heading" className="mb-6">
          <div className="flex items-center gap-2 mb-4">
            <Target className="w-5 h-5" style={{ color: colors.iconColor }} aria-hidden="true" />
            <h2 id="learning-goals-heading" className="text-lg font-semibold" style={{ color: colors.textPrimary }}>
              Learning Goals
            </h2>
          </div>

          <div className="mb-4">
            <label className="text-sm font-semibold mb-3 block" style={{ color: colors.textPrimary }}>
              Why are you learning sign language?
            </label>
            <div className="space-y-2">
              {learningGoals.map((goal) => {
                const Icon = goal.icon;
                const isSelected = preferences.learningGoal === goal.id;
                
                return (
                  <button
                    key={goal.id}
                    onClick={() => setPreferences({ ...preferences, learningGoal: goal.id })}
                    className="w-full rounded-xl p-4 text-left transition-all"
                    style={{
                      background: isSelected ? colors.cardHover : colors.cardBg,
                      backdropFilter: colors.blur,
                      WebkitBackdropFilter: colors.blur,
                      border: isSelected ? `2px solid ${colors.iconColor}` : colors.glassBorder,
                      boxShadow: colors.shadow,
                    }}
                    onMouseEnter={(e) => {
                      if (!isSelected) e.currentTarget.style.background = colors.cardHover;
                    }}
                    onMouseLeave={(e) => {
                      if (!isSelected) e.currentTarget.style.background = colors.cardBg;
                    }}
                    role="radio"
                    aria-checked={isSelected}
                    aria-labelledby={`goal-${goal.id}-title`}
                    aria-describedby={`goal-${goal.id}-desc`}
                  >
                    <div className="flex items-start gap-3">
                      <div 
                        className="w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0"
                        style={{ background: colors.iconBg }}
                        aria-hidden="true"
                      >
                        <Icon className="w-6 h-6" style={{ color: colors.iconColor }} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-semibold mb-1" id={`goal-${goal.id}-title`} style={{ color: colors.textPrimary }}>
                          {goal.title}
                        </div>
                        <div className="text-sm mb-2" style={{ color: colors.textSecondary }}>
                          {goal.subtitle}
                        </div>
                        <p className="text-xs" id={`goal-${goal.id}-desc`} style={{ color: colors.textTertiary }}>
                          {goal.description}
                        </p>
                      </div>
                      <div className="flex-shrink-0">
                        {isSelected ? (
                          <div 
                            className="w-6 h-6 rounded-full flex items-center justify-center"
                            style={{ background: colors.iconColor }}
                            aria-hidden="true"
                          >
                            <Check className="w-4 h-4 text-white" />
                          </div>
                        ) : (
                          <div 
                            className="w-6 h-6 rounded-full border-2"
                            style={{ borderColor: colors.border }}
                            aria-hidden="true"
                          />
                        )}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Target Fluency */}
          <div className="mb-4">
            <label className="text-sm font-semibold mb-3 block" style={{ color: colors.textPrimary }}>
              Target Fluency Level
            </label>
            <div className="space-y-2">
              {fluencyLevels.map((level) => {
                const isSelected = preferences.targetFluency === level.id;
                
                return (
                  <button
                    key={level.id}
                    onClick={() => setPreferences({ ...preferences, targetFluency: level.id })}
                    className="w-full rounded-xl p-4 text-left transition-all"
                    style={{
                      background: isSelected ? colors.cardHover : colors.cardBg,
                      backdropFilter: colors.blur,
                      WebkitBackdropFilter: colors.blur,
                      border: isSelected ? `2px solid ${colors.iconColor}` : colors.glassBorder,
                      boxShadow: colors.shadow,
                    }}
                    onMouseEnter={(e) => {
                      if (!isSelected) e.currentTarget.style.background = colors.cardHover;
                    }}
                    onMouseLeave={(e) => {
                      if (!isSelected) e.currentTarget.style.background = colors.cardBg;
                    }}
                    role="radio"
                    aria-checked={isSelected}
                    aria-labelledby={`fluency-${level.id}-title`}
                    aria-describedby={`fluency-${level.id}-desc`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-semibold" id={`fluency-${level.id}-title`} style={{ color: colors.textPrimary }}>
                            {level.title}
                          </span>
                          <span 
                            className="px-2 py-0.5 rounded-full text-xs font-semibold"
                            style={{ background: colors.accentBg, color: colors.accentColor }}
                          >
                            {level.level}
                          </span>
                        </div>
                        <div className="text-sm mb-1" style={{ color: colors.textSecondary }}>
                          Timeline: {level.subtitle}
                        </div>
                        <p className="text-xs" id={`fluency-${level.id}-desc`} style={{ color: colors.textTertiary }}>
                          {level.description}
                        </p>
                      </div>
                      <div className="flex-shrink-0 ml-3">
                        {isSelected ? (
                          <div 
                            className="w-6 h-6 rounded-full flex items-center justify-center"
                            style={{ background: colors.iconColor }}
                            aria-hidden="true"
                          >
                            <Check className="w-4 h-4 text-white" />
                          </div>
                        ) : (
                          <div 
                            className="w-6 h-6 rounded-full border-2"
                            style={{ borderColor: colors.border }}
                            aria-hidden="true"
                          />
                        )}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </section>

        {/* Daily Practice Time Section */}
        <section aria-labelledby="practice-time-heading" className="mb-6">
          <div className="flex items-center gap-2 mb-4">
            <Clock className="w-5 h-5" style={{ color: colors.iconColor }} aria-hidden="true" />
            <h2 id="practice-time-heading" className="text-lg font-semibold" style={{ color: colors.textPrimary }}>
              Daily Practice Commitment
            </h2>
          </div>

          <div 
            className="rounded-xl p-4 mb-4"
            style={{
              background: colors.iconBg,
              border: colors.glassBorder,
            }}
          >
            <div className="flex items-start gap-3">
              <Info className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: colors.iconColor }} aria-hidden="true" />
              <div>
                <div className="font-semibold mb-1 text-sm" style={{ color: colors.textPrimary }}>
                  Consistency is Key
                </div>
                <div className="text-xs" style={{ color: colors.textSecondary }}>
                  Regular daily practice, even for just 5 minutes, is more effective than occasional long sessions.
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-3" role="radiogroup" aria-label="Daily practice time">
            {practiceTimeOptions.map((option) => {
              const Icon = option.icon;
              const isSelected = preferences.dailyPracticeTime === option.value;
              
              return (
                <button
                  key={option.value}
                  onClick={() => setPreferences({ ...preferences, dailyPracticeTime: option.value })}
                  className="rounded-xl p-4 text-left transition-all"
                  style={{
                    background: isSelected ? colors.cardHover : colors.cardBg,
                    backdropFilter: colors.blur,
                    WebkitBackdropFilter: colors.blur,
                    border: isSelected ? `2px solid ${colors.iconColor}` : colors.glassBorder,
                    boxShadow: colors.shadow,
                  }}
                  onMouseEnter={(e) => {
                    if (!isSelected) e.currentTarget.style.background = colors.cardHover;
                  }}
                  onMouseLeave={(e) => {
                    if (!isSelected) e.currentTarget.style.background = colors.cardBg;
                  }}
                  role="radio"
                  aria-checked={isSelected}
                  aria-label={`${option.label}, ${option.subtitle}`}
                >
                  <div className="flex items-center gap-3">
                    <div 
                      className="w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0"
                      style={{ background: isSelected ? colors.iconBg : colors.cardHover }}
                      aria-hidden="true"
                    >
                      <Icon className="w-6 h-6" style={{ color: colors.iconColor }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold mb-1" style={{ color: colors.textPrimary }}>
                        {option.label}
                      </div>
                      <div className="text-sm" style={{ color: colors.textSecondary }}>
                        {option.subtitle}
                      </div>
                    </div>
                    {isSelected && (
                      <Check className="w-5 h-5 flex-shrink-0" style={{ color: colors.iconColor }} aria-hidden="true" />
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </section>

        {/* Reminder Scheduling Section */}
        <section aria-labelledby="reminders-heading" className="mb-6">
          <div className="flex items-center gap-2 mb-4">
            <Bell className="w-5 h-5" style={{ color: colors.iconColor }} aria-hidden="true" />
            <h2 id="reminders-heading" className="text-lg font-semibold" style={{ color: colors.textPrimary }}>
              Practice Reminders
            </h2>
          </div>

          {/* Enable/Disable Toggle */}
          <div 
            className="rounded-xl p-4 mb-4 flex items-center justify-between"
            style={{
              background: colors.cardBg,
              backdropFilter: colors.blur,
              WebkitBackdropFilter: colors.blur,
              border: colors.glassBorder,
              boxShadow: colors.shadow,
            }}
          >
            <div className="flex items-center gap-3">
              <div 
                className="w-12 h-12 rounded-lg flex items-center justify-center"
                style={{ background: colors.iconBg }}
                aria-hidden="true"
              >
                <Bell className="w-6 h-6" style={{ color: colors.iconColor }} />
              </div>
              <div>
                <div className="font-semibold" style={{ color: colors.textPrimary }}>
                  Daily Reminders
                </div>
                <div className="text-sm" style={{ color: colors.textSecondary }}>
                  {preferences.reminderEnabled ? 'Enabled' : 'Disabled'}
                </div>
              </div>
            </div>
            <button
              onClick={() => setPreferences({ ...preferences, reminderEnabled: !preferences.reminderEnabled })}
              className="relative w-12 h-6 rounded-full transition-colors"
              style={{ 
                background: preferences.reminderEnabled ? colors.iconColor : colors.border,
              }}
              role="switch"
              aria-checked={preferences.reminderEnabled}
              aria-label="Toggle daily reminders"
            >
              <div 
                className="absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white transition-transform"
                style={{
                  transform: preferences.reminderEnabled ? 'translateX(24px)' : 'translateX(0)',
                }}
              />
            </button>
          </div>

          {/* Reminder Times */}
          {preferences.reminderEnabled && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
            >
              <label className="text-sm font-semibold mb-3 block" style={{ color: colors.textPrimary }}>
                When would you like to practice?
              </label>
              <div className="grid grid-cols-2 gap-3">
                {reminderTimeSlots.map((slot) => {
                  const Icon = slot.icon;
                  const isSelected = preferences.reminderTimes.includes(slot.id);
                  
                  return (
                    <button
                      key={slot.id}
                      onClick={() => toggleReminderTime(slot.id)}
                      className="rounded-xl p-4 text-center transition-all"
                      style={{
                        background: isSelected ? colors.iconBg : colors.cardBg,
                        backdropFilter: colors.blur,
                        WebkitBackdropFilter: colors.blur,
                        border: isSelected ? `2px solid ${colors.iconColor}` : colors.glassBorder,
                        boxShadow: colors.shadow,
                      }}
                      onMouseEnter={(e) => {
                        if (!isSelected) e.currentTarget.style.background = colors.cardHover;
                      }}
                      onMouseLeave={(e) => {
                        if (!isSelected) e.currentTarget.style.background = colors.cardBg;
                      }}
                      role="checkbox"
                      aria-checked={isSelected}
                      aria-label={`${slot.label} at ${slot.time}, ${slot.description}`}
                    >
                      <div 
                        className="w-12 h-12 rounded-lg flex items-center justify-center mx-auto mb-2"
                        style={{ background: isSelected ? colors.iconColor : colors.cardHover }}
                        aria-hidden="true"
                      >
                        <Icon className="w-6 h-6" style={{ color: isSelected ? 'white' : colors.iconColor }} />
                      </div>
                      <div className="font-semibold text-sm mb-1" style={{ color: colors.textPrimary }}>
                        {slot.label}
                      </div>
                      <div className="text-xs mb-1" style={{ color: colors.textSecondary }}>
                        {slot.time}
                      </div>
                      <div className="text-xs" style={{ color: colors.textTertiary }}>
                        {slot.description}
                      </div>
                      {isSelected && (
                        <div className="mt-2">
                          <Check className="w-4 h-4 mx-auto" style={{ color: colors.iconColor }} aria-hidden="true" />
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </motion.div>
          )}
        </section>

        {/* Difficulty Preference Section */}
        <section aria-labelledby="difficulty-heading" className="mb-6">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="w-5 h-5" style={{ color: colors.iconColor }} aria-hidden="true" />
            <h2 id="difficulty-heading" className="text-lg font-semibold" style={{ color: colors.textPrimary }}>
              Difficulty Preference
            </h2>
          </div>

          <div className="space-y-2" role="radiogroup" aria-label="Difficulty preference">
            {[
              { 
                id: 'beginner', 
                title: 'Beginner Friendly', 
                description: 'Start with basics and build foundation slowly',
                icon: '🌱',
              },
              { 
                id: 'intermediate', 
                title: 'Moderate Challenge', 
                description: 'Balance between comfort and growth',
                icon: '🎯',
              },
              { 
                id: 'advanced', 
                title: 'Advanced Challenge', 
                description: 'Push your limits with complex content',
                icon: '🚀',
              },
              { 
                id: 'adaptive', 
                title: 'Adaptive (Recommended)', 
                description: 'Automatically adjusts based on your performance',
                icon: '🧠',
              },
            ].map((difficulty) => {
              const isSelected = preferences.difficultyPreference === difficulty.id;
              
              return (
                <button
                  key={difficulty.id}
                  onClick={() => setPreferences({ ...preferences, difficultyPreference: difficulty.id as any })}
                  className="w-full rounded-xl p-4 text-left transition-all"
                  style={{
                    background: isSelected ? colors.cardHover : colors.cardBg,
                    backdropFilter: colors.blur,
                    WebkitBackdropFilter: colors.blur,
                    border: isSelected ? `2px solid ${colors.iconColor}` : colors.glassBorder,
                    boxShadow: colors.shadow,
                  }}
                  onMouseEnter={(e) => {
                    if (!isSelected) e.currentTarget.style.background = colors.cardHover;
                  }}
                  onMouseLeave={(e) => {
                    if (!isSelected) e.currentTarget.style.background = colors.cardBg;
                  }}
                  role="radio"
                  aria-checked={isSelected}
                  aria-label={`${difficulty.title}, ${difficulty.description}`}
                >
                  <div className="flex items-center gap-3">
                    <div className="text-3xl" aria-hidden="true">{difficulty.icon}</div>
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold mb-1" style={{ color: colors.textPrimary }}>
                        {difficulty.title}
                      </div>
                      <div className="text-sm" style={{ color: colors.textSecondary }}>
                        {difficulty.description}
                      </div>
                    </div>
                    {isSelected && (
                      <Check className="w-5 h-5 flex-shrink-0" style={{ color: colors.iconColor }} aria-hidden="true" />
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </section>

        {/* Content Preference Section */}
        <section aria-labelledby="content-preference-heading" className="mb-6">
          <div className="flex items-center gap-2 mb-4">
            <Gamepad2 className="w-5 h-5" style={{ color: colors.iconColor }} aria-hidden="true" />
            <h2 id="content-preference-heading" className="text-lg font-semibold" style={{ color: colors.textPrimary }}>
              Learning Style Preference
            </h2>
          </div>

          <div className="space-y-2" role="radiogroup" aria-label="Content preference">
            {[
              { 
                id: 'games', 
                title: 'Gamified Learning', 
                description: 'Fun games, challenges, and interactive activities',
                icon: Gamepad2,
              },
              { 
                id: 'structured', 
                title: 'Structured Lessons', 
                description: 'Traditional lessons with clear progression',
                icon: BookOpen,
              },
              { 
                id: 'balanced', 
                title: 'Balanced Mix (Recommended)', 
                description: 'Combination of games and structured content',
                icon: Trophy,
              },
            ].map((content) => {
              const Icon = content.icon;
              const isSelected = preferences.contentPreference === content.id;
              
              return (
                <button
                  key={content.id}
                  onClick={() => setPreferences({ ...preferences, contentPreference: content.id as any })}
                  className="w-full rounded-xl p-4 text-left transition-all"
                  style={{
                    background: isSelected ? colors.cardHover : colors.cardBg,
                    backdropFilter: colors.blur,
                    WebkitBackdropFilter: colors.blur,
                    border: isSelected ? `2px solid ${colors.iconColor}` : colors.glassBorder,
                    boxShadow: colors.shadow,
                  }}
                  onMouseEnter={(e) => {
                    if (!isSelected) e.currentTarget.style.background = colors.cardHover;
                  }}
                  onMouseLeave={(e) => {
                    if (!isSelected) e.currentTarget.style.background = colors.cardBg;
                  }}
                  role="radio"
                  aria-checked={isSelected}
                  aria-label={`${content.title}, ${content.description}`}
                >
                  <div className="flex items-center gap-3">
                    <div 
                      className="w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0"
                      style={{ background: isSelected ? colors.iconBg : colors.cardHover }}
                      aria-hidden="true"
                    >
                      <Icon className="w-6 h-6" style={{ color: colors.iconColor }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold mb-1" style={{ color: colors.textPrimary }}>
                        {content.title}
                      </div>
                      <div className="text-sm" style={{ color: colors.textSecondary }}>
                        {content.description}
                      </div>
                    </div>
                    {isSelected && (
                      <Check className="w-5 h-5 flex-shrink-0" style={{ color: colors.iconColor }} aria-hidden="true" />
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </section>

        {/* Practice Style Preferences */}
        <section aria-labelledby="practice-style-heading" className="mb-6">
          <div className="flex items-center gap-2 mb-4">
            <Brain className="w-5 h-5" style={{ color: colors.iconColor }} aria-hidden="true" />
            <h2 id="practice-style-heading" className="text-lg font-semibold" style={{ color: colors.textPrimary }}>
              Preferred Practice Methods
            </h2>
          </div>

          <p className="text-sm mb-4" style={{ color: colors.textSecondary }}>
            Select all that interest you (we'll personalize your experience)
          </p>

          <div className="grid grid-cols-2 gap-3">
            {practiceStyles.map((style) => {
              const Icon = style.icon;
              const isSelected = preferences.practiceStyle.includes(style.id);
              
              return (
                <button
                  key={style.id}
                  onClick={() => togglePracticeStyle(style.id)}
                  className="rounded-xl p-4 text-center transition-all"
                  style={{
                    background: isSelected ? colors.iconBg : colors.cardBg,
                    backdropFilter: colors.blur,
                    WebkitBackdropFilter: colors.blur,
                    border: isSelected ? `2px solid ${colors.iconColor}` : colors.glassBorder,
                    boxShadow: colors.shadow,
                  }}
                  onMouseEnter={(e) => {
                    if (!isSelected) e.currentTarget.style.background = colors.cardHover;
                  }}
                  onMouseLeave={(e) => {
                    if (!isSelected) e.currentTarget.style.background = colors.cardBg;
                  }}
                  role="checkbox"
                  aria-checked={isSelected}
                  aria-label={style.label}
                >
                  <div 
                    className="w-12 h-12 rounded-lg flex items-center justify-center mx-auto mb-2"
                    style={{ background: isSelected ? colors.iconColor : colors.cardHover }}
                    aria-hidden="true"
                  >
                    <Icon className="w-6 h-6" style={{ color: isSelected ? 'white' : colors.iconColor }} />
                  </div>
                  <div className="text-sm font-semibold" style={{ color: colors.textPrimary }}>
                    {style.label}
                  </div>
                  {isSelected && (
                    <div className="mt-2">
                      <Check className="w-4 h-4 mx-auto" style={{ color: colors.iconColor }} aria-hidden="true" />
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </section>

        {/* Focus Areas */}
        <section aria-labelledby="focus-areas-heading" className="mb-6">
          <div className="flex items-center gap-2 mb-4">
            <Target className="w-5 h-5" style={{ color: colors.iconColor }} aria-hidden="true" />
            <h2 id="focus-areas-heading" className="text-lg font-semibold" style={{ color: colors.textPrimary }}>
              Learning Focus Areas
            </h2>
          </div>

          <p className="text-sm mb-4" style={{ color: colors.textSecondary }}>
            What do you want to focus on most?
          </p>

          <div className="space-y-2">
            {focusAreas.map((area) => {
              const isSelected = preferences.focusAreas.includes(area.id);
              
              return (
                <button
                  key={area.id}
                  onClick={() => toggleFocusArea(area.id)}
                  className="w-full rounded-xl p-4 text-left transition-all"
                  style={{
                    background: isSelected ? colors.cardHover : colors.cardBg,
                    backdropFilter: colors.blur,
                    WebkitBackdropFilter: colors.blur,
                    border: isSelected ? `2px solid ${colors.iconColor}` : colors.glassBorder,
                    boxShadow: colors.shadow,
                  }}
                  onMouseEnter={(e) => {
                    if (!isSelected) e.currentTarget.style.background = colors.cardHover;
                  }}
                  onMouseLeave={(e) => {
                    if (!isSelected) e.currentTarget.style.background = colors.cardBg;
                  }}
                  role="checkbox"
                  aria-checked={isSelected}
                  aria-label={area.label}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-semibold" style={{ color: colors.textPrimary }}>
                      {area.label}
                    </span>
                    {isSelected ? (
                      <div 
                        className="w-6 h-6 rounded-full flex items-center justify-center"
                        style={{ background: colors.iconColor }}
                        aria-hidden="true"
                      >
                        <Check className="w-4 h-4 text-white" />
                      </div>
                    ) : (
                      <div 
                        className="w-6 h-6 rounded-full border-2"
                        style={{ borderColor: colors.border }}
                        aria-hidden="true"
                      />
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </section>
      </div>

      {/* Bottom Actions */}
      <div 
        className="p-4 sm:p-6 border-t"
        style={{ borderTopColor: colors.border }}
      >
        <Button
          onClick={handleSave}
          className="w-full h-12 rounded-full font-semibold"
          style={{
            background: colors.iconColor,
            color: theme === 'dark' ? 'var(--color-bg-deep)' : '#FFFFFF',
          }}
          aria-label="Save preferences"
        >
          Save Preferences
        </Button>
      </div>

      {/* Save Confirmation Toast */}
      <AnimatePresence>
        {showSaveConfirmation && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-24 left-1/2 -translate-x-1/2 z-50"
          >
            <div 
              className="rounded-full px-6 py-3 flex items-center gap-2 shadow-lg"
              style={{ background: colors.successColor }}
              role="status"
              aria-live="polite"
            >
              <Check className="w-5 h-5 text-white" aria-hidden="true" />
              <span className="text-white font-semibold">
                Preferences Saved!
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
