// Core React imports
import React, { lazy, Suspense, useState } from 'react';
// Context hooks
import { useApp } from '../context/AppContext';
import { useTheme } from '../context/ThemeContext';
// Data imports
import { lessons, quickActions, signs } from '../data/lessons';
// Animation
import { motion, AnimatePresence } from 'motion/react';
// UI Components
import { 
  Hand, 
  Bell, 
  Settings, 
  Sun, 
  Moon, 
  Target, 
  Scan, 
  Brain, 
  BarChart3, 
  Crown, 
  Lock, 
  Play, 
  ChevronLeft, 
  ChevronRight, 
  Sparkles,
  ShoppingBag,
} from 'lucide-react';
import { NotificationsPanel } from './NotificationsPanel';
import { BottomNavigation } from './BottomNavigation';

// Lazy-loaded screens — only fetched when first opened
const ConversationScenarios = lazy(() => import('./ConversationScenarios').then(m => ({ default: m.ConversationScenarios })));
const VoiceToSignTranslation = lazy(() => import('./VoiceToSignTranslation').then(m => ({ default: m.VoiceToSignTranslation })));
const DeafCommunityEvents = lazy(() => import('./DeafCommunityEvents').then(m => ({ default: m.DeafCommunityEvents })));
const AchievementsBadges = lazy(() => import('./AchievementsBadges').then(m => ({ default: m.AchievementsBadges })));
const LearningPathRoadmap = lazy(() => import('./LearningPathRoadmap').then(m => ({ default: m.LearningPathRoadmap })));
const LanguageSelection = lazy(() => import('./LanguageSelection').then(m => ({ default: m.LanguageSelection })));
const PersonalizationPreferences = lazy(() => import('./PersonalizationPreferences').then(m => ({ default: m.PersonalizationPreferences })));
const AccessibilitySettings = lazy(() => import('./AccessibilitySettings').then(m => ({ default: m.AccessibilitySettings })));
const TutorialHelpCenter = lazy(() => import('./TutorialHelpCenter').then(m => ({ default: m.TutorialHelpCenter })));
const CameraARSettings = lazy(() => import('./CameraARSettings').then(m => ({ default: m.CameraARSettings })));
const FeedbackSupport = lazy(() => import('./FeedbackSupport').then(m => ({ default: m.FeedbackSupport })));
const ProfileCustomization = lazy(() => import('./ProfileCustomization').then(m => ({ default: m.ProfileCustomization })));
const NotificationsCenter = lazy(() => import('./NotificationsCenter').then(m => ({ default: m.NotificationsCenter })));
const SettingsHub = lazy(() => import('./SettingsHub').then(m => ({ default: m.SettingsHub })));
const ARPlacementMode = lazy(() => import('./ARPlacementMode').then(m => ({ default: m.ARPlacementMode })));
const ContextAwareDashboard = lazy(() => import('./ContextAwareDashboard').then(m => ({ default: m.ContextAwareDashboard })));
const ARPracticeMirror = lazy(() => import('./ARPracticeMirror').then(m => ({ default: m.ARPracticeMirror })));
const AvatarInstructorSettings = lazy(() => import('./AvatarInstructorSettings').then(m => ({ default: m.AvatarInstructorSettings })));
const SpatialGrammarVisualization = lazy(() => import('./SpatialGrammarVisualization').then(m => ({ default: m.SpatialGrammarVisualization })));
const HandTrackingPractice = lazy(() => import('./HandTrackingPractice').then(m => ({ default: m.HandTrackingPractice })));
const DeafCultureEducation = lazy(() => import('./DeafCultureEducation').then(m => ({ default: m.DeafCultureEducation })));
const InterpreterMode = lazy(() => import('./InterpreterMode').then(m => ({ default: m.InterpreterMode })));
const EmergencySigns = lazy(() => import('./EmergencySigns').then(m => ({ default: m.EmergencySigns })));
const ChallengesHub = lazy(() => import('./ChallengesHub').then(m => ({ default: m.ChallengesHub })));
const OfflineModeManager = lazy(() => import('./OfflineModeManager').then(m => ({ default: m.OfflineModeManager })));
const ParentTeacherDashboard = lazy(() => import('./ParentTeacherDashboard').then(m => ({ default: m.ParentTeacherDashboard })));
const ReferralProgram = lazy(() => import('./ReferralProgram').then(m => ({ default: m.ReferralProgram })));
const DailyStreaksRewards = lazy(() => import('./DailyStreaksRewards').then(m => ({ default: m.DailyStreaksRewards })));
const PracticeHistory = lazy(() => import('./PracticeHistory').then(m => ({ default: m.PracticeHistory })));
const SignDictionary = lazy(() => import('./SignDictionary').then(m => ({ default: m.SignDictionary })));
const ARSceneCreator = lazy(() => import('./ARSceneCreator').then(m => ({ default: m.ARSceneCreator })));
const StreakRecovery = lazy(() => import('./StreakRecovery').then(m => ({ default: m.StreakRecovery })));
const SkillAssessment = lazy(() => import('./SkillAssessment').then(m => ({ default: m.SkillAssessment })));
const ChallengesCalendar = lazy(() => import('./ChallengesCalendar').then(m => ({ default: m.ChallengesCalendar })));
const Button = lazy(() => import('./ui/button').then(m => ({ default: m.Button })));
const LessonDetailScreen = lazy(() => import('./LessonDetailScreen').then(m => ({ default: m.LessonDetailScreen })));
const DailyPracticeSession = lazy(() => import('./DailyPracticeSession').then(m => ({ default: m.DailyPracticeSession })));
const VocabularyTaggingFlow = lazy(() => import('./VocabularyTaggingFlow').then(m => ({ default: m.VocabularyTaggingFlow })));
const SocialPracticeRoom = lazy(() => import('./SocialPracticeRoom').then(m => ({ default: m.SocialPracticeRoom })));
const ARScavengerHunt = lazy(() => import('./ARScavengerHunt').then(m => ({ default: m.ARScavengerHunt })));
const PaywallScreen = lazy(() => import('./PaywallScreen').then(m => ({ default: m.PaywallScreen })));
const SubscriptionManagement = lazy(() => import('./SubscriptionManagement').then(m => ({ default: m.SubscriptionManagement })));
const ShopScreen = lazy(() => import('./ShopScreen').then(m => ({ default: m.ShopScreen })));
const LessonLibrary = lazy(() => import('./LessonLibrary').then(m => ({ default: m.LessonLibrary })));
const VocabularyReview = lazy(() => import('./VocabularyReview').then(m => ({ default: m.VocabularyReview })));
const GrammarLessonsScreen = lazy(() => import('./GrammarLessonsScreen').then(m => ({ default: m.GrammarLessonsScreen })));
const FingerspellingPractice = lazy(() => import('./FingerspellingPractice').then(m => ({ default: m.FingerspellingPractice })));
const StoryMode = lazy(() => import('./StoryMode').then(m => ({ default: m.StoryMode })));
const VideoLibrary = lazy(() => import('./VideoLibrary').then(m => ({ default: m.VideoLibrary })));
const CertificationCenter = lazy(() => import('./CertificationCenter').then(m => ({ default: m.CertificationCenter })));
const CourseCertificate = lazy(() => import('./CourseCertificate').then(m => ({ default: m.CourseCertificate })));
const CommunityFeed = lazy(() => import('./CommunityFeed').then(m => ({ default: m.CommunityFeed })));
const FriendsConnections = lazy(() => import('./FriendsConnections').then(m => ({ default: m.FriendsConnections })));
const LiveClassSchedule = lazy(() => import('./LiveClassSchedule').then(m => ({ default: m.LiveClassSchedule })));
const MessagingChat = lazy(() => import('./MessagingChat').then(m => ({ default: m.MessagingChat })));
const Leaderboards = lazy(() => import('./Leaderboards').then(m => ({ default: m.Leaderboards })));
const ProgressDashboard = lazy(() => import('./ProgressDashboard').then(m => ({ default: m.ProgressDashboard })));
const DetailedAnalytics = lazy(() => import('./DetailedAnalytics').then(m => ({ default: m.DetailedAnalytics })));

