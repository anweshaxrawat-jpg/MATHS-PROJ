import React from 'react';
import { Headphones, Radio, Zap, ShieldAlert } from 'lucide-react';

export const SignalProcessingSection: React.FC = () => {
  return (
    <div className="bg-[#111827] rounded-lg border border-[#263247] p-5 space-y-4 text-[#F1F5F9]">
      {/* Header */}
      <div className="border-b border-[#1E293B] pb-3">
        <h3 className="text-sm font-semibold text-[#F1F5F9] tracking-tight">
          Where is Fourier Series used in engineering?
        </h3>
        <p className="text-xs text-[#94A3B8] mt-0.5">
          Real-world signals contain multiple frequency components. Fourier analysis reveals the spectral distribution governing signal shape and channel behavior.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-1">
        {/* Domain 1 */}
        <div className="p-4 bg-[#151D2E] rounded-md border border-[#263247] space-y-2.5">
          <div className="flex items-center gap-2">
            <Headphones className="w-4 h-4 text-[#5B8CFF]" />
            <h4 className="text-xs font-semibold text-[#F1F5F9]">
              Audio processing &amp; acoustics
            </h4>
          </div>
          <p className="text-xs text-[#94A3B8] leading-relaxed">
            Every musical instrument produces a distinct overtone spectrum. A tuning fork produces a pure fundamental sinusoid ($f_0$), whereas brass and reed instruments generate rich odd and even harmonics that dictate acoustic timbre.
          </p>
          <div className="bg-[#111827] p-2.5 rounded border border-[#263247] text-[11px] text-[#94A3B8] space-y-1">
            <span className="font-medium text-[#F1F5F9] block">Practical applications:</span>
            <ul className="list-disc list-inside space-y-0.5 text-[#94A3B8]">
              <li>Graphic and parametric equalizers</li>
              <li>Additive synthesizer wave generation</li>
              <li>Perceptual audio compression (MP3, AAC)</li>
            </ul>
          </div>
        </div>

        {/* Domain 2 */}
        <div className="p-4 bg-[#151D2E] rounded-md border border-[#263247] space-y-2.5">
          <div className="flex items-center gap-2">
            <Radio className="w-4 h-4 text-[#5B8CFF]" />
            <h4 className="text-xs font-semibold text-[#F1F5F9]">
              Communication systems &amp; bandwidth
            </h4>
          </div>
          <p className="text-xs text-[#94A3B8] leading-relaxed">
            Physical transmission channels (coaxial cables, optical fibers, wireless bands) possess finite bandwidth. Truncating square digital clock pulses below the 5th or 7th harmonic produces pulse rounding and inter-symbol interference.
          </p>
          <div className="bg-[#111827] p-2.5 rounded border border-[#263247] text-[11px] text-[#94A3B8] space-y-1">
            <span className="font-medium text-[#F1F5F9] block">Practical applications:</span>
            <ul className="list-disc list-inside space-y-0.5 text-[#94A3B8]">
              <li>Digital clock signal integrity analysis</li>
              <li>Orthogonal frequency-division multiplexing (OFDM)</li>
              <li>Anti-aliasing filter cutoff specification</li>
            </ul>
          </div>
        </div>

        {/* Domain 3 */}
        <div className="p-4 bg-[#151D2E] rounded-md border border-[#263247] space-y-2.5">
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-[#5B8CFF]" />
            <h4 className="text-xs font-semibold text-[#F1F5F9]">
              Electrical power &amp; distortion
            </h4>
          </div>
          <p className="text-xs text-[#94A3B8] leading-relaxed">
            Non-linear loads such as rectifiers, variable-frequency motor drives, and switched-mode power supplies distort pure 50/60 Hz AC voltage into non-sinusoidal periodic waveforms with severe harmonic pollution.
          </p>
          <div className="bg-[#111827] p-2.5 rounded border border-[#263247] text-[11px] text-[#94A3B8] space-y-1">
            <span className="font-medium text-[#F1F5F9] block">Practical applications:</span>
            <ul className="list-disc list-inside space-y-0.5 text-[#94A3B8]">
              <li>Total harmonic distortion (THD) compliance</li>
              <li>Tuned LC shunt filter design</li>
              <li>Transformer core eddy-current overheating</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Simulator Scope */}
      <div className="pt-2 border-t border-[#1E293B] flex items-start gap-2 text-xs text-[#94A3B8]">
        <ShieldAlert className="w-3.5 h-3.5 text-[#64748B] shrink-0 mt-0.5" />
        <p className="leading-relaxed">
          <strong>Educational simulator note:</strong> This application executes deterministic mathematical evaluation of Fourier Series equations for undergraduate demonstration. It does not perform physical hardware data acquisition from oscilloscopes or live electrical systems.
        </p>
      </div>
    </div>
  );
};
