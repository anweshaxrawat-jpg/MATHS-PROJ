import React from 'react';
import { Target, Lightbulb, Waves, ShieldCheck } from 'lucide-react';

export const AboutSection: React.FC = () => {
  return (
    <div className="space-y-6 text-[#F1F5F9]">
      {/* Page Header */}
      <div className="bg-[#111827] rounded-lg border border-[#263247] p-6">
        <h2 className="text-lg font-semibold text-[#F1F5F9] tracking-tight">
          About Fourier Lab
        </h2>
        <p className="text-xs text-[#94A3B8] mt-1 leading-relaxed max-w-3xl">
          An interactive scientific visualization platform for engineering students and educators to explore harmonic synthesis, signal reconstruction, and Dirichlet convergence.
        </p>
      </div>

      {/* Project Overview */}
      <div className="bg-[#111827] rounded-lg border border-[#263247] p-6 space-y-3">
        <div className="flex items-center gap-2 text-xs font-semibold text-[#5B8CFF]">
          <Lightbulb className="w-4 h-4" />
          <span>Project Overview</span>
        </div>
        <p className="text-xs text-[#94A3B8] leading-relaxed">
          <strong>Fourier Lab</strong> is an interactive educational tool for exploring how complex periodic signals can be approximated using Fourier series. By breaking signals down into pure sinusoidal harmonics and synthesizing them term by term, the application bridges theoretical undergraduate calculus with tangible digital signal processing (DSP) intuition.
        </p>
      </div>

      {/* Project Objectives */}
      <div className="bg-[#111827] rounded-lg border border-[#263247] p-6 space-y-4">
        <div className="flex items-center gap-2 text-xs font-semibold text-[#5B8CFF]">
          <Target className="w-4 h-4" />
          <span>Project Objectives</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
          <div className="p-3.5 bg-[#151D2E] rounded border border-[#263247] space-y-1">
            <span className="font-medium text-[#F1F5F9] block">1. Visualize target vs. approximation</span>
            <p className="text-[11px] text-[#94A3B8] leading-relaxed">
              Directly compare ideal mathematical waveforms against their truncated Fourier Series reconstructions on a synchronized high-precision scientific graticule.
            </p>
          </div>

          <div className="p-3.5 bg-[#151D2E] rounded border border-[#263247] space-y-1">
            <span className="font-medium text-[#F1F5F9] block">2. Demonstrate harmonic count effect</span>
            <p className="text-[11px] text-[#94A3B8] leading-relaxed">
              Show how increasing harmonic terms reduces normalized root mean square error (NRMSE) while observing how Gibbs oscillations persist at step boundaries.
            </p>
          </div>

          <div className="p-3.5 bg-[#151D2E] rounded border border-[#263247] space-y-1">
            <span className="font-medium text-[#F1F5F9] block">3. Understand periodic signal behavior</span>
            <p className="text-[11px] text-[#94A3B8] leading-relaxed">
              Demystify half-wave anti-symmetry, Dirichlet midpoint convergence, and why continuous functions (like triangle waves) converge faster than discontinuous step waves.
            </p>
          </div>

          <div className="p-3.5 bg-[#151D2E] rounded border border-[#263247] space-y-1">
            <span className="font-medium text-[#F1F5F9] block">4. Connect theory with practical DSP</span>
            <p className="text-[11px] text-[#94A3B8] leading-relaxed">
              Link abstract infinite series equations directly to discrete spectrum stem plots, audio overtone listening, and communication bandwidth considerations.
            </p>
          </div>
        </div>
      </div>

      {/* Applications */}
      <div className="bg-[#111827] rounded-lg border border-[#263247] p-6 space-y-4">
        <div className="flex items-center gap-2 text-xs font-semibold text-[#5B8CFF]">
          <Waves className="w-4 h-4" />
          <span>Engineering Applications</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
          <div className="p-3.5 bg-[#151D2E] rounded border border-[#263247] space-y-1">
            <span className="font-semibold text-[#F1F5F9] block text-xs">Audio Synthesis</span>
            <p className="text-[11px] text-[#94A3B8] leading-normal">
              Additive sound synthesis, acoustic timbre analysis, and equalization in musical instruments.
            </p>
          </div>

          <div className="p-3.5 bg-[#151D2E] rounded border border-[#263247] space-y-1">
            <span className="font-semibold text-[#F1F5F9] block text-xs">Signal Filtering</span>
            <p className="text-[11px] text-[#94A3B8] leading-normal">
              Low-pass and band-pass filtering, anti-aliasing cutoff specification, and reconstruction.
            </p>
          </div>

          <div className="p-3.5 bg-[#151D2E] rounded border border-[#263247] space-y-1">
            <span className="font-semibold text-[#F1F5F9] block text-xs">Communications</span>
            <p className="text-[11px] text-[#94A3B8] leading-normal">
              Channel bandwidth budgeting for digital clock signals, OFDM, and transmission spectra.
            </p>
          </div>

          <div className="p-3.5 bg-[#151D2E] rounded border border-[#263247] space-y-1">
            <span className="font-semibold text-[#F1F5F9] block text-xs">Power Engineering</span>
            <p className="text-[11px] text-[#94A3B8] leading-normal">
              Total Harmonic Distortion (THD) monitoring, non-linear load analysis, and power quality.
            </p>
          </div>
        </div>
      </div>

      {/* Project Scope & Verification */}
      <div className="bg-[#111827] rounded-lg border border-[#263247] p-6 space-y-3">
        <div className="flex items-center gap-2 text-xs font-semibold text-[#5B8CFF]">
          <ShieldCheck className="w-4 h-4" />
          <span>Project Scope &amp; Architecture</span>
        </div>
        <p className="text-xs text-[#94A3B8] leading-relaxed">
          Fourier Lab evaluates mathematical equations in real time using local TypeScript mathematical routines. The application computes continuous sample vectors over two full periods ($0$ to $2T$) with a density of 800 sample points, ensuring accurate capture of high-frequency ripples and Gibbs overshoot without discretization artifacts. Audio playback uses the Web Audio API's <span className="font-mono text-[#5B8CFF]">PeriodicWave</span> interface with exact Fourier series coefficients.
        </p>
      </div>
    </div>
  );
};
