/* ═══════════════════════════════════════════════
   IlmAI — utils.js
   Shared helper functions
   ═══════════════════════════════════════════════ */

/**
 * Robust JSON extractor — strips markdown fences, asterisks,
 * and uses bracket-matching to find the JSON payload even when
 * the AI wraps it with extra prose.
 */
function extractJ(txt) {
  let c = txt.replace(/```json\s*/gi, '').replace(/```/g, '').trim();
  c = c.replace(/\*\*/g, '').trim();
  const si = c.search(/[\[{]/);
  if (si === -1) return c;
  const open = c[si];
  const close = open === '[' ? ']' : '}';
  let depth = 0, ei = -1;
  for (let i = si; i < c.length; i++) {
    if (c[i] === open) depth++;
    else if (c[i] === close) { depth--; if (depth === 0) { ei = i; break; } }
  }
  return ei > -1 ? c.slice(si, ei + 1) : c.slice(si);
}

/** Loading state HTML */
function loadHTML(t, s = '') {
  return `<div class="ld"><div class="ldspin"></div><div><div class="ld-t">${t}</div>${s ? `<div class="ld-s">${s}</div>` : ''}</div></div>`;
}

/** Error state HTML with optional retry button */
function errHTML(msg, fn = '') {
  return `<div class="err"><div class="err-ic">😕</div><h3>Oops!</h3><p>${msg}</p>${fn ? `<button class="btn btn-p" style="margin-top:18px" onclick="${fn}()">🔄 Dobara Try Karo</button>` : ''}</div>`;
}

/** Escape HTML special characters (XSS-safe text insertion) */
function esc(s) {
  if (s == null) return '';
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;');
}

/** Persist app progress (streak/XP) to localStorage */
function saveProgress() {
  try {
    localStorage.setItem('ilmai_v3', JSON.stringify({ prog: S.prog }));
  } catch (e) { /* storage unavailable — fail silently */ }
}

/** Update daily streak counter */
function updateStreak() {
  const today = new Date().toDateString();
  if (S.prog.lastDate === today) return;
  if (S.prog.lastDate) {
    const d = (Date.now() - new Date(S.prog.lastDate)) / 86400000;
    S.prog.streak = d < 2 ? S.prog.streak + 1 : 1;
  } else {
    S.prog.streak = 1;
  }
  S.prog.lastDate = today;
  saveProgress();
}

/** Award XP and show floating popup */
function addXP(n) {
  S.prog.xp += n;
  saveProgress();
  const xpEl = document.getElementById('xps');
  if (xpEl) xpEl.textContent = `⭐ ${S.prog.xp} XP`;
  const p = document.createElement('div');
  p.className = 'xppop';
  p.textContent = `+${n} XP! ⭐`;
  document.body.appendChild(p);
  setTimeout(() => p.remove(), 2200);
}
