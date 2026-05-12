import { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { useTheme } from '../context/ThemeContext';
import { useApp } from '../context/AppContext';
import { motion, AnimatePresence } from 'motion/react';
import { X, BookOpen, Zap, User, Eye, ChevronRight, Check, RotateCcw, Play, Pause, Trophy, Star, ArrowLeft } from 'lucide-react';

interface FingerspellingPracticeProps {
  onExit: () => void;
}

type PracticeMode = 'menu' | 'alphabet' | 'speed-drill' | 'name-spelling' | 'reception';

// Real ASL Alphabet data
const aslAlphabet = [
  { letter: 'A', description: 'Closed fist with thumb to the side', hint: 'Make a fist, thumb alongside' },
  { letter: 'B', description: 'Flat hand, fingers together, thumb across palm', hint: 'Flat hand, thumb tucked in' },
  { letter: 'C', description: 'Curved hand forming a C shape', hint: 'Curve your hand like the letter C' },
  { letter: 'D', description: 'Index finger up, other fingers touch thumb', hint: 'Point up with index, make circle with others' },
  { letter: 'E', description: 'Fingers curled down to touch palm, thumb across', hint: 'Curl all fingers down' },
  { letter: 'F', description: 'Index and thumb form circle, other fingers up', hint: 'OK sign with other fingers up' },
  { letter: 'G', description: 'Index and thumb out horizontal, point sideways', hint: 'Point index and thumb sideways' },
  { letter: 'H', description: 'Index and middle finger horizontal together', hint: 'Two fingers pointing sideways' },
  { letter: 'I', description: 'Pinky finger up, other fingers down', hint: 'Just the pinky up' },
  { letter: 'J', description: 'Pinky up, draw a J in the air', hint: 'Pinky traces a J shape' },
  { letter: 'K', description: 'Index up, middle out, thumb between them', hint: 'Index and middle form a K' },
  { letter: 'L', description: 'Index up, thumb out forming an L', hint: 'Make an L with thumb and index' },
  { letter: 'M', description: 'Thumb under first three fingers', hint: 'Three fingers over the thumb' },
  { letter: 'N', description: 'Thumb under first two fingers', hint: 'Two fingers over the thumb' },
  { letter: 'O', description: 'All fingers and thumb form a circle', hint: 'Make an O shape with all fingers' },
  { letter: 'P', description: 'Like K but pointing down', hint: 'K pointing downward' },
  { letter: 'Q', description: 'Like G but pointing down', hint: 'G pointing downward' },
  { letter: 'R', description: 'Index and middle crossed', hint: 'Cross your first two fingers' },
  { letter: 'S', description: 'Closed fist with thumb across fingers', hint: 'Fist with thumb in front' },
  { letter: 'T', description: 'Thumb between index and middle', hint: 'Thumb pokes between fingers' },
  { letter: 'U', description: 'Index and middle together, pointing up', hint: 'Two fingers together, up' },
  { letter: 'V', description: 'Index and middle apart, pointing up', hint: 'Peace sign' },
  { letter: 'W', description: 'Index, middle, and ring up and apart', hint: 'Three fingers up and spread' },
  { letter: 'X', description: 'Index bent like a hook', hint: 'Crooked index finger' },
  { letter: 'Y', description: 'Thumb and pinky out, others down', hint: 'Hang loose / shaka sign' },
  { letter: 'Z', description: 'Index draws a Z in the air', hint: 'Trace a Z with your finger' },
];

// Common practice words
const practiceWords = [
  'HELLO', 'WORLD', 'FRIEND', 'FAMILY', 'HAPPY', 'LOVE', 'PEACE', 'SMILE',
  'THANK', 'PLEASE', 'SORRY', 'HELP', 'GOOD', 'YES', 'NO', 'WELCOME',
  'NAME', 'SIGN', 'LEARN', 'PRACTICE', 'TEACH', 'STUDENT', 'DEAF', 'HEAR',
];

// Common names for practice
const commonNames = [
  'ALEX', 'EMMA', 'NOAH', 'OLIVIA', 'LIAM', 'AVA', 'ETHAN', 'SOPHIA',
  'MASON', 'MIA', 'LUCAS', 'LILY', 'JACK', 'ELLA', 'RYAN', 'GRACE',
];

export function FingerspellingPractice({ onExit }: FingerspellingPracticeProps) {
  const { theme } = useTheme();
  const { userProgress } = useApp();
  const [mode, setMode] = useState<PracticeMode>('menu');
  const [currentLetterIndex, setCurrentLetterIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60);
  const [isTimerActive, setIsTimerActive] = useState(false);
  const [currentWord, setCurrentWord] = useState('');
  const [userInput, setUserInput] = useState('');
  const [completedLetters, setCompletedLetters] = useState<string[]>([]);
  const [showHint, setShowHint] = useState(false);
  const [receptionWord, setReceptionWord] = useState('');
  const [receptionLetterIndex, setReceptionLetterIndex] = useState(0);
  const [showReceptionResult, setShowReceptionResult] = useState(false);
  const [receptionScore, setReceptionScore] = useState(0);
  const [totalAttempts, setTotalAttempts] = useState(0);

  // Theme-aware colors
  const colors = theme === 'dark'
    ? {
        bg: '#0F0F23',
        cardBg: '#1E1E3F',
        cardHover: '#252541',
        textPrimary: '#F8FAFC',
        textSecondary: '#94A3B8',
        textTertiary: '#64748B',
        border: 'rgba(148, 163, 184, 0.2)',
        iconBg: 'rgba(0, 245, 255, 0.1)',
        iconColor: '#00F5FF',
        successBg: 'rgba(34, 197, 94, 0.1)',
        successColor: '#22C55E',
        warningBg: 'rgba(251, 146, 60, 0.1)',
        warningColor: '#FB923C',
        blur: 'none',
        shadow: 'none',
        glassBorder: 'none',
      }
    : {
        bg: 'linear-gradient(135deg, #E0F2FE 0%, #EDE9FE 50%, #FCE7F3 100%)',
        cardBg: 'rgba(255, 255, 255, 0.6)',
        cardHover: 'rgba(255, 255, 255, 0.8)',
        textPrimary: '#0F172A',
        textSecondary: '#334155',
        textTertiary: '#64748B',
        border: 'rgba(255, 255, 255, 0.6)',
        iconBg: 'rgba(14, 165, 233, 0.12)',
        iconColor: '#0EA5E9',
        successBg: 'rgba(34, 197, 94, 0.1)',
        successColor: '#22C55E',
        warningBg: 'rgba(251, 146, 60, 0.1)',
        warningColor: '#FB923C',
        blur: 'blur(20px)',
        shadow: '0 8px 32px rgba(31, 38, 135, 0.15)',
        glassBorder: '1px solid rgba(255, 255, 255, 0.6)',
      };

  // Timer for speed drill
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isTimerActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setIsTimerActive(false);
    }
    return () => clearInterval(interval);
  }, [isTimerActive, timeLeft]);

  // Initialize practice modes
  useEffect(() => {
    if (mode === 'speed-drill') {
      setCurrentWord(practiceWords[Math.floor(Math.random() * practiceWords.length)]);
      setUserInput('');
      setTimeLeft(60);
    } else if (mode === 'name-spelling') {
      setCurrentWord(commonNames[Math.floor(Math.random() * commonNames.length)]);
      setUserInput('');
    } else if (mode === 'reception') {
      const word = practiceWords[Math.floor(Math.random() * practiceWords.length)];
      setReceptionWord(word);
      setReceptionLetterIndex(0);
      setShowReceptionResult(false);
    }
  }, [mode]);

  const handleNextLetter = () => {
    if (currentLetterIndex < aslAlphabet.length - 1) {
      setCurrentLetterIndex(currentLetterIndex + 1);
      setShowHint(false);
      if (!completedLetters.includes(aslAlphabet[currentLetterIndex].letter)) {
        setCompletedLetters([...completedLetters, aslAlphabet[currentLetterIndex].letter]);
      }
    }
  };

  const handlePreviousLetter = () => {
    if (currentLetterIndex > 0) {
      setCurrentLetterIndex(currentLetterIndex - 1);
      setShowHint(false);
    }
  };

  const handleMarkLearned = () => {
    const currentLetter = aslAlphabet[currentLetterIndex].letter;
    if (!completedLetters.includes(currentLetter)) {
      setCompletedLetters([...completedLetters, currentLetter]);
    }
    if (currentLetterIndex < aslAlphabet.length - 1) {
      handleNextLetter();
    }
  };

  const handleSpeedDrillSubmit = () => {
    if (userInput.toUpperCase() === currentWord) {
      setScore(score + 1);
      setStreak(streak + 1);
    } else {
      setStreak(0);
    }
    setCurrentWord(practiceWords[Math.floor(Math.random() * practiceWords.length)]);
    setUserInput('');
  };

  const handleNameSpellingCheck = () => {
    setTotalAttempts(totalAttempts + 1);
    if (userInput.toUpperCase() === currentWord) {
      setScore(score + 1);
      setStreak(streak + 1);
      setTimeout(() => {
        setCurrentWord(commonNames[Math.floor(Math.random() * commonNames.length)]);
        setUserInput('');
      }, 1500);
    } else {
      setStreak(0);
    }
  };

  const handleReceptionGuess = (guess: string) => {
    setShowReceptionResult(true);
    setTotalAttempts(totalAttempts + 1);
    if (guess.toUpperCase() === receptionWord) {
      setReceptionScore(receptionScore + 1);
      setStreak(streak + 1);
      setTimeout(() => {
        const word = practiceWords[Math.floor(Math.random() * practiceWords.length)];
        setReceptionWord(word);
        setReceptionLetterIndex(0);
        setShowReceptionResult(false);
      }, 2000);
    } else {
      setStreak(0);
      setTimeout(() => {
        const word = practiceWords[Math.floor(Math.random() * practiceWords.length)];
        setReceptionWord(word);
        setReceptionLetterIndex(0);
        setShowReceptionResult(false);
      }, 2000);
    }
  };

  const handleReceptionReplay = () => {
    setReceptionLetterIndex(0);
    setShowReceptionResult(false);
  };

  const resetMode = () => {
    setScore(0);
    setStreak(0);
    setTimeLeft(60);
    setIsTimerActive(false);
    setUserInput('');
    setTotalAttempts(0);
    setReceptionScore(0);
  };

  // Auto-play reception letters
  useEffect(() => {
    if (mode === 'reception' && !showReceptionResult && receptionLetterIndex < receptionWord.length) {
      const timer = setTimeout(() => {
        setReceptionLetterIndex(receptionLetterIndex + 1);
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [mode, receptionLetterIndex, receptionWord, showReceptionResult]);

  const practiceModesData = [
    {
      id: 'alphabet',
      title: 'Alphabet Learning',
      description: 'Learn all 26 letters at your own pace',
      icon: BookOpen,
      color: 'from-purple-600 to-purple-800',
      stats: `${completedLetters.length}/26 letters learned`,
    },
    {
      id: 'speed-drill',
      title: 'Speed Drills',
      description: 'Test your fingerspelling speed',
      icon: Zap,
      color: 'from-orange-600 to-orange-800',
      stats: 'Best: 12 words/min',
    },
    {
      id: 'name-spelling',
      title: 'Name Spelling',
      description: 'Practice spelling common names',
      icon: User,
      color: 'from-blue-600 to-blue-800',
      stats: `${score} names spelled correctly`,
    },
    {
      id: 'reception',
      title: 'Reception Practice',
      description: 'Practice reading fingerspelling',
      icon: Eye,
      color: 'from-green-600 to-green-800',
      stats: `${receptionScore} words recognized`,
    },
  ];

  // Menu Screen
  if (mode === 'menu') {
    return (
      <div 
        className="h-full flex flex-col"
        style={{ background: colors.bg, color: colors.textPrimary }}
        role="main"
        aria-labelledby="fingerspelling-title"
      >
        {/* Header */}
        <div 
          className="p-4 sm:p-6 border-b flex items-center justify-between"
          style={{ borderBottomColor: colors.border }}
        >
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <Button
              variant="ghost"
              size="icon"
              onClick={onExit}
              className="flex-shrink-0"
              style={{ color: colors.textSecondary }}
              aria-label="Go back"
            >
              <X className="w-6 h-6" />
            </Button>
            <div className="min-w-0 flex-1">
              <h1 
                id="fingerspelling-title" 
                className="text-xl sm:text-2xl font-bold truncate"
                style={{ fontFamily: 'Poppins, sans-serif' }}
              >
                Fingerspelling Practice
              </h1>
              <p className="text-sm truncate" style={{ color: colors.textSecondary }}>
                Master the ASL alphabet
              </p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6">
          {/* Progress Overview */}
          <motion.div
            className="rounded-xl p-5 mb-6"
            style={{
              background: `linear-gradient(135deg, ${theme === 'dark' ? '#00F5FF' : '#0EA5E9'} 0%, ${theme === 'dark' ? '#A78BFA' : '#8B5CF6'} 100%)`,
            }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            role="region"
            aria-label="Progress overview"
          >
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-lg font-semibold" style={{ color: theme === 'dark' ? '#0F0F23' : '#FFFFFF' }}>
                  Your Progress
                </h2>
                <p className="text-sm" style={{ color: theme === 'dark' ? 'rgba(15, 15, 35, 0.8)' : 'rgba(255, 255, 255, 0.9)' }}>
                  Keep practicing to improve!
                </p>
              </div>
              <Trophy className="w-10 h-10" style={{ color: theme === 'dark' ? '#0F0F23' : '#FFFFFF' }} aria-hidden="true" />
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <div className="text-2xl font-bold" style={{ color: theme === 'dark' ? '#0F0F23' : '#FFFFFF' }}>
                  {completedLetters.length}
                </div>
                <div className="text-xs" style={{ color: theme === 'dark' ? 'rgba(15, 15, 35, 0.7)' : 'rgba(255, 255, 255, 0.8)' }}>
                  Letters Learned
                </div>
              </div>
              <div>
                <div className="text-2xl font-bold" style={{ color: theme === 'dark' ? '#0F0F23' : '#FFFFFF' }}>
                  {score}
                </div>
                <div className="text-xs" style={{ color: theme === 'dark' ? 'rgba(15, 15, 35, 0.7)' : 'rgba(255, 255, 255, 0.8)' }}>
                  Total Score
                </div>
              </div>
              <div>
                <div className="text-2xl font-bold" style={{ color: theme === 'dark' ? '#0F0F23' : '#FFFFFF' }}>
                  {streak}
                </div>
                <div className="text-xs" style={{ color: theme === 'dark' ? 'rgba(15, 15, 35, 0.7)' : 'rgba(255, 255, 255, 0.8)' }}>
                  Current Streak
                </div>
              </div>
            </div>
          </motion.div>

          {/* Practice Modes */}
          <h2 className="text-lg font-semibold mb-4">Practice Modes</h2>
          <div className="space-y-3">
            {practiceModesData.map((practiceMode, index) => {
              const Icon = practiceMode.icon;
              return (
                <motion.button
                  key={practiceMode.id}
                  onClick={() => {
                    setMode(practiceMode.id as PracticeMode);
                    resetMode();
                  }}
                  className="w-full rounded-xl p-5 text-left transition-all"
                  style={{
                    background: colors.cardBg,
                    backdropFilter: colors.blur,
                    WebkitBackdropFilter: colors.blur,
                    border: colors.glassBorder,
                    boxShadow: colors.shadow,
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.background = colors.cardHover}
                  onMouseLeave={(e) => e.currentTarget.style.background = colors.cardBg}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  aria-label={`${practiceMode.title}: ${practiceMode.description}. ${practiceMode.stats}`}
                >
                  <div className="flex items-center gap-4">
                    <div 
                      className={`w-14 h-14 rounded-xl flex items-center justify-center bg-gradient-to-br ${practiceMode.color}`}
                      aria-hidden="true"
                    >
                      <Icon className="w-7 h-7 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold mb-1" style={{ color: colors.textPrimary }}>
                        {practiceMode.title}
                      </h3>
                      <p className="text-sm mb-2" style={{ color: colors.textSecondary }}>
                        {practiceMode.description}
                      </p>
                      <div className="flex items-center gap-2 text-xs" style={{ color: colors.textTertiary }}>
                        <Star className="w-3 h-3" aria-hidden="true" />
                        <span>{practiceMode.stats}</span>
                      </div>
                    </div>
                    <ChevronRight className="w-5 h-5 flex-shrink-0" style={{ color: colors.textTertiary }} aria-hidden="true" />
                  </div>
                </motion.button>
              );
            })}
          </div>

          {/* Tips Section */}
          <div 
            className="mt-6 rounded-xl p-4"
            style={{ 
              background: colors.iconBg,
              border: `1px solid ${colors.border}`,
            }}
            role="region"
            aria-label="Practice tips"
          >
            <h3 className="font-semibold mb-2 flex items-center gap-2" style={{ color: colors.textPrimary }}>
              <span className="text-lg" aria-hidden="true">💡</span>
              Practice Tips
            </h3>
            <ul className="space-y-2 text-sm" style={{ color: colors.textSecondary }}>
              <li className="flex items-start gap-2">
                <span className="flex-shrink-0" aria-hidden="true">•</span>
                <span>Practice 10-15 minutes daily for best results</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="flex-shrink-0" aria-hidden="true">•</span>
                <span>Focus on hand shape and position accuracy</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="flex-shrink-0" aria-hidden="true">•</span>
                <span>Start slow and gradually increase speed</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="flex-shrink-0" aria-hidden="true">•</span>
                <span>Use a mirror to check your form</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    );
  }

  // Alphabet Learning Mode
  if (mode === 'alphabet') {
    const currentLetter = aslAlphabet[currentLetterIndex];
    const progress = ((currentLetterIndex + 1) / aslAlphabet.length) * 100;

    return (
      <div 
        className="h-full flex flex-col"
        style={{ background: colors.bg, color: colors.textPrimary }}
        role="main"
        aria-labelledby="alphabet-title"
      >
        {/* Header */}
        <div 
          className="p-4 sm:p-6 border-b"
          style={{ borderBottomColor: colors.border }}
        >
          <div className="flex items-center gap-3 mb-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setMode('menu')}
              style={{ color: colors.textSecondary }}
              aria-label="Back to menu"
            >
              <ArrowLeft className="w-6 h-6" />
            </Button>
            <div className="flex-1 min-w-0">
              <h1 id="alphabet-title" className="text-xl font-bold" style={{ fontFamily: 'Poppins, sans-serif' }}>
                Alphabet Learning
              </h1>
              <p className="text-sm" style={{ color: colors.textSecondary }}>
                Letter {currentLetterIndex + 1} of {aslAlphabet.length}
              </p>
            </div>
          </div>

          {/* Progress Bar */}
          <div 
            className="h-2 rounded-full overflow-hidden"
            style={{ background: theme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)' }}
            role="progressbar"
            aria-valuenow={currentLetterIndex + 1}
            aria-valuemin={1}
            aria-valuemax={aslAlphabet.length}
            aria-label={`Progress: ${currentLetterIndex + 1} of ${aslAlphabet.length} letters`}
          >
            <motion.div
              className="h-full"
              style={{ background: colors.iconColor }}
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentLetter.letter}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.3 }}
            >
              {/* Letter Display */}
              <div 
                className="rounded-2xl p-8 mb-6 text-center"
                style={{
                  background: `linear-gradient(135deg, ${theme === 'dark' ? '#A78BFA' : '#8B5CF6'} 0%, ${theme === 'dark' ? '#00F5FF' : '#0EA5E9'} 100%)`,
                }}
                role="region"
                aria-label={`Letter ${currentLetter.letter}`}
              >
                <div className="text-8xl font-bold mb-4" style={{ color: theme === 'dark' ? '#0F0F23' : '#FFFFFF' }}>
                  {currentLetter.letter}
                </div>
                <div className="text-lg font-semibold" style={{ color: theme === 'dark' ? '#0F0F23' : '#FFFFFF' }}>
                  Letter {currentLetter.letter}
                </div>
              </div>

              {/* Description */}
              <div 
                className="rounded-xl p-5 mb-4"
                style={{
                  background: colors.cardBg,
                  backdropFilter: colors.blur,
                  WebkitBackdropFilter: colors.blur,
                  border: colors.glassBorder,
                  boxShadow: colors.shadow,
                }}
              >
                <h3 className="font-semibold mb-2" style={{ color: colors.textPrimary }}>
                  How to Sign
                </h3>
                <p className="text-sm leading-relaxed" style={{ color: colors.textSecondary }}>
                  {currentLetter.description}
                </p>
              </div>

              {/* Hint */}
              <div 
                className="rounded-xl p-4 mb-6"
                style={{
                  background: colors.warningBg,
                  border: `1px solid ${colors.warningColor}20`,
                }}
              >
                <button
                  onClick={() => setShowHint(!showHint)}
                  className="w-full flex items-center justify-between"
                  aria-expanded={showHint}
                  aria-controls="hint-content"
                >
                  <span className="font-semibold" style={{ color: colors.warningColor }}>
                    💡 Quick Tip
                  </span>
                  <ChevronRight 
                    className={`w-5 h-5 transition-transform ${showHint ? 'rotate-90' : ''}`}
                    style={{ color: colors.warningColor }}
                    aria-hidden="true"
                  />
                </button>
                {showHint && (
                  <motion.p
                    id="hint-content"
                    className="text-sm mt-2"
                    style={{ color: colors.textSecondary }}
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                  >
                    {currentLetter.hint}
                  </motion.p>
                )}
              </div>

              {/* Completion Status */}
              {completedLetters.includes(currentLetter.letter) && (
                <motion.div
                  className="rounded-xl p-4 mb-6 flex items-center gap-3"
                  style={{
                    background: colors.successBg,
                    border: `1px solid ${colors.successColor}20`,
                  }}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  role="status"
                  aria-live="polite"
                >
                  <Check className="w-5 h-5 flex-shrink-0" style={{ color: colors.successColor }} aria-hidden="true" />
                  <span className="font-semibold" style={{ color: colors.successColor }}>
                    Marked as Learned!
                  </span>
                </motion.div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Footer Actions */}
        <div 
          className="p-4 sm:p-6 border-t"
          style={{ borderTopColor: colors.border }}
        >
          <div className="flex gap-3 mb-3">
            <Button
              variant="outline"
              onClick={handlePreviousLetter}
              disabled={currentLetterIndex === 0}
              className="flex-1 h-12 rounded-full font-semibold"
              style={{
                background: colors.cardBg,
                borderColor: colors.border,
                color: colors.textPrimary,
                opacity: currentLetterIndex === 0 ? 0.5 : 1,
              }}
              aria-label="Previous letter"
            >
              Previous
            </Button>
            <Button
              onClick={handleNextLetter}
              disabled={currentLetterIndex === aslAlphabet.length - 1}
              className="flex-1 h-12 rounded-full font-semibold"
              style={{
                background: colors.iconColor,
                color: theme === 'dark' ? '#0F0F23' : '#FFFFFF',
                opacity: currentLetterIndex === aslAlphabet.length - 1 ? 0.5 : 1,
              }}
              aria-label="Next letter"
            >
              Next
            </Button>
          </div>
          
          {!completedLetters.includes(currentLetter.letter) && (
            <Button
              onClick={handleMarkLearned}
              className="w-full h-12 rounded-full font-semibold"
              style={{
                background: colors.successColor,
                color: '#FFFFFF',
              }}
              aria-label="Mark letter as learned"
            >
              <Check className="w-5 h-5 mr-2" aria-hidden="true" />
              Mark as Learned
            </Button>
          )}
        </div>
      </div>
    );
  }

  // Speed Drill Mode
  if (mode === 'speed-drill') {
    return (
      <div 
        className="h-full flex flex-col"
        style={{ background: colors.bg, color: colors.textPrimary }}
        role="main"
        aria-labelledby="speed-drill-title"
      >
        {/* Header */}
        <div 
          className="p-4 sm:p-6 border-b"
          style={{ borderBottomColor: colors.border }}
        >
          <div className="flex items-center gap-3 mb-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setMode('menu')}
              style={{ color: colors.textSecondary }}
              aria-label="Back to menu"
            >
              <ArrowLeft className="w-6 h-6" />
            </Button>
            <div className="flex-1">
              <h1 id="speed-drill-title" className="text-xl font-bold" style={{ fontFamily: 'Poppins, sans-serif' }}>
                Speed Drill
              </h1>
              <p className="text-sm" style={{ color: colors.textSecondary }}>
                Type the word as fast as you can
              </p>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-3">
            <div 
              className="rounded-lg p-3 text-center"
              style={{
                background: colors.cardBg,
                backdropFilter: colors.blur,
                WebkitBackdropFilter: colors.blur,
              }}
            >
              <div className="text-2xl font-bold" style={{ color: colors.iconColor }}>
                {timeLeft}s
              </div>
              <div className="text-xs" style={{ color: colors.textSecondary }}>Time Left</div>
            </div>
            <div 
              className="rounded-lg p-3 text-center"
              style={{
                background: colors.cardBg,
                backdropFilter: colors.blur,
                WebkitBackdropFilter: colors.blur,
              }}
            >
              <div className="text-2xl font-bold" style={{ color: colors.successColor }}>
                {score}
              </div>
              <div className="text-xs" style={{ color: colors.textSecondary }}>Score</div>
            </div>
            <div 
              className="rounded-lg p-3 text-center"
              style={{
                background: colors.cardBg,
                backdropFilter: colors.blur,
                WebkitBackdropFilter: colors.blur,
              }}
            >
              <div className="text-2xl font-bold" style={{ color: colors.warningColor }}>
                {streak}
              </div>
              <div className="text-xs" style={{ color: colors.textSecondary }}>Streak</div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 flex flex-col items-center justify-center">
          {!isTimerActive ? (
            <motion.div
              className="text-center"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              <div className="mb-6">
                <Zap className="w-20 h-20 mx-auto mb-4" style={{ color: colors.iconColor }} aria-hidden="true" />
                <h2 className="text-2xl font-bold mb-2" style={{ color: colors.textPrimary }}>
                  Ready to Start?
                </h2>
                <p className="text-sm" style={{ color: colors.textSecondary }}>
                  You'll have 60 seconds to spell as many words as possible
                </p>
              </div>
              <Button
                onClick={() => setIsTimerActive(true)}
                className="h-14 px-8 rounded-full font-semibold text-lg"
                style={{
                  background: colors.iconColor,
                  color: theme === 'dark' ? '#0F0F23' : '#FFFFFF',
                }}
                aria-label="Start speed drill"
              >
                <Play className="w-6 h-6 mr-2" aria-hidden="true" />
                Start Drill
              </Button>
            </motion.div>
          ) : timeLeft > 0 ? (
            <motion.div
              className="w-full max-w-md"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              {/* Current Word */}
              <div 
                className="rounded-2xl p-8 mb-6 text-center"
                style={{
                  background: `linear-gradient(135deg, ${theme === 'dark' ? '#FB923C' : '#F97316'} 0%, ${theme === 'dark' ? '#F59E0B' : '#F59E0B'} 100%)`,
                }}
              >
                <div className="text-5xl font-bold tracking-wider" style={{ color: theme === 'dark' ? '#0F0F23' : '#FFFFFF' }}>
                  {currentWord}
                </div>
              </div>

              {/* Input */}
              <div className="mb-4">
                <label htmlFor="speed-input" className="sr-only">
                  Type the word
                </label>
                <input
                  id="speed-input"
                  type="text"
                  value={userInput}
                  onChange={(e) => setUserInput(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      handleSpeedDrillSubmit();
                    }
                  }}
                  className="w-full h-14 rounded-full px-6 text-lg text-center font-semibold"
                  style={{
                    background: colors.cardBg,
                    border: `2px solid ${colors.border}`,
                    color: colors.textPrimary,
                  }}
                  placeholder="Type here..."
                  autoFocus
                  autoComplete="off"
                />
              </div>

              <Button
                onClick={handleSpeedDrillSubmit}
                className="w-full h-12 rounded-full font-semibold"
                style={{
                  background: colors.iconColor,
                  color: theme === 'dark' ? '#0F0F23' : '#FFFFFF',
                }}
                aria-label="Submit word"
              >
                Submit
              </Button>

              {/* Feedback */}
              {userInput.toUpperCase() === currentWord && userInput.length > 0 && (
                <motion.div
                  className="mt-4 text-center"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  role="status"
                  aria-live="polite"
                >
                  <span className="text-2xl" aria-label="Correct">✓</span>
                </motion.div>
              )}
            </motion.div>
          ) : (
            <motion.div
              className="text-center"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              <Trophy className="w-20 h-20 mx-auto mb-4" style={{ color: colors.successColor }} aria-hidden="true" />
              <h2 className="text-2xl font-bold mb-2" style={{ color: colors.textPrimary }}>
                Time's Up!
              </h2>
              <p className="text-lg mb-1" style={{ color: colors.textSecondary }}>
                You spelled <span className="font-bold" style={{ color: colors.iconColor }}>{score}</span> words correctly
              </p>
              <p className="text-sm mb-6" style={{ color: colors.textTertiary }}>
                Words per minute: {score}
              </p>
              <Button
                onClick={() => {
                  resetMode();
                  setIsTimerActive(true);
                }}
                className="h-12 px-8 rounded-full font-semibold"
                style={{
                  background: colors.iconColor,
                  color: theme === 'dark' ? '#0F0F23' : '#FFFFFF',
                }}
                aria-label="Try again"
              >
                <RotateCcw className="w-5 h-5 mr-2" aria-hidden="true" />
                Try Again
              </Button>
            </motion.div>
          )}
        </div>
      </div>
    );
  }

  // Name Spelling Mode
  if (mode === 'name-spelling') {
    const isCorrect = userInput.toUpperCase() === currentWord;

    return (
      <div 
        className="h-full flex flex-col"
        style={{ background: colors.bg, color: colors.textPrimary }}
        role="main"
        aria-labelledby="name-spelling-title"
      >
        {/* Header */}
        <div 
          className="p-4 sm:p-6 border-b"
          style={{ borderBottomColor: colors.border }}
        >
          <div className="flex items-center gap-3 mb-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setMode('menu')}
              style={{ color: colors.textSecondary }}
              aria-label="Back to menu"
            >
              <ArrowLeft className="w-6 h-6" />
            </Button>
            <div className="flex-1">
              <h1 id="name-spelling-title" className="text-xl font-bold" style={{ fontFamily: 'Poppins, sans-serif' }}>
                Name Spelling
              </h1>
              <p className="text-sm" style={{ color: colors.textSecondary }}>
                Practice spelling common names
              </p>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-3">
            <div 
              className="rounded-lg p-3 text-center"
              style={{
                background: colors.cardBg,
                backdropFilter: colors.blur,
                WebkitBackdropFilter: colors.blur,
              }}
            >
              <div className="text-2xl font-bold" style={{ color: colors.successColor }}>
                {score}
              </div>
              <div className="text-xs" style={{ color: colors.textSecondary }}>Correct</div>
            </div>
            <div 
              className="rounded-lg p-3 text-center"
              style={{
                background: colors.cardBg,
                backdropFilter: colors.blur,
                WebkitBackdropFilter: colors.blur,
              }}
            >
              <div className="text-2xl font-bold" style={{ color: colors.warningColor }}>
                {streak}
              </div>
              <div className="text-xs" style={{ color: colors.textSecondary }}>Streak</div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 flex flex-col items-center justify-center">
          <motion.div
            className="w-full max-w-md"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            {/* Instruction */}
            <div className="text-center mb-6">
              <User className="w-16 h-16 mx-auto mb-4" style={{ color: colors.iconColor }} aria-hidden="true" />
              <h2 className="text-xl font-semibold mb-2" style={{ color: colors.textPrimary }}>
                Spell this name:
              </h2>
            </div>

            {/* Name to Spell */}
            <div 
              className="rounded-2xl p-8 mb-6 text-center"
              style={{
                background: `linear-gradient(135deg, ${theme === 'dark' ? '#3B82F6' : '#2563EB'} 0%, ${theme === 'dark' ? '#1D4ED8' : '#1E40AF'} 100%)`,
              }}
            >
              <div className="text-5xl font-bold tracking-wider" style={{ color: theme === 'dark' ? '#0F0F23' : '#FFFFFF' }}>
                {currentWord}
              </div>
            </div>

            {/* Letter-by-letter display */}
            <div className="flex justify-center gap-2 mb-6 flex-wrap">
              {currentWord.split('').map((letter, index) => (
                <div
                  key={index}
                  className="w-10 h-10 rounded-lg flex items-center justify-center font-bold text-sm"
                  style={{
                    background: userInput[index]?.toUpperCase() === letter 
                      ? colors.successBg 
                      : colors.cardBg,
                    border: `2px solid ${userInput[index]?.toUpperCase() === letter 
                      ? colors.successColor 
                      : colors.border}`,
                    color: colors.textPrimary,
                  }}
                  aria-label={`Letter ${index + 1}: ${letter}${userInput[index]?.toUpperCase() === letter ? ', correct' : ''}`}
                >
                  {userInput[index]?.toUpperCase() || ''}
                </div>
              ))}
            </div>

            {/* Input */}
            <div className="mb-4">
              <label htmlFor="name-input" className="sr-only">
                Type the name
              </label>
              <input
                id="name-input"
                type="text"
                value={userInput}
                onChange={(e) => setUserInput(e.target.value.toUpperCase())}
                maxLength={currentWord.length}
                className="w-full h-14 rounded-full px-6 text-lg text-center font-semibold tracking-wider"
                style={{
                  background: colors.cardBg,
                  border: `2px solid ${isCorrect && userInput.length === currentWord.length ? colors.successColor : colors.border}`,
                  color: colors.textPrimary,
                }}
                placeholder="Type the name..."
                autoFocus
                autoComplete="off"
              />
            </div>

            <div className="flex gap-3">
              <Button
                onClick={handleNameSpellingCheck}
                disabled={userInput.length !== currentWord.length}
                className="flex-1 h-12 rounded-full font-semibold"
                style={{
                  background: userInput.length === currentWord.length ? colors.iconColor : colors.cardBg,
                  color: userInput.length === currentWord.length 
                    ? (theme === 'dark' ? '#0F0F23' : '#FFFFFF')
                    : colors.textSecondary,
                  opacity: userInput.length !== currentWord.length ? 0.5 : 1,
                }}
                aria-label="Check answer"
              >
                Check
              </Button>
              <Button
                onClick={() => setUserInput('')}
                variant="outline"
                className="h-12 px-6 rounded-full font-semibold"
                style={{
                  background: colors.cardBg,
                  borderColor: colors.border,
                  color: colors.textPrimary,
                }}
                aria-label="Clear input"
              >
                <RotateCcw className="w-5 h-5" aria-hidden="true" />
              </Button>
            </div>

            {/* Feedback */}
            <AnimatePresence>
              {isCorrect && userInput.length === currentWord.length && (
                <motion.div
                  className="mt-4 rounded-xl p-4 text-center"
                  style={{
                    background: colors.successBg,
                    border: `1px solid ${colors.successColor}20`,
                  }}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  role="status"
                  aria-live="polite"
                >
                  <Check className="w-8 h-8 mx-auto mb-2" style={{ color: colors.successColor }} aria-hidden="true" />
                  <p className="font-semibold" style={{ color: colors.successColor }}>
                    Perfect! Next name coming up...
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </div>
    );
  }

  // Reception Practice Mode
  if (mode === 'reception') {
    const currentDisplayLetter = receptionLetterIndex < receptionWord.length 
      ? receptionWord[receptionLetterIndex] 
      : '';

    return (
      <div 
        className="h-full flex flex-col"
        style={{ background: colors.bg, color: colors.textPrimary }}
        role="main"
        aria-labelledby="reception-title"
      >
        {/* Header */}
        <div 
          className="p-4 sm:p-6 border-b"
          style={{ borderBottomColor: colors.border }}
        >
          <div className="flex items-center gap-3 mb-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setMode('menu')}
              style={{ color: colors.textSecondary }}
              aria-label="Back to menu"
            >
              <ArrowLeft className="w-6 h-6" />
            </Button>
            <div className="flex-1">
              <h1 id="reception-title" className="text-xl font-bold" style={{ fontFamily: 'Poppins, sans-serif' }}>
                Reception Practice
              </h1>
              <p className="text-sm" style={{ color: colors.textSecondary }}>
                Read and identify fingerspelled words
              </p>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-3">
            <div 
              className="rounded-lg p-3 text-center"
              style={{
                background: colors.cardBg,
                backdropFilter: colors.blur,
                WebkitBackdropFilter: colors.blur,
              }}
            >
              <div className="text-2xl font-bold" style={{ color: colors.successColor }}>
                {receptionScore}
              </div>
              <div className="text-xs" style={{ color: colors.textSecondary }}>Correct</div>
            </div>
            <div 
              className="rounded-lg p-3 text-center"
              style={{
                background: colors.cardBg,
                backdropFilter: colors.blur,
                WebkitBackdropFilter: colors.blur,
              }}
            >
              <div className="text-2xl font-bold" style={{ color: colors.iconColor }}>
                {totalAttempts}
              </div>
              <div className="text-xs" style={{ color: colors.textSecondary }}>Total</div>
            </div>
            <div 
              className="rounded-lg p-3 text-center"
              style={{
                background: colors.cardBg,
                backdropFilter: colors.blur,
                WebkitBackdropFilter: colors.blur,
              }}
            >
              <div className="text-2xl font-bold" style={{ color: colors.warningColor }}>
                {streak}
              </div>
              <div className="text-xs" style={{ color: colors.textSecondary }}>Streak</div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6">
          {!showReceptionResult ? (
            <div className="h-full flex flex-col">
              {/* Instruction */}
              <div className="text-center mb-6">
                <Eye className="w-16 h-16 mx-auto mb-4" style={{ color: colors.iconColor }} aria-hidden="true" />
                <h2 className="text-xl font-semibold mb-2" style={{ color: colors.textPrimary }}>
                  Watch the letters
                </h2>
                <p className="text-sm" style={{ color: colors.textSecondary }}>
                  Pay attention to each letter being signed
                </p>
              </div>

              {/* Letter Display */}
              <div 
                className="flex-1 rounded-2xl p-12 mb-6 flex items-center justify-center"
                style={{
                  background: `linear-gradient(135deg, ${theme === 'dark' ? '#22C55E' : '#16A34A'} 0%, ${theme === 'dark' ? '#15803D' : '#15803D'} 100%)`,
                  minHeight: '250px',
                }}
                role="region"
                aria-live="polite"
                aria-label={`Displaying letter ${currentDisplayLetter || 'complete'}`}
              >
                <AnimatePresence mode="wait">
                  {receptionLetterIndex < receptionWord.length ? (
                    <motion.div
                      key={currentDisplayLetter}
                      initial={{ opacity: 0, scale: 0.8, rotateY: -90 }}
                      animate={{ opacity: 1, scale: 1, rotateY: 0 }}
                      exit={{ opacity: 0, scale: 0.8, rotateY: 90 }}
                      transition={{ duration: 0.4 }}
                      className="text-9xl font-bold"
                      style={{ color: theme === 'dark' ? '#0F0F23' : '#FFFFFF' }}
                    >
                      {currentDisplayLetter}
                    </motion.div>
                  ) : (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="text-center"
                    >
                      <Check className="w-20 h-20 mx-auto mb-4" style={{ color: theme === 'dark' ? '#0F0F23' : '#FFFFFF' }} aria-hidden="true" />
                      <p className="text-2xl font-bold" style={{ color: theme === 'dark' ? '#0F0F23' : '#FFFFFF' }}>
                        Complete!
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Progress Dots */}
              <div className="flex justify-center gap-2 mb-6" role="progressbar" aria-valuenow={receptionLetterIndex} aria-valuemax={receptionWord.length}>
                {receptionWord.split('').map((_, index) => (
                  <div
                    key={index}
                    className="w-2 h-2 rounded-full"
                    style={{
                      background: index < receptionLetterIndex ? colors.iconColor : colors.border,
                    }}
                    aria-label={`Letter ${index + 1}${index < receptionLetterIndex ? ' completed' : ''}`}
                  />
                ))}
              </div>

              {/* Actions */}
              {receptionLetterIndex >= receptionWord.length && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-3"
                >
                  <p className="text-center font-semibold mb-4" style={{ color: colors.textPrimary }}>
                    What word did you see?
                  </p>
                  
                  <div className="grid grid-cols-2 gap-3">
                    {practiceWords.slice(0, 4).map((word) => (
                      <Button
                        key={word}
                        onClick={() => handleReceptionGuess(word)}
                        className="h-12 rounded-xl font-semibold"
                        style={{
                          background: colors.cardBg,
                          border: `2px solid ${colors.border}`,
                          color: colors.textPrimary,
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.background = colors.cardHover}
                        onMouseLeave={(e) => e.currentTarget.style.background = colors.cardBg}
                        aria-label={`Select ${word}`}
                      >
                        {word}
                      </Button>
                    ))}
                  </div>

                  <Button
                    onClick={handleReceptionReplay}
                    variant="outline"
                    className="w-full h-12 rounded-full font-semibold"
                    style={{
                      background: colors.cardBg,
                      borderColor: colors.border,
                      color: colors.textSecondary,
                    }}
                    aria-label="Watch again"
                  >
                    <RotateCcw className="w-5 h-5 mr-2" aria-hidden="true" />
                    Watch Again
                  </Button>
                </motion.div>
              )}
            </div>
          ) : (
            <motion.div
              className="h-full flex items-center justify-center"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              <div className="text-center">
                <div 
                  className="w-24 h-24 rounded-full mx-auto mb-6 flex items-center justify-center"
                  style={{
                    background: colors.successBg,
                  }}
                >
                  <Check className="w-12 h-12" style={{ color: colors.successColor }} aria-hidden="true" />
                </div>
                <h2 className="text-2xl font-bold mb-2" style={{ color: colors.textPrimary }}>
                  {receptionWord.split('').every((_, i) => receptionWord[i] === receptionWord[i]) ? 'Correct!' : 'Not quite'}
                </h2>
                <p className="text-lg mb-2" style={{ color: colors.textSecondary }}>
                  The word was: <span className="font-bold" style={{ color: colors.iconColor }}>{receptionWord}</span>
                </p>
                <p className="text-sm" style={{ color: colors.textTertiary }}>
                  Loading next word...
                </p>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    );
  }

  return null;
}
