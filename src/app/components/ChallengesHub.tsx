import { useState } from 'react';
import { Button } from './ui/button';
import { useTheme } from '../context/ThemeContext';
import { useApp } from '../context/AppContext';
import exampleImage from 'figma:asset/d8ce6543d0d3de4e3290ee98ad6848b78845c43c.png';
import { 
  X, 
  Trophy,
  Target,
  Calendar,
  Clock,
  Zap,
  Star,
  Users,
  TrendingUp,
  Award,
  ChevronRight,
  Play,
  Lock,
  Check,
  Flame,
  Crown,
  Sparkles,
  Gift,
  Medal,
  Flag,
  Plus,
  Send,
  UserPlus,
  Filter,
  Search,
  Info,
  CheckCircle2,
  Circle,
  BarChart3,
  MessageCircle,
  Heart,
  Share2,
  Bookmark,
  BookmarkCheck,
  AlarmClock,
  Timer,
  CircleDot,
  Shuffle,
  Repeat,
  Download,
  Upload,
  Eye,
  Settings,
  Hash,
  Percent,
  Activity,
} from 'lucide-react';

interface ChallengesHubProps {
  onExit: () => void;
}

interface Challenge {
  id: string;
  title: string;
  description: string;
  type: 'daily' | 'weekly' | 'special' | 'custom' | 'friend';
  difficulty: 'easy' | 'medium' | 'hard' | 'expert';
  reward: number;
  timeRemaining?: string;
  progress: number;
  total: number;
  participants?: number;
  status: 'active' | 'completed' | 'locked' | 'upcoming';
  category: string;
  isBookmarked: boolean;
  createdBy?: string;
}

interface WeeklyCompetition {
  id: string;
  name: string;
  description: string;
  startDate: string;
  endDate: string;
  participants: number;
  prize: string;
  myRank?: number;
  myScore: number;
  status: 'active' | 'upcoming' | 'ended';
}

interface SpecialEvent {
  id: string;
  name: string;
  description: string;
  theme: string;
  startDate: string;
  endDate: string;
  totalChallenges: number;
  completedChallenges: number;
  rewards: string[];
  isLimited: boolean;
  participants: number;
}

interface FriendChallenge {
  id: string;
  friendName: string;
  challengeType: string;
  status: 'pending' | 'active' | 'won' | 'lost' | 'tied';
  myScore: number;
  theirScore: number;
  timeRemaining: string;
  stakes: string;
}

interface Leaderboard {
  rank: number;
  username: string;
  score: number;
  badges: number;
  isCurrentUser: boolean;
}

