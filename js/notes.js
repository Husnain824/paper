/* ═══════════════════════════════════════════════
   IlmAI — notes.js
   Notes & Books resource links
   ═══════════════════════════════════════════════ */

function renderNotes() {
  const tit = document.getElementById('ntTit');
  if (tit) tit.textContent = `${S.sub} — Class ${S.cls} Notes`;
  const c = S.cls, s = S.sub;
  const notes = [
    { nm: `Class ${c} ${s} Notes — FreeIlm`, ds: 'Free notes, MCQs', url: `https://www.freeilm.com/${c}th-class-notes/`, ic: '📄', tp: 'web' },
    { nm: 'Punjab Textbook Board', ds: 'Official PTB textbooks PDF', url: 'https://ptb.gop.pk/', ic: '📗', tp: 'pdf' },
    { nm: `Freeilm.pk — Class ${c}`, ds: 'Comprehensive notes', url: `https://freeilm.pk/class-${c}-notes/`, ic: '📋', tp: 'web' },
  ];
  const cont = document.getElementById('ntCont');
  if (!cont) return;
  cont.innerHTML = `
  <div style="display:flex;flex-direction:column;gap:10px">
    ${notes.map(l => `<a href="${l.url}" target="_blank" rel="noopener noreferrer" class="rc"><span class="rc-ic" aria-hidden="true">${l.ic}</span><div class="rc-inf"><h4>${esc(l.nm)}</h4><p>${esc(l.ds)}</p></div><span class="rc-tp tp-${l.tp}">${l.tp.toUpperCase()}</span></a>`).join('')}
    <a href="https://www.youtube.com/results?search_query=${encodeURIComponent(s + ' class ' + c + ' urdu lecture')}" target="_blank" rel="noopener noreferrer" class="rc"><span class="rc-ic" aria-hidden="true">▶️</span><div class="rc-inf"><h4>${esc(s)} Class ${c} YouTube Lectures</h4><p>Free Urdu lectures</p></div><span class="rc-tp tp-v">VIDEO</span></a>
  </div>`;
}
