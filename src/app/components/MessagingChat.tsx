import { useState } from 'react';
import { Button } from './ui/button';
import { useTheme } from '../context/ThemeContext';
import { useApp } from '../context/AppContext';
import { motion, AnimatePresence } from 'motion/react';
import { X, Search, MessageCircle, Video, Send, Plus, Users, ChevronLeft, MoreVertical, Phone, Image as ImageIcon, Smile, Paperclip, BookOpen, Target, Crown, Star } from 'lucide-react';

interface MessagingChatProps {
  onExit: () => void;
}

interface Message {
  id: string;
  senderId: string;
  senderName: string;
  senderAvatar: string;
  content: string;
  timestamp: string;
  isOwn?: boolean;
  type: 'text' | 'vocabulary' | 'lesson' | 'image';
  sharedContent?: {
    title: string;
    description?: string;
    category?: string;
  };
}

interface Conversation {
  id: string;
  name: string;
  avatar: string;
  lastMessage: string;
  timestamp: string;
  unreadCount: number;
  isOnline: boolean;
  isGroup?: boolean;
  members?: number;
  messages: Message[];
}

// Real conversation data
const conversations: Conversation[] = [
  {
    id: 'c1',
    name: 'Emily Rodriguez',
    avatar: 'ER',
    lastMessage: 'The fingerspelling practice was great today!',
    timestamp: '2 min ago',
    unreadCount: 2,
    isOnline: true,
    messages: [
      {
        id: 'm1',
        senderId: 'emily',
        senderName: 'Emily Rodriguez',
        senderAvatar: 'ER',
        content: 'Hey! Want to practice the new signs we learned today?',
        timestamp: '10:30 AM',
      },
      {
        id: 'm2',
        senderId: 'me',
        senderName: 'You',
        senderAvatar: 'YO',
        content: 'Sure! I was just reviewing the emotion signs.',
        timestamp: '10:32 AM',
        isOwn: true,
      },
      {
        id: 'm3',
        senderId: 'emily',
        senderName: 'Emily Rodriguez',
        senderAvatar: 'ER',
        content: 'Perfect! Let me share that lesson with you',
        timestamp: '10:33 AM',
      },
      {
        id: 'm4',
        senderId: 'emily',
        senderName: 'Emily Rodriguez',
        senderAvatar: 'ER',
        content: '',
        timestamp: '10:33 AM',
        type: 'lesson',
        sharedContent: {
          title: 'Emotions',
          description: 'Express how you feel in sign language',
          category: 'Beginner • 15 min',
        },
      },
      {
        id: 'm5',
        senderId: 'me',
        senderName: 'You',
        senderAvatar: 'YO',
        content: 'Thanks! Want to do a quick video practice session?',
        timestamp: '10:35 AM',
        isOwn: true,
      },
      {
        id: 'm6',
        senderId: 'emily',
        senderName: 'Emily Rodriguez',
        senderAvatar: 'ER',
        content: 'The fingerspelling practice was great today!',
        timestamp: '10:38 AM',
      },
    ],
  },
  {
    id: 'c2',
    name: 'ASL Study Group',
    avatar: 'SG',
    lastMessage: 'Marcus: Anyone free for practice tomorrow?',
    timestamp: '15 min ago',
    unreadCount: 5,
    isOnline: false,
    isGroup: true,
    members: 6,
    messages: [
      {
        id: 'm1',
        senderId: 'sarah',
        senderName: 'Sarah Williams',
        senderAvatar: 'SW',
        content: 'Good morning everyone! Ready for today\'s practice?',
        timestamp: '9:00 AM',
      },
      {
        id: 'm2',
        senderId: 'marcus',
        senderName: 'Marcus Chen',
        senderAvatar: 'MC',
        content: 'I\'m in! Let me share today\'s vocabulary list',
        timestamp: '9:02 AM',
      },
      {
        id: 'm3',
        senderId: 'marcus',
        senderName: 'Marcus Chen',
        senderAvatar: 'MC',
        content: '',
        timestamp: '9:02 AM',
        type: 'vocabulary',
        sharedContent: {
          title: 'Family',
          description: 'Signs for family members and relationships',
        },
      },
      {
        id: 'm4',
        senderId: 'david',
        senderName: 'David Park',
        senderAvatar: 'DP',
        content: 'Perfect timing! I was just reviewing these yesterday.',
        timestamp: '9:05 AM',
      },
      {
        id: 'm5',
        senderId: 'me',
        senderName: 'You',
        senderAvatar: 'YO',
        content: 'Great! Should we schedule a group video chat?',
        timestamp: '9:10 AM',
        isOwn: true,
      },
      {
        id: 'm6',
        senderId: 'marcus',
        senderName: 'Marcus Chen',
        senderAvatar: 'MC',
        content: 'Anyone free for practice tomorrow?',
        timestamp: '9:15 AM',
      },
    ],
  },
  {
    id: 'c3',
    name: 'Marcus Chen',
    avatar: 'MC',
    lastMessage: 'See you at the live class tonight!',
    timestamp: '1 hour ago',
    unreadCount: 0,
    isOnline: true,
    messages: [
      {
        id: 'm1',
        senderId: 'marcus',
        senderName: 'Marcus Chen',
        senderAvatar: 'MC',
        content: 'Hey! Did you check out the new grammar lessons?',
        timestamp: 'Yesterday',
      },
      {
        id: 'm2',
        senderId: 'me',
        senderName: 'You',
        senderAvatar: 'YO',
        content: 'Not yet, are they good?',
        timestamp: 'Yesterday',
        isOwn: true,
      },
      {
        id: 'm3',
        senderId: 'marcus',
        senderName: 'Marcus Chen',
        senderAvatar: 'MC',
        content: 'Really helpful! Here, check this out',
        timestamp: 'Yesterday',
      },
      {
        id: 'm4',
        senderId: 'marcus',
        senderName: 'Marcus Chen',
        senderAvatar: 'MC',
        content: '',
        timestamp: 'Yesterday',
        type: 'vocabulary',
        sharedContent: {
          title: 'Thank You',
          description: 'Touch your fingers to your chin and move forward',
        },
      },
      {
        id: 'm5',
        senderId: 'marcus',
        senderName: 'Marcus Chen',
        senderAvatar: 'MC',
        content: 'See you at the live class tonight!',
        timestamp: '1 hour ago',
      },
    ],
  },
  {
    id: 'c4',
    name: 'Sarah Williams',
    avatar: 'SW',
    lastMessage: 'You: Thanks for the practice tips!',
    timestamp: '3 hours ago',
    unreadCount: 0,
    isOnline: false,
    messages: [
      {
        id: 'm1',
        senderId: 'sarah',
        senderName: 'Sarah Williams',
        senderAvatar: 'SW',
        content: 'Hi! I noticed you\'re working on the same lessons as me',
        timestamp: 'Yesterday',
      },
      {
        id: 'm2',
        senderId: 'me',
        senderName: 'You',
        senderAvatar: 'YO',
        content: 'Yes! How are you finding them?',
        timestamp: 'Yesterday',
        isOwn: true,
      },
      {
        id: 'm3',
        senderId: 'sarah',
        senderName: 'Sarah Williams',
        senderAvatar: 'SW',
        content: 'Challenging but fun! Want to be practice partners?',
        timestamp: 'Yesterday',
      },
      {
        id: 'm4',
        senderId: 'me',
        senderName: 'You',
        senderAvatar: 'YO',
        content: 'Absolutely! That would be great.',
        timestamp: 'Today',
        isOwn: true,
      },
      {
        id: 'm5',
        senderId: 'me',
        senderName: 'You',
        senderAvatar: 'YO',
        content: 'Thanks for the practice tips!',
        timestamp: '3 hours ago',
        isOwn: true,
      },
    ],
  },
  {
    id: 'c5',
    name: 'Beginner Practice Room',
    avatar: 'BP',
    lastMessage: 'Jessica: Let\'s meet for video practice at 6pm',
    timestamp: '5 hours ago',
    unreadCount: 3,
    isOnline: false,
    isGroup: true,
    members: 8,
    messages: [
      {
        id: 'm1',
        senderId: 'jessica',
        senderName: 'Jessica Taylor',
        senderAvatar: 'JT',
        content: 'Welcome everyone! This is a safe space for beginners',
        timestamp: '2 days ago',
      },
      {
        id: 'm2',
        senderId: 'alex',
        senderName: 'Alex Thompson',
        senderAvatar: 'AT',
        content: 'Thanks for creating this group!',
        timestamp: '2 days ago',
      },
      {
        id: 'm3',
        senderId: 'me',
        senderName: 'You',
        senderAvatar: 'YO',
        content: 'Happy to be here! Looking forward to practicing together',
        timestamp: '2 days ago',
        isOwn: true,
      },
      {
        id: 'm4',
        senderId: 'jessica',
        senderName: 'Jessica Taylor',
        senderAvatar: 'JT',
        content: 'Let\'s meet for video practice at 6pm',
        timestamp: '5 hours ago',
      },
    ],
  },
  {
    id: 'c6',
    name: 'David Park',
    avatar: 'DP',
    lastMessage: 'That certification was tough!',
    timestamp: 'Yesterday',
    unreadCount: 0,
    isOnline: true,
    messages: [
      {
        id: 'm1',
        senderId: 'david',
        senderName: 'David Park',
        senderAvatar: 'DP',
        content: 'Hey! Are you taking the ASL certification exam?',
        timestamp: '2 days ago',
      },
      {
        id: 'm2',
        senderId: 'me',
        senderName: 'You',
        senderAvatar: 'YO',
        content: 'Yes! I\'m planning to take it next month',
        timestamp: '2 days ago',
        isOwn: true,
      },
      {
        id: 'm3',
        senderId: 'david',
        senderName: 'David Park',
        senderAvatar: 'DP',
        content: 'That certification was tough!',
        timestamp: 'Yesterday',
      },
    ],
  },
];

