import { useState, useRef, useMemo } from 'react';
import { dictionarySigns, type DictionarySign } from '../data/signDictionary';
import { Button } from './ui/button';
import { useTheme } from '../context/ThemeContext';
import { useApp } from '../context/AppContext';
import exampleImage from 'figma:asset/b410857d4653efd06d6c1cb98e52f5bb1d97bba7.png';
import { 
  X, 
  Search,
  Mic,
  Filter,
  BookOpen,
  Star,
  Share2,
  Play,
  Pause,
  RotateCcw,
  Download,
  Lock,
  Unlock,
  Bookmark,
  BookmarkCheck,
  Plus,
  Check,
  ChevronRight,
  ChevronLeft,
  Volume2,
  Maximize,
  Minimize,
  Eye,
  Heart,
  Users,
  Globe,
  MapPin,
  Clock,
  TrendingUp,
  Award,
  Zap,
  Target,
  Grid,
  List,
  Info,
  MoreVertical,
  Camera,
  Video,
  Image as ImageIcon,
  Layers,
  BarChart3,
  Settings,
  Sparkles,
  Crown,
  CheckCircle2,
  AlertCircle,
  XCircle,
  Circle,
  Anchor,
} from 'lucide-react';

interface SignDictionaryProps {
  onExit: () => void;
}


