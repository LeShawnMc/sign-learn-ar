import { useState } from 'react';
import { Button } from './ui/button';
import { useTheme } from '../context/ThemeContext';
import { useApp } from '../context/AppContext';
import arViewImage from 'figma:asset/c804c0c0622fdc72769e16716c3cc1eefe1f44d5.png';
import { 
  X, 
  Mic,
  MicOff,
  Play,
  Pause,
  RotateCcw,
  SkipBack,
  SkipForward,
  Repeat,
  Save,
  Share2,
  Download,
  Copy,
  Heart,
  ThumbsUp,
  ThumbsDown,
  Star,
  Settings,
  Clock,
  Zap,
  BookOpen,
  Users,
  TrendingUp,
  MessageSquare,
  Video,
  Crown,
  Info,
  AlertCircle,
  CheckCircle2,
  Edit,
  Trash2,
  Search,
  Tag,
  Folder,
  Globe,
  Languages,
  Volume2,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  Plus,
  Filter,
  BarChart3,
  Sparkles,
  Target,
  Award,
  HelpCircle,
  Eye,
  EyeOff,
  Sliders,
  FileText,
  ArrowRight,
  Check,
  UserPlus,
} from 'lucide-react';

interface VoiceToSignTranslationProps {
  onExit: () => void;
}

interface Translation {
  id: string;
  text: string;
  spokenLanguage: string;
  signLanguage: string;
  timestamp: string;
  confidenceScore: number;
  signs: string[];
  isSaved?: boolean;
  collection?: string;
  tags?: string[];
}

interface SavedPhrase {
  id: string;
  text: string;
  spokenLanguage: string;
  signLanguage: string;
  collection: string;
  tags: string[];
  isFavorite: boolean;
  dateAdded: string;
  useCount: number;
}

