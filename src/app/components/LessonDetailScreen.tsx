import { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, Play, CheckCircle2, Hand, Info, Trophy, Star } from 'lucide-react';
import { useApp } from '../context/AppContext';
import type { Lesson } from '../types';

interface LessonDetailScreenProps {
  lesson: Lesson;
  onBack: () => void;
}

export function LessonDetailScreen({ lesson, onBack }: LessonDetailScreenProps) {
  const { completeLesson, practiceSign, updateSignMastery, addNotification } = useApp();
  const [currentSignIndex, setCurrentSignIndex] = useState(0);
  const [showingPractice, setShowingPractice] = useState(false);
  const [completedSigns, setCompletedSigns] = useState<string[]>([]);
  const [lessonCompleted, setLessonCompleted] = useState(false);
  const [showCompletionModal, setShowCompletionModal] = useState(false);

  const currentSign = lesson.signs[currentSignIndex];
  const isLastSign = currentSignIndex === lesson.signs.length - 1;

  const handleStartPractice = () => {
    setShowingPractice(true);
    
    // Track that user practiced this sign
    practiceSign(currentSign.id);
    
    // Simulate practice completion with score
    setTimeout(() => {
      const randomScore = Math.floor(Math.random() * 30) + 70; // 70-100 score
      
      setCompletedSigns(prev => [...prev, currentSign.id]);
      updateSignMastery(currentSign.id, randomScore);
      setShowingPractice(false);
      
      // If this was the last sign, complete the lesson
      if (isLastSign && completedSigns.length === lesson.signs.length - 1) {
        handleLessonCompletion();
      } else if (!isLastSign) {
        setTimeout(() => {
          setCurrentSignIndex(currentSignIndex + 1);
        }, 500);
      }
    }, 3000);
  };

  const handleLessonCompletion = () => {
    const score = Math.floor((completedSigns.length + 1) / lesson.signs.length * 100);
    completeLesson(lesson.id, score);
    setLessonCompleted(true);
    setShowCompletionModal(true);
  };

  const handleNext = () => {
    if (!isLastSign) {
      setCurrentSignIndex(currentSignIndex + 1);
    } else if (completedSigns.length === lesson.signs.length) {
      handleLessonCompletion();
    }
  };

  const handlePrevious = () => {
    if (currentSignIndex > 0) {
      setCurrentSignIndex(currentSignIndex - 1);
    }
  };

  const handleFinish = () => {
    setShowCompletionModal(false);
    onBack();
  };

  const isCompleted = completedSigns.includes(currentSign.id);
  const progressPercentage = Math.round((completedSigns.length / lesson.signs.length) * 100);

  return (
    <div 
      className="min-h-screen bg-black text-white flex flex-col"
      role="main"
      aria-labelledby="lesson-title"
    >
      {/* Completion Modal */}
      <AnimatePresence>
        {showCompletionModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-6"
            style={{ background: 'rgba(0, 0, 0, 0.8)' }}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-gray-900 rounded-3xl p-8 max-w-sm w-full text-center border-2 border-blue-500"
            >
              <div className="mb-6">
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center mx-auto mb-4">
                  <Trophy className="w-10 h-10 text-white" />
                </div>
                <h2 className="text-2xl font-bold mb-2">Lesson Complete! 🎉</h2>
                <p className="text-gray-400 mb-4">
                  You've completed "{lesson.title}"
                </p>
                <div className="flex items-center justify-center gap-2 mb-4">
                  <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
                  <span className="text-3xl font-bold text-blue-500">{progressPercentage}%</span>
                  <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
                </div>
                <div className="bg-gray-800 rounded-xl p-4 mb-6">
                  <div className="text-sm text-gray-400 mb-1">Signs Learned</div>
                  <div className="text-xl font-bold">{completedSigns.length + 1} / {lesson.signs.length}</div>
                </div>
              </div>
              <Button
                onClick={handleFinish}
                className="w-full bg-blue-600 hover:bg-blue-700 h-12 rounded-full font-semibold"
              >
                Continue Learning
              </Button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <div className="p-6 border-b border-gray-800">
        <Button
          variant="ghost"
          size="icon"
          className="w-10 h-10 rounded-full hover:bg-gray-900 mb-4"
          onClick={onBack}
          aria-label="Back to home"
        >
          <ArrowLeft className="w-5 h-5" />
        </Button>
        
        <h1 id="lesson-title" className="text-2xl font-bold mb-2">{lesson.title}</h1>
        <p className="text-gray-400 mb-4">{lesson.description}</p>
        
        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-400">
              Sign {currentSignIndex + 1} of {lesson.signs.length}
            </span>
            <span className="text-blue-500 font-semibold">
              {progressPercentage}% Complete
            </span>
          </div>
          <div 
            className="h-2 bg-gray-800 rounded-full overflow-hidden"
            role="progressbar"
            aria-valuenow={progressPercentage}
            aria-valuemin={0}
            aria-valuemax={100}
          >
            <motion.div 
              className="h-full bg-blue-500"
              initial={{ width: 0 }}
              animate={{ width: `${progressPercentage}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-6">
        <AnimatePresence mode="wait">
          {!showingPractice ? (
            <motion.div
              key={`sign-${currentSign.id}`}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              className="h-full flex flex-col"
            >
              {/* Sign Title */}
              <div className="mb-6">
                <div className="flex items-center gap-3 mb-2">
                  <h2 className="text-3xl font-bold">{currentSign.word}</h2>
                  {isCompleted && (
                    <CheckCircle2 className="w-7 h-7 text-green-500" aria-label="Completed" />
                  )}
                </div>
                <div className="inline-block px-3 py-1 rounded-full bg-gray-800 text-gray-300 text-sm">
                  {currentSign.category}
                </div>
              </div>

              {/* Video/Animation Area */}
              <div className="mb-6 w-full aspect-square max-w-sm mx-auto rounded-2xl bg-gray-900 border-2 border-gray-800 flex items-center justify-center relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 to-purple-600/10" aria-hidden="true" />
                <Hand className="w-32 h-32 text-blue-500 relative z-10" aria-hidden="true" />
                <div className="absolute bottom-4 right-4 w-10 h-10 rounded-full bg-blue-600/20 flex items-center justify-center">
                  <Play className="w-5 h-5 text-blue-500" />
                </div>
              </div>

              {/* Instructions */}
              <div className="bg-gray-900 rounded-2xl p-5 mb-6">
                <div className="flex items-start gap-3 mb-3">
                  <div className="w-8 h-8 rounded-full bg-blue-600/20 flex items-center justify-center flex-shrink-0 mt-0.5" aria-hidden="true">
                    <Info className="w-4 h-4 text-blue-500" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">How to Sign</h3>
                    <p className="text-gray-400 leading-relaxed">{currentSign.description}</p>
                  </div>
                </div>
              </div>

              {/* Tips */}
              <div className="bg-blue-900/20 border border-blue-800/30 rounded-xl p-4 mb-6">
                <h4 className="font-semibold text-sm mb-1 text-blue-400">💡 Practice Tip</h4>
                <p className="text-sm text-gray-400">
                  Make sure your movements are clear and deliberate. Sign language is visual, so facial expressions and hand positioning matter!
                </p>
              </div>

              {/* Action Buttons */}
              <div className="mt-auto space-y-3">
                <Button
                  onClick={handleStartPractice}
                  className="w-full bg-white text-black hover:bg-gray-100 h-14 text-lg font-semibold rounded-full"
                  aria-label={`Practice signing ${currentSign.word}`}
                >
                  {isCompleted ? 'Practice Again' : 'Start Practice'}
                </Button>
                
                <div className="flex gap-3">
                  <Button
                    onClick={handlePrevious}
                    disabled={currentSignIndex === 0}
                    variant="outline"
                    className="flex-1 bg-gray-900 border-gray-700 hover:bg-gray-800 h-12 rounded-full disabled:opacity-50"
                    aria-label="Previous sign"
                  >
                    Previous
                  </Button>
                  <Button
                    onClick={handleNext}
                    disabled={isLastSign ? !isCompleted : !isCompleted}
                    variant="outline"
                    className="flex-1 bg-gray-900 border-gray-700 hover:bg-gray-800 h-12 rounded-full disabled:opacity-50"
                    aria-label="Next sign"
                  >
                    {isLastSign ? 'Finish' : 'Next'}
                  </Button>
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="practice"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="h-full flex flex-col items-center justify-center"
              role="status"
              aria-live="polite"
            >
              <div className="mb-8 w-64 h-64 rounded-2xl bg-gray-900 border-2 border-blue-500 flex items-center justify-center relative" aria-hidden="true">
                <Hand className="w-32 h-32 text-blue-500" />
                <motion.div
                  className="absolute inset-0 border-4 border-blue-500 rounded-2xl"
                  animate={{ scale: [1, 1.05, 1] }}
                  transition={{ repeat: Infinity, duration: 2 }}
                />
              </div>
              <h2 className="text-2xl font-bold mb-2">Practice: {currentSign.word}</h2>
              <p className="text-gray-400 mb-6 text-center max-w-sm">
                Follow the instructions and show us the sign
              </p>
              <div className="flex items-center gap-2 text-sm text-blue-400">
                <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
                Tracking your hands...
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Sign Thumbnails */}
      <div className="border-t border-gray-800 p-6">
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide" role="tablist">
          {lesson.signs.map((sign, index) => (
            <button
              key={sign.id}
              onClick={() => {
                if (!showingPractice) {
                  setCurrentSignIndex(index);
                }
              }}
              className={`flex-shrink-0 w-20 h-20 rounded-xl border-2 flex items-center justify-center transition-all ${
                index === currentSignIndex
                  ? 'border-blue-500 bg-blue-600/20'
                  : completedSigns.includes(sign.id)
                  ? 'border-green-600 bg-green-600/20'
                  : 'border-gray-700 bg-gray-900'
              }`}
              disabled={showingPractice}
              role="tab"
              aria-selected={index === currentSignIndex}
              aria-label={`${sign.word}${completedSigns.includes(sign.id) ? ', completed' : ''}`}
            >
              {completedSigns.includes(sign.id) ? (
                <CheckCircle2 className="w-6 h-6 text-green-500" />
              ) : (
                <span className="text-sm font-semibold text-gray-400">{index + 1}</span>
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
