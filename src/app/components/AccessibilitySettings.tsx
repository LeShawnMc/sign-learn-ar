import { useState } from 'react';
import { Button } from './ui/button';
import { useTheme } from '../context/ThemeContext';
import { useApp } from '../context/AppContext';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, 
  Eye, 
  Type, 
  Vibrate, 
  Hand, 
  Sliders, 
  Captions, 
  Check,
  Info,
  Palette,
  ZoomIn,
  ChevronRight,
  Monitor,
  Zap,
} from 'lucide-react';

interface AccessibilitySettingsProps {
  onExit: () => void;
  onSave?: (settings: AccessibilityPreferences) => void;
}

interface AccessibilityPreferences {
  // Contrast and Color
  contrastMode: 'standard' | 'high' | 'maximum';
  colorBlindMode: 'none' | 'protanopia' | 'deuteranopia' | 'tritanopia' | 'monochrome';
  reducedMotion: boolean;
  
  // Font Size
  fontSize: 'small' | 'medium' | 'large' | 'extra-large' | 'accessibility';
  boldText: boolean;
  
  // Haptic Feedback
  hapticFeedback: boolean;
  hapticIntensity: number; // 0-100
  
  // Handed Mode
  handedMode: 'right' | 'left' | 'ambidextrous';
  mirrorCameraView: boolean;
  
  // Tracking Sensitivity
  handTrackingSensitivity: number; // 0-100
  gestureRecognitionSpeed: 'slow' | 'medium' | 'fast';
  confidenceThreshold: number; // 0-100
  
  // Subtitle Preferences
  subtitlesEnabled: boolean;
  subtitleSize: 'small' | 'medium' | 'large' | 'extra-large';
  subtitleBackground: boolean;
  subtitleLanguage: string;
  captionsEnabled: boolean;
}

