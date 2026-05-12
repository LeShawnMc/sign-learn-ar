import { useState, useEffect, useRef, useCallback } from 'react';
import type { NormalizedLandmark } from '@mediapipe/tasks-vision';
import { normalizeLandmarks, averageFeatures } from './landmarkNormalizer';
import {
  loadModel,
  predict,
  type TrainedModel,
  type Prediction,
} from './signClassifier';

export interface SignClassifierState {
  /** true once a trained model is loaded and ready to predict */
  ready: boolean;
  /** true while the model is loading from IndexedDB */
  loading: boolean;
  /** true if no saved model was found */
  noModel: boolean;
  /** most recent top prediction (null when no hand visible) */
  prediction: Prediction | null;
  /** all class scores from the last prediction */
  allScores: Prediction[];
  /** confidence threshold — predictions below this are ignored */
  threshold: number;
  setThreshold: (t: number) => void;
  /** manually reload the model from IndexedDB (call after training) */
  reload: () => Promise<void>;
}

/**
 * Loads the trained sign classifier from IndexedDB and runs inference
 * on every new batch of MediaPipe landmarks.
 *
 * Smoothing: averages the last `smoothingFrames` feature vectors before
 * predicting, reducing jitter from single-frame noise.
 */
export function useSignClassifier(
  landmarks: NormalizedLandmark[][] | null,
  options: { smoothingFrames?: number; threshold?: number } = {}
): SignClassifierState {
  const { smoothingFrames = 5 } = options;

  const [ready, setReady]           = useState(false);
  const [loading, setLoading]       = useState(true);
  const [noModel, setNoModel]       = useState(false);
  const [prediction, setPrediction] = useState<Prediction | null>(null);
  const [allScores, setAllScores]   = useState<Prediction[]>([]);
  const [threshold, setThreshold]   = useState(options.threshold ?? 0.7);

  const modelRef   = useRef<TrainedModel | null>(null);
  const frameBuffer = useRef<Float32Array[]>([]);

  const reload = useCallback(async () => {
    setLoading(true);
    setReady(false);
    setNoModel(false);
    const trained = await loadModel();
    if (trained) {
      modelRef.current = trained;
      setReady(true);
    } else {
      setNoModel(true);
    }
    setLoading(false);
  }, []);

  // Load on mount
  useEffect(() => { reload(); }, [reload]);

  // Run inference whenever landmarks change
  useEffect(() => {
    if (!ready || !modelRef.current) return;
    if (!landmarks || landmarks.length === 0) {
      setPrediction(null);
      setAllScores([]);
      frameBuffer.current = [];
      return;
    }

    // Use the first detected hand
    const hand = landmarks[0];
    if (hand.length !== 21) return;

    try {
      const features = normalizeLandmarks(hand);
      frameBuffer.current.push(features);
      if (frameBuffer.current.length > smoothingFrames) {
        frameBuffer.current.shift();
      }

      const smoothed = averageFeatures(frameBuffer.current);
      const result = predict(modelRef.current, smoothed);

      if (result.top.confidence >= threshold) {
        setPrediction(result.top);
      } else {
        setPrediction(null);
      }
      setAllScores(result.all);
    } catch {
      // Landmark shape mismatch — skip this frame
    }
  }, [landmarks, ready, smoothingFrames, threshold]);

  return { ready, loading, noModel, prediction, allScores, threshold, setThreshold, reload };
}
