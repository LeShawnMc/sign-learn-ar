import { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, 
  Trophy,
  Clock,
  Target,
  Star,
  Zap,
  Award,
  ChevronRight,
  Play,
  RotateCw,
  Check,
  Search,
  Camera,
  MapPin,
  TrendingUp,
  Crown,
  Medal,
  Sparkles,
  CheckCircle2,
  Circle,
  Flame,
  Users,
  Share2,
  Home
} from 'lucide-react';
import { useApp } from '../context/AppContext';

type HuntStep = 
  | 'difficulty'
  | 'instructions'
  | 'gameplay'
  | 'progress'
  | 'results';

type Difficulty = 'easy' | 'medium' | 'hard';

interface ScavengerItem {
  id: string;
  name: string;
  signDescription: string;
  category: string;
  points: number;
  hint: string;
  found: boolean;
  timeFound?: number;
}

interface LeaderboardEntry {
  rank: number;
  name: string;
  score: number;
  time: string;
  difficulty: Difficulty;
  isCurrentUser?: boolean;
}

interface ARScavengerHuntProps {
  onExit: () => void;
}

export function ARScavengerHunt({ onExit }: ARScavengerHuntProps) {
  const { selectedLanguage } = useApp();
  const [currentStep, setCurrentStep] = useState<HuntStep>('difficulty');
  const [selectedDifficulty, setSelectedDifficulty] = useState<Difficulty>('medium');
  const [gameStarted, setGameStarted] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(300); // 5 minutes
  const [totalTime, setTotalTime] = useState(300);
  const [score, setScore] = useState(0);
  const [currentItemIndex, setCurrentItemIndex] = useState(0);
  const [showHint, setShowHint] = useState(false);
  const [gameComplete, setGameComplete] = useState(false);

  // Scavenger hunt items based on difficulty
  const getItemsForDifficulty = (difficulty: Difficulty): ScavengerItem[] => {
    const allItems = {
      easy: [
        {
          id: 'easy-1',
          name: 'Door',
          signDescription: 'Hold both hands flat, palms facing forward, then swing them open like a door',
          category: 'Home',
          points: 100,
          hint: 'Look for an entrance or exit in your space',
          found: false,
        },
        {
          id: 'easy-2',
          name: 'Chair',
          signDescription: 'Make a "C" shape with your dominant hand and tap it on top of your non-dominant hand twice',
          category: 'Furniture',
          points: 100,
          hint: 'Find something you sit on',
          found: false,
        },
        {
          id: 'easy-3',
          name: 'Table',
          signDescription: 'Rest your forearms together in front of you to represent a flat surface',
          category: 'Furniture',
          points: 100,
          hint: 'Look for a flat surface used for eating or working',
          found: false,
        },
        {
          id: 'easy-4',
          name: 'Book',
          signDescription: 'Place your palms together, then open them like opening a book',
          category: 'Objects',
          points: 100,
          hint: 'Find something with pages to read',
          found: false,
        },
        {
          id: 'easy-5',
          name: 'Cup',
          signDescription: 'Make a "C" shape with your hand and bring it to your mouth as if drinking',
          category: 'Kitchen',
          points: 100,
          hint: 'Look for something you drink from',
          found: false,
        },
      ],
      medium: [
        {
          id: 'med-1',
          name: 'Window',
          signDescription: 'Place one hand on top of the other, then move the top hand up and down like opening a window',
          category: 'Home',
          points: 150,
          hint: 'Find something that lets light in',
          found: false,
        },
        {
          id: 'med-2',
          name: 'Computer',
          signDescription: 'Tap your "C" hand on your non-dominant forearm twice',
          category: 'Technology',
          points: 150,
          hint: 'Look for a device with a screen and keyboard',
          found: false,
        },
        {
          id: 'med-3',
          name: 'Phone',
          signDescription: 'Hold your thumb and pinky extended, other fingers folded, bring to your ear',
          category: 'Technology',
          points: 150,
          hint: 'Find a device you use to make calls',
          found: false,
        },
        {
          id: 'med-4',
          name: 'Light',
          signDescription: 'Open your hand above your head, fingers spread, like light radiating',
          category: 'Home',
          points: 150,
          hint: 'Look for something that illuminates',
          found: false,
        },
        {
          id: 'med-5',
          name: 'Clock',
          signDescription: 'Tap your wrist with your finger, indicating where a watch would be',
          category: 'Objects',
          points: 150,
          hint: 'Find something that shows time',
          found: false,
        },
        {
          id: 'med-6',
          name: 'Picture',
          signDescription: 'Move your "C" hand from your cheek down to your palm',
          category: 'Decoration',
          points: 150,
          hint: 'Look for art hanging on a wall',
          found: false,
        },
        {
          id: 'med-7',
          name: 'Mirror',
          signDescription: 'Hold your hand up like a mirror and twist your wrist',
          category: 'Home',
          points: 150,
          hint: 'Find something that shows your reflection',
          found: false,
        },
      ],
      hard: [
        {
          id: 'hard-1',
          name: 'Refrigerator',
          signDescription: 'Make "R" handshapes with both hands and shake them as if shivering',
          category: 'Kitchen',
          points: 200,
          hint: 'Find a large appliance that keeps food cold',
          found: false,
        },
        {
          id: 'hard-2',
          name: 'Television',
          signDescription: 'Fingerspell T-V quickly',
          category: 'Technology',
          points: 200,
          hint: 'Look for a screen used for watching shows',
          found: false,
        },
        {
          id: 'hard-3',
          name: 'Microwave',
          signDescription: 'Make a circling motion with your hand at face level, like pressing buttons',
          category: 'Kitchen',
          points: 200,
          hint: 'Find an appliance that heats food quickly',
          found: false,
        },
        {
          id: 'hard-4',
          name: 'Calendar',
          signDescription: 'Move your dominant hand forward over your non-dominant palm',
          category: 'Objects',
          points: 200,
          hint: 'Look for something showing days and months',
          found: false,
        },
        {
          id: 'hard-5',
          name: 'Pillow',
          signDescription: 'Place both hands by your tilted head, like resting on a pillow',
          category: 'Bedroom',
          points: 200,
          hint: 'Find something soft you rest your head on',
          found: false,
        },
        {
          id: 'hard-6',
          name: 'Trash Can',
          signDescription: 'Make a throwing motion into your non-dominant hand held like a container',
          category: 'Home',
          points: 200,
          hint: 'Look for where you throw things away',
          found: false,
        },
        {
          id: 'hard-7',
          name: 'Plant',
          signDescription: 'Move your hand up through your other hand like a plant growing',
          category: 'Decoration',
          points: 200,
          hint: 'Find something green and living',
          found: false,
        },
        {
          id: 'hard-8',
          name: 'Keyboard',
          signDescription: 'Move your fingers as if typing on a keyboard',
          category: 'Technology',
          points: 200,
          hint: 'Look for what you type on',
          found: false,
        },
        {
          id: 'hard-9',
          name: 'Headphones',
          signDescription: 'Place both hands over your ears',
          category: 'Technology',
          points: 200,
          hint: 'Find something you wear to listen to music',
          found: false,
        },
        {
          id: 'hard-10',
          name: 'Backpack',
          signDescription: 'Move both hands over your shoulders like putting on straps',
          category: 'Objects',
          points: 200,
          hint: 'Look for a bag you carry on your back',
          found: false,
        },
      ],
    };

    return allItems[difficulty];
  };

  const [items, setItems] = useState<ScavengerItem[]>(getItemsForDifficulty('medium'));

  // Leaderboard data
  const leaderboard: LeaderboardEntry[] = [
    {
      rank: 1,
      name: 'Sarah M.',
      score: 1850,
      time: '3:42',
      difficulty: 'hard',
    },
    {
      rank: 2,
      name: 'Michael K.',
      score: 1620,
      time: '4:15',
      difficulty: 'hard',
    },
    {
      rank: 3,
      name: 'You',
      score: score,
      time: formatTime(totalTime - timeRemaining),
      difficulty: selectedDifficulty,
      isCurrentUser: true,
    },
    {
      rank: 4,
      name: 'Emma W.',
      score: 1240,
      time: '3:28',
      difficulty: 'medium',
    },
    {
      rank: 5,
      name: 'James P.',
      score: 1180,
      time: '4:50',
      difficulty: 'medium',
    },
    {
      rank: 6,
      name: 'Lisa R.',
      score: 980,
      time: '4:05',
      difficulty: 'medium',
    },
    {
      rank: 7,
      name: 'David T.',
      score: 850,
      time: '4:32',
      difficulty: 'easy',
    },
    {
      rank: 8,
      name: 'Anna K.',
      score: 720,
      time: '4:58',
      difficulty: 'easy',
    },
  ];

  useEffect(() => {
    if (gameStarted && timeRemaining > 0 && !gameComplete) {
      const timer = setInterval(() => {
        setTimeRemaining(prev => {
          if (prev <= 1) {
            setGameComplete(true);
            setCurrentStep('results');
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [gameStarted, timeRemaining, gameComplete]);

  function formatTime(seconds: number): string {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  }

  const handleDifficultySelect = (difficulty: Difficulty) => {
    setSelectedDifficulty(difficulty);
    const newItems = getItemsForDifficulty(difficulty);
    setItems(newItems);
    
    // Set time based on difficulty
    const timeMap = {
      easy: 300, // 5 minutes
      medium: 420, // 7 minutes
      hard: 600, // 10 minutes
    };
    setTotalTime(timeMap[difficulty]);
    setTimeRemaining(timeMap[difficulty]);
  };

  const handleStartGame = () => {
    setGameStarted(true);
    setCurrentStep('gameplay');
    setScore(0);
    setCurrentItemIndex(0);
    setItems(prev => prev.map(item => ({ ...item, found: false })));
  };

  const handleItemFound = () => {
    const currentItem = items[currentItemIndex];
    const timeBonus = Math.floor((timeRemaining / totalTime) * 50);
    const itemScore = currentItem.points + timeBonus;
    
    setScore(prev => prev + itemScore);
    
    setItems(prev => prev.map((item, idx) => 
      idx === currentItemIndex 
        ? { ...item, found: true, timeFound: totalTime - timeRemaining }
        : item
    ));

    if (currentItemIndex < items.length - 1) {
      setCurrentItemIndex(prev => prev + 1);
      setShowHint(false);
    } else {
      setGameComplete(true);
      setCurrentStep('results');
    }
  };

  const handleReplay = () => {
    setCurrentStep('difficulty');
    setGameStarted(false);
    setGameComplete(false);
    setScore(0);
    setCurrentItemIndex(0);
    setShowHint(false);
    setTimeRemaining(totalTime);
  };

  const foundCount = items.filter(item => item.found).length;
  const progressPercentage = (foundCount / items.length) * 100;

  // Difficulty Selection Screen
  if (currentStep === 'difficulty') {
    const difficulties = [
      {
        level: 'easy' as Difficulty,
        title: 'Easy',
        subtitle: '5 common items',
        time: '5 minutes',
        points: '500 max',
        color: 'from-green-600 to-green-800',
        icon: '🌱',
      },
      {
        level: 'medium' as Difficulty,
        title: 'Medium',
        subtitle: '7 household items',
        time: '7 minutes',
        points: '1050 max',
        color: 'from-blue-600 to-blue-800',
        icon: '⚡',
      },
      {
        level: 'hard' as Difficulty,
        title: 'Hard',
        subtitle: '10 challenging items',
        time: '10 minutes',
        points: '2000 max',
        color: 'from-purple-600 to-purple-800',
        icon: '🔥',
      },
    ];

    return (
      <div 
        className="min-h-screen bg-black text-white flex flex-col"
        role="main"
        aria-labelledby="difficulty-title"
      >
        {/* Header */}
        <div className="p-6 pb-4">
          <div className="flex items-center justify-between mb-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={onExit}
              className="w-10 h-10 rounded-full hover:bg-gray-900"
              aria-label="Exit scavenger hunt"
            >
              <X className="w-5 h-5" />
            </Button>
            <h1 id="difficulty-title" className="text-xl font-bold">AR Scavenger Hunt</h1>
            <div className="w-10" aria-hidden="true" />
          </div>

          {/* Hero Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-6"
          >
            <motion.div
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              className="text-6xl mb-4"
              aria-hidden="true"
            >
              🔍
            </motion.div>
            <h2 className="text-2xl font-bold mb-2">Find & Learn Signs</h2>
            <p className="text-gray-400">
              Hunt for objects and learn their {selectedLanguage} signs
            </p>
          </motion.div>
        </div>

        {/* Difficulty Options */}
        <div className="flex-1 px-6 pb-6 overflow-y-auto">
          <h3 className="text-lg font-semibold mb-4">Select Difficulty</h3>
          <div className="space-y-3">
            {difficulties.map((difficulty, index) => (
              <motion.button
                key={difficulty.level}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                onClick={() => handleDifficultySelect(difficulty.level)}
                className={`w-full rounded-2xl p-5 text-left transition-all ${
                  selectedDifficulty === difficulty.level
                    ? `bg-gradient-to-br ${difficulty.color}`
                    : 'bg-gray-900 hover:bg-gray-800'
                }`}
                aria-pressed={selectedDifficulty === difficulty.level}
                aria-label={`Select ${difficulty.title} difficulty: ${difficulty.subtitle}, ${difficulty.time}, ${difficulty.points}`}
              >
                <div className="flex items-center gap-4 mb-3">
                  <div className={`text-4xl ${selectedDifficulty === difficulty.level ? '' : 'opacity-50'}`}>
                    {difficulty.icon}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="text-xl font-bold">{difficulty.title}</h4>
                      {selectedDifficulty === difficulty.level && (
                        <CheckCircle2 className="w-5 h-5 text-white" aria-label="Selected" />
                      )}
                    </div>
                    <p className={`text-sm ${selectedDifficulty === difficulty.level ? 'text-white/80' : 'text-gray-400'}`}>
                      {difficulty.subtitle}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className={`rounded-lg p-3 ${selectedDifficulty === difficulty.level ? 'bg-white/10' : 'bg-gray-800'}`}>
                    <div className="flex items-center gap-2 mb-1">
                      <Clock className="w-4 h-4" />
                      <span className="text-xs opacity-80">Time Limit</span>
                    </div>
                    <div className="font-semibold">{difficulty.time}</div>
                  </div>
                  <div className={`rounded-lg p-3 ${selectedDifficulty === difficulty.level ? 'bg-white/10' : 'bg-gray-800'}`}>
                    <div className="flex items-center gap-2 mb-1">
                      <Star className="w-4 h-4" />
                      <span className="text-xs opacity-80">Max Points</span>
                    </div>
                    <div className="font-semibold">{difficulty.points}</div>
                  </div>
                </div>
              </motion.button>
            ))}
          </div>

          {/* Info Box */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-gradient-to-br from-blue-600/20 to-blue-800/20 border border-blue-600/30 rounded-xl p-4 mt-6"
          >
            <div className="flex items-start gap-3">
              <Sparkles className="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="font-semibold mb-1">How It Works</h4>
                <ul className="space-y-1 text-sm text-gray-300" role="list">
                  <li>• Find objects in your environment using AR</li>
                  <li>• Learn the {selectedLanguage} sign for each item</li>
                  <li>• Race against the clock for bonus points</li>
                  <li>• Compete on the global leaderboard</li>
                </ul>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Continue Button */}
        <div className="p-6 border-t border-gray-900">
          <Button
            onClick={() => setCurrentStep('instructions')}
            className="w-full bg-blue-600 hover:bg-blue-700 h-14 text-lg font-semibold rounded-full"
            aria-label="Continue to instructions"
          >
            Continue
            <ChevronRight className="w-5 h-5 ml-2" />
          </Button>
        </div>
      </div>
    );
  }

  // Instructions Screen
  if (currentStep === 'instructions') {
    const currentItem = items[currentItemIndex];

    return (
      <div 
        className="min-h-screen bg-black text-white flex flex-col"
        role="main"
        aria-labelledby="instructions-title"
      >
        {/* Header */}
        <div className="p-6 pb-4">
          <div className="flex items-center justify-between mb-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setCurrentStep('difficulty')}
              className="w-10 h-10 rounded-full hover:bg-gray-900"
              aria-label="Back to difficulty selection"
            >
              <X className="w-5 h-5" />
            </Button>
            <h1 id="instructions-title" className="text-xl font-bold">Game Instructions</h1>
            <div className="w-10" aria-hidden="true" />
          </div>
        </div>

        {/* Instructions Content */}
        <div className="flex-1 px-6 pb-6 overflow-y-auto">
          {/* Selected Difficulty Badge */}
          <div className="bg-gray-900 rounded-xl p-4 mb-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-gray-400 mb-1">Difficulty</div>
                <div className="text-xl font-bold capitalize">{selectedDifficulty}</div>
              </div>
              <div className="text-right">
                <div className="text-sm text-gray-400 mb-1">Items to Find</div>
                <div className="text-xl font-bold">{items.length}</div>
              </div>
              <div className="text-right">
                <div className="text-sm text-gray-400 mb-1">Time Limit</div>
                <div className="text-xl font-bold">{formatTime(totalTime)}</div>
              </div>
            </div>
          </div>

          {/* Instructions List */}
          <div className="space-y-4 mb-6">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-gray-900 rounded-xl p-4"
            >
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-blue-600/20 flex items-center justify-center flex-shrink-0" aria-hidden="true">
                  <Camera className="w-6 h-6 text-blue-500" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold mb-1">1. Scan Your Environment</h3>
                  <p className="text-sm text-gray-400">
                    Use your camera to look around and find the items on your list
                  </p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-gray-900 rounded-xl p-4"
            >
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-green-600/20 flex items-center justify-center flex-shrink-0" aria-hidden="true">
                  <Target className="w-6 h-6 text-green-500" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold mb-1">2. Tap to Identify</h3>
                  <p className="text-sm text-gray-400">
                    When you find an item, tap on it to identify and collect it
                  </p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-gray-900 rounded-xl p-4"
            >
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-purple-600/20 flex items-center justify-center flex-shrink-0" aria-hidden="true">
                  <Sparkles className="w-6 h-6 text-purple-500" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold mb-1">3. Learn the Sign</h3>
                  <p className="text-sm text-gray-400">
                    Each item you find will teach you its {selectedLanguage} sign
                  </p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-gray-900 rounded-xl p-4"
            >
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-orange-600/20 flex items-center justify-center flex-shrink-0" aria-hidden="true">
                  <Clock className="w-6 h-6 text-orange-500" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold mb-1">4. Race the Clock</h3>
                  <p className="text-sm text-gray-400">
                    Find all items before time runs out for maximum points
                  </p>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Tips Box */}
          <div className="bg-gradient-to-br from-yellow-600/20 to-yellow-800/20 border border-yellow-600/30 rounded-xl p-4">
            <div className="flex items-start gap-3">
              <Zap className="w-5 h-5 text-yellow-500 mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="font-semibold mb-2">Pro Tips</h4>
                <ul className="space-y-1 text-sm text-gray-300" role="list">
                  <li>• Use hints if you're stuck (no penalty)</li>
                  <li>• Move quickly for time bonus points</li>
                  <li>• Better lighting helps AR detection</li>
                  <li>• Check progress anytime during the game</li>
                </ul>
              </div>
            </div>
          </div>

          {/* First Item Preview */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-gradient-to-br from-blue-600 to-blue-800 rounded-xl p-5 mt-6"
          >
            <div className="text-sm opacity-90 mb-2">First Item</div>
            <div className="text-2xl font-bold mb-2">{currentItem.name}</div>
            <div className="text-sm opacity-90">
              {currentItem.points} points • {currentItem.category}
            </div>
          </motion.div>
        </div>

        {/* Start Button */}
        <div className="p-6 border-t border-gray-900">
          <Button
            onClick={handleStartGame}
            className="w-full bg-green-600 hover:bg-green-700 h-14 text-lg font-semibold rounded-full"
            aria-label="Start scavenger hunt"
          >
            <Play className="w-5 h-5 mr-2" />
            Start Hunt
          </Button>
        </div>
      </div>
    );
  }

  // Gameplay Screen
  if (currentStep === 'gameplay') {
    const currentItem = items[currentItemIndex];

    return (
      <div 
        className="min-h-screen bg-black text-white flex flex-col"
        role="main"
        aria-labelledby="gameplay-title"
      >
        {/* AR Camera View */}
        <div className="flex-1 relative bg-gray-900">
          {/* Header Overlay */}
          <div className="absolute top-0 left-0 right-0 p-6 z-10">
            <div className="flex items-center justify-between">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => {
                  setGameStarted(false);
                  setCurrentStep('instructions');
                }}
                className="w-10 h-10 rounded-full bg-black/50 hover:bg-black/70"
                aria-label="Pause game"
              >
                <X className="w-5 h-5" />
              </Button>

              {/* Timer */}
              <motion.div
                animate={timeRemaining < 30 ? { scale: [1, 1.1, 1] } : {}}
                transition={{ duration: 1, repeat: timeRemaining < 30 ? Infinity : 0 }}
                className={`px-4 py-2 rounded-full font-bold flex items-center gap-2 ${
                  timeRemaining < 30 ? 'bg-red-600' : 'bg-black/50'
                }`}
                role="timer"
                aria-live="polite"
                aria-label={`Time remaining: ${formatTime(timeRemaining)}`}
              >
                <Clock className="w-4 h-4" />
                <span>{formatTime(timeRemaining)}</span>
              </motion.div>

              <Button
                variant="ghost"
                size="icon"
                onClick={() => setCurrentStep('progress')}
                className="w-10 h-10 rounded-full bg-black/50 hover:bg-black/70"
                aria-label="View progress"
              >
                <Trophy className="w-5 h-5" />
              </Button>
            </div>
          </div>

          {/* AR Scanning View */}
          <div className="absolute inset-0 flex items-center justify-center">
            {/* Scanning frame */}
            <motion.div
              animate={{
                scale: [1, 1.05, 1],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="relative w-80 h-80 border-4 border-dashed border-blue-500 rounded-3xl"
              aria-hidden="true"
            >
              {/* Corner markers */}
              <div className="absolute -top-2 -left-2 w-12 h-12 border-t-4 border-l-4 border-blue-500" />
              <div className="absolute -top-2 -right-2 w-12 h-12 border-t-4 border-r-4 border-blue-500" />
              <div className="absolute -bottom-2 -left-2 w-12 h-12 border-b-4 border-l-4 border-blue-500" />
              <div className="absolute -bottom-2 -right-2 w-12 h-12 border-b-4 border-r-4 border-blue-500" />

              {/* Scanning line */}
              <motion.div
                animate={{ y: [-150, 150] }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                className="absolute left-0 right-0 h-1 bg-blue-500"
                style={{ top: '50%' }}
              />

              {/* Search icon */}
              <div className="absolute inset-0 flex items-center justify-center">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                  className="w-20 h-20 rounded-full bg-blue-600/20 flex items-center justify-center"
                >
                  <Search className="w-10 h-10 text-blue-500" />
                </motion.div>
              </div>
            </motion.div>
          </div>

          {/* Current Item Card */}
          <div className="absolute bottom-32 left-6 right-6 z-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-black/80 backdrop-blur-md rounded-2xl p-5"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <div className="text-sm text-gray-400 mb-1">Looking for</div>
                  <h2 id="gameplay-title" className="text-2xl font-bold mb-2">{currentItem.name}</h2>
                  <div className="flex items-center gap-3 text-sm text-gray-300">
                    <span className="flex items-center gap-1">
                      <Star className="w-4 h-4 text-yellow-500" />
                      {currentItem.points} pts
                    </span>
                    <span>•</span>
                    <span>{currentItem.category}</span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm text-gray-400">Progress</div>
                  <div className="text-xl font-bold">
                    {foundCount}/{items.length}
                  </div>
                </div>
              </div>

              {/* Hint Section */}
              {showHint ? (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="bg-blue-600/20 border border-blue-600/30 rounded-lg p-3 mb-3"
                >
                  <div className="flex items-start gap-2">
                    <Sparkles className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
                    <div>
                      <div className="text-sm font-semibold mb-1">Hint</div>
                      <div className="text-sm text-gray-300">{currentItem.hint}</div>
                    </div>
                  </div>
                </motion.div>
              ) : (
                <Button
                  onClick={() => setShowHint(true)}
                  variant="outline"
                  size="sm"
                  className="w-full mb-3 border-gray-700"
                  aria-label="Show hint"
                >
                  <Sparkles className="w-4 h-4 mr-2" />
                  Show Hint
                </Button>
              )}

              {/* Sign Description */}
              <div className="bg-gray-900 rounded-lg p-3 mb-3">
                <div className="text-xs text-gray-400 mb-1">{selectedLanguage} Sign</div>
                <p className="text-sm">{currentItem.signDescription}</p>
              </div>

              {/* Progress Bar */}
              <div className="h-2 bg-gray-800 rounded-full overflow-hidden" role="progressbar" aria-valuenow={progressPercentage} aria-valuemin={0} aria-valuemax={100}>
                <motion.div
                  className="h-full bg-gradient-to-r from-blue-600 to-blue-400"
                  initial={{ width: 0 }}
                  animate={{ width: `${progressPercentage}%` }}
                />
              </div>
            </motion.div>
          </div>

          {/* Found Button */}
          <div className="absolute bottom-6 left-6 right-6 z-10">
            <Button
              onClick={handleItemFound}
              className="w-full bg-green-600 hover:bg-green-700 h-14 text-lg font-semibold rounded-full"
              aria-label={`Mark ${currentItem.name} as found`}
            >
              <Check className="w-5 h-5 mr-2" />
              Found It!
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Progress Tracker Screen
  if (currentStep === 'progress') {
    return (
      <div 
        className="min-h-screen bg-black text-white flex flex-col"
        role="main"
        aria-labelledby="progress-title"
      >
        {/* Header */}
        <div className="p-6 pb-4">
          <div className="flex items-center justify-between mb-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setCurrentStep('gameplay')}
              className="w-10 h-10 rounded-full hover:bg-gray-900"
              aria-label="Back to gameplay"
            >
              <X className="w-5 h-5" />
            </Button>
            <h1 id="progress-title" className="text-xl font-bold">Progress</h1>
            <div className="w-10" aria-hidden="true" />
          </div>

          {/* Stats Overview */}
          <div className="grid grid-cols-3 gap-3 mb-4">
            <div className="bg-gradient-to-br from-green-600 to-green-800 rounded-xl p-4 text-center">
              <div className="text-3xl font-bold mb-1">{foundCount}</div>
              <div className="text-xs opacity-90">Found</div>
            </div>
            <div className="bg-gradient-to-br from-blue-600 to-blue-800 rounded-xl p-4 text-center">
              <div className="text-3xl font-bold mb-1">{score}</div>
              <div className="text-xs opacity-90">Points</div>
            </div>
            <div className="bg-gradient-to-br from-purple-600 to-purple-800 rounded-xl p-4 text-center">
              <div className="text-3xl font-bold mb-1">{formatTime(timeRemaining)}</div>
              <div className="text-xs opacity-90">Time Left</div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="bg-gray-900 rounded-xl p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-400">Overall Progress</span>
              <span className="text-sm font-semibold">{Math.round(progressPercentage)}%</span>
            </div>
            <div className="h-3 bg-gray-800 rounded-full overflow-hidden" role="progressbar" aria-valuenow={progressPercentage} aria-valuemin={0} aria-valuemax={100}>
              <motion.div
                className="h-full bg-gradient-to-r from-green-600 to-green-400"
                initial={{ width: 0 }}
                animate={{ width: `${progressPercentage}%` }}
              />
            </div>
          </div>
        </div>

        {/* Items List */}
        <div className="flex-1 px-6 pb-6 overflow-y-auto">
          <h3 className="text-lg font-semibold mb-3">Items Checklist</h3>
          <div className="space-y-2">
            {items.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className={`rounded-xl p-4 ${
                  item.found
                    ? 'bg-green-600/20 border border-green-600/30'
                    : index === currentItemIndex
                    ? 'bg-blue-600/20 border border-blue-600/30'
                    : 'bg-gray-900'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                    item.found
                      ? 'bg-green-600'
                      : index === currentItemIndex
                      ? 'bg-blue-600'
                      : 'bg-gray-800'
                  }`}>
                    {item.found ? (
                      <Check className="w-5 h-5" aria-label="Found" />
                    ) : index === currentItemIndex ? (
                      <Target className="w-5 h-5" aria-label="Current target" />
                    ) : (
                      <Circle className="w-5 h-5" aria-label="Not found" />
                    )}
                  </div>

                  <div className="flex-1">
                    <div className="font-semibold">{item.name}</div>
                    <div className="text-xs text-gray-400">
                      {item.category} • {item.points} points
                    </div>
                  </div>

                  {item.found && item.timeFound && (
                    <div className="text-xs text-gray-400">
                      {formatTime(item.timeFound)}
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Continue Button */}
        <div className="p-6 border-t border-gray-900">
          <Button
            onClick={() => setCurrentStep('gameplay')}
            className="w-full bg-blue-600 hover:bg-blue-700 h-14 text-lg font-semibold rounded-full"
            aria-label="Continue hunting"
          >
            Continue Hunting
          </Button>
        </div>
      </div>
    );
  }

  // Results & Leaderboard Screen
  if (currentStep === 'results') {
    const finalScore = score;
    const completionPercentage = Math.round((foundCount / items.length) * 100);
    const timeTaken = formatTime(totalTime - timeRemaining);

    return (
      <div 
        className="min-h-screen bg-black text-white flex flex-col"
        role="main"
        aria-labelledby="results-title"
      >
        {/* Header */}
        <div className="p-6 text-center">
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: "spring", duration: 0.8 }}
            className="w-24 h-24 rounded-full bg-gradient-to-br from-yellow-600 to-yellow-800 flex items-center justify-center mx-auto mb-4"
            aria-hidden="true"
          >
            <Trophy className="w-12 h-12" />
          </motion.div>

          <motion.h1
            id="results-title"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-3xl font-bold mb-2"
          >
            Hunt Complete!
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-gray-400"
          >
            {completionPercentage === 100
              ? 'Perfect! You found everything!'
              : `You found ${foundCount} out of ${items.length} items`}
          </motion.p>
        </div>

        {/* Score Card */}
        <div className="px-6 mb-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5 }}
            className="bg-gradient-to-br from-blue-600 to-blue-800 rounded-2xl p-6 mb-4"
          >
            <div className="text-center mb-4">
              <div className="text-5xl font-bold mb-2">{finalScore}</div>
              <div className="text-sm opacity-90">Total Points</div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div className="bg-white/10 rounded-lg p-3 text-center">
                <div className="text-2xl font-bold mb-1">{foundCount}/{items.length}</div>
                <div className="text-xs opacity-90">Items Found</div>
              </div>
              <div className="bg-white/10 rounded-lg p-3 text-center">
                <div className="text-2xl font-bold mb-1">{timeTaken}</div>
                <div className="text-xs opacity-90">Time</div>
              </div>
              <div className="bg-white/10 rounded-lg p-3 text-center">
                <div className="text-2xl font-bold mb-1 capitalize">{selectedDifficulty}</div>
                <div className="text-xs opacity-90">Difficulty</div>
              </div>
            </div>
          </motion.div>

          {/* Achievements */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="bg-gray-900 rounded-xl p-4"
          >
            <h3 className="font-semibold mb-3 flex items-center gap-2">
              <Award className="w-5 h-5 text-yellow-500" />
              Achievements Unlocked
            </h3>
            <div className="space-y-2">
              {completionPercentage === 100 && (
                <div className="flex items-center gap-3 text-sm">
                  <div className="w-8 h-8 rounded-full bg-yellow-600/20 flex items-center justify-center">
                    <Star className="w-4 h-4 text-yellow-500" />
                  </div>
                  <span>Perfect Score - Found all items!</span>
                </div>
              )}
              {timeRemaining > totalTime / 2 && (
                <div className="flex items-center gap-3 text-sm">
                  <div className="w-8 h-8 rounded-full bg-blue-600/20 flex items-center justify-center">
                    <Zap className="w-4 h-4 text-blue-500" />
                  </div>
                  <span>Speed Demon - Finished with time to spare</span>
                </div>
              )}
              {foundCount >= 3 && (
                <div className="flex items-center gap-3 text-sm">
                  <div className="w-8 h-8 rounded-full bg-green-600/20 flex items-center justify-center">
                    <Target className="w-4 h-4 text-green-500" />
                  </div>
                  <span>Sharp Eye - Found multiple items</span>
                </div>
              )}
            </div>
          </motion.div>
        </div>

        {/* Leaderboard */}
        <div className="flex-1 px-6 pb-6 overflow-y-auto">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              Leaderboard
            </h3>
            <Button
              variant="ghost"
              size="sm"
              className="text-blue-500"
              aria-label="Share score"
            >
              <Share2 className="w-4 h-4 mr-1" />
              Share
            </Button>
          </div>

          <div className="space-y-2">
            {leaderboard.map((entry, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.7 + index * 0.05 }}
                className={`rounded-xl p-4 ${
                  entry.isCurrentUser
                    ? 'bg-gradient-to-r from-blue-600 to-blue-800 border-2 border-blue-400'
                    : 'bg-gray-900'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold flex-shrink-0 ${
                    entry.rank === 1 ? 'bg-yellow-600 text-black' :
                    entry.rank === 2 ? 'bg-gray-400 text-black' :
                    entry.rank === 3 ? 'bg-orange-600 text-black' :
                    entry.isCurrentUser ? 'bg-blue-500' : 'bg-gray-800'
                  }`}>
                    {entry.rank <= 3 ? (
                      <Medal className="w-5 h-5" aria-label={`Rank ${entry.rank}`} />
                    ) : (
                      <span>{entry.rank}</span>
                    )}
                  </div>

                  <div className="flex-1">
                    <div className="font-semibold flex items-center gap-2">
                      {entry.name}
                      {entry.rank === 1 && <Crown className="w-4 h-4 text-yellow-500" aria-label="Top rank" />}
                    </div>
                    <div className="text-xs text-gray-400 capitalize">
                      {entry.time} • {entry.difficulty}
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="text-xl font-bold">{entry.score}</div>
                    <div className="text-xs text-gray-400">points</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="p-6 border-t border-gray-900 space-y-3">
          <Button
            onClick={handleReplay}
            className="w-full bg-blue-600 hover:bg-blue-700 h-14 text-lg font-semibold rounded-full"
            aria-label="Play again"
          >
            <RotateCw className="w-5 h-5 mr-2" />
            Play Again
          </Button>
          <Button
            onClick={onExit}
            variant="ghost"
            className="w-full h-12 text-gray-400 hover:text-white"
            aria-label="Return to home"
          >
            <Home className="w-5 h-5 mr-2" />
            Back to Home
          </Button>
        </div>
      </div>
    );
  }

  return null;
}
