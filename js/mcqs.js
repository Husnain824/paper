/* ═══════════════════════════════════════════════
   IlmAI — mcqs.js
   MCQ Practice quiz + Full Test (board pattern paper)
   ═══════════════════════════════════════════════ */

/* ══════════════════════════════════════════════
   MCQ SETTINGS
   ══════════════════════════════════════════════ */
function setOpt(tp, val, btn) {
  const map = { cnt: 'cntG', dif: 'difG', tmr: 'tmrG' };
  document.querySelectorAll(`#${map[tp]} .tb`).forEach(b => b.classList.remove('on'));
  btn.classList.add('on');
  S.mcq[tp] = val;
}

/* ══════════════════════════════════════════════
   MCQ QUIZ
   ══════════════════════════════════════════════ */
async function startMCQ() {
  show('mcq-quiz');
  document.getElementById('qzCont').innerHTML = loadHTML('MCQs generate ho rahe hain...', 'AI Pakistan curriculum se questions bana raha hai');
  const prompt = `Generate exactly ${S.mcq.cnt} MCQs for Class ${S.cls}, ${BOARDS.find(b => b.id === S.brd)?.nm || 'Punjab'} Board, Subject ${S.sub}, Chapter ${getChNm()}. Difficulty: ${S.mcq.dif}. Return ONLY raw JSON with no extra text, no markdown, no asterisks: [{"q":"question","opts":["A","B","C","D"],"correct":0,"exp":"explanation"}]`;
  try {
    const txt = await ai(prompt, Math.min(4000, S.mcq.cnt * 120));
    S.qzData = JSON.parse(extractJ(txt));
    if (!Array.isArray(S.qzData) || !S.qzData.length) throw new Error('Bad data');
    S.qzIdx = 0;
    S.qzAns = new Array(S.qzData.length).fill(null);
    renderQ();
  } catch (e) {
    document.getElementById('qzCont').innerHTML = errHTML('MCQs load nahi ho sake: ' + e.message, 'startMCQ');
  }
}

function renderQ() {
  if (S.qzIdx >= S.qzData.length) { renderResults(); return; }
  const q = S.qzData[S.qzIdx], tot = S.qzData.length, cur = S.qzIdx + 1;
  const L = ['A', 'B', 'C', 'D'];
  document.getElementById('qzCont').innerHTML = `
  ${S.qzIdx === 0 ? fallbackNoteHTML() : ''}
  <div class="qhdr">
    <div><div style="font-size:13px;color:var(--t2)">Question</div><div style="font-size:22px;font-weight:800">${cur}<span style="font-size:15px;color:var(--t2)"> / ${tot}</span></div></div>
    <div style="display:flex;gap:10px;align-items:center">
      ${S.mcq.tmr ? `<div class="qtimer" id="qtmr">⏱ <span id="tmrN">${S.mcq.tmr}</span>s</div>` : ''}
      <span class="tag t-tl">${S.mcq.dif}</span>
    </div>
  </div>
  <div class="qrail"><div class="qrfill" style="width:${((S.qzIdx / tot) * 100).toFixed(1)}%"></div></div>
  <div class="qq"><span style="color:var(--t3);font-size:14px">Q${cur}. </span>${esc(q.q)}</div>
  <div class="qopts">${q.opts.map((o, i) => `<button class="qopt" id="op${i}" onclick="ansQ(${i})"><div class="qltr">${L[i]}</div><div class="qtxt">${esc(o)}</div></button>`).join('')}</div>
  <div id="qexp"></div>
  <div class="qnav" id="qnav" style="display:none"><div></div><button class="btn btn-p" onclick="nextQ()">${cur < tot ? 'Agla Sawal →' : '🏆 Results Dekho'}</button></div>`;
  if (S.mcq.tmr > 0) runTimer();
}

function runTimer() {
  let rem = S.mcq.tmr;
  if (S.qzInterval) clearInterval(S.qzInterval);
  S.qzInterval = setInterval(() => {
    rem--;
    const el = document.getElementById('tmrN'), te = document.getElementById('qtmr');
    if (el) el.textContent = rem;
    if (rem <= 10 && te) te.classList.add('warn');
    if (rem <= 0) { clearInterval(S.qzInterval); ansQ(-1); }
  }, 1000);
}

function ansQ(sel) {
  if (S.qzInterval) { clearInterval(S.qzInterval); S.qzInterval = null; }
  const q = S.qzData[S.qzIdx], cor = q.correct;
  S.qzAns[S.qzIdx] = sel;
  const L = ['A', 'B', 'C', 'D'];
  document.querySelectorAll('.qopt').forEach(o => o.classList.add('dis'));
  if (sel >= 0) document.getElementById(`op${sel}`)?.classList.add(sel === cor ? 'cor' : 'wrg');
  document.getElementById(`op${cor}`)?.classList.add('cor');
  const ok = sel === cor;
  if (ok) addXP(10);
  document.getElementById('qexp').innerHTML = `<div class="qexp">${ok ? '✅' : (sel === -1 ? '⏰' : '❌')} <strong>${ok ? 'Bilkul Sahi!' : (sel === -1 ? 'Waqt khatam!' : 'Ghalat!')}</strong>${sel >= 0 && !ok ? ` Sahi: <strong style="color:var(--ok)">${L[cor]}. ${esc(q.opts[cor])}</strong> — ` : ''}${esc(q.exp)}</div>`;
  document.getElementById('qnav').style.display = 'flex';
}

function nextQ() { S.qzIdx++; renderQ(); }

