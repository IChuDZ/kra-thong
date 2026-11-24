/**
 * Web Audio API Soundscape & Procedural Synthesizer
 * Zero external audio files required — lightweight and instant!
 */

class SoundEngine {
  constructor() {
    this.ctx = null;
    this.isMuted = true;
    this.waterNode = null;
    this.waterGain = null;
    this.chimeTimer = null;
  }

  init() {
    if (this.ctx) return;
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      this.ctx = new AudioCtx();
    } catch (e) {
      console.warn('Web Audio not supported', e);
    }
  }

  toggleMute() {
    this.init();
    if (!this.ctx) return false;

    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }

    this.isMuted = !this.isMuted;
    if (this.isMuted) {
      this.stopAmbient();
    } else {
      this.startAmbient();
      this.playChime(523.25); // C5 welcome chime
    }
    return !this.isMuted;
  }

  /**
   * Procedural River Water Ambient Sound
   */
  startAmbient() {
    if (this.isMuted || !this.ctx || this.waterNode) return;

    // Buffer for filtered pink noise (water stream)
    const bufferSize = this.ctx.sampleRate * 2;
    const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    let b0 = 0, b1 = 0, b2 = 0;

    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      b0 = 0.99 * b0 + white * 0.05;
      b1 = 0.95 * b1 + white * 0.1;
      b2 = 0.85 * b2 + white * 0.2;
      output[i] = (b0 + b1 + b2) * 0.15;
    }

    const whiteNoise = this.ctx.createBufferSource();
    whiteNoise.buffer = noiseBuffer;
    whiteNoise.loop = true;

    // Gentle lowpass filter with slow sweeping LFO
    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(450, this.ctx.currentTime);

    // LFO for river waves
    const lfo = this.ctx.createOscillator();
    lfo.frequency.setValueAtTime(0.25, this.ctx.currentTime);
    const lfoGain = this.ctx.createGain();
    lfoGain.gain.setValueAtTime(150, this.ctx.currentTime);
    lfo.connect(lfoGain);
    lfoGain.connect(filter.frequency);
    lfo.start();

    this.waterGain = this.ctx.createGain();
    this.waterGain.gain.setValueAtTime(0.08, this.ctx.currentTime);

    whiteNoise.connect(filter);
    filter.connect(this.waterGain);
    this.waterGain.connect(this.ctx.destination);
    whiteNoise.start();

    this.waterNode = whiteNoise;

    // Occasional subtle Thai bell chime in the background
    this._scheduleRandomChime();
  }

  stopAmbient() {
    if (this.waterNode) {
      try {
        this.waterNode.stop();
        this.waterNode.disconnect();
      } catch (e) {}
      this.waterNode = null;
    }
    if (this.chimeTimer) {
      clearTimeout(this.chimeTimer);
      this.chimeTimer = null;
    }
  }

  _scheduleRandomChime() {
    if (this.isMuted) return;
    const delays = [8000, 12000, 16000];
    const notes = [523.25, 587.33, 659.25, 783.99, 880.00]; // Pentatonic C, D, E, G, A
    const nextDelay = delays[Math.floor(Math.random() * delays.length)];

    this.chimeTimer = setTimeout(() => {
      if (!this.isMuted) {
        const note = notes[Math.floor(Math.random() * notes.length)];
        this.playChime(note, 0.05);
        this._scheduleRandomChime();
      }
    }, nextDelay);
  }

  /**
   * Resonant Bell / Thai Chime
   */
  playChime(freq = 587.33, volume = 0.15) {
    if (this.isMuted || !this.ctx) return;
    const now = this.ctx.currentTime;

    const osc = this.ctx.createOscillator();
    const oscHarmonic = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, now);

    oscHarmonic.type = 'triangle';
    oscHarmonic.frequency.setValueAtTime(freq * 2.76, now); // Bell overtone

    gain.gain.setValueAtTime(volume, now);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 2.5);

    osc.connect(gain);
    oscHarmonic.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    oscHarmonic.start(now);
    osc.stop(now + 2.5);
    oscHarmonic.stop(now + 2.5);
  }

  /**
   * Sound when placing an item on Krathong
   */
  playPlace() {
    if (this.isMuted || !this.ctx) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(320, now);
    osc.frequency.exponentialRampToValueAtTime(540, now + 0.08);

    gain.gain.setValueAtTime(0.12, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);

    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(now);
    osc.stop(now + 0.12);
  }

  /**
   * Sound when striking match / holding
   */
  playMatchStrike() {
    if (this.isMuted || !this.ctx) return;
    const now = this.ctx.currentTime;
    const bufferSize = this.ctx.sampleRate * 0.15;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.3));
    }

    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;
    const filter = this.ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(1400, now);
    filter.Q.setValueAtTime(2, now);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.2, now);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.ctx.destination);
    noise.start(now);
  }

  /**
   * Sound when candle ignites with gentle flame whoosh
   */
  playFlameIgnite() {
    if (this.isMuted || !this.ctx) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(120, now);
    osc.frequency.exponentialRampToValueAtTime(380, now + 0.4);

    gain.gain.setValueAtTime(0.25, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.6);

    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(now);
    osc.stop(now + 0.6);

    // Follow with warm chord
    setTimeout(() => {
      this.playChime(659.25, 0.2); // E5
      setTimeout(() => this.playChime(783.99, 0.2), 150); // G5
    }, 250);
  }

  /**
   * Water Ripple Splash
   */
  playSplash() {
    if (this.isMuted || !this.ctx) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(450, now);
    osc.frequency.exponentialRampToValueAtTime(160, now + 0.25);

    gain.gain.setValueAtTime(0.12, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);

    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(now);
    osc.stop(now + 0.25);
  }

  /**
   * Firework launch & explosion
   */
  playFirework() {
    if (this.isMuted || !this.ctx) return;
    const now = this.ctx.currentTime;

    // Whistle launch
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(300, now);
    osc.frequency.exponentialRampToValueAtTime(1200, now + 0.4);
    gain.gain.setValueAtTime(0.08, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.4);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(now);
    osc.stop(now + 0.4);

    // Boom
    setTimeout(() => {
      if (this.isMuted || !this.ctx) return;
      const boomNow = this.ctx.currentTime;
      const boomOsc = this.ctx.createOscillator();
      const boomGain = this.ctx.createGain();
      boomOsc.type = 'triangle';
      boomOsc.frequency.setValueAtTime(110, boomNow);
      boomOsc.frequency.exponentialRampToValueAtTime(35, boomNow + 0.5);
      boomGain.gain.setValueAtTime(0.25, boomNow);
      boomGain.gain.exponentialRampToValueAtTime(0.001, boomNow + 0.5);
      boomOsc.connect(boomGain);
      boomGain.connect(this.ctx.destination);
      boomOsc.start(boomNow);
      boomOsc.stop(boomNow + 0.5);
    }, 400);
  }
}

export const AudioFX = new SoundEngine();
