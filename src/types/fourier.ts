/**
 * Types and interfaces for Fourier Series Wave Generator
 */

export type WaveformType = 'square' | 'sawtooth' | 'triangle' | 'custom';

export interface CustomHarmonicConfig {
  a1: number; // Fundamental cosine amplitude
  b1: number; // Fundamental sine amplitude
  b2: number; // 2nd harmonic sine amplitude
  b3: number; // 3rd harmonic sine amplitude
}

export interface SimulationSettings {
  waveform: WaveformType;
  harmonicsCount: number; // Number of harmonic terms included
  fundamentalFreq: number; // f0 in Hz (0.5 - 5.0)
  amplitude: number; // A (0.5 - 2.0)
  customConfig: CustomHarmonicConfig;
  showOriginal: boolean;
  showApproximation: boolean;
  showHarmonics: boolean;
  showGibbsHighlight: boolean;
  samplePoints: number;
  isRunning?: boolean; // Animation play/pause state
  phaseOffset?: number; // Animated phase offset in radians
}

export interface SamplePoint {
  t: number; // time in seconds
  phase: number; // phase x in radians (0 to 4pi for 2 periods)
  original: number; // f(t)
  approx: number; // SN(t)
  error: number; // |f(t) - SN(t)|
}

export interface HarmonicComponent {
  index: number; // 1-based index in the summation
  order: number; // Actual harmonic order n (e.g. 1, 3, 5 for square)
  frequency: number; // n * f0 in Hz
  amplitude: number; // coefficient magnitude
  phaseShift: number; // 0 or pi
  formula: string; // readable mathematical term
  isSine: boolean;
}

export interface MetricsData {
  nrmse: number; // Normalized Root Mean Square Error (0.0 to 1.0+)
  rmse: number; // Root Mean Square Error
  maxError: number; // Maximum absolute error
  maxOrder: number; // Highest harmonic order used
  maxFrequency: number; // Highest frequency component (Hz)
  period: number; // Fundamental period T = 1/f0
  peakOvershootPct: number; // Gibbs overshoot percentage (e.g. ~8.95% for square)
}

export interface PresetExperiment {
  id: string;
  title: string;
  badge: string;
  description: string;
  learningGoal: string;
  settings: Partial<SimulationSettings>;
}
