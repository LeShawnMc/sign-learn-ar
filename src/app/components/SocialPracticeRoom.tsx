import { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, 
  Plus,
  Search,
  Users,
  Lock,
  Unlock,
  Crown,
  Globe,
  Copy,
  Check,
  UserPlus,
  Settings,
  Camera,
  Mic,
  MicOff,
  Video,
  VideoOff,
  MessageSquare,
  MoreVertical,
  Star,
  ThumbsUp,
  Send,
  ChevronRight,
  Play,
  Clock,
  Target,
  Zap,
  Award,
  TrendingUp,
  User,
  Shield
} from 'lucide-react';
import { useApp } from '../context/AppContext';

type SocialStep = 
  | 'browse'
  | 'create'
  | 'lobby'
  | 'ar-space'
  | 'scenario-select'
  | 'feedback';

interface Room {
  id: string;
  name: string;
  host: string;
  participants: number;
  maxParticipants: number;
  isPrivate: boolean;
  scenario: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  language: string;
  isActive: boolean;
}

interface Participant {
  id: string;
  name: string;
  avatar: string;
  level: number;
  isHost: boolean;
  isMuted: boolean;
  isCameraOff: boolean;
  status: 'ready' | 'not-ready' | 'practicing';
}

interface PracticeScenario {
  id: string;
  title: string;
  description: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  duration: string;
  participants: string;
  category: string;
  signsCount: number;
}

interface FeedbackRating {
  participantId: string;
  participantName: string;
  accuracy: number;
  fluency: number;
  engagement: number;
  overall: number;
}

interface SocialPracticeRoomProps {
  onExit: () => void;
}

