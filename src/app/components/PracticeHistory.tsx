import { useState } from 'react';
import { Button } from './ui/button';
import { useTheme } from '../context/ThemeContext';
import { useApp } from '../context/AppContext';
import exampleImage from 'figma:asset/f7a1c81d265df5a169ae8631ea96071c7e7bcfaa.png';
import { 
  X, 
  Calendar,
  ChevronLeft,
  ChevronRight,
  Clock,
  Target,
  Award,
  TrendingUp,
  BookOpen,
  Heart,
  Brain,
  Smile,
  Meh,
  Frown,
  Star,
  Bookmark,
  Tag,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Search,
  Download,
  Filter,
  Edit3,
  Image as ImageIcon,
  Camera,
  Trash2,
  Plus,
  BarChart3,
  PieChart,
  Activity,
  Zap,
  Trophy,
  Flag,
  ThumbsUp,
  ThumbsDown,
  RefreshCw,
  FileText,
  Info,
  Sun,
  Moon,
  Coffee,
  Sunrise,
  Sunset,
  CloudRain,
  CloudSnow,
  Sparkles,
  Lock,
  Users,
  Play,
  Pause,
  RotateCcw,
} from 'lucide-react';

interface PracticeHistoryProps {
  onExit: () => void;
}

interface PracticeSession {
  id: string;
  date: string;
  time: string;
  duration: number;
  lessonsCompleted: string[];
  accuracyScore: number;
  vocabularyLearned: string[];
  mistakes: string[];
  notes?: string;
  mood?: string;
  photos?: string[];
}

interface DayData {
  date: string;
  sessions: PracticeSession[];
  status: 'completed' | 'partial' | 'missed';
}

interface Milestone {
  id: string;
  title: string;
  description: string;
  date: string;
  type: 'auto' | 'custom';
  badge: string;
  icon: string;
}

interface BookmarkedLesson {
  id: string;
  title: string;
  category: string;
  tags: string[];
  bookmarkedDate: string;
  lastPracticed?: string;
}

interface Mistake {
  id: string;
  sign: string;
  date: string;
  attempts: number;
  lastAccuracy: number;
  improved: boolean;
}

