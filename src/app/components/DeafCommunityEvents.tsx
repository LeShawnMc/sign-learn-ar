import { useState } from 'react';
import { Button } from './ui/button';
import { useTheme } from '../context/ThemeContext';
import { useApp } from '../context/AppContext';
import eventImage from 'figma:asset/7944b3b4274af8e468a1db59dd1fd8c34672e65e.png';
import { 
  X, 
  MapPin,
  Calendar,
  Clock,
  Users,
  DollarSign,
  Video,
  Globe,
  Heart,
  Share2,
  ChevronLeft,
  ChevronRight,
  Search,
  Filter,
  Map,
  List,
  Plus,
  Bell,
  BellOff,
  Bookmark,
  BookmarkCheck,
  ExternalLink,
  Download,
  Mail,
  Phone,
  Link2,
  AlertCircle,
  CheckCircle2,
  Info,
  Navigation,
  Sliders,
  Tag,
  Building2,
  GraduationCap,
  Briefcase,
  Coffee,
  Trophy,
  Megaphone,
  HandHeart,
  PartyPopper,
  Facebook,
  Twitter,
  Instagram,
  Youtube,
  Camera,
  Upload,
  Edit,
  Trash2,
  Eye,
  MessageSquare,
  Star,
  TrendingUp,
  Target,
  Award,
  Zap,
  FileText,
  UserPlus,
  CalendarPlus,
  Send,
  Copy,
} from 'lucide-react';

interface DeafCommunityEventsProps {
  onExit: () => void;
}

interface Event {
  id: string;
  name: string;
  description: string;
  category: string;
  date: string;
  time: string;
  duration: string;
  location: string;
  address: string;
  distance?: string;
  isVirtual: boolean;
  virtualLink?: string;
  host: string;
  hostOrg: string;
  accessibility: string[];
  cost: 'Free' | 'Donation' | 'Paid';
  price?: string;
  rsvpStatus: 'none' | 'interested' | 'going';
  attendeeCount: number;
  isBookmarked: boolean;
  image: string;
}

interface Resource {
  id: string;
  name: string;
  category: string;
  description: string;
  phone?: string;
  email?: string;
  website?: string;
  address?: string;
}

interface Organization {
  id: string;
  name: string;
  description: string;
  mission: string;
  logo: string;
  eventCount: number;
  followers: number;
  isFollowing: boolean;
  phone?: string;
  email?: string;
  website?: string;
  social: {
    facebook?: string;
    twitter?: string;
    instagram?: string;
    youtube?: string;
  };
}

