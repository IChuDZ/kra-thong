/**
 * Loy Krathong Co-op Main Application Controller
 */

import { SpriteEngine } from './sprites.js';
import { AudioFX } from './audio.js';
import { NetworkManager } from './network.js';
import { RiverScene } from './river.js';
import { SouvenirCard } from './souvenir.js';

class App {
  constructor() {
    this.network = new NetworkManager();
    this.riverScene = null;

    // App State
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

    // DOM Elements
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

    // Initialize River Engine
    this.riverScene = new RiverScene(this.dom.canvas.river);

    // Initial Krathong Render
    this.renderKrathongCanvas();

    console.log('Loy Krathong Co-op ready!');
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
    // Bases
    SpriteEngine.renderToolPreview('prev-base-banana', 'banana', 'base');
    SpriteEngine.renderToolPreview('prev-base-bread', 'bread', 'base');
    SpriteEngine.renderToolPreview('prev-base-ice', 'ice', 'base');
    SpriteEngine.renderToolPreview('prev-base-lotus-leaf', 'lotus_leaf', 'base');

    // Folded Leaves
    SpriteEngine.renderToolPreview('prev-petal-folded', 'petal_folded', 'item');
    SpriteEngine.renderToolPreview('prev-petal-rose', 'petal_rose', 'item');
    SpriteEngine.renderToolPreview('prev-petal-lotus', 'petal_lotus_pink', 'item');

    // Flowers & Sacred
    SpriteEngine.renderToolPreview('prev-flower-marigold', 'flower_marigold', 'item');
    SpriteEngine.renderToolPreview('prev-flower-lotus', 'flower_lotus_bloom', 'item');
    SpriteEngine.renderToolPreview('prev-flower-orchid', 'flower_orchid', 'item');
    SpriteEngine.renderToolPreview('prev-flower-crown', 'flower_crown', 'item');
    SpriteEngine.renderToolPreview('prev-flower-globe', 'flower_globe', 'item');
    SpriteEngine.renderToolPreview('prev-coin-gold', 'coin_gold', 'item');
    SpriteEngine.renderToolPreview('prev-candle', 'candle_center', 'item');
    SpriteEngine.renderToolPreview('prev-incense', 'incense_trio', 'item');
  }

