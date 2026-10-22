import React from 'react';
import { SimulationSettings } from '../types/fourier';

interface FourierFormulaProps {
  settings: SimulationSettings;
}

export const FourierFormula: React.FC<FourierFormulaProps> = ({ settings }) => {
  const { waveform, harmonicsCount, amplitude, customConfig } = settings;
  const maxOddOrder = 2 * harmonicsCount - 1;

  return (
    <div className="bg-[#111827] rounded-lg border border-[#263247] p-5 space-y-4 text-[#F1F5F9]">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1 border-b border-[#1E293B] pb-3">
        <h3 className="text-sm font-semibold text-[#F1F5F9] tracking-tight">
          Mathematical series formulation
        </h3>
        <span className="text-xs text-[#94A3B8] font-serif italic">
          f(t) = a₀/2 + ∑ [aₙ cos(nω₀t) + bₙ sin(nω₀t)]
        </span>
      </div>

      <div className="space-y-4 text-xs">
        {/* Rendered Math Formula Box */}
        <div className="bg-[#151D2E] border border-[#263247] p-4 rounded-md text-center overflow-x-auto">
          {waveform === 'square' && (
            <div className="space-y-3">
              <div className="inline-flex items-center gap-2 text-base font-serif text-[#F1F5F9]">
                <span className="italic font-semibold">S<sub className="text-xs font-sans text-[#94A3B8]">{harmonicsCount}</sub>(x)</span>
                <span>=</span>

                <div className="inline-flex flex-col items-center mx-1 text-sm">
                  <span className="border-b border-[#94A3B8] px-1 font-medium text-[#5B8CFF]">
                    4 · {amplitude.toFixed(2)}
                  </span>
                  <span className="px-1 text-[#F1F5F9] italic">π</span>
                </div>

                <div className="inline-flex flex-col items-center mx-1">
                  <span className="text-[10px] text-[#94A3B8] font-sans">k = {harmonicsCount - 1}</span>
                  <span className="text-2xl leading-none text-[#F1F5F9] font-serif">∑</span>
                  <span className="text-[10px] text-[#94A3B8] font-sans">k = 0</span>
                </div>

                <div className="inline-flex flex-col items-center text-sm">
                  <span className="border-b border-[#94A3B8] px-1 text-[#F1F5F9]">sin((2k + 1)x)</span>
                  <span className="px-1 text-[#94A3B8] text-xs">2k + 1</span>
                </div>
              </div>

              <div className="text-xs text-[#94A3B8] bg-[#111827] p-2.5 rounded border border-[#263247] text-left font-mono">
                <span className="text-[#64748B] font-sans text-xs">Series expansion: </span>
                <span className="font-semibold text-[#5B8CFF]">{((4 * amplitude) / Math.PI).toFixed(3)}</span>
                {' · [ sin(x) + ¹⁄₃ sin(3x) + ¹⁄₅ sin(5x) + … + ¹⁄'}
                {maxOddOrder}
                {' sin('}
                {maxOddOrder}
                {'x) ]'}
              </div>
            </div>
          )}

          {waveform === 'sawtooth' && (
            <div className="space-y-3">
              <div className="inline-flex items-center gap-2 text-base font-serif text-[#F1F5F9]">
                <span className="italic font-semibold">S<sub className="text-xs font-sans text-[#94A3B8]">{harmonicsCount}</sub>(x)</span>
                <span>=</span>

                <div className="inline-flex flex-col items-center mx-1 text-sm">
                  <span className="border-b border-[#94A3B8] px-1 font-medium text-[#5B8CFF]">
                    2 · {amplitude.toFixed(2)}
                  </span>
                  <span className="px-1 text-[#F1F5F9] italic">π</span>
                </div>

                <div className="inline-flex flex-col items-center mx-1">
                  <span className="text-[10px] text-[#94A3B8] font-sans">n = {harmonicsCount}</span>
                  <span className="text-2xl leading-none text-[#F1F5F9] font-serif">∑</span>
                  <span className="text-[10px] text-[#94A3B8] font-sans">n = 1</span>
                </div>

                <div className="inline-flex flex-col items-center text-sm">
                  <span className="border-b border-[#94A3B8] px-1 text-[#F1F5F9]">(-1)<sup>n+1</sup> sin(nx)</span>
                  <span className="px-1 text-[#94A3B8] text-xs">n</span>
                </div>
              </div>

              <div className="text-xs text-[#94A3B8] bg-[#111827] p-2.5 rounded border border-[#263247] text-left font-mono">
                <span className="text-[#64748B] font-sans text-xs">Series expansion: </span>
                <span className="font-semibold text-[#5B8CFF]">{((2 * amplitude) / Math.PI).toFixed(3)}</span>
                {' · [ sin(x) - ¹⁄₂ sin(2x) + ¹⁄₃ sin(3x) - … + (-1)ⁿ⁺¹/n sin(nx) ]'}
              </div>
            </div>
          )}

          {waveform === 'triangle' && (
            <div className="space-y-3">
              <div className="inline-flex items-center gap-2 text-base font-serif text-[#F1F5F9]">
                <span className="italic font-semibold">S<sub className="text-xs font-sans text-[#94A3B8]">{harmonicsCount}</sub>(x)</span>
                <span>=</span>

                <div className="inline-flex flex-col items-center mx-1 text-sm">
                  <span className="border-b border-[#94A3B8] px-1 font-medium text-[#5B8CFF]">
                    8 · {amplitude.toFixed(2)}
                  </span>
                  <span className="px-1 text-[#F1F5F9] italic">π²</span>
                </div>

                <div className="inline-flex flex-col items-center mx-1">
                  <span className="text-[10px] text-[#94A3B8] font-sans">k = {harmonicsCount - 1}</span>
                  <span className="text-2xl leading-none text-[#F1F5F9] font-serif">∑</span>
                  <span className="text-[10px] text-[#94A3B8] font-sans">k = 0</span>
                </div>

                <div className="inline-flex flex-col items-center text-sm">
                  <span className="border-b border-[#94A3B8] px-1 text-[#F1F5F9]">(-1)<sup>k</sup> sin((2k + 1)x)</span>
                  <span className="px-1 text-[#94A3B8] text-xs">(2k + 1)²</span>
                </div>
              </div>

              <div className="text-xs text-[#94A3B8] bg-[#111827] p-2.5 rounded border border-[#263247] text-left font-mono">
                <span className="text-[#64748B] font-sans text-xs">Series expansion: </span>
                <span className="font-semibold text-[#5B8CFF]">{((8 * amplitude) / (Math.PI * Math.PI)).toFixed(3)}</span>
                {' · [ sin(x) - ¹⁄₉ sin(3x) + ¹⁄₂₅ sin(5x) - … + (-1)ᵏ/(2k+1)² sin((2k+1)x) ]'}
              </div>
            </div>
          )}

          {waveform === 'custom' && (
            <div className="space-y-2 py-1">
              <div className="text-sm font-mono text-[#F1F5F9]">
                S(x) = {amplitude.toFixed(2)} · [ {customConfig.a1.toFixed(2)}·cos(x) + {customConfig.b1.toFixed(2)}·sin(x) + {customConfig.b2.toFixed(2)}·sin(2x) + {customConfig.b3.toFixed(2)}·sin(3x) ]
              </div>
              <p className="text-xs text-[#94A3B8]">
                Direct orthogonal linear combination of fundamental cosine and harmonics 1, 2, 3
              </p>
            </div>
          )}
        </div>

        {/* Notes on Symmetry & Convergence */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
          <div className="p-3 bg-[#151D2E] rounded-md border border-[#263247] space-y-1">
            <span className="font-medium text-[#F1F5F9] block">
              Harmonic composition
            </span>
            <p className="text-[#94A3B8] leading-relaxed text-[11px]">
              {waveform === 'square' && `Includes N = ${harmonicsCount} odd harmonic orders (1, 3, 5 … ${maxOddOrder}). Even terms evaluate to zero.`}
              {waveform === 'sawtooth' && `Includes N = ${harmonicsCount} integer harmonics (1, 2, 3 … ${harmonicsCount}) with alternating signs.`}
              {waveform === 'triangle' && `Includes odd harmonics with quadratic decay in harmonic order: 1/(2k+1)².`}
              {waveform === 'custom' && `Superposition of user-selected trigonometric basis frequencies.`}
            </p>
          </div>

          <div className="p-3 bg-[#151D2E] rounded-md border border-[#263247] space-y-1">
            <span className="font-medium text-[#F1F5F9] block">
              Symmetry properties
            </span>
            <p className="text-[#94A3B8] leading-relaxed text-[11px]">
              {waveform === 'square' && 'Half-wave anti-symmetry: f(x) = -f(x + π). Only odd sine coefficients survive.'}
              {waveform === 'sawtooth' && 'Odd function: f(-x) = -f(x). Cosine coefficients a_n are identically zero.'}
              {waveform === 'triangle' && 'Continuous piecewise-linear wave; smooth first derivative reduces overtone energy.'}
              {waveform === 'custom' && 'Contains both even (cosine) and odd (sine) basis components.'}
            </p>
          </div>

          <div className="p-3 bg-[#151D2E] rounded-md border border-[#263247] space-y-1">
            <span className="font-medium text-[#F1F5F9] block">
              Convergence behavior
            </span>
            <p className="text-[#94A3B8] leading-relaxed text-[11px]">
              {waveform === 'square' && 'Slow 1/n decay. Step discontinuities result in persistent ~8.95% Gibbs overshoot.'}
              {waveform === 'sawtooth' && 'Slow 1/n decay. Periodic transitions exhibit characteristic Gibbs ripples.'}
              {waveform === 'triangle' && 'Fast 1/n² quadratic decay. High-fidelity reconstruction with very few terms.'}
              {waveform === 'custom' && 'Exact representation: 0 truncation error for selected orders.'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
