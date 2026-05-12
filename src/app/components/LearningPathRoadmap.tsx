import { useState } from 'react';
import { Button } from './ui/button';
import { useTheme } from '../context/ThemeContext';
import { useApp } from '../context/AppContext';
import { motion, AnimatePresence } from 'motion/react';
import { X, CheckCircle, Lock, Circle, TrendingUp, Target, Clock, Award, Star, ChevronRight, ChevronDown, ChevronUp, Play, BarChart3 } from 'lucide-react';

interface LearningPathRoadmapProps {
  onExit: () => void;
}

interface Course {
  id: string;
  title: string;
  description: string;
  duration: string;
  signs: number;
  status: 'completed' | 'in-progress' | 'locked' | 'available';
  progress: number;
  requires?: string[];
  level: number;
  category: string;
}

interface LearningPath {
  id: string;
  title: string;
  description: string;
  totalCourses: number;
  completedCourses: number;
  estimatedTime: string;
  currentLevel: string;
  courses: Course[];
}

// Real learning paths data
const learningPaths: LearningPath[] = [
  {
    id: 'asl-beginner',
    title: 'ASL Beginner Path',
    description: 'Start your ASL journey with fundamental signs and concepts',
    totalCourses: 8,
    completedCourses: 5,
    estimatedTime: '3 months to completion',
    currentLevel: 'A1 - Beginner',
    courses: [
      {
        id: 'alphabet',
        title: 'ASL Alphabet',
        description: 'Learn the manual alphabet',
        duration: '30 min',
        signs: 26,
        status: 'completed',
        progress: 100,
        level: 1,
        category: 'Foundations',
      },
      {
        id: 'numbers',
        title: 'Numbers 1-100',
        description: 'Master counting in ASL',
        duration: '45 min',
        signs: 20,
        status: 'completed',
        progress: 100,
        requires: ['alphabet'],
        level: 1,
        category: 'Foundations',
      },
      {
        id: 'greetings',
        title: 'Greetings & Introductions',
        description: 'Common greetings and how to introduce yourself',
        duration: '1 hour',
        signs: 25,
        status: 'completed',
        progress: 100,
        requires: ['alphabet'],
        level: 1,
        category: 'Foundations',
      },
      {
        id: 'family',
        title: 'Family Signs',
        description: 'Signs for family members and relationships',
        duration: '40 min',
        signs: 30,
        status: 'completed',
        progress: 100,
        requires: ['greetings'],
        level: 2,
        category: 'Vocabulary',
      },
      {
        id: 'emotions',
        title: 'Emotions & Feelings',
        description: 'Express how you feel in ASL',
        duration: '50 min',
        signs: 35,
        status: 'completed',
        progress: 100,
        requires: ['greetings'],
        level: 2,
        category: 'Vocabulary',
      },
      {
        id: 'food',
        title: 'Food & Dining',
        description: 'Signs for food, drinks, and dining',
        duration: '1 hour',
        signs: 40,
        status: 'in-progress',
        progress: 65,
        requires: ['family', 'emotions'],
        level: 3,
        category: 'Vocabulary',
      },
      {
        id: 'colors',
        title: 'Colors & Descriptions',
        description: 'Learn color signs and basic descriptions',
        duration: '35 min',
        signs: 20,
        status: 'available',
        progress: 0,
        requires: ['family', 'emotions'],
        level: 3,
        category: 'Vocabulary',
      },
      {
        id: 'basic-conversation',
        title: 'Basic Conversations',
        description: 'Put it all together with simple conversations',
        duration: '1.5 hours',
        signs: 50,
        status: 'locked',
        progress: 0,
        requires: ['food', 'colors'],
        level: 4,
        category: 'Practice',
      },
    ],
  },
  {
    id: 'asl-intermediate',
    title: 'ASL Intermediate Path',
    description: 'Build on your foundation with complex grammar and vocabulary',
    totalCourses: 10,
    completedCourses: 2,
    estimatedTime: '6 months to completion',
    currentLevel: 'A2 - Elementary',
    courses: [
      {
        id: 'time-concepts',
        title: 'Time & Calendar',
        description: 'Days, months, years, and time expressions',
        duration: '1 hour',
        signs: 45,
        status: 'completed',
        progress: 100,
        level: 1,
        category: 'Grammar',
      },
      {
        id: 'locations',
        title: 'Places & Locations',
        description: 'Signs for places and spatial concepts',
        duration: '50 min',
        signs: 38,
        status: 'completed',
        progress: 100,
        requires: ['time-concepts'],
        level: 1,
        category: 'Vocabulary',
      },
      {
        id: 'questions',
        title: 'Question Forms',
        description: 'Who, what, where, when, why, and how',
        duration: '1.5 hours',
        signs: 30,
        status: 'in-progress',
        progress: 40,
        requires: ['locations'],
        level: 2,
        category: 'Grammar',
      },
      {
        id: 'activities',
        title: 'Activities & Hobbies',
        description: 'Talk about what you like to do',
        duration: '1 hour',
        signs: 50,
        status: 'available',
        progress: 0,
        requires: ['questions'],
        level: 2,
        category: 'Vocabulary',
      },
      {
        id: 'work-education',
        title: 'Work & Education',
        description: 'Professional and academic vocabulary',
        duration: '1.5 hours',
        signs: 55,
        status: 'locked',
        progress: 0,
        requires: ['activities'],
        level: 3,
        category: 'Vocabulary',
      },
      {
        id: 'directional-verbs',
        title: 'Directional Verbs',
        description: 'Master verb directionality in ASL',
        duration: '2 hours',
        signs: 40,
        status: 'locked',
        progress: 0,
        requires: ['questions'],
        level: 3,
        category: 'Grammar',
      },
      {
        id: 'classifiers',
        title: 'Classifiers Basics',
        description: 'Introduction to ASL classifiers',
        duration: '2 hours',
        signs: 35,
        status: 'locked',
        progress: 0,
        requires: ['directional-verbs'],
        level: 4,
        category: 'Grammar',
      },
      {
        id: 'healthcare',
        title: 'Health & Medical',
        description: 'Medical and health-related signs',
        duration: '1 hour',
        signs: 45,
        status: 'locked',
        progress: 0,
        requires: ['work-education'],
        level: 4,
        category: 'Vocabulary',
      },
      {
        id: 'storytelling',
        title: 'Storytelling Techniques',
        description: 'Learn to tell stories in ASL',
        duration: '2.5 hours',
        signs: 60,
        status: 'locked',
        progress: 0,
        requires: ['classifiers', 'healthcare'],
        level: 5,
        category: 'Practice',
      },
      {
        id: 'intermediate-conversation',
        title: 'Intermediate Conversations',
        description: 'Complex conversational skills',
        duration: '2 hours',
        signs: 70,
        status: 'locked',
        progress: 0,
        requires: ['storytelling'],
        level: 5,
        category: 'Practice',
      },
    ],
  },
  {
    id: 'asl-advanced',
    title: 'ASL Advanced Path',
    description: 'Achieve fluency with advanced grammar and cultural nuances',
    totalCourses: 8,
    completedCourses: 0,
    estimatedTime: '8 months to completion',
    currentLevel: 'B1 - Intermediate',
    courses: [
      {
        id: 'idioms',
        title: 'ASL Idioms & Expressions',
        description: 'Common ASL idioms and cultural expressions',
        duration: '2 hours',
        signs: 50,
        status: 'locked',
        progress: 0,
        level: 1,
        category: 'Culture',
      },
      {
        id: 'advanced-classifiers',
        title: 'Advanced Classifiers',
        description: 'Complex classifier usage and combinations',
        duration: '3 hours',
        signs: 45,
        status: 'locked',
        progress: 0,
        requires: ['idioms'],
        level: 2,
        category: 'Grammar',
      },
      {
        id: 'rhetorical-questions',
        title: 'Rhetorical Questions',
        description: 'Master rhetorical questions in ASL',
        duration: '1.5 hours',
        signs: 30,
        status: 'locked',
        progress: 0,
        requires: ['idioms'],
        level: 2,
        category: 'Grammar',
      },
      {
        id: 'deaf-culture',
        title: 'Deaf Culture & History',
        description: 'Deep dive into Deaf culture and community',
        duration: '2 hours',
        signs: 40,
        status: 'locked',
        progress: 0,
        requires: ['advanced-classifiers', 'rhetorical-questions'],
        level: 3,
        category: 'Culture',
      },
      {
        id: 'poetry-art',
        title: 'ASL Poetry & Art',
        description: 'Explore ASL as an art form',
        duration: '2.5 hours',
        signs: 35,
        status: 'locked',
        progress: 0,
        requires: ['deaf-culture'],
        level: 4,
        category: 'Culture',
      },
      {
        id: 'interpreting',
        title: 'Introduction to Interpreting',
        description: 'Basics of ASL interpretation',
        duration: '3 hours',
        signs: 55,
        status: 'locked',
        progress: 0,
        requires: ['deaf-culture'],
        level: 4,
        category: 'Professional',
      },
      {
        id: 'specialized-vocab',
        title: 'Specialized Vocabulary',
        description: 'Technical and specialized signs',
        duration: '2 hours',
        signs: 60,
        status: 'locked',
        progress: 0,
        requires: ['poetry-art', 'interpreting'],
        level: 5,
        category: 'Professional',
      },
      {
        id: 'fluency-practice',
        title: 'Fluency Practice',
        description: 'Advanced conversational fluency',
        duration: '4 hours',
        signs: 80,
        status: 'locked',
        progress: 0,
        requires: ['specialized-vocab'],
        level: 6,
        category: 'Practice',
      },
    ],
  },
];

