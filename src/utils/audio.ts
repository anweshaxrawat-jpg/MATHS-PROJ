/**
 * Web Audio API synthesizer for listening to Fourier harmonic synthesis.
 * Uses createPeriodicWave with the exact Fourier coefficients.
 */

import { WaveformType, CustomHarmonicConfig } from '../types/fourier';

class FourierSynthesizer {
  private ctx: AudioContext | null = null;
  private osc: OscillatorNode | null = null;
  private gainNode: GainNode | null = null;
  private isPlaying: boolean = false;
  private currentFreq: number = 220; // Default pleasant A3 audible tone

  private initContext() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public start(
    waveform: WaveformType,
    harmonicsCount: number,
    customConfig: CustomHarmonicConfig,
    baseAudiblePitch: number = 220 // 220Hz (A3) makes harmonic overtone differences clearly audible
  ) {
    try {
      this.initContext();
      if (!this.ctx) return;

      this.currentFreq = baseAudiblePitch;

      if (!this.gainNode) {
        this.gainNode = this.ctx.createGain();
        this.gainNode.gain.setValueAtTime(0.12, this.ctx.currentTime); // Safe pleasant volume
        this.gainNode.connect(this.ctx.destination);
      }

      if (this.osc) {
        this.osc.stop();
        this.osc.disconnect();
      }

      const periodicWave = this.buildPeriodicWave(waveform, harmonicsCount, customConfig);
      this.osc = this.ctx.createOscillator();
      this.osc.setPeriodicWave(periodicWave);
      this.osc.frequency.setValueAtTime(this.currentFreq, this.ctx.currentTime);
      this.osc.connect(this.gainNode);
      this.osc.start();
      this.isPlaying = true;
    } catch (e) {
      console.warn('Audio playback not supported or blocked:', e);
    }
  }

  public update(
    waveform: WaveformType,
    harmonicsCount: number,
    customConfig: CustomHarmonicConfig
  ) {
    if (!this.isPlaying || !this.ctx || !this.osc) return;
    try {
      const periodicWave = this.buildPeriodicWave(waveform, harmonicsCount, customConfig);
      this.osc.setPeriodicWave(periodicWave);
    } catch (e) {
      console.warn('Failed to update periodic wave:', e);
    }
  }

  public stop() {
    if (this.osc) {
      try {
        this.osc.stop();
        this.osc.disconnect();
      } catch {
        // ignore
      }
      this.osc = null;
    }
    this.isPlaying = false;
  }

  public toggle(
    waveform: WaveformType,
    harmonicsCount: number,
    customConfig: CustomHarmonicConfig,
    baseAudiblePitch: number = 220
  ): boolean {
    if (this.isPlaying) {
      this.stop();
      return false;
    } else {
      this.start(waveform, harmonicsCount, customConfig, baseAudiblePitch);
      return true;
    }
  }

  public getIsPlaying(): boolean {
    return this.isPlaying;
  }

  private buildPeriodicWave(
    waveform: WaveformType,
    harmonicsCount: number,
    customConfig: CustomHarmonicConfig
  ): PeriodicWave {
    if (!this.ctx) throw new Error('No audio context');

    const maxOrder = Math.max(64, harmonicsCount * 2 + 2);
    const real = new Float32Array(maxOrder);
    const imag = new Float32Array(maxOrder);

    // In Web Audio PeriodicWave:
    // real[n] corresponds to cos(n*omega*t)
    // imag[n] corresponds to sin(n*omega*t)

    const N = Math.max(1, Math.min(50, Math.floor(harmonicsCount)));

    switch (waveform) {
      case 'square': {
        for (let k = 0; k < N; k++) {
          const n = 2 * k + 1;
          if (n < maxOrder) {
            imag[n] = 4 / (Math.PI * n);
          }
        }
        break;
      }

      case 'sawtooth': {
        for (let n = 1; n <= N; n++) {
          if (n < maxOrder) {
            const sign = (n + 1) % 2 === 0 ? 1 : -1;
            imag[n] = (sign * 2) / (Math.PI * n);
          }
        }
        break;
      }

      case 'triangle': {
        for (let k = 0; k < N; k++) {
          const n = 2 * k + 1;
          if (n < maxOrder) {
            const sign = k % 2 === 0 ? 1 : -1;
            imag[n] = (sign * 8) / (Math.PI * Math.PI * n * n);
          }
        }
        break;
      }

      case 'custom': {
        if (1 < maxOrder) {
          real[1] = customConfig.a1;
          imag[1] = customConfig.b1;
        }
        if (N >= 2 && 2 < maxOrder) {
          imag[2] = customConfig.b2;
        }
        if (N >= 3 && 3 < maxOrder) {
          imag[3] = customConfig.b3;
        }
        break;
      }
    }

    return this.ctx.createPeriodicWave(real, imag, { disableNormalization: false });
  }
}

export const fourierSynth = new FourierSynthesizer();
