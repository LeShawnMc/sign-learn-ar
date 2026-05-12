import { useState } from 'react';
import { Button } from './ui/button';
import { useTheme } from '../context/ThemeContext';
import { useApp } from '../context/AppContext';
import exampleImage from 'figma:asset/98634404a4fccfe1ddc3b8a72cea32ec3fc6eafc.png';
import { 
  X, 
  Download,
  CheckCircle2,
  Trash2,
  HardDrive,
  Wifi,
  WifiOff,
  RefreshCw,
  Clock,
  FolderDown,
  Cloud,
  CloudOff,
  Settings,
  Info,
  AlertCircle,
  ChevronRight,
  ChevronDown,
  Pause,
  Play,
  XCircle,
  Check,
  Loader2,
  Database,
  FileText,
  Image as ImageIcon,
  Video,
  Music,
  Film,
  Archive,
  MoreVertical,
  Calendar,
  TrendingUp,
  BarChart3,
  Toggle,
  Smartphone,
  CircleDot,
} from 'lucide-react';

interface OfflineModeManagerProps {
  onExit: () => void;
}

interface DownloadedLesson {
  id: string;
  title: string;
  category: string;
  size: string;
  sizeBytes: number;
  downloadedDate: string;
  lastAccessed: string;
  type: 'lesson' | 'video' | 'course';
}

interface AvailableContent {
  id: string;
  title: string;
  category: string;
  estimatedSize: string;
  sizeBytes: number;
  isPremium: boolean;
  type: 'lesson' | 'video' | 'course';
}

interface QueueItem {
  id: string;
  title: string;
  size: string;
  progress: number;
  status: 'downloading' | 'paused' | 'queued' | 'error';
}

interface SyncActivity {
  id: string;
  action: string;
  timestamp: string;
  status: 'success' | 'failed' | 'in-progress';
  details: string;
}