export function LearningPathRoadmap({ onExit }: LearningPathRoadmapProps) {
  const { theme } = useTheme();
  const { userProgress } = useApp();
  const [selectedPath, setSelectedPath] = useState<string>('asl-beginner');
  const [expandedLevel, setExpandedLevel] = useState<number | null>(null);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);

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
        infoBg: 'rgba(59, 130, 246, 0.1)',
        infoColor: '#3B82F6',
        completed: '#22C55E',
        inProgress: 'var(--color-cyan)',
        available: 'var(--color-purple)',
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
        infoBg: 'rgba(59, 130, 246, 0.1)',
        infoColor: '#3B82F6',
        completed: '#22C55E',
        inProgress: '#0EA5E9',
        available: '#8B5CF6',
        locked: 'var(--color-text-muted)',
        blur: 'blur(20px)',
        shadow: '0 8px 32px rgba(31, 38, 135, 0.15)',
        glassBorder: '1px solid rgba(255, 255, 255, 0.6)',
      };

  const currentPath = learningPaths.find(p => p.id === selectedPath) || learningPaths[0];

  const getStatusColor = (status: Course['status']) => {
    switch (status) {
      case 'completed': return colors.completed;
      case 'in-progress': return colors.inProgress;
      case 'available': return colors.available;
      case 'locked': return colors.locked;
    }
  };

  const getStatusIcon = (status: Course['status']) => {
    switch (status) {
      case 'completed': return CheckCircle;
      case 'in-progress': return Circle;
      case 'available': return Circle;
      case 'locked': return Lock;
    }
  };

  // Group courses by level
  const coursesByLevel = currentPath.courses.reduce((acc, course) => {
    if (!acc[course.level]) {
      acc[course.level] = [];
    }
    acc[course.level].push(course);
    return acc;
  }, {} as { [key: number]: Course[] });

  const totalSigns = currentPath.courses.reduce((sum, c) => sum + c.signs, 0);
  const completedSigns = currentPath.courses
    .filter(c => c.status === 'completed')
    .reduce((sum, c) => sum + c.signs, 0);

  // Get next recommended course
  const nextCourse = currentPath.courses.find(c => c.status === 'available' || c.status === 'in-progress');

  const overallProgress = (currentPath.completedCourses / currentPath.totalCourses) * 100;

  return (
    <div 
      className="h-full flex flex-col"
      style={{ background: colors.bg, color: colors.textPrimary }}
      role="main"
      aria-labelledby="roadmap-title"
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
              id="roadmap-title" 
              className="text-xl sm:text-2xl font-bold"
              style={{ fontFamily: 'Poppins, sans-serif' }}
            >
              Learning Roadmap
            </h1>
            <p className="text-sm" style={{ color: colors.textSecondary }}>
              Your path to ASL fluency
            </p>
          </div>
        </div>

        {/* Path Selector */}
        <div className="space-y-2" role="radiogroup" aria-label="Select learning path">
          {learningPaths.map((path) => (
            <button
              key={path.id}
              onClick={() => setSelectedPath(path.id)}
              className="w-full rounded-xl p-4 text-left transition-all"
              style={{
                background: selectedPath === path.id ? colors.cardHover : colors.cardBg,
                backdropFilter: colors.blur,
                WebkitBackdropFilter: colors.blur,
                border: selectedPath === path.id 
                  ? `2px solid ${colors.iconColor}`
                  : colors.glassBorder,
                boxShadow: colors.shadow,
              }}
              role="radio"
              aria-checked={selectedPath === path.id}
              aria-label={`${path.title}: ${path.description}, ${path.completedCourses} of ${path.totalCourses} courses completed`}
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold mb-1" style={{ color: colors.textPrimary }}>
                    {path.title}
                  </h3>
                  <p className="text-sm mb-2" style={{ color: colors.textSecondary }}>
                    {path.description}
                  </p>
                  <div className="flex items-center gap-3 text-xs" style={{ color: colors.textTertiary }}>
                    <span>{path.currentLevel}</span>
                    <span>•</span>
                    <span>{path.completedCourses}/{path.totalCourses} courses</span>
                    <span>•</span>
                    <span>{path.estimatedTime}</span>
                  </div>
                </div>
                <div className="flex-shrink-0 ml-3">
                  <div 
                    className="w-12 h-12 rounded-full flex items-center justify-center font-bold"
                    style={{ 
                      background: `conic-gradient(${colors.iconColor} ${(path.completedCourses / path.totalCourses) * 100}%, ${colors.cardBg} 0)`,
                    }}
                    aria-label={`${Math.round((path.completedCourses / path.totalCourses) * 100)}% complete`}
                  >
                    <div 
                      className="w-10 h-10 rounded-full flex items-center justify-center"
                      style={{ background: colors.cardBg }}
                    >
                      <span className="text-xs" style={{ color: colors.textPrimary }}>
                        {Math.round((path.completedCourses / path.totalCourses) * 100)}%
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6">
        {/* Overall Progress Card */}
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
        >
          <div className="flex items-center gap-2 mb-4">
            <Target className="w-5 h-5" style={{ color: colors.iconColor }} aria-hidden="true" />
            <h2 className="font-semibold text-base" style={{ color: colors.textPrimary }}>
              Overall Progress
            </h2>
          </div>

          <div className="grid grid-cols-2 gap-3 mb-4">
            <div 
              className="rounded-lg p-3"
              style={{ background: colors.successBg }}
            >
              <div className="text-xs mb-1" style={{ color: colors.textTertiary }}>Completed</div>
              <div className="text-2xl font-bold" style={{ color: colors.textPrimary }}>
                {currentPath.completedCourses}
              </div>
              <div className="text-xs" style={{ color: colors.textSecondary }}>
                of {currentPath.totalCourses} courses
              </div>
            </div>

            <div 
              className="rounded-lg p-3"
              style={{ background: colors.infoBg }}
            >
              <div className="text-xs mb-1" style={{ color: colors.textTertiary }}>Signs Learned</div>
              <div className="text-2xl font-bold" style={{ color: colors.textPrimary }}>
                {completedSigns}
              </div>
              <div className="text-xs" style={{ color: colors.textSecondary }}>
                of {totalSigns} total
              </div>
            </div>

            <div 
              className="rounded-lg p-3"
              style={{ background: colors.warningBg }}
            >
              <div className="text-xs mb-1" style={{ color: colors.textTertiary }}>Current Level</div>
              <div className="text-lg font-bold" style={{ color: colors.textPrimary }}>
                {currentPath.currentLevel.split(' - ')[0]}
              </div>
              <div className="text-xs" style={{ color: colors.textSecondary }}>
                {currentPath.currentLevel.split(' - ')[1]}
              </div>
            </div>

            <div 
              className="rounded-lg p-3"
              style={{ background: colors.accentBg }}
            >
              <div className="text-xs mb-1" style={{ color: colors.textTertiary }}>Time to Complete</div>
              <div className="text-lg font-bold" style={{ color: colors.textPrimary }}>
                {currentPath.estimatedTime.split(' ')[0]}
              </div>
              <div className="text-xs" style={{ color: colors.textSecondary }}>
                {currentPath.estimatedTime.split(' ').slice(1).join(' ')}
              </div>
            </div>
          </div>

          <div className="mb-2">
            <div className="flex items-center justify-between mb-1 text-sm">
              <span style={{ color: colors.textSecondary }}>Path Progress</span>
              <span className="font-semibold" style={{ color: colors.textPrimary }}>
                {Math.round(overallProgress)}%
              </span>
            </div>
            <div 
              className="h-3 rounded-full overflow-hidden"
              style={{ background: colors.cardHover }}
              role="progressbar"
              aria-valuenow={overallProgress}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-label="Overall path progress"
            >
              <motion.div
                className="h-full"
                style={{ background: colors.iconColor }}
                initial={{ width: 0 }}
                animate={{ width: `${overallProgress}%` }}
                transition={{ duration: 1, delay: 0.3 }}
              />
            </div>
          </div>
        </motion.div>

        {/* Next Recommended */}
        {nextCourse && (
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
            <div className="flex items-center gap-2 mb-3">
              <TrendingUp className="w-5 h-5" style={{ color: colors.iconColor }} aria-hidden="true" />
              <h2 className="font-semibold text-base" style={{ color: colors.textPrimary }}>
                Recommended Next Step
              </h2>
            </div>

            <div 
              className="rounded-lg p-4"
              style={{ background: colors.iconBg }}
            >
              <div className="flex items-start gap-3">
                <div 
                  className="w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0"
                  style={{ background: getStatusColor(nextCourse.status) }}
                  aria-hidden="true"
                >
                  {(() => {
                    const Icon = getStatusIcon(nextCourse.status);
                    return <Icon className="w-6 h-6 text-white" />;
                  })()}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold mb-1" style={{ color: colors.textPrimary }}>
                    {nextCourse.title}
                  </h3>
                  <p className="text-sm mb-2" style={{ color: colors.textSecondary }}>
                    {nextCourse.description}
                  </p>
                  <div className="flex items-center gap-3 text-xs mb-3" style={{ color: colors.textTertiary }}>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" aria-hidden="true" />
                      {nextCourse.duration}
                    </span>
                    <span className="flex items-center gap-1">
                      <Star className="w-3 h-3" aria-hidden="true" />
                      {nextCourse.signs} signs
                    </span>
                  </div>
                  {nextCourse.status === 'in-progress' && (
                    <div className="mb-3">
                      <div 
                        className="h-2 rounded-full overflow-hidden"
                        style={{ background: colors.cardHover }}
                        role="progressbar"
                        aria-valuenow={nextCourse.progress}
                        aria-valuemin={0}
                        aria-valuemax={100}
                      >
                        <div
                          className="h-full"
                          style={{ 
                            background: getStatusColor(nextCourse.status),
                            width: `${nextCourse.progress}%`,
                          }}
                        />
                      </div>
                    </div>
                  )}
                  <Button
                    onClick={() => setSelectedCourse(nextCourse)}
                    className="w-full h-10 rounded-full font-semibold flex items-center justify-center gap-2"
                    style={{
                      background: colors.iconColor,
                      color: theme === 'dark' ? 'var(--color-bg-deep)' : '#FFFFFF',
                    }}
                    aria-label={`${nextCourse.status === 'in-progress' ? 'Continue' : 'Start'} ${nextCourse.title}`}
                  >
                    <Play className="w-4 h-4" aria-hidden="true" />
                    {nextCourse.status === 'in-progress' ? 'Continue' : 'Start Course'}
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Skill Tree */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-4">
            <BarChart3 className="w-5 h-5" style={{ color: colors.iconColor }} aria-hidden="true" />
            <h2 className="font-semibold text-base" style={{ color: colors.textPrimary }}>
              Skill Tree
            </h2>
          </div>

          <div className="space-y-4">
            {Object.entries(coursesByLevel).map(([level, courses], levelIndex) => (
              <motion.div
                key={level}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + levelIndex * 0.1 }}
              >
                <button
                  onClick={() => setExpandedLevel(expandedLevel === parseInt(level) ? null : parseInt(level))}
                  className="w-full rounded-xl p-4 text-left transition-colors mb-3"
                  style={{
                    background: colors.cardBg,
                    backdropFilter: colors.blur,
                    WebkitBackdropFilter: colors.blur,
                    border: colors.glassBorder,
                    boxShadow: colors.shadow,
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.background = colors.cardHover}
                  onMouseLeave={(e) => e.currentTarget.style.background = colors.cardBg}
                  aria-expanded={expandedLevel === parseInt(level)}
                  aria-controls={`level-${level}-content`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div 
                        className="w-10 h-10 rounded-lg flex items-center justify-center font-bold"
                        style={{ background: colors.iconBg, color: colors.iconColor }}
                        aria-hidden="true"
                      >
                        {level}
                      </div>
                      <div>
                        <div className="font-semibold" style={{ color: colors.textPrimary }}>
                          Level {level}
                        </div>
                        <div className="text-sm" style={{ color: colors.textSecondary }}>
                          {courses.length} course{courses.length !== 1 ? 's' : ''} • {courses[0].category}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="text-sm font-semibold" style={{ color: colors.textPrimary }}>
                        {courses.filter(c => c.status === 'completed').length}/{courses.length}
                      </div>
                      {expandedLevel === parseInt(level) ? (
                        <ChevronUp className="w-5 h-5" style={{ color: colors.textTertiary }} aria-hidden="true" />
                      ) : (
                        <ChevronDown className="w-5 h-5" style={{ color: colors.textTertiary }} aria-hidden="true" />
                      )}
                    </div>
                  </div>
                </button>

                <AnimatePresence>
                  {expandedLevel === parseInt(level) && (
                    <motion.div
                      id={`level-${level}-content`}
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="space-y-3 mb-3"
                    >
                      {courses.map((course, courseIndex) => {
                        const StatusIcon = getStatusIcon(course.status);
                        const statusColor = getStatusColor(course.status);

                        return (
                          <motion.div
                            key={course.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: courseIndex * 0.05 }}
                            className="ml-8 relative"
                          >
                            {/* Connection line to previous level */}
                            {course.requires && course.requires.length > 0 && (
                              <div 
                                className="absolute left-0 top-0 w-px h-full -ml-4"
                                style={{ background: colors.border }}
                                aria-hidden="true"
                              />
                            )}

                            <button
                              onClick={() => setSelectedCourse(course)}
                              disabled={course.status === 'locked'}
                              className="w-full rounded-xl p-4 text-left transition-all"
                              style={{
                                background: colors.cardBg,
                                backdropFilter: colors.blur,
                                WebkitBackdropFilter: colors.blur,
                                border: `2px solid ${statusColor}`,
                                boxShadow: colors.shadow,
                                opacity: course.status === 'locked' ? 0.6 : 1,
                              }}
                              onMouseEnter={(e) => {
                                if (course.status !== 'locked') {
                                  e.currentTarget.style.background = colors.cardHover;
                                }
                              }}
                              onMouseLeave={(e) => e.currentTarget.style.background = colors.cardBg}
                              aria-label={`${course.title}: ${course.description}. Status: ${course.status}. ${course.progress}% complete`}
                            >
                              <div className="flex items-start gap-3">
                                <div 
                                  className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                                  style={{ background: statusColor }}
                                  aria-hidden="true"
                                >
                                  <StatusIcon className="w-5 h-5 text-white" />
                                </div>
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center gap-2 mb-1">
                                    <h4 className="font-semibold" style={{ color: colors.textPrimary }}>
                                      {course.title}
                                    </h4>
                                    <span 
                                      className="px-2 py-0.5 rounded-full text-xs font-semibold capitalize"
                                      style={{ 
                                        background: `${statusColor}20`,
                                        color: statusColor,
                                      }}
                                    >
                                      {course.status.replace('-', ' ')}
                                    </span>
                                  </div>
                                  <p className="text-sm mb-2" style={{ color: colors.textSecondary }}>
                                    {course.description}
                                  </p>
                                  <div className="flex items-center gap-3 text-xs mb-2" style={{ color: colors.textTertiary }}>
                                    <span className="flex items-center gap-1">
                                      <Clock className="w-3 h-3" aria-hidden="true" />
                                      {course.duration}
                                    </span>
                                    <span className="flex items-center gap-1">
                                      <Star className="w-3 h-3" aria-hidden="true" />
                                      {course.signs} signs
                                    </span>
                                  </div>

                                  {/* Prerequisites */}
                                  {course.requires && course.requires.length > 0 && (
                                    <div className="text-xs mb-2" style={{ color: colors.textTertiary }}>
                                      Requires: {course.requires.map(reqId => {
                                        const reqCourse = currentPath.courses.find(c => c.id === reqId);
                                        return reqCourse?.title;
                                      }).join(', ')}
                                    </div>
                                  )}

                                  {/* Progress bar for in-progress and completed courses */}
                                  {(course.status === 'in-progress' || course.status === 'completed') && (
                                    <div className="mb-2">
                                      <div 
                                        className="h-2 rounded-full overflow-hidden"
                                        style={{ background: colors.cardHover }}
                                        role="progressbar"
                                        aria-valuenow={course.progress}
                                        aria-valuemin={0}
                                        aria-valuemax={100}
                                      >
                                        <div
                                          className="h-full"
                                          style={{ 
                                            background: statusColor,
                                            width: `${course.progress}%`,
                                          }}
                                        />
                                      </div>
                                    </div>
                                  )}
                                </div>
                                <ChevronRight 
                                  className="w-5 h-5 flex-shrink-0" 
                                  style={{ color: colors.textTertiary }} 
                                  aria-hidden="true"
                                />
                              </div>
                            </button>
                          </motion.div>
                        );
                      })}
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Fluency Estimate */}
        <motion.div
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
          transition={{ delay: 0.3 }}
        >
          <div className="flex items-center gap-2 mb-3">
            <Award className="w-5 h-5" style={{ color: colors.iconColor }} aria-hidden="true" />
            <h2 className="font-semibold text-base" style={{ color: colors.textPrimary }}>
              Path to Fluency
            </h2>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span style={{ color: colors.textSecondary }}>Current Path</span>
              <span className="font-semibold" style={{ color: colors.textPrimary }}>
                {currentPath.title}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span style={{ color: colors.textSecondary }}>Estimated Completion</span>
              <span className="font-semibold" style={{ color: colors.textPrimary }}>
                {currentPath.estimatedTime}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span style={{ color: colors.textSecondary }}>Total Signs to Learn</span>
              <span className="font-semibold" style={{ color: colors.textPrimary }}>
                {totalSigns - completedSigns} remaining
              </span>
            </div>
            <div 
              className="rounded-lg p-3 mt-3"
              style={{ background: colors.infoBg }}
            >
              <div className="text-sm" style={{ color: colors.textPrimary }}>
                💡 <strong>Tip:</strong> Practicing 15-20 minutes daily will help you complete this path on schedule and achieve conversational fluency!
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Course Detail Modal */}
      <AnimatePresence>
        {selectedCourse && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{ background: 'rgba(0, 0, 0, 0.8)' }}
            onClick={() => setSelectedCourse(null)}
            role="dialog"
            aria-labelledby="course-modal-title"
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
                  background: getStatusColor(selectedCourse.status),
                }}
              >
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setSelectedCourse(null)}
                  className="absolute top-4 right-4"
                  style={{ color: '#FFFFFF' }}
                  aria-label="Close course details"
                >
                  <X className="w-6 h-6" />
                </Button>

                <div className="text-center">
                  <div 
                    className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4"
                    style={{ background: 'rgba(255, 255, 255, 0.2)' }}
                    aria-hidden="true"
                  >
                    {(() => {
                      const Icon = getStatusIcon(selectedCourse.status);
                      return <Icon className="w-8 h-8 text-white" />;
                    })()}
                  </div>
                  <span 
                    className="px-3 py-1 rounded-full text-xs font-semibold capitalize inline-block mb-2"
                    style={{ background: 'rgba(255, 255, 255, 0.2)', color: '#FFFFFF' }}
                  >
                    {selectedCourse.status.replace('-', ' ')}
                  </span>
                  <h2 id="course-modal-title" className="text-2xl font-bold mb-2 text-white">
                    {selectedCourse.title}
                  </h2>
                  <p className="text-sm opacity-90 text-white">
                    {selectedCourse.description}
                  </p>
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                <div className="grid grid-cols-2 gap-3 mb-4">
                  <div 
                    className="rounded-lg p-3"
                    style={{ background: colors.iconBg }}
                  >
                    <Clock className="w-5 h-5 mb-2" style={{ color: colors.iconColor }} aria-hidden="true" />
                    <div className="text-sm font-semibold" style={{ color: colors.textPrimary }}>
                      {selectedCourse.duration}
                    </div>
                    <div className="text-xs" style={{ color: colors.textSecondary }}>
                      Duration
                    </div>
                  </div>

                  <div 
                    className="rounded-lg p-3"
                    style={{ background: colors.successBg }}
                  >
                    <Star className="w-5 h-5 mb-2" style={{ color: colors.successColor }} aria-hidden="true" />
                    <div className="text-sm font-semibold" style={{ color: colors.textPrimary }}>
                      {selectedCourse.signs} signs
                    </div>
                    <div className="text-xs" style={{ color: colors.textSecondary }}>
                      To Learn
                    </div>
                  </div>

                  <div 
                    className="rounded-lg p-3"
                    style={{ background: colors.accentBg }}
                  >
                    <Award className="w-5 h-5 mb-2" style={{ color: colors.accentColor }} aria-hidden="true" />
                    <div className="text-sm font-semibold" style={{ color: colors.textPrimary }}>
                      Level {selectedCourse.level}
                    </div>
                    <div className="text-xs" style={{ color: colors.textSecondary }}>
                      Difficulty
                    </div>
                  </div>

                  <div 
                    className="rounded-lg p-3"
                    style={{ background: colors.warningBg }}
                  >
                    <BarChart3 className="w-5 h-5 mb-2" style={{ color: colors.warningColor }} aria-hidden="true" />
                    <div className="text-sm font-semibold" style={{ color: colors.textPrimary }}>
                      {selectedCourse.category}
                    </div>
                    <div className="text-xs" style={{ color: colors.textSecondary }}>
                      Category
                    </div>
                  </div>
                </div>

                {selectedCourse.requires && selectedCourse.requires.length > 0 && (
                  <div 
                    className="rounded-lg p-3 mb-4"
                    style={{ background: colors.infoBg }}
                  >
                    <div className="text-sm font-semibold mb-2" style={{ color: colors.textPrimary }}>
                      Prerequisites
                    </div>
                    <ul className="space-y-1 text-sm" style={{ color: colors.textSecondary }}>
                      {selectedCourse.requires.map(reqId => {
                        const reqCourse = currentPath.courses.find(c => c.id === reqId);
                        return (
                          <li key={reqId} className="flex items-center gap-2">
                            <CheckCircle className="w-4 h-4" style={{ color: colors.successColor }} aria-hidden="true" />
                            {reqCourse?.title}
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                )}

                {selectedCourse.status !== 'locked' && (
                  <>
                    {(selectedCourse.status === 'in-progress' || selectedCourse.status === 'completed') && (
                      <div className="mb-4">
                        <div className="flex items-center justify-between mb-2 text-sm">
                          <span style={{ color: colors.textSecondary }}>Progress</span>
                          <span className="font-semibold" style={{ color: colors.textPrimary }}>
                            {selectedCourse.progress}%
                          </span>
                        </div>
                        <div 
                          className="h-3 rounded-full overflow-hidden"
                          style={{ background: colors.cardHover }}
                          role="progressbar"
                          aria-valuenow={selectedCourse.progress}
                          aria-valuemin={0}
                          aria-valuemax={100}
                        >
                          <div
                            className="h-full"
                            style={{ 
                              background: getStatusColor(selectedCourse.status),
                              width: `${selectedCourse.progress}%`,
                            }}
                          />
                        </div>
                      </div>
                    )}

                    <Button
                      className="w-full h-12 rounded-full font-semibold"
                      style={{
                        background: colors.iconColor,
                        color: theme === 'dark' ? 'var(--color-bg-deep)' : '#FFFFFF',
                      }}
                      aria-label={`${selectedCourse.status === 'completed' ? 'Review' : selectedCourse.status === 'in-progress' ? 'Continue' : 'Start'} ${selectedCourse.title}`}
                    >
                      {selectedCourse.status === 'completed' ? 'Review Course' : selectedCourse.status === 'in-progress' ? 'Continue Learning' : 'Start Course'}
                    </Button>
                  </>
                )}

                {selectedCourse.status === 'locked' && (
                  <div 
                    className="rounded-lg p-4 text-center"
                    style={{ background: colors.errorBg }}
                  >
                    <Lock className="w-8 h-8 mx-auto mb-2" style={{ color: colors.errorColor }} aria-hidden="true" />
                    <div className="text-sm font-semibold mb-1" style={{ color: colors.textPrimary }}>
                      Course Locked
                    </div>
                    <div className="text-xs" style={{ color: colors.textSecondary }}>
                      Complete the prerequisites to unlock this course
                    </div>
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
