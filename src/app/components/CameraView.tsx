import React, { useRef, useEffect } from 'react';
import { useMediaPipeHands, type NormalizedLandmark } from '../../lib/useMediaPipeHands';

export interface CameraViewProps {
  /** Mirror the video horizontally (selfie mode) */
  mirrored?: boolean;
  maxHands?: number;
  minDetectionConfidence?: number;
  /** Called every frame with the current landmark data */
  onLandmarks?: (landmarks: NormalizedLandmark[][] | null, handCount: number, handedness: string[]) => void;
  /** Auto-start the camera when mounted */
  autoStart?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

/**
 * Drop-in camera feed with MediaPipe hand tracking overlay.
 * Renders a <video> + <canvas> stacked on top of each other.
 */
export function CameraView({
  mirrored = true,
  maxHands = 2,
  minDetectionConfidence = 0.6,
  onLandmarks,
  autoStart = false,
  className = '',
  style,
}: CameraViewProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const { ready, loading, error, landmarks, handCount, handedness, start, stop } =
    useMediaPipeHands(videoRef, canvasRef, { maxHands, minDetectionConfidence });

  // Forward landmark events to parent on each frame
  useEffect(() => {
    onLandmarks?.(landmarks, handCount, handedness);
  }, [landmarks, handCount, handedness, onLandmarks]);

  // Auto-start if requested
  useEffect(() => {
    if (autoStart) start();
    return () => stop();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autoStart]);

  return (
    <div
      className={`relative overflow-hidden bg-black ${className}`}
      style={style}
    >
      {/* Live camera feed */}
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted
        className="w-full h-full object-cover"
        style={{ transform: mirrored ? 'scaleX(-1)' : undefined }}
        aria-label="Camera feed"
      />

      {/* Hand landmark overlay */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full pointer-events-none"
        aria-hidden="true"
      />

      {/* Loading */}
      {loading && (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-black/80">
          <div style={{ width: 40, height: 40, border: '3px solid var(--color-cyan)', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.7s linear infinite' }} />
          <p className="text-sm" style={{ color: 'var(--color-text-muted)' }}>Loading hand tracking…</p>
        </div>
      )}

      {/* Error */}
      {error && !loading && (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 p-6 bg-black/90 text-center">
          <span className="text-3xl">📷</span>
          <p className="text-sm font-medium" style={{ color: 'var(--color-danger)' }}>{error}</p>
          <button onClick={start} className="px-4 py-2 rounded-lg text-sm font-semibold" style={{ background: 'var(--color-brand)', color: '#fff' }}>
            Try again
          </button>
        </div>
      )}

      {/* Hand count badge */}
      {ready && (
        <div
          className="absolute top-3 right-3 px-2 py-1 rounded-full text-xs font-bold"
          style={{ background: handCount > 0 ? 'var(--color-ar-teal)' : 'rgba(0,0,0,0.6)', color: handCount > 0 ? '#000' : 'var(--color-text-muted)' }}
          aria-live="polite"
        >
          ✋ {handCount}
        </div>
      )}

      {/* Start prompt */}
      {!ready && !loading && !error && (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-black/80">
          <div className="w-16 h-16 rounded-full flex items-center justify-center" style={{ background: 'rgba(0,245,255,0.15)' }}>
            <span className="text-3xl">✋</span>
          </div>
          <button onClick={start} className="px-6 py-3 rounded-xl text-sm font-semibold" style={{ background: 'var(--color-brand)', color: '#fff' }}>
            Enable Camera
          </button>
          <p className="text-xs text-center px-6" style={{ color: 'var(--color-text-muted)' }}>
            Camera and hand tracking data stay on your device
          </p>
        </div>
      )}
    </div>
  );
}

export { useMediaPipeHands } from '../../lib/useMediaPipeHands';
