/* ═══════════════════════════════════════════════
   IlmAI — scanner.js
   Image Scanner page — OCR + AI follow-up actions
   ═══════════════════════════════════════════════ */

function renderScanPage() {
  document.getElementById('scanTit').textContent = `📷 ${S.sub} — Image Scanner`;
  document.getElementById('scanResult').innerHTML = '';
  const sel = document.getElementById('scanOcrProvider');
  if (sel) { sel.value = 'ocrspace'; S.ocrProvider = 'ocrspace'; }
}

function scanDrag(e, on) {
  e.preventDefault();
  document.getElementById('scanDrop').classList.toggle('drag', on);
}

function scanDropFile(e) {
  e.preventDefault();
  document.getElementById('scanDrop').classList.remove('drag');
  const f = e.dataTransfer.files[0];
  if (f && f.type.startsWith('image/')) processScanFile(f);
}

function handleScanFile(e) {
  const f = e.target.files[0];
  if (f) processScanFile(f);
}

async function processScanFile(file) {
  const res = document.getElementById('scanResult');
  res.innerHTML = loadHTML('📷 Image scan ho rahi hai...', 'OCR engine text extract kar raha hai');
  try {
    const text = await ocrFile(file);
    if (!text || text.length < 10) {
      res.innerHTML = errHTML('Image mein clear text nahi mila. Saaf photo lo aur dobara try karo.');
      return;
    }
    const imgUrl = URL.createObjectURL(file);
    res.innerHTML = `
    <div class="scan-result">
      <img src="${imgUrl}" alt="Scanned page preview" style="width:100%;max-height:200px;object-fit:contain;border-radius:10px;margin-bottom:16px;border:1px solid var(--b)">
      <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:10px">
        <span style="font-size:13px;font-weight:700;color:var(--p)">📝 Scanned Text (${text.split(/\s+/).filter(Boolean).length} words)</span>
        <button class="btn btn-s" style="padding:6px 14px;font-size:13px" onclick="navigator.clipboard.writeText(document.getElementById('scannedTxt').value)">📋 Copy</button>
      </div>
      <textarea id="scannedTxt" class="ocr-text-box" style="height:160px">${esc(text)}</textarea>
      <div style="margin-top:16px">
        <div style="font-size:13px;font-weight:700;color:var(--t2);margin-bottom:10px">Is text se kya karna chahte ho?</div>
        <div style="display:flex;gap:10px;flex-wrap:wrap">
          <button class="btn btn-p" onclick="scanAI('mcq')">🎯 MCQs Banao</button>
          <button class="btn btn-s" onclick="scanAI('summary')">🧠 Summary</button>
          <button class="btn btn-s" onclick="scanAI('short')">✍️ Short Questions</button>
          <button class="btn btn-g" onclick="renderScanPage()">🔄 Nai Image</button>
        </div>
      </div>
      <div id="scanAiRes" style="margin-top:20px"></div>
    </div>`;
  } catch (e) {
    res.innerHTML = errHTML('Scan fail: ' + e.message);
  }
}

async function scanAI(type) {
  const text = document.getElementById('scannedTxt')?.value;
  if (!text) return;
  const aiRes = document.getElementById('scanAiRes');
  aiRes.innerHTML = loadHTML('AI process kar raha hai...', 'Thora intezaar karo');
  let prompt = '';
  if (type === 'mcq')
    prompt = `From this text extracted from a Pakistan ${S.cls} class ${S.sub} textbook, generate 5 MCQs. Return ONLY raw JSON with no extra text, no markdown, no asterisks: [{"q":"...","opts":["A","B","C","D"],"correct":0,"exp":"..."}]\n\nText:\n${text.substring(0, 2000)}`;
  else if (type === 'summary')
    prompt = `Create a concise study summary from this Pakistan ${S.cls} class ${S.sub} textbook text. Return ONLY raw JSON with no extra text, no markdown, no asterisks: {"overview":"...","keyTopics":[{"topic":"...","desc":"..."}],"formulas":["..."],"memorize":["..."]}\n\nText:\n${text.substring(0, 2000)}`;
  else if (type === 'short')
    prompt = `From this text, generate 4 important short questions (board exam style) for Pakistan Class ${S.cls} ${S.sub}. Return ONLY raw JSON with no extra text, no markdown, no asterisks: [{"q":"...","keyPoints":["..."],"marks":2}]\n\nText:\n${text.substring(0, 2000)}`;
  try {
    const resp = await ai(prompt, 1500);
    let d;
    try { d = JSON.parse(extractJ(resp)); }
    catch (je) { aiRes.innerHTML = errHTML('AI ka response samajh nahi aaya, dobara try karo.'); return; }
    if (type === 'mcq') { S.qzData = d; S.qzIdx = 0; S.qzAns = new Array(d.length).fill(null); show('mcq-quiz'); renderQ(); }
    else if (type === 'summary') renderSummaryDirect(d, aiRes);
    else { S.qaData = d; S.qaType = 'short'; S.qaIdx = 0; S.qaEvals = new Array(d.length).fill(null); show('short'); renderQA(); }
  } catch (e) {
    aiRes.innerHTML = errHTML('AI response mein masla: ' + e.message);
  }
}

function renderSummaryDirect(d, el) {
  el.innerHTML = `
  ${fallbackNoteHTML()}
  <div class="sumb"><h3>📋 Overview</h3><p style="font-size:14px;line-height:1.7;color:var(--t2)">${esc(d.overview)}</p></div>
  ${d.keyTopics?.length ? `<div class="sumb"><h3>🎯 Key Topics</h3><ul class="suml">${d.keyTopics.map(t => `<li><strong>${esc(t.topic)}:</strong> ${esc(t.desc)}</li>`).join('')}</ul></div>` : ''}
  ${d.formulas?.length ? `<div class="sumb"><h3>🔢 Formulas</h3><ul class="suml">${d.formulas.map(f => `<li class="fm">${esc(f)}</li>`).join('')}</ul></div>` : ''}
  ${d.memorize?.length ? `<div class="sumb"><h3>🧠 Yaad Rakho</h3><ul class="suml">${d.memorize.map(m => `<li>⭐ ${esc(m)}</li>`).join('')}</ul></div>` : ''}`;
  addXP(20);
}