  // ==========================================
  // UI Bindings
  // ==========================================
  _bindUIEvents() {
    // 1. Audio Toggle
    this.dom.soundToggleBtn.addEventListener('click', () => {
      const isUnmuted = AudioFX.toggleMute();
      this.dom.soundIcon.textContent = isUnmuted ? '🔊' : '🔇';
      this._showToast(isUnmuted ? 'เปิดเสียงดนตรีบำบัด & เสียงสายน้ำ' : 'ปิดเสียง');
    });

    // 2. Avatar Picker
    document.querySelectorAll('.avatar-option').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.avatar-option').forEach(b => b.classList.remove('selected'));
        btn.classList.add('selected');
        this.state.player.avatar = btn.getAttribute('data-avatar');
        AudioFX.playPlace();
      });
    });

    // 3. Create Room Button
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

    // 4. Join Room Button
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

    // 5. Solo Mode Button
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

    // 6. Copy Link Button
    this.dom.copyRoomLinkBtn.addEventListener('click', () => {
      const url = `${window.location.origin}${window.location.pathname}?room=${this.state.roomCode}`;
      navigator.clipboard.writeText(url).then(() => {
        this._showToast('คัดลอกลิงก์ห้องแล้ว! ส่งให้เพื่อนเปิดได้ทันที 📋');
      });
    });

    // 7. Base Selection
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

    // 8. Tool Item Selection
    document.querySelectorAll('.item-card').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.item-card').forEach(b => b.classList.remove('active-item'));
        btn.classList.add('active-item');
        this.state.activeItemType = btn.getAttribute('data-item-type');
        AudioFX.playPlace();
      });
    });

    // 9. Canvas Item Placement (Click & Touch)
    this.dom.canvas.krathong.addEventListener('click', (e) => this._handleCanvasClick(e));

    // 10. Partner Live Cursor Tracker on Workshop Canvas
    this.dom.canvas.krathong.addEventListener('mousemove', (e) => {
      if (this.state.isSolo) return;
      const rect = this.dom.canvas.krathong.getBoundingClientRect();
      const relX = (e.clientX - rect.left) / rect.width;
      const relY = (e.clientY - rect.top) / rect.height;
      this.network.send({ type: 'CURSOR_MOVE', relX, relY, avatar: this.state.player.avatar });
    });

    // 11. Undo & Clear Buttons
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

    // 12. Quick Auto-Arrange Shortcuts
    document.getElementById('btn-quick-ring').addEventListener('click', () => {
      this._autoArrangeRing();
      this.network.send({ type: 'AUTO_RING', itemType: this.state.activeItemType });
    });

    document.getElementById('btn-quick-flowers').addEventListener('click', () => {
      this._autoScatterFlowers();
      this.network.send({ type: 'AUTO_SCATTER' });
    });

    // 13. Reaction Bar Buttons
    document.querySelectorAll('.reaction-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const emoji = btn.getAttribute('data-reaction');
        this._showToast(`${this.state.player.name}: ${emoji}`);
        this.network.send({ type: 'REACTION', emoji, sender: this.state.player.name });
      });
    });

    // 14. Proceed to Wish & Light Modal
    document.getElementById('btn-finish-craft').addEventListener('click', () => {
      this._openWishLightModal();
      this.network.send({ type: 'OPEN_LIGHT_MODAL' });
    });

    document.getElementById('btn-close-wish-modal').addEventListener('click', () => {
      this.dom.modals.wishLight.classList.add('hidden');
    });

    // 15. Wish Input Typing Listener
    const wishInput = document.getElementById('my-wish-input');
    wishInput.addEventListener('input', (e) => {
      this.state.player.wish = e.target.value;
      document.getElementById('p1-wish-preview').textContent = `"${e.target.value || 'ยังไม่ได้เขียน...'}"`;
      this.network.send({ type: 'UPDATE_WISH', wish: e.target.value });
    });

    // 16. Dual Hold-to-Light Button Mechanics (Pointerdown & Pointerup)
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

    // 17. River Actions (Launch, Lantern, Fireworks, Souvenir)
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

    // River canvas interactive clicks (water splash & ripples)
    this.dom.canvas.river.addEventListener('click', (e) => {
      const rect = this.dom.canvas.river.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      this.riverScene.addRipple(x, y);
      AudioFX.playSplash();
      this.network.send({ type: 'RIVER_ACTION', action: 'ripple', x, y });
    });

    // 18. Polaroid Keepsake Modal
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

  // ==========================================
  // Collaborative Canvas Placement & Sync
  // ==========================================
  _handleCanvasClick(e) {
    const rect = this.dom.canvas.krathong.getBoundingClientRect();
    const clickX = ((e.clientX - rect.left) / rect.width) * 480;
    const clickY = ((e.clientY - rect.top) / rect.height) * 480;

    // Calculate angle from center (240, 240) so petals face outward naturally
    const dx = clickX - 240;
    const dy = clickY - 240;
    const dist = Math.sqrt(dx * dx + dy * dy);

    // Don't place too far outside
    if (dist > 180) {
      this._showToast('วางให้อยู่บนตัวกระทงนะ 🪷');
      return;
    }

    let rotation = Math.atan2(dy, dx) + Math.PI / 2;
    // Central items like candle and incense don't need radial rotation
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

    // 1. Draw Base
    SpriteEngine.drawBase(ctx, this.state.krathong.base, 240, 240, 110);

    // 2. Sort items: petals at bottom, flowers in middle, candle/incense on top
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

    // Update Item Count Stats
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

  // ==========================================
  // Dual Hold-to-Light & Wish Mechanics
  // ==========================================
  _openWishLightModal() {
    this.dom.modals.wishLight.classList.remove('hidden');
    // Ensure candle & incense exist on krathong if user forgot
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

      // Ignition spark animation
      const sparkEl = document.getElementById('central-spark');
      sparkEl.classList.add('spark-ignited');
      sparkEl.textContent = '🔥✨';

      // Confetti burst
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

      // After 1.8s, transition automatically to River View
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

    // Launch celebratory fireworks
    setTimeout(() => this.riverScene.spawnFireworks(), 300);
    setTimeout(() => this.riverScene.spawnLantern(), 800);
    setTimeout(() => this.riverScene.spawnFireworks(), 1500);

    // Open Souvenir Card after 4 seconds
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

  // ==========================================
  // Network Message Handlers
  // ==========================================
  _bindNetworkEvents() {
    this.network.on('connected', (info) => {
      this.state.partner.isConnected = true;
      this._updatePartnerUI();
      this._showToast('เพื่อนร่วมห้องเชื่อมต่อแล้ว! 🤝 เริ่มทำกระทงด้วยกันได้เลย');

      // Send our player info & current state
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

// Start application on DOMContentLoaded
window.addEventListener('DOMContentLoaded', () => {
  window.app = new App();
  window.app.init();
});
