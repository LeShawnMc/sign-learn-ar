import { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, 
  ShoppingCart,
  Star,
  Flame,
  Shield,
  Sparkles,
  Crown,
  Palette,
  Package,
  MessageCircle,
  Clock,
  ChevronRight,
  Check,
  Heart,
  TrendingUp,
  Gift,
  Zap,
  Download,
  History,
  Filter,
  Search,
  Tag
} from 'lucide-react';
import { useApp } from '../context/AppContext';

type ShopView =
  | 'main'
  | 'avatars'
  | 'lesson-packs'
  | 'themes'
  | 'scenes'
  | 'scenarios'
  | 'power-ups'
  | 'purchase-history'
  | 'item-detail'
  | 'get-coins';

interface ShopItem {
  id: string;
  name: string;
  description: string;
  price: number;
  currency: 'coins' | 'premium';
  category: string;
  featured?: boolean;
  dailyDeal?: boolean;
  discount?: number;
  originalPrice?: number;
  icon: string;
  owned?: boolean;
  popular?: boolean;
  newItem?: boolean;
  preview?: string;
}

interface PurchaseHistoryItem {
  id: string;
  date: string;
  itemName: string;
  price: number;
  currency: 'coins' | 'premium';
  category: string;
}

interface ShopScreenProps {
  onExit: () => void;
}

