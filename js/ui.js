/* ═══════════════════════════════════════════════
   IlmAI — ui.js
   Class → Board → Group → Subject → Chapter → Mode
   selection flow rendering
   ═══════════════════════════════════════════════ */

/* ── Landing ── */
function renderLanding() {
  const grid = document.getElementById('clsGrid');
  if (!grid) return;
  grid.innerHTML = CLASSES.map(c =>
    `<div class="clc ${c.cl}" role="button" tabindex="0" aria-label="Select ${c.nm}" onclick="selCls('${c.id}')" onkeydown="if(event.key==='Enter')selCls('${c.id}')">
      <span class="clc-ic" aria-hidden="true">${c.ic}</span>
      <div class="clc-nm">${c.nm}</div>
      <div class="clc-ds">${c.ds}</div>
    </div>`
  ).join('');
}

function selCls(id) { S.cls = id; renderBoards(); show('board'); }

/* ── Boards ── */
function renderBoards() {
  const grid = document.getElementById('brdGrid');
  if (!grid) return;
  grid.innerHTML = BOARDS.map(b => `
    <div class="brd-c" role="button" tabindex="0" aria-label="Select ${esc(b.nm)}" onclick="selBrd('${b.id}')" onkeydown="if(event.key==='Enter')selBrd('${b.id}')"
         style="border-color:${b.br};background:${b.bg}">
      <div class="brd-logo" style="background:${b.bg};border-color:${b.br}">
        <span style="font-size:26px" aria-hidden="true">${b.ic}</span>
        <span class="brd-abbr" style="color:${b.clr}">${b.short}</span>
      </div>
      <div class="brd-inf">
        <h3>${esc(b.nm)}</h3>
        <p>
          <span class="brd-tag" style="color:${b.clr};border-color:${b.br};background:${b.bg}">${esc(b.province)}</span>
          <span style="color:var(--t3)">Est. ${b.est}</span>
        </p>
        <p style="margin-top:5px;color:var(--t3);font-size:10px">👥 ${b.students} students</p>
      </div>
      <span style="margin-left:auto;color:${b.clr};font-size:18px" aria-hidden="true">›</span>
    </div>`
  ).join('');
}

function selBrd(id) { S.brd = id; renderGroups(); show('group'); }

/* ── Groups ── */
function renderGroups() {
  const isM = ['9', '10'].includes(S.cls);
  const gs = isM ? G910 : G1112;
  const sub = document.getElementById('grpSub');
  if (sub) sub.textContent = isM ? `Class ${S.cls} — group chunao` : `Intermediate — program chunao`;
  const grid = document.getElementById('grpGrid');
  if (grid) {
    grid.innerHTML = gs.map(g =>
      `<div class="grp-c" role="button" tabindex="0" aria-label="Select ${esc(g.nm)}" onclick="selGrp('${g.id}')" onkeydown="if(event.key==='Enter')selGrp('${g.id}')">
        <div class="grp-ic" aria-hidden="true">${g.ic}</div>
        <div class="grp-nm">${esc(g.nm)}</div>
        <div class="grp-ds">${g.subs.join(' • ')}</div>
      </div>`
    ).join('');
  }
}

function selGrp(id) { S.grp = id; renderSubjects(); show('subject'); }

/* ── Subjects ── */
function renderSubjects() {
  const sub = document.getElementById('subSub');
  if (sub) sub.textContent = `Class ${S.cls} | ${getGrpNm()}`;
  const grid = document.getElementById('subGrid');
  if (!grid) return;
  grid.innerHTML = getGrpSubs().map(s => {
    const m = SMETA[s] || { ic: '📚', clr: '#00D4AA', bg: 'rgba(0,212,170,.13)' };
    const chCount = CH[`${s}-${S.cls}`]?.length || 0;
    return `<div class="sub-c" role="button" tabindex="0" aria-label="Select ${esc(s)}" onclick="selSub('${esc(s)}')" onkeydown="if(event.key==='Enter')selSub('${esc(s)}')"
      style="--ac:${m.bg};--ab:${m.clr}88;border-color:${m.clr}33">
      <div class="sub-ic" aria-hidden="true">${m.ic}</div>
      <div class="sub-nm" style="color:var(--t)">${esc(s)}</div>
      ${chCount ? `<div class="sub-ch" style="color:${m.clr}">${chCount} chapters</div>` : '<div class="sub-ch">AI Generated</div>'}
    </div>`;
  }).join('');
}

