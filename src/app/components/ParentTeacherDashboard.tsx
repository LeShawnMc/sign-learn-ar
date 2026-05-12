import { useState } from 'react';
import { Button } from './ui/button';
import { useTheme } from '../context/ThemeContext';
import { useApp } from '../context/AppContext';
import exampleImage from 'figma:asset/a153955fd17e66186d133fa0c7f615a57a831649.png';
import { 
  X, 
  Users,
  BookOpen,
  TrendingUp,
  Award,
  Calendar,
  Clock,
  CheckCircle2,
  AlertCircle,
  Send,
  Plus,
  Search,
  Filter,
  Download,
  BarChart3,
  PieChart,
  Activity,
  Target,
  Bell,
  MessageCircle,
  Mail,
  Phone,
  ChevronRight,
  ChevronDown,
  MoreVertical,
  Edit,
  Trash2,
  Eye,
  Star,
  TrendingDown,
  RefreshCw,
  Settings,
  FileText,
  Clipboard,
  UserPlus,
  Share2,
  Printer,
  PlayCircle,
  PauseCircle,
  XCircle,
  Info,
  Zap,
  Heart,
  ThumbsUp,
  AlertTriangle,
  CircleDot,
  Medal,
} from 'lucide-react';

interface ParentTeacherDashboardProps {
  onExit: () => void;
}

interface Student {
  id: string;
  name: string;
  avatar: string;
  grade: string;
  lessonsCompleted: number;
  totalLessons: number;
  accuracy: number;
  lastActive: string;
  currentStreak: number;
  totalXP: number;
  status: 'active' | 'inactive' | 'struggling';
}

interface Assignment {
  id: string;
  lessonName: string;
  assignedTo: string[];
  dueDate: string;
  completionRate: number;
  status: 'active' | 'completed' | 'overdue';
}

interface ClassProgress {
  lessonName: string;
  totalStudents: number;
  completed: number;
  inProgress: number;
  notStarted: number;
}

interface Message {
  id: string;
  studentName: string;
  subject: string;
  preview: string;
  timestamp: string;
  isRead: boolean;
  type: 'question' | 'update' | 'alert';
}

interface Report {
  id: string;
  title: string;
  type: string;
  generatedDate: string;
  fileSize: string;
}

