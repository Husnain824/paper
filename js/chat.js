/* ═══════════════════════════════════════════════
   IlmAI — chat.js
   Floating AI chat widget + image OCR inside chat
   ═══════════════════════════════════════════════ */

function toggleChat() {
  S.chatOpen = !S.chatOpen;
  document.getElementById('cpanel').classList.toggle('open', S.chatOpen);
  document.getElementById('ctog').textContent = S.chatOpen ? '✕' : '💬';
  if (!S.chatOpen) document.getElementById('cpanel').classList.remove('fullscreen');
}

function toggleChatFull() {
  const p = document.getElementById('cpanel');
  const isFs = p.classList.toggle('fullscreen');
  const btn = document.getElementById('cfulbtn');
  btn.title = isFs ? 'Exit Fullscreen' : 'Fullscreen';
  btn.style.color = isFs ? 'var(--p)' : '';
}

function chatKey(e) {
  if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendChat(); }
}

function autoH(el) {
  el.style.height = 'auto';
  el.style.height = Math.min(el.scrollHeight, 100) + 'px';
}

async function sendChat() {
  const inp = document.getElementById('cinp');
  const msg = inp.value.trim();
  if (!msg) return;
  inp.value = ''; inp.style.height = 'auto';
  addMsg('u', esc(msg));
  S.chatH.push({ role: 'user', content: msg });
  const tyEl = addMsg('a', '<span style="opacity:.6">●●●</span>');
  const ctx = S.sub ? `Student studying: Class ${S.cls} ${S.sub}, Chapter: ${getChNm()}.` : 'Student on main page.';
  try {
    const txt = await ai(`[System: You are IlmAI, friendly Pakistani study tutor. ${ctx} Reply in student's language (Roman Urdu or English).]\nStudent: ${msg}`, 700);
    const note = S.lastAiFallback ? `<div style="font-size:11px;color:var(--g);margin-bottom:6px">⚠️ Gemini available nahi tha — Groq se jawab diya gaya</div>` : '';
    tyEl.innerHTML = note + esc(txt).replace(/\n/g, '<br>');
    S.chatH.push({ role: 'assistant', content: txt });
    if (S.chatH.length > 20) S.chatH = S.chatH.slice(-20);
  } catch (e) {
    tyEl.innerHTML = 'Maafi! Masla ho gaya, dobara try karo. 🙏';
  }
  document.getElementById('cmsgs').scrollTop = 99999;
}

function addMsg(role, txt) {
  const d = document.createElement('div');
  d.className = `cmsg ${role}`;
  d.innerHTML = typeof txt === 'string' ? txt.replace(/\n/g, '<br>') : txt;
  document.getElementById('cmsgs').appendChild(d);
  document.getElementById('cmsgs').scrollTop = 99999;
  return d;
}

/* ── Chat Image Scan (OCR modal launched from chat) ── */
let currentOcrFile = null;

async function handleChatImg(e) {
  const file = e.target.files[0];
  e.target.value = '';
  if (!file || !file.type.startsWith('image/')) return;
  currentOcrFile = file;
  document.getElementById('chatOcrProvider').value = 'ocrspace';
  S.ocrProvider = 'ocrspace';
  await runChatOcr(file);
}

async function rescanChatImg() {
  if (!currentOcrFile) return;
  await runChatOcr(currentOcrFile);
}

async function runChatOcr(file) {
  const modal = document.getElementById('ocr-modal');
  const preview = document.getElementById('ocr-preview');
  const status = document.getElementById('ocr-status');
  const textEl = document.getElementById('ocr-text');
  preview.src = URL.createObjectURL(file);
  textEl.value = '';
  status.textContent = '⏳ Image scan ho rahi hai — OCR chal raha hai...';
  status.style.color = 'var(--g)';
  modal.classList.add('open');
  try {
    const text = await ocrFile(file);
    if (!text || text.length < 5) {
      status.textContent = '⚠️ Text nahi mila. Saaf photo lo ya dusra engine try karo.';
      status.style.color = 'var(--r)';
      textEl.value = '';
    } else {
      textEl.value = text;
      status.textContent = `✅ ${text.split(/\s+/).filter(Boolean).length} words scan hue — review karo ya edit karo, phir "AI se Poochho"`;
      status.style.color = 'var(--ok)';
    }
  } catch (err) {
    status.textContent = '❌ Scan fail: ' + err.message;
    status.style.color = 'var(--r)';
  }
}

function closeOcrModal() {
  document.getElementById('ocr-modal').classList.remove('open');
  currentOcrFile = null;
}

async function sendOcrToChat() {
  const text = document.getElementById('ocr-text').value.trim();
  if (!text) { alert('Pehle scan karo ya text likho!'); return; }
  closeOcrModal();
  if (!S.chatOpen) toggleChat();
  if (currentOcrFile) {
    const imgMsg = addMsg('u', '');
    imgMsg.innerHTML = `<img class="cmsg-img" src="${URL.createObjectURL(currentOcrFile)}" alt="Uploaded scan"><div style="font-size:12px;color:var(--t2);margin-top:4px">📷 Image uploaded</div>`;
  }
  addMsg('u', esc(`📷 Scanned Text:\n${text.substring(0, 300)}${text.length > 300 ? '...' : ''}`));
  const tyEl = addMsg('a', '<span style="opacity:.6">●●●</span>');
  const ctx = S.sub ? `Student studying Class ${S.cls} ${S.sub}.` : 'Student using IlmAI.';
  try {
    const prompt = `[System: You are IlmAI, Pakistani study tutor. ${ctx} Student uploaded an image and extracted this text via OCR. Help them understand it, answer questions, or create practice material. Reply in Roman Urdu or English based on student's preference.]\n\nScanned text from image:\n"${text.substring(0, 1500)}"\n\nStudent wants help with this content.`;
    const reply = await ai(prompt, 800);
    tyEl.innerHTML = esc(reply).replace(/\n/g, '<br>');
  } catch (e) {
    tyEl.innerHTML = 'Maafi! AI response nahi aya. 🙏';
  }
  document.getElementById('cmsgs').scrollTop = 99999;
}

function copyOcrText() {
  const text = document.getElementById('ocr-text').value;
  navigator.clipboard.writeText(text).then(() => {
    const btn = event.target;
    btn.textContent = '✅ Copied!';
    setTimeout(() => btn.textContent = '📋 Copy Text', 2000);
  });
}