export function ShopScreen({ onExit }: ShopScreenProps) {
  useApp(); // keep context alive for future wiring
  const [currentView, setCurrentView] = useState<ShopView>('main');
  const [previousView, setPreviousView] = useState<ShopView>('main');
  const [selectedItem, setSelectedItem] = useState<ShopItem | null>(null);
  const [userCoins, setUserCoins] = useState(2450);
  const [searchQuery, setSearchQuery] = useState('');
  // Items owned by the user (pre-populated from items with owned:true)
  const [ownedIds, setOwnedIds] = useState<Set<string>>(new Set(['avatar-5', 'theme-1', 'scene-3']));
  const [wishlisted, setWishlisted] = useState<Set<string>>(new Set());
  const [purchaseResult, setPurchaseResult] = useState<{ item: ShopItem; success: boolean; requiresPremium?: boolean } | null>(null);
  const [dealTimeLeft, setDealTimeLeft] = useState('');

  useEffect(() => {
    const update = () => {
      const now = new Date();
      const midnight = new Date(); midnight.setHours(24, 0, 0, 0);
      const diff = midnight.getTime() - now.getTime();
      const h = Math.floor(diff / 3600000);
      const m = Math.floor((diff % 3600000) / 60000);
      const s = Math.floor((diff % 60000) / 1000);
      setDealTimeLeft(`${h}h ${String(m).padStart(2,'0')}m ${String(s).padStart(2,'0')}s`);
    };
    update();
    const t = setInterval(update, 1000);
    return () => clearInterval(t);
  }, []);

  // Avatar customization items
  const avatarItems: ShopItem[] = [
    {
      id: 'avatar-1',
      name: 'Neon Glow Avatar',
      description: 'Stand out with a vibrant neon outline effect',
      price: 150,
      currency: 'coins',
      category: 'avatar',
      icon: '👤',
      preview: '#00ff88',
      popular: true,
    },
    {
      id: 'avatar-2',
      name: 'Rainbow Effect',
      description: 'Celebrate diversity with a colorful rainbow aura',
      price: 200,
      currency: 'coins',
      category: 'avatar',
      icon: '🌈',
      preview: '#ff00ff',
      newItem: true,
    },
    {
      id: 'avatar-3',
      name: 'Gold Crown',
      description: 'Show off your achievements with a golden crown',
      price: 500,
      currency: 'coins',
      category: 'avatar',
      icon: '👑',
      preview: '#ffd700',
      featured: true,
    },
    {
      id: 'avatar-4',
      name: 'Sparkle Trail',
      description: 'Leave a trail of sparkles wherever you go',
      price: 250,
      currency: 'coins',
      category: 'avatar',
      icon: '✨',
      preview: '#ffff00',
    },
    {
      id: 'avatar-5',
      name: 'Fire Frame',
      description: 'Surround your avatar with animated flames',
      price: 300,
      currency: 'coins',
      category: 'avatar',
      icon: '🔥',
      preview: '#ff4500',
      owned: true,
    },
    {
      id: 'avatar-6',
      name: 'Ice Crystal',
      description: 'Cool ice crystal effect with frozen particles',
      price: 350,
      currency: 'coins',
      category: 'avatar',
      icon: '❄️',
      preview: '#00bfff',
    },
  ];

  // Lesson packs
  const lessonPacks: ShopItem[] = [
    {
      id: 'lesson-1',
      name: 'Medical Sign Language Pack',
      description: '50+ medical terms and emergency phrases',
      price: 299,
      currency: 'premium',
      category: 'lesson',
      icon: '🏥',
      popular: true,
    },
    {
      id: 'lesson-2',
      name: 'Business & Professional',
      description: 'Office vocabulary and meeting phrases',
      price: 249,
      currency: 'premium',
      category: 'lesson',
      icon: '💼',
      newItem: true,
    },
    {
      id: 'lesson-3',
      name: 'Food & Dining Pack',
      description: 'Restaurant, cooking, and food-related signs',
      price: 199,
      currency: 'premium',
      category: 'lesson',
      icon: '🍽️',
      dailyDeal: true,
      discount: 30,
      originalPrice: 284,
    },
    {
      id: 'lesson-4',
      name: 'Travel Essentials',
      description: 'Navigate airports, hotels, and tourist spots',
      price: 229,
      currency: 'premium',
      category: 'lesson',
      icon: '✈️',
    },
    {
      id: 'lesson-5',
      name: 'Sports & Recreation',
      description: 'Athletic terms and recreational activities',
      price: 189,
      currency: 'premium',
      category: 'lesson',
      icon: '⚽',
    },
    {
      id: 'lesson-6',
      name: 'Tech & Gaming',
      description: 'Modern technology and gaming vocabulary',
      price: 199,
      currency: 'premium',
      category: 'lesson',
      icon: '🎮',
      featured: true,
    },
  ];

  // Theme packs
  const themePacks: ShopItem[] = [
    {
      id: 'theme-1',
      name: 'Dark Mode Premium',
      description: 'Sleek dark interface with blue accents',
      price: 100,
      currency: 'coins',
      category: 'theme',
      icon: '🌙',
      owned: true,
    },
    {
      id: 'theme-2',
      name: 'Ocean Breeze',
      description: 'Calming blue and teal color scheme',
      price: 150,
      currency: 'coins',
      category: 'theme',
      icon: '🌊',
      popular: true,
    },
    {
      id: 'theme-3',
      name: 'Sunset Vibes',
      description: 'Warm orange and purple gradients',
      price: 150,
      currency: 'coins',
      category: 'theme',
      icon: '🌅',
      newItem: true,
    },
    {
      id: 'theme-4',
      name: 'Forest Green',
      description: 'Natural green tones for a calm experience',
      price: 150,
      currency: 'coins',
      category: 'theme',
      icon: '🌲',
    },
    {
      id: 'theme-5',
      name: 'Cherry Blossom',
      description: 'Soft pink and white sakura theme',
      price: 200,
      currency: 'coins',
      category: 'theme',
      icon: '🌸',
      featured: true,
    },
    {
      id: 'theme-6',
      name: 'Neon Cyberpunk',
      description: 'Futuristic neon colors and effects',
      price: 250,
      currency: 'coins',
      category: 'theme',
      icon: '🌆',
    },
  ];

  // AR Scene themes
  const sceneThemes: ShopItem[] = [
    {
      id: 'scene-1',
      name: 'Coffee Shop Scene',
      description: 'Practice signs in a virtual coffee shop',
      price: 180,
      currency: 'coins',
      category: 'scene',
      icon: '☕',
      popular: true,
    },
    {
      id: 'scene-2',
      name: 'Park & Nature',
      description: 'Outdoor learning environment with nature',
      price: 200,
      currency: 'coins',
      category: 'scene',
      icon: '🌳',
    },
    {
      id: 'scene-3',
      name: 'Classroom Setting',
      description: 'Traditional classroom with board and desks',
      price: 150,
      currency: 'coins',
      category: 'scene',
      icon: '🏫',
      owned: true,
    },
    {
      id: 'scene-4',
      name: 'Space Station',
      description: 'Learn signs in a futuristic space environment',
      price: 300,
      currency: 'coins',
      category: 'scene',
      icon: '🚀',
      newItem: true,
      featured: true,
    },
    {
      id: 'scene-5',
      name: 'Beach Paradise',
      description: 'Tropical beach with ocean waves',
      price: 220,
      currency: 'coins',
      category: 'scene',
      icon: '🏖️',
    },
    {
      id: 'scene-6',
      name: 'City Street',
      description: 'Urban environment with buildings and traffic',
      price: 180,
      currency: 'coins',
      category: 'scene',
      icon: '🏙️',
    },
  ];

  // Conversation scenario packs
  const scenarioPacks: ShopItem[] = [
    {
      id: 'scenario-1',
      name: 'Job Interview Scenarios',
      description: '10 realistic job interview conversations',
      price: 199,
      currency: 'premium',
      category: 'scenario',
      icon: '💼',
      popular: true,
    },
    {
      id: 'scenario-2',
      name: 'First Date Conversations',
      description: 'Navigate romantic situations with confidence',
      price: 149,
      currency: 'premium',
      category: 'scenario',
      icon: '💕',
    },
    {
      id: 'scenario-3',
      name: 'Emergency Situations',
      description: 'Critical phrases for urgent scenarios',
      price: 249,
      currency: 'premium',
      category: 'scenario',
      icon: '🚨',
      featured: true,
    },
    {
      id: 'scenario-4',
      name: 'Shopping & Retail',
      description: 'Store interactions and customer service',
      price: 129,
      currency: 'premium',
      category: 'scenario',
      icon: '🛍️',
      dailyDeal: true,
      discount: 25,
      originalPrice: 172,
    },
    {
      id: 'scenario-5',
      name: 'Family Gatherings',
      description: 'Holiday and family event conversations',
      price: 159,
      currency: 'premium',
      category: 'scenario',
      icon: '👨‍👩‍👧‍👦',
    },
    {
      id: 'scenario-6',
      name: 'School & Education',
      description: 'Parent-teacher meetings and school events',
      price: 149,
      currency: 'premium',
      category: 'scenario',
      icon: '📚',
    },
  ];

  // Power-ups and streak items
  const powerUpItems: ShopItem[] = [
    {
      id: 'power-1',
      name: 'Streak Freeze',
      description: 'Protect your streak for 1 day',
      price: 50,
      currency: 'coins',
      category: 'power-up',
      icon: '🧊',
      popular: true,
    },
    {
      id: 'power-2',
      name: 'Streak Freeze 7-Day',
      description: 'Protect your streak for an entire week',
      price: 300,
      currency: 'coins',
      category: 'power-up',
      icon: '❄️',
      featured: true,
    },
    {
      id: 'power-3',
      name: 'Streak Recovery',
      description: 'Restore your lost streak (up to 7 days)',
      price: 400,
      currency: 'coins',
      category: 'power-up',
      icon: '💚',
    },
    {
      id: 'power-4',
      name: 'Double XP Boost',
      description: 'Earn 2x XP for 24 hours',
      price: 100,
      currency: 'coins',
      category: 'power-up',
      icon: '⚡',
      dailyDeal: true,
      discount: 50,
      originalPrice: 200,
    },
    {
      id: 'power-5',
      name: 'Perfect Practice Pass',
      description: 'Get 100% on any practice session',
      price: 150,
      currency: 'coins',
      category: 'power-up',
      icon: '🎯',
    },
    {
      id: 'power-6',
      name: 'Instant Unlock',
      description: 'Unlock any locked lesson immediately',
      price: 200,
      currency: 'coins',
      category: 'power-up',
      icon: '🔓',
    },
  ];

  // Purchase history (state so new purchases append)
  const [purchaseHistory, setPurchaseHistory] = useState<PurchaseHistoryItem[]>([
    { id: 'purchase-1', date: 'Jan 8, 2024',  itemName: 'Fire Frame',        price: 300, currency: 'coins', category: 'avatar' },
    { id: 'purchase-2', date: 'Jan 5, 2024',  itemName: 'Double XP Boost',   price: 100, currency: 'coins', category: 'power-up' },
    { id: 'purchase-3', date: 'Dec 28, 2023', itemName: 'Classroom Setting',  price: 150, currency: 'coins', category: 'scene' },
    { id: 'purchase-4', date: 'Dec 20, 2023', itemName: 'Dark Mode Premium',  price: 100, currency: 'coins', category: 'theme' },
    { id: 'purchase-5', date: 'Dec 15, 2023', itemName: 'Streak Freeze',      price: 50,  currency: 'coins', category: 'power-up' },
  ]);

  const allItems = [
    ...avatarItems, ...lessonPacks, ...themePacks,
    ...sceneThemes, ...scenarioPacks, ...powerUpItems,
  ];

  const featuredItems = allItems.filter(item => item.featured);
  const dailyDeals    = allItems.filter(item => item.dailyDeal);

  const totalSpentCoins = purchaseHistory
    .filter(p => p.currency === 'coins')
    .reduce((sum, p) => sum + p.price, 0);

  const handlePurchase = (item: ShopItem) => {
    if (item.currency === 'premium') {
      setPurchaseResult({ item, success: false, requiresPremium: true });
      return;
    }
    if (userCoins < item.price) {
      setPurchaseResult({ item, success: false });
      return;
    }
    setUserCoins(prev => prev - item.price);
    setOwnedIds(prev => new Set([...prev, item.id]));
    setPurchaseHistory(prev => [{
      id: `ph-${Date.now()}`,
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      itemName: item.name,
      price: item.price,
      currency: 'coins' as const,
      category: item.category,
    }, ...prev]);
    setPurchaseResult({ item, success: true });
  };

  const handleDownloadReceipt = (purchase: PurchaseHistoryItem) => {
    const lines = [
      'SIGN LEARN AR — PURCHASE RECEIPT',
      '─'.repeat(38),
      `Item:      ${purchase.itemName}`,
      `Category:  ${purchase.category}`,
      `Date:      ${purchase.date}`,
      `Amount:    ${purchase.price} ${purchase.currency === 'coins' ? 'Coins' : 'Premium Gems'}`,
      `Order ID:  ${purchase.id}`,
      '─'.repeat(38),
      'Thank you for your purchase! 🤟',
    ].join('\n');
    const blob = new Blob([lines], { type: 'text/plain' });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement('a');
    a.href = url; a.download = `receipt-${purchase.id}.txt`; a.click();
    URL.revokeObjectURL(url);
  };

  const toggleWishlist = (id: string) =>
    setWishlisted(prev => {
      const next = new Set(prev);
      if (next.has(id)) { next.delete(id); } else { next.add(id); }
      return next;
    });

  const openItemDetail = (item: ShopItem) => {
    setPreviousView(currentView as ShopView);
    setSelectedItem(item);
    setCurrentView('item-detail');
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'avatar': return <Palette className="w-5 h-5" />;
      case 'lesson': return <Package className="w-5 h-5" />;
      case 'theme': return <Sparkles className="w-5 h-5" />;
      case 'scene': return <Crown className="w-5 h-5" />;
      case 'scenario': return <MessageCircle className="w-5 h-5" />;
      case 'power-up': return <Zap className="w-5 h-5" />;
      default: return <Star className="w-5 h-5" />;
    }
  };

  const renderItemCard = (item: ShopItem, index: number = 0) => {
    const isOwned = ownedIds.has(item.id);
    return (
      <motion.div
        key={item.id}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.05 }}
        className="bg-gray-900 rounded-xl overflow-hidden"
      >
        <div
          className="h-32 flex items-center justify-center text-6xl relative"
          style={item.preview ? { backgroundColor: item.preview + '20' } : { backgroundColor: '#1f2937' }}
          aria-hidden="true"
        >
          {item.icon}
          {item.newItem && !isOwned && (
            <div className="absolute top-2 right-2 bg-green-600 text-white text-xs px-2 py-1 rounded-full font-semibold">New</div>
          )}
          {item.popular && !item.newItem && (
            <div className="absolute top-2 left-2 bg-yellow-600 text-white text-xs px-2 py-1 rounded-full font-semibold flex items-center gap-1">
              <Star className="w-3 h-3" />Popular
            </div>
          )}
          {isOwned && (
            <div className="absolute top-2 right-2 bg-blue-600 text-white text-xs px-2 py-1 rounded-full font-semibold flex items-center gap-1">
              <Check className="w-3 h-3" />Owned
            </div>
          )}
          {item.dailyDeal && item.discount && (
            <div className="absolute top-2 left-2 bg-red-600 text-white text-xs px-2 py-1 rounded-full font-semibold">
              -{item.discount}%
            </div>
          )}
        </div>

        <div className="p-4">
          <h3 className="font-semibold mb-1 line-clamp-1">{item.name}</h3>
          <p className="text-xs text-gray-400 mb-3 line-clamp-2">{item.description}</p>
          <div className="flex items-center justify-between">
            <div>
              {item.dailyDeal && item.originalPrice ? (
                <div className="flex items-center gap-2">
                  <span className="text-lg font-bold text-green-500">
                    {item.currency === 'coins' ? `${item.price} 🪙` : `${item.price} 💎`}
                  </span>
                  <span className="text-sm text-gray-500 line-through">{item.originalPrice}</span>
                </div>
              ) : (
                <div className="text-lg font-bold">
                  {item.currency === 'coins' ? `${item.price} 🪙` : `${item.price} 💎`}
                </div>
              )}
            </div>
            <Button
              onClick={() => openItemDetail(item)}
              size="sm"
              className={isOwned ? 'bg-gray-700 text-gray-400 cursor-default' : 'bg-blue-600 hover:bg-blue-700'}
              disabled={isOwned}
              aria-label={isOwned ? `${item.name} — Already owned` : `View details for ${item.name}`}
            >
              {isOwned ? 'Owned' : 'View'}
            </Button>
          </div>
        </div>
      </motion.div>
    );
  };

  // ── Purchase Result Modal (shown over any view) ──────────────────────────────
  const PurchaseModal = purchaseResult ? (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-6"
      style={{ background: 'rgba(0,0,0,0.85)' }}
    >
      <motion.div
        initial={{ scale: 0.85, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className={`bg-gray-900 rounded-2xl p-8 max-w-sm w-full text-center border-2 ${purchaseResult.success ? 'border-blue-500' : 'border-red-500'}`}
      >
        {purchaseResult.success ? (
          <>
            <div className="text-7xl mb-4">{purchaseResult.item.icon}</div>
            <h2 className="text-xl font-bold mb-2">Purchase Successful! 🎉</h2>
            <p className="text-gray-400 mb-6">{purchaseResult.item.name} has been added to your collection.</p>
            <Button onClick={() => setPurchaseResult(null)} className="w-full h-12 bg-blue-600 hover:bg-blue-700 rounded-full font-semibold">
              Awesome!
            </Button>
          </>
        ) : purchaseResult.requiresPremium ? (
          <>
            <div className="text-6xl mb-4">💎</div>
            <h2 className="text-xl font-bold mb-2">Premium Required</h2>
            <p className="text-gray-400 mb-6">This item requires Premium Gems. Upgrade to unlock gem purchases.</p>
            <div className="space-y-2">
              <Button onClick={() => { setPurchaseResult(null); onExit(); }} className="w-full h-12 bg-yellow-600 hover:bg-yellow-700 rounded-full font-semibold">
                View Premium Plans
              </Button>
              <Button onClick={() => setPurchaseResult(null)} variant="ghost" className="w-full text-gray-400">Cancel</Button>
            </div>
          </>
        ) : (
          <>
            <div className="text-6xl mb-4">🪙</div>
            <h2 className="text-xl font-bold mb-2">Not Enough Coins</h2>
            <p className="text-gray-400 mb-6">
              You need {purchaseResult.item.price} coins but only have {userCoins.toLocaleString()}. Get more coins to continue.
            </p>
            <div className="space-y-2">
              <Button onClick={() => { setPurchaseResult(null); setCurrentView('get-coins'); }} className="w-full h-12 bg-yellow-600 hover:bg-yellow-700 rounded-full font-semibold">
                Get More Coins
              </Button>
              <Button onClick={() => setPurchaseResult(null)} variant="ghost" className="w-full text-gray-400">Cancel</Button>
            </div>
          </>
        )}
      </motion.div>
    </motion.div>
  ) : null;

  // Main Shop Screen
  if (currentView === 'main') {
    return (
      <div
        className="min-h-screen bg-black text-white flex flex-col"
        role="main"
        aria-labelledby="shop-title"
      >
        {PurchaseModal}
        {/* Header */}
        <div className="p-6 pb-4">
          <div className="flex items-center justify-between mb-4">
            <h1 id="shop-title" className="text-2xl font-bold">Shop</h1>
            <Button
              variant="ghost"
              size="icon"
              onClick={onExit}
              className="w-10 h-10 rounded-full hover:bg-gray-900"
              aria-label="Close shop"
            >
              <X className="w-5 h-5" />
            </Button>
          </div>

          {/* Currency Balance */}
          <div className="flex items-center gap-3">
            <div className="flex-1 bg-gradient-to-br from-yellow-600 to-yellow-800 rounded-xl p-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="text-3xl" aria-hidden="true">🪙</div>
                <div>
                  <div className="text-sm opacity-90">Coins</div>
                  <div className="text-2xl font-bold">{userCoins.toLocaleString()}</div>
                </div>
              </div>
              <Button
                size="sm"
                onClick={() => setCurrentView('get-coins')}
                className="bg-white text-yellow-800 hover:bg-gray-100 font-semibold"
                aria-label="Get more coins"
              >
                Get More
              </Button>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setCurrentView('purchase-history')}
              className="w-12 h-12 rounded-xl bg-gray-900 hover:bg-gray-800"
              aria-label="View purchase history"
            >
              <History className="w-5 h-5" />
            </Button>
          </div>
        </div>

        {/* Daily Deals */}
        {dailyDeals.length > 0 && (
          <div className="px-6 mb-6">
            <div className="flex items-center gap-2 mb-3">
              <Zap className="w-5 h-5 text-yellow-500" />
              <h2 className="text-lg font-semibold">Daily Deals</h2>
              <div className="flex items-center gap-1 text-sm text-gray-400">
                <Clock className="w-4 h-4" />
                <span aria-live="polite">{dealTimeLeft || '...'}</span>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {dailyDeals.map((item, index) => renderItemCard(item, index))}
            </div>
          </div>
        )}

        {/* Featured Items */}
        {featuredItems.length > 0 && (
          <div className="px-6 mb-6">
            <div className="flex items-center gap-2 mb-3">
              <Star className="w-5 h-5 text-blue-500" />
              <h2 className="text-lg font-semibold">Featured Items</h2>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {featuredItems.slice(0, 4).map((item, index) => renderItemCard(item, index))}
            </div>
          </div>
        )}

        {/* Shop Categories */}
        <div className="flex-1 px-6 pb-6">
          <h2 className="text-lg font-semibold mb-3">Browse Categories</h2>
          <div className="space-y-3">
            {[
              { id: 'avatars', name: 'Avatar Customization', icon: <Palette className="w-5 h-5" />, count: avatarItems.length, color: 'from-pink-600 to-pink-800' },
              { id: 'lesson-packs', name: 'Lesson Packs', icon: <Package className="w-5 h-5" />, count: lessonPacks.length, color: 'from-blue-600 to-blue-800' },
              { id: 'themes', name: 'Theme Packs', icon: <Sparkles className="w-5 h-5" />, count: themePacks.length, color: 'from-purple-600 to-purple-800' },
              { id: 'scenes', name: 'AR Scene Themes', icon: <Crown className="w-5 h-5" />, count: sceneThemes.length, color: 'from-green-600 to-green-800' },
              { id: 'scenarios', name: 'Conversation Scenarios', icon: <MessageCircle className="w-5 h-5" />, count: scenarioPacks.length, color: 'from-orange-600 to-orange-800' },
              { id: 'power-ups', name: 'Power-Ups & Streak', icon: <Zap className="w-5 h-5" />, count: powerUpItems.length, color: 'from-yellow-600 to-yellow-800' },
            ].map((category, index) => (
              <motion.button
                key={category.id}
                onClick={() => setCurrentView(category.id as ShopView)}
                className="w-full bg-gray-900 rounded-xl p-4 flex items-center justify-between hover:bg-gray-800 transition-colors"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                aria-label={`${category.name} - ${category.count} items`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${category.color} flex items-center justify-center`} aria-hidden="true">
                    {category.icon}
                  </div>
                  <div className="text-left">
                    <div className="font-semibold">{category.name}</div>
                    <div className="text-xs text-gray-400">{category.count} items</div>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-600" />
              </motion.button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Category View (Avatars, Lessons, etc.)
  if (['avatars', 'lesson-packs', 'themes', 'scenes', 'scenarios', 'power-ups'].includes(currentView)) {
    let categoryTitle = '';
    let categoryItems: ShopItem[] = [];

    switch (currentView) {
      case 'avatars':
        categoryTitle = 'Avatar Customization';
        categoryItems = avatarItems;
        break;
      case 'lesson-packs':
        categoryTitle = 'Lesson Packs';
        categoryItems = lessonPacks;
        break;
      case 'themes':
        categoryTitle = 'Theme Packs';
        categoryItems = themePacks;
        break;
      case 'scenes':
        categoryTitle = 'AR Scene Themes';
        categoryItems = sceneThemes;
        break;
      case 'scenarios':
        categoryTitle = 'Conversation Scenarios';
        categoryItems = scenarioPacks;
        break;
      case 'power-ups':
        categoryTitle = 'Power-Ups & Streak';
        categoryItems = powerUpItems;
        break;
    }

    const filteredItems = searchQuery
      ? categoryItems.filter(i =>
          i.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          i.description.toLowerCase().includes(searchQuery.toLowerCase()))
      : categoryItems;

    return (
      <div className="min-h-screen bg-black text-white flex flex-col" role="main" aria-labelledby="category-title">
        {PurchaseModal}
        {/* Header */}
        <div className="p-6 pb-4">
          <div className="flex items-center gap-4 mb-4">
            <Button variant="ghost" size="icon" onClick={() => { setSearchQuery(''); setCurrentView('main'); }} className="w-10 h-10 rounded-full hover:bg-gray-900" aria-label="Back to shop">
              <X className="w-5 h-5" />
            </Button>
            <h1 id="category-title" className="text-xl font-bold flex-1">{categoryTitle}</h1>
            <div className="text-sm text-gray-400">{filteredItems.length} items</div>
          </div>

          {/* Balance + Search */}
          <div className="bg-gray-900 rounded-xl p-3 flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="text-2xl" aria-hidden="true">🪙</div>
              <div>
                <div className="text-xs text-gray-400">Balance</div>
                <div className="text-lg font-bold">{userCoins.toLocaleString()}</div>
              </div>
            </div>
            <Button size="sm" onClick={() => setCurrentView('get-coins')} className="bg-yellow-600 hover:bg-yellow-700 text-white text-xs">+ Get More</Button>
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            <input
              type="text" value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder={`Search ${categoryTitle.toLowerCase()}…`}
              className="w-full bg-gray-900 border border-gray-800 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
              aria-label="Search items"
            />
          </div>
        </div>

        {/* Items Grid */}
        <div className="flex-1 px-6 pb-6 overflow-y-auto">
          {filteredItems.length > 0 ? (
            <div className="grid grid-cols-2 gap-3">
              {filteredItems.map((item, index) => renderItemCard(item, index))}
            </div>
          ) : (
            <div className="text-center py-16 text-gray-500">
              <Search className="w-10 h-10 mx-auto mb-3 opacity-40" />
              <p>No items match "{searchQuery}"</p>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Item Detail View
  if (currentView === 'item-detail' && selectedItem) {
    const isOwned     = ownedIds.has(selectedItem.id);
    const isWishlisted = wishlisted.has(selectedItem.id);
    return (
      <div className="min-h-screen bg-black text-white flex flex-col" role="main" aria-labelledby="item-title">
        {PurchaseModal}
        {/* Header */}
        <div className="p-6 pb-4">
          <div className="flex items-center justify-between">
            <Button variant="ghost" size="icon" onClick={() => setCurrentView(previousView)} className="w-10 h-10 rounded-full hover:bg-gray-900" aria-label="Back">
              <X className="w-5 h-5" />
            </Button>
            <Button
              variant="ghost" size="icon"
              onClick={() => toggleWishlist(selectedItem.id)}
              className="w-10 h-10 rounded-full hover:bg-gray-900"
              aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
            >
              <Heart className={`w-5 h-5 ${isWishlisted ? 'fill-red-500 text-red-500' : ''}`} />
            </Button>
          </div>
        </div>

        {/* Item Preview */}
        <div className="px-6 mb-6">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="h-64 rounded-2xl flex items-center justify-center text-9xl"
            style={selectedItem.preview ? { backgroundColor: selectedItem.preview + '20' } : { backgroundColor: '#1f2937' }}
            aria-hidden="true"
          >
            {selectedItem.icon}
          </motion.div>
        </div>

        {/* Item Info */}
        <div className="flex-1 px-6 pb-6">
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-2">
              {selectedItem.newItem && (
                <span className="bg-green-600 text-white text-xs px-2 py-1 rounded-full font-semibold">
                  New
                </span>
              )}
              {selectedItem.popular && (
                <span className="bg-yellow-600 text-white text-xs px-2 py-1 rounded-full font-semibold flex items-center gap-1">
                  <Star className="w-3 h-3" />
                  Popular
                </span>
              )}
              {selectedItem.dailyDeal && (
                <span className="bg-red-600 text-white text-xs px-2 py-1 rounded-full font-semibold">
                  Daily Deal
                </span>
              )}
            </div>

            <h1 id="item-title" className="text-2xl font-bold mb-2">{selectedItem.name}</h1>
            <p className="text-gray-400">{selectedItem.description}</p>
          </div>

          {/* Features/Details */}
          <div className="bg-gray-900 rounded-xl p-5 mb-6">
            <h3 className="font-semibold mb-3">What's Included</h3>
            <ul className="space-y-2" role="list">
              {selectedItem.category === 'lesson' && (
                <>
                  <li className="flex items-center gap-2 text-sm">
                    <Check className="w-4 h-4 text-green-500 flex-shrink-0" />
                    <span>50+ interactive lessons</span>
                  </li>
                  <li className="flex items-center gap-2 text-sm">
                    <Check className="w-4 h-4 text-green-500 flex-shrink-0" />
                    <span>Video demonstrations</span>
                  </li>
                  <li className="flex items-center gap-2 text-sm">
                    <Check className="w-4 h-4 text-green-500 flex-shrink-0" />
                    <span>Practice exercises</span>
                  </li>
                  <li className="flex items-center gap-2 text-sm">
                    <Check className="w-4 h-4 text-green-500 flex-shrink-0" />
                    <span>Progress tracking</span>
                  </li>
                </>
              )}
              {selectedItem.category === 'avatar' && (
                <>
                  <li className="flex items-center gap-2 text-sm">
                    <Check className="w-4 h-4 text-green-500 flex-shrink-0" />
                    <span>Unique visual effect</span>
                  </li>
                  <li className="flex items-center gap-2 text-sm">
                    <Check className="w-4 h-4 text-green-500 flex-shrink-0" />
                    <span>Visible in all modes</span>
                  </li>
                  <li className="flex items-center gap-2 text-sm">
                    <Check className="w-4 h-4 text-green-500 flex-shrink-0" />
                    <span>Show off to friends</span>
                  </li>
                </>
              )}
              {selectedItem.category === 'theme' && (
                <>
                  <li className="flex items-center gap-2 text-sm">
                    <Check className="w-4 h-4 text-green-500 flex-shrink-0" />
                    <span>Full app color scheme</span>
                  </li>
                  <li className="flex items-center gap-2 text-sm">
                    <Check className="w-4 h-4 text-green-500 flex-shrink-0" />
                    <span>Custom icons & elements</span>
                  </li>
                  <li className="flex items-center gap-2 text-sm">
                    <Check className="w-4 h-4 text-green-500 flex-shrink-0" />
                    <span>Eye-friendly design</span>
                  </li>
                </>
              )}
              {selectedItem.category === 'scene' && (
                <>
                  <li className="flex items-center gap-2 text-sm">
                    <Check className="w-4 h-4 text-green-500 flex-shrink-0" />
                    <span>Immersive 3D environment</span>
                  </li>
                  <li className="flex items-center gap-2 text-sm">
                    <Check className="w-4 h-4 text-green-500 flex-shrink-0" />
                    <span>AR hand tracking support</span>
                  </li>
                  <li className="flex items-center gap-2 text-sm">
                    <Check className="w-4 h-4 text-green-500 flex-shrink-0" />
                    <span>Ambient sounds & effects</span>
                  </li>
                </>
              )}
              {selectedItem.category === 'scenario' && (
                <>
                  <li className="flex items-center gap-2 text-sm">
                    <Check className="w-4 h-4 text-green-500 flex-shrink-0" />
                    <span>10+ conversation scenarios</span>
                  </li>
                  <li className="flex items-center gap-2 text-sm">
                    <Check className="w-4 h-4 text-green-500 flex-shrink-0" />
                    <span>AI conversation partner</span>
                  </li>
                  <li className="flex items-center gap-2 text-sm">
                    <Check className="w-4 h-4 text-green-500 flex-shrink-0" />
                    <span>Real-world contexts</span>
                  </li>
                </>
              )}
              {selectedItem.category === 'power-up' && (
                <>
                  <li className="flex items-center gap-2 text-sm">
                    <Check className="w-4 h-4 text-green-500 flex-shrink-0" />
                    <span>Instant activation</span>
                  </li>
                  <li className="flex items-center gap-2 text-sm">
                    <Check className="w-4 h-4 text-green-500 flex-shrink-0" />
                    <span>Stackable with other items</span>
                  </li>
                  <li className="flex items-center gap-2 text-sm">
                    <Check className="w-4 h-4 text-green-500 flex-shrink-0" />
                    <span>Limited time offer</span>
                  </li>
                </>
              )}
            </ul>
          </div>

          {/* Reviews */}
          <div className="bg-gray-900 rounded-xl p-5 mb-6">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold">Customer Reviews</h3>
              <div className="flex items-center gap-1">
                <Star className="w-4 h-4 fill-yellow-500 text-yellow-500" />
                <span className="font-bold">4.8</span>
                <span className="text-gray-400 text-sm">(127)</span>
              </div>
            </div>
            <div className="space-y-3">
              <div className="bg-gray-800 rounded-lg p-3">
                <div className="flex items-center gap-2 mb-2">
                  <div className="flex items-center">
                    {[1, 2, 3, 4, 5].map(star => (
                      <Star key={star} className="w-3 h-3 fill-yellow-500 text-yellow-500" />
                    ))}
                  </div>
                  <span className="text-xs text-gray-400">by Sarah K.</span>
                </div>
                <p className="text-sm text-gray-300">
                  Amazing quality! Really helps with learning motivation.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Purchase Button */}
        <div className="p-6 border-t border-gray-900">
          <div className="flex items-center gap-3">
            <div className="flex-1">
              {selectedItem.dailyDeal && selectedItem.originalPrice ? (
                <div>
                  <div className="text-2xl font-bold text-green-500">
                    {selectedItem.currency === 'coins' ? `${selectedItem.price} 🪙` : `${selectedItem.price} 💎`}
                  </div>
                  <div className="text-sm text-gray-500 line-through">
                    {selectedItem.originalPrice} {selectedItem.currency === 'coins' ? '🪙' : '💎'}
                  </div>
                </div>
              ) : (
                <div className="text-2xl font-bold">
                  {selectedItem.currency === 'coins' ? `${selectedItem.price} 🪙` : `${selectedItem.price} 💎`}
                </div>
              )}
            </div>
            <Button
              onClick={() => !isOwned && handlePurchase(selectedItem)}
              disabled={isOwned}
              className={`h-14 px-8 rounded-full font-semibold text-lg ${isOwned ? 'bg-gray-700 text-gray-400' : 'bg-blue-600 hover:bg-blue-700'}`}
              aria-label={isOwned ? 'Already owned' : `Purchase ${selectedItem.name}`}
            >
              {isOwned ? '✓ Owned' : 'Purchase'}
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // ── Get Coins View ────────────────────────────────────────────────────────────
  if (currentView === 'get-coins') {
    const coinPacks = [
      { id: 'coins-500',  amount: 500,  bonus: 0,    price: '$0.99', popular: false },
      { id: 'coins-1200', amount: 1200, bonus: 200,  price: '$1.99', popular: true  },
      { id: 'coins-3000', amount: 3000, bonus: 1000, price: '$3.99', popular: false },
      { id: 'coins-7000', amount: 7000, bonus: 3000, price: '$7.99', popular: false },
    ];
    return (
      <div className="min-h-screen bg-black text-white flex flex-col" role="main" aria-labelledby="coins-title">
        <div className="p-6 pb-4">
          <div className="flex items-center gap-4 mb-4">
            <Button variant="ghost" size="icon" onClick={() => setCurrentView('main')} className="w-10 h-10 rounded-full hover:bg-gray-900" aria-label="Back to shop">
              <X className="w-5 h-5" />
            </Button>
            <h1 id="coins-title" className="text-xl font-bold">Get Coins</h1>
          </div>
          <div className="bg-gradient-to-br from-yellow-600 to-yellow-800 rounded-xl p-4 flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="text-3xl">🪙</div>
              <div>
                <div className="text-sm opacity-90">Current Balance</div>
                <div className="text-2xl font-bold">{userCoins.toLocaleString()}</div>
              </div>
            </div>
          </div>
          <div className="space-y-3">
            {coinPacks.map(pack => (
              <motion.button
                key={pack.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                onClick={() => {
                  setUserCoins(prev => prev + pack.amount + pack.bonus);
                  setPurchaseResult({
                    item: { id: pack.id, name: `${(pack.amount + pack.bonus).toLocaleString()} Coins`, description: '', price: 0, currency: 'coins', category: 'coins', icon: '🪙' },
                    success: true,
                  });
                }}
                className={`w-full rounded-xl p-4 flex items-center justify-between hover:opacity-90 transition-opacity ${pack.popular ? 'bg-gradient-to-r from-blue-600 to-blue-800 border-2 border-blue-400' : 'bg-gray-900'}`}
                aria-label={`Buy ${pack.amount + pack.bonus} coins for ${pack.price}`}
              >
                <div className="flex items-center gap-3">
                  <div className="text-3xl">🪙</div>
                  <div className="text-left">
                    <div className="font-bold">{pack.amount.toLocaleString()} Coins</div>
                    {pack.bonus > 0 && <div className="text-xs text-green-400">+{pack.bonus.toLocaleString()} bonus coins!</div>}
                  </div>
                </div>
                <div className="text-right">
                  {pack.popular && <div className="text-xs text-yellow-400 font-semibold mb-1">Best Value</div>}
                  <div className="text-lg font-bold">{pack.price}</div>
                </div>
              </motion.button>
            ))}
          </div>
          <p className="text-center text-xs text-gray-500 mt-6">
            Coins are used for avatar frames, themes, AR scenes, and power-ups.
          </p>
        </div>
        {PurchaseModal}
      </div>
    );
  }

  // Purchase History
  if (currentView === 'purchase-history') {
    return (
      <div
        className="min-h-screen bg-black text-white flex flex-col"
        role="main"
        aria-labelledby="history-title"
      >
        {/* Header */}
        <div className="p-6 pb-4">
          <div className="flex items-center gap-4 mb-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setCurrentView('main')}
              className="w-10 h-10 rounded-full hover:bg-gray-900"
              aria-label="Back to shop"
            >
              <X className="w-5 h-5" />
            </Button>
            <h1 id="history-title" className="text-xl font-bold">Purchase History</h1>
          </div>

          {/* Summary */}
          <div className="bg-gray-900 rounded-xl p-5 grid grid-cols-2 gap-4">
            <div>
              <div className="text-sm text-gray-400 mb-1">Total Purchases</div>
              <div className="text-2xl font-bold">{purchaseHistory.length}</div>
            </div>
            <div>
              <div className="text-sm text-gray-400 mb-1">Total Spent</div>
              <div className="text-2xl font-bold">{totalSpentCoins.toLocaleString()} 🪙</div>
            </div>
          </div>
        </div>

        {/* Purchase List */}
        <div className="flex-1 px-6 pb-6 overflow-y-auto">
          <div className="space-y-3">
            {purchaseHistory.map((purchase, index) => (
              <motion.div
                key={purchase.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="bg-gray-900 rounded-xl p-4"
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <div className="font-semibold mb-1">{purchase.itemName}</div>
                    <div className="text-sm text-gray-400">{purchase.date}</div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold">
                      {purchase.currency === 'coins' ? `${purchase.price} 🪙` : `${purchase.price} 💎`}
                    </div>
                    <div className="text-xs text-gray-400 capitalize">{purchase.category}</div>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleDownloadReceipt(purchase)}
                  className="text-blue-500 hover:text-blue-400 h-auto p-0"
                  aria-label={`Download receipt for ${purchase.itemName}`}
                >
                  <Download className="w-4 h-4 mr-1" />
                  Download Receipt
                </Button>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return null;
}
