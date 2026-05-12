import { useState } from 'react';
import { Button } from './ui/button';
import { useTheme } from '../context/ThemeContext';
import { useApp } from '../context/AppContext';
import exampleImage from 'figma:asset/57f2fd14392f54e847395c0d78c129b5511bb5a7.png';
import { 
  X, 
  Gift,
  Users,
  Share2,
  Copy,
  Check,
  Mail,
  MessageCircle,
  Send,
  Award,
  Star,
  Zap,
  Crown,
  TrendingUp,
  Calendar,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Info,
  ExternalLink,
  Download,
  Facebook,
  Twitter,
  Linkedin,
  Link2,
  Smartphone,
  Target,
  DollarSign,
  Sparkles,
  Trophy,
  Medal,
  CircleDot,
  ChevronRight,
  Plus,
  Minus,
  Ticket,
  ShoppingBag,
  CreditCard,
  Wallet,
  BarChart3,
  TrendingDown,
  Activity,
} from 'lucide-react';

interface ReferralProgramProps {
  onExit: () => void;
}

interface Referral {
  id: string;
  name: string;
  avatar: string;
  joinedDate: string;
  status: 'completed' | 'pending' | 'active';
  reward: string;
  rewardEarned: boolean;
  lessonsCompleted: number;
  totalXP: number;
}

interface Reward {
  id: string;
  title: string;
  description: string;
  pointsRequired: number;
  category: 'premium' | 'xp' | 'feature' | 'merchandise';
  value: string;
  available: boolean;
  claimed: number;
  icon: string;
}

interface ReferralStats {
  totalReferrals: number;
  activeReferrals: number;
  totalRewardsEarned: number;
  pointsBalance: number;
  nextRewardPoints: number;
}

