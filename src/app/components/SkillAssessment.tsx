import { useState } from 'react';
import { Button } from './ui/button';
import { useTheme } from '../context/ThemeContext';
import { useApp } from '../context/AppContext';
import exampleImage from 'figma:asset/446c27a0bf7487ec5c5f1f60e7b6ee8eabd297e8.png';
import { 
  X, 
  Clock,
  Target,
  Award,
  Brain,
  Zap,
  CheckCircle2,
  ArrowRight,
  Play,
  BarChart3,
  TrendingUp,
  Calendar,
  Share2,
  Download,
  Eye,
  Hand,
  MessageSquare,
  Activity,
  Star,
  Trophy,
  Crown,
  Users,
  ChevronRight,
  AlertCircle,
  Info,
  Camera,
  FileText,
  Sparkles,
  LineChart,
  PieChart,
  Lock,
  Unlock,
  RefreshCw,
  Check,
  X as XIcon,
  Gauge,
  BookOpen,
  GraduationCap,
  MapPin,
  Settings,
  Facebook,
  Twitter,
  Linkedin,
  Link,
  Mail,
  Copy,
  Bell,
} from 'lucide-react';

interface SkillAssessmentProps {
  onExit: () => void;
}

interface AssessmentType {
  id: string;
  title: string;
  description: string;
  duration: string;
  purpose: string;
  icon: any;
  recommended?: boolean;
}

interface Question {
  id: string;
  type: 'sign-recognition' | 'grammar' | 'fingerspelling' | 'comprehension';
  question: string;
  options: string[];
  correctAnswer: number;
  difficulty: 'easy' | 'medium' | 'hard';
  videoUrl?: string;
  timeLimit?: number;
}

interface AssessmentResult {
  overallLevel: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';
  overallScore: number;
  categoryScores: {
    vocabulary: number;
    grammar: number;
    comprehension: number;
    production: number;
  };
  strengths: string[];
  weaknesses: string[];
  percentile?: number;
  completedDate: string;
}

interface AssessmentHistory {
  id: string;
  date: string;
  level: string;
  overallScore: number;
  vocabularyScore: number;
  grammarScore: number;
  comprehensionScore: number;
  productionScore: number;
}

