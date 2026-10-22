/**
 * Export utilities for downloading CSV data and PNG chart images
 */

import { SamplePoint, SimulationSettings, MetricsData } from '../types/fourier';

/**
 * Exports sampled waveform data as a downloadable CSV file
 */
export function exportDataAsCSV(
  samples: SamplePoint[],
  settings: SimulationSettings,
  metrics: MetricsData
) {
  const headers = ['Time_Seconds', 'Normalized_Phase_Rad', 'Original_Signal', 'Fourier_Approximation', 'Residual_Error'];
  const rows = samples.map((s) => [
    s.t.toFixed(6),
    s.phase.toFixed(6),
    s.original.toFixed(6),
    s.approx.toFixed(6),
    s.error.toFixed(6),
  ]);

  const metadataRows = [
    `# Fourier Series Wave Generator Data Export`,
    `# Waveform: ${settings.waveform.toUpperCase()}`,
    `# Fundamental Frequency (f0): ${settings.fundamentalFreq} Hz`,
    `# Period (T): ${metrics.period.toFixed(4)} s`,
    `# Amplitude (A): ${settings.amplitude}`,
    `# Included Harmonics: ${settings.harmonicsCount}`,
    `# Highest Harmonic Order: ${metrics.maxOrder}`,
    `# Normalized RMSE (NRMSE): ${metrics.nrmse.toFixed(5)}`,
    `# Generated at: ${new Date().toISOString()}`,
    `#`,
  ];

  const csvContent = [...metadataRows, headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);

  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `fourier_${settings.waveform}_N${settings.harmonicsCount}_data.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Exports the HTML5 canvas as a high-resolution PNG image with a branded scientific header,
 * legend, and simulation parameters.
 */
export function exportGraphAsPNG(
  sourceCanvas: HTMLCanvasElement | null,
  settings: SimulationSettings,
  metrics: MetricsData
) {
  if (!sourceCanvas) return;

  // Create an offscreen canvas with extra header and footer margins
  const exportCanvas = document.createElement('canvas');
  const dpr = 2; // high-res
  const width = 1200;
  const headerHeight = 100;
  const footerHeight = 70;
  const graphHeight = 600;
  const totalHeight = headerHeight + graphHeight + footerHeight;

  exportCanvas.width = width * dpr;
  exportCanvas.height = totalHeight * dpr;

  const ctx = exportCanvas.getContext('2d');
  if (!ctx) return;

  ctx.scale(dpr, dpr);

  // Background
  ctx.fillStyle = '#0B1020';
  ctx.fillRect(0, 0, width, totalHeight);

  // Header banner
  ctx.fillStyle = '#F1F5F9'; // soft white
  ctx.font = '600 22px Inter, system-ui, sans-serif';
  ctx.fillText('Fourier Lab — Fourier Series Synthesis', 40, 44);

  ctx.fillStyle = '#94A3B8'; // muted blue-grey
  ctx.font = '13px Inter, system-ui, sans-serif';
  ctx.fillText(
    `Waveform: ${settings.waveform}  |  Harmonics: N = ${settings.harmonicsCount} (max order n = ${metrics.maxOrder})  |  f₀ = ${settings.fundamentalFreq} Hz (T = ${metrics.period.toFixed(3)}s)  |  Amplitude: ±${settings.amplitude.toFixed(2)} V`,
    40,
    72
  );

  // Header separator line
  ctx.strokeStyle = '#263247';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(40, 88);
  ctx.lineTo(width - 40, 88);
  ctx.stroke();

  // Draw main waveform graph from source canvas
  ctx.drawImage(sourceCanvas, 40, headerHeight, width - 80, graphHeight);

  // Footer info & legend
  ctx.fillStyle = '#111827';
  ctx.fillRect(40, headerHeight + graphHeight + 10, width - 80, 45);
  ctx.strokeStyle = '#263247';
  ctx.strokeRect(40, headerHeight + graphHeight + 10, width - 80, 45);

  // Legend items in footer
  let legendX = 60;
  const legendY = headerHeight + graphHeight + 35;

  // Target Waveform swatch (soft coral)
  ctx.strokeStyle = '#F59E7B'; // soft coral
  ctx.lineWidth = 2.5;
  ctx.setLineDash([6, 4]);
  ctx.beginPath();
  ctx.moveTo(legendX, legendY);
  ctx.lineTo(legendX + 24, legendY);
  ctx.stroke();
  ctx.setLineDash([]);
  ctx.fillStyle = '#F1F5F9';
  ctx.font = '500 13px Inter, system-ui, sans-serif';
  ctx.fillText('Target signal f(t)', legendX + 32, legendY + 4);

  legendX += 190;
  // Fourier Approx swatch (electric blue)
  ctx.strokeStyle = '#5B8CFF'; // electric blue
  ctx.lineWidth = 2.5;
  ctx.beginPath();
  ctx.moveTo(legendX, legendY);
  ctx.lineTo(legendX + 24, legendY);
  ctx.stroke();
  ctx.fillStyle = '#F1F5F9';
  ctx.fillText(`Fourier sum S_${settings.harmonicsCount}(t)`, legendX + 32, legendY + 4);

  legendX += 230;
  // Metrics summary
  ctx.fillStyle = '#5B8CFF';
  ctx.font = '600 13px JetBrains Mono, monospace';
  ctx.fillText(
    `NRMSE: ${metrics.nrmse.toFixed(4)}  |  Max Error: ${metrics.maxError.toFixed(4)}${
      metrics.peakOvershootPct > 0 ? `  |  Gibbs Overshoot: +${metrics.peakOvershootPct.toFixed(1)}%` : ''
    }`,
    legendX,
    legendY + 4
  );

  // Trigger download
  const imageURI = exportCanvas.toDataURL('image/png');
  const link = document.createElement('a');
  link.download = `fourier_${settings.waveform}_N${settings.harmonicsCount}_plot.png`;
  link.href = imageURI;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