function selSub(s) { S.sub = s; renderChapters(); show('chapter'); }

/* ── Chapters ── */
function renderChapters() {
  const m = SMETA[S.sub] || { ic: '📚' };
  const tit = document.getElementById('chTit');
  const subEl = document.getElementById('chSub');
  if (tit)   tit.innerHTML   = `${m.ic} ${esc(S.sub)} — Class ${S.cls}`;
  if (subEl) subEl.textContent = `${S.cls} ${BOARDS.find(b => b.id === S.brd)?.nm || 'Board'} | ${getGrpNm()}`;

  const chs = CH[`${S.sub}-${S.cls}`];
  const cont = document.getElementById('chCont');
  if (!cont) return;

  const fullBook = `<div class="ch-it" role="button" tabindex="0" onclick="selCh('all')" onkeydown="if(event.key==='Enter')selCh('all')" style="border-color:var(--p);background:var(--pd);margin-bottom:10px">
    <div class="ch-num" style="background:var(--p);color:#000;border:none;font-size:18px">📖</div>
    <div class="ch-inf"><h4>Full Book Practice</h4><p>Saare chapters se AI questions</p></div>
    <span class="ch-ar" style="color:var(--p)">›</span></div>`;

  if (!chs) {
    cont.innerHTML = fullBook + `<p style="text-align:center;color:var(--t2);padding:24px;font-size:14px">✦ Specific chapters jald aa rahay hain!</p>`;
    return;
  }
  cont.innerHTML = `<div class="ch-list">${fullBook}${chs.map((ch, i) =>
    `<div class="ch-it" role="button" tabindex="0" onclick="selCh(${i + 1})" onkeydown="if(event.key==='Enter')selCh(${i + 1})">
      <div class="ch-num">${i + 1}</div>
      <div class="ch-inf"><h4>${esc(ch)}</h4><p>Chapter ${i + 1}</p></div>
      <span class="ch-ar">›</span>
    </div>`
  ).join('')}</div>`;
}

function selCh(ch) { S.ch = ch; renderModes(); show('mode'); }

/* ── Modes ── */
function renderModes() {
  const m = SMETA[S.sub] || { ic: '📚' };
  const tit = document.getElementById('modTit');
  if (tit) tit.innerHTML = `${m.ic} ${esc(S.sub)} — ${getChNm()}`;
  const grid = document.getElementById('modGrid');
  if (!grid) return;
  grid.innerHTML = MODES.map(md =>
    `<div class="mode-c" role="button" tabindex="0" aria-label="${esc(md.nm)}" onclick="selMode('${md.id}')" onkeydown="if(event.key==='Enter')selMode('${md.id}')" style="--mc1:${md.mc}">
      <div class="mode-em" aria-hidden="true">${md.em}</div>
      <div class="mode-nm">${md.nm}</div>
      <div class="mode-bx">${md.bx}</div>
    </div>`
  ).join('');
}

/** Dispatch to the correct feature entry point for the selected mode */
function selMode(id) {
  S.mode = id;
  if (id === 'mcq') {
    show('mcq-set');
    document.getElementById('mcqAiSel').innerHTML = aiSelectorHTML('mcqAiSel');
  }
  else if (id === 'short')   startQA('short');
  else if (id === 'long')    startQA('long');
  else if (id === 'summary') startSummary();
  else if (id === 'guess')   startGuess();
  else if (id === 'test')    { renderTestSetup(); show('test-set'); }
  else if (id === 'scan')    { renderScanPage(); show('scan'); }
  else if (id === 'notes')   { renderNotes(); show('notes'); }
  else if (id === 'papers')  { renderPapers(); show('papers'); }
}
