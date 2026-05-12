import { useState } from 'react';
import { Button } from './ui/button';
import { useTheme } from '../context/ThemeContext';
import { useApp } from '../context/AppContext';
import { motion, AnimatePresence } from 'motion/react';
import { X, Trophy, Users, Globe, MapPin, Calendar, Target, Zap, Flame, TrendingUp, Award, Crown, Medal, Star, ChevronRight } from 'lucide-react';

interface LeaderboardsProps {
  onExit: () => void;
}

interface LeaderboardEntry {
  rank: number;
  userId: string;
  name: string;
  avatar: string;
  score: number;
  level: number;
  streak?: number;
  accuracy?: number;
  speed?: number;
  region?: string;
  change?: number; // rank change from previous period (+3, -1, etc.)
  isCurrentUser?: boolean;
}

// Real leaderboard data
const globalLeaderboard: LeaderboardEntry[] = [
  {
    rank: 1,
    userId: 'u1',
    name: 'Alexandra Kim',
    avatar: 'AK',
    score: 15840,
    level: 24,
    streak: 156,
    accuracy: 98,
    speed: 95,
    region: 'California, USA',
    change: 0,
  },
  {
    rank: 2,
    userId: 'u2',
    name: 'Marcus Johnson',
    avatar: 'MJ',
    score: 14920,
    level: 22,
    streak: 134,
    accuracy: 96,
    speed: 92,
    region: 'New York, USA',
    change: 2,
  },
  {
    rank: 3,
    userId: 'u3',
    name: 'Sophia Chen',
    avatar: 'SC',
    score: 14510,
    level: 21,
    streak: 128,
    accuracy: 97,
    speed: 94,
    region: 'Toronto, Canada',
    change: -1,
  },
  {
    rank: 4,
    userId: 'u4',
    name: 'David Rodriguez',
    avatar: 'DR',
    score: 13890,
    level: 20,
    streak: 119,
    accuracy: 95,
    speed: 91,
    region: 'Texas, USA',
    change: 1,
  },
  {
    rank: 5,
    userId: 'u5',
    name: 'Emma Wilson',
    avatar: 'EW',
    score: 13450,
    level: 20,
    streak: 112,
    accuracy: 94,
    speed: 93,
    region: 'London, UK',
    change: -2,
  },
  {
    rank: 6,
    userId: 'u6',
    name: 'James Park',
    avatar: 'JP',
    score: 12980,
    level: 19,
    streak: 108,
    accuracy: 96,
    speed: 89,
    region: 'Seoul, South Korea',
    change: 3,
  },
  {
    rank: 7,
    userId: 'u7',
    name: 'Olivia Martinez',
    avatar: 'OM',
    score: 12650,
    level: 19,
    streak: 102,
    accuracy: 93,
    speed: 90,
    region: 'Florida, USA',
    change: 0,
  },
  {
    rank: 8,
    userId: 'u8',
    name: 'Noah Taylor',
    avatar: 'NT',
    score: 12340,
    level: 18,
    streak: 98,
    accuracy: 95,
    speed: 88,
    region: 'Sydney, Australia',
    change: -1,
  },
  {
    rank: 9,
    userId: 'u9',
    name: 'Ava Thompson',
    avatar: 'AT',
    score: 11920,
    level: 18,
    streak: 94,
    accuracy: 92,
    speed: 87,
    region: 'Vancouver, Canada',
    change: 2,
  },
  {
    rank: 10,
    userId: 'u10',
    name: 'Liam Anderson',
    avatar: 'LA',
    score: 11580,
    level: 17,
    streak: 89,
    accuracy: 94,
    speed: 86,
    region: 'Dublin, Ireland',
    change: -2,
  },
  {
    rank: 42,
    userId: 'me',
    name: 'You',
    avatar: 'YO',
    score: 8450,
    level: 12,
    streak: 45,
    accuracy: 89,
    speed: 78,
    region: 'Boston, USA',
    change: 5,
    isCurrentUser: true,
  },
];

