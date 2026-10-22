import React from 'react';
import { Sigma, ArrowRight, Layers, Cpu, AlertCircle, CheckCircle2 } from 'lucide-react';

export const MethodologySection: React.FC = () => {
  const workflowSteps = [
    {
      num: 1,
      title: 'Select target waveform',
      desc: 'User chooses between Square, Sawtooth, Triangle, or Custom trigonometric profile.',
    },
    {
      num: 2,
      title: 'Configure frequency & amplitude',
      desc: 'Set fundamental frequency f₀ (Hz), which establishes period T = 1/f₀, and peak amplitude A (V).',
    },
    {
      num: 3,
      title: 'Select harmonic terms (N)',
      desc: 'Specify the finite summation limit N, setting the truncation bandwidth of the Fourier series.',
    },
    {
      num: 4,
      title: 'Calculate Fourier components',
      desc: 'Evaluate waveform-specific orthogonal coefficients (aₙ, bₙ) for each harmonic frequency n·f₀.',
    },
    {
      num: 5,
      title: 'Sum components to obtain S_N(t)',
      desc: 'Superimpose the harmonic basis sinusoids point-by-point across the time vector.',
    },
    {
      num: 6,
      title: 'Plot & calculate error metrics',
      desc: 'Render dual curves on Canvas and compute normalized root mean square error (NRMSE).',
    },
  ];

  return (
    <div className="space-y-6 text-[#F1F5F9]">
      {/* Page Header */}
      <div className="bg-[#111827] rounded-lg border border-[#263247] p-6">
        <h2 className="text-lg font-semibold text-[#F1F5F9] tracking-tight">
          Methodology &amp; Mathematical Formulation
        </h2>
        <p className="text-xs text-[#94A3B8] mt-1 leading-relaxed max-w-3xl">
          A comprehensive technical explanation of the analytical Fourier Series framework, waveform-specific coefficient derivations, computational synthesis algorithms, and discrete sampling methods implemented in Fourier Lab.
        </p>
      </div>

      {/* Section A: Mathematical Foundation */}
      <div className="bg-[#111827] rounded-lg border border-[#263247] p-6 space-y-4">
        <div className="border-b border-[#1E293B] pb-3">
          <span className="text-xs font-mono text-[#5B8CFF] font-medium block">Section A</span>
          <h3 className="text-sm font-semibold text-[#F1F5F9] tracking-tight mt-0.5">
            Mathematical Foundation of Fourier Series
          </h3>
        </div>

        <p className="text-xs text-[#94A3B8] leading-relaxed">
          Any periodic signal <span className="font-mono text-[#F1F5F9]">f(t)</span> satisfying the Dirichlet conditions (absolutely integrable over period <span className="font-mono text-[#F1F5F9]">T</span>, finite local extrema, and finite bounded discontinuities) can be expressed as a linear combination of harmonically related sines and cosines.
        </p>

        {/* General Equation Display */}
        <div className="bg-[#151D2E] border border-[#263247] p-5 rounded-md text-center my-3">
          <div className="text-base sm:text-lg font-serif text-[#F1F5F9] inline-flex flex-wrap items-center justify-center gap-2">
            <span className="italic font-medium">f(t)</span>
            <span>=</span>
            <div className="inline-flex flex-col items-center mx-1 text-sm">
              <span className="border-b border-[#94A3B8] px-1 font-mono text-[#5B8CFF]">a₀</span>
              <span className="px-1 text-xs font-mono">2</span>
            </div>
            <span>+</span>
            <div className="inline-flex flex-col items-center mx-1">
              <span className="text-[10px] text-[#94A3B8] font-sans">∞</span>
              <span className="text-2xl leading-none text-[#F1F5F9] font-serif">∑</span>
              <span className="text-[10px] text-[#94A3B8] font-sans">n = 1</span>
            </div>
            <span className="text-sm sm:text-base">
              [ <span className="text-[#5B8CFF]">aₙ</span> cos(n ω₀ t) + <span className="text-[#5B8CFF]">bₙ</span> sin(n ω₀ t) ]
            </span>
          </div>
          <p className="text-[11px] text-[#94A3B8] font-mono mt-3">
            where angular fundamental frequency ω₀ = 2π / T = 2π f₀
          </p>
        </div>

        {/* Variables Explanation */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs pt-1">
          <div className="p-3 bg-[#151D2E] rounded border border-[#263247]">
            <span className="font-mono text-[#5B8CFF] font-semibold block text-xs">ω₀ = 2π f₀</span>
            <span className="font-medium text-[#F1F5F9] block mt-1">Fundamental Angular Frequency</span>
            <p className="text-[11px] text-[#94A3B8] mt-1 leading-normal">
              Defines the repetition rate in radians per second, reciprocal to period T.
            </p>
          </div>

          <div className="p-3 bg-[#151D2E] rounded border border-[#263247]">
            <span className="font-mono text-[#5B8CFF] font-semibold block text-xs">n ∈ &#123;1, 2, 3…&#125;</span>
            <span className="font-medium text-[#F1F5F9] block mt-1">Harmonic Index (Order)</span>
            <p className="text-[11px] text-[#94A3B8] mt-1 leading-normal">
              Integer multiplier defining the overtone frequency (fₙ = n · f₀).
            </p>
          </div>

          <div className="p-3 bg-[#151D2E] rounded border border-[#263247]">
            <span className="font-mono text-[#5B8CFF] font-semibold block text-xs">aₙ = (2/T) ∫ f(t) cos(nω₀t) dt</span>
            <span className="font-medium text-[#F1F5F9] block mt-1">Cosine Coefficients (Even)</span>
            <p className="text-[11px] text-[#94A3B8] mt-1 leading-normal">
              Measure the symmetric component of the waveform relative to time origin.
            </p>
          </div>

          <div className="p-3 bg-[#151D2E] rounded border border-[#263247]">
            <span className="font-mono text-[#5B8CFF] font-semibold block text-xs">bₙ = (2/T) ∫ f(t) sin(nω₀t) dt</span>
            <span className="font-medium text-[#F1F5F9] block mt-1">Sine Coefficients (Odd)</span>
            <p className="text-[11px] text-[#94A3B8] mt-1 leading-normal">
              Measure the anti-symmetric component of the signal.
            </p>
          </div>
        </div>
      </div>

      {/* Section B: Waveform-specific Series */}
      <div className="bg-[#111827] rounded-lg border border-[#263247] p-6 space-y-4">
        <div className="border-b border-[#1E293B] pb-3">
          <span className="text-xs font-mono text-[#5B8CFF] font-medium block">Section B</span>
          <h3 className="text-sm font-semibold text-[#F1F5F9] tracking-tight mt-0.5">
            Waveform-Specific Fourier Series Formulations
          </h3>
        </div>

        <p className="text-xs text-[#94A3B8] leading-relaxed">
          Different geometric periodic profiles exhibit distinct Fourier coefficient distributions based on their symmetry and smoothness. Fourier Lab evaluates each supported profile using its mathematically exact closed-form finite series:
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
          {/* Square Wave */}
          <div className="p-4 bg-[#151D2E] rounded-md border border-[#263247] space-y-2.5">
            <div className="flex justify-between items-baseline">
              <h4 className="text-xs font-semibold text-[#F1F5F9]">Square Wave Series</h4>
              <span className="text-[11px] font-mono text-[#5B8CFF]">Odd harmonics · 1/n decay</span>
            </div>
            <div className="bg-[#111827] p-3 rounded border border-[#263247] font-serif text-xs text-[#F1F5F9] text-center">
              S_N(x) = (4A / π) · ∑ₖ₌₀^(N-1) [ sin((2k + 1)x) / (2k + 1) ]
            </div>
            <p className="text-[11px] text-[#94A3B8] leading-relaxed">
              Because a symmetric square wave has half-wave symmetry <span className="font-mono text-[#F1F5F9]">f(t + T/2) = -f(t)</span>, all even harmonics cancel to zero. Coefficients decay proportionally to <span className="font-mono text-[#5B8CFF]">1/n</span>. Discontinuities at 0 and π produce the Gibbs phenomenon.
            </p>
          </div>

          {/* Sawtooth Wave */}
          <div className="p-4 bg-[#151D2E] rounded-md border border-[#263247] space-y-2.5">
            <div className="flex justify-between items-baseline">
              <h4 className="text-xs font-semibold text-[#F1F5F9]">Sawtooth Wave Series</h4>
              <span className="text-[11px] font-mono text-[#5B8CFF]">All harmonics · 1/n decay</span>
            </div>
            <div className="bg-[#111827] p-3 rounded border border-[#263247] font-serif text-xs text-[#F1F5F9] text-center">
              S_N(x) = (2A / π) · ∑ₙ₌₁^N [ (-1)ⁿ⁺¹ sin(nx) / n ]
            </div>
            <p className="text-[11px] text-[#94A3B8] leading-relaxed">
              The periodic linear ramp possesses odd symmetry <span className="font-mono text-[#F1F5F9]">f(-x) = -f(x)</span> without half-wave cancellation, so all integer harmonics (odd and even) are present with alternating signs and <span className="font-mono text-[#5B8CFF]">1/n</span> decay.
            </p>
          </div>

          {/* Triangle Wave */}
          <div className="p-4 bg-[#151D2E] rounded-md border border-[#263247] space-y-2.5">
            <div className="flex justify-between items-baseline">
              <h4 className="text-xs font-semibold text-[#F1F5F9]">Triangle Wave Series</h4>
              <span className="text-[11px] font-mono text-[#5B8CFF]">Odd harmonics · 1/n² quadratic</span>
            </div>
            <div className="bg-[#111827] p-3 rounded border border-[#263247] font-serif text-xs text-[#F1F5F9] text-center">
              S_N(x) = (8A / π²) · ∑ₖ₌₀^(N-1) [ (-1)ᵏ sin((2k + 1)x) / (2k + 1)² ]
            </div>
            <p className="text-[11px] text-[#94A3B8] leading-relaxed">
              Because the triangle wave is continuous everywhere (its derivative is discontinuous, but the function itself has no jumps), its coefficients drop rapidly as <span className="font-mono text-[#5B8CFF]">1/n²</span> with alternating signs. Rapid convergence eliminates Gibbs ringing.
            </p>
          </div>

          {/* Custom Harmonic Wave */}
          <div className="p-4 bg-[#151D2E] rounded-md border border-[#263247] space-y-2.5">
            <div className="flex justify-between items-baseline">
              <h4 className="text-xs font-semibold text-[#F1F5F9]">Custom Harmonic Combination</h4>
              <span className="text-[11px] font-mono text-[#5B8CFF]">Exact finite basis polynomial</span>
            </div>
            <div className="bg-[#111827] p-3 rounded border border-[#263247] font-serif text-xs text-[#F1F5F9] text-center">
              S(x) = A · [ a₁ cos(x) + b₁ sin(x) + b₂ sin(2x) + b₃ sin(3x) ]
            </div>
            <p className="text-[11px] text-[#94A3B8] leading-relaxed">
              Allows direct interactive synthesis of custom signals by specifying weights for fundamental cosine and harmonics 1, 2, and 3, demonstrating direct orthogonal basis superposition with zero truncation error.
            </p>
          </div>
        </div>
      </div>

      {/* Section C: Computational Workflow */}
      <div className="bg-[#111827] rounded-lg border border-[#263247] p-6 space-y-4">
        <div className="border-b border-[#1E293B] pb-3">
          <span className="text-xs font-mono text-[#5B8CFF] font-medium block">Section C</span>
          <h3 className="text-sm font-semibold text-[#F1F5F9] tracking-tight mt-0.5">
            Computational Synthesis Pipeline
          </h3>
        </div>

        <p className="text-xs text-[#94A3B8] leading-relaxed">
          Fourier Lab calculates and updates every waveform deterministically in the client runtime without static mockups or server roundtrips:
        </p>

        {/* 6-step visual sequence */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 pt-1">
          {workflowSteps.map((step) => (
            <div key={step.num} className="p-3.5 bg-[#151D2E] rounded-md border border-[#263247] flex flex-col justify-between space-y-2">
              <div className="flex items-center gap-2">
                <span className="w-5 h-5 rounded bg-[#111827] border border-[#263247] text-[#5B8CFF] font-mono text-xs flex items-center justify-center font-semibold">
                  {step.num}
                </span>
                <span className="text-xs font-medium text-[#F1F5F9]">
                  {step.title}
                </span>
              </div>
              <p className="text-[11px] text-[#94A3B8] leading-relaxed pl-7">
                {step.desc}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Section D: Approximation and Gibbs Phenomenon */}
      <div className="bg-[#111827] rounded-lg border border-[#263247] p-6 space-y-4">
        <div className="border-b border-[#1E293B] pb-3">
          <span className="text-xs font-mono text-[#5B8CFF] font-medium block">Section D</span>
          <h3 className="text-sm font-semibold text-[#F1F5F9] tracking-tight mt-0.5">
            Approximation Accuracy &amp; the Gibbs Phenomenon
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2.5 text-xs text-[#94A3B8] leading-relaxed">
            <h4 className="text-xs font-semibold text-[#F1F5F9]">
              Least-Squares Energy Convergence (Parseval's Theorem)
            </h4>
            <p>
              As the harmonic count <span className="font-mono text-[#F1F5F9]">N</span> increases, the total residual energy integrated across the period decreases monotonically:
            </p>
            <div className="bg-[#151D2E] border border-[#263247] p-2.5 rounded font-mono text-[11px] text-[#F1F5F9]">
              lim (N → ∞) ∫₀ᵀ |f(t) - S_N(t)|² dt = 0
            </div>
            <p>
              Consequently, the Normalized Root Mean Square Error (NRMSE) drops steadily from ~22.8% at N = 1 to under 6% at N = 20 for a square wave, and to under 0.1% for a triangle wave.
            </p>
          </div>

          <div className="space-y-2.5 text-xs text-[#94A3B8] leading-relaxed border-t md:border-t-0 md:border-l border-[#1E293B] md:pl-4 pt-3 md:pt-0">
            <h4 className="text-xs font-semibold text-[#F59E7B] flex items-center gap-1.5">
              <AlertCircle className="w-3.5 h-3.5" />
              The Fundamental Gibbs Overshoot Limit (~8.949%)
            </h4>
            <p>
              At step jump discontinuities, pointwise convergence fails to be uniform. The truncated Fourier series overshoots the target plateau by an amount given by the Wilbraham-Gibbs integral:
            </p>
            <div className="bg-[#151D2E] border border-[#263247] p-2.5 rounded font-mono text-[11px] text-[#F59E7B]">
              Peak Overshoot = (1/π) ∫₀^π (sin u / u) du - ½ ≈ 8.949%
            </div>
            <p>
              Crucially, <strong>increasing N does NOT eliminate the peak overshoot</strong>; it only compresses the ringing oscillations closer to the jump boundary.
            </p>
          </div>
        </div>
      </div>

      {/* Section E: Implementation Details */}
      <div className="bg-[#111827] rounded-lg border border-[#263247] p-6 space-y-4">
        <div className="border-b border-[#1E293B] pb-3">
          <span className="text-xs font-mono text-[#5B8CFF] font-medium block">Section E</span>
          <h3 className="text-sm font-semibold text-[#F1F5F9] tracking-tight mt-0.5">
            Implementation Details &amp; Technical Architecture
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <div className="p-3 bg-[#151D2E] rounded border border-[#263247] space-y-1">
            <span className="font-semibold text-[#F1F5F9] block">Framework &amp; Language</span>
            <p className="text-[11px] text-[#94A3B8] leading-normal">
              React 19, TypeScript, Vite, Tailwind CSS. Purely client-side deterministic evaluation with zero remote API dependencies.
            </p>
          </div>

          <div className="p-3 bg-[#151D2E] rounded border border-[#263247] space-y-1">
            <span className="font-semibold text-[#F1F5F9] block">High-DPI Canvas Rendering</span>
            <p className="text-[11px] text-[#94A3B8] leading-normal">
              Direct HTML5 Canvas graticule plotting with devicePixelRatio scaling for crisp non-aliased curves at 60fps across all zoom levels.
            </p>
          </div>

          <div className="p-3 bg-[#151D2E] rounded border border-[#263247] space-y-1">
            <span className="font-semibold text-[#F1F5F9] block">Web Audio API Synthesis</span>
            <p className="text-[11px] text-[#94A3B8] leading-normal">
              AudioContext <span className="font-mono text-[#5B8CFF]">createPeriodicWave</span> dynamically loaded with exact Fourier coefficients for real-time psychoacoustic monitoring.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
