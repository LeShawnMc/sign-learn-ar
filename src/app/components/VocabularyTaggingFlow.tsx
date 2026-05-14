import React, { useState, useRef, useCallback } from 'react';
import { Button } from './ui/button';
import { motion, AnimatePresence } from 'motion/react';
import {
  X, Camera, Check, Plus, Edit2, Trash2, Eye, MapPin, ChevronRight,
  Sparkles, Search, Grid3x3, List, BookmarkCheck, Target, RotateCw,
  AlertCircle, ChevronLeft, CheckCircle, XCircle, Loader2,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useObjectDetection, type DetectedObjectResult } from '../../lib/useObjectDetection';

type TaggingStep = 'camera' | 'recognition' | 'placement' | 'management' | 'review' | 'practice' | 'edit';

interface VocabularyAnchor {
  id: string;
  objectName: string;
  signWord: string;
  signDescription: string;
  category: string;
  location: string;
  dateCreated: string;
  timesReviewed: number;
  accuracy: number;
}

interface VocabularyTaggingFlowProps {
  onExit: () => void;
}

const INITIAL_ANCHORS: VocabularyAnchor[] = [
  { id: 'anchor-1', objectName: 'Door', signWord: 'Door', signDescription: 'Hold both hands flat, palms facing forward, then swing them open like a door', category: 'Home', location: 'Living Room', dateCreated: '2024-01-10', timesReviewed: 12, accuracy: 95 },
  { id: 'anchor-2', objectName: 'Chair', signWord: 'Chair', signDescription: 'Make a "C" shape with your dominant hand and tap it on top of your non-dominant hand twice', category: 'Furniture', location: 'Kitchen', dateCreated: '2024-01-09', timesReviewed: 8, accuracy: 88 },
  { id: 'anchor-3', objectName: 'Book', signWord: 'Book', signDescription: 'Place your palms together, then open them like opening a book', category: 'Objects', location: 'Bedroom', dateCreated: '2024-01-08', timesReviewed: 15, accuracy: 92 },
  { id: 'anchor-4', objectName: 'Table', signWord: 'Table', signDescription: 'Rest your forearms together in front of you to represent a flat surface', category: 'Furniture', location: 'Kitchen', dateCreated: '2024-01-07', timesReviewed: 10, accuracy: 65 },
  { id: 'anchor-5', objectName: 'Window', signWord: 'Window', signDescription: 'Place one hand on top of the other, then move the top hand up and down like opening a window', category: 'Home', location: 'Living Room', dateCreated: '2024-01-06', timesReviewed: 6, accuracy: 50 },
];

// ── Sign descriptions for COCO objects ────────────────────────────────────────
const SIGN_DESCRIPTIONS: Record<string, string> = {
  Cup: 'Curve your dominant hand into a "C" shape and bring it up as if drinking.',
  Bottle: 'Hold one fist on top of your other open palm, then lift the top hand upward.',
  Book: 'Place your palms together then open them outward like opening a book.',
  Laptop: 'Open and close both hands while moving them apart, like opening a laptop.',
  Chair: 'Make a "C" shape and tap it twice on top of your non-dominant hand.',
  Couch: 'Extend both flat hands parallel, then lower them slightly like sitting down.',
  'Potted Plant': 'Spread fingers of one hand upward from a fist, like a plant growing.',
  Cat: 'Pull two fingers from your upper lip outward like cat whiskers.',
  Dog: 'Snap fingers then pat your thigh like calling a dog.',
  Person: 'Hold the "P" handshape and move it down in front of your body.',
  Car: 'Mime holding a steering wheel with both fists and make small turning motions.',
  Clock: 'Tap your wrist with your index finger like pointing to a watch.',
  Vase: 'Form a "V" handshape and move it from bottom to top like a vase.',
  Lamp: 'Open a closed fist upward like light spreading from a lamp.',
};

const getSignDescription = (name: string): string =>
  SIGN_DESCRIPTIONS[name] ?? `Sign for ${name.toLowerCase()} — point to or trace the shape of the object.`;