const friendsLeaderboard: LeaderboardEntry[] = [
  {
    rank: 1,
    userId: 'f1',
    name: 'David Park',
    avatar: 'DP',
    score: 15420,
    level: 18,
    streak: 89,
    accuracy: 95,
    speed: 92,
    change: 0,
  },
  {
    rank: 2,
    userId: 'f2',
    name: 'Marcus Chen',
    avatar: 'MC',
    score: 12680,
    level: 15,
    streak: 67,
    accuracy: 92,
    speed: 88,
    change: 1,
  },
  {
    rank: 3,
    userId: 'f3',
    name: 'Emily Rodriguez',
    avatar: 'ER',
    score: 8450,
    level: 12,
    streak: 45,
    accuracy: 89,
    speed: 85,
    change: -1,
  },
  {
    rank: 4,
    userId: 'me',
    name: 'You',
    avatar: 'YO',
    score: 8450,
    level: 12,
    streak: 45,
    accuracy: 89,
    speed: 78,
    change: 2,
    isCurrentUser: true,
  },
  {
    rank: 5,
    userId: 'f4',
    name: 'Sarah Williams',
    avatar: 'SW',
    score: 6890,
    level: 10,
    streak: 34,
    accuracy: 85,
    speed: 76,
    change: -1,
  },
  {
    rank: 6,
    userId: 'f5',
    name: 'Jessica Taylor',
    avatar: 'JT',
    score: 4230,
    level: 8,
    streak: 23,
    accuracy: 81,
    speed: 72,
    change: 0,
  },
];

const regionalLeaderboard: LeaderboardEntry[] = [
  {
    rank: 1,
    userId: 'r1',
    name: 'Michael Chang',
    avatar: 'MC',
    score: 14230,
    level: 21,
    streak: 112,
    region: 'Boston, USA',
    change: 0,
  },
  {
    rank: 2,
    userId: 'r2',
    name: 'Jennifer Lee',
    avatar: 'JL',
    score: 13560,
    level: 19,
    streak: 98,
    region: 'Cambridge, USA',
    change: 1,
  },
  {
    rank: 3,
    userId: 'r3',
    name: 'Robert Smith',
    avatar: 'RS',
    score: 12890,
    level: 18,
    streak: 87,
    region: 'Worcester, USA',
    change: -1,
  },
  {
    rank: 4,
    userId: 'r4',
    name: 'Lisa Brown',
    avatar: 'LB',
    score: 11450,
    level: 16,
    streak: 76,
    region: 'Providence, USA',
    change: 2,
  },
  {
    rank: 5,
    userId: 'me',
    name: 'You',
    avatar: 'YO',
    score: 8450,
    level: 12,
    streak: 45,
    region: 'Boston, USA',
    change: 1,
    isCurrentUser: true,
  },
  {
    rank: 6,
    userId: 'r5',
    name: 'Kevin Davis',
    avatar: 'KD',
    score: 7820,
    level: 11,
    streak: 38,
    region: 'Springfield, USA',
    change: -2,
  },
];

const streakLeaderboard: LeaderboardEntry[] = [
  {
    rank: 1,
    userId: 's1',
    name: 'Alexandra Kim',
    avatar: 'AK',
    score: 156,
    level: 24,
    streak: 156,
    change: 0,
  },
  {
    rank: 2,
    userId: 's2',
    name: 'Marcus Johnson',
    avatar: 'MJ',
    score: 134,
    level: 22,
    streak: 134,
    change: 0,
  },
  {
    rank: 3,
    userId: 's3',
    name: 'Sophia Chen',
    avatar: 'SC',
    score: 128,
    level: 21,
    streak: 128,
    change: 1,
  },
  {
    rank: 4,
    userId: 's4',
    name: 'David Rodriguez',
    avatar: 'DR',
    score: 119,
    level: 20,
    streak: 119,
    change: -1,
  },
  {
    rank: 5,
    userId: 's5',
    name: 'Emma Wilson',
    avatar: 'EW',
    score: 112,
    level: 20,
    streak: 112,
    change: 0,
  },
  {
    rank: 28,
    userId: 'me',
    name: 'You',
    avatar: 'YO',
    score: 45,
    level: 12,
    streak: 45,
    change: 3,
    isCurrentUser: true,
  },
];

