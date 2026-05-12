import { useState } from 'react';
import { Button } from './ui/button';
import { useTheme } from '../context/ThemeContext';
import { useApp } from '../context/AppContext';
import exampleImage from 'figma:asset/33757ad956107bcdd4c5c8f5995d9c55daa83676.png';
import { 
  X, 
  BookOpen,
  Users,
  Heart,
  Award,
  Globe,
  Calendar,
  CheckCircle2,
  ChevronRight,
  Play,
  Lock,
  Unlock,
  Clock,
  TrendingUp,
  Star,
  MapPin,
  Phone,
  Mail,
  ExternalLink,
  Info,
  Lightbulb,
  MessageCircle,
  HandHeart,
  Eye,
  Ear,
  Brain,
  GraduationCap,
  Building,
  Flag,
  Sparkles,
  Target,
  Quote,
  History,
  Book,
  FileText,
  Video,
  Image as ImageIcon,
  Link as LinkIcon,
} from 'lucide-react';

interface DeafCultureEducationProps {
  onExit: () => void;
}

interface CulturalLesson {
  id: string;
  title: string;
  category: string;
  description: string;
  duration: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  completed: boolean;
  locked: boolean;
  topics: string[];
}

interface HistoricalEvent {
  id: string;
  year: string;
  title: string;
  description: string;
  significance: string;
  category: string;
}

interface EtiquetteTip {
  id: string;
  title: string;
  category: string;
  description: string;
  dos: string[];
  donts: string[];
  importance: 'essential' | 'important' | 'helpful';
}

interface CommunityResource {
  id: string;
  name: string;
  type: 'organization' | 'school' | 'advocacy' | 'social' | 'technology' | 'arts';
  description: string;
  services: string[];
  contact?: {
    website?: string;
    email?: string;
    phone?: string;
  };
  location?: string;
}

interface DeafFigure {
  id: string;
  name: string;
  birth: string;
  field: string;
  contributions: string[];
  biography: string;
  achievements: string[];
  quote?: string;
  legacy: string;
}

