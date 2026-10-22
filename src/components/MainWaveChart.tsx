import React, { useRef, useEffect, useState, useCallback } from 'react';
import { Download, FileSpreadsheet, Crosshair } from 'lucide-react';
import {
  SamplePoint,
  SimulationSettings,
  MetricsData,
  HarmonicComponent,
} from '../types/fourier';
import { exportGraphAsPNG, exportDataAsCSV } from '../utils/export';

interface MainWaveChartProps {
  samples: SamplePoint[];
  settings: SimulationSettings;
  metrics: MetricsData;
  harmonicComponents: HarmonicComponent[];
}

export const MainWaveChart: React.FC<MainWaveChartProps> = ({
  samples,
  settings,
  metrics,
  harmonicComponents,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const [hoverIndex, setHoverIndex] = useState<number | null>(null);

  // Render high-precision dark scientific plot
  const renderChart = useCallback(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container || samples.length === 0) return;

    const width = container.clientWidth;
    const height = Math.max(380, Math.min(520, window.innerHeight * 0.52));
    const dpr = window.devicePixelRatio || 1;

    canvas.width = width * dpr;
    canvas.height = height * dpr;
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.save();
    ctx.scale(dpr, dpr);

    // Margins
    const margin = { top: 20, right: 24, bottom: 40, left: 50 };
    const plotWidth = width - margin.left - margin.right;
    const plotHeight = height - margin.top - margin.bottom;

    // Background: deep slate surface (#111827)
    ctx.fillStyle = '#111827';
    ctx.fillRect(0, 0, width, height);

    // Plot interior surface: #151D2E
    ctx.fillStyle = '#151D2E';
    ctx.fillRect(margin.left, margin.top, plotWidth, plotHeight);

    // Y Axis scale limits
    const maxAmp = Math.max(1.2, settings.amplitude * 1.35);
    const yMin = -maxAmp;
    const yMax = maxAmp;

    const tMin = samples[0].t;
    const tMax = samples[samples.length - 1].t;

    const scaleX = (t: number) => margin.left + ((t - tMin) / (tMax - tMin)) * plotWidth;
    const scaleY = (y: number) => margin.top + plotHeight - ((y - yMin) / (yMax - yMin)) * plotHeight;

    // 1. Grid Lines (Y-Axis Graticule)
    const yTicks: number[] = [];
    const step = settings.amplitude > 1.2 ? 0.5 : 0.25;
    for (let y = -2.5; y <= 2.501; y += step) {
      if (y >= yMin && y <= yMax) {
        yTicks.push(Math.round(y * 100) / 100);
      }
    }

    ctx.textAlign = 'right';
    ctx.textBaseline = 'middle';
    ctx.font = '11px JetBrains Mono, monospace';

    yTicks.forEach((yVal) => {
      const yPos = scaleY(yVal);
      const isZero = Math.abs(yVal) < 0.001;

      ctx.beginPath();
      ctx.strokeStyle = isZero ? '#3B4F6E' : '#1E2B40'; // fine low-contrast grid lines
      ctx.lineWidth = isZero ? 1.2 : 0.8;
      if (isZero) {
        ctx.setLineDash([4, 3]);
      } else {
        ctx.setLineDash([]);
      }
      ctx.moveTo(margin.left, yPos);
      ctx.lineTo(margin.left + plotWidth, yPos);
      ctx.stroke();
      ctx.setLineDash([]);

      ctx.fillStyle = isZero ? '#F1F5F9' : '#64748B';
      ctx.fillText(`${yVal > 0 ? '+' : ''}${yVal.toFixed(2)}`, margin.left - 8, yPos);
    });

    // 2. Grid Lines (Time X-Axis in Period Fractions)
    const period = metrics.period;
    const xTicks = [
      { t: 0, label: '0' },
      { t: period * 0.5, label: '0.5 T' },
      { t: period, label: '1.0 T' },
      { t: period * 1.5, label: '1.5 T' },
      { t: period * 2.0, label: '2.0 T' },
    ];

    ctx.textAlign = 'center';
    ctx.textBaseline = 'top';

    xTicks.forEach((tick) => {
      const xPos = scaleX(tick.t);
      if (xPos >= margin.left && xPos <= margin.left + plotWidth) {
        ctx.beginPath();
        ctx.strokeStyle = '#1E2B40';
        ctx.lineWidth = 0.8;
        ctx.setLineDash([]);
        ctx.moveTo(xPos, margin.top);
        ctx.lineTo(xPos, margin.top + plotHeight);
        ctx.stroke();

        ctx.fillStyle = '#94A3B8';
        ctx.font = '11px Inter, sans-serif';
        ctx.fillText(tick.label, xPos, margin.top + plotHeight + 6);

        ctx.fillStyle = '#64748B';
        ctx.font = '10px JetBrains Mono, monospace';
        ctx.fillText(`${tick.t.toFixed(3)}s`, xPos, margin.top + plotHeight + 20);
      }
    });

    // Subtle outer border for plot area
    ctx.strokeStyle = '#263247';
    ctx.lineWidth = 1;
    ctx.strokeRect(margin.left, margin.top, plotWidth, plotHeight);

    // 3. Sub-Harmonic Traces (if enabled)
    if (settings.showHarmonics && harmonicComponents.length > 0) {
      const colors = ['#818CF8', '#A78BFA', '#38BDF8', '#34D399', '#FBBF24'];
      const maxToDraw = Math.min(4, harmonicComponents.length);

      for (let hIdx = 0; hIdx < maxToDraw; hIdx++) {
        const comp = harmonicComponents[hIdx];
        ctx.beginPath();
        ctx.strokeStyle = colors[hIdx % colors.length];
        ctx.lineWidth = 1;
        ctx.setLineDash([2, 2]);

        for (let i = 0; i < samples.length; i++) {
          const pt = samples[i];
          const harmonicVal = comp.isSine
            ? comp.amplitude * Math.sin(comp.order * pt.phase)
            : comp.amplitude * Math.cos(comp.order * pt.phase);
          const px = scaleX(pt.t);
          const py = scaleY(harmonicVal);

          if (i === 0) ctx.moveTo(px, py);
          else ctx.lineTo(px, py);
        }
        ctx.stroke();
        ctx.setLineDash([]);
      }
    }

    // 4. Target Ideal Waveform (Dashed soft coral/amber: #F59E7B)
    if (settings.showOriginal) {
      ctx.strokeStyle = '#F59E7B'; // soft coral/amber
      ctx.lineWidth = 1.8;
      ctx.setLineDash([5, 4]);
      ctx.beginPath();

      for (let i = 0; i < samples.length; i++) {
        const pt = samples[i];
        const px = scaleX(pt.t);
        const py = scaleY(pt.original);

        if (i > 0) {
          const prevPt = samples[i - 1];
          if (
            (settings.waveform === 'square' || settings.waveform === 'sawtooth') &&
            Math.abs(prevPt.original - pt.original) > settings.amplitude * 1.2
          ) {
            ctx.stroke();
            ctx.beginPath();
            ctx.moveTo(px, py);
            continue;
          }
        }

        if (i === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      }
      ctx.stroke();
      ctx.setLineDash([]);
    }

    // 5. Synthesized Fourier Approximation (Solid electric blue: #5B8CFF)
    if (settings.showApproximation) {
      ctx.strokeStyle = '#5B8CFF'; // electric blue
      ctx.lineWidth = 2.2;
      ctx.beginPath();

      for (let i = 0; i < samples.length; i++) {
        const pt = samples[i];
        const px = scaleX(pt.t);
        const py = scaleY(pt.approx);

        if (i === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      }
      ctx.stroke();
    }

    // 6. Gibbs Phenomenon Overshoot Highlight
    if (settings.showGibbsHighlight && (settings.waveform === 'square' || settings.waveform === 'sawtooth')) {
      const targetAmp = settings.amplitude;
      for (let i = 1; i < samples.length - 1; i++) {
        const curr = samples[i].approx;
        const prev = samples[i - 1].approx;
        const next = samples[i + 1].approx;

        if (curr > targetAmp * 1.02 && curr >= prev && curr >= next) {
          const px = scaleX(samples[i].t);
          const py = scaleY(curr);

          ctx.beginPath();
          ctx.fillStyle = '#EF4444';
          ctx.arc(px, py, 3.5, 0, 2 * Math.PI);
          ctx.fill();

          if (px < margin.left + plotWidth * 0.45 && px > margin.left + 25) {
            ctx.fillStyle = '#F87171';
            ctx.font = '500 10px Inter, sans-serif';
            ctx.textAlign = 'center';
            ctx.fillText(`+${((curr - targetAmp) / targetAmp * 100).toFixed(1)}% Gibbs`, px, py - 8);
          }
        }
      }
    }

    // 7. Interactive Crosshair Hover
    if (hoverIndex !== null && hoverIndex >= 0 && hoverIndex < samples.length) {
      const pt = samples[hoverIndex];
      const px = scaleX(pt.t);
      const pyOrig = scaleY(pt.original);
      const pyApprox = scaleY(pt.approx);

      ctx.strokeStyle = '#64748B';
      ctx.lineWidth = 0.8;
      ctx.setLineDash([3, 3]);
      ctx.beginPath();
      ctx.moveTo(px, margin.top);
      ctx.lineTo(px, margin.top + plotHeight);
      ctx.stroke();
      ctx.setLineDash([]);

      if (settings.showOriginal) {
        ctx.fillStyle = '#F59E7B';
        ctx.beginPath();
        ctx.arc(px, pyOrig, 4, 0, 2 * Math.PI);
        ctx.fill();
        ctx.strokeStyle = '#0B1020';
        ctx.lineWidth = 1.5;
        ctx.stroke();
      }

      if (settings.showApproximation) {
        ctx.fillStyle = '#5B8CFF';
        ctx.beginPath();
        ctx.arc(px, pyApprox, 4, 0, 2 * Math.PI);
        ctx.fill();
        ctx.strokeStyle = '#0B1020';
        ctx.lineWidth = 1.5;
        ctx.stroke();
      }
    }

    // Axis Labels
    ctx.save();
    ctx.fillStyle = '#94A3B8';
    ctx.font = '11px Inter, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('Time t (seconds) · 2 full periods', margin.left + plotWidth / 2, height - 6);

    ctx.translate(14, margin.top + plotHeight / 2);
    ctx.rotate(-Math.PI / 2);
    ctx.fillText('Amplitude (V)', 0, 0);
    ctx.restore();

    ctx.restore();
  }, [samples, settings, metrics, harmonicComponents, hoverIndex]);

  useEffect(() => {
    renderChart();
    const handleResize = () => renderChart();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [renderChart]);

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas || samples.length === 0) return;

    const rect = canvas.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const margin = { left: 50, right: 24 };
    const plotWidth = rect.width - margin.left - margin.right;

    if (mouseX >= margin.left && mouseX <= margin.left + plotWidth) {
      const ratio = (mouseX - margin.left) / plotWidth;
      const idx = Math.min(samples.length - 1, Math.max(0, Math.floor(ratio * samples.length)));
      setHoverIndex(idx);
    } else {
      setHoverIndex(null);
    }
  };

  const handleMouseLeave = () => {
    setHoverIndex(null);
  };

  const hoveredSample = hoverIndex !== null && samples[hoverIndex] ? samples[hoverIndex] : null;

  return (
    <div className="bg-[#111827] rounded-lg border border-[#263247] shadow-sm overflow-hidden flex flex-col">
      {/* Chart Header Bar */}
      <div className="px-5 py-3.5 border-b border-[#1E293B] flex flex-wrap items-center justify-between gap-3">
        <div>
          <h3 className="text-sm font-semibold text-[#F1F5F9] tracking-tight">
            Original signal vs. Fourier approximation
          </h3>
          <p className="text-xs text-[#94A3B8] mt-0.5">
            Two periods displayed · 0 to {(2 * metrics.period).toFixed(3)} seconds ({samples.length} sampled points)
          </p>
        </div>

        {/* Clean Export Action Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => exportGraphAsPNG(canvasRef.current, settings, metrics)}
            type="button"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-md border border-[#263247] bg-[#151D2E] hover:bg-[#1C263B] text-[#F1F5F9] transition-colors cursor-pointer"
            title="Export high-resolution graph as PNG"
          >
            <Download className="w-3.5 h-3.5 text-[#94A3B8]" />
            <span>Export PNG</span>
          </button>

          <button
            onClick={() => exportDataAsCSV(samples, settings, metrics)}
            type="button"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-md border border-[#263247] bg-[#151D2E] hover:bg-[#1C263B] text-[#F1F5F9] transition-colors cursor-pointer"
            title="Download sampled waveform values as CSV"
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-[#94A3B8]" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* Main Canvas Plot Area */}
      <div ref={containerRef} className="relative w-full p-2 bg-[#111827] flex-1 select-none">
        <canvas
          ref={canvasRef}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          className="cursor-crosshair w-full block rounded"
        />
      </div>

      {/* Status & Hover Inspection Strip */}
      <div className="px-5 py-2.5 bg-[#151D2E] border-t border-[#1E293B] flex flex-wrap items-center justify-between gap-3 text-xs">
        {/* Dynamic Coordinate Readout */}
        <div className="flex items-center gap-3 text-[#94A3B8]">
          {hoveredSample ? (
            <div className="flex flex-wrap items-center gap-3 text-xs">
              <span>Time: <strong className="font-mono text-[#F1F5F9]">{hoveredSample.t.toFixed(4)}s</strong></span>
              <span className="text-[#334155]">·</span>
              <span className="text-[#F59E7B]">Target: <strong className="font-mono">{hoveredSample.original.toFixed(4)}V</strong></span>
              <span className="text-[#334155]">·</span>
              <span className="text-[#5B8CFF]">Fourier sum: <strong className="font-mono">{hoveredSample.approx.toFixed(4)}V</strong></span>
              <span className="text-[#334155]">·</span>
              <span className="text-[#94A3B8]">Residual error: <strong className="font-mono text-[#F1F5F9]">{hoveredSample.error.toFixed(4)}V</strong></span>
            </div>
          ) : (
            <span className="text-[#64748B] flex items-center gap-1.5 text-xs">
              <Crosshair className="w-3.5 h-3.5 text-[#64748B]" />
              Hover cursor over graph to inspect instantaneous values
            </span>
          )}
        </div>

        {/* Legend Swatches */}
        <div className="flex items-center gap-4 text-xs font-normal">
          <span className="flex items-center gap-1.5 text-[#F59E7B]">
            <span className="w-3.5 h-0.5 bg-[#F59E7B] border-t border-dashed inline-block" />
            Target f(t)
          </span>
          <span className="flex items-center gap-1.5 text-[#5B8CFF] font-medium">
            <span className="w-3.5 h-0.5 bg-[#5B8CFF] inline-block" />
            Fourier S_{settings.harmonicsCount}(t)
          </span>
        </div>
      </div>
    </div>
  );
};
