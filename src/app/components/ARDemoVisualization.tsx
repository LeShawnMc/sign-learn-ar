import { motion } from 'motion/react';
import { Hand } from 'lucide-react';

/**
 * AR Demo Visualization Component
 * Shows an interactive hand tracking visualization with accessibility support
 */
export function ARDemoVisualization() {
  return (
    <div 
      className="relative w-full aspect-square rounded-2xl bg-gray-900 border-2 border-gray-800 overflow-hidden"
      role="img"
      aria-label="AR hand tracking visualization showing real-time gesture recognition"
    >
      {/* Background Grid */}
      <svg className="absolute inset-0 w-full h-full opacity-20" aria-hidden="true">
        <defs>
          <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(59, 130, 246, 0.3)" strokeWidth="1"/>
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid)" />
      </svg>

      {/* Scanning Effect */}
      <motion.div
        className="absolute inset-0"
        initial={{ opacity: 0 }}
        animate={{ opacity: [0.3, 0.6, 0.3] }}
        transition={{ repeat: Infinity, duration: 2 }}
        aria-hidden="true"
      >
        <div className="absolute inset-0 bg-gradient-to-b from-blue-600/10 to-transparent" />
      </motion.div>

      {/* Hand Icon with Animation */}
      <motion.div
        className="absolute inset-0 flex items-center justify-center"
        animate={{
          y: [0, -10, 0],
          scale: [1, 1.05, 1],
        }}
        transition={{
          repeat: Infinity,
          duration: 3,
          ease: "easeInOut"
        }}
      >
        <Hand className="w-32 h-32 text-blue-500" aria-hidden="true" />
      </motion.div>

      {/* Corner Markers */}
      <div className="absolute top-4 left-4 w-8 h-8 border-t-2 border-l-2 border-blue-500" aria-hidden="true" />
      <div className="absolute top-4 right-4 w-8 h-8 border-t-2 border-r-2 border-blue-500" aria-hidden="true" />
      <div className="absolute bottom-4 left-4 w-8 h-8 border-b-2 border-l-2 border-blue-500" aria-hidden="true" />
      <div className="absolute bottom-4 right-4 w-8 h-8 border-b-2 border-r-2 border-blue-500" aria-hidden="true" />

      {/* Tracking Points */}
      {[...Array(5)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-3 h-3 rounded-full bg-blue-500"
          style={{
            left: `${20 + i * 15}%`,
            top: `${40 + Math.sin(i) * 20}%`,
          }}
          animate={{
            scale: [1, 1.5, 1],
            opacity: [0.5, 1, 0.5],
          }}
          transition={{
            repeat: Infinity,
            duration: 2,
            delay: i * 0.2,
          }}
          aria-hidden="true"
        />
      ))}

      {/* Status Indicator */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 px-4 py-2 rounded-full bg-blue-600/20 border border-blue-500/50 backdrop-blur-sm">
        <div className="flex items-center gap-2 text-sm text-blue-400">
          <motion.div
            className="w-2 h-2 rounded-full bg-blue-500"
            animate={{ opacity: [1, 0.3, 1] }}
            transition={{ repeat: Infinity, duration: 1.5 }}
            aria-hidden="true"
          />
          <span>Tracking Active</span>
        </div>
      </div>
    </div>
  );
}
