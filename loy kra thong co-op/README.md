# 🪷 Loy Krathong Co-op (ลอยกระทงออนไลน์ด้วยกัน)

A cozy 2D pixel-art cooperative web experience celebrating the traditional Thai **Loy Krathong** festival. Invite your partner, best friend, or family to design and assemble a Krathong together in real time, write joint wishes, light the sacred flame simultaneously, and release it into a candlelit river under the full moon.

---

## ✨ Features

- **🌸 Real-Time Co-Op Crafting (The Workshop)**:
  - Join via a shareable 4-character Room Code or direct link (`?room=XXXX`).
  - Powered by **PeerJS (WebRTC)** for serverless peer-to-peer data sync + **BroadcastChannel** for instant local testing.
  - Live partner cursor tracking showing their nickname and avatar.
  - Collaborative drag-and-drop: Place folded banana leaves (กลีบผกา, กลีบกุหลาบ), pink lotuses, golden marigolds, orchids, crown flowers, and lucky coins.
  - Auto-arrange tools: 🌸 Ring of Petals & 🌼 Flower Scatter.

- **🕯️ Dual "Hold-to-Light" Ceremony**:
  - Both players hold down their match strike button at the exact same moment.
  - When both partners hold together, sparks ignite, lighting the candle flame with celebratory confetti and sound effects!

- **📜 Joint Wishes**:
  - Both players write their personal wishes, which fold into parchment tags fluttering beside their Krathong.

- **🌊 Animated 2D Pixel Chao Phraya River**:
  - Glowing full moon (คืนวันเพ็ญเดือน ๑๒) with crater shadows and moonbeam water reflections.
  - Synchronized countdown launch: watch your Krathong drift downstream together.
  - Interactive river: click water to splash ripples, release ascending sky lanterns (โคมลอย), or launch fireworks into the night sky.

- **🎵 Procedural Lo-Fi Soundscape**:
  - Pure **Web Audio API** synthesis: calming river stream, gentle Thai bell chimes, match strikes, flame whooshes, and fireworks (zero external audio files needed).

- **📷 Digital Polaroid Keepsake**:
  - Auto-renders a retro Polaroid photo card featuring your custom Krathong, room code, names, and wishes.
  - One-click "Save Image" or direct mobile share to Instagram / LINE / X.

- **🧘 Solo Mode**:
  - Want to float alone? Enjoy peaceful solo crafting with the Chao Phraya River.

---

## 🚀 How to Run

### Method 1: Instant (Zero Install)
Simply double-click `index.html` in Windows Explorer or open it in Google Chrome / Microsoft Edge / Safari / Firefox!

### Method 2: Local Server (Recommended for Wi-Fi co-op)
Double-click `start-server.bat` (or run `./start-server.ps1` in PowerShell).
It launches a lightweight local server at:
```
http://localhost:8080
```
Open two tabs or send the link to a phone on the same local network!

---

## 🌐 Deploy Online (Free)

This project has zero dependencies and requires no build step:
- **GitHub Pages**: Push this folder to a GitHub repository and turn on GitHub Pages in repository settings.
- **Vercel / Cloudflare Pages / Netlify**: Simply drag and drop this project folder or connect the Git repository.

---

## 🎨 Tech Stack
- **HTML5 Canvas 2D Engine**: Custom procedural pixel art generator for leaves, bases, flowers, and candles.
- **Tailwind CSS**: Retro dark theme styling with neon amber candlelight glows.
- **PeerJS (WebRTC)**: Direct browser-to-browser P2P data exchange with zero server overhead.
- **BroadcastChannel API**: Instant same-device multi-tab synchronization.
- **Web Audio API**: Real-time synthesizer for relaxing ambient sounds.
