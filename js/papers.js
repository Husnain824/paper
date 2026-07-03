/* ═══════════════════════════════════════════════
   IlmAI — papers.js
   Past Papers resource links
   ═══════════════════════════════════════════════ */

function renderPapers() {
  const tit = document.getElementById('ppTit');
  if (tit) tit.textContent = `Past Papers — ${S.sub} Class ${S.cls}`;
  const yrs = ['2024', '2023', '2022', '2021', '2020', '2019'];
  const cont = document.getElementById('ppCont');
  if (!cont) return;
  cont.innerHTML = `<div style="display:flex;flex-direction:column;gap:10px">
    ${yrs.map(y => `<a href="https://www.freeilm.com/past-papers/" target="_blank" rel="noopener noreferrer" class="rc"><span class="rc-ic" aria-hidden="true">📄</span><div class="rc-inf"><h4>${y} — ${esc(S.sub)} Class ${S.cls}</h4><p>Board exam paper</p></div><span class="rc-tp tp-p">PDF</span></a>`).join('')}
  </div>`;
}