export function VoiceToSignTranslation({ onExit }: VoiceToSignTranslationProps) {
  const { theme } = useTheme();
  const { userProgress } = useApp();

  const [currentView, setCurrentView] = useState<'main' | 'saved' | 'history' | 'settings' | 'community' | 'conversation'>('main');
  const [isRecording, setIsRecording] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1.0);
  const [currentSignIndex, setCurrentSignIndex] = useState(0);
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [showShareDialog, setShowShareDialog] = useState(false);
  const [learningMode, setLearningMode] = useState(false);
  const [isPremium] = useState(false);
  const [dailyTranslationsUsed, setDailyTranslationsUsed] = useState(7);
  const [dailyTranslationsLimit] = useState(15);

  // Current translation
  const [currentTranslation, setCurrentTranslation] = useState<Translation | null>({
    id: 'trans-1',
    text: 'Hello, how are you today?',
    spokenLanguage: 'English',
    signLanguage: 'ASL',
    timestamp: new Date().toISOString(),
    confidenceScore: 92,
    signs: ['HELLO', 'HOW', 'YOU', 'TODAY'],
  });

  // Languages
  const [spokenLanguages] = useState([
    'English',
    'Spanish',
    'French',
    'German',
    'Italian',
    'Portuguese',
    'Japanese',
    'Korean',
    'Mandarin Chinese',
  ]);

  const [signLanguages] = useState([
    'ASL (American Sign Language)',
    'BSL (British Sign Language)',
    'ISL (Indian Sign Language)',
    'LSF (French Sign Language)',
    'Auslan (Australian Sign Language)',
  ]);

  const [selectedSpokenLanguage, setSelectedSpokenLanguage] = useState('English');
  const [selectedSignLanguage, setSelectedSignLanguage] = useState('ASL (American Sign Language)');

  // Translation history
  const [translationHistory] = useState<Translation[]>([
    {
      id: 'trans-1',
      text: 'Hello, how are you today?',
      spokenLanguage: 'English',
      signLanguage: 'ASL',
      timestamp: new Date().toISOString(),
      confidenceScore: 92,
      signs: ['HELLO', 'HOW', 'YOU', 'TODAY'],
    },
    {
      id: 'trans-2',
      text: 'Thank you for your help',
      spokenLanguage: 'English',
      signLanguage: 'ASL',
      timestamp: new Date(Date.now() - 3600000).toISOString(),
      confidenceScore: 95,
      signs: ['THANK-YOU', 'FOR', 'YOUR', 'HELP'],
    },
    {
      id: 'trans-3',
      text: 'Where is the bathroom?',
      spokenLanguage: 'English',
      signLanguage: 'ASL',
      timestamp: new Date(Date.now() - 7200000).toISOString(),
      confidenceScore: 88,
      signs: ['WHERE', 'BATHROOM'],
    },
    {
      id: 'trans-4',
      text: 'I would like to order coffee',
      spokenLanguage: 'English',
      signLanguage: 'ASL',
      timestamp: new Date(Date.now() - 10800000).toISOString(),
      confidenceScore: 90,
      signs: ['I', 'WANT', 'ORDER', 'COFFEE'],
    },
    {
      id: 'trans-5',
      text: 'Nice to meet you',
      spokenLanguage: 'English',
      signLanguage: 'ASL',
      timestamp: new Date(Date.now() - 14400000).toISOString(),
      confidenceScore: 94,
      signs: ['NICE', 'MEET', 'YOU'],
    },
  ]);

  // Saved phrases
  const [savedPhrases] = useState<SavedPhrase[]>([
    {
      id: 'saved-1',
      text: 'Good morning',
      spokenLanguage: 'English',
      signLanguage: 'ASL',
      collection: 'Greetings',
      tags: ['morning', 'daily'],
      isFavorite: true,
      dateAdded: '2026-01-10',
      useCount: 24,
    },
    {
      id: 'saved-2',
      text: 'See you later',
      spokenLanguage: 'English',
      signLanguage: 'ASL',
      collection: 'Greetings',
      tags: ['farewell', 'casual'],
      isFavorite: true,
      dateAdded: '2026-01-09',
      useCount: 18,
    },
    {
      id: 'saved-3',
      text: 'I need help with this project',
      spokenLanguage: 'English',
      signLanguage: 'ASL',
      collection: 'Work Phrases',
      tags: ['work', 'help', 'project'],
      isFavorite: false,
      dateAdded: '2026-01-08',
      useCount: 7,
    },
    {
      id: 'saved-4',
      text: 'Can you repeat that please?',
      spokenLanguage: 'English',
      signLanguage: 'ASL',
      collection: 'Personal',
      tags: ['clarification', 'common'],
      isFavorite: true,
      dateAdded: '2026-01-07',
      useCount: 15,
    },
    {
      id: 'saved-5',
      text: 'What time is the meeting?',
      spokenLanguage: 'English',
      signLanguage: 'ASL',
      collection: 'Work Phrases',
      tags: ['work', 'time', 'meeting'],
      isFavorite: false,
      dateAdded: '2026-01-06',
      useCount: 9,
    },
  ]);

  // Collections
  const [collections] = useState(['Greetings', 'Work Phrases', 'Personal', 'Emergency', 'Social']);

  // Community translations
  const [communityTranslations] = useState([
    {
      id: 'comm-1',
      text: 'Happy birthday!',
      translations: 1234,
      rating: 4.9,
    },
    {
      id: 'comm-2',
      text: 'Congratulations on your achievement',
      translations: 892,
      rating: 4.8,
    },
    {
      id: 'comm-3',
      text: 'I appreciate your patience',
      translations: 756,
      rating: 4.7,
    },
  ]);

  // Settings
  const [settings, setSettings] = useState({
    avatarSpeed: 1.0,
    facialExpressions: true,
    showCaptions: true,
    grammarExplanations: true,
    microphoneSensitivity: 0.7,
  });

  // Handle recording
  const handleRecordToggle = () => {
    if (dailyTranslationsUsed >= dailyTranslationsLimit && !isPremium) {
      return; // Show limit dialog
    }
    setIsRecording(!isRecording);
    if (!isRecording) {
      // Start recording
      setDailyTranslationsUsed(dailyTranslationsUsed + 1);
    }
  };

  // Handle playback
  const handlePlayPause = () => {
    if (isPlaying) {
      setIsPaused(!isPaused);
    } else {
      setIsPlaying(true);
      setIsPaused(false);
    }
  };

  const handleReplay = () => {
    setCurrentSignIndex(0);
    setIsPlaying(true);
    setIsPaused(false);
  };

  const handleStepBack = () => {
    if (currentSignIndex > 0) {
      setCurrentSignIndex(currentSignIndex - 1);
    }
  };

  const handleStepForward = () => {
    if (currentTranslation && currentSignIndex < currentTranslation.signs.length - 1) {
      setCurrentSignIndex(currentSignIndex + 1);
    }
  };

  // Theme-aware colors
  const colors = theme === 'dark'
    ? {
        bg: 'var(--color-bg-deep)',
        cardBg: 'var(--color-bg-card)',
        cardHover: '#252541',
        textPrimary: 'var(--color-text)',
        textSecondary: 'var(--color-text-muted)',
        textTertiary: '#64748B',
        border: 'rgba(148, 163, 184, 0.2)',
        iconBg: 'rgba(0, 245, 255, 0.1)',
        iconColor: 'var(--color-cyan)',
        accentBg: 'rgba(168, 85, 247, 0.1)',
        accentColor: 'var(--color-purple)',
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
        accentColor: 'var(--color-purple)',
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

  return (
    <div 
      className="h-full flex flex-col"
      style={{ background: colors.bg, color: colors.textPrimary }}
      role="main"
      aria-labelledby="voice-to-sign-title"
    >
      {/* Header */}
      <div 
        className="p-4 border-b"
        style={{ borderBottomColor: colors.border }}
      >
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <h1 
              id="voice-to-sign-title" 
              className="text-xl sm:text-2xl font-bold"
              style={{ fontFamily: 'Poppins, sans-serif' }}
            >
              {currentView === 'main' && 'Voice to Sign'}
              {currentView === 'saved' && 'Saved Phrases'}
              {currentView === 'history' && 'Translation History'}
              {currentView === 'settings' && 'Translation Settings'}
              {currentView === 'community' && 'Community Translations'}
              {currentView === 'conversation' && 'Conversation Mode'}
            </h1>
            <p className="text-sm" style={{ color: colors.textSecondary }}>
              {currentView === 'main' && 'Speak and see signs in AR'}
              {currentView === 'saved' && `${savedPhrases.length} saved phrases`}
              {currentView === 'history' && `${translationHistory.length} recent translations`}
              {currentView === 'settings' && 'Customize translation experience'}
              {currentView === 'community' && 'Popular translations'}
              {currentView === 'conversation' && 'Real-time back-and-forth'}
            </p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onExit}
            style={{ color: colors.textSecondary }}
            aria-label="Exit voice to sign translation"
          >
            <X className="w-6 h-6" />
          </Button>
        </div>

        {/* Quick navigation */}
        {currentView === 'main' && (
          <div className="flex items-center gap-2 mt-3 overflow-x-auto">
            <Button
              onClick={() => setCurrentView('saved')}
              className="h-9 px-3 rounded-xl text-sm whitespace-nowrap"
              style={{ 
                background: colors.successBg,
                color: colors.successColor,
              }}
              aria-label="View saved phrases"
            >
              <BookOpen className="w-4 h-4 mr-2" />
              Saved ({savedPhrases.length})
            </Button>
            <Button
              onClick={() => setCurrentView('history')}
              className="h-9 px-3 rounded-xl text-sm whitespace-nowrap"
              style={{ 
                background: colors.iconBg,
                color: colors.iconColor,
              }}
              aria-label="View history"
            >
              <Clock className="w-4 h-4 mr-2" />
              History
            </Button>
            <Button
              onClick={() => setCurrentView('community')}
              className="h-9 px-3 rounded-xl text-sm whitespace-nowrap"
              style={{ 
                background: colors.accentBg,
                color: colors.accentColor,
              }}
              aria-label="Community translations"
            >
              <Users className="w-4 h-4 mr-2" />
              Community
            </Button>
            <Button
              onClick={() => setCurrentView('settings')}
              className="h-9 px-3 rounded-xl text-sm whitespace-nowrap"
              style={{ 
                background: colors.warningBg,
                color: colors.warningColor,
              }}
              aria-label="Translation settings"
            >
              <Settings className="w-4 h-4" />
            </Button>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        {/* Main Translation View */}
        {currentView === 'main' && (
          <div className="p-4 space-y-4">
            {/* Usage Counter */}
            {!isPremium && (
              <div 
                className="rounded-xl p-3"
                style={{ background: colors.warningBg, border: colors.glassBorder }}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Zap className="w-4 h-4" style={{ color: colors.warningColor }} />
                    <span className="text-sm font-semibold" style={{ color: colors.textPrimary }}>
                      {dailyTranslationsLimit - dailyTranslationsUsed} translations left today
                    </span>
                  </div>
                  <Button
                    className="h-8 px-3 rounded-lg text-xs font-semibold"
                    style={{ 
                      background: colors.warningColor,
                      color: theme === 'dark' ? 'var(--color-bg-deep)' : '#FFFFFF',
                    }}
                    aria-label="Upgrade to premium"
                  >
                    <Crown className="w-3 h-3 mr-1" />
                    Premium
                  </Button>
                </div>
                <div 
                  className="w-full h-1.5 rounded-full mt-2 overflow-hidden"
                  style={{ background: colors.border }}
                >
                  <div 
                    className="h-full transition-all"
                    style={{ 
                      background: colors.warningColor,
                      width: `${(dailyTranslationsUsed / dailyTranslationsLimit) * 100}%`,
                    }}
                    role="progressbar"
                    aria-valuenow={dailyTranslationsUsed}
                    aria-valuemin={0}
                    aria-valuemax={dailyTranslationsLimit}
                    aria-label="Daily translations used"
                  />
                </div>
              </div>
            )}

            {/* Language Selection */}
            <div 
              className="rounded-2xl p-4"
              style={{
                background: colors.cardBg,
                backdropFilter: colors.blur,
                WebkitBackdropFilter: colors.blur,
                border: colors.glassBorder,
                boxShadow: colors.shadow,
              }}
            >
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-sm font-semibold mb-2 block" style={{ color: colors.textPrimary }}>
                    <Globe className="w-4 h-4 inline mr-1" />
                    Speak In
                  </label>
                  <select
                    value={selectedSpokenLanguage}
                    onChange={(e) => setSelectedSpokenLanguage(e.target.value)}
                    className="w-full h-10 px-3 rounded-xl"
                    style={{
                      background: colors.cardHover,
                      border: colors.glassBorder,
                      color: colors.textPrimary,
                    }}
                    aria-label="Select spoken language"
                  >
                    {spokenLanguages.map((lang) => (
                      <option key={lang} value={lang}>{lang}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-sm font-semibold mb-2 block" style={{ color: colors.textPrimary }}>
                    <Languages className="w-4 h-4 inline mr-1" />
                    Sign In
                  </label>
                  <select
                    value={selectedSignLanguage}
                    onChange={(e) => setSelectedSignLanguage(e.target.value)}
                    className="w-full h-10 px-3 rounded-xl"
                    style={{
                      background: colors.cardHover,
                      border: colors.glassBorder,
                      color: colors.textPrimary,
                    }}
                    aria-label="Select sign language"
                  >
                    {signLanguages.map((lang) => (
                      <option key={lang} value={lang}>{lang}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* AR Translation Display */}
            <div 
              className="rounded-2xl overflow-hidden relative"
              style={{ height: '300px' }}
            >
              <img
                src={arViewImage}
                alt="AR translation view with avatar"
                className="w-full h-full object-cover"
              />
              
              {/* AR Overlay */}
              {currentTranslation && (
                <>
                  <div 
                    className="absolute top-4 left-4 right-4 rounded-xl p-3"
                    style={{ background: 'rgba(0, 0, 0, 0.7)' }}
                  >
                    <div className="text-white text-sm mb-2">
                      {currentTranslation.text}
                    </div>
                    {settings.showCaptions && (
                      <div className="text-cyan-400 font-bold text-lg">
                        {currentTranslation.signs[currentSignIndex] || currentTranslation.signs[0]}
                      </div>
                    )}
                  </div>

                  {/* Confidence Score */}
                  <div 
                    className="absolute top-4 right-4 rounded-lg px-3 py-1.5"
                    style={{ background: 'rgba(0, 0, 0, 0.7)' }}
                  >
                    <div className="flex items-center gap-2">
                      <Target className="w-4 h-4 text-green-400" />
                      <span className="text-white text-sm font-semibold">
                        {currentTranslation.confidenceScore}%
                      </span>
                    </div>
                  </div>

                  {/* Sign Progress */}
                  <div 
                    className="absolute bottom-4 left-4 right-4 rounded-lg p-3"
                    style={{ background: 'rgba(0, 0, 0, 0.7)' }}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      {currentTranslation.signs.map((sign, idx) => (
                        <div 
                          key={idx}
                          className="flex-1 h-1.5 rounded-full"
                          style={{ 
                            background: idx <= currentSignIndex ? colors.iconColor : 'rgba(255, 255, 255, 0.3)',
                          }}
                        />
                      ))}
                    </div>
                    <div className="text-white text-xs">
                      Sign {currentSignIndex + 1} of {currentTranslation.signs.length}
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Microphone Button */}
            <div className="flex justify-center">
              <button
                onClick={handleRecordToggle}
                disabled={dailyTranslationsUsed >= dailyTranslationsLimit && !isPremium}
                className="w-24 h-24 rounded-full flex items-center justify-center transition-all"
                style={{ 
                  background: isRecording 
                    ? colors.errorColor 
                    : dailyTranslationsUsed >= dailyTranslationsLimit && !isPremium
                      ? colors.border
                      : colors.iconColor,
                  boxShadow: isRecording ? `0 0 30px ${colors.errorColor}` : colors.shadow,
                  opacity: dailyTranslationsUsed >= dailyTranslationsLimit && !isPremium ? 0.5 : 1,
                }}
                aria-label={isRecording ? 'Stop recording' : 'Start recording'}
                aria-pressed={isRecording}
              >
                {isRecording ? (
                  <MicOff className="w-12 h-12 text-white" />
                ) : (
                  <Mic className="w-12 h-12 text-white" />
                )}
              </button>
            </div>

            {isRecording && (
              <div 
                className="rounded-xl p-3 text-center"
                style={{ background: colors.errorBg }}
              >
                <div className="flex items-center justify-center gap-2 mb-1">
                  <div className="w-2 h-2 rounded-full animate-pulse" style={{ background: colors.errorColor }} />
                  <span className="text-sm font-semibold" style={{ color: colors.textPrimary }}>
                    Listening...
                  </span>
                </div>
                <p className="text-xs" style={{ color: colors.textSecondary }}>
                  Speak clearly into your device
                </p>
              </div>
            )}

            {/* Playback Controls */}
            {currentTranslation && (
              <div 
                className="rounded-2xl p-4"
                style={{
                  background: colors.cardBg,
                  backdropFilter: colors.blur,
                  WebkitBackdropFilter: colors.blur,
                  border: colors.glassBorder,
                  boxShadow: colors.shadow,
                }}
              >
                <div className="flex items-center justify-center gap-3 mb-4">
                  <Button
                    onClick={handleStepBack}
                    className="w-12 h-12 rounded-full"
                    style={{ background: colors.iconBg, color: colors.iconColor }}
                    aria-label="Step back"
                  >
                    <SkipBack className="w-5 h-5" />
                  </Button>

                  <Button
                    onClick={handleReplay}
                    className="w-12 h-12 rounded-full"
                    style={{ background: colors.accentBg, color: colors.accentColor }}
                    aria-label="Replay"
                  >
                    <RotateCcw className="w-5 h-5" />
                  </Button>

                  <Button
                    onClick={handlePlayPause}
                    className="w-16 h-16 rounded-full"
                    style={{ background: colors.successColor, color: '#FFFFFF' }}
                    aria-label={isPlaying && !isPaused ? 'Pause' : 'Play'}
                  >
                    {isPlaying && !isPaused ? (
                      <Pause className="w-7 h-7" />
                    ) : (
                      <Play className="w-7 h-7" />
                    )}
                  </Button>

                  <Button
                    onClick={() => {/* Loop functionality */}}
                    className="w-12 h-12 rounded-full"
                    style={{ background: colors.warningBg, color: colors.warningColor }}
                    aria-label="Loop"
                  >
                    <Repeat className="w-5 h-5" />
                  </Button>

                  <Button
                    onClick={handleStepForward}
                    className="w-12 h-12 rounded-full"
                    style={{ background: colors.iconBg, color: colors.iconColor }}
                    aria-label="Step forward"
                  >
                    <SkipForward className="w-5 h-5" />
                  </Button>
                </div>

                {/* Playback Speed */}
                <div className="flex items-center justify-center gap-2">
                  <span className="text-sm" style={{ color: colors.textSecondary }}>Speed:</span>
                  {[0.5, 0.75, 1.0, 1.5].map((speed) => (
                    <button
                      key={speed}
                      onClick={() => setPlaybackSpeed(speed)}
                      className="px-3 py-1.5 rounded-lg text-sm font-medium"
                      style={{
                        background: playbackSpeed === speed ? colors.iconColor : colors.border,
                        color: playbackSpeed === speed ? (theme === 'dark' ? 'var(--color-bg-deep)' : '#FFFFFF') : colors.textTertiary,
                      }}
                      aria-label={`${speed}x speed`}
                      aria-pressed={playbackSpeed === speed}
                    >
                      {speed}x
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Translation Accuracy */}
            {currentTranslation && (
              <div 
                className="rounded-2xl p-4"
                style={{
                  background: colors.cardBg,
                  backdropFilter: colors.blur,
                  WebkitBackdropFilter: colors.blur,
                  border: colors.glassBorder,
                  boxShadow: colors.shadow,
                }}
              >
                <h3 className="text-lg font-semibold mb-3" style={{ color: colors.textPrimary }}>
                  Translation Accuracy
                </h3>

                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm" style={{ color: colors.textSecondary }}>
                    Confidence Score
                  </span>
                  <div className="flex items-center gap-2">
                    <div 
                      className="w-24 h-2 rounded-full overflow-hidden"
                      style={{ background: colors.border }}
                    >
                      <div 
                        className="h-full"
                        style={{ 
                          background: currentTranslation.confidenceScore >= 90 ? colors.successColor : currentTranslation.confidenceScore >= 70 ? colors.warningColor : colors.errorColor,
                          width: `${currentTranslation.confidenceScore}%`,
                        }}
                      />
                    </div>
                    <span className="text-sm font-bold" style={{ color: colors.textPrimary }}>
                      {currentTranslation.confidenceScore}%
                    </span>
                  </div>
                </div>

                <div className="text-sm mb-3" style={{ color: colors.textSecondary }}>
                  Is this translation correct?
                </div>

                <div className="flex gap-2">
                  <Button
                    className="flex-1 h-10 rounded-xl"
                    style={{ background: colors.successBg, color: colors.successColor }}
                    aria-label="Mark as correct"
                  >
                    <ThumbsUp className="w-4 h-4 mr-2" />
                    Correct
                  </Button>
                  <Button
                    className="flex-1 h-10 rounded-xl"
                    style={{ background: colors.errorBg, color: colors.errorColor }}
                    aria-label="Mark as incorrect"
                  >
                    <ThumbsDown className="w-4 h-4 mr-2" />
                    Incorrect
                  </Button>
                </div>

                {learningMode && (
                  <div 
                    className="rounded-xl p-3 mt-3"
                    style={{ background: colors.iconBg }}
                  >
                    <div className="flex items-start gap-2 mb-2">
                      <Info className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: colors.iconColor }} />
                      <div>
                        <div className="text-sm font-semibold mb-1" style={{ color: colors.textPrimary }}>
                          Grammar Note
                        </div>
                        <p className="text-xs" style={{ color: colors.textSecondary }}>
                          ASL uses topic-comment structure. The topic "you" comes before "how" in natural signing.
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Actions */}
            {currentTranslation && (
              <div className="grid grid-cols-2 gap-3">
                <Button
                  onClick={() => setShowSaveDialog(true)}
                  className="h-12 rounded-xl font-semibold"
                  style={{ 
                    background: colors.successBg,
                    color: colors.successColor,
                  }}
                  aria-label="Save translation"
                >
                  <Save className="w-5 h-5 mr-2" />
                  Save
                </Button>
                <Button
                  onClick={() => setShowShareDialog(true)}
                  className="h-12 rounded-xl font-semibold"
                  style={{ 
                    background: colors.iconBg,
                    color: colors.iconColor,
                  }}
                  aria-label="Share translation"
                >
                  <Share2 className="w-5 h-5 mr-2" />
                  Share
                </Button>
              </div>
            )}

            {/* Learning Mode Toggle */}
            <div 
              className="rounded-xl p-4"
              style={{ background: colors.cardBg, border: colors.glassBorder }}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div 
                    className="w-10 h-10 rounded-lg flex items-center justify-center"
                    style={{ background: colors.accentBg }}
                  >
                    <BookOpen className="w-5 h-5" style={{ color: colors.accentColor }} />
                  </div>
                  <div>
                    <div className="font-semibold" style={{ color: colors.textPrimary }}>
                      Learning Mode
                    </div>
                    <div className="text-xs" style={{ color: colors.textTertiary }}>
                      Show grammar & vocabulary notes
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => setLearningMode(!learningMode)}
                  className="w-12 h-6 rounded-full relative"
                  style={{ background: learningMode ? colors.successColor : colors.border }}
                  aria-label="Toggle learning mode"
                  aria-pressed={learningMode}
                >
                  <div 
                    className="w-5 h-5 rounded-full absolute top-0.5 transition-all"
                    style={{ 
                      background: '#FFFFFF',
                      left: learningMode ? 'calc(100% - 1.375rem)' : '0.125rem',
                    }}
                  />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Saved Phrases View */}
        {currentView === 'saved' && (
          <div className="p-4 space-y-4">
            <Button
              onClick={() => setCurrentView('main')}
              variant="ghost"
              className="mb-2"
              style={{ color: colors.textSecondary }}
              aria-label="Back to main"
            >
              <ChevronLeft className="w-4 h-4 mr-2" />
              Back
            </Button>

            {/* Search and Filter */}
            <div className="flex gap-2">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: colors.textTertiary }} />
                <input
                  type="text"
                  placeholder="Search saved phrases..."
                  className="w-full h-10 pl-10 pr-4 rounded-xl"
                  style={{
                    background: colors.cardBg,
                    border: colors.glassBorder,
                    color: colors.textPrimary,
                  }}
                  aria-label="Search saved phrases"
                />
              </div>
              <Button
                className="h-10 px-3 rounded-xl"
                style={{ background: colors.iconBg, color: colors.iconColor }}
                aria-label="Filter phrases"
              >
                <Filter className="w-4 h-4" />
              </Button>
            </div>

            {/* Collections */}
            <div className="flex gap-2 overflow-x-auto">
              {['All', ...collections].map((collection) => (
                <button
                  key={collection}
                  className="px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap"
                  style={{
                    background: collection === 'All' ? colors.iconColor : colors.iconBg,
                    color: collection === 'All' ? (theme === 'dark' ? 'var(--color-bg-deep)' : '#FFFFFF') : colors.iconColor,
                  }}
                  aria-label={`Filter by ${collection}`}
                >
                  {collection}
                </button>
              ))}
            </div>

            {/* Saved Phrases List */}
            <div className="space-y-3">
              {savedPhrases.map((phrase) => (
                <div
                  key={phrase.id}
                  className="rounded-xl p-4"
                  style={{
                    background: colors.cardBg,
                    backdropFilter: colors.blur,
                    WebkitBackdropFilter: colors.blur,
                    border: colors.glassBorder,
                    boxShadow: colors.shadow,
                  }}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-semibold" style={{ color: colors.textPrimary }}>
                          {phrase.text}
                        </h4>
                        {phrase.isFavorite && (
                          <Heart className="w-4 h-4" style={{ fill: colors.errorColor, color: colors.errorColor }} />
                        )}
                      </div>
                      <div className="flex items-center gap-2 text-xs mb-2" style={{ color: colors.textTertiary }}>
                        <Folder className="w-3 h-3" />
                        <span>{phrase.collection}</span>
                        <span>•</span>
                        <span>Used {phrase.useCount} times</span>
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {phrase.tags.map((tag, idx) => (
                          <span
                            key={idx}
                            className="px-2 py-0.5 rounded-full text-xs"
                            style={{ background: colors.iconBg, color: colors.iconColor }}
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button
                      className="flex-1 h-9 rounded-lg text-sm"
                      style={{ background: colors.successBg, color: colors.successColor }}
                      aria-label="Practice phrase"
                    >
                      <Play className="w-4 h-4 mr-2" />
                      Practice
                    </Button>
                    <Button
                      className="h-9 px-3 rounded-lg"
                      style={{ background: colors.iconBg, color: colors.iconColor }}
                      aria-label="Edit phrase"
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      className="h-9 px-3 rounded-lg"
                      style={{ background: colors.errorBg, color: colors.errorColor }}
                      aria-label="Delete phrase"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Translation History View */}
        {currentView === 'history' && (
          <div className="p-4 space-y-3">
            <Button
              onClick={() => setCurrentView('main')}
              variant="ghost"
              className="mb-2"
              style={{ color: colors.textSecondary }}
              aria-label="Back to main"
            >
              <ChevronLeft className="w-4 h-4 mr-2" />
              Back
            </Button>

            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold" style={{ color: colors.textPrimary }}>
                Recent Translations
              </h3>
              <Button
                className="h-9 px-3 rounded-lg text-sm"
                style={{ background: colors.errorBg, color: colors.errorColor }}
                aria-label="Clear history"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Clear
              </Button>
            </div>

            {translationHistory.map((translation) => (
              <button
                key={translation.id}
                onClick={() => {
                  setCurrentTranslation(translation);
                  setCurrentView('main');
                }}
                className="w-full rounded-xl p-4 text-left"
                style={{
                  background: colors.cardBg,
                  backdropFilter: colors.blur,
                  WebkitBackdropFilter: colors.blur,
                  border: colors.glassBorder,
                  boxShadow: colors.shadow,
                }}
                aria-label={`Translation: ${translation.text}`}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <p className="font-semibold mb-1" style={{ color: colors.textPrimary }}>
                      {translation.text}
                    </p>
                    <div className="flex items-center gap-2 text-xs" style={{ color: colors.textTertiary }}>
                      <Clock className="w-3 h-3" />
                      <span>
                        {new Date(translation.timestamp).toLocaleString()}
                      </span>
                      <span>•</span>
                      <span>{translation.spokenLanguage} → {translation.signLanguage}</span>
                    </div>
                  </div>
                  <div 
                    className="px-2 py-1 rounded-lg text-xs font-semibold"
                    style={{ 
                      background: translation.confidenceScore >= 90 ? colors.successBg : colors.warningBg,
                      color: translation.confidenceScore >= 90 ? colors.successColor : colors.warningColor,
                    }}
                  >
                    {translation.confidenceScore}%
                  </div>
                </div>
                <div className="flex flex-wrap gap-1">
                  {translation.signs.map((sign, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-0.5 rounded text-xs"
                      style={{ background: colors.iconBg, color: colors.iconColor }}
                    >
                      {sign}
                    </span>
                  ))}
                </div>
              </button>
            ))}
          </div>
        )}

        {/* Settings View */}
        {currentView === 'settings' && (
          <div className="p-4 space-y-4">
            <Button
              onClick={() => setCurrentView('main')}
              variant="ghost"
              className="mb-2"
              style={{ color: colors.textSecondary }}
              aria-label="Back to main"
            >
              <ChevronLeft className="w-4 h-4 mr-2" />
              Back
            </Button>

            <div 
              className="rounded-2xl p-6"
              style={{
                background: colors.cardBg,
                backdropFilter: colors.blur,
                WebkitBackdropFilter: colors.blur,
                border: colors.glassBorder,
                boxShadow: colors.shadow,
              }}
            >
              <h3 className="text-lg font-semibold mb-4" style={{ color: colors.textPrimary }}>
                Translation Settings
              </h3>

              <div className="space-y-4">
                {/* Avatar Speed */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-semibold" style={{ color: colors.textPrimary }}>
                      Avatar Signing Speed
                    </span>
                    <span className="text-sm" style={{ color: colors.textSecondary }}>
                      {settings.avatarSpeed}x
                    </span>
                  </div>
                  <input
                    type="range"
                    min="0.5"
                    max="2"
                    step="0.1"
                    value={settings.avatarSpeed}
                    onChange={(e) => setSettings({ ...settings, avatarSpeed: parseFloat(e.target.value) })}
                    className="w-full"
                    style={{ accentColor: colors.iconColor }}
                    aria-label="Avatar signing speed"
                  />
                </div>

                {/* Facial Expressions */}
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-semibold mb-1" style={{ color: colors.textPrimary }}>
                      Facial Expressions
                    </div>
                    <div className="text-xs" style={{ color: colors.textTertiary }}>
                      Show emotion and emphasis
                    </div>
                  </div>
                  <button
                    onClick={() => setSettings({ ...settings, facialExpressions: !settings.facialExpressions })}
                    className="w-12 h-6 rounded-full relative"
                    style={{ background: settings.facialExpressions ? colors.successColor : colors.border }}
                    aria-label="Toggle facial expressions"
                    aria-pressed={settings.facialExpressions}
                  >
                    <div 
                      className="w-5 h-5 rounded-full absolute top-0.5 transition-all"
                      style={{ 
                        background: '#FFFFFF',
                        left: settings.facialExpressions ? 'calc(100% - 1.375rem)' : '0.125rem',
                      }}
                    />
                  </button>
                </div>

                {/* Show Captions */}
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-semibold mb-1" style={{ color: colors.textPrimary }}>
                      Show Sign Names
                    </div>
                    <div className="text-xs" style={{ color: colors.textTertiary }}>
                      Display captions during signing
                    </div>
                  </div>
                  <button
                    onClick={() => setSettings({ ...settings, showCaptions: !settings.showCaptions })}
                    className="w-12 h-6 rounded-full relative"
                    style={{ background: settings.showCaptions ? colors.successColor : colors.border }}
                    aria-label="Toggle captions"
                    aria-pressed={settings.showCaptions}
                  >
                    <div 
                      className="w-5 h-5 rounded-full absolute top-0.5 transition-all"
                      style={{ 
                        background: '#FFFFFF',
                        left: settings.showCaptions ? 'calc(100% - 1.375rem)' : '0.125rem',
                      }}
                    />
                  </button>
                </div>

                {/* Grammar Explanations */}
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-semibold mb-1" style={{ color: colors.textPrimary }}>
                      Grammar Explanations
                    </div>
                    <div className="text-xs" style={{ color: colors.textTertiary }}>
                      Learn structure differences
                    </div>
                  </div>
                  <button
                    onClick={() => setSettings({ ...settings, grammarExplanations: !settings.grammarExplanations })}
                    className="w-12 h-6 rounded-full relative"
                    style={{ background: settings.grammarExplanations ? colors.successColor : colors.border }}
                    aria-label="Toggle grammar explanations"
                    aria-pressed={settings.grammarExplanations}
                  >
                    <div 
                      className="w-5 h-5 rounded-full absolute top-0.5 transition-all"
                      style={{ 
                        background: '#FFFFFF',
                        left: settings.grammarExplanations ? 'calc(100% - 1.375rem)' : '0.125rem',
                      }}
                    />
                  </button>
                </div>

                {/* Microphone Sensitivity */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-semibold" style={{ color: colors.textPrimary }}>
                      Microphone Sensitivity
                    </span>
                    <span className="text-sm" style={{ color: colors.textSecondary }}>
                      {Math.round(settings.microphoneSensitivity * 100)}%
                    </span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.1"
                    value={settings.microphoneSensitivity}
                    onChange={(e) => setSettings({ ...settings, microphoneSensitivity: parseFloat(e.target.value) })}
                    className="w-full"
                    style={{ accentColor: colors.iconColor }}
                    aria-label="Microphone sensitivity"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Community View */}
        {currentView === 'community' && (
          <div className="p-4 space-y-4">
            <Button
              onClick={() => setCurrentView('main')}
              variant="ghost"
              className="mb-2"
              style={{ color: colors.textSecondary }}
              aria-label="Back to main"
            >
              <ChevronLeft className="w-4 h-4 mr-2" />
              Back
            </Button>

            <div 
              className="rounded-2xl p-6"
              style={{
                background: colors.cardBg,
                backdropFilter: colors.blur,
                WebkitBackdropFilter: colors.blur,
                border: colors.glassBorder,
                boxShadow: colors.shadow,
              }}
            >
              <h3 className="text-lg font-semibold mb-4" style={{ color: colors.textPrimary }}>
                Popular Translations
              </h3>

              <div className="space-y-3">
                {communityTranslations.map((item) => (
                  <button
                    key={item.id}
                    className="w-full rounded-xl p-4 text-left"
                    style={{ background: colors.iconBg }}
                    aria-label={`Popular translation: ${item.text}`}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <p className="font-semibold flex-1" style={{ color: colors.textPrimary }}>
                        {item.text}
                      </p>
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4" style={{ fill: colors.warningColor, color: colors.warningColor }} />
                        <span className="text-sm font-bold" style={{ color: colors.textPrimary }}>
                          {item.rating}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-xs" style={{ color: colors.textTertiary }}>
                      <TrendingUp className="w-3 h-3" />
                      <span>{item.translations.toLocaleString()} translations</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Conversation Mode (Premium) */}
        {currentView === 'conversation' && (
          <div className="p-4 space-y-4">
            <Button
              onClick={() => setCurrentView('main')}
              variant="ghost"
              className="mb-2"
              style={{ color: colors.textSecondary }}
              aria-label="Back to main"
            >
              <ChevronLeft className="w-4 h-4 mr-2" />
              Back
            </Button>

            {!isPremium ? (
              <div 
                className="rounded-2xl p-8 text-center"
                style={{
                  background: `linear-gradient(135deg, ${colors.warningColor}20 0%, ${colors.accentColor}20 100%)`,
                  border: colors.glassBorder,
                  boxShadow: colors.shadow,
                }}
              >
                <div 
                  className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4"
                  style={{ background: colors.warningColor }}
                >
                  <Crown className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-2" style={{ fontFamily: 'Poppins, sans-serif', color: colors.textPrimary }}>
                  Premium Feature
                </h3>
                <p className="text-base mb-6" style={{ color: colors.textSecondary }}>
                  Unlock conversation mode for real-time back-and-forth translation
                </p>
                <Button
                  className="h-12 px-6 rounded-xl font-semibold"
                  style={{ background: colors.warningColor, color: '#FFFFFF' }}
                  aria-label="Upgrade to premium"
                >
                  Upgrade to Premium
                </Button>
              </div>
            ) : (
              <div>Conversation mode content</div>
            )}
          </div>
        )}
      </div>

      {/* Save Dialog */}
      {showSaveDialog && (
        <div 
          className="absolute inset-0 bg-black/50 flex items-center justify-center p-4"
          onClick={() => setShowSaveDialog(false)}
          role="dialog"
          aria-modal="true"
          aria-labelledby="save-dialog-title"
        >
          <div 
            className="rounded-2xl p-6 max-w-md w-full"
            style={{
              background: colors.cardBg,
              backdropFilter: colors.blur,
              WebkitBackdropFilter: colors.blur,
              border: colors.glassBorder,
              boxShadow: colors.shadow,
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h3 id="save-dialog-title" className="text-xl font-bold mb-4" style={{ fontFamily: 'Poppins, sans-serif', color: colors.textPrimary }}>
              Save Translation
            </h3>

            <div className="space-y-3">
              <div>
                <label className="text-sm font-semibold mb-2 block" style={{ color: colors.textPrimary }}>
                  Collection
                </label>
                <select
                  className="w-full h-10 px-3 rounded-xl"
                  style={{
                    background: colors.cardHover,
                    border: colors.glassBorder,
                    color: colors.textPrimary,
                  }}
                  aria-label="Select collection"
                >
                  {collections.map((col) => (
                    <option key={col}>{col}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-sm font-semibold mb-2 block" style={{ color: colors.textPrimary }}>
                  Tags (comma separated)
                </label>
                <input
                  type="text"
                  placeholder="e.g., work, important, daily"
                  className="w-full h-10 px-4 rounded-xl"
                  style={{
                    background: colors.cardHover,
                    border: colors.glassBorder,
                    color: colors.textPrimary,
                  }}
                  aria-label="Tags"
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="favorite"
                  className="w-4 h-4"
                  style={{ accentColor: colors.errorColor }}
                />
                <label htmlFor="favorite" className="text-sm" style={{ color: colors.textPrimary }}>
                  Add to favorites
                </label>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <Button
                onClick={() => setShowSaveDialog(false)}
                className="flex-1 h-11 rounded-xl"
                style={{ background: colors.border, color: colors.textSecondary }}
                aria-label="Cancel"
              >
                Cancel
              </Button>
              <Button
                onClick={() => {
                  setShowSaveDialog(false);
                  // Save logic
                }}
                className="flex-1 h-11 rounded-xl font-semibold"
                style={{ background: colors.successColor, color: '#FFFFFF' }}
                aria-label="Save phrase"
              >
                <Save className="w-4 h-4 mr-2" />
                Save
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Share Dialog */}
      {showShareDialog && (
        <div 
          className="absolute inset-0 bg-black/50 flex items-center justify-center p-4"
          onClick={() => setShowShareDialog(false)}
          role="dialog"
          aria-modal="true"
          aria-labelledby="share-dialog-title"
        >
          <div 
            className="rounded-2xl p-6 max-w-md w-full"
            style={{
              background: colors.cardBg,
              backdropFilter: colors.blur,
              WebkitBackdropFilter: colors.blur,
              border: colors.glassBorder,
              boxShadow: colors.shadow,
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h3 id="share-dialog-title" className="text-xl font-bold mb-4" style={{ fontFamily: 'Poppins, sans-serif', color: colors.textPrimary }}>
              Share Translation
            </h3>

            <div className="grid grid-cols-2 gap-3">
              <Button
                className="h-20 rounded-xl flex flex-col items-center justify-center gap-2"
                style={{ background: colors.iconBg, color: colors.iconColor }}
                aria-label="Share to practice partners"
              >
                <UserPlus className="w-6 h-6" />
                <span className="text-sm">Partners</span>
              </Button>

              <Button
                className="h-20 rounded-xl flex flex-col items-center justify-center gap-2"
                style={{ background: colors.accentBg, color: colors.accentColor }}
                aria-label="Post to community"
              >
                <Users className="w-6 h-6" />
                <span className="text-sm">Community</span>
              </Button>

              <Button
                className="h-20 rounded-xl flex flex-col items-center justify-center gap-2"
                style={{ background: colors.successBg, color: colors.successColor }}
                aria-label="Export as video"
              >
                <Video className="w-6 h-6" />
                <span className="text-sm">Video</span>
              </Button>

              <Button
                className="h-20 rounded-xl flex flex-col items-center justify-center gap-2"
                style={{ background: colors.warningBg, color: colors.warningColor }}
                aria-label="Copy to clipboard"
              >
                <Copy className="w-6 h-6" />
                <span className="text-sm">Copy</span>
              </Button>
            </div>

            <Button
              onClick={() => setShowShareDialog(false)}
              className="w-full h-11 rounded-xl mt-4"
              style={{ background: colors.border, color: colors.textSecondary }}
              aria-label="Close"
            >
              Close
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
