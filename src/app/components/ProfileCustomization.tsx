import { useState } from 'react';
import { Button } from './ui/button';
import { useTheme } from '../context/ThemeContext';
import { useApp } from '../context/AppContext';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, 
  User, 
  Mail, 
  Phone, 
  AtSign,
  Camera,
  Edit3,
  Check,
  Globe,
  Lock,
  Eye,
  EyeOff,
  Share2,
  Copy,
  Facebook,
  Twitter,
  Link2,
  MessageCircle,
  Download,
  QrCode,
  Shield,
  Bell,
  Users,
  Heart,
  TrendingUp,
  Award,
  Target,
  Calendar,
  MapPin,
  Briefcase,
  GraduationCap,
  Languages,
} from 'lucide-react';

interface ProfileCustomizationProps {
  onExit: () => void;
}

const avatarOptions = [
  { id: 'avatar-1', emoji: '😊', name: 'Happy' },
  { id: 'avatar-2', emoji: '😎', name: 'Cool' },
  { id: 'avatar-3', emoji: '🤓', name: 'Nerdy' },
  { id: 'avatar-4', emoji: '😇', name: 'Angel' },
  { id: 'avatar-5', emoji: '🥳', name: 'Party' },
  { id: 'avatar-6', emoji: '🤗', name: 'Friendly' },
  { id: 'avatar-7', emoji: '😴', name: 'Sleepy' },
  { id: 'avatar-8', emoji: '🤩', name: 'Star-struck' },
  { id: 'avatar-9', emoji: '😺', name: 'Cat' },
  { id: 'avatar-10', emoji: '🐶', name: 'Dog' },
  { id: 'avatar-11', emoji: '🦊', name: 'Fox' },
  { id: 'avatar-12', emoji: '🐼', name: 'Panda' },
];

