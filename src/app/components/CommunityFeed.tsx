import { useState } from 'react';
import { Button } from './ui/button';
import { useTheme } from '../context/ThemeContext';
import { useApp } from '../context/AppContext';
import { motion, AnimatePresence } from 'motion/react';
import { X, Heart, MessageCircle, Share2, Trophy, TrendingUp, Calendar, MapPin, Users, Award, Flame, Target, Send, ThumbsUp, MessageSquare, UserPlus, UserCheck, ChevronRight, Filter, Search, Bell, Plus } from 'lucide-react';

interface CommunityFeedProps {
  onExit: () => void;
}

interface Post {
  id: string;
  user: {
    name: string;
    username: string;
    avatar: string;
    isVerified?: boolean;
  };
  timestamp: string;
  content: string;
  type: 'achievement' | 'post' | 'challenge' | 'milestone';
  achievement?: {
    title: string;
    description: string;
    icon: string;
  };
  stats?: {
    likes: number;
    comments: number;
    shares: number;
  };
  liked?: boolean;
}

interface Challenge {
  id: string;
  title: string;
  description: string;
  difficulty: 'easy' | 'medium' | 'hard';
  participants: number;
  daysLeft: number;
  reward: string;
  progress?: number;
}

interface LeaderboardEntry {
  rank: number;
  user: {
    name: string;
    username: string;
    avatar: string;
  };
  score: number;
  streak: number;
  change: number; // Position change from last week
}

interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  type: 'meetup' | 'workshop' | 'conference' | 'social';
  attendees: number;
  isOnline: boolean;
}

interface ForumTopic {
  id: string;
  title: string;
  author: string;
  category: string;
  replies: number;
  views: number;
  lastActivity: string;
  isPinned?: boolean;
}

// Real community posts with ASL learning achievements
const posts: Post[] = [
  {
    id: 'p1',
    user: {
      name: 'Sarah Martinez',
      username: '@sarah_signs',
      avatar: 'SM',
      isVerified: true,
    },
    timestamp: '2 hours ago',
    content: 'Just completed my first conversation entirely in ASL! The Deaf community at the local cafe was so welcoming and patient. This journey has been incredible! 🤟',
    type: 'milestone',
    stats: {
      likes: 124,
      comments: 18,
      shares: 5,
    },
    liked: false,
  },
  {
    id: 'p2',
    user: {
      name: 'Marcus Johnson',
      username: '@marcusASL',
      avatar: 'MJ',
    },
    timestamp: '4 hours ago',
    content: 'Earned my ASL Foundations Certificate! 30 days of consistent practice really pays off. Next stop: Intermediate level! 💪',
    type: 'achievement',
    achievement: {
      title: 'ASL Foundations Certified',
      description: 'Completed all beginner lessons with 85% score',
      icon: 'award',
    },
    stats: {
      likes: 89,
      comments: 12,
      shares: 3,
    },
    liked: true,
  },
  {
    id: 'p3',
    user: {
      name: 'Emily Chen',
      username: '@emilylearns',
      avatar: 'EC',
    },
    timestamp: '6 hours ago',
    content: 'Reached 100-day streak! 🔥 The daily practice sessions have become my favorite part of the morning routine. Who else is on a streak?',
    type: 'achievement',
    achievement: {
      title: '100 Day Streak',
      description: 'Practiced ASL for 100 consecutive days',
      icon: 'flame',
    },
    stats: {
      likes: 156,
      comments: 24,
      shares: 8,
    },
    liked: true,
  },
  {
    id: 'p4',
    user: {
      name: 'David Park',
      username: '@davidPsigns',
      avatar: 'DP',
      isVerified: true,
    },
    timestamp: '8 hours ago',
    content: 'Attending the Deaf Culture Workshop this weekend! Can\'t wait to learn more about the history and meet native signers. Anyone else going?',
    type: 'post',
    stats: {
      likes: 67,
      comments: 15,
      shares: 4,
    },
    liked: false,
  },
  {
    id: 'p5',
    user: {
      name: 'Jessica Williams',
      username: '@jess_asl',
      avatar: 'JW',
    },
    timestamp: '12 hours ago',
    content: 'Challenge accepted! 🎯 Just started the "50 Signs in 7 Days" challenge. Day 1: Learned 8 new signs. This is going to be intense!',
    type: 'challenge',
    stats: {
      likes: 92,
      comments: 20,
      shares: 6,
    },
    liked: true,
  },
  {
    id: 'p6',
    user: {
      name: 'Alex Thompson',
      username: '@alexthompson',
      avatar: 'AT',
    },
    timestamp: '1 day ago',
    content: 'My daughter (who is Deaf) smiled when I signed "I love you" perfectly for the first time. This app has changed our family dynamic. Thank you to everyone in this community for the support! ❤️',
    type: 'milestone',
    stats: {
      likes: 342,
      comments: 45,
      shares: 18,
    },
    liked: true,
  },
];

