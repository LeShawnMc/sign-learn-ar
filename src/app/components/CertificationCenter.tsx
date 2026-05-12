import { useState } from 'react';
import { Button } from './ui/button';
import { useTheme } from '../context/ThemeContext';
import { useApp } from '../context/AppContext';
import { motion, AnimatePresence } from 'motion/react';
import { X, Award, Clock, Calendar, CheckCircle, XCircle, Trophy, Download, Share2, BookOpen, Target, BarChart3, Play, ChevronRight, Star, Medal, Crown } from 'lucide-react';
import { CourseCertificate } from './CourseCertificate';

interface CertificationCenterProps {
  onExit: () => void;
  onUpgrade?: () => void;
}

interface Certification {
  id: string;
  name: string;
  acronym: string;
  organization: string;
  description: string;
  level: 'beginner' | 'intermediate' | 'advanced' | 'professional';
  duration: string;
  sections: number;
  passingScore: number;
  cost: string;
  isPremium: boolean;
  isAvailable: boolean;
  examType: 'practice' | 'certification' | 'proficiency';
}

interface TestResult {
  id: string;
  certificationId: string;
  certificationName: string;
  dateTaken: string;
  score: number;
  totalQuestions: number;
  correctAnswers: number;
  passed: boolean;
  timeSpent: string;
  certificateIssued?: boolean;
}

interface Question {
  id: string;
  text: string;
  type: 'multiple-choice' | 'true-false' | 'video-response';
  options?: string[];
  correctAnswer: number;
  explanation: string;
}

// Real ASL Certification Programs
const certifications: Certification[] = [
  {
    id: 'aslpi',
    name: 'American Sign Language Proficiency Interview',
    acronym: 'ASLPI',
    organization: 'Gallaudet University',
    description: 'The ASLPI is a holistic language evaluation used to assess ASL proficiency. It measures how well a person can use ASL in real-world situations.',
    level: 'intermediate',
    duration: '20-30 min',
    sections: 1,
    passingScore: 70,
    cost: '$150',
    isPremium: true,
    isAvailable: true,
    examType: 'proficiency',
  },
  {
    id: 'slpi-asl',
    name: 'Sign Language Proficiency Interview: ASL',
    acronym: 'SLPI:ASL',
    organization: 'Language Testing International',
    description: 'A comprehensive proficiency test that evaluates your ability to communicate effectively in ASL across various contexts and situations.',
    level: 'intermediate',
    duration: '30-40 min',
    sections: 5,
    passingScore: 75,
    cost: '$195',
    isPremium: true,
    isAvailable: true,
    examType: 'proficiency',
  },
  {
    id: 'asl-foundations',
    name: 'ASL Foundations Certificate',
    acronym: 'ASL-F',
    organization: 'Sign Learn AR',
    description: 'A beginner-level certification that validates your foundational knowledge of ASL vocabulary, grammar, and basic conversational skills.',
    level: 'beginner',
    duration: '45 min',
    sections: 4,
    passingScore: 70,
    cost: 'Free',
    isPremium: false,
    isAvailable: true,
    examType: 'certification',
  },
  {
    id: 'nic',
    name: 'National Interpreter Certification',
    acronym: 'NIC',
    organization: 'RID (Registry of Interpreters for the Deaf)',
    description: 'The premier national certification for ASL interpreters. Tests interpretation and transliteration skills in both ASL and English.',
    level: 'professional',
    duration: '3-4 hours',
    sections: 3,
    passingScore: 80,
    cost: '$550',
    isPremium: true,
    isAvailable: false,
    examType: 'certification',
  },
  {
    id: 'asl-intermediate',
    name: 'ASL Intermediate Proficiency',
    acronym: 'ASL-I',
    organization: 'Sign Learn AR',
    description: 'Demonstrate intermediate-level proficiency in ASL conversation, storytelling, and comprehension of native signers.',
    level: 'intermediate',
    duration: '60 min',
    sections: 5,
    passingScore: 75,
    cost: 'Free',
    isPremium: false,
    isAvailable: true,
    examType: 'certification',
  },
  {
    id: 'asl-advanced',
    name: 'ASL Advanced Mastery',
    acronym: 'ASL-A',
    organization: 'Sign Learn AR',
    description: 'Advanced certification testing complex grammatical structures, classifiers, ASL poetry, and Deaf cultural knowledge.',
    level: 'advanced',
    duration: '90 min',
    sections: 6,
    passingScore: 80,
    cost: '$49',
    isPremium: true,
    isAvailable: true,
    examType: 'certification',
  },
  {
    id: 'bsl-level-1',
    name: 'British Sign Language Level 1',
    acronym: 'BSL-1',
    organization: 'Signature',
    description: 'Recognized qualification in British Sign Language covering basic communication and understanding of Deaf culture in the UK.',
    level: 'beginner',
    duration: '60 min',
    sections: 4,
    passingScore: 70,
    cost: '$85',
    isPremium: true,
    isAvailable: true,
    examType: 'certification',
  },
  {
    id: 'practice-basics',
    name: 'ASL Basics Practice Test',
    acronym: 'Practice',
    organization: 'Sign Learn AR',
    description: 'Free practice test covering alphabet, numbers, basic greetings, and common phrases. Perfect for beginners preparing for certification.',
    level: 'beginner',
    duration: '20 min',
    sections: 3,
    passingScore: 60,
    cost: 'Free',
    isPremium: false,
    isAvailable: true,
    examType: 'practice',
  },
];

