import { useState } from 'react';
import { Button } from './ui/button';
import { useTheme } from '../context/ThemeContext';
import { useApp } from '../context/AppContext';
import { motion, AnimatePresence } from 'motion/react';
import { X, Calendar, Clock, Users, Star, Video, Play, ChevronRight, MapPin, Award, BookOpen, Filter, Search, Download, Share2, MessageCircle, CheckCircle, Crown } from 'lucide-react';

interface LiveClassScheduleProps {
  onExit: () => void;
  onUpgrade?: () => void;
}

interface Instructor {
  id: string;
  name: string;
  avatar: string;
  isDeaf: boolean;
  certifications: string[];
  yearsExperience: number;
  rating: number;
  totalStudents: number;
  bio: string;
  specialties: string[];
}

interface LiveClass {
  id: string;
  title: string;
  description: string;
  instructor: Instructor;
  date: string;
  time: string;
  duration: string;
  level: 'beginner' | 'intermediate' | 'advanced' | 'all';
  maxStudents: number;
  enrolledStudents: number;
  category: string;
  isPremium: boolean;
  isBooked?: boolean;
  zoomLink?: string;
}

interface Recording {
  id: string;
  classTitle: string;
  instructor: string;
  instructorAvatar: string;
  recordedDate: string;
  duration: string;
  views: number;
  rating: number;
  category: string;
  thumbnail: string;
  isPremium: boolean;
}

// Real Deaf instructors
const instructors: Instructor[] = [
  {
    id: 'i1',
    name: 'Dr. Maria Rodriguez',
    avatar: 'MR',
    isDeaf: true,
    certifications: ['ASL Master', 'Deaf Culture Educator', 'ASLPI Certified'],
    yearsExperience: 15,
    rating: 4.9,
    totalStudents: 2840,
    bio: 'Native ASL user and Deaf educator with 15 years of teaching experience. Passionate about sharing Deaf culture and ASL linguistics.',
    specialties: ['ASL Grammar', 'Deaf Culture', 'Advanced Signing'],
  },
  {
    id: 'i2',
    name: 'James Chen',
    avatar: 'JC',
    isDeaf: true,
    certifications: ['NIC Certified', 'ASL Linguist', 'CODA'],
    yearsExperience: 12,
    rating: 4.8,
    totalStudents: 1950,
    bio: 'CODA (Child of Deaf Adults) and certified interpreter. Specializes in conversational ASL and real-world signing scenarios.',
    specialties: ['Conversational ASL', 'Fingerspelling', 'Interpreting'],
  },
  {
    id: 'i3',
    name: 'Sarah Thompson',
    avatar: 'ST',
    isDeaf: true,
    certifications: ['Gallaudet Graduate', 'ASL Poetry', 'Deaf Arts'],
    yearsExperience: 10,
    rating: 4.9,
    totalStudents: 1650,
    bio: 'Deaf artist and ASL poet. Teaches the beauty and artistry of ASL through creative expression and storytelling.',
    specialties: ['ASL Poetry', 'Storytelling', 'Creative Expression'],
  },
  {
    id: 'i4',
    name: 'Robert Williams',
    avatar: 'RW',
    isDeaf: true,
    certifications: ['Deaf History Expert', 'ASL Teacher Cert', 'DPN Activist'],
    yearsExperience: 18,
    rating: 5.0,
    totalStudents: 3200,
    bio: 'Deaf rights activist and historian. Participated in the Deaf President Now movement. Passionate about teaching Deaf history and culture.',
    specialties: ['Deaf History', 'Deaf Rights', 'Cultural Studies'],
  },
  {
    id: 'i5',
    name: 'Lisa Martinez',
    avatar: 'LM',
    isDeaf: true,
    certifications: ['ASL for Beginners', 'Early Childhood Deaf Ed', 'Family Support'],
    yearsExperience: 8,
    rating: 4.7,
    totalStudents: 1420,
    bio: 'Specializes in teaching ASL to families with Deaf children. Patient and encouraging teaching style perfect for absolute beginners.',
    specialties: ['Beginners', 'Family ASL', 'Parent Education'],
  },
];

