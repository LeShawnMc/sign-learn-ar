import { useState, useRef } from 'react';
import { Button } from './ui/button';
import { useTheme } from '../context/ThemeContext';
import { useApp } from '../context/AppContext';
import { motion, AnimatePresence } from 'motion/react';
import {
  X, Heart, MessageCircle, Share2, Trophy, TrendingUp, Calendar, MapPin,
  Users, Award, Flame, Target, Send, MessageSquare, Bell, Plus,
  Check, ChevronLeft, Pin, BookOpen, Loader2, CheckCircle,
} from 'lucide-react';

interface CommunityFeedProps { onExit: () => void; }

interface Post {
  id: string;
  user: { name: string; username: string; avatar: string; isVerified?: boolean };
  timestamp: string;
  content: string;
  type: 'achievement' | 'post' | 'challenge' | 'milestone';
  achievement?: { title: string; description: string; icon: string };
  stats?: { likes: number; comments: number; shares: number };
  liked?: boolean;
}

interface Challenge {
  id: string; title: string; description: string;
  difficulty: 'easy' | 'medium' | 'hard';
  participants: number; daysLeft: number; reward: string;
  progress?: number;
  steps?: string[];
}

interface LeaderboardEntry {
  rank: number;
  user: { name: string; username: string; avatar: string };
  score: number; streak: number; change: number;
}

interface Event {
  id: string; title: string; description: string;
  date: string; time: string; location: string;
  type: 'meetup' | 'workshop' | 'conference' | 'social';
  attendees: number; isOnline: boolean;
}

interface ForumTopic {
  id: string; title: string; author: string; category: string;
  replies: number; views: number; lastActivity: string; isPinned?: boolean;
  body?: string;
}

interface Comment {
  id: string; author: string; avatar: string; text: string; time: string;
}

type Reply = Comment;

// ── Static data ───────────────────────────────────────────────────────────────

const INITIAL_POSTS: Post[] = [
  { id: 'p1', user: { name: 'Sarah Martinez', username: '@sarah_signs', avatar: 'SM', isVerified: true }, timestamp: '2 hours ago', content: 'Just completed my first conversation entirely in ASL! The Deaf community at the local cafe was so welcoming and patient. This journey has been incredible! 🤟', type: 'milestone', stats: { likes: 124, comments: 18, shares: 5 }, liked: false },
  { id: 'p2', user: { name: 'Marcus Johnson', username: '@marcusASL', avatar: 'MJ' }, timestamp: '4 hours ago', content: 'Earned my ASL Foundations Certificate! 30 days of consistent practice really pays off. Next stop: Intermediate level! 💪', type: 'achievement', achievement: { title: 'ASL Foundations Certified', description: 'Completed all beginner lessons with 85% score', icon: 'award' }, stats: { likes: 89, comments: 12, shares: 3 }, liked: true },
  { id: 'p3', user: { name: 'Emily Chen', username: '@emilylearns', avatar: 'EC' }, timestamp: '6 hours ago', content: 'Reached 100-day streak! 🔥 The daily practice sessions have become my favorite part of the morning routine. Who else is on a streak?', type: 'achievement', achievement: { title: '100 Day Streak', description: 'Practiced ASL for 100 consecutive days', icon: 'flame' }, stats: { likes: 156, comments: 24, shares: 8 }, liked: true },
  { id: 'p4', user: { name: 'David Park', username: '@davidPsigns', avatar: 'DP', isVerified: true }, timestamp: '8 hours ago', content: "Attending the Deaf Culture Workshop this weekend! Can't wait to learn more about the history and meet native signers. Anyone else going?", type: 'post', stats: { likes: 67, comments: 15, shares: 4 }, liked: false },
  { id: 'p5', user: { name: 'Jessica Williams', username: '@jess_asl', avatar: 'JW' }, timestamp: '12 hours ago', content: 'Challenge accepted! 🎯 Just started the "50 Signs in 7 Days" challenge. Day 1: Learned 8 new signs. This is going to be intense!', type: 'challenge', stats: { likes: 92, comments: 20, shares: 6 }, liked: true },
  { id: 'p6', user: { name: 'Alex Thompson', username: '@alexthompson', avatar: 'AT' }, timestamp: '1 day ago', content: 'My daughter (who is Deaf) smiled when I signed "I love you" perfectly for the first time. This app has changed our family dynamic. Thank you to everyone in this community for the support! ❤️', type: 'milestone', stats: { likes: 342, comments: 45, shares: 18 }, liked: true },
];

const INITIAL_CHALLENGES: Challenge[] = [
  { id: 'c1', title: '50 Signs in 7 Days', description: 'Master 50 new signs in one week. Perfect for building vocabulary quickly!', difficulty: 'hard', participants: 1284, daysLeft: 4, reward: '500 XP + Badge', progress: 32, steps: ['Learn 8 signs today', 'Practice with hand tracking', 'Complete daily quiz', 'Review yesterday\'s signs'] },
  { id: 'c2', title: 'Daily Practice Streak', description: 'Practice ASL every day for 30 consecutive days. Consistency is key!', difficulty: 'medium', participants: 3567, daysLeft: 14, reward: 'Streak Badge', progress: 67, steps: ['Open the app daily', 'Complete 1 lesson or practice session', 'Track your streak in progress', 'Miss no days!'] },
  { id: 'c3', title: 'Fingerspelling Master', description: 'Spell 100 words correctly without mistakes using the ASL alphabet.', difficulty: 'easy', participants: 892, daysLeft: 10, reward: '200 XP', steps: ['Go to Fingerspelling Practice', 'Complete Speed Drill mode', 'Score 100% on 100 words', 'Claim your reward'] },
  { id: 'c4', title: 'Story Mode Champion', description: 'Complete all 6 Story Mode chapters with perfect scores.', difficulty: 'hard', participants: 456, daysLeft: 20, reward: 'Champion Badge + 1000 XP', steps: ['Open Story Mode', 'Complete each chapter in order', 'Achieve 90%+ on every chapter', 'Unlock the Champion badge'] },
];

