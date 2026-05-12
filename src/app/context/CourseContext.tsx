import type { Course, Certificate } from '../types';
import { useAppState } from './AppStateContext';
import { applyAchievementChecks } from './AchievementsContext';

const generateCertificateNumber = (): string => {
  const year = new Date().getFullYear();
  const random = Math.floor(Math.random() * 999999).toString().padStart(6, '0');
  return `SLA-${year}-${random}`;
};

export function useCourses() {
  const { state, setState } = useAppState();

  return {
    enrolledCourses: state.enrolledCourses,
    certificates: state.certificates,

    getCertificatesForCourse: (courseId: string): Certificate[] =>
      state.certificates.filter(cert => cert.courseId === courseId),

    enrollInCourse: (course: Course) =>
      setState(prev => {
        if (prev.userProgress.enrolledCourses.includes(course.id)) return prev;
        return {
          ...prev,
          userProgress: {
            ...prev.userProgress,
            enrolledCourses: [...prev.userProgress.enrolledCourses, course.id],
          },
          enrolledCourses: [...prev.enrolledCourses, course],
          notifications: [{
            id: `notif-${Date.now()}`,
            title: 'Enrolled in Course! 📚',
            message: `You're now enrolled in "${course.title}"`,
            time: new Date().toISOString(),
            read: false,
            type: 'lesson' as const,
          }, ...prev.notifications],
        };
      }),

    updateCourseProgress: (courseId: string, progress: number) =>
      setState(prev => ({
        ...prev,
        enrolledCourses: prev.enrolledCourses.map(c =>
          c.id === courseId ? { ...c, progress } : c
        ),
      })),

    completeCourse: (courseId: string, finalScore: number) =>
      setState(prev => {
        const course = prev.enrolledCourses.find(c => c.id === courseId);
        if (!course || prev.userProgress.completedCourses.includes(courseId)) return prev;

        const certificate: Certificate = {
          id: `cert-${Date.now()}`,
          courseName: course.title,
          courseId: course.id,
          courseCategory: course.category,
          completionDate: new Date().toISOString().split('T')[0],
          score: finalScore,
          duration: course.duration,
          instructor: course.instructor,
          certificateNumber: generateCertificateNumber(),
          level: course.difficulty,
          skills: course.skills,
        };

        const pointsEarned = 100 + Math.floor(finalScore / 10) * 10;

        const next: typeof prev = {
          ...prev,
          userProgress: {
            ...prev.userProgress,
            completedCourses: [...prev.userProgress.completedCourses, courseId],
            totalPoints: prev.userProgress.totalPoints + pointsEarned,
          },
          enrolledCourses: prev.enrolledCourses.map(c =>
            c.id === courseId
              ? { ...c, isCompleted: true, progress: 100, completedDate: new Date().toISOString(), finalScore }
              : c
          ),
          certificates: [...prev.certificates, certificate],
          notifications: [{
            id: `notif-${Date.now()}`,
            title: 'Course Complete! 🎓',
            message: `Congratulations! You completed "${course.title}" with ${finalScore}% and earned a certificate!`,
            time: new Date().toISOString(),
            read: false,
            type: 'certificate' as const,
          }, ...prev.notifications],
        };
        return applyAchievementChecks(next) ?? next;
      }),

    addCertificate: (certificate: Certificate) =>
      setState(prev => ({ ...prev, certificates: [...prev.certificates, certificate] })),
  };
}
