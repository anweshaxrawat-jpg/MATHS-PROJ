import React, { useState } from 'react';
import { HarmonicComponent, SimulationSettings } from '../types/fourier';

interface HarmonicComponentsProps {
  settings: SimulationSettings;
  components: HarmonicComponent[];
  onToggleHarmonics: (show: boolean) => void;
}

export const HarmonicComponents: React.FC<HarmonicComponentsProps> = ({
  settings,
  components,
  onToggleHarmonics,
}) => {
  const { fundamentalFreq, showHarmonics } = settings;
  const [selectedHarmonicIndex, setSelectedHarmonicIndex] = useState<number>(0);

  const displayLimit = Math.min(8, components.length);
  const displayedComponents = components.slice(0, displayLimit);

  // Discrete Spectrum Stem Plot (SVG stem & impulse plot)
  const maxAmp = components[0]?.amplitude || 1;
  const svgWidth = 600;
  const svgHeight = 110;
  const padding = { left: 45, right: 20, top: 15, bottom: 25 };
  const plotW = svgWidth - padding.left - padding.right;
  const plotH = svgHeight - padding.top - padding.bottom;

  return (
    <div className="bg-[#111827] rounded-lg border border-[#263247] p-5 space-y-4 text-[#F1F5F9]">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#1E293B] pb-3">
        <div>
          <h3 className="text-sm font-semibold text-[#F1F5F9] tracking-tight">
            Harmonic decomposition &amp; frequency spectrum
          </h3>
          <p className="text-xs text-[#94A3B8] mt-0.5">
            Discrete spectral representation of constituent Fourier basis frequencies
          </p>
        </div>

        <label className="flex items-center gap-2 text-xs text-[#94A3B8] cursor-pointer hover:text-[#F1F5F9] transition-colors">
          <input
            type="checkbox"
            checked={showHarmonics}
            onChange={(e) => onToggleHarmonics(e.target.checked)}
            className="w-4 h-4 rounded text-[#5B8CFF] border-[#263247] bg-[#151D2E] focus:ring-0 cursor-pointer"
          />
          <span>Overlay harmonics on main visualization</span>
        </label>
      </div>

      <div className="space-y-4">
        {/* Discrete Amplitude Spectrum Stem Plot */}
        <div className="bg-[#151D2E] border border-[#263247] p-3.5 rounded-md space-y-1.5">
          <div className="flex justify-between items-baseline text-xs">
            <span className="font-medium text-[#F1F5F9]">
              Discrete amplitude spectrum |cₙ| (frequency domain)
            </span>
            <span className="text-[11px] text-[#94A3B8]">
              {components.length} harmonic components evaluated
            </span>
          </div>

          <svg
            viewBox={`0 0 ${svgWidth} ${svgHeight}`}
            className="w-full h-28 bg-[#111827] border border-[#263247] rounded block"
          >
            {/* Horizontal gridlines */}
            <line
              x1={padding.left}
              y1={padding.top}
              x2={svgWidth - padding.right}
              y2={padding.top}
              stroke="#1E2B40"
              strokeWidth="1"
            />
            <line
              x1={padding.left}
              y1={padding.top + plotH / 2}
              x2={svgWidth - padding.right}
              y2={padding.top + plotH / 2}
              stroke="#1E2B40"
              strokeWidth="1"
            />
            {/* Baseline */}
            <line
              x1={padding.left}
              y1={padding.top + plotH}
              x2={svgWidth - padding.right}
              y2={padding.top + plotH}
              stroke="#334155"
              strokeWidth="1"
            />

            {/* Y Axis tick labels */}
            <text x={padding.left - 6} y={padding.top + 4} textAnchor="end" fontSize="10" fontFamily="JetBrains Mono" fill="#64748B">
              {maxAmp.toFixed(2)}
            </text>
            <text x={padding.left - 6} y={padding.top + plotH / 2 + 3} textAnchor="end" fontSize="10" fontFamily="JetBrains Mono" fill="#64748B">
              {(maxAmp / 2).toFixed(2)}
            </text>
            <text x={padding.left - 6} y={padding.top + plotH + 3} textAnchor="end" fontSize="10" fontFamily="JetBrains Mono" fill="#64748B">
              0.00
            </text>

            {/* Stems for each harmonic */}
            {components.map((comp, idx) => {
              const xPos = padding.left + (idx / Math.max(1, components.length - 1)) * plotW;
              const stemH = (comp.amplitude / (maxAmp || 1)) * plotH;
              const yPos = padding.top + plotH - stemH;
              const isSelected = selectedHarmonicIndex === idx;

              return (
                <g key={comp.order} className="cursor-pointer" onClick={() => setSelectedHarmonicIndex(idx)}>
                  <line
                    x1={xPos}
                    y1={padding.top + plotH}
                    x2={xPos}
                    y2={yPos}
                    stroke={isSelected ? '#5B8CFF' : '#3B82F6'}
                    strokeWidth={isSelected ? '2.5' : '1.5'}
                  />
                  <circle
                    cx={xPos}
                    cy={yPos}
                    r={isSelected ? '3.5' : '2.5'}
                    fill={isSelected ? '#5B8CFF' : '#3B82F6'}
                  />
                  {/* Label for first few stems */}
                  {idx < 10 && (
                    <text
                      x={xPos}
                      y={padding.top + plotH + 14}
                      textAnchor="middle"
                      fontSize="9"
                      fontFamily="JetBrains Mono"
                      fill={isSelected ? '#F1F5F9' : '#64748B'}
                      fontWeight={isSelected ? '600' : 'normal'}
                    >
                      {comp.order}
                    </text>
                  )}
                </g>
              );
            })}
          </svg>
          <div className="flex justify-between items-center text-[11px] text-[#94A3B8] font-sans px-1 pt-0.5">
            <span>Stem baseline: 0.00 V</span>
            <span>Harmonic order (n)</span>
            <span>Max frequency: {((components[components.length - 1]?.order || 1) * fundamentalFreq).toFixed(1)} Hz</span>
          </div>
        </div>

        {/* Quietly Styled Table of Harmonic Components */}
        <div className="border border-[#263247] rounded-md overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#151D2E] border-b border-[#263247] text-[#94A3B8] font-medium">
              <tr>
                <th className="py-2.5 px-3">Index</th>
                <th className="py-2.5 px-3">Order (n)</th>
                <th className="py-2.5 px-3">Frequency</th>
                <th className="py-2.5 px-3">Coefficient |cₙ|</th>
                <th className="py-2.5 px-3">Analytical term</th>
                <th className="py-2.5 px-3">Relative power</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1E293B] text-[#F1F5F9]">
              {displayedComponents.map((comp, idx) => {
                const isSelected = selectedHarmonicIndex === idx;
                const powerFraction = (comp.amplitude * comp.amplitude) / (maxAmp * maxAmp);

                return (
                  <tr
                    key={comp.order}
                    onClick={() => setSelectedHarmonicIndex(idx)}
                    className={`cursor-pointer transition-colors ${
                      isSelected ? 'bg-[#152342] font-medium' : 'hover:bg-[#151D2E]/60'
                    }`}
                  >
                    <td className="py-2 px-3 text-[#64748B] font-mono text-[11px]">#{comp.index}</td>
                    <td className="py-2 px-3 text-[#F1F5F9] font-mono text-xs">n = {comp.order}</td>
                    <td className="py-2 px-3 font-mono text-xs text-[#94A3B8]">{comp.frequency.toFixed(1)} Hz</td>
                    <td className="py-2 px-3 font-mono text-xs text-[#5B8CFF] font-medium">{comp.amplitude.toFixed(4)} V</td>
                    <td className="py-2 px-3 font-mono text-xs text-[#94A3B8]">{comp.formula}</td>
                    <td className="py-2 px-3">
                      <div className="flex items-center gap-2">
                        <div className="w-16 h-1.5 bg-[#1F293D] rounded-full overflow-hidden">
                          <div
                            className="h-full bg-[#5B8CFF] rounded-full"
                            style={{ width: `${Math.min(100, powerFraction * 100)}%` }}
                          />
                        </div>
                        <span className="text-[11px] font-mono text-[#94A3B8]">{(powerFraction * 100).toFixed(1)}%</span>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
