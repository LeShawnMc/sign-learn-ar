import type { OnboardingStep, Language, LearningGoal, Lesson } from '../types';
import { useAppState } from './AppStateContext';

export function useOnboarding() {
  const { state, setState } = useAppState();

  return {
    onboardingComplete: state.onboardingComplete,
    currentStep: state.currentStep,
    selectedLanguage: state.selectedLanguage,
    learningGoals: state.learningGoals,
    hasARCapability: state.hasARCapability,
    permissionsGranted: state.permissionsGranted,
    currentLesson: state.currentLesson,

    setCurrentStep: (step: OnboardingStep) =>
      setState(prev => ({ ...prev, currentStep: step })),

    setSelectedLanguage: (language: Language) =>
      setState(prev => ({ ...prev, selectedLanguage: language })),

    setLearningGoals: (goals: LearningGoal[]) =>
      setState(prev => ({ ...prev, learningGoals: goals })),

    completeOnboarding: () =>
      setState(prev => ({ ...prev, onboardingComplete: true, currentStep: 'complete' })),

    setHasARCapability: (hasAR: boolean) =>
      setState(prev => ({ ...prev, hasARCapability: hasAR })),

    grantPermission: (type: 'camera' | 'microphone') =>
      setState(prev => ({
        ...prev,
        permissionsGranted: { ...prev.permissionsGranted, [type]: true },
      })),

    setCurrentLesson: (lesson: Lesson | null) =>
      setState(prev => ({ ...prev, currentLesson: lesson })),
  };
}
