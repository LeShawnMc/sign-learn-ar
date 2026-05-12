import { useState } from 'react';
import { Button } from './ui/button';
import { useTheme } from '../context/ThemeContext';
import { useApp } from '../context/AppContext';
import exampleImage from 'figma:asset/e8de9bb31d79717712096ebe84c51b13c8187a3a.png';
import { 
  X, 
  ChevronLeft,
  ChevronRight,
  Calendar as CalendarIcon,
  Trophy,
  Users,
  Clock,
  Zap,
  Target,
  Award,
  Star,
  Flame,
  Crown,
  Gift,
  Bell,
  Search,
  Filter,
  Play,
  CheckCircle2,
  TrendingUp,
  Activity,
  MessageCircle,
  Share2,
  Plus,
  UserPlus,
  Download,
  Eye,
  Repeat,
  Sparkles,
  Heart,
  Medal,
  Timer,
  AlertCircle,
  Info,
  Settings,
  ArrowRight,
  Check,
  Lock,
  Unlock,
} from 'lucide-react';

interface ChallengesCalendarProps {
  onExit: () => void;
}

interface Challenge {
  id: string;
  name: string;
  description: string;
  type: 'daily' | 'weekly' | 'special-event' | 'live-competition';
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';
  estimatedTime: string;
  participants: number;
  rewards: {
    xp: number;
    badges?: string[];
    prizes?: string[];
  };
  startTime: string;
  endTime: string;
  date: string;
  isRecurring?: boolean;
  series?: string;
  status?: 'upcoming' | 'active' | 'completed';
}

interface SpecialEvent {
  id: string;
  name: string;
  description: string;
  month: number;
  startDate: number;
  endDate: number;
  challenges: number;
  theme: string;
}

interface PastChallenge {
  id: string;
  name: string;
  completedDate: string;
  rank: number;
  totalParticipants: number;
  score: number;
  xpEarned: number;
  badgesEarned: string[];
}

