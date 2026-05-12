import { useState } from 'react';
import { Button } from './ui/button';
import { useTheme } from '../context/ThemeContext';
import { useApp } from '../context/AppContext';
import { motion, AnimatePresence } from 'motion/react';
import { X, Clock, TrendingUp, Target, Flame, Calendar, Users, BarChart3, Brain, Award, ChevronDown, ChevronUp, Filter, Download } from 'lucide-react';

interface DetailedAnalyticsProps {
  onExit: () => void;
}

// Real time spent data (in minutes)
const dailyTimeData = [
  { day: 'Mon', time: 25, sessions: 2 },
  { day: 'Tue', time: 35, sessions: 3 },
  { day: 'Wed', time: 20, sessions: 1 },
  { day: 'Thu', time: 40, sessions: 3 },
  { day: 'Fri', time: 30, sessions: 2 },
  { day: 'Sat', time: 15, sessions: 1 },
  { day: 'Sun', time: 0, sessions: 0 },
];

const weeklyTimeData = [
  { week: 'Week 1', time: 180, sessions: 14 },
  { week: 'Week 2', time: 195, sessions: 16 },
  { week: 'Week 3', time: 210, sessions: 17 },
  { week: 'Week 4', time: 165, sessions: 12 },
];

const monthlyTimeData = [
  { month: 'Jan', time: 450, sessions: 38 },
  { month: 'Feb', time: 520, sessions: 42 },
  { month: 'Mar', time: 680, sessions: 51 },
  { month: 'Apr', time: 750, sessions: 59 },
];

// Accuracy metrics over time
const accuracyData = [
  { period: 'Week 1', accuracy: 78, improvement: 0 },
  { period: 'Week 2', accuracy: 82, improvement: 4 },
  { period: 'Week 3', accuracy: 85, improvement: 3 },
  { period: 'Week 4', accuracy: 89, improvement: 4 },
];

// Vocabulary growth
const vocabularyGrowth = [
  { month: 'Jan', count: 156, new: 156 },
  { month: 'Feb', count: 234, new: 78 },
  { month: 'Mar', count: 298, new: 64 },
  { month: 'Apr', count: 342, new: 44 },
];

// Streak calendar (last 60 days)
const generateStreakCalendar = () => {
  const calendar = [];
  const today = new Date();
  
  for (let i = 59; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    
    // Simulate streak data (random for demo)
    const completed = i > 2 ? Math.random() > 0.2 : false; // Last 2 days not completed
    const intensity = completed ? Math.floor(Math.random() * 3) + 1 : 0; // 1-3 intensity
    
    calendar.push({
      date: date.getDate(),
      month: date.getMonth(),
      completed,
      intensity, // 0 = none, 1 = light, 2 = medium, 3 = high
    });
  }
  
  return calendar;
};

const streakCalendar = generateStreakCalendar();

// Weak areas
const weakAreasData = [
  { category: 'Emotions', accuracy: 67, practiced: 45, needsWork: true },
  { category: 'Numbers', accuracy: 72, practiced: 38, needsWork: true },
  { category: 'Colors', accuracy: 78, practiced: 52, needsWork: false },
  { category: 'Family', accuracy: 81, practiced: 67, needsWork: false },
  { category: 'Food', accuracy: 85, practiced: 74, needsWork: false },
];

// Comparison to similar learners
const comparisonData = {
  yourRank: 42,
  totalLearners: 1247,
  percentile: 96,
  metrics: [
    { name: 'Study Time', you: 750, average: 520, percentile: 85 },
    { name: 'Accuracy', you: 89, average: 78, percentile: 92 },
    { name: 'Streak', you: 45, average: 28, percentile: 88 },
    { name: 'Signs Learned', you: 342, average: 245, percentile: 94 },
  ],
};

// Session patterns
const sessionPatterns = {
  peakHour: '7 PM',
  averageDuration: 28,
  preferredDays: ['Tuesday', 'Thursday', 'Friday'],
  totalSessions: 156,
  averageSessionsPerWeek: 12,
};

type TimeRange = 'daily' | 'weekly' | 'monthly';