// Upcoming live classes
const upcomingClasses: LiveClass[] = [
  {
    id: 'c1',
    title: 'ASL Grammar Fundamentals',
    description: 'Learn the core grammatical structures of ASL including topic-comment, time concepts, and non-manual markers.',
    instructor: instructors[0],
    date: '2024-01-15',
    time: '6:00 PM EST',
    duration: '90 min',
    level: 'intermediate',
    maxStudents: 20,
    enrolledStudents: 15,
    category: 'Grammar',
    isPremium: false,
  },
  {
    id: 'c2',
    title: 'Conversational ASL Practice',
    description: 'Interactive session practicing everyday conversations. Bring your questions and practice with native signers!',
    instructor: instructors[1],
    date: '2024-01-16',
    time: '7:00 PM EST',
    duration: '60 min',
    level: 'all',
    maxStudents: 25,
    enrolledStudents: 22,
    category: 'Conversation',
    isPremium: false,
    isBooked: true,
  },
  {
    id: 'c3',
    title: 'ASL Poetry & Storytelling',
    description: 'Explore the artistic side of ASL through poetry, storytelling, and creative expression. Learn to convey emotion through signing.',
    instructor: instructors[2],
    date: '2024-01-17',
    time: '5:30 PM EST',
    duration: '75 min',
    level: 'intermediate',
    maxStudents: 15,
    enrolledStudents: 8,
    category: 'Arts',
    isPremium: true,
  },
  {
    id: 'c4',
    title: 'Deaf History & Culture',
    description: 'Journey through Deaf history from Laurent Clerc to modern day. Understanding culture is key to understanding the language.',
    instructor: instructors[3],
    date: '2024-01-18',
    time: '6:30 PM EST',
    duration: '90 min',
    level: 'all',
    maxStudents: 30,
    enrolledStudents: 28,
    category: 'Culture',
    isPremium: false,
  },
  {
    id: 'c5',
    title: 'ASL for Absolute Beginners',
    description: 'Never signed before? Start here! Learn the alphabet, basic greetings, and simple phrases in a supportive environment.',
    instructor: instructors[4],
    date: '2024-01-19',
    time: '7:30 PM EST',
    duration: '60 min',
    level: 'beginner',
    maxStudents: 30,
    enrolledStudents: 18,
    category: 'Basics',
    isPremium: false,
  },
  {
    id: 'c6',
    title: 'Advanced Classifiers & Spatial Grammar',
    description: 'Master complex classifiers and spatial referencing. Learn to describe environments and movements like a native signer.',
    instructor: instructors[0],
    date: '2024-01-20',
    time: '4:00 PM EST',
    duration: '90 min',
    level: 'advanced',
    maxStudents: 15,
    enrolledStudents: 12,
    category: 'Grammar',
    isPremium: true,
  },
  {
    id: 'c7',
    title: 'Fingerspelling Speed & Accuracy',
    description: 'Intensive practice session focused on improving fingerspelling speed, clarity, and recognition.',
    instructor: instructors[1],
    date: '2024-01-21',
    time: '6:00 PM EST',
    duration: '60 min',
    level: 'intermediate',
    maxStudents: 20,
    enrolledStudents: 14,
    category: 'Skills',
    isPremium: false,
  },
  {
    id: 'c8',
    title: 'Deaf Community Etiquette',
    description: 'Learn the do\'s and don\'ts of Deaf culture. Understand proper etiquette, values, and social norms.',
    instructor: instructors[3],
    date: '2024-01-22',
    time: '7:00 PM EST',
    duration: '60 min',
    level: 'all',
    maxStudents: 40,
    enrolledStudents: 35,
    category: 'Culture',
    isPremium: false,
  },
];