export function SkillAssessment({ onExit }: SkillAssessmentProps) {
  const { theme } = useTheme();
  const { userProgress } = useApp();

  const [currentView, setCurrentView] = useState<'welcome' | 'type-selection' | 'testing' | 'ar-assessment' | 'results' | 'history' | 'schedule'>('welcome');
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [currentSection, setCurrentSection] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [userAnswers, setUserAnswers] = useState<number[]>([]);
  const [currentDifficulty, setCurrentDifficulty] = useState<'easy' | 'medium' | 'hard'>('medium');
  const [arProgress, setArProgress] = useState(0);
  const [showCertificate, setShowCertificate] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [isPremium] = useState(true);

  // Assessment types
  const [assessmentTypes] = useState<AssessmentType[]>([
    {
      id: 'initial-placement',
      title: 'Initial Placement',
      description: 'Comprehensive assessment to determine your current skill level and create a personalized learning path.',
      duration: '10-15 minutes',
      purpose: 'First-time users • Personalized curriculum',
      icon: Target,
      recommended: true,
    },
    {
      id: 'progress-check',
      title: 'Progress Check',
      description: 'Quick reassessment to track your improvement and adjust your learning plan.',
      duration: '8-10 minutes',
      purpose: 'Periodic review • Track growth',
      icon: TrendingUp,
    },
    {
      id: 'skill-certification',
      title: 'Skill Certification',
      description: 'Formal assessment with official certification of your ASL proficiency level.',
      duration: '15-20 minutes',
      purpose: 'Professional credential • Shareable certificate',
      icon: Award,
    },
  ]);

  // Test sections
  const sections = [
    { id: 'vocabulary', name: 'Sign Recognition', icon: Hand, questions: 15 },
    { id: 'grammar', name: 'Grammar Comprehension', icon: BookOpen, questions: 12 },
    { id: 'fingerspelling', name: 'Fingerspelling', icon: Zap, questions: 10 },
    { id: 'comprehension', name: 'Conversation Comprehension', icon: MessageSquare, questions: 13 },
    { id: 'ar-practical', name: 'AR Practical Assessment', icon: Camera, questions: 0 },
  ];

  // Sample questions (in real app, these would be dynamically loaded)
  const [questions] = useState<Question[]>([
    {
      id: 'q1',
      type: 'sign-recognition',
      question: 'Which sign is being demonstrated in the video?',
      options: ['Hello', 'Thank you', 'Please', 'Sorry'],
      correctAnswer: 0,
      difficulty: 'easy',
      timeLimit: 30,
    },
    {
      id: 'q2',
      type: 'sign-recognition',
      question: 'Identify the correct sign for "Family"',
      options: ['Friend', 'Family', 'Love', 'Home'],
      correctAnswer: 1,
      difficulty: 'medium',
      timeLimit: 30,
    },
    {
      id: 'q3',
      type: 'grammar',
      question: 'In ASL, where is the typical sentence structure for "I am learning sign language"?',
      options: ['I learn sign language', 'Sign language I learn', 'Learn I sign language', 'I sign language learn'],
      correctAnswer: 0,
      difficulty: 'medium',
      timeLimit: 45,
    },
    {
      id: 'q4',
      type: 'grammar',
      question: 'Which facial expression typically accompanies yes/no questions in ASL?',
      options: ['Eyebrows down', 'Eyebrows up', 'Neutral expression', 'Eyes closed'],
      correctAnswer: 1,
      difficulty: 'easy',
      timeLimit: 30,
    },
    {
      id: 'q5',
      type: 'fingerspelling',
      question: 'What word is being fingerspelled? (Speed: Medium)',
      options: ['HELLO', 'HOUSE', 'HAPPY', 'HELP'],
      correctAnswer: 0,
      difficulty: 'medium',
      timeLimit: 20,
    },
    {
      id: 'q6',
      type: 'comprehension',
      question: 'Watch the conversation. What is the main topic being discussed?',
      options: ['Making dinner plans', 'Discussing the weather', 'Talking about work', 'Planning a trip'],
      correctAnswer: 0,
      difficulty: 'hard',
      timeLimit: 60,
    },
  ]);

  // Assessment results
  const [results] = useState<AssessmentResult>({
    overallLevel: 'Intermediate',
    overallScore: 78,
    categoryScores: {
      vocabulary: 85,
      grammar: 72,
      comprehension: 76,
      production: 79,
    },
    strengths: ['Sign Recognition', 'Vocabulary Retention', 'Hand Shape Accuracy'],
    weaknesses: ['Grammar Structure', 'Facial Expressions', 'Spatial Agreement'],
    percentile: 68,
    completedDate: '2026-01-12',
  });

  // Assessment history
  const [assessmentHistory] = useState<AssessmentHistory[]>([
    {
      id: 'assessment-1',
      date: '2026-01-12',
      level: 'Intermediate',
      overallScore: 78,
      vocabularyScore: 85,
      grammarScore: 72,
      comprehensionScore: 76,
      productionScore: 79,
    },
    {
      id: 'assessment-2',
      date: '2025-12-15',
      level: 'Beginner',
      overallScore: 64,
      vocabularyScore: 70,
      grammarScore: 58,
      comprehensionScore: 62,
      productionScore: 66,
    },
    {
      id: 'assessment-3',
      date: '2025-11-10',
      level: 'Beginner',
      overallScore: 52,
      vocabularyScore: 58,
      grammarScore: 45,
      comprehensionScore: 50,
      productionScore: 55,
    },
  ]);

  // Recommended courses based on results
  const [recommendations] = useState([
    {
      id: 'rec1',
      title: 'ASL Grammar Fundamentals',
      reason: 'Strengthen your grammar skills',
      duration: '6 weeks',
      lessonsCount: 24,
    },
    {
      id: 'rec2',
      title: 'Facial Expressions Mastery',
      reason: 'Improve non-manual markers',
      duration: '3 weeks',
      lessonsCount: 12,
    },
    {
      id: 'rec3',
      title: 'Intermediate Vocabulary Building',
      reason: 'Expand your sign vocabulary',
      duration: '4 weeks',
      lessonsCount: 18,
    },
  ]);

  const handleAnswerSelect = (answerIndex: number) => {
    setSelectedAnswer(answerIndex);
  };

  const handleNextQuestion = () => {
    if (selectedAnswer !== null) {
      setUserAnswers([...userAnswers, selectedAnswer]);
      
      // Adaptive difficulty adjustment (simplified)
      const isCorrect = selectedAnswer === questions[currentQuestion].correctAnswer;
      if (isCorrect && currentDifficulty === 'medium') {
        setCurrentDifficulty('hard');
      } else if (!isCorrect && currentDifficulty === 'medium') {
        setCurrentDifficulty('easy');
      }

      setSelectedAnswer(null);
      
      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion(currentQuestion + 1);
      } else if (currentSection < sections.length - 1) {
        setCurrentSection(currentSection + 1);
        setCurrentQuestion(0);
        if (currentSection === 3) {
          // Move to AR assessment
          setCurrentView('ar-assessment');
        }
      } else {
        // Complete assessment
        setCurrentView('results');
      }
    }
  };

  const handleSkipAndStartBeginner = () => {
    onExit();
  };

  const handleStartAssessment = (typeId: string) => {
    setSelectedType(typeId);
    setCurrentView('testing');
    setCurrentSection(0);
    setCurrentQuestion(0);
  };

  const handleARAssessmentComplete = () => {
    setCurrentView('results');
  };

  const totalQuestions = sections.slice(0, -1).reduce((acc, section) => acc + section.questions, 0);
  const answeredQuestions = userAnswers.length;
  const progressPercentage = (answeredQuestions / totalQuestions) * 100;
  const estimatedTimeRemaining = Math.max(1, Math.ceil((totalQuestions - answeredQuestions) * 0.5));

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
      aria-labelledby="skill-assessment-title"
    >
      {/* Header */}
      <div 
        className="p-4 border-b"
        style={{ borderBottomColor: colors.border }}
      >
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <h1 
              id="skill-assessment-title" 
              className="text-xl sm:text-2xl font-bold"
              style={{ fontFamily: 'Poppins, sans-serif' }}
            >
              {currentView === 'welcome' && 'Skill Assessment'}
              {currentView === 'type-selection' && 'Choose Assessment Type'}
              {currentView === 'testing' && 'Assessment in Progress'}
              {currentView === 'ar-assessment' && 'AR Practical Assessment'}
              {currentView === 'results' && 'Assessment Results'}
              {currentView === 'history' && 'Assessment History'}
              {currentView === 'schedule' && 'Schedule Assessment'}
            </h1>
            <p className="text-sm" style={{ color: colors.textSecondary }}>
              {currentView === 'welcome' && 'Discover your current ASL proficiency'}
              {currentView === 'type-selection' && 'Select the assessment that fits your needs'}
              {currentView === 'testing' && `Section ${currentSection + 1} of ${sections.length - 1}`}
              {currentView === 'ar-assessment' && 'Demonstrate signs with hand tracking'}
              {currentView === 'results' && `${results.overallLevel} Level • ${results.overallScore}% Overall`}
              {currentView === 'history' && 'Track your progress over time'}
              {currentView === 'schedule' && 'Plan your next assessment'}
            </p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onExit}
            style={{ color: colors.textSecondary }}
            aria-label="Exit skill assessment"
          >
            <X className="w-6 h-6" />
          </Button>
        </div>

        {/* Progress bar during test */}
        {currentView === 'testing' && (
          <div className="mt-3">
            <div className="flex items-center justify-between mb-2 text-sm">
              <span style={{ color: colors.textSecondary }}>
                Progress: {answeredQuestions}/{totalQuestions} questions
              </span>
              <span style={{ color: colors.textTertiary }}>
                ~{estimatedTimeRemaining} min remaining
              </span>
            </div>
            <div 
              className="w-full h-2 rounded-full overflow-hidden"
              style={{ background: colors.border }}
            >
              <div 
                className="h-full transition-all duration-300"
                style={{ 
                  background: colors.iconColor,
                  width: `${progressPercentage}%`,
                }}
                role="progressbar"
                aria-valuenow={progressPercentage}
                aria-valuemin={0}
                aria-valuemax={100}
                aria-label="Assessment progress"
              />
            </div>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        {/* Welcome Screen */}
        {currentView === 'welcome' && (
          <div className="p-4 space-y-4">
            <div 
              className="rounded-2xl p-6 text-center"
              style={{
                background: colors.cardBg,
                backdropFilter: colors.blur,
                WebkitBackdropFilter: colors.blur,
                border: colors.glassBorder,
                boxShadow: colors.shadow,
              }}
            >
              <div 
                className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4"
                style={{ background: colors.iconBg }}
              >
                <Gauge className="w-12 h-12" style={{ color: colors.iconColor }} aria-hidden="true" />
              </div>
              
              <h2 className="text-2xl font-bold mb-3" style={{ fontFamily: 'Poppins, sans-serif', color: colors.textPrimary }}>
                Welcome to Skill Assessment
              </h2>
              
              <p className="text-base mb-6" style={{ color: colors.textSecondary }}>
                Discover your current ASL proficiency level and get personalized learning recommendations.
              </p>

              <div className="space-y-3 mb-6 text-left">
                <div className="flex items-start gap-3">
                  <div 
                    className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                    style={{ background: colors.successBg }}
                  >
                    <Clock className="w-5 h-5" style={{ color: colors.successColor }} />
                  </div>
                  <div>
                    <div className="font-semibold mb-1" style={{ color: colors.textPrimary }}>
                      10-15 Minutes
                    </div>
                    <div className="text-sm" style={{ color: colors.textTertiary }}>
                      Quick and comprehensive assessment
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div 
                    className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                    style={{ background: colors.accentBg }}
                  >
                    <Target className="w-5 h-5" style={{ color: colors.accentColor }} />
                  </div>
                  <div>
                    <div className="font-semibold mb-1" style={{ color: colors.textPrimary }}>
                      Personalized Learning Path
                    </div>
                    <div className="text-sm" style={{ color: colors.textTertiary }}>
                      Get custom recommendations based on your results
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div 
                    className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                    style={{ background: colors.iconBg }}
                  >
                    <Brain className="w-5 h-5" style={{ color: colors.iconColor }} />
                  </div>
                  <div>
                    <div className="font-semibold mb-1" style={{ color: colors.textPrimary }}>
                      Adaptive Testing
                    </div>
                    <div className="text-sm" style={{ color: colors.textTertiary }}>
                      Questions adjust to your skill level
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div 
                    className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                    style={{ background: colors.warningBg }}
                  >
                    <Info className="w-5 h-5" style={{ color: colors.warningColor }} />
                  </div>
                  <div>
                    <div className="font-semibold mb-1" style={{ color: colors.textPrimary }}>
                      Optional Assessment
                    </div>
                    <div className="text-sm" style={{ color: colors.textTertiary }}>
                      You can skip and start as a beginner
                    </div>
                  </div>
                </div>
              </div>

              <div 
                className="rounded-xl p-4 mb-6"
                style={{ background: colors.iconBg }}
              >
                <p className="text-sm font-semibold" style={{ color: colors.textPrimary }}>
                  Assessment includes: Sign Recognition • Grammar • Fingerspelling • Comprehension • AR Practical
                </p>
              </div>

              <Button
                onClick={() => setCurrentView('type-selection')}
                className="w-full h-12 rounded-xl font-semibold mb-3"
                style={{ 
                  background: colors.iconColor,
                  color: theme === 'dark' ? '#0F0F23' : '#FFFFFF',
                }}
                aria-label="Begin assessment"
              >
                <Play className="w-5 h-5 mr-2" />
                Begin Assessment
              </Button>

              <Button
                onClick={() => setCurrentView('history')}
                variant="ghost"
                className="w-full h-10 mb-2"
                style={{ color: colors.textSecondary }}
                aria-label="View assessment history"
              >
                <BarChart3 className="w-4 h-4 mr-2" />
                View Past Assessments
              </Button>

              <Button
                onClick={handleSkipAndStartBeginner}
                variant="ghost"
                className="w-full h-10"
                style={{ color: colors.textTertiary }}
                aria-label="Skip and start as beginner"
              >
                Skip and Start as Beginner
              </Button>
            </div>
          </div>
        )}

        {/* Type Selection */}
        {currentView === 'type-selection' && (
          <div className="p-4 space-y-3">
            {assessmentTypes.map((type) => {
              const Icon = type.icon;
              return (
                <button
                  key={type.id}
                  onClick={() => handleStartAssessment(type.id)}
                  className="w-full rounded-2xl p-4 text-left"
                  style={{
                    background: colors.cardBg,
                    backdropFilter: colors.blur,
                    WebkitBackdropFilter: colors.blur,
                    border: colors.glassBorder,
                    boxShadow: colors.shadow,
                  }}
                  aria-label={`Start ${type.title}`}
                >
                  <div className="flex items-start gap-4">
                    <div 
                      className="w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0"
                      style={{ background: colors.iconBg }}
                    >
                      <Icon className="w-8 h-8" style={{ color: colors.iconColor }} />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-bold text-lg" style={{ color: colors.textPrimary }}>
                          {type.title}
                        </h3>
                        {type.recommended && (
                          <span 
                            className="px-2 py-0.5 rounded-full text-xs font-semibold"
                            style={{ background: colors.successBg, color: colors.successColor }}
                          >
                            Recommended
                          </span>
                        )}
                      </div>
                      <p className="text-sm mb-3" style={{ color: colors.textSecondary }}>
                        {type.description}
                      </p>
                      <div className="flex items-center gap-4 text-xs" style={{ color: colors.textTertiary }}>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {type.duration}
                        </span>
                        <span>•</span>
                        <span>{type.purpose}</span>
                      </div>
                    </div>
                    <ChevronRight className="w-6 h-6 flex-shrink-0" style={{ color: colors.textTertiary }} />
                  </div>
                </button>
              );
            })}
          </div>
        )}

        {/* Testing Interface */}
        {currentView === 'testing' && (
          <div className="p-4 space-y-4">
            {/* Current Section */}
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
              <div className="flex items-center gap-3 mb-3">
                {(() => {
                  const SectionIcon = sections[currentSection].icon;
                  return (
                    <div 
                      className="w-12 h-12 rounded-lg flex items-center justify-center"
                      style={{ background: colors.iconBg }}
                    >
                      <SectionIcon className="w-6 h-6" style={{ color: colors.iconColor }} />
                    </div>
                  );
                })()}
                <div>
                  <h3 className="font-bold" style={{ color: colors.textPrimary }}>
                    {sections[currentSection].name}
                  </h3>
                  <p className="text-sm" style={{ color: colors.textSecondary }}>
                    Question {currentQuestion + 1} of {sections[currentSection].questions}
                  </p>
                </div>
              </div>

              <div 
                className="rounded-xl p-4 mb-4"
                style={{ background: colors.iconBg }}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-semibold" style={{ color: colors.textPrimary }}>
                    Difficulty: {currentDifficulty.charAt(0).toUpperCase() + currentDifficulty.slice(1)}
                  </span>
                  {questions[currentQuestion]?.timeLimit && (
                    <span className="text-sm flex items-center gap-1" style={{ color: colors.textSecondary }}>
                      <Clock className="w-4 h-4" />
                      {questions[currentQuestion].timeLimit}s
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Question */}
            {questions[currentQuestion] && (
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
                {/* Video placeholder for sign recognition */}
                {questions[currentQuestion].type === 'sign-recognition' && (
                  <div className="mb-4">
                    <img
                      src={exampleImage}
                      alt="Sign demonstration video"
                      className="w-full h-48 object-cover rounded-xl"
                    />
                  </div>
                )}

                <h4 className="text-lg font-semibold mb-4" style={{ color: colors.textPrimary }}>
                  {questions[currentQuestion].question}
                </h4>

                <div className="space-y-3">
                  {questions[currentQuestion].options.map((option, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleAnswerSelect(idx)}
                      className="w-full rounded-xl p-4 text-left flex items-center gap-3"
                      style={{
                        background: selectedAnswer === idx ? colors.iconBg : colors.border,
                        border: selectedAnswer === idx ? `2px solid ${colors.iconColor}` : 'none',
                      }}
                      aria-label={`Option ${idx + 1}: ${option}`}
                      aria-pressed={selectedAnswer === idx}
                    >
                      <div 
                        className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0"
                        style={{ 
                          background: selectedAnswer === idx ? colors.iconColor : colors.border,
                          color: selectedAnswer === idx ? (theme === 'dark' ? '#0F0F23' : '#FFFFFF') : colors.textTertiary,
                        }}
                      >
                        {selectedAnswer === idx ? <Check className="w-4 h-4" /> : <span className="text-xs font-bold">{String.fromCharCode(65 + idx)}</span>}
                      </div>
                      <span className="font-medium" style={{ color: selectedAnswer === idx ? colors.textPrimary : colors.textSecondary }}>
                        {option}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Navigation */}
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
              <div 
                className="rounded-lg p-3 mb-4 flex items-start gap-2"
                style={{ background: colors.warningBg }}
              >
                <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: colors.warningColor }} />
                <p className="text-sm" style={{ color: colors.textPrimary }}>
                  You cannot go back to change answers once you proceed.
                </p>
              </div>

              <Button
                onClick={handleNextQuestion}
                disabled={selectedAnswer === null}
                className="w-full h-12 rounded-xl font-semibold"
                style={{ 
                  background: selectedAnswer !== null ? colors.iconColor : colors.border,
                  color: selectedAnswer !== null ? (theme === 'dark' ? '#0F0F23' : '#FFFFFF') : colors.textTertiary,
                  cursor: selectedAnswer !== null ? 'pointer' : 'not-allowed',
                }}
                aria-label={currentQuestion < questions.length - 1 ? 'Next question' : 'Continue to next section'}
              >
                {currentQuestion < questions.length - 1 ? 'Next Question' : 'Continue'}
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </div>
          </div>
        )}

        {/* AR Assessment */}
        {currentView === 'ar-assessment' && (
          <div className="p-4 space-y-4">
            <div 
              className="rounded-2xl p-6 text-center"
              style={{
                background: colors.cardBg,
                backdropFilter: colors.blur,
                WebkitBackdropFilter: colors.blur,
                border: colors.glassBorder,
                boxShadow: colors.shadow,
              }}
            >
              <div 
                className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4"
                style={{ background: colors.accentBg }}
              >
                <Camera className="w-12 h-12" style={{ color: colors.accentColor }} />
              </div>
              
              <h2 className="text-xl font-bold mb-2" style={{ color: colors.textPrimary }}>
                AR Practical Assessment
              </h2>
              
              <p className="text-sm mb-6" style={{ color: colors.textSecondary }}>
                Demonstrate signs using hand tracking for real-time accuracy evaluation
              </p>

              <div className="mb-6">
                <img
                  src={exampleImage}
                  alt="AR hand tracking interface"
                  className="w-full h-64 object-cover rounded-xl"
                />
              </div>

              <div 
                className="rounded-xl p-4 mb-4"
                style={{ background: colors.iconBg }}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-semibold" style={{ color: colors.textPrimary }}>
                    Signs Demonstrated
                  </span>
                  <span className="text-sm font-bold" style={{ color: colors.iconColor }}>
                    8/10
                  </span>
                </div>
                <div 
                  className="w-full h-2 rounded-full overflow-hidden"
                  style={{ background: colors.border }}
                >
                  <div 
                    className="h-full transition-all"
                    style={{ 
                      background: colors.accentColor,
                      width: '80%',
                    }}
                    role="progressbar"
                    aria-valuenow={80}
                    aria-valuemin={0}
                    aria-valuemax={100}
                    aria-label="AR assessment progress"
                  />
                </div>
              </div>

              <div className="space-y-2 mb-6 text-sm text-left">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4" style={{ color: colors.successColor }} />
                  <span style={{ color: colors.textSecondary }}>Hand shape accuracy: 92%</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4" style={{ color: colors.successColor }} />
                  <span style={{ color: colors.textSecondary }}>Movement precision: 88%</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4" style={{ color: colors.successColor }} />
                  <span style={{ color: colors.textSecondary }}>Facial expressions: 85%</span>
                </div>
              </div>

              <Button
                onClick={handleARAssessmentComplete}
                className="w-full h-12 rounded-xl font-semibold"
                style={{ 
                  background: colors.successColor,
                  color: '#FFFFFF',
                }}
                aria-label="Complete AR assessment"
              >
                <CheckCircle2 className="w-5 h-5 mr-2" />
                Complete Assessment
              </Button>
            </div>
          </div>
        )}

        {/* Results Screen */}
        {currentView === 'results' && (
          <div className="p-4 space-y-4">
            {/* Overall Score */}
            <div 
              className="rounded-2xl p-6 text-center"
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
                <Trophy className="w-14 h-14" style={{ color: colors.successColor }} />
              </div>
              
              <h2 className="text-3xl font-bold mb-2" style={{ fontFamily: 'Poppins, sans-serif', color: colors.textPrimary }}>
                {results.overallLevel}
              </h2>
              
              <p className="text-lg mb-4" style={{ color: colors.textSecondary }}>
                Overall Score: {results.overallScore}%
              </p>

              {isPremium && results.percentile && (
                <div 
                  className="rounded-xl p-3 inline-flex items-center gap-2"
                  style={{ background: colors.accentBg }}
                >
                  <Crown className="w-5 h-5" style={{ color: colors.accentColor }} />
                  <span className="text-sm font-semibold" style={{ color: colors.textPrimary }}>
                    Top {100 - results.percentile}% of learners
                  </span>
                </div>
              )}

              <div className="mt-4 text-xs" style={{ color: colors.textTertiary }}>
                Completed on {new Date(results.completedDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
              </div>
            </div>

            {/* Category Breakdown */}
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
                Skill Breakdown
              </h3>

              <div className="space-y-4">
                {[
                  { name: 'Vocabulary', score: results.categoryScores.vocabulary, icon: Hand },
                  { name: 'Grammar', score: results.categoryScores.grammar, icon: BookOpen },
                  { name: 'Comprehension', score: results.categoryScores.comprehension, icon: MessageSquare },
                  { name: 'Production', score: results.categoryScores.production, icon: Camera },
                ].map((category) => {
                  const Icon = category.icon;
                  return (
                    <div key={category.name}>
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <Icon className="w-4 h-4" style={{ color: colors.iconColor }} />
                          <span className="text-sm font-medium" style={{ color: colors.textPrimary }}>
                            {category.name}
                          </span>
                        </div>
                        <span className="text-sm font-bold" style={{ color: colors.textPrimary }}>
                          {category.score}/100
                        </span>
                      </div>
                      <div 
                        className="w-full h-2 rounded-full overflow-hidden"
                        style={{ background: colors.border }}
                      >
                        <div 
                          className="h-full transition-all"
                          style={{ 
                            background: category.score >= 80 ? colors.successColor : category.score >= 60 ? colors.warningColor : colors.errorColor,
                            width: `${category.score}%`,
                          }}
                          role="progressbar"
                          aria-valuenow={category.score}
                          aria-valuemin={0}
                          aria-valuemax={100}
                          aria-label={`${category.name} score: ${category.score}%`}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Strengths and Weaknesses */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
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
                <div className="flex items-center gap-2 mb-3">
                  <div 
                    className="w-8 h-8 rounded-lg flex items-center justify-center"
                    style={{ background: colors.successBg }}
                  >
                    <CheckCircle2 className="w-5 h-5" style={{ color: colors.successColor }} />
                  </div>
                  <h4 className="font-semibold" style={{ color: colors.textPrimary }}>
                    Strengths
                  </h4>
                </div>
                <ul className="space-y-2">
                  {results.strengths.map((strength, idx) => (
                    <li key={idx} className="text-sm flex items-center gap-2" style={{ color: colors.textSecondary }}>
                      <div className="w-1.5 h-1.5 rounded-full" style={{ background: colors.successColor }} />
                      {strength}
                    </li>
                  ))}
                </ul>
              </div>

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
                <div className="flex items-center gap-2 mb-3">
                  <div 
                    className="w-8 h-8 rounded-lg flex items-center justify-center"
                    style={{ background: colors.warningBg }}
                  >
                    <Target className="w-5 h-5" style={{ color: colors.warningColor }} />
                  </div>
                  <h4 className="font-semibold" style={{ color: colors.textPrimary }}>
                    Areas to Improve
                  </h4>
                </div>
                <ul className="space-y-2">
                  {results.weaknesses.map((weakness, idx) => (
                    <li key={idx} className="text-sm flex items-center gap-2" style={{ color: colors.textSecondary }}>
                      <div className="w-1.5 h-1.5 rounded-full" style={{ background: colors.warningColor }} />
                      {weakness}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Recommendations */}
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
                Recommended Courses
              </h3>

              <div className="space-y-3">
                {recommendations.map((rec) => (
                  <div
                    key={rec.id}
                    className="rounded-xl p-4"
                    style={{ background: colors.iconBg }}
                  >
                    <h4 className="font-semibold mb-1" style={{ color: colors.textPrimary }}>
                      {rec.title}
                    </h4>
                    <p className="text-sm mb-2" style={{ color: colors.textTertiary }}>
                      {rec.reason}
                    </p>
                    <div className="flex items-center gap-3 text-xs" style={{ color: colors.textSecondary }}>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {rec.duration}
                      </span>
                      <span>•</span>
                      <span>{rec.lessonsCount} lessons</span>
                    </div>
                  </div>
                ))}
              </div>

              <div 
                className="rounded-xl p-4 mt-4"
                style={{ background: colors.accentBg }}
              >
                <p className="text-sm font-semibold" style={{ color: colors.textPrimary }}>
                  Estimated time to Advanced level: 8-10 weeks with consistent practice
                </p>
              </div>
            </div>

            {/* Certificate */}
            {isPremium && (
              <div 
                className="rounded-2xl p-6"
                style={{
                  background: `linear-gradient(135deg, ${colors.accentColor}20 0%, ${colors.iconColor}20 100%)`,
                  border: colors.glassBorder,
                  boxShadow: colors.shadow,
                }}
              >
                <div className="flex items-start gap-3 mb-4">
                  <div 
                    className="w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0"
                    style={{ background: colors.warningColor }}
                  >
                    <Award className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold mb-1" style={{ color: colors.textPrimary }}>
                      Assessment Certificate
                    </h3>
                    <p className="text-sm" style={{ color: colors.textSecondary }}>
                      Official credential of your ASL proficiency
                    </p>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button
                    onClick={() => setShowCertificate(true)}
                    className="flex-1 h-11 rounded-xl font-semibold"
                    style={{ 
                      background: colors.iconColor,
                      color: theme === 'dark' ? '#0F0F23' : '#FFFFFF',
                    }}
                    aria-label="View certificate"
                  >
                    <Eye className="w-4 h-4 mr-2" />
                    View
                  </Button>
                  <Button
                    className="flex-1 h-11 rounded-xl font-semibold"
                    style={{ 
                      background: colors.successColor,
                      color: '#FFFFFF',
                    }}
                    aria-label="Download certificate PDF"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Download PDF
                  </Button>
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Button
                onClick={() => setShowShareModal(true)}
                className="h-12 rounded-xl font-semibold"
                style={{ 
                  background: colors.iconBg,
                  color: colors.iconColor,
                }}
                aria-label="Share results"
              >
                <Share2 className="w-5 h-5 mr-2" />
                Share Results
              </Button>
              <Button
                onClick={() => setCurrentView('schedule')}
                className="h-12 rounded-xl font-semibold"
                style={{ 
                  background: colors.accentBg,
                  color: colors.accentColor,
                }}
                aria-label="Schedule next assessment"
              >
                <Calendar className="w-5 h-5 mr-2" />
                Schedule Next
              </Button>
            </div>
          </div>
        )}

        {/* Assessment History */}
        {currentView === 'history' && (
          <div className="p-4 space-y-4">
            {/* Progress Chart */}
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
                Skill Level Progression
              </h3>

              <div className="flex items-end gap-2 h-48 mb-4">
                {assessmentHistory.slice().reverse().map((assessment, idx) => (
                  <div key={assessment.id} className="flex-1 flex flex-col items-center gap-2">
                    <div 
                      className="w-full rounded-t transition-all relative group"
                      style={{ 
                        background: colors.iconColor,
                        height: `${assessment.overallScore}%`,
                      }}
                      role="progressbar"
                      aria-valuenow={assessment.overallScore}
                      aria-valuemin={0}
                      aria-valuemax={100}
                      aria-label={`${new Date(assessment.date).toLocaleDateString()}: ${assessment.overallScore}%`}
                    >
                      <div 
                        className="absolute -top-8 left-1/2 -translate-x-1/2 px-2 py-1 rounded text-xs font-bold whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity"
                        style={{ background: colors.cardBg, color: colors.textPrimary }}
                      >
                        {assessment.overallScore}%
                      </div>
                    </div>
                    <div className="text-xs text-center" style={{ color: colors.textTertiary }}>
                      {new Date(assessment.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </div>
                  </div>
                ))}
              </div>

              <div 
                className="rounded-xl p-4"
                style={{ background: colors.successBg }}
              >
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5" style={{ color: colors.successColor }} />
                  <span className="text-sm font-semibold" style={{ color: colors.textPrimary }}>
                    +26% improvement since first assessment
                  </span>
                </div>
              </div>
            </div>

            {/* Timeline */}
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
                Assessment Timeline
              </h3>

              <div className="space-y-4">
                {assessmentHistory.map((assessment, idx) => (
                  <div key={assessment.id} className="flex items-start gap-3">
                    <div className="flex flex-col items-center">
                      <div 
                        className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
                        style={{ 
                          background: idx === 0 ? colors.successColor : colors.iconBg,
                        }}
                      >
                        {idx === 0 ? (
                          <Trophy className="w-5 h-5 text-white" />
                        ) : (
                          <CheckCircle2 className="w-5 h-5" style={{ color: colors.iconColor }} />
                        )}
                      </div>
                      {idx < assessmentHistory.length - 1 && (
                        <div 
                          className="w-0.5 h-16 my-1"
                          style={{ background: colors.border }}
                        />
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <div>
                          <span className="font-semibold" style={{ color: colors.textPrimary }}>
                            {assessment.level}
                          </span>
                          {idx === 0 && (
                            <span 
                              className="ml-2 px-2 py-0.5 rounded-full text-xs font-semibold"
                              style={{ background: colors.successBg, color: colors.successColor }}
                            >
                              Current
                            </span>
                          )}
                        </div>
                        <span className="text-sm font-bold" style={{ color: colors.iconColor }}>
                          {assessment.overallScore}%
                        </span>
                      </div>
                      <div className="text-sm mb-2" style={{ color: colors.textTertiary }}>
                        {new Date(assessment.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div>
                          <span style={{ color: colors.textTertiary }}>Vocabulary: </span>
                          <span className="font-semibold" style={{ color: colors.textPrimary }}>{assessment.vocabularyScore}%</span>
                        </div>
                        <div>
                          <span style={{ color: colors.textTertiary }}>Grammar: </span>
                          <span className="font-semibold" style={{ color: colors.textPrimary }}>{assessment.grammarScore}%</span>
                        </div>
                        <div>
                          <span style={{ color: colors.textTertiary }}>Comprehension: </span>
                          <span className="font-semibold" style={{ color: colors.textPrimary }}>{assessment.comprehensionScore}%</span>
                        </div>
                        <div>
                          <span style={{ color: colors.textTertiary }}>Production: </span>
                          <span className="font-semibold" style={{ color: colors.textPrimary }}>{assessment.productionScore}%</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Schedule Assessment */}
        {currentView === 'schedule' && (
          <div className="p-4 space-y-4">
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
                Schedule Your Next Assessment
              </h3>

              <p className="text-sm mb-6" style={{ color: colors.textSecondary }}>
                Regular assessments help track your progress and adjust your learning path for optimal results.
              </p>

              <div className="space-y-3 mb-6">
                {[
                  { days: 30, label: '30 Days', recommended: false },
                  { days: 60, label: '60 Days', recommended: true },
                  { days: 90, label: '90 Days', recommended: false },
                ].map((option) => (
                  <button
                    key={option.days}
                    className="w-full rounded-xl p-4 text-left"
                    style={{
                      background: option.recommended ? colors.iconBg : colors.border,
                      border: option.recommended ? `2px solid ${colors.iconColor}` : 'none',
                    }}
                    aria-label={`Schedule in ${option.label}`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Calendar className="w-5 h-5" style={{ color: option.recommended ? colors.iconColor : colors.textTertiary }} />
                        <div>
                          <div className="font-semibold" style={{ color: colors.textPrimary }}>
                            {option.label}
                          </div>
                          <div className="text-xs" style={{ color: colors.textTertiary }}>
                            {new Date(Date.now() + option.days * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                          </div>
                        </div>
                      </div>
                      {option.recommended && (
                        <span 
                          className="px-2 py-1 rounded-full text-xs font-semibold"
                          style={{ background: colors.successBg, color: colors.successColor }}
                        >
                          Recommended
                        </span>
                      )}
                    </div>
                  </button>
                ))}
              </div>

              <div className="flex items-center justify-between mb-4">
                <span className="text-sm font-semibold" style={{ color: colors.textPrimary }}>
                  Calendar Reminder
                </span>
                <button
                  className="w-12 h-6 rounded-full relative"
                  style={{ background: colors.successColor }}
                  aria-label="Toggle calendar reminder"
                  aria-pressed={true}
                >
                  <div 
                    className="w-5 h-5 rounded-full absolute top-0.5 right-0.5 transition-all"
                    style={{ background: '#FFFFFF' }}
                  />
                </button>
              </div>

              <Button
                className="w-full h-12 rounded-xl font-semibold"
                style={{ 
                  background: colors.iconColor,
                  color: theme === 'dark' ? '#0F0F23' : '#FFFFFF',
                }}
                aria-label="Confirm assessment schedule"
              >
                <Bell className="w-5 h-5 mr-2" />
                Set Reminder
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Share Modal */}
      {showShareModal && (
        <div 
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
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
            aria-labelledby="share-modal-title"
            aria-modal="true"
          >
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 id="share-modal-title" className="text-xl font-bold mb-1" style={{ color: colors.textPrimary }}>
                  Share Results
                </h3>
                <p className="text-sm" style={{ color: colors.textSecondary }}>
                  Share your achievement with friends
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

            <div className="grid grid-cols-4 gap-3 mb-4">
              {[
                { icon: Facebook, label: 'Facebook', color: '#1877F2' },
                { icon: Twitter, label: 'Twitter', color: '#1DA1F2' },
                { icon: Linkedin, label: 'LinkedIn', color: '#0A66C2' },
                { icon: Mail, label: 'Email', color: colors.iconColor },
              ].map((platform) => {
                const Icon = platform.icon;
                return (
                  <button
                    key={platform.label}
                    className="flex flex-col items-center gap-2 p-3 rounded-xl"
                    style={{ background: colors.iconBg }}
                    aria-label={`Share on ${platform.label}`}
                  >
                    <Icon className="w-6 h-6" style={{ color: platform.color }} />
                    <span className="text-xs" style={{ color: colors.textSecondary }}>
                      {platform.label}
                    </span>
                  </button>
                );
              })}
            </div>

            <div 
              className="rounded-xl p-4 mb-4"
              style={{ background: colors.iconBg }}
            >
              <div className="flex items-center gap-2 mb-2">
                <input
                  type="text"
                  value="https://signlearn.app/results/abc123"
                  readOnly
                  className="flex-1 bg-transparent text-sm"
                  style={{ color: colors.textPrimary }}
                  aria-label="Shareable link"
                />
                <button
                  className="p-2 rounded-lg"
                  style={{ background: colors.iconColor, color: theme === 'dark' ? '#0F0F23' : '#FFFFFF' }}
                  aria-label="Copy link"
                >
                  <Copy className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="space-y-2 mb-4">
              <label className="flex items-center gap-2">
                <input type="checkbox" className="w-4 h-4" defaultChecked />
                <span className="text-sm" style={{ color: colors.textSecondary }}>
                  Share with friends for comparison
                </span>
              </label>
              <label className="flex items-center gap-2">
                <input type="checkbox" className="w-4 h-4" />
                <span className="text-sm" style={{ color: colors.textSecondary }}>
                  Make results public
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
              aria-label="Share results"
            >
              <Share2 className="w-5 h-5 mr-2" />
              Share Now
            </Button>
          </div>
        </div>
      )}

      {/* Certificate Modal */}
      {showCertificate && (
        <div 
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          onClick={() => setShowCertificate(false)}
        >
          <div 
            className="w-full max-w-2xl rounded-2xl p-6"
            style={{
              background: colors.cardBg,
              backdropFilter: colors.blur,
              WebkitBackdropFilter: colors.blur,
              border: colors.glassBorder,
              boxShadow: colors.shadow,
            }}
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-labelledby="certificate-title"
            aria-modal="true"
          >
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 id="certificate-title" className="text-xl font-bold mb-1" style={{ color: colors.textPrimary }}>
                  Assessment Certificate
                </h3>
                <p className="text-sm" style={{ color: colors.textSecondary }}>
                  Official credential of ASL proficiency
                </p>
              </div>
              <button
                onClick={() => setShowCertificate(false)}
                className="p-2 rounded-lg"
                style={{ color: colors.textSecondary }}
                aria-label="Close certificate"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div 
              className="rounded-xl p-8 mb-4 text-center"
              style={{ 
                background: `linear-gradient(135deg, ${colors.accentColor}20 0%, ${colors.iconColor}20 100%)`,
                border: `2px solid ${colors.iconColor}`,
              }}
            >
              <Award className="w-16 h-16 mx-auto mb-4" style={{ color: colors.warningColor }} />
              
              <h2 className="text-3xl font-bold mb-2" style={{ fontFamily: 'Poppins, sans-serif', color: colors.textPrimary }}>
                Certificate of Achievement
              </h2>
              
              <p className="text-lg mb-6" style={{ color: colors.textSecondary }}>
                This certifies that
              </p>

              <div className="text-2xl font-bold mb-6" style={{ color: colors.iconColor }}>
                {userProgress?.name || 'Student Name'}
              </div>

              <p className="text-base mb-4" style={{ color: colors.textSecondary }}>
                has successfully completed the ASL Skill Assessment
              </p>

              <div 
                className="inline-block rounded-xl px-6 py-3 mb-6"
                style={{ background: colors.successBg }}
              >
                <div className="text-sm font-semibold mb-1" style={{ color: colors.textSecondary }}>
                  Proficiency Level
                </div>
                <div className="text-3xl font-bold" style={{ color: colors.successColor }}>
                  {results.overallLevel}
                </div>
                <div className="text-sm mt-1" style={{ color: colors.textTertiary }}>
                  Score: {results.overallScore}%
                </div>
              </div>

              <div className="text-sm mb-2" style={{ color: colors.textTertiary }}>
                {new Date(results.completedDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
              </div>

              <div className="flex items-center justify-center gap-2 text-xs" style={{ color: colors.textTertiary }}>
                <Award className="w-4 h-4" />
                <span>Verified by Sign Learn AR • Partnership with National Association of the Deaf</span>
              </div>
            </div>

            <div className="flex gap-3">
              <Button
                className="flex-1 h-12 rounded-xl font-semibold"
                style={{ 
                  background: colors.successColor,
                  color: '#FFFFFF',
                }}
                aria-label="Download certificate"
              >
                <Download className="w-5 h-5 mr-2" />
                Download PDF
              </Button>
              <Button
                className="flex-1 h-12 rounded-xl font-semibold"
                style={{ 
                  background: colors.iconBg,
                  color: colors.iconColor,
                }}
                aria-label="Share certificate"
              >
                <Share2 className="w-5 h-5 mr-2" />
                Share
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