const leaderboard: LeaderboardEntry[] = [
  { rank: 1, user: { name: 'Taylor Swift', username: '@taylorASL', avatar: 'TS' }, score: 15680, streak: 145, change: 0 },
  { rank: 2, user: { name: 'Jordan Lee', username: '@jordanL', avatar: 'JL' }, score: 14920, streak: 132, change: 1 },
  { rank: 3, user: { name: 'Sam Rivera', username: '@samr', avatar: 'SR' }, score: 14350, streak: 98, change: -1 },
  { rank: 4, user: { name: 'You', username: '@yourname', avatar: 'YO' }, score: 12840, streak: 89, change: 2 },
  { rank: 5, user: { name: 'Morgan Davis', username: '@morgand', avatar: 'MD' }, score: 11970, streak: 76, change: -1 },
  { rank: 6, user: { name: 'Casey Kim', username: '@caseyk', avatar: 'CK' }, score: 10450, streak: 54, change: 0 },
  { rank: 7, user: { name: 'Riley Brown', username: '@rileyb', avatar: 'RB' }, score: 9870, streak: 43, change: 3 },
  { rank: 8, user: { name: 'Avery Smith', username: '@averys', avatar: 'AS' }, score: 8920, streak: 31, change: -2 },
];

const INITIAL_EVENTS: Event[] = [
  { id: 'e1', title: 'ASL Coffee Chat', description: 'Casual meetup for ASL learners and native signers. All skill levels welcome! Bring your vocabulary cards and your enthusiasm.', date: 'Jan 15, 2024', time: '10:00 AM – 12:00 PM', location: 'Starbucks Downtown', type: 'meetup', attendees: 24, isOnline: false },
  { id: 'e2', title: 'Deaf Culture Workshop', description: 'Learn about Deaf history, culture, and etiquette from community leaders. Gain insights you won\'t find in any textbook.', date: 'Jan 18, 2024', time: '6:00 PM – 8:00 PM', location: 'Community Center', type: 'workshop', attendees: 45, isOnline: false },
  { id: 'e3', title: 'Virtual ASL Game Night', description: 'Practice your signing skills while playing games with the community! Zoom link sent after registration.', date: 'Jan 20, 2024', time: '7:00 PM – 9:00 PM', location: 'Zoom', type: 'social', attendees: 67, isOnline: true },
  { id: 'e4', title: 'Deaf Film Festival', description: 'Screening of award-winning films by Deaf filmmakers with ASL interpretation and open captions.', date: 'Jan 25, 2024', time: '2:00 PM – 6:00 PM', location: 'City Theater', type: 'conference', attendees: 156, isOnline: false },
  { id: 'e5', title: 'ASL Poetry Slam', description: 'Experience the beauty of ASL poetry performed by talented signers from across the country.', date: 'Feb 1, 2024', time: '7:30 PM – 9:30 PM', location: 'Arts Center', type: 'social', attendees: 89, isOnline: false },
];

const INITIAL_TOPICS: ForumTopic[] = [
  { id: 'f1', title: 'Tips for remembering similar signs?', author: 'Sarah M.', category: 'Learning Tips', replies: 23, views: 456, lastActivity: '2h ago', body: 'I keep mixing up signs that look similar — like THINK vs KNOW, or SORRY vs THANK YOU. Any mnemonics or tricks you use?' },
  { id: 'f2', title: 'Best resources for learning Deaf history', author: 'Marcus J.', category: 'Deaf Culture', replies: 34, views: 678, lastActivity: '4h ago', isPinned: true, body: 'Looking for books, documentaries, or websites about Deaf history in America and worldwide. The more authentic the better — preferably created by Deaf authors/filmmakers.' },
  { id: 'f3', title: 'How to practice with native signers?', author: 'Emily C.', category: 'Practice', replies: 45, views: 892, lastActivity: '6h ago', isPinned: true, body: 'I feel ready to try conversing with native signers but I\'m nervous. What\'s the etiquette? Where do you find practice partners? Any tips for a hearing learner?' },
  { id: 'f4', title: 'ASL vs SEE: Understanding the differences', author: 'David P.', category: 'Discussion', replies: 56, views: 1234, lastActivity: '8h ago', body: 'Can someone clearly explain the philosophical and practical differences between ASL (American Sign Language) and SEE (Signing Exact English)? When is each used?' },
  { id: 'f5', title: 'Preparing for ASLPI certification', author: 'Jessica W.', category: 'Certifications', replies: 28, views: 567, lastActivity: '1d ago', body: 'I\'m planning to take the ASLPI in 6 months. Has anyone gone through this process? What level did you score, and what prep resources helped most?' },
];

const MOCK_COMMENTS: Comment[] = [
  { id: 'c1', author: 'Riley Chen', avatar: 'RC', text: 'This is so inspiring! Keep up the amazing work 🤟', time: '1h ago' },
  { id: 'c2', author: 'Jordan Lee', avatar: 'JL', text: 'I had a similar experience at my local coffee shop — the Deaf community is truly welcoming!', time: '45m ago' },
  { id: 'c3', author: 'Alex Park', avatar: 'AP', text: 'Love seeing posts like this. How long did it take you to feel confident enough for a full conversation?', time: '20m ago' },
];

const MOCK_REPLIES: Reply[] = [
  { id: 'r1', author: 'Maria S.', avatar: 'MS', text: 'Great question! I use the memory palace technique — associate each sign with a vivid image in a familiar place.', time: '1h ago' },
  { id: 'r2', author: 'Tom K.', avatar: 'TK', text: 'Repetition with spaced intervals works well for me. I use Anki cards with video clips.', time: '30m ago' },
];

type TabType = 'feed' | 'challenges' | 'leaderboard' | 'events' | 'forums';

// ── Component ─────────────────────────────────────────────────────────────────