export function DeafCommunityEvents({ onExit }: DeafCommunityEventsProps) {
  const { theme } = useTheme();
  const { userProgress } = useApp();

  const [currentView, setCurrentView] = useState<'events' | 'detail' | 'resources' | 'volunteer' | 'submit' | 'archive' | 'organizations' | 'org-detail'>('events');
  const [viewMode, setViewMode] = useState<'list' | 'map'>('list');
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [selectedOrg, setSelectedOrg] = useState<Organization | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [locationRadius, setLocationRadius] = useState(25);
  const [userLocation] = useState('San Francisco, CA');
  const [showNotificationSettings, setShowNotificationSettings] = useState(false);

  // Event categories
  const [categories] = useState([
    { id: 'social', name: 'Social Gatherings', icon: Coffee, color: '#0EA5E9' },
    { id: 'educational', name: 'Educational Workshops', icon: GraduationCap, color: '#8B5CF6' },
    { id: 'cultural', name: 'Cultural Celebrations', icon: PartyPopper, color: '#EC4899' },
    { id: 'sports', name: 'Sports & Recreation', icon: Trophy, color: '#22C55E' },
    { id: 'professional', name: 'Professional Networking', icon: Briefcase, color: '#F59E0B' },
    { id: 'virtual', name: 'Virtual Events', icon: Video, color: '#06B6D4' },
    { id: 'volunteer', name: 'Volunteer Opportunities', icon: HandHeart, color: '#EF4444' },
    { id: 'advocacy', name: 'Advocacy & Activism', icon: Megaphone, color: '#6366F1' },
  ]);

  // Events
  const [events, setEvents] = useState<Event[]>([
    {
      id: 'event-1',
      name: 'Deaf Coffee Chat - Downtown',
      description: 'Join us for a casual coffee meetup! Practice your signing skills, make new friends, and connect with the local Deaf community. All skill levels welcome, from beginners to fluent signers. Coffee and pastries available for purchase.',
      category: 'social',
      date: '2026-01-15',
      time: '10:00 AM',
      duration: '2 hours',
      location: 'Blue Bottle Coffee',
      address: '66 Mint St, San Francisco, CA 94103',
      distance: '0.8 mi',
      isVirtual: false,
      host: 'Sarah Martinez',
      hostOrg: 'SF Deaf Community Center',
      accessibility: ['ASL interpreter available', 'Wheelchair accessible', 'Quiet space'],
      cost: 'Free',
      rsvpStatus: 'going',
      attendeeCount: 42,
      isBookmarked: true,
      image: eventImage,
    },
    {
      id: 'event-2',
      name: 'ASL Poetry Night',
      description: 'Experience the beauty of American Sign Language through poetry! Local Deaf poets will perform original works, followed by an open mic session. This is a celebration of ASL as an art form and linguistic expression.',
      category: 'educational',
      date: '2026-01-18',
      time: '7:00 PM',
      duration: '3 hours',
      location: 'Gallaudet Theater',
      address: '800 Florida Ave NE, Washington, DC 20002',
      distance: '2.3 mi',
      isVirtual: false,
      host: 'Marcus Johnson',
      hostOrg: 'Gallaudet University',
      accessibility: ['ASL primary language', 'Captioning available', 'Wheelchair accessible'],
      cost: 'Donation',
      price: 'Suggested $10',
      rsvpStatus: 'interested',
      attendeeCount: 87,
      isBookmarked: true,
      image: eventImage,
    },
    {
      id: 'event-3',
      name: 'International Week of the Deaf Celebration',
      description: 'Join us for a week-long celebration of Deaf culture, history, and achievements! Activities include workshops, performances, film screenings, and a grand finale gala. This year\'s theme: "Sign Language Rights for All".',
      category: 'cultural',
      date: '2026-09-21',
      time: '9:00 AM',
      duration: '7 days',
      location: 'Convention Center',
      address: '747 Howard St, San Francisco, CA 94103',
      distance: '1.2 mi',
      isVirtual: false,
      host: 'National Association of the Deaf',
      hostOrg: 'NAD',
      accessibility: ['Full ASL access', 'Captioning', 'Wheelchair accessible', 'Sensory-friendly spaces'],
      cost: 'Paid',
      price: '$50 - $150',
      rsvpStatus: 'none',
      attendeeCount: 523,
      isBookmarked: false,
      image: eventImage,
    },
    {
      id: 'event-4',
      name: 'Deaf Bowling League - Season Opener',
      description: 'Kick off the new season with us! Recreational bowling league for Deaf and hard of hearing adults. Teams of 4-6 players compete in a friendly, social atmosphere. No experience necessary - just bring your enthusiasm!',
      category: 'sports',
      date: '2026-01-20',
      time: '6:30 PM',
      duration: '2.5 hours',
      location: 'Strike Bowling Lounge',
      address: '1475 Folsom St, San Francisco, CA 94103',
      distance: '1.5 mi',
      isVirtual: false,
      host: 'David Chen',
      hostOrg: 'Bay Area Deaf Sports Association',
      accessibility: ['Visual scoring system', 'ASL staff', 'Wheelchair accessible lanes'],
      cost: 'Paid',
      price: '$25/person',
      rsvpStatus: 'none',
      attendeeCount: 64,
      isBookmarked: false,
      image: eventImage,
    },
    {
      id: 'event-5',
      name: 'Deaf Professionals Career Fair',
      description: 'Network with employers committed to diversity and inclusion! Meet hiring managers, learn about job opportunities, and attend career development workshops. Resume reviews and professional headshots available.',
      category: 'professional',
      date: '2026-02-10',
      time: '1:00 PM',
      duration: '4 hours',
      location: 'Moscone Center',
      address: '747 Howard St, San Francisco, CA 94103',
      distance: '1.2 mi',
      isVirtual: false,
      host: 'Jennifer Williams',
      hostOrg: 'Deaf Professional Network',
      accessibility: ['ASL interpreters at all booths', 'Captioning', 'Accessible parking'],
      cost: 'Free',
      rsvpStatus: 'none',
      attendeeCount: 215,
      isBookmarked: false,
      image: eventImage,
    },
    {
      id: 'event-6',
      name: 'Virtual Webinar: Deaf Culture 101',
      description: 'Learn the fundamentals of Deaf culture, history, and community values. This interactive online session covers identity, language, customs, and how to be a respectful ally. Q&A session included.',
      category: 'virtual',
      date: '2026-01-25',
      time: '5:00 PM',
      duration: '1.5 hours',
      location: 'Online - Zoom',
      address: 'Virtual Event',
      isVirtual: true,
      virtualLink: 'https://zoom.us/j/example123',
      host: 'Dr. Rachel Green',
      hostOrg: 'Deaf Studies Institute',
      accessibility: ['ASL interpretation', 'Live captioning', 'Recording available'],
      cost: 'Free',
      rsvpStatus: 'going',
      attendeeCount: 342,
      isBookmarked: true,
      image: eventImage,
    },
    {
      id: 'event-7',
      name: 'Sign Language Teaching Volunteers Needed',
      description: 'Help us teach basic sign language to hearing community members! We need volunteers to assist with beginner ASL classes. No teaching experience required - just passion for sharing ASL. Training provided.',
      category: 'volunteer',
      date: '2026-01-28',
      time: '2:00 PM',
      duration: '3 hours',
      location: 'Community Learning Center',
      address: '1234 Mission St, San Francisco, CA 94103',
      distance: '0.5 mi',
      isVirtual: false,
      host: 'Lisa Thompson',
      hostOrg: 'ASL Outreach Program',
      accessibility: ['ASL primary', 'Wheelchair accessible', 'Parking available'],
      cost: 'Free',
      rsvpStatus: 'none',
      attendeeCount: 28,
      isBookmarked: false,
      image: eventImage,
    },
    {
      id: 'event-8',
      name: 'ADA Accessibility Town Hall',
      description: 'Join community leaders and activists for a discussion on improving accessibility in our city. Topics include public services, employment, and technology. Share your experiences and help shape policy recommendations.',
      category: 'advocacy',
      date: '2026-02-05',
      time: '6:00 PM',
      duration: '2 hours',
      location: 'City Hall Auditorium',
      address: '1 Dr Carlton B Goodlett Pl, San Francisco, CA 94102',
      distance: '2.1 mi',
      isVirtual: false,
      host: 'Michael Brown',
      hostOrg: 'Disability Rights Advocates',
      accessibility: ['ASL interpreters', 'CART services', 'Wheelchair accessible', 'Accessible parking'],
      cost: 'Free',
      rsvpStatus: 'none',
      attendeeCount: 156,
      isBookmarked: false,
      image: eventImage,
    },
  ]);

  // Resources
  const [resources] = useState<Resource[]>([
    {
      id: 'res-1',
      name: 'National Association of the Deaf (NAD)',
      category: 'organization',
      description: 'Premier civil rights organization of, by, and for deaf and hard of hearing individuals in the United States.',
      phone: '(301) 587-1788',
      email: 'nad.info@nad.org',
      website: 'https://www.nad.org',
      address: '8630 Fenton Street, Suite 820, Silver Spring, MD 20910',
    },
    {
      id: 'res-2',
      name: 'Gallaudet University',
      category: 'education',
      description: 'The world\'s only university designed to be barrier-free for deaf and hard of hearing students.',
      phone: '(202) 651-5000',
      email: 'admissions@gallaudet.edu',
      website: 'https://www.gallaudet.edu',
      address: '800 Florida Avenue NE, Washington, DC 20002',
    },
    {
      id: 'res-3',
      name: 'Registry of Interpreters for the Deaf (RID)',
      category: 'support',
      description: 'National membership organization representing professionals who facilitate communication between people who are deaf or hard of hearing and people who can hear.',
      phone: '(703) 838-0030',
      email: 'rid@rid.org',
      website: 'https://www.rid.org',
      address: '333 Commerce Street, Alexandria, VA 22314',
    },
    {
      id: 'res-4',
      name: 'Video Relay Service (VRS)',
      category: 'support',
      description: 'Free telecommunications service for deaf and hard of hearing individuals who use American Sign Language.',
      phone: '(800) 676-3777',
      website: 'https://www.fcc.gov/vrs',
    },
    {
      id: 'res-5',
      name: 'Deaf-Friendly Medical Practice - Dr. Sarah Kim',
      category: 'healthcare',
      description: 'Primary care physician with ASL proficiency and experience serving the Deaf community.',
      phone: '(415) 555-0123',
      email: 'appointments@drkimmd.com',
      address: '1234 Medical Plaza, San Francisco, CA 94102',
    },
    {
      id: 'res-6',
      name: 'Disability Rights Education & Defense Fund',
      category: 'legal',
      description: 'Leading national civil rights law and policy center directed by individuals with disabilities and parents who have children with disabilities.',
      phone: '(510) 644-2555',
      email: 'info@dredf.org',
      website: 'https://www.dredf.org',
      address: '3075 Adeline Street, Suite 210, Berkeley, CA 94703',
    },
    {
      id: 'res-7',
      name: 'ASL Online Academy',
      category: 'education',
      description: 'Comprehensive online ASL courses taught by Deaf instructors. Self-paced learning with live practice sessions.',
      email: 'info@aslonlineacademy.com',
      website: 'https://www.aslonlineacademy.com',
    },
    {
      id: 'res-8',
      name: 'Communication Access Real-time Translation (CART)',
      category: 'support',
      description: 'Professional captioning services for meetings, events, and classes.',
      phone: '(888) 555-CART',
      email: 'services@cartprovider.com',
      website: 'https://www.cartprovider.com',
    },
  ]);

  // Organizations
  const [organizations, setOrganizations] = useState<Organization[]>([
    {
      id: 'org-1',
      name: 'National Association of the Deaf',
      description: 'The premier civil rights organization of, by, and for deaf and hard of hearing individuals.',
      mission: 'To preserve, protect and promote the civil, human and linguistic rights of deaf and hard of hearing individuals in the United States of America.',
      logo: eventImage,
      eventCount: 48,
      followers: 15234,
      isFollowing: true,
      phone: '(301) 587-1788',
      email: 'nad.info@nad.org',
      website: 'https://www.nad.org',
      social: {
        facebook: 'NADfanpage',
        twitter: 'NADtweets',
        instagram: 'nad_official',
        youtube: 'NADvideo',
      },
    },
    {
      id: 'org-2',
      name: 'SF Deaf Community Center',
      description: 'Local hub for Deaf community events, services, and social gatherings in the San Francisco Bay Area.',
      mission: 'To provide a welcoming space for the Deaf community to connect, learn, and thrive.',
      logo: eventImage,
      eventCount: 23,
      followers: 3456,
      isFollowing: true,
      phone: '(415) 555-DEAF',
      email: 'info@sfdeafcenter.org',
      website: 'https://www.sfdeafcenter.org',
      social: {
        facebook: 'SFDeafCenter',
        instagram: 'sf_deaf_community',
      },
    },
    {
      id: 'org-3',
      name: 'Gallaudet University',
      description: 'The world\'s only university designed to be barrier-free for deaf and hard of hearing students.',
      mission: 'To be a premier institution of learning, teaching, and research for deaf, hard of hearing, and hearing students.',
      logo: eventImage,
      eventCount: 67,
      followers: 28945,
      isFollowing: false,
      phone: '(202) 651-5000',
      email: 'admissions@gallaudet.edu',
      website: 'https://www.gallaudet.edu',
      social: {
        facebook: 'gallaudet',
        twitter: 'GallaudetU',
        instagram: 'gallaudetu',
        youtube: 'gallaudet',
      },
    },
  ]);

  // Filter events
  const getFilteredEvents = () => {
    let filtered = events;

    if (selectedCategory !== 'all') {
      filtered = filtered.filter(e => e.category === selectedCategory);
    }

    if (searchQuery) {
      filtered = filtered.filter(e => 
        e.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        e.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    return filtered;
  };

  const filteredEvents = getFilteredEvents();

  // Handle RSVP
  const handleRSVP = (eventId: string, status: 'interested' | 'going') => {
    setEvents(events.map(event => 
      event.id === eventId 
        ? { ...event, rsvpStatus: event.rsvpStatus === status ? 'none' : status }
        : event
    ));
  };

  // Handle bookmark
  const handleBookmark = (eventId: string) => {
    setEvents(events.map(event => 
      event.id === eventId 
        ? { ...event, isBookmarked: !event.isBookmarked }
        : event
    ));
  };

  // Handle follow organization
  const handleFollowOrg = (orgId: string) => {
    setOrganizations(organizations.map(org => 
      org.id === orgId 
        ? { ...org, isFollowing: !org.isFollowing, followers: org.isFollowing ? org.followers - 1 : org.followers + 1 }
        : org
    ));
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
      aria-labelledby="deaf-community-events-title"
    >
      {/* Header */}
      <div 
        className="p-4 border-b"
        style={{ borderBottomColor: colors.border }}
      >
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <h1 
              id="deaf-community-events-title" 
              className="text-xl sm:text-2xl font-bold"
              style={{ fontFamily: 'Poppins, sans-serif' }}
            >
              {currentView === 'events' && 'Community Events'}
              {currentView === 'detail' && selectedEvent?.name}
              {currentView === 'resources' && 'Community Resources'}
              {currentView === 'volunteer' && 'Volunteer Opportunities'}
              {currentView === 'submit' && 'Submit Event'}
              {currentView === 'archive' && 'Past Events'}
              {currentView === 'organizations' && 'Organizations'}
              {currentView === 'org-detail' && selectedOrg?.name}
            </h1>
            <p className="text-sm" style={{ color: colors.textSecondary }}>
              {currentView === 'events' && `${filteredEvents.length} events near ${userLocation}`}
              {currentView === 'detail' && `${selectedEvent?.date} • ${selectedEvent?.time}`}
              {currentView === 'resources' && `${resources.length} resources available`}
              {currentView === 'volunteer' && 'Make a difference in your community'}
              {currentView === 'submit' && 'Share events with the community'}
              {currentView === 'archive' && 'Your attended events'}
              {currentView === 'organizations' && `${organizations.length} organizations`}
              {currentView === 'org-detail' && `${selectedOrg?.eventCount} events • ${selectedOrg?.followers.toLocaleString()} followers`}
            </p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onExit}
            style={{ color: colors.textSecondary }}
            aria-label="Exit community events"
          >
            <X className="w-6 h-6" />
          </Button>
        </div>

        {/* Quick navigation */}
        {currentView === 'events' && (
          <div className="flex items-center gap-2 mt-3 overflow-x-auto">
            <Button
              onClick={() => setCurrentView('resources')}
              className="h-9 px-3 rounded-xl text-sm whitespace-nowrap"
              style={{ 
                background: colors.successBg,
                color: colors.successColor,
              }}
              aria-label="View resources"
            >
              <Building2 className="w-4 h-4 mr-2" />
              Resources
            </Button>
            <Button
              onClick={() => setCurrentView('volunteer')}
              className="h-9 px-3 rounded-xl text-sm whitespace-nowrap"
              style={{ 
                background: colors.errorBg,
                color: colors.errorColor,
              }}
              aria-label="Volunteer opportunities"
            >
              <HandHeart className="w-4 h-4 mr-2" />
              Volunteer
            </Button>
            <Button
              onClick={() => setCurrentView('organizations')}
              className="h-9 px-3 rounded-xl text-sm whitespace-nowrap"
              style={{ 
                background: colors.accentBg,
                color: colors.accentColor,
              }}
              aria-label="View organizations"
            >
              <Users className="w-4 h-4 mr-2" />
              Organizations
            </Button>
            <Button
              onClick={() => setCurrentView('submit')}
              className="h-9 px-3 rounded-xl text-sm whitespace-nowrap"
              style={{ 
                background: colors.iconBg,
                color: colors.iconColor,
              }}
              aria-label="Submit event"
            >
              <Plus className="w-4 h-4 mr-2" />
              Submit
            </Button>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        {/* Events List View */}
        {currentView === 'events' && (
          <div className="p-4 space-y-4">
            {/* Location and View Controls */}
            <div className="space-y-3">
              {/* Location */}
              <div 
                className="rounded-xl p-3"
                style={{ background: colors.cardBg, border: colors.glassBorder }}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Navigation className="w-4 h-4" style={{ color: colors.iconColor }} />
                    <span className="text-sm font-semibold" style={{ color: colors.textPrimary }}>
                      {userLocation}
                    </span>
                  </div>
                  <Button
                    className="h-8 px-3 rounded-lg text-xs"
                    style={{ background: colors.iconBg, color: colors.iconColor }}
                    aria-label="Change location"
                  >
                    Change
                  </Button>
                </div>
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs" style={{ color: colors.textSecondary }}>
                      Search radius: {locationRadius} miles
                    </span>
                  </div>
                  <input
                    type="range"
                    min="5"
                    max="100"
                    step="5"
                    value={locationRadius}
                    onChange={(e) => setLocationRadius(parseInt(e.target.value))}
                    className="w-full"
                    style={{ accentColor: colors.iconColor }}
                    aria-label="Search radius"
                  />
                </div>
              </div>

              {/* Search and Controls */}
              <div className="flex gap-2">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: colors.textTertiary }} />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search events..."
                    className="w-full h-10 pl-10 pr-4 rounded-xl"
                    style={{
                      background: colors.cardBg,
                      border: colors.glassBorder,
                      color: colors.textPrimary,
                    }}
                    aria-label="Search events"
                  />
                </div>
                <Button
                  onClick={() => setShowFilters(!showFilters)}
                  className="h-10 px-3 rounded-xl"
                  style={{ 
                    background: showFilters ? colors.iconColor : colors.iconBg,
                    color: showFilters ? (theme === 'dark' ? '#0F0F23' : '#FFFFFF') : colors.iconColor,
                  }}
                  aria-label="Toggle filters"
                  aria-pressed={showFilters}
                >
                  <Filter className="w-4 h-4" />
                </Button>
                <Button
                  onClick={() => setViewMode(viewMode === 'list' ? 'map' : 'list')}
                  className="h-10 px-3 rounded-xl"
                  style={{ background: colors.accentBg, color: colors.accentColor }}
                  aria-label={`Switch to ${viewMode === 'list' ? 'map' : 'list'} view`}
                >
                  {viewMode === 'list' ? <Map className="w-4 h-4" /> : <List className="w-4 h-4" />}
                </Button>
              </div>

              {/* Filters */}
              {showFilters && (
                <div 
                  className="rounded-xl p-4"
                  style={{ background: colors.cardBg, border: colors.glassBorder }}
                >
                  <h3 className="text-sm font-semibold mb-3" style={{ color: colors.textPrimary }}>
                    Filter by Category
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={() => setSelectedCategory('all')}
                      className="px-3 py-1.5 rounded-lg text-sm font-medium"
                      style={{
                        background: selectedCategory === 'all' ? colors.iconColor : colors.border,
                        color: selectedCategory === 'all' ? (theme === 'dark' ? '#0F0F23' : '#FFFFFF') : colors.textTertiary,
                      }}
                      aria-label="All categories"
                      aria-pressed={selectedCategory === 'all'}
                    >
                      All
                    </button>
                    {categories.map((cat) => {
                      const Icon = cat.icon;
                      return (
                        <button
                          key={cat.id}
                          onClick={() => setSelectedCategory(cat.id)}
                          className="px-3 py-1.5 rounded-lg text-sm font-medium flex items-center gap-1"
                          style={{
                            background: selectedCategory === cat.id ? cat.color : colors.border,
                            color: selectedCategory === cat.id ? '#FFFFFF' : colors.textTertiary,
                          }}
                          aria-label={cat.name}
                          aria-pressed={selectedCategory === cat.id}
                        >
                          <Icon className="w-3 h-3" />
                          {cat.name.split(' ')[0]}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Events */}
            <div className="space-y-3">
              {filteredEvents.map((event) => {
                const category = categories.find(c => c.id === event.category);
                const Icon = category?.icon || Calendar;
                
                return (
                  <button
                    key={event.id}
                    onClick={() => {
                      setSelectedEvent(event);
                      setCurrentView('detail');
                    }}
                    className="w-full rounded-xl overflow-hidden text-left"
                    style={{
                      background: colors.cardBg,
                      backdropFilter: colors.blur,
                      WebkitBackdropFilter: colors.blur,
                      border: colors.glassBorder,
                      boxShadow: colors.shadow,
                    }}
                    aria-label={`${event.name}, ${event.date} at ${event.time}`}
                  >
                    <div className="relative h-32">
                      <img
                        src={event.image}
                        alt={event.name}
                        className="w-full h-full object-cover"
                      />
                      {event.isBookmarked && (
                        <div 
                          className="absolute top-2 right-2 w-8 h-8 rounded-full flex items-center justify-center"
                          style={{ background: colors.warningColor }}
                        >
                          <Bookmark className="w-4 h-4 text-white" style={{ fill: 'white' }} />
                        </div>
                      )}
                      {event.rsvpStatus !== 'none' && (
                        <div 
                          className="absolute top-2 left-2 px-2 py-1 rounded-lg text-xs font-semibold"
                          style={{ 
                            background: event.rsvpStatus === 'going' ? colors.successColor : colors.iconColor,
                            color: '#FFFFFF',
                          }}
                        >
                          {event.rsvpStatus === 'going' ? 'Going' : 'Interested'}
                        </div>
                      )}
                    </div>

                    <div className="p-4">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <div 
                              className="w-6 h-6 rounded flex items-center justify-center flex-shrink-0"
                              style={{ background: `${category?.color}20` }}
                            >
                              <Icon className="w-3.5 h-3.5" style={{ color: category?.color }} />
                            </div>
                            <h3 className="font-bold line-clamp-1" style={{ color: colors.textPrimary }}>
                              {event.name}
                            </h3>
                          </div>
                          <p className="text-sm line-clamp-2 mb-2" style={{ color: colors.textSecondary }}>
                            {event.description}
                          </p>
                        </div>
                      </div>

                      <div className="space-y-1.5 mb-3">
                        <div className="flex items-center gap-2 text-sm">
                          <Calendar className="w-4 h-4" style={{ color: colors.iconColor }} />
                          <span style={{ color: colors.textPrimary }}>
                            {new Date(event.date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                          </span>
                          <span style={{ color: colors.textTertiary }}>•</span>
                          <Clock className="w-4 h-4" style={{ color: colors.iconColor }} />
                          <span style={{ color: colors.textPrimary }}>{event.time}</span>
                        </div>

                        <div className="flex items-center gap-2 text-sm">
                          {event.isVirtual ? (
                            <>
                              <Video className="w-4 h-4" style={{ color: colors.accentColor }} />
                              <span style={{ color: colors.textPrimary }}>Virtual Event</span>
                            </>
                          ) : (
                            <>
                              <MapPin className="w-4 h-4" style={{ color: colors.errorColor }} />
                              <span style={{ color: colors.textPrimary }} className="line-clamp-1">{event.location}</span>
                              {event.distance && (
                                <>
                                  <span style={{ color: colors.textTertiary }}>•</span>
                                  <span style={{ color: colors.textTertiary }}>{event.distance}</span>
                                </>
                              )}
                            </>
                          )}
                        </div>

                        <div className="flex items-center gap-2 text-sm">
                          <Users className="w-4 h-4" style={{ color: colors.successColor }} />
                          <span style={{ color: colors.textPrimary }}>
                            {event.attendeeCount} attending
                          </span>
                          <span style={{ color: colors.textTertiary }}>•</span>
                          <DollarSign className="w-4 h-4" style={{ color: colors.warningColor }} />
                          <span style={{ color: colors.textPrimary }}>
                            {event.cost}
                            {event.price && ` (${event.price})`}
                          </span>
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <div 
                          className="flex-1 h-9 rounded-lg flex items-center justify-center text-sm font-semibold"
                          style={{ 
                            background: event.rsvpStatus === 'going' ? colors.successColor : colors.successBg,
                            color: event.rsvpStatus === 'going' ? '#FFFFFF' : colors.successColor,
                          }}
                        >
                          {event.rsvpStatus === 'going' ? '✓ Going' : 'RSVP'}
                        </div>
                        <div 
                          className="flex-1 h-9 rounded-lg flex items-center justify-center text-sm font-semibold"
                          style={{ 
                            background: event.rsvpStatus === 'interested' ? colors.iconColor : colors.iconBg,
                            color: event.rsvpStatus === 'interested' ? (theme === 'dark' ? '#0F0F23' : '#FFFFFF') : colors.iconColor,
                          }}
                        >
                          {event.rsvpStatus === 'interested' ? '★ Interested' : 'Interested'}
                        </div>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Event Detail View */}
        {currentView === 'detail' && selectedEvent && (
          <div className="p-4 space-y-4">
            <Button
              onClick={() => setCurrentView('events')}
              variant="ghost"
              className="mb-2"
              style={{ color: colors.textSecondary }}
              aria-label="Back to events"
            >
              <ChevronLeft className="w-4 h-4 mr-2" />
              Back to Events
            </Button>

            {/* Event Image */}
            <div className="rounded-2xl overflow-hidden">
              <img
                src={selectedEvent.image}
                alt={selectedEvent.name}
                className="w-full h-48 object-cover"
              />
            </div>

            {/* Event Info */}
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
                <h2 className="text-2xl font-bold flex-1" style={{ fontFamily: 'Poppins, sans-serif', color: colors.textPrimary }}>
                  {selectedEvent.name}
                </h2>
                <button
                  onClick={() => handleBookmark(selectedEvent.id)}
                  className="w-10 h-10 rounded-full flex items-center justify-center"
                  style={{ background: colors.warningBg }}
                  aria-label={selectedEvent.isBookmarked ? 'Remove bookmark' : 'Bookmark event'}
                  aria-pressed={selectedEvent.isBookmarked}
                >
                  <Bookmark 
                    className="w-5 h-5" 
                    style={{ 
                      color: colors.warningColor,
                      fill: selectedEvent.isBookmarked ? colors.warningColor : 'none',
                    }} 
                  />
                </button>
              </div>

              <p className="text-base mb-4" style={{ color: colors.textSecondary }}>
                {selectedEvent.description}
              </p>

              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div 
                    className="w-10 h-10 rounded-lg flex items-center justify-center"
                    style={{ background: colors.iconBg }}
                  >
                    <Calendar className="w-5 h-5" style={{ color: colors.iconColor }} />
                  </div>
                  <div>
                    <div className="text-sm font-semibold" style={{ color: colors.textPrimary }}>
                      {new Date(selectedEvent.date).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
                    </div>
                    <div className="text-xs" style={{ color: colors.textTertiary }}>
                      {selectedEvent.time} • {selectedEvent.duration}
                    </div>
                  </div>
                </div>

                {selectedEvent.isVirtual ? (
                  <div className="flex items-center gap-3">
                    <div 
                      className="w-10 h-10 rounded-lg flex items-center justify-center"
                      style={{ background: colors.accentBg }}
                    >
                      <Video className="w-5 h-5" style={{ color: colors.accentColor }} />
                    </div>
                    <div className="flex-1">
                      <div className="text-sm font-semibold" style={{ color: colors.textPrimary }}>
                        Virtual Event
                      </div>
                      <div className="text-xs" style={{ color: colors.textTertiary }}>
                        Link will be sent after RSVP
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center gap-3">
                    <div 
                      className="w-10 h-10 rounded-lg flex items-center justify-center"
                      style={{ background: colors.errorBg }}
                    >
                      <MapPin className="w-5 h-5" style={{ color: colors.errorColor }} />
                    </div>
                    <div className="flex-1">
                      <div className="text-sm font-semibold" style={{ color: colors.textPrimary }}>
                        {selectedEvent.location}
                      </div>
                      <div className="text-xs" style={{ color: colors.textTertiary }}>
                        {selectedEvent.address}
                        {selectedEvent.distance && ` • ${selectedEvent.distance} away`}
                      </div>
                    </div>
                  </div>
                )}

                <div className="flex items-center gap-3">
                  <div 
                    className="w-10 h-10 rounded-lg flex items-center justify-center"
                    style={{ background: colors.successBg }}
                  >
                    <Users className="w-5 h-5" style={{ color: colors.successColor }} />
                  </div>
                  <div>
                    <div className="text-sm font-semibold" style={{ color: colors.textPrimary }}>
                      {selectedEvent.attendeeCount} people attending
                    </div>
                    <div className="text-xs" style={{ color: colors.textTertiary }}>
                      Hosted by {selectedEvent.host} • {selectedEvent.hostOrg}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div 
                    className="w-10 h-10 rounded-lg flex items-center justify-center"
                    style={{ background: colors.warningBg }}
                  >
                    <DollarSign className="w-5 h-5" style={{ color: colors.warningColor }} />
                  </div>
                  <div>
                    <div className="text-sm font-semibold" style={{ color: colors.textPrimary }}>
                      {selectedEvent.cost}
                      {selectedEvent.price && ` - ${selectedEvent.price}`}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Accessibility Info */}
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
                Accessibility
              </h3>
              <div className="space-y-2">
                {selectedEvent.accessibility.map((item, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-sm">
                    <CheckCircle2 className="w-4 h-4" style={{ color: colors.successColor }} />
                    <span style={{ color: colors.textSecondary }}>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* RSVP Actions */}
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <Button
                  onClick={() => handleRSVP(selectedEvent.id, 'going')}
                  className="h-14 rounded-xl font-semibold text-lg"
                  style={{ 
                    background: selectedEvent.rsvpStatus === 'going' ? colors.successColor : colors.successBg,
                    color: selectedEvent.rsvpStatus === 'going' ? '#FFFFFF' : colors.successColor,
                  }}
                  aria-label={selectedEvent.rsvpStatus === 'going' ? 'Cancel RSVP' : 'RSVP as going'}
                  aria-pressed={selectedEvent.rsvpStatus === 'going'}
                >
                  <CheckCircle2 className="w-6 h-6 mr-2" />
                  {selectedEvent.rsvpStatus === 'going' ? 'Going!' : 'I\'m Going'}
                </Button>

                <Button
                  onClick={() => handleRSVP(selectedEvent.id, 'interested')}
                  className="h-14 rounded-xl font-semibold text-lg"
                  style={{ 
                    background: selectedEvent.rsvpStatus === 'interested' ? colors.iconColor : colors.iconBg,
                    color: selectedEvent.rsvpStatus === 'interested' ? (theme === 'dark' ? '#0F0F23' : '#FFFFFF') : colors.iconColor,
                  }}
                  aria-label={selectedEvent.rsvpStatus === 'interested' ? 'Not interested' : 'Mark as interested'}
                  aria-pressed={selectedEvent.rsvpStatus === 'interested'}
                >
                  <Star className="w-6 h-6 mr-2" />
                  {selectedEvent.rsvpStatus === 'interested' ? 'Interested!' : 'Interested'}
                </Button>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <Button
                  className="h-11 rounded-xl"
                  style={{ background: colors.accentBg, color: colors.accentColor }}
                  aria-label="Add to calendar"
                >
                  <CalendarPlus className="w-4 h-4 mr-2" />
                  Calendar
                </Button>

                <Button
                  className="h-11 rounded-xl"
                  style={{ background: colors.warningBg, color: colors.warningColor }}
                  aria-label="Set reminder"
                >
                  <Bell className="w-4 h-4 mr-2" />
                  Remind
                </Button>

                <Button
                  className="h-11 rounded-xl"
                  style={{ background: colors.iconBg, color: colors.iconColor }}
                  aria-label="Share event"
                >
                  <Share2 className="w-4 h-4 mr-2" />
                  Share
                </Button>
              </div>

              {selectedEvent.isVirtual && selectedEvent.rsvpStatus === 'going' && (
                <Button
                  className="w-full h-12 rounded-xl font-semibold"
                  style={{ background: colors.accentColor, color: '#FFFFFF' }}
                  aria-label="Join virtual event"
                >
                  <Video className="w-5 h-5 mr-2" />
                  Join Virtual Event
                </Button>
              )}
            </div>
          </div>
        )}

        {/* Resources View */}
        {currentView === 'resources' && (
          <div className="p-4 space-y-4">
            <Button
              onClick={() => setCurrentView('events')}
              variant="ghost"
              className="mb-2"
              style={{ color: colors.textSecondary }}
              aria-label="Back to events"
            >
              <ChevronLeft className="w-4 h-4 mr-2" />
              Back
            </Button>

            {/* Category Filters */}
            <div className="flex gap-2 overflow-x-auto">
              {['All', 'Organizations', 'Education', 'Support Services', 'Healthcare', 'Legal Services'].map((cat) => (
                <button
                  key={cat}
                  className="px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap"
                  style={{
                    background: cat === 'All' ? colors.iconColor : colors.iconBg,
                    color: cat === 'All' ? (theme === 'dark' ? '#0F0F23' : '#FFFFFF') : colors.iconColor,
                  }}
                  aria-label={`Filter by ${cat}`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Resources */}
            <div className="space-y-3">
              {resources.map((resource) => (
                <div
                  key={resource.id}
                  className="rounded-xl p-4"
                  style={{
                    background: colors.cardBg,
                    backdropFilter: colors.blur,
                    WebkitBackdropFilter: colors.blur,
                    border: colors.glassBorder,
                    boxShadow: colors.shadow,
                  }}
                >
                  <h3 className="text-lg font-bold mb-2" style={{ color: colors.textPrimary }}>
                    {resource.name}
                  </h3>
                  <p className="text-sm mb-3" style={{ color: colors.textSecondary }}>
                    {resource.description}
                  </p>

                  <div className="space-y-2">
                    {resource.phone && (
                      <div className="flex items-center gap-2 text-sm">
                        <Phone className="w-4 h-4" style={{ color: colors.iconColor }} />
                        <a href={`tel:${resource.phone}`} style={{ color: colors.textPrimary }}>
                          {resource.phone}
                        </a>
                      </div>
                    )}
                    {resource.email && (
                      <div className="flex items-center gap-2 text-sm">
                        <Mail className="w-4 h-4" style={{ color: colors.successColor }} />
                        <a href={`mailto:${resource.email}`} style={{ color: colors.textPrimary }}>
                          {resource.email}
                        </a>
                      </div>
                    )}
                    {resource.website && (
                      <div className="flex items-center gap-2 text-sm">
                        <Globe className="w-4 h-4" style={{ color: colors.accentColor }} />
                        <a href={resource.website} target="_blank" rel="noopener noreferrer" style={{ color: colors.textPrimary }}>
                          Visit Website
                        </a>
                      </div>
                    )}
                    {resource.address && (
                      <div className="flex items-center gap-2 text-sm">
                        <MapPin className="w-4 h-4" style={{ color: colors.errorColor }} />
                        <span style={{ color: colors.textPrimary }}>{resource.address}</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Organizations View */}
        {currentView === 'organizations' && (
          <div className="p-4 space-y-3">
            <Button
              onClick={() => setCurrentView('events')}
              variant="ghost"
              className="mb-2"
              style={{ color: colors.textSecondary }}
              aria-label="Back to events"
            >
              <ChevronLeft className="w-4 h-4 mr-2" />
              Back
            </Button>

            {organizations.map((org) => (
              <button
                key={org.id}
                onClick={() => {
                  setSelectedOrg(org);
                  setCurrentView('org-detail');
                }}
                className="w-full rounded-xl p-4 text-left"
                style={{
                  background: colors.cardBg,
                  backdropFilter: colors.blur,
                  WebkitBackdropFilter: colors.blur,
                  border: colors.glassBorder,
                  boxShadow: colors.shadow,
                }}
                aria-label={`${org.name}, ${org.eventCount} events, ${org.followers} followers`}
              >
                <div className="flex items-center gap-4 mb-3">
                  <img
                    src={org.logo}
                    alt={org.name}
                    className="w-16 h-16 rounded-lg object-cover"
                  />
                  <div className="flex-1">
                    <h3 className="font-bold mb-1" style={{ color: colors.textPrimary }}>
                      {org.name}
                    </h3>
                    <div className="flex items-center gap-2 text-xs" style={{ color: colors.textTertiary }}>
                      <span>{org.eventCount} events</span>
                      <span>•</span>
                      <span>{org.followers.toLocaleString()} followers</span>
                    </div>
                  </div>
                  <Button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleFollowOrg(org.id);
                    }}
                    className="h-9 px-4 rounded-lg text-sm font-semibold"
                    style={{ 
                      background: org.isFollowing ? colors.border : colors.iconColor,
                      color: org.isFollowing ? colors.textSecondary : (theme === 'dark' ? '#0F0F23' : '#FFFFFF'),
                    }}
                    aria-label={org.isFollowing ? 'Unfollow' : 'Follow'}
                    aria-pressed={org.isFollowing}
                  >
                    {org.isFollowing ? 'Following' : 'Follow'}
                  </Button>
                </div>
                <p className="text-sm line-clamp-2" style={{ color: colors.textSecondary }}>
                  {org.description}
                </p>
              </button>
            ))}
          </div>
        )}

        {/* Organization Detail View */}
        {currentView === 'org-detail' && selectedOrg && (
          <div className="p-4 space-y-4">
            <Button
              onClick={() => setCurrentView('organizations')}
              variant="ghost"
              className="mb-2"
              style={{ color: colors.textSecondary }}
              aria-label="Back to organizations"
            >
              <ChevronLeft className="w-4 h-4 mr-2" />
              Back
            </Button>

            {/* Org Header */}
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
              <div className="flex items-start gap-4 mb-4">
                <img
                  src={selectedOrg.logo}
                  alt={selectedOrg.name}
                  className="w-20 h-20 rounded-xl object-cover"
                />
                <div className="flex-1">
                  <h2 className="text-xl font-bold mb-2" style={{ fontFamily: 'Poppins, sans-serif', color: colors.textPrimary }}>
                    {selectedOrg.name}
                  </h2>
                  <div className="flex items-center gap-3 text-sm mb-3" style={{ color: colors.textTertiary }}>
                    <span>{selectedOrg.eventCount} events</span>
                    <span>•</span>
                    <span>{selectedOrg.followers.toLocaleString()} followers</span>
                  </div>
                  <Button
                    onClick={() => handleFollowOrg(selectedOrg.id)}
                    className="h-10 px-6 rounded-xl font-semibold"
                    style={{ 
                      background: selectedOrg.isFollowing ? colors.border : colors.iconColor,
                      color: selectedOrg.isFollowing ? colors.textSecondary : (theme === 'dark' ? '#0F0F23' : '#FFFFFF'),
                    }}
                    aria-label={selectedOrg.isFollowing ? 'Unfollow organization' : 'Follow organization'}
                    aria-pressed={selectedOrg.isFollowing}
                  >
                    {selectedOrg.isFollowing ? 'Following' : 'Follow'}
                  </Button>
                </div>
              </div>

              <p className="text-base mb-4" style={{ color: colors.textSecondary }}>
                {selectedOrg.description}
              </p>

              <div className="mb-4">
                <h3 className="text-sm font-semibold mb-2" style={{ color: colors.textPrimary }}>
                  Mission
                </h3>
                <p className="text-sm" style={{ color: colors.textSecondary }}>
                  {selectedOrg.mission}
                </p>
              </div>

              <div className="space-y-2">
                {selectedOrg.phone && (
                  <div className="flex items-center gap-2 text-sm">
                    <Phone className="w-4 h-4" style={{ color: colors.iconColor }} />
                    <a href={`tel:${selectedOrg.phone}`} style={{ color: colors.textPrimary }}>
                      {selectedOrg.phone}
                    </a>
                  </div>
                )}
                {selectedOrg.email && (
                  <div className="flex items-center gap-2 text-sm">
                    <Mail className="w-4 h-4" style={{ color: colors.successColor }} />
                    <a href={`mailto:${selectedOrg.email}`} style={{ color: colors.textPrimary }}>
                      {selectedOrg.email}
                    </a>
                  </div>
                )}
                {selectedOrg.website && (
                  <div className="flex items-center gap-2 text-sm">
                    <Globe className="w-4 h-4" style={{ color: colors.accentColor }} />
                    <a href={selectedOrg.website} target="_blank" rel="noopener noreferrer" style={{ color: colors.textPrimary }}>
                      Visit Website
                    </a>
                  </div>
                )}
              </div>

              {selectedOrg.social && (
                <div className="flex gap-2 mt-4">
                  {selectedOrg.social.facebook && (
                    <Button
                      className="w-10 h-10 rounded-lg"
                      style={{ background: '#1877F2', color: '#FFFFFF' }}
                      aria-label="Facebook"
                    >
                      <Facebook className="w-5 h-5" />
                    </Button>
                  )}
                  {selectedOrg.social.twitter && (
                    <Button
                      className="w-10 h-10 rounded-lg"
                      style={{ background: '#1DA1F2', color: '#FFFFFF' }}
                      aria-label="Twitter"
                    >
                      <Twitter className="w-5 h-5" />
                    </Button>
                  )}
                  {selectedOrg.social.instagram && (
                    <Button
                      className="w-10 h-10 rounded-lg"
                      style={{ background: '#E4405F', color: '#FFFFFF' }}
                      aria-label="Instagram"
                    >
                      <Instagram className="w-5 h-5" />
                    </Button>
                  )}
                  {selectedOrg.social.youtube && (
                    <Button
                      className="w-10 h-10 rounded-lg"
                      style={{ background: '#FF0000', color: '#FFFFFF' }}
                      aria-label="YouTube"
                    >
                      <Youtube className="w-5 h-5" />
                    </Button>
                  )}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Submit Event View */}
        {currentView === 'submit' && (
          <div className="p-4 space-y-4">
            <Button
              onClick={() => setCurrentView('events')}
              variant="ghost"
              className="mb-2"
              style={{ color: colors.textSecondary }}
              aria-label="Back to events"
            >
              <ChevronLeft className="w-4 h-4 mr-2" />
              Back
            </Button>

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
                Event Information
              </h3>

              <div className="space-y-4">
                <div>
                  <label className="text-sm font-semibold mb-2 block" style={{ color: colors.textPrimary }}>
                    Event Name *
                  </label>
                  <input
                    type="text"
                    placeholder="e.g., ASL Poetry Night"
                    className="w-full h-10 px-4 rounded-xl"
                    style={{
                      background: colors.cardHover,
                      border: colors.glassBorder,
                      color: colors.textPrimary,
                    }}
                    aria-label="Event name"
                    required
                  />
                </div>

                <div>
                  <label className="text-sm font-semibold mb-2 block" style={{ color: colors.textPrimary }}>
                    Description *
                  </label>
                  <textarea
                    placeholder="Describe your event..."
                    rows={4}
                    className="w-full px-4 py-3 rounded-xl"
                    style={{
                      background: colors.cardHover,
                      border: colors.glassBorder,
                      color: colors.textPrimary,
                    }}
                    aria-label="Event description"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-sm font-semibold mb-2 block" style={{ color: colors.textPrimary }}>
                      Category *
                    </label>
                    <select
                      className="w-full h-10 px-3 rounded-xl"
                      style={{
                        background: colors.cardHover,
                        border: colors.glassBorder,
                        color: colors.textPrimary,
                      }}
                      aria-label="Category"
                      required
                    >
                      {categories.map((cat) => (
                        <option key={cat.id}>{cat.name}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="text-sm font-semibold mb-2 block" style={{ color: colors.textPrimary }}>
                      Date *
                    </label>
                    <input
                      type="date"
                      className="w-full h-10 px-3 rounded-xl"
                      style={{
                        background: colors.cardHover,
                        border: colors.glassBorder,
                        color: colors.textPrimary,
                      }}
                      aria-label="Event date"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="text-sm font-semibold mb-2 block" style={{ color: colors.textPrimary }}>
                    Event Photo
                  </label>
                  <button
                    className="w-full h-32 rounded-xl flex flex-col items-center justify-center gap-2"
                    style={{ background: colors.iconBg, border: `2px dashed ${colors.iconColor}` }}
                    aria-label="Upload event photo"
                  >
                    <Upload className="w-8 h-8" style={{ color: colors.iconColor }} />
                    <span className="text-sm" style={{ color: colors.textSecondary }}>
                      Upload Photo
                    </span>
                  </button>
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <Button
                  className="flex-1 h-12 rounded-xl font-semibold"
                  style={{ background: colors.successColor, color: '#FFFFFF' }}
                  aria-label="Submit event"
                >
                  <Send className="w-5 h-5 mr-2" />
                  Submit for Review
                </Button>
              </div>

              <p className="text-xs mt-3 text-center" style={{ color: colors.textTertiary }}>
                Events are reviewed before publication
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
