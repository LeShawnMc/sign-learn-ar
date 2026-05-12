import { useState } from 'react';
import { Button } from './ui/button';
import { useTheme } from '../context/ThemeContext';
import { useApp } from '../context/AppContext';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, 
  Book, 
  Video, 
  HelpCircle, 
  Wrench, 
  Target, 
  ChevronRight,
  ChevronDown,
  Search,
  Play,
  Camera,
  Hand,
  AlertCircle,
  CheckCircle,
  Sliders,
  Zap,
  Info,
  ExternalLink,
  Download,
  RefreshCw,
  Settings,
  Eye,
  Lightbulb,
  ArrowRight,
} from 'lucide-react';

interface TutorialHelpCenterProps {
  onExit: () => void;
}

interface Tutorial {
  id: string;
  title: string;
  description: string;
  category: string;
  duration: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  steps: string[];
  videoId?: string;
}

interface FAQ {
  id: string;
  question: string;
  answer: string;
  category: string;
  tags: string[];
}

interface TroubleshootingGuide {
  id: string;
  problem: string;
  symptoms: string[];
  solutions: string[];
  category: string;
}

const tutorials: Tutorial[] = [
  {
    id: 'ar-setup',
    title: 'Setting Up AR Mode',
    description: 'Learn how to enable and configure AR hand tracking',
    category: 'AR Features',
    duration: '5 min',
    difficulty: 'beginner',
    steps: [
      'Tap the AR Mode button from Quick Actions',
      'Allow camera access when prompted',
      'Position your hand in front of the camera within the outlined area',
      'Ensure good lighting for optimal tracking',
      'Complete the calibration by making the requested gestures',
      'Start practicing with AR feedback',
    ],
    videoId: 'ar-setup-tutorial',
  },
  {
    id: 'hand-tracking',
    title: 'Optimizing Hand Tracking',
    description: 'Get the best AR hand tracking performance',
    category: 'AR Features',
    duration: '7 min',
    difficulty: 'intermediate',
    steps: [
      'Find a well-lit area with natural or bright lighting',
      'Position yourself 2-3 feet from the camera',
      'Ensure plain background behind you (avoid busy patterns)',
      'Keep your hand clearly visible within the tracking zone',
      'Wear contrasting colors to your background',
      'Adjust tracking sensitivity in Accessibility Settings',
      'Recalibrate if tracking becomes inaccurate',
    ],
    videoId: 'hand-tracking-optimization',
  },
  {
    id: 'ar-calibration',
    title: 'Hand Tracking Calibration',
    description: 'Calibrate hand tracking for accurate sign recognition',
    category: 'AR Features',
    duration: '3 min',
    difficulty: 'beginner',
    steps: [
      'Go to Settings > Accessibility > AR Hand Tracking',
      'Tap "Calibrate Hand Tracking"',
      'Hold your hand flat, palm facing camera',
      'Make a fist when prompted',
      'Show all five fingers spread apart',
      'Complete the thumbs up gesture',
      'Save calibration profile',
    ],
    videoId: 'calibration-guide',
  },
  {
    id: 'ar-practice',
    title: 'Practicing Signs in AR',
    description: 'Use AR mode to practice and perfect your signs',
    category: 'AR Features',
    duration: '8 min',
    difficulty: 'beginner',
    steps: [
      'Start any lesson or practice session',
      'Enable AR mode from the practice screen',
      'Watch the demonstration video first',
      'Position your hand to match the guide overlay',
      'Perform the sign while AR tracks your movement',
      'Review real-time feedback (green = correct, red = needs work)',
      'Repeat until you achieve high accuracy',
      'Use slow-motion playback to review your attempt',
    ],
    videoId: 'ar-practice-tutorial',
  },
  {
    id: 'daily-practice',
    title: 'Daily Practice Routine',
    description: 'Build an effective daily practice routine',
    category: 'Learning',
    duration: '6 min',
    difficulty: 'beginner',
    steps: [
      'Set your daily goal in Personalization settings',
      'Start with Daily Practice from Quick Actions',
      'Review vocabulary from previous sessions',
      'Learn 3-5 new signs each day',
      'Practice in AR mode for better retention',
      'Complete a short quiz to test yourself',
      'Track your progress in the dashboard',
    ],
  },
  {
    id: 'vocabulary-review',
    title: 'Using Spaced Repetition',
    description: 'Master vocabulary with spaced repetition review',
    category: 'Learning',
    duration: '5 min',
    difficulty: 'intermediate',
    steps: [
      'Open Vocabulary Review from Quick Actions',
      'Review cards marked as "Due for Review"',
      'Rate your confidence for each sign (Easy/Good/Hard)',
      'Focus on signs marked as "Hard"',
      'Review recommended 2-3 times per week',
      'Track mastery level in your progress dashboard',
    ],
  },
  {
    id: 'lesson-library',
    title: 'Navigating the Lesson Library',
    description: 'Find and organize your learning content',
    category: 'Learning',
    duration: '4 min',
    difficulty: 'beginner',
    steps: [
      'Access Lesson Library from the Learn tab',
      'Browse by category (Greetings, Family, Food, etc.)',
      'Use filters to find content by difficulty level',
      'Bookmark lessons to save for later',
      'Track completion progress for each lesson',
      'Download lessons for offline access (Premium)',
    ],
  },
  {
    id: 'social-practice',
    title: 'Joining Social Practice Rooms',
    description: 'Practice with other learners in real-time',
    category: 'Social',
    duration: '6 min',
    difficulty: 'intermediate',
    steps: [
      'Go to Social Practice from Quick Actions',
      'Browse available practice rooms by topic',
      'Join a room or create your own',
      'Turn on your camera to practice together',
      'Take turns signing and giving feedback',
      'Use the chat for questions and tips',
      'End session and review your performance',
    ],
  },
  {
    id: 'certification',
    title: 'Earning ASL Certifications',
    description: 'Prepare for and complete certification exams',
    category: 'Testing',
    duration: '10 min',
    difficulty: 'advanced',
    steps: [
      'Visit the Certification Center',
      'Review requirements for your target certification',
      'Complete prerequisite lessons and practice sessions',
      'Take the practice exam to assess readiness',
      'Schedule your official certification exam',
      'Complete all sections within the time limit',
      'Receive your digital certificate upon passing',
      'Share your achievement on the community feed',
    ],
  },
];

