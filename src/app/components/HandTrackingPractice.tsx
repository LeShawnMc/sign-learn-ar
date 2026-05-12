import { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { useTheme } from '../context/ThemeContext';
import { useApp } from '../context/AppContext';
import exampleImage from 'figma:asset/fada1c887705b40acc62b849ef4c37d13266fa25.png';
import { 
  X, 
  Play,
  Pause,
  RotateCcw,
  Hand,
  CheckCircle2,
  AlertCircle,
  TrendingUp,
  TrendingDown,
  Target,
  Activity,
  Zap,
  Settings,
  Info,
  Eye,
  EyeOff,
  Maximize2,
  Minimize2,
  Clock,
  Award,
  BarChart3,
  Move,
  Navigation,
  Crosshair,
  Radio,
  Wifi,
  WifiOff,
  Circle,
  Square,
  Triangle,
} from 'lucide-react';

interface HandTrackingPracticeProps {
  onExit: () => void;
}

interface HandPoint {
  id: string;
  name: string;
  position: { x: number; y: number; z: number };
  confidence: number;
}

interface TrackingMetric {
  id: string;
  name: string;
  value: number;
  trend: 'up' | 'down' | 'stable';
  status: 'good' | 'warning' | 'poor';
}

interface PathData {
  id: string;
  label: string;
  points: { x: number; y: number; time: number }[];
  color: string;
}

interface SessionStats {
  duration: number;
  attempts: number;
  avgAccuracy: number;
  bestScore: number;
  signsCompleted: number;
  streakDays: number;
}

export function HandTrackingPractice({ onExit }: HandTrackingPracticeProps) {
  const { theme } = useTheme();
  const { userProgress } = useApp();

  // Tracking State
  const [isTracking, setIsTracking] = useState(false);
  const [trackingStatus, setTrackingStatus] = useState<'excellent' | 'good' | 'poor' | 'offline'>('offline');
  const [handDetected, setHandDetected] = useState(false);
  const [confidence, setConfidence] = useState(0);

  // Hand Points (21 landmarks in MediaPipe)
  const [handPoints, setHandPoints] = useState<HandPoint[]>([
    { id: 'wrist', name: 'Wrist', position: { x: 50, y: 70, z: 0 }, confidence: 0.95 },
    { id: 'thumb_cmc', name: 'Thumb CMC', position: { x: 45, y: 65, z: 2 }, confidence: 0.93 },
    { id: 'thumb_mcp', name: 'Thumb MCP', position: { x: 42, y: 60, z: 3 }, confidence: 0.94 },
    { id: 'thumb_ip', name: 'Thumb IP', position: { x: 40, y: 55, z: 4 }, confidence: 0.92 },
    { id: 'thumb_tip', name: 'Thumb Tip', position: { x: 38, y: 50, z: 5 }, confidence: 0.91 },
    { id: 'index_mcp', name: 'Index MCP', position: { x: 50, y: 60, z: 1 }, confidence: 0.96 },
    { id: 'index_pip', name: 'Index PIP', position: { x: 50, y: 50, z: 2 }, confidence: 0.95 },
    { id: 'index_dip', name: 'Index DIP', position: { x: 50, y: 42, z: 3 }, confidence: 0.94 },
    { id: 'index_tip', name: 'Index Tip', position: { x: 50, y: 35, z: 4 }, confidence: 0.93 },
    { id: 'middle_mcp', name: 'Middle MCP', position: { x: 55, y: 60, z: 0 }, confidence: 0.97 },
    { id: 'middle_pip', name: 'Middle PIP', position: { x: 55, y: 48, z: 1 }, confidence: 0.96 },
    { id: 'middle_dip', name: 'Middle DIP', position: { x: 55, y: 38, z: 2 }, confidence: 0.95 },
    { id: 'middle_tip', name: 'Middle Tip', position: { x: 55, y: 30, z: 3 }, confidence: 0.94 },
    { id: 'ring_mcp', name: 'Ring MCP', position: { x: 58, y: 62, z: -1 }, confidence: 0.95 },
    { id: 'ring_pip', name: 'Ring PIP', position: { x: 58, y: 52, z: 0 }, confidence: 0.94 },
    { id: 'ring_dip', name: 'Ring DIP', position: { x: 58, y: 44, z: 1 }, confidence: 0.93 },
    { id: 'ring_tip', name: 'Ring Tip', position: { x: 58, y: 37, z: 2 }, confidence: 0.92 },
    { id: 'pinky_mcp', name: 'Pinky MCP', position: { x: 61, y: 64, z: -2 }, confidence: 0.93 },
    { id: 'pinky_pip', name: 'Pinky PIP', position: { x: 61, y: 56, z: -1 }, confidence: 0.92 },
    { id: 'pinky_dip', name: 'Pinky DIP', position: { x: 61, y: 50, z: 0 }, confidence: 0.91 },
    { id: 'pinky_tip', name: 'Pinky Tip', position: { x: 61, y: 45, z: 1 }, confidence: 0.90 },
  ]);

  // Real-time Metrics
  const [metrics, setMetrics] = useState<TrackingMetric[]>([
    { id: 'overall-accuracy', name: 'Overall Accuracy', value: 87, trend: 'up', status: 'good' },
    { id: 'hand-shape', name: 'Hand Shape', value: 92, trend: 'up', status: 'good' },
    { id: 'position', name: 'Position', value: 84, trend: 'stable', status: 'good' },
    { id: 'orientation', name: 'Orientation', value: 79, trend: 'down', status: 'warning' },
    { id: 'movement', name: 'Movement', value: 88, trend: 'up', status: 'good' },
    { id: 'timing', name: 'Timing', value: 81, trend: 'stable', status: 'warning' },
  ]);

  // Path Comparison
  const [showPathComparison, setShowPathComparison] = useState(true);
  const [pathData, setPathData] = useState<PathData[]>([
    {
      id: 'reference',
      label: 'Reference Path',
      points: [
        { x: 30, y: 70, time: 0 },
        { x: 40, y: 60, time: 0.5 },
        { x: 50, y: 50, time: 1.0 },
        { x: 60, y: 40, time: 1.5 },
        { x: 70, y: 30, time: 2.0 },
      ],
      color: '#00F5FF',
    },
    {
      id: 'user',
      label: 'Your Path',
      points: [
        { x: 32, y: 72, time: 0 },
        { x: 38, y: 62, time: 0.6 },
        { x: 48, y: 51, time: 1.1 },
        { x: 58, y: 42, time: 1.7 },
        { x: 68, y: 32, time: 2.2 },
      ],
      color: '#A855F7',
    },
  ]);

  // Session Statistics
  const [sessionStats, setSessionStats] = useState<SessionStats>({
    duration: 247, // seconds
    attempts: 18,
    avgAccuracy: 87,
    bestScore: 94,
    signsCompleted: 12,
    streakDays: 7,
  });

  // Calibration Settings
  const [calibrationSettings, setCalibrationSettings] = useState({
    handsTracking: true,
    gestureDetection: true,
    depthSensing: false,
    autoCalibration: true,
    sensitivity: 75,
    smoothing: 60,
    minConfidence: 70,
  });

  // Display Options
  const [showHandPoints, setShowHandPoints] = useState(true);
  const [showConfidenceScores, setShowConfidenceScores] = useState(true);
  const [showCoordinates, setShowCoordinates] = useState(false);
  const [showOverlay, setShowOverlay] = useState(true);

  // Simulate tracking updates
  useEffect(() => {
    if (isTracking) {
      const interval = setInterval(() => {
        // Update hand points with slight random variations
        setHandPoints(prev => prev.map(point => ({
          ...point,
          position: {
            x: point.position.x + (Math.random() - 0.5) * 2,
            y: point.position.y + (Math.random() - 0.5) * 2,
            z: point.position.z + (Math.random() - 0.5) * 0.5,
          },
          confidence: Math.max(0.85, Math.min(0.99, point.confidence + (Math.random() - 0.5) * 0.05)),
        })));

        // Update metrics
        setMetrics(prev => prev.map(metric => ({
          ...metric,
          value: Math.max(0, Math.min(100, metric.value + (Math.random() - 0.5) * 5)),
        })));

        // Update tracking status based on average confidence
        const avgConfidence = handPoints.reduce((sum, p) => sum + p.confidence, 0) / handPoints.length;
        setConfidence(avgConfidence * 100);
        
        if (avgConfidence > 0.9) setTrackingStatus('excellent');
        else if (avgConfidence > 0.8) setTrackingStatus('good');
        else setTrackingStatus('poor');

        setHandDetected(true);
      }, 100);

      return () => clearInterval(interval);
    } else {
      setTrackingStatus('offline');
      setHandDetected(false);
      setConfidence(0);
    }
  }, [isTracking]);

  const handleStartStop = () => {
    setIsTracking(!isTracking);
  };

  const handleReset = () => {
    setSessionStats({
      duration: 0,
      attempts: 0,
      avgAccuracy: 0,
      bestScore: 0,
      signsCompleted: 0,
      streakDays: sessionStats.streakDays,
    });
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getStatusColor = (status: string) => {
    if (status === 'excellent') return colors.successColor;
    if (status === 'good') return colors.iconColor;
    if (status === 'poor') return colors.warningColor;
    return colors.textTertiary;
  };

  const getMetricColor = (status: string) => {
    if (status === 'good') return colors.successColor;
    if (status === 'warning') return colors.warningColor;
    return colors.errorColor;
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
      aria-labelledby="tracking-title"
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
            aria-label="Exit hand tracking practice"
            className="flex-shrink-0"
          >
            <X className="w-6 h-6" />
          </Button>
          <div className="flex-1 min-w-0">
            <h1 
              id="tracking-title" 
              className="text-xl sm:text-2xl font-bold truncate"
              style={{ fontFamily: 'Poppins, sans-serif' }}
            >
              Hand Tracking Practice
            </h1>
            <p className="text-sm truncate" style={{ color: colors.textSecondary }}>
              Real-time feedback and accuracy analysis
            </p>
          </div>
        </div>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto">
        {/* Tracking Status Indicator */}
        <section aria-labelledby="status-heading" className="p-4">
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
            <div className="flex items-center justify-between mb-4">
              <h2 id="status-heading" className="text-lg font-semibold" style={{ color: colors.textPrimary }}>
                Tracking Status
              </h2>
              <div className="flex items-center gap-2">
                <div 
                  className="w-3 h-3 rounded-full animate-pulse"
                  style={{ 
                    background: getStatusColor(trackingStatus),
                    boxShadow: `0 0 10px ${getStatusColor(trackingStatus)}`,
                  }}
                  role="status"
                  aria-label={`Tracking status: ${trackingStatus}`}
                />
                <span className="text-sm font-bold capitalize" style={{ color: getStatusColor(trackingStatus) }}>
                  {trackingStatus}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div className="text-center">
                <div className="text-xs mb-1" style={{ color: colors.textTertiary }}>
                  Hand Detected
                </div>
                <div className="font-bold" style={{ color: handDetected ? colors.successColor : colors.textTertiary }}>
                  {handDetected ? 'Yes' : 'No'}
                </div>
              </div>
              <div className="text-center">
                <div className="text-xs mb-1" style={{ color: colors.textTertiary }}>
                  Confidence
                </div>
                <div className="font-bold" style={{ color: colors.iconColor }}>
                  {confidence.toFixed(0)}%
                </div>
              </div>
              <div className="text-center">
                <div className="text-xs mb-1" style={{ color: colors.textTertiary }}>
                  Points Tracked
                </div>
                <div className="font-bold" style={{ color: colors.textPrimary }}>
                  {handPoints.length}
                </div>
              </div>
            </div>

            <div className="mt-4">
              <Button
                onClick={handleStartStop}
                className="w-full h-12 rounded-xl font-semibold flex items-center justify-center gap-2"
                style={{ 
                  background: isTracking ? colors.errorColor : colors.successColor,
                  color: '#FFFFFF',
                }}
                aria-label={isTracking ? 'Stop tracking' : 'Start tracking'}
              >
                {isTracking ? (
                  <>
                    <Pause className="w-5 h-5" />
                    Stop Tracking
                  </>
                ) : (
                  <>
                    <Play className="w-5 h-5" />
                    Start Tracking
                  </>
                )}
              </Button>
            </div>
          </div>
        </section>

        {/* Hand Tracking Visualization */}
        <section aria-labelledby="visualization-heading" className="px-4 pb-4">
          <div className="flex items-center justify-between mb-3">
            <h2 id="visualization-heading" className="text-lg font-semibold" style={{ color: colors.textPrimary }}>
              Hand Visualization
            </h2>
            <div className="flex gap-2">
              <button
                onClick={() => setShowHandPoints(!showHandPoints)}
                className="p-2 rounded-lg"
                style={{ background: showHandPoints ? colors.iconBg : colors.cardBg }}
                aria-label={showHandPoints ? 'Hide hand points' : 'Show hand points'}
                aria-pressed={showHandPoints}
              >
                <Hand className="w-4 h-4" style={{ color: showHandPoints ? colors.iconColor : colors.textSecondary }} />
              </button>
              <button
                onClick={() => setShowOverlay(!showOverlay)}
                className="p-2 rounded-lg"
                style={{ background: showOverlay ? colors.successBg : colors.cardBg }}
                aria-label={showOverlay ? 'Hide overlay' : 'Show overlay'}
                aria-pressed={showOverlay}
              >
                {showOverlay ? (
                  <Eye className="w-4 h-4" style={{ color: colors.successColor }} />
                ) : (
                  <EyeOff className="w-4 h-4" style={{ color: colors.textSecondary }} />
                )}
              </button>
            </div>
          </div>

          <div 
            className="rounded-2xl overflow-hidden relative"
            style={{
              background: colors.cardBg,
              backdropFilter: colors.blur,
              WebkitBackdropFilter: colors.blur,
              border: colors.glassBorder,
              boxShadow: colors.shadow,
              aspectRatio: '4/3',
            }}
            role="img"
            aria-label={`Hand tracking visualization showing ${handPoints.length} tracked points with ${confidence.toFixed(0)}% confidence`}
          >
            {/* Dotted Frame Border */}
            <div 
              className="absolute inset-4"
              style={{
                border: `2px dashed ${colors.border}`,
                borderRadius: '12px',
              }}
              aria-hidden="true"
            />

            {/* Center Hand Icon */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
              <Hand 
                className="w-24 h-24 opacity-20"
                style={{ color: colors.textTertiary }}
                aria-hidden="true"
              />
            </div>

            {/* Hand Points Overlay */}
            {showHandPoints && isTracking && handPoints.map((point) => (
              <div
                key={point.id}
                className="absolute transition-all duration-100"
                style={{
                  left: `${point.position.x}%`,
                  top: `${point.position.y}%`,
                  transform: 'translate(-50%, -50%)',
                }}
                role="status"
                aria-label={`${point.name} at confidence ${(point.confidence * 100).toFixed(0)}%`}
              >
                <div 
                  className="w-3 h-3 rounded-full"
                  style={{
                    background: colors.iconColor,
                    opacity: point.confidence,
                    boxShadow: `0 0 8px ${colors.iconColor}`,
                  }}
                />
                {showConfidenceScores && (
                  <div 
                    className="absolute top-full mt-1 text-xs font-bold whitespace-nowrap px-1 py-0.5 rounded"
                    style={{
                      background: 'rgba(0, 0, 0, 0.8)',
                      color: '#fff',
                      fontSize: '9px',
                    }}
                  >
                    {(point.confidence * 100).toFixed(0)}%
                  </div>
                )}
              </div>
            ))}

            {/* Real-time Feedback Overlay */}
            {showOverlay && isTracking && (
              <div 
                className="absolute bottom-4 left-4 right-4 rounded-xl p-3"
                style={{
                  background: 'rgba(0, 0, 0, 0.85)',
                  backdropFilter: 'blur(10px)',
                }}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Activity className="w-4 h-4 text-white" />
                    <span className="text-sm font-bold text-white">Real-time Feedback</span>
                  </div>
                  <div className="text-xs font-bold" style={{ color: getStatusColor(trackingStatus) }}>
                    {trackingStatus.toUpperCase()}
                  </div>
                </div>
                <div className="mt-2 text-xs text-white/80">
                  {trackingStatus === 'excellent' && '✓ Excellent tracking! Hand position and shape detected accurately.'}
                  {trackingStatus === 'good' && '✓ Good tracking. Minor adjustments may improve accuracy.'}
                  {trackingStatus === 'poor' && '⚠ Poor tracking. Ensure good lighting and hand visibility.'}
                  {trackingStatus === 'offline' && '• Tracking offline. Press Start Tracking to begin.'}
                </div>
              </div>
            )}

            {/* Not Tracking Message */}
            {!isTracking && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <Radio className="w-12 h-12 mx-auto mb-3 opacity-30" style={{ color: colors.textTertiary }} />
                  <div className="text-sm font-semibold mb-1" style={{ color: colors.textSecondary }}>
                    Tracking Inactive
                  </div>
                  <div className="text-xs" style={{ color: colors.textTertiary }}>
                    Press Start Tracking to begin
                  </div>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* Accuracy Metrics */}
        <section aria-labelledby="accuracy-heading" className="px-4 pb-4">
          <h2 id="accuracy-heading" className="text-lg font-semibold mb-3" style={{ color: colors.textPrimary }}>
            Accuracy Feedback
          </h2>
          <div className="space-y-3">
            {metrics.map((metric) => (
              <div
                key={metric.id}
                className="rounded-xl p-4"
                style={{
                  background: colors.cardBg,
                  backdropFilter: colors.blur,
                  WebkitBackdropFilter: colors.blur,
                  border: colors.glassBorder,
                  boxShadow: colors.shadow,
                }}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold" style={{ color: colors.textPrimary }}>
                      {metric.name}
                    </span>
                    {metric.trend === 'up' && <TrendingUp className="w-4 h-4" style={{ color: colors.successColor }} />}
                    {metric.trend === 'down' && <TrendingDown className="w-4 h-4" style={{ color: colors.errorColor }} />}
                  </div>
                  <span className="text-lg font-bold" style={{ color: getMetricColor(metric.status) }}>
                    {metric.value}%
                  </span>
                </div>
                <div className="relative h-2 rounded-full" style={{ background: colors.border }}>
                  <div 
                    className="absolute left-0 top-0 h-full rounded-full transition-all"
                    style={{ 
                      width: `${metric.value}%`,
                      background: getMetricColor(metric.status),
                    }}
                    role="progressbar"
                    aria-valuenow={metric.value}
                    aria-valuemin={0}
                    aria-valuemax={100}
                    aria-label={`${metric.name} accuracy`}
                  />
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Path Comparison View */}
        {showPathComparison && (
          <section aria-labelledby="path-heading" className="px-4 pb-4">
            <div className="flex items-center justify-between mb-3">
              <h2 id="path-heading" className="text-lg font-semibold" style={{ color: colors.textPrimary }}>
                Path Comparison
              </h2>
              <button
                onClick={() => setShowPathComparison(false)}
                className="p-2 rounded-lg"
                style={{ background: colors.cardBg }}
                aria-label="Hide path comparison"
              >
                <Minimize2 className="w-4 h-4" style={{ color: colors.textSecondary }} />
              </button>
            </div>

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
              {/* Path Visualization */}
              <div 
                className="relative rounded-xl mb-4 overflow-hidden"
                style={{
                  background: theme === 'dark' ? '#000' : '#f8f9fa',
                  aspectRatio: '16/9',
                }}
              >
                <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid meet">
                  {/* Grid */}
                  <defs>
                    <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
                      <path d="M 10 0 L 0 0 0 10" fill="none" stroke={colors.border} strokeWidth="0.5" opacity="0.3" />
                    </pattern>
                  </defs>
                  <rect width="100" height="100" fill="url(#grid)" />

                  {/* Reference Path */}
                  <polyline
                    points={pathData[0].points.map(p => `${p.x},${p.y}`).join(' ')}
                    fill="none"
                    stroke={pathData[0].color}
                    strokeWidth="2"
                    strokeDasharray="5,5"
                    opacity="0.8"
                  />
                  {pathData[0].points.map((point, idx) => (
                    <circle
                      key={`ref-${idx}`}
                      cx={point.x}
                      cy={point.y}
                      r="2"
                      fill={pathData[0].color}
                    />
                  ))}

                  {/* User Path */}
                  <polyline
                    points={pathData[1].points.map(p => `${p.x},${p.y}`).join(' ')}
                    fill="none"
                    stroke={pathData[1].color}
                    strokeWidth="2"
                    opacity="0.8"
                  />
                  {pathData[1].points.map((point, idx) => (
                    <circle
                      key={`user-${idx}`}
                      cx={point.x}
                      cy={point.y}
                      r="2"
                      fill={pathData[1].color}
                    />
                  ))}
                </svg>
              </div>

              {/* Legend */}
              <div className="flex items-center justify-around">
                {pathData.map((path) => (
                  <div key={path.id} className="flex items-center gap-2">
                    <div 
                      className="w-4 h-4 rounded-full"
                      style={{ background: path.color }}
                      aria-hidden="true"
                    />
                    <span className="text-sm font-semibold" style={{ color: colors.textPrimary }}>
                      {path.label}
                    </span>
                  </div>
                ))}
              </div>

              {/* Path Stats */}
              <div className="grid grid-cols-3 gap-3 mt-4">
                <div className="text-center">
                  <div className="text-xs mb-1" style={{ color: colors.textTertiary }}>
                    Path Match
                  </div>
                  <div className="text-lg font-bold" style={{ color: colors.successColor }}>
                    89%
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-xs mb-1" style={{ color: colors.textTertiary }}>
                    Deviation
                  </div>
                  <div className="text-lg font-bold" style={{ color: colors.warningColor }}>
                    2.3cm
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-xs mb-1" style={{ color: colors.textTertiary }}>
                    Smoothness
                  </div>
                  <div className="text-lg font-bold" style={{ color: colors.iconColor }}>
                    91%
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Hand Coordinates */}
        {showCoordinates && (
          <section aria-labelledby="coordinates-heading" className="px-4 pb-4">
            <h2 id="coordinates-heading" className="text-lg font-semibold mb-3" style={{ color: colors.textPrimary }}>
              Hand Coordinates
            </h2>
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
              <div className="grid grid-cols-3 gap-2 mb-3 text-xs font-bold" style={{ color: colors.textTertiary }}>
                <div>X Position</div>
                <div>Y Position</div>
                <div>Z Depth</div>
              </div>
              <div className="space-y-2 max-h-40 overflow-y-auto">
                {handPoints.slice(0, 5).map((point) => (
                  <div key={point.id} className="grid grid-cols-3 gap-2 text-sm" style={{ color: colors.textPrimary }}>
                    <div>{point.position.x.toFixed(1)}</div>
                    <div>{point.position.y.toFixed(1)}</div>
                    <div>{point.position.z.toFixed(1)}</div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Session Statistics */}
        <section aria-labelledby="stats-heading" className="px-4 pb-4">
          <h2 id="stats-heading" className="text-lg font-semibold mb-3" style={{ color: colors.textPrimary }}>
            Session Statistics
          </h2>
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
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Clock className="w-4 h-4" style={{ color: colors.iconColor }} />
                  <span className="text-sm" style={{ color: colors.textTertiary }}>Duration</span>
                </div>
                <div className="text-2xl font-bold" style={{ color: colors.textPrimary }}>
                  {formatTime(sessionStats.duration)}
                </div>
              </div>
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Target className="w-4 h-4" style={{ color: colors.successColor }} />
                  <span className="text-sm" style={{ color: colors.textTertiary }}>Attempts</span>
                </div>
                <div className="text-2xl font-bold" style={{ color: colors.textPrimary }}>
                  {sessionStats.attempts}
                </div>
              </div>
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <BarChart3 className="w-4 h-4" style={{ color: colors.accentColor }} />
                  <span className="text-sm" style={{ color: colors.textTertiary }}>Avg Accuracy</span>
                </div>
                <div className="text-2xl font-bold" style={{ color: colors.textPrimary }}>
                  {sessionStats.avgAccuracy}%
                </div>
              </div>
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Award className="w-4 h-4" style={{ color: colors.warningColor }} />
                  <span className="text-sm" style={{ color: colors.textTertiary }}>Best Score</span>
                </div>
                <div className="text-2xl font-bold" style={{ color: colors.textPrimary }}>
                  {sessionStats.bestScore}%
                </div>
              </div>
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle2 className="w-4 h-4" style={{ color: colors.successColor }} />
                  <span className="text-sm" style={{ color: colors.textTertiary }}>Signs Completed</span>
                </div>
                <div className="text-2xl font-bold" style={{ color: colors.textPrimary }}>
                  {sessionStats.signsCompleted}
                </div>
              </div>
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Zap className="w-4 h-4" style={{ color: colors.warningColor }} />
                  <span className="text-sm" style={{ color: colors.textTertiary }}>Streak Days</span>
                </div>
                <div className="text-2xl font-bold" style={{ color: colors.textPrimary }}>
                  {sessionStats.streakDays}
                </div>
              </div>
            </div>

            <Button
              onClick={handleReset}
              variant="outline"
              className="w-full mt-4 h-10 rounded-xl font-semibold"
              style={{
                borderColor: colors.border,
                color: colors.textSecondary,
              }}
              aria-label="Reset session statistics"
            >
              <RotateCcw className="w-4 h-4 mr-2" />
              Reset Session
            </Button>
          </div>
        </section>

        {/* Calibration Options */}
        <section aria-labelledby="calibration-heading" className="px-4 pb-4">
          <h2 id="calibration-heading" className="text-lg font-semibold mb-3" style={{ color: colors.textPrimary }}>
            Calibration & Settings
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
            {/* Hands Tracking */}
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm font-semibold" style={{ color: colors.textPrimary }}>
                  Hands Tracking
                </div>
                <div className="text-xs" style={{ color: colors.textSecondary }}>
                  Enable hand detection
                </div>
              </div>
              <button
                onClick={() => setCalibrationSettings(prev => ({ ...prev, handsTracking: !prev.handsTracking }))}
                className="relative w-12 h-6 rounded-full transition-colors flex-shrink-0"
                style={{ 
                  background: calibrationSettings.handsTracking ? colors.successColor : colors.border,
                }}
                role="switch"
                aria-checked={calibrationSettings.handsTracking}
                aria-label="Toggle hands tracking"
              >
                <div 
                  className="absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white transition-transform"
                  style={{
                    transform: calibrationSettings.handsTracking ? 'translateX(24px)' : 'translateX(0)',
                  }}
                />
              </button>
            </div>

            {/* Gesture Detection */}
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm font-semibold" style={{ color: colors.textPrimary }}>
                  Gesture Detection
                </div>
                <div className="text-xs" style={{ color: colors.textSecondary }}>
                  Recognize hand gestures
                </div>
              </div>
              <button
                onClick={() => setCalibrationSettings(prev => ({ ...prev, gestureDetection: !prev.gestureDetection }))}
                className="relative w-12 h-6 rounded-full transition-colors flex-shrink-0"
                style={{ 
                  background: calibrationSettings.gestureDetection ? colors.iconColor : colors.border,
                }}
                role="switch"
                aria-checked={calibrationSettings.gestureDetection}
                aria-label="Toggle gesture detection"
              >
                <div 
                  className="absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white transition-transform"
                  style={{
                    transform: calibrationSettings.gestureDetection ? 'translateX(24px)' : 'translateX(0)',
                  }}
                />
              </button>
            </div>

            {/* Depth Sensing */}
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm font-semibold" style={{ color: colors.textPrimary }}>
                  Depth Sensing
                </div>
                <div className="text-xs" style={{ color: colors.textSecondary }}>
                  Measure Z-axis distance
                </div>
              </div>
              <button
                onClick={() => setCalibrationSettings(prev => ({ ...prev, depthSensing: !prev.depthSensing }))}
                className="relative w-12 h-6 rounded-full transition-colors flex-shrink-0"
                style={{ 
                  background: calibrationSettings.depthSensing ? colors.accentColor : colors.border,
                }}
                role="switch"
                aria-checked={calibrationSettings.depthSensing}
                aria-label="Toggle depth sensing"
              >
                <div 
                  className="absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white transition-transform"
                  style={{
                    transform: calibrationSettings.depthSensing ? 'translateX(24px)' : 'translateX(0)',
                  }}
                />
              </button>
            </div>

            {/* Auto Calibration */}
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm font-semibold" style={{ color: colors.textPrimary }}>
                  Auto Calibration
                </div>
                <div className="text-xs" style={{ color: colors.textSecondary }}>
                  Automatic adjustments
                </div>
              </div>
              <button
                onClick={() => setCalibrationSettings(prev => ({ ...prev, autoCalibration: !prev.autoCalibration }))}
                className="relative w-12 h-6 rounded-full transition-colors flex-shrink-0"
                style={{ 
                  background: calibrationSettings.autoCalibration ? colors.successColor : colors.border,
                }}
                role="switch"
                aria-checked={calibrationSettings.autoCalibration}
                aria-label="Toggle auto calibration"
              >
                <div 
                  className="absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white transition-transform"
                  style={{
                    transform: calibrationSettings.autoCalibration ? 'translateX(24px)' : 'translateX(0)',
                  }}
                />
              </button>
            </div>

            {/* Sensitivity */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label htmlFor="sensitivity" className="text-sm font-semibold" style={{ color: colors.textPrimary }}>
                  Sensitivity
                </label>
                <span className="text-sm font-bold" style={{ color: colors.iconColor }}>
                  {calibrationSettings.sensitivity}%
                </span>
              </div>
              <input
                id="sensitivity"
                type="range"
                min="0"
                max="100"
                value={calibrationSettings.sensitivity}
                onChange={(e) => setCalibrationSettings(prev => ({ ...prev, sensitivity: parseFloat(e.target.value) }))}
                className="w-full h-2 rounded-full appearance-none cursor-pointer"
                style={{
                  background: `linear-gradient(to right, ${colors.iconColor} 0%, ${colors.iconColor} ${calibrationSettings.sensitivity}%, ${colors.border} ${calibrationSettings.sensitivity}%, ${colors.border} 100%)`,
                }}
                aria-label="Tracking sensitivity"
                aria-valuemin={0}
                aria-valuemax={100}
                aria-valuenow={calibrationSettings.sensitivity}
              />
            </div>

            {/* Smoothing */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label htmlFor="smoothing" className="text-sm font-semibold" style={{ color: colors.textPrimary }}>
                  Smoothing
                </label>
                <span className="text-sm font-bold" style={{ color: colors.accentColor }}>
                  {calibrationSettings.smoothing}%
                </span>
              </div>
              <input
                id="smoothing"
                type="range"
                min="0"
                max="100"
                value={calibrationSettings.smoothing}
                onChange={(e) => setCalibrationSettings(prev => ({ ...prev, smoothing: parseFloat(e.target.value) }))}
                className="w-full h-2 rounded-full appearance-none cursor-pointer"
                style={{
                  background: `linear-gradient(to right, ${colors.accentColor} 0%, ${colors.accentColor} ${calibrationSettings.smoothing}%, ${colors.border} ${calibrationSettings.smoothing}%, ${colors.border} 100%)`,
                }}
                aria-label="Motion smoothing"
                aria-valuemin={0}
                aria-valuemax={100}
                aria-valuenow={calibrationSettings.smoothing}
              />
            </div>

            {/* Min Confidence */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label htmlFor="min-confidence" className="text-sm font-semibold" style={{ color: colors.textPrimary }}>
                  Min Confidence
                </label>
                <span className="text-sm font-bold" style={{ color: colors.successColor }}>
                  {calibrationSettings.minConfidence}%
                </span>
              </div>
              <input
                id="min-confidence"
                type="range"
                min="50"
                max="95"
                value={calibrationSettings.minConfidence}
                onChange={(e) => setCalibrationSettings(prev => ({ ...prev, minConfidence: parseFloat(e.target.value) }))}
                className="w-full h-2 rounded-full appearance-none cursor-pointer"
                style={{
                  background: `linear-gradient(to right, ${colors.successColor} 0%, ${colors.successColor} ${((calibrationSettings.minConfidence - 50) / 45) * 100}%, ${colors.border} ${((calibrationSettings.minConfidence - 50) / 45) * 100}%, ${colors.border} 100%)`,
                }}
                aria-label="Minimum confidence threshold"
                aria-valuemin={50}
                aria-valuemax={95}
                aria-valuenow={calibrationSettings.minConfidence}
              />
            </div>

            {/* Display Options */}
            <div className="pt-4 border-t" style={{ borderTopColor: colors.border }}>
              <div className="text-sm font-semibold mb-3" style={{ color: colors.textPrimary }}>
                Display Options
              </div>
              <div className="space-y-2">
                <button
                  onClick={() => setShowConfidenceScores(!showConfidenceScores)}
                  className="w-full flex items-center justify-between p-2 rounded-lg"
                  style={{ background: colors.cardHover }}
                  aria-pressed={showConfidenceScores}
                >
                  <span className="text-sm" style={{ color: colors.textPrimary }}>Show Confidence Scores</span>
                  <div className="w-4 h-4 rounded" style={{ 
                    background: showConfidenceScores ? colors.iconColor : colors.border 
                  }}>
                    {showConfidenceScores && <CheckCircle2 className="w-4 h-4" style={{ color: '#fff' }} />}
                  </div>
                </button>
                <button
                  onClick={() => setShowCoordinates(!showCoordinates)}
                  className="w-full flex items-center justify-between p-2 rounded-lg"
                  style={{ background: colors.cardHover }}
                  aria-pressed={showCoordinates}
                >
                  <span className="text-sm" style={{ color: colors.textPrimary }}>Show Coordinates</span>
                  <div className="w-4 h-4 rounded" style={{ 
                    background: showCoordinates ? colors.iconColor : colors.border 
                  }}>
                    {showCoordinates && <CheckCircle2 className="w-4 h-4" style={{ color: '#fff' }} />}
                  </div>
                </button>
              </div>
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
              <strong style={{ color: colors.textPrimary }}>Hand Tracking Tips:</strong> For best results, ensure good lighting, keep your hand within the frame, and make clear, deliberate movements. The system tracks 21 hand landmarks in real-time.
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