export function ParentTeacherDashboard({ onExit }: ParentTeacherDashboardProps) {
  const { theme } = useTheme();
  const { userProgress } = useApp();

  const [selectedTab, setSelectedTab] = useState<'overview' | 'students' | 'assignments' | 'reports' | 'messages'>('overview');
  const [showAssignLesson, setShowAssignLesson] = useState(false);
  const [showStudentDetail, setShowStudentDetail] = useState<Student | null>(null);
  const [showNewMessage, setShowNewMessage] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStudents, setSelectedStudents] = useState<Set<string>>(new Set());

  // Overview Metrics
  const [metrics] = useState({
    totalStudents: 24,
    activeLessons: 18,
    averageCompletion: 87,
    classAverageAccuracy: 92,
  });

  // Students
  const [students, setStudents] = useState<Student[]>([
    {
      id: 'st-1',
      name: 'Emma Wilson',
      avatar: 'EW',
      grade: '5th Grade',
      lessonsCompleted: 42,
      totalLessons: 50,
      accuracy: 95,
      lastActive: '2 hours ago',
      currentStreak: 12,
      totalXP: 4850,
      status: 'active',
    },
    {
      id: 'st-2',
      name: 'Noah Martinez',
      avatar: 'NM',
      grade: '5th Grade',
      lessonsCompleted: 38,
      totalLessons: 50,
      accuracy: 89,
      lastActive: '5 hours ago',
      currentStreak: 8,
      totalXP: 4120,
      status: 'active',
    },
    {
      id: 'st-3',
      name: 'Olivia Brown',
      avatar: 'OB',
      grade: '6th Grade',
      lessonsCompleted: 45,
      totalLessons: 50,
      accuracy: 97,
      lastActive: '1 hour ago',
      currentStreak: 15,
      totalXP: 5290,
      status: 'active',
    },
    {
      id: 'st-4',
      name: 'Liam Davis',
      avatar: 'LD',
      grade: '5th Grade',
      lessonsCompleted: 28,
      totalLessons: 50,
      accuracy: 78,
      lastActive: '3 days ago',
      currentStreak: 0,
      totalXP: 2850,
      status: 'struggling',
    },
    {
      id: 'st-5',
      name: 'Sophia Garcia',
      avatar: 'SG',
      grade: '6th Grade',
      lessonsCompleted: 40,
      totalLessons: 50,
      accuracy: 91,
      lastActive: '4 hours ago',
      currentStreak: 10,
      totalXP: 4560,
      status: 'active',
    },
    {
      id: 'st-6',
      name: 'Mason Johnson',
      avatar: 'MJ',
      grade: '5th Grade',
      lessonsCompleted: 35,
      totalLessons: 50,
      accuracy: 85,
      lastActive: '1 day ago',
      currentStreak: 5,
      totalXP: 3720,
      status: 'active',
    },
    {
      id: 'st-7',
      name: 'Ava Rodriguez',
      avatar: 'AR',
      grade: '6th Grade',
      lessonsCompleted: 48,
      totalLessons: 50,
      accuracy: 98,
      lastActive: '30 minutes ago',
      currentStreak: 18,
      totalXP: 5890,
      status: 'active',
    },
    {
      id: 'st-8',
      name: 'Ethan Lee',
      avatar: 'EL',
      grade: '5th Grade',
      lessonsCompleted: 22,
      totalLessons: 50,
      accuracy: 72,
      lastActive: '1 week ago',
      currentStreak: 0,
      totalXP: 2140,
      status: 'inactive',
    },
  ]);

  // Assignments
  const [assignments, setAssignments] = useState<Assignment[]>([
    {
      id: 'asn-1',
      lessonName: 'Family Signs',
      assignedTo: ['Emma Wilson', 'Noah Martinez', 'Olivia Brown', 'Liam Davis'],
      dueDate: 'Jan 15, 2026',
      completionRate: 75,
      status: 'active',
    },
    {
      id: 'asn-2',
      lessonName: 'Medical Emergency Signs',
      assignedTo: ['All Students'],
      dueDate: 'Jan 20, 2026',
      completionRate: 45,
      status: 'active',
    },
    {
      id: 'asn-3',
      lessonName: 'Basic Greetings',
      assignedTo: ['Mason Johnson', 'Ethan Lee'],
      dueDate: 'Jan 10, 2026',
      completionRate: 50,
      status: 'overdue',
    },
    {
      id: 'asn-4',
      lessonName: 'Numbers 1-100',
      assignedTo: ['Sophia Garcia', 'Ava Rodriguez'],
      dueDate: 'Jan 8, 2026',
      completionRate: 100,
      status: 'completed',
    },
  ]);

  // Class Progress
  const [classProgress] = useState<ClassProgress[]>([
    {
      lessonName: 'Basic Greetings',
      totalStudents: 24,
      completed: 18,
      inProgress: 4,
      notStarted: 2,
    },
    {
      lessonName: 'Family Signs',
      totalStudents: 24,
      completed: 15,
      inProgress: 6,
      notStarted: 3,
    },
    {
      lessonName: 'Numbers 1-100',
      totalStudents: 24,
      completed: 12,
      inProgress: 8,
      notStarted: 4,
    },
    {
      lessonName: 'Emotions & Feelings',
      totalStudents: 24,
      completed: 10,
      inProgress: 7,
      notStarted: 7,
    },
  ]);

  // Messages
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'msg-1',
      studentName: 'Emma Wilson',
      subject: 'Question about Family Signs',
      preview: 'Hi! I need help with the sign for "grandmother". Can you...',
      timestamp: '1 hour ago',
      isRead: false,
      type: 'question',
    },
    {
      id: 'msg-2',
      studentName: 'Liam Davis',
      subject: 'Assignment Help Needed',
      preview: 'I\'m having trouble with the Medical Emergency lesson...',
      timestamp: '3 hours ago',
      isRead: false,
      type: 'question',
    },
    {
      id: 'msg-3',
      studentName: 'System',
      subject: 'Assignment Overdue',
      preview: 'Basic Greetings assignment is now overdue for 2 students',
      timestamp: '5 hours ago',
      isRead: true,
      type: 'alert',
    },
    {
      id: 'msg-4',
      studentName: 'Ava Rodriguez',
      subject: 'Completed All Lessons!',
      preview: 'I finished all my assigned lessons! What should I do next?',
      timestamp: '1 day ago',
      isRead: true,
      type: 'update',
    },
  ]);

  // Reports
  const [reports] = useState<Report[]>([
    {
      id: 'rep-1',
      title: 'Monthly Progress Report',
      type: 'PDF',
      generatedDate: 'Jan 1, 2026',
      fileSize: '2.4 MB',
    },
    {
      id: 'rep-2',
      title: 'Student Performance Analysis',
      type: 'Excel',
      generatedDate: 'Dec 28, 2025',
      fileSize: '1.8 MB',
    },
    {
      id: 'rep-3',
      title: 'Attendance Summary',
      type: 'PDF',
      generatedDate: 'Dec 25, 2025',
      fileSize: '892 KB',
    },
    {
      id: 'rep-4',
      title: 'Completion Rate by Lesson',
      type: 'Excel',
      generatedDate: 'Dec 20, 2025',
      fileSize: '1.2 MB',
    },
  ]);

  const getStatusColor = (status: string) => {
    if (status === 'active' || status === 'completed') return colors.successColor;
    if (status === 'struggling' || status === 'overdue') return colors.errorColor;
    if (status === 'inactive') return colors.textTertiary;
    return colors.iconColor;
  };

  const getStatusBg = (status: string) => {
    if (status === 'active' || status === 'completed') return colors.successBg;
    if (status === 'struggling' || status === 'overdue') return colors.errorBg;
    if (status === 'inactive') return colors.border;
    return colors.iconBg;
  };

  const handleToggleStudent = (studentId: string) => {
    setSelectedStudents(prev => {
      const newSet = new Set(prev);
      if (newSet.has(studentId)) {
        newSet.delete(studentId);
      } else {
        newSet.add(studentId);
      }
      return newSet;
    });
  };

  const handleMarkMessageRead = (messageId: string) => {
    setMessages(prev => prev.map(msg =>
      msg.id === messageId ? { ...msg, isRead: true } : msg
    ));
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
      aria-labelledby="dashboard-title"
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
            aria-label="Exit parent teacher dashboard"
            className="flex-shrink-0"
          >
            <X className="w-6 h-6" />
          </Button>
          <div className="flex-1 min-w-0">
            <h1 
              id="dashboard-title" 
              className="text-xl sm:text-2xl font-bold truncate"
              style={{ fontFamily: 'Poppins, sans-serif' }}
            >
              Teacher Dashboard
            </h1>
            <p className="text-sm truncate" style={{ color: colors.textSecondary }}>
              Manage students and track progress
            </p>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div 
        className="px-4 pb-4 pt-4 border-b"
        style={{ borderBottomColor: colors.border }}
        role="tablist"
        aria-label="Dashboard sections"
      >
        <div className="flex gap-2 overflow-x-auto pb-2">
          {[
            { id: 'overview', label: 'Overview', icon: BarChart3 },
            { id: 'students', label: 'Students', icon: Users },
            { id: 'assignments', label: 'Assignments', icon: Clipboard },
            { id: 'reports', label: 'Reports', icon: FileText },
            { id: 'messages', label: 'Messages', icon: MessageCircle },
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
                {tab.id === 'messages' && messages.filter(m => !m.isRead).length > 0 && (
                  <span 
                    className="w-5 h-5 rounded-full flex items-center justify-center text-xs"
                    style={{ 
                      background: colors.errorColor,
                      color: '#FFFFFF',
                    }}
                    aria-label={`${messages.filter(m => !m.isRead).length} unread messages`}
                  >
                    {messages.filter(m => !m.isRead).length}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto">
        {/* Overview Tab */}
        {selectedTab === 'overview' && (
          <section 
            id="overview-panel" 
            role="tabpanel" 
            aria-labelledby="overview-heading"
            className="p-4"
          >
            {/* Metrics */}
            <div className="grid grid-cols-2 gap-3 mb-6">
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
                <div 
                  className="w-10 h-10 rounded-lg flex items-center justify-center mb-3"
                  style={{ background: colors.iconBg }}
                >
                  <Users className="w-5 h-5" style={{ color: colors.iconColor }} />
                </div>
                <div className="text-2xl font-bold mb-1" style={{ color: colors.textPrimary }}>
                  {metrics.totalStudents}
                </div>
                <div className="text-sm" style={{ color: colors.textTertiary }}>
                  Total Students
                </div>
              </div>

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
                <div 
                  className="w-10 h-10 rounded-lg flex items-center justify-center mb-3"
                  style={{ background: colors.accentBg }}
                >
                  <BookOpen className="w-5 h-5" style={{ color: colors.accentColor }} />
                </div>
                <div className="text-2xl font-bold mb-1" style={{ color: colors.textPrimary }}>
                  {metrics.activeLessons}
                </div>
                <div className="text-sm" style={{ color: colors.textTertiary }}>
                  Active Lessons
                </div>
              </div>

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
                <div 
                  className="w-10 h-10 rounded-lg flex items-center justify-center mb-3"
                  style={{ background: colors.successBg }}
                >
                  <TrendingUp className="w-5 h-5" style={{ color: colors.successColor }} />
                </div>
                <div className="text-2xl font-bold mb-1" style={{ color: colors.textPrimary }}>
                  {metrics.averageCompletion}%
                </div>
                <div className="text-sm" style={{ color: colors.textTertiary }}>
                  Avg Completion
                </div>
              </div>

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
                <div 
                  className="w-10 h-10 rounded-lg flex items-center justify-center mb-3"
                  style={{ background: colors.warningBg }}
                >
                  <Target className="w-5 h-5" style={{ color: colors.warningColor }} />
                </div>
                <div className="text-2xl font-bold mb-1" style={{ color: colors.textPrimary }}>
                  {metrics.classAverageAccuracy}%
                </div>
                <div className="text-sm" style={{ color: colors.textTertiary }}>
                  Class Accuracy
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="mb-6">
              <h2 className="text-lg font-semibold mb-3" style={{ color: colors.textPrimary }}>
                Quick Actions
              </h2>
              <div className="grid grid-cols-2 gap-3">
                <Button
                  onClick={() => setShowAssignLesson(true)}
                  className="h-20 rounded-xl font-semibold flex flex-col items-center justify-center gap-2"
                  style={{ 
                    background: colors.iconColor,
                    color: theme === 'dark' ? '#0F0F23' : '#FFFFFF',
                  }}
                  aria-label="Assign new lesson"
                >
                  <Plus className="w-6 h-6" />
                  Assign Lesson
                </Button>
                <Button
                  className="h-20 rounded-xl font-semibold flex flex-col items-center justify-center gap-2"
                  style={{ 
                    background: colors.accentBg,
                    color: colors.accentColor,
                    border: `2px solid ${colors.accentColor}`,
                  }}
                  aria-label="Add new student"
                >
                  <UserPlus className="w-6 h-6" />
                  Add Student
                </Button>
                <Button
                  onClick={() => setShowNewMessage(true)}
                  className="h-20 rounded-xl font-semibold flex flex-col items-center justify-center gap-2"
                  style={{ 
                    background: colors.successBg,
                    color: colors.successColor,
                    border: `2px solid ${colors.successColor}`,
                  }}
                  aria-label="Send message to students"
                >
                  <Send className="w-6 h-6" />
                  Send Message
                </Button>
                <Button
                  className="h-20 rounded-xl font-semibold flex flex-col items-center justify-center gap-2"
                  style={{ 
                    background: colors.warningBg,
                    color: colors.warningColor,
                    border: `2px solid ${colors.warningColor}`,
                  }}
                  aria-label="Generate report"
                >
                  <Download className="w-6 h-6" />
                  Generate Report
                </Button>
              </div>
            </div>

            {/* Class Progress */}
            <div>
              <h2 className="text-lg font-semibold mb-3" style={{ color: colors.textPrimary }}>
                Class Progress
              </h2>
              <div className="space-y-3">
                {classProgress.map((progress, idx) => (
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
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-semibold" style={{ color: colors.textPrimary }}>
                        {progress.lessonName}
                      </h3>
                      <span className="text-sm" style={{ color: colors.textTertiary }}>
                        {progress.completed}/{progress.totalStudents} completed
                      </span>
                    </div>

                    {/* Progress Bar */}
                    <div className="relative">
                      <div 
                        className="w-full h-2 rounded-full overflow-hidden"
                        style={{ background: colors.border }}
                        role="progressbar"
                        aria-valuenow={progress.completed}
                        aria-valuemin={0}
                        aria-valuemax={progress.totalStudents}
                      >
                        <div className="h-full flex">
                          <div 
                            className="h-full"
                            style={{ 
                              background: colors.successColor,
                              width: `${(progress.completed / progress.totalStudents) * 100}%`,
                            }}
                          />
                          <div 
                            className="h-full"
                            style={{ 
                              background: colors.warningColor,
                              width: `${(progress.inProgress / progress.totalStudents) * 100}%`,
                            }}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 mt-3 text-xs">
                      <div className="flex items-center gap-1">
                        <div className="w-3 h-3 rounded-full" style={{ background: colors.successColor }} />
                        <span style={{ color: colors.textTertiary }}>
                          {progress.completed} Completed
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        <div className="w-3 h-3 rounded-full" style={{ background: colors.warningColor }} />
                        <span style={{ color: colors.textTertiary }}>
                          {progress.inProgress} In Progress
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        <div className="w-3 h-3 rounded-full" style={{ background: colors.border }} />
                        <span style={{ color: colors.textTertiary }}>
                          {progress.notStarted} Not Started
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Students Tab */}
        {selectedTab === 'students' && (
          <section 
            id="students-panel" 
            role="tabpanel" 
            aria-labelledby="students-heading"
            className="p-4"
          >
            {/* Search and Filter */}
            <div className="mb-4">
              <div 
                className="rounded-xl px-4 py-3 flex items-center gap-3"
                style={{
                  background: colors.cardBg,
                  backdropFilter: colors.blur,
                  WebkitBackdropFilter: colors.blur,
                  border: colors.glassBorder,
                }}
              >
                <Search className="w-5 h-5" style={{ color: colors.textTertiary }} />
                <input
                  type="text"
                  placeholder="Search students..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="flex-1 bg-transparent outline-none text-sm"
                  style={{ color: colors.textPrimary }}
                  aria-label="Search students"
                />
                <button
                  className="p-2 rounded-lg"
                  style={{ background: colors.iconBg }}
                  aria-label="Filter students"
                >
                  <Filter className="w-4 h-4" style={{ color: colors.iconColor }} />
                </button>
              </div>
            </div>

            {/* Student List */}
            <div className="space-y-3">
              {students.map((student) => (
                <div
                  key={student.id}
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
                      className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 font-bold"
                      style={{ 
                        background: colors.iconBg,
                        color: colors.iconColor,
                      }}
                    >
                      {student.avatar}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold" style={{ color: colors.textPrimary }}>
                          {student.name}
                        </h3>
                        <span 
                          className="text-xs px-2 py-0.5 rounded-full"
                          style={{
                            background: getStatusBg(student.status),
                            color: getStatusColor(student.status),
                          }}
                        >
                          {student.status}
                        </span>
                      </div>
                      <div className="text-sm mb-2" style={{ color: colors.textTertiary }}>
                        {student.grade} • Last active {student.lastActive}
                      </div>
                      <div className="flex items-center gap-3 text-xs flex-wrap">
                        <span className="flex items-center gap-1" style={{ color: colors.textTertiary }}>
                          <BookOpen className="w-3 h-3" />
                          {student.lessonsCompleted}/{student.totalLessons}
                        </span>
                        <span className="flex items-center gap-1" style={{ color: colors.textTertiary }}>
                          <Target className="w-3 h-3" />
                          {student.accuracy}% accuracy
                        </span>
                        <span className="flex items-center gap-1" style={{ color: colors.textTertiary }}>
                          <Award className="w-3 h-3" />
                          {student.totalXP} XP
                        </span>
                      </div>
                    </div>
                    <button
                      onClick={() => setShowStudentDetail(student)}
                      className="p-2 rounded-lg flex-shrink-0"
                      style={{ background: colors.iconBg }}
                      aria-label={`View ${student.name} details`}
                    >
                      <ChevronRight className="w-5 h-5" style={{ color: colors.iconColor }} />
                    </button>
                  </div>

                  {/* Progress Bar */}
                  <div className="mb-3">
                    <div className="flex items-center justify-between mb-1 text-xs" style={{ color: colors.textTertiary }}>
                      <span>Course Progress</span>
                      <span>{Math.round((student.lessonsCompleted / student.totalLessons) * 100)}%</span>
                    </div>
                    <div 
                      className="w-full h-2 rounded-full overflow-hidden"
                      style={{ background: colors.border }}
                      role="progressbar"
                      aria-valuenow={student.lessonsCompleted}
                      aria-valuemin={0}
                      aria-valuemax={student.totalLessons}
                    >
                      <div 
                        className="h-full rounded-full transition-all"
                        style={{ 
                          background: colors.successColor,
                          width: `${(student.lessonsCompleted / student.totalLessons) * 100}%`,
                        }}
                      />
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button
                      className="flex-1 h-9 rounded-lg text-sm font-semibold"
                      style={{ 
                        background: colors.iconBg,
                        color: colors.iconColor,
                      }}
                      aria-label={`Message ${student.name}`}
                    >
                      <MessageCircle className="w-4 h-4 mr-1" />
                      Message
                    </Button>
                    <Button
                      className="flex-1 h-9 rounded-lg text-sm font-semibold"
                      style={{ 
                        background: colors.accentBg,
                        color: colors.accentColor,
                      }}
                      aria-label={`View ${student.name} reports`}
                    >
                      <FileText className="w-4 h-4 mr-1" />
                      Reports
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Assignments Tab */}
        {selectedTab === 'assignments' && (
          <section 
            id="assignments-panel" 
            role="tabpanel" 
            aria-labelledby="assignments-heading"
            className="p-4"
          >
            <div className="flex items-center justify-between mb-4">
              <h2 id="assignments-heading" className="text-lg font-semibold" style={{ color: colors.textPrimary }}>
                Active Assignments
              </h2>
              <Button
                onClick={() => setShowAssignLesson(true)}
                className="h-10 rounded-xl font-semibold flex items-center gap-2"
                style={{ 
                  background: colors.iconColor,
                  color: theme === 'dark' ? '#0F0F23' : '#FFFFFF',
                }}
                aria-label="Create new assignment"
              >
                <Plus className="w-4 h-4" />
                New
              </Button>
            </div>

            <div className="space-y-3">
              {assignments.map((assignment) => (
                <div
                  key={assignment.id}
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
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold" style={{ color: colors.textPrimary }}>
                          {assignment.lessonName}
                        </h3>
                        <span 
                          className="text-xs px-2 py-0.5 rounded-full"
                          style={{
                            background: getStatusBg(assignment.status),
                            color: getStatusColor(assignment.status),
                          }}
                        >
                          {assignment.status}
                        </span>
                      </div>
                      <div className="text-sm mb-2" style={{ color: colors.textTertiary }}>
                        Due: {assignment.dueDate}
                      </div>
                      <div className="text-xs" style={{ color: colors.textTertiary }}>
                        Assigned to: {Array.isArray(assignment.assignedTo) && assignment.assignedTo.length === 1 && assignment.assignedTo[0] === 'All Students'
                          ? 'All Students'
                          : `${assignment.assignedTo.length} students`}
                      </div>
                    </div>
                    <button
                      className="p-2 rounded-lg"
                      style={{ background: colors.iconBg }}
                      aria-label={`Assignment options for ${assignment.lessonName}`}
                    >
                      <MoreVertical className="w-4 h-4" style={{ color: colors.iconColor }} />
                    </button>
                  </div>

                  {/* Completion Progress */}
                  <div className="mb-3">
                    <div className="flex items-center justify-between mb-1 text-xs" style={{ color: colors.textTertiary }}>
                      <span>Completion Rate</span>
                      <span>{assignment.completionRate}%</span>
                    </div>
                    <div 
                      className="w-full h-2 rounded-full overflow-hidden"
                      style={{ background: colors.border }}
                      role="progressbar"
                      aria-valuenow={assignment.completionRate}
                      aria-valuemin={0}
                      aria-valuemax={100}
                    >
                      <div 
                        className="h-full rounded-full transition-all"
                        style={{ 
                          background: assignment.status === 'completed' ? colors.successColor : 
                                      assignment.status === 'overdue' ? colors.errorColor : 
                                      colors.iconColor,
                          width: `${assignment.completionRate}%`,
                        }}
                      />
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button
                      className="flex-1 h-9 rounded-lg text-sm font-semibold"
                      style={{ 
                        background: colors.iconBg,
                        color: colors.iconColor,
                      }}
                      aria-label={`View ${assignment.lessonName} details`}
                    >
                      <Eye className="w-4 h-4 mr-1" />
                      View Details
                    </Button>
                    <Button
                      className="flex-1 h-9 rounded-lg text-sm font-semibold"
                      style={{ 
                        background: colors.accentBg,
                        color: colors.accentColor,
                      }}
                      aria-label={`Edit ${assignment.lessonName}`}
                    >
                      <Edit className="w-4 h-4 mr-1" />
                      Edit
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Reports Tab */}
        {selectedTab === 'reports' && (
          <section 
            id="reports-panel" 
            role="tabpanel" 
            aria-labelledby="reports-heading"
            className="p-4"
          >
            <h2 id="reports-heading" className="text-lg font-semibold mb-4" style={{ color: colors.textPrimary }}>
              Reports & Analytics
            </h2>

            {/* Generate New Report */}
            <div 
              className="rounded-xl p-4 mb-6"
              style={{
                background: colors.iconBg,
                border: colors.glassBorder,
              }}
            >
              <h3 className="font-semibold mb-3" style={{ color: colors.textPrimary }}>
                Generate New Report
              </h3>
              <div className="grid grid-cols-2 gap-2">
                <Button
                  className="h-12 rounded-lg font-semibold flex flex-col items-center justify-center"
                  style={{ 
                    background: colors.cardBg,
                    color: colors.textPrimary,
                  }}
                  aria-label="Generate progress report"
                >
                  <TrendingUp className="w-5 h-5 mb-1" />
                  <span className="text-xs">Progress</span>
                </Button>
                <Button
                  className="h-12 rounded-lg font-semibold flex flex-col items-center justify-center"
                  style={{ 
                    background: colors.cardBg,
                    color: colors.textPrimary,
                  }}
                  aria-label="Generate attendance report"
                >
                  <Calendar className="w-5 h-5 mb-1" />
                  <span className="text-xs">Attendance</span>
                </Button>
                <Button
                  className="h-12 rounded-lg font-semibold flex flex-col items-center justify-center"
                  style={{ 
                    background: colors.cardBg,
                    color: colors.textPrimary,
                  }}
                  aria-label="Generate performance report"
                >
                  <Target className="w-5 h-5 mb-1" />
                  <span className="text-xs">Performance</span>
                </Button>
                <Button
                  className="h-12 rounded-lg font-semibold flex flex-col items-center justify-center"
                  style={{ 
                    background: colors.cardBg,
                    color: colors.textPrimary,
                  }}
                  aria-label="Generate custom report"
                >
                  <Settings className="w-5 h-5 mb-1" />
                  <span className="text-xs">Custom</span>
                </Button>
              </div>
            </div>

            {/* Recent Reports */}
            <h3 className="font-semibold mb-3" style={{ color: colors.textPrimary }}>
              Recent Reports
            </h3>
            <div className="space-y-3">
              {reports.map((report) => (
                <div
                  key={report.id}
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
                      className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                      style={{ background: colors.accentBg }}
                    >
                      <FileText className="w-5 h-5" style={{ color: colors.accentColor }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold mb-1" style={{ color: colors.textPrimary }}>
                        {report.title}
                      </h4>
                      <div className="flex items-center gap-2 text-xs flex-wrap" style={{ color: colors.textTertiary }}>
                        <span>{report.type}</span>
                        <span>•</span>
                        <span>{report.fileSize}</span>
                        <span>•</span>
                        <span>{report.generatedDate}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button
                      className="flex-1 h-9 rounded-lg text-sm font-semibold"
                      style={{ 
                        background: colors.iconBg,
                        color: colors.iconColor,
                      }}
                      aria-label={`Download ${report.title}`}
                    >
                      <Download className="w-4 h-4 mr-1" />
                      Download
                    </Button>
                    <Button
                      className="flex-1 h-9 rounded-lg text-sm font-semibold"
                      style={{ 
                        background: colors.successBg,
                        color: colors.successColor,
                      }}
                      aria-label={`Share ${report.title}`}
                    >
                      <Share2 className="w-4 h-4 mr-1" />
                      Share
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Messages Tab */}
        {selectedTab === 'messages' && (
          <section 
            id="messages-panel" 
            role="tabpanel" 
            aria-labelledby="messages-heading"
            className="p-4"
          >
            <div className="flex items-center justify-between mb-4">
              <h2 id="messages-heading" className="text-lg font-semibold" style={{ color: colors.textPrimary }}>
                Messages
              </h2>
              <Button
                onClick={() => setShowNewMessage(true)}
                className="h-10 rounded-xl font-semibold flex items-center gap-2"
                style={{ 
                  background: colors.iconColor,
                  color: theme === 'dark' ? '#0F0F23' : '#FFFFFF',
                }}
                aria-label="Compose new message"
              >
                <Plus className="w-4 h-4" />
                New
              </Button>
            </div>

            <div className="space-y-3">
              {messages.map((message) => (
                <button
                  key={message.id}
                  onClick={() => handleMarkMessageRead(message.id)}
                  className="w-full rounded-xl p-4 text-left"
                  style={{
                    background: message.isRead ? colors.cardBg : colors.iconBg,
                    backdropFilter: colors.blur,
                    WebkitBackdropFilter: colors.blur,
                    border: message.isRead ? colors.glassBorder : `2px solid ${colors.iconColor}`,
                    boxShadow: colors.shadow,
                  }}
                  aria-label={`Message from ${message.studentName}: ${message.subject}`}
                >
                  <div className="flex items-start gap-3">
                    <div 
                      className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
                      style={{ 
                        background: message.type === 'alert' ? colors.errorBg :
                                    message.type === 'question' ? colors.warningBg :
                                    colors.successBg,
                      }}
                    >
                      {message.type === 'alert' && (
                        <AlertCircle className="w-5 h-5" style={{ color: colors.errorColor }} />
                      )}
                      {message.type === 'question' && (
                        <MessageCircle className="w-5 h-5" style={{ color: colors.warningColor }} />
                      )}
                      {message.type === 'update' && (
                        <CheckCircle2 className="w-5 h-5" style={{ color: colors.successColor }} />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-semibold" style={{ color: colors.textPrimary }}>
                          {message.studentName}
                        </span>
                        {!message.isRead && (
                          <span 
                            className="w-2 h-2 rounded-full"
                            style={{ background: colors.iconColor }}
                            aria-label="Unread"
                          />
                        )}
                      </div>
                      <div className="font-semibold text-sm mb-1" style={{ color: colors.textPrimary }}>
                        {message.subject}
                      </div>
                      <div className="text-sm mb-2 line-clamp-2" style={{ color: colors.textTertiary }}>
                        {message.preview}
                      </div>
                      <div className="text-xs" style={{ color: colors.textTertiary }}>
                        {message.timestamp}
                      </div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </section>
        )}

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
              <strong style={{ color: colors.textPrimary }}>Teacher Tips:</strong> Monitor student progress regularly, assign lessons based on individual needs, and communicate frequently with students and parents for best results.
            </div>
          </div>
        </section>
      </div>

      {/* Assign Lesson Modal */}
      {showAssignLesson && (
        <div 
          className="fixed inset-0 bg-black/50 flex items-end sm:items-center justify-center z-50 p-4"
          onClick={() => setShowAssignLesson(false)}
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
            aria-labelledby="assign-lesson-title"
            aria-modal="true"
          >
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 id="assign-lesson-title" className="text-xl font-bold mb-1" style={{ color: colors.textPrimary }}>
                  Assign Lesson
                </h3>
                <p className="text-sm" style={{ color: colors.textSecondary }}>
                  Choose lesson and students
                </p>
              </div>
              <button
                onClick={() => setShowAssignLesson(false)}
                className="p-2 rounded-lg"
                style={{ color: colors.textSecondary }}
                aria-label="Close assign lesson"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold mb-2" style={{ color: colors.textPrimary }}>
                  Select Lesson
                </label>
                <select
                  className="w-full rounded-xl px-4 py-3 text-sm"
                  style={{
                    background: colors.cardHover,
                    border: colors.glassBorder,
                    color: colors.textPrimary,
                  }}
                  aria-label="Select lesson to assign"
                >
                  <option>Basic Greetings</option>
                  <option>Family Signs</option>
                  <option>Numbers 1-100</option>
                  <option>Colors and Shapes</option>
                  <option>Food and Drinks</option>
                  <option>Medical Emergency Signs</option>
                  <option>Emotions & Feelings</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2" style={{ color: colors.textPrimary }}>
                  Select Students
                </label>
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {students.slice(0, 5).map((student) => (
                    <button
                      key={student.id}
                      onClick={() => handleToggleStudent(student.id)}
                      className="w-full flex items-center gap-3 p-3 rounded-lg"
                      style={{
                        background: selectedStudents.has(student.id) ? colors.iconBg : colors.cardHover,
                        border: selectedStudents.has(student.id) ? `2px solid ${colors.iconColor}` : 'none',
                      }}
                      aria-pressed={selectedStudents.has(student.id)}
                      aria-label={`${selectedStudents.has(student.id) ? 'Deselect' : 'Select'} ${student.name}`}
                    >
                      <div 
                        className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 text-sm font-bold"
                        style={{ 
                          background: colors.iconBg,
                          color: colors.iconColor,
                        }}
                      >
                        {student.avatar}
                      </div>
                      <div className="flex-1 text-left">
                        <div className="font-semibold text-sm" style={{ color: colors.textPrimary }}>
                          {student.name}
                        </div>
                        <div className="text-xs" style={{ color: colors.textTertiary }}>
                          {student.grade}
                        </div>
                      </div>
                      {selectedStudents.has(student.id) && (
                        <CheckCircle2 className="w-5 h-5" style={{ color: colors.iconColor }} />
                      )}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2" style={{ color: colors.textPrimary }}>
                  Due Date
                </label>
                <input
                  type="date"
                  className="w-full rounded-xl px-4 py-3 text-sm"
                  style={{
                    background: colors.cardHover,
                    border: colors.glassBorder,
                    color: colors.textPrimary,
                  }}
                  aria-label="Set due date"
                />
              </div>
            </div>

            <Button
              onClick={() => setShowAssignLesson(false)}
              className="w-full h-12 rounded-xl font-semibold mt-6"
              style={{ 
                background: colors.iconColor,
                color: theme === 'dark' ? '#0F0F23' : '#FFFFFF',
              }}
              aria-label="Assign lesson to selected students"
            >
              <Send className="w-5 h-5 mr-2" />
              Assign to {selectedStudents.size} Student{selectedStudents.size !== 1 ? 's' : ''}
            </Button>
          </div>
        </div>
      )}

      {/* New Message Modal */}
      {showNewMessage && (
        <div 
          className="fixed inset-0 bg-black/50 flex items-end sm:items-center justify-center z-50 p-4"
          onClick={() => setShowNewMessage(false)}
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
            aria-labelledby="new-message-title"
            aria-modal="true"
          >
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 id="new-message-title" className="text-xl font-bold mb-1" style={{ color: colors.textPrimary }}>
                  New Message
                </h3>
                <p className="text-sm" style={{ color: colors.textSecondary }}>
                  Send message to students
                </p>
              </div>
              <button
                onClick={() => setShowNewMessage(false)}
                className="p-2 rounded-lg"
                style={{ color: colors.textSecondary }}
                aria-label="Close new message"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold mb-2" style={{ color: colors.textPrimary }}>
                  Recipients
                </label>
                <select
                  className="w-full rounded-xl px-4 py-3 text-sm"
                  style={{
                    background: colors.cardHover,
                    border: colors.glassBorder,
                    color: colors.textPrimary,
                  }}
                  aria-label="Select message recipients"
                >
                  <option>All Students</option>
                  <option>5th Grade Only</option>
                  <option>6th Grade Only</option>
                  <option>Individual Students...</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2" style={{ color: colors.textPrimary }}>
                  Subject
                </label>
                <input
                  type="text"
                  placeholder="Enter subject..."
                  className="w-full rounded-xl px-4 py-3 text-sm"
                  style={{
                    background: colors.cardHover,
                    border: colors.glassBorder,
                    color: colors.textPrimary,
                  }}
                  aria-label="Message subject"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2" style={{ color: colors.textPrimary }}>
                  Message
                </label>
                <textarea
                  placeholder="Type your message..."
                  rows={5}
                  className="w-full rounded-xl px-4 py-3 text-sm"
                  style={{
                    background: colors.cardHover,
                    border: colors.glassBorder,
                    color: colors.textPrimary,
                  }}
                  aria-label="Message content"
                />
              </div>
            </div>

            <Button
              onClick={() => setShowNewMessage(false)}
              className="w-full h-12 rounded-xl font-semibold mt-6"
              style={{ 
                background: colors.successColor,
                color: '#FFFFFF',
              }}
              aria-label="Send message"
            >
              <Send className="w-5 h-5 mr-2" />
              Send Message
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