export function MessagingChat({ onExit }: MessagingChatProps) {
  const { theme } = useTheme();
  const { userProgress } = useApp();
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [messageInput, setMessageInput] = useState('');
  const [showVideoChat, setShowVideoChat] = useState(false);

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
        messageBg: '#252541',
        ownMessageBg: '#00F5FF',
        ownMessageText: '#0F0F23',
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
        messageBg: 'rgba(255, 255, 255, 0.8)',
        ownMessageBg: '#0EA5E9',
        ownMessageText: '#FFFFFF',
        blur: 'blur(20px)',
        shadow: '0 8px 32px rgba(31, 38, 135, 0.15)',
        glassBorder: '1px solid rgba(255, 255, 255, 0.6)',
      };

  const filteredConversations = conversations.filter(conv =>
    conv.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    conv.lastMessage.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalUnread = conversations.reduce((sum, conv) => sum + conv.unreadCount, 0);

  const handleSendMessage = () => {
    if (messageInput.trim() && selectedConversation) {
      // In a real app, this would send the message
      setMessageInput('');
    }
  };

  const handleShareVocabulary = () => {
    alert('Vocabulary sharing feature - select a sign to share with your practice partner!');
  };

  const handleShareLesson = () => {
    alert('Lesson sharing feature - select a lesson to share!');
  };

  const handleStartVideoChat = () => {
    setShowVideoChat(true);
  };

  return (
    <div 
      className="h-full flex flex-col"
      style={{ background: colors.bg, color: colors.textPrimary }}
      role="main"
      aria-labelledby="messaging-title"
    >
      {/* Conversation List View */}
      {!selectedConversation && (
        <>
          {/* Header */}
          <div 
            className="p-4 sm:p-6 border-b"
            style={{ borderBottomColor: colors.border }}
          >
            <div className="flex items-center gap-3 mb-4">
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
                  id="messaging-title" 
                  className="text-xl sm:text-2xl font-bold"
                  style={{ fontFamily: 'Poppins, sans-serif' }}
                >
                  Messages
                </h1>
                <p className="text-sm" style={{ color: colors.textSecondary }}>
                  {totalUnread > 0 ? `${totalUnread} unread message${totalUnread > 1 ? 's' : ''}` : 'All caught up!'}
                </p>
              </div>
              <Button
                variant="ghost"
                size="icon"
                style={{ color: colors.iconColor }}
                aria-label="New conversation"
              >
                <Plus className="w-6 h-6" />
              </Button>
            </div>

            {/* Search Bar */}
            <div className="relative">
              <Search 
                className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5" 
                style={{ color: colors.textTertiary }} 
                aria-hidden="true"
              />
              <input
                type="text"
                placeholder="Search conversations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full h-12 pl-10 pr-4 rounded-full text-sm"
                style={{
                  background: colors.cardBg,
                  border: colors.glassBorder,
                  color: colors.textPrimary,
                  outline: 'none',
                }}
                aria-label="Search conversations"
              />
            </div>
          </div>

          {/* Conversations List */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6">
            <div className="space-y-2">
              {filteredConversations.map((conversation, index) => (
                <motion.button
                  key={conversation.id}
                  onClick={() => setSelectedConversation(conversation)}
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
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  aria-label={`Conversation with ${conversation.name}, ${conversation.unreadCount > 0 ? `${conversation.unreadCount} unread messages` : 'no unread messages'}`}
                >
                  <div className="flex items-start gap-3">
                    {/* Avatar */}
                    <div className="relative flex-shrink-0">
                      <div 
                        className="w-12 h-12 rounded-full flex items-center justify-center font-semibold"
                        style={{ 
                          background: conversation.isGroup ? colors.accentBg : colors.iconBg,
                          color: conversation.isGroup ? colors.accentColor : colors.iconColor,
                        }}
                        aria-hidden="true"
                      >
                        {conversation.isGroup ? <Users className="w-6 h-6" /> : conversation.avatar}
                      </div>
                      {conversation.isOnline && !conversation.isGroup && (
                        <div 
                          className="absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full border-2"
                          style={{ 
                            background: colors.successColor,
                            borderColor: colors.cardBg,
                          }}
                          aria-label="Online"
                        />
                      )}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2 mb-1">
                        <h3 className="font-semibold text-base truncate" style={{ color: colors.textPrimary }}>
                          {conversation.name}
                        </h3>
                        <span className="text-xs flex-shrink-0" style={{ color: colors.textTertiary }}>
                          {conversation.timestamp}
                        </span>
                      </div>

                      <div className="flex items-center justify-between gap-2">
                        <p 
                          className="text-sm truncate"
                          style={{ 
                            color: conversation.unreadCount > 0 ? colors.textPrimary : colors.textSecondary,
                            fontWeight: conversation.unreadCount > 0 ? 600 : 400,
                          }}
                        >
                          {conversation.lastMessage}
                        </p>
                        {conversation.unreadCount > 0 && (
                          <span 
                            className="px-2 py-0.5 rounded-full text-xs font-bold flex-shrink-0"
                            style={{ background: colors.iconColor, color: theme === 'dark' ? '#0F0F23' : '#FFFFFF' }}
                            aria-label={`${conversation.unreadCount} unread`}
                          >
                            {conversation.unreadCount}
                          </span>
                        )}
                      </div>

                      {conversation.isGroup && conversation.members && (
                        <p className="text-xs mt-1" style={{ color: colors.textTertiary }}>
                          {conversation.members} members
                        </p>
                      )}
                    </div>
                  </div>
                </motion.button>
              ))}
            </div>
          </div>
        </>
      )}

      {/* Chat View */}
      {selectedConversation && !showVideoChat && (
        <div className="flex flex-col h-full">
          {/* Chat Header */}
          <div 
            className="p-4 border-b flex items-center gap-3"
            style={{ 
              borderBottomColor: colors.border,
              background: colors.cardBg,
              backdropFilter: colors.blur,
              WebkitBackdropFilter: colors.blur,
            }}
          >
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSelectedConversation(null)}
              style={{ color: colors.textSecondary }}
              aria-label="Back to conversations"
            >
              <ChevronLeft className="w-6 h-6" />
            </Button>

            <div className="relative flex-shrink-0">
              <div 
                className="w-10 h-10 rounded-full flex items-center justify-center font-semibold"
                style={{ 
                  background: selectedConversation.isGroup ? colors.accentBg : colors.iconBg,
                  color: selectedConversation.isGroup ? colors.accentColor : colors.iconColor,
                }}
                aria-hidden="true"
              >
                {selectedConversation.isGroup ? <Users className="w-5 h-5" /> : selectedConversation.avatar}
              </div>
              {selectedConversation.isOnline && !selectedConversation.isGroup && (
                <div 
                  className="absolute bottom-0 right-0 w-3 h-3 rounded-full border-2"
                  style={{ 
                    background: colors.successColor,
                    borderColor: colors.cardBg,
                  }}
                  aria-label="Online"
                />
              )}
            </div>

            <div className="flex-1 min-w-0">
              <h2 className="font-semibold truncate" style={{ color: colors.textPrimary }}>
                {selectedConversation.name}
              </h2>
              {selectedConversation.isGroup ? (
                <p className="text-xs" style={{ color: colors.textTertiary }}>
                  {selectedConversation.members} members
                </p>
              ) : (
                <p className="text-xs" style={{ color: selectedConversation.isOnline ? colors.successColor : colors.textTertiary }}>
                  {selectedConversation.isOnline ? 'Online' : 'Offline'}
                </p>
              )}
            </div>

            <Button
              variant="ghost"
              size="icon"
              onClick={handleStartVideoChat}
              style={{ color: colors.iconColor }}
              aria-label="Start video chat"
            >
              <Video className="w-5 h-5" />
            </Button>

            <Button
              variant="ghost"
              size="icon"
              style={{ color: colors.textSecondary }}
              aria-label="More options"
            >
              <MoreVertical className="w-5 h-5" />
            </Button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4" style={{ background: colors.bg }}>
            <div className="space-y-4">
              {selectedConversation.messages.map((message, index) => (
                <motion.div
                  key={message.id}
                  className={`flex ${message.isOwn ? 'justify-end' : 'justify-start'}`}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <div className={`flex gap-2 max-w-[80%] ${message.isOwn ? 'flex-row-reverse' : 'flex-row'}`}>
                    {/* Avatar */}
                    {!message.isOwn && (
                      <div 
                        className="w-8 h-8 rounded-full flex items-center justify-center font-semibold text-xs flex-shrink-0"
                        style={{ background: colors.iconBg, color: colors.iconColor }}
                        aria-hidden="true"
                      >
                        {message.senderAvatar}
                      </div>
                    )}

                    {/* Message Content */}
                    <div className={`flex flex-col ${message.isOwn ? 'items-end' : 'items-start'}`}>
                      {!message.isOwn && selectedConversation.isGroup && (
                        <span className="text-xs font-semibold mb-1 px-2" style={{ color: colors.textTertiary }}>
                          {message.senderName}
                        </span>
                      )}

                      {/* Shared Content */}
                      {message.type === 'vocabulary' || message.type === 'lesson' ? (
                        <div 
                          className="rounded-xl p-3 max-w-xs"
                          style={{
                            background: message.isOwn ? colors.ownMessageBg : colors.messageBg,
                            backdropFilter: colors.blur,
                            WebkitBackdropFilter: colors.blur,
                            border: colors.glassBorder,
                          }}
                        >
                          <div className="flex items-start gap-2 mb-2">
                            <div 
                              className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                              style={{ 
                                background: message.isOwn 
                                  ? 'rgba(255, 255, 255, 0.2)' 
                                  : colors.iconBg,
                              }}
                              aria-hidden="true"
                            >
                              {message.type === 'vocabulary' ? (
                                <Target className="w-5 h-5" style={{ color: message.isOwn ? colors.ownMessageText : colors.iconColor }} />
                              ) : (
                                <BookOpen className="w-5 h-5" style={{ color: message.isOwn ? colors.ownMessageText : colors.iconColor }} />
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div 
                                className="text-xs font-semibold mb-1"
                                style={{ color: message.isOwn ? colors.ownMessageText : colors.textTertiary }}
                              >
                                {message.type === 'vocabulary' ? 'Shared Vocabulary' : 'Shared Lesson'}
                              </div>
                              <div 
                                className="font-semibold text-sm mb-1"
                                style={{ color: message.isOwn ? colors.ownMessageText : colors.textPrimary }}
                              >
                                {message.sharedContent?.title}
                              </div>
                              {message.sharedContent?.description && (
                                <div 
                                  className="text-xs"
                                  style={{ color: message.isOwn ? colors.ownMessageText : colors.textSecondary }}
                                >
                                  {message.sharedContent.description}
                                </div>
                              )}
                              {message.sharedContent?.category && (
                                <div 
                                  className="text-xs mt-1"
                                  style={{ color: message.isOwn ? colors.ownMessageText : colors.textTertiary }}
                                >
                                  {message.sharedContent.category}
                                </div>
                              )}
                            </div>
                          </div>
                          <Button
                            className="w-full h-8 rounded-lg text-xs font-semibold"
                            style={{
                              background: message.isOwn 
                                ? 'rgba(255, 255, 255, 0.2)' 
                                : colors.iconColor,
                              color: message.isOwn 
                                ? colors.ownMessageText 
                                : (theme === 'dark' ? '#0F0F23' : '#FFFFFF'),
                            }}
                            aria-label={`View ${message.type}`}
                          >
                            View {message.type === 'vocabulary' ? 'Sign' : 'Lesson'}
                          </Button>
                        </div>
                      ) : (
                        /* Text Message */
                        <div 
                          className="rounded-2xl px-4 py-2"
                          style={{
                            background: message.isOwn ? colors.ownMessageBg : colors.messageBg,
                            color: message.isOwn ? colors.ownMessageText : colors.textPrimary,
                            backdropFilter: colors.blur,
                            WebkitBackdropFilter: colors.blur,
                          }}
                        >
                          <p className="text-sm leading-relaxed">{message.content}</p>
                        </div>
                      )}

                      <span 
                        className="text-xs mt-1 px-2"
                        style={{ color: colors.textTertiary }}
                      >
                        {message.timestamp}
                      </span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Message Input */}
          <div 
            className="p-4 border-t"
            style={{ 
              borderTopColor: colors.border,
              background: colors.cardBg,
              backdropFilter: colors.blur,
              WebkitBackdropFilter: colors.blur,
            }}
          >
            {/* Quick Actions */}
            <div className="flex gap-2 mb-3 overflow-x-auto pb-2">
              <Button
                onClick={handleShareVocabulary}
                className="h-8 px-3 rounded-full text-xs font-semibold whitespace-nowrap flex-shrink-0"
                style={{
                  background: colors.iconBg,
                  color: colors.iconColor,
                }}
                aria-label="Share vocabulary"
              >
                <Target className="w-3 h-3 mr-1" aria-hidden="true" />
                Share Sign
              </Button>
              <Button
                onClick={handleShareLesson}
                className="h-8 px-3 rounded-full text-xs font-semibold whitespace-nowrap flex-shrink-0"
                style={{
                  background: colors.accentBg,
                  color: colors.accentColor,
                }}
                aria-label="Share lesson"
              >
                <BookOpen className="w-3 h-3 mr-1" aria-hidden="true" />
                Share Lesson
              </Button>
            </div>

            {/* Input Area */}
            <div className="flex items-end gap-2">
              <Button
                variant="ghost"
                size="icon"
                className="flex-shrink-0"
                style={{ color: colors.textSecondary }}
                aria-label="Attach image"
              >
                <ImageIcon className="w-5 h-5" />
              </Button>

              <div 
                className="flex-1 rounded-2xl px-4 py-2 flex items-center gap-2"
                style={{
                  background: colors.messageBg,
                  border: colors.glassBorder,
                }}
              >
                <input
                  type="text"
                  placeholder="Type a message..."
                  value={messageInput}
                  onChange={(e) => setMessageInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  className="flex-1 bg-transparent text-sm"
                  style={{
                    color: colors.textPrimary,
                    outline: 'none',
                  }}
                  aria-label="Message input"
                />
                <Button
                  variant="ghost"
                  size="icon"
                  className="flex-shrink-0 h-8 w-8"
                  style={{ color: colors.textSecondary }}
                  aria-label="Add emoji"
                >
                  <Smile className="w-4 h-4" />
                </Button>
              </div>

              <Button
                onClick={handleSendMessage}
                size="icon"
                className="flex-shrink-0"
                style={{
                  background: messageInput.trim() ? colors.iconColor : colors.cardBg,
                  color: messageInput.trim() 
                    ? (theme === 'dark' ? '#0F0F23' : '#FFFFFF')
                    : colors.textTertiary,
                }}
                disabled={!messageInput.trim()}
                aria-label="Send message"
              >
                <Send className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Video Chat View */}
      {showVideoChat && selectedConversation && (
        <div className="flex flex-col h-full" style={{ background: '#000000' }}>
          {/* Video Chat Header */}
          <div 
            className="p-4 flex items-center justify-between"
            style={{ background: 'rgba(0, 0, 0, 0.8)' }}
          >
            <div className="flex items-center gap-3">
              <div 
                className="w-10 h-10 rounded-full flex items-center justify-center font-semibold"
                style={{ background: colors.iconBg, color: colors.iconColor }}
                aria-hidden="true"
              >
                {selectedConversation.avatar}
              </div>
              <div>
                <h2 className="font-semibold text-white">
                  {selectedConversation.name}
                </h2>
                <p className="text-xs text-gray-400">
                  Video Chat • 00:45
                </p>
              </div>
            </div>

            <Button
              variant="ghost"
              size="icon"
              onClick={() => setShowVideoChat(false)}
              style={{ color: '#FFFFFF' }}
              aria-label="End video chat"
            >
              <X className="w-6 h-6" />
            </Button>
          </div>

          {/* Video Area */}
          <div className="flex-1 relative flex items-center justify-center">
            {/* Main Video (Partner) */}
            <div 
              className="w-full h-full flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg, #1E1E3F 0%, #252541 100%)' }}
            >
              <div className="text-center">
                <div 
                  className="w-24 h-24 rounded-full flex items-center justify-center font-bold text-3xl mx-auto mb-4"
                  style={{ background: colors.iconBg, color: colors.iconColor }}
                  aria-hidden="true"
                >
                  {selectedConversation.avatar}
                </div>
                <p className="text-white font-semibold mb-2">{selectedConversation.name}</p>
                <p className="text-gray-400 text-sm">Waiting to connect...</p>
              </div>
            </div>

            {/* Self Video (Picture-in-Picture) */}
            <div 
              className="absolute top-4 right-4 w-32 h-24 rounded-xl overflow-hidden"
              style={{
                background: 'linear-gradient(135deg, #00F5FF 0%, #A855F7 100%)',
                border: '2px solid rgba(255, 255, 255, 0.2)',
              }}
            >
              <div className="w-full h-full flex items-center justify-center">
                <div 
                  className="w-12 h-12 rounded-full flex items-center justify-center font-semibold"
                  style={{ background: 'rgba(255, 255, 255, 0.2)', color: '#FFFFFF' }}
                  aria-hidden="true"
                >
                  YO
                </div>
              </div>
            </div>

            {/* Sign Language Helper Overlay */}
            <div 
              className="absolute bottom-20 left-4 right-4 rounded-xl p-3"
              style={{
                background: 'rgba(0, 0, 0, 0.8)',
                backdropFilter: 'blur(10px)',
              }}
            >
              <div className="flex items-center gap-2 mb-2">
                <Star className="w-4 h-4 text-yellow-400" aria-hidden="true" />
                <span className="text-white text-xs font-semibold">Sign Language Tip</span>
              </div>
              <p className="text-gray-300 text-xs">
                Keep your hands in frame and sign at a comfortable pace. Good lighting helps visibility!
              </p>
            </div>
          </div>

          {/* Video Controls */}
          <div 
            className="p-6"
            style={{ background: 'rgba(0, 0, 0, 0.9)' }}
          >
            <div className="flex items-center justify-center gap-4">
              <Button
                variant="ghost"
                size="icon"
                className="w-14 h-14 rounded-full"
                style={{
                  background: 'rgba(255, 255, 255, 0.1)',
                  color: '#FFFFFF',
                }}
                aria-label="Toggle microphone"
              >
                <Phone className="w-6 h-6" />
              </Button>

              <Button
                variant="ghost"
                size="icon"
                className="w-14 h-14 rounded-full"
                style={{
                  background: 'rgba(255, 255, 255, 0.1)',
                  color: '#FFFFFF',
                }}
                aria-label="Toggle video"
              >
                <Video className="w-6 h-6" />
              </Button>

              <Button
                onClick={() => setShowVideoChat(false)}
                size="icon"
                className="w-16 h-16 rounded-full"
                style={{
                  background: colors.errorColor,
                  color: '#FFFFFF',
                }}
                aria-label="End call"
              >
                <X className="w-7 h-7" />
              </Button>

              <Button
                variant="ghost"
                size="icon"
                className="w-14 h-14 rounded-full"
                style={{
                  background: 'rgba(255, 255, 255, 0.1)',
                  color: '#FFFFFF',
                }}
                aria-label="Share screen"
              >
                <MessageCircle className="w-6 h-6" />
              </Button>

              <Button
                variant="ghost"
                size="icon"
                className="w-14 h-14 rounded-full"
                style={{
                  background: 'rgba(255, 255, 255, 0.1)',
                  color: '#FFFFFF',
                }}
                aria-label="More options"
              >
                <MoreVertical className="w-6 h-6" />
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
