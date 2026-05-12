import { useState } from 'react';
import { Button } from './ui/button';
import { useTheme } from '../context/ThemeContext';
import { useApp } from '../context/AppContext';
import { motion, AnimatePresence } from 'motion/react';
import { X, Search, UserPlus, UserCheck, UserX, Trophy, Target, Flame, TrendingUp, MessageCircle, Video, Users, Filter, Star, Award, ChevronRight, Send, Check, XCircle as XIcon } from 'lucide-react';

interface FriendsConnectionsProps {
  onExit: () => void;
}

interface Friend {
  id: string;
  name: string;
  username: string;
  avatar: string;
  level: number;
  xp: number;
  streak: number;
  status: 'online' | 'offline' | 'learning';
  lastActive?: string;
  mutualFriends?: number;
  currentLesson?: string;
  progressStats: {
    totalSigns: number;
    lessonsCompleted: number;
    averageScore: number;
  };
  isFriend?: boolean;
  isPending?: boolean;
  isSent?: boolean;
}

interface Challenge {
  id: string;
  challenger: string;
  challengerAvatar: string;
  challenged: string;
  challengedAvatar: string;
  type: 'vocabulary' | 'speed' | 'accuracy' | 'streak';
  status: 'pending' | 'active' | 'completed';
  challengerScore?: number;
  challengedScore?: number;
  endDate?: string;
  reward: string;
}

interface PracticePartner {
  id: string;
  name: string;
  username: string;
  avatar: string;
  level: number;
  compatibility: number; // 0-100
  sharedGoals: string[];
  availableTimes: string[];
  preferredLanguage: string;
  bio: string;
}

// Real friends data
const friends: Friend[] = [
  {
    id: 'f1',
    name: 'Emily Rodriguez',
    username: '@emily_asl',
    avatar: 'ER',
    level: 12,
    xp: 8450,
    streak: 45,
    status: 'online',
    currentLesson: 'Deaf Culture Basics',
    progressStats: {
      totalSigns: 342,
      lessonsCompleted: 28,
      averageScore: 89,
    },
    isFriend: true,
  },
  {
    id: 'f2',
    name: 'Marcus Chen',
    username: '@marcuslearns',
    avatar: 'MC',
    level: 15,
    xp: 12680,
    streak: 67,
    status: 'learning',
    currentLesson: 'Advanced Grammar',
    progressStats: {
      totalSigns: 456,
      lessonsCompleted: 42,
      averageScore: 92,
    },
    isFriend: true,
  },
  {
    id: 'f3',
    name: 'Sarah Williams',
    username: '@sarahsigns',
    avatar: 'SW',
    level: 10,
    xp: 6890,
    streak: 34,
    status: 'offline',
    lastActive: '2h ago',
    progressStats: {
      totalSigns: 289,
      lessonsCompleted: 22,
      averageScore: 85,
    },
    isFriend: true,
  },
  {
    id: 'f4',
    name: 'David Park',
    username: '@davidP',
    avatar: 'DP',
    level: 18,
    xp: 15420,
    streak: 89,
    status: 'online',
    currentLesson: 'ASL Poetry',
    progressStats: {
      totalSigns: 567,
      lessonsCompleted: 56,
      averageScore: 95,
    },
    isFriend: true,
  },
  {
    id: 'f5',
    name: 'Jessica Taylor',
    username: '@jess_asl',
    avatar: 'JT',
    level: 8,
    xp: 4230,
    streak: 23,
    status: 'offline',
    lastActive: '1d ago',
    progressStats: {
      totalSigns: 198,
      lessonsCompleted: 15,
      averageScore: 81,
    },
    isFriend: true,
  },
];

// Friend requests (received)
const friendRequests: Friend[] = [
  {
    id: 'r1',
    name: 'Alex Thompson',
    username: '@alexthompson',
    avatar: 'AT',
    level: 11,
    xp: 7560,
    streak: 41,
    status: 'online',
    mutualFriends: 3,
    progressStats: {
      totalSigns: 312,
      lessonsCompleted: 25,
      averageScore: 87,
    },
    isPending: true,
  },
  {
    id: 'r2',
    name: 'Jordan Lee',
    username: '@jordanL',
    avatar: 'JL',
    level: 9,
    xp: 5890,
    streak: 28,
    status: 'offline',
    lastActive: '4h ago',
    mutualFriends: 5,
    progressStats: {
      totalSigns: 245,
      lessonsCompleted: 18,
      averageScore: 83,
    },
    isPending: true,
  },
];

