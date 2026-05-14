import { useState, useRef } from 'react';
import { Button } from './ui/button';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, Play, CheckCircle2, Hand, Info, Trophy, Star, Volume2, VolumeX } from 'lucide-react';
import { useApp } from '../context/AppContext';
import type { Lesson } from '../types';

interface LessonDetailScreenProps {
  lesson: Lesson;
  onBack: () => void;
  onComplete?: (lessonId: string, score: number) => void;
}

export function LessonDetailScreen({ lesson, onBack, onComplete }: LessonDetailScreenProps) {
  const { completeLesson, practiceSign, updateSignMastery } = useApp();
  const [currentSignIndex, setCurrentSignIndex] = useState(0);
  const [showingPractice, setShowingPractice]   = useState(false);
  const [completedSigns, setCompletedSigns]     = useState<string[]>([]);
  const [showCompletionModal, setShowCompletionModal] = useState(false);
  const [muted, setMuted] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);

  const currentSign   = lesson.signs[currentSignIndex];
  const isLastSign    = currentSignIndex === lesson.signs.length - 1;
  const isCompleted   = completedSigns.includes(currentSign?.id ?? '');
  const progressPct   = Math.round((completedSigns.length / lesson.signs.length) * 100);

  const handleStartPractice = () => {
    setShowingPractice(true);
    practiceSign(currentSign.id);

    setTimeout(() => {
      const score = Math.floor(Math.random() * 25) + 75; // 75–100
      const updated = completedSigns.includes(currentSign.id)
        ? completedSigns
        : [...completedSigns, currentSign.id];

      setCompletedSigns(updated);
      updateSignMastery(currentSign.id, score);
      setShowingPractice(false);

      if (isLastSign && updated.length === lesson.signs.length) {
        finishLesson(updated.length, score);
      } else if (!isLastSign) {
        setTimeout(() => setCurrentSignIndex(i => i + 1), 400);
      }
    }, 3000);
  };

  const finishLesson = (done: number, score: number) => {
    const finalScore = Math.round((done / lesson.signs.length) * 100);
    completeLesson(lesson.id, finalScore);
    setShowCompletionModal(true);
    onComplete?.(lesson.id, score);
  };

  const handleNext = () => {
    if (!isLastSign) setCurrentSignIndex(i => i + 1);
    else if (completedSigns.length > 0) finishLesson(completedSigns.length, 80);
  };

  const handlePrevious = () => {
    if (currentSignIndex > 0) setCurrentSignIndex(i => i - 1);
  };

  const handleFinish = () => {
    setShowCompletionModal(false);
    onBack();
  };

  if (!currentSign) return null;

  return (
    <div className="min-h-screen bg-black text-white flex flex-col" role="main" aria-labelledby="lesson-title">

      {/* Completion Modal */}
      <AnimatePresence>
        {showCompletionModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-6"
            style={{ background: 'rgba(0,0,0,0.85)' }}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-gray-900 rounded-3xl p-8 max-w-sm w-full text-center border-2 border-blue-500"
            >
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center mx-auto mb-4">
                <Trophy className="w-10 h-10 text-white" />
              </div>
              <h2 className="text-2xl font-bold mb-2">Lesson Complete!</h2>
              <p className="text-gray-400 mb-4">{lesson.title}</p>
              <div className="flex items-center justify-center gap-2 mb-4">
                <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
                <span className="text-3xl font-bold text-blue-500">{progressPct}%</span>
                <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
              </div>
              <div className="bg-gray-800 rounded-xl p-4 mb-6">
                <div className="text-sm text-gray-400 mb-1">Signs Practiced</div>
                <div className="text-xl font-bold">{completedSigns.length} / {lesson.signs.length}</div>
              </div>
              <Button onClick={handleFinish} className="w-full bg-blue-600 hover:bg-blue-700 h-12 rounded-full font-semibold">
                Continue Learning
              </Button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <div className="p-6 border-b border-gray-800">
        <Button variant="ghost" size="icon" className="w-10 h-10 rounded-full hover:bg-gray-900 mb-4" onClick={onBack} aria-label="Back">
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <h1 id="lesson-title" className="text-2xl font-bold mb-1">{lesson.title}</h1>
        <p className="text-gray-400 text-sm mb-4">{lesson.description}</p>

        {/* Progress bar */}
        <div className="space-y-1">
          <div className="flex justify-between text-sm">
            <span className="text-gray-400">Sign {currentSignIndex + 1} of {lesson.signs.length}</span>
            <span className="text-blue-500 font-semibold">{progressPct}% complete</span>
          </div>
          <div className="h-2 bg-gray-800 rounded-full overflow-hidden" role="progressbar" aria-valuenow={progressPct} aria-valuemin={0} aria-valuemax={100}>
            <motion.div className="h-full bg-blue-500" animate={{ width: `${progressPct}%` }} transition={{ duration: 0.4 }} />
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 p-6 overflow-y-auto">
        <AnimatePresence mode="wait">
          {!showingPractice ? (
            <motion.div
              key={`sign-${currentSign.id}`}
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -40 }}
              className="flex flex-col"
            >
              {/* Sign heading */}
              <div className="mb-5">
                <div className="flex items-center gap-3 mb-2">
                  <h2 className="text-3xl font-bold">{currentSign.word}</h2>
                  {isCompleted && <CheckCircle2 className="w-7 h-7 text-green-500" aria-label="Practiced" />}
                </div>
                <span className="inline-block px-3 py-1 rounded-full bg-gray-800 text-gray-300 text-sm">{currentSign.category}</span>
              </div>

              {/* Video / Placeholder */}
              <div className="mb-5 w-full aspect-square max-w-sm mx-auto rounded-2xl bg-gray-900 border-2 border-gray-800 relative overflow-hidden">
                {currentSign.videoUrl ? (
                  <>
                    <video
                      ref={videoRef}
                      key={currentSign.videoUrl}
                      src={currentSign.videoUrl}
                      autoPlay
                      loop
                      playsInline
                      muted={muted}
                      className="w-full h-full object-cover"
                      aria-label={`Sign demonstration for ${currentSign.word}`}
                    />
                    <button
                      onClick={() => setMuted(m => !m)}
                      className="absolute bottom-3 right-3 w-9 h-9 rounded-full bg-black/60 flex items-center justify-center"
                      aria-label={muted ? 'Unmute video' : 'Mute video'}
                    >
                      {muted ? <VolumeX className="w-4 h-4 text-white" /> : <Volume2 className="w-4 h-4 text-white" />}
                    </button>
                  </>
                ) : (
                  <>
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 to-purple-600/10" />
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <Hand className="w-28 h-28 text-blue-500 mb-2" aria-hidden="true" />
                      <span className="text-xs text-gray-500">No video available</span>
                    </div>
                  </>
                )}
              </div>

              {/* How to sign */}
              <div className="bg-gray-900 rounded-2xl p-5 mb-4">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-blue-600/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Info className="w-4 h-4 text-blue-500" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">How to Sign</h3>
                    <p className="text-gray-400 text-sm leading-relaxed">{currentSign.description}</p>
                  </div>
                </div>
              </div>

              {/* Tip */}
              <div className="bg-blue-900/20 border border-blue-800/30 rounded-xl p-4 mb-6">
                <h4 className="font-semibold text-sm mb-1 text-blue-400">Practice Tip</h4>
                <p className="text-sm text-gray-400">
                  Keep your movements clear and deliberate. Facial expressions and precise hand placement are just as important as the hand shape itself.
                </p>
              </div>

              {/* Actions */}
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
                    className="flex-1 bg-gray-900 border-gray-700 hover:bg-gray-800 h-12 rounded-full disabled:opacity-40"
                    aria-label="Previous sign"
                  >
                    Previous
                  </Button>
                  <Button
                    onClick={handleNext}
                    variant="outline"
                    className="flex-1 bg-gray-900 border-gray-700 hover:bg-gray-800 h-12 rounded-full"
                    aria-label={isLastSign ? 'Finish lesson' : 'Next sign'}
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
              className="flex flex-col items-center justify-center min-h-64"
              role="status"
              aria-live="polite"
            >
              <div className="mb-8 w-56 h-56 rounded-2xl bg-gray-900 border-2 border-blue-500 flex items-center justify-center relative">
                <Hand className="w-28 h-28 text-blue-500" aria-hidden="true" />
                <motion.div
                  className="absolute inset-0 border-4 border-blue-500 rounded-2xl"
                  animate={{ scale: [1, 1.05, 1] }}
                  transition={{ repeat: Infinity, duration: 1.8 }}
                />
              </div>
              <h2 className="text-2xl font-bold mb-2">Practice: {currentSign.word}</h2>
              <p className="text-gray-400 mb-6 text-center max-w-xs">Mirror the sign shown above. Keep your hand shape clear and deliberate.</p>
              <div className="flex items-center gap-2 text-sm text-blue-400">
                <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
                Tracking your hand movement...
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Sign strip */}
      <div className="border-t border-gray-800 p-4">
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide" role="tablist">
          {lesson.signs.map((sign, index) => (
            <button
              key={sign.id}
              onClick={() => { if (!showingPractice) setCurrentSignIndex(index); }}
              disabled={showingPractice}
              className={`flex-shrink-0 w-16 h-16 rounded-xl border-2 flex flex-col items-center justify-center gap-1 transition-all ${
                index === currentSignIndex ? 'border-blue-500 bg-blue-600/20' :
                completedSigns.includes(sign.id)  ? 'border-green-600 bg-green-600/20' :
                'border-gray-700 bg-gray-900'
              }`}
              role="tab"
              aria-selected={index === currentSignIndex}
              aria-label={`${sign.word}${completedSigns.includes(sign.id) ? ', practiced' : ''}`}
            >
              {completedSigns.includes(sign.id) ? (
                <CheckCircle2 className="w-5 h-5 text-green-500" />
              ) : (
                <>
                  <Play className="w-3 h-3 text-gray-500" />
                  <span className="text-xs font-semibold text-gray-400 truncate max-w-[52px] px-1">{sign.word}</span>
                </>
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