// Active challenges
const challenges: Challenge[] = [
  {
    id: 'c1',
    title: '50 Signs in 7 Days',
    description: 'Master 50 new signs in one week. Perfect for building vocabulary quickly!',
    difficulty: 'hard',
    participants: 1284,
    daysLeft: 4,
    reward: '500 XP + Badge',
    progress: 32,
  },
  {
    id: 'c2',
    title: 'Daily Practice Streak',
    description: 'Practice ASL every day for 30 consecutive days',
    difficulty: 'medium',
    participants: 3567,
    daysLeft: 14,
    reward: 'Streak Badge',
    progress: 67,
  },
  {
    id: 'c3',
    title: 'Fingerspelling Master',
    description: 'Spell 100 words correctly without mistakes',
    difficulty: 'easy',
    participants: 892,
    daysLeft: 10,
    reward: '200 XP',
  },
  {
    id: 'c4',
    title: 'Story Mode Champion',
    description: 'Complete all 6 chapters with perfect scores',
    difficulty: 'hard',
    participants: 456,
    daysLeft: 20,
    reward: 'Champion Badge + 1000 XP',
  },
];

// Leaderboard data
const leaderboard: LeaderboardEntry[] = [
  {
    rank: 1,
    user: {
      name: 'Taylor Swift',
      username: '@taylorASL',
      avatar: 'TS',
    },
    score: 15680,
    streak: 145,
    change: 0, // Maintained position
  },
  {
    rank: 2,
    user: {
      name: 'Jordan Lee',
      username: '@jordanL',
      avatar: 'JL',
    },
    score: 14920,
    streak: 132,
    change: 1, // Moved up 1 position
  },
  {
    rank: 3,
    user: {
      name: 'Sam Rivera',
      username: '@samr',
      avatar: 'SR',
    },
    score: 14350,
    streak: 98,
    change: -1, // Dropped 1 position
  },
  {
    rank: 4,
    user: {
      name: 'You',
      username: '@yourname',
      avatar: 'YO',
    },
    score: 12840,
    streak: 89,
    change: 2,
  },
  {
    rank: 5,
    user: {
      name: 'Morgan Davis',
      username: '@morgand',
      avatar: 'MD',
    },
    score: 11970,
    streak: 76,
    change: -1,
  },
];

// Deaf community events
const events: Event[] = [
  {
    id: 'e1',
    title: 'ASL Coffee Chat',
    description: 'Casual meetup for ASL learners and native signers. All skill levels welcome!',
    date: 'Jan 15, 2024',
    time: '10:00 AM - 12:00 PM',
    location: 'Starbucks Downtown',
    type: 'meetup',
    attendees: 24,
    isOnline: false,
  },
  {
    id: 'e2',
    title: 'Deaf Culture Workshop',
    description: 'Learn about Deaf history, culture, and etiquette from community leaders.',
    date: 'Jan 18, 2024',
    time: '6:00 PM - 8:00 PM',
    location: 'Community Center',
    type: 'workshop',
    attendees: 45,
    isOnline: false,
  },
  {
    id: 'e3',
    title: 'Virtual ASL Game Night',
    description: 'Practice your signing skills while playing games with the community!',
    date: 'Jan 20, 2024',
    time: '7:00 PM - 9:00 PM',
    location: 'Zoom',
    type: 'social',
    attendees: 67,
    isOnline: true,
  },
  {
    id: 'e4',
    title: 'Deaf Film Festival',
    description: 'Screening of award-winning films by Deaf filmmakers with ASL interpretation.',
    date: 'Jan 25, 2024',
    time: '2:00 PM - 6:00 PM',
    location: 'City Theater',
    type: 'conference',
    attendees: 156,
    isOnline: false,
  },
  {
    id: 'e5',
    title: 'ASL Poetry Slam',
    description: 'Experience the beauty of ASL poetry performed by talented signers.',
    date: 'Feb 1, 2024',
    time: '7:30 PM - 9:30 PM',
    location: 'Arts Center',
    type: 'social',
    attendees: 89,
    isOnline: false,
  },
];

