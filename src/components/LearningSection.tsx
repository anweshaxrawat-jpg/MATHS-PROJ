import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

export const LearningSection: React.FC = () => {
  const [openVivaIndex, setOpenVivaIndex] = useState<number | null>(0);

  const vivaQuestions = [
    {
      q: 'Why are there no even harmonics (n = 2, 4, 6...) in the Fourier series of a square wave?',
      a: 'A symmetric square wave possesses half-wave symmetry: f(t + T/2) = -f(t). When integrating to find the Fourier coefficients over a full period, all even harmonics cancel out completely due to this rotational anti-symmetry. Only odd harmonics (n = 1, 3, 5...) have non-zero integrals.',
    },
    {
      q: 'What value does the Fourier Series converge to at a point of jump discontinuity?',
      a: 'According to Dirichlet\'s Theorem, at any jump discontinuity t = t₀, the Fourier Series converges to the exact arithmetic mean (midpoint) of the left-hand and right-hand limits: S(t₀) = ½ [f(t₀⁻) + f(t₀⁺)]. For a square wave jumping between -A and +A, this midpoint is exactly 0.',
    },
    {
      q: 'What is the Gibbs phenomenon, and does increasing the number of harmonics eliminate it?',
      a: 'The Gibbs phenomenon is the persistent overshoot (approximately 8.949% of the step height) that occurs when approximating a discontinuous signal with a truncated Fourier series. Crucially, increasing N does NOT eliminate the peak overshoot amplitude; it only narrows the width of the overshoot ripple, pushing it closer to the jump point.',
    },
    {
      q: 'Why does a triangle wave converge much faster than a square wave?',
      a: 'A triangle wave is continuous everywhere (its discontinuity only appears in its first derivative), so its Fourier coefficients decay rapidly as 1/n². In contrast, a square wave has step discontinuities in the function itself, causing its coefficients to decay much slower as 1/n. Consequently, a triangle wave requires far fewer harmonics for high-fidelity reconstruction.',
    },
    {
      q: 'What are the Dirichlet Conditions for a Fourier Series to exist?',
      a: 'Over any single period T: (1) f(t) must be absolutely integrable: ∫|f(t)|dt < ∞, (2) f(t) must have a finite number of local extrema, and (3) f(t) must have a finite number of finite (bounded) discontinuities.',
    },
  ];

  return (
    <div className="bg-white rounded-lg border border-stone-200/90 shadow-[0_1px_3px_rgba(0,0,0,0.03)] p-5 space-y-5">
      {/* Header */}
      <div className="border-b border-stone-100 pb-3">
        <h3 className="text-sm font-semibold text-slate-900 tracking-tight">
          Understanding Fourier Series: step-by-step principles
        </h3>
        <p className="text-xs text-slate-500 mt-0.5">
          Foundational concepts of periodic signals, orthogonal bases, convergence rates, and the Gibbs phenomenon
        </p>
      </div>

      <div className="space-y-4 text-xs font-sans">
        {/* Step 1 */}
        <div className="border-l-2 border-blue-600 pl-3.5 space-y-1">
          <span className="text-[11px] font-medium text-blue-700">Step 1</span>
          <h4 className="text-sm font-semibold text-slate-900">What is a periodic signal?</h4>
          <p className="text-slate-600 leading-relaxed text-xs">
            A signal <span className="font-mono">f(t)</span> is periodic if it repeats its shape after a fixed duration called its fundamental period <span className="font-mono">T</span>: <span className="font-mono bg-stone-100 px-1.5 py-0.5 rounded text-[11px]">f(t + T) = f(t)</span>. The fundamental frequency is defined as <span className="font-mono">f₀ = 1/T</span> Hertz.
          </p>
        </div>

        {/* Step 2 */}
        <div className="border-l-2 border-blue-600 pl-3.5 space-y-1">
          <span className="text-[11px] font-medium text-blue-700">Step 2</span>
          <h4 className="text-sm font-semibold text-slate-900">What is a harmonic?</h4>
          <p className="text-slate-600 leading-relaxed text-xs">
            A harmonic is a pure sinusoidal wave whose frequency is an integer multiple of the fundamental frequency: <span className="font-mono">fₙ = n · f₀</span>. The fundamental ($n = 1$) defines the repetition rate, while overtones ($n \ge 2$) contribute edges, corners, and wave contours.
          </p>
        </div>

        {/* Step 3 */}
        <div className="border-l-2 border-blue-600 pl-3.5 space-y-1">
          <span className="text-[11px] font-medium text-blue-700">Step 3</span>
          <h4 className="text-sm font-semibold text-slate-900">What does Fourier Series do?</h4>
          <p className="text-slate-600 leading-relaxed text-xs">
            Fourier proved that suitable periodic functions can be expressed as a linear superposition of orthogonal sines and cosines:
          </p>
          <div className="bg-stone-50 border border-stone-200/80 p-2.5 rounded font-serif text-slate-900 text-center my-1.5">
            f(t) = a₀ + ∑ₙ₌₁^∞ [ aₙ cos(2π n f₀ t) + bₙ sin(2π n f₀ t) ]
          </div>
          <p className="text-slate-600 leading-relaxed text-xs">
            Where <span className="font-mono">a₀</span> is the average value (DC offset), <span className="font-mono">aₙ</span> represents symmetric cosine terms, and <span className="font-mono">bₙ</span> represents anti-symmetric sine terms.
          </p>
        </div>

        {/* Step 4 */}
        <div className="border-l-2 border-blue-600 pl-3.5 space-y-1">
          <span className="text-[11px] font-medium text-blue-700">Step 4</span>
          <h4 className="text-sm font-semibold text-slate-900">How does finite reconstruction work?</h4>
          <p className="text-slate-600 leading-relaxed text-xs">
            In physical systems, the infinite series is truncated to <span className="font-mono">N</span> terms. By Parseval's theorem, this truncated approximation minimizes the mean squared error (MSE) relative to the ideal target signal.
          </p>
        </div>

        {/* Step 5 */}
        <div className="border-l-2 border-[#c2410c] pl-3.5 space-y-1">
          <span className="text-[11px] font-medium text-[#c2410c]">Step 5</span>
          <h4 className="text-sm font-semibold text-slate-900">What is the Gibbs phenomenon?</h4>
          <p className="text-slate-600 leading-relaxed text-xs">
            Near jump discontinuities, a finite Fourier sum exhibits ringing overshoot of approximately <strong>8.949%</strong> of the jump height. Adding more harmonics does not eliminate this peak amplitude; it only narrows the width of the ringing ripple, concentrating it directly adjacent to the discontinuity.
          </p>
        </div>

        {/* Viva Q&A Accordion */}
        <div className="pt-3 border-t border-stone-100 space-y-2.5">
          <div>
            <h4 className="text-xs font-semibold text-slate-900">
              Viva examination preparation questions
            </h4>
            <p className="text-xs text-slate-500 mt-0.5">
              Click any question to view the model technical answer for oral demonstrations
            </p>
          </div>

          <div className="space-y-1.5 pt-1">
            {vivaQuestions.map((item, idx) => {
              const isOpen = openVivaIndex === idx;
              return (
                <div key={idx} className="border border-stone-200/80 rounded-md overflow-hidden">
                  <button
                    type="button"
                    onClick={() => setOpenVivaIndex(isOpen ? null : idx)}
                    className="w-full text-left p-3 flex items-center justify-between gap-3 bg-stone-50/50 hover:bg-stone-50 transition-colors text-xs text-slate-900 cursor-pointer font-medium"
                  >
                    <span>Question {idx + 1}: {item.q}</span>
                    {isOpen ? <ChevronUp className="w-3.5 h-3.5 text-slate-400 shrink-0" /> : <ChevronDown className="w-3.5 h-3.5 text-slate-400 shrink-0" />}
                  </button>
                  {isOpen && (
                    <div className="p-3 bg-white border-t border-stone-100 text-xs text-slate-700 leading-relaxed space-y-1">
                      <span className="text-blue-700 font-medium text-[11px] block">Model answer:</span>
                      <p>{item.a}</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
