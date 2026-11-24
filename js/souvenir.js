/**
 * Polaroid Keepsake & Social Souvenir Card Generator
 */
import { SpriteEngine } from './sprites.js';

export const SouvenirCard = {
  render(canvas, krathongData, p1, p2, roomCode) {
    const ctx = canvas.getContext('2d');
    const w = canvas.width;
    const h = canvas.height;

    ctx.clearRect(0, 0, w, h);

    // 1. Polaroid Outer Frame (Aesthetic Cream Card)
    ctx.fillStyle = '#fdfbf7';
    ctx.fillRect(0, 0, w, h);

    // Subtle Paper Texture Borders
    ctx.strokeStyle = '#e2d9cc';
    ctx.lineWidth = 2;
    ctx.strokeRect(1, 1, w - 2, h - 2);

    // 2. Photo Area (Night River Backdrop)
    const photoX = 18;
    const photoY = 18;
    const photoW = w - 36;
    const photoH = 290;

    ctx.save();
    ctx.beginPath();
    ctx.rect(photoX, photoY, photoW, photoH);
    ctx.clip();

    // Night Gradient
    const photoGrad = ctx.createLinearGradient(photoX, photoY, photoX, photoY + photoH);
    photoGrad.addColorStop(0, '#060a17');
    photoGrad.addColorStop(0.5, '#0e162f');
    photoGrad.addColorStop(0.85, '#07152b');
    photoGrad.addColorStop(1, '#020617');
    ctx.fillStyle = photoGrad;
    ctx.fillRect(photoX, photoY, photoW, photoH);

    // Distant Stars
    ctx.fillStyle = '#fef08a';
    for (let i = 0; i < 35; i++) {
      const sx = photoX + ((i * 37) % photoW);
      const sy = photoY + ((i * 23) % (photoH * 0.6));
      ctx.fillRect(sx, sy, 1.5, 1.5);
    }

    // Mini Golden Moon
    const mX = photoX + photoW * 0.82;
    const mY = photoY + 45;
    ctx.beginPath();
    ctx.arc(mX, mY, 18, 0, Math.PI * 2);
    ctx.fillStyle = '#fef08a';
    ctx.fill();

    // Distant Sky Lantern
    ctx.fillStyle = 'rgba(251, 191, 36, 0.4)';
    ctx.beginPath();
    ctx.arc(photoX + photoW * 0.25, photoY + 60, 14, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#fef08a';
    ctx.fillRect(photoX + photoW * 0.25 - 4, photoY + 54, 8, 12);

    // River Horizon & Reflection
    const waterY = photoY + photoH * 0.65;
    ctx.fillStyle = 'rgba(56, 189, 248, 0.1)';
    ctx.fillRect(photoX, waterY, photoW, photoH - (waterY - photoY));

    // Warm Water Glow under Krathong
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

    // Render the Couple's Krathong
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

    // 3. Polaroid Caption & Wishes (Bottom Area)
    const captionY = photoY + photoH + 20;

    // Header Title
    ctx.textAlign = 'center';
    ctx.font = 'bold 13px Silkscreen, monospace';
    ctx.fillStyle = '#b45309';
    ctx.fillText('LOY KRATHONG CO-OP', w / 2, captionY);

    // Couple / Friends Name Tag
    ctx.font = 'bold 14px Mali, Prompt, sans-serif';
    ctx.fillStyle = '#0f172a';
    const p1Display = `${p1.avatar || '🌸'} ${p1.name || 'Player 1'}`;
    const p2Display = `${p2.avatar || '🌙'} ${p2.name || 'Partner'}`;
    ctx.fillText(`${p1Display}  &  ${p2Display}`, w / 2, captionY + 22);

    // Wishes Card Section
    const wishBoxY = captionY + 34;
    ctx.fillStyle = '#fef3c7';
    ctx.beginPath();
    ctx.roundRect(photoX, wishBoxY, photoW, 54, 8);
    ctx.fill();
    ctx.strokeStyle = '#fde68a';
    ctx.lineWidth = 1;
    ctx.stroke();

    // Individual wishes
    ctx.textAlign = 'left';
    ctx.font = '11px Mali, Prompt, sans-serif';
    ctx.fillStyle = '#78350f';
    const w1 = p1.wish ? `"${p1.wish.slice(0, 32)}${p1.wish.length > 32 ? '...' : ''}"` : '"ขอให้มีความสุข สมหวังตลอดปี"';
    const w2 = p2.wish ? `"${p2.wish.slice(0, 32)}${p2.wish.length > 32 ? '...' : ''}"` : '"ขอให้รักและมิตรภาพยืนยาวตลอดไป"';

    ctx.fillText(`${p1.avatar || '🌸'} ${w1}`, photoX + 10, wishBoxY + 20);
    ctx.fillText(`${p2.avatar || '🌙'} ${w2}`, photoX + 10, wishBoxY + 40);

    // Date & Room Code Footnote
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
