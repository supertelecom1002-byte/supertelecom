/**
 * FootstepBooster.ts
 * Pro-Esports Footstep Equalizer & Acoustic Booster
 * Uses Web Audio API BiquadFilterNode peaking at 3500Hz with +8dB gain and Q=2.0
 */

export class FootstepBoosterEngine {
  private static instance: FootstepBoosterEngine | null = null;
  private audioCtx: AudioContext | null = null;
  private filterNode: BiquadFilterNode | null = null;
  private gainNode: GainNode | null = null;
  private testOsc: OscillatorNode | null = null;
  private isRunning: boolean = false;

  private constructor() {}

  public static getInstance(): FootstepBoosterEngine {
    if (!FootstepBoosterEngine.instance) {
      FootstepBoosterEngine.instance = new FootstepBoosterEngine();
    }
    return FootstepBoosterEngine.instance;
  }

  public init(): boolean {
    if (typeof window === "undefined") return false;
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return false;

      if (!this.audioCtx || this.audioCtx.state === "closed") {
        this.audioCtx = new AudioCtx();
      }

      if (!this.filterNode && this.audioCtx) {
        this.filterNode = this.audioCtx.createBiquadFilter();
        this.filterNode.type = "peaking";
        this.filterNode.frequency.setValueAtTime(3500, this.audioCtx.currentTime);
        this.filterNode.Q.setValueAtTime(2.0, this.audioCtx.currentTime);
        this.filterNode.gain.setValueAtTime(8.0, this.audioCtx.currentTime);

        this.gainNode = this.audioCtx.createGain();
        this.gainNode.gain.setValueAtTime(1.0, this.audioCtx.currentTime);

        this.filterNode.connect(this.gainNode);
        this.gainNode.connect(this.audioCtx.destination);
      }
      return true;
    } catch {
      return false;
    }
  }

  public start(): boolean {
    if (!this.init()) return false;
    try {
      if (this.audioCtx && this.audioCtx.state === "suspended") {
        this.audioCtx.resume();
      }
      this.isRunning = true;
      return true;
    } catch {
      return false;
    }
  }

  public stop(): void {
    try {
      if (this.testOsc) {
        this.testOsc.stop();
        this.testOsc.disconnect();
        this.testOsc = null;
      }
      if (this.audioCtx && this.audioCtx.state === "running") {
        this.audioCtx.suspend().catch(() => {});
      }
    } catch {
      // ignore
    }
    this.isRunning = false;
  }

  /**
   * Plays a simulated high-tactile acoustic footstep/gravel sound wave through the 3.5kHz equalizer
   */
  public playFootstepTestPulse(): void {
    if (!this.init() || !this.audioCtx || !this.filterNode) return;

    try {
      if (this.audioCtx.state === "suspended") {
        this.audioCtx.resume();
      }

      // Generate burst noise passed through 3.5kHz peak
      const osc = this.audioCtx.createOscillator();
      const pulseGain = this.audioCtx.createGain();

      osc.type = "sine";
      osc.frequency.setValueAtTime(3500, this.audioCtx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(1800, this.audioCtx.currentTime + 0.12);

      pulseGain.gain.setValueAtTime(0, this.audioCtx.currentTime);
      pulseGain.gain.linearRampToValueAtTime(0.6, this.audioCtx.currentTime + 0.02);
      pulseGain.gain.exponentialRampToValueAtTime(0.001, this.audioCtx.currentTime + 0.15);

      osc.connect(this.filterNode);
      osc.connect(pulseGain);
      pulseGain.connect(this.audioCtx.destination);

      osc.start();
      osc.stop(this.audioCtx.currentTime + 0.15);
    } catch {
      // ignore
    }
  }

  public getIsRunning(): boolean {
    return this.isRunning;
  }
}

export const footstepBooster = FootstepBoosterEngine.getInstance();
