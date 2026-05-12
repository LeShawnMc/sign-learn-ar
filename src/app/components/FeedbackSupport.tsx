import { useState } from 'react';
import { Button } from './ui/button';
import { useTheme } from '../context/ThemeContext';
import { useApp } from '../context/AppContext';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, 
  Bug, 
  Lightbulb, 
  MessageCircle, 
  Star, 
  FileText, 
  Send,
  Check,
  Upload,
  Image as ImageIcon,
  ChevronRight,
  Mail,
  Phone,
  Globe,
  Clock,
  CheckCircle,
  AlertCircle,
  Info,
  Shield,
  Users,
  Heart,
  ThumbsUp,
  MessageSquare,
  Camera,
  FileVideo,
} from 'lucide-react';

interface FeedbackSupportProps {
  onExit: () => void;
}

type FeedbackType = 'bug' | 'feature' | 'support' | 'rate' | 'guidelines' | null;

interface BugReport {
  title: string;
  description: string;
  category: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  stepsToReproduce: string;
  expectedBehavior: string;
  actualBehavior: string;
  deviceInfo: boolean;
  screenshot: boolean;
}

interface FeatureSuggestion {
  title: string;
  description: string;
  category: string;
  priority: 'nice-to-have' | 'important' | 'critical';
  useCase: string;
}

interface SupportRequest {
  name: string;
  email: string;
  subject: string;
  category: string;
  priority: 'low' | 'normal' | 'high';
  description: string;
}

