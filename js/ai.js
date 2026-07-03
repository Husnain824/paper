/* ═══════════════════════════════════════════════
   IlmAI — ai.js
   AI provider calls (Groq default, Gemini optional)
   with silent Gemini→Groq fallback + OCR helpers
   ═══════════════════════════════════════════════ */

/**
 * Main AI entry point. Uses whichever provider is selected
 * in global state S.aiProvider. If Gemini fails for any reason,
 * silently retries with Groq and sets S.lastAiFallback so the UI
 * can show a small non-blocking notice.
 */
async function ai(prompt, maxT = 1000) {
  const provider = S.aiProvider;
  S.lastAiFallback = false;
  if (provider === 'gemini') {
    try {
      return await aiCall('gemini', prompt, maxT);
    } catch (e) {
      S.lastAiFallback = true;
      return await aiCall('groq', prompt, maxT);
    }
  }
  return await aiCall('groq', prompt, maxT);
}

/** Low-level call to the Cloudflare Worker for a given provider */
async function aiCall(provider, prompt, maxT) {
  const body = provider === 'gemini'
    ? { provider: 'gemini', model: S.geminiModel, messages: [{ role: 'user', content: prompt }], max_tokens: maxT }
    : { model: 'llama-3.3-70b-versatile', messages: [{ role: 'user', content: prompt }], max_tokens: maxT };
  const res = await fetch(WORKER_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  });
  if (!res.ok) { const t = await res.text(); throw new Error(`Worker ${res.status}: ${t}`); }
  const d = await res.json();
  if (d.error) throw new Error(d.error + (d.details ? ': ' + d.details : ''));
  if (!d.content?.[0]?.text) throw new Error('Invalid response: ' + JSON.stringify(d));
  return d.content[0].text;
}

/** Small non-blocking notice shown when Gemini silently fell back to Groq */
function fallbackNoteHTML() {
  return S.lastAiFallback
    ? `<div style="padding:9px 14px;background:var(--gd);border:1px solid rgba(245,200,66,.35);border-radius:10px;font-size:12px;color:var(--g);margin-bottom:14px">⚠️ Gemini abhi available nahi tha — Groq se jawab diya gaya hai.</div>`
    : '';
}

/** Reusable AI Engine dropdown (Groq default / Gemini + model variant) */
function aiSelectorHTML(id, regenFn = '') {
  const gOn = S.aiProvider === 'gemini';
  return `<div class="aisel">
    <label>🤖 AI Engine</label>
    <select id="${id}-provider" onchange="setAiProvider('${id}',this.value)">
      <option value="groq" ${!gOn ? 'selected' : ''}>⚡ Groq (Llama 3.3 — Fast, Default)</option>
      <option value="gemini" ${gOn ? 'selected' : ''}>✨ Gemini</option>
    </select>
    <select id="${id}-gmodel" style="${gOn ? '' : 'display:none'}" onchange="S.geminiModel=this.value">
      <option value="gemini-2.5-flash" ${S.geminiModel === 'gemini-2.5-flash' ? 'selected' : ''}>Flash (Balanced)</option>
      <option value="gemini-2.5-flash-lite" ${S.geminiModel === 'gemini-2.5-flash-lite' ? 'selected' : ''}>Flash-Lite (Fastest)</option>
      <option value="gemini-2.5-pro" ${S.geminiModel === 'gemini-2.5-pro' ? 'selected' : ''}>Pro (Most Accurate)</option>
    </select>
    ${regenFn ? `<button class="btn btn-s" style="padding:7px 14px;font-size:13px;margin-left:auto" onclick="${regenFn}">🔄 Dobara Banao</button>` : ''}
  </div>`;
}

function setAiProvider(id, val) {
  S.aiProvider = val;
  const gSel = document.getElementById(id === 'chat' ? 'chat-gmodel' : `${id}-gmodel`);
  if (gSel) gSel.style.display = val === 'gemini' ? '' : 'none';
}

/* ── OCR / Image helpers ── */

/** Client-side compress + base64-encode an image before upload */
async function compressImg(file) {
  return new Promise(resolve => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      const MAX = 1400;
      const r = Math.min(MAX / Math.max(img.width, img.height), 1);
      const c = document.createElement('canvas');
      c.width = Math.round(img.width * r);
      c.height = Math.round(img.height * r);
      c.getContext('2d').drawImage(img, 0, 0, c.width, c.height);
      c.toBlob(blob => {
        URL.revokeObjectURL(url);
        const rd = new FileReader();
        rd.onload = () => resolve({ base64: rd.result.split(',')[1], mimeType: 'image/jpeg', size: blob.size });
        rd.readAsDataURL(blob);
      }, 'image/jpeg', 0.85);
    };
    img.onerror = () => { URL.revokeObjectURL(url); resolve(null); };
    img.src = url;
  });
}

/** Send image to Worker for OCR (OCR.space for printed text, Gemini Vision for handwritten) */
async function ocrFile(file, provider = null) {
  const comp = await compressImg(file);
  if (!comp) throw new Error('Image compress nahi hua');
  if (comp.size > 4 * 1024 * 1024) throw new Error('Image bari hai — 4MB se choti honi chahiye');
  const useProvider = provider || S.ocrProvider;
  const res = await fetch(WORKER_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ action: 'ocr', imageBase64: comp.base64, mimeType: comp.mimeType, provider: useProvider })
  });
  if (!res.ok) { const t = await res.text(); throw new Error(`OCR error ${res.status}: ${t}`); }
  const d = await res.json();
  if (d.error) throw new Error(d.error);
  return d.text || '';
}
