import React from 'react';
import { ArrowRight } from 'lucide-react';
import { SimulationSettings } from '../types/fourier';

interface ExperimentsSectionProps {
  onApplySettings: (settings: Partial<SimulationSettings>) => void;
  currentSettings: SimulationSettings;
}

export const ExperimentsSection: React.FC<ExperimentsSectionProps> = ({
  onApplySettings,
}) => {
  return (
    <div className="bg-[#111827] rounded-lg border border-[#263247] p-5 space-y-4 text-[#F1F5F9]">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1 border-b border-[#1E293B] pb-3">
        <div>
          <h3 className="text-sm font-semibold text-[#F1F5F9] tracking-tight">
            Guided demonstration experiments
          </h3>
          <p className="text-xs text-[#94A3B8] mt-0.5">
            Structured presets designed for classroom presentations and laboratory oral examinations
          </p>
        </div>
        <span className="text-xs text-[#94A3B8]">
          Click any experiment to load parameters
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-1">
        {/* Experiment 1 */}
        <div className="border border-[#263247] bg-[#151D2E] rounded-md p-4 flex flex-col justify-between space-y-3.5">
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <span className="font-medium text-[#5B8CFF]">Experiment 1</span>
              <span className="text-[#94A3B8] font-mono text-[11px]">f₀ = 1.0 Hz</span>
            </div>
            <h4 className="text-sm font-medium text-[#F1F5F9]">
              Square wave reconstruction
            </h4>
            <p className="text-xs text-[#94A3B8] leading-relaxed">
              Start with a pure fundamental sinusoid (N = 1). Increment N through 5, 10, and 20 to observe how odd harmonic superposition flattens the crest and steepens the transition rise time.
            </p>
          </div>

          <button
            type="button"
            onClick={() =>
              onApplySettings({
                waveform: 'square',
                harmonicsCount: 1,
                fundamentalFreq: 1.0,
                amplitude: 1.0,
                showOriginal: true,
                showApproximation: true,
                showHarmonics: false,
                showGibbsHighlight: false,
              })
            }
            className="w-full py-1.5 px-3 text-xs rounded-md border border-[#263247] bg-[#111827] hover:bg-[#1E2B40] text-[#F1F5F9] transition-colors flex items-center justify-center gap-1.5 cursor-pointer font-medium"
          >
            <span>Load experiment 1</span>
            <ArrowRight className="w-3.5 h-3.5 text-[#5B8CFF]" />
          </button>
        </div>

        {/* Experiment 2 */}
        <div className="border border-[#263247] bg-[#151D2E] rounded-md p-4 flex flex-col justify-between space-y-3.5">
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <span className="font-medium text-[#5B8CFF]">Experiment 2</span>
              <span className="text-[#94A3B8] font-mono text-[11px]">N = 5 terms</span>
            </div>
            <h4 className="text-sm font-medium text-[#F1F5F9]">
              Convergence rate comparison
            </h4>
            <p className="text-xs text-[#94A3B8] leading-relaxed">
              Compare how function smoothness dictates Fourier decay. The continuous triangle wave coefficients decay as 1/n², yielding near-zero error at N = 5, compared to 1/n decay for square waves.
            </p>
          </div>

          <button
            type="button"
            onClick={() =>
              onApplySettings({
                waveform: 'triangle',
                harmonicsCount: 5,
                fundamentalFreq: 1.0,
                amplitude: 1.0,
                showOriginal: true,
                showApproximation: true,
                showHarmonics: true,
                showGibbsHighlight: false,
              })
            }
            className="w-full py-1.5 px-3 text-xs rounded-md border border-[#263247] bg-[#111827] hover:bg-[#1E2B40] text-[#F1F5F9] transition-colors flex items-center justify-center gap-1.5 cursor-pointer font-medium"
          >
            <span>Load experiment 2</span>
            <ArrowRight className="w-3.5 h-3.5 text-[#5B8CFF]" />
          </button>
        </div>

        {/* Experiment 3 */}
        <div className="border border-[#263247] bg-[#151D2E] rounded-md p-4 flex flex-col justify-between space-y-3.5">
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <span className="font-medium text-[#5B8CFF]">Experiment 3</span>
              <span className="text-[#94A3B8] font-mono text-[11px]">N = 25 terms</span>
            </div>
            <h4 className="text-sm font-medium text-[#F1F5F9]">
              Gibbs phenomenon observation
            </h4>
            <p className="text-xs text-[#94A3B8] leading-relaxed">
              Observe the mathematical limit of Fourier series at jump discontinuities. Notice that increasing N to 25 compresses the overshoot ripple width, but peak overshoot remains fixed at ~8.95%.
            </p>
          </div>

          <button
            type="button"
            onClick={() =>
              onApplySettings({
                waveform: 'square',
                harmonicsCount: 25,
                fundamentalFreq: 1.0,
                amplitude: 1.0,
                showOriginal: true,
                showApproximation: true,
                showHarmonics: false,
                showGibbsHighlight: true,
              })
            }
            className="w-full py-1.5 px-3 text-xs rounded-md border border-[#263247] bg-[#111827] hover:bg-[#1E2B40] text-[#F1F5F9] transition-colors flex items-center justify-center gap-1.5 cursor-pointer font-medium"
          >
            <span>Load experiment 3</span>
            <ArrowRight className="w-3.5 h-3.5 text-[#5B8CFF]" />
          </button>
        </div>
      </div>
    </div>
  );
};