// Sample practice test questions
const practiceQuestions: Question[] = [
  {
    id: 'q1',
    text: 'In ASL, which hand shape is used for the letter "A"?',
    type: 'multiple-choice',
    options: ['Closed fist with thumb on the side', 'Open palm facing forward', 'Index finger pointing up', 'Fist with thumb between index and middle finger'],
    correctAnswer: 0,
    explanation: 'The letter "A" in ASL is formed with a closed fist and the thumb resting against the side of the index finger.',
  },
  {
    id: 'q2',
    text: 'Facial expressions in ASL are purely emotional and not grammatical.',
    type: 'true-false',
    options: ['True', 'False'],
    correctAnswer: 1,
    explanation: 'False. Facial expressions in ASL serve critical grammatical functions, such as marking questions, conditionals, and intensity.',
  },
  {
    id: 'q3',
    text: 'What does the sign for "HELP" look like in ASL?',
    type: 'multiple-choice',
    options: [
      'One hand on top of another, moving upward',
      'Hands crossed at wrists',
      'Pointing at another person',
      'Waving hands in the air'
    ],
    correctAnswer: 0,
    explanation: 'The sign for HELP involves placing the dominant hand (in a fist or flat hand) on top of the non-dominant flat palm and moving both hands upward together.',
  },
  {
    id: 'q4',
    text: 'ASL has the same grammar structure as English.',
    type: 'true-false',
    options: ['True', 'False'],
    correctAnswer: 1,
    explanation: 'False. ASL has its own unique grammar structure that is completely different from English. It is a distinct language with its own syntax and rules.',
  },
  {
    id: 'q5',
    text: 'Which of the following is a key component of Deaf culture?',
    type: 'multiple-choice',
    options: [
      'Speaking is preferred over signing',
      'Visual and tactile communication',
      'Avoiding eye contact',
      'Oral communication only'
    ],
    correctAnswer: 1,
    explanation: 'Deaf culture emphasizes visual and tactile communication, including sign language, visual alerts, and physical touch for getting attention.',
  },
  {
    id: 'q6',
    text: 'The sign for "MOTHER" is made at which location?',
    type: 'multiple-choice',
    options: ['Forehead', 'Chin', 'Chest', 'Shoulder'],
    correctAnswer: 1,
    explanation: 'The sign for MOTHER is made at the chin with a "5" handshape, thumb touching the chin. This is part of the gender distinction in ASL family signs.',
  },
  {
    id: 'q7',
    text: 'Classifiers in ASL are used to represent people, objects, and movement.',
    type: 'true-false',
    options: ['True', 'False'],
    correctAnswer: 0,
    explanation: 'True. Classifiers are handshapes that represent specific objects, people, or concepts and show their location, movement, and relationship to other things.',
  },
  {
    id: 'q8',
    text: 'What is the correct way to get a Deaf person\'s attention?',
    type: 'multiple-choice',
    options: [
      'Shout loudly',
      'Wave in their line of sight or tap their shoulder gently',
      'Clap your hands',
      'Wait for them to notice you'
    ],
    correctAnswer: 1,
    explanation: 'In Deaf culture, it\'s appropriate to wave in someone\'s line of sight or gently tap their shoulder. Flashing lights is also common in group settings.',
  },
  {
    id: 'q9',
    text: 'The Deaf President Now (DPN) protest occurred at which university?',
    type: 'multiple-choice',
    options: ['Harvard University', 'Gallaudet University', 'MIT', 'Stanford University'],
    correctAnswer: 1,
    explanation: 'The DPN protest occurred at Gallaudet University in 1988, when students demanded the selection of a Deaf president for the first time in the university\'s history.',
  },
  {
    id: 'q10',
    text: 'In ASL, the sign for "FINISH" is commonly used to indicate past tense.',
    type: 'true-false',
    options: ['True', 'False'],
    correctAnswer: 0,
    explanation: 'True. While ASL doesn\'t have verb conjugations like English, the sign FINISH (or DONE) is often used after verbs to indicate completed actions in the past.',
  },
];

// Mock test results
const mockResults: TestResult[] = [
  {
    id: 'r1',
    certificationId: 'asl-foundations',
    certificationName: 'ASL Foundations Certificate',
    dateTaken: '2024-01-05',
    score: 85,
    totalQuestions: 50,
    correctAnswers: 42,
    passed: true,
    timeSpent: '38 min',
    certificateIssued: true,
  },
  {
    id: 'r2',
    certificationId: 'practice-basics',
    certificationName: 'ASL Basics Practice Test',
    dateTaken: '2023-12-28',
    score: 90,
    totalQuestions: 30,
    correctAnswers: 27,
    passed: true,
    timeSpent: '18 min',
    certificateIssued: false,
  },
  {
    id: 'r3',
    certificationId: 'asl-intermediate',
    certificationName: 'ASL Intermediate Proficiency',
    dateTaken: '2023-12-15',
    score: 68,
    totalQuestions: 60,
    correctAnswers: 41,
    passed: false,
    timeSpent: '55 min',
    certificateIssued: false,
  },
];

type ViewMode = 'overview' | 'exam-list' | 'test-taking' | 'results' | 'history' | 'certificate' | 'schedule' | 'my-certificates';

