/* ------------------------------------------------------------------ */
/*  TABLOOM — procedural audio engine (Web Audio, zero assets)         */
/*  rain on glass · branch drones · graft chimes · static bursts       */
/* ------------------------------------------------------------------ */

import type { BranchId } from "./types";

class AudioEngine {
  private ctx: AudioContext | null = null;
  private master: GainNode | null = null;
  private rainGain: GainNode | null = null;
  private windGain: GainNode | null = null;
  private droneGain: GainNode | null = null;
  private droneOscs: OscillatorNode[] = [];
  private started = false;
  private muted = false;
  private plinkTimer: number | null = null;

  private ensure(): AudioContext | null {
    if (this.ctx) return this.ctx;
    try {
      const AC = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AC();
      this.master = this.ctx.createGain();
      this.master.gain.value = this.muted ? 0 : 0.6;
      this.master.connect(this.ctx.destination);
    } catch {
      this.ctx = null;
    }
    return this.ctx;
  }

  start() {
    const ctx = this.ensure();
    if (!ctx || this.started) return;
    if (ctx.state === "suspended") void ctx.resume();
    this.started = true;
    this.buildDrone();
    this.schedulePlinks();
  }

  private noiseBuffer(seconds = 2): AudioBuffer | null {
    const ctx = this.ctx;
    if (!ctx) return null;
    const buf = ctx.createBuffer(1, ctx.sampleRate * seconds, ctx.sampleRate);
    const data = buf.getChannelData(0);
    for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1;
    return buf;
  }

  private buildDrone() {
    const ctx = this.ctx;
    if (!ctx || !this.master) return;

    // deep twin-osc drone (slowly beating)
    this.droneGain = ctx.createGain();
    this.droneGain.gain.value = 0.05;
    const filter = ctx.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.value = 220;
    const lfo = ctx.createOscillator();
    lfo.frequency.value = 0.05;
    const lfoGain = ctx.createGain();
    lfoGain.gain.value = 90;
    lfo.connect(lfoGain).connect(filter.frequency);
    lfo.start();

    [55, 55.4, 110.2].forEach((f, i) => {
      const o = ctx.createOscillator();
      o.type = i === 2 ? "triangle" : "sine";
      o.frequency.value = f;
      const g = ctx.createGain();
      g.gain.value = i === 2 ? 0.25 : 1;
      o.connect(g).connect(filter);
      o.start();
      this.droneOscs.push(o);
    });
    filter.connect(this.droneGain).connect(this.master);
  }

  setBranch(branch: BranchId) {
    const ctx = this.ctx;
    if (!ctx || !this.master || !this.started) return;
    const t = ctx.currentTime;

    // RAIN (nara) — bandpassed noise, soft
    if (branch === "nara" && !this.rainGain) {
      const src = ctx.createBufferSource();
      src.buffer = this.noiseBuffer();
      src.loop = true;
      const bp = ctx.createBiquadFilter();
      bp.type = "bandpass";
      bp.frequency.value = 1900;
      bp.Q.value = 0.55;
      const lp = ctx.createBiquadFilter();
      lp.type = "lowpass";
      lp.frequency.value = 4200;
      this.rainGain = ctx.createGain();
      this.rainGain.gain.value = 0;
      this.rainGain.gain.linearRampToValueAtTime(0.065, t + 2.5);
      src.connect(bp).connect(lp).connect(this.rainGain).connect(this.master);
      src.start();
    } else if (this.rainGain && branch !== "nara") {
      this.rainGain.gain.linearRampToValueAtTime(0.0001, t + 1.5);
      const g = this.rainGain;
      window.setTimeout(() => g.disconnect(), 2000);
      this.rainGain = null;
    }

    // WIND (karth) — howling low noise
    if (branch === "karth" && !this.windGain) {
      const src = ctx.createBufferSource();
      src.buffer = this.noiseBuffer();
      src.loop = true;
      const lp = ctx.createBiquadFilter();
      lp.type = "lowpass";
      lp.frequency.value = 320;
      const lfo = ctx.createOscillator();
      lfo.frequency.value = 0.13;
      const lg = ctx.createGain();
      lg.gain.value = 190;
      lfo.connect(lg).connect(lp.frequency);
      lfo.start();
      this.windGain = ctx.createGain();
      this.windGain.gain.value = 0;
      this.windGain.gain.linearRampToValueAtTime(0.075, t + 3);
      src.connect(lp).connect(this.windGain).connect(this.master);
      src.start();
    } else if (this.windGain && branch !== "karth") {
      this.windGain.gain.linearRampToValueAtTime(0.0001, t + 1.5);
      const g = this.windGain;
      window.setTimeout(() => g.disconnect(), 2000);
      this.windGain = null;
    }

    // drone pitch shifts slightly per branch
    const targets: Record<BranchId, number[]> = {
      nara: [55, 55.4, 110.2],
      karth: [49, 49.3, 98.1],
      void: [41.2, 41.6, 82.4],
    };
    this.droneOscs.forEach((o, i) => {
      o.frequency.linearRampToValueAtTime(targets[branch][i] ?? 55, t + 3);
    });
  }