export function CommunityFeed({ onExit }: CommunityFeedProps) {
  const { theme } = useTheme();
  const { userProgress } = useApp();

  // ── Tab ────────────────────────────────────────────────────────────────────
  const [activeTab, setActiveTab] = useState<TabType>('feed');

  // ── Feed state ─────────────────────────────────────────────────────────────
  const [posts, setPosts]           = useState<Post[]>(INITIAL_POSTS);
  const [postLikes, setPostLikes]   = useState<Record<string, boolean>>({});
  const [showCreatePost, setShowCreatePost] = useState(false);
  const [newPostContent, setNewPostContent] = useState('');
  const [newPostType, setNewPostType]       = useState<Post['type']>('post');
  const [commentsByPost, setCommentsByPost] = useState<Record<string, Comment[]>>({});
  const [selectedPost, setSelectedPost]     = useState<Post | null>(null);
  const [commentInput, setCommentInput]     = useState('');

  // ── Challenges state ───────────────────────────────────────────────────────
  const [challenges, setChallenges]       = useState<Challenge[]>(INITIAL_CHALLENGES);
  const [selectedChallenge, setSelectedChallenge] = useState<Challenge | null>(null);
  const [joinedChallenges, setJoinedChallenges]   = useState<Set<string>>(new Set(['c1', 'c2']));

  // ── Events state ───────────────────────────────────────────────────────────
  const [events, setEvents]               = useState<Event[]>(INITIAL_EVENTS);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [registeredEvents, setRegisteredEvents] = useState<Set<string>>(new Set());
  const [eventRegistering, setEventRegistering] = useState(false);
  const [eventRegistered, setEventRegistered]   = useState(false);

  // ── Forums state ───────────────────────────────────────────────────────────
  const [topics, setTopics]               = useState<ForumTopic[]>(INITIAL_TOPICS);
  const [selectedTopic, setSelectedTopic] = useState<ForumTopic | null>(null);
  const [repliesByTopic, setRepliesByTopic] = useState<Record<string, Reply[]>>({});
  const [replyInput, setReplyInput]       = useState('');
  const [showCreateTopic, setShowCreateTopic] = useState(false);
  const [newTopicTitle, setNewTopicTitle]   = useState('');
  const [newTopicCategory, setNewTopicCategory] = useState('Discussion');
  const [newTopicBody, setNewTopicBody]     = useState('');

  // ── Colors ─────────────────────────────────────────────────────────────────
  const colors = theme === 'dark'
    ? { bg: 'var(--color-bg-deep)', cardBg: 'var(--color-bg-card)', cardHover: '#252541', textPrimary: 'var(--color-text)', textSecondary: 'var(--color-text-muted)', textTertiary: '#64748B', border: 'rgba(148,163,184,0.2)', iconBg: 'rgba(0,245,255,0.1)', iconColor: 'var(--color-cyan)', accentColor: 'var(--color-purple)', successColor: '#22C55E', warningColor: '#FBD500', blur: 'none', shadow: 'none', glassBorder: 'none', errorColor: '#EF4444' }
    : { bg: 'linear-gradient(135deg,#E0F2FE 0%,#EDE9FE 50%,#FCE7F3 100%)', cardBg: 'rgba(255,255,255,0.6)', cardHover: 'rgba(255,255,255,0.8)', textPrimary: '#0F172A', textSecondary: '#334155', textTertiary: '#64748B', border: 'rgba(255,255,255,0.6)', iconBg: 'rgba(14,165,233,0.12)', iconColor: '#0EA5E9', accentColor: '#A855F7', successColor: '#22C55E', warningColor: '#F59E0B', blur: 'blur(20px)', shadow: '0 8px 32px rgba(31,38,135,0.15)', glassBorder: '1px solid rgba(255,255,255,0.6)', errorColor: '#EF4444' };

  const cardStyle = { background: colors.cardBg, backdropFilter: colors.blur, WebkitBackdropFilter: colors.blur, border: colors.glassBorder, boxShadow: colors.shadow };
  const btnPrimary = { background: colors.iconColor, color: theme === 'dark' ? 'var(--color-bg-deep)' : '#fff' };

  const getDifficultyColor = (d: string) =>
    d === 'easy' ? colors.successColor : d === 'medium' ? colors.warningColor : colors.accentColor;

  // ── Feed handlers ──────────────────────────────────────────────────────────
  const handleLike = (postId: string) =>
    setPostLikes(prev => ({ ...prev, [postId]: !prev[postId] }));

  const handleSharePost = (post: Post) => {
    const text = `${post.user.name} on Sign Learn AR: "${post.content.slice(0, 100)}"`;
    if (navigator.share) {
      navigator.share({ title: 'Sign Learn AR Community', text, url: 'https://signlearnar.com' });
    } else {
      navigator.clipboard.writeText(text);
    }
  };

  const handleSubmitPost = () => {
    if (!newPostContent.trim()) return;
    const newPost: Post = {
      id: `p-${Date.now()}`,
      user: { name: 'You', username: '@yourname', avatar: 'YO' },
      timestamp: 'Just now',
      content: newPostContent.trim(),
      type: newPostType,
      stats: { likes: 0, comments: 0, shares: 0 },
      liked: false,
    };
    setPosts(prev => [newPost, ...prev]);
    setNewPostContent('');
    setNewPostType('post');
    setShowCreatePost(false);
  };

  const handleAddComment = (postId: string) => {
    if (!commentInput.trim()) return;
    const comment: Comment = {
      id: `cm-${Date.now()}`,
      author: 'You',
      avatar: 'YO',
      text: commentInput.trim(),
      time: 'Just now',
    };
    setCommentsByPost(prev => ({ ...prev, [postId]: [...(prev[postId] ?? MOCK_COMMENTS), comment] }));
    // Also bump comment count on post
    setPosts(prev => prev.map(p => p.id === postId && p.stats
      ? { ...p, stats: { ...p.stats, comments: p.stats.comments + 1 } } : p));
    setCommentInput('');
  };

  // ── Challenge handlers ─────────────────────────────────────────────────────
  const handleJoinChallenge = (challengeId: string) => {
    setJoinedChallenges(prev => { const s = new Set(prev); s.add(challengeId); return s; });
    setChallenges(prev => prev.map(c => c.id === challengeId && c.progress === undefined
      ? { ...c, progress: 0 } : c));
  };

  // ── Event handlers ─────────────────────────────────────────────────────────
  const handleRegisterEvent = async () => {
    if (!selectedEvent) return;
    setEventRegistering(true);
    await new Promise(r => setTimeout(r, 1200)); // simulate network
    setRegisteredEvents(prev => { const s = new Set(prev); s.add(selectedEvent.id); return s; });
    setEvents(prev => prev.map(e => e.id === selectedEvent.id ? { ...e, attendees: e.attendees + 1 } : e));
    setEventRegistering(false);
    setEventRegistered(true);
  };

  const handleShareEvent = (event: Event) => {
    const text = `Join me at ${event.title} — ${event.date} ${event.isOnline ? 'Online' : 'at ' + event.location}`;
    if (navigator.share) {
      navigator.share({ title: event.title, text, url: 'https://signlearnar.com/events' });
    } else {
      navigator.clipboard.writeText(text);
    }
  };

  // ── Forum handlers ─────────────────────────────────────────────────────────
  const handleAddReply = (topicId: string) => {
    if (!replyInput.trim()) return;
    const reply: Reply = { id: `r-${Date.now()}`, author: 'You', avatar: 'YO', text: replyInput.trim(), time: 'Just now' };
    setRepliesByTopic(prev => ({ ...prev, [topicId]: [...(prev[topicId] ?? MOCK_REPLIES), reply] }));
    setTopics(prev => prev.map(t => t.id === topicId ? { ...t, replies: t.replies + 1 } : t));
    setReplyInput('');
  };

  const handleCreateTopic = () => {
    if (!newTopicTitle.trim() || !newTopicBody.trim()) return;
    const topic: ForumTopic = {
      id: `f-${Date.now()}`,
      title: newTopicTitle.trim(),
      author: 'You',
      category: newTopicCategory,
      replies: 0, views: 1,
      lastActivity: 'Just now',
      body: newTopicBody.trim(),
    };
    setTopics(prev => [topic, ...prev]);
    setNewTopicTitle(''); setNewTopicCategory('Discussion'); setNewTopicBody('');
    setShowCreateTopic(false);
  };

  const tabs: { id: TabType; label: string; icon: React.ElementType }[] = [
    { id: 'feed',        label: 'Feed',       icon: MessageSquare },
    { id: 'challenges',  label: 'Challenges', icon: Target },
    { id: 'leaderboard', label: 'Rankings',   icon: Trophy },
    { id: 'events',      label: 'Events',     icon: Calendar },
    { id: 'forums',      label: 'Forums',     icon: MessageCircle },
  ];

  // ── Forum thread view — full-screen overlay ────────────────────────────────
  if (selectedTopic) {
    const replies = repliesByTopic[selectedTopic.id] ?? MOCK_REPLIES;
    return (
      <div className="h-full flex flex-col" style={{ background: colors.bg, color: colors.textPrimary }}>
        <div className="p-4 border-b flex items-center gap-3 flex-shrink-0" style={{ borderBottomColor: colors.border }}>
          <Button variant="ghost" size="icon" onClick={() => setSelectedTopic(null)} style={{ color: colors.textSecondary }} aria-label="Back to forums">
            <ChevronLeft className="w-6 h-6" />
          </Button>
          <div className="flex-1 min-w-0">
            <h1 className="font-bold text-base truncate">{selectedTopic.title}</h1>
            <p className="text-xs" style={{ color: colors.textTertiary }}>{selectedTopic.category} · by {selectedTopic.author}</p>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {/* Original post */}
          <div className="rounded-xl p-4" style={cardStyle}>
            {selectedTopic.isPinned && (
              <div className="flex items-center gap-1 text-xs mb-2" style={{ color: colors.iconColor }}>
                <Pin className="w-3 h-3" /> Pinned topic
              </div>
            )}
            <p className="text-sm leading-relaxed" style={{ color: colors.textSecondary }}>{selectedTopic.body}</p>
            <div className="mt-3 flex items-center gap-3 text-xs" style={{ color: colors.textTertiary }}>
              <span>{selectedTopic.replies} replies</span>
              <span>·</span>
              <span>{selectedTopic.views} views</span>
              <span>·</span>
              <span>Last: {selectedTopic.lastActivity}</span>
            </div>
          </div>

          {/* Replies */}
          {replies.map((r, i) => (
            <motion.div key={r.id} className="rounded-xl p-4" style={cardStyle}
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0"
                  style={{ background: colors.iconBg, color: colors.iconColor }}>
                  {r.avatar}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-semibold text-sm" style={{ color: colors.textPrimary }}>{r.author}</span>
                    <span className="text-xs" style={{ color: colors.textTertiary }}>{r.time}</span>
                  </div>
                  <p className="text-sm leading-relaxed" style={{ color: colors.textSecondary }}>{r.text}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Reply input */}
        <div className="p-4 border-t flex gap-2 flex-shrink-0" style={{ borderTopColor: colors.border, background: colors.cardBg }}>
          <input
            value={replyInput} onChange={e => setReplyInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), handleAddReply(selectedTopic.id))}
            placeholder="Write a reply…"
            className="flex-1 px-4 py-2.5 rounded-full text-sm outline-none"
            style={{ background: colors.cardHover, color: colors.textPrimary }}
            aria-label="Reply to topic"
          />
          <button
            onClick={() => handleAddReply(selectedTopic.id)}
            disabled={!replyInput.trim()}
            className="w-10 h-10 rounded-full flex items-center justify-center disabled:opacity-40"
            style={btnPrimary}
            aria-label="Send reply"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  }

  // ── Main screen ────────────────────────────────────────────────────────────
  return (
    <div className="h-full flex flex-col" style={{ background: colors.bg, color: colors.textPrimary }}
      role="main" aria-labelledby="community-title">

      {/* Header */}
      <div className="p-4 border-b flex-shrink-0" style={{ borderBottomColor: colors.border }}>
        <div className="flex items-center gap-3 mb-4">
          <Button variant="ghost" size="icon" onClick={onExit} style={{ color: colors.textSecondary }} aria-label="Back">
            <X className="w-6 h-6" />
          </Button>
          <div className="flex-1">
            <h1 id="community-title" className="text-xl font-bold">Community</h1>
            <p className="text-sm" style={{ color: colors.textSecondary }}>Connect with ASL learners worldwide</p>
          </div>
          <Button variant="ghost" size="icon" style={{ color: colors.textSecondary }} aria-label="Notifications">
            <Bell className="w-6 h-6" />
          </Button>
        </div>
        <div className="flex gap-1 overflow-x-auto pb-1" role="tablist">
          {tabs.map(tab => {
            const Icon = tab.icon;
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className="flex items-center gap-1.5 px-3 py-2 rounded-full text-sm font-semibold flex-shrink-0 transition-all"
                style={{ background: active ? colors.iconColor : 'transparent', color: active ? (theme === 'dark' ? 'var(--color-bg-deep)' : '#fff') : colors.textSecondary }}
                role="tab" aria-selected={active}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* ── FEED TAB ─────────────────────────────────────────────────── */}
      {activeTab === 'feed' && (
        <div className="flex-1 overflow-y-auto p-4 space-y-4" role="tabpanel">
          <Button
            onClick={() => setShowCreatePost(true)}
            className="w-full h-12 rounded-full font-semibold"
            style={btnPrimary}
            aria-label="Share your progress"
          >
            <Plus className="w-5 h-5 mr-2" /> Share Your Progress
          </Button>

          {posts.map((post, i) => {
            const isLiked = postLikes[post.id] !== undefined ? postLikes[post.id] : !!post.liked;
            const likeCount = (post.stats?.likes ?? 0) + (isLiked && !post.liked ? 1 : !isLiked && post.liked ? -1 : 0);
            return (
              <motion.article key={post.id} className="rounded-xl overflow-hidden" style={cardStyle}
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}>
                <div className="p-4">
                  {/* Post header */}
                  <div className="flex items-start gap-3 mb-3">
                    <div className="w-10 h-10 rounded-full flex items-center justify-center font-semibold text-sm flex-shrink-0"
                      style={{ background: colors.iconBg, color: colors.iconColor }}>
                      {post.user.avatar}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-1.5">
                        <span className="font-semibold text-sm" style={{ color: colors.textPrimary }}>{post.user.name}</span>
                        {post.user.isVerified && <Award className="w-3.5 h-3.5" style={{ color: colors.iconColor }} />}
                      </div>
                      <p className="text-xs" style={{ color: colors.textTertiary }}>{post.user.username} · {post.timestamp}</p>
                    </div>
                  </div>

                  <p className="text-sm leading-relaxed mb-3" style={{ color: colors.textSecondary }}>{post.content}</p>

                  {/* Achievement badge */}
                  {post.achievement && (
                    <div className="rounded-lg p-3 mb-3 flex items-center gap-3"
                      style={{ background: `${colors.warningColor}20`, border: `1px solid ${colors.warningColor}` }}>
                      <div className="w-11 h-11 rounded-full flex items-center justify-center flex-shrink-0"
                        style={{ background: colors.warningColor }}>
                        {post.achievement.icon === 'award'
                          ? <Award className="w-5 h-5 text-white" />
                          : <Flame className="w-5 h-5 text-white" />}
                      </div>
                      <div>
                        <p className="font-semibold text-sm" style={{ color: colors.textPrimary }}>{post.achievement.title}</p>
                        <p className="text-xs" style={{ color: colors.textSecondary }}>{post.achievement.description}</p>
                      </div>
                    </div>
                  )}

                  {/* Actions */}
                  {post.stats && (
                    <div className="flex items-center gap-4 pt-3 border-t" style={{ borderColor: colors.border }}>
                      <button
                        onClick={() => handleLike(post.id)}
                        className="flex items-center gap-1.5 text-sm transition-colors"
                        style={{ color: isLiked ? '#EF4444' : colors.textTertiary }}
                        aria-label={`${isLiked ? 'Unlike' : 'Like'} post`} aria-pressed={isLiked}
                      >
                        <Heart className={`w-5 h-5 ${isLiked ? 'fill-current' : ''}`} />
                        <span>{likeCount}</span>
                      </button>

                      <button
                        onClick={() => { setSelectedPost(post); setCommentInput(''); }}
                        className="flex items-center gap-1.5 text-sm"
                        style={{ color: colors.textTertiary }}
                        aria-label={`View ${post.stats.comments} comments`}
                      >
                        <MessageCircle className="w-5 h-5" />
                        <span>{post.stats.comments}</span>
                      </button>

                      <button
                        onClick={() => handleSharePost(post)}
                        className="flex items-center gap-1.5 text-sm"
                        style={{ color: colors.textTertiary }}
                        aria-label="Share post"
                      >
                        <Share2 className="w-5 h-5" />
                        <span>{post.stats.shares}</span>
                      </button>
                    </div>
                  )}
                </div>
              </motion.article>
            );
          })}
        </div>
      )}

      {/* ── CHALLENGES TAB ───────────────────────────────────────────── */}
      {activeTab === 'challenges' && (
        <div className="flex-1 overflow-y-auto p-4 space-y-4" role="tabpanel">
          <div>
            <h2 className="text-lg font-semibold">Active Challenges</h2>
            <p className="text-sm" style={{ color: colors.textSecondary }}>Join challenges to earn XP and badges</p>
          </div>
          {challenges.map((ch, i) => {
            const joined = joinedChallenges.has(ch.id);
            return (
              <motion.div key={ch.id} className="rounded-xl p-4" style={cardStyle}
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold" style={{ color: colors.textPrimary }}>{ch.title}</h3>
                      <span className="px-2 py-0.5 rounded-full text-xs font-semibold capitalize"
                        style={{ background: `${getDifficultyColor(ch.difficulty)}20`, color: getDifficultyColor(ch.difficulty) }}>
                        {ch.difficulty}
                      </span>
                    </div>
                    <p className="text-sm mb-2" style={{ color: colors.textSecondary }}>{ch.description}</p>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-2 mb-3 text-xs">
                  {[
                    { label: 'Participants', val: ch.participants.toLocaleString(), icon: Users },
                    { label: 'Days Left',    val: `${ch.daysLeft}d`,               icon: Calendar },
                    { label: 'Reward',       val: ch.reward,                        icon: Trophy },
                  ].map(({ label, val, icon: Icon }) => (
                    <div key={label}>
                      <p style={{ color: colors.textTertiary }}>{label}</p>
                      <div className="flex items-center gap-1 font-semibold mt-0.5" style={{ color: colors.textPrimary }}>
                        <Icon className="w-3 h-3" /> <span className="truncate">{val}</span>
                      </div>
                    </div>
                  ))}
                </div>
                {ch.progress !== undefined && (
                  <div className="mb-3">
                    <div className="flex justify-between text-xs mb-1">
                      <span style={{ color: colors.textTertiary }}>Progress</span>
                      <span style={{ color: colors.iconColor }} className="font-semibold">{ch.progress}%</span>
                    </div>
                    <div className="h-2 rounded-full overflow-hidden" style={{ background: colors.iconBg }}
                      role="progressbar" aria-valuenow={ch.progress} aria-valuemin={0} aria-valuemax={100}>
                      <div className="h-full rounded-full transition-all" style={{ background: colors.iconColor, width: `${ch.progress}%` }} />
                    </div>
                  </div>
                )}
                <Button
                  onClick={() => setSelectedChallenge(ch)}
                  className="w-full h-10 rounded-full font-semibold"
                  style={joined ? { background: colors.cardHover, color: colors.textPrimary, border: colors.glassBorder } : btnPrimary}
                >
                  {joined ? (ch.progress === 100 ? '✓ Completed' : 'Continue') : 'Join Challenge'}
                </Button>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* ── LEADERBOARD TAB ─────────────────────────────────────────── */}
      {activeTab === 'leaderboard' && (
        <div className="flex-1 overflow-y-auto p-4 space-y-3" role="tabpanel">
          <div>
            <h2 className="text-lg font-semibold">Weekly Rankings</h2>
            <p className="text-sm" style={{ color: colors.textSecondary }}>Top learners this week</p>
          </div>
          {leaderboard.map((entry, i) => {
            const isMe = entry.user.name === 'You';
            return (
              <motion.div key={entry.rank} className="rounded-xl p-4 flex items-center gap-3" style={{
                ...cardStyle,
                background: isMe ? `${colors.iconColor}20` : colors.cardBg,
                border: isMe ? `2px solid ${colors.iconColor}` : colors.glassBorder,
              }}
                initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.04 }}>
                <div className="w-10 h-10 rounded-full flex items-center justify-center font-bold flex-shrink-0"
                  style={{ background: entry.rank <= 3 ? colors.warningColor : colors.iconBg, color: entry.rank <= 3 ? '#fff' : colors.iconColor }}>
                  {entry.rank <= 3 ? <Trophy className="w-5 h-5" /> : `#${entry.rank}`}
                </div>
                <div className="w-10 h-10 rounded-full flex items-center justify-center font-semibold text-sm flex-shrink-0"
                  style={{ background: `${colors.accentColor}20`, color: colors.accentColor }}>
                  {entry.user.avatar}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm" style={{ color: colors.textPrimary }}>{entry.user.name}</p>
                  <div className="flex items-center gap-3 text-xs" style={{ color: colors.textTertiary }}>
                    <span className="flex items-center gap-0.5"><Target className="w-3 h-3" />{entry.score.toLocaleString()} XP</span>
                    <span className="flex items-center gap-0.5"><Flame className="w-3 h-3" />{entry.streak}d</span>
                  </div>
                </div>
                {entry.change !== 0 && (
                  <div className="flex items-center gap-0.5 text-xs font-semibold"
                    style={{ color: entry.change > 0 ? colors.successColor : colors.errorColor }}>
                    <TrendingUp className={`w-4 h-4 ${entry.change < 0 ? 'rotate-180' : ''}`} />
                    {Math.abs(entry.change)}
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>
      )}

      {/* ── EVENTS TAB ──────────────────────────────────────────────── */}
      {activeTab === 'events' && (
        <div className="flex-1 overflow-y-auto p-4 space-y-4" role="tabpanel">
          <div>
            <h2 className="text-lg font-semibold">Upcoming Events</h2>
            <p className="text-sm" style={{ color: colors.textSecondary }}>Connect with the Deaf community</p>
          </div>
          {events.map((event, i) => {
            const isRegistered = registeredEvents.has(event.id);
            return (
              <motion.article key={event.id} className="rounded-xl p-4" style={cardStyle}
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
                <div className="flex items-start gap-3 mb-3">
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{ background: colors.iconBg }}>
                    <Calendar className="w-6 h-6" style={{ color: colors.iconColor }} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-0.5">
                      <h3 className="font-semibold" style={{ color: colors.textPrimary }}>{event.title}</h3>
                      {isRegistered && <span className="px-2 py-0.5 rounded-full text-xs font-semibold" style={{ background: `${colors.successColor}20`, color: colors.successColor }}>Registered</span>}
                    </div>
                    <p className="text-sm" style={{ color: colors.textSecondary }}>{event.description}</p>
                  </div>
                </div>
                <div className="space-y-1.5 mb-3 text-sm">
                  {[
                    { icon: Calendar, val: `${event.date} at ${event.time}` },
                    { icon: MapPin,   val: event.location + (event.isOnline ? ' (Online)' : '') },
                    { icon: Users,    val: `${event.attendees} attending` },
                  ].map(({ icon: Icon, val }) => (
                    <div key={val} className="flex items-center gap-2" style={{ color: colors.textSecondary }}>
                      <Icon className="w-4 h-4 flex-shrink-0" style={{ color: colors.iconColor }} />
                      <span>{val}</span>
                    </div>
                  ))}
                </div>
                <div className="flex gap-2">
                  <Button
                    onClick={() => { setSelectedEvent(event); setEventRegistered(false); setEventRegistering(false); }}
                    disabled={isRegistered}
                    className="flex-1 h-10 rounded-full font-semibold disabled:opacity-60"
                    style={isRegistered ? { background: `${colors.successColor}20`, color: colors.successColor } : btnPrimary}
                  >
                    {isRegistered ? <><Check className="w-4 h-4 mr-1.5" />Registered</> : 'Register'}
                  </Button>
                  <Button
                    onClick={() => handleShareEvent(event)}
                    className="h-10 w-10 rounded-full"
                    style={{ background: colors.cardHover, color: colors.textPrimary }}
                    aria-label="Share event"
                  >
                    <Share2 className="w-4 h-4" />
                  </Button>
                </div>
              </motion.article>
            );
          })}
        </div>
      )}

      {/* ── FORUMS TAB ──────────────────────────────────────────────── */}
      {activeTab === 'forums' && (
        <div className="flex-1 overflow-y-auto p-4 space-y-3" role="tabpanel">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold">Discussion Forums</h2>
              <p className="text-sm" style={{ color: colors.textSecondary }}>Ask questions and share knowledge</p>
            </div>
            <Button
              onClick={() => setShowCreateTopic(true)}
              className="h-10 px-4 rounded-full font-semibold flex items-center gap-1.5"
              style={btnPrimary}
              aria-label="Create new topic"
            >
              <Plus className="w-4 h-4" /> New Topic
            </Button>
          </div>
          {topics.map((topic, i) => (
            <motion.button
              key={topic.id}
              onClick={() => setSelectedTopic(topic)}
              className="w-full rounded-xl p-4 text-left"
              style={{ ...cardStyle, border: topic.isPinned ? `2px solid ${colors.iconColor}` : colors.glassBorder }}
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}
              aria-label={`${topic.title}. ${topic.replies} replies`}
            >
              <div className="flex items-start justify-between gap-3 mb-1.5">
                <h3 className="font-semibold text-sm flex-1 text-left" style={{ color: colors.textPrimary }}>{topic.title}</h3>
                {topic.isPinned && <Pin className="w-4 h-4 flex-shrink-0" style={{ color: colors.iconColor }} />}
              </div>
              <div className="flex items-center gap-2 text-xs mb-2" style={{ color: colors.textTertiary }}>
                <span>{topic.author}</span>
                <span>·</span>
                <span className="px-2 py-0.5 rounded-full" style={{ background: colors.iconBg, color: colors.iconColor }}>
                  {topic.category}
                </span>
              </div>
              <div className="flex items-center justify-between text-xs" style={{ color: colors.textTertiary }}>
                <div className="flex items-center gap-3">
                  <span className="flex items-center gap-1"><MessageCircle className="w-3 h-3" />{topic.replies}</span>
                  <span className="flex items-center gap-1"><BookOpen className="w-3 h-3" />{topic.views}</span>
                </div>
                <span>Last: {topic.lastActivity}</span>
              </div>
            </motion.button>
          ))}
        </div>
      )}

      {/* ══════════════════ MODALS ══════════════════════════════════ */}

      {/* Create Post Modal */}
      <AnimatePresence>
        {showCreatePost && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4"
            style={{ background: 'rgba(0,0,0,0.6)' }}
            onClick={() => setShowCreatePost(false)}>
            <motion.div initial={{ y: 60, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 60, opacity: 0 }}
              className="w-full max-w-md rounded-2xl p-5" style={{ background: colors.cardBg }}
              onClick={e => e.stopPropagation()}>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold" style={{ color: colors.textPrimary }}>Share Your Progress</h2>
                <Button variant="ghost" size="icon" onClick={() => setShowCreatePost(false)} aria-label="Close">
                  <X className="w-5 h-5" />
                </Button>
              </div>

              {/* Post type */}
              <div className="flex gap-2 mb-3 flex-wrap">
                {(['post', 'milestone', 'achievement', 'challenge'] as Post['type'][]).map(t => (
                  <button key={t} onClick={() => setNewPostType(t)}
                    className="px-3 py-1.5 rounded-full text-xs font-semibold capitalize transition-all"
                    style={{ background: newPostType === t ? colors.iconColor : colors.cardHover, color: newPostType === t ? (theme === 'dark' ? 'var(--color-bg-deep)' : '#fff') : colors.textSecondary }}>
                    {t}
                  </button>
                ))}
              </div>

              <textarea
                value={newPostContent}
                onChange={e => setNewPostContent(e.target.value)}
                placeholder="What's your ASL progress today? Share a milestone, achievement, or thought…"
                rows={4} maxLength={500}
                className="w-full px-4 py-3 rounded-xl text-sm resize-none outline-none mb-3"
                style={{ background: colors.cardHover, color: colors.textPrimary }}
                autoFocus
              />
              <div className="flex items-center justify-between">
                <span className="text-xs" style={{ color: colors.textTertiary }}>{newPostContent.length}/500</span>
                <Button onClick={handleSubmitPost} disabled={!newPostContent.trim()}
                  className="h-10 px-6 rounded-full font-semibold disabled:opacity-40"
                  style={btnPrimary}>
                  Post
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Comments Modal */}
      <AnimatePresence>
        {selectedPost && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-end justify-center"
            style={{ background: 'rgba(0,0,0,0.6)' }}
            onClick={() => setSelectedPost(null)}>
            <motion.div initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }}
              className="w-full max-w-lg rounded-t-2xl flex flex-col" style={{ background: colors.cardBg, maxHeight: '80vh' }}
              onClick={e => e.stopPropagation()}>
              <div className="flex items-center justify-between p-4 border-b" style={{ borderBottomColor: colors.border }}>
                <h2 className="font-bold" style={{ color: colors.textPrimary }}>Comments</h2>
                <Button variant="ghost" size="icon" onClick={() => setSelectedPost(null)} aria-label="Close comments">
                  <X className="w-5 h-5" />
                </Button>
              </div>

              {/* Original post snippet */}
              <div className="px-4 py-3 border-b" style={{ borderBottomColor: colors.border }}>
                <p className="text-sm line-clamp-2" style={{ color: colors.textSecondary }}>{selectedPost.content}</p>
              </div>

              {/* Comments list */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {(commentsByPost[selectedPost.id] ?? MOCK_COMMENTS).map(c => (
                  <div key={c.id} className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0"
                      style={{ background: colors.iconBg, color: colors.iconColor }}>{c.avatar}</div>
                    <div className="flex-1 rounded-xl px-3 py-2" style={{ background: colors.cardHover }}>
                      <div className="flex items-center gap-2 mb-0.5">
                        <span className="font-semibold text-xs" style={{ color: colors.textPrimary }}>{c.author}</span>
                        <span className="text-xs" style={{ color: colors.textTertiary }}>{c.time}</span>
                      </div>
                      <p className="text-sm" style={{ color: colors.textSecondary }}>{c.text}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Add comment */}
              <div className="p-4 border-t flex gap-2" style={{ borderTopColor: colors.border }}>
                <input value={commentInput} onChange={e => setCommentInput(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), handleAddComment(selectedPost.id))}
                  placeholder="Add a comment…"
                  className="flex-1 px-4 py-2.5 rounded-full text-sm outline-none"
                  style={{ background: colors.cardHover, color: colors.textPrimary }}
                  aria-label="Add comment"
                />
                <button onClick={() => handleAddComment(selectedPost.id)} disabled={!commentInput.trim()}
                  className="w-10 h-10 rounded-full flex items-center justify-center disabled:opacity-40"
                  style={btnPrimary} aria-label="Post comment">
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Challenge Detail Modal */}
      <AnimatePresence>
        {selectedChallenge && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{ background: 'rgba(0,0,0,0.7)' }}
            onClick={() => setSelectedChallenge(null)}>
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
              className="w-full max-w-md rounded-2xl p-5" style={{ background: colors.cardBg }}
              onClick={e => e.stopPropagation()}>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold" style={{ color: colors.textPrimary }}>{selectedChallenge.title}</h2>
                <Button variant="ghost" size="icon" onClick={() => setSelectedChallenge(null)} aria-label="Close">
                  <X className="w-5 h-5" />
                </Button>
              </div>

              <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold capitalize mb-3"
                style={{ background: `${getDifficultyColor(selectedChallenge.difficulty)}20`, color: getDifficultyColor(selectedChallenge.difficulty) }}>
                {selectedChallenge.difficulty}
              </span>

              <p className="text-sm mb-4" style={{ color: colors.textSecondary }}>{selectedChallenge.description}</p>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-3 mb-4 p-3 rounded-xl" style={{ background: colors.cardHover }}>
                {[
                  { label: 'Participants', val: selectedChallenge.participants.toLocaleString() },
                  { label: 'Days Left',    val: `${selectedChallenge.daysLeft} days` },
                  { label: 'Reward',       val: selectedChallenge.reward },
                ].map(({ label, val }) => (
                  <div key={label} className="text-center">
                    <p className="text-xs mb-1" style={{ color: colors.textTertiary }}>{label}</p>
                    <p className="font-semibold text-sm truncate" style={{ color: colors.textPrimary }}>{val}</p>
                  </div>
                ))}
              </div>

              {/* Progress */}
              {selectedChallenge.progress !== undefined && (
                <div className="mb-4">
                  <div className="flex justify-between text-xs mb-1">
                    <span style={{ color: colors.textTertiary }}>Your Progress</span>
                    <span style={{ color: colors.iconColor }} className="font-semibold">{selectedChallenge.progress}%</span>
                  </div>
                  <div className="h-3 rounded-full overflow-hidden" style={{ background: colors.iconBg }}>
                    <div className="h-full rounded-full" style={{ background: colors.iconColor, width: `${selectedChallenge.progress}%` }} />
                  </div>
                </div>
              )}

              {/* Steps */}
              {selectedChallenge.steps && (
                <div className="mb-5">
                  <p className="text-sm font-semibold mb-2" style={{ color: colors.textPrimary }}>How to complete</p>
                  <div className="space-y-2">
                    {selectedChallenge.steps.map((step, idx) => (
                      <div key={idx} className="flex items-start gap-2.5">
                        <div className="w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5"
                          style={{ background: colors.iconBg, color: colors.iconColor }}>{idx + 1}</div>
                        <p className="text-sm" style={{ color: colors.textSecondary }}>{step}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <Button
                onClick={() => { handleJoinChallenge(selectedChallenge.id); setSelectedChallenge(null); }}
                className="w-full h-12 rounded-full font-semibold"
                style={joinedChallenges.has(selectedChallenge.id) ? { background: colors.cardHover, color: colors.textPrimary } : btnPrimary}
              >
                {joinedChallenges.has(selectedChallenge.id) ? 'Continue Challenge' : 'Join Challenge'}
              </Button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Event Registration Modal */}
      <AnimatePresence>
        {selectedEvent && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{ background: 'rgba(0,0,0,0.7)' }}
            onClick={() => { if (!eventRegistering) { setSelectedEvent(null); setEventRegistered(false); } }}>
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
              className="w-full max-w-md rounded-2xl p-5" style={{ background: colors.cardBg }}
              onClick={e => e.stopPropagation()}>

              {eventRegistered ? (
                // Success state
                <div className="text-center py-4">
                  <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
                    style={{ background: `${colors.successColor}20` }}>
                    <CheckCircle className="w-9 h-9" style={{ color: colors.successColor }} />
                  </div>
                  <h2 className="text-xl font-bold mb-2" style={{ color: colors.textPrimary }}>You&apos;re Registered!</h2>
                  <p className="text-sm mb-1" style={{ color: colors.textSecondary }}>{selectedEvent.title}</p>
                  <p className="text-sm mb-5" style={{ color: colors.textTertiary }}>{selectedEvent.date} · {selectedEvent.time}</p>
                  {selectedEvent.isOnline && (
                    <div className="rounded-xl p-3 mb-5 text-sm" style={{ background: colors.iconBg, color: colors.iconColor }}>
                      📧 Zoom link will be emailed before the event
                    </div>
                  )}
                  <Button onClick={() => { setSelectedEvent(null); setEventRegistered(false); }}
                    className="w-full h-11 rounded-full font-semibold" style={btnPrimary}>
                    Done
                  </Button>
                </div>
              ) : (
                // Registration form
                <>
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-bold" style={{ color: colors.textPrimary }}>Register for Event</h2>
                    <Button variant="ghost" size="icon" onClick={() => setSelectedEvent(null)} aria-label="Close">
                      <X className="w-5 h-5" />
                    </Button>
                  </div>
                  <h3 className="font-semibold mb-2" style={{ color: colors.textPrimary }}>{selectedEvent.title}</h3>
                  <p className="text-sm mb-4" style={{ color: colors.textSecondary }}>{selectedEvent.description}</p>
                  <div className="space-y-2 mb-5 text-sm">
                    {[
                      { icon: Calendar, val: `${selectedEvent.date} at ${selectedEvent.time}` },
                      { icon: MapPin,   val: selectedEvent.location },
                      { icon: Users,    val: `${selectedEvent.attendees} already attending` },
                    ].map(({ icon: Icon, val }) => (
                      <div key={val} className="flex items-center gap-2" style={{ color: colors.textSecondary }}>
                        <Icon className="w-4 h-4" style={{ color: colors.iconColor }} />
                        <span>{val}</span>
                      </div>
                    ))}
                  </div>
                  <Button
                    onClick={handleRegisterEvent}
                    disabled={eventRegistering}
                    className="w-full h-12 rounded-full font-semibold disabled:opacity-70 flex items-center justify-center gap-2"
                    style={btnPrimary}
                  >
                    {eventRegistering
                      ? <><Loader2 className="w-4 h-4 animate-spin" /> Registering…</>
                      : 'Confirm Registration'}
                  </Button>
                </>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Create Topic Modal */}
      <AnimatePresence>
        {showCreateTopic && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4"
            style={{ background: 'rgba(0,0,0,0.6)' }}
            onClick={() => setShowCreateTopic(false)}>
            <motion.div initial={{ y: 60, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 60, opacity: 0 }}
              className="w-full max-w-md rounded-2xl p-5" style={{ background: colors.cardBg }}
              onClick={e => e.stopPropagation()}>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold" style={{ color: colors.textPrimary }}>New Topic</h2>
                <Button variant="ghost" size="icon" onClick={() => setShowCreateTopic(false)} aria-label="Close">
                  <X className="w-5 h-5" />
                </Button>
              </div>

              {/* Category */}
              <div className="mb-3">
                <label className="block text-sm font-semibold mb-1.5" style={{ color: colors.textPrimary }}>Category</label>
                <div className="flex gap-2 flex-wrap">
                  {['Learning Tips', 'Deaf Culture', 'Practice', 'Discussion', 'Certifications', 'General'].map(cat => (
                    <button key={cat} onClick={() => setNewTopicCategory(cat)}
                      className="px-3 py-1.5 rounded-full text-xs font-semibold transition-all"
                      style={{ background: newTopicCategory === cat ? colors.iconColor : colors.cardHover, color: newTopicCategory === cat ? (theme === 'dark' ? 'var(--color-bg-deep)' : '#fff') : colors.textSecondary }}>
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              <div className="mb-3">
                <label htmlFor="topic-title" className="block text-sm font-semibold mb-1.5" style={{ color: colors.textPrimary }}>Title</label>
                <input id="topic-title" value={newTopicTitle} onChange={e => setNewTopicTitle(e.target.value)}
                  placeholder="What's your question or topic?"
                  className="w-full px-4 py-3 rounded-xl text-sm outline-none"
                  style={{ background: colors.cardHover, color: colors.textPrimary }}
                />
              </div>

              <div className="mb-4">
                <label htmlFor="topic-body" className="block text-sm font-semibold mb-1.5" style={{ color: colors.textPrimary }}>Details</label>
                <textarea id="topic-body" value={newTopicBody} onChange={e => setNewTopicBody(e.target.value)}
                  placeholder="Provide more context, details, or your full question…"
                  rows={4} maxLength={1000}
                  className="w-full px-4 py-3 rounded-xl text-sm resize-none outline-none"
                  style={{ background: colors.cardHover, color: colors.textPrimary }}
                />
                <p className="text-xs mt-1 text-right" style={{ color: colors.textTertiary }}>{newTopicBody.length}/1000</p>
              </div>

              <Button onClick={handleCreateTopic}
                disabled={!newTopicTitle.trim() || !newTopicBody.trim()}
                className="w-full h-11 rounded-full font-semibold disabled:opacity-40"
                style={btnPrimary}>
                Post Topic
              </Button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
