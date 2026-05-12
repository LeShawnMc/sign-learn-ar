import { useState } from 'react';
import { Button } from '../ui/button';
import { useApp } from '../../context/AppContext';
import { motion } from 'motion/react';
import { Camera, Mic, Shield } from 'lucide-react';

export function PermissionsScreen() {
  const { setCurrentStep, grantPermission, permissionsGranted } = useApp();
  const [requesting, setRequesting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleRequestPermissions = async () => {
    setRequesting(true);
    setError(null);

    try {
      // Request camera permission
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: true, 
        audio: true 
      });
      
      // Permissions granted
      grantPermission('camera');
      grantPermission('microphone');
      
      // Stop the stream
      stream.getTracks().forEach(track => track.stop());
      
      setTimeout(() => {
        setCurrentStep('calibration');
      }, 500);
    } catch (err) {
      // User denied permissions - show friendly error message
      setError('Permissions were denied. You can continue without them or try again.');
      setRequesting(false);
    }
  };

  const handleSkip = () => {
    setError(null);
    setCurrentStep('calibration');
  };

  return (
    <div 
      className="min-h-screen bg-black text-white flex flex-col p-6"
      role="main"
      aria-labelledby="permissions-title"
    >
      {/* Header */}
      <div className="mb-8">
        <div className="w-16 h-16 rounded-full bg-blue-600/20 flex items-center justify-center mb-4" aria-hidden="true">
          <Shield className="w-8 h-8 text-blue-500" />
        </div>
        <h1 id="permissions-title" className="text-2xl font-bold mb-2">
          Grant Permissions
        </h1>
        <p className="text-gray-400">
          Sign Learn AR needs access to your camera and microphone for the best learning experience
        </p>
      </div>

      {/* Permissions List */}
      <div className="flex-1 space-y-4" role="list" aria-label="Required permissions">
        <motion.div 
          className="bg-gray-900 rounded-2xl p-5"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          role="listitem"
        >
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-full bg-blue-600/20 flex items-center justify-center flex-shrink-0" aria-hidden="true">
              <Camera className="w-6 h-6 text-blue-500" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold mb-1">Camera Access</h3>
              <p className="text-sm text-gray-400 leading-relaxed">
                Required for AR hand tracking and real-time feedback on your signing. We analyze your hand movements to help you learn correctly.
              </p>
            </div>
          </div>
        </motion.div>

        <motion.div 
          className="bg-gray-900 rounded-2xl p-5"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          role="listitem"
        >
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-full bg-blue-600/20 flex items-center justify-center flex-shrink-0" aria-hidden="true">
              <Mic className="w-6 h-6 text-blue-500" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold mb-1">Microphone Access</h3>
              <p className="text-sm text-gray-400 leading-relaxed">
                Optional for voice commands and pronunciation practice. You can enable this later in settings.
              </p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Privacy Notice */}
      <motion.div 
        className="mt-6 p-4 rounded-xl bg-gray-900 border border-gray-800"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        role="note"
        aria-label="Privacy notice"
      >
        <div className="flex gap-3">
          <Shield className="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5" aria-hidden="true" />
          <div>
            <h4 className="font-semibold text-sm mb-1">Your Privacy Matters</h4>
            <p className="text-xs text-gray-400 leading-relaxed">
              All processing happens on your device. We never store or transmit your camera feed. Your data stays private and secure.
            </p>
          </div>
        </div>
      </motion.div>

      {/* Error Message */}
      {error && (
        <motion.div 
          className="mt-4 p-4 rounded-xl bg-red-900/20 border border-red-800"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          role="alert"
          aria-live="polite"
        >
          <p className="text-sm text-red-400">{error}</p>
        </motion.div>
      )}

      {/* Action Buttons */}
      <motion.div 
        className="mt-6 space-y-3"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <Button
          onClick={handleRequestPermissions}
          disabled={requesting}
          className="w-full bg-white text-black hover:bg-gray-100 h-14 text-lg font-semibold rounded-full disabled:opacity-50"
          aria-label="Grant camera and microphone permissions"
        >
          {requesting ? 'Requesting...' : 'Grant Permissions'}
        </Button>
        
        <Button
          onClick={handleSkip}
          variant="ghost"
          className="w-full h-12 text-gray-400 hover:text-white"
          aria-label="Skip permissions and continue"
        >
          I'll Do This Later
        </Button>
      </motion.div>

      {/* Progress Indicator */}
      <div className="mt-6 flex justify-center gap-2" role="progressbar" aria-valuenow={2} aria-valuemin={1} aria-valuemax={7} aria-label="Onboarding progress: step 2 of 7">
        <div className="w-2 h-2 rounded-full bg-gray-600" aria-hidden="true"></div>
        <div className="w-2 h-2 rounded-full bg-white" aria-hidden="true"></div>
        <div className="w-2 h-2 rounded-full bg-gray-600" aria-hidden="true"></div>
        <div className="w-2 h-2 rounded-full bg-gray-600" aria-hidden="true"></div>
        <div className="w-2 h-2 rounded-full bg-gray-600" aria-hidden="true"></div>
        <div className="w-2 h-2 rounded-full bg-gray-600" aria-hidden="true"></div>
        <div className="w-2 h-2 rounded-full bg-gray-600" aria-hidden="true"></div>
      </div>
    </div>
  );
}