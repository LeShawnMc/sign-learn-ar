import { useState, useEffect } from 'react';
import { Button } from '../ui/button';
import { useApp } from '../../context/AppContext';
import { motion } from 'motion/react';
import { CheckCircle2, XCircle, Loader2 } from 'lucide-react';

type CheckStatus = 'checking' | 'success' | 'failed';

export function ARCheckScreen() {
  const { setCurrentStep, setHasARCapability } = useApp();
  const [status, setStatus] = useState<CheckStatus>('checking');
  const [capabilities, setCapabilities] = useState({
    webgl: false,
    camera: false,
    deviceMotion: false,
  });

  useEffect(() => {
    // Simulate AR capability check
    const checkCapabilities = async () => {
      // Check WebGL
      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
      const hasWebGL = !!gl;
      
      setCapabilities(prev => ({ ...prev, webgl: hasWebGL }));
      await new Promise(resolve => setTimeout(resolve, 500));

      // Check camera availability
      const hasCamera = !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia);
      setCapabilities(prev => ({ ...prev, camera: hasCamera }));
      await new Promise(resolve => setTimeout(resolve, 500));

      // Check device motion (for AR)
      const hasDeviceMotion = 'DeviceMotionEvent' in window;
      setCapabilities(prev => ({ ...prev, deviceMotion: hasDeviceMotion }));
      await new Promise(resolve => setTimeout(resolve, 500));

      // All checks complete
      const allPassed = hasWebGL && hasCamera && hasDeviceMotion;
      setStatus(allPassed ? 'success' : 'failed');
      setHasARCapability(allPassed);
    };

    checkCapabilities();
  }, [setHasARCapability]);

  const handleContinue = () => {
    setCurrentStep('permissions');
  };

  const handleSkip = () => {
    setCurrentStep('language-select');
  };

  return (
    <div 
      className="min-h-screen bg-black text-white flex flex-col p-6"
      role="main"
      aria-labelledby="ar-check-title"
    >
      {/* Header */}
      <div className="mb-8">
        <h1 id="ar-check-title" className="text-2xl font-bold mb-2">
          Checking AR Capabilities
        </h1>
        <p className="text-gray-400">
          Verifying your device supports augmented reality features
        </p>
      </div>

      {/* Capability Checks */}
      <div className="flex-1 space-y-4" role="list" aria-label="AR capability checks">
        <motion.div 
          className="bg-gray-900 rounded-2xl p-5 flex items-center gap-4"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          role="listitem"
        >
          <div className="w-12 h-12 rounded-full bg-gray-800 flex items-center justify-center" aria-hidden="true">
            {capabilities.webgl ? (
              <CheckCircle2 className="w-6 h-6 text-green-500" />
            ) : (
              <Loader2 className="w-6 h-6 text-blue-500 animate-spin" />
            )}
          </div>
          <div className="flex-1">
            <h3 className="font-semibold">3D Graphics Support</h3>
            <p className="text-sm text-gray-400">WebGL rendering capability</p>
          </div>
          <span 
            className={capabilities.webgl ? 'text-green-500' : 'text-gray-500'}
            aria-label={capabilities.webgl ? 'Passed' : 'Checking'}
          >
            {capabilities.webgl ? 'Ready' : 'Checking...'}
          </span>
        </motion.div>

        <motion.div 
          className="bg-gray-900 rounded-2xl p-5 flex items-center gap-4"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          role="listitem"
        >
          <div className="w-12 h-12 rounded-full bg-gray-800 flex items-center justify-center" aria-hidden="true">
            {capabilities.camera ? (
              <CheckCircle2 className="w-6 h-6 text-green-500" />
            ) : status === 'checking' ? (
              <Loader2 className="w-6 h-6 text-blue-500 animate-spin" />
            ) : (
              <XCircle className="w-6 h-6 text-red-500" />
            )}
          </div>
          <div className="flex-1">
            <h3 className="font-semibold">Camera Access</h3>
            <p className="text-sm text-gray-400">Required for hand tracking</p>
          </div>
          <span 
            className={capabilities.camera ? 'text-green-500' : status === 'checking' ? 'text-gray-500' : 'text-red-500'}
            aria-label={capabilities.camera ? 'Passed' : status === 'checking' ? 'Checking' : 'Failed'}
          >
            {capabilities.camera ? 'Ready' : status === 'checking' ? 'Checking...' : 'Not Available'}
          </span>
        </motion.div>

        <motion.div 
          className="bg-gray-900 rounded-2xl p-5 flex items-center gap-4"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
          role="listitem"
        >
          <div className="w-12 h-12 rounded-full bg-gray-800 flex items-center justify-center" aria-hidden="true">
            {capabilities.deviceMotion ? (
              <CheckCircle2 className="w-6 h-6 text-green-500" />
            ) : status === 'checking' ? (
              <Loader2 className="w-6 h-6 text-blue-500 animate-spin" />
            ) : (
              <XCircle className="w-6 h-6 text-red-500" />
            )}
          </div>
          <div className="flex-1">
            <h3 className="font-semibold">Motion Sensors</h3>
            <p className="text-sm text-gray-400">For AR positioning</p>
          </div>
          <span 
            className={capabilities.deviceMotion ? 'text-green-500' : status === 'checking' ? 'text-gray-500' : 'text-red-500'}
            aria-label={capabilities.deviceMotion ? 'Passed' : status === 'checking' ? 'Checking' : 'Failed'}
          >
            {capabilities.deviceMotion ? 'Ready' : status === 'checking' ? 'Checking...' : 'Not Available'}
          </span>
        </motion.div>
      </div>

      {/* Status Message */}
      {status !== 'checking' && (
        <motion.div
          className={`mt-6 p-4 rounded-xl ${status === 'success' ? 'bg-green-900/30 border border-green-700' : 'bg-yellow-900/30 border border-yellow-700'}`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          role="status"
          aria-live="polite"
        >
          <p className={status === 'success' ? 'text-green-400' : 'text-yellow-400'}>
            {status === 'success' 
              ? '✓ Your device is ready for AR learning!' 
              : '⚠ Some AR features may not be available. You can still use the app with limited functionality.'}
          </p>
        </motion.div>
      )}

      {/* Action Buttons */}
      {status !== 'checking' && (
        <motion.div 
          className="mt-6 space-y-3"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Button
            onClick={handleContinue}
            className="w-full bg-white text-black hover:bg-gray-100 h-14 text-lg font-semibold rounded-full"
            aria-label={status === 'success' ? 'Continue to permissions setup' : 'Continue with limited features'}
          >
            {status === 'success' ? 'Continue' : 'Continue Anyway'}
          </Button>
          
          {status === 'failed' && (
            <Button
              onClick={handleSkip}
              variant="ghost"
              className="w-full h-12 text-gray-400 hover:text-white"
              aria-label="Skip AR setup"
            >
              Skip AR Setup
            </Button>
          )}
        </motion.div>
      )}
    </div>
  );
}
