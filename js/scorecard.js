/* ==========================================================================
   HTML5 Canvas Score Card Generator & Export Module
   ========================================================================== */

let generatedCanvas = null;

function generateScoreCardCanvas(quizData) {
  const canvas = document.createElement('canvas');
  const dpr = 2; // High-DPI crisp rendering
  const width = 600;
  const height = 660;

  canvas.width = width * dpr;
  canvas.height = height * dpr;

  const ctx = canvas.getContext('2d');
  ctx.scale(dpr, dpr);

  // Background Gradient
  const bgGrad = ctx.createLinearGradient(0, 0, width, height);
  bgGrad.addColorStop(0, '#0f172a');
  bgGrad.addColorStop(0.5, '#1e1b4b');
  bgGrad.addColorStop(1, '#0f172a');
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, width, height);

  // Decorative Glow Circles
  drawGlowCircle(ctx, 80, 80, 180, 'rgba(99, 102, 241, 0.25)');
  drawGlowCircle(ctx, width - 80, height - 100, 200, 'rgba(139, 92, 246, 0.25)');

  // Main Card Container (Glassmorphism effect)
  ctx.save();
  drawRoundedRect(ctx, 30, 30, width - 60, height - 60, 24);
  ctx.fillStyle = 'rgba(255, 255, 255, 0.05)';
  ctx.fill();
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
  ctx.lineWidth = 1.5;
  ctx.stroke();
  ctx.restore();

  // App Logo & Header
  ctx.fillStyle = '#6366f1';
  ctx.font = 'bold 28px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
  ctx.fillText('⚡ VerbMaster', 60, 85);

  ctx.fillStyle = '#94a3b8';
  ctx.font = '500 14px sans-serif';
  ctx.fillText('Irregular & Regular Verbs Mastery', 60, 108);

  // Date & Nickname Tag
  ctx.fillStyle = '#a78bfa';
  ctx.font = '600 15px sans-serif';
  const nickname = quizData.nickname || 'Anonim';
  ctx.fillText(`👤 ${nickname}`, width - 200, 85);

  ctx.fillStyle = '#64748b';
  ctx.font = '500 13px sans-serif';
  ctx.fillText(quizData.date || '', width - 200, 108);

  // Horizontal Divider Line
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(60, 130);
  ctx.lineTo(width - 60, 130);
  ctx.stroke();

  // Main Score Hero Box
  drawRoundedRect(ctx, 60, 155, width - 120, 130, 18);
  const heroGrad = ctx.createLinearGradient(60, 155, width - 60, 285);
  heroGrad.addColorStop(0, 'rgba(99, 102, 241, 0.2)');
  heroGrad.addColorStop(1, 'rgba(139, 92, 246, 0.2)');
  ctx.fillStyle = heroGrad;
  ctx.fill();
  ctx.strokeStyle = 'rgba(99, 102, 241, 0.4)';
  ctx.stroke();

  ctx.textAlign = 'center';
  ctx.fillStyle = '#818cf8';
  ctx.font = 'bold 14px sans-serif';
  ctx.fillText('KVIZ YEKUN NƏTİCƏSİ / FINAL SCORE', width / 2, 185);

  ctx.fillStyle = '#ffffff';
  ctx.font = 'extrabold 52px sans-serif';
  ctx.fillText(`${quizData.score || 0}`, width / 2, 245);

  ctx.fillStyle = '#c7d2fe';
  ctx.font = '600 14px sans-serif';
  ctx.fillText(`Xal / Points`, width / 2, 270);

  // Stats Grid 2x2
  const gridY = 305;
  const colWidth = (width - 140) / 2;

  // Box 1: Accuracy %
  drawStatBox(ctx, 60, gridY, colWidth, 110, '🎯 Dəqiqlik / Accuracy', `${quizData.accuracy || 0}%`, '#34d399');

  // Box 2: Mode
  drawStatBox(ctx, 80 + colWidth, gridY, colWidth, 110, '🎮 Rejim / Mode', quizData.modeText || '10 Sual', '#f472b6');

  // Box 3: Correct / Wrong
  drawStatBox(ctx, 60, gridY + 125, colWidth, 110, '✅ Doğru / ❌ Səhv', `${quizData.correctCount} / ${quizData.wrongCount}`, '#60a5fa');

  // Box 4: Max Streak
  drawStatBox(ctx, 80 + colWidth, gridY + 125, colWidth, 110, '🔥 Max Streak', `${quizData.maxStreak || 0}`, '#fbbf24');

  // Footer Tagline
  ctx.textAlign = 'center';
  ctx.fillStyle = '#475569';
  ctx.font = '500 13px sans-serif';
  ctx.fillText('Irregular Verbs Master • Mobile Interactive Web App', width / 2, height - 50);

  generatedCanvas = canvas;
  return canvas;
}

function drawGlowCircle(ctx, x, y, r, color) {
  ctx.save();
  const grad = ctx.createRadialGradient(x, y, 0, x, y, r);
  grad.addColorStop(0, color);
  grad.addColorStop(1, 'transparent');
  ctx.fillStyle = grad;
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

function drawRoundedRect(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h - r);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
}

function drawStatBox(ctx, x, y, w, h, title, value, valColor) {
  ctx.save();
  drawRoundedRect(ctx, x, y, w, h, 14);
  ctx.fillStyle = 'rgba(255, 255, 255, 0.04)';
  ctx.fill();
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
  ctx.lineWidth = 1;
  ctx.stroke();

  ctx.textAlign = 'center';
  ctx.fillStyle = '#94a3b8';
  ctx.font = '600 13px sans-serif';
  ctx.fillText(title, x + w / 2, y + 35);

  ctx.fillStyle = valColor || '#ffffff';
  ctx.font = 'bold 26px sans-serif';
  ctx.fillText(value, x + w / 2, y + 78);
  ctx.restore();
}

function downloadScoreCardPNG() {
  if (!generatedCanvas) return;
  const link = document.createElement('a');
  link.download = `verb-master-scorecard-${Date.now()}.png`;
  link.href = generatedCanvas.toDataURL('image/png');
  link.click();
}

async function shareScoreCardNative() {
  if (!generatedCanvas) return;
  try {
    generatedCanvas.toBlob(async (blob) => {
      if (!blob) return;
      const file = new File([blob], 'verb-master-scorecard.png', { type: 'image/png' });
      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({
          files: [file],
          title: 'VerbMaster Score Card',
          text: 'İngilis dili feil kvizində nəticəm! ⚡'
        });
      } else {
        downloadScoreCardPNG();
      }
    });
  } catch (e) {
    downloadScoreCardPNG();
  }
}
