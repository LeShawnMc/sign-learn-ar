import { useState } from 'react';
import { Button } from './ui/button';
import { useTheme } from '../context/ThemeContext';
import { useApp } from '../context/AppContext';
import { motion } from 'motion/react';
import { X, CheckCircle, XCircle, TrendingUp, Target, Clock, Star, Flame, Trophy, ChevronRight, BookOpen, ThumbsUp, Award, Zap, Calendar } from 'lucide-react';

interface ReviewSessionSummaryProps {
  onExit: () => void;
  sessionData: {
    totalSigns: number;
    correctSigns: number;
    timeSpent: number;
    mistakes: Array<{
      sign: string;
      userAttempt: string;
      correctForm: string;
      tipForCorrection: string;
    }>;
    newVocabulary: Array<{
      sign: string;
      meaning: string;
      category: string;
    }>;
    accuracyByCategory: Array<{
      category: string;
      accuracy: number;
      total: number;
      correct: number;
    }>;
    streakContinued: boolean;
    currentStreak: number;
  };
}

export function ReviewSessionSummary({ onExit, sessionData }: ReviewSessionSummaryProps) {
  const { theme } = useTheme();
  const { userProgress } = useApp();
  const [showAddToJournal, setShowAddToJournal] = useState(false);
  const [journalNote, setJournalNote] = useState('');
  const [journalMood, setJournalMood] = useState<'excellent' | 'good' | 'okay' | 'challenging'>('good');

  // Calculate overall accuracy
  const accuracy = Math.round((sessionData.correctSigns / sessionData.totalSigns) * 100);

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

  // Get motivational message based on accuracy
  const getMotivationalMessage = () => {
    if (accuracy >= 95) {
      return {
        title: "Outstanding Performance! 🌟",
        message: "You're mastering ASL with incredible precision. Your dedication is truly paying off!",
        icon: Trophy,
        color: colors.successColor,
      };
    } else if (accuracy >= 85) {
      return {
        title: "Excellent Work! 🎯",
        message: "You're making great progress! Keep up this consistent effort and you'll be fluent in no time.",
        icon: Award,
        color: colors.iconColor,
      };
    } else if (accuracy >= 70) {
      return {
        title: "Good Progress! 💪",
        message: "You're on the right track! Review the mistakes below and you'll see even better results.",
        icon: ThumbsUp,
        color: colors.accentColor,
      };
    } else {
      return {
        title: "Keep Going! 🚀",
        message: "Learning takes time and practice. Focus on the corrections below and try again tomorrow!",
        icon: Zap,
        color: colors.warningColor,
      };
    }
  };

  const motivational = getMotivationalMessage();
  const MotivationalIcon = motivational.icon;

  // Get next recommended practice
  const getNextRecommendation = () => {
    if (sessionData.mistakes.length > 3) {
      return {
        title: "Review Difficult Signs",
        description: "Focus on the signs you struggled with today",
        duration: "10 min",
        type: "targeted-practice",
      };
    } else if (accuracy >= 90) {
      return {
        title: "Advanced Vocabulary",
        description: "You're ready for more challenging signs",
        duration: "15 min",
        type: "new-lesson",
      };
    } else {
      return {
        title: "Mixed Practice",
        description: "Combination of new and review signs",
        duration: "15 min",
        type: "mixed-practice",
      };
    }
  };

  const recommendation = getNextRecommendation();

  const handleAddToJournal = () => {
    // In a real app, this would save to a database
    setShowAddToJournal(false);
    setJournalNote('');
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs}s`;
  };

  return (
    <div 
      className="h-full flex flex-col"
      style={{ background: colors.bg, color: colors.textPrimary }}
      role="main"
      aria-labelledby="summary-title"
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
            aria-label="Close summary"
          >
            <X className="w-6 h-6" />
          </Button>
          <div className="flex-1 min-w-0">
            <h1 
              id="summary-title" 
              className="text-xl sm:text-2xl font-bold"
              style={{ fontFamily: 'Poppins, sans-serif' }}
            >
              Session Summary
            </h1>
            <p className="text-sm" style={{ color: colors.textSecondary }}>
              Great practice session!
            </p>
          </div>
        </div>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6">
        {/* Motivational Header */}
        <motion.div
          className="rounded-xl p-6 mb-6 text-center"
          style={{
            background: `linear-gradient(135deg, ${motivational.color}, ${motivational.color}dd)`,
          }}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          role="region"
          aria-label="Motivational message"
        >
          <div 
            className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
            style={{ background: 'rgba(255, 255, 255, 0.2)' }}
            aria-hidden="true"
          >
            <MotivationalIcon className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-2xl font-bold mb-2 text-white">
            {motivational.title}
          </h2>
          <p className="text-sm opacity-90 text-white">
            {motivational.message}
          </p>
        </motion.div>

        {/* Overall Statistics */}
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
          transition={{ delay: 0.1 }}
        >
          <h3 className="text-lg font-semibold mb-4" style={{ color: colors.textPrimary }}>
            Overall Performance
          </h3>

          <div className="grid grid-cols-2 gap-3 mb-4">
            <div 
              className="rounded-lg p-4 text-center"
              style={{ background: colors.successBg }}
            >
              <div className="text-3xl font-bold mb-1" style={{ color: colors.textPrimary }}>
                {accuracy}%
              </div>
              <div className="text-xs" style={{ color: colors.textSecondary }}>
                Accuracy
              </div>
            </div>

            <div 
              className="rounded-lg p-4 text-center"
              style={{ background: colors.iconBg }}
            >
              <div className="text-3xl font-bold mb-1" style={{ color: colors.textPrimary }}>
                {sessionData.totalSigns}
              </div>
              <div className="text-xs" style={{ color: colors.textSecondary }}>
                Signs Practiced
              </div>
            </div>

            <div 
              className="rounded-lg p-4 text-center"
              style={{ background: colors.accentBg }}
            >
              <div className="text-3xl font-bold mb-1" style={{ color: colors.textPrimary }}>
                {formatTime(sessionData.timeSpent)}
              </div>
              <div className="text-xs" style={{ color: colors.textSecondary }}>
                Time Spent
              </div>
            </div>

            <div 
              className="rounded-lg p-4 text-center"
              style={{ background: colors.warningBg }}
            >
              <div className="text-3xl font-bold mb-1" style={{ color: colors.textPrimary }}>
                {sessionData.newVocabulary.length}
              </div>
              <div className="text-xs" style={{ color: colors.textSecondary }}>
                New Signs
              </div>
            </div>
          </div>

          {/* Accuracy Breakdown */}
          <div className="mb-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-semibold" style={{ color: colors.textPrimary }}>
                Score Breakdown
              </span>
              <span className="text-sm" style={{ color: colors.textSecondary }}>
                {sessionData.correctSigns}/{sessionData.totalSigns} correct
              </span>
            </div>
            <div 
              className="h-3 rounded-full overflow-hidden"
              style={{ background: colors.cardHover }}
              role="progressbar"
              aria-valuenow={accuracy}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-label={`Overall accuracy: ${accuracy}%`}
            >
              <motion.div
                className="h-full"
                style={{ background: colors.successColor }}
                initial={{ width: 0 }}
                animate={{ width: `${accuracy}%` }}
                transition={{ duration: 1, delay: 0.3 }}
              />
            </div>
          </div>

          {/* Streak Status */}
          {sessionData.streakContinued && (
            <div 
              className="rounded-lg p-3 flex items-center gap-3"
              style={{ background: colors.warningBg }}
            >
              <Flame className="w-6 h-6 flex-shrink-0" style={{ color: colors.warningColor }} aria-hidden="true" />
              <div className="flex-1 min-w-0">
                <div className="font-semibold text-sm" style={{ color: colors.textPrimary }}>
                  {sessionData.currentStreak} Day Streak!
                </div>
                <div className="text-xs" style={{ color: colors.textSecondary }}>
                  You're on fire! Keep it going tomorrow.
                </div>
              </div>
            </div>
          )}
        </motion.div>

        {/* Accuracy by Category */}
        {sessionData.accuracyByCategory.length > 0 && (
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
            transition={{ delay: 0.2 }}
          >
            <div className="flex items-center gap-2 mb-4">
              <Target className="w-5 h-5" style={{ color: colors.iconColor }} aria-hidden="true" />
              <h3 className="text-lg font-semibold" style={{ color: colors.textPrimary }}>
                Accuracy by Category
              </h3>
            </div>

            <div className="space-y-3">
              {sessionData.accuracyByCategory.map((category, index) => {
                const categoryAccuracy = Math.round((category.correct / category.total) * 100);
                return (
                  <motion.div
                    key={category.category}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 + index * 0.1 }}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium" style={{ color: colors.textPrimary }}>
                        {category.category}
                      </span>
                      <span className="text-sm" style={{ color: colors.textSecondary }}>
                        {category.correct}/{category.total} ({categoryAccuracy}%)
                      </span>
                    </div>
                    <div 
                      className="h-2 rounded-full overflow-hidden"
                      style={{ background: colors.cardHover }}
                      role="progressbar"
                      aria-valuenow={categoryAccuracy}
                      aria-valuemin={0}
                      aria-valuemax={100}
                      aria-label={`${category.category} accuracy: ${categoryAccuracy}%`}
                    >
                      <div
                        className="h-full transition-all"
                        style={{ 
                          background: categoryAccuracy >= 80 ? colors.successColor : categoryAccuracy >= 60 ? colors.iconColor : colors.warningColor,
                          width: `${categoryAccuracy}%`,
                        }}
                      />
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        )}

        {/* New Vocabulary Learned */}
        {sessionData.newVocabulary.length > 0 && (
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
            transition={{ delay: 0.3 }}
          >
            <div className="flex items-center gap-2 mb-4">
              <Star className="w-5 h-5" style={{ color: colors.iconColor }} aria-hidden="true" />
              <h3 className="text-lg font-semibold" style={{ color: colors.textPrimary }}>
                New Vocabulary Learned
              </h3>
            </div>

            <div className="space-y-2">
              {sessionData.newVocabulary.map((vocab, index) => (
                <motion.div
                  key={vocab.sign}
                  className="rounded-lg p-3"
                  style={{ background: colors.successBg }}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 + index * 0.05 }}
                >
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: colors.successColor }} aria-hidden="true" />
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold text-sm mb-1" style={{ color: colors.textPrimary }}>
                        {vocab.sign}
                      </div>
                      <div className="text-xs mb-1" style={{ color: colors.textSecondary }}>
                        {vocab.meaning}
                      </div>
                      <div 
                        className="inline-block px-2 py-0.5 rounded-full text-xs"
                        style={{ 
                          background: colors.iconBg,
                          color: colors.iconColor,
                        }}
                      >
                        {vocab.category}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Mistakes Review */}
        {sessionData.mistakes.length > 0 && (
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
              <TrendingUp className="w-5 h-5" style={{ color: colors.warningColor }} aria-hidden="true" />
              <h3 className="text-lg font-semibold" style={{ color: colors.textPrimary }}>
                Areas for Improvement
              </h3>
            </div>

            <div className="space-y-3">
              {sessionData.mistakes.map((mistake, index) => (
                <motion.div
                  key={mistake.sign}
                  className="rounded-lg p-4"
                  style={{ background: colors.errorBg }}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 + index * 0.1 }}
                >
                  <div className="flex items-start gap-3 mb-3">
                    <XCircle className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: colors.errorColor }} aria-hidden="true" />
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold mb-1" style={{ color: colors.textPrimary }}>
                        {mistake.sign}
                      </div>
                      <div className="text-sm mb-2" style={{ color: colors.textSecondary }}>
                        Your attempt: <span className="font-medium">{mistake.userAttempt}</span>
                      </div>
                    </div>
                  </div>

                  <div 
                    className="rounded-lg p-3 mb-3"
                    style={{ background: colors.cardBg }}
                  >
                    <div className="text-xs font-semibold mb-1" style={{ color: colors.successColor }}>
                      ✓ Correct Form
                    </div>
                    <div className="text-sm font-medium" style={{ color: colors.textPrimary }}>
                      {mistake.correctForm}
                    </div>
                  </div>

                  <div 
                    className="rounded-lg p-3"
                    style={{ background: colors.iconBg }}
                  >
                    <div className="text-xs font-semibold mb-1" style={{ color: colors.iconColor }}>
                      💡 Tip for Correction
                    </div>
                    <div className="text-sm" style={{ color: colors.textPrimary }}>
                      {mistake.tipForCorrection}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Next Recommended Practice */}
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
            <ChevronRight className="w-5 h-5" style={{ color: colors.iconColor }} aria-hidden="true" />
            <h3 className="text-lg font-semibold" style={{ color: colors.textPrimary }}>
              Next Recommended Practice
            </h3>
          </div>

          <div 
            className="rounded-lg p-4"
            style={{ background: colors.accentBg }}
          >
            <div className="flex items-start gap-3 mb-3">
              <div 
                className="w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0"
                style={{ background: colors.accentColor }}
                aria-hidden="true"
              >
                <BookOpen className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-semibold mb-1" style={{ color: colors.textPrimary }}>
                  {recommendation.title}
                </h4>
                <p className="text-sm mb-2" style={{ color: colors.textSecondary }}>
                  {recommendation.description}
                </p>
                <div className="flex items-center gap-2 text-xs" style={{ color: colors.textTertiary }}>
                  <Clock className="w-3 h-3" aria-hidden="true" />
                  <span>{recommendation.duration}</span>
                </div>
              </div>
            </div>

            <Button
              className="w-full h-10 rounded-full font-semibold"
              style={{
                background: colors.iconColor,
                color: theme === 'dark' ? 'var(--color-bg-deep)' : '#FFFFFF',
              }}
              aria-label={`Start ${recommendation.title}`}
            >
              Start Practice
            </Button>
          </div>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          className="space-y-3"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <Button
            onClick={() => setShowAddToJournal(true)}
            className="w-full h-12 rounded-full font-semibold flex items-center justify-center gap-2"
            style={{
              background: colors.cardBg,
              color: colors.textPrimary,
              border: colors.glassBorder,
            }}
            onMouseEnter={(e) => e.currentTarget.style.background = colors.cardHover}
            onMouseLeave={(e) => e.currentTarget.style.background = colors.cardBg}
            aria-label="Add session to journal"
          >
            <BookOpen className="w-5 h-5" aria-hidden="true" />
            Add to Journal
          </Button>

          <Button
            onClick={onExit}
            className="w-full h-12 rounded-full font-semibold"
            style={{
              background: colors.iconColor,
              color: theme === 'dark' ? 'var(--color-bg-deep)' : '#FFFFFF',
            }}
            aria-label="Continue to home"
          >
            Continue
          </Button>
        </motion.div>
      </div>

      {/* Add to Journal Modal */}
      {showAddToJournal && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: 'rgba(0, 0, 0, 0.8)' }}
          onClick={() => setShowAddToJournal(false)}
          role="dialog"
          aria-labelledby="journal-modal-title"
          aria-modal="true"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="w-full max-w-md rounded-2xl p-6"
            style={{ background: colors.cardBg }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 id="journal-modal-title" className="text-lg font-semibold" style={{ color: colors.textPrimary }}>
                Add to Journal
              </h3>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowAddToJournal(false)}
                style={{ color: colors.textSecondary }}
                aria-label="Close journal entry"
              >
                <X className="w-5 h-5" />
              </Button>
            </div>

            <div className="mb-4">
              <label className="text-sm font-semibold mb-2 block" style={{ color: colors.textPrimary }}>
                How did this session feel?
              </label>
              <div className="grid grid-cols-4 gap-2">
                {[
                  { value: 'excellent', emoji: '😄', label: 'Excellent' },
                  { value: 'good', emoji: '😊', label: 'Good' },
                  { value: 'okay', emoji: '😐', label: 'Okay' },
                  { value: 'challenging', emoji: '😓', label: 'Hard' },
                ].map((mood) => (
                  <button
                    key={mood.value}
                    onClick={() => setJournalMood(mood.value as any)}
                    className="rounded-lg p-3 text-center transition-all"
                    style={{
                      background: journalMood === mood.value ? colors.iconBg : colors.cardHover,
                      border: journalMood === mood.value ? `2px solid ${colors.iconColor}` : 'none',
                    }}
                    aria-label={mood.label}
                    aria-pressed={journalMood === mood.value}
                  >
                    <div className="text-2xl mb-1">{mood.emoji}</div>
                    <div className="text-xs" style={{ color: colors.textSecondary }}>
                      {mood.label}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div className="mb-4">
              <label 
                htmlFor="journal-note"
                className="text-sm font-semibold mb-2 block" 
                style={{ color: colors.textPrimary }}
              >
                Notes (Optional)
              </label>
              <textarea
                id="journal-note"
                value={journalNote}
                onChange={(e) => setJournalNote(e.target.value)}
                placeholder="What did you learn? What was challenging?"
                className="w-full rounded-lg p-3 text-sm resize-none"
                rows={4}
                style={{
                  background: colors.cardHover,
                  color: colors.textPrimary,
                  border: colors.glassBorder,
                }}
                aria-label="Journal notes"
              />
            </div>

            <div 
              className="rounded-lg p-3 mb-4 text-sm"
              style={{ background: colors.iconBg }}
            >
              <div className="flex items-start gap-2">
                <Calendar className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: colors.iconColor }} aria-hidden="true" />
                <div>
                  <div className="font-semibold mb-1" style={{ color: colors.textPrimary }}>
                    Session Stats
                  </div>
                  <div style={{ color: colors.textSecondary }}>
                    {accuracy}% accuracy • {sessionData.newVocabulary.length} new signs • {formatTime(sessionData.timeSpent)}
                  </div>
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <Button
                onClick={() => setShowAddToJournal(false)}
                className="flex-1 h-10 rounded-full font-semibold"
                style={{
                  background: colors.cardHover,
                  color: colors.textPrimary,
                }}
                aria-label="Cancel journal entry"
              >
                Cancel
              </Button>
              <Button
                onClick={handleAddToJournal}
                className="flex-1 h-10 rounded-full font-semibold"
                style={{
                  background: colors.iconColor,
                  color: theme === 'dark' ? 'var(--color-bg-deep)' : '#FFFFFF',
                }}
                aria-label="Save journal entry"
              >
                Save to Journal
              </Button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}
