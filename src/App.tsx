/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo, useEffect, useCallback, useRef } from 'react';
import { SimulationSettings, WaveformType } from './types/fourier';
import {
  generateWaveformSamples,
  calculateMetrics,
  getHarmonicComponents,
} from './utils/fourier';
import { fourierSynth } from './utils/audio';

import { AppHeader, NavTab } from './components/AppHeader';
import { WaveControls } from './components/WaveControls';
import { MainWaveChart } from './components/MainWaveChart';
import { AnalysisMetrics } from './components/AnalysisMetrics';
import { FourierFormula } from './components/FourierFormula';
import { HarmonicComponents } from './components/HarmonicComponents';
import { WaveComparison } from './components/WaveComparison';
import { ExperimentsSection } from './components/ExperimentsSection';
import { SignalProcessingSection } from './components/SignalProcessingSection';
import { MethodologySection } from './components/MethodologySection';
import { AboutSection } from './components/AboutSection';

const DEFAULT_SETTINGS: SimulationSettings = {
  waveform: 'square',
  harmonicsCount: 10,
  fundamentalFreq: 1.0,
  amplitude: 1.0,
  customConfig: {
    a1: 0.0,
    b1: 1.0,
    b2: 0.5,
    b3: 0.25,
  },
  showOriginal: true,
  showApproximation: true,
  showHarmonics: false,
  showGibbsHighlight: true,
  samplePoints: 800,
  isRunning: false,
  phaseOffset: 0,
};

export default function App() {
  const [activeTab, setActiveTab] = useState<NavTab>('generator');
  const [settings, setSettings] = useState<SimulationSettings>(DEFAULT_SETTINGS);
  const [isAudioPlaying, setIsAudioPlaying] = useState<boolean>(false);

  const animRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number>(performance.now());

  // Continuous phase roll animation loop when isRunning is true
  useEffect(() => {
    if (!settings.isRunning) {
      if (animRef.current) {
        cancelAnimationFrame(animRef.current);
        animRef.current = null;
      }
      return;
    }

    lastTimeRef.current = performance.now();

    const loop = (time: number) => {
      const dt = Math.min(0.05, (time - lastTimeRef.current) / 1000);
      lastTimeRef.current = time;

      setSettings((prev) => {
        if (!prev.isRunning) return prev;
        const speedFactor = 0.5; // smooth controlled animation rate
        const deltaPhase = 2 * Math.PI * prev.fundamentalFreq * dt * speedFactor;
        const newPhase = ((prev.phaseOffset || 0) + deltaPhase) % (2 * Math.PI);
        return {
          ...prev,
          phaseOffset: newPhase,
        };
      });

      animRef.current = requestAnimationFrame(loop);
    };

    animRef.current = requestAnimationFrame(loop);

    return () => {
      if (animRef.current) {
        cancelAnimationFrame(animRef.current);
        animRef.current = null;
      }
    };
  }, [settings.isRunning, settings.fundamentalFreq]);

  // Synchronized mathematical calculations
  const samples = useMemo(() => {
    return generateWaveformSamples(settings, 2);
  }, [settings]);

  const metrics = useMemo(() => {
    return calculateMetrics(
      samples,
      settings.waveform,
      settings.amplitude,
      settings.harmonicsCount,
      settings.fundamentalFreq
    );
  }, [samples, settings.waveform, settings.amplitude, settings.harmonicsCount, settings.fundamentalFreq]);

  const harmonicComponents = useMemo(() => {
    return getHarmonicComponents(
      settings.waveform,
      settings.harmonicsCount,
      settings.amplitude,
      settings.customConfig,
      settings.fundamentalFreq
    );
  }, [
    settings.waveform,
    settings.harmonicsCount,
    settings.amplitude,
    settings.customConfig,
    settings.fundamentalFreq,
  ]);

  // Audio synthesizer update
  useEffect(() => {
    if (isAudioPlaying) {
      fourierSynth.update(settings.waveform, settings.harmonicsCount, settings.customConfig);
    }
  }, [settings.waveform, settings.harmonicsCount, settings.customConfig, isAudioPlaying]);

  useEffect(() => {
    return () => {
      fourierSynth.stop();
    };
  }, []);

  const handleToggleAudio = useCallback(() => {
    const newState = fourierSynth.toggle(
      settings.waveform,
      settings.harmonicsCount,
      settings.customConfig,
      220
    );
    setIsAudioPlaying(newState);
  }, [settings.waveform, settings.harmonicsCount, settings.customConfig]);

  const handleToggleAnimation = useCallback(() => {
    setSettings((prev) => ({
      ...prev,
      isRunning: !prev.isRunning,
    }));
  }, []);

  const handleUpdateSettings = useCallback((newPartial: Partial<SimulationSettings>) => {
    setSettings((prev) => ({
      ...prev,
      ...newPartial,
    }));
  }, []);

  const handleReset = useCallback(() => {
    setSettings(DEFAULT_SETTINGS);
    if (isAudioPlaying) {
      fourierSynth.stop();
      setIsAudioPlaying(false);
    }
  }, [isAudioPlaying]);

  const handleApplyExperiment = useCallback((expSettings: Partial<SimulationSettings>) => {
    setSettings((prev) => ({
      ...prev,
      ...expSettings,
    }));
    setActiveTab('generator');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  return (
    <div className="min-h-screen bg-[#0B1020] text-[#F1F5F9] flex flex-col font-sans selection:bg-[#5B8CFF]/30 selection:text-[#F1F5F9]">
      {/* Dark Scientific Header */}
      <AppHeader
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onReset={handleReset}
        isAudioPlaying={isAudioPlaying}
        onToggleAudio={handleToggleAudio}
      />

      {/* Main Content Workspace */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Navigation 1: Wave Generator (Primary Workspace) */}
        {activeTab === 'generator' && (
          <div className="space-y-6">
            {/* Header: Title, Subtitle, and Compact Waveform Indicator */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[#111827] rounded-lg border border-[#263247] p-4 sm:px-6">
              <div>
                <h2 className="text-base font-semibold text-[#F1F5F9] tracking-tight">
                  Wave Generator
                </h2>
                <p className="text-xs text-[#94A3B8] mt-0.5">
                  Build periodic signals and explore their Fourier approximations.
                </p>
              </div>

              <div className="flex items-center gap-2 self-start sm:self-center">
                <span className="px-2.5 py-1 rounded text-xs font-mono font-medium bg-[#151D2E] text-[#5B8CFF] border border-[#263247]">
                  {settings.waveform.charAt(0).toUpperCase() + settings.waveform.slice(1)} wave · N = {settings.harmonicsCount}
                </span>
              </div>
            </div>

            {/* Balanced Two-Column Desktop Workspace: Left Controls, Right Chart */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              {/* Left Column: Compact Signal Controls Panel (4 cols) */}
              <div className="lg:col-span-4 space-y-6">
                <WaveControls
                  settings={settings}
                  onUpdateSettings={handleUpdateSettings}
                  onReset={handleReset}
                  onToggleAnimation={handleToggleAnimation}
                />
              </div>

              {/* Right Column: Visually Dominant Waveform Visualization (8 cols) */}
              <div className="lg:col-span-8 space-y-6">
                <MainWaveChart
                  samples={samples}
                  settings={settings}
                  metrics={metrics}
                  harmonicComponents={harmonicComponents}
                />

                <AnalysisMetrics
                  settings={settings}
                  metrics={metrics}
                />

                <FourierFormula
                  settings={settings}
                />
              </div>
            </div>

            {/* Below Main Workspace: Guided Demonstration Experiments */}
            <ExperimentsSection
              onApplySettings={handleApplyExperiment}
              currentSettings={settings}
            />
          </div>
        )}

        {/* Navigation 2: Signal Analysis */}
        {activeTab === 'analysis' && (
          <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[#111827] rounded-lg border border-[#263247] p-4 sm:px-6">
              <div>
                <h2 className="text-base font-semibold text-[#F1F5F9] tracking-tight">
                  Signal Analysis
                </h2>
                <p className="text-xs text-[#94A3B8] mt-0.5">
                  Examine harmonic spectra, convergence rates, and approximation error.
                </p>
              </div>

              <div className="flex items-center gap-2 self-start sm:self-center">
                <span className="text-xs text-[#94A3B8]">Active terms:</span>
                <span className="px-2.5 py-0.5 rounded text-xs font-mono font-medium bg-[#151D2E] text-[#5B8CFF] border border-[#263247]">
                  N = {settings.harmonicsCount}
                </span>
              </div>
            </div>

            {/* Multi-Harmonic Progression Comparison (N = 1, 3, 5, 10) */}
            <WaveComparison
              settings={settings}
              onSelectHarmonicCount={(count) => handleUpdateSettings({ harmonicsCount: count })}
            />

            {/* Discrete Harmonic Amplitude Spectrum Stem Plot & Data Table */}
            <HarmonicComponents
              settings={settings}
              components={harmonicComponents}
              onToggleHarmonics={(show) => handleUpdateSettings({ showHarmonics: show })}
            />

            {/* Numerical Convergence Metrics */}
            <AnalysisMetrics
              settings={settings}
              metrics={metrics}
            />

            {/* Mathematical Formulation */}
            <FourierFormula
              settings={settings}
            />

            {/* Practical Engineering Applications */}
            <SignalProcessingSection />
          </div>
        )}

        {/* Navigation 3: Methodology */}
        {activeTab === 'methodology' && (
          <div className="space-y-6">
            <MethodologySection />
          </div>
        )}

        {/* Navigation 4: About */}
        {activeTab === 'about' && (
          <div className="space-y-6">
            <AboutSection />
          </div>
        )}
      </main>

      {/* Dark Scientific Workstation Footer */}
      <footer className="border-t border-[#1E293B] bg-[#0E1526] py-4 text-xs text-[#94A3B8]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-2.5">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-[#F1F5F9]">Fourier Lab</span>
            <span>·</span>
            <span>Fourier Series &amp; Signal Analysis Workstation</span>
            <span>·</span>
            <span>Undergraduate Engineering Mathematics</span>
          </div>

          <div className="flex items-center gap-3 text-[11px] text-[#64748B]">
            <span>Deterministic local computation</span>
            <span>·</span>
            <span>M = {settings.samplePoints || 800} points</span>
            <span>·</span>
            <span>Dark scientific theme</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
