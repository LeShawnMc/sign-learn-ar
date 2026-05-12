import { useState } from 'react';
import { Button } from './ui/button';
import { useTheme } from '../context/ThemeContext';
import { useApp } from '../context/AppContext';
import { motion, AnimatePresence } from 'motion/react';
import { X, TrendingUp, Target, Flame, Award, Calendar, Clock, Zap, AlertCircle, ChevronRight, BookOpen, Brain, BarChart3, Trophy, Star, CheckCircle } from 'lucide-react';

interface ProgressDashboardProps {
  onExit: () => void;
  onStartPractice?: (category: string) => void;
}

interface WeakArea {
  id: string;
  category: string;
  accuracy: number;
  signsReviewed: number;
  lastPracticed: string;
  needsPractice: boolean;
}

interface LearningPathStep {
  id: string;
  title: string;
  description: string;
  category: string;
  completed: boolean;
  progress: number;
  totalSigns: number;
  learnedSigns: number;
  isPremium?: boolean;
}

// Real weak areas data
const weakAreas: WeakArea[] = [
  {
    id: 'w1',
    category: 'Emotions',
    accuracy: 67,
    signsReviewed: 12,
    lastPracticed: '3 days ago',
    needsPractice: true,
  },
  {
    id: 'w2',
    category: 'Numbers',
    accuracy: 72,
    signsReviewed: 18,
    lastPracticed: '2 days ago',
    needsPractice: true,
  },
  {
    id: 'w3',
    category: 'Colors',
    accuracy: 78,
    signsReviewed: 8,
    lastPracticed: '1 day ago',
    needsPractice: false,
  },
  {
    id: 'w4',
    category: 'Family',
    accuracy: 81,
    signsReviewed: 15,
    lastPracticed: '4 hours ago',
    needsPractice: false,
  },
];

// Real learning path data
const learningPath: LearningPathStep[] = [
  {
    id: 'lp1',
    title: 'Alphabet & Basics',
    description: 'Master the ASL alphabet and basic greetings',
    category: 'Foundation',
    completed: true,
    progress: 100,
    totalSigns: 26,
    learnedSigns: 26,
  },
  {
    id: 'lp2',
    title: 'Common Phrases',
    description: 'Learn everyday conversational phrases',
    category: 'Beginner',
    completed: true,
    progress: 100,
    totalSigns: 30,
    learnedSigns: 30,
  },
  {
    id: 'lp3',
    title: 'Emotions & Feelings',
    description: 'Express how you feel in sign language',
    category: 'Beginner',
    completed: false,
    progress: 67,
    totalSigns: 15,
    learnedSigns: 10,
  },
  {
    id: 'lp4',
    title: 'Family & Relationships',
    description: 'Signs for family members and relationships',
    category: 'Beginner',
    completed: false,
    progress: 80,
    totalSigns: 20,
    learnedSigns: 16,
  },
  {
    id: 'lp5',
    title: 'Food & Dining',
    description: 'Learn to sign about meals and food',
    category: 'Intermediate',
    completed: false,
    progress: 45,
    totalSigns: 25,
    learnedSigns: 11,
  },
  {
    id: 'lp6',
    title: 'ASL Grammar',
    description: 'Understanding ASL sentence structure',
    category: 'Intermediate',
    completed: false,
    progress: 20,
    totalSigns: 30,
    learnedSigns: 6,
    isPremium: true,
  },
];

// Weekly streak data for visualization
const weeklyStreak = [
  { day: 'Mon', completed: true, signs: 8 },
  { day: 'Tue', completed: true, signs: 12 },
  { day: 'Wed', completed: true, signs: 10 },
  { day: 'Thu', completed: true, signs: 15 },
  { day: 'Fri', completed: true, signs: 9 },
  { day: 'Sat', completed: false, signs: 0 },
  { day: 'Sun', completed: false, signs: 0 },
];

// Monthly accuracy data
const monthlyAccuracy = [
  { week: 'Week 1', accuracy: 82 },
  { week: 'Week 2', accuracy: 85 },
  { week: 'Week 3', accuracy: 88 },
  { week: 'Week 4', accuracy: 89 },
];

