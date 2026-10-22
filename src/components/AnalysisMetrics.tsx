import React from 'react';
import { SimulationSettings, MetricsData } from '../types/fourier';

interface AnalysisMetricsProps {
  settings: SimulationSettings;
  metrics: MetricsData;
}

export const AnalysisMetrics: React.FC<AnalysisMetricsProps> = ({
  settings,
  metrics,
}) => {
  const { waveform, harmonicsCount, fundamentalFreq } = settings;
  const { nrmse, maxError, maxOrder, maxFrequency, period, peakOvershootPct } = metrics;

  let decayClass = '1/n (algebraic)';
  if (waveform === 'triangle') decayClass = '1/n² (quadratic)';
  if (waveform === 'custom') decayClass = 'Exact polynomial';

  return (
    <div className="bg-[#111827] rounded-lg border border-[#263247] p-5 space-y-4 text-[#F1F5F9]">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1 border-b border-[#1E293B] pb-3">
        <h3 className="text-sm font-semibold text-[#F1F5F9] tracking-tight">
          Reconstruction metrics &amp; convergence
        </h3>
        <span className="text-xs text-[#94A3B8]">
          Evaluated numerically over 2 periods (M = {settings.samplePoints || 800} points)
        </span>
      </div>

      {/* Metrics Data Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-4 pt-1">
        {/* Metric 1 */}
        <div className="space-y-1">
          <span className="text-xs text-[#94A3B8] block">NRMSE error</span>
          <div className="text-base font-semibold font-mono text-[#5B8CFF]">
            {(nrmse * 100).toFixed(2)}%
          </div>
          <span className="text-[11px] font-mono text-[#64748B] block">
            {nrmse.toFixed(4)}
          </span>
        </div>

        {/* Metric 2 */}
        <div className="space-y-1">
          <span className="text-xs text-[#94A3B8] block">Harmonic terms</span>
          <div className="text-base font-semibold font-mono text-[#F1F5F9]">
            N = {harmonicsCount}
          </div>
          <span className="text-[11px] text-[#64748B] block">
            coefficients
          </span>
        </div>

        {/* Metric 3 */}
        <div className="space-y-1">
          <span className="text-xs text-[#94A3B8] block">Highest order</span>
          <div className="text-base font-semibold font-mono text-[#F1F5F9]">
            n = {maxOrder}
          </div>
          <span className="text-[11px] text-[#64748B] block">
            {waveform === 'sawtooth' ? 'all integers' : 'odd harmonics'}
          </span>
        </div>

        {/* Metric 4 */}
        <div className="space-y-1">
          <span className="text-xs text-[#94A3B8] block">Fundamental</span>
          <div className="text-base font-semibold font-mono text-[#F1F5F9]">
            {fundamentalFreq.toFixed(1)} Hz
          </div>
          <span className="text-[11px] font-mono text-[#64748B] block">
            T = {period.toFixed(3)}s
          </span>
        </div>

        {/* Metric 5 */}
        <div className="space-y-1">
          <span className="text-xs text-[#94A3B8] block">Bandwidth</span>
          <div className="text-base font-semibold font-mono text-[#F1F5F9]">
            {maxFrequency.toFixed(1)} Hz
          </div>
          <span className="text-[11px] font-mono text-[#64748B] block">
            f_max = n·f₀
          </span>
        </div>

        {/* Metric 6 */}
        <div className="space-y-1">
          <span className="text-xs text-[#94A3B8] block">Max deviation</span>
          <div className="text-base font-semibold font-mono text-[#F1F5F9]">
            {maxError.toFixed(3)} V
          </div>
          <span className="text-[11px] text-[#64748B] block">
            peak error
          </span>
        </div>

        {/* Metric 7 */}
        <div className="space-y-1">
          <span className="text-xs text-[#94A3B8] block">Gibbs overshoot</span>
          <div className={`text-base font-semibold font-mono ${peakOvershootPct > 0 ? 'text-[#F59E7B]' : 'text-[#F1F5F9]'}`}>
            {peakOvershootPct > 0 ? `+${peakOvershootPct.toFixed(1)}%` : '0.0%'}
          </div>
          <span className="text-[11px] text-[#64748B] block">
            {waveform === 'triangle' ? 'continuous' : '~8.95% limit'}
          </span>
        </div>

        {/* Metric 8 */}
        <div className="space-y-1">
          <span className="text-xs text-[#94A3B8] block">Decay rate</span>
          <div className="text-sm font-medium text-[#F1F5F9]">
            {decayClass}
          </div>
          <span className="text-[11px] text-[#64748B] block">
            spectral roll-off
          </span>
        </div>
      </div>
    </div>
  );
};
