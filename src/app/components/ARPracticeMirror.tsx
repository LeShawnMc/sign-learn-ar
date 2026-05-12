import { useState, useEffect, useRef } from 'react';
import { Button } from './ui/button';
import { useTheme } from '../context/ThemeContext';
import { useApp } from '../context/AppContext';
import { 
  X, 
  Camera,
  Video,
  Play,
  Pause,
  RotateCcw,
  Download,
  Trash2,
  Check,
  AlertCircle,
  Hand,
  Maximize2,
  Minimize2,
  Settings,
  ChevronRight,
  ChevronLeft,
  FastForward,
  Rewind,
  Square,
  Circle,
  Eye,
  EyeOff,
  Volume2,
  VolumeX,
  Zap,
  Target,
  TrendingUp,
  BarChart3,
  Clock,
  Award,
  Info,
  Grid3x3,
  Crosshair,
} from 'lucide-react';

interface ARPracticeMirrorProps {
  onExit: () => void;
  signToLearn?: string;
}

interface HandTrackingPoint {
  id: string;
  name: string;
  x: number;
  y: number;
  confidence: number;
}

interface FeedbackData {
  accuracy: number;
  handPosition: 'correct' | 'too-high' | 'too-low' | 'too-left' | 'too-right';
  handShape: 'correct' | 'incorrect';
  movement: 'correct' | 'too-fast' | 'too-slow';
  overall: 'excellent' | 'good' | 'needs-improvement';
}

interface RecordedSession {
  id: string;
  sign: string;
  duration: number;
  timestamp: string;
  accuracy: number;
  thumbnailTime: number;
  feedbackHistory: FeedbackData[];
}

