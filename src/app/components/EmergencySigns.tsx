import { useState } from 'react';
import { Button } from './ui/button';
import { useTheme } from '../context/ThemeContext';
import { useApp } from '../context/AppContext';
import exampleImage from 'figma:asset/a670e9a15c24eef10479b1a0bd99d416062ff875.png';
import { 
  X, 
  AlertCircle,
  Phone,
  Heart,
  Siren,
  Flame,
  Shield,
  MapPin,
  Zap,
  Play,
  Pause,
  RotateCcw,
  Volume2,
  Star,
  StarOff,
  ChevronRight,
  ChevronDown,
  CheckCircle2,
  Clock,
  Info,
  PhoneCall,
  Ambulance,
  Building2,
  Pill,
  Stethoscope,
  Cross,
  Droplet,
  Activity,
  Eye,
  Ear,
  Skull,
  Thermometer,
  Bandage,
  Syringe,
  Users,
  Navigation,
  Radio,
  TrendingUp,
  AlertTriangle,
  XCircle,
  Ban,
  Lock,
  Unlock,
  Home,
  Car,
  Truck,
  Waves,
  Wind,
  CloudRain,
  Skull as Poison,
  Scissors,
  Zap as Electric,
  Bookmark,
  BookmarkCheck,
  Search,
  Filter,
  Hand,
} from 'lucide-react';

interface EmergencySignsProps {
  onExit: () => void;
}

interface EmergencySign {
  id: string;
  word: string;
  category: 'critical' | 'medical' | 'safety' | 'contact';
  description: string;
  instructions: string[];
  urgency: 'urgent' | 'important' | 'helpful';
  isFavorite: boolean;
}

interface EmergencyContact {
  id: string;
  name: string;
  number: string;
  type: 'emergency' | 'medical' | 'safety' | 'support';
  available: string;
}

interface TutorialStep {
  stepNumber: number;
  instruction: string;
  tip?: string;
}