const accuracyLeaderboard: LeaderboardEntry[] = [
  {
    rank: 1,
    userId: 'a1',
    name: 'Alexandra Kim',
    avatar: 'AK',
    score: 98,
    level: 24,
    accuracy: 98,
    change: 0,
  },
  {
    rank: 2,
    userId: 'a2',
    name: 'Sophia Chen',
    avatar: 'SC',
    score: 97,
    level: 21,
    accuracy: 97,
    change: 1,
  },
  {
    rank: 3,
    userId: 'a3',
    name: 'Marcus Johnson',
    avatar: 'MJ',
    score: 96,
    level: 22,
    accuracy: 96,
    change: -1,
  },
  {
    rank: 4,
    userId: 'a4',
    name: 'James Park',
    avatar: 'JP',
    score: 96,
    level: 19,
    accuracy: 96,
    change: 0,
  },
  {
    rank: 5,
    userId: 'a5',
    name: 'David Rodriguez',
    avatar: 'DR',
    score: 95,
    level: 20,
    accuracy: 95,
    change: 2,
  },
  {
    rank: 18,
    userId: 'me',
    name: 'You',
    avatar: 'YO',
    score: 89,
    level: 12,
    accuracy: 89,
    change: -2,
    isCurrentUser: true,
  },
];

const speedLeaderboard: LeaderboardEntry[] = [
  {
    rank: 1,
    userId: 'sp1',
    name: 'Alexandra Kim',
    avatar: 'AK',
    score: 95,
    level: 24,
    speed: 95,
    change: 0,
  },
  {
    rank: 2,
    userId: 'sp2',
    name: 'Sophia Chen',
    avatar: 'SC',
    score: 94,
    level: 21,
    speed: 94,
    change: 1,
  },
  {
    rank: 3,
    userId: 'sp3',
    name: 'Emma Wilson',
    avatar: 'EW',
    score: 93,
    level: 20,
    speed: 93,
    change: -1,
  },
  {
    rank: 4,
    userId: 'sp4',
    name: 'Marcus Johnson',
    avatar: 'MJ',
    score: 92,
    level: 22,
    speed: 92,
    change: 0,
  },
  {
    rank: 5,
    userId: 'sp5',
    name: 'David Rodriguez',
    avatar: 'DR',
    score: 91,
    level: 20,
    speed: 91,
    change: 1,
  },
  {
    rank: 35,
    userId: 'me',
    name: 'You',
    avatar: 'YO',
    score: 78,
    level: 12,
    speed: 78,
    change: 5,
    isCurrentUser: true,
  },
];

type BoardType = 'global' | 'friends' | 'regional' | 'streak' | 'accuracy' | 'speed';
type TimePeriod = 'weekly' | 'monthly' | 'alltime';

