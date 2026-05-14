import { useEffect, useRef, useState, useCallback } from 'react';
import * as tf from '@tensorflow/tfjs';
import type { ObjectDetection, DetectedObject } from '@tensorflow-models/coco-ssd';

export interface DetectedObjectResult {
  id: string;
  name: string;
  confidence: number;
  boundingBox: { x: number; y: number; width: number; height: number };
  category: string;
}

export interface ObjectDetectionState {
  ready: boolean;
  loading: boolean;
  error: string | null;
  detections: DetectedObjectResult[];
  start: () => Promise<void>;
  stop: () => void;
  capture: () => DetectedObjectResult[];
}

// Map COCO-SSD class names to friendly categories
const CATEGORY_MAP: Record<string, string> = {
  chair: 'Furniture', couch: 'Furniture', bed: 'Furniture', 'dining table': 'Furniture',
  cup: 'Kitchen', bottle: 'Kitchen', bowl: 'Kitchen', fork: 'Kitchen', knife: 'Kitchen',
  spoon: 'Kitchen', refrigerator: 'Kitchen', oven: 'Kitchen', microwave: 'Kitchen',
  toaster: 'Kitchen', sink: 'Kitchen',
  book: 'Education', laptop: 'Technology', keyboard: 'Technology', mouse: 'Technology',
  'cell phone': 'Technology', remote: 'Technology', tv: 'Technology', clock: 'Objects',
  'potted plant': 'Decoration', vase: 'Decoration',
  backpack: 'Accessories', handbag: 'Accessories', umbrella: 'Accessories',
  cat: 'Animals', dog: 'Animals', bird: 'Animals',
  car: 'Transportation', bicycle: 'Transportation', motorcycle: 'Transportation',
  person: 'People',
};

const getCategory = (className: string): string =>
  CATEGORY_MAP[className.toLowerCase()] ?? 'Objects';

// Capitalize first letter of each word
const formatName = (name: string): string =>
  name.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');

export function useObjectDetection(
  videoRef: React.RefObject<HTMLVideoElement | null>,
  canvasRef: React.RefObject<HTMLCanvasElement | null>
): ObjectDetectionState {
  const modelRef  = useRef<ObjectDetection | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const rafRef    = useRef<number>(0);
  const runningRef = useRef(false);

  const [ready, setReady]       = useState(false);
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState<string | null>(null);
  const [detections, setDetections] = useState<DetectedObjectResult[]>([]);

  const drawDetections = useCallback(
    (results: DetectedObject[], canvas: HTMLCanvasElement, video: HTMLVideoElement) => {
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      if (canvas.width !== video.videoWidth || canvas.height !== video.videoHeight) {
        canvas.width  = video.videoWidth;
        canvas.height = video.videoHeight;
      }

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (const det of results) {
        const [x, y, w, h] = det.bbox;
        const conf = Math.round(det.score * 100);

        // Bounding box
        ctx.strokeStyle = '#00F5FF';
        ctx.lineWidth   = 2;
        ctx.strokeRect(x, y, w, h);

        // Label background
        const label = `${formatName(det.class)} ${conf}%`;
        ctx.font = 'bold 13px Inter, sans-serif';
        const tw = ctx.measureText(label).width + 10;
        ctx.fillStyle = 'rgba(0,245,255,0.85)';
        ctx.fillRect(x, y - 22, tw, 22);

        // Label text
        ctx.fillStyle = '#0F0F23';
        ctx.fillText(label, x + 5, y - 6);
      }
    },
    []
  );

  const detect = useCallback(async () => {
    const video  = videoRef.current;
    const canvas = canvasRef.current;
    const model  = modelRef.current;
    if (!runningRef.current || !video || !canvas || !model) return;
    if (video.readyState < 2) { rafRef.current = requestAnimationFrame(detect); return; }

    try {
      const results = await model.detect(video);
      drawDetections(results, canvas, video);
      setDetections(
        results.map((r, i) => ({
          id: `det-${i}-${Date.now()}`,
          name: formatName(r.class),
          confidence: r.score,
          boundingBox: { x: r.bbox[0], y: r.bbox[1], width: r.bbox[2], height: r.bbox[3] },
          category: getCategory(r.class),
        }))
      );
    } catch { /* frame failed — skip */ }

    rafRef.current = requestAnimationFrame(detect);
  }, [videoRef, canvasRef, drawDetections]);

  const start = useCallback(async () => {
    if (runningRef.current) return;
    setLoading(true);
    setError(null);

    try {
      // Ensure TF.js backend is ready
      await tf.ready();

      // Load model (cached after first load via browser cache)
      if (!modelRef.current) {
        const cocoSsd = await import('@tensorflow-models/coco-ssd');
        modelRef.current = await cocoSsd.load({ base: 'lite_mobilenet_v2' });
      }

      // Open camera
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment', width: { ideal: 1280 }, height: { ideal: 720 } },
      });
      streamRef.current = stream;

      const video = videoRef.current;
      if (video) {
        video.srcObject = stream;
        await new Promise<void>(res => { video.onloadeddata = () => res(); });
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
          ? 'Camera permission denied. Allow camera access in Settings and try again.'
          : msg
      );
      setLoading(false);
    }
  }, [detect, videoRef]);

  const stop = useCallback(() => {
    runningRef.current = false;
    cancelAnimationFrame(rafRef.current);
    streamRef.current?.getTracks().forEach(t => t.stop());
    streamRef.current = null;
    const video = videoRef.current;
    if (video) video.srcObject = null;
    setReady(false);
    setDetections([]);
  }, [videoRef]);

  // Snapshot of current detections (called by the Scan button)
  const capture = useCallback((): DetectedObjectResult[] => {
    return detections;
  }, [detections]);

  useEffect(() => { return () => stop(); }, [stop]);

  return { ready, loading, error, detections, start, stop, capture };
}
