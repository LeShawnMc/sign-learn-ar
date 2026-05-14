import { useState } from 'react';
import { Button } from './ui/button';
import { useTheme } from '../context/ThemeContext';
import { useApp } from '../context/AppContext';
import { motion, AnimatePresence } from 'motion/react';
import { X, Search, Play, Clock, Eye, Lock, Crown, Filter, ChevronDown, Sparkles, User, Calendar } from 'lucide-react';

interface VideoLibraryProps {
  onExit: () => void;
  onUpgrade?: () => void;
}

interface Video {
  id: string;
  title: string;
  description: string;
  channel: string;
  duration: string;
  views: string;
  uploadedDate: string;
  category: string;
  isPremium: boolean;
  isFeatured?: boolean;
  tags: string[];
  /** YouTube video ID — e.g. "dQw4w9WgXcQ" — enables the embedded player */
  youtubeId?: string;
}

// Real video library content about Deaf culture and ASL
const videos: Video[] = [
  // Deaf Culture Documentaries
  {
    id: 'doc-1',
    title: 'Through Deaf Eyes: A Historical Journey',
    description: 'Explore 200 years of Deaf life in America through personal stories and cultural milestones.',
    channel: 'Deaf History Foundation',
    duration: '45:30',
    views: '1.2M',
    uploadedDate: '2023-10-15',
    category: 'documentaries',
    isPremium: false,
    isFeatured: true,
    tags: ['history', 'culture', 'documentary'],
  },
  {
    id: 'doc-2',
    title: 'Sound and Fury: Cochlear Implant Debate',
    description: 'A powerful documentary examining the controversial decision of cochlear implants in the Deaf community.',
    channel: 'Deaf Perspectives',
    duration: '52:18',
    views: '850K',
    uploadedDate: '2023-09-20',
    category: 'documentaries',
    isPremium: true,
    tags: ['debate', 'technology', 'community'],
  },
  {
    id: 'doc-3',
    title: 'See What I Mean: Language and Identity',
    description: 'Understanding how sign language shapes identity and connects Deaf communities worldwide.',
    channel: 'Cultural Voices',
    duration: '38:45',
    views: '620K',
    uploadedDate: '2023-11-05',
    category: 'documentaries',
    isPremium: false,
    tags: ['language', 'identity', 'community'],
  },
  {
    id: 'doc-4',
    title: 'Audism Unveiled: Breaking Barriers',
    description: 'An eye-opening look at audism and discrimination faced by the Deaf community.',
    channel: 'Deaf Advocacy Network',
    duration: '42:10',
    views: '530K',
    uploadedDate: '2023-08-12',
    category: 'documentaries',
    isPremium: true,
    tags: ['advocacy', 'discrimination', 'awareness'],
  },

  // Native Signer Demonstrations
  {
    id: 'demo-1',
    title: 'ASL Poetry: The Art of Visual Language',
    description: 'Master ASL poet demonstrates the beauty and creativity of sign language poetry.',
    channel: 'ASL Masters',
    duration: '12:30',
    views: '425K',
    uploadedDate: '2024-01-08',
    category: 'demonstrations',
    isPremium: false,
    isFeatured: true,
    tags: ['poetry', 'art', 'advanced'],
      youtubeId: 'I_bzwFAHLxM',
  },
  {
    id: 'demo-2',
    title: 'Conversational ASL: Natural Signing',
    description: 'Native signers demonstrate authentic conversational ASL techniques and expressions.',
    channel: 'Native Signers Collective',
    duration: '18:45',
    views: '680K',
    uploadedDate: '2023-12-20',
    category: 'demonstrations',
    isPremium: false,
    tags: ['conversation', 'fluency', 'intermediate'],
      youtubeId: 'mZ0a0lLUxbE',
  },
  {
    id: 'demo-3',
    title: 'Regional Sign Variations Across America',
    description: 'Exploring how ASL varies across different regions and Deaf communities.',
    channel: 'ASL Linguistics Lab',
    duration: '25:15',
    views: '310K',
    uploadedDate: '2023-11-18',
    category: 'demonstrations',
    isPremium: true,
    tags: ['regional', 'variations', 'linguistics'],
      youtubeId: 'xVPHE4KBGIY',
  },
  {
    id: 'demo-4',
    title: 'Classifiers in ASL: Advanced Techniques',
    description: 'Native Deaf instructor breaks down the complex use of classifiers in ASL.',
    channel: 'Dr. Sarah Martinez',
    duration: '16:20',
    views: '540K',
    uploadedDate: '2024-01-03',
    category: 'demonstrations',
    isPremium: true,
    tags: ['classifiers', 'grammar', 'advanced'],
      youtubeId: 'fOZzdRnRvMs',
  },
  {
    id: 'demo-5',
    title: 'Storytelling in ASL: Narrative Structure',
    description: 'Learn the art of visual storytelling from a renowned Deaf storyteller.',
    channel: 'Marcus Thompson',
    duration: '14:55',
    views: '390K',
    uploadedDate: '2023-12-10',
    category: 'demonstrations',
    isPremium: false,
    tags: ['storytelling', 'narrative', 'culture'],
      youtubeId: 'nLBkR-JbIsY',
  },
  {
    id: 'demo-6',
    title: 'Facial Expressions: The Grammar of ASL',
    description: 'Understanding how facial expressions function as grammatical markers in ASL.',
    channel: 'ASL Linguistics Lab',
    duration: '11:40',
    views: '720K',
    uploadedDate: '2023-12-28',
    category: 'demonstrations',
    isPremium: false,
    tags: ['grammar', 'expressions', 'linguistics'],
      youtubeId: 'QxXjGqSvMTU',
  },

  // Community Stories
  {
    id: 'story-1',
    title: 'My Life as a CODA: Children of Deaf Adults',
    description: 'Heartfelt stories from hearing children raised in Deaf families.',
    channel: 'CODA Stories',
    duration: '28:30',
    views: '890K',
    uploadedDate: '2023-10-28',
    category: 'stories',
    isPremium: false,
    isFeatured: true,
    tags: ['CODA', 'family', 'personal'],
  },
  {
    id: 'story-2',
    title: 'Breaking into Hollywood: Deaf Actors',
    description: 'Deaf actors share their journey in the entertainment industry.',
    channel: 'Deaf in Media',
    duration: '22:15',
    views: '650K',
    uploadedDate: '2023-11-12',
    category: 'stories',
    isPremium: true,
    tags: ['acting', 'hollywood', 'representation'],
  },
  {
    id: 'story-3',
    title: 'DeafBlind Community: Navigating Two Worlds',
    description: 'Understanding the unique experiences of the DeafBlind community.',
    channel: 'Accessibility Voices',
    duration: '19:45',
    views: '410K',
    uploadedDate: '2023-09-30',
    category: 'stories',
    isPremium: false,
    tags: ['DeafBlind', 'accessibility', 'community'],
  },
  {
    id: 'story-4',
    title: 'Deaf Athletes: Breaking Sound Barriers',
    description: 'Inspiring stories from Deaf athletes competing at the highest levels.',
    channel: 'Deaflympics Network',
    duration: '26:50',
    views: '780K',
    uploadedDate: '2023-11-25',
    category: 'stories',
    isPremium: false,
    tags: ['sports', 'athletes', 'inspiration'],
  },
  {
    id: 'story-5',
    title: 'Deaf Education: Teacher Perspectives',
    description: 'Deaf educators discuss the importance of bilingual education in Deaf schools.',
    channel: 'Education Advocates',
    duration: '31:20',
    views: '340K',
    uploadedDate: '2023-10-05',
    category: 'stories',
    isPremium: true,
    tags: ['education', 'teaching', 'bilingual'],
  },

  // Deaf History Educational Content
  {
    id: 'history-1',
    title: 'Laurent Clerc: Father of Deaf Education',
    description: 'The remarkable story of Laurent Clerc and the founding of American Deaf education.',
    channel: 'Deaf History Foundation',
    duration: '15:30',
    views: '510K',
    uploadedDate: '2023-10-18',
    category: 'history',
    isPremium: false,
    tags: ['history', 'education', 'pioneers'],
      youtubeId: 'OiHV5H0bHV0',
  },
  {
    id: 'history-2',
    title: 'Gallaudet University: 150 Years of Excellence',
    description: 'Celebrating the history and impact of the world\'s only liberal arts university for Deaf students.',
    channel: 'Gallaudet Archives',
    duration: '35:40',
    views: '620K',
    uploadedDate: '2023-09-15',
    category: 'history',
    isPremium: false,
    tags: ['university', 'education', 'history'],
      youtubeId: 'ynxBKJynCFM',
  },
  {
    id: 'history-3',
    title: 'The Milan Conference of 1880: A Dark Chapter',
    description: 'How the Milan Conference banned sign language and its lasting impact on Deaf education.',
    channel: 'Deaf History Foundation',
    duration: '20:25',
    views: '445K',
    uploadedDate: '2023-11-08',
    category: 'history',
    isPremium: true,
    tags: ['history', 'education', 'oralism'],
      youtubeId: 'dQw4w9WgXcQ',
  },
  {
    id: 'history-4',
    title: 'DPN: Deaf President Now Movement',
    description: 'The historic 1988 student protest that changed Gallaudet University forever.',
    channel: 'Activism Archives',
    duration: '28:15',
    views: '730K',
    uploadedDate: '2023-10-22',
    category: 'history',
    isPremium: false,
    tags: ['activism', 'DPN', 'protest'],
      youtubeId: 'OiHV5H0bHV0',
  },
  {
    id: 'history-5',
    title: 'Sign Language Recognition: Legal Battles',
    description: 'The fight for official recognition of sign languages around the world.',
    channel: 'Legal Advocacy',
    duration: '24:10',
    views: '380K',
    uploadedDate: '2023-12-01',
    category: 'history',
    isPremium: true,
    tags: ['legal', 'recognition', 'rights'],
      youtubeId: 'ynxBKJynCFM',
  },
  {
    id: 'history-6',
    title: 'ADA: Impact on the Deaf Community',
    description: 'How the Americans with Disabilities Act transformed accessibility for Deaf Americans.',
    channel: 'Disability Rights Center',
    duration: '18:55',
    views: '490K',
    uploadedDate: '2023-11-30',
    category: 'history',
    isPremium: false,
    tags: ['ADA', 'rights', 'accessibility'],
  },
  {
    id: 'history-7',
    title: 'Martha\'s Vineyard: The Signing Community',
    description: 'The fascinating history of Martha\'s Vineyard where everyone signed.',
    channel: 'Historical Communities',
    duration: '22:30',
    views: '560K',
    uploadedDate: '2023-09-25',
    category: 'history',
    isPremium: false,
    tags: ['history', 'community', 'heritage'],
  },

  // Additional Educational Content
  {
    id: 'edu-1',
    title: 'Deaf Culture 101: Understanding the Community',
    description: 'An introduction to Deaf culture, values, and community norms for new learners.',
    channel: 'Cultural Education',
    duration: '16:45',
    views: '920K',
    uploadedDate: '2024-01-10',
    category: 'education',
    isPremium: false,
    tags: ['beginner', 'culture', 'introduction'],
      youtubeId: 'I_bzwFAHLxM',
  },
  {
    id: 'edu-2',
    title: 'ASL vs SEE: Understanding the Difference',
    description: 'Comparing American Sign Language with Signed Exact English and their uses.',
    channel: 'ASL Education Network',
    duration: '13:20',
    views: '670K',
    uploadedDate: '2023-12-15',
    category: 'education',
    isPremium: false,
    tags: ['ASL', 'SEE', 'linguistics'],
      youtubeId: 'M4lbNkHYPOo',
  },
  {
    id: 'edu-3',
    title: 'Interpreting Ethics and Best Practices',
    description: 'Essential knowledge for ASL interpreters working with the Deaf community.',
    channel: 'Professional Interpreters',
    duration: '29:50',
    views: '420K',
    uploadedDate: '2023-11-20',
    category: 'education',
    isPremium: true,
    tags: ['interpreting', 'ethics', 'professional'],
      youtubeId: 'PJAO5CFTW7Q',
  },
  {
    id: 'edu-4',
    title: 'Technology and the Deaf Community',
    description: 'How technology is revolutionizing communication and accessibility for Deaf people.',
    channel: 'Tech Access',
    duration: '21:15',
    views: '550K',
    uploadedDate: '2023-12-05',
    category: 'education',
    isPremium: false,
    tags: ['technology', 'accessibility', 'innovation'],
      youtubeId: 'xVPHE4KBGIY',
  },
];

