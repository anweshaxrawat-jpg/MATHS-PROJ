import React from 'react';
import { SimulationSettings, SamplePoint } from '../types/fourier';
import {
  calculateOriginalWave,
  calculateFourierApproximation,
  calculateMetrics,
} from '../utils/fourier';

interface WaveComparisonProps {
  settings: SimulationSettings;
  onSelectHarmonicCount: (count: number) => void;
}

export const WaveComparison: React.FC<WaveComparisonProps> = ({
  settings,
  onSelectHarmonicCount,
}) => {
  const { waveform, amplitude, customConfig, fundamentalFreq, harmonicsCount } = settings;

  const comparisonCounts = [1, 3, 5, 10];

  const comparisonData = comparisonCounts.map((count) => {
    const pointsCount = 100;
    const period = 1 / fundamentalFreq;
    const samples: SamplePoint[] = [];

    for (let i = 0; i < pointsCount; i++) {
      const t = (i / (pointsCount - 1)) * period;
      const phase = 2 * Math.PI * fundamentalFreq * t;
      const original = calculateOriginalWave(waveform, phase, amplitude, customConfig);
      const approx = calculateFourierApproximation(waveform, phase, count, amplitude, customConfig);
      samples.push({
        t,
        phase,
        original,
        approx,
        error: Math.abs(original - approx),
      });
    }

    const metrics = calculateMetrics(samples, waveform, amplitude, count, fundamentalFreq);

    let maxOrder = count;
    if (waveform === 'square' || waveform === 'triangle') {
      maxOrder = 2 * count - 1;
    }

    return {
      count,
      maxOrder,
      samples,
      metrics,
    };
  });

  const renderComparisonPlot = (samples: SamplePoint[]) => {
    const width = 240;
    const height = 75;
    const maxAmp = Math.max(1.2, amplitude * 1.35);

    const scaleX = (idx: number) => (idx / (samples.length - 1)) * width;
    const scaleY = (val: number) => height / 2 - (val / maxAmp) * (height * 0.44);

    let approxPath = '';
    let targetPath = '';

    samples.forEach((pt, idx) => {
      const x = scaleX(idx);
      const yApprox = scaleY(pt.approx);
      const yTarget = scaleY(pt.original);

      if (idx === 0) {
        approxPath += `M ${x.toFixed(1)} ${yApprox.toFixed(1)}`;
        targetPath += `M ${x.toFixed(1)} ${yTarget.toFixed(1)}`;
      } else {
        approxPath += ` L ${x.toFixed(1)} ${yApprox.toFixed(1)}`;
        targetPath += ` L ${x.toFixed(1)} ${yTarget.toFixed(1)}`;
      }
    });

    return (
      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="w-full h-20 bg-[#151D2E] border border-[#263247] rounded block"
      >
        <line
          x1="0"
          y1={height / 2}
          x2={width}
          y2={height / 2}
          stroke="#1E2B40"
          strokeDasharray="2,2"
          strokeWidth="1"
        />
        {/* Target in soft coral: #F59E7B */}
        <path
          d={targetPath}
          fill="none"
          stroke="#F59E7B"
          strokeWidth="1.2"
          strokeDasharray="3,2"
          opacity="0.85"
        />
        {/* Approximation in electric blue: #5B8CFF */}
        <path
          d={approxPath}
          fill="none"
          stroke="#5B8CFF"
          strokeWidth="1.8"
          strokeLinecap="round"
        />
      </svg>
    );
  };

  return (
    <div className="bg-[#111827] rounded-lg border border-[#263247] p-5 space-y-4 text-[#F1F5F9]">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1 border-b border-[#1E293B] pb-3">
        <div>
          <h3 className="text-sm font-semibold text-[#F1F5F9] tracking-tight">
            Harmonic progression comparison
          </h3>
          <p className="text-xs text-[#94A3B8] mt-0.5">
            Evaluate convergence and edge reconstruction as harmonic count increments (1, 3, 5, 10)
          </p>
        </div>
        <span className="text-xs text-[#94A3B8]">
          Current selection: N = {harmonicsCount}
        </span>
      </div>

      {/* Grid of 4 Comparison Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 pt-1">
        {comparisonData.map(({ count, maxOrder, samples, metrics }) => {
          const isCurrent = harmonicsCount === count;

          return (
            <div
              key={count}
              className={`rounded-md p-3 flex flex-col justify-between transition-colors border ${
                isCurrent
                  ? 'border-[#5B8CFF] bg-[#152342]/40 shadow-xs'
                  : 'border-[#263247] bg-[#151D2E] hover:border-[#334155]'
              }`}
            >
              <div>
                <div className="flex items-center justify-between text-xs mb-2">
                  <span className="font-medium text-[#F1F5F9]">
                    {count} {count === 1 ? 'harmonic' : 'harmonics'}
                  </span>
                  <span className="text-[11px] font-mono text-[#94A3B8]">
                    n ≤ {maxOrder}
                  </span>
                </div>

                {renderComparisonPlot(samples)}

                <div className="mt-2.5 text-xs space-y-1 pt-1.5 border-t border-[#1E293B]">
                  <div className="flex justify-between text-[#94A3B8]">
                    <span className="text-[11px]">NRMSE error:</span>
                    <strong className="font-mono text-xs font-medium text-[#5B8CFF]">
                      {(metrics.nrmse * 100).toFixed(1)}%
                    </strong>
                  </div>
                  <div className="flex justify-between text-[#94A3B8]">
                    <span className="text-[11px]">Max deviation:</span>
                    <span className="font-mono text-xs text-[#F1F5F9]">{metrics.maxError.toFixed(3)} V</span>
                  </div>
                  {metrics.peakOvershootPct > 0 && (
                    <div className="flex justify-between text-[#F59E7B]">
                      <span className="text-[11px]">Gibbs overshoot:</span>
                      <span className="font-mono text-xs font-medium">+{metrics.peakOvershootPct.toFixed(1)}%</span>
                    </div>
                  )}
                </div>
              </div>

              <button
                type="button"
                onClick={() => onSelectHarmonicCount(count)}
                className={`mt-3 w-full py-1.5 text-xs rounded border cursor-pointer transition-colors ${
                  isCurrent
                    ? 'bg-[#5B8CFF] text-white border-[#5B8CFF] font-medium'
                    : 'bg-[#111827] hover:bg-[#1E2B40] text-[#94A3B8] hover:text-[#F1F5F9] border-[#263247]'
                }`}
              >
                {isCurrent ? 'Current selection' : `Apply N = ${count}`}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};