function renderResults() {
  let cor = 0;
  S.qzAns.forEach((a, i) => { if (a === S.qzData[i].correct) cor++; });
  const tot = S.qzData.length, pct = Math.round((cor / tot) * 100);
  let grade, gc;
  if (pct >= 90) { grade = 'A+'; gc = 'var(--p)'; }
  else if (pct >= 80) { grade = 'A'; gc = 'var(--p)'; }
  else if (pct >= 70) { grade = 'B+'; gc = 'var(--s)'; }
  else if (pct >= 60) { grade = 'B'; gc = 'var(--s)'; }
  else if (pct >= 50) { grade = 'C'; gc = 'var(--g)'; }
  else { grade = 'F'; gc = 'var(--r)'; }
  const xpE = cor * 10 + Math.floor(pct / 10) * 5;
  document.getElementById('resCont').innerHTML = `
  <div class="res-hero"><div class="res-sc">${pct}%</div><div class="res-lb">${cor} out of ${tot} correct</div>
    <div class="res-gr" style="background:${gc}22;color:${gc};border:1.5px solid ${gc}55">Grade: ${grade}</div>
    <div style="margin-top:12px;font-size:14px;color:var(--t2)">+${xpE} XP earned! 🎉</div></div>
  <div class="res-stats">
    <div class="rs"><div class="rs-n" style="color:var(--ok)">${cor}</div><div class="rs-l">✅ Sahi</div></div>
    <div class="rs"><div class="rs-n" style="color:var(--r)">${tot - cor}</div><div class="rs-l">❌ Ghalat</div></div>
    <div class="rs"><div class="rs-n" style="color:var(--g)">${pct}%</div><div class="rs-l">📊 Score</div></div>
  </div>
  <div style="display:flex;gap:10px;flex-wrap:wrap;justify-content:center;margin-bottom:28px">
    <button class="btn btn-p" onclick="startMCQ()">🔄 Naye MCQs</button>
    <button class="btn btn-g" onclick="show('mode')">← Menu</button>
  </div>`;
  show('mcq-res');
  addXP(xpE);
}

/* ══════════════════════════════════════════════
   FULL TEST MODE (board pattern / custom paper)
   ══════════════════════════════════════════════ */
function renderTestSetup() {
  const m = SMETA[S.sub] || { ic: '📋' };
  document.getElementById('testSetTit').innerHTML = `${m.ic} ${esc(S.sub)} — Full Test`;
  const pat = BOARD_PATTERNS[S.cls] || BOARD_PATTERNS['10'];
  document.getElementById('testSetCont').innerHTML = `
  ${aiSelectorHTML('testAiSel')}
  <div class="crd" style="margin-bottom:18px">
    <div class="ey">📋 Pattern Select Karo</div>
    <div style="display:flex;gap:10px;margin-bottom:20px;flex-wrap:wrap">
      <button class="tb on" id="patBoardBtn" onclick="selPattern('board')">🏫 Board Pattern</button>
      <button class="tb" id="patCustomBtn" onclick="selPattern('custom')">⚙️ Custom</button>
    </div>
    <div id="patBoard">
      <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:12px;margin-bottom:16px">
        <div class="rs"><div class="rs-n" style="color:var(--p)">${pat.mcq}</div><div class="rs-l">MCQs (1 mark)</div></div>
        <div class="rs"><div class="rs-n" style="color:var(--s)">${pat.short}</div><div class="rs-l">Short Q (3-5 marks)</div></div>
        <div class="rs"><div class="rs-n" style="color:var(--g)">${pat.long}</div><div class="rs-l">Long Q (8-10 marks)</div></div>
      </div>
      <div style="font-size:13px;color:var(--t2);margin-bottom:16px">⏱ Time: ${pat.time} min | 📊 Total: ${pat.totalMarks} marks</div>
    </div>
    <div id="patCustom" style="display:none">
      <div style="display:flex;flex-direction:column;gap:14px;margin-bottom:16px">
        <div class="fg"><label>MCQs (1 mark each)</label>
          <div class="tg"><button class="tb on" onclick="setTestOpt('tmcq',10,this)">10</button><button class="tb" onclick="setTestOpt('tmcq',15,this)">15</button><button class="tb" onclick="setTestOpt('tmcq',20,this)">20</button><button class="tb" onclick="setTestOpt('tmcq',0,this)">None</button></div>
        </div>
        <div class="fg"><label>Short Questions</label>
          <div class="tg"><button class="tb on" onclick="setTestOpt('tshort',4,this)">4</button><button class="tb" onclick="setTestOpt('tshort',6,this)">6</button><button class="tb" onclick="setTestOpt('tshort',8,this)">8</button><button class="tb" onclick="setTestOpt('tshort',0,this)">None</button></div>
        </div>
        <div class="fg"><label>Long Questions</label>
          <div class="tg"><button class="tb on" onclick="setTestOpt('tlong',2,this)">2</button><button class="tb" onclick="setTestOpt('tlong',3,this)">3</button><button class="tb" onclick="setTestOpt('tlong',4,this)">4</button><button class="tb" onclick="setTestOpt('tlong',0,this)">None</button></div>
        </div>
      </div>
    </div>
    <button class="btn btn-p btn-lg btn-w" onclick="startFullTest()">📋 Test Shuru Karo</button>
  </div>`;
  S.testPattern = 'board';
  S.testOpts = { tmcq: pat.mcq, tshort: pat.short, tlong: pat.long };
}

function selPattern(type) {
  S.testPattern = type;
  document.getElementById('patBoardBtn').classList.toggle('on', type === 'board');
  document.getElementById('patCustomBtn').classList.toggle('on', type === 'custom');
  document.getElementById('patBoard').style.display = type === 'board' ? '' : 'none';
  document.getElementById('patCustom').style.display = type === 'custom' ? '' : 'none';
}

function setTestOpt(key, val, btn) {
  S.testOpts = S.testOpts || {};
  S.testOpts[key] = val;
  btn.closest('.tg').querySelectorAll('.tb').forEach(b => b.classList.remove('on'));
  btn.classList.add('on');
}