export function ReferralProgram({ onExit }: ReferralProgramProps) {
  const { theme } = useTheme();
  const { userProgress } = useApp();

  const [copiedLink, setCopiedLink] = useState(false);
  const [selectedShareMethod, setSelectedShareMethod] = useState<string | null>(null);
  const [showRedeemModal, setShowRedeemModal] = useState(false);
  const [selectedReward, setSelectedReward] = useState<Reward | null>(null);

  // Referral Stats
  const [stats] = useState<ReferralStats>({
    totalReferrals: 12,
    activeReferrals: 8,
    totalRewardsEarned: 2450,
    pointsBalance: 850,
    nextRewardPoints: 150,
  });

  // User's Referral Link
  const [referralLink] = useState('signlearn.app/ref/SARAH2026');
  const [referralCode] = useState('SARAH2026');

  // Referrals List
  const [referrals] = useState<Referral[]>([
    {
      id: 'ref-1',
      name: 'Emma Wilson',
      avatar: 'EW',
      joinedDate: 'Jan 8, 2026',
      status: 'completed',
      reward: '200 points',
      rewardEarned: true,
      lessonsCompleted: 15,
      totalXP: 3200,
    },
    {
      id: 'ref-2',
      name: 'Noah Martinez',
      avatar: 'NM',
      joinedDate: 'Jan 5, 2026',
      status: 'active',
      reward: '200 points',
      rewardEarned: true,
      lessonsCompleted: 8,
      totalXP: 1850,
    },
    {
      id: 'ref-3',
      name: 'Olivia Brown',
      avatar: 'OB',
      joinedDate: 'Jan 2, 2026',
      status: 'completed',
      reward: '200 points',
      rewardEarned: true,
      lessonsCompleted: 22,
      totalXP: 4500,
    },
    {
      id: 'ref-4',
      name: 'Liam Davis',
      avatar: 'LD',
      joinedDate: 'Dec 28, 2025',
      status: 'pending',
      reward: '200 points',
      rewardEarned: false,
      lessonsCompleted: 2,
      totalXP: 450,
    },
    {
      id: 'ref-5',
      name: 'Sophia Garcia',
      avatar: 'SG',
      joinedDate: 'Dec 25, 2025',
      status: 'active',
      reward: '200 points',
      rewardEarned: true,
      lessonsCompleted: 12,
      totalXP: 2680,
    },
    {
      id: 'ref-6',
      name: 'Mason Johnson',
      avatar: 'MJ',
      joinedDate: 'Dec 20, 2025',
      status: 'completed',
      reward: '200 points',
      rewardEarned: true,
      lessonsCompleted: 18,
      totalXP: 3950,
    },
    {
      id: 'ref-7',
      name: 'Ava Rodriguez',
      avatar: 'AR',
      joinedDate: 'Dec 15, 2025',
      status: 'active',
      reward: '200 points',
      rewardEarned: true,
      lessonsCompleted: 10,
      totalXP: 2200,
    },
    {
      id: 'ref-8',
      name: 'Ethan Lee',
      avatar: 'EL',
      joinedDate: 'Dec 10, 2025',
      status: 'pending',
      reward: '200 points',
      rewardEarned: false,
      lessonsCompleted: 3,
      totalXP: 680,
    },
    {
      id: 'ref-9',
      name: 'Isabella Taylor',
      avatar: 'IT',
      joinedDate: 'Dec 5, 2025',
      status: 'completed',
      reward: '200 points',
      rewardEarned: true,
      lessonsCompleted: 25,
      totalXP: 5100,
    },
    {
      id: 'ref-10',
      name: 'James Anderson',
      avatar: 'JA',
      joinedDate: 'Nov 28, 2025',
      status: 'active',
      reward: '200 points',
      rewardEarned: true,
      lessonsCompleted: 14,
      totalXP: 3050,
    },
    {
      id: 'ref-11',
      name: 'Mia Thomas',
      avatar: 'MT',
      joinedDate: 'Nov 22, 2025',
      status: 'completed',
      reward: '200 points',
      rewardEarned: true,
      lessonsCompleted: 20,
      totalXP: 4320,
    },
    {
      id: 'ref-12',
      name: 'Lucas White',
      avatar: 'LW',
      joinedDate: 'Nov 15, 2025',
      status: 'active',
      reward: '200 points',
      rewardEarned: true,
      lessonsCompleted: 9,
      totalXP: 1950,
    },
  ]);

  // Available Rewards
  const [rewards] = useState<Reward[]>([
    {
      id: 'rew-1',
      title: '1 Month Premium',
      description: 'Unlock all premium features for 30 days',
      pointsRequired: 500,
      category: 'premium',
      value: '$9.99 value',
      available: true,
      claimed: 145,
      icon: 'crown',
    },
    {
      id: 'rew-2',
      title: '1000 Bonus XP',
      description: 'Instant XP boost for your account',
      pointsRequired: 300,
      category: 'xp',
      value: '1000 XP',
      available: true,
      claimed: 287,
      icon: 'zap',
    },
    {
      id: 'rew-3',
      title: '3 Months Premium',
      description: 'Extended premium access with all features',
      pointsRequired: 1200,
      category: 'premium',
      value: '$29.99 value',
      available: false,
      claimed: 89,
      icon: 'crown',
    },
    {
      id: 'rew-4',
      title: 'Exclusive Avatar',
      description: 'Unlock special AR instructor avatar',
      pointsRequired: 800,
      category: 'feature',
      value: 'Limited edition',
      available: true,
      claimed: 156,
      icon: 'star',
    },
    {
      id: 'rew-5',
      title: 'Sign Learn T-Shirt',
      description: 'Official branded merchandise',
      pointsRequired: 1500,
      category: 'merchandise',
      value: 'Free shipping',
      available: false,
      claimed: 42,
      icon: 'gift',
    },
    {
      id: 'rew-6',
      title: '5000 Bonus XP',
      description: 'Massive XP boost to level up faster',
      pointsRequired: 1000,
      category: 'xp',
      value: '5000 XP',
      available: false,
      claimed: 198,
      icon: 'zap',
    },
    {
      id: 'rew-7',
      title: 'Early Feature Access',
      description: 'Beta access to new features before release',
      pointsRequired: 600,
      category: 'feature',
      value: 'Exclusive',
      available: true,
      claimed: 201,
      icon: 'sparkles',
    },
    {
      id: 'rew-8',
      title: 'Certificate Bundle',
      description: 'All ASL certification exams unlocked',
      pointsRequired: 900,
      category: 'feature',
      value: '$49.99 value',
      available: false,
      claimed: 124,
      icon: 'award',
    },
  ]);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(`https://${referralLink}`);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleShare = (method: string) => {
    setSelectedShareMethod(method);
    const shareText = `Join me on Sign Learn AR! Use my code ${referralCode} to get started. https://${referralLink}`;
    
    if (method === 'email') {
      window.location.href = `mailto:?subject=Join Sign Learn AR&body=${encodeURIComponent(shareText)}`;
    } else if (method === 'sms') {
      window.location.href = `sms:?body=${encodeURIComponent(shareText)}`;
    } else if (method === 'twitter') {
      window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}`, '_blank');
    } else if (method === 'facebook') {
      window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(`https://${referralLink}`)}`, '_blank');
    }
  };

  const handleRedeemReward = (reward: Reward) => {
    if (reward.available && stats.pointsBalance >= reward.pointsRequired) {
      setSelectedReward(reward);
      setShowRedeemModal(true);
    }
  };

  const getStatusColor = (status: string) => {
    if (status === 'completed') return colors.successColor;
    if (status === 'active') return colors.iconColor;
    if (status === 'pending') return colors.warningColor;
    return colors.textTertiary;
  };

  const getStatusBg = (status: string) => {
    if (status === 'completed') return colors.successBg;
    if (status === 'active') return colors.iconBg;
    if (status === 'pending') return colors.warningBg;
    return colors.border;
  };

  const getCategoryColor = (category: string) => {
    if (category === 'premium') return colors.accentColor;
    if (category === 'xp') return colors.warningColor;
    if (category === 'feature') return colors.iconColor;
    if (category === 'merchandise') return colors.successColor;
    return colors.textTertiary;
  };

  const getCategoryBg = (category: string) => {
    if (category === 'premium') return colors.accentBg;
    if (category === 'xp') return colors.warningBg;
    if (category === 'feature') return colors.iconBg;
    if (category === 'merchandise') return colors.successBg;
    return colors.border;
  };

  const getRewardIcon = (iconName: string) => {
    const icons: Record<string, any> = {
      crown: Crown,
      zap: Zap,
      star: Star,
      gift: Gift,
      sparkles: Sparkles,
      award: Award,
    };
    return icons[iconName] || Gift;
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
      aria-labelledby="referral-title"
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
            aria-label="Exit referral program"
            className="flex-shrink-0"
          >
            <X className="w-6 h-6" />
          </Button>
          <div className="flex-1 min-w-0">
            <h1 
              id="referral-title" 
              className="text-xl sm:text-2xl font-bold truncate"
              style={{ fontFamily: 'Poppins, sans-serif' }}
            >
              Referral Program
            </h1>
            <p className="text-sm truncate" style={{ color: colors.textSecondary }}>
              Invite friends, earn rewards
            </p>
          </div>
        </div>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto">
        {/* Stats Overview */}
        <section aria-labelledby="stats-heading" className="p-4">
          <div className="grid grid-cols-2 gap-3 mb-4">
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
              <div 
                className="w-10 h-10 rounded-lg flex items-center justify-center mb-3"
                style={{ background: colors.iconBg }}
              >
                <Users className="w-5 h-5" style={{ color: colors.iconColor }} />
              </div>
              <div className="text-2xl font-bold mb-1" style={{ color: colors.textPrimary }}>
                {stats.totalReferrals}
              </div>
              <div className="text-sm" style={{ color: colors.textTertiary }}>
                Total Referrals
              </div>
            </div>

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
              <div 
                className="w-10 h-10 rounded-lg flex items-center justify-center mb-3"
                style={{ background: colors.successBg }}
              >
                <CheckCircle2 className="w-5 h-5" style={{ color: colors.successColor }} />
              </div>
              <div className="text-2xl font-bold mb-1" style={{ color: colors.textPrimary }}>
                {stats.activeReferrals}
              </div>
              <div className="text-sm" style={{ color: colors.textTertiary }}>
                Active Referrals
              </div>
            </div>

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
              <div 
                className="w-10 h-10 rounded-lg flex items-center justify-center mb-3"
                style={{ background: colors.warningBg }}
              >
                <Star className="w-5 h-5" style={{ color: colors.warningColor }} />
              </div>
              <div className="text-2xl font-bold mb-1" style={{ color: colors.textPrimary }}>
                {stats.pointsBalance}
              </div>
              <div className="text-sm" style={{ color: colors.textTertiary }}>
                Points Balance
              </div>
            </div>

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
              <div 
                className="w-10 h-10 rounded-lg flex items-center justify-center mb-3"
                style={{ background: colors.accentBg }}
              >
                <Gift className="w-5 h-5" style={{ color: colors.accentColor }} />
              </div>
              <div className="text-2xl font-bold mb-1" style={{ color: colors.textPrimary }}>
                {stats.totalRewardsEarned}
              </div>
              <div className="text-sm" style={{ color: colors.textTertiary }}>
                Total Earned
              </div>
            </div>
          </div>

          {/* Next Reward Progress */}
          <div 
            className="rounded-xl p-4"
            style={{
              background: colors.iconBg,
              border: colors.glassBorder,
            }}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-semibold" style={{ color: colors.textPrimary }}>
                Next Reward In
              </span>
              <span className="text-sm font-bold" style={{ color: colors.iconColor }}>
                {stats.nextRewardPoints} points
              </span>
            </div>
            <div 
              className="w-full h-2 rounded-full overflow-hidden"
              style={{ background: colors.border }}
              role="progressbar"
              aria-valuenow={stats.pointsBalance}
              aria-valuemin={0}
              aria-valuemax={stats.pointsBalance + stats.nextRewardPoints}
            >
              <div 
                className="h-full rounded-full transition-all"
                style={{ 
                  background: colors.iconColor,
                  width: `${(stats.pointsBalance / (stats.pointsBalance + stats.nextRewardPoints)) * 100}%`,
                }}
              />
            </div>
          </div>
        </section>

        {/* Share Referral Link */}
        <section aria-labelledby="share-heading" className="px-4 pb-4">
          <h2 id="share-heading" className="text-lg font-semibold mb-3" style={{ color: colors.textPrimary }}>
            Share Your Link
          </h2>

          {/* Referral Link */}
          <div 
            className="rounded-xl p-4 mb-3"
            style={{
              background: colors.cardBg,
              backdropFilter: colors.blur,
              WebkitBackdropFilter: colors.blur,
              border: colors.glassBorder,
              boxShadow: colors.shadow,
            }}
          >
            <div className="flex items-center gap-3 mb-3">
              <div 
                className="flex-1 rounded-lg px-4 py-3"
                style={{ background: colors.iconBg }}
              >
                <div className="text-xs mb-1" style={{ color: colors.textTertiary }}>
                  Your Referral Link
                </div>
                <div className="font-mono text-sm truncate" style={{ color: colors.iconColor }}>
                  {referralLink}
                </div>
              </div>
              <button
                onClick={handleCopyLink}
                className="p-3 rounded-lg flex-shrink-0"
                style={{ 
                  background: copiedLink ? colors.successBg : colors.iconBg,
                  color: copiedLink ? colors.successColor : colors.iconColor,
                }}
                aria-label={copiedLink ? 'Link copied' : 'Copy referral link'}
              >
                {copiedLink ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
              </button>
            </div>

            {/* Referral Code */}
            <div className="flex items-center justify-between p-3 rounded-lg" style={{ background: colors.iconBg }}>
              <div>
                <div className="text-xs mb-1" style={{ color: colors.textTertiary }}>
                  Referral Code
                </div>
                <div className="font-mono font-bold text-lg" style={{ color: colors.iconColor }}>
                  {referralCode}
                </div>
              </div>
            </div>
          </div>

          {/* Share Methods */}
          <div className="grid grid-cols-2 gap-2">
            <Button
              onClick={() => handleShare('email')}
              className="h-14 rounded-xl font-semibold flex items-center justify-center gap-2"
              style={{ 
                background: colors.cardBg,
                color: colors.textPrimary,
                border: colors.glassBorder,
              }}
              aria-label="Share via email"
            >
              <Mail className="w-5 h-5" />
              Email
            </Button>
            <Button
              onClick={() => handleShare('sms')}
              className="h-14 rounded-xl font-semibold flex items-center justify-center gap-2"
              style={{ 
                background: colors.cardBg,
                color: colors.textPrimary,
                border: colors.glassBorder,
              }}
              aria-label="Share via SMS"
            >
              <MessageCircle className="w-5 h-5" />
              SMS
            </Button>
            <Button
              onClick={() => handleShare('twitter')}
              className="h-14 rounded-xl font-semibold flex items-center justify-center gap-2"
              style={{ 
                background: colors.cardBg,
                color: colors.textPrimary,
                border: colors.glassBorder,
              }}
              aria-label="Share on Twitter"
            >
              <Twitter className="w-5 h-5" />
              Twitter
            </Button>
            <Button
              onClick={() => handleShare('facebook')}
              className="h-14 rounded-xl font-semibold flex items-center justify-center gap-2"
              style={{ 
                background: colors.cardBg,
                color: colors.textPrimary,
                border: colors.glassBorder,
              }}
              aria-label="Share on Facebook"
            >
              <Facebook className="w-5 h-5" />
              Facebook
            </Button>
          </div>
        </section>

        {/* Your Referrals */}
        <section aria-labelledby="referrals-heading" className="px-4 pb-4">
          <h2 id="referrals-heading" className="text-lg font-semibold mb-3" style={{ color: colors.textPrimary }}>
            Your Referrals ({referrals.length})
          </h2>

          <div className="space-y-2">
            {referrals.map((referral) => (
              <div
                key={referral.id}
                className="rounded-xl p-3"
                style={{
                  background: colors.cardBg,
                  backdropFilter: colors.blur,
                  WebkitBackdropFilter: colors.blur,
                  border: colors.glassBorder,
                  boxShadow: colors.shadow,
                }}
              >
                <div className="flex items-start gap-3">
                  <div 
                    className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 font-bold"
                    style={{ 
                      background: colors.iconBg,
                      color: colors.iconColor,
                    }}
                  >
                    {referral.avatar}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold" style={{ color: colors.textPrimary }}>
                        {referral.name}
                      </h3>
                      <span 
                        className="text-xs px-2 py-0.5 rounded-full"
                        style={{
                          background: getStatusBg(referral.status),
                          color: getStatusColor(referral.status),
                        }}
                      >
                        {referral.status}
                      </span>
                    </div>
                    <div className="text-sm mb-2" style={{ color: colors.textTertiary }}>
                      Joined {referral.joinedDate}
                    </div>
                    <div className="flex items-center gap-3 text-xs flex-wrap">
                      <span className="flex items-center gap-1" style={{ color: colors.textTertiary }}>
                        <Trophy className="w-3 h-3" />
                        {referral.lessonsCompleted} lessons
                      </span>
                      <span className="flex items-center gap-1" style={{ color: colors.textTertiary }}>
                        <Zap className="w-3 h-3" />
                        {referral.totalXP} XP
                      </span>
                      {referral.rewardEarned && (
                        <span 
                          className="flex items-center gap-1 px-2 py-0.5 rounded-full"
                          style={{ 
                            background: colors.successBg,
                            color: colors.successColor,
                          }}
                        >
                          <CheckCircle2 className="w-3 h-3" />
                          {referral.reward}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Available Rewards */}
        <section aria-labelledby="rewards-heading" className="px-4 pb-4">
          <h2 id="rewards-heading" className="text-lg font-semibold mb-3" style={{ color: colors.textPrimary }}>
            Available Rewards
          </h2>

          <div className="space-y-3">
            {rewards.map((reward) => {
              const IconComponent = getRewardIcon(reward.icon);
              const canRedeem = reward.available && stats.pointsBalance >= reward.pointsRequired;
              
              return (
                <div
                  key={reward.id}
                  className="rounded-xl p-4"
                  style={{
                    background: colors.cardBg,
                    backdropFilter: colors.blur,
                    WebkitBackdropFilter: colors.blur,
                    border: colors.glassBorder,
                    boxShadow: colors.shadow,
                    opacity: reward.available ? 1 : 0.6,
                  }}
                >
                  <div className="flex items-start gap-3 mb-3">
                    <div 
                      className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                      style={{ background: getCategoryBg(reward.category) }}
                    >
                      <IconComponent className="w-6 h-6" style={{ color: getCategoryColor(reward.category) }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold" style={{ color: colors.textPrimary }}>
                          {reward.title}
                        </h3>
                        {!reward.available && (
                          <span 
                            className="text-xs px-2 py-0.5 rounded-full"
                            style={{
                              background: colors.errorBg,
                              color: colors.errorColor,
                            }}
                          >
                            Insufficient Points
                          </span>
                        )}
                      </div>
                      <div className="text-sm mb-2" style={{ color: colors.textTertiary }}>
                        {reward.description}
                      </div>
                      <div className="flex items-center gap-3 text-xs flex-wrap">
                        <span 
                          className="flex items-center gap-1 px-2 py-1 rounded-full"
                          style={{ 
                            background: getCategoryBg(reward.category),
                            color: getCategoryColor(reward.category),
                          }}
                        >
                          <Star className="w-3 h-3" />
                          {reward.pointsRequired} points
                        </span>
                        <span style={{ color: colors.textTertiary }}>
                          {reward.value}
                        </span>
                        <span style={{ color: colors.textTertiary }}>
                          • {reward.claimed} claimed
                        </span>
                      </div>
                    </div>
                  </div>

                  <Button
                    onClick={() => handleRedeemReward(reward)}
                    disabled={!canRedeem}
                    className="w-full h-10 rounded-xl font-semibold"
                    style={{ 
                      background: canRedeem ? colors.iconColor : colors.border,
                      color: canRedeem ? (theme === 'dark' ? '#0F0F23' : '#FFFFFF') : colors.textTertiary,
                      cursor: canRedeem ? 'pointer' : 'not-allowed',
                    }}
                    aria-label={`Redeem ${reward.title}`}
                  >
                    {canRedeem ? (
                      <>
                        <Gift className="w-4 h-4 mr-2" />
                        Redeem Now
                      </>
                    ) : (
                      <>
                        Need {reward.pointsRequired - stats.pointsBalance} more points
                      </>
                    )}
                  </Button>
                </div>
              );
            })}
          </div>
        </section>

        {/* How It Works */}
        <section aria-labelledby="how-heading" className="px-4 pb-6">
          <h2 id="how-heading" className="text-lg font-semibold mb-3" style={{ color: colors.textPrimary }}>
            How It Works
          </h2>

          <div 
            className="rounded-xl p-4 space-y-3"
            style={{
              background: colors.cardBg,
              backdropFilter: colors.blur,
              WebkitBackdropFilter: colors.blur,
              border: colors.glassBorder,
              boxShadow: colors.shadow,
            }}
          >
            <div className="flex items-start gap-3">
              <div 
                className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 font-bold text-sm"
                style={{ 
                  background: colors.iconBg,
                  color: colors.iconColor,
                }}
              >
                1
              </div>
              <div className="flex-1">
                <h3 className="font-semibold mb-1" style={{ color: colors.textPrimary }}>
                  Share Your Link
                </h3>
                <p className="text-sm" style={{ color: colors.textTertiary }}>
                  Send your unique referral link to friends via email, SMS, or social media
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div 
                className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 font-bold text-sm"
                style={{ 
                  background: colors.iconBg,
                  color: colors.iconColor,
                }}
              >
                2
              </div>
              <div className="flex-1">
                <h3 className="font-semibold mb-1" style={{ color: colors.textPrimary }}>
                  They Sign Up
                </h3>
                <p className="text-sm" style={{ color: colors.textTertiary }}>
                  When friends join using your link, you'll see them in your referral list
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div 
                className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 font-bold text-sm"
                style={{ 
                  background: colors.iconBg,
                  color: colors.iconColor,
                }}
              >
                3
              </div>
              <div className="flex-1">
                <h3 className="font-semibold mb-1" style={{ color: colors.textPrimary }}>
                  Earn Rewards
                </h3>
                <p className="text-sm" style={{ color: colors.textTertiary }}>
                  Get 200 points when they complete 5 lessons. Redeem points for premium features!
                </p>
              </div>
            </div>
          </div>
        </section>

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
              <strong style={{ color: colors.textPrimary }}>Referral Tips:</strong> Share your link on social media, add it to your email signature, or tell friends in person. The more people you refer, the more rewards you can earn!
            </div>
          </div>
        </section>
      </div>

      {/* Redeem Reward Modal */}
      {showRedeemModal && selectedReward && (
        <div 
          className="fixed inset-0 bg-black/50 flex items-end sm:items-center justify-center z-50 p-4"
          onClick={() => setShowRedeemModal(false)}
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
            aria-labelledby="redeem-title"
            aria-modal="true"
          >
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 id="redeem-title" className="text-xl font-bold mb-1" style={{ color: colors.textPrimary }}>
                  Redeem Reward
                </h3>
                <p className="text-sm" style={{ color: colors.textSecondary }}>
                  Confirm your redemption
                </p>
              </div>
              <button
                onClick={() => setShowRedeemModal(false)}
                className="p-2 rounded-lg"
                style={{ color: colors.textSecondary }}
                aria-label="Close redeem modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Reward Details */}
            <div 
              className="rounded-xl p-4 mb-6"
              style={{ background: colors.iconBg }}
            >
              <div className="flex items-center gap-3 mb-3">
                {(() => {
                  const IconComponent = getRewardIcon(selectedReward.icon);
                  return (
                    <div 
                      className="w-12 h-12 rounded-xl flex items-center justify-center"
                      style={{ background: getCategoryBg(selectedReward.category) }}
                    >
                      <IconComponent className="w-6 h-6" style={{ color: getCategoryColor(selectedReward.category) }} />
                    </div>
                  );
                })()}
                <div className="flex-1">
                  <h4 className="font-semibold mb-1" style={{ color: colors.textPrimary }}>
                    {selectedReward.title}
                  </h4>
                  <p className="text-sm" style={{ color: colors.textTertiary }}>
                    {selectedReward.description}
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between pt-3 border-t" style={{ borderTopColor: colors.border }}>
                <span className="text-sm" style={{ color: colors.textTertiary }}>
                  Points Required
                </span>
                <span className="text-lg font-bold" style={{ color: colors.iconColor }}>
                  {selectedReward.pointsRequired}
                </span>
              </div>
            </div>

            {/* Current Balance */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm" style={{ color: colors.textTertiary }}>
                  Current Balance
                </span>
                <span className="text-sm font-bold" style={{ color: colors.textPrimary }}>
                  {stats.pointsBalance} points
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm" style={{ color: colors.textTertiary }}>
                  After Redemption
                </span>
                <span className="text-sm font-bold" style={{ color: colors.successColor }}>
                  {stats.pointsBalance - selectedReward.pointsRequired} points
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <Button
                onClick={() => setShowRedeemModal(false)}
                className="h-12 rounded-xl font-semibold"
                style={{ 
                  background: colors.border,
                  color: colors.textSecondary,
                }}
                aria-label="Cancel redemption"
              >
                Cancel
              </Button>
              <Button
                onClick={() => {
                  setShowRedeemModal(false);
                  // Handle redemption logic
                }}
                className="h-12 rounded-xl font-semibold"
                style={{ 
                  background: colors.successColor,
                  color: '#FFFFFF',
                }}
                aria-label="Confirm redemption"
              >
                <Gift className="w-5 h-5 mr-2" />
                Redeem
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
