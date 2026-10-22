/**
 * Fourier Mathematics Engine
 * Implements deterministic Fourier Series calculations for square, sawtooth,
 * triangle, and custom harmonic waveforms.
 */

import {
  WaveformType,
  CustomHarmonicConfig,
  SimulationSettings,
  SamplePoint,
  HarmonicComponent,
  MetricsData,
} from '../types/fourier';

const TWO_PI = 2 * Math.PI;

/**
 * Normalizes an angle into [0, 2*PI)
 */
export function normalizeAngle(angle: number): number {
  let val = angle % TWO_PI;
  if (val < 0) val += TWO_PI;
  return val;
}

/**
 * Calculates the ideal/original waveform value at phase x (in radians).
 * Handles jump discontinuities by setting midpoint value to 0.
 */
export function calculateOriginalWave(
  waveform: WaveformType,
  phase: number,
  amplitude: number,
  customConfig: CustomHarmonicConfig
): number {
  const theta = normalizeAngle(phase);
  const EPSILON = 1e-6;

  switch (waveform) {
    case 'square': {
      // Discontinuities at 0, PI, 2*PI -> midpoint is 0
      if (Math.abs(theta) < EPSILON || Math.abs(theta - Math.PI) < EPSILON || Math.abs(theta - TWO_PI) < EPSILON) {
        return 0;
      }
      return theta < Math.PI ? amplitude : -amplitude;
    }

    case 'sawtooth': {
      // Periodic ramp: f(x) = A * x / PI for x in (-PI, PI)
      // On [0, 2PI):
      // theta in [0, PI): f = A * (theta / PI)
      // theta == PI: discontinuity midpoint = 0
      // theta in (PI, 2PI): f = A * ((theta - 2*PI) / PI)
      if (Math.abs(theta - Math.PI) < EPSILON) {
        return 0;
      }
      if (theta < Math.PI) {
        return amplitude * (theta / Math.PI);
      }
      return amplitude * ((theta - TWO_PI) / Math.PI);
    }

    case 'triangle': {
      // Continuous symmetric triangle wave:
      // Peak +A at PI/2, Peak -A at 3*PI/2, 0 at 0, PI, 2*PI
      // Piecewise linear:
      // theta in [0, PI/2]: from 0 to A => (2A / PI) * theta
      // theta in [PI/2, 3*PI/2]: from A to -A => A - (2A / PI) * (theta - PI/2)
      // theta in [3*PI/2, 2*PI]: from -A to 0 => -A + (2A / PI) * (theta - 3*PI/2)
      if (theta <= Math.PI / 2) {
        return amplitude * (2 * theta / Math.PI);
      } else if (theta <= 1.5 * Math.PI) {
        return amplitude * (1 - 2 * (theta - Math.PI / 2) / Math.PI);
      } else {
        return amplitude * (-1 + 2 * (theta - 1.5 * Math.PI) / Math.PI);
      }
    }

    case 'custom': {
      // Exact sum of custom components
      const a1 = customConfig.a1;
      const b1 = customConfig.b1;
      const b2 = customConfig.b2;
      const b3 = customConfig.b3;
      return amplitude * (
        a1 * Math.cos(phase) +
        b1 * Math.sin(phase) +
        b2 * Math.sin(2 * phase) +
        b3 * Math.sin(3 * phase)
      );
    }

    default:
      return 0;
  }
}

/**
 * Calculates the Fourier Series finite approximation S_N(x) at phase x.
 */
