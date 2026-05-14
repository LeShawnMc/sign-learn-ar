import React, { useState, useEffect, useRef, useCallback } from 'react';
import QRCode from 'qrcode';
import { Button } from './ui/button';
import { useTheme } from '../context/ThemeContext';
import { useApp } from '../context/AppContext';
import { useAuth } from '../../lib/AuthContext';
import { saveProfile, loadProfile, saveProfileLocal, loadProfileLocal, type UserProfile } from '../../lib/supabase';
import { motion, AnimatePresence } from 'motion/react';
import {
  X, User, Mail, Phone, AtSign, Camera, Edit3, Check, Globe, Lock,
  Share2, Copy, Facebook, Twitter, MessageCircle, QrCode, Users,
  Heart, TrendingUp, Award, Target, MapPin, Briefcase, GraduationCap,
  CheckCircle, AlertCircle, Loader2,
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

type SaveStatus = 'idle' | 'saving' | 'saved' | 'error';

export function ProfileCustomization({ onExit }: ProfileCustomizationProps) {
  const { theme } = useTheme();
  const { userProgress } = useApp();
  const { user, mode } = useAuth();

  // ── Derive defaults from auth ──────────────────────────────────────────────
  const authEmail = user?.email ?? '';
  const authUsername = authEmail
    ? authEmail.split('@')[0].replace(/[^a-z0-9_]/gi, '_')
    : 'learner';

  // ── Form state ─────────────────────────────────────────────────────────────
  const [firstName, setFirstName]     = useState('');
  const [lastName, setLastName]       = useState('');
  const [username, setUsername]       = useState(authUsername);
  const [email, setEmail]             = useState(authEmail);
  const [phone, setPhone]             = useState('');
  const [bio, setBio]                 = useState('');
  const [location, setLocation]       = useState('');
  const [occupation, setOccupation]   = useState('');
  const [education, setEducation]     = useState('');

  // ── Learning goals ─────────────────────────────────────────────────────────
  const [learningGoals, setLearningGoals] = useState<string[]>([
    'Achieve conversational fluency in ASL',
    'Complete all beginner and intermediate courses',
    'Practice daily for 30 minutes',
  ]);
  const [newGoal, setNewGoal] = useState('');

  // ── Avatar / photo ─────────────────────────────────────────────────────────
  const [selectedAvatar, setSelectedAvatar] = useState('avatar-1');
  const [photoData, setPhotoData]           = useState<string | null>(null); // base64
  const [showAvatarPicker, setShowAvatarPicker] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // ── Privacy settings ───────────────────────────────────────────────────────
  const [profileVisibility, setProfileVisibility] = useState<'public' | 'friends' | 'private'>('public');
  const [showEmail, setShowEmail]                 = useState(false);
  const [showPhone, setShowPhone]                 = useState(false);
  const [showProgress, setShowProgress]           = useState(true);
  const [showStreak, setShowStreak]               = useState(true);
  const [showBadges, setShowBadges]               = useState(true);
  const [showActivity, setShowActivity]           = useState(true);
  const [allowMessages, setAllowMessages]         = useState(true);
  const [allowFriendRequests, setAllowFriendRequests] = useState(true);
  const [showOnLeaderboard, setShowOnLeaderboard] = useState(true);
  const [allowTagging, setAllowTagging]           = useState(true);

  // ── UI state ───────────────────────────────────────────────────────────────
  const [saveStatus, setSaveStatus]   = useState<SaveStatus>('idle');
  const [saveError, setSaveError]     = useState('');
  const [copySuccess, setCopySuccess] = useState(false);
  const [showQrModal, setShowQrModal] = useState(false);
  const [qrDataUrl, setQrDataUrl]     = useState('');

  const profileUrl = `https://signlearnar.com/@${username || authUsername}`;

  // ── Load saved profile on mount ────────────────────────────────────────────
  useEffect(() => {
    const applyProfile = (p: UserProfile) => {
      if (p.first_name)         setFirstName(p.first_name);
      if (p.last_name)          setLastName(p.last_name);
      if (p.username)           setUsername(p.username);
      if (p.bio)                setBio(p.bio);
      if (p.location)           setLocation(p.location);
      if (p.occupation)         setOccupation(p.occupation);
      if (p.education)          setEducation(p.education);
      if (p.phone)              setPhone(p.phone);
      if (p.avatar_id)          setSelectedAvatar(p.avatar_id);
      if (p.avatar_data)        setPhotoData(p.avatar_data);
      if (p.profile_visibility) setProfileVisibility(p.profile_visibility);
      if (p.learning_goals)     setLearningGoals(p.learning_goals);
      if (typeof p.show_email         === 'boolean') setShowEmail(p.show_email);
      if (typeof p.show_phone         === 'boolean') setShowPhone(p.show_phone);
      if (typeof p.show_progress      === 'boolean') setShowProgress(p.show_progress);
      if (typeof p.show_streak        === 'boolean') setShowStreak(p.show_streak);
      if (typeof p.show_badges        === 'boolean') setShowBadges(p.show_badges);
      if (typeof p.show_activity      === 'boolean') setShowActivity(p.show_activity);
      if (typeof p.allow_messages     === 'boolean') setAllowMessages(p.allow_messages);
      if (typeof p.allow_friend_requests === 'boolean') setAllowFriendRequests(p.allow_friend_requests);
      if (typeof p.show_on_leaderboard=== 'boolean') setShowOnLeaderboard(p.show_on_leaderboard);
      if (typeof p.allow_tagging      === 'boolean') setAllowTagging(p.allow_tagging);
    };

    // Load local immediately, then try remote
    const local = loadProfileLocal();
    if (local) applyProfile(local);

    if (user?.id) {
      loadProfile(user.id).then(remote => {
        if (remote) applyProfile(remote);
      });
    }
  }, [user?.id]);

  // ── Generate QR code when modal opens ─────────────────────────────────────
  useEffect(() => {
    if (!showQrModal) return;
    QRCode.toDataURL(profileUrl, {
      width: 280,
      margin: 2,
      color: { dark: '#0F0F23', light: '#F8FAFC' },
    }).then(setQrDataUrl).catch(() => setQrDataUrl(''));
  }, [showQrModal, profileUrl]);

  // ── Save ───────────────────────────────────────────────────────────────────
  const handleSave = useCallback(async () => {
    setSaveStatus('saving');
    setSaveError('');

    const profile: UserProfile = {
      first_name: firstName, last_name: lastName, username, bio, location,
      occupation, education, phone, avatar_id: selectedAvatar,
      avatar_data: photoData ?? undefined,
      profile_visibility: profileVisibility, learning_goals: learningGoals,
      show_email: showEmail, show_phone: showPhone, show_progress: showProgress,
      show_streak: showStreak, show_badges: showBadges, show_activity: showActivity,
      allow_messages: allowMessages, allow_friend_requests: allowFriendRequests,
      show_on_leaderboard: showOnLeaderboard, allow_tagging: allowTagging,
      updated_at: new Date().toISOString(),
    };

    try {
      if (user?.id) {
        await saveProfile(user.id, profile);
      } else {
        saveProfileLocal(profile);
      }
      setSaveStatus('saved');
      setTimeout(() => setSaveStatus('idle'), 2500);
    } catch (err) {
      setSaveError(err instanceof Error ? err.message : 'Save failed');
      setSaveStatus('error');
      setTimeout(() => setSaveStatus('idle'), 3000);
    }
  }, [
    firstName, lastName, username, bio, location, occupation, education, phone,
    selectedAvatar, photoData, profileVisibility, learningGoals,
    showEmail, showPhone, showProgress, showStreak, showBadges, showActivity,
    allowMessages, allowFriendRequests, showOnLeaderboard, allowTagging, user?.id,
  ]);

  // ── Photo upload ──────────────────────────────────────────────────────────
  const handlePhotoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      alert('Photo must be under 5 MB');
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      setPhotoData(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  // ── Goals ─────────────────────────────────────────────────────────────────
  const handleAddGoal = () => {
    if (newGoal.trim()) {
      setLearningGoals(prev => [...prev, newGoal.trim()]);
      setNewGoal('');
    }
  };

  const handleRemoveGoal = (index: number) => {
    setLearningGoals(prev => prev.filter((_, i) => i !== index));
  };

  // ── Share ─────────────────────────────────────────────────────────────────
  const handleCopyLink = () => {
    navigator.clipboard.writeText(profileUrl).then(() => {
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    });
  };

  const handleShareToSocial = (platform: string) => {
    const text = `Check out my ASL learning profile on Sign Learn AR!`;
    const encodedUrl  = encodeURIComponent(profileUrl);
    const encodedText = encodeURIComponent(text);

    const urls: Record<string, string> = {
      facebook:  `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
      twitter:   `https://twitter.com/intent/tweet?text=${encodedText}&url=${encodedUrl}`,
      whatsapp:  `https://wa.me/?text=${encodeURIComponent(text + ' ' + profileUrl)}`,
    };

    // Use Web Share API on mobile if available
    if (platform === 'native' && navigator.share) {
      navigator.share({ title: 'My Sign Learn AR Profile', text, url: profileUrl });
      return;
    }

    if (urls[platform]) window.open(urls[platform], '_blank', 'noopener,noreferrer');
  };

  // ── Colors ─────────────────────────────────────────────────────────────────
  const colors = theme === 'dark'
    ? {
        bg: 'var(--color-bg-deep)', cardBg: 'var(--color-bg-card)', cardHover: '#252541',
        textPrimary: 'var(--color-text)', textSecondary: 'var(--color-text-muted)',
        textTertiary: '#64748B', border: 'rgba(148,163,184,0.2)',
        iconBg: 'rgba(0,245,255,0.1)', iconColor: 'var(--color-cyan)',
        blur: 'none', shadow: 'none', glassBorder: 'none',
        errorColor: '#EF4444', successColor: '#22C55E',
      }
    : {
        bg: 'linear-gradient(135deg,#E0F2FE 0%,#EDE9FE 50%,#FCE7F3 100%)',
        cardBg: 'rgba(255,255,255,0.6)', cardHover: 'rgba(255,255,255,0.8)',
        textPrimary: '#0F172A', textSecondary: '#334155', textTertiary: '#64748B',
        border: 'rgba(255,255,255,0.6)', iconBg: 'rgba(14,165,233,0.12)',
        iconColor: '#0EA5E9', blur: 'blur(20px)',
        shadow: '0 8px 32px rgba(31,38,135,0.15)', glassBorder: '1px solid rgba(255,255,255,0.6)',
        errorColor: '#EF4444', successColor: '#22C55E',
      };

  const selectedAvatarData = avatarOptions.find(a => a.id === selectedAvatar);
  const cardStyle = {
    background: colors.cardBg, backdropFilter: colors.blur,
    WebkitBackdropFilter: colors.blur, border: colors.glassBorder, boxShadow: colors.shadow,
  };
  const inputStyle = { background: colors.cardHover, color: colors.textPrimary, border: colors.glassBorder };

  // Save button label / icon
  const saveLabel = saveStatus === 'saving' ? 'Saving…'
    : saveStatus === 'saved'  ? 'Saved!'
    : saveStatus === 'error'  ? 'Error'
    : 'Save';
  const SaveIcon = saveStatus === 'saving' ? Loader2
    : saveStatus === 'saved'  ? CheckCircle
    : saveStatus === 'error'  ? AlertCircle
    : Check;

  return (
    <div className="h-full flex flex-col" style={{ background: colors.bg, color: colors.textPrimary }}
      role="main" aria-labelledby="profile-title">

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        aria-hidden="true"
        onChange={handlePhotoSelect}
      />

      {/* Header */}
      <div className="p-4 border-b flex items-center gap-3 flex-shrink-0" style={{ borderBottomColor: colors.border }}>
        <Button variant="ghost" size="icon" onClick={onExit} style={{ color: colors.textSecondary }} aria-label="Close">
          <X className="w-6 h-6" />
        </Button>
        <div className="flex-1">
          <h1 id="profile-title" className="text-xl font-bold">Edit Profile</h1>
          <p className="text-sm" style={{ color: colors.textSecondary }}>Customize your profile and privacy</p>
        </div>
        <Button
          onClick={handleSave}
          disabled={saveStatus === 'saving'}
          className="h-10 px-5 rounded-full font-semibold text-sm flex items-center gap-2 disabled:opacity-60"
          style={{
            background: saveStatus === 'saved' ? colors.successColor
              : saveStatus === 'error' ? colors.errorColor
              : colors.iconColor,
            color: theme === 'dark' ? 'var(--color-bg-deep)' : '#fff',
          }}
          aria-label="Save profile changes"
        >
          <SaveIcon className={`w-4 h-4 ${saveStatus === 'saving' ? 'animate-spin' : ''}`} />
          <span className="hidden sm:inline">{saveLabel}</span>
        </Button>
      </div>

      {saveStatus === 'error' && (
        <div className="mx-4 mt-3 px-4 py-2 rounded-lg text-sm" style={{ background: 'rgba(239,68,68,0.1)', color: colors.errorColor }}>
          {saveError || 'Could not save profile. Changes saved locally.'}
        </div>
      )}

      {/* Scrollable content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6">

        {/* ── Profile Photo & Avatar ─────────────────────────────────── */}
        <section aria-labelledby="photo-heading">
          <h2 id="photo-heading" className="text-lg font-semibold mb-3" style={{ color: colors.textPrimary }}>
            Profile Photo & Avatar
          </h2>
          <div className="rounded-xl p-5" style={cardStyle}>
            <div className="flex items-center gap-5 mb-5">
              {/* Avatar / photo display */}
              <div className="relative">
                {photoData ? (
                  <img
                    src={photoData}
                    alt="Profile photo"
                    className="w-24 h-24 rounded-full object-cover"
                    style={{ border: `3px solid ${colors.iconColor}` }}
                  />
                ) : (
                  <div
                    className="w-24 h-24 rounded-full flex items-center justify-center text-5xl"
                    style={{ background: colors.iconBg, border: `3px solid ${colors.iconColor}` }}
                    aria-label={`Avatar: ${selectedAvatarData?.name}`}
                  >
                    {selectedAvatarData?.emoji}
                  </div>
                )}
                <button
                  onClick={() => setShowAvatarPicker(!showAvatarPicker)}
                  className="absolute bottom-0 right-0 w-8 h-8 rounded-full flex items-center justify-center"
                  style={{ background: colors.iconColor }}
                  aria-label="Change avatar"
                  aria-expanded={showAvatarPicker}
                >
                  <Edit3 className="w-4 h-4" style={{ color: theme === 'dark' ? 'var(--color-bg-deep)' : '#fff' }} />
                </button>
              </div>

              <div className="flex-1">
                <p className="font-semibold mb-1">{firstName || authUsername} {lastName}</p>
                <p className="text-sm mb-3" style={{ color: colors.textSecondary }}>@{username || authUsername}</p>
                <div className="flex flex-col gap-2">
                  <Button
                    variant="ghost"
                    className="h-9 px-4 rounded-full font-semibold text-sm self-start"
                    style={{ background: colors.iconBg, color: colors.iconColor }}
                    onClick={() => fileInputRef.current?.click()}
                    aria-label="Upload profile photo"
                  >
                    <Camera className="w-4 h-4 mr-2" />
                    Upload Photo
                  </Button>
                  {photoData && (
                    <button
                      onClick={() => setPhotoData(null)}
                      className="text-xs self-start"
                      style={{ color: colors.errorColor }}
                    >
                      Remove photo
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Avatar picker */}
            <AnimatePresence>
              {showAvatarPicker && (
                <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                  <div className="pt-4 border-t" style={{ borderTopColor: colors.border }}>
                    <p className="text-sm font-semibold mb-3" style={{ color: colors.textPrimary }}>Choose Avatar</p>
                    <div className="grid grid-cols-6 gap-2" role="radiogroup" aria-label="Avatar selection">
                      {avatarOptions.map(av => {
                        const sel = selectedAvatar === av.id;
                        return (
                          <button
                            key={av.id}
                            onClick={() => { setSelectedAvatar(av.id); setShowAvatarPicker(false); }}
                            className="aspect-square rounded-xl flex items-center justify-center text-3xl transition-all"
                            style={{ background: sel ? colors.iconBg : colors.cardHover, border: sel ? `2px solid ${colors.iconColor}` : 'none' }}
                            role="radio" aria-checked={sel} aria-label={av.name}
                          >
                            {av.emoji}
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

        {/* ── Personal Information ───────────────────────────────────── */}
        <section aria-labelledby="personal-heading">
          <h2 id="personal-heading" className="text-lg font-semibold mb-3" style={{ color: colors.textPrimary }}>
            Personal Information
          </h2>
          <div className="rounded-xl p-5 space-y-4" style={cardStyle}>
            {[
              { id: 'first-name', label: 'First Name',     value: firstName,   onChange: setFirstName,   icon: User,          type: 'text',  placeholder: 'Your first name' },
              { id: 'last-name',  label: 'Last Name',      value: lastName,    onChange: setLastName,    icon: User,          type: 'text',  placeholder: 'Your last name' },
              { id: 'username',   label: 'Username',       value: username,    onChange: setUsername,    icon: AtSign,        type: 'text',  placeholder: 'your_username' },
              { id: 'email',      label: 'Email',          value: email,       onChange: setEmail,       icon: Mail,          type: 'email', placeholder: 'you@example.com' },
              { id: 'phone',      label: 'Phone Number',   value: phone,       onChange: setPhone,       icon: Phone,         type: 'tel',   placeholder: '+1 (555) 000-0000' },
              { id: 'location',   label: 'Location',       value: location,    onChange: setLocation,    icon: MapPin,        type: 'text',  placeholder: 'City, State' },
              { id: 'occupation', label: 'Occupation',     value: occupation,  onChange: setOccupation,  icon: Briefcase,     type: 'text',  placeholder: 'Your profession' },
              { id: 'education',  label: 'Education',      value: education,   onChange: setEducation,   icon: GraduationCap, type: 'text',  placeholder: 'School or university' },
            ].map(({ id, label, value, onChange, icon: Icon, type, placeholder }) => (
              <div key={id}>
                <label htmlFor={id} className="block text-sm font-semibold mb-1.5" style={{ color: colors.textPrimary }}>{label}</label>
                <div className="relative">
                  <Icon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: colors.textTertiary }} aria-hidden />
                  <input
                    id={id} type={type} value={value} placeholder={placeholder}
                    onChange={e => onChange(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 rounded-xl text-sm outline-none"
                    style={inputStyle}
                  />
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── Bio ───────────────────────────────────────────────────── */}
        <section aria-labelledby="bio-heading">
          <h2 id="bio-heading" className="text-lg font-semibold mb-3" style={{ color: colors.textPrimary }}>Bio</h2>
          <div className="rounded-xl p-5" style={cardStyle}>
            <label htmlFor="bio" className="block text-sm font-semibold mb-2" style={{ color: colors.textPrimary }}>About You</label>
            <textarea
              id="bio" value={bio} onChange={e => setBio(e.target.value)}
              placeholder="Tell others about yourself and your sign language journey..."
              rows={4} maxLength={500}
              className="w-full px-4 py-3 rounded-xl text-sm resize-none outline-none"
              style={inputStyle}
            />
            <p className="text-xs mt-1 text-right" style={{ color: colors.textTertiary }}>{bio.length}/500</p>
          </div>
        </section>

        {/* ── Learning Goals ─────────────────────────────────────────── */}
        <section aria-labelledby="goals-heading">
          <h2 id="goals-heading" className="text-lg font-semibold mb-3" style={{ color: colors.textPrimary }}>Learning Goals</h2>
          <div className="rounded-xl p-5" style={cardStyle}>
            <div className="space-y-2 mb-4">
              {learningGoals.map((goal, i) => (
                <div key={i} className="flex items-start gap-3 p-3 rounded-lg" style={{ background: colors.cardHover }}>
                  <Target className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: colors.iconColor }} aria-hidden />
                  <span className="flex-1 text-sm" style={{ color: colors.textPrimary }}>{goal}</span>
                  <button onClick={() => handleRemoveGoal(i)} style={{ color: colors.errorColor }} aria-label={`Remove: ${goal}`}>
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
              {learningGoals.length === 0 && (
                <p className="text-sm text-center py-3" style={{ color: colors.textTertiary }}>No goals yet — add one below</p>
              )}
            </div>
            <div className="flex gap-2">
              <input
                type="text" value={newGoal} onChange={e => setNewGoal(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleAddGoal()}
                placeholder="Add a new learning goal…"
                className="flex-1 px-4 py-3 rounded-xl text-sm outline-none"
                style={inputStyle}
                aria-label="New learning goal"
              />
              <Button
                onClick={handleAddGoal} disabled={!newGoal.trim()}
                className="h-12 px-5 rounded-xl font-semibold disabled:opacity-40"
                style={{ background: colors.iconColor, color: theme === 'dark' ? 'var(--color-bg-deep)' : '#fff' }}
              >Add</Button>
            </div>
          </div>
        </section>

        {/* ── Privacy Settings ──────────────────────────────────────── */}
        <section aria-labelledby="privacy-heading">
          <h2 id="privacy-heading" className="text-lg font-semibold mb-3" style={{ color: colors.textPrimary }}>Privacy Settings</h2>
          <div className="rounded-xl p-5" style={cardStyle}>

            {/* Profile visibility */}
            <p className="text-sm font-semibold mb-3" style={{ color: colors.textPrimary }}>Profile Visibility</p>
            <div className="space-y-2 mb-6" role="radiogroup" aria-label="Profile visibility">
              {([
                { value: 'public',  label: 'Public',       desc: 'Anyone can see your profile',        icon: Globe },
                { value: 'friends', label: 'Friends Only', desc: 'Only your friends can see you',       icon: Users },
                { value: 'private', label: 'Private',      desc: 'Only you can see your profile',       icon: Lock },
              ] as const).map(({ value, label, desc, icon: Icon }) => {
                const sel = profileVisibility === value;
                return (
                  <button
                    key={value}
                    onClick={() => setProfileVisibility(value)}
                    className="w-full rounded-lg p-3 text-left"
                    style={{ background: sel ? colors.iconBg : colors.cardHover, border: sel ? `2px solid ${colors.iconColor}` : 'none' }}
                    role="radio" aria-checked={sel} aria-label={`${label}, ${desc}`}
                  >
                    <div className="flex items-center gap-3">
                      <Icon className="w-5 h-5" style={{ color: sel ? colors.iconColor : colors.textSecondary }} aria-hidden />
                      <div className="flex-1">
                        <p className="font-semibold text-sm" style={{ color: colors.textPrimary }}>{label}</p>
                        <p className="text-xs" style={{ color: colors.textSecondary }}>{desc}</p>
                      </div>
                      {sel && <Check className="w-4 h-4" style={{ color: colors.iconColor }} />}
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Toggle rows */}
            {[
              { label: 'Show Email on Profile',         value: showEmail,           onChange: setShowEmail,           icon: Mail,          desc: 'Display email publicly' },
              { label: 'Show Phone on Profile',         value: showPhone,           onChange: setShowPhone,           icon: Phone,         desc: 'Display phone publicly' },
              { label: 'Show Learning Progress',        value: showProgress,        onChange: setShowProgress,        icon: TrendingUp,    desc: 'Others can see your stats' },
              { label: 'Show Streak Counter',           value: showStreak,          onChange: setShowStreak,          icon: Target,        desc: 'Show streak on your profile' },
              { label: 'Show Badges & Achievements',    value: showBadges,          onChange: setShowBadges,          icon: Award,         desc: 'Display your earned badges' },
              { label: 'Show Recent Activity',          value: showActivity,        onChange: setShowActivity,        icon: Heart,         desc: 'Others can see what you\'ve practiced' },
              { label: 'Allow Direct Messages',         value: allowMessages,       onChange: setAllowMessages,       icon: MessageCircle, desc: 'Let others message you' },
              { label: 'Allow Friend Requests',         value: allowFriendRequests, onChange: setAllowFriendRequests, icon: Users,         desc: 'Let others add you as friend' },
              { label: 'Show on Leaderboard',           value: showOnLeaderboard,   onChange: setShowOnLeaderboard,   icon: TrendingUp,    desc: 'Appear in global rankings' },
              { label: 'Allow Tagging in Posts',        value: allowTagging,        onChange: setAllowTagging,        icon: AtSign,        desc: 'Let others tag you in posts' },
            ].map(({ label, value, onChange, icon: Icon, desc }) => (
              <div key={label} className="flex items-center justify-between py-3 border-t" style={{ borderTopColor: colors.border }}>
                <div className="flex items-center gap-3 flex-1 mr-4">
                  <Icon className="w-4 h-4 flex-shrink-0" style={{ color: colors.textSecondary }} aria-hidden />
                  <div>
                    <p className="text-sm font-semibold" style={{ color: colors.textPrimary }}>{label}</p>
                    <p className="text-xs" style={{ color: colors.textTertiary }}>{desc}</p>
                  </div>
                </div>
                <button
                  onClick={() => onChange(!value)}
                  className="relative w-12 h-6 rounded-full transition-colors flex-shrink-0"
                  style={{ background: value ? colors.iconColor : 'rgba(148,163,184,0.3)' }}
                  role="switch" aria-checked={value} aria-label={label}
                >
                  <div
                    className="absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white transition-transform"
                    style={{ transform: value ? 'translateX(24px)' : 'translateX(0)' }}
                  />
                </button>
              </div>
            ))}
          </div>
        </section>

        {/* ── Share Profile ─────────────────────────────────────────── */}
        <section aria-labelledby="share-heading" className="pb-6">
          <h2 id="share-heading" className="text-lg font-semibold mb-3" style={{ color: colors.textPrimary }}>Share Profile</h2>
          <div className="rounded-xl p-5" style={cardStyle}>
            {/* Profile URL */}
            <p className="text-sm font-semibold mb-2" style={{ color: colors.textPrimary }}>Your Profile URL</p>
            <div
              className="px-4 py-3 rounded-xl text-sm mb-3 break-all"
              style={{ background: colors.cardHover, color: colors.textSecondary }}
            >
              {profileUrl}
            </div>
            <Button
              onClick={handleCopyLink}
              className="w-full h-11 rounded-xl font-semibold mb-5"
              style={{
                background: copySuccess ? 'rgba(34,197,94,0.15)' : colors.iconBg,
                color: copySuccess ? colors.successColor : colors.iconColor,
              }}
              aria-label={copySuccess ? 'Copied!' : 'Copy profile link'}
            >
              {copySuccess ? <><CheckCircle className="w-4 h-4 mr-2" />Copied!</> : <><Copy className="w-4 h-4 mr-2" />Copy Link</>}
            </Button>

            {/* Share via */}
            <p className="text-sm font-semibold mb-3" style={{ color: colors.textPrimary }}>Share Via</p>
            <div className="grid grid-cols-2 gap-3">
              {[
                { id: 'facebook',  label: 'Facebook',  icon: Facebook,       color: '#1877F2' },
                { id: 'twitter',   label: 'Twitter/X', icon: Twitter,        color: '#1DA1F2' },
                { id: 'whatsapp',  label: 'WhatsApp',  icon: MessageCircle,  color: '#25D366' },
                { id: 'qr',        label: 'QR Code',   icon: QrCode,         color: colors.iconColor },
              ].map(({ id, label, icon: Icon, color }) => (
                <button
                  key={id}
                  onClick={() => id === 'qr' ? setShowQrModal(true) : handleShareToSocial(id)}
                  className="flex items-center justify-center gap-2 p-4 rounded-xl transition-colors"
                  style={{ background: colors.cardHover }}
                  onMouseEnter={e => (e.currentTarget.style.background = colors.iconBg)}
                  onMouseLeave={e => (e.currentTarget.style.background = colors.cardHover)}
                  aria-label={`Share on ${label}`}
                >
                  <Icon className="w-5 h-5" style={{ color }} aria-hidden />
                  <span className="font-semibold text-sm" style={{ color: colors.textPrimary }}>{label}</span>
                </button>
              ))}
            </div>

            {/* Native share (mobile) */}
            {typeof navigator !== 'undefined' && 'share' in navigator && (
              <button
                onClick={() => handleShareToSocial('native')}
                className="w-full mt-3 flex items-center justify-center gap-2 p-4 rounded-xl"
                style={{ background: colors.iconBg, color: colors.iconColor }}
                aria-label="Share via native share sheet"
              >
                <Share2 className="w-5 h-5" />
                <span className="font-semibold text-sm">Share…</span>
              </button>
            )}
          </div>
        </section>
      </div>

      {/* ── QR Code Modal ─────────────────────────────────────────────── */}
      <AnimatePresence>
        {showQrModal && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50"
            onClick={() => setShowQrModal(false)}
            role="dialog" aria-labelledby="qr-title" aria-modal
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
              onClick={e => e.stopPropagation()}
              className="rounded-2xl p-6 max-w-xs w-full"
              style={{ background: colors.cardBg, backdropFilter: colors.blur, WebkitBackdropFilter: colors.blur }}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 id="qr-title" className="text-lg font-semibold" style={{ color: colors.textPrimary }}>
                  Scan to View Profile
                </h3>
                <Button variant="ghost" size="icon" onClick={() => setShowQrModal(false)} aria-label="Close">
                  <X className="w-5 h-5" />
                </Button>
              </div>

              {/* Real QR code */}
              <div className="aspect-square rounded-xl flex items-center justify-center mb-4 overflow-hidden"
                style={{ background: '#F8FAFC' }}>
                {qrDataUrl ? (
                  <img src={qrDataUrl} alt={`QR code for ${profileUrl}`} className="w-full h-full object-contain p-2" />
                ) : (
                  <div className="flex flex-col items-center gap-2">
                    <Loader2 className="w-10 h-10 animate-spin" style={{ color: colors.iconColor }} />
                    <p className="text-sm" style={{ color: colors.textSecondary }}>Generating…</p>
                  </div>
                )}
              </div>

              <p className="text-xs text-center mb-4 break-all" style={{ color: colors.textSecondary }}>{profileUrl}</p>

              <Button
                onClick={handleCopyLink}
                className="w-full h-11 rounded-xl font-semibold"
                style={{ background: colors.iconColor, color: theme === 'dark' ? 'var(--color-bg-deep)' : '#fff' }}
              >
                <Copy className="w-4 h-4 mr-2" />
                {copySuccess ? 'Copied!' : 'Copy Link'}
              </Button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
