import { useState } from 'react';
import { Button } from './ui/button';
import { useTheme } from '../context/ThemeContext';
import { useApp } from '../context/AppContext';
import { motion, AnimatePresence } from 'motion/react';
import { X, BookOpen, Lock, Star, ChevronRight, ArrowLeft, Check, Play, Sparkles, Trophy, User } from 'lucide-react';

interface StoryModeProps {
  onExit: () => void;
  onUpgrade?: () => void;
}

type ViewMode = 'chapters' | 'story';

interface Character {
  id: string;
  name: string;
  avatar: string;
  description: string;
}

interface Scene {
  id: string;
  characterId: string;
  dialogue: string;
  signs: string[];
  signDescriptions: { [key: string]: string };
}

interface Chapter {
  id: string;
  title: string;
  description: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  duration: string;
  scenes: Scene[];
  signsToLearn: string[];
  isPremium: boolean;
  isLocked: boolean;
  progress: number;
  category: string;
}

// Real characters for story mode
const characters: Character[] = [
  {
    id: 'maya',
    name: 'Maya',
    avatar: '👩',
    description: 'A friendly teacher who loves helping others learn ASL',
  },
  {
    id: 'alex',
    name: 'Alex',
    avatar: '🧑',
    description: 'A curious student eager to communicate with the Deaf community',
  },
  {
    id: 'jordan',
    name: 'Jordan',
    avatar: '👨',
    description: 'A Deaf artist who shares stories through sign language',
  },
  {
    id: 'sam',
    name: 'Sam',
    avatar: '👧',
    description: 'A young learner discovering the beauty of ASL',
  },
  {
    id: 'taylor',
    name: 'Taylor',
    avatar: '🧒',
    description: 'A friendly neighbor learning to sign with their Deaf friend',
  },
  {
    id: 'riley',
    name: 'Riley',
    avatar: '👵',
    description: 'A wise grandmother teaching ASL to her grandchildren',
  },
];

