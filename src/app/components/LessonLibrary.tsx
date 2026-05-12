import { useState, useMemo } from 'react';
import { Button } from './ui/button';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, 
  Search,
  Filter,
  Crown,
  Lock,
  Play,
  Clock,
  BarChart3,
  BookOpen,
  CheckCircle,
  ChevronRight,
  Star,
  Users,
  TrendingUp,
  Globe,
  Briefcase,
  GraduationCap,
  Heart,
  Plane,
  Coffee,
  Home,
  Music,
  Dumbbell,
  ShoppingCart,
  MessageCircle
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { CourseDetailScreen } from './CourseDetailScreen';
import type { Course } from '../types';

type DifficultyLevel = 'beginner' | 'intermediate' | 'advanced' | 'all';
type CourseCategory = 'all' | 'basics' | 'travel' | 'medical' | 'education' | 'business' | 'social' | 'daily-life' | 'hobbies';

interface LessonCourse {
  id: string;
  title: string;
  description: string;
  category: string;
  difficulty: DifficultyLevel;
  duration: string;
  lessonCount: number;
  enrolledCount: number;
  rating: number;
  reviewCount: number;
  isPremium: boolean;
  isCompleted: boolean;
  progress: number;
  thumbnail: string;
  instructor?: string;
  skills: string[];
}

interface LessonLibraryProps {
  onExit: () => void;
  onUpgrade: () => void;
}

