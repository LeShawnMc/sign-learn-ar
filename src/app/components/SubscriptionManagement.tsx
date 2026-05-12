import { useState } from 'react';
import { Button } from './ui/button';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, 
  Crown,
  Check,
  ChevronRight,
  TrendingUp,
  Calendar,
  CreditCard,
  Download,
  AlertCircle,
  Gift,
  Zap,
  Users,
  Star,
  BarChart3,
  Clock,
  Target,
  Award,
  Shield,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  RefreshCw,
  XCircle,
  Heart,
  Sparkles,
  DollarSign,
  FileText,
  HelpCircle
} from 'lucide-react';
import { useApp } from '../context/AppContext';

type ManagementView = 
  | 'overview'
  | 'usage'
  | 'plans'
  | 'billing'
  | 'cancel-confirm'
  | 'cancel-retention'
  | 'cancel-final';

interface UsageMetric {
  name: string;
  current: number;
  limit: number | 'unlimited';
  unit: string;
  color: string;
}

interface BillingTransaction {
  id: string;
  date: string;
  description: string;
  amount: number;
  status: 'paid' | 'pending' | 'failed';
  invoice?: string;
}

interface RetentionOffer {
  id: string;
  title: string;
  description: string;
  discount: string;
  duration: string;
  icon: string;
}

interface SubscriptionManagementProps {
  onExit: () => void;
}

