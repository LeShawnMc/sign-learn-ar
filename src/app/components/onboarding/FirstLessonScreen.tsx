import { useState } from 'react';
import { Button } from '../ui/button';
import { useApp } from '../../context/AppContext';
import { motion, AnimatePresence } from 'motion/react';
import { Hand, CheckCircle2, ArrowRight } from 'lucide-react';

const helloSteps = [
  {
    step: 1,
    title: 'Starting Position',
    instruction: 'Extend your dominant hand with fingers together',
    description: 'Keep your palm facing forward, fingers straight and close together.',
  },
  {
    step: 2,
    title: 'Hand Placement',
    instruction: 'Bring your hand to your forehead',
    description: 'Touch your fingertips to your forehead area, just above your eyebrow.',
  },
  {
    step: 3,
    title: 'The Wave Motion',
    instruction: 'Move your hand forward and slightly down',
    description: 'In a gentle wave motion, move your hand away from your forehead toward the person you\'re greeting.',
  },
];

export function FirstLessonScreen() {
  const { completeOnboarding } = useApp();
  const [currentStep, setCurrentStep] = useState(0);
  const [practicing, setPracticing] = useState(false);
  const [completed, setCompleted] = useState(false);

  const handleNextStep = () => {
    if (currentStep < helloSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      setPracticing(true);
      // Simulate practice completion
      setTimeout(() => {
        setCompleted(true);
      }, 3000);
    }
  };

  const handleFinish = () => {
    completeOnboarding();
  };

  const currentInstruction = helloSteps[currentStep];

  return (
    <div 
      className="min-h-screen bg-black text-white flex flex-col p-6"
      role="main"
      aria-labelledby="first-lesson-title"
    >
      {/* Header */}
      <div className="mb-6">
        <h1 id="first-lesson-title" className="text-2xl font-bold mb-2">
          Your First Sign: "Hello"
        </h1>
        <p className="text-gray-400">
          {!practicing && !completed
            ? 'Learn one of the most important signs in any language'
            : practicing && !completed
            ? 'Great! Now try it yourself'
            : 'Perfect! You\'ve learned your first sign!'}
        </p>
      </div>

      {/* Progress Steps */}
      {!practicing && !completed && (
        <div className="mb-6 flex items-center justify-center gap-2" role="progressbar" aria-valuenow={currentStep + 1} aria-valuemin={1} aria-valuemax={helloSteps.length} aria-label={`Lesson progress: step ${currentStep + 1} of ${helloSteps.length}`}>
          {helloSteps.map((_, index) => (
            <div 
              key={index}
              className={`h-1 flex-1 rounded-full ${
                index <= currentStep ? 'bg-blue-500' : 'bg-gray-700'
              }`}
              aria-hidden="true"
            />
          ))}
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col items-center justify-center">
        <AnimatePresence mode="wait">
          {!practicing && !completed ? (
            <motion.div
              key={`step-${currentStep}`}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              className="text-center max-w-md w-full"
            >
              {/* Visual Demonstration */}
              <div className="mb-8 w-48 h-48 mx-auto rounded-2xl bg-gray-900 border-2 border-blue-500 flex items-center justify-center" aria-hidden="true">
                <Hand className="w-24 h-24 text-blue-500" />
                <div className="absolute mt-20 ml-20">
                  <ArrowRight className="w-8 h-8 text-blue-400" />
                </div>
              </div>

              {/* Step Information */}
              <div className="mb-6">
                <div className="inline-block px-3 py-1 rounded-full bg-blue-600/20 text-blue-400 text-sm font-semibold mb-3">
                  Step {currentInstruction.step} of {helloSteps.length}
                </div>
                <h2 className="text-xl font-bold mb-2">{currentInstruction.title}</h2>
                <p className="text-lg text-blue-400 mb-3 font-semibold">
                  {currentInstruction.instruction}
                </p>
                <p className="text-gray-400">
                  {currentInstruction.description}
                </p>
              </div>
            </motion.div>
          ) : practicing && !completed ? (
            <motion.div
              key="practice"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center"
              role="status"
              aria-live="polite"
            >
              <div className="mb-8 w-64 h-64 mx-auto rounded-2xl bg-gray-900 border-2 border-blue-500 flex items-center justify-center relative" aria-hidden="true">
                <Hand className="w-32 h-32 text-blue-500" />
                <motion.div
                  className="absolute inset-0 border-4 border-blue-500 rounded-2xl"
                  animate={{ scale: [1, 1.05, 1] }}
                  transition={{ repeat: Infinity, duration: 2 }}
                />
              </div>
              <h2 className="text-xl font-semibold mb-2">Practice the Sign</h2>
              <p className="text-gray-400">Follow the steps you just learned</p>
              <div className="mt-6">
                <div className="inline-block">
                  <div className="flex items-center gap-2 text-sm text-blue-400">
                    <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
                    Tracking your hands...
                  </div>
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="complete"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center"
              role="status"
              aria-live="polite"
            >
              <div className="mb-8 w-32 h-32 mx-auto rounded-full bg-green-600/20 flex items-center justify-center" aria-hidden="true">
                <CheckCircle2 className="w-16 h-16 text-green-500" />
              </div>
              <h2 className="text-2xl font-bold mb-3">Congratulations!</h2>
              <p className="text-gray-400 mb-6 max-w-sm mx-auto">
                You've learned your first sign! You're now ready to start your sign language journey.
              </p>
              <div className="p-5 rounded-2xl bg-gray-900 inline-block">
                <div className="text-4xl mb-2" aria-hidden="true">👋</div>
                <div className="text-lg font-semibold mb-1">Hello</div>
                <div className="text-sm text-gray-400">Your first ASL sign</div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Learning Tips */}
      {!practicing && !completed && (
        <motion.div 
          className="mt-6 p-4 rounded-xl bg-gray-900 border border-gray-800"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          role="complementary"
          aria-label="Learning tip"
        >
          <h4 className="font-semibold text-sm mb-1 text-blue-400">💡 Tip</h4>
          <p className="text-sm text-gray-400">
            Practice in front of a mirror to see how your sign looks from the other person's perspective.
          </p>
        </motion.div>
      )}

      {/* Action Buttons */}
      <motion.div 
        className="mt-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        {!practicing && !completed ? (
          <Button
            onClick={handleNextStep}
            className="w-full bg-white text-black hover:bg-gray-100 h-14 text-lg font-semibold rounded-full"
            aria-label={currentStep < helloSteps.length - 1 ? 'Continue to next step' : 'Start practice'}
          >
            {currentStep < helloSteps.length - 1 ? 'Next Step' : 'Practice Now'}
          </Button>
        ) : completed ? (
          <Button
            onClick={handleFinish}
            className="w-full bg-white text-black hover:bg-gray-100 h-14 text-lg font-semibold rounded-full"
            aria-label="Finish onboarding and start learning"
          >
            Start Learning
          </Button>
        ) : null}
      </motion.div>

      {/* Progress Indicator */}
      <div className="mt-6 flex justify-center gap-2" role="progressbar" aria-valuenow={7} aria-valuemin={1} aria-valuemax={7} aria-label="Onboarding progress: step 7 of 7">
        <div className="w-2 h-2 rounded-full bg-gray-600" aria-hidden="true"></div>
        <div className="w-2 h-2 rounded-full bg-gray-600" aria-hidden="true"></div>
        <div className="w-2 h-2 rounded-full bg-gray-600" aria-hidden="true"></div>
        <div className="w-2 h-2 rounded-full bg-gray-600" aria-hidden="true"></div>
        <div className="w-2 h-2 rounded-full bg-gray-600" aria-hidden="true"></div>
        <div className="w-2 h-2 rounded-full bg-gray-600" aria-hidden="true"></div>
        <div className="w-2 h-2 rounded-full bg-white" aria-hidden="true"></div>
      </div>
    </div>
  );
}
