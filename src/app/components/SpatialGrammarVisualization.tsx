import { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { useTheme } from '../context/ThemeContext';
import { useApp } from '../context/AppContext';
import exampleImage from 'figma:asset/315d1fc69e8ec25bb6f57cb0fc3d509ecbae0104.png';
import { 
  X, 
  Play,
  Pause,
  RotateCcw,
  ChevronLeft,
  ChevronRight,
  Maximize2,
  Minimize2,
  Info,
  Eye,
  EyeOff,
  Grid3x3,
  Move,
  Sparkles,
  Clock,
  MapPin,
  TrendingUp,
  ArrowRight,
  Circle,
  Square,
  Triangle,
  Zap,
  Target,
  Hand,
  Book,
  CheckCircle2,
  BookOpen,
  Layers,
  Route,
  Timer,
  FastForward,
  Rewind,
  SkipBack,
  SkipForward,
  Settings,
  Navigation,
} from 'lucide-react';

interface SpatialGrammarVisualizationProps {
  onExit: () => void;
}

interface GrammarConcept {
  id: string;
  title: string;
  category: string;
  description: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  spatialType: 'directional' | 'temporal' | 'locative' | 'agreement' | 'classifier';
  examples: GrammarExample[];
}

interface GrammarExample {
  id: string;
  sentence: string;
  translation: string;
  steps: GrammarStep[];
  duration: number;
}

interface GrammarStep {
  id: string;
  time: number;
  sign: string;
  position: { x: number; y: number; z: number };
  handShape: string;
  movement: string;
  description: string;
}

interface SpatialMarker {
  id: string;
  label: string;
  position: { x: number; y: number; z: number };
  type: 'person' | 'object' | 'location' | 'time' | 'reference';
  active: boolean;
}

export function SpatialGrammarVisualization({ onExit }: SpatialGrammarVisualizationProps) {
  const { theme } = useTheme();
  const { userProgress } = useApp();

  const grammarConcepts: GrammarConcept[] = [
    {
      id: 'directional-verbs',
      title: 'Directional Verbs',
      category: 'Spatial Agreement',
      description: 'Verbs that move between points in space to show who does what to whom',
      difficulty: 'intermediate',
      spatialType: 'directional',
      examples: [
        {
          id: 'give-example',
          sentence: 'I GIVE YOU',
          translation: 'I give you (something)',
          duration: 3.5,
          steps: [
            {
              id: 'step-1',
              time: 0,
              sign: 'I',
              position: { x: -20, y: 50, z: 0 },
              handShape: 'Index finger',
              movement: 'Point to chest',
              description: 'Establish self reference',
            },
            {
              id: 'step-2',
              time: 1.2,
              sign: 'GIVE',
              position: { x: 0, y: 50, z: 20 },
              handShape: 'Flat hand',
              movement: 'Move from self to you',
              description: 'Motion shows direction of action',
            },
            {
              id: 'step-3',
              time: 2.8,
              sign: 'YOU',
              position: { x: 20, y: 50, z: 0 },
              handShape: 'Index finger',
              movement: 'Point forward',
              description: 'Establish recipient',
            },
          ],
        },
        {
          id: 'ask-example',
          sentence: 'YOU ASK ME',
          translation: 'You ask me (a question)',
          duration: 3.2,
          steps: [
            {
              id: 'step-1',
              time: 0,
              sign: 'YOU',
              position: { x: 20, y: 50, z: 0 },
              handShape: 'Index finger',
              movement: 'Point forward',
              description: 'Establish subject',
            },
            {
              id: 'step-2',
              time: 1.1,
              sign: 'ASK',
              position: { x: 10, y: 45, z: -20 },
              handShape: 'Crooked finger',
              movement: 'Move from you to me',
              description: 'Direction shows who asks whom',
            },
            {
              id: 'step-3',
              time: 2.5,
              sign: 'ME',
              position: { x: -20, y: 50, z: 0 },
              handShape: 'Index finger',
              movement: 'Point to chest',
              description: 'Establish object/recipient',
            },
          ],
        },
      ],
    },
    {
      id: 'time-markers',
      title: 'Time Markers',
      category: 'Temporal Grammar',
      description: 'Using space to show past, present, and future along a timeline',
      difficulty: 'beginner',
      spatialType: 'temporal',
      examples: [
        {
          id: 'yesterday-example',
          sentence: 'YESTERDAY I EAT',
          translation: 'Yesterday I ate',
          duration: 3.8,
          steps: [
            {
              id: 'step-1',
              time: 0,
              sign: 'YESTERDAY',
              position: { x: -30, y: 45, z: 0 },
              handShape: 'A-hand',
              movement: 'Touch cheek, move back',
              description: 'Behind shoulder = past',
            },
            {
              id: 'step-2',
              time: 1.5,
              sign: 'I',
              position: { x: 0, y: 50, z: 0 },
              handShape: 'Index finger',
              movement: 'Point to chest',
              description: 'Center = present reference',
            },
            {
              id: 'step-3',
              time: 2.8,
              sign: 'EAT',
              position: { x: 0, y: 55, z: 10 },
              handShape: 'Flat O',
              movement: 'To mouth',
              description: 'Action in past timeframe',
            },
          ],
        },
        {
          id: 'tomorrow-example',
          sentence: 'TOMORROW I WORK',
          translation: 'Tomorrow I will work',
          duration: 3.6,
          steps: [
            {
              id: 'step-1',
              time: 0,
              sign: 'TOMORROW',
              position: { x: 30, y: 45, z: 0 },
              handShape: 'A-hand',
              movement: 'Touch cheek, move forward',
              description: 'Forward = future',
            },
            {
              id: 'step-2',
              time: 1.4,
              sign: 'I',
              position: { x: 0, y: 50, z: 0 },
              handShape: 'Index finger',
              movement: 'Point to chest',
              description: 'Center = present reference',
            },
            {
              id: 'step-3',
              time: 2.7,
              sign: 'WORK',
              position: { x: 0, y: 50, z: 15 },
              handShape: 'S-hands',
              movement: 'Tap wrists',
              description: 'Action in future timeframe',
            },
          ],
        },
      ],
    },
    {
      id: 'classifiers',
      title: 'Classifiers',
      category: 'Depicting',
      description: 'Hand shapes that represent objects, people, or movements in 3D space',
      difficulty: 'advanced',
      spatialType: 'classifier',
      examples: [
        {
          id: 'car-example',
          sentence: 'CAR DRIVE-PAST',
          translation: 'A car drives past',
          duration: 4.2,
          steps: [
            {
              id: 'step-1',
              time: 0,
              sign: 'CAR',
              position: { x: -35, y: 50, z: 0 },
              handShape: 'S-hands',
              movement: 'Steering motion',
              description: 'Establish vehicle',
            },
            {
              id: 'step-2',
              time: 1.5,
              sign: 'CL:3-vehicle',
              position: { x: -30, y: 50, z: 5 },
              handShape: '3-hand (vehicle)',
              movement: 'Start position left',
              description: 'Classifier represents car',
            },
            {
              id: 'step-3',
              time: 3.5,
              sign: 'MOVE-RIGHT',
              position: { x: 30, y: 50, z: 5 },
              handShape: '3-hand',
              movement: 'Arc left to right',
              description: 'Path shows vehicle movement',
            },
          ],
        },
        {
          id: 'people-example',
          sentence: 'TWO-PEOPLE WALK-TOWARD-EACH-OTHER',
          translation: 'Two people walk toward each other',
          duration: 5.0,
          steps: [
            {
              id: 'step-1',
              time: 0,
              sign: 'TWO-PEOPLE',
              position: { x: 0, y: 55, z: 0 },
              handShape: 'V-hands',
              movement: 'Both hands up',
              description: 'Establish two people',
            },
            {
              id: 'step-2',
              time: 1.5,
              sign: 'CL:1-person-left',
              position: { x: -30, y: 45, z: 0 },
              handShape: '1-hand upright',
              movement: 'Walking motion',
              description: 'First person on left',
            },
            {
              id: 'step-3',
              time: 3.0,
              sign: 'CL:1-person-right',
              position: { x: 30, y: 45, z: 0 },
              handShape: '1-hand upright',
              movement: 'Walking motion',
              description: 'Second person on right',
            },
            {
              id: 'step-4',
              time: 4.5,
              sign: 'MEET-MIDDLE',
              position: { x: 0, y: 45, z: 10 },
              handShape: 'Both 1-hands',
              movement: 'Move together',
              description: 'Paths converge at center',
            },
          ],
        },
      ],
    },
    {
      id: 'role-shifting',
      title: 'Role Shifting',
      category: 'Narrative Grammar',
      description: 'Using body position and space to represent different characters',
      difficulty: 'advanced',
      spatialType: 'locative',
      examples: [
        {
          id: 'dialogue-example',
          sentence: 'MOTHER SAY "HELLO" / CHILD SAY "HI"',
          translation: 'Mother says hello, child responds hi',
          duration: 6.0,
          steps: [
            {
              id: 'step-1',
              time: 0,
              sign: 'MOTHER',
              position: { x: -25, y: 50, z: 0 },
              handShape: 'Open hand',
              movement: 'Thumb on chin',
              description: 'Establish mother position left',
            },
            {
              id: 'step-2',
              time: 1.5,
              sign: 'SHIFT-LEFT',
              position: { x: -25, y: 50, z: 0 },
              handShape: 'Body shift',
              movement: 'Lean left, face right',
              description: 'Take on mother role',
            },
            {
              id: 'step-3',
              time: 2.5,
              sign: 'HELLO',
              position: { x: -20, y: 55, z: 5 },
              handShape: 'Open hand',
              movement: 'Wave from forehead',
              description: 'Mother greeting',
            },
            {
              id: 'step-4',
              time: 3.5,
              sign: 'CHILD',
              position: { x: 25, y: 40, z: 0 },
              handShape: 'Flat hand',
              movement: 'Pat down motion',
              description: 'Establish child position right',
            },
            {
              id: 'step-5',
              time: 4.5,
              sign: 'SHIFT-RIGHT',
              position: { x: 25, y: 45, z: 0 },
              handShape: 'Body shift',
              movement: 'Lean right, face left',
              description: 'Take on child role (lower)',
            },
            {
              id: 'step-6',
              time: 5.5,
              sign: 'HI',
              position: { x: 20, y: 50, z: 5 },
              handShape: 'Open hand',
              movement: 'Quick wave',
              description: 'Child response',
            },
          ],
        },
      ],
    },
    {
      id: 'topicalization',
      title: 'Topicalization',
      category: 'Sentence Structure',
      description: 'Raising eyebrows and using space to mark sentence topics',
      difficulty: 'intermediate',
      spatialType: 'agreement',
      examples: [
        {
          id: 'topic-example',
          sentence: 'PIZZA, I LIKE',
          translation: 'As for pizza, I like it',
          duration: 3.5,
          steps: [
            {
              id: 'step-1',
              time: 0,
              sign: 'PIZZA',
              position: { x: 15, y: 55, z: 5 },
              handShape: 'Bent hands',
              movement: 'Draw triangle',
              description: 'Topic established with raised brows',
            },
            {
              id: 'step-2',
              time: 1.5,
              sign: 'I',
              position: { x: 0, y: 50, z: 0 },
              handShape: 'Index finger',
              movement: 'Point to chest',
              description: 'Subject of comment',
            },
            {
              id: 'step-3',
              time: 2.8,
              sign: 'LIKE',
              position: { x: 0, y: 55, z: 10 },
              handShape: 'Open hand',
              movement: 'Pull from chest',
              description: 'Comment about topic',
            },
          ],
        },
      ],
    },
    {
      id: 'negation',
      title: 'Negation',
      category: 'Grammatical Markers',
      description: 'Head shake and spatial markers to show negative meaning',
      difficulty: 'beginner',
      spatialType: 'agreement',
      examples: [
        {
          id: 'not-example',
          sentence: 'I LIKE NOT',
          translation: "I don't like it",
          duration: 3.0,
          steps: [
            {
              id: 'step-1',
              time: 0,
              sign: 'I',
              position: { x: 0, y: 50, z: 0 },
              handShape: 'Index finger',
              movement: 'Point to chest',
              description: 'Subject',
            },
            {
              id: 'step-2',
              time: 1.0,
              sign: 'LIKE',
              position: { x: 0, y: 55, z: 10 },
              handShape: 'Open hand',
              movement: 'Pull from chest',
              description: 'Action with head shake',
            },
            {
              id: 'step-3',
              time: 2.3,
              sign: 'NOT',
              position: { x: 5, y: 50, z: 15 },
              handShape: 'A-hand',
              movement: 'Thumb out, shake',
              description: 'Negation marker',
            },
          ],
        },
      ],
    },
  ];

  const [selectedConcept, setSelectedConcept] = useState<GrammarConcept>(grammarConcepts[0]);
  const [selectedExample, setSelectedExample] = useState<GrammarExample>(grammarConcepts[0].examples[0]);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [playbackSpeed, setPlaybackSpeed] = useState(1.0);

  // Display options
  const [showMarkers, setShowMarkers] = useState(true);
  const [showTrails, setShowTrails] = useState(true);
  const [showGrid, setShowGrid] = useState(true);
  const [showTimeline, setShowTimeline] = useState(true);
  const [show3DView, setShow3DView] = useState(true);
  const [showLabels, setShowLabels] = useState(true);

  // 3D view rotation
  const [rotationX, setRotationX] = useState(0);
  const [rotationY, setRotationY] = useState(0);

  // Spatial markers for current example
  const [spatialMarkers, setSpatialMarkers] = useState<SpatialMarker[]>([]);

  // Update markers when example changes
  useEffect(() => {
    const markers: SpatialMarker[] = selectedExample.steps.map((step, idx) => ({
      id: step.id,
      label: step.sign,
      position: step.position,
      type: idx === 0 ? 'person' : idx === selectedExample.steps.length - 1 ? 'reference' : 'object',
      active: idx === currentStepIndex,
    }));
    setSpatialMarkers(markers);
  }, [selectedExample, currentStepIndex]);

  // Playback simulation
  useEffect(() => {
    let interval: ReturnType<typeof setTimeout>;
    if (isPlaying) {
      interval = setInterval(() => {
        setCurrentTime(prev => {
          const newTime = prev + (0.1 * playbackSpeed);
          if (newTime >= selectedExample.duration) {
            setIsPlaying(false);
            return selectedExample.duration;
          }
          
          // Update current step based on time
          const newStepIndex = selectedExample.steps.findIndex((step, idx) => {
            const nextStep = selectedExample.steps[idx + 1];
            return newTime >= step.time && (!nextStep || newTime < nextStep.time);
          });
          if (newStepIndex !== -1 && newStepIndex !== currentStepIndex) {
            setCurrentStepIndex(newStepIndex);
          }
          
          return newTime;
        });
      }, 100);
    }
    return () => clearInterval(interval);
  }, [isPlaying, playbackSpeed, selectedExample, currentStepIndex]);

  const handleConceptChange = (concept: GrammarConcept) => {
    setSelectedConcept(concept);
    setSelectedExample(concept.examples[0]);
    setCurrentStepIndex(0);
    setCurrentTime(0);
    setIsPlaying(false);
  };

  const handleExampleChange = (example: GrammarExample) => {
    setSelectedExample(example);
    setCurrentStepIndex(0);
    setCurrentTime(0);
    setIsPlaying(false);
  };

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const handleReset = () => {
    setCurrentTime(0);
    setCurrentStepIndex(0);
    setIsPlaying(false);
  };

  const handleStepForward = () => {
    if (currentStepIndex < selectedExample.steps.length - 1) {
      const nextStep = selectedExample.steps[currentStepIndex + 1];
      setCurrentStepIndex(currentStepIndex + 1);
      setCurrentTime(nextStep.time);
      setIsPlaying(false);
    }
  };

  const handleStepBackward = () => {
    if (currentStepIndex > 0) {
      const prevStep = selectedExample.steps[currentStepIndex - 1];
      setCurrentStepIndex(currentStepIndex - 1);
      setCurrentTime(prevStep.time);
      setIsPlaying(false);
    }
  };

  const formatTime = (seconds: number) => {
    const secs = Math.floor(seconds);
    const ms = Math.floor((seconds % 1) * 10);
    return `${secs}.${ms}s`;
  };

  const getDifficultyColor = (difficulty: string) => {
    if (difficulty === 'beginner') return colors.successColor;
    if (difficulty === 'intermediate') return colors.warningColor;
    return colors.errorColor;
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

  const currentStep = selectedExample.steps[currentStepIndex];

  return (
    <div 
      className="h-full flex flex-col"
      style={{ background: colors.bg, color: colors.textPrimary }}
      role="main"
      aria-labelledby="grammar-title"
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
            aria-label="Exit 3D spatial grammar visualization"
            className="flex-shrink-0"
          >
            <X className="w-6 h-6" />
          </Button>
          <div className="flex-1 min-w-0">
            <h1 
              id="grammar-title" 
              className="text-xl sm:text-2xl font-bold truncate"
              style={{ fontFamily: 'Poppins, sans-serif' }}
            >
              3D Spatial Grammar
            </h1>
            <p className="text-sm truncate" style={{ color: colors.textSecondary }}>
              Visualize ASL grammar in 3D space
            </p>
          </div>
        </div>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto">
        {/* Grammar Concept Selection */}
        <section aria-labelledby="concepts-heading" className="p-4">
          <h2 id="concepts-heading" className="text-lg font-semibold mb-3" style={{ color: colors.textPrimary }}>
            Grammar Concepts
          </h2>
          <div className="grid grid-cols-2 gap-2 mb-4">
            {grammarConcepts.map((concept) => (
              <button
                key={concept.id}
                onClick={() => handleConceptChange(concept)}
                className="rounded-xl p-3 text-left transition-all"
                style={{
                  background: selectedConcept.id === concept.id ? colors.iconBg : colors.cardBg,
                  backdropFilter: colors.blur,
                  WebkitBackdropFilter: colors.blur,
                  border: selectedConcept.id === concept.id ? `2px solid ${colors.iconColor}` : colors.glassBorder,
                  boxShadow: colors.shadow,
                }}
                aria-label={`Select ${concept.title} grammar concept`}
                aria-pressed={selectedConcept.id === concept.id}
              >
                <div className="font-semibold text-sm mb-1" style={{ color: colors.textPrimary }}>
                  {concept.title}
                </div>
                <div className="flex items-center gap-1 mb-2">
                  <span 
                    className="text-xs px-2 py-0.5 rounded-full"
                    style={{
                      background: getDifficultyColor(concept.difficulty) + '30',
                      color: getDifficultyColor(concept.difficulty),
                    }}
                  >
                    {concept.difficulty}
                  </span>
                </div>
                <p className="text-xs line-clamp-2" style={{ color: colors.textSecondary }}>
                  {concept.description}
                </p>
              </button>
            ))}
          </div>
        </section>

        {/* 3D Visualization Space */}
        <section aria-labelledby="visualization-heading" className="px-4 pb-4">
          <div className="flex items-center justify-between mb-3">
            <h2 id="visualization-heading" className="text-lg font-semibold" style={{ color: colors.textPrimary }}>
              3D Space Visualization
            </h2>
            <div className="flex gap-2">
              <button
                onClick={() => setShowGrid(!showGrid)}
                className="p-2 rounded-lg"
                style={{ background: showGrid ? colors.iconBg : colors.cardBg }}
                aria-label={showGrid ? 'Hide grid' : 'Show grid'}
                aria-pressed={showGrid}
              >
                <Grid3x3 className="w-4 h-4" style={{ color: showGrid ? colors.iconColor : colors.textSecondary }} />
              </button>
              <button
                onClick={() => setShowMarkers(!showMarkers)}
                className="p-2 rounded-lg"
                style={{ background: showMarkers ? colors.successBg : colors.cardBg }}
                aria-label={showMarkers ? 'Hide markers' : 'Show markers'}
                aria-pressed={showMarkers}
              >
                <MapPin className="w-4 h-4" style={{ color: showMarkers ? colors.successColor : colors.textSecondary }} />
              </button>
              <button
                onClick={() => setShowTrails(!showTrails)}
                className="p-2 rounded-lg"
                style={{ background: showTrails ? colors.accentBg : colors.cardBg }}
                aria-label={showTrails ? 'Hide trails' : 'Show trails'}
                aria-pressed={showTrails}
              >
                <Route className="w-4 h-4" style={{ color: showTrails ? colors.accentColor : colors.textSecondary }} />
              </button>
            </div>
          </div>

          {/* 3D Space Container */}
          <div 
            className="rounded-2xl overflow-hidden mb-4 relative"
            style={{
              background: colors.cardBg,
              backdropFilter: colors.blur,
              WebkitBackdropFilter: colors.blur,
              border: colors.glassBorder,
              boxShadow: colors.shadow,
              aspectRatio: '1',
            }}
            role="img"
            aria-label={`3D visualization showing ${selectedExample.sentence} with ${spatialMarkers.length} spatial markers`}
          >
            {/* Grid Background */}
            {showGrid && (
              <div 
                className="absolute inset-0 opacity-20"
                style={{
                  backgroundImage: `
                    linear-gradient(${colors.border} 1px, transparent 1px),
                    linear-gradient(90deg, ${colors.border} 1px, transparent 1px)
                  `,
                  backgroundSize: '40px 40px',
                }}
                aria-hidden="true"
              />
            )}

            {/* Center Reference Point */}
            <div 
              className="absolute top-1/2 left-1/2 w-2 h-2 rounded-full -translate-x-1/2 -translate-y-1/2"
              style={{ background: colors.textTertiary }}
              aria-hidden="true"
            />

            {/* Spatial Markers */}
            {showMarkers && spatialMarkers.map((marker, idx) => {
              // Convert 3D position to 2D screen position (simplified projection)
              const screenX = 50 + (marker.position.x * 0.8);
              const screenY = 50 - (marker.position.y - 50) * 0.8 + (marker.position.z * 0.3);
              
              return (
                <div
                  key={marker.id}
                  className="absolute transition-all duration-500"
                  style={{
                    left: `${screenX}%`,
                    top: `${screenY}%`,
                    transform: 'translate(-50%, -50%)',
                    opacity: marker.active ? 1 : 0.4,
                  }}
                  role="status"
                  aria-label={`${marker.label} at position ${marker.position.x}, ${marker.position.y}, ${marker.position.z}`}
                >
                  {/* Marker Icon */}
                  <div 
                    className="w-10 h-10 rounded-full flex items-center justify-center mb-1"
                    style={{
                      background: marker.active ? colors.iconColor : colors.border,
                      boxShadow: marker.active ? `0 0 20px ${colors.iconColor}` : 'none',
                      transform: marker.active ? 'scale(1.2)' : 'scale(1)',
                      transition: 'all 0.3s',
                    }}
                  >
                    {marker.type === 'person' && <Hand className="w-5 h-5" style={{ color: theme === 'dark' ? 'var(--color-bg-deep)' : '#FFFFFF' }} />}
                    {marker.type === 'object' && <Circle className="w-5 h-5" style={{ color: theme === 'dark' ? 'var(--color-bg-deep)' : '#FFFFFF' }} />}
                    {marker.type === 'location' && <MapPin className="w-5 h-5" style={{ color: theme === 'dark' ? 'var(--color-bg-deep)' : '#FFFFFF' }} />}
                    {marker.type === 'time' && <Clock className="w-5 h-5" style={{ color: theme === 'dark' ? 'var(--color-bg-deep)' : '#FFFFFF' }} />}
                    {marker.type === 'reference' && <Target className="w-5 h-5" style={{ color: theme === 'dark' ? 'var(--color-bg-deep)' : '#FFFFFF' }} />}
                  </div>
                  
                  {/* Label */}
                  {showLabels && (
                    <div 
                      className="text-xs font-bold px-2 py-1 rounded-lg whitespace-nowrap"
                      style={{
                        background: marker.active ? colors.iconColor : colors.cardBg,
                        color: marker.active ? (theme === 'dark' ? 'var(--color-bg-deep)' : '#FFFFFF') : colors.textPrimary,
                        boxShadow: colors.shadow,
                      }}
                    >
                      {marker.label}
                    </div>
                  )}
                </div>
              );
            })}

            {/* Trail Lines */}
            {showTrails && (
              <svg className="absolute inset-0 w-full h-full pointer-events-none" aria-hidden="true">
                {spatialMarkers.slice(0, currentStepIndex + 1).map((marker, idx) => {
                  if (idx === 0) return null;
                  const prevMarker = spatialMarkers[idx - 1];
                  
                  const x1 = 50 + (prevMarker.position.x * 0.8);
                  const y1 = 50 - (prevMarker.position.y - 50) * 0.8 + (prevMarker.position.z * 0.3);
                  const x2 = 50 + (marker.position.x * 0.8);
                  const y2 = 50 - (marker.position.y - 50) * 0.8 + (marker.position.z * 0.3);
                  
                  return (
                    <g key={`trail-${idx}`}>
                      {/* Trail line */}
                      <line
                        x1={`${x1}%`}
                        y1={`${y1}%`}
                        x2={`${x2}%`}
                        y2={`${y2}%`}
                        stroke={colors.accentColor}
                        strokeWidth="3"
                        strokeDasharray="5,5"
                        opacity="0.6"
                      />
                      {/* Arrow head */}
                      <circle
                        cx={`${x2}%`}
                        cy={`${y2}%`}
                        r="3"
                        fill={colors.accentColor}
                      />
                    </g>
                  );
                })}
              </svg>
            )}

            {/* Step Info Overlay */}
            <div 
              className="absolute bottom-4 left-4 right-4 rounded-xl p-3"
              style={{
                background: 'rgba(0, 0, 0, 0.8)',
                backdropFilter: 'blur(10px)',
              }}
            >
              <div className="flex items-start justify-between mb-2">
                <div>
                  <div className="text-sm font-bold text-white mb-1">
                    Step {currentStepIndex + 1} of {selectedExample.steps.length}: {currentStep.sign}
                  </div>
                  <div className="text-xs text-white/80">
                    {currentStep.handShape} • {currentStep.movement}
                  </div>
                </div>
                <div className="text-xs font-bold text-white">
                  {formatTime(currentTime)}
                </div>
              </div>
              <div className="text-xs text-white/90">
                {currentStep.description}
              </div>
            </div>
          </div>

          {/* Example Selection */}
          <div className="mb-4">
            <label className="text-sm font-semibold mb-2 block" style={{ color: colors.textPrimary }}>
              Examples
            </label>
            <div className="space-y-2">
              {selectedConcept.examples.map((example) => (
                <button
                  key={example.id}
                  onClick={() => handleExampleChange(example)}
                  className="w-full rounded-xl p-3 text-left transition-all"
                  style={{
                    background: selectedExample.id === example.id ? colors.successBg : colors.cardBg,
                    backdropFilter: colors.blur,
                    WebkitBackdropFilter: colors.blur,
                    border: selectedExample.id === example.id ? `2px solid ${colors.successColor}` : colors.glassBorder,
                  }}
                  aria-label={`Select example: ${example.sentence}`}
                  aria-pressed={selectedExample.id === example.id}
                >
                  <div className="font-semibold mb-1" style={{ color: colors.textPrimary }}>
                    {example.sentence}
                  </div>
                  <div className="text-sm" style={{ color: colors.textSecondary }}>
                    {example.translation}
                  </div>
                  <div className="flex items-center gap-2 mt-2 text-xs" style={{ color: colors.textTertiary }}>
                    <Clock className="w-3 h-3" />
                    <span>{example.duration}s</span>
                    <span>•</span>
                    <span>{example.steps.length} steps</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Timeline Visualization */}
        {showTimeline && (
          <section aria-labelledby="timeline-heading" className="px-4 pb-4">
            <h2 id="timeline-heading" className="text-lg font-semibold mb-3" style={{ color: colors.textPrimary }}>
              Timeline
            </h2>
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
              {/* Timeline track */}
              <div className="relative h-12 mb-4">
                {/* Background track */}
                <div 
                  className="absolute top-5 left-0 right-0 h-1 rounded-full"
                  style={{ background: colors.border }}
                />
                
                {/* Progress */}
                <div 
                  className="absolute top-5 left-0 h-1 rounded-full transition-all"
                  style={{ 
                    width: `${(currentTime / selectedExample.duration) * 100}%`,
                    background: colors.iconColor,
                  }}
                  role="progressbar"
                  aria-valuenow={currentTime}
                  aria-valuemin={0}
                  aria-valuemax={selectedExample.duration}
                  aria-valuetext={`${formatTime(currentTime)} of ${formatTime(selectedExample.duration)}`}
                />
                
                {/* Step markers */}
                {selectedExample.steps.map((step, idx) => {
                  const position = (step.time / selectedExample.duration) * 100;
                  return (
                    <button
                      key={step.id}
                      onClick={() => {
                        setCurrentStepIndex(idx);
                        setCurrentTime(step.time);
                        setIsPlaying(false);
                      }}
                      className="absolute top-0 -translate-x-1/2 flex flex-col items-center gap-1"
                      style={{ left: `${position}%` }}
                      aria-label={`Jump to step ${idx + 1}: ${step.sign}`}
                    >
                      <div className="text-xs font-semibold px-2 py-1 rounded-lg whitespace-nowrap" style={{
                        background: idx === currentStepIndex ? colors.iconBg : colors.cardBg,
                        color: idx === currentStepIndex ? colors.iconColor : colors.textSecondary,
                        border: idx === currentStepIndex ? `1px solid ${colors.iconColor}` : '1px solid transparent',
                      }}>
                        {step.sign}
                      </div>
                      <div 
                        className="w-3 h-3 rounded-full"
                        style={{
                          background: idx === currentStepIndex ? colors.iconColor : idx <= currentStepIndex ? colors.successColor : colors.border,
                          boxShadow: idx === currentStepIndex ? `0 0 8px ${colors.iconColor}` : 'none',
                        }}
                      />
                    </button>
                  );
                })}
              </div>

              {/* Playback Controls */}
              <div className="flex items-center gap-2 mb-3">
                <button
                  onClick={handleStepBackward}
                  disabled={currentStepIndex === 0}
                  className="p-2 rounded-lg disabled:opacity-30"
                  style={{ background: colors.cardHover }}
                  aria-label="Previous step"
                >
                  <SkipBack className="w-5 h-5" style={{ color: colors.textPrimary }} />
                </button>

                <button
                  onClick={handlePlayPause}
                  className="flex-1 h-12 rounded-xl font-semibold flex items-center justify-center gap-2"
                  style={{ 
                    background: colors.iconColor,
                    color: theme === 'dark' ? 'var(--color-bg-deep)' : '#FFFFFF',
                  }}
                  aria-label={isPlaying ? 'Pause demonstration' : 'Play demonstration'}
                >
                  {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
                  {isPlaying ? 'Pause' : 'Play'}
                </button>

                <button
                  onClick={handleStepForward}
                  disabled={currentStepIndex === selectedExample.steps.length - 1}
                  className="p-2 rounded-lg disabled:opacity-30"
                  style={{ background: colors.cardHover }}
                  aria-label="Next step"
                >
                  <SkipForward className="w-5 h-5" style={{ color: colors.textPrimary }} />
                </button>

                <button
                  onClick={handleReset}
                  className="p-2 rounded-lg"
                  style={{ background: colors.cardHover }}
                  aria-label="Reset to beginning"
                >
                  <RotateCcw className="w-5 h-5" style={{ color: colors.textPrimary }} />
                </button>
              </div>

              {/* Speed Control */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label htmlFor="playback-speed" className="text-sm font-semibold" style={{ color: colors.textPrimary }}>
                    Playback Speed
                  </label>
                  <span className="text-sm font-bold" style={{ color: colors.iconColor }}>
                    {playbackSpeed}x
                  </span>
                </div>
                <input
                  id="playback-speed"
                  type="range"
                  min="0.25"
                  max="2"
                  step="0.25"
                  value={playbackSpeed}
                  onChange={(e) => setPlaybackSpeed(parseFloat(e.target.value))}
                  className="w-full h-2 rounded-full appearance-none cursor-pointer"
                  style={{
                    background: `linear-gradient(to right, ${colors.accentColor} 0%, ${colors.accentColor} ${((playbackSpeed - 0.25) / 1.75) * 100}%, ${colors.border} ${((playbackSpeed - 0.25) / 1.75) * 100}%, ${colors.border} 100%)`,
                  }}
                  aria-label="Playback speed"
                  aria-valuemin={0.25}
                  aria-valuemax={2}
                  aria-valuenow={playbackSpeed}
                  aria-valuetext={`${playbackSpeed} times speed`}
                />
                <div className="flex justify-between text-xs mt-1" style={{ color: colors.textTertiary }}>
                  <span>0.25x</span>
                  <span>2x</span>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Step Details */}
        <section aria-labelledby="steps-heading" className="px-4 pb-6">
          <h2 id="steps-heading" className="text-lg font-semibold mb-3" style={{ color: colors.textPrimary }}>
            Step-by-Step Breakdown
          </h2>
          <div className="space-y-3">
            {selectedExample.steps.map((step, idx) => (
              <div
                key={step.id}
                className="rounded-xl p-4"
                style={{
                  background: idx === currentStepIndex ? colors.iconBg : colors.cardBg,
                  backdropFilter: colors.blur,
                  WebkitBackdropFilter: colors.blur,
                  border: idx === currentStepIndex ? `2px solid ${colors.iconColor}` : colors.glassBorder,
                  boxShadow: colors.shadow,
                }}
              >
                <div className="flex items-start gap-3">
                  <div 
                    className="w-8 h-8 rounded-lg flex items-center justify-center font-bold flex-shrink-0"
                    style={{
                      background: idx === currentStepIndex ? colors.iconColor : colors.border,
                      color: idx === currentStepIndex ? (theme === 'dark' ? 'var(--color-bg-deep)' : '#FFFFFF') : colors.textSecondary,
                    }}
                  >
                    {idx + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-2">
                      <div className="font-semibold" style={{ color: colors.textPrimary }}>
                        {step.sign}
                      </div>
                      <div className="text-xs font-bold" style={{ color: colors.iconColor }}>
                        {formatTime(step.time)}
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-2 mb-2">
                      <div className="text-xs">
                        <span style={{ color: colors.textTertiary }}>Hand Shape:</span>
                        <div className="font-semibold" style={{ color: colors.textPrimary }}>{step.handShape}</div>
                      </div>
                      <div className="text-xs">
                        <span style={{ color: colors.textTertiary }}>Movement:</span>
                        <div className="font-semibold" style={{ color: colors.textPrimary }}>{step.movement}</div>
                      </div>
                    </div>
                    <div className="text-xs mb-2" style={{ color: colors.textTertiary }}>
                      Position: X:{step.position.x} Y:{step.position.y} Z:{step.position.z}
                    </div>
                    <p className="text-sm" style={{ color: colors.textSecondary }}>
                      {step.description}
                    </p>
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
              background: colors.accentBg,
              border: colors.glassBorder,
            }}
          >
            <Info className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: colors.accentColor }} aria-hidden="true" />
            <div className="text-sm" style={{ color: colors.textSecondary }}>
              <strong style={{ color: colors.textPrimary }}>3D Spatial Grammar:</strong> ASL uses the space around the signer to show relationships, time, location, and direction. Watch how signs move through 3D space to convey meaning beyond individual hand shapes.
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