const faqs: FAQ[] = [
  {
    id: 'faq-1',
    question: 'How do I enable AR hand tracking?',
    answer: 'To enable AR hand tracking, tap any practice session and look for the AR Mode button. Make sure to allow camera access when prompted. Position your hand in good lighting for best results.',
    category: 'AR Features',
    tags: ['ar', 'camera', 'tracking'],
  },
  {
    id: 'faq-2',
    question: 'Why isn\'t hand tracking working?',
    answer: 'Hand tracking requires good lighting, a clear background, and camera permissions. Check that your camera is enabled in device settings, ensure you\'re in a well-lit area, and try recalibrating your hand tracking in Settings > Accessibility > AR Hand Tracking.',
    category: 'Troubleshooting',
    tags: ['tracking', 'camera', 'issues'],
  },
  {
    id: 'faq-3',
    question: 'Can I practice offline?',
    answer: 'Premium members can download lessons for offline practice. Go to any lesson, tap the download button, and access it anytime without internet connection. Downloaded content includes videos, descriptions, and practice exercises.',
    category: 'Features',
    tags: ['offline', 'download', 'premium'],
  },
  {
    id: 'faq-4',
    question: 'How accurate is the hand tracking?',
    answer: 'Our AR hand tracking uses advanced ML models with 95%+ accuracy in optimal conditions. Accuracy depends on lighting, camera quality, and proper calibration. For best results, practice in good lighting with a plain background.',
    category: 'AR Features',
    tags: ['accuracy', 'tracking', 'ar'],
  },
  {
    id: 'faq-5',
    question: 'What\'s the difference between ASL and BSL?',
    answer: 'ASL (American Sign Language) and BSL (British Sign Language) are completely different languages with distinct grammar, vocabulary, and syntax. Despite both being sign languages, they are mutually unintelligible. Choose the one most relevant to your community.',
    category: 'Languages',
    tags: ['asl', 'bsl', 'languages'],
  },
  {
    id: 'faq-6',
    question: 'How do I improve my signing speed?',
    answer: 'Practice regularly with our Speed Training mode. Start slow to ensure accuracy, then gradually increase speed as you gain confidence. Use the metronome feature to practice at different tempos and track your progress over time.',
    category: 'Learning',
    tags: ['practice', 'speed', 'improvement'],
  },
  {
    id: 'faq-7',
    question: 'Can I learn multiple sign languages?',
    answer: 'Yes! Premium members can learn up to 5 sign languages simultaneously. Access Language Selection in settings to add additional languages. Each language has separate progress tracking and personalized recommendations.',
    category: 'Features',
    tags: ['languages', 'premium', 'learning'],
  },
  {
    id: 'faq-8',
    question: 'How long until I\'m fluent?',
    answer: 'Fluency timelines vary by commitment level. With 15-30 minutes daily practice, expect basic conversational skills in 3-6 months, intermediate fluency in 6-12 months, and advanced proficiency in 12-24 months. Consistent practice is key!',
    category: 'Learning',
    tags: ['fluency', 'timeline', 'goals'],
  },
  {
    id: 'faq-9',
    question: 'Are certifications recognized?',
    answer: 'Our certifications are aligned with CEFR standards (A1-C2) and recognized by many educational institutions. While not official interpreter certifications, they demonstrate your proficiency level and commitment to learning.',
    category: 'Certification',
    tags: ['certification', 'recognition', 'credentials'],
  },
  {
    id: 'faq-10',
    question: 'How do I cancel my subscription?',
    answer: 'Go to Settings > Subscription Management to cancel anytime. You\'ll retain premium access until the end of your billing period. Your progress and data are saved and will be available if you resubscribe.',
    category: 'Account',
    tags: ['subscription', 'cancel', 'billing'],
  },
  {
    id: 'faq-11',
    question: 'Why do some signs look different?',
    answer: 'Sign languages have regional variations just like spoken languages. Signs can vary by region, community, and even age group. We show the most common variant first, with regional alternatives available in lesson details.',
    category: 'Languages',
    tags: ['variants', 'regional', 'differences'],
  },
  {
    id: 'faq-12',
    question: 'Can I practice with a friend?',
    answer: 'Absolutely! Use Social Practice Rooms to practice with friends or other learners. You can create private rooms with invite codes or join public rooms by topic. Video chat and screen sharing make it easy to practice together.',
    category: 'Social',
    tags: ['friends', 'practice', 'social'],
  },
];

