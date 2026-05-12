import { useState } from 'react';
import { Button } from './ui/button';
import { useTheme } from '../context/ThemeContext';
import { useApp } from '../context/AppContext';
import exampleImage from 'figma:asset/1c44e17e5295e22a67c52d51b76f6b18b41e1529.png';
import { 
  X, 
  Save,
  RotateCcw,
  User,
  Eye,
  Move,
  Gauge,
  Repeat,
  ChevronDown,
  ChevronRight,
  Info,
  Palette,
  Maximize2,
  Zap,
  Target,
  Volume2,
  Hand,
  MessageSquare,
  Settings,
  Check,
  Play,
  Pause,
  Monitor,
  Smartphone,
  Sun,
  Moon,
} from 'lucide-react';

interface AvatarInstructorSettingsProps {
  onExit: () => void;
}

interface AvatarSettings {
  // Appearance
  skinTone: string;
  gender: string;
  clothing: string;
  clothingColor: string;
  hairStyle: string;
  hairColor: string;
  
  // Placement & Positioning
  placementMode: string;
  horizontalPosition: number;
  verticalPosition: number;
  depth: number;
  scale: number;
  rotation: number;
  
  // Viewing Angle
  cameraAngle: string;
  viewDistance: string;
  height: number;
  tilt: number;
  
  // Animation Speed
  demoSpeed: number;
  transitionSpeed: number;
  handSpeed: number;
  
  // Demonstration Options
  autoRepeat: boolean;
  repeatCount: number;
  pauseBetweenRepeats: number;
  showMirrorView: boolean;
  highlightActiveHand: boolean;
  showHandPath: boolean;
  slowMotionKey: boolean;
  
  // Feedback Options
  voiceGuidance: boolean;
  voiceGender: string;
  hapticFeedback: boolean;
  visualCues: boolean;
  correctionLevel: string;
  
  // Display Options
  showSubtitles: boolean;
  showHandLabels: boolean;
  showGridLines: boolean;
  backgroundColor: string;
  avatarOpacity: number;
  
  // Accessibility
  highContrast: boolean;
  reducedMotion: boolean;
  audioDescriptions: boolean;
  signSize: string;
}

