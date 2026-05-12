import { useState } from 'react';
import { Button } from './ui/button';
import { useTheme } from '../context/ThemeContext';
import { useApp } from '../context/AppContext';
import exampleImage from 'figma:asset/04b6c0272213ab0a49a50df8a3be788d775f0c09.png';
import { 
  X, 
  Plus,
  Search,
  Grid,
  List,
  Filter,
  Star,
  Download,
  Share2,
  Eye,
  Edit,
  Copy,
  Trash2,
  ChevronRight,
  ChevronLeft,
  Image as ImageIcon,
  Palette,
  Sun,
  Moon,
  Cloud,
  CloudRain,
  CloudSnow,
  Lightbulb,
  Layers,
  Box,
  Package,
  Users,
  Lock,
  Unlock,
  Crown,
  Heart,
  Play,
  Save,
  Check,
  Settings,
  MoreVertical,
  Upload,
  Globe,
  MapPin,
  Calendar,
  Clock,
  TrendingUp,
  Award,
  Sparkles,
  Zap,
  Target,
  Circle,
  Square,
  Triangle,
  Hexagon,
  Move,
  RotateCw,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Minimize2,
  Home,
  GraduationCap,
  Trees,
  Building,
  Store,
  Coffee,
  Briefcase,
  Mountain,
  Waves,
  BookOpen,
  Music,
  Film,
  Camera,
  Video,
  Shuffle,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Info,
  Tag,
  Bookmark,
} from 'lucide-react';

interface ARSceneCreatorProps {
  onExit: () => void;
}

interface SceneTemplate {
  id: string;
  name: string;
  description: string;
  thumbnail: string;
  category: 'starter' | 'community' | 'premium';
  creator?: string;
  rating?: number;
  downloads?: number;
  tags: string[];
  isPremium: boolean;
  backgrounds: string[];
  lighting: string;
  effects: string[];
  furniture: string[];
  usageCount?: number;
  lastUsed?: string;
  isPublic?: boolean;
}

interface CustomScene {
  id: string;
  name: string;
  description: string;
  background: {
    type: 'solid' | 'gradient' | 'image' | '360photo';
    value: string;
    value2?: string;
  };
  lighting: {
    ambient: number;
    directional: number;
    color: string;
  };
  atmosphere: {
    timeOfDay: 'morning' | 'afternoon' | 'evening' | 'night';
    weather: 'clear' | 'cloudy' | 'rainy' | 'snowy';
  };
  floor: {
    texture: string;
    pattern: string;
  };
  furniture: Array<{
    id: string;
    type: string;
    position: { x: number; y: number; z: number };
    rotation: number;
    scale: number;
  }>;
  avatar: {
    position: { x: number; y: number; z: number };
    rotation: number;
  };
  practiceScenario?: {
    vocabularyFocus: string[];
    difficulty: 'beginner' | 'intermediate' | 'advanced';
    conversationFlow: string[];
  };
  isDefault: boolean;
  collection?: string;
  isPublic: boolean;
  allowRemix: boolean;
  tags: string[];
  usageCount: number;
  lastUsed: string;
  createdDate: string;
}

