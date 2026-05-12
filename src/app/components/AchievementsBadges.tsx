import { useState } from 'react';
import { Button } from './ui/button';
import { useTheme } from '../context/ThemeContext';
import { useApp } from '../context/AppContext';
import { motion, AnimatePresence } from 'motion/react';
import { X, Trophy, Star, Flame, Target, Users, Calendar, Award, Zap, Crown, Heart, Brain, TrendingUp, Share2, Lock, ChevronRight, CheckCircle, Clock } from 'lucide-react';

interface AchievementsBadgesProps {
  onExit: () => void;
}

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  category: string;
  progress: number;
  total: number;
  unlocked: boolean;
  unlockedDate?: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  points: number;
  requirement: string;
  isSpecialEvent?: boolean;
}

// Real achievements data
const achievements: Achievement[] = [
  // Learning Milestones
  {
    id: 'first-sign',
    title: 'First Steps',
    description: 'Learn your first sign',
    icon: 'star',
    category: 'Learning Milestones',
    progress: 1,
    total: 1,
    unlocked: true,
    unlockedDate: '2025-01-05',
    rarity: 'common',
    points: 10,
    requirement: 'Complete 1 sign',
  },
  {
    id: 'sign-10',
    title: 'Getting Started',
    description: 'Learn 10 signs',
    icon: 'target',
    category: 'Learning Milestones',
    progress: 10,
    total: 10,
    unlocked: true,
    unlockedDate: '2025-01-06',
    rarity: 'common',
    points: 25,
    requirement: 'Complete 10 signs',
  },
  {
    id: 'sign-50',
    title: 'Sign Apprentice',
    description: 'Learn 50 signs',
    icon: 'award',
    category: 'Learning Milestones',
    progress: 50,
    total: 50,
    unlocked: true,
    unlockedDate: '2025-01-08',
    rarity: 'rare',
    points: 50,
    requirement: 'Complete 50 signs',
  },
  {
    id: 'sign-100',
    title: 'Sign Expert',
    description: 'Learn 100 signs',
    icon: 'trophy',
    category: 'Learning Milestones',
    progress: 100,
    total: 100,
    unlocked: true,
    unlockedDate: '2025-01-10',
    rarity: 'rare',
    points: 100,
    requirement: 'Complete 100 signs',
  },
  {
    id: 'sign-250',
    title: 'Sign Master',
    description: 'Learn 250 signs',
    icon: 'crown',
    category: 'Learning Milestones',
    progress: 250,
    total: 250,
    unlocked: true,
    unlockedDate: '2025-01-11',
    rarity: 'epic',
    points: 250,
    requirement: 'Complete 250 signs',
  },
  {
    id: 'sign-500',
    title: 'Sign Legend',
    description: 'Learn 500 signs',
    icon: 'star',
    category: 'Learning Milestones',
    progress: 342,
    total: 500,
    unlocked: false,
    rarity: 'legendary',
    points: 500,
    requirement: 'Complete 500 signs',
  },

  // Streak Achievements
  {
    id: 'streak-3',
    title: 'On Fire',
    description: '3-day learning streak',
    icon: 'flame',
    category: 'Streak',
    progress: 3,
    total: 3,
    unlocked: true,
    unlockedDate: '2025-01-07',
    rarity: 'common',
    points: 15,
    requirement: 'Practice for 3 days in a row',
  },
  {
    id: 'streak-7',
    title: 'Week Warrior',
    description: '7-day learning streak',
    icon: 'flame',
    category: 'Streak',
    progress: 7,
    total: 7,
    unlocked: true,
    unlockedDate: '2025-01-09',
    rarity: 'common',
    points: 30,
    requirement: 'Practice for 7 days in a row',
  },
  {
    id: 'streak-14',
    title: 'Fortnight Champion',
    description: '14-day learning streak',
    icon: 'flame',
    category: 'Streak',
    progress: 14,
    total: 14,
    unlocked: true,
    unlockedDate: '2025-01-10',
    rarity: 'rare',
    points: 60,
    requirement: 'Practice for 14 days in a row',
  },
  {
    id: 'streak-30',
    title: 'Monthly Master',
    description: '30-day learning streak',
    icon: 'flame',
    category: 'Streak',
    progress: 30,
    total: 30,
    unlocked: true,
    unlockedDate: '2025-01-11',
    rarity: 'epic',
    points: 120,
    requirement: 'Practice for 30 days in a row',
  },
  {
    id: 'streak-100',
    title: 'Century Streak',
    description: '100-day learning streak',
    icon: 'flame',
    category: 'Streak',
    progress: 45,
    total: 100,
    unlocked: false,
    rarity: 'legendary',
    points: 500,
    requirement: 'Practice for 100 days in a row',
  },

  // Accuracy Achievements
  {
    id: 'accuracy-80',
    title: 'Precise Signer',
    description: 'Achieve 80% accuracy',
    icon: 'target',
    category: 'Accuracy',
    progress: 89,
    total: 80,
    unlocked: true,
    unlockedDate: '2025-01-08',
    rarity: 'common',
    points: 40,
    requirement: 'Reach 80% overall accuracy',
  },
  {
    id: 'accuracy-90',
    title: 'Expert Signer',
    description: 'Achieve 90% accuracy',
    icon: 'zap',
    category: 'Accuracy',
    progress: 89,
    total: 90,
    unlocked: false,
    rarity: 'rare',
    points: 80,
    requirement: 'Reach 90% overall accuracy',
  },
  {
    id: 'accuracy-95',
    title: 'Perfect Form',
    description: 'Achieve 95% accuracy',
    icon: 'star',
    category: 'Accuracy',
    progress: 89,
    total: 95,
    unlocked: false,
    rarity: 'epic',
    points: 150,
    requirement: 'Reach 95% overall accuracy',
  },
  {
    id: 'perfect-lesson',
    title: 'Flawless Victory',
    description: 'Complete a lesson with 100% accuracy',
    icon: 'trophy',
    category: 'Accuracy',
    progress: 1,
    total: 1,
    unlocked: true,
    unlockedDate: '2025-01-09',
    rarity: 'rare',
    points: 75,
    requirement: 'Get 100% on any lesson',
  },

  // Social Achievements
  {
    id: 'first-friend',
    title: 'Making Friends',
    description: 'Add your first practice partner',
    icon: 'users',
    category: 'Social',
    progress: 1,
    total: 1,
    unlocked: true,
    unlockedDate: '2025-01-07',
    rarity: 'common',
    points: 20,
    requirement: 'Add 1 friend',
  },
  {
    id: 'friends-10',
    title: 'Social Butterfly',
    description: 'Add 10 practice partners',
    icon: 'users',
    category: 'Social',
    progress: 10,
    total: 10,
    unlocked: true,
    unlockedDate: '2025-01-10',
    rarity: 'rare',
    points: 50,
    requirement: 'Add 10 friends',
  },
  {
    id: 'practice-room',
    title: 'Team Player',
    description: 'Join 5 social practice rooms',
    icon: 'users',
    category: 'Social',
    progress: 5,
    total: 5,
    unlocked: true,
    unlockedDate: '2025-01-11',
    rarity: 'common',
    points: 30,
    requirement: 'Join 5 practice rooms',
  },
  {
    id: 'share-progress',
    title: 'Show and Tell',
    description: 'Share your progress on social media',
    icon: 'share',
    category: 'Social',
    progress: 1,
    total: 1,
    unlocked: true,
    unlockedDate: '2025-01-08',
    rarity: 'common',
    points: 15,
    requirement: 'Share progress once',
  },

  // Speed Achievements
  {
    id: 'speed-demon',
    title: 'Speed Demon',
    description: 'Complete 50 signs in one day',
    icon: 'zap',
    category: 'Speed',
    progress: 42,
    total: 50,
    unlocked: false,
    rarity: 'rare',
    points: 100,
    requirement: 'Complete 50 signs in 24 hours',
  },
  {
    id: 'quick-learner',
    title: 'Quick Learner',
    description: 'Complete a lesson in under 5 minutes',
    icon: 'clock',
    category: 'Speed',
    progress: 1,
    total: 1,
    unlocked: true,
    unlockedDate: '2025-01-09',
    rarity: 'common',
    points: 25,
    requirement: 'Finish any lesson under 5 minutes',
  },

  // Special Event Achievements
  {
    id: 'winter-2025',
    title: 'Winter Learner 2025',
    description: 'Participated in Winter Learning Event',
    icon: 'star',
    category: 'Special Events',
    progress: 1,
    total: 1,
    unlocked: true,
    unlockedDate: '2025-01-12',
    rarity: 'legendary',
    points: 200,
    requirement: 'Complete Winter 2025 event',
    isSpecialEvent: true,
  },
  {
    id: 'deaf-awareness',
    title: 'Deaf Awareness Champion',
    description: 'Completed Deaf Awareness Week challenge',
    icon: 'heart',
    category: 'Special Events',
    progress: 1,
    total: 1,
    unlocked: true,
    unlockedDate: '2025-01-10',
    rarity: 'epic',
    points: 150,
    requirement: 'Complete Deaf Awareness event',
    isSpecialEvent: true,
  },
  {
    id: 'early-adopter',
    title: 'Early Adopter',
    description: 'Joined Sign Learn AR in its first year',
    icon: 'crown',
    category: 'Special Events',
    progress: 1,
    total: 1,
    unlocked: true,
    unlockedDate: '2025-01-05',
    rarity: 'legendary',
    points: 300,
    requirement: 'Join during 2025',
    isSpecialEvent: true,
  },

  // Completion Achievements
  {
    id: 'category-master',
    title: 'Category Master',
    description: 'Complete all lessons in one category',
    icon: 'award',
    category: 'Completion',
    progress: 2,
    total: 1,
    unlocked: true,
    unlockedDate: '2025-01-11',
    rarity: 'epic',
    points: 175,
    requirement: 'Complete any category 100%',
  },
  {
    id: 'certification',
    title: 'Certified Signer',
    description: 'Pass your first certification exam',
    icon: 'trophy',
    category: 'Completion',
    progress: 1,
    total: 1,
    unlocked: true,
    unlockedDate: '2025-01-12',
    rarity: 'epic',
    points: 200,
    requirement: 'Pass 1 certification',
  },
];