async function startFullTest() {
  const pat = S.testPattern === 'board'
    ? (BOARD_PATTERNS[S.cls] || BOARD_PATTERNS['10'])
    : { mcq: S.testOpts?.tmcq ?? 10, short: S.testOpts?.tshort ?? 4, long: S.testOpts?.tlong ?? 2, totalMarks: null, time: null };

  show('test-paper');
  document.getElementById('testPaperCont').innerHTML = loadHTML('AI poora paper bana raha hai...', 'MCQs + Short + Long Questions generate ho rahe hain');

  const boardNm = BOARDS.find(b => b.id === S.brd)?.nm || 'Punjab Board';
  const prompt = `Generate a complete exam paper for Class ${S.cls}, ${boardNm}, Subject ${S.sub}, Chapter ${getChNm()}.
Include:
- ${pat.mcq} MCQs (1 mark each)
- ${pat.short} Short Questions (vary marks 2-5)
- ${pat.long} Long Questions (vary marks 5-10)
Return ONLY raw JSON:
{
  "title":"${S.sub} — Class ${S.cls} — ${boardNm}",
  "totalMarks":${pat.totalMarks || 'null'},
  "timeAllowed":${pat.time || 120},
  "mcqs":[{"q":"...","opts":["A","B","C","D"],"correct":0,"exp":"..."}],
  "shortQs":[{"q":"...","marks":3,"keyPoints":["..."]}],
  "longQs":[{"q":"...","marks":8,"keyPoints":["..."],"guide":"~200 words"}]
}`;

  try {
    const txt = await ai(prompt, 4000);
    let d;
    try { d = JSON.parse(extractJ(txt)); }
    catch (je) { document.getElementById('testPaperCont').innerHTML = errHTML('Paper generate nahi hua, dobara try karo.', 'startFullTest'); return; }
    S.testData = d;
    S.testAnswers = { mcq: [], short: [], long: [] };
    S.testEvals = null;
    renderTestPaper(d);
  } catch (e) {
    document.getElementById('testPaperCont').innerHTML = errHTML('Paper nahi aaya: ' + e.message, 'startFullTest');
  }
}

function renderTestPaper(d) {
  const L = ['A', 'B', 'C', 'D'];
  let html = `
  <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:20px;flex-wrap:wrap;gap:10px">
    <div>
      <div class="ey">📋 Full Test</div>
      <h2 class="h1" style="margin-bottom:4px">${esc(d.title || S.sub + ' Paper')}</h2>
      <div style="font-size:13px;color:var(--t2)">
        ${d.totalMarks ? `📊 Total Marks: <strong style="color:var(--p)">${d.totalMarks}</strong> &nbsp;` : ''}
        ${d.timeAllowed ? `⏱ Time: <strong style="color:var(--g)">${d.timeAllowed} min</strong>` : ''}
      </div>
    </div>
    <button class="btn btn-g" onclick="show('test-set')">← Wapas</button>
  </div>`;

  if (d.mcqs?.length) {
    html += `<div class="sumb"><h3>📝 Section A — MCQs</h3>`;
    d.mcqs.forEach((q, i) => {
      html += `<div style="margin-bottom:18px">
        <div style="font-weight:600;margin-bottom:8px;font-size:15px">Q${i + 1}. ${esc(q.q)}</div>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:6px">
          ${q.opts.map((o, j) => `<label style="display:flex;align-items:center;gap:8px;padding:8px 12px;border-radius:9px;background:var(--bg2);border:1px solid var(--b);cursor:pointer;font-size:14px">
            <input type="radio" name="mcq${i}" value="${j}" onchange="S.testAnswers.mcq[${i}]=${j}" style="accent-color:var(--p)"> ${L[j]}. ${esc(o)}
          </label>`).join('')}
        </div>
      </div>`;
    });
    html += `</div>`;
  }

  if (d.shortQs?.length) {
    html += `<div class="sumb"><h3>✍️ Section B — Short Questions</h3>`;
    d.shortQs.forEach((q, i) => {
      html += `<div style="margin-bottom:20px">
        <div style="display:flex;justify-content:space-between;margin-bottom:8px">
          <div style="font-weight:600;font-size:15px">Q${i + 1}. ${esc(q.q)}</div>
          <span class="tag t-gd">${q.marks} Marks</span>
        </div>
        <textarea class="qa-ta" placeholder="Apna jawab yahan likho..." oninput="S.testAnswers.short[${i}]=this.value;updWC(this)" style="min-height:90px"></textarea>
        <div style="display:flex;align-items:center;gap:10px;margin-top:6px">
          <div class="wc" style="margin-top:0">0 words</div>
          <input type="file" id="tsImgIn${i}" accept="image/*" style="display:none" onchange="handleTestAnswerScan(event,'short',${i})">
          <button class="btn btn-s" style="padding:5px 12px;font-size:12px" onclick="document.getElementById('tsImgIn${i}').click()">📷 Scan</button>
        </div>
      </div>`;
    });
    html += `</div>`;
  }

  if (d.longQs?.length) {
    html += `<div class="sumb"><h3>📖 Section C — Long Questions</h3>`;
    d.longQs.forEach((q, i) => {
      html += `<div style="margin-bottom:20px">
        <div style="display:flex;justify-content:space-between;margin-bottom:8px">
          <div style="font-weight:600;font-size:15px">Q${i + 1}. ${esc(q.q)}</div>
          <span class="tag t-gd">${q.marks} Marks</span>
        </div>
        ${q.guide ? `<div style="font-size:12px;color:var(--s);margin-bottom:6px">💡 ${esc(q.guide)}</div>` : ''}
        <textarea class="qa-ta lng" placeholder="Detailed jawab likho..." oninput="S.testAnswers.long[${i}]=this.value" style="min-height:150px"></textarea>
        <div style="display:flex;align-items:center;gap:10px;margin-top:6px">
          <input type="file" id="tlImgIn${i}" accept="image/*" style="display:none" onchange="handleTestAnswerScan(event,'long',${i})">
          <button class="btn btn-s" style="padding:5px 12px;font-size:12px" onclick="document.getElementById('tlImgIn${i}').click()">📷 Scan</button>
        </div>
      </div>`;
    });
    html += `</div>`;
  }

  html += `<div style="display:flex;gap:10px;flex-wrap:wrap;margin-top:10px">
    <button class="btn btn-p btn-lg" onclick="submitTest()">✅ Test Submit Karo</button>
    <button class="btn btn-g" onclick="show('test-set')">← Dobara Setup</button>
  </div>`;

  document.getElementById('testPaperCont').innerHTML = html;
}