// Forum topics
const forumTopics: ForumTopic[] = [
  {
    id: 'f1',
    title: 'Tips for remembering similar signs?',
    author: 'Sarah M.',
    category: 'Learning Tips',
    replies: 23,
    views: 456,
    lastActivity: '2h ago',
  },
  {
    id: 'f2',
    title: 'Best resources for learning Deaf history',
    author: 'Marcus J.',
    category: 'Deaf Culture',
    replies: 34,
    views: 678,
    lastActivity: '4h ago',
    isPinned: true,
  },
  {
    id: 'f3',
    title: 'How to practice with native signers?',
    author: 'Emily C.',
    category: 'Practice',
    replies: 45,
    views: 892,
    lastActivity: '6h ago',
    isPinned: true,
  },
  {
    id: 'f4',
    title: 'ASL vs SEE: Understanding the differences',
    author: 'David P.',
    category: 'Discussion',
    replies: 56,
    views: 1234,
    lastActivity: '8h ago',
  },
  {
    id: 'f5',
    title: 'Preparing for ASLPI certification',
    author: 'Jessica W.',
    category: 'Certifications',
    replies: 28,
    views: 567,
    lastActivity: '1d ago',
  },
];

type TabType = 'feed' | 'challenges' | 'leaderboard' | 'events' | 'forums' | 'following';