// Sent requests
const sentRequests: Friend[] = [
  {
    id: 's1',
    name: 'Morgan Davis',
    username: '@morgand',
    avatar: 'MD',
    level: 14,
    xp: 10230,
    streak: 56,
    status: 'learning',
    currentLesson: 'Fingerspelling Master',
    progressStats: {
      totalSigns: 423,
      lessonsCompleted: 35,
      averageScore: 91,
    },
    isSent: true,
  },
];

// Practice partner suggestions
const practicePartners: PracticePartner[] = [
  {
    id: 'p1',
    name: 'Taylor Martinez',
    username: '@taylorm',
    avatar: 'TM',
    level: 11,
    compatibility: 95,
    sharedGoals: ['Daily Practice', 'Deaf Culture', 'Conversational ASL'],
    availableTimes: ['Evenings', 'Weekends'],
    preferredLanguage: 'ASL',
    bio: 'Learning ASL to communicate with my Deaf nephew. Love practicing conversations!',
  },
  {
    id: 'p2',
    name: 'Sam Rivera',
    username: '@samr',
    avatar: 'SR',
    level: 10,
    compatibility: 88,
    sharedGoals: ['Grammar Focus', 'Vocabulary Building'],
    availableTimes: ['Mornings', 'Afternoons'],
    preferredLanguage: 'ASL',
    bio: 'Studying to become an ASL interpreter. Looking for serious practice partners.',
  },
  {
    id: 'p3',
    name: 'Casey Johnson',
    username: '@caseyj',
    avatar: 'CJ',
    level: 9,
    compatibility: 82,
    sharedGoals: ['Beginner Practice', 'Fingerspelling'],
    availableTimes: ['Flexible'],
    preferredLanguage: 'ASL',
    bio: 'New to ASL but super motivated! Would love to practice with others at my level.',
  },
];

// Active challenges
const challenges: Challenge[] = [
  {
    id: 'c1',
    challenger: 'You',
    challengerAvatar: 'YO',
    challenged: 'Emily Rodriguez',
    challengedAvatar: 'ER',
    type: 'vocabulary',
    status: 'active',
    challengerScore: 42,
    challengedScore: 38,
    endDate: '2024-01-15',
    reward: '500 XP',
  },
  {
    id: 'c2',
    challenger: 'Marcus Chen',
    challengerAvatar: 'MC',
    challenged: 'You',
    challengedAvatar: 'YO',
    type: 'streak',
    status: 'active',
    challengerScore: 67,
    challengedScore: 45,
    endDate: '2024-01-20',
    reward: 'Streak Master Badge',
  },
  {
    id: 'c3',
    challenger: 'David Park',
    challengerAvatar: 'DP',
    challenged: 'You',
    challengedAvatar: 'YO',
    type: 'speed',
    status: 'pending',
    endDate: '2024-01-18',
    reward: '300 XP',
  },
];

type TabType = 'friends' | 'requests' | 'find' | 'challenges';