const troubleshootingGuides: TroubleshootingGuide[] = [
  {
    id: 'trouble-1',
    problem: 'Camera not working in AR mode',
    symptoms: [
      'Black screen when AR mode is enabled',
      'Camera permission denied message',
      'App crashes when accessing camera',
    ],
    solutions: [
      'Check camera permissions: Settings > Privacy > Camera > Sign Learn AR (Enable)',
      'Close other apps that might be using the camera',
      'Restart the app completely',
      'Update to the latest version of Sign Learn AR',
      'Check if your device camera is working in other apps',
      'Clear app cache: Settings > Apps > Sign Learn AR > Clear Cache',
    ],
    category: 'Camera Issues',
  },
  {
    id: 'trouble-2',
    problem: 'Hand tracking is inaccurate',
    symptoms: [
      'Signs not being recognized correctly',
      'Hand outline doesn\'t match your hand position',
      'Tracking freezes or lags',
    ],
    solutions: [
      'Ensure you\'re in a well-lit area (natural light works best)',
      'Position yourself 2-3 feet from the camera',
      'Use a plain, contrasting background',
      'Recalibrate hand tracking: Settings > Accessibility > Calibrate Hand Tracking',
      'Increase tracking sensitivity: Settings > Accessibility > Tracking Sensitivity',
      'Clean your camera lens',
      'Ensure your device meets minimum AR requirements',
    ],
    category: 'AR Tracking',
  },
  {
    id: 'trouble-3',
    problem: 'App running slowly or lagging',
    symptoms: [
      'Choppy video playback',
      'Delayed response to taps',
      'AR tracking stuttering',
    ],
    solutions: [
      'Close background apps to free up memory',
      'Lower AR quality: Settings > Accessibility > AR Quality > Medium or Low',
      'Disable animations: Settings > Accessibility > Reduce Motion',
      'Clear app cache and restart',
      'Ensure you have stable internet connection for streaming content',
      'Download lessons for offline use to reduce streaming',
      'Update your device OS to the latest version',
    ],
    category: 'Performance',
  },
  {
    id: 'trouble-4',
    problem: 'Audio or video not playing',
    symptoms: [
      'No sound during video lessons',
      'Video player shows loading indefinitely',
      'Black screen on video playback',
    ],
    solutions: [
      'Check device volume and mute switch',
      'Ensure internet connection is stable',
      'Try switching between WiFi and cellular data',
      'Close and reopen the app',
      'Check if video downloads are corrupted (delete and re-download)',
      'Update the app to the latest version',
      'Try a different video to isolate the issue',
    ],
    category: 'Media Playback',
  },
  {
    id: 'trouble-5',
    problem: 'Progress not syncing',
    symptoms: [
      'Completed lessons not showing as done',
      'Streak count not updating',
      'Achievements not unlocking',
    ],
    solutions: [
      'Ensure you\'re logged into your account',
      'Check internet connection',
      'Force sync: Settings > Account > Sync Progress',
      'Log out and log back in',
      'Check if you\'re using the same account on multiple devices',
      'Contact support if progress is consistently not saving',
    ],
    category: 'Sync Issues',
  },
  {
    id: 'trouble-6',
    problem: 'Premium features not accessible',
    symptoms: [
      'Premium content showing as locked',
      'Can\'t access downloaded lessons',
      'Subscription shows as inactive',
    ],
    solutions: [
      'Verify your subscription status: Settings > Subscription Management',
      'Restore purchases: Settings > Account > Restore Purchases',
      'Check if payment went through in your app store account',
      'Log out and log back in to refresh subscription status',
      'Contact support with your receipt/order number',
    ],
    category: 'Subscription',
  },
  {
    id: 'trouble-7',
    problem: 'AR mode drains battery quickly',
    symptoms: [
      'Battery drops rapidly during AR practice',
      'Device gets hot during AR sessions',
    ],
    solutions: [
      'Lower AR quality settings to reduce processing load',
      'Practice in shorter sessions (10-15 min) with breaks',
      'Close background apps before AR practice',
      'Enable Low Power Mode: Settings > Accessibility > Low Power AR Mode',
      'Ensure your device is not in a hot environment',
      'Consider practicing with device plugged in for long sessions',
    ],
    category: 'Battery',
  },
];