  private schedulePlinks() {
    const tick = () => {
      if (this.rainGain && !this.muted) this.plink();
      this.plinkTimer = window.setTimeout(tick, 2600 + Math.random() * 4500);
    };
    this.plinkTimer = window.setTimeout(tick, 2200);
  }

  private plink() {
    const ctx = this.ctx;
    if (!ctx || !this.master) return;
    const t = ctx.currentTime;
    const o = ctx.createOscillator();
    o.type = "sine";
    o.frequency.value = 640 + Math.random() * 720;
    const g = ctx.createGain();
    g.gain.setValueAtTime(0.035, t);
    g.gain.exponentialRampToValueAtTime(0.0001, t + 0.32);
    o.connect(g).connect(this.master);
    o.start(t);
    o.stop(t + 0.4);
  }

  /** soft key blip while text types */
  type() {
    const ctx = this.ctx;
    if (!ctx || !this.master || this.muted || !this.started) return;
    const t = ctx.currentTime;
    const o = ctx.createOscillator();
    o.type = "sine";
    o.frequency.value = 1180 + Math.random() * 160;
    const g = ctx.createGain();
    g.gain.setValueAtTime(0.012, t);
    g.gain.exponentialRampToValueAtTime(0.0001, t + 0.045);
    o.connect(g).connect(this.master);
    o.start(t);
    o.stop(t + 0.06);
  }

  /** UI tick */
  ui(freq = 740) {
    const ctx = this.ctx;
    if (!ctx || !this.master || this.muted || !this.started) return;
    const t = ctx.currentTime;
    const o = ctx.createOscillator();
    o.type = "triangle";
    o.frequency.value = freq;
    const g = ctx.createGain();
    g.gain.setValueAtTime(0.04, t);
    g.gain.exponentialRampToValueAtTime(0.0001, t + 0.14);
    o.connect(g).connect(this.master);
    o.start(t);
    o.stop(t + 0.16);
  }

  /** graft success — soft root chime */
  chime() {
    const ctx = this.ctx;
    if (!ctx || !this.master || this.muted) return;
    const t = ctx.currentTime;
    [523.25, 659.25, 783.99].forEach((f, i) => {
      const o = ctx.createOscillator();
      o.type = "sine";
      o.frequency.value = f;
      const g = ctx.createGain();
      const at = t + i * 0.07;
      g.gain.setValueAtTime(0.0001, at);
      g.gain.exponentialRampToValueAtTime(0.06, at + 0.03);
      g.gain.exponentialRampToValueAtTime(0.0001, at + 0.9);
      o.connect(g).connect(this.master!);
      o.start(at);
      o.stop(at + 1);
    });
  }

  /** graft failure — the lock bites */
  thud() {
    const ctx = this.ctx;
    if (!ctx || !this.master || this.muted) return;
    const t = ctx.currentTime;
    const o = ctx.createOscillator();
    o.type = "sine";
    o.frequency.setValueAtTime(130, t);
    o.frequency.exponentialRampToValueAtTime(46, t + 0.22);
    const g = ctx.createGain();
    g.gain.setValueAtTime(0.16, t);
    g.gain.exponentialRampToValueAtTime(0.0001, t + 0.3);
    o.connect(g).connect(this.master);
    o.start(t);
    o.stop(t + 0.34);
  }

