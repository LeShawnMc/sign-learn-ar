import { useState } from 'react';
import { Button } from './ui/button';
import { useTheme } from '../context/ThemeContext';
import { useApp } from '../context/AppContext';
import { motion, AnimatePresence } from 'motion/react';
import { X, Check, Globe, Crown, ChevronRight, Star, Lock, Info, Settings } from 'lucide-react';

interface LanguageSelectionProps {
  onExit: () => void;
  mode?: 'onboarding' | 'settings';
}

interface SignLanguage {
  id: string;
  name: string;
  nativeName: string;
  code: string;
  flag: string;
  learners: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  isPremium: boolean;
  variants?: Array<{
    id: string;
    name: string;
    region: string;
    isPremium: boolean;
  }>;
  description: string;
}

const signLanguages: SignLanguage[] = [
  {
    id: 'asl',
    name: 'American Sign Language',
    nativeName: 'ASL',
    code: 'asl',
    flag: '🇺🇸',
    learners: '2.3M learners',
    difficulty: 'beginner',
    isPremium: false,
    variants: [
      { id: 'asl-us', name: 'American ASL', region: 'United States', isPremium: false },
      { id: 'asl-ca', name: 'Canadian ASL', region: 'Canada', isPremium: true },
    ],
    description: 'The most widely used sign language in North America, with rich grammar and cultural significance.',
  },
  {
    id: 'bsl',
    name: 'British Sign Language',
    nativeName: 'BSL',
    code: 'bsl',
    flag: '🇬🇧',
    learners: '890K learners',
    difficulty: 'beginner',
    isPremium: true,
    variants: [
      { id: 'bsl-uk', name: 'British BSL', region: 'United Kingdom', isPremium: true },
      { id: 'bsl-au', name: 'Australian BSL', region: 'Australia', isPremium: true },
    ],
    description: 'Used primarily in the United Kingdom, with distinct grammar and vocabulary from ASL.',
  },
  {
    id: 'isl',
    name: 'Irish Sign Language',
    nativeName: 'ISL',
    code: 'isl',
    flag: '🇮🇪',
    learners: '340K learners',
    difficulty: 'intermediate',
    isPremium: true,
    variants: [
      { id: 'isl-ie', name: 'Irish ISL', region: 'Ireland', isPremium: true },
    ],
    description: 'The indigenous sign language of Ireland, recognized as an official language.',
  },
  {
    id: 'lsf',
    name: 'French Sign Language',
    nativeName: 'LSF',
    code: 'lsf',
    flag: '🇫🇷',
    learners: '1.1M learners',
    difficulty: 'intermediate',
    isPremium: true,
    variants: [
      { id: 'lsf-fr', name: 'French LSF', region: 'France', isPremium: true },
      { id: 'lsf-be', name: 'Belgian LSF', region: 'Belgium', isPremium: true },
    ],
    description: 'One of the oldest recorded sign languages, with influence on many other sign languages worldwide.',
  },
  {
    id: 'dgs',
    name: 'German Sign Language',
    nativeName: 'DGS',
    code: 'dgs',
    flag: '🇩🇪',
    learners: '750K learners',
    difficulty: 'intermediate',
    isPremium: true,
    variants: [
      { id: 'dgs-de', name: 'German DGS', region: 'Germany', isPremium: true },
      { id: 'dgs-at', name: 'Austrian DGS', region: 'Austria', isPremium: true },
    ],
    description: 'Used in Germany and parts of surrounding countries, with unique grammatical structures.',
  },
  {
    id: 'jsl',
    name: 'Japanese Sign Language',
    nativeName: 'JSL',
    code: 'jsl',
    flag: '🇯🇵',
    learners: '620K learners',
    difficulty: 'advanced',
    isPremium: true,
    variants: [
      { id: 'jsl-jp', name: 'Japanese JSL', region: 'Japan', isPremium: true },
    ],
    description: 'The indigenous sign language of Japan, completely distinct from spoken Japanese.',
  },
  {
    id: 'auslan',
    name: 'Australian Sign Language',
    nativeName: 'Auslan',
    code: 'auslan',
    flag: '🇦🇺',
    learners: '520K learners',
    difficulty: 'beginner',
    isPremium: true,
    variants: [
      { id: 'auslan-au', name: 'Australian Auslan', region: 'Australia', isPremium: true },
      { id: 'auslan-nz', name: 'New Zealand Auslan', region: 'New Zealand', isPremium: true },
    ],
    description: 'Related to BSL but with unique vocabulary and grammar developed in Australia.',
  },
  {
    id: 'csl',
    name: 'Chinese Sign Language',
    nativeName: 'CSL',
    code: 'csl',
    flag: '🇨🇳',
    learners: '1.8M learners',
    difficulty: 'advanced',
    isPremium: true,
    variants: [
      { id: 'csl-cn', name: 'Mainland CSL', region: 'China', isPremium: true },
      { id: 'csl-tw', name: 'Taiwan CSL', region: 'Taiwan', isPremium: true },
    ],
    description: 'Used across China with significant regional variations and unique cultural expressions.',
  },
];