export function TutorialHelpCenter({ onExit }: TutorialHelpCenterProps) {
  const { theme } = useTheme();
  const { userProgress } = useApp();
  const [activeTab, setActiveTab] = useState<'tutorials' | 'faq' | 'troubleshooting' | 'calibration'>('tutorials');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTutorial, setSelectedTutorial] = useState<Tutorial | null>(null);
  const [expandedFAQ, setExpandedFAQ] = useState<string | null>(null);
  const [expandedTrouble, setExpandedTrouble] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [calibrationStep, setCalibrationStep] = useState(0);
  const [isCalibrating, setIsCalibrating] = useState(false);

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
        accentBg: 'rgba(168, 85, 247, 0.1)',
        accentColor: '#A855F7',
        successBg: 'rgba(34, 197, 94, 0.1)',
        successColor: '#22C55E',
        warningBg: 'rgba(251, 191, 36, 0.1)',
        warningColor: '#FBD500',
        errorBg: 'rgba(239, 68, 68, 0.1)',
        errorColor: '#EF4444',
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
        accentBg: 'rgba(168, 85, 247, 0.1)',
        accentColor: '#A855F7',
        successBg: 'rgba(34, 197, 94, 0.1)',
        successColor: '#22C55E',
        warningBg: 'rgba(251, 191, 36, 0.1)',
        warningColor: '#F59E0B',
        errorBg: 'rgba(239, 68, 68, 0.1)',
        errorColor: '#EF4444',
        blur: 'blur(20px)',
        shadow: '0 8px 32px rgba(31, 38, 135, 0.15)',
        glassBorder: '1px solid rgba(255, 255, 255, 0.6)',
      };

  // Filter content based on search and category
  const filteredTutorials = tutorials.filter(tutorial => {
    const matchesSearch = tutorial.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         tutorial.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || tutorial.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const filteredFAQs = faqs.filter(faq => {
    const matchesSearch = faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         faq.answer.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         faq.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCategory = selectedCategory === 'all' || faq.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const filteredTroubleshooting = troubleshootingGuides.filter(guide => {
    const matchesSearch = guide.problem.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         guide.symptoms.some(s => s.toLowerCase().includes(searchQuery.toLowerCase())) ||
                         guide.solutions.some(s => s.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCategory = selectedCategory === 'all' || guide.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Get unique categories
  const tutorialCategories = ['all', ...Array.from(new Set(tutorials.map(t => t.category)))];
  const faqCategories = ['all', ...Array.from(new Set(faqs.map(f => f.category)))];
  const troubleCategories = ['all', ...Array.from(new Set(troubleshootingGuides.map(t => t.category)))];

  const calibrationSteps = [
    {
      title: 'Position Your Hand',
      description: 'Hold your hand flat, palm facing the camera',
      icon: Hand,
      instruction: 'Keep your hand centered in the frame with all fingers visible',
    },
    {
      title: 'Make a Fist',
      description: 'Close your hand into a fist',
      icon: Hand,
      instruction: 'Keep your thumb outside the fist, clearly visible',
    },
    {
      title: 'Spread Fingers',
      description: 'Show all five fingers spread apart',
      icon: Hand,
      instruction: 'Spread your fingers as wide as comfortable',
    },
    {
      title: 'Thumbs Up',
      description: 'Make a thumbs up gesture',
      icon: Hand,
      instruction: 'Extend your thumb while keeping other fingers closed',
    },
    {
      title: 'Calibration Complete',
      description: 'Your hand tracking is now calibrated',
      icon: CheckCircle,
      instruction: 'You can now use AR mode with improved accuracy',
    },
  ];

  const handleStartCalibration = () => {
    setIsCalibrating(true);
    setCalibrationStep(0);
  };

  const handleNextCalibrationStep = () => {
    if (calibrationStep < calibrationSteps.length - 1) {
      setCalibrationStep(calibrationStep + 1);
    } else {
      setIsCalibrating(false);
      setCalibrationStep(0);
    }
  };

  const getDifficultyColor = (difficulty: Tutorial['difficulty']) => {
    switch (difficulty) {
      case 'beginner': return colors.successColor;
      case 'intermediate': return colors.iconColor;
      case 'advanced': return colors.accentColor;
    }
  };

  // Tutorial Detail View
  if (selectedTutorial) {
    return (
      <div 
        className="h-full flex flex-col"
        style={{ background: colors.bg, color: colors.textPrimary }}
        role="main"
        aria-labelledby="tutorial-detail-title"
      >
        {/* Header */}
        <div 
          className="p-4 sm:p-6 border-b"
          style={{ borderBottomColor: colors.border }}
        >
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSelectedTutorial(null)}
              style={{ color: colors.textSecondary }}
              aria-label="Back to tutorials"
            >
              <X className="w-6 h-6" />
            </Button>
            <div className="flex-1 min-w-0">
              <div 
                className="px-2 py-1 rounded-full text-xs font-semibold inline-block mb-2"
                style={{ 
                  background: `${getDifficultyColor(selectedTutorial.difficulty)}20`,
                  color: getDifficultyColor(selectedTutorial.difficulty),
                }}
              >
                {selectedTutorial.difficulty}
              </div>
              <h1 
                id="tutorial-detail-title" 
                className="text-xl sm:text-2xl font-bold"
                style={{ fontFamily: 'Poppins, sans-serif' }}
              >
                {selectedTutorial.title}
              </h1>
              <p className="text-sm mt-1" style={{ color: colors.textSecondary }}>
                {selectedTutorial.duration} • {selectedTutorial.category}
              </p>
            </div>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6">
          {/* Video Player Placeholder */}
          {selectedTutorial.videoId && (
            <div 
              className="rounded-xl mb-6 relative overflow-hidden aspect-video flex items-center justify-center"
              style={{ background: colors.cardBg }}
              role="img"
              aria-label="Tutorial video"
            >
              <div 
                className="absolute inset-0 flex items-center justify-center"
                style={{ background: 'rgba(0, 0, 0, 0.5)' }}
              >
                <Button
                  className="w-16 h-16 rounded-full"
                  style={{ background: colors.iconColor }}
                  aria-label="Play video tutorial"
                >
                  <Play className="w-8 h-8 text-white" />
                </Button>
              </div>
              <div 
                className="absolute bottom-4 left-4 right-4 text-white text-sm"
                style={{ textShadow: '0 2px 4px rgba(0,0,0,0.5)' }}
              >
                {selectedTutorial.title} - Video Tutorial
              </div>
            </div>
          )}

          {/* Description */}
          <div 
            className="rounded-xl p-4 mb-6"
            style={{
              background: colors.cardBg,
              backdropFilter: colors.blur,
              WebkitBackdropFilter: colors.blur,
              border: colors.glassBorder,
              boxShadow: colors.shadow,
            }}
          >
            <h2 className="text-lg font-semibold mb-2" style={{ color: colors.textPrimary }}>
              About This Tutorial
            </h2>
            <p className="text-sm" style={{ color: colors.textSecondary }}>
              {selectedTutorial.description}
            </p>
          </div>

          {/* Steps */}
          <div>
            <h2 className="text-lg font-semibold mb-4" style={{ color: colors.textPrimary }}>
              Step-by-Step Guide
            </h2>
            <div className="space-y-3">
              {selectedTutorial.steps.map((step, index) => (
                <motion.div
                  key={index}
                  className="rounded-xl p-4"
                  style={{
                    background: colors.cardBg,
                    backdropFilter: colors.blur,
                    WebkitBackdropFilter: colors.blur,
                    border: colors.glassBorder,
                    boxShadow: colors.shadow,
                  }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <div className="flex gap-3">
                    <div 
                      className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 font-semibold"
                      style={{ background: colors.iconBg, color: colors.iconColor }}
                      aria-label={`Step ${index + 1}`}
                    >
                      {index + 1}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm" style={{ color: colors.textPrimary }}>
                        {step}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div 
      className="h-full flex flex-col"
      style={{ background: colors.bg, color: colors.textPrimary }}
      role="main"
      aria-labelledby="help-center-title"
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
            aria-label="Close help center"
          >
            <X className="w-6 h-6" />
          </Button>
          <div className="flex-1 min-w-0">
            <h1 
              id="help-center-title" 
              className="text-xl sm:text-2xl font-bold"
              style={{ fontFamily: 'Poppins, sans-serif' }}
            >
              Help Center
            </h1>
            <p className="text-sm" style={{ color: colors.textSecondary }}>
              Tutorials, guides, and support
            </p>
          </div>
        </div>

        {/* Search Bar */}
        <div className="relative">
          <Search 
            className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5" 
            style={{ color: colors.textTertiary }}
            aria-hidden="true"
          />
          <input
            type="search"
            placeholder="Search help topics..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 rounded-xl text-sm"
            style={{
              background: colors.cardBg,
              color: colors.textPrimary,
              border: colors.glassBorder,
            }}
            aria-label="Search help topics"
          />
        </div>

        {/* Tabs */}
        <div 
          className="flex gap-2 mt-4 overflow-x-auto"
          role="tablist"
          aria-label="Help center sections"
        >
          {[
            { id: 'tutorials', label: 'Tutorials', icon: Book },
            { id: 'faq', label: 'FAQ', icon: HelpCircle },
            { id: 'troubleshooting', label: 'Troubleshooting', icon: Wrench },
            { id: 'calibration', label: 'Calibration', icon: Sliders },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id as any);
                  setSelectedCategory('all');
                }}
                className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold whitespace-nowrap transition-all"
                style={{
                  background: isActive ? colors.iconBg : 'transparent',
                  color: isActive ? colors.iconColor : colors.textSecondary,
                  border: isActive ? `2px solid ${colors.iconColor}` : 'none',
                }}
                role="tab"
                aria-selected={isActive}
                aria-controls={`${tab.id}-panel`}
              >
                <Icon className="w-4 h-4" aria-hidden="true" />
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6">
        {/* Tutorials Tab */}
        {activeTab === 'tutorials' && (
          <div id="tutorials-panel" role="tabpanel">
            {/* Category Filter */}
            <div className="mb-4">
              <div className="flex gap-2 overflow-x-auto pb-2">
                {tutorialCategories.map((category) => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className="px-4 py-2 rounded-full text-sm font-semibold whitespace-nowrap transition-all"
                    style={{
                      background: selectedCategory === category ? colors.accentBg : colors.cardBg,
                      color: selectedCategory === category ? colors.accentColor : colors.textSecondary,
                    }}
                    aria-pressed={selectedCategory === category}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>

            {/* Tutorials List */}
            <div className="space-y-3">
              {filteredTutorials.map((tutorial, index) => (
                <motion.button
                  key={tutorial.id}
                  onClick={() => setSelectedTutorial(tutorial)}
                  className="w-full rounded-xl p-4 text-left transition-all"
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
                  aria-label={`${tutorial.title}, ${tutorial.duration}, ${tutorial.difficulty} difficulty`}
                >
                  <div className="flex items-start gap-3">
                    <div 
                      className="w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0"
                      style={{ background: colors.iconBg }}
                      aria-hidden="true"
                    >
                      {tutorial.videoId ? (
                        <Video className="w-6 h-6" style={{ color: colors.iconColor }} />
                      ) : (
                        <Book className="w-6 h-6" style={{ color: colors.iconColor }} />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold" style={{ color: colors.textPrimary }}>
                          {tutorial.title}
                        </h3>
                        <div 
                          className="px-2 py-0.5 rounded-full text-xs font-semibold"
                          style={{ 
                            background: `${getDifficultyColor(tutorial.difficulty)}20`,
                            color: getDifficultyColor(tutorial.difficulty),
                          }}
                        >
                          {tutorial.difficulty}
                        </div>
                      </div>
                      <p className="text-sm mb-2" style={{ color: colors.textSecondary }}>
                        {tutorial.description}
                      </p>
                      <div className="flex items-center gap-3 text-xs" style={{ color: colors.textTertiary }}>
                        <span>{tutorial.duration}</span>
                        <span>•</span>
                        <span>{tutorial.category}</span>
                        <span>•</span>
                        <span>{tutorial.steps.length} steps</span>
                      </div>
                    </div>
                    <ChevronRight className="w-5 h-5 flex-shrink-0" style={{ color: colors.textTertiary }} aria-hidden="true" />
                  </div>
                </motion.button>
              ))}

              {filteredTutorials.length === 0 && (
                <div 
                  className="rounded-xl p-8 text-center"
                  style={{ background: colors.cardBg }}
                >
                  <Info className="w-12 h-12 mx-auto mb-3" style={{ color: colors.textTertiary }} aria-hidden="true" />
                  <p className="text-sm" style={{ color: colors.textSecondary }}>
                    No tutorials found matching your search.
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* FAQ Tab */}
        {activeTab === 'faq' && (
          <div id="faq-panel" role="tabpanel">
            {/* Category Filter */}
            <div className="mb-4">
              <div className="flex gap-2 overflow-x-auto pb-2">
                {faqCategories.map((category) => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className="px-4 py-2 rounded-full text-sm font-semibold whitespace-nowrap transition-all"
                    style={{
                      background: selectedCategory === category ? colors.accentBg : colors.cardBg,
                      color: selectedCategory === category ? colors.accentColor : colors.textSecondary,
                    }}
                    aria-pressed={selectedCategory === category}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>

            {/* FAQ List */}
            <div className="space-y-3">
              {filteredFAQs.map((faq, index) => {
                const isExpanded = expandedFAQ === faq.id;
                
                return (
                  <motion.div
                    key={faq.id}
                    className="rounded-xl overflow-hidden"
                    style={{
                      background: colors.cardBg,
                      backdropFilter: colors.blur,
                      WebkitBackdropFilter: colors.blur,
                      border: colors.glassBorder,
                      boxShadow: colors.shadow,
                    }}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <button
                      onClick={() => setExpandedFAQ(isExpanded ? null : faq.id)}
                      className="w-full p-4 text-left flex items-start gap-3 transition-colors"
                      onMouseEnter={(e) => e.currentTarget.style.background = colors.cardHover}
                      onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                      aria-expanded={isExpanded}
                      aria-controls={`faq-answer-${faq.id}`}
                    >
                      <HelpCircle 
                        className="w-5 h-5 flex-shrink-0 mt-0.5" 
                        style={{ color: colors.iconColor }}
                        aria-hidden="true"
                      />
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold mb-1" style={{ color: colors.textPrimary }}>
                          {faq.question}
                        </h3>
                        <div className="flex items-center gap-2">
                          {faq.tags.map((tag, i) => (
                            <span 
                              key={i}
                              className="text-xs px-2 py-0.5 rounded-full"
                              style={{ background: colors.iconBg, color: colors.iconColor }}
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                      <ChevronDown 
                        className={`w-5 h-5 flex-shrink-0 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                        style={{ color: colors.textTertiary }}
                        aria-hidden="true"
                      />
                    </button>
                    
                    <AnimatePresence>
                      {isExpanded && (
                        <motion.div
                          id={`faq-answer-${faq.id}`}
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="overflow-hidden"
                        >
                          <div 
                            className="px-4 pb-4 pl-12 text-sm"
                            style={{ color: colors.textSecondary }}
                          >
                            {faq.answer}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                );
              })}

              {filteredFAQs.length === 0 && (
                <div 
                  className="rounded-xl p-8 text-center"
                  style={{ background: colors.cardBg }}
                >
                  <Info className="w-12 h-12 mx-auto mb-3" style={{ color: colors.textTertiary }} aria-hidden="true" />
                  <p className="text-sm" style={{ color: colors.textSecondary }}>
                    No FAQs found matching your search.
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Troubleshooting Tab */}
        {activeTab === 'troubleshooting' && (
          <div id="troubleshooting-panel" role="tabpanel">
            {/* Category Filter */}
            <div className="mb-4">
              <div className="flex gap-2 overflow-x-auto pb-2">
                {troubleCategories.map((category) => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className="px-4 py-2 rounded-full text-sm font-semibold whitespace-nowrap transition-all"
                    style={{
                      background: selectedCategory === category ? colors.accentBg : colors.cardBg,
                      color: selectedCategory === category ? colors.accentColor : colors.textSecondary,
                    }}
                    aria-pressed={selectedCategory === category}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>

            {/* Troubleshooting List */}
            <div className="space-y-3">
              {filteredTroubleshooting.map((guide, index) => {
                const isExpanded = expandedTrouble === guide.id;
                
                return (
                  <motion.div
                    key={guide.id}
                    className="rounded-xl overflow-hidden"
                    style={{
                      background: colors.cardBg,
                      backdropFilter: colors.blur,
                      WebkitBackdropFilter: colors.blur,
                      border: colors.glassBorder,
                      boxShadow: colors.shadow,
                    }}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <button
                      onClick={() => setExpandedTrouble(isExpanded ? null : guide.id)}
                      className="w-full p-4 text-left flex items-start gap-3 transition-colors"
                      onMouseEnter={(e) => e.currentTarget.style.background = colors.cardHover}
                      onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                      aria-expanded={isExpanded}
                      aria-controls={`trouble-solution-${guide.id}`}
                    >
                      <AlertCircle 
                        className="w-5 h-5 flex-shrink-0 mt-0.5" 
                        style={{ color: colors.warningColor }}
                        aria-hidden="true"
                      />
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold mb-1" style={{ color: colors.textPrimary }}>
                          {guide.problem}
                        </h3>
                        <p className="text-sm" style={{ color: colors.textSecondary }}>
                          {guide.symptoms.length} symptoms • {guide.solutions.length} solutions
                        </p>
                      </div>
                      <ChevronDown 
                        className={`w-5 h-5 flex-shrink-0 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                        style={{ color: colors.textTertiary }}
                        aria-hidden="true"
                      />
                    </button>
                    
                    <AnimatePresence>
                      {isExpanded && (
                        <motion.div
                          id={`trouble-solution-${guide.id}`}
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="overflow-hidden"
                        >
                          <div className="px-4 pb-4 pl-12">
                            {/* Symptoms */}
                            <div className="mb-4">
                              <h4 className="font-semibold text-sm mb-2" style={{ color: colors.textPrimary }}>
                                Symptoms:
                              </h4>
                              <ul className="space-y-1" role="list">
                                {guide.symptoms.map((symptom, i) => (
                                  <li key={i} className="text-sm flex items-start gap-2" style={{ color: colors.textSecondary }}>
                                    <span className="text-xs mt-1" aria-hidden="true">•</span>
                                    <span>{symptom}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>

                            {/* Solutions */}
                            <div>
                              <h4 className="font-semibold text-sm mb-2" style={{ color: colors.textPrimary }}>
                                Solutions:
                              </h4>
                              <ol className="space-y-2" role="list">
                                {guide.solutions.map((solution, i) => (
                                  <li key={i} className="text-sm flex items-start gap-2" style={{ color: colors.textSecondary }}>
                                    <span 
                                      className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-semibold mt-0.5"
                                      style={{ background: colors.successBg, color: colors.successColor }}
                                      aria-label={`Solution ${i + 1}`}
                                    >
                                      {i + 1}
                                    </span>
                                    <span>{solution}</span>
                                  </li>
                                ))}
                              </ol>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                );
              })}

              {filteredTroubleshooting.length === 0 && (
                <div 
                  className="rounded-xl p-8 text-center"
                  style={{ background: colors.cardBg }}
                >
                  <Info className="w-12 h-12 mx-auto mb-3" style={{ color: colors.textTertiary }} aria-hidden="true" />
                  <p className="text-sm" style={{ color: colors.textSecondary }}>
                    No troubleshooting guides found matching your search.
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Calibration Tab */}
        {activeTab === 'calibration' && (
          <div id="calibration-panel" role="tabpanel">
            {!isCalibrating ? (
              <>
                {/* Calibration Info */}
                <div 
                  className="rounded-xl p-6 mb-6"
                  style={{
                    background: colors.iconBg,
                    border: colors.glassBorder,
                  }}
                >
                  <div className="flex items-start gap-3 mb-4">
                    <Lightbulb className="w-6 h-6 flex-shrink-0 mt-0.5" style={{ color: colors.iconColor }} aria-hidden="true" />
                    <div>
                      <h2 className="font-semibold mb-2" style={{ color: colors.textPrimary }}>
                        Hand Tracking Calibration
                      </h2>
                      <p className="text-sm" style={{ color: colors.textSecondary }}>
                        Calibrate your hand tracking for improved accuracy in AR mode. This process takes about 2 minutes and helps the app recognize your hand shape and movements more precisely.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Calibration Tips */}
                <div className="mb-6">
                  <h3 className="text-lg font-semibold mb-4" style={{ color: colors.textPrimary }}>
                    Before You Start
                  </h3>
                  <div className="space-y-3">
                    {[
                      { icon: Eye, title: 'Good Lighting', description: 'Find a well-lit area with natural or bright artificial light' },
                      { icon: Camera, title: 'Clear Background', description: 'Use a plain background without busy patterns or movement' },
                      { icon: Hand, title: 'Hand Position', description: 'Stay 2-3 feet from camera with hand clearly visible' },
                      { icon: Settings, title: 'Remove Accessories', description: 'Take off rings, bracelets, or gloves that might affect tracking' },
                    ].map((tip, index) => {
                      const Icon = tip.icon;
                      return (
                        <div
                          key={index}
                          className="rounded-xl p-4"
                          style={{
                            background: colors.cardBg,
                            backdropFilter: colors.blur,
                            WebkitBackdropFilter: colors.blur,
                            border: colors.glassBorder,
                            boxShadow: colors.shadow,
                          }}
                        >
                          <div className="flex items-start gap-3">
                            <div 
                              className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                              style={{ background: colors.iconBg }}
                              aria-hidden="true"
                            >
                              <Icon className="w-5 h-5" style={{ color: colors.iconColor }} />
                            </div>
                            <div className="flex-1">
                              <div className="font-semibold mb-1" style={{ color: colors.textPrimary }}>
                                {tip.title}
                              </div>
                              <p className="text-sm" style={{ color: colors.textSecondary }}>
                                {tip.description}
                              </p>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Start Calibration Button */}
                <Button
                  onClick={handleStartCalibration}
                  className="w-full h-14 rounded-full font-semibold text-lg"
                  style={{
                    background: colors.iconColor,
                    color: theme === 'dark' ? '#0F0F23' : '#FFFFFF',
                  }}
                  aria-label="Start hand tracking calibration"
                >
                  <Target className="w-5 h-5 mr-2" />
                  Start Calibration
                </Button>
              </>
            ) : (
              <>
                {/* Calibration Progress */}
                <div 
                  className="rounded-xl p-6 mb-6"
                  style={{
                    background: colors.cardBg,
                    backdropFilter: colors.blur,
                    WebkitBackdropFilter: colors.blur,
                    border: colors.glassBorder,
                    boxShadow: colors.shadow,
                  }}
                >
                  <div className="text-center mb-4">
                    <div className="text-sm font-semibold mb-2" style={{ color: colors.textSecondary }}>
                      Step {calibrationStep + 1} of {calibrationSteps.length}
                    </div>
                    <div 
                      className="h-2 rounded-full overflow-hidden mb-4"
                      style={{ background: colors.cardHover }}
                      role="progressbar"
                      aria-valuenow={(calibrationStep + 1) / calibrationSteps.length * 100}
                      aria-valuemin={0}
                      aria-valuemax={100}
                    >
                      <div 
                        className="h-full transition-all"
                        style={{ 
                          background: colors.iconColor,
                          width: `${((calibrationStep + 1) / calibrationSteps.length) * 100}%`,
                        }}
                      />
                    </div>
                  </div>

                  {/* Current Step */}
                  {(() => {
                    const step = calibrationSteps[calibrationStep];
                    const Icon = step.icon;
                    
                    return (
                      <div className="text-center">
                        <div 
                          className="w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-4"
                          style={{ background: colors.iconBg }}
                          aria-hidden="true"
                        >
                          <Icon className="w-12 h-12" style={{ color: colors.iconColor }} />
                        </div>
                        <h3 className="text-xl font-bold mb-2" style={{ color: colors.textPrimary }}>
                          {step.title}
                        </h3>
                        <p className="text-lg mb-4" style={{ color: colors.textSecondary }}>
                          {step.description}
                        </p>
                        
                        {/* Camera Preview Placeholder */}
                        <div 
                          className="rounded-xl aspect-video mb-4 flex items-center justify-center relative overflow-hidden"
                          style={{ background: '#000' }}
                          role="img"
                          aria-label="Camera preview"
                        >
                          <div className="text-white text-center p-6">
                            <Camera className="w-12 h-12 mx-auto mb-3 opacity-50" aria-hidden="true" />
                            <p className="text-sm opacity-75">
                              {step.instruction}
                            </p>
                          </div>
                        </div>

                        <div 
                          className="rounded-lg p-3 text-sm"
                          style={{ background: colors.iconBg, color: colors.textPrimary }}
                        >
                          <Info className="w-4 h-4 inline mr-2" aria-hidden="true" />
                          {step.instruction}
                        </div>
                      </div>
                    );
                  })()}
                </div>

                {/* Calibration Actions */}
                <div className="space-y-3">
                  {calibrationStep < calibrationSteps.length - 1 ? (
                    <Button
                      onClick={handleNextCalibrationStep}
                      className="w-full h-14 rounded-full font-semibold text-lg"
                      style={{
                        background: colors.iconColor,
                        color: theme === 'dark' ? '#0F0F23' : '#FFFFFF',
                      }}
                      aria-label="Continue to next calibration step"
                    >
                      Continue
                      <ArrowRight className="w-5 h-5 ml-2" />
                    </Button>
                  ) : (
                    <Button
                      onClick={handleNextCalibrationStep}
                      className="w-full h-14 rounded-full font-semibold text-lg"
                      style={{
                        background: colors.successColor,
                        color: '#FFFFFF',
                      }}
                      aria-label="Complete calibration"
                    >
                      <CheckCircle className="w-5 h-5 mr-2" />
                      Complete Calibration
                    </Button>
                  )}
                  
                  <Button
                    onClick={() => {
                      setIsCalibrating(false);
                      setCalibrationStep(0);
                    }}
                    variant="ghost"
                    className="w-full h-12 rounded-full"
                    style={{ color: colors.textSecondary }}
                    aria-label="Cancel calibration"
                  >
                    Cancel
                  </Button>
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