// Past class recordings
const recordings: Recording[] = [
  {
    id: 'r1',
    classTitle: 'Introduction to ASL Grammar',
    instructor: 'Dr. Maria Rodriguez',
    instructorAvatar: 'MR',
    recordedDate: '2024-01-08',
    duration: '85 min',
    views: 1240,
    rating: 4.9,
    category: 'Grammar',
    thumbnail: '📚',
    isPremium: false,
  },
  {
    id: 'r2',
    classTitle: 'Deaf Culture 101',
    instructor: 'Robert Williams',
    instructorAvatar: 'RW',
    recordedDate: '2024-01-05',
    duration: '90 min',
    views: 2180,
    rating: 5.0,
    category: 'Culture',
    thumbnail: '🏛️',
    isPremium: false,
  },
  {
    id: 'r3',
    classTitle: 'Advanced ASL Poetry Workshop',
    instructor: 'Sarah Thompson',
    instructorAvatar: 'ST',
    recordedDate: '2024-01-03',
    duration: '75 min',
    views: 856,
    rating: 4.8,
    category: 'Arts',
    thumbnail: '🎭',
    isPremium: true,
  },
  {
    id: 'r4',
    classTitle: 'Conversational Practice Session',
    instructor: 'James Chen',
    instructorAvatar: 'JC',
    recordedDate: '2024-01-02',
    duration: '60 min',
    views: 1650,
    rating: 4.7,
    category: 'Conversation',
    thumbnail: '💬',
    isPremium: false,
  },
  {
    id: 'r5',
    classTitle: 'Fingerspelling Mastery',
    instructor: 'James Chen',
    instructorAvatar: 'JC',
    recordedDate: '2023-12-28',
    duration: '60 min',
    views: 1340,
    rating: 4.8,
    category: 'Skills',
    thumbnail: '✋',
    isPremium: true,
  },
  {
    id: 'r6',
    classTitle: 'ASL for Parents',
    instructor: 'Lisa Martinez',
    instructorAvatar: 'LM',
    recordedDate: '2023-12-25',
    duration: '90 min',
    views: 980,
    rating: 4.9,
    category: 'Family',
    thumbnail: '👨‍👩‍👧',
    isPremium: false,
  },
];

type TabType = 'upcoming' | 'recordings' | 'instructors' | 'calendar';

