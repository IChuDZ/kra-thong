/**
 * Animated 2D Pixel River Scene
 * Full Moon, Candlelit Waters, Floating Sky Lanterns, and Fireworks
 */
import { SpriteEngine } from './sprites.js';
import { AudioFX } from './audio.js';

export class RiverScene {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.animationId = null;

    // Krathong design reference
    this.krathongData = null;
    this.isLit = true;
    this.player1Info = { name: 'Player 1', wish: '' };
    this.player2Info = { name: 'Partner', wish: '' };

    // Dynamic Elements
    this.stars = [];
    this.lanterns = [];
    this.ambientKrathongs = [];
    this.ripples = [];
    this.fireworkParticles = [];
    this.fireflies = [];

    // Main Krathong State in River
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
      x,
      y,
      radius: 5,
      maxRadius: 65,
      opacity: 0.8
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
        x: fx,
        y: fy,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        color: chosenColor,
        alpha: 1,
        life: 1,
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

    // 1. Main Krathong Movement
    if (this.mainKrathong.isLaunched) {
      // Gentle drift downstream towards right-center
      this.mainKrathong.x += this.mainKrathong.driftSpeedX;
      // Slight vertical bobbing
      this.mainKrathong.bobOffset = Math.sin(now / 450) * 4;
      if (this.mainKrathong.x > w + 200) {
        this.mainKrathong.x = -150; // Wrap around
      }
    } else {
      this.mainKrathong.bobOffset = Math.sin(now / 600) * 2;
    }

    // 2. Ambient background Krathongs
    this.ambientKrathongs.forEach(k => {
      k.x += k.speed;
      if (k.x > w + 100) k.x = -80;
    });

    // 3. Sky Lanterns
    for (let i = this.lanterns.length - 1; i >= 0; i--) {
      const l = this.lanterns[i];
      l.sway += 0.03;
      l.x += l.vx + Math.sin(l.sway) * 0.3;
      l.y += l.vy;
      l.scale *= 0.9985; // Shrink as it floats higher into space
      if (l.y < -50 || l.scale < 0.1) {
        this.lanterns.splice(i, 1);
      }
    }

    // 4. Ripples
    for (let i = this.ripples.length - 1; i >= 0; i--) {
      const r = this.ripples[i];
      r.radius += 0.65;
      r.opacity -= 0.012;
      if (r.opacity <= 0) {
        this.ripples.splice(i, 1);
      }
    }

    // 5. Fireworks
    for (let i = this.fireworkParticles.length - 1; i >= 0; i--) {
      const p = this.fireworkParticles[i];
      p.x += p.vx;
      p.y += p.vy;
      p.vy += 0.04; // gravity
      p.alpha -= p.decay;
      if (p.alpha <= 0) {
        this.fireworkParticles.splice(i, 1);
      }
    }

    // 6. Fireflies
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

    // 1. Night Sky Gradient
    const skyGrad = ctx.createLinearGradient(0, 0, 0, riverHorizon);
    skyGrad.addColorStop(0, '#060a17');
    skyGrad.addColorStop(0.65, '#0e162f');
    skyGrad.addColorStop(1, '#1b2345');
    ctx.fillStyle = skyGrad;
    ctx.fillRect(0, 0, w, riverHorizon);

    // 2. Stars
    this.stars.forEach(s => {
      const tw = 0.5 + Math.sin(now * s.twinkleSpeed + s.phase) * 0.5;
      ctx.fillStyle = `rgba(254, 240, 138, ${tw * 0.8})`;
      ctx.fillRect(s.x, s.y, s.size, s.size);
    });

    // 3. Full Moon (คืนเพ็ญเดือน 12)
    const moonX = w * 0.82;
    const moonY = h * 0.18;
    const moonRadius = 44;

    // Moon Atmospheric Glow
    const moonGlow = ctx.createRadialGradient(moonX, moonY, moonRadius * 0.8, moonX, moonY, moonRadius * 3.5);
    moonGlow.addColorStop(0, 'rgba(254, 243, 199, 0.45)');
    moonGlow.addColorStop(0.5, 'rgba(251, 191, 36, 0.12)');
    moonGlow.addColorStop(1, 'rgba(251, 191, 36, 0)');
    ctx.fillStyle = moonGlow;
    ctx.beginPath();
    ctx.arc(moonX, moonY, moonRadius * 3.5, 0, Math.PI * 2);
    ctx.fill();

