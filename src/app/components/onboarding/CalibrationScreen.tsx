import { useState, useEffect } from 'react';
import { Button } from '../ui/button';
import { useApp } from '../../context/AppContext';
import { motion, AnimatePresence } from 'motion/react';
import { Hand, CheckCircle2 } from 'lucide-react';

type CalibrationStep = 'intro' | 'left-hand' | 'right-hand' | 'both-hands' | 'complete';

export function CalibrationScreen() {
  const { setCurrentStep } = useApp();
  const [step, setStep] = useState<CalibrationStep>('intro');
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (step === 'left-hand') {
      const timer = setTimeout(() => {
        setProgress(33);
        setStep('right-hand');
      }, 2500);
      return () => clearTimeout(timer);
    } else if (step === 'right-hand') {
      const timer = setTimeout(() => {
        setProgress(66);
        setStep('both-hands');
      }, 2500);
      return () => clearTimeout(timer);
    } else if (step === 'both-hands') {
      const timer = setTimeout(() => {
        setProgress(100);
        setStep('complete');
      }, 2500);
      return () => clearTimeout(timer);
    }
  }, [step]);

  const handleStart = () => {
    setStep('left-hand');
  };

  const handleContinue = () => {
    setCurrentStep('room-scan');
  };

  const handleSkip = () => {
    setCurrentStep('room-scan');
  };

  return (
    <div 
      className="min-h-screen bg-black text-white flex flex-col p-6"
      role="main"
      aria-labelledby="calibration-title"
    >
      {/* Header */}
      <div className="mb-6">
        <h1 id="calibration-title" className="text-2xl font-bold mb-2">
          Hand Tracking Calibration
        </h1>
        <p className="text-gray-400">
          {step === 'intro' 
            ? 'Let\'s calibrate the camera to track your hands accurately'
            : step === 'complete'
            ? 'Calibration complete!'
            : 'Follow the on-screen instructions'}
        </p>
      </div>

      {/* Progress Bar */}
      {step !== 'intro' && (
        <div className="mb-6" role="progressbar" aria-valuenow={progress} aria-valuemin={0} aria-valuemax={100} aria-label={`Calibration progress: ${progress}%`}>
          <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
            <motion.div 
              className="h-full bg-blue-500"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
          <p className="text-sm text-gray-400 mt-2">{Math.round(progress)}% Complete</p>
        </div>
      )}

      {/* Calibration Content */}
      <div className="flex-1 flex flex-col items-center justify-center">
        <AnimatePresence mode="wait">
          {step === 'intro' && (
            <motion.div
              key="intro"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="text-center max-w-md"
            >
              <div className="mb-6 w-32 h-32 mx-auto rounded-full bg-blue-600/20 flex items-center justify-center" aria-hidden="true">
                <Hand className="w-16 h-16 text-blue-500" />
              </div>
              <h2 className="text-xl font-semibold mb-3">Position Your Hands</h2>
              <p className="text-gray-400 mb-6">
                We'll guide you through a quick calibration to ensure accurate hand tracking. This will only take about 10 seconds.
              </p>
              <ul className="text-left space-y-2 text-sm text-gray-400 mb-8" role="list">
                <li className="flex items-start gap-2" role="listitem">
                  <span className="text-blue-500 mt-1">•</span>
                  <span>Find a well-lit area</span>
                </li>
                <li className="flex items-start gap-2" role="listitem">
                  <span className="text-blue-500 mt-1">•</span>
                  <span>Hold your hands in front of the camera</span>
                </li>
                <li className="flex items-start gap-2" role="listitem">
                  <span className="text-blue-500 mt-1">•</span>
                  <span>Follow the on-screen prompts</span>
                </li>
              </ul>
            </motion.div>
          )}

          {step === 'left-hand' && (
            <motion.div
              key="left-hand"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 50 }}
              className="text-center"
              role="status"
              aria-live="polite"
            >
              <div className="mb-6 w-48 h-48 mx-auto rounded-2xl bg-gray-900 border-2 border-blue-500 flex items-center justify-center" aria-hidden="true">
                <div className="relative">
                  <Hand className="w-24 h-24 text-blue-500" />
                  <motion.div
                    className="absolute inset-0 border-4 border-blue-500 rounded-lg"
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ repeat: Infinity, duration: 1.5 }}
                  />
                </div>
              </div>
              <h2 className="text-xl font-semibold mb-2">Raise Your Left Hand</h2>
              <p className="text-gray-400">Keep your hand steady and visible to the camera</p>
            </motion.div>
          )}

          {step === 'right-hand' && (
            <motion.div
              key="right-hand"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 50 }}
              className="text-center"
              role="status"
              aria-live="polite"
            >
              <div className="mb-6 w-48 h-48 mx-auto rounded-2xl bg-gray-900 border-2 border-blue-500 flex items-center justify-center" aria-hidden="true">
                <div className="relative">
                  <Hand className="w-24 h-24 text-blue-500 scale-x-[-1]" />
                  <motion.div
                    className="absolute inset-0 border-4 border-blue-500 rounded-lg"
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ repeat: Infinity, duration: 1.5 }}
                  />
                </div>
              </div>
              <h2 className="text-xl font-semibold mb-2">Raise Your Right Hand</h2>
              <p className="text-gray-400">Keep your hand steady and visible to the camera</p>
            </motion.div>
          )}

          {step === 'both-hands' && (
            <motion.div
              key="both-hands"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 50 }}
              className="text-center"
              role="status"
              aria-live="polite"
            >
              <div className="mb-6 w-48 h-48 mx-auto rounded-2xl bg-gray-900 border-2 border-blue-500 flex items-center justify-center gap-4" aria-hidden="true">
                <div className="relative">
                  <Hand className="w-20 h-20 text-blue-500" />
                  <motion.div
                    className="absolute inset-0 border-4 border-blue-500 rounded-lg"
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ repeat: Infinity, duration: 1.5 }}
                  />
                </div>
                <div className="relative">
                  <Hand className="w-20 h-20 text-blue-500 scale-x-[-1]" />
                  <motion.div
                    className="absolute inset-0 border-4 border-blue-500 rounded-lg"
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ repeat: Infinity, duration: 1.5, delay: 0.2 }}
                  />
                </div>
              </div>
              <h2 className="text-xl font-semibold mb-2">Raise Both Hands</h2>
              <p className="text-gray-400">Hold both hands in front of the camera</p>
            </motion.div>
          )}

          {step === 'complete' && (
            <motion.div
              key="complete"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center"
              role="status"
              aria-live="polite"
            >
              <div className="mb-6 w-32 h-32 mx-auto rounded-full bg-green-600/20 flex items-center justify-center" aria-hidden="true">
                <CheckCircle2 className="w-16 h-16 text-green-500" />
              </div>
              <h2 className="text-xl font-semibold mb-2">Calibration Complete!</h2>
              <p className="text-gray-400">Your hand tracking is ready to go</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Action Buttons */}
      <motion.div 
        className="mt-6 space-y-3"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        {step === 'intro' ? (
          <>
            <Button
              onClick={handleStart}
              className="w-full bg-white text-black hover:bg-gray-100 h-14 text-lg font-semibold rounded-full"
              aria-label="Start hand tracking calibration"
            >
              Start Calibration
            </Button>
            <Button
              onClick={handleSkip}
              variant="ghost"
              className="w-full h-12 text-gray-400 hover:text-white"
              aria-label="Skip calibration"
            >
              Skip for Now
            </Button>
          </>
        ) : step === 'complete' ? (
          <Button
            onClick={handleContinue}
            className="w-full bg-white text-black hover:bg-gray-100 h-14 text-lg font-semibold rounded-full"
            aria-label="Continue to next step"
          >
            Continue
          </Button>
        ) : null}
      </motion.div>

      {/* Progress Indicator */}
      <div className="mt-6 flex justify-center gap-2" role="progressbar" aria-valuenow={3} aria-valuemin={1} aria-valuemax={7} aria-label="Onboarding progress: step 3 of 7">
        <div className="w-2 h-2 rounded-full bg-gray-600" aria-hidden="true"></div>
        <div className="w-2 h-2 rounded-full bg-gray-600" aria-hidden="true"></div>
        <div className="w-2 h-2 rounded-full bg-white" aria-hidden="true"></div>
        <div className="w-2 h-2 rounded-full bg-gray-600" aria-hidden="true"></div>
        <div className="w-2 h-2 rounded-full bg-gray-600" aria-hidden="true"></div>
        <div className="w-2 h-2 rounded-full bg-gray-600" aria-hidden="true"></div>
        <div className="w-2 h-2 rounded-full bg-gray-600" aria-hidden="true"></div>
      </div>
    </div>
  );
}