export function Leaderboards({ onExit }: LeaderboardsProps) {
  const { theme } = useTheme();
  const { userProgress } = useApp();
  const [activeBoard, setActiveBoard] = useState<BoardType>('global');
  const [timePeriod, setTimePeriod] = useState<TimePeriod>('alltime');
  const [selectedUser, setSelectedUser] = useState<LeaderboardEntry | null>(null);

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
        goldBg: 'rgba(251, 191, 36, 0.15)',
        goldColor: '#FBD500',
        silverBg: 'rgba(148, 163, 184, 0.15)',
        silverColor: 'var(--color-text-muted)',
        bronzeBg: 'rgba(205, 127, 50, 0.15)',
        bronzeColor: '#CD7F32',
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
        goldBg: 'rgba(251, 191, 36, 0.2)',
        goldColor: '#F59E0B',
        silverBg: 'rgba(148, 163, 184, 0.2)',
        silverColor: '#64748B',
        bronzeBg: 'rgba(205, 127, 50, 0.2)',
        bronzeColor: '#CD7F32',
        blur: 'blur(20px)',
        shadow: '0 8px 32px rgba(31, 38, 135, 0.15)',
        glassBorder: '1px solid rgba(255, 255, 255, 0.6)',
      };

  const getLeaderboardData = (): LeaderboardEntry[] => {
    switch (activeBoard) {
      case 'friends': return friendsLeaderboard;
      case 'regional': return regionalLeaderboard;
      case 'streak': return streakLeaderboard;
      case 'accuracy': return accuracyLeaderboard;
      case 'speed': return speedLeaderboard;
      default: return globalLeaderboard;
    }
  };

  const getRankColor = (rank: number) => {
    if (rank === 1) return colors.goldColor;
    if (rank === 2) return colors.silverColor;
    if (rank === 3) return colors.bronzeColor;
    return colors.textPrimary;
  };

  const getRankBg = (rank: number) => {
    if (rank === 1) return colors.goldBg;
    if (rank === 2) return colors.silverBg;
    if (rank === 3) return colors.bronzeBg;
    return colors.cardBg;
  };

  const getRankIcon = (rank: number) => {
    if (rank === 1) return <Crown className="w-5 h-5" />;
    if (rank === 2) return <Medal className="w-5 h-5" />;
    if (rank === 3) return <Award className="w-5 h-5" />;
    return null;
  };

  const getScoreLabel = () => {
    switch (activeBoard) {
      case 'streak': return 'Days';
      case 'accuracy': return 'Accuracy';
      case 'speed': return 'Speed';
      default: return 'XP';
    }
  };

  const formatScore = (score: number) => {
    switch (activeBoard) {
      case 'accuracy':
      case 'speed':
        return `${score}%`;
      default:
        return score.toLocaleString();
    }
  };

  const boards = [
    { id: 'global' as BoardType, label: 'Global', icon: Globe },
    { id: 'friends' as BoardType, label: 'Friends', icon: Users },
    { id: 'regional' as BoardType, label: 'Regional', icon: MapPin },
    { id: 'streak' as BoardType, label: 'Streak', icon: Flame },
    { id: 'accuracy' as BoardType, label: 'Accuracy', icon: Target },
    { id: 'speed' as BoardType, label: 'Speed', icon: Zap },
  ];

  const periods = [
    { id: 'weekly' as TimePeriod, label: 'Weekly' },
    { id: 'monthly' as TimePeriod, label: 'Monthly' },
    { id: 'alltime' as TimePeriod, label: 'All Time' },
  ];

  const currentUser = getLeaderboardData().find(entry => entry.isCurrentUser);

  return (
    <div 
      className="h-full flex flex-col"
      style={{ background: colors.bg, color: colors.textPrimary }}
      role="main"
      aria-labelledby="leaderboards-title"
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
              id="leaderboards-title" 
              className="text-xl sm:text-2xl font-bold"
              style={{ fontFamily: 'Poppins, sans-serif' }}
            >
              Leaderboards
            </h1>
            <p className="text-sm" style={{ color: colors.textSecondary }}>
              Compete with learners worldwide
            </p>
          </div>
          <Trophy className="w-8 h-8" style={{ color: colors.warningColor }} aria-hidden="true" />
        </div>

        {/* Board Type Tabs */}
        <div className="flex gap-2 overflow-x-auto pb-2 mb-3" role="tablist" aria-label="Leaderboard types">
          {boards.map((board) => {
            const Icon = board.icon;
            return (
              <button
                key={board.id}
                onClick={() => setActiveBoard(board.id)}
                className="px-3 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all flex items-center gap-2"
                style={{
                  background: activeBoard === board.id ? colors.iconColor : colors.cardBg,
                  color: activeBoard === board.id 
                    ? (theme === 'dark' ? 'var(--color-bg-deep)' : '#FFFFFF')
                    : colors.textPrimary,
                  border: colors.glassBorder,
                }}
                role="tab"
                aria-selected={activeBoard === board.id}
                aria-controls={`${board.id}-panel`}
              >
                <Icon className="w-4 h-4" aria-hidden="true" />
                {board.label}
              </button>
            );
          })}
        </div>

        {/* Time Period Selector */}
        <div className="flex gap-2" role="group" aria-label="Time period filter">
          {periods.map((period) => (
            <button
              key={period.id}
              onClick={() => setTimePeriod(period.id)}
              className="flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-all"
              style={{
                background: timePeriod === period.id ? colors.accentColor : colors.cardBg,
                color: timePeriod === period.id 
                  ? '#FFFFFF'
                  : colors.textPrimary,
                border: colors.glassBorder,
              }}
              aria-pressed={timePeriod === period.id}
            >
              {period.label}
            </button>
          ))}
        </div>
      </div>

      {/* Your Rank Card */}
      {currentUser && (
        <div 
          className="mx-4 sm:mx-6 mt-4 rounded-xl p-4"
          style={{
            background: `linear-gradient(135deg, ${colors.iconColor}, ${colors.accentColor})`,
            color: '#FFFFFF',
          }}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-semibold opacity-90">Your Rank</span>
            {currentUser.change !== 0 && (
              <div className="flex items-center gap-1 text-sm font-semibold">
                <TrendingUp 
                  className="w-4 h-4" 
                  style={{ 
                    transform: (currentUser.change ?? 0) < 0 ? 'rotate(180deg)' : 'none',
                  }} 
                  aria-hidden="true"
                />
                {Math.abs(currentUser.change ?? 0)} {(currentUser.change ?? 0) > 0 ? 'up' : 'down'}
              </div>
            )}
          </div>
          <div className="flex items-center gap-3">
            <div className="text-3xl font-bold">
              #{currentUser.rank}
            </div>
            <div className="flex-1">
              <div className="text-lg font-bold mb-1">
                {formatScore(currentUser.score)} {getScoreLabel()}
              </div>
              <div className="text-sm opacity-90">
                Level {currentUser.level}
              </div>
            </div>
            {getRankIcon(currentUser.rank) && (
              <div style={{ color: '#FFFFFF' }} aria-hidden="true">
                {getRankIcon(currentUser.rank)}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Leaderboard List */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6">
        {/* Top 3 Podium */}
        {getLeaderboardData().slice(0, 3).length === 3 && (
          <div className="grid grid-cols-3 gap-2 mb-6">
            {/* 2nd Place */}
            <motion.div
              className="text-center pt-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <div 
                className="w-16 h-16 rounded-full flex items-center justify-center font-bold text-lg mx-auto mb-2"
                style={{ background: colors.silverBg, color: colors.silverColor }}
                aria-hidden="true"
              >
                {getLeaderboardData()[1].avatar}
              </div>
              <div className="flex items-center justify-center mb-1">
                <Medal className="w-5 h-5" style={{ color: colors.silverColor }} aria-hidden="true" />
              </div>
              <div className="font-semibold text-sm mb-1" style={{ color: colors.textPrimary }}>
                {getLeaderboardData()[1].name}
              </div>
              <div className="text-xs font-bold" style={{ color: colors.iconColor }}>
                {formatScore(getLeaderboardData()[1].score)}
              </div>
            </motion.div>

            {/* 1st Place */}
            <motion.div
              className="text-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div 
                className="w-20 h-20 rounded-full flex items-center justify-center font-bold text-xl mx-auto mb-2"
                style={{ background: colors.goldBg, color: colors.goldColor }}
                aria-hidden="true"
              >
                {getLeaderboardData()[0].avatar}
              </div>
              <div className="flex items-center justify-center mb-1">
                <Crown className="w-6 h-6" style={{ color: colors.goldColor }} aria-hidden="true" />
              </div>
              <div className="font-semibold text-sm mb-1" style={{ color: colors.textPrimary }}>
                {getLeaderboardData()[0].name}
              </div>
              <div className="text-xs font-bold" style={{ color: colors.iconColor }}>
                {formatScore(getLeaderboardData()[0].score)}
              </div>
            </motion.div>

            {/* 3rd Place */}
            <motion.div
              className="text-center pt-12"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <div 
                className="w-14 h-14 rounded-full flex items-center justify-center font-bold text-base mx-auto mb-2"
                style={{ background: colors.bronzeBg, color: colors.bronzeColor }}
                aria-hidden="true"
              >
                {getLeaderboardData()[2].avatar}
              </div>
              <div className="flex items-center justify-center mb-1">
                <Award className="w-4 h-4" style={{ color: colors.bronzeColor }} aria-hidden="true" />
              </div>
              <div className="font-semibold text-xs mb-1" style={{ color: colors.textPrimary }}>
                {getLeaderboardData()[2].name}
              </div>
              <div className="text-xs font-bold" style={{ color: colors.iconColor }}>
                {formatScore(getLeaderboardData()[2].score)}
              </div>
            </motion.div>
          </div>
        )}

        {/* Rest of Rankings */}
        <div className="space-y-2">
          {getLeaderboardData().slice(3).map((entry, index) => (
            <motion.button
              key={entry.userId}
              onClick={() => setSelectedUser(entry)}
              className="w-full rounded-xl p-3 text-left transition-colors"
              style={{
                background: entry.isCurrentUser 
                  ? `linear-gradient(135deg, ${colors.iconColor}20, ${colors.accentColor}20)`
                  : colors.cardBg,
                backdropFilter: colors.blur,
                WebkitBackdropFilter: colors.blur,
                border: entry.isCurrentUser 
                  ? `2px solid ${colors.iconColor}`
                  : colors.glassBorder,
                boxShadow: colors.shadow,
              }}
              onMouseEnter={(e) => !entry.isCurrentUser && (e.currentTarget.style.background = colors.cardHover)}
              onMouseLeave={(e) => !entry.isCurrentUser && (e.currentTarget.style.background = colors.cardBg)}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.03 }}
              aria-label={`${entry.name}, rank ${entry.rank}, ${formatScore(entry.score)} ${getScoreLabel()}`}
            >
              <div className="flex items-center gap-3">
                {/* Rank */}
                <div 
                  className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0"
                  style={{ 
                    background: getRankBg(entry.rank),
                    color: getRankColor(entry.rank),
                  }}
                  aria-hidden="true"
                >
                  {entry.rank}
                </div>

                {/* Avatar */}
                <div 
                  className="w-10 h-10 rounded-full flex items-center justify-center font-semibold flex-shrink-0"
                  style={{ 
                    background: entry.isCurrentUser ? colors.iconColor : colors.iconBg,
                    color: entry.isCurrentUser 
                      ? (theme === 'dark' ? 'var(--color-bg-deep)' : '#FFFFFF')
                      : colors.iconColor,
                  }}
                  aria-hidden="true"
                >
                  {entry.avatar}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-sm mb-1" style={{ color: colors.textPrimary }}>
                    {entry.name}
                  </div>
                  <div className="flex items-center gap-2 text-xs" style={{ color: colors.textTertiary }}>
                    <span>Level {entry.level}</span>
                    {entry.region && activeBoard === 'regional' && (
                      <>
                        <span>•</span>
                        <span>{entry.region}</span>
                      </>
                    )}
                  </div>
                </div>

                {/* Score */}
                <div className="text-right flex-shrink-0">
                  <div className="font-bold text-base mb-1" style={{ color: colors.iconColor }}>
                    {formatScore(entry.score)}
                  </div>
                  {entry.change !== undefined && entry.change !== 0 && (
                    <div 
                      className="text-xs font-semibold flex items-center gap-1 justify-end"
                      style={{ 
                        color: entry.change > 0 ? colors.successColor : colors.errorColor,
                      }}
                    >
                      <TrendingUp 
                        className="w-3 h-3" 
                        style={{ 
                          transform: entry.change < 0 ? 'rotate(180deg)' : 'none',
                        }} 
                        aria-hidden="true"
                      />
                      {Math.abs(entry.change)}
                    </div>
                  )}
                </div>

                <ChevronRight className="w-5 h-5 flex-shrink-0" style={{ color: colors.textTertiary }} aria-hidden="true" />
              </div>
            </motion.button>
          ))}
        </div>
      </div>

      {/* User Detail Modal */}
      <AnimatePresence>
        {selectedUser && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{ background: 'rgba(0, 0, 0, 0.8)' }}
            onClick={() => setSelectedUser(null)}
            role="dialog"
            aria-labelledby="user-modal-title"
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
                  onClick={() => setSelectedUser(null)}
                  className="absolute top-4 right-4"
                  style={{ color: '#FFFFFF' }}
                  aria-label="Close user profile"
                >
                  <X className="w-6 h-6" />
                </Button>

                <div className="text-center">
                  <div 
                    className="w-20 h-20 rounded-full flex items-center justify-center font-bold text-2xl mx-auto mb-3"
                    style={{ background: 'rgba(255, 255, 255, 0.2)', color: '#FFFFFF' }}
                    aria-hidden="true"
                  >
                    {selectedUser.avatar}
                  </div>
                  <div className="flex items-center justify-center gap-2 mb-2">
                    {getRankIcon(selectedUser.rank) && (
                      <div style={{ color: '#FFFFFF' }} aria-hidden="true">
                        {getRankIcon(selectedUser.rank)}
                      </div>
                    )}
                    <h2 id="user-modal-title" className="text-xl font-bold" style={{ color: '#FFFFFF' }}>
                      {selectedUser.name}
                    </h2>
                  </div>
                  <div className="text-sm mb-3" style={{ color: 'rgba(255, 255, 255, 0.9)' }}>
                    Rank #{selectedUser.rank} • Level {selectedUser.level}
                  </div>
                  {selectedUser.region && (
                    <div className="flex items-center justify-center gap-1 text-sm" style={{ color: 'rgba(255, 255, 255, 0.9)' }}>
                      <MapPin className="w-4 h-4" aria-hidden="true" />
                      {selectedUser.region}
                    </div>
                  )}
                </div>
              </div>

              {/* Stats */}
              <div className="p-6">
                <div className="grid grid-cols-2 gap-3 mb-4">
                  <div 
                    className="rounded-xl p-4 text-center"
                    style={{ background: colors.iconBg }}
                  >
                    <Trophy className="w-6 h-6 mx-auto mb-2" style={{ color: colors.iconColor }} aria-hidden="true" />
                    <div className="text-2xl font-bold mb-1" style={{ color: colors.textPrimary }}>
                      {formatScore(selectedUser.score)}
                    </div>
                    <div className="text-xs" style={{ color: colors.textTertiary }}>Total {getScoreLabel()}</div>
                  </div>

                  {selectedUser.streak !== undefined && (
                    <div 
                      className="rounded-xl p-4 text-center"
                      style={{ background: colors.warningBg }}
                    >
                      <Flame className="w-6 h-6 mx-auto mb-2" style={{ color: colors.warningColor }} aria-hidden="true" />
                      <div className="text-2xl font-bold mb-1" style={{ color: colors.textPrimary }}>
                        {selectedUser.streak}
                      </div>
                      <div className="text-xs" style={{ color: colors.textTertiary }}>Day Streak</div>
                    </div>
                  )}

                  {selectedUser.accuracy !== undefined && (
                    <div 
                      className="rounded-xl p-4 text-center"
                      style={{ background: colors.successBg }}
                    >
                      <Target className="w-6 h-6 mx-auto mb-2" style={{ color: colors.successColor }} aria-hidden="true" />
                      <div className="text-2xl font-bold mb-1" style={{ color: colors.textPrimary }}>
                        {selectedUser.accuracy}%
                      </div>
                      <div className="text-xs" style={{ color: colors.textTertiary }}>Accuracy</div>
                    </div>
                  )}

                  {selectedUser.speed !== undefined && (
                    <div 
                      className="rounded-xl p-4 text-center"
                      style={{ background: colors.accentBg }}
                    >
                      <Zap className="w-6 h-6 mx-auto mb-2" style={{ color: colors.accentColor }} aria-hidden="true" />
                      <div className="text-2xl font-bold mb-1" style={{ color: colors.textPrimary }}>
                        {selectedUser.speed}%
                      </div>
                      <div className="text-xs" style={{ color: colors.textTertiary }}>Speed</div>
                    </div>
                  )}
                </div>

                {!selectedUser.isCurrentUser && (
                  <div className="grid grid-cols-2 gap-3">
                    <Button
                      className="h-10 rounded-full font-semibold"
                      style={{
                        background: colors.iconColor,
                        color: theme === 'dark' ? 'var(--color-bg-deep)' : '#FFFFFF',
                      }}
                      aria-label={`Add ${selectedUser.name} as friend`}
                    >
                      Add Friend
                    </Button>
                    <Button
                      className="h-10 rounded-full font-semibold"
                      style={{
                        background: colors.cardBg,
                        color: colors.textPrimary,
                        border: colors.glassBorder,
                      }}
                      aria-label={`Challenge ${selectedUser.name}`}
                    >
                      Challenge
                    </Button>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