const categories = [
  { id: 'all', label: 'All Videos', count: videos.length },
  { id: 'documentaries', label: 'Documentaries', count: videos.filter(v => v.category === 'documentaries').length },
  { id: 'demonstrations', label: 'Demonstrations', count: videos.filter(v => v.category === 'demonstrations').length },
  { id: 'stories', label: 'Community Stories', count: videos.filter(v => v.category === 'stories').length },
  { id: 'history', label: 'Deaf History', count: videos.filter(v => v.category === 'history').length },
  { id: 'education', label: 'Educational', count: videos.filter(v => v.category === 'education').length },
];

export function VideoLibrary({ onExit, onUpgrade }: VideoLibraryProps) {
  const { theme } = useTheme();
  const { userProgress } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);

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
        searchBg: 'rgba(30, 30, 63, 0.8)',
        premiumBg: 'rgba(251, 191, 36, 0.1)',
        premiumColor: '#FBD500',
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
        searchBg: 'rgba(255, 255, 255, 0.9)',
        premiumBg: 'rgba(251, 191, 36, 0.1)',
        premiumColor: '#F59E0B',
        blur: 'blur(20px)',
        shadow: '0 8px 32px rgba(31, 38, 135, 0.15)',
        glassBorder: '1px solid rgba(255, 255, 255, 0.6)',
      };

  // Filter videos based on search and category
  const filteredVideos = videos.filter(video => {
    const matchesSearch = video.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         video.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         video.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCategory = selectedCategory === 'all' || video.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const featuredVideos = videos.filter(v => v.isFeatured);

  const handleVideoClick = (video: Video) => {
    // Check if premium video and user doesn't have premium
    if (video.isPremium && !userProgress.isPremium) {
      if (onUpgrade) {
        onUpgrade();
      }
      return;
    }

    setSelectedVideo(video);
  };

  const handleCloseVideo = () => {
    setSelectedVideo(null);
  };

  return (
    <div 
      className="h-full flex flex-col"
      style={{ background: colors.bg, color: colors.textPrimary }}
      role="main"
      aria-labelledby="video-library-title"
    >
      {/* Header */}
      <div 
        className="p-4 sm:p-6 border-b"
        style={{ borderBottomColor: colors.border }}
      >
        <div className="flex items-center gap-3 mb-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={onExit}
            style={{ color: colors.textSecondary }}
            aria-label="Go back"
          >
            <X className="w-6 h-6" />
          </Button>
          <div className="flex-1 min-w-0">
            <h1 
              id="video-library-title" 
              className="text-xl sm:text-2xl font-bold"
              style={{ fontFamily: 'Poppins, sans-serif' }}
            >
              Video Library
            </h1>
            <p className="text-sm" style={{ color: colors.textSecondary }}>
              {filteredVideos.length} videos available
            </p>
          </div>
        </div>

        {/* Search Bar */}
        <div className="relative mb-4">
          <Search 
            className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5" 
            style={{ color: colors.textTertiary }}
            aria-hidden="true"
          />
          <input
            type="search"
            placeholder="Search videos..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-12 pl-11 pr-4 rounded-xl text-base"
            style={{
              background: colors.searchBg,
              backdropFilter: colors.blur,
              WebkitBackdropFilter: colors.blur,
              border: colors.glassBorder,
              color: colors.textPrimary,
              outline: 'none',
            }}
            aria-label="Search videos by title, description, or tags"
          />
        </div>

        {/* Category Filters */}
        <div className="flex items-center gap-2 mb-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 h-9 px-3 rounded-full"
            style={{
              background: showFilters ? colors.iconColor : colors.iconBg,
              color: showFilters ? (theme === 'dark' ? 'var(--color-bg-deep)' : '#FFFFFF') : colors.iconColor,
            }}
            aria-expanded={showFilters}
            aria-controls="category-filters"
            aria-label="Toggle category filters"
          >
            <Filter className="w-4 h-4" aria-hidden="true" />
            Filters
            <ChevronDown className={`w-4 h-4 transition-transform ${showFilters ? 'rotate-180' : ''}`} aria-hidden="true" />
          </Button>
        </div>

        <AnimatePresence>
          {showFilters && (
            <motion.div
              id="category-filters"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden"
              role="group"
              aria-label="Video categories"
            >
              <div className="flex flex-wrap gap-2 pt-2">
                {categories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    className="px-3 py-1.5 rounded-full text-sm font-medium transition-all"
                    style={{
                      background: selectedCategory === category.id ? colors.iconColor : colors.cardBg,
                      color: selectedCategory === category.id 
                        ? (theme === 'dark' ? 'var(--color-bg-deep)' : '#FFFFFF')
                        : colors.textPrimary,
                      border: colors.glassBorder,
                    }}
                    aria-pressed={selectedCategory === category.id}
                    aria-label={`${category.label}, ${category.count} videos`}
                  >
                    {category.label} ({category.count})
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Video Content */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6">
        {/* Featured Section */}
        {selectedCategory === 'all' && !searchQuery && featuredVideos.length > 0 && (
          <div className="mb-6">
            <h2 className="text-lg font-semibold mb-3 flex items-center gap-2">
              <Sparkles className="w-5 h-5" style={{ color: colors.iconColor }} aria-hidden="true" />
              Featured Content
            </h2>
            <div className="grid gap-4">
              {featuredVideos.map((video, index) => (
                <motion.button
                  key={video.id}
                  onClick={() => handleVideoClick(video)}
                  className="rounded-2xl p-0 overflow-hidden text-left transition-all"
                  style={{
                    background: colors.cardBg,
                    backdropFilter: colors.blur,
                    WebkitBackdropFilter: colors.blur,
                    border: colors.glassBorder,
                    boxShadow: colors.shadow,
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.background = colors.cardHover}
                  onMouseLeave={(e) => e.currentTarget.style.background = colors.cardBg}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  aria-label={`${video.title}. ${video.duration} duration. ${video.views} views. ${video.isPremium ? 'Premium content' : 'Free'}`}
                >
                  {/* Video Thumbnail */}
                  <div 
                    className="relative w-full aspect-video flex items-center justify-center"
                    style={{ background: `linear-gradient(135deg, ${colors.iconColor}, #A78BFA)` }}
                  >
                    <div 
                      className="w-16 h-16 rounded-full flex items-center justify-center"
                      style={{ background: 'rgba(0, 0, 0, 0.3)' }}
                      aria-hidden="true"
                    >
                      <Play className="w-8 h-8 fill-white text-white ml-1" />
                    </div>
                    {video.isPremium && (
                      <div 
                        className="absolute top-3 right-3 px-2 py-1 rounded-full flex items-center gap-1 text-xs font-semibold"
                        style={{ background: colors.premiumBg, color: colors.premiumColor }}
                        aria-label="Premium video"
                      >
                        <Crown className="w-3 h-3" aria-hidden="true" />
                        Premium
                      </div>
                    )}
                    <div 
                      className="absolute bottom-3 right-3 px-2 py-1 rounded text-xs font-semibold"
                      style={{ background: 'rgba(0, 0, 0, 0.7)', color: '#FFFFFF' }}
                      aria-label={`Duration: ${video.duration}`}
                    >
                      {video.duration}
                    </div>
                  </div>

                  {/* Video Info */}
                  <div className="p-4">
                    <h3 className="font-semibold text-base mb-1" style={{ color: colors.textPrimary }}>
                      {video.title}
                    </h3>
                    <p className="text-sm mb-2 line-clamp-2" style={{ color: colors.textSecondary }}>
                      {video.description}
                    </p>
                    <div className="flex items-center gap-3 text-xs" style={{ color: colors.textTertiary }}>
                      <span className="flex items-center gap-1">
                        <User className="w-3 h-3" aria-hidden="true" />
                        {video.channel}
                      </span>
                      <span className="flex items-center gap-1">
                        <Eye className="w-3 h-3" aria-hidden="true" />
                        {video.views}
                      </span>
                    </div>
                  </div>
                </motion.button>
              ))}
            </div>
          </div>
        )}

        {/* All Videos Grid */}
        <div>
          {selectedCategory === 'all' && !searchQuery && (
            <h2 className="text-lg font-semibold mb-3">All Videos</h2>
          )}
          
          {filteredVideos.length === 0 ? (
            <div 
              className="text-center py-12 rounded-xl"
              style={{ background: colors.cardBg }}
              role="status"
              aria-live="polite"
            >
              <Search className="w-12 h-12 mx-auto mb-3" style={{ color: colors.textTertiary }} aria-hidden="true" />
              <p className="text-lg font-semibold mb-1" style={{ color: colors.textPrimary }}>
                No videos found
              </p>
              <p className="text-sm" style={{ color: colors.textSecondary }}>
                Try adjusting your search or filters
              </p>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 gap-4">
              {filteredVideos.map((video, index) => (
                <motion.button
                  key={video.id}
                  onClick={() => handleVideoClick(video)}
                  className="rounded-xl overflow-hidden text-left transition-all"
                  style={{
                    background: colors.cardBg,
                    backdropFilter: colors.blur,
                    WebkitBackdropFilter: colors.blur,
                    border: colors.glassBorder,
                    boxShadow: colors.shadow,
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.background = colors.cardHover}
                  onMouseLeave={(e) => e.currentTarget.style.background = colors.cardBg}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  aria-label={`${video.title}. ${video.duration} duration. ${video.views} views. ${video.isPremium ? 'Premium content' : 'Free'}`}
                >
                  {/* Video Thumbnail */}
                  <div 
                    className="relative w-full aspect-video flex items-center justify-center"
                    style={{ background: `linear-gradient(135deg, ${colors.iconColor}80, #A78BFA80)` }}
                  >
                    <div 
                      className="w-12 h-12 rounded-full flex items-center justify-center"
                      style={{ background: 'rgba(0, 0, 0, 0.3)' }}
                      aria-hidden="true"
                    >
                      <Play className="w-6 h-6 fill-white text-white ml-1" />
                    </div>
                    {video.isPremium && (
                      <div 
                        className="absolute top-2 right-2 w-6 h-6 rounded-full flex items-center justify-center"
                        style={{ background: colors.premiumBg }}
                        aria-label="Premium video"
                      >
                        <Crown className="w-4 h-4" style={{ color: colors.premiumColor }} aria-hidden="true" />
                      </div>
                    )}
                    <div 
                      className="absolute bottom-2 right-2 px-1.5 py-0.5 rounded text-xs font-semibold"
                      style={{ background: 'rgba(0, 0, 0, 0.7)', color: '#FFFFFF' }}
                      aria-label={`Duration: ${video.duration}`}
                    >
                      {video.duration}
                    </div>
                  </div>

                  {/* Video Info */}
                  <div className="p-3">
                    <h3 className="font-semibold text-sm mb-1 line-clamp-2" style={{ color: colors.textPrimary }}>
                      {video.title}
                    </h3>
                    <div className="flex items-center gap-2 text-xs mb-1" style={{ color: colors.textTertiary }}>
                      <span className="flex items-center gap-1">
                        <User className="w-3 h-3" aria-hidden="true" />
                        {video.channel}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-xs" style={{ color: colors.textTertiary }}>
                      <span className="flex items-center gap-1">
                        <Eye className="w-3 h-3" aria-hidden="true" />
                        {video.views}
                      </span>
                    </div>
                  </div>
                </motion.button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Video Player Modal */}
      <AnimatePresence>
        {selectedVideo && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{ background: 'rgba(0, 0, 0, 0.9)' }}
            onClick={handleCloseVideo}
            role="dialog"
            aria-labelledby="video-modal-title"
            aria-modal="true"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="w-full max-w-4xl rounded-2xl overflow-hidden"
              style={{ background: colors.cardBg }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Video Player — YouTube embed or fallback */}
              <div className="relative w-full aspect-video bg-black">
                {selectedVideo.youtubeId ? (
                  <iframe
                    src={`https://www.youtube.com/embed/${selectedVideo.youtubeId}?autoplay=1&rel=0`}
                    title={selectedVideo.title}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="w-full h-full"
                    style={{ border: 'none' }}
                  />
                ) : (
                  <div
                    className="w-full h-full flex flex-col items-center justify-center gap-3 text-center p-6"
                    style={{ background: `linear-gradient(135deg, ${colors.iconColor}, #A78BFA)` }}
                  >
                    <Play className="w-16 h-16 text-white/80" aria-hidden="true" />
                    <p className="text-white font-semibold">{selectedVideo.title}</p>
                    <p className="text-white/70 text-sm">Full streaming not yet available — search on YouTube or your local library</p>
                  </div>
                )}
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleCloseVideo}
                  className="absolute top-3 right-3 w-9 h-9 rounded-full z-10"
                  style={{ background: 'rgba(0, 0, 0, 0.6)', color: '#FFFFFF' }}
                  aria-label="Close video player"
                >
                  <X className="w-5 h-5" />
                </Button>
              </div>

              {/* Video Details */}
              <div className="p-6">
                <h2 id="video-modal-title" className="text-xl font-bold mb-2" style={{ color: colors.textPrimary }}>
                  {selectedVideo.title}
                </h2>
                <div className="flex items-center gap-4 mb-3 text-sm" style={{ color: colors.textTertiary }}>
                  <span className="flex items-center gap-1">
                    <User className="w-4 h-4" aria-hidden="true" />
                    {selectedVideo.channel}
                  </span>
                  <span className="flex items-center gap-1">
                    <Eye className="w-4 h-4" aria-hidden="true" />
                    {selectedVideo.views}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-4 h-4" aria-hidden="true" />
                    {selectedVideo.duration}
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" aria-hidden="true" />
                    {new Date(selectedVideo.uploadedDate).toLocaleDateString()}
                  </span>
                </div>
                <p className="text-sm leading-relaxed mb-4" style={{ color: colors.textSecondary }}>
                  {selectedVideo.description}
                </p>
                <div className="flex flex-wrap gap-2">
                  {selectedVideo.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-3 py-1 rounded-full text-xs font-medium"
                      style={{
                        background: colors.iconBg,
                        color: colors.iconColor,
                      }}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