export function DetailedAnalytics({ onExit }: DetailedAnalyticsProps) {
  const { theme } = useTheme();
  const { userProgress } = useApp();
  const [timeRange, setTimeRange] = useState<TimeRange>('weekly');
  const [expandedSection, setExpandedSection] = useState<string | null>(null);

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
        chartBar: 'var(--color-cyan)',
        chartBarSecondary: 'var(--color-purple)',
        streakNone: 'var(--color-bg-card)',
        streakLight: 'rgba(0, 245, 255, 0.3)',
        streakMedium: 'rgba(0, 245, 255, 0.6)',
        streakHigh: 'var(--color-cyan)',
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
        chartBar: '#0EA5E9',
        chartBarSecondary: '#8B5CF6',
        streakNone: '#E5E7EB',
        streakLight: 'rgba(14, 165, 233, 0.3)',
        streakMedium: 'rgba(14, 165, 233, 0.6)',
        streakHigh: '#0EA5E9',
        blur: 'blur(20px)',
        shadow: '0 8px 32px rgba(31, 38, 135, 0.15)',
        glassBorder: '1px solid rgba(255, 255, 255, 0.6)',
      };

  const getTimeData = () => {
    switch (timeRange) {
      case 'daily': return dailyTimeData;
      case 'weekly': return weeklyTimeData;
      case 'monthly': return monthlyTimeData;
    }
  };

  const getTimeLabel = () => {
    switch (timeRange) {
      case 'daily': return 'day';
      case 'weekly': return 'week';
      case 'monthly': return 'month';
    }
  };

  const maxTime = Math.max(...getTimeData().map(d => d.time));

  const toggleSection = (section: string) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  const getStreakColor = (intensity: number) => {
    switch (intensity) {
      case 0: return colors.streakNone;
      case 1: return colors.streakLight;
      case 2: return colors.streakMedium;
      case 3: return colors.streakHigh;
      default: return colors.streakNone;
    }
  };

  const totalTimeThisMonth = monthlyTimeData[monthlyTimeData.length - 1].time;
  const totalSessionsThisMonth = monthlyTimeData[monthlyTimeData.length - 1].sessions;

  return (
    <div 
      className="h-full flex flex-col"
      style={{ background: colors.bg, color: colors.textPrimary }}
      role="main"
      aria-labelledby="analytics-title"
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
              id="analytics-title" 
              className="text-xl sm:text-2xl font-bold"
              style={{ fontFamily: 'Poppins, sans-serif' }}
            >
              Detailed Analytics
            </h1>
            <p className="text-sm" style={{ color: colors.textSecondary }}>
              Comprehensive learning insights
            </p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            style={{ color: colors.iconColor }}
            aria-label="Download report"
          >
            <Download className="w-5 h-5" />
          </Button>
        </div>

        {/* Time Range Selector */}
        <div className="flex gap-2" role="group" aria-label="Time range filter">
          {(['daily', 'weekly', 'monthly'] as TimeRange[]).map((range) => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              className="flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-all capitalize"
              style={{
                background: timeRange === range ? colors.iconColor : colors.cardBg,
                color: timeRange === range 
                  ? (theme === 'dark' ? 'var(--color-bg-deep)' : '#FFFFFF')
                  : colors.textPrimary,
                border: colors.glassBorder,
              }}
              aria-pressed={timeRange === range}
            >
              {range}
            </button>
          ))}
        </div>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6">
        {/* Summary Cards */}
        <div className="grid grid-cols-2 gap-3 mb-6">
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
          >
            <div 
              className="w-10 h-10 rounded-lg flex items-center justify-center mb-3"
              style={{ background: colors.iconBg }}
              aria-hidden="true"
            >
              <Clock className="w-5 h-5" style={{ color: colors.iconColor }} />
            </div>
            <div className="text-2xl font-bold mb-1" style={{ color: colors.textPrimary }}>
              {totalTimeThisMonth}m
            </div>
            <div className="text-sm" style={{ color: colors.textSecondary }}>
              Total Time
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
              89%
            </div>
            <div className="text-sm" style={{ color: colors.textSecondary }}>
              Avg Accuracy
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
              style={{ background: colors.warningBg }}
              aria-hidden="true"
            >
              <Flame className="w-5 h-5" style={{ color: colors.warningColor }} />
            </div>
            <div className="text-2xl font-bold mb-1" style={{ color: colors.textPrimary }}>
              {userProgress.currentStreak}
            </div>
            <div className="text-sm" style={{ color: colors.textSecondary }}>
              Day Streak
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
              style={{ background: colors.accentBg }}
              aria-hidden="true"
            >
              <BarChart3 className="w-5 h-5" style={{ color: colors.accentColor }} />
            </div>
            <div className="text-2xl font-bold mb-1" style={{ color: colors.textPrimary }}>
              {totalSessionsThisMonth}
            </div>
            <div className="text-sm" style={{ color: colors.textSecondary }}>
              Sessions
            </div>
          </motion.div>
        </div>

        {/* Time Spent Graph */}
        <motion.div
          className="rounded-xl p-4 mb-6"
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
          <div className="flex items-center gap-2 mb-4">
            <Clock className="w-5 h-5" style={{ color: colors.iconColor }} aria-hidden="true" />
            <h2 className="font-semibold text-base" style={{ color: colors.textPrimary }}>
              Time Spent Practicing
            </h2>
          </div>

          <div className="flex items-end justify-between gap-2 h-48 mb-4">
            {getTimeData().map((item, index) => (
              <div key={index} className="flex-1 flex flex-col items-center gap-2">
                <motion.div
                  className="w-full rounded-lg relative"
                  style={{
                    background: colors.chartBar,
                    height: `${(item.time / maxTime) * 100}%`,
                    minHeight: item.time > 0 ? '20px' : '4px',
                  }}
                  initial={{ height: 0 }}
                  animate={{ height: `${(item.time / maxTime) * 100}%` }}
                  transition={{ delay: 0.5 + index * 0.1 }}
                  role="img"
                  aria-label={`${'day' in item ? item.day : 'week' in item ? item.week : item.month}: ${item.time} minutes`}
                >
                  {item.time > 0 && (
                    <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-xs font-bold whitespace-nowrap" style={{ color: colors.textPrimary }}>
                      {item.time}m
                    </div>
                  )}
                </motion.div>
                <div className="text-xs text-center" style={{ color: colors.textTertiary }}>
                  {'day' in item ? item.day : 'week' in item ? item.week : item.month}
                </div>
              </div>
            ))}
          </div>

          <div className="text-sm" style={{ color: colors.textSecondary }}>
            Average: {Math.round(getTimeData().reduce((sum, d) => sum + d.time, 0) / getTimeData().length)} minutes per {getTimeLabel()}
          </div>
        </motion.div>

        {/* Accuracy Over Time */}
        <motion.div
          className="rounded-xl p-4 mb-6"
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
            <TrendingUp className="w-5 h-5" style={{ color: colors.iconColor }} aria-hidden="true" />
            <h2 className="font-semibold text-base" style={{ color: colors.textPrimary }}>
              Accuracy Over Time
            </h2>
          </div>

          <div className="space-y-3">
            {accuracyData.map((item, index) => (
              <motion.div
                key={item.period}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6 + index * 0.1 }}
              >
                <div className="flex items-center justify-between mb-1 text-sm">
                  <span style={{ color: colors.textSecondary }}>{item.period}</span>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold" style={{ color: colors.textPrimary }}>
                      {item.accuracy}%
                    </span>
                    {item.improvement > 0 && (
                      <span className="text-xs font-semibold" style={{ color: colors.successColor }}>
                        +{item.improvement}%
                      </span>
                    )}
                  </div>
                </div>
                <div 
                  className="h-2 rounded-full overflow-hidden"
                  style={{ background: colors.cardHover }}
                  role="progressbar"
                  aria-valuenow={item.accuracy}
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-label={`${item.period} accuracy: ${item.accuracy}%`}
                >
                  <motion.div
                    className="h-full"
                    style={{ background: colors.successColor }}
                    initial={{ width: 0 }}
                    animate={{ width: `${item.accuracy}%` }}
                    transition={{ delay: 0.7 + index * 0.1, duration: 0.5 }}
                  />
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Vocabulary Growth */}
        <motion.div
          className="rounded-xl p-4 mb-6"
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
            <Brain className="w-5 h-5" style={{ color: colors.iconColor }} aria-hidden="true" />
            <h2 className="font-semibold text-base" style={{ color: colors.textPrimary }}>
              Vocabulary Growth
            </h2>
          </div>

          <div className="flex items-end justify-between gap-2 h-40 mb-4">
            {vocabularyGrowth.map((item, index) => (
              <div key={item.month} className="flex-1 flex flex-col items-center gap-2">
                <motion.div
                  className="w-full rounded-lg relative"
                  style={{
                    background: colors.chartBarSecondary,
                    height: `${(item.count / 342) * 100}%`,
                    minHeight: '20px',
                  }}
                  initial={{ height: 0 }}
                  animate={{ height: `${(item.count / 342) * 100}%` }}
                  transition={{ delay: 0.7 + index * 0.1 }}
                  role="img"
                  aria-label={`${item.month}: ${item.count} signs learned, ${item.new} new`}
                >
                  <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-xs font-bold whitespace-nowrap" style={{ color: colors.textPrimary }}>
                    {item.count}
                  </div>
                </motion.div>
                <div className="text-xs text-center" style={{ color: colors.textTertiary }}>
                  {item.month}
                </div>
                <div className="text-xs font-semibold text-center" style={{ color: colors.successColor }}>
                  +{item.new}
                </div>
              </div>
            ))}
          </div>

          <div className="text-sm" style={{ color: colors.textSecondary }}>
            Total vocabulary: <span className="font-semibold" style={{ color: colors.textPrimary }}>342 signs</span>
          </div>
        </motion.div>

        {/* Streak Calendar */}
        <motion.div
          className="rounded-xl p-4 mb-6"
          style={{
            background: colors.cardBg,
            backdropFilter: colors.blur,
            WebkitBackdropFilter: colors.blur,
            border: colors.glassBorder,
            boxShadow: colors.shadow,
          }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
        >
          <div className="flex items-center gap-2 mb-4">
            <Calendar className="w-5 h-5" style={{ color: colors.iconColor }} aria-hidden="true" />
            <h2 className="font-semibold text-base" style={{ color: colors.textPrimary }}>
              Streak Calendar (Last 60 Days)
            </h2>
          </div>

          <div className="grid grid-cols-10 gap-1 mb-4">
            {streakCalendar.map((day, index) => (
              <motion.div
                key={index}
                className="aspect-square rounded"
                style={{ background: getStreakColor(day.intensity) }}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.8 + index * 0.01 }}
                role="img"
                aria-label={day.completed ? `Day ${day.date}: Practice completed` : `Day ${day.date}: No practice`}
              />
            ))}
          </div>

          <div className="flex items-center gap-4 text-xs" style={{ color: colors.textSecondary }}>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded" style={{ background: colors.streakNone }} aria-hidden="true" />
              <span>None</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded" style={{ background: colors.streakLight }} aria-hidden="true" />
              <span>Light</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded" style={{ background: colors.streakMedium }} aria-hidden="true" />
              <span>Medium</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded" style={{ background: colors.streakHigh }} aria-hidden="true" />
              <span>High</span>
            </div>
          </div>
        </motion.div>

        {/* Weak Areas */}
        <motion.div
          className="rounded-xl p-4 mb-6"
          style={{
            background: colors.cardBg,
            backdropFilter: colors.blur,
            WebkitBackdropFilter: colors.blur,
            border: colors.glassBorder,
            boxShadow: colors.shadow,
          }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
        >
          <button
            onClick={() => toggleSection('weak-areas')}
            className="w-full flex items-center justify-between mb-4"
            aria-expanded={expandedSection === 'weak-areas'}
            aria-controls="weak-areas-content"
          >
            <div className="flex items-center gap-2">
              <Target className="w-5 h-5" style={{ color: colors.iconColor }} aria-hidden="true" />
              <h2 className="font-semibold text-base" style={{ color: colors.textPrimary }}>
                Weak Areas Identification
              </h2>
            </div>
            {expandedSection === 'weak-areas' ? (
              <ChevronUp className="w-5 h-5" style={{ color: colors.textTertiary }} aria-hidden="true" />
            ) : (
              <ChevronDown className="w-5 h-5" style={{ color: colors.textTertiary }} aria-hidden="true" />
            )}
          </button>

          <AnimatePresence>
            {expandedSection === 'weak-areas' && (
              <motion.div
                id="weak-areas-content"
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="space-y-3"
              >
                {weakAreasData.map((area, index) => (
                  <div key={area.category}>
                    <div className="flex items-center justify-between mb-1 text-sm">
                      <div className="flex items-center gap-2">
                        <span style={{ color: colors.textPrimary }}>{area.category}</span>
                        {area.needsWork && (
                          <span 
                            className="px-2 py-0.5 rounded-full text-xs font-semibold"
                            style={{ background: colors.errorBg, color: colors.errorColor }}
                          >
                            Needs Work
                          </span>
                        )}
                      </div>
                      <span className="font-semibold" style={{ color: colors.textPrimary }}>
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
                          background: area.accuracy >= 85 ? colors.successColor : area.accuracy >= 70 ? colors.warningColor : colors.errorColor,
                          width: `${area.accuracy}%`,
                        }}
                      />
                    </div>
                    <div className="text-xs mt-1" style={{ color: colors.textTertiary }}>
                      {area.practiced} signs practiced
                    </div>
                  </div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Comparison to Similar Learners */}
        <motion.div
          className="rounded-xl p-4 mb-6"
          style={{
            background: colors.cardBg,
            backdropFilter: colors.blur,
            WebkitBackdropFilter: colors.blur,
            border: colors.glassBorder,
            boxShadow: colors.shadow,
          }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
        >
          <button
            onClick={() => toggleSection('comparison')}
            className="w-full flex items-center justify-between mb-4"
            aria-expanded={expandedSection === 'comparison'}
            aria-controls="comparison-content"
          >
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5" style={{ color: colors.iconColor }} aria-hidden="true" />
              <h2 className="font-semibold text-base" style={{ color: colors.textPrimary }}>
                Comparison to Similar Learners
              </h2>
            </div>
            {expandedSection === 'comparison' ? (
              <ChevronUp className="w-5 h-5" style={{ color: colors.textTertiary }} aria-hidden="true" />
            ) : (
              <ChevronDown className="w-5 h-5" style={{ color: colors.textTertiary }} aria-hidden="true" />
            )}
          </button>

          <AnimatePresence>
            {expandedSection === 'comparison' && (
              <motion.div
                id="comparison-content"
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
              >
                <div 
                  className="rounded-lg p-4 mb-4"
                  style={{ background: colors.iconBg }}
                >
                  <div className="text-center">
                    <div className="text-3xl font-bold mb-1" style={{ color: colors.textPrimary }}>
                      Top {comparisonData.percentile}%
                    </div>
                    <div className="text-sm" style={{ color: colors.textSecondary }}>
                      You're ranked #{comparisonData.yourRank} out of {comparisonData.totalLearners.toLocaleString()} learners
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  {comparisonData.metrics.map((metric, index) => (
                    <div key={metric.name}>
                      <div className="flex items-center justify-between mb-2 text-sm">
                        <span style={{ color: colors.textSecondary }}>{metric.name}</span>
                        <span className="text-xs" style={{ color: colors.textTertiary }}>
                          Top {metric.percentile}%
                        </span>
                      </div>
                      <div className="flex items-center gap-2 mb-1">
                        <div className="flex-1">
                          <div className="text-xs mb-1" style={{ color: colors.textTertiary }}>You</div>
                          <div 
                            className="h-6 rounded-lg flex items-center px-2"
                            style={{ 
                              background: colors.chartBar,
                              width: `${(metric.you / Math.max(metric.you, metric.average)) * 100}%`,
                              minWidth: '60px',
                            }}
                          >
                            <span className="text-xs font-bold" style={{ color: theme === 'dark' ? 'var(--color-bg-deep)' : '#FFFFFF' }}>
                              {metric.you}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="flex-1">
                          <div className="text-xs mb-1" style={{ color: colors.textTertiary }}>Average</div>
                          <div 
                            className="h-6 rounded-lg flex items-center px-2"
                            style={{ 
                              background: colors.cardHover,
                              width: `${(metric.average / Math.max(metric.you, metric.average)) * 100}%`,
                              minWidth: '60px',
                            }}
                          >
                            <span className="text-xs font-bold" style={{ color: colors.textSecondary }}>
                              {metric.average}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Session Patterns */}
        <motion.div
          className="rounded-xl p-4 mb-6"
          style={{
            background: colors.cardBg,
            backdropFilter: colors.blur,
            WebkitBackdropFilter: colors.blur,
            border: colors.glassBorder,
            boxShadow: colors.shadow,
          }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.0 }}
        >
          <button
            onClick={() => toggleSection('patterns')}
            className="w-full flex items-center justify-between mb-4"
            aria-expanded={expandedSection === 'patterns'}
            aria-controls="patterns-content"
          >
            <div className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5" style={{ color: colors.iconColor }} aria-hidden="true" />
              <h2 className="font-semibold text-base" style={{ color: colors.textPrimary }}>
                Session Frequency & Patterns
              </h2>
            </div>
            {expandedSection === 'patterns' ? (
              <ChevronUp className="w-5 h-5" style={{ color: colors.textTertiary }} aria-hidden="true" />
            ) : (
              <ChevronDown className="w-5 h-5" style={{ color: colors.textTertiary }} aria-hidden="true" />
            )}
          </button>

          <AnimatePresence>
            {expandedSection === 'patterns' && (
              <motion.div
                id="patterns-content"
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="space-y-4"
              >
                <div className="grid grid-cols-2 gap-3">
                  <div 
                    className="rounded-lg p-3"
                    style={{ background: colors.iconBg }}
                  >
                    <div className="text-xs mb-1" style={{ color: colors.textTertiary }}>Peak Hour</div>
                    <div className="text-xl font-bold" style={{ color: colors.textPrimary }}>
                      {sessionPatterns.peakHour}
                    </div>
                  </div>
                  <div 
                    className="rounded-lg p-3"
                    style={{ background: colors.successBg }}
                  >
                    <div className="text-xs mb-1" style={{ color: colors.textTertiary }}>Avg Duration</div>
                    <div className="text-xl font-bold" style={{ color: colors.textPrimary }}>
                      {sessionPatterns.averageDuration}m
                    </div>
                  </div>
                  <div 
                    className="rounded-lg p-3"
                    style={{ background: colors.accentBg }}
                  >
                    <div className="text-xs mb-1" style={{ color: colors.textTertiary }}>Total Sessions</div>
                    <div className="text-xl font-bold" style={{ color: colors.textPrimary }}>
                      {sessionPatterns.totalSessions}
                    </div>
                  </div>
                  <div 
                    className="rounded-lg p-3"
                    style={{ background: colors.warningBg }}
                  >
                    <div className="text-xs mb-1" style={{ color: colors.textTertiary }}>Per Week</div>
                    <div className="text-xl font-bold" style={{ color: colors.textPrimary }}>
                      {sessionPatterns.averageSessionsPerWeek}
                    </div>
                  </div>
                </div>

                <div>
                  <div className="text-sm font-semibold mb-2" style={{ color: colors.textPrimary }}>
                    Preferred Practice Days
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {sessionPatterns.preferredDays.map((day) => (
                      <div
                        key={day}
                        className="px-3 py-1 rounded-full text-sm font-medium"
                        style={{ 
                          background: colors.iconColor,
                          color: theme === 'dark' ? 'var(--color-bg-deep)' : '#FFFFFF',
                        }}
                      >
                        {day}
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
}
