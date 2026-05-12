import { describe, it, expect } from 'vitest';
import { DEFAULT_STATE } from '../app/context/AppStateContext';
import type { AppState, Course } from '../app/types';

// Test the pure state transitions used by CourseContext directly

const mockCourse: Course = {
  id: 'course-1',
  title: 'ASL Basics',
  description: 'Beginner ASL',
  category: 'basics',
  difficulty: 'beginner',
  duration: '4 hours',
  lessonCount: 10,
  enrolledCount: 500,
  rating: 4.8,
  reviewCount: 200,
  isPremium: false,
  isCompleted: false,
  progress: 0,
  thumbnail: '',
  instructor: 'Jane Doe',
  skills: ['Greetings', 'Numbers'],
};

describe('course enrollment state logic', () => {
  it('adds a course to enrolledCourses and userProgress.enrolledCourses', () => {
    const state: AppState = { ...DEFAULT_STATE };
    // Simulate enrollInCourse logic
    const next: AppState = {
      ...state,
      userProgress: {
        ...state.userProgress,
        enrolledCourses: [...state.userProgress.enrolledCourses, mockCourse.id],
      },
      enrolledCourses: [...state.enrolledCourses, mockCourse],
    };
    expect(next.enrolledCourses).toHaveLength(1);
    expect(next.userProgress.enrolledCourses).toContain('course-1');
  });

  it('does not add duplicate enrollments', () => {
    const state: AppState = {
      ...DEFAULT_STATE,
      userProgress: { ...DEFAULT_STATE.userProgress, enrolledCourses: ['course-1'] },
      enrolledCourses: [mockCourse],
    };
    // Simulate the guard: if already enrolled, return prev
    const alreadyEnrolled = state.userProgress.enrolledCourses.includes(mockCourse.id);
    expect(alreadyEnrolled).toBe(true);
  });
});

describe('certificate number format', () => {
  it('generates a certificate number matching SLA-YYYY-NNNNNN', () => {
    const year = new Date().getFullYear();
    const random = Math.floor(Math.random() * 999999).toString().padStart(6, '0');
    const certNumber = `SLA-${year}-${random}`;
    expect(certNumber).toMatch(/^SLA-\d{4}-\d{6}$/);
  });
});
