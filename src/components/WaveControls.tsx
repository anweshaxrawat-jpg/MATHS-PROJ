import React from 'react';
import { Play, Pause, RotateCcw } from 'lucide-react';
import { SimulationSettings, WaveformType } from '../types/fourier';

interface WaveControlsProps {
  settings: SimulationSettings;
  onUpdateSettings: (newSettings: Partial<SimulationSettings>) => void;
  onReset: () => void;
  onToggleAnimation?: () => void;
}

export const WaveControls: React.FC<WaveControlsProps> = ({
  settings,
  onUpdateSettings,
  onReset,
  onToggleAnimation,
}) => {
  const {
    waveform,
    harmonicsCount,
    fundamentalFreq,
    amplitude,
    customConfig,
    showOriginal,
    showApproximation,
    showHarmonics,
    showGibbsHighlight,
    isRunning,
  } = settings;

  const periodSec = (1 / fundamentalFreq).toFixed(3);

  let maxOrder = harmonicsCount;
  if (waveform === 'square' || waveform === 'triangle') {
    maxOrder = 2 * harmonicsCount - 1;
  }

  const harmonicSteps = [1, 3, 5, 10, 20, 50];

  return (
    <div className="bg-[#111827] rounded-lg border border-[#263247] p-5 space-y-5 text-[#F1F5F9]">
      {/* Panel Header */}
      <div className="border-b border-[#1E293B] pb-3">
        <h2 className="text-sm font-semibold text-[#F1F5F9] tracking-tight">
          Signal parameters
        </h2>
        <p className="text-xs text-[#94A3B8] mt-0.5">
          Select target profile, harmonic terms, and signal dimensions
        </p>
      </div>

      {/* Control 1: Waveform Selection */}
      <div className="space-y-1.5">
        <label
          htmlFor="ctrl-waveform"
          className="block text-xs font-medium text-[#F1F5F9]"
        >
          Target waveform
        </label>
        <select
          id="ctrl-waveform"
          value={waveform}
          onChange={(e) => onUpdateSettings({ waveform: e.target.value as WaveformType })}
          className="w-full bg-[#151D2E] border border-[#263247] hover:border-[#334155] text-xs font-normal text-[#F1F5F9] rounded-md px-3 py-2 focus:outline-none focus:border-[#5B8CFF] cursor-pointer transition-colors"
        >
          <option value="square">Square wave (odd harmonics, 1/n decay)</option>
          <option value="sawtooth">Sawtooth wave (all harmonics, 1/n decay)</option>
          <option value="triangle">Triangle wave (odd harmonics, 1/n² decay)</option>
          <option value="custom">Custom harmonic combination</option>
        </select>
        <p className="text-[11px] text-[#94A3B8] leading-relaxed">
          {waveform === 'square' && 'Jump discontinuities at 0 and π produce slow 1/n decay and persistent Gibbs overshoot.'}
          {waveform === 'sawtooth' && 'Periodic ramp with jump resets at ±π; contains both odd and even integer harmonics.'}
          {waveform === 'triangle' && 'Continuous piecewise-linear waveform; coefficients decay quadratically as 1/n².'}
          {waveform === 'custom' && 'Adjust individual trigonometric basis coefficients below.'}
        </p>
      </div>

      {/* Control 2: Number of Harmonics */}
      <div className="space-y-2 pt-1 border-t border-[#1E293B]">
        <div className="flex items-center justify-between text-xs">
          <label htmlFor="ctrl-harmonics" className="font-medium text-[#F1F5F9]">
            Harmonic terms
          </label>
          <div className="flex items-center gap-2">
            <span className="text-[11px] text-[#94A3B8]">Order n ≤ {maxOrder}</span>
            <span className="font-mono text-xs font-medium text-[#5B8CFF] bg-[#152342] border border-[#5B8CFF]/30 px-2 py-0.5 rounded">
              N = {harmonicsCount}
            </span>
          </div>
        </div>

        <input
          id="ctrl-harmonics"
          type="range"
          min="1"
          max="50"
          step="1"
          value={harmonicsCount}
          onChange={(e) => onUpdateSettings({ harmonicsCount: parseInt(e.target.value, 10) })}
          className="w-full h-1.5 bg-[#1F293D] rounded appearance-none cursor-pointer accent-[#5B8CFF]"
        />

        {/* Quick Stepping Values */}
        <div className="flex items-center gap-1.5 pt-0.5">
          {harmonicSteps.map((val) => (
            <button
              key={val}
              type="button"
              onClick={() => onUpdateSettings({ harmonicsCount: val })}
              className={`flex-1 py-1 text-xs font-mono rounded border transition-colors cursor-pointer ${
                harmonicsCount === val
                  ? 'bg-[#5B8CFF] text-white border-[#5B8CFF] font-medium'
                  : 'bg-[#151D2E] text-[#94A3B8] border-[#263247] hover:bg-[#1C263B] hover:text-[#F1F5F9]'
              }`}
            >
              {val}
            </button>
          ))}
        </div>
      </div>

      {/* Control 3: Fundamental Frequency */}
      <div className="space-y-2 pt-1 border-t border-[#1E293B]">
        <div className="flex items-center justify-between text-xs">
          <label htmlFor="ctrl-frequency" className="font-medium text-[#F1F5F9]">
            Fundamental frequency (f₀)
          </label>
          <div className="flex items-center gap-2">
            <span className="text-[11px] text-[#94A3B8]">T = {periodSec} s</span>
            <span className="font-mono text-xs font-medium text-[#F1F5F9] bg-[#151D2E] border border-[#263247] px-2 py-0.5 rounded">
              {fundamentalFreq.toFixed(1)} Hz
            </span>
          </div>
        </div>

        <input
          id="ctrl-frequency"
          type="range"
          min="0.5"
          max="5.0"
          step="0.1"
          value={fundamentalFreq}
          onChange={(e) => onUpdateSettings({ fundamentalFreq: parseFloat(e.target.value) })}
          className="w-full h-1.5 bg-[#1F293D] rounded appearance-none cursor-pointer accent-[#5B8CFF]"
        />
        <div className="flex justify-between text-[11px] text-[#94A3B8] font-mono">
          <span>0.5 Hz</span>
          <span>1.0 Hz (standard)</span>
          <span>5.0 Hz</span>
        </div>
      </div>

      {/* Control 4: Amplitude */}
      <div className="space-y-2 pt-1 border-t border-[#1E293B]">
        <div className="flex items-center justify-between text-xs">
          <label htmlFor="ctrl-amplitude" className="font-medium text-[#F1F5F9]">
            Peak amplitude (A)
          </label>
          <span className="font-mono text-xs font-medium text-[#F1F5F9] bg-[#151D2E] border border-[#263247] px-2 py-0.5 rounded">
            ±{amplitude.toFixed(2)} V
          </span>
        </div>

        <input
          id="ctrl-amplitude"
          type="range"
          min="0.5"
          max="2.0"
          step="0.05"
          value={amplitude}
          onChange={(e) => onUpdateSettings({ amplitude: parseFloat(e.target.value) })}
          className="w-full h-1.5 bg-[#1F293D] rounded appearance-none cursor-pointer accent-[#5B8CFF]"
        />
        <div className="flex justify-between text-[11px] text-[#94A3B8] font-mono">
          <span>0.50 V</span>
          <span>1.00 V (standard)</span>
          <span>2.00 V</span>
        </div>
      </div>

      {/* Custom Harmonic Inputs (if Custom waveform is active) */}
      {waveform === 'custom' && (
        <div className="border border-[#263247] bg-[#151D2E] p-3 rounded-md space-y-2.5">
          <span className="text-xs font-medium text-[#F1F5F9] block">
            Custom harmonic coefficients
          </span>
          <div className="grid grid-cols-2 gap-2.5 text-xs">
            <div>
              <span className="text-[#94A3B8] text-[11px]">b₁ · sin(x):</span>
              <input
                type="number"
                step="0.1"
                min="-2"
                max="2"
                value={customConfig.b1}
                onChange={(e) =>
                  onUpdateSettings({
                    customConfig: { ...customConfig, b1: parseFloat(e.target.value) || 0 },
                  })
                }
                className="w-full bg-[#111827] border border-[#263247] font-mono px-2 py-1 mt-0.5 text-[#F1F5F9] rounded focus:outline-none focus:border-[#5B8CFF]"
              />
            </div>
            <div>
              <span className="text-[#94A3B8] text-[11px]">a₁ · cos(x):</span>
              <input
                type="number"
                step="0.1"
                min="-2"
                max="2"
                value={customConfig.a1}
                onChange={(e) =>
                  onUpdateSettings({
                    customConfig: { ...customConfig, a1: parseFloat(e.target.value) || 0 },
                  })
                }
                className="w-full bg-[#111827] border border-[#263247] font-mono px-2 py-1 mt-0.5 text-[#F1F5F9] rounded focus:outline-none focus:border-[#5B8CFF]"
              />
            </div>
            <div>
              <span className="text-[#94A3B8] text-[11px]">b₂ · sin(2x):</span>
              <input
                type="number"
                step="0.1"
                min="-2"
                max="2"
                value={customConfig.b2}
                onChange={(e) =>
                  onUpdateSettings({
                    customConfig: { ...customConfig, b2: parseFloat(e.target.value) || 0 },
                  })
                }
                className="w-full bg-[#111827] border border-[#263247] font-mono px-2 py-1 mt-0.5 text-[#F1F5F9] rounded focus:outline-none focus:border-[#5B8CFF]"
              />
            </div>
            <div>
              <span className="text-[#94A3B8] text-[11px]">b₃ · sin(3x):</span>
              <input
                type="number"
                step="0.1"
                min="-2"
                max="2"
                value={customConfig.b3}
                onChange={(e) =>
                  onUpdateSettings({
                    customConfig: { ...customConfig, b3: parseFloat(e.target.value) || 0 },
                  })
                }
                className="w-full bg-[#111827] border border-[#263247] font-mono px-2 py-1 mt-0.5 text-[#F1F5F9] rounded focus:outline-none focus:border-[#5B8CFF]"
              />
            </div>
          </div>
        </div>
      )}

      {/* Display Layers Checkboxes */}
      <div className="space-y-2 pt-1 border-t border-[#1E293B]">
        <span className="text-xs font-medium text-[#F1F5F9] block">
          Display layers
        </span>
        <div className="space-y-1.5 text-xs">
          <label className="flex items-center gap-2.5 cursor-pointer text-[#94A3B8] hover:text-[#F1F5F9] transition-colors">
            <input
              type="checkbox"
              checked={showOriginal}
              onChange={(e) => onUpdateSettings({ showOriginal: e.target.checked })}
              className="w-4 h-4 rounded text-[#F59E7B] border-[#263247] bg-[#151D2E] focus:ring-0 cursor-pointer"
            />
            <span className="flex items-center gap-2">
              <span className="w-3.5 h-0.5 bg-[#F59E7B] border-t border-dashed inline-block" />
              Target signal <span className="font-mono text-[#94A3B8] text-[11px]">f(t)</span>
            </span>
          </label>

          <label className="flex items-center gap-2.5 cursor-pointer text-[#94A3B8] hover:text-[#F1F5F9] transition-colors">
            <input
              type="checkbox"
              checked={showApproximation}
              onChange={(e) => onUpdateSettings({ showApproximation: e.target.checked })}
              className="w-4 h-4 rounded text-[#5B8CFF] border-[#263247] bg-[#151D2E] focus:ring-0 cursor-pointer"
            />
            <span className="flex items-center gap-2">
              <span className="w-3.5 h-0.5 bg-[#5B8CFF] inline-block" />
              Fourier sum <span className="font-mono text-[#94A3B8] text-[11px]">S_N(t)</span>
            </span>
          </label>

          <label className="flex items-center gap-2.5 cursor-pointer text-[#94A3B8] hover:text-[#F1F5F9] transition-colors">
            <input
              type="checkbox"
              checked={showHarmonics}
              onChange={(e) => onUpdateSettings({ showHarmonics: e.target.checked })}
              className="w-4 h-4 rounded text-[#818CF8] border-[#263247] bg-[#151D2E] focus:ring-0 cursor-pointer"
            />
            <span className="flex items-center gap-2">
              <span className="w-3.5 h-0.5 bg-[#818CF8] inline-block" />
              Individual harmonics <span className="text-[#94A3B8] text-[11px]">(first 5)</span>
            </span>
          </label>

          <label className="flex items-center gap-2.5 cursor-pointer text-[#94A3B8] hover:text-[#F1F5F9] transition-colors">
            <input
              type="checkbox"
              checked={showGibbsHighlight}
              onChange={(e) => onUpdateSettings({ showGibbsHighlight: e.target.checked })}
              className="w-4 h-4 rounded text-[#F87171] border-[#263247] bg-[#151D2E] focus:ring-0 cursor-pointer"
            />
            <span className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#F87171] inline-block" />
              Gibbs overshoot highlight <span className="text-[#94A3B8] text-[11px]">(~8.95%)</span>
            </span>
          </label>
        </div>
      </div>

      {/* Play/Pause Animation & Reset Bar */}
      <div className="pt-2 border-t border-[#1E293B] flex items-center justify-between gap-2.5">
        <button
          type="button"
          onClick={onToggleAnimation}
          className={`flex-1 py-1.5 px-3 text-xs font-medium rounded-md border flex items-center justify-center gap-1.5 transition-colors cursor-pointer ${
            isRunning
              ? 'bg-[#152342] border-[#5B8CFF] text-[#5B8CFF]'
              : 'bg-[#151D2E] text-[#94A3B8] border-[#263247] hover:bg-[#1C263B] hover:text-[#F1F5F9]'
          }`}
          title={isRunning ? 'Freeze phase' : 'Continuous phase progression animation'}
        >
          {isRunning ? (
            <>
              <Pause className="w-3.5 h-3.5 text-[#5B8CFF]" />
              <span>Pause animation</span>
            </>
          ) : (
            <>
              <Play className="w-3.5 h-3.5 text-[#94A3B8]" />
              <span>Play animation</span>
            </>
          )}
        </button>

        <button
          type="button"
          onClick={onReset}
          className="py-1.5 px-3 text-xs rounded-md border border-[#263247] bg-[#151D2E] text-[#94A3B8] hover:bg-[#1C263B] hover:text-[#F1F5F9] transition-colors flex items-center gap-1.5 cursor-pointer"
          title="Restore standard 10-harmonic square wave parameters"
        >
          <RotateCcw className="w-3.5 h-3.5 text-[#94A3B8]" />
          <span>Reset</span>
        </button>
      </div>
    </div>
  );
};