export function SocialPracticeRoom({ onExit }: SocialPracticeRoomProps) {
  const { selectedLanguage } = useApp();
  const [currentStep, setCurrentStep] = useState<SocialStep>('browse');
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterDifficulty, setFilterDifficulty] = useState<string | null>(null);
  const [showPrivateOnly, setShowPrivateOnly] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isCameraOff, setIsCameraOff] = useState(false);
  const [roomCode, setRoomCode] = useState('');
  const [codeCopied, setCodeCopied] = useState(false);
  const [selectedScenario, setSelectedScenario] = useState<PracticeScenario | null>(null);
  const [chatMessage, setChatMessage] = useState('');
  const [userReady, setUserReady] = useState(false);

  // Mock data for available rooms
  const [rooms, setRooms] = useState<Room[]>([
    {
      id: 'room-1',
      name: 'Daily Greetings Practice',
      host: 'Sarah M.',
      participants: 3,
      maxParticipants: 6,
      isPrivate: false,
      scenario: 'Basic Greetings',
      difficulty: 'beginner',
      language: 'ASL',
      isActive: true,
    },
    {
      id: 'room-2',
      name: 'Advanced Conversation',
      host: 'Michael K.',
      participants: 2,
      maxParticipants: 4,
      isPrivate: false,
      scenario: 'Restaurant Ordering',
      difficulty: 'advanced',
      language: 'ASL',
      isActive: true,
    },
    {
      id: 'room-3',
      name: 'Family Signs Study Group',
      host: 'Jessica L.',
      participants: 4,
      maxParticipants: 8,
      isPrivate: true,
      scenario: 'Family & Relationships',
      difficulty: 'intermediate',
      language: 'ASL',
      isActive: true,
    },
    {
      id: 'room-4',
      name: 'Workplace Communication',
      host: 'David R.',
      participants: 1,
      maxParticipants: 5,
      isPrivate: false,
      scenario: 'Professional Settings',
      difficulty: 'intermediate',
      language: 'ASL',
      isActive: true,
    },
  ]);

  // Mock participants
  const [participants, setParticipants] = useState<Participant[]>([
    {
      id: 'user-1',
      name: 'You',
      avatar: '👤',
      level: 12,
      isHost: true,
      isMuted: false,
      isCameraOff: false,
      status: 'ready',
    },
    {
      id: 'user-2',
      name: 'Emma W.',
      avatar: '👩',
      level: 15,
      isHost: false,
      isMuted: false,
      isCameraOff: false,
      status: 'ready',
    },
    {
      id: 'user-3',
      name: 'James P.',
      avatar: '👨',
      level: 8,
      isHost: false,
      isMuted: true,
      isCameraOff: false,
      status: 'not-ready',
    },
  ]);

  // Practice scenarios
  const scenarios: PracticeScenario[] = [
    {
      id: 'scenario-1',
      title: 'Basic Greetings',
      description: 'Practice common greeting signs and introductions',
      difficulty: 'beginner',
      duration: '10 min',
      participants: '2-6',
      category: 'Social',
      signsCount: 12,
    },
    {
      id: 'scenario-2',
      title: 'Restaurant Ordering',
      description: 'Learn to order food and drinks in sign language',
      difficulty: 'intermediate',
      duration: '15 min',
      participants: '2-4',
      category: 'Daily Life',
      signsCount: 20,
    },
    {
      id: 'scenario-3',
      title: 'Family & Relationships',
      description: 'Discuss family members and relationships',
      difficulty: 'intermediate',
      duration: '12 min',
      participants: '2-8',
      category: 'Personal',
      signsCount: 18,
    },
    {
      id: 'scenario-4',
      title: 'Medical Appointment',
      description: 'Practice describing symptoms and medical concerns',
      difficulty: 'advanced',
      duration: '20 min',
      participants: '2-3',
      category: 'Professional',
      signsCount: 25,
    },
    {
      id: 'scenario-5',
      title: 'Shopping & Transactions',
      description: 'Learn signs for shopping and handling money',
      difficulty: 'beginner',
      duration: '10 min',
      participants: '2-6',
      category: 'Daily Life',
      signsCount: 15,
    },
    {
      id: 'scenario-6',
      title: 'Job Interview',
      description: 'Practice professional communication for interviews',
      difficulty: 'advanced',
      duration: '25 min',
      participants: '2-2',
      category: 'Professional',
      signsCount: 30,
    },
  ];

  const handleCreateRoom = () => {
    const newRoomCode = Math.random().toString(36).substring(2, 8).toUpperCase();
    setRoomCode(newRoomCode);
    setCurrentStep('lobby');
  };

  const handleJoinRoom = (room: Room) => {
    setSelectedRoom(room);
    setRoomCode(Math.random().toString(36).substring(2, 8).toUpperCase());
    setCurrentStep('lobby');
  };

  const handleCopyCode = () => {
    setCodeCopied(true);
    setTimeout(() => setCodeCopied(false), 2000);
  };

  const handleStartPractice = () => {
    setCurrentStep('ar-space');
  };

  const handleSelectScenario = (scenario: PracticeScenario) => {
    setSelectedScenario(scenario);
    setCurrentStep('ar-space');
  };

  const handleEndSession = () => {
    setCurrentStep('feedback');
  };

  const filteredRooms = rooms.filter(room => {
    const matchesSearch = room.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         room.scenario.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDifficulty = !filterDifficulty || room.difficulty === filterDifficulty;
    const matchesPrivacy = !showPrivateOnly || !room.isPrivate;
    return matchesSearch && matchesDifficulty && matchesPrivacy;
  });

  // Browse Rooms Screen
  if (currentStep === 'browse') {
    return (
      <div 
        className="min-h-screen bg-black text-white flex flex-col"
        role="main"
        aria-labelledby="browse-title"
      >
        {/* Header */}
        <div className="p-6 pb-4">
          <div className="flex items-center justify-between mb-4">
            <h1 id="browse-title" className="text-2xl font-bold">Practice Rooms</h1>
            <Button
              variant="ghost"
              size="icon"
              onClick={onExit}
              className="w-10 h-10 rounded-full hover:bg-gray-900"
              aria-label="Exit practice rooms"
            >
              <X className="w-5 h-5" />
            </Button>
          </div>

          {/* Search Bar */}
          <div className="relative mb-4">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search rooms..."
              className="w-full bg-gray-900 border border-gray-800 rounded-xl pl-12 pr-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
              aria-label="Search practice rooms"
            />
          </div>

          {/* Filters */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setFilterDifficulty(null)}
              className={`rounded-full whitespace-nowrap ${!filterDifficulty ? 'bg-blue-600' : 'bg-gray-900'}`}
              aria-pressed={!filterDifficulty}
            >
              All Levels
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setFilterDifficulty('beginner')}
              className={`rounded-full whitespace-nowrap ${filterDifficulty === 'beginner' ? 'bg-blue-600' : 'bg-gray-900'}`}
              aria-pressed={filterDifficulty === 'beginner'}
            >
              Beginner
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setFilterDifficulty('intermediate')}
              className={`rounded-full whitespace-nowrap ${filterDifficulty === 'intermediate' ? 'bg-blue-600' : 'bg-gray-900'}`}
              aria-pressed={filterDifficulty === 'intermediate'}
            >
              Intermediate
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setFilterDifficulty('advanced')}
              className={`rounded-full whitespace-nowrap ${filterDifficulty === 'advanced' ? 'bg-blue-600' : 'bg-gray-900'}`}
              aria-pressed={filterDifficulty === 'advanced'}
            >
              Advanced
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowPrivateOnly(!showPrivateOnly)}
              className={`rounded-full whitespace-nowrap ${showPrivateOnly ? 'bg-blue-600' : 'bg-gray-900'}`}
              aria-pressed={showPrivateOnly}
            >
              <Globe className="w-3 h-3 mr-1" />
              Public Only
            </Button>
          </div>
        </div>

        {/* Active Rooms List */}
        <div className="flex-1 px-6 pb-6 overflow-y-auto">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-semibold">
              Active Rooms ({filteredRooms.length})
            </h2>
          </div>

          {filteredRooms.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-gray-500">
              <Users className="w-12 h-12 mb-3" />
              <p className="text-center">No rooms found</p>
              {searchQuery && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSearchQuery('')}
                  className="mt-2 text-blue-500"
                >
                  Clear search
                </Button>
              )}
            </div>
          ) : (
            <div className="space-y-3">
              {filteredRooms.map((room, index) => (
                <motion.div
                  key={room.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="bg-gray-900 rounded-xl p-4"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold text-lg">{room.name}</h3>
                        {room.isPrivate ? (
                          <Lock className="w-4 h-4 text-gray-400" aria-label="Private room" />
                        ) : (
                          <Globe className="w-4 h-4 text-green-500" aria-label="Public room" />
                        )}
                      </div>
                      <p className="text-sm text-gray-400 mb-2">{room.scenario}</p>
                      <div className="flex items-center gap-3 text-xs text-gray-500">
                        <span className="flex items-center gap-1">
                          <User className="w-3 h-3" />
                          {room.host}
                        </span>
                        <span>•</span>
                        <span className="capitalize">{room.difficulty}</span>
                        <span>•</span>
                        <span>{room.language}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-gray-800">
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4 text-blue-500" />
                      <span className="text-sm font-semibold">
                        {room.participants}/{room.maxParticipants}
                      </span>
                      <span className="text-xs text-gray-500">participants</span>
                    </div>
                    <Button
                      onClick={() => handleJoinRoom(room)}
                      size="sm"
                      className="bg-blue-600 hover:bg-blue-700"
                      disabled={room.participants >= room.maxParticipants}
                      aria-label={`Join ${room.name}`}
                    >
                      {room.participants >= room.maxParticipants ? 'Full' : 'Join'}
                    </Button>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>

        {/* Create Room Button */}
        <div className="p-6 border-t border-gray-900">
          <Button
            onClick={() => setCurrentStep('create')}
            className="w-full bg-blue-600 hover:bg-blue-700 h-14 text-lg font-semibold rounded-full"
            aria-label="Create new practice room"
          >
            <Plus className="w-5 h-5 mr-2" />
            Create Room
          </Button>
        </div>
      </div>
    );
  }

  // Create Room Screen
  if (currentStep === 'create') {
    return (
      <div 
        className="min-h-screen bg-black text-white flex flex-col"
        role="main"
        aria-labelledby="create-title"
      >
        {/* Header */}
        <div className="p-6 flex items-center justify-between">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setCurrentStep('browse')}
            className="w-10 h-10 rounded-full hover:bg-gray-900"
            aria-label="Back to browse rooms"
          >
            <X className="w-5 h-5" />
          </Button>
          <h1 id="create-title" className="text-xl font-bold">Create Room</h1>
          <div className="w-10" aria-hidden="true" />
        </div>

        {/* Form */}
        <div className="flex-1 px-6 pb-6 overflow-y-auto">
          <div className="space-y-5">
            {/* Room Name */}
            <div>
              <label htmlFor="room-name" className="block text-sm font-semibold mb-2">
                Room Name
              </label>
              <input
                id="room-name"
                type="text"
                placeholder="e.g., Daily Greetings Practice"
                className="w-full bg-gray-900 border border-gray-800 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
              />
            </div>

            {/* Privacy */}
            <div>
              <label className="block text-sm font-semibold mb-2">
                Privacy
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  className="bg-blue-600 border-2 border-blue-600 rounded-xl p-4 text-left"
                  aria-pressed="true"
                  aria-label="Public room selected"
                >
                  <Globe className="w-6 h-6 mb-2" />
                  <div className="font-semibold mb-1">Public</div>
                  <div className="text-xs opacity-80">Anyone can join</div>
                </button>
                <button
                  className="bg-gray-900 border-2 border-gray-800 rounded-xl p-4 text-left hover:border-gray-700"
                  aria-pressed="false"
                  aria-label="Private room not selected"
                >
                  <Lock className="w-6 h-6 mb-2" />
                  <div className="font-semibold mb-1">Private</div>
                  <div className="text-xs opacity-80">Invite only</div>
                </button>
              </div>
            </div>

            {/* Max Participants */}
            <div>
              <label htmlFor="max-participants" className="block text-sm font-semibold mb-2">
                Max Participants
              </label>
              <select
                id="max-participants"
                className="w-full bg-gray-900 border border-gray-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500"
              >
                <option>2 participants</option>
                <option>4 participants</option>
                <option selected>6 participants</option>
                <option>8 participants</option>
              </select>
            </div>

            {/* Difficulty Level */}
            <div>
              <label className="block text-sm font-semibold mb-2">
                Difficulty Level
              </label>
              <div className="grid grid-cols-3 gap-3">
                <button
                  className="bg-gray-900 border-2 border-gray-800 rounded-xl p-3 text-center hover:border-blue-600"
                  aria-pressed="false"
                >
                  <div className="text-sm font-semibold">Beginner</div>
                </button>
                <button
                  className="bg-blue-600 border-2 border-blue-600 rounded-xl p-3 text-center"
                  aria-pressed="true"
                >
                  <div className="text-sm font-semibold">Intermediate</div>
                </button>
                <button
                  className="bg-gray-900 border-2 border-gray-800 rounded-xl p-3 text-center hover:border-blue-600"
                  aria-pressed="false"
                >
                  <div className="text-sm font-semibold">Advanced</div>
                </button>
              </div>
            </div>

            {/* Language */}
            <div>
              <label htmlFor="language" className="block text-sm font-semibold mb-2">
                Sign Language
              </label>
              <select
                id="language"
                className="w-full bg-gray-900 border border-gray-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500"
              >
                <option selected>ASL (American Sign Language)</option>
                <option>BSL (British Sign Language)</option>
                <option>ISL (Indian Sign Language)</option>
                <option>LSF (French Sign Language)</option>
              </select>
            </div>

            {/* Scenario Selection */}
            <div>
              <label className="block text-sm font-semibold mb-2">
                Practice Scenario (Optional)
              </label>
              <button
                onClick={() => setCurrentStep('scenario-select')}
                className="w-full bg-gray-900 border border-gray-800 rounded-xl p-4 text-left hover:bg-gray-800 flex items-center justify-between"
                aria-label="Select practice scenario"
              >
                <div>
                  <div className="font-semibold mb-1">Choose Scenario</div>
                  <div className="text-xs text-gray-400">Select a guided practice session</div>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-500" />
              </button>
            </div>
          </div>
        </div>

        {/* Create Button */}
        <div className="p-6 border-t border-gray-900">
          <Button
            onClick={handleCreateRoom}
            className="w-full bg-blue-600 hover:bg-blue-700 h-14 text-lg font-semibold rounded-full"
            aria-label="Create room and continue"
          >
            Create & Continue
          </Button>
        </div>
      </div>
    );
  }

  // Participant Lobby Screen
  if (currentStep === 'lobby') {
    return (
      <div 
        className="min-h-screen bg-black text-white flex flex-col"
        role="main"
        aria-labelledby="lobby-title"
      >
        {/* Header */}
        <div className="p-6 pb-4">
          <div className="flex items-center justify-between mb-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setCurrentStep('browse')}
              className="w-10 h-10 rounded-full hover:bg-gray-900"
              aria-label="Leave room"
            >
              <X className="w-5 h-5" />
            </Button>
            <h1 id="lobby-title" className="text-xl font-bold">Practice Lobby</h1>
            <Button
              variant="ghost"
              size="icon"
              className="w-10 h-10 rounded-full hover:bg-gray-900"
              aria-label="Room settings"
            >
              <Settings className="w-5 h-5" />
            </Button>
          </div>

          {/* Room Code */}
          <div className="bg-gradient-to-br from-blue-600 to-blue-800 rounded-2xl p-5 mb-4">
            <div className="text-sm opacity-90 mb-2">Room Code</div>
            <div className="flex items-center justify-between">
              <div className="text-3xl font-bold tracking-wider">{roomCode}</div>
              <Button
                onClick={handleCopyCode}
                size="sm"
                className="bg-white/20 hover:bg-white/30"
                aria-label={codeCopied ? 'Code copied' : 'Copy room code'}
              >
                {codeCopied ? (
                  <>
                    <Check className="w-4 h-4 mr-1" />
                    Copied
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4 mr-1" />
                    Copy
                  </>
                )}
              </Button>
            </div>
            <p className="text-xs opacity-80 mt-2">Share this code to invite others</p>
          </div>

          {/* Scenario Info */}
          {selectedScenario && (
            <div className="bg-gray-900 rounded-xl p-4 mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-purple-600/20 flex items-center justify-center" aria-hidden="true">
                  <Target className="w-6 h-6 text-purple-500" />
                </div>
                <div className="flex-1">
                  <div className="font-semibold">{selectedScenario.title}</div>
                  <div className="text-xs text-gray-400">{selectedScenario.duration} • {selectedScenario.signsCount} signs</div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Participants List */}
        <div className="flex-1 px-6 pb-6 overflow-y-auto">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-semibold">
              Participants ({participants.length}/6)
            </h2>
            <Button
              variant="ghost"
              size="sm"
              className="text-blue-500"
              aria-label="Invite participants"
            >
              <UserPlus className="w-4 h-4 mr-1" />
              Invite
            </Button>
          </div>

          <div className="space-y-3">
            {participants.map((participant, index) => (
              <motion.div
                key={participant.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-gray-900 rounded-xl p-4"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <div className="w-12 h-12 rounded-full bg-blue-600/20 flex items-center justify-center text-2xl">
                        {participant.avatar}
                      </div>
                      {participant.isHost && (
                        <div className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-yellow-500 flex items-center justify-center">
                          <Crown className="w-3 h-3 text-black" aria-label="Host" />
                        </div>
                      )}
                    </div>
                    <div>
                      <div className="font-semibold flex items-center gap-2">
                        {participant.name}
                        {participant.isHost && (
                          <span className="text-xs text-yellow-500">Host</span>
                        )}
                      </div>
                      <div className="text-xs text-gray-400">Level {participant.level}</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {participant.isMuted ? (
                      <div className="w-8 h-8 rounded-full bg-red-600/20 flex items-center justify-center">
                        <MicOff className="w-4 h-4 text-red-500" aria-label="Muted" />
                      </div>
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-green-600/20 flex items-center justify-center">
                        <Mic className="w-4 h-4 text-green-500" aria-label="Microphone on" />
                      </div>
                    )}
                    {participant.isCameraOff ? (
                      <div className="w-8 h-8 rounded-full bg-red-600/20 flex items-center justify-center">
                        <VideoOff className="w-4 h-4 text-red-500" aria-label="Camera off" />
                      </div>
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-green-600/20 flex items-center justify-center">
                        <Video className="w-4 h-4 text-green-500" aria-label="Camera on" />
                      </div>
                    )}
                    <div className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      participant.status === 'ready' ? 'bg-green-600/20 text-green-500' : 'bg-gray-800 text-gray-400'
                    }`}>
                      {participant.status === 'ready' ? 'Ready' : 'Not Ready'}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Empty slots */}
          {Array.from({ length: 6 - participants.length }).map((_, index) => (
            <motion.div
              key={`empty-${index}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-gray-900 rounded-xl p-4 border-2 border-dashed border-gray-800 mt-3"
            >
              <div className="flex items-center gap-3 opacity-50">
                <div className="w-12 h-12 rounded-full bg-gray-800 flex items-center justify-center">
                  <UserPlus className="w-5 h-5" />
                </div>
                <div className="text-sm text-gray-500">Waiting for participant...</div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Bottom Controls */}
        <div className="p-6 border-t border-gray-900 space-y-3">
          {/* Audio/Video Controls */}
          <div className="flex items-center gap-3 mb-3">
            <Button
              onClick={() => setIsMuted(!isMuted)}
              variant="outline"
              className={`flex-1 h-12 border-2 ${isMuted ? 'border-red-600 bg-red-600/10' : 'border-gray-700'}`}
              aria-label={isMuted ? 'Unmute microphone' : 'Mute microphone'}
              aria-pressed={isMuted}
            >
              {isMuted ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
            </Button>
            <Button
              onClick={() => setIsCameraOff(!isCameraOff)}
              variant="outline"
              className={`flex-1 h-12 border-2 ${isCameraOff ? 'border-red-600 bg-red-600/10' : 'border-gray-700'}`}
              aria-label={isCameraOff ? 'Turn camera on' : 'Turn camera off'}
              aria-pressed={isCameraOff}
            >
              {isCameraOff ? <VideoOff className="w-5 h-5" /> : <Video className="w-5 h-5" />}
            </Button>
            <Button
              variant="outline"
              className="flex-1 h-12 border-2 border-gray-700"
              aria-label="Open chat"
            >
              <MessageSquare className="w-5 h-5" />
            </Button>
          </div>

          {/* Ready/Start Button */}
          <Button
            onClick={() => {
              if (participants[0].isHost) {
                if (!selectedScenario) {
                  setCurrentStep('scenario-select');
                } else {
                  handleStartPractice();
                }
              } else {
                setUserReady(!userReady);
              }
            }}
            className={`w-full h-14 text-lg font-semibold rounded-full ${
              userReady || participants[0].isHost ? 'bg-green-600 hover:bg-green-700' : 'bg-blue-600 hover:bg-blue-700'
            }`}
            aria-label={participants[0].isHost ? 'Start practice session' : (userReady ? 'Mark as not ready' : 'Mark as ready')}
          >
            {participants[0].isHost ? (
              selectedScenario ? 'Start Practice' : 'Select Scenario'
            ) : (
              userReady ? (
                <>
                  <Check className="w-5 h-5 mr-2" />
                  Ready
                </>
              ) : (
                "I'm Ready"
              )
            )}
          </Button>
        </div>
      </div>
    );
  }

  // Scenario Selection Screen
  if (currentStep === 'scenario-select') {
    return (
      <div 
        className="min-h-screen bg-black text-white flex flex-col"
        role="main"
        aria-labelledby="scenario-title"
      >
        {/* Header */}
        <div className="p-6 flex items-center justify-between">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setCurrentStep(participants.length > 0 ? 'lobby' : 'create')}
            className="w-10 h-10 rounded-full hover:bg-gray-900"
            aria-label="Back"
          >
            <X className="w-5 h-5" />
          </Button>
          <h1 id="scenario-title" className="text-xl font-bold">Practice Scenarios</h1>
          <div className="w-10" aria-hidden="true" />
        </div>

        {/* Scenarios List */}
        <div className="flex-1 px-6 pb-6 overflow-y-auto">
          <p className="text-gray-400 text-sm mb-4">
            Choose a guided practice scenario for your session
          </p>

          <div className="space-y-3">
            {scenarios.map((scenario, index) => (
              <motion.button
                key={scenario.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                onClick={() => handleSelectScenario(scenario)}
                className="w-full bg-gray-900 rounded-xl p-4 text-left hover:bg-gray-800 transition-colors"
                aria-label={`Select ${scenario.title}`}
              >
                <div className="flex items-start gap-3 mb-3">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                    scenario.difficulty === 'beginner' ? 'bg-green-600/20' :
                    scenario.difficulty === 'intermediate' ? 'bg-blue-600/20' :
                    'bg-purple-600/20'
                  }`} aria-hidden="true">
                    <Play className={`w-6 h-6 ${
                      scenario.difficulty === 'beginner' ? 'text-green-500' :
                      scenario.difficulty === 'intermediate' ? 'text-blue-500' :
                      'text-purple-500'
                    }`} />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg mb-1">{scenario.title}</h3>
                    <p className="text-sm text-gray-400 mb-2">{scenario.description}</p>
                    <div className="flex items-center gap-3 text-xs text-gray-500">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {scenario.duration}
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <Users className="w-3 h-3" />
                        {scenario.participants}
                      </span>
                      <span>•</span>
                      <span>{scenario.signsCount} signs</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className={`px-2 py-1 rounded-full text-xs font-semibold capitalize ${
                    scenario.difficulty === 'beginner' ? 'bg-green-600/20 text-green-500' :
                    scenario.difficulty === 'intermediate' ? 'bg-blue-600/20 text-blue-500' :
                    'bg-purple-600/20 text-purple-500'
                  }`}>
                    {scenario.difficulty}
                  </span>
                  <span className="px-2 py-1 bg-gray-800 rounded-full text-xs font-semibold">
                    {scenario.category}
                  </span>
                </div>
              </motion.button>
            ))}
          </div>
        </div>

        {/* Skip Button */}
        <div className="p-6 border-t border-gray-900">
          <Button
            onClick={() => setCurrentStep('lobby')}
            variant="ghost"
            className="w-full h-12 text-gray-400 hover:text-white"
            aria-label="Skip scenario selection"
          >
            Skip for Now
          </Button>
        </div>
      </div>
    );
  }

  // Multi-user AR Space Screen
  if (currentStep === 'ar-space') {
    return (
      <div 
        className="min-h-screen bg-black text-white flex flex-col"
        role="main"
        aria-labelledby="ar-space-title"
      >
        {/* Header Overlay */}
        <div className="absolute top-0 left-0 right-0 p-6 z-10">
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setCurrentStep('lobby')}
              className="w-10 h-10 rounded-full bg-black/50 hover:bg-black/70"
              aria-label="Leave AR space"
            >
              <X className="w-5 h-5" />
            </Button>
            <div className="bg-black/50 backdrop-blur-sm rounded-full px-4 py-2">
              <div className="flex items-center gap-2 text-sm">
                <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" aria-hidden="true" />
                <span className="font-semibold">Live Session</span>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="w-10 h-10 rounded-full bg-black/50 hover:bg-black/70"
              aria-label="More options"
            >
              <MoreVertical className="w-5 h-5" />
            </Button>
          </div>
        </div>

        {/* AR Camera View */}
        <div className="flex-1 relative bg-gray-900">
          <div className="absolute inset-0 flex items-center justify-center">
            {/* Simulated AR environment */}
            <div className="relative w-full h-full">
              {/* Participant avatars in AR space */}
              {participants.slice(0, 3).map((participant, index) => (
                <motion.div
                  key={participant.id}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ 
                    opacity: 1, 
                    scale: 1,
                    y: [0, -10, 0]
                  }}
                  transition={{
                    y: { duration: 2, repeat: Infinity, delay: index * 0.3 }
                  }}
                  className="absolute"
                  style={{
                    left: `${20 + index * 30}%`,
                    top: `${30 + index * 15}%`,
                  }}
                >
                  <div className="relative">
                    <div className="w-32 h-32 rounded-2xl bg-blue-600/20 border-2 border-blue-500 flex flex-col items-center justify-center backdrop-blur-sm">
                      <div className="text-4xl mb-2">{participant.avatar}</div>
                      <div className="text-xs font-semibold">{participant.name}</div>
                    </div>
                    {participant.status === 'practicing' && (
                      <div className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-green-500 flex items-center justify-center">
                        <Zap className="w-4 h-4 text-white" />
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}

              {/* Current sign indicator */}
              {selectedScenario && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="absolute bottom-32 left-1/2 -translate-x-1/2 bg-black/70 backdrop-blur-md rounded-2xl p-6 min-w-[300px]"
                >
                  <div className="text-center">
                    <div className="text-sm text-gray-400 mb-2">Current Sign</div>
                    <div className="text-2xl font-bold mb-2">Hello</div>
                    <p className="text-sm text-gray-300 mb-4">
                      Extend your hand with fingers together, palm facing forward. Move your hand away from your forehead.
                    </p>
                    <div className="flex items-center justify-center gap-2 text-xs text-gray-400">
                      <Clock className="w-3 h-3" />
                      <span>2:45 remaining</span>
                    </div>
                  </div>
                </motion.div>
              )}
            </div>
          </div>
        </div>

        {/* Bottom Controls */}
        <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black to-transparent">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Button
              onClick={() => setIsMuted(!isMuted)}
              variant="outline"
              size="icon"
              className={`w-14 h-14 rounded-full border-2 ${isMuted ? 'border-red-600 bg-red-600/20' : 'border-white/20 bg-black/50'}`}
              aria-label={isMuted ? 'Unmute' : 'Mute'}
            >
              {isMuted ? <MicOff className="w-6 h-6" /> : <Mic className="w-6 h-6" />}
            </Button>
            <Button
              onClick={() => setIsCameraOff(!isCameraOff)}
              variant="outline"
              size="icon"
              className={`w-14 h-14 rounded-full border-2 ${isCameraOff ? 'border-red-600 bg-red-600/20' : 'border-white/20 bg-black/50'}`}
              aria-label={isCameraOff ? 'Turn camera on' : 'Turn camera off'}
            >
              {isCameraOff ? <VideoOff className="w-6 h-6" /> : <Video className="w-6 h-6" />}
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="w-14 h-14 rounded-full border-2 border-white/20 bg-black/50"
              aria-label="Chat"
            >
              <MessageSquare className="w-6 h-6" />
            </Button>
          </div>

          <Button
            onClick={handleEndSession}
            className="w-full bg-red-600 hover:bg-red-700 h-14 text-lg font-semibold rounded-full"
            aria-label="End practice session"
          >
            End Session
          </Button>
        </div>
      </div>
    );
  }

  // Feedback/Rating Screen
  if (currentStep === 'feedback') {
    const mockRatings: FeedbackRating[] = [
      {
        participantId: 'user-2',
        participantName: 'Emma W.',
        accuracy: 92,
        fluency: 88,
        engagement: 95,
        overall: 92,
      },
      {
        participantId: 'user-3',
        participantName: 'James P.',
        accuracy: 78,
        fluency: 82,
        engagement: 85,
        overall: 82,
      },
    ];

    return (
      <div 
        className="min-h-screen bg-black text-white flex flex-col"
        role="main"
        aria-labelledby="feedback-title"
      >
        {/* Header */}
        <div className="p-6 text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="w-20 h-20 rounded-full bg-green-600/20 flex items-center justify-center mx-auto mb-4"
            aria-hidden="true"
          >
            <Award className="w-10 h-10 text-green-500" />
          </motion.div>

          <motion.h1
            id="feedback-title"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-2xl font-bold mb-2"
          >
            Session Complete!
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-gray-400"
          >
            Great practice session with your peers
          </motion.p>
        </div>

        {/* Session Stats */}
        <div className="px-6 mb-6">
          <div className="grid grid-cols-3 gap-3">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4 }}
              className="bg-gradient-to-br from-blue-600 to-blue-800 rounded-xl p-4 text-center"
            >
              <div className="text-2xl font-bold mb-1">15</div>
              <div className="text-xs opacity-90">Signs Practiced</div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5 }}
              className="bg-gradient-to-br from-green-600 to-green-800 rounded-xl p-4 text-center"
            >
              <div className="text-2xl font-bold mb-1">25</div>
              <div className="text-xs opacity-90">Minutes</div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.6 }}
              className="bg-gradient-to-br from-purple-600 to-purple-800 rounded-xl p-4 text-center"
            >
              <div className="text-2xl font-bold mb-1">3</div>
              <div className="text-xs opacity-90">Participants</div>
            </motion.div>
          </div>
        </div>

        {/* Rate Participants */}
        <div className="flex-1 px-6 pb-6 overflow-y-auto">
          <h2 className="text-lg font-semibold mb-3">Rate Your Practice Partners</h2>
          <p className="text-sm text-gray-400 mb-4">
            Help others improve by providing constructive feedback
          </p>

          <div className="space-y-4">
            {mockRatings.map((rating, index) => (
              <motion.div
                key={rating.participantId}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 + index * 0.1 }}
                className="bg-gray-900 rounded-xl p-4"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-full bg-blue-600/20 flex items-center justify-center text-xl">
                    {index === 0 ? '👩' : '👨'}
                  </div>
                  <div className="flex-1">
                    <div className="font-semibold">{rating.participantName}</div>
                    <div className="text-xs text-gray-400">Practice Partner</div>
                  </div>
                  <div className="text-right">
                    <div className="text-xl font-bold text-green-500">{rating.overall}</div>
                    <div className="text-xs text-gray-400">Overall</div>
                  </div>
                </div>

                {/* Rating Categories */}
                <div className="space-y-3">
                  <div>
                    <div className="flex items-center justify-between text-sm mb-1">
                      <span className="text-gray-400">Accuracy</span>
                      <span className="font-semibold">{rating.accuracy}%</span>
                    </div>
                    <div className="h-2 bg-gray-800 rounded-full overflow-hidden" role="progressbar" aria-valuenow={rating.accuracy} aria-valuemin={0} aria-valuemax={100}>
                      <div className="h-full bg-blue-500" style={{ width: `${rating.accuracy}%` }} />
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between text-sm mb-1">
                      <span className="text-gray-400">Fluency</span>
                      <span className="font-semibold">{rating.fluency}%</span>
                    </div>
                    <div className="h-2 bg-gray-800 rounded-full overflow-hidden" role="progressbar" aria-valuenow={rating.fluency} aria-valuemin={0} aria-valuemax={100}>
                      <div className="h-full bg-green-500" style={{ width: `${rating.fluency}%` }} />
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between text-sm mb-1">
                      <span className="text-gray-400">Engagement</span>
                      <span className="font-semibold">{rating.engagement}%</span>
                    </div>
                    <div className="h-2 bg-gray-800 rounded-full overflow-hidden" role="progressbar" aria-valuenow={rating.engagement} aria-valuemin={0} aria-valuemax={100}>
                      <div className="h-full bg-purple-500" style={{ width: `${rating.engagement}%` }} />
                    </div>
                  </div>
                </div>

                {/* Star Rating */}
                <div className="mt-4 pt-4 border-t border-gray-800">
                  <div className="text-sm text-gray-400 mb-2">Your Rating</div>
                  <div className="flex items-center gap-2" role="radiogroup" aria-label={`Rate ${rating.participantName}`}>
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        className="w-8 h-8 flex items-center justify-center"
                        aria-label={`${star} stars`}
                        role="radio"
                        aria-checked={star <= 4}
                      >
                        <Star 
                          className={`w-6 h-6 ${star <= 4 ? 'fill-yellow-500 text-yellow-500' : 'text-gray-600'}`}
                        />
                      </button>
                    ))}
                  </div>
                </div>

                {/* Optional Comment */}
                <div className="mt-3">
                  <textarea
                    placeholder="Add a comment (optional)"
                    rows={2}
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 resize-none"
                    aria-label={`Comment for ${rating.participantName}`}
                  />
                </div>
              </motion.div>
            ))}
          </div>

          {/* Your Performance */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9 }}
            className="bg-gradient-to-br from-blue-600 to-blue-800 rounded-xl p-5 mt-4"
          >
            <h3 className="font-semibold mb-3 flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              Your Performance
            </h3>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div className="bg-white/10 rounded-lg p-3">
                <div className="text-2xl font-bold mb-1">88%</div>
                <div className="text-xs opacity-90">Avg. Accuracy</div>
              </div>
              <div className="bg-white/10 rounded-lg p-3">
                <div className="text-2xl font-bold mb-1">+12</div>
                <div className="text-xs opacity-90">XP Earned</div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Action Buttons */}
        <div className="p-6 border-t border-gray-900 space-y-3">
          <Button
            onClick={onExit}
            className="w-full bg-blue-600 hover:bg-blue-700 h-14 text-lg font-semibold rounded-full"
            aria-label="Submit feedback and return home"
          >
            <ThumbsUp className="w-5 h-5 mr-2" />
            Submit Feedback
          </Button>
          <Button
            onClick={() => setCurrentStep('browse')}
            variant="ghost"
            className="w-full h-12 text-gray-400 hover:text-white"
            aria-label="Join another room"
          >
            Join Another Room
          </Button>
        </div>
      </div>
    );
  }

  return null;
}