export function FriendsConnections({ onExit }: FriendsConnectionsProps) {
  const { theme } = useTheme();
  const { userProgress } = useApp();
  const [activeTab, setActiveTab] = useState<TabType>('friends');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFriend, setSelectedFriend] = useState<Friend | null>(null);
  const [friendsList, setFriendsList] = useState(friends);
  const [requestsList, setRequestsList] = useState(friendRequests);
  const [sentList, setSentList] = useState(sentRequests);
  const [showChallengeModal, setShowChallengeModal] = useState(false);
  const [selectedChallengeType, setSelectedChallengeType] = useState<'vocabulary' | 'speed' | 'accuracy' | 'streak'>('vocabulary');

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

  const handleAcceptRequest = (requestId: string) => {
    const request = requestsList.find(r => r.id === requestId);
    if (request) {
      setFriendsList([...friendsList, { ...request, isFriend: true, isPending: false }]);
      setRequestsList(requestsList.filter(r => r.id !== requestId));
    }
  };

  const handleDeclineRequest = (requestId: string) => {
    setRequestsList(requestsList.filter(r => r.id !== requestId));
  };

  const handleCancelRequest = (requestId: string) => {
    setSentList(sentList.filter(r => r.id !== requestId));
  };

  const handleRemoveFriend = (friendId: string) => {
    setFriendsList(friendsList.filter(f => f.id !== friendId));
    setSelectedFriend(null);
  };

  const handleSendPartnerRequest = (partnerId: string) => {
    alert(`Friend request sent to partner ${partnerId}!`);
  };

  const handleChallengeRequest = (friendId: string, type: string) => {
    alert(`Challenge sent to friend ${friendId} for ${type}!`);
    setShowChallengeModal(false);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online': return colors.successColor;
      case 'learning': return colors.warningColor;
      case 'offline': return colors.textTertiary;
      default: return colors.textTertiary;
    }
  };

  const getStatusText = (friend: Friend) => {
    if (friend.status === 'online') return 'Online';
    if (friend.status === 'learning') return `Learning: ${friend.currentLesson}`;
    return `Last active: ${friend.lastActive}`;
  };

  const tabs = [
    { id: 'friends' as TabType, label: 'Friends', icon: Users, count: friendsList.length },
    { id: 'requests' as TabType, label: 'Requests', icon: UserPlus, count: requestsList.length },
    { id: 'find' as TabType, label: 'Find Partners', icon: Search, count: 0 },
    { id: 'challenges' as TabType, label: 'Challenges', icon: Trophy, count: challenges.filter(c => c.status === 'pending').length },
  ];

  return (
    <div 
      className="h-full flex flex-col"
      style={{ background: colors.bg, color: colors.textPrimary }}
      role="main"
      aria-labelledby="friends-title"
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
              id="friends-title" 
              className="text-xl sm:text-2xl font-bold"
              style={{ fontFamily: 'Poppins, sans-serif' }}
            >
              Friends & Partners
            </h1>
            <p className="text-sm" style={{ color: colors.textSecondary }}>
              Connect and learn together
            </p>
          </div>
        </div>

        {/* Search Bar */}
        <div className="relative mb-4">
          <Search 
            className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5" 
            style={{ color: colors.textTertiary }} 
            aria-hidden="true"
          />
          <input
            type="text"
            placeholder="Search friends..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-12 pl-10 pr-4 rounded-full text-sm"
            style={{
              background: colors.cardBg,
              border: colors.glassBorder,
              color: colors.textPrimary,
              outline: 'none',
            }}
            aria-label="Search friends"
          />
        </div>

        {/* Tabs */}
        <div className="flex gap-2 overflow-x-auto pb-2" role="tablist" aria-label="Friends sections">
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
                    ? (theme === 'dark' ? '#0F0F23' : '#FFFFFF')
                    : colors.textPrimary,
                  border: colors.glassBorder,
                }}
                role="tab"
                aria-selected={activeTab === tab.id}
                aria-controls={`${tab.id}-panel`}
              >
                <Icon className="w-4 h-4" aria-hidden="true" />
                {tab.label}
                {tab.count > 0 && (
                  <span 
                    className="px-2 py-0.5 rounded-full text-xs font-bold"
                    style={{
                      background: activeTab === tab.id 
                        ? (theme === 'dark' ? 'rgba(15, 15, 35, 0.3)' : 'rgba(255, 255, 255, 0.3)')
                        : colors.errorBg,
                      color: activeTab === tab.id 
                        ? (theme === 'dark' ? '#0F0F23' : '#FFFFFF')
                        : colors.errorColor,
                    }}
                    aria-label={`${tab.count} ${tab.label.toLowerCase()}`}
                  >
                    {tab.count}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Friends Tab */}
      {activeTab === 'friends' && (
        <div 
          className="flex-1 overflow-y-auto p-4 sm:p-6"
          role="tabpanel"
          id="friends-panel"
          aria-labelledby="friends-tab"
        >
          <div className="space-y-3">
            {friendsList.filter(friend => 
              friend.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
              friend.username.toLowerCase().includes(searchQuery.toLowerCase())
            ).map((friend, index) => (
              <motion.div
                key={friend.id}
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
                <div className="p-4">
                  {/* User Info */}
                  <div className="flex items-start gap-3 mb-3">
                    <div className="relative">
                      <div 
                        className="w-12 h-12 rounded-full flex items-center justify-center font-semibold flex-shrink-0"
                        style={{ background: colors.iconBg, color: colors.iconColor }}
                        aria-hidden="true"
                      >
                        {friend.avatar}
                      </div>
                      <div 
                        className="absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full border-2"
                        style={{ 
                          background: getStatusColor(friend.status),
                          borderColor: colors.cardBg,
                        }}
                        aria-label={`Status: ${friend.status}`}
                      />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-base mb-1" style={{ color: colors.textPrimary }}>
                        {friend.name}
                      </h3>
                      <p className="text-xs mb-1" style={{ color: colors.textTertiary }}>
                        {friend.username}
                      </p>
                      <p className="text-xs" style={{ color: getStatusColor(friend.status) }}>
                        {getStatusText(friend)}
                      </p>
                    </div>

                    <div className="flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold" style={{ background: colors.accentBg, color: colors.accentColor }}>
                      <Trophy className="w-3 h-3" aria-hidden="true" />
                      Lv {friend.level}
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="grid grid-cols-3 gap-2 mb-3 text-xs">
                    <div 
                      className="rounded-lg p-2 text-center"
                      style={{ background: colors.iconBg }}
                    >
                      <div className="font-bold mb-1" style={{ color: colors.iconColor }}>
                        {friend.progressStats.totalSigns}
                      </div>
                      <div style={{ color: colors.textTertiary }}>Signs</div>
                    </div>
                    <div 
                      className="rounded-lg p-2 text-center"
                      style={{ background: colors.successBg }}
                    >
                      <div className="font-bold mb-1" style={{ color: colors.successColor }}>
                        {friend.progressStats.lessonsCompleted}
                      </div>
                      <div style={{ color: colors.textTertiary }}>Lessons</div>
                    </div>
                    <div 
                      className="rounded-lg p-2 text-center"
                      style={{ background: colors.warningBg }}
                    >
                      <div className="font-bold mb-1" style={{ color: colors.warningColor }}>
                        {friend.streak}
                      </div>
                      <div style={{ color: colors.textTertiary }}>Streak</div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="grid grid-cols-3 gap-2">
                    <Button
                      onClick={() => setSelectedFriend(friend)}
                      className="h-9 rounded-full text-xs font-semibold"
                      style={{
                        background: colors.iconColor,
                        color: theme === 'dark' ? '#0F0F23' : '#FFFFFF',
                      }}
                      aria-label={`View ${friend.name}'s profile`}
                    >
                      Profile
                    </Button>
                    <Button
                      onClick={() => {
                        setSelectedFriend(friend);
                        setShowChallengeModal(true);
                      }}
                      className="h-9 rounded-full text-xs font-semibold"
                      style={{
                        background: colors.cardBg,
                        color: colors.textPrimary,
                        border: colors.glassBorder,
                      }}
                      aria-label={`Challenge ${friend.name}`}
                    >
                      <Trophy className="w-3 h-3 mr-1" aria-hidden="true" />
                      Challenge
                    </Button>
                    <Button
                      className="h-9 rounded-full text-xs font-semibold"
                      style={{
                        background: colors.cardBg,
                        color: colors.textPrimary,
                        border: colors.glassBorder,
                      }}
                      aria-label={`Message ${friend.name}`}
                    >
                      <MessageCircle className="w-3 h-3 mr-1" aria-hidden="true" />
                      Chat
                    </Button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {friendsList.length === 0 && (
            <div className="text-center py-12">
              <Users className="w-16 h-16 mx-auto mb-4" style={{ color: colors.textTertiary }} aria-hidden="true" />
              <h3 className="text-lg font-semibold mb-2">No Friends Yet</h3>
              <p className="text-sm mb-4" style={{ color: colors.textSecondary }}>
                Start connecting with other ASL learners!
              </p>
              <Button
                onClick={() => setActiveTab('find')}
                className="h-10 px-6 rounded-full font-semibold"
                style={{
                  background: colors.iconColor,
                  color: theme === 'dark' ? '#0F0F23' : '#FFFFFF',
                }}
                aria-label="Find practice partners"
              >
                Find Partners
              </Button>
            </div>
          )}
        </div>
      )}

      {/* Requests Tab */}
      {activeTab === 'requests' && (
        <div 
          className="flex-1 overflow-y-auto p-4 sm:p-6"
          role="tabpanel"
          id="requests-panel"
          aria-labelledby="requests-tab"
        >
          {/* Received Requests */}
          {requestsList.length > 0 && (
            <div className="mb-6">
              <h2 className="text-lg font-semibold mb-3">Received Requests</h2>
              <div className="space-y-3">
                {requestsList.map((request, index) => (
                  <motion.div
                    key={request.id}
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
                        className="w-12 h-12 rounded-full flex items-center justify-center font-semibold flex-shrink-0"
                        style={{ background: colors.iconBg, color: colors.iconColor }}
                        aria-hidden="true"
                      >
                        {request.avatar}
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-base mb-1" style={{ color: colors.textPrimary }}>
                          {request.name}
                        </h3>
                        <p className="text-xs mb-1" style={{ color: colors.textTertiary }}>
                          {request.username}
                        </p>
                        {request.mutualFriends && request.mutualFriends > 0 && (
                          <p className="text-xs" style={{ color: colors.textSecondary }}>
                            {request.mutualFriends} mutual friend{request.mutualFriends > 1 ? 's' : ''}
                          </p>
                        )}
                      </div>

                      <div className="flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold" style={{ background: colors.accentBg, color: colors.accentColor }}>
                        <Trophy className="w-3 h-3" aria-hidden="true" />
                        Lv {request.level}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <Button
                        onClick={() => handleAcceptRequest(request.id)}
                        className="h-10 rounded-full font-semibold"
                        style={{
                          background: colors.successColor,
                          color: '#FFFFFF',
                        }}
                        aria-label={`Accept friend request from ${request.name}`}
                      >
                        <Check className="w-4 h-4 mr-2" aria-hidden="true" />
                        Accept
                      </Button>
                      <Button
                        onClick={() => handleDeclineRequest(request.id)}
                        className="h-10 rounded-full font-semibold"
                        style={{
                          background: colors.cardBg,
                          color: colors.textPrimary,
                          border: colors.glassBorder,
                        }}
                        aria-label={`Decline friend request from ${request.name}`}
                      >
                        <XIcon className="w-4 h-4 mr-2" aria-hidden="true" />
                        Decline
                      </Button>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {/* Sent Requests */}
          {sentList.length > 0 && (
            <div>
              <h2 className="text-lg font-semibold mb-3">Sent Requests</h2>
              <div className="space-y-3">
                {sentList.map((request, index) => (
                  <motion.div
                    key={request.id}
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
                        className="w-12 h-12 rounded-full flex items-center justify-center font-semibold flex-shrink-0"
                        style={{ background: colors.iconBg, color: colors.iconColor }}
                        aria-hidden="true"
                      >
                        {request.avatar}
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-base mb-1" style={{ color: colors.textPrimary }}>
                          {request.name}
                        </h3>
                        <p className="text-xs mb-1" style={{ color: colors.textTertiary }}>
                          {request.username}
                        </p>
                        <p className="text-xs" style={{ color: colors.warningColor }}>
                          Request pending...
                        </p>
                      </div>
                    </div>

                    <Button
                      onClick={() => handleCancelRequest(request.id)}
                      className="w-full h-10 rounded-full font-semibold"
                      style={{
                        background: colors.cardBg,
                        color: colors.textPrimary,
                        border: colors.glassBorder,
                      }}
                      aria-label={`Cancel friend request to ${request.name}`}
                    >
                      Cancel Request
                    </Button>
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {requestsList.length === 0 && sentList.length === 0 && (
            <div className="text-center py-12">
              <UserPlus className="w-16 h-16 mx-auto mb-4" style={{ color: colors.textTertiary }} aria-hidden="true" />
              <h3 className="text-lg font-semibold mb-2">No Pending Requests</h3>
              <p className="text-sm" style={{ color: colors.textSecondary }}>
                You don't have any friend requests at the moment.
              </p>
            </div>
          )}
        </div>
      )}

      {/* Find Partners Tab */}
      {activeTab === 'find' && (
        <div 
          className="flex-1 overflow-y-auto p-4 sm:p-6"
          role="tabpanel"
          id="find-panel"
          aria-labelledby="find-tab"
        >
          <div className="mb-4">
            <h2 className="text-lg font-semibold mb-1">Practice Partner Matches</h2>
            <p className="text-sm" style={{ color: colors.textSecondary }}>
              Find learners with similar goals and schedules
            </p>
          </div>

          <div className="space-y-4">
            {practicePartners.map((partner, index) => (
              <motion.div
                key={partner.id}
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
                <div className="p-4">
                  {/* Partner Info */}
                  <div className="flex items-start gap-3 mb-3">
                    <div 
                      className="w-12 h-12 rounded-full flex items-center justify-center font-semibold flex-shrink-0"
                      style={{ background: colors.iconBg, color: colors.iconColor }}
                      aria-hidden="true"
                    >
                      {partner.avatar}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-base mb-1" style={{ color: colors.textPrimary }}>
                        {partner.name}
                      </h3>
                      <p className="text-xs mb-2" style={{ color: colors.textTertiary }}>
                        {partner.username} · Level {partner.level}
                      </p>
                      <div className="flex items-center gap-2 mb-2">
                        <Star className="w-4 h-4" style={{ color: colors.warningColor }} aria-hidden="true" />
                        <span className="text-sm font-semibold" style={{ color: colors.warningColor }}>
                          {partner.compatibility}% Match
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Bio */}
                  <p className="text-sm mb-3 leading-relaxed" style={{ color: colors.textSecondary }}>
                    {partner.bio}
                  </p>

                  {/* Shared Goals */}
                  <div className="mb-3">
                    <div className="text-xs font-semibold mb-2" style={{ color: colors.textTertiary }}>
                      Shared Goals
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {partner.sharedGoals.map((goal, idx) => (
                        <span 
                          key={idx}
                          className="px-2 py-1 rounded-full text-xs font-medium"
                          style={{ background: colors.successBg, color: colors.successColor }}
                        >
                          {goal}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Availability */}
                  <div className="mb-3">
                    <div className="text-xs font-semibold mb-2" style={{ color: colors.textTertiary }}>
                      Available Times
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {partner.availableTimes.map((time, idx) => (
                        <span 
                          key={idx}
                          className="px-2 py-1 rounded-full text-xs font-medium"
                          style={{ background: colors.iconBg, color: colors.iconColor }}
                        >
                          {time}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="grid grid-cols-2 gap-2">
                    <Button
                      onClick={() => handleSendPartnerRequest(partner.id)}
                      className="h-10 rounded-full font-semibold"
                      style={{
                        background: colors.iconColor,
                        color: theme === 'dark' ? '#0F0F23' : '#FFFFFF',
                      }}
                      aria-label={`Send friend request to ${partner.name}`}
                    >
                      <UserPlus className="w-4 h-4 mr-2" aria-hidden="true" />
                      Add Friend
                    </Button>
                    <Button
                      className="h-10 rounded-full font-semibold"
                      style={{
                        background: colors.cardBg,
                        color: colors.textPrimary,
                        border: colors.glassBorder,
                      }}
                      aria-label={`Message ${partner.name}`}
                    >
                      <MessageCircle className="w-4 h-4 mr-2" aria-hidden="true" />
                      Message
                    </Button>
                  </div>
                </div>
              </motion.div>
            ))}
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
            <h2 className="text-lg font-semibold mb-1">Friend Challenges</h2>
            <p className="text-sm" style={{ color: colors.textSecondary }}>
              Compete with friends and earn rewards
            </p>
          </div>

          <div className="space-y-3">
            {challenges.map((challenge, index) => (
              <motion.div
                key={challenge.id}
                className="rounded-xl p-4"
                style={{
                  background: colors.cardBg,
                  backdropFilter: colors.blur,
                  WebkitBackdropFilter: colors.blur,
                  border: challenge.status === 'pending' 
                    ? `2px solid ${colors.warningColor}`
                    : colors.glassBorder,
                  boxShadow: colors.shadow,
                }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                {/* Challenge Header */}
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Trophy className="w-5 h-5" style={{ color: colors.warningColor }} aria-hidden="true" />
                    <span className="font-semibold capitalize">{challenge.type} Challenge</span>
                  </div>
                  <span 
                    className="px-2 py-1 rounded-full text-xs font-semibold capitalize"
                    style={{
                      background: challenge.status === 'active' 
                        ? colors.successBg 
                        : challenge.status === 'pending'
                        ? colors.warningBg
                        : colors.iconBg,
                      color: challenge.status === 'active' 
                        ? colors.successColor 
                        : challenge.status === 'pending'
                        ? colors.warningColor
                        : colors.iconColor,
                    }}
                  >
                    {challenge.status}
                  </span>
                </div>

                {/* Participants */}
                <div className="grid grid-cols-2 gap-3 mb-3">
                  <div className="text-center">
                    <div 
                      className="w-10 h-10 rounded-full flex items-center justify-center font-semibold mx-auto mb-2"
                      style={{ background: colors.iconBg, color: colors.iconColor }}
                      aria-hidden="true"
                    >
                      {challenge.challengerAvatar}
                    </div>
                    <div className="text-sm font-semibold mb-1" style={{ color: colors.textPrimary }}>
                      {challenge.challenger}
                    </div>
                    {challenge.challengerScore !== undefined && (
                      <div className="text-2xl font-bold" style={{ color: colors.iconColor }}>
                        {challenge.challengerScore}
                      </div>
                    )}
                  </div>

                  <div className="text-center">
                    <div 
                      className="w-10 h-10 rounded-full flex items-center justify-center font-semibold mx-auto mb-2"
                      style={{ background: colors.accentBg, color: colors.accentColor }}
                      aria-hidden="true"
                    >
                      {challenge.challengedAvatar}
                    </div>
                    <div className="text-sm font-semibold mb-1" style={{ color: colors.textPrimary }}>
                      {challenge.challenged}
                    </div>
                    {challenge.challengedScore !== undefined && (
                      <div className="text-2xl font-bold" style={{ color: colors.accentColor }}>
                        {challenge.challengedScore}
                      </div>
                    )}
                  </div>
                </div>

                {/* Challenge Info */}
                <div 
                  className="rounded-lg p-3 mb-3 text-sm"
                  style={{ background: colors.iconBg }}
                >
                  <div className="flex items-center justify-between">
                    <span style={{ color: colors.textTertiary }}>Reward:</span>
                    <span className="font-semibold" style={{ color: colors.iconColor }}>
                      {challenge.reward}
                    </span>
                  </div>
                  {challenge.endDate && (
                    <div className="flex items-center justify-between mt-1">
                      <span style={{ color: colors.textTertiary }}>Ends:</span>
                      <span className="font-semibold" style={{ color: colors.textPrimary }}>
                        {new Date(challenge.endDate).toLocaleDateString()}
                      </span>
                    </div>
                  )}
                </div>

                {/* Actions */}
                {challenge.status === 'pending' && challenge.challenged === 'You' && (
                  <div className="grid grid-cols-2 gap-2">
                    <Button
                      className="h-10 rounded-full font-semibold"
                      style={{
                        background: colors.successColor,
                        color: '#FFFFFF',
                      }}
                      aria-label="Accept challenge"
                    >
                      Accept
                    </Button>
                    <Button
                      className="h-10 rounded-full font-semibold"
                      style={{
                        background: colors.cardBg,
                        color: colors.textPrimary,
                        border: colors.glassBorder,
                      }}
                      aria-label="Decline challenge"
                    >
                      Decline
                    </Button>
                  </div>
                )}

                {challenge.status === 'active' && (
                  <Button
                    className="w-full h-10 rounded-full font-semibold"
                    style={{
                      background: colors.iconColor,
                      color: theme === 'dark' ? '#0F0F23' : '#FFFFFF',
                    }}
                    aria-label="Continue challenge"
                  >
                    Continue Challenge
                  </Button>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Friend Profile Modal */}
      <AnimatePresence>
        {selectedFriend && !showChallengeModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{ background: 'rgba(0, 0, 0, 0.8)' }}
            onClick={() => setSelectedFriend(null)}
            role="dialog"
            aria-labelledby="profile-modal-title"
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
                  onClick={() => setSelectedFriend(null)}
                  className="absolute top-4 right-4"
                  style={{ color: '#FFFFFF' }}
                  aria-label="Close profile"
                >
                  <X className="w-6 h-6" />
                </Button>

                <div className="text-center">
                  <div 
                    className="w-20 h-20 rounded-full flex items-center justify-center font-bold text-2xl mx-auto mb-3"
                    style={{ background: 'rgba(255, 255, 255, 0.2)', color: '#FFFFFF' }}
                    aria-hidden="true"
                  >
                    {selectedFriend.avatar}
                  </div>
                  <h2 id="profile-modal-title" className="text-xl font-bold mb-1" style={{ color: '#FFFFFF' }}>
                    {selectedFriend.name}
                  </h2>
                  <p className="text-sm mb-2" style={{ color: 'rgba(255, 255, 255, 0.9)' }}>
                    {selectedFriend.username}
                  </p>
                  <div className="flex items-center justify-center gap-2">
                    <span 
                      className="px-3 py-1 rounded-full text-sm font-semibold"
                      style={{ background: 'rgba(255, 255, 255, 0.2)', color: '#FFFFFF' }}
                    >
                      Level {selectedFriend.level}
                    </span>
                    <span 
                      className="px-3 py-1 rounded-full text-sm font-semibold"
                      style={{ background: 'rgba(255, 255, 255, 0.2)', color: '#FFFFFF' }}
                    >
                      {selectedFriend.xp.toLocaleString()} XP
                    </span>
                  </div>
                </div>
              </div>

              {/* Stats */}
              <div className="p-6">
                <h3 className="text-lg font-semibold mb-4" style={{ color: colors.textPrimary }}>
                  Learning Progress
                </h3>

                <div className="grid grid-cols-2 gap-3 mb-4">
                  <div 
                    className="rounded-xl p-4 text-center"
                    style={{ background: colors.iconBg }}
                  >
                    <Target className="w-6 h-6 mx-auto mb-2" style={{ color: colors.iconColor }} aria-hidden="true" />
                    <div className="text-2xl font-bold mb-1" style={{ color: colors.textPrimary }}>
                      {selectedFriend.progressStats.totalSigns}
                    </div>
                    <div className="text-xs" style={{ color: colors.textTertiary }}>Total Signs</div>
                  </div>

                  <div 
                    className="rounded-xl p-4 text-center"
                    style={{ background: colors.successBg }}
                  >
                    <Award className="w-6 h-6 mx-auto mb-2" style={{ color: colors.successColor }} aria-hidden="true" />
                    <div className="text-2xl font-bold mb-1" style={{ color: colors.textPrimary }}>
                      {selectedFriend.progressStats.lessonsCompleted}
                    </div>
                    <div className="text-xs" style={{ color: colors.textTertiary }}>Lessons Done</div>
                  </div>

                  <div 
                    className="rounded-xl p-4 text-center"
                    style={{ background: colors.warningBg }}
                  >
                    <Flame className="w-6 h-6 mx-auto mb-2" style={{ color: colors.warningColor }} aria-hidden="true" />
                    <div className="text-2xl font-bold mb-1" style={{ color: colors.textPrimary }}>
                      {selectedFriend.streak}
                    </div>
                    <div className="text-xs" style={{ color: colors.textTertiary }}>Day Streak</div>
                  </div>

                  <div 
                    className="rounded-xl p-4 text-center"
                    style={{ background: colors.accentBg }}
                  >
                    <TrendingUp className="w-6 h-6 mx-auto mb-2" style={{ color: colors.accentColor }} aria-hidden="true" />
                    <div className="text-2xl font-bold mb-1" style={{ color: colors.textPrimary }}>
                      {selectedFriend.progressStats.averageScore}%
                    </div>
                    <div className="text-xs" style={{ color: colors.textTertiary }}>Avg Score</div>
                  </div>
                </div>

                {/* Actions */}
                <div className="grid grid-cols-2 gap-3">
                  <Button
                    onClick={() => {
                      setShowChallengeModal(true);
                    }}
                    className="h-10 rounded-full font-semibold"
                    style={{
                      background: colors.iconColor,
                      color: theme === 'dark' ? '#0F0F23' : '#FFFFFF',
                    }}
                    aria-label={`Challenge ${selectedFriend.name}`}
                  >
                    <Trophy className="w-4 h-4 mr-2" aria-hidden="true" />
                    Challenge
                  </Button>
                  <Button
                    onClick={() => {
                      if (confirm(`Remove ${selectedFriend.name} from friends?`)) {
                        handleRemoveFriend(selectedFriend.id);
                      }
                    }}
                    className="h-10 rounded-full font-semibold"
                    style={{
                      background: colors.errorBg,
                      color: colors.errorColor,
                      border: `1px solid ${colors.errorColor}`,
                    }}
                    aria-label={`Remove ${selectedFriend.name} from friends`}
                  >
                    <UserX className="w-4 h-4 mr-2" aria-hidden="true" />
                    Remove
                  </Button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Challenge Modal */}
      <AnimatePresence>
        {showChallengeModal && selectedFriend && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{ background: 'rgba(0, 0, 0, 0.8)' }}
            onClick={() => setShowChallengeModal(false)}
            role="dialog"
            aria-labelledby="challenge-modal-title"
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
                <h2 id="challenge-modal-title" className="text-xl font-bold" style={{ color: colors.textPrimary }}>
                  Challenge Friend
                </h2>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setShowChallengeModal(false)}
                  style={{ color: colors.textSecondary }}
                  aria-label="Close challenge dialog"
                >
                  <X className="w-6 h-6" />
                </Button>
              </div>

              <p className="text-sm mb-4" style={{ color: colors.textSecondary }}>
                Challenge {selectedFriend.name} to a friendly competition!
              </p>

              {/* Challenge Type Selection */}
              <div className="space-y-2 mb-6">
                {[
                  { id: 'vocabulary' as const, label: 'Vocabulary Race', desc: 'Learn the most new signs', icon: Target },
                  { id: 'speed' as const, label: 'Speed Challenge', desc: 'Complete lessons fastest', icon: TrendingUp },
                  { id: 'accuracy' as const, label: 'Accuracy Test', desc: 'Highest quiz scores', icon: Award },
                  { id: 'streak' as const, label: 'Streak Battle', desc: 'Longest learning streak', icon: Flame },
                ].map((type) => {
                  const Icon = type.icon;
                  return (
                    <button
                      key={type.id}
                      onClick={() => setSelectedChallengeType(type.id)}
                      className="w-full rounded-xl p-3 text-left transition-all"
                      style={{
                        background: selectedChallengeType === type.id ? colors.iconBg : colors.cardBg,
                        border: selectedChallengeType === type.id 
                          ? `2px solid ${colors.iconColor}`
                          : colors.glassBorder,
                      }}
                      aria-pressed={selectedChallengeType === type.id}
                    >
                      <div className="flex items-center gap-3">
                        <div 
                          className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                          style={{ background: colors.iconBg }}
                          aria-hidden="true"
                        >
                          <Icon className="w-5 h-5" style={{ color: colors.iconColor }} />
                        </div>
                        <div className="flex-1">
                          <div className="font-semibold mb-1" style={{ color: colors.textPrimary }}>
                            {type.label}
                          </div>
                          <div className="text-xs" style={{ color: colors.textSecondary }}>
                            {type.desc}
                          </div>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>

              <Button
                onClick={() => handleChallengeRequest(selectedFriend.id, selectedChallengeType)}
                className="w-full h-12 rounded-full font-semibold"
                style={{
                  background: colors.iconColor,
                  color: theme === 'dark' ? '#0F0F23' : '#FFFFFF',
                }}
                aria-label={`Send ${selectedChallengeType} challenge to ${selectedFriend.name}`}
              >
                <Send className="w-5 h-5 mr-2" aria-hidden="true" />
                Send Challenge
              </Button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
