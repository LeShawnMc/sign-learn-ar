import React, { useEffect, useRef, useState, useCallback } from 'react';
import {
  HandLandmarker,
  FilesetResolver,
  type HandLandmarkerResult,
  type NormalizedLandmark,
} from '@mediapipe/tasks-vision';

export type { NormalizedLandmark };

export interface HandTrackingState {
  /** true once the model has loaded and camera is streaming */
  ready: boolean;
  /** true while the model is downloading / camera is starting */
  loading: boolean;
  /** non-null when something went wrong */
  error: string | null;
  /** raw landmarks for each detected hand (0-2 hands, 21 points each) */
  landmarks: NormalizedLandmark[][] | null;
  /** number of hands currently detected (0, 1, or 2) */
  handCount: number;
  /** dominant hand label reported by MediaPipe ("Left" | "Right") */
  handedness: string[];
  /** call this to start the camera + tracking */
  start: () => Promise<void>;
  /** call this to stop the camera + tracking */
  stop: () => void;
}

// Named landmark indices for the 21 MediaPipe hand points
export const LANDMARK = {
  WRIST: 0,
  THUMB_CMC: 1, THUMB_MCP: 2, THUMB_IP: 3, THUMB_TIP: 4,
  INDEX_MCP: 5, INDEX_PIP: 6, INDEX_DIP: 7, INDEX_TIP: 8,
  MIDDLE_MCP: 9, MIDDLE_PIP: 10, MIDDLE_DIP: 11, MIDDLE_TIP: 12,
  RING_MCP: 13, RING_PIP: 14, RING_DIP: 15, RING_TIP: 16,
  PINKY_MCP: 17, PINKY_PIP: 18, PINKY_DIP: 19, PINKY_TIP: 20,
} as const;

// Connections to draw skeleton lines between landmarks
export const HAND_CONNECTIONS: [number, number][] = [
  [0, 1], [1, 2], [2, 3], [3, 4],       // thumb
  [0, 5], [5, 6], [6, 7], [7, 8],       // index
  [0, 9], [9, 10], [10, 11], [11, 12],  // middle
  [0, 13], [13, 14], [14, 15], [15, 16], // ring
  [0, 17], [17, 18], [18, 19], [19, 20], // pinky
  [5, 9], [9, 13], [13, 17],            // palm knuckle line
];

// CDN URL for the WASM runtime and model file
const MEDIAPIPE_WASM_URL =
  'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm';
const MODEL_URL =
  'https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/1/hand_landmarker.task';

export function useMediaPipeHands(
  videoRef: React.RefObject<HTMLVideoElement | null>,
  canvasRef: React.RefObject<HTMLCanvasElement | null>,
  options: { maxHands?: number; minDetectionConfidence?: number } = {}
): HandTrackingState {
  const { maxHands = 2, minDetectionConfidence = 0.6 } = options;

  const landmarkerRef = useRef<HandLandmarker | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const rafRef = useRef<number>(0);
  const runningRef = useRef(false);

  const [ready, setReady] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [landmarks, setLandmarks] = useState<NormalizedLandmark[][] | null>(null);
  const [handCount, setHandCount] = useState(0);
  const [handedness, setHandedness] = useState<string[]>([]);

  // Draw landmarks + skeleton onto the canvas overlay
  const drawResults = useCallback(
    (result: HandLandmarkerResult, canvas: HTMLCanvasElement) => {
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      result.landmarks.forEach(hand => {
        // Draw connections (skeleton)
        ctx.strokeStyle = 'rgba(0,245,255,0.7)';
        ctx.lineWidth = 2;
        for (const [a, b] of HAND_CONNECTIONS) {
          const pA = hand[a];
          const pB = hand[b];
          if (!pA || !pB) continue;
          ctx.beginPath();
          ctx.moveTo(pA.x * canvas.width, pA.y * canvas.height);
          ctx.lineTo(pB.x * canvas.width, pB.y * canvas.height);
          ctx.stroke();
        }

        // Draw landmark dots
        hand.forEach((pt, i) => {
          const isTip = [4, 8, 12, 16, 20].includes(i);
          ctx.beginPath();
          ctx.arc(pt.x * canvas.width, pt.y * canvas.height, isTip ? 6 : 4, 0, 2 * Math.PI);
          ctx.fillStyle = isTip ? '#A855F7' : '#00F5FF';
          ctx.fill();
        });
      });
    },
    []
  );

  // Main detection loop — runs on every animation frame
  const detect = useCallback(() => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    const landmarker = landmarkerRef.current;

    if (!runningRef.current || !video || !canvas || !landmarker) return;
    if (video.readyState < 2) {
      rafRef.current = requestAnimationFrame(detect);
      return;
    }

    // Keep canvas the same size as the video
    if (canvas.width !== video.videoWidth || canvas.height !== video.videoHeight) {
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
    }

    const result = landmarker.detectForVideo(video, performance.now());

    setLandmarks(result.landmarks.length ? result.landmarks : null);
    setHandCount(result.landmarks.length);
    setHandedness(result.handedness.map(h => h[0]?.categoryName ?? 'Unknown'));
    drawResults(result, canvas);

    rafRef.current = requestAnimationFrame(detect);
  }, [videoRef, canvasRef, drawResults]);

  const start = useCallback(async () => {
    if (runningRef.current) return;
    setLoading(true);
    setError(null);

    try {
      // Load WASM runtime + model (cached after first load)
      if (!landmarkerRef.current) {
        const vision = await FilesetResolver.forVisionTasks(MEDIAPIPE_WASM_URL);
        landmarkerRef.current = await HandLandmarker.createFromOptions(vision, {
          baseOptions: { modelAssetPath: MODEL_URL, delegate: 'GPU' },
          runningMode: 'VIDEO',
          numHands: maxHands,
          minHandDetectionConfidence: minDetectionConfidence,
          minHandPresenceConfidence: minDetectionConfidence,
          minTrackingConfidence: 0.5,
        });
      }

      // Request camera access
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'user', width: { ideal: 1280 }, height: { ideal: 720 } },
      });
      streamRef.current = stream;

      const video = videoRef.current;
      if (video) {
        video.srcObject = stream;
        await new Promise<void>(resolve => {
          video.onloadeddata = () => resolve();
        });
        await video.play();
      }

      runningRef.current = true;
      setReady(true);
      setLoading(false);
      rafRef.current = requestAnimationFrame(detect);
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Failed to start camera';
      setError(
        msg.includes('Permission') || msg.includes('NotAllowed')
          ? 'Camera permission denied. Please allow camera access in your browser settings.'
          : msg
      );
      setLoading(false);
    }
  }, [detect, maxHands, minDetectionConfidence, videoRef]);

  const stop = useCallback(() => {
    runningRef.current = false;
    cancelAnimationFrame(rafRef.current);
    streamRef.current?.getTracks().forEach(t => t.stop());
    streamRef.current = null;
    const video = videoRef.current;
    if (video) {
      video.srcObject = null;
    }
    setReady(false);
    setLandmarks(null);
    setHandCount(0);
    setHandedness([]);
  }, [videoRef]);

  // Cleanup on unmount
  useEffect(() => {
    return () => stop();
  }, [stop]);

  return { ready, loading, error, landmarks, handCount, handedness, start, stop };
}