/** Scan a handwritten test answer image and drop the text into its textarea */
async function handleTestAnswerScan(e, section, idx) {
  const file = e.target.files[0];
  if (!file) return;
  const inp = e.target;
  const ta = inp.closest('div').previousElementSibling;
  if (ta && ta.tagName === 'TEXTAREA') { ta.value = 'Scan ho raha hai... ⏳'; ta.disabled = true; }
  try {
    const text = await ocrFile(file);
    if (ta) { ta.value = text || ''; ta.disabled = false; }
    if (section === 'short') S.testAnswers.short[idx] = text;
    else S.testAnswers.long[idx] = text;
  } catch (er) {
    if (ta) { ta.value = ''; ta.disabled = false; }
    alert('Scan fail: ' + er.message);
  }
  e.target.value = '';
}

/** Submit the full test — auto-grade MCQs, AI-evaluate short/long answers */
async function submitTest() {
  const d = S.testData;
  if (!d) return;
  show('test-result');
  document.getElementById('testResultCont').innerHTML = loadHTML('AI test check kar raha hai...', 'Saare answers evaluate ho rahe hain');

  let mcqCorrect = 0, mcqTotal = d.mcqs?.length || 0;
  d.mcqs?.forEach((q, i) => { if (S.testAnswers.mcq[i] === q.correct) mcqCorrect++; });

  let shortEvals = [], longEvals = [];

  for (let i = 0; i < (d.shortQs?.length || 0); i++) {
    const q = d.shortQs[i], ans = S.testAnswers.short[i] || '(No answer)';
    try {
      const p = `Evaluate: Class ${S.cls} ${S.sub} short question. Q: ${q.q}. Key: ${q.keyPoints?.join('; ') || ''}. Marks: ${q.marks}. Answer: "${ans}". Return ONLY raw JSON: {"score":${q.marks},"grade":"A","feedback":"..."}`;
      const r = await ai(p, 400);
      let ev; try { ev = JSON.parse(extractJ(r)); } catch (je) { ev = { score: 0, grade: '?', feedback: r.substring(0, 100) }; }
      shortEvals.push(ev);
    } catch (e) { shortEvals.push({ score: 0, grade: '?', feedback: 'Evaluation fail' }); }
  }
  for (let i = 0; i < (d.longQs?.length || 0); i++) {
    const q = d.longQs[i], ans = S.testAnswers.long[i] || '(No answer)';
    try {
      const p = `Evaluate: Class ${S.cls} ${S.sub} long question. Q: ${q.q}. Key: ${q.keyPoints?.join('; ') || ''}. Marks: ${q.marks}. Answer: "${ans}". Return ONLY raw JSON: {"score":${q.marks},"grade":"A","feedback":"..."}`;
      const r = await ai(p, 500);
      let ev; try { ev = JSON.parse(extractJ(r)); } catch (je) { ev = { score: 0, grade: '?', feedback: r.substring(0, 100) }; }
      longEvals.push(ev);
    } catch (e) { longEvals.push({ score: 0, grade: '?', feedback: 'Evaluation fail' }); }
  }

  const shortTotal = d.shortQs?.reduce((a, q) => a + q.marks, 0) || 0;
  const longTotal = d.longQs?.reduce((a, q) => a + q.marks, 0) || 0;
  const shortEarned = shortEvals.reduce((a, e) => a + parseFloat(e.score || 0), 0);
  const longEarned = longEvals.reduce((a, e) => a + parseFloat(e.score || 0), 0);
  const totalEarned = mcqCorrect + shortEarned + longEarned;
  const totalMax = mcqTotal + shortTotal + longTotal;
  const pct = totalMax ? Math.round((totalEarned / totalMax) * 100) : 0;
  let grade = 'F';
  if (pct >= 90) grade = 'A+'; else if (pct >= 80) grade = 'A'; else if (pct >= 70) grade = 'B+'; else if (pct >= 60) grade = 'B'; else if (pct >= 50) grade = 'C';

  const L = ['A', 'B', 'C', 'D'];
  let html = `
  <button class="bk" onclick="show('test-set')">← Wapas</button>
  <div class="res-hero">
    <div class="res-sc">${pct}%</div>
    <div class="res-lb">${totalEarned.toFixed(1)} / ${totalMax} marks</div>
    <div class="res-gr" style="background:var(--pd);color:var(--p);border:1.5px solid rgba(0,212,170,.4)">Grade: ${grade}</div>
  </div>
  <div class="res-stats">
    <div class="rs"><div class="rs-n" style="color:var(--p)">${mcqCorrect}/${mcqTotal}</div><div class="rs-l">MCQs</div></div>
    <div class="rs"><div class="rs-n" style="color:var(--s)">${shortEarned.toFixed(1)}/${shortTotal}</div><div class="rs-l">Short Qs</div></div>
    <div class="rs"><div class="rs-n" style="color:var(--g)">${longEarned.toFixed(1)}/${longTotal}</div><div class="rs-l">Long Qs</div></div>
  </div>`;

  if (d.mcqs?.length) {
    html += `<div class="sumb"><h3>📝 MCQ Review</h3>`;
    d.mcqs.forEach((q, i) => {
      const userAns = S.testAnswers.mcq[i], ok = userAns === q.correct;
      html += `<div style="margin-bottom:14px;padding:12px;border-radius:10px;background:var(--bg2);border:1px solid ${ok ? 'rgba(34,197,94,.4)' : 'rgba(239,68,68,.35)'}">
        <div style="font-size:13px;font-weight:600;margin-bottom:4px">${ok ? '✅' : '❌'} Q${i + 1}. ${esc(q.q)}</div>
        <div style="font-size:12px;color:var(--t2)">Tumhara: <strong>${userAns >= 0 ? L[userAns] : '—'}</strong> | Sahi: <strong style="color:var(--ok)">${L[q.correct]}</strong></div>
        ${!ok && q.exp ? `<div style="font-size:12px;color:var(--t2);margin-top:4px">💡 ${esc(q.exp)}</div>` : ''}
      </div>`;
    });
    html += `</div>`;
  }

  if (d.shortQs?.length) {
    html += `<div class="sumb"><h3>✍️ Short Question Review</h3>`;
    d.shortQs.forEach((q, i) => {
      const ev = shortEvals[i] || {};
      html += `<div style="margin-bottom:16px;padding:14px;border-radius:10px;background:var(--bg2);border:1px solid var(--b2)">
        <div style="font-weight:600;margin-bottom:6px">Q${i + 1}. ${esc(q.q)}</div>
        <div style="display:flex;gap:8px;margin-bottom:6px"><span class="tag t-vi">Grade: ${esc(ev.grade || '?')}</span><span class="tag t-gd">${ev.score || 0}/${q.marks}</span></div>
        ${ev.feedback ? `<div style="font-size:13px;color:var(--t2);line-height:1.5">${esc(ev.feedback)}</div>` : ''}
      </div>`;
    });
    html += `</div>`;
  }

  if (d.longQs?.length) {
    html += `<div class="sumb"><h3>📖 Long Question Review</h3>`;
    d.longQs.forEach((q, i) => {
      const ev = longEvals[i] || {};
      html += `<div style="margin-bottom:16px;padding:14px;border-radius:10px;background:var(--bg2);border:1px solid var(--b2)">
        <div style="font-weight:600;margin-bottom:6px">Q${i + 1}. ${esc(q.q)}</div>
        <div style="display:flex;gap:8px;margin-bottom:6px"><span class="tag t-vi">Grade: ${esc(ev.grade || '?')}</span><span class="tag t-gd">${ev.score || 0}/${q.marks}</span></div>
        ${ev.feedback ? `<div style="font-size:13px;color:var(--t2);line-height:1.5">${esc(ev.feedback)}</div>` : ''}
      </div>`;
    });
    html += `</div>`;
  }

  html += `<div style="display:flex;gap:10px;flex-wrap:wrap;margin-top:10px">
    <button class="btn btn-p" onclick="startFullTest()">🔄 Naya Test</button>
    <button class="btn btn-g" onclick="show('mode')">← Menu</button>
  </div>`;

  document.getElementById('testResultCont').innerHTML = html;
  addXP(Math.round(totalEarned * 2));
}

