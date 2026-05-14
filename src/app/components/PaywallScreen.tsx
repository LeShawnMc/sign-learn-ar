import { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, 
  Crown,
  Check,
  Lock,
  Unlock,
  Sparkles,
  Zap,
  Users,
  Star,
  TrendingUp,
  Award,
  Target,
  Infinity as InfinityIcon,
  Video,
  BookOpen,
  MessageCircle,
  Globe,
  Shield,
  Clock,
  ChevronLeft,
  ChevronRight,
  Gift,
  UserPlus,
  Mail,
  Copy,
  Share2,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { track } from '../../lib/analytics';

type PaywallView =
  | 'comparison'
  | 'daily-limit'
  | 'trial'
  | 'family'
  | 'checkout'
  | 'success';

type PlanTier = 'premium' | 'pro' | 'family';

interface PlanFeature {
  name: string;
  free: boolean | string;
  premium: boolean | string;
  pro: boolean | string;
}

interface FeatureHighlight {
  id: string;
  title: string;
  description: string;
  icon: string;
  color: string;
}

interface PaywallScreenProps {
  onExit: () => void;
  initialView?: PaywallView;
  limitType?: 'daily-lessons' | 'practice-sessions' | 'ar-features';
}

export function PaywallScreen({ onExit, initialView = 'comparison', limitType }: PaywallScreenProps) {
  const { upgradeToPremium, userProgress } = useApp();
  const [currentView, setCurrentView] = useState<PaywallView>(initialView);
  const [selectedPlan, setSelectedPlan] = useState<'monthly' | 'yearly'>('yearly');
  const [selectedTier, setSelectedTier] = useState<PlanTier>('premium');
  const [carouselIndex, setCarouselIndex] = useState(0);
  const [showAllFeatures, setShowAllFeatures] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');
  const [invitesSent, setInvitesSent] = useState(0);
  const [familyCode] = useState('FAMILY-2024');
  const [codeCopied, setCodeCopied] = useState(false);
  const [isActivating, setIsActivating] = useState(false);

  // Feature comparison data
  const planFeatures: PlanFeature[] = [
    {
      name: 'Basic Lessons',
      free: '3 per day',
      premium: 'Unlimited',
      pro: 'Unlimited',
    },
    {
      name: 'AR Hand Tracking',
      free: '5 min/day',
      premium: 'Unlimited',
      pro: 'Unlimited',
    },
    {
      name: 'Practice Sessions',
      free: '1 per day',
      premium: 'Unlimited',
      pro: 'Unlimited',
    },
    {
      name: 'Vocabulary Library',
      free: '50 signs',
      premium: '500+ signs',
      pro: '1000+ signs',
    },
    {
      name: 'Social Practice Rooms',
      free: false,
      premium: true,
      pro: true,
    },
    {
      name: 'AR Scavenger Hunt',
      free: '1 game/week',
      premium: 'Unlimited',
      pro: 'Unlimited',
    },
    {
      name: 'Offline Mode',
      free: false,
      premium: true,
      pro: true,
    },
    {
      name: 'Progress Analytics',
      free: 'Basic',
      premium: 'Advanced',
      pro: 'Advanced',
    },
    {
      name: 'Multiple Sign Languages',
      free: '1 language',
      premium: 'All languages',
      pro: 'All languages',
    },
    {
      name: 'Custom Learning Path',
      free: false,
      premium: false,
      pro: true,
    },
    {
      name: 'Personal Tutor Sessions',
      free: false,
      premium: false,
      pro: '2 per month',
    },
    {
      name: 'Priority Support',
      free: false,
      premium: 'Email',
      pro: '24/7 Chat',
    },
    {
      name: 'Family Sharing',
      free: false,
      premium: false,
      pro: 'Up to 6 members',
    },
    {
      name: 'Certificate Program',
      free: false,
      premium: false,
      pro: true,
    },
    {
      name: 'Ad-Free Experience',
      free: false,
      premium: true,
      pro: true,
    },
  ];

  // Feature highlights for carousel
  const featureHighlights: FeatureHighlight[] = [
    {
      id: 'unlimited-learning',
      title: 'Unlimited Learning',
      description: 'Access all lessons, practice sessions, and AR features without daily limits',
      icon: '♾️',
      color: 'from-blue-600 to-blue-800',
    },
    {
      id: 'social-practice',
      title: 'Social Practice Rooms',
      description: 'Join live practice sessions with learners worldwide and improve together',
      icon: '👥',
      color: 'from-purple-600 to-purple-800',
    },
    {
      id: 'multiple-languages',
      title: 'All Sign Languages',
      description: 'Learn ASL, BSL, ISL, and LSF with comprehensive lessons for each',
      icon: '🌍',
      color: 'from-green-600 to-green-800',
    },
    {
      id: 'ar-features',
      title: 'Advanced AR Features',
      description: 'Full access to AR hand tracking, vocabulary tagging, and scavenger hunts',
      icon: '📱',
      color: 'from-orange-600 to-orange-800',
    },
    {
      id: 'offline-mode',
      title: 'Offline Access',
      description: 'Download lessons and practice anywhere, even without internet',
      icon: '📥',
      color: 'from-pink-600 to-pink-800',
    },
    {
      id: 'analytics',
      title: 'Advanced Analytics',
      description: 'Track your progress with detailed insights and personalized recommendations',
      icon: '📊',
      color: 'from-teal-600 to-teal-800',
    },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCarouselIndex((prev) => (prev + 1) % featureHighlights.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [featureHighlights.length]);

  const handleCopyCode = async () => {
    try {
      await navigator.clipboard.writeText(familyCode);
    } catch {
      // clipboard API unavailable — still show visual feedback
    }
    setCodeCopied(true);
    setTimeout(() => setCodeCopied(false), 2000);
  };

  const handleSendInvite = async () => {
    if (!inviteEmail) return;
    const subject = encodeURIComponent('Join my Sign Learn AR Family Plan!');
    const body = encodeURIComponent(
      `Hi!\n\nI'd like to invite you to join my Sign Learn AR family plan.\n\nUse this code to join: ${familyCode}\n\nDownload the app at https://sign-learn-ar.vercel.app\n\nSee you there! 🤟`,
    );
    if (navigator.share) {
      try {
        await navigator.share({ title: 'Sign Learn AR Family Invite', text: `Join my family plan! Code: ${familyCode}` });
      } catch { /* cancelled */ }
    } else {
      window.open(`mailto:${inviteEmail}?subject=${subject}&body=${body}`, '_self');
    }
    setInvitesSent(prev => prev + 1);
    setInviteEmail('');
  };

  const tierPrice = (tier: PlanTier) => {
    const prices: Record<PlanTier, { monthly: string; yearly: string }> = {
      premium: { monthly: '9.99', yearly: '5.99' },
      pro:     { monthly: '14.99', yearly: '9.99' },
      family:  { monthly: '19.99', yearly: '14.99' },
    };
    return prices[tier][selectedPlan];
  };

  const tierLabel = (tier: PlanTier) =>
    tier === 'family' ? 'Family Plan' : tier === 'pro' ? 'Pro' : 'Premium';

  const tierColor = (tier: PlanTier) =>
    tier === 'family' ? 'from-pink-600 to-pink-800'
    : tier === 'pro'  ? 'from-purple-600 to-purple-800'
    : 'from-blue-600 to-blue-800';

  const startTrial = (tier: PlanTier) => {
    setSelectedTier(tier);
    track('upgrade_started', { tier, billing: selectedPlan });
    setCurrentView('checkout');
  };

  const handleActivate = async () => {
    setIsActivating(true);
    await new Promise(r => setTimeout(r, 1200)); // simulate brief processing
    upgradeToPremium();
    track('upgrade_completed', { tier: selectedTier, billing: selectedPlan });
    setIsActivating(false);
    setCurrentView('success');
  };

  const getLimitMessage = () => {
    switch (limitType) {
      case 'daily-lessons':
        return {
          title: 'Daily Lesson Limit Reached',
          subtitle: "You've completed 3 lessons today",
          description: 'Upgrade to Premium for unlimited lessons and faster learning progress',
        };
      case 'practice-sessions':
        return {
          title: 'Practice Limit Reached',
          subtitle: "You've used your daily practice session",
          description: 'Premium members get unlimited practice sessions to master signs faster',
        };
      case 'ar-features':
        return {
          title: 'AR Time Limit Reached',
          subtitle: "You've used your 5 minutes of AR today",
          description: 'Unlock unlimited AR hand tracking and vocabulary tagging with Premium',
        };
      default:
        return {
          title: 'Unlock Premium Features',
          subtitle: 'Get unlimited access to everything',
          description: 'Upgrade now to continue your learning journey without limits',
        };
    }
  };

  const limitMessage = getLimitMessage();

  // Comparison Chart View
  if (currentView === 'comparison') {
    const displayedFeatures = showAllFeatures ? planFeatures : planFeatures.slice(0, 8);

    return (
      <div 
        className="min-h-screen bg-black text-white flex flex-col"
        role="main"
        aria-labelledby="paywall-title"
      >
        {/* Header */}
        <div className="p-6 pb-4">
          <div className="flex items-center justify-between mb-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={onExit}
              className="w-10 h-10 rounded-full hover:bg-gray-900"
              aria-label="Close upgrade screen"
            >
              <X className="w-5 h-5" />
            </Button>
            <h1 id="paywall-title" className="text-xl font-bold">Upgrade Plan</h1>
            <div className="w-10" aria-hidden="true" />
          </div>

          {/* Hero Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-6"
          >
            <motion.div
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              className="text-6xl mb-4"
              aria-hidden="true"
            >
              👑
            </motion.div>
            <h2 className="text-2xl font-bold mb-2">Learn Without Limits</h2>
            <p className="text-gray-400">
              Choose the perfect plan for your sign language journey
            </p>
          </motion.div>

          {/* Billing Toggle */}
          <div className="flex items-center justify-center gap-3 mb-6">
            <button
              onClick={() => setSelectedPlan('monthly')}
              className={`px-6 py-2 rounded-full font-semibold transition-colors ${
                selectedPlan === 'monthly'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-900 text-gray-400 hover:text-white'
              }`}
              aria-pressed={selectedPlan === 'monthly'}
            >
              Monthly
            </button>
            <button
              onClick={() => setSelectedPlan('yearly')}
              className={`px-6 py-2 rounded-full font-semibold transition-colors relative ${
                selectedPlan === 'yearly'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-900 text-gray-400 hover:text-white'
              }`}
              aria-pressed={selectedPlan === 'yearly'}
            >
              Yearly
              <span className="absolute -top-2 -right-2 bg-green-600 text-white text-xs px-2 py-0.5 rounded-full">
                Save 40%
              </span>
            </button>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="px-6 mb-6">
          <div className="grid grid-cols-3 gap-3">
            {/* Free Plan */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-gray-900 rounded-xl p-4 text-center"
            >
              <div className="text-2xl mb-2" aria-hidden="true">🌱</div>
              <h3 className="font-bold mb-1">Free</h3>
              <div className="text-2xl font-bold mb-1">$0</div>
              <div className="text-xs text-gray-400 mb-3">Forever</div>
              <Button
                variant="outline"
                size="sm"
                className="w-full text-xs border-gray-700"
                disabled
                aria-label="Current plan: Free"
              >
                Current Plan
              </Button>
            </motion.div>

            {/* Premium Plan */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-gradient-to-br from-blue-600 to-blue-800 rounded-xl p-4 text-center relative"
            >
              <div className="absolute -top-2 left-1/2 -translate-x-1/2 bg-yellow-500 text-black text-xs px-3 py-1 rounded-full font-bold">
                Popular
              </div>
              <div className="text-2xl mb-2" aria-hidden="true">⚡</div>
              <h3 className="font-bold mb-1">Premium</h3>
              <div className="text-2xl font-bold mb-1">
                ${selectedPlan === 'monthly' ? '9.99' : '5.99'}
              </div>
              <div className="text-xs opacity-90 mb-3">per month</div>
              <Button
                size="sm"
                className="w-full text-xs bg-white text-blue-600 hover:bg-gray-100"
                onClick={() => startTrial('premium')}
                aria-label="Start Premium trial"
              >
                {userProgress.isPremium ? 'Current Plan' : 'Start Trial'}
              </Button>
            </motion.div>

            {/* Pro Plan */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-gradient-to-br from-purple-600 to-purple-800 rounded-xl p-4 text-center"
            >
              <div className="text-2xl mb-2" aria-hidden="true">🔥</div>
              <h3 className="font-bold mb-1">Pro</h3>
              <div className="text-2xl font-bold mb-1">
                ${selectedPlan === 'monthly' ? '14.99' : '9.99'}
              </div>
              <div className="text-xs opacity-90 mb-3">per month</div>
              <Button
                size="sm"
                className="w-full text-xs bg-white text-purple-600 hover:bg-gray-100"
                onClick={() => startTrial('pro')}
                aria-label="Start Pro trial"
              >
                Start Trial
              </Button>
            </motion.div>
          </div>
        </div>

        {/* Feature Comparison Table */}
        <div className="flex-1 px-6 pb-6 overflow-y-auto">
          <h3 className="text-lg font-semibold mb-4">Compare Plans</h3>
          
          <div className="space-y-2">
            {displayedFeatures.map((feature, index) => (
              <motion.div
                key={feature.name}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.03 }}
                className="bg-gray-900 rounded-lg p-3"
              >
                <div className="font-semibold text-sm mb-2">{feature.name}</div>
                <div className="grid grid-cols-3 gap-2 text-xs">
                  <div className="text-center">
                    {typeof feature.free === 'boolean' ? (
                      feature.free ? (
                        <Check className="w-4 h-4 text-green-500 mx-auto" aria-label="Included" />
                      ) : (
                        <X className="w-4 h-4 text-gray-600 mx-auto" aria-label="Not included" />
                      )
                    ) : (
                      <span className="text-gray-400">{feature.free}</span>
                    )}
                  </div>
                  <div className="text-center">
                    {typeof feature.premium === 'boolean' ? (
                      feature.premium ? (
                        <Check className="w-4 h-4 text-blue-500 mx-auto" aria-label="Included" />
                      ) : (
                        <X className="w-4 h-4 text-gray-600 mx-auto" aria-label="Not included" />
                      )
                    ) : (
                      <span className="text-blue-400 font-semibold">{feature.premium}</span>
                    )}
                  </div>
                  <div className="text-center">
                    {typeof feature.pro === 'boolean' ? (
                      feature.pro ? (
                        <Check className="w-4 h-4 text-purple-500 mx-auto" aria-label="Included" />
                      ) : (
                        <X className="w-4 h-4 text-gray-600 mx-auto" aria-label="Not included" />
                      )
                    ) : (
                      <span className="text-purple-400 font-semibold">{feature.pro}</span>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Show More/Less */}
          <Button
            onClick={() => setShowAllFeatures(!showAllFeatures)}
            variant="ghost"
            className="w-full mt-4 text-blue-500"
            aria-expanded={showAllFeatures}
            aria-label={showAllFeatures ? 'Show fewer features' : 'Show all features'}
          >
            {showAllFeatures ? (
              <>
                Show Less <ChevronUp className="w-4 h-4 ml-2" />
              </>
            ) : (
              <>
                Show All Features <ChevronDown className="w-4 h-4 ml-2" />
              </>
            )}
          </Button>

          {/* Family Plan CTA */}
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            onClick={() => { setSelectedTier('family'); setCurrentView('family'); }}
            className="w-full bg-gradient-to-r from-pink-600 to-pink-800 rounded-xl p-5 mt-6 text-left"
            aria-label="View family plan options"
          >
            <div className="flex items-center gap-3 mb-2">
              <Users className="w-6 h-6" />
              <h3 className="font-bold text-lg">Family Plan</h3>
            </div>
            <p className="text-sm opacity-90 mb-2">
              Share with up to 6 family members at a discounted rate
            </p>
            <div className="flex items-center justify-between">
              <span className="text-xl font-bold">
                ${selectedPlan === 'monthly' ? '19.99' : '14.99'}/month
              </span>
              <ChevronRight className="w-5 h-5" />
            </div>
          </motion.button>
        </div>
      </div>
    );
  }

  // Daily Limit Soft Paywall
  if (currentView === 'daily-limit') {
    return (
      <div 
        className="min-h-screen bg-black text-white flex flex-col"
        role="main"
        aria-labelledby="limit-title"
      >
        {/* Header */}
        <div className="p-6 flex items-center justify-between">
          <Button
            variant="ghost"
            size="icon"
            onClick={onExit}
            className="w-10 h-10 rounded-full hover:bg-gray-900"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </Button>
          <div className="w-10" aria-hidden="true" />
        </div>

        {/* Limit Message */}
        <div className="flex-1 flex flex-col items-center justify-center px-6">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", duration: 0.6 }}
            className="w-32 h-32 rounded-full bg-gray-900 flex items-center justify-center mb-6"
            aria-hidden="true"
          >
            <Lock className="w-16 h-16 text-gray-600" />
          </motion.div>

          <motion.h1
            id="limit-title"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-2xl font-bold text-center mb-2"
          >
            {limitMessage.title}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-lg text-gray-400 text-center mb-2"
          >
            {limitMessage.subtitle}
          </motion.p>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-sm text-gray-500 text-center mb-8"
          >
            {limitMessage.description}
          </motion.p>

          {/* Feature Carousel */}
          <div className="w-full max-w-md mb-8">
            <AnimatePresence mode="wait">
              <motion.div
                key={carouselIndex}
                initial={{ opacity: 0, x: 100 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -100 }}
                transition={{ duration: 0.3 }}
                className={`bg-gradient-to-br ${featureHighlights[carouselIndex].color} rounded-2xl p-6 text-center`}
              >
                <div className="text-5xl mb-3" aria-hidden="true">
                  {featureHighlights[carouselIndex].icon}
                </div>
                <h3 className="text-xl font-bold mb-2">
                  {featureHighlights[carouselIndex].title}
                </h3>
                <p className="text-sm opacity-90">
                  {featureHighlights[carouselIndex].description}
                </p>
              </motion.div>
            </AnimatePresence>

            {/* Carousel Indicators */}
            <div className="flex items-center justify-center gap-2 mt-4" role="tablist" aria-label="Feature highlights">
              {featureHighlights.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCarouselIndex(index)}
                  className={`h-2 rounded-full transition-all ${
                    index === carouselIndex ? 'w-8 bg-blue-500' : 'w-2 bg-gray-700'
                  }`}
                  role="tab"
                  aria-selected={index === carouselIndex}
                  aria-label={`Feature ${index + 1}`}
                />
              ))}
            </div>
          </div>

          {/* Options */}
          <div className="w-full max-w-md space-y-3">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <Button
                onClick={() => startTrial('premium')}
                className="w-full bg-blue-600 hover:bg-blue-700 h-14 text-lg font-semibold rounded-full"
                aria-label="Try Premium free for 7 days"
              >
                <Sparkles className="w-5 h-5 mr-2" />
                Try Premium Free for 7 Days
              </Button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              <Button
                onClick={() => setCurrentView('comparison')}
                variant="outline"
                className="w-full h-12 border-gray-700"
                aria-label="View all plans"
              >
                View All Plans
              </Button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
            >
              <Button
                onClick={onExit}
                variant="ghost"
                className="w-full h-12 text-gray-400 hover:text-white"
                aria-label="Continue with free plan"
              >
                Continue with Free
              </Button>
            </motion.div>
          </div>
        </div>

        {/* Trust Indicators */}
        <div className="p-6 border-t border-gray-900">
          <div className="flex items-center justify-center gap-6 text-xs text-gray-500">
            <div className="flex items-center gap-1">
              <Shield className="w-4 h-4" />
              <span>Secure</span>
            </div>
            <div className="flex items-center gap-1">
              <Star className="w-4 h-4" />
              <span>4.9/5 Rating</span>
            </div>
            <div className="flex items-center gap-1">
              <Users className="w-4 h-4" />
              <span>1M+ Users</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 7-Day Free Trial Offer
  if (currentView === 'trial') {
    return (
      <div 
        className="min-h-screen bg-black text-white flex flex-col"
        role="main"
        aria-labelledby="trial-title"
      >
        {/* Header */}
        <div className="p-6 flex items-center justify-between">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setCurrentView('comparison')}
            className="w-10 h-10 rounded-full hover:bg-gray-900"
            aria-label="Back to plans"
          >
            <ChevronLeft className="w-5 h-5" />
          </Button>
          <h1 id="trial-title" className="text-xl font-bold">Start Free Trial</h1>
          <Button
            variant="ghost"
            size="icon"
            onClick={onExit}
            className="w-10 h-10 rounded-full hover:bg-gray-900"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* Trial Offer Hero */}
        <div className="px-6 mb-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className={`bg-gradient-to-br ${tierColor(selectedTier)} rounded-2xl p-8 text-center relative overflow-hidden`}
          >
            {/* Sparkle decorations */}
            <motion.div
              animate={{ 
                rotate: 360,
                scale: [1, 1.2, 1]
              }}
              transition={{ 
                rotate: { duration: 20, repeat: Infinity, ease: "linear" },
                scale: { duration: 2, repeat: Infinity, ease: "easeInOut" }
              }}
              className="absolute top-4 right-4 text-2xl"
              aria-hidden="true"
            >
              ✨
            </motion.div>
            <motion.div
              animate={{ 
                rotate: -360,
                scale: [1, 1.3, 1]
              }}
              transition={{ 
                rotate: { duration: 15, repeat: Infinity, ease: "linear" },
                scale: { duration: 3, repeat: Infinity, ease: "easeInOut" }
              }}
              className="absolute bottom-4 left-4 text-2xl"
              aria-hidden="true"
            >
              💎
            </motion.div>

            <div className="text-6xl mb-4" aria-hidden="true">🎁</div>
            <h2 className="text-3xl font-bold mb-2">7 Days Free</h2>
            <p className="text-lg opacity-90 mb-2">
              Full access to {tierLabel(selectedTier)} features
            </p>
            <div className="inline-block bg-white/20 backdrop-blur-sm rounded-full px-4 py-2">
              <p className="text-sm font-semibold">
                Then ${tierPrice(selectedTier)}/month ({selectedPlan})
              </p>
            </div>
          </motion.div>
        </div>

        {/* What You Get */}
        <div className="px-6 mb-6">
          <h3 className="text-lg font-semibold mb-4">What's Included</h3>
          <div className="space-y-3">
            {[
              { icon: <InfinityIcon className="w-5 h-5" />, text: 'Unlimited lessons and practice sessions', color: 'text-blue-500' },
              { icon: <Users className="w-5 h-5" />, text: 'Social practice rooms with live learners', color: 'text-purple-500' },
              { icon: <Globe className="w-5 h-5" />, text: 'All sign languages (ASL, BSL, ISL, LSF)', color: 'text-green-500' },
              { icon: <Video className="w-5 h-5" />, text: 'Full AR features with hand tracking', color: 'text-orange-500' },
              { icon: <BookOpen className="w-5 h-5" />, text: '500+ sign vocabulary library', color: 'text-pink-500' },
              { icon: <TrendingUp className="w-5 h-5" />, text: 'Advanced progress analytics', color: 'text-teal-500' },
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-gray-900 rounded-xl p-4 flex items-center gap-3"
              >
                <div className={`${item.color}`}>
                  {item.icon}
                </div>
                <span className="text-sm">{item.text}</span>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Trial Timeline */}
        <div className="px-6 mb-6">
          <div className="bg-gray-900 rounded-xl p-5">
            <h4 className="font-semibold mb-4">How It Works</h4>
            <div className="space-y-4">
              <div className="flex gap-4">
                <div className="flex flex-col items-center">
                  <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center flex-shrink-0">
                    <span className="text-sm font-bold">1</span>
                  </div>
                  <div className="w-0.5 h-full bg-gray-800 mt-2" aria-hidden="true" />
                </div>
                <div className="pb-4">
                  <div className="font-semibold mb-1">Today</div>
                  <p className="text-sm text-gray-400">Start your 7-day free trial</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="flex flex-col items-center">
                  <div className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center flex-shrink-0">
                    <span className="text-sm font-bold">2</span>
                  </div>
                  <div className="w-0.5 h-full bg-gray-800 mt-2" aria-hidden="true" />
                </div>
                <div className="pb-4">
                  <div className="font-semibold mb-1">Day 5</div>
                  <p className="text-sm text-gray-400">We'll remind you before trial ends</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center flex-shrink-0">
                  <span className="text-sm font-bold">3</span>
                </div>
                <div>
                  <div className="font-semibold mb-1">Day 7</div>
                  <p className="text-sm text-gray-400">Billing starts (cancel anytime before)</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="flex-1" />
        <div className="p-6 border-t border-gray-900 space-y-3">
          <Button
            onClick={() => setCurrentView('checkout')}
            className={`w-full h-14 text-lg font-semibold rounded-full bg-gradient-to-r ${tierColor(selectedTier)} hover:opacity-90 border-0`}
            aria-label="Start 7-day free trial"
          >
            <Gift className="w-5 h-5 mr-2" />
            Start My Free Trial
          </Button>

          <div className="text-center">
            <p className="text-xs text-gray-500 mb-2">
              Cancel anytime during trial period at no charge
            </p>
            <button
              onClick={() => setCurrentView('comparison')}
              className="text-xs text-blue-500 hover:underline"
            >
              View other plans
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Family Plan Invitation
  if (currentView === 'family') {
    return (
      <div 
        className="min-h-screen bg-black text-white flex flex-col"
        role="main"
        aria-labelledby="family-title"
      >
        {/* Header */}
        <div className="p-6 flex items-center justify-between">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setCurrentView('comparison')}
            className="w-10 h-10 rounded-full hover:bg-gray-900"
            aria-label="Back to plans"
          >
            <ChevronLeft className="w-5 h-5" />
          </Button>
          <h1 id="family-title" className="text-xl font-bold">Family Plan</h1>
          <Button
            variant="ghost"
            size="icon"
            onClick={onExit}
            className="w-10 h-10 rounded-full hover:bg-gray-900"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* Family Plan Hero */}
        <div className="px-6 mb-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-gradient-to-br from-pink-600 to-pink-800 rounded-2xl p-8 text-center"
          >
            <div className="text-6xl mb-4" aria-hidden="true">👨‍👩‍👧‍👦</div>
            <h2 className="text-3xl font-bold mb-2">Learn Together</h2>
            <p className="text-lg opacity-90 mb-4">
              Share Premium with up to 6 family members
            </p>
            <div className="flex items-center justify-center gap-4">
              <div>
                <div className="text-3xl font-bold">
                  ${selectedPlan === 'monthly' ? '19.99' : '14.99'}
                </div>
                <div className="text-sm opacity-90">per month</div>
              </div>
              <div className="bg-white/20 rounded-lg px-4 py-2">
                <div className="text-sm font-semibold">Save 25%</div>
                <div className="text-xs opacity-80">vs individual plans</div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Family Plan Benefits */}
        <div className="px-6 mb-6">
          <h3 className="text-lg font-semibold mb-4">Family Benefits</h3>
          <div className="space-y-3">
            {[
              { icon: <Users className="w-5 h-5" />, title: 'Up to 6 Members', desc: 'Share with family across all devices' },
              { icon: <Crown className="w-5 h-5" />, title: 'Full Premium Access', desc: 'Everyone gets all Premium features' },
              { icon: <Award className="w-5 h-5" />, title: 'Individual Progress', desc: 'Separate accounts and tracking' },
              { icon: <Shield className="w-5 h-5" />, title: 'Parental Controls', desc: 'Manage family member settings' },
            ].map((benefit, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-gray-900 rounded-xl p-4"
              >
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-full bg-pink-600/20 flex items-center justify-center flex-shrink-0 text-pink-500">
                    {benefit.icon}
                  </div>
                  <div className="flex-1">
                    <div className="font-semibold mb-1">{benefit.title}</div>
                    <p className="text-sm text-gray-400">{benefit.desc}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Invite Members */}
        <div className="px-6 mb-6">
          <div className="bg-gray-900 rounded-xl p-5">
            <h4 className="font-semibold mb-4">Invite Family Members</h4>
            
            {/* Share Code */}
            <div className="bg-gray-800 rounded-lg p-4 mb-4">
              <div className="text-sm text-gray-400 mb-2">Family Invite Code</div>
              <div className="flex items-center gap-3">
                <div className="flex-1 bg-gray-900 rounded-lg px-4 py-3 font-mono text-lg font-bold">
                  {familyCode}
                </div>
                <Button
                  onClick={handleCopyCode}
                  size="icon"
                  className="w-12 h-12 bg-blue-600 hover:bg-blue-700"
                  aria-label={codeCopied ? 'Code copied' : 'Copy family code'}
                >
                  {codeCopied ? (
                    <Check className="w-5 h-5" />
                  ) : (
                    <Copy className="w-5 h-5" />
                  )}
                </Button>
              </div>
            </div>

            {/* Email Invite */}
            <div className="mb-4">
              <label htmlFor="invite-email" className="block text-sm text-gray-400 mb-2">
                Or send email invitation
              </label>
              <div className="flex gap-2">
                <input
                  id="invite-email"
                  type="email"
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  placeholder="family@example.com"
                  className="flex-1 bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
                />
                <Button
                  onClick={handleSendInvite}
                  disabled={!inviteEmail}
                  className="bg-blue-600 hover:bg-blue-700 px-6"
                  aria-label="Send invitation"
                >
                  <Mail className="w-5 h-5" />
                </Button>
              </div>
            </div>

            {/* Invites Sent Counter */}
            {invitesSent > 0 && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-green-600/20 border border-green-600/30 rounded-lg p-3 flex items-center gap-2"
              >
                <Check className="w-5 h-5 text-green-500" />
                <span className="text-sm text-green-500 font-semibold">
                  {invitesSent} {invitesSent === 1 ? 'invitation' : 'invitations'} sent
                </span>
              </motion.div>
            )}

            {/* Current Members */}
            <div className="mt-4 pt-4 border-t border-gray-800">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm text-gray-400">Family Members</span>
                <span className="text-sm font-semibold">1/6</span>
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-3 bg-gray-800 rounded-lg p-3">
                  <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center">
                    <span className="text-lg">👤</span>
                  </div>
                  <div className="flex-1">
                    <div className="font-semibold">You</div>
                    <div className="text-xs text-gray-400">Owner</div>
                  </div>
                  <Crown className="w-5 h-5 text-yellow-500" aria-label="Plan owner" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="flex-1" />
        <div className="p-6 border-t border-gray-900 space-y-3">
          <Button
            onClick={() => startTrial('family')}
            className="w-full bg-pink-600 hover:bg-pink-700 h-14 text-lg font-semibold rounded-full"
            aria-label="Start family plan"
          >
            <Users className="w-5 h-5 mr-2" />
            Start Family Plan
          </Button>
          <Button
            onClick={() => setCurrentView('comparison')}
            variant="ghost"
            className="w-full h-12 text-gray-400 hover:text-white"
            aria-label="View other plans"
          >
            View Individual Plans
          </Button>
        </div>
      </div>
    );
  }

  // ── Checkout View ───────────────────────────────────────────────────────────
  if (currentView === 'checkout') {
    const isTrial = selectedTier !== 'family' || true; // always trial for now
    return (
      <div className="min-h-screen bg-black text-white flex flex-col" role="main" aria-labelledby="checkout-title">
        {/* Header */}
        <div className="p-6 flex items-center justify-between">
          <Button variant="ghost" size="icon" onClick={() => setCurrentView(selectedTier === 'family' ? 'family' : 'trial')} className="w-10 h-10 rounded-full hover:bg-gray-900" aria-label="Back">
            <ChevronLeft className="w-5 h-5" />
          </Button>
          <h1 id="checkout-title" className="text-xl font-bold">Confirm Plan</h1>
          <Button variant="ghost" size="icon" onClick={onExit} className="w-10 h-10 rounded-full hover:bg-gray-900" aria-label="Close">
            <X className="w-5 h-5" />
          </Button>
        </div>

        <div className="flex-1 px-6 overflow-y-auto pb-6">
          {/* Plan Summary Card */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            className={`bg-gradient-to-br ${tierColor(selectedTier)} rounded-2xl p-6 mb-6`}
          >
            <div className="flex items-center gap-3 mb-4">
              <Crown className="w-8 h-8" />
              <div>
                <div className="text-xl font-bold">{tierLabel(selectedTier)}</div>
                <div className="text-sm opacity-90">{selectedPlan === 'yearly' ? 'Yearly billing' : 'Monthly billing'}</div>
              </div>
            </div>
            <div className="bg-white/20 rounded-xl p-4">
              <div className="flex justify-between items-center mb-2">
                <span className="font-semibold">7-Day Free Trial</span>
                <span className="text-lg font-bold">$0.00</span>
              </div>
              <div className="flex justify-between items-center text-sm opacity-80">
                <span>After trial ends</span>
                <span>${tierPrice(selectedTier)}/month</span>
              </div>
            </div>
          </motion.div>

          {/* Trial terms */}
          <div className="bg-gray-900 rounded-xl p-5 mb-6">
            <h3 className="font-semibold mb-3">What happens next</h3>
            <div className="space-y-3">
              {[
                { day: 'Today', desc: 'Full access to all features unlocks immediately' },
                { day: 'Day 5',  desc: "We'll send a reminder before your trial ends" },
                { day: 'Day 7',  desc: `${tierLabel(selectedTier)} begins at $${tierPrice(selectedTier)}/mo — cancel anytime` },
              ].map(({ day, desc }) => (
                <div key={day} className="flex gap-3">
                  <div className="w-16 text-xs font-bold text-gray-400 pt-0.5 flex-shrink-0">{day}</div>
                  <p className="text-sm text-gray-300">{desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Included features */}
          <div className="bg-gray-900 rounded-xl p-5 mb-6">
            <h3 className="font-semibold mb-3">Included in your trial</h3>
            <div className="space-y-2">
              {[
                'Unlimited lessons & practice sessions',
                'Real-time AR hand tracking',
                selectedTier !== 'premium' ? '1,000+ sign vocabulary library' : '500+ sign vocabulary library',
                'Advanced progress analytics',
                'Offline mode & downloads',
                selectedTier === 'family' ? 'Up to 6 family members' : 'Social practice rooms',
              ].map(f => (
                <div key={f} className="flex items-center gap-2 text-sm">
                  <Check className="w-4 h-4 text-green-500 flex-shrink-0" />
                  <span>{f}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Guarantee */}
          <div className="flex items-start gap-3 bg-green-900/20 border border-green-800/30 rounded-xl p-4 mb-6">
            <Shield className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
            <div>
              <div className="font-semibold text-sm text-green-400 mb-1">Risk-Free Guarantee</div>
              <p className="text-xs text-gray-400">Cancel within 7 days and you will not be charged. No questions asked.</p>
            </div>
          </div>
        </div>

        {/* Activate CTA */}
        <div className="p-6 border-t border-gray-900 space-y-3">
          <Button
            onClick={handleActivate}
            disabled={isActivating}
            className={`w-full h-14 text-lg font-semibold rounded-full bg-gradient-to-r ${tierColor(selectedTier)} border-0 hover:opacity-90 disabled:opacity-60`}
            aria-label="Activate free trial"
          >
            {isActivating ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                Activating…
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5 mr-2" />
                Activate Free Trial
              </>
            )}
          </Button>
          <p className="text-center text-xs text-gray-500">
            Cancel anytime in Settings → Subscription. No charge during trial.
          </p>
        </div>
      </div>
    );
  }

  // ── Success View ─────────────────────────────────────────────────────────────
  if (currentView === 'success') {
    return (
      <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center px-6" role="main">
        {/* Animated celebration */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', duration: 0.7 }}
          className={`w-28 h-28 rounded-full bg-gradient-to-br ${tierColor(selectedTier)} flex items-center justify-center mb-6`}
        >
          <Crown className="w-14 h-14 text-white" />
        </motion.div>

        <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
          className="text-3xl font-bold text-center mb-2"
        >
          {tierLabel(selectedTier)} Activated! 🎉
        </motion.h1>

        <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
          className="text-gray-400 text-center mb-8"
        >
          Your 7-day free trial has started. Enjoy unlimited access to everything.
        </motion.p>

        {/* Unlocked features */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
          className="w-full max-w-sm bg-gray-900 rounded-2xl p-5 mb-8"
        >
          <div className="text-sm font-semibold text-gray-400 mb-3 uppercase tracking-wide">Now Unlocked</div>
          <div className="space-y-3">
            {[
              { icon: '♾️', label: 'Unlimited lessons & practice' },
              { icon: '📱', label: 'Full AR hand tracking' },
              { icon: '🌍', label: 'All sign languages' },
              { icon: '📥', label: 'Offline mode & downloads' },
              { icon: '📊', label: 'Advanced analytics' },
            ].map(({ icon, label }) => (
              <div key={label} className="flex items-center gap-3">
                <span className="text-xl">{icon}</span>
                <span className="text-sm font-medium">{label}</span>
                <Check className="w-4 h-4 text-green-500 ml-auto" />
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
          className="w-full max-w-sm space-y-3"
        >
          <Button
            onClick={onExit}
            className={`w-full h-14 text-lg font-semibold rounded-full bg-gradient-to-r ${tierColor(selectedTier)} border-0`}
            aria-label="Start learning with Premium"
          >
            <Zap className="w-5 h-5 mr-2" />
            Start Learning Now
          </Button>
          <p className="text-center text-xs text-gray-500">
            Manage your subscription anytime in Settings → Subscription
          </p>
        </motion.div>
      </div>
    );
  }

  return null;
}
