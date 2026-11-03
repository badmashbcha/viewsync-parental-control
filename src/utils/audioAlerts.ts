/**
 * Web Audio API synthesizer for attention alerts, bells, and chimes.
 * Requires no external audio assets; runs natively in any modern browser.
 */

class SoundEffectsManager {
  private ctx: AudioContext | null = null;

  private getContext(): AudioContext | null {
    if (typeof window === 'undefined') return null;
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    return this.ctx;
  }

  playChime() {
    const ctx = this.getContext();
    if (!ctx) return;
    const now = ctx.currentTime;

    // Harmonic two-tone doorbell chime (E5 -> C5)
    const tones = [
      { freq: 659.25, start: 0, dur: 0.7 }, // E5
      { freq: 523.25, start: 0.35, dur: 1.0 }, // C5
    ];

    tones.forEach((tone) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(tone.freq, now + tone.start);

      gain.gain.setValueAtTime(0, now + tone.start);
      gain.gain.linearRampToValueAtTime(0.3, now + tone.start + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.001, now + tone.start + tone.dur);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now + tone.start);
      osc.stop(now + tone.start + tone.dur);
    });
  }

  playBell() {
    const ctx = this.getContext();
    if (!ctx) return;
    const now = ctx.currentTime;

    // Rich metallic bell sound with harmonic overtones
    const freqs = [880, 1760, 2640, 3520];
    freqs.forEach((f, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(f, now);

      const amp = 0.25 / (i + 1);
      gain.gain.setValueAtTime(amp, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 1.2 - i * 0.15);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 1.5);
    });
  }

  playUrgentAlert() {
    const ctx = this.getContext();
    if (!ctx) return;
    const now = ctx.currentTime;

    // Alternating attention sirens (800Hz / 1000Hz)
    const beeps = [0, 0.2, 0.4];
    beeps.forEach((start, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'square';
      osc.frequency.setValueAtTime(idx % 2 === 0 ? 880 : 1100, now + start);

      gain.gain.setValueAtTime(0.2, now + start);
      gain.gain.exponentialRampToValueAtTime(0.01, now + start + 0.15);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now + start);
      osc.stop(now + start + 0.16);
    });
  }

  playPingSound() {
    const ctx = this.getContext();
    if (!ctx) return;
    const now = ctx.currentTime;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(1200, now);
    osc.frequency.exponentialRampToValueAtTime(600, now + 0.15);

    gain.gain.setValueAtTime(0.15, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.16);
  }
}

export const soundFx = new SoundEffectsManager();
