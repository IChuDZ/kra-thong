/**
 * Co-op Networking Engine (PeerJS WebRTC + BroadcastChannel Fallback)
 * Connects 2 players with zero-server overhead.
 */

export class NetworkManager {
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

  /**
   * Generate short 4-character room code (e.g. "7K2M")
   */
  static generateRoomCode() {
    const chars = '23456789ABCDEFGHJKLMNPQRSTUVWXYZ';
    let code = '';
    for (let i = 0; i < 4; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return code;
  }

  /**
   * Host creates a new room
   */
  createRoom(customCode = null) {
    this.isHost = true;
    this.roomId = customCode || NetworkManager.generateRoomCode();
    const peerId = `lkt-${this.roomId.toLowerCase()}`;

    this._setupBroadcastChannel(this.roomId);
    this._initPeer(peerId, true);
    return this.roomId;
  }

  /**
   * Partner joins an existing room
   */
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
        console.log('Incoming partner connection received');
        this.conn = connection;
        this._setupConnectionEvents(this.conn);
      });

      this.peer.on('error', (err) => {
        console.warn('PeerJS error:', err.type, err);
        if (err.type === 'unavailable-id') {
          // If ID collision, fallback to broadcast for local tabs
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
      console.log('WebRTC P2P Data connection opened!');
      this.isConnected = true;
      this.emit('connected', { isHost: this.isHost, mode: 'p2p' });
    });

    connection.on('data', (data) => {
      this._handleIncomingData(data, 'p2p');
    });

    connection.on('close', () => {
      console.log('Partner disconnected');
      this.isConnected = false;
      this.emit('disconnected');
    });
  }

  _handleIncomingData(payload, source) {
    if (!payload || !payload.type) return;

    // Handshake or partner ping
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

    // Pass data to app listeners
    this.emit('message', payload);
  }

  /**
   * Broadcast payload to partner via WebRTC and BroadcastChannel
   */
  send(payload) {
    // 1. Send via WebRTC if open
    if (this.conn && this.conn.open) {
      this.conn.send(payload);
    }
    // 2. Send via BroadcastChannel (super reliable for tabs on same device)
    if (this.broadcastChannel) {
      try {
        this.broadcastChannel.postMessage(payload);
      } catch (e) {}
    }
  }

  /**
   * Ping partner to discover connection
   */
  pingPartner() {
    this.send({ type: 'PING_JOIN' });
  }
}
