import { useState } from 'react';
import { Button } from './ui/button';
import { useTheme } from '../context/ThemeContext';
import { useApp } from '../context/AppContext';
import exampleImage from 'figma:asset/ce3746487b7a7abcb29912982ae57114488c6852.png';
import { 
  X, 
  Camera,
  Video,
  Mic,
  Play,
  Pause,
  RotateCcw,
  Save,
  Trash2,
  MessageCircle,
  Clock,
  Star,
  StarOff,
  ChevronRight,
  Settings,
  Volume2,
  VolumeX,
  Zap,
  AlertCircle,
  CheckCircle2,
  Users,
  Briefcase,
  Heart,
  Phone,
  Languages,
  Gauge,
  FileText,
  History,
  Bookmark,
  BookmarkCheck,
  Eye,
  EyeOff,
  ToggleLeft,
  ToggleRight,
  Circle,
  Hand,
  Info,
} from 'lucide-react';

interface InterpreterModeProps {
  onExit: () => void;
}

interface QuickPhrase {
  id: string;
  text: string;
  aslTranslation: string;
  category: string;
  isSaved: boolean;
}

interface Conversation {
  id: string;
  participantName: string;
  lastMessage: string;
  timestamp: string;
  messageCount: number;
  context: 'formal' | 'casual' | 'emergency';
}

interface CommonSign {
  id: string;
  name: string;
  description: string;
  category: string;
}

interface SavedPhrase {
  id: string;
  englishText: string;
  aslDescription: string;
  context: string;
  savedDate: string;
}

interface TranslationMessage {
  id: string;
  type: 'english' | 'asl';
  content: string;
  timestamp: string;
  context: 'formal' | 'casual' | 'emergency';
}