export function CommunityFeed({ onExit }: CommunityFeedProps) {
  const { theme } = useTheme();
  const { userProgress } = useApp();
  const [activeTab, setActiveTab] = useState<TabType>('feed');
  const [postLikes, setPostLikes] = useState<Record<string, boolean>>({});
  const [selectedChallenge, setSelectedChallenge] = useState<Challenge | null>(null);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [followingCount] = useState(45);
  const [followersCount] = useState(67);

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

  const handleLike = (postId: string) => {
    setPostLikes(prev => ({ ...prev, [postId]: !prev[postId] }));
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return colors.successColor;
      case 'medium': return colors.warningColor;
      case 'hard': return colors.accentColor;
      default: return colors.iconColor;
    }
  };

  const tabs = [
    { id: 'feed' as TabType, label: 'Feed', icon: MessageSquare },
    { id: 'challenges' as TabType, label: 'Challenges', icon: Target },
    { id: 'leaderboard' as TabType, label: 'Rankings', icon: Trophy },
    { id: 'events' as TabType, label: 'Events', icon: Calendar },
    { id: 'forums' as TabType, label: 'Forums', icon: MessageCircle },
  ];

  return (
    <div 
      className="h-full flex flex-col"
      style={{ background: colors.bg, color: colors.textPrimary }}
      role="main"
      aria-labelledby="community-title"
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
              id="community-title" 
              className="text-xl sm:text-2xl font-bold"
              style={{ fontFamily: 'Poppins, sans-serif' }}
            >
              Community
            </h1>
            <p className="text-sm" style={{ color: colors.textSecondary }}>
              Connect with ASL learners worldwide
            </p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            style={{ color: colors.textSecondary }}
            aria-label="Notifications"
          >
            <Bell className="w-6 h-6" />
          </Button>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 overflow-x-auto pb-2" role="tablist" aria-label="Community sections">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className="px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all flex items-center gap-2"
                style={{
                  background: activeTab === tab.id ? colors.iconColor : colors.cardBg,
                  color: activeTab === tab.id 
                    ? (theme === 'dark' ? 'var(--color-bg-deep)' : '#FFFFFF')
                    : colors.textPrimary,
                  border: colors.glassBorder,
                }}
                role="tab"
                aria-selected={activeTab === tab.id}
                aria-controls={`${tab.id}-panel`}
              >
                <Icon className="w-4 h-4" aria-hidden="true" />
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Feed Tab */}
      {activeTab === 'feed' && (
        <div 
          className="flex-1 overflow-y-auto p-4 sm:p-6"
          role="tabpanel"
          id="feed-panel"
          aria-labelledby="feed-tab"
        >
          {/* New Post Button */}
          <Button
            className="w-full h-12 rounded-full font-semibold mb-4"
            style={{
              background: colors.iconColor,
              color: theme === 'dark' ? 'var(--color-bg-deep)' : '#FFFFFF',
            }}
            aria-label="Create new post"
          >
            <Plus className="w-5 h-5 mr-2" aria-hidden="true" />
            Share Your Progress
          </Button>

          {/* Posts */}
          <div className="space-y-4">
            {posts.map((post, index) => {
              const isLiked = postLikes[post.id] !== undefined ? postLikes[post.id] : post.liked;
              
              return (
                <motion.article
                  key={post.id}
                  className="rounded-xl overflow-hidden"
                  style={{
                    background: colors.cardBg,
                    backdropFilter: colors.blur,
                    WebkitBackdropFilter: colors.blur,
                    border: colors.glassBorder,
                    boxShadow: colors.shadow,
                  }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  {/* Post Header */}
                  <div className="p-4">
                    <div className="flex items-start gap-3 mb-3">
                      <div 
                        className="w-10 h-10 rounded-full flex items-center justify-center font-semibold flex-shrink-0"
                        style={{ background: colors.iconBg, color: colors.iconColor }}
                        aria-hidden="true"
                      >
                        {post.user.avatar}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold text-sm" style={{ color: colors.textPrimary }}>
                            {post.user.name}
                          </h3>
                          {post.user.isVerified && (
                            <Award className="w-4 h-4 flex-shrink-0" style={{ color: colors.iconColor }} aria-label="Verified user" />
                          )}
                        </div>
                        <div className="text-xs" style={{ color: colors.textTertiary }}>
                          {post.user.username} · {post.timestamp}
                        </div>
                      </div>
                    </div>

                    {/* Post Content */}
                    <p className="text-sm leading-relaxed mb-3" style={{ color: colors.textSecondary }}>
                      {post.content}
                    </p>

                    {/* Achievement Badge */}
                    {post.achievement && (
                      <div 
                        className="rounded-lg p-3 mb-3"
                        style={{ background: colors.warningBg, border: `1px solid ${colors.warningColor}` }}
                      >
                        <div className="flex items-center gap-3">
                          <div 
                            className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0"
                            style={{ background: colors.warningColor }}
                          >
                            {post.achievement.icon === 'award' && (
                              <Award className="w-6 h-6" style={{ color: theme === 'dark' ? 'var(--color-bg-deep)' : '#FFFFFF' }} aria-hidden="true" />
                            )}
                            {post.achievement.icon === 'flame' && (
                              <Flame className="w-6 h-6" style={{ color: theme === 'dark' ? 'var(--color-bg-deep)' : '#FFFFFF' }} aria-hidden="true" />
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="font-semibold text-sm mb-1" style={{ color: colors.textPrimary }}>
                              {post.achievement.title}
                            </div>
                            <div className="text-xs" style={{ color: colors.textSecondary }}>
                              {post.achievement.description}
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Post Actions */}
                    {post.stats && (
                      <div className="flex items-center gap-4 pt-3 border-t" style={{ borderColor: colors.border }}>
                        <button
                          onClick={() => handleLike(post.id)}
                          className="flex items-center gap-2 text-sm transition-colors"
                          style={{ color: isLiked ? colors.accentColor : colors.textTertiary }}
                          aria-label={`${isLiked ? 'Unlike' : 'Like'} post. ${post.stats.likes + (isLiked && !post.liked ? 1 : 0)} likes`}
                          aria-pressed={isLiked}
                        >
                          <Heart className={`w-5 h-5 ${isLiked ? 'fill-current' : ''}`} aria-hidden="true" />
                          <span>{post.stats.likes + (isLiked && !post.liked ? 1 : !isLiked && post.liked ? -1 : 0)}</span>
                        </button>

                        <button
                          className="flex items-center gap-2 text-sm"
                          style={{ color: colors.textTertiary }}
                          aria-label={`View ${post.stats.comments} comments`}
                        >
                          <MessageCircle className="w-5 h-5" aria-hidden="true" />
                          <span>{post.stats.comments}</span>
                        </button>

                        <button
                          className="flex items-center gap-2 text-sm"
                          style={{ color: colors.textTertiary }}
                          aria-label={`Share post. ${post.stats.shares} shares`}
                        >
                          <Share2 className="w-5 h-5" aria-hidden="true" />
                          <span>{post.stats.shares}</span>
                        </button>
                      </div>
                    )}
                  </div>
                </motion.article>
              );
            })}
          </div>
        </div>
      )}

      {/* Challenges Tab */}
      {activeTab === 'challenges' && (
        <div 
          className="flex-1 overflow-y-auto p-4 sm:p-6"
          role="tabpanel"
          id="challenges-panel"
          aria-labelledby="challenges-tab"
        >
          <div className="mb-4">
            <h2 className="text-lg font-semibold mb-1">Active Challenges</h2>
            <p className="text-sm" style={{ color: colors.textSecondary }}>
              Join challenges to earn XP and badges
            </p>
          </div>

          <div className="space-y-4">
            {challenges.map((challenge, index) => (
              <motion.div
                key={challenge.id}
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
                transition={{ delay: index * 0.05 }}
              >
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold text-base" style={{ color: colors.textPrimary }}>
                        {challenge.title}
                      </h3>
                      <span 
                        className="px-2 py-0.5 rounded-full text-xs font-semibold capitalize"
                        style={{
                          background: `${getDifficultyColor(challenge.difficulty)}20`,
                          color: getDifficultyColor(challenge.difficulty),
                        }}
                      >
                        {challenge.difficulty}
                      </span>
                    </div>
                    <p className="text-sm mb-2" style={{ color: colors.textSecondary }}>
                      {challenge.description}
                    </p>
                  </div>
                </div>

                {/* Challenge Stats */}
                <div className="grid grid-cols-3 gap-3 mb-3 text-xs">
                  <div>
                    <div className="font-semibold mb-1" style={{ color: colors.textTertiary }}>
                      Participants
                    </div>
                    <div className="flex items-center gap-1" style={{ color: colors.textPrimary }}>
                      <Users className="w-3 h-3" aria-hidden="true" />
                      <span>{challenge.participants.toLocaleString()}</span>
                    </div>
                  </div>
                  <div>
                    <div className="font-semibold mb-1" style={{ color: colors.textTertiary }}>
                      Time Left
                    </div>
                    <div className="flex items-center gap-1" style={{ color: colors.textPrimary }}>
                      <Calendar className="w-3 h-3" aria-hidden="true" />
                      <span>{challenge.daysLeft} days</span>
                    </div>
                  </div>
                  <div>
                    <div className="font-semibold mb-1" style={{ color: colors.textTertiary }}>
                      Reward
                    </div>
                    <div className="flex items-center gap-1" style={{ color: colors.textPrimary }}>
                      <Trophy className="w-3 h-3" aria-hidden="true" />
                      <span className="truncate">{challenge.reward}</span>
                    </div>
                  </div>
                </div>

                {/* Progress */}
                {challenge.progress !== undefined && (
                  <div className="mb-3">
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span style={{ color: colors.textTertiary }}>Your Progress</span>
                      <span style={{ color: colors.iconColor }} className="font-semibold">
                        {challenge.progress}%
                      </span>
                    </div>
                    <div 
                      className="h-2 rounded-full overflow-hidden"
                      style={{ background: colors.iconBg }}
                      role="progressbar"
                      aria-valuenow={challenge.progress}
                      aria-valuemin={0}
                      aria-valuemax={100}
                      aria-label={`Challenge progress: ${challenge.progress}%`}
                    >
                      <div 
                        className="h-full transition-all"
                        style={{ 
                          background: colors.iconColor,
                          width: `${challenge.progress}%`,
                        }}
                      />
                    </div>
                  </div>
                )}

                {/* Action Button */}
                <Button
                  onClick={() => setSelectedChallenge(challenge)}
                  className="w-full h-10 rounded-full font-semibold"
                  style={{
                    background: challenge.progress !== undefined ? colors.cardBg : colors.iconColor,
                    color: challenge.progress !== undefined 
                      ? colors.textPrimary 
                      : (theme === 'dark' ? 'var(--color-bg-deep)' : '#FFFFFF'),
                    border: colors.glassBorder,
                  }}
                  aria-label={challenge.progress !== undefined ? `Continue ${challenge.title}` : `Join ${challenge.title}`}
                >
                  {challenge.progress !== undefined ? 'Continue' : 'Join Challenge'}
                </Button>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Leaderboard Tab */}
      {activeTab === 'leaderboard' && (
        <div 
          className="flex-1 overflow-y-auto p-4 sm:p-6"
          role="tabpanel"
          id="leaderboard-panel"
          aria-labelledby="leaderboard-tab"
        >
          <div className="mb-4">
            <h2 className="text-lg font-semibold mb-1">Weekly Rankings</h2>
            <p className="text-sm" style={{ color: colors.textSecondary }}>
              Top learners this week
            </p>
          </div>

          <div className="space-y-3">
            {leaderboard.map((entry, index) => (
              <motion.div
                key={entry.rank}
                className="rounded-xl p-4"
                style={{
                  background: entry.user.name === 'You' 
                    ? `${colors.iconColor}20`
                    : colors.cardBg,
                  backdropFilter: colors.blur,
                  WebkitBackdropFilter: colors.blur,
                  border: entry.user.name === 'You' 
                    ? `2px solid ${colors.iconColor}`
                    : colors.glassBorder,
                  boxShadow: colors.shadow,
                }}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <div className="flex items-center gap-3">
                  {/* Rank */}
                  <div 
                    className="w-10 h-10 rounded-full flex items-center justify-center font-bold flex-shrink-0"
                    style={{
                      background: entry.rank <= 3 ? colors.warningColor : colors.iconBg,
                      color: entry.rank <= 3 ? (theme === 'dark' ? 'var(--color-bg-deep)' : '#FFFFFF') : colors.iconColor,
                    }}
                    aria-label={`Rank ${entry.rank}`}
                  >
                    {entry.rank <= 3 ? (
                      <Trophy className="w-5 h-5" aria-hidden="true" />
                    ) : (
                      `#${entry.rank}`
                    )}
                  </div>

                  {/* User Avatar */}
                  <div 
                    className="w-10 h-10 rounded-full flex items-center justify-center font-semibold flex-shrink-0"
                    style={{ background: colors.accentBg, color: colors.accentColor }}
                    aria-hidden="true"
                  >
                    {entry.user.avatar}
                  </div>

                  {/* User Info */}
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-sm mb-1" style={{ color: colors.textPrimary }}>
                      {entry.user.name}
                    </div>
                    <div className="flex items-center gap-3 text-xs" style={{ color: colors.textTertiary }}>
                      <span className="flex items-center gap-1">
                        <Target className="w-3 h-3" aria-hidden="true" />
                        {entry.score.toLocaleString()} XP
                      </span>
                      <span className="flex items-center gap-1">
                        <Flame className="w-3 h-3" aria-hidden="true" />
                        {entry.streak} days
                      </span>
                    </div>
                  </div>

                  {/* Change Indicator */}
                  {entry.change !== 0 && (
                    <div 
                      className="flex items-center gap-1 text-xs font-semibold"
                      style={{ color: entry.change > 0 ? colors.successColor : colors.accentColor }}
                      aria-label={entry.change > 0 ? `Up ${entry.change} positions` : `Down ${Math.abs(entry.change)} positions`}
                    >
                      <TrendingUp 
                        className={`w-4 h-4 ${entry.change < 0 ? 'rotate-180' : ''}`} 
                        aria-hidden="true"
                      />
                      {Math.abs(entry.change)}
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Events Tab */}
      {activeTab === 'events' && (
        <div 
          className="flex-1 overflow-y-auto p-4 sm:p-6"
          role="tabpanel"
          id="events-panel"
          aria-labelledby="events-tab"
        >
          <div className="mb-4">
            <h2 className="text-lg font-semibold mb-1">Upcoming Events</h2>
            <p className="text-sm" style={{ color: colors.textSecondary }}>
              Connect with the Deaf community
            </p>
          </div>

          <div className="space-y-4">
            {events.map((event, index) => (
              <motion.article
                key={event.id}
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
                transition={{ delay: index * 0.05 }}
              >
                <div className="flex items-start gap-3 mb-3">
                  <div 
                    className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{ background: colors.iconBg }}
                    aria-hidden="true"
                  >
                    <Calendar className="w-6 h-6" style={{ color: colors.iconColor }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-base mb-1" style={{ color: colors.textPrimary }}>
                      {event.title}
                    </h3>
                    <p className="text-sm mb-2" style={{ color: colors.textSecondary }}>
                      {event.description}
                    </p>
                  </div>
                </div>

                {/* Event Details */}
                <div className="space-y-2 mb-3 text-sm">
                  <div className="flex items-center gap-2" style={{ color: colors.textSecondary }}>
                    <Calendar className="w-4 h-4 flex-shrink-0" style={{ color: colors.iconColor }} aria-hidden="true" />
                    <span>{event.date} at {event.time}</span>
                  </div>
                  <div className="flex items-center gap-2" style={{ color: colors.textSecondary }}>
                    <MapPin className="w-4 h-4 flex-shrink-0" style={{ color: colors.iconColor }} aria-hidden="true" />
                    <span>
                      {event.location}
                      {event.isOnline && (
                        <span 
                          className="ml-2 px-2 py-0.5 rounded-full text-xs font-semibold"
                          style={{ background: colors.successBg, color: colors.successColor }}
                        >
                          Online
                        </span>
                      )}
                    </span>
                  </div>
                  <div className="flex items-center gap-2" style={{ color: colors.textSecondary }}>
                    <Users className="w-4 h-4 flex-shrink-0" style={{ color: colors.iconColor }} aria-hidden="true" />
                    <span>{event.attendees} attending</span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2">
                  <Button
                    onClick={() => setSelectedEvent(event)}
                    className="flex-1 h-10 rounded-full font-semibold"
                    style={{
                      background: colors.iconColor,
                      color: theme === 'dark' ? 'var(--color-bg-deep)' : '#FFFFFF',
                    }}
                    aria-label={`Register for ${event.title}`}
                  >
                    Register
                  </Button>
                  <Button
                    className="h-10 px-4 rounded-full"
                    style={{
                      background: colors.cardBg,
                      color: colors.textPrimary,
                      border: colors.glassBorder,
                    }}
                    aria-label={`Share ${event.title}`}
                  >
                    <Share2 className="w-4 h-4" aria-hidden="true" />
                  </Button>
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      )}

      {/* Forums Tab */}
      {activeTab === 'forums' && (
        <div 
          className="flex-1 overflow-y-auto p-4 sm:p-6"
          role="tabpanel"
          id="forums-panel"
          aria-labelledby="forums-tab"
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-lg font-semibold mb-1">Discussion Forums</h2>
              <p className="text-sm" style={{ color: colors.textSecondary }}>
                Ask questions and share knowledge
              </p>
            </div>
            <Button
              className="h-10 px-4 rounded-full font-semibold"
              style={{
                background: colors.iconColor,
                color: theme === 'dark' ? 'var(--color-bg-deep)' : '#FFFFFF',
              }}
              aria-label="Create new topic"
            >
              <Plus className="w-4 h-4" aria-hidden="true" />
            </Button>
          </div>

          <div className="space-y-3">
            {forumTopics.map((topic, index) => (
              <motion.button
                key={topic.id}
                className="w-full rounded-xl p-4 text-left transition-colors"
                style={{
                  background: colors.cardBg,
                  backdropFilter: colors.blur,
                  WebkitBackdropFilter: colors.blur,
                  border: topic.isPinned ? `2px solid ${colors.iconColor}` : colors.glassBorder,
                  boxShadow: colors.shadow,
                }}
                onMouseEnter={(e) => e.currentTarget.style.background = colors.cardHover}
                onMouseLeave={(e) => e.currentTarget.style.background = colors.cardBg}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                aria-label={`${topic.title}. ${topic.replies} replies, ${topic.views} views. Last activity ${topic.lastActivity}`}
              >
                <div className="flex items-start justify-between gap-3 mb-2">
                  <h3 className="font-semibold text-sm flex-1" style={{ color: colors.textPrimary }}>
                    {topic.title}
                  </h3>
                  {topic.isPinned && (
                    <Award className="w-4 h-4 flex-shrink-0" style={{ color: colors.iconColor }} aria-label="Pinned topic" />
                  )}
                </div>

                <div className="flex items-center gap-3 text-xs mb-2" style={{ color: colors.textTertiary }}>
                  <span>{topic.author}</span>
                  <span>•</span>
                  <span 
                    className="px-2 py-0.5 rounded-full"
                    style={{ background: colors.iconBg, color: colors.iconColor }}
                  >
                    {topic.category}
                  </span>
                </div>

                <div className="flex items-center justify-between text-xs" style={{ color: colors.textTertiary }}>
                  <div className="flex items-center gap-3">
                    <span className="flex items-center gap-1">
                      <MessageCircle className="w-3 h-3" aria-hidden="true" />
                      {topic.replies}
                    </span>
                    <span className="flex items-center gap-1">
                      <Users className="w-3 h-3" aria-hidden="true" />
                      {topic.views}
                    </span>
                  </div>
                  <span>Last: {topic.lastActivity}</span>
                </div>
              </motion.button>
            ))}
          </div>
        </div>
      )}

      {/* Event Registration Modal */}
      <AnimatePresence>
        {selectedEvent && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{ background: 'rgba(0, 0, 0, 0.8)' }}
            onClick={() => setSelectedEvent(null)}
            role="dialog"
            aria-labelledby="event-modal-title"
            aria-modal="true"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="w-full max-w-md rounded-2xl p-6"
              style={{ background: colors.cardBg }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-4">
                <h2 id="event-modal-title" className="text-xl font-bold" style={{ color: colors.textPrimary }}>
                  Register for Event
                </h2>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setSelectedEvent(null)}
                  style={{ color: colors.textSecondary }}
                  aria-label="Close dialog"
                >
                  <X className="w-6 h-6" />
                </Button>
              </div>

              <div className="mb-6">
                <h3 className="font-semibold text-lg mb-2" style={{ color: colors.textPrimary }}>
                  {selectedEvent.title}
                </h3>
                <p className="text-sm mb-4" style={{ color: colors.textSecondary }}>
                  {selectedEvent.description}
                </p>

                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2" style={{ color: colors.textSecondary }}>
                    <Calendar className="w-4 h-4" style={{ color: colors.iconColor }} aria-hidden="true" />
                    <span>{selectedEvent.date} at {selectedEvent.time}</span>
                  </div>
                  <div className="flex items-center gap-2" style={{ color: colors.textSecondary }}>
                    <MapPin className="w-4 h-4" style={{ color: colors.iconColor }} aria-hidden="true" />
                    <span>{selectedEvent.location}</span>
                  </div>
                </div>
              </div>

              <Button
                onClick={() => {
                  alert(`Successfully registered for ${selectedEvent.title}!`);
                  setSelectedEvent(null);
                }}
                className="w-full h-12 rounded-full font-semibold"
                style={{
                  background: colors.iconColor,
                  color: theme === 'dark' ? 'var(--color-bg-deep)' : '#FFFFFF',
                }}
                aria-label="Confirm registration"
              >
                Confirm Registration
              </Button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