type Category = 'all' | 'Learning Milestones' | 'Streak' | 'Accuracy' | 'Social' | 'Speed' | 'Special Events' | 'Completion';

export function AchievementsBadges({ onExit }: AchievementsBadgesProps) {
  const { theme } = useTheme();
  const { userProgress } = useApp();
  const [selectedCategory, setSelectedCategory] = useState<Category>('all');
  const [selectedAchievement, setSelectedAchievement] = useState<Achievement | null>(null);
  const [showShareMenu, setShowShareMenu] = useState(false);
  const [shareAchievement, setShareAchievement] = useState<Achievement | null>(null);

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
        common: 'var(--color-text-muted)',
        rare: '#3B82F6',
        epic: 'var(--color-purple)',
        legendary: '#F59E0B',
        locked: '#475569',
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
        common: '#64748B',
        rare: '#3B82F6',
        epic: 'var(--color-purple)',
        legendary: '#F59E0B',
        locked: 'var(--color-text-muted)',
        blur: 'blur(20px)',
        shadow: '0 8px 32px rgba(31, 38, 135, 0.15)',
        glassBorder: '1px solid rgba(255, 255, 255, 0.6)',
      };

  const categories: Category[] = ['all', 'Learning Milestones', 'Streak', 'Accuracy', 'Social', 'Speed', 'Special Events', 'Completion'];

  const filteredAchievements = selectedCategory === 'all' 
    ? achievements 
    : achievements.filter(a => a.category === selectedCategory);

  const unlockedCount = achievements.filter(a => a.unlocked).length;
  const totalPoints = achievements.filter(a => a.unlocked).reduce((sum, a) => sum + a.points, 0);
  const totalPossiblePoints = achievements.reduce((sum, a) => sum + a.points, 0);

  const getRarityColor = (rarity: Achievement['rarity']) => {
    switch (rarity) {
      case 'common': return colors.common;
      case 'rare': return colors.rare;
      case 'epic': return colors.epic;
      case 'legendary': return colors.legendary;
    }
  };

  const getIconComponent = (icon: string) => {
    const iconMap: { [key: string]: any } = {
      star: Star,
      target: Target,
      trophy: Trophy,
      flame: Flame,
      crown: Crown,
      award: Award,
      users: Users,
      zap: Zap,
      heart: Heart,
      brain: Brain,
      share: Share2,
      clock: Clock,
    };
    return iconMap[icon] || Trophy;
  };

  const handleShare = (achievement: Achievement) => {
    setShareAchievement(achievement);
    setShowShareMenu(true);
  };

  const shareToSocial = (platform: string) => {
    const text = `🏆 I just unlocked "${shareAchievement?.title}" in Sign Learn AR! ${shareAchievement?.description}`;
    
    // In a real app, this would open native share dialogs
    
    setShowShareMenu(false);
    setShareAchievement(null);
  };

  return (
    <div 
      className="h-full flex flex-col"
      style={{ background: colors.bg, color: colors.textPrimary }}
      role="main"
      aria-labelledby="achievements-title"
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
              id="achievements-title" 
              className="text-xl sm:text-2xl font-bold"
              style={{ fontFamily: 'Poppins, sans-serif' }}
            >
              Achievements
            </h1>
            <p className="text-sm" style={{ color: colors.textSecondary }}>
              {unlockedCount} of {achievements.length} unlocked
            </p>
          </div>
        </div>

        {/* Trophy Case Summary */}
        <div className="grid grid-cols-3 gap-3 mb-4">
          <div 
            className="rounded-xl p-3 text-center"
            style={{
              background: colors.cardBg,
              backdropFilter: colors.blur,
              WebkitBackdropFilter: colors.blur,
              border: colors.glassBorder,
              boxShadow: colors.shadow,
            }}
          >
            <div className="text-2xl font-bold mb-1" style={{ color: colors.textPrimary }}>
              {unlockedCount}
            </div>
            <div className="text-xs" style={{ color: colors.textSecondary }}>
              Unlocked
            </div>
          </div>
          <div 
            className="rounded-xl p-3 text-center"
            style={{
              background: colors.cardBg,
              backdropFilter: colors.blur,
              WebkitBackdropFilter: colors.blur,
              border: colors.glassBorder,
              boxShadow: colors.shadow,
            }}
          >
            <div className="text-2xl font-bold mb-1" style={{ color: colors.textPrimary }}>
              {totalPoints}
            </div>
            <div className="text-xs" style={{ color: colors.textSecondary }}>
              Points
            </div>
          </div>
          <div 
            className="rounded-xl p-3 text-center"
            style={{
              background: colors.cardBg,
              backdropFilter: colors.blur,
              WebkitBackdropFilter: colors.blur,
              border: colors.glassBorder,
              boxShadow: colors.shadow,
            }}
          >
            <div className="text-2xl font-bold mb-1" style={{ color: colors.textPrimary }}>
              {Math.round((unlockedCount / achievements.length) * 100)}%
            </div>
            <div className="text-xs" style={{ color: colors.textSecondary }}>
              Complete
            </div>
          </div>
        </div>

        {/* Category Filter */}
        <div className="flex gap-2 overflow-x-auto pb-2 -mx-4 px-4 sm:-mx-6 sm:px-6" role="tablist" aria-label="Achievement categories">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className="px-3 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all"
              style={{
                background: selectedCategory === category ? colors.iconColor : colors.cardBg,
                color: selectedCategory === category 
                  ? (theme === 'dark' ? 'var(--color-bg-deep)' : '#FFFFFF')
                  : colors.textPrimary,
                border: colors.glassBorder,
              }}
              role="tab"
              aria-selected={selectedCategory === category}
              aria-controls={`${category}-panel`}
            >
              {category === 'all' ? 'All' : category}
            </button>
          ))}
        </div>
      </div>

      {/* Achievements Grid */}
      <div 
        className="flex-1 overflow-y-auto p-4 sm:p-6"
        role="tabpanel"
        id={`${selectedCategory}-panel`}
      >
        <div className="grid grid-cols-1 gap-3">
          {filteredAchievements.map((achievement, index) => {
            const Icon = getIconComponent(achievement.icon);
            const rarityColor = getRarityColor(achievement.rarity);
            const progressPercent = Math.min((achievement.progress / achievement.total) * 100, 100);

            return (
              <motion.button
                key={achievement.id}
                onClick={() => setSelectedAchievement(achievement)}
                className="rounded-xl p-4 text-left transition-colors"
                style={{
                  background: achievement.unlocked ? colors.cardBg : `${colors.cardBg}80`,
                  backdropFilter: colors.blur,
                  WebkitBackdropFilter: colors.blur,
                  border: achievement.unlocked 
                    ? `2px solid ${rarityColor}`
                    : colors.glassBorder,
                  boxShadow: colors.shadow,
                  opacity: achievement.unlocked ? 1 : 0.7,
                }}
                onMouseEnter={(e) => e.currentTarget.style.background = colors.cardHover}
                onMouseLeave={(e) => e.currentTarget.style.background = achievement.unlocked ? colors.cardBg : `${colors.cardBg}80`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.03 }}
                aria-label={`${achievement.title}, ${achievement.description}, ${achievement.unlocked ? 'Unlocked' : `${progressPercent.toFixed(0)}% progress`}`}
              >
                <div className="flex items-start gap-3">
                  {/* Icon */}
                  <div 
                    className="w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0 relative"
                    style={{ 
                      background: achievement.unlocked 
                        ? `linear-gradient(135deg, ${rarityColor}, ${rarityColor}dd)`
                        : colors.cardHover,
                    }}
                    aria-hidden="true"
                  >
                    {achievement.unlocked ? (
                      <Icon 
                        className="w-7 h-7" 
                        style={{ color: theme === 'dark' ? 'var(--color-bg-deep)' : '#FFFFFF' }} 
                      />
                    ) : (
                      <Lock className="w-6 h-6" style={{ color: colors.locked }} />
                    )}
                    {achievement.isSpecialEvent && achievement.unlocked && (
                      <div 
                        className="absolute -top-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center"
                        style={{ background: colors.legendary }}
                      >
                        <Star className="w-3 h-3 text-white" />
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold text-base" style={{ color: colors.textPrimary }}>
                        {achievement.title}
                      </h3>
                      <span 
                        className="px-2 py-0.5 rounded-full text-xs font-semibold capitalize"
                        style={{ 
                          background: `${rarityColor}20`,
                          color: rarityColor,
                        }}
                      >
                        {achievement.rarity}
                      </span>
                    </div>
                    <p className="text-sm mb-2" style={{ color: colors.textSecondary }}>
                      {achievement.description}
                    </p>

                    {/* Progress Bar */}
                    {!achievement.unlocked && (
                      <div className="mb-2">
                        <div className="flex items-center justify-between mb-1 text-xs">
                          <span style={{ color: colors.textTertiary }}>
                            {achievement.progress} / {achievement.total}
                          </span>
                          <span className="font-semibold" style={{ color: rarityColor }}>
                            {progressPercent.toFixed(0)}%
                          </span>
                        </div>
                        <div 
                          className="h-2 rounded-full overflow-hidden"
                          style={{ background: colors.cardHover }}
                          role="progressbar"
                          aria-valuenow={progressPercent}
                          aria-valuemin={0}
                          aria-valuemax={100}
                        >
                          <div
                            className="h-full transition-all duration-500"
                            style={{ 
                              background: rarityColor,
                              width: `${progressPercent}%`,
                            }}
                          />
                        </div>
                      </div>
                    )}

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3 text-xs" style={{ color: colors.textTertiary }}>
                        <span className="flex items-center gap-1">
                          <Award className="w-3 h-3" aria-hidden="true" />
                          {achievement.points} pts
                        </span>
                        {achievement.unlocked && achievement.unlockedDate && (
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" aria-hidden="true" />
                            {new Date(achievement.unlockedDate).toLocaleDateString()}
                          </span>
                        )}
                      </div>
                      {achievement.unlocked && (
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleShare(achievement);
                          }}
                          className="w-8 h-8 rounded-full"
                          style={{ color: colors.iconColor }}
                          aria-label={`Share ${achievement.title}`}
                        >
                          <Share2 className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  </div>

                  <ChevronRight 
                    className="w-5 h-5 flex-shrink-0" 
                    style={{ color: colors.textTertiary }} 
                    aria-hidden="true" 
                  />
                </div>
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* Achievement Detail Modal */}
      <AnimatePresence>
        {selectedAchievement && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{ background: 'rgba(0, 0, 0, 0.8)' }}
            onClick={() => setSelectedAchievement(null)}
            role="dialog"
            aria-labelledby="achievement-modal-title"
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
                style={{ 
                  background: `linear-gradient(135deg, ${getRarityColor(selectedAchievement.rarity)}, ${getRarityColor(selectedAchievement.rarity)}dd)`,
                }}
              >
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setSelectedAchievement(null)}
                  className="absolute top-4 right-4"
                  style={{ color: '#FFFFFF' }}
                  aria-label="Close achievement details"
                >
                  <X className="w-6 h-6" />
                </Button>

                <div className="text-center">
                  <div 
                    className="w-24 h-24 rounded-2xl flex items-center justify-center mx-auto mb-4 relative"
                    style={{ background: 'rgba(255, 255, 255, 0.2)' }}
                    aria-hidden="true"
                  >
                    {selectedAchievement.unlocked ? (
                      <>
                        {(() => {
                          const Icon = getIconComponent(selectedAchievement.icon);
                          return <Icon className="w-12 h-12 text-white" />;
                        })()}
                        {selectedAchievement.isSpecialEvent && (
                          <div 
                            className="absolute -top-2 -right-2 w-8 h-8 rounded-full flex items-center justify-center"
                            style={{ background: colors.legendary }}
                          >
                            <Star className="w-5 h-5 text-white" />
                          </div>
                        )}
                      </>
                    ) : (
                      <Lock className="w-12 h-12 text-white opacity-50" />
                    )}
                  </div>
                  <div 
                    className="px-3 py-1 rounded-full text-xs font-semibold capitalize inline-block mb-2"
                    style={{ background: 'rgba(255, 255, 255, 0.2)', color: '#FFFFFF' }}
                  >
                    {selectedAchievement.rarity}
                  </div>
                  <h2 id="achievement-modal-title" className="text-2xl font-bold mb-2 text-white">
                    {selectedAchievement.title}
                  </h2>
                  <p className="text-sm opacity-90 text-white">
                    {selectedAchievement.description}
                  </p>
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                <div className="space-y-4 mb-6">
                  <div 
                    className="rounded-xl p-4"
                    style={{ background: colors.iconBg }}
                  >
                    <div className="text-sm font-semibold mb-2" style={{ color: colors.textPrimary }}>
                      Requirement
                    </div>
                    <p className="text-sm" style={{ color: colors.textSecondary }}>
                      {selectedAchievement.requirement}
                    </p>
                  </div>

                  {selectedAchievement.unlocked ? (
                    <div 
                      className="rounded-xl p-4"
                      style={{ background: colors.successBg }}
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <CheckCircle className="w-5 h-5" style={{ color: colors.successColor }} aria-hidden="true" />
                        <div className="text-sm font-semibold" style={{ color: colors.textPrimary }}>
                          Unlocked
                        </div>
                      </div>
                      <p className="text-sm" style={{ color: colors.textSecondary }}>
                        {new Date(selectedAchievement.unlockedDate!).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        })}
                      </p>
                    </div>
                  ) : (
                    <div 
                      className="rounded-xl p-4"
                      style={{ background: colors.warningBg }}
                    >
                      <div className="flex items-center gap-2 mb-3">
                        <TrendingUp className="w-5 h-5" style={{ color: colors.warningColor }} aria-hidden="true" />
                        <div className="text-sm font-semibold" style={{ color: colors.textPrimary }}>
                          Progress
                        </div>
                      </div>
                      <div className="mb-2">
                        <div className="flex items-center justify-between mb-1 text-sm">
                          <span style={{ color: colors.textSecondary }}>
                            {selectedAchievement.progress} / {selectedAchievement.total}
                          </span>
                          <span 
                            className="font-semibold"
                            style={{ color: getRarityColor(selectedAchievement.rarity) }}
                          >
                            {Math.round((selectedAchievement.progress / selectedAchievement.total) * 100)}%
                          </span>
                        </div>
                        <div 
                          className="h-2 rounded-full overflow-hidden"
                          style={{ background: colors.cardHover }}
                          role="progressbar"
                          aria-valuenow={(selectedAchievement.progress / selectedAchievement.total) * 100}
                          aria-valuemin={0}
                          aria-valuemax={100}
                        >
                          <div
                            className="h-full"
                            style={{ 
                              background: getRarityColor(selectedAchievement.rarity),
                              width: `${(selectedAchievement.progress / selectedAchievement.total) * 100}%`,
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  <div 
                    className="rounded-xl p-4"
                    style={{ background: colors.accentBg }}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-semibold" style={{ color: colors.textPrimary }}>
                        Points
                      </span>
                      <span className="text-2xl font-bold" style={{ color: colors.accentColor }}>
                        {selectedAchievement.points}
                      </span>
                    </div>
                  </div>
                </div>

                {selectedAchievement.unlocked && (
                  <Button
                    onClick={() => handleShare(selectedAchievement)}
                    className="w-full h-12 rounded-full font-semibold flex items-center justify-center gap-2"
                    style={{
                      background: colors.iconColor,
                      color: theme === 'dark' ? 'var(--color-bg-deep)' : '#FFFFFF',
                    }}
                    aria-label={`Share ${selectedAchievement.title}`}
                  >
                    <Share2 className="w-5 h-5" aria-hidden="true" />
                    Share Achievement
                  </Button>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Share Menu Modal */}
      <AnimatePresence>
        {showShareMenu && shareAchievement && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{ background: 'rgba(0, 0, 0, 0.8)' }}
            onClick={() => setShowShareMenu(false)}
            role="dialog"
            aria-labelledby="share-modal-title"
            aria-modal="true"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="w-full max-w-sm rounded-2xl p-6"
              style={{ background: colors.cardBg }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 id="share-modal-title" className="text-lg font-semibold" style={{ color: colors.textPrimary }}>
                  Share Achievement
                </h3>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setShowShareMenu(false)}
                  style={{ color: colors.textSecondary }}
                  aria-label="Close share menu"
                >
                  <X className="w-5 h-5" />
                </Button>
              </div>

              <div className="grid grid-cols-3 gap-3">
                {['Twitter', 'Facebook', 'Instagram', 'LinkedIn', 'WhatsApp', 'Copy Link'].map((platform) => (
                  <button
                    key={platform}
                    onClick={() => shareToSocial(platform)}
                    className="rounded-xl p-4 text-center transition-colors"
                    style={{
                      background: colors.iconBg,
                      border: colors.glassBorder,
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.background = colors.cardHover}
                    onMouseLeave={(e) => e.currentTarget.style.background = colors.iconBg}
                    aria-label={`Share to ${platform}`}
                  >
                    <Share2 className="w-6 h-6 mx-auto mb-2" style={{ color: colors.iconColor }} aria-hidden="true" />
                    <div className="text-xs font-medium" style={{ color: colors.textPrimary }}>
                      {platform}
                    </div>
                  </button>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
