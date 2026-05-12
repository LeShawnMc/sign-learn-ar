import type { NormalizedLandmark } from '@mediapipe/tasks-vision';
import { LANDMARK } from './useMediaPipeHands';

/**
 * Converts 21 raw MediaPipe landmarks into a 63-element feature vector
 * that is invariant to:
 *   - Hand position in the frame (translated so wrist = origin)
 *   - Hand scale (normalized by wrist-to-middle-MCP distance)
 *
 * Output: Float32Array of length 63  [x0,y0,z0, x1,y1,z1, …, x20,y20,z20]
 */
export function normalizeLandmarks(landmarks: NormalizedLandmark[]): Float32Array {
  if (landmarks.length !== 21) {
    throw new Error(`Expected 21 landmarks, got ${landmarks.length}`);
  }

  const wrist = landmarks[LANDMARK.WRIST];
  const midMcp = landmarks[LANDMARK.MIDDLE_MCP];

  // Scale = distance from wrist to middle finger MCP (hand "size")
  const dx = midMcp.x - wrist.x;
  const dy = midMcp.y - wrist.y;
  const dz = (midMcp.z ?? 0) - (wrist.z ?? 0);
  const scale = Math.sqrt(dx * dx + dy * dy + dz * dz) || 1;

  const out = new Float32Array(63);
  for (let i = 0; i < 21; i++) {
    const pt = landmarks[i];
    out[i * 3 + 0] = (pt.x - wrist.x) / scale;
    out[i * 3 + 1] = (pt.y - wrist.y) / scale;
    out[i * 3 + 2] = ((pt.z ?? 0) - (wrist.z ?? 0)) / scale;
  }
  return out;
}

/** Convenience: average several frames together to reduce noise */
export function averageFeatures(frames: Float32Array[]): Float32Array {
  if (frames.length === 0) throw new Error('No frames to average');
  const out = new Float32Array(63);
  for (const f of frames) {
    for (let i = 0; i < 63; i++) out[i] += f[i];
  }
  for (let i = 0; i < 63; i++) out[i] /= frames.length;
  return out;
}