export function SignDictionary({ onExit }: SignDictionaryProps) {
  const { theme } = useTheme();
  const { userProgress } = useApp();

  const [activeView, setActiveView] = useState<'browse' | 'detail' | 'history'>('browse');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLetter, setSelectedLetter] = useState<string | null>(null);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedDifficulties, setSelectedDifficulties] = useState<string[]>([]);
  const [selectedFrequencies, setSelectedFrequencies] = useState<string[]>([]);
  const [selectedContexts, setSelectedContexts] = useState<string[]>([]);
  const [selectedSign, setSelectedSign] = useState<DictionarySign | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list');
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [currentAngle, setCurrentAngle] = useState(0);
  const [showShareModal, setShowShareModal] = useState(false);
  const [showStudySetModal, setShowStudySetModal] = useState(false);
  const [voiceSearchActive, setVoiceSearchActive] = useState(false);
  const [isPremium] = useState(true); // User's premium status

  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
  
  const categories = [
    'Greetings', 'Food & Drink', 'Numbers', 'Medical', 'Family', 
    'Emotions', 'Colors', 'Animals', 'Places', 'Time', 
    'Weather', 'Transportation', 'Education', 'Work', 'Emergency'
  ];

  const difficulties = ['beginner', 'intermediate', 'advanced'];
  const frequencies = ['common', 'moderate', 'rare'];
  const contexts = ['Formal', 'Casual', 'Regional', 'Professional', 'Educational'];

  // Comprehensive sign dictionary with real ASL content
  const allSigns = useMemo(() => dictionarySigns, []);

  // Recently viewed signs
  const [recentlyViewed] = useState<string[]>([
    'hello', 'thank-you', 'happy', 'love', 'beautiful', 
    'coffee', 'friend', 'family', 'water', 'yes'
  ]);

  // Filter signs based on search and filters
  const filteredSigns = allSigns.filter(sign => {
    // Search filter
    if (searchQuery && !sign.word.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }

    // Letter filter
    if (selectedLetter && !sign.word.toUpperCase().startsWith(selectedLetter)) {
      return false;
    }

    // Category filter
    if (selectedCategories.length > 0 && !selectedCategories.includes(sign.category)) {
      return false;
    }

    // Difficulty filter
    if (selectedDifficulties.length > 0 && !selectedDifficulties.includes(sign.difficulty)) {
      return false;
    }

    // Frequency filter
    if (selectedFrequencies.length > 0 && !selectedFrequencies.includes(sign.frequency)) {
      return false;
    }

    // Context filter
    if (selectedContexts.length > 0 && !sign.context.some(c => selectedContexts.includes(c))) {
      return false;
    }

    // Premium/Free tier filter
    if (!isPremium && sign.isPremium && !sign.isLearned) {
      return false;
    }

    return true;
  });

  const handleSignSelect = (sign: DictionarySign) => {
    setSelectedSign(sign);
    setActiveView('detail');
    setCurrentAngle(0);
    setIsPlaying(false);
    setPlaybackSpeed(1);
  };

  const handleToggleFavorite = () => {
    if (selectedSign) {
      selectedSign.isFavorite = !selectedSign.isFavorite;
      setSelectedSign({ ...selectedSign });
    }
  };

  const handleVoiceSearch = () => {
    setVoiceSearchActive(true);
    // Simulate voice recognition
    setTimeout(() => {
      setVoiceSearchActive(false);
      setSearchQuery('hello');
    }, 2000);
  };

  const toggleFilter = (filterArray: string[], setFilterArray: (arr: string[]) => void, value: string) => {
    if (filterArray.includes(value)) {
      setFilterArray(filterArray.filter(v => v !== value));
    } else {
      setFilterArray([...filterArray, value]);
    }
  };

  const recentSigns = allSigns.filter(sign => recentlyViewed.includes(sign.id));

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

  const getDifficultyColor = (difficulty: string) => {
    if (difficulty === 'beginner') return colors.successColor;
    if (difficulty === 'intermediate') return colors.warningColor;
    return colors.errorColor;
  };

  const getFrequencyColor = (frequency: string) => {
    if (frequency === 'common') return colors.successColor;
    if (frequency === 'moderate') return colors.warningColor;
    return colors.textTertiary;
  };

  return (
    <div 
      className="h-full flex flex-col"
      style={{ background: colors.bg, color: colors.textPrimary }}
      role="main"
      aria-labelledby="dictionary-title"
    >
      {/* Header */}
      <div 
        className="p-4 border-b"
        style={{ borderBottomColor: colors.border }}
      >
        <div className="flex items-center gap-2 sm:gap-3 mb-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={onExit}
            style={{ color: colors.textSecondary }}
            aria-label="Exit sign dictionary"
            className="flex-shrink-0"
          >
            <X className="w-6 h-6" />
          </Button>
          <div className="flex-1 min-w-0">
            <h1 
              id="dictionary-title" 
              className="text-xl sm:text-2xl font-bold truncate"
              style={{ fontFamily: 'Poppins, sans-serif' }}
            >
              Sign Dictionary
            </h1>
            <p className="text-sm truncate" style={{ color: colors.textSecondary }}>
              {filteredSigns.length} signs • {isPremium ? 'Premium Access' : 'Free Tier'}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button
              onClick={() => setActiveView('history')}
              size="icon"
              className="flex-shrink-0"
              style={{ 
                background: activeView === 'history' ? colors.iconBg : 'transparent',
                color: colors.iconColor,
              }}
              aria-label="View recently viewed signs"
            >
              <Clock className="w-5 h-5" />
            </Button>
            <Button
              onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
              size="icon"
              className="flex-shrink-0"
              style={{ 
                background: colors.iconBg,
                color: colors.iconColor,
              }}
              aria-label={`Switch to ${viewMode === 'grid' ? 'list' : 'grid'} view`}
            >
              {viewMode === 'grid' ? <List className="w-5 h-5" /> : <Grid className="w-5 h-5" />}
            </Button>
          </div>
        </div>

        {/* Search Bar */}
        {activeView !== 'detail' && (
          <div className="relative mb-3">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5" style={{ color: colors.textTertiary }} aria-hidden="true" />
            <input
              type="text"
              placeholder="Search signs by word or description..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-11 pl-10 pr-24 rounded-xl"
              style={{
                background: colors.cardBg,
                border: colors.glassBorder,
                color: colors.textPrimary,
              }}
              aria-label="Search signs"
            />
            <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
              <button
                onClick={handleVoiceSearch}
                className="p-2 rounded-lg"
                style={{ 
                  background: voiceSearchActive ? colors.errorBg : colors.iconBg,
                  color: voiceSearchActive ? colors.errorColor : colors.iconColor,
                }}
                aria-label="Voice search"
              >
                <Mic className="w-4 h-4" />
              </button>
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="p-2 rounded-lg"
                style={{ 
                  background: showFilters ? colors.iconBg : 'transparent',
                  color: colors.iconColor,
                }}
                aria-label="Toggle filters"
                aria-expanded={showFilters}
              >
                <Filter className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Filter Panel */}
        {showFilters && activeView !== 'detail' && (
          <div 
            className="rounded-xl p-4 space-y-3"
            style={{
              background: colors.cardBg,
              backdropFilter: colors.blur,
              WebkitBackdropFilter: colors.blur,
              border: colors.glassBorder,
              boxShadow: colors.shadow,
            }}
            role="region"
            aria-label="Sign filters"
          >
            {/* Categories */}
            <div>
              <div className="text-sm font-semibold mb-2" style={{ color: colors.textPrimary }}>
                Categories
              </div>
              <div className="flex flex-wrap gap-1.5">
                {categories.slice(0, 8).map((category) => {
                  const isSelected = selectedCategories.includes(category);
                  return (
                    <button
                      key={category}
                      onClick={() => toggleFilter(selectedCategories, setSelectedCategories, category)}
                      className="px-3 py-1 rounded-full text-xs font-medium"
                      style={{
                        background: isSelected ? colors.iconColor : colors.border,
                        color: isSelected ? (theme === 'dark' ? 'var(--color-bg-deep)' : '#FFFFFF') : colors.textTertiary,
                      }}
                      aria-pressed={isSelected}
                    >
                      {category}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Difficulty & Frequency */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <div className="text-sm font-semibold mb-2" style={{ color: colors.textPrimary }}>
                  Difficulty
                </div>
                <div className="space-y-1">
                  {difficulties.map((difficulty) => {
                    const isSelected = selectedDifficulties.includes(difficulty);
                    return (
                      <button
                        key={difficulty}
                        onClick={() => toggleFilter(selectedDifficulties, setSelectedDifficulties, difficulty)}
                        className="w-full px-3 py-1.5 rounded-lg text-xs font-medium text-left"
                        style={{
                          background: isSelected ? colors.iconBg : 'transparent',
                          border: `1px solid ${isSelected ? colors.iconColor : colors.border}`,
                          color: isSelected ? colors.iconColor : colors.textSecondary,
                        }}
                        aria-pressed={isSelected}
                      >
                        {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <div className="text-sm font-semibold mb-2" style={{ color: colors.textPrimary }}>
                  Frequency
                </div>
                <div className="space-y-1">
                  {frequencies.map((frequency) => {
                    const isSelected = selectedFrequencies.includes(frequency);
                    return (
                      <button
                        key={frequency}
                        onClick={() => toggleFilter(selectedFrequencies, setSelectedFrequencies, frequency)}
                        className="w-full px-3 py-1.5 rounded-lg text-xs font-medium text-left"
                        style={{
                          background: isSelected ? colors.iconBg : 'transparent',
                          border: `1px solid ${isSelected ? colors.iconColor : colors.border}`,
                          color: isSelected ? colors.iconColor : colors.textSecondary,
                        }}
                        aria-pressed={isSelected}
                      >
                        {frequency.charAt(0).toUpperCase() + frequency.slice(1)}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Context Tags */}
            <div>
              <div className="text-sm font-semibold mb-2" style={{ color: colors.textPrimary }}>
                Context
              </div>
              <div className="flex flex-wrap gap-1.5">
                {contexts.map((context) => {
                  const isSelected = selectedContexts.includes(context);
                  return (
                    <button
                      key={context}
                      onClick={() => toggleFilter(selectedContexts, setSelectedContexts, context)}
                      className="px-3 py-1 rounded-full text-xs font-medium"
                      style={{
                        background: isSelected ? colors.accentColor : colors.border,
                        color: isSelected ? '#FFFFFF' : colors.textTertiary,
                      }}
                      aria-pressed={isSelected}
                    >
                      {context}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Clear Filters */}
            {(selectedCategories.length > 0 || selectedDifficulties.length > 0 || selectedFrequencies.length > 0 || selectedContexts.length > 0) && (
              <Button
                onClick={() => {
                  setSelectedCategories([]);
                  setSelectedDifficulties([]);
                  setSelectedFrequencies([]);
                  setSelectedContexts([]);
                }}
                className="w-full h-10 rounded-xl font-semibold"
                style={{ 
                  background: colors.errorBg,
                  color: colors.errorColor,
                }}
                aria-label="Clear all filters"
              >
                <XCircle className="w-4 h-4 mr-2" />
                Clear Filters
              </Button>
            )}
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        {/* Browse View */}
        {activeView === 'browse' && (
          <div>
            {/* A-Z Index */}
            <div className="px-4 py-3 border-b" style={{ borderBottomColor: colors.border }}>
              <div className="flex flex-wrap gap-1">
                {alphabet.map((letter) => {
                  const hasSign = allSigns.some(s => s.word.toUpperCase().startsWith(letter));
                  const isSelected = selectedLetter === letter;
                  
                  return (
                    <button
                      key={letter}
                      onClick={() => setSelectedLetter(isSelected ? null : letter)}
                      disabled={!hasSign}
                      className="w-8 h-8 rounded-lg text-sm font-bold flex items-center justify-center"
                      style={{
                        background: isSelected ? colors.iconColor : hasSign ? colors.iconBg : 'transparent',
                        color: isSelected ? (theme === 'dark' ? 'var(--color-bg-deep)' : '#FFFFFF') : hasSign ? colors.iconColor : colors.border,
                        cursor: hasSign ? 'pointer' : 'not-allowed',
                      }}
                      aria-label={`Filter by letter ${letter}`}
                      aria-pressed={isSelected}
                      aria-disabled={!hasSign}
                    >
                      {letter}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Signs List/Grid */}
            <div className="p-4">
              {filteredSigns.length === 0 ? (
                <div 
                  className="rounded-xl p-8 text-center"
                  style={{
                    background: colors.cardBg,
                    backdropFilter: colors.blur,
                    WebkitBackdropFilter: colors.blur,
                    border: colors.glassBorder,
                    boxShadow: colors.shadow,
                  }}
                >
                  <Search className="w-12 h-12 mx-auto mb-3" style={{ color: colors.textTertiary }} />
                  <div className="font-semibold mb-1" style={{ color: colors.textPrimary }}>
                    No signs found
                  </div>
                  <div className="text-sm" style={{ color: colors.textTertiary }}>
                    Try adjusting your search or filters
                  </div>
                </div>
              ) : viewMode === 'list' ? (
                <div className="space-y-2">
                  {filteredSigns.map((sign) => (
                    <button
                      key={sign.id}
                      onClick={() => handleSignSelect(sign)}
                      className="w-full rounded-xl p-3 text-left"
                      style={{
                        background: colors.cardBg,
                        backdropFilter: colors.blur,
                        WebkitBackdropFilter: colors.blur,
                        border: colors.glassBorder,
                        boxShadow: colors.shadow,
                      }}
                      aria-label={`View ${sign.word} sign details`}
                    >
                      <div className="flex items-start gap-3">
                        <div 
                          className="w-16 h-16 rounded-lg flex items-center justify-center flex-shrink-0"
                          style={{ background: colors.iconBg }}
                        >
                          <Video className="w-8 h-8" style={{ color: colors.iconColor }} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-semibold" style={{ color: colors.textPrimary }}>
                              {sign.word}
                            </h3>
                            {sign.isPremium && !sign.isLearned && (
                              <Lock className="w-3 h-3" style={{ color: colors.warningColor }} aria-label="Premium sign" />
                            )}
                            {sign.isFavorite && (
                              <Heart className="w-3 h-3" style={{ color: colors.errorColor }} fill={colors.errorColor} aria-label="Favorited" />
                            )}
                            {sign.isDownloaded && (
                              <Download className="w-3 h-3" style={{ color: colors.successColor }} aria-label="Downloaded" />
                            )}
                          </div>
                          <div className="text-sm mb-2 line-clamp-2" style={{ color: colors.textTertiary }}>
                            {sign.description}
                          </div>
                          <div className="flex flex-wrap items-center gap-1.5">
                            <span 
                              className="px-2 py-0.5 rounded text-xs"
                              style={{ 
                                background: `${getDifficultyColor(sign.difficulty)}20`,
                                color: getDifficultyColor(sign.difficulty),
                              }}
                            >
                              {sign.difficulty}
                            </span>
                            <span 
                              className="px-2 py-0.5 rounded text-xs"
                              style={{ 
                                background: `${getFrequencyColor(sign.frequency)}20`,
                                color: getFrequencyColor(sign.frequency),
                              }}
                            >
                              {sign.frequency}
                            </span>
                            <span 
                              className="px-2 py-0.5 rounded text-xs"
                              style={{ 
                                background: colors.accentBg,
                                color: colors.accentColor,
                              }}
                            >
                              {sign.category}
                            </span>
                            <span className="text-xs" style={{ color: colors.textTertiary }}>
                              • {sign.viewCount} views
                            </span>
                          </div>
                        </div>
                        <ChevronRight className="w-5 h-5 flex-shrink-0" style={{ color: colors.textTertiary }} />
                      </div>
                    </button>
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-3">
                  {filteredSigns.map((sign) => (
                    <button
                      key={sign.id}
                      onClick={() => handleSignSelect(sign)}
                      className="rounded-xl p-3 text-left"
                      style={{
                        background: colors.cardBg,
                        backdropFilter: colors.blur,
                        WebkitBackdropFilter: colors.blur,
                        border: colors.glassBorder,
                        boxShadow: colors.shadow,
                      }}
                      aria-label={`View ${sign.word} sign details`}
                    >
                      <div 
                        className="w-full aspect-square rounded-lg flex items-center justify-center mb-2"
                        style={{ background: colors.iconBg }}
                      >
                        <Video className="w-10 h-10" style={{ color: colors.iconColor }} />
                      </div>
                      <div className="font-semibold mb-1 text-sm truncate" style={{ color: colors.textPrimary }}>
                        {sign.word}
                      </div>
                      <div className="flex items-center gap-1 mb-1">
                        {sign.isPremium && !sign.isLearned && (
                          <Lock className="w-3 h-3" style={{ color: colors.warningColor }} aria-label="Premium" />
                        )}
                        {sign.isFavorite && (
                          <Heart className="w-3 h-3" style={{ color: colors.errorColor }} fill={colors.errorColor} aria-label="Favorited" />
                        )}
                      </div>
                      <div className="text-xs" style={{ color: colors.textTertiary }}>
                        {sign.category}
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Detail View - Continued in next part due to length */}
        {activeView === 'detail' && selectedSign && (
          <div className="p-4 space-y-4">
            {/* Back Button */}
            <Button
              onClick={() => setActiveView('browse')}
              variant="ghost"
              className="mb-2"
              style={{ color: colors.iconColor }}
              aria-label="Back to browse"
            >
              <ChevronLeft className="w-5 h-5 mr-1" />
              Back to Dictionary
            </Button>

            {/* Video Player */}
            <div 
              className="rounded-2xl overflow-hidden"
              style={{
                background: colors.cardBg,
                backdropFilter: colors.blur,
                WebkitBackdropFilter: colors.blur,
                border: colors.glassBorder,
                boxShadow: colors.shadow,
              }}
            >
              <div 
                className="w-full aspect-video flex items-center justify-center relative"
                style={{ background: colors.iconBg }}
              >
                <img
                  src={exampleImage}
                  alt={`${selectedSign.word} sign demonstration`}
                  className="w-full h-full object-cover"
                />
                {!isPlaying && (
                  <button
                    onClick={() => setIsPlaying(true)}
                    className="absolute inset-0 flex items-center justify-center"
                    style={{ background: 'rgba(0, 0, 0, 0.4)' }}
                    aria-label="Play video"
                  >
                    <div 
                      className="w-16 h-16 rounded-full flex items-center justify-center"
                      style={{ background: colors.iconColor }}
                    >
                      <Play className="w-8 h-8" style={{ color: theme === 'dark' ? 'var(--color-bg-deep)' : '#FFFFFF' }} />
                    </div>
                  </button>
                )}
              </div>

              {/* Video Controls */}
              <div className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setIsPlaying(!isPlaying)}
                      className="p-2 rounded-lg"
                      style={{ background: colors.iconBg, color: colors.iconColor }}
                      aria-label={isPlaying ? 'Pause' : 'Play'}
                    >
                      {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
                    </button>
                    <button
                      className="p-2 rounded-lg"
                      style={{ background: colors.iconBg, color: colors.iconColor }}
                      aria-label="Restart video"
                    >
                      <RotateCcw className="w-5 h-5" />
                    </button>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <select
                      value={playbackSpeed}
                      onChange={(e) => setPlaybackSpeed(Number(e.target.value))}
                      className="px-3 py-1.5 rounded-lg text-sm"
                      style={{
                        background: colors.cardHover,
                        border: colors.glassBorder,
                        color: colors.textPrimary,
                      }}
                      aria-label="Playback speed"
                    >
                      <option value={0.25}>0.25x</option>
                      <option value={0.5}>0.5x</option>
                      <option value={0.75}>0.75x</option>
                      <option value={1}>1x</option>
                    </select>
                  </div>
                </div>

                {/* Angle Selection */}
                <div className="flex gap-2 overflow-x-auto">
                  {selectedSign.videos.map((video, idx) => (
                    <button
                      key={idx}
                      onClick={() => setCurrentAngle(idx)}
                      className="px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap"
                      style={{
                        background: currentAngle === idx ? colors.iconColor : colors.border,
                        color: currentAngle === idx ? (theme === 'dark' ? 'var(--color-bg-deep)' : '#FFFFFF') : colors.textSecondary,
                      }}
                      aria-label={`View ${video.angle}`}
                      aria-pressed={currentAngle === idx}
                    >
                      {video.angle}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Sign Info */}
            <div 
              className="rounded-xl p-4"
              style={{
                background: colors.cardBg,
                backdropFilter: colors.blur,
                WebkitBackdropFilter: colors.blur,
                border: colors.glassBorder,
                boxShadow: colors.shadow,
              }}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <h2 className="text-2xl font-bold mb-1" style={{ color: colors.textPrimary }}>
                    {selectedSign.word}
                  </h2>
                  <div className="flex items-center gap-2 mb-2">
                    <Volume2 className="w-4 h-4" style={{ color: colors.iconColor }} />
                    <span className="text-sm" style={{ color: colors.textSecondary }}>
                      {selectedSign.pronunciation}
                    </span>
                    <span className="text-sm" style={{ color: colors.textTertiary }}>
                      {selectedSign.phonetic}
                    </span>
                  </div>
                </div>
                <button
                  onClick={handleToggleFavorite}
                  className="p-2 rounded-lg"
                  style={{ background: colors.iconBg }}
                  aria-label={selectedSign.isFavorite ? 'Remove from favorites' : 'Add to favorites'}
                  aria-pressed={selectedSign.isFavorite}
                >
                  <Heart 
                    className="w-6 h-6" 
                    style={{ color: colors.errorColor }}
                    fill={selectedSign.isFavorite ? colors.errorColor : 'none'}
                  />
                </button>
              </div>

              <p className="text-sm mb-4" style={{ color: colors.textSecondary }}>
                {selectedSign.description}
              </p>

              <div className="flex flex-wrap gap-2 mb-4">
                <span 
                  className="px-3 py-1 rounded-full text-xs font-medium"
                  style={{ 
                    background: `${getDifficultyColor(selectedSign.difficulty)}20`,
                    color: getDifficultyColor(selectedSign.difficulty),
                  }}
                >
                  {selectedSign.difficulty}
                </span>
                <span 
                  className="px-3 py-1 rounded-full text-xs font-medium"
                  style={{ 
                    background: `${getFrequencyColor(selectedSign.frequency)}20`,
                    color: getFrequencyColor(selectedSign.frequency),
                  }}
                >
                  {selectedSign.frequency}
                </span>
                <span 
                  className="px-3 py-1 rounded-full text-xs font-medium"
                  style={{ 
                    background: colors.accentBg,
                    color: colors.accentColor,
                  }}
                >
                  {selectedSign.category}
                </span>
                {selectedSign.context.map((ctx) => (
                  <span 
                    key={ctx}
                    className="px-3 py-1 rounded-full text-xs font-medium"
                    style={{ 
                      background: colors.iconBg,
                      color: colors.iconColor,
                    }}
                  >
                    {ctx}
                  </span>
                ))}
              </div>

              {/* Usage Examples */}
              <div className="mb-4">
                <h3 className="text-sm font-semibold mb-2" style={{ color: colors.textPrimary }}>
                  Usage Examples
                </h3>
                <div className="space-y-2">
                  {selectedSign.usageExamples.map((example, idx) => (
                    <div 
                      key={idx}
                      className="rounded-lg p-2 text-sm"
                      style={{ background: colors.iconBg, color: colors.textSecondary }}
                    >
                      • {example}
                    </div>
                  ))}
                </div>
              </div>

              {/* Regional Variants */}
              {selectedSign.regionalVariants && selectedSign.regionalVariants.length > 0 && (
                <div className="mb-4">
                  <h3 className="text-sm font-semibold mb-2" style={{ color: colors.textPrimary }}>
                    Regional Variants
                  </h3>
                  <div className="space-y-2">
                    {selectedSign.regionalVariants.map((variant, idx) => (
                      <div 
                        key={idx}
                        className="rounded-lg p-3"
                        style={{ background: colors.accentBg }}
                      >
                        <div className="flex items-center gap-2 mb-1">
                          <MapPin className="w-4 h-4" style={{ color: colors.accentColor }} />
                          <span className="text-sm font-semibold" style={{ color: colors.textPrimary }}>
                            {variant.region}
                          </span>
                        </div>
                        <p className="text-xs" style={{ color: colors.textSecondary }}>
                          {variant.description}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Related Signs */}
            <div 
              className="rounded-xl p-4"
              style={{
                background: colors.cardBg,
                backdropFilter: colors.blur,
                WebkitBackdropFilter: colors.blur,
                border: colors.glassBorder,
                boxShadow: colors.shadow,
              }}
            >
              <h3 className="text-lg font-semibold mb-3" style={{ color: colors.textPrimary }}>
                Related Signs
              </h3>

              {selectedSign.relatedSigns.synonyms.length > 0 && (
                <div className="mb-3">
                  <div className="text-sm font-semibold mb-2" style={{ color: colors.textTertiary }}>
                    Synonyms
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {selectedSign.relatedSigns.synonyms.map((syn) => (
                      <span 
                        key={syn}
                        className="px-3 py-1 rounded-lg text-sm"
                        style={{ background: colors.successBg, color: colors.successColor }}
                      >
                        {syn}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {selectedSign.relatedSigns.antonyms.length > 0 && (
                <div className="mb-3">
                  <div className="text-sm font-semibold mb-2" style={{ color: colors.textTertiary }}>
                    Antonyms
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {selectedSign.relatedSigns.antonyms.map((ant) => (
                      <span 
                        key={ant}
                        className="px-3 py-1 rounded-lg text-sm"
                        style={{ background: colors.errorBg, color: colors.errorColor }}
                      >
                        {ant}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {selectedSign.relatedSigns.similar.length > 0 && (
                <div>
                  <div className="text-sm font-semibold mb-2" style={{ color: colors.textTertiary }}>
                    Similar Concepts
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {selectedSign.relatedSigns.similar.map((sim) => (
                      <span 
                        key={sim}
                        className="px-3 py-1 rounded-lg text-sm"
                        style={{ background: colors.iconBg, color: colors.iconColor }}
                      >
                        {sim}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-2 gap-3">
              <Button
                onClick={() => setShowStudySetModal(true)}
                className="h-12 rounded-xl font-semibold"
                style={{ 
                  background: colors.iconBg,
                  color: colors.iconColor,
                }}
                aria-label="Add to study set"
              >
                <Plus className="w-5 h-5 mr-2" />
                Add to Set
              </Button>
              <Button
                onClick={() => setShowShareModal(true)}
                className="h-12 rounded-xl font-semibold"
                style={{ 
                  background: colors.accentBg,
                  color: colors.accentColor,
                }}
                aria-label="Share sign"
              >
                <Share2 className="w-5 h-5 mr-2" />
                Share
              </Button>
            </div>

            <Button
              className="w-full h-14 rounded-xl font-semibold text-lg"
              style={{ 
                background: colors.successColor,
                color: '#FFFFFF',
              }}
              aria-label="Practice this sign now"
            >
              <Play className="w-6 h-6 mr-2" />
              Practice Now
            </Button>

            <div className="grid grid-cols-2 gap-3">
              <Button
                className="h-12 rounded-xl font-semibold"
                style={{ 
                  background: colors.iconBg,
                  color: colors.iconColor,
                }}
                aria-label="Add to room anchors"
              >
                <Anchor className="w-5 h-5 mr-2" />
                Add to Room
              </Button>
              {selectedSign.isPremium && !selectedSign.isDownloaded && (
                <Button
                  className="h-12 rounded-xl font-semibold"
                  style={{ 
                    background: colors.warningBg,
                    color: colors.warningColor,
                  }}
                  aria-label={`Download sign (${selectedSign.downloadSize})`}
                >
                  <Download className="w-5 h-5 mr-2" />
                  Download
                </Button>
              )}
            </div>
          </div>
        )}

        {/* History View */}
        {activeView === 'history' && (
          <div className="p-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold" style={{ color: colors.textPrimary }}>
                Recently Viewed
              </h2>
              <Button
                onClick={() => setActiveView('browse')}
                variant="ghost"
                style={{ color: colors.iconColor }}
                aria-label="Back to browse"
              >
                <ChevronLeft className="w-5 h-5 mr-1" />
                Back
              </Button>
            </div>

            <div className="space-y-2">
              {recentSigns.map((sign) => (
                <button
                  key={sign.id}
                  onClick={() => handleSignSelect(sign)}
                  className="w-full rounded-xl p-3 text-left"
                  style={{
                    background: colors.cardBg,
                    backdropFilter: colors.blur,
                    WebkitBackdropFilter: colors.blur,
                    border: colors.glassBorder,
                    boxShadow: colors.shadow,
                  }}
                  aria-label={`View ${sign.word} sign details`}
                >
                  <div className="flex items-center gap-3">
                    <div 
                      className="w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0"
                      style={{ background: colors.iconBg }}
                    >
                      <Clock className="w-6 h-6" style={{ color: colors.iconColor }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold mb-1" style={{ color: colors.textPrimary }}>
                        {sign.word}
                      </div>
                      <div className="text-xs" style={{ color: colors.textTertiary }}>
                        Last viewed: {sign.lastViewed && new Date(sign.lastViewed).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                      </div>
                    </div>
                    <ChevronRight className="w-5 h-5 flex-shrink-0" style={{ color: colors.textTertiary }} />
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Share Modal */}
      {showShareModal && (
        <div 
          className="fixed inset-0 bg-black/50 flex items-end sm:items-center justify-center z-50 p-4"
          onClick={() => setShowShareModal(false)}
        >
          <div 
            className="w-full max-w-md rounded-2xl p-6"
            style={{
              background: colors.cardBg,
              backdropFilter: colors.blur,
              WebkitBackdropFilter: colors.blur,
              border: colors.glassBorder,
              boxShadow: colors.shadow,
            }}
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-labelledby="share-title"
            aria-modal="true"
          >
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 id="share-title" className="text-xl font-bold mb-1" style={{ color: colors.textPrimary }}>
                  Share Sign
                </h3>
                <p className="text-sm" style={{ color: colors.textSecondary }}>
                  Share "{selectedSign?.word}" with friends
                </p>
              </div>
              <button
                onClick={() => setShowShareModal(false)}
                className="p-2 rounded-lg"
                style={{ color: colors.textSecondary }}
                aria-label="Close share modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <Button
                className="h-16 rounded-xl font-semibold flex flex-col items-center justify-center gap-2"
                style={{ 
                  background: colors.iconBg,
                  color: colors.iconColor,
                }}
                aria-label="Share via message"
              >
                <Share2 className="w-6 h-6" />
                Message
              </Button>
              <Button
                className="h-16 rounded-xl font-semibold flex flex-col items-center justify-center gap-2"
                style={{ 
                  background: colors.accentBg,
                  color: colors.accentColor,
                }}
                aria-label="Share to social media"
              >
                <Users className="w-6 h-6" />
                Social
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Study Set Modal */}
      {showStudySetModal && (
        <div 
          className="fixed inset-0 bg-black/50 flex items-end sm:items-center justify-center z-50 p-4"
          onClick={() => setShowStudySetModal(false)}
        >
          <div 
            className="w-full max-w-md rounded-2xl p-6"
            style={{
              background: colors.cardBg,
              backdropFilter: colors.blur,
              WebkitBackdropFilter: colors.blur,
              border: colors.glassBorder,
              boxShadow: colors.shadow,
            }}
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-labelledby="studyset-title"
            aria-modal="true"
          >
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 id="studyset-title" className="text-xl font-bold mb-1" style={{ color: colors.textPrimary }}>
                  Add to Study Set
                </h3>
                <p className="text-sm" style={{ color: colors.textSecondary }}>
                  Organize "{selectedSign?.word}" into a collection
                </p>
              </div>
              <button
                onClick={() => setShowStudySetModal(false)}
                className="p-2 rounded-lg"
                style={{ color: colors.textSecondary }}
                aria-label="Close study set modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-2 mb-4">
              {['Greetings Practice', 'Daily Use', 'Work Vocabulary', 'Medical Terms'].map((set) => (
                <button
                  key={set}
                  className="w-full rounded-xl p-3 text-left flex items-center justify-between"
                  style={{
                    background: colors.cardHover,
                    border: colors.glassBorder,
                  }}
                  aria-label={`Add to ${set}`}
                >
                  <span className="font-medium" style={{ color: colors.textPrimary }}>{set}</span>
                  <Plus className="w-5 h-5" style={{ color: colors.iconColor }} />
                </button>
              ))}
            </div>

            <Button
              className="w-full h-12 rounded-xl font-semibold"
              style={{ 
                background: colors.iconColor,
                color: theme === 'dark' ? 'var(--color-bg-deep)' : '#FFFFFF',
              }}
              aria-label="Create new study set"
            >
              <Plus className="w-5 h-5 mr-2" />
              Create New Set
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
