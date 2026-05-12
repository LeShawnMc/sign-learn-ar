import { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, 
  Brain,
  Clock,
  CheckCircle,
  AlertCircle,
  TrendingUp,
  Play,
  ChevronRight,
  Star,
  RotateCcw,
  Zap,
  Calendar,
  BarChart3,
  BookOpen,
  Target,
  Award,
  Sparkles,
  ArrowRight,
  Check,
  XCircle as XCircleIcon,
  Volume2,
  Eye,
  Shuffle,
  Filter
} from 'lucide-react';
import { useApp } from '../context/AppContext';

type CardStatus = 'new' | 'learning' | 'struggling' | 'mastered';
type ReviewMode = 'recognition' | 'production' | 'mixed' | 'timed';

interface VocabularyCard {
  id: string;
  sign: string;
  description: string;
  category: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  status: CardStatus;
  lastReviewed?: string;
  dueDate: string;
  correctStreak: number;
  totalReviews: number;
  successRate: number;
  interval: number; // days until next review
}

interface StudySet {
  id: string;
  name: string;
  description: string;
  cardCount: number;
  icon: string;
  color: string;
}

interface QuizMode {
  id: ReviewMode;
  name: string;
  description: string;
  icon: any;
  duration?: string;
}

interface VocabularyReviewProps {
  onExit: () => void;
}

