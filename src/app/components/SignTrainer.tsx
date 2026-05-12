import { useState, useRef, useCallback } from 'react';
import { CameraView } from './CameraView';
import type { NormalizedLandmark } from '@mediapipe/tasks-vision';
import { normalizeLandmarks } from '../../lib/landmarkNormalizer';
import {
  trainModel,
  saveModel,
  loadTrainingData,
  saveTrainingData,
  clearTrainingData,
  deleteModel,
  type TrainingDataset,
  type SignSample,
} from '../../lib/signClassifier';

interface SignTrainerProps {
  onBack: () => void;
  /** Called after a model is successfully saved so parent can reload the classifier */
  onModelSaved?: () => void;
}

interface EpochLog { epoch: number; loss: number; acc: number; val_acc?: number }

const SAMPLES_PER_SIGN = 50; // how many frames to collect per sign

export function SignTrainer({ onBack, onModelSaved }: SignTrainerProps) {
  const [dataset, setDataset] = useState<TrainingDataset>(
    () => loadTrainingData() ?? { samples: [], labels: [], createdAt: new Date().toISOString() }
  );
  const [newLabel, setNewLabel] = useState('');
  const [collecting, setCollecting] = useState<string | null>(null); // label being collected
  const [sampleCount, setSampleCount] = useState(0);
  const [training, setTraining] = useState(false);
  const [trainLogs, setTrainLogs] = useState<EpochLog[]>([]);
  const [trained, setTrained] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentLandmarks, setCurrentLandmarks] = useState<NormalizedLandmark[][] | null>(null);

  const collectedRef = useRef<SignSample[]>([]);
  const collectingRef = useRef<string | null>(null);

  // Receive landmarks from CameraView every frame
  const handleLandmarks = useCallback(
    (lms: NormalizedLandmark[][] | null) => {
      setCurrentLandmarks(lms);
      if (!collectingRef.current || !lms || lms.length === 0) return;
      const hand = lms[0];
      if (hand.length !== 21) return;

      try {
        const features = Array.from(normalizeLandmarks(hand));
        collectedRef.current.push({ label: collectingRef.current, features });
        setSampleCount(collectedRef.current.length);

        if (collectedRef.current.length >= SAMPLES_PER_SIGN) {
          finishCollecting();
        }
      } catch { /* skip malformed frame */ }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  const addLabel = () => {
    const label = newLabel.trim().toUpperCase();
    if (!label || dataset.labels.includes(label)) return;
    const updated: TrainingDataset = {
      ...dataset,
      labels: [...dataset.labels, label],
    };
    setDataset(updated);
    saveTrainingData(updated);
    setNewLabel('');
  };

  const removeLabel = (label: string) => {
    const updated: TrainingDataset = {
      ...dataset,
      labels: dataset.labels.filter(l => l !== label),
      samples: dataset.samples.filter(s => s.label !== label),
    };
    setDataset(updated);
    saveTrainingData(updated);
  };

  const startCollecting = (label: string) => {
    collectedRef.current = [];
    collectingRef.current = label;
    setCollecting(label);
    setSampleCount(0);
  };

  const finishCollecting = () => {
    const label = collectingRef.current;
    if (!label) return;
    const newSamples = collectedRef.current;
    const updated: TrainingDataset = {
      ...dataset,
      samples: [...dataset.samples.filter(s => s.label !== label), ...newSamples],
    };
    setDataset(updated);
    saveTrainingData(updated);
    collectingRef.current = null;
    setCollecting(null);
    setSampleCount(0);
    collectedRef.current = [];
  };

  const samplesForLabel = (label: string) =>
    dataset.samples.filter(s => s.label === label).length;

  const canTrain = dataset.labels.length >= 2 &&
    dataset.labels.every(l => samplesForLabel(l) >= SAMPLES_PER_SIGN);

  const handleTrain = async () => {
    setTraining(true);
    setTrainLogs([]);
    setError(null);
    try {
      const result = await trainModel(dataset, {
        epochs: 80,
        batchSize: 32,
        onEpochEnd: (epoch, logs) => {
          setTrainLogs(prev => [...prev.slice(-19), { epoch, ...logs }]);
        },
      });
      await saveModel(result);
      setTrained(true);
      onModelSaved?.();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Training failed');
    } finally {
      setTraining(false);
    }
  };

  const handleReset = async () => {
    clearTrainingData();
    await deleteModel();
    setDataset({ samples: [], labels: [], createdAt: new Date().toISOString() });
    setTrainLogs([]);
    setTrained(false);
    setError(null);
  };

  const lastLog = trainLogs[trainLogs.length - 1];

  return (
    <div className="h-full flex flex-col overflow-hidden" style={{ background: 'var(--color-bg-deep)', color: 'var(--color-text)' }}>

      {/* Header */}
      <div className="flex items-center gap-3 p-4 border-b shrink-0" style={{ borderColor: 'var(--vr-border)' }}>
        <button onClick={onBack} className="text-sm font-medium" style={{ color: 'var(--color-cyan)' }}>← Back</button>
        <div>
          <h1 className="font-bold">Sign Trainer</h1>
          <p className="text-xs" style={{ color: 'var(--color-text-muted)' }}>Collect samples · Train model · Predict signs</p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-5">

        {/* Camera feed */}
        <CameraView
          mirrored
          onLandmarks={handleLandmarks}
          className="w-full rounded-xl"
          style={{ height: 220 }}
        />

        {/* Hand detected indicator */}
        <div className="flex items-center gap-2 text-sm">
          <span className={`w-2 h-2 rounded-full ${currentLandmarks && currentLandmarks.length > 0 ? 'bg-green-400' : 'bg-gray-600'}`} />
          <span style={{ color: 'var(--color-text-muted)' }}>
            {currentLandmarks && currentLandmarks.length > 0 ? 'Hand detected' : 'No hand detected — enable camera above'}
          </span>
        </div>

        {/* Step 1: Define signs */}
        <section>
          <h2 className="text-sm font-bold uppercase tracking-wide mb-3" style={{ color: 'var(--color-cyan)' }}>
            Step 1 — Define Signs
          </h2>
          <div className="flex gap-2 mb-3">
            <input
              value={newLabel}
              onChange={e => setNewLabel(e.target.value.toUpperCase())}
              onKeyDown={e => e.key === 'Enter' && addLabel()}
              placeholder="e.g. HELLO"
              className="flex-1 px-3 py-2 rounded-lg text-sm border bg-transparent"
              style={{ borderColor: 'var(--vr-border)', color: 'var(--color-text)' }}
              maxLength={20}
            />
            <button
              onClick={addLabel}
              disabled={!newLabel.trim()}
              className="px-4 py-2 rounded-lg text-sm font-semibold disabled:opacity-40"
              style={{ background: 'var(--color-brand)', color: '#fff' }}
            >
              Add
            </button>
          </div>
          <div className="space-y-2">
            {dataset.labels.map(label => (
              <div key={label} className="flex items-center gap-3 rounded-lg p-3" style={{ background: 'var(--color-bg-card)' }}>
                <div className="flex-1">
                  <span className="font-semibold text-sm">{label}</span>
                  <span className="text-xs ml-2" style={{ color: samplesForLabel(label) >= SAMPLES_PER_SIGN ? 'var(--color-ar-teal)' : 'var(--color-text-muted)' }}>
                    {samplesForLabel(label)}/{SAMPLES_PER_SIGN} samples
                  </span>
                </div>
                {collecting === label ? (
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-red-400 animate-pulse" />
                    <span className="text-xs font-mono" style={{ color: 'var(--color-text-muted)' }}>{sampleCount}/{SAMPLES_PER_SIGN}</span>
                    <button onClick={finishCollecting} className="text-xs px-2 py-1 rounded" style={{ background: 'var(--color-danger)', color: '#fff' }}>Stop</button>
                  </div>
                ) : (
                  <div className="flex gap-2">
                    <button
                      onClick={() => startCollecting(label)}
                      disabled={!!collecting}
                      className="text-xs px-3 py-1.5 rounded-lg font-semibold disabled:opacity-40"
                      style={{ background: 'var(--color-ar-teal)', color: '#000' }}
                    >
                      {samplesForLabel(label) >= SAMPLES_PER_SIGN ? 'Re-record' : 'Record'}
                    </button>
                    <button onClick={() => removeLabel(label)} className="text-xs px-2 py-1 rounded" style={{ color: 'var(--color-danger)' }}>✕</button>
                  </div>
                )}
              </div>
            ))}
            {dataset.labels.length === 0 && (
              <p className="text-sm text-center py-4" style={{ color: 'var(--color-text-muted)' }}>Add at least 2 signs to get started</p>
            )}
          </div>
        </section>

        {/* Step 2: Train */}
        <section>
          <h2 className="text-sm font-bold uppercase tracking-wide mb-3" style={{ color: 'var(--color-cyan)' }}>
            Step 2 — Train Model
          </h2>
          {!canTrain && (
            <p className="text-xs mb-3" style={{ color: 'var(--color-text-muted)' }}>
              Record {SAMPLES_PER_SIGN} samples for each sign ({dataset.labels.filter(l => samplesForLabel(l) < SAMPLES_PER_SIGN).join(', ') || '—'} still needed)
            </p>
          )}
          <button
            onClick={handleTrain}
            disabled={!canTrain || training}
            className="w-full py-3 rounded-xl font-semibold text-sm disabled:opacity-40"
            style={{ background: canTrain ? 'var(--color-premium)' : 'var(--color-bg-card)', color: '#fff' }}
          >
            {training ? `Training… epoch ${lastLog?.epoch ?? 0}/80` : trained ? 'Re-train Model' : 'Train Model'}
          </button>

          {/* Live training progress */}
          {training && lastLog && (
            <div className="mt-3 rounded-lg p-3 font-mono text-xs space-y-1" style={{ background: 'var(--color-bg-card)' }}>
              <div className="flex justify-between">
                <span style={{ color: 'var(--color-text-muted)' }}>Loss</span>
                <span style={{ color: 'var(--color-danger)' }}>{lastLog.loss.toFixed(4)}</span>
              </div>
              <div className="flex justify-between">
                <span style={{ color: 'var(--color-text-muted)' }}>Train acc</span>
                <span style={{ color: 'var(--color-ar-teal)' }}>{(lastLog.acc * 100).toFixed(1)}%</span>
              </div>
              {lastLog.val_acc !== undefined && (
                <div className="flex justify-between">
                  <span style={{ color: 'var(--color-text-muted)' }}>Val acc</span>
                  <span style={{ color: 'var(--color-cyan)' }}>{(lastLog.val_acc * 100).toFixed(1)}%</span>
                </div>
              )}
              {/* Progress bar */}
              <div className="w-full rounded-full h-1.5 mt-2" style={{ background: 'var(--vr-border)' }}>
                <div
                  className="h-1.5 rounded-full transition-all"
                  style={{ width: `${((lastLog.epoch / 80) * 100).toFixed(0)}%`, background: 'var(--color-premium)' }}
                />
              </div>
            </div>
          )}

          {/* Success */}
          {trained && !training && (
            <div className="mt-3 rounded-lg p-3 text-sm text-center" style={{ background: 'rgba(0,217,192,0.1)', color: 'var(--color-ar-teal)' }}>
              ✓ Model saved — go to Hand Tracking Practice to try it out
            </div>
          )}

          {/* Error */}
          {error && (
            <div className="mt-3 rounded-lg p-3 text-xs" style={{ background: 'rgba(255,107,107,0.1)', color: 'var(--color-danger)' }}>
              {error}
            </div>
          )}
        </section>

        {/* Reset */}
        <section className="pb-6">
          <button onClick={handleReset} className="text-xs" style={{ color: 'var(--color-danger)' }}>
            Reset all training data and model
          </button>
        </section>
      </div>
    </div>
  );
}