export function FeedbackSupport({ onExit }: FeedbackSupportProps) {
  const { theme } = useTheme();
  const { userProgress } = useApp();
  
  const [selectedType, setSelectedType] = useState<FeedbackType>(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);

  // Bug Report State
  const [bugReport, setBugReport] = useState<BugReport>({
    title: '',
    description: '',
    category: '',
    severity: 'medium',
    stepsToReproduce: '',
    expectedBehavior: '',
    actualBehavior: '',
    deviceInfo: true,
    screenshot: false,
  });

  // Feature Suggestion State
  const [featureSuggestion, setFeatureSuggestion] = useState<FeatureSuggestion>({
    title: '',
    description: '',
    category: '',
    priority: 'important',
    useCase: '',
  });

  // Support Request State
  const [supportRequest, setSupportRequest] = useState<SupportRequest>({
    name: '',
    email: '',
    subject: '',
    category: '',
    priority: 'normal',
    description: '',
  });

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

  const feedbackOptions = [
    {
      id: 'bug',
      title: 'Report a Bug',
      description: 'Let us know about any issues or problems',
      icon: Bug,
      color: colors.errorColor,
      bgColor: colors.errorBg,
    },
    {
      id: 'feature',
      title: 'Suggest a Feature',
      description: 'Share your ideas to improve the app',
      icon: Lightbulb,
      color: colors.warningColor,
      bgColor: colors.warningBg,
    },
    {
      id: 'support',
      title: 'Contact Support',
      description: 'Get help from our support team',
      icon: MessageCircle,
      color: colors.iconColor,
      bgColor: colors.iconBg,
    },
    {
      id: 'rate',
      title: 'Rate the App',
      description: 'Share your experience with others',
      icon: Star,
      color: colors.accentColor,
      bgColor: colors.accentBg,
    },
    {
      id: 'guidelines',
      title: 'Community Guidelines',
      description: 'Learn about our community standards',
      icon: FileText,
      color: colors.successColor,
      bgColor: colors.successBg,
    },
  ];

  const bugCategories = [
    'AR Hand Tracking',
    'Video Playback',
    'App Crashes',
    'Login/Account',
    'Lessons Not Loading',
    'Progress Not Saving',
    'Performance/Lag',
    'Audio Issues',
    'Camera Not Working',
    'Other',
  ];

  const featureCategories = [
    'AR Features',
    'Learning Content',
    'Social Features',
    'Progress Tracking',
    'Accessibility',
    'User Interface',
    'Gamification',
    'Offline Mode',
    'Notifications',
    'Other',
  ];

  const supportCategories = [
    'Account & Billing',
    'Technical Issues',
    'Content Questions',
    'Feature Request',
    'Privacy & Security',
    'Subscription Management',
    'General Inquiry',
    'Other',
  ];

  const communityGuidelines = [
    {
      title: 'Be Respectful',
      description: 'Treat all community members with respect and kindness. We have zero tolerance for harassment, discrimination, or hate speech.',
      icon: Heart,
    },
    {
      title: 'Keep It Positive',
      description: 'Share encouragement and constructive feedback. Help others on their learning journey and celebrate their progress.',
      icon: ThumbsUp,
    },
    {
      title: 'Stay On Topic',
      description: 'Keep discussions focused on sign language learning, practice tips, and related topics. Off-topic content may be removed.',
      icon: MessageSquare,
    },
    {
      title: 'No Spam or Self-Promotion',
      description: 'Don\'t post promotional content, advertisements, or spam. Share resources that genuinely help the community.',
      icon: Shield,
    },
    {
      title: 'Protect Privacy',
      description: 'Don\'t share personal information about yourself or others. Respect everyone\'s privacy and confidentiality.',
      icon: Shield,
    },
    {
      title: 'Report Issues',
      description: 'If you see content that violates our guidelines, please report it. Help us maintain a safe and welcoming community.',
      icon: AlertCircle,
    },
    {
      title: 'Appropriate Content Only',
      description: 'Don\'t post explicit, violent, or inappropriate content. Keep all posts family-friendly and suitable for all ages.',
      icon: Users,
    },
    {
      title: 'Give Credit',
      description: 'When sharing content created by others, always give proper credit. Respect intellectual property and copyrights.',
      icon: CheckCircle,
    },
  ];

  const handleSubmitBug = () => {
    // Simulate submission
    setShowSuccess(true);
    setTimeout(() => {
      setShowSuccess(false);
      setSelectedType(null);
      setBugReport({
        title: '',
        description: '',
        category: '',
        severity: 'medium',
        stepsToReproduce: '',
        expectedBehavior: '',
        actualBehavior: '',
        deviceInfo: true,
        screenshot: false,
      });
    }, 2000);
  };

  const handleSubmitFeature = () => {
    // Simulate submission
    setShowSuccess(true);
    setTimeout(() => {
      setShowSuccess(false);
      setSelectedType(null);
      setFeatureSuggestion({
        title: '',
        description: '',
        category: '',
        priority: 'important',
        useCase: '',
      });
    }, 2000);
  };

  const handleSubmitSupport = () => {
    // Simulate submission
    setShowSuccess(true);
    setTimeout(() => {
      setShowSuccess(false);
      setSelectedType(null);
      setSupportRequest({
        name: '',
        email: '',
        subject: '',
        category: '',
        priority: 'normal',
        description: '',
      });
    }, 2000);
  };

  const handleSubmitRating = () => {
    if (rating === 0) return;
    // Simulate submission
    setShowSuccess(true);
    setTimeout(() => {
      setShowSuccess(false);
      setSelectedType(null);
      setRating(0);
    }, 2000);
  };

  // Success Modal
  if (showSuccess) {
    return (
      <div 
        className="h-full flex flex-col items-center justify-center p-6"
        style={{ background: colors.bg, color: colors.textPrimary }}
        role="alert"
        aria-live="polite"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="w-24 h-24 rounded-full flex items-center justify-center mb-6"
          style={{ background: colors.successBg }}
        >
          <CheckCircle className="w-12 h-12" style={{ color: colors.successColor }} aria-hidden="true" />
        </motion.div>
        <h2 className="text-2xl font-bold mb-3" style={{ fontFamily: 'Poppins, sans-serif' }}>
          Thank You!
        </h2>
        <p className="text-center" style={{ color: colors.textSecondary }}>
          {selectedType === 'bug' && 'Your bug report has been submitted. We\'ll investigate and fix it soon.'}
          {selectedType === 'feature' && 'Your feature suggestion has been received. We appreciate your feedback!'}
          {selectedType === 'support' && 'Your support request has been submitted. We\'ll get back to you within 24 hours.'}
          {selectedType === 'rate' && 'Thank you for rating our app! Your feedback helps us improve.'}
        </p>
      </div>
    );
  }

  // Bug Report Form
  if (selectedType === 'bug') {
    return (
      <div 
        className="h-full flex flex-col"
        style={{ background: colors.bg, color: colors.textPrimary }}
        role="main"
        aria-labelledby="bug-report-title"
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
              onClick={() => setSelectedType(null)}
              style={{ color: colors.textSecondary }}
              aria-label="Back to feedback options"
            >
              <X className="w-6 h-6" />
            </Button>
            <div className="flex-1 min-w-0">
              <h1 
                id="bug-report-title" 
                className="text-xl sm:text-2xl font-bold"
                style={{ fontFamily: 'Poppins, sans-serif' }}
              >
                Report a Bug
              </h1>
              <p className="text-sm" style={{ color: colors.textSecondary }}>
                Help us fix issues in the app
              </p>
            </div>
          </div>
        </div>

        {/* Scrollable Form */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6">
          <form onSubmit={(e) => { e.preventDefault(); handleSubmitBug(); }}>
            {/* Title */}
            <div className="mb-4">
              <label htmlFor="bug-title" className="block text-sm font-semibold mb-2" style={{ color: colors.textPrimary }}>
                Bug Title *
              </label>
              <input
                id="bug-title"
                type="text"
                value={bugReport.title}
                onChange={(e) => setBugReport({ ...bugReport, title: e.target.value })}
                placeholder="Brief description of the issue"
                required
                className="w-full px-4 py-3 rounded-xl text-sm"
                style={{
                  background: colors.cardBg,
                  color: colors.textPrimary,
                  border: colors.glassBorder,
                }}
              />
            </div>

            {/* Category */}
            <div className="mb-4">
              <label htmlFor="bug-category" className="block text-sm font-semibold mb-2" style={{ color: colors.textPrimary }}>
                Category *
              </label>
              <select
                id="bug-category"
                value={bugReport.category}
                onChange={(e) => setBugReport({ ...bugReport, category: e.target.value })}
                required
                className="w-full px-4 py-3 rounded-xl text-sm"
                style={{
                  background: colors.cardBg,
                  color: colors.textPrimary,
                  border: colors.glassBorder,
                }}
              >
                <option value="">Select a category</option>
                {bugCategories.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            {/* Severity */}
            <div className="mb-4">
              <label className="block text-sm font-semibold mb-2" style={{ color: colors.textPrimary }}>
                Severity *
              </label>
              <div className="grid grid-cols-2 gap-2" role="radiogroup" aria-label="Bug severity">
                {[
                  { value: 'low', label: 'Low', description: 'Minor inconvenience' },
                  { value: 'medium', label: 'Medium', description: 'Affects functionality' },
                  { value: 'high', label: 'High', description: 'Major issue' },
                  { value: 'critical', label: 'Critical', description: 'App unusable' },
                ].map((severity) => {
                  const isSelected = bugReport.severity === severity.value;
                  return (
                    <button
                      key={severity.value}
                      type="button"
                      onClick={() => setBugReport({ ...bugReport, severity: severity.value as any })}
                      className="p-3 rounded-lg text-left transition-all"
                      style={{
                        background: isSelected ? colors.iconBg : colors.cardBg,
                        border: isSelected ? `2px solid ${colors.iconColor}` : 'none',
                      }}
                      role="radio"
                      aria-checked={isSelected}
                      aria-label={`${severity.label}, ${severity.description}`}
                    >
                      <div className="font-semibold text-sm mb-1" style={{ color: colors.textPrimary }}>
                        {severity.label}
                      </div>
                      <div className="text-xs" style={{ color: colors.textSecondary }}>
                        {severity.description}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Description */}
            <div className="mb-4">
              <label htmlFor="bug-description" className="block text-sm font-semibold mb-2" style={{ color: colors.textPrimary }}>
                Description *
              </label>
              <textarea
                id="bug-description"
                value={bugReport.description}
                onChange={(e) => setBugReport({ ...bugReport, description: e.target.value })}
                placeholder="Describe the bug in detail"
                required
                rows={4}
                className="w-full px-4 py-3 rounded-xl text-sm resize-none"
                style={{
                  background: colors.cardBg,
                  color: colors.textPrimary,
                  border: colors.glassBorder,
                }}
              />
            </div>

            {/* Steps to Reproduce */}
            <div className="mb-4">
              <label htmlFor="bug-steps" className="block text-sm font-semibold mb-2" style={{ color: colors.textPrimary }}>
                Steps to Reproduce *
              </label>
              <textarea
                id="bug-steps"
                value={bugReport.stepsToReproduce}
                onChange={(e) => setBugReport({ ...bugReport, stepsToReproduce: e.target.value })}
                placeholder="1. Go to...&#10;2. Click on...&#10;3. See error"
                required
                rows={4}
                className="w-full px-4 py-3 rounded-xl text-sm resize-none"
                style={{
                  background: colors.cardBg,
                  color: colors.textPrimary,
                  border: colors.glassBorder,
                }}
              />
            </div>

            {/* Expected Behavior */}
            <div className="mb-4">
              <label htmlFor="bug-expected" className="block text-sm font-semibold mb-2" style={{ color: colors.textPrimary }}>
                Expected Behavior *
              </label>
              <textarea
                id="bug-expected"
                value={bugReport.expectedBehavior}
                onChange={(e) => setBugReport({ ...bugReport, expectedBehavior: e.target.value })}
                placeholder="What should happen?"
                required
                rows={3}
                className="w-full px-4 py-3 rounded-xl text-sm resize-none"
                style={{
                  background: colors.cardBg,
                  color: colors.textPrimary,
                  border: colors.glassBorder,
                }}
              />
            </div>

            {/* Actual Behavior */}
            <div className="mb-4">
              <label htmlFor="bug-actual" className="block text-sm font-semibold mb-2" style={{ color: colors.textPrimary }}>
                Actual Behavior *
              </label>
              <textarea
                id="bug-actual"
                value={bugReport.actualBehavior}
                onChange={(e) => setBugReport({ ...bugReport, actualBehavior: e.target.value })}
                placeholder="What actually happens?"
                required
                rows={3}
                className="w-full px-4 py-3 rounded-xl text-sm resize-none"
                style={{
                  background: colors.cardBg,
                  color: colors.textPrimary,
                  border: colors.glassBorder,
                }}
              />
            </div>

            {/* Attachments */}
            <div className="mb-4">
              <label className="block text-sm font-semibold mb-2" style={{ color: colors.textPrimary }}>
                Attachments
              </label>
              
              {/* Screenshot Upload */}
              <button
                type="button"
                onClick={() => setBugReport({ ...bugReport, screenshot: !bugReport.screenshot })}
                className="w-full p-4 rounded-xl mb-3 flex items-center gap-3 transition-colors"
                style={{
                  background: bugReport.screenshot ? colors.successBg : colors.cardBg,
                  border: bugReport.screenshot ? `2px solid ${colors.successColor}` : colors.glassBorder,
                }}
                aria-label={bugReport.screenshot ? 'Screenshot attached' : 'Attach screenshot'}
              >
                {bugReport.screenshot ? (
                  <CheckCircle className="w-5 h-5" style={{ color: colors.successColor }} aria-hidden="true" />
                ) : (
                  <Camera className="w-5 h-5" style={{ color: colors.textSecondary }} aria-hidden="true" />
                )}
                <div className="flex-1 text-left">
                  <div className="font-semibold text-sm" style={{ color: colors.textPrimary }}>
                    {bugReport.screenshot ? 'Screenshot Attached' : 'Add Screenshot'}
                  </div>
                  <div className="text-xs" style={{ color: colors.textSecondary }}>
                    {bugReport.screenshot ? 'Tap to remove' : 'Helps us understand the issue'}
                  </div>
                </div>
              </button>

              {/* Device Info Toggle */}
              <div 
                className="p-4 rounded-xl flex items-center justify-between"
                style={{ background: colors.cardBg }}
              >
                <div>
                  <div className="font-semibold text-sm mb-1" style={{ color: colors.textPrimary }}>
                    Include Device Info
                  </div>
                  <div className="text-xs" style={{ color: colors.textSecondary }}>
                    OS, device model, app version
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setBugReport({ ...bugReport, deviceInfo: !bugReport.deviceInfo })}
                  className="relative w-12 h-6 rounded-full transition-colors flex-shrink-0"
                  style={{ 
                    background: bugReport.deviceInfo ? colors.iconColor : colors.border,
                  }}
                  role="switch"
                  aria-checked={bugReport.deviceInfo}
                  aria-label="Include device information"
                >
                  <div 
                    className="absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white transition-transform"
                    style={{
                      transform: bugReport.deviceInfo ? 'translateX(24px)' : 'translateX(0)',
                    }}
                  />
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              className="w-full h-12 rounded-full font-semibold"
              style={{
                background: colors.errorColor,
                color: '#FFFFFF',
              }}
              disabled={!bugReport.title || !bugReport.category || !bugReport.description || !bugReport.stepsToReproduce || !bugReport.expectedBehavior || !bugReport.actualBehavior}
              aria-label="Submit bug report"
            >
              <Send className="w-5 h-5 mr-2" />
              Submit Bug Report
            </Button>
          </form>
        </div>
      </div>
    );
  }

  // Feature Suggestion Form
  if (selectedType === 'feature') {
    return (
      <div 
        className="h-full flex flex-col"
        style={{ background: colors.bg, color: colors.textPrimary }}
        role="main"
        aria-labelledby="feature-suggestion-title"
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
              onClick={() => setSelectedType(null)}
              style={{ color: colors.textSecondary }}
              aria-label="Back to feedback options"
            >
              <X className="w-6 h-6" />
            </Button>
            <div className="flex-1 min-w-0">
              <h1 
                id="feature-suggestion-title" 
                className="text-xl sm:text-2xl font-bold"
                style={{ fontFamily: 'Poppins, sans-serif' }}
              >
                Suggest a Feature
              </h1>
              <p className="text-sm" style={{ color: colors.textSecondary }}>
                Share your ideas to improve the app
              </p>
            </div>
          </div>
        </div>

        {/* Scrollable Form */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6">
          <form onSubmit={(e) => { e.preventDefault(); handleSubmitFeature(); }}>
            {/* Title */}
            <div className="mb-4">
              <label htmlFor="feature-title" className="block text-sm font-semibold mb-2" style={{ color: colors.textPrimary }}>
                Feature Title *
              </label>
              <input
                id="feature-title"
                type="text"
                value={featureSuggestion.title}
                onChange={(e) => setFeatureSuggestion({ ...featureSuggestion, title: e.target.value })}
                placeholder="Brief description of the feature"
                required
                className="w-full px-4 py-3 rounded-xl text-sm"
                style={{
                  background: colors.cardBg,
                  color: colors.textPrimary,
                  border: colors.glassBorder,
                }}
              />
            </div>

            {/* Category */}
            <div className="mb-4">
              <label htmlFor="feature-category" className="block text-sm font-semibold mb-2" style={{ color: colors.textPrimary }}>
                Category *
              </label>
              <select
                id="feature-category"
                value={featureSuggestion.category}
                onChange={(e) => setFeatureSuggestion({ ...featureSuggestion, category: e.target.value })}
                required
                className="w-full px-4 py-3 rounded-xl text-sm"
                style={{
                  background: colors.cardBg,
                  color: colors.textPrimary,
                  border: colors.glassBorder,
                }}
              >
                <option value="">Select a category</option>
                {featureCategories.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            {/* Priority */}
            <div className="mb-4">
              <label className="block text-sm font-semibold mb-2" style={{ color: colors.textPrimary }}>
                Priority *
              </label>
              <div className="grid grid-cols-3 gap-2" role="radiogroup" aria-label="Feature priority">
                {[
                  { value: 'nice-to-have', label: 'Nice to Have' },
                  { value: 'important', label: 'Important' },
                  { value: 'critical', label: 'Critical' },
                ].map((priority) => {
                  const isSelected = featureSuggestion.priority === priority.value;
                  return (
                    <button
                      key={priority.value}
                      type="button"
                      onClick={() => setFeatureSuggestion({ ...featureSuggestion, priority: priority.value as any })}
                      className="p-3 rounded-lg text-center transition-all"
                      style={{
                        background: isSelected ? colors.iconBg : colors.cardBg,
                        border: isSelected ? `2px solid ${colors.iconColor}` : 'none',
                      }}
                      role="radio"
                      aria-checked={isSelected}
                    >
                      <div className="font-semibold text-sm" style={{ color: colors.textPrimary }}>
                        {priority.label}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Description */}
            <div className="mb-4">
              <label htmlFor="feature-description" className="block text-sm font-semibold mb-2" style={{ color: colors.textPrimary }}>
                Detailed Description *
              </label>
              <textarea
                id="feature-description"
                value={featureSuggestion.description}
                onChange={(e) => setFeatureSuggestion({ ...featureSuggestion, description: e.target.value })}
                placeholder="Describe the feature and how it would work"
                required
                rows={5}
                className="w-full px-4 py-3 rounded-xl text-sm resize-none"
                style={{
                  background: colors.cardBg,
                  color: colors.textPrimary,
                  border: colors.glassBorder,
                }}
              />
            </div>

            {/* Use Case */}
            <div className="mb-4">
              <label htmlFor="feature-usecase" className="block text-sm font-semibold mb-2" style={{ color: colors.textPrimary }}>
                Use Case *
              </label>
              <textarea
                id="feature-usecase"
                value={featureSuggestion.useCase}
                onChange={(e) => setFeatureSuggestion({ ...featureSuggestion, useCase: e.target.value })}
                placeholder="How would this feature help you learn sign language?"
                required
                rows={4}
                className="w-full px-4 py-3 rounded-xl text-sm resize-none"
                style={{
                  background: colors.cardBg,
                  color: colors.textPrimary,
                  border: colors.glassBorder,
                }}
              />
            </div>

            {/* Info Card */}
            <div 
              className="rounded-xl p-4 mb-6"
              style={{ background: colors.iconBg }}
            >
              <div className="flex items-start gap-3">
                <Info className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: colors.iconColor }} aria-hidden="true" />
                <div>
                  <div className="font-semibold mb-1 text-sm" style={{ color: colors.textPrimary }}>
                    Feature Voting
                  </div>
                  <div className="text-xs" style={{ color: colors.textSecondary }}>
                    Popular feature requests are prioritized in our development roadmap. We'll notify you when your suggestion is implemented!
                  </div>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              className="w-full h-12 rounded-full font-semibold"
              style={{
                background: colors.warningColor,
                color: theme === 'dark' ? '#0F0F23' : '#FFFFFF',
              }}
              disabled={!featureSuggestion.title || !featureSuggestion.category || !featureSuggestion.description || !featureSuggestion.useCase}
              aria-label="Submit feature suggestion"
            >
              <Send className="w-5 h-5 mr-2" />
              Submit Suggestion
            </Button>
          </form>
        </div>
      </div>
    );
  }

  // Contact Support Form
  if (selectedType === 'support') {
    return (
      <div 
        className="h-full flex flex-col"
        style={{ background: colors.bg, color: colors.textPrimary }}
        role="main"
        aria-labelledby="contact-support-title"
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
              onClick={() => setSelectedType(null)}
              style={{ color: colors.textSecondary }}
              aria-label="Back to feedback options"
            >
              <X className="w-6 h-6" />
            </Button>
            <div className="flex-1 min-w-0">
              <h1 
                id="contact-support-title" 
                className="text-xl sm:text-2xl font-bold"
                style={{ fontFamily: 'Poppins, sans-serif' }}
              >
                Contact Support
              </h1>
              <p className="text-sm" style={{ color: colors.textSecondary }}>
                We're here to help
              </p>
            </div>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6">
          {/* Contact Methods */}
          <div className="mb-6">
            <h2 className="text-sm font-semibold mb-3" style={{ color: colors.textPrimary }}>
              Other Ways to Reach Us
            </h2>
            <div className="space-y-3">
              <a
                href="mailto:support@signlearnar.com"
                className="flex items-center gap-3 p-4 rounded-xl transition-colors"
                style={{ background: colors.cardBg }}
                onMouseEnter={(e) => e.currentTarget.style.background = colors.cardHover}
                onMouseLeave={(e) => e.currentTarget.style.background = colors.cardBg}
                aria-label="Email support at support@signlearnar.com"
              >
                <div 
                  className="w-10 h-10 rounded-lg flex items-center justify-center"
                  style={{ background: colors.iconBg }}
                  aria-hidden="true"
                >
                  <Mail className="w-5 h-5" style={{ color: colors.iconColor }} />
                </div>
                <div className="flex-1">
                  <div className="font-semibold text-sm" style={{ color: colors.textPrimary }}>
                    Email
                  </div>
                  <div className="text-xs" style={{ color: colors.textSecondary }}>
                    support@signlearnar.com
                  </div>
                </div>
                <ChevronRight className="w-5 h-5" style={{ color: colors.textTertiary }} aria-hidden="true" />
              </a>

              <a
                href="tel:+1-800-SIGN-AR"
                className="flex items-center gap-3 p-4 rounded-xl transition-colors"
                style={{ background: colors.cardBg }}
                onMouseEnter={(e) => e.currentTarget.style.background = colors.cardHover}
                onMouseLeave={(e) => e.currentTarget.style.background = colors.cardBg}
                aria-label="Call support at 1-800-SIGN-AR"
              >
                <div 
                  className="w-10 h-10 rounded-lg flex items-center justify-center"
                  style={{ background: colors.iconBg }}
                  aria-hidden="true"
                >
                  <Phone className="w-5 h-5" style={{ color: colors.iconColor }} />
                </div>
                <div className="flex-1">
                  <div className="font-semibold text-sm" style={{ color: colors.textPrimary }}>
                    Phone
                  </div>
                  <div className="text-xs" style={{ color: colors.textSecondary }}>
                    1-800-SIGN-AR (7446-27)
                  </div>
                </div>
                <ChevronRight className="w-5 h-5" style={{ color: colors.textTertiary }} aria-hidden="true" />
              </a>

              <a
                href="https://signlearnar.com/help"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 p-4 rounded-xl transition-colors"
                style={{ background: colors.cardBg }}
                onMouseEnter={(e) => e.currentTarget.style.background = colors.cardHover}
                onMouseLeave={(e) => e.currentTarget.style.background = colors.cardBg}
                aria-label="Visit help center (opens in new tab)"
              >
                <div 
                  className="w-10 h-10 rounded-lg flex items-center justify-center"
                  style={{ background: colors.iconBg }}
                  aria-hidden="true"
                >
                  <Globe className="w-5 h-5" style={{ color: colors.iconColor }} />
                </div>
                <div className="flex-1">
                  <div className="font-semibold text-sm" style={{ color: colors.textPrimary }}>
                    Help Center
                  </div>
                  <div className="text-xs" style={{ color: colors.textSecondary }}>
                    signlearnar.com/help
                  </div>
                </div>
                <ChevronRight className="w-5 h-5" style={{ color: colors.textTertiary }} aria-hidden="true" />
              </a>
            </div>
          </div>

          {/* Support Hours */}
          <div 
            className="rounded-xl p-4 mb-6"
            style={{ background: colors.iconBg }}
          >
            <div className="flex items-start gap-3">
              <Clock className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: colors.iconColor }} aria-hidden="true" />
              <div>
                <div className="font-semibold mb-1 text-sm" style={{ color: colors.textPrimary }}>
                  Support Hours
                </div>
                <div className="text-xs space-y-1" style={{ color: colors.textSecondary }}>
                  <div>Monday - Friday: 9:00 AM - 8:00 PM EST</div>
                  <div>Saturday - Sunday: 10:00 AM - 6:00 PM EST</div>
                  <div className="mt-2">Average response time: 2-4 hours</div>
                </div>
              </div>
            </div>
          </div>

          {/* Support Form */}
          <form onSubmit={(e) => { e.preventDefault(); handleSubmitSupport(); }}>
            <h2 className="text-sm font-semibold mb-3" style={{ color: colors.textPrimary }}>
              Send Us a Message
            </h2>

            {/* Name */}
            <div className="mb-4">
              <label htmlFor="support-name" className="block text-sm font-semibold mb-2" style={{ color: colors.textPrimary }}>
                Name *
              </label>
              <input
                id="support-name"
                type="text"
                value={supportRequest.name}
                onChange={(e) => setSupportRequest({ ...supportRequest, name: e.target.value })}
                placeholder="Your full name"
                required
                className="w-full px-4 py-3 rounded-xl text-sm"
                style={{
                  background: colors.cardBg,
                  color: colors.textPrimary,
                  border: colors.glassBorder,
                }}
              />
            </div>

            {/* Email */}
            <div className="mb-4">
              <label htmlFor="support-email" className="block text-sm font-semibold mb-2" style={{ color: colors.textPrimary }}>
                Email *
              </label>
              <input
                id="support-email"
                type="email"
                value={supportRequest.email}
                onChange={(e) => setSupportRequest({ ...supportRequest, email: e.target.value })}
                placeholder="your.email@example.com"
                required
                className="w-full px-4 py-3 rounded-xl text-sm"
                style={{
                  background: colors.cardBg,
                  color: colors.textPrimary,
                  border: colors.glassBorder,
                }}
              />
            </div>

            {/* Subject */}
            <div className="mb-4">
              <label htmlFor="support-subject" className="block text-sm font-semibold mb-2" style={{ color: colors.textPrimary }}>
                Subject *
              </label>
              <input
                id="support-subject"
                type="text"
                value={supportRequest.subject}
                onChange={(e) => setSupportRequest({ ...supportRequest, subject: e.target.value })}
                placeholder="Brief description of your issue"
                required
                className="w-full px-4 py-3 rounded-xl text-sm"
                style={{
                  background: colors.cardBg,
                  color: colors.textPrimary,
                  border: colors.glassBorder,
                }}
              />
            </div>

            {/* Category */}
            <div className="mb-4">
              <label htmlFor="support-category" className="block text-sm font-semibold mb-2" style={{ color: colors.textPrimary }}>
                Category *
              </label>
              <select
                id="support-category"
                value={supportRequest.category}
                onChange={(e) => setSupportRequest({ ...supportRequest, category: e.target.value })}
                required
                className="w-full px-4 py-3 rounded-xl text-sm"
                style={{
                  background: colors.cardBg,
                  color: colors.textPrimary,
                  border: colors.glassBorder,
                }}
              >
                <option value="">Select a category</option>
                {supportCategories.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            {/* Priority */}
            <div className="mb-4">
              <label className="block text-sm font-semibold mb-2" style={{ color: colors.textPrimary }}>
                Priority *
              </label>
              <div className="grid grid-cols-3 gap-2" role="radiogroup" aria-label="Support priority">
                {[
                  { value: 'low', label: 'Low' },
                  { value: 'normal', label: 'Normal' },
                  { value: 'high', label: 'High' },
                ].map((priority) => {
                  const isSelected = supportRequest.priority === priority.value;
                  return (
                    <button
                      key={priority.value}
                      type="button"
                      onClick={() => setSupportRequest({ ...supportRequest, priority: priority.value as any })}
                      className="p-3 rounded-lg text-center transition-all"
                      style={{
                        background: isSelected ? colors.iconBg : colors.cardBg,
                        border: isSelected ? `2px solid ${colors.iconColor}` : 'none',
                      }}
                      role="radio"
                      aria-checked={isSelected}
                    >
                      <div className="font-semibold text-sm" style={{ color: colors.textPrimary }}>
                        {priority.label}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Description */}
            <div className="mb-6">
              <label htmlFor="support-description" className="block text-sm font-semibold mb-2" style={{ color: colors.textPrimary }}>
                Message *
              </label>
              <textarea
                id="support-description"
                value={supportRequest.description}
                onChange={(e) => setSupportRequest({ ...supportRequest, description: e.target.value })}
                placeholder="Provide details about your question or issue"
                required
                rows={5}
                className="w-full px-4 py-3 rounded-xl text-sm resize-none"
                style={{
                  background: colors.cardBg,
                  color: colors.textPrimary,
                  border: colors.glassBorder,
                }}
              />
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              className="w-full h-12 rounded-full font-semibold"
              style={{
                background: colors.iconColor,
                color: theme === 'dark' ? '#0F0F23' : '#FFFFFF',
              }}
              disabled={!supportRequest.name || !supportRequest.email || !supportRequest.subject || !supportRequest.category || !supportRequest.description}
              aria-label="Submit support request"
            >
              <Send className="w-5 h-5 mr-2" />
              Send Message
            </Button>
          </form>
        </div>
      </div>
    );
  }

  // Rate App Screen
  if (selectedType === 'rate') {
    return (
      <div 
        className="h-full flex flex-col"
        style={{ background: colors.bg, color: colors.textPrimary }}
        role="main"
        aria-labelledby="rate-app-title"
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
              onClick={() => setSelectedType(null)}
              style={{ color: colors.textSecondary }}
              aria-label="Back to feedback options"
            >
              <X className="w-6 h-6" />
            </Button>
            <div className="flex-1 min-w-0">
              <h1 
                id="rate-app-title" 
                className="text-xl sm:text-2xl font-bold"
                style={{ fontFamily: 'Poppins, sans-serif' }}
              >
                Rate the App
              </h1>
              <p className="text-sm" style={{ color: colors.textSecondary }}>
                Share your experience
              </p>
            </div>
          </div>
        </div>

        {/* Rating Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 flex flex-col items-center justify-center">
          <div className="w-full max-w-md">
            {/* App Icon */}
            <div 
              className="w-24 h-24 rounded-2xl mx-auto mb-6 flex items-center justify-center"
              style={{ background: colors.iconColor }}
              aria-hidden="true"
            >
              <Star className="w-12 h-12" style={{ color: theme === 'dark' ? '#0F0F23' : '#FFFFFF' }} />
            </div>

            {/* Title */}
            <h2 className="text-2xl font-bold text-center mb-2">
              Enjoying Sign Learn AR?
            </h2>
            <p className="text-center mb-8" style={{ color: colors.textSecondary }}>
              Your feedback helps us improve and helps others discover the app
            </p>

            {/* Star Rating */}
            <div className="flex justify-center gap-2 mb-8" role="radiogroup" aria-label="Star rating">
              {[1, 2, 3, 4, 5].map((star) => {
                const isFilled = star <= (hoverRating || rating);
                return (
                  <button
                    key={star}
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                    className="transition-transform hover:scale-110"
                    role="radio"
                    aria-checked={rating === star}
                    aria-label={`${star} star${star > 1 ? 's' : ''}`}
                  >
                    <Star
                      className="w-12 h-12"
                      style={{ 
                        color: isFilled ? colors.warningColor : colors.border,
                        fill: isFilled ? colors.warningColor : 'transparent',
                      }}
                    />
                  </button>
                );
              })}
            </div>

            {/* Rating Message */}
            {rating > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center mb-6"
              >
                <p className="text-lg font-semibold mb-2">
                  {rating === 5 && "Awesome! 🎉"}
                  {rating === 4 && "Great! Thanks for the feedback"}
                  {rating === 3 && "Good! How can we improve?"}
                  {rating <= 2 && "We're sorry to hear that"}
                </p>
                <p className="text-sm" style={{ color: colors.textSecondary }}>
                  {rating >= 4 && "Would you like to rate us on the App Store?"}
                  {rating < 4 && "Please let us know how we can make it better"}
                </p>
              </motion.div>
            )}

            {/* Action Buttons */}
            {rating > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-3"
              >
                {rating >= 4 ? (
                  <>
                    <Button
                      onClick={handleSubmitRating}
                      className="w-full h-12 rounded-full font-semibold"
                      style={{
                        background: colors.warningColor,
                        color: theme === 'dark' ? '#0F0F23' : '#FFFFFF',
                      }}
                      aria-label="Rate on App Store"
                    >
                      <Star className="w-5 h-5 mr-2" />
                      Rate on App Store
                    </Button>
                    <Button
                      onClick={() => setRating(0)}
                      variant="ghost"
                      className="w-full h-12 rounded-full"
                      style={{ color: colors.textSecondary }}
                      aria-label="Maybe later"
                    >
                      Maybe Later
                    </Button>
                  </>
                ) : (
                  <>
                    <Button
                      onClick={() => {
                        setSelectedType('support');
                        setRating(0);
                      }}
                      className="w-full h-12 rounded-full font-semibold"
                      style={{
                        background: colors.iconColor,
                        color: theme === 'dark' ? '#0F0F23' : '#FFFFFF',
                      }}
                      aria-label="Contact support"
                    >
                      <MessageCircle className="w-5 h-5 mr-2" />
                      Contact Support
                    </Button>
                    <Button
                      onClick={() => {
                        setSelectedType('feature');
                        setRating(0);
                      }}
                      variant="ghost"
                      className="w-full h-12 rounded-full"
                      style={{ color: colors.textSecondary }}
                      aria-label="Suggest improvements"
                    >
                      Suggest Improvements
                    </Button>
                  </>
                )}
              </motion.div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Community Guidelines Screen
  if (selectedType === 'guidelines') {
    return (
      <div 
        className="h-full flex flex-col"
        style={{ background: colors.bg, color: colors.textPrimary }}
        role="main"
        aria-labelledby="guidelines-title"
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
              onClick={() => setSelectedType(null)}
              style={{ color: colors.textSecondary }}
              aria-label="Back to feedback options"
            >
              <X className="w-6 h-6" />
            </Button>
            <div className="flex-1 min-w-0">
              <h1 
                id="guidelines-title" 
                className="text-xl sm:text-2xl font-bold"
                style={{ fontFamily: 'Poppins, sans-serif' }}
              >
                Community Guidelines
              </h1>
              <p className="text-sm" style={{ color: colors.textSecondary }}>
                Building a respectful learning community
              </p>
            </div>
          </div>
        </div>

        {/* Scrollable Guidelines */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6">
          {/* Introduction */}
          <div 
            className="rounded-xl p-5 mb-6"
            style={{ background: colors.iconBg }}
          >
            <div className="flex items-start gap-3 mb-3">
              <Users className="w-6 h-6 flex-shrink-0" style={{ color: colors.iconColor }} aria-hidden="true" />
              <div>
                <h2 className="font-semibold mb-2" style={{ color: colors.textPrimary }}>
                  Welcome to Our Community
                </h2>
                <p className="text-sm" style={{ color: colors.textSecondary }}>
                  Sign Learn AR is committed to creating a safe, inclusive, and supportive environment for all learners. By using our app, you agree to follow these community guidelines.
                </p>
              </div>
            </div>
          </div>

          {/* Guidelines List */}
          <div className="space-y-4">
            {communityGuidelines.map((guideline, index) => {
              const Icon = guideline.icon;
              return (
                <motion.div
                  key={index}
                  className="rounded-xl p-5"
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
                  <div className="flex items-start gap-4">
                    <div 
                      className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                      style={{ background: colors.iconBg }}
                      aria-hidden="true"
                    >
                      <Icon className="w-6 h-6" style={{ color: colors.iconColor }} />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold mb-2" style={{ color: colors.textPrimary }}>
                        {guideline.title}
                      </h3>
                      <p className="text-sm" style={{ color: colors.textSecondary }}>
                        {guideline.description}
                      </p>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Enforcement */}
          <div 
            className="rounded-xl p-5 mt-6"
            style={{ background: colors.warningBg }}
          >
            <div className="flex items-start gap-3">
              <AlertCircle className="w-6 h-6 flex-shrink-0" style={{ color: colors.warningColor }} aria-hidden="true" />
              <div>
                <h2 className="font-semibold mb-2" style={{ color: colors.textPrimary }}>
                  Enforcement
                </h2>
                <p className="text-sm mb-3" style={{ color: colors.textSecondary }}>
                  Violations of these guidelines may result in:
                </p>
                <ul className="space-y-2 text-sm" style={{ color: colors.textSecondary }} role="list">
                  <li className="flex items-start gap-2">
                    <span aria-hidden="true">•</span>
                    <span>Warning from our moderation team</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span aria-hidden="true">•</span>
                    <span>Temporary suspension of community features</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span aria-hidden="true">•</span>
                    <span>Permanent ban from the platform for severe violations</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Contact */}
          <div 
            className="rounded-xl p-5 mt-6"
            style={{ background: colors.successBg }}
          >
            <div className="flex items-start gap-3">
              <CheckCircle className="w-6 h-6 flex-shrink-0" style={{ color: colors.successColor }} aria-hidden="true" />
              <div>
                <h2 className="font-semibold mb-2" style={{ color: colors.textPrimary }}>
                  Questions or Concerns?
                </h2>
                <p className="text-sm mb-3" style={{ color: colors.textSecondary }}>
                  If you have questions about these guidelines or need to report a violation, please contact our support team.
                </p>
                <Button
                  onClick={() => setSelectedType('support')}
                  variant="ghost"
                  className="h-10 rounded-full font-semibold"
                  style={{ color: colors.successColor }}
                  aria-label="Contact support"
                >
                  <MessageCircle className="w-4 h-4 mr-2" />
                  Contact Support
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Main Menu
  return (
    <div 
      className="h-full flex flex-col"
      style={{ background: colors.bg, color: colors.textPrimary }}
      role="main"
      aria-labelledby="feedback-support-title"
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
            onClick={onExit}
            style={{ color: colors.textSecondary }}
            aria-label="Close feedback and support"
          >
            <X className="w-6 h-6" />
          </Button>
          <div className="flex-1 min-w-0">
            <h1 
              id="feedback-support-title" 
              className="text-xl sm:text-2xl font-bold"
              style={{ fontFamily: 'Poppins, sans-serif' }}
            >
              Feedback & Support
            </h1>
            <p className="text-sm" style={{ color: colors.textSecondary }}>
              We're here to help
            </p>
          </div>
        </div>
      </div>

      {/* Options */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6">
        <div className="space-y-3">
          {feedbackOptions.map((option, index) => {
            const Icon = option.icon;
            return (
              <motion.button
                key={option.id}
                onClick={() => setSelectedType(option.id as FeedbackType)}
                className="w-full rounded-xl p-5 text-left transition-all"
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
                aria-label={`${option.title}: ${option.description}`}
              >
                <div className="flex items-center gap-4">
                  <div 
                    className="w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{ background: option.bgColor }}
                    aria-hidden="true"
                  >
                    <Icon className="w-7 h-7" style={{ color: option.color }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold mb-1" style={{ color: colors.textPrimary }}>
                      {option.title}
                    </div>
                    <div className="text-sm" style={{ color: colors.textSecondary }}>
                      {option.description}
                    </div>
                  </div>
                  <ChevronRight className="w-6 h-6 flex-shrink-0" style={{ color: colors.textTertiary }} aria-hidden="true" />
                </div>
              </motion.button>
            );
          })}
        </div>

        {/* Quick Info */}
        <div 
          className="rounded-xl p-5 mt-6"
          style={{ background: colors.iconBg }}
        >
          <div className="flex items-start gap-3">
            <Info className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: colors.iconColor }} aria-hidden="true" />
            <div>
              <div className="font-semibold mb-2 text-sm" style={{ color: colors.textPrimary }}>
                We Value Your Feedback
              </div>
              <div className="text-xs" style={{ color: colors.textSecondary }}>
                Your input helps us improve Sign Learn AR for everyone. We read every piece of feedback and use it to make the app better.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