    // Moon Body
    ctx.beginPath();
    ctx.arc(moonX, moonY, moonRadius, 0, Math.PI * 2);
    ctx.fillStyle = '#fef08a';
    ctx.fill();

    // Moon Subtle Pixel Craters
    ctx.fillStyle = '#fde047';
    ctx.beginPath();
    ctx.arc(moonX - 12, moonY - 8, 8, 0, Math.PI * 2);
    ctx.arc(moonX + 14, moonY + 10, 11, 0, Math.PI * 2);
    ctx.arc(moonX + 4, moonY - 18, 6, 0, Math.PI * 2);
    ctx.fill();

    // 4. Distant Shoreline Silhouettes (Pagoda & Palms)
    this._drawShorelineSilhouettes(ctx, w, riverHorizon);

    // 5. River Water Gradient
    const waterGrad = ctx.createLinearGradient(0, riverHorizon, 0, h);
    waterGrad.addColorStop(0, '#091224');
    waterGrad.addColorStop(0.3, '#0d1d3a');
    waterGrad.addColorStop(0.7, '#07152b');
    waterGrad.addColorStop(1, '#020617');
    ctx.fillStyle = waterGrad;
    ctx.fillRect(0, riverHorizon, w, h - riverHorizon);

    // 6. Moon Reflection on Water Surface
    const moonReflectW = moonRadius * 2.2;
    for (let y = riverHorizon; y < h; y += 8) {
      const progress = (y - riverHorizon) / (h - riverHorizon);
      const waveX = Math.sin(y * 0.05 + now / 300) * (12 + progress * 25);
      const span = (moonReflectW + progress * 80) * (0.6 + Math.sin(y * 0.1) * 0.4);
      ctx.fillStyle = `rgba(254, 240, 138, ${0.18 - progress * 0.12})`;
      ctx.fillRect(moonX + waveX - span / 2, y, span, 4);
    }

    // 7. Ambient River Currents (Shimmering Waves)
    ctx.fillStyle = 'rgba(56, 189, 248, 0.08)';
    for (let y = riverHorizon + 15; y < h; y += 22) {
      const waveOffset = Math.sin(y * 0.08 + now / 500) * 20;
      ctx.fillRect(waveOffset, y, w, 2);
    }

