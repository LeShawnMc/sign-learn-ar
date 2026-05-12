import { useState, useEffect } from 'react';
import { Button } from '../ui/button';
import { useApp } from '../../context/AppContext';
import { motion } from 'motion/react';
import { Scan, CheckCircle2 } from 'lucide-react';

export function RoomScanScreen() {
  const { setCurrentStep } = useApp();
  const [scanning, setScanning] = useState(false);
  const [progress, setProgress] = useState(0);
  const [complete, setComplete] = useState(false);

  useEffect(() => {
    if (scanning && progress < 100) {
      const interval = setInterval(() => {
        setProgress(prev => {
          const next = prev + 2;
          if (next >= 100) {
            setComplete(true);
            return 100;
          }
          return next;
        });
      }, 50);
      return () => clearInterval(interval);
    }
  }, [scanning, progress]);

  const handleStartScan = () => {
    setScanning(true);
  };

  const handleContinue = () => {
    setCurrentStep('language-select');
  };

  const handleSkip = () => {
    setCurrentStep('language-select');
  };

  return (
    <div 
      className="min-h-screen bg-black text-white flex flex-col p-6"
      role="main"
      aria-labelledby="room-scan-title"
    >
      {/* Header */}
      <div className="mb-6">
        <h1 id="room-scan-title" className="text-2xl font-bold mb-2">
          Room Scanning Tutorial
        </h1>
        <p className="text-gray-400">
          {!scanning && !complete
            ? 'Learn how to scan your space for the best AR experience'
            : complete
            ? 'Room scan complete!'
            : 'Slowly move your device around the room'}
        </p>
      </div>

      {/* Progress Bar */}
      {scanning && (
        <div className="mb-6" role="progressbar" aria-valuenow={progress} aria-valuemin={0} aria-valuemax={100} aria-label={`Scanning progress: ${progress}%`}>
          <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
            <motion.div 
              className="h-full bg-blue-500"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="text-sm text-gray-400 mt-2">{Math.round(progress)}% Complete</p>
        </div>
      )}

      {/* Scanning Content */}
      <div className="flex-1 flex flex-col items-center justify-center">
        {!scanning && !complete ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center max-w-md"
          >
            <div className="mb-6 w-32 h-32 mx-auto rounded-full bg-blue-600/20 flex items-center justify-center" aria-hidden="true">
              <Scan className="w-16 h-16 text-blue-500" />
            </div>
            <h2 className="text-xl font-semibold mb-3">How Room Scanning Works</h2>
            <p className="text-gray-400 mb-6">
              Room scanning helps the app understand your space to place virtual objects and provide better AR experiences.
            </p>
            <div className="text-left space-y-4 mb-8">
              <div className="flex items-start gap-3" role="listitem">
                <div className="w-8 h-8 rounded-full bg-blue-600/20 flex items-center justify-center flex-shrink-0 mt-0.5" aria-hidden="true">
                  <span className="text-blue-500 font-semibold">1</span>
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Move Slowly</h3>
                  <p className="text-sm text-gray-400">Pan your device smoothly across the room</p>
                </div>
              </div>
              <div className="flex items-start gap-3" role="listitem">
                <div className="w-8 h-8 rounded-full bg-blue-600/20 flex items-center justify-center flex-shrink-0 mt-0.5" aria-hidden="true">
                  <span className="text-blue-500 font-semibold">2</span>
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Cover All Angles</h3>
                  <p className="text-sm text-gray-400">Scan walls, floor, and surrounding areas</p>
                </div>
              </div>
              <div className="flex items-start gap-3" role="listitem">
                <div className="w-8 h-8 rounded-full bg-blue-600/20 flex items-center justify-center flex-shrink-0 mt-0.5" aria-hidden="true">
                  <span className="text-blue-500 font-semibold">3</span>
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Good Lighting</h3>
                  <p className="text-sm text-gray-400">Ensure the room is well-lit for best results</p>
                </div>
              </div>
            </div>
          </motion.div>
        ) : scanning && !complete ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center w-full"
            role="status"
            aria-live="polite"
          >
            {/* Scanning Animation */}
            <div className="mb-8 relative w-64 h-64 mx-auto" aria-hidden="true">
              <div className="absolute inset-0 rounded-2xl bg-gray-900 border-2 border-blue-500 overflow-hidden">
                {/* Grid overlay */}
                <svg className="w-full h-full" viewBox="0 0 256 256">
                  <defs>
                    <pattern id="grid" width="32" height="32" patternUnits="userSpaceOnUse">
                      <path d="M 32 0 L 0 0 0 32" fill="none" stroke="rgba(59, 130, 246, 0.3)" strokeWidth="1"/>
                    </pattern>
                  </defs>
                  <rect width="256" height="256" fill="url(#grid)" />
                  {/* Scanning line */}
                  <motion.line
                    x1="0"
                    y1="0"
                    x2="256"
                    y2="0"
                    stroke="rgb(59, 130, 246)"
                    strokeWidth="2"
                    animate={{ y1: [0, 256], y2: [0, 256] }}
                    transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
                  />
                </svg>
              </div>
              {/* Corner markers */}
              <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-blue-500"></div>
              <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-blue-500"></div>
              <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-blue-500"></div>
              <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-blue-500"></div>
            </div>
            <h2 className="text-xl font-semibold mb-2">Scanning Your Space...</h2>
            <p className="text-gray-400">Keep moving your device slowly around the room</p>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center"
            role="status"
            aria-live="polite"
          >
            <div className="mb-6 w-32 h-32 mx-auto rounded-full bg-green-600/20 flex items-center justify-center" aria-hidden="true">
              <CheckCircle2 className="w-16 h-16 text-green-500" />
            </div>
            <h2 className="text-xl font-semibold mb-2">Scan Complete!</h2>
            <p className="text-gray-400">Your space is ready for AR learning</p>
          </motion.div>
        )}
      </div>

      {/* Action Buttons */}
      <motion.div 
        className="mt-6 space-y-3"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        {!scanning && !complete ? (
          <>
            <Button
              onClick={handleStartScan}
              className="w-full bg-white text-black hover:bg-gray-100 h-14 text-lg font-semibold rounded-full"
              aria-label="Start room scanning tutorial"
            >
              Start Tutorial
            </Button>
            <Button
              onClick={handleSkip}
              variant="ghost"
              className="w-full h-12 text-gray-400 hover:text-white"
              aria-label="Skip room scanning tutorial"
            >
              Skip Tutorial
            </Button>
          </>
        ) : complete ? (
          <Button
            onClick={handleContinue}
            className="w-full bg-white text-black hover:bg-gray-100 h-14 text-lg font-semibold rounded-full"
            aria-label="Continue to language selection"
          >
            Continue
          </Button>
        ) : null}
      </motion.div>

      {/* Progress Indicator */}
      <div className="mt-6 flex justify-center gap-2" role="progressbar" aria-valuenow={4} aria-valuemin={1} aria-valuemax={7} aria-label="Onboarding progress: step 4 of 7">
        <div className="w-2 h-2 rounded-full bg-gray-600" aria-hidden="true"></div>
        <div className="w-2 h-2 rounded-full bg-gray-600" aria-hidden="true"></div>
        <div className="w-2 h-2 rounded-full bg-gray-600" aria-hidden="true"></div>
        <div className="w-2 h-2 rounded-full bg-white" aria-hidden="true"></div>
        <div className="w-2 h-2 rounded-full bg-gray-600" aria-hidden="true"></div>
        <div className="w-2 h-2 rounded-full bg-gray-600" aria-hidden="true"></div>
        <div className="w-2 h-2 rounded-full bg-gray-600" aria-hidden="true"></div>
      </div>
    </div>
  );
}
