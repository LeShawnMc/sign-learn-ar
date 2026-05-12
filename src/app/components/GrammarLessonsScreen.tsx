import { useState } from 'react';
import { Button } from './ui/button';
import { useTheme } from '../context/ThemeContext';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ChevronLeft, 
  BookOpen, 
  Video, 
  CheckCircle2, 
  Circle,
  PlayCircle,
  Target,
  Sparkles,
  Trophy,
  Lock,
  Crown,
  ArrowRight,
  Info,
  Camera
} from 'lucide-react';

interface GrammarRule {
  id: string;
  title: string;
  category: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  duration: string;
  isPremium: boolean;
  completed: boolean;
  progress: number;
  theory: {
    title: string;
    explanation: string;
    keyPoints: string[];
    examples: {
      english: string;
      asl: string;
      description: string;
    }[];
  };
  arDemo: {
    title: string;
    description: string;
    steps: string[];
  };
  quiz: {
    question: string;
    options: string[];
    correctAnswer: number;
    explanation: string;
  }[];
}

const grammarRules: GrammarRule[] = [
  {
    id: 'grammar-1',
    title: 'Topic-Comment Structure',
    category: 'Sentence Structure',
    difficulty: 'beginner',
    duration: '8 min',
    isPremium: false,
    completed: true,
    progress: 100,
    theory: {
      title: 'ASL Topic-Comment Structure',
      explanation: 'In ASL, the most common sentence structure is Topic-Comment. The topic is established first, followed by a comment about that topic. This is different from English Subject-Verb-Object structure.',
      keyPoints: [
        'Topic is signed first to establish context',
        'Raised eyebrows and head tilt mark the topic',
        'Comment follows with relevant information',
        'No "to be" verb is needed between topic and comment'
      ],
      examples: [
        {
          english: 'I like coffee.',
          asl: 'COFFEE, ME LIKE',
          description: 'Topic: COFFEE (with raised eyebrows). Comment: ME LIKE.'
        },
        {
          english: 'The book is interesting.',
          asl: 'BOOK, INTERESTING',
          description: 'Topic: BOOK. Comment: INTERESTING. No "is" needed.'
        },
        {
          english: 'My name is Sarah.',
          asl: 'NAME, S-A-R-A-H',
          description: 'Topic: NAME. Comment: Fingerspelled name.'
        }
      ]
    },
    arDemo: {
      title: 'AR Practice: Topic-Comment',
      description: 'Practice signing topic-comment sentences with real-time feedback',
      steps: [
        'Sign the topic with raised eyebrows (COFFEE)',
        'Pause briefly to establish the topic',
        'Sign the comment with neutral expression (ME LIKE)',
        'Maintain proper facial expressions throughout'
      ]
    },
    quiz: [
      {
        question: 'How do you sign "Dogs are cute" in ASL topic-comment structure?',
        options: ['DOGS CUTE', 'CUTE DOGS', 'DOGS ARE CUTE', 'ARE DOGS CUTE'],
        correctAnswer: 0,
        explanation: 'In ASL, you establish the topic (DOGS) first with raised eyebrows, then comment (CUTE). No "are" is needed.'
      },
      {
        question: 'What facial expression marks the topic in ASL?',
        options: ['Furrowed brow', 'Raised eyebrows', 'Neutral face', 'Squinted eyes'],
        correctAnswer: 1,
        explanation: 'Raised eyebrows signal that you are establishing the topic of the sentence.'
      },
      {
        question: 'Which sentence follows proper ASL topic-comment structure?',
        options: ['ME LIKE PIZZA', 'PIZZA, ME LIKE', 'LIKE ME PIZZA', 'PIZZA LIKE ME'],
        correctAnswer: 1,
        explanation: 'PIZZA (topic with raised eyebrows), ME LIKE (comment) follows the topic-comment structure.'
      }
    ]
  },
  {
    id: 'grammar-2',
    title: 'Facial Expressions as Grammar',
    category: 'Non-Manual Markers',
    difficulty: 'beginner',
    duration: '10 min',
    isPremium: false,
    completed: false,
    progress: 60,
    theory: {
      title: 'Non-Manual Markers (Facial Grammar)',
      explanation: 'In ASL, facial expressions are not just for emotion—they are grammatical markers that change the meaning of signs. They can indicate questions, negations, conditionals, and more.',
      keyPoints: [
        'Raised eyebrows = Yes/No questions',
        'Furrowed brow = Wh-questions (who, what, where, when, why)',
        'Head shake = Negation',
        'Head nod = Affirmation or emphasis',
        'Facial expressions must occur simultaneously with signs'
      ],
      examples: [
        {
          english: 'Are you hungry?',
          asl: 'YOU HUNGRY (with raised eyebrows)',
          description: 'Raised eyebrows throughout the question indicate yes/no question.'
        },
        {
          english: 'Where is the bathroom?',
          asl: 'BATHROOM WHERE (with furrowed brow)',
          description: 'Furrowed brow indicates wh-question.'
        },
        {
          english: 'I don\'t like that.',
          asl: 'ME LIKE (with head shake)',
          description: 'Head shake during LIKE negates it—means "don\'t like".'
        }
      ]
    },
    arDemo: {
      title: 'AR Facial Expression Practice',
      description: 'Use AR to practice proper facial grammar with instant feedback',
      steps: [
        'Position face in AR camera view',
        'Practice raised eyebrows for yes/no questions',
        'Practice furrowed brow for wh-questions',
        'Practice head shake for negation',
        'Get real-time feedback on facial expressions'
      ]
    },
    quiz: [
      {
        question: 'What facial expression do you use for "Are you ready?"',
        options: ['Head shake', 'Raised eyebrows', 'Furrowed brow', 'Neutral face'],
        correctAnswer: 1,
        explanation: 'Yes/no questions require raised eyebrows throughout the question.'
      },
      {
        question: 'How do you negate "ME UNDERSTAND" to mean "I don\'t understand"?',
        options: ['Sign NOT before it', 'Shake head while signing', 'Sign NEVER after', 'Use angry face'],
        correctAnswer: 1,
        explanation: 'Shaking your head while signing negates the verb—no separate NOT sign needed.'
      },
      {
        question: 'What facial expression is used for "What time is it?"',
        options: ['Raised eyebrows', 'Furrowed brow', 'Head shake', 'Smile'],
        correctAnswer: 1,
        explanation: 'Wh-questions (what, where, when, who, why) use furrowed brow.'
      }
    ]
  },
  {
    id: 'grammar-3',
    title: 'Time Markers in ASL',
    category: 'Temporal Grammar',
    difficulty: 'intermediate',
    duration: '12 min',
    isPremium: true,
    completed: false,
    progress: 0,
    theory: {
      title: 'ASL Time and Tense',
      explanation: 'ASL does not have verb conjugation like English. Instead, time is established at the beginning of the sentence using time signs. Once established, the timeframe continues until a new time marker is introduced.',
      keyPoints: [
        'Time markers go at the beginning of sentences',
        'Past time signs move backward over shoulder',
        'Future time signs move forward from body',
        'Present time is signed near the body',
        'Verbs do not change form for tense'
      ],
      examples: [
        {
          english: 'Yesterday I went to the store.',
          asl: 'YESTERDAY, ME GO STORE',
          description: 'YESTERDAY establishes past tense. Verb GO doesn\'t change.'
        },
        {
          english: 'Tomorrow I will study.',
          asl: 'TOMORROW, ME STUDY',
          description: 'TOMORROW establishes future. No "will" needed.'
        },
        {
          english: 'I am eating now.',
          asl: 'NOW, ME EAT',
          description: 'NOW establishes present time.'
        }
      ]
    },
    arDemo: {
      title: 'AR Time Marker Practice',
      description: 'Practice temporal signs with directional movement tracking',
      steps: [
        'Learn past time signs (backward movement)',
        'Learn future time signs (forward movement)',
        'Practice present time signs (near body)',
        'Combine time markers with actions',
        'AR tracks directional accuracy'
      ]
    },
    quiz: [
      {
        question: 'Where is the time marker placed in an ASL sentence?',
        options: ['At the end', 'At the beginning', 'In the middle', 'Anywhere'],
        correctAnswer: 1,
        explanation: 'Time markers establish the timeframe and go at the beginning of ASL sentences.'
      },
      {
        question: 'How do you sign "I studied yesterday"?',
        options: ['ME STUDY YESTERDAY', 'YESTERDAY, ME STUDY', 'ME YESTERDAY STUDY', 'STUDY ME YESTERDAY'],
        correctAnswer: 1,
        explanation: 'Time marker (YESTERDAY) comes first, then the rest of the sentence.'
      },
      {
        question: 'Do ASL verbs change form for past tense?',
        options: ['Yes, add -ED', 'Yes, change handshape', 'No, use time markers', 'Sometimes'],
        correctAnswer: 2,
        explanation: 'ASL verbs don\'t conjugate. Time is shown through separate time marker signs.'
      }
    ]
  },
  {
    id: 'grammar-4',
    title: 'Directional Verbs',
    category: 'Verb Agreement',
    difficulty: 'intermediate',
    duration: '15 min',
    isPremium: true,
    completed: false,
    progress: 0,
    theory: {
      title: 'Directional and Agreement Verbs',
      explanation: 'In ASL, directional verbs move between locations in space to show who is doing what to whom. The direction of movement indicates the subject and object without needing separate pronouns.',
      keyPoints: [
        'Verb moves from subject to object location',
        'Direction shows who gives/tells/helps whom',
        'Common verbs: GIVE, TELL, HELP, ASK, SHOW',
        'Eliminates need for separate pronouns',
        'Spatial location must be established first'
      ],
      examples: [
        {
          english: 'I give you the book.',
          asl: 'BOOK, ME-GIVE-YOU',
          description: 'GIVE moves from signer toward you. Direction = subject to object.'
        },
        {
          english: 'She told me the story.',
          asl: 'SHE-TELL-ME, STORY',
          description: 'TELL moves from her location (in space) toward signer.'
        },
        {
          english: 'Can you help him?',
          asl: 'YOU-HELP-HIM, CAN (with eyebrows raised)',
          description: 'HELP moves from your location toward his established location.'
        }
      ]
    },
    arDemo: {
      title: 'AR Directional Verb Practice',
      description: 'Practice directional movement with spatial tracking',
      steps: [
        'Establish locations for people in signing space',
        'Practice GIVE moving from one point to another',
        'Practice TELL with correct directionality',
        'Practice ASK and HELP with AR feedback',
        'AR tracks movement direction accuracy'
      ]
    },
    quiz: [
      {
        question: 'In "ME-GIVE-YOU", what does the direction of GIVE indicate?',
        options: ['The object being given', 'Who gives to whom', 'How much is given', 'When it\'s given'],
        correctAnswer: 1,
        explanation: 'The direction of the verb shows subject (me) performing action toward object (you).'
      },
      {
        question: 'Which verb is directional in ASL?',
        options: ['WALK', 'GIVE', 'SLEEP', 'THINK'],
        correctAnswer: 1,
        explanation: 'GIVE is directional—it moves from giver to receiver. WALK, SLEEP, THINK are not.'
      },
      {
        question: 'How do you sign "She helps me"?',
        options: ['SHE HELP ME', 'SHE-HELP-ME (direction)', 'ME HELP SHE', 'HELP SHE ME'],
        correctAnswer: 1,
        explanation: 'HELP moves directionally from her location (in signing space) toward signer.'
      }
    ]
  },
  {
    id: 'grammar-5',
    title: 'Classifiers',
    category: 'Visual Grammar',
    difficulty: 'advanced',
    duration: '18 min',
    isPremium: true,
    completed: false,
    progress: 0,
    theory: {
      title: 'Classifier Handshapes',
      explanation: 'Classifiers are special handshapes that represent nouns and show their location, movement, and relationship to other objects. They are essential for describing spatial relationships and actions.',
      keyPoints: [
        'Different handshapes represent different noun types',
        '1-handshape = person, pole, thin objects',
        '3-handshape = vehicle, animals',
        'Flat B = flat surfaces, papers',
        'C-shape = cylindrical objects, cups',
        'Classifiers show movement and location visually'
      ],
      examples: [
        {
          english: 'The car drove past me.',
          asl: 'CAR, [3-CL moves past body]',
          description: '3-handshape represents the car and shows its movement path.'
        },
        {
          english: 'A person walked up to the door.',
          asl: 'PERSON, [1-CL walks to 5-CL door]',
          description: '1-CL represents person, 5-CL represents door, movement shows action.'
        },
        {
          english: 'The cup is on the table.',
          asl: 'CUP, TABLE, [C-CL on B-CL]',
          description: 'C-shape for cup placed on flat-B for table surface.'
        }
      ]
    },
    arDemo: {
      title: 'AR Classifier Training',
      description: 'Master classifier handshapes with AR visual demonstrations',
      steps: [
        'Learn basic classifier handshapes',
        'Practice showing object location with classifiers',
        'Practice showing object movement',
        'Combine multiple classifiers in scenes',
        'AR provides handshape recognition and feedback'
      ]
    },
    quiz: [
      {
        question: 'What does a 3-handshape classifier typically represent?',
        options: ['People', 'Vehicles and animals', 'Flat surfaces', 'Small objects'],
        correctAnswer: 1,
        explanation: 'The 3-handshape classifier is used for vehicles (cars, trucks) and animals.'
      },
      {
        question: 'How would you show "a person standing next to a tree"?',
        options: ['Sign PERSON TREE NEXT', 'Use 1-CL and 5-CL side by side', 'Fingerspell it', 'Sign STAND TREE'],
        correctAnswer: 1,
        explanation: '1-CL represents person, 5-CL represents tree, positioned next to each other in space.'
      },
      {
        question: 'What is the main purpose of classifiers in ASL?',
        options: ['Replace all nouns', 'Show spatial relationships visually', 'Make signing faster', 'Indicate plurals'],
        correctAnswer: 1,
        explanation: 'Classifiers visually represent objects and show their location, movement, and spatial relationships.'
      }
    ]
  }
];