export function OfflineModeManager({ onExit }: OfflineModeManagerProps) {
  const { theme } = useTheme();
  const { userProgress } = useApp();

  const [expandedSection, setExpandedSection] = useState<string | null>(null);
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());

  // Device Status
  const [deviceStatus] = useState({
    totalStorage: 64, // GB
    availableStorage: 12.4, // GB
    downloadedContent: 1.7, // GB
    offlineItems: 24,
  });

  // Downloaded Lessons
  const [downloadedLessons, setDownloadedLessons] = useState<DownloadedLesson[]>([
    {
      id: 'dl-1',
      title: 'Basic Greetings',
      category: 'Beginner',
      size: '8.2 MB',
      sizeBytes: 8200000,
      downloadedDate: 'Jan 10, 2026',
      lastAccessed: '2 hours ago',
      type: 'lesson',
    },
    {
      id: 'dl-2',
      title: 'Family Signs',
      category: 'Vocabulary',
      size: '6.1 MB',
      sizeBytes: 6100000,
      downloadedDate: 'Jan 9, 2026',
      lastAccessed: '1 day ago',
      type: 'lesson',
    },
    {
      id: 'dl-3',
      title: 'Numbers 1-100',
      category: 'Fundamentals',
      size: '12.5 MB',
      sizeBytes: 12500000,
      downloadedDate: 'Jan 8, 2026',
      lastAccessed: '3 hours ago',
      type: 'lesson',
    },
    {
      id: 'dl-4',
      title: 'Colors and Shapes',
      category: 'Vocabulary',
      size: '9.8 MB',
      sizeBytes: 9800000,
      downloadedDate: 'Jan 7, 2026',
      lastAccessed: '5 hours ago',
      type: 'lesson',
    },
    {
      id: 'dl-5',
      title: 'Food and Drinks',
      category: 'Daily Life',
      size: '15.2 MB',
      sizeBytes: 15200000,
      downloadedDate: 'Jan 6, 2026',
      lastAccessed: '1 day ago',
      type: 'lesson',
    },
    {
      id: 'dl-6',
      title: 'ASL Grammar Basics',
      category: 'Grammar',
      size: '18.7 MB',
      sizeBytes: 18700000,
      downloadedDate: 'Jan 5, 2026',
      lastAccessed: '2 days ago',
      type: 'video',
    },
    {
      id: 'dl-7',
      title: 'Emotions & Feelings',
      category: 'Expressions',
      size: '11.3 MB',
      sizeBytes: 11300000,
      downloadedDate: 'Jan 4, 2026',
      lastAccessed: '6 hours ago',
      type: 'lesson',
    },
    {
      id: 'dl-8',
      title: 'Weather Terms',
      category: 'Vocabulary',
      size: '7.9 MB',
      sizeBytes: 7900000,
      downloadedDate: 'Jan 3, 2026',
      lastAccessed: '3 days ago',
      type: 'lesson',
    },
  ]);

  // Available to Download
  const [availableContent] = useState<AvailableContent[]>([
    {
      id: 'av-1',
      title: 'Medical Signs',
      category: 'Emergency',
      estimatedSize: '14.2 MB',
      sizeBytes: 14200000,
      isPremium: false,
      type: 'lesson',
    },
    {
      id: 'av-2',
      title: 'Travel & Transportation',
      category: 'Daily Life',
      estimatedSize: '16.8 MB',
      sizeBytes: 16800000,
      isPremium: true,
      type: 'lesson',
    },
    {
      id: 'av-3',
      title: 'Deaf Culture History',
      category: 'Culture',
      estimatedSize: '22.4 MB',
      sizeBytes: 22400000,
      isPremium: false,
      type: 'video',
    },
    {
      id: 'av-4',
      title: 'Advanced Grammar',
      category: 'Grammar',
      estimatedSize: '19.6 MB',
      sizeBytes: 19600000,
      isPremium: true,
      type: 'course',
    },
    {
      id: 'av-5',
      title: 'Sports & Activities',
      category: 'Recreation',
      estimatedSize: '13.5 MB',
      sizeBytes: 13500000,
      isPremium: false,
      type: 'lesson',
    },
  ]);

  // Download Queue
  const [downloadQueue, setDownloadQueue] = useState<QueueItem[]>([
    {
      id: 'q-1',
      title: 'Workplace Signs',
      size: '17.3 MB',
      progress: 67,
      status: 'downloading',
    },
    {
      id: 'q-2',
      title: 'School Vocabulary',
      size: '12.8 MB',
      progress: 0,
      status: 'queued',
    },
    {
      id: 'q-3',
      title: 'Animal Signs',
      size: '10.4 MB',
      progress: 0,
      status: 'queued',
    },
  ]);

  // Sync Activity
  const [syncActivity] = useState<SyncActivity[]>([
    {
      id: 'sync-1',
      action: 'Full sync completed',
      timestamp: '10 minutes ago',
      status: 'success',
      details: 'Synced 24 items, 1.7 GB',
    },
    {
      id: 'sync-2',
      action: 'Downloaded 3 new lessons',
      timestamp: '2 hours ago',
      status: 'success',
      details: 'Basic Greetings, Family Signs, Numbers',
    },
    {
      id: 'sync-3',
      action: 'Removed old content',
      timestamp: '1 day ago',
      status: 'success',
      details: 'Freed 215 MB',
    },
    {
      id: 'sync-4',
      action: 'Sync failed',
      timestamp: '2 days ago',
      status: 'failed',
      details: 'Network connection lost',
    },
  ]);

  // Settings
  const [settings, setSettings] = useState({
    autoDownload: true,
    wifiOnly: true,
    autoDelete: false,
    deleteAfterDays: 30,
    downloadQuality: 'high',
  });

  const handleDeleteLesson = (lessonId: string) => {
    setDownloadedLessons(prev => prev.filter(l => l.id !== lessonId));
  };

  const handleDownloadContent = (contentId: string) => {
    const content = availableContent.find(c => c.id === contentId);
    if (content) {
      const newQueueItem: QueueItem = {
        id: `q-${Date.now()}`,
        title: content.title,
        size: content.estimatedSize,
        progress: 0,
        status: 'queued',
      };
      setDownloadQueue(prev => [...prev, newQueueItem]);
    }
  };

  const handlePauseDownload = (queueId: string) => {
    setDownloadQueue(prev => prev.map(item =>
      item.id === queueId
        ? { ...item, status: item.status === 'downloading' ? 'paused' : 'downloading' as any }
        : item
    ));
  };

  const handleCancelDownload = (queueId: string) => {
    setDownloadQueue(prev => prev.filter(item => item.id !== queueId));
  };

  const handleToggleSetting = (key: keyof typeof settings) => {
    setSettings(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleDownloadAll = () => {
    availableContent.forEach(content => {
      const newQueueItem: QueueItem = {
        id: `q-${Date.now()}-${content.id}`,
        title: content.title,
        size: content.estimatedSize,
        progress: 0,
        status: 'queued',
      };
      setDownloadQueue(prev => [...prev, newQueueItem]);
    });
  };

  const handleSyncNow = () => {
    // Simulate sync action
  };

  const getStoragePercentage = () => {
    return ((deviceStatus.downloadedContent / deviceStatus.totalStorage) * 100).toFixed(1);
  };

  const getUsedStorage = () => {
    return deviceStatus.totalStorage - deviceStatus.availableStorage;
  };

  const getTypeIcon = (type: string) => {
    if (type === 'video') return Video;
    if (type === 'course') return Archive;
    return FileText;
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
      aria-labelledby="offline-title"
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
            aria-label="Exit offline mode manager"
            className="flex-shrink-0"
          >
            <X className="w-6 h-6" />
          </Button>
          <div className="flex-1 min-w-0">
            <h1 
              id="offline-title" 
              className="text-xl sm:text-2xl font-bold truncate"
              style={{ fontFamily: 'Poppins, sans-serif' }}
            >
              Offline Mode
            </h1>
            <p className="text-sm truncate" style={{ color: colors.textSecondary }}>
              Manage downloaded content
            </p>
          </div>
        </div>
      </div>

      {/* Device Status */}
      <div className="p-4">
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
          <div className="flex items-center gap-3 mb-4">
            <div 
              className="w-12 h-12 rounded-xl flex items-center justify-center"
              style={{ background: colors.iconBg }}
            >
              <Smartphone className="w-6 h-6" style={{ color: colors.iconColor }} />
            </div>
            <div className="flex-1">
              <h2 className="font-semibold mb-1" style={{ color: colors.textPrimary }}>
                Device Status
              </h2>
              <p className="text-sm" style={{ color: colors.textSecondary }}>
                {deviceStatus.offlineItems} items available offline
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 mb-4">
            <div 
              className="rounded-lg p-3"
              style={{ background: colors.iconBg }}
            >
              <div className="text-sm mb-1" style={{ color: colors.textTertiary }}>
                Available Storage
              </div>
              <div className="text-xl font-bold" style={{ color: colors.textPrimary }}>
                {deviceStatus.availableStorage} GB
              </div>
              <div className="text-xs" style={{ color: colors.textTertiary }}>
                of {deviceStatus.totalStorage} GB
              </div>
            </div>
            <div 
              className="rounded-lg p-3"
              style={{ background: colors.successBg }}
            >
              <div className="text-sm mb-1" style={{ color: colors.textTertiary }}>
                Downloaded
              </div>
              <div className="text-xl font-bold" style={{ color: colors.successColor }}>
                {deviceStatus.downloadedContent} GB
              </div>
              <div className="text-xs" style={{ color: colors.textTertiary }}>
                {getStoragePercentage()}% used
              </div>
            </div>
          </div>

          {/* Storage Bar */}
          <div className="mb-2">
            <div className="flex items-center justify-between mb-1 text-xs" style={{ color: colors.textTertiary }}>
              <span>Storage Usage</span>
              <span>{getUsedStorage().toFixed(1)} GB / {deviceStatus.totalStorage} GB</span>
            </div>
            <div 
              className="w-full h-2 rounded-full overflow-hidden"
              style={{ background: colors.border }}
              role="progressbar"
              aria-valuenow={getUsedStorage()}
              aria-valuemin={0}
              aria-valuemax={deviceStatus.totalStorage}
            >
              <div 
                className="h-full rounded-full transition-all"
                style={{ 
                  background: colors.successColor,
                  width: `${(getUsedStorage() / deviceStatus.totalStorage) * 100}%`,
                }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="px-4 pb-4">
        <div className="grid grid-cols-2 gap-3">
          <Button
            onClick={handleDownloadAll}
            className="h-12 rounded-xl font-semibold flex items-center justify-center gap-2"
            style={{ 
              background: colors.iconColor,
              color: theme === 'dark' ? '#0F0F23' : '#FFFFFF',
            }}
            aria-label="Download all available content"
          >
            <Download className="w-5 h-5" />
            Download All
          </Button>
          <Button
            onClick={handleSyncNow}
            className="h-12 rounded-xl font-semibold flex items-center justify-center gap-2"
            style={{ 
              background: colors.accentBg,
              color: colors.accentColor,
              border: `2px solid ${colors.accentColor}`,
            }}
            aria-label="Sync now"
          >
            <RefreshCw className="w-5 h-5" />
            Sync Now
          </Button>
        </div>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto">
        {/* Downloaded Lessons */}
        <section aria-labelledby="downloaded-heading" className="px-4 pb-4">
          <div className="flex items-center justify-between mb-3">
            <h2 id="downloaded-heading" className="text-lg font-semibold" style={{ color: colors.textPrimary }}>
              Downloaded Lessons
            </h2>
            <button
              onClick={() => setExpandedSection(expandedSection === 'downloaded' ? null : 'downloaded')}
              className="text-sm font-semibold"
              style={{ color: colors.iconColor }}
              aria-expanded={expandedSection === 'downloaded'}
              aria-label="Toggle downloaded lessons"
            >
              {expandedSection === 'downloaded' ? (
                <ChevronDown className="w-5 h-5" />
              ) : (
                <ChevronRight className="w-5 h-5" />
              )}
            </button>
          </div>

          {expandedSection === 'downloaded' && (
            <div className="space-y-2">
              {downloadedLessons.map((lesson) => {
                const TypeIcon = getTypeIcon(lesson.type);
                return (
                  <div
                    key={lesson.id}
                    className="rounded-xl p-3"
                    style={{
                      background: colors.cardBg,
                      backdropFilter: colors.blur,
                      WebkitBackdropFilter: colors.blur,
                      border: colors.glassBorder,
                      boxShadow: colors.shadow,
                    }}
                  >
                    <div className="flex items-start gap-3">
                      <div 
                        className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                        style={{ background: colors.successBg }}
                      >
                        <TypeIcon className="w-5 h-5" style={{ color: colors.successColor }} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold mb-1 truncate" style={{ color: colors.textPrimary }}>
                          {lesson.title}
                        </h3>
                        <div className="flex items-center gap-2 text-xs flex-wrap" style={{ color: colors.textTertiary }}>
                          <span>{lesson.category}</span>
                          <span>•</span>
                          <span>{lesson.size}</span>
                          <span>•</span>
                          <span>{lesson.lastAccessed}</span>
                        </div>
                      </div>
                      <button
                        onClick={() => handleDeleteLesson(lesson.id)}
                        className="p-2 rounded-lg flex-shrink-0"
                        style={{ 
                          background: colors.errorBg,
                          color: colors.errorColor,
                        }}
                        aria-label={`Delete ${lesson.title}`}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>

        {/* Available to Download */}
        <section aria-labelledby="available-heading" className="px-4 pb-4">
          <div className="flex items-center justify-between mb-3">
            <h2 id="available-heading" className="text-lg font-semibold" style={{ color: colors.textPrimary }}>
              Available to Download
            </h2>
            <button
              onClick={() => setExpandedSection(expandedSection === 'available' ? null : 'available')}
              className="text-sm font-semibold"
              style={{ color: colors.iconColor }}
              aria-expanded={expandedSection === 'available'}
              aria-label="Toggle available content"
            >
              {expandedSection === 'available' ? (
                <ChevronDown className="w-5 h-5" />
              ) : (
                <ChevronRight className="w-5 h-5" />
              )}
            </button>
          </div>

          {expandedSection === 'available' && (
            <div className="space-y-2">
              {availableContent.map((content) => {
                const TypeIcon = getTypeIcon(content.type);
                return (
                  <div
                    key={content.id}
                    className="rounded-xl p-3"
                    style={{
                      background: colors.cardBg,
                      backdropFilter: colors.blur,
                      WebkitBackdropFilter: colors.blur,
                      border: colors.glassBorder,
                      boxShadow: colors.shadow,
                    }}
                  >
                    <div className="flex items-start gap-3">
                      <div 
                        className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                        style={{ background: colors.iconBg }}
                      >
                        <TypeIcon className="w-5 h-5" style={{ color: colors.iconColor }} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold mb-1 truncate" style={{ color: colors.textPrimary }}>
                          {content.title}
                        </h3>
                        <div className="flex items-center gap-2 text-xs flex-wrap" style={{ color: colors.textTertiary }}>
                          <span>{content.category}</span>
                          <span>•</span>
                          <span>{content.estimatedSize}</span>
                          {content.isPremium && (
                            <>
                              <span>•</span>
                              <span 
                                className="px-2 py-0.5 rounded-full"
                                style={{ 
                                  background: colors.warningBg,
                                  color: colors.warningColor,
                                }}
                              >
                                Premium
                              </span>
                            </>
                          )}
                        </div>
                      </div>
                      <button
                        onClick={() => handleDownloadContent(content.id)}
                        className="p-2 rounded-lg flex-shrink-0"
                        style={{ 
                          background: colors.iconBg,
                          color: colors.iconColor,
                        }}
                        aria-label={`Download ${content.title}`}
                      >
                        <Download className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>

        {/* Download Queue */}
        {downloadQueue.length > 0 && (
          <section aria-labelledby="queue-heading" className="px-4 pb-4">
            <div className="flex items-center justify-between mb-3">
              <h2 id="queue-heading" className="text-lg font-semibold" style={{ color: colors.textPrimary }}>
                Download Queue
              </h2>
              <span 
                className="text-sm px-2 py-1 rounded-full"
                style={{ 
                  background: colors.iconBg,
                  color: colors.iconColor,
                }}
              >
                {downloadQueue.length} items
              </span>
            </div>

            <div className="space-y-2">
              {downloadQueue.map((item) => (
                <div
                  key={item.id}
                  className="rounded-xl p-3"
                  style={{
                    background: colors.cardBg,
                    backdropFilter: colors.blur,
                    WebkitBackdropFilter: colors.blur,
                    border: colors.glassBorder,
                    boxShadow: colors.shadow,
                  }}
                >
                  <div className="flex items-start gap-3 mb-3">
                    <div 
                      className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                      style={{ background: colors.iconBg }}
                    >
                      {item.status === 'downloading' ? (
                        <Loader2 className="w-5 h-5 animate-spin" style={{ color: colors.iconColor }} />
                      ) : item.status === 'paused' ? (
                        <Pause className="w-5 h-5" style={{ color: colors.warningColor }} />
                      ) : item.status === 'error' ? (
                        <XCircle className="w-5 h-5" style={{ color: colors.errorColor }} />
                      ) : (
                        <Clock className="w-5 h-5" style={{ color: colors.textTertiary }} />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold mb-1 truncate" style={{ color: colors.textPrimary }}>
                        {item.title}
                      </h3>
                      <div className="text-xs mb-2" style={{ color: colors.textTertiary }}>
                        {item.size} • {item.status === 'downloading' ? `${item.progress}%` : item.status}
                      </div>
                      {item.status === 'downloading' && (
                        <div 
                          className="w-full h-1.5 rounded-full overflow-hidden"
                          style={{ background: colors.border }}
                          role="progressbar"
                          aria-valuenow={item.progress}
                          aria-valuemin={0}
                          aria-valuemax={100}
                        >
                          <div 
                            className="h-full rounded-full transition-all"
                            style={{ 
                              background: colors.iconColor,
                              width: `${item.progress}%`,
                            }}
                          />
                        </div>
                      )}
                    </div>
                    <div className="flex items-center gap-1 flex-shrink-0">
                      {item.status === 'downloading' && (
                        <button
                          onClick={() => handlePauseDownload(item.id)}
                          className="p-2 rounded-lg"
                          style={{ 
                            background: colors.warningBg,
                            color: colors.warningColor,
                          }}
                          aria-label={`Pause download of ${item.title}`}
                        >
                          <Pause className="w-4 h-4" />
                        </button>
                      )}
                      {item.status === 'paused' && (
                        <button
                          onClick={() => handlePauseDownload(item.id)}
                          className="p-2 rounded-lg"
                          style={{ 
                            background: colors.successBg,
                            color: colors.successColor,
                          }}
                          aria-label={`Resume download of ${item.title}`}
                        >
                          <Play className="w-4 h-4" />
                        </button>
                      )}
                      <button
                        onClick={() => handleCancelDownload(item.id)}
                        className="p-2 rounded-lg"
                        style={{ 
                          background: colors.errorBg,
                          color: colors.errorColor,
                        }}
                        aria-label={`Cancel download of ${item.title}`}
                      >
                        <XCircle className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Download Settings */}
        <section aria-labelledby="settings-heading" className="px-4 pb-4">
          <h2 id="settings-heading" className="text-lg font-semibold mb-3" style={{ color: colors.textPrimary }}>
            Download Settings
          </h2>

          <div 
            className="rounded-xl overflow-hidden"
            style={{
              background: colors.cardBg,
              backdropFilter: colors.blur,
              WebkitBackdropFilter: colors.blur,
              border: colors.glassBorder,
              boxShadow: colors.shadow,
            }}
          >
            <button
              onClick={() => handleToggleSetting('autoDownload')}
              className="w-full p-4 flex items-center justify-between border-b"
              style={{ borderBottomColor: colors.border }}
              aria-pressed={settings.autoDownload}
              aria-label="Toggle auto-download new content"
            >
              <div className="flex items-center gap-3">
                <Download className="w-5 h-5" style={{ color: colors.iconColor }} />
                <div className="text-left">
                  <div className="font-semibold" style={{ color: colors.textPrimary }}>
                    Auto-Download New Content
                  </div>
                  <div className="text-xs" style={{ color: colors.textTertiary }}>
                    Automatically download recommended lessons
                  </div>
                </div>
              </div>
              <div 
                className={`w-12 h-6 rounded-full transition-all ${settings.autoDownload ? 'bg-green-500' : 'bg-gray-400'}`}
                aria-hidden="true"
              >
                <div 
                  className={`w-5 h-5 rounded-full bg-white transition-transform ${settings.autoDownload ? 'translate-x-6' : 'translate-x-0.5'} mt-0.5`}
                />
              </div>
            </button>

            <button
              onClick={() => handleToggleSetting('wifiOnly')}
              className="w-full p-4 flex items-center justify-between border-b"
              style={{ borderBottomColor: colors.border }}
              aria-pressed={settings.wifiOnly}
              aria-label="Toggle Wi-Fi only downloads"
            >
              <div className="flex items-center gap-3">
                <Wifi className="w-5 h-5" style={{ color: colors.iconColor }} />
                <div className="text-left">
                  <div className="font-semibold" style={{ color: colors.textPrimary }}>
                    Wi-Fi Only
                  </div>
                  <div className="text-xs" style={{ color: colors.textTertiary }}>
                    Only download content on Wi-Fi
                  </div>
                </div>
              </div>
              <div 
                className={`w-12 h-6 rounded-full transition-all ${settings.wifiOnly ? 'bg-green-500' : 'bg-gray-400'}`}
                aria-hidden="true"
              >
                <div 
                  className={`w-5 h-5 rounded-full bg-white transition-transform ${settings.wifiOnly ? 'translate-x-6' : 'translate-x-0.5'} mt-0.5`}
                />
              </div>
            </button>

            <button
              onClick={() => handleToggleSetting('autoDelete')}
              className="w-full p-4 flex items-center justify-between"
              aria-pressed={settings.autoDelete}
              aria-label="Toggle auto-delete old content"
            >
              <div className="flex items-center gap-3">
                <Trash2 className="w-5 h-5" style={{ color: colors.iconColor }} />
                <div className="text-left">
                  <div className="font-semibold" style={{ color: colors.textPrimary }}>
                    Auto-Delete Old Content
                  </div>
                  <div className="text-xs" style={{ color: colors.textTertiary }}>
                    Remove content not accessed in {settings.deleteAfterDays} days
                  </div>
                </div>
              </div>
              <div 
                className={`w-12 h-6 rounded-full transition-all ${settings.autoDelete ? 'bg-green-500' : 'bg-gray-400'}`}
                aria-hidden="true"
              >
                <div 
                  className={`w-5 h-5 rounded-full bg-white transition-transform ${settings.autoDelete ? 'translate-x-6' : 'translate-x-0.5'} mt-0.5`}
                />
              </div>
            </button>
          </div>
        </section>

        {/* Storage Management */}
        <section aria-labelledby="storage-heading" className="px-4 pb-4">
          <h2 id="storage-heading" className="text-lg font-semibold mb-3" style={{ color: colors.textPrimary }}>
            Storage Management
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
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <FileText className="w-5 h-5" style={{ color: colors.iconColor }} />
                  <span className="text-sm" style={{ color: colors.textPrimary }}>
                    Lessons
                  </span>
                </div>
                <span className="text-sm font-semibold" style={{ color: colors.textPrimary }}>
                  987 MB
                </span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Video className="w-5 h-5" style={{ color: colors.accentColor }} />
                  <span className="text-sm" style={{ color: colors.textPrimary }}>
                    Videos
                  </span>
                </div>
                <span className="text-sm font-semibold" style={{ color: colors.textPrimary }}>
                  645 MB
                </span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Archive className="w-5 h-5" style={{ color: colors.warningColor }} />
                  <span className="text-sm" style={{ color: colors.textPrimary }}>
                    Courses
                  </span>
                </div>
                <span className="text-sm font-semibold" style={{ color: colors.textPrimary }}>
                  128 MB
                </span>
              </div>
            </div>

            <Button
              className="w-full h-10 rounded-xl font-semibold mt-4"
              style={{ 
                background: colors.errorBg,
                color: colors.errorColor,
                border: `1px solid ${colors.errorColor}`,
              }}
              aria-label="Clear all downloaded content"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Clear All Downloads
            </Button>
          </div>
        </section>

        {/* Recent Sync Activity */}
        <section aria-labelledby="sync-heading" className="px-4 pb-6">
          <h2 id="sync-heading" className="text-lg font-semibold mb-3" style={{ color: colors.textPrimary }}>
            Recent Sync Activity
          </h2>

          <div className="space-y-2">
            {syncActivity.map((activity) => (
              <div
                key={activity.id}
                className="rounded-xl p-3"
                style={{
                  background: colors.cardBg,
                  backdropFilter: colors.blur,
                  WebkitBackdropFilter: colors.blur,
                  border: colors.glassBorder,
                  boxShadow: colors.shadow,
                }}
              >
                <div className="flex items-start gap-3">
                  <div 
                    className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                    style={{ 
                      background: activity.status === 'success' ? colors.successBg :
                                  activity.status === 'failed' ? colors.errorBg :
                                  colors.iconBg,
                    }}
                  >
                    {activity.status === 'success' && (
                      <CheckCircle2 className="w-4 h-4" style={{ color: colors.successColor }} />
                    )}
                    {activity.status === 'failed' && (
                      <XCircle className="w-4 h-4" style={{ color: colors.errorColor }} />
                    )}
                    {activity.status === 'in-progress' && (
                      <Loader2 className="w-4 h-4 animate-spin" style={{ color: colors.iconColor }} />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold mb-1" style={{ color: colors.textPrimary }}>
                      {activity.action}
                    </div>
                    <div className="text-xs mb-1" style={{ color: colors.textTertiary }}>
                      {activity.details}
                    </div>
                    <div className="text-xs" style={{ color: colors.textTertiary }}>
                      {activity.timestamp}
                    </div>
                  </div>
                </div>
              </div>
            ))}
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
              <strong style={{ color: colors.textPrimary }}>Offline Mode Tips:</strong> Downloaded content is available without internet. Enable Wi-Fi only downloads to save mobile data. Auto-delete helps manage storage automatically.
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