export function LiveClassSchedule({ onExit, onUpgrade }: LiveClassScheduleProps) {
  const { theme } = useTheme();
  const { userProgress } = useApp();
  const [activeTab, setActiveTab] = useState<TabType>('upcoming');
  const [selectedClass, setSelectedClass] = useState<LiveClass | null>(null);
  const [selectedInstructor, setSelectedInstructor] = useState<Instructor | null>(null);
  const [selectedRecording, setSelectedRecording] = useState<Recording | null>(null);
  const [bookedClasses, setBookedClasses] = useState<string[]>(['c2']);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterLevel, setFilterLevel] = useState<string>('all');
  const [showBookingConfirm, setShowBookingConfirm] = useState(false);

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

  const handleBookClass = (classId: string) => {
    const classToBook = upcomingClasses.find(c => c.id === classId);
    if (classToBook?.isPremium && !userProgress.isPremium) {
      if (onUpgrade) onUpgrade();
      return;
    }
    
    setBookedClasses([...bookedClasses, classId]);
    setShowBookingConfirm(true);
    setTimeout(() => setShowBookingConfirm(false), 3000);
  };

  const handleCancelBooking = (classId: string) => {
    setBookedClasses(bookedClasses.filter(id => id !== classId));
  };

  const handlePlayRecording = (recording: Recording) => {
    if (recording.isPremium && !userProgress.isPremium) {
      if (onUpgrade) onUpgrade();
      return;
    }
    setSelectedRecording(recording);
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'beginner': return colors.successColor;
      case 'intermediate': return colors.warningColor;
      case 'advanced': return colors.errorColor;
      default: return colors.iconColor;
    }
  };

  const filteredClasses = upcomingClasses.filter(cls => {
    const matchesSearch = cls.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         cls.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesLevel = filterLevel === 'all' || cls.level === filterLevel || cls.level === 'all';
    return matchesSearch && matchesLevel;
  });

  const tabs = [
    { id: 'upcoming' as TabType, label: 'Upcoming', icon: Calendar },
    { id: 'recordings' as TabType, label: 'Recordings', icon: Video },
    { id: 'instructors' as TabType, label: 'Instructors', icon: Users },
    { id: 'calendar' as TabType, label: 'My Calendar', icon: BookOpen },
  ];

  return (
    <div 
      className="h-full flex flex-col"
      style={{ background: colors.bg, color: colors.textPrimary }}
      role="main"
      aria-labelledby="live-classes-title"
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
              id="live-classes-title" 
              className="text-xl sm:text-2xl font-bold"
              style={{ fontFamily: 'Poppins, sans-serif' }}
            >
              Live Classes
            </h1>
            <p className="text-sm" style={{ color: colors.textSecondary }}>
              Learn from Deaf instructors
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
            placeholder="Search classes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-12 pl-10 pr-4 rounded-full text-sm"
            style={{
              background: colors.cardBg,
              border: colors.glassBorder,
              color: colors.textPrimary,
              outline: 'none',
            }}
            aria-label="Search classes"
          />
        </div>

        {/* Tabs */}
        <div className="flex gap-2 overflow-x-auto pb-2" role="tablist" aria-label="Class sections">
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

      {/* Upcoming Classes Tab */}
      {activeTab === 'upcoming' && (
        <div 
          className="flex-1 overflow-y-auto p-4 sm:p-6"
          role="tabpanel"
          id="upcoming-panel"
          aria-labelledby="upcoming-tab"
        >
          {/* Level Filter */}
          <div className="flex gap-2 mb-4 overflow-x-auto pb-2" role="group" aria-label="Filter by level">
            {['all', 'beginner', 'intermediate', 'advanced'].map((level) => (
              <button
                key={level}
                onClick={() => setFilterLevel(level)}
                className="px-3 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-all capitalize"
                style={{
                  background: filterLevel === level ? colors.iconColor : colors.cardBg,
                  color: filterLevel === level 
                    ? (theme === 'dark' ? 'var(--color-bg-deep)' : '#FFFFFF')
                    : colors.textPrimary,
                  border: colors.glassBorder,
                }}
                aria-pressed={filterLevel === level}
              >
                {level === 'all' ? 'All Levels' : level}
              </button>
            ))}
          </div>

          {/* Classes List */}
          <div className="space-y-4">
            {filteredClasses.map((cls, index) => {
              const isBooked = bookedClasses.includes(cls.id);
              const spotsLeft = cls.maxStudents - cls.enrolledStudents;
              const isFull = spotsLeft <= 0;

              return (
                <motion.article
                  key={cls.id}
                  className="rounded-xl overflow-hidden"
                  style={{
                    background: colors.cardBg,
                    backdropFilter: colors.blur,
                    WebkitBackdropFilter: colors.blur,
                    border: isBooked ? `2px solid ${colors.successColor}` : colors.glassBorder,
                    boxShadow: colors.shadow,
                  }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <div className="p-4">
                    {/* Class Header */}
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                          <h3 className="font-bold text-base" style={{ color: colors.textPrimary }}>
                            {cls.title}
                          </h3>
                          {cls.isPremium && (
                            <Crown className="w-4 h-4" style={{ color: colors.warningColor }} aria-label="Premium class" />
                          )}
                          {isBooked && (
                            <CheckCircle className="w-4 h-4" style={{ color: colors.successColor }} aria-label="Booked" />
                          )}
                        </div>
                        <p className="text-sm mb-2" style={{ color: colors.textSecondary }}>
                          {cls.description}
                        </p>
                      </div>
                    </div>

                    {/* Instructor */}
                    <button
                      onClick={() => setSelectedInstructor(cls.instructor)}
                      className="flex items-center gap-2 mb-3 transition-opacity hover:opacity-80"
                      aria-label={`View instructor profile: ${cls.instructor.name}`}
                    >
                      <div 
                        className="w-8 h-8 rounded-full flex items-center justify-center font-semibold text-sm flex-shrink-0"
                        style={{ background: colors.iconBg, color: colors.iconColor }}
                        aria-hidden="true"
                      >
                        {cls.instructor.avatar}
                      </div>
                      <div className="text-left">
                        <div className="text-sm font-semibold" style={{ color: colors.textPrimary }}>
                          {cls.instructor.name}
                        </div>
                        <div className="flex items-center gap-2 text-xs" style={{ color: colors.textTertiary }}>
                          <Star className="w-3 h-3 fill-current" style={{ color: colors.warningColor }} aria-hidden="true" />
                          {cls.instructor.rating}
                          {cls.instructor.isDeaf && (
                            <>
                              <span>•</span>
                              <Award className="w-3 h-3" style={{ color: colors.iconColor }} aria-hidden="true" />
                              <span>Deaf Instructor</span>
                            </>
                          )}
                        </div>
                      </div>
                    </button>

                    {/* Class Details */}
                    <div className="grid grid-cols-2 gap-2 mb-3 text-xs">
                      <div className="flex items-center gap-2" style={{ color: colors.textSecondary }}>
                        <Calendar className="w-4 h-4 flex-shrink-0" style={{ color: colors.iconColor }} aria-hidden="true" />
                        <span>{new Date(cls.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                      </div>
                      <div className="flex items-center gap-2" style={{ color: colors.textSecondary }}>
                        <Clock className="w-4 h-4 flex-shrink-0" style={{ color: colors.iconColor }} aria-hidden="true" />
                        <span>{cls.time}</span>
                      </div>
                      <div className="flex items-center gap-2" style={{ color: colors.textSecondary }}>
                        <Video className="w-4 h-4 flex-shrink-0" style={{ color: colors.iconColor }} aria-hidden="true" />
                        <span>{cls.duration}</span>
                      </div>
                      <div className="flex items-center gap-2" style={{ color: colors.textSecondary }}>
                        <Users className="w-4 h-4 flex-shrink-0" style={{ color: colors.iconColor }} aria-hidden="true" />
                        <span>{spotsLeft} spots left</span>
                      </div>
                    </div>

                    {/* Tags */}
                    <div className="flex gap-2 mb-3 flex-wrap">
                      <span 
                        className="px-2 py-1 rounded-full text-xs font-semibold capitalize"
                        style={{
                          background: `${getLevelColor(cls.level)}20`,
                          color: getLevelColor(cls.level),
                        }}
                      >
                        {cls.level}
                      </span>
                      <span 
                        className="px-2 py-1 rounded-full text-xs font-semibold"
                        style={{ background: colors.iconBg, color: colors.iconColor }}
                      >
                        {cls.category}
                      </span>
                    </div>

                    {/* Actions */}
                    {isBooked ? (
                      <div className="grid grid-cols-2 gap-2">
                        <Button
                          className="h-10 rounded-full font-semibold text-sm"
                          style={{
                            background: colors.iconColor,
                            color: theme === 'dark' ? 'var(--color-bg-deep)' : '#FFFFFF',
                          }}
                          aria-label="Join class"
                        >
                          <Video className="w-4 h-4 mr-2" aria-hidden="true" />
                          Join Class
                        </Button>
                        <Button
                          onClick={() => handleCancelBooking(cls.id)}
                          className="h-10 rounded-full font-semibold text-sm"
                          style={{
                            background: colors.cardBg,
                            color: colors.textPrimary,
                            border: colors.glassBorder,
                          }}
                          aria-label="Cancel booking"
                        >
                          Cancel
                        </Button>
                      </div>
                    ) : (
                      <Button
                        onClick={() => {
                          setSelectedClass(cls);
                          handleBookClass(cls.id);
                        }}
                        disabled={isFull}
                        className="w-full h-10 rounded-full font-semibold text-sm"
                        style={{
                          background: isFull ? colors.cardBg : colors.iconColor,
                          color: isFull 
                            ? colors.textTertiary 
                            : (theme === 'dark' ? 'var(--color-bg-deep)' : '#FFFFFF'),
                          opacity: isFull ? 0.5 : 1,
                        }}
                        aria-label={isFull ? 'Class full' : `Book ${cls.title}`}
                      >
                        {isFull ? 'Class Full' : 'Book Class'}
                      </Button>
                    )}
                  </div>
                </motion.article>
              );
            })}
          </div>
        </div>
      )}

      {/* Recordings Tab */}
      {activeTab === 'recordings' && (
        <div 
          className="flex-1 overflow-y-auto p-4 sm:p-6"
          role="tabpanel"
          id="recordings-panel"
          aria-labelledby="recordings-tab"
        >
          <div className="mb-4">
            <h2 className="text-lg font-semibold mb-1">Past Class Recordings</h2>
            <p className="text-sm" style={{ color: colors.textSecondary }}>
              Watch previous classes on-demand
            </p>
          </div>

          <div className="space-y-3">
            {recordings.map((recording, index) => (
              <motion.article
                key={recording.id}
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
                  <div className="flex items-start gap-3 mb-3">
                    {/* Thumbnail */}
                    <div 
                      className="w-20 h-20 rounded-lg flex items-center justify-center text-3xl flex-shrink-0"
                      style={{ background: colors.iconBg }}
                      aria-hidden="true"
                    >
                      {recording.thumbnail}
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold text-sm" style={{ color: colors.textPrimary }}>
                          {recording.classTitle}
                        </h3>
                        {recording.isPremium && (
                          <Crown className="w-4 h-4" style={{ color: colors.warningColor }} aria-label="Premium recording" />
                        )}
                      </div>
                      <p className="text-xs mb-1" style={{ color: colors.textTertiary }}>
                        {recording.instructor}
                      </p>
                      <div className="flex items-center gap-3 text-xs" style={{ color: colors.textSecondary }}>
                        <span>{recording.duration}</span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <Star className="w-3 h-3 fill-current" style={{ color: colors.warningColor }} aria-hidden="true" />
                          {recording.rating}
                        </span>
                        <span>•</span>
                        <span>{recording.views.toLocaleString()} views</span>
                      </div>
                      <div className="text-xs mt-2">
                        <span 
                          className="px-2 py-1 rounded-full"
                          style={{ background: colors.iconBg, color: colors.iconColor }}
                        >
                          {recording.category}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="grid grid-cols-3 gap-2">
                    <Button
                      onClick={() => handlePlayRecording(recording)}
                      className="h-9 rounded-full font-semibold text-xs col-span-2"
                      style={{
                        background: colors.iconColor,
                        color: theme === 'dark' ? 'var(--color-bg-deep)' : '#FFFFFF',
                      }}
                      aria-label={`Watch ${recording.classTitle}`}
                    >
                      <Play className="w-4 h-4 mr-1" aria-hidden="true" />
                      Watch
                    </Button>
                    <Button
                      className="h-9 rounded-full text-xs"
                      style={{
                        background: colors.cardBg,
                        color: colors.textPrimary,
                        border: colors.glassBorder,
                      }}
                      aria-label={`Download ${recording.classTitle}`}
                    >
                      <Download className="w-4 h-4" aria-hidden="true" />
                    </Button>
                  </div>
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      )}

      {/* Instructors Tab */}
      {activeTab === 'instructors' && (
        <div 
          className="flex-1 overflow-y-auto p-4 sm:p-6"
          role="tabpanel"
          id="instructors-panel"
          aria-labelledby="instructors-tab"
        >
          <div className="mb-4">
            <h2 className="text-lg font-semibold mb-1">Meet Our Instructors</h2>
            <p className="text-sm" style={{ color: colors.textSecondary }}>
              Learn from experienced Deaf educators
            </p>
          </div>

          <div className="space-y-4">
            {instructors.map((instructor, index) => (
              <motion.button
                key={instructor.id}
                onClick={() => setSelectedInstructor(instructor)}
                className="w-full rounded-xl p-4 text-left transition-colors"
                style={{
                  background: colors.cardBg,
                  backdropFilter: colors.blur,
                  WebkitBackdropFilter: colors.blur,
                  border: colors.glassBorder,
                  boxShadow: colors.shadow,
                }}
                onMouseEnter={(e) => e.currentTarget.style.background = colors.cardHover}
                onMouseLeave={(e) => e.currentTarget.style.background = colors.cardBg}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                aria-label={`View profile: ${instructor.name}, ${instructor.yearsExperience} years experience, ${instructor.rating} rating`}
              >
                <div className="flex items-start gap-3 mb-3">
                  <div 
                    className="w-16 h-16 rounded-full flex items-center justify-center font-bold text-xl flex-shrink-0"
                    style={{ background: colors.iconBg, color: colors.iconColor }}
                    aria-hidden="true"
                  >
                    {instructor.avatar}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-bold text-base" style={{ color: colors.textPrimary }}>
                        {instructor.name}
                      </h3>
                      {instructor.isDeaf && (
                        <Award className="w-4 h-4" style={{ color: colors.iconColor }} aria-label="Deaf instructor" />
                      )}
                    </div>
                    <div className="flex items-center gap-3 text-xs mb-2" style={{ color: colors.textTertiary }}>
                      <span className="flex items-center gap-1">
                        <Star className="w-3 h-3 fill-current" style={{ color: colors.warningColor }} aria-hidden="true" />
                        {instructor.rating}
                      </span>
                      <span>•</span>
                      <span>{instructor.yearsExperience} years</span>
                      <span>•</span>
                      <span>{instructor.totalStudents.toLocaleString()} students</span>
                    </div>
                    <p className="text-sm leading-relaxed mb-2" style={{ color: colors.textSecondary }}>
                      {instructor.bio}
                    </p>
                  </div>
                </div>

                {/* Specialties */}
                <div className="flex flex-wrap gap-2 mb-2">
                  {instructor.specialties.map((specialty, idx) => (
                    <span 
                      key={idx}
                      className="px-2 py-1 rounded-full text-xs font-medium"
                      style={{ background: colors.successBg, color: colors.successColor }}
                    >
                      {specialty}
                    </span>
                  ))}
                </div>

                <div className="flex items-center justify-end">
                  <ChevronRight className="w-5 h-5" style={{ color: colors.iconColor }} aria-hidden="true" />
                </div>
              </motion.button>
            ))}
          </div>
        </div>
      )}

      {/* My Calendar Tab */}
      {activeTab === 'calendar' && (
        <div 
          className="flex-1 overflow-y-auto p-4 sm:p-6"
          role="tabpanel"
          id="calendar-panel"
          aria-labelledby="calendar-tab"
        >
          <div className="mb-4">
            <h2 className="text-lg font-semibold mb-1">My Booked Classes</h2>
            <p className="text-sm" style={{ color: colors.textSecondary }}>
              {bookedClasses.length} upcoming class{bookedClasses.length !== 1 ? 'es' : ''}
            </p>
          </div>

          {bookedClasses.length > 0 ? (
            <div className="space-y-3">
              {upcomingClasses
                .filter(cls => bookedClasses.includes(cls.id))
                .map((cls, index) => (
                  <motion.div
                    key={cls.id}
                    className="rounded-xl p-4"
                    style={{
                      background: colors.cardBg,
                      backdropFilter: colors.blur,
                      WebkitBackdropFilter: colors.blur,
                      border: `2px solid ${colors.successColor}`,
                      boxShadow: colors.shadow,
                    }}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <CheckCircle className="w-5 h-5" style={{ color: colors.successColor }} aria-hidden="true" />
                      <h3 className="font-semibold" style={{ color: colors.textPrimary }}>
                        {cls.title}
                      </h3>
                    </div>

                    <div className="grid grid-cols-2 gap-2 mb-3 text-sm" style={{ color: colors.textSecondary }}>
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4" style={{ color: colors.iconColor }} aria-hidden="true" />
                        <span>{new Date(cls.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric' })}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4" style={{ color: colors.iconColor }} aria-hidden="true" />
                        <span>{cls.time}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 mb-3 text-sm" style={{ color: colors.textSecondary }}>
                      <div 
                        className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-semibold"
                        style={{ background: colors.iconBg, color: colors.iconColor }}
                        aria-hidden="true"
                      >
                        {cls.instructor.avatar}
                      </div>
                      <span>{cls.instructor.name}</span>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <Button
                        className="h-10 rounded-full font-semibold text-sm"
                        style={{
                          background: colors.iconColor,
                          color: theme === 'dark' ? 'var(--color-bg-deep)' : '#FFFFFF',
                        }}
                        aria-label="Join class"
                      >
                        <Video className="w-4 h-4 mr-2" aria-hidden="true" />
                        Join
                      </Button>
                      <Button
                        className="h-10 rounded-full font-semibold text-sm"
                        style={{
                          background: colors.cardBg,
                          color: colors.textPrimary,
                          border: colors.glassBorder,
                        }}
                        aria-label="Add to calendar"
                      >
                        <Calendar className="w-4 h-4 mr-2" aria-hidden="true" />
                        Add to Cal
                      </Button>
                    </div>
                  </motion.div>
                ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Calendar className="w-16 h-16 mx-auto mb-4" style={{ color: colors.textTertiary }} aria-hidden="true" />
              <h3 className="text-lg font-semibold mb-2">No Booked Classes</h3>
              <p className="text-sm mb-4" style={{ color: colors.textSecondary }}>
                Browse upcoming classes and book your first session!
              </p>
              <Button
                onClick={() => setActiveTab('upcoming')}
                className="h-10 px-6 rounded-full font-semibold"
                style={{
                  background: colors.iconColor,
                  color: theme === 'dark' ? 'var(--color-bg-deep)' : '#FFFFFF',
                }}
                aria-label="Browse upcoming classes"
              >
                Browse Classes
              </Button>
            </div>
          )}
        </div>
      )}

      {/* Instructor Profile Modal */}
      <AnimatePresence>
        {selectedInstructor && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{ background: 'rgba(0, 0, 0, 0.8)' }}
            onClick={() => setSelectedInstructor(null)}
            role="dialog"
            aria-labelledby="instructor-modal-title"
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
                  onClick={() => setSelectedInstructor(null)}
                  className="absolute top-4 right-4"
                  style={{ color: '#FFFFFF' }}
                  aria-label="Close instructor profile"
                >
                  <X className="w-6 h-6" />
                </Button>

                <div className="text-center">
                  <div 
                    className="w-20 h-20 rounded-full flex items-center justify-center font-bold text-2xl mx-auto mb-3"
                    style={{ background: 'rgba(255, 255, 255, 0.2)', color: '#FFFFFF' }}
                    aria-hidden="true"
                  >
                    {selectedInstructor.avatar}
                  </div>
                  <h2 id="instructor-modal-title" className="text-xl font-bold mb-1" style={{ color: '#FFFFFF' }}>
                    {selectedInstructor.name}
                  </h2>
                  {selectedInstructor.isDeaf && (
                    <div className="flex items-center justify-center gap-2 mb-2">
                      <Award className="w-4 h-4" style={{ color: '#FFFFFF' }} aria-hidden="true" />
                      <span className="text-sm" style={{ color: 'rgba(255, 255, 255, 0.9)' }}>
                        Deaf Instructor
                      </span>
                    </div>
                  )}
                  <div className="flex items-center justify-center gap-3">
                    <span className="flex items-center gap-1 text-sm" style={{ color: 'rgba(255, 255, 255, 0.9)' }}>
                      <Star className="w-4 h-4 fill-current" aria-hidden="true" />
                      {selectedInstructor.rating} Rating
                    </span>
                    <span style={{ color: 'rgba(255, 255, 255, 0.9)' }}>•</span>
                    <span className="text-sm" style={{ color: 'rgba(255, 255, 255, 0.9)' }}>
                      {selectedInstructor.totalStudents.toLocaleString()} Students
                    </span>
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                <div className="mb-4">
                  <h3 className="text-sm font-semibold mb-2" style={{ color: colors.textTertiary }}>
                    About
                  </h3>
                  <p className="text-sm leading-relaxed" style={{ color: colors.textSecondary }}>
                    {selectedInstructor.bio}
                  </p>
                </div>

                <div className="mb-4">
                  <h3 className="text-sm font-semibold mb-2" style={{ color: colors.textTertiary }}>
                    Experience
                  </h3>
                  <p className="text-sm" style={{ color: colors.textPrimary }}>
                    {selectedInstructor.yearsExperience} years of teaching
                  </p>
                </div>

                <div className="mb-4">
                  <h3 className="text-sm font-semibold mb-2" style={{ color: colors.textTertiary }}>
                    Certifications
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedInstructor.certifications.map((cert, idx) => (
                      <span 
                        key={idx}
                        className="px-2 py-1 rounded-full text-xs font-medium"
                        style={{ background: colors.iconBg, color: colors.iconColor }}
                      >
                        {cert}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="mb-6">
                  <h3 className="text-sm font-semibold mb-2" style={{ color: colors.textTertiary }}>
                    Specialties
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedInstructor.specialties.map((specialty, idx) => (
                      <span 
                        key={idx}
                        className="px-2 py-1 rounded-full text-xs font-medium"
                        style={{ background: colors.successBg, color: colors.successColor }}
                      >
                        {specialty}
                      </span>
                    ))}
                  </div>
                </div>

                <Button
                  onClick={() => {
                    setSelectedInstructor(null);
                    setActiveTab('upcoming');
                  }}
                  className="w-full h-12 rounded-full font-semibold"
                  style={{
                    background: colors.iconColor,
                    color: theme === 'dark' ? 'var(--color-bg-deep)' : '#FFFFFF',
                  }}
                  aria-label={`View classes by ${selectedInstructor.name}`}
                >
                  View Classes
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Booking Confirmation Toast */}
      <AnimatePresence>
        {showBookingConfirm && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-24 left-4 right-4 rounded-xl p-4 z-50"
            style={{
              background: colors.successColor,
              color: '#FFFFFF',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
            }}
            role="status"
            aria-live="polite"
          >
            <div className="flex items-center gap-3">
              <CheckCircle className="w-6 h-6" aria-hidden="true" />
              <div className="flex-1">
                <div className="font-semibold">Class Booked!</div>
                <div className="text-sm opacity-90">You'll receive a reminder before class starts</div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