export function ChallengesCalendar({ onExit }: ChallengesCalendarProps) {
  const { theme } = useTheme();
  const { userProgress } = useApp();

  const [currentDate, setCurrentDate] = useState(new Date(2026, 0, 12)); // January 12, 2026
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedChallenge, setSelectedChallenge] = useState<Challenge | null>(null);
  const [currentView, setCurrentView] = useState<'calendar' | 'detail' | 'lobby' | 'archive' | 'notifications'>('calendar');
  const [filterDifficulty, setFilterDifficulty] = useState<string>('all');
  const [filterType, setFilterType] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [lobbyCountdown, setLobbyCountdown] = useState(300); // 5 minutes in seconds

  // Challenges data
  const [challenges] = useState<Challenge[]>([
    // Daily challenges (every day)
    {
      id: 'daily-jan-12',
      name: 'Daily Sign Sprint',
      description: 'Learn and practice 5 new signs in under 5 minutes',
      type: 'daily',
      difficulty: 'Beginner',
      estimatedTime: '5 min',
      participants: 2847,
      rewards: { xp: 50 },
      startTime: '00:00',
      endTime: '23:59',
      date: '2026-01-12',
      isRecurring: true,
      series: 'Daily Practice',
      status: 'active',
    },
    {
      id: 'daily-jan-13',
      name: 'Daily Sign Sprint',
      description: 'Learn and practice 5 new signs in under 5 minutes',
      type: 'daily',
      difficulty: 'Beginner',
      estimatedTime: '5 min',
      participants: 0,
      rewards: { xp: 50 },
      startTime: '00:00',
      endTime: '23:59',
      date: '2026-01-13',
      isRecurring: true,
      series: 'Daily Practice',
      status: 'upcoming',
    },
    // Weekly challenges
    {
      id: 'weekly-jan-12',
      name: 'Sign Sunday: Greetings Master',
      description: 'Perfect your greeting signs with 90%+ accuracy',
      type: 'weekly',
      difficulty: 'Intermediate',
      estimatedTime: '15 min',
      participants: 1256,
      rewards: { xp: 200, badges: ['Sunday Signer'] },
      startTime: '09:00',
      endTime: '21:00',
      date: '2026-01-12',
      isRecurring: true,
      series: 'Sign Sunday',
      status: 'active',
    },
    {
      id: 'weekly-jan-14',
      name: 'Midweek Mastery: Emotions',
      description: 'Express 10 emotions with perfect facial expressions',
      type: 'weekly',
      difficulty: 'Advanced',
      estimatedTime: '20 min',
      participants: 892,
      rewards: { xp: 250, badges: ['Emotion Expert'] },
      startTime: '18:00',
      endTime: '20:00',
      date: '2026-01-14',
      isRecurring: true,
      series: 'Midweek Mastery',
      status: 'upcoming',
    },
    {
      id: 'weekly-jan-19',
      name: 'Sign Sunday: Family Signs',
      description: 'Master family-related vocabulary and relationships',
      type: 'weekly',
      difficulty: 'Intermediate',
      estimatedTime: '15 min',
      participants: 0,
      rewards: { xp: 200, badges: ['Sunday Signer'] },
      startTime: '09:00',
      endTime: '21:00',
      date: '2026-01-19',
      isRecurring: true,
      series: 'Sign Sunday',
      status: 'upcoming',
    },
    // Special events
    {
      id: 'special-jan-15',
      name: 'Martin Luther King Jr. Day Challenge',
      description: 'Learn signs related to equality, justice, and civil rights',
      type: 'special-event',
      difficulty: 'Intermediate',
      estimatedTime: '30 min',
      participants: 1543,
      rewards: { xp: 500, badges: ['Civil Rights Champion'], prizes: ['Exclusive MLK Day Badge'] },
      startTime: '00:00',
      endTime: '23:59',
      date: '2026-01-15',
      status: 'upcoming',
    },
    {
      id: 'special-jan-20',
      name: 'National ASL Day Celebration',
      description: 'Celebrate ASL with special challenges and community events',
      type: 'special-event',
      difficulty: 'Beginner',
      estimatedTime: '45 min',
      participants: 0,
      rewards: { xp: 750, badges: ['ASL Day 2026'], prizes: ['Limited Edition Avatar', 'Premium Access (1 week)'] },
      startTime: '00:00',
      endTime: '23:59',
      date: '2026-01-20',
      status: 'upcoming',
    },
    // Live competitions
    {
      id: 'live-jan-13',
      name: 'Speed Signing Championship',
      description: 'Compete live against others in timed sign recognition',
      type: 'live-competition',
      difficulty: 'Expert',
      estimatedTime: '10 min',
      participants: 456,
      rewards: { xp: 1000, badges: ['Speed Champion'], prizes: ['Trophy', '1st: $50 Gift Card', '2nd: Premium Month', '3rd: XP Boost'] },
      startTime: '19:00',
      endTime: '19:15',
      date: '2026-01-13',
      status: 'upcoming',
    },
    {
      id: 'live-jan-17',
      name: 'Fingerspelling Frenzy',
      description: 'Live fingerspelling competition - fastest and most accurate wins',
      type: 'live-competition',
      difficulty: 'Advanced',
      estimatedTime: '8 min',
      participants: 0,
      rewards: { xp: 800, badges: ['Fingerspelling Master'], prizes: ['Trophy', 'Top 10: Premium Access'] },
      startTime: '20:00',
      endTime: '20:10',
      date: '2026-01-17',
      status: 'upcoming',
    },
    {
      id: 'live-jan-24',
      name: 'Grammar Guru Showdown',
      description: 'Test your ASL grammar knowledge in live competition',
      type: 'live-competition',
      difficulty: 'Expert',
      estimatedTime: '12 min',
      participants: 0,
      rewards: { xp: 1000, badges: ['Grammar Guru'], prizes: ['Trophy', 'Winners Circle Badge'] },
      startTime: '18:30',
      endTime: '18:45',
      date: '2026-01-24',
      status: 'upcoming',
    },
  ]);

  // Special events
  const [specialEvents] = useState<SpecialEvent[]>([
    {
      id: 'deaf-awareness-month',
      name: 'Deaf Awareness Month',
      description: '30-day challenge series with educational content and community spotlights',
      month: 8, // September (0-indexed)
      startDate: 1,
      endDate: 30,
      challenges: 30,
      theme: 'Education & Awareness',
    },
    {
      id: 'intl-week-deaf',
      name: 'International Week of the Deaf',
      description: 'Global celebration of Deaf communities and sign languages',
      month: 8, // September
      startDate: 18,
      endDate: 24,
      challenges: 7,
      theme: 'Global Unity',
    },
  ]);

  // Past challenges
  const [pastChallenges] = useState<PastChallenge[]>([
    {
      id: 'past-1',
      name: 'New Year Sign Challenge',
      completedDate: '2026-01-01',
      rank: 12,
      totalParticipants: 3456,
      score: 945,
      xpEarned: 500,
      badgesEarned: ['New Year 2026', 'Top 1%'],
    },
    {
      id: 'past-2',
      name: 'Holiday Greetings Master',
      completedDate: '2025-12-25',
      rank: 45,
      totalParticipants: 5234,
      score: 876,
      xpEarned: 750,
      badgesEarned: ['Holiday Champion'],
    },
    {
      id: 'past-3',
      name: 'Weekend Sign Sprint',
      completedDate: '2026-01-05',
      rank: 8,
      totalParticipants: 1892,
      score: 982,
      xpEarned: 300,
      badgesEarned: ['Weekend Warrior', 'Top 10'],
    },
    {
      id: 'past-4',
      name: 'Speed Signing Championship',
      completedDate: '2026-01-06',
      rank: 23,
      totalParticipants: 678,
      score: 834,
      xpEarned: 1000,
      badgesEarned: ['Speed Challenger'],
    },
  ]);

  // Notification settings
  const [notifications, setNotifications] = useState({
    challengeReminders: true,
    newAnnouncements: true,
    friendInvites: true,
    resultsNotifications: true,
  });

  // Get calendar days for current month
  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days: (Date | null)[] = [];

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }

    // Add all days of the month
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(new Date(year, month, i));
    }

    return days;
  };

  // Get challenges for a specific date
  const getChallengesForDate = (date: Date | null) => {
    if (!date) return [];
    const dateStr = date.toISOString().split('T')[0];
    return challenges.filter(c => c.date === dateStr);
  };

  // Navigate months
  const previousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  // Handle date selection
  const handleDateClick = (date: Date | null) => {
    if (!date) return;
    setSelectedDate(date);
    const dateChallenges = getChallengesForDate(date);
    if (dateChallenges.length > 0) {
      setSelectedChallenge(dateChallenges[0]);
      setCurrentView('detail');
    }
  };

  // Join challenge
  const handleJoinChallenge = () => {
    if (selectedChallenge?.type === 'live-competition') {
      setCurrentView('lobby');
    }
  };

  // Filter challenges
  const getFilteredChallenges = () => {
    return challenges.filter(challenge => {
      const matchesDifficulty = filterDifficulty === 'all' || challenge.difficulty === filterDifficulty;
      const matchesType = filterType === 'all' || challenge.type === filterType;
      const matchesSearch = searchQuery === '' || 
        challenge.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        challenge.description.toLowerCase().includes(searchQuery.toLowerCase());
      
      return matchesDifficulty && matchesType && matchesSearch;
    });
  };

  const days = getDaysInMonth(currentDate);
  const monthName = currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

  // Get next upcoming challenge
  const nextChallenge = challenges
    .filter(c => c.status === 'upcoming' || c.status === 'active')
    .sort((a, b) => new Date(a.date + ' ' + a.startTime).getTime() - new Date(b.date + ' ' + b.startTime).getTime())[0];

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

  // Get challenge type color
  const getChallengeTypeColor = (type: Challenge['type']) => {
    switch (type) {
      case 'daily':
        return colors.iconColor;
      case 'weekly':
        return colors.accentColor;
      case 'special-event':
        return colors.warningColor;
      case 'live-competition':
        return colors.errorColor;
      default:
        return colors.iconColor;
    }
  };

  return (
    <div 
      className="h-full flex flex-col"
      style={{ background: colors.bg, color: colors.textPrimary }}
      role="main"
      aria-labelledby="challenges-calendar-title"
    >
      {/* Header */}
      <div 
        className="p-4 border-b"
        style={{ borderBottomColor: colors.border }}
      >
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <h1 
              id="challenges-calendar-title" 
              className="text-xl sm:text-2xl font-bold"
              style={{ fontFamily: 'Poppins, sans-serif' }}
            >
              {currentView === 'calendar' && 'Community Challenges'}
              {currentView === 'detail' && 'Challenge Details'}
              {currentView === 'lobby' && 'Live Challenge Lobby'}
              {currentView === 'archive' && 'Past Challenges'}
              {currentView === 'notifications' && 'Notification Settings'}
            </h1>
            <p className="text-sm" style={{ color: colors.textSecondary }}>
              {currentView === 'calendar' && 'Compete and grow with the community'}
              {currentView === 'detail' && selectedChallenge?.name}
              {currentView === 'lobby' && 'Waiting to start...'}
              {currentView === 'archive' && 'Review your past performances'}
              {currentView === 'notifications' && 'Manage your preferences'}
            </p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onExit}
            style={{ color: colors.textSecondary }}
            aria-label="Exit challenges calendar"
          >
            <X className="w-6 h-6" />
          </Button>
        </div>

        {/* Quick actions */}
        {currentView === 'calendar' && (
          <div className="flex items-center gap-2 mt-3">
            <Button
              onClick={() => setCurrentView('archive')}
              className="h-9 px-3 rounded-xl text-sm"
              style={{ 
                background: colors.iconBg,
                color: colors.iconColor,
              }}
              aria-label="View past challenges"
            >
              <Trophy className="w-4 h-4 mr-2" />
              Past Challenges
            </Button>
            <Button
              onClick={() => setShowFilters(!showFilters)}
              className="h-9 px-3 rounded-xl text-sm"
              style={{ 
                background: colors.accentBg,
                color: colors.accentColor,
              }}
              aria-label="Toggle filters"
              aria-pressed={showFilters}
            >
              <Filter className="w-4 h-4 mr-2" />
              Filters
            </Button>
            <Button
              onClick={() => setCurrentView('notifications')}
              className="h-9 px-3 rounded-xl text-sm"
              style={{ 
                background: colors.warningBg,
                color: colors.warningColor,
              }}
              aria-label="Notification settings"
            >
              <Bell className="w-4 h-4" />
            </Button>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        {/* Calendar View */}
        {currentView === 'calendar' && (
          <div className="p-4 space-y-4">
            {/* Next Challenge Widget */}
            {nextChallenge && (
              <div 
                className="rounded-2xl p-4"
                style={{
                  background: `linear-gradient(135deg, ${getChallengeTypeColor(nextChallenge.type)}20 0%, ${colors.iconColor}20 100%)`,
                  border: colors.glassBorder,
                  boxShadow: colors.shadow,
                }}
              >
                <div className="flex items-center gap-2 mb-2">
                  <Zap className="w-5 h-5" style={{ color: getChallengeTypeColor(nextChallenge.type) }} />
                  <span className="text-sm font-semibold" style={{ color: colors.textPrimary }}>
                    Next Challenge
                  </span>
                </div>
                <h3 className="font-bold mb-1" style={{ color: colors.textPrimary }}>
                  {nextChallenge.name}
                </h3>
                <p className="text-sm mb-3" style={{ color: colors.textSecondary }}>
                  {nextChallenge.description}
                </p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3 text-xs" style={{ color: colors.textTertiary }}>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {new Date(nextChallenge.date + ' ' + nextChallenge.startTime).toLocaleString('en-US', { 
                        month: 'short', 
                        day: 'numeric',
                        hour: 'numeric',
                        minute: '2-digit'
                      })}
                    </span>
                    <span className="flex items-center gap-1">
                      <Users className="w-3 h-3" />
                      {nextChallenge.participants.toLocaleString()}
                    </span>
                  </div>
                  <Button
                    onClick={() => {
                      setSelectedChallenge(nextChallenge);
                      setCurrentView('detail');
                    }}
                    className="h-8 px-3 rounded-lg text-sm font-semibold"
                    style={{ 
                      background: getChallengeTypeColor(nextChallenge.type),
                      color: theme === 'dark' ? '#0F0F23' : '#FFFFFF',
                    }}
                    aria-label="Join next challenge"
                  >
                    Join
                  </Button>
                </div>
              </div>
            )}

            {/* Filters */}
            {showFilters && (
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
                <div className="space-y-3">
                  <div>
                    <label className="text-sm font-semibold mb-2 block" style={{ color: colors.textPrimary }}>
                      Search
                    </label>
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: colors.textTertiary }} />
                      <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search challenges..."
                        className="w-full h-10 pl-10 pr-4 rounded-xl"
                        style={{
                          background: colors.cardHover,
                          border: colors.glassBorder,
                          color: colors.textPrimary,
                        }}
                        aria-label="Search challenges"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-semibold mb-2 block" style={{ color: colors.textPrimary }}>
                      Difficulty
                    </label>
                    <div className="flex gap-2">
                      {['all', 'Beginner', 'Intermediate', 'Advanced', 'Expert'].map((level) => (
                        <button
                          key={level}
                          onClick={() => setFilterDifficulty(level)}
                          className="flex-1 h-9 rounded-lg text-sm font-medium"
                          style={{
                            background: filterDifficulty === level ? colors.iconColor : colors.border,
                            color: filterDifficulty === level ? (theme === 'dark' ? '#0F0F23' : '#FFFFFF') : colors.textTertiary,
                          }}
                          aria-label={`Filter by ${level}`}
                          aria-pressed={filterDifficulty === level}
                        >
                          {level === 'all' ? 'All' : level}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-semibold mb-2 block" style={{ color: colors.textPrimary }}>
                      Type
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      {[
                        { value: 'all', label: 'All Types' },
                        { value: 'daily', label: 'Daily' },
                        { value: 'weekly', label: 'Weekly' },
                        { value: 'special-event', label: 'Special Event' },
                        { value: 'live-competition', label: 'Live' },
                      ].map((type) => (
                        <button
                          key={type.value}
                          onClick={() => setFilterType(type.value)}
                          className="h-9 rounded-lg text-sm font-medium"
                          style={{
                            background: filterType === type.value ? colors.accentColor : colors.border,
                            color: filterType === type.value ? '#FFFFFF' : colors.textTertiary,
                          }}
                          aria-label={`Filter by ${type.label}`}
                          aria-pressed={filterType === type.value}
                        >
                          {type.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Calendar */}
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
              {/* Month Navigation */}
              <div className="flex items-center justify-between mb-4">
                <button
                  onClick={previousMonth}
                  className="p-2 rounded-lg"
                  style={{ color: colors.textSecondary }}
                  aria-label="Previous month"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <h2 className="text-lg font-bold" style={{ color: colors.textPrimary }}>
                  {monthName}
                </h2>
                <button
                  onClick={nextMonth}
                  className="p-2 rounded-lg"
                  style={{ color: colors.textSecondary }}
                  aria-label="Next month"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>

              {/* Day Headers */}
              <div className="grid grid-cols-7 gap-1 mb-2">
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                  <div 
                    key={day} 
                    className="text-center text-xs font-semibold py-2"
                    style={{ color: colors.textTertiary }}
                  >
                    {day}
                  </div>
                ))}
              </div>

              {/* Calendar Days */}
              <div className="grid grid-cols-7 gap-1">
                {days.map((day, idx) => {
                  const dateChallenges = getChallengesForDate(day);
                  const hasDaily = dateChallenges.some(c => c.type === 'daily');
                  const hasWeekly = dateChallenges.some(c => c.type === 'weekly');
                  const hasSpecial = dateChallenges.some(c => c.type === 'special-event');
                  const hasLive = dateChallenges.some(c => c.type === 'live-competition');
                  const isToday = day && day.toDateString() === new Date(2026, 0, 12).toDateString();

                  return (
                    <button
                      key={idx}
                      onClick={() => handleDateClick(day)}
                      disabled={!day}
                      className="aspect-square rounded-lg p-1 relative"
                      style={{
                        background: day ? (isToday ? colors.iconBg : 'transparent') : 'transparent',
                        border: isToday ? `2px solid ${colors.iconColor}` : 'none',
                        cursor: day ? 'pointer' : 'default',
                      }}
                      aria-label={day ? `${day.toLocaleDateString()}, ${dateChallenges.length} challenges` : 'Empty day'}
                    >
                      {day && (
                        <>
                          <div 
                            className="text-sm font-medium text-center mb-1"
                            style={{ color: isToday ? colors.iconColor : colors.textPrimary }}
                          >
                            {day.getDate()}
                          </div>
                          {dateChallenges.length > 0 && (
                            <div className="flex flex-wrap gap-0.5 justify-center">
                              {hasDaily && (
                                <div 
                                  className="w-1.5 h-1.5 rounded-full"
                                  style={{ background: colors.iconColor }}
                                  title="Daily challenge"
                                />
                              )}
                              {hasWeekly && (
                                <div 
                                  className="w-1.5 h-1.5 rounded-full"
                                  style={{ background: colors.accentColor }}
                                  title="Weekly challenge"
                                />
                              )}
                              {hasSpecial && (
                                <div 
                                  className="w-1.5 h-1.5 rounded-full"
                                  style={{ background: colors.warningColor }}
                                  title="Special event"
                                />
                              )}
                              {hasLive && (
                                <div 
                                  className="w-1.5 h-1.5 rounded-full"
                                  style={{ background: colors.errorColor }}
                                  title="Live competition"
                                />
                              )}
                            </div>
                          )}
                        </>
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Legend */}
              <div className="grid grid-cols-2 gap-2 mt-4 pt-4" style={{ borderTop: `1px solid ${colors.border}` }}>
                <div className="flex items-center gap-2 text-xs">
                  <div className="w-3 h-3 rounded-full" style={{ background: colors.iconColor }} />
                  <span style={{ color: colors.textSecondary }}>Daily</span>
                </div>
                <div className="flex items-center gap-2 text-xs">
                  <div className="w-3 h-3 rounded-full" style={{ background: colors.accentColor }} />
                  <span style={{ color: colors.textSecondary }}>Weekly</span>
                </div>
                <div className="flex items-center gap-2 text-xs">
                  <div className="w-3 h-3 rounded-full" style={{ background: colors.warningColor }} />
                  <span style={{ color: colors.textSecondary }}>Special</span>
                </div>
                <div className="flex items-center gap-2 text-xs">
                  <div className="w-3 h-3 rounded-full" style={{ background: colors.errorColor }} />
                  <span style={{ color: colors.textSecondary }}>Live</span>
                </div>
              </div>
            </div>

            {/* Recurring Series */}
            <div 
              className="rounded-2xl p-6"
              style={{
                background: colors.cardBg,
                backdropFilter: colors.blur,
                WebkitBackdropFilter: colors.blur,
                border: colors.glassBorder,
                boxShadow: colors.shadow,
              }}
            >
              <h3 className="text-lg font-semibold mb-4" style={{ color: colors.textPrimary }}>
                Recurring Challenge Series
              </h3>

              <div className="space-y-3">
                {[
                  {
                    name: 'Sign Sunday',
                    description: 'Weekly challenges every Sunday',
                    frequency: 'Every Sunday • 9:00 AM - 9:00 PM',
                    participants: 1256,
                    icon: CalendarIcon,
                    color: colors.accentColor,
                  },
                  {
                    name: 'Midweek Mastery',
                    description: 'Wednesday skill-building challenges',
                    frequency: 'Every Wednesday • 6:00 PM - 8:00 PM',
                    participants: 892,
                    icon: Target,
                    color: colors.iconColor,
                  },
                  {
                    name: 'Daily Practice',
                    description: 'Quick daily sign practice',
                    frequency: 'Every day • All day',
                    participants: 2847,
                    icon: Repeat,
                    color: colors.successColor,
                  },
                ].map((series) => {
                  const Icon = series.icon;
                  return (
                    <div
                      key={series.name}
                      className="rounded-xl p-4"
                      style={{ background: colors.iconBg }}
                    >
                      <div className="flex items-start gap-3">
                        <div 
                          className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                          style={{ background: series.color }}
                        >
                          <Icon className="w-5 h-5 text-white" />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-semibold mb-1" style={{ color: colors.textPrimary }}>
                            {series.name}
                          </h4>
                          <p className="text-sm mb-2" style={{ color: colors.textSecondary }}>
                            {series.description}
                          </p>
                          <div className="flex items-center gap-3 text-xs" style={{ color: colors.textTertiary }}>
                            <span className="flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {series.frequency}
                            </span>
                            <span className="flex items-center gap-1">
                              <Users className="w-3 h-3" />
                              {series.participants.toLocaleString()}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* Challenge Detail View */}
        {currentView === 'detail' && selectedChallenge && (
          <div className="p-4 space-y-4">
            <Button
              onClick={() => setCurrentView('calendar')}
              variant="ghost"
              className="mb-2"
              style={{ color: colors.textSecondary }}
              aria-label="Back to calendar"
            >
              <ChevronLeft className="w-4 h-4 mr-2" />
              Back to Calendar
            </Button>

            {/* Challenge Header */}
            <div 
              className="rounded-2xl p-6"
              style={{
                background: `linear-gradient(135deg, ${getChallengeTypeColor(selectedChallenge.type)}20 0%, ${colors.iconColor}20 100%)`,
                border: colors.glassBorder,
                boxShadow: colors.shadow,
              }}
            >
              <div className="flex items-start gap-3 mb-4">
                <div 
                  className="w-16 h-16 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ background: getChallengeTypeColor(selectedChallenge.type) }}
                >
                  {selectedChallenge.type === 'daily' && <Target className="w-8 h-8 text-white" />}
                  {selectedChallenge.type === 'weekly' && <CalendarIcon className="w-8 h-8 text-white" />}
                  {selectedChallenge.type === 'special-event' && <Sparkles className="w-8 h-8 text-white" />}
                  {selectedChallenge.type === 'live-competition' && <Trophy className="w-8 h-8 text-white" />}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span 
                      className="px-2 py-1 rounded-full text-xs font-semibold"
                      style={{ 
                        background: getChallengeTypeColor(selectedChallenge.type),
                        color: theme === 'dark' ? '#0F0F23' : '#FFFFFF',
                      }}
                    >
                      {selectedChallenge.type.replace('-', ' ').toUpperCase()}
                    </span>
                    <span 
                      className="px-2 py-1 rounded-full text-xs font-semibold"
                      style={{ 
                        background: colors.iconBg,
                        color: colors.iconColor,
                      }}
                    >
                      {selectedChallenge.difficulty}
                    </span>
                  </div>
                  <h2 className="text-2xl font-bold mb-2" style={{ fontFamily: 'Poppins, sans-serif', color: colors.textPrimary }}>
                    {selectedChallenge.name}
                  </h2>
                  <p className="text-base" style={{ color: colors.textSecondary }}>
                    {selectedChallenge.description}
                  </p>
                </div>
              </div>

              {selectedChallenge.isRecurring && (
                <div 
                  className="rounded-xl p-3 mb-4 flex items-center gap-2"
                  style={{ background: colors.iconBg }}
                >
                  <Repeat className="w-4 h-4" style={{ color: colors.iconColor }} />
                  <span className="text-sm font-semibold" style={{ color: colors.textPrimary }}>
                    Recurring Series: {selectedChallenge.series}
                  </span>
                </div>
              )}

              <div className="grid grid-cols-2 gap-3">
                <div 
                  className="rounded-xl p-3 text-center"
                  style={{ background: colors.cardBg }}
                >
                  <Clock className="w-5 h-5 mx-auto mb-1" style={{ color: colors.iconColor }} />
                  <div className="text-sm font-semibold mb-1" style={{ color: colors.textPrimary }}>
                    {selectedChallenge.estimatedTime}
                  </div>
                  <div className="text-xs" style={{ color: colors.textTertiary }}>
                    Duration
                  </div>
                </div>

                <div 
                  className="rounded-xl p-3 text-center"
                  style={{ background: colors.cardBg }}
                >
                  <Users className="w-5 h-5 mx-auto mb-1" style={{ color: colors.accentColor }} />
                  <div className="text-sm font-semibold mb-1" style={{ color: colors.textPrimary }}>
                    {selectedChallenge.participants.toLocaleString()}
                  </div>
                  <div className="text-xs" style={{ color: colors.textTertiary }}>
                    Participants
                  </div>
                </div>
              </div>
            </div>

            {/* Schedule */}
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
              <h3 className="text-lg font-semibold mb-3" style={{ color: colors.textPrimary }}>
                Schedule
              </h3>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm" style={{ color: colors.textSecondary }}>
                    Start Time
                  </span>
                  <span className="text-sm font-semibold" style={{ color: colors.textPrimary }}>
                    {new Date(selectedChallenge.date + ' ' + selectedChallenge.startTime).toLocaleString('en-US', { 
                      month: 'short', 
                      day: 'numeric',
                      hour: 'numeric',
                      minute: '2-digit'
                    })}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm" style={{ color: colors.textSecondary }}>
                    End Time
                  </span>
                  <span className="text-sm font-semibold" style={{ color: colors.textPrimary }}>
                    {new Date(selectedChallenge.date + ' ' + selectedChallenge.endTime).toLocaleString('en-US', { 
                      month: 'short', 
                      day: 'numeric',
                      hour: 'numeric',
                      minute: '2-digit'
                    })}
                  </span>
                </div>
              </div>
            </div>

            {/* Rewards */}
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
              <h3 className="text-lg font-semibold mb-3" style={{ color: colors.textPrimary }}>
                Rewards
              </h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div 
                    className="w-10 h-10 rounded-lg flex items-center justify-center"
                    style={{ background: colors.warningBg }}
                  >
                    <Zap className="w-5 h-5" style={{ color: colors.warningColor }} />
                  </div>
                  <div>
                    <div className="font-semibold" style={{ color: colors.textPrimary }}>
                      {selectedChallenge.rewards.xp} XP
                    </div>
                    <div className="text-sm" style={{ color: colors.textTertiary }}>
                      Experience Points
                    </div>
                  </div>
                </div>

                {selectedChallenge.rewards.badges && selectedChallenge.rewards.badges.map((badge, idx) => (
                  <div key={idx} className="flex items-center gap-3">
                    <div 
                      className="w-10 h-10 rounded-lg flex items-center justify-center"
                      style={{ background: colors.successBg }}
                    >
                      <Award className="w-5 h-5" style={{ color: colors.successColor }} />
                    </div>
                    <div>
                      <div className="font-semibold" style={{ color: colors.textPrimary }}>
                        {badge}
                      </div>
                      <div className="text-sm" style={{ color: colors.textTertiary }}>
                        Achievement Badge
                      </div>
                    </div>
                  </div>
                ))}

                {selectedChallenge.rewards.prizes && (
                  <div 
                    className="rounded-xl p-3"
                    style={{ background: colors.accentBg }}
                  >
                    <div className="flex items-start gap-2 mb-2">
                      <Gift className="w-5 h-5 flex-shrink-0" style={{ color: colors.accentColor }} />
                      <div className="text-sm font-semibold" style={{ color: colors.textPrimary }}>
                        Special Prizes
                      </div>
                    </div>
                    <ul className="space-y-1">
                      {selectedChallenge.rewards.prizes.map((prize, idx) => (
                        <li key={idx} className="text-sm flex items-center gap-2" style={{ color: colors.textSecondary }}>
                          <div className="w-1.5 h-1.5 rounded-full" style={{ background: colors.accentColor }} />
                          {prize}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="space-y-3">
              <Button
                onClick={handleJoinChallenge}
                className="w-full h-12 rounded-xl font-semibold"
                style={{ 
                  background: getChallengeTypeColor(selectedChallenge.type),
                  color: theme === 'dark' ? '#0F0F23' : '#FFFFFF',
                }}
                aria-label="Join challenge"
              >
                <Play className="w-5 h-5 mr-2" />
                {selectedChallenge.type === 'live-competition' ? 'Enter Lobby' : 'Join Challenge'}
              </Button>

              <div className="grid grid-cols-3 gap-2">
                <Button
                  className="h-11 rounded-xl"
                  style={{ 
                    background: colors.iconBg,
                    color: colors.iconColor,
                  }}
                  aria-label="Set reminder"
                >
                  <Bell className="w-4 h-4 mr-2" />
                  Remind
                </Button>
                <Button
                  className="h-11 rounded-xl"
                  style={{ 
                    background: colors.accentBg,
                    color: colors.accentColor,
                  }}
                  aria-label="Add to calendar"
                >
                  <CalendarIcon className="w-4 h-4 mr-2" />
                  Calendar
                </Button>
                <Button
                  className="h-11 rounded-xl"
                  style={{ 
                    background: colors.successBg,
                    color: colors.successColor,
                  }}
                  aria-label="Invite friends"
                >
                  <UserPlus className="w-4 h-4 mr-2" />
                  Invite
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Live Challenge Lobby */}
        {currentView === 'lobby' && selectedChallenge && (
          <div className="p-4 space-y-4">
            <Button
              onClick={() => setCurrentView('detail')}
              variant="ghost"
              className="mb-2"
              style={{ color: colors.textSecondary }}
              aria-label="Back to challenge details"
            >
              <ChevronLeft className="w-4 h-4 mr-2" />
              Back
            </Button>

            {/* Countdown */}
            <div 
              className="rounded-2xl p-8 text-center"
              style={{
                background: colors.cardBg,
                backdropFilter: colors.blur,
                WebkitBackdropFilter: colors.blur,
                border: colors.glassBorder,
                boxShadow: colors.shadow,
              }}
            >
              <div 
                className="w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-4"
                style={{ background: colors.errorBg }}
              >
                <Timer className="w-12 h-12" style={{ color: colors.errorColor }} />
              </div>
              
              <h2 className="text-2xl font-bold mb-2" style={{ fontFamily: 'Poppins, sans-serif', color: colors.textPrimary }}>
                Starting Soon
              </h2>
              
              <div className="text-5xl font-bold mb-2" style={{ color: colors.errorColor }}>
                {Math.floor(lobbyCountdown / 60)}:{(lobbyCountdown % 60).toString().padStart(2, '0')}
              </div>
              
              <p className="text-sm" style={{ color: colors.textSecondary }}>
                Challenge begins at {new Date(selectedChallenge.date + ' ' + selectedChallenge.startTime).toLocaleString('en-US', { 
                  hour: 'numeric',
                  minute: '2-digit'
                })}
              </p>
            </div>

            {/* Participants */}
            <div 
              className="rounded-2xl p-6"
              style={{
                background: colors.cardBg,
                backdropFilter: colors.blur,
                WebkitBackdropFilter: colors.blur,
                border: colors.glassBorder,
                boxShadow: colors.shadow,
              }}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold" style={{ color: colors.textPrimary }}>
                  Participants
                </h3>
                <div className="flex items-center gap-2">
                  <Users className="w-5 h-5" style={{ color: colors.iconColor }} />
                  <span className="font-bold" style={{ color: colors.textPrimary }}>
                    {selectedChallenge.participants}
                  </span>
                </div>
              </div>

              <div className="space-y-2">
                {[
                  { name: 'SignMaster_Pro', level: 'Expert', avatar: '🏆' },
                  { name: 'ASL_Learner_23', level: 'Advanced', avatar: '⭐' },
                  { name: 'QuickSigner_99', level: 'Expert', avatar: '🔥' },
                  { name: 'DeafCulture_Fan', level: 'Intermediate', avatar: '💫' },
                  { name: 'HandTalk_King', level: 'Advanced', avatar: '👑' },
                ].map((participant, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-3 p-3 rounded-xl"
                    style={{ background: colors.iconBg }}
                  >
                    <div 
                      className="w-10 h-10 rounded-full flex items-center justify-center text-xl"
                      style={{ background: colors.accentColor }}
                    >
                      {participant.avatar}
                    </div>
                    <div className="flex-1">
                      <div className="font-semibold" style={{ color: colors.textPrimary }}>
                        {participant.name}
                      </div>
                      <div className="text-xs" style={{ color: colors.textTertiary }}>
                        {participant.level}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Chat Preview */}
            <div 
              className="rounded-2xl p-6"
              style={{
                background: colors.cardBg,
                backdropFilter: colors.blur,
                WebkitBackdropFilter: colors.blur,
                border: colors.glassBorder,
                boxShadow: colors.shadow,
              }}
            >
              <h3 className="text-lg font-semibold mb-4" style={{ color: colors.textPrimary }}>
                Pre-Event Chat
              </h3>

              <div className="space-y-3 mb-4">
                {[
                  { user: 'SignMaster_Pro', message: 'Good luck everyone! 🍀', time: '2 min ago' },
                  { user: 'ASL_Learner_23', message: 'First time in a live competition, nervous!', time: '1 min ago' },
                  { user: 'QuickSigner_99', message: 'You got this! Just have fun 😊', time: '30 sec ago' },
                ].map((msg, idx) => (
                  <div
                    key={idx}
                    className="rounded-xl p-3"
                    style={{ background: colors.accentBg }}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-semibold" style={{ color: colors.textPrimary }}>
                        {msg.user}
                      </span>
                      <span className="text-xs" style={{ color: colors.textTertiary }}>
                        {msg.time}
                      </span>
                    </div>
                    <p className="text-sm" style={{ color: colors.textSecondary }}>
                      {msg.message}
                    </p>
                  </div>
                ))}
              </div>

              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Send a message..."
                  className="flex-1 h-10 px-4 rounded-xl"
                  style={{
                    background: colors.cardHover,
                    border: colors.glassBorder,
                    color: colors.textPrimary,
                  }}
                  aria-label="Chat message"
                />
                <Button
                  className="h-10 w-10 rounded-xl"
                  style={{ background: colors.iconColor, color: theme === 'dark' ? '#0F0F23' : '#FFFFFF' }}
                  aria-label="Send message"
                >
                  <ArrowRight className="w-5 h-5" />
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Past Challenges Archive */}
        {currentView === 'archive' && (
          <div className="p-4 space-y-4">
            <Button
              onClick={() => setCurrentView('calendar')}
              variant="ghost"
              className="mb-2"
              style={{ color: colors.textSecondary }}
              aria-label="Back to calendar"
            >
              <ChevronLeft className="w-4 h-4 mr-2" />
              Back to Calendar
            </Button>

            {/* Summary Stats */}
            <div 
              className="rounded-2xl p-6"
              style={{
                background: colors.cardBg,
                backdropFilter: colors.blur,
                WebkitBackdropFilter: colors.blur,
                border: colors.glassBorder,
                boxShadow: colors.shadow,
              }}
            >
              <h3 className="text-lg font-semibold mb-4" style={{ color: colors.textPrimary }}>
                Your Challenge Stats
              </h3>

              <div className="grid grid-cols-2 gap-3">
                <div 
                  className="rounded-xl p-4 text-center"
                  style={{ background: colors.successBg }}
                >
                  <div className="text-3xl font-bold mb-1" style={{ color: colors.successColor }}>
                    {pastChallenges.length}
                  </div>
                  <div className="text-sm" style={{ color: colors.textSecondary }}>
                    Completed
                  </div>
                </div>

                <div 
                  className="rounded-xl p-4 text-center"
                  style={{ background: colors.warningBg }}
                >
                  <div className="text-3xl font-bold mb-1" style={{ color: colors.warningColor }}>
                    {pastChallenges.reduce((acc, c) => acc + c.xpEarned, 0).toLocaleString()}
                  </div>
                  <div className="text-sm" style={{ color: colors.textSecondary }}>
                    Total XP
                  </div>
                </div>

                <div 
                  className="rounded-xl p-4 text-center"
                  style={{ background: colors.iconBg }}
                >
                  <div className="text-3xl font-bold mb-1" style={{ color: colors.iconColor }}>
                    {pastChallenges.filter(c => c.rank <= 10).length}
                  </div>
                  <div className="text-sm" style={{ color: colors.textSecondary }}>
                    Top 10 Finishes
                  </div>
                </div>

                <div 
                  className="rounded-xl p-4 text-center"
                  style={{ background: colors.accentBg }}
                >
                  <div className="text-3xl font-bold mb-1" style={{ color: colors.accentColor }}>
                    {pastChallenges.reduce((acc, c) => acc + c.badgesEarned.length, 0)}
                  </div>
                  <div className="text-sm" style={{ color: colors.textSecondary }}>
                    Badges Earned
                  </div>
                </div>
              </div>
            </div>

            {/* Past Challenges List */}
            <div 
              className="rounded-2xl p-6"
              style={{
                background: colors.cardBg,
                backdropFilter: colors.blur,
                WebkitBackdropFilter: colors.blur,
                border: colors.glassBorder,
                boxShadow: colors.shadow,
              }}
            >
              <h3 className="text-lg font-semibold mb-4" style={{ color: colors.textPrimary }}>
                Challenge History
              </h3>

              <div className="space-y-3">
                {pastChallenges.map((challenge) => (
                  <div
                    key={challenge.id}
                    className="rounded-xl p-4"
                    style={{ background: colors.iconBg }}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h4 className="font-semibold mb-1" style={{ color: colors.textPrimary }}>
                          {challenge.name}
                        </h4>
                        <p className="text-sm" style={{ color: colors.textTertiary }}>
                          {new Date(challenge.completedDate).toLocaleDateString('en-US', { 
                            month: 'long', 
                            day: 'numeric',
                            year: 'numeric'
                          })}
                        </p>
                      </div>
                      <div 
                        className="px-3 py-1 rounded-full"
                        style={{ 
                          background: challenge.rank <= 10 ? colors.successColor : challenge.rank <= 50 ? colors.warningColor : colors.iconColor,
                          color: '#FFFFFF',
                        }}
                      >
                        <span className="text-sm font-bold">#{challenge.rank}</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-2 mb-3">
                      <div className="text-center">
                        <div className="text-lg font-bold" style={{ color: colors.textPrimary }}>
                          {challenge.score}
                        </div>
                        <div className="text-xs" style={{ color: colors.textTertiary }}>
                          Score
                        </div>
                      </div>
                      <div className="text-center">
                        <div className="text-lg font-bold" style={{ color: colors.warningColor }}>
                          {challenge.xpEarned}
                        </div>
                        <div className="text-xs" style={{ color: colors.textTertiary }}>
                          XP Earned
                        </div>
                      </div>
                      <div className="text-center">
                        <div className="text-lg font-bold" style={{ color: colors.accentColor }}>
                          {challenge.badgesEarned.length}
                        </div>
                        <div className="text-xs" style={{ color: colors.textTertiary }}>
                          Badges
                        </div>
                      </div>
                    </div>

                    {challenge.badgesEarned.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-3">
                        {challenge.badgesEarned.map((badge, idx) => (
                          <span
                            key={idx}
                            className="px-2 py-1 rounded-full text-xs font-semibold"
                            style={{ 
                              background: colors.successBg,
                              color: colors.successColor,
                            }}
                          >
                            {badge}
                          </span>
                        ))}
                      </div>
                    )}

                    <div className="flex gap-2">
                      <Button
                        className="flex-1 h-9 rounded-lg text-sm"
                        style={{ 
                          background: colors.iconBg,
                          color: colors.iconColor,
                        }}
                        aria-label="View challenge details"
                      >
                        <Eye className="w-4 h-4 mr-2" />
                        View Details
                      </Button>
                      <Button
                        className="flex-1 h-9 rounded-lg text-sm"
                        style={{ 
                          background: colors.accentBg,
                          color: colors.accentColor,
                        }}
                        aria-label="Replay challenge"
                      >
                        <Play className="w-4 h-4 mr-2" />
                        Replay
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Notification Settings */}
        {currentView === 'notifications' && (
          <div className="p-4 space-y-4">
            <Button
              onClick={() => setCurrentView('calendar')}
              variant="ghost"
              className="mb-2"
              style={{ color: colors.textSecondary }}
              aria-label="Back to calendar"
            >
              <ChevronLeft className="w-4 h-4 mr-2" />
              Back to Calendar
            </Button>

            <div 
              className="rounded-2xl p-6"
              style={{
                background: colors.cardBg,
                backdropFilter: colors.blur,
                WebkitBackdropFilter: colors.blur,
                border: colors.glassBorder,
                boxShadow: colors.shadow,
              }}
            >
              <h3 className="text-lg font-semibold mb-4" style={{ color: colors.textPrimary }}>
                Notification Preferences
              </h3>

              <div className="space-y-4">
                {[
                  {
                    key: 'challengeReminders' as const,
                    title: 'Challenge Reminders',
                    description: 'Get notified before challenges start',
                    icon: Bell,
                  },
                  {
                    key: 'newAnnouncements' as const,
                    title: 'New Challenge Announcements',
                    description: 'Be the first to know about new challenges',
                    icon: Sparkles,
                  },
                  {
                    key: 'friendInvites' as const,
                    title: 'Friend Challenge Invites',
                    description: 'Notifications when friends invite you',
                    icon: UserPlus,
                  },
                  {
                    key: 'resultsNotifications' as const,
                    title: 'Results Notifications',
                    description: 'See your ranking when challenges end',
                    icon: Trophy,
                  },
                ].map((setting) => {
                  const Icon = setting.icon;
                  return (
                    <div key={setting.key} className="flex items-start gap-3">
                      <div 
                        className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                        style={{ background: colors.iconBg }}
                      >
                        <Icon className="w-5 h-5" style={{ color: colors.iconColor }} />
                      </div>
                      <div className="flex-1">
                        <div className="font-semibold mb-1" style={{ color: colors.textPrimary }}>
                          {setting.title}
                        </div>
                        <p className="text-sm" style={{ color: colors.textTertiary }}>
                          {setting.description}
                        </p>
                      </div>
                      <button
                        onClick={() => setNotifications({ ...notifications, [setting.key]: !notifications[setting.key] })}
                        className="w-12 h-6 rounded-full relative flex-shrink-0"
                        style={{ background: notifications[setting.key] ? colors.successColor : colors.border }}
                        aria-label={`Toggle ${setting.title}`}
                        aria-pressed={notifications[setting.key]}
                      >
                        <div 
                          className="w-5 h-5 rounded-full absolute top-0.5 transition-all"
                          style={{ 
                            background: '#FFFFFF',
                            left: notifications[setting.key] ? 'calc(100% - 1.375rem)' : '0.125rem',
                          }}
                        />
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