export function CertificationCenter({ onExit, onUpgrade }: CertificationCenterProps) {
  const { theme } = useTheme();
  const { userProgress } = useApp();
  const [viewMode, setViewMode] = useState<ViewMode>('overview');
  const [selectedCertification, setSelectedCertification] = useState<Certification | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, number>>({});
  const [showExplanation, setShowExplanation] = useState(false);
  const [testResults, setTestResults] = useState<TestResult[]>(mockResults);
  const [selectedResult, setSelectedResult] = useState<TestResult | null>(null);
  const [filterLevel, setFilterLevel] = useState<string>('all');

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
        successBg: 'rgba(34, 197, 94, 0.1)',
        successColor: '#22C55E',
        errorBg: 'rgba(239, 68, 68, 0.1)',
        errorColor: '#EF4444',
        warningBg: 'rgba(251, 191, 36, 0.1)',
        warningColor: '#FBD500',
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
        successBg: 'rgba(34, 197, 94, 0.1)',
        successColor: '#22C55E',
        errorBg: 'rgba(239, 68, 68, 0.1)',
        errorColor: '#EF4444',
        warningBg: 'rgba(251, 191, 36, 0.1)',
        warningColor: '#F59E0B',
        blur: 'blur(20px)',
        shadow: '0 8px 32px rgba(31, 38, 135, 0.15)',
        glassBorder: '1px solid rgba(255, 255, 255, 0.6)',
      };

  const handleStartTest = (cert: Certification) => {
    if (cert.isPremium && !userProgress.isPremium) {
      if (onUpgrade) {
        onUpgrade();
      }
      return;
    }

    if (!cert.isAvailable) {
      return;
    }

    setSelectedCertification(cert);
    setCurrentQuestionIndex(0);
    setSelectedAnswers({});
    setShowExplanation(false);
    setViewMode('test-taking');
  };

  const handleAnswerSelect = (questionId: string, answerIndex: number) => {
    setSelectedAnswers(prev => ({ ...prev, [questionId]: answerIndex }));
    setShowExplanation(false);
  };

  const handleCheckAnswer = () => {
    setShowExplanation(true);
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < practiceQuestions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setShowExplanation(false);
    } else {
      handleFinishTest();
    }
  };

  const handleFinishTest = () => {
    const correctCount = practiceQuestions.filter((q, idx) => 
      selectedAnswers[q.id] === q.correctAnswer
    ).length;
    
    const score = Math.round((correctCount / practiceQuestions.length) * 100);
    const passed = score >= (selectedCertification?.passingScore || 70);

    const newResult: TestResult = {
      id: `r${testResults.length + 1}`,
      certificationId: selectedCertification?.id || 'unknown',
      certificationName: selectedCertification?.name || 'Unknown',
      dateTaken: new Date().toISOString().split('T')[0],
      score,
      totalQuestions: practiceQuestions.length,
      correctAnswers: correctCount,
      passed,
      timeSpent: '20 min',
      certificateIssued: passed && selectedCertification?.examType === 'certification',
    };

    setTestResults([newResult, ...testResults]);
    setSelectedResult(newResult);
    setViewMode('results');
  };

  const handleViewCertificate = (result: TestResult) => {
    setSelectedResult(result);
    setViewMode('certificate');
  };

  const handleScheduleExam = (cert: Certification) => {
    if (cert.isPremium && !userProgress.isPremium) {
      if (onUpgrade) {
        onUpgrade();
      }
      return;
    }
    setSelectedCertification(cert);
    setViewMode('schedule');
  };

  const filteredCertifications = filterLevel === 'all' 
    ? certifications 
    : certifications.filter(c => c.level === filterLevel);

  // My Certificates View
  if (viewMode === 'my-certificates') {
    return <CourseCertificate onExit={() => setViewMode('overview')} />;
  }

  // Overview Screen
  if (viewMode === 'overview') {
    return (
      <div 
        className="h-full flex flex-col"
        style={{ background: colors.bg, color: colors.textPrimary }}
        role="main"
        aria-labelledby="certification-title"
      >
        {/* Header */}
        <div 
          className="p-4 sm:p-6 border-b"
          style={{ borderBottomColor: colors.border }}
        >
          <div className="flex items-center gap-3 mb-2">
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
                id="certification-title" 
                className="text-xl sm:text-2xl font-bold"
                style={{ fontFamily: 'Poppins, sans-serif' }}
              >
                Certification Center
              </h1>
              <p className="text-sm" style={{ color: colors.textSecondary }}>
                Validate your skills with official certifications
              </p>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="p-4 sm:p-6">
          <div className="grid grid-cols-3 gap-3 mb-6">
            <motion.div
              className="rounded-xl p-4 text-center"
              style={{
                background: colors.cardBg,
                backdropFilter: colors.blur,
                WebkitBackdropFilter: colors.blur,
                border: colors.glassBorder,
                boxShadow: colors.shadow,
              }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <Trophy className="w-6 h-6 mx-auto mb-2" style={{ color: colors.warningColor }} aria-hidden="true" />
              <div className="text-2xl font-bold mb-1" style={{ color: colors.textPrimary }}>
                {testResults.filter(r => r.passed).length}
              </div>
              <div className="text-xs" style={{ color: colors.textSecondary }}>Passed</div>
            </motion.div>

            <motion.div
              className="rounded-xl p-4 text-center"
              style={{
                background: colors.cardBg,
                backdropFilter: colors.blur,
                WebkitBackdropFilter: colors.blur,
                border: colors.glassBorder,
                boxShadow: colors.shadow,
              }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Target className="w-6 h-6 mx-auto mb-2" style={{ color: colors.iconColor }} aria-hidden="true" />
              <div className="text-2xl font-bold mb-1" style={{ color: colors.textPrimary }}>
                {testResults.length}
              </div>
              <div className="text-xs" style={{ color: colors.textSecondary }}>Attempts</div>
            </motion.div>

            <motion.div
              className="rounded-xl p-4 text-center"
              style={{
                background: colors.cardBg,
                backdropFilter: colors.blur,
                WebkitBackdropFilter: colors.blur,
                border: colors.glassBorder,
                boxShadow: colors.shadow,
              }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Award className="w-6 h-6 mx-auto mb-2" style={{ color: colors.successColor }} aria-hidden="true" />
              <div className="text-2xl font-bold mb-1" style={{ color: colors.textPrimary }}>
                {testResults.filter(r => r.certificateIssued).length}
              </div>
              <div className="text-xs" style={{ color: colors.textSecondary }}>Certificates</div>
            </motion.div>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-2 gap-3 mb-6">
            <Button
              onClick={() => setViewMode('exam-list')}
              className="h-auto py-4 px-4 rounded-xl flex flex-col items-center gap-2"
              style={{
                background: colors.iconColor,
                color: theme === 'dark' ? 'var(--color-bg-deep)' : '#FFFFFF',
              }}
              aria-label="Browse available exams"
            >
              <BookOpen className="w-6 h-6" aria-hidden="true" />
              <span className="text-sm font-semibold">Browse Exams</span>
            </Button>

            <Button
              onClick={() => setViewMode('my-certificates')}
              className="h-auto py-4 px-4 rounded-xl flex flex-col items-center gap-2"
              style={{
                background: 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)',
                color: '#FFFFFF',
              }}
              aria-label="View my certificates"
            >
              <Award className="w-6 h-6" aria-hidden="true" />
              <span className="text-sm font-semibold">My Certificates</span>
            </Button>
          </div>

          <div className="grid grid-cols-1 gap-3 mb-6">
            <Button
              onClick={() => setViewMode('history')}
              className="h-auto py-4 px-4 rounded-xl flex flex-col items-center gap-2"
              style={{
                background: colors.cardBg,
                color: colors.textPrimary,
                border: colors.glassBorder,
              }}
              aria-label="View results history"
            >
              <BarChart3 className="w-6 h-6" aria-hidden="true" />
              <span className="text-sm font-semibold">View History</span>
            </Button>
          </div>

          {/* Recent Results */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-lg font-semibold">Recent Results</h2>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setViewMode('history')}
                style={{ color: colors.iconColor }}
                aria-label="See all results"
              >
                See All
              </Button>
            </div>

            <div className="space-y-3">
              {testResults.slice(0, 3).map((result, index) => (
                <motion.button
                  key={result.id}
                  onClick={() => {
                    setSelectedResult(result);
                    if (result.certificateIssued) {
                      setViewMode('certificate');
                    } else {
                      setViewMode('results');
                    }
                  }}
                  className="w-full rounded-xl p-4 text-left transition-colors"
                  style={{
                    background: colors.cardBg,
                    backdropFilter: colors.blur,
                    WebkitBackdropFilter: colors.blur,
                    border: colors.glassBorder,
                    boxShadow: colors.shadow,
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.background = colors.cardHover}
                  onMouseLeave={(e) => e.currentTarget.style.background = colors.cardBg}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  aria-label={`${result.certificationName}. Score: ${result.score}%. ${result.passed ? 'Passed' : 'Failed'}`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold text-sm" style={{ color: colors.textPrimary }}>
                          {result.certificationName}
                        </h3>
                        {result.certificateIssued && (
                          <Award className="w-4 h-4 flex-shrink-0" style={{ color: colors.warningColor }} aria-label="Certificate issued" />
                        )}
                      </div>
                      <div className="flex items-center gap-3 text-xs" style={{ color: colors.textTertiary }}>
                        <span>{new Date(result.dateTaken).toLocaleDateString()}</span>
                        <span>•</span>
                        <span>{result.score}%</span>
                      </div>
                    </div>
                    <div 
                      className="flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold"
                      style={{
                        background: result.passed ? colors.successBg : colors.errorBg,
                        color: result.passed ? colors.successColor : colors.errorColor,
                      }}
                    >
                      {result.passed ? (
                        <>
                          <CheckCircle className="w-3 h-3" aria-hidden="true" />
                          Passed
                        </>
                      ) : (
                        <>
                          <XCircle className="w-3 h-3" aria-hidden="true" />
                          Failed
                        </>
                      )}
                    </div>
                  </div>
                </motion.button>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Exam List Screen
  if (viewMode === 'exam-list') {
    return (
      <div 
        className="h-full flex flex-col"
        style={{ background: colors.bg, color: colors.textPrimary }}
        role="main"
        aria-labelledby="exam-list-title"
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
              onClick={() => setViewMode('overview')}
              style={{ color: colors.textSecondary }}
              aria-label="Go back to overview"
            >
              <X className="w-6 h-6" />
            </Button>
            <div className="flex-1 min-w-0">
              <h1 
                id="exam-list-title" 
                className="text-xl sm:text-2xl font-bold"
                style={{ fontFamily: 'Poppins, sans-serif' }}
              >
                Available Exams
              </h1>
              <p className="text-sm" style={{ color: colors.textSecondary }}>
                {filteredCertifications.length} certifications available
              </p>
            </div>
          </div>

          {/* Filters */}
          <div className="flex flex-wrap gap-2" role="group" aria-label="Filter by certification level">
            {[
              { id: 'all', label: 'All Levels' },
              { id: 'beginner', label: 'Beginner' },
              { id: 'intermediate', label: 'Intermediate' },
              { id: 'advanced', label: 'Advanced' },
              { id: 'professional', label: 'Professional' },
            ].map((level) => (
              <button
                key={level.id}
                onClick={() => setFilterLevel(level.id)}
                className="px-3 py-1.5 rounded-full text-sm font-medium transition-all"
                style={{
                  background: filterLevel === level.id ? colors.iconColor : colors.cardBg,
                  color: filterLevel === level.id 
                    ? (theme === 'dark' ? 'var(--color-bg-deep)' : '#FFFFFF')
                    : colors.textPrimary,
                  border: colors.glassBorder,
                }}
                aria-pressed={filterLevel === level.id}
              >
                {level.label}
              </button>
            ))}
          </div>
        </div>

        {/* Certifications List */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6">
          <div className="space-y-4">
            {filteredCertifications.map((cert, index) => (
              <motion.div
                key={cert.id}
                className="rounded-xl overflow-hidden"
                style={{
                  background: colors.cardBg,
                  backdropFilter: colors.blur,
                  WebkitBackdropFilter: colors.blur,
                  border: colors.glassBorder,
                  boxShadow: colors.shadow,
                }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <div className="p-4">
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <h3 className="font-bold text-base" style={{ color: colors.textPrimary }}>
                          {cert.acronym}
                        </h3>
                        <span 
                          className="px-2 py-0.5 rounded-full text-xs font-semibold capitalize"
                          style={{
                            background: colors.iconBg,
                            color: colors.iconColor,
                          }}
                        >
                          {cert.level}
                        </span>
                        {cert.isPremium && (
                          <Crown className="w-4 h-4" style={{ color: colors.warningColor }} aria-label="Premium certification" />
                        )}
                      </div>
                      <p className="text-sm font-medium mb-1" style={{ color: colors.textPrimary }}>
                        {cert.name}
                      </p>
                      <p className="text-xs mb-2" style={{ color: colors.textTertiary }}>
                        {cert.organization}
                      </p>
                    </div>
                  </div>

                  <p className="text-sm leading-relaxed mb-3" style={{ color: colors.textSecondary }}>
                    {cert.description}
                  </p>

                  <div className="grid grid-cols-2 gap-2 mb-3 text-xs" style={{ color: colors.textTertiary }}>
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" aria-hidden="true" />
                      <span>{cert.duration}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <BookOpen className="w-4 h-4" aria-hidden="true" />
                      <span>{cert.sections} sections</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Target className="w-4 h-4" aria-hidden="true" />
                      <span>{cert.passingScore}% to pass</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Award className="w-4 h-4" aria-hidden="true" />
                      <span>{cert.cost}</span>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    {cert.isAvailable ? (
                      <>
                        <Button
                          onClick={() => handleStartTest(cert)}
                          className="flex-1 h-10 rounded-full font-semibold"
                          style={{
                            background: colors.iconColor,
                            color: theme === 'dark' ? 'var(--color-bg-deep)' : '#FFFFFF',
                          }}
                          aria-label={`Start ${cert.name} ${cert.examType === 'practice' ? 'practice test' : 'exam'}`}
                        >
                          <Play className="w-4 h-4 mr-2" aria-hidden="true" />
                          {cert.examType === 'practice' ? 'Start Practice' : 'Start Exam'}
                        </Button>
                        {cert.examType === 'proficiency' && (
                          <Button
                            onClick={() => handleScheduleExam(cert)}
                            className="h-10 px-4 rounded-full font-semibold"
                            style={{
                              background: colors.cardBg,
                              color: colors.textPrimary,
                              border: colors.glassBorder,
                            }}
                            aria-label={`Schedule ${cert.name}`}
                          >
                            <Calendar className="w-4 h-4" aria-hidden="true" />
                          </Button>
                        )}
                      </>
                    ) : (
                      <Button
                        disabled
                        className="flex-1 h-10 rounded-full font-semibold opacity-50"
                        style={{
                          background: colors.cardBg,
                          color: colors.textSecondary,
                          border: colors.glassBorder,
                        }}
                        aria-label={`${cert.name} - Coming soon`}
                      >
                        Coming Soon
                      </Button>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Test Taking Screen
  if (viewMode === 'test-taking' && selectedCertification) {
    const currentQuestion = practiceQuestions[currentQuestionIndex];
    const selectedAnswer = selectedAnswers[currentQuestion.id];
    const isCorrect = selectedAnswer === currentQuestion.correctAnswer;

    return (
      <div 
        className="h-full flex flex-col"
        style={{ background: colors.bg, color: colors.textPrimary }}
        role="main"
        aria-labelledby="test-title"
      >
        {/* Header */}
        <div 
          className="p-4 sm:p-6 border-b"
          style={{ borderBottomColor: colors.border }}
        >
          <div className="flex items-center gap-3 mb-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setViewMode('exam-list')}
              style={{ color: colors.textSecondary }}
              aria-label="Exit test"
            >
              <X className="w-6 h-6" />
            </Button>
            <div className="flex-1 min-w-0">
              <h1 
                id="test-title" 
                className="text-lg font-bold"
                style={{ fontFamily: 'Poppins, sans-serif' }}
              >
                {selectedCertification.name}
              </h1>
              <p className="text-sm" style={{ color: colors.textSecondary }}>
                Question {currentQuestionIndex + 1} of {practiceQuestions.length}
              </p>
            </div>
          </div>

          {/* Progress Bar */}
          <div 
            className="h-2 rounded-full overflow-hidden"
            style={{ background: colors.cardBg }}
            role="progressbar"
            aria-valuenow={((currentQuestionIndex + 1) / practiceQuestions.length) * 100}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label="Test progress"
          >
            <motion.div
              className="h-full"
              style={{ background: colors.iconColor }}
              initial={{ width: 0 }}
              animate={{ width: `${((currentQuestionIndex + 1) / practiceQuestions.length) * 100}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </div>

        {/* Question Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6">
          <motion.div
            key={currentQuestion.id}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            {/* Question */}
            <div 
              className="rounded-xl p-6 mb-6"
              style={{
                background: colors.cardBg,
                backdropFilter: colors.blur,
                WebkitBackdropFilter: colors.blur,
                border: colors.glassBorder,
                boxShadow: colors.shadow,
              }}
            >
              <h2 className="text-lg font-semibold leading-relaxed" style={{ color: colors.textPrimary }}>
                {currentQuestion.text}
              </h2>
            </div>

            {/* Answer Options */}
            <div className="space-y-3 mb-6" role="radiogroup" aria-labelledby="test-title">
              {currentQuestion.options?.map((option, index) => {
                const isSelected = selectedAnswer === index;
                const showResult = showExplanation;
                const isThisCorrect = index === currentQuestion.correctAnswer;

                return (
                  <button
                    key={index}
                    onClick={() => !showExplanation && handleAnswerSelect(currentQuestion.id, index)}
                    disabled={showExplanation}
                    className="w-full rounded-xl p-4 text-left transition-all"
                    style={{
                      background: showResult
                        ? isThisCorrect
                          ? colors.successBg
                          : isSelected
                          ? colors.errorBg
                          : colors.cardBg
                        : isSelected
                        ? colors.iconBg
                        : colors.cardBg,
                      backdropFilter: colors.blur,
                      WebkitBackdropFilter: colors.blur,
                      border: showResult
                        ? isThisCorrect
                          ? `2px solid ${colors.successColor}`
                          : isSelected
                          ? `2px solid ${colors.errorColor}`
                          : colors.glassBorder
                        : isSelected
                        ? `2px solid ${colors.iconColor}`
                        : colors.glassBorder,
                      boxShadow: colors.shadow,
                    }}
                    role="radio"
                    aria-checked={isSelected}
                    aria-label={`Option ${index + 1}: ${option}`}
                  >
                    <div className="flex items-center gap-3">
                      <div 
                        className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 font-semibold text-sm"
                        style={{
                          background: showResult
                            ? isThisCorrect
                              ? colors.successColor
                              : isSelected
                              ? colors.errorColor
                              : colors.iconBg
                            : isSelected
                            ? colors.iconColor
                            : colors.iconBg,
                          color: showResult && (isThisCorrect || isSelected)
                            ? '#FFFFFF'
                            : isSelected
                            ? (theme === 'dark' ? 'var(--color-bg-deep)' : '#FFFFFF')
                            : colors.textTertiary,
                        }}
                        aria-hidden="true"
                      >
                        {String.fromCharCode(65 + index)}
                      </div>
                      <span className="flex-1" style={{ color: colors.textPrimary }}>
                        {option}
                      </span>
                      {showResult && isThisCorrect && (
                        <CheckCircle className="w-5 h-5 flex-shrink-0" style={{ color: colors.successColor }} aria-label="Correct answer" />
                      )}
                      {showResult && isSelected && !isThisCorrect && (
                        <XCircle className="w-5 h-5 flex-shrink-0" style={{ color: colors.errorColor }} aria-label="Incorrect answer" />
                      )}
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Explanation */}
            <AnimatePresence>
              {showExplanation && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="rounded-xl p-4 mb-6"
                  style={{
                    background: isCorrect ? colors.successBg : colors.errorBg,
                    border: `1px solid ${isCorrect ? colors.successColor : colors.errorColor}`,
                  }}
                  role="status"
                  aria-live="polite"
                >
                  <div className="flex items-start gap-3">
                    {isCorrect ? (
                      <CheckCircle className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: colors.successColor }} aria-hidden="true" />
                    ) : (
                      <XCircle className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: colors.errorColor }} aria-hidden="true" />
                    )}
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold mb-1" style={{ color: isCorrect ? colors.successColor : colors.errorColor }}>
                        {isCorrect ? 'Correct!' : 'Incorrect'}
                      </div>
                      <p className="text-sm leading-relaxed" style={{ color: colors.textSecondary }}>
                        {currentQuestion.explanation}
                      </p>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>

        {/* Action Buttons */}
        <div 
          className="p-4 sm:p-6 border-t"
          style={{ borderTopColor: colors.border }}
        >
          {!showExplanation ? (
            <Button
              onClick={handleCheckAnswer}
              disabled={selectedAnswer === undefined}
              className="w-full h-12 rounded-full font-semibold text-base"
              style={{
                background: selectedAnswer !== undefined ? colors.iconColor : colors.cardBg,
                color: selectedAnswer !== undefined 
                  ? (theme === 'dark' ? 'var(--color-bg-deep)' : '#FFFFFF')
                  : colors.textTertiary,
              }}
              aria-label="Check answer"
            >
              Check Answer
            </Button>
          ) : (
            <Button
              onClick={handleNextQuestion}
              className="w-full h-12 rounded-full font-semibold text-base"
              style={{
                background: colors.iconColor,
                color: theme === 'dark' ? 'var(--color-bg-deep)' : '#FFFFFF',
              }}
              aria-label={currentQuestionIndex < practiceQuestions.length - 1 ? 'Next question' : 'Finish test'}
            >
              {currentQuestionIndex < practiceQuestions.length - 1 ? 'Next Question' : 'Finish Test'}
              <ChevronRight className="w-5 h-5 ml-2" aria-hidden="true" />
            </Button>
          )}
        </div>
      </div>
    );
  }

  // Results Screen
  if (viewMode === 'results' && selectedResult) {
    return (
      <div 
        className="h-full flex flex-col"
        style={{ background: colors.bg, color: colors.textPrimary }}
        role="main"
        aria-labelledby="results-title"
      >
        {/* Header */}
        <div 
          className="p-4 sm:p-6 border-b"
          style={{ borderBottomColor: colors.border }}
        >
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setViewMode('overview')}
              style={{ color: colors.textSecondary }}
              aria-label="Go back to overview"
            >
              <X className="w-6 h-6" />
            </Button>
            <h1 
              id="results-title" 
              className="text-xl sm:text-2xl font-bold"
              style={{ fontFamily: 'Poppins, sans-serif' }}
            >
              Test Results
            </h1>
          </div>
        </div>

        {/* Results Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6">
          {/* Score Display */}
          <motion.div
            className="rounded-2xl p-8 mb-6 text-center"
            style={{
              background: selectedResult.passed 
                ? `linear-gradient(135deg, ${colors.successColor}20, ${colors.iconColor}20)`
                : `linear-gradient(135deg, ${colors.errorColor}20, ${colors.warningColor}20)`,
              border: colors.glassBorder,
            }}
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <div className="mb-4">
              {selectedResult.passed ? (
                <Trophy className="w-16 h-16 mx-auto" style={{ color: colors.warningColor }} aria-hidden="true" />
              ) : (
                <Target className="w-16 h-16 mx-auto" style={{ color: colors.errorColor }} aria-hidden="true" />
              )}
            </div>
            <div className="text-5xl font-bold mb-2" style={{ color: colors.textPrimary }}>
              {selectedResult.score}%
            </div>
            <div 
              className="text-lg font-semibold mb-2"
              style={{ color: selectedResult.passed ? colors.successColor : colors.errorColor }}
            >
              {selectedResult.passed ? 'Congratulations! You Passed!' : 'Keep Practicing!'}
            </div>
            <p className="text-sm" style={{ color: colors.textSecondary }}>
              {selectedResult.certificationName}
            </p>
          </motion.div>

          {/* Detailed Stats */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div 
              className="rounded-xl p-4 text-center"
              style={{
                background: colors.cardBg,
                backdropFilter: colors.blur,
                WebkitBackdropFilter: colors.blur,
                border: colors.glassBorder,
                boxShadow: colors.shadow,
              }}
            >
              <CheckCircle className="w-6 h-6 mx-auto mb-2" style={{ color: colors.successColor }} aria-hidden="true" />
              <div className="text-2xl font-bold mb-1" style={{ color: colors.textPrimary }}>
                {selectedResult.correctAnswers}/{selectedResult.totalQuestions}
              </div>
              <div className="text-xs" style={{ color: colors.textSecondary }}>Correct Answers</div>
            </div>

            <div 
              className="rounded-xl p-4 text-center"
              style={{
                background: colors.cardBg,
                backdropFilter: colors.blur,
                WebkitBackdropFilter: colors.blur,
                border: colors.glassBorder,
                boxShadow: colors.shadow,
              }}
            >
              <Clock className="w-6 h-6 mx-auto mb-2" style={{ color: colors.iconColor }} aria-hidden="true" />
              <div className="text-2xl font-bold mb-1" style={{ color: colors.textPrimary }}>
                {selectedResult.timeSpent}
              </div>
              <div className="text-xs" style={{ color: colors.textSecondary }}>Time Spent</div>
            </div>
          </div>

          {/* Certificate Issued */}
          {selectedResult.certificateIssued && (
            <motion.div
              className="rounded-xl p-4 mb-6"
              style={{
                background: colors.warningBg,
                border: `1px solid ${colors.warningColor}`,
              }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <div className="flex items-center gap-3">
                <Award className="w-6 h-6 flex-shrink-0" style={{ color: colors.warningColor }} aria-hidden="true" />
                <div className="flex-1 min-w-0">
                  <div className="font-semibold mb-1" style={{ color: colors.textPrimary }}>
                    Certificate Available!
                  </div>
                  <p className="text-sm" style={{ color: colors.textSecondary }}>
                    Your official certificate has been issued and is ready to download.
                  </p>
                </div>
              </div>
            </motion.div>
          )}

          {/* Actions */}
          <div className="space-y-3">
            {selectedResult.certificateIssued && (
              <Button
                onClick={() => handleViewCertificate(selectedResult)}
                className="w-full h-12 rounded-full font-semibold"
                style={{
                  background: colors.iconColor,
                  color: theme === 'dark' ? 'var(--color-bg-deep)' : '#FFFFFF',
                }}
                aria-label="View certificate"
              >
                <Award className="w-5 h-5 mr-2" aria-hidden="true" />
                View Certificate
              </Button>
            )}

            <Button
              onClick={() => {
                const cert = certifications.find(c => c.id === selectedResult.certificationId);
                if (cert) {
                  handleStartTest(cert);
                }
              }}
              className="w-full h-12 rounded-full font-semibold"
              style={{
                background: colors.cardBg,
                color: colors.textPrimary,
                border: colors.glassBorder,
              }}
              aria-label="Retake test"
            >
              Retake Test
            </Button>

            <Button
              onClick={() => setViewMode('overview')}
              className="w-full h-12 rounded-full font-semibold"
              style={{
                background: colors.cardBg,
                color: colors.textPrimary,
                border: colors.glassBorder,
              }}
              aria-label="Back to overview"
            >
              Back to Overview
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Certificate Display Screen
  if (viewMode === 'certificate' && selectedResult?.certificateIssued) {
    return (
      <div 
        className="h-full flex flex-col"
        style={{ background: colors.bg, color: colors.textPrimary }}
        role="main"
        aria-labelledby="certificate-title"
      >
        {/* Header */}
        <div 
          className="p-4 sm:p-6 border-b"
          style={{ borderBottomColor: colors.border }}
        >
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setViewMode('overview')}
              style={{ color: colors.textSecondary }}
              aria-label="Go back to overview"
            >
              <X className="w-6 h-6" />
            </Button>
            <h1 
              id="certificate-title" 
              className="text-xl sm:text-2xl font-bold"
              style={{ fontFamily: 'Poppins, sans-serif' }}
            >
              Your Certificate
            </h1>
          </div>
        </div>

        {/* Certificate Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6">
          <motion.div
            className="rounded-2xl p-8 mb-6 relative overflow-hidden"
            style={{
              background: `linear-gradient(135deg, ${colors.cardBg}, ${colors.iconBg})`,
              backdropFilter: colors.blur,
              WebkitBackdropFilter: colors.blur,
              border: `2px solid ${colors.warningColor}`,
              boxShadow: `0 0 40px ${colors.warningColor}40`,
            }}
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            {/* Decorative Corner Elements */}
            <div 
              className="absolute top-4 left-4 w-12 h-12 border-l-4 border-t-4 rounded-tl-lg"
              style={{ borderColor: colors.warningColor }}
              aria-hidden="true"
            />
            <div 
              className="absolute top-4 right-4 w-12 h-12 border-r-4 border-t-4 rounded-tr-lg"
              style={{ borderColor: colors.warningColor }}
              aria-hidden="true"
            />
            <div 
              className="absolute bottom-4 left-4 w-12 h-12 border-l-4 border-b-4 rounded-bl-lg"
              style={{ borderColor: colors.warningColor }}
              aria-hidden="true"
            />
            <div 
              className="absolute bottom-4 right-4 w-12 h-12 border-r-4 border-b-4 rounded-br-lg"
              style={{ borderColor: colors.warningColor }}
              aria-hidden="true"
            />

            {/* Certificate Content */}
            <div className="text-center relative z-10">
              <Award className="w-16 h-16 mx-auto mb-4" style={{ color: colors.warningColor }} aria-hidden="true" />
              
              <div className="text-sm font-semibold mb-2" style={{ color: colors.textSecondary }}>
                CERTIFICATE OF COMPLETION
              </div>

              <h2 
                className="text-2xl sm:text-3xl font-bold mb-6"
                style={{ color: colors.textPrimary, fontFamily: 'Poppins, sans-serif' }}
              >
                {selectedResult.certificationName}
              </h2>

              <div className="mb-6">
                <p className="text-sm mb-2" style={{ color: colors.textSecondary }}>
                  This certificate is awarded to
                </p>
                <p className="text-xl font-bold mb-4" style={{ color: colors.textPrimary }}>
                  ASL Learner
                </p>
                <p className="text-sm" style={{ color: colors.textSecondary }}>
                  For successfully completing the {selectedResult.certificationName} with a score of
                </p>
                <p className="text-3xl font-bold my-3" style={{ color: colors.warningColor }}>
                  {selectedResult.score}%
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4 max-w-md mx-auto mb-6 text-sm">
                <div>
                  <div className="font-semibold mb-1" style={{ color: colors.textTertiary }}>
                    Date Issued
                  </div>
                  <div style={{ color: colors.textPrimary }}>
                    {new Date(selectedResult.dateTaken).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </div>
                </div>
                <div>
                  <div className="font-semibold mb-1" style={{ color: colors.textTertiary }}>
                    Certificate ID
                  </div>
                  <div style={{ color: colors.textPrimary }} className="font-mono">
                    {selectedResult.id.toUpperCase()}-2024
                  </div>
                </div>
              </div>

              <div className="pt-6 border-t" style={{ borderColor: colors.border }}>
                <div className="text-xs" style={{ color: colors.textTertiary }}>
                  Sign Learn AR Certification Program
                </div>
              </div>
            </div>
          </motion.div>

          {/* Action Buttons */}
          <div className="grid grid-cols-2 gap-3">
            <Button
              onClick={() => {
                // Simulate download
                alert('Certificate downloaded successfully!');
              }}
              className="h-12 rounded-full font-semibold"
              style={{
                background: colors.iconColor,
                color: theme === 'dark' ? 'var(--color-bg-deep)' : '#FFFFFF',
              }}
              aria-label="Download certificate"
            >
              <Download className="w-5 h-5 mr-2" aria-hidden="true" />
              Download
            </Button>

            <Button
              onClick={() => {
                // Simulate share
                if (navigator.share) {
                  navigator.share({
                    title: 'My ASL Certificate',
                    text: `I earned my ${selectedResult.certificationName} with a score of ${selectedResult.score}%!`,
                  });
                } else {
                  alert('Share functionality coming soon!');
                }
              }}
              className="h-12 rounded-full font-semibold"
              style={{
                background: colors.cardBg,
                color: colors.textPrimary,
                border: colors.glassBorder,
              }}
              aria-label="Share certificate"
            >
              <Share2 className="w-5 h-5 mr-2" aria-hidden="true" />
              Share
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Results History Screen
  if (viewMode === 'history') {
    return (
      <div 
        className="h-full flex flex-col"
        style={{ background: colors.bg, color: colors.textPrimary }}
        role="main"
        aria-labelledby="history-title"
      >
        {/* Header */}
        <div 
          className="p-4 sm:p-6 border-b"
          style={{ borderBottomColor: colors.border }}
        >
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setViewMode('overview')}
              style={{ color: colors.textSecondary }}
              aria-label="Go back to overview"
            >
              <X className="w-6 h-6" />
            </Button>
            <div className="flex-1 min-w-0">
              <h1 
                id="history-title" 
                className="text-xl sm:text-2xl font-bold"
                style={{ fontFamily: 'Poppins, sans-serif' }}
              >
                Results History
              </h1>
              <p className="text-sm" style={{ color: colors.textSecondary }}>
                {testResults.length} total attempts
              </p>
            </div>
          </div>
        </div>

        {/* History List */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6">
          <div className="space-y-3">
            {testResults.map((result, index) => (
              <motion.button
                key={result.id}
                onClick={() => {
                  setSelectedResult(result);
                  if (result.certificateIssued) {
                    setViewMode('certificate');
                  } else {
                    setViewMode('results');
                  }
                }}
                className="w-full rounded-xl p-4 text-left transition-colors"
                style={{
                  background: colors.cardBg,
                  backdropFilter: colors.blur,
                  WebkitBackdropFilter: colors.blur,
                  border: colors.glassBorder,
                  boxShadow: colors.shadow,
                }}
                onMouseEnter={(e) => e.currentTarget.style.background = colors.cardHover}
                onMouseLeave={(e) => e.currentTarget.style.background = colors.cardBg}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                aria-label={`${result.certificationName}. Score: ${result.score}%. ${result.passed ? 'Passed' : 'Failed'}. Taken on ${new Date(result.dateTaken).toLocaleDateString()}`}
              >
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold" style={{ color: colors.textPrimary }}>
                        {result.certificationName}
                      </h3>
                      {result.certificateIssued && (
                        <Award className="w-4 h-4 flex-shrink-0" style={{ color: colors.warningColor }} aria-label="Certificate issued" />
                      )}
                    </div>
                    <div className="flex items-center gap-2 text-xs" style={{ color: colors.textTertiary }}>
                      <Calendar className="w-3 h-3" aria-hidden="true" />
                      <span>{new Date(result.dateTaken).toLocaleDateString()}</span>
                    </div>
                  </div>
                  <div 
                    className="flex items-center gap-1 px-3 py-1.5 rounded-full text-sm font-semibold"
                    style={{
                      background: result.passed ? colors.successBg : colors.errorBg,
                      color: result.passed ? colors.successColor : colors.errorColor,
                    }}
                  >
                    {result.passed ? (
                      <>
                        <CheckCircle className="w-4 h-4" aria-hidden="true" />
                        Passed
                      </>
                    ) : (
                      <>
                        <XCircle className="w-4 h-4" aria-hidden="true" />
                        Failed
                      </>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <div className="text-xs mb-1" style={{ color: colors.textTertiary }}>Score</div>
                    <div className="text-lg font-bold" style={{ color: colors.textPrimary }}>
                      {result.score}%
                    </div>
                  </div>
                  <div>
                    <div className="text-xs mb-1" style={{ color: colors.textTertiary }}>Correct</div>
                    <div className="text-lg font-bold" style={{ color: colors.textPrimary }}>
                      {result.correctAnswers}/{result.totalQuestions}
                    </div>
                  </div>
                  <div>
                    <div className="text-xs mb-1" style={{ color: colors.textTertiary }}>Time</div>
                    <div className="text-lg font-bold" style={{ color: colors.textPrimary }}>
                      {result.timeSpent}
                    </div>
                  </div>
                </div>

                <div className="mt-3 flex items-center justify-end">
                  <ChevronRight className="w-5 h-5" style={{ color: colors.iconColor }} aria-hidden="true" />
                </div>
              </motion.button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Schedule Exam Screen
  if (viewMode === 'schedule' && selectedCertification) {
    return (
      <div 
        className="h-full flex flex-col"
        style={{ background: colors.bg, color: colors.textPrimary }}
        role="main"
        aria-labelledby="schedule-title"
      >
        {/* Header */}
        <div 
          className="p-4 sm:p-6 border-b"
          style={{ borderBottomColor: colors.border }}
        >
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setViewMode('exam-list')}
              style={{ color: colors.textSecondary }}
              aria-label="Go back to exam list"
            >
              <X className="w-6 h-6" />
            </Button>
            <div className="flex-1 min-w-0">
              <h1 
                id="schedule-title" 
                className="text-xl sm:text-2xl font-bold"
                style={{ fontFamily: 'Poppins, sans-serif' }}
              >
                Schedule Exam
              </h1>
              <p className="text-sm" style={{ color: colors.textSecondary }}>
                {selectedCertification.name}
              </p>
            </div>
          </div>
        </div>

        {/* Scheduling Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6">
          <motion.div
            className="rounded-xl p-6 mb-6"
            style={{
              background: colors.iconBg,
              border: `1px solid ${colors.iconColor}`,
            }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Calendar className="w-8 h-8 mb-3" style={{ color: colors.iconColor }} aria-hidden="true" />
            <h2 className="text-lg font-semibold mb-2" style={{ color: colors.textPrimary }}>
              Live Proctored Examination
            </h2>
            <p className="text-sm leading-relaxed" style={{ color: colors.textSecondary }}>
              This certification requires a live proctored exam session. You'll be connected with a certified proctor via video call to ensure exam integrity.
            </p>
          </motion.div>

          {/* Exam Details */}
          <div 
            className="rounded-xl p-4 mb-6"
            style={{
              background: colors.cardBg,
              backdropFilter: colors.blur,
              WebkitBackdropFilter: colors.blur,
              border: colors.glassBorder,
              boxShadow: colors.shadow,
            }}
          >
            <h3 className="font-semibold mb-3" style={{ color: colors.textPrimary }}>
              Exam Details
            </h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span style={{ color: colors.textTertiary }}>Duration:</span>
                <span style={{ color: colors.textPrimary }}>{selectedCertification.duration}</span>
              </div>
              <div className="flex justify-between">
                <span style={{ color: colors.textTertiary }}>Format:</span>
                <span style={{ color: colors.textPrimary }}>Video Interview</span>
              </div>
              <div className="flex justify-between">
                <span style={{ color: colors.textTertiary }}>Cost:</span>
                <span style={{ color: colors.textPrimary }}>{selectedCertification.cost}</span>
              </div>
              <div className="flex justify-between">
                <span style={{ color: colors.textTertiary }}>Organization:</span>
                <span style={{ color: colors.textPrimary }}>{selectedCertification.organization}</span>
              </div>
            </div>
          </div>

          {/* Available Time Slots (Mock) */}
          <div>
            <h3 className="font-semibold mb-3" style={{ color: colors.textPrimary }}>
              Available Time Slots
            </h3>
            <div className="space-y-2">
              {[
                { date: 'Mon, Jan 20', time: '10:00 AM - 10:30 AM' },
                { date: 'Tue, Jan 21', time: '2:00 PM - 2:30 PM' },
                { date: 'Wed, Jan 22', time: '11:00 AM - 11:30 AM' },
                { date: 'Thu, Jan 23', time: '3:00 PM - 3:30 PM' },
              ].map((slot, index) => (
                <button
                  key={index}
                  className="w-full rounded-xl p-4 text-left transition-colors"
                  style={{
                    background: colors.cardBg,
                    backdropFilter: colors.blur,
                    WebkitBackdropFilter: colors.blur,
                    border: colors.glassBorder,
                    boxShadow: colors.shadow,
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.background = colors.cardHover}
                  onMouseLeave={(e) => e.currentTarget.style.background = colors.cardBg}
                  onClick={() => alert(`Exam scheduled for ${slot.date} at ${slot.time}`)}
                  aria-label={`Schedule exam for ${slot.date} at ${slot.time}`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-semibold mb-1" style={{ color: colors.textPrimary }}>
                        {slot.date}
                      </div>
                      <div className="text-sm" style={{ color: colors.textSecondary }}>
                        {slot.time}
                      </div>
                    </div>
                    <ChevronRight className="w-5 h-5" style={{ color: colors.iconColor }} aria-hidden="true" />
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return null;
}
