import { useState } from 'react';
import { Button } from './ui/button';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, 
  Play, 
  Lock, 
  CheckCircle, 
  Clock, 
  BarChart3, 
  Users, 
  Star,
  Award,
  ChevronRight,
  Trophy,
  Crown
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useTheme } from '../context/ThemeContext';
import type { Course } from '../types';

interface CourseDetailScreenProps {
  course: Course;
  onExit: () => void;
  onUpgrade?: () => void;
}

export function CourseDetailScreen({ course, onExit, onUpgrade }: CourseDetailScreenProps) {
  const { theme } = useTheme();
  const { 
    enrollInCourse, 
    completeCourse, 
    userProgress,
    enrolledCourses,
  } = useApp();
  
  const [isEnrolled, setIsEnrolled] = useState(
    enrolledCourses.some(c => c.id === course.id) || 
    userProgress.enrolledCourses.includes(course.id)
  );
  const [currentProgress, setCurrentProgress] = useState(course.progress || 0);
  const [showingLesson, setShowingLesson] = useState(false);

  const colors = {
    background: theme === 'dark' ? '#0A0A1A' : '#F5F7FA',
    cardBg: theme === 'dark' ? 'rgba(20, 20, 40, 0.95)' : 'rgba(255, 255, 255, 0.95)',
    textPrimary: theme === 'dark' ? '#FFFFFF' : 'var(--color-bg-elevated)',
    textSecondary: theme === 'dark' ? '#B8B8D0' : '#6B7280',
    border: theme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
    accent: theme === 'dark' ? '#6366F1' : '#4F46E5',
    success: '#10B981',
    gold: '#F59E0B',
  };

  const handleEnroll = () => {
    if (course.isPremium && !userProgress.isPremium) {
      if (onUpgrade) {
        onUpgrade();
      }
      return;
    }
    
    enrollInCourse(course);
    setIsEnrolled(true);
  };

  const handleStartCourse = () => {
    setShowingLesson(true);
    // Simulate course progress
    simulateCourseProgress();
  };

  const simulateCourseProgress = () => {
    let progress = currentProgress;
    const interval = setInterval(() => {
      progress += 10;
      setCurrentProgress(progress);
      
      if (progress >= 100) {
        clearInterval(interval);
        // Complete the course with a score
        const finalScore = Math.floor(Math.random() * 15) + 85; // 85-100
        completeCourse(course.id, finalScore);
        setShowingLesson(false);
      }
    }, 1000);
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return '#10B981';
      case 'intermediate': return '#F59E0B';
      case 'advanced': return '#EF4444';
      default: return colors.accent;
    }
  };

  return (
    <div 
      className="min-h-screen"
      style={{ 
        background: colors.background,
        color: colors.textPrimary,
      }}
    >
      {/* Header */}
      <div 
        className="sticky top-0 z-50"
        style={{
          background: colors.cardBg,
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          borderBottom: `1px solid ${colors.border}`,
        }}
      >
        <div className="flex items-center justify-between p-4">
          <button
            onClick={onExit}
            className="p-2 rounded-xl transition-colors"
            style={{
              background: theme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)',
            }}
            aria-label="Close course"
          >
            <X className="w-5 h-5" />
          </button>
          {course.isPremium && (
            <div 
              className="px-3 py-1 rounded-full flex items-center gap-1 text-sm font-medium"
              style={{ background: colors.gold, color: '#000' }}
            >
              <Crown className="w-4 h-4" />
              Premium
            </div>
          )}
        </div>
      </div>

      {/* Course Hero */}
      <div className="p-6">
        <div 
          className="rounded-3xl p-8 mb-6 relative overflow-hidden"
          style={{
            background: `linear-gradient(135deg, ${getDifficultyColor(course.difficulty)}22 0%, ${getDifficultyColor(course.difficulty)}11 100%)`,
            border: `1px solid ${colors.border}`,
          }}
        >
          <div className="absolute top-0 right-0 text-8xl opacity-10">
            {course.thumbnail}
          </div>
          <div className="relative z-10">
            <div 
              className="inline-block px-3 py-1 rounded-full text-xs font-medium mb-3"
              style={{ 
                background: getDifficultyColor(course.difficulty),
                color: '#FFF',
              }}
            >
              {course.difficulty.toUpperCase()}
            </div>
            <h1 className="text-2xl font-bold mb-2">{course.title}</h1>
            <p className="text-sm mb-4" style={{ color: colors.textSecondary }}>
              {course.description}
            </p>
            <div className="flex items-center gap-4 text-sm" style={{ color: colors.textSecondary }}>
              <div className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                {course.duration}
              </div>
              <div className="flex items-center gap-1">
                <BarChart3 className="w-4 h-4" />
                {course.lessonCount} lessons
              </div>
              <div className="flex items-center gap-1">
                <Users className="w-4 h-4" />
                {course.enrolledCount.toLocaleString()}
              </div>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          <div 
            className="rounded-2xl p-4 text-center"
            style={{
              background: colors.cardBg,
              border: `1px solid ${colors.border}`,
            }}
          >
            <Star className="w-6 h-6 mx-auto mb-2 fill-yellow-500 text-yellow-500" />
            <div className="text-xl font-bold">{course.rating}</div>
            <div className="text-xs" style={{ color: colors.textSecondary }}>Rating</div>
          </div>
          <div 
            className="rounded-2xl p-4 text-center"
            style={{
              background: colors.cardBg,
              border: `1px solid ${colors.border}`,
            }}
          >
            <CheckCircle className="w-6 h-6 mx-auto mb-2" style={{ color: colors.success }} />
            <div className="text-xl font-bold">{course.reviewCount}</div>
            <div className="text-xs" style={{ color: colors.textSecondary }}>Reviews</div>
          </div>
          <div 
            className="rounded-2xl p-4 text-center"
            style={{
              background: colors.cardBg,
              border: `1px solid ${colors.border}`,
            }}
          >
            <Trophy className="w-6 h-6 mx-auto mb-2" style={{ color: colors.gold }} />
            <div className="text-xl font-bold">{currentProgress}%</div>
            <div className="text-xs" style={{ color: colors.textSecondary }}>Progress</div>
          </div>
        </div>

        {/* Progress Bar (for enrolled students) */}
        {isEnrolled && currentProgress > 0 && (
          <div 
            className="rounded-2xl p-6 mb-6"
            style={{
              background: colors.cardBg,
              border: `1px solid ${colors.border}`,
            }}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="font-semibold">Your Progress</span>
              <span style={{ color: colors.accent }}>{currentProgress}%</span>
            </div>
            <div 
              className="h-2 rounded-full overflow-hidden"
              style={{ background: theme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)' }}
            >
              <motion.div 
                className="h-full"
                style={{ background: colors.accent }}
                initial={{ width: 0 }}
                animate={{ width: `${currentProgress}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>
          </div>
        )}

        {/* Instructor */}
        <div 
          className="rounded-2xl p-6 mb-6"
          style={{
            background: colors.cardBg,
            border: `1px solid ${colors.border}`,
          }}
        >
          <h3 className="font-semibold mb-3">Instructor</h3>
          <div className="flex items-center gap-3">
            <div 
              className="w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold"
              style={{ background: colors.accent, color: '#FFF' }}
            >
              {course.instructor?.charAt(0) || 'I'}
            </div>
            <div>
              <div className="font-semibold">{course.instructor || 'Expert Instructor'}</div>
              <div className="text-sm" style={{ color: colors.textSecondary }}>
                ASL Specialist
              </div>
            </div>
          </div>
        </div>

        {/* Skills */}
        <div 
          className="rounded-2xl p-6 mb-6"
          style={{
            background: colors.cardBg,
            border: `1px solid ${colors.border}`,
          }}
        >
          <h3 className="font-semibold mb-3">What You'll Learn</h3>
          <div className="flex flex-wrap gap-2">
            {course.skills.map((skill, index) => (
              <span
                key={index}
                className="px-3 py-2 rounded-full text-sm"
                style={{
                  background: theme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)',
                  color: colors.textPrimary,
                }}
              >
                {skill}
              </span>
            ))}
          </div>
        </div>

        {/* Action Button */}
        <div className="sticky bottom-0 pt-4 pb-6">
          {!isEnrolled ? (
            <Button
              onClick={handleEnroll}
              className="w-full h-14 rounded-full font-semibold text-lg"
              style={{
                background: course.isPremium && !userProgress.isPremium 
                  ? colors.gold 
                  : colors.accent,
                color: '#FFFFFF',
              }}
            >
              {course.isPremium && !userProgress.isPremium ? (
                <>
                  <Crown className="w-5 h-5 mr-2" />
                  Upgrade to Enroll
                </>
              ) : (
                <>
                  <Award className="w-5 h-5 mr-2" />
                  Enroll Now - Free
                </>
              )}
            </Button>
          ) : currentProgress < 100 ? (
            <Button
              onClick={handleStartCourse}
              disabled={showingLesson}
              className="w-full h-14 rounded-full font-semibold text-lg"
              style={{
                background: colors.accent,
                color: '#FFFFFF',
              }}
            >
              {showingLesson ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                  In Progress...
                </>
              ) : (
                <>
                  <Play className="w-5 h-5 mr-2" />
                  {currentProgress > 0 ? 'Continue Course' : 'Start Course'}
                </>
              )}
            </Button>
          ) : (
            <div 
              className="w-full h-14 rounded-full font-semibold text-lg flex items-center justify-center gap-2"
              style={{
                background: `linear-gradient(135deg, ${colors.success} 0%, ${colors.accent} 100%)`,
                color: '#FFFFFF',
              }}
            >
              <Trophy className="w-5 h-5" />
              Course Completed!
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
