import { useState } from 'react';
import { Button } from './ui/button';
import { useTheme } from '../context/ThemeContext';
import { useApp } from '../context/AppContext';
import exampleImage from 'figma:asset/2af911d812f8ccca177be7cf8d9c365528818326.png';
import { 
  X, 
  Grid3x3,
  List,
  Search,
  Filter,
  Star,
  Clock,
  Play,
  Lock,
  Download,
  Check,
  CheckCircle2,
  Crown,
  Users,
  TrendingUp,
  Sparkles,
  Plus,
  Share2,
  MessageSquare,
  Briefcase,
  Utensils,
  Stethoscope,
  Plane,
  ShoppingBag,
  Home,
  GraduationCap,
  PartyPopper,
  AlertTriangle,
  Building2,
  Coffee,
  ChevronRight,
  ChevronLeft,
  BookOpen,
  Target,
  Award,
  Eye,
  Heart,
  Flag,
  Settings,
  Shuffle,
  ArrowRight,
  Camera,
  Hand,
  Zap,
  BarChart3,
  RefreshCw,
  Info,
  ThumbsUp,
  ThumbsDown,
  Edit,
  Save,
  Trash2,
  Upload,
  Image as ImageIcon,
  FileText,
} from 'lucide-react';

interface ConversationScenariosProps {
  onExit: () => void;
}

interface Scenario {
  id: string;
  title: string;
  description: string;
  category: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  duration: string;
  isPremium: boolean;
  thumbnail: string;
  completionStatus: 'not-started' | 'in-progress' | 'completed';
  masteryStars: 0 | 1 | 2 | 3;
  accuracy: number;
  vocabulary: string[];
  objectives: string[];
  rating: number;
  reviews: number;
  downloads: number;
  isDownloaded?: boolean;
  isCommunity?: boolean;
  author?: string;
  replays?: number;
  bestTime?: string;
}

interface Category {
  id: string;
  name: string;
  description: string;
  icon: any;
  scenarios: number;
  color: string;
}

interface Collection {
  id: string;
  name: string;
  description: string;
  scenarios: string[];
  difficulty: string;
  duration: string;
  isPremium: boolean;
}