export function AccessibilitySettings({ onExit, onSave }: AccessibilitySettingsProps) {
  const { theme } = useTheme();
  const { userProgress } = useApp();

  // Initialize with default preferences
  const [preferences, setPreferences] = useState<AccessibilityPreferences>({
    contrastMode: 'standard',
    colorBlindMode: 'none',
    reducedMotion: false,
    fontSize: 'medium',
    boldText: false,
    hapticFeedback: true,
    hapticIntensity: 70,
    handedMode: 'right',
    mirrorCameraView: false,
    handTrackingSensitivity: 80,
    gestureRecognitionSpeed: 'medium',
    confidenceThreshold: 75,
    subtitlesEnabled: true,
    subtitleSize: 'medium',
    subtitleBackground: true,
    subtitleLanguage: 'en',
    captionsEnabled: true,
  });

  const [showSaveConfirmation, setShowSaveConfirmation] = useState(false);

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
        blur: 'blur(20px)',
        shadow: '0 8px 32px rgba(31, 38, 135, 0.15)',
        glassBorder: '1px solid rgba(255, 255, 255, 0.6)',
      };

  const handleSave = () => {
    if (onSave) {
      onSave(preferences);
    }
    setShowSaveConfirmation(true);
    setTimeout(() => {
      setShowSaveConfirmation(false);
      onExit();
    }, 1500);
  };

  const renderSlider = (
    label: string,
    value: number,
    onChange: (value: number) => void,
    min: number = 0,
    max: number = 100,
    ariaLabel: string,
    description?: string
  ) => {
    return (
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <div className="flex-1">
            <label className="text-sm font-semibold block" style={{ color: colors.textPrimary }}>
              {label}
            </label>
            {description && (
              <p className="text-xs mt-1" style={{ color: colors.textSecondary }}>
                {description}
              </p>
            )}
          </div>
          <div 
            className="px-3 py-1 rounded-full text-sm font-semibold"
            style={{ background: colors.iconBg, color: colors.iconColor }}
            aria-label={`${ariaLabel} value: ${value}`}
          >
            {value}
          </div>
        </div>
        <input
          type="range"
          min={min}
          max={max}
          value={value}
          onChange={(e) => onChange(parseInt(e.target.value))}
          className="w-full h-2 rounded-full appearance-none cursor-pointer"
          style={{
            background: `linear-gradient(to right, ${colors.iconColor} 0%, ${colors.iconColor} ${value}%, ${colors.border} ${value}%, ${colors.border} 100%)`,
          }}
          aria-label={ariaLabel}
          aria-valuemin={min}
          aria-valuemax={max}
          aria-valuenow={value}
        />
      </div>
    );
  };

  const renderToggle = (
    label: string,
    value: boolean,
    onChange: (value: boolean) => void,
    description?: string,
    ariaLabel?: string
  ) => {
    return (
      <div 
        className="rounded-xl p-4 flex items-center justify-between mb-3"
        style={{
          background: colors.cardBg,
          backdropFilter: colors.blur,
          WebkitBackdropFilter: colors.blur,
          border: colors.glassBorder,
          boxShadow: colors.shadow,
        }}
      >
        <div className="flex-1 pr-4">
          <div className="font-semibold text-sm mb-1" style={{ color: colors.textPrimary }}>
            {label}
          </div>
          {description && (
            <div className="text-xs" style={{ color: colors.textSecondary }}>
              {description}
            </div>
          )}
        </div>
        <button
          onClick={() => onChange(!value)}
          className="relative w-12 h-6 rounded-full transition-colors flex-shrink-0"
          style={{ 
            background: value ? colors.iconColor : colors.border,
          }}
          role="switch"
          aria-checked={value}
          aria-label={ariaLabel || label}
        >
          <div 
            className="absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white transition-transform"
            style={{
              transform: value ? 'translateX(24px)' : 'translateX(0)',
            }}
          />
        </button>
      </div>
    );
  };

  return (
    <div 
      className="h-full flex flex-col"
      style={{ background: colors.bg, color: colors.textPrimary }}
      role="main"
      aria-labelledby="accessibility-title"
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
            onClick={onExit}
            style={{ color: colors.textSecondary }}
            aria-label="Close accessibility settings"
          >
            <X className="w-6 h-6" />
          </Button>
          <div className="flex-1 min-w-0">
            <h1 
              id="accessibility-title" 
              className="text-xl sm:text-2xl font-bold"
              style={{ fontFamily: 'Poppins, sans-serif' }}
            >
              Accessibility
            </h1>
            <p className="text-sm" style={{ color: colors.textSecondary }}>
              Customize your learning experience
            </p>
          </div>
        </div>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6">
        {/* Contrast & Color Section */}
        <section aria-labelledby="contrast-heading" className="mb-6">
          <div className="flex items-center gap-2 mb-4">
            <Palette className="w-5 h-5" style={{ color: colors.iconColor }} aria-hidden="true" />
            <h2 id="contrast-heading" className="text-lg font-semibold" style={{ color: colors.textPrimary }}>
              Contrast & Color
            </h2>
          </div>

          {/* Contrast Mode */}
          <div className="mb-4">
            <label className="text-sm font-semibold mb-3 block" style={{ color: colors.textPrimary }}>
              Contrast Mode
            </label>
            <div className="space-y-2" role="radiogroup" aria-label="Contrast mode">
              {[
                { id: 'standard', title: 'Standard', description: 'Default contrast for most users' },
                { id: 'high', title: 'High Contrast', description: 'Increased contrast for better visibility' },
                { id: 'maximum', title: 'Maximum Contrast', description: 'Highest contrast for low vision users' },
              ].map((mode) => {
                const isSelected = preferences.contrastMode === mode.id;
                
                return (
                  <button
                    key={mode.id}
                    onClick={() => setPreferences({ ...preferences, contrastMode: mode.id as any })}
                    className="w-full rounded-xl p-4 text-left transition-all"
                    style={{
                      background: isSelected ? colors.cardHover : colors.cardBg,
                      backdropFilter: colors.blur,
                      WebkitBackdropFilter: colors.blur,
                      border: isSelected ? `2px solid ${colors.iconColor}` : colors.glassBorder,
                      boxShadow: colors.shadow,
                    }}
                    onMouseEnter={(e) => {
                      if (!isSelected) e.currentTarget.style.background = colors.cardHover;
                    }}
                    onMouseLeave={(e) => {
                      if (!isSelected) e.currentTarget.style.background = colors.cardBg;
                    }}
                    role="radio"
                    aria-checked={isSelected}
                    aria-labelledby={`contrast-${mode.id}-title`}
                    aria-describedby={`contrast-${mode.id}-desc`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="font-semibold mb-1" id={`contrast-${mode.id}-title`} style={{ color: colors.textPrimary }}>
                          {mode.title}
                        </div>
                        <div className="text-sm" id={`contrast-${mode.id}-desc`} style={{ color: colors.textSecondary }}>
                          {mode.description}
                        </div>
                      </div>
                      {isSelected && (
                        <Check className="w-5 h-5 flex-shrink-0 ml-3" style={{ color: colors.iconColor }} aria-hidden="true" />
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Color Blind Mode */}
          <div className="mb-4">
            <label className="text-sm font-semibold mb-3 block" style={{ color: colors.textPrimary }}>
              Color Blind Mode
            </label>
            <div className="space-y-2" role="radiogroup" aria-label="Color blind mode">
              {[
                { id: 'none', title: 'None', description: 'Standard colors' },
                { id: 'protanopia', title: 'Protanopia (Red-Blind)', description: 'Adjusted for red color blindness' },
                { id: 'deuteranopia', title: 'Deuteranopia (Green-Blind)', description: 'Adjusted for green color blindness' },
                { id: 'tritanopia', title: 'Tritanopia (Blue-Blind)', description: 'Adjusted for blue color blindness' },
                { id: 'monochrome', title: 'Monochrome', description: 'Grayscale mode for complete color blindness' },
              ].map((mode) => {
                const isSelected = preferences.colorBlindMode === mode.id;
                
                return (
                  <button
                    key={mode.id}
                    onClick={() => setPreferences({ ...preferences, colorBlindMode: mode.id as any })}
                    className="w-full rounded-xl p-3 text-left transition-all"
                    style={{
                      background: isSelected ? colors.cardHover : colors.cardBg,
                      backdropFilter: colors.blur,
                      WebkitBackdropFilter: colors.blur,
                      border: isSelected ? `2px solid ${colors.iconColor}` : colors.glassBorder,
                      boxShadow: colors.shadow,
                    }}
                    onMouseEnter={(e) => {
                      if (!isSelected) e.currentTarget.style.background = colors.cardHover;
                    }}
                    onMouseLeave={(e) => {
                      if (!isSelected) e.currentTarget.style.background = colors.cardBg;
                    }}
                    role="radio"
                    aria-checked={isSelected}
                    aria-label={`${mode.title}, ${mode.description}`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="font-semibold text-sm mb-0.5" style={{ color: colors.textPrimary }}>
                          {mode.title}
                        </div>
                        <div className="text-xs" style={{ color: colors.textSecondary }}>
                          {mode.description}
                        </div>
                      </div>
                      {isSelected && (
                        <Check className="w-5 h-5 flex-shrink-0 ml-3" style={{ color: colors.iconColor }} aria-hidden="true" />
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Reduced Motion */}
          {renderToggle(
            'Reduce Motion',
            preferences.reducedMotion,
            (value) => setPreferences({ ...preferences, reducedMotion: value }),
            'Minimize animations and transitions',
            'Toggle reduce motion'
          )}
        </section>

        {/* Font Size Section */}
        <section aria-labelledby="font-heading" className="mb-6">
          <div className="flex items-center gap-2 mb-4">
            <Type className="w-5 h-5" style={{ color: colors.iconColor }} aria-hidden="true" />
            <h2 id="font-heading" className="text-lg font-semibold" style={{ color: colors.textPrimary }}>
              Text & Display
            </h2>
          </div>

          {/* Font Size */}
          <div className="mb-4">
            <label className="text-sm font-semibold mb-3 block" style={{ color: colors.textPrimary }}>
              Font Size
            </label>
            <div className="grid grid-cols-2 gap-2" role="radiogroup" aria-label="Font size">
              {[
                { id: 'small', label: 'Small', size: '14px' },
                { id: 'medium', label: 'Medium', size: '16px' },
                { id: 'large', label: 'Large', size: '18px' },
                { id: 'extra-large', label: 'Extra Large', size: '20px' },
                { id: 'accessibility', label: 'Accessibility', size: '24px' },
              ].map((size) => {
                const isSelected = preferences.fontSize === size.id;
                
                return (
                  <button
                    key={size.id}
                    onClick={() => setPreferences({ ...preferences, fontSize: size.id as any })}
                    className="rounded-xl p-4 text-center transition-all"
                    style={{
                      background: isSelected ? colors.iconBg : colors.cardBg,
                      backdropFilter: colors.blur,
                      WebkitBackdropFilter: colors.blur,
                      border: isSelected ? `2px solid ${colors.iconColor}` : colors.glassBorder,
                      boxShadow: colors.shadow,
                    }}
                    onMouseEnter={(e) => {
                      if (!isSelected) e.currentTarget.style.background = colors.cardHover;
                    }}
                    onMouseLeave={(e) => {
                      if (!isSelected) e.currentTarget.style.background = colors.cardBg;
                    }}
                    role="radio"
                    aria-checked={isSelected}
                    aria-label={`${size.label} font size, ${size.size}`}
                  >
                    <div 
                      className="font-semibold mb-1"
                      style={{ fontSize: size.size, color: colors.textPrimary }}
                    >
                      Aa
                    </div>
                    <div className="text-xs" style={{ color: colors.textSecondary }}>
                      {size.label}
                    </div>
                    <div className="text-xs mt-1" style={{ color: colors.textTertiary }}>
                      {size.size}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Bold Text */}
          {renderToggle(
            'Bold Text',
            preferences.boldText,
            (value) => setPreferences({ ...preferences, boldText: value }),
            'Use heavier font weight throughout the app',
            'Toggle bold text'
          )}
        </section>

        {/* Haptic Feedback Section */}
        <section aria-labelledby="haptic-heading" className="mb-6">
          <div className="flex items-center gap-2 mb-4">
            <Vibrate className="w-5 h-5" style={{ color: colors.iconColor }} aria-hidden="true" />
            <h2 id="haptic-heading" className="text-lg font-semibold" style={{ color: colors.textPrimary }}>
              Haptic Feedback
            </h2>
          </div>

          {renderToggle(
            'Haptic Feedback',
            preferences.hapticFeedback,
            (value) => setPreferences({ ...preferences, hapticFeedback: value }),
            'Feel vibrations when interacting with the app',
            'Toggle haptic feedback'
          )}

          {preferences.hapticFeedback && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-4"
            >
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
                {renderSlider(
                  'Haptic Intensity',
                  preferences.hapticIntensity,
                  (value) => setPreferences({ ...preferences, hapticIntensity: value }),
                  0,
                  100,
                  'Haptic intensity',
                  'Adjust the strength of vibration feedback'
                )}
              </div>
            </motion.div>
          )}
        </section>

        {/* Handed Mode Section */}
        <section aria-labelledby="handed-heading" className="mb-6">
          <div className="flex items-center gap-2 mb-4">
            <Hand className="w-5 h-5" style={{ color: colors.iconColor }} aria-hidden="true" />
            <h2 id="handed-heading" className="text-lg font-semibold" style={{ color: colors.textPrimary }}>
              Hand Preference
            </h2>
          </div>

          <div className="mb-4">
            <label className="text-sm font-semibold mb-3 block" style={{ color: colors.textPrimary }}>
              Dominant Hand
            </label>
            <div className="grid grid-cols-3 gap-2" role="radiogroup" aria-label="Dominant hand">
              {[
                { id: 'right', label: 'Right Hand', icon: '🤚' },
                { id: 'left', label: 'Left Hand', icon: '🖐' },
                { id: 'ambidextrous', label: 'Both', icon: '👐' },
              ].map((hand) => {
                const isSelected = preferences.handedMode === hand.id;
                
                return (
                  <button
                    key={hand.id}
                    onClick={() => setPreferences({ ...preferences, handedMode: hand.id as any })}
                    className="rounded-xl p-4 text-center transition-all"
                    style={{
                      background: isSelected ? colors.iconBg : colors.cardBg,
                      backdropFilter: colors.blur,
                      WebkitBackdropFilter: colors.blur,
                      border: isSelected ? `2px solid ${colors.iconColor}` : colors.glassBorder,
                      boxShadow: colors.shadow,
                    }}
                    onMouseEnter={(e) => {
                      if (!isSelected) e.currentTarget.style.background = colors.cardHover;
                    }}
                    onMouseLeave={(e) => {
                      if (!isSelected) e.currentTarget.style.background = colors.cardBg;
                    }}
                    role="radio"
                    aria-checked={isSelected}
                    aria-label={hand.label}
                  >
                    <div className="text-3xl mb-2" aria-hidden="true">{hand.icon}</div>
                    <div className="text-sm font-semibold" style={{ color: colors.textPrimary }}>
                      {hand.label}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {renderToggle(
            'Mirror Camera View',
            preferences.mirrorCameraView,
            (value) => setPreferences({ ...preferences, mirrorCameraView: value }),
            'Flip the camera horizontally for easier signing',
            'Toggle mirror camera view'
          )}
        </section>

        {/* Tracking Sensitivity Section */}
        <section aria-labelledby="tracking-heading" className="mb-6">
          <div className="flex items-center gap-2 mb-4">
            <Sliders className="w-5 h-5" style={{ color: colors.iconColor }} aria-hidden="true" />
            <h2 id="tracking-heading" className="text-lg font-semibold" style={{ color: colors.textPrimary }}>
              AR Hand Tracking
            </h2>
          </div>

          <div 
            className="rounded-xl p-4 mb-4"
            style={{
              background: colors.cardBg,
              backdropFilter: colors.blur,
              WebkitBackdropFilter: colors.blur,
              border: colors.glassBorder,
              boxShadow: colors.shadow,
            }}
          >
            {renderSlider(
              'Tracking Sensitivity',
              preferences.handTrackingSensitivity,
              (value) => setPreferences({ ...preferences, handTrackingSensitivity: value }),
              0,
              100,
              'Hand tracking sensitivity',
              'Higher values detect smaller hand movements'
            )}
          </div>

          <div 
            className="rounded-xl p-4 mb-4"
            style={{
              background: colors.cardBg,
              backdropFilter: colors.blur,
              WebkitBackdropFilter: colors.blur,
              border: colors.glassBorder,
              boxShadow: colors.shadow,
            }}
          >
            {renderSlider(
              'Confidence Threshold',
              preferences.confidenceThreshold,
              (value) => setPreferences({ ...preferences, confidenceThreshold: value }),
              0,
              100,
              'Confidence threshold',
              'Minimum accuracy required to recognize a sign'
            )}
          </div>

          <div className="mb-4">
            <label className="text-sm font-semibold mb-3 block" style={{ color: colors.textPrimary }}>
              Gesture Recognition Speed
            </label>
            <div className="grid grid-cols-3 gap-2" role="radiogroup" aria-label="Gesture recognition speed">
              {[
                { id: 'slow', label: 'Slow', description: 'Extra time to complete signs' },
                { id: 'medium', label: 'Medium', description: 'Standard timing' },
                { id: 'fast', label: 'Fast', description: 'Quick recognition' },
              ].map((speed) => {
                const isSelected = preferences.gestureRecognitionSpeed === speed.id;
                
                return (
                  <button
                    key={speed.id}
                    onClick={() => setPreferences({ ...preferences, gestureRecognitionSpeed: speed.id as any })}
                    className="rounded-xl p-4 text-center transition-all"
                    style={{
                      background: isSelected ? colors.iconBg : colors.cardBg,
                      backdropFilter: colors.blur,
                      WebkitBackdropFilter: colors.blur,
                      border: isSelected ? `2px solid ${colors.iconColor}` : colors.glassBorder,
                      boxShadow: colors.shadow,
                    }}
                    onMouseEnter={(e) => {
                      if (!isSelected) e.currentTarget.style.background = colors.cardHover;
                    }}
                    onMouseLeave={(e) => {
                      if (!isSelected) e.currentTarget.style.background = colors.cardBg;
                    }}
                    role="radio"
                    aria-checked={isSelected}
                    aria-label={`${speed.label}, ${speed.description}`}
                  >
                    <div className="font-semibold mb-1 text-sm" style={{ color: colors.textPrimary }}>
                      {speed.label}
                    </div>
                    <div className="text-xs" style={{ color: colors.textSecondary }}>
                      {speed.description}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </section>

        {/* Subtitle Preferences Section */}
        <section aria-labelledby="subtitles-heading" className="mb-6">
          <div className="flex items-center gap-2 mb-4">
            <Captions className="w-5 h-5" style={{ color: colors.iconColor }} aria-hidden="true" />
            <h2 id="subtitles-heading" className="text-lg font-semibold" style={{ color: colors.textPrimary }}>
              Subtitles & Captions
            </h2>
          </div>

          {renderToggle(
            'Enable Subtitles',
            preferences.subtitlesEnabled,
            (value) => setPreferences({ ...preferences, subtitlesEnabled: value }),
            'Show text descriptions during video lessons',
            'Toggle subtitles'
          )}

          {renderToggle(
            'Enable Closed Captions',
            preferences.captionsEnabled,
            (value) => setPreferences({ ...preferences, captionsEnabled: value }),
            'Show detailed captions including sound effects',
            'Toggle closed captions'
          )}

          {(preferences.subtitlesEnabled || preferences.captionsEnabled) && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
            >
              {/* Subtitle Size */}
              <div className="mb-4">
                <label className="text-sm font-semibold mb-3 block" style={{ color: colors.textPrimary }}>
                  Subtitle Size
                </label>
                <div className="grid grid-cols-2 gap-2" role="radiogroup" aria-label="Subtitle size">
                  {[
                    { id: 'small', label: 'Small', size: '14px' },
                    { id: 'medium', label: 'Medium', size: '16px' },
                    { id: 'large', label: 'Large', size: '18px' },
                    { id: 'extra-large', label: 'Extra Large', size: '20px' },
                  ].map((size) => {
                    const isSelected = preferences.subtitleSize === size.id;
                    
                    return (
                      <button
                        key={size.id}
                        onClick={() => setPreferences({ ...preferences, subtitleSize: size.id as any })}
                        className="rounded-xl p-3 text-center transition-all"
                        style={{
                          background: isSelected ? colors.iconBg : colors.cardBg,
                          backdropFilter: colors.blur,
                          WebkitBackdropFilter: colors.blur,
                          border: isSelected ? `2px solid ${colors.iconColor}` : colors.glassBorder,
                          boxShadow: colors.shadow,
                        }}
                        onMouseEnter={(e) => {
                          if (!isSelected) e.currentTarget.style.background = colors.cardHover;
                        }}
                        onMouseLeave={(e) => {
                          if (!isSelected) e.currentTarget.style.background = colors.cardBg;
                        }}
                        role="radio"
                        aria-checked={isSelected}
                        aria-label={`${size.label} subtitle size, ${size.size}`}
                      >
                        <div className="font-semibold mb-1 text-sm" style={{ color: colors.textPrimary }}>
                          {size.label}
                        </div>
                        <div className="text-xs" style={{ color: colors.textSecondary }}>
                          {size.size}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {renderToggle(
                'Subtitle Background',
                preferences.subtitleBackground,
                (value) => setPreferences({ ...preferences, subtitleBackground: value }),
                'Show semi-transparent background behind subtitles',
                'Toggle subtitle background'
              )}

              {/* Subtitle Language */}
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
                <label 
                  htmlFor="subtitle-language"
                  className="text-sm font-semibold mb-2 block" 
                  style={{ color: colors.textPrimary }}
                >
                  Subtitle Language
                </label>
                <select
                  id="subtitle-language"
                  value={preferences.subtitleLanguage}
                  onChange={(e) => setPreferences({ ...preferences, subtitleLanguage: e.target.value })}
                  className="w-full rounded-lg p-3 text-sm"
                  style={{
                    background: colors.cardHover,
                    color: colors.textPrimary,
                    border: colors.glassBorder,
                  }}
                  aria-label="Select subtitle language"
                >
                  <option value="en">English</option>
                  <option value="es">Spanish</option>
                  <option value="fr">French</option>
                  <option value="de">German</option>
                  <option value="it">Italian</option>
                  <option value="pt">Portuguese</option>
                  <option value="ja">Japanese</option>
                  <option value="zh">Chinese</option>
                </select>
              </div>
            </motion.div>
          )}
        </section>

        {/* Info Card */}
        <motion.div
          className="rounded-xl p-4"
          style={{
            background: colors.iconBg,
            border: colors.glassBorder,
          }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-start gap-3">
            <Info className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: colors.iconColor }} aria-hidden="true" />
            <div>
              <div className="font-semibold mb-1 text-sm" style={{ color: colors.textPrimary }}>
                Accessibility Features
              </div>
              <div className="text-xs" style={{ color: colors.textSecondary }}>
                These settings help customize Sign Learn AR for your individual needs. All features comply with WCAG 2.1 Level AA standards.
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Bottom Actions */}
      <div 
        className="p-4 sm:p-6 border-t"
        style={{ borderTopColor: colors.border }}
      >
        <div className="space-y-3">
          <Button
            onClick={handleSave}
            className="w-full h-12 rounded-full font-semibold"
            style={{
              background: colors.iconColor,
              color: theme === 'dark' ? 'var(--color-bg-deep)' : '#FFFFFF',
            }}
            aria-label="Save accessibility settings"
          >
            Save Settings
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
      </div>

      {/* Save Confirmation Toast */}
      <AnimatePresence>
        {showSaveConfirmation && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-24 left-1/2 -translate-x-1/2 z-50"
          >
            <div 
              className="rounded-full px-6 py-3 flex items-center gap-2 shadow-lg"
              style={{ background: colors.successColor }}
              role="status"
              aria-live="polite"
            >
              <Check className="w-5 h-5 text-white" aria-hidden="true" />
              <span className="text-white font-semibold">
                Settings Saved!
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