export function AvatarInstructorSettings({ onExit }: AvatarInstructorSettingsProps) {
  const { theme } = useTheme();
  const { userProgress } = useApp();
  
  const [settings, setSettings] = useState<AvatarSettings>({
    // Appearance
    skinTone: 'medium',
    gender: 'neutral',
    clothing: 'casual',
    clothingColor: 'blue',
    hairStyle: 'short',
    hairColor: 'brown',
    
    // Placement & Positioning
    placementMode: 'auto',
    horizontalPosition: 50,
    verticalPosition: 40,
    depth: 2.5,
    scale: 1.0,
    rotation: 0,
    
    // Viewing Angle
    cameraAngle: 'front',
    viewDistance: 'medium',
    height: 1.65,
    tilt: 0,
    
    // Animation Speed
    demoSpeed: 1.0,
    transitionSpeed: 1.0,
    handSpeed: 1.0,
    
    // Demonstration Options
    autoRepeat: true,
    repeatCount: 3,
    pauseBetweenRepeats: 2,
    showMirrorView: false,
    highlightActiveHand: true,
    showHandPath: false,
    slowMotionKey: true,
    
    // Feedback Options
    voiceGuidance: true,
    voiceGender: 'female',
    hapticFeedback: true,
    visualCues: true,
    correctionLevel: 'medium',
    
    // Display Options
    showSubtitles: true,
    showHandLabels: false,
    showGridLines: false,
    backgroundColor: 'gradient',
    avatarOpacity: 100,
    
    // Accessibility
    highContrast: false,
    reducedMotion: false,
    audioDescriptions: false,
    signSize: 'medium',
  });

  const [expandedSections, setExpandedSections] = useState<string[]>([
    'appearance',
    'placement',
    'animation',
    'demonstration',
  ]);
  
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [showSaveConfirmation, setShowSaveConfirmation] = useState(false);

  const updateSetting = <K extends keyof AvatarSettings>(
    key: K,
    value: AvatarSettings[K]
  ) => {
    setSettings(prev => ({ ...prev, [key]: value }));
    setHasUnsavedChanges(true);
  };

  const toggleSection = (section: string) => {
    setExpandedSections(prev => 
      prev.includes(section)
        ? prev.filter(s => s !== section)
        : [...prev, section]
    );
  };

  const handleSave = () => {
    // Simulate save
    setHasUnsavedChanges(false);
    setShowSaveConfirmation(true);
    setTimeout(() => setShowSaveConfirmation(false), 3000);
  };

  const handleReset = () => {
    if (confirm('Reset all settings to default values?')) {
      setSettings({
        skinTone: 'medium',
        gender: 'neutral',
        clothing: 'casual',
        clothingColor: 'blue',
        hairStyle: 'short',
        hairColor: 'brown',
        placementMode: 'auto',
        horizontalPosition: 50,
        verticalPosition: 40,
        depth: 2.5,
        scale: 1.0,
        rotation: 0,
        cameraAngle: 'front',
        viewDistance: 'medium',
        height: 1.65,
        tilt: 0,
        demoSpeed: 1.0,
        transitionSpeed: 1.0,
        handSpeed: 1.0,
        autoRepeat: true,
        repeatCount: 3,
        pauseBetweenRepeats: 2,
        showMirrorView: false,
        highlightActiveHand: true,
        showHandPath: false,
        slowMotionKey: true,
        voiceGuidance: true,
        voiceGender: 'female',
        hapticFeedback: true,
        visualCues: true,
        correctionLevel: 'medium',
        showSubtitles: true,
        showHandLabels: false,
        showGridLines: false,
        backgroundColor: 'gradient',
        avatarOpacity: 100,
        highContrast: false,
        reducedMotion: false,
        audioDescriptions: false,
        signSize: 'medium',
      });
      setHasUnsavedChanges(true);
    }
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

  const skinTones = [
    { id: 'light', name: 'Light', color: '#FFDFC4' },
    { id: 'medium-light', name: 'Medium Light', color: '#F0C1A0' },
    { id: 'medium', name: 'Medium', color: '#D2A679' },
    { id: 'medium-dark', name: 'Medium Dark', color: '#A67F5D' },
    { id: 'dark', name: 'Dark', color: '#6B4E3D' },
    { id: 'deep', name: 'Deep', color: '#4A3428' },
  ];

  const clothingColors = [
    { id: 'white', name: 'White', color: '#FFFFFF' },
    { id: 'black', name: 'Black', color: '#000000' },
    { id: 'blue', name: 'Blue', color: '#3B82F6' },
    { id: 'red', name: 'Red', color: '#EF4444' },
    { id: 'green', name: 'Green', color: '#22C55E' },
    { id: 'purple', name: 'Purple', color: '#A855F7' },
    { id: 'yellow', name: 'Yellow', color: '#FBD500' },
    { id: 'gray', name: 'Gray', color: '#6B7280' },
  ];

  const hairColors = [
    { id: 'black', name: 'Black', color: '#000000' },
    { id: 'brown', name: 'Brown', color: '#4A3428' },
    { id: 'blonde', name: 'Blonde', color: '#F0DC82' },
    { id: 'red', name: 'Red', color: '#C84C3C' },
    { id: 'gray', name: 'Gray', color: '#94A3B8' },
    { id: 'white', name: 'White', color: '#FFFFFF' },
  ];

  return (
    <div 
      className="h-full flex flex-col"
      style={{ background: colors.bg, color: colors.textPrimary }}
      role="main"
      aria-labelledby="settings-title"
    >
      {/* Header */}
      <div 
        className="p-4 sm:p-6 border-b"
        style={{ borderBottomColor: colors.border }}
      >
        <div className="flex items-center gap-2 sm:gap-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={onExit}
            style={{ color: colors.textSecondary }}
            aria-label="Exit avatar settings"
            className="flex-shrink-0"
          >
            <X className="w-6 h-6" />
          </Button>
          <div className="flex-1 min-w-0">
            <h1 
              id="settings-title" 
              className="text-xl sm:text-2xl font-bold truncate"
              style={{ fontFamily: 'Poppins, sans-serif' }}
            >
              Avatar Instructor Settings
            </h1>
            <p className="text-sm truncate" style={{ color: colors.textSecondary }}>
              Customize your AR learning experience
            </p>
          </div>
        </div>
      </div>

      {/* Save Confirmation Toast */}
      {showSaveConfirmation && (
        <div 
          className="fixed top-20 left-1/2 -translate-x-1/2 z-50 px-4 py-3 rounded-xl flex items-center gap-3 shadow-lg"
          style={{
            background: colors.successBg,
            border: `2px solid ${colors.successColor}`,
          }}
          role="status"
          aria-live="polite"
        >
          <Check className="w-5 h-5" style={{ color: colors.successColor }} />
          <span className="font-semibold" style={{ color: colors.successColor }}>
            Settings saved successfully!
          </span>
        </div>
      )}

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6">
        <div className="max-w-2xl mx-auto space-y-4">
          
          {/* Avatar Preview */}
          <section 
            aria-labelledby="preview-heading"
            className="rounded-2xl overflow-hidden"
            style={{
              background: colors.cardBg,
              backdropFilter: colors.blur,
              WebkitBackdropFilter: colors.blur,
              border: colors.glassBorder,
              boxShadow: colors.shadow,
            }}
          >
            <div className="aspect-video relative">
              <img 
                src={exampleImage} 
                alt="Avatar instructor preview showing customization options"
                className="w-full h-full object-cover"
              />
              <div 
                className="absolute top-4 right-4 px-3 py-2 rounded-lg flex items-center gap-2"
                style={{
                  background: 'rgba(0, 0, 0, 0.7)',
                  backdropFilter: 'blur(10px)',
                }}
              >
                <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" aria-hidden="true" />
                <span className="text-xs font-semibold text-white">Live Preview</span>
              </div>
            </div>
            <div className="p-4 border-t" style={{ borderColor: colors.border }}>
              <p className="text-sm text-center" style={{ color: colors.textSecondary }}>
                Changes appear in real-time during AR sessions
              </p>
            </div>
          </section>

          {/* APPEARANCE SECTION */}
          <section 
            aria-labelledby="appearance-heading"
            className="rounded-2xl overflow-hidden"
            style={{
              background: colors.cardBg,
              backdropFilter: colors.blur,
              WebkitBackdropFilter: colors.blur,
              border: colors.glassBorder,
              boxShadow: colors.shadow,
            }}
          >
            <button
              onClick={() => toggleSection('appearance')}
              className="w-full p-4 flex items-center justify-between"
              aria-expanded={expandedSections.includes('appearance')}
              aria-controls="appearance-content"
            >
              <div className="flex items-center gap-3">
                <div 
                  className="w-10 h-10 rounded-lg flex items-center justify-center"
                  style={{ background: colors.accentBg }}
                  aria-hidden="true"
                >
                  <Palette className="w-5 h-5" style={{ color: colors.accentColor }} />
                </div>
                <div className="text-left">
                  <h2 id="appearance-heading" className="font-semibold" style={{ color: colors.textPrimary }}>
                    Avatar Appearance
                  </h2>
                  <p className="text-xs" style={{ color: colors.textSecondary }}>
                    Customize physical characteristics
                  </p>
                </div>
              </div>
              {expandedSections.includes('appearance') ? (
                <ChevronDown className="w-5 h-5" style={{ color: colors.textTertiary }} />
              ) : (
                <ChevronRight className="w-5 h-5" style={{ color: colors.textTertiary }} />
              )}
            </button>

            {expandedSections.includes('appearance') && (
              <div id="appearance-content" className="px-4 pb-4 space-y-4">
                {/* Skin Tone */}
                <div>
                  <label className="text-sm font-semibold mb-3 block" style={{ color: colors.textPrimary }}>
                    Skin Tone
                  </label>
                  <div className="grid grid-cols-6 gap-2">
                    {skinTones.map((tone) => (
                      <button
                        key={tone.id}
                        onClick={() => updateSetting('skinTone', tone.id)}
                        className="aspect-square rounded-lg border-2 transition-all"
                        style={{
                          background: tone.color,
                          borderColor: settings.skinTone === tone.id ? colors.iconColor : 'transparent',
                          boxShadow: settings.skinTone === tone.id ? `0 0 0 2px ${colors.iconColor}40` : 'none',
                        }}
                        aria-label={`Select ${tone.name} skin tone`}
                        aria-pressed={settings.skinTone === tone.id}
                      >
                        {settings.skinTone === tone.id && (
                          <Check className="w-4 h-4 mx-auto text-white drop-shadow-lg" />
                        )}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Gender */}
                <div>
                  <label className="text-sm font-semibold mb-3 block" style={{ color: colors.textPrimary }}>
                    Gender Presentation
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {['masculine', 'feminine', 'neutral'].map((gender) => (
                      <button
                        key={gender}
                        onClick={() => updateSetting('gender', gender)}
                        className="px-4 py-3 rounded-xl font-semibold text-sm transition-all capitalize"
                        style={{
                          background: settings.gender === gender ? colors.iconBg : colors.cardHover,
                          color: settings.gender === gender ? colors.iconColor : colors.textPrimary,
                          border: settings.gender === gender ? `2px solid ${colors.iconColor}` : '1px solid transparent',
                        }}
                        aria-label={`Select ${gender} gender presentation`}
                        aria-pressed={settings.gender === gender}
                      >
                        {gender}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Clothing Style */}
                <div>
                  <label className="text-sm font-semibold mb-3 block" style={{ color: colors.textPrimary }}>
                    Clothing Style
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {['casual', 'formal', 'sporty'].map((style) => (
                      <button
                        key={style}
                        onClick={() => updateSetting('clothing', style)}
                        className="px-4 py-3 rounded-xl font-semibold text-sm transition-all capitalize"
                        style={{
                          background: settings.clothing === style ? colors.accentBg : colors.cardHover,
                          color: settings.clothing === style ? colors.accentColor : colors.textPrimary,
                          border: settings.clothing === style ? `2px solid ${colors.accentColor}` : '1px solid transparent',
                        }}
                        aria-label={`Select ${style} clothing style`}
                        aria-pressed={settings.clothing === style}
                      >
                        {style}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Clothing Color */}
                <div>
                  <label className="text-sm font-semibold mb-3 block" style={{ color: colors.textPrimary }}>
                    Clothing Color
                  </label>
                  <div className="grid grid-cols-8 gap-2">
                    {clothingColors.map((color) => (
                      <button
                        key={color.id}
                        onClick={() => updateSetting('clothingColor', color.id)}
                        className="aspect-square rounded-lg border-2 transition-all"
                        style={{
                          background: color.color,
                          borderColor: settings.clothingColor === color.id ? colors.iconColor : colors.border,
                          boxShadow: settings.clothingColor === color.id ? `0 0 0 2px ${colors.iconColor}40` : 'none',
                        }}
                        aria-label={`Select ${color.name} clothing color`}
                        aria-pressed={settings.clothingColor === color.id}
                      >
                        {settings.clothingColor === color.id && (
                          <Check className="w-4 h-4 mx-auto" style={{ 
                            color: color.id === 'white' || color.id === 'yellow' ? '#000' : '#fff',
                            filter: 'drop-shadow(0 0 2px rgba(0,0,0,0.5))',
                          }} />
                        )}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Hair Style */}
                <div>
                  <label className="text-sm font-semibold mb-3 block" style={{ color: colors.textPrimary }}>
                    Hair Style
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {['short', 'long', 'curly', 'bald'].map((style) => (
                      <button
                        key={style}
                        onClick={() => updateSetting('hairStyle', style)}
                        className="px-4 py-3 rounded-xl font-semibold text-sm transition-all capitalize"
                        style={{
                          background: settings.hairStyle === style ? colors.successBg : colors.cardHover,
                          color: settings.hairStyle === style ? colors.successColor : colors.textPrimary,
                          border: settings.hairStyle === style ? `2px solid ${colors.successColor}` : '1px solid transparent',
                        }}
                        aria-label={`Select ${style} hair style`}
                        aria-pressed={settings.hairStyle === style}
                      >
                        {style}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Hair Color */}
                <div>
                  <label className="text-sm font-semibold mb-3 block" style={{ color: colors.textPrimary }}>
                    Hair Color
                  </label>
                  <div className="grid grid-cols-6 gap-2">
                    {hairColors.map((color) => (
                      <button
                        key={color.id}
                        onClick={() => updateSetting('hairColor', color.id)}
                        className="aspect-square rounded-lg border-2 transition-all"
                        style={{
                          background: color.color,
                          borderColor: settings.hairColor === color.id ? colors.iconColor : colors.border,
                          boxShadow: settings.hairColor === color.id ? `0 0 0 2px ${colors.iconColor}40` : 'none',
                        }}
                        aria-label={`Select ${color.name} hair color`}
                        aria-pressed={settings.hairColor === color.id}
                      >
                        {settings.hairColor === color.id && (
                          <Check className="w-4 h-4 mx-auto" style={{ 
                            color: color.id === 'white' || color.id === 'blonde' ? '#000' : '#fff',
                            filter: 'drop-shadow(0 0 2px rgba(0,0,0,0.5))',
                          }} />
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </section>

          {/* PLACEMENT & POSITIONING SECTION */}
          <section 
            aria-labelledby="placement-heading"
            className="rounded-2xl overflow-hidden"
            style={{
              background: colors.cardBg,
              backdropFilter: colors.blur,
              WebkitBackdropFilter: colors.blur,
              border: colors.glassBorder,
              boxShadow: colors.shadow,
            }}
          >
            <button
              onClick={() => toggleSection('placement')}
              className="w-full p-4 flex items-center justify-between"
              aria-expanded={expandedSections.includes('placement')}
              aria-controls="placement-content"
            >
              <div className="flex items-center gap-3">
                <div 
                  className="w-10 h-10 rounded-lg flex items-center justify-center"
                  style={{ background: colors.iconBg }}
                  aria-hidden="true"
                >
                  <Move className="w-5 h-5" style={{ color: colors.iconColor }} />
                </div>
                <div className="text-left">
                  <h2 id="placement-heading" className="font-semibold" style={{ color: colors.textPrimary }}>
                    Placement & Positioning
                  </h2>
                  <p className="text-xs" style={{ color: colors.textSecondary }}>
                    Adjust avatar location and size
                  </p>
                </div>
              </div>
              {expandedSections.includes('placement') ? (
                <ChevronDown className="w-5 h-5" style={{ color: colors.textTertiary }} />
              ) : (
                <ChevronRight className="w-5 h-5" style={{ color: colors.textTertiary }} />
              )}
            </button>

            {expandedSections.includes('placement') && (
              <div id="placement-content" className="px-4 pb-4 space-y-4">
                {/* Placement Mode */}
                <div>
                  <label className="text-sm font-semibold mb-3 block" style={{ color: colors.textPrimary }}>
                    Placement Mode
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {['auto', 'manual', 'saved'].map((mode) => (
                      <button
                        key={mode}
                        onClick={() => updateSetting('placementMode', mode)}
                        className="px-4 py-3 rounded-xl font-semibold text-sm transition-all capitalize"
                        style={{
                          background: settings.placementMode === mode ? colors.iconBg : colors.cardHover,
                          color: settings.placementMode === mode ? colors.iconColor : colors.textPrimary,
                          border: settings.placementMode === mode ? `2px solid ${colors.iconColor}` : '1px solid transparent',
                        }}
                        aria-label={`Select ${mode} placement mode`}
                        aria-pressed={settings.placementMode === mode}
                      >
                        {mode}
                      </button>
                    ))}
                  </div>
                  <p className="text-xs mt-2" style={{ color: colors.textTertiary }}>
                    {settings.placementMode === 'auto' && 'Avatar positions automatically based on room'}
                    {settings.placementMode === 'manual' && 'Manually position avatar in AR space'}
                    {settings.placementMode === 'saved' && 'Use previously saved placement presets'}
                  </p>
                </div>

                {/* Horizontal Position */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <label htmlFor="horizontal-pos" className="text-sm font-semibold" style={{ color: colors.textPrimary }}>
                      Horizontal Position
                    </label>
                    <span className="text-sm font-bold" style={{ color: colors.iconColor }}>
                      {settings.horizontalPosition}%
                    </span>
                  </div>
                  <input
                    id="horizontal-pos"
                    type="range"
                    min="0"
                    max="100"
                    value={settings.horizontalPosition}
                    onChange={(e) => updateSetting('horizontalPosition', parseFloat(e.target.value))}
                    className="w-full h-2 rounded-full appearance-none cursor-pointer"
                    style={{
                      background: `linear-gradient(to right, ${colors.iconColor} 0%, ${colors.iconColor} ${settings.horizontalPosition}%, ${colors.border} ${settings.horizontalPosition}%, ${colors.border} 100%)`,
                    }}
                    aria-label="Horizontal position"
                    aria-valuemin={0}
                    aria-valuemax={100}
                    aria-valuenow={settings.horizontalPosition}
                  />
                  <div className="flex justify-between text-xs mt-1" style={{ color: colors.textTertiary }}>
                    <span>Left</span>
                    <span>Center</span>
                    <span>Right</span>
                  </div>
                </div>

                {/* Vertical Position */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <label htmlFor="vertical-pos" className="text-sm font-semibold" style={{ color: colors.textPrimary }}>
                      Vertical Position
                    </label>
                    <span className="text-sm font-bold" style={{ color: colors.iconColor }}>
                      {settings.verticalPosition}%
                    </span>
                  </div>
                  <input
                    id="vertical-pos"
                    type="range"
                    min="0"
                    max="100"
                    value={settings.verticalPosition}
                    onChange={(e) => updateSetting('verticalPosition', parseFloat(e.target.value))}
                    className="w-full h-2 rounded-full appearance-none cursor-pointer"
                    style={{
                      background: `linear-gradient(to right, ${colors.iconColor} 0%, ${colors.iconColor} ${settings.verticalPosition}%, ${colors.border} ${settings.verticalPosition}%, ${colors.border} 100%)`,
                    }}
                    aria-label="Vertical position"
                    aria-valuemin={0}
                    aria-valuemax={100}
                    aria-valuenow={settings.verticalPosition}
                  />
                  <div className="flex justify-between text-xs mt-1" style={{ color: colors.textTertiary }}>
                    <span>Bottom</span>
                    <span>Middle</span>
                    <span>Top</span>
                  </div>
                </div>

                {/* Depth (Distance) */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <label htmlFor="depth" className="text-sm font-semibold" style={{ color: colors.textPrimary }}>
                      Depth (Distance)
                    </label>
                    <span className="text-sm font-bold" style={{ color: colors.iconColor }}>
                      {settings.depth}m
                    </span>
                  </div>
                  <input
                    id="depth"
                    type="range"
                    min="1"
                    max="5"
                    step="0.5"
                    value={settings.depth}
                    onChange={(e) => updateSetting('depth', parseFloat(e.target.value))}
                    className="w-full h-2 rounded-full appearance-none cursor-pointer"
                    style={{
                      background: `linear-gradient(to right, ${colors.accentColor} 0%, ${colors.accentColor} ${((settings.depth - 1) / 4) * 100}%, ${colors.border} ${((settings.depth - 1) / 4) * 100}%, ${colors.border} 100%)`,
                    }}
                    aria-label="Depth distance from user"
                    aria-valuemin={1}
                    aria-valuemax={5}
                    aria-valuenow={settings.depth}
                    aria-valuetext={`${settings.depth} meters`}
                  />
                  <div className="flex justify-between text-xs mt-1" style={{ color: colors.textTertiary }}>
                    <span>Close (1m)</span>
                    <span>Far (5m)</span>
                  </div>
                </div>

                {/* Scale */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <label htmlFor="scale" className="text-sm font-semibold" style={{ color: colors.textPrimary }}>
                      Avatar Scale
                    </label>
                    <span className="text-sm font-bold" style={{ color: colors.iconColor }}>
                      {settings.scale}x
                    </span>
                  </div>
                  <input
                    id="scale"
                    type="range"
                    min="0.5"
                    max="2"
                    step="0.1"
                    value={settings.scale}
                    onChange={(e) => updateSetting('scale', parseFloat(e.target.value))}
                    className="w-full h-2 rounded-full appearance-none cursor-pointer"
                    style={{
                      background: `linear-gradient(to right, ${colors.successColor} 0%, ${colors.successColor} ${((settings.scale - 0.5) / 1.5) * 100}%, ${colors.border} ${((settings.scale - 0.5) / 1.5) * 100}%, ${colors.border} 100%)`,
                    }}
                    aria-label="Avatar scale multiplier"
                    aria-valuemin={0.5}
                    aria-valuemax={2}
                    aria-valuenow={settings.scale}
                    aria-valuetext={`${settings.scale} times normal size`}
                  />
                  <div className="flex justify-between text-xs mt-1" style={{ color: colors.textTertiary }}>
                    <span>50%</span>
                    <span>100%</span>
                    <span>200%</span>
                  </div>
                </div>

                {/* Rotation */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <label htmlFor="rotation" className="text-sm font-semibold" style={{ color: colors.textPrimary }}>
                      Rotation
                    </label>
                    <span className="text-sm font-bold" style={{ color: colors.iconColor }}>
                      {settings.rotation}°
                    </span>
                  </div>
                  <input
                    id="rotation"
                    type="range"
                    min="-180"
                    max="180"
                    step="15"
                    value={settings.rotation}
                    onChange={(e) => updateSetting('rotation', parseFloat(e.target.value))}
                    className="w-full h-2 rounded-full appearance-none cursor-pointer"
                    style={{
                      background: `linear-gradient(to right, ${colors.warningColor} 0%, ${colors.warningColor} ${((settings.rotation + 180) / 360) * 100}%, ${colors.border} ${((settings.rotation + 180) / 360) * 100}%, ${colors.border} 100%)`,
                    }}
                    aria-label="Avatar rotation angle"
                    aria-valuemin={-180}
                    aria-valuemax={180}
                    aria-valuenow={settings.rotation}
                    aria-valuetext={`${settings.rotation} degrees`}
                  />
                  <div className="flex justify-between text-xs mt-1" style={{ color: colors.textTertiary }}>
                    <span>-180°</span>
                    <span>0°</span>
                    <span>180°</span>
                  </div>
                </div>
              </div>
            )}
          </section>

          {/* VIEWING ANGLE SECTION */}
          <section 
            aria-labelledby="viewing-heading"
            className="rounded-2xl overflow-hidden"
            style={{
              background: colors.cardBg,
              backdropFilter: colors.blur,
              WebkitBackdropFilter: colors.blur,
              border: colors.glassBorder,
              boxShadow: colors.shadow,
            }}
          >
            <button
              onClick={() => toggleSection('viewing')}
              className="w-full p-4 flex items-center justify-between"
              aria-expanded={expandedSections.includes('viewing')}
              aria-controls="viewing-content"
            >
              <div className="flex items-center gap-3">
                <div 
                  className="w-10 h-10 rounded-lg flex items-center justify-center"
                  style={{ background: colors.successBg }}
                  aria-hidden="true"
                >
                  <Eye className="w-5 h-5" style={{ color: colors.successColor }} />
                </div>
                <div className="text-left">
                  <h2 id="viewing-heading" className="font-semibold" style={{ color: colors.textPrimary }}>
                    Viewing Angle Preferences
                  </h2>
                  <p className="text-xs" style={{ color: colors.textSecondary }}>
                    Control camera perspective
                  </p>
                </div>
              </div>
              {expandedSections.includes('viewing') ? (
                <ChevronDown className="w-5 h-5" style={{ color: colors.textTertiary }} />
              ) : (
                <ChevronRight className="w-5 h-5" style={{ color: colors.textTertiary }} />
              )}
            </button>

            {expandedSections.includes('viewing') && (
              <div id="viewing-content" className="px-4 pb-4 space-y-4">
                {/* Camera Angle */}
                <div>
                  <label className="text-sm font-semibold mb-3 block" style={{ color: colors.textPrimary }}>
                    Camera Angle
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { id: 'front', label: 'Front View' },
                      { id: 'side', label: 'Side View' },
                      { id: 'three-quarter', label: '3/4 View' },
                      { id: 'back', label: 'Back View' },
                    ].map((angle) => (
                      <button
                        key={angle.id}
                        onClick={() => updateSetting('cameraAngle', angle.id)}
                        className="px-4 py-3 rounded-xl font-semibold text-sm transition-all"
                        style={{
                          background: settings.cameraAngle === angle.id ? colors.successBg : colors.cardHover,
                          color: settings.cameraAngle === angle.id ? colors.successColor : colors.textPrimary,
                          border: settings.cameraAngle === angle.id ? `2px solid ${colors.successColor}` : '1px solid transparent',
                        }}
                        aria-label={`Select ${angle.label}`}
                        aria-pressed={settings.cameraAngle === angle.id}
                      >
                        {angle.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* View Distance */}
                <div>
                  <label className="text-sm font-semibold mb-3 block" style={{ color: colors.textPrimary }}>
                    View Distance
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {['close', 'medium', 'far'].map((distance) => (
                      <button
                        key={distance}
                        onClick={() => updateSetting('viewDistance', distance)}
                        className="px-4 py-3 rounded-xl font-semibold text-sm transition-all capitalize"
                        style={{
                          background: settings.viewDistance === distance ? colors.iconBg : colors.cardHover,
                          color: settings.viewDistance === distance ? colors.iconColor : colors.textPrimary,
                          border: settings.viewDistance === distance ? `2px solid ${colors.iconColor}` : '1px solid transparent',
                        }}
                        aria-label={`Select ${distance} view distance`}
                        aria-pressed={settings.viewDistance === distance}
                      >
                        {distance}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Eye Level Height */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <label htmlFor="height" className="text-sm font-semibold" style={{ color: colors.textPrimary }}>
                      Eye Level Height
                    </label>
                    <span className="text-sm font-bold" style={{ color: colors.iconColor }}>
                      {settings.height}m
                    </span>
                  </div>
                  <input
                    id="height"
                    type="range"
                    min="1.2"
                    max="2.0"
                    step="0.05"
                    value={settings.height}
                    onChange={(e) => updateSetting('height', parseFloat(e.target.value))}
                    className="w-full h-2 rounded-full appearance-none cursor-pointer"
                    style={{
                      background: `linear-gradient(to right, ${colors.successColor} 0%, ${colors.successColor} ${((settings.height - 1.2) / 0.8) * 100}%, ${colors.border} ${((settings.height - 1.2) / 0.8) * 100}%, ${colors.border} 100%)`,
                    }}
                    aria-label="Eye level height"
                    aria-valuemin={1.2}
                    aria-valuemax={2.0}
                    aria-valuenow={settings.height}
                    aria-valuetext={`${settings.height} meters`}
                  />
                  <div className="flex justify-between text-xs mt-1" style={{ color: colors.textTertiary }}>
                    <span>1.2m</span>
                    <span>2.0m</span>
                  </div>
                </div>

                {/* Camera Tilt */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <label htmlFor="tilt" className="text-sm font-semibold" style={{ color: colors.textPrimary }}>
                      Camera Tilt
                    </label>
                    <span className="text-sm font-bold" style={{ color: colors.iconColor }}>
                      {settings.tilt}°
                    </span>
                  </div>
                  <input
                    id="tilt"
                    type="range"
                    min="-30"
                    max="30"
                    step="5"
                    value={settings.tilt}
                    onChange={(e) => updateSetting('tilt', parseFloat(e.target.value))}
                    className="w-full h-2 rounded-full appearance-none cursor-pointer"
                    style={{
                      background: `linear-gradient(to right, ${colors.accentColor} 0%, ${colors.accentColor} ${((settings.tilt + 30) / 60) * 100}%, ${colors.border} ${((settings.tilt + 30) / 60) * 100}%, ${colors.border} 100%)`,
                    }}
                    aria-label="Camera tilt angle"
                    aria-valuemin={-30}
                    aria-valuemax={30}
                    aria-valuenow={settings.tilt}
                    aria-valuetext={`${settings.tilt} degrees`}
                  />
                  <div className="flex justify-between text-xs mt-1" style={{ color: colors.textTertiary }}>
                    <span>Down 30°</span>
                    <span>Level</span>
                    <span>Up 30°</span>
                  </div>
                </div>
              </div>
            )}
          </section>

          {/* ANIMATION SPEED SECTION */}
          <section 
            aria-labelledby="animation-heading"
            className="rounded-2xl overflow-hidden"
            style={{
              background: colors.cardBg,
              backdropFilter: colors.blur,
              WebkitBackdropFilter: colors.blur,
              border: colors.glassBorder,
              boxShadow: colors.shadow,
            }}
          >
            <button
              onClick={() => toggleSection('animation')}
              className="w-full p-4 flex items-center justify-between"
              aria-expanded={expandedSections.includes('animation')}
              aria-controls="animation-content"
            >
              <div className="flex items-center gap-3">
                <div 
                  className="w-10 h-10 rounded-lg flex items-center justify-center"
                  style={{ background: colors.warningBg }}
                  aria-hidden="true"
                >
                  <Gauge className="w-5 h-5" style={{ color: colors.warningColor }} />
                </div>
                <div className="text-left">
                  <h2 id="animation-heading" className="font-semibold" style={{ color: colors.textPrimary }}>
                    Animation Speed Controls
                  </h2>
                  <p className="text-xs" style={{ color: colors.textSecondary }}>
                    Adjust demonstration timing
                  </p>
                </div>
              </div>
              {expandedSections.includes('animation') ? (
                <ChevronDown className="w-5 h-5" style={{ color: colors.textTertiary }} />
              ) : (
                <ChevronRight className="w-5 h-5" style={{ color: colors.textTertiary }} />
              )}
            </button>

            {expandedSections.includes('animation') && (
              <div id="animation-content" className="px-4 pb-4 space-y-4">
                {/* Demo Speed */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <label htmlFor="demo-speed" className="text-sm font-semibold" style={{ color: colors.textPrimary }}>
                      Demonstration Speed
                    </label>
                    <span className="text-sm font-bold" style={{ color: colors.iconColor }}>
                      {settings.demoSpeed}x
                    </span>
                  </div>
                  <input
                    id="demo-speed"
                    type="range"
                    min="0.25"
                    max="2"
                    step="0.25"
                    value={settings.demoSpeed}
                    onChange={(e) => updateSetting('demoSpeed', parseFloat(e.target.value))}
                    className="w-full h-2 rounded-full appearance-none cursor-pointer"
                    style={{
                      background: `linear-gradient(to right, ${colors.warningColor} 0%, ${colors.warningColor} ${((settings.demoSpeed - 0.25) / 1.75) * 100}%, ${colors.border} ${((settings.demoSpeed - 0.25) / 1.75) * 100}%, ${colors.border} 100%)`,
                    }}
                    aria-label="Demonstration speed"
                    aria-valuemin={0.25}
                    aria-valuemax={2}
                    aria-valuenow={settings.demoSpeed}
                    aria-valuetext={`${settings.demoSpeed} times normal speed`}
                  />
                  <div className="flex justify-between text-xs mt-1" style={{ color: colors.textTertiary }}>
                    <span>Slow (0.25x)</span>
                    <span>Normal (1x)</span>
                    <span>Fast (2x)</span>
                  </div>
                </div>

                {/* Transition Speed */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <label htmlFor="transition-speed" className="text-sm font-semibold" style={{ color: colors.textPrimary }}>
                      Transition Speed
                    </label>
                    <span className="text-sm font-bold" style={{ color: colors.iconColor }}>
                      {settings.transitionSpeed}x
                    </span>
                  </div>
                  <input
                    id="transition-speed"
                    type="range"
                    min="0.5"
                    max="2"
                    step="0.25"
                    value={settings.transitionSpeed}
                    onChange={(e) => updateSetting('transitionSpeed', parseFloat(e.target.value))}
                    className="w-full h-2 rounded-full appearance-none cursor-pointer"
                    style={{
                      background: `linear-gradient(to right, ${colors.iconColor} 0%, ${colors.iconColor} ${((settings.transitionSpeed - 0.5) / 1.5) * 100}%, ${colors.border} ${((settings.transitionSpeed - 0.5) / 1.5) * 100}%, ${colors.border} 100%)`,
                    }}
                    aria-label="Transition speed between signs"
                    aria-valuemin={0.5}
                    aria-valuemax={2}
                    aria-valuenow={settings.transitionSpeed}
                    aria-valuetext={`${settings.transitionSpeed} times normal speed`}
                  />
                  <div className="flex justify-between text-xs mt-1" style={{ color: colors.textTertiary }}>
                    <span>0.5x</span>
                    <span>2x</span>
                  </div>
                </div>

                {/* Hand Movement Speed */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <label htmlFor="hand-speed" className="text-sm font-semibold" style={{ color: colors.textPrimary }}>
                      Hand Movement Speed
                    </label>
                    <span className="text-sm font-bold" style={{ color: colors.iconColor }}>
                      {settings.handSpeed}x
                    </span>
                  </div>
                  <input
                    id="hand-speed"
                    type="range"
                    min="0.25"
                    max="2"
                    step="0.25"
                    value={settings.handSpeed}
                    onChange={(e) => updateSetting('handSpeed', parseFloat(e.target.value))}
                    className="w-full h-2 rounded-full appearance-none cursor-pointer"
                    style={{
                      background: `linear-gradient(to right, ${colors.accentColor} 0%, ${colors.accentColor} ${((settings.handSpeed - 0.25) / 1.75) * 100}%, ${colors.border} ${((settings.handSpeed - 0.25) / 1.75) * 100}%, ${colors.border} 100%)`,
                    }}
                    aria-label="Hand movement speed"
                    aria-valuemin={0.25}
                    aria-valuemax={2}
                    aria-valuenow={settings.handSpeed}
                    aria-valuetext={`${settings.handSpeed} times normal speed`}
                  />
                  <div className="flex justify-between text-xs mt-1" style={{ color: colors.textTertiary }}>
                    <span>0.25x</span>
                    <span>2x</span>
                  </div>
                </div>

                {/* Info Box */}
                <div 
                  className="rounded-lg p-3 flex items-start gap-2"
                  style={{ background: colors.iconBg }}
                >
                  <Info className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: colors.iconColor }} aria-hidden="true" />
                  <p className="text-xs" style={{ color: colors.textSecondary }}>
                    Slower speeds are recommended for beginners learning new signs. Adjust based on your comfort level.
                  </p>
                </div>
              </div>
            )}
          </section>

          {/* DEMONSTRATION REPEAT OPTIONS SECTION */}
          <section 
            aria-labelledby="demonstration-heading"
            className="rounded-2xl overflow-hidden"
            style={{
              background: colors.cardBg,
              backdropFilter: colors.blur,
              WebkitBackdropFilter: colors.blur,
              border: colors.glassBorder,
              boxShadow: colors.shadow,
            }}
          >
            <button
              onClick={() => toggleSection('demonstration')}
              className="w-full p-4 flex items-center justify-between"
              aria-expanded={expandedSections.includes('demonstration')}
              aria-controls="demonstration-content"
            >
              <div className="flex items-center gap-3">
                <div 
                  className="w-10 h-10 rounded-lg flex items-center justify-center"
                  style={{ background: colors.accentBg }}
                  aria-hidden="true"
                >
                  <Repeat className="w-5 h-5" style={{ color: colors.accentColor }} />
                </div>
                <div className="text-left">
                  <h2 id="demonstration-heading" className="font-semibold" style={{ color: colors.textPrimary }}>
                    Demonstration Repeat Options
                  </h2>
                  <p className="text-xs" style={{ color: colors.textSecondary }}>
                    Configure auto-repeat behavior
                  </p>
                </div>
              </div>
              {expandedSections.includes('demonstration') ? (
                <ChevronDown className="w-5 h-5" style={{ color: colors.textTertiary }} />
              ) : (
                <ChevronRight className="w-5 h-5" style={{ color: colors.textTertiary }} />
              )}
            </button>

            {expandedSections.includes('demonstration') && (
              <div id="demonstration-content" className="px-4 pb-4 space-y-4">
                {/* Auto Repeat */}
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm font-semibold" style={{ color: colors.textPrimary }}>
                      Auto-Repeat Demonstrations
                    </div>
                    <div className="text-xs" style={{ color: colors.textSecondary }}>
                      Automatically repeat sign demonstrations
                    </div>
                  </div>
                  <button
                    onClick={() => updateSetting('autoRepeat', !settings.autoRepeat)}
                    className="relative w-12 h-6 rounded-full transition-colors ml-3 flex-shrink-0"
                    style={{ 
                      background: settings.autoRepeat ? colors.accentColor : colors.border,
                    }}
                    role="switch"
                    aria-checked={settings.autoRepeat}
                    aria-label="Toggle auto-repeat demonstrations"
                  >
                    <div 
                      className="absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white transition-transform"
                      style={{
                        transform: settings.autoRepeat ? 'translateX(24px)' : 'translateX(0)',
                      }}
                    />
                  </button>
                </div>

                {/* Repeat Count */}
                {settings.autoRepeat && (
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <label htmlFor="repeat-count" className="text-sm font-semibold" style={{ color: colors.textPrimary }}>
                        Number of Repeats
                      </label>
                      <span className="text-sm font-bold" style={{ color: colors.iconColor }}>
                        {settings.repeatCount}
                      </span>
                    </div>
                    <input
                      id="repeat-count"
                      type="range"
                      min="1"
                      max="10"
                      value={settings.repeatCount}
                      onChange={(e) => updateSetting('repeatCount', parseFloat(e.target.value))}
                      className="w-full h-2 rounded-full appearance-none cursor-pointer"
                      style={{
                        background: `linear-gradient(to right, ${colors.accentColor} 0%, ${colors.accentColor} ${((settings.repeatCount - 1) / 9) * 100}%, ${colors.border} ${((settings.repeatCount - 1) / 9) * 100}%, ${colors.border} 100%)`,
                      }}
                      aria-label="Number of repeats"
                      aria-valuemin={1}
                      aria-valuemax={10}
                      aria-valuenow={settings.repeatCount}
                    />
                    <div className="flex justify-between text-xs mt-1" style={{ color: colors.textTertiary }}>
                      <span>1</span>
                      <span>10</span>
                    </div>
                  </div>
                )}

                {/* Pause Between Repeats */}
                {settings.autoRepeat && (
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <label htmlFor="pause-time" className="text-sm font-semibold" style={{ color: colors.textPrimary }}>
                        Pause Between Repeats
                      </label>
                      <span className="text-sm font-bold" style={{ color: colors.iconColor }}>
                        {settings.pauseBetweenRepeats}s
                      </span>
                    </div>
                    <input
                      id="pause-time"
                      type="range"
                      min="0"
                      max="10"
                      step="0.5"
                      value={settings.pauseBetweenRepeats}
                      onChange={(e) => updateSetting('pauseBetweenRepeats', parseFloat(e.target.value))}
                      className="w-full h-2 rounded-full appearance-none cursor-pointer"
                      style={{
                        background: `linear-gradient(to right, ${colors.iconColor} 0%, ${colors.iconColor} ${(settings.pauseBetweenRepeats / 10) * 100}%, ${colors.border} ${(settings.pauseBetweenRepeats / 10) * 100}%, ${colors.border} 100%)`,
                      }}
                      aria-label="Pause duration between repeats"
                      aria-valuemin={0}
                      aria-valuemax={10}
                      aria-valuenow={settings.pauseBetweenRepeats}
                      aria-valuetext={`${settings.pauseBetweenRepeats} seconds`}
                    />
                    <div className="flex justify-between text-xs mt-1" style={{ color: colors.textTertiary }}>
                      <span>No pause</span>
                      <span>10 seconds</span>
                    </div>
                  </div>
                )}

                {/* Show Mirror View */}
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm font-semibold" style={{ color: colors.textPrimary }}>
                      Show Mirror View
                    </div>
                    <div className="text-xs" style={{ color: colors.textSecondary }}>
                      Display mirrored version for easier following
                    </div>
                  </div>
                  <button
                    onClick={() => updateSetting('showMirrorView', !settings.showMirrorView)}
                    className="relative w-12 h-6 rounded-full transition-colors ml-3 flex-shrink-0"
                    style={{ 
                      background: settings.showMirrorView ? colors.iconColor : colors.border,
                    }}
                    role="switch"
                    aria-checked={settings.showMirrorView}
                    aria-label="Toggle mirror view"
                  >
                    <div 
                      className="absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white transition-transform"
                      style={{
                        transform: settings.showMirrorView ? 'translateX(24px)' : 'translateX(0)',
                      }}
                    />
                  </button>
                </div>

                {/* Highlight Active Hand */}
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm font-semibold" style={{ color: colors.textPrimary }}>
                      Highlight Active Hand
                    </div>
                    <div className="text-xs" style={{ color: colors.textSecondary }}>
                      Emphasize the hand currently signing
                    </div>
                  </div>
                  <button
                    onClick={() => updateSetting('highlightActiveHand', !settings.highlightActiveHand)}
                    className="relative w-12 h-6 rounded-full transition-colors ml-3 flex-shrink-0"
                    style={{ 
                      background: settings.highlightActiveHand ? colors.successColor : colors.border,
                    }}
                    role="switch"
                    aria-checked={settings.highlightActiveHand}
                    aria-label="Toggle active hand highlighting"
                  >
                    <div 
                      className="absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white transition-transform"
                      style={{
                        transform: settings.highlightActiveHand ? 'translateX(24px)' : 'translateX(0)',
                      }}
                    />
                  </button>
                </div>

                {/* Show Hand Path */}
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm font-semibold" style={{ color: colors.textPrimary }}>
                      Show Hand Path
                    </div>
                    <div className="text-xs" style={{ color: colors.textSecondary }}>
                      Display motion trails for hand movements
                    </div>
                  </div>
                  <button
                    onClick={() => updateSetting('showHandPath', !settings.showHandPath)}
                    className="relative w-12 h-6 rounded-full transition-colors ml-3 flex-shrink-0"
                    style={{ 
                      background: settings.showHandPath ? colors.warningColor : colors.border,
                    }}
                    role="switch"
                    aria-checked={settings.showHandPath}
                    aria-label="Toggle hand path visualization"
                  >
                    <div 
                      className="absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white transition-transform"
                      style={{
                        transform: settings.showHandPath ? 'translateX(24px)' : 'translateX(0)',
                      }}
                    />
                  </button>
                </div>

                {/* Slow Motion Key Moments */}
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm font-semibold" style={{ color: colors.textPrimary }}>
                      Slow Motion Key Moments
                    </div>
                    <div className="text-xs" style={{ color: colors.textSecondary }}>
                      Automatically slow down at critical points
                    </div>
                  </div>
                  <button
                    onClick={() => updateSetting('slowMotionKey', !settings.slowMotionKey)}
                    className="relative w-12 h-6 rounded-full transition-colors ml-3 flex-shrink-0"
                    style={{ 
                      background: settings.slowMotionKey ? colors.accentColor : colors.border,
                    }}
                    role="switch"
                    aria-checked={settings.slowMotionKey}
                    aria-label="Toggle slow motion for key moments"
                  >
                    <div 
                      className="absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white transition-transform"
                      style={{
                        transform: settings.slowMotionKey ? 'translateX(24px)' : 'translateX(0)',
                      }}
                    />
                  </button>
                </div>
              </div>
            )}
          </section>

          {/* FEEDBACK OPTIONS SECTION */}
          <section 
            aria-labelledby="feedback-heading"
            className="rounded-2xl overflow-hidden"
            style={{
              background: colors.cardBg,
              backdropFilter: colors.blur,
              WebkitBackdropFilter: colors.blur,
              border: colors.glassBorder,
              boxShadow: colors.shadow,
            }}
          >
            <button
              onClick={() => toggleSection('feedback')}
              className="w-full p-4 flex items-center justify-between"
              aria-expanded={expandedSections.includes('feedback')}
              aria-controls="feedback-content"
            >
              <div className="flex items-center gap-3">
                <div 
                  className="w-10 h-10 rounded-lg flex items-center justify-center"
                  style={{ background: colors.successBg }}
                  aria-hidden="true"
                >
                  <MessageSquare className="w-5 h-5" style={{ color: colors.successColor }} />
                </div>
                <div className="text-left">
                  <h2 id="feedback-heading" className="font-semibold" style={{ color: colors.textPrimary }}>
                    Feedback Options
                  </h2>
                  <p className="text-xs" style={{ color: colors.textSecondary }}>
                    Configure correction and guidance
                  </p>
                </div>
              </div>
              {expandedSections.includes('feedback') ? (
                <ChevronDown className="w-5 h-5" style={{ color: colors.textTertiary }} />
              ) : (
                <ChevronRight className="w-5 h-5" style={{ color: colors.textTertiary }} />
              )}
            </button>

            {expandedSections.includes('feedback') && (
              <div id="feedback-content" className="px-4 pb-4 space-y-4">
                {/* Voice Guidance */}
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm font-semibold" style={{ color: colors.textPrimary }}>
                      Voice Guidance
                    </div>
                    <div className="text-xs" style={{ color: colors.textSecondary }}>
                      Spoken instructions and corrections
                    </div>
                  </div>
                  <button
                    onClick={() => updateSetting('voiceGuidance', !settings.voiceGuidance)}
                    className="relative w-12 h-6 rounded-full transition-colors ml-3 flex-shrink-0"
                    style={{ 
                      background: settings.voiceGuidance ? colors.successColor : colors.border,
                    }}
                    role="switch"
                    aria-checked={settings.voiceGuidance}
                    aria-label="Toggle voice guidance"
                  >
                    <div 
                      className="absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white transition-transform"
                      style={{
                        transform: settings.voiceGuidance ? 'translateX(24px)' : 'translateX(0)',
                      }}
                    />
                  </button>
                </div>

                {/* Voice Gender */}
                {settings.voiceGuidance && (
                  <div>
                    <label className="text-sm font-semibold mb-3 block" style={{ color: colors.textPrimary }}>
                      Voice Gender
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      {['female', 'male', 'neutral'].map((voice) => (
                        <button
                          key={voice}
                          onClick={() => updateSetting('voiceGender', voice)}
                          className="px-4 py-3 rounded-xl font-semibold text-sm transition-all capitalize"
                          style={{
                            background: settings.voiceGender === voice ? colors.successBg : colors.cardHover,
                            color: settings.voiceGender === voice ? colors.successColor : colors.textPrimary,
                            border: settings.voiceGender === voice ? `2px solid ${colors.successColor}` : '1px solid transparent',
                          }}
                          aria-label={`Select ${voice} voice`}
                          aria-pressed={settings.voiceGender === voice}
                        >
                          {voice}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Haptic Feedback */}
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm font-semibold" style={{ color: colors.textPrimary }}>
                      Haptic Feedback
                    </div>
                    <div className="text-xs" style={{ color: colors.textSecondary }}>
                      Vibration for confirmations and errors
                    </div>
                  </div>
                  <button
                    onClick={() => updateSetting('hapticFeedback', !settings.hapticFeedback)}
                    className="relative w-12 h-6 rounded-full transition-colors ml-3 flex-shrink-0"
                    style={{ 
                      background: settings.hapticFeedback ? colors.iconColor : colors.border,
                    }}
                    role="switch"
                    aria-checked={settings.hapticFeedback}
                    aria-label="Toggle haptic feedback"
                  >
                    <div 
                      className="absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white transition-transform"
                      style={{
                        transform: settings.hapticFeedback ? 'translateX(24px)' : 'translateX(0)',
                      }}
                    />
                  </button>
                </div>

                {/* Visual Cues */}
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm font-semibold" style={{ color: colors.textPrimary }}>
                      Visual Cues
                    </div>
                    <div className="text-xs" style={{ color: colors.textSecondary }}>
                      On-screen indicators and highlights
                    </div>
                  </div>
                  <button
                    onClick={() => updateSetting('visualCues', !settings.visualCues)}
                    className="relative w-12 h-6 rounded-full transition-colors ml-3 flex-shrink-0"
                    style={{ 
                      background: settings.visualCues ? colors.accentColor : colors.border,
                    }}
                    role="switch"
                    aria-checked={settings.visualCues}
                    aria-label="Toggle visual cues"
                  >
                    <div 
                      className="absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white transition-transform"
                      style={{
                        transform: settings.visualCues ? 'translateX(24px)' : 'translateX(0)',
                      }}
                    />
                  </button>
                </div>

                {/* Correction Level */}
                <div>
                  <label className="text-sm font-semibold mb-3 block" style={{ color: colors.textPrimary }}>
                    Correction Level
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {['gentle', 'medium', 'strict'].map((level) => (
                      <button
                        key={level}
                        onClick={() => updateSetting('correctionLevel', level)}
                        className="px-4 py-3 rounded-xl font-semibold text-sm transition-all capitalize"
                        style={{
                          background: settings.correctionLevel === level ? colors.warningBg : colors.cardHover,
                          color: settings.correctionLevel === level ? colors.warningColor : colors.textPrimary,
                          border: settings.correctionLevel === level ? `2px solid ${colors.warningColor}` : '1px solid transparent',
                        }}
                        aria-label={`Select ${level} correction level`}
                        aria-pressed={settings.correctionLevel === level}
                      >
                        {level}
                      </button>
                    ))}
                  </div>
                  <p className="text-xs mt-2" style={{ color: colors.textTertiary }}>
                    {settings.correctionLevel === 'gentle' && 'Minimal corrections, focus on encouragement'}
                    {settings.correctionLevel === 'medium' && 'Balanced feedback with helpful corrections'}
                    {settings.correctionLevel === 'strict' && 'Detailed corrections for precision practice'}
                  </p>
                </div>
              </div>
            )}
          </section>

          {/* DISPLAY OPTIONS SECTION */}
          <section 
            aria-labelledby="display-heading"
            className="rounded-2xl overflow-hidden"
            style={{
              background: colors.cardBg,
              backdropFilter: colors.blur,
              WebkitBackdropFilter: colors.blur,
              border: colors.glassBorder,
              boxShadow: colors.shadow,
            }}
          >
            <button
              onClick={() => toggleSection('display')}
              className="w-full p-4 flex items-center justify-between"
              aria-expanded={expandedSections.includes('display')}
              aria-controls="display-content"
            >
              <div className="flex items-center gap-3">
                <div 
                  className="w-10 h-10 rounded-lg flex items-center justify-center"
                  style={{ background: colors.iconBg }}
                  aria-hidden="true"
                >
                  <Monitor className="w-5 h-5" style={{ color: colors.iconColor }} />
                </div>
                <div className="text-left">
                  <h2 id="display-heading" className="font-semibold" style={{ color: colors.textPrimary }}>
                    Display Options
                  </h2>
                  <p className="text-xs" style={{ color: colors.textSecondary }}>
                    Visual appearance settings
                  </p>
                </div>
              </div>
              {expandedSections.includes('display') ? (
                <ChevronDown className="w-5 h-5" style={{ color: colors.textTertiary }} />
              ) : (
                <ChevronRight className="w-5 h-5" style={{ color: colors.textTertiary }} />
              )}
            </button>

            {expandedSections.includes('display') && (
              <div id="display-content" className="px-4 pb-4 space-y-4">
                {/* Show Subtitles */}
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm font-semibold" style={{ color: colors.textPrimary }}>
                      Show Subtitles
                    </div>
                    <div className="text-xs" style={{ color: colors.textSecondary }}>
                      Display text for sign meanings
                    </div>
                  </div>
                  <button
                    onClick={() => updateSetting('showSubtitles', !settings.showSubtitles)}
                    className="relative w-12 h-6 rounded-full transition-colors ml-3 flex-shrink-0"
                    style={{ 
                      background: settings.showSubtitles ? colors.iconColor : colors.border,
                    }}
                    role="switch"
                    aria-checked={settings.showSubtitles}
                    aria-label="Toggle subtitles"
                  >
                    <div 
                      className="absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white transition-transform"
                      style={{
                        transform: settings.showSubtitles ? 'translateX(24px)' : 'translateX(0)',
                      }}
                    />
                  </button>
                </div>

                {/* Show Hand Labels */}
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm font-semibold" style={{ color: colors.textPrimary }}>
                      Show Hand Labels
                    </div>
                    <div className="text-xs" style={{ color: colors.textSecondary }}>
                      Label dominant and non-dominant hands
                    </div>
                  </div>
                  <button
                    onClick={() => updateSetting('showHandLabels', !settings.showHandLabels)}
                    className="relative w-12 h-6 rounded-full transition-colors ml-3 flex-shrink-0"
                    style={{ 
                      background: settings.showHandLabels ? colors.successColor : colors.border,
                    }}
                    role="switch"
                    aria-checked={settings.showHandLabels}
                    aria-label="Toggle hand labels"
                  >
                    <div 
                      className="absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white transition-transform"
                      style={{
                        transform: settings.showHandLabels ? 'translateX(24px)' : 'translateX(0)',
                      }}
                    />
                  </button>
                </div>

                {/* Show Grid Lines */}
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm font-semibold" style={{ color: colors.textPrimary }}>
                      Show Grid Lines
                    </div>
                    <div className="text-xs" style={{ color: colors.textSecondary }}>
                      Display reference grid in AR space
                    </div>
                  </div>
                  <button
                    onClick={() => updateSetting('showGridLines', !settings.showGridLines)}
                    className="relative w-12 h-6 rounded-full transition-colors ml-3 flex-shrink-0"
                    style={{ 
                      background: settings.showGridLines ? colors.accentColor : colors.border,
                    }}
                    role="switch"
                    aria-checked={settings.showGridLines}
                    aria-label="Toggle grid lines"
                  >
                    <div 
                      className="absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white transition-transform"
                      style={{
                        transform: settings.showGridLines ? 'translateX(24px)' : 'translateX(0)',
                      }}
                    />
                  </button>
                </div>

                {/* Background */}
                <div>
                  <label className="text-sm font-semibold mb-3 block" style={{ color: colors.textPrimary }}>
                    Background Style
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { id: 'transparent', label: 'Transparent' },
                      { id: 'gradient', label: 'Gradient' },
                      { id: 'solid-light', label: 'Light' },
                      { id: 'solid-dark', label: 'Dark' },
                    ].map((bg) => (
                      <button
                        key={bg.id}
                        onClick={() => updateSetting('backgroundColor', bg.id)}
                        className="px-4 py-3 rounded-xl font-semibold text-sm transition-all"
                        style={{
                          background: settings.backgroundColor === bg.id ? colors.iconBg : colors.cardHover,
                          color: settings.backgroundColor === bg.id ? colors.iconColor : colors.textPrimary,
                          border: settings.backgroundColor === bg.id ? `2px solid ${colors.iconColor}` : '1px solid transparent',
                        }}
                        aria-label={`Select ${bg.label} background`}
                        aria-pressed={settings.backgroundColor === bg.id}
                      >
                        {bg.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Avatar Opacity */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <label htmlFor="avatar-opacity" className="text-sm font-semibold" style={{ color: colors.textPrimary }}>
                      Avatar Opacity
                    </label>
                    <span className="text-sm font-bold" style={{ color: colors.iconColor }}>
                      {settings.avatarOpacity}%
                    </span>
                  </div>
                  <input
                    id="avatar-opacity"
                    type="range"
                    min="50"
                    max="100"
                    step="10"
                    value={settings.avatarOpacity}
                    onChange={(e) => updateSetting('avatarOpacity', parseFloat(e.target.value))}
                    className="w-full h-2 rounded-full appearance-none cursor-pointer"
                    style={{
                      background: `linear-gradient(to right, ${colors.iconColor} 0%, ${colors.iconColor} ${((settings.avatarOpacity - 50) / 50) * 100}%, ${colors.border} ${((settings.avatarOpacity - 50) / 50) * 100}%, ${colors.border} 100%)`,
                    }}
                    aria-label="Avatar opacity"
                    aria-valuemin={50}
                    aria-valuemax={100}
                    aria-valuenow={settings.avatarOpacity}
                    aria-valuetext={`${settings.avatarOpacity} percent opacity`}
                  />
                  <div className="flex justify-between text-xs mt-1" style={{ color: colors.textTertiary }}>
                    <span>50%</span>
                    <span>100%</span>
                  </div>
                </div>
              </div>
            )}
          </section>

          {/* ACCESSIBILITY SECTION */}
          <section 
            aria-labelledby="accessibility-heading"
            className="rounded-2xl overflow-hidden"
            style={{
              background: colors.cardBg,
              backdropFilter: colors.blur,
              WebkitBackdropFilter: colors.blur,
              border: colors.glassBorder,
              boxShadow: colors.shadow,
            }}
          >
            <button
              onClick={() => toggleSection('accessibility')}
              className="w-full p-4 flex items-center justify-between"
              aria-expanded={expandedSections.includes('accessibility')}
              aria-controls="accessibility-content"
            >
              <div className="flex items-center gap-3">
                <div 
                  className="w-10 h-10 rounded-lg flex items-center justify-center"
                  style={{ background: colors.successBg }}
                  aria-hidden="true"
                >
                  <Settings className="w-5 h-5" style={{ color: colors.successColor }} />
                </div>
                <div className="text-left">
                  <h2 id="accessibility-heading" className="font-semibold" style={{ color: colors.textPrimary }}>
                    Accessibility
                  </h2>
                  <p className="text-xs" style={{ color: colors.textSecondary }}>
                    508 compliance and assistive features
                  </p>
                </div>
              </div>
              {expandedSections.includes('accessibility') ? (
                <ChevronDown className="w-5 h-5" style={{ color: colors.textTertiary }} />
              ) : (
                <ChevronRight className="w-5 h-5" style={{ color: colors.textTertiary }} />
              )}
            </button>

            {expandedSections.includes('accessibility') && (
              <div id="accessibility-content" className="px-4 pb-4 space-y-4">
                {/* High Contrast */}
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm font-semibold" style={{ color: colors.textPrimary }}>
                      High Contrast Mode
                    </div>
                    <div className="text-xs" style={{ color: colors.textSecondary }}>
                      Enhanced visibility for low vision users
                    </div>
                  </div>
                  <button
                    onClick={() => updateSetting('highContrast', !settings.highContrast)}
                    className="relative w-12 h-6 rounded-full transition-colors ml-3 flex-shrink-0"
                    style={{ 
                      background: settings.highContrast ? colors.successColor : colors.border,
                    }}
                    role="switch"
                    aria-checked={settings.highContrast}
                    aria-label="Toggle high contrast mode"
                  >
                    <div 
                      className="absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white transition-transform"
                      style={{
                        transform: settings.highContrast ? 'translateX(24px)' : 'translateX(0)',
                      }}
                    />
                  </button>
                </div>

                {/* Reduced Motion */}
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm font-semibold" style={{ color: colors.textPrimary }}>
                      Reduced Motion
                    </div>
                    <div className="text-xs" style={{ color: colors.textSecondary }}>
                      Minimize animations and transitions
                    </div>
                  </div>
                  <button
                    onClick={() => updateSetting('reducedMotion', !settings.reducedMotion)}
                    className="relative w-12 h-6 rounded-full transition-colors ml-3 flex-shrink-0"
                    style={{ 
                      background: settings.reducedMotion ? colors.iconColor : colors.border,
                    }}
                    role="switch"
                    aria-checked={settings.reducedMotion}
                    aria-label="Toggle reduced motion"
                  >
                    <div 
                      className="absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white transition-transform"
                      style={{
                        transform: settings.reducedMotion ? 'translateX(24px)' : 'translateX(0)',
                      }}
                    />
                  </button>
                </div>

                {/* Audio Descriptions */}
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm font-semibold" style={{ color: colors.textPrimary }}>
                      Audio Descriptions
                    </div>
                    <div className="text-xs" style={{ color: colors.textSecondary }}>
                      Detailed narration of visual elements
                    </div>
                  </div>
                  <button
                    onClick={() => updateSetting('audioDescriptions', !settings.audioDescriptions)}
                    className="relative w-12 h-6 rounded-full transition-colors ml-3 flex-shrink-0"
                    style={{ 
                      background: settings.audioDescriptions ? colors.accentColor : colors.border,
                    }}
                    role="switch"
                    aria-checked={settings.audioDescriptions}
                    aria-label="Toggle audio descriptions"
                  >
                    <div 
                      className="absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white transition-transform"
                      style={{
                        transform: settings.audioDescriptions ? 'translateX(24px)' : 'translateX(0)',
                      }}
                    />
                  </button>
                </div>

                {/* Sign Size */}
                <div>
                  <label className="text-sm font-semibold mb-3 block" style={{ color: colors.textPrimary }}>
                    Sign Display Size
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {['small', 'medium', 'large'].map((size) => (
                      <button
                        key={size}
                        onClick={() => updateSetting('signSize', size)}
                        className="px-4 py-3 rounded-xl font-semibold text-sm transition-all capitalize"
                        style={{
                          background: settings.signSize === size ? colors.successBg : colors.cardHover,
                          color: settings.signSize === size ? colors.successColor : colors.textPrimary,
                          border: settings.signSize === size ? `2px solid ${colors.successColor}` : '1px solid transparent',
                        }}
                        aria-label={`Select ${size} sign size`}
                        aria-pressed={settings.signSize === size}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </section>

        </div>
      </div>

      {/* Fixed Bottom Action Bar */}
      <div 
        className="p-4 border-t"
        style={{ borderTopColor: colors.border, background: colors.bg }}
      >
        <div className="max-w-2xl mx-auto flex gap-3">
          <Button
            onClick={handleReset}
            variant="outline"
            className="flex-1 h-12 rounded-xl font-semibold"
            style={{
              borderColor: colors.border,
              color: colors.textSecondary,
            }}
            aria-label="Reset all settings to default"
          >
            <RotateCcw className="w-5 h-5 mr-2" />
            Reset
          </Button>
          <Button
            onClick={handleSave}
            disabled={!hasUnsavedChanges}
            className="flex-1 h-12 rounded-xl font-semibold"
            style={{
              background: hasUnsavedChanges ? colors.iconColor : colors.border,
              color: hasUnsavedChanges ? (theme === 'dark' ? '#0F0F23' : '#FFFFFF') : colors.textTertiary,
              opacity: hasUnsavedChanges ? 1 : 0.5,
            }}
            aria-label="Save avatar settings"
          >
            <Save className="w-5 h-5 mr-2" />
            Save Settings
          </Button>
        </div>
      </div>
    </div>
  );
}