export function ChallengesHub({ onExit }: ChallengesHubProps) {
  const { theme } = useTheme();
  const { userProgress } = useApp();

  const [selectedTab, setSelectedTab] = useState<'all' | 'daily' | 'weekly' | 'special' | 'friends'>('all');
  const [showCreateChallenge, setShowCreateChallenge] = useState(false);
  const [showChallengeFriend, setShowChallengeFriend] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Daily Challenges
  const [dailyChallenges, setDailyChallenges] = useState<Challenge[]>([
    {
      id: 'daily-1',
      title: 'Morning Sign Practice',
      description: 'Practice 20 greetings before noon',
      type: 'daily',
      difficulty: 'easy',
      reward: 50,
      timeRemaining: '4h 23m',
      progress: 15,
      total: 20,
      status: 'active',
      category: 'Practice',
      isBookmarked: false,
    },
    {
      id: 'daily-2',
      title: 'Perfect Accuracy',
      description: 'Complete 5 lessons with 100% accuracy',
      type: 'daily',
      difficulty: 'medium',
      reward: 100,
      timeRemaining: '4h 23m',
      progress: 2,
      total: 5,
      status: 'active',
      category: 'Accuracy',
      isBookmarked: true,
    },
    {
      id: 'daily-3',
      title: 'Speed Demon',
      description: 'Sign 30 words in under 2 minutes',
      type: 'daily',
      difficulty: 'hard',
      reward: 150,
      timeRemaining: '4h 23m',
      progress: 0,
      total: 30,
      status: 'active',
      category: 'Speed',
      isBookmarked: false,
    },
    {
      id: 'daily-4',
      title: 'Vocabulary Builder',
      description: 'Learn 10 new signs today',
      type: 'daily',
      difficulty: 'easy',
      reward: 75,
      timeRemaining: '4h 23m',
      progress: 10,
      total: 10,
      status: 'completed',
      category: 'Learning',
      isBookmarked: false,
    },
    {
      id: 'daily-5',
      title: 'Fingerspelling Master',
      description: 'Spell 15 words correctly',
      type: 'daily',
      difficulty: 'medium',
      reward: 100,
      timeRemaining: '4h 23m',
      progress: 8,
      total: 15,
      status: 'active',
      category: 'Fingerspelling',
      isBookmarked: false,
    },
  ]);

  // Weekly Competitions
  const [weeklyCompetitions, setWeeklyCompetitions] = useState<WeeklyCompetition[]>([
    {
      id: 'weekly-1',
      name: 'ASL Champion League',
      description: 'Compete for the highest accuracy score this week',
      startDate: 'Jan 6',
      endDate: 'Jan 12',
      participants: 3847,
      prize: '500 XP + Champion Badge',
      myRank: 142,
      myScore: 2856,
      status: 'active',
    },
    {
      id: 'weekly-2',
      name: 'Speed Sign Sprint',
      description: 'Complete the most lessons in the shortest time',
      startDate: 'Jan 6',
      endDate: 'Jan 12',
      participants: 2931,
      prize: '300 XP + Speed Badge',
      myRank: 78,
      myScore: 1920,
      status: 'active',
    },
    {
      id: 'weekly-3',
      name: 'Vocabulary Vault',
      description: 'Learn the most new signs this week',
      startDate: 'Jan 6',
      endDate: 'Jan 12',
      participants: 4210,
      prize: '400 XP + Scholar Badge',
      myRank: 256,
      myScore: 1543,
      status: 'active',
    },
    {
      id: 'weekly-4',
      name: 'Streak Master',
      description: 'Maintain the longest practice streak',
      startDate: 'Jan 13',
      endDate: 'Jan 19',
      participants: 0,
      prize: '600 XP + Dedication Badge',
      myScore: 0,
      status: 'upcoming',
    },
  ]);

  // Special Event Challenges
  const [specialEvents, setSpecialEvents] = useState<SpecialEvent[]>([
    {
      id: 'event-1',
      name: 'Winter Sign Festival',
      description: 'Celebrate winter with themed ASL challenges',
      theme: 'Winter',
      startDate: 'Jan 1',
      endDate: 'Jan 31',
      totalChallenges: 20,
      completedChallenges: 8,
      rewards: ['Winter Badge', '1000 XP', 'Exclusive Avatar'],
      isLimited: true,
      participants: 12483,
    },
    {
      id: 'event-2',
      name: 'New Year Resolution',
      description: 'Start the year strong with daily sign practice',
      theme: 'New Year',
      startDate: 'Jan 1',
      endDate: 'Jan 31',
      totalChallenges: 31,
      completedChallenges: 12,
      rewards: ['Resolution Badge', '500 XP'],
      isLimited: true,
      participants: 8956,
    },
    {
      id: 'event-3',
      name: 'Community Connection',
      description: 'Help others learn by creating and sharing lessons',
      theme: 'Community',
      startDate: 'Jan 8',
      endDate: 'Feb 8',
      totalChallenges: 15,
      completedChallenges: 3,
      rewards: ['Teacher Badge', '750 XP', 'Premium Week'],
      isLimited: false,
      participants: 5621,
    },
  ]);

  // Friend Challenges
  const [friendChallenges, setFriendChallenges] = useState<FriendChallenge[]>([
    {
      id: 'friend-1',
      friendName: 'Sarah M.',
      challengeType: 'Accuracy Duel',
      status: 'active',
      myScore: 92,
      theirScore: 88,
      timeRemaining: '2d 14h',
      stakes: '100 XP',
    },
    {
      id: 'friend-2',
      friendName: 'Mike T.',
      challengeType: 'Speed Challenge',
      status: 'won',
      myScore: 145,
      theirScore: 132,
      timeRemaining: 'Ended',
      stakes: '50 XP',
    },
    {
      id: 'friend-3',
      friendName: 'Emily R.',
      challengeType: 'Vocabulary Race',
      status: 'pending',
      myScore: 0,
      theirScore: 0,
      timeRemaining: '6d 23h',
      stakes: '75 XP',
    },
    {
      id: 'friend-4',
      friendName: 'David L.',
      challengeType: 'Perfect Week',
      status: 'lost',
      myScore: 6,
      theirScore: 7,
      timeRemaining: 'Ended',
      stakes: '100 XP',
    },
  ]);

  // Custom Challenges
  const [customChallenges, setCustomChallenges] = useState<Challenge[]>([
    {
      id: 'custom-1',
      title: 'Medical Signs Mastery',
      description: 'Learn all 50 medical emergency signs',
      type: 'custom',
      difficulty: 'hard',
      reward: 500,
      progress: 32,
      total: 50,
      status: 'active',
      category: 'Medical',
      isBookmarked: true,
      createdBy: 'You',
    },
    {
      id: 'custom-2',
      title: 'Family Conversation',
      description: 'Practice 100 family-related signs',
      type: 'custom',
      difficulty: 'medium',
      reward: 300,
      progress: 68,
      total: 100,
      status: 'active',
      category: 'Family',
      isBookmarked: false,
      createdBy: 'You',
    },
    {
      id: 'custom-3',
      title: 'ASL Poetry',
      description: 'Master 5 ASL poems',
      type: 'custom',
      difficulty: 'expert',
      reward: 750,
      progress: 1,
      total: 5,
      status: 'active',
      category: 'Advanced',
      isBookmarked: true,
      createdBy: 'Community',
    },
  ]);

  // Leaderboard
  const [leaderboard, setLeaderboard] = useState<Leaderboard[]>([
    { rank: 1, username: 'SignMaster2024', score: 15847, badges: 52, isCurrentUser: false },
    { rank: 2, username: 'ASLChampion', score: 14923, badges: 48, isCurrentUser: false },
    { rank: 3, username: 'DeafCulturePro', score: 13756, badges: 45, isCurrentUser: false },
    { rank: 4, username: 'HandTalkExpert', score: 12890, badges: 41, isCurrentUser: false },
    { rank: 5, username: 'You', score: 11245, badges: 38, isCurrentUser: true },
    { rank: 6, username: 'SignLanguageFan', score: 10932, badges: 36, isCurrentUser: false },
    { rank: 7, username: 'ASLLearner123', score: 10456, badges: 34, isCurrentUser: false },
    { rank: 8, username: 'FluentSigner', score: 9876, badges: 32, isCurrentUser: false },
  ]);

  const handleToggleBookmark = (challengeId: string, type: 'daily' | 'custom') => {
    if (type === 'daily') {
      setDailyChallenges(prev => prev.map(c => 
        c.id === challengeId ? { ...c, isBookmarked: !c.isBookmarked } : c
      ));
    } else {
      setCustomChallenges(prev => prev.map(c => 
        c.id === challengeId ? { ...c, isBookmarked: !c.isBookmarked } : c
      ));
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    if (difficulty === 'easy') return colors.successColor;
    if (difficulty === 'medium') return colors.warningColor;
    if (difficulty === 'hard') return colors.errorColor;
    if (difficulty === 'expert') return colors.accentColor;
    return colors.iconColor;
  };

  const getStatusColor = (status: string) => {
    if (status === 'won' || status === 'completed') return colors.successColor;
    if (status === 'active') return colors.iconColor;
    if (status === 'lost') return colors.errorColor;
    if (status === 'pending') return colors.warningColor;
    return colors.textTertiary;
  };

  // Filter challenges based on tab
  const getFilteredChallenges = () => {
    if (selectedTab === 'daily') return dailyChallenges;
    if (selectedTab === 'weekly') return [];
    if (selectedTab === 'special') return [];
    if (selectedTab === 'friends') return [];
    return [...dailyChallenges, ...customChallenges];
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
      aria-labelledby="challenges-title"
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
            aria-label="Exit challenges hub"
            className="flex-shrink-0"
          >
            <X className="w-6 h-6" />
          </Button>
          <div className="flex-1 min-w-0">
            <h1 
              id="challenges-title" 
              className="text-xl sm:text-2xl font-bold truncate"
              style={{ fontFamily: 'Poppins, sans-serif' }}
            >
              Challenges Hub
            </h1>
            <p className="text-sm truncate" style={{ color: colors.textSecondary }}>
              Compete, achieve, and win rewards
            </p>
          </div>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="p-4">
        <div className="grid grid-cols-3 gap-3">
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
            <div className="text-2xl font-bold mb-1" style={{ color: colors.successColor }}>
              38
            </div>
            <div className="text-xs" style={{ color: colors.textTertiary }}>
              Completed
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
            <div className="text-2xl font-bold mb-1" style={{ color: colors.iconColor }}>
              12
            </div>
            <div className="text-xs" style={{ color: colors.textTertiary }}>
              Active
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
            <div className="text-2xl font-bold mb-1" style={{ color: colors.warningColor }}>
              #142
            </div>
            <div className="text-xs" style={{ color: colors.textTertiary }}>
              Global Rank
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="px-4 pb-4">
        <div className="grid grid-cols-2 gap-3">
          <Button
            onClick={() => setShowCreateChallenge(true)}
            className="h-12 rounded-xl font-semibold flex items-center justify-center gap-2"
            style={{ 
              background: colors.iconColor,
              color: theme === 'dark' ? '#0F0F23' : '#FFFFFF',
            }}
            aria-label="Create custom challenge"
          >
            <Plus className="w-5 h-5" />
            Create Challenge
          </Button>
          <Button
            onClick={() => setShowChallengeFriend(true)}
            className="h-12 rounded-xl font-semibold flex items-center justify-center gap-2"
            style={{ 
              background: colors.accentBg,
              color: colors.accentColor,
              border: `2px solid ${colors.accentColor}`,
            }}
            aria-label="Challenge a friend"
          >
            <UserPlus className="w-5 h-5" />
            Challenge Friend
          </Button>
        </div>
      </div>

      {/* Tab Navigation */}
      <div 
        className="px-4 pb-4 border-b"
        style={{ borderBottomColor: colors.border }}
        role="tablist"
        aria-label="Challenge categories"
      >
        <div className="flex gap-2 overflow-x-auto pb-2">
          {[
            { id: 'all', label: 'All', icon: Filter },
            { id: 'daily', label: 'Daily', icon: Calendar },
            { id: 'weekly', label: 'Weekly', icon: Trophy },
            { id: 'special', label: 'Events', icon: Sparkles },
            { id: 'friends', label: 'Friends', icon: Users },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = selectedTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setSelectedTab(tab.id as any)}
                className="flex items-center gap-2 px-4 py-2 rounded-xl whitespace-nowrap transition-all flex-shrink-0"
                style={{
                  background: isActive ? colors.iconColor + '20' : colors.cardBg,
                  border: isActive ? `2px solid ${colors.iconColor}` : colors.glassBorder,
                  color: isActive ? colors.iconColor : colors.textSecondary,
                }}
                role="tab"
                aria-selected={isActive}
                aria-controls={`${tab.id}-panel`}
                tabIndex={isActive ? 0 : -1}
              >
                <Icon className="w-4 h-4" />
                <span className="text-sm font-semibold">{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto">
        {/* Daily Challenges Tab */}
        {selectedTab === 'daily' && (
          <section 
            id="daily-panel" 
            role="tabpanel" 
            aria-labelledby="daily-challenges-heading"
            className="p-4"
          >
            <div className="flex items-center justify-between mb-3">
              <h2 id="daily-challenges-heading" className="text-lg font-semibold" style={{ color: colors.textPrimary }}>
                Today's Challenges
              </h2>
              <div className="flex items-center gap-2 text-sm" style={{ color: colors.textSecondary }}>
                <Clock className="w-4 h-4" />
                <span>Resets in 4h 23m</span>
              </div>
            </div>

            <div className="space-y-3">
              {dailyChallenges.map((challenge) => (
                <div
                  key={challenge.id}
                  className="rounded-xl p-4"
                  style={{
                    background: colors.cardBg,
                    backdropFilter: colors.blur,
                    WebkitBackdropFilter: colors.blur,
                    border: colors.glassBorder,
                    boxShadow: colors.shadow,
                  }}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold mb-1" style={{ color: colors.textPrimary }}>
                        {challenge.title}
                      </h3>
                      <p className="text-sm mb-2" style={{ color: colors.textSecondary }}>
                        {challenge.description}
                      </p>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span 
                          className="text-xs px-2 py-1 rounded-full font-bold"
                          style={{
                            background: getDifficultyColor(challenge.difficulty) + '30',
                            color: getDifficultyColor(challenge.difficulty),
                          }}
                        >
                          {challenge.difficulty}
                        </span>
                        <span 
                          className="text-xs px-2 py-1 rounded-full flex items-center gap-1"
                          style={{
                            background: colors.warningBg,
                            color: colors.warningColor,
                          }}
                        >
                          <Trophy className="w-3 h-3" />
                          {challenge.reward} XP
                        </span>
                        {challenge.status === 'completed' && (
                          <span 
                            className="text-xs px-2 py-1 rounded-full flex items-center gap-1"
                            style={{
                              background: colors.successBg,
                              color: colors.successColor,
                            }}
                          >
                            <CheckCircle2 className="w-3 h-3" />
                            Completed
                          </span>
                        )}
                      </div>
                    </div>
                    <button
                      onClick={() => handleToggleBookmark(challenge.id, 'daily')}
                      className="p-2 rounded-lg ml-2 flex-shrink-0"
                      style={{ background: challenge.isBookmarked ? colors.warningBg : 'transparent' }}
                      aria-label={challenge.isBookmarked ? 'Remove bookmark' : 'Add bookmark'}
                      aria-pressed={challenge.isBookmarked}
                    >
                      {challenge.isBookmarked ? (
                        <BookmarkCheck className="w-5 h-5" style={{ color: colors.warningColor }} />
                      ) : (
                        <Bookmark className="w-5 h-5" style={{ color: colors.textTertiary }} />
                      )}
                    </button>
                  </div>

                  {/* Progress Bar */}
                  {challenge.status !== 'completed' && (
                    <div className="mb-3">
                      <div className="flex items-center justify-between mb-1 text-xs" style={{ color: colors.textTertiary }}>
                        <span>Progress</span>
                        <span>{challenge.progress}/{challenge.total}</span>
                      </div>
                      <div 
                        className="w-full h-2 rounded-full overflow-hidden"
                        style={{ background: colors.border }}
                      >
                        <div 
                          className="h-full rounded-full transition-all"
                          style={{ 
                            background: colors.successColor,
                            width: `${(challenge.progress / challenge.total) * 100}%`,
                          }}
                        />
                      </div>
                    </div>
                  )}

                  <Button
                    className="w-full h-10 rounded-xl font-semibold"
                    style={{ 
                      background: challenge.status === 'completed' ? colors.successBg : colors.iconColor,
                      color: challenge.status === 'completed' ? colors.successColor : (theme === 'dark' ? '#0F0F23' : '#FFFFFF'),
                    }}
                    disabled={challenge.status === 'completed'}
                    aria-label={challenge.status === 'completed' ? 'Challenge completed' : `Start ${challenge.title}`}
                  >
                    {challenge.status === 'completed' ? (
                      <>
                        <CheckCircle2 className="w-4 h-4 mr-2" />
                        Completed
                      </>
                    ) : (
                      <>
                        <Play className="w-4 h-4 mr-2" />
                        Start Challenge
                      </>
                    )}
                  </Button>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Weekly Competitions Tab */}
        {selectedTab === 'weekly' && (
          <section 
            id="weekly-panel" 
            role="tabpanel" 
            aria-labelledby="weekly-competitions-heading"
            className="p-4"
          >
            <div className="flex items-center justify-between mb-3">
              <h2 id="weekly-competitions-heading" className="text-lg font-semibold" style={{ color: colors.textPrimary }}>
                Weekly Competitions
              </h2>
              <div className="flex items-center gap-2 text-sm" style={{ color: colors.textSecondary }}>
                <Calendar className="w-4 h-4" />
                <span>Jan 6-12</span>
              </div>
            </div>

            <div className="space-y-3">
              {weeklyCompetitions.map((comp) => (
                <div
                  key={comp.id}
                  className="rounded-xl p-4"
                  style={{
                    background: colors.cardBg,
                    backdropFilter: colors.blur,
                    WebkitBackdropFilter: colors.blur,
                    border: colors.glassBorder,
                    boxShadow: colors.shadow,
                  }}
                >
                  <div className="flex items-start gap-3 mb-3">
                    <div 
                      className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                      style={{ background: colors.accentBg }}
                    >
                      <Trophy className="w-6 h-6" style={{ color: colors.accentColor }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold mb-1" style={{ color: colors.textPrimary }}>
                        {comp.name}
                      </h3>
                      <p className="text-sm mb-2" style={{ color: colors.textSecondary }}>
                        {comp.description}
                      </p>
                      <div className="flex items-center gap-3 text-xs" style={{ color: colors.textTertiary }}>
                        <span className="flex items-center gap-1">
                          <Users className="w-3 h-3" />
                          {comp.participants.toLocaleString()} players
                        </span>
                        {comp.status === 'upcoming' && (
                          <span 
                            className="px-2 py-0.5 rounded-full"
                            style={{ 
                              background: colors.warningBg,
                              color: colors.warningColor,
                            }}
                          >
                            Upcoming
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {comp.status === 'active' && comp.myRank && (
                    <div 
                      className="rounded-lg p-3 mb-3"
                      style={{ background: colors.iconBg }}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="text-sm font-semibold mb-1" style={{ color: colors.textPrimary }}>
                            Your Rank: #{comp.myRank}
                          </div>
                          <div className="text-xs" style={{ color: colors.textTertiary }}>
                            Score: {comp.myScore.toLocaleString()} points
                          </div>
                        </div>
                        <Medal className="w-8 h-8" style={{ color: colors.iconColor }} />
                      </div>
                    </div>
                  )}

                  <div 
                    className="rounded-lg p-3 mb-3 flex items-center gap-2"
                    style={{ background: colors.warningBg }}
                  >
                    <Gift className="w-5 h-5 flex-shrink-0" style={{ color: colors.warningColor }} />
                    <div className="text-sm font-semibold" style={{ color: colors.warningColor }}>
                      Prize: {comp.prize}
                    </div>
                  </div>

                  <Button
                    className="w-full h-10 rounded-xl font-semibold flex items-center justify-center gap-2"
                    style={{ 
                      background: comp.status === 'upcoming' ? colors.textTertiary : colors.accentColor,
                      color: '#FFFFFF',
                    }}
                    disabled={comp.status === 'upcoming'}
                    aria-label={comp.status === 'upcoming' ? 'Competition not started' : `View ${comp.name} leaderboard`}
                  >
                    {comp.status === 'upcoming' ? (
                      <>
                        <Lock className="w-4 h-4" />
                        Starts {comp.startDate}
                      </>
                    ) : (
                      <>
                        <BarChart3 className="w-4 h-4" />
                        View Leaderboard
                      </>
                    )}
                  </Button>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Special Events Tab */}
        {selectedTab === 'special' && (
          <section 
            id="special-panel" 
            role="tabpanel" 
            aria-labelledby="special-events-heading"
            className="p-4"
          >
            <div className="flex items-center justify-between mb-3">
              <h2 id="special-events-heading" className="text-lg font-semibold" style={{ color: colors.textPrimary }}>
                Special Events
              </h2>
              <Sparkles className="w-5 h-5" style={{ color: colors.warningColor }} />
            </div>

            <div className="space-y-3">
              {specialEvents.map((event) => (
                <div
                  key={event.id}
                  className="rounded-xl p-4"
                  style={{
                    background: colors.cardBg,
                    backdropFilter: colors.blur,
                    WebkitBackdropFilter: colors.blur,
                    border: colors.glassBorder,
                    boxShadow: colors.shadow,
                  }}
                >
                  <div className="flex items-start gap-3 mb-3">
                    <div 
                      className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                      style={{ background: colors.warningBg }}
                    >
                      <Sparkles className="w-6 h-6" style={{ color: colors.warningColor }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between mb-1">
                        <h3 className="font-bold" style={{ color: colors.textPrimary }}>
                          {event.name}
                        </h3>
                        {event.isLimited && (
                          <span 
                            className="text-xs px-2 py-0.5 rounded-full flex-shrink-0 ml-2"
                            style={{
                              background: colors.errorBg,
                              color: colors.errorColor,
                            }}
                          >
                            Limited
                          </span>
                        )}
                      </div>
                      <p className="text-sm mb-2" style={{ color: colors.textSecondary }}>
                        {event.description}
                      </p>
                      <div className="flex items-center gap-3 text-xs flex-wrap" style={{ color: colors.textTertiary }}>
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {event.startDate} - {event.endDate}
                        </span>
                        <span className="flex items-center gap-1">
                          <Users className="w-3 h-3" />
                          {event.participants.toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Progress */}
                  <div className="mb-3">
                    <div className="flex items-center justify-between mb-1 text-xs" style={{ color: colors.textTertiary }}>
                      <span>Event Progress</span>
                      <span>{event.completedChallenges}/{event.totalChallenges} challenges</span>
                    </div>
                    <div 
                      className="w-full h-2 rounded-full overflow-hidden"
                      style={{ background: colors.border }}
                    >
                      <div 
                        className="h-full rounded-full transition-all"
                        style={{ 
                          background: colors.warningColor,
                          width: `${(event.completedChallenges / event.totalChallenges) * 100}%`,
                        }}
                      />
                    </div>
                  </div>

                  {/* Rewards */}
                  <div 
                    className="rounded-lg p-3 mb-3"
                    style={{ background: colors.successBg }}
                  >
                    <div className="text-xs font-semibold mb-2" style={{ color: colors.successColor }}>
                      Event Rewards:
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {event.rewards.map((reward, idx) => (
                        <span 
                          key={idx}
                          className="text-xs px-2 py-1 rounded-full"
                          style={{
                            background: colors.successColor + '30',
                            color: colors.successColor,
                          }}
                        >
                          {reward}
                        </span>
                      ))}
                    </div>
                  </div>

                  <Button
                    className="w-full h-10 rounded-xl font-semibold flex items-center justify-center gap-2"
                    style={{ 
                      background: colors.warningColor,
                      color: theme === 'dark' ? '#0F0F23' : '#FFFFFF',
                    }}
                    aria-label={`View ${event.name} challenges`}
                  >
                    <Flag className="w-4 h-4" />
                    View Challenges
                  </Button>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Friends Tab */}
        {selectedTab === 'friends' && (
          <section 
            id="friends-panel" 
            role="tabpanel" 
            aria-labelledby="friend-challenges-heading"
            className="p-4"
          >
            <div className="flex items-center justify-between mb-3">
              <h2 id="friend-challenges-heading" className="text-lg font-semibold" style={{ color: colors.textPrimary }}>
                Friend Challenges
              </h2>
              <button
                onClick={() => setShowChallengeFriend(true)}
                className="text-sm font-semibold flex items-center gap-1"
                style={{ color: colors.iconColor }}
                aria-label="Challenge new friend"
              >
                <Plus className="w-4 h-4" />
                New
              </button>
            </div>

            <div className="space-y-3">
              {friendChallenges.map((challenge) => (
                <div
                  key={challenge.id}
                  className="rounded-xl p-4"
                  style={{
                    background: colors.cardBg,
                    backdropFilter: colors.blur,
                    WebkitBackdropFilter: colors.blur,
                    border: colors.glassBorder,
                    boxShadow: colors.shadow,
                  }}
                >
                  <div className="flex items-start gap-3 mb-3">
                    <div 
                      className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
                      style={{ background: colors.accentBg }}
                    >
                      <Users className="w-5 h-5" style={{ color: colors.accentColor }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-bold mb-1" style={{ color: colors.textPrimary }}>
                        vs {challenge.friendName}
                      </div>
                      <div className="text-sm mb-2" style={{ color: colors.textSecondary }}>
                        {challenge.challengeType}
                      </div>
                      <div className="flex items-center gap-2">
                        <span 
                          className="text-xs px-2 py-1 rounded-full font-bold"
                          style={{
                            background: getStatusColor(challenge.status) + '30',
                            color: getStatusColor(challenge.status),
                          }}
                        >
                          {challenge.status}
                        </span>
                        <span className="text-xs" style={{ color: colors.textTertiary }}>
                          {challenge.timeRemaining}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Score Comparison */}
                  {challenge.status !== 'pending' && (
                    <div 
                      className="rounded-lg p-3 mb-3"
                      style={{ background: colors.iconBg }}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="text-center flex-1">
                          <div className="text-sm font-semibold mb-1" style={{ color: colors.textPrimary }}>
                            You
                          </div>
                          <div className="text-2xl font-bold" style={{ color: colors.iconColor }}>
                            {challenge.myScore}
                          </div>
                        </div>
                        <div className="text-xl font-bold px-3" style={{ color: colors.textTertiary }}>
                          vs
                        </div>
                        <div className="text-center flex-1">
                          <div className="text-sm font-semibold mb-1" style={{ color: colors.textPrimary }}>
                            {challenge.friendName}
                          </div>
                          <div className="text-2xl font-bold" style={{ color: colors.accentColor }}>
                            {challenge.theirScore}
                          </div>
                        </div>
                      </div>
                      <div className="text-xs text-center" style={{ color: colors.textTertiary }}>
                        Stakes: {challenge.stakes}
                      </div>
                    </div>
                  )}

                  <Button
                    className="w-full h-10 rounded-xl font-semibold flex items-center justify-center gap-2"
                    style={{ 
                      background: challenge.status === 'pending' ? colors.warningColor : 
                                  challenge.status === 'won' ? colors.successColor :
                                  challenge.status === 'lost' ? colors.errorColor :
                                  colors.iconColor,
                      color: '#FFFFFF',
                    }}
                    aria-label={
                      challenge.status === 'pending' ? 'Accept challenge' :
                      challenge.status === 'active' ? 'Continue challenge' :
                      'View challenge results'
                    }
                  >
                    {challenge.status === 'pending' && (
                      <>
                        <Check className="w-4 h-4" />
                        Accept Challenge
                      </>
                    )}
                    {challenge.status === 'active' && (
                      <>
                        <Play className="w-4 h-4" />
                        Continue
                      </>
                    )}
                    {(challenge.status === 'won' || challenge.status === 'lost') && (
                      <>
                        <Eye className="w-4 h-4" />
                        View Results
                      </>
                    )}
                  </Button>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* All Challenges Tab */}
        {selectedTab === 'all' && (
          <section 
            id="all-panel" 
            role="tabpanel" 
            aria-labelledby="all-challenges-heading"
            className="p-4"
          >
            <h2 id="all-challenges-heading" className="text-lg font-semibold mb-3" style={{ color: colors.textPrimary }}>
              All Challenges
            </h2>

            {/* Custom Challenges */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-base font-semibold" style={{ color: colors.textPrimary }}>
                  Custom Challenges
                </h3>
                <button
                  onClick={() => setShowCreateChallenge(true)}
                  className="text-sm font-semibold"
                  style={{ color: colors.iconColor }}
                  aria-label="Create new custom challenge"
                >
                  Create New
                </button>
              </div>
              <div className="space-y-3">
                {customChallenges.map((challenge) => (
                  <div
                    key={challenge.id}
                    className="rounded-xl p-4"
                    style={{
                      background: colors.cardBg,
                      backdropFilter: colors.blur,
                      WebkitBackdropFilter: colors.blur,
                      border: colors.glassBorder,
                      boxShadow: colors.shadow,
                    }}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1 min-w-0">
                        <h4 className="font-bold mb-1" style={{ color: colors.textPrimary }}>
                          {challenge.title}
                        </h4>
                        <p className="text-sm mb-2" style={{ color: colors.textSecondary }}>
                          {challenge.description}
                        </p>
                        <div className="flex items-center gap-2 flex-wrap">
                          <span 
                            className="text-xs px-2 py-1 rounded-full font-bold"
                            style={{
                              background: getDifficultyColor(challenge.difficulty) + '30',
                              color: getDifficultyColor(challenge.difficulty),
                            }}
                          >
                            {challenge.difficulty}
                          </span>
                          <span 
                            className="text-xs px-2 py-1 rounded-full flex items-center gap-1"
                            style={{
                              background: colors.warningBg,
                              color: colors.warningColor,
                            }}
                          >
                            <Trophy className="w-3 h-3" />
                            {challenge.reward} XP
                          </span>
                          <span className="text-xs" style={{ color: colors.textTertiary }}>
                            by {challenge.createdBy}
                          </span>
                        </div>
                      </div>
                      <button
                        onClick={() => handleToggleBookmark(challenge.id, 'custom')}
                        className="p-2 rounded-lg ml-2 flex-shrink-0"
                        style={{ background: challenge.isBookmarked ? colors.warningBg : 'transparent' }}
                        aria-label={challenge.isBookmarked ? 'Remove bookmark' : 'Add bookmark'}
                        aria-pressed={challenge.isBookmarked}
                      >
                        {challenge.isBookmarked ? (
                          <BookmarkCheck className="w-5 h-5" style={{ color: colors.warningColor }} />
                        ) : (
                          <Bookmark className="w-5 h-5" style={{ color: colors.textTertiary }} />
                        )}
                      </button>
                    </div>

                    <div className="mb-3">
                      <div className="flex items-center justify-between mb-1 text-xs" style={{ color: colors.textTertiary }}>
                        <span>Progress</span>
                        <span>{challenge.progress}/{challenge.total}</span>
                      </div>
                      <div 
                        className="w-full h-2 rounded-full overflow-hidden"
                        style={{ background: colors.border }}
                      >
                        <div 
                          className="h-full rounded-full transition-all"
                          style={{ 
                            background: colors.accentColor,
                            width: `${(challenge.progress / challenge.total) * 100}%`,
                          }}
                        />
                      </div>
                    </div>

                    <Button
                      className="w-full h-10 rounded-xl font-semibold flex items-center justify-center gap-2"
                      style={{ 
                        background: colors.accentColor,
                        color: '#FFFFFF',
                      }}
                      aria-label={`Continue ${challenge.title}`}
                    >
                      <Play className="w-4 h-4" />
                      Continue
                    </Button>
                  </div>
                ))}
              </div>
            </div>

            {/* Daily Challenges Preview */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-base font-semibold" style={{ color: colors.textPrimary }}>
                  Today's Challenges
                </h3>
                <button
                  onClick={() => setSelectedTab('daily')}
                  className="text-sm font-semibold"
                  style={{ color: colors.iconColor }}
                  aria-label="View all daily challenges"
                >
                  View All
                </button>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {dailyChallenges.slice(0, 4).map((challenge) => (
                  <button
                    key={challenge.id}
                    onClick={() => setSelectedTab('daily')}
                    className="rounded-xl p-3 text-left"
                    style={{
                      background: colors.cardBg,
                      backdropFilter: colors.blur,
                      WebkitBackdropFilter: colors.blur,
                      border: colors.glassBorder,
                      boxShadow: colors.shadow,
                    }}
                    aria-label={`View ${challenge.title}`}
                  >
                    <div 
                      className="w-10 h-10 rounded-lg mx-auto mb-2 flex items-center justify-center"
                      style={{ background: getDifficultyColor(challenge.difficulty) + '20' }}
                    >
                      <Target className="w-5 h-5" style={{ color: getDifficultyColor(challenge.difficulty) }} />
                    </div>
                    <div className="text-sm font-bold mb-1 line-clamp-2" style={{ color: colors.textPrimary }}>
                      {challenge.title}
                    </div>
                    <div className="text-xs" style={{ color: colors.textTertiary }}>
                      {challenge.progress}/{challenge.total}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Global Leaderboard Section */}
        <section aria-labelledby="leaderboard-heading" className="px-4 pb-6">
          <div className="flex items-center justify-between mb-3">
            <h2 id="leaderboard-heading" className="text-lg font-semibold" style={{ color: colors.textPrimary }}>
              Global Challenge Leaders
            </h2>
            <ChevronRight className="w-5 h-5" style={{ color: colors.textTertiary }} />
          </div>

          <div 
            className="rounded-2xl p-4"
            style={{
              background: colors.cardBg,
              backdropFilter: colors.blur,
              WebkitBackdropFilter: colors.blur,
              border: colors.glassBorder,
              boxShadow: colors.shadow,
            }}
          >
            <div className="space-y-2">
              {leaderboard.slice(0, 5).map((entry) => (
                <div
                  key={entry.rank}
                  className="flex items-center gap-3 p-2 rounded-lg"
                  style={{
                    background: entry.isCurrentUser ? colors.iconBg : 'transparent',
                  }}
                >
                  <div 
                    className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 font-bold"
                    style={{
                      background: entry.rank <= 3 ? colors.warningBg : colors.border,
                      color: entry.rank <= 3 ? colors.warningColor : colors.textTertiary,
                    }}
                  >
                    {entry.rank}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-semibold truncate" style={{ color: colors.textPrimary }}>
                      {entry.username}
                      {entry.isCurrentUser && (
                        <span className="ml-2 text-xs" style={{ color: colors.iconColor }}>
                          (You)
                        </span>
                      )}
                    </div>
                    <div className="text-xs" style={{ color: colors.textTertiary }}>
                      {entry.badges} badges
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <div className="text-sm font-bold" style={{ color: colors.iconColor }}>
                      {entry.score.toLocaleString()}
                    </div>
                    <div className="text-xs" style={{ color: colors.textTertiary }}>
                      points
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
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
              <strong style={{ color: colors.textPrimary }}>Challenge Tips:</strong> Complete daily challenges for consistent XP gains. Join weekly competitions to climb the leaderboard. Challenge friends for friendly competition and mutual learning.
            </div>
          </div>
        </section>
      </div>

      {/* Create Challenge Modal */}
      {showCreateChallenge && (
        <div 
          className="fixed inset-0 bg-black/50 flex items-end sm:items-center justify-center z-50 p-4"
          onClick={() => setShowCreateChallenge(false)}
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
            aria-labelledby="create-challenge-title"
            aria-modal="true"
          >
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 id="create-challenge-title" className="text-xl font-bold mb-1" style={{ color: colors.textPrimary }}>
                  Create Custom Challenge
                </h3>
                <p className="text-sm" style={{ color: colors.textSecondary }}>
                  Design your own learning challenge
                </p>
              </div>
              <button
                onClick={() => setShowCreateChallenge(false)}
                className="p-2 rounded-lg"
                style={{ color: colors.textSecondary }}
                aria-label="Close create challenge"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold mb-2" style={{ color: colors.textPrimary }}>
                  Challenge Title
                </label>
                <input
                  type="text"
                  placeholder="Enter challenge name..."
                  className="w-full rounded-xl px-4 py-3 text-sm"
                  style={{
                    background: colors.cardHover,
                    border: colors.glassBorder,
                    color: colors.textPrimary,
                  }}
                  aria-label="Challenge title"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2" style={{ color: colors.textPrimary }}>
                  Description
                </label>
                <textarea
                  placeholder="Describe your challenge..."
                  rows={3}
                  className="w-full rounded-xl px-4 py-3 text-sm"
                  style={{
                    background: colors.cardHover,
                    border: colors.glassBorder,
                    color: colors.textPrimary,
                  }}
                  aria-label="Challenge description"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2" style={{ color: colors.textPrimary }}>
                  Difficulty
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {['easy', 'medium', 'hard', 'expert'].map((diff) => (
                    <button
                      key={diff}
                      className="py-2 px-3 rounded-lg text-sm font-semibold capitalize"
                      style={{
                        background: colors.cardHover,
                        border: colors.glassBorder,
                        color: colors.textSecondary,
                      }}
                      aria-label={`Set difficulty to ${diff}`}
                    >
                      {diff}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2" style={{ color: colors.textPrimary }}>
                  Target Goal
                </label>
                <input
                  type="number"
                  placeholder="e.g., 50 signs"
                  className="w-full rounded-xl px-4 py-3 text-sm"
                  style={{
                    background: colors.cardHover,
                    border: colors.glassBorder,
                    color: colors.textPrimary,
                  }}
                  aria-label="Target goal"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2" style={{ color: colors.textPrimary }}>
                  Reward (XP)
                </label>
                <input
                  type="number"
                  placeholder="e.g., 500"
                  className="w-full rounded-xl px-4 py-3 text-sm"
                  style={{
                    background: colors.cardHover,
                    border: colors.glassBorder,
                    color: colors.textPrimary,
                  }}
                  aria-label="XP reward amount"
                />
              </div>
            </div>

            <Button
              onClick={() => setShowCreateChallenge(false)}
              className="w-full h-12 rounded-xl font-semibold mt-6"
              style={{ 
                background: colors.iconColor,
                color: theme === 'dark' ? '#0F0F23' : '#FFFFFF',
              }}
              aria-label="Create challenge"
            >
              <Plus className="w-5 h-5 mr-2" />
              Create Challenge
            </Button>
          </div>
        </div>
      )}

      {/* Challenge Friend Modal */}
      {showChallengeFriend && (
        <div 
          className="fixed inset-0 bg-black/50 flex items-end sm:items-center justify-center z-50 p-4"
          onClick={() => setShowChallengeFriend(false)}
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
            aria-labelledby="challenge-friend-title"
            aria-modal="true"
          >
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 id="challenge-friend-title" className="text-xl font-bold mb-1" style={{ color: colors.textPrimary }}>
                  Challenge a Friend
                </h3>
                <p className="text-sm" style={{ color: colors.textSecondary }}>
                  Invite friends to compete
                </p>
              </div>
              <button
                onClick={() => setShowChallengeFriend(false)}
                className="p-2 rounded-lg"
                style={{ color: colors.textSecondary }}
                aria-label="Close challenge friend"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold mb-2" style={{ color: colors.textPrimary }}>
                  Select Friend
                </label>
                <div 
                  className="rounded-xl px-4 py-3 flex items-center gap-3"
                  style={{
                    background: colors.cardHover,
                    border: colors.glassBorder,
                  }}
                >
                  <Search className="w-5 h-5" style={{ color: colors.textTertiary }} />
                  <input
                    type="text"
                    placeholder="Search friends..."
                    className="flex-1 bg-transparent outline-none text-sm"
                    style={{ color: colors.textPrimary }}
                    aria-label="Search friends"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2" style={{ color: colors.textPrimary }}>
                  Challenge Type
                </label>
                <div className="space-y-2">
                  {['Accuracy Duel', 'Speed Challenge', 'Vocabulary Race', 'Perfect Week'].map((type) => (
                    <button
                      key={type}
                      className="w-full py-3 px-4 rounded-xl text-left text-sm font-semibold"
                      style={{
                        background: colors.cardHover,
                        border: colors.glassBorder,
                        color: colors.textPrimary,
                      }}
                      aria-label={`Select ${type} challenge type`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2" style={{ color: colors.textPrimary }}>
                  Stakes (XP)
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {['25', '50', '100', '200'].map((xp) => (
                    <button
                      key={xp}
                      className="py-2 px-3 rounded-lg text-sm font-semibold"
                      style={{
                        background: colors.warningBg,
                        color: colors.warningColor,
                      }}
                      aria-label={`Set stakes to ${xp} XP`}
                    >
                      {xp}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <Button
              onClick={() => setShowChallengeFriend(false)}
              className="w-full h-12 rounded-xl font-semibold mt-6"
              style={{ 
                background: colors.accentColor,
                color: '#FFFFFF',
              }}
              aria-label="Send challenge invitation"
            >
              <Send className="w-5 h-5 mr-2" />
              Send Challenge
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