export function ARPracticeMirror({ 
  onExit,
  signToLearn = 'Hello',
}: ARPracticeMirrorProps) {
  const { theme } = useTheme();
  const { userProgress } = useApp();
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Camera & Mirror States
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [cameraPermission, setCameraPermission] = useState<'granted' | 'denied' | 'prompt'>('prompt');
  const [isLoading, setIsLoading] = useState(false);
  const [isMirrored, setIsMirrored] = useState(true);

  // Recording States
  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [recordedSessions, setRecordedSessions] = useState<RecordedSession[]>([
    {
      id: 'session-1',
      sign: 'Hello',
      duration: 8.5,
      timestamp: '2 hours ago',
      accuracy: 92,
      thumbnailTime: 4.2,
      feedbackHistory: [],
    },
    {
      id: 'session-2',
      sign: 'Thank You',
      duration: 6.3,
      timestamp: 'Yesterday',
      accuracy: 87,
      thumbnailTime: 3.1,
      feedbackHistory: [],
    },
    {
      id: 'session-3',
      sign: 'Please',
      duration: 5.8,
      timestamp: '2 days ago',
      accuracy: 95,
      thumbnailTime: 2.9,
      feedbackHistory: [],
    },
  ]);

  // Playback States
  const [selectedSession, setSelectedSession] = useState<RecordedSession | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackTime, setPlaybackTime] = useState(0);
  const [playbackSpeed, setPlaybackSpeed] = useState(1.0);

  // Hand Tracking States
  const [handTrackingEnabled, setHandTrackingEnabled] = useState(true);
  const [showHandPoints, setShowHandPoints] = useState(true);
  const [showGrid, setShowGrid] = useState(false);
  const [handPoints, setHandPoints] = useState<HandTrackingPoint[]>([
    { id: 'wrist', name: 'Wrist', x: 50, y: 60, confidence: 0.98 },
    { id: 'thumb-tip', name: 'Thumb Tip', x: 45, y: 45, confidence: 0.95 },
    { id: 'index-tip', name: 'Index Finger', x: 52, y: 35, confidence: 0.97 },
    { id: 'middle-tip', name: 'Middle Finger', x: 55, y: 32, confidence: 0.96 },
    { id: 'ring-tip', name: 'Ring Finger', x: 58, y: 35, confidence: 0.94 },
    { id: 'pinky-tip', name: 'Pinky', x: 61, y: 40, confidence: 0.93 },
  ]);

  // Feedback States
  const [currentFeedback, setCurrentFeedback] = useState<FeedbackData>({
    accuracy: 88,
    handPosition: 'correct',
    handShape: 'correct',
    movement: 'correct',
    overall: 'good',
  });
  const [showFeedback, setShowFeedback] = useState(true);

  // Settings States
  const [showSettings, setShowSettings] = useState(false);
  const [confidenceThreshold, setConfidenceThreshold] = useState(0.7);
  const [feedbackSensitivity, setFeedbackSensitivity] = useState(0.8);
  const [showConfidenceScores, setShowConfidenceScores] = useState(true);
  const [audioFeedback, setAudioFeedback] = useState(true);

  // UI States
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Simulate recording timer
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRecording && !isPaused) {
      interval = setInterval(() => {
        setRecordingTime(prev => prev + 0.1);
        // Simulate feedback changes
        setCurrentFeedback({
          accuracy: Math.floor(85 + Math.random() * 15),
          handPosition: Math.random() > 0.8 ? 'too-high' : 'correct',
          handShape: Math.random() > 0.9 ? 'incorrect' : 'correct',
          movement: Math.random() > 0.85 ? 'too-fast' : 'correct',
          overall: Math.random() > 0.7 ? 'good' : 'excellent',
        });
      }, 100);
    }
    return () => clearInterval(interval);
  }, [isRecording, isPaused]);

  // Simulate playback timer
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying && selectedSession) {
      interval = setInterval(() => {
        setPlaybackTime(prev => {
          const newTime = prev + (0.1 * playbackSpeed);
          if (newTime >= selectedSession.duration) {
            setIsPlaying(false);
            return selectedSession.duration;
          }
          return newTime;
        });
      }, 100);
    }
    return () => clearInterval(interval);
  }, [isPlaying, selectedSession, playbackSpeed]);

  const handleActivateCamera = async () => {
    setIsLoading(true);
    // Simulate camera activation
    setTimeout(() => {
      setCameraPermission('granted');
      setIsCameraActive(true);
      setIsLoading(false);
    }, 1500);
  };

  const handleStartRecording = () => {
    setIsRecording(true);
    setRecordingTime(0);
    setIsPaused(false);
  };

  const handlePauseRecording = () => {
    setIsPaused(!isPaused);
  };

  const handleStopRecording = () => {
    if (recordingTime > 0) {
      const newSession: RecordedSession = {
        id: `session-${Date.now()}`,
        sign: signToLearn,
        duration: recordingTime,
        timestamp: 'Just now',
        accuracy: currentFeedback.accuracy,
        thumbnailTime: recordingTime / 2,
        feedbackHistory: [currentFeedback],
      };
      setRecordedSessions([newSession, ...recordedSessions]);
    }
    setIsRecording(false);
    setIsPaused(false);
    setRecordingTime(0);
  };

  const handlePlaySession = (session: RecordedSession) => {
    setSelectedSession(session);
    setPlaybackTime(0);
    setIsPlaying(true);
  };

  const handleDeleteSession = (sessionId: string) => {
    setRecordedSessions(recordedSessions.filter(s => s.id !== sessionId));
    if (selectedSession?.id === sessionId) {
      setSelectedSession(null);
      setIsPlaying(false);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    const ms = Math.floor((seconds % 1) * 10);
    return `${mins}:${secs.toString().padStart(2, '0')}.${ms}`;
  };

  const getFeedbackColor = (type: string) => {
    if (type === 'correct' || type === 'excellent') return colors.successColor;
    if (type === 'good') return colors.iconColor;
    return colors.warningColor;
  };

  const getFeedbackMessage = () => {
    const messages: string[] = [];
    if (currentFeedback.handPosition !== 'correct') {
      messages.push(`Move hand ${currentFeedback.handPosition.replace('too-', '')}`);
    }
    if (currentFeedback.handShape === 'incorrect') {
      messages.push('Adjust hand shape');
    }
    if (currentFeedback.movement !== 'correct') {
      messages.push(`Movement is ${currentFeedback.movement.replace('too-', '')}`);
    }
    if (messages.length === 0) {
      return 'Perfect! Keep going!';
    }
    return messages.join(' • ');
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

  // Camera not activated view
  if (!isCameraActive) {
    return (
      <div 
        className="h-full flex flex-col"
        style={{ background: colors.bg, color: colors.textPrimary }}
        role="main"
        aria-labelledby="mirror-activation-title"
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
              aria-label="Exit AR practice mirror"
              className="flex-shrink-0"
            >
              <X className="w-6 h-6" />
            </Button>
            <div className="flex-1 min-w-0">
              <h1 
                id="mirror-activation-title" 
                className="text-xl sm:text-2xl font-bold truncate"
                style={{ fontFamily: 'Poppins, sans-serif' }}
              >
                AR Practice Mirror
              </h1>
              <p className="text-sm truncate" style={{ color: colors.textSecondary }}>
                Practice "{signToLearn}" with real-time feedback
              </p>
            </div>
          </div>
        </div>

        {/* Activation Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6">
          <div className="max-w-md mx-auto">
            {/* Camera Preview Placeholder */}
            <div 
              className="rounded-2xl p-8 mb-6 aspect-[3/4] flex flex-col items-center justify-center"
              style={{
                background: colors.cardBg,
                backdropFilter: colors.blur,
                WebkitBackdropFilter: colors.blur,
                border: colors.glassBorder,
                boxShadow: colors.shadow,
              }}
            >
              <div 
                className="w-24 h-24 rounded-full flex items-center justify-center mb-6"
                style={{ background: colors.iconBg }}
                aria-hidden="true"
              >
                <Camera className="w-12 h-12" style={{ color: colors.iconColor }} />
              </div>
              <h2 className="text-xl font-bold mb-3" style={{ color: colors.textPrimary }}>
                Activate Camera
              </h2>
              <p className="text-center text-sm mb-6" style={{ color: colors.textSecondary }}>
                Enable your camera to see yourself practice signs with real-time hand tracking and feedback
              </p>
              
              <Button
                onClick={handleActivateCamera}
                disabled={isLoading}
                className="w-full h-12 rounded-xl font-semibold"
                style={{ 
                  background: colors.iconColor,
                  color: theme === 'dark' ? '#0F0F23' : '#FFFFFF',
                }}
                aria-label="Activate camera for practice"
              >
                {isLoading ? (
                  <>
                    <Circle className="w-5 h-5 mr-2 animate-spin" />
                    Activating Camera...
                  </>
                ) : (
                  <>
                    <Camera className="w-5 h-5 mr-2" />
                    Activate Camera
                  </>
                )}
              </Button>
            </div>

            {/* Features List */}
            <div className="space-y-3">
              <h3 className="text-lg font-semibold mb-4" style={{ color: colors.textPrimary }}>
                Mirror Features
              </h3>

              <div 
                className="rounded-xl p-4 flex items-start gap-3"
                style={{
                  background: colors.cardBg,
                  backdropFilter: colors.blur,
                  WebkitBackdropFilter: colors.blur,
                  border: colors.glassBorder,
                }}
              >
                <div 
                  className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                  style={{ background: colors.successBg }}
                  aria-hidden="true"
                >
                  <Hand className="w-5 h-5" style={{ color: colors.successColor }} />
                </div>
                <div>
                  <div className="font-semibold mb-1" style={{ color: colors.textPrimary }}>
                    Hand Tracking Overlay
                  </div>
                  <p className="text-sm" style={{ color: colors.textSecondary }}>
                    See your hand positions tracked in real-time with accuracy scores
                  </p>
                </div>
              </div>

              <div 
                className="rounded-xl p-4 flex items-start gap-3"
                style={{
                  background: colors.cardBg,
                  backdropFilter: colors.blur,
                  WebkitBackdropFilter: colors.blur,
                  border: colors.glassBorder,
                }}
              >
                <div 
                  className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                  style={{ background: colors.iconBg }}
                  aria-hidden="true"
                >
                  <Target className="w-5 h-5" style={{ color: colors.iconColor }} />
                </div>
                <div>
                  <div className="font-semibold mb-1" style={{ color: colors.textPrimary }}>
                    Live Feedback
                  </div>
                  <p className="text-sm" style={{ color: colors.textSecondary }}>
                    Get instant corrections on hand position, shape, and movement
                  </p>
                </div>
              </div>

              <div 
                className="rounded-xl p-4 flex items-start gap-3"
                style={{
                  background: colors.cardBg,
                  backdropFilter: colors.blur,
                  WebkitBackdropFilter: colors.blur,
                  border: colors.glassBorder,
                }}
              >
                <div 
                  className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                  style={{ background: colors.accentBg }}
                  aria-hidden="true"
                >
                  <Video className="w-5 h-5" style={{ color: colors.accentColor }} />
                </div>
                <div>
                  <div className="font-semibold mb-1" style={{ color: colors.textPrimary }}>
                    Session Recording
                  </div>
                  <p className="text-sm" style={{ color: colors.textSecondary }}>
                    Record your practice and review with slow-motion playback
                  </p>
                </div>
              </div>

              <div 
                className="rounded-xl p-4 flex items-start gap-3"
                style={{
                  background: colors.cardBg,
                  backdropFilter: colors.blur,
                  WebkitBackdropFilter: colors.blur,
                  border: colors.glassBorder,
                }}
              >
                <div 
                  className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                  style={{ background: colors.warningBg }}
                  aria-hidden="true"
                >
                  <FastForward className="w-5 h-5" style={{ color: colors.warningColor }} />
                </div>
                <div>
                  <div className="font-semibold mb-1" style={{ color: colors.textPrimary }}>
                    Slow-Motion Controls
                  </div>
                  <p className="text-sm" style={{ color: colors.textSecondary }}>
                    Review your signs at 0.25x, 0.5x, 1x, or 2x speed
                  </p>
                </div>
              </div>
            </div>

            {/* Privacy Notice */}
            <div 
              className="rounded-xl p-4 flex items-start gap-3 mt-6"
              style={{
                background: colors.iconBg,
                border: colors.glassBorder,
              }}
            >
              <Info className="w-5 h-5 flex-shrink-0" style={{ color: colors.iconColor }} aria-hidden="true" />
              <div className="text-xs" style={{ color: colors.textSecondary }}>
                <strong style={{ color: colors.textPrimary }}>Privacy:</strong> All camera processing happens on your device. 
                Videos are stored locally and never uploaded unless you choose to share them.
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Main Mirror Interface (Camera Active)
  return (
    <div 
      className="h-full flex flex-col"
      style={{ background: colors.bg, color: colors.textPrimary }}
      role="main"
      aria-labelledby="mirror-main-title"
    >
      {/* Header */}
      <div 
        className="p-3 border-b flex items-center gap-2"
        style={{ borderBottomColor: colors.border }}
      >
        <Button
          variant="ghost"
          size="icon"
          onClick={onExit}
          style={{ color: colors.textSecondary }}
          aria-label="Exit AR practice mirror"
          className="flex-shrink-0"
        >
          <X className="w-5 h-5" />
        </Button>
        <div className="flex-1 min-w-0">
          <h1 
            id="mirror-main-title" 
            className="text-base font-bold truncate"
            style={{ fontFamily: 'Poppins, sans-serif' }}
          >
            Practicing: {signToLearn}
          </h1>
        </div>
        <button
          onClick={() => setShowSettings(!showSettings)}
          className="p-2 rounded-lg flex-shrink-0"
          style={{ background: showSettings ? colors.iconBg : 'transparent' }}
          aria-label="Toggle settings"
          aria-pressed={showSettings}
        >
          <Settings className="w-5 h-5" style={{ color: colors.iconColor }} />
        </button>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto">
        {/* Camera/Mirror View */}
        <section aria-labelledby="mirror-view-heading" className="p-4">
          <h2 id="mirror-view-heading" className="sr-only">Mirror view with hand tracking</h2>
          
          <div className="relative rounded-2xl overflow-hidden aspect-[3/4] mb-4" style={{ background: '#000' }}>
            {/* Simulated Camera Feed */}
            <div 
              className="absolute inset-0 flex items-center justify-center"
              style={{
                background: 'linear-gradient(135deg, #1E3A8A 0%, #7C3AED 50%, #DB2777 100%)',
                transform: isMirrored ? 'scaleX(-1)' : 'none',
              }}
            >
              <div className="text-center text-white/50">
                <Camera className="w-16 h-16 mx-auto mb-2" />
                <div className="text-sm">Camera Feed</div>
              </div>
            </div>

            {/* Grid Overlay */}
            {showGrid && (
              <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
                <Grid3x3 className="w-full h-full text-white/20" strokeWidth={1} />
              </div>
            )}

            {/* Hand Tracking Points */}
            {handTrackingEnabled && showHandPoints && handPoints.map((point) => (
              <div
                key={point.id}
                className="absolute w-3 h-3 rounded-full transition-all"
                style={{
                  left: `${point.x}%`,
                  top: `${point.y}%`,
                  background: point.confidence > confidenceThreshold ? colors.successColor : colors.warningColor,
                  boxShadow: `0 0 8px ${point.confidence > confidenceThreshold ? colors.successColor : colors.warningColor}`,
                  transform: 'translate(-50%, -50%)',
                }}
                role="status"
                aria-label={`${point.name} tracked at ${Math.round(point.confidence * 100)}% confidence`}
              >
                {showConfidenceScores && (
                  <div 
                    className="absolute top-full left-1/2 -translate-x-1/2 mt-1 text-[10px] font-bold whitespace-nowrap px-1 rounded"
                    style={{ 
                      background: 'rgba(0,0,0,0.7)',
                      color: '#fff',
                    }}
                  >
                    {Math.round(point.confidence * 100)}%
                  </div>
                )}
              </div>
            ))}

            {/* Live Feedback Overlay */}
            {showFeedback && !selectedSession && (
              <div 
                className="absolute top-4 left-4 right-4 rounded-xl p-3"
                style={{
                  background: 'rgba(0, 0, 0, 0.7)',
                  backdropFilter: 'blur(10px)',
                }}
                role="status"
                aria-live="polite"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Zap className="w-4 h-4" style={{ color: getFeedbackColor(currentFeedback.overall) }} aria-hidden="true" />
                    <span className="text-sm font-semibold text-white">
                      {currentFeedback.accuracy}% Accurate
                    </span>
                  </div>
                  <span 
                    className="text-xs px-2 py-1 rounded-full font-semibold"
                    style={{ 
                      background: getFeedbackColor(currentFeedback.overall) + '40',
                      color: getFeedbackColor(currentFeedback.overall),
                    }}
                  >
                    {currentFeedback.overall.toUpperCase()}
                  </span>
                </div>
                <div className="text-xs text-white/80">
                  {getFeedbackMessage()}
                </div>
              </div>
            )}

            {/* Recording Indicator */}
            {isRecording && (
              <div 
                className="absolute top-4 right-4 px-3 py-2 rounded-xl flex items-center gap-2"
                style={{
                  background: 'rgba(239, 68, 68, 0.9)',
                }}
                role="status"
                aria-live="polite"
                aria-label={`Recording ${formatTime(recordingTime)}`}
              >
                <div className={`w-3 h-3 rounded-full bg-white ${isPaused ? '' : 'animate-pulse'}`} aria-hidden="true" />
                <span className="text-sm font-bold text-white">
                  {formatTime(recordingTime)}
                </span>
              </div>
            )}

            {/* Playback Controls Overlay */}
            {selectedSession && (
              <div className="absolute inset-0 flex items-end">
                <div 
                  className="w-full p-4"
                  style={{
                    background: 'linear-gradient(to top, rgba(0,0,0,0.8), transparent)',
                  }}
                >
                  {/* Playback Progress */}
                  <div className="mb-3">
                    <input
                      type="range"
                      min="0"
                      max={selectedSession.duration}
                      step="0.1"
                      value={playbackTime}
                      onChange={(e) => setPlaybackTime(parseFloat(e.target.value))}
                      className="w-full h-1 rounded-full appearance-none cursor-pointer"
                      style={{
                        background: `linear-gradient(to right, ${colors.iconColor} 0%, ${colors.iconColor} ${(playbackTime / selectedSession.duration) * 100}%, rgba(255,255,255,0.3) ${(playbackTime / selectedSession.duration) * 100}%, rgba(255,255,255,0.3) 100%)`,
                      }}
                      aria-label="Playback progress"
                      aria-valuemin={0}
                      aria-valuemax={selectedSession.duration}
                      aria-valuenow={playbackTime}
                      aria-valuetext={`${formatTime(playbackTime)} of ${formatTime(selectedSession.duration)}`}
                    />
                    <div className="flex items-center justify-between text-xs text-white mt-1">
                      <span>{formatTime(playbackTime)}</span>
                      <span>{formatTime(selectedSession.duration)}</span>
                    </div>
                  </div>

                  {/* Playback Buttons */}
                  <div className="flex items-center justify-center gap-3">
                    <button
                      onClick={() => setPlaybackTime(Math.max(0, playbackTime - 5))}
                      className="w-10 h-10 rounded-full flex items-center justify-center"
                      style={{ background: 'rgba(255,255,255,0.2)' }}
                      aria-label="Rewind 5 seconds"
                    >
                      <Rewind className="w-5 h-5 text-white" />
                    </button>

                    <button
                      onClick={() => setIsPlaying(!isPlaying)}
                      className="w-14 h-14 rounded-full flex items-center justify-center"
                      style={{ background: colors.iconColor }}
                      aria-label={isPlaying ? 'Pause playback' : 'Play recording'}
                    >
                      {isPlaying ? (
                        <Pause className="w-6 h-6" style={{ color: theme === 'dark' ? '#0F0F23' : '#FFFFFF' }} />
                      ) : (
                        <Play className="w-6 h-6 ml-1" style={{ color: theme === 'dark' ? '#0F0F23' : '#FFFFFF' }} />
                      )}
                    </button>

                    <button
                      onClick={() => setPlaybackTime(Math.min(selectedSession.duration, playbackTime + 5))}
                      className="w-10 h-10 rounded-full flex items-center justify-center"
                      style={{ background: 'rgba(255,255,255,0.2)' }}
                      aria-label="Forward 5 seconds"
                    >
                      <FastForward className="w-5 h-5 text-white" />
                    </button>

                    <button
                      onClick={() => {
                        setSelectedSession(null);
                        setIsPlaying(false);
                        setPlaybackTime(0);
                      }}
                      className="w-10 h-10 rounded-full flex items-center justify-center"
                      style={{ background: 'rgba(255,255,255,0.2)' }}
                      aria-label="Close playback"
                    >
                      <X className="w-5 h-5 text-white" />
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Mirror Controls */}
          <div className="grid grid-cols-2 gap-3 mb-4">
            {!isRecording && !selectedSession && (
              <Button
                onClick={handleStartRecording}
                className="h-12 rounded-xl font-semibold"
                style={{ 
                  background: colors.errorColor,
                  color: '#FFFFFF',
                }}
                aria-label="Start recording practice session"
              >
                <Circle className="w-5 h-5 mr-2 fill-current" />
                Record
              </Button>
            )}

            {isRecording && (
              <>
                <Button
                  onClick={handlePauseRecording}
                  className="h-12 rounded-xl font-semibold"
                  style={{ 
                    background: colors.warningColor,
                    color: theme === 'dark' ? '#0F0F23' : '#FFFFFF',
                  }}
                  aria-label={isPaused ? 'Resume recording' : 'Pause recording'}
                >
                  {isPaused ? <Play className="w-5 h-5 mr-2" /> : <Pause className="w-5 h-5 mr-2" />}
                  {isPaused ? 'Resume' : 'Pause'}
                </Button>
                <Button
                  onClick={handleStopRecording}
                  className="h-12 rounded-xl font-semibold"
                  style={{ 
                    background: colors.errorColor,
                    color: '#FFFFFF',
                  }}
                  aria-label="Stop and save recording"
                >
                  <Square className="w-5 h-5 mr-2 fill-current" />
                  Stop
                </Button>
              </>
            )}

            {!isRecording && !selectedSession && (
              <button
                onClick={() => setIsMirrored(!isMirrored)}
                className="h-12 rounded-xl font-semibold flex items-center justify-center gap-2"
                style={{
                  background: colors.cardBg,
                  backdropFilter: colors.blur,
                  WebkitBackdropFilter: colors.blur,
                  border: colors.glassBorder,
                  color: colors.textPrimary,
                }}
                aria-label={isMirrored ? 'Disable mirror mode' : 'Enable mirror mode'}
                aria-pressed={isMirrored}
              >
                {isMirrored ? <Eye className="w-5 h-5" /> : <EyeOff className="w-5 h-5" />}
                {isMirrored ? 'Mirrored' : 'Normal'}
              </button>
            )}
          </div>

          {/* Speed Control (when playing recording) */}
          {selectedSession && (
            <div 
              className="rounded-xl p-4 mb-4"
              style={{
                background: colors.cardBg,
                backdropFilter: colors.blur,
                WebkitBackdropFilter: colors.blur,
                border: colors.glassBorder,
              }}
            >
              <div className="flex items-center justify-between mb-3">
                <label htmlFor="playback-speed" className="text-sm font-semibold" style={{ color: colors.textPrimary }}>
                  Playback Speed
                </label>
                <span className="text-sm font-bold" style={{ color: colors.iconColor }}>
                  {playbackSpeed}x
                </span>
              </div>
              <input
                id="playback-speed"
                type="range"
                min="0.25"
                max="2"
                step="0.25"
                value={playbackSpeed}
                onChange={(e) => setPlaybackSpeed(parseFloat(e.target.value))}
                className="w-full h-2 rounded-full appearance-none cursor-pointer"
                style={{
                  background: `linear-gradient(to right, ${colors.iconColor} 0%, ${colors.iconColor} ${((playbackSpeed - 0.25) / 1.75) * 100}%, ${colors.border} ${((playbackSpeed - 0.25) / 1.75) * 100}%, ${colors.border} 100%)`,
                }}
                aria-label="Adjust playback speed"
                aria-valuemin={0.25}
                aria-valuemax={2}
                aria-valuenow={playbackSpeed}
                aria-valuetext={`${playbackSpeed} times speed`}
              />
              <div className="flex items-center justify-between text-xs mt-1" style={{ color: colors.textTertiary }}>
                <span>0.25x</span>
                <span>Slow Motion</span>
                <span>2x</span>
              </div>
            </div>
          )}

          {/* Quick Actions */}
          <div className="grid grid-cols-4 gap-2 mb-4">
            <button
              onClick={() => setHandTrackingEnabled(!handTrackingEnabled)}
              className="rounded-lg p-3 flex flex-col items-center gap-1"
              style={{
                background: handTrackingEnabled ? colors.iconBg : colors.cardBg,
                border: handTrackingEnabled ? `1px solid ${colors.iconColor}` : colors.glassBorder,
              }}
              aria-label={handTrackingEnabled ? 'Disable hand tracking' : 'Enable hand tracking'}
              aria-pressed={handTrackingEnabled}
            >
              <Hand className="w-5 h-5" style={{ color: handTrackingEnabled ? colors.iconColor : colors.textSecondary }} />
              <span className="text-[10px]" style={{ color: colors.textSecondary }}>Tracking</span>
            </button>

            <button
              onClick={() => setShowFeedback(!showFeedback)}
              className="rounded-lg p-3 flex flex-col items-center gap-1"
              style={{
                background: showFeedback ? colors.successBg : colors.cardBg,
                border: showFeedback ? `1px solid ${colors.successColor}` : colors.glassBorder,
              }}
              aria-label={showFeedback ? 'Hide feedback' : 'Show feedback'}
              aria-pressed={showFeedback}
            >
              <Target className="w-5 h-5" style={{ color: showFeedback ? colors.successColor : colors.textSecondary }} />
              <span className="text-[10px]" style={{ color: colors.textSecondary }}>Feedback</span>
            </button>

            <button
              onClick={() => setShowGrid(!showGrid)}
              className="rounded-lg p-3 flex flex-col items-center gap-1"
              style={{
                background: showGrid ? colors.accentBg : colors.cardBg,
                border: showGrid ? `1px solid ${colors.accentColor}` : colors.glassBorder,
              }}
              aria-label={showGrid ? 'Hide grid' : 'Show grid'}
              aria-pressed={showGrid}
            >
              <Grid3x3 className="w-5 h-5" style={{ color: showGrid ? colors.accentColor : colors.textSecondary }} />
              <span className="text-[10px]" style={{ color: colors.textSecondary }}>Grid</span>
            </button>

            <button
              onClick={() => setAudioFeedback(!audioFeedback)}
              className="rounded-lg p-3 flex flex-col items-center gap-1"
              style={{
                background: audioFeedback ? colors.warningBg : colors.cardBg,
                border: audioFeedback ? `1px solid ${colors.warningColor}` : colors.glassBorder,
              }}
              aria-label={audioFeedback ? 'Mute audio feedback' : 'Enable audio feedback'}
              aria-pressed={audioFeedback}
            >
              {audioFeedback ? (
                <Volume2 className="w-5 h-5" style={{ color: colors.warningColor }} />
              ) : (
                <VolumeX className="w-5 h-5" style={{ color: colors.textSecondary }} />
              )}
              <span className="text-[10px]" style={{ color: colors.textSecondary }}>Audio</span>
            </button>
          </div>
        </section>

        {/* Settings Panel */}
        {showSettings && (
          <section aria-labelledby="settings-heading" className="px-4 pb-4">
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
              <h3 id="settings-heading" className="text-lg font-semibold mb-4" style={{ color: colors.textPrimary }}>
                Mirror Settings
              </h3>

              {/* Confidence Threshold */}
              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <label htmlFor="confidence-threshold" className="text-sm font-semibold" style={{ color: colors.textPrimary }}>
                    Confidence Threshold
                  </label>
                  <span className="text-sm font-bold" style={{ color: colors.iconColor }}>
                    {Math.round(confidenceThreshold * 100)}%
                  </span>
                </div>
                <input
                  id="confidence-threshold"
                  type="range"
                  min="0"
                  max="1"
                  step="0.1"
                  value={confidenceThreshold}
                  onChange={(e) => setConfidenceThreshold(parseFloat(e.target.value))}
                  className="w-full h-2 rounded-full appearance-none cursor-pointer"
                  style={{
                    background: `linear-gradient(to right, ${colors.successColor} 0%, ${colors.successColor} ${confidenceThreshold * 100}%, ${colors.border} ${confidenceThreshold * 100}%, ${colors.border} 100%)`,
                  }}
                  aria-label="Confidence threshold"
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-valuenow={confidenceThreshold * 100}
                  aria-valuetext={`${Math.round(confidenceThreshold * 100)} percent`}
                />
              </div>

              {/* Feedback Sensitivity */}
              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <label htmlFor="feedback-sensitivity" className="text-sm font-semibold" style={{ color: colors.textPrimary }}>
                    Feedback Sensitivity
                  </label>
                  <span className="text-sm font-bold" style={{ color: colors.iconColor }}>
                    {Math.round(feedbackSensitivity * 100)}%
                  </span>
                </div>
                <input
                  id="feedback-sensitivity"
                  type="range"
                  min="0"
                  max="1"
                  step="0.1"
                  value={feedbackSensitivity}
                  onChange={(e) => setFeedbackSensitivity(parseFloat(e.target.value))}
                  className="w-full h-2 rounded-full appearance-none cursor-pointer"
                  style={{
                    background: `linear-gradient(to right, ${colors.iconColor} 0%, ${colors.iconColor} ${feedbackSensitivity * 100}%, ${colors.border} ${feedbackSensitivity * 100}%, ${colors.border} 100%)`,
                  }}
                  aria-label="Feedback sensitivity"
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-valuenow={feedbackSensitivity * 100}
                  aria-valuetext={`${Math.round(feedbackSensitivity * 100)} percent`}
                />
              </div>

              {/* Toggles */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm font-semibold" style={{ color: colors.textPrimary }}>
                      Show Hand Points
                    </div>
                    <div className="text-xs" style={{ color: colors.textSecondary }}>
                      Display tracking points on hands
                    </div>
                  </div>
                  <button
                    onClick={() => setShowHandPoints(!showHandPoints)}
                    className="relative w-12 h-6 rounded-full transition-colors ml-3 flex-shrink-0"
                    style={{ 
                      background: showHandPoints ? colors.iconColor : colors.border,
                    }}
                    role="switch"
                    aria-checked={showHandPoints}
                    aria-label="Toggle hand points display"
                  >
                    <div 
                      className="absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white transition-transform"
                      style={{
                        transform: showHandPoints ? 'translateX(24px)' : 'translateX(0)',
                      }}
                    />
                  </button>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm font-semibold" style={{ color: colors.textPrimary }}>
                      Show Confidence Scores
                    </div>
                    <div className="text-xs" style={{ color: colors.textSecondary }}>
                      Display accuracy percentages
                    </div>
                  </div>
                  <button
                    onClick={() => setShowConfidenceScores(!showConfidenceScores)}
                    className="relative w-12 h-6 rounded-full transition-colors ml-3 flex-shrink-0"
                    style={{ 
                      background: showConfidenceScores ? colors.iconColor : colors.border,
                    }}
                    role="switch"
                    aria-checked={showConfidenceScores}
                    aria-label="Toggle confidence scores"
                  >
                    <div 
                      className="absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white transition-transform"
                      style={{
                        transform: showConfidenceScores ? 'translateX(24px)' : 'translateX(0)',
                      }}
                    />
                  </button>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Recorded Sessions */}
        <section aria-labelledby="recorded-sessions-heading" className="px-4 pb-6">
          <h2 id="recorded-sessions-heading" className="text-lg font-semibold mb-4" style={{ color: colors.textPrimary }}>
            Recorded Sessions
          </h2>

          {recordedSessions.length === 0 ? (
            <div 
              className="rounded-xl p-8 text-center"
              style={{
                background: colors.cardBg,
                backdropFilter: colors.blur,
                WebkitBackdropFilter: colors.blur,
                border: colors.glassBorder,
              }}
            >
              <Video className="w-12 h-12 mx-auto mb-3" style={{ color: colors.textSecondary }} aria-hidden="true" />
              <p className="text-sm" style={{ color: colors.textSecondary }}>
                No recordings yet. Start practicing and record your sessions!
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {recordedSessions.map((session) => (
                <div
                  key={session.id}
                  className="rounded-xl p-4"
                  style={{
                    background: selectedSession?.id === session.id ? colors.iconBg : colors.cardBg,
                    backdropFilter: colors.blur,
                    WebkitBackdropFilter: colors.blur,
                    border: selectedSession?.id === session.id ? `2px solid ${colors.iconColor}` : colors.glassBorder,
                    boxShadow: colors.shadow,
                  }}
                >
                  <div className="flex items-start gap-3 mb-3">
                    {/* Thumbnail */}
                    <div 
                      className="w-20 h-20 rounded-lg flex items-center justify-center flex-shrink-0"
                      style={{ background: colors.iconBg }}
                      aria-hidden="true"
                    >
                      <Video className="w-8 h-8" style={{ color: colors.iconColor }} />
                    </div>

                    {/* Session Info */}
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold mb-1 truncate" style={{ color: colors.textPrimary }}>
                        {session.sign}
                      </h3>
                      <div className="flex items-center gap-2 mb-2 text-xs" style={{ color: colors.textTertiary }}>
                        <Clock className="w-3 h-3" aria-hidden="true" />
                        <span>{formatTime(session.duration)}</span>
                        <span>•</span>
                        <span>{session.timestamp}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="flex-1 h-1.5 rounded-full overflow-hidden" style={{ background: colors.border }}>
                          <div 
                            className="h-full rounded-full"
                            style={{ 
                              width: `${session.accuracy}%`,
                              background: session.accuracy >= 90 ? colors.successColor : session.accuracy >= 70 ? colors.iconColor : colors.warningColor,
                            }}
                            role="progressbar"
                            aria-valuenow={session.accuracy}
                            aria-valuemin={0}
                            aria-valuemax={100}
                            aria-label={`Session accuracy ${session.accuracy}%`}
                          />
                        </div>
                        <span className="text-xs font-semibold" style={{ color: colors.iconColor }}>
                          {session.accuracy}%
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2">
                    <Button
                      onClick={() => handlePlaySession(session)}
                      className="flex-1 h-9 rounded-lg font-semibold text-sm"
                      style={{ 
                        background: colors.iconColor,
                        color: theme === 'dark' ? '#0F0F23' : '#FFFFFF',
                      }}
                      aria-label={`Play recording of ${session.sign}`}
                    >
                      <Play className="w-4 h-4 mr-2" />
                      Play
                    </Button>
                    <button
                      className="h-9 px-4 rounded-lg font-semibold text-sm"
                      style={{ 
                        background: colors.cardHover,
                        color: colors.textPrimary,
                        border: `1px solid ${colors.border}`,
                      }}
                      aria-label={`Download ${session.sign} recording`}
                    >
                      <Download className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteSession(session.id)}
                      className="h-9 px-4 rounded-lg font-semibold text-sm"
                      style={{ 
                        background: colors.errorBg,
                        color: colors.errorColor,
                      }}
                      aria-label={`Delete ${session.sign} recording`}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