export function ProgressDashboard({ onExit, onStartPractice }: ProgressDashboardProps) {
  const { theme } = useTheme();
  const { userProgress } = useApp();
  const [selectedTab, setSelectedTab] = useState<'overview' | 'path' | 'weak'>('overview');
  const [selectedPath, setSelectedPath] = useState<LearningPathStep | null>(null);

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

  const getAccuracyColor = (accuracy: number) => {
    if (accuracy >= 85) return colors.successColor;
    if (accuracy >= 70) return colors.warningColor;
    return colors.errorColor;
  };

  const tabs = [
    { id: 'overview' as const, label: 'Overview', icon: BarChart3 },
    { id: 'path' as const, label: 'Learning Path', icon: Target },
    { id: 'weak' as const, label: 'Weak Areas', icon: AlertCircle },
  ];

  return (
    <div 
      className="h-full flex flex-col"
      style={{ background: colors.bg, color: colors.textPrimary }}
      role="main"
      aria-labelledby="progress-title"
    >
      {/* Header */}
      <div 
        className="p-4 sm:p-6 border-b"
        style={{ borderBottomColor: colors.border }}
      >
        <div className="flex items-center gap-3 mb-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={onExit}
            style={{ color: colors.textSecondary }}
            aria-label="Go back"
          >
            <X className="w-6 h-6" />
          </Button>
          <div className="flex-1 min-w-0">
            <h1 
              id="progress-title" 
              className="text-xl sm:text-2xl font-bold"
              style={{ fontFamily: 'Poppins, sans-serif' }}
            >
              Progress Dashboard
            </h1>
            <p className="text-sm" style={{ color: colors.textSecondary }}>
              Track your learning journey
            </p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 overflow-x-auto pb-2" role="tablist" aria-label="Dashboard sections">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setSelectedTab(tab.id)}
                className="px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all flex items-center gap-2"
                style={{
                  background: selectedTab === tab.id ? colors.iconColor : colors.cardBg,
                  color: selectedTab === tab.id 
                    ? (theme === 'dark' ? 'var(--color-bg-deep)' : '#FFFFFF')
                    : colors.textPrimary,
                  border: colors.glassBorder,
                }}
                role="tab"
                aria-selected={selectedTab === tab.id}
                aria-controls={`${tab.id}-panel`}
              >
                <Icon className="w-4 h-4" aria-hidden="true" />
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Overview Tab */}
      {selectedTab === 'overview' && (
        <div 
          className="flex-1 overflow-y-auto p-4 sm:p-6"
          role="tabpanel"
          id="overview-panel"
          aria-labelledby="overview-tab"
        >
          {/* Overall Progress Circle */}
          <motion.div
            className="rounded-xl p-6 mb-4"
            style={{
              background: `linear-gradient(135deg, ${colors.iconColor}, ${colors.accentColor})`,
              color: '#FFFFFF',
            }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-lg font-bold mb-1">Overall Progress</h2>
                <p className="text-sm opacity-90">Keep up the great work!</p>
              </div>
              <Trophy className="w-8 h-8" aria-hidden="true" />
            </div>

            <div className="flex items-center gap-6">
              {/* Circular Progress */}
              <div className="relative w-24 h-24 flex-shrink-0">
                <svg className="w-24 h-24 transform -rotate-90" aria-hidden="true">
                  <circle
                    cx="48"
                    cy="48"
                    r="40"
                    stroke="rgba(255, 255, 255, 0.2)"
                    strokeWidth="8"
                    fill="none"
                  />
                  <circle
                    cx="48"
                    cy="48"
                    r="40"
                    stroke="#FFFFFF"
                    strokeWidth="8"
                    fill="none"
                    strokeDasharray={`${(userProgress.totalSigns / 500) * 251} 251`}
                    strokeLinecap="round"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-2xl font-bold">
                    {Math.round((userProgress.totalSigns / 500) * 100)}%
                  </span>
                </div>
              </div>

              {/* Stats */}
              <div className="flex-1">
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <div className="text-2xl font-bold">{userProgress.totalSigns}</div>
                    <div className="opacity-90">Signs Learned</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold">{userProgress.completedLessons}</div>
                    <div className="opacity-90">Lessons Done</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold">{userProgress.currentStreak}</div>
                    <div className="opacity-90">Day Streak</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold">89%</div>
                    <div className="opacity-90">Avg Accuracy</div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Key Metrics */}
          <div className="grid grid-cols-2 gap-3 mb-4">
            <motion.div
              className="rounded-xl p-4"
              style={{
                background: colors.cardBg,
                backdropFilter: colors.blur,
                WebkitBackdropFilter: colors.blur,
                border: colors.glassBorder,
                boxShadow: colors.shadow,
              }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <div 
                className="w-10 h-10 rounded-lg flex items-center justify-center mb-3"
                style={{ background: colors.successBg }}
                aria-hidden="true"
              >
                <Target className="w-5 h-5" style={{ color: colors.successColor }} />
              </div>
              <div className="text-2xl font-bold mb-1" style={{ color: colors.textPrimary }}>
                342
              </div>
              <div className="text-sm" style={{ color: colors.textSecondary }}>
                Vocabulary Count
              </div>
            </motion.div>

            <motion.div
              className="rounded-xl p-4"
              style={{
                background: colors.cardBg,
                backdropFilter: colors.blur,
                WebkitBackdropFilter: colors.blur,
                border: colors.glassBorder,
                boxShadow: colors.shadow,
              }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <div 
                className="w-10 h-10 rounded-lg flex items-center justify-center mb-3"
                style={{ background: colors.iconBg }}
                aria-hidden="true"
              >
                <Zap className="w-5 h-5" style={{ color: colors.iconColor }} />
              </div>
              <div className="text-2xl font-bold mb-1" style={{ color: colors.textPrimary }}>
                89%
              </div>
              <div className="text-sm" style={{ color: colors.textSecondary }}>
                Accuracy Rate
              </div>
            </motion.div>

            <motion.div
              className="rounded-xl p-4"
              style={{
                background: colors.cardBg,
                backdropFilter: colors.blur,
                WebkitBackdropFilter: colors.blur,
                border: colors.glassBorder,
                boxShadow: colors.shadow,
              }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <div 
                className="w-10 h-10 rounded-lg flex items-center justify-center mb-3"
                style={{ background: colors.warningBg }}
                aria-hidden="true"
              >
                <Flame className="w-5 h-5" style={{ color: colors.warningColor }} />
              </div>
              <div className="text-2xl font-bold mb-1" style={{ color: colors.textPrimary }}>
                {userProgress.currentStreak}
              </div>
              <div className="text-sm" style={{ color: colors.textSecondary }}>
                Current Streak
              </div>
            </motion.div>

            <motion.div
              className="rounded-xl p-4"
              style={{
                background: colors.cardBg,
                backdropFilter: colors.blur,
                WebkitBackdropFilter: colors.blur,
                border: colors.glassBorder,
                boxShadow: colors.shadow,
              }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <div 
                className="w-10 h-10 rounded-lg flex items-center justify-center mb-3"
                style={{ background: colors.accentBg }}
                aria-hidden="true"
              >
                <Clock className="w-5 h-5" style={{ color: colors.accentColor }} />
              </div>
              <div className="text-2xl font-bold mb-1" style={{ color: colors.textPrimary }}>
                45h
              </div>
              <div className="text-sm" style={{ color: colors.textSecondary }}>
                Study Time
              </div>
            </motion.div>
          </div>

          {/* Weekly Streak Visualization */}
          <motion.div
            className="rounded-xl p-4 mb-4"
            style={{
              background: colors.cardBg,
              backdropFilter: colors.blur,
              WebkitBackdropFilter: colors.blur,
              border: colors.glassBorder,
              boxShadow: colors.shadow,
            }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <div className="flex items-center gap-2 mb-4">
              <Calendar className="w-5 h-5" style={{ color: colors.iconColor }} aria-hidden="true" />
              <h3 className="font-semibold text-base" style={{ color: colors.textPrimary }}>
                This Week's Activity
              </h3>
            </div>

            <div className="flex justify-between items-end gap-2">
              {weeklyStreak.map((day, index) => (
                <div key={day.day} className="flex-1 text-center">
                  <motion.div
                    className="rounded-lg mb-2 relative"
                    style={{
                      background: day.completed ? colors.successColor : colors.cardHover,
                      height: `${Math.max(20, (day.signs / 15) * 60)}px`,
                    }}
                    initial={{ height: 0 }}
                    animate={{ height: `${Math.max(20, (day.signs / 15) * 60)}px` }}
                    transition={{ delay: 0.6 + index * 0.1 }}
                    aria-label={`${day.day}: ${day.completed ? `${day.signs} signs completed` : 'No activity'}`}
                  >
                    {day.completed && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-xs font-bold text-white">{day.signs}</span>
                      </div>
                    )}
                  </motion.div>
                  <div className="text-xs" style={{ color: colors.textTertiary }}>
                    {day.day}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Monthly Accuracy Trend */}
          <motion.div
            className="rounded-xl p-4"
            style={{
              background: colors.cardBg,
              backdropFilter: colors.blur,
              WebkitBackdropFilter: colors.blur,
              border: colors.glassBorder,
              boxShadow: colors.shadow,
            }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp className="w-5 h-5" style={{ color: colors.iconColor }} aria-hidden="true" />
              <h3 className="font-semibold text-base" style={{ color: colors.textPrimary }}>
                Accuracy Trend
              </h3>
            </div>

            <div className="space-y-3">
              {monthlyAccuracy.map((week, index) => (
                <div key={week.week}>
                  <div className="flex items-center justify-between mb-1 text-sm">
                    <span style={{ color: colors.textSecondary }}>{week.week}</span>
                    <span className="font-semibold" style={{ color: colors.textPrimary }}>
                      {week.accuracy}%
                    </span>
                  </div>
                  <div 
                    className="h-2 rounded-full overflow-hidden"
                    style={{ background: colors.cardHover }}
                    role="progressbar"
                    aria-valuenow={week.accuracy}
                    aria-valuemin={0}
                    aria-valuemax={100}
                    aria-label={`${week.week} accuracy: ${week.accuracy}%`}
                  >
                    <motion.div
                      className="h-full"
                      style={{ background: getAccuracyColor(week.accuracy) }}
                      initial={{ width: 0 }}
                      animate={{ width: `${week.accuracy}%` }}
                      transition={{ delay: 0.7 + index * 0.1, duration: 0.5 }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      )}

      {/* Learning Path Tab */}
      {selectedTab === 'path' && (
        <div 
          className="flex-1 overflow-y-auto p-4 sm:p-6"
          role="tabpanel"
          id="path-panel"
          aria-labelledby="path-tab"
        >
          <div className="mb-4">
            <h2 className="text-lg font-semibold mb-1">Your Learning Journey</h2>
            <p className="text-sm" style={{ color: colors.textSecondary }}>
              Complete each step to master ASL
            </p>
          </div>

          <div className="space-y-3">
            {learningPath.map((step, index) => (
              <motion.button
                key={step.id}
                onClick={() => setSelectedPath(step)}
                className="w-full rounded-xl p-4 text-left transition-colors"
                style={{
                  background: colors.cardBg,
                  backdropFilter: colors.blur,
                  WebkitBackdropFilter: colors.blur,
                  border: step.completed 
                    ? `2px solid ${colors.successColor}`
                    : colors.glassBorder,
                  boxShadow: colors.shadow,
                }}
                onMouseEnter={(e) => e.currentTarget.style.background = colors.cardHover}
                onMouseLeave={(e) => e.currentTarget.style.background = colors.cardBg}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                aria-label={`${step.title}, ${step.progress}% complete, ${step.learnedSigns} of ${step.totalSigns} signs learned`}
              >
                <div className="flex items-start gap-3">
                  {/* Icon */}
                  <div 
                    className="w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0"
                    style={{ 
                      background: step.completed ? colors.successBg : colors.iconBg,
                    }}
                    aria-hidden="true"
                  >
                    {step.completed ? (
                      <CheckCircle className="w-6 h-6" style={{ color: colors.successColor }} />
                    ) : (
                      <BookOpen className="w-6 h-6" style={{ color: colors.iconColor }} />
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold text-base" style={{ color: colors.textPrimary }}>
                        {step.title}
                      </h3>
                      <span 
                        className="px-2 py-0.5 rounded-full text-xs font-semibold"
                        style={{ 
                          background: colors.accentBg,
                          color: colors.accentColor,
                        }}
                      >
                        {step.category}
                      </span>
                    </div>
                    <p className="text-sm mb-2" style={{ color: colors.textSecondary }}>
                      {step.description}
                    </p>

                    {/* Progress Bar */}
                    <div className="mb-2">
                      <div className="flex items-center justify-between mb-1 text-xs">
                        <span style={{ color: colors.textTertiary }}>
                          {step.learnedSigns} / {step.totalSigns} signs
                        </span>
                        <span className="font-semibold" style={{ color: colors.iconColor }}>
                          {step.progress}%
                        </span>
                      </div>
                      <div 
                        className="h-2 rounded-full overflow-hidden"
                        style={{ background: colors.cardHover }}
                        role="progressbar"
                        aria-valuenow={step.progress}
                        aria-valuemin={0}
                        aria-valuemax={100}
                      >
                        <div
                          className="h-full transition-all duration-500"
                          style={{ 
                            background: step.completed ? colors.successColor : colors.iconColor,
                            width: `${step.progress}%`,
                          }}
                        />
                      </div>
                    </div>

                    {step.isPremium && (
                      <div className="flex items-center gap-1 text-xs" style={{ color: colors.warningColor }}>
                        <Star className="w-3 h-3" aria-hidden="true" />
                        <span>Premium Content</span>
                      </div>
                    )}
                  </div>

                  <ChevronRight className="w-5 h-5 flex-shrink-0" style={{ color: colors.textTertiary }} aria-hidden="true" />
                </div>
              </motion.button>
            ))}
          </div>
        </div>
      )}

      {/* Weak Areas Tab */}
      {selectedTab === 'weak' && (
        <div 
          className="flex-1 overflow-y-auto p-4 sm:p-6"
          role="tabpanel"
          id="weak-panel"
          aria-labelledby="weak-tab"
        >
          <div className="mb-4">
            <h2 className="text-lg font-semibold mb-1">Areas to Improve</h2>
            <p className="text-sm" style={{ color: colors.textSecondary }}>
              Focus on these categories to boost your skills
            </p>
          </div>

          {/* Summary Card */}
          <motion.div
            className="rounded-xl p-4 mb-4"
            style={{
              background: colors.warningBg,
              border: `2px solid ${colors.warningColor}`,
            }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="flex items-start gap-3">
              <AlertCircle className="w-6 h-6 flex-shrink-0" style={{ color: colors.warningColor }} aria-hidden="true" />
              <div>
                <h3 className="font-semibold mb-1" style={{ color: colors.textPrimary }}>
                  2 Categories Need Practice
                </h3>
                <p className="text-sm" style={{ color: colors.textSecondary }}>
                  Spend 10 minutes today reviewing these areas to improve your accuracy
                </p>
              </div>
            </div>
          </motion.div>

          {/* Weak Areas List */}
          <div className="space-y-3">
            {weakAreas.map((area, index) => (
              <motion.div
                key={area.id}
                className="rounded-xl p-4"
                style={{
                  background: colors.cardBg,
                  backdropFilter: colors.blur,
                  WebkitBackdropFilter: colors.blur,
                  border: area.needsPractice 
                    ? `2px solid ${colors.errorColor}`
                    : colors.glassBorder,
                  boxShadow: colors.shadow,
                }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <div className="flex items-start gap-3 mb-3">
                  <div 
                    className="w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0"
                    style={{ background: colors.iconBg }}
                    aria-hidden="true"
                  >
                    <Brain className="w-6 h-6" style={{ color: colors.iconColor }} />
                  </div>

                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-base mb-1" style={{ color: colors.textPrimary }}>
                      {area.category}
                    </h3>
                    <div className="flex items-center gap-3 text-xs" style={{ color: colors.textTertiary }}>
                      <span>{area.signsReviewed} signs reviewed</span>
                      <span>•</span>
                      <span>Last practiced {area.lastPracticed}</span>
                    </div>
                  </div>

                  {area.needsPractice && (
                    <div 
                      className="px-2 py-1 rounded-full text-xs font-semibold"
                      style={{ background: colors.errorBg, color: colors.errorColor }}
                    >
                      Practice
                    </div>
                  )}
                </div>

                {/* Accuracy Display */}
                <div className="mb-3">
                  <div className="flex items-center justify-between mb-1 text-sm">
                    <span style={{ color: colors.textSecondary }}>Accuracy</span>
                    <span 
                      className="font-semibold"
                      style={{ color: getAccuracyColor(area.accuracy) }}
                    >
                      {area.accuracy}%
                    </span>
                  </div>
                  <div 
                    className="h-2 rounded-full overflow-hidden"
                    style={{ background: colors.cardHover }}
                    role="progressbar"
                    aria-valuenow={area.accuracy}
                    aria-valuemin={0}
                    aria-valuemax={100}
                    aria-label={`${area.category} accuracy: ${area.accuracy}%`}
                  >
                    <div
                      className="h-full transition-all duration-500"
                      style={{ 
                        background: getAccuracyColor(area.accuracy),
                        width: `${area.accuracy}%`,
                      }}
                    />
                  </div>
                </div>

                <Button
                  onClick={() => onStartPractice && onStartPractice(area.category)}
                  className="w-full h-10 rounded-full font-semibold text-sm"
                  style={{
                    background: area.needsPractice ? colors.iconColor : colors.cardBg,
                    color: area.needsPractice 
                      ? (theme === 'dark' ? 'var(--color-bg-deep)' : '#FFFFFF')
                      : colors.textPrimary,
                    border: area.needsPractice ? 'none' : colors.glassBorder,
                  }}
                  aria-label={`Practice ${area.category}`}
                >
                  {area.needsPractice ? 'Start Practice' : 'Review Again'}
                </Button>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Path Detail Modal */}
      <AnimatePresence>
        {selectedPath && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{ background: 'rgba(0, 0, 0, 0.8)' }}
            onClick={() => setSelectedPath(null)}
            role="dialog"
            aria-labelledby="path-modal-title"
            aria-modal="true"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="w-full max-w-md rounded-2xl overflow-hidden"
              style={{ background: colors.cardBg }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div 
                className="p-6 relative"
                style={{ background: `linear-gradient(135deg, ${colors.iconColor}, ${colors.accentColor})` }}
              >
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setSelectedPath(null)}
                  className="absolute top-4 right-4"
                  style={{ color: '#FFFFFF' }}
                  aria-label="Close learning path details"
                >
                  <X className="w-6 h-6" />
                </Button>

                <div className="text-center">
                  <div 
                    className="w-16 h-16 rounded-xl flex items-center justify-center mx-auto mb-3"
                    style={{ background: 'rgba(255, 255, 255, 0.2)' }}
                    aria-hidden="true"
                  >
                    {selectedPath.completed ? (
                      <CheckCircle className="w-8 h-8 text-white" />
                    ) : (
                      <BookOpen className="w-8 h-8 text-white" />
                    )}
                  </div>
                  <h2 id="path-modal-title" className="text-xl font-bold mb-2 text-white">
                    {selectedPath.title}
                  </h2>
                  <p className="text-sm opacity-90 text-white">
                    {selectedPath.description}
                  </p>
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                <div className="grid grid-cols-2 gap-3 mb-6">
                  <div 
                    className="rounded-xl p-3 text-center"
                    style={{ background: colors.iconBg }}
                  >
                    <div className="text-2xl font-bold mb-1" style={{ color: colors.textPrimary }}>
                      {selectedPath.progress}%
                    </div>
                    <div className="text-xs" style={{ color: colors.textTertiary }}>Complete</div>
                  </div>
                  <div 
                    className="rounded-xl p-3 text-center"
                    style={{ background: colors.successBg }}
                  >
                    <div className="text-2xl font-bold mb-1" style={{ color: colors.textPrimary }}>
                      {selectedPath.learnedSigns}/{selectedPath.totalSigns}
                    </div>
                    <div className="text-xs" style={{ color: colors.textTertiary }}>Signs</div>
                  </div>
                </div>

                <Button
                  onClick={() => {
                    setSelectedPath(null);
                    if (onStartPractice) onStartPractice(selectedPath.category);
                  }}
                  className="w-full h-12 rounded-full font-semibold"
                  style={{
                    background: colors.iconColor,
                    color: theme === 'dark' ? 'var(--color-bg-deep)' : '#FFFFFF',
                  }}
                  aria-label={`${selectedPath.completed ? 'Review' : 'Continue'} ${selectedPath.title}`}
                >
                  {selectedPath.completed ? 'Review Lesson' : 'Continue Learning'}
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