export function calculateFourierApproximation(
  waveform: WaveformType,
  phase: number,
  harmonicsCount: number,
  amplitude: number,
  customConfig: CustomHarmonicConfig
): number {
  const N = Math.max(1, Math.floor(harmonicsCount));

  switch (waveform) {
    case 'square': {
      // SN(x) = (4A / PI) * sum_{k=0}^{N-1} [ sin((2k+1)x) / (2k+1) ]
      let sum = 0;
      for (let k = 0; k < N; k++) {
        const order = 2 * k + 1;
        sum += Math.sin(order * phase) / order;
      }
      return (4 * amplitude / Math.PI) * sum;
    }

    case 'sawtooth': {
      // SN(x) = (2A / PI) * sum_{n=1}^{N} [ (-1)^(n+1) * sin(nx) / n ]
      let sum = 0;
      for (let n = 1; n <= N; n++) {
        const sign = (n + 1) % 2 === 0 ? 1 : -1;
        sum += (sign * Math.sin(n * phase)) / n;
      }
      return (2 * amplitude / Math.PI) * sum;
    }

    case 'triangle': {
      // SN(x) = (8A / PI^2) * sum_{k=0}^{N-1} [ (-1)^k * sin((2k+1)x) / (2k+1)^2 ]
      let sum = 0;
      for (let k = 0; k < N; k++) {
        const order = 2 * k + 1;
        const sign = k % 2 === 0 ? 1 : -1;
        sum += (sign * Math.sin(order * phase)) / (order * order);
      }
      return (8 * amplitude / (Math.PI * Math.PI)) * sum;
    }

    case 'custom': {
      // Custom harmonic approximation:
      // Uses up to the available components
      const a1 = customConfig.a1;
      const b1 = customConfig.b1;
      const b2 = customConfig.b2;
      const b3 = customConfig.b3;

      let sum = 0;
      if (N >= 1) {
        sum += a1 * Math.cos(phase) + b1 * Math.sin(phase);
      }
      if (N >= 2) {
        sum += b2 * Math.sin(2 * phase);
      }
      if (N >= 3) {
        sum += b3 * Math.sin(3 * phase);
      }
      return amplitude * sum;
    }

    default:
      return 0;
  }
}

/**
 * Returns the individual harmonic components present in the current approximation.
 */
export function getHarmonicComponents(
  waveform: WaveformType,
  harmonicsCount: number,
  amplitude: number,
  customConfig: CustomHarmonicConfig,
  fundamentalFreq: number
): HarmonicComponent[] {
  const N = Math.max(1, Math.min(50, Math.floor(harmonicsCount)));
  const components: HarmonicComponent[] = [];

  switch (waveform) {
    case 'square': {
      for (let k = 0; k < N; k++) {
        const order = 2 * k + 1;
        const coeff = (4 * amplitude) / (Math.PI * order);
        components.push({
          index: k + 1,
          order,
          frequency: order * fundamentalFreq,
          amplitude: coeff,
          phaseShift: 0,
          formula: `${coeff.toFixed(3)} · sin(${order}x)`,
          isSine: true,
        });
      }
      break;
    }

    case 'sawtooth': {
      for (let n = 1; n <= N; n++) {
        const sign = (n + 1) % 2 === 0 ? 1 : -1;
        const coeffMagnitude = (2 * amplitude) / (Math.PI * n);
        components.push({
          index: n,
          order: n,
          frequency: n * fundamentalFreq,
          amplitude: coeffMagnitude,
          phaseShift: sign < 0 ? Math.PI : 0,
          formula: `${sign < 0 ? '-' : '+'}${coeffMagnitude.toFixed(3)} · sin(${n}x)`,
          isSine: true,
        });
      }
      break;
    }

    case 'triangle': {
      for (let k = 0; k < N; k++) {
        const order = 2 * k + 1;
        const sign = k % 2 === 0 ? 1 : -1;
        const coeffMagnitude = (8 * amplitude) / (Math.PI * Math.PI * order * order);
        components.push({
          index: k + 1,
          order,
          frequency: order * fundamentalFreq,
          amplitude: coeffMagnitude,
          phaseShift: sign < 0 ? Math.PI : 0,
          formula: `${sign < 0 ? '-' : '+'}${coeffMagnitude.toFixed(3)} · sin(${order}x)`,
          isSine: true,
        });
      }
      break;
    }

    case 'custom': {
      if (N >= 1 && (Math.abs(customConfig.a1) > 0.001 || Math.abs(customConfig.b1) > 0.001)) {
        if (Math.abs(customConfig.a1) > 0.001) {
          components.push({
            index: 1,
            order: 1,
            frequency: fundamentalFreq,
            amplitude: Math.abs(amplitude * customConfig.a1),
            phaseShift: 0,
            formula: `${(amplitude * customConfig.a1).toFixed(2)} · cos(x)`,
            isSine: false,
          });
        }
        if (Math.abs(customConfig.b1) > 0.001) {
          components.push({
            index: components.length + 1,
            order: 1,
            frequency: fundamentalFreq,
            amplitude: Math.abs(amplitude * customConfig.b1),
            phaseShift: 0,
            formula: `${(amplitude * customConfig.b1).toFixed(2)} · sin(x)`,
            isSine: true,
          });
        }
      }
      if (N >= 2 && Math.abs(customConfig.b2) > 0.001) {
        components.push({
          index: components.length + 1,
          order: 2,
          frequency: 2 * fundamentalFreq,
          amplitude: Math.abs(amplitude * customConfig.b2),
          phaseShift: 0,
          formula: `${(amplitude * customConfig.b2).toFixed(2)} · sin(2x)`,
          isSine: true,
        });
      }
      if (N >= 3 && Math.abs(customConfig.b3) > 0.001) {
        components.push({
          index: components.length + 1,
          order: 3,
          frequency: 3 * fundamentalFreq,
          amplitude: Math.abs(amplitude * customConfig.b3),
          phaseShift: 0,
          formula: `${(amplitude * customConfig.b3).toFixed(2)} · sin(3x)`,
          isSine: true,
        });
      }
      break;
    }
  }

  return components;
}