export function VocabularyReview({ onExit }: VocabularyReviewProps) {
  const { selectedLanguage } = useApp();
  const [currentView, setCurrentView] = useState<'overview' | 'review' | 'results'>('overview');
  const [selectedCards, setSelectedCards] = useState<VocabularyCard[]>([]);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [reviewResults, setReviewResults] = useState<{ correct: number; incorrect: number }>({ correct: 0, incorrect: 0 });
  const [filterStatus, setFilterStatus] = useState<CardStatus | 'all'>('all');

  // Comprehensive vocabulary cards with spaced repetition data
  const allCards: VocabularyCard[] = [
    // Due Today - Struggling
    {
      id: 'card-1',
      sign: 'Hello',
      description: 'Wave hand with open palm',
      category: 'Greetings',
      difficulty: 'beginner',
      status: 'struggling',
      lastReviewed: '2024-01-10',
      dueDate: '2024-01-11',
      correctStreak: 1,
      totalReviews: 8,
      successRate: 37,
      interval: 1,
    },
    {
      id: 'card-2',
      sign: 'Thank You',
      description: 'Touch chin with flat hand, move forward',
      category: 'Greetings',
      difficulty: 'beginner',
      status: 'struggling',
      lastReviewed: '2024-01-10',
      dueDate: '2024-01-11',
      correctStreak: 0,
      totalReviews: 6,
      successRate: 33,
      interval: 1,
    },
    {
      id: 'card-3',
      sign: 'Please',
      description: 'Circular motion on chest with flat hand',
      category: 'Greetings',
      difficulty: 'beginner',
      status: 'struggling',
      lastReviewed: '2024-01-09',
      dueDate: '2024-01-11',
      correctStreak: 1,
      totalReviews: 5,
      successRate: 40,
      interval: 2,
    },

    // Due Today - Learning
    {
      id: 'card-4',
      sign: 'Sorry',
      description: 'Rub fist in circular motion on chest',
      category: 'Greetings',
      difficulty: 'beginner',
      status: 'learning',
      lastReviewed: '2024-01-08',
      dueDate: '2024-01-11',
      correctStreak: 3,
      totalReviews: 7,
      successRate: 71,
      interval: 3,
    },
    {
      id: 'card-5',
      sign: 'Yes',
      description: 'Nod fist like nodding head',
      category: 'Common Words',
      difficulty: 'beginner',
      status: 'learning',
      lastReviewed: '2024-01-07',
      dueDate: '2024-01-11',
      correctStreak: 4,
      totalReviews: 6,
      successRate: 83,
      interval: 4,
    },
    {
      id: 'card-6',
      sign: 'No',
      description: 'Snap index and middle finger to thumb',
      category: 'Common Words',
      difficulty: 'beginner',
      status: 'learning',
      lastReviewed: '2024-01-08',
      dueDate: '2024-01-11',
      correctStreak: 3,
      totalReviews: 5,
      successRate: 80,
      interval: 3,
    },

    // This Week - Learning
    {
      id: 'card-7',
      sign: 'Good',
      description: 'Touch chin with flat hand, move down to other hand',
      category: 'Adjectives',
      difficulty: 'beginner',
      status: 'learning',
      lastReviewed: '2024-01-09',
      dueDate: '2024-01-13',
      correctStreak: 2,
      totalReviews: 4,
      successRate: 75,
      interval: 4,
    },
    {
      id: 'card-8',
      sign: 'Bad',
      description: 'Touch chin with flat hand, turn down sharply',
      category: 'Adjectives',
      difficulty: 'beginner',
      status: 'learning',
      lastReviewed: '2024-01-08',
      dueDate: '2024-01-14',
      correctStreak: 3,
      totalReviews: 5,
      successRate: 80,
      interval: 6,
    },
    {
      id: 'card-9',
      sign: 'Happy',
      description: 'Brush chest upward with open hand repeatedly',
      category: 'Emotions',
      difficulty: 'beginner',
      status: 'learning',
      lastReviewed: '2024-01-07',
      dueDate: '2024-01-12',
      correctStreak: 4,
      totalReviews: 6,
      successRate: 83,
      interval: 5,
    },
    {
      id: 'card-10',
      sign: 'Sad',
      description: 'Drag both hands down in front of face',
      category: 'Emotions',
      difficulty: 'beginner',
      status: 'learning',
      lastReviewed: '2024-01-06',
      dueDate: '2024-01-13',
      correctStreak: 5,
      totalReviews: 7,
      successRate: 86,
      interval: 7,
    },

    // New Cards
    {
      id: 'card-11',
      sign: 'Water',
      description: 'W handshape tapped at chin',
      category: 'Food & Drink',
      difficulty: 'beginner',
      status: 'new',
      dueDate: '2024-01-11',
      correctStreak: 0,
      totalReviews: 0,
      successRate: 0,
      interval: 0,
    },
    {
      id: 'card-12',
      sign: 'Coffee',
      description: 'Grinding motion with S handshapes',
      category: 'Food & Drink',
      difficulty: 'beginner',
      status: 'new',
      dueDate: '2024-01-11',
      correctStreak: 0,
      totalReviews: 0,
      successRate: 0,
      interval: 0,
    },
    {
      id: 'card-13',
      sign: 'Eat',
      description: 'Flat O handshape to mouth repeatedly',
      category: 'Food & Drink',
      difficulty: 'beginner',
      status: 'new',
      dueDate: '2024-01-11',
      correctStreak: 0,
      totalReviews: 0,
      successRate: 0,
      interval: 0,
    },
    {
      id: 'card-14',
      sign: 'Drink',
      description: 'C handshape tipped toward mouth',
      category: 'Food & Drink',
      difficulty: 'beginner',
      status: 'new',
      dueDate: '2024-01-11',
      correctStreak: 0,
      totalReviews: 0,
      successRate: 0,
      interval: 0,
    },

    // Mastered Cards (not due)
    {
      id: 'card-15',
      sign: 'Love',
      description: 'Cross arms over chest',
      category: 'Emotions',
      difficulty: 'beginner',
      status: 'mastered',
      lastReviewed: '2023-12-15',
      dueDate: '2024-01-25',
      correctStreak: 12,
      totalReviews: 15,
      successRate: 93,
      interval: 30,
    },
    {
      id: 'card-16',
      sign: 'Friend',
      description: 'Interlock index fingers twice',
      category: 'Relationships',
      difficulty: 'beginner',
      status: 'mastered',
      lastReviewed: '2023-12-20',
      dueDate: '2024-01-30',
      correctStreak: 15,
      totalReviews: 18,
      successRate: 94,
      interval: 40,
    },
    {
      id: 'card-17',
      sign: 'Family',
      description: 'F handshapes in circle motion',
      category: 'Relationships',
      difficulty: 'beginner',
      status: 'mastered',
      lastReviewed: '2023-12-18',
      dueDate: '2024-02-01',
      correctStreak: 10,
      totalReviews: 12,
      successRate: 92,
      interval: 35,
    },
    {
      id: 'card-18',
      sign: 'Work',
      description: 'Tap S handshape on opposite wrist',
      category: 'Activities',
      difficulty: 'intermediate',
      status: 'mastered',
      lastReviewed: '2023-12-10',
      dueDate: '2024-01-20',
      correctStreak: 8,
      totalReviews: 10,
      successRate: 90,
      interval: 25,
    },

    // More Learning Cards
    {
      id: 'card-19',
      sign: 'School',
      description: 'Clap hands together twice',
      category: 'Education',
      difficulty: 'beginner',
      status: 'learning',
      lastReviewed: '2024-01-09',
      dueDate: '2024-01-15',
      correctStreak: 2,
      totalReviews: 4,
      successRate: 75,
      interval: 6,
    },
    {
      id: 'card-20',
      sign: 'Book',
      description: 'Open palms like opening a book',
      category: 'Education',
      difficulty: 'beginner',
      status: 'learning',
      lastReviewed: '2024-01-08',
      dueDate: '2024-01-14',
      correctStreak: 3,
      totalReviews: 5,
      successRate: 80,
      interval: 6,
    },
    {
      id: 'card-21',
      sign: 'Learn',
      description: 'Grab from flat hand to head',
      category: 'Education',
      difficulty: 'beginner',
      status: 'learning',
      lastReviewed: '2024-01-10',
      dueDate: '2024-01-16',
      correctStreak: 1,
      totalReviews: 3,
      successRate: 67,
      interval: 6,
    },
    {
      id: 'card-22',
      sign: 'Teach',
      description: 'Move O handshapes forward from head',
      category: 'Education',
      difficulty: 'intermediate',
      status: 'learning',
      lastReviewed: '2024-01-09',
      dueDate: '2024-01-15',
      correctStreak: 2,
      totalReviews: 4,
      successRate: 75,
      interval: 6,
    },
    {
      id: 'card-23',
      sign: 'Help',
      description: 'Fist on flat palm, lift together',
      category: 'Common Words',
      difficulty: 'beginner',
      status: 'learning',
      lastReviewed: '2024-01-07',
      dueDate: '2024-01-12',
      correctStreak: 4,
      totalReviews: 6,
      successRate: 83,
      interval: 5,
    },
    {
      id: 'card-24',
      sign: 'Want',
      description: 'Pull open hands toward body',
      category: 'Common Words',
      difficulty: 'beginner',
      status: 'learning',
      lastReviewed: '2024-01-08',
      dueDate: '2024-01-13',
      correctStreak: 3,
      totalReviews: 5,
      successRate: 80,
      interval: 5,
    },
  ];

  // Calculate statistics
  const today = '2024-01-11';
  const dueToday = allCards.filter(card => card.dueDate === today);
  const dueThisWeek = allCards.filter(card => {
    const cardDate = new Date(card.dueDate);
    const todayDate = new Date(today);
    const weekLater = new Date(todayDate);
    weekLater.setDate(weekLater.getDate() + 7);
    return cardDate > todayDate && cardDate <= weekLater;
  });
  const masteredCards = allCards.filter(card => card.status === 'mastered');
  const learningCards = allCards.filter(card => card.status === 'learning');
  const strugglingCards = allCards.filter(card => card.status === 'struggling');
  const newCards = allCards.filter(card => card.status === 'new');

  // Custom study sets
  const studySets: StudySet[] = [
    {
      id: 'set-1',
      name: 'Basic Greetings',
      description: 'Essential greetings and polite phrases',
      cardCount: allCards.filter(c => c.category === 'Greetings').length,
      icon: '👋',
      color: 'from-blue-600 to-blue-800',
    },
    {
      id: 'set-2',
      name: 'Emotions & Feelings',
      description: 'Express how you feel in sign language',
      cardCount: allCards.filter(c => c.category === 'Emotions').length,
      icon: '😊',
      color: 'from-purple-600 to-purple-800',
    },
    {
      id: 'set-3',
      name: 'Food & Dining',
      description: 'Signs related to food and eating',
      cardCount: allCards.filter(c => c.category === 'Food & Drink').length,
      icon: '🍽️',
      color: 'from-green-600 to-green-800',
    },
    {
      id: 'set-4',
      name: 'Education & Learning',
      description: 'School and learning-related vocabulary',
      cardCount: allCards.filter(c => c.category === 'Education').length,
      icon: '📚',
      color: 'from-orange-600 to-orange-800',
    },
    {
      id: 'set-5',
      name: 'Struggling Cards',
      description: 'Focus on cards you find difficult',
      cardCount: strugglingCards.length,
      icon: '💪',
      color: 'from-red-600 to-red-800',
    },
    {
      id: 'set-6',
      name: 'Review Mastered',
      description: 'Reinforce cards you know well',
      cardCount: masteredCards.length,
      icon: '⭐',
      color: 'from-yellow-600 to-yellow-800',
    },
  ];

  // Quiz modes
  const quizModes: QuizMode[] = [
    {
      id: 'recognition',
      name: 'Recognition Mode',
      description: 'See the sign name, recall the movement',
      icon: Eye,
    },
    {
      id: 'production',
      name: 'Production Mode',
      description: 'See the description, name the sign',
      icon: Brain,
    },
    {
      id: 'mixed',
      name: 'Mixed Review',
      description: 'Combination of recognition and production',
      icon: Shuffle,
    },
    {
      id: 'timed',
      name: 'Timed Challenge',
      description: 'Race against the clock - 30 seconds per card',
      icon: Zap,
      duration: '30s per card',
    },
  ];

  const startReview = (cards: VocabularyCard[]) => {
    setSelectedCards(cards);
    setCurrentCardIndex(0);
    setShowAnswer(false);
    setReviewResults({ correct: 0, incorrect: 0 });
    setCurrentView('review');
  };

  const handleAnswer = (correct: boolean) => {
    setReviewResults(prev => ({
      correct: prev.correct + (correct ? 1 : 0),
      incorrect: prev.incorrect + (correct ? 0 : 1),
    }));

    if (currentCardIndex < selectedCards.length - 1) {
      setCurrentCardIndex(prev => prev + 1);
      setShowAnswer(false);
    } else {
      setCurrentView('results');
    }
  };

  const getStatusColor = (status: CardStatus) => {
    switch (status) {
      case 'mastered':
        return 'bg-green-600/20 text-green-500';
      case 'learning':
        return 'bg-blue-600/20 text-blue-500';
      case 'struggling':
        return 'bg-red-600/20 text-red-500';
      case 'new':
        return 'bg-gray-600/20 text-gray-400';
      default:
        return 'bg-gray-600/20 text-gray-400';
    }
  };

  const getStatusIcon = (status: CardStatus) => {
    switch (status) {
      case 'mastered':
        return <CheckCircle className="w-4 h-4" />;
      case 'learning':
        return <TrendingUp className="w-4 h-4" />;
      case 'struggling':
        return <AlertCircle className="w-4 h-4" />;
      case 'new':
        return <Star className="w-4 h-4" />;
      default:
        return null;
    }
  };

  // Review Session
  if (currentView === 'review' && selectedCards.length > 0) {
    const currentCard = selectedCards[currentCardIndex];
    const progress = ((currentCardIndex + 1) / selectedCards.length) * 100;

    return (
      <div 
        className="min-h-screen bg-black text-white flex flex-col"
        role="main"
        aria-labelledby="review-title"
      >
        {/* Header */}
        <div className="p-6 pb-4">
          <div className="flex items-center justify-between mb-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setCurrentView('overview')}
              className="w-10 h-10 rounded-full hover:bg-gray-900"
              aria-label="Exit review"
            >
              <X className="w-5 h-5" />
            </Button>
            <div className="text-center">
              <h1 id="review-title" className="text-lg font-bold">
                Card {currentCardIndex + 1} of {selectedCards.length}
              </h1>
            </div>
            <div className="w-10" aria-hidden="true" />
          </div>

          {/* Progress Bar */}
          <div className="mb-4">
            <div className="h-2 bg-gray-900 rounded-full overflow-hidden" role="progressbar" aria-valuenow={progress} aria-valuemin={0} aria-valuemax={100}>
              <motion.div 
                className="h-full bg-blue-600"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>
          </div>
        </div>

        {/* Card Display */}
        <div className="flex-1 px-6 flex flex-col items-center justify-center">
          <motion.div
            key={currentCardIndex}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-md"
          >
            <div className="bg-gradient-to-br from-blue-600 to-blue-800 rounded-2xl p-8 mb-6 min-h-[300px] flex flex-col items-center justify-center text-center">
              <div className="text-5xl mb-6" aria-hidden="true">✋</div>
              <h2 className="text-3xl font-bold mb-4">{currentCard.sign}</h2>
              
              <AnimatePresence>
                {showAnswer && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="mt-4"
                  >
                    <p className="text-lg opacity-90 mb-3">{currentCard.description}</p>
                    <div className="flex items-center justify-center gap-2 text-sm">
                      <span className="px-3 py-1 bg-white/20 rounded-full">
                        {currentCard.category}
                      </span>
                      <span className="px-3 py-1 bg-white/20 rounded-full capitalize">
                        {currentCard.difficulty}
                      </span>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {!showAnswer ? (
              <Button
                onClick={() => setShowAnswer(true)}
                className="w-full bg-gray-900 hover:bg-gray-800 h-14 text-lg font-semibold rounded-full"
                aria-label="Show answer"
              >
                <Eye className="w-5 h-5 mr-2" />
                Show Answer
              </Button>
            ) : (
              <div className="grid grid-cols-2 gap-3">
                <Button
                  onClick={() => handleAnswer(false)}
                  className="bg-red-600 hover:bg-red-700 h-14 text-lg font-semibold rounded-full"
                  aria-label="Mark as incorrect"
                >
                  <XCircleIcon className="w-5 h-5 mr-2" />
                  Again
                </Button>
                <Button
                  onClick={() => handleAnswer(true)}
                  className="bg-green-600 hover:bg-green-700 h-14 text-lg font-semibold rounded-full"
                  aria-label="Mark as correct"
                >
                  <Check className="w-5 h-5 mr-2" />
                  Got It
                </Button>
              </div>
            )}
          </motion.div>

          {/* Card Stats */}
          <div className="mt-6 text-center text-sm text-gray-400">
            <div className="flex items-center justify-center gap-4">
              <div>
                <div className="font-semibold text-white">{currentCard.successRate}%</div>
                <div>Success Rate</div>
              </div>
              <div>
                <div className="font-semibold text-white">{currentCard.correctStreak}</div>
                <div>Streak</div>
              </div>
              <div>
                <div className="font-semibold text-white">{currentCard.totalReviews}</div>
                <div>Reviews</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Results Screen
  if (currentView === 'results') {
    const totalCards = reviewResults.correct + reviewResults.incorrect;
    const accuracy = totalCards > 0 ? Math.round((reviewResults.correct / totalCards) * 100) : 0;

    return (
      <div 
        className="min-h-screen bg-black text-white flex flex-col"
        role="main"
        aria-labelledby="results-title"
      >
        {/* Header */}
        <div className="p-6 flex items-center justify-between">
          <h1 id="results-title" className="text-2xl font-bold">Review Complete!</h1>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setCurrentView('overview')}
            className="w-10 h-10 rounded-full hover:bg-gray-900"
            aria-label="Back to overview"
          >
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* Results */}
        <div className="flex-1 px-6 pb-6 flex flex-col items-center justify-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", duration: 0.6 }}
            className="w-32 h-32 rounded-full bg-gradient-to-br from-green-600 to-green-800 flex items-center justify-center mb-6 text-6xl"
            aria-hidden="true"
          >
            {accuracy >= 80 ? '🎉' : accuracy >= 60 ? '👍' : '💪'}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-center mb-8"
          >
            <div className="text-5xl font-bold mb-2">{accuracy}%</div>
            <p className="text-xl text-gray-400">Accuracy</p>
          </motion.div>

          <div className="w-full max-w-md space-y-4 mb-8">
            <div className="bg-gray-900 rounded-xl p-5">
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-400">Correct</span>
                <span className="text-2xl font-bold text-green-500">{reviewResults.correct}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-400">Incorrect</span>
                <span className="text-2xl font-bold text-red-500">{reviewResults.incorrect}</span>
              </div>
            </div>

            <div className="bg-gradient-to-br from-blue-600/20 to-blue-800/20 border border-blue-600/30 rounded-xl p-5">
              <div className="flex items-start gap-3">
                <Sparkles className="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold mb-1">Keep it up!</h3>
                  <p className="text-sm text-gray-300">
                    {accuracy >= 80 
                      ? 'Excellent work! Your mastery is improving.' 
                      : accuracy >= 60 
                      ? 'Good progress! Review these cards again tomorrow.'
                      : 'Keep practicing! Repetition is key to mastery.'}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="w-full max-w-md space-y-3">
            <Button
              onClick={() => startReview(selectedCards)}
              className="w-full bg-blue-600 hover:bg-blue-700 h-14 text-lg font-semibold rounded-full"
              aria-label="Review again"
            >
              <RotateCcw className="w-5 h-5 mr-2" />
              Review Again
            </Button>
            <Button
              onClick={() => setCurrentView('overview')}
              variant="outline"
              className="w-full h-12 border-gray-700"
              aria-label="Back to overview"
            >
              Back to Overview
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Main Overview
  const filteredCards = filterStatus === 'all' ? allCards : allCards.filter(card => card.status === filterStatus);

  return (
    <div 
      className="min-h-screen bg-black text-white flex flex-col"
      role="main"
      aria-labelledby="vocabulary-title"
    >
      {/* Header */}
      <div className="p-6 pb-4">
        <div className="flex items-center justify-between mb-6">
          <h1 id="vocabulary-title" className="text-2xl font-bold">Vocabulary Review</h1>
          <Button
            variant="ghost"
            size="icon"
            onClick={onExit}
            className="w-10 h-10 rounded-full hover:bg-gray-900"
            aria-label="Close vocabulary review"
          >
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
            className="bg-gradient-to-br from-red-600 to-red-800 rounded-xl p-4 text-center"
          >
            <div className="text-3xl font-bold mb-1">{dueToday.length}</div>
            <div className="text-sm opacity-90">Due Today</div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="bg-gradient-to-br from-blue-600 to-blue-800 rounded-xl p-4 text-center"
          >
            <div className="text-3xl font-bold mb-1">{learningCards.length}</div>
            <div className="text-sm opacity-90">Learning</div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
            className="bg-gradient-to-br from-green-600 to-green-800 rounded-xl p-4 text-center"
          >
            <div className="text-3xl font-bold mb-1">{masteredCards.length}</div>
            <div className="text-sm opacity-90">Mastered</div>
          </motion.div>
        </div>

        {/* Start Review Button */}
        {dueToday.length > 0 && (
          <Button
            onClick={() => startReview(dueToday)}
            className="w-full bg-blue-600 hover:bg-blue-700 h-14 text-lg font-semibold rounded-full mb-6"
            aria-label={`Start review - ${dueToday.length} cards due today`}
          >
            <Play className="w-5 h-5 mr-2" />
            Start Review ({dueToday.length} cards)
          </Button>
        )}
      </div>

      <div className="flex-1 px-6 pb-6 overflow-y-auto">
        {/* Due Today Section */}
        {dueToday.length > 0 && (
          <div className="mb-6">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-lg font-semibold">Due Today</h2>
              <span className="text-sm text-gray-400">{dueToday.length} cards</span>
            </div>
            <div className="space-y-2">
              {dueToday.slice(0, 5).map((card, index) => (
                <motion.div
                  key={card.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="bg-gray-900 rounded-xl p-4"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold">{card.sign}</h3>
                        <span className={`text-xs px-2 py-0.5 rounded-full flex items-center gap-1 ${getStatusColor(card.status)}`}>
                          {getStatusIcon(card.status)}
                          {card.status.charAt(0).toUpperCase() + card.status.slice(1)}
                        </span>
                      </div>
                      <p className="text-sm text-gray-400 line-clamp-1">{card.description}</p>
                      <div className="flex items-center gap-3 mt-2 text-xs text-gray-500">
                        <span>{card.successRate}% success</span>
                        <span>•</span>
                        <span>{card.correctStreak} streak</span>
                      </div>
                    </div>
                    <ChevronRight className="w-5 h-5 text-gray-600" />
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* This Week Section */}
        {dueThisWeek.length > 0 && (
          <div className="mb-6">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-lg font-semibold">This Week</h2>
              <span className="text-sm text-gray-400">{dueThisWeek.length} cards</span>
            </div>
            <div className="space-y-2">
              {dueThisWeek.slice(0, 4).map((card, index) => (
                <motion.div
                  key={card.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="bg-gray-900 rounded-xl p-4"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold">{card.sign}</h3>
                        <span className={`text-xs px-2 py-0.5 rounded-full ${getStatusColor(card.status)}`}>
                          {card.status.charAt(0).toUpperCase() + card.status.slice(1)}
                        </span>
                      </div>
                      <p className="text-sm text-gray-400 line-clamp-1">{card.description}</p>
                      <div className="flex items-center gap-2 mt-2 text-xs text-gray-500">
                        <Calendar className="w-3 h-3" />
                        <span>Due {card.dueDate}</span>
                      </div>
                    </div>
                    <ChevronRight className="w-5 h-5 text-gray-600" />
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* Custom Study Sets */}
        <div className="mb-6">
          <h2 className="text-lg font-semibold mb-3">Custom Study Sets</h2>
          <div className="grid grid-cols-2 gap-3">
            {studySets.map((set, index) => (
              <motion.button
                key={set.id}
                onClick={() => {
                  const setCards = set.id === 'set-5' 
                    ? strugglingCards 
                    : set.id === 'set-6'
                    ? masteredCards
                    : allCards.filter(c => c.category === set.name.split(' ')[0] || c.category.includes(set.name.split(' ')[0]));
                  if (setCards.length > 0) startReview(setCards);
                }}
                className={`bg-gradient-to-br ${set.color} rounded-xl p-4 text-left hover:opacity-90 transition-opacity`}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.05 }}
                aria-label={`${set.name} - ${set.cardCount} cards`}
              >
                <div className="text-3xl mb-2" aria-hidden="true">{set.icon}</div>
                <h3 className="font-semibold mb-1 text-sm">{set.name}</h3>
                <p className="text-xs opacity-80 mb-2 line-clamp-2">{set.description}</p>
                <div className="text-xs opacity-90">{set.cardCount} cards</div>
              </motion.button>
            ))}
          </div>
        </div>

        {/* Quiz Mode Selection */}
        <div className="mb-6">
          <h2 className="text-lg font-semibold mb-3">Quiz Modes</h2>
          <div className="space-y-2">
            {quizModes.map((mode, index) => {
              const Icon = mode.icon;
              return (
                <motion.button
                  key={mode.id}
                  onClick={() => {
                    if (dueToday.length > 0) {
                      startReview(dueToday);
                    }
                  }}
                  className="w-full bg-gray-900 rounded-xl p-4 text-left hover:bg-gray-800 transition-colors"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  aria-label={mode.name}
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-blue-600/20 flex items-center justify-center flex-shrink-0">
                      <Icon className="w-6 h-6 text-blue-500" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold mb-1">{mode.name}</h3>
                      <p className="text-sm text-gray-400">{mode.description}</p>
                      {mode.duration && (
                        <div className="flex items-center gap-1 mt-1 text-xs text-gray-500">
                          <Clock className="w-3 h-3" />
                          <span>{mode.duration}</span>
                        </div>
                      )}
                    </div>
                    <ChevronRight className="w-5 h-5 text-gray-600" />
                  </div>
                </motion.button>
              );
            })}
          </div>
        </div>

        {/* Status Categories */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-semibold">By Learning Status</h2>
          </div>
          <div className="space-y-3">
            {/* Struggling */}
            <div className="bg-gray-900 rounded-xl p-4">
              <div className="mb-2">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <AlertCircle className="w-5 h-5 text-red-500" />
                    <h3 className="font-semibold">Struggling</h3>
                  </div>
                  <span className="text-sm text-gray-400">{strugglingCards.length} cards</span>
                </div>
                <p className="text-sm text-gray-400 mb-2">Cards you're finding difficult</p>
                {strugglingCards.length > 0 && (
                  <Button
                    onClick={() => startReview(strugglingCards)}
                    size="sm"
                    className="bg-red-600 hover:bg-red-700"
                    aria-label="Practice struggling cards"
                  >
                    Practice Now
                  </Button>
                )}
              </div>
            </div>

            {/* Learning */}
            <div className="bg-gray-900 rounded-xl p-4">
              <div className="mb-2">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-blue-500" />
                    <h3 className="font-semibold">Learning</h3>
                  </div>
                  <span className="text-sm text-gray-400">{learningCards.length} cards</span>
                </div>
                <p className="text-sm text-gray-400 mb-2">Cards you're currently learning</p>
                {learningCards.length > 0 && (
                  <Button
                    onClick={() => startReview(learningCards)}
                    size="sm"
                    className="bg-blue-600 hover:bg-blue-700"
                    aria-label="Review learning cards"
                  >
                    Review
                  </Button>
                )}
              </div>
            </div>

            {/* Mastered */}
            <div className="bg-gray-900 rounded-xl p-4">
              <div className="mb-2">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <h3 className="font-semibold">Mastered</h3>
                  </div>
                  <span className="text-sm text-gray-400">{masteredCards.length} cards</span>
                </div>
                <p className="text-sm text-gray-400 mb-2">Cards you know well</p>
                {masteredCards.length > 0 && (
                  <Button
                    onClick={() => startReview(masteredCards)}
                    size="sm"
                    className="bg-green-600 hover:bg-green-700"
                    aria-label="Review mastered cards"
                  >
                    Keep Sharp
                  </Button>
                )}
              </div>
            </div>

            {/* New */}
            {newCards.length > 0 && (
              <div className="bg-gray-900 rounded-xl p-4">
                <div className="mb-2">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Star className="w-5 h-5 text-gray-400" />
                      <h3 className="font-semibold">New Cards</h3>
                    </div>
                    <span className="text-sm text-gray-400">{newCards.length} cards</span>
                  </div>
                  <p className="text-sm text-gray-400 mb-2">Cards you haven't learned yet</p>
                  <Button
                    onClick={() => startReview(newCards)}
                    size="sm"
                    className="bg-gray-700 hover:bg-gray-600"
                    aria-label="Start learning new cards"
                  >
                    Start Learning
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}