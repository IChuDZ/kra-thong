/**
 * Loy Krathong Co-op - Standalone Complete Bundle
 * Compatible with both file:/// local open and http:// web servers.
 */

// ============================================================================
// 1. SPRITES ENGINE
// ============================================================================
const SpriteEngine = {
  colors: {
    bananaRindDark: '#1b4332',
    bananaRindMid: '#2d6a4f',
    bananaFleshOuter: '#d8f3dc',
    bananaFleshInner: '#f0fdf4',
    breadDark: '#78350f',
    breadMid: '#b45309',
    breadLight: '#f59e0b',
    iceDark: '#0891b2',
    iceMid: '#22d3ee',
    iceLight: '#cffafe',
    leafDark: '#14532d',
    leafMid: '#16a34a',
    leafLight: '#86efac',
    leafGoldPin: '#fde047',
    lotusPinkDark: '#9d174d',
    lotusPinkMid: '#ec4899',
    lotusPinkLight: '#fbcfe8',
    lotusWhite: '#ffffff',
    marigoldDark: '#b45309',
    marigoldMid: '#f59e0b',
    marigoldLight: '#fef08a',
    orchidPurpleDark: '#581c87',
    orchidPurpleMid: '#a855f7',
    crownWhite: '#f8fafc',
    crownMid: '#cbd5e1',
    globePurple: '#9333ea',
    candleWaxYellow: '#fef08a',
    candleWaxMid: '#facc15',
    candleWick: '#451a03',
    flameInner: '#ffffff',
    flameMid: '#fde047',
    flameOuter: '#f97316',
    incenseStick: '#7c2d12',
    incenseTip: '#ef4444',
    coinGold: '#fbbf24',
    coinEdge: '#b45309'
  },

  drawBase(ctx, baseType, centerX, centerY, radius = 110) {
    ctx.save();
    ctx.translate(centerX, centerY);

    // Shadow
    ctx.beginPath();
    ctx.ellipse(0, 12, radius * 1.05, radius * 0.95, 0, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(2, 6, 23, 0.65)';
    ctx.fill();

    switch (baseType) {
      case 'bread': this._drawTurtleBread(ctx, radius); break;
      case 'ice': this._drawIceBase(ctx, radius); break;
      case 'lotus_leaf': this._drawLotusLeafBase(ctx, radius); break;
      case 'banana':
      default: this._drawBananaTrunk(ctx, radius); break;
    }
    ctx.restore();
  },

  _drawBananaTrunk(ctx, r) {
    ctx.beginPath();
    ctx.arc(0, 0, r, 0, Math.PI * 2);
    ctx.fillStyle = this.colors.bananaRindDark;
    ctx.fill();

    ctx.beginPath();
    ctx.arc(0, 0, r - 6, 0, Math.PI * 2);
    ctx.fillStyle = this.colors.bananaRindMid;
    ctx.fill();

    ctx.beginPath();
    ctx.arc(0, 0, r - 12, 0, Math.PI * 2);
    ctx.fillStyle = this.colors.bananaFleshOuter;
    ctx.fill();

    ctx.beginPath();
    ctx.arc(0, 0, r * 0.65, 0, Math.PI * 2);
    ctx.fillStyle = this.colors.bananaFleshInner;
    ctx.fill();

    ctx.beginPath();
    ctx.arc(0, 0, r * 0.28, 0, Math.PI * 2);
    ctx.fillStyle = '#fef9c3';
    ctx.fill();

    ctx.fillStyle = '#bbf7d0';
    for (let i = 0; i < 16; i++) {
      const angle = (i / 16) * Math.PI * 2;
      const dist = r * 0.45;
      ctx.fillRect(Math.cos(angle) * dist - 2, Math.sin(angle) * dist - 2, 4, 4);
    }
  },

  _drawTurtleBread(ctx, r) {
    const c = this.colors;
    const flippers = [
      { x: -r * 0.85, y: -r * 0.6, rx: 20, ry: 14, rot: -0.6 },
      { x: r * 0.85, y: -r * 0.6, rx: 20, ry: 14, rot: 0.6 },
      { x: -r * 0.75, y: r * 0.7, rx: 16, ry: 12, rot: 0.7 },
      { x: r * 0.75, y: r * 0.7, rx: 16, ry: 12, rot: -0.7 }
    ];
    flippers.forEach(f => {
      ctx.save();
      ctx.translate(f.x, f.y);
      ctx.rotate(f.rot);
      ctx.beginPath();
      ctx.ellipse(0, 0, f.rx, f.ry, 0, 0, Math.PI * 2);
      ctx.fillStyle = c.breadDark;
      ctx.fill();
      ctx.beginPath();
      ctx.ellipse(0, 0, f.rx - 3, f.ry - 3, 0, 0, Math.PI * 2);
      ctx.fillStyle = c.breadMid;
      ctx.fill();
      ctx.restore();
    });

    ctx.beginPath();
    ctx.ellipse(0, -r * 1.05, 24, 28, 0, 0, Math.PI * 2);
    ctx.fillStyle = c.breadMid;
    ctx.fill();
    ctx.beginPath();
    ctx.ellipse(0, -r * 1.05 - 4, 16, 18, 0, 0, Math.PI * 2);
    ctx.fillStyle = c.breadLight;
    ctx.fill();
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(-8, -r * 1.05 - 6, 3, 3);
    ctx.fillRect(5, -r * 1.05 - 6, 3, 3);

    ctx.beginPath();
    ctx.arc(0, 0, r * 0.95, 0, Math.PI * 2);
    ctx.fillStyle = c.breadDark;
    ctx.fill();
    ctx.beginPath();
    ctx.arc(0, 0, r * 0.9, 0, Math.PI * 2);
    ctx.fillStyle = c.breadMid;
    ctx.fill();

    ctx.strokeStyle = c.breadDark;
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.arc(0, 0, r * 0.5, 0, Math.PI * 2);
    ctx.stroke();

    for (let i = 0; i < 6; i++) {
      const angle = (i / 6) * Math.PI * 2;
      ctx.beginPath();
      ctx.moveTo(Math.cos(angle) * (r * 0.5), Math.sin(angle) * (r * 0.5));
      ctx.lineTo(Math.cos(angle) * (r * 0.9), Math.sin(angle) * (r * 0.9));
      ctx.stroke();
    }
  },

  _drawIceBase(ctx, r) {
    const c = this.colors;
    ctx.beginPath();
    ctx.arc(0, 0, r, 0, Math.PI * 2);
    ctx.fillStyle = c.iceDark;
    ctx.fill();
    ctx.beginPath();
    ctx.arc(0, 0, r - 6, 0, Math.PI * 2);
    ctx.fillStyle = c.iceMid;
    ctx.fill();
    ctx.beginPath();
    ctx.arc(0, 0, r - 14, 0, Math.PI * 2);
    ctx.fillStyle = c.iceLight;
    ctx.fill();

    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 2;
    ctx.beginPath();
    for (let i = 0; i < 8; i++) {
      const angle = (i / 8) * Math.PI * 2;
      ctx.moveTo(Math.cos(angle) * (r * 0.3), Math.sin(angle) * (r * 0.3));
      ctx.lineTo(Math.cos(angle + 0.4) * (r * 0.85), Math.sin(angle + 0.4) * (r * 0.85));
    }
    ctx.stroke();
  },

  _drawLotusLeafBase(ctx, r) {
    ctx.beginPath();
    for (let i = 0; i <= 32; i++) {
      const angle = (i / 32) * Math.PI * 2;
      const wave = Math.sin(i * 1.5) * 4;
      const curR = r + wave;
      const x = Math.cos(angle) * curR;
      const y = Math.sin(angle) * curR;
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.closePath();
    ctx.fillStyle = '#14532d';
    ctx.fill();

    ctx.beginPath();
    ctx.arc(0, 0, r - 8, 0, Math.PI * 2);
    ctx.fillStyle = '#16a34a';
    ctx.fill();

    ctx.strokeStyle = '#86efac';
    ctx.lineWidth = 2;
    for (let i = 0; i < 12; i++) {
      const angle = (i / 12) * Math.PI * 2;
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(Math.cos(angle) * (r - 10), Math.sin(angle) * (r - 10));
      ctx.stroke();
    }
  },

  drawItem(ctx, item, isLit = false) {
    ctx.save();
    ctx.translate(item.x, item.y);
    if (item.rotation) ctx.rotate(item.rotation);
    if (item.scale) ctx.scale(item.scale, item.scale);

    switch (item.type) {
      case 'petal_folded': this._drawFoldedLeaf(ctx); break;
      case 'petal_rose': this._drawRoseLeaf(ctx); break;
      case 'petal_lotus_pink': this._drawLotusPetal(ctx); break;
      case 'flower_marigold': this._drawMarigold(ctx); break;
      case 'flower_lotus_bloom': this._drawBloomingLotus(ctx); break;
      case 'flower_orchid': this._drawOrchid(ctx); break;
      case 'flower_crown': this._drawCrownFlower(ctx); break;
      case 'flower_globe': this._drawGlobeFlower(ctx); break;
      case 'coin_gold': this._drawGoldCoin(ctx); break;
      case 'candle_center': this._drawCandle(ctx, isLit); break;
      case 'incense_trio': this._drawIncense(ctx, isLit); break;
      default: break;
    }
    ctx.restore();
  },

  _drawFoldedLeaf(ctx) {
    const c = this.colors;
    ctx.beginPath();
    ctx.moveTo(0, -32);
    ctx.lineTo(14, 0);
    ctx.lineTo(8, 18);
    ctx.lineTo(-8, 18);
    ctx.lineTo(-14, 0);
    ctx.closePath();
    ctx.fillStyle = c.leafDark;
    ctx.fill();

    ctx.beginPath();
    ctx.moveTo(0, -28);
    ctx.lineTo(10, -2);
    ctx.lineTo(0, 14);
    ctx.lineTo(-10, -2);
    ctx.closePath();
    ctx.fillStyle = c.leafMid;
    ctx.fill();

    ctx.beginPath();
    ctx.moveTo(0, -28);
    ctx.lineTo(0, 14);
    ctx.strokeStyle = c.leafLight;
    ctx.lineWidth = 2;
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(0, 10, 2.5, 0, Math.PI * 2);
    ctx.fillStyle = c.leafGoldPin;
    ctx.fill();
  },

  _drawRoseLeaf(ctx) {
    const c = this.colors;
    ctx.beginPath();
    ctx.arc(0, 0, 16, 0, Math.PI * 2);
    ctx.fillStyle = c.leafDark;
    ctx.fill();
    ctx.beginPath();
    ctx.arc(0, -2, 12, 0, Math.PI * 2);
    ctx.fillStyle = c.leafMid;
    ctx.fill();
    ctx.beginPath();
    ctx.arc(0, -3, 6, 0, Math.PI * 2);
    ctx.fillStyle = c.leafLight;
    ctx.fill();
    ctx.fillStyle = c.leafGoldPin;
    ctx.fillRect(-2, -2, 4, 4);
  },

  _drawLotusPetal(ctx) {
    const c = this.colors;
    ctx.beginPath();
    ctx.moveTo(0, -28);
    ctx.quadraticCurveTo(14, -10, 10, 14);
    ctx.lineTo(-10, 14);
    ctx.quadraticCurveTo(-14, -10, 0, -28);
    ctx.fillStyle = c.lotusPinkMid;
    ctx.fill();

    ctx.beginPath();
    ctx.moveTo(0, -24);
    ctx.quadraticCurveTo(8, -8, 6, 10);
    ctx.lineTo(-6, 10);
    ctx.quadraticCurveTo(-8, -8, 0, -24);
    ctx.fillStyle = c.lotusPinkLight;
    ctx.fill();

    ctx.beginPath();
    ctx.ellipse(0, 8, 5, 4, 0, 0, Math.PI * 2);
    ctx.fillStyle = c.lotusWhite;
    ctx.fill();
  },

  _drawMarigold(ctx) {
    const c = this.colors;
    ctx.beginPath();
    ctx.arc(0, 0, 16, 0, Math.PI * 2);
    ctx.fillStyle = c.marigoldDark;
    ctx.fill();

    for (let i = 0; i < 8; i++) {
      const a = (i / 8) * Math.PI * 2;
      ctx.beginPath();
      ctx.arc(Math.cos(a) * 9, Math.sin(a) * 9, 7, 0, Math.PI * 2);
      ctx.fillStyle = c.marigoldMid;
      ctx.fill();
    }
    ctx.beginPath();
    ctx.arc(0, 0, 7, 0, Math.PI * 2);
    ctx.fillStyle = c.marigoldLight;
    ctx.fill();
  },

  _drawBloomingLotus(ctx) {
    const c = this.colors;
    for (let i = 0; i < 8; i++) {
      const a = (i / 8) * Math.PI * 2;
      ctx.save();
      ctx.rotate(a);
      ctx.beginPath();
      ctx.ellipse(0, -14, 7, 12, 0, 0, Math.PI * 2);
      ctx.fillStyle = c.lotusPinkMid;
      ctx.fill();
      ctx.restore();
    }
    ctx.beginPath();
    ctx.arc(0, 0, 9, 0, Math.PI * 2);
    ctx.fillStyle = '#fde047';
    ctx.fill();
  },

  _drawOrchid(ctx) {
    const c = this.colors;
    for (let i = -1; i <= 1; i++) {
      ctx.beginPath();
      ctx.ellipse(i * 10, -10, 7, 10, i * 0.4, 0, Math.PI * 2);
      ctx.fillStyle = c.orchidPurpleMid;
      ctx.fill();
    }
    ctx.beginPath();
    ctx.ellipse(-10, 4, 8, 9, -0.4, 0, Math.PI * 2);
    ctx.ellipse(10, 4, 8, 9, 0.4, 0, Math.PI * 2);
    ctx.fillStyle = c.orchidPurpleDark;
    ctx.fill();
    ctx.beginPath();
    ctx.arc(0, 0, 5, 0, Math.PI * 2);
    ctx.fillStyle = '#fef08a';
    ctx.fill();
  },

  _drawCrownFlower(ctx) {
    const c = this.colors;
    ctx.fillStyle = c.crownMid;
    for (let i = 0; i < 5; i++) {
      const a = (i / 5) * Math.PI * 2 - Math.PI / 2;
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(Math.cos(a - 0.2) * 12, Math.sin(a - 0.2) * 12);
      ctx.lineTo(Math.cos(a) * 16, Math.sin(a) * 16);
      ctx.lineTo(Math.cos(a + 0.2) * 12, Math.sin(a + 0.2) * 12);
      ctx.closePath();
      ctx.fill();
    }
    ctx.beginPath();
    ctx.arc(0, 0, 5, 0, Math.PI * 2);
    ctx.fillStyle = c.crownWhite;
    ctx.fill();
  },

  _drawGlobeFlower(ctx) {
    ctx.beginPath();
    ctx.arc(0, 0, 11, 0, Math.PI * 2);
    ctx.fillStyle = this.colors.globePurple;
    ctx.fill();
    ctx.fillStyle = '#f472b6';
    for (let i = 0; i < 10; i++) {
      const a = (i / 10) * Math.PI * 2;
      ctx.fillRect(Math.cos(a) * 8 - 1.5, Math.sin(a) * 8 - 1.5, 3, 3);
    }
  },

  _drawGoldCoin(ctx) {
    const c = this.colors;
    ctx.beginPath();
    ctx.arc(0, 0, 12, 0, Math.PI * 2);
    ctx.fillStyle = c.coinEdge;
    ctx.fill();
    ctx.beginPath();
    ctx.arc(0, 0, 10, 0, Math.PI * 2);
    ctx.fillStyle = c.coinGold;
    ctx.fill();
    ctx.strokeStyle = c.coinEdge;
    ctx.lineWidth = 1.5;
    ctx.strokeRect(-4, -4, 8, 8);
  },

  _drawCandle(ctx, isLit) {
    const c = this.colors;
    ctx.beginPath();
    ctx.roundRect(-5, -2, 10, 36, 4);
    ctx.fillStyle = c.candleWaxMid;
    ctx.fill();

    ctx.beginPath();
    ctx.ellipse(0, -2, 5, 2.5, 0, 0, Math.PI * 2);
    ctx.fillStyle = c.candleWaxYellow;
    ctx.fill();

    ctx.beginPath();
    ctx.moveTo(0, -2);
    ctx.lineTo(0, -9);
    ctx.strokeStyle = c.candleWick;
    ctx.lineWidth = 2;
    ctx.stroke();

    if (isLit) {
      this.drawFlame(ctx, 0, -11, 1);
    }
  },

  _drawIncense(ctx, isLit) {
    const c = this.colors;
    const offsets = [-4, 0, 4];
    offsets.forEach(x => {
      ctx.beginPath();
      ctx.moveTo(x, 26);
      ctx.lineTo(x, -26);
      ctx.strokeStyle = c.incenseStick;
      ctx.lineWidth = 2;
      ctx.stroke();

      ctx.beginPath();
      ctx.arc(x, -26, isLit ? 2.5 : 1.5, 0, Math.PI * 2);
      ctx.fillStyle = isLit ? c.incenseTip : '#451a03';
      ctx.fill();

      if (isLit) {
        ctx.strokeStyle = 'rgba(241, 245, 249, 0.45)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(x, -28);
        ctx.quadraticCurveTo(x + 4, -36, x - 2, -44);
        ctx.stroke();
      }
    });
  },

  drawFlame(ctx, x, y, scale = 1, flicker = 0) {
    const c = this.colors;
    ctx.save();
    ctx.translate(x, y);
    ctx.scale(scale, scale);

    const flickY = Math.sin(Date.now() / 90 + flicker) * 2;
    const flickX = Math.cos(Date.now() / 110 + flicker) * 1.5;

    const radGlow = ctx.createRadialGradient(0, 0, 2, 0, 0, 32);
    radGlow.addColorStop(0, 'rgba(251, 191, 36, 0.7)');
    radGlow.addColorStop(0.5, 'rgba(245, 158, 11, 0.25)');
    radGlow.addColorStop(1, 'rgba(245, 158, 11, 0)');
    ctx.fillStyle = radGlow;
    ctx.beginPath();
    ctx.arc(0, 0, 32, 0, Math.PI * 2);
    ctx.fill();

    ctx.beginPath();
    ctx.moveTo(0, -18 + flickY);
    ctx.quadraticCurveTo(8 + flickX, -8, 5, 2);
    ctx.quadraticCurveTo(0, 5, -5, 2);
    ctx.quadraticCurveTo(-8 + flickX, -8, 0, -18 + flickY);
    ctx.fillStyle = c.flameOuter;
    ctx.fill();

    ctx.beginPath();
    ctx.moveTo(0, -13 + flickY);
    ctx.quadraticCurveTo(5 + flickX, -6, 3, 1);
    ctx.quadraticCurveTo(0, 3, -3, 1);
    ctx.quadraticCurveTo(-5 + flickX, -6, 0, -13 + flickY);
    ctx.fillStyle = c.flameMid;
    ctx.fill();

    ctx.beginPath();
    ctx.moveTo(0, -8 + flickY);
    ctx.quadraticCurveTo(2.5, -3, 1.5, 0);
    ctx.quadraticCurveTo(0, 1.5, -1.5, 0);
    ctx.quadraticCurveTo(-2.5, -3, 0, -8 + flickY);
    ctx.fillStyle = c.flameInner;
    ctx.fill();

    ctx.restore();
  },

  renderToolPreview(canvasId, type, category = 'item') {
    const canvas = document.getElementById(canvasId);
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const midX = canvas.width / 2;
    const midY = canvas.height / 2;

    if (category === 'base') {
      this.drawBase(ctx, type, midX, midY, 18);
    } else {
      this.drawItem(ctx, { type, x: midX, y: midY, scale: 0.9, rotation: 0 }, true);
    }
  }
};


// ============================================================================
// 2. AUDIO SYNTHESIZER
// ============================================================================
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
      this.playChime(523.25);
    }
    return !this.isMuted;
  }

  startAmbient() {
    if (this.isMuted || !this.ctx || this.waterNode) return;
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

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(450, this.ctx.currentTime);

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

    this._scheduleRandomChime();
  }

  stopAmbient() {
    if (this.waterNode) {
      try { this.waterNode.stop(); this.waterNode.disconnect(); } catch (e) {}
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
    const notes = [523.25, 587.33, 659.25, 783.99, 880.00];
    const nextDelay = delays[Math.floor(Math.random() * delays.length)];
    this.chimeTimer = setTimeout(() => {
      if (!this.isMuted) {
        const note = notes[Math.floor(Math.random() * notes.length)];
        this.playChime(note, 0.05);
        this._scheduleRandomChime();
      }
    }, nextDelay);
  }

  playChime(freq = 587.33, volume = 0.15) {
    if (this.isMuted || !this.ctx) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const oscHarmonic = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, now);
    oscHarmonic.type = 'triangle';
    oscHarmonic.frequency.setValueAtTime(freq * 2.76, now);

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

    setTimeout(() => {
      this.playChime(659.25, 0.2);
      setTimeout(() => this.playChime(783.99, 0.2), 150);
    }, 250);
  }

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

  playFirework() {
    if (this.isMuted || !this.ctx) return;
    const now = this.ctx.currentTime;
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
const AudioFX = new SoundEngine();


// ============================================================================
// 3. NETWORK MANAGER
// ============================================================================
class NetworkManager {
  constructor() {
    this.peer = null;
    this.conn = null;
    this.broadcastChannel = null;
    this.roomId = null;
    this.isHost = false;
    this.isConnected = false;
    this.callbacks = {};
  }

  on(event, callback) {
    if (!this.callbacks[event]) this.callbacks[event] = [];
    this.callbacks[event].push(callback);
  }

  emit(event, data) {
    if (this.callbacks[event]) {
      this.callbacks[event].forEach(cb => cb(data));
    }
  }

  static generateRoomCode() {
    const chars = '23456789ABCDEFGHJKLMNPQRSTUVWXYZ';
    let code = '';
    for (let i = 0; i < 4; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return code;
  }

  createRoom(customCode = null) {
    this.isHost = true;
    this.roomId = customCode || NetworkManager.generateRoomCode();
    const peerId = `lkt-${this.roomId.toLowerCase()}`;
    this._setupBroadcastChannel(this.roomId);
    this._initPeer(peerId, true);
    return this.roomId;
  }

  joinRoom(roomId) {
    this.isHost = false;
    this.roomId = roomId.toUpperCase().trim();
    const hostPeerId = `lkt-${this.roomId.toLowerCase()}`;
    this._setupBroadcastChannel(this.roomId);
    this._initPeer(null, false, hostPeerId);
    return this.roomId;
  }

  _setupBroadcastChannel(roomId) {
    try {
      if (window.BroadcastChannel) {
        if (this.broadcastChannel) this.broadcastChannel.close();
        this.broadcastChannel = new BroadcastChannel(`lkt-bc-${roomId.toLowerCase()}`);
        this.broadcastChannel.onmessage = (event) => {
          this._handleIncomingData(event.data, 'broadcast');
        };
      }
    } catch (e) {
      console.warn('BroadcastChannel not available', e);
    }
  }

  _initPeer(fixedId, isHost, targetHostId = null) {
    try {
      if (typeof Peer === 'undefined') {
        console.warn('PeerJS library not loaded, using local BroadcastChannel mode');
        return;
      }
      this.peer = fixedId ? new Peer(fixedId) : new Peer();
      this.peer.on('open', (id) => {
        console.log('PeerJS initialized with ID:', id);
        if (!isHost && targetHostId) {
          this._connectToHost(targetHostId);
        }
      });
      this.peer.on('connection', (connection) => {
        this.conn = connection;
        this._setupConnectionEvents(this.conn);
      });
      this.peer.on('error', (err) => {
        console.warn('PeerJS error:', err.type, err);
        if (err.type === 'unavailable-id') {
          this.emit('status', { connected: true, mode: 'local' });
        }
      });
    } catch (e) {
      console.warn('Peer initialization failed', e);
    }
  }

  _connectToHost(hostPeerId) {
    if (!this.peer) return;
    const connection = this.peer.connect(hostPeerId, { reliable: true });
    this.conn = connection;
    this._setupConnectionEvents(connection);
  }

  _setupConnectionEvents(connection) {
    connection.on('open', () => {
      this.isConnected = true;
      this.emit('connected', { isHost: this.isHost, mode: 'p2p' });
    });
    connection.on('data', (data) => {
      this._handleIncomingData(data, 'p2p');
    });
    connection.on('close', () => {
      this.isConnected = false;
      this.emit('disconnected');
    });
  }

  _handleIncomingData(payload, source) {
    if (!payload || !payload.type) return;
    if (payload.type === 'PING_JOIN') {
      this.isConnected = true;
      this.emit('connected', { isHost: this.isHost, mode: source });
      this.send({ type: 'PONG_JOIN_ACK' });
      return;
    }
    if (payload.type === 'PONG_JOIN_ACK') {
      this.isConnected = true;
      this.emit('connected', { isHost: this.isHost, mode: source });
      return;
    }
    this.emit('message', payload);
  }

  send(payload) {
    if (this.conn && this.conn.open) {
      this.conn.send(payload);
    }
    if (this.broadcastChannel) {
      try { this.broadcastChannel.postMessage(payload); } catch (e) {}
    }
  }

  pingPartner() {
    this.send({ type: 'PING_JOIN' });
  }
}


// ============================================================================
// 4. RIVER SCENE
// ============================================================================
class RiverScene {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.animationId = null;
    this.krathongData = null;
    this.isLit = true;
    this.player1Info = { name: 'Player 1', wish: '' };
    this.player2Info = { name: 'Partner', wish: '' };
    this.stars = [];
    this.lanterns = [];
    this.ambientKrathongs = [];
    this.ripples = [];
    this.fireworkParticles = [];
    this.fireflies = [];

    this.mainKrathong = {
      x: 0,
      y: 0,
      targetY: 0,
      bobOffset: 0,
      driftSpeedX: 0.35,
      isLaunched: false,
      launchProgress: 0
    };

    this._initStars();
    this._initAmbientKrathongs();
    this._initFireflies();
    this._setupResize();
  }

  _setupResize() {
    const resize = () => {
      this.canvas.width = window.innerWidth;
      this.canvas.height = window.innerHeight;
      this.mainKrathong.targetY = this.canvas.height * 0.72;
      if (!this.mainKrathong.isLaunched) {
        this.mainKrathong.x = this.canvas.width * 0.5;
        this.mainKrathong.y = this.canvas.height * 0.78;
      }
    };
    window.addEventListener('resize', resize);
    resize();
  }

  _initStars() {
    this.stars = [];
    for (let i = 0; i < 90; i++) {
      this.stars.push({
        x: Math.random() * window.innerWidth,
        y: Math.random() * (window.innerHeight * 0.55),
        size: Math.random() > 0.8 ? 2 : 1,
        twinkleSpeed: 0.02 + Math.random() * 0.04,
        phase: Math.random() * Math.PI * 2
      });
    }
  }

  _initFireflies() {
    this.fireflies = [];
    for (let i = 0; i < 18; i++) {
      this.fireflies.push({
        x: Math.random() * window.innerWidth,
        y: window.innerHeight * 0.45 + Math.random() * (window.innerHeight * 0.5),
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.3,
        glowPhase: Math.random() * Math.PI * 2
      });
    }
  }

  _initAmbientKrathongs() {
    this.ambientKrathongs = [];
    for (let i = 0; i < 7; i++) {
      this.ambientKrathongs.push({
        x: Math.random() * window.innerWidth,
        y: window.innerHeight * (0.58 + Math.random() * 0.28),
        speed: 0.15 + Math.random() * 0.25,
        scale: 0.35 + Math.random() * 0.3,
        baseType: ['banana', 'bread', 'lotus_leaf'][Math.floor(Math.random() * 3)],
        flicker: Math.random() * 10
      });
    }
  }

  start(krathongData, p1, p2) {
    this.krathongData = krathongData;
    this.player1Info = p1;
    this.player2Info = p2;
    this.mainKrathong.isLaunched = false;
    this.mainKrathong.launchProgress = 0;
    this.mainKrathong.x = this.canvas.width * 0.5;
    this.mainKrathong.y = this.canvas.height * 0.78;
    if (!this.animationId) {
      this._loop();
    }
  }

  stop() {
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
      this.animationId = null;
    }
  }

  launchMainKrathong() {
    this.mainKrathong.isLaunched = true;
    this.addRipple(this.mainKrathong.x, this.mainKrathong.y);
  }

  addRipple(x, y) {
    this.ripples.push({
      x, y, radius: 5, maxRadius: 65, opacity: 0.8
    });
  }

  spawnLantern(x = null, y = null) {
    const startX = x !== null ? x : this.canvas.width * 0.2 + Math.random() * (this.canvas.width * 0.6);
    const startY = y !== null ? y : this.canvas.height * 0.85;
    this.lanterns.push({
      x: startX,
      y: startY,
      vx: (Math.random() - 0.4) * 0.4,
      vy: -(0.6 + Math.random() * 0.6),
      scale: 0.9,
      sway: Math.random() * Math.PI * 2
    });
    AudioFX.playFlameIgnite();
  }

  spawnFireworks(x = null, y = null) {
    const fx = x !== null ? x : this.canvas.width * 0.2 + Math.random() * (this.canvas.width * 0.6);
    const fy = y !== null ? y : this.canvas.height * 0.25 + Math.random() * (this.canvas.height * 0.2);
    const colors = ['#f59e0b', '#ec4899', '#38bdf8', '#a855f7', '#4ade80', '#fbbf24'];
    const chosenColor = colors[Math.floor(Math.random() * colors.length)];

    for (let i = 0; i < 40; i++) {
      const angle = (i / 40) * Math.PI * 2;
      const speed = 1.5 + Math.random() * 3.5;
      this.fireworkParticles.push({
        x: fx, y: fy,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        color: chosenColor,
        alpha: 1, life: 1,
        decay: 0.015 + Math.random() * 0.015
      });
    }
    AudioFX.playFirework();
  }

  _loop() {
    this._update();
    this._render();
    this.animationId = requestAnimationFrame(() => this._loop());
  }

  _update() {
    const now = Date.now();
    const w = this.canvas.width;
    const h = this.canvas.height;
    const riverHorizon = h * 0.52;

    if (this.mainKrathong.isLaunched) {
      this.mainKrathong.x += this.mainKrathong.driftSpeedX;
      this.mainKrathong.bobOffset = Math.sin(now / 450) * 4;
      if (this.mainKrathong.x > w + 200) {
        this.mainKrathong.x = -150;
      }
    } else {
      this.mainKrathong.bobOffset = Math.sin(now / 600) * 2;
    }

    this.ambientKrathongs.forEach(k => {
      k.x += k.speed;
      if (k.x > w + 100) k.x = -80;
    });

    for (let i = this.lanterns.length - 1; i >= 0; i--) {
      const l = this.lanterns[i];
      l.sway += 0.03;
      l.x += l.vx + Math.sin(l.sway) * 0.3;
      l.y += l.vy;
      l.scale *= 0.9985;
      if (l.y < -50 || l.scale < 0.1) {
        this.lanterns.splice(i, 1);
      }
    }

    for (let i = this.ripples.length - 1; i >= 0; i--) {
      const r = this.ripples[i];
      r.radius += 0.65;
      r.opacity -= 0.012;
      if (r.opacity <= 0) {
        this.ripples.splice(i, 1);
      }
    }

    for (let i = this.fireworkParticles.length - 1; i >= 0; i--) {
      const p = this.fireworkParticles[i];
      p.x += p.vx;
      p.y += p.vy;
      p.vy += 0.04;
      p.alpha -= p.decay;
      if (p.alpha <= 0) {
        this.fireworkParticles.splice(i, 1);
      }
    }

    this.fireflies.forEach(f => {
      f.x += f.vx;
      f.y += f.vy;
      if (f.x < 0) f.x = w;
      if (f.x > w) f.x = 0;
      if (f.y < riverHorizon - 20) f.y = h;
      if (f.y > h) f.y = riverHorizon;
    });
  }

  _render() {
    const ctx = this.ctx;
    const w = this.canvas.width;
    const h = this.canvas.height;
    const riverHorizon = h * 0.52;
    const now = Date.now();

    ctx.clearRect(0, 0, w, h);

    const skyGrad = ctx.createLinearGradient(0, 0, 0, riverHorizon);
    skyGrad.addColorStop(0, '#060a17');
    skyGrad.addColorStop(0.65, '#0e162f');
    skyGrad.addColorStop(1, '#1b2345');
    ctx.fillStyle = skyGrad;
    ctx.fillRect(0, 0, w, riverHorizon);

    this.stars.forEach(s => {
      const tw = 0.5 + Math.sin(now * s.twinkleSpeed + s.phase) * 0.5;
      ctx.fillStyle = `rgba(254, 240, 138, ${tw * 0.8})`;
      ctx.fillRect(s.x, s.y, s.size, s.size);
    });

    const moonX = w * 0.82;
    const moonY = h * 0.18;
    const moonRadius = 44;

    const moonGlow = ctx.createRadialGradient(moonX, moonY, moonRadius * 0.8, moonX, moonY, moonRadius * 3.5);
    moonGlow.addColorStop(0, 'rgba(254, 243, 199, 0.45)');
    moonGlow.addColorStop(0.5, 'rgba(251, 191, 36, 0.12)');
    moonGlow.addColorStop(1, 'rgba(251, 191, 36, 0)');
    ctx.fillStyle = moonGlow;
    ctx.beginPath();
    ctx.arc(moonX, moonY, moonRadius * 3.5, 0, Math.PI * 2);
    ctx.fill();

    ctx.beginPath();
    ctx.arc(moonX, moonY, moonRadius, 0, Math.PI * 2);
    ctx.fillStyle = '#fef08a';
    ctx.fill();

    ctx.fillStyle = '#fde047';
    ctx.beginPath();
    ctx.arc(moonX - 12, moonY - 8, 8, 0, Math.PI * 2);
    ctx.arc(moonX + 14, moonY + 10, 11, 0, Math.PI * 2);
    ctx.arc(moonX + 4, moonY - 18, 6, 0, Math.PI * 2);
    ctx.fill();

    this._drawShorelineSilhouettes(ctx, w, riverHorizon);

    const waterGrad = ctx.createLinearGradient(0, riverHorizon, 0, h);
    waterGrad.addColorStop(0, '#091224');
    waterGrad.addColorStop(0.3, '#0d1d3a');
    waterGrad.addColorStop(0.7, '#07152b');
    waterGrad.addColorStop(1, '#020617');
    ctx.fillStyle = waterGrad;
    ctx.fillRect(0, riverHorizon, w, h - riverHorizon);

    const moonReflectW = moonRadius * 2.2;
    for (let y = riverHorizon; y < h; y += 8) {
      const progress = (y - riverHorizon) / (h - riverHorizon);
      const waveX = Math.sin(y * 0.05 + now / 300) * (12 + progress * 25);
      const span = (moonReflectW + progress * 80) * (0.6 + Math.sin(y * 0.1) * 0.4);
      ctx.fillStyle = `rgba(254, 240, 138, ${0.18 - progress * 0.12})`;
      ctx.fillRect(moonX + waveX - span / 2, y, span, 4);
    }

    ctx.fillStyle = 'rgba(56, 189, 248, 0.08)';
    for (let y = riverHorizon + 15; y < h; y += 22) {
      const waveOffset = Math.sin(y * 0.08 + now / 500) * 20;
      ctx.fillRect(waveOffset, y, w, 2);
    }

    this.ambientKrathongs.forEach(k => {
      ctx.save();
      ctx.translate(k.x, k.y + Math.sin(now / 500 + k.flicker) * 2);
      ctx.scale(k.scale, k.scale);
      SpriteEngine.drawBase(ctx, k.baseType, 0, 0, 40);
      SpriteEngine.drawItem(ctx, { type: 'candle_center', x: 0, y: -8, scale: 0.7 }, true);
      ctx.beginPath();
      ctx.ellipse(0, 12, 35, 12, 0, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(251, 191, 36, 0.25)';
      ctx.fill();
      ctx.restore();
    });

    this.ripples.forEach(r => {
      ctx.beginPath();
      ctx.ellipse(r.x, r.y, r.radius * 1.6, r.radius * 0.7, 0, 0, Math.PI * 2);
      ctx.strokeStyle = `rgba(186, 230, 253, ${r.opacity})`;
      ctx.lineWidth = 1.5;
      ctx.stroke();
    });

    this._drawMainKrathong(ctx, now);

    this.lanterns.forEach(l => {
      this._drawSkyLantern(ctx, l.x, l.y, l.scale);
    });

    this.fireworkParticles.forEach(p => {
      ctx.fillStyle = p.color;
      ctx.globalAlpha = Math.max(0, p.alpha);
      ctx.fillRect(p.x - 2, p.y - 2, 4, 4);
      ctx.globalAlpha = 1.0;
    });

    this.fireflies.forEach(f => {
      const glow = (Math.sin(now * 0.005 + f.glowPhase) + 1) * 0.5;
      ctx.fillStyle = `rgba(250, 204, 21, ${glow * 0.8})`;
      ctx.fillRect(f.x - 1.5, f.y - 1.5, 3, 3);
    });
  }

  _drawShorelineSilhouettes(ctx, w, horizon) {
    ctx.fillStyle = '#060a16';
    ctx.beginPath();
    ctx.moveTo(0, horizon);

    const chediX = w * 0.18;
    ctx.lineTo(chediX - 35, horizon);
    ctx.lineTo(chediX - 25, horizon - 15);
    ctx.lineTo(chediX - 15, horizon - 35);
    ctx.lineTo(chediX - 6, horizon - 65);
    ctx.lineTo(chediX, horizon - 90);
    ctx.lineTo(chediX + 6, horizon - 65);
    ctx.lineTo(chediX + 15, horizon - 35);
    ctx.lineTo(chediX + 25, horizon - 15);
    ctx.lineTo(chediX + 35, horizon);

    const templeX = w * 0.42;
    ctx.lineTo(templeX - 30, horizon);
    ctx.lineTo(templeX - 15, horizon - 35);
    ctx.lineTo(templeX, horizon - 55);
    ctx.lineTo(templeX + 15, horizon - 35);
    ctx.lineTo(templeX + 30, horizon);

    const palmX = w * 0.65;
    ctx.lineTo(palmX, horizon);
    ctx.lineTo(palmX + 4, horizon - 45);
    ctx.lineTo(palmX + 20, horizon - 55);
    ctx.lineTo(palmX + 4, horizon - 45);
    ctx.lineTo(palmX - 15, horizon - 52);

    ctx.lineTo(w, horizon);
    ctx.lineTo(w, horizon + 2);
    ctx.lineTo(0, horizon + 2);
    ctx.closePath();
    ctx.fill();
  }

  _drawMainKrathong(ctx, now) {
    if (!this.krathongData) return;
    const mk = this.mainKrathong;
    const cx = mk.x;
    const cy = mk.y + mk.bobOffset;

    ctx.save();
    ctx.translate(cx, cy);

    const waterGlow = ctx.createRadialGradient(0, 15, 20, 0, 15, 140);
    waterGlow.addColorStop(0, 'rgba(251, 191, 36, 0.4)');
    waterGlow.addColorStop(0.5, 'rgba(245, 158, 11, 0.15)');
    waterGlow.addColorStop(1, 'rgba(245, 158, 11, 0)');
    ctx.fillStyle = waterGlow;
    ctx.beginPath();
    ctx.ellipse(0, 20, 140, 45, 0, 0, Math.PI * 2);
    ctx.fill();

    SpriteEngine.drawBase(ctx, this.krathongData.base, 0, 0, 75);

    if (this.krathongData.items) {
      this.krathongData.items.forEach(item => {
        const relX = (item.x - 240) * 0.65;
        const relY = (item.y - 240) * 0.65;
        SpriteEngine.drawItem(ctx, {
          ...item,
          x: relX,
          y: relY,
          scale: (item.scale || 1) * 0.65
        }, this.isLit);
      });
    }

    this._drawWishTags(ctx, -60, 45, this.player1Info.name, this.player1Info.wish, '#fef08a');
    this._drawWishTags(ctx, 60, 45, this.player2Info.name, this.player2Info.wish, '#fbcfe8');

    ctx.restore();
  }

  _drawWishTags(ctx, x, y, name, wish, color) {
    if (!name) return;
    ctx.save();
    ctx.translate(x, y);

    ctx.strokeStyle = 'rgba(254, 240, 138, 0.6)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(0, -15);
    ctx.lineTo(0, 0);
    ctx.stroke();

    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.roundRect(-30, 0, 60, 24, 4);
    ctx.fill();
    ctx.strokeStyle = '#78350f';
    ctx.lineWidth = 1;
    ctx.stroke();

    ctx.fillStyle = '#0f172a';
    ctx.font = 'bold 9px Prompt, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(name.slice(0, 8), 0, 11);

    if (wish) {
      ctx.fillStyle = '#451a03';
      ctx.font = '8px Mali, sans-serif';
      ctx.fillText(wish.slice(0, 8) + '..', 0, 20);
    }
    ctx.restore();
  }

  _drawSkyLantern(ctx, x, y, scale = 1) {
    ctx.save();
    ctx.translate(x, y);
    ctx.scale(scale, scale);

    const glow = ctx.createRadialGradient(0, 0, 10, 0, 0, 45);
    glow.addColorStop(0, 'rgba(251, 191, 36, 0.5)');
    glow.addColorStop(0.7, 'rgba(245, 158, 11, 0.15)');
    glow.addColorStop(1, 'rgba(245, 158, 11, 0)');
    ctx.fillStyle = glow;
    ctx.beginPath();
    ctx.arc(0, 0, 45, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#fef08a';
    ctx.beginPath();
    ctx.moveTo(-16, -26);
    ctx.lineTo(16, -26);
    ctx.lineTo(20, 18);
    ctx.lineTo(-20, 18);
    ctx.closePath();
    ctx.fill();

    ctx.strokeStyle = '#b45309';
    ctx.lineWidth = 1.5;
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(0, 12, 5, 0, Math.PI * 2);
    ctx.fillStyle = '#f97316';
    ctx.fill();
    ctx.beginPath();
    ctx.arc(0, 12, 3, 0, Math.PI * 2);
    ctx.fillStyle = '#ffffff';
    ctx.fill();

    ctx.restore();
  }
}


// ============================================================================
// 5. SOUVENIR CARD GENERATOR
// ============================================================================
const SouvenirCard = {
  render(canvas, krathongData, p1, p2, roomCode) {
    const ctx = canvas.getContext('2d');
    const w = canvas.width;
    const h = canvas.height;

    ctx.clearRect(0, 0, w, h);

    ctx.fillStyle = '#fdfbf7';
    ctx.fillRect(0, 0, w, h);

    ctx.strokeStyle = '#e2d9cc';
    ctx.lineWidth = 2;
    ctx.strokeRect(1, 1, w - 2, h - 2);

    const photoX = 18;
    const photoY = 18;
    const photoW = w - 36;
    const photoH = 290;

    ctx.save();
    ctx.beginPath();
    ctx.rect(photoX, photoY, photoW, photoH);
    ctx.clip();

    const photoGrad = ctx.createLinearGradient(photoX, photoY, photoX, photoY + photoH);
    photoGrad.addColorStop(0, '#060a17');
    photoGrad.addColorStop(0.5, '#0e162f');
    photoGrad.addColorStop(0.85, '#07152b');
    photoGrad.addColorStop(1, '#020617');
    ctx.fillStyle = photoGrad;
    ctx.fillRect(photoX, photoY, photoW, photoH);

    ctx.fillStyle = '#fef08a';
    for (let i = 0; i < 35; i++) {
      const sx = photoX + ((i * 37) % photoW);
      const sy = photoY + ((i * 23) % (photoH * 0.6));
      ctx.fillRect(sx, sy, 1.5, 1.5);
    }

    const mX = photoX + photoW * 0.82;
    const mY = photoY + 45;
    ctx.beginPath();
    ctx.arc(mX, mY, 18, 0, Math.PI * 2);
    ctx.fillStyle = '#fef08a';
    ctx.fill();

    ctx.fillStyle = 'rgba(251, 191, 36, 0.4)';
    ctx.beginPath();
    ctx.arc(photoX + photoW * 0.25, photoY + 60, 14, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#fef08a';
    ctx.fillRect(photoX + photoW * 0.25 - 4, photoY + 54, 8, 12);

    const waterY = photoY + photoH * 0.65;
    ctx.fillStyle = 'rgba(56, 189, 248, 0.1)';
    ctx.fillRect(photoX, waterY, photoW, photoH - (waterY - photoY));

    const kX = photoX + photoW * 0.5;
    const kY = photoY + photoH * 0.72;
    const glow = ctx.createRadialGradient(kX, kY + 10, 10, kX, kY + 10, 85);
    glow.addColorStop(0, 'rgba(251, 191, 36, 0.55)');
    glow.addColorStop(0.6, 'rgba(245, 158, 11, 0.15)');
    glow.addColorStop(1, 'rgba(245, 158, 11, 0)');
    ctx.fillStyle = glow;
    ctx.beginPath();
    ctx.ellipse(kX, kY + 10, 85, 30, 0, 0, Math.PI * 2);
    ctx.fill();

    if (krathongData) {
      SpriteEngine.drawBase(ctx, krathongData.base, kX, kY, 52);
      if (krathongData.items) {
        krathongData.items.forEach(item => {
          const relX = (item.x - 240) * 0.46;
          const relY = (item.y - 240) * 0.46;
          SpriteEngine.drawItem(ctx, {
            ...item,
            x: kX + relX,
            y: kY + relY,
            scale: (item.scale || 1) * 0.46
          }, true);
        });
      }
    }
    ctx.restore();

    const captionY = photoY + photoH + 20;

    ctx.textAlign = 'center';
    ctx.font = 'bold 13px Silkscreen, monospace';
    ctx.fillStyle = '#b45309';
    ctx.fillText('LOY KRATHONG CO-OP', w / 2, captionY);

    ctx.font = 'bold 14px Mali, Prompt, sans-serif';
    ctx.fillStyle = '#0f172a';
    const p1Display = `${p1.avatar || '🌸'} ${p1.name || 'Player 1'}`;
    const p2Display = `${p2.avatar || '🌙'} ${p2.name || 'Partner'}`;
    ctx.fillText(`${p1Display}  &  ${p2Display}`, w / 2, captionY + 22);

    const wishBoxY = captionY + 34;
    ctx.fillStyle = '#fef3c7';
    ctx.beginPath();
    ctx.roundRect(photoX, wishBoxY, photoW, 54, 8);
    ctx.fill();
    ctx.strokeStyle = '#fde68a';
    ctx.lineWidth = 1;
    ctx.stroke();

    ctx.textAlign = 'left';
    ctx.font = '11px Mali, Prompt, sans-serif';
    ctx.fillStyle = '#78350f';
    const w1 = p1.wish ? `"${p1.wish.slice(0, 32)}${p1.wish.length > 32 ? '...' : ''}"` : '"ขอให้มีความสุข สมหวังตลอดปี"';
    const w2 = p2.wish ? `"${p2.wish.slice(0, 32)}${p2.wish.length > 32 ? '...' : ''}"` : '"ขอให้รักและมิตรภาพยืนยาวตลอดไป"';

    ctx.fillText(`${p1.avatar || '🌸'} ${w1}`, photoX + 10, wishBoxY + 20);
    ctx.fillText(`${p2.avatar || '🌙'} ${w2}`, photoX + 10, wishBoxY + 40);

    ctx.textAlign = 'center';
    ctx.font = '9px Prompt, sans-serif';
    ctx.fillStyle = '#94a3b8';
    const today = new Date().toLocaleDateString('th-TH', { year: 'numeric', month: 'short', day: 'numeric' });
    ctx.fillText(`ROOM: ${roomCode || 'SOLO'} • ${today} • ขอขมาพระแม่คงคา`, w / 2, h - 12);
  },

  download(canvas, filename = 'loy-krathong-coop.png') {
    const link = document.createElement('a');
    link.download = filename;
    link.href = canvas.toDataURL('image/png');
    link.click();
  }
};


// ============================================================================
// 6. MAIN APPLICATION CONTROLLER
// ============================================================================
class App {
  constructor() {
    this.network = new NetworkManager();
    this.riverScene = null;

    this.state = {
      isSolo: false,
      roomCode: null,
      player: {
        name: 'Player 1',
        avatar: '🌸',
        wish: ''
      },
      partner: {
        name: 'รอเพื่อน...',
        avatar: '🌙',
        wish: '',
        isConnected: false,
        isHoldingMatch: false
      },
      krathong: {
        base: 'banana',
        items: []
      },
      activeItemType: 'petal_folded',
      isHoldingMatch: false,
      isLit: false,
      launchReady: {
        self: false,
        partner: false
      }
    };

    this.dom = {
      screens: {
        lobby: document.getElementById('screen-lobby'),
        workshop: document.getElementById('screen-workshop'),
        river: document.getElementById('screen-river')
      },
      modals: {
        wishLight: document.getElementById('modal-wish-light'),
        souvenir: document.getElementById('modal-souvenir')
      },
      canvas: {
        krathong: document.getElementById('krathong-canvas'),
        river: document.getElementById('river-canvas'),
        souvenir: document.getElementById('souvenir-canvas')
      },
      partnerCursor: document.getElementById('partner-cursor'),
      partnerCursorLabel: document.getElementById('partner-cursor-label'),
      toastContainer: document.getElementById('toast-container'),
      soundToggleBtn: document.getElementById('sound-toggle-btn'),
      soundIcon: document.getElementById('sound-icon'),
      roomBadge: document.getElementById('room-badge'),
      roomBadgeText: document.getElementById('room-badge-text'),
      copyRoomLinkBtn: document.getElementById('copy-room-link-btn'),
      partnerBadge: document.getElementById('partner-badge'),
      partnerStatusDot: document.getElementById('partner-status-dot'),
      partnerStatusText: document.getElementById('partner-status-text')
    };

    this.krathongCtx = this.dom.canvas.krathong.getContext('2d');
  }

  init() {
    this._renderToolPreviews();
    this._bindUIEvents();
    this._bindNetworkEvents();
    this._checkUrlForRoom();

    this.riverScene = new RiverScene(this.dom.canvas.river);
    this.renderKrathongCanvas();
  }

  _showToast(msg) {
    const toast = document.createElement('div');
    toast.className = 'toast-msg';
    toast.textContent = msg;
    this.dom.toastContainer.appendChild(toast);
    setTimeout(() => toast.remove(), 2600);
  }

  _switchScreen(screenName) {
    Object.keys(this.dom.screens).forEach(key => {
      this.dom.screens[key].classList.toggle('active', key === screenName);
    });
  }

  _checkUrlForRoom() {
    const params = new URLSearchParams(window.location.search);
    const roomParam = params.get('room');
    if (roomParam) {
      const joinInput = document.getElementById('join-room-input');
      if (joinInput) joinInput.value = roomParam.toUpperCase();
      this._showToast(`พบรหัสห้องจากลิงก์: ${roomParam.toUpperCase()}`);
    }
  }

  _renderToolPreviews() {
    SpriteEngine.renderToolPreview('prev-base-banana', 'banana', 'base');
    SpriteEngine.renderToolPreview('prev-base-bread', 'bread', 'base');
    SpriteEngine.renderToolPreview('prev-base-ice', 'ice', 'base');
    SpriteEngine.renderToolPreview('prev-base-lotus-leaf', 'lotus_leaf', 'base');

    SpriteEngine.renderToolPreview('prev-petal-folded', 'petal_folded', 'item');
    SpriteEngine.renderToolPreview('prev-petal-rose', 'petal_rose', 'item');
    SpriteEngine.renderToolPreview('prev-petal-lotus', 'petal_lotus_pink', 'item');

    SpriteEngine.renderToolPreview('prev-flower-marigold', 'flower_marigold', 'item');
    SpriteEngine.renderToolPreview('prev-flower-lotus', 'flower_lotus_bloom', 'item');
    SpriteEngine.renderToolPreview('prev-flower-orchid', 'flower_orchid', 'item');
    SpriteEngine.renderToolPreview('prev-flower-crown', 'flower_crown', 'item');
    SpriteEngine.renderToolPreview('prev-flower-globe', 'flower_globe', 'item');
    SpriteEngine.renderToolPreview('prev-coin-gold', 'coin_gold', 'item');
    SpriteEngine.renderToolPreview('prev-candle', 'candle_center', 'item');
    SpriteEngine.renderToolPreview('prev-incense', 'incense_trio', 'item');
  }

  _bindUIEvents() {
    this.dom.soundToggleBtn.addEventListener('click', () => {
      const isUnmuted = AudioFX.toggleMute();
      this.dom.soundIcon.textContent = isUnmuted ? '🔊' : '🔇';
      this._showToast(isUnmuted ? 'เปิดเสียงดนตรีบำบัด & เสียงสายน้ำ' : 'ปิดเสียง');
    });

    document.querySelectorAll('.avatar-option').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.avatar-option').forEach(b => b.classList.remove('selected'));
        btn.classList.add('selected');
        this.state.player.avatar = btn.getAttribute('data-avatar');
        AudioFX.playPlace();
      });
    });

    document.getElementById('btn-create-room').addEventListener('click', () => {
      AudioFX.init();
      this._readPlayerIdentity();
      const code = this.network.createRoom();
      this.state.roomCode = code;
      this.state.isSolo = false;
      this._setupRoomUI(code, true);
      this._switchScreen('workshop');
      this._showToast(`สร้างห้อง ${code} สำเร็จ! ส่งลิงก์ชวนเพื่อนได้เลย`);
    });

    document.getElementById('btn-join-room').addEventListener('click', () => {
      AudioFX.init();
      this._readPlayerIdentity();
      const input = document.getElementById('join-room-input').value.trim();
      if (!input) {
        this._showToast('กรุณากรอกรหัสห้อง 4 หลัก');
        return;
      }
      this.state.roomCode = input.toUpperCase();
      this.state.isSolo = false;
      this.network.joinRoom(this.state.roomCode);
      this._setupRoomUI(this.state.roomCode, false);
      this._switchScreen('workshop');
      this.network.pingPartner();
    });

    document.getElementById('btn-solo-mode').addEventListener('click', () => {
      AudioFX.init();
      this._readPlayerIdentity();
      this.state.isSolo = true;
      this.state.roomCode = 'SOLO';
      this.state.partner = {
        name: 'สายน้ำเจ้าพระยา (River)',
        avatar: '🌊',
        wish: 'ขอให้สายน้ำพัดพาสิ่งไม่ดีออกไป นำพาความสุขสงบร่มเย็น',
        isConnected: true
      };
      this._setupRoomUI('SOLO', true);
      this._updatePartnerUI();
      this._switchScreen('workshop');
      this._showToast('เข้าสู่โหมดเดี่ยว ลอยกระทงกับสายน้ำ');
    });

    this.dom.copyRoomLinkBtn.addEventListener('click', () => {
      const url = `${window.location.origin}${window.location.pathname}?room=${this.state.roomCode}`;
      navigator.clipboard.writeText(url).then(() => {
        this._showToast('คัดลอกลิงก์ห้องแล้ว! ส่งให้เพื่อนเปิดได้ทันที 📋');
      });
    });

    document.querySelectorAll('.base-card').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.base-card').forEach(b => b.classList.remove('selected'));
        btn.classList.add('selected');
        const base = btn.getAttribute('data-base');
        this.state.krathong.base = base;
        this.renderKrathongCanvas();
        AudioFX.playPlace();
        this.network.send({ type: 'SET_BASE', base });
      });
    });

    document.querySelectorAll('.item-card').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.item-card').forEach(b => b.classList.remove('active-item'));
        btn.classList.add('active-item');
        this.state.activeItemType = btn.getAttribute('data-item-type');
        AudioFX.playPlace();
      });
    });

    this.dom.canvas.krathong.addEventListener('click', (e) => this._handleCanvasClick(e));

    this.dom.canvas.krathong.addEventListener('mousemove', (e) => {
      if (this.state.isSolo) return;
      const rect = this.dom.canvas.krathong.getBoundingClientRect();
      const relX = (e.clientX - rect.left) / rect.width;
      const relY = (e.clientY - rect.top) / rect.height;
      this.network.send({ type: 'CURSOR_MOVE', relX, relY, avatar: this.state.player.avatar });
    });

    document.getElementById('btn-undo').addEventListener('click', () => {
      if (this.state.krathong.items.length > 0) {
        this.state.krathong.items.pop();
        this.renderKrathongCanvas();
        AudioFX.playPlace();
        this.network.send({ type: 'UNDO_ITEM' });
      }
    });

    document.getElementById('btn-clear-all').addEventListener('click', () => {
      this.state.krathong.items = [];
      this.renderKrathongCanvas();
      this.network.send({ type: 'CLEAR_ITEMS' });
      this._showToast('ล้างกระทงใหม่เรียบร้อย');
    });

    document.getElementById('btn-quick-ring').addEventListener('click', () => {
      this._autoArrangeRing();
      this.network.send({ type: 'AUTO_RING', itemType: this.state.activeItemType });
    });

    document.getElementById('btn-quick-flowers').addEventListener('click', () => {
      this._autoScatterFlowers();
      this.network.send({ type: 'AUTO_SCATTER' });
    });

    document.querySelectorAll('.reaction-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const emoji = btn.getAttribute('data-reaction');
        this._showToast(`${this.state.player.name}: ${emoji}`);
        this.network.send({ type: 'REACTION', emoji, sender: this.state.player.name });
      });
    });

    document.getElementById('btn-finish-craft').addEventListener('click', () => {
      this._openWishLightModal();
      this.network.send({ type: 'OPEN_LIGHT_MODAL' });
    });

    document.getElementById('btn-close-wish-modal').addEventListener('click', () => {
      this.dom.modals.wishLight.classList.add('hidden');
    });

    const wishInput = document.getElementById('my-wish-input');
    wishInput.addEventListener('input', (e) => {
      this.state.player.wish = e.target.value;
      document.getElementById('p1-wish-preview').textContent = `"${e.target.value || 'ยังไม่ได้เขียน...'}"`;
      this.network.send({ type: 'UPDATE_WISH', wish: e.target.value });
    });

    const holdBtn = document.getElementById('btn-hold-light');
    const startHold = () => {
      if (this.state.isLit) return;
      this.state.isHoldingMatch = true;
      this._setMatchHoldState('p1', true);
      AudioFX.playMatchStrike();
      this.network.send({ type: 'MATCH_HOLD', holding: true });
      this._checkDualIgnition();
    };

    const stopHold = () => {
      if (this.state.isLit) return;
      this.state.isHoldingMatch = false;
      this._setMatchHoldState('p1', false);
      this.network.send({ type: 'MATCH_HOLD', holding: false });
    };

    holdBtn.addEventListener('pointerdown', startHold);
    window.addEventListener('pointerup', stopHold);
    window.addEventListener('pointercancel', stopHold);

    document.getElementById('btn-ready-launch').addEventListener('click', () => {
      this.state.launchReady.self = true;
      document.getElementById('launch-sync-status').textContent = 'คุณพร้อมแล้ว! รอเพื่อนกดพร้อมกัน...';
      this.network.send({ type: 'READY_LAUNCH' });

      if (this.state.isSolo || this.state.launchReady.partner) {
        this._triggerRiverLaunch();
      }
    });

    document.getElementById('btn-release-lantern').addEventListener('click', () => {
      this.riverScene.spawnLantern();
      this.network.send({ type: 'RIVER_ACTION', action: 'lantern' });
    });

    document.getElementById('btn-fireworks').addEventListener('click', () => {
      this.riverScene.spawnFireworks();
      this.network.send({ type: 'RIVER_ACTION', action: 'fireworks' });
    });

    this.dom.canvas.river.addEventListener('click', (e) => {
      const rect = this.dom.canvas.river.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      this.riverScene.addRipple(x, y);
      AudioFX.playSplash();
      this.network.send({ type: 'RIVER_ACTION', action: 'ripple', x, y });
    });

    document.getElementById('btn-open-souvenir').addEventListener('click', () => {
      this._openSouvenirModal();
    });

    document.getElementById('btn-close-souvenir').addEventListener('click', () => {
      this.dom.modals.souvenir.classList.add('hidden');
    });

    document.getElementById('btn-download-postcard').addEventListener('click', () => {
      SouvenirCard.download(this.dom.canvas.souvenir, `loy-krathong-${this.state.roomCode || 'coop'}.png`);
      this._showToast('บันทึกรูปภาพสำเร็จ! 📷');
    });

    document.getElementById('btn-share-postcard').addEventListener('click', () => {
      if (navigator.share) {
        this.dom.canvas.souvenir.toBlob(blob => {
          const file = new File([blob], 'loy-krathong.png', { type: 'image/png' });
          navigator.share({
            title: 'Loy Krathong Co-op',
            text: `การ์ดลอยกระทงคู่ของ ${this.state.player.name} & ${this.state.partner.name} ✨`,
            files: [file]
          }).catch(() => {});
        });
      } else {
        SouvenirCard.download(this.dom.canvas.souvenir);
        this._showToast('บันทึกรูปภาพแล้ว พร้อมแชร์ลง IG / LINE ได้เลย!');
      }
    });
  }

  _readPlayerIdentity() {
    const nameInput = document.getElementById('player-name-input').value.trim();
    if (nameInput) this.state.player.name = nameInput;
    document.getElementById('p1-name-badge').textContent = `${this.state.player.name} (คุณ)`;
    document.getElementById('p1-avatar-badge').textContent = this.state.player.avatar;
    document.getElementById('match-p1-label').textContent = this.state.player.name;
  }

  _setupRoomUI(code, isHost) {
    this.dom.roomBadge.classList.remove('hidden');
    this.dom.roomBadge.classList.add('flex');
    this.dom.roomBadgeText.textContent = `ROOM: ${code}`;
    this.dom.partnerBadge.classList.remove('hidden');
    this.dom.partnerBadge.classList.add('flex');
  }

  _handleCanvasClick(e) {
    const rect = this.dom.canvas.krathong.getBoundingClientRect();
    const clickX = ((e.clientX - rect.left) / rect.width) * 480;
    const clickY = ((e.clientY - rect.top) / rect.height) * 480;

    const dx = clickX - 240;
    const dy = clickY - 240;
    const dist = Math.sqrt(dx * dx + dy * dy);

    if (dist > 180) {
      this._showToast('วางให้อยู่บนตัวกระทงนะ 🪷');
      return;
    }

    let rotation = Math.atan2(dy, dx) + Math.PI / 2;
    if (this.state.activeItemType === 'candle_center' || this.state.activeItemType === 'incense_trio') {
      rotation = 0;
    }

    const item = {
      id: Date.now() + Math.random().toString(36).substring(2, 6),
      type: this.state.activeItemType,
      x: clickX,
      y: clickY,
      rotation,
      scale: 1,
      placedBy: this.state.player.name
    };

    this.state.krathong.items.push(item);
    this.renderKrathongCanvas();
    AudioFX.playPlace();
    this.network.send({ type: 'PLACE_ITEM', item });
  }

  _autoArrangeRing() {
    const type = this.state.activeItemType.includes('petal') ? this.state.activeItemType : 'petal_folded';
    const count = 12;
    const radius = 95;
    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 2;
      const x = 240 + Math.cos(angle) * radius;
      const y = 240 + Math.sin(angle) * radius;
      this.state.krathong.items.push({
        id: Date.now() + i,
        type,
        x,
        y,
        rotation: angle + Math.PI / 2,
        scale: 1,
        placedBy: this.state.player.name
      });
    }
    this.renderKrathongCanvas();
    AudioFX.playPlace();
  }

  _autoScatterFlowers() {
    const flowerTypes = ['flower_marigold', 'flower_lotus_bloom', 'flower_orchid', 'flower_crown'];
    for (let i = 0; i < 8; i++) {
      const angle = Math.random() * Math.PI * 2;
      const dist = 25 + Math.random() * 55;
      const x = 240 + Math.cos(angle) * dist;
      const y = 240 + Math.sin(angle) * dist;
      const type = flowerTypes[Math.floor(Math.random() * flowerTypes.length)];
      this.state.krathong.items.push({
        id: Date.now() + i,
        type,
        x,
        y,
        rotation: Math.random() * Math.PI * 2,
        scale: 0.9,
        placedBy: this.state.player.name
      });
    }
    this.renderKrathongCanvas();
    AudioFX.playPlace();
  }

  renderKrathongCanvas() {
    const ctx = this.krathongCtx;
    const canvas = this.dom.canvas.krathong;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    SpriteEngine.drawBase(ctx, this.state.krathong.base, 240, 240, 110);

    const priority = {
      petal_folded: 1, petal_rose: 1, petal_lotus_pink: 1,
      flower_crown: 2, flower_globe: 2, flower_marigold: 3, flower_lotus_bloom: 3, flower_orchid: 3,
      coin_gold: 4, incense_trio: 5, candle_center: 6
    };

    const sortedItems = [...this.state.krathong.items].sort((a, b) => {
      return (priority[a.type] || 2) - (priority[b.type] || 2);
    });

    sortedItems.forEach(item => {
      SpriteEngine.drawItem(ctx, item, this.state.isLit);
    });

    document.getElementById('stat-item-count').textContent = `${this.state.krathong.items.length} ชิ้น`;
    const hasCandle = this.state.krathong.items.some(i => i.type === 'candle_center');
    const hasIncense = this.state.krathong.items.some(i => i.type === 'incense_trio');
    const sacredReady = document.getElementById('stat-sacred-ready');
    if (hasCandle && hasIncense) {
      sacredReady.textContent = 'ครบถ้วนสมบูรณ์ ✨';
      sacredReady.className = 'font-thai text-emerald-400 font-bold';
    } else {
      sacredReady.textContent = 'ยังขาดธูปหรือเทียน';
      sacredReady.className = 'font-thai text-rose-400';
    }
  }

  _openWishLightModal() {
    this.dom.modals.wishLight.classList.remove('hidden');
    const hasCandle = this.state.krathong.items.some(i => i.type === 'candle_center');
    if (!hasCandle) {
      this.state.krathong.items.push({
        id: 'auto-candle',
        type: 'candle_center',
        x: 240,
        y: 228,
        scale: 1,
        rotation: 0
      });
      this.renderKrathongCanvas();
    }
  }

  _setMatchHoldState(playerKey, isHolding) {
    const matchEl = document.getElementById(`match-${playerKey}`);
    if (isHolding) {
      matchEl.classList.add('match-holding');
      matchEl.textContent = '🔥';
    } else {
      matchEl.classList.remove('match-holding');
      matchEl.textContent = '🪵';
    }
  }

  _checkDualIgnition() {
    const isP1Hold = this.state.isHoldingMatch;
    const isP2Hold = this.state.isSolo || this.state.partner.isHoldingMatch;

    if (isP1Hold && isP2Hold && !this.state.isLit) {
      this.state.isLit = true;
      AudioFX.playFlameIgnite();

      const sparkEl = document.getElementById('central-spark');
      sparkEl.classList.add('spark-ignited');
      sparkEl.textContent = '🔥✨';

      if (typeof confetti === 'function') {
        confetti({
          particleCount: 70,
          spread: 80,
          origin: { y: 0.6 },
          colors: ['#f59e0b', '#ec4899', '#fef08a']
        });
      }

      this._showToast('✨ แสงเทียนสว่างไสวแล้ว! ทั้งสองคนจุดติดพร้อมกัน ✨');
      this.network.send({ type: 'CANDLE_IGNITED' });

      setTimeout(() => {
        this.dom.modals.wishLight.classList.add('hidden');
        this._startRiverScene();
      }, 1800);
    }
  }

  _startRiverScene() {
    this._switchScreen('river');
    this.riverScene.start(
      this.state.krathong,
      this.state.player,
      this.state.partner
    );
  }

  _triggerRiverLaunch() {
    const banner = document.getElementById('river-launch-banner');
    if (banner) banner.classList.add('hidden');

    this.riverScene.launchMainKrathong();
    AudioFX.playSplash();
    this._showToast('🌊 ปล่อยกระทงลงสู่แม่น้ำแล้ว! ขอให้คำอธิษฐานเป็นจริง');

    setTimeout(() => this.riverScene.spawnFireworks(), 300);
    setTimeout(() => this.riverScene.spawnLantern(), 800);
    setTimeout(() => this.riverScene.spawnFireworks(), 1500);

    setTimeout(() => {
      this._openSouvenirModal();
    }, 4500);
  }

  _openSouvenirModal() {
    this.dom.modals.souvenir.classList.remove('hidden');
    SouvenirCard.render(
      this.dom.canvas.souvenir,
      this.state.krathong,
      this.state.player,
      this.state.partner,
      this.state.roomCode
    );
  }

  _bindNetworkEvents() {
    this.network.on('connected', (info) => {
      this.state.partner.isConnected = true;
      this._updatePartnerUI();
      this._showToast('เพื่อนร่วมห้องเชื่อมต่อแล้ว! 🤝 เริ่มทำกระทงด้วยกันได้เลย');

      this.network.send({
        type: 'PLAYER_INFO',
        player: this.state.player,
        krathong: this.state.krathong
      });
    });

    this.network.on('disconnected', () => {
      this.state.partner.isConnected = false;
      this._updatePartnerUI();
      this._showToast('เพื่อนขาดการเชื่อมต่อไป');
    });

    this.network.on('message', (msg) => {
      this._handlePartnerMessage(msg);
    });
  }

  _updatePartnerUI() {
    const isConn = this.state.partner.isConnected;
    this.dom.partnerStatusDot.className = `w-2 h-2 rounded-full ${isConn ? 'bg-emerald-400' : 'bg-slate-500'}`;
    this.dom.partnerStatusText.textContent = isConn ? `${this.state.partner.avatar} ${this.state.partner.name}` : 'รอเพื่อน...';

    document.getElementById('p2-avatar-badge').textContent = this.state.partner.avatar;
    document.getElementById('p2-name-badge').textContent = `${this.state.partner.name}`;
    document.getElementById('p2-status-pill').textContent = isConn ? 'ONLINE' : 'WAITING';
    document.getElementById('p2-status-pill').className = `text-[10px] px-2 py-0.5 rounded-full ${isConn ? 'bg-emerald-950 text-emerald-400' : 'bg-slate-800 text-slate-400'}`;
    document.getElementById('match-p2-label').textContent = this.state.partner.name;
  }

  _handlePartnerMessage(msg) {
    switch (msg.type) {
      case 'PLAYER_INFO':
        if (msg.player) {
          this.state.partner.name = msg.player.name || 'Partner';
          this.state.partner.avatar = msg.player.avatar || '🌙';
          this.state.partner.isConnected = true;
          this._updatePartnerUI();
        }
        if (msg.krathong && !this.network.isHost) {
          this.state.krathong = msg.krathong;
          this.renderKrathongCanvas();
        }
        break;

      case 'CURSOR_MOVE':
        this._movePartnerCursor(msg.relX, msg.relY, msg.avatar);
        break;

      case 'SET_BASE':
        this.state.krathong.base = msg.base;
        document.querySelectorAll('.base-card').forEach(b => {
          b.classList.toggle('selected', b.getAttribute('data-base') === msg.base);
        });
        this.renderKrathongCanvas();
        break;

      case 'PLACE_ITEM':
        this.state.krathong.items.push(msg.item);
        this.renderKrathongCanvas();
        AudioFX.playPlace();
        break;

      case 'UNDO_ITEM':
        if (this.state.krathong.items.length > 0) {
          this.state.krathong.items.pop();
          this.renderKrathongCanvas();
        }
        break;

      case 'CLEAR_ITEMS':
        this.state.krathong.items = [];
        this.renderKrathongCanvas();
        break;

      case 'AUTO_RING':
        this._autoArrangeRing();
        break;

      case 'AUTO_SCATTER':
        this._autoScatterFlowers();
        break;

      case 'REACTION':
        this._showToast(`${msg.sender || 'Partner'}: ${msg.emoji}`);
        break;

      case 'OPEN_LIGHT_MODAL':
        this._openWishLightModal();
        break;

      case 'UPDATE_WISH':
        this.state.partner.wish = msg.wish;
        document.getElementById('p2-wish-preview').textContent = `"${msg.wish || '...'}"`;
        document.getElementById('partner-wish-display').textContent = `"${msg.wish || 'ยังไม่ได้เขียน...'}"`;
        break;

      case 'MATCH_HOLD':
        this.state.partner.isHoldingMatch = msg.holding;
        this._setMatchHoldState('p2', msg.holding);
        if (msg.holding) AudioFX.playMatchStrike();
        this._checkDualIgnition();
        break;

      case 'CANDLE_IGNITED':
        if (!this.state.isLit) {
          this.state.isLit = true;
          AudioFX.playFlameIgnite();
          setTimeout(() => {
            this.dom.modals.wishLight.classList.add('hidden');
            this._startRiverScene();
          }, 1800);
        }
        break;

      case 'READY_LAUNCH':
        this.state.launchReady.partner = true;
        document.getElementById('launch-sync-status').textContent = 'เพื่อนพร้อมแล้ว! กดเพื่อปล่อยเลย!';
        if (this.state.launchReady.self) {
          this._triggerRiverLaunch();
        }
        break;

      case 'RIVER_ACTION':
        if (msg.action === 'lantern') this.riverScene.spawnLantern();
        if (msg.action === 'fireworks') this.riverScene.spawnFireworks();
        if (msg.action === 'ripple') {
          this.riverScene.addRipple(msg.x, msg.y);
          AudioFX.playSplash();
        }
        break;

      default:
        break;
    }
  }

  _movePartnerCursor(relX, relY, avatar) {
    const rect = this.dom.canvas.krathong.getBoundingClientRect();
    const cur = this.dom.partnerCursor;
    cur.classList.remove('hidden');
    const x = rect.left + relX * rect.width;
    const y = rect.top + relY * rect.height;
    cur.style.transform = `translate(${x}px, ${y}px)`;
    this.dom.partnerCursorLabel.textContent = `${avatar || '🌙'} ${this.state.partner.name}`;
  }
}

// Initialize on DOM load
window.addEventListener('DOMContentLoaded', () => {
  window.app = new App();
  window.app.init();
});