export function InterpreterMode({ onExit }: InterpreterModeProps) {
  const { theme } = useTheme();
  const { userProgress } = useApp();

  // Current Context
  const [currentContext, setCurrentContext] = useState<'formal' | 'casual' | 'emergency'>('casual');
  const [isTranslating, setIsTranslating] = useState(false);
  const [isCameraActive, setIsCameraActive] = useState(false);

  // Translation History
  const [translationMessages, setTranslationMessages] = useState<TranslationMessage[]>([
    {
      id: 'msg-1',
      type: 'english',
      content: 'What are you making today?',
      timestamp: '2 min ago',
      context: 'casual',
    },
    {
      id: 'msg-2',
      type: 'asl',
      content: 'Signing: "YOU MAKE WHAT TODAY?"',
      timestamp: '2 min ago',
      context: 'casual',
    },
  ]);

  // Quick Phrases
  const [quickPhrases, setQuickPhrases] = useState<QuickPhrase[]>([
    {
      id: 'phrase-1',
      text: 'Hi! Come in',
      aslTranslation: 'HELLO, COME-IN',
      category: 'greeting',
      isSaved: false,
    },
    {
      id: 'phrase-2',
      text: 'Dinner is at 6',
      aslTranslation: 'DINNER TIME 6',
      category: 'casual',
      isSaved: false,
    },
    {
      id: 'phrase-3',
      text: 'Need a taxi?',
      aslTranslation: 'NEED TAXI?',
      category: 'casual',
      isSaved: false,
    },
    {
      id: 'phrase-4',
      text: 'How are you?',
      aslTranslation: 'HOW YOU?',
      category: 'greeting',
      isSaved: true,
    },
    {
      id: 'phrase-5',
      text: 'Nice to meet you',
      aslTranslation: 'NICE MEET YOU',
      category: 'formal',
      isSaved: false,
    },
    {
      id: 'phrase-6',
      text: 'Can you help me?',
      aslTranslation: 'CAN YOU HELP ME?',
      category: 'casual',
      isSaved: true,
    },
    {
      id: 'phrase-7',
      text: 'What is the total cost?',
      aslTranslation: 'COST TOTAL WHAT?',
      category: 'formal',
      isSaved: false,
    },
    {
      id: 'phrase-8',
      text: 'I need an interpreter',
      aslTranslation: 'I NEED INTERPRETER',
      category: 'formal',
      isSaved: false,
    },
    {
      id: 'phrase-9',
      text: 'Call 911 immediately',
      aslTranslation: '911 CALL NOW!',
      category: 'emergency',
      isSaved: false,
    },
    {
      id: 'phrase-10',
      text: 'I need medical help',
      aslTranslation: 'I NEED MEDICAL HELP',
      category: 'emergency',
      isSaved: true,
    },
  ]);

  // Recent Conversations
  const [conversations, setConversations] = useState<Conversation[]>([
    {
      id: 'conv-1',
      participantName: 'Dr. Sarah Mitchell',
      lastMessage: 'Appointment: tomorrow 2pm',
      timestamp: '2 hours ago',
      messageCount: 8,
      context: 'formal',
    },
    {
      id: 'conv-2',
      participantName: 'Coffee Shop - Main St',
      lastMessage: 'Grande latte, no sugar',
      timestamp: '5 hours ago',
      messageCount: 3,
      context: 'casual',
    },
    {
      id: 'conv-3',
      participantName: 'Library Front Desk',
      lastMessage: 'Books due next Monday',
      timestamp: '1 day ago',
      messageCount: 5,
      context: 'formal',
    },
    {
      id: 'conv-4',
      participantName: 'Neighbor - Apt 204',
      lastMessage: 'Package delivered for you',
      timestamp: '2 days ago',
      messageCount: 12,
      context: 'casual',
    },
  ]);

  // Common Signs
  const [commonSigns, setCommonSigns] = useState<CommonSign[]>([
    {
      id: 'sign-hello',
      name: 'Hello',
      description: 'Hand wave near forehead',
      category: 'greeting',
    },
    {
      id: 'sign-thank-you',
      name: 'Thank You',
      description: 'Hand from chin forward',
      category: 'greeting',
    },
    {
      id: 'sign-goodbye',
      name: 'Goodbye',
      description: 'Wave hand palm out',
      category: 'greeting',
    },
    {
      id: 'sign-please',
      name: 'Please',
      description: 'Circle hand on chest',
      category: 'courtesy',
    },
    {
      id: 'sign-sorry',
      name: 'Sorry',
      description: 'Fist circle on chest',
      category: 'courtesy',
    },
    {
      id: 'sign-yes',
      name: 'Yes',
      description: 'Nod fist up and down',
      category: 'response',
    },
    {
      id: 'sign-no',
      name: 'No',
      description: 'Snap fingers together',
      category: 'response',
    },
    {
      id: 'sign-help',
      name: 'Help',
      description: 'Fist on palm, lift up',
      category: 'essential',
    },
    {
      id: 'sign-water',
      name: 'Water',
      description: 'W sign, tap chin',
      category: 'needs',
    },
  ]);

  // Saved Phrases
  const [savedPhrases, setSavedPhrases] = useState<SavedPhrase[]>([
    {
      id: 'saved-1',
      englishText: 'How are you doing?',
      aslDescription: 'HOW YOU DO?',
      context: 'casual',
      savedDate: '2024-01-10',
    },
    {
      id: 'saved-2',
      englishText: 'What is the total cost?',
      aslDescription: 'COST TOTAL WHAT?',
      context: 'formal',
      savedDate: '2024-01-09',
    },
    {
      id: 'saved-3',
      englishText: 'I need medical assistance',
      aslDescription: 'I NEED MEDICAL HELP',
      context: 'emergency',
      savedDate: '2024-01-08',
    },
    {
      id: 'saved-4',
      englishText: 'Where is the restroom?',
      aslDescription: 'RESTROOM WHERE?',
      context: 'casual',
      savedDate: '2024-01-07',
    },
  ]);

  // Settings
  const [settings, setSettings] = useState({
    aslLanguage: 'American Sign Language (ASL)',
    interpreterSpeed: 'normal',
    showSignDescriptions: true,
    saveConversationHistory: true,
    autoTranslate: false,
    emergencyMode: false,
  });

  const handleTogglePhraseSave = (phraseId: string) => {
    setQuickPhrases(prev => prev.map(phrase => 
      phrase.id === phraseId 
        ? { ...phrase, isSaved: !phrase.isSaved }
        : phrase
    ));
  };

  const handleTranslatePhrase = (phrase: QuickPhrase) => {
    const newMessage: TranslationMessage = {
      id: `msg-${Date.now()}`,
      type: 'english',
      content: phrase.text,
      timestamp: 'Just now',
      context: currentContext,
    };
    const aslMessage: TranslationMessage = {
      id: `msg-${Date.now() + 1}`,
      type: 'asl',
      content: `Signing: "${phrase.aslTranslation}"`,
      timestamp: 'Just now',
      context: currentContext,
    };
    setTranslationMessages(prev => [aslMessage, newMessage, ...prev]);
  };

  const handleSignPress = (sign: CommonSign) => {
    const newMessage: TranslationMessage = {
      id: `msg-${Date.now()}`,
      type: 'asl',
      content: `Signing: "${sign.name.toUpperCase()}"`,
      timestamp: 'Just now',
      context: currentContext,
    };
    setTranslationMessages(prev => [newMessage, ...prev]);
  };

  const handleClearHistory = () => {
    setTranslationMessages([]);
  };

  const handleToggleSetting = (setting: string) => {
    setSettings(prev => ({
      ...prev,
      [setting]: !prev[setting as keyof typeof settings],
    }));
  };

  const getContextIcon = (context: string) => {
    if (context === 'formal') return Briefcase;
    if (context === 'emergency') return AlertCircle;
    return Users;
  };

  const getContextColor = (context: string) => {
    if (context === 'formal') return colors.accentColor;
    if (context === 'emergency') return colors.errorColor;
    return colors.iconColor;
  };

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

  return (
    <div 
      className="h-full flex flex-col"
      style={{ background: colors.bg, color: colors.textPrimary }}
      role="main"
      aria-labelledby="interpreter-title"
    >
      {/* Header */}
      <div 
        className="p-4 border-b"
        style={{ borderBottomColor: colors.border }}
      >
        <div className="flex items-center gap-2 sm:gap-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={onExit}
            style={{ color: colors.textSecondary }}
            aria-label="Exit interpreter mode"
            className="flex-shrink-0"
          >
            <X className="w-6 h-6" />
          </Button>
          <div className="flex-1 min-w-0">
            <h1 
              id="interpreter-title" 
              className="text-xl sm:text-2xl font-bold truncate"
              style={{ fontFamily: 'Poppins, sans-serif' }}
            >
              Interpreter Mode
            </h1>
            <p className="text-sm truncate" style={{ color: colors.textSecondary }}>
              Real-time ASL translation
            </p>
          </div>
        </div>
      </div>

      {/* Context Switcher */}
      <div 
        className="p-4 border-b"
        style={{ borderBottomColor: colors.border }}
      >
        <div className="flex items-center gap-2 mb-2">
          <MessageCircle className="w-4 h-4" style={{ color: colors.textTertiary }} />
          <span className="text-sm font-semibold" style={{ color: colors.textTertiary }}>
            Context
          </span>
        </div>
        <div className="flex gap-2">
          {[
            { id: 'casual', label: 'Casual', icon: Users },
            { id: 'formal', label: 'Formal', icon: Briefcase },
            { id: 'emergency', label: 'Emergency', icon: AlertCircle },
          ].map((context) => {
            const Icon = context.icon;
            const isActive = currentContext === context.id;
            return (
              <button
                key={context.id}
                onClick={() => setCurrentContext(context.id as any)}
                className="flex-1 rounded-xl p-3 transition-all flex items-center justify-center gap-2"
                style={{
                  background: isActive ? getContextColor(context.id) + '20' : colors.cardBg,
                  border: isActive ? `2px solid ${getContextColor(context.id)}` : colors.glassBorder,
                  backdropFilter: colors.blur,
                  WebkitBackdropFilter: colors.blur,
                }}
                aria-pressed={isActive}
                aria-label={`Switch to ${context.label} context`}
              >
                <Icon 
                  className="w-4 h-4" 
                  style={{ color: isActive ? getContextColor(context.id) : colors.textSecondary }} 
                />
                <span 
                  className="text-sm font-semibold"
                  style={{ color: isActive ? getContextColor(context.id) : colors.textSecondary }}
                >
                  {context.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto">
        {/* Real-time Translation Interface */}
        <section aria-labelledby="translation-heading" className="p-4">
          <div className="flex items-center justify-between mb-3">
            <h2 id="translation-heading" className="text-lg font-semibold" style={{ color: colors.textPrimary }}>
              What ASL is this?
            </h2>
          </div>

          <div 
            className="rounded-2xl overflow-hidden mb-4"
            style={{
              background: colors.cardBg,
              backdropFilter: colors.blur,
              WebkitBackdropFilter: colors.blur,
              border: colors.glassBorder,
              boxShadow: colors.shadow,
            }}
          >
            {/* Camera View */}
            <div 
              className="relative aspect-video bg-gradient-to-br flex items-center justify-center"
              style={{
                background: theme === 'dark' 
                  ? 'linear-gradient(135deg, #1E1E3F 0%, #252541 100%)'
                  : 'linear-gradient(135deg, #E0F2FE 0%, #EDE9FE 100%)',
              }}
              role="img"
              aria-label={isCameraActive ? 'Camera is active' : 'Camera is inactive'}
            >
              {!isCameraActive ? (
                <div className="text-center">
                  <Camera className="w-16 h-16 mx-auto mb-3 opacity-30" style={{ color: colors.textTertiary }} />
                  <div className="text-sm font-semibold mb-1" style={{ color: colors.textSecondary }}>
                    Camera Inactive
                  </div>
                  <div className="text-xs" style={{ color: colors.textTertiary }}>
                    Tap to start translating
                  </div>
                </div>
              ) : (
                <>
                  <Hand className="w-24 h-24 opacity-20" style={{ color: colors.iconColor }} />
                  <div 
                    className="absolute top-4 left-4 px-3 py-1 rounded-full flex items-center gap-2"
                    style={{ background: 'rgba(0, 0, 0, 0.7)' }}
                  >
                    <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                    <span className="text-xs font-bold text-white">LIVE</span>
                  </div>
                  <div 
                    className="absolute bottom-4 left-4 right-4 rounded-xl p-3"
                    style={{ background: 'rgba(0, 0, 0, 0.85)' }}
                  >
                    <div className="text-sm font-bold text-white mb-1">
                      Detecting sign...
                    </div>
                    <div className="text-xs text-white/70">
                      Position your hands clearly in view
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Controls */}
            <div className="p-4 flex items-center justify-center gap-3">
              <Button
                onClick={() => setIsCameraActive(!isCameraActive)}
                className="h-12 px-6 rounded-xl font-semibold flex items-center gap-2"
                style={{ 
                  background: isCameraActive ? colors.errorColor : colors.successColor,
                  color: '#FFFFFF',
                }}
                aria-label={isCameraActive ? 'Stop camera' : 'Start camera'}
              >
                {isCameraActive ? (
                  <>
                    <Pause className="w-5 h-5" />
                    Stop
                  </>
                ) : (
                  <>
                    <Camera className="w-5 h-5" />
                    Start Camera
                  </>
                )}
              </Button>
              <Button
                variant="outline"
                className="h-12 px-4 rounded-xl"
                style={{
                  borderColor: colors.border,
                  color: colors.textSecondary,
                }}
                aria-label="Switch camera"
              >
                <RotateCcw className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </section>

        {/* Quick Phrases */}
        <section aria-labelledby="quick-phrases-heading" className="px-4 pb-4">
          <div className="flex items-center justify-between mb-3">
            <h2 id="quick-phrases-heading" className="text-lg font-semibold" style={{ color: colors.textPrimary }}>
              Quick Phrases
            </h2>
            <button
              className="text-sm font-semibold"
              style={{ color: colors.iconColor }}
              aria-label="View all quick phrases"
            >
              See All
            </button>
          </div>

          <div className="space-y-2">
            {quickPhrases.slice(0, 6).map((phrase) => (
              <div
                key={phrase.id}
                className="rounded-xl p-3 flex items-start gap-3"
                style={{
                  background: colors.cardBg,
                  backdropFilter: colors.blur,
                  WebkitBackdropFilter: colors.blur,
                  border: colors.glassBorder,
                  boxShadow: colors.shadow,
                }}
              >
                <button
                  onClick={() => handleTranslatePhrase(phrase)}
                  className="flex-1 text-left min-w-0"
                  aria-label={`Translate: ${phrase.text}`}
                >
                  <div className="text-sm font-semibold mb-1" style={{ color: colors.textPrimary }}>
                    {phrase.text}
                  </div>
                  <div className="text-xs" style={{ color: colors.textTertiary }}>
                    ASL: {phrase.aslTranslation}
                  </div>
                </button>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <button
                    onClick={() => handleTogglePhraseSave(phrase.id)}
                    className="p-2 rounded-lg"
                    style={{ background: phrase.isSaved ? colors.warningBg : 'transparent' }}
                    aria-label={phrase.isSaved ? 'Remove from saved phrases' : 'Save phrase'}
                    aria-pressed={phrase.isSaved}
                  >
                    {phrase.isSaved ? (
                      <BookmarkCheck className="w-4 h-4" style={{ color: colors.warningColor }} />
                    ) : (
                      <Bookmark className="w-4 h-4" style={{ color: colors.textTertiary }} />
                    )}
                  </button>
                  <button
                    className="p-2 rounded-lg"
                    style={{ background: colors.iconBg }}
                    aria-label="Play phrase"
                  >
                    <Play className="w-4 h-4" style={{ color: colors.iconColor }} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Recent Conversations */}
        <section aria-labelledby="conversations-heading" className="px-4 pb-4">
          <div className="flex items-center justify-between mb-3">
            <h2 id="conversations-heading" className="text-lg font-semibold" style={{ color: colors.textPrimary }}>
              Recent Conversations
            </h2>
            <button
              className="text-sm font-semibold"
              style={{ color: colors.iconColor }}
              aria-label="View all conversations"
            >
              View All
            </button>
          </div>

          <div className="space-y-2">
            {conversations.map((conv) => {
              const ContextIcon = getContextIcon(conv.context);
              return (
                <button
                  key={conv.id}
                  className="w-full rounded-xl p-3 text-left flex items-start gap-3"
                  style={{
                    background: colors.cardBg,
                    backdropFilter: colors.blur,
                    WebkitBackdropFilter: colors.blur,
                    border: colors.glassBorder,
                    boxShadow: colors.shadow,
                  }}
                  aria-label={`View conversation with ${conv.participantName}`}
                >
                  <div 
                    className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
                    style={{ background: colors.iconBg }}
                  >
                    <ContextIcon className="w-5 h-5" style={{ color: getContextColor(conv.context) }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-1">
                      <div className="font-semibold truncate" style={{ color: colors.textPrimary }}>
                        {conv.participantName}
                      </div>
                      <div className="text-xs flex-shrink-0 ml-2" style={{ color: colors.textTertiary }}>
                        {conv.timestamp}
                      </div>
                    </div>
                    <div className="text-sm truncate mb-1" style={{ color: colors.textSecondary }}>
                      {conv.lastMessage}
                    </div>
                    <div className="text-xs" style={{ color: colors.textTertiary }}>
                      {conv.messageCount} messages
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 flex-shrink-0" style={{ color: colors.textTertiary }} />
                </button>
              );
            })}
          </div>
        </section>

        {/* Common Signs */}
        <section aria-labelledby="common-signs-heading" className="px-4 pb-4">
          <div className="flex items-center justify-between mb-3">
            <h2 id="common-signs-heading" className="text-lg font-semibold" style={{ color: colors.textPrimary }}>
              Common Signs
            </h2>
            <button
              className="text-sm font-semibold"
              style={{ color: colors.iconColor }}
              aria-label="View all common signs"
            >
              See All
            </button>
          </div>

          <div className="grid grid-cols-3 gap-3">
            {commonSigns.slice(0, 6).map((sign) => (
              <button
                key={sign.id}
                onClick={() => handleSignPress(sign)}
                className="rounded-xl p-4 text-center transition-all"
                style={{
                  background: colors.cardBg,
                  backdropFilter: colors.blur,
                  WebkitBackdropFilter: colors.blur,
                  border: colors.glassBorder,
                  boxShadow: colors.shadow,
                }}
                aria-label={`Sign for ${sign.name}: ${sign.description}`}
              >
                <div 
                  className="w-12 h-12 rounded-full mx-auto mb-2 flex items-center justify-center"
                  style={{ background: colors.iconBg }}
                >
                  <Hand className="w-6 h-6" style={{ color: colors.iconColor }} />
                </div>
                <div className="text-sm font-semibold" style={{ color: colors.textPrimary }}>
                  {sign.name}
                </div>
              </button>
            ))}
          </div>
        </section>

        {/* Saved Phrases */}
        <section aria-labelledby="saved-phrases-heading" className="px-4 pb-4">
          <div className="flex items-center justify-between mb-3">
            <h2 id="saved-phrases-heading" className="text-lg font-semibold" style={{ color: colors.textPrimary }}>
              Saved Phrases
            </h2>
            <button
              className="text-sm font-semibold"
              style={{ color: colors.iconColor }}
              aria-label="Manage saved phrases"
            >
              Manage
            </button>
          </div>

          <div className="space-y-2">
            {savedPhrases.map((phrase) => (
              <div
                key={phrase.id}
                className="rounded-xl p-3"
                style={{
                  background: colors.cardBg,
                  backdropFilter: colors.blur,
                  WebkitBackdropFilter: colors.blur,
                  border: colors.glassBorder,
                  boxShadow: colors.shadow,
                }}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-semibold mb-1" style={{ color: colors.textPrimary }}>
                      {phrase.englishText}
                    </div>
                    <div className="text-xs mb-1" style={{ color: colors.textTertiary }}>
                      ASL: {phrase.aslDescription}
                    </div>
                  </div>
                  <button
                    className="p-2 rounded-lg flex-shrink-0"
                    style={{ background: colors.errorBg }}
                    aria-label="Delete saved phrase"
                  >
                    <Trash2 className="w-4 h-4" style={{ color: colors.errorColor }} />
                  </button>
                </div>
                <div className="flex items-center gap-2 text-xs" style={{ color: colors.textTertiary }}>
                  <span 
                    className="px-2 py-0.5 rounded-full"
                    style={{
                      background: getContextColor(phrase.context) + '20',
                      color: getContextColor(phrase.context),
                    }}
                  >
                    {phrase.context}
                  </span>
                  <span>•</span>
                  <span>Saved {phrase.savedDate}</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Translation Settings */}
        <section aria-labelledby="settings-heading" className="px-4 pb-6">
          <h2 id="settings-heading" className="text-lg font-semibold mb-3" style={{ color: colors.textPrimary }}>
            Translation Settings
          </h2>

          <div 
            className="rounded-2xl p-4 space-y-4"
            style={{
              background: colors.cardBg,
              backdropFilter: colors.blur,
              WebkitBackdropFilter: colors.blur,
              border: colors.glassBorder,
              boxShadow: colors.shadow,
            }}
          >
            {/* ASL Language Selection */}
            <button
              className="w-full flex items-center justify-between p-2 rounded-lg"
              style={{ background: colors.cardHover }}
              aria-label="Change ASL language selection"
            >
              <div className="flex items-center gap-3">
                <Languages className="w-5 h-5" style={{ color: colors.iconColor }} />
                <div className="text-left">
                  <div className="text-sm font-semibold" style={{ color: colors.textPrimary }}>
                    ASL Language Selection
                  </div>
                  <div className="text-xs" style={{ color: colors.textTertiary }}>
                    {settings.aslLanguage}
                  </div>
                </div>
              </div>
              <ChevronRight className="w-5 h-5" style={{ color: colors.textTertiary }} />
            </button>

            {/* Interpreter Speed */}
            <button
              className="w-full flex items-center justify-between p-2 rounded-lg"
              style={{ background: colors.cardHover }}
              aria-label="Adjust interpreter speed"
            >
              <div className="flex items-center gap-3">
                <Gauge className="w-5 h-5" style={{ color: colors.accentColor }} />
                <div className="text-left">
                  <div className="text-sm font-semibold" style={{ color: colors.textPrimary }}>
                    Interpreter Speed
                  </div>
                  <div className="text-xs" style={{ color: colors.textTertiary }}>
                    {settings.interpreterSpeed}
                  </div>
                </div>
              </div>
              <ChevronRight className="w-5 h-5" style={{ color: colors.textTertiary }} />
            </button>

            {/* Show Sign Descriptions */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <FileText className="w-5 h-5" style={{ color: colors.successColor }} />
                <div>
                  <div className="text-sm font-semibold" style={{ color: colors.textPrimary }}>
                    Show Sign Descriptions
                  </div>
                  <div className="text-xs" style={{ color: colors.textTertiary }}>
                    Display text descriptions
                  </div>
                </div>
              </div>
              <button
                onClick={() => handleToggleSetting('showSignDescriptions')}
                className="relative w-12 h-6 rounded-full transition-colors flex-shrink-0"
                style={{ 
                  background: settings.showSignDescriptions ? colors.successColor : colors.border,
                }}
                role="switch"
                aria-checked={settings.showSignDescriptions}
                aria-label="Toggle sign descriptions"
              >
                <div 
                  className="absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white transition-transform"
                  style={{
                    transform: settings.showSignDescriptions ? 'translateX(24px)' : 'translateX(0)',
                  }}
                />
              </button>
            </div>

            {/* Save Conversation History */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <History className="w-5 h-5" style={{ color: colors.warningColor }} />
                <div>
                  <div className="text-sm font-semibold" style={{ color: colors.textPrimary }}>
                    Save Conversation History
                  </div>
                  <div className="text-xs" style={{ color: colors.textTertiary }}>
                    Keep translation records
                  </div>
                </div>
              </div>
              <button
                onClick={() => handleToggleSetting('saveConversationHistory')}
                className="relative w-12 h-6 rounded-full transition-colors flex-shrink-0"
                style={{ 
                  background: settings.saveConversationHistory ? colors.iconColor : colors.border,
                }}
                role="switch"
                aria-checked={settings.saveConversationHistory}
                aria-label="Toggle conversation history saving"
              >
                <div 
                  className="absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white transition-transform"
                  style={{
                    transform: settings.saveConversationHistory ? 'translateX(24px)' : 'translateX(0)',
                  }}
                />
              </button>
            </div>

            {/* Auto-Translate */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Zap className="w-5 h-5" style={{ color: colors.accentColor }} />
                <div>
                  <div className="text-sm font-semibold" style={{ color: colors.textPrimary }}>
                    Auto-Translate
                  </div>
                  <div className="text-xs" style={{ color: colors.textTertiary }}>
                    Instant translation mode
                  </div>
                </div>
              </div>
              <button
                onClick={() => handleToggleSetting('autoTranslate')}
                className="relative w-12 h-6 rounded-full transition-colors flex-shrink-0"
                style={{ 
                  background: settings.autoTranslate ? colors.accentColor : colors.border,
                }}
                role="switch"
                aria-checked={settings.autoTranslate}
                aria-label="Toggle auto-translate"
              >
                <div 
                  className="absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white transition-transform"
                  style={{
                    transform: settings.autoTranslate ? 'translateX(24px)' : 'translateX(0)',
                  }}
                />
              </button>
            </div>

            {/* Emergency Mode */}
            <div 
              className="rounded-xl p-3 border-2"
              style={{ 
                borderColor: settings.emergencyMode ? colors.errorColor : colors.border,
                background: settings.emergencyMode ? colors.errorBg : 'transparent',
              }}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <AlertCircle className="w-5 h-5" style={{ color: colors.errorColor }} />
                  <div>
                    <div className="text-sm font-semibold" style={{ color: colors.textPrimary }}>
                      Emergency Mode
                    </div>
                    <div className="text-xs" style={{ color: colors.textTertiary }}>
                      Quick access to urgent phrases
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => handleToggleSetting('emergencyMode')}
                  className="relative w-12 h-6 rounded-full transition-colors flex-shrink-0"
                  style={{ 
                    background: settings.emergencyMode ? colors.errorColor : colors.border,
                  }}
                  role="switch"
                  aria-checked={settings.emergencyMode}
                  aria-label="Toggle emergency mode"
                >
                  <div 
                    className="absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white transition-transform"
                    style={{
                      transform: settings.emergencyMode ? 'translateX(24px)' : 'translateX(0)',
                    }}
                  />
                </button>
              </div>
              {settings.emergencyMode && (
                <div className="mt-3 pt-3 border-t" style={{ borderTopColor: colors.border }}>
                  <Button
                    className="w-full h-10 rounded-xl font-semibold"
                    style={{ 
                      background: colors.errorColor,
                      color: '#FFFFFF',
                    }}
                    aria-label="Call 911 for help"
                  >
                    <Phone className="w-4 h-4 mr-2" />
                    Call for Help
                  </Button>
                  <div className="mt-2 text-xs text-center" style={{ color: colors.textTertiary }}>
                    Quick dial emergency services
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Info Box */}
        <section className="px-4 pb-6">
          <div 
            className="rounded-xl p-4 flex items-start gap-3"
            style={{
              background: colors.iconBg,
              border: colors.glassBorder,
            }}
          >
            <Info className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: colors.iconColor }} aria-hidden="true" />
            <div className="text-sm" style={{ color: colors.textSecondary }}>
              <strong style={{ color: colors.textPrimary }}>Interpreter Mode:</strong> Use this feature for real-time communication assistance. The camera recognizes ASL signs and provides instant translations. Save frequently used phrases for quick access.
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