interface GrammarLessonsScreenProps {
  onExit: () => void;
  onUpgrade?: () => void;
}

export function GrammarLessonsScreen({ onExit, onUpgrade }: GrammarLessonsScreenProps) {
  const { theme } = useTheme();
  const [selectedRule, setSelectedRule] = useState<GrammarRule | null>(null);
  const [viewMode, setViewMode] = useState<'theory' | 'ar' | 'quiz'>('theory');
  const [currentQuizIndex, setCurrentQuizIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [quizScore, setQuizScore] = useState(0);
  const [quizComplete, setQuizComplete] = useState(false);
  const [filterCategory, setFilterCategory] = useState<string>('all');

  const colors = theme === 'dark'
    ? {
        bg: '#0F0F23',
        headerBg: '#1A1A2E',
        cardBg: '#1E1E3F',
        cardHover: '#252541',
        textPrimary: '#F8FAFC',
        textSecondary: '#94A3B8',
        textTertiary: '#64748B',
        border: 'rgba(148, 163, 184, 0.2)',
        iconBg: 'rgba(0, 245, 255, 0.1)',
        iconColor: '#00F5FF',
        successColor: '#10B981',
        errorColor: '#EF4444',
        blur: 'none',
        shadow: 'none',
        glassBorder: 'none',
      }
    : {
        bg: 'linear-gradient(135deg, #E0F2FE 0%, #EDE9FE 50%, #FCE7F3 100%)',
        headerBg: 'rgba(255, 255, 255, 0.7)',
        cardBg: 'rgba(255, 255, 255, 0.6)',
        cardHover: 'rgba(255, 255, 255, 0.8)',
        textPrimary: '#0F172A',
        textSecondary: '#334155',
        textTertiary: '#64748B',
        border: 'rgba(255, 255, 255, 0.6)',
        iconBg: 'rgba(14, 165, 233, 0.12)',
        iconColor: '#0EA5E9',
        successColor: '#10B981',
        errorColor: '#EF4444',
        blur: 'blur(20px)',
        shadow: '0 8px 32px rgba(31, 38, 135, 0.15)',
        glassBorder: '1px solid rgba(255, 255, 255, 0.6)',
      };

  const categories = ['all', ...Array.from(new Set(grammarRules.map(r => r.category)))];

  const filteredRules = filterCategory === 'all' 
    ? grammarRules 
    : grammarRules.filter(r => r.category === filterCategory);

  const handleQuizAnswer = (answerIndex: number) => {
    if (selectedAnswer !== null) return; // Already answered
    
    setSelectedAnswer(answerIndex);
    setShowExplanation(true);
    
    if (selectedRule && answerIndex === selectedRule.quiz[currentQuizIndex].correctAnswer) {
      setQuizScore(quizScore + 1);
    }
  };

  const handleNextQuestion = () => {
    if (!selectedRule) return;
    
    if (currentQuizIndex < selectedRule.quiz.length - 1) {
      setCurrentQuizIndex(currentQuizIndex + 1);
      setSelectedAnswer(null);
      setShowExplanation(false);
    } else {
      setQuizComplete(true);
    }
  };

  const resetQuiz = () => {
    setCurrentQuizIndex(0);
    setSelectedAnswer(null);
    setShowExplanation(false);
    setQuizScore(0);
    setQuizComplete(false);
  };

  const handleStartLesson = (rule: GrammarRule) => {
    if (rule.isPremium && onUpgrade) {
      onUpgrade();
      return;
    }
    setSelectedRule(rule);
    setViewMode('theory');
    resetQuiz();
  };

  // Grammar lesson detail view
  if (selectedRule) {
    return (
      <div 
        className="h-full flex flex-col overflow-hidden"
        style={{ background: colors.bg, color: colors.textPrimary }}
        role="main"
        aria-labelledby="lesson-title"
      >
        {/* Header */}
        <div 
          className="p-4 sm:p-6 border-b flex items-center justify-between"
          style={{ 
            background: colors.headerBg,
            borderBottomColor: colors.border,
            backdropFilter: colors.blur,
            WebkitBackdropFilter: colors.blur,
            boxShadow: theme === 'light' ? '0 4px 30px rgba(31, 38, 135, 0.1)' : 'none',
          }}
        >
          <div className="flex items-center gap-3 min-w-0 flex-1">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => {
                setSelectedRule(null);
                setViewMode('theory');
                resetQuiz();
              }}
              className="flex-shrink-0"
              aria-label="Back to grammar lessons"
              style={{ color: colors.textSecondary }}
            >
              <ChevronLeft className="w-5 h-5" />
            </Button>
            <div className="min-w-0 flex-1">
              <h1 id="lesson-title" className="text-lg sm:text-xl font-bold truncate" style={{ fontFamily: 'Poppins, sans-serif' }}>
                {selectedRule.title}
              </h1>
              <p className="text-xs sm:text-sm truncate" style={{ color: colors.textSecondary }}>
                {selectedRule.category}
              </p>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div 
          className="border-b"
          style={{ 
            background: colors.headerBg,
            borderBottomColor: colors.border,
            backdropFilter: colors.blur,
            WebkitBackdropFilter: colors.blur,
          }}
          role="tablist"
          aria-label="Lesson sections"
        >
          <div className="flex">
            <button
              onClick={() => setViewMode('theory')}
              className="flex-1 px-4 py-3 text-sm sm:text-base font-semibold transition-colors relative"
              style={{ 
                color: viewMode === 'theory' ? colors.iconColor : colors.textSecondary,
                background: viewMode === 'theory' ? colors.iconBg : 'transparent',
              }}
              role="tab"
              aria-selected={viewMode === 'theory'}
              aria-controls="theory-panel"
            >
              <BookOpen className="w-4 h-4 inline-block mr-2" aria-hidden="true" />
              Theory
            </button>
            <button
              onClick={() => setViewMode('ar')}
              className="flex-1 px-4 py-3 text-sm sm:text-base font-semibold transition-colors relative"
              style={{ 
                color: viewMode === 'ar' ? colors.iconColor : colors.textSecondary,
                background: viewMode === 'ar' ? colors.iconBg : 'transparent',
              }}
              role="tab"
              aria-selected={viewMode === 'ar'}
              aria-controls="ar-panel"
            >
              <Camera className="w-4 h-4 inline-block mr-2" aria-hidden="true" />
              AR Demo
            </button>
            <button
              onClick={() => setViewMode('quiz')}
              className="flex-1 px-4 py-3 text-sm sm:text-base font-semibold transition-colors relative"
              style={{ 
                color: viewMode === 'quiz' ? colors.iconColor : colors.textSecondary,
                background: viewMode === 'quiz' ? colors.iconBg : 'transparent',
              }}
              role="tab"
              aria-selected={viewMode === 'quiz'}
              aria-controls="quiz-panel"
            >
              <Target className="w-4 h-4 inline-block mr-2" aria-hidden="true" />
              Quiz
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          <AnimatePresence mode="wait">
            {/* Theory View */}
            {viewMode === 'theory' && (
              <motion.div
                key="theory"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="p-4 sm:p-6"
                role="tabpanel"
                id="theory-panel"
                aria-labelledby="theory-tab"
              >
                <div 
                  className="rounded-xl sm:rounded-2xl p-4 sm:p-6 mb-6"
                  style={{ 
                    background: colors.cardBg,
                    backdropFilter: colors.blur,
                    WebkitBackdropFilter: colors.blur,
                    border: colors.glassBorder,
                    boxShadow: colors.shadow,
                  }}
                >
                  <h2 className="text-xl sm:text-2xl font-bold mb-4" style={{ fontFamily: 'Poppins, sans-serif' }}>
                    {selectedRule.theory.title}
                  </h2>
                  <p className="text-sm sm:text-base leading-relaxed mb-6" style={{ color: colors.textSecondary }}>
                    {selectedRule.theory.explanation}
                  </p>

                  <div className="mb-6">
                    <h3 className="text-base sm:text-lg font-semibold mb-3 flex items-center gap-2">
                      <Info className="w-5 h-5" style={{ color: colors.iconColor }} aria-hidden="true" />
                      Key Points
                    </h3>
                    <ul className="space-y-2" role="list">
                      {selectedRule.theory.keyPoints.map((point, index) => (
                        <li 
                          key={index} 
                          className="flex items-start gap-3 text-sm sm:text-base"
                        >
                          <CheckCircle2 
                            className="w-5 h-5 flex-shrink-0 mt-0.5" 
                            style={{ color: colors.successColor }} 
                            aria-hidden="true"
                          />
                          <span style={{ color: colors.textSecondary }}>{point}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h3 className="text-base sm:text-lg font-semibold mb-4">Examples</h3>
                    <div className="space-y-4">
                      {selectedRule.theory.examples.map((example, index) => (
                        <div 
                          key={index}
                          className="rounded-lg p-4"
                          style={{ 
                            background: theme === 'dark' ? 'rgba(0, 245, 255, 0.05)' : 'rgba(14, 165, 233, 0.05)',
                            border: `1px solid ${theme === 'dark' ? 'rgba(0, 245, 255, 0.2)' : 'rgba(14, 165, 233, 0.2)'}`,
                          }}
                        >
                          <div className="mb-2">
                            <span className="text-xs uppercase tracking-wide font-semibold" style={{ color: colors.textTertiary }}>
                              English
                            </span>
                            <p className="text-sm sm:text-base" style={{ color: colors.textSecondary }}>
                              {example.english}
                            </p>
                          </div>
                          <div className="mb-2">
                            <span className="text-xs uppercase tracking-wide font-semibold" style={{ color: colors.iconColor }}>
                              ASL Structure
                            </span>
                            <p className="text-base sm:text-lg font-bold" style={{ fontFamily: 'JetBrains Mono, monospace' }}>
                              {example.asl}
                            </p>
                          </div>
                          <div>
                            <span className="text-xs uppercase tracking-wide font-semibold" style={{ color: colors.textTertiary }}>
                              Explanation
                            </span>
                            <p className="text-sm" style={{ color: colors.textSecondary }}>
                              {example.description}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <Button
                  onClick={() => setViewMode('ar')}
                  className="w-full h-12 rounded-full font-semibold"
                  style={{ 
                    background: colors.iconColor,
                    color: theme === 'dark' ? '#0F0F23' : '#FFFFFF',
                  }}
                  aria-label="Continue to AR demonstration"
                >
                  Continue to AR Demo
                  <ArrowRight className="w-5 h-5 ml-2" aria-hidden="true" />
                </Button>
              </motion.div>
            )}

            {/* AR Demo View */}
            {viewMode === 'ar' && (
              <motion.div
                key="ar"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="p-4 sm:p-6"
                role="tabpanel"
                id="ar-panel"
                aria-labelledby="ar-tab"
              >
                <div 
                  className="rounded-xl sm:rounded-2xl p-4 sm:p-6 mb-6"
                  style={{ 
                    background: colors.cardBg,
                    backdropFilter: colors.blur,
                    WebkitBackdropFilter: colors.blur,
                    border: colors.glassBorder,
                    boxShadow: colors.shadow,
                  }}
                >
                  <h2 className="text-xl sm:text-2xl font-bold mb-4" style={{ fontFamily: 'Poppins, sans-serif' }}>
                    {selectedRule.arDemo.title}
                  </h2>
                  <p className="text-sm sm:text-base leading-relaxed mb-6" style={{ color: colors.textSecondary }}>
                    {selectedRule.arDemo.description}
                  </p>

                  {/* AR Camera Placeholder */}
                  <div 
                    className="rounded-xl mb-6 flex items-center justify-center relative overflow-hidden"
                    style={{ 
                      background: theme === 'dark' ? '#000000' : '#1F2937',
                      height: '300px',
                    }}
                    role="img"
                    aria-label="AR camera view placeholder"
                  >
                    <div className="text-center">
                      <Camera className="w-16 h-16 mx-auto mb-4 opacity-50" style={{ color: colors.textSecondary }} />
                      <p className="text-sm" style={{ color: colors.textSecondary }}>AR Camera View</p>
                      <p className="text-xs mt-2" style={{ color: colors.textTertiary }}>Position hands in frame to begin</p>
                    </div>
                    
                    {/* AR Overlay Grid */}
                    <div className="absolute inset-0 opacity-20 pointer-events-none" style={{
                      backgroundImage: `linear-gradient(${colors.iconColor} 1px, transparent 1px), linear-gradient(90deg, ${colors.iconColor} 1px, transparent 1px)`,
                      backgroundSize: '40px 40px',
                    }} aria-hidden="true" />
                  </div>

                  <div>
                    <h3 className="text-base sm:text-lg font-semibold mb-4 flex items-center gap-2">
                      <PlayCircle className="w-5 h-5" style={{ color: colors.iconColor }} aria-hidden="true" />
                      Practice Steps
                    </h3>
                    <ol className="space-y-3" role="list">
                      {selectedRule.arDemo.steps.map((step, index) => (
                        <li 
                          key={index}
                          className="flex items-start gap-3 text-sm sm:text-base"
                        >
                          <div 
                            className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 font-bold text-sm"
                            style={{ 
                              background: colors.iconBg,
                              color: colors.iconColor,
                            }}
                            aria-hidden="true"
                          >
                            {index + 1}
                          </div>
                          <span style={{ color: colors.textSecondary }}>{step}</span>
                        </li>
                      ))}
                    </ol>
                  </div>
                </div>

                <div className="flex gap-3">
                  <Button
                    onClick={() => setViewMode('theory')}
                    variant="outline"
                    className="flex-1 h-12 rounded-full font-semibold"
                    style={{ 
                      borderColor: colors.border,
                      color: colors.textSecondary,
                    }}
                    aria-label="Back to theory"
                  >
                    Back to Theory
                  </Button>
                  <Button
                    onClick={() => setViewMode('quiz')}
                    className="flex-1 h-12 rounded-full font-semibold"
                    style={{ 
                      background: colors.iconColor,
                      color: theme === 'dark' ? '#0F0F23' : '#FFFFFF',
                    }}
                    aria-label="Continue to quiz"
                  >
                    Take Quiz
                    <ArrowRight className="w-5 h-5 ml-2" aria-hidden="true" />
                  </Button>
                </div>
              </motion.div>
            )}

            {/* Quiz View */}
            {viewMode === 'quiz' && (
              <motion.div
                key="quiz"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="p-4 sm:p-6"
                role="tabpanel"
                id="quiz-panel"
                aria-labelledby="quiz-tab"
              >
                {!quizComplete ? (
                  <div 
                    className="rounded-xl sm:rounded-2xl p-4 sm:p-6"
                    style={{ 
                      background: colors.cardBg,
                      backdropFilter: colors.blur,
                      WebkitBackdropFilter: colors.blur,
                      border: colors.glassBorder,
                      boxShadow: colors.shadow,
                    }}
                  >
                    {/* Progress */}
                    <div className="mb-6">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-semibold" style={{ color: colors.textSecondary }}>
                          Question {currentQuizIndex + 1} of {selectedRule.quiz.length}
                        </span>
                        <span className="text-sm font-semibold" style={{ color: colors.iconColor }}>
                          Score: {quizScore}/{selectedRule.quiz.length}
                        </span>
                      </div>
                      <div 
                        className="h-2 rounded-full overflow-hidden"
                        style={{ background: theme === 'dark' ? 'rgba(148, 163, 184, 0.2)' : 'rgba(148, 163, 184, 0.3)' }}
                        role="progressbar"
                        aria-valuenow={currentQuizIndex + 1}
                        aria-valuemin={0}
                        aria-valuemax={selectedRule.quiz.length}
                      >
                        <div 
                          className="h-full transition-all duration-300"
                          style={{ 
                            width: `${((currentQuizIndex + 1) / selectedRule.quiz.length) * 100}%`,
                            background: colors.iconColor,
                          }}
                        />
                      </div>
                    </div>

                    {/* Question */}
                    <h3 className="text-lg sm:text-xl font-bold mb-6">
                      {selectedRule.quiz[currentQuizIndex].question}
                    </h3>

                    {/* Options */}
                    <div className="space-y-3 mb-6" role="radiogroup" aria-label="Quiz answer options">
                      {selectedRule.quiz[currentQuizIndex].options.map((option, index) => {
                        const isSelected = selectedAnswer === index;
                        const isCorrect = index === selectedRule.quiz[currentQuizIndex].correctAnswer;
                        const showResult = selectedAnswer !== null;
                        
                        let buttonStyle = {
                          background: colors.cardBg,
                          border: `2px solid ${colors.border}`,
                          color: colors.textPrimary,
                        };

                        if (showResult) {
                          if (isSelected && isCorrect) {
                            buttonStyle = {
                              background: theme === 'dark' ? 'rgba(16, 185, 129, 0.2)' : 'rgba(16, 185, 129, 0.1)',
                              border: `2px solid ${colors.successColor}`,
                              color: colors.textPrimary,
                            };
                          } else if (isSelected && !isCorrect) {
                            buttonStyle = {
                              background: theme === 'dark' ? 'rgba(239, 68, 68, 0.2)' : 'rgba(239, 68, 68, 0.1)',
                              border: `2px solid ${colors.errorColor}`,
                              color: colors.textPrimary,
                            };
                          } else if (isCorrect) {
                            buttonStyle = {
                              background: theme === 'dark' ? 'rgba(16, 185, 129, 0.2)' : 'rgba(16, 185, 129, 0.1)',
                              border: `2px solid ${colors.successColor}`,
                              color: colors.textPrimary,
                            };
                          }
                        }

                        return (
                          <button
                            key={index}
                            onClick={() => handleQuizAnswer(index)}
                            disabled={selectedAnswer !== null}
                            className="w-full rounded-xl p-4 text-left transition-all flex items-center gap-3"
                            style={buttonStyle}
                            role="radio"
                            aria-checked={isSelected}
                            aria-label={`Option ${index + 1}: ${option}`}
                          >
                            <div 
                              className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0"
                              style={{ 
                                border: `2px solid ${showResult && isCorrect ? colors.successColor : showResult && isSelected ? colors.errorColor : colors.border}`,
                                background: showResult && isCorrect ? colors.successColor : showResult && isSelected ? colors.errorColor : 'transparent',
                              }}
                              aria-hidden="true"
                            >
                              {showResult && (isCorrect || isSelected) && (
                                <CheckCircle2 className="w-4 h-4" style={{ color: '#FFFFFF' }} />
                              )}
                            </div>
                            <span className="flex-1 text-sm sm:text-base">{option}</span>
                          </button>
                        );
                      })}
                    </div>

                    {/* Explanation */}
                    <AnimatePresence>
                      {showExplanation && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className="rounded-lg p-4 mb-6"
                          style={{ 
                            background: selectedAnswer === selectedRule.quiz[currentQuizIndex].correctAnswer
                              ? theme === 'dark' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(16, 185, 129, 0.05)'
                              : theme === 'dark' ? 'rgba(239, 68, 68, 0.1)' : 'rgba(239, 68, 68, 0.05)',
                            border: `1px solid ${selectedAnswer === selectedRule.quiz[currentQuizIndex].correctAnswer ? colors.successColor : colors.errorColor}`,
                          }}
                          role="status"
                          aria-live="polite"
                        >
                          <div className="flex items-start gap-3">
                            {selectedAnswer === selectedRule.quiz[currentQuizIndex].correctAnswer ? (
                              <CheckCircle2 className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: colors.successColor }} aria-hidden="true" />
                            ) : (
                              <Circle className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: colors.errorColor }} aria-hidden="true" />
                            )}
                            <div className="flex-1">
                              <p className="font-semibold mb-2" style={{ color: selectedAnswer === selectedRule.quiz[currentQuizIndex].correctAnswer ? colors.successColor : colors.errorColor }}>
                                {selectedAnswer === selectedRule.quiz[currentQuizIndex].correctAnswer ? 'Correct!' : 'Incorrect'}
                              </p>
                              <p className="text-sm" style={{ color: colors.textSecondary }}>
                                {selectedRule.quiz[currentQuizIndex].explanation}
                              </p>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {/* Next Button */}
                    {showExplanation && (
                      <Button
                        onClick={handleNextQuestion}
                        className="w-full h-12 rounded-full font-semibold"
                        style={{ 
                          background: colors.iconColor,
                          color: theme === 'dark' ? '#0F0F23' : '#FFFFFF',
                        }}
                        aria-label={currentQuizIndex < selectedRule.quiz.length - 1 ? 'Next question' : 'Complete quiz'}
                      >
                        {currentQuizIndex < selectedRule.quiz.length - 1 ? 'Next Question' : 'Complete Quiz'}
                        <ArrowRight className="w-5 h-5 ml-2" aria-hidden="true" />
                      </Button>
                    )}
                  </div>
                ) : (
                  // Quiz Complete
                  <div 
                    className="rounded-xl sm:rounded-2xl p-6 sm:p-8 text-center"
                    style={{ 
                      background: colors.cardBg,
                      backdropFilter: colors.blur,
                      WebkitBackdropFilter: colors.blur,
                      border: colors.glassBorder,
                      boxShadow: colors.shadow,
                    }}
                    role="status"
                    aria-live="polite"
                  >
                    <div 
                      className="w-20 h-20 rounded-full mx-auto mb-6 flex items-center justify-center"
                      style={{ background: `linear-gradient(135deg, ${colors.iconColor}, ${colors.successColor})` }}
                      aria-hidden="true"
                    >
                      <Trophy className="w-10 h-10" style={{ color: '#FFFFFF' }} />
                    </div>
                    
                    <h2 className="text-2xl sm:text-3xl font-bold mb-4" style={{ fontFamily: 'Poppins, sans-serif' }}>
                      Quiz Complete!
                    </h2>
                    
                    <p className="text-4xl sm:text-5xl font-bold mb-2" style={{ color: colors.iconColor }}>
                      {quizScore}/{selectedRule.quiz.length}
                    </p>
                    <p className="text-base sm:text-lg mb-6" style={{ color: colors.textSecondary }}>
                      {quizScore === selectedRule.quiz.length 
                        ? 'Perfect score! 🎉' 
                        : quizScore >= selectedRule.quiz.length * 0.7 
                          ? 'Great job! Keep practicing!' 
                          : 'Review the theory and try again!'}
                    </p>

                    <div className="flex gap-3">
                      <Button
                        onClick={resetQuiz}
                        variant="outline"
                        className="flex-1 h-12 rounded-full font-semibold"
                        style={{ 
                          borderColor: colors.border,
                          color: colors.textSecondary,
                        }}
                        aria-label="Retake quiz"
                      >
                        Retake Quiz
                      </Button>
                      <Button
                        onClick={() => {
                          setSelectedRule(null);
                          setViewMode('theory');
                          resetQuiz();
                        }}
                        className="flex-1 h-12 rounded-full font-semibold"
                        style={{ 
                          background: colors.iconColor,
                          color: theme === 'dark' ? '#0F0F23' : '#FFFFFF',
                        }}
                        aria-label="Return to lesson list"
                      >
                        Done
                      </Button>
                    </div>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    );
  }

  // Grammar lessons list view
  return (
    <div 
      className="h-full flex flex-col overflow-hidden"
      style={{ background: colors.bg, color: colors.textPrimary }}
      role="main"
      aria-labelledby="grammar-title"
    >
      {/* Header */}
      <div 
        className="p-4 sm:p-6 border-b"
        style={{ 
          background: colors.headerBg,
          borderBottomColor: colors.border,
          backdropFilter: colors.blur,
          WebkitBackdropFilter: colors.blur,
          boxShadow: theme === 'light' ? '0 4px 30px rgba(31, 38, 135, 0.1)' : 'none',
        }}
      >
        <div className="flex items-center gap-3 mb-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={onExit}
            aria-label="Back to home"
            style={{ color: colors.textSecondary }}
          >
            <ChevronLeft className="w-5 h-5" />
          </Button>
          <div className="flex-1">
            <h1 id="grammar-title" className="text-xl sm:text-2xl font-bold" style={{ fontFamily: 'Poppins, sans-serif' }}>
              Grammar Lessons
            </h1>
            <p className="text-xs sm:text-sm" style={{ color: colors.textSecondary }}>
              Master ASL sentence structure and rules
            </p>
          </div>
        </div>

        {/* Category Filter */}
        <div 
          className="flex gap-2 overflow-x-auto pb-2 -mx-4 px-4 scrollbar-hide"
          role="tablist"
          aria-label="Grammar categories"
        >
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setFilterCategory(category)}
              className="px-4 py-2 rounded-full text-sm font-semibold whitespace-nowrap transition-colors"
              style={{
                background: filterCategory === category ? colors.iconColor : colors.cardBg,
                color: filterCategory === category 
                  ? (theme === 'dark' ? '#0F0F23' : '#FFFFFF')
                  : colors.textSecondary,
                backdropFilter: colors.blur,
                WebkitBackdropFilter: colors.blur,
                border: filterCategory === category ? 'none' : `1px solid ${colors.border}`,
              }}
              role="tab"
              aria-selected={filterCategory === category}
              aria-label={`Filter by ${category === 'all' ? 'all categories' : category}`}
            >
              {category === 'all' ? 'All' : category}
            </button>
          ))}
        </div>
      </div>

      {/* Grammar Rules List */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6">
        <div className="space-y-3">
          {filteredRules.map((rule, index) => (
            <motion.button
              key={rule.id}
              onClick={() => handleStartLesson(rule)}
              className="w-full rounded-xl sm:rounded-2xl p-4 sm:p-5 text-left transition-colors"
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
              transition={{ delay: index * 0.05 }}
              aria-label={`${rule.title}, ${rule.category}, ${rule.difficulty} level, ${rule.duration}. ${rule.isPremium ? 'Premium content' : 'Free'}. ${rule.completed ? 'Completed' : rule.progress > 0 ? `${rule.progress}% complete` : 'Not started'}`}
            >
              <div className="flex items-start gap-4">
                <div 
                  className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ background: colors.iconBg }}
                  aria-hidden="true"
                >
                  <BookOpen className="w-6 h-6 sm:w-7 sm:h-7" style={{ color: colors.iconColor }} />
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-bold text-base sm:text-lg truncate">{rule.title}</h3>
                    {rule.isPremium && (
                      <Crown className="w-4 h-4 flex-shrink-0" style={{ color: '#F59E0B' }} aria-label="Premium" />
                    )}
                    {rule.completed && (
                      <CheckCircle2 className="w-4 h-4 flex-shrink-0" style={{ color: colors.successColor }} aria-label="Completed" />
                    )}
                  </div>
                  
                  <p className="text-xs sm:text-sm mb-2 truncate" style={{ color: colors.textSecondary }}>
                    {rule.category}
                  </p>
                  
                  <div className="flex items-center gap-3 text-xs" style={{ color: colors.textTertiary }}>
                    <span className="capitalize">{rule.difficulty}</span>
                    <span>•</span>
                    <span>{rule.duration}</span>
                    <span>•</span>
                    <span>{rule.quiz.length} questions</span>
                  </div>
                  
                  {rule.progress > 0 && !rule.completed && (
                    <div className="mt-3">
                      <div 
                        className="h-1.5 rounded-full overflow-hidden"
                        style={{ background: theme === 'dark' ? 'rgba(148, 163, 184, 0.2)' : 'rgba(148, 163, 184, 0.3)' }}
                        role="progressbar"
                        aria-valuenow={rule.progress}
                        aria-valuemin={0}
                        aria-valuemax={100}
                        aria-label={`${rule.progress}% complete`}
                      >
                        <div 
                          className="h-full"
                          style={{ 
                            width: `${rule.progress}%`,
                            background: colors.iconColor,
                          }}
                        />
                      </div>
                    </div>
                  )}
                </div>

                {rule.isPremium ? (
                  <Lock className="w-5 h-5 flex-shrink-0" style={{ color: colors.textTertiary }} aria-hidden="true" />
                ) : (
                  <ArrowRight className="w-5 h-5 flex-shrink-0" style={{ color: colors.iconColor }} aria-hidden="true" />
                )}
              </div>
            </motion.button>
          ))}
        </div>
      </div>
    </div>
  );
}