export function DeafCultureEducation({ onExit }: DeafCultureEducationProps) {
  const { theme } = useTheme();
  const { userProgress } = useApp();

  const [selectedTab, setSelectedTab] = useState<'lessons' | 'history' | 'etiquette' | 'resources' | 'figures'>('lessons');
  const [selectedLesson, setSelectedLesson] = useState<CulturalLesson | null>(null);
  const [selectedFigure, setSelectedFigure] = useState<DeafFigure | null>(null);
  const [expandedTip, setExpandedTip] = useState<string | null>(null);

  // Cultural Lessons
  const culturalLessons: CulturalLesson[] = [
    {
      id: 'intro-deaf-culture',
      title: 'Introduction to Deaf Culture',
      category: 'Fundamentals',
      description: 'Understand the core values, beliefs, and practices that define Deaf culture as a rich linguistic and cultural minority.',
      duration: '15 min',
      difficulty: 'beginner',
      completed: true,
      locked: false,
      topics: ['Cultural identity', 'Deaf vs. deaf', 'Community values', 'Pride and identity'],
    },
    {
      id: 'asl-as-language',
      title: 'ASL as a Complete Language',
      category: 'Language',
      description: 'Explore how American Sign Language is a fully developed, complex language with its own grammar, syntax, and linguistic features.',
      duration: '20 min',
      difficulty: 'beginner',
      completed: true,
      locked: false,
      topics: ['Linguistic structure', 'Grammar rules', 'Regional variations', 'Language evolution'],
    },
    {
      id: 'deaf-identity',
      title: 'Deaf Identity and Pride',
      category: 'Identity',
      description: 'Learn about Deaf pride, cultural identity, and the perspective of deafness as a difference rather than a disability.',
      duration: '18 min',
      difficulty: 'beginner',
      completed: false,
      locked: false,
      topics: ['Cultural identity', 'Deaf Pride', 'Medical vs. cultural models', 'Self-identification'],
    },
    {
      id: 'deaf-education',
      title: 'Deaf Education History',
      category: 'History',
      description: 'Trace the evolution of Deaf education from oral-only methods to bilingual-bicultural approaches.',
      duration: '25 min',
      difficulty: 'intermediate',
      completed: false,
      locked: false,
      topics: ['Milan Conference 1880', 'Oralism vs. manualism', 'Deaf schools', 'Modern education'],
    },
    {
      id: 'deaf-art-expression',
      title: 'Deaf Art and Expression',
      category: 'Arts',
      description: 'Discover visual arts, theater, poetry, and storytelling unique to Deaf culture and community.',
      duration: '22 min',
      difficulty: 'intermediate',
      completed: false,
      locked: false,
      topics: ['Visual art', 'Deaf theater', 'ASL poetry', 'Storytelling traditions'],
    },
    {
      id: 'technology-deaf-community',
      title: 'Technology and Access',
      category: 'Technology',
      description: 'Examine how technology has transformed communication access for Deaf individuals.',
      duration: '20 min',
      difficulty: 'intermediate',
      completed: false,
      locked: true,
      topics: ['Video relay services', 'Captioning', 'Video phones', 'Communication apps'],
    },
    {
      id: 'deaf-advocacy',
      title: 'Advocacy and Rights',
      category: 'Rights',
      description: 'Learn about the fight for equal rights, accessibility, and the legislative victories of the Deaf community.',
      duration: '30 min',
      difficulty: 'advanced',
      completed: false,
      locked: true,
      topics: ['ADA', 'Legal rights', 'Accessibility laws', 'Advocacy organizations'],
    },
    {
      id: 'intersectionality',
      title: 'Intersectionality in Deaf Culture',
      category: 'Diversity',
      description: 'Explore the diversity within the Deaf community, including race, gender, LGBTQ+ identities, and more.',
      duration: '25 min',
      difficulty: 'advanced',
      completed: false,
      locked: true,
      topics: ['Diversity', 'Inclusion', 'Multiple identities', 'Community challenges'],
    },
  ];

  // Historical Events
  const historicalEvents: HistoricalEvent[] = [
    {
      id: 'gallaudet-founding',
      year: '1817',
      title: 'First Deaf School in America',
      description: 'Thomas Hopkins Gallaudet and Laurent Clerc founded the American School for the Deaf in Hartford, Connecticut.',
      significance: 'Established formal Deaf education in America and brought French Sign Language, which evolved into ASL.',
      category: 'Education',
    },
    {
      id: 'gallaudet-university',
      year: '1864',
      title: 'Gallaudet University Founded',
      description: 'President Abraham Lincoln signed the charter establishing the National Deaf-Mute College, now Gallaudet University.',
      significance: 'Created the world\'s first and only university designed for Deaf and hard of hearing students.',
      category: 'Education',
    },
    {
      id: 'milan-conference',
      year: '1880',
      title: 'Milan Conference',
      description: 'International Congress on Education of the Deaf declared oral education superior to sign language.',
      significance: 'Led to a ban on sign language in schools that lasted nearly a century, severely impacting Deaf education.',
      category: 'Education',
    },
    {
      id: 'nad-founding',
      year: '1880',
      title: 'NAD Founded',
      description: 'National Association of the Deaf established to preserve sign language and Deaf rights.',
      significance: 'Oldest civil rights organization of, by, and for Deaf and hard of hearing individuals in the United States.',
      category: 'Advocacy',
    },
    {
      id: 'stokoe-research',
      year: '1960',
      title: 'ASL Recognized as Language',
      description: 'Dr. William Stokoe published groundbreaking research proving ASL is a complete, complex language.',
      significance: 'Legitimized ASL in linguistic and academic communities, changing perceptions worldwide.',
      category: 'Language',
    },
    {
      id: 'deaf-president-now',
      year: '1988',
      title: 'Deaf President Now',
      description: 'Students at Gallaudet University protested for a Deaf president, leading to I. King Jordan\'s appointment.',
      significance: 'Landmark civil rights movement demonstrating Deaf empowerment and leadership capabilities.',
      category: 'Advocacy',
    },
    {
      id: 'ada-passage',
      year: '1990',
      title: 'Americans with Disabilities Act',
      description: 'ADA signed into law, prohibiting discrimination and requiring accessibility accommodations.',
      significance: 'Mandated interpreters, captions, and other accommodations, transforming access for Deaf Americans.',
      category: 'Rights',
    },
    {
      id: 'cvaa',
      year: '2010',
      title: 'CVAA Enacted',
      description: 'Twenty-First Century Communications and Video Accessibility Act passed, requiring digital accessibility.',
      significance: 'Extended captioning requirements to internet video and ensured accessible communication technologies.',
      category: 'Technology',
    },
  ];

  // Etiquette Tips
  const etiquetteTips: EtiquetteTip[] = [
    {
      id: 'getting-attention',
      title: 'Getting Someone\'s Attention',
      category: 'Communication',
      description: 'Appropriate ways to get a Deaf person\'s attention without startling or disrespecting them.',
      importance: 'essential',
      dos: [
        'Wave your hand in their visual field',
        'Tap them gently on the shoulder',
        'Use a light flash if available',
        'Have someone else get their attention',
      ],
      donts: [
        'Shout or yell loudly',
        'Tap them on the head',
        'Throw objects to get attention',
        'Stomp extremely hard',
      ],
    },
    {
      id: 'eye-contact',
      title: 'Maintaining Eye Contact',
      category: 'Communication',
      description: 'In Deaf culture, eye contact is essential for respectful communication.',
      importance: 'essential',
      dos: [
        'Maintain direct eye contact when signing',
        'Look at the person, not the interpreter',
        'Keep your face in the conversation',
        'Signal if you need to look away briefly',
      ],
      donts: [
        'Look down or away while signing',
        'Focus on the hands instead of face',
        'Text or multitask during signing',
        'Break eye contact without acknowledgment',
      ],
    },
    {
      id: 'interpreter-use',
      title: 'Working with Interpreters',
      category: 'Communication',
      description: 'Best practices when an interpreter is present for communication.',
      importance: 'essential',
      dos: [
        'Speak directly to the Deaf person, not the interpreter',
        'Maintain normal speaking pace',
        'Address the Deaf person by name',
        'Allow time for interpretation lag',
      ],
      donts: [
        'Say "Tell them..." to the interpreter',
        'Speak to the interpreter instead',
        'Assume the interpreter is invisible',
        'Interrupt or speak too quickly',
      ],
    },
    {
      id: 'name-signs',
      title: 'Name Signs',
      category: 'Cultural Practice',
      description: 'Understanding the cultural significance of name signs in the Deaf community.',
      importance: 'important',
      dos: [
        'Wait to be given a name sign by a Deaf person',
        'Use name signs respectfully',
        'Ask permission before using someone\'s name sign',
        'Understand it\'s an honor to receive one',
      ],
      donts: [
        'Make up your own name sign',
        'Give yourself a name sign',
        'Use offensive or inappropriate signs',
        'Demand a name sign',
      ],
    },
    {
      id: 'deaf-space',
      title: 'Respecting Deaf Space',
      category: 'Physical Space',
      description: 'Understanding visual and spatial needs in Deaf culture.',
      importance: 'important',
      dos: [
        'Provide adequate visual space for signing',
        'Stand at appropriate distance (3-6 feet)',
        'Ensure good lighting on face and hands',
        'Avoid blocking visual lines',
      ],
      donts: [
        'Stand too close or too far',
        'Walk between people signing',
        'Position yourself with backlight',
        'Crowd the visual space',
      ],
    },
    {
      id: 'cultural-events',
      title: 'Attending Deaf Events',
      category: 'Community',
      description: 'Etiquette for attending Deaf community gatherings and events.',
      importance: 'important',
      dos: [
        'Introduce yourself in ASL if possible',
        'Be respectful of cultural norms',
        'Participate and engage authentically',
        'Ask questions if unsure',
      ],
      donts: [
        'Attend only to "practice" ASL',
        'Treat it as a learning opportunity only',
        'Stare at conversations',
        'Assume everyone wants to teach you',
      ],
    },
    {
      id: 'technology-etiquette',
      title: 'Technology and Communication',
      category: 'Technology',
      description: 'Respectful use of technology when communicating with Deaf individuals.',
      importance: 'helpful',
      dos: [
        'Use video calls for visual communication',
        'Ensure captions are available',
        'Ask preferred communication method',
        'Be patient with technology issues',
      ],
      donts: [
        'Assume everyone reads lips',
        'Refuse to use accessible technology',
        'Get frustrated with communication barriers',
        'Ignore accommodation requests',
      ],
    },
    {
      id: 'language-learning',
      title: 'Learning ASL Respectfully',
      category: 'Language',
      description: 'Approaching ASL learning with cultural respect and awareness.',
      importance: 'helpful',
      dos: [
        'Learn about Deaf culture alongside ASL',
        'Take classes from Deaf instructors',
        'Practice with appropriate resources',
        'Acknowledge your learning journey',
      ],
      donts: [
        'Learn only from YouTube without context',
        'Appropriate Deaf culture without understanding',
        'Claim fluency prematurely',
        'Disrespect the language or culture',
      ],
    },
  ];

  // Community Resources
  const communityResources: CommunityResource[] = [
    {
      id: 'nad',
      name: 'National Association of the Deaf (NAD)',
      type: 'advocacy',
      description: 'Nation\'s premier civil rights organization of, by, and for deaf and hard of hearing individuals.',
      services: ['Legal advocacy', 'Policy development', 'Education', 'Community resources'],
      contact: {
        website: 'www.nad.org',
        email: 'nad.info@nad.org',
      },
      location: 'Silver Spring, MD',
    },
    {
      id: 'gallaudet',
      name: 'Gallaudet University',
      type: 'school',
      description: 'World\'s only university designed to be barrier-free for deaf and hard of hearing students.',
      services: ['Higher education', 'Research', 'Outreach programs', 'Cultural events'],
      contact: {
        website: 'www.gallaudet.edu',
        phone: '202-651-5000',
      },
      location: 'Washington, DC',
    },
    {
      id: 'rid',
      name: 'Registry of Interpreters for the Deaf (RID)',
      type: 'organization',
      description: 'National membership organization representing professionals who facilitate communication between deaf and hearing people.',
      services: ['Interpreter certification', 'Professional development', 'Standards of practice', 'Find an interpreter'],
      contact: {
        website: 'www.rid.org',
        email: 'rid@rid.org',
      },
      location: 'Alexandria, VA',
    },
    {
      id: 'deaf-expo',
      name: 'DeafNation Expo',
      type: 'social',
      description: 'Largest traveling trade show and festival for, by, and about the Deaf community.',
      services: ['Networking events', 'Vendor exhibitions', 'Cultural performances', 'Education workshops'],
      contact: {
        website: 'www.deafnation.com',
      },
      location: 'Nationwide events',
    },
    {
      id: 'ncdhr',
      name: 'National Consortium of Interpreter Education Centers (NCIEC)',
      type: 'organization',
      description: 'Network of centers dedicated to developing excellent and ethical interpreters.',
      services: ['Interpreter education', 'Professional development', 'Research', 'Resources'],
      contact: {
        website: 'www.interpretereducation.org',
      },
      location: 'Various locations',
    },
    {
      id: 'sorenson',
      name: 'Sorenson Communications',
      type: 'technology',
      description: 'Leading provider of video relay services and communication technology for the Deaf.',
      services: ['Video relay service (VRS)', 'Video phones', 'Communication apps', 'Technical support'],
      contact: {
        website: 'www.sorenson.com',
        phone: '801-287-9400',
      },
      location: 'Salt Lake City, UT',
    },
    {
      id: 'deaf-can',
      name: 'Deaf Can! Foundation',
      type: 'advocacy',
      description: 'Organization empowering deaf children and their families through education and advocacy.',
      services: ['Family support', 'Educational resources', 'Advocacy', 'Community programs'],
      contact: {
        website: 'www.deafcan.org',
      },
      location: 'Washington, DC',
    },
    {
      id: 'ntid',
      name: 'National Technical Institute for the Deaf (NTID)',
      type: 'school',
      description: 'College of Rochester Institute of Technology providing technical and professional education.',
      services: ['Technical education', 'Career preparation', 'Research', 'Support services'],
      contact: {
        website: 'www.ntid.rit.edu',
        phone: '585-475-6700',
      },
      location: 'Rochester, NY',
    },
    {
      id: 'deafvee',
      name: 'DeafVee',
      type: 'social',
      description: 'Social media platform created by and for the Deaf community.',
      services: ['Social networking', 'Video sharing', 'Community building', 'Cultural exchange'],
      contact: {
        website: 'www.deafvee.com',
      },
      location: 'Online',
    },
    {
      id: 'deaf-west',
      name: 'Deaf West Theatre',
      type: 'arts',
      description: 'Professional theater company that uses American Sign Language and spoken English.',
      services: ['Theater productions', 'Educational programs', 'Arts education', 'Accessibility advocacy'],
      contact: {
        website: 'www.deafwest.org',
      },
      location: 'Los Angeles, CA',
    },
  ];

  // Famous Deaf Figures
  const deafFigures: DeafFigure[] = [
    {
      id: 'laurent-clerc',
      name: 'Laurent Clerc',
      birth: '1785-1869',
      field: 'Education',
      biography: 'Laurent Clerc was a French-American educator who co-founded the first permanent school for the deaf in America. Born deaf in France, he was educated at the Institution Nationale des Sourds-Muets in Paris.',
      contributions: [
        'Co-founded American School for the Deaf (1817)',
        'Brought French Sign Language to America',
        'Trained first generation of American deaf educators',
        'Helped establish ASL as a language',
      ],
      achievements: [
        'First deaf teacher in America',
        'Taught for 41 years',
        'Educated over 1,000 students',
        'Legacy honored in Deaf education',
      ],
      quote: 'The best way to educate the deaf is through sign language.',
      legacy: 'Known as "The Apostle to the Deaf in America," Clerc\'s influence shaped American Deaf education and culture for generations.',
    },
    {
      id: 'thomas-gallaudet',
      name: 'Thomas Hopkins Gallaudet',
      birth: '1787-1851',
      field: 'Education',
      biography: 'Thomas Hopkins Gallaudet was a hearing American educator who co-founded the first permanent school for the deaf in the United States alongside Laurent Clerc.',
      contributions: [
        'Co-founded American School for the Deaf',
        'Traveled to Europe to learn deaf education methods',
        'Advocated for sign language education',
        'Established foundation for American Deaf education',
      ],
      achievements: [
        'Pioneer in American Deaf education',
        'Gallaudet University named in his honor',
        'Published educational materials',
        'Promoted accessibility and inclusion',
      ],
      legacy: 'His commitment to Deaf education created lasting institutions and inspired generations of educators and advocates.',
    },
    {
      id: 'marlee-matlin',
      name: 'Marlee Matlin',
      birth: '1965-present',
      field: 'Acting & Advocacy',
      biography: 'Marlee Matlin is an Academy Award-winning actress who became deaf at 18 months. She is a prominent advocate for the Deaf community and accessibility.',
      contributions: [
        'First deaf actress to win Academy Award (1987)',
        'Star of "Children of a Lesser God"',
        'Advocate for deaf representation in media',
        'Ambassador for accessibility and inclusion',
      ],
      achievements: [
        'Academy Award winner',
        'Golden Globe winner',
        'Multiple Emmy nominations',
        'Author and activist',
      ],
      quote: 'I\'m not deaf. I\'m Marlee Matlin, the actress.',
      legacy: 'Broke barriers in Hollywood and continues to advocate for authentic Deaf representation in media and entertainment.',
    },
    {
      id: 'nyle-dimarco',
      name: 'Nyle DiMarco',
      birth: '1989-present',
      field: 'Modeling & Advocacy',
      biography: 'Nyle DiMarco is a deaf model, actor, and activist who won America\'s Next Top Model and Dancing with the Stars, bringing Deaf awareness to mainstream media.',
      contributions: [
        'Winner of America\'s Next Top Model (2015)',
        'Winner of Dancing with the Stars (2016)',
        'Founded Nyle DiMarco Foundation',
        'Advocate for ASL and early intervention',
      ],
      achievements: [
        'First deaf winner of ANTM',
        'First deaf winner of DWTS',
        'Successful modeling career',
        'Education advocate',
      ],
      quote: 'Being deaf is not a disability. It\'s a different ability.',
      legacy: 'Uses his platform to advocate for ASL access, bilingual education, and changing perceptions about the Deaf community.',
    },
    {
      id: 'dummy-hoy',
      name: 'William "Dummy" Hoy',
      birth: '1862-1961',
      field: 'Sports',
      biography: 'William Hoy was a deaf Major League Baseball player whose career spanned 14 years. His legacy includes innovations in baseball communication.',
      contributions: [
        'Played professional baseball for 14 years',
        'Credited with introducing hand signals for umpires',
        'Created signals for balls, strikes, and outs',
        'Pioneered accessibility in sports',
      ],
      achievements: [
        'Career batting average of .287',
        '2,054 career hits',
        'Led league in stolen bases',
        'Hall of Fame consideration',
      ],
      legacy: 'His influence on baseball communication systems is still used today, and he proved that deafness is no barrier to athletic excellence.',
    },
    {
      id: 'i-king-jordan',
      name: 'I. King Jordan',
      birth: '1943-present',
      field: 'Education & Leadership',
      biography: 'I. King Jordan became the first deaf president of Gallaudet University in 1988 following the historic Deaf President Now protest.',
      contributions: [
        'First deaf president of Gallaudet University',
        'Led Deaf President Now movement',
        'Advanced Deaf education globally',
        'Promoted Deaf leadership and empowerment',
      ],
      achievements: [
        'Served as Gallaudet president 1988-2006',
        'Presidential Medal of Honor',
        'Honorary doctorates from multiple universities',
        'International advocate for deaf rights',
      ],
      quote: 'Deaf people can do anything hearing people can do, except hear.',
      legacy: 'Symbol of Deaf empowerment and proof that Deaf individuals can lead major institutions and inspire social change.',
    },
    {
      id: 'helen-keller',
      name: 'Helen Keller',
      birth: '1880-1968',
      field: 'Advocacy & Writing',
      biography: 'Helen Keller was a deafblind author, activist, and lecturer who became a symbol of triumph over adversity and a champion for disability rights.',
      contributions: [
        'First deafblind person to earn a Bachelor of Arts degree',
        'Authored 14 books',
        'Co-founded Helen Keller International',
        'Advocated for disability rights and women\'s suffrage',
      ],
      achievements: [
        'Presidential Medal of Freedom',
        'Published author and speaker',
        'Global humanitarian',
        'Disability rights pioneer',
      ],
      quote: 'Alone we can do so little; together we can do so much.',
      legacy: 'Her advocacy transformed perceptions of disability and demonstrated the potential of individuals with sensory disabilities.',
    },
    {
      id: 'andrew-foster',
      name: 'Andrew Foster',
      birth: '1925-1987',
      field: 'Education & Missions',
      biography: 'Andrew Foster was the first African American to graduate from Gallaudet University and founded 31 schools for the deaf in Africa.',
      contributions: [
        'Established 31 schools for deaf in Africa',
        'First Black deaf person to earn degree from Gallaudet',
        'Promoted Deaf education in developing nations',
        'Trained hundreds of deaf teachers',
      ],
      achievements: [
        'Founded schools in 13 African countries',
        'Master\'s degree from Eastern Michigan University',
        'Ordained minister',
        'Educational pioneer',
      ],
      legacy: 'Known as the "Father of Deaf Education in Africa," his work provided educational opportunities for thousands of African deaf children.',
    },
  ];

  const getDifficultyColor = (difficulty: string) => {
    if (difficulty === 'beginner') return colors.successColor;
    if (difficulty === 'intermediate') return colors.warningColor;
    return colors.errorColor;
  };

  const getImportanceColor = (importance: string) => {
    if (importance === 'essential') return colors.errorColor;
    if (importance === 'important') return colors.warningColor;
    return colors.iconColor;
  };

  const getResourceIcon = (type: string) => {
    switch (type) {
      case 'organization': return Building;
      case 'school': return GraduationCap;
      case 'advocacy': return Flag;
      case 'social': return Users;
      case 'technology': return Brain;
      case 'arts': return Sparkles;
      default: return Building;
    }
  };

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
      aria-labelledby="culture-title"
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
            aria-label="Exit Deaf culture education"
            className="flex-shrink-0"
          >
            <X className="w-6 h-6" />
          </Button>
          <div className="flex-1 min-w-0">
            <h1 
              id="culture-title" 
              className="text-xl sm:text-2xl font-bold truncate"
              style={{ fontFamily: 'Poppins, sans-serif' }}
            >
              Deaf Culture Education
            </h1>
            <p className="text-sm truncate" style={{ color: colors.textSecondary }}>
              Learn about history, etiquette, and community
            </p>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div 
        className="flex overflow-x-auto border-b"
        style={{ borderBottomColor: colors.border }}
        role="tablist"
        aria-label="Culture education sections"
      >
        {[
          { id: 'lessons', label: 'Lessons', icon: BookOpen },
          { id: 'history', label: 'History', icon: History },
          { id: 'etiquette', label: 'Etiquette', icon: Heart },
          { id: 'resources', label: 'Resources', icon: Globe },
          { id: 'figures', label: 'Figures', icon: Award },
        ].map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setSelectedTab(tab.id as any)}
              className="flex items-center gap-2 px-4 py-3 whitespace-nowrap transition-colors flex-shrink-0"
              style={{
                color: selectedTab === tab.id ? colors.iconColor : colors.textSecondary,
                borderBottom: selectedTab === tab.id ? `2px solid ${colors.iconColor}` : '2px solid transparent',
              }}
              role="tab"
              aria-selected={selectedTab === tab.id}
              aria-controls={`${tab.id}-panel`}
            >
              <Icon className="w-4 h-4" />
              <span className="text-sm font-semibold">{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto">
        {/* Lessons Tab */}
        {selectedTab === 'lessons' && (
          <section id="lessons-panel" role="tabpanel" aria-labelledby="lessons-tab" className="p-4">
            <div className="mb-4">
              <h2 className="text-lg font-semibold mb-2" style={{ color: colors.textPrimary }}>
                Cultural Lessons
              </h2>
              <p className="text-sm" style={{ color: colors.textSecondary }}>
                Explore interactive lessons about Deaf culture, identity, and community values.
              </p>
            </div>

            <div className="space-y-3">
              {culturalLessons.map((lesson) => (
                <button
                  key={lesson.id}
                  onClick={() => !lesson.locked && setSelectedLesson(lesson)}
                  disabled={lesson.locked}
                  className="w-full rounded-xl p-4 text-left transition-all disabled:opacity-50"
                  style={{
                    background: colors.cardBg,
                    backdropFilter: colors.blur,
                    WebkitBackdropFilter: colors.blur,
                    border: colors.glassBorder,
                    boxShadow: colors.shadow,
                  }}
                  aria-label={`${lesson.title} - ${lesson.locked ? 'Locked' : 'Available'}`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-bold px-2 py-0.5 rounded-full" style={{
                          background: getDifficultyColor(lesson.difficulty) + '30',
                          color: getDifficultyColor(lesson.difficulty),
                        }}>
                          {lesson.difficulty}
                        </span>
                        <span className="text-xs" style={{ color: colors.textTertiary }}>
                          {lesson.category}
                        </span>
                      </div>
                      <h3 className="font-semibold mb-1" style={{ color: colors.textPrimary }}>
                        {lesson.title}
                      </h3>
                      <p className="text-sm line-clamp-2" style={{ color: colors.textSecondary }}>
                        {lesson.description}
                      </p>
                    </div>
                    <div className="ml-3 flex-shrink-0">
                      {lesson.locked ? (
                        <Lock className="w-5 h-5" style={{ color: colors.textTertiary }} />
                      ) : lesson.completed ? (
                        <CheckCircle2 className="w-5 h-5" style={{ color: colors.successColor }} />
                      ) : (
                        <ChevronRight className="w-5 h-5" style={{ color: colors.iconColor }} />
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-3 text-xs" style={{ color: colors.textTertiary }}>
                    <div className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      <span>{lesson.duration}</span>
                    </div>
                    <span>•</span>
                    <span>{lesson.topics.length} topics</span>
                  </div>

                  {!lesson.locked && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {lesson.topics.slice(0, 3).map((topic, idx) => (
                        <span 
                          key={idx}
                          className="text-xs px-2 py-0.5 rounded-full"
                          style={{
                            background: colors.iconBg,
                            color: colors.iconColor,
                          }}
                        >
                          {topic}
                        </span>
                      ))}
                      {lesson.topics.length > 3 && (
                        <span className="text-xs" style={{ color: colors.textTertiary }}>
                          +{lesson.topics.length - 3} more
                        </span>
                      )}
                    </div>
                  )}
                </button>
              ))}
            </div>

            {/* Lesson Detail Modal */}
            {selectedLesson && (
              <div 
                className="fixed inset-0 bg-black/50 flex items-end sm:items-center justify-center z-50 p-4"
                onClick={() => setSelectedLesson(null)}
              >
                <div 
                  className="w-full max-w-md rounded-2xl p-6 max-h-[80vh] overflow-y-auto"
                  style={{
                    background: colors.cardBg,
                    backdropFilter: colors.blur,
                    WebkitBackdropFilter: colors.blur,
                    border: colors.glassBorder,
                    boxShadow: colors.shadow,
                  }}
                  onClick={(e) => e.stopPropagation()}
                  role="dialog"
                  aria-labelledby="lesson-modal-title"
                  aria-modal="true"
                >
                  <div className="flex items-start justify-between mb-4">
                    <h3 id="lesson-modal-title" className="text-xl font-bold" style={{ color: colors.textPrimary }}>
                      {selectedLesson.title}
                    </h3>
                    <button
                      onClick={() => setSelectedLesson(null)}
                      className="p-2 rounded-lg"
                      style={{ color: colors.textSecondary }}
                      aria-label="Close lesson details"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <div className="text-sm font-semibold mb-2" style={{ color: colors.textPrimary }}>
                        Description
                      </div>
                      <p className="text-sm" style={{ color: colors.textSecondary }}>
                        {selectedLesson.description}
                      </p>
                    </div>

                    <div>
                      <div className="text-sm font-semibold mb-2" style={{ color: colors.textPrimary }}>
                        Topics Covered
                      </div>
                      <div className="space-y-2">
                        {selectedLesson.topics.map((topic, idx) => (
                          <div key={idx} className="flex items-center gap-2">
                            <CheckCircle2 className="w-4 h-4" style={{ color: colors.successColor }} />
                            <span className="text-sm" style={{ color: colors.textSecondary }}>
                              {topic}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <Button
                      className="w-full h-12 rounded-xl font-semibold flex items-center justify-center gap-2"
                      style={{ 
                        background: colors.iconColor,
                        color: theme === 'dark' ? 'var(--color-bg-deep)' : '#FFFFFF',
                      }}
                      aria-label="Start lesson"
                    >
                      <Play className="w-5 h-5" />
                      Start Lesson
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </section>
        )}

        {/* History Tab */}
        {selectedTab === 'history' && (
          <section id="history-panel" role="tabpanel" aria-labelledby="history-tab" className="p-4">
            <div className="mb-4">
              <h2 className="text-lg font-semibold mb-2" style={{ color: colors.textPrimary }}>
                Historical Timeline
              </h2>
              <p className="text-sm" style={{ color: colors.textSecondary }}>
                Key moments that shaped Deaf culture and the community.
              </p>
            </div>

            <div className="relative">
              {/* Timeline Line */}
              <div 
                className="absolute left-6 top-0 bottom-0 w-0.5"
                style={{ background: colors.border }}
                aria-hidden="true"
              />

              <div className="space-y-6">
                {historicalEvents.map((event) => (
                  <div key={event.id} className="relative pl-14">
                    {/* Timeline Dot */}
                    <div 
                      className="absolute left-4 top-2 w-5 h-5 rounded-full border-4"
                      style={{
                        background: colors.iconColor,
                        borderColor: colors.bg,
                      }}
                      aria-hidden="true"
                    />

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
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-lg font-bold" style={{ color: colors.iconColor }}>
                          {event.year}
                        </span>
                        <span 
                          className="text-xs px-2 py-0.5 rounded-full"
                          style={{
                            background: colors.accentBg,
                            color: colors.accentColor,
                          }}
                        >
                          {event.category}
                        </span>
                      </div>
                      <h3 className="font-semibold mb-2" style={{ color: colors.textPrimary }}>
                        {event.title}
                      </h3>
                      <p className="text-sm mb-3" style={{ color: colors.textSecondary }}>
                        {event.description}
                      </p>
                      <div 
                        className="rounded-lg p-3 flex items-start gap-2"
                        style={{ background: colors.successBg }}
                      >
                        <Lightbulb className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: colors.successColor }} />
                        <div>
                          <div className="text-xs font-semibold mb-1" style={{ color: colors.successColor }}>
                            Significance
                          </div>
                          <div className="text-xs" style={{ color: colors.textSecondary }}>
                            {event.significance}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Etiquette Tab */}
        {selectedTab === 'etiquette' && (
          <section id="etiquette-panel" role="tabpanel" aria-labelledby="etiquette-tab" className="p-4">
            <div className="mb-4">
              <h2 className="text-lg font-semibold mb-2" style={{ color: colors.textPrimary }}>
                Communication Etiquette
              </h2>
              <p className="text-sm" style={{ color: colors.textSecondary }}>
                Learn respectful practices and cultural norms in Deaf community.
              </p>
            </div>

            <div className="space-y-3">
              {etiquetteTips.map((tip) => (
                <div
                  key={tip.id}
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
                    onClick={() => setExpandedTip(expandedTip === tip.id ? null : tip.id)}
                    className="w-full p-4 text-left"
                    aria-expanded={expandedTip === tip.id}
                    aria-controls={`tip-${tip.id}-content`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span 
                            className="text-xs font-bold px-2 py-0.5 rounded-full"
                            style={{
                              background: getImportanceColor(tip.importance) + '30',
                              color: getImportanceColor(tip.importance),
                            }}
                          >
                            {tip.importance}
                          </span>
                          <span className="text-xs" style={{ color: colors.textTertiary }}>
                            {tip.category}
                          </span>
                        </div>
                        <h3 className="font-semibold mb-1" style={{ color: colors.textPrimary }}>
                          {tip.title}
                        </h3>
                        <p className="text-sm" style={{ color: colors.textSecondary }}>
                          {tip.description}
                        </p>
                      </div>
                      <ChevronRight 
                        className={`w-5 h-5 flex-shrink-0 ml-3 transition-transform ${expandedTip === tip.id ? 'rotate-90' : ''}`}
                        style={{ color: colors.iconColor }}
                      />
                    </div>
                  </button>

                  {expandedTip === tip.id && (
                    <div 
                      id={`tip-${tip.id}-content`}
                      className="px-4 pb-4 space-y-4"
                    >
                      {/* Do's */}
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <CheckCircle2 className="w-4 h-4" style={{ color: colors.successColor }} />
                          <span className="text-sm font-semibold" style={{ color: colors.successColor }}>
                            Do
                          </span>
                        </div>
                        <div className="space-y-2">
                          {tip.dos.map((item, idx) => (
                            <div key={idx} className="flex items-start gap-2 text-sm" style={{ color: colors.textSecondary }}>
                              <span style={{ color: colors.successColor }}>•</span>
                              <span>{item}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Don'ts */}
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <X className="w-4 h-4" style={{ color: colors.errorColor }} />
                          <span className="text-sm font-semibold" style={{ color: colors.errorColor }}>
                            Don't
                          </span>
                        </div>
                        <div className="space-y-2">
                          {tip.donts.map((item, idx) => (
                            <div key={idx} className="flex items-start gap-2 text-sm" style={{ color: colors.textSecondary }}>
                              <span style={{ color: colors.errorColor }}>•</span>
                              <span>{item}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Resources Tab */}
        {selectedTab === 'resources' && (
          <section id="resources-panel" role="tabpanel" aria-labelledby="resources-tab" className="p-4">
            <div className="mb-4">
              <h2 className="text-lg font-semibold mb-2" style={{ color: colors.textPrimary }}>
                Community Resources
              </h2>
              <p className="text-sm" style={{ color: colors.textSecondary }}>
                Organizations, schools, and services supporting the Deaf community.
              </p>
            </div>

            <div className="space-y-3">
              {communityResources.map((resource) => {
                const Icon = getResourceIcon(resource.type);
                return (
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
                    <div className="flex items-start gap-3 mb-3">
                      <div 
                        className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                        style={{ background: colors.iconBg }}
                      >
                        <Icon className="w-5 h-5" style={{ color: colors.iconColor }} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold mb-1" style={{ color: colors.textPrimary }}>
                          {resource.name}
                        </h3>
                        <span 
                          className="text-xs px-2 py-0.5 rounded-full"
                          style={{
                            background: colors.accentBg,
                            color: colors.accentColor,
                          }}
                        >
                          {resource.type}
                        </span>
                      </div>
                    </div>

                    <p className="text-sm mb-3" style={{ color: colors.textSecondary }}>
                      {resource.description}
                    </p>

                    <div className="space-y-2 mb-3">
                      <div className="text-xs font-semibold" style={{ color: colors.textPrimary }}>
                        Services:
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {resource.services.map((service, idx) => (
                          <span 
                            key={idx}
                            className="text-xs px-2 py-1 rounded-lg"
                            style={{
                              background: colors.successBg,
                              color: colors.successColor,
                            }}
                          >
                            {service}
                          </span>
                        ))}
                      </div>
                    </div>

                    {resource.location && (
                      <div className="flex items-center gap-2 mb-2 text-sm" style={{ color: colors.textTertiary }}>
                        <MapPin className="w-4 h-4" />
                        <span>{resource.location}</span>
                      </div>
                    )}

                    {resource.contact && (
                      <div className="space-y-1">
                        {resource.contact.website && (
                          <a 
                            href={`https://${resource.contact.website}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 text-sm"
                            style={{ color: colors.iconColor }}
                          >
                            <ExternalLink className="w-4 h-4" />
                            <span>{resource.contact.website}</span>
                          </a>
                        )}
                        {resource.contact.email && (
                          <a 
                            href={`mailto:${resource.contact.email}`}
                            className="flex items-center gap-2 text-sm"
                            style={{ color: colors.textSecondary }}
                          >
                            <Mail className="w-4 h-4" />
                            <span>{resource.contact.email}</span>
                          </a>
                        )}
                        {resource.contact.phone && (
                          <a 
                            href={`tel:${resource.contact.phone}`}
                            className="flex items-center gap-2 text-sm"
                            style={{ color: colors.textSecondary }}
                          >
                            <Phone className="w-4 h-4" />
                            <span>{resource.contact.phone}</span>
                          </a>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* Figures Tab */}
        {selectedTab === 'figures' && (
          <section id="figures-panel" role="tabpanel" aria-labelledby="figures-tab" className="p-4">
            <div className="mb-4">
              <h2 className="text-lg font-semibold mb-2" style={{ color: colors.textPrimary }}>
                Famous Deaf Figures
              </h2>
              <p className="text-sm" style={{ color: colors.textSecondary }}>
                Leaders, innovators, and pioneers in the Deaf community.
              </p>
            </div>

            <div className="space-y-3">
              {deafFigures.map((figure) => (
                <button
                  key={figure.id}
                  onClick={() => setSelectedFigure(figure)}
                  className="w-full rounded-xl p-4 text-left transition-all"
                  style={{
                    background: colors.cardBg,
                    backdropFilter: colors.blur,
                    WebkitBackdropFilter: colors.blur,
                    border: colors.glassBorder,
                    boxShadow: colors.shadow,
                  }}
                  aria-label={`Learn more about ${figure.name}`}
                >
                  <div className="flex items-start gap-3">
                    <div 
                      className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0"
                      style={{ background: colors.iconBg }}
                    >
                      <Award className="w-6 h-6" style={{ color: colors.iconColor }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold mb-1" style={{ color: colors.textPrimary }}>
                        {figure.name}
                      </h3>
                      <div className="flex items-center gap-2 mb-2 text-xs" style={{ color: colors.textTertiary }}>
                        <Calendar className="w-3 h-3" />
                        <span>{figure.birth}</span>
                        <span>•</span>
                        <span>{figure.field}</span>
                      </div>
                      <p className="text-sm line-clamp-2" style={{ color: colors.textSecondary }}>
                        {figure.biography}
                      </p>
                    </div>
                    <ChevronRight className="w-5 h-5 flex-shrink-0" style={{ color: colors.iconColor }} />
                  </div>
                </button>
              ))}
            </div>

            {/* Figure Detail Modal */}
            {selectedFigure && (
              <div 
                className="fixed inset-0 bg-black/50 flex items-end sm:items-center justify-center z-50 p-4"
                onClick={() => setSelectedFigure(null)}
              >
                <div 
                  className="w-full max-w-md rounded-2xl p-6 max-h-[80vh] overflow-y-auto"
                  style={{
                    background: colors.cardBg,
                    backdropFilter: colors.blur,
                    WebkitBackdropFilter: colors.blur,
                    border: colors.glassBorder,
                    boxShadow: colors.shadow,
                  }}
                  onClick={(e) => e.stopPropagation()}
                  role="dialog"
                  aria-labelledby="figure-modal-title"
                  aria-modal="true"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 id="figure-modal-title" className="text-xl font-bold mb-1" style={{ color: colors.textPrimary }}>
                        {selectedFigure.name}
                      </h3>
                      <div className="flex items-center gap-2 text-sm" style={{ color: colors.textTertiary }}>
                        <Calendar className="w-4 h-4" />
                        <span>{selectedFigure.birth}</span>
                        <span>•</span>
                        <span>{selectedFigure.field}</span>
                      </div>
                    </div>
                    <button
                      onClick={() => setSelectedFigure(null)}
                      className="p-2 rounded-lg flex-shrink-0"
                      style={{ color: colors.textSecondary }}
                      aria-label="Close figure details"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <div className="text-sm font-semibold mb-2" style={{ color: colors.textPrimary }}>
                        Biography
                      </div>
                      <p className="text-sm" style={{ color: colors.textSecondary }}>
                        {selectedFigure.biography}
                      </p>
                    </div>

                    <div>
                      <div className="text-sm font-semibold mb-2" style={{ color: colors.textPrimary }}>
                        Major Contributions
                      </div>
                      <div className="space-y-2">
                        {selectedFigure.contributions.map((contribution, idx) => (
                          <div key={idx} className="flex items-start gap-2">
                            <Star className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: colors.warningColor }} />
                            <span className="text-sm" style={{ color: colors.textSecondary }}>
                              {contribution}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <div className="text-sm font-semibold mb-2" style={{ color: colors.textPrimary }}>
                        Achievements
                      </div>
                      <div className="space-y-2">
                        {selectedFigure.achievements.map((achievement, idx) => (
                          <div key={idx} className="flex items-start gap-2">
                            <Award className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: colors.iconColor }} />
                            <span className="text-sm" style={{ color: colors.textSecondary }}>
                              {achievement}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {selectedFigure.quote && (
                      <div 
                        className="rounded-lg p-4"
                        style={{ background: colors.accentBg }}
                      >
                        <Quote className="w-5 h-5 mb-2" style={{ color: colors.accentColor }} />
                        <p className="text-sm italic" style={{ color: colors.textPrimary }}>
                          "{selectedFigure.quote}"
                        </p>
                      </div>
                    )}

                    <div>
                      <div className="text-sm font-semibold mb-2" style={{ color: colors.textPrimary }}>
                        Legacy
                      </div>
                      <p className="text-sm" style={{ color: colors.textSecondary }}>
                        {selectedFigure.legacy}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </section>
        )}

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
              <strong style={{ color: colors.textPrimary }}>Learning Deaf Culture:</strong> Understanding Deaf culture is essential for respectful communication and authentic ASL learning. Deaf culture celebrates visual language, community, and unique perspectives.
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