/* ══════════════════════════════════════════════
   SHORT / LONG QUESTIONS (AI generated + checked)
   ══════════════════════════════════════════════ */
async function startQA(tp) {
  S.qaType = tp; S.qaIdx = 0; S.qaData = []; S.qaEvals = [];
  const cont = document.getElementById(tp === 'short' ? 'shCont' : 'lgCont');
  document.getElementById(tp === 'short' ? 'shTit' : 'lgTit').textContent = `${tp === 'short' ? 'Short' : 'Long'} Question Practice — ${S.sub}`;
  show(tp);
  cont.innerHTML = `${aiSelectorHTML('qaAiSel')}
  <div style="display:flex;gap:10px;margin-bottom:18px;flex-wrap:wrap">
    <button class="btn btn-p" onclick="startQANormal('${tp}')">🤖 AI se Questions Banao</button>
    <button class="btn btn-s" onclick="qaQuestionScan('${tp}')">📷 Image Scan se Questions</button>
  </div>
  <p style="font-size:13px;color:var(--t2)">Ya seedha AI se ${tp === 'short' ? 'short' : 'long'} questions generate karo, ya textbook/paper ki photo upload karo.</p>`;
}

async function startQANormal(tp) {
  const cnt = tp === 'short' ? 5 : 3;
  const cont = document.getElementById(tp === 'short' ? 'shCont' : 'lgCont');
  cont.innerHTML = aiSelectorHTML('qaAiSel') + loadHTML(`${tp === 'short' ? 'Short' : 'Long'} questions generate ho rahe hain...`);
  const prompt = tp === 'short'
    ? `Generate ${cnt} important short questions for Pakistan ${BOARDS.find(b => b.id === S.brd)?.nm || 'Punjab'} board, Class ${S.cls}, Subject ${S.sub}, Chapter ${getChNm()}. Return ONLY raw JSON with no extra text, no markdown, no asterisks: [{"q":"question","keyPoints":["point1","point2","point3"],"marks":2}]`
    : `Generate ${cnt} important long questions for Pakistan ${BOARDS.find(b => b.id === S.brd)?.nm || 'Punjab'} board, Class ${S.cls}, Subject ${S.sub}, Chapter ${getChNm()}. Return ONLY raw JSON with no extra text, no markdown, no asterisks: [{"q":"question","keyPoints":["point1","point2","point3","point4","point5"],"marks":5,"guide":"~150-200 words"}]`;
  try {
    const txt = await ai(prompt, 1200);
    S.qaData = JSON.parse(extractJ(txt));
    if (!Array.isArray(S.qaData) || !S.qaData.length) throw new Error();
    S.qaEvals = new Array(S.qaData.length).fill(null);
    renderQA();
  } catch (e) {
    cont.innerHTML = errHTML('Questions load nahi ho sake: ' + e.message);
  }
}