export function EmergencySigns({ onExit }: EmergencySignsProps) {
  const { theme } = useTheme();
  const { userProgress } = useApp();

  const [selectedCategory, setSelectedCategory] = useState<'all' | 'critical' | 'medical' | 'safety'>('all');
  const [selectedSign, setSelectedSign] = useState<EmergencySign | null>(null);
  const [showHelpTutorial, setShowHelpTutorial] = useState(false);
  const [showEmergencyContacts, setShowEmergencyContacts] = useState(false);
  const [expandedSign, setExpandedSign] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Emergency Signs
  const [emergencySigns, setEmergencySigns] = useState<EmergencySign[]>([
    // Critical Vocabulary
    {
      id: 'help',
      word: 'Help',
      category: 'critical',
      description: 'Request immediate assistance',
      instructions: [
        'Make a fist with your dominant hand',
        'Place the fist on top of your non-dominant open palm',
        'Lift both hands upward together',
        'Repeat with urgency for emphasis',
      ],
      urgency: 'urgent',
      isFavorite: true,
    },
    {
      id: 'emergency',
      word: 'Emergency',
      category: 'critical',
      description: 'Indicate urgent crisis situation',
      instructions: [
        'Make an "E" handshape with dominant hand',
        'Shake hand rapidly side to side',
        'Show urgency with facial expression',
        'Can combine with other signs for context',
      ],
      urgency: 'urgent',
      isFavorite: true,
    },
    {
      id: 'call-911',
      word: 'Call 911',
      category: 'critical',
      description: 'Request emergency services immediately',
      instructions: [
        'Sign "CALL": hand to ear like phone',
        'Then fingerspell "9-1-1" rapidly',
        'Point toward phone if available',
        'Use urgent facial expressions',
      ],
      urgency: 'urgent',
      isFavorite: true,
    },
    {
      id: 'danger',
      word: 'Danger',
      category: 'critical',
      description: 'Warn of immediate threat',
      instructions: [
        'Make a fist with thumb extended upward',
        'Move hand upward along body',
        'Show warning in facial expression',
        'Can point to source of danger',
      ],
      urgency: 'urgent',
      isFavorite: false,
    },
    {
      id: 'stop',
      word: 'Stop',
      category: 'critical',
      description: 'Immediate halt command',
      instructions: [
        'Hold dominant hand flat, palm facing out',
        'Extend hand forward forcefully',
        'Use firm facial expression',
        'Can repeat for emphasis',
      ],
      urgency: 'urgent',
      isFavorite: false,
    },
    {
      id: 'need',
      word: 'Need',
      category: 'critical',
      description: 'Express urgent requirement',
      instructions: [
        'Make bent hand, palm down',
        'Move hand downward with force',
        'Repeat motion twice',
        'Show urgency in expression',
      ],
      urgency: 'important',
      isFavorite: false,
    },
    // Medical Emergency Signs
    {
      id: 'pain',
      word: 'Pain / Hurt',
      category: 'medical',
      description: 'Indicate physical pain or injury',
      instructions: [
        'Point both index fingers at location of pain',
        'Twist fingers toward each other',
        'Repeat motion to show intensity',
        'Grimace to indicate severity',
      ],
      urgency: 'urgent',
      isFavorite: true,
    },
    {
      id: 'doctor',
      word: 'Doctor',
      category: 'medical',
      description: 'Request medical professional',
      instructions: [
        'Make "D" handshape with dominant hand',
        'Tap twice on opposite wrist',
        'Alternative: tap on pulse point',
        'Can combine with NEED for urgency',
      ],
      urgency: 'important',
      isFavorite: false,
    },
    {
      id: 'hospital',
      word: 'Hospital',
      category: 'medical',
      description: 'Indicate need for hospital care',
      instructions: [
        'Make "H" handshape with dominant hand',
        'Draw a cross shape on opposite arm',
        'Start at shoulder, move down, then across',
        'Use urgent expression if emergency',
      ],
      urgency: 'urgent',
      isFavorite: true,
    },
    {
      id: 'ambulance',
      word: 'Ambulance',
      category: 'medical',
      description: 'Request emergency medical transport',
      instructions: [
        'Make fists with both hands',
        'Rotate them alternately in circular motion',
        'Like emergency lights flashing',
        'Move hands slightly forward',
      ],
      urgency: 'urgent',
      isFavorite: false,
    },
    {
      id: 'medicine',
      word: 'Medicine',
      category: 'medical',
      description: 'Indicate need for medication',
      instructions: [
        'Make bent middle finger on dominant hand',
        'Place in opposite palm',
        'Rock hand back and forth',
        'Like crushing a pill',
      ],
      urgency: 'important',
      isFavorite: false,
    },
    {
      id: 'sick',
      word: 'Sick',
      category: 'medical',
      description: 'Indicate illness or nausea',
      instructions: [
        'Make bent middle finger on both hands',
        'Touch forehead and stomach simultaneously',
        'Show discomfort in expression',
        'Can indicate specific area instead',
      ],
      urgency: 'important',
      isFavorite: false,
    },
    {
      id: 'allergy',
      word: 'Allergy',
      category: 'medical',
      description: 'Indicate allergic reaction',
      instructions: [
        'Make "A" handshape',
        'Draw line down nose',
        'Then sign REACT or PROBLEM',
        'Point to affected area',
      ],
      urgency: 'urgent',
      isFavorite: false,
    },
    {
      id: 'bleeding',
      word: 'Bleeding',
      category: 'medical',
      description: 'Indicate blood loss',
      instructions: [
        'Fingerspell "BLOOD" or sign RED',
        'Then make fingers wiggle downward',
        'Like liquid flowing down',
        'Point to bleeding location',
      ],
      urgency: 'urgent',
      isFavorite: false,
    },
    {
      id: 'cant-breathe',
      word: 'Can\'t Breathe',
      category: 'medical',
      description: 'Respiratory emergency',
      instructions: [
        'Place hand on chest',
        'Move hand up and down with difficulty',
        'Sign "CAN\'T" with crossing motion',
        'Show distress in face',
      ],
      urgency: 'urgent',
      isFavorite: true,
    },
    {
      id: 'heart-attack',
      word: 'Heart Attack',
      category: 'medical',
      description: 'Cardiac emergency',
      instructions: [
        'Sign "HEART": outline heart on chest',
        'Then sign "ATTACK": fist strikes palm',
        'Clutch chest area',
        'Show extreme urgency',
      ],
      urgency: 'urgent',
      isFavorite: true,
    },
    // Safety-Related Signs
    {
      id: 'fire',
      word: 'Fire',
      category: 'safety',
      description: 'Indicate fire emergency',
      instructions: [
        'Make both hands with fingers wiggling',
        'Move hands upward alternately',
        'Like flames rising',
        'Can point to location of fire',
      ],
      urgency: 'urgent',
      isFavorite: true,
    },
    {
      id: 'police',
      word: 'Police',
      category: 'safety',
      description: 'Request law enforcement',
      instructions: [
        'Make "C" handshape with dominant hand',
        'Tap twice on opposite shoulder',
        'Like a badge location',
        'Can combine with CALL or NEED',
      ],
      urgency: 'important',
      isFavorite: false,
    },
    {
      id: 'exit',
      word: 'Exit',
      category: 'safety',
      description: 'Locate emergency exit',
      instructions: [
        'Make flat hand, palm facing left',
        'Move hand forward and to the side',
        'Like going through a door',
        'Point in direction of exit',
      ],
      urgency: 'important',
      isFavorite: false,
    },
    {
      id: 'poison',
      word: 'Poison',
      category: 'safety',
      description: 'Indicate toxic substance',
      instructions: [
        'Make "P" handshape',
        'Draw circle around mouth',
        'Then sign DANGEROUS or BAD',
        'Point to substance if visible',
      ],
      urgency: 'urgent',
      isFavorite: false,
    },
    {
      id: 'accident',
      word: 'Accident',
      category: 'safety',
      description: 'Indicate collision or crash',
      instructions: [
        'Make fists with both hands',
        'Move hands toward each other',
        'Collide knuckles together',
        'Show impact with expression',
      ],
      urgency: 'urgent',
      isFavorite: false,
    },
    {
      id: 'lost',
      word: 'Lost',
      category: 'safety',
      description: 'Indicate being lost or missing',
      instructions: [
        'Make "F" handshapes with both hands',
        'Touch fingertips together',
        'Drop hands downward and apart',
        'Show confusion in expression',
      ],
      urgency: 'important',
      isFavorite: false,
    },
    {
      id: 'shelter',
      word: 'Shelter',
      category: 'safety',
      description: 'Indicate need for safe location',
      instructions: [
        'Make flat hands, palms down',
        'Bring hands together like a roof',
        'Move slightly downward',
        'Can point to shelter location',
      ],
      urgency: 'important',
      isFavorite: false,
    },
    {
      id: 'earthquake',
      word: 'Earthquake',
      category: 'safety',
      description: 'Indicate seismic emergency',
      instructions: [
        'Make fists with both hands',
        'Shake hands side to side',
        'Show ground shaking motion',
        'Look alarmed',
      ],
      urgency: 'urgent',
      isFavorite: false,
    },
    {
      id: 'flood',
      word: 'Flood',
      category: 'safety',
      description: 'Indicate water emergency',
      instructions: [
        'Sign "WATER": tap chin with W hand',
        'Then make wavy motion with both hands',
        'Move hands upward to show rising',
        'Show concern in expression',
      ],
      urgency: 'urgent',
      isFavorite: false,
    },
  ]);

  // Emergency Contacts
  const emergencyContacts: EmergencyContact[] = [
    {
      id: 'emergency-911',
      name: 'Emergency Services (911)',
      number: '911',
      type: 'emergency',
      available: '24/7',
    },
    {
      id: 'poison-control',
      name: 'Poison Control Center',
      number: '1-800-222-1222',
      type: 'medical',
      available: '24/7',
    },
    {
      id: 'suicide-prevention',
      name: 'National Suicide Prevention Lifeline',
      number: '988',
      type: 'support',
      available: '24/7',
    },
    {
      id: 'domestic-violence',
      name: 'National Domestic Violence Hotline',
      number: '1-800-799-7233',
      type: 'support',
      available: '24/7',
    },
    {
      id: 'nami-helpline',
      name: 'NAMI Helpline (Mental Health)',
      number: '1-800-950-6264',
      type: 'support',
      available: 'M-F 10am-10pm ET',
    },
    {
      id: 'disaster-distress',
      name: 'Disaster Distress Helpline',
      number: '1-800-985-5990',
      type: 'support',
      available: '24/7',
    },
    {
      id: 'red-cross',
      name: 'American Red Cross',
      number: '1-800-733-2767',
      type: 'safety',
      available: '24/7',
    },
  ];

  // Help Tutorial Steps
  const helpTutorialSteps: TutorialStep[] = [
    {
      stepNumber: 1,
      instruction: 'Position your hands in front of your body at chest level',
      tip: 'Keep your movements visible and clear',
    },
    {
      stepNumber: 2,
      instruction: 'Make a fist with your dominant hand (the hand you write with)',
      tip: 'Curl all fingers into your palm with thumb on the outside',
    },
    {
      stepNumber: 3,
      instruction: 'Open your non-dominant hand flat with palm facing upward',
      tip: 'This hand acts as a base or support',
    },
    {
      stepNumber: 4,
      instruction: 'Place your dominant fist on top of your non-dominant palm',
      tip: 'The fist should rest on the palm, not hover above it',
    },
    {
      stepNumber: 5,
      instruction: 'Lift both hands upward together as one unit',
      tip: 'Move about 6-8 inches upward in a smooth motion',
    },
    {
      stepNumber: 6,
      instruction: 'Repeat the upward motion with urgency if the situation is critical',
      tip: 'Your facial expression should match the urgency - look concerned or distressed',
    },
  ];

  const handleToggleFavorite = (signId: string) => {
    setEmergencySigns(prev => prev.map(sign => 
      sign.id === signId 
        ? { ...sign, isFavorite: !sign.isFavorite }
        : sign
    ));
  };

  const handleCallEmergency = (number: string) => {
    window.location.href = `tel:${number}`;
  };

  const getUrgencyColor = (urgency: string) => {
    if (urgency === 'urgent') return colors.errorColor;
    if (urgency === 'important') return colors.warningColor;
    return colors.iconColor;
  };

  const getCategoryIcon = (category: string) => {
    if (category === 'critical') return AlertCircle;
    if (category === 'medical') return Heart;
    if (category === 'safety') return Shield;
    return Info;
  };

  const getContactIcon = (type: string) => {
    if (type === 'emergency') return Siren;
    if (type === 'medical') return Cross;
    if (type === 'safety') return Shield;
    return Phone;
  };

  // Filter signs
  const filteredSigns = emergencySigns.filter(sign => {
    const matchesCategory = selectedCategory === 'all' || sign.category === selectedCategory;
    const matchesSearch = sign.word.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         sign.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

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
      aria-labelledby="emergency-title"
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
            aria-label="Exit emergency signs"
            className="flex-shrink-0"
          >
            <X className="w-6 h-6" />
          </Button>
          <div className="flex-1 min-w-0">
            <h1 
              id="emergency-title" 
              className="text-xl sm:text-2xl font-bold truncate"
              style={{ fontFamily: 'Poppins, sans-serif' }}
            >
              Emergency Signs
            </h1>
            <p className="text-sm truncate" style={{ color: colors.textSecondary }}>
              Critical vocabulary for emergencies
            </p>
          </div>
        </div>
      </div>

      {/* Quick Action Buttons */}
      <div 
        className="p-4 border-b"
        style={{ borderBottomColor: colors.border }}
      >
        <div className="grid grid-cols-2 gap-3">
          <Button
            onClick={() => handleCallEmergency('911')}
            className="h-14 rounded-xl font-bold text-white flex items-center justify-center gap-2"
            style={{ background: colors.errorColor }}
            aria-label="Call 911 emergency services"
          >
            <Phone className="w-5 h-5" />
            Call 911
          </Button>
          <Button
            onClick={() => setShowHelpTutorial(true)}
            className="h-14 rounded-xl font-bold flex items-center justify-center gap-2"
            style={{ 
              background: colors.warningBg,
              color: colors.warningColor,
              border: `2px solid ${colors.warningColor}`,
            }}
            aria-label="Learn Help sign tutorial"
          >
            <Hand className="w-5 h-5" />
            "Help" Tutorial
          </Button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="p-4">
        <div 
          className="rounded-xl flex items-center gap-3 px-4 py-3"
          style={{
            background: colors.cardBg,
            backdropFilter: colors.blur,
            WebkitBackdropFilter: colors.blur,
            border: colors.glassBorder,
          }}
        >
          <Search className="w-5 h-5" style={{ color: colors.textTertiary }} />
          <input
            type="text"
            placeholder="Search emergency signs..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1 bg-transparent outline-none text-sm"
            style={{ color: colors.textPrimary }}
            aria-label="Search emergency signs"
          />
        </div>
      </div>

      {/* Category Filter */}
      <div 
        className="px-4 pb-4 border-b"
        style={{ borderBottomColor: colors.border }}
      >
        <div className="flex gap-2 overflow-x-auto pb-2">
          {[
            { id: 'all', label: 'All Signs', icon: Filter },
            { id: 'critical', label: 'Critical', icon: AlertCircle },
            { id: 'medical', label: 'Medical', icon: Heart },
            { id: 'safety', label: 'Safety', icon: Shield },
          ].map((category) => {
            const Icon = category.icon;
            const isActive = selectedCategory === category.id;
            return (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id as any)}
                className="flex items-center gap-2 px-4 py-2 rounded-xl whitespace-nowrap transition-all flex-shrink-0"
                style={{
                  background: isActive ? colors.iconColor + '20' : colors.cardBg,
                  border: isActive ? `2px solid ${colors.iconColor}` : colors.glassBorder,
                  color: isActive ? colors.iconColor : colors.textSecondary,
                }}
                aria-pressed={isActive}
                aria-label={`Filter by ${category.label}`}
              >
                <Icon className="w-4 h-4" />
                <span className="text-sm font-semibold">{category.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto">
        {/* Emergency Signs List */}
        <section aria-labelledby="signs-heading" className="p-4">
          <div className="flex items-center justify-between mb-3">
            <h2 id="signs-heading" className="text-lg font-semibold" style={{ color: colors.textPrimary }}>
              {filteredSigns.length} Signs
            </h2>
            <button
              onClick={() => setShowEmergencyContacts(true)}
              className="text-sm font-semibold flex items-center gap-1"
              style={{ color: colors.errorColor }}
              aria-label="View emergency contacts"
            >
              <Phone className="w-4 h-4" />
              Contacts
            </button>
          </div>

          <div className="space-y-3">
            {filteredSigns.map((sign) => {
              const CategoryIcon = getCategoryIcon(sign.category);
              const isExpanded = expandedSign === sign.id;
              return (
                <div
                  key={sign.id}
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
                    onClick={() => setExpandedSign(isExpanded ? null : sign.id)}
                    className="w-full p-4 text-left"
                    aria-expanded={isExpanded}
                    aria-controls={`sign-${sign.id}-content`}
                  >
                    <div className="flex items-start gap-3">
                      <div 
                        className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                        style={{ background: getUrgencyColor(sign.urgency) + '20' }}
                      >
                        <CategoryIcon className="w-6 h-6" style={{ color: getUrgencyColor(sign.urgency) }} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between mb-1">
                          <h3 className="font-bold text-lg" style={{ color: colors.textPrimary }}>
                            {sign.word}
                          </h3>
                          <div className="flex items-center gap-2 flex-shrink-0 ml-2">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleToggleFavorite(sign.id);
                              }}
                              className="p-2 rounded-lg"
                              style={{ background: sign.isFavorite ? colors.warningBg : 'transparent' }}
                              aria-label={sign.isFavorite ? 'Remove from favorites' : 'Add to favorites'}
                              aria-pressed={sign.isFavorite}
                            >
                              {sign.isFavorite ? (
                                <BookmarkCheck className="w-4 h-4" style={{ color: colors.warningColor }} />
                              ) : (
                                <Bookmark className="w-4 h-4" style={{ color: colors.textTertiary }} />
                              )}
                            </button>
                            <ChevronDown 
                              className={`w-5 h-5 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                              style={{ color: colors.iconColor }}
                            />
                          </div>
                        </div>
                        <p className="text-sm mb-2" style={{ color: colors.textSecondary }}>
                          {sign.description}
                        </p>
                        <div className="flex items-center gap-2">
                          <span 
                            className="text-xs px-2 py-1 rounded-full font-bold"
                            style={{
                              background: getUrgencyColor(sign.urgency) + '30',
                              color: getUrgencyColor(sign.urgency),
                            }}
                          >
                            {sign.urgency}
                          </span>
                          <span 
                            className="text-xs px-2 py-1 rounded-full"
                            style={{
                              background: colors.iconBg,
                              color: colors.iconColor,
                            }}
                          >
                            {sign.category}
                          </span>
                        </div>
                      </div>
                    </div>
                  </button>

                  {isExpanded && (
                    <div 
                      id={`sign-${sign.id}-content`}
                      className="px-4 pb-4 border-t"
                      style={{ borderTopColor: colors.border }}
                    >
                      <div className="pt-4">
                        <div className="text-sm font-semibold mb-3" style={{ color: colors.textPrimary }}>
                          How to Sign:
                        </div>
                        <div className="space-y-3">
                          {sign.instructions.map((instruction, idx) => (
                            <div key={idx} className="flex items-start gap-3">
                              <div 
                                className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0"
                                style={{ background: colors.iconBg }}
                              >
                                <span className="text-xs font-bold" style={{ color: colors.iconColor }}>
                                  {idx + 1}
                                </span>
                              </div>
                              <div className="text-sm flex-1" style={{ color: colors.textSecondary }}>
                                {instruction}
                              </div>
                            </div>
                          ))}
                        </div>

                        <div className="mt-4 flex gap-2">
                          <Button
                            className="flex-1 h-10 rounded-xl font-semibold flex items-center justify-center gap-2"
                            style={{ 
                              background: colors.iconColor,
                              color: theme === 'dark' ? 'var(--color-bg-deep)' : '#FFFFFF',
                            }}
                            aria-label={`Watch video demonstration of ${sign.word}`}
                          >
                            <Play className="w-4 h-4" />
                            Watch Video
                          </Button>
                          <Button
                            className="flex-1 h-10 rounded-xl font-semibold flex items-center justify-center gap-2"
                            style={{ 
                              background: colors.successBg,
                              color: colors.successColor,
                              border: `1px solid ${colors.successColor}`,
                            }}
                            aria-label={`Practice ${sign.word} sign`}
                          >
                            <Hand className="w-4 h-4" />
                            Practice
                          </Button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>

        {/* Favorites Section */}
        {emergencySigns.filter(s => s.isFavorite).length > 0 && (
          <section aria-labelledby="favorites-heading" className="px-4 pb-4">
            <h2 id="favorites-heading" className="text-lg font-semibold mb-3" style={{ color: colors.textPrimary }}>
              Quick Access Favorites
            </h2>
            <div className="grid grid-cols-2 gap-3">
              {emergencySigns.filter(s => s.isFavorite).slice(0, 4).map((sign) => (
                <button
                  key={sign.id}
                  onClick={() => setExpandedSign(sign.id)}
                  className="rounded-xl p-4 text-center transition-all"
                  style={{
                    background: colors.cardBg,
                    backdropFilter: colors.blur,
                    WebkitBackdropFilter: colors.blur,
                    border: colors.glassBorder,
                    boxShadow: colors.shadow,
                  }}
                  aria-label={`Quick access to ${sign.word} sign`}
                >
                  <div 
                    className="w-12 h-12 rounded-xl mx-auto mb-2 flex items-center justify-center"
                    style={{ background: getUrgencyColor(sign.urgency) + '20' }}
                  >
                    <Hand className="w-6 h-6" style={{ color: getUrgencyColor(sign.urgency) }} />
                  </div>
                  <div className="text-sm font-bold mb-1" style={{ color: colors.textPrimary }}>
                    {sign.word}
                  </div>
                  <div className="text-xs" style={{ color: colors.textTertiary }}>
                    Tap for details
                  </div>
                </button>
              ))}
            </div>
          </section>
        )}

        {/* Info Box */}
        <section className="px-4 pb-6">
          <div 
            className="rounded-xl p-4 flex items-start gap-3"
            style={{
              background: colors.errorBg,
              border: `1px solid ${colors.errorColor}`,
            }}
          >
            <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: colors.errorColor }} aria-hidden="true" />
            <div className="text-sm" style={{ color: colors.textSecondary }}>
              <strong style={{ color: colors.textPrimary }}>Emergency Preparedness:</strong> Learn these signs before an emergency occurs. Practice regularly and teach family members. In a real emergency, call 911 immediately.
            </div>
          </div>
        </section>
      </div>

      {/* Help Tutorial Modal */}
      {showHelpTutorial && (
        <div 
          className="fixed inset-0 bg-black/50 flex items-end sm:items-center justify-center z-50 p-4"
          onClick={() => setShowHelpTutorial(false)}
        >
          <div 
            className="w-full max-w-md rounded-2xl p-6 max-h-[85vh] overflow-y-auto"
            style={{
              background: colors.cardBg,
              backdropFilter: colors.blur,
              WebkitBackdropFilter: colors.blur,
              border: colors.glassBorder,
              boxShadow: colors.shadow,
            }}
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-labelledby="help-tutorial-title"
            aria-modal="true"
          >
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 id="help-tutorial-title" className="text-xl font-bold mb-1" style={{ color: colors.textPrimary }}>
                  How to Sign "Help"
                </h3>
                <p className="text-sm" style={{ color: colors.textSecondary }}>
                  Step-by-step tutorial
                </p>
              </div>
              <button
                onClick={() => setShowHelpTutorial(false)}
                className="p-2 rounded-lg"
                style={{ color: colors.textSecondary }}
                aria-label="Close help tutorial"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              {helpTutorialSteps.map((step) => (
                <div
                  key={step.stepNumber}
                  className="rounded-xl p-4"
                  style={{
                    background: colors.cardHover,
                    border: colors.glassBorder,
                  }}
                >
                  <div className="flex items-start gap-3">
                    <div 
                      className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
                      style={{ background: colors.successBg }}
                    >
                      <span className="text-sm font-bold" style={{ color: colors.successColor }}>
                        {step.stepNumber}
                      </span>
                    </div>
                    <div className="flex-1">
                      <div className="text-sm font-semibold mb-1" style={{ color: colors.textPrimary }}>
                        {step.instruction}
                      </div>
                      {step.tip && (
                        <div 
                          className="text-xs mt-2 p-2 rounded-lg"
                          style={{ background: colors.iconBg }}
                        >
                          <span style={{ color: colors.iconColor }}>💡 Tip: </span>
                          <span style={{ color: colors.textSecondary }}>{step.tip}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <Button
              onClick={() => setShowHelpTutorial(false)}
              className="w-full h-12 rounded-xl font-semibold mt-4"
              style={{ 
                background: colors.successColor,
                color: '#FFFFFF',
              }}
              aria-label="Start practicing help sign"
            >
              <Play className="w-5 h-5 mr-2" />
              Start Practicing
            </Button>
          </div>
        </div>
      )}

      {/* Emergency Contacts Modal */}
      {showEmergencyContacts && (
        <div 
          className="fixed inset-0 bg-black/50 flex items-end sm:items-center justify-center z-50 p-4"
          onClick={() => setShowEmergencyContacts(false)}
        >
          <div 
            className="w-full max-w-md rounded-2xl p-6 max-h-[85vh] overflow-y-auto"
            style={{
              background: colors.cardBg,
              backdropFilter: colors.blur,
              WebkitBackdropFilter: colors.blur,
              border: colors.glassBorder,
              boxShadow: colors.shadow,
            }}
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-labelledby="contacts-title"
            aria-modal="true"
          >
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 id="contacts-title" className="text-xl font-bold mb-1" style={{ color: colors.textPrimary }}>
                  Emergency Contacts
                </h3>
                <p className="text-sm" style={{ color: colors.textSecondary }}>
                  Important phone numbers
                </p>
              </div>
              <button
                onClick={() => setShowEmergencyContacts(false)}
                className="p-2 rounded-lg"
                style={{ color: colors.textSecondary }}
                aria-label="Close emergency contacts"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3">
              {emergencyContacts.map((contact) => {
                const ContactIcon = getContactIcon(contact.type);
                return (
                  <div
                    key={contact.id}
                    className="rounded-xl p-4"
                    style={{
                      background: colors.cardHover,
                      border: colors.glassBorder,
                    }}
                  >
                    <div className="flex items-start gap-3 mb-3">
                      <div 
                        className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                        style={{ background: contact.type === 'emergency' ? colors.errorBg : colors.iconBg }}
                      >
                        <ContactIcon 
                          className="w-5 h-5" 
                          style={{ color: contact.type === 'emergency' ? colors.errorColor : colors.iconColor }} 
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold mb-1" style={{ color: colors.textPrimary }}>
                          {contact.name}
                        </h4>
                        <div className="text-sm mb-1" style={{ color: colors.textSecondary }}>
                          {contact.available}
                        </div>
                        <div className="text-lg font-bold" style={{ color: colors.iconColor }}>
                          {contact.number}
                        </div>
                      </div>
                    </div>
                    <Button
                      onClick={() => handleCallEmergency(contact.number)}
                      className="w-full h-10 rounded-xl font-semibold flex items-center justify-center gap-2"
                      style={{ 
                        background: contact.type === 'emergency' ? colors.errorColor : colors.iconColor,
                        color: '#FFFFFF',
                      }}
                      aria-label={`Call ${contact.name}`}
                    >
                      <Phone className="w-4 h-4" />
                      Call Now
                    </Button>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