// Real story chapters with educational ASL content
const storyChapters: Chapter[] = [
  {
    id: 'chapter-1',
    title: 'First Meeting',
    description: 'Maya meets Alex and introduces the basics of sign language',
    difficulty: 'beginner',
    duration: '8 min',
    category: 'Greetings & Introductions',
    isPremium: false,
    isLocked: false,
    progress: 0,
    signsToLearn: ['HELLO', 'NICE', 'MEET', 'YOU', 'MY', 'NAME'],
    scenes: [
      {
        id: 'scene-1',
        characterId: 'maya',
        dialogue: 'Hi! My name is Maya. I\'m so excited to teach you sign language!',
        signs: ['HELLO', 'MY', 'NAME'],
        signDescriptions: {
          'HELLO': 'Place your hand at your forehead and move it forward, like a salute',
          'MY': 'Place your flat hand on your chest',
          'NAME': 'Form an X with both index and middle fingers, then tap them together twice',
        },
      },
      {
        id: 'scene-2',
        characterId: 'alex',
        dialogue: 'Hello Maya! I\'m Alex. I want to learn how to communicate with my Deaf friend.',
        signs: ['HELLO', 'MY', 'NAME'],
        signDescriptions: {
          'HELLO': 'Place your hand at your forehead and move it forward, like a salute',
          'MY': 'Place your flat hand on your chest',
          'NAME': 'Form an X with both index and middle fingers, then tap them together twice',
        },
      },
      {
        id: 'scene-3',
        characterId: 'maya',
        dialogue: 'Nice to meet you, Alex! Let\'s start with some basic greetings.',
        signs: ['NICE', 'MEET', 'YOU'],
        signDescriptions: {
          'NICE': 'Slide your dominant hand across your non-dominant palm',
          'MEET': 'Bring both hands together with index fingers extended, like two people meeting',
          'YOU': 'Point your index finger toward the person you\'re addressing',
        },
      },
      {
        id: 'scene-4',
        characterId: 'alex',
        dialogue: 'This is amazing! I can already introduce myself in sign language!',
        signs: ['HELLO', 'MY', 'NAME', 'NICE', 'MEET', 'YOU'],
        signDescriptions: {
          'HELLO': 'Place your hand at your forehead and move it forward',
          'MY': 'Place your flat hand on your chest',
          'NAME': 'Form an X with both index and middle fingers, tap them together',
          'NICE': 'Slide your dominant hand across your non-dominant palm',
          'MEET': 'Bring both hands together with index fingers extended',
          'YOU': 'Point your index finger toward the person',
        },
      },
    ],
  },
  {
    id: 'chapter-2',
    title: 'Daily Routines',
    description: 'Alex learns to describe daily activities and routines',
    difficulty: 'beginner',
    duration: '10 min',
    category: 'Daily Life',
    isPremium: false,
    isLocked: false,
    progress: 0,
    signsToLearn: ['EAT', 'DRINK', 'SLEEP', 'WORK', 'HOME', 'SCHOOL'],
    scenes: [
      {
        id: 'scene-1',
        characterId: 'maya',
        dialogue: 'Today we\'ll learn signs for your daily routine. Let\'s start with basic activities!',
        signs: ['EAT', 'DRINK'],
        signDescriptions: {
          'EAT': 'Bring your fingertips to your mouth repeatedly',
          'DRINK': 'Make a C-shape with your hand and tilt it toward your mouth like drinking from a cup',
        },
      },
      {
        id: 'scene-2',
        characterId: 'alex',
        dialogue: 'I eat breakfast at home, then go to work.',
        signs: ['EAT', 'HOME', 'WORK'],
        signDescriptions: {
          'EAT': 'Bring your fingertips to your mouth repeatedly',
          'HOME': 'Touch your fingertips to your mouth, then move to your cheek',
          'WORK': 'Make fists with both hands and tap your dominant fist on top of your non-dominant fist twice',
        },
      },
      {
        id: 'scene-3',
        characterId: 'maya',
        dialogue: 'Perfect! Now let\'s learn SLEEP. After a long day at work, everyone needs rest.',
        signs: ['SLEEP', 'WORK'],
        signDescriptions: {
          'SLEEP': 'Place your open hand in front of your face, then close it as you move it down',
          'WORK': 'Make fists and tap your dominant fist on top of your non-dominant fist twice',
        },
      },
      {
        id: 'scene-4',
        characterId: 'alex',
        dialogue: 'I work, eat dinner at home, and sleep. Now I can describe my whole day!',
        signs: ['WORK', 'EAT', 'HOME', 'SLEEP'],
        signDescriptions: {
          'WORK': 'Tap your fists together twice',
          'EAT': 'Bring fingertips to mouth repeatedly',
          'HOME': 'Touch fingertips to mouth, then to cheek',
          'SLEEP': 'Close your hand in front of your face as you move it down',
        },
      },
    ],
  },
  {
    id: 'chapter-3',
    title: 'Meeting Jordan',
    description: 'Alex meets Jordan, a Deaf artist, and learns about emotions',
    difficulty: 'intermediate',
    duration: '12 min',
    category: 'Emotions & Feelings',
    isPremium: true,
    isLocked: false,
    progress: 0,
    signsToLearn: ['HAPPY', 'SAD', 'EXCITED', 'TIRED', 'LOVE', 'FRIEND'],
    scenes: [
      {
        id: 'scene-1',
        characterId: 'jordan',
        dialogue: 'Hi! I\'m Jordan. I\'m happy to meet you!',
        signs: ['HELLO', 'HAPPY', 'MEET'],
        signDescriptions: {
          'HELLO': 'Place your hand at your forehead and move it forward',
          'HAPPY': 'Brush your hand upward on your chest twice in a circular motion',
          'MEET': 'Bring both hands together with index fingers extended',
        },
      },
      {
        id: 'scene-2',
        characterId: 'alex',
        dialogue: 'Hi Jordan! I\'m excited to learn from you!',
        signs: ['HELLO', 'EXCITED'],
        signDescriptions: {
          'HELLO': 'Place your hand at your forehead and move it forward',
          'EXCITED': 'Alternate brushing both hands up your chest with wiggling fingers',
        },
      },
      {
        id: 'scene-3',
        characterId: 'jordan',
        dialogue: 'Art makes me happy, but sometimes I feel tired after working all day.',
        signs: ['HAPPY', 'TIRED'],
        signDescriptions: {
          'HAPPY': 'Brush your hand upward on your chest twice in a circular motion',
          'TIRED': 'Place both hands on your chest and drop them downward with drooping shoulders',
        },
      },
      {
        id: 'scene-4',
        characterId: 'alex',
        dialogue: 'I love learning from you! You\'re a great friend!',
        signs: ['LOVE', 'FRIEND'],
        signDescriptions: {
          'LOVE': 'Cross both fists over your heart',
          'FRIEND': 'Hook your index fingers together, then switch and hook them the other way',
        },
      },
      {
        id: 'scene-5',
        characterId: 'jordan',
        dialogue: 'You\'re my friend too! I\'m happy we met!',
        signs: ['FRIEND', 'HAPPY', 'MEET'],
        signDescriptions: {
          'FRIEND': 'Hook your index fingers together, then switch positions',
          'HAPPY': 'Brush your hand upward on your chest twice',
          'MEET': 'Bring both hands together with index fingers extended',
        },
      },
    ],
  },
  {
    id: 'chapter-4',
    title: 'Family Gathering',
    description: 'Sam introduces her family members using sign language',
    difficulty: 'intermediate',
    duration: '15 min',
    category: 'Family & Relationships',
    isPremium: true,
    isLocked: false,
    progress: 0,
    signsToLearn: ['FAMILY', 'MOTHER', 'FATHER', 'SISTER', 'BROTHER', 'GRANDPARENT'],
    scenes: [
      {
        id: 'scene-1',
        characterId: 'sam',
        dialogue: 'I love my family! Let me tell you about them.',
        signs: ['LOVE', 'FAMILY'],
        signDescriptions: {
          'LOVE': 'Cross both fists over your heart',
          'FAMILY': 'Make F-shapes with both hands and circle them around to form a circle',
        },
      },
      {
        id: 'scene-2',
        characterId: 'sam',
        dialogue: 'My mother and father are very kind.',
        signs: ['MOTHER', 'FATHER'],
        signDescriptions: {
          'MOTHER': 'Touch your thumb to your chin with fingers spread',
          'FATHER': 'Touch your thumb to your forehead with fingers spread',
        },
      },
      {
        id: 'scene-3',
        characterId: 'sam',
        dialogue: 'I have one sister and one brother. We play together every day!',
        signs: ['SISTER', 'BROTHER'],
        signDescriptions: {
          'SISTER': 'Touch your thumb to your chin, then bring both hands down together',
          'BROTHER': 'Touch your thumb to your forehead, then bring both hands down together',
        },
      },
      {
        id: 'scene-4',
        characterId: 'riley',
        dialogue: 'Hello! I\'m Sam\'s grandmother. I teach the whole family sign language!',
        signs: ['HELLO', 'FAMILY', 'TEACH'],
        signDescriptions: {
          'HELLO': 'Place your hand at your forehead and move it forward',
          'FAMILY': 'Make F-shapes with both hands and circle them around',
          'TEACH': 'Move both hands from your forehead forward twice',
        },
      },
    ],
  },
  {
    id: 'chapter-5',
    title: 'At the Café',
    description: 'Taylor orders food and drinks using sign language',
    difficulty: 'beginner',
    duration: '10 min',
    category: 'Food & Dining',
    isPremium: false,
    isLocked: true,
    progress: 0,
    signsToLearn: ['COFFEE', 'TEA', 'WATER', 'FOOD', 'PLEASE', 'THANK YOU'],
    scenes: [
      {
        id: 'scene-1',
        characterId: 'taylor',
        dialogue: 'I\'d like some coffee, please!',
        signs: ['COFFEE', 'PLEASE'],
        signDescriptions: {
          'COFFEE': 'Make grinding motion with one fist on top of the other',
          'PLEASE': 'Place your hand flat on your chest and move it in a circular motion',
        },
      },
      {
        id: 'scene-2',
        characterId: 'maya',
        dialogue: 'Would you like tea or water with your food?',
        signs: ['TEA', 'WATER', 'FOOD'],
        signDescriptions: {
          'TEA': 'Make a T-shape with your hand and dip it in your other hand like a tea bag',
          'WATER': 'Make a W with three fingers and tap your chin twice',
          'FOOD': 'Bring your fingertips to your mouth repeatedly',
        },
      },
      {
        id: 'scene-3',
        characterId: 'taylor',
        dialogue: 'Water, please. Thank you!',
        signs: ['WATER', 'PLEASE', 'THANK YOU'],
        signDescriptions: {
          'WATER': 'Make a W with three fingers and tap your chin twice',
          'PLEASE': 'Place your hand flat on your chest and move it in a circle',
          'THANK YOU': 'Touch your fingers to your chin and move your hand forward and down',
        },
      },
    ],
  },
  {
    id: 'chapter-6',
    title: 'The Art Show',
    description: 'Jordan\'s art exhibition teaches colors and descriptive words',
    difficulty: 'advanced',
    duration: '18 min',
    category: 'Colors & Description',
    isPremium: true,
    isLocked: true,
    progress: 0,
    signsToLearn: ['RED', 'BLUE', 'GREEN', 'BEAUTIFUL', 'ART', 'COLOR'],
    scenes: [
      {
        id: 'scene-1',
        characterId: 'jordan',
        dialogue: 'Welcome to my art show! I\'ll teach you about colors.',
        signs: ['ART', 'COLOR'],
        signDescriptions: {
          'ART': 'Move your pinky finger down your non-dominant palm in a wavy line',
          'COLOR': 'Wiggle your fingers in front of your chin',
        },
      },
      {
        id: 'scene-2',
        characterId: 'jordan',
        dialogue: 'This painting has red, blue, and green colors. Beautiful!',
        signs: ['RED', 'BLUE', 'GREEN', 'BEAUTIFUL'],
        signDescriptions: {
          'RED': 'Touch your index finger to your lips and move it down',
          'BLUE': 'Make a B-shape and shake your hand side to side',
          'GREEN': 'Make a G-shape and shake your hand side to side',
          'BEAUTIFUL': 'Start with your hand at your chin, circle your face, and end in a closed position',
        },
      },
      {
        id: 'scene-3',
        characterId: 'alex',
        dialogue: 'Your art is so beautiful! I love all the colors!',
        signs: ['ART', 'BEAUTIFUL', 'LOVE', 'COLOR'],
        signDescriptions: {
          'ART': 'Move your pinky finger down your palm in a wavy line',
          'BEAUTIFUL': 'Circle your hand around your face',
          'LOVE': 'Cross both fists over your heart',
          'COLOR': 'Wiggle your fingers in front of your chin',
        },
      },
    ],
  },
];