    // 8. Background Ambient Krathongs
    this.ambientKrathongs.forEach(k => {
      ctx.save();
      ctx.translate(k.x, k.y + Math.sin(now / 500 + k.flicker) * 2);
      ctx.scale(k.scale, k.scale);
      SpriteEngine.drawBase(ctx, k.baseType, 0, 0, 40);
      SpriteEngine.drawItem(ctx, { type: 'candle_center', x: 0, y: -8, scale: 0.7 }, true);
      // Glow on water
      ctx.beginPath();
      ctx.ellipse(0, 12, 35, 12, 0, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(251, 191, 36, 0.25)';
      ctx.fill();
      ctx.restore();
    });

    // 9. Water Ripples
    this.ripples.forEach(r => {
      ctx.beginPath();
      ctx.ellipse(r.x, r.y, r.radius * 1.6, r.radius * 0.7, 0, 0, Math.PI * 2);
      ctx.strokeStyle = `rgba(186, 230, 253, ${r.opacity})`;
      ctx.lineWidth = 1.5;
      ctx.stroke();
    });

    // 10. The Couple's Main Krathong
    this._drawMainKrathong(ctx, now);

    // 11. Sky Lanterns (โคมลอย)
    this.lanterns.forEach(l => {
      this._drawSkyLantern(ctx, l.x, l.y, l.scale);
    });

    // 12. Fireworks
    this.fireworkParticles.forEach(p => {
      ctx.fillStyle = p.color;
      ctx.globalAlpha = Math.max(0, p.alpha);
      ctx.fillRect(p.x - 2, p.y - 2, 4, 4);
      ctx.globalAlpha = 1.0;
    });

    // 13. Fireflies
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

    // Distant Chedi (Pagoda) Silhouette on left
    const chediX = w * 0.18;
    ctx.lineTo(chediX - 35, horizon);
    ctx.lineTo(chediX - 25, horizon - 15);
    ctx.lineTo(chediX - 15, horizon - 35);
    ctx.lineTo(chediX - 6, horizon - 65);
    ctx.lineTo(chediX, horizon - 90); // Spire tip
    ctx.lineTo(chediX + 6, horizon - 65);
    ctx.lineTo(chediX + 15, horizon - 35);
    ctx.lineTo(chediX + 25, horizon - 15);
    ctx.lineTo(chediX + 35, horizon);

    // Distant Temple Roof Spire
    const templeX = w * 0.42;
    ctx.lineTo(templeX - 30, horizon);
    ctx.lineTo(templeX - 15, horizon - 35);
    ctx.lineTo(templeX, horizon - 55);
    ctx.lineTo(templeX + 15, horizon - 35);
    ctx.lineTo(templeX + 30, horizon);

    // Palm tree fronds silhouette
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

    // Golden Water Glow under main Krathong
    const waterGlow = ctx.createRadialGradient(0, 15, 20, 0, 15, 140);
    waterGlow.addColorStop(0, 'rgba(251, 191, 36, 0.4)');
    waterGlow.addColorStop(0.5, 'rgba(245, 158, 11, 0.15)');
    waterGlow.addColorStop(1, 'rgba(245, 158, 11, 0)');
    ctx.fillStyle = waterGlow;
    ctx.beginPath();
    ctx.ellipse(0, 20, 140, 45, 0, 0, Math.PI * 2);
    ctx.fill();

    // Draw Krathong Base
    SpriteEngine.drawBase(ctx, this.krathongData.base, 0, 0, 75);

    // Draw Items
    if (this.krathongData.items) {
      this.krathongData.items.forEach(item => {
        // Rescale relative to crafting canvas (480 -> 150)
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

    // Two Floating Prayer Scroll Tags
    this._drawWishTags(ctx, -60, 45, this.player1Info.name, this.player1Info.wish, '#fef08a');
    this._drawWishTags(ctx, 60, 45, this.player2Info.name, this.player2Info.wish, '#fbcfe8');

    ctx.restore();
  }

  _drawWishTags(ctx, x, y, name, wish, color) {
    if (!name) return;
    ctx.save();
    ctx.translate(x, y);

    // Fluttering String & Little Parchment tag
    ctx.strokeStyle = 'rgba(254, 240, 138, 0.6)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(0, -15);
    ctx.lineTo(0, 0);
    ctx.stroke();

    // Parchment Body
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.roundRect(-30, 0, 60, 24, 4);
    ctx.fill();
    ctx.strokeStyle = '#78350f';
    ctx.lineWidth = 1;
    ctx.stroke();

    // Name Text
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

    // Warm Lantern Glow
    const glow = ctx.createRadialGradient(0, 0, 10, 0, 0, 45);
    glow.addColorStop(0, 'rgba(251, 191, 36, 0.5)');
    glow.addColorStop(0.7, 'rgba(245, 158, 11, 0.15)');
    glow.addColorStop(1, 'rgba(245, 158, 11, 0)');
    ctx.fillStyle = glow;
    ctx.beginPath();
    ctx.arc(0, 0, 45, 0, Math.PI * 2);
    ctx.fill();

    // Cylindrical Lantern Paper Body (Khom Loy)
    ctx.fillStyle = '#fef08a';
    ctx.beginPath();
    ctx.moveTo(-16, -26);
    ctx.lineTo(16, -26);
    ctx.lineTo(20, 18);
    ctx.lineTo(-20, 18);
    ctx.closePath();
    ctx.fill();

    // Bamboo rings
    ctx.strokeStyle = '#b45309';
    ctx.lineWidth = 1.5;
    ctx.stroke();

    // Center Flame inside lantern
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
