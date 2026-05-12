import { Button } from '../ui/button';
import { useApp } from '../../context/AppContext';
import { motion } from 'motion/react';
import exampleImage from 'figma:asset/65bebb2e17bce7f144eb552b74f805a178a2d57b.png';

export function WelcomeScreen() {
  const { setCurrentStep } = useApp();

  return (
    <div 
      className="min-h-screen bg-black text-white flex flex-col items-center justify-between p-6"
      role="main"
      aria-labelledby="welcome-title"
    >
      {/* Logo and Title */}
      <motion.div 
        className="flex-1 flex flex-col items-center justify-center text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="mb-8" aria-hidden="true">
          <svg width="80" height="80" viewBox="0 0 80 80" fill="none">
            <circle cx="40" cy="40" r="38" stroke="white" strokeWidth="2" />
            <path d="M30 35L40 45L50 35" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M25 50C25 50 30 55 40 55C50 55 55 50 55 50" stroke="white" strokeWidth="3" strokeLinecap="round" />
          </svg>
        </div>
        
        <h1 id="welcome-title" className="text-4xl font-bold mb-3">
          Sign Learn AR
        </h1>
        
        <p className="text-gray-400 text-lg max-w-sm">
          Learn sign language with augmented reality and AI-powered hand tracking
        </p>
      </motion.div>

      {/* Features List */}
      <motion.div
        className="w-full max-w-md mb-8 space-y-4"
        role="list"
        aria-label="Key features"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.6 }}
      >
        <div className="flex items-start gap-3" role="listitem">
          <div className="mt-1 w-6 h-6 rounded-full bg-blue-600 flex items-center justify-center flex-shrink-0" aria-hidden="true">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M2 7L6 11L12 3" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <div>
            <h2 className="font-semibold text-base">AR Hand Tracking</h2>
            <p className="text-sm text-gray-400">Real-time feedback on your signing</p>
          </div>
        </div>

        <div className="flex items-start gap-3" role="listitem">
          <div className="mt-1 w-6 h-6 rounded-full bg-blue-600 flex items-center justify-center flex-shrink-0" aria-hidden="true">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M2 7L6 11L12 3" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <div>
            <h2 className="font-semibold text-base">Personalized Learning</h2>
            <p className="text-sm text-gray-400">Lessons tailored to your goals</p>
          </div>
        </div>

        <div className="flex items-start gap-3" role="listitem">
          <div className="mt-1 w-6 h-6 rounded-full bg-blue-600 flex items-center justify-center flex-shrink-0" aria-hidden="true">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M2 7L6 11L12 3" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <div>
            <h2 className="font-semibold text-base">Daily Progress Tracking</h2>
            <p className="text-sm text-gray-400">Build streaks and achieve goals</p>
          </div>
        </div>
      </motion.div>

      {/* CTA Button */}
      <motion.div 
        className="w-full max-w-md"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.6 }}
      >
        <Button
          onClick={() => setCurrentStep('ar-check')}
          className="w-full bg-white text-black hover:bg-gray-100 h-14 text-lg font-semibold rounded-full"
          aria-label="Get started with Sign Learn AR"
        >
          Get Started
        </Button>
        
        <p className="text-center text-sm text-gray-400 mt-4">
          Free to start • No credit card required
        </p>
      </motion.div>
    </div>
  );
}