export function LessonLibrary({ onExit, onUpgrade }: LessonLibraryProps) {
  const { selectedLanguage } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDifficulty, setSelectedDifficulty] = useState<DifficultyLevel>('all');
  const [selectedCategory, setSelectedCategory] = useState<CourseCategory>('all');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<LessonCourse | null>(null);

  // Comprehensive lesson catalog
  const allCourses: LessonCourse[] = [
    // Basics
    {
      id: 'basics-1',
      title: 'ASL Alphabet Mastery',
      description: 'Learn all 26 letters of the ASL alphabet with proper hand shapes and movements',
      category: 'basics',
      difficulty: 'beginner',
      duration: '45 min',
      lessonCount: 26,
      enrolledCount: 12500,
      rating: 4.9,
      reviewCount: 342,
      isPremium: false,
      isCompleted: true,
      progress: 100,
      thumbnail: '🔤',
      instructor: 'Dr. Sarah Johnson',
      skills: ['Fingerspelling', 'Letter recognition', 'Hand shapes'],
    },
    {
      id: 'basics-2',
      title: 'Numbers & Counting',
      description: 'Master numbers 1-100, counting techniques, and mathematical signs',
      category: 'basics',
      difficulty: 'beginner',
      duration: '30 min',
      lessonCount: 15,
      enrolledCount: 10200,
      rating: 4.8,
      reviewCount: 289,
      isPremium: false,
      isCompleted: false,
      progress: 60,
      thumbnail: '🔢',
      instructor: 'Michael Chen',
      skills: ['Numbers', 'Counting', 'Math signs'],
    },
    {
      id: 'basics-3',
      title: 'Common Phrases & Greetings',
      description: 'Essential everyday phrases for introductions and casual conversations',
      category: 'basics',
      difficulty: 'beginner',
      duration: '1 hour',
      lessonCount: 20,
      enrolledCount: 15800,
      rating: 4.9,
      reviewCount: 456,
      isPremium: false,
      isCompleted: false,
      progress: 35,
      thumbnail: '👋',
      instructor: 'Dr. Sarah Johnson',
      skills: ['Greetings', 'Introductions', 'Basic conversation'],
    },
    {
      id: 'basics-4',
      title: 'Colors & Descriptions',
      description: 'Learn to sign all colors and common descriptive adjectives',
      category: 'basics',
      difficulty: 'beginner',
      duration: '25 min',
      lessonCount: 18,
      enrolledCount: 8900,
      rating: 4.7,
      reviewCount: 198,
      isPremium: true,
      isCompleted: false,
      progress: 0,
      thumbnail: '🎨',
      instructor: 'Emma Rodriguez',
      skills: ['Colors', 'Adjectives', 'Descriptions'],
    },

    // Travel
    {
      id: 'travel-1',
      title: 'Airport & Flight Signs',
      description: 'Navigate airports confidently with essential travel vocabulary',
      category: 'travel',
      difficulty: 'intermediate',
      duration: '40 min',
      lessonCount: 25,
      enrolledCount: 6700,
      rating: 4.8,
      reviewCount: 167,
      isPremium: true,
      isCompleted: false,
      progress: 0,
      thumbnail: '✈️',
      instructor: 'James Wilson',
      skills: ['Airport vocabulary', 'Flight terms', 'Travel phrases'],
    },
    {
      id: 'travel-2',
      title: 'Hotel & Accommodation',
      description: 'Check-in, room service, and hotel-related communication',
      category: 'travel',
      difficulty: 'intermediate',
      duration: '35 min',
      lessonCount: 22,
      enrolledCount: 5400,
      rating: 4.7,
      reviewCount: 134,
      isPremium: true,
      isCompleted: false,
      progress: 0,
      thumbnail: '🏨',
      instructor: 'Lisa Park',
      skills: ['Hotel vocabulary', 'Reservations', 'Room requests'],
    },
    {
      id: 'travel-3',
      title: 'Directions & Transportation',
      description: 'Ask for directions and use public transportation effectively',
      category: 'travel',
      difficulty: 'intermediate',
      duration: '45 min',
      lessonCount: 28,
      enrolledCount: 7200,
      rating: 4.9,
      reviewCount: 201,
      isPremium: true,
      isCompleted: false,
      progress: 0,
      thumbnail: '🗺️',
      instructor: 'Michael Chen',
      skills: ['Directions', 'Transportation', 'Navigation'],
    },
    {
      id: 'travel-4',
      title: 'Tourist Attractions & Activities',
      description: 'Discuss sightseeing, museums, and tourist destinations',
      category: 'travel',
      difficulty: 'intermediate',
      duration: '30 min',
      lessonCount: 20,
      enrolledCount: 4800,
      rating: 4.6,
      reviewCount: 112,
      isPremium: true,
      isCompleted: false,
      progress: 0,
      thumbnail: '🎭',
      instructor: 'Emma Rodriguez',
      skills: ['Tourist vocabulary', 'Activities', 'Attractions'],
    },

    // Medical
    {
      id: 'medical-1',
      title: 'Medical Emergencies',
      description: 'Critical signs for emergency situations and urgent medical needs',
      category: 'medical',
      difficulty: 'advanced',
      duration: '50 min',
      lessonCount: 30,
      enrolledCount: 8900,
      rating: 5.0,
      reviewCount: 278,
      isPremium: true,
      isCompleted: false,
      progress: 0,
      thumbnail: '🚑',
      instructor: 'Dr. Rachel Kim',
      skills: ['Emergency phrases', 'Medical terms', 'Urgent communication'],
    },
    {
      id: 'medical-2',
      title: 'Body Parts & Symptoms',
      description: 'Describe pain, symptoms, and specific body parts accurately',
      category: 'medical',
      difficulty: 'intermediate',
      duration: '45 min',
      lessonCount: 35,
      enrolledCount: 7600,
      rating: 4.8,
      reviewCount: 234,
      isPremium: true,
      isCompleted: false,
      progress: 0,
      thumbnail: '🩺',
      instructor: 'Dr. Rachel Kim',
      skills: ['Anatomy', 'Symptoms', 'Pain description'],
    },
    {
      id: 'medical-3',
      title: 'Pharmacy & Medications',
      description: 'Communicate with pharmacists about prescriptions and medications',
      category: 'medical',
      difficulty: 'intermediate',
      duration: '35 min',
      lessonCount: 24,
      enrolledCount: 5200,
      rating: 4.7,
      reviewCount: 145,
      isPremium: true,
      isCompleted: false,
      progress: 0,
      thumbnail: '💊',
      instructor: 'James Wilson',
      skills: ['Medications', 'Prescriptions', 'Pharmacy terms'],
    },
    {
      id: 'medical-4',
      title: 'Doctor Appointments & Consultations',
      description: 'Navigate medical appointments and communicate with healthcare providers',
      category: 'medical',
      difficulty: 'advanced',
      duration: '55 min',
      lessonCount: 32,
      enrolledCount: 6400,
      rating: 4.9,
      reviewCount: 189,
      isPremium: true,
      isCompleted: false,
      progress: 0,
      thumbnail: '👨‍⚕️',
      instructor: 'Dr. Rachel Kim',
      skills: ['Medical consultations', 'Health discussions', 'Medical history'],
    },

    // Education
    {
      id: 'education-1',
      title: 'Classroom Essentials',
      description: 'School vocabulary, classroom objects, and educational terms',
      category: 'education',
      difficulty: 'beginner',
      duration: '40 min',
      lessonCount: 28,
      enrolledCount: 9800,
      rating: 4.8,
      reviewCount: 267,
      isPremium: false,
      isCompleted: false,
      progress: 15,
      thumbnail: '📚',
      instructor: 'Dr. Sarah Johnson',
      skills: ['School vocabulary', 'Classroom terms', 'Educational signs'],
    },
    {
      id: 'education-2',
      title: 'Academic Subjects',
      description: 'Discuss math, science, history, and other academic subjects',
      category: 'education',
      difficulty: 'intermediate',
      duration: '50 min',
      lessonCount: 35,
      enrolledCount: 7100,
      rating: 4.7,
      reviewCount: 198,
      isPremium: true,
      isCompleted: false,
      progress: 0,
      thumbnail: '🔬',
      instructor: 'Michael Chen',
      skills: ['Subject vocabulary', 'Academic terms', 'Study-related signs'],
    },
    {
      id: 'education-3',
      title: 'Parent-Teacher Communication',
      description: 'Effective communication for parent-teacher conferences',
      category: 'education',
      difficulty: 'intermediate',
      duration: '45 min',
      lessonCount: 26,
      enrolledCount: 5600,
      rating: 4.9,
      reviewCount: 156,
      isPremium: true,
      isCompleted: false,
      progress: 0,
      thumbnail: '👨‍👩‍👧',
      instructor: 'Lisa Park',
      skills: ['Parent communication', 'Academic discussions', 'Progress reports'],
    },
    {
      id: 'education-4',
      title: 'College & University',
      description: 'Higher education vocabulary and campus life',
      category: 'education',
      difficulty: 'advanced',
      duration: '60 min',
      lessonCount: 40,
      enrolledCount: 4200,
      rating: 4.8,
      reviewCount: 124,
      isPremium: true,
      isCompleted: false,
      progress: 0,
      thumbnail: '🎓',
      instructor: 'Dr. Sarah Johnson',
      skills: ['University terms', 'Campus vocabulary', 'Academic life'],
    },

    // Business
    {
      id: 'business-1',
      title: 'Office & Workplace Basics',
      description: 'Essential vocabulary for office environments and workplace communication',
      category: 'business',
      difficulty: 'intermediate',
      duration: '45 min',
      lessonCount: 30,
      enrolledCount: 8200,
      rating: 4.8,
      reviewCount: 245,
      isPremium: true,
      isCompleted: false,
      progress: 0,
      thumbnail: '💼',
      instructor: 'James Wilson',
      skills: ['Office vocabulary', 'Workplace terms', 'Professional signs'],
    },
    {
      id: 'business-2',
      title: 'Meetings & Presentations',
      description: 'Navigate business meetings and deliver presentations effectively',
      category: 'business',
      difficulty: 'advanced',
      duration: '55 min',
      lessonCount: 35,
      enrolledCount: 6800,
      rating: 4.9,
      reviewCount: 201,
      isPremium: true,
      isCompleted: false,
      progress: 0,
      thumbnail: '📊',
      instructor: 'Emma Rodriguez',
      skills: ['Meeting vocabulary', 'Presentations', 'Business discussions'],
    },
    {
      id: 'business-3',
      title: 'Job Interviews & Hiring',
      description: 'Ace job interviews and discuss employment opportunities',
      category: 'business',
      difficulty: 'advanced',
      duration: '50 min',
      lessonCount: 28,
      enrolledCount: 7500,
      rating: 5.0,
      reviewCount: 189,
      isPremium: true,
      isCompleted: false,
      progress: 0,
      thumbnail: '🤝',
      instructor: 'Lisa Park',
      skills: ['Interview skills', 'Employment terms', 'Career vocabulary'],
    },
    {
      id: 'business-4',
      title: 'Customer Service & Sales',
      description: 'Provide excellent customer service and handle sales interactions',
      category: 'business',
      difficulty: 'intermediate',
      duration: '40 min',
      lessonCount: 32,
      enrolledCount: 5900,
      rating: 4.7,
      reviewCount: 167,
      isPremium: true,
      isCompleted: false,
      progress: 0,
      thumbnail: '🛍️',
      instructor: 'Michael Chen',
      skills: ['Customer service', 'Sales vocabulary', 'Service interactions'],
    },

    // Social
    {
      id: 'social-1',
      title: 'Family & Relationships',
      description: 'Discuss family members, relationships, and personal connections',
      category: 'social',
      difficulty: 'beginner',
      duration: '35 min',
      lessonCount: 25,
      enrolledCount: 11200,
      rating: 4.8,
      reviewCount: 312,
      isPremium: false,
      isCompleted: false,
      progress: 20,
      thumbnail: '👨‍👩‍👧‍👦',
      instructor: 'Emma Rodriguez',
      skills: ['Family vocabulary', 'Relationships', 'Personal connections'],
    },
    {
      id: 'social-2',
      title: 'Dating & Romance',
      description: 'Navigate romantic conversations and express feelings',
      category: 'social',
      difficulty: 'intermediate',
      duration: '40 min',
      lessonCount: 22,
      enrolledCount: 6400,
      rating: 4.6,
      reviewCount: 178,
      isPremium: true,
      isCompleted: false,
      progress: 0,
      thumbnail: '💕',
      instructor: 'Lisa Park',
      skills: ['Romance vocabulary', 'Emotions', 'Dating phrases'],
    },
    {
      id: 'social-3',
      title: 'Social Events & Celebrations',
      description: 'Communicate at parties, weddings, and social gatherings',
      category: 'social',
      difficulty: 'intermediate',
      duration: '45 min',
      lessonCount: 30,
      enrolledCount: 7800,
      rating: 4.9,
      reviewCount: 234,
      isPremium: true,
      isCompleted: false,
      progress: 0,
      thumbnail: '🎉',
      instructor: 'Dr. Sarah Johnson',
      skills: ['Event vocabulary', 'Celebrations', 'Social interactions'],
    },
    {
      id: 'social-4',
      title: 'Hobbies & Interests',
      description: 'Share your hobbies, interests, and recreational activities',
      category: 'social',
      difficulty: 'beginner',
      duration: '30 min',
      lessonCount: 20,
      enrolledCount: 8900,
      rating: 4.7,
      reviewCount: 201,
      isPremium: false,
      isCompleted: false,
      progress: 0,
      thumbnail: '🎨',
      instructor: 'Michael Chen',
      skills: ['Hobby vocabulary', 'Interests', 'Recreation'],
    },

    // Daily Life
    {
      id: 'daily-1',
      title: 'Food & Dining',
      description: 'Order at restaurants, discuss food preferences, and cooking',
      category: 'daily-life',
      difficulty: 'beginner',
      duration: '40 min',
      lessonCount: 35,
      enrolledCount: 13500,
      rating: 4.9,
      reviewCount: 389,
      isPremium: false,
      isCompleted: false,
      progress: 45,
      thumbnail: '🍽️',
      instructor: 'James Wilson',
      skills: ['Food vocabulary', 'Restaurant terms', 'Dining phrases'],
    },
    {
      id: 'daily-2',
      title: 'Shopping & Retail',
      description: 'Navigate stores, ask about prices, and make purchases',
      category: 'daily-life',
      difficulty: 'beginner',
      duration: '35 min',
      lessonCount: 28,
      enrolledCount: 10800,
      rating: 4.8,
      reviewCount: 298,
      isPremium: false,
      isCompleted: false,
      progress: 10,
      thumbnail: '🛒',
      instructor: 'Emma Rodriguez',
      skills: ['Shopping vocabulary', 'Retail terms', 'Transaction phrases'],
    },
    {
      id: 'daily-3',
      title: 'Home & Housing',
      description: 'Discuss living situations, household items, and home maintenance',
      category: 'daily-life',
      difficulty: 'intermediate',
      duration: '50 min',
      lessonCount: 40,
      enrolledCount: 7200,
      rating: 4.7,
      reviewCount: 189,
      isPremium: true,
      isCompleted: false,
      progress: 0,
      thumbnail: '🏠',
      instructor: 'Lisa Park',
      skills: ['Home vocabulary', 'Housing terms', 'Household items'],
    },
    {
      id: 'daily-4',
      title: 'Weather & Environment',
      description: 'Discuss weather conditions, climate, and environmental topics',
      category: 'daily-life',
      difficulty: 'beginner',
      duration: '25 min',
      lessonCount: 18,
      enrolledCount: 9100,
      rating: 4.6,
      reviewCount: 223,
      isPremium: false,
      isCompleted: false,
      progress: 0,
      thumbnail: '☀️',
      instructor: 'Michael Chen',
      skills: ['Weather vocabulary', 'Climate terms', 'Nature signs'],
    },

    // Hobbies
    {
      id: 'hobbies-1',
      title: 'Sports & Fitness',
      description: 'Athletic activities, exercise, and sports terminology',
      category: 'hobbies',
      difficulty: 'intermediate',
      duration: '45 min',
      lessonCount: 32,
      enrolledCount: 8700,
      rating: 4.8,
      reviewCount: 256,
      isPremium: true,
      isCompleted: false,
      progress: 0,
      thumbnail: '⚽',
      instructor: 'James Wilson',
      skills: ['Sports vocabulary', 'Fitness terms', 'Athletic signs'],
    },
    {
      id: 'hobbies-2',
      title: 'Music & Entertainment',
      description: 'Discuss music, concerts, and entertainment preferences',
      category: 'hobbies',
      difficulty: 'intermediate',
      duration: '40 min',
      lessonCount: 28,
      enrolledCount: 7400,
      rating: 4.9,
      reviewCount: 212,
      isPremium: true,
      isCompleted: false,
      progress: 0,
      thumbnail: '🎵',
      instructor: 'Emma Rodriguez',
      skills: ['Music vocabulary', 'Entertainment terms', 'Concert signs'],
    },
    {
      id: 'hobbies-3',
      title: 'Arts & Crafts',
      description: 'Creative activities, art forms, and crafting vocabulary',
      category: 'hobbies',
      difficulty: 'beginner',
      duration: '30 min',
      lessonCount: 22,
      enrolledCount: 6200,
      rating: 4.7,
      reviewCount: 178,
      isPremium: true,
      isCompleted: false,
      progress: 0,
      thumbnail: '🎨',
      instructor: 'Dr. Sarah Johnson',
      skills: ['Art vocabulary', 'Craft terms', 'Creative signs'],
    },
    {
      id: 'hobbies-4',
      title: 'Technology & Gaming',
      description: 'Tech gadgets, gaming, and digital communication',
      category: 'hobbies',
      difficulty: 'intermediate',
      duration: '35 min',
      lessonCount: 26,
      enrolledCount: 9800,
      rating: 4.8,
      reviewCount: 289,
      isPremium: true,
      isCompleted: false,
      progress: 0,
      thumbnail: '🎮',
      instructor: 'Michael Chen',
      skills: ['Tech vocabulary', 'Gaming terms', 'Digital signs'],
    },
  ];

  // Categories configuration
  const categories = [
    { id: 'all', name: 'All Courses', icon: <BookOpen className="w-5 h-5" />, count: allCourses.length },
    { id: 'basics', name: 'Basics', icon: <Star className="w-5 h-5" />, count: allCourses.filter(c => c.category === 'basics').length },
    { id: 'travel', name: 'Travel', icon: <Plane className="w-5 h-5" />, count: allCourses.filter(c => c.category === 'travel').length },
    { id: 'medical', name: 'Medical', icon: <Heart className="w-5 h-5" />, count: allCourses.filter(c => c.category === 'medical').length },
    { id: 'education', name: 'Education', icon: <GraduationCap className="w-5 h-5" />, count: allCourses.filter(c => c.category === 'education').length },
    { id: 'business', name: 'Business', icon: <Briefcase className="w-5 h-5" />, count: allCourses.filter(c => c.category === 'business').length },
    { id: 'social', name: 'Social', icon: <MessageCircle className="w-5 h-5" />, count: allCourses.filter(c => c.category === 'social').length },
    { id: 'daily-life', name: 'Daily Life', icon: <Coffee className="w-5 h-5" />, count: allCourses.filter(c => c.category === 'daily-life').length },
    { id: 'hobbies', name: 'Hobbies', icon: <Music className="w-5 h-5" />, count: allCourses.filter(c => c.category === 'hobbies').length },
  ];

  // Difficulty levels
  const difficultyLevels: { id: DifficultyLevel; name: string; color: string }[] = [
    { id: 'all', name: 'All Levels', color: 'gray' },
    { id: 'beginner', name: 'Beginner', color: 'green' },
    { id: 'intermediate', name: 'Intermediate', color: 'yellow' },
    { id: 'advanced', name: 'Advanced', color: 'red' },
  ];

  // Filter and search logic
  const filteredCourses = useMemo(() => {
    return allCourses.filter(course => {
      // Search filter
      const matchesSearch = searchQuery === '' || 
        course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        course.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        course.skills.some(skill => skill.toLowerCase().includes(searchQuery.toLowerCase()));

      // Category filter
      const matchesCategory = selectedCategory === 'all' || course.category === selectedCategory;

      // Difficulty filter
      const matchesDifficulty = selectedDifficulty === 'all' || course.difficulty === selectedDifficulty;

      return matchesSearch && matchesCategory && matchesDifficulty;
    });
  }, [searchQuery, selectedCategory, selectedDifficulty, allCourses]);

  // Course detail view
  if (selectedCourse) {
    // Convert LessonCourse to Course type
    const courseData: Course = {
      ...selectedCourse,
      courseCategory: selectedCourse.category,
    } as Course;
    
    return (
      <CourseDetailScreen 
        course={courseData}
        onExit={() => setSelectedCourse(null)}
        onUpgrade={onUpgrade}
      />
    );
  }

  // Main library view
  return (
    <div 
      className="min-h-screen bg-black text-white flex flex-col"
      role="main"
      aria-labelledby="library-title"
    >
      {/* Header */}
      <div className="p-6 pb-4">
        <div className="flex items-center justify-between mb-4">
          <h1 id="library-title" className="text-2xl font-bold">Lesson Library</h1>
          <Button
            variant="ghost"
            size="icon"
            onClick={onExit}
            className="w-10 h-10 rounded-full hover:bg-gray-900"
            aria-label="Close library"
          >
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* Search Bar */}
        <div className="relative mb-4">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" aria-hidden="true" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search courses, skills, topics..."
            className="w-full bg-gray-900 border border-gray-800 rounded-xl pl-12 pr-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
            aria-label="Search courses"
          />
        </div>

        {/* Filter Toggle */}
        <Button
          onClick={() => setShowFilters(!showFilters)}
          variant="ghost"
          className="text-blue-500 text-sm h-auto p-0 mb-3"
          aria-expanded={showFilters}
          aria-label="Toggle filters"
        >
          <Filter className="w-4 h-4 mr-1" />
          {showFilters ? 'Hide Filters' : 'Show Filters'}
        </Button>

        {/* Filters */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              {/* Difficulty Filter */}
              <div className="mb-4">
                <label className="block text-sm font-semibold mb-2">Difficulty Level</label>
                <div className="flex flex-wrap gap-2">
                  {difficultyLevels.map(level => (
                    <button
                      key={level.id}
                      onClick={() => setSelectedDifficulty(level.id)}
                      className={`px-4 py-2 rounded-full text-sm font-semibold transition-colors ${
                        selectedDifficulty === level.id
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-900 text-gray-400 hover:text-white'
                      }`}
                      aria-pressed={selectedDifficulty === level.id}
                    >
                      {level.name}
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Categories */}
      <div className="px-6 mb-4">
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide" role="tablist" aria-label="Course categories">
          {categories.map(category => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id as CourseCategory)}
              className={`flex items-center gap-2 px-4 py-2 rounded-full flex-shrink-0 transition-colors ${
                selectedCategory === category.id
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-900 text-gray-400 hover:text-white'
              }`}
              role="tab"
              aria-selected={selectedCategory === category.id}
              aria-label={`${category.name} - ${category.count} courses`}
            >
              {category.icon}
              <span className="font-semibold">{category.name}</span>
              <span className="text-xs bg-white/20 px-2 py-0.5 rounded-full">{category.count}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Results Count */}
      <div className="px-6 mb-4">
        <p className="text-sm text-gray-400">
          {filteredCourses.length} {filteredCourses.length === 1 ? 'course' : 'courses'} found
        </p>
      </div>

      {/* Course List */}
      <div className="flex-1 px-6 pb-6 overflow-y-auto">
        <div className="space-y-3">
          {filteredCourses.map((course, index) => (
            <motion.button
              key={course.id}
              onClick={() => setSelectedCourse(course)}
              className="w-full bg-gray-900 rounded-xl p-4 text-left hover:bg-gray-800 transition-colors"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.03 }}
              aria-label={`${course.title} - ${course.difficulty} - ${course.isPremium ? 'Premium' : 'Free'}`}
            >
              <div className="flex items-start gap-4">
                {/* Thumbnail */}
                <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-blue-600 to-blue-800 flex items-center justify-center flex-shrink-0 text-3xl relative" aria-hidden="true">
                  {course.thumbnail}
                  {course.isPremium && (
                    <div className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-yellow-600 flex items-center justify-center">
                      <Crown className="w-3 h-3" />
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <h3 className="font-semibold line-clamp-1">{course.title}</h3>
                    {course.isCompleted && (
                      <CheckCircle className="w-5 h-5 text-blue-500 flex-shrink-0" aria-label="Completed" />
                    )}
                  </div>
                  <p className="text-sm text-gray-400 line-clamp-2 mb-2">{course.description}</p>
                  
                  {/* Meta info */}
                  <div className="flex items-center gap-3 flex-wrap text-xs text-gray-500">
                    <span className={`px-2 py-0.5 rounded-full ${
                      course.difficulty === 'beginner' ? 'bg-green-600/20 text-green-500' :
                      course.difficulty === 'intermediate' ? 'bg-yellow-600/20 text-yellow-500' :
                      'bg-red-600/20 text-red-500'
                    }`}>
                      {course.difficulty.charAt(0).toUpperCase() + course.difficulty.slice(1)}
                    </span>
                    <div className="flex items-center gap-1">
                      <Star className="w-3 h-3 fill-yellow-500 text-yellow-500" />
                      <span>{course.rating}</span>
                    </div>
                    <span>{course.lessonCount} lessons</span>
                    <span>{course.duration}</span>
                  </div>

                  {/* Progress bar */}
                  {course.progress > 0 && (
                    <div className="mt-2">
                      <div className="h-1 bg-gray-800 rounded-full overflow-hidden" role="progressbar" aria-valuenow={course.progress} aria-valuemin={0} aria-valuemax={100}>
                        <div 
                          className="h-full bg-blue-600"
                          style={{ width: `${course.progress}%` }}
                        />
                      </div>
                    </div>
                  )}
                </div>

                <ChevronRight className="w-5 h-5 text-gray-600 flex-shrink-0 mt-1" />
              </div>
            </motion.button>
          ))}
        </div>

        {/* No results */}
        {filteredCourses.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-12"
          >
            <div className="text-6xl mb-4" aria-hidden="true">🔍</div>
            <h3 className="text-xl font-bold mb-2">No courses found</h3>
            <p className="text-gray-400 mb-6">
              Try adjusting your filters or search terms
            </p>
            <Button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('all');
                setSelectedDifficulty('all');
              }}
              variant="outline"
              className="border-gray-700"
              aria-label="Clear all filters"
            >
              Clear Filters
            </Button>
          </motion.div>
        )}
      </div>
    </div>
  );
}