export function VocabularyTaggingFlow({ onExit }: VocabularyTaggingFlowProps) {
  const { selectedLanguage } = useApp();

  // ── Camera refs ────────────────────────────────────────────────────────────
  const videoRef  = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const detector  = useObjectDetection(videoRef, canvasRef);

  // ── Step state ─────────────────────────────────────────────────────────────
  const [currentStep, setCurrentStep] = useState<TaggingStep>('camera');
  const [capturedObjects, setCapturedObjects] = useState<DetectedObjectResult[]>([]);
  const [selectedObject, setSelectedObject]   = useState<DetectedObjectResult | null>(null);
  const [newLabel, setNewLabel]   = useState('');
  const [newLocation, setNewLocation] = useState('');

  // ── Vocabulary state ───────────────────────────────────────────────────────
  const [anchors, setAnchors]           = useState<VocabularyAnchor[]>(INITIAL_ANCHORS);
  const [searchQuery, setSearchQuery]   = useState('');
  const [filterCategory, setFilterCategory] = useState<string | null>(null);
  const [viewMode, setViewMode]         = useState<'list' | 'grid'>('list');

  // ── Edit state ─────────────────────────────────────────────────────────────
  const [editingAnchor, setEditingAnchor] = useState<VocabularyAnchor | null>(null);
  const [editWord, setEditWord]       = useState('');
  const [editDesc, setEditDesc]       = useState('');
  const [editLocation, setEditLocation] = useState('');

  // ── Practice state ─────────────────────────────────────────────────────────
  const [practiceQueue, setPracticeQueue] = useState<VocabularyAnchor[]>([]);
  const [practiceIndex, setPracticeIndex] = useState(0);
  const [practiceResult, setPracticeResult] = useState<'correct' | 'incorrect' | null>(null);
  const [showSignInPractice, setShowSignInPractice] = useState(false);
  const [practiceStats, setPracticeStats] = useState({ correct: 0, incorrect: 0 });
  const [practiceComplete, setPracticeComplete] = useState(false);

  // ── Derived ────────────────────────────────────────────────────────────────
  const categories = Array.from(new Set(anchors.map(a => a.category)));
  const filteredAnchors = anchors.filter(a => {
    const q = searchQuery.toLowerCase();
    return (a.objectName.toLowerCase().includes(q) || a.signWord.toLowerCase().includes(q))
      && (!filterCategory || a.category === filterCategory);
  });

  // ── Handlers ───────────────────────────────────────────────────────────────

  const handleStartCamera = useCallback(async () => {
    await detector.start();
  }, [detector]);

  const handleScan = useCallback(() => {
    const live = detector.capture();
    if (live.length > 0) {
      setCapturedObjects(live);
      setCurrentStep('recognition');
    }
    // If nothing detected yet, keep scanning — the live detections are shown on canvas
  }, [detector]);

  const handleSelectObject = (obj: DetectedObjectResult) => {
    setSelectedObject(obj);
    setNewLabel(obj.name);
    setNewLocation('');
    setCurrentStep('placement');
  };

  const handleSaveAnchor = () => {
    if (!selectedObject) return;
    const anchor: VocabularyAnchor = {
      id: `anchor-${Date.now()}`,
      objectName: selectedObject.name,
      signWord: newLabel || selectedObject.name,
      signDescription: getSignDescription(newLabel || selectedObject.name),
      category: selectedObject.category,
      location: newLocation || 'My Room',
      dateCreated: new Date().toISOString().split('T')[0],
      timesReviewed: 0,
      accuracy: 0,
    };
    setAnchors(prev => [anchor, ...prev]);
    setSelectedObject(null);
    setNewLabel('');
    setNewLocation('');
    detector.stop();
    setCurrentStep('management');
  };

  const handleDeleteAnchor = (id: string) => {
    setAnchors(prev => prev.filter(a => a.id !== id));
  };

  const handleOpenEdit = (anchor: VocabularyAnchor) => {
    setEditingAnchor(anchor);
    setEditWord(anchor.signWord);
    setEditDesc(anchor.signDescription);
    setEditLocation(anchor.location);
    setCurrentStep('edit');
  };

  const handleSaveEdit = () => {
    if (!editingAnchor) return;
    setAnchors(prev => prev.map(a => a.id === editingAnchor.id
      ? { ...a, signWord: editWord, signDescription: editDesc, location: editLocation }
      : a
    ));
    setCurrentStep('management');
    setEditingAnchor(null);
  };

  const startPractice = (queue: VocabularyAnchor[]) => {
    if (queue.length === 0) return;
    setPracticeQueue(queue);
    setPracticeIndex(0);
    setPracticeResult(null);
    setShowSignInPractice(false);
    setPracticeStats({ correct: 0, incorrect: 0 });
    setPracticeComplete(false);
    setCurrentStep('practice');
  };

  const handlePracticeAnswer = (correct: boolean) => {
    const anchor = practiceQueue[practiceIndex];
    // Update accuracy on the anchor
    setAnchors(prev => prev.map(a => {
      if (a.id !== anchor.id) return a;
      const newReviews = a.timesReviewed + 1;
      const newAccuracy = Math.round(
        ((a.accuracy / 100) * a.timesReviewed + (correct ? 1 : 0)) / newReviews * 100
      );
      return { ...a, timesReviewed: newReviews, accuracy: newAccuracy };
    }));
    setPracticeStats(prev => ({
      correct:   prev.correct   + (correct ? 1 : 0),
      incorrect: prev.incorrect + (correct ? 0 : 1),
    }));
    setPracticeResult(correct ? 'correct' : 'incorrect');

    setTimeout(() => {
      const nextIndex = practiceIndex + 1;
      if (nextIndex >= practiceQueue.length) {
        setPracticeComplete(true);
      } else {
        setPracticeIndex(nextIndex);
        setPracticeResult(null);
        setShowSignInPractice(false);
      }
    }, 900);
  };

  // ═══════════════════════════════════════════════════════════════════════════
  // SCREEN: Camera
  // ═══════════════════════════════════════════════════════════════════════════
  if (currentStep === 'camera') {
    return (
      <div className="min-h-screen bg-black text-white flex flex-col" role="main" aria-labelledby="camera-title">
        <div className="p-5 flex items-center justify-between flex-shrink-0">
          <h1 id="camera-title" className="text-xl font-bold">Scan Object</h1>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" onClick={() => setCurrentStep('management')}
              className="w-10 h-10 rounded-full bg-gray-900" aria-label="My Vocabulary">
              <BookmarkCheck className="w-5 h-5" />
            </Button>
            <Button variant="ghost" size="icon" onClick={() => { detector.stop(); onExit(); }}
              className="w-10 h-10 rounded-full bg-gray-900" aria-label="Exit">
              <X className="w-5 h-5" />
            </Button>
          </div>
        </div>

        {/* Camera view */}
        <div className="flex-1 relative bg-gray-950 mx-4 rounded-2xl overflow-hidden min-h-64">
          <video ref={videoRef} autoPlay playsInline muted
            className="w-full h-full object-cover"
            style={{ transform: 'scaleX(-1)', display: detector.ready ? 'block' : 'none' }}
            aria-label="Camera feed for object detection" />
          <canvas ref={canvasRef}
            className="absolute inset-0 w-full h-full pointer-events-none"
            style={{ transform: 'scaleX(-1)' }}
            aria-hidden />

          {/* Not started state */}
          {!detector.ready && !detector.loading && !detector.error && (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-4">
              <div className="w-24 h-24 rounded-full bg-blue-600/20 flex items-center justify-center">
                <Camera className="w-12 h-12 text-blue-500" />
              </div>
              <p className="text-gray-400 text-sm text-center px-6">
                Tap Enable Camera to start detecting objects in real time
              </p>
              <Button onClick={handleStartCamera}
                className="bg-blue-600 hover:bg-blue-700 px-6 h-11 rounded-full font-semibold">
                <Camera className="w-4 h-4 mr-2" /> Enable Camera
              </Button>
            </div>
          )}

          {/* Loading state */}
          {detector.loading && (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-black/80">
              <Loader2 className="w-10 h-10 text-blue-500 animate-spin" />
              <p className="text-sm text-gray-300">Loading object detection model…</p>
              <p className="text-xs text-gray-500">First load may take 10–20 seconds</p>
            </div>
          )}

          {/* Error state */}
          {detector.error && (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 p-6 text-center">
              <AlertCircle className="w-10 h-10 text-red-500" />
              <p className="text-sm text-red-400">{detector.error}</p>
              <Button onClick={handleStartCamera} className="bg-blue-600 rounded-full px-5 h-10">
                Try Again
              </Button>
            </div>
          )}

          {/* Status bar when running */}
          {detector.ready && (
            <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/70 text-xs font-medium">
                <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                Live detection
              </div>
              {detector.detections.length > 0 && (
                <div className="px-3 py-1.5 rounded-full bg-green-600/90 text-xs font-semibold">
                  {detector.detections.length} object{detector.detections.length !== 1 ? 's' : ''} found
                </div>
              )}
            </div>
          )}
        </div>

        {/* Instructions */}
        <div className="mx-4 mt-3 mb-3 bg-gray-900 rounded-xl p-4">
          <h3 className="font-semibold mb-2 flex items-center gap-2 text-sm">
            <Sparkles className="w-4 h-4 text-blue-500" /> How to scan objects
          </h3>
          <ol className="space-y-1 text-xs text-gray-400">
            <li><span className="text-blue-500 mr-1.5">1.</span>Enable camera and point at any household object</li>
            <li><span className="text-blue-500 mr-1.5">2.</span>Wait for the cyan bounding box to appear</li>
            <li><span className="text-blue-500 mr-1.5">3.</span>Tap Capture Objects to tag them with {selectedLanguage} signs</li>
          </ol>
        </div>

        {/* Scan / Capture button */}
        <div className="p-4 border-t border-gray-900">
          {!detector.ready ? (
            <Button onClick={handleStartCamera} disabled={detector.loading}
              className="w-full bg-blue-600 hover:bg-blue-700 h-14 text-base font-semibold rounded-full disabled:opacity-50">
              {detector.loading
                ? <><Loader2 className="w-5 h-5 mr-2 animate-spin" />Loading Model…</>
                : <><Camera className="w-5 h-5 mr-2" />Enable Camera</>}
            </Button>
          ) : (
            <Button
              onClick={handleScan}
              disabled={detector.detections.length === 0}
              className="w-full bg-blue-600 hover:bg-blue-700 h-14 text-base font-semibold rounded-full disabled:opacity-50"
              aria-label="Capture detected objects">
              <Camera className="w-5 h-5 mr-2" />
              {detector.detections.length > 0
                ? `Capture ${detector.detections.length} Object${detector.detections.length !== 1 ? 's' : ''}`
                : 'Waiting for Objects…'}
            </Button>
          )}
        </div>
      </div>
    );
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // SCREEN: Recognition results
  // ═══════════════════════════════════════════════════════════════════════════
  if (currentStep === 'recognition') {
    return (
      <div className="min-h-screen bg-black text-white flex flex-col" role="main" aria-labelledby="recognition-title">
        <div className="p-5 flex items-center gap-3 flex-shrink-0">
          <Button variant="ghost" size="icon" onClick={() => setCurrentStep('camera')}
            className="w-10 h-10 rounded-full bg-gray-900" aria-label="Back to camera">
            <ChevronLeft className="w-5 h-5" />
          </Button>
          <h1 id="recognition-title" className="text-xl font-bold flex-1">Objects Found</h1>
          <span className="px-3 py-1 rounded-full bg-green-600/20 text-green-400 text-sm font-semibold">
            {capturedObjects.length} detected
          </span>
        </div>

        <p className="px-5 mb-4 text-sm text-gray-400">
          Tap an object to tag it with its {selectedLanguage} sign
        </p>

        <div className="flex-1 px-4 pb-4 overflow-y-auto space-y-3">
          {capturedObjects.map((obj, i) => (
            <motion.button key={obj.id}
              initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.08 }}
              onClick={() => handleSelectObject(obj)}
              className="w-full bg-gray-900 rounded-xl p-4 text-left hover:bg-gray-800 transition-colors"
              aria-label={`Tag ${obj.name} with ${selectedLanguage} sign`}>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-blue-600/20 flex items-center justify-center" aria-hidden>
                    <Camera className="w-6 h-6 text-blue-500" />
                  </div>
                  <div>
                    <p className="font-semibold text-lg">{obj.name}</p>
                    <p className="text-sm text-gray-400">{obj.category}</p>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-600" />
              </div>
              <div>
                <div className="flex justify-between text-xs text-gray-500 mb-1">
                  <span>Confidence</span>
                  <span>{Math.round(obj.confidence * 100)}%</span>
                </div>
                <div className="h-2 bg-gray-800 rounded-full overflow-hidden"
                  role="progressbar" aria-valuenow={obj.confidence * 100} aria-valuemin={0} aria-valuemax={100}>
                  <div className="h-full bg-blue-500 rounded-full"
                    style={{ width: `${obj.confidence * 100}%` }} />
                </div>
              </div>
            </motion.button>
          ))}
        </div>

        <div className="p-4 border-t border-gray-900">
          <Button onClick={() => setCurrentStep('camera')} variant="ghost"
            className="w-full h-12 text-gray-400 hover:text-white" aria-label="Scan again">
            <RotateCw className="w-4 h-4 mr-2" /> Scan Again
          </Button>
        </div>
      </div>
    );
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // SCREEN: Placement / Label customization
  // ═══════════════════════════════════════════════════════════════════════════
  if (currentStep === 'placement') {
    return (
      <div className="min-h-screen bg-black text-white flex flex-col" role="main" aria-labelledby="placement-title">
        <div className="p-5 flex items-center gap-3 flex-shrink-0">
          <Button variant="ghost" size="icon" onClick={() => setCurrentStep('recognition')}
            className="w-10 h-10 rounded-full bg-gray-900" aria-label="Back">
            <ChevronLeft className="w-5 h-5" />
          </Button>
          <h1 id="placement-title" className="text-xl font-bold">Tag with Sign</h1>
        </div>

        {/* AR label preview */}
        <div className="mx-4 mb-4 bg-gray-900 rounded-2xl h-56 relative overflow-hidden">
          <div className="absolute inset-0 flex items-center justify-center">
            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="relative">
              <div className="w-36 h-36 border-4 border-dashed border-blue-500 rounded-2xl flex items-center justify-center">
                <MapPin className="w-10 h-10 text-blue-500" />
              </div>
              <motion.div animate={{ y: [0, -8, 0] }} transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                className="absolute -top-14 left-1/2 -translate-x-1/2 bg-blue-600 px-4 py-2 rounded-xl shadow-lg whitespace-nowrap text-center"
                role="status">
                <p className="text-sm font-bold">{newLabel || selectedObject?.name}</p>
                <p className="text-xs opacity-80">{selectedLanguage} Sign</p>
              </motion.div>
            </motion.div>
          </div>
          <div className="absolute top-3 left-3">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-green-600/90 text-xs font-semibold">
              <MapPin className="w-3 h-3" /> AR Label Positioned
            </div>
          </div>
        </div>

        {/* Sign info */}
        <div className="mx-4 mb-4 bg-gradient-to-br from-blue-600 to-blue-800 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-2xl">✋</span>
            <p className="font-semibold">{selectedLanguage} Sign for "{newLabel || selectedObject?.name}"</p>
          </div>
          <p className="text-sm opacity-90">{getSignDescription(newLabel || selectedObject?.name || '')}</p>
        </div>

        {/* Form */}
        <div className="flex-1 px-4 pb-4 overflow-y-auto space-y-4">
          {/* Detected info */}
          <div className="bg-gray-900 rounded-xl p-4">
            <p className="text-xs text-gray-500 mb-0.5">Detected as</p>
            <p className="font-semibold text-lg">{selectedObject?.name}</p>
            <p className="text-sm text-gray-400">{selectedObject?.category} · {Math.round((selectedObject?.confidence ?? 0) * 100)}% confidence</p>
          </div>

          {/* Custom label */}
          <div>
            <label htmlFor="custom-label" className="block text-sm font-semibold mb-1.5">
              Custom Label <span className="text-gray-500 font-normal">(optional)</span>
            </label>
            <input id="custom-label" type="text" value={newLabel}
              onChange={e => setNewLabel(e.target.value)}
              placeholder={selectedObject?.name ?? 'Label'}
              className="w-full bg-gray-900 border border-gray-800 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
            />
          </div>

          {/* Location */}
          <div>
            <label htmlFor="location-input" className="block text-sm font-semibold mb-1.5">Location</label>
            <input id="location-input" type="text" value={newLocation}
              onChange={e => setNewLocation(e.target.value)}
              placeholder="e.g., Living Room, Kitchen"
              className="w-full bg-gray-900 border border-gray-800 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
            />
          </div>
        </div>

        <div className="p-4 border-t border-gray-900 space-y-2">
          <Button onClick={handleSaveAnchor}
            className="w-full bg-blue-600 hover:bg-blue-700 h-14 text-base font-semibold rounded-full">
            <Check className="w-5 h-5 mr-2" /> Save Anchor
          </Button>
          <Button onClick={() => setCurrentStep('recognition')} variant="ghost"
            className="w-full h-11 text-gray-400 hover:text-white">
            Cancel
          </Button>
        </div>
      </div>
    );
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // SCREEN: Edit anchor
  // ═══════════════════════════════════════════════════════════════════════════
  if (currentStep === 'edit' && editingAnchor) {
    return (
      <div className="min-h-screen bg-black text-white flex flex-col" role="main" aria-labelledby="edit-title">
        <div className="p-5 flex items-center gap-3 flex-shrink-0">
          <Button variant="ghost" size="icon" onClick={() => setCurrentStep('management')}
            className="w-10 h-10 rounded-full bg-gray-900" aria-label="Back">
            <ChevronLeft className="w-5 h-5" />
          </Button>
          <h1 id="edit-title" className="text-xl font-bold flex-1">Edit Anchor</h1>
          <Button onClick={handleSaveEdit}
            className="h-9 px-4 rounded-full bg-blue-600 hover:bg-blue-700 font-semibold text-sm">
            Save
          </Button>
        </div>

        <div className="flex-1 px-4 pb-4 overflow-y-auto space-y-4 pt-2">
          <div className="bg-gray-900 rounded-xl p-4">
            <p className="text-xs text-gray-500 mb-1">Object</p>
            <p className="font-semibold">{editingAnchor.objectName}</p>
            <p className="text-sm text-gray-400">{editingAnchor.category}</p>
          </div>

          <div>
            <label htmlFor="edit-word" className="block text-sm font-semibold mb-1.5">Sign Word</label>
            <input id="edit-word" type="text" value={editWord} onChange={e => setEditWord(e.target.value)}
              className="w-full bg-gray-900 border border-gray-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500" />
          </div>

          <div>
            <label htmlFor="edit-desc" className="block text-sm font-semibold mb-1.5">Sign Description</label>
            <textarea id="edit-desc" value={editDesc} onChange={e => setEditDesc(e.target.value)}
              rows={4} className="w-full bg-gray-900 border border-gray-800 rounded-xl px-4 py-3 text-white resize-none focus:outline-none focus:border-blue-500" />
          </div>

          <div>
            <label htmlFor="edit-location" className="block text-sm font-semibold mb-1.5">Location</label>
            <input id="edit-location" type="text" value={editLocation} onChange={e => setEditLocation(e.target.value)}
              className="w-full bg-gray-900 border border-gray-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500" />
          </div>
        </div>
      </div>
    );
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // SCREEN: Practice (flashcard mode)
  // ═══════════════════════════════════════════════════════════════════════════
  if (currentStep === 'practice') {
    if (practiceComplete) {
      const total = practiceStats.correct + practiceStats.incorrect;
      const pct = total > 0 ? Math.round((practiceStats.correct / total) * 100) : 0;
      return (
        <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-6 gap-6" role="main">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center mb-2">
            <BookmarkCheck className="w-10 h-10" />
          </div>
          <h1 className="text-2xl font-bold text-center">Session Complete!</h1>
          <div className="w-full bg-gray-900 rounded-2xl p-5 text-center space-y-4">
            <p className="text-5xl font-bold text-blue-400">{pct}%</p>
            <p className="text-gray-400">Accuracy this session</p>
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-green-600/20 rounded-xl p-3">
                <p className="text-2xl font-bold text-green-400">{practiceStats.correct}</p>
                <p className="text-xs text-gray-400">Correct</p>
              </div>
              <div className="bg-red-600/20 rounded-xl p-3">
                <p className="text-2xl font-bold text-red-400">{practiceStats.incorrect}</p>
                <p className="text-xs text-gray-400">Incorrect</p>
              </div>
            </div>
          </div>
          <Button onClick={() => startPractice(practiceQueue)}
            className="w-full h-14 bg-blue-600 hover:bg-blue-700 rounded-full font-semibold text-base">
            Practice Again
          </Button>
          <Button onClick={() => setCurrentStep('management')} variant="ghost"
            className="w-full h-12 text-gray-400 hover:text-white">
            Back to Vocabulary
          </Button>
        </div>
      );
    }

    const card = practiceQueue[practiceIndex];
    if (!card) return null;
    const progress = Math.round(((practiceIndex) / practiceQueue.length) * 100);

    return (
      <div className="min-h-screen bg-black text-white flex flex-col" role="main" aria-labelledby="practice-title">
        <div className="p-5 flex items-center gap-3 flex-shrink-0">
          <Button variant="ghost" size="icon" onClick={() => setCurrentStep('management')}
            className="w-10 h-10 rounded-full bg-gray-900" aria-label="Exit practice">
            <X className="w-5 h-5" />
          </Button>
          <div className="flex-1">
            <h1 id="practice-title" className="font-bold">Sign Practice</h1>
            <p className="text-xs text-gray-400">{practiceIndex + 1} of {practiceQueue.length}</p>
          </div>
          <div className="text-xs text-gray-400">
            <span className="text-green-400 font-semibold">{practiceStats.correct}</span>
            {' / '}
            <span className="text-red-400 font-semibold">{practiceStats.incorrect}</span>
          </div>
        </div>

        {/* Progress bar */}
        <div className="mx-4 mb-4 h-1.5 bg-gray-900 rounded-full overflow-hidden">
          <div className="h-full bg-blue-500 rounded-full transition-all" style={{ width: `${progress}%` }} />
        </div>

        {/* Flashcard */}
        <div className="flex-1 px-4 pb-4 flex flex-col gap-4">
          <AnimatePresence mode="wait">
            <motion.div key={card.id}
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
              className={`rounded-2xl p-6 transition-colors ${
                practiceResult === 'correct'   ? 'bg-green-900/40 border-2 border-green-500' :
                practiceResult === 'incorrect' ? 'bg-red-900/40 border-2 border-red-500' :
                'bg-gray-900'
              }`}>
              <div className="flex items-center justify-between mb-4">
                <span className="px-3 py-1 rounded-full bg-blue-600/20 text-blue-400 text-xs font-semibold">
                  {card.category}
                </span>
                <span className="text-xs text-gray-500">{card.location}</span>
              </div>

              <h2 className="text-4xl font-bold text-center mb-2">{card.signWord}</h2>
              <p className="text-sm text-gray-400 text-center mb-6">{card.objectName}</p>

              {/* Show/hide sign description */}
              <button
                onClick={() => setShowSignInPractice(v => !v)}
                className="w-full p-4 rounded-xl bg-gray-800 hover:bg-gray-700 transition-colors text-left mb-2"
                aria-expanded={showSignInPractice}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">✋</span>
                    <span className="font-semibold text-sm">How to sign {card.signWord}</span>
                  </div>
                  <Eye className="w-4 h-4 text-gray-400" />
                </div>
                <AnimatePresence>
                  {showSignInPractice && (
                    <motion.p initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }} className="text-sm text-gray-300 mt-3 overflow-hidden">
                      {card.signDescription}
                    </motion.p>
                  )}
                </AnimatePresence>
              </button>

              <div className="text-center text-xs text-gray-500 mt-2">
                Reviewed {card.timesReviewed} times · {card.accuracy > 0 ? `${card.accuracy}% accuracy` : 'Not practiced yet'}
              </div>

              {practiceResult && (
                <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}
                  className="flex items-center justify-center gap-2 mt-4">
                  {practiceResult === 'correct'
                    ? <><CheckCircle className="w-6 h-6 text-green-400" /><span className="text-green-400 font-semibold">Correct!</span></>
                    : <><XCircle className="w-6 h-6 text-red-400" /><span className="text-red-400 font-semibold">Keep practicing</span></>}
                </motion.div>
              )}
            </motion.div>
          </AnimatePresence>

          {/* Answer buttons */}
          {!practiceResult && (
            <div className="grid grid-cols-2 gap-3">
              <Button onClick={() => handlePracticeAnswer(false)}
                className="h-14 rounded-xl font-semibold bg-red-600/20 hover:bg-red-600/40 border border-red-600/50 text-red-400"
                aria-label="I need more practice">
                <XCircle className="w-5 h-5 mr-2" /> Need Practice
              </Button>
              <Button onClick={() => handlePracticeAnswer(true)}
                className="h-14 rounded-xl font-semibold bg-green-600/20 hover:bg-green-600/40 border border-green-600/50 text-green-400"
                aria-label="I know this sign">
                <CheckCircle className="w-5 h-5 mr-2" /> I Know It
              </Button>
            </div>
          )}
        </div>
      </div>
    );
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // SCREEN: Management (My Vocabulary)
  // ═══════════════════════════════════════════════════════════════════════════
  if (currentStep === 'management') {
    const avg = anchors.length > 0
      ? Math.round(anchors.reduce((s, a) => s + a.accuracy, 0) / anchors.length)
      : 0;
    const totalReviews = anchors.reduce((s, a) => s + a.timesReviewed, 0);

    return (
      <div className="min-h-screen bg-black text-white flex flex-col" role="main" aria-labelledby="management-title">
        <div className="p-5 pb-3 flex-shrink-0">
          <div className="flex items-center justify-between mb-4">
            <h1 id="management-title" className="text-2xl font-bold">My Vocabulary</h1>
            <Button variant="ghost" size="icon" onClick={onExit}
              className="w-10 h-10 rounded-full bg-gray-900" aria-label="Exit">
              <X className="w-5 h-5" />
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-3 mb-4">
            {[
              { label: 'Anchors',  val: anchors.length, gradient: 'from-blue-600 to-blue-800' },
              { label: 'Accuracy', val: `${avg}%`,      gradient: 'from-green-600 to-green-800' },
              { label: 'Reviews',  val: totalReviews,   gradient: 'from-purple-600 to-purple-800' },
            ].map(({ label, val, gradient }) => (
              <div key={label} className={`bg-gradient-to-br ${gradient} rounded-xl p-3 text-center`}>
                <p className="text-2xl font-bold">{val}</p>
                <p className="text-xs opacity-90">{label}</p>
              </div>
            ))}
          </div>

          {/* Search */}
          <div className="relative mb-3">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            <input type="text" value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search vocabulary…"
              className="w-full bg-gray-900 border border-gray-800 rounded-xl pl-11 pr-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 text-sm"
              aria-label="Search vocabulary" />
          </div>

          {/* Category filters + view toggle */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 overflow-x-auto pb-1">
              {[null, ...categories].map(cat => (
                <Button key={cat ?? 'all'} variant="ghost" size="sm"
                  onClick={() => setFilterCategory(cat)}
                  className={`rounded-full whitespace-nowrap text-xs flex-shrink-0 ${filterCategory === cat ? 'bg-blue-600 text-white' : 'bg-gray-900 text-gray-400'}`}
                  aria-pressed={filterCategory === cat}>
                  {cat ?? 'All'}
                </Button>
              ))}
            </div>
            <div className="flex gap-1 ml-2">
              {(['list', 'grid'] as const).map(m => (
                <Button key={m} variant="ghost" size="icon"
                  onClick={() => setViewMode(m)}
                  className={`w-8 h-8 ${viewMode === m ? 'bg-gray-900' : ''}`}
                  aria-label={`${m} view`} aria-pressed={viewMode === m}>
                  {m === 'list' ? <List className="w-4 h-4" /> : <Grid3x3 className="w-4 h-4" />}
                </Button>
              ))}
            </div>
          </div>
        </div>

        {/* Anchors */}
        <div className="flex-1 px-4 pb-4 overflow-y-auto">
          {filteredAnchors.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 gap-3 text-gray-500">
              <AlertCircle className="w-10 h-10" />
              <p className="text-center text-sm">No vocabulary anchors found</p>
              {searchQuery && (
                <Button variant="ghost" size="sm" onClick={() => setSearchQuery('')}
                  className="text-blue-500">Clear search</Button>
              )}
            </div>
          ) : viewMode === 'list' ? (
            <div className="space-y-3">
              {filteredAnchors.map((anchor, i) => (
                <motion.div key={anchor.id} className="bg-gray-900 rounded-xl p-4"
                  initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}>
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold text-lg truncate">{anchor.signWord}</h3>
                        <span className="px-2 py-0.5 bg-blue-600/20 text-blue-400 text-xs rounded-full flex-shrink-0">
                          {anchor.category}
                        </span>
                      </div>
                      <p className="text-sm text-gray-400 mb-1 line-clamp-2">{anchor.signDescription}</p>
                      <div className="flex items-center gap-3 text-xs text-gray-500">
                        <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{anchor.location}</span>
                        <span>·</span>
                        <span>{anchor.timesReviewed} reviews</span>
                      </div>
                    </div>
                    <div className="flex gap-1 ml-2">
                      <Button variant="ghost" size="icon"
                        onClick={() => startPractice([anchor])}
                        className="w-9 h-9 rounded-full hover:bg-gray-800"
                        aria-label={`Practice ${anchor.signWord}`}>
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="icon"
                        onClick={() => handleOpenEdit(anchor)}
                        className="w-9 h-9 rounded-full hover:bg-gray-800"
                        aria-label={`Edit ${anchor.signWord}`}>
                        <Edit2 className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="icon"
                        onClick={() => handleDeleteAnchor(anchor.id)}
                        className="w-9 h-9 rounded-full hover:bg-red-600/20 text-red-500"
                        aria-label={`Delete ${anchor.signWord}`}>
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                  <div className="pt-3 border-t border-gray-800">
                    <div className="flex justify-between text-xs text-gray-500 mb-1">
                      <span>Mastery</span>
                      <span className={anchor.accuracy >= 90 ? 'text-green-400' : anchor.accuracy >= 70 ? 'text-blue-400' : 'text-orange-400'}>
                        {anchor.accuracy}%
                      </span>
                    </div>
                    <div className="h-1.5 bg-gray-800 rounded-full overflow-hidden"
                      role="progressbar" aria-valuenow={anchor.accuracy} aria-valuemin={0} aria-valuemax={100}>
                      <div className={`h-full rounded-full ${anchor.accuracy >= 90 ? 'bg-green-500' : anchor.accuracy >= 70 ? 'bg-blue-500' : 'bg-orange-500'}`}
                        style={{ width: `${anchor.accuracy}%` }} />
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3">
              {filteredAnchors.map((anchor, i) => (
                <motion.div key={anchor.id} className="bg-gray-900 rounded-xl p-4"
                  initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.04 }}>
                  <div className="flex items-center justify-between mb-3">
                    <div className="w-10 h-10 rounded-full bg-blue-600/20 flex items-center justify-center">
                      <MapPin className="w-5 h-5 text-blue-500" />
                    </div>
                    <div className="flex gap-1">
                      <Button variant="ghost" size="icon" onClick={() => startPractice([anchor])}
                        className="w-7 h-7 rounded-full" aria-label={`Practice ${anchor.signWord}`}>
                        <Eye className="w-3 h-3" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => handleOpenEdit(anchor)}
                        className="w-7 h-7 rounded-full" aria-label={`Edit ${anchor.signWord}`}>
                        <Edit2 className="w-3 h-3" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => handleDeleteAnchor(anchor.id)}
                        className="w-7 h-7 rounded-full text-red-500 hover:bg-red-600/20" aria-label={`Delete ${anchor.signWord}`}>
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                  <h3 className="font-semibold truncate mb-1">{anchor.signWord}</h3>
                  <p className="text-xs text-gray-400 mb-2">{anchor.location}</p>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-gray-500">{anchor.timesReviewed} reviews</span>
                    <span className={`font-semibold ${anchor.accuracy >= 90 ? 'text-green-400' : anchor.accuracy >= 70 ? 'text-blue-400' : 'text-orange-400'}`}>
                      {anchor.accuracy}%
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>

        {/* Bottom actions */}
        <div className="p-4 border-t border-gray-900 space-y-2">
          <Button onClick={() => { setCurrentStep('camera'); }}
            className="w-full h-14 bg-blue-600 hover:bg-blue-700 rounded-full font-semibold text-base">
            <Plus className="w-5 h-5 mr-2" /> Scan New Object
          </Button>
          {anchors.length > 0 && (
            <Button onClick={() => startPractice([...anchors].sort(() => Math.random() - 0.5))}
              variant="ghost" className="w-full h-12 text-gray-300 hover:text-white">
              <BookmarkCheck className="w-4 h-4 mr-2" /> Practice All ({anchors.length})
            </Button>
          )}
        </div>
      </div>
    );
  }

  return null;
}