export function SubscriptionManagement({ onExit }: SubscriptionManagementProps) {
  const { selectedLanguage } = useApp();
  const [currentView, setCurrentView] = useState<ManagementView>('overview');
  const [showAllTransactions, setShowAllTransactions] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<'monthly' | 'yearly'>('yearly');
  const [cancellationReason, setCancellationReason] = useState('');
  const [feedbackText, setFeedbackText] = useState('');

  // Current subscription data
  const currentSubscription = {
    plan: 'Premium',
    status: 'active',
    billingCycle: 'yearly',
    price: 5.99,
    nextBillingDate: '2024-02-10',
    startDate: '2023-02-10',
    autoRenew: true,
  };

  // Usage statistics
  const usageMetrics: UsageMetric[] = [
    {
      name: 'Lessons Completed',
      current: 47,
      limit: 'unlimited',
      unit: 'lessons',
      color: 'from-blue-600 to-blue-800',
    },
    {
      name: 'Practice Sessions',
      current: 32,
      limit: 'unlimited',
      unit: 'sessions',
      color: 'from-green-600 to-green-800',
    },
    {
      name: 'AR Tracking Time',
      current: 248,
      limit: 'unlimited',
      unit: 'minutes',
      color: 'from-purple-600 to-purple-800',
    },
    {
      name: 'Social Practice Rooms',
      current: 12,
      limit: 'unlimited',
      unit: 'rooms',
      color: 'from-orange-600 to-orange-800',
    },
    {
      name: 'Signs Learned',
      current: 156,
      limit: 500,
      unit: 'signs',
      color: 'from-pink-600 to-pink-800',
    },
    {
      name: 'Download Storage',
      current: 2.4,
      limit: 10,
      unit: 'GB',
      color: 'from-teal-600 to-teal-800',
    },
  ];

  // Billing history
  const billingHistory: BillingTransaction[] = [
    {
      id: 'inv-001',
      date: '2024-01-10',
      description: 'Premium Plan - Annual',
      amount: 71.88,
      status: 'paid',
      invoice: 'INV-2024-001',
    },
    {
      id: 'inv-002',
      date: '2023-01-10',
      description: 'Premium Plan - Annual',
      amount: 71.88,
      status: 'paid',
      invoice: 'INV-2023-012',
    },
    {
      id: 'inv-003',
      date: '2022-12-10',
      description: 'Premium Plan - Monthly',
      amount: 9.99,
      status: 'paid',
      invoice: 'INV-2022-156',
    },
    {
      id: 'inv-004',
      date: '2022-11-10',
      description: 'Premium Plan - Monthly',
      amount: 9.99,
      status: 'paid',
      invoice: 'INV-2022-145',
    },
    {
      id: 'inv-005',
      date: '2022-10-10',
      description: 'Premium Plan - Monthly',
      amount: 9.99,
      status: 'paid',
      invoice: 'INV-2022-134',
    },
  ];

  // Retention offers
  const retentionOffers: RetentionOffer[] = [
    {
      id: 'offer-1',
      title: '50% Off Next 3 Months',
      description: 'Continue your learning journey at half price',
      discount: '50%',
      duration: '3 months',
      icon: '🎁',
    },
    {
      id: 'offer-2',
      title: 'Pause Subscription',
      description: 'Take a break and resume anytime within 6 months',
      discount: 'Free',
      duration: 'Up to 6 months',
      icon: '⏸️',
    },
    {
      id: 'offer-3',
      title: 'Switch to Basic Plan',
      description: 'Downgrade to a more affordable option',
      discount: '60% less',
      duration: 'Ongoing',
      icon: '💡',
    },
  ];

  const calculateSavings = () => {
    const monthlyEquivalent = 9.99 * 12; // $119.88
    const yearlyActual = 71.88;
    return (monthlyEquivalent - yearlyActual).toFixed(2);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid':
        return 'text-green-500 bg-green-600/20';
      case 'pending':
        return 'text-yellow-500 bg-yellow-600/20';
      case 'failed':
        return 'text-red-500 bg-red-600/20';
      default:
        return 'text-gray-500 bg-gray-600/20';
    }
  };

  // Overview Screen
  if (currentView === 'overview') {
    return (
      <div 
        className="min-h-screen bg-black text-white flex flex-col"
        role="main"
        aria-labelledby="subscription-title"
      >
        {/* Header */}
        <div className="p-6 pb-4">
          <div className="flex items-center justify-between mb-4">
            <h1 id="subscription-title" className="text-2xl font-bold">Subscription</h1>
            <Button
              variant="ghost"
              size="icon"
              onClick={onExit}
              className="w-10 h-10 rounded-full hover:bg-gray-900"
              aria-label="Close subscription management"
            >
              <X className="w-5 h-5" />
            </Button>
          </div>
        </div>

        {/* Current Plan Card */}
        <div className="px-6 mb-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-br from-blue-600 to-blue-800 rounded-2xl p-6"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center" aria-hidden="true">
                  <Crown className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-xl font-bold">{currentSubscription.plan} Plan</h2>
                  <p className="text-sm opacity-90 capitalize">
                    {currentSubscription.billingCycle} billing
                  </p>
                </div>
              </div>
              <div className="px-3 py-1 bg-green-600 rounded-full text-xs font-semibold">
                Active
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="bg-white/10 rounded-lg p-3">
                <div className="text-2xl font-bold mb-1">${currentSubscription.price}</div>
                <div className="text-xs opacity-80">per month</div>
              </div>
              <div className="bg-white/10 rounded-lg p-3">
                <div className="text-2xl font-bold mb-1">${calculateSavings()}</div>
                <div className="text-xs opacity-80">saved annually</div>
              </div>
            </div>

            <div className="flex items-center justify-between text-sm">
              <span className="opacity-80">Next billing date</span>
              <span className="font-semibold">{currentSubscription.nextBillingDate}</span>
            </div>
          </motion.div>
        </div>

        {/* Quick Stats */}
        <div className="px-6 mb-6">
          <div className="grid grid-cols-3 gap-3">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 }}
              className="bg-gray-900 rounded-xl p-4 text-center"
            >
              <div className="text-2xl font-bold text-blue-500 mb-1">47</div>
              <div className="text-xs text-gray-400">Lessons</div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="bg-gray-900 rounded-xl p-4 text-center"
            >
              <div className="text-2xl font-bold text-green-500 mb-1">156</div>
              <div className="text-xs text-gray-400">Signs</div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 }}
              className="bg-gray-900 rounded-xl p-4 text-center"
            >
              <div className="text-2xl font-bold text-purple-500 mb-1">248</div>
              <div className="text-xs text-gray-400">AR mins</div>
            </motion.div>
          </div>
        </div>

        {/* Plan Benefits */}
        <div className="px-6 mb-6">
          <h3 className="text-lg font-semibold mb-3">Your Benefits</h3>
          <div className="bg-gray-900 rounded-xl p-4">
            <div className="space-y-3">
              {[
                'Unlimited lessons and practice sessions',
                'Full AR hand tracking features',
                'All sign languages (ASL, BSL, ISL, LSF)',
                'Social practice rooms',
                'Offline mode & downloads',
                'Advanced progress analytics',
                'Priority email support',
                'Ad-free experience',
              ].map((benefit, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 + index * 0.05 }}
                  className="flex items-center gap-3"
                >
                  <div className="w-5 h-5 rounded-full bg-blue-600 flex items-center justify-center flex-shrink-0">
                    <Check className="w-3 h-3" aria-hidden="true" />
                  </div>
                  <span className="text-sm">{benefit}</span>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* Menu Options */}
        <div className="flex-1 px-6 pb-6">
          <div className="space-y-2">
            <button
              onClick={() => setCurrentView('usage')}
              className="w-full bg-gray-900 rounded-xl p-4 flex items-center justify-between hover:bg-gray-800 transition-colors"
              aria-label="View usage statistics"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-blue-600/20 flex items-center justify-center" aria-hidden="true">
                  <BarChart3 className="w-5 h-5 text-blue-500" />
                </div>
                <div className="text-left">
                  <div className="font-semibold">Usage Statistics</div>
                  <div className="text-xs text-gray-400">See your activity & value</div>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-gray-600" />
            </button>

            <button
              onClick={() => setCurrentView('plans')}
              className="w-full bg-gray-900 rounded-xl p-4 flex items-center justify-between hover:bg-gray-800 transition-colors"
              aria-label="Change plan"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-purple-600/20 flex items-center justify-center" aria-hidden="true">
                  <Crown className="w-5 h-5 text-purple-500" />
                </div>
                <div className="text-left">
                  <div className="font-semibold">Change Plan</div>
                  <div className="text-xs text-gray-400">Upgrade or downgrade</div>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-gray-600" />
            </button>

            <button
              onClick={() => setCurrentView('billing')}
              className="w-full bg-gray-900 rounded-xl p-4 flex items-center justify-between hover:bg-gray-800 transition-colors"
              aria-label="View billing history"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-green-600/20 flex items-center justify-center" aria-hidden="true">
                  <CreditCard className="w-5 h-5 text-green-500" />
                </div>
                <div className="text-left">
                  <div className="font-semibold">Billing History</div>
                  <div className="text-xs text-gray-400">View invoices & payments</div>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-gray-600" />
            </button>

            <button
              className="w-full bg-gray-900 rounded-xl p-4 flex items-center justify-between hover:bg-gray-800 transition-colors"
              aria-label="Payment method"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-orange-600/20 flex items-center justify-center" aria-hidden="true">
                  <CreditCard className="w-5 h-5 text-orange-500" />
                </div>
                <div className="text-left">
                  <div className="font-semibold">Payment Method</div>
                  <div className="text-xs text-gray-400">•••• •••• •••• 4242</div>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-gray-600" />
            </button>
          </div>
        </div>

        {/* Cancel Subscription */}
        <div className="p-6 border-t border-gray-900">
          <Button
            onClick={() => setCurrentView('cancel-confirm')}
            variant="ghost"
            className="w-full text-red-500 hover:bg-red-600/10"
            aria-label="Cancel subscription"
          >
            Cancel Subscription
          </Button>
        </div>
      </div>
    );
  }

  // Usage Statistics Screen
  if (currentView === 'usage') {
    return (
      <div 
        className="min-h-screen bg-black text-white flex flex-col"
        role="main"
        aria-labelledby="usage-title"
      >
        {/* Header */}
        <div className="p-6 pb-4">
          <div className="flex items-center gap-4 mb-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setCurrentView('overview')}
              className="w-10 h-10 rounded-full hover:bg-gray-900"
              aria-label="Back to overview"
            >
              <X className="w-5 h-5" />
            </Button>
            <h1 id="usage-title" className="text-xl font-bold">Usage Statistics</h1>
          </div>

          {/* Value Summary */}
          <div className="bg-gradient-to-br from-green-600 to-green-800 rounded-xl p-5">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="w-5 h-5" />
              <span className="text-sm font-semibold">Your Value</span>
            </div>
            <div className="text-3xl font-bold mb-2">$428.76</div>
            <p className="text-sm opacity-90">
              Estimated value of features used this month
            </p>
          </div>
        </div>

        {/* Usage Metrics */}
        <div className="flex-1 px-6 pb-6 overflow-y-auto">
          <div className="space-y-4">
            {usageMetrics.map((metric, index) => (
              <motion.div
                key={metric.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="bg-gray-900 rounded-xl p-4"
              >
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold">{metric.name}</h3>
                  <div className="text-right">
                    <div className="text-lg font-bold">
                      {metric.current}
                      {metric.limit !== 'unlimited' && `/${metric.limit}`}
                    </div>
                    <div className="text-xs text-gray-400">{metric.unit}</div>
                  </div>
                </div>

                {metric.limit === 'unlimited' ? (
                  <div className="flex items-center gap-2 text-sm text-green-500">
                    <Check className="w-4 h-4" />
                    <span>Unlimited with Premium</span>
                  </div>
                ) : (
                  <>
                    <div className="h-2 bg-gray-800 rounded-full overflow-hidden mb-2" role="progressbar" aria-valuenow={metric.current} aria-valuemin={0} aria-valuemax={typeof metric.limit === 'number' ? metric.limit : 100}>
                      <motion.div
                        className={`h-full bg-gradient-to-r ${metric.color}`}
                        initial={{ width: 0 }}
                        animate={{ 
                          width: `${typeof metric.limit === 'number' ? (metric.current / metric.limit) * 100 : 0}%` 
                        }}
                        transition={{ duration: 0.8, delay: index * 0.1 }}
                      />
                    </div>
                    <div className="text-xs text-gray-400">
                      {typeof metric.limit === 'number' 
                        ? `${Math.round((metric.current / metric.limit) * 100)}% used`
                        : ''
                      }
                    </div>
                  </>
                )}
              </motion.div>
            ))}
          </div>

          {/* Comparison */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="bg-gradient-to-br from-blue-600/20 to-blue-800/20 border border-blue-600/30 rounded-xl p-5 mt-6"
          >
            <div className="flex items-start gap-3">
              <Sparkles className="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="font-semibold mb-2">Free Plan Comparison</h4>
                <div className="space-y-2 text-sm text-gray-300">
                  <div className="flex items-center justify-between">
                    <span>Lessons</span>
                    <span className="text-gray-500">3/day limit</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>AR Tracking</span>
                    <span className="text-gray-500">5 min/day</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Practice Sessions</span>
                    <span className="text-gray-500">1/day limit</span>
                  </div>
                </div>
                <p className="text-xs text-blue-400 mt-3">
                  You're getting 10x more value with Premium! 🎉
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  // Change Plan Screen
  if (currentView === 'plans') {
    const plans = [
      {
        id: 'free',
        name: 'Free',
        price: 0,
        icon: '🌱',
        features: ['3 lessons/day', '5 min AR/day', '50 signs', 'Basic analytics'],
        isCurrent: false,
      },
      {
        id: 'premium',
        name: 'Premium',
        monthlyPrice: 9.99,
        yearlyPrice: 5.99,
        icon: '⚡',
        features: ['Unlimited lessons', 'Unlimited AR', '500+ signs', 'Social rooms', 'Offline mode'],
        isCurrent: true,
      },
      {
        id: 'pro',
        name: 'Pro',
        monthlyPrice: 14.99,
        yearlyPrice: 9.99,
        icon: '🔥',
        features: ['Everything in Premium', 'Personal tutor', 'Custom paths', 'Family sharing', 'Certificates'],
        isCurrent: false,
      },
    ];

    return (
      <div 
        className="min-h-screen bg-black text-white flex flex-col"
        role="main"
        aria-labelledby="plans-title"
      >
        {/* Header */}
        <div className="p-6 pb-4">
          <div className="flex items-center gap-4 mb-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setCurrentView('overview')}
              className="w-10 h-10 rounded-full hover:bg-gray-900"
              aria-label="Back to overview"
            >
              <X className="w-5 h-5" />
            </Button>
            <h1 id="plans-title" className="text-xl font-bold">Change Plan</h1>
          </div>

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

        {/* Plan Cards */}
        <div className="flex-1 px-6 pb-6 overflow-y-auto">
          <div className="space-y-3">
            {plans.map((plan, index) => (
              <motion.div
                key={plan.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`rounded-xl p-5 ${
                  plan.isCurrent
                    ? 'bg-gradient-to-br from-blue-600 to-blue-800 border-2 border-blue-400'
                    : 'bg-gray-900'
                }`}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="text-3xl" aria-hidden="true">{plan.icon}</div>
                    <div>
                      <h3 className="text-xl font-bold">{plan.name}</h3>
                      {plan.id === 'free' ? (
                        <div className="text-lg font-bold">$0</div>
                      ) : (
                        <div className="text-lg font-bold">
                          ${selectedPlan === 'monthly' ? plan.monthlyPrice : plan.yearlyPrice}/mo
                        </div>
                      )}
                    </div>
                  </div>
                  {plan.isCurrent && (
                    <div className="px-3 py-1 bg-white/20 rounded-full text-xs font-semibold">
                      Current
                    </div>
                  )}
                </div>

                <ul className="space-y-2 mb-4" role="list">
                  {plan.features.map((feature, idx) => (
                    <li key={idx} className="flex items-center gap-2 text-sm">
                      <Check className="w-4 h-4 flex-shrink-0" aria-hidden="true" />
                      <span className={plan.isCurrent ? '' : 'text-gray-300'}>{feature}</span>
                    </li>
                  ))}
                </ul>

                {!plan.isCurrent && (
                  <Button
                    className={`w-full h-11 rounded-full font-semibold ${
                      plan.id === 'free'
                        ? 'bg-gray-800 hover:bg-gray-700 text-white'
                        : 'bg-white text-blue-600 hover:bg-gray-100'
                    }`}
                    aria-label={`${plan.id === 'free' ? 'Downgrade to' : 'Upgrade to'} ${plan.name} plan`}
                  >
                    {plan.id === 'free' ? 'Downgrade' : 'Upgrade'}
                  </Button>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Billing History Screen
  if (currentView === 'billing') {
    const displayedTransactions = showAllTransactions 
      ? billingHistory 
      : billingHistory.slice(0, 3);

    return (
      <div 
        className="min-h-screen bg-black text-white flex flex-col"
        role="main"
        aria-labelledby="billing-title"
      >
        {/* Header */}
        <div className="p-6 pb-4">
          <div className="flex items-center gap-4 mb-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setCurrentView('overview')}
              className="w-10 h-10 rounded-full hover:bg-gray-900"
              aria-label="Back to overview"
            >
              <X className="w-5 h-5" />
            </Button>
            <h1 id="billing-title" className="text-xl font-bold">Billing History</h1>
          </div>

          {/* Summary Card */}
          <div className="bg-gray-900 rounded-xl p-5 grid grid-cols-2 gap-4">
            <div>
              <div className="text-sm text-gray-400 mb-1">Total Spent</div>
              <div className="text-2xl font-bold">$204.62</div>
            </div>
            <div>
              <div className="text-sm text-gray-400 mb-1">Member Since</div>
              <div className="text-2xl font-bold">Feb 2023</div>
            </div>
          </div>
        </div>

        {/* Transactions List */}
        <div className="flex-1 px-6 pb-6 overflow-y-auto">
          <div className="space-y-3">
            {displayedTransactions.map((transaction, index) => (
              <motion.div
                key={transaction.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="bg-gray-900 rounded-xl p-4"
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <div className="font-semibold mb-1">{transaction.description}</div>
                    <div className="text-sm text-gray-400">{transaction.date}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold">${transaction.amount.toFixed(2)}</div>
                    <div className={`text-xs px-2 py-1 rounded-full capitalize inline-block mt-1 ${getStatusColor(transaction.status)}`}>
                      {transaction.status}
                    </div>
                  </div>
                </div>

                {transaction.invoice && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-blue-500 hover:text-blue-400 h-auto p-0 mt-2"
                    aria-label={`Download invoice ${transaction.invoice}`}
                  >
                    <Download className="w-4 h-4 mr-1" />
                    Download Invoice
                  </Button>
                )}
              </motion.div>
            ))}
          </div>

          {!showAllTransactions && billingHistory.length > 3 && (
            <Button
              onClick={() => setShowAllTransactions(true)}
              variant="ghost"
              className="w-full mt-4 text-blue-500"
              aria-label="Show all transactions"
            >
              Show All Transactions
              <ChevronDown className="w-4 h-4 ml-2" />
            </Button>
          )}

          {showAllTransactions && (
            <Button
              onClick={() => setShowAllTransactions(false)}
              variant="ghost"
              className="w-full mt-4 text-blue-500"
              aria-label="Show fewer transactions"
            >
              Show Less
              <ChevronUp className="w-4 h-4 ml-2" />
            </Button>
          )}
        </div>
      </div>
    );
  }

  // Cancellation Confirmation
  if (currentView === 'cancel-confirm') {
    return (
      <div 
        className="min-h-screen bg-black text-white flex flex-col"
        role="main"
        aria-labelledby="cancel-title"
      >
        {/* Header */}
        <div className="p-6 flex items-center justify-between">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setCurrentView('overview')}
            className="w-10 h-10 rounded-full hover:bg-gray-900"
            aria-label="Back to overview"
          >
            <X className="w-5 h-5" />
          </Button>
          <div className="w-10" aria-hidden="true" />
        </div>

        {/* Content */}
        <div className="flex-1 flex flex-col items-center justify-center px-6">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", duration: 0.6 }}
            className="w-24 h-24 rounded-full bg-red-600/20 flex items-center justify-center mb-6"
            aria-hidden="true"
          >
            <AlertCircle className="w-12 h-12 text-red-500" />
          </motion.div>

          <motion.h1
            id="cancel-title"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-2xl font-bold text-center mb-3"
          >
            Cancel Subscription?
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-center text-gray-400 mb-8"
          >
            You'll lose access to these benefits at the end of your billing period
          </motion.p>

          {/* What You'll Lose */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="w-full max-w-md bg-gray-900 rounded-xl p-5 mb-6"
          >
            <h3 className="font-semibold mb-3">What you'll lose:</h3>
            <div className="space-y-2 text-sm">
              {[
                'Unlimited lessons and practice',
                'AR hand tracking features',
                'Social practice rooms',
                'Offline downloads',
                'All sign languages',
                'Advanced analytics',
              ].map((item, index) => (
                <div key={index} className="flex items-center gap-2 text-gray-400">
                  <XCircle className="w-4 h-4 text-red-500 flex-shrink-0" aria-hidden="true" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Reason Selection */}
          <div className="w-full max-w-md mb-6">
            <label htmlFor="cancel-reason" className="block text-sm font-semibold mb-2">
              Help us improve - Why are you canceling? (Optional)
            </label>
            <select
              id="cancel-reason"
              value={cancellationReason}
              onChange={(e) => setCancellationReason(e.target.value)}
              className="w-full bg-gray-900 border border-gray-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500"
            >
              <option value="">Select a reason</option>
              <option value="too-expensive">Too expensive</option>
              <option value="not-using">Not using it enough</option>
              <option value="technical-issues">Technical issues</option>
              <option value="found-alternative">Found an alternative</option>
              <option value="completed-learning">Completed my learning goals</option>
              <option value="other">Other</option>
            </select>
          </div>
        </div>

        {/* Actions */}
        <div className="p-6 border-t border-gray-900 space-y-3">
          <Button
            onClick={() => setCurrentView('cancel-retention')}
            className="w-full bg-blue-600 hover:bg-blue-700 h-14 text-lg font-semibold rounded-full"
            aria-label="Keep my subscription"
          >
            <Heart className="w-5 h-5 mr-2" />
            Keep My Subscription
          </Button>
          <Button
            onClick={() => setCurrentView('cancel-retention')}
            variant="ghost"
            className="w-full h-12 text-red-500 hover:bg-red-600/10"
            aria-label="Continue with cancellation"
          >
            Continue Cancellation
          </Button>
        </div>
      </div>
    );
  }

  // Retention Offers
  if (currentView === 'cancel-retention') {
    return (
      <div 
        className="min-h-screen bg-black text-white flex flex-col"
        role="main"
        aria-labelledby="retention-title"
      >
        {/* Header */}
        <div className="p-6 pb-4">
          <div className="flex items-center gap-4 mb-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setCurrentView('cancel-confirm')}
              className="w-10 h-10 rounded-full hover:bg-gray-900"
              aria-label="Back"
            >
              <X className="w-5 h-5" />
            </Button>
            <h1 id="retention-title" className="text-xl font-bold">Before You Go...</h1>
          </div>

          <p className="text-gray-400">
            We'd love to keep you! Here are some special offers just for you:
          </p>
        </div>

        {/* Retention Offers */}
        <div className="flex-1 px-6 pb-6 overflow-y-auto">
          <div className="space-y-4">
            {retentionOffers.map((offer, index) => (
              <motion.div
                key={offer.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-gradient-to-br from-blue-600/20 to-blue-800/20 border border-blue-600/30 rounded-xl p-5"
              >
                <div className="flex items-start gap-4 mb-4">
                  <div className="text-4xl" aria-hidden="true">{offer.icon}</div>
                  <div className="flex-1">
                    <h3 className="text-lg font-bold mb-1">{offer.title}</h3>
                    <p className="text-sm text-gray-300 mb-3">{offer.description}</p>
                    <div className="flex items-center gap-4 text-sm">
                      <div className="bg-blue-600 px-3 py-1 rounded-full font-semibold">
                        {offer.discount}
                      </div>
                      <span className="text-gray-400">{offer.duration}</span>
                    </div>
                  </div>
                </div>
                <Button
                  className="w-full bg-blue-600 hover:bg-blue-700 h-11 rounded-full font-semibold"
                  aria-label={`Accept offer: ${offer.title}`}
                >
                  {offer.id === 'offer-2' ? 'Pause Subscription' : 'Accept Offer'}
                </Button>
              </motion.div>
            ))}
          </div>

          {/* Still Cancel */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-gray-900 rounded-xl p-5 mt-6"
          >
            <h3 className="font-semibold mb-2">Still want to cancel?</h3>
            <p className="text-sm text-gray-400 mb-4">
              Your subscription will remain active until {currentSubscription.nextBillingDate}. 
              You'll continue to have full access during this time.
            </p>
            <textarea
              value={feedbackText}
              onChange={(e) => setFeedbackText(e.target.value)}
              placeholder="Share your feedback to help us improve..."
              rows={3}
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 resize-none mb-3"
              aria-label="Cancellation feedback"
            />
            <Button
              onClick={() => setCurrentView('cancel-final')}
              variant="ghost"
              className="w-full text-red-500 hover:bg-red-600/10"
              aria-label="Proceed with cancellation"
            >
              Proceed with Cancellation
            </Button>
          </motion.div>
        </div>
      </div>
    );
  }

  // Final Cancellation
  if (currentView === 'cancel-final') {
    return (
      <div 
        className="min-h-screen bg-black text-white flex flex-col"
        role="main"
        aria-labelledby="final-cancel-title"
      >
        {/* Header */}
        <div className="p-6 flex items-center justify-between">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setCurrentView('cancel-retention')}
            className="w-10 h-10 rounded-full hover:bg-gray-900"
            aria-label="Back"
          >
            <X className="w-5 h-5" />
          </Button>
          <div className="w-10" aria-hidden="true" />
        </div>

        {/* Content */}
        <div className="flex-1 flex flex-col items-center justify-center px-6">
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: "spring", duration: 0.8 }}
            className="w-24 h-24 rounded-full bg-blue-600/20 flex items-center justify-center mb-6"
            aria-hidden="true"
          >
            <Check className="w-12 h-12 text-blue-500" />
          </motion.div>

          <motion.h1
            id="final-cancel-title"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-2xl font-bold text-center mb-3"
          >
            Subscription Canceled
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-center text-gray-400 mb-8 max-w-md"
          >
            We're sorry to see you go. Your Premium access will continue until {currentSubscription.nextBillingDate}.
          </motion.p>

          {/* Summary */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="w-full max-w-md bg-gray-900 rounded-xl p-5 mb-6"
          >
            <h3 className="font-semibold mb-3">What happens next:</h3>
            <div className="space-y-3 text-sm">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-blue-600 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-xs font-bold">1</span>
                </div>
                <div>
                  <div className="font-semibold mb-1">Keep full access</div>
                  <p className="text-gray-400">
                    Use all Premium features until {currentSubscription.nextBillingDate}
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-gray-800 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-xs font-bold">2</span>
                </div>
                <div>
                  <div className="font-semibold mb-1">No more charges</div>
                  <p className="text-gray-400">
                    Your card won't be charged again
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-gray-800 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-xs font-bold">3</span>
                </div>
                <div>
                  <div className="font-semibold mb-1">Switch to Free plan</div>
                  <p className="text-gray-400">
                    After {currentSubscription.nextBillingDate}, you'll move to the Free plan
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Reactivate Option */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="w-full max-w-md bg-gradient-to-br from-blue-600/20 to-blue-800/20 border border-blue-600/30 rounded-xl p-5"
          >
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="w-5 h-5 text-blue-500" />
              <span className="font-semibold">Changed your mind?</span>
            </div>
            <p className="text-sm text-gray-300 mb-3">
              You can reactivate your subscription anytime with one click
            </p>
            <Button
              onClick={() => setCurrentView('overview')}
              className="w-full bg-blue-600 hover:bg-blue-700 h-11 rounded-full font-semibold"
              aria-label="Reactivate subscription"
            >
              <RefreshCw className="w-5 h-5 mr-2" />
              Reactivate Subscription
            </Button>
          </motion.div>
        </div>

        {/* Done Button */}
        <div className="p-6 border-t border-gray-900">
          <Button
            onClick={onExit}
            variant="ghost"
            className="w-full h-12"
            aria-label="Return to home"
          >
            Done
          </Button>
        </div>
      </div>
    );
  }

  return null;
}
