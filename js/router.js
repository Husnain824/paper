/* ═══════════════════════════════════════════════
   IlmAI — router.js
   Global app state + screen navigation (SPA router)
   ═══════════════════════════════════════════════ */

// ── Global App State ──
const S = {
  cls: null, brd: null, grp: null, sub: null, ch: null, mode: null,
  mcq: { cnt: 10, dif: 'medium', tmr: 10 },
  qzData: [], qzIdx: 0, qzAns: [], qzInterval: null,
  qaType: 'short', qaData: [], qaIdx: 0, qaEvals: [],
  chatH: [], chatOpen: false,
  prog: { streak: 0, xp: 0, lastDate: null },
  aiProvider: 'groq',              // 'groq' | 'gemini'
  geminiModel: 'gemini-2.5-flash', // 'gemini-2.5-flash' | 'gemini-2.5-flash-lite' | 'gemini-2.5-pro'
  ocrProvider: 'ocrspace',         // 'ocrspace' (printed) | 'gemini' (handwritten)
  lastAiFallback: false,           // true if last ai() call silently fell back from Gemini to Groq
};

// ── Restore progress from localStorage ──
try {
  const sv = JSON.parse(localStorage.getItem('ilmai_v3') || '{}');
  if (sv.prog) S.prog = { ...S.prog, ...sv.prog };
  updateStreak();
} catch (e) { /* fresh install, ignore */ }

/**
 * Show a named screen (toggles .sc.on) and update header state.
 * Also hides the chat widget on screens where it would overlap content.
 */
function show(id) {
  document.querySelectorAll('.sc').forEach(s => s.classList.remove('on'));
  const el = document.getElementById('sc-' + id);
  if (el) el.classList.add('on');
  window.scrollTo({ top: 0, behavior: 'instant' });
  updateHdr(id);

  const noChat = ['mcq-set', 'mcq-quiz', 'mcq-res', 'short', 'long'];
  const cw = document.getElementById('cw');
  if (cw) {
    cw.style.display = noChat.includes(id) ? 'none' : 'block';
    if (noChat.includes(id) && S.chatOpen) {
      S.chatOpen = false;
      document.getElementById('cpanel')?.classList.remove('open');
      const ctog = document.getElementById('ctog');
      if (ctog) ctog.textContent = '💬';
    }
  }
}

/** Update breadcrumb, progress bar, and streak/XP pills */
function updateHdr(id) {
  const parts = [];
  if (S.cls) parts.push({ l: `Class ${S.cls}`, s: 'board' });
  if (S.brd) parts.push({ l: BOARDS.find(b => b.id === S.brd)?.nm || S.brd, s: 'group' });
  if (S.grp) parts.push({ l: getGrpNm(), s: 'subject' });
  if (S.sub) parts.push({ l: S.sub, s: 'chapter' });
  if (S.ch)  parts.push({ l: S.ch === 'all' ? 'Full Book' : `Ch.${S.ch}`, s: 'mode' });

  const bcEl = document.getElementById('bc');
  if (bcEl) {
    bcEl.innerHTML = parts.map((p, i) =>
      `<span class="bc-i${i === parts.length - 1 ? ' cur' : ''}" onclick="show('${p.s}')">${p.l}</span>${i < parts.length - 1 ? '<span class="bc-sep">›</span>' : ''}`
    ).join('');
  }

  const screens = ['landing', 'board', 'group', 'subject', 'chapter', 'mode'];
  const idx = screens.indexOf(id);
  const pf = document.getElementById('pf');
  if (pf) pf.style.width = (Math.max(0, idx / (screens.length - 1)) * 100) + '%';

  const stk = document.getElementById('stk');
  const xps = document.getElementById('xps');
  if (stk) stk.textContent = `🔥 ${S.prog.streak}`;
  if (xps) xps.textContent = `⭐ ${S.prog.xp} XP`;
}

function getGrpNm()   { return [...G910, ...G1112].find(g => g.id === S.grp)?.nm || S.grp; }
function getGrpSubs() { return [...G910, ...G1112].find(g => g.id === S.grp)?.subs || []; }

function getChNm() {
  if (!S.ch || S.ch === 'all') return 'Full Book';
  const chs = CH[`${S.sub}-${S.cls}`];
  return chs ? `Ch.${S.ch}: ${chs[S.ch - 1] || ''}` : `Chapter ${S.ch}`;
}

/** Reset selection state and return to the landing screen */
function goHome() {
  S.cls = S.brd = S.grp = S.sub = S.ch = null;
  show('landing');
}