export function PracticeHistory({ onExit }: PracticeHistoryProps) {
  const { theme } = useTheme();
  const { userProgress } = useApp();

  const [activeTab, setActiveTab] = useState<'calendar' | 'notes' | 'bookmarks' | 'milestones' | 'mistakes' | 'stats'>('calendar');
  const [currentMonth, setCurrentMonth] = useState(new Date(2026, 0)); // January 2026
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showExportModal, setShowExportModal] = useState(false);
  const [showNoteModal, setShowNoteModal] = useState(false);
  const [selectedSession, setSelectedSession] = useState<PracticeSession | null>(null);
  const [noteText, setNoteText] = useState('');
  const [selectedMood, setSelectedMood] = useState<string>('');

  // Practice data for January 2026
  const [practiceData] = useState<Record<string, DayData>>({
    '2026-01-12': {
      date: '2026-01-12',
      status: 'completed',
      sessions: [
        {
          id: 'sess-1',
          date: '2026-01-12',
          time: '09:30 AM',
          duration: 25,
          lessonsCompleted: ['First Signs', 'Basic Responses'],
          accuracyScore: 94,
          vocabularyLearned: ['Hello', 'Thank You', 'Please', 'Yes', 'No'],
          mistakes: ['Sorry'],
          notes: 'Great morning session! Felt confident with greetings.',
          mood: 'happy',
          photos: [],
        },
        {
          id: 'sess-2',
          date: '2026-01-12',
          time: '07:15 PM',
          duration: 18,
          lessonsCompleted: ['Emotions'],
          accuracyScore: 88,
          vocabularyLearned: ['Happy', 'Sad', 'Love'],
          mistakes: [],
          notes: 'Evening practice - a bit tired but pushed through.',
          mood: 'neutral',
          photos: [],
        },
      ],
    },
    '2026-01-11': {
      date: '2026-01-11',
      status: 'completed',
      sessions: [
        {
          id: 'sess-3',
          date: '2026-01-11',
          time: '02:00 PM',
          duration: 30,
          lessonsCompleted: ['Food & Drink', 'Daily Life'],
          accuracyScore: 91,
          vocabularyLearned: ['Water', 'Food', 'Work', 'Home'],
          mistakes: ['School'],
          notes: 'Lunchtime practice was productive!',
          mood: 'happy',
          photos: [],
        },
      ],
    },
    '2026-01-10': {
      date: '2026-01-10',
      status: 'partial',
      sessions: [
        {
          id: 'sess-4',
          date: '2026-01-10',
          time: '06:45 PM',
          duration: 12,
          lessonsCompleted: ['First Signs'],
          accuracyScore: 76,
          vocabularyLearned: ['Hello', 'Please'],
          mistakes: ['Thank You', 'Sorry'],
          notes: 'Short session - had limited time.',
          mood: 'stressed',
          photos: [],
        },
      ],
    },
    '2026-01-09': {
      date: '2026-01-09',
      status: 'completed',
      sessions: [
        {
          id: 'sess-5',
          date: '2026-01-09',
          time: '10:00 AM',
          duration: 28,
          lessonsCompleted: ['Family & Friends', 'Emotions'],
          accuracyScore: 96,
          vocabularyLearned: ['Family', 'Friend', 'Happy', 'Sad'],
          mistakes: [],
          notes: 'Perfect practice! Everything clicked today.',
          mood: 'excited',
          photos: [],
        },
      ],
    },
    '2026-01-08': {
      date: '2026-01-08',
      status: 'missed',
      sessions: [],
    },
    '2026-01-07': {
      date: '2026-01-07',
      status: 'completed',
      sessions: [
        {
          id: 'sess-6',
          date: '2026-01-07',
          time: '08:00 AM',
          duration: 22,
          lessonsCompleted: ['Basic Responses', 'Food & Drink'],
          accuracyScore: 89,
          vocabularyLearned: ['Yes', 'No', 'Help', 'Water'],
          mistakes: ['More'],
          notes: 'Morning routine - coffee and signs!',
          mood: 'happy',
          photos: [],
        },
      ],
    },
    '2026-01-06': {
      date: '2026-01-06',
      status: 'completed',
      sessions: [
        {
          id: 'sess-7',
          date: '2026-01-06',
          time: '05:30 PM',
          duration: 35,
          lessonsCompleted: ['First Signs', 'Emotions', 'Daily Life'],
          accuracyScore: 92,
          vocabularyLearned: ['Hello', 'Thank You', 'Love', 'Work', 'School'],
          mistakes: ['Sorry'],
          notes: 'Long session after work. Very rewarding!',
          mood: 'happy',
          photos: [],
        },
      ],
    },
    '2026-01-05': {
      date: '2026-01-05',
      status: 'partial',
      sessions: [
        {
          id: 'sess-8',
          date: '2026-01-05',
          time: '12:30 PM',
          duration: 15,
          lessonsCompleted: ['Basic Responses'],
          accuracyScore: 82,
          vocabularyLearned: ['Yes', 'No'],
          mistakes: ['Help', 'More'],
          notes: 'Quick lunch break practice.',
          mood: 'neutral',
          photos: [],
        },
      ],
    },
    '2026-01-04': {
      date: '2026-01-04',
      status: 'completed',
      sessions: [
        {
          id: 'sess-9',
          date: '2026-01-04',
          time: '09:00 AM',
          duration: 26,
          lessonsCompleted: ['Family & Friends', 'Food & Drink'],
          accuracyScore: 90,
          vocabularyLearned: ['Family', 'Friend', 'Water', 'Food'],
          mistakes: [],
          notes: 'Saturday morning practice - feeling energized!',
          mood: 'excited',
          photos: [],
        },
      ],
    },
    '2026-01-03': {
      date: '2026-01-03',
      status: 'completed',
      sessions: [
        {
          id: 'sess-10',
          date: '2026-01-03',
          time: '07:00 PM',
          duration: 20,
          lessonsCompleted: ['Emotions'],
          accuracyScore: 87,
          vocabularyLearned: ['Happy', 'Sad', 'Love'],
          mistakes: [],
          notes: 'Evening wind-down session.',
          mood: 'calm',
          photos: [],
        },
      ],
    },
  });

  // Milestones
  const [milestones] = useState<Milestone[]>([
    {
      id: 'mile-1',
      title: 'First Lesson Completed',
      description: 'Completed your very first ASL lesson',
      date: '2025-11-15',
      type: 'auto',
      badge: '🎯',
      icon: 'target',
    },
    {
      id: 'mile-2',
      title: '10 Words Learned',
      description: 'Learned your first 10 ASL signs',
      date: '2025-11-18',
      type: 'auto',
      badge: '📚',
      icon: 'book',
    },
    {
      id: 'mile-3',
      title: '50 Words Mastered',
      description: 'Reached 50 vocabulary words',
      date: '2025-12-01',
      type: 'auto',
      badge: '⭐',
      icon: 'star',
    },
    {
      id: 'mile-4',
      title: '7-Day Streak',
      description: 'Practiced for 7 consecutive days',
      date: '2025-12-08',
      type: 'auto',
      badge: '🔥',
      icon: 'flame',
    },
    {
      id: 'mile-5',
      title: 'First Perfect Score',
      description: 'Achieved 100% accuracy on a lesson',
      date: '2025-12-15',
      type: 'auto',
      badge: '💯',
      icon: 'award',
    },
    {
      id: 'mile-6',
      title: '100 Words Learned',
      description: 'Expanded vocabulary to 100 signs',
      date: '2025-12-28',
      type: 'auto',
      badge: '🏆',
      icon: 'trophy',
    },
    {
      id: 'mile-7',
      title: 'New Year Resolution',
      description: 'Started 2026 with a practice session',
      date: '2026-01-01',
      type: 'custom',
      badge: '🎊',
      icon: 'sparkles',
    },
    {
      id: 'mile-8',
      title: '30-Day Streak',
      description: 'One month of consistent practice',
      date: '2026-01-05',
      type: 'auto',
      badge: '🌟',
      icon: 'star',
    },
  ]);

  // Bookmarked Lessons
  const [bookmarkedLessons] = useState<BookmarkedLesson[]>([
    {
      id: 'book-1',
      title: 'Family & Friends',
      category: 'Relationships',
      tags: ['Important', 'Practice Daily'],
      bookmarkedDate: '2025-12-10',
      lastPracticed: '2026-01-09',
    },
    {
      id: 'book-2',
      title: 'Emotions',
      category: 'Expressions',
      tags: ['Challenging', 'Review'],
      bookmarkedDate: '2025-12-15',
      lastPracticed: '2026-01-12',
    },
    {
      id: 'book-3',
      title: 'Food & Drink',
      category: 'Daily Life',
      tags: ['Practical', 'Useful'],
      bookmarkedDate: '2025-12-20',
      lastPracticed: '2026-01-11',
    },
    {
      id: 'book-4',
      title: 'First Signs',
      category: 'Basics',
      tags: ['Foundation', 'Beginner'],
      bookmarkedDate: '2025-11-15',
      lastPracticed: '2026-01-12',
    },
    {
      id: 'book-5',
      title: 'Daily Life',
      category: 'Routines',
      tags: ['Essential', 'Work'],
      bookmarkedDate: '2026-01-02',
      lastPracticed: '2026-01-11',
    },
  ]);

  // Mistakes Archive
  const [mistakesArchive] = useState<Mistake[]>([
    {
      id: 'mis-1',
      sign: 'Sorry',
      date: '2026-01-12',
      attempts: 8,
      lastAccuracy: 72,
      improved: false,
    },
    {
      id: 'mis-2',
      sign: 'School',
      date: '2026-01-11',
      attempts: 5,
      lastAccuracy: 68,
      improved: false,
    },
    {
      id: 'mis-3',
      sign: 'Thank You',
      date: '2026-01-10',
      attempts: 12,
      lastAccuracy: 85,
      improved: true,
    },
    {
      id: 'mis-4',
      sign: 'More',
      date: '2026-01-07',
      attempts: 6,
      lastAccuracy: 78,
      improved: true,
    },
    {
      id: 'mis-5',
      sign: 'Help',
      date: '2026-01-05',
      attempts: 9,
      lastAccuracy: 88,
      improved: true,
    },
  ]);

  // Statistics
  const [statistics] = useState({
    bestPracticeTimes: [
      { time: '9:00 AM - 10:00 AM', sessions: 8, avgAccuracy: 92 },
      { time: '7:00 PM - 8:00 PM', sessions: 6, avgAccuracy: 89 },
      { time: '2:00 PM - 3:00 PM', sessions: 4, avgAccuracy: 91 },
    ],
    mostProductiveDays: [
      { day: 'Saturday', sessions: 12, totalMinutes: 285 },
      { day: 'Sunday', sessions: 10, totalMinutes: 240 },
      { day: 'Wednesday', sessions: 8, totalMinutes: 195 },
    ],
    learningPatterns: [
      { pattern: 'Morning Learner', percentage: 65, description: 'Most active 9-11 AM' },
      { pattern: 'Consistent Performer', percentage: 88, description: 'Maintains 85%+ accuracy' },
      { pattern: 'Weekend Warrior', percentage: 72, description: 'Higher engagement on weekends' },
    ],
  });

  const moods = [
    { id: 'happy', label: 'Happy', icon: Smile, color: '#22C55E' },
    { id: 'excited', label: 'Excited', icon: Sparkles, color: '#F59E0B' },
    { id: 'neutral', label: 'Neutral', icon: Meh, color: '#64748B' },
    { id: 'stressed', label: 'Stressed', icon: CloudRain, color: '#EF4444' },
    { id: 'calm', label: 'Calm', icon: Moon, color: '#A855F7' },
  ];

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days: (Date | null)[] = [];
    
    // Add empty slots for days before the month starts
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    
    // Add all days of the month
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(new Date(year, month, i));
    }
    
    return days;
  };

  const formatDate = (date: Date) => {
    return date.toISOString().split('T')[0];
  };

  const handlePreviousMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1));
  };

  const handleNextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1));
  };

  const handleDateSelect = (date: Date | null) => {
    if (!date) return;
    const dateStr = formatDate(date);
    setSelectedDate(dateStr);
  };

  const getStatusColor = (status: string) => {
    if (status === 'completed') return colors.successColor;
    if (status === 'partial') return colors.warningColor;
    if (status === 'missed') return colors.border;
    return colors.border;
  };

  const getMoodIcon = (mood: string) => {
    const moodData = moods.find(m => m.id === mood);
    return moodData ? moodData.icon : Meh;
  };

  const getMoodColor = (mood: string) => {
    const moodData = moods.find(m => m.id === mood);
    return moodData ? moodData.color : colors.textTertiary;
  };

  const selectedDayData = selectedDate ? practiceData[selectedDate] : null;

  const filteredMilestones = searchQuery
    ? milestones.filter(m => 
        m.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.description.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : milestones;

  const filteredBookmarks = searchQuery
    ? bookmarkedLessons.filter(b => 
        b.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        b.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        b.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()))
      )
    : bookmarkedLessons;

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
      aria-labelledby="practice-history-title"
    >
      {/* Header */}
      <div 
        className="p-4 border-b"
        style={{ borderBottomColor: colors.border }}
      >
        <div className="flex items-center gap-2 sm:gap-3 mb-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={onExit}
            style={{ color: colors.textSecondary }}
            aria-label="Exit practice history"
            className="flex-shrink-0"
          >
            <X className="w-6 h-6" />
          </Button>
          <div className="flex-1 min-w-0">
            <h1 
              id="practice-history-title" 
              className="text-xl sm:text-2xl font-bold truncate"
              style={{ fontFamily: 'Poppins, sans-serif' }}
            >
              Practice History
            </h1>
            <p className="text-sm truncate" style={{ color: colors.textSecondary }}>
              Track your learning journey
            </p>
          </div>
          <Button
            onClick={() => setShowExportModal(true)}
            size="icon"
            className="flex-shrink-0"
            style={{ 
              background: colors.iconBg,
              color: colors.iconColor,
            }}
            aria-label="Export journal"
          >
            <Download className="w-5 h-5" />
          </Button>
        </div>

        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5" style={{ color: colors.textTertiary }} aria-hidden="true" />
          <input
            type="text"
            placeholder="Search entries, lessons, milestones..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-11 pl-10 pr-4 rounded-xl"
            style={{
              background: colors.cardBg,
              border: colors.glassBorder,
              color: colors.textPrimary,
            }}
            aria-label="Search practice history"
          />
        </div>
      </div>

      {/* Tabs */}
      <div 
        className="border-b overflow-x-auto"
        style={{ borderBottomColor: colors.border }}
        role="tablist"
        aria-label="Practice history sections"
      >
        <div className="flex px-4 min-w-max">
          {[
            { id: 'calendar', label: 'Calendar', icon: Calendar },
            { id: 'notes', label: 'Notes', icon: Edit3 },
            { id: 'bookmarks', label: 'Bookmarks', icon: Bookmark },
            { id: 'milestones', label: 'Milestones', icon: Flag },
            { id: 'mistakes', label: 'Mistakes', icon: RefreshCw },
            { id: 'stats', label: 'Stats', icon: BarChart3 },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className="flex items-center gap-2 px-4 py-3 border-b-2 transition-colors whitespace-nowrap"
                style={{
                  borderBottomColor: isActive ? colors.iconColor : 'transparent',
                  color: isActive ? colors.iconColor : colors.textSecondary,
                }}
                role="tab"
                aria-selected={isActive}
                aria-controls={`${tab.id}-panel`}
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
        {/* Calendar Tab */}
        {activeTab === 'calendar' && (
          <div role="tabpanel" id="calendar-panel" aria-labelledby="calendar-tab">
            {/* Month Navigation */}
            <div className="p-4 flex items-center justify-between">
              <button
                onClick={handlePreviousMonth}
                className="p-2 rounded-lg"
                style={{ 
                  background: colors.iconBg,
                  color: colors.iconColor,
                }}
                aria-label="Previous month"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <h2 className="text-lg font-semibold" style={{ fontFamily: 'Poppins, sans-serif' }}>
                {currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
              </h2>
              <button
                onClick={handleNextMonth}
                className="p-2 rounded-lg"
                style={{ 
                  background: colors.iconBg,
                  color: colors.iconColor,
                }}
                aria-label="Next month"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>

            {/* Calendar Grid */}
            <div className="px-4 pb-4">
              <div 
                className="rounded-xl p-4"
                style={{
                  background: colors.cardBg,
                  backdropFilter: colors.blur,
                  WebkitBackdropFilter: colors.blur,
                  border: colors.glassBorder,
                  boxShadow: colors.shadow,
                }}
              >
                {/* Day headers */}
                <div className="grid grid-cols-7 gap-2 mb-2">
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

                {/* Calendar days */}
                <div className="grid grid-cols-7 gap-2">
                  {getDaysInMonth(currentMonth).map((day, index) => {
                    if (!day) {
                      return <div key={`empty-${index}`} />;
                    }

                    const dateStr = formatDate(day);
                    const dayData = practiceData[dateStr];
                    const isToday = dateStr === '2026-01-12';
                    const isSelected = dateStr === selectedDate;

                    return (
                      <button
                        key={dateStr}
                        onClick={() => handleDateSelect(day)}
                        className="aspect-square rounded-lg p-1 relative"
                        style={{
                          background: isSelected ? colors.iconBg : 'transparent',
                          border: isToday ? `2px solid ${colors.iconColor}` : `1px solid ${colors.border}`,
                        }}
                        aria-label={`${day.toLocaleDateString()}: ${dayData ? dayData.status : 'No practice'}`}
                      >
                        <div className="text-sm font-semibold" style={{ color: colors.textPrimary }}>
                          {day.getDate()}
                        </div>
                        {dayData && (
                          <div className="flex items-center justify-center gap-0.5 mt-1">
                            {dayData.sessions.map((session, idx) => (
                              <div
                                key={idx}
                                className="w-1.5 h-1.5 rounded-full"
                                style={{ background: getStatusColor(dayData.status) }}
                                aria-hidden="true"
                              />
                            ))}
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>

                {/* Legend */}
                <div className="flex items-center justify-center gap-4 mt-4 pt-4 border-t" style={{ borderTopColor: colors.border }}>
                  <div className="flex items-center gap-1.5">
                    <div className="w-3 h-3 rounded-full" style={{ background: colors.successColor }} />
                    <span className="text-xs" style={{ color: colors.textTertiary }}>Completed</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <div className="w-3 h-3 rounded-full" style={{ background: colors.warningColor }} />
                    <span className="text-xs" style={{ color: colors.textTertiary }}>Partial</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <div className="w-3 h-3 rounded-full" style={{ background: colors.border }} />
                    <span className="text-xs" style={{ color: colors.textTertiary }}>Missed</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Day Details */}
            {selectedDayData && (
              <div className="px-4 pb-4">
                <h3 className="text-lg font-semibold mb-3" style={{ color: colors.textPrimary }}>
                  {new Date(selectedDate!).toLocaleDateString('en-US', { 
                    weekday: 'long', 
                    month: 'long', 
                    day: 'numeric',
                    year: 'numeric',
                  })}
                </h3>

                <div className="space-y-3">
                  {selectedDayData.sessions.map((session) => {
                    const MoodIcon = getMoodIcon(session.mood || '');
                    
                    return (
                      <div
                        key={session.id}
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
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <Clock className="w-4 h-4" style={{ color: colors.iconColor }} />
                              <span className="font-semibold" style={{ color: colors.textPrimary }}>
                                {session.time}
                              </span>
                              {session.mood && (
                                <div 
                                  className="px-2 py-0.5 rounded-full flex items-center gap-1"
                                  style={{ background: `${getMoodColor(session.mood)}20` }}
                                >
                                  <MoodIcon className="w-3 h-3" style={{ color: getMoodColor(session.mood) }} />
                                  <span className="text-xs font-medium" style={{ color: getMoodColor(session.mood) }}>
                                    {moods.find(m => m.id === session.mood)?.label}
                                  </span>
                                </div>
                              )}
                            </div>
                            <div className="text-sm" style={{ color: colors.textTertiary }}>
                              {session.duration} minutes
                            </div>
                          </div>
                          <div 
                            className="px-3 py-1.5 rounded-full text-sm font-bold"
                            style={{ 
                              background: colors.successBg,
                              color: colors.successColor,
                            }}
                          >
                            {session.accuracyScore}%
                          </div>
                        </div>

                        {/* Lessons */}
                        <div className="mb-3">
                          <div className="text-xs font-semibold mb-1" style={{ color: colors.textTertiary }}>
                            Lessons Completed
                          </div>
                          <div className="flex flex-wrap gap-1.5">
                            {session.lessonsCompleted.map((lesson, idx) => (
                              <span
                                key={idx}
                                className="px-2 py-1 rounded text-xs"
                                style={{ 
                                  background: colors.iconBg,
                                  color: colors.iconColor,
                                }}
                              >
                                {lesson}
                              </span>
                            ))}
                          </div>
                        </div>

                        {/* Vocabulary */}
                        <div className="mb-3">
                          <div className="text-xs font-semibold mb-1" style={{ color: colors.textTertiary }}>
                            Vocabulary Learned ({session.vocabularyLearned.length})
                          </div>
                          <div className="flex flex-wrap gap-1.5">
                            {session.vocabularyLearned.map((word, idx) => (
                              <span
                                key={idx}
                                className="px-2 py-1 rounded text-xs"
                                style={{ 
                                  background: colors.successBg,
                                  color: colors.successColor,
                                }}
                              >
                                {word}
                              </span>
                            ))}
                          </div>
                        </div>

                        {/* Mistakes */}
                        {session.mistakes.length > 0 && (
                          <div className="mb-3">
                            <div className="text-xs font-semibold mb-1" style={{ color: colors.textTertiary }}>
                              Mistakes to Review
                            </div>
                            <div className="flex flex-wrap gap-1.5">
                              {session.mistakes.map((mistake, idx) => (
                                <span
                                  key={idx}
                                  className="px-2 py-1 rounded text-xs"
                                  style={{ 
                                    background: colors.errorBg,
                                    color: colors.errorColor,
                                  }}
                                >
                                  {mistake}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Notes */}
                        {session.notes && (
                          <div 
                            className="rounded-lg p-3"
                            style={{ background: colors.iconBg }}
                          >
                            <div className="flex items-start gap-2">
                              <Edit3 className="w-4 h-4 mt-0.5 flex-shrink-0" style={{ color: colors.iconColor }} />
                              <p className="text-sm" style={{ color: colors.textPrimary }}>
                                {session.notes}
                              </p>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Notes Tab */}
        {activeTab === 'notes' && (
          <div role="tabpanel" id="notes-panel" className="p-4">
            <div className="mb-4">
              <Button
                onClick={() => {
                  setShowNoteModal(true);
                  setSelectedSession(null);
                  setNoteText('');
                  setSelectedMood('');
                }}
                className="w-full h-12 rounded-xl font-semibold"
                style={{ 
                  background: colors.iconColor,
                  color: theme === 'dark' ? '#0F0F23' : '#FFFFFF',
                }}
                aria-label="Create new journal entry"
              >
                <Plus className="w-5 h-5 mr-2" />
                New Journal Entry
              </Button>
            </div>

            <div className="space-y-3">
              {Object.values(practiceData)
                .flatMap(day => day.sessions.filter(s => s.notes))
                .reverse()
                .map((session) => {
                  const MoodIcon = getMoodIcon(session.mood || '');
                  
                  return (
                    <div
                      key={session.id}
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
                        <div>
                          <div className="font-semibold mb-1" style={{ color: colors.textPrimary }}>
                            {new Date(session.date).toLocaleDateString('en-US', { 
                              month: 'short', 
                              day: 'numeric',
                              year: 'numeric',
                            })} at {session.time}
                          </div>
                          {session.mood && (
                            <div className="flex items-center gap-1.5">
                              <MoodIcon className="w-4 h-4" style={{ color: getMoodColor(session.mood) }} />
                              <span className="text-sm" style={{ color: getMoodColor(session.mood) }}>
                                Feeling {moods.find(m => m.id === session.mood)?.label}
                              </span>
                            </div>
                          )}
                        </div>
                        <button
                          className="p-2 rounded-lg"
                          style={{ color: colors.textTertiary }}
                          aria-label="Edit note"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                      </div>

                      <p className="text-sm mb-3" style={{ color: colors.textSecondary }}>
                        {session.notes}
                      </p>

                      <div className="flex items-center gap-3 text-xs" style={{ color: colors.textTertiary }}>
                        <span>{session.duration} min</span>
                        <span>•</span>
                        <span>{session.accuracyScore}% accuracy</span>
                        <span>•</span>
                        <span>{session.vocabularyLearned.length} words</span>
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>
        )}

        {/* Bookmarks Tab */}
        {activeTab === 'bookmarks' && (
          <div role="tabpanel" id="bookmarks-panel" className="p-4">
            <div className="space-y-3">
              {filteredBookmarks.map((bookmark) => (
                <div
                  key={bookmark.id}
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
                      style={{ background: colors.iconBg }}
                    >
                      <Bookmark className="w-6 h-6" style={{ color: colors.iconColor }} fill={colors.iconColor} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold mb-1" style={{ color: colors.textPrimary }}>
                        {bookmark.title}
                      </h3>
                      <div className="text-sm mb-2" style={{ color: colors.textTertiary }}>
                        {bookmark.category}
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {bookmark.tags.map((tag, idx) => (
                          <span
                            key={idx}
                            className="px-2 py-0.5 rounded text-xs flex items-center gap-1"
                            style={{ 
                              background: colors.accentBg,
                              color: colors.accentColor,
                            }}
                          >
                            <Tag className="w-3 h-3" />
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-xs" style={{ color: colors.textTertiary }}>
                    <span>
                      Bookmarked: {new Date(bookmark.bookmarkedDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </span>
                    {bookmark.lastPracticed && (
                      <span>
                        Last practiced: {new Date(bookmark.lastPracticed).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                      </span>
                    )}
                  </div>

                  <Button
                    className="w-full h-10 rounded-xl font-semibold mt-3"
                    style={{ 
                      background: colors.iconBg,
                      color: colors.iconColor,
                    }}
                    aria-label={`Practice ${bookmark.title}`}
                  >
                    <Play className="w-4 h-4 mr-2" />
                    Practice Now
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Milestones Tab */}
        {activeTab === 'milestones' && (
          <div role="tabpanel" id="milestones-panel" className="p-4">
            <div className="mb-4">
              <Button
                className="w-full h-12 rounded-xl font-semibold"
                style={{ 
                  background: colors.iconColor,
                  color: theme === 'dark' ? '#0F0F23' : '#FFFFFF',
                }}
                aria-label="Create custom milestone"
              >
                <Plus className="w-5 h-5 mr-2" />
                Create Custom Milestone
              </Button>
            </div>

            <div className="space-y-3">
              {filteredMilestones.map((milestone) => (
                <div
                  key={milestone.id}
                  className="rounded-xl p-4"
                  style={{
                    background: colors.cardBg,
                    backdropFilter: colors.blur,
                    WebkitBackdropFilter: colors.blur,
                    border: colors.glassBorder,
                    boxShadow: colors.shadow,
                  }}
                >
                  <div className="flex items-start gap-3">
                    <div className="text-3xl" role="img" aria-label={milestone.title}>
                      {milestone.badge}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold" style={{ color: colors.textPrimary }}>
                          {milestone.title}
                        </h3>
                        <span 
                          className="text-xs px-2 py-0.5 rounded-full"
                          style={{
                            background: milestone.type === 'auto' ? colors.iconBg : colors.accentBg,
                            color: milestone.type === 'auto' ? colors.iconColor : colors.accentColor,
                          }}
                        >
                          {milestone.type === 'auto' ? 'Auto' : 'Custom'}
                        </span>
                      </div>
                      <div className="text-sm mb-2" style={{ color: colors.textTertiary }}>
                        {milestone.description}
                      </div>
                      <div className="text-xs" style={{ color: colors.textSecondary }}>
                        {new Date(milestone.date).toLocaleDateString('en-US', { 
                          month: 'long', 
                          day: 'numeric',
                          year: 'numeric',
                        })}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Mistakes Tab */}
        {activeTab === 'mistakes' && (
          <div role="tabpanel" id="mistakes-panel" className="p-4">
            <div 
              className="rounded-xl p-4 mb-4 flex items-start gap-3"
              style={{
                background: colors.iconBg,
                border: colors.glassBorder,
              }}
            >
              <Info className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: colors.iconColor }} />
              <div className="text-sm" style={{ color: colors.textSecondary }}>
                Track your mistakes to identify areas for improvement. Green badges show improvement!
              </div>
            </div>

            <div className="space-y-3">
              {mistakesArchive.map((mistake) => (
                <div
                  key={mistake.id}
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
                    <div>
                      <h3 className="font-semibold text-lg mb-1" style={{ color: colors.textPrimary }}>
                        {mistake.sign}
                      </h3>
                      <div className="text-sm" style={{ color: colors.textTertiary }}>
                        Last attempt: {new Date(mistake.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                      </div>
                    </div>
                    {mistake.improved ? (
                      <div 
                        className="px-3 py-1.5 rounded-full flex items-center gap-1"
                        style={{ 
                          background: colors.successBg,
                          color: colors.successColor,
                        }}
                      >
                        <TrendingUp className="w-4 h-4" />
                        <span className="text-sm font-semibold">Improved</span>
                      </div>
                    ) : (
                      <div 
                        className="px-3 py-1.5 rounded-full flex items-center gap-1"
                        style={{ 
                          background: colors.warningBg,
                          color: colors.warningColor,
                        }}
                      >
                        <AlertCircle className="w-4 h-4" />
                        <span className="text-sm font-semibold">Practice</span>
                      </div>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-3 mb-3">
                    <div>
                      <div className="text-xs mb-1" style={{ color: colors.textTertiary }}>
                        Total Attempts
                      </div>
                      <div className="text-xl font-bold" style={{ color: colors.textPrimary }}>
                        {mistake.attempts}
                      </div>
                    </div>
                    <div>
                      <div className="text-xs mb-1" style={{ color: colors.textTertiary }}>
                        Last Accuracy
                      </div>
                      <div className="text-xl font-bold" style={{ color: colors.textPrimary }}>
                        {mistake.lastAccuracy}%
                      </div>
                    </div>
                  </div>

                  <Button
                    className="w-full h-10 rounded-xl font-semibold"
                    style={{ 
                      background: colors.iconBg,
                      color: colors.iconColor,
                    }}
                    aria-label={`Retry ${mistake.sign}`}
                  >
                    <RotateCcw className="w-4 h-4 mr-2" />
                    Retry This Sign
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Stats Tab */}
        {activeTab === 'stats' && (
          <div role="tabpanel" id="stats-panel" className="p-4">
            {/* Best Practice Times */}
            <section aria-labelledby="best-times-heading" className="mb-6">
              <h2 id="best-times-heading" className="text-lg font-semibold mb-3" style={{ color: colors.textPrimary }}>
                Best Practice Times
              </h2>
              <div className="space-y-2">
                {statistics.bestPracticeTimes.map((time, idx) => (
                  <div
                    key={idx}
                    className="rounded-xl p-4"
                    style={{
                      background: colors.cardBg,
                      backdropFilter: colors.blur,
                      WebkitBackdropFilter: colors.blur,
                      border: colors.glassBorder,
                      boxShadow: colors.shadow,
                    }}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <Clock className="w-5 h-5" style={{ color: colors.iconColor }} />
                        <span className="font-semibold" style={{ color: colors.textPrimary }}>
                          {time.time}
                        </span>
                      </div>
                      <span className="text-sm font-bold" style={{ color: colors.successColor }}>
                        {time.avgAccuracy}% avg
                      </span>
                    </div>
                    <div className="text-sm" style={{ color: colors.textTertiary }}>
                      {time.sessions} sessions completed
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Most Productive Days */}
            <section aria-labelledby="productive-days-heading" className="mb-6">
              <h2 id="productive-days-heading" className="text-lg font-semibold mb-3" style={{ color: colors.textPrimary }}>
                Most Productive Days
              </h2>
              <div className="space-y-2">
                {statistics.mostProductiveDays.map((day, idx) => (
                  <div
                    key={idx}
                    className="rounded-xl p-4"
                    style={{
                      background: colors.cardBg,
                      backdropFilter: colors.blur,
                      WebkitBackdropFilter: colors.blur,
                      border: colors.glassBorder,
                      boxShadow: colors.shadow,
                    }}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-5 h-5" style={{ color: colors.accentColor }} />
                        <span className="font-semibold" style={{ color: colors.textPrimary }}>
                          {day.day}
                        </span>
                      </div>
                      <span className="text-sm font-bold" style={{ color: colors.iconColor }}>
                        {day.totalMinutes} min
                      </span>
                    </div>
                    <div className="text-sm" style={{ color: colors.textTertiary }}>
                      {day.sessions} sessions completed
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Learning Patterns */}
            <section aria-labelledby="patterns-heading">
              <h2 id="patterns-heading" className="text-lg font-semibold mb-3" style={{ color: colors.textPrimary }}>
                Learning Patterns
              </h2>
              <div className="space-y-3">
                {statistics.learningPatterns.map((pattern, idx) => (
                  <div
                    key={idx}
                    className="rounded-xl p-4"
                    style={{
                      background: colors.cardBg,
                      backdropFilter: colors.blur,
                      WebkitBackdropFilter: colors.blur,
                      border: colors.glassBorder,
                      boxShadow: colors.shadow,
                    }}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold" style={{ color: colors.textPrimary }}>
                        {pattern.pattern}
                      </h3>
                      <span className="text-lg font-bold" style={{ color: colors.iconColor }}>
                        {pattern.percentage}%
                      </span>
                    </div>
                    <p className="text-sm mb-3" style={{ color: colors.textTertiary }}>
                      {pattern.description}
                    </p>
                    <div 
                      className="w-full h-2 rounded-full overflow-hidden"
                      style={{ background: colors.border }}
                      role="progressbar"
                      aria-valuenow={pattern.percentage}
                      aria-valuemin={0}
                      aria-valuemax={100}
                    >
                      <div 
                        className="h-full rounded-full"
                        style={{ 
                          background: colors.iconColor,
                          width: `${pattern.percentage}%`,
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>
        )}
      </div>

      {/* Export Modal */}
      {showExportModal && (
        <div 
          className="fixed inset-0 bg-black/50 flex items-end sm:items-center justify-center z-50 p-4"
          onClick={() => setShowExportModal(false)}
        >
          <div 
            className="w-full max-w-md rounded-2xl p-6"
            style={{
              background: colors.cardBg,
              backdropFilter: colors.blur,
              WebkitBackdropFilter: colors.blur,
              border: colors.glassBorder,
              boxShadow: colors.shadow,
            }}
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-labelledby="export-title"
            aria-modal="true"
          >
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 id="export-title" className="text-xl font-bold mb-1" style={{ color: colors.textPrimary }}>
                  Export Journal
                </h3>
                <p className="text-sm flex items-center gap-1" style={{ color: colors.textSecondary }}>
                  <Lock className="w-3 h-3" />
                  Premium Feature
                </p>
              </div>
              <button
                onClick={() => setShowExportModal(false)}
                className="p-2 rounded-lg"
                style={{ color: colors.textSecondary }}
                aria-label="Close export modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 mb-4">
              <div>
                <label className="text-sm font-semibold mb-2 block" style={{ color: colors.textPrimary }}>
                  Format
                </label>
                <select
                  className="w-full h-11 px-4 rounded-xl"
                  style={{
                    background: colors.cardHover,
                    border: colors.glassBorder,
                    color: colors.textPrimary,
                  }}
                  aria-label="Export format"
                >
                  <option value="pdf">PDF Document</option>
                  <option value="txt">Text File</option>
                  <option value="json">JSON Data</option>
                </select>
              </div>

              <div>
                <label className="text-sm font-semibold mb-2 block" style={{ color: colors.textPrimary }}>
                  Date Range
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <input
                    type="date"
                    className="h-11 px-4 rounded-xl"
                    style={{
                      background: colors.cardHover,
                      border: colors.glassBorder,
                      color: colors.textPrimary,
                    }}
                    defaultValue="2025-11-01"
                    aria-label="Start date"
                  />
                  <input
                    type="date"
                    className="h-11 px-4 rounded-xl"
                    style={{
                      background: colors.cardHover,
                      border: colors.glassBorder,
                      color: colors.textPrimary,
                    }}
                    defaultValue="2026-01-12"
                    aria-label="End date"
                  />
                </div>
              </div>
            </div>

            <Button
              className="w-full h-12 rounded-xl font-semibold"
              style={{ 
                background: colors.iconColor,
                color: theme === 'dark' ? '#0F0F23' : '#FFFFFF',
              }}
              aria-label="Export journal"
            >
              <Download className="w-5 h-5 mr-2" />
              Export Journal
            </Button>
          </div>
        </div>
      )}

      {/* Note Modal */}
      {showNoteModal && (
        <div 
          className="fixed inset-0 bg-black/50 flex items-end sm:items-center justify-center z-50 p-4"
          onClick={() => setShowNoteModal(false)}
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
            aria-labelledby="note-title"
            aria-modal="true"
          >
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 id="note-title" className="text-xl font-bold mb-1" style={{ color: colors.textPrimary }}>
                  New Journal Entry
                </h3>
                <p className="text-sm" style={{ color: colors.textSecondary }}>
                  Reflect on your practice session
                </p>
              </div>
              <button
                onClick={() => setShowNoteModal(false)}
                className="p-2 rounded-lg"
                style={{ color: colors.textSecondary }}
                aria-label="Close note modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Mood Selection */}
            <div className="mb-4">
              <label className="text-sm font-semibold mb-2 block" style={{ color: colors.textPrimary }}>
                How are you feeling?
              </label>
              <div className="flex gap-2">
                {moods.map((mood) => {
                  const Icon = mood.icon;
                  const isSelected = selectedMood === mood.id;
                  
                  return (
                    <button
                      key={mood.id}
                      onClick={() => setSelectedMood(mood.id)}
                      className="flex-1 aspect-square rounded-xl flex flex-col items-center justify-center gap-1"
                      style={{
                        background: isSelected ? `${mood.color}20` : colors.border,
                        border: isSelected ? `2px solid ${mood.color}` : 'none',
                      }}
                      aria-label={mood.label}
                      aria-pressed={isSelected}
                    >
                      <Icon className="w-6 h-6" style={{ color: isSelected ? mood.color : colors.textTertiary }} />
                      <span className="text-xs" style={{ color: isSelected ? mood.color : colors.textTertiary }}>
                        {mood.label}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Note Text */}
            <div className="mb-4">
              <label className="text-sm font-semibold mb-2 block" style={{ color: colors.textPrimary }}>
                Your thoughts
              </label>
              <textarea
                value={noteText}
                onChange={(e) => setNoteText(e.target.value)}
                placeholder="Write about your practice session, challenges, breakthroughs, or goals..."
                rows={6}
                className="w-full px-4 py-3 rounded-xl resize-none"
                style={{
                  background: colors.cardHover,
                  border: colors.glassBorder,
                  color: colors.textPrimary,
                }}
                aria-label="Journal entry text"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <Button
                onClick={() => setShowNoteModal(false)}
                className="h-12 rounded-xl font-semibold"
                style={{ 
                  background: colors.border,
                  color: colors.textSecondary,
                }}
                aria-label="Cancel"
              >
                Cancel
              </Button>
              <Button
                onClick={() => setShowNoteModal(false)}
                className="h-12 rounded-xl font-semibold"
                style={{ 
                  background: colors.successColor,
                  color: '#FFFFFF',
                }}
                aria-label="Save journal entry"
              >
                <CheckCircle2 className="w-5 h-5 mr-2" />
                Save
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