/** Scan a textbook/question paper image and turn it into practice questions */
async function qaQuestionScan(tp) {
  const inp = document.createElement('input');
  inp.type = 'file'; inp.accept = 'image/*';
  inp.onchange = async (e) => {
    const file = e.target.files[0]; if (!file) return;
    const cont = document.getElementById(tp === 'short' ? 'shCont' : 'lgCont');
    cont.innerHTML = loadHTML('📷 Question scan ho raha hai...');
    try {
      const text = await ocrFile(file);
      if (!text || text.length < 5) { cont.innerHTML = errHTML('Image mein text nahi mila — saaf photo lo'); return; }
      const prompt = tp === 'short'
        ? `From this scanned question/text, generate 3-5 short questions for Pakistan board exam style. Return ONLY raw JSON: [{"q":"...","keyPoints":["..."],"marks":2}]\n\nText: ${text.substring(0, 2000)}`
        : `From this scanned question/text, generate 2-3 long questions for Pakistan board exam style. Return ONLY raw JSON: [{"q":"...","keyPoints":["..."],"marks":5,"guide":"~150 words"}]\n\nText: ${text.substring(0, 2000)}`;
      const resp = await ai(prompt, 1000);
      let d;
      try { d = JSON.parse(extractJ(resp)); }
      catch (je) { cont.innerHTML = errHTML('AI response parse nahi hua, dobara try karo'); return; }
      S.qaData = d; S.qaType = tp; S.qaIdx = 0; S.qaEvals = new Array(d.length).fill(null);
      renderQA();
    } catch (er) { cont.innerHTML = errHTML('Scan fail: ' + er.message); }
  };
  inp.click();
}

/** Scan a handwritten answer and drop the text into the active answer box */
async function handleQaAnswerScan(e, tp) {
  const file = e.target.files[0]; if (!file) return;
  const ansEl = document.getElementById('qaAns');
  if (ansEl) { ansEl.value = 'Scan ho raha hai... ⏳'; ansEl.disabled = true; }
  try {
    const text = await ocrFile(file);
    if (ansEl) { ansEl.value = text || ''; ansEl.disabled = false; updWC(ansEl); }
  } catch (er) {
    if (ansEl) { ansEl.value = ''; ansEl.disabled = false; }
    alert('Scan fail: ' + er.message);
  }
  e.target.value = '';
}

function qaAnsScanBtn(tp) {
  return `<div style="margin-top:10px">
    <input type="file" id="qaImgIn" accept="image/*" style="display:none" onchange="handleQaAnswerScan(event,'${tp}')">
    <button class="btn btn-s" style="padding:7px 14px;font-size:13px" onclick="document.getElementById('qaImgIn').click()">📷 Answer Scan Karo</button>
    <span style="font-size:12px;color:var(--t2);margin-left:8px">Handwritten jawab ki photo lo</span>
  </div>`;
}

function renderQA() {
  const tp = S.qaType, cont = document.getElementById(tp === 'short' ? 'shCont' : 'lgCont');
  if (S.qaIdx >= S.qaData.length) { renderQARes(); return; }
  const q = S.qaData[S.qaIdx], ev = S.qaEvals[S.qaIdx], isL = tp === 'long';
  cont.innerHTML = `
  ${aiSelectorHTML('qaAiSel')}
  ${S.qaIdx === 0 ? fallbackNoteHTML() : ''}
  <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:18px;flex-wrap:wrap;gap:8px">
    <span style="font-size:14px;color:var(--t2)">Question ${S.qaIdx + 1} of ${S.qaData.length}</span>
    <div style="display:flex;gap:8px"><span class="tag t-gd">${q.marks} Marks</span>${q.guide ? `<span class="tag t-vi">${esc(q.guide)}</span>` : ''}</div>
  </div>
  <div class="crd" style="margin-bottom:18px">
    <div class="qa-q"><span style="color:var(--t3);font-size:13px">Q${S.qaIdx + 1}. </span>${esc(q.q)}</div>
    <label style="font-size:12px;font-weight:700;color:var(--t2);display:block;margin-bottom:9px;text-transform:uppercase;letter-spacing:1px">Apna jawab likho:</label>
    <textarea class="qa-ta${isL ? ' lng' : ''}" id="qaAns" placeholder="${isL ? 'Detailed paragraph jawab...' : 'Short jawab (2-3 lines)...'}" oninput="updWC(this)">${ev ? esc(ev.userAns || '') : ''}</textarea>
    <div class="wc" id="wc">0 words</div>
    ${qaAnsScanBtn(tp)}
    <div style="display:flex;gap:10px;flex-wrap:wrap;margin-top:18px">
      <button class="btn btn-p" onclick="evalAns()">🤖 AI se Check Karo</button>
      ${S.qaIdx > 0 ? `<button class="btn btn-g" onclick="prevQA()">← Pichla</button>` : ''}
      <button class="btn btn-g" onclick="skipQA()">Skip →</button>
    </div>
  </div>
  <div id="evRes">${ev ? renderEv(ev, q) : ''}</div>
  ${ev ? `<div style="text-align:center;margin-top:20px"><button class="btn btn-p" onclick="nextQA()">${S.qaIdx + 1 < S.qaData.length ? 'Agla Sawal →' : '🏆 Results Dekho'}</button></div>` : ''}`;
  if (ev?.userAns) updWC(document.getElementById('qaAns'));
}

function updWC(el) {
  const w = el.value.trim().split(/\s+/).filter(x => x).length;
  const wc = document.getElementById('wc');
  if (wc) wc.textContent = `${w} words`;
}

