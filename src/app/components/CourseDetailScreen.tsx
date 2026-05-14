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
  Crown,
  BookOpen,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useTheme } from '../context/ThemeContext';
import { LessonDetailScreen } from './LessonDetailScreen';
import { COURSE_LESSONS } from '../data/courseData';
import type { Course, Lesson } from '../types';

interface CourseDetailScreenProps {
  course: Course;
  onExit: () => void;
  onUpgrade?: () => void;
}

export function CourseDetailScreen({ course, onExit, onUpgrade }: CourseDetailScreenProps) {
  const { theme } = useTheme();
  const { enrollInCourse, completeCourse, updateCourseProgress, userProgress, enrolledCourses } = useApp();

  const courseLessons: Lesson[] = COURSE_LESSONS[course.id] ?? [];

  const [isEnrolled, setIsEnrolled] = useState(
    enrolledCourses.some(c => c.id === course.id) ||
    userProgress.enrolledCourses.includes(course.id),
  );
  const [completedLessonIds, setCompletedLessonIds] = useState<string[]>([]);
  const [currentProgress, setCurrentProgress] = useState(course.progress || 0);
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);
  const [courseComplete, setCourseComplete] = useState(
    userProgress.completedCourses.includes(course.id),
  );

  const colors = {
    background:    theme === 'dark' ? '#0A0A1A' : '#F5F7FA',
    cardBg:        theme === 'dark' ? 'rgba(20,20,40,0.95)'  : 'rgba(255,255,255,0.95)',
    textPrimary:   theme === 'dark' ? '#FFFFFF' : '#111827',
    textSecondary: theme === 'dark' ? '#B8B8D0' : '#6B7280',
    border:        theme === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)',
    accent:        theme === 'dark' ? '#6366F1' : '#4F46E5',
    success:       '#10B981',
    gold:          '#F59E0B',
  };

  const getDifficultyColor = (d: string) =>
    d === 'beginner' ? '#10B981' : d === 'intermediate' ? '#F59E0B' : '#EF4444';

  // ── Handlers ────────────────────────────────────────────────────────────────

  const handleEnroll = () => {
    if (course.isPremium && !userProgress.isPremium) {
      onUpgrade?.();
      return;
    }
    enrollInCourse(course);
    setIsEnrolled(true);
  };

  const handleOpenLesson = (lesson: Lesson) => {
    if (!isEnrolled) {
      handleEnroll();
      return;
    }
    if (lesson.isPremium && !userProgress.isPremium) {
      onUpgrade?.();
      return;
    }
    setSelectedLesson(lesson);
  };

  const handleStartCourse = () => {
    const firstIncomplete = courseLessons.find(l => !completedLessonIds.includes(l.id));
    handleOpenLesson(firstIncomplete ?? courseLessons[0]);
  };

  const handleLessonComplete = (lessonId: string, score: number) => {
    setSelectedLesson(null);

    setCompletedLessonIds(prev => {
      const updated = prev.includes(lessonId) ? prev : [...prev, lessonId];
      const pct = Math.round((updated.length / courseLessons.length) * 100);
      setCurrentProgress(pct);
      updateCourseProgress(course.id, pct);

      if (updated.length >= courseLessons.length && !courseComplete) {
        completeCourse(course.id, score);
        setCourseComplete(true);
      }
      return updated;
    });
  };

  // ── Lesson detail view ───────────────────────────────────────────────────────

  if (selectedLesson) {
    return (
      <LessonDetailScreen
        lesson={selectedLesson}
        onBack={() => setSelectedLesson(null)}
        onComplete={handleLessonComplete}
      />
    );
  }

  // ── Main course detail ───────────────────────────────────────────────────────

  return (
    <div className="min-h-screen overflow-y-auto" style={{ background: colors.background, color: colors.textPrimary }}>

      {/* Header */}
      <div
        className="sticky top-0 z-50 flex items-center justify-between p-4"
        style={{ background: colors.cardBg, backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)', borderBottom: `1px solid ${colors.border}` }}
      >
        <button
          onClick={onExit}
          className="p-2 rounded-xl transition-colors"
          style={{ background: theme === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)' }}
          aria-label="Close course"
        >
          <X className="w-5 h-5" />
        </button>
        {course.isPremium && (
          <div className="px-3 py-1 rounded-full flex items-center gap-1 text-sm font-medium" style={{ background: colors.gold, color: '#000' }}>
            <Crown className="w-4 h-4" />
            Premium
          </div>
        )}
      </div>

      <div className="p-6 pb-32">

        {/* Hero */}
        <div
          className="rounded-3xl p-8 mb-6 relative overflow-hidden"
          style={{ background: `linear-gradient(135deg, ${getDifficultyColor(course.difficulty)}22, ${getDifficultyColor(course.difficulty)}11)`, border: `1px solid ${colors.border}` }}
        >
          <div className="absolute top-0 right-0 text-8xl opacity-10 select-none">{course.thumbnail}</div>
          <div className="relative z-10">
            <span className="inline-block px-3 py-1 rounded-full text-xs font-medium text-white mb-3" style={{ background: getDifficultyColor(course.difficulty) }}>
              {course.difficulty.toUpperCase()}
            </span>
            <h1 className="text-2xl font-bold mb-2">{course.title}</h1>
            <p className="text-sm mb-4" style={{ color: colors.textSecondary }}>{course.description}</p>
            <div className="flex flex-wrap items-center gap-4 text-sm" style={{ color: colors.textSecondary }}>
              <span className="flex items-center gap-1"><Clock className="w-4 h-4" />{course.duration}</span>
              <span className="flex items-center gap-1"><BarChart3 className="w-4 h-4" />{courseLessons.length || course.lessonCount} lessons</span>
              <span className="flex items-center gap-1"><Users className="w-4 h-4" />{course.enrolledCount.toLocaleString()}</span>
            </div>
          </div>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          {[
            { icon: <Star className="w-6 h-6 fill-yellow-500 text-yellow-500" />, value: course.rating, label: 'Rating' },
            { icon: <CheckCircle className="w-6 h-6" style={{ color: colors.success }} />, value: course.reviewCount, label: 'Reviews' },
            { icon: <Trophy className="w-6 h-6" style={{ color: colors.gold }} />, value: `${currentProgress}%`, label: 'Progress' },
          ].map(({ icon, value, label }) => (
            <div key={label} className="rounded-2xl p-4 text-center" style={{ background: colors.cardBg, border: `1px solid ${colors.border}` }}>
              <div className="mx-auto mb-2 flex justify-center">{icon}</div>
              <div className="text-xl font-bold">{value}</div>
              <div className="text-xs" style={{ color: colors.textSecondary }}>{label}</div>
            </div>
          ))}
        </div>

        {/* Progress bar */}
        {isEnrolled && currentProgress > 0 && (
          <div className="rounded-2xl p-5 mb-6" style={{ background: colors.cardBg, border: `1px solid ${colors.border}` }}>
            <div className="flex justify-between mb-2 text-sm">
              <span className="font-semibold">Your Progress</span>
              <span style={{ color: colors.accent }}>{currentProgress}%</span>
            </div>
            <div className="h-2 rounded-full overflow-hidden" style={{ background: theme === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)' }}>
              <motion.div className="h-full" style={{ background: colors.accent }} animate={{ width: `${currentProgress}%` }} transition={{ duration: 0.5 }} />
            </div>
          </div>
        )}

        {/* Instructor */}
        <div className="rounded-2xl p-5 mb-6" style={{ background: colors.cardBg, border: `1px solid ${colors.border}` }}>
          <h3 className="font-semibold mb-3">Instructor</h3>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold text-white" style={{ background: colors.accent }}>
              {course.instructor?.charAt(0) ?? 'I'}
            </div>
            <div>
              <div className="font-semibold">{course.instructor ?? 'Expert Instructor'}</div>
              <div className="text-sm" style={{ color: colors.textSecondary }}>ASL Specialist</div>
            </div>
          </div>
        </div>

        {/* What you'll learn */}
        {course.skills.length > 0 && (
          <div className="rounded-2xl p-5 mb-6" style={{ background: colors.cardBg, border: `1px solid ${colors.border}` }}>
            <h3 className="font-semibold mb-3">What You Will Learn</h3>
            <div className="flex flex-wrap gap-2">
              {course.skills.map((skill, i) => (
                <span key={i} className="px-3 py-1.5 rounded-full text-sm" style={{ background: theme === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)', color: colors.textPrimary }}>
                  {skill}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Lesson list */}
        {courseLessons.length > 0 && (
          <div className="rounded-2xl overflow-hidden mb-6" style={{ border: `1px solid ${colors.border}` }}>
            <div className="p-4 flex items-center gap-2" style={{ background: colors.cardBg, borderBottom: `1px solid ${colors.border}` }}>
              <BookOpen className="w-5 h-5" style={{ color: colors.accent }} />
              <h3 className="font-semibold">{courseLessons.length} Lessons</h3>
            </div>

            {courseLessons.map((lesson, index) => {
              const isDone    = completedLessonIds.includes(lesson.id);
              const isLocked  = lesson.isPremium && !userProgress.isPremium;
              const isCurrent = !isDone && !isLocked && courseLessons.findIndex(l => !completedLessonIds.includes(l.id)) === index;

              return (
                <motion.button
                  key={lesson.id}
                  onClick={() => handleOpenLesson(lesson)}
                  className="w-full flex items-center gap-4 p-4 text-left transition-colors"
                  style={{
                    background: isCurrent
                      ? theme === 'dark' ? `${colors.accent}22` : `${colors.accent}11`
                      : colors.cardBg,
                    borderBottom: index < courseLessons.length - 1 ? `1px solid ${colors.border}` : 'none',
                  }}
                  whileTap={{ scale: 0.98 }}
                >
                  {/* Step indicator */}
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
                    style={{
                      background: isDone ? colors.success : isCurrent ? colors.accent : theme === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.06)',
                      color: isDone || isCurrent ? '#fff' : colors.textSecondary,
                    }}
                  >
                    {isDone ? (
                      <CheckCircle className="w-5 h-5" />
                    ) : isLocked ? (
                      <Lock className="w-4 h-4" />
                    ) : (
                      <span className="text-sm font-bold">{index + 1}</span>
                    )}
                  </div>

                  {/* Lesson info */}
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-sm mb-0.5" style={{ color: isDone ? colors.success : colors.textPrimary }}>
                      {lesson.title}
                    </div>
                    <div className="text-xs" style={{ color: colors.textSecondary }}>
                      {lesson.signs.length} signs · {lesson.duration}
                    </div>
                    {lesson.description && (
                      <div className="text-xs mt-0.5 line-clamp-1" style={{ color: colors.textSecondary }}>
                        {lesson.description}
                      </div>
                    )}
                  </div>

                  <div className="flex-shrink-0">
                    {isLocked ? (
                      <Crown className="w-4 h-4" style={{ color: colors.gold }} />
                    ) : isDone ? (
                      <span className="text-xs font-semibold" style={{ color: colors.success }}>Done</span>
                    ) : (
                      <ChevronRight className="w-5 h-5" style={{ color: colors.textSecondary }} />
                    )}
                  </div>
                </motion.button>
              );
            })}
          </div>
        )}

      </div>

      {/* Sticky CTA */}
      <div
        className="fixed bottom-0 left-0 right-0 p-4"
        style={{ background: colors.cardBg, borderTop: `1px solid ${colors.border}`, backdropFilter: 'blur(20px)' }}
      >
        <AnimatePresence mode="wait">
          {courseComplete ? (
            <motion.div
              key="complete"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="w-full h-14 rounded-full flex items-center justify-center gap-2 font-semibold text-lg text-white"
              style={{ background: `linear-gradient(135deg, ${colors.success}, ${colors.accent})` }}
            >
              <Trophy className="w-5 h-5" />
              Course Completed!
            </motion.div>
          ) : !isEnrolled ? (
            <motion.div key="enroll" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
              <Button
                onClick={handleEnroll}
                className="w-full h-14 rounded-full font-semibold text-lg text-white"
                style={{ background: course.isPremium && !userProgress.isPremium ? colors.gold : colors.accent }}
              >
                {course.isPremium && !userProgress.isPremium ? (
                  <><Crown className="w-5 h-5 mr-2" />Upgrade to Enroll</>
                ) : (
                  <><Award className="w-5 h-5 mr-2" />Enroll Now — Free</>
                )}
              </Button>
            </motion.div>
          ) : (
            <motion.div key="start" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
              <Button
                onClick={handleStartCourse}
                className="w-full h-14 rounded-full font-semibold text-lg text-white"
                style={{ background: colors.accent }}
              >
                <Play className="w-5 h-5 mr-2" />
                {currentProgress > 0 ? 'Continue Course' : 'Start Course'}
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