export function StoryMode({ onExit, onUpgrade }: StoryModeProps) {
  const { theme } = useTheme();
  const { userProgress } = useApp();
  const [viewMode, setViewMode] = useState<ViewMode>('chapters');
  const [selectedChapter, setSelectedChapter] = useState<Chapter | null>(null);
  const [currentSceneIndex, setCurrentSceneIndex] = useState(0);
  const [completedScenes, setCompletedScenes] = useState<string[]>([]);
  const [showSignDetails, setShowSignDetails] = useState<string | null>(null);

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
        premiumBg: 'rgba(251, 191, 36, 0.1)',
        premiumColor: '#FBD500',
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
        premiumBg: 'rgba(251, 191, 36, 0.1)',
        premiumColor: '#F59E0B',
        blur: 'blur(20px)',
        shadow: '0 8px 32px rgba(31, 38, 135, 0.15)',
        glassBorder: '1px solid rgba(255, 255, 255, 0.6)',
      };

  const handleChapterSelect = (chapter: Chapter) => {
    // Check if chapter is locked
    if (chapter.isLocked) {
      return; // Can't select locked chapters
    }

    // Check if premium chapter and user doesn't have premium
    if (chapter.isPremium && !userProgress.isPremium) {
      if (onUpgrade) {
        onUpgrade();
      }
      return;
    }

    setSelectedChapter(chapter);
    setCurrentSceneIndex(0);
    setViewMode('story');
  };

  const handleNextScene = () => {
    if (!selectedChapter) return;

    const currentScene = selectedChapter.scenes[currentSceneIndex];
    if (!completedScenes.includes(currentScene.id)) {
      setCompletedScenes([...completedScenes, currentScene.id]);
    }

    if (currentSceneIndex < selectedChapter.scenes.length - 1) {
      setCurrentSceneIndex(currentSceneIndex + 1);
      setShowSignDetails(null);
    } else {
      // Chapter completed
      setViewMode('chapters');
      setSelectedChapter(null);
      setCurrentSceneIndex(0);
    }
  };

  const handlePreviousScene = () => {
    if (currentSceneIndex > 0) {
      setCurrentSceneIndex(currentSceneIndex - 1);
      setShowSignDetails(null);
    }
  };

  const handleBackToChapters = () => {
    setViewMode('chapters');
    setSelectedChapter(null);
    setCurrentSceneIndex(0);
    setShowSignDetails(null);
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner':
        return colors.successColor;
      case 'intermediate':
        return colors.warningColor;
      case 'advanced':
        return '#EF4444';
      default:
        return colors.iconColor;
    }
  };

  // Chapter Selection Screen
  if (viewMode === 'chapters') {
    return (
      <div 
        className="h-full flex flex-col"
        style={{ background: colors.bg, color: colors.textPrimary }}
        role="main"
        aria-labelledby="story-mode-title"
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
              onClick={onExit}
              style={{ color: colors.textSecondary }}
              aria-label="Go back"
            >
              <X className="w-6 h-6" />
            </Button>
            <div className="flex-1 min-w-0">
              <h1 
                id="story-mode-title" 
                className="text-xl sm:text-2xl font-bold"
                style={{ fontFamily: 'Poppins, sans-serif' }}
              >
                Story Mode
              </h1>
              <p className="text-sm" style={{ color: colors.textSecondary }}>
                Learn through interactive stories
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
                {storyChapters.filter(c => !c.isLocked).length}
              </div>
              <div className="text-xs" style={{ color: colors.textSecondary }}>Available</div>
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
                {completedScenes.length}
              </div>
              <div className="text-xs" style={{ color: colors.textSecondary }}>Scenes Done</div>
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
                {storyChapters.reduce((acc, ch) => acc + ch.signsToLearn.length, 0)}
              </div>
              <div className="text-xs" style={{ color: colors.textSecondary }}>Total Signs</div>
            </div>
          </div>
        </div>

        {/* Chapters List */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6">
          <div className="space-y-4">
            {storyChapters.map((chapter, index) => {
              const isAvailable = !chapter.isLocked;
              const requiresPremium = chapter.isPremium && !userProgress.isPremium;

              return (
                <motion.button
                  key={chapter.id}
                  onClick={() => handleChapterSelect(chapter)}
                  disabled={!isAvailable}
                  className="w-full rounded-xl p-5 text-left transition-all"
                  style={{
                    background: colors.cardBg,
                    backdropFilter: colors.blur,
                    WebkitBackdropFilter: colors.blur,
                    border: colors.glassBorder,
                    boxShadow: colors.shadow,
                    opacity: isAvailable ? 1 : 0.6,
                    cursor: isAvailable ? 'pointer' : 'not-allowed',
                  }}
                  onMouseEnter={(e) => isAvailable && (e.currentTarget.style.background = colors.cardHover)}
                  onMouseLeave={(e) => isAvailable && (e.currentTarget.style.background = colors.cardBg)}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  aria-label={`${chapter.title}: ${chapter.description}. ${chapter.difficulty} level, ${chapter.duration}. ${!isAvailable ? 'Locked' : requiresPremium ? 'Premium required' : 'Available'}`}
                  aria-disabled={!isAvailable}
                >
                  <div className="flex items-start gap-4">
                    {/* Chapter Number */}
                    <div 
                      className="w-12 h-12 flex-shrink-0 rounded-xl flex items-center justify-center font-bold text-lg"
                      style={{
                        background: isAvailable 
                          ? `linear-gradient(135deg, ${colors.iconColor}, ${colors.successColor})`
                          : colors.border,
                        color: isAvailable ? '#FFFFFF' : colors.textTertiary,
                      }}
                      aria-hidden="true"
                    >
                      {!isAvailable ? <Lock className="w-5 h-5" /> : index + 1}
                    </div>

                    {/* Chapter Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <h3 className="font-semibold" style={{ color: colors.textPrimary }}>
                          {chapter.title}
                        </h3>
                        {chapter.isPremium && (
                          <span 
                            className="flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold"
                            style={{
                              background: colors.premiumBg,
                              color: colors.premiumColor,
                            }}
                            aria-label="Premium content"
                          >
                            <Sparkles className="w-3 h-3" aria-hidden="true" />
                            Premium
                          </span>
                        )}
                      </div>
                      <p className="text-sm mb-2" style={{ color: colors.textSecondary }}>
                        {chapter.description}
                      </p>
                      <div className="flex items-center gap-3 text-xs flex-wrap" style={{ color: colors.textTertiary }}>
                        <span 
                          className="px-2 py-1 rounded"
                          style={{ 
                            background: `${getDifficultyColor(chapter.difficulty)}20`,
                            color: getDifficultyColor(chapter.difficulty),
                          }}
                        >
                          {chapter.difficulty}
                        </span>
                        <span>{chapter.duration}</span>
                        <span>•</span>
                        <span>{chapter.scenes.length} scenes</span>
                        <span>•</span>
                        <span>{chapter.signsToLearn.length} signs</span>
                      </div>
                      
                      {/* Progress Bar */}
                      {chapter.progress > 0 && (
                        <div className="mt-3">
                          <div 
                            className="h-1.5 rounded-full overflow-hidden"
                            style={{ background: theme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)' }}
                            role="progressbar"
                            aria-valuenow={chapter.progress}
                            aria-valuemin={0}
                            aria-valuemax={100}
                            aria-label={`Chapter progress: ${chapter.progress}%`}
                          >
                            <motion.div
                              className="h-full"
                              style={{ background: colors.successColor }}
                              initial={{ width: 0 }}
                              animate={{ width: `${chapter.progress}%` }}
                            />
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Arrow */}
                    {isAvailable && !requiresPremium && (
                      <ChevronRight className="w-5 h-5 flex-shrink-0" style={{ color: colors.textTertiary }} aria-hidden="true" />
                    )}
                  </div>
                </motion.button>
              );
            })}
          </div>

          {/* Info Box */}
          <div 
            className="mt-6 rounded-xl p-4"
            style={{
              background: colors.iconBg,
              border: `1px solid ${colors.border}`,
            }}
            role="region"
            aria-label="Story mode information"
          >
            <h3 className="font-semibold mb-2 flex items-center gap-2" style={{ color: colors.textPrimary }}>
              <BookOpen className="w-5 h-5" style={{ color: colors.iconColor }} aria-hidden="true" />
              About Story Mode
            </h3>
            <ul className="space-y-2 text-sm" style={{ color: colors.textSecondary }}>
              <li className="flex items-start gap-2">
                <span className="flex-shrink-0" aria-hidden="true">•</span>
                <span>Learn ASL through engaging stories and characters</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="flex-shrink-0" aria-hidden="true">•</span>
                <span>Each chapter teaches new signs in context</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="flex-shrink-0" aria-hidden="true">•</span>
                <span>Complete scenes to unlock new chapters</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="flex-shrink-0" aria-hidden="true">•</span>
                <span>Track your progress and mastered signs</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    );
  }

  // Story View
  if (viewMode === 'story' && selectedChapter) {
    const currentScene = selectedChapter.scenes[currentSceneIndex];
    const character = characters.find(c => c.id === currentScene.characterId);
    const progress = ((currentSceneIndex + 1) / selectedChapter.scenes.length) * 100;

    return (
      <div 
        className="h-full flex flex-col"
        style={{ background: colors.bg, color: colors.textPrimary }}
        role="main"
        aria-labelledby="story-title"
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
              onClick={handleBackToChapters}
              style={{ color: colors.textSecondary }}
              aria-label="Back to chapters"
            >
              <ArrowLeft className="w-6 h-6" />
            </Button>
            <div className="flex-1 min-w-0">
              <h1 id="story-title" className="text-lg font-bold truncate" style={{ fontFamily: 'Poppins, sans-serif' }}>
                {selectedChapter.title}
              </h1>
              <p className="text-sm" style={{ color: colors.textSecondary }}>
                Scene {currentSceneIndex + 1} of {selectedChapter.scenes.length}
              </p>
            </div>
          </div>

          {/* Progress Bar */}
          <div 
            className="h-2 rounded-full overflow-hidden"
            style={{ background: theme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)' }}
            role="progressbar"
            aria-valuenow={currentSceneIndex + 1}
            aria-valuemin={1}
            aria-valuemax={selectedChapter.scenes.length}
            aria-label={`Scene progress: ${currentSceneIndex + 1} of ${selectedChapter.scenes.length}`}
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

        {/* Story Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentScene.id}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.3 }}
            >
              {/* Character Card */}
              <div 
                className="rounded-2xl p-6 mb-6"
                style={{
                  background: `linear-gradient(135deg, ${theme === 'dark' ? colors.iconColor : '#0EA5E9'} 0%, ${theme === 'dark' ? '#A78BFA' : '#8B5CF6'} 100%)`,
                }}
                role="region"
                aria-label={`${character?.name} speaking`}
              >
                <div className="flex items-start gap-4 mb-4">
                  <div 
                    className="text-5xl"
                    role="img"
                    aria-label={character?.name}
                  >
                    {character?.avatar}
                  </div>
                  <div className="flex-1">
                    <h2 className="text-xl font-bold mb-1" style={{ color: theme === 'dark' ? '#0F0F23' : '#FFFFFF' }}>
                      {character?.name}
                    </h2>
                    <p className="text-sm" style={{ color: theme === 'dark' ? 'rgba(15, 15, 35, 0.8)' : 'rgba(255, 255, 255, 0.9)' }}>
                      {character?.description}
                    </p>
                  </div>
                </div>

                {/* Dialogue */}
                <div 
                  className="rounded-xl p-4"
                  style={{
                    background: theme === 'dark' ? 'rgba(15, 15, 35, 0.3)' : 'rgba(255, 255, 255, 0.3)',
                  }}
                >
                  <p className="text-base leading-relaxed" style={{ color: theme === 'dark' ? '#0F0F23' : '#FFFFFF' }}>
                    {currentScene.dialogue}
                  </p>
                </div>
              </div>

              {/* Signs to Learn */}
              <div className="mb-6">
                <h3 className="font-semibold mb-3 flex items-center gap-2" style={{ color: colors.textPrimary }}>
                  <Star className="w-5 h-5" style={{ color: colors.iconColor }} aria-hidden="true" />
                  Signs in This Scene
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {currentScene.signs.map((sign) => (
                    <button
                      key={sign}
                      onClick={() => setShowSignDetails(showSignDetails === sign ? null : sign)}
                      className="rounded-xl p-4 text-left transition-all"
                      style={{
                        background: showSignDetails === sign ? colors.cardHover : colors.cardBg,
                        backdropFilter: colors.blur,
                        WebkitBackdropFilter: colors.blur,
                        border: colors.glassBorder,
                        boxShadow: colors.shadow,
                      }}
                      aria-expanded={showSignDetails === sign}
                      aria-controls={`sign-${sign}-details`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-bold text-lg" style={{ color: colors.iconColor }}>
                          {sign}
                        </span>
                        <ChevronRight 
                          className={`w-5 h-5 transition-transform ${showSignDetails === sign ? 'rotate-90' : ''}`}
                          style={{ color: colors.textTertiary }}
                          aria-hidden="true"
                        />
                      </div>
                      
                      <AnimatePresence>
                        {showSignDetails === sign && (
                          <motion.div
                            id={`sign-${sign}-details`}
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.2 }}
                          >
                            <p className="text-sm leading-relaxed pt-2 border-t" style={{ 
                              color: colors.textSecondary,
                              borderTopColor: colors.border,
                            }}>
                              {currentScene.signDescriptions[sign]}
                            </p>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </button>
                  ))}
                </div>
              </div>

              {/* Scene completed indicator */}
              {completedScenes.includes(currentScene.id) && (
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
                    Scene Completed!
                  </span>
                </motion.div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Footer Navigation */}
        <div 
          className="p-4 sm:p-6 border-t"
          style={{ borderTopColor: colors.border }}
        >
          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={handlePreviousScene}
              disabled={currentSceneIndex === 0}
              className="flex-1 h-12 rounded-full font-semibold"
              style={{
                background: colors.cardBg,
                borderColor: colors.border,
                color: colors.textPrimary,
                opacity: currentSceneIndex === 0 ? 0.5 : 1,
              }}
              aria-label="Previous scene"
            >
              Previous
            </Button>
            <Button
              onClick={handleNextScene}
              className="flex-1 h-12 rounded-full font-semibold"
              style={{
                background: colors.iconColor,
                color: theme === 'dark' ? '#0F0F23' : '#FFFFFF',
              }}
              aria-label={currentSceneIndex < selectedChapter.scenes.length - 1 ? 'Next scene' : 'Complete chapter'}
            >
              {currentSceneIndex < selectedChapter.scenes.length - 1 ? (
                <>
                  Next Scene
                  <ChevronRight className="w-5 h-5 ml-2" aria-hidden="true" />
                </>
              ) : (
                <>
                  Complete Chapter
                  <Trophy className="w-5 h-5 ml-2" aria-hidden="true" />
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return null;
}
