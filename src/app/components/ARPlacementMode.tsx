import { useState } from 'react';
import { Button } from './ui/button';
import { useTheme } from '../context/ThemeContext';
import { useApp } from '../context/AppContext';
import { 
  X, 
  Camera,
  RotateCw,
  Maximize2,
  Settings,
  Save,
  Upload,
  ChevronDown,
  ChevronUp,
  Volume2,
  VolumeX,
  Move,
  ArrowUp,
  ArrowDown,
  RotateCcw,
  Check,
  Plus,
  Trash2,
  Home,
  Utensils,
  Coffee,
  Bed,
  Sofa,
  Info,
  Grid3x3,
  User,
  Ruler,
  MapPin,
  RefreshCw,
} from 'lucide-react';

interface ARPlacementModeProps {
  onExit: () => void;
}

interface Room {
  id: string;
  name: string;
  icon: any;
  lastUsed?: string;
  hasPreset?: boolean;
}

interface PlacementPreset {
  id: string;
  name: string;
  description: string;
  height: number;
  distance: number;
  angle: number;
}

export function ARPlacementMode({ onExit }: ARPlacementModeProps) {
  const { theme } = useTheme();
  const { userProgress } = useApp();

  // Current Space/Room State
  const [selectedRoom, setSelectedRoom] = useState<string>('living-room');
  const [rooms, setRooms] = useState<Room[]>([
    { id: 'living-room', name: 'Living Room', icon: Sofa, lastUsed: 'Just now', hasPreset: true },
    { id: 'kitchen', name: 'Kitchen', icon: Utensils, lastUsed: '2 hours ago', hasPreset: true },
    { id: 'bedroom', name: 'Bedroom', icon: Bed, lastUsed: 'Yesterday', hasPreset: false },
    { id: 'office', name: 'Office', icon: Coffee, lastUsed: '3 days ago', hasPreset: true },
  ]);

  // Avatar Settings State
  const [avatarHeight, setAvatarHeight] = useState(165); // cm
  const [audioVolume, setAudioVolume] = useState(75);
  const [isMuted, setIsMuted] = useState(false);
  const [avatarDistance, setAvatarDistance] = useState(150); // cm from user
  const [avatarRotation, setAvatarRotation] = useState(0); // degrees

  // Placement Presets
  const [selectedPreset, setSelectedPreset] = useState<string>('standing');
  const [placementPresets] = useState<PlacementPreset[]>([
    {
      id: 'face-level',
      name: 'Face-Level Placement',
      description: 'Perfect for close-up sign learning',
      height: 160,
      distance: 100,
      angle: 0,
    },
    {
      id: 'standing',
      name: 'Standing Height',
      description: 'Full body view for complete signing',
      height: 170,
      distance: 200,
      angle: 0,
    },
    {
      id: 'desk-height',
      name: 'Desk Height',
      description: 'Ideal for seated practice sessions',
      height: 120,
      distance: 150,
      angle: 15,
    },
  ]);

  // Custom Presets State
  const [customPresets, setCustomPresets] = useState<PlacementPreset[]>([
    {
      id: 'custom-1',
      name: 'Kitchen Counter',
      description: 'Practice while cooking',
      height: 140,
      distance: 180,
      angle: 10,
    },
  ]);

  // UI State
  const [isScanning, setIsScanning] = useState(false);
  const [showGrid, setShowGrid] = useState(true);
  const [showRoomList, setShowRoomList] = useState(false);
  const [expandedSections, setExpandedSections] = useState({
    settings: true,
    presets: true,
    rooms: false,
    tips: false,
  });

  // AR Placement State
  const [placementConfirmed, setPlacementConfirmed] = useState(false);
  const [surfaceDetected, setSurfaceDetected] = useState(true);

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

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections({
      ...expandedSections,
      [section]: !expandedSections[section],
    });
  };

  const handleApplyPreset = (preset: PlacementPreset) => {
    setSelectedPreset(preset.id);
    setAvatarHeight(preset.height);
    setAvatarDistance(preset.distance);
    setAvatarRotation(preset.angle);
  };

  const handleSaveCustomPreset = () => {
    const newPreset: PlacementPreset = {
      id: `custom-${Date.now()}`,
      name: `Custom Preset ${customPresets.length + 1}`,
      description: 'Your saved configuration',
      height: avatarHeight,
      distance: avatarDistance,
      angle: avatarRotation,
    };
    setCustomPresets([...customPresets, newPreset]);
  };

  const handleDeleteCustomPreset = (id: string) => {
    setCustomPresets(customPresets.filter(p => p.id !== id));
  };

  const handleStartScanning = () => {
    setIsScanning(true);
    // Simulate scanning completion after 3 seconds
    setTimeout(() => {
      setIsScanning(false);
      setSurfaceDetected(true);
    }, 3000);
  };

  const handleConfirmPlacement = () => {
    setPlacementConfirmed(true);
    // Update room with preset
    setRooms(rooms.map(r => 
      r.id === selectedRoom ? { ...r, hasPreset: true, lastUsed: 'Just now' } : r
    ));
  };

  const handleAddRoom = () => {
    const roomName = prompt('Enter room name:');
    if (roomName) {
      const newRoom: Room = {
        id: `room-${Date.now()}`,
        name: roomName,
        icon: Home,
        lastUsed: 'Just now',
        hasPreset: false,
      };
      setRooms([...rooms, newRoom]);
    }
  };

  const handleDeleteRoom = (id: string) => {
    if (rooms.length > 1) {
      setRooms(rooms.filter(r => r.id !== id));
      if (selectedRoom === id) {
        setSelectedRoom(rooms[0].id);
      }
    }
  };

  const selectedRoomData = rooms.find(r => r.id === selectedRoom);

  return (
    <div 
      className="h-full flex flex-col"
      style={{ background: colors.bg, color: colors.textPrimary }}
      role="main"
      aria-labelledby="ar-placement-title"
    >
      {/* Header */}
      <div 
        className="p-4 sm:p-6 border-b"
        style={{ borderBottomColor: colors.border }}
      >
        <div className="flex items-center gap-2 sm:gap-3 mb-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={onExit}
            style={{ color: colors.textSecondary }}
            aria-label="Exit AR placement mode"
            className="flex-shrink-0"
          >
            <X className="w-6 h-6" />
          </Button>
          <div className="flex-1 min-w-0">
            <h1 
              id="ar-placement-title" 
              className="text-xl sm:text-2xl font-bold truncate"
              style={{ fontFamily: 'Poppins, sans-serif' }}
            >
              AR Placement Mode
            </h1>
            <p className="text-sm truncate" style={{ color: colors.textSecondary }}>
              Position your ASL instructor avatar
            </p>
          </div>
        </div>

        {/* Current Space Selector */}
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
          <label className="text-xs font-semibold uppercase tracking-wide mb-2 block" style={{ color: colors.textTertiary }}>
            Current Space
          </label>
          <button
            onClick={() => setShowRoomList(!showRoomList)}
            className="w-full flex items-center justify-between p-3 rounded-lg transition-all"
            style={{ background: colors.cardHover }}
            aria-expanded={showRoomList}
            aria-label={`Current space: ${selectedRoomData?.name}. Click to change`}
          >
            <div className="flex items-center gap-3">
              {selectedRoomData && (
                <>
                  <div 
                    className="w-10 h-10 rounded-lg flex items-center justify-center"
                    style={{ background: colors.iconBg }}
                    aria-hidden="true"
                  >
                    <selectedRoomData.icon className="w-5 h-5" style={{ color: colors.iconColor }} />
                  </div>
                  <div className="text-left">
                    <div className="font-semibold" style={{ color: colors.textPrimary }}>
                      {selectedRoomData.name}
                    </div>
                    <div className="text-xs" style={{ color: colors.textSecondary }}>
                      {selectedRoomData.hasPreset ? 'Placement saved' : 'No saved placement'}
                    </div>
                  </div>
                </>
              )}
            </div>
            <ChevronDown className="w-5 h-5" style={{ color: colors.textTertiary }} aria-hidden="true" />
          </button>
        </div>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto">
        {/* AR Preview Area */}
        <div className="p-4 sm:p-6">
          <div 
            className="rounded-2xl overflow-hidden relative aspect-[4/3] mb-6"
            style={{
              background: theme === 'dark' ? '#000000' : '#1A1A2E',
              border: colors.glassBorder,
            }}
            role="img"
            aria-label="AR camera preview showing avatar placement"
          >
            {/* Simulated AR View */}
            <div className="absolute inset-0 flex items-center justify-center">
              {isScanning ? (
                <div className="text-center">
                  <RefreshCw 
                    className="w-12 h-12 mb-4 mx-auto animate-spin" 
                    style={{ color: colors.iconColor }}
                    aria-hidden="true"
                  />
                  <div className="text-sm" style={{ color: colors.textSecondary }}>
                    Scanning room...
                  </div>
                </div>
              ) : surfaceDetected ? (
                <>
                  {/* Grid overlay */}
                  {showGrid && (
                    <div 
                      className="absolute inset-0"
                      style={{
                        backgroundImage: `
                          linear-gradient(${colors.iconColor}40 1px, transparent 1px),
                          linear-gradient(90deg, ${colors.iconColor}40 1px, transparent 1px)
                        `,
                        backgroundSize: '40px 40px',
                        opacity: 0.3,
                      }}
                      aria-hidden="true"
                    />
                  )}
                  
                  {/* Avatar Placement Guide */}
                  <div 
                    className="relative flex flex-col items-center"
                    style={{
                      transform: `scale(${1 - avatarDistance / 1000})`,
                    }}
                  >
                    {/* Avatar silhouette */}
                    <div 
                      className="rounded-2xl p-8 border-2 border-dashed"
                      style={{ 
                        borderColor: placementConfirmed ? colors.successColor : colors.iconColor,
                        background: placementConfirmed ? colors.successBg : colors.iconBg,
                      }}
                      aria-hidden="true"
                    >
                      <User 
                        className="w-24 h-24" 
                        style={{ color: placementConfirmed ? colors.successColor : colors.iconColor }}
                      />
                    </div>
                    
                    {/* Height indicator */}
                    <div 
                      className="absolute -right-16 top-0 bottom-0 flex flex-col items-center justify-center"
                      aria-hidden="true"
                    >
                      <div 
                        className="w-px flex-1"
                        style={{ background: colors.iconColor }}
                      />
                      <div 
                        className="px-2 py-1 rounded text-xs font-semibold whitespace-nowrap"
                        style={{ 
                          background: colors.iconBg,
                          color: colors.iconColor,
                        }}
                      >
                        {avatarHeight}cm
                      </div>
                      <div 
                        className="w-px flex-1"
                        style={{ background: colors.iconColor }}
                      />
                    </div>

                    {/* Distance indicator */}
                    <div 
                      className="mt-4 px-3 py-1 rounded-full text-xs font-semibold"
                      style={{ 
                        background: colors.iconBg,
                        color: colors.iconColor,
                      }}
                      aria-hidden="true"
                    >
                      {avatarDistance}cm away
                    </div>
                  </div>

                  {/* Corner guides */}
                  <div className="absolute top-4 left-4 w-8 h-8 border-l-2 border-t-2" style={{ borderColor: colors.iconColor }} aria-hidden="true" />
                  <div className="absolute top-4 right-4 w-8 h-8 border-r-2 border-t-2" style={{ borderColor: colors.iconColor }} aria-hidden="true" />
                  <div className="absolute bottom-4 left-4 w-8 h-8 border-l-2 border-b-2" style={{ borderColor: colors.iconColor }} aria-hidden="true" />
                  <div className="absolute bottom-4 right-4 w-8 h-8 border-r-2 border-b-2" style={{ borderColor: colors.iconColor }} aria-hidden="true" />
                </>
              ) : (
                <div className="text-center p-6">
                  <Camera className="w-12 h-12 mb-4 mx-auto" style={{ color: colors.textTertiary }} aria-hidden="true" />
                  <div className="font-semibold mb-2" style={{ color: colors.textPrimary }}>
                    No surface detected
                  </div>
                  <div className="text-sm mb-4" style={{ color: colors.textSecondary }}>
                    Move your device to scan the room
                  </div>
                  <Button
                    onClick={handleStartScanning}
                    style={{ 
                      background: colors.iconColor,
                      color: theme === 'dark' ? '#0F0F23' : '#FFFFFF',
                    }}
                    aria-label="Start room scanning"
                  >
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Start Scanning
                  </Button>
                </div>
              )}
            </div>

            {/* AR Controls Overlay */}
            {surfaceDetected && !isScanning && (
              <div className="absolute top-4 right-4 flex flex-col gap-2">
                <button
                  onClick={() => setShowGrid(!showGrid)}
                  className="w-10 h-10 rounded-full flex items-center justify-center"
                  style={{ 
                    background: colors.cardBg,
                    backdropFilter: colors.blur,
                    WebkitBackdropFilter: colors.blur,
                  }}
                  aria-label={showGrid ? 'Hide placement grid' : 'Show placement grid'}
                  aria-pressed={showGrid}
                >
                  <Grid3x3 className="w-5 h-5" style={{ color: showGrid ? colors.iconColor : colors.textSecondary }} />
                </button>
                <button
                  onClick={handleStartScanning}
                  className="w-10 h-10 rounded-full flex items-center justify-center"
                  style={{ 
                    background: colors.cardBg,
                    backdropFilter: colors.blur,
                    WebkitBackdropFilter: colors.blur,
                  }}
                  aria-label="Rescan room"
                >
                  <RefreshCw className="w-5 h-5" style={{ color: colors.textSecondary }} />
                </button>
              </div>
            )}
          </div>

          {/* Quick Placement Actions */}
          {surfaceDetected && !isScanning && (
            <div className="grid grid-cols-4 gap-2 mb-6">
              <button
                onClick={() => setAvatarRotation((avatarRotation - 45) % 360)}
                className="aspect-square rounded-xl flex flex-col items-center justify-center gap-2 p-3 transition-all"
                style={{
                  background: colors.cardBg,
                  backdropFilter: colors.blur,
                  WebkitBackdropFilter: colors.blur,
                  border: colors.glassBorder,
                  boxShadow: colors.shadow,
                }}
                onMouseEnter={(e) => e.currentTarget.style.background = colors.cardHover}
                onMouseLeave={(e) => e.currentTarget.style.background = colors.cardBg}
                aria-label="Rotate avatar left"
              >
                <RotateCcw className="w-6 h-6" style={{ color: colors.iconColor }} aria-hidden="true" />
                <span className="text-xs" style={{ color: colors.textSecondary }}>Rotate</span>
              </button>

              <button
                onClick={() => setAvatarHeight(Math.min(200, avatarHeight + 10))}
                className="aspect-square rounded-xl flex flex-col items-center justify-center gap-2 p-3 transition-all"
                style={{
                  background: colors.cardBg,
                  backdropFilter: colors.blur,
                  WebkitBackdropFilter: colors.blur,
                  border: colors.glassBorder,
                  boxShadow: colors.shadow,
                }}
                onMouseEnter={(e) => e.currentTarget.style.background = colors.cardHover}
                onMouseLeave={(e) => e.currentTarget.style.background = colors.cardBg}
                aria-label="Raise avatar height"
              >
                <ArrowUp className="w-6 h-6" style={{ color: colors.iconColor }} aria-hidden="true" />
                <span className="text-xs" style={{ color: colors.textSecondary }}>Raise</span>
              </button>

              <button
                onClick={() => setAvatarHeight(Math.max(100, avatarHeight - 10))}
                className="aspect-square rounded-xl flex flex-col items-center justify-center gap-2 p-3 transition-all"
                style={{
                  background: colors.cardBg,
                  backdropFilter: colors.blur,
                  WebkitBackdropFilter: colors.blur,
                  border: colors.glassBorder,
                  boxShadow: colors.shadow,
                }}
                onMouseEnter={(e) => e.currentTarget.style.background = colors.cardHover}
                onMouseLeave={(e) => e.currentTarget.style.background = colors.cardBg}
                aria-label="Lower avatar height"
              >
                <ArrowDown className="w-6 h-6" style={{ color: colors.iconColor }} aria-hidden="true" />
                <span className="text-xs" style={{ color: colors.textSecondary }}>Lower</span>
              </button>

              <button
                onClick={() => setAvatarRotation((avatarRotation + 45) % 360)}
                className="aspect-square rounded-xl flex flex-col items-center justify-center gap-2 p-3 transition-all"
                style={{
                  background: colors.cardBg,
                  backdropFilter: colors.blur,
                  WebkitBackdropFilter: colors.blur,
                  border: colors.glassBorder,
                  boxShadow: colors.shadow,
                }}
                onMouseEnter={(e) => e.currentTarget.style.background = colors.cardHover}
                onMouseLeave={(e) => e.currentTarget.style.background = colors.cardBg}
                aria-label="Rotate avatar right"
              >
                <RotateCw className="w-6 h-6" style={{ color: colors.iconColor }} aria-hidden="true" />
                <span className="text-xs" style={{ color: colors.textSecondary }}>Rotate</span>
              </button>
            </div>
          )}
        </div>

        {/* Settings Sections */}
        <div className="px-4 sm:px-6 pb-6 space-y-4">
          
          {/* Avatar Settings */}
          <section aria-labelledby="avatar-settings-heading">
            <button
              onClick={() => toggleSection('settings')}
              className="w-full flex items-center justify-between mb-3"
              aria-expanded={expandedSections.settings}
              aria-controls="avatar-settings"
            >
              <h2 id="avatar-settings-heading" className="text-base font-semibold" style={{ color: colors.textPrimary }}>
                Avatar Settings
              </h2>
              {expandedSections.settings ? (
                <ChevronUp className="w-5 h-5" style={{ color: colors.textSecondary }} aria-hidden="true" />
              ) : (
                <ChevronDown className="w-5 h-5" style={{ color: colors.textSecondary }} aria-hidden="true" />
              )}
            </button>

            {expandedSections.settings && (
              <div 
                id="avatar-settings"
                className="rounded-xl p-6 space-y-6"
                style={{
                  background: colors.cardBg,
                  backdropFilter: colors.blur,
                  WebkitBackdropFilter: colors.blur,
                  border: colors.glassBorder,
                  boxShadow: colors.shadow,
                }}
              >
                {/* Height */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <label htmlFor="avatar-height" className="flex items-center gap-2 text-sm font-semibold" style={{ color: colors.textPrimary }}>
                      <Ruler className="w-4 h-4" style={{ color: colors.iconColor }} aria-hidden="true" />
                      Height
                    </label>
                    <span className="text-sm font-semibold" style={{ color: colors.iconColor }}>
                      {avatarHeight} cm
                    </span>
                  </div>
                  <input
                    id="avatar-height"
                    type="range"
                    min="100"
                    max="200"
                    step="5"
                    value={avatarHeight}
                    onChange={(e) => setAvatarHeight(Number(e.target.value))}
                    className="w-full h-2 rounded-full appearance-none cursor-pointer"
                    style={{
                      background: `linear-gradient(to right, ${colors.iconColor} 0%, ${colors.iconColor} ${((avatarHeight - 100) / 100) * 100}%, ${colors.border} ${((avatarHeight - 100) / 100) * 100}%, ${colors.border} 100%)`,
                    }}
                    aria-label="Avatar height in centimeters"
                    aria-valuemin={100}
                    aria-valuemax={200}
                    aria-valuenow={avatarHeight}
                  />
                </div>

                {/* Audio Volume */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <label htmlFor="audio-volume" className="flex items-center gap-2 text-sm font-semibold" style={{ color: colors.textPrimary }}>
                      {isMuted ? (
                        <VolumeX className="w-4 h-4" style={{ color: colors.iconColor }} aria-hidden="true" />
                      ) : (
                        <Volume2 className="w-4 h-4" style={{ color: colors.iconColor }} aria-hidden="true" />
                      )}
                      Audio Volume
                    </label>
                    <button
                      onClick={() => setIsMuted(!isMuted)}
                      className="text-sm font-semibold px-3 py-1 rounded-lg"
                      style={{ 
                        background: colors.iconBg,
                        color: colors.iconColor,
                      }}
                      aria-label={isMuted ? 'Unmute avatar audio' : 'Mute avatar audio'}
                      aria-pressed={isMuted}
                    >
                      {isMuted ? 'Muted' : `${audioVolume}%`}
                    </button>
                  </div>
                  <input
                    id="audio-volume"
                    type="range"
                    min="0"
                    max="100"
                    step="5"
                    value={isMuted ? 0 : audioVolume}
                    onChange={(e) => {
                      setAudioVolume(Number(e.target.value));
                      if (Number(e.target.value) > 0) setIsMuted(false);
                    }}
                    className="w-full h-2 rounded-full appearance-none cursor-pointer"
                    style={{
                      background: `linear-gradient(to right, ${colors.iconColor} 0%, ${colors.iconColor} ${audioVolume}%, ${colors.border} ${audioVolume}%, ${colors.border} 100%)`,
                    }}
                    disabled={isMuted}
                    aria-label="Avatar audio volume percentage"
                    aria-valuemin={0}
                    aria-valuemax={100}
                    aria-valuenow={isMuted ? 0 : audioVolume}
                  />
                </div>

                {/* Distance */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <label htmlFor="avatar-distance" className="flex items-center gap-2 text-sm font-semibold" style={{ color: colors.textPrimary }}>
                      <MapPin className="w-4 h-4" style={{ color: colors.iconColor }} aria-hidden="true" />
                      Distance
                    </label>
                    <span className="text-sm font-semibold" style={{ color: colors.iconColor }}>
                      {avatarDistance} cm
                    </span>
                  </div>
                  <input
                    id="avatar-distance"
                    type="range"
                    min="50"
                    max="300"
                    step="10"
                    value={avatarDistance}
                    onChange={(e) => setAvatarDistance(Number(e.target.value))}
                    className="w-full h-2 rounded-full appearance-none cursor-pointer"
                    style={{
                      background: `linear-gradient(to right, ${colors.iconColor} 0%, ${colors.iconColor} ${((avatarDistance - 50) / 250) * 100}%, ${colors.border} ${((avatarDistance - 50) / 250) * 100}%, ${colors.border} 100%)`,
                    }}
                    aria-label="Avatar distance in centimeters"
                    aria-valuemin={50}
                    aria-valuemax={300}
                    aria-valuenow={avatarDistance}
                  />
                </div>
              </div>
            )}
          </section>

          {/* Placement Presets */}
          <section aria-labelledby="placement-presets-heading">
            <button
              onClick={() => toggleSection('presets')}
              className="w-full flex items-center justify-between mb-3"
              aria-expanded={expandedSections.presets}
              aria-controls="placement-presets"
            >
              <h2 id="placement-presets-heading" className="text-base font-semibold" style={{ color: colors.textPrimary }}>
                Placement Presets
              </h2>
              {expandedSections.presets ? (
                <ChevronUp className="w-5 h-5" style={{ color: colors.textSecondary }} aria-hidden="true" />
              ) : (
                <ChevronDown className="w-5 h-5" style={{ color: colors.textSecondary }} aria-hidden="true" />
              )}
            </button>

            {expandedSections.presets && (
              <div id="placement-presets" className="space-y-3">
                {/* Built-in Presets */}
                {placementPresets.map((preset) => (
                  <button
                    key={preset.id}
                    onClick={() => handleApplyPreset(preset)}
                    className="w-full rounded-xl p-4 text-left transition-all"
                    style={{
                      background: selectedPreset === preset.id ? colors.cardHover : colors.cardBg,
                      backdropFilter: colors.blur,
                      WebkitBackdropFilter: colors.blur,
                      border: selectedPreset === preset.id ? `2px solid ${colors.iconColor}` : colors.glassBorder,
                      boxShadow: colors.shadow,
                    }}
                    onMouseEnter={(e) => {
                      if (selectedPreset !== preset.id) {
                        e.currentTarget.style.background = colors.cardHover;
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (selectedPreset !== preset.id) {
                        e.currentTarget.style.background = colors.cardBg;
                      }
                    }}
                    aria-label={`Apply ${preset.name} preset: ${preset.description}`}
                    aria-pressed={selectedPreset === preset.id}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1">
                        <div className="font-semibold mb-1" style={{ color: colors.textPrimary }}>
                          {preset.name}
                        </div>
                        <div className="text-xs mb-2" style={{ color: colors.textSecondary }}>
                          {preset.description}
                        </div>
                        <div className="flex items-center gap-3 text-xs" style={{ color: colors.textTertiary }}>
                          <span>Height: {preset.height}cm</span>
                          <span>•</span>
                          <span>Distance: {preset.distance}cm</span>
                        </div>
                      </div>
                      {selectedPreset === preset.id && (
                        <Check className="w-5 h-5 flex-shrink-0" style={{ color: colors.iconColor }} aria-hidden="true" />
                      )}
                    </div>
                  </button>
                ))}

                {/* Custom Presets */}
                {customPresets.map((preset) => (
                  <div
                    key={preset.id}
                    className="rounded-xl p-4 transition-all"
                    style={{
                      background: selectedPreset === preset.id ? colors.cardHover : colors.cardBg,
                      backdropFilter: colors.blur,
                      WebkitBackdropFilter: colors.blur,
                      border: selectedPreset === preset.id ? `2px solid ${colors.iconColor}` : colors.glassBorder,
                      boxShadow: colors.shadow,
                    }}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <button
                        onClick={() => handleApplyPreset(preset)}
                        className="flex-1 text-left"
                        aria-label={`Apply ${preset.name} custom preset: ${preset.description}`}
                        aria-pressed={selectedPreset === preset.id}
                      >
                        <div className="font-semibold mb-1" style={{ color: colors.textPrimary }}>
                          {preset.name}
                        </div>
                        <div className="text-xs mb-2" style={{ color: colors.textSecondary }}>
                          {preset.description}
                        </div>
                        <div className="flex items-center gap-3 text-xs" style={{ color: colors.textTertiary }}>
                          <span>Height: {preset.height}cm</span>
                          <span>•</span>
                          <span>Distance: {preset.distance}cm</span>
                        </div>
                      </button>
                      <button
                        onClick={() => handleDeleteCustomPreset(preset.id)}
                        className="p-2 rounded-lg transition-all"
                        style={{ background: colors.errorBg }}
                        onMouseEnter={(e) => e.currentTarget.style.background = colors.errorColor + '20'}
                        onMouseLeave={(e) => e.currentTarget.style.background = colors.errorBg}
                        aria-label={`Delete ${preset.name} preset`}
                      >
                        <Trash2 className="w-4 h-4" style={{ color: colors.errorColor }} aria-hidden="true" />
                      </button>
                    </div>
                  </div>
                ))}

                {/* Save Current as Preset */}
                <button
                  onClick={handleSaveCustomPreset}
                  className="w-full rounded-xl p-4 text-left transition-all border-2 border-dashed"
                  style={{
                    background: colors.cardBg,
                    borderColor: colors.border,
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = colors.cardHover;
                    e.currentTarget.style.borderColor = colors.iconColor;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = colors.cardBg;
                    e.currentTarget.style.borderColor = colors.border;
                  }}
                  aria-label="Save current configuration as custom preset"
                >
                  <div className="flex items-center gap-3">
                    <div 
                      className="w-10 h-10 rounded-lg flex items-center justify-center"
                      style={{ background: colors.iconBg }}
                      aria-hidden="true"
                    >
                      <Plus className="w-5 h-5" style={{ color: colors.iconColor }} />
                    </div>
                    <div>
                      <div className="font-semibold" style={{ color: colors.textPrimary }}>
                        Save Current Setup
                      </div>
                      <div className="text-xs" style={{ color: colors.textSecondary }}>
                        Create a custom preset
                      </div>
                    </div>
                  </div>
                </button>
              </div>
            )}
          </section>

          {/* All Rooms */}
          <section aria-labelledby="all-rooms-heading">
            <button
              onClick={() => toggleSection('rooms')}
              className="w-full flex items-center justify-between mb-3"
              aria-expanded={expandedSections.rooms}
              aria-controls="all-rooms"
            >
              <h2 id="all-rooms-heading" className="text-base font-semibold" style={{ color: colors.textPrimary }}>
                All Rooms
              </h2>
              <div className="flex items-center gap-2">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleAddRoom();
                  }}
                  className="px-3 py-1 rounded-lg text-xs font-semibold"
                  style={{ 
                    background: colors.iconBg,
                    color: colors.iconColor,
                  }}
                  aria-label="Add new room"
                >
                  + Add Room
                </button>
                {expandedSections.rooms ? (
                  <ChevronUp className="w-5 h-5" style={{ color: colors.textSecondary }} aria-hidden="true" />
                ) : (
                  <ChevronDown className="w-5 h-5" style={{ color: colors.textSecondary }} aria-hidden="true" />
                )}
              </div>
            </button>

            {expandedSections.rooms && (
              <div id="all-rooms" className="space-y-2">
                {rooms.map((room) => (
                  <div
                    key={room.id}
                    className="rounded-xl p-4 transition-all"
                    style={{
                      background: selectedRoom === room.id ? colors.cardHover : colors.cardBg,
                      backdropFilter: colors.blur,
                      WebkitBackdropFilter: colors.blur,
                      border: selectedRoom === room.id ? `2px solid ${colors.iconColor}` : colors.glassBorder,
                      boxShadow: colors.shadow,
                    }}
                  >
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => setSelectedRoom(room.id)}
                        className="flex-1 flex items-center gap-3 text-left"
                        aria-label={`Select ${room.name}. ${room.hasPreset ? 'Has saved placement' : 'No saved placement'}. Last used ${room.lastUsed}`}
                        aria-pressed={selectedRoom === room.id}
                      >
                        <div 
                          className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                          style={{ background: colors.iconBg }}
                          aria-hidden="true"
                        >
                          <room.icon className="w-5 h-5" style={{ color: colors.iconColor }} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="font-semibold truncate" style={{ color: colors.textPrimary }}>
                            {room.name}
                          </div>
                          <div className="text-xs truncate" style={{ color: colors.textSecondary }}>
                            {room.lastUsed} • {room.hasPreset ? 'Placement saved' : 'Not configured'}
                          </div>
                        </div>
                      </button>
                      {rooms.length > 1 && (
                        <button
                          onClick={() => handleDeleteRoom(room.id)}
                          className="p-2 rounded-lg transition-all flex-shrink-0"
                          style={{ background: colors.errorBg }}
                          onMouseEnter={(e) => e.currentTarget.style.background = colors.errorColor + '20'}
                          onMouseLeave={(e) => e.currentTarget.style.background = colors.errorBg}
                          aria-label={`Delete ${room.name}`}
                        >
                          <Trash2 className="w-4 h-4" style={{ color: colors.errorColor }} aria-hidden="true" />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* Placement Tips */}
          <section aria-labelledby="placement-tips-heading">
            <button
              onClick={() => toggleSection('tips')}
              className="w-full flex items-center justify-between mb-3"
              aria-expanded={expandedSections.tips}
              aria-controls="placement-tips"
            >
              <h2 id="placement-tips-heading" className="text-base font-semibold" style={{ color: colors.textPrimary }}>
                Placement Tips
              </h2>
              {expandedSections.tips ? (
                <ChevronUp className="w-5 h-5" style={{ color: colors.textSecondary }} aria-hidden="true" />
              ) : (
                <ChevronDown className="w-5 h-5" style={{ color: colors.textSecondary }} aria-hidden="true" />
              )}
            </button>

            {expandedSections.tips && (
              <div 
                id="placement-tips"
                className="rounded-xl p-6"
                style={{
                  background: colors.cardBg,
                  backdropFilter: colors.blur,
                  WebkitBackdropFilter: colors.blur,
                  border: colors.glassBorder,
                  boxShadow: colors.shadow,
                }}
              >
                <div className="space-y-4">
                  <div className="flex gap-3">
                    <Info className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: colors.iconColor }} aria-hidden="true" />
                    <div>
                      <div className="font-semibold text-sm mb-1" style={{ color: colors.textPrimary }}>
                        Best for clear viewing
                      </div>
                      <div className="text-xs leading-relaxed" style={{ color: colors.textSecondary }}>
                        Position the avatar 150-200cm away for optimal sign visibility and hand movement tracking.
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex gap-3">
                    <Info className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: colors.iconColor }} aria-hidden="true" />
                    <div>
                      <div className="font-semibold text-sm mb-1" style={{ color: colors.textPrimary }}>
                        Avoid bright backgrounds
                      </div>
                      <div className="text-xs leading-relaxed" style={{ color: colors.textSecondary }}>
                        Place the avatar against a wall or darker background for better contrast and easier sign recognition.
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex gap-3">
                    <Info className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: colors.iconColor }} aria-hidden="true" />
                    <div>
                      <div className="font-semibold text-sm mb-1" style={{ color: colors.textPrimary }}>
                        Face-level for conversation
                      </div>
                      <div className="text-xs leading-relaxed" style={{ color: colors.textSecondary }}>
                        When practicing conversations, set the avatar at your eye level for a more natural interaction experience.
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </section>
        </div>
      </div>

      {/* Bottom Action Bar */}
      <div 
        className="p-4 border-t"
        style={{ 
          borderTopColor: colors.border,
          background: colors.cardBg,
          backdropFilter: colors.blur,
          WebkitBackdropFilter: colors.blur,
        }}
      >
        {!placementConfirmed ? (
          <Button
            onClick={handleConfirmPlacement}
            disabled={!surfaceDetected || isScanning}
            className="w-full h-12 rounded-full font-semibold"
            style={{ 
              background: surfaceDetected && !isScanning ? colors.successColor : colors.border,
              color: theme === 'dark' ? '#0F0F23' : '#FFFFFF',
              opacity: surfaceDetected && !isScanning ? 1 : 0.5,
            }}
            aria-label="Confirm avatar placement"
          >
            <Check className="w-5 h-5 mr-2" />
            Confirm Placement
          </Button>
        ) : (
          <div className="flex gap-3">
            <Button
              onClick={() => setPlacementConfirmed(false)}
              className="flex-1 h-12 rounded-full font-semibold"
              style={{ 
                background: colors.cardHover,
                color: colors.textPrimary,
              }}
              aria-label="Adjust placement"
            >
              Adjust
            </Button>
            <Button
              onClick={onExit}
              className="flex-1 h-12 rounded-full font-semibold"
              style={{ 
                background: colors.successColor,
                color: theme === 'dark' ? '#0F0F23' : '#FFFFFF',
              }}
              aria-label="Save and exit AR placement mode"
            >
              <Save className="w-5 h-5 mr-2" />
              Save & Exit
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