const ScreenFallback = () => (
  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
    <div style={{ width: 32, height: 32, border: '3px solid var(--color-primary, var(--color-brand))', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.7s linear infinite' }} />
  </div>
);
const LazyScreen = ({ children }: { children: React.ReactNode }) => (
  <Suspense fallback={<ScreenFallback />}>{children}</Suspense>
);

export function HomeScreen() {
  const { userProgress, selectedLanguage } = useApp();
  const { theme, toggleTheme } = useTheme();
  const [selectedLesson, setSelectedLesson] = useState<string | null>(null);
  const [showNotifications, setShowNotifications] = useState(false);
  const [carouselIndex, setCarouselIndex] = useState(0);
  const [showUpgrade, setShowUpgrade] = useState(false);
  const [paywallView, setPaywallView] = useState<'comparison' | 'daily-limit' | 'trial' | 'family'>('comparison');
  const [showPracticeSession, setShowPracticeSession] = useState(false);
  const [showVocabularyTagging, setShowVocabularyTagging] = useState(false);
  const [showSocialPractice, setShowSocialPractice] = useState(false);
  const [showScavengerHunt, setShowScavengerHunt] = useState(false);
  const [showSubscriptionManagement, setShowSubscriptionManagement] = useState(false);
  const [showShop, setShowShop] = useState(false);
  const [showLessonLibrary, setShowLessonLibrary] = useState(false);
  const [showVocabularyReview, setShowVocabularyReview] = useState(false);
  const [showGrammarLessons, setShowGrammarLessons] = useState(false);
  const [showFingerspelling, setShowFingerspelling] = useState(false);
  const [showStoryMode, setShowStoryMode] = useState(false);
  const [activeTab, setActiveTab] = useState<'home' | 'learn' | 'camera' | 'social' | 'profile'>('home');
  const [showAllQuickActions, setShowAllQuickActions] = useState(false);
  const [showVideoLibrary, setShowVideoLibrary] = useState(false);
  const [showCertificationCenter, setShowCertificationCenter] = useState(false);
  const [showCourseCertificates, setShowCourseCertificates] = useState(false);
  const [showCommunityFeed, setShowCommunityFeed] = useState(false);
  const [showFriendsConnections, setShowFriendsConnections] = useState(false);
  const [showLiveClassSchedule, setShowLiveClassSchedule] = useState(false);
  const [showMessagingChat, setShowMessagingChat] = useState(false);
  const [showLeaderboards, setShowLeaderboards] = useState(false);
  const [showProgressDashboard, setShowProgressDashboard] = useState(false);
  const [showDetailedAnalytics, setShowDetailedAnalytics] = useState(false);
  const [showLearningPathRoadmap, setShowLearningPathRoadmap] = useState(false);
  const [showLanguageSelection, setShowLanguageSelection] = useState(false);
  const [showPersonalizationPreferences, setShowPersonalizationPreferences] = useState(false);
  const [showAccessibilitySettings, setShowAccessibilitySettings] = useState(false);
  const [showTutorialHelpCenter, setShowTutorialHelpCenter] = useState(false);
  const [showCameraARSettings, setShowCameraARSettings] = useState(false);
  const [showFeedbackSupport, setShowFeedbackSupport] = useState(false);
  const [showProfileCustomization, setShowProfileCustomization] = useState(false);
  const [showNotificationsCenter, setShowNotificationsCenter] = useState(false);
  const [showSettingsHub, setShowSettingsHub] = useState(false);
  const [showARPlacementMode, setShowARPlacementMode] = useState(false);
  const [showContextAwareDashboard, setShowContextAwareDashboard] = useState(false);
  const [showARPracticeMirror, setShowARPracticeMirror] = useState(false);
  const [showAvatarInstructorSettings, setShowAvatarInstructorSettings] = useState(false);
  const [showSpatialGrammarVisualization, setShowSpatialGrammarVisualization] = useState(false);
  const [showHandTrackingPractice, setShowHandTrackingPractice] = useState(false);
  const [showDeafCultureEducation, setShowDeafCultureEducation] = useState(false);
  const [showInterpreterMode, setShowInterpreterMode] = useState(false);
  const [showEmergencySigns, setShowEmergencySigns] = useState(false);
  const [showChallengesHub, setShowChallengesHub] = useState(false);
  const [showOfflineModeManager, setShowOfflineModeManager] = useState(false);
  const [showParentTeacherDashboard, setShowParentTeacherDashboard] = useState(false);
  const [showReferralProgram, setShowReferralProgram] = useState(false);
  const [showDailyStreaksRewards, setShowDailyStreaksRewards] = useState(false);
  const [showPracticeHistory, setShowPracticeHistory] = useState(false);
  const [showSignDictionary, setShowSignDictionary] = useState(false);
  const [showARSceneCreator, setShowARSceneCreator] = useState(false);
  const [showStreakRecovery, setShowStreakRecovery] = useState(false);
  const [showSkillAssessment, setShowSkillAssessment] = useState(false);
  const [showChallengesCalendar, setShowChallengesCalendar] = useState(false);
  const [showConversationScenarios, setShowConversationScenarios] = useState(false);
  const [showVoiceToSignTranslation, setShowVoiceToSignTranslation] = useState(false);
  const [showDeafCommunityEvents, setShowDeafCommunityEvents] = useState(false);
  const [showAchievementsBadges, setShowAchievementsBadges] = useState(false);

  if (selectedLesson) {
    const lesson = lessons.find(l => l.id === selectedLesson);
    if (lesson) {
      return <LessonDetailScreen lesson={lesson} onBack={() => setSelectedLesson(null)} />;
    }
  }

  // Show practice session
  if (showPracticeSession) {
    // Get 5 random signs for daily practice
    const dailyPracticeSigns = signs.slice(0, 5);
    return (
      <LazyScreen><DailyPracticeSession 
        signs={dailyPracticeSigns}
        onComplete={() => {
          setShowPracticeSession(false);
          // Update user progress here if needed
        }}
        onExit={() => setShowPracticeSession(false)}
      />
      </LazyScreen>
    );
  }

  // Show vocabulary tagging flow
  if (showVocabularyTagging) {
    return (
      <LazyScreen><VocabularyTaggingFlow
        onExit={() => { setShowVocabularyTagging(false); setActiveTab('home'); }}
      />
      </LazyScreen>
    );
  }

  // Show social practice room
  if (showSocialPractice) {
    return (
      <LazyScreen><SocialPracticeRoom 
        onExit={() => setShowSocialPractice(false)}
      />
      </LazyScreen>
    );
  }

  // Show AR scavenger hunt
  if (showScavengerHunt) {
    return (
      <LazyScreen><ARScavengerHunt 
        onExit={() => setShowScavengerHunt(false)}
      />
      </LazyScreen>
    );
  }

  // Show paywall/upgrade screen
  if (showUpgrade) {
    return (
      <LazyScreen><PaywallScreen 
        onExit={() => setShowUpgrade(false)}
        initialView={paywallView}
      />
      </LazyScreen>
    );
  }

  // Show subscription management screen
  if (showSubscriptionManagement) {
    return (
      <LazyScreen><SubscriptionManagement 
        onExit={() => setShowSubscriptionManagement(false)}
      />
      </LazyScreen>
    );
  }

  // Show shop screen
  if (showShop) {
    return (
      <LazyScreen><ShopScreen 
        onExit={() => setShowShop(false)}
      />
      </LazyScreen>
    );
  }

  // Show lesson library screen
  if (showLessonLibrary) {
    return (
      <LazyScreen><LessonLibrary
        onExit={() => { setShowLessonLibrary(false); setActiveTab('home'); }}
        onUpgrade={() => {
          setShowLessonLibrary(false);
          setActiveTab('home');
          setShowUpgrade(true);
        }}
      />
      </LazyScreen>
    );
  }

  // Show vocabulary review screen
  if (showVocabularyReview) {
    return (
      <LazyScreen><VocabularyReview 
        onExit={() => setShowVocabularyReview(false)}
      />
      </LazyScreen>
    );
  }

  // Show grammar lessons screen
  if (showGrammarLessons) {
    return (
      <LazyScreen><GrammarLessonsScreen 
        onExit={() => setShowGrammarLessons(false)}
        onUpgrade={() => {
          setShowGrammarLessons(false);
          setShowUpgrade(true);
        }}
      />
      </LazyScreen>
    );
  }

  // Show fingerspelling practice screen
  if (showFingerspelling) {
    return (
      <LazyScreen><FingerspellingPractice 
        onExit={() => setShowFingerspelling(false)}
      />
      </LazyScreen>
    );
  }

  // Show story mode screen
  if (showStoryMode) {
    return (
      <LazyScreen><StoryMode 
        onExit={() => setShowStoryMode(false)}
        onUpgrade={() => {
          setShowStoryMode(false);
          setShowUpgrade(true);
        }}
      />
      </LazyScreen>
    );
  }

  // Show video library screen
  if (showVideoLibrary) {
    return (
      <LazyScreen><VideoLibrary 
        onExit={() => setShowVideoLibrary(false)}
        onUpgrade={() => {
          setShowVideoLibrary(false);
          setShowUpgrade(true);
        }}
      />
      </LazyScreen>
    );
  }

  // Show certification center screen
  if (showCertificationCenter) {
    return (
      <LazyScreen><CertificationCenter 
        onExit={() => setShowCertificationCenter(false)}
      />
      </LazyScreen>
    );
  }

  // Show course certificates screen
  if (showCourseCertificates) {
    return (
      <LazyScreen><CourseCertificate 
        onExit={() => setShowCourseCertificates(false)}
      />
      </LazyScreen>
    );
  }

  // Show community feed screen
  if (showCommunityFeed) {
    return (
      <LazyScreen><CommunityFeed
        onExit={() => { setShowCommunityFeed(false); setActiveTab('home'); }}
      />
      </LazyScreen>
    );
  }

  // Show friends connections screen
  if (showFriendsConnections) {
    return (
      <LazyScreen><FriendsConnections 
        onExit={() => setShowFriendsConnections(false)}
      />
      </LazyScreen>
    );
  }

  // Show live class schedule screen
  if (showLiveClassSchedule) {
    return (
      <LazyScreen><LiveClassSchedule 
        onExit={() => setShowLiveClassSchedule(false)}
      />
      </LazyScreen>
    );
  }

  // Show messaging chat screen
  if (showMessagingChat) {
    return (
      <LazyScreen><MessagingChat 
        onExit={() => setShowMessagingChat(false)}
      />
      </LazyScreen>
    );
  }

  // Show leaderboards screen
  if (showLeaderboards) {
    return (
      <LazyScreen><Leaderboards 
        onExit={() => setShowLeaderboards(false)}
      />
      </LazyScreen>
    );
  }

  // Show progress dashboard screen
  if (showProgressDashboard) {
    return (
      <LazyScreen><ProgressDashboard 
        onExit={() => setShowProgressDashboard(false)}
      />
      </LazyScreen>
    );
  }

  // Show detailed analytics screen
  if (showDetailedAnalytics) {
    return (
      <LazyScreen><DetailedAnalytics 
        onExit={() => setShowDetailedAnalytics(false)}
      />
      </LazyScreen>
    );
  }

  // Show learning path roadmap screen
  if (showLearningPathRoadmap) {
    return (
      <LazyScreen><LearningPathRoadmap 
        onExit={() => setShowLearningPathRoadmap(false)}
      />
      </LazyScreen>
    );
  }

  // Show language selection screen
  if (showLanguageSelection) {
    return (
      <LazyScreen><LanguageSelection 
        onExit={() => setShowLanguageSelection(false)}
      />
      </LazyScreen>
    );
  }

  // Show personalization preferences screen
  if (showPersonalizationPreferences) {
    return (
      <LazyScreen><PersonalizationPreferences 
        onExit={() => setShowPersonalizationPreferences(false)}
      />
      </LazyScreen>
    );
  }

  // Show accessibility settings screen
  if (showAccessibilitySettings) {
    return (
      <LazyScreen><AccessibilitySettings 
        onExit={() => setShowAccessibilitySettings(false)}
      />
      </LazyScreen>
    );
  }

  // Show tutorial help center screen
  if (showTutorialHelpCenter) {
    return (
      <LazyScreen><TutorialHelpCenter 
        onExit={() => setShowTutorialHelpCenter(false)}
      />
      </LazyScreen>
    );
  }

  // Show camera AR settings screen
  if (showCameraARSettings) {
    return (
      <LazyScreen><CameraARSettings 
        onExit={() => setShowCameraARSettings(false)}
      />
      </LazyScreen>
    );
  }

  // Show feedback support screen
  if (showFeedbackSupport) {
    return (
      <LazyScreen><FeedbackSupport 
        onExit={() => setShowFeedbackSupport(false)}
      />
      </LazyScreen>
    );
  }

  // Show profile customization screen
  if (showProfileCustomization) {
    return (
      <LazyScreen><ProfileCustomization
        onExit={() => { setShowProfileCustomization(false); setActiveTab('home'); }}
      />
      </LazyScreen>
    );
  }

  // Show notifications center screen
  if (showNotificationsCenter) {
    return (
      <LazyScreen><NotificationsCenter
        onExit={() => setShowNotificationsCenter(false)}
        onNavigate={(screen) => {
          setShowNotificationsCenter(false);
          if (screen === 'friends')       setShowFriendsConnections(true);
          else if (screen === 'achievements') setShowAchievementsBadges(true);
          else if (screen === 'streaks')  setShowDailyStreaksRewards(true);
          else if (screen === 'challenges') setShowChallengesHub(true);
          else if (screen === 'events')   setShowDeafCommunityEvents(true);
          else if (screen === 'messages') setShowMessagingChat(true);
          else if (screen === 'progress') setShowProgressDashboard(true);
          else if (screen === 'community') setShowCommunityFeed(true);
        }}
      />
      </LazyScreen>
    );
  }

  // Show settings hub screen
  if (showSettingsHub) {
    return (
      <LazyScreen><SettingsHub 
        onExit={() => setShowSettingsHub(false)}
        onNavigateToSubscription={() => {
          setShowSettingsHub(false);
          setShowSubscriptionManagement(true);
        }}
        onNavigateToLanguageSelection={() => {
          setShowSettingsHub(false);
          setShowLanguageSelection(true);
        }}
        onNavigateToAccessibility={() => {
          setShowSettingsHub(false);
          setShowAccessibilitySettings(true);
        }}
        onNavigateToNotifications={() => {
          setShowSettingsHub(false);
          setShowNotificationsCenter(true);
        }}
        onNavigateToProfile={() => {
          setShowSettingsHub(false);
          setShowProfileCustomization(true);
        }}
        onNavigateToCameraAR={() => {
          setShowSettingsHub(false);
          setShowCameraARSettings(true);
        }}
        onNavigateToFeedback={() => {
          setShowSettingsHub(false);
          setShowFeedbackSupport(true);
        }}
        onNavigateToTutorial={() => {
          setShowSettingsHub(false);
          setShowTutorialHelpCenter(true);
        }}
        onNavigateToPersonalization={() => {
          setShowSettingsHub(false);
          setShowPersonalizationPreferences(true);
        }}
      />
      </LazyScreen>
    );
  }

  // Show AR placement mode screen
  if (showARPlacementMode) {
    return (
      <LazyScreen><ARPlacementMode 
        onExit={() => setShowARPlacementMode(false)}
      />
      </LazyScreen>
    );
  }

  // Show context-aware dashboard screen
  if (showContextAwareDashboard) {
    return (
      <LazyScreen><ContextAwareDashboard 
        onExit={() => setShowContextAwareDashboard(false)}
      />
      </LazyScreen>
    );
  }

  // Show AR practice mirror screen
  if (showARPracticeMirror) {
    return (
      <LazyScreen><ARPracticeMirror 
        onExit={() => setShowARPracticeMirror(false)}
      />
      </LazyScreen>
    );
  }

  // Show avatar instructor settings screen
  if (showAvatarInstructorSettings) {
    return (
      <LazyScreen><AvatarInstructorSettings 
        onExit={() => setShowAvatarInstructorSettings(false)}
      />
      </LazyScreen>
    );
  }

  // Show spatial grammar visualization screen
  if (showSpatialGrammarVisualization) {
    return (
      <LazyScreen><SpatialGrammarVisualization 
        onExit={() => setShowSpatialGrammarVisualization(false)}
      />
      </LazyScreen>
    );
  }

  // Show hand tracking practice screen
  if (showHandTrackingPractice) {
    return (
      <LazyScreen><HandTrackingPractice 
        onExit={() => setShowHandTrackingPractice(false)}
      />
      </LazyScreen>
    );
  }

  // Show deaf culture education screen
  if (showDeafCultureEducation) {
    return (
      <LazyScreen><DeafCultureEducation 
        onExit={() => setShowDeafCultureEducation(false)}
      />
      </LazyScreen>
    );
  }

  // Show interpreter mode screen
  if (showInterpreterMode) {
    return (
      <LazyScreen><InterpreterMode 
        onExit={() => setShowInterpreterMode(false)}
      />
      </LazyScreen>
    );
  }

  // Show emergency signs screen
  if (showEmergencySigns) {
    return (
      <LazyScreen><EmergencySigns 
        onExit={() => setShowEmergencySigns(false)}
      />
      </LazyScreen>
    );
  }

  // Show challenges hub screen
  if (showChallengesHub) {
    return (
      <LazyScreen><ChallengesHub 
        onExit={() => setShowChallengesHub(false)}
      />
      </LazyScreen>
    );
  }

  // Show offline mode manager screen
  if (showOfflineModeManager) {
    return (
      <LazyScreen><OfflineModeManager 
        onExit={() => setShowOfflineModeManager(false)}
      />
      </LazyScreen>
    );
  }

  // Show parent teacher dashboard screen
  if (showParentTeacherDashboard) {
    return (
      <LazyScreen><ParentTeacherDashboard 
        onExit={() => setShowParentTeacherDashboard(false)}
      />
      </LazyScreen>
    );
  }

  // Show referral program screen
  if (showReferralProgram) {
    return (
      <LazyScreen><ReferralProgram 
        onExit={() => setShowReferralProgram(false)}
      />
      </LazyScreen>
    );
  }

  // Show daily streaks rewards screen
  if (showDailyStreaksRewards) {
    return (
      <LazyScreen><DailyStreaksRewards 
        onExit={() => setShowDailyStreaksRewards(false)}
      />
      </LazyScreen>
    );
  }

  // Show practice history screen
  if (showPracticeHistory) {
    return (
      <LazyScreen><PracticeHistory 
        onExit={() => setShowPracticeHistory(false)}
      />
      </LazyScreen>
    );
  }

  // Show sign dictionary screen
  if (showSignDictionary) {
    return (
      <LazyScreen><SignDictionary 
        onExit={() => setShowSignDictionary(false)}
      />
      </LazyScreen>
    );
  }

  // Show AR scene creator screen
  if (showARSceneCreator) {
    return (
      <LazyScreen><ARSceneCreator 
        onExit={() => setShowARSceneCreator(false)}
      />
      </LazyScreen>
    );
  }

  // Show streak recovery screen
  if (showStreakRecovery) {
    return (
      <LazyScreen><StreakRecovery 
        onExit={() => setShowStreakRecovery(false)}
      />
      </LazyScreen>
    );
  }

  // Show skill assessment screen
  if (showSkillAssessment) {
    return (
      <LazyScreen><SkillAssessment 
        onExit={() => setShowSkillAssessment(false)}
      />
      </LazyScreen>
    );
  }

  // Show challenges calendar screen
  if (showChallengesCalendar) {
    return (
      <LazyScreen><ChallengesCalendar 
        onExit={() => setShowChallengesCalendar(false)}
      />
      </LazyScreen>
    );
  }

  // Show conversation scenarios screen
  if (showConversationScenarios) {
    return (
      <LazyScreen><ConversationScenarios 
        onExit={() => setShowConversationScenarios(false)}
      />
      </LazyScreen>
    );
  }

  // Show voice to sign translation screen
  if (showVoiceToSignTranslation) {
    return (
      <LazyScreen><VoiceToSignTranslation 
        onExit={() => setShowVoiceToSignTranslation(false)}
      />
      </LazyScreen>
    );
  }

  // Show deaf community events screen
  if (showDeafCommunityEvents) {
    return (
      <LazyScreen><DeafCommunityEvents
        onExit={() => setShowDeafCommunityEvents(false)}
      />
      </LazyScreen>
    );
  }

  // Show achievements badges screen
  if (showAchievementsBadges) {
    return (
      <LazyScreen><AchievementsBadges
        onExit={() => setShowAchievementsBadges(false)}
      />
      </LazyScreen>
    );
  }

  const iconMap: { [key: string]: any } = {
    target: Target,
    scan: Scan,
    brain: Brain,
    chart: BarChart3,
  };

  // Featured content for carousel
  const featuredContent = [
    {
      id: 'grammar-lessons',
      title: 'ASL Grammar Mastery',
      subtitle: 'Learn real ASL grammar rules',
      duration: '25 min',
      difficulty: 'intermediate',
      color: 'from-purple-600 to-purple-800',
      isPremium: true,
      screen: 'grammar',
    },
    {
      id: 'ar-scavenger',
      title: 'AR Scavenger Hunt',
      subtitle: 'Find and learn signs in AR',
      duration: '20 min',
      difficulty: 'beginner',
      color: 'from-green-600 to-green-800',
      isPremium: false,
      screen: 'scavenger',
    },
    {
      id: 'vocabulary-review',
      title: 'Vocabulary Review',
      subtitle: 'Practice with spaced repetition',
      duration: '15 min',
      difficulty: 'all levels',
      color: 'from-orange-600 to-orange-800',
      isPremium: false,
      screen: 'vocabulary',
    },
    {
      id: 'social-practice',
      title: 'Social Practice Room',
      subtitle: 'Practice with other learners',
      duration: '30 min',
      difficulty: 'intermediate',
      color: 'from-blue-600 to-blue-800',
      isPremium: true,
      screen: 'social',
    },
    {
      id: 'lesson-library',
      title: 'Full Course Library',
      subtitle: '32 courses across 8 categories',
      duration: 'varies',
      difficulty: 'all levels',
      color: 'from-pink-600 to-pink-800',
      isPremium: false,
      screen: 'library',
    },
    {
      id: 'story-mode',
      title: 'Interactive Story Mode',
      subtitle: 'Learn through engaging narratives',
      duration: '35 min',
      difficulty: 'intermediate',
      color: 'from-indigo-600 to-indigo-800',
      isPremium: true,
      screen: 'story',
    },
    {
      id: 'deaf-culture',
      title: 'Deaf Culture Education',
      subtitle: 'Understand Deaf community values',
      duration: '20 min',
      difficulty: 'beginner',
      color: 'from-teal-600 to-teal-800',
      isPremium: false,
      screen: 'culture',
    },
    {
      id: 'emergency-signs',
      title: 'Emergency Signs',
      subtitle: 'Critical signs for emergencies',
      duration: '10 min',
      difficulty: 'beginner',
      color: 'from-red-600 to-red-800',
      isPremium: false,
      screen: 'emergency',
    },
    {
      id: 'fingerspelling',
      title: 'Fingerspelling Practice',
      subtitle: 'Master the ASL alphabet',
      duration: '15 min',
      difficulty: 'beginner',
      color: 'from-cyan-600 to-cyan-800',
      isPremium: false,
      screen: 'fingerspelling',
    },
    {
      id: 'sign-dictionary',
      title: 'Sign Dictionary',
      subtitle: 'Browse 200+ ASL signs',
      duration: 'self-paced',
      difficulty: 'all levels',
      color: 'from-amber-600 to-amber-800',
      isPremium: false,
      screen: 'dictionary',
    },
    {
      id: 'live-classes',
      title: 'Live ASL Classes',
      subtitle: 'Join expert-led sessions',
      duration: '60 min',
      difficulty: 'all levels',
      color: 'from-rose-600 to-rose-800',
      isPremium: true,
      screen: 'live-classes',
    },
    {
      id: 'certification',
      title: 'Certification Center',
      subtitle: 'Get certified in ASL',
      duration: '90 min',
      difficulty: 'advanced',
      color: 'from-violet-600 to-violet-800',
      isPremium: true,
      screen: 'certification',
    },
  ];

  const nextCarousel = () => {
    setCarouselIndex((prev) => (prev + 1) % featuredContent.length);
  };

  const prevCarousel = () => {
    setCarouselIndex((prev) => (prev - 1 + featuredContent.length) % featuredContent.length);
  };

  const handleStartFeaturedContent = () => {
    const currentContent = featuredContent[carouselIndex];
    
    // Check if premium content requires upgrade
    if (currentContent.isPremium && !userProgress.isPremium) {
      setPaywallView('comparison');
      setShowUpgrade(true);
      return;
    }

    // Navigate to the appropriate screen
    switch (currentContent.screen) {
      case 'grammar':
        setShowGrammarLessons(true);
        break;
      case 'scavenger':
        setShowScavengerHunt(true);
        break;
      case 'vocabulary':
        setShowVocabularyReview(true);
        break;
      case 'social':
        setShowSocialPractice(true);
        break;
      case 'library':
        setShowLessonLibrary(true);
        break;
      case 'story':
        setShowStoryMode(true);
        break;
      case 'culture':
        setShowDeafCultureEducation(true);
        break;
      case 'emergency':
        setShowEmergencySigns(true);
        break;
      case 'fingerspelling':
        setShowFingerspelling(true);
        break;
      case 'dictionary':
        setShowSignDictionary(true);
        break;
      case 'live-classes':
        setShowLiveClassSchedule(true);
        break;
      case 'certification':
        setShowCertificationCenter(true);
        break;
      default:
        break;
    }
  };

  // Theme-aware colors
  const colors = theme === 'dark'
    ? {
        bg: 'var(--color-bg-deep)',
        headerBg: 'var(--color-bg-elevated)',
        cardBg: 'var(--color-bg-card)',
        cardHover: '#252541',
        textPrimary: 'var(--color-text)',
        textSecondary: 'var(--color-text-muted)',
        textTertiary: '#64748B',
        border: 'rgba(148, 163, 184, 0.2)',
        iconBg: 'rgba(0, 245, 255, 0.1)',
        iconColor: 'var(--color-cyan)',
        progressGradient: 'linear-gradient(135deg, var(--color-cyan) 0%, #A78BFA 100%)',
        premiumGradient: 'linear-gradient(135deg, #F59E0B 0%, #FF6B9D 100%)',
        blur: 'none',
        shadow: 'none',
        glassBorder: 'none',
      }
    : {
        bg: 'linear-gradient(135deg, #E0F2FE 0%, #EDE9FE 50%, #FCE7F3 100%)',
        headerBg: 'rgba(255, 255, 255, 0.7)',
        cardBg: 'rgba(255, 255, 255, 0.6)',
        cardHover: 'rgba(255, 255, 255, 0.8)',
        textPrimary: '#0F172A',
        textSecondary: '#334155',
        textTertiary: '#64748B',
        border: 'rgba(255, 255, 255, 0.6)',
        iconBg: 'rgba(14, 165, 233, 0.12)',
        iconColor: '#0EA5E9',
        progressGradient: 'linear-gradient(135deg, #0EA5E9 0%, #8B5CF6 100%)',
        premiumGradient: 'linear-gradient(135deg, #F59E0B 0%, #EC4899 100%)',
        blur: 'blur(20px)',
        shadow: '0 8px 32px rgba(31, 38, 135, 0.15)',
        glassBorder: '1px solid rgba(255, 255, 255, 0.6)',
      };

  return (
    <div 
      className="h-full flex flex-col overflow-hidden"
      style={{ background: colors.bg, color: colors.textPrimary }}
      role="main"
      aria-labelledby="home-title"
    >
      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto pb-20">
        {/* Header */}
        <div 
          className="p-4 sm:p-6 pb-3 sm:pb-4 border-b" 
          style={{ 
            background: colors.headerBg, 
            borderBottomColor: colors.border,
            backdropFilter: colors.blur,
            WebkitBackdropFilter: colors.blur,
            boxShadow: theme === 'light' ? '0 4px 30px rgba(31, 38, 135, 0.1)' : 'none',
          }}
        >
          <div className="flex items-center justify-between mb-4 sm:mb-6">
            <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
              <div 
                className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl flex items-center justify-center flex-shrink-0"
                style={{ 
                  background: colors.iconColor,
                  boxShadow: theme === 'light' ? '0 4px 20px rgba(14, 165, 233, 0.3)' : '0 4px 20px rgba(0, 245, 255, 0.3)',
                }}
                aria-hidden="true"
              >
                <Hand className="w-5 h-5 sm:w-7 sm:h-7" style={{ color: theme === 'dark' ? 'var(--color-bg-deep)' : '#FFFFFF' }} />
              </div>
              <div className="min-w-0 flex-1">
                <h1 id="home-title" className="text-lg sm:text-2xl font-bold truncate" style={{ fontFamily: 'Poppins, sans-serif', color: colors.textPrimary }}>
                  Sign Learn AR
                </h1>
                <p className="text-xs sm:text-sm truncate" style={{ color: colors.textSecondary }}>{selectedLanguage} Learning</p>
              </div>
            </div>
            <div className="flex items-center gap-1 sm:gap-3 flex-shrink-0">
              <Button
                variant="ghost"
                size="icon"
                className="w-10 h-10 rounded-full"
                onClick={toggleTheme}
                aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
                style={{ color: colors.textSecondary, background: 'transparent' }}
                onMouseEnter={(e) => e.currentTarget.style.background = colors.iconBg}
                onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
              >
                {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="w-10 h-10 rounded-full"
                onClick={() => setShowShop(true)}
                aria-label="Shop"
                style={{ color: colors.textSecondary, background: 'transparent' }}
                onMouseEnter={(e) => e.currentTarget.style.background = colors.iconBg}
                onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
              >
                <ShoppingBag className="w-5 h-5" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="w-10 h-10 rounded-full"
                onClick={() => setShowNotificationsCenter(true)}
                aria-label="Notifications"
                style={{ color: colors.textSecondary, background: 'transparent' }}
                onMouseEnter={(e) => e.currentTarget.style.background = colors.iconBg}
                onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
              >
                <Bell className="w-5 h-5" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="w-10 h-10 rounded-full"
                onClick={() => setShowSettingsHub(true)}
                aria-label="Settings"
                style={{ color: colors.textSecondary, background: 'transparent' }}
                onMouseEnter={(e) => e.currentTarget.style.background = colors.iconBg}
                onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
              >
                <Settings className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="px-4 sm:px-6 pt-4 sm:pt-6">
          {/* Daily Progress Card */}
          {(() => {
            const dailyPct = userProgress.dailyGoal > 0
              ? Math.round((userProgress.todayProgress / userProgress.dailyGoal) * 100)
              : 0;
            return (
              <motion.div
                className="rounded-xl sm:rounded-2xl p-4 sm:p-5 mb-4 sm:mb-6 cursor-pointer"
                style={{ background: colors.progressGradient }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                onClick={() => setShowProgressDashboard(true)}
                role="button"
                aria-label="View progress dashboard"
              >
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h2 className="text-base sm:text-lg font-semibold" style={{ color: theme === 'dark' ? 'var(--color-bg-deep)' : '#FFFFFF' }}>Today's Progress</h2>
                    <p className="text-xs sm:text-sm" style={{ color: theme === 'dark' ? 'rgba(15, 15, 35, 0.8)' : 'rgba(255, 255, 255, 0.9)' }}>
                      {userProgress.todayProgress} of {userProgress.dailyGoal} signs
                    </p>
                  </div>
                  <div className="text-2xl sm:text-3xl font-bold" style={{ color: theme === 'dark' ? 'var(--color-bg-deep)' : '#FFFFFF' }}>
                    {dailyPct}%
                  </div>
                </div>
                <div
                  className="h-2 rounded-full overflow-hidden"
                  style={{ background: theme === 'dark' ? 'rgba(15, 15, 35, 0.3)' : 'rgba(255, 255, 255, 0.3)' }}
                  role="progressbar"
                  aria-valuenow={dailyPct}
                  aria-valuemin={0}
                  aria-valuemax={100}
                >
                  <motion.div
                    className="h-full"
                    style={{ background: theme === 'dark' ? 'var(--color-bg-deep)' : '#FFFFFF' }}
                    initial={{ width: 0 }}
                    animate={{ width: `${dailyPct}%` }}
                    transition={{ duration: 1, delay: 0.3 }}
                  />
                </div>
                <div className="flex items-center gap-4 mt-4 text-sm">
                  <button
                    className="flex items-center gap-2"
                    onClick={(e) => { e.stopPropagation(); setShowDailyStreaksRewards(true); }}
                    aria-label="View streak rewards"
                  >
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: theme === 'dark' ? 'rgba(15, 15, 35, 0.2)' : 'rgba(255, 255, 255, 0.2)' }}>
                      🔥
                    </div>
                    <div>
                      <div className="font-semibold" style={{ color: theme === 'dark' ? 'var(--color-bg-deep)' : '#FFFFFF' }}>{userProgress.currentStreak} Days</div>
                      <div className="text-xs" style={{ color: theme === 'dark' ? 'rgba(15, 15, 35, 0.7)' : 'rgba(255, 255, 255, 0.8)' }}>Current Streak</div>
                    </div>
                  </button>
                  <button
                    className="flex items-center gap-2"
                    onClick={(e) => { e.stopPropagation(); setShowDetailedAnalytics(true); }}
                    aria-label="View detailed analytics"
                  >
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: theme === 'dark' ? 'rgba(15, 15, 35, 0.2)' : 'rgba(255, 255, 255, 0.2)' }}>
                      ✓
                    </div>
                    <div>
                      <div className="font-semibold" style={{ color: theme === 'dark' ? 'var(--color-bg-deep)' : '#FFFFFF' }}>{userProgress.totalSigns} Signs</div>
                      <div className="text-xs" style={{ color: theme === 'dark' ? 'rgba(15, 15, 35, 0.7)' : 'rgba(255, 255, 255, 0.8)' }}>Total Learned</div>
                    </div>
                  </button>
                </div>
              </motion.div>
            );
          })()}
        </div>

        {/* Featured Content Carousel */}
        <div className="px-4 sm:px-6 mb-4 sm:mb-6">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-base sm:text-lg font-semibold" style={{ color: colors.textPrimary }}>Featured Content</h3>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setCarouselIndex((prev) => (prev - 1 + featuredContent.length) % featuredContent.length)}
                className="w-8 h-8 rounded-full hover:opacity-80 transition-opacity flex items-center justify-center"
                style={{
                  background: colors.cardBg,
                  backdropFilter: colors.blur,
                  WebkitBackdropFilter: colors.blur,
                  border: colors.glassBorder,
                  color: colors.textPrimary,
                }}
                aria-label="Previous featured content"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => setCarouselIndex((prev) => (prev + 1) % featuredContent.length)}
                className="w-8 h-8 rounded-full hover:opacity-80 transition-opacity flex items-center justify-center"
                style={{
                  background: colors.cardBg,
                  backdropFilter: colors.blur,
                  WebkitBackdropFilter: colors.blur,
                  border: colors.glassBorder,
                  color: colors.textPrimary,
                }}
                aria-label="Next featured content"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="relative overflow-hidden">
            <div className={`bg-gradient-to-br ${featuredContent[carouselIndex].color} rounded-2xl p-6 text-white transition-all duration-500`}>
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <Sparkles className="w-5 h-5" aria-hidden="true" />
                    <span className="text-xs uppercase tracking-wide opacity-90">Featured</span>
                    {featuredContent[carouselIndex].isPremium && (
                      <Crown className="w-4 h-4 text-yellow-300" aria-label="Premium content" />
                    )}
                  </div>
                  <h4 className="text-xl font-bold mb-1">{featuredContent[carouselIndex].title}</h4>
                  <p className="text-sm opacity-90">{featuredContent[carouselIndex].subtitle}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-4 mb-4 text-sm">
                <div className="flex items-center gap-1">
                  <span>{featuredContent[carouselIndex].duration}</span>
                </div>
                <span>•</span>
                <span className="capitalize">{featuredContent[carouselIndex].difficulty}</span>
              </div>

              <Button
                className="w-full bg-white text-black hover:bg-gray-100 h-12 rounded-full font-semibold"
                aria-label={`Start ${featuredContent[carouselIndex].title}`}
                onClick={handleStartFeaturedContent}
              >
                Start Learning
              </Button>
            </div>

            {/* Carousel Indicators */}
            <div 
              className="flex justify-center gap-2 mt-4" 
              role="tablist" 
              aria-label="Featured content carousel indicators"
            >
              {featuredContent.map((_, index) => (
                <button
                  key={`indicator-${index}`}
                  type="button"
                  onClick={() => setCarouselIndex(index)}
                  className="rounded-full transition-all hover:opacity-80 duration-300"
                  style={{
                    width: index === carouselIndex ? '24px' : '8px',
                    height: '8px',
                    background: index === carouselIndex ? colors.iconColor : colors.textTertiary,
                    cursor: 'pointer',
                    border: 'none',
                  }}
                  role="tab"
                  aria-selected={index === carouselIndex}
                  aria-label={`Featured content ${index + 1} of ${featuredContent.length}: ${featuredContent[index].title}`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="px-4 sm:px-6 mb-4 sm:mb-6">
          <h3 className="text-base sm:text-lg font-semibold mb-3">Quick Actions</h3>
          <div className="grid grid-cols-2 gap-2 sm:gap-3">
            {(showAllQuickActions ? quickActions : quickActions.slice(0, 4)).map((action, index) => {
              const Icon = iconMap[action.icon] || Target;
              const handleClick = () => {
                if (action.id === 'daily-practice') {
                  setShowPracticeSession(true);
                } else if (action.id === 'ar-mode') {
                  setShowVocabularyTagging(true);
                } else if (action.id === 'quiz-mode') {
                  setShowSocialPractice(true);
                } else if (action.id === 'scavenger-hunt') {
                  setShowScavengerHunt(true);
                } else if (action.id === 'vocabulary-review') {
                  setShowVocabularyReview(true);
                } else if (action.id === 'grammar-lessons') {
                  setShowGrammarLessons(true);
                } else if (action.id === 'fingerspelling') {
                  setShowFingerspelling(true);
                } else if (action.id === 'story-mode') {
                  setShowStoryMode(true);
                } else if (action.id === 'video-library') {
                  setShowVideoLibrary(true);
                } else if (action.id === 'certification-center') {
                  setShowCertificationCenter(true);
                } else if (action.id === 'community-feed') {
                  setShowCommunityFeed(true);
                } else if (action.id === 'friends-connections') {
                  setShowFriendsConnections(true);
                } else if (action.id === 'live-class-schedule') {
                  setShowLiveClassSchedule(true);
                } else if (action.id === 'messaging-chat') {
                  setShowMessagingChat(true);
                } else if (action.id === 'leaderboards') {
                  setShowLeaderboards(true);
                } else if (action.id === 'progress-dashboard') {
                  setShowProgressDashboard(true);
                } else if (action.id === 'detailed-analytics') {
                  setShowDetailedAnalytics(true);
                } else if (action.id === 'learning-path-roadmap') {
                  setShowLearningPathRoadmap(true);
                } else if (action.id === 'language-selection') {
                  setShowLanguageSelection(true);
                } else if (action.id === 'personalization-preferences') {
                  setShowPersonalizationPreferences(true);
                } else if (action.id === 'accessibility-settings') {
                  setShowAccessibilitySettings(true);
                } else if (action.id === 'tutorial-help-center') {
                  setShowTutorialHelpCenter(true);
                } else if (action.id === 'camera-ar-settings') {
                  setShowCameraARSettings(true);
                } else if (action.id === 'feedback-support') {
                  setShowFeedbackSupport(true);
                } else if (action.id === 'profile-customization') {
                  setShowProfileCustomization(true);
                } else if (action.id === 'notifications-center') {
                  setShowNotificationsCenter(true);
                } else if (action.id === 'settings-hub') {
                  setShowSettingsHub(true);
                } else if (action.id === 'ar-placement-mode') {
                  setShowARPlacementMode(true);
                } else if (action.id === 'context-aware-dashboard') {
                  setShowContextAwareDashboard(true);
                } else if (action.id === 'ar-practice-mirror') {
                  setShowARPracticeMirror(true);
                } else if (action.id === 'avatar-instructor-settings') {
                  setShowAvatarInstructorSettings(true);
                } else if (action.id === 'spatial-grammar-visualization') {
                  setShowSpatialGrammarVisualization(true);
                } else if (action.id === 'hand-tracking-practice') {
                  setShowHandTrackingPractice(true);
                } else if (action.id === 'deaf-culture-education') {
                  setShowDeafCultureEducation(true);
                } else if (action.id === 'interpreter-mode') {
                  setShowInterpreterMode(true);
                } else if (action.id === 'emergency-signs') {
                  setShowEmergencySigns(true);
                } else if (action.id === 'challenges-hub') {
                  setShowChallengesHub(true);
                } else if (action.id === 'offline-mode-manager') {
                  setShowOfflineModeManager(true);
                } else if (action.id === 'parent-teacher-dashboard') {
                  setShowParentTeacherDashboard(true);
                } else if (action.id === 'referral-program') {
                  setShowReferralProgram(true);
                } else if (action.id === 'daily-streaks-rewards') {
                  setShowDailyStreaksRewards(true);
                } else if (action.id === 'practice-history') {
                  setShowPracticeHistory(true);
                } else if (action.id === 'sign-dictionary') {
                  setShowSignDictionary(true);
                } else if (action.id === 'ar-scene-creator') {
                  setShowARSceneCreator(true);
                } else if (action.id === 'streak-recovery') {
                  setShowStreakRecovery(true);
                } else if (action.id === 'skill-assessment') {
                  setShowSkillAssessment(true);
                } else if (action.id === 'challenges-calendar') {
                  setShowChallengesCalendar(true);
                } else if (action.id === 'conversation-scenarios') {
                  setShowConversationScenarios(true);
                } else if (action.id === 'voice-to-sign-translation') {
                  setShowVoiceToSignTranslation(true);
                } else if (action.id === 'deaf-community-events') {
                  setShowDeafCommunityEvents(true);
                } else if (action.id === 'achievements-badges') {
                  setShowAchievementsBadges(true);
                }
              };
              
              return (
                <motion.button
                  key={action.id}
                  onClick={handleClick}
                  className="rounded-xl p-4 text-left transition-colors"
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
                  transition={{ delay: index * 0.1 }}
                  aria-label={`${action.title}: ${action.subtitle}`}
                >
                  <div className="w-10 h-10 rounded-lg flex items-center justify-center mb-3" style={{ background: colors.iconBg }} aria-hidden="true">
                    <Icon className="w-5 h-5" style={{ color: colors.iconColor }} />
                  </div>
                  <div className="font-semibold mb-1" style={{ color: colors.textPrimary }}>{action.title}</div>
                  <div className="text-xs" style={{ color: colors.textSecondary }}>{action.subtitle}</div>
                </motion.button>
              );
            })}
          </div>

          {/* See all / Show less button */}
          {quickActions.length > 4 && (
            <motion.div 
              className="mt-3"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              <Button
                variant="ghost"
                onClick={() => setShowAllQuickActions(!showAllQuickActions)}
                className="w-full h-10 rounded-full font-semibold text-sm"
                style={{ 
                  color: colors.iconColor,
                  background: colors.iconBg,
                }}
                onMouseEnter={(e) => e.currentTarget.style.background = colors.cardHover}
                onMouseLeave={(e) => e.currentTarget.style.background = colors.iconBg}
                aria-expanded={showAllQuickActions}
                aria-label={showAllQuickActions ? 'Show fewer quick actions' : 'See all quick actions'}
              >
                {showAllQuickActions ? 'Show Less' : `See All (${quickActions.length})`}
              </Button>
            </motion.div>
          )}
        </div>

        {/* Upgrade Prompt */}
        <div className="px-4 sm:px-6 mb-4 sm:mb-6">
          <motion.div 
            className="rounded-xl sm:rounded-2xl p-5 sm:p-6 relative overflow-hidden"
            style={{ background: colors.premiumGradient }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            role="region"
            aria-labelledby="upgrade-title"
          >
            {/* Background decoration */}
            <div className="absolute top-0 right-0 opacity-20" aria-hidden="true">
              <Crown className="w-32 h-32 -mt-6 -mr-6" />
            </div>
            
            <div className="relative z-10">
              <div className="flex items-center gap-2 mb-2">
                <Crown className="w-5 h-5" aria-hidden="true" />
                <span className="text-xs uppercase tracking-wide font-semibold">Premium</span>
              </div>
              <h3 id="upgrade-title" className="text-xl font-bold mb-2">
                Unlock Premium Features
              </h3>
              <p className="text-sm mb-4 opacity-90">
                Get access to advanced lessons, AR tracking, offline mode, and personalized learning paths
              </p>
              
              <ul className="space-y-2 mb-4 text-sm" role="list" aria-label="Premium features">
                <li className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0" aria-hidden="true">✓</span>
                  <span>50+ advanced sign lessons</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0" aria-hidden="true">✓</span>
                  <span>Real-time AR hand tracking</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0" aria-hidden="true">✓</span>
                  <span>Offline mode & downloads</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0" aria-hidden="true">✓</span>
                  <span>Multiple sign languages</span>
                </li>
              </ul>
              
              <Button
                onClick={() => setShowUpgrade(true)}
                className="w-full h-12 rounded-full font-semibold"
                style={{ background: 'white', color: '#F59E0B' }}
                onMouseEnter={(e) => e.currentTarget.style.background = 'var(--color-text)'}
                onMouseLeave={(e) => e.currentTarget.style.background = 'white'}
                aria-label="Upgrade to premium"
              >
                Start 7-Day Free Trial
              </Button>
            </div>
          </motion.div>
        </div>

        {/* Recent Activity */}
        <div className="px-4 sm:px-6 pb-4 sm:pb-6">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-base sm:text-lg font-semibold">Recent Activity</h3>
            <Button 
              variant="ghost" 
              className="text-sm h-auto p-0"
              style={{ color: colors.iconColor }}
              onClick={() => setShowLessonLibrary(true)}
              aria-label="View all lessons"
            >
              See all
            </Button>
          </div>

          <div className="space-y-3">
            {lessons.slice(0, 4).map((lesson, index) => (
              <motion.button
                key={lesson.id}
                onClick={() => {
                  if (lesson.isPremium && !userProgress.isPremium) {
                    setPaywallView('comparison');
                    setShowUpgrade(true);
                  } else {
                    setSelectedLesson(lesson.id);
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
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                aria-label={`${lesson.title}: ${lesson.description}. ${lesson.isPremium ? 'Premium content' : 'Free'}`}
              >
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(0, 245, 255, 0.1)' }} aria-hidden="true">
                    {lesson.isPremium ? (
                      <Lock className="w-6 h-6" style={{ color: 'var(--color-cyan)' }} />
                    ) : (
                      <Play className="w-6 h-6" style={{ color: 'var(--color-cyan)' }} />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-semibold truncate" style={{ color: colors.textPrimary }}>{lesson.title}</h4>
                      {lesson.isPremium && (
                        <Crown className="w-4 h-4 flex-shrink-0" style={{ color: '#F59E0B' }} aria-label="Premium" />
                      )}
                    </div>
                    <p className="text-sm truncate" style={{ color: colors.textSecondary }}>{lesson.description}</p>
                    <div className="flex items-center gap-3 mt-2 text-xs" style={{ color: colors.textTertiary }}>
                      <span>{lesson.duration}</span>
                      <span>•</span>
                      <span className="capitalize">{lesson.difficulty}</span>
                      <span>•</span>
                      <span>{lesson.signs.length} signs</span>
                    </div>
                  </div>
                  {lesson.progress > 0 && (
                    <div className="text-sm font-semibold" style={{ color: colors.iconColor }} aria-label={`${lesson.progress}% complete`}>
                      {lesson.progress}%
                    </div>
                  )}
                </div>
              </motion.button>
            ))}
          </div>
        </div>
      </div>

      {/* Notifications Panel */}
      <NotificationsPanel isOpen={showNotifications} onClose={() => setShowNotifications(false)} />
      
      {/* Bottom Navigation */}
      <BottomNavigation 
        activeTab={activeTab}
        onTabChange={(tab) => {
          setActiveTab(tab);
          if (tab === 'learn') {
            setShowLessonLibrary(true);
          } else if (tab === 'camera') {
            setShowVocabularyTagging(true);
          } else if (tab === 'social') {
            setShowCommunityFeed(true);
          } else if (tab === 'profile') {
            setShowProfileCustomization(true);
          }
        }}
      />
    </div>
  );
}