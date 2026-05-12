import React, { useState } from 'react';
import { Button } from './ui/button';
import { useTheme } from '../context/ThemeContext';
import { useApp } from '../context/AppContext';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, 
  Camera, 
  Scan, 
  Target, 
  Anchor, 
  Settings, 
  Check,
  ChevronRight,
  AlertCircle,
  Info,
  RefreshCw,
  Trash2,
  Edit3,
  Eye,
  EyeOff,
  Zap,
  Shield,
  CheckCircle,
  XCircle,
  Play,
  Pause,
  RotateCcw,
  MapPin,
  Grid3x3,
  Lightbulb,
  Gauge,
  Monitor,
  Battery,
} from 'lucide-react';

interface CameraARSettingsProps {
  onExit: () => void;
}

interface ARAnchor {
  id: string;
  name: string;
  type: 'sign-guide' | 'practice-zone' | 'reference-marker' | 'custom';
  position: { x: number; y: number; z: number };
  rotation: { x: number; y: number; z: number };
  isVisible: boolean;
  createdAt: Date;
}

export function CameraARSettings({ onExit }: CameraARSettingsProps) {
  const { theme } = useTheme();
  const { userProgress } = useApp();

  // Camera Permissions State
  const [cameraPermission, setCameraPermission] = useState<'granted' | 'denied' | 'prompt'>('granted');
  const [microphonePermission, setMicrophonePermission] = useState<'granted' | 'denied' | 'prompt'>('prompt');
  
  // AR Calibration State
  const [isCalibrating, setIsCalibrating] = useState(false);
  const [calibrationStep, setCalibrationStep] = useState(0);
  const [calibrationQuality, setCalibrationQuality] = useState<'poor' | 'good' | 'excellent'>('good');
  
  // Room Scanning State
  const [isScanning, setIsScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [detectedSurfaces, setDetectedSurfaces] = useState(3);
  const [roomScanned, setRoomScanned] = useState(true);
  
  // Anchor Management State
  const [anchors, setAnchors] = useState<ARAnchor[]>([
    {
      id: 'anchor-1',
      name: 'Sign Practice Zone',
      type: 'practice-zone',
      position: { x: 0, y: 0, z: -2 },
      rotation: { x: 0, y: 0, z: 0 },
      isVisible: true,
      createdAt: new Date('2024-01-10'),
    },
    {
      id: 'anchor-2',
      name: 'Reference Guide',
      type: 'sign-guide',
      position: { x: 1, y: 1.5, z: -1.5 },
      rotation: { x: 0, y: -30, z: 0 },
      isVisible: true,
      createdAt: new Date('2024-01-10'),
    },
    {
      id: 'anchor-3',
      name: 'Hand Position Marker',
      type: 'reference-marker',
      position: { x: -0.5, y: 1, z: -1 },
      rotation: { x: 0, y: 45, z: 0 },
      isVisible: false,
      createdAt: new Date('2024-01-09'),
    },
  ]);
  const [selectedAnchor, setSelectedAnchor] = useState<string | null>(null);
  const [editingAnchor, setEditingAnchor] = useState<string | null>(null);
  
  // Performance Settings State
  const [arQuality, setArQuality] = useState<'low' | 'medium' | 'high' | 'ultra'>('high');
  const [frameRate, setFrameRate] = useState(30);
  const [enableOcclusion, setEnableOcclusion] = useState(true);
  const [enableLighting, setEnableLighting] = useState(true);
  const [enableShadows, setEnableShadows] = useState(false);
  const [enablePeopleOcclusion, setEnablePeopleOcclusion] = useState(false);
  const [trackingMode, setTrackingMode] = useState<'fast' | 'balanced' | 'accurate'>('balanced');

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

  const calibrationSteps = [
    { 
      title: 'Point at Floor', 
      description: 'Slowly move your camera to point at the floor',
      icon: Target,
    },
    { 
      title: 'Scan Left to Right', 
      description: 'Pan your camera from left to right across the room',
      icon: Scan,
    },
    { 
      title: 'Scan Up and Down', 
      description: 'Tilt your camera up and down to detect vertical surfaces',
      icon: Grid3x3,
    },
    { 
      title: 'Calibration Complete', 
      description: 'Your AR environment is ready',
      icon: CheckCircle,
    },
  ];

  const handleRequestCameraPermission = () => {
    // Simulate permission request
    setTimeout(() => {
      setCameraPermission('granted');
    }, 500);
  };

  const handleRequestMicrophonePermission = () => {
    // Simulate permission request
    setTimeout(() => {
      setMicrophonePermission('granted');
    }, 500);
  };

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
      setCalibrationQuality('excellent');
    }
  };

  const handleStartRoomScan = () => {
    setIsScanning(true);
    setScanProgress(0);
    
    // Simulate scanning progress
    const interval = setInterval(() => {
      setScanProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsScanning(false);
          setRoomScanned(true);
          setDetectedSurfaces(Math.floor(Math.random() * 5) + 3);
          return 100;
        }
        return prev + 10;
      });
    }, 300);
  };

  const handleToggleAnchorVisibility = (anchorId: string) => {
    setAnchors(anchors.map(anchor => 
      anchor.id === anchorId 
        ? { ...anchor, isVisible: !anchor.isVisible }
        : anchor
    ));
  };

  const handleDeleteAnchor = (anchorId: string) => {
    setAnchors(anchors.filter(anchor => anchor.id !== anchorId));
    if (selectedAnchor === anchorId) {
      setSelectedAnchor(null);
    }
  };

  const getPermissionIcon = (status: 'granted' | 'denied' | 'prompt') => {
    switch (status) {
      case 'granted': return CheckCircle;
      case 'denied': return XCircle;
      case 'prompt': return AlertCircle;
    }
  };

  const getPermissionColor = (status: 'granted' | 'denied' | 'prompt') => {
    switch (status) {
      case 'granted': return colors.successColor;
      case 'denied': return colors.errorColor;
      case 'prompt': return colors.warningColor;
    }
  };

  const getAnchorIcon = (type: ARAnchor['type']) => {
    switch (type) {
      case 'sign-guide': return Lightbulb;
      case 'practice-zone': return Target;
      case 'reference-marker': return MapPin;
      case 'custom': return Anchor;
    }
  };

  return (
    <div 
      className="h-full flex flex-col"
      style={{ background: colors.bg, color: colors.textPrimary }}
      role="main"
      aria-labelledby="camera-ar-settings-title"
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
            aria-label="Close camera and AR settings"
          >
            <X className="w-6 h-6" />
          </Button>
          <div className="flex-1 min-w-0">
            <h1 
              id="camera-ar-settings-title" 
              className="text-xl sm:text-2xl font-bold"
              style={{ fontFamily: 'Poppins, sans-serif' }}
            >
              Camera & AR Settings
            </h1>
            <p className="text-sm" style={{ color: colors.textSecondary }}>
              Configure camera and augmented reality
            </p>
          </div>
        </div>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6">
        {/* Camera Permissions Section */}
        <section aria-labelledby="permissions-heading" className="mb-6">
          <div className="flex items-center gap-2 mb-4">
            <Shield className="w-5 h-5" style={{ color: colors.iconColor }} aria-hidden="true" />
            <h2 id="permissions-heading" className="text-lg font-semibold" style={{ color: colors.textPrimary }}>
              Camera Permissions
            </h2>
          </div>

          {/* Camera Permission */}
          <div 
            className="rounded-xl p-4 mb-3"
            style={{
              background: colors.cardBg,
              backdropFilter: colors.blur,
              WebkitBackdropFilter: colors.blur,
              border: colors.glassBorder,
              boxShadow: colors.shadow,
            }}
          >
            <div className="flex items-center gap-3 mb-3">
              <div 
                className="w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0"
                style={{ background: colors.iconBg }}
                aria-hidden="true"
              >
                <Camera className="w-6 h-6" style={{ color: colors.iconColor }} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-semibold mb-1" style={{ color: colors.textPrimary }}>
                  Camera Access
                </div>
                <div className="text-sm" style={{ color: colors.textSecondary }}>
                  Required for AR hand tracking
                </div>
              </div>
              <div className="flex items-center gap-2">
                {React.createElement(getPermissionIcon(cameraPermission), {
                  className: 'w-5 h-5',
                  style: { color: getPermissionColor(cameraPermission) },
                  'aria-label': `Camera permission ${cameraPermission}`,
                })}
              </div>
            </div>
            
            {cameraPermission !== 'granted' && (
              <Button
                onClick={handleRequestCameraPermission}
                className="w-full h-10 rounded-full font-semibold"
                style={{
                  background: colors.iconColor,
                  color: theme === 'dark' ? 'var(--color-bg-deep)' : '#FFFFFF',
                }}
                aria-label="Request camera permission"
              >
                {cameraPermission === 'denied' ? 'Open Settings' : 'Allow Camera Access'}
              </Button>
            )}
          </div>

          {/* Microphone Permission */}
          <div 
            className="rounded-xl p-4 mb-3"
            style={{
              background: colors.cardBg,
              backdropFilter: colors.blur,
              WebkitBackdropFilter: colors.blur,
              border: colors.glassBorder,
              boxShadow: colors.shadow,
            }}
          >
            <div className="flex items-center gap-3 mb-3">
              <div 
                className="w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0"
                style={{ background: colors.iconBg }}
                aria-hidden="true"
              >
                <Settings className="w-6 h-6" style={{ color: colors.iconColor }} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-semibold mb-1" style={{ color: colors.textPrimary }}>
                  Microphone Access
                </div>
                <div className="text-sm" style={{ color: colors.textSecondary }}>
                  Optional for social practice rooms
                </div>
              </div>
              <div className="flex items-center gap-2">
                {React.createElement(getPermissionIcon(microphonePermission), {
                  className: 'w-5 h-5',
                  style: { color: getPermissionColor(microphonePermission) },
                  'aria-label': `Microphone permission ${microphonePermission}`,
                })}
              </div>
            </div>
            
            {microphonePermission !== 'granted' && (
              <Button
                onClick={handleRequestMicrophonePermission}
                className="w-full h-10 rounded-full font-semibold"
                style={{
                  background: colors.cardHover,
                  color: colors.textPrimary,
                  border: colors.glassBorder,
                }}
                aria-label="Request microphone permission"
              >
                {microphonePermission === 'denied' ? 'Open Settings' : 'Allow Microphone Access'}
              </Button>
            )}
          </div>

          {/* Info Card */}
          <div 
            className="rounded-xl p-4"
            style={{ background: colors.iconBg }}
          >
            <div className="flex items-start gap-3">
              <Info className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: colors.iconColor }} aria-hidden="true" />
              <div>
                <div className="font-semibold mb-1 text-sm" style={{ color: colors.textPrimary }}>
                  Privacy Notice
                </div>
                <div className="text-xs" style={{ color: colors.textSecondary }}>
                  Your camera feed is processed locally on your device for AR tracking. No video is recorded or uploaded without your explicit permission.
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* AR Calibration Section */}
        <section aria-labelledby="calibration-heading" className="mb-6">
          <div className="flex items-center gap-2 mb-4">
            <Target className="w-5 h-5" style={{ color: colors.iconColor }} aria-hidden="true" />
            <h2 id="calibration-heading" className="text-lg font-semibold" style={{ color: colors.textPrimary }}>
              AR Calibration
            </h2>
          </div>

          {/* Calibration Status */}
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
            <div className="flex items-center justify-between mb-3">
              <div>
                <div className="font-semibold mb-1" style={{ color: colors.textPrimary }}>
                  Calibration Quality
                </div>
                <div className="text-sm" style={{ color: colors.textSecondary }}>
                  Last calibrated 2 hours ago
                </div>
              </div>
              <div 
                className="px-3 py-1 rounded-full text-sm font-semibold capitalize"
                style={{ 
                  background: calibrationQuality === 'excellent' ? colors.successBg : 
                              calibrationQuality === 'good' ? colors.iconBg : colors.warningBg,
                  color: calibrationQuality === 'excellent' ? colors.successColor : 
                         calibrationQuality === 'good' ? colors.iconColor : colors.warningColor,
                }}
                aria-label={`Calibration quality: ${calibrationQuality}`}
              >
                {calibrationQuality}
              </div>
            </div>

            {!isCalibrating ? (
              <Button
                onClick={handleStartCalibration}
                className="w-full h-10 rounded-full font-semibold"
                style={{
                  background: colors.iconColor,
                  color: theme === 'dark' ? 'var(--color-bg-deep)' : '#FFFFFF',
                }}
                aria-label="Start AR calibration"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Recalibrate AR
              </Button>
            ) : (
              <div>
                {/* Calibration Progress */}
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-semibold" style={{ color: colors.textPrimary }}>
                      Step {calibrationStep + 1} of {calibrationSteps.length}
                    </span>
                    <span className="text-sm" style={{ color: colors.textSecondary }}>
                      {Math.round(((calibrationStep + 1) / calibrationSteps.length) * 100)}%
                    </span>
                  </div>
                  <div 
                    className="h-2 rounded-full overflow-hidden"
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
                    <div 
                      className="rounded-lg p-4 mb-4 text-center"
                      style={{ background: colors.iconBg }}
                    >
                      <div 
                        className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3"
                        style={{ background: colors.iconColor }}
                        aria-hidden="true"
                      >
                        <Icon className="w-8 h-8 text-white" />
                      </div>
                      <div className="font-semibold mb-2" style={{ color: colors.textPrimary }}>
                        {step.title}
                      </div>
                      <div className="text-sm" style={{ color: colors.textSecondary }}>
                        {step.description}
                      </div>
                    </div>
                  );
                })()}

                <div className="flex gap-3">
                  <Button
                    onClick={() => {
                      setIsCalibrating(false);
                      setCalibrationStep(0);
                    }}
                    variant="ghost"
                    className="flex-1 h-10 rounded-full"
                    style={{ color: colors.textSecondary }}
                    aria-label="Cancel calibration"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleNextCalibrationStep}
                    className="flex-1 h-10 rounded-full font-semibold"
                    style={{
                      background: colors.iconColor,
                      color: theme === 'dark' ? 'var(--color-bg-deep)' : '#FFFFFF',
                    }}
                    aria-label="Continue to next calibration step"
                  >
                    {calibrationStep < calibrationSteps.length - 1 ? 'Continue' : 'Finish'}
                  </Button>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* Room Scanning Section */}
        <section aria-labelledby="scanning-heading" className="mb-6">
          <div className="flex items-center gap-2 mb-4">
            <Scan className="w-5 h-5" style={{ color: colors.iconColor }} aria-hidden="true" />
            <h2 id="scanning-heading" className="text-lg font-semibold" style={{ color: colors.textPrimary }}>
              Room Scanning
            </h2>
          </div>

          {/* Scan Status */}
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
            {!isScanning ? (
              <>
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <div className="font-semibold mb-1" style={{ color: colors.textPrimary }}>
                      {roomScanned ? 'Room Scanned' : 'Room Not Scanned'}
                    </div>
                    <div className="text-sm" style={{ color: colors.textSecondary }}>
                      {roomScanned ? `${detectedSurfaces} surfaces detected` : 'Scan your environment for better AR'}
                    </div>
                  </div>
                  {roomScanned && (
                    <CheckCircle className="w-6 h-6" style={{ color: colors.successColor }} aria-hidden="true" />
                  )}
                </div>

                <Button
                  onClick={handleStartRoomScan}
                  className="w-full h-10 rounded-full font-semibold"
                  style={{
                    background: colors.iconColor,
                    color: theme === 'dark' ? 'var(--color-bg-deep)' : '#FFFFFF',
                  }}
                  aria-label={roomScanned ? 'Rescan room' : 'Start room scan'}
                >
                  <Scan className="w-4 h-4 mr-2" />
                  {roomScanned ? 'Rescan Room' : 'Start Room Scan'}
                </Button>
              </>
            ) : (
              <div>
                <div className="flex items-center justify-center mb-4">
                  <div 
                    className="w-16 h-16 rounded-full flex items-center justify-center"
                    style={{ background: colors.iconBg }}
                    aria-hidden="true"
                  >
                    <Scan className="w-8 h-8 animate-pulse" style={{ color: colors.iconColor }} />
                  </div>
                </div>
                
                <div className="text-center mb-4">
                  <div className="font-semibold mb-2" style={{ color: colors.textPrimary }}>
                    Scanning Environment...
                  </div>
                  <div className="text-sm" style={{ color: colors.textSecondary }}>
                    Move your camera slowly around the room
                  </div>
                </div>

                <div className="mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-semibold" style={{ color: colors.textPrimary }}>
                      Scanning Progress
                    </span>
                    <span className="text-sm" style={{ color: colors.textSecondary }}>
                      {scanProgress}%
                    </span>
                  </div>
                  <div 
                    className="h-2 rounded-full overflow-hidden"
                    style={{ background: colors.cardHover }}
                    role="progressbar"
                    aria-valuenow={scanProgress}
                    aria-valuemin={0}
                    aria-valuemax={100}
                  >
                    <div 
                      className="h-full transition-all"
                      style={{ 
                        background: colors.iconColor,
                        width: `${scanProgress}%`,
                      }}
                    />
                  </div>
                </div>

                <div 
                  className="rounded-lg p-3 text-sm"
                  style={{ background: colors.iconBg, color: colors.textSecondary }}
                >
                  <div className="flex items-center gap-2">
                    <Info className="w-4 h-4" style={{ color: colors.iconColor }} aria-hidden="true" />
                    <span>Detected {Math.floor(scanProgress / 33)} surfaces so far</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Scan Tips */}
          <div 
            className="rounded-xl p-4"
            style={{ background: colors.iconBg }}
          >
            <div className="font-semibold mb-2 text-sm flex items-center gap-2" style={{ color: colors.textPrimary }}>
              <Lightbulb className="w-4 h-4" style={{ color: colors.iconColor }} aria-hidden="true" />
              Scanning Tips
            </div>
            <ul className="space-y-2 text-xs" style={{ color: colors.textSecondary }} role="list">
              <li className="flex items-start gap-2">
                <span aria-hidden="true">•</span>
                <span>Point camera at floors, walls, and tables</span>
              </li>
              <li className="flex items-start gap-2">
                <span aria-hidden="true">•</span>
                <span>Move slowly in a circular motion</span>
              </li>
              <li className="flex items-start gap-2">
                <span aria-hidden="true">•</span>
                <span>Ensure good lighting for best results</span>
              </li>
            </ul>
          </div>
        </section>

        {/* Anchor Management Section */}
        <section aria-labelledby="anchors-heading" className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Anchor className="w-5 h-5" style={{ color: colors.iconColor }} aria-hidden="true" />
              <h2 id="anchors-heading" className="text-lg font-semibold" style={{ color: colors.textPrimary }}>
                AR Anchors
              </h2>
            </div>
            <div 
              className="px-2 py-1 rounded-full text-xs font-semibold"
              style={{ background: colors.iconBg, color: colors.iconColor }}
              aria-label={`${anchors.length} anchors`}
            >
              {anchors.length}
            </div>
          </div>

          {/* Anchors List */}
          <div className="space-y-3 mb-4">
            {anchors.map((anchor, index) => {
              const Icon = getAnchorIcon(anchor.type);
              const isSelected = selectedAnchor === anchor.id;
              
              return (
                <motion.div
                  key={anchor.id}
                  className="rounded-xl p-4"
                  style={{
                    background: isSelected ? colors.cardHover : colors.cardBg,
                    backdropFilter: colors.blur,
                    WebkitBackdropFilter: colors.blur,
                    border: isSelected ? `2px solid ${colors.iconColor}` : colors.glassBorder,
                    boxShadow: colors.shadow,
                  }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <div className="flex items-start gap-3 mb-3">
                    <div 
                      className="w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0"
                      style={{ background: colors.iconBg }}
                      aria-hidden="true"
                    >
                      <Icon className="w-6 h-6" style={{ color: colors.iconColor }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold mb-1" style={{ color: colors.textPrimary }}>
                        {anchor.name}
                      </div>
                      <div className="text-sm mb-2" style={{ color: colors.textSecondary }}>
                        {anchor.type.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                      </div>
                      <div className="flex items-center gap-3 text-xs" style={{ color: colors.textTertiary }}>
                        <span>Position: ({anchor.position.x.toFixed(1)}, {anchor.position.y.toFixed(1)}, {anchor.position.z.toFixed(1)})</span>
                      </div>
                    </div>
                    <button
                      onClick={() => handleToggleAnchorVisibility(anchor.id)}
                      className="p-2 rounded-lg transition-colors"
                      style={{ 
                        background: anchor.isVisible ? colors.successBg : colors.cardHover,
                        color: anchor.isVisible ? colors.successColor : colors.textTertiary,
                      }}
                      aria-label={anchor.isVisible ? `Hide ${anchor.name}` : `Show ${anchor.name}`}
                      aria-pressed={anchor.isVisible}
                    >
                      {anchor.isVisible ? <Eye className="w-5 h-5" /> : <EyeOff className="w-5 h-5" />}
                    </button>
                  </div>

                  {/* Anchor Actions */}
                  <div className="flex gap-2">
                    <button
                      onClick={() => setSelectedAnchor(isSelected ? null : anchor.id)}
                      className="flex-1 h-9 rounded-lg font-semibold text-sm flex items-center justify-center gap-2 transition-colors"
                      style={{
                        background: isSelected ? colors.iconBg : colors.cardHover,
                        color: isSelected ? colors.iconColor : colors.textPrimary,
                      }}
                      aria-label={`View ${anchor.name} details`}
                      aria-expanded={isSelected}
                    >
                      <Eye className="w-4 h-4" />
                      {isSelected ? 'Hide Details' : 'View'}
                    </button>
                    <button
                      onClick={() => setEditingAnchor(anchor.id)}
                      className="flex-1 h-9 rounded-lg font-semibold text-sm flex items-center justify-center gap-2 transition-colors"
                      style={{
                        background: colors.cardHover,
                        color: colors.textPrimary,
                      }}
                      aria-label={`Edit ${anchor.name}`}
                    >
                      <Edit3 className="w-4 h-4" />
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteAnchor(anchor.id)}
                      className="h-9 px-3 rounded-lg transition-colors"
                      style={{
                        background: colors.errorBg,
                        color: colors.errorColor,
                      }}
                      aria-label={`Delete ${anchor.name}`}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Expanded Details */}
                  <AnimatePresence>
                    {isSelected && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden"
                      >
                        <div 
                          className="mt-3 pt-3 space-y-2 text-sm"
                          style={{ borderTop: `1px solid ${colors.border}` }}
                        >
                          <div className="flex justify-between">
                            <span style={{ color: colors.textSecondary }}>Rotation:</span>
                            <span style={{ color: colors.textPrimary }}>
                              ({anchor.rotation.x}°, {anchor.rotation.y}°, {anchor.rotation.z}°)
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span style={{ color: colors.textSecondary }}>Created:</span>
                            <span style={{ color: colors.textPrimary }}>
                              {anchor.createdAt.toLocaleDateString()}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span style={{ color: colors.textSecondary }}>Status:</span>
                            <span 
                              className="px-2 py-0.5 rounded-full text-xs font-semibold"
                              style={{ 
                                background: anchor.isVisible ? colors.successBg : colors.errorBg,
                                color: anchor.isVisible ? colors.successColor : colors.errorColor,
                              }}
                            >
                              {anchor.isVisible ? 'Visible' : 'Hidden'}
                            </span>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </div>

          {anchors.length === 0 && (
            <div 
              className="rounded-xl p-8 text-center"
              style={{ background: colors.cardBg }}
            >
              <Anchor className="w-12 h-12 mx-auto mb-3" style={{ color: colors.textTertiary }} aria-hidden="true" />
              <p className="text-sm" style={{ color: colors.textSecondary }}>
                No AR anchors placed yet. Start an AR session to create anchors.
              </p>
            </div>
          )}
        </section>

        {/* Performance Optimization Section */}
        <section aria-labelledby="performance-heading" className="mb-6">
          <div className="flex items-center gap-2 mb-4">
            <Zap className="w-5 h-5" style={{ color: colors.iconColor }} aria-hidden="true" />
            <h2 id="performance-heading" className="text-lg font-semibold" style={{ color: colors.textPrimary }}>
              Performance Settings
            </h2>
          </div>

          {/* AR Quality */}
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
            <div className="font-semibold mb-3" style={{ color: colors.textPrimary }}>
              AR Quality
            </div>
            <div className="grid grid-cols-4 gap-2" role="radiogroup" aria-label="AR quality">
              {['low', 'medium', 'high', 'ultra'].map((quality) => {
                const isSelected = arQuality === quality;
                return (
                  <button
                    key={quality}
                    onClick={() => setArQuality(quality as any)}
                    className="p-3 rounded-lg text-center transition-all"
                    style={{
                      background: isSelected ? colors.iconBg : colors.cardHover,
                      border: isSelected ? `2px solid ${colors.iconColor}` : 'none',
                    }}
                    role="radio"
                    aria-checked={isSelected}
                    aria-label={`${quality} quality`}
                  >
                    <div className="text-xs font-semibold capitalize" style={{ color: colors.textPrimary }}>
                      {quality}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Frame Rate */}
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
            <div className="flex items-center justify-between mb-2">
              <div className="font-semibold" style={{ color: colors.textPrimary }}>
                Target Frame Rate
              </div>
              <div 
                className="px-3 py-1 rounded-full text-sm font-semibold"
                style={{ background: colors.iconBg, color: colors.iconColor }}
                aria-label={`${frameRate} frames per second`}
              >
                {frameRate} FPS
              </div>
            </div>
            <input
              type="range"
              min="30"
              max="60"
              step="15"
              value={frameRate}
              onChange={(e) => setFrameRate(parseInt(e.target.value))}
              className="w-full h-2 rounded-full appearance-none cursor-pointer"
              style={{
                background: `linear-gradient(to right, ${colors.iconColor} 0%, ${colors.iconColor} ${((frameRate - 30) / 30) * 100}%, ${colors.border} ${((frameRate - 30) / 30) * 100}%, ${colors.border} 100%)`,
              }}
              aria-label="Target frame rate"
              aria-valuemin={30}
              aria-valuemax={60}
              aria-valuenow={frameRate}
            />
            <div className="flex justify-between text-xs mt-1" style={{ color: colors.textTertiary }}>
              <span>30 FPS</span>
              <span>60 FPS</span>
            </div>
          </div>

          {/* Tracking Mode */}
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
            <div className="font-semibold mb-3" style={{ color: colors.textPrimary }}>
              Tracking Mode
            </div>
            <div className="space-y-2" role="radiogroup" aria-label="Tracking mode">
              {[
                { id: 'fast', title: 'Fast', description: 'Lower accuracy, better performance' },
                { id: 'balanced', title: 'Balanced', description: 'Good balance of accuracy and performance' },
                { id: 'accurate', title: 'Accurate', description: 'Highest accuracy, may reduce performance' },
              ].map((mode) => {
                const isSelected = trackingMode === mode.id;
                return (
                  <button
                    key={mode.id}
                    onClick={() => setTrackingMode(mode.id as any)}
                    className="w-full rounded-lg p-3 text-left transition-all"
                    style={{
                      background: isSelected ? colors.iconBg : colors.cardHover,
                      border: isSelected ? `2px solid ${colors.iconColor}` : 'none',
                    }}
                    role="radio"
                    aria-checked={isSelected}
                    aria-label={`${mode.title}, ${mode.description}`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-semibold text-sm mb-1" style={{ color: colors.textPrimary }}>
                          {mode.title}
                        </div>
                        <div className="text-xs" style={{ color: colors.textSecondary }}>
                          {mode.description}
                        </div>
                      </div>
                      {isSelected && (
                        <Check className="w-5 h-5" style={{ color: colors.iconColor }} aria-hidden="true" />
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Advanced Features Toggles */}
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
            <div className="font-semibold mb-3" style={{ color: colors.textPrimary }}>
              Advanced Features
            </div>

            {[
              { 
                label: 'Environment Occlusion', 
                value: enableOcclusion, 
                onChange: setEnableOcclusion,
                description: 'Hide AR objects behind real-world objects',
              },
              { 
                label: 'Dynamic Lighting', 
                value: enableLighting, 
                onChange: setEnableLighting,
                description: 'Match AR lighting to environment',
              },
              { 
                label: 'Shadow Rendering', 
                value: enableShadows, 
                onChange: setEnableShadows,
                description: 'Cast shadows from AR objects (performance impact)',
              },
              { 
                label: 'People Occlusion', 
                value: enablePeopleOcclusion, 
                onChange: setEnablePeopleOcclusion,
                description: 'Hide AR objects behind people (iOS only)',
              },
            ].map((toggle, index) => (
              <div 
                key={index}
                className={`flex items-center justify-between py-3 ${index < 3 ? 'border-b' : ''}`}
                style={{ borderBottomColor: colors.border }}
              >
                <div className="flex-1 pr-4">
                  <div className="font-semibold text-sm mb-1" style={{ color: colors.textPrimary }}>
                    {toggle.label}
                  </div>
                  <div className="text-xs" style={{ color: colors.textSecondary }}>
                    {toggle.description}
                  </div>
                </div>
                <button
                  onClick={() => toggle.onChange(!toggle.value)}
                  className="relative w-12 h-6 rounded-full transition-colors flex-shrink-0"
                  style={{ 
                    background: toggle.value ? colors.iconColor : colors.border,
                  }}
                  role="switch"
                  aria-checked={toggle.value}
                  aria-label={toggle.label}
                >
                  <div 
                    className="absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white transition-transform"
                    style={{
                      transform: toggle.value ? 'translateX(24px)' : 'translateX(0)',
                    }}
                  />
                </button>
              </div>
            ))}
          </div>
        </section>

        {/* Performance Info */}
        <div 
          className="rounded-xl p-4"
          style={{ background: colors.warningBg }}
        >
          <div className="flex items-start gap-3">
            <Battery className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: colors.warningColor }} aria-hidden="true" />
            <div>
              <div className="font-semibold mb-1 text-sm" style={{ color: colors.textPrimary }}>
                Battery & Performance
              </div>
              <div className="text-xs" style={{ color: colors.textSecondary }}>
                Higher quality settings and advanced features will consume more battery and processing power. Adjust based on your device capabilities.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
