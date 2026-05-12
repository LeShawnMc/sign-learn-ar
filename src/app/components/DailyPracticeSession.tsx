import { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, 
  Hand, 
  Camera, 
  CheckCircle, 
  XCircle, 
  RotateCcw, 
  Award,
  TrendingUp,
  Clock,
  Target,
  ChevronRight,
  AlertCircle,
  ThumbsUp,
  Volume2,
  Pause,
  Play
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { ReviewSessionSummary } from './ReviewSessionSummary';
import type { Sign } from '../types';

type PracticeStep = 
  | 'intro'
  | 'ar-placement'
  | 'demonstration'
  | 'practice'
  | 'review'
  | 'summary'
  | 'detailed-summary';

interface PracticeSessionProps {
  signs: Sign[];
  onComplete: () => void;
  onExit: () => void;
}

interface PracticeResult {
  signId: string;
  word: string;
  attempts: number;
  success: boolean;
  mistakes: string[];
}

export function DailyPracticeSession({ signs, onComplete, onExit }: PracticeSessionProps) {
  const { userProgress } = useApp();
  const [currentStep, setCurrentStep] = useState<PracticeStep>('intro');
  const [currentSignIndex, setCurrentSignIndex] = useState(0);
  const [practiceResults, setPracticeResults] = useState<PracticeResult[]>([]);
  const [currentAttempts, setCurrentAttempts] = useState(0);
  const [isPracticing, setIsPracticing] = useState(false);
  const [arPlaced, setArPlaced] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState('');
  const [videoPlaying, setVideoPlaying] = useState(false);

  const currentSign = signs[currentSignIndex];
  const totalSigns = signs.length;
  const progress = ((currentSignIndex + 1) / totalSigns) * 100;

  // Calculate session stats
  const sessionStats = {
    totalAttempts: practiceResults.reduce((sum, r) => sum + r.attempts, 0),
    correctSigns: practiceResults.filter(r => r.success).length,
    accuracy: practiceResults.length > 0 
      ? Math.round((practiceResults.filter(r => r.success).length / practiceResults.length) * 100)
      : 0,
    totalMistakes: practiceResults.reduce((sum, r) => sum + r.mistakes.length, 0),
  };

  const handleStartSession = () => {
    setCurrentStep('ar-placement');
  };

  const handleArPlacement = () => {
    setArPlaced(true);
    setTimeout(() => {
      setCurrentStep('demonstration');
    }, 500);
  };

  const handleStartPractice = () => {
    setCurrentStep('practice');
    setIsPracticing(true);
    setCurrentAttempts(0);
    setFeedbackMessage('');
  };

  const handlePracticeAttempt = (success: boolean) => {
    const attempts = currentAttempts + 1;
    setCurrentAttempts(attempts);

    if (success) {
      setFeedbackMessage('Perfect! Great job!');
      
      // Record successful practice
      const result: PracticeResult = {
        signId: currentSign.id,
        word: currentSign.word,
        attempts,
        success: true,
        mistakes: [],
      };
      setPracticeResults(prev => [...prev, result]);

      // Move to next sign or review
      setTimeout(() => {
        if (currentSignIndex < totalSigns - 1) {
          setCurrentSignIndex(prev => prev + 1);
          setCurrentStep('demonstration');
          setFeedbackMessage('');
          setCurrentAttempts(0);
        } else {
          setCurrentStep('review');
        }
      }, 1500);
    } else {
      setFeedbackMessage('Not quite right. Try again!');
      
      if (attempts >= 3) {
        // After 3 attempts, record and move on
        const result: PracticeResult = {
          signId: currentSign.id,
          word: currentSign.word,
          attempts,
          success: false,
          mistakes: ['Hand position', 'Movement direction'],
        };
        setPracticeResults(prev => [...prev, result]);

        setTimeout(() => {
          if (currentSignIndex < totalSigns - 1) {
            setCurrentSignIndex(prev => prev + 1);
            setCurrentStep('demonstration');
            setFeedbackMessage('');
            setCurrentAttempts(0);
          } else {
            setCurrentStep('review');
          }
        }, 1500);
      }
    }
  };

  const handleRetrySign = (signIndex: number) => {
    setCurrentSignIndex(signIndex);
    setCurrentStep('demonstration');
    setCurrentAttempts(0);
    setFeedbackMessage('');
    // Remove the result for retry
    setPracticeResults(prev => prev.filter(r => r.signId !== signs[signIndex].id));
  };

  const handleFinishSession = () => {
    setCurrentStep('summary');
  };

  const handleCompleteSession = () => {
    onComplete();
  };

  if (currentStep === 'intro') {
    return (
      <div 
        className="min-h-screen bg-black text-white flex flex-col"
        role="main"
        aria-labelledby="practice-intro-title"
      >
        {/* Header */}
        <div className="p-6 flex items-center justify-between">
          <h1 id="practice-intro-title" className="text-xl font-bold">Daily Practice</h1>
          <Button
            variant="ghost"
            size="icon"
            onClick={onExit}
            className="w-10 h-10 rounded-full hover:bg-gray-900"
            aria-label="Exit practice session"
          >
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* Content */}
        <div className="flex-1 flex flex-col items-center justify-center px-6 pb-20">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="w-24 h-24 rounded-full bg-blue-600/20 flex items-center justify-center mb-6"
            aria-hidden="true"
          >
            <Hand className="w-12 h-12 text-blue-500" />
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-2xl font-bold mb-3 text-center"
          >
            Ready to Practice?
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-gray-400 text-center mb-8 max-w-sm"
          >
            You'll practice {totalSigns} signs today. Watch the demonstration, then try it yourself with AR feedback.
          </motion.p>

          {/* Session Info Cards */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="w-full max-w-sm space-y-3 mb-8"
          >
            <div className="bg-gray-900 rounded-xl p-4 flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-blue-600/20 flex items-center justify-center" aria-hidden="true">
                <Target className="w-6 h-6 text-blue-500" />
              </div>
              <div>
                <div className="font-semibold">{totalSigns} Signs</div>
                <div className="text-sm text-gray-400">Today's goal</div>
              </div>
            </div>

            <div className="bg-gray-900 rounded-xl p-4 flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-green-600/20 flex items-center justify-center" aria-hidden="true">
                <Clock className="w-6 h-6 text-green-500" />
              </div>
              <div>
                <div className="font-semibold">~{totalSigns * 2} minutes</div>
                <div className="text-sm text-gray-400">Estimated time</div>
              </div>
            </div>

            <div className="bg-gray-900 rounded-xl p-4 flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-purple-600/20 flex items-center justify-center" aria-hidden="true">
                <TrendingUp className="w-6 h-6 text-purple-500" />
              </div>
              <div>
                <div className="font-semibold">{userProgress.currentStreak} day streak</div>
                <div className="text-sm text-gray-400">Keep it going!</div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Bottom Button */}
        <div className="p-6 border-t border-gray-900">
          <Button
            onClick={handleStartSession}
            className="w-full bg-blue-600 hover:bg-blue-700 h-14 text-lg font-semibold rounded-full"
            aria-label="Start practice session"
          >
            Start Session
          </Button>
        </div>
      </div>
    );
  }

  if (currentStep === 'ar-placement') {
    return (
      <div 
        className="min-h-screen bg-black text-white flex flex-col"
        role="main"
        aria-labelledby="ar-placement-title"
      >
        {/* Header */}
        <div className="p-6 flex items-center justify-between">
          <h1 id="ar-placement-title" className="text-xl font-bold">AR Setup</h1>
          <Button
            variant="ghost"
            size="icon"
            onClick={onExit}
            className="w-10 h-10 rounded-full hover:bg-gray-900"
            aria-label="Exit practice session"
          >
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* AR Camera View Simulation */}
        <div className="flex-1 relative bg-gray-900 mx-6 rounded-2xl overflow-hidden">
          <div className="absolute inset-0 flex items-center justify-center">
            {/* AR Frame/Grid */}
            <div className="relative w-64 h-64">
              <motion.div
                animate={{ 
                  scale: [1, 1.05, 1],
                  opacity: [0.3, 0.6, 0.3]
                }}
                transition={{ 
                  duration: 2, 
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                className="absolute inset-0 border-4 border-blue-500 rounded-2xl"
                aria-hidden="true"
              />
              
              {/* Corner markers */}
              <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-blue-500" aria-hidden="true" />
              <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-blue-500" aria-hidden="true" />
              <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-blue-500" aria-hidden="true" />
              <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-blue-500" aria-hidden="true" />

              {/* Avatar placeholder */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: arPlaced ? 1 : 0.5, scale: arPlaced ? 1 : 0.8 }}
                className="absolute inset-0 flex items-center justify-center"
              >
                <div className="w-32 h-32 rounded-full bg-blue-600/30 flex items-center justify-center" aria-hidden="true">
                  <Hand className="w-16 h-16 text-blue-500" />
                </div>
              </motion.div>
            </div>
          </div>

          {/* Status indicator */}
          <div className="absolute top-4 left-4 right-4">
            <div className={`flex items-center gap-2 px-4 py-2 rounded-full ${arPlaced ? 'bg-green-600' : 'bg-blue-600'} text-sm font-medium`} role="status" aria-live="polite">
              <Camera className="w-4 h-4" />
              <span>{arPlaced ? 'AR Avatar Placed' : 'Position the AR avatar'}</span>
            </div>
          </div>
        </div>

        {/* Instructions */}
        <div className="p-6">
          <div className="bg-gray-900 rounded-xl p-4 mb-4">
            <h3 className="font-semibold mb-2">How to place the avatar:</h3>
            <ul className="space-y-2 text-sm text-gray-400" role="list">
              <li className="flex items-start gap-2">
                <span className="text-blue-500 mt-0.5">1.</span>
                <span>Point your camera at an open space</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-500 mt-0.5">2.</span>
                <span>Move slowly to help detect the surface</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-500 mt-0.5">3.</span>
                <span>Tap to place the avatar when ready</span>
              </li>
            </ul>
          </div>

          <Button
            onClick={handleArPlacement}
            disabled={arPlaced}
            className="w-full bg-blue-600 hover:bg-blue-700 h-14 text-lg font-semibold rounded-full disabled:opacity-50"
            aria-label={arPlaced ? 'Avatar placed, continuing' : 'Place AR avatar'}
          >
            {arPlaced ? 'Continuing...' : 'Place Avatar'}
          </Button>
        </div>
      </div>
    );
  }

  if (currentStep === 'demonstration') {
    return (
      <div 
        className="min-h-screen bg-black text-white flex flex-col"
        role="main"
        aria-labelledby="demonstration-title"
      >
        {/* Header with Progress */}
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={onExit}
              className="w-10 h-10 rounded-full hover:bg-gray-900"
              aria-label="Exit practice session"
            >
              <X className="w-5 h-5" />
            </Button>
            <div className="text-sm font-semibold">
              {currentSignIndex + 1} / {totalSigns}
            </div>
          </div>

          {/* Progress Bar */}
          <div className="h-2 bg-gray-900 rounded-full overflow-hidden" role="progressbar" aria-valuenow={progress} aria-valuemin={0} aria-valuemax={100}>
            <motion.div 
              className="h-full bg-blue-600"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
        </div>

        {/* Video Demonstration Area */}
        <div className="flex-1 px-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-gray-900 rounded-2xl h-80 relative overflow-hidden"
            role="region"
            aria-label="Sign demonstration video"
          >
            {/* Video placeholder with AR avatar */}
            <div className="absolute inset-0 flex items-center justify-center">
              <motion.div
                animate={videoPlaying ? {
                  rotate: [0, 10, -10, 0],
                  y: [0, -10, 0]
                } : {}}
                transition={{
                  duration: 2,
                  repeat: videoPlaying ? Infinity : 0,
                  ease: "easeInOut"
                }}
                className="relative"
              >
                <div className="w-48 h-48 rounded-full bg-blue-600/20 flex items-center justify-center" aria-hidden="true">
                  <Hand className="w-24 h-24 text-blue-500" />
                </div>
                
                {/* Play/Pause overlay */}
                <button
                  onClick={() => setVideoPlaying(!videoPlaying)}
                  className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-full hover:bg-black/50 transition-colors"
                  aria-label={videoPlaying ? 'Pause demonstration' : 'Play demonstration'}
                >
                  {videoPlaying ? (
                    <Pause className="w-12 h-12" />
                  ) : (
                    <Play className="w-12 h-12" />
                  )}
                </button>
              </motion.div>
            </div>

            {/* Video controls */}
            <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
              <Button
                variant="ghost"
                size="icon"
                className="w-10 h-10 rounded-full bg-black/50 hover:bg-black/70"
                aria-label="Replay demonstration"
                onClick={() => setVideoPlaying(true)}
              >
                <RotateCcw className="w-5 h-5" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="w-10 h-10 rounded-full bg-black/50 hover:bg-black/70"
                aria-label="Play audio"
              >
                <Volume2 className="w-5 h-5" />
              </Button>
            </div>
          </motion.div>

          {/* Sign Information */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-6"
          >
            <h2 id="demonstration-title" className="text-3xl font-bold mb-3">{currentSign.word}</h2>
            <p className="text-gray-400 leading-relaxed mb-4">
              {currentSign.description}
            </p>

            <div className="flex items-center gap-4 text-sm">
              <div className="px-3 py-1.5 bg-gray-900 rounded-full">
                <span className="text-gray-400">Category:</span>{' '}
                <span className="font-semibold">{currentSign.category}</span>
              </div>
              <div className="px-3 py-1.5 bg-gray-900 rounded-full capitalize">
                {currentSign.difficulty}
              </div>
            </div>
          </motion.div>
        </div>

        {/* Action Buttons */}
        <div className="p-6 space-y-3">
          <Button
            onClick={handleStartPractice}
            className="w-full bg-blue-600 hover:bg-blue-700 h-14 text-lg font-semibold rounded-full"
            aria-label={`Practice signing ${currentSign.word}`}
          >
            Practice This Sign
          </Button>
          
          {currentSignIndex > 0 && (
            <Button
              onClick={() => setCurrentSignIndex(prev => prev - 1)}
              variant="ghost"
              className="w-full h-12 text-gray-400 hover:text-white"
              aria-label="Go back to previous sign"
            >
              Previous Sign
            </Button>
          )}
        </div>
      </div>
    );
  }

  if (currentStep === 'practice') {
    return (
      <div 
        className="min-h-screen bg-black text-white flex flex-col"
        role="main"
        aria-labelledby="practice-title"
      >
        {/* Header */}
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h1 id="practice-title" className="text-xl font-bold">Practice Mode</h1>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setCurrentStep('demonstration')}
              className="w-10 h-10 rounded-full hover:bg-gray-900"
              aria-label="Back to demonstration"
            >
              <X className="w-5 h-5" />
            </Button>
          </div>

          {/* Progress */}
          <div className="flex items-center justify-between text-sm text-gray-400 mb-2">
            <span>Sign {currentSignIndex + 1} of {totalSigns}</span>
            <span>Attempt {currentAttempts + 1}/3</span>
          </div>
          <div className="h-2 bg-gray-900 rounded-full overflow-hidden" role="progressbar" aria-valuenow={progress} aria-valuemin={0} aria-valuemax={100}>
            <div className="h-full bg-blue-600" style={{ width: `${progress}%` }} />
          </div>
        </div>

        {/* Camera View with Hand Tracking */}
        <div className="flex-1 px-6">
          <div className="bg-gray-900 rounded-2xl h-96 relative overflow-hidden">
            {/* Simulated camera feed */}
            <div className="absolute inset-0 flex items-center justify-center">
              <motion.div
                animate={{
                  scale: isPracticing ? [1, 1.1, 1] : 1,
                }}
                transition={{
                  duration: 1.5,
                  repeat: isPracticing ? Infinity : 0,
                }}
                className="relative"
              >
                <div className="w-40 h-40 rounded-full bg-blue-600/20 flex items-center justify-center border-4 border-blue-600" aria-hidden="true">
                  <Hand className="w-20 h-20 text-blue-500" />
                </div>

                {/* Hand tracking points */}
                {isPracticing && (
                  <>
                    <motion.div
                      animate={{ scale: [0.8, 1.2, 0.8] }}
                      transition={{ duration: 1, repeat: Infinity }}
                      className="absolute top-4 left-8 w-3 h-3 rounded-full bg-green-500"
                      aria-hidden="true"
                    />
                    <motion.div
                      animate={{ scale: [0.8, 1.2, 0.8] }}
                      transition={{ duration: 1, repeat: Infinity, delay: 0.2 }}
                      className="absolute top-8 right-8 w-3 h-3 rounded-full bg-green-500"
                      aria-hidden="true"
                    />
                    <motion.div
                      animate={{ scale: [0.8, 1.2, 0.8] }}
                      transition={{ duration: 1, repeat: Infinity, delay: 0.4 }}
                      className="absolute bottom-8 left-12 w-3 h-3 rounded-full bg-green-500"
                      aria-hidden="true"
                    />
                  </>
                )}
              </motion.div>
            </div>

            {/* Tracking status */}
            <div className="absolute top-4 left-4 right-4">
              <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-green-600 text-sm font-medium" role="status" aria-live="polite">
                <div className="w-2 h-2 rounded-full bg-white animate-pulse" aria-hidden="true" />
                <span>Hand Tracking Active</span>
              </div>
            </div>

            {/* Feedback overlay */}
            <AnimatePresence>
              {feedbackMessage && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="absolute bottom-4 left-4 right-4"
                  role="status"
                  aria-live="polite"
                >
                  <div className={`px-4 py-3 rounded-xl font-semibold text-center ${
                    feedbackMessage.includes('Perfect') 
                      ? 'bg-green-600' 
                      : 'bg-orange-600'
                  }`}>
                    {feedbackMessage}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Current Sign Reference */}
          <div className="mt-4 bg-gray-900 rounded-xl p-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-semibold text-lg">{currentSign.word}</h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setCurrentStep('demonstration')}
                className="text-blue-500 hover:text-blue-400"
                aria-label="Watch demonstration again"
              >
                Watch Again
              </Button>
            </div>
            <p className="text-sm text-gray-400">{currentSign.description}</p>
          </div>
        </div>

        {/* Practice Controls */}
        <div className="p-6 space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <Button
              onClick={() => handlePracticeAttempt(false)}
              variant="outline"
              className="h-14 border-2 border-gray-700 hover:border-orange-600 hover:bg-orange-600/10"
              aria-label="Mark attempt as incorrect"
            >
              <XCircle className="w-5 h-5 mr-2" />
              Incorrect
            </Button>
            <Button
              onClick={() => handlePracticeAttempt(true)}
              className="h-14 bg-green-600 hover:bg-green-700"
              aria-label="Mark attempt as correct"
            >
              <CheckCircle className="w-5 h-5 mr-2" />
              Correct
            </Button>
          </div>

          <p className="text-xs text-center text-gray-500">
            Or practice until you feel confident, then mark yourself
          </p>
        </div>
      </div>
    );
  }

  if (currentStep === 'review') {
    const failedSigns = practiceResults.filter(r => !r.success);

    return (
      <div 
        className="min-h-screen bg-black text-white flex flex-col"
        role="main"
        aria-labelledby="review-title"
      >
        {/* Header */}
        <div className="p-6">
          <h1 id="review-title" className="text-2xl font-bold mb-2">Review Your Practice</h1>
          <p className="text-gray-400">
            {failedSigns.length > 0 
              ? `Let's review the signs that need more practice` 
              : 'Great job! All signs completed successfully'}
          </p>
        </div>

        {/* Results List */}
        <div className="flex-1 px-6 pb-6 overflow-y-auto">
          {failedSigns.length > 0 ? (
            <div className="space-y-3">
              <h2 className="text-lg font-semibold mb-3">Signs to Review</h2>
              {failedSigns.map((result, index) => {
                const signIndex = signs.findIndex(s => s.id === result.signId);
                return (
                  <motion.div
                    key={result.signId}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-gray-900 rounded-xl p-4"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-full bg-orange-600/20 flex items-center justify-center flex-shrink-0" aria-hidden="true">
                          <AlertCircle className="w-5 h-5 text-orange-500" />
                        </div>
                        <div>
                          <h3 className="font-semibold mb-1">{result.word}</h3>
                          <p className="text-sm text-gray-400">
                            {result.attempts} attempts • Needs review
                          </p>
                        </div>
                      </div>
                      <Button
                        onClick={() => handleRetrySign(signIndex)}
                        size="sm"
                        className="bg-blue-600 hover:bg-blue-700"
                        aria-label={`Retry practicing ${result.word}`}
                      >
                        <RotateCcw className="w-4 h-4 mr-1" />
                        Retry
                      </Button>
                    </div>

                    {result.mistakes.length > 0 && (
                      <div className="mt-3 pt-3 border-t border-gray-800">
                        <p className="text-xs text-gray-500 mb-2">Common mistakes:</p>
                        <ul className="space-y-1" role="list">
                          {result.mistakes.map((mistake, i) => (
                            <li key={i} className="text-sm text-gray-400 flex items-center gap-2">
                              <span className="w-1.5 h-1.5 rounded-full bg-orange-500" aria-hidden="true" />
                              {mistake}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </motion.div>
                );
              })}
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col items-center justify-center py-12"
            >
              <div className="w-20 h-20 rounded-full bg-green-600/20 flex items-center justify-center mb-4" aria-hidden="true">
                <ThumbsUp className="w-10 h-10 text-green-500" />
              </div>
              <h3 className="text-xl font-bold mb-2">Perfect Practice!</h3>
              <p className="text-gray-400 text-center">
                You completed all signs successfully
              </p>
            </motion.div>
          )}

          {/* Completed Signs */}
          {practiceResults.filter(r => r.success).length > 0 && (
            <div className="mt-6">
              <h2 className="text-lg font-semibold mb-3">Completed Signs</h2>
              <div className="space-y-2">
                {practiceResults.filter(r => r.success).map((result, index) => (
                  <motion.div
                    key={result.signId}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="bg-gray-900 rounded-xl p-3 flex items-center gap-3"
                  >
                    <div className="w-8 h-8 rounded-full bg-green-600/20 flex items-center justify-center" aria-hidden="true">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                    </div>
                    <div className="flex-1">
                      <div className="font-semibold">{result.word}</div>
                      <div className="text-xs text-gray-400">
                        {result.attempts} {result.attempts === 1 ? 'attempt' : 'attempts'}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="p-6 border-t border-gray-900 space-y-3">
          <Button
            onClick={handleFinishSession}
            className="w-full bg-blue-600 hover:bg-blue-700 h-14 text-lg font-semibold rounded-full"
            aria-label="Continue to session summary"
          >
            Continue to Summary
          </Button>
        </div>
      </div>
    );
  }

  if (currentStep === 'summary') {
    return (
      <div 
        className="min-h-screen bg-black text-white flex flex-col"
        role="main"
        aria-labelledby="summary-title"
      >
        {/* Header */}
        <div className="p-6 text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="w-24 h-24 rounded-full bg-blue-600/20 flex items-center justify-center mx-auto mb-4"
            aria-hidden="true"
          >
            <Award className="w-12 h-12 text-blue-500" />
          </motion.div>
          
          <motion.h1
            id="summary-title"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-3xl font-bold mb-2"
          >
            Session Complete!
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-gray-400"
          >
            Great work on today's practice
          </motion.p>
        </div>

        {/* Stats Cards */}
        <div className="flex-1 px-6 pb-6 overflow-y-auto">
          <div className="grid grid-cols-2 gap-3 mb-6">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4 }}
              className="bg-gradient-to-br from-blue-600 to-blue-800 rounded-xl p-4 text-center"
            >
              <div className="text-3xl font-bold mb-1">{sessionStats.correctSigns}</div>
              <div className="text-sm opacity-90">Signs Learned</div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5 }}
              className="bg-gradient-to-br from-green-600 to-green-800 rounded-xl p-4 text-center"
            >
              <div className="text-3xl font-bold mb-1">{sessionStats.accuracy}%</div>
              <div className="text-sm opacity-90">Accuracy</div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.6 }}
              className="bg-gradient-to-br from-purple-600 to-purple-800 rounded-xl p-4 text-center"
            >
              <div className="text-3xl font-bold mb-1">{totalSigns * 2}</div>
              <div className="text-sm opacity-90">Minutes</div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.7 }}
              className="bg-gradient-to-br from-orange-600 to-orange-800 rounded-xl p-4 text-center"
            >
              <div className="text-3xl font-bold mb-1">{userProgress.currentStreak + 1}</div>
              <div className="text-sm opacity-90">Day Streak</div>
            </motion.div>
          </div>

          {/* Detailed Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="space-y-3"
          >
            <h2 className="text-lg font-semibold">Session Details</h2>
            
            <div className="bg-gray-900 rounded-xl p-4 space-y-3">\n              <div className="flex items-center justify-between">\n                <span className="text-gray-400">Total Signs</span>\n                <span className="font-semibold">{totalSigns}</span>\n              </div>\n              <div className="flex items-center justify-between">\n                <span className="text-gray-400">Successful</span>\n                <span className="font-semibold text-green-500">{sessionStats.correctSigns}</span>\n              </div>\n              <div className="flex items-center justify-between">\n                <span className="text-gray-400">Needs Practice</span>\n                <span className="font-semibold text-orange-500">\n                  {totalSigns - sessionStats.correctSigns}\n                </span>\n              </div>\n              <div className="flex items-center justify-between">\n                <span className="text-gray-400">Total Attempts</span>\n                <span className="font-semibold">{sessionStats.totalAttempts}</span>\n              </div>\n            </div>

            {/* Achievement */}
            <div className="bg-gradient-to-r from-yellow-600 to-yellow-800 rounded-xl p-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center" aria-hidden="true">
                  <Award className="w-6 h-6" />
                </div>
                <div>
                  <div className="font-semibold mb-1">Daily Goal Achieved!</div>
                  <div className="text-sm opacity-90">
                    +{sessionStats.correctSigns * 10} XP earned
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Action Buttons */}
        <div className="p-6 border-t border-gray-900 space-y-3">
          <Button
            onClick={() => setCurrentStep('detailed-summary')}
            className="w-full bg-purple-600 hover:bg-purple-700 h-14 text-lg font-semibold rounded-full"
            aria-label="View detailed review summary"
          >
            <TrendingUp className="w-5 h-5 mr-2" />
            View Detailed Review
          </Button>
          
          <Button
            onClick={handleCompleteSession}
            className="w-full bg-blue-600 hover:bg-blue-700 h-14 text-lg font-semibold rounded-full"
            aria-label="Finish session and return home"
          >
            Finish Session
          </Button>
          
          {sessionStats.correctSigns < totalSigns && (
            <Button
              onClick={() => {
                setCurrentStep('intro');
                setCurrentSignIndex(0);
                setPracticeResults([]);
              }}
              variant="ghost"
              className="w-full h-12 text-gray-400 hover:text-white"
              aria-label="Practice again"
            >
              Practice Again
            </Button>
          )}
        </div>
      </div>
    );
  }

  // Detailed Review Summary
  if (currentStep === 'detailed-summary') {
    // Prepare detailed session data
    const detailedSessionData = {
      totalSigns: totalSigns,
      correctSigns: sessionStats.correctSigns,
      timeSpent: totalSigns * 120, // ~2 minutes per sign
      mistakes: practiceResults
        .filter(r => !r.success)
        .map(r => ({
          sign: r.word,
          userAttempt: 'Incorrect hand position or movement',
          correctForm: signs.find(s => s.id === r.signId)?.description || '',
          tipForCorrection: `Focus on ${r.mistakes.join(' and ').toLowerCase()}. Watch the demonstration again and pay attention to the exact hand shape and movement path.`,
        })),
      newVocabulary: practiceResults
        .filter(r => r.success)
        .slice(0, 3)
        .map(r => {
          const sign = signs.find(s => s.id === r.signId);
          return {
            sign: r.word,
            meaning: sign?.description || '',
            category: sign?.category || 'General',
          };
        }),
      accuracyByCategory: (() => {
        const categoryMap = new Map<string, { correct: number; total: number }>();
        practiceResults.forEach(r => {
          const sign = signs.find(s => s.id === r.signId);
          const category = sign?.category || 'General';
          const existing = categoryMap.get(category) || { correct: 0, total: 0 };
          categoryMap.set(category, {
            correct: existing.correct + (r.success ? 1 : 0),
            total: existing.total + 1,
          });
        });
        return Array.from(categoryMap.entries()).map(([category, stats]) => ({
          category,
          accuracy: Math.round((stats.correct / stats.total) * 100),
          total: stats.total,
          correct: stats.correct,
        }));
      })(),
      streakContinued: true,
      currentStreak: userProgress.currentStreak + 1,
    };

    return (
      <ReviewSessionSummary
        onExit={handleCompleteSession}
        sessionData={detailedSessionData}
      />
    );
  }

  return null;
}