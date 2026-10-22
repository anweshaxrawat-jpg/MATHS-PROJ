import React from 'react';
import { Volume2, VolumeX, RotateCcw, Activity } from 'lucide-react';

export type NavTab = 'generator' | 'analysis' | 'methodology' | 'about';

interface AppHeaderProps {
  activeTab: NavTab;
  setActiveTab: (tab: NavTab) => void;
  onReset: () => void;
  isAudioPlaying: boolean;
  onToggleAudio: () => void;
}

export const AppHeader: React.FC<AppHeaderProps> = ({
  activeTab,
  setActiveTab,
  onReset,
  isAudioPlaying,
  onToggleAudio,
}) => {
  const navItems: { id: NavTab; label: string }[] = [
    { id: 'generator', label: 'Wave Generator' },
    { id: 'analysis', label: 'Signal Analysis' },
    { id: 'methodology', label: 'Methodology' },
    { id: 'about', label: 'About' },
  ];

  return (
    <header className="border-b border-[#1E293B] bg-[#0E1526]/95 backdrop-blur-none sticky top-0 z-30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14">
          {/* Brand Wordmark & Wave Symbol */}
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 rounded bg-[#151D2E] border border-[#263247] flex items-center justify-center text-[#5B8CFF]">
              <Activity className="w-4 h-4" />
            </div>
            <div className="flex items-baseline gap-2.5">
              <span className="text-sm font-semibold text-[#F1F5F9] tracking-tight">
                Fourier Lab
              </span>
              <span className="text-xs text-[#94A3B8] hidden sm:inline border-l border-[#263247] pl-2.5">
                Fourier Series &amp; Signal Analysis
              </span>
            </div>
          </div>

          {/* Quick Actions: Audio Monitor & Reset */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onToggleAudio}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-md border transition-colors cursor-pointer ${
                isAudioPlaying
                  ? 'bg-[#152342] border-[#5B8CFF] text-[#5B8CFF] font-medium'
                  : 'bg-[#111827] border-[#263247] text-[#94A3B8] hover:bg-[#151D2E] hover:text-[#F1F5F9]'
              }`}
              title={isAudioPlaying ? 'Mute audio synthesizer' : 'Monitor synthesized harmonics using Web Audio (220 Hz)'}
            >
              {isAudioPlaying ? (
                <>
                  <Volume2 className="w-3.5 h-3.5 text-[#5B8CFF]" />
                  <span>Audio monitor <span className="font-mono text-[11px] text-[#5B8CFF]/90">(220 Hz)</span></span>
                </>
              ) : (
                <>
                  <VolumeX className="w-3.5 h-3.5 text-[#94A3B8]" />
                  <span>Audio monitor</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={onReset}
              className="inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs rounded-md border border-[#263247] bg-[#111827] text-[#94A3B8] hover:bg-[#151D2E] hover:text-[#F1F5F9] transition-colors cursor-pointer"
              title="Reset parameters to factory defaults"
            >
              <RotateCcw className="w-3.5 h-3.5 text-[#94A3B8]" />
              <span>Reset</span>
            </button>
          </div>
        </div>

        {/* Four Navigation Options Exactly: Wave Generator, Signal Analysis, Methodology, About */}
        <nav className="flex space-x-8 -mb-px border-t border-[#1E293B]/60 overflow-x-auto text-xs">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setActiveTab(item.id)}
                className={`py-2.5 border-b-2 text-xs transition-colors cursor-pointer whitespace-nowrap ${
                  isActive
                    ? 'border-[#5B8CFF] text-[#F1F5F9] font-medium'
                    : 'border-transparent text-[#94A3B8] hover:text-[#F1F5F9] hover:border-[#334155]'
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </nav>
      </div>
    </header>
  );
};