async function evalAns() {
  const ans = document.getElementById('qaAns')?.value?.trim();
  if (!ans || ans.length < 5) { alert('Pehle apna jawab likho!'); return; }
  const q = S.qaData[S.qaIdx];
  document.getElementById('evRes').innerHTML = loadHTML('AI check kar raha hai...');
  const prompt = `Evaluate student answer for Class ${S.cls}, ${BOARDS.find(b => b.id === S.brd)?.nm || 'Punjab'} Board, Subject ${S.sub}. Question: ${q.q}. Key Points: ${q.keyPoints.join('; ')}. Marks: ${q.marks}. Student Answer: "${ans}". Return ONLY raw JSON with no extra text, no markdown, no asterisks: {"score":${q.marks},"grade":"A","correct":["..."],"missing":["..."],"suggestions":"...","sampleAnswer":"..."}`;
  try {
    const txt = await ai(prompt, 700);
    let ev;
    try { ev = JSON.parse(extractJ(txt)); }
    catch (je) {
      ev = {
        score: Math.round(q.marks * 0.5), grade: 'C', correct: ['Jawab submit hua'],
        missing: ['AI response format mein masla tha — dobara try karo for detailed feedback'],
        suggestions: txt.substring(0, 400), sampleAnswer: ''
      };
    }
    ev.userAns = ans; S.qaEvals[S.qaIdx] = ev;
    document.getElementById('evRes').innerHTML = fallbackNoteHTML() + renderEv(ev, q);
    document.getElementById('evRes').insertAdjacentHTML('afterend',
      `<div style="text-align:center;margin-top:20px"><button class="btn btn-p" onclick="nextQA()">${S.qaIdx + 1 < S.qaData.length ? 'Agla Sawal →' : '🏆 Results Dekho'}</button></div>`);
    addXP(Math.max(2, Math.round((parseFloat(ev.score) / q.marks) * 15)));
  } catch (e) {
    document.getElementById('evRes').innerHTML = errHTML('Evaluation nahi ho saki: ' + e.message);
  }
}

function renderEv(ev, q) {
  const sc = parseFloat(ev.score) || 0, max = q ? q.marks : 10;
  return `<div class="aiev">
    <div class="aiev-hdr"><div><div style="font-size:11px;color:var(--s);text-transform:uppercase;letter-spacing:1.5px;font-weight:700;margin-bottom:4px">AI Evaluation</div><div class="aiev-sc">${sc}/${max} marks</div></div>
      <div style="margin-left:auto"><span class="tag t-vi" style="font-size:15px;padding:8px 18px">Grade: ${esc(ev.grade || '—')}</span></div></div>
    ${ev.correct?.length ? `<div class="evs"><div class="evs-t">✅ Kya Sahi</div><ul class="evl">${ev.correct.map(p => `<li>${esc(p)}</li>`).join('')}</ul></div>` : ''}
    ${ev.missing?.length ? `<div class="evs"><div class="evs-t" style="color:var(--r)">❌ Kya Reh Gaya</div><ul class="evl">${ev.missing.map(p => `<li>${esc(p)}</li>`).join('')}</ul></div>` : ''}
    ${ev.suggestions ? `<div class="evs"><div class="evs-t" style="color:var(--g)">💡 Suggestions</div><div style="font-size:14px;color:var(--t2);line-height:1.6">${esc(ev.suggestions)}</div></div>` : ''}
    ${ev.sampleAnswer ? `<div class="evs"><div class="evs-t" style="color:var(--p)">📖 Ideal Answer</div><div style="font-size:14px;color:var(--t2);line-height:1.7;padding:13px;background:var(--bg2);border-radius:10px;border:1px solid var(--b)">${esc(ev.sampleAnswer)}</div></div>` : ''}
  </div>`;
}

function nextQA() { S.qaIdx++; renderQA(); }
function prevQA() { S.qaIdx = Math.max(0, S.qaIdx - 1); renderQA(); }
function skipQA() { S.qaEvals[S.qaIdx] = null; nextQA(); }

function renderQARes() {
  const tp = S.qaType, cont = document.getElementById(tp === 'short' ? 'shCont' : 'lgCont');
  let tot = 0, earned = 0;
  S.qaData.forEach((q, i) => { tot += q.marks; if (S.qaEvals[i]) earned += parseFloat(S.qaEvals[i].score) || 0; });
  const pct = tot > 0 ? Math.round((earned / tot) * 100) : 0;
  cont.innerHTML = `<div class="res-hero"><div class="res-sc">${earned}/${tot}</div><div class="res-lb">${pct}% marks earned</div></div>
  <div style="display:flex;gap:10px;flex-wrap:wrap;justify-content:center;margin:20px 0">
    <button class="btn btn-p" onclick="startQA('${tp}')">🔄 Naye Questions</button>
    <button class="btn btn-g" onclick="show('mode')">← Menu</button>
  </div>`;
}

/* ══════════════════════════════════════════════
   AI SUMMARY
   ══════════════════════════════════════════════ */