export function LanguageSelection({ onExit, mode = 'settings' }: LanguageSelectionProps) {
  const { theme } = useTheme();
  const { selectedLanguage, userProgress } = useApp();
  const [selectedPrimary, setSelectedPrimary] = useState<string>(selectedLanguage);
  const [selectedVariant, setSelectedVariant] = useState<string | null>(null);
  const [showVariants, setShowVariants] = useState<string | null>(null);
  const [additionalLanguages, setAdditionalLanguages] = useState<string[]>([]);
  const [view, setView] = useState<'primary' | 'variants' | 'multi-language'>('primary');
  const [showUpgradePrompt, setShowUpgradePrompt] = useState(false);

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
        premiumGradient: 'linear-gradient(135deg, #F59E0B 0%, #FF6B9D 100%)',
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
        premiumGradient: 'linear-gradient(135deg, #F59E0B 0%, #EC4899 100%)',
        blur: 'blur(20px)',
        shadow: '0 8px 32px rgba(31, 38, 135, 0.15)',
        glassBorder: '1px solid rgba(255, 255, 255, 0.6)',
      };

  const handleSelectLanguage = (languageId: string, isPremium: boolean) => {
    if (isPremium && !userProgress.isPremium) {
      setShowUpgradePrompt(true);
      return;
    }
    
    setSelectedPrimary(languageId);
    const language = signLanguages.find(l => l.id === languageId);
    if (language?.variants && language.variants.length > 0) {
      setShowVariants(languageId);
      setView('variants');
    }
  };

  const handleSelectVariant = (variantId: string, isPremium: boolean) => {
    if (isPremium && !userProgress.isPremium) {
      setShowUpgradePrompt(true);
      return;
    }
    
    setSelectedVariant(variantId);
  };

  const handleToggleAdditionalLanguage = (languageId: string, isPremium: boolean) => {
    if (isPremium && !userProgress.isPremium) {
      setShowUpgradePrompt(true);
      return;
    }

    if (additionalLanguages.includes(languageId)) {
      setAdditionalLanguages(additionalLanguages.filter(id => id !== languageId));
    } else {
      setAdditionalLanguages([...additionalLanguages, languageId]);
    }
  };

  const handleSaveChanges = () => {
    // In a real app, this would save to context/database
    onExit();
  };

  const getDifficultyColor = (difficulty: SignLanguage['difficulty']) => {
    switch (difficulty) {
      case 'beginner': return colors.successColor;
      case 'intermediate': return colors.iconColor;
      case 'advanced': return colors.accentColor;
    }
  };

  const selectedLanguageData = signLanguages.find(l => l.id === selectedPrimary);

  return (
    <div 
      className="h-full flex flex-col"
      style={{ background: colors.bg, color: colors.textPrimary }}
      role="main"
      aria-labelledby="language-selection-title"
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
            aria-label="Close language selection"
          >
            <X className="w-6 h-6" />
          </Button>
          <div className="flex-1 min-w-0">
            <h1 
              id="language-selection-title" 
              className="text-xl sm:text-2xl font-bold"
              style={{ fontFamily: 'Poppins, sans-serif' }}
            >
              {view === 'primary' ? 'Choose Your Language' : view === 'variants' ? 'Regional Variants' : 'Multi-Language Learning'}
            </h1>
            <p className="text-sm" style={{ color: colors.textSecondary }}>
              {view === 'primary' 
                ? 'Select your primary sign language' 
                : view === 'variants' 
                  ? 'Choose your preferred regional variant'
                  : 'Learn multiple sign languages'}
            </p>
          </div>
        </div>

        {/* View Tabs */}
        <div 
          className="flex gap-2"
          role="tablist"
          aria-label="Language selection views"
        >
          <button
            onClick={() => setView('primary')}
            className="flex-1 py-2 px-4 rounded-lg text-sm font-semibold transition-all"
            style={{
              background: view === 'primary' ? colors.iconBg : 'transparent',
              color: view === 'primary' ? colors.iconColor : colors.textSecondary,
              border: view === 'primary' ? `2px solid ${colors.iconColor}` : 'none',
            }}
            role="tab"
            aria-selected={view === 'primary'}
            aria-controls="primary-panel"
          >
            Primary
          </button>
          <button
            onClick={() => selectedLanguageData?.variants && setView('variants')}
            disabled={!selectedLanguageData?.variants}
            className="flex-1 py-2 px-4 rounded-lg text-sm font-semibold transition-all"
            style={{
              background: view === 'variants' ? colors.iconBg : 'transparent',
              color: view === 'variants' ? colors.iconColor : colors.textSecondary,
              border: view === 'variants' ? `2px solid ${colors.iconColor}` : 'none',
              opacity: !selectedLanguageData?.variants ? 0.5 : 1,
            }}
            role="tab"
            aria-selected={view === 'variants'}
            aria-controls="variants-panel"
          >
            Variants
          </button>
          <button
            onClick={() => setView('multi-language')}
            className="flex-1 py-2 px-4 rounded-lg text-sm font-semibold transition-all relative"
            style={{
              background: view === 'multi-language' ? colors.iconBg : 'transparent',
              color: view === 'multi-language' ? colors.iconColor : colors.textSecondary,
              border: view === 'multi-language' ? `2px solid ${colors.iconColor}` : 'none',
            }}
            role="tab"
            aria-selected={view === 'multi-language'}
            aria-controls="multi-language-panel"
          >
            Multi-Language
            {!userProgress.isPremium && (
              <Crown className="w-3 h-3 absolute -top-1 -right-1 text-yellow-500" aria-label="Premium feature" />
            )}
          </button>
        </div>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6">
        {/* Primary Language Selection */}
        {view === 'primary' && (
          <div id="primary-panel" role="tabpanel">
            {/* Current Selection Card */}
            {selectedLanguageData && (
              <motion.div
                className="rounded-xl p-4 mb-6"
                style={{
                  background: colors.iconBg,
                  border: `2px solid ${colors.iconColor}`,
                }}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <div className="flex items-center gap-2 mb-2">
                  <Check className="w-5 h-5" style={{ color: colors.iconColor }} aria-hidden="true" />
                  <span className="text-sm font-semibold" style={{ color: colors.textPrimary }}>
                    Current Selection
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <div 
                    className="text-3xl"
                    role="img"
                    aria-label={`${selectedLanguageData.name} flag`}
                  >
                    {selectedLanguageData.flag}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold" style={{ color: colors.textPrimary }}>
                      {selectedLanguageData.name}
                    </div>
                    <div className="text-sm" style={{ color: colors.textSecondary }}>
                      {selectedLanguageData.nativeName} • {selectedLanguageData.learners}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Info Card */}
            <motion.div
              className="rounded-xl p-4 mb-6"
              style={{
                background: colors.cardBg,
                backdropFilter: colors.blur,
                WebkitBackdropFilter: colors.blur,
                border: colors.glassBorder,
                boxShadow: colors.shadow,
              }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="flex items-start gap-3">
                <Info className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: colors.iconColor }} aria-hidden="true" />
                <div>
                  <div className="font-semibold mb-1 text-sm" style={{ color: colors.textPrimary }}>
                    About Sign Languages
                  </div>
                  <div className="text-xs" style={{ color: colors.textSecondary }}>
                    Each sign language is unique with its own grammar, vocabulary, and cultural context. Choose the one most relevant to your community or learning goals.
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Language List */}
            <div className="space-y-3">
              <h3 className="text-sm font-semibold mb-3" style={{ color: colors.textPrimary }}>
                Available Languages
              </h3>

              {signLanguages.map((language, index) => (
                <motion.button
                  key={language.id}
                  onClick={() => handleSelectLanguage(language.id, language.isPremium)}
                  className="w-full rounded-xl p-4 text-left transition-all"
                  style={{
                    background: selectedPrimary === language.id ? colors.cardHover : colors.cardBg,
                    backdropFilter: colors.blur,
                    WebkitBackdropFilter: colors.blur,
                    border: selectedPrimary === language.id 
                      ? `2px solid ${colors.iconColor}` 
                      : colors.glassBorder,
                    boxShadow: colors.shadow,
                  }}
                  onMouseEnter={(e) => {
                    if (selectedPrimary !== language.id) {
                      e.currentTarget.style.background = colors.cardHover;
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (selectedPrimary !== language.id) {
                      e.currentTarget.style.background = colors.cardBg;
                    }
                  }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  aria-label={`${language.name}, ${language.learners}, ${language.difficulty} difficulty${language.isPremium ? ', Premium' : ''}`}
                  aria-pressed={selectedPrimary === language.id}
                >
                  <div className="flex items-start gap-3">
                    <div 
                      className="text-3xl flex-shrink-0"
                      role="img"
                      aria-label={`${language.name} flag`}
                    >
                      {language.flag}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-semibold" style={{ color: colors.textPrimary }}>
                          {language.name}
                        </h4>
                        {language.isPremium && (
                          <Crown className="w-4 h-4 flex-shrink-0" style={{ color: colors.warningColor }} aria-label="Premium" />
                        )}
                      </div>
                      <div className="text-sm mb-2" style={{ color: colors.textSecondary }}>
                        {language.nativeName} • {language.learners}
                      </div>
                      <p className="text-xs mb-3" style={{ color: colors.textTertiary }}>
                        {language.description}
                      </p>
                      <div className="flex items-center gap-2">
                        <div 
                          className="px-2 py-1 rounded-full text-xs font-semibold capitalize"
                          style={{ 
                            background: `${getDifficultyColor(language.difficulty)}20`,
                            color: getDifficultyColor(language.difficulty),
                          }}
                        >
                          {language.difficulty}
                        </div>
                        {language.variants && language.variants.length > 0 && (
                          <div 
                            className="px-2 py-1 rounded-full text-xs"
                            style={{ 
                              background: colors.accentBg,
                              color: colors.textSecondary,
                            }}
                          >
                            {language.variants.length} variants
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex-shrink-0">
                      {selectedPrimary === language.id ? (
                        <div 
                          className="w-6 h-6 rounded-full flex items-center justify-center"
                          style={{ background: colors.iconColor }}
                          aria-hidden="true"
                        >
                          <Check className="w-4 h-4 text-white" />
                        </div>
                      ) : (
                        <ChevronRight className="w-6 h-6" style={{ color: colors.textTertiary }} aria-hidden="true" />
                      )}
                    </div>
                  </div>
                </motion.button>
              ))}
            </div>
          </div>
        )}

        {/* Regional Variants */}
        {view === 'variants' && selectedLanguageData?.variants && (
          <div id="variants-panel" role="tabpanel">
            {/* Language Info */}
            <motion.div
              className="rounded-xl p-4 mb-6"
              style={{
                background: colors.cardBg,
                backdropFilter: colors.blur,
                WebkitBackdropFilter: colors.blur,
                border: colors.glassBorder,
                boxShadow: colors.shadow,
              }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="flex items-center gap-3 mb-3">
                <div 
                  className="text-3xl"
                  role="img"
                  aria-label={`${selectedLanguageData.name} flag`}
                >
                  {selectedLanguageData.flag}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-semibold" style={{ color: colors.textPrimary }}>
                    {selectedLanguageData.name}
                  </div>
                  <div className="text-sm" style={{ color: colors.textSecondary }}>
                    {selectedLanguageData.nativeName}
                  </div>
                </div>
              </div>
              <p className="text-sm" style={{ color: colors.textSecondary }}>
                {selectedLanguageData.description}
              </p>
            </motion.div>

            {/* Info about variants */}
            <motion.div
              className="rounded-xl p-4 mb-6"
              style={{
                background: colors.iconBg,
                border: colors.glassBorder,
              }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <div className="flex items-start gap-3">
                <Globe className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: colors.iconColor }} aria-hidden="true" />
                <div>
                  <div className="font-semibold mb-1 text-sm" style={{ color: colors.textPrimary }}>
                    Regional Differences
                  </div>
                  <div className="text-xs" style={{ color: colors.textSecondary }}>
                    Sign languages can vary by region with different vocabulary, idioms, and cultural expressions. Choose the variant that matches your community.
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Variants List */}
            <div className="space-y-3">
              <h3 className="text-sm font-semibold mb-3" style={{ color: colors.textPrimary }}>
                Choose Regional Variant
              </h3>

              {selectedLanguageData.variants.map((variant, index) => (
                <motion.button
                  key={variant.id}
                  onClick={() => handleSelectVariant(variant.id, variant.isPremium)}
                  className="w-full rounded-xl p-4 text-left transition-all"
                  style={{
                    background: selectedVariant === variant.id ? colors.cardHover : colors.cardBg,
                    backdropFilter: colors.blur,
                    WebkitBackdropFilter: colors.blur,
                    border: selectedVariant === variant.id 
                      ? `2px solid ${colors.iconColor}` 
                      : colors.glassBorder,
                    boxShadow: colors.shadow,
                  }}
                  onMouseEnter={(e) => {
                    if (selectedVariant !== variant.id) {
                      e.currentTarget.style.background = colors.cardHover;
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (selectedVariant !== variant.id) {
                      e.currentTarget.style.background = colors.cardBg;
                    }
                  }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 + index * 0.1 }}
                  aria-label={`${variant.name}, ${variant.region}${variant.isPremium ? ', Premium' : ''}`}
                  aria-pressed={selectedVariant === variant.id}
                >
                  <div className="flex items-center gap-3">
                    <div 
                      className="w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0"
                      style={{ background: colors.iconBg }}
                      aria-hidden="true"
                    >
                      <Globe className="w-6 h-6" style={{ color: colors.iconColor }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <div className="font-semibold" style={{ color: colors.textPrimary }}>
                          {variant.name}
                        </div>
                        {variant.isPremium && (
                          <Crown className="w-4 h-4 flex-shrink-0" style={{ color: colors.warningColor }} aria-label="Premium" />
                        )}
                      </div>
                      <div className="text-sm" style={{ color: colors.textSecondary }}>
                        {variant.region}
                      </div>
                    </div>
                    <div className="flex-shrink-0">
                      {selectedVariant === variant.id ? (
                        <div 
                          className="w-6 h-6 rounded-full flex items-center justify-center"
                          style={{ background: colors.iconColor }}
                          aria-hidden="true"
                        >
                          <Check className="w-4 h-4 text-white" />
                        </div>
                      ) : (
                        <div 
                          className="w-6 h-6 rounded-full border-2"
                          style={{ borderColor: colors.border }}
                          aria-hidden="true"
                        />
                      )}
                    </div>
                  </div>
                </motion.button>
              ))}
            </div>
          </div>
        )}

        {/* Multi-Language Learning */}
        {view === 'multi-language' && (
          <div id="multi-language-panel" role="tabpanel">
            {/* Premium Info */}
            {!userProgress.isPremium && (
              <motion.div
                className="rounded-xl p-6 mb-6 relative overflow-hidden"
                style={{ background: colors.premiumGradient }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <div 
                  className="absolute top-0 right-0 opacity-20"
                  aria-hidden="true"
                >
                  <Crown className="w-32 h-32 -mt-6 -mr-6 text-white" />
                </div>
                <div className="relative z-10">
                  <div className="flex items-center gap-2 mb-3">
                    <Crown className="w-6 h-6 text-white" aria-hidden="true" />
                    <span className="text-sm font-semibold text-white uppercase tracking-wide">
                      Premium Feature
                    </span>
                  </div>
                  <h3 className="text-xl font-bold mb-2 text-white">
                    Learn Multiple Sign Languages
                  </h3>
                  <p className="text-sm mb-4 text-white opacity-90">
                    Expand your skills by learning multiple sign languages simultaneously with Premium.
                  </p>
                  <ul className="space-y-2 mb-4" role="list">
                    <li className="flex items-center gap-2 text-sm text-white">
                      <Check className="w-4 h-4 flex-shrink-0" aria-hidden="true" />
                      <span>Learn up to 5 languages at once</span>
                    </li>
                    <li className="flex items-center gap-2 text-sm text-white">
                      <Check className="w-4 h-4 flex-shrink-0" aria-hidden="true" />
                      <span>Compare signs across languages</span>
                    </li>
                    <li className="flex items-center gap-2 text-sm text-white">
                      <Check className="w-4 h-4 flex-shrink-0" aria-hidden="true" />
                      <span>Track progress for each language</span>
                    </li>
                  </ul>
                  <Button
                    onClick={() => setShowUpgradePrompt(true)}
                    className="w-full h-12 rounded-full font-semibold bg-white hover:bg-gray-100"
                    style={{ color: '#F59E0B' }}
                    aria-label="Upgrade to premium"
                  >
                    Upgrade to Premium
                  </Button>
                </div>
              </motion.div>
            )}

            {/* Info Card */}
            <motion.div
              className="rounded-xl p-4 mb-6"
              style={{
                background: colors.cardBg,
                backdropFilter: colors.blur,
                WebkitBackdropFilter: colors.blur,
                border: colors.glassBorder,
                boxShadow: colors.shadow,
              }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <div className="flex items-start gap-3">
                <Star className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: colors.iconColor }} aria-hidden="true" />
                <div>
                  <div className="font-semibold mb-1 text-sm" style={{ color: colors.textPrimary }}>
                    Multi-Language Learning
                  </div>
                  <div className="text-xs" style={{ color: colors.textSecondary }}>
                    Learning multiple sign languages helps you communicate with diverse Deaf communities and deepens your understanding of visual language.
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Additional Languages */}
            <div className="space-y-3">
              <h3 className="text-sm font-semibold mb-3" style={{ color: colors.textPrimary }}>
                Additional Languages
              </h3>

              {signLanguages
                .filter(lang => lang.id !== selectedPrimary)
                .map((language, index) => {
                  const isSelected = additionalLanguages.includes(language.id);
                  const isLocked = !userProgress.isPremium;

                  return (
                    <motion.button
                      key={language.id}
                      onClick={() => handleToggleAdditionalLanguage(language.id, true)}
                      disabled={isLocked}
                      className="w-full rounded-xl p-4 text-left transition-all"
                      style={{
                        background: isSelected ? colors.cardHover : colors.cardBg,
                        backdropFilter: colors.blur,
                        WebkitBackdropFilter: colors.blur,
                        border: isSelected 
                          ? `2px solid ${colors.iconColor}` 
                          : colors.glassBorder,
                        boxShadow: colors.shadow,
                        opacity: isLocked ? 0.7 : 1,
                      }}
                      onMouseEnter={(e) => {
                        if (!isSelected && !isLocked) {
                          e.currentTarget.style.background = colors.cardHover;
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (!isSelected) {
                          e.currentTarget.style.background = colors.cardBg;
                        }
                      }}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 + index * 0.05 }}
                      aria-label={`${language.name}, ${language.learners}${isLocked ? ', Locked - Premium required' : isSelected ? ', Selected' : ', Not selected'}`}
                      aria-pressed={isSelected}
                      aria-disabled={isLocked}
                    >
                      <div className="flex items-start gap-3">
                        <div 
                          className="text-3xl flex-shrink-0"
                          role="img"
                          aria-label={`${language.name} flag`}
                        >
                          {language.flag}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-semibold" style={{ color: colors.textPrimary }}>
                              {language.name}
                            </h4>
                            {isLocked && (
                              <Lock className="w-4 h-4 flex-shrink-0" style={{ color: colors.textTertiary }} aria-hidden="true" />
                            )}
                          </div>
                          <div className="text-sm mb-2" style={{ color: colors.textSecondary }}>
                            {language.nativeName} • {language.learners}
                          </div>
                          <div 
                            className="px-2 py-1 rounded-full text-xs font-semibold capitalize inline-block"
                            style={{ 
                              background: `${getDifficultyColor(language.difficulty)}20`,
                              color: getDifficultyColor(language.difficulty),
                            }}
                          >
                            {language.difficulty}
                          </div>
                        </div>
                        <div className="flex-shrink-0">
                          {isLocked ? (
                            <div 
                              className="w-6 h-6 rounded-full border-2 flex items-center justify-center"
                              style={{ borderColor: colors.border }}
                              aria-hidden="true"
                            >
                              <Lock className="w-3 h-3" style={{ color: colors.textTertiary }} />
                            </div>
                          ) : isSelected ? (
                            <div 
                              className="w-6 h-6 rounded-full flex items-center justify-center"
                              style={{ background: colors.iconColor }}
                              aria-hidden="true"
                            >
                              <Check className="w-4 h-4 text-white" />
                            </div>
                          ) : (
                            <div 
                              className="w-6 h-6 rounded-full border-2"
                              style={{ borderColor: colors.border }}
                              aria-hidden="true"
                            />
                          )}
                        </div>
                      </div>
                    </motion.button>
                  );
                })}
            </div>

            {/* Selected Count */}
            {additionalLanguages.length > 0 && (
              <motion.div
                className="rounded-xl p-4 mt-6"
                style={{
                  background: colors.successBg,
                  border: colors.glassBorder,
                }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <div className="flex items-center gap-3">
                  <Check className="w-5 h-5" style={{ color: colors.successColor }} aria-hidden="true" />
                  <div>
                    <div className="font-semibold text-sm" style={{ color: colors.textPrimary }}>
                      {additionalLanguages.length} Additional {additionalLanguages.length === 1 ? 'Language' : 'Languages'} Selected
                    </div>
                    <div className="text-xs" style={{ color: colors.textSecondary }}>
                      You can switch between languages anytime
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        )}
      </div>

      {/* Bottom Actions */}
      <div 
        className="p-4 sm:p-6 border-t"
        style={{ borderTopColor: colors.border }}
      >
        {mode === 'onboarding' ? (
          <Button
            onClick={handleSaveChanges}
            className="w-full h-12 rounded-full font-semibold"
            style={{
              background: colors.iconColor,
              color: theme === 'dark' ? '#0F0F23' : '#FFFFFF',
            }}
            aria-label="Continue with selected language"
          >
            Continue
          </Button>
        ) : (
          <div className="space-y-3">
            <Button
              onClick={handleSaveChanges}
              className="w-full h-12 rounded-full font-semibold"
              style={{
                background: colors.iconColor,
                color: theme === 'dark' ? '#0F0F23' : '#FFFFFF',
              }}
              aria-label="Save language changes"
            >
              Save Changes
            </Button>
            <Button
              onClick={onExit}
              variant="ghost"
              className="w-full h-10 rounded-full"
              style={{ color: colors.textSecondary }}
              aria-label="Cancel and go back"
            >
              Cancel
            </Button>
          </div>
        )}
      </div>

      {/* Upgrade Prompt Modal */}
      <AnimatePresence>
        {showUpgradePrompt && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{ background: 'rgba(0, 0, 0, 0.8)' }}
            onClick={() => setShowUpgradePrompt(false)}
            role="dialog"
            aria-labelledby="upgrade-modal-title"
            aria-modal="true"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="w-full max-w-md rounded-2xl overflow-hidden"
              style={{ background: colors.cardBg }}
              onClick={(e) => e.stopPropagation()}
            >
              <div 
                className="p-6 relative overflow-hidden"
                style={{ background: colors.premiumGradient }}
              >
                <div 
                  className="absolute top-0 right-0 opacity-20"
                  aria-hidden="true"
                >
                  <Crown className="w-32 h-32 -mt-6 -mr-6 text-white" />
                </div>
                <div className="relative z-10">
                  <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center mx-auto mb-4" aria-hidden="true">
                    <Crown className="w-8 h-8 text-white" />
                  </div>
                  <h3 id="upgrade-modal-title" className="text-2xl font-bold mb-2 text-center text-white">
                    Premium Required
                  </h3>
                  <p className="text-sm text-center text-white opacity-90">
                    Unlock all sign languages and premium features
                  </p>
                </div>
              </div>

              <div className="p-6">
                <ul className="space-y-3 mb-6" role="list">
                  <li className="flex items-center gap-3">
                    <div 
                      className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
                      style={{ background: colors.successBg }}
                      aria-hidden="true"
                    >
                      <Check className="w-4 h-4" style={{ color: colors.successColor }} />
                    </div>
                    <span className="text-sm" style={{ color: colors.textPrimary }}>
                      Access all sign languages (BSL, ISL, LSF, and more)
                    </span>
                  </li>
                  <li className="flex items-center gap-3">
                    <div 
                      className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
                      style={{ background: colors.successBg }}
                      aria-hidden="true"
                    >
                      <Check className="w-4 h-4" style={{ color: colors.successColor }} />
                    </div>
                    <span className="text-sm" style={{ color: colors.textPrimary }}>
                      Learn multiple languages simultaneously
                    </span>
                  </li>
                  <li className="flex items-center gap-3">
                    <div 
                      className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
                      style={{ background: colors.successBg }}
                      aria-hidden="true"
                    >
                      <Check className="w-4 h-4" style={{ color: colors.successColor }} />
                    </div>
                    <span className="text-sm" style={{ color: colors.textPrimary }}>
                      Regional variant options
                    </span>
                  </li>
                  <li className="flex items-center gap-3">
                    <div 
                      className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
                      style={{ background: colors.successBg }}
                      aria-hidden="true"
                    >
                      <Check className="w-4 h-4" style={{ color: colors.successColor }} />
                    </div>
                    <span className="text-sm" style={{ color: colors.textPrimary }}>
                      Advanced AR hand tracking
                    </span>
                  </li>
                </ul>

                <div className="space-y-3">
                  <Button
                    onClick={() => {
                      setShowUpgradePrompt(false);
                      // Navigate to upgrade screen
                    }}
                    className="w-full h-12 rounded-full font-semibold"
                    style={{
                      background: colors.iconColor,
                      color: theme === 'dark' ? '#0F0F23' : '#FFFFFF',
                    }}
                    aria-label="Start 7-day free trial"
                  >
                    Start 7-Day Free Trial
                  </Button>
                  <Button
                    onClick={() => setShowUpgradePrompt(false)}
                    variant="ghost"
                    className="w-full h-10"
                    style={{ color: colors.textSecondary }}
                    aria-label="Maybe later"
                  >
                    Maybe Later
                  </Button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