/**
 * Generates sample points over numPeriods (default: 2 periods)
 */
export function generateWaveformSamples(
  settings: SimulationSettings,
  numPeriods: number = 2
): SamplePoint[] {
  const { waveform, harmonicsCount, fundamentalFreq, amplitude, customConfig, samplePoints } = settings;
  const count = Math.max(200, Math.min(2000, samplePoints || 800));
  const period = 1 / Math.max(0.1, fundamentalFreq);
  const totalDuration = numPeriods * period;

  const samples: SamplePoint[] = new Array(count);

  for (let i = 0; i < count; i++) {
    const t = (i / (count - 1)) * totalDuration;
    // phase x(t) = 2 * PI * f0 * t + phaseOffset
    const phase = TWO_PI * fundamentalFreq * t + (settings.phaseOffset || 0);

    const original = calculateOriginalWave(waveform, phase, amplitude, customConfig);
    const approx = calculateFourierApproximation(waveform, phase, harmonicsCount, amplitude, customConfig);
    const error = Math.abs(original - approx);

    samples[i] = {
      t,
      phase,
      original,
      approx,
      error,
    };
  }

  return samples;
}

/**
 * Calculates quantitative accuracy metrics including NRMSE and Gibbs overshoot
 */
export function calculateMetrics(
  samples: SamplePoint[],
  waveform: WaveformType,
  amplitude: number,
  harmonicsCount: number,
  fundamentalFreq: number
): MetricsData {
  if (!samples || samples.length === 0) {
    return {
      nrmse: 0,
      rmse: 0,
      maxError: 0,
      maxOrder: 1,
      maxFrequency: fundamentalFreq,
      period: 1 / fundamentalFreq,
      peakOvershootPct: 0,
    };
  }

  let sumSquaredErr = 0;
  let maxErr = 0;
  let fMin = samples[0].original;
  let fMax = samples[0].original;
  let approxMax = samples[0].approx;

  for (let i = 0; i < samples.length; i++) {
    const s = samples[i];
    const diff = s.original - s.approx;
    sumSquaredErr += diff * diff;

    const absErr = Math.abs(diff);
    if (absErr > maxErr) maxErr = absErr;

    if (s.original < fMin) fMin = s.original;
    if (s.original > fMax) fMax = s.original;

    if (s.approx > approxMax) approxMax = s.approx;
  }

  const M = samples.length;
  const rmse = Math.sqrt(sumSquaredErr / M);
  const range = fMax - fMin;

  // Safe division for NRMSE
  const nrmse = range > 1e-6 ? rmse / range : 0;

  // Highest harmonic order
  let maxOrder = 1;
  if (waveform === 'square' || waveform === 'triangle') {
    maxOrder = 2 * harmonicsCount - 1;
  } else if (waveform === 'sawtooth') {
    maxOrder = harmonicsCount;
  } else {
    maxOrder = Math.min(3, harmonicsCount);
  }

  // Gibbs overshoot calculation for square/sawtooth
  let peakOvershootPct = 0;
  if (waveform === 'square') {
    // Theoretical maximum of Gibbs overshoot is approx 8.949% of jump half-height
    // Let's compute actual sampled overshoot over target amplitude A
    const overshoot = Math.max(0, approxMax - amplitude);
    peakOvershootPct = (overshoot / amplitude) * 100;
  } else if (waveform === 'sawtooth') {
    const overshoot = Math.max(0, approxMax - amplitude);
    peakOvershootPct = (overshoot / amplitude) * 100;
  }

  return {
    nrmse,
    rmse,
    maxError: maxErr,
    maxOrder,
    maxFrequency: maxOrder * fundamentalFreq,
    period: 1 / fundamentalFreq,
    peakOvershootPct,
  };
}