export function ProfileCustomization({ onExit }: ProfileCustomizationProps) {
  const { theme } = useTheme();
  const { userProgress } = useApp();

  // Profile Information State
  const [firstName, setFirstName] = useState('Sarah');
  const [lastName, setLastName] = useState('Johnson');
  const [username, setUsername] = useState('sarah_signs');
  const [email, setEmail] = useState('sarah.johnson@email.com');
  const [phone, setPhone] = useState('+1 (555) 123-4567');
  const [bio, setBio] = useState('ASL learner passionate about connecting with the Deaf community. Always eager to learn and practice!');
  const [location, setLocation] = useState('San Francisco, CA');
  const [occupation, setOccupation] = useState('Software Engineer');
  const [education, setEducation] = useState('Stanford University');

  // Learning Goals State
  const [learningGoals, setLearningGoals] = useState([
    'Achieve conversational fluency in ASL',
    'Complete all beginner and intermediate courses',
    'Practice daily for 30 minutes',
    'Connect with native signers',
  ]);
  const [newGoal, setNewGoal] = useState('');

  // Avatar State
  const [selectedAvatar, setSelectedAvatar] = useState('avatar-1');
  const [showAvatarPicker, setShowAvatarPicker] = useState(false);

  // Privacy Settings State
  const [profileVisibility, setProfileVisibility] = useState<'public' | 'friends' | 'private'>('public');
  const [showEmail, setShowEmail] = useState(false);
  const [showPhone, setShowPhone] = useState(false);
  const [showProgress, setShowProgress] = useState(true);
  const [showStreak, setShowStreak] = useState(true);
  const [showBadges, setShowBadges] = useState(true);
  const [allowMessages, setAllowMessages] = useState(true);
  const [allowFriendRequests, setAllowFriendRequests] = useState(true);
  const [showOnLeaderboard, setShowOnLeaderboard] = useState(true);
  const [showActivity, setShowActivity] = useState(true);
  const [allowTagging, setAllowTagging] = useState(true);

  // Share Profile State
  const [showShareModal, setShowShareModal] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);

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

  const profileUrl = `https://signlearnar.com/@${username}`;

  const handleAddGoal = () => {
    if (newGoal.trim()) {
      setLearningGoals([...learningGoals, newGoal.trim()]);
      setNewGoal('');
    }
  };

  const handleRemoveGoal = (index: number) => {
    setLearningGoals(learningGoals.filter((_, i) => i !== index));
  };

  const handleCopyProfileLink = () => {
    navigator.clipboard.writeText(profileUrl);
    setCopySuccess(true);
    setTimeout(() => setCopySuccess(false), 2000);
  };

  const handleShareToSocial = (_platform: string) => {
    // Simulate sharing
  };

  const selectedAvatarData = avatarOptions.find(a => a.id === selectedAvatar);

  return (
    <div 
      className="h-full flex flex-col"
      style={{ background: colors.bg, color: colors.textPrimary }}
      role="main"
      aria-labelledby="profile-customization-title"
    >
      {/* Header */}
      <div 
        className="p-4 sm:p-6 border-b"
        style={{ borderBottomColor: colors.border }}
      >
        <div className="flex items-center gap-2 sm:gap-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={onExit}
            style={{ color: colors.textSecondary }}
            aria-label="Close profile customization"
            className="flex-shrink-0"
          >
            <X className="w-6 h-6" />
          </Button>
          <div className="flex-1 min-w-0">
            <h1 
              id="profile-customization-title" 
              className="text-xl sm:text-2xl font-bold truncate"
              style={{ fontFamily: 'Poppins, sans-serif' }}
            >
              Edit Profile
            </h1>
            <p className="text-sm truncate" style={{ color: colors.textSecondary }}>
              Customize your profile and privacy
            </p>
          </div>
          <Button
            className="h-9 sm:h-10 px-4 sm:px-6 rounded-full font-semibold text-sm flex-shrink-0"
            style={{
              background: colors.iconColor,
              color: theme === 'dark' ? '#0F0F23' : '#FFFFFF',
            }}
            aria-label="Save profile changes"
          >
            <Check className="w-4 h-4 sm:mr-2" />
            <span className="hidden sm:inline">Save</span>
          </Button>
        </div>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6">
        {/* Profile Photo & Avatar Section */}
        <section aria-labelledby="photo-avatar-heading" className="mb-6">
          <h2 id="photo-avatar-heading" className="text-lg font-semibold mb-4" style={{ color: colors.textPrimary }}>
            Profile Photo & Avatar
          </h2>

          <div 
            className="rounded-xl p-6"
            style={{
              background: colors.cardBg,
              backdropFilter: colors.blur,
              WebkitBackdropFilter: colors.blur,
              border: colors.glassBorder,
              boxShadow: colors.shadow,
            }}
          >
            {/* Current Avatar */}
            <div className="flex items-center gap-6 mb-6">
              <div className="relative">
                <div 
                  className="w-24 h-24 rounded-full flex items-center justify-center text-5xl"
                  style={{ background: colors.iconBg }}
                  aria-label={`Current avatar: ${selectedAvatarData?.name}`}
                >
                  {selectedAvatarData?.emoji}
                </div>
                <button
                  onClick={() => setShowAvatarPicker(!showAvatarPicker)}
                  className="absolute bottom-0 right-0 w-8 h-8 rounded-full flex items-center justify-center"
                  style={{ background: colors.iconColor }}
                  aria-label="Change avatar"
                  aria-expanded={showAvatarPicker}
                >
                  <Edit3 className="w-4 h-4" style={{ color: theme === 'dark' ? '#0F0F23' : '#FFFFFF' }} />
                </button>
              </div>

              <div className="flex-1">
                <div className="font-semibold mb-1" style={{ color: colors.textPrimary }}>
                  {firstName} {lastName}
                </div>
                <div className="text-sm mb-3" style={{ color: colors.textSecondary }}>
                  @{username}
                </div>
                <Button
                  variant="ghost"
                  className="h-10 px-4 rounded-full font-semibold text-sm"
                  style={{
                    background: colors.iconBg,
                    color: colors.iconColor,
                  }}
                  aria-label="Upload profile photo"
                >
                  <Camera className="w-4 h-4 mr-2" />
                  Upload Photo
                </Button>
              </div>
            </div>

            {/* Avatar Picker */}
            <AnimatePresence>
              {showAvatarPicker && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden"
                >
                  <div 
                    className="pt-6 border-t"
                    style={{ borderTopColor: colors.border }}
                  >
                    <div className="font-semibold mb-3 text-sm" style={{ color: colors.textPrimary }}>
                      Choose Avatar
                    </div>
                    <div className="grid grid-cols-6 gap-3" role="radiogroup" aria-label="Avatar selection">
                      {avatarOptions.map((avatar) => {
                        const isSelected = selectedAvatar === avatar.id;
                        return (
                          <button
                            key={avatar.id}
                            onClick={() => {
                              setSelectedAvatar(avatar.id);
                              setShowAvatarPicker(false);
                            }}
                            className="aspect-square rounded-xl flex items-center justify-center text-3xl transition-all"
                            style={{
                              background: isSelected ? colors.iconBg : colors.cardHover,
                              border: isSelected ? `2px solid ${colors.iconColor}` : 'none',
                            }}
                            role="radio"
                            aria-checked={isSelected}
                            aria-label={avatar.name}
                          >
                            {avatar.emoji}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </section>

        {/* Personal Information Section */}
        <section aria-labelledby="personal-info-heading" className="mb-6">
          <h2 id="personal-info-heading" className="text-lg font-semibold mb-4" style={{ color: colors.textPrimary }}>
            Personal Information
          </h2>

          <div 
            className="rounded-xl p-6"
            style={{
              background: colors.cardBg,
              backdropFilter: colors.blur,
              WebkitBackdropFilter: colors.blur,
              border: colors.glassBorder,
              boxShadow: colors.shadow,
            }}
          >
            {/* First Name */}
            <div className="mb-4">
              <label htmlFor="first-name" className="block text-sm font-semibold mb-2" style={{ color: colors.textPrimary }}>
                First Name
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5" style={{ color: colors.textTertiary }} aria-hidden="true" />
                <input
                  id="first-name"
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-xl text-sm"
                  style={{
                    background: colors.cardHover,
                    color: colors.textPrimary,
                    border: colors.glassBorder,
                  }}
                />
              </div>
            </div>

            {/* Last Name */}
            <div className="mb-4">
              <label htmlFor="last-name" className="block text-sm font-semibold mb-2" style={{ color: colors.textPrimary }}>
                Last Name
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5" style={{ color: colors.textTertiary }} aria-hidden="true" />
                <input
                  id="last-name"
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-xl text-sm"
                  style={{
                    background: colors.cardHover,
                    color: colors.textPrimary,
                    border: colors.glassBorder,
                  }}
                />
              </div>
            </div>

            {/* Username */}
            <div className="mb-4">
              <label htmlFor="username" className="block text-sm font-semibold mb-2" style={{ color: colors.textPrimary }}>
                Username
              </label>
              <div className="relative">
                <AtSign className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5" style={{ color: colors.textTertiary }} aria-hidden="true" />
                <input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-xl text-sm"
                  style={{
                    background: colors.cardHover,
                    color: colors.textPrimary,
                    border: colors.glassBorder,
                  }}
                />
              </div>
            </div>

            {/* Email */}
            <div className="mb-4">
              <label htmlFor="email" className="block text-sm font-semibold mb-2" style={{ color: colors.textPrimary }}>
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5" style={{ color: colors.textTertiary }} aria-hidden="true" />
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-xl text-sm"
                  style={{
                    background: colors.cardHover,
                    color: colors.textPrimary,
                    border: colors.glassBorder,
                  }}
                />
              </div>
            </div>

            {/* Phone */}
            <div className="mb-4">
              <label htmlFor="phone" className="block text-sm font-semibold mb-2" style={{ color: colors.textPrimary }}>
                Phone Number
              </label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5" style={{ color: colors.textTertiary }} aria-hidden="true" />
                <input
                  id="phone"
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-xl text-sm"
                  style={{
                    background: colors.cardHover,
                    color: colors.textPrimary,
                    border: colors.glassBorder,
                  }}
                />
              </div>
            </div>

            {/* Location */}
            <div className="mb-4">
              <label htmlFor="location" className="block text-sm font-semibold mb-2" style={{ color: colors.textPrimary }}>
                Location
              </label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5" style={{ color: colors.textTertiary }} aria-hidden="true" />
                <input
                  id="location"
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="City, State/Country"
                  className="w-full pl-10 pr-4 py-3 rounded-xl text-sm"
                  style={{
                    background: colors.cardHover,
                    color: colors.textPrimary,
                    border: colors.glassBorder,
                  }}
                />
              </div>
            </div>

            {/* Occupation */}
            <div className="mb-4">
              <label htmlFor="occupation" className="block text-sm font-semibold mb-2" style={{ color: colors.textPrimary }}>
                Occupation
              </label>
              <div className="relative">
                <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5" style={{ color: colors.textTertiary }} aria-hidden="true" />
                <input
                  id="occupation"
                  type="text"
                  value={occupation}
                  onChange={(e) => setOccupation(e.target.value)}
                  placeholder="Your profession"
                  className="w-full pl-10 pr-4 py-3 rounded-xl text-sm"
                  style={{
                    background: colors.cardHover,
                    color: colors.textPrimary,
                    border: colors.glassBorder,
                  }}
                />
              </div>
            </div>

            {/* Education */}
            <div>
              <label htmlFor="education" className="block text-sm font-semibold mb-2" style={{ color: colors.textPrimary }}>
                Education
              </label>
              <div className="relative">
                <GraduationCap className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5" style={{ color: colors.textTertiary }} aria-hidden="true" />
                <input
                  id="education"
                  type="text"
                  value={education}
                  onChange={(e) => setEducation(e.target.value)}
                  placeholder="School or university"
                  className="w-full pl-10 pr-4 py-3 rounded-xl text-sm"
                  style={{
                    background: colors.cardHover,
                    color: colors.textPrimary,
                    border: colors.glassBorder,
                  }}
                />
              </div>
            </div>
          </div>
        </section>

        {/* Bio Section */}
        <section aria-labelledby="bio-heading" className="mb-6">
          <h2 id="bio-heading" className="text-lg font-semibold mb-4" style={{ color: colors.textPrimary }}>
            Bio
          </h2>

          <div 
            className="rounded-xl p-6"
            style={{
              background: colors.cardBg,
              backdropFilter: colors.blur,
              WebkitBackdropFilter: colors.blur,
              border: colors.glassBorder,
              boxShadow: colors.shadow,
            }}
          >
            <label htmlFor="bio" className="block text-sm font-semibold mb-2" style={{ color: colors.textPrimary }}>
              About You
            </label>
            <textarea
              id="bio"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Tell others about yourself and your sign language journey..."
              rows={4}
              maxLength={500}
              className="w-full px-4 py-3 rounded-xl text-sm resize-none"
              style={{
                background: colors.cardHover,
                color: colors.textPrimary,
                border: colors.glassBorder,
              }}
            />
            <div className="text-xs mt-2 text-right" style={{ color: colors.textTertiary }}>
              {bio.length}/500 characters
            </div>
          </div>
        </section>

        {/* Learning Goals Section */}
        <section aria-labelledby="goals-heading" className="mb-6">
          <h2 id="goals-heading" className="text-lg font-semibold mb-4" style={{ color: colors.textPrimary }}>
            Learning Goals
          </h2>

          <div 
            className="rounded-xl p-6"
            style={{
              background: colors.cardBg,
              backdropFilter: colors.blur,
              WebkitBackdropFilter: colors.blur,
              border: colors.glassBorder,
              boxShadow: colors.shadow,
            }}
          >
            {/* Goals List */}
            <div className="space-y-3 mb-4">
              {learningGoals.map((goal, index) => (
                <div
                  key={index}
                  className="flex items-start gap-3 p-3 rounded-lg"
                  style={{ background: colors.cardHover }}
                >
                  <Target className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: colors.iconColor }} aria-hidden="true" />
                  <div className="flex-1 text-sm" style={{ color: colors.textPrimary }}>
                    {goal}
                  </div>
                  <button
                    onClick={() => handleRemoveGoal(index)}
                    className="p-1 rounded transition-colors"
                    style={{ color: colors.errorColor }}
                    aria-label={`Remove goal: ${goal}`}
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>

            {/* Add Goal */}
            <div className="flex gap-2">
              <input
                type="text"
                value={newGoal}
                onChange={(e) => setNewGoal(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleAddGoal()}
                placeholder="Add a new learning goal..."
                className="flex-1 px-4 py-3 rounded-xl text-sm"
                style={{
                  background: colors.cardHover,
                  color: colors.textPrimary,
                  border: colors.glassBorder,
                }}
                aria-label="New learning goal"
              />
              <Button
                onClick={handleAddGoal}
                disabled={!newGoal.trim()}
                className="h-12 px-6 rounded-xl font-semibold"
                style={{
                  background: colors.iconColor,
                  color: theme === 'dark' ? '#0F0F23' : '#FFFFFF',
                }}
                aria-label="Add goal"
              >
                Add
              </Button>
            </div>
          </div>
        </section>

        {/* Privacy Settings Section */}
        <section aria-labelledby="privacy-heading" className="mb-6">
          <h2 id="privacy-heading" className="text-lg font-semibold mb-4" style={{ color: colors.textPrimary }}>
            Privacy Settings
          </h2>

          <div 
            className="rounded-xl p-6"
            style={{
              background: colors.cardBg,
              backdropFilter: colors.blur,
              WebkitBackdropFilter: colors.blur,
              border: colors.glassBorder,
              boxShadow: colors.shadow,
            }}
          >
            {/* Profile Visibility */}
            <div className="mb-6">
              <div className="font-semibold mb-3 text-sm" style={{ color: colors.textPrimary }}>
                Profile Visibility
              </div>
              <div className="space-y-2" role="radiogroup" aria-label="Profile visibility">
                {[
                  { value: 'public', label: 'Public', description: 'Anyone can see your profile', icon: Globe },
                  { value: 'friends', label: 'Friends Only', description: 'Only your friends can see your profile', icon: Users },
                  { value: 'private', label: 'Private', description: 'Only you can see your profile', icon: Lock },
                ].map((option) => {
                  const isSelected = profileVisibility === option.value;
                  const Icon = option.icon;
                  return (
                    <button
                      key={option.value}
                      onClick={() => setProfileVisibility(option.value as any)}
                      className="w-full rounded-lg p-4 text-left transition-all"
                      style={{
                        background: isSelected ? colors.iconBg : colors.cardHover,
                        border: isSelected ? `2px solid ${colors.iconColor}` : 'none',
                      }}
                      role="radio"
                      aria-checked={isSelected}
                      aria-label={`${option.label}, ${option.description}`}
                    >
                      <div className="flex items-center gap-3">
                        <Icon className="w-5 h-5" style={{ color: isSelected ? colors.iconColor : colors.textSecondary }} aria-hidden="true" />
                        <div className="flex-1">
                          <div className="font-semibold text-sm mb-1" style={{ color: colors.textPrimary }}>
                            {option.label}
                          </div>
                          <div className="text-xs" style={{ color: colors.textSecondary }}>
                            {option.description}
                          </div>
                        </div>
                        {isSelected && (
                          <Check className="w-5 h-5" style={{ color: colors.iconColor }} aria-hidden="true" />
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Contact Information Visibility */}
            <div className="mb-6 pb-6 border-b" style={{ borderBottomColor: colors.border }}>
              <div className="font-semibold mb-3 text-sm" style={{ color: colors.textPrimary }}>
                Contact Information
              </div>
              
              <div className="flex items-center justify-between py-3">
                <div className="flex items-center gap-3 flex-1">
                  <Mail className="w-5 h-5" style={{ color: colors.textSecondary }} aria-hidden="true" />
                  <div>
                    <div className="font-semibold text-sm" style={{ color: colors.textPrimary }}>
                      Show Email
                    </div>
                    <div className="text-xs" style={{ color: colors.textSecondary }}>
                      Display email on your profile
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => setShowEmail(!showEmail)}
                  className="relative w-12 h-6 rounded-full transition-colors flex-shrink-0"
                  style={{ 
                    background: showEmail ? colors.iconColor : colors.border,
                  }}
                  role="switch"
                  aria-checked={showEmail}
                  aria-label="Show email on profile"
                >
                  <div 
                    className="absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white transition-transform"
                    style={{
                      transform: showEmail ? 'translateX(24px)' : 'translateX(0)',
                    }}
                  />
                </button>
              </div>

              <div className="flex items-center justify-between py-3">
                <div className="flex items-center gap-3 flex-1">
                  <Phone className="w-5 h-5" style={{ color: colors.textSecondary }} aria-hidden="true" />
                  <div>
                    <div className="font-semibold text-sm" style={{ color: colors.textPrimary }}>
                      Show Phone
                    </div>
                    <div className="text-xs" style={{ color: colors.textSecondary }}>
                      Display phone number on your profile
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => setShowPhone(!showPhone)}
                  className="relative w-12 h-6 rounded-full transition-colors flex-shrink-0"
                  style={{ 
                    background: showPhone ? colors.iconColor : colors.border,
                  }}
                  role="switch"
                  aria-checked={showPhone}
                  aria-label="Show phone on profile"
                >
                  <div 
                    className="absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white transition-transform"
                    style={{
                      transform: showPhone ? 'translateX(24px)' : 'translateX(0)',
                    }}
                  />
                </button>
              </div>
            </div>

            {/* What Others Can See */}
            <div className="mb-6 pb-6 border-b" style={{ borderBottomColor: colors.border }}>
              <div className="font-semibold mb-3 text-sm" style={{ color: colors.textPrimary }}>
                What Others Can See
              </div>

              {[
                { label: 'Show Learning Progress', value: showProgress, onChange: setShowProgress, icon: TrendingUp },
                { label: 'Show Streak Counter', value: showStreak, onChange: setShowStreak, icon: Calendar },
                { label: 'Show Badges & Achievements', value: showBadges, onChange: setShowBadges, icon: Award },
                { label: 'Show Recent Activity', value: showActivity, onChange: setShowActivity, icon: Heart },
              ].map((toggle, index) => {
                const Icon = toggle.icon;
                return (
                  <div key={index} className="flex items-center justify-between py-3">
                    <div className="flex items-center gap-3 flex-1">
                      <Icon className="w-5 h-5" style={{ color: colors.textSecondary }} aria-hidden="true" />
                      <div className="font-semibold text-sm" style={{ color: colors.textPrimary }}>
                        {toggle.label}
                      </div>
                    </div>
                    <button
                      onClick={() => toggle.onChange(!toggle.value)}
                      className="relative w-12 h-6 rounded-full transition-colors flex-shrink-0"
                      style={{ 
                        background: toggle.value ? colors.iconColor : colors.border,
                      }}
                      role="switch"
                      aria-checked={toggle.value}
                      aria-label={toggle.label}
                    >
                      <div 
                        className="absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white transition-transform"
                        style={{
                          transform: toggle.value ? 'translateX(24px)' : 'translateX(0)',
                        }}
                      />
                    </button>
                  </div>
                );
              })}
            </div>

            {/* Interaction Settings */}
            <div>
              <div className="font-semibold mb-3 text-sm" style={{ color: colors.textPrimary }}>
                Interaction Settings
              </div>

              {[
                { label: 'Allow Direct Messages', value: allowMessages, onChange: setAllowMessages, icon: MessageCircle },
                { label: 'Allow Friend Requests', value: allowFriendRequests, onChange: setAllowFriendRequests, icon: Users },
                { label: 'Show on Leaderboard', value: showOnLeaderboard, onChange: setShowOnLeaderboard, icon: TrendingUp },
                { label: 'Allow Tagging in Posts', value: allowTagging, onChange: setAllowTagging, icon: AtSign },
              ].map((toggle, index) => {
                const Icon = toggle.icon;
                return (
                  <div key={index} className="flex items-center justify-between py-3">
                    <div className="flex items-center gap-3 flex-1">
                      <Icon className="w-5 h-5" style={{ color: colors.textSecondary }} aria-hidden="true" />
                      <div className="font-semibold text-sm" style={{ color: colors.textPrimary }}>
                        {toggle.label}
                      </div>
                    </div>
                    <button
                      onClick={() => toggle.onChange(!toggle.value)}
                      className="relative w-12 h-6 rounded-full transition-colors flex-shrink-0"
                      style={{ 
                        background: toggle.value ? colors.iconColor : colors.border,
                      }}
                      role="switch"
                      aria-checked={toggle.value}
                      aria-label={toggle.label}
                    >
                      <div 
                        className="absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white transition-transform"
                        style={{
                          transform: toggle.value ? 'translateX(24px)' : 'translateX(0)',
                        }}
                      />
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Share Profile Section */}
        <section aria-labelledby="share-heading" className="mb-6">
          <h2 id="share-heading" className="text-lg font-semibold mb-4" style={{ color: colors.textPrimary }}>
            Share Profile
          </h2>

          <div 
            className="rounded-xl p-6"
            style={{
              background: colors.cardBg,
              backdropFilter: colors.blur,
              WebkitBackdropFilter: colors.blur,
              border: colors.glassBorder,
              boxShadow: colors.shadow,
            }}
          >
            {/* Profile URL */}
            <div className="mb-4">
              <div className="font-semibold mb-2 text-sm" style={{ color: colors.textPrimary }}>
                Your Profile URL
              </div>
              <div className="flex flex-col gap-2">
                <div 
                  className="flex-1 px-4 py-3 rounded-xl text-sm"
                  style={{
                    background: colors.cardHover,
                    color: colors.textSecondary,
                  }}
                >
                  {profileUrl}
                </div>
                <Button
                  onClick={handleCopyProfileLink}
                  className="h-12 px-6 rounded-xl font-semibold"
                  style={{
                    background: copySuccess ? colors.successBg : colors.iconBg,
                    color: copySuccess ? colors.successColor : colors.iconColor,
                  }}
                  aria-label={copySuccess ? 'Link copied' : 'Copy profile link'}
                >
                  {copySuccess ? (
                    <>
                      <Check className="w-4 h-4 mr-2" />
                      Copied
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4 mr-2" />
                      Copy
                    </>
                  )}
                </Button>
              </div>
            </div>

            {/* Share Options */}
            <div>
              <div className="font-semibold mb-3 text-sm" style={{ color: colors.textPrimary }}>
                Share Via
              </div>
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => handleShareToSocial('facebook')}
                  className="flex items-center justify-center gap-2 p-4 rounded-xl transition-colors"
                  style={{ background: colors.cardHover }}
                  onMouseEnter={(e) => e.currentTarget.style.background = colors.iconBg}
                  onMouseLeave={(e) => e.currentTarget.style.background = colors.cardHover}
                  aria-label="Share on Facebook"
                >
                  <Facebook className="w-5 h-5" style={{ color: '#1877F2' }} aria-hidden="true" />
                  <span className="font-semibold text-sm" style={{ color: colors.textPrimary }}>
                    Facebook
                  </span>
                </button>

                <button
                  onClick={() => handleShareToSocial('twitter')}
                  className="flex items-center justify-center gap-2 p-4 rounded-xl transition-colors"
                  style={{ background: colors.cardHover }}
                  onMouseEnter={(e) => e.currentTarget.style.background = colors.iconBg}
                  onMouseLeave={(e) => e.currentTarget.style.background = colors.cardHover}
                  aria-label="Share on Twitter"
                >
                  <Twitter className="w-5 h-5" style={{ color: '#1DA1F2' }} aria-hidden="true" />
                  <span className="font-semibold text-sm" style={{ color: colors.textPrimary }}>
                    Twitter
                  </span>
                </button>

                <button
                  onClick={() => handleShareToSocial('whatsapp')}
                  className="flex items-center justify-center gap-2 p-4 rounded-xl transition-colors"
                  style={{ background: colors.cardHover }}
                  onMouseEnter={(e) => e.currentTarget.style.background = colors.iconBg}
                  onMouseLeave={(e) => e.currentTarget.style.background = colors.cardHover}
                  aria-label="Share on WhatsApp"
                >
                  <MessageCircle className="w-5 h-5" style={{ color: '#25D366' }} aria-hidden="true" />
                  <span className="font-semibold text-sm" style={{ color: colors.textPrimary }}>
                    WhatsApp
                  </span>
                </button>

                <button
                  onClick={() => setShowShareModal(true)}
                  className="flex items-center justify-center gap-2 p-4 rounded-xl transition-colors"
                  style={{ background: colors.cardHover }}
                  onMouseEnter={(e) => e.currentTarget.style.background = colors.iconBg}
                  onMouseLeave={(e) => e.currentTarget.style.background = colors.cardHover}
                  aria-label="Show QR code"
                >
                  <QrCode className="w-5 h-5" style={{ color: colors.iconColor }} aria-hidden="true" />
                  <span className="font-semibold text-sm" style={{ color: colors.textPrimary }}>
                    QR Code
                  </span>
                </button>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* QR Code Modal */}
      <AnimatePresence>
        {showShareModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
            onClick={() => setShowShareModal(false)}
            role="dialog"
            aria-labelledby="qr-code-title"
            aria-modal="true"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="rounded-2xl p-6 max-w-sm w-full"
              style={{
                background: colors.cardBg,
                backdropFilter: colors.blur,
                WebkitBackdropFilter: colors.blur,
              }}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 id="qr-code-title" className="text-lg font-semibold" style={{ color: colors.textPrimary }}>
                  Share Profile
                </h3>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setShowShareModal(false)}
                  aria-label="Close QR code modal"
                >
                  <X className="w-5 h-5" />
                </Button>
              </div>

              {/* QR Code Placeholder */}
              <div 
                className="aspect-square rounded-xl flex items-center justify-center mb-4"
                style={{ background: colors.cardHover }}
                role="img"
                aria-label="QR code for profile"
              >
                <div className="text-center">
                  <QrCode className="w-48 h-48 mx-auto mb-3" style={{ color: colors.textTertiary }} aria-hidden="true" />
                  <p className="text-sm" style={{ color: colors.textSecondary }}>
                    Scan to view profile
                  </p>
                </div>
              </div>

              <Button
                onClick={handleCopyProfileLink}
                className="w-full h-12 rounded-xl font-semibold"
                style={{
                  background: colors.iconColor,
                  color: theme === 'dark' ? '#0F0F23' : '#FFFFFF',
                }}
                aria-label="Copy profile link"
              >
                <Copy className="w-4 h-4 mr-2" />
                Copy Profile Link
              </Button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}