/* ═══════════════════════════════════════════════
   IlmAI — app.js
   Application bootstrap / init
   ═══════════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {
  renderLanding();
  show('landing');

  // OCR modal — close on backdrop click
  const ocrModal = document.getElementById('ocr-modal');
  if (ocrModal) {
    ocrModal.addEventListener('click', function (e) {
      if (e.target === this) closeOcrModal();
    });
  }

  // Welcome-back streak message
  if (S.prog.streak > 1) {
    setTimeout(() => addMsg('a', `Welcome back! 🎉 ${S.prog.streak} din ki streak — aur yaad karo: 📷 image scan bhi try karo!`), 1500);
  }
});

// ── Register Service Worker for offline support (PWA) ──
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').catch(() => {
      /* offline support unavailable — app still works online */
    });
  });
}
