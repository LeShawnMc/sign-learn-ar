import { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, 
  Camera, 
  Check,
  Plus,
  Edit2,
  Trash2,
  Eye,
  MapPin,
  ChevronRight,
  Sparkles,
  Search,
  Filter,
  Grid3x3,
  List,
  BookmarkCheck,
  Target,
  RotateCw,
  Zap,
  AlertCircle
} from 'lucide-react';
import { useApp } from '../context/AppContext';

type TaggingStep = 
  | 'camera'
  | 'recognition'
  | 'placement'
  | 'management'
  | 'review';

interface RecognizedObject {
  id: string;
  name: string;
  confidence: number;
  boundingBox: { x: number; y: number; width: number; height: number };
  category: string;
}

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

export function VocabularyTaggingFlow({ onExit }: VocabularyTaggingFlowProps) {
  const { selectedLanguage } = useApp();
  const [currentStep, setCurrentStep] = useState<TaggingStep>('camera');
  const [isScanning, setIsScanning] = useState(false);
  const [recognizedObjects, setRecognizedObjects] = useState<RecognizedObject[]>([]);
  const [selectedObject, setSelectedObject] = useState<RecognizedObject | null>(null);
  const [vocabularyAnchors, setVocabularyAnchors] = useState<VocabularyAnchor[]>([
    {
      id: 'anchor-1',
      objectName: 'Door',
      signWord: 'Door',
      signDescription: 'Hold both hands flat, palms facing forward, then swing them open like a door',
      category: 'Home',
      location: 'Living Room',
      dateCreated: '2024-01-10',
      timesReviewed: 12,
      accuracy: 95,
    },
    {
      id: 'anchor-2',
      objectName: 'Chair',
      signWord: 'Chair',
      signDescription: 'Make a "C" shape with your dominant hand and tap it on top of your non-dominant hand twice',
      category: 'Furniture',
      location: 'Kitchen',
      dateCreated: '2024-01-09',
      timesReviewed: 8,
      accuracy: 88,
    },
    {
      id: 'anchor-3',
      objectName: 'Book',
      signWord: 'Book',
      signDescription: 'Place your palms together, then open them like opening a book',
      category: 'Objects',
      location: 'Bedroom',
      dateCreated: '2024-01-08',
      timesReviewed: 15,
      accuracy: 92,
    },
    {
      id: 'anchor-4',
      objectName: 'Table',
      signWord: 'Table',
      signDescription: 'Rest your forearms together in front of you to represent a flat surface',
      category: 'Furniture',
      location: 'Kitchen',
      dateCreated: '2024-01-07',
      timesReviewed: 10,
      accuracy: 90,
    },
    {
      id: 'anchor-5',
      objectName: 'Window',
      signWord: 'Window',
      signDescription: 'Place one hand on top of the other, then move the top hand up and down like opening a window',
      category: 'Home',
      location: 'Living Room',
      dateCreated: '2024-01-06',
      timesReviewed: 6,
      accuracy: 85,
    },
  ]);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState<string | null>(null);
  const [newAnchorData, setNewAnchorData] = useState({
    customLabel: '',
    location: '',
  });

  // Simulated object recognition
  const simulateObjectRecognition = () => {
    setIsScanning(true);
    setTimeout(() => {
      const objects: RecognizedObject[] = [
        {
          id: 'obj-1',
          name: 'Coffee Mug',
          confidence: 0.94,
          boundingBox: { x: 120, y: 180, width: 100, height: 120 },
          category: 'Kitchen',
        },
        {
          id: 'obj-2',
          name: 'Lamp',
          confidence: 0.89,
          boundingBox: { x: 240, y: 120, width: 80, height: 140 },
          category: 'Lighting',
        },
        {
          id: 'obj-3',
          name: 'Plant',
          confidence: 0.86,
          boundingBox: { x: 50, y: 220, width: 90, height: 110 },
          category: 'Decoration',
        },
      ];
      setRecognizedObjects(objects);
      setIsScanning(false);
      setCurrentStep('recognition');
    }, 2000);
  };

  const handleSelectObject = (object: RecognizedObject) => {
    setSelectedObject(object);
    setCurrentStep('placement');
  };

  const handleSaveAnchor = () => {
    if (selectedObject) {
      const newAnchor: VocabularyAnchor = {
        id: `anchor-${Date.now()}`,
        objectName: selectedObject.name,
        signWord: newAnchorData.customLabel || selectedObject.name,
        signDescription: `Sign for ${selectedObject.name.toLowerCase()}`,
        category: selectedObject.category,
        location: newAnchorData.location || 'Unknown',
        dateCreated: new Date().toISOString().split('T')[0],
        timesReviewed: 0,
        accuracy: 0,
      };
      setVocabularyAnchors(prev => [newAnchor, ...prev]);
      setCurrentStep('management');
      setNewAnchorData({ customLabel: '', location: '' });
      setSelectedObject(null);
    }
  };

  const handleDeleteAnchor = (id: string) => {
    setVocabularyAnchors(prev => prev.filter(a => a.id !== id));
  };

  const filteredAnchors = vocabularyAnchors.filter(anchor => {
    const matchesSearch = anchor.objectName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         anchor.signWord.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = !filterCategory || anchor.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  const categories = Array.from(new Set(vocabularyAnchors.map(a => a.category)));

  // Camera View Screen
  if (currentStep === 'camera') {
    return (
      <div 
        className="min-h-screen bg-black text-white flex flex-col"
        role="main"
        aria-labelledby="camera-title"
      >
        {/* Header */}
        <div className="p-6 flex items-center justify-between">
          <h1 id="camera-title" className="text-xl font-bold">Scan Object</h1>
          <Button
            variant="ghost"
            size="icon"
            onClick={onExit}
            className="w-10 h-10 rounded-full hover:bg-gray-900"
            aria-label="Exit vocabulary tagging"
          >
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* Camera View */}
        <div className="flex-1 relative bg-gray-900 mx-6 mb-6 rounded-2xl overflow-hidden">
          {/* Simulated camera feed */}
          <div className="absolute inset-0 flex items-center justify-center">
            {/* Scanning frame */}
            <motion.div
              animate={isScanning ? {
                scale: [1, 1.05, 1],
                opacity: [0.5, 0.8, 0.5]
              } : {}}
              transition={{
                duration: 1.5,
                repeat: isScanning ? Infinity : 0,
              }}
              className="relative w-64 h-64"
            >
              {/* Dotted border frame */}
              <div 
                className="absolute inset-0 border-4 border-dashed border-blue-500 rounded-2xl"
                aria-hidden="true"
              />
              
              {/* Corner markers */}
              <div className="absolute -top-1 -left-1 w-8 h-8 border-t-4 border-l-4 border-blue-500" aria-hidden="true" />
              <div className="absolute -top-1 -right-1 w-8 h-8 border-t-4 border-r-4 border-blue-500" aria-hidden="true" />
              <div className="absolute -bottom-1 -left-1 w-8 h-8 border-b-4 border-l-4 border-blue-500" aria-hidden="true" />
              <div className="absolute -bottom-1 -right-1 w-8 h-8 border-b-4 border-r-4 border-blue-500" aria-hidden="true" />

              {/* Camera icon in center */}
              {!isScanning && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-16 h-16 rounded-full bg-blue-600/20 flex items-center justify-center" aria-hidden="true">
                    <Camera className="w-8 h-8 text-blue-500" />
                  </div>
                </div>
              )}

              {/* Scanning animation */}
              {isScanning && (
                <motion.div
                  animate={{ y: [-100, 100] }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                  className="absolute left-0 right-0 h-1 bg-blue-500"
                  style={{ top: '50%' }}
                  aria-hidden="true"
                />
              )}
            </motion.div>
          </div>

          {/* Status indicator */}
          <div className="absolute top-4 left-4 right-4">
            <div className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium ${
              isScanning ? 'bg-blue-600' : 'bg-gray-800'
            }`} role="status" aria-live="polite">
              {isScanning ? (
                <>
                  <motion.div 
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  >
                    <RotateCw className="w-4 h-4" />
                  </motion.div>
                  <span>Scanning for objects...</span>
                </>
              ) : (
                <>
                  <Target className="w-4 h-4" />
                  <span>Position object in frame</span>
                </>
              )}
            </div>
          </div>

          {/* Quick access button */}
          <div className="absolute top-4 right-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setCurrentStep('management')}
              className="w-10 h-10 rounded-full bg-black/50 hover:bg-black/70"
              aria-label="View saved anchors"
            >
              <BookmarkCheck className="w-5 h-5" />
            </Button>
          </div>
        </div>

        {/* Instructions */}
        <div className="px-6 mb-6">
          <div className="bg-gray-900 rounded-xl p-4">
            <h3 className="font-semibold mb-2 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-blue-500" />
              How to scan objects
            </h3>
            <ul className="space-y-2 text-sm text-gray-400" role="list">
              <li className="flex items-start gap-2">
                <span className="text-blue-500 mt-0.5">1.</span>
                <span>Point your camera at an object you want to learn</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-500 mt-0.5">2.</span>
                <span>Center the object within the frame</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-500 mt-0.5">3.</span>
                <span>Tap scan to identify and tag with sign language</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Scan Button */}
        <div className="p-6 border-t border-gray-900">
          <Button
            onClick={simulateObjectRecognition}
            disabled={isScanning}
            className="w-full bg-blue-600 hover:bg-blue-700 h-14 text-lg font-semibold rounded-full disabled:opacity-50"
            aria-label={isScanning ? 'Scanning in progress' : 'Start scanning'}
          >
            {isScanning ? (
              <>
                <RotateCw className="w-5 h-5 mr-2 animate-spin" />
                Scanning...
              </>
            ) : (
              <>
                <Camera className="w-5 h-5 mr-2" />
                Scan Object
              </>
            )}
          </Button>
        </div>
      </div>
    );
  }

  // Object Recognition Screen
  if (currentStep === 'recognition') {
    return (
      <div 
        className="min-h-screen bg-black text-white flex flex-col"
        role="main"
        aria-labelledby="recognition-title"
      >
        {/* Header */}
        <div className="p-6 flex items-center justify-between">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setCurrentStep('camera')}
            className="w-10 h-10 rounded-full hover:bg-gray-900"
            aria-label="Back to camera"
          >
            <X className="w-5 h-5" />
          </Button>
          <h1 id="recognition-title" className="text-xl font-bold">Objects Found</h1>
          <div className="w-10" aria-hidden="true" />
        </div>

        {/* Preview Image */}
        <div className="px-6 mb-6">
          <div className="bg-gray-900 rounded-2xl h-64 relative overflow-hidden">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-gray-600 text-sm">Camera preview</div>
            </div>
            
            {/* Recognized object overlays */}
            {recognizedObjects.map((obj) => (
              <motion.div
                key={obj.id}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="absolute border-2 border-green-500 rounded-lg"
                style={{
                  left: obj.boundingBox.x,
                  top: obj.boundingBox.y,
                  width: obj.boundingBox.width,
                  height: obj.boundingBox.height,
                }}
                aria-label={`Detected ${obj.name} with ${Math.round(obj.confidence * 100)}% confidence`}
              >
                <div className="absolute -top-8 left-0 bg-green-500 px-2 py-1 rounded text-xs font-semibold whitespace-nowrap">
                  {obj.name} {Math.round(obj.confidence * 100)}%
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Results Info */}
        <div className="px-6 mb-4">
          <div className="flex items-center gap-2 text-sm text-gray-400">
            <Check className="w-4 h-4 text-green-500" />
            <span>{recognizedObjects.length} objects detected</span>
          </div>
        </div>

        {/* Recognized Objects List */}
        <div className="flex-1 px-6 pb-6 overflow-y-auto">
          <div className="space-y-3">
            {recognizedObjects.map((obj, index) => (
              <motion.button
                key={obj.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                onClick={() => handleSelectObject(obj)}
                className="w-full bg-gray-900 rounded-xl p-4 text-left hover:bg-gray-800 transition-colors"
                aria-label={`Select ${obj.name} to tag with sign language`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-green-600/20 flex items-center justify-center" aria-hidden="true">
                      <Zap className="w-6 h-6 text-green-500" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg">{obj.name}</h3>
                      <p className="text-sm text-gray-400">{obj.category}</p>
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-600" />
                </div>

                {/* Confidence bar */}
                <div className="mt-3">
                  <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
                    <span>Confidence</span>
                    <span>{Math.round(obj.confidence * 100)}%</span>
                  </div>
                  <div className="h-2 bg-gray-800 rounded-full overflow-hidden" role="progressbar" aria-valuenow={obj.confidence * 100} aria-valuemin={0} aria-valuemax={100}>
                    <div 
                      className="h-full bg-green-500"
                      style={{ width: `${obj.confidence * 100}%` }}
                    />
                  </div>
                </div>
              </motion.button>
            ))}
          </div>
        </div>

        {/* Bottom Actions */}
        <div className="p-6 border-t border-gray-900">
          <Button
            onClick={() => setCurrentStep('camera')}
            variant="ghost"
            className="w-full h-12"
            aria-label="Scan again"
          >
            Scan Again
          </Button>
        </div>
      </div>
    );
  }

  // Label Placement/Customization Screen
  if (currentStep === 'placement') {
    return (
      <div 
        className="min-h-screen bg-black text-white flex flex-col"
        role="main"
        aria-labelledby="placement-title"
      >
        {/* Header */}
        <div className="p-6 flex items-center justify-between">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setCurrentStep('recognition')}
            className="w-10 h-10 rounded-full hover:bg-gray-900"
            aria-label="Back to recognition"
          >
            <X className="w-5 h-5" />
          </Button>
          <h1 id="placement-title" className="text-xl font-bold">Place Label</h1>
          <div className="w-10" aria-hidden="true" />
        </div>

        {/* AR View with Label */}
        <div className="px-6 mb-6">
          <div className="bg-gray-900 rounded-2xl h-80 relative overflow-hidden">
            <div className="absolute inset-0 flex items-center justify-center">
              {/* AR anchor visualization */}
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="relative"
              >
                {/* Object outline */}
                <div className="w-40 h-40 border-4 border-dashed border-blue-500 rounded-2xl flex items-center justify-center" aria-hidden="true">
                  <MapPin className="w-12 h-12 text-blue-500" />
                </div>

                {/* Floating label */}
                <motion.div
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute -top-16 left-1/2 -translate-x-1/2 bg-blue-600 px-4 py-2 rounded-lg shadow-lg whitespace-nowrap"
                  role="status"
                  aria-live="polite"
                >
                  <div className="text-sm font-semibold">
                    {newAnchorData.customLabel || selectedObject?.name || 'Object'}
                  </div>
                  <div className="text-xs opacity-80">{selectedLanguage} Sign</div>
                </motion.div>

                {/* Anchor points */}
                <div className="absolute top-0 left-1/2 w-1 h-8 bg-blue-500 -translate-x-1/2 -translate-y-full" aria-hidden="true" />
                <div className="absolute top-0 left-1/2 w-3 h-3 rounded-full bg-blue-500 -translate-x-1/2 -translate-y-full" aria-hidden="true" />
              </motion.div>
            </div>

            {/* Status */}
            <div className="absolute top-4 left-4 right-4">
              <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-green-600 text-sm font-medium" role="status">
                <MapPin className="w-4 h-4" />
                <span>Label Positioned</span>
              </div>
            </div>
          </div>
        </div>

        {/* Customization Form */}
        <div className="flex-1 px-6 pb-6 overflow-y-auto">
          <div className="space-y-4">
            {/* Object Info */}
            <div className="bg-gray-900 rounded-xl p-4">
              <div className="text-sm text-gray-400 mb-1">Recognized as</div>
              <div className="text-lg font-semibold">{selectedObject?.name}</div>
              <div className="text-sm text-gray-400 mt-1">{selectedObject?.category}</div>
            </div>

            {/* Custom Label Input */}
            <div>
              <label htmlFor="custom-label" className="block text-sm font-semibold mb-2">
                Custom Label (Optional)
              </label>
              <input
                id="custom-label"
                type="text"
                value={newAnchorData.customLabel}
                onChange={(e) => setNewAnchorData(prev => ({ ...prev, customLabel: e.target.value }))}
                placeholder={selectedObject?.name || 'Enter custom name'}
                className="w-full bg-gray-900 border border-gray-800 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
                aria-describedby="label-description"
              />
              <p id="label-description" className="text-xs text-gray-500 mt-1">
                Override the detected name with your own label
              </p>
            </div>

            {/* Location Input */}
            <div>
              <label htmlFor="location" className="block text-sm font-semibold mb-2">
                Location
              </label>
              <input
                id="location"
                type="text"
                value={newAnchorData.location}
                onChange={(e) => setNewAnchorData(prev => ({ ...prev, location: e.target.value }))}
                placeholder="e.g., Living Room, Kitchen, Bedroom"
                className="w-full bg-gray-900 border border-gray-800 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
                aria-describedby="location-description"
              />
              <p id="location-description" className="text-xs text-gray-500 mt-1">
                Where is this object located?
              </p>
            </div>

            {/* Sign Preview */}
            <div className="bg-gradient-to-br from-blue-600 to-blue-800 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center" aria-hidden="true">
                  ✋
                </div>
                <div className="font-semibold">{selectedLanguage} Sign</div>
              </div>
              <p className="text-sm opacity-90">
                This object will be tagged with the sign for "{newAnchorData.customLabel || selectedObject?.name}". 
                You can practice this sign whenever you see this object.
              </p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="p-6 border-t border-gray-900 space-y-3">
          <Button
            onClick={handleSaveAnchor}
            className="w-full bg-blue-600 hover:bg-blue-700 h-14 text-lg font-semibold rounded-full"
            aria-label="Save vocabulary anchor"
          >
            <Check className="w-5 h-5 mr-2" />
            Save Anchor
          </Button>
          <Button
            onClick={() => setCurrentStep('recognition')}
            variant="ghost"
            className="w-full h-12 text-gray-400 hover:text-white"
            aria-label="Cancel and go back"
          >
            Cancel
          </Button>
        </div>
      </div>
    );
  }

  // Saved Anchors Management Screen
  if (currentStep === 'management') {
    return (
      <div 
        className="min-h-screen bg-black text-white flex flex-col"
        role="main"
        aria-labelledby="management-title"
      >
        {/* Header */}
        <div className="p-6 pb-4">
          <div className="flex items-center justify-between mb-4">
            <h1 id="management-title" className="text-2xl font-bold">My Vocabulary</h1>
            <Button
              variant="ghost"
              size="icon"
              onClick={onExit}
              className="w-10 h-10 rounded-full hover:bg-gray-900"
              aria-label="Exit vocabulary management"
            >
              <X className="w-5 h-5" />
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-3 mb-4">
            <div className="bg-gradient-to-br from-blue-600 to-blue-800 rounded-xl p-3 text-center">
              <div className="text-2xl font-bold">{vocabularyAnchors.length}</div>
              <div className="text-xs opacity-90">Anchors</div>
            </div>
            <div className="bg-gradient-to-br from-green-600 to-green-800 rounded-xl p-3 text-center">
              <div className="text-2xl font-bold">
                {Math.round(vocabularyAnchors.reduce((sum, a) => sum + a.accuracy, 0) / vocabularyAnchors.length)}%
              </div>
              <div className="text-xs opacity-90">Avg Accuracy</div>
            </div>
            <div className="bg-gradient-to-br from-purple-600 to-purple-800 rounded-xl p-3 text-center">
              <div className="text-2xl font-bold">
                {vocabularyAnchors.reduce((sum, a) => sum + a.timesReviewed, 0)}
              </div>
              <div className="text-xs opacity-90">Reviews</div>
            </div>
          </div>

          {/* Search Bar */}
          <div className="relative mb-4">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search vocabulary..."
              className="w-full bg-gray-900 border border-gray-800 rounded-xl pl-12 pr-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
              aria-label="Search vocabulary anchors"
            />
          </div>

          {/* Filter & View Toggle */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 overflow-x-auto">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setFilterCategory(null)}
                className={`rounded-full ${!filterCategory ? 'bg-blue-600' : 'bg-gray-900'}`}
                aria-pressed={!filterCategory}
                aria-label="Show all categories"
              >
                All
              </Button>
              {categories.map((category) => (
                <Button
                  key={category}
                  variant="ghost"
                  size="sm"
                  onClick={() => setFilterCategory(category)}
                  className={`rounded-full whitespace-nowrap ${filterCategory === category ? 'bg-blue-600' : 'bg-gray-900'}`}
                  aria-pressed={filterCategory === category}
                  aria-label={`Filter by ${category}`}
                >
                  {category}
                </Button>
              ))}
            </div>

            <div className="flex items-center gap-2 ml-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setViewMode('list')}
                className={`w-9 h-9 ${viewMode === 'list' ? 'bg-gray-900' : ''}`}
                aria-label="List view"
                aria-pressed={viewMode === 'list'}
              >
                <List className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setViewMode('grid')}
                className={`w-9 h-9 ${viewMode === 'grid' ? 'bg-gray-900' : ''}`}
                aria-label="Grid view"
                aria-pressed={viewMode === 'grid'}
              >
                <Grid3x3 className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Anchors List/Grid */}
        <div className="flex-1 px-6 pb-6 overflow-y-auto">
          {filteredAnchors.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-gray-500">
              <AlertCircle className="w-12 h-12 mb-3" />
              <p className="text-center">No vocabulary anchors found</p>
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
          ) : viewMode === 'list' ? (
            <div className="space-y-3">
              {filteredAnchors.map((anchor, index) => (
                <motion.div
                  key={anchor.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="bg-gray-900 rounded-xl p-4"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold text-lg">{anchor.signWord}</h3>
                        <span className="px-2 py-0.5 bg-blue-600/20 text-blue-500 text-xs rounded-full">
                          {anchor.category}
                        </span>
                      </div>
                      <p className="text-sm text-gray-400 mb-2">{anchor.signDescription}</p>
                      <div className="flex items-center gap-3 text-xs text-gray-500">
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3 h-3" />
                          {anchor.location}
                        </span>
                        <span>•</span>
                        <span>{anchor.timesReviewed} reviews</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 ml-3">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setCurrentStep('review')}
                        className="w-9 h-9 rounded-full hover:bg-gray-800"
                        aria-label={`Review ${anchor.signWord}`}
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDeleteAnchor(anchor.id)}
                        className="w-9 h-9 rounded-full hover:bg-red-600/20 text-red-500"
                        aria-label={`Delete ${anchor.signWord}`}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>

                  {/* Accuracy Bar */}
                  <div className="mt-3 pt-3 border-t border-gray-800">
                    <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
                      <span>Mastery</span>
                      <span>{anchor.accuracy}%</span>
                    </div>
                    <div className="h-1.5 bg-gray-800 rounded-full overflow-hidden" role="progressbar" aria-valuenow={anchor.accuracy} aria-valuemin={0} aria-valuemax={100}>
                      <div 
                        className={`h-full ${
                          anchor.accuracy >= 90 ? 'bg-green-500' :
                          anchor.accuracy >= 70 ? 'bg-blue-500' :
                          'bg-orange-500'
                        }`}
                        style={{ width: `${anchor.accuracy}%` }}
                      />
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3">
              {filteredAnchors.map((anchor, index) => (
                <motion.div
                  key={anchor.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.05 }}
                  className="bg-gray-900 rounded-xl p-4"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="w-10 h-10 rounded-full bg-blue-600/20 flex items-center justify-center" aria-hidden="true">
                      <MapPin className="w-5 h-5 text-blue-500" />
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDeleteAnchor(anchor.id)}
                      className="w-8 h-8 rounded-full hover:bg-red-600/20 text-red-500"
                      aria-label={`Delete ${anchor.signWord}`}
                    >
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </div>
                  <h3 className="font-semibold mb-1 truncate">{anchor.signWord}</h3>
                  <p className="text-xs text-gray-400 mb-2">{anchor.location}</p>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-gray-500">{anchor.timesReviewed} reviews</span>
                    <span className={`font-semibold ${
                      anchor.accuracy >= 90 ? 'text-green-500' :
                      anchor.accuracy >= 70 ? 'text-blue-500' :
                      'text-orange-500'
                    }`}>
                      {anchor.accuracy}%
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>

        {/* Bottom Actions */}
        <div className="p-6 border-t border-gray-900 space-y-3">
          <Button
            onClick={() => setCurrentStep('camera')}
            className="w-full bg-blue-600 hover:bg-blue-700 h-14 text-lg font-semibold rounded-full"
            aria-label="Add new vocabulary anchor"
          >
            <Plus className="w-5 h-5 mr-2" />
            Add New Anchor
          </Button>
          <Button
            onClick={() => setCurrentStep('review')}
            variant="ghost"
            className="w-full h-12"
            aria-label="Review all vocabulary"
          >
            Review All
          </Button>
        </div>
      </div>
    );
  }

  // Review Mode Screen
  if (currentStep === 'review') {
    return (
      <div 
        className="min-h-screen bg-black text-white flex flex-col"
        role="main"
        aria-labelledby="review-title"
      >
        {/* Header */}
        <div className="p-6 flex items-center justify-between">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setCurrentStep('management')}
            className="w-10 h-10 rounded-full hover:bg-gray-900"
            aria-label="Back to management"
          >
            <X className="w-5 h-5" />
          </Button>
          <h1 id="review-title" className="text-xl font-bold">Review Mode</h1>
          <div className="w-10" aria-hidden="true" />
        </div>

        {/* Review Stats */}
        <div className="px-6 mb-6">
          <div className="bg-gradient-to-br from-purple-600 to-purple-800 rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center" aria-hidden="true">
                <BookmarkCheck className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-lg font-semibold">Vocabulary Review</h2>
                <p className="text-sm opacity-90">{filteredAnchors.length} items to practice</p>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-3 text-center">
              <div>
                <div className="text-2xl font-bold">{filteredAnchors.filter(a => a.accuracy >= 90).length}</div>
                <div className="text-xs opacity-80">Mastered</div>
              </div>
              <div>
                <div className="text-2xl font-bold">{filteredAnchors.filter(a => a.accuracy >= 70 && a.accuracy < 90).length}</div>
                <div className="text-xs opacity-80">Learning</div>
              </div>
              <div>
                <div className="text-2xl font-bold">{filteredAnchors.filter(a => a.accuracy < 70).length}</div>
                <div className="text-xs opacity-80">Practice</div>
              </div>
            </div>
          </div>
        </div>

        {/* Review Categories */}
        <div className="flex-1 px-6 pb-6 overflow-y-auto">
          <div className="space-y-6">
            {/* Need Practice */}
            {filteredAnchors.filter(a => a.accuracy < 70).length > 0 && (
              <div>
                <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-orange-500" aria-hidden="true" />
                  Need Practice
                </h3>
                <div className="space-y-2">
                  {filteredAnchors.filter(a => a.accuracy < 70).map((anchor) => (
                    <div key={anchor.id} className="bg-gray-900 rounded-xl p-3 flex items-center justify-between">
                      <div className="flex items-center gap-3 flex-1">
                        <div className="w-10 h-10 rounded-full bg-orange-600/20 flex items-center justify-center" aria-hidden="true">
                          <AlertCircle className="w-5 h-5 text-orange-500" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="font-semibold truncate">{anchor.signWord}</div>
                          <div className="text-xs text-gray-400">{anchor.timesReviewed} reviews • {anchor.accuracy}%</div>
                        </div>
                      </div>
                      <Button
                        size="sm"
                        className="bg-orange-600 hover:bg-orange-700 ml-3"
                        aria-label={`Practice ${anchor.signWord}`}
                      >
                        Practice
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Currently Learning */}
            {filteredAnchors.filter(a => a.accuracy >= 70 && a.accuracy < 90).length > 0 && (
              <div>
                <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-blue-500" aria-hidden="true" />
                  Currently Learning
                </h3>
                <div className="space-y-2">
                  {filteredAnchors.filter(a => a.accuracy >= 70 && a.accuracy < 90).map((anchor) => (
                    <div key={anchor.id} className="bg-gray-900 rounded-xl p-3 flex items-center justify-between">
                      <div className="flex items-center gap-3 flex-1">
                        <div className="w-10 h-10 rounded-full bg-blue-600/20 flex items-center justify-center" aria-hidden="true">
                          <Target className="w-5 h-5 text-blue-500" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="font-semibold truncate">{anchor.signWord}</div>
                          <div className="text-xs text-gray-400">{anchor.timesReviewed} reviews • {anchor.accuracy}%</div>
                        </div>
                      </div>
                      <Button
                        size="sm"
                        className="bg-blue-600 hover:bg-blue-700 ml-3"
                        aria-label={`Review ${anchor.signWord}`}
                      >
                        Review
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Mastered */}
            {filteredAnchors.filter(a => a.accuracy >= 90).length > 0 && (
              <div>
                <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-green-500" aria-hidden="true" />
                  Mastered
                </h3>
                <div className="space-y-2">
                  {filteredAnchors.filter(a => a.accuracy >= 90).map((anchor) => (
                    <div key={anchor.id} className="bg-gray-900 rounded-xl p-3 flex items-center justify-between">
                      <div className="flex items-center gap-3 flex-1">
                        <div className="w-10 h-10 rounded-full bg-green-600/20 flex items-center justify-center" aria-hidden="true">
                          <Check className="w-5 h-5 text-green-500" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="font-semibold truncate">{anchor.signWord}</div>
                          <div className="text-xs text-gray-400">{anchor.timesReviewed} reviews • {anchor.accuracy}%</div>
                        </div>
                      </div>
                      <Button
                        size="sm"
                        variant="outline"
                        className="border-green-600 text-green-500 hover:bg-green-600/10 ml-3"
                        aria-label={`Review ${anchor.signWord}`}
                      >
                        Review
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Bottom Action */}
        <div className="p-6 border-t border-gray-900">
          <Button
            className="w-full bg-blue-600 hover:bg-blue-700 h-14 text-lg font-semibold rounded-full"
            aria-label="Start review session"
          >
            Start Review Session
          </Button>
        </div>
      </div>
    );
  }

  return null;
}