export function ConversationScenarios({ onExit }: ConversationScenariosProps) {
  const { theme } = useTheme();
  const { userProgress } = useApp();

  const [currentView, setCurrentView] = useState<'categories' | 'browser' | 'detail' | 'practice' | 'builder' | 'community' | 'collections' | 'quick-practice'>('categories');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedScenario, setSelectedScenario] = useState<Scenario | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterDifficulty, setFilterDifficulty] = useState<string>('all');
  const [showFilters, setShowFilters] = useState(false);
  const [practiceStep, setPracticeStep] = useState(0);
  const [userResponse, setUserResponse] = useState<string | null>(null);
  const [isPremium] = useState(true);

  // Categories
  const [categories] = useState<Category[]>([
    {
      id: 'everyday',
      name: 'Everyday Conversations',
      description: 'Greetings, small talk, farewells',
      icon: MessageSquare,
      scenarios: 12,
      color: '#0EA5E9',
    },
    {
      id: 'dining',
      name: 'Dining',
      description: 'Restaurant ordering, food preferences, paying bills',
      icon: Utensils,
      scenarios: 8,
      color: '#F59E0B',
    },
    {
      id: 'healthcare',
      name: 'Healthcare',
      description: 'Doctor visits, symptoms, pharmacy, emergencies',
      icon: Stethoscope,
      scenarios: 10,
      color: '#EF4444',
    },
    {
      id: 'workplace',
      name: 'Workplace',
      description: 'Meetings, interviews, office communication',
      icon: Briefcase,
      scenarios: 15,
      color: '#8B5CF6',
    },
    {
      id: 'travel',
      name: 'Travel',
      description: 'Airports, hotels, directions, transportation',
      icon: Plane,
      scenarios: 11,
      color: '#06B6D4',
    },
    {
      id: 'shopping',
      name: 'Shopping',
      description: 'Stores, prices, sizes, returns',
      icon: ShoppingBag,
      scenarios: 9,
      color: '#EC4899',
    },
    {
      id: 'family',
      name: 'Family & Home',
      description: 'Daily routines, household tasks, parenting',
      icon: Home,
      scenarios: 13,
      color: '#22C55E',
    },
    {
      id: 'education',
      name: 'Education',
      description: 'Classroom, studying, asking questions',
      icon: GraduationCap,
      scenarios: 10,
      color: '#3B82F6',
    },
    {
      id: 'social',
      name: 'Social Events',
      description: 'Parties, gatherings, introductions',
      icon: PartyPopper,
      scenarios: 7,
      color: '#F97316',
    },
    {
      id: 'emergency',
      name: 'Emergency',
      description: 'Help, police, fire, medical emergencies',
      icon: AlertTriangle,
      scenarios: 6,
      color: '#DC2626',
    },
    {
      id: 'professional',
      name: 'Professional',
      description: 'Business meetings, presentations, networking',
      icon: Building2,
      scenarios: 14,
      color: '#6366F1',
    },
  ]);

  // Scenarios
  const [scenarios] = useState<Scenario[]>([
    // Everyday Conversations
    {
      id: 'everyday-1',
      title: 'Meeting a Friend',
      description: 'Casual greeting and small talk with a friend',
      category: 'everyday',
      difficulty: 'Beginner',
      duration: '5 min',
      isPremium: false,
      thumbnail: exampleImage,
      completionStatus: 'completed',
      masteryStars: 3,
      accuracy: 95,
      vocabulary: ['Hello', 'How are you?', 'Good', 'Thank you', 'See you later'],
      objectives: ['Master basic greetings', 'Practice reciprocal questions', 'Use appropriate facial expressions'],
      rating: 4.8,
      reviews: 342,
      downloads: 1205,
      isDownloaded: true,
      replays: 12,
      bestTime: '4:23',
    },
    {
      id: 'everyday-2',
      title: 'Introducing Yourself',
      description: 'Share your name, background, and interests',
      category: 'everyday',
      difficulty: 'Beginner',
      duration: '6 min',
      isPremium: false,
      thumbnail: exampleImage,
      completionStatus: 'in-progress',
      masteryStars: 2,
      accuracy: 78,
      vocabulary: ['My name is', 'I am from', 'I work', 'I like', 'Nice to meet you'],
      objectives: ['Introduce yourself clearly', 'Share personal information', 'Ask reciprocal questions'],
      rating: 4.7,
      reviews: 289,
      downloads: 956,
      replays: 5,
      bestTime: '5:45',
    },
    {
      id: 'everyday-3',
      title: 'Making Weekend Plans',
      description: 'Discuss and coordinate weekend activities with friends',
      category: 'everyday',
      difficulty: 'Intermediate',
      duration: '8 min',
      isPremium: false,
      thumbnail: exampleImage,
      completionStatus: 'not-started',
      masteryStars: 0,
      accuracy: 0,
      vocabulary: ['Weekend', 'Plan', 'Want', 'Movie', 'Restaurant', 'Time', 'Where', 'When'],
      objectives: ['Discuss future plans', 'Use time expressions', 'Negotiate and agree on activities'],
      rating: 4.6,
      reviews: 215,
      downloads: 734,
    },
    // Dining
    {
      id: 'dining-1',
      title: 'Ordering at a Restaurant',
      description: 'Order food and drinks from a menu',
      category: 'dining',
      difficulty: 'Beginner',
      duration: '7 min',
      isPremium: false,
      thumbnail: exampleImage,
      completionStatus: 'completed',
      masteryStars: 3,
      accuracy: 92,
      vocabulary: ['Menu', 'Order', 'Water', 'Coffee', 'Salad', 'Chicken', 'Thank you', 'Delicious'],
      objectives: ['Navigate a menu', 'Place an order', 'Express preferences'],
      rating: 4.9,
      reviews: 456,
      downloads: 1534,
      isDownloaded: true,
      replays: 8,
      bestTime: '6:15',
    },
    {
      id: 'dining-2',
      title: 'Requesting Dietary Accommodations',
      description: 'Communicate allergies and dietary restrictions',
      category: 'dining',
      difficulty: 'Intermediate',
      duration: '6 min',
      isPremium: true,
      thumbnail: exampleImage,
      completionStatus: 'not-started',
      masteryStars: 0,
      accuracy: 0,
      vocabulary: ['Allergy', 'Gluten-free', 'Vegetarian', 'Vegan', 'Dairy', 'Nuts', 'Can you', 'Instead'],
      objectives: ['Explain dietary needs', 'Ask about ingredients', 'Request substitutions'],
      rating: 4.7,
      reviews: 178,
      downloads: 623,
    },
    // Healthcare
    {
      id: 'healthcare-1',
      title: 'Describing Symptoms to Doctor',
      description: 'Explain your health concerns and symptoms',
      category: 'healthcare',
      difficulty: 'Intermediate',
      duration: '10 min',
      isPremium: true,
      thumbnail: exampleImage,
      completionStatus: 'in-progress',
      masteryStars: 1,
      accuracy: 65,
      vocabulary: ['Pain', 'Head', 'Stomach', 'Fever', 'Cough', 'Since', 'Yesterday', 'How long'],
      objectives: ['Describe symptoms accurately', 'Answer medical questions', 'Understand doctor\'s instructions'],
      rating: 4.8,
      reviews: 267,
      downloads: 892,
      replays: 3,
      bestTime: '9:30',
    },
    {
      id: 'healthcare-2',
      title: 'Pharmacy Prescription Pickup',
      description: 'Pick up medication and understand instructions',
      category: 'healthcare',
      difficulty: 'Beginner',
      duration: '5 min',
      isPremium: false,
      thumbnail: exampleImage,
      completionStatus: 'not-started',
      masteryStars: 0,
      accuracy: 0,
      vocabulary: ['Prescription', 'Medicine', 'Pill', 'Twice', 'Daily', 'Morning', 'Evening', 'Food'],
      objectives: ['Pick up prescription', 'Understand dosage', 'Ask clarifying questions'],
      rating: 4.6,
      reviews: 189,
      downloads: 567,
    },
    // Workplace
    {
      id: 'workplace-1',
      title: 'Job Interview Introduction',
      description: 'Introduce yourself in a professional interview setting',
      category: 'workplace',
      difficulty: 'Advanced',
      duration: '12 min',
      isPremium: true,
      thumbnail: exampleImage,
      completionStatus: 'not-started',
      masteryStars: 0,
      accuracy: 0,
      vocabulary: ['Experience', 'Skills', 'Education', 'Background', 'Strengths', 'Goals', 'Why', 'Company'],
      objectives: ['Present yourself professionally', 'Discuss qualifications', 'Answer interview questions'],
      rating: 4.9,
      reviews: 412,
      downloads: 1287,
    },
    {
      id: 'workplace-2',
      title: 'Team Meeting Participation',
      description: 'Contribute ideas and ask questions in a team meeting',
      category: 'workplace',
      difficulty: 'Intermediate',
      duration: '9 min',
      isPremium: true,
      thumbnail: exampleImage,
      completionStatus: 'not-started',
      masteryStars: 0,
      accuracy: 0,
      vocabulary: ['Meeting', 'Idea', 'Question', 'Agree', 'Disagree', 'Suggestion', 'Project', 'Deadline'],
      objectives: ['Participate in discussions', 'Share ideas clearly', 'Ask relevant questions'],
      rating: 4.7,
      reviews: 298,
      downloads: 845,
    },
    // Travel
    {
      id: 'travel-1',
      title: 'Airport Check-In',
      description: 'Check in for your flight and navigate security',
      category: 'travel',
      difficulty: 'Beginner',
      duration: '6 min',
      isPremium: false,
      thumbnail: exampleImage,
      completionStatus: 'completed',
      masteryStars: 2,
      accuracy: 88,
      vocabulary: ['Ticket', 'Passport', 'Gate', 'Boarding', 'Luggage', 'Window', 'Aisle', 'Security'],
      objectives: ['Check in for flight', 'Communicate seat preferences', 'Navigate airport procedures'],
      rating: 4.8,
      reviews: 534,
      downloads: 1678,
      isDownloaded: true,
      replays: 6,
      bestTime: '5:30',
    },
    {
      id: 'travel-2',
      title: 'Hotel Check-In and Requests',
      description: 'Check into hotel and make room requests',
      category: 'travel',
      difficulty: 'Intermediate',
      duration: '8 min',
      isPremium: false,
      thumbnail: exampleImage,
      completionStatus: 'not-started',
      masteryStars: 0,
      accuracy: 0,
      vocabulary: ['Reservation', 'Room', 'Key', 'Floor', 'Wifi', 'Breakfast', 'Checkout', 'Problem'],
      objectives: ['Complete check-in', 'Request amenities', 'Report issues'],
      rating: 4.6,
      reviews: 312,
      downloads: 923,
    },
    // Shopping
    {
      id: 'shopping-1',
      title: 'Finding the Right Size',
      description: 'Ask for help finding clothing in your size',
      category: 'shopping',
      difficulty: 'Beginner',
      duration: '5 min',
      isPremium: false,
      thumbnail: exampleImage,
      completionStatus: 'not-started',
      masteryStars: 0,
      accuracy: 0,
      vocabulary: ['Size', 'Small', 'Medium', 'Large', 'Color', 'Try on', 'Fitting room', 'Price'],
      objectives: ['Ask for sizes', 'Request to try on', 'Compare options'],
      rating: 4.5,
      reviews: 267,
      downloads: 789,
    },
    // Emergency
    {
      id: 'emergency-1',
      title: 'Calling for Medical Help',
      description: 'Request emergency medical assistance',
      category: 'emergency',
      difficulty: 'Advanced',
      duration: '7 min',
      isPremium: false,
      thumbnail: exampleImage,
      completionStatus: 'not-started',
      masteryStars: 0,
      accuracy: 0,
      vocabulary: ['Help', 'Emergency', 'Ambulance', 'Hurt', 'Bleeding', 'Unconscious', 'Address', 'Now'],
      objectives: ['Communicate emergency clearly', 'Provide critical information', 'Stay calm under pressure'],
      rating: 4.9,
      reviews: 523,
      downloads: 1456,
      isDownloaded: true,
    },
  ]);

  // Collections
  const [collections] = useState<Collection[]>([
    {
      id: 'medical-pro',
      name: 'Medical Professional Pack',
      description: 'Complete healthcare communication scenarios',
      scenarios: ['healthcare-1', 'healthcare-2', 'emergency-1'],
      difficulty: 'Intermediate-Advanced',
      duration: '22 min total',
      isPremium: true,
    },
    {
      id: 'travel-bundle',
      name: 'Travel Essentials Bundle',
      description: 'Navigate airports, hotels, and transportation',
      scenarios: ['travel-1', 'travel-2'],
      difficulty: 'Beginner-Intermediate',
      duration: '14 min total',
      isPremium: false,
    },
    {
      id: 'career-starter',
      name: 'Career Starter Series',
      description: 'Interview and workplace communication',
      scenarios: ['workplace-1', 'workplace-2'],
      difficulty: 'Intermediate-Advanced',
      duration: '21 min total',
      isPremium: true,
    },
  ]);

  // Community scenarios
  const [communityScenarios] = useState<Scenario[]>([
    {
      id: 'community-1',
      title: 'Coffee Shop Order',
      description: 'Order your favorite coffee drink',
      category: 'everyday',
      difficulty: 'Beginner',
      duration: '4 min',
      isPremium: false,
      thumbnail: exampleImage,
      completionStatus: 'not-started',
      masteryStars: 0,
      accuracy: 0,
      vocabulary: ['Coffee', 'Latte', 'Size', 'Hot', 'Cold', 'Milk', 'Sugar', 'To-go'],
      objectives: ['Order coffee', 'Specify preferences', 'Pay and thank'],
      rating: 4.6,
      reviews: 89,
      downloads: 234,
      isCommunity: true,
      author: 'ASL_Teacher_Sarah',
    },
    {
      id: 'community-2',
      title: 'Asking for Directions',
      description: 'Get directions to a specific location',
      category: 'travel',
      difficulty: 'Beginner',
      duration: '5 min',
      isPremium: false,
      thumbnail: exampleImage,
      completionStatus: 'not-started',
      masteryStars: 0,
      accuracy: 0,
      vocabulary: ['Where', 'Left', 'Right', 'Straight', 'Block', 'Corner', 'Street', 'Building'],
      objectives: ['Ask for directions', 'Understand spatial instructions', 'Confirm understanding'],
      rating: 4.7,
      reviews: 156,
      downloads: 445,
      isCommunity: true,
      author: 'DeafNavigator_99',
    },
  ]);

  // Practice conversation steps
  const practiceSteps = [
    {
      speaker: 'Partner',
      dialogue: 'Hello! How are you today?',
      options: ['I am good, thank you', 'I am tired', 'I am happy to see you'],
      correctOption: 0,
    },
    {
      speaker: 'Partner',
      dialogue: 'What did you do this weekend?',
      options: ['I went to the movies', 'I stayed home', 'I visited family'],
      correctOption: null, // All valid
    },
    {
      speaker: 'Partner',
      dialogue: 'That sounds fun! Would you like to get coffee sometime?',
      options: ['Yes, I would love to', 'Sorry, I am busy', 'Maybe another time'],
      correctOption: null,
    },
  ];

  // Filter scenarios
  const getFilteredScenarios = () => {
    let filtered = selectedCategory 
      ? scenarios.filter(s => s.category === selectedCategory)
      : scenarios;

    if (filterDifficulty !== 'all') {
      filtered = filtered.filter(s => s.difficulty === filterDifficulty);
    }

    if (searchQuery) {
      filtered = filtered.filter(s => 
        s.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    return filtered;
  };

  // Handle practice response
  const handlePracticeResponse = (response: string) => {
    setUserResponse(response);
    setTimeout(() => {
      if (practiceStep < practiceSteps.length - 1) {
        setPracticeStep(practiceStep + 1);
        setUserResponse(null);
      } else {
        // Complete practice
        setCurrentView('detail');
        setPracticeStep(0);
        setUserResponse(null);
      }
    }, 2000);
  };

  const filteredScenarios = getFilteredScenarios();

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

  return (
    <div 
      className="h-full flex flex-col"
      style={{ background: colors.bg, color: colors.textPrimary }}
      role="main"
      aria-labelledby="conversation-scenarios-title"
    >
      {/* Header */}
      <div 
        className="p-4 border-b"
        style={{ borderBottomColor: colors.border }}
      >
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <h1 
              id="conversation-scenarios-title" 
              className="text-xl sm:text-2xl font-bold"
              style={{ fontFamily: 'Poppins, sans-serif' }}
            >
              {currentView === 'categories' && 'Conversation Scenarios'}
              {currentView === 'browser' && (selectedCategory ? categories.find(c => c.id === selectedCategory)?.name : 'All Scenarios')}
              {currentView === 'detail' && selectedScenario?.title}
              {currentView === 'practice' && 'Practice Mode'}
              {currentView === 'builder' && 'Custom Scenario Builder'}
              {currentView === 'community' && 'Community Scenarios'}
              {currentView === 'collections' && 'Scenario Collections'}
              {currentView === 'quick-practice' && 'Quick Practice'}
            </h1>
            <p className="text-sm" style={{ color: colors.textSecondary }}>
              {currentView === 'categories' && '11 categories • Real-world conversations'}
              {currentView === 'browser' && `${filteredScenarios.length} scenarios available`}
              {currentView === 'detail' && `${selectedScenario?.difficulty} • ${selectedScenario?.duration}`}
              {currentView === 'practice' && 'AR conversation practice'}
              {currentView === 'builder' && 'Create custom conversations'}
              {currentView === 'community' && `${communityScenarios.length} user-created scenarios`}
              {currentView === 'collections' && `${collections.length} curated collections`}
              {currentView === 'quick-practice' && 'Random scenario practice'}
            </p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onExit}
            style={{ color: colors.textSecondary }}
            aria-label="Exit conversation scenarios"
          >
            <X className="w-6 h-6" />
          </Button>
        </div>

        {/* Quick navigation */}
        {currentView === 'categories' && (
          <div className="flex items-center gap-2 mt-3 overflow-x-auto">
            <Button
              onClick={() => setCurrentView('quick-practice')}
              className="h-9 px-3 rounded-xl text-sm whitespace-nowrap"
              style={{ 
                background: colors.successBg,
                color: colors.successColor,
              }}
              aria-label="Quick practice"
            >
              <Shuffle className="w-4 h-4 mr-2" />
              Quick Practice
            </Button>
            <Button
              onClick={() => setCurrentView('collections')}
              className="h-9 px-3 rounded-xl text-sm whitespace-nowrap"
              style={{ 
                background: colors.accentBg,
                color: colors.accentColor,
              }}
              aria-label="View collections"
            >
              <BookOpen className="w-4 h-4 mr-2" />
              Collections
            </Button>
            <Button
              onClick={() => setCurrentView('community')}
              className="h-9 px-3 rounded-xl text-sm whitespace-nowrap"
              style={{ 
                background: colors.iconBg,
                color: colors.iconColor,
              }}
              aria-label="Community scenarios"
            >
              <Users className="w-4 h-4 mr-2" />
              Community
            </Button>
            {isPremium && (
              <Button
                onClick={() => setCurrentView('builder')}
                className="h-9 px-3 rounded-xl text-sm whitespace-nowrap"
                style={{ 
                  background: colors.warningBg,
                  color: colors.warningColor,
                }}
                aria-label="Create custom scenario"
              >
                <Plus className="w-4 h-4 mr-2" />
                Create
              </Button>
            )}
          </div>
        )}

        {/* Browser controls */}
        {currentView === 'browser' && (
          <div className="mt-3 space-y-2">
            <div className="flex items-center gap-2">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: colors.textTertiary }} />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search scenarios..."
                  className="w-full h-10 pl-10 pr-4 rounded-xl"
                  style={{
                    background: colors.cardBg,
                    border: colors.glassBorder,
                    color: colors.textPrimary,
                  }}
                  aria-label="Search scenarios"
                />
              </div>
              <Button
                onClick={() => setShowFilters(!showFilters)}
                className="h-10 px-3 rounded-xl"
                style={{ 
                  background: showFilters ? colors.iconColor : colors.iconBg,
                  color: showFilters ? (theme === 'dark' ? 'var(--color-bg-deep)' : '#FFFFFF') : colors.iconColor,
                }}
                aria-label="Toggle filters"
                aria-pressed={showFilters}
              >
                <Filter className="w-4 h-4" />
              </Button>
              <Button
                onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
                className="h-10 px-3 rounded-xl"
                style={{ 
                  background: colors.accentBg,
                  color: colors.accentColor,
                }}
                aria-label={`Switch to ${viewMode === 'grid' ? 'list' : 'grid'} view`}
              >
                {viewMode === 'grid' ? <List className="w-4 h-4" /> : <Grid3x3 className="w-4 h-4" />}
              </Button>
            </div>

            {showFilters && (
              <div 
                className="rounded-xl p-3"
                style={{ background: colors.cardBg, border: colors.glassBorder }}
              >
                <div className="text-sm font-semibold mb-2" style={{ color: colors.textPrimary }}>
                  Difficulty
                </div>
                <div className="flex gap-2">
                  {['all', 'Beginner', 'Intermediate', 'Advanced'].map((level) => (
                    <button
                      key={level}
                      onClick={() => setFilterDifficulty(level)}
                      className="flex-1 h-8 rounded-lg text-xs font-medium"
                      style={{
                        background: filterDifficulty === level ? colors.iconColor : colors.border,
                        color: filterDifficulty === level ? (theme === 'dark' ? 'var(--color-bg-deep)' : '#FFFFFF') : colors.textTertiary,
                      }}
                      aria-label={`Filter by ${level}`}
                      aria-pressed={filterDifficulty === level}
                    >
                      {level === 'all' ? 'All' : level}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        {/* Categories View */}
        {currentView === 'categories' && (
          <div className="p-4 space-y-3">
            {categories.map((category) => {
              const Icon = category.icon;
              return (
                <button
                  key={category.id}
                  onClick={() => {
                    setSelectedCategory(category.id);
                    setCurrentView('browser');
                  }}
                  className="w-full rounded-2xl p-4 text-left"
                  style={{
                    background: colors.cardBg,
                    backdropFilter: colors.blur,
                    WebkitBackdropFilter: colors.blur,
                    border: colors.glassBorder,
                    boxShadow: colors.shadow,
                  }}
                  aria-label={`${category.name}: ${category.description}, ${category.scenarios} scenarios`}
                >
                  <div className="flex items-center gap-4">
                    <div 
                      className="w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0"
                      style={{ background: `${category.color}20` }}
                    >
                      <Icon className="w-7 h-7" style={{ color: category.color }} />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-lg mb-1" style={{ color: colors.textPrimary }}>
                        {category.name}
                      </h3>
                      <p className="text-sm mb-2" style={{ color: colors.textSecondary }}>
                        {category.description}
                      </p>
                      <div className="text-xs" style={{ color: colors.textTertiary }}>
                        {category.scenarios} scenarios
                      </div>
                    </div>
                    <ChevronRight className="w-6 h-6 flex-shrink-0" style={{ color: colors.textTertiary }} />
                  </div>
                </button>
              );
            })}
          </div>
        )}

        {/* Browser View */}
        {currentView === 'browser' && (
          <div className="p-4">
            {selectedCategory && (
              <Button
                onClick={() => {
                  setSelectedCategory(null);
                  setCurrentView('categories');
                }}
                variant="ghost"
                className="mb-3"
                style={{ color: colors.textSecondary }}
                aria-label="Back to categories"
              >
                <ChevronLeft className="w-4 h-4 mr-2" />
                Back to Categories
              </Button>
            )}

            {viewMode === 'grid' ? (
              <div className="grid grid-cols-2 gap-3">
                {filteredScenarios.map((scenario) => (
                  <button
                    key={scenario.id}
                    onClick={() => {
                      setSelectedScenario(scenario);
                      setCurrentView('detail');
                    }}
                    className="rounded-xl overflow-hidden text-left"
                    style={{
                      background: colors.cardBg,
                      backdropFilter: colors.blur,
                      WebkitBackdropFilter: colors.blur,
                      border: colors.glassBorder,
                      boxShadow: colors.shadow,
                    }}
                    aria-label={`${scenario.title}, ${scenario.difficulty}, ${scenario.duration}`}
                  >
                    <div className="relative">
                      <img
                        src={scenario.thumbnail}
                        alt={scenario.title}
                        className="w-full h-32 object-cover"
                      />
                      {scenario.isPremium && (
                        <div 
                          className="absolute top-2 right-2 w-8 h-8 rounded-full flex items-center justify-center"
                          style={{ background: colors.warningColor }}
                        >
                          <Crown className="w-4 h-4 text-white" />
                        </div>
                      )}
                      {scenario.isDownloaded && (
                        <div 
                          className="absolute top-2 left-2 w-8 h-8 rounded-full flex items-center justify-center"
                          style={{ background: colors.successColor }}
                        >
                          <Download className="w-4 h-4 text-white" />
                        </div>
                      )}
                      {scenario.completionStatus === 'completed' && (
                        <div 
                          className="absolute bottom-2 left-2 flex gap-1"
                        >
                          {[...Array(scenario.masteryStars)].map((_, i) => (
                            <Star key={i} className="w-4 h-4" style={{ fill: colors.warningColor, color: colors.warningColor }} />
                          ))}
                        </div>
                      )}
                    </div>
                    <div className="p-3">
                      <h4 className="font-semibold text-sm mb-1 line-clamp-2" style={{ color: colors.textPrimary }}>
                        {scenario.title}
                      </h4>
                      <div className="flex items-center gap-2 text-xs mb-2">
                        <span 
                          className="px-2 py-0.5 rounded-full"
                          style={{ 
                            background: scenario.difficulty === 'Beginner' ? colors.successBg : scenario.difficulty === 'Intermediate' ? colors.warningBg : colors.errorBg,
                            color: scenario.difficulty === 'Beginner' ? colors.successColor : scenario.difficulty === 'Intermediate' ? colors.warningColor : colors.errorColor,
                          }}
                        >
                          {scenario.difficulty}
                        </span>
                        <span style={{ color: colors.textTertiary }}>{scenario.duration}</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs" style={{ color: colors.textTertiary }}>
                        <Star className="w-3 h-3" style={{ fill: colors.warningColor, color: colors.warningColor }} />
                        <span>{scenario.rating}</span>
                        <span>•</span>
                        <span>{scenario.reviews} reviews</span>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            ) : (
              <div className="space-y-3">
                {filteredScenarios.map((scenario) => (
                  <button
                    key={scenario.id}
                    onClick={() => {
                      setSelectedScenario(scenario);
                      setCurrentView('detail');
                    }}
                    className="w-full rounded-xl p-4 text-left"
                    style={{
                      background: colors.cardBg,
                      backdropFilter: colors.blur,
                      WebkitBackdropFilter: colors.blur,
                      border: colors.glassBorder,
                      boxShadow: colors.shadow,
                    }}
                    aria-label={`${scenario.title}, ${scenario.difficulty}, ${scenario.duration}`}
                  >
                    <div className="flex items-center gap-4">
                      <img
                        src={scenario.thumbnail}
                        alt={scenario.title}
                        className="w-20 h-20 rounded-lg object-cover flex-shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-semibold truncate" style={{ color: colors.textPrimary }}>
                            {scenario.title}
                          </h4>
                          {scenario.isPremium && (
                            <Crown className="w-4 h-4 flex-shrink-0" style={{ color: colors.warningColor }} />
                          )}
                          {scenario.isDownloaded && (
                            <Download className="w-4 h-4 flex-shrink-0" style={{ color: colors.successColor }} />
                          )}
                        </div>
                        <p className="text-sm mb-2 line-clamp-1" style={{ color: colors.textSecondary }}>
                          {scenario.description}
                        </p>
                        <div className="flex items-center gap-2 text-xs">
                          <span 
                            className="px-2 py-0.5 rounded-full"
                            style={{ 
                              background: scenario.difficulty === 'Beginner' ? colors.successBg : scenario.difficulty === 'Intermediate' ? colors.warningBg : colors.errorBg,
                              color: scenario.difficulty === 'Beginner' ? colors.successColor : scenario.difficulty === 'Intermediate' ? colors.warningColor : colors.errorColor,
                            }}
                          >
                            {scenario.difficulty}
                          </span>
                          <span style={{ color: colors.textTertiary }}>{scenario.duration}</span>
                          {scenario.completionStatus === 'completed' && (
                            <>
                              <span>•</span>
                              <div className="flex gap-0.5">
                                {[...Array(scenario.masteryStars)].map((_, i) => (
                                  <Star key={i} className="w-3 h-3" style={{ fill: colors.warningColor, color: colors.warningColor }} />
                                ))}
                              </div>
                            </>
                          )}
                        </div>
                      </div>
                      <ChevronRight className="w-5 h-5 flex-shrink-0" style={{ color: colors.textTertiary }} />
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Detail View */}
        {currentView === 'detail' && selectedScenario && (
          <div className="p-4 space-y-4">
            <Button
              onClick={() => setCurrentView('browser')}
              variant="ghost"
              className="mb-2"
              style={{ color: colors.textSecondary }}
              aria-label="Back to scenarios"
            >
              <ChevronLeft className="w-4 h-4 mr-2" />
              Back
            </Button>

            {/* Thumbnail */}
            <div className="rounded-2xl overflow-hidden">
              <img
                src={selectedScenario.thumbnail}
                alt={selectedScenario.title}
                className="w-full h-48 object-cover"
              />
            </div>

            {/* Main info */}
            <div 
              className="rounded-2xl p-6"
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
                  <h2 className="text-2xl font-bold mb-2" style={{ fontFamily: 'Poppins, sans-serif', color: colors.textPrimary }}>
                    {selectedScenario.title}
                  </h2>
                  <p className="text-base mb-3" style={{ color: colors.textSecondary }}>
                    {selectedScenario.description}
                  </p>
                </div>
                {selectedScenario.isPremium && (
                  <Crown className="w-6 h-6 flex-shrink-0" style={{ color: colors.warningColor }} />
                )}
              </div>

              <div className="flex items-center gap-3 flex-wrap">
                <span 
                  className="px-3 py-1 rounded-full text-sm font-semibold"
                  style={{ 
                    background: selectedScenario.difficulty === 'Beginner' ? colors.successBg : selectedScenario.difficulty === 'Intermediate' ? colors.warningBg : colors.errorBg,
                    color: selectedScenario.difficulty === 'Beginner' ? colors.successColor : selectedScenario.difficulty === 'Intermediate' ? colors.warningColor : colors.errorColor,
                  }}
                >
                  {selectedScenario.difficulty}
                </span>
                <span className="flex items-center gap-1 text-sm" style={{ color: colors.textSecondary }}>
                  <Clock className="w-4 h-4" />
                  {selectedScenario.duration}
                </span>
                <span className="flex items-center gap-1 text-sm" style={{ color: colors.textSecondary }}>
                  <Star className="w-4 h-4" style={{ fill: colors.warningColor, color: colors.warningColor }} />
                  {selectedScenario.rating} ({selectedScenario.reviews})
                </span>
                <span className="flex items-center gap-1 text-sm" style={{ color: colors.textSecondary }}>
                  <Download className="w-4 h-4" />
                  {selectedScenario.downloads}
                </span>
              </div>
            </div>

            {/* Progress */}
            {selectedScenario.completionStatus !== 'not-started' && (
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
                <h3 className="text-lg font-semibold mb-3" style={{ color: colors.textPrimary }}>
                  Your Progress
                </h3>
                <div className="grid grid-cols-3 gap-3">
                  <div className="text-center">
                    <div className="flex justify-center gap-1 mb-1">
                      {[...Array(3)].map((_, i) => (
                        <Star 
                          key={i} 
                          className="w-5 h-5" 
                          style={{ 
                            fill: i < selectedScenario.masteryStars ? colors.warningColor : 'none',
                            color: i < selectedScenario.masteryStars ? colors.warningColor : colors.textTertiary,
                          }} 
                        />
                      ))}
                    </div>
                    <div className="text-xs" style={{ color: colors.textTertiary }}>
                      Mastery
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold mb-1" style={{ color: colors.successColor }}>
                      {selectedScenario.accuracy}%
                    </div>
                    <div className="text-xs" style={{ color: colors.textTertiary }}>
                      Best Score
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold mb-1" style={{ color: colors.iconColor }}>
                      {selectedScenario.replays || 0}
                    </div>
                    <div className="text-xs" style={{ color: colors.textTertiary }}>
                      Replays
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Learning Objectives */}
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
              <h3 className="text-lg font-semibold mb-3" style={{ color: colors.textPrimary }}>
                Learning Objectives
              </h3>
              <ul className="space-y-2">
                {selectedScenario.objectives.map((obj, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-sm">
                    <Target className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: colors.iconColor }} />
                    <span style={{ color: colors.textSecondary }}>{obj}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Key Vocabulary */}
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
              <h3 className="text-lg font-semibold mb-3" style={{ color: colors.textPrimary }}>
                Key Vocabulary
              </h3>
              <div className="flex flex-wrap gap-2">
                {selectedScenario.vocabulary.map((word, idx) => (
                  <button
                    key={idx}
                    className="px-3 py-1.5 rounded-lg text-sm"
                    style={{ background: colors.iconBg, color: colors.iconColor }}
                    aria-label={`View sign for ${word}`}
                  >
                    {word}
                  </button>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="space-y-3">
              <Button
                onClick={() => {
                  setCurrentView('practice');
                  setPracticeStep(0);
                }}
                className="w-full h-14 rounded-xl font-semibold text-lg"
                style={{ 
                  background: colors.successColor,
                  color: '#FFFFFF',
                }}
                aria-label="Start practice"
              >
                <Play className="w-6 h-6 mr-2" />
                Start Practice
              </Button>

              <div className="grid grid-cols-2 gap-3">
                {!selectedScenario.isDownloaded && isPremium && (
                  <Button
                    className="h-11 rounded-xl"
                    style={{ 
                      background: colors.iconBg,
                      color: colors.iconColor,
                    }}
                    aria-label="Download for offline"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Download
                  </Button>
                )}
                <Button
                  className="h-11 rounded-xl"
                  style={{ 
                    background: colors.accentBg,
                    color: colors.accentColor,
                  }}
                  aria-label="Share scenario"
                >
                  <Share2 className="w-4 h-4 mr-2" />
                  Share
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Practice Mode */}
        {currentView === 'practice' && selectedScenario && (
          <div className="p-4 space-y-4">
            {/* AR View */}
            <div 
              className="rounded-2xl overflow-hidden relative"
              style={{ height: '300px' }}
            >
              <img
                src={exampleImage}
                alt="AR practice view"
                className="w-full h-full object-cover"
              />
              <div 
                className="absolute top-4 left-4 right-4 rounded-xl p-3"
                style={{ background: 'rgba(0, 0, 0, 0.7)' }}
              >
                <div className="flex items-center gap-2 text-white text-sm mb-2">
                  <Camera className="w-4 h-4" />
                  <span>AR Partner Active</span>
                </div>
                <div className="flex items-center gap-2">
                  <Hand className="w-4 h-4 text-green-400" />
                  <span className="text-xs text-green-400">Hand Tracking: Active</span>
                </div>
              </div>
            </div>

            {/* Progress */}
            <div 
              className="rounded-xl p-3"
              style={{ background: colors.cardBg, border: colors.glassBorder }}
            >
              <div className="flex items-center justify-between mb-2 text-sm">
                <span style={{ color: colors.textSecondary }}>
                  Step {practiceStep + 1} of {practiceSteps.length}
                </span>
                <span style={{ color: colors.iconColor }}>
                  {Math.round(((practiceStep + 1) / practiceSteps.length) * 100)}%
                </span>
              </div>
              <div 
                className="w-full h-2 rounded-full overflow-hidden"
                style={{ background: colors.border }}
              >
                <div 
                  className="h-full transition-all"
                  style={{ 
                    background: colors.iconColor,
                    width: `${((practiceStep + 1) / practiceSteps.length) * 100}%`,
                  }}
                  role="progressbar"
                  aria-valuenow={practiceStep + 1}
                  aria-valuemin={0}
                  aria-valuemax={practiceSteps.length}
                  aria-label="Practice progress"
                />
              </div>
            </div>

            {/* Conversation */}
            <div 
              className="rounded-2xl p-6"
              style={{
                background: colors.cardBg,
                backdropFilter: colors.blur,
                WebkitBackdropFilter: colors.blur,
                border: colors.glassBorder,
                boxShadow: colors.shadow,
              }}
            >
              <div className="flex items-start gap-3 mb-4">
                <div 
                  className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
                  style={{ background: colors.accentColor }}
                >
                  👤
                </div>
                <div className="flex-1">
                  <div className="font-semibold mb-1" style={{ color: colors.textPrimary }}>
                    {practiceSteps[practiceStep].speaker}
                  </div>
                  <div 
                    className="rounded-xl p-3"
                    style={{ background: colors.iconBg }}
                  >
                    <p style={{ color: colors.textPrimary }}>
                      {practiceSteps[practiceStep].dialogue}
                    </p>
                  </div>
                </div>
              </div>

              <div className="text-sm font-semibold mb-3" style={{ color: colors.textPrimary }}>
                Your Response:
              </div>

              <div className="space-y-2">
                {practiceSteps[practiceStep].options.map((option, idx) => (
                  <button
                    key={idx}
                    onClick={() => handlePracticeResponse(option)}
                    disabled={userResponse !== null}
                    className="w-full rounded-xl p-4 text-left"
                    style={{
                      background: userResponse === option ? colors.successBg : colors.border,
                      border: userResponse === option ? `2px solid ${colors.successColor}` : 'none',
                      opacity: userResponse !== null && userResponse !== option ? 0.5 : 1,
                    }}
                    aria-label={`Response option: ${option}`}
                  >
                    <div className="flex items-center gap-3">
                      <div 
                        className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0"
                        style={{ 
                          background: userResponse === option ? colors.successColor : colors.iconBg,
                        }}
                      >
                        {userResponse === option ? (
                          <Check className="w-4 h-4 text-white" />
                        ) : (
                          <span className="text-xs font-bold" style={{ color: colors.textPrimary }}>
                            {String.fromCharCode(65 + idx)}
                          </span>
                        )}
                      </div>
                      <span className="font-medium" style={{ color: colors.textPrimary }}>
                        {option}
                      </span>
                    </div>
                  </button>
                ))}
              </div>

              {userResponse && (
                <div 
                  className="rounded-xl p-3 mt-4 flex items-center gap-2"
                  style={{ background: colors.successBg }}
                >
                  <CheckCircle2 className="w-5 h-5" style={{ color: colors.successColor }} />
                  <span className="text-sm font-semibold" style={{ color: colors.textPrimary }}>
                    Great! The avatar will respond...
                  </span>
                </div>
              )}
            </div>

            {/* Exit practice */}
            <Button
              onClick={() => {
                setCurrentView('detail');
                setPracticeStep(0);
                setUserResponse(null);
              }}
              variant="ghost"
              className="w-full h-10"
              style={{ color: colors.textSecondary }}
              aria-label="Exit practice"
            >
              Exit Practice
            </Button>
          </div>
        )}

        {/* Collections */}
        {currentView === 'collections' && (
          <div className="p-4 space-y-3">
            <Button
              onClick={() => setCurrentView('categories')}
              variant="ghost"
              className="mb-2"
              style={{ color: colors.textSecondary }}
              aria-label="Back to categories"
            >
              <ChevronLeft className="w-4 h-4 mr-2" />
              Back
            </Button>

            {collections.map((collection) => (
              <div
                key={collection.id}
                className="rounded-2xl p-6"
                style={{
                  background: colors.cardBg,
                  backdropFilter: colors.blur,
                  WebkitBackdropFilter: colors.blur,
                  border: colors.glassBorder,
                  boxShadow: colors.shadow,
                }}
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="text-lg font-bold mb-1" style={{ color: colors.textPrimary }}>
                      {collection.name}
                    </h3>
                    <p className="text-sm mb-2" style={{ color: colors.textSecondary }}>
                      {collection.description}
                    </p>
                  </div>
                  {collection.isPremium && (
                    <Crown className="w-5 h-5 flex-shrink-0" style={{ color: colors.warningColor }} />
                  )}
                </div>

                <div className="flex items-center gap-3 text-xs mb-4" style={{ color: colors.textTertiary }}>
                  <span>{collection.scenarios.length} scenarios</span>
                  <span>•</span>
                  <span>{collection.difficulty}</span>
                  <span>•</span>
                  <span>{collection.duration}</span>
                </div>

                <Button
                  className="w-full h-11 rounded-xl font-semibold"
                  style={{ 
                    background: colors.iconColor,
                    color: theme === 'dark' ? 'var(--color-bg-deep)' : '#FFFFFF',
                  }}
                  aria-label={`Start ${collection.name}`}
                >
                  <Play className="w-4 h-4 mr-2" />
                  Start Collection
                </Button>
              </div>
            ))}
          </div>
        )}

        {/* Community Scenarios */}
        {currentView === 'community' && (
          <div className="p-4 space-y-3">
            <Button
              onClick={() => setCurrentView('categories')}
              variant="ghost"
              className="mb-2"
              style={{ color: colors.textSecondary }}
              aria-label="Back to categories"
            >
              <ChevronLeft className="w-4 h-4 mr-2" />
              Back
            </Button>

            {communityScenarios.map((scenario) => (
              <button
                key={scenario.id}
                onClick={() => {
                  setSelectedScenario(scenario);
                  setCurrentView('detail');
                }}
                className="w-full rounded-xl p-4 text-left"
                style={{
                  background: colors.cardBg,
                  backdropFilter: colors.blur,
                  WebkitBackdropFilter: colors.blur,
                  border: colors.glassBorder,
                  boxShadow: colors.shadow,
                }}
                aria-label={`${scenario.title} by ${scenario.author}`}
              >
                <div className="flex items-center gap-4">
                  <img
                    src={scenario.thumbnail}
                    alt={scenario.title}
                    className="w-20 h-20 rounded-lg object-cover flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold mb-1" style={{ color: colors.textPrimary }}>
                      {scenario.title}
                    </h4>
                    <p className="text-sm mb-2 line-clamp-1" style={{ color: colors.textSecondary }}>
                      {scenario.description}
                    </p>
                    <div className="flex items-center gap-2 text-xs">
                      <Users className="w-3 h-3" style={{ color: colors.iconColor }} />
                      <span style={{ color: colors.textSecondary }}>by {scenario.author}</span>
                      <span>•</span>
                      <Star className="w-3 h-3" style={{ fill: colors.warningColor, color: colors.warningColor }} />
                      <span style={{ color: colors.textSecondary }}>{scenario.rating}</span>
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 flex-shrink-0" style={{ color: colors.textTertiary }} />
                </div>
              </button>
            ))}
          </div>
        )}

        {/* Quick Practice */}
        {currentView === 'quick-practice' && (
          <div className="p-4 space-y-4">
            <Button
              onClick={() => setCurrentView('categories')}
              variant="ghost"
              className="mb-2"
              style={{ color: colors.textSecondary }}
              aria-label="Back to categories"
            >
              <ChevronLeft className="w-4 h-4 mr-2" />
              Back
            </Button>

            <div 
              className="rounded-2xl p-8 text-center"
              style={{
                background: colors.cardBg,
                backdropFilter: colors.blur,
                WebkitBackdropFilter: colors.blur,
                border: colors.glassBorder,
                boxShadow: colors.shadow,
              }}
            >
              <div 
                className="w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-4"
                style={{ background: colors.successBg }}
              >
                <Shuffle className="w-12 h-12" style={{ color: colors.successColor }} />
              </div>
              
              <h2 className="text-2xl font-bold mb-2" style={{ fontFamily: 'Poppins, sans-serif', color: colors.textPrimary }}>
                Quick Practice
              </h2>
              
              <p className="text-base mb-6" style={{ color: colors.textSecondary }}>
                Jump into a random scenario matched to your skill level
              </p>

              <Button
                onClick={() => {
                  const randomScenario = scenarios[Math.floor(Math.random() * scenarios.length)];
                  setSelectedScenario(randomScenario);
                  setCurrentView('practice');
                  setPracticeStep(0);
                }}
                className="w-full h-14 rounded-xl font-semibold text-lg mb-4"
                style={{ 
                  background: colors.successColor,
                  color: '#FFFFFF',
                }}
                aria-label="Start random practice"
              >
                <Sparkles className="w-6 h-6 mr-2" />
                Surprise Me!
              </Button>

              <div className="text-sm" style={{ color: colors.textTertiary }}>
                Or choose preferences below
              </div>
            </div>

            {/* Filters */}
            <div 
              className="rounded-2xl p-6"
              style={{
                background: colors.cardBg,
                backdropFilter: colors.blur,
                WebkitBackdropFilter: colors.blur,
                border: colors.glassBorder,
                boxShadow: colors.shadow,
              }}
            >
              <h3 className="text-lg font-semibold mb-4" style={{ color: colors.textPrimary }}>
                Practice Preferences
              </h3>

              <div className="space-y-4">
                <div>
                  <label className="text-sm font-semibold mb-2 block" style={{ color: colors.textPrimary }}>
                    Difficulty
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {['Beginner', 'Intermediate', 'Advanced'].map((level) => (
                      <button
                        key={level}
                        className="h-10 rounded-lg text-sm font-medium"
                        style={{
                          background: colors.iconBg,
                          color: colors.iconColor,
                        }}
                        aria-label={level}
                      >
                        {level}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-sm font-semibold mb-2 block" style={{ color: colors.textPrimary }}>
                    Category
                  </label>
                  <select
                    className="w-full h-10 px-3 rounded-lg"
                    style={{
                      background: colors.cardBg,
                      border: colors.glassBorder,
                      color: colors.textPrimary,
                    }}
                    aria-label="Select category"
                  >
                    <option>Any Category</option>
                    {categories.map((cat) => (
                      <option key={cat.id}>{cat.name}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Custom Builder */}
        {currentView === 'builder' && (
          <div className="p-4 space-y-4">
            <Button
              onClick={() => setCurrentView('categories')}
              variant="ghost"
              className="mb-2"
              style={{ color: colors.textSecondary }}
              aria-label="Back to categories"
            >
              <ChevronLeft className="w-4 h-4 mr-2" />
              Back
            </Button>

            <div 
              className="rounded-2xl p-6"
              style={{
                background: `linear-gradient(135deg, ${colors.warningColor}20 0%, ${colors.accentColor}20 100%)`,
                border: colors.glassBorder,
                boxShadow: colors.shadow,
              }}
            >
              <div className="flex items-start gap-3 mb-4">
                <div 
                  className="w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0"
                  style={{ background: colors.warningColor }}
                >
                  <Crown className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-bold mb-1" style={{ color: colors.textPrimary }}>
                    Premium Feature
                  </h3>
                  <p className="text-sm" style={{ color: colors.textSecondary }}>
                    Create custom conversation scenarios
                  </p>
                </div>
              </div>
            </div>

            <div 
              className="rounded-2xl p-6"
              style={{
                background: colors.cardBg,
                backdropFilter: colors.blur,
                WebkitBackdropFilter: colors.blur,
                border: colors.glassBorder,
                boxShadow: colors.shadow,
              }}
            >
              <h3 className="text-lg font-semibold mb-4" style={{ color: colors.textPrimary }}>
                Scenario Details
              </h3>

              <div className="space-y-4">
                <div>
                  <label className="text-sm font-semibold mb-2 block" style={{ color: colors.textPrimary }}>
                    Scenario Title
                  </label>
                  <input
                    type="text"
                    placeholder="e.g., Coffee Shop Small Talk"
                    className="w-full h-10 px-4 rounded-xl"
                    style={{
                      background: colors.cardHover,
                      border: colors.glassBorder,
                      color: colors.textPrimary,
                    }}
                    aria-label="Scenario title"
                  />
                </div>

                <div>
                  <label className="text-sm font-semibold mb-2 block" style={{ color: colors.textPrimary }}>
                    Description
                  </label>
                  <textarea
                    placeholder="Describe the scenario..."
                    rows={3}
                    className="w-full px-4 py-3 rounded-xl"
                    style={{
                      background: colors.cardHover,
                      border: colors.glassBorder,
                      color: colors.textPrimary,
                    }}
                    aria-label="Scenario description"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-sm font-semibold mb-2 block" style={{ color: colors.textPrimary }}>
                      Category
                    </label>
                    <select
                      className="w-full h-10 px-3 rounded-xl"
                      style={{
                        background: colors.cardHover,
                        border: colors.glassBorder,
                        color: colors.textPrimary,
                      }}
                      aria-label="Category"
                    >
                      {categories.map((cat) => (
                        <option key={cat.id}>{cat.name}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="text-sm font-semibold mb-2 block" style={{ color: colors.textPrimary }}>
                      Difficulty
                    </label>
                    <select
                      className="w-full h-10 px-3 rounded-xl"
                      style={{
                        background: colors.cardHover,
                        border: colors.glassBorder,
                        color: colors.textPrimary,
                      }}
                      aria-label="Difficulty"
                    >
                      <option>Beginner</option>
                      <option>Intermediate</option>
                      <option>Advanced</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-semibold mb-2 block" style={{ color: colors.textPrimary }}>
                    Context Photo
                  </label>
                  <button
                    className="w-full h-32 rounded-xl flex flex-col items-center justify-center gap-2"
                    style={{ background: colors.iconBg, border: `2px dashed ${colors.iconColor}` }}
                    aria-label="Upload context photo"
                  >
                    <Upload className="w-8 h-8" style={{ color: colors.iconColor }} />
                    <span className="text-sm" style={{ color: colors.textSecondary }}>
                      Upload Photo
                    </span>
                  </button>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <Button
                className="h-12 rounded-xl font-semibold"
                style={{ 
                  background: colors.iconBg,
                  color: colors.iconColor,
                }}
                aria-label="Save draft"
              >
                <Save className="w-5 h-5 mr-2" />
                Save Draft
              </Button>
              <Button
                className="h-12 rounded-xl font-semibold"
                style={{ 
                  background: colors.successColor,
                  color: '#FFFFFF',
                }}
                aria-label="Publish scenario"
              >
                <Check className="w-5 h-5 mr-2" />
                Publish
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
