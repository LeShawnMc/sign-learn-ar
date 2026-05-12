// Type definitions for Sign Learn AR App

export type OnboardingStep = 
  | 'welcome'
  | 'ar-check'
  | 'permissions'
  | 'calibration'
  | 'room-scan'
  | 'language-select'
  | 'goals-setup'
  | 'first-lesson'
  | 'complete';

export type Language = 'ASL' | 'BSL' | 'ISL' | 'LSF';

export type LearningGoal = 'basics' | 'conversation' | 'professional' | 'daily-life';

export type DifficultyLevel = 'beginner' | 'intermediate' | 'advanced';

export interface Sign {
  id: string;
  word: string;
  description: string;
  videoUrl?: string;
  category: string;
  difficulty: DifficultyLevel;
  completed?: boolean;
  lastPracticed?: string;
  masteryLevel?: number; // 0-100
}

export interface Lesson {
  id: string;
  title: string;
  description: string;
  signs: Sign[];
  progress: number;
  duration: string;
  difficulty: DifficultyLevel;
  isPremium?: boolean;
  completed?: boolean;
  completedDate?: string;
}

export interface Course {
  id: string;
  title: string;
  description: string;
  category: string;
  difficulty: DifficultyLevel;
  duration: string;
  lessonCount: number;
  enrolledCount: number;
  rating: number;
  reviewCount: number;
  isPremium: boolean;
  isCompleted: boolean;
  progress: number;
  thumbnail: string;
  instructor: string;
  skills: string[];
  lessons?: Lesson[];
  completedDate?: string;
  finalScore?: number;
}

export interface Certificate {
  id: string;
  courseName: string;
  courseId: string;
  courseCategory: string;
  completionDate: string;
  score: number;
  duration: string;
  instructor: string;
  certificateNumber: string;
  level: DifficultyLevel;
  skills: string[];
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  category: 'learning' | 'streak' | 'social' | 'mastery' | 'special';
  unlocked: boolean;
  unlockedDate?: string;
  progress: number;
  maxProgress: number;
  points: number;
}

export interface UserProgress {
  currentStreak: number;
  totalSigns: number;
  completedLessons: number;
  dailyGoal: number;
  todayProgress: number;
  isPremium?: boolean;
  totalPoints: number;
  level: number;
  completedCourses: string[]; // Course IDs
  enrolledCourses: string[]; // Course IDs
  masteredSigns: string[]; // Sign IDs
  practicedToday: string[]; // Sign IDs practiced today
  lastActiveDate: string;
  totalStudyTime: number; // in minutes
  longestStreak: number;
  weeklyGoal: number;
  monthlyGoal: number;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  time: string;
  read: boolean;
  type: 'lesson' | 'achievement' | 'reminder' | 'social' | 'certificate';
  actionUrl?: string;
}

export interface AppState {
  onboardingComplete: boolean;
  currentStep: OnboardingStep;
  selectedLanguage: Language;
  learningGoals: LearningGoal[];
  userProgress: UserProgress;
  currentLesson: Lesson | null;
  hasARCapability: boolean;
  permissionsGranted: {
    camera: boolean;
    microphone: boolean;
  };
  certificates: Certificate[];
  achievements: Achievement[];
  enrolledCourses: Course[];
  notifications: Notification[];
}