  /** bloom — memory lock opens */
  bloom() {
    const ctx = this.ctx;
    if (!ctx || !this.master || this.muted) return;
    const t = ctx.currentTime;
    [261.6, 329.6, 392, 523.25, 659.25].forEach((f, i) => {
      const o = ctx.createOscillator();
      o.type = "sine";
      o.frequency.value = f;
      const g = ctx.createGain();
      const at = t + i * 0.12;
      g.gain.setValueAtTime(0.0001, at);
      g.gain.exponentialRampToValueAtTime(0.07, at + 0.05);
      g.gain.exponentialRampToValueAtTime(0.0001, at + 1.6);
      o.connect(g).connect(this.master!);
      o.start(at);
      o.stop(at + 1.8);
    });
  }

  /** senn arrives — rising shimmer */
  shimmer() {
    const ctx = this.ctx;
    if (!ctx || !this.master || this.muted) return;
    const t = ctx.currentTime;
    const o = ctx.createOscillator();
    o.type = "sine";
    o.frequency.setValueAtTime(220, t);
    o.frequency.exponentialRampToValueAtTime(1480, t + 0.7);
    const g = ctx.createGain();
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(0.05, t + 0.14);
    g.gain.exponentialRampToValueAtTime(0.0001, t + 1.1);
    o.connect(g).connect(this.master);
    o.start(t);
    o.stop(t + 1.2);
    const src = ctx.createBufferSource();
    src.buffer = this.noiseBuffer();
    const hp = ctx.createBiquadFilter();
    hp.type = "highpass";
    hp.frequency.value = 5200;
    const ng = ctx.createGain();
    ng.gain.setValueAtTime(0.05, t);
    ng.gain.exponentialRampToValueAtTime(0.0001, t + 0.8);
    src.connect(hp).connect(ng).connect(this.master);
    src.start(t);
    src.stop(t + 0.85);
  }

  /** static burst / tab glitch */
  staticBurst(dur = 0.5) {
    const ctx = this.ctx;
    if (!ctx || !this.master || this.muted) return;
    const t = ctx.currentTime;
    const src = ctx.createBufferSource();
    src.buffer = this.noiseBuffer();
    const bp = ctx.createBiquadFilter();
    bp.type = "bandpass";
    bp.frequency.value = 2600;
    bp.Q.value = 0.4;
    const g = ctx.createGain();
    g.gain.setValueAtTime(0.11, t);
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    src.connect(bp).connect(g).connect(this.master);
    src.start(t);
    src.stop(t + dur + 0.05);
  }

  /** low heartbeat thump */
  heart() {
    const ctx = this.ctx;
    if (!ctx || !this.master || this.muted) return;
    const t = ctx.currentTime;
    [0, 0.18].forEach((off, i) => {
      const o = ctx.createOscillator();
      o.type = "sine";
      o.frequency.setValueAtTime(72, t + off);
      o.frequency.exponentialRampToValueAtTime(38, t + off + 0.14);
      const g = ctx.createGain();
      g.gain.setValueAtTime(i === 0 ? 0.14 : 0.09, t + off);
      g.gain.exponentialRampToValueAtTime(0.0001, t + off + 0.2);
      o.connect(g).connect(this.master!);
      o.start(t + off);
      o.stop(t + off + 0.24);
    });
  }

  setMuted(m: boolean) {
    this.muted = m;
    if (this.ctx && this.master) {
      this.master.gain.linearRampToValueAtTime(m ? 0 : 0.6, this.ctx.currentTime + 0.2);
    }
  }

  /** duck everything — for the beats of silence the story insists on */
  setDucked(d: boolean) {
    if (this.ctx && this.master) {
      const target = d ? 0.045 : this.muted ? 0 : 0.6;
      this.master.gain.cancelScheduledValues(this.ctx.currentTime);
      this.master.gain.linearRampToValueAtTime(target, this.ctx.currentTime + 0.9);
    }
  }

  get isMuted() {
    return this.muted;
  }

  get isStarted() {
    return this.started;
  }

  dispose() {
    if (this.plinkTimer) window.clearTimeout(this.plinkTimer);
    void this.ctx?.close();
    this.ctx = null;
    this.started = false;
  }
}

export const audio = new AudioEngine();
