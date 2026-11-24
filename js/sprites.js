/**
 * Cozy Pixel-Art Sprites Engine for Loy Krathong
 * Procedurally draws crisp pixel-art assets onto 2D canvas context
 */

export const SpriteEngine = {
  // Color Palettes
  colors: {
    bananaRindDark: '#1b4332',
    bananaRindMid: '#2d6a4f',
    bananaFleshOuter: '#d8f3dc',
    bananaFleshInner: '#f0fdf4',
    bananaPith: '#e0e7ff',

    breadDark: '#78350f',
    breadMid: '#b45309',
    breadLight: '#f59e0b',
    breadCrumb: '#fef3c7',

    iceDark: '#0891b2',
    iceMid: '#22d3ee',
    iceLight: '#cffafe',
    iceGlow: 'rgba(34, 211, 238, 0.4)',

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
    orchidWhite: '#faf5ff',

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

  /**
   * Draw the chosen Krathong Base
   */
  drawBase(ctx, baseType, centerX, centerY, radius = 110) {
    ctx.save();
    ctx.translate(centerX, centerY);

    // Drop Shadow under base
    ctx.beginPath();
    ctx.ellipse(0, 12, radius * 1.05, radius * 0.95, 0, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(2, 6, 23, 0.65)';
    ctx.fill();

    switch (baseType) {
      case 'bread':
        this._drawTurtleBread(ctx, radius);
        break;
      case 'ice':
        this._drawIceBase(ctx, radius);
        break;
      case 'lotus_leaf':
        this._drawLotusLeafBase(ctx, radius);
        break;
      case 'banana':
      default:
        this._drawBananaTrunk(ctx, radius);
        break;
    }

    ctx.restore();
  },

  // Banana Trunk Base
  _drawBananaTrunk(ctx, r) {
    // Outer Rind (Dark Green)
    ctx.beginPath();
    ctx.arc(0, 0, r, 0, Math.PI * 2);
    ctx.fillStyle = this.colors.bananaRindDark;
    ctx.fill();

    // Mid Rind
    ctx.beginPath();
    ctx.arc(0, 0, r - 6, 0, Math.PI * 2);
    ctx.fillStyle = this.colors.bananaRindMid;
    ctx.fill();

    // Outer Flesh
    ctx.beginPath();
    ctx.arc(0, 0, r - 12, 0, Math.PI * 2);
    ctx.fillStyle = this.colors.bananaFleshOuter;
    ctx.fill();

    // Pith Rings & Fiber Texture
    ctx.beginPath();
    ctx.arc(0, 0, r * 0.65, 0, Math.PI * 2);
    ctx.fillStyle = this.colors.bananaFleshInner;
    ctx.fill();

    // Inner Core
    ctx.beginPath();
    ctx.arc(0, 0, r * 0.28, 0, Math.PI * 2);
    ctx.fillStyle = '#fef9c3';
    ctx.fill();

    // Subtle Radial Fiber Dots
    ctx.fillStyle = '#bbf7d0';
    for (let i = 0; i < 16; i++) {
      const angle = (i / 16) * Math.PI * 2;
      const dist = r * 0.45;
      ctx.fillRect(Math.cos(angle) * dist - 2, Math.sin(angle) * dist - 2, 4, 4);
    }
  },

  // Turtle Bread Base
  _drawTurtleBread(ctx, r) {
    const c = this.colors;
    // 4 Flippers
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

    // Turtle Head
    ctx.beginPath();
    ctx.ellipse(0, -r * 1.05, 24, 28, 0, 0, Math.PI * 2);
    ctx.fillStyle = c.breadMid;
    ctx.fill();
    // Head Highlight
    ctx.beginPath();
    ctx.ellipse(0, -r * 1.05 - 4, 16, 18, 0, 0, Math.PI * 2);
    ctx.fillStyle = c.breadLight;
    ctx.fill();
    // Eyes
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(-8, -r * 1.05 - 6, 3, 3);
    ctx.fillRect(5, -r * 1.05 - 6, 3, 3);

    // Shell Body
    ctx.beginPath();
    ctx.arc(0, 0, r * 0.95, 0, Math.PI * 2);
    ctx.fillStyle = c.breadDark;
    ctx.fill();

    ctx.beginPath();
    ctx.arc(0, 0, r * 0.9, 0, Math.PI * 2);
    ctx.fillStyle = c.breadMid;
    ctx.fill();

    // Shell Patterns (Baked Bread scored marks)
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

  // Ice Base (Translucent Glowing)
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

    // Crystal Shards & facets
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 2;
    ctx.beginPath();
    for (let i = 0; i < 8; i++) {
      const angle = (i / 8) * Math.PI * 2;
      const x1 = Math.cos(angle) * (r * 0.3);
      const y1 = Math.sin(angle) * (r * 0.3);
      const x2 = Math.cos(angle + 0.4) * (r * 0.85);
      const y2 = Math.sin(angle + 0.4) * (r * 0.85);
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
    }
    ctx.stroke();
  },

  // Lotus Leaf Base
  _drawLotusLeafBase(ctx, r) {
    ctx.beginPath();
    // Scalloped wavy edge
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

    // Inner leaf
    ctx.beginPath();
    ctx.arc(0, 0, r - 8, 0, Math.PI * 2);
    ctx.fillStyle = '#16a34a';
    ctx.fill();

    // Leaf Veins radiating outward
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

  /**
   * Draw an individual Item/Decoration
   */
  drawItem(ctx, item, isLit = false) {
    ctx.save();
    ctx.translate(item.x, item.y);
    if (item.rotation) ctx.rotate(item.rotation);
    if (item.scale) ctx.scale(item.scale, item.scale);

    switch (item.type) {
      case 'petal_folded':
        this._drawFoldedLeaf(ctx);
        break;
      case 'petal_rose':
        this._drawRoseLeaf(ctx);
        break;
      case 'petal_lotus_pink':
        this._drawLotusPetal(ctx);
        break;
      case 'flower_marigold':
        this._drawMarigold(ctx);
        break;
      case 'flower_lotus_bloom':
        this._drawBloomingLotus(ctx);
        break;
      case 'flower_orchid':
        this._drawOrchid(ctx);
        break;
      case 'flower_crown':
        this._drawCrownFlower(ctx);
        break;
      case 'flower_globe':
        this._drawGlobeFlower(ctx);
        break;
      case 'coin_gold':
        this._drawGoldCoin(ctx);
        break;
      case 'candle_center':
        this._drawCandle(ctx, isLit);
        break;
      case 'incense_trio':
        this._drawIncense(ctx, isLit);
        break;
      default:
        break;
    }

    ctx.restore();
  },

  // Folded Banana Leaf (กลีบผกา)
  _drawFoldedLeaf(ctx) {
    const c = this.colors;
    ctx.beginPath();
    ctx.moveTo(0, -32); // Pointy tip
    ctx.lineTo(14, 0);
    ctx.lineTo(8, 18);
    ctx.lineTo(-8, 18);
    ctx.lineTo(-14, 0);
    ctx.closePath();
    ctx.fillStyle = c.leafDark;
    ctx.fill();

    // Inner fold highlights
    ctx.beginPath();
    ctx.moveTo(0, -28);
    ctx.lineTo(10, -2);
    ctx.lineTo(0, 14);
    ctx.lineTo(-10, -2);
    ctx.closePath();
    ctx.fillStyle = c.leafMid;
    ctx.fill();

    // Central Fold Ridge
    ctx.beginPath();
    ctx.moveTo(0, -28);
    ctx.lineTo(0, 14);
    ctx.strokeStyle = c.leafLight;
    ctx.lineWidth = 2;
    ctx.stroke();

    // Golden Pin head at base
    ctx.beginPath();
    ctx.arc(0, 10, 2.5, 0, Math.PI * 2);
    ctx.fillStyle = c.leafGoldPin;
    ctx.fill();
  },

  // Rose-folded leaf (กลีบกุหลาบ)
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

    // Central Pin
    ctx.fillStyle = c.leafGoldPin;
    ctx.fillRect(-2, -2, 4, 4);
  },

  // Lotus Petal Pink
  _drawLotusPetal(ctx) {
    const c = this.colors;
    ctx.beginPath();
    ctx.moveTo(0, -28);
    ctx.quadraticCurveTo(14, -10, 10, 14);
    ctx.lineTo(-10, 14);
    ctx.quadraticCurveTo(-14, -10, 0, -28);
    ctx.fillStyle = c.lotusPinkMid;
    ctx.fill();

    // Gradient to light pink
    ctx.beginPath();
    ctx.moveTo(0, -24);
    ctx.quadraticCurveTo(8, -8, 6, 10);
    ctx.lineTo(-6, 10);
    ctx.quadraticCurveTo(-8, -8, 0, -24);
    ctx.fillStyle = c.lotusPinkLight;
    ctx.fill();

    // White base
    ctx.beginPath();
    ctx.ellipse(0, 8, 5, 4, 0, 0, Math.PI * 2);
    ctx.fillStyle = c.lotusWhite;
    ctx.fill();
  },

  // Golden Marigold (ดาวเรือง)
  _drawMarigold(ctx) {
    const c = this.colors;
    ctx.beginPath();
    ctx.arc(0, 0, 16, 0, Math.PI * 2);
    ctx.fillStyle = c.marigoldDark;
    ctx.fill();

    // Petal clusters
    for (let i = 0; i < 8; i++) {
      const a = (i / 8) * Math.PI * 2;
      const x = Math.cos(a) * 9;
      const y = Math.sin(a) * 9;
      ctx.beginPath();
      ctx.arc(x, y, 7, 0, Math.PI * 2);
      ctx.fillStyle = c.marigoldMid;
      ctx.fill();
    }

    // Center fluff
    ctx.beginPath();
    ctx.arc(0, 0, 7, 0, Math.PI * 2);
    ctx.fillStyle = c.marigoldLight;
    ctx.fill();
  },

  // Blooming Sacred Lotus
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
    // Center pollen disc
    ctx.beginPath();
    ctx.arc(0, 0, 9, 0, Math.PI * 2);
    ctx.fillStyle = '#fde047';
    ctx.fill();
    ctx.fillStyle = '#854d0e';
    for (let i = 0; i < 6; i++) {
      const a = (i / 6) * Math.PI * 2;
      ctx.fillRect(Math.cos(a) * 5 - 1.5, Math.sin(a) * 5 - 1.5, 3, 3);
    }
  },

  // Thai Orchid (กล้วยไม้)
  _drawOrchid(ctx) {
    const c = this.colors;
    // 3 upper petals
    for (let i = -1; i <= 1; i++) {
      ctx.beginPath();
      ctx.ellipse(i * 10, -10, 7, 10, i * 0.4, 0, Math.PI * 2);
      ctx.fillStyle = c.orchidPurpleMid;
      ctx.fill();
    }
    // 2 lower wing petals
    ctx.beginPath();
    ctx.ellipse(-10, 4, 8, 9, -0.4, 0, Math.PI * 2);
    ctx.ellipse(10, 4, 8, 9, 0.4, 0, Math.PI * 2);
    ctx.fillStyle = c.orchidPurpleDark;
    ctx.fill();
    // Center Lip
    ctx.beginPath();
    ctx.arc(0, 0, 5, 0, Math.PI * 2);
    ctx.fillStyle = '#fef08a';
    ctx.fill();
  },

  // Crown Flower (ดอกรัก)
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

  // Globe Amaranth (บานไม่รู้โรย)
  _drawGlobeFlower(ctx) {
    ctx.beginPath();
    ctx.arc(0, 0, 11, 0, Math.PI * 2);
    ctx.fillStyle = this.colors.globePurple;
    ctx.fill();
    // Spiky pixel surface
    ctx.fillStyle = '#f472b6';
    for (let i = 0; i < 10; i++) {
      const a = (i / 10) * Math.PI * 2;
      ctx.fillRect(Math.cos(a) * 8 - 1.5, Math.sin(a) * 8 - 1.5, 3, 3);
    }
  },

  // Golden Lucky Coin
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

    // Center Square / Emblem
    ctx.strokeStyle = c.coinEdge;
    ctx.lineWidth = 1.5;
    ctx.strokeRect(-4, -4, 8, 8);
  },

  // Golden Candle with Wick & Optional Animated Flame
  _drawCandle(ctx, isLit) {
    const c = this.colors;
    // Candle wax body
    ctx.beginPath();
    ctx.roundRect(-5, -2, 10, 36, 4);
    ctx.fillStyle = c.candleWaxMid;
    ctx.fill();

    // Wax top rim
    ctx.beginPath();
    ctx.ellipse(0, -2, 5, 2.5, 0, 0, Math.PI * 2);
    ctx.fillStyle = c.candleWaxYellow;
    ctx.fill();

    // Wick
    ctx.beginPath();
    ctx.moveTo(0, -2);
    ctx.lineTo(0, -9);
    ctx.strokeStyle = c.candleWick;
    ctx.lineWidth = 2;
    ctx.stroke();

    // Flame if Lit
    if (isLit) {
      this.drawFlame(ctx, 0, -11, 1);
    }
  },

  // Trio of Incense Sticks with Glowing Embers
  _drawIncense(ctx, isLit) {
    const c = this.colors;
    const offsets = [-4, 0, 4];
    offsets.forEach(x => {
      // Stick
      ctx.beginPath();
      ctx.moveTo(x, 26);
      ctx.lineTo(x, -26);
      ctx.strokeStyle = c.incenseStick;
      ctx.lineWidth = 2;
      ctx.stroke();

      // Ember tip
      ctx.beginPath();
      ctx.arc(x, -26, isLit ? 2.5 : 1.5, 0, Math.PI * 2);
      ctx.fillStyle = isLit ? c.incenseTip : '#451a03';
      ctx.fill();

      // Incense smoke curl if lit
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

  // Animated Pixel Flame
  drawFlame(ctx, x, y, scale = 1, flicker = 0) {
    const c = this.colors;
    ctx.save();
    ctx.translate(x, y);
    ctx.scale(scale, scale);

    const flickY = Math.sin(Date.now() / 90 + flicker) * 2;
    const flickX = Math.cos(Date.now() / 110 + flicker) * 1.5;

    // Golden ambient bloom circle
    const radGlow = ctx.createRadialGradient(0, 0, 2, 0, 0, 32);
    radGlow.addColorStop(0, 'rgba(251, 191, 36, 0.7)');
    radGlow.addColorStop(0.5, 'rgba(245, 158, 11, 0.25)');
    radGlow.addColorStop(1, 'rgba(245, 158, 11, 0)');
    ctx.fillStyle = radGlow;
    ctx.beginPath();
    ctx.arc(0, 0, 32, 0, Math.PI * 2);
    ctx.fill();

    // Outer Orange Flame
    ctx.beginPath();
    ctx.moveTo(0, -18 + flickY);
    ctx.quadraticCurveTo(8 + flickX, -8, 5, 2);
    ctx.quadraticCurveTo(0, 5, -5, 2);
    ctx.quadraticCurveTo(-8 + flickX, -8, 0, -18 + flickY);
    ctx.fillStyle = c.flameOuter;
    ctx.fill();

    // Mid Yellow Flame
    ctx.beginPath();
    ctx.moveTo(0, -13 + flickY);
    ctx.quadraticCurveTo(5 + flickX, -6, 3, 1);
    ctx.quadraticCurveTo(0, 3, -3, 1);
    ctx.quadraticCurveTo(-5 + flickX, -6, 0, -13 + flickY);
    ctx.fillStyle = c.flameMid;
    ctx.fill();

    // Inner White Core
    ctx.beginPath();
    ctx.moveTo(0, -8 + flickY);
    ctx.quadraticCurveTo(2.5, -3, 1.5, 0);
    ctx.quadraticCurveTo(0, 1.5, -1.5, 0);
    ctx.quadraticCurveTo(-2.5, -3, 0, -8 + flickY);
    ctx.fillStyle = c.flameInner;
    ctx.fill();

    ctx.restore();
  },

  /**
   * Render preview icon on tiny tool cards
   */
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