async function startSummary() {
  show('summary');
  document.getElementById('smTit').innerHTML = `${SMETA[S.sub]?.ic || '📚'} ${getChNm()}`;
  document.getElementById('smCont').innerHTML = aiSelectorHTML('smAiSel') + loadHTML('AI summary bana raha hai...');
  const prompt = `Create summary for Class ${S.cls}, ${BOARDS.find(b => b.id === S.brd)?.nm || 'Punjab'} Board, Subject ${S.sub}, Chapter ${getChNm()}. Return ONLY raw JSON with no extra text, no markdown, no asterisks: {"overview":"...","keyTopics":[{"topic":"...","desc":"..."}],"formulas":["..."],"memorize":["..."],"examTips":["..."],"commonMistakes":["..."]}`;
  try {
    const txt = await ai(prompt, 1500);
    let d;
    try { d = JSON.parse(extractJ(txt)); }
    catch (je) { document.getElementById('smCont').innerHTML = aiSelectorHTML('smAiSel') + errHTML('Summary format samajh nahi aaya, dobara try karo.', 'startSummary'); return; }
    document.getElementById('smCont').innerHTML = `
    ${aiSelectorHTML('smAiSel', 'startSummary()')}
    ${fallbackNoteHTML()}
    <div class="sumb"><h3>📋 Overview</h3><p style="font-size:15px;line-height:1.7;color:var(--t2)">${esc(d.overview)}</p></div>
    ${d.keyTopics?.length ? `<div class="sumb"><h3>🎯 Key Topics</h3><ul class="suml">${d.keyTopics.map(t => `<li><strong style="color:var(--t)">${esc(t.topic)}:</strong> ${esc(t.desc)}</li>`).join('')}</ul></div>` : ''}
    ${d.formulas?.length ? `<div class="sumb"><h3>🔢 Formulas</h3><ul class="suml">${d.formulas.map(f => `<li class="fm">${esc(f)}</li>`).join('')}</ul></div>` : ''}
    ${d.memorize?.length ? `<div class="sumb"><h3>🧠 Yaad Rakho</h3><ul class="suml">${d.memorize.map(m => `<li>⭐ ${esc(m)}</li>`).join('')}</ul></div>` : ''}
    ${d.examTips?.length ? `<div class="sumb" style="border-color:rgba(0,212,170,.3);background:var(--pd)"><h3>📝 Board Exam Tips</h3><ul class="suml">${d.examTips.map((t, i) => `<li>${i + 1}. ${esc(t)}</li>`).join('')}</ul></div>` : ''}
    ${d.commonMistakes?.length ? `<div class="sumb" style="border-color:rgba(239,68,68,.3);background:var(--rd)"><h3 style="color:var(--r)">⚠️ Common Mistakes</h3><ul class="suml">${d.commonMistakes.map(m => `<li>${esc(m)}</li>`).join('')}</ul></div>` : ''}
    <button class="btn btn-g" onclick="show('mode')">← Menu</button>`;
    addXP(20);
  } catch (e) {
    document.getElementById('smCont').innerHTML = aiSelectorHTML('smAiSel') + errHTML('Summary nahi aa saki: ' + e.message, 'startSummary');
  }
}

/* ══════════════════════════════════════════════
   AI GUESS PAPER
   ══════════════════════════════════════════════ */
async function startGuess() {
  show('guess');
  document.getElementById('gpTit').innerHTML = `${SMETA[S.sub]?.ic || '🎰'} ${esc(S.sub)} — Guess Paper`;
  document.getElementById('gpCont').innerHTML = aiSelectorHTML('gpAiSel') + loadHTML('AI guess paper bana raha hai...');
  const prompt = `Create guess paper for Class ${S.cls}, ${BOARDS.find(b => b.id === S.brd)?.nm || 'Punjab'} Board, Subject ${S.sub}, Chapter ${getChNm()}. Return ONLY raw JSON with no extra text, no markdown, no asterisks: {"mcqs":[{"q":"...","opts":["A","B","C","D"],"likely":"high/medium"}],"shortQ":[{"q":"...","likely":"high/medium","marks":2}],"longQ":[{"q":"...","likely":"high/medium","marks":5}],"hotTopics":["..."],"tip":"..."}`;
  try {
    const txt = await ai(prompt, 1800);
    let d;
    try { d = JSON.parse(extractJ(txt)); }
    catch (je) { document.getElementById('gpCont').innerHTML = aiSelectorHTML('gpAiSel') + errHTML('Guess paper format samajh nahi aaya, dobara try karo.', 'startGuess'); return; }
    const lbl = l => `<span class="likelihood" style="background:${l === 'high' ? 'var(--okd)' : 'var(--gd)'};color:${l === 'high' ? 'var(--ok)' : 'var(--g)'}">${l === 'high' ? '🔥 High Chance' : '⭐ Medium'}</span>`;
    const L = ['A', 'B', 'C', 'D'];
    document.getElementById('gpCont').innerHTML = `
    ${aiSelectorHTML('gpAiSel', 'startGuess()')}
    ${fallbackNoteHTML()}
    ${d.hotTopics?.length ? `<div class="gp-sec"><h3>🎯 Hot Topics</h3>${d.hotTopics.map(t => `<div class="gp-q">🔥 ${esc(t)}</div>`).join('')}</div>` : ''}
    ${d.mcqs?.length ? `<div class="gp-sec"><h3>📝 Likely MCQs</h3>${d.mcqs.map((q, i) => `<div class="gp-q">${lbl(q.likely)}<div style="font-weight:600;margin:6px 0">Q${i + 1}. ${esc(q.q)}</div><div style="display:grid;grid-template-columns:1fr 1fr;gap:4px;font-size:13px;color:var(--t2)">${q.opts.map((o, j) => `<div>${L[j]}. ${esc(o)}</div>`).join('')}</div></div>`).join('')}</div>` : ''}
    ${d.shortQ?.length ? `<div class="gp-sec"><h3>✍️ Likely Short Qs</h3>${d.shortQ.map((q, i) => `<div class="gp-q">${lbl(q.likely)} <span class="tag t-gd">${q.marks} Marks</span><div style="margin-top:6px;font-weight:600">Q${i + 1}. ${esc(q.q)}</div></div>`).join('')}</div>` : ''}
    ${d.longQ?.length ? `<div class="gp-sec"><h3>📖 Likely Long Qs</h3>${d.longQ.map((q, i) => `<div class="gp-q">${lbl(q.likely)} <span class="tag t-gd">${q.marks} Marks</span><div style="margin-top:6px;font-weight:600">Q${i + 1}. ${esc(q.q)}</div></div>`).join('')}</div>` : ''}
    ${d.tip ? `<div class="sumb" style="border-color:rgba(0,212,170,.3);background:var(--pd)"><h3>💡 Exam Strategy</h3><p style="font-size:14px;color:var(--t2);line-height:1.6">${esc(d.tip)}</p></div>` : ''}
    <button class="btn btn-g" onclick="show('mode')">← Menu</button>`;
    addXP(15);
  } catch (e) {
    document.getElementById('gpCont').innerHTML = aiSelectorHTML('gpAiSel') + errHTML('Guess paper nahi aa saka: ' + e.message, 'startGuess');
  }
}