/**
 * Returns detailed mathematical formula data
 */
export function getFormulaData(
  waveform: WaveformType,
  harmonicsCount: number,
  amplitude: number,
  customConfig: CustomHarmonicConfig
) {
  switch (waveform) {
    case 'square':
      return {
        name: 'Square Wave Fourier Series',
        generalFormula: 'S_N(x) = \\frac{4A}{\\pi} \\sum_{k=0}^{N-1} \\frac{\\sin((2k+1)x)}{2k+1}',
        expandedFormula: `S_${harmonicsCount}(x) = ${(4 * amplitude / Math.PI).toFixed(2)} · [ sin(x) + \\frac{sin(3x)}{3} + \\frac{sin(5x)}{5} + ... + \\frac{sin(${2 * harmonicsCount - 1}x)}{${2 * harmonicsCount - 1}} ]`,
        symmetryNote: 'Odd half-wave symmetry (f(x) = -f(x + π)). Only odd sine harmonics exist; all even harmonics and cosine terms are exactly zero.',
        convergenceRate: '1/n (slow algebraic convergence due to step discontinuities, resulting in Gibbs overshoot of ~8.95% at jumps).',
      };

    case 'sawtooth':
      return {
        name: 'Sawtooth Wave Fourier Series',
        generalFormula: 'S_N(x) = \\frac{2A}{\\pi} \\sum_{n=1}^{N} \\frac{(-1)^{n+1}\\sin(nx)}{n}',
        expandedFormula: `S_${harmonicsCount}(x) = ${(2 * amplitude / Math.PI).toFixed(2)} · [ sin(x) - \\frac{sin(2x)}{2} + \\frac{sin(3x)}{3} - ... + \\frac{(-1)^{${harmonicsCount + 1}}sin(${harmonicsCount}x)}{${harmonicsCount}} ]`,
        symmetryNote: 'Odd symmetry (f(-x) = -f(x)). Contains both odd and even harmonics with alternating signs.',
        convergenceRate: '1/n (slow convergence due to periodic jump discontinuities at x = ±π).',
      };

    case 'triangle':
      return {
        name: 'Triangle Wave Fourier Series',
        generalFormula: 'S_N(x) = \\frac{8A}{\\pi^2} \\sum_{k=0}^{N-1} \\frac{(-1)^k\\sin((2k+1)x)}{(2k+1)^2}',
        expandedFormula: `S_${harmonicsCount}(x) = ${(8 * amplitude / (Math.PI * Math.PI)).toFixed(2)} · [ sin(x) - \\frac{sin(3x)}{9} + \\frac{sin(5x)}{25} - ... + \\frac{(-1)^{${harmonicsCount - 1}}sin(${2 * harmonicsCount - 1}x)}{${(2 * harmonicsCount - 1) ** 2}} ]`,
        symmetryNote: 'Continuous everywhere with derivative jump discontinuity. Only odd sine harmonics exist with alternating signs.',
        convergenceRate: '1/n² (fast quadratic convergence because the function is continuous; Gibbs phenomenon is absent).',
      };

    case 'custom':
      return {
        name: 'Custom Synthesized Harmonic Wave',
        generalFormula: 'S(x) = a_1 \\cos(x) + b_1 \\sin(x) + b_2 \\sin(2x) + b_3 \\sin(3x)',
        expandedFormula: `S(x) = ${amplitude} · [ ${customConfig.a1.toFixed(2)}·cos(x) + ${customConfig.b1.toFixed(2)}·sin(x) + ${customConfig.b2.toFixed(2)}·sin(2x) + ${customConfig.b3.toFixed(2)}·sin(3x) ]`,
        symmetryNote: 'User-specified arbitrary linear combination of orthogonal trigonometric basis functions.',
        convergenceRate: 'Exact finite trigonometric polynomial (zero truncation error for the specified 3 harmonic orders).',
      };
  }
}
