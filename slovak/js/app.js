/* Ahoj! – Slovacco per italiani · app (vanilla JS, nessuna dipendenza) */
(function () {
'use strict';
const COURSE = window.COURSE, ALPHABET = window.ALPHABET;
const KEY = 'ahoj-sk-v1';
const DAY = 86400000;
const BOX_DAYS = [1, 2, 4, 8, 16];      // Leitner: intervallo dopo una risposta giusta, per scatola 1..5
const DAILY_GOAL = 50;
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
const esc = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const shuffle = a => { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
const pick = (a, n) => shuffle(a).slice(0, n);
const dkey = d => d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
const today = () => dkey(new Date());
const dayDiff = (a, b) => Math.round((new Date(b + 'T12:00') - new Date(a + 'T12:00')) / DAY);

/* ---------- stato ---------- */
const DEFAULT = { xp: 0, daily: {}, streak: { count: 0, last: null }, units: {}, cards: {}, mistakes: {}, settings: { dark: null, rate: 0.85, listen: 'auto' } };
let S;
function load() {
  try { S = Object.assign(JSON.parse(JSON.stringify(DEFAULT)), JSON.parse(localStorage.getItem(KEY) || '{}')); }
  catch (e) { S = JSON.parse(JSON.stringify(DEFAULT)); }
  S.settings = Object.assign({}, DEFAULT.settings, S.settings);
}
function save() { try { localStorage.setItem(KEY, JSON.stringify(S)); } catch (e) {} }
function streakAlive() { return S.streak.last && dayDiff(S.streak.last, today()) <= 1 ? S.streak.count : 0; }
function addXP(n) {
  if (n <= 0) return;
  const t = today();
  S.xp += n; S.daily[t] = (S.daily[t] || 0) + n;
  if (S.streak.last !== t) {
    S.streak.count = (S.streak.last && dayDiff(S.streak.last, t) === 1) ? S.streak.count + 1 : 1;
    S.streak.last = t;
  }
  save(); updateTopbar();
}

/* ---------- vocabolario e SRS (Leitner) ---------- */
const ITEMS = [];
COURSE.forEach((u, ui) => u.vocab.forEach((v, i) => ITEMS.push(Object.assign({ key: u.id + ':' + i, unit: u.id, ui }, v))));
const byKey = k => ITEMS.find(x => x.key === k);
function grade(key, ok, mode) {
  const now = Date.now();
  let c = S.cards[key];
  if (!c) { c = S.cards[key] = { box: 1, due: now }; if (ok) c.due = now + BOX_DAYS[0] * DAY; save(); return; }
  if (mode === 'hard') { c.due = now + DAY; }
  else if (ok) { c.box = Math.min(5, c.box + 1); c.due = now + BOX_DAYS[c.box - 1] * DAY; }
  else { c.box = 1; c.due = now; }
  save();
}
function noteMistake(key, ok) {
  if (!key) return;
  if (ok) delete S.mistakes[key];
  else S.mistakes[key] = (S.mistakes[key] || 0) + 1;
  save();
}
function dueKeys() {
  const now = Date.now();
  const set = new Set(Object.keys(S.cards).filter(k => S.cards[k].due <= now));
  Object.keys(S.mistakes).forEach(k => set.add(k));
  return Array.from(set).filter(byKey);
}

/* ---------- confronto risposte ---------- */
const norm = s => String(s).toLowerCase().replace(/[.,!?¿¡…;:"“”„'’()\-–—\/]/g, ' ').replace(/\s+/g, ' ').trim();
const strip = s => norm(s).normalize('NFD').replace(/[\u0300-\u036f]/g, '');
function lev(a, b) {
  const m = a.length, n = b.length; if (!m) return n; if (!n) return m;
  let prev = Array.from({ length: n + 1 }, (_, j) => j);
  for (let i = 1; i <= m; i++) { const cur = [i]; for (let j = 1; j <= n; j++) cur[j] = Math.min(prev[j] + 1, cur[j - 1] + 1, prev[j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1)); prev = cur; }
  return prev[n];
}
function checkTyped(input, answers) {
  const n = norm(input); if (!n) return { ok: false };
  if (answers.some(a => norm(a) === n)) return { ok: true };
  const s = strip(input);
  const hit = answers.find(a => strip(a) === s);
  if (hit) return { ok: true, note: 'accenti', right: hit };
  const close = answers.find(a => strip(a).length >= 5 && lev(strip(a), s) <= 1);
  if (close) return { ok: true, note: 'typo', right: close };
  return { ok: false };
}
window.__checkTyped = checkTyped;

/* ---------- voce (Web Speech API) ---------- */
let skVoice = null;
const speechOK = 'speechSynthesis' in window && 'SpeechSynthesisUtterance' in window;
function findVoice() {
  if (!speechOK) return null;
  const vs = speechSynthesis.getVoices() || [];
  skVoice = vs.find(v => /^sk([-_]|$)/i.test(v.lang)) || null;
  return skVoice;
}
if (speechOK) { findVoice(); speechSynthesis.addEventListener && speechSynthesis.addEventListener('voiceschanged', () => { findVoice(); if (location.hash.startsWith('#/settings')) render(); }); }
const listenEnabled = () => S.settings.listen === 'on' || (S.settings.listen === 'auto' && !!skVoice);
let warnedVoice = false;
function speak(text, btn) {
  if (!speechOK) { toast('🔇 Il tuo browser non supporta la sintesi vocale.'); return; }
  findVoice();
  if (!skVoice && !warnedVoice) { warnedVoice = true; toast('🔈 Nessuna voce slovacca installata: provo comunque. Su Chrome/Android o Safari/iOS di solito c\'è; su Windows si aggiunge in Impostazioni › Lingua.', 6000); }
  speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(String(text).replace(/…/g, ''));
  u.lang = 'sk-SK'; try { if (skVoice) u.voice = skVoice; } catch (e) {} u.rate = S.settings.rate || 0.85;
  if (btn) { btn.classList.add('playing'); u.onend = u.onerror = () => btn.classList.remove('playing'); }
  speechSynthesis.speak(u);
}
const autoSpeak = t => { if (skVoice) setTimeout(() => speak(t), 200); };
const spk = (text, cls = '') => `<button class="spk ${cls}" data-say="${esc(text)}" aria-label="Ascolta" title="Ascolta">🔊</button>`;

/* ---------- UI di base ---------- */
const view = () => $('#view');
function toast(msg, ms = 2600) {
  const t = document.createElement('div'); t.className = 'toast'; t.innerHTML = msg;
  $('#toasts').appendChild(t); setTimeout(() => t.classList.add('out'), ms); setTimeout(() => t.remove(), ms + 400);
}
function updateTopbar() {
  $('#tb-streak').textContent = streakAlive();
  $('#tb-xp').textContent = S.xp;
  const d = Math.min(100, Math.round(((S.daily[today()] || 0) / DAILY_GOAL) * 100));
  $('#tb-goal').style.setProperty('--p', d);
  $('#tb-goal').title = `Obiettivo di oggi: ${S.daily[today()] || 0}/${DAILY_GOAL} XP`;
}
function applyTheme() {
  const dark = S.settings.dark === null ? window.matchMedia('(prefers-color-scheme: dark)').matches : S.settings.dark;
  document.documentElement.dataset.theme = dark ? 'dark' : 'light';
}
const stars = n => '<span class="stars" aria-label="' + n + ' stelle su 3">' + [1, 2, 3].map(i => `<span class="${i <= n ? 'on' : ''}">★</span>`).join('') + '</span>';
function unitProgress(u) {
  const keys = u.vocab.map((_, i) => u.id + ':' + i);
  const learned = keys.filter(k => S.cards[k] && S.cards[k].box >= 2).length;
  return { learned, total: keys.length, pct: Math.round(learned / keys.length * 100), stars: (S.units[u.id] || {}).stars || 0 };
}
function nextUnit() { return COURSE.find(u => !((S.units[u.id] || {}).stars)) || COURSE[0]; }

/* ---------- router ---------- */
let session = null;
function render() {
  const h = location.hash.replace(/^#\/?/, '');
  const [r, a, b] = h.split('/');
  $$('.nav a').forEach(x => x.classList.toggle('active', x.dataset.r === (r || 'home') || (r === 'unit' && x.dataset.r === 'course') || (r === 'practice' && x.dataset.r === 'course') || (r === 'cards' && x.dataset.r === 'review')));
  session = null;
  window.scrollTo(0, 0);
  if (!r || r === 'home') return home();
  if (r === 'course') return course();
  if (r === 'unit') return unit(a, b || 'parole');
  if (r === 'practice') return startPractice(a);
  if (r === 'review') return startReview();
  if (r === 'cards') return cards(a || 'all');
  if (r === 'alphabet') return alphabet();
  if (r === 'settings') return settings();
  home();
}

/* ---------- Home / dashboard ---------- */
function home() {
  const nu = nextUnit(), due = dueKeys().length, st = streakAlive();
  const done = COURSE.filter(u => (S.units[u.id] || {}).stars).length;
  const todayXP = S.daily[today()] || 0;
  const words = Object.values(S.cards).filter(c => c.box >= 2).length;
  const hour = new Date().getHours();
  const greet = hour < 10 ? 'Dobré ráno!' : hour < 18 ? 'Dobrý deň!' : 'Dobrý večer!';
  const last7 = Array.from({ length: 7 }, (_, i) => { const d = new Date(Date.now() - (6 - i) * DAY); const k = dkey(d); return { k, xp: S.daily[k] || 0, l: 'DLMMGVS'[d.getDay()] }; });
  const max = Math.max(DAILY_GOAL, ...last7.map(x => x.xp));
  view().innerHTML = `
  <section class="hero">
    <div class="hero-text">
      <h1>${greet} <span class="wave">👋</span></h1>
      <p>Benvenuto/a in <b>Ahoj!</b>, il tuo insegnante di slovacco. Lezioni brevi, ripasso intelligente e tanta pratica, tutto spiegato in italiano.</p>
      <div class="hero-actions">
        <a class="btn primary big" id="continue" href="#/unit/${nu.id}">${done ? 'Continua' : 'Inizia'}: ${esc(nu.title)} →</a>
      </div>
    </div>
    <div class="hero-flags" aria-hidden="true"><span>🇸🇰</span><span>🇮🇹</span></div>
  </section>
  <section class="stats">
    <div class="stat"><div class="stat-ico">🔥</div><div><b id="st-streak">${st}</b><span>giorni di fila</span></div></div>
    <div class="stat"><div class="stat-ico">⭐</div><div><b id="st-xp">${S.xp}</b><span>XP totali</span></div></div>
    <div class="stat"><div class="stat-ico">📚</div><div><b>${words}</b><span>parole imparate</span></div></div>
    <div class="stat"><div class="stat-ico">🏅</div><div><b>${done}/${COURSE.length}</b><span>unità completate</span></div></div>
  </section>
  <section class="grid2">
    <div class="card">
      <h3>🎯 Obiettivo di oggi</h3>
      <div class="goalbar"><div style="width:${Math.min(100, todayXP / DAILY_GOAL * 100)}%"></div></div>
      <p class="muted">${todayXP} / ${DAILY_GOAL} XP ${todayXP >= DAILY_GOAL ? '· Obiettivo raggiunto! Výborne! 🎉' : ''}</p>
      <div class="week">${last7.map(d => `<div class="day ${d.k === today() ? 'today' : ''}"><div class="bar"><i style="height:${Math.round(d.xp / max * 100)}%"></i></div><small>${d.l}</small></div>`).join('')}</div>
    </div>
    <div class="card review-card">
      <h3>🔁 Ripasso</h3>
      <p>${due ? `Hai <b id="due-count">${due}</b> ${due === 1 ? 'parola' : 'parole'} da ripassare (ripetizione dilazionata + errori recenti).` : 'Niente da ripassare per ora. Fai una lezione: le parole entreranno nel ripasso al momento giusto.'}</p>
      <div class="row">
        <a class="btn ${due ? 'primary' : ''}" href="#/review">Ripasso rapido</a>
        <a class="btn" href="#/cards/all">🃏 Flashcard</a>
      </div>
    </div>
  </section>
  <h2 class="section-title">Il corso · livello A1</h2>
  ${unitGrid()}
  <a class="card alpha-cta" href="#/alphabet"><span class="big-letter">Č Š Ž</span><span><b>Alfabeto e pronuncia</b><br><span class="muted">Tocca le lettere e ascolta come suonano.</span></span></a>`;
}
function unitGrid() {
  return `<div class="units">${COURSE.map((u, i) => { const p = unitProgress(u); return `
    <a class="unit-tile ${p.stars ? 'done' : ''}" href="#/unit/${u.id}" data-unit="${u.id}">
      <div class="ut-top"><span class="ut-emoji">${u.emoji}</span><span class="ut-num">${i + 1}</span></div>
      <b>${esc(u.title)}</b><small class="muted">${esc(u.sk)}</small>
      <div class="ut-bottom"><div class="mini"><div style="width:${p.pct}%"></div></div>${stars(p.stars)}</div>
    </a>`; }).join('')}</div>`;
}
function course() {
  view().innerHTML = `<h1>Il corso</h1><p class="muted">12 unità per arrivare al livello A1 del Quadro europeo (QCER). Puoi farle in qualsiasi ordine, ma ti consigliamo di seguirle. Ogni unità: parole, grammatica, dialogo, esercizi e flashcard.</p>${unitGrid()}`;
}

/* ---------- Unità ---------- */
function unit(id, tab) {
  const u = COURSE.find(x => x.id === id); if (!u) return home();
  const idx = COURSE.indexOf(u), p = unitProgress(u);
  const tabs = [['parole', '📖 Parole'], ['grammatica', '🧠 Grammatica'], ['dialogo', '💬 Dialogo']];
  let body = '';
  if (tab === 'grammatica') body = `<div class="card prose">${u.grammar}</div>`;
  else if (tab === 'dialogo') body = `<div class="card dialogue">
      <div class="row between"><h3>Dialogo</h3><button class="btn small" id="playall">▶︎ Ascolta tutto</button></div>
      ${u.dialogue.map((l, i) => `<div class="line ${i % 2 ? 'right' : ''}"><div class="who">${esc(l.who)}</div><div class="bubble">${spk(l.sk, 'sm')}<span class="sk">${esc(l.sk)}</span><span class="it">${esc(l.it)}</span></div></div>`).join('')}
      <label class="toggle"><input type="checkbox" id="hideit"> Nascondi la traduzione</label></div>`;
  else body = `<div class="card"><table class="vocab"><thead><tr><th></th><th>Slovacco</th><th>Italiano</th><th>Pronuncia</th></tr></thead><tbody>
      ${u.vocab.map(v => `<tr><td>${spk(v.sk, 'sm')}</td><td class="sk">${esc(v.sk)}${v.alt ? `<small class="muted"> (anche: ${esc(v.alt.join(', '))})</small>` : ''}${v.note ? `<div class="note">${esc(v.note)}</div>` : ''}</td><td>${esc(v.it)}</td><td class="pr">${esc(v.pr)}</td></tr>`).join('')}
      </tbody></table><p class="legend muted">MAIUSCOLO = sillaba accentata · aa/ii/uu = vocale lunga · ts = c · kh = ch · gn = ň · tj/dj = ť/ď</p></div>`;
  view().innerHTML = `
  <a class="back" href="#/course">← Tutte le unità</a>
  <header class="unit-head"><span class="ut-emoji big">${u.emoji}</span><div><small class="muted">Unità ${idx + 1} · ${esc(u.sk)}</small><h1>${esc(u.title)}</h1><p class="muted">${esc(u.desc)}</p><div class="row">${stars(p.stars)}<span class="muted small">${p.learned}/${p.total} parole imparate</span></div></div></header>
  <nav class="tabs">${tabs.map(([k, l]) => `<a href="#/unit/${u.id}/${k}" class="${tab === k ? 'active' : ''}">${l}</a>`).join('')}</nav>
  ${body}
  <div class="cta-bar">
    <a class="btn" href="#/cards/${u.id}">🃏 Flashcard</a>
    <a class="btn primary" id="start-ex" href="#/practice/${u.id}">✏️ Esercizi</a>
    ${idx < COURSE.length - 1 ? `<a class="btn ghost" href="#/unit/${COURSE[idx + 1].id}">Unità ${idx + 2} →</a>` : ''}
  </div>`;
  const pa = $('#playall');
  if (pa) pa.onclick = () => speak(u.dialogue.map(l => l.sk).join(' … '), pa);
  const hi = $('#hideit'); if (hi) hi.onchange = () => $('.dialogue').classList.toggle('hide-it', hi.checked);
}

/* ---------- Esercizi ---------- */
function distractors(item, field, n, pool) {
  const vals = new Set([item[field]]);
  const src = shuffle((pool || []).filter(x => x.key !== item.key)).concat(shuffle(ITEMS));
  const out = [];
  for (const x of src) { if (out.length >= n) break; if (!vals.has(x[field])) { vals.add(x[field]); out.push(x[field]); } }
  return out;
}
function makeQ(type, item, u) {
  const pool = u ? ITEMS.filter(x => x.unit === u.id) : null;
  if (type === 'mc-sk') return { type, item, prompt: item.sk, answer: item.it, options: shuffle([item.it, ...distractors(item, 'it', 3, pool)]) };
  if (type === 'mc-it') return { type, item, prompt: item.it, answer: item.sk, options: shuffle([item.sk, ...distractors(item, 'sk', 3, pool)]) };
  if (type === 'listen') return { type, item, answer: item.it, options: shuffle([item.it, ...distractors(item, 'it', 3, pool)]) };
  return { type: 'type', item, prompt: item.it, answers: [item.sk, ...(item.alt || [])] };
}
function buildSession(u) {
  const items = ITEMS.filter(x => x.unit === u.id);
  const short = items.filter(x => x.sk.replace(/…/g, '').trim().split(/\s+/).length <= 3);
  const listen = listenEnabled();
  const a = shuffle(items); let k = 0; const nxt = () => a[k++ % a.length];
  const ty = pick(short.length >= 2 ? short : items, 2);
  const sents = pick(u.sentences, 2);
  return [
    makeQ('mc-sk', nxt(), u), makeQ('mc-sk', nxt(), u), makeQ('mc-it', nxt(), u),
    { type: 'match', pairs: pick(items, 5) },
    makeQ('mc-it', nxt(), u),
    makeQ(listen ? 'listen' : 'mc-sk', nxt(), u),
    makeQ('type', ty[0], u),
    { type: 'build', sent: sents[0] },
    makeQ(listen ? 'listen' : 'mc-it', nxt(), u),
    makeQ('type', ty[1], u),
    { type: 'build', sent: sents[1] },
    makeQ('mc-sk', nxt(), u)
  ];
}
function startPractice(id) {
  const u = COURSE.find(x => x.id === id); if (!u) return home();
  session = { kind: 'unit', u, qs: buildSession(u), i: 0, correct: 0, xp: 0, wrong: [] };
  renderQ();
}
function startReview() {
  const keys = shuffle(dueKeys()).slice(0, 12);
  if (!keys.length) {
    view().innerHTML = `<div class="card center empty"><div class="big-emoji">🎉</div><h2>Niente da ripassare!</h2><p class="muted">Le parole tornano qui quando è il momento giusto per ripassarle (ripetizione dilazionata) o quando sbagli una risposta.</p>
    <div class="row center"><a class="btn primary" href="#/unit/${nextUnit().id}">Fai una lezione</a><a class="btn" href="#/cards/all">🃏 Flashcard</a></div></div>`;
    return;
  }
  const types = ['mc-sk', 'type', 'mc-it'].concat(listenEnabled() ? ['listen'] : []);
  const qs = keys.map((k, i) => { const it = byKey(k); let t = types[i % types.length]; if (t === 'type' && it.sk.split(' ').length > 4) t = 'mc-it'; return makeQ(t, it, COURSE[it.ui]); });
  session = { kind: 'review', qs, i: 0, correct: 0, xp: 0, wrong: [] };
  renderQ();
}
const TYPE_LABEL = { 'mc-sk': 'Che cosa significa?', 'mc-it': 'Come si dice in slovacco?', 'listen': 'Ascolta e scegli il significato', 'type': 'Scrivi in slovacco', 'match': 'Abbina le coppie', 'build': 'Componi la frase in slovacco' };
function renderQ() {
  const s = session; if (!s) return;
  if (s.i >= s.qs.length) return finish();
  const q = s.qs[s.i];
  const exit = s.kind === 'unit' ? '#/unit/' + s.u.id : '#/';
  let html = `<div class="qtop"><a class="x" href="${exit}" title="Esci" aria-label="Esci">✕</a><div class="progress"><div style="width:${Math.round(s.i / s.qs.length * 100)}%"></div></div><span class="muted small">${s.i + 1}/${s.qs.length}</span></div>
    <div class="qcard card" data-type="${q.type}"><h2 class="qlabel">${TYPE_LABEL[q.type]}</h2>`;
  if (q.type === 'mc-sk' || q.type === 'mc-it' || q.type === 'listen') {
    if (q.type === 'mc-sk') html += `<div class="prompt sk">${spk(q.prompt)} ${esc(q.prompt)}</div>`;
    else if (q.type === 'mc-it') html += `<div class="prompt">${esc(q.prompt)}</div>`;
    else html += `<div class="prompt"><button class="spk huge" data-say="${esc(q.item.sk)}" id="listen-btn" aria-label="Ascolta">🔊</button><div class="row center"><button class="btn small ghost" id="slow">🐢 Più lento</button><button class="btn small ghost" id="reveal">Mostra il testo</button></div><div class="revealed sk" hidden>${esc(q.item.sk)}</div></div>`;
    html += `<div class="options">${q.options.map((o, i) => `<button class="opt ${q.type === 'mc-it' ? 'sk' : ''}" data-v="${esc(o)}"><kbd>${i + 1}</kbd><span>${esc(o)}</span></button>`).join('')}</div>`;
  } else if (q.type === 'type') {
    html += `<div class="prompt">${esc(q.prompt)}</div>
      <input id="answer" class="answer sk" autocomplete="off" autocapitalize="off" autocorrect="off" spellcheck="false" lang="sk" placeholder="Scrivi qui in slovacco…">
      <div class="diacritics" aria-label="Lettere speciali">${'á ä č ď é í ĺ ľ ň ó ô ŕ š ť ú ý ž'.split(' ').map(c => `<button class="dia" data-c="${c}" tabindex="-1">${c}</button>`).join('')}</div>
      <div class="row"><button class="btn primary" id="check">Controlla</button><button class="btn ghost" id="dontknow">Non lo so</button></div>`;
  } else if (q.type === 'match') {
    q.left = q.left || shuffle(q.pairs); q.right = q.right || shuffle(q.pairs); q.errors = 0; q.done = 0;
    html += `<p class="muted small">Tocca una parola slovacca e poi il suo significato.</p><div class="match"><div class="col">${q.left.map(p => `<button class="mt sk" data-k="${p.key}" data-side="l">${esc(p.sk)}</button>`).join('')}</div><div class="col">${q.right.map(p => `<button class="mt" data-k="${p.key}" data-side="r">${esc(p.it)}</button>`).join('')}</div></div>`;
  } else if (q.type === 'build') {
    const words = q.sent.sk.replace(/[.,!?…]/g, '').split(/\s+/).filter(Boolean);
    q.tiles = q.tiles || shuffle(words.concat(distractWords(words))).map((w, i) => ({ w, i }));
    html += `<div class="prompt">${esc(q.sent.it)}</div><div class="built" id="built" aria-label="La tua frase"></div><div class="tiles" id="tiles">${q.tiles.map(t => `<button class="tile sk" data-i="${t.i}">${esc(t.w)}</button>`).join('')}</div>
      <div class="row"><button class="btn primary" id="check">Controlla</button><button class="btn ghost" id="clear">Cancella</button></div>`;
  }
  html += `</div><div id="feedback" class="feedback" hidden></div>`;
  view().innerHTML = html;
  bindQ(q);
}
function distractWords(words) {
  const lower = new Set(words.map(w => w.toLowerCase()));
  const pool = shuffle(COURSE.flatMap(x => x.sentences).flatMap(s => s.sk.replace(/[.,!?…]/g, '').split(/\s+/))).filter(w => !lower.has(w.toLowerCase()));
  return Array.from(new Set(pool)).slice(0, 2);
}
function bindQ(q) {
  if (q.type === 'mc-sk' || q.type === 'mc-it' || q.type === 'listen') {
    $$('.opt').forEach(b => b.onclick = () => {
      if (session.locked) return;
      const ok = b.dataset.v === q.answer;
      $$('.opt').forEach(x => { x.disabled = true; if (x.dataset.v === q.answer) x.classList.add('right'); });
      if (!ok) b.classList.add('wrong');
      answer(ok, q, ok ? null : `Risposta giusta: <b>${esc(q.answer)}</b>`);
    });
    if (q.type === 'listen') {
      setTimeout(() => speak(q.item.sk, $('#listen-btn')), 250);
      $('#slow').onclick = () => { const r = S.settings.rate; S.settings.rate = 0.55; speak(q.item.sk); S.settings.rate = r; };
      $('#reveal').onclick = e => { $('.revealed').hidden = false; e.currentTarget.remove(); };
    }
    if (q.type === 'mc-sk') autoSpeak(q.prompt);
  } else if (q.type === 'type') {
    const inp = $('#answer'); inp.focus();
    $$('.dia').forEach(b => b.onmousedown = e => e.preventDefault());
    $$('.dia').forEach(b => b.onclick = () => { if (inp.disabled) return; const s = inp.selectionStart ?? inp.value.length, e = inp.selectionEnd ?? s; inp.value = inp.value.slice(0, s) + b.dataset.c + inp.value.slice(e); inp.focus(); inp.setSelectionRange(s + 1, s + 1); });
    const go = () => {
      if (session.locked) return;
      if (!inp.value.trim()) { inp.classList.add('shake'); setTimeout(() => inp.classList.remove('shake'), 400); return; }
      const r = checkTyped(inp.value, q.answers);
      inp.disabled = true; inp.classList.add(r.ok ? (r.note === 'accenti' ? 'warn' : 'right') : 'wrong');
      let msg = null;
      if (r.ok && r.note === 'accenti') msg = `⚠️ <b>Attenzione agli accenti!</b> Si scrive: <b class="sk">${esc(r.right)}</b>`;
      else if (r.ok && r.note === 'typo') msg = `Quasi perfetto, c'è un piccolo errore di battitura. Si scrive: <b class="sk">${esc(r.right)}</b>`;
      else if (!r.ok) msg = `Hai scritto: <s>${esc(inp.value)}</s><br>Risposta giusta: <b class="sk">${esc(q.answers[0])}</b>${q.answers.length > 1 ? ` <small>(anche: ${esc(q.answers.slice(1).join(', '))})</small>` : ''}`;
      answer(r.ok, q, msg, r.note);
    };
    $('#check').onclick = go;
    inp.onkeydown = e => { if (e.key === 'Enter') { e.preventDefault(); e.stopPropagation(); go(); } };
    $('#dontknow').onclick = () => { if (session.locked) return; inp.disabled = true; inp.classList.add('wrong'); answer(false, q, `Risposta giusta: <b class="sk">${esc(q.answers[0])}</b>`); };
  } else if (q.type === 'match') {
    let sel = null;
    $$('.mt').forEach(b => b.onclick = () => {
      if (b.classList.contains('ok') || session.locked) return;
      if (b.dataset.side === 'l' && skVoice) speak(b.textContent);
      if (!sel || sel.dataset.side === b.dataset.side) { $$('.mt.sel').forEach(x => x.classList.remove('sel')); sel = b; b.classList.add('sel'); return; }
      if (sel.dataset.k === b.dataset.k) {
        [sel, b].forEach(x => { x.classList.remove('sel'); x.classList.add('ok'); x.disabled = true; });
        q.done++; sel = null;
        if (q.done === q.pairs.length) {
          const ok = q.errors <= 1;
          answer(ok, q, ok ? (q.errors ? 'Bene, solo un errore!' : 'Tutte giuste al primo colpo!') : `Hai fatto ${q.errors} errori: queste parole tornano nel ripasso.`);
        }
      } else {
        q.errors++; const a = sel, c = b; [a, c].forEach(x => { x.classList.remove('sel'); x.classList.add('bad'); }); sel = null;
        setTimeout(() => [a, c].forEach(x => x.classList.remove('bad')), 500);
      }
    });
  } else if (q.type === 'build') {
    const built = $('#built'), tiles = $('#tiles');
    tiles.onclick = e => { const t = e.target.closest('.tile'); if (!t || session.locked) return; built.appendChild(t); };
    built.onclick = e => { const t = e.target.closest('.tile'); if (!t || session.locked) return; tiles.appendChild(t); };
    $('#clear').onclick = () => { if (!session.locked) $$('.tile', built).forEach(t => tiles.appendChild(t)); };
    $('#check').onclick = () => {
      if (session.locked) return;
      const got = $$('.tile', built).map(t => t.textContent).join(' ');
      if (!got) { built.classList.add('shake'); setTimeout(() => built.classList.remove('shake'), 400); return; }
      const ok = norm(got) === norm(q.sent.sk);
      built.classList.add(ok ? 'right' : 'wrong');
      answer(ok, q, `${ok ? '' : 'Frase giusta: '}<b class="sk">${esc(q.sent.sk)}</b> ${spk(q.sent.sk, 'sm')}<br><span class="muted">${esc(q.sent.it)}</span>`);
      autoSpeak(q.sent.sk);
    };
  }
}
function answer(ok, q, msg, note) {
  const s = session; s.locked = true;
  if (ok) { s.correct++; s.xp += 10; } else s.wrong.push(q);
  if (q.type === 'match') q.pairs.forEach(p => { grade(p.key, ok); noteMistake(p.key, ok); });
  else if (q.item) { grade(q.item.key, ok); noteMistake(q.item.key, ok); }
  const fb = $('#feedback');
  const praise = ['Výborne!', 'Správne!', 'Super!', 'Skvelé!', 'Bravo!'];
  const it = q.item;
  fb.className = 'feedback ' + (ok ? (note === 'accenti' ? 'warn' : 'ok') : 'ko');
  fb.innerHTML = `<div class="fb-inner"><div class="fb-text"><div class="fb-title">${ok ? (note === 'accenti' ? '👍 Giusto, ma…' : '✅ ' + praise[Math.floor(Math.random() * praise.length)]) : '❌ Non proprio'}</div>
    ${msg ? `<div class="fb-msg">${msg}</div>` : ''}
    ${it ? `<div class="fb-extra">${spk(it.sk, 'sm')}<span class="sk">${esc(it.sk)}</span> = ${esc(it.it)} <span class="pr">[${esc(it.pr)}]</span></div>` : ''}</div>
    <button class="btn ${ok ? 'primary' : 'danger'}" id="next">Continua →</button></div>`;
  fb.hidden = false;
  const nb = $('#next'); nb.focus({ preventScroll: true });
  nb.onclick = () => { s.locked = false; s.i++; renderQ(); };
}
function finish() {
  const s = session, total = s.qs.length, pct = s.correct / total;
  const st = pct >= 0.9 ? 3 : pct >= 0.75 ? 2 : pct >= 0.5 ? 1 : 0;
  let bonus;
  if (s.kind === 'unit') {
    const rec = S.units[s.u.id] = S.units[s.u.id] || { stars: 0, best: 0, runs: 0 };
    rec.runs++; rec.best = Math.max(rec.best, Math.round(pct * 100)); rec.stars = Math.max(rec.stars, st);
    bonus = st ? 20 : 5;
  } else bonus = 10;
  addXP(s.xp + bonus);
  const nextU = s.kind === 'unit' ? COURSE[COURSE.indexOf(s.u) + 1] : null;
  view().innerHTML = `<div class="card center result">
    <div class="big-emoji">${st === 3 ? '🏆' : st === 2 ? '🎉' : st === 1 ? '👍' : '💪'}</div>
    <h2>${st === 3 ? 'Perfetto! Výborne!' : st >= 1 ? 'Dobrá práca! Ottimo lavoro!' : 'Non mollare! Skús to znova!'}</h2>
    ${s.kind === 'unit' ? `<div class="result-stars">${stars(st)}</div>` : ''}
    <p><b id="score">${s.correct}/${total}</b> risposte giuste · <b class="xp">+${s.xp + bonus} XP</b></p>
    ${s.wrong.length ? `<div class="wronglist"><h4>Da ripassare</h4>${Array.from(new Set(s.wrong.flatMap(q => q.item ? [[q.item.sk, q.item.it]] : q.sent ? [[q.sent.sk, q.sent.it]] : q.pairs.map(p => [p.sk, p.it])).map(x => `<div><span class="sk">${esc(x[0])}</span> = ${esc(x[1])}</div>`))).join('')}</div>` : ''}
    <div class="row center">
      <a class="btn" href="#" id="again">${s.kind === 'unit' ? '🔄 Ripeti' : '🔁 Ancora'}</a>
      ${nextU ? `<a class="btn primary" href="#/unit/${nextU.id}">Unità successiva →</a>` : `<a class="btn primary" href="#/">🏠 Home</a>`}
    </div></div>`;
  if (st === 3) confetti();
  $('#again').onclick = e => { e.preventDefault(); if (s.kind === 'unit') startPractice(s.u.id); else startReview(); };
  session = null;
}
function confetti() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const c = document.createElement('div'); c.className = 'confetti';
  for (let i = 0; i < 40; i++) { const p = document.createElement('i'); p.style.left = Math.random() * 100 + '%'; p.style.background = ['#0b4ea2', '#ee1c25', '#009246', '#ffd23f', '#ffffff'][i % 5]; p.style.animationDelay = Math.random() * 0.6 + 's'; c.appendChild(p); }
  document.body.appendChild(c); setTimeout(() => c.remove(), 2600);
}

/* ---------- Flashcard ---------- */
function cards(id) {
  const now = Date.now();
  const u = COURSE.find(x => x.id === id);
  const list = u ? ITEMS.filter(x => x.unit === u.id) : ITEMS.filter(x => S.cards[x.key]);
  if (!list.length) {
    view().innerHTML = `<div class="card center empty"><div class="big-emoji">🃏</div><h2>Ancora nessuna flashcard</h2><p class="muted">Apri un'unità e premi "Flashcard" per iniziare: le carte che studi entrano nel ripasso.</p><a class="btn primary" href="#/cards/${nextUnit().id}">Inizia con: ${esc(nextUnit().title)}</a></div>`; return;
  }
  let queue = list.filter(x => !S.cards[x.key] || S.cards[x.key].due <= now);
  const extra = !queue.length;
  if (extra) queue = shuffle(list).slice(0, 15);
  const st = { queue: u ? queue : shuffle(queue), i: 0, flipped: false, reverse: false, seen: 0 };
  const back = u ? '#/unit/' + u.id : '#/';
  const draw = () => {
    if (st.i >= st.queue.length) {
      view().innerHTML = `<div class="card center empty"><div class="big-emoji">✅</div><h2>Mazzo finito!</h2><p>Hai ripassato <b>${st.seen}</b> carte. Le rivedrai quando sarà il momento giusto.</p><div class="row center"><a class="btn" href="${back}">Indietro</a><a class="btn primary" href="${u ? '#/practice/' + u.id : '#/review'}">✏️ Esercizi</a></div></div>`;
      return;
    }
    const it = st.queue[st.i], c = S.cards[it.key];
    const front = st.reverse ? `<div class="fc-it">${esc(it.it)}</div>` : `<div class="fc-sk sk">${esc(it.sk)}</div>${spk(it.sk)}`;
    view().innerHTML = `
      <div class="qtop"><a class="x" href="${back}" aria-label="Esci">✕</a><div class="progress"><div style="width:${st.i / st.queue.length * 100}%"></div></div><span class="muted small">${st.i + 1}/${st.queue.length}</span></div>
      ${extra ? '<p class="muted center small">Hai già ripassato tutte le carte in scadenza: ecco un giro extra.</p>' : ''}
      <div class="row between"><span class="muted small">${u ? esc(u.title) : 'Tutte le unità'} · ${c ? 'scatola ' + c.box + '/5' : 'carta nuova'}</span><label class="toggle small"><input type="checkbox" id="rev" ${st.reverse ? 'checked' : ''}> Italiano → Slovacco</label></div>
      <div class="flashcard ${st.flipped ? 'flipped' : ''}" id="fc" tabindex="0" role="button" aria-label="Gira la carta">
        <div class="fc-face front">${front}<small class="muted">Tocca per girare</small></div>
        <div class="fc-face back"><div class="fc-sk sk">${esc(it.sk)}</div>${spk(it.sk)}<div class="fc-it">${esc(it.it)}</div><div class="pr">[${esc(it.pr)}]</div>${it.note ? `<div class="note">${esc(it.note)}</div>` : ''}</div>
      </div>
      <div class="fc-actions" ${st.flipped ? '' : 'hidden'}>
        <button class="btn danger" data-g="again">😕 Non lo sapevo</button>
        <button class="btn warn" data-g="hard">🤔 Difficile</button>
        <button class="btn success" data-g="good">😀 Lo sapevo</button>
      </div>
      <p class="muted small center">Leitner: "Lo sapevo" sposta la carta alla scatola successiva (ripasso tra 1, 2, 4, 8, 16 giorni); "Non lo sapevo" la riporta alla scatola 1.</p>`;
    const fc = $('#fc');
    fc.onclick = e => { if (e.target.closest('.spk')) return; st.flipped = !st.flipped; fc.classList.toggle('flipped', st.flipped); $('.fc-actions').hidden = !st.flipped; if (st.flipped && st.reverse) autoSpeak(it.sk); };
    fc.onkeydown = e => { if (e.key === ' ' || e.key === 'Enter') { e.preventDefault(); fc.click(); } };
    $('#rev').onchange = e => { st.reverse = e.target.checked; st.flipped = false; draw(); };
    $$('.fc-actions .btn').forEach(b => b.onclick = () => {
      const g = b.dataset.g; grade(it.key, g !== 'again', g); noteMistake(it.key, g !== 'again');
      if (g === 'again') st.queue.push(it);
      st.seen++; addXP(g === 'again' ? 1 : 3);
      st.i++; st.flipped = false; draw();
    });
    if (!st.reverse) autoSpeak(it.sk);
  };
  draw();
}

/* ---------- Alfabeto ---------- */
function alphabet() {
  view().innerHTML = `
  <h1>Alfabeto e pronuncia</h1>
  <p class="muted">Lo slovacco ha <b>46 lettere</b>. Tocca una lettera per sentire una parola d'esempio. In <span class="tag special">blu</span> le lettere che in italiano non esistono o si leggono diversamente.</p>
  ${speechOK ? '' : '<div class="notice">🔇 Il tuo browser non supporta la sintesi vocale: vedrai comunque i consigli di pronuncia.</div>'}
  <div class="card letter-info" id="linfo" aria-live="polite"><p class="muted">👆 Scegli una lettera</p></div>
  <div class="alpha">${ALPHABET.map((a, i) => { const cls = /[qwx]/.test(a[1]) ? 'foreign' : (/[áäčďéíĺľňóôŕšťúýž]|dz|dž|ch|^[chjyz]$/.test(a[1]) ? 'special' : ''); return `<button class="letter ${cls}" data-i="${i}"><b>${a[0]}${a[0].length === 1 ? '<i>' + a[1] + '</i>' : ''}</b><small>${esc(a[2])}</small></button>`; }).join('')}</div>
  <div class="card prose">${COURSE[0].grammar}</div>
  <div class="cta-bar"><a class="btn primary" href="#/unit/alfabeto">Vai all'unità 1 →</a></div>`;
  $$('.letter').forEach(b => b.onclick = () => {
    const a = ALPHABET[+b.dataset.i];
    $$('.letter.sel').forEach(x => x.classList.remove('sel')); b.classList.add('sel');
    $('#linfo').innerHTML = `<div class="li-big">${a[0]}${a[0].length === 1 ? ' ' + a[1] : ''}</div><div><div class="li-tip">${esc(a[4])}</div><div>Esempio: ${spk(a[2], 'sm')} <b class="sk">${esc(a[2])}</b> = ${esc(a[3])}</div></div>`;
    speak(a[2]);
  });
}

/* ---------- Impostazioni ---------- */
function settings() {
  findVoice();
  const vs = speechOK ? speechSynthesis.getVoices() : [];
  view().innerHTML = `<h1>Impostazioni</h1>
  <div class="card">
    <h3>🔊 Audio</h3>
    <p id="voice-status">${!speechOK ? '🔇 Questo browser non supporta la sintesi vocale.' : skVoice ? `✅ Voce slovacca trovata: <b>${esc(skVoice.name)}</b>` : `⚠️ Nessuna voce slovacca trovata (${vs.length} voci disponibili): gli esercizi di ascolto sono sostituiti da altri esercizi. Prova Chrome su Android, Safari su iPhone/Mac, oppure su Windows: Impostazioni › Ora e lingua › Voce › Aggiungi voci › Slovacco.`}</p>
    <div class="row"><button class="btn" id="test">▶︎ Prova: „Ahoj, ako sa máš?“</button></div>
    <label class="field">Velocità della voce <input type="range" id="rate" min="0.5" max="1.2" step="0.05" value="${S.settings.rate}"> <span id="ratev">${S.settings.rate}</span></label>
    <label class="field">Esercizi di ascolto <select id="listen"><option value="auto">automatico (se c'è la voce)</option><option value="on">sempre</option><option value="off">mai</option></select></label>
  </div>
  <div class="card"><h3>🌙 Aspetto</h3>
    <label class="field">Tema <select id="theme"><option value="auto">come il sistema</option><option value="light">chiaro</option><option value="dark">scuro</option></select></label></div>
  <div class="card"><h3>💾 Progressi</h3><p class="muted">Tutto è salvato solo in questo browser (localStorage). Nessun account, nessun dato inviato.</p>
    <div class="row"><button class="btn" id="export">Esporta</button><button class="btn" id="import">Importa</button><button class="btn danger" id="reset">Azzera tutto</button></div></div>
  <div class="card prose"><h3>ℹ️ Informazioni</h3><p><b>Ahoj!</b> è un corso gratuito di slovacco (livello A1) per italiani principianti, ispirato a Duolingo, Babbel, Memrise e al corso gratuito <a href="https://slovake.eu/" target="_blank" rel="noopener">slovake.eu</a>, che consigliamo per continuare dopo l'A1 (ha l'interfaccia in italiano).</p></div>`;
  $('#listen').value = S.settings.listen;
  $('#theme').value = S.settings.dark === null ? 'auto' : S.settings.dark ? 'dark' : 'light';
  $('#test').onclick = e => speak('Ahoj, ako sa máš?', e.currentTarget);
  $('#rate').oninput = e => { S.settings.rate = +e.target.value; $('#ratev').textContent = e.target.value; save(); };
  $('#listen').onchange = e => { S.settings.listen = e.target.value; save(); };
  $('#theme').onchange = e => { S.settings.dark = e.target.value === 'auto' ? null : e.target.value === 'dark'; save(); applyTheme(); };
  $('#reset').onclick = () => { if (confirm('Vuoi davvero cancellare tutti i progressi?')) { localStorage.removeItem(KEY); load(); applyTheme(); updateTopbar(); toast('Progressi azzerati.'); } };
  $('#export').onclick = () => { const t = JSON.stringify(S); if (navigator.clipboard) navigator.clipboard.writeText(t).then(() => toast('Progressi copiati negli appunti 📋'), () => prompt('Copia questo testo:', t)); else prompt('Copia questo testo:', t); };
  $('#import').onclick = () => { const t = prompt('Incolla qui i progressi esportati:'); if (!t) return; try { JSON.parse(t); localStorage.setItem(KEY, t); load(); applyTheme(); updateTopbar(); toast('Progressi importati ✅'); } catch (e) { toast('Testo non valido.'); } };
}

/* ---------- avvio ---------- */
document.addEventListener('click', e => { const b = e.target.closest('[data-say]'); if (b) { e.preventDefault(); e.stopPropagation(); speak(b.dataset.say, b); } }, true);
document.addEventListener('keydown', e => {
  if (!session || e.target.tagName === 'INPUT') return;
  if (/^[1-4]$/.test(e.key)) { const o = $$('.opt')[+e.key - 1]; if (o && !o.disabled) o.click(); }
});
$('#theme-toggle').onclick = () => { const dark = document.documentElement.dataset.theme !== 'dark'; S.settings.dark = dark; save(); applyTheme(); };
load(); applyTheme(); updateTopbar();
window.addEventListener('hashchange', render);
const mq = window.matchMedia('(prefers-color-scheme: dark)'); if (mq.addEventListener) mq.addEventListener('change', applyTheme);
render();
})();