export function ARSceneCreator({ onExit }: ARSceneCreatorProps) {
  const { theme } = useTheme();
  const { userProgress } = useApp();

  const [activeView, setActiveView] = useState<'gallery' | 'customize' | 'marketplace' | 'library'>('gallery');
  const [selectedTemplate, setSelectedTemplate] = useState<SceneTemplate | null>(null);
  const [customizingScene, setCustomizingScene] = useState<CustomScene | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [showPreview, setShowPreview] = useState(false);
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [isPremium] = useState(true);

  // Customization state
  const [selectedBackground, setSelectedBackground] = useState<string>('gradient1');
  const [ambientLight, setAmbientLight] = useState(70);
  const [directionalLight, setDirectionalLight] = useState(50);
  const [lightColor, setLightColor] = useState('#FFFFFF');
  const [timeOfDay, setTimeOfDay] = useState<'morning' | 'afternoon' | 'evening' | 'night'>('afternoon');
  const [weather, setWeather] = useState<'clear' | 'cloudy' | 'rainy' | 'snowy'>('clear');
  const [selectedFloor, setSelectedFloor] = useState('wood');
  const [placedFurniture, setPlacedFurniture] = useState<Array<{id: string; type: string; x: number; y: number}>>([]);

  // Scene templates
  const [sceneTemplates] = useState<SceneTemplate[]>([
    {
      id: 'living-room',
      name: 'Cozy Living Room',
      description: 'Perfect for practicing everyday conversations at home',
      thumbnail: exampleImage,
      category: 'starter',
      tags: ['Home', 'Casual', 'Beginner'],
      isPremium: false,
      backgrounds: ['warm-gradient', 'beige-solid'],
      lighting: 'soft-warm',
      effects: ['morning-sun'],
      furniture: ['sofa', 'coffee-table', 'lamp', 'rug'],
      usageCount: 245,
      downloads: 1234,
      rating: 4.8,
    },
    {
      id: 'classroom',
      name: 'Modern Classroom',
      description: 'Ideal for educational vocabulary and formal settings',
      thumbnail: exampleImage,
      category: 'starter',
      tags: ['Education', 'Formal', 'Intermediate'],
      isPremium: false,
      backgrounds: ['blue-gradient', 'white-solid'],
      lighting: 'bright-neutral',
      effects: ['afternoon-light'],
      furniture: ['desk', 'chair', 'whiteboard', 'bookshelf'],
      usageCount: 189,
      downloads: 892,
      rating: 4.6,
    },
    {
      id: 'outdoor-park',
      name: 'Sunny Park',
      description: 'Natural outdoor environment for relaxed practice',
      thumbnail: exampleImage,
      category: 'starter',
      tags: ['Outdoor', 'Nature', 'Beginner'],
      isPremium: false,
      backgrounds: ['sky-360', 'nature-photo'],
      lighting: 'natural-daylight',
      effects: ['sunny-day', 'gentle-breeze'],
      furniture: ['bench', 'tree', 'grass-patch'],
      usageCount: 312,
      downloads: 1567,
      rating: 4.9,
    },
    {
      id: 'coffee-shop',
      name: 'Urban Coffee Shop',
      description: 'Practice social interactions in a café setting',
      thumbnail: exampleImage,
      category: 'community',
      creator: 'Sarah_ASL',
      tags: ['Social', 'Casual', 'Urban'],
      isPremium: false,
      backgrounds: ['warm-brick', 'industrial'],
      lighting: 'ambient-warm',
      effects: ['afternoon', 'indoor-cozy'],
      furniture: ['table', 'chair', 'counter', 'coffee-machine'],
      usageCount: 167,
      downloads: 743,
      rating: 4.7,
    },
    {
      id: 'office-space',
      name: 'Professional Office',
      description: 'Practice work-related vocabulary and professional settings',
      thumbnail: exampleImage,
      category: 'community',
      creator: 'DeafPro_Mike',
      tags: ['Work', 'Professional', 'Advanced'],
      isPremium: true,
      backgrounds: ['gray-gradient', 'modern-office'],
      lighting: 'bright-cool',
      effects: ['morning', 'office-lighting'],
      furniture: ['desk', 'office-chair', 'computer', 'filing-cabinet'],
      usageCount: 98,
      downloads: 456,
      rating: 4.5,
    },
    {
      id: 'beach-sunset',
      name: 'Sunset Beach',
      description: 'Beautiful beach environment for relaxed learning',
      thumbnail: exampleImage,
      category: 'premium',
      tags: ['Nature', 'Scenic', 'Relaxation'],
      isPremium: true,
      backgrounds: ['sunset-360', 'ocean-photo'],
      lighting: 'golden-hour',
      effects: ['sunset', 'ocean-waves'],
      furniture: ['beach-chair', 'umbrella', 'surfboard'],
      usageCount: 203,
      downloads: 987,
      rating: 4.9,
    },
    {
      id: 'winter-cabin',
      name: 'Winter Cabin',
      description: 'Cozy cabin setting with snow effects',
      thumbnail: exampleImage,
      category: 'premium',
      tags: ['Seasonal', 'Winter', 'Cozy'],
      isPremium: true,
      backgrounds: ['snowy-360', 'cabin-interior'],
      lighting: 'warm-firelight',
      effects: ['evening', 'snow-falling'],
      furniture: ['fireplace', 'armchair', 'rug', 'bookshelf'],
      usageCount: 145,
      downloads: 654,
      rating: 4.8,
    },
    {
      id: 'hospital-room',
      name: 'Medical Facility',
      description: 'Practice medical vocabulary in healthcare setting',
      thumbnail: exampleImage,
      category: 'premium',
      tags: ['Medical', 'Professional', 'Advanced'],
      isPremium: true,
      backgrounds: ['white-clinical', 'hospital-room'],
      lighting: 'bright-clinical',
      effects: ['afternoon', 'sterile-environment'],
      furniture: ['hospital-bed', 'medical-cart', 'chair', 'monitor'],
      usageCount: 76,
      downloads: 321,
      rating: 4.6,
    },
    {
      id: 'art-gallery',
      name: 'Contemporary Gallery',
      description: 'Artistic space for culture and art vocabulary',
      thumbnail: exampleImage,
      category: 'community',
      creator: 'ArtASL_Emma',
      tags: ['Art', 'Culture', 'Intermediate'],
      isPremium: false,
      backgrounds: ['white-minimal', 'gallery-space'],
      lighting: 'spotlight-dramatic',
      effects: ['afternoon', 'gallery-lighting'],
      furniture: ['art-piece', 'pedestal', 'bench'],
      usageCount: 134,
      downloads: 567,
      rating: 4.7,
    },
    {
      id: 'restaurant',
      name: 'Fine Dining',
      description: 'Practice food and dining vocabulary',
      thumbnail: exampleImage,
      category: 'community',
      creator: 'ChefSigns',
      tags: ['Food', 'Social', 'Intermediate'],
      isPremium: true,
      backgrounds: ['elegant-interior', 'restaurant'],
      lighting: 'ambient-romantic',
      effects: ['evening', 'candlelight'],
      furniture: ['dining-table', 'chairs', 'menu-board'],
      usageCount: 112,
      downloads: 489,
      rating: 4.6,
    },
    {
      id: 'gym-fitness',
      name: 'Fitness Center',
      description: 'Learn sports and fitness vocabulary',
      thumbnail: exampleImage,
      category: 'community',
      creator: 'FitSign_Josh',
      tags: ['Sports', 'Health', 'Beginner'],
      isPremium: false,
      backgrounds: ['gym-interior', 'blue-energetic'],
      lighting: 'bright-energetic',
      effects: ['morning', 'active-environment'],
      furniture: ['weight-bench', 'dumbbells', 'yoga-mat', 'mirror'],
      usageCount: 156,
      downloads: 678,
      rating: 4.5,
    },
    {
      id: 'library',
      name: 'Quiet Library',
      description: 'Study and education vocabulary in peaceful setting',
      thumbnail: exampleImage,
      category: 'starter',
      tags: ['Education', 'Quiet', 'Study'],
      isPremium: false,
      backgrounds: ['warm-wood', 'library-interior'],
      lighting: 'soft-reading',
      effects: ['afternoon', 'quiet-ambience'],
      furniture: ['bookshelf', 'reading-table', 'desk-lamp', 'chair'],
      usageCount: 198,
      downloads: 834,
      rating: 4.7,
    },
  ]);

  // My saved scenes
  const [myScenes] = useState<CustomScene[]>([
    {
      id: 'my-scene-1',
      name: 'My Daily Practice Space',
      description: 'My go-to environment for morning practice sessions',
      background: { type: 'gradient', value: '#E0F2FE', value2: '#EDE9FE' },
      lighting: { ambient: 70, directional: 50, color: '#FFFFFF' },
      atmosphere: { timeOfDay: 'morning', weather: 'clear' },
      floor: { texture: 'wood', pattern: 'herringbone' },
      furniture: [
        { id: 'f1', type: 'desk', position: { x: 0, y: 0, z: -2 }, rotation: 0, scale: 1 },
        { id: 'f2', type: 'chair', position: { x: 0, y: 0, z: 0 }, rotation: 180, scale: 1 },
      ],
      avatar: { position: { x: 0, y: 0, z: 2 }, rotation: 0 },
      practiceScenario: {
        vocabularyFocus: ['Greetings', 'Basic Responses'],
        difficulty: 'beginner',
        conversationFlow: ['Hello', 'How are you?', 'Thank you'],
      },
      isDefault: true,
      collection: 'Personal Favorites',
      isPublic: false,
      allowRemix: false,
      tags: ['Daily', 'Morning', 'Beginner'],
      usageCount: 47,
      lastUsed: '2026-01-12',
      createdDate: '2025-12-15',
    },
    {
      id: 'my-scene-2',
      name: 'Professional Meeting Room',
      description: 'For practicing work-related conversations',
      background: { type: 'solid', value: '#F8FAFC' },
      lighting: { ambient: 80, directional: 60, color: '#FFFFFF' },
      atmosphere: { timeOfDay: 'afternoon', weather: 'clear' },
      floor: { texture: 'carpet', pattern: 'solid' },
      furniture: [
        { id: 'f3', type: 'conference-table', position: { x: 0, y: 0, z: -1 }, rotation: 0, scale: 1.2 },
        { id: 'f4', type: 'office-chair', position: { x: -1, y: 0, z: 0 }, rotation: 90, scale: 1 },
        { id: 'f5', type: 'whiteboard', position: { x: -2, y: 1, z: -3 }, rotation: 0, scale: 1 },
      ],
      avatar: { position: { x: 1, y: 0, z: 2 }, rotation: -45 },
      practiceScenario: {
        vocabularyFocus: ['Work', 'Professional', 'Meetings'],
        difficulty: 'advanced',
        conversationFlow: ['Good morning', 'Let\'s begin', 'Any questions?'],
      },
      isDefault: false,
      collection: 'Work Scenarios',
      isPublic: true,
      allowRemix: true,
      tags: ['Professional', 'Work', 'Advanced'],
      usageCount: 23,
      lastUsed: '2026-01-11',
      createdDate: '2026-01-05',
    },
    {
      id: 'my-scene-3',
      name: 'Outdoor Garden Practice',
      description: 'Relaxing outdoor environment for casual learning',
      background: { type: '360photo', value: 'garden-360' },
      lighting: { ambient: 85, directional: 70, color: '#FFE5B4' },
      atmosphere: { timeOfDay: 'afternoon', weather: 'clear' },
      floor: { texture: 'grass', pattern: 'natural' },
      furniture: [
        { id: 'f6', type: 'garden-bench', position: { x: 1, y: 0, z: -2 }, rotation: 45, scale: 1 },
        { id: 'f7', type: 'flower-pot', position: { x: -1, y: 0, z: -1 }, rotation: 0, scale: 0.8 },
      ],
      avatar: { position: { x: 0, y: 0, z: 1.5 }, rotation: 0 },
      isDefault: false,
      isPublic: true,
      allowRemix: true,
      tags: ['Outdoor', 'Nature', 'Relaxing'],
      usageCount: 31,
      lastUsed: '2026-01-10',
      createdDate: '2025-12-28',
    },
  ]);

  // Background options
  const backgrounds = [
    { id: 'gradient1', name: 'Sky Blue', type: 'gradient', value: '#E0F2FE', value2: '#EDE9FE' },
    { id: 'gradient2', name: 'Sunset', type: 'gradient', value: '#FED7AA', value2: '#FCA5A5' },
    { id: 'gradient3', name: 'Ocean', type: 'gradient', value: '#DBEAFE', value2: '#A5F3FC' },
    { id: 'solid1', name: 'Pure White', type: 'solid', value: '#FFFFFF' },
    { id: 'solid2', name: 'Soft Gray', type: 'solid', value: '#F8FAFC' },
    { id: 'solid3', name: 'Warm Beige', type: 'solid', value: '#FAF5F0' },
    { id: 'image1', name: 'Modern Office', type: 'image', value: 'office-bg' },
    { id: 'image2', name: 'Home Interior', type: 'image', value: 'home-bg' },
    { id: '360-1', name: 'Nature 360°', type: '360photo', value: 'nature-360' },
    { id: '360-2', name: 'City 360°', type: '360photo', value: 'city-360' },
  ];

  // Floor textures
  const floorTextures = [
    { id: 'wood', name: 'Hardwood', pattern: 'planks' },
    { id: 'tile', name: 'Tile', pattern: 'grid' },
    { id: 'carpet', name: 'Carpet', pattern: 'solid' },
    { id: 'concrete', name: 'Concrete', pattern: 'smooth' },
    { id: 'grass', name: 'Grass', pattern: 'natural' },
  ];

  // Furniture items
  const furnitureItems = [
    { id: 'desk', name: 'Desk', icon: Box, category: 'Work' },
    { id: 'chair', name: 'Chair', icon: Box, category: 'Seating' },
    { id: 'sofa', name: 'Sofa', icon: Box, category: 'Seating' },
    { id: 'table', name: 'Table', icon: Box, category: 'Work' },
    { id: 'bookshelf', name: 'Bookshelf', icon: BookOpen, category: 'Storage' },
    { id: 'lamp', name: 'Lamp', icon: Lightbulb, category: 'Lighting' },
    { id: 'plant', name: 'Plant', icon: Trees, category: 'Decor' },
    { id: 'rug', name: 'Rug', icon: Box, category: 'Decor' },
  ];

  const filteredTemplates = sceneTemplates.filter(template => {
    if (searchQuery && !template.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !template.description.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    if (selectedCategories.length > 0 && !selectedCategories.includes(template.category)) {
      return false;
    }
    if (selectedTags.length > 0 && !template.tags.some(tag => selectedTags.includes(tag))) {
      return false;
    }
    if (!isPremium && template.isPremium) {
      return false;
    }
    return true;
  });

  const handleCreateNew = () => {
    const newScene: CustomScene = {
      id: `scene-${Date.now()}`,
      name: 'New Scene',
      description: 'My custom AR scene',
      background: { type: 'gradient', value: '#E0F2FE', value2: '#EDE9FE' },
      lighting: { ambient: 70, directional: 50, color: '#FFFFFF' },
      atmosphere: { timeOfDay: 'afternoon', weather: 'clear' },
      floor: { texture: 'wood', pattern: 'herringbone' },
      furniture: [],
      avatar: { position: { x: 0, y: 0, z: 2 }, rotation: 0 },
      isDefault: false,
      isPublic: false,
      allowRemix: false,
      tags: [],
      usageCount: 0,
      lastUsed: new Date().toISOString().split('T')[0],
      createdDate: new Date().toISOString().split('T')[0],
    };
    setCustomizingScene(newScene);
    setActiveView('customize');
  };

  const handleEditScene = (scene: CustomScene) => {
    setCustomizingScene(scene);
    setActiveView('customize');
  };

  const toggleFilter = (filterArray: string[], setFilterArray: (arr: string[]) => void, value: string) => {
    if (filterArray.includes(value)) {
      setFilterArray(filterArray.filter(v => v !== value));
    } else {
      setFilterArray([...filterArray, value]);
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

  return (
    <div 
      className="h-full flex flex-col"
      style={{ background: colors.bg, color: colors.textPrimary }}
      role="main"
      aria-labelledby="scene-creator-title"
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
            aria-label="Exit AR scene creator"
            className="flex-shrink-0"
          >
            <X className="w-6 h-6" />
          </Button>
          <div className="flex-1 min-w-0">
            <h1 
              id="scene-creator-title" 
              className="text-xl sm:text-2xl font-bold truncate"
              style={{ fontFamily: 'Poppins, sans-serif' }}
            >
              AR Scene Creator
            </h1>
            <p className="text-sm truncate" style={{ color: colors.textSecondary }}>
              {activeView === 'gallery' && 'Choose a template to start'}
              {activeView === 'customize' && 'Customize your AR environment'}
              {activeView === 'marketplace' && 'Browse community scenes'}
              {activeView === 'library' && 'Manage your scenes'}
            </p>
          </div>
          {activeView === 'gallery' && (
            <Button
              onClick={handleCreateNew}
              size="icon"
              className="flex-shrink-0"
              style={{ 
                background: colors.iconColor,
                color: theme === 'dark' ? '#0F0F23' : '#FFFFFF',
              }}
              aria-label="Create new scene"
            >
              <Plus className="w-5 h-5" />
            </Button>
          )}
        </div>

        {/* Navigation Tabs */}
        <div className="flex gap-2 overflow-x-auto" role="tablist" aria-label="Scene creator sections">
          {[
            { id: 'gallery', label: 'Gallery', icon: Grid },
            { id: 'customize', label: 'Customize', icon: Settings },
            { id: 'marketplace', label: 'Marketplace', icon: Store },
            { id: 'library', label: 'My Scenes', icon: Bookmark },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeView === tab.id;
            
            return (
              <button
                key={tab.id}
                onClick={() => setActiveView(tab.id as any)}
                className="flex items-center gap-2 px-4 py-2 rounded-lg whitespace-nowrap"
                style={{
                  background: isActive ? colors.iconBg : 'transparent',
                  border: isActive ? `1px solid ${colors.iconColor}` : `1px solid ${colors.border}`,
                  color: isActive ? colors.iconColor : colors.textSecondary,
                }}
                role="tab"
                aria-selected={isActive}
                aria-controls={`${tab.id}-panel`}
              >
                <Icon className="w-4 h-4" />
                <span className="text-sm font-semibold">{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        {/* Gallery View */}
        {activeView === 'gallery' && (
          <div role="tabpanel" id="gallery-panel">
            {/* Search and Filters */}
            <div className="p-4 border-b" style={{ borderBottomColor: colors.border }}>
              <div className="relative mb-3">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5" style={{ color: colors.textTertiary }} aria-hidden="true" />
                <input
                  type="text"
                  placeholder="Search scene templates..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full h-11 pl-10 pr-24 rounded-xl"
                  style={{
                    background: colors.cardBg,
                    border: colors.glassBorder,
                    color: colors.textPrimary,
                  }}
                  aria-label="Search scenes"
                />
                <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
                  <button
                    onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
                    className="p-2 rounded-lg"
                    style={{ background: colors.iconBg, color: colors.iconColor }}
                    aria-label={`Switch to ${viewMode === 'grid' ? 'list' : 'grid'} view`}
                  >
                    {viewMode === 'grid' ? <List className="w-4 h-4" /> : <Grid className="w-4 h-4" />}
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

              {/* Filter Panel */}
              {showFilters && (
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
                  aria-label="Scene filters"
                >
                  <div>
                    <div className="text-sm font-semibold mb-2" style={{ color: colors.textPrimary }}>
                      Category
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {['starter', 'community', 'premium'].map((category) => {
                        const isSelected = selectedCategories.includes(category);
                        return (
                          <button
                            key={category}
                            onClick={() => toggleFilter(selectedCategories, setSelectedCategories, category)}
                            className="px-3 py-1 rounded-full text-xs font-medium capitalize"
                            style={{
                              background: isSelected ? colors.iconColor : colors.border,
                              color: isSelected ? (theme === 'dark' ? '#0F0F23' : '#FFFFFF') : colors.textTertiary,
                            }}
                            aria-pressed={isSelected}
                          >
                            {category}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div>
                    <div className="text-sm font-semibold mb-2" style={{ color: colors.textPrimary }}>
                      Tags
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {['Home', 'Education', 'Outdoor', 'Work', 'Social', 'Nature'].map((tag) => {
                        const isSelected = selectedTags.includes(tag);
                        return (
                          <button
                            key={tag}
                            onClick={() => toggleFilter(selectedTags, setSelectedTags, tag)}
                            className="px-3 py-1 rounded-full text-xs font-medium"
                            style={{
                              background: isSelected ? colors.accentColor : colors.border,
                              color: isSelected ? '#FFFFFF' : colors.textTertiary,
                            }}
                            aria-pressed={isSelected}
                          >
                            {tag}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Templates Grid/List */}
            <div className="p-4">
              {viewMode === 'grid' ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {filteredTemplates.map((template) => (
                    <div
                      key={template.id}
                      className="rounded-xl overflow-hidden"
                      style={{
                        background: colors.cardBg,
                        backdropFilter: colors.blur,
                        WebkitBackdropFilter: colors.blur,
                        border: colors.glassBorder,
                        boxShadow: colors.shadow,
                      }}
                    >
                      <div className="relative">
                        <img
                          src={template.thumbnail}
                          alt={template.name}
                          className="w-full h-40 object-cover"
                        />
                        {template.isPremium && (
                          <div 
                            className="absolute top-2 right-2 px-2 py-1 rounded-full flex items-center gap-1"
                            style={{ background: 'rgba(0, 0, 0, 0.6)' }}
                          >
                            <Crown className="w-3 h-3 text-yellow-400" />
                            <span className="text-xs text-white">Premium</span>
                          </div>
                        )}
                        {template.category === 'community' && (
                          <div 
                            className="absolute top-2 left-2 px-2 py-1 rounded-full flex items-center gap-1"
                            style={{ background: 'rgba(0, 0, 0, 0.6)' }}
                          >
                            <Users className="w-3 h-3 text-white" />
                            <span className="text-xs text-white">{template.creator}</span>
                          </div>
                        )}
                      </div>
                      <div className="p-3">
                        <h3 className="font-semibold mb-1" style={{ color: colors.textPrimary }}>
                          {template.name}
                        </h3>
                        <p className="text-sm mb-2 line-clamp-2" style={{ color: colors.textTertiary }}>
                          {template.description}
                        </p>
                        <div className="flex flex-wrap gap-1 mb-3">
                          {template.tags.map((tag) => (
                            <span
                              key={tag}
                              className="px-2 py-0.5 rounded text-xs"
                              style={{ background: colors.iconBg, color: colors.iconColor }}
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                        <div className="flex items-center justify-between text-xs mb-3" style={{ color: colors.textTertiary }}>
                          <div className="flex items-center gap-3">
                            <span className="flex items-center gap-1">
                              <Star className="w-3 h-3" style={{ color: colors.warningColor }} fill={colors.warningColor} />
                              {template.rating}
                            </span>
                            <span className="flex items-center gap-1">
                              <Download className="w-3 h-3" />
                              {template.downloads}
                            </span>
                          </div>
                        </div>
                        <Button
                          onClick={() => {
                            setSelectedTemplate(template);
                            handleCreateNew();
                          }}
                          className="w-full h-10 rounded-xl font-semibold"
                          style={{ 
                            background: colors.iconColor,
                            color: theme === 'dark' ? '#0F0F23' : '#FFFFFF',
                          }}
                          aria-label={`Use ${template.name} template`}
                        >
                          Use Template
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="space-y-2">
                  {filteredTemplates.map((template) => (
                    <button
                      key={template.id}
                      onClick={() => {
                        setSelectedTemplate(template);
                        handleCreateNew();
                      }}
                      className="w-full rounded-xl p-3 text-left"
                      style={{
                        background: colors.cardBg,
                        backdropFilter: colors.blur,
                        WebkitBackdropFilter: colors.blur,
                        border: colors.glassBorder,
                        boxShadow: colors.shadow,
                      }}
                      aria-label={`Use ${template.name} template`}
                    >
                      <div className="flex items-center gap-3">
                        <img
                          src={template.thumbnail}
                          alt={template.name}
                          className="w-20 h-20 rounded-lg object-cover flex-shrink-0"
                        />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-semibold truncate" style={{ color: colors.textPrimary }}>
                              {template.name}
                            </h3>
                            {template.isPremium && (
                              <Crown className="w-4 h-4 flex-shrink-0" style={{ color: colors.warningColor }} />
                            )}
                          </div>
                          <p className="text-sm mb-2 line-clamp-1" style={{ color: colors.textTertiary }}>
                            {template.description}
                          </p>
                          <div className="flex items-center gap-3 text-xs" style={{ color: colors.textTertiary }}>
                            <span className="flex items-center gap-1">
                              <Star className="w-3 h-3" style={{ color: colors.warningColor }} fill={colors.warningColor} />
                              {template.rating}
                            </span>
                            <span>•</span>
                            <span className="flex items-center gap-1">
                              <Download className="w-3 h-3" />
                              {template.downloads}
                            </span>
                          </div>
                        </div>
                        <ChevronRight className="w-5 h-5 flex-shrink-0" style={{ color: colors.textTertiary }} />
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Customize View */}
        {activeView === 'customize' && customizingScene && (
          <div role="tabpanel" id="customize-panel" className="p-4 space-y-4">
            {/* Preview */}
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
              <div className="relative">
                <img
                  src={exampleImage}
                  alt="Scene preview"
                  className="w-full h-48 object-cover"
                />
                <div className="absolute top-2 right-2 flex gap-2">
                  <Button
                    size="icon"
                    className="w-8 h-8"
                    style={{ background: 'rgba(0, 0, 0, 0.6)' }}
                    aria-label="Preview scene"
                    onClick={() => setShowPreview(true)}
                  >
                    <Eye className="w-4 h-4 text-white" />
                  </Button>
                  <Button
                    size="icon"
                    className="w-8 h-8"
                    style={{ background: 'rgba(0, 0, 0, 0.6)' }}
                    aria-label="Fullscreen preview"
                  >
                    <Maximize2 className="w-4 h-4 text-white" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Background Selection */}
            <section aria-labelledby="background-heading">
              <h2 id="background-heading" className="text-lg font-semibold mb-3" style={{ color: colors.textPrimary }}>
                Background
              </h2>
              <div className="grid grid-cols-3 gap-2">
                {backgrounds.slice(0, 6).map((bg) => (
                  <button
                    key={bg.id}
                    onClick={() => setSelectedBackground(bg.id)}
                    className="aspect-video rounded-lg relative overflow-hidden"
                    style={{
                      background: bg.type === 'gradient' 
                        ? `linear-gradient(135deg, ${bg.value} 0%, ${bg.value2} 100%)`
                        : bg.value,
                      border: selectedBackground === bg.id ? `2px solid ${colors.iconColor}` : `1px solid ${colors.border}`,
                    }}
                    aria-label={`Select ${bg.name} background`}
                    aria-pressed={selectedBackground === bg.id}
                  >
                    {selectedBackground === bg.id && (
                      <div className="absolute inset-0 flex items-center justify-center" style={{ background: 'rgba(0, 0, 0, 0.3)' }}>
                        <Check className="w-6 h-6 text-white" />
                      </div>
                    )}
                    <div className="absolute bottom-1 left-1 text-xs text-white px-1 py-0.5 rounded" style={{ background: 'rgba(0, 0, 0, 0.6)' }}>
                      {bg.name}
                    </div>
                  </button>
                ))}
              </div>
            </section>

            {/* Lighting Controls */}
            <section aria-labelledby="lighting-heading">
              <h2 id="lighting-heading" className="text-lg font-semibold mb-3" style={{ color: colors.textPrimary }}>
                Lighting
              </h2>
              <div className="space-y-3">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-sm font-medium" style={{ color: colors.textSecondary }}>
                      Ambient Light
                    </label>
                    <span className="text-sm font-bold" style={{ color: colors.textPrimary }}>
                      {ambientLight}%
                    </span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={ambientLight}
                    onChange={(e) => setAmbientLight(Number(e.target.value))}
                    className="w-full"
                    aria-label="Ambient light intensity"
                    aria-valuemin={0}
                    aria-valuemax={100}
                    aria-valuenow={ambientLight}
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-sm font-medium" style={{ color: colors.textSecondary }}>
                      Directional Light
                    </label>
                    <span className="text-sm font-bold" style={{ color: colors.textPrimary }}>
                      {directionalLight}%
                    </span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={directionalLight}
                    onChange={(e) => setDirectionalLight(Number(e.target.value))}
                    className="w-full"
                    aria-label="Directional light intensity"
                    aria-valuemin={0}
                    aria-valuemax={100}
                    aria-valuenow={directionalLight}
                  />
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block" style={{ color: colors.textSecondary }}>
                    Light Color
                  </label>
                  <div className="flex gap-2">
                    {['#FFFFFF', '#FFE5B4', '#B4D4FF', '#FFB4C8'].map((color) => (
                      <button
                        key={color}
                        onClick={() => setLightColor(color)}
                        className="w-12 h-12 rounded-lg"
                        style={{
                          background: color,
                          border: lightColor === color ? `3px solid ${colors.iconColor}` : `1px solid ${colors.border}`,
                        }}
                        aria-label={`Select ${color} light color`}
                        aria-pressed={lightColor === color}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </section>

            {/* Atmospheric Effects */}
            <section aria-labelledby="atmosphere-heading">
              <h2 id="atmosphere-heading" className="text-lg font-semibold mb-3" style={{ color: colors.textPrimary }}>
                Atmosphere
              </h2>
              <div className="grid grid-cols-2 gap-3 mb-3">
                <div>
                  <label className="text-sm font-medium mb-2 block" style={{ color: colors.textSecondary }}>
                    Time of Day
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { id: 'morning', icon: Sunrise, label: 'Morning' },
                      { id: 'afternoon', icon: Sun, label: 'Afternoon' },
                      { id: 'evening', icon: Sunset, label: 'Evening' },
                      { id: 'night', icon: Moon, label: 'Night' },
                    ].map((time) => {
                      const Icon = time.icon;
                      const isSelected = timeOfDay === time.id;
                      return (
                        <button
                          key={time.id}
                          onClick={() => setTimeOfDay(time.id as any)}
                          className="p-2 rounded-lg flex flex-col items-center gap-1"
                          style={{
                            background: isSelected ? colors.iconBg : colors.border,
                            border: isSelected ? `1px solid ${colors.iconColor}` : 'none',
                          }}
                          aria-label={time.label}
                          aria-pressed={isSelected}
                        >
                          <Icon className="w-5 h-5" style={{ color: isSelected ? colors.iconColor : colors.textTertiary }} />
                          <span className="text-xs" style={{ color: isSelected ? colors.iconColor : colors.textTertiary }}>
                            {time.label}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block" style={{ color: colors.textSecondary }}>
                    Weather
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { id: 'clear', icon: Sun, label: 'Clear' },
                      { id: 'cloudy', icon: Cloud, label: 'Cloudy' },
                      { id: 'rainy', icon: CloudRain, label: 'Rainy' },
                      { id: 'snowy', icon: CloudSnow, label: 'Snowy' },
                    ].map((w) => {
                      const Icon = w.icon;
                      const isSelected = weather === w.id;
                      return (
                        <button
                          key={w.id}
                          onClick={() => setWeather(w.id as any)}
                          className="p-2 rounded-lg flex flex-col items-center gap-1"
                          style={{
                            background: isSelected ? colors.iconBg : colors.border,
                            border: isSelected ? `1px solid ${colors.iconColor}` : 'none',
                          }}
                          aria-label={w.label}
                          aria-pressed={isSelected}
                        >
                          <Icon className="w-5 h-5" style={{ color: isSelected ? colors.iconColor : colors.textTertiary }} />
                          <span className="text-xs" style={{ color: isSelected ? colors.iconColor : colors.textTertiary }}>
                            {w.label}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            </section>

            {/* Floor Texture */}
            <section aria-labelledby="floor-heading">
              <h2 id="floor-heading" className="text-lg font-semibold mb-3" style={{ color: colors.textPrimary }}>
                Floor Texture
              </h2>
              <div className="grid grid-cols-3 gap-2">
                {floorTextures.map((floor) => (
                  <button
                    key={floor.id}
                    onClick={() => setSelectedFloor(floor.id)}
                    className="p-3 rounded-lg text-center"
                    style={{
                      background: selectedFloor === floor.id ? colors.iconBg : colors.border,
                      border: selectedFloor === floor.id ? `1px solid ${colors.iconColor}` : 'none',
                      color: selectedFloor === floor.id ? colors.iconColor : colors.textTertiary,
                    }}
                    aria-label={`Select ${floor.name} floor`}
                    aria-pressed={selectedFloor === floor.id}
                  >
                    <div className="text-sm font-medium">{floor.name}</div>
                    <div className="text-xs opacity-70">{floor.pattern}</div>
                  </button>
                ))}
              </div>
            </section>

            {/* Furniture Placement */}
            <section aria-labelledby="furniture-heading">
              <h2 id="furniture-heading" className="text-lg font-semibold mb-3" style={{ color: colors.textPrimary }}>
                Furniture & Props
              </h2>
              <div className="grid grid-cols-4 gap-2 mb-3">
                {furnitureItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.id}
                      onClick={() => setPlacedFurniture([...placedFurniture, { id: `${item.id}-${Date.now()}`, type: item.id, x: 0, y: 0 }])}
                      className="p-3 rounded-lg flex flex-col items-center gap-1"
                      style={{
                        background: colors.cardBg,
                        border: colors.glassBorder,
                      }}
                      aria-label={`Add ${item.name}`}
                    >
                      <Icon className="w-6 h-6" style={{ color: colors.iconColor }} />
                      <span className="text-xs text-center" style={{ color: colors.textSecondary }}>
                        {item.name}
                      </span>
                    </button>
                  );
                })}
              </div>
              {placedFurniture.length > 0 && (
                <div 
                  className="rounded-lg p-3"
                  style={{ background: colors.iconBg }}
                >
                  <div className="text-sm font-medium mb-2" style={{ color: colors.textPrimary }}>
                    Placed Items ({placedFurniture.length})
                  </div>
                  <div className="space-y-2">
                    {placedFurniture.map((item, idx) => (
                      <div key={item.id} className="flex items-center justify-between">
                        <span className="text-sm capitalize" style={{ color: colors.textSecondary }}>
                          {item.type}
                        </span>
                        <button
                          onClick={() => setPlacedFurniture(placedFurniture.filter(f => f.id !== item.id))}
                          className="p-1 rounded"
                          style={{ color: colors.errorColor }}
                          aria-label={`Remove ${item.type}`}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </section>

            {/* Action Buttons */}
            <div className="grid grid-cols-2 gap-3 sticky bottom-0 bg-opacity-95 pt-3" style={{ background: colors.bg }}>
              <Button
                onClick={() => setShowPreview(true)}
                className="h-12 rounded-xl font-semibold"
                style={{ 
                  background: colors.iconBg,
                  color: colors.iconColor,
                }}
                aria-label="Preview scene"
              >
                <Eye className="w-5 h-5 mr-2" />
                Preview
              </Button>
              <Button
                onClick={() => setShowSaveModal(true)}
                className="h-12 rounded-xl font-semibold"
                style={{ 
                  background: colors.successColor,
                  color: '#FFFFFF',
                }}
                aria-label="Save scene"
              >
                <Save className="w-5 h-5 mr-2" />
                Save Scene
              </Button>
            </div>
          </div>
        )}

        {/* Marketplace View */}
        {activeView === 'marketplace' && (
          <div role="tabpanel" id="marketplace-panel" className="p-4">
            <div className="mb-4">
              <h2 className="text-lg font-semibold mb-2" style={{ color: colors.textPrimary }}>
                Community Scenes
              </h2>
              <p className="text-sm" style={{ color: colors.textTertiary }}>
                Discover and download scenes created by the community
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {sceneTemplates.filter(t => t.category === 'community').map((template) => (
                <div
                  key={template.id}
                  className="rounded-xl overflow-hidden"
                  style={{
                    background: colors.cardBg,
                    backdropFilter: colors.blur,
                    WebkitBackdropFilter: colors.blur,
                    border: colors.glassBorder,
                    boxShadow: colors.shadow,
                  }}
                >
                  <img
                    src={template.thumbnail}
                    alt={template.name}
                    className="w-full h-40 object-cover"
                  />
                  <div className="p-3">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold" style={{ color: colors.textPrimary }}>
                        {template.name}
                      </h3>
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4" style={{ color: colors.warningColor }} fill={colors.warningColor} />
                        <span className="text-sm font-medium" style={{ color: colors.textPrimary }}>
                          {template.rating}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 mb-2">
                      <Users className="w-4 h-4" style={{ color: colors.iconColor }} />
                      <span className="text-sm" style={{ color: colors.textSecondary }}>
                        {template.creator}
                      </span>
                    </div>
                    <p className="text-sm mb-3 line-clamp-2" style={{ color: colors.textTertiary }}>
                      {template.description}
                    </p>
                    <div className="flex items-center gap-2">
                      <Button
                        className="flex-1 h-10 rounded-xl font-semibold"
                        style={{ 
                          background: colors.iconColor,
                          color: theme === 'dark' ? '#0F0F23' : '#FFFFFF',
                        }}
                        aria-label={`Download ${template.name}`}
                      >
                        <Download className="w-4 h-4 mr-2" />
                        Download
                      </Button>
                      <Button
                        size="icon"
                        className="w-10 h-10"
                        style={{ background: colors.iconBg, color: colors.iconColor }}
                        aria-label={`Preview ${template.name}`}
                      >
                        <Eye className="w-5 h-5" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Library View */}
        {activeView === 'library' && (
          <div role="tabpanel" id="library-panel" className="p-4">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-lg font-semibold" style={{ color: colors.textPrimary }}>
                  My Scenes
                </h2>
                <p className="text-sm" style={{ color: colors.textTertiary }}>
                  {myScenes.length} saved scenes
                </p>
              </div>
              <Button
                onClick={handleCreateNew}
                size="icon"
                style={{ 
                  background: colors.iconColor,
                  color: theme === 'dark' ? '#0F0F23' : '#FFFFFF',
                }}
                aria-label="Create new scene"
              >
                <Plus className="w-5 h-5" />
              </Button>
            </div>

            <div className="space-y-3">
              {myScenes.map((scene) => (
                <div
                  key={scene.id}
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
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold" style={{ color: colors.textPrimary }}>
                          {scene.name}
                        </h3>
                        {scene.isDefault && (
                          <span 
                            className="px-2 py-0.5 rounded-full text-xs"
                            style={{ background: colors.successBg, color: colors.successColor }}
                          >
                            Default
                          </span>
                        )}
                        {scene.isPublic && (
                          <Globe className="w-4 h-4" style={{ color: colors.iconColor }} aria-label="Public" />
                        )}
                      </div>
                      <p className="text-sm mb-2" style={{ color: colors.textTertiary }}>
                        {scene.description}
                      </p>
                      <div className="flex flex-wrap gap-1 mb-2">
                        {scene.tags.map((tag) => (
                          <span
                            key={tag}
                            className="px-2 py-0.5 rounded text-xs"
                            style={{ background: colors.accentBg, color: colors.accentColor }}
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                      <div className="flex items-center gap-3 text-xs" style={{ color: colors.textTertiary }}>
                        <span>Used {scene.usageCount} times</span>
                        <span>•</span>
                        <span>Last: {new Date(scene.lastUsed).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Button
                      onClick={() => handleEditScene(scene)}
                      className="flex-1 h-10 rounded-xl font-semibold"
                      style={{ 
                        background: colors.iconBg,
                        color: colors.iconColor,
                      }}
                      aria-label={`Edit ${scene.name}`}
                    >
                      <Edit className="w-4 h-4 mr-2" />
                      Edit
                    </Button>
                    <Button
                      size="icon"
                      className="w-10 h-10"
                      style={{ background: colors.accentBg, color: colors.accentColor }}
                      aria-label={`Duplicate ${scene.name}`}
                    >
                      <Copy className="w-5 h-5" />
                    </Button>
                    <Button
                      onClick={() => setShowShareModal(true)}
                      size="icon"
                      className="w-10 h-10"
                      style={{ background: colors.successBg, color: colors.successColor }}
                      aria-label={`Share ${scene.name}`}
                    >
                      <Share2 className="w-5 h-5" />
                    </Button>
                    <Button
                      size="icon"
                      className="w-10 h-10"
                      style={{ background: colors.errorBg, color: colors.errorColor }}
                      aria-label={`Delete ${scene.name}`}
                    >
                      <Trash2 className="w-5 h-5" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Save Modal */}
      {showSaveModal && (
        <div 
          className="fixed inset-0 bg-black/50 flex items-end sm:items-center justify-center z-50 p-4"
          onClick={() => setShowSaveModal(false)}
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
            aria-labelledby="save-title"
            aria-modal="true"
          >
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 id="save-title" className="text-xl font-bold mb-1" style={{ color: colors.textPrimary }}>
                  Save Scene
                </h3>
                <p className="text-sm" style={{ color: colors.textSecondary }}>
                  Give your scene a name and description
                </p>
              </div>
              <button
                onClick={() => setShowSaveModal(false)}
                className="p-2 rounded-lg"
                style={{ color: colors.textSecondary }}
                aria-label="Close save modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 mb-4">
              <div>
                <label className="text-sm font-semibold mb-2 block" style={{ color: colors.textPrimary }}>
                  Scene Name
                </label>
                <input
                  type="text"
                  placeholder="My Awesome Scene"
                  className="w-full h-11 px-4 rounded-xl"
                  style={{
                    background: colors.cardHover,
                    border: colors.glassBorder,
                    color: colors.textPrimary,
                  }}
                  aria-label="Scene name"
                />
              </div>

              <div>
                <label className="text-sm font-semibold mb-2 block" style={{ color: colors.textPrimary }}>
                  Description
                </label>
                <textarea
                  placeholder="Describe your scene..."
                  rows={3}
                  className="w-full px-4 py-3 rounded-xl resize-none"
                  style={{
                    background: colors.cardHover,
                    border: colors.glassBorder,
                    color: colors.textPrimary,
                  }}
                  aria-label="Scene description"
                />
              </div>

              <div className="flex items-center gap-3">
                <label className="flex items-center gap-2 flex-1">
                  <input type="checkbox" className="w-4 h-4" />
                  <span className="text-sm" style={{ color: colors.textSecondary }}>
                    Set as default
                  </span>
                </label>
                <label className="flex items-center gap-2 flex-1">
                  <input type="checkbox" className="w-4 h-4" />
                  <span className="text-sm" style={{ color: colors.textSecondary }}>
                    Make public
                  </span>
                </label>
              </div>
            </div>

            <Button
              onClick={() => setShowSaveModal(false)}
              className="w-full h-12 rounded-xl font-semibold"
              style={{ 
                background: colors.successColor,
                color: '#FFFFFF',
              }}
              aria-label="Save scene"
            >
              <Save className="w-5 h-5 mr-2" />
              Save Scene
            </Button>
          </div>
        </div>
      )}

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
                  Share Scene
                </h3>
                <p className="text-sm" style={{ color: colors.textSecondary }}>
                  Share with the community
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

            <div className="space-y-3 mb-4">
              <label className="flex items-center gap-3 p-3 rounded-xl" style={{ background: colors.iconBg }}>
                <input type="radio" name="visibility" defaultChecked />
                <div className="flex-1">
                  <div className="font-semibold mb-1" style={{ color: colors.textPrimary }}>
                    Public
                  </div>
                  <div className="text-xs" style={{ color: colors.textTertiary }}>
                    Anyone can view and download
                  </div>
                </div>
              </label>
              
              <label className="flex items-center gap-3 p-3 rounded-xl" style={{ background: colors.iconBg }}>
                <input type="radio" name="visibility" />
                <div className="flex-1">
                  <div className="font-semibold mb-1" style={{ color: colors.textPrimary }}>
                    Private
                  </div>
                  <div className="text-xs" style={{ color: colors.textTertiary }}>
                    Only you can access
                  </div>
                </div>
              </label>

              <label className="flex items-center gap-2">
                <input type="checkbox" className="w-4 h-4" defaultChecked />
                <span className="text-sm" style={{ color: colors.textSecondary }}>
                  Allow remixes and modifications
                </span>
              </label>
            </div>

            <Button
              onClick={() => setShowShareModal(false)}
              className="w-full h-12 rounded-xl font-semibold"
              style={{ 
                background: colors.iconColor,
                color: theme === 'dark' ? '#0F0F23' : '#FFFFFF',
              }}
              aria-label="Share scene"
            >
              <Share2 className="w-5 h-5 mr-2" />
              Share Scene
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
