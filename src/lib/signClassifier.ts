// Lazy-load TF.js so Rollup can split it into its own async chunk
type TF = typeof import('@tensorflow/tfjs');
let _tf: TF | null = null;

async function getTf(): Promise<TF> {
  if (!_tf) {
    _tf = await import('@tensorflow/tfjs');
    await _tf.ready();
  }
  return _tf;
}

export interface SignSample {
  label: string;
  features: number[]; // 63 values from normalizeLandmarks
}

export interface TrainingDataset {
  samples: SignSample[];
  labels: string[]; // ordered unique label list
  createdAt: string;
}

const STORAGE_KEY = 'signlearn-training-data';
const MODEL_KEY   = 'signlearn-model';

// ── Persistence ───────────────────────────────────────────────────────────────

export function saveTrainingData(dataset: TrainingDataset): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(dataset));
}

export function loadTrainingData(): TrainingDataset | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as TrainingDataset) : null;
  } catch {
    return null;
  }
}

export function clearTrainingData(): void {
  localStorage.removeItem(STORAGE_KEY);
}

// ── Model architecture ────────────────────────────────────────────────────────

/**
 * Builds a small dense network:
 *   Input(63) → Dense(128, relu) → Dropout(0.3)
 *               → Dense(64, relu)  → Dropout(0.2)
 *               → Dense(numClasses, softmax)
 *
 * 63 features = 21 landmarks × 3 axes (normalised)
 */
async function buildModel(numClasses: number): Promise<import('@tensorflow/tfjs').Sequential> {
  const tf = await getTf();
  const model = tf.sequential();
  model.add(tf.layers.dense({ inputShape: [63], units: 128, activation: 'relu' }));
  model.add(tf.layers.dropout({ rate: 0.3 }));
  model.add(tf.layers.dense({ units: 64, activation: 'relu' }));
  model.add(tf.layers.dropout({ rate: 0.2 }));
  model.add(tf.layers.dense({ units: numClasses, activation: 'softmax' }));

  model.compile({
    optimizer: tf.train.adam(0.001),
    loss: 'categoricalCrossentropy',
    metrics: ['accuracy'],
  });
  return model;
}

// ── Training ──────────────────────────────────────────────────────────────────

export interface TrainingOptions {
  epochs?: number;
  batchSize?: number;
  validationSplit?: number;
  onEpochEnd?: (epoch: number, logs: { loss: number; acc: number; val_loss?: number; val_acc?: number }) => void;
}

export interface TrainedModel {
  model: import('@tensorflow/tfjs').Sequential;
  labels: string[];
}

export async function trainModel(
  dataset: TrainingDataset,
  opts: TrainingOptions = {}
): Promise<TrainedModel> {
  const tf = await getTf();
  const { epochs = 80, batchSize = 32, validationSplit = 0.2, onEpochEnd } = opts;

  const labels = dataset.labels;
  const numClasses = labels.length;

  // Build input tensor  [N, 63]
  const xs = tf.tensor2d(dataset.samples.map(s => s.features));

  // One-hot encode labels  [N, numClasses]
  const labelIndices = dataset.samples.map(s => labels.indexOf(s.label));
  const ys = tf.oneHot(tf.tensor1d(labelIndices, 'int32'), numClasses);

  const model = await buildModel(numClasses);

  await model.fit(xs, ys, {
    epochs,
    batchSize,
    validationSplit,
    shuffle: true,
    callbacks: {
      onEpochEnd: onEpochEnd
        ? (epoch, logs) =>
            onEpochEnd(epoch, {
              loss: logs?.['loss'] as number ?? 0,
              acc: logs?.['acc'] as number ?? 0,
              val_loss: logs?.['val_loss'] as number | undefined,
              val_acc: logs?.['val_acc'] as number | undefined,
            })
        : undefined,
    },
  });

  xs.dispose();
  ys.dispose();

  return { model, labels };
}

// ── Persistence (IndexedDB via TF.js) ────────────────────────────────────────

export async function saveModel(trained: TrainedModel): Promise<void> {
  await trained.model.save(`indexeddb://${MODEL_KEY}`);
  localStorage.setItem(`${MODEL_KEY}-labels`, JSON.stringify(trained.labels));
}

export async function loadModel(): Promise<TrainedModel | null> {
  try {
    const tf = await getTf();
    const model = (await tf.loadLayersModel(`indexeddb://${MODEL_KEY}`)) as import('@tensorflow/tfjs').Sequential;
    const raw = localStorage.getItem(`${MODEL_KEY}-labels`);
    if (!raw) return null;
    return { model, labels: JSON.parse(raw) as string[] };
  } catch {
    return null;
  }
}

export async function deleteModel(): Promise<void> {
  try {
    const tf = await getTf();
    await tf.io.removeModel(`indexeddb://${MODEL_KEY}`);
    localStorage.removeItem(`${MODEL_KEY}-labels`);
  } catch { /* already gone */ }
}

// ── Inference ─────────────────────────────────────────────────────────────────

export interface Prediction {
  label: string;
  confidence: number; // 0–1
}

/**
 * Run inference on a single 63-element feature vector.
 * Returns the top prediction and all class scores.
 * NOTE: This function is synchronous because `tf` is already initialised by the
 * time a TrainedModel exists (loadModel / trainModel both call getTf() first).
 * We keep it sync to avoid changing the call-sites in useSignClassifier.ts.
 */
export function predict(trained: TrainedModel, features: Float32Array): {
  top: Prediction;
  all: Prediction[];
} {
  // _tf is guaranteed to be non-null here because getTf() was awaited in
  // loadModel/trainModel before any TrainedModel could be created.
  const tf = _tf!;
  const input = tf.tensor2d([Array.from(features)]);
  const output = trained.model.predict(input) as import('@tensorflow/tfjs').Tensor;
  const scores = Array.from(output.dataSync()) as number[];
  input.dispose();
  output.dispose();

  const all: Prediction[] = trained.labels.map((label, i) => ({
    label,
    confidence: scores[i] ?? 0,
  }));
  all.sort((a, b) => b.confidence - a.confidence);

  return { top: all[0]!, all };
}
