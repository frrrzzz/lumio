/* ═══════════════════════════════════════════════════
   LUMIO — app.js  v3.0
   Personal AI-powered Learning OS
   HSC Commerce 2027 · Sylhet, Bangladesh
   ─────────────────────────────────────────────────
   Sections:
     1.  Constants & translations
     2.  Data model (default + persistence)
     3.  Utility helpers
     4.  Clock & date
     5.  Navigation
     6.  Rendering — home, study, skills, cards, AI, me
     7.  Flashcard / MCQ logic
     8.  Subject & chapter management
     9.  Skill & element management
    10.  Sheets system
    11.  AI chat (multi-model)
    12.  Sources & API keys
    13.  Alarms & settings
    14.  Biodata (profile)
    15.  Dark mode
    16.  Language
    17.  Canvas charts
    18.  PWA helpers (install prompt, SW)
    19.  Boot / init
═══════════════════════════════════════════════════ */

'use strict';

/* ─────────────────────────────────────────────────
   1. TRANSLATIONS
───────────────────────────────────────────────────*/
const LANG = {
  en: {
    good_morning:'Good morning', good_afternoon:'Good afternoon', good_evening:'Good evening',
    home:'Home', study:'Study', cards:'Cards', ai:'AI', me:'Me', skills:'Skills',
    insights:'Insights', today_study:"Today's study", skills_today:'Skills today',
    subjects:'Subjects', weekly:'Weekly Review', mistake_bank:'Mistake Bank',
    day_streak:'Day streak', mistake_count:'Mistake bank', due:'Due reviews', overall:'Overall done',
    active:'Active', done:'Done', pending:'Pending', i_paper:'I Paper', ii_paper:'II Paper',
    chapters:'Chapters', add_chapter:'Add chapter / topic', edit:'Edit', del:'Delete', save:'Save',
    skill_areas:'Skill Areas', add_el:'Add element / part', language:'Language',
    dark_mode:'Dark mode', edit_bio:'Edit biodata', fc_session:'Flashcard session',
    ref_boxes:'Reference boxes', add_card:'Add flashcard / formula / note', app:'App',
    tap_flip:'Tap to flip', sel_ans:'Select the correct answer', marks:'Marks',
    study_chart:'Study Progress', skills_chart:'Skills Progress'
  },
  bn: {
    good_morning:'শুভ সকাল', good_afternoon:'শুভ বিকাল', good_evening:'শুভ সন্ধ্যা',
    home:'হোম', study:'পড়াশোনা', cards:'কার্ড', ai:'এআই', me:'আমি', skills:'দক্ষতা',
    insights:'বিশ্লেষণ', today_study:'আজকের পড়া', skills_today:'আজকের দক্ষতা',
    subjects:'বিষয়সমূহ', weekly:'সাপ্তাহিক পর্যালোচনা', mistake_bank:'ভুলের তালিকা',
    day_streak:'দিনের ধারা', mistake_count:'ভুলের সংখ্যা', due:'পুনরালোচনা বাকি', overall:'মোট সম্পন্ন',
    active:'সক্রিয়', done:'সম্পন্ন', pending:'মুলতুবি', i_paper:'প্রথম পত্র', ii_paper:'দ্বিতীয় পত্র',
    chapters:'অধ্যায়', add_chapter:'অধ্যায় যোগ করুন', edit:'সম্পাদনা', del:'মুছুন', save:'সংরক্ষণ',
    skill_areas:'দক্ষতার ক্ষেত্র', add_el:'উপাদান / অংশ যোগ করুন', language:'ভাষা',
    dark_mode:'ডার্ক মোড', edit_bio:'তথ্য সম্পাদনা', fc_session:'ফ্লাশকার্ড সেশন',
    ref_boxes:'রেফারেন্স বাক্স', add_card:'ফ্লাশকার্ড / সূত্র / নোট যোগ করুন', app:'অ্যাপ',
    tap_flip:'উল্টাতে ট্যাপ করুন', sel_ans:'সঠিক উত্তর বেছে নিন', marks:'নম্বর',
    study_chart:'পড়াশোনার অগ্রগতি', skills_chart:'দক্ষতার অগ্রগতি'
  }
};

function t(k) {
  const l = (typeof DATA !== 'undefined') && DATA.settings ? DATA.settings.language : 'en';
  return (LANG[l] && LANG[l][k]) || LANG.en[k] || k;
}


/* ─────────────────────────────────────────────────
   2. DATA MODEL
───────────────────────────────────────────────────*/
const DATA_KEY = 'lumio_data_v3';

const DEFAULT_DATA = {
  profile: { name:'', nickname:'', college:'', phone:'', email:'', location:'Sylhet, Bangladesh' },
  subjects: [
    { name:'Accounting', color:'#007aff', hasPapers:true,  papers:{ I:{name:'I Paper',chapters:[]}, II:{name:'II Paper',chapters:[]} } },
    { name:'ICT',        color:'#34c759', hasPapers:false, chapters:[] },
    { name:'Statistics', color:'#ff9500', hasPapers:true,  papers:{ I:{name:'I Paper',chapters:[]}, II:{name:'II Paper',chapters:[]} } },
    { name:'Bangla',     color:'#af52de', hasPapers:true,  papers:{ I:{name:'I Paper',chapters:[]}, II:{name:'II Paper',chapters:[]} } },
    { name:'English',    color:'#ff3b30', hasPapers:true,  papers:{ I:{name:'I Paper',chapters:[]}, II:{name:'II Paper',chapters:[]} } },
    { name:'BOM',        color:'#32ade6', hasPapers:true,  papers:{ I:{name:'I Paper',chapters:[]}, II:{name:'II Paper',chapters:[]} } },
    { name:'PMM',        color:'#ff6b00', hasPapers:true,  papers:{ I:{name:'I Paper',chapters:[]}, II:{name:'II Paper',chapters:[]} } }
  ],
  skills: [
    { name:'Motion Graphics',    color:'#ff9500', icon:'fa-film',     comingSoon:false, parts:[
        { id:'mg1', name:'Part I · Basics',    elements:[] },
        { id:'mg2', name:'Part II · Advanced', elements:[] }
      ]},
    { name:'Data Analysis',      color:'#34c759', icon:'fa-chart-bar', comingSoon:false, parts:[
        { id:'da1', name:'Part I · Python & SQL',   elements:[] },
        { id:'da2', name:'Part II · Visualization', elements:[] }
      ]},
    { name:'English Proficiency', color:'#007aff', icon:'fa-language',  comingSoon:false, parts:[
        { id:'en1', name:'Part I · Reading & Writing', elements:[] },
        { id:'en2', name:'Part II · Grammar & Vocab',  elements:[] }
      ]},
    { name:'Data Science',       color:'#af52de', icon:'fa-flask',     comingSoon:true,  parts:[] }
  ],
  flashcards: [
    {q:'Which of the following is a current asset?',             options:['Machinery','Cash in hand','Building','Goodwill'],          correct:1, sub:'Accounting', src:'sattacademy.com'},
    {q:'The accounting equation is:',                            options:['Assets = Capital – Liabilities','Assets = Capital + Liabilities','Capital = Assets + Liabilities','Assets = Revenue – Expenses'], correct:1, sub:'Accounting', src:'10minuteschool.com'},
    {q:'Which is NOT a fixed asset?',                            options:['Land','Building','Stock in trade','Machinery'],            correct:2, sub:'Accounting', src:'nctb.gov.bd'},
    {q:'A balance sheet shows the:',                             options:['Profit or loss','Financial position at a date','Cash flows','Revenue earned'], correct:1, sub:'Accounting', src:'sattacademy.com'},
    {q:'Depreciation is:',                                       options:['Increase in asset value','Decrease in asset value over time','A cash expense only','A current liability'], correct:1, sub:'Accounting', src:'10minuteschool.com'},
    {q:'Gross Profit = Revenue –',                               options:['All expenses','Cost of Goods Sold','Net loss','Operating expenses'], correct:1, sub:'Accounting', src:'nctb.gov.bd'},
    {q:'The mean of 5, 10 and 15 is:',                          options:['8','10','12','15'],                                        correct:1, sub:'Statistics', src:'sattacademy.com'},
    {q:'Standard deviation = 0 means:',                          options:['All values are identical','No data','High variability','Data is missing'], correct:0, sub:'Statistics', src:'10minuteschool.com'},
    {q:'Median divides the distribution into:',                  options:['3 equal parts','4 equal parts','2 equal halves','10 deciles'], correct:2, sub:'Statistics', src:'nctb.gov.bd'},
    {q:'Which is NOT a measure of central tendency?',            options:['Mean','Median','Mode','Range'],                           correct:3, sub:'Statistics', src:'sattacademy.com'},
    {q:'Which is NOT a management function?',                    options:['Planning','Organizing','Manufacturing','Controlling'],    correct:2, sub:'BOM',        src:'sattacademy.com'},
    {q:'In SWOT, "O" stands for:',                               options:['Output','Opportunity','Options','Organization'],          correct:1, sub:'BOM',        src:'10minuteschool.com'},
    {q:'MBO stands for Management by:',                          options:['Objectives','Orders','Operations','Oversight'],           correct:0, sub:'BOM',        src:'nctb.gov.bd'},
    {q:'Marketing mix consists of how many Ps?',                 options:['3','4','5','6'],                                          correct:1, sub:'PMM',        src:'sattacademy.com'},
    {q:'Market segmentation means:',                             options:['Dividing market into groups','Selling in segments','Segment pricing','Creating new markets'], correct:0, sub:'PMM', src:'10minuteschool.com'},
    {q:'Consumer market (B2C) means:',                           options:['Business to business','Business to consumer','Bank to customer','Bulk to companies'], correct:1, sub:'PMM', src:'nctb.gov.bd'},
    {q:'Which is NOT part of marketing mix?',                    options:['Product','Price','Profit','Promotion'],                   correct:2, sub:'PMM',        src:'sattacademy.com'},
    {q:'Decimal value of binary 1010 is:',                       options:['8','10','12','14'],                                       correct:1, sub:'ICT',        src:'sattacademy.com'},
    {q:'CPU stands for:',                                        options:['Control Processing Unit','Central Processing Unit','Computer Personal Unit','Core Processing Utility'], correct:1, sub:'ICT', src:'10minuteschool.com'},
    {q:'RAM is:',                                                options:['Permanent memory','Temporary/volatile memory','Read-only storage','Secondary storage'], correct:1, sub:'ICT', src:'nctb.gov.bd'},
    {q:'HTTP stands for:',                                       options:['HyperText Transfer Protocol','Host Transfer Text Protocol','High Text Transit Program','HyperText Transit Port'], correct:0, sub:'ICT', src:'sattacademy.com'},
    {q:'"Amar Sonar Bangla" is a:',                              options:['Poem','Novel','Drama','Song / national anthem'],          correct:3, sub:'Bangla',     src:'sattacademy.com'},
    {q:'Which is a noun?',                                       options:['Beautiful','Quickly','Happiness','Running fast'],         correct:2, sub:'English',    src:'sattacademy.com'},
    {q:'Passive of "He reads a book" is:',                       options:['A book is read by him','A book was read','He had read a book','Reading a book'], correct:0, sub:'English', src:'10minuteschool.com'},
    {q:'Which is a compound sentence?',                          options:['He ran fast','She sings and he dances','Because it rained we stayed','The tall man walked'], correct:1, sub:'English', src:'nctb.gov.bd'}
  ],
  alarms: [
    { label:'Morning study',    time:'07:00', repeat:'Every day', on:false, color:'var(--blue)'   },
    { label:'Afternoon review', time:'15:00', repeat:'Weekdays',  on:false, color:'var(--orange)' },
    { label:'Night revision',   time:'21:00', repeat:'Every day', on:false, color:'var(--red)'    }
  ],
  sources: ['sattacademy.com','10minuteschool.com','nctb.gov.bd'],
  apiKeys: { gpt:'', gemini:'', perp:'', meta:'' },
  settings: { language:'en', darkMode:false },
  stats:    { streak:0, mistakeBank:0, dueReviews:0, weeklyDone:0, weeklyActive:0 },
  weeklyReview: null,
  mistakeCards: []
};

// Merge saved data on top of defaults (preserves new fields across updates)
function loadData() {
  try {
    const saved = JSON.parse(localStorage.getItem(DATA_KEY) || 'null');
    if (!saved) {
      window.DATA = JSON.parse(JSON.stringify(DEFAULT_DATA));
    } else {
      window.DATA = Object.assign({}, JSON.parse(JSON.stringify(DEFAULT_DATA)), saved);
      // Deep-merge settings & profile
      DATA.settings      = Object.assign({}, DEFAULT_DATA.settings,  saved.settings  || {});
      DATA.profile       = Object.assign({}, DEFAULT_DATA.profile,   saved.profile   || {});
      DATA.apiKeys       = Object.assign({}, DEFAULT_DATA.apiKeys,   saved.apiKeys   || {});
      DATA.stats         = Object.assign({}, DEFAULT_DATA.stats,     saved.stats     || {});
      // Preserve full arrays from saved data
      if (saved.subjects)    DATA.subjects    = saved.subjects;
      if (saved.skills)      DATA.skills      = saved.skills;
      if (saved.flashcards)  DATA.flashcards  = saved.flashcards;
      if (saved.alarms)      DATA.alarms      = saved.alarms;
      if (saved.sources)     DATA.sources     = saved.sources;
      if (saved.mistakeCards) DATA.mistakeCards = saved.mistakeCards;
      if (saved.weeklyReview) DATA.weeklyReview = saved.weeklyReview;
    }
  } catch(e) {
    window.DATA = JSON.parse(JSON.stringify(DEFAULT_DATA));
  }
}

function saveData() {
  try { localStorage.setItem(DATA_KEY, JSON.stringify(DATA)); } catch(e) {}
}


/* ─────────────────────────────────────────────────
   3. UTILITY HELPERS
───────────────────────────────────────────────────*/
function uid() {
  return Math.random().toString(36).slice(2, 10) + Date.now().toString(36);
}

function cssVar(name) {
  return getComputedStyle(document.documentElement).getPropertyValue(name).trim();
}

function setText(id, val) {
  const el = document.getElementById(id);
  if (el) el.textContent = val;
}

function subjectChapters(s) {
  if (!s.hasPapers) return s.chapters || [];
  const a = (s.papers && s.papers.I  && s.papers.I.chapters)  || [];
  const b = (s.papers && s.papers.II && s.papers.II.chapters) || [];
  return [...a, ...b];
}

function subjectProgress(s) {
  const chs = subjectChapters(s);
  if (!chs.length) return 0;
  return Math.round(chs.reduce((a, c) => a + (c.marks || 0), 0) / chs.length);
}

function skillElements(sk) {
  return (sk.parts || []).reduce((a, p) => a.concat(p.elements || []), []);
}

function skillProgress(sk) {
  const els = skillElements(sk);
  if (!els.length) return 0;
  return Math.round(els.reduce((a, e) => a + (e.marks || 0), 0) / els.length);
}

function overallProgress() {
  const vals = DATA.subjects.map(s => subjectProgress(s));
  if (!vals.length) return 0;
  return Math.round(vals.reduce((a, v) => a + v, 0) / vals.length);
}

function estimateGPA() {
  const pct = overallProgress();
  if (pct >= 90) return 5.00;
  if (pct >= 80) return 4.50;
  if (pct >= 70) return 4.00;
  if (pct >= 60) return 3.50;
  if (pct >= 50) return 3.00;
  if (pct >= 40) return 2.00;
  return 0.00;
}

function fillRR(ctx, x, y, w, h, r) {
  if (w <= 0) return;
  r = Math.min(r, w / 2, h / 2);
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h - r);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
  ctx.fill();
}


/* ─────────────────────────────────────────────────
   4. CLOCK & DATE
───────────────────────────────────────────────────*/
function tick() {
  const now = new Date();
  const h = String(now.getHours()).padStart(2, '0');
  const m = String(now.getMinutes()).padStart(2, '0');
  document.querySelectorAll('.clock-el').forEach(el => { el.textContent = h + ':' + m; });

  const days   = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
  const months = ['January','February','March','April','May','June','July','August','September','October','November','December'];
  const ds = days[now.getDay()] + ', ' + now.getDate() + ' ' + months[now.getMonth()];

  const hr     = now.getHours();
  const greet  = hr < 12 ? t('good_morning') : hr < 17 ? t('good_afternoon') : t('good_evening');

  setText('home-date',    ds);
  setText('profile-date', ds + ' ' + now.getFullYear());

  const gr = document.getElementById('greeting');
  if (gr) gr.textContent = greet;
  const gn = document.getElementById('greeting-nick');
  if (gn) gn.textContent = DATA.profile.nickname ? ', ' + DATA.profile.nickname : '';
}


/* ─────────────────────────────────────────────────
   5. NAVIGATION
───────────────────────────────────────────────────*/
function goTo(tab) {
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));

  const scr = document.getElementById('screen-' + tab);
  if (scr) scr.classList.add('active');

  const navId = (tab === 'skills') ? 'study' : tab;
  const nav   = document.getElementById('nav-' + navId);
  if (nav) nav.classList.add('active');

  const sni = document.getElementById('study-nav-icon');
  const snl = document.getElementById('nl-study');
  if (tab === 'skills') {
    if (sni) sni.className = 'fa-solid fa-bolt-lightning';
    if (snl) snl.textContent = t('skills');
  } else {
    if (sni) sni.className = 'fa-solid fa-book-open';
    if (snl) snl.textContent = t('study');
  }

  document.getElementById('screen-area').scrollTop = 0;
  if (tab === 'home') setTimeout(() => { drawStudyDonut(); drawSkillsBar(); }, 50);
  updateStats();
}

/* Double-tap Study ↔ Skills */
let _tapT = 0, _tapTimer = null;

function handleStudyTap(e) {
  e.preventDefault(); e.stopPropagation();
  const now = Date.now();
  if (now - _tapT < 360) {
    clearTimeout(_tapTimer); _tapT = 0;
    const cur = document.querySelector('.screen.active')?.id;
    goTo(cur === 'screen-skills' ? 'study' : 'skills');
  } else {
    _tapT = now;
    _tapTimer = setTimeout(() => {
      const cur = document.querySelector('.screen.active')?.id;
      if (cur !== 'screen-skills') goTo('study');
      const h = document.getElementById('dtap-hint');
      if (h) {
        h.textContent = cur === 'screen-study' ? 'Double-tap for Skills ⚡' : 'Double-tap for Study 📚';
        h.classList.add('show');
        setTimeout(() => h.classList.remove('show'), 1600);
      }
    }, 210);
  }
}

function handleStudyClick(e) {
  if (e.sourceCapabilities && e.sourceCapabilities.firesTouchEvents) return;
  handleStudyTap(e);
}


/* ─────────────────────────────────────────────────
   6. STATS UPDATE (called after any data change)
───────────────────────────────────────────────────*/
function updateStats() {
  const streak  = DATA.stats.streak || 0;
  const mistake = DATA.stats.mistakeBank || 0;
  const due     = DATA.stats.dueReviews || 0;
  const overall = overallProgress();
  const gpa     = estimateGPA();
  const gpaPct  = Math.round((gpa / 5) * 100);

  setText('stat-streak',  streak);
  setText('stat-mistake', mistake);
  setText('stat-due',     due);
  setText('stat-overall', overall + '%');

  setText('gpa-label', gpa.toFixed(2));
  setText('gpa-pct',   gpaPct + '%');
  const fill = document.getElementById('gpa-fill');
  if (fill) fill.style.width = gpaPct + '%';

  setText('prof-streak',  streak);
  setText('prof-overall', overall + '%');
  setText('prof-gpa',     gpa.toFixed(1));
  setText('prof-mistake', mistake);

  // Weekly
  const wDone   = DATA.stats.weeklyDone   || 0;
  const wActive = DATA.stats.weeklyActive || 0;
  setText('week-done',   wDone);
  setText('week-active', wActive);

  const wLabel = document.getElementById('week-label');
  if (wLabel) {
    const d = new Date();
    wLabel.textContent = 'Week of ' + d.toLocaleDateString('en-US', { month:'short', day:'numeric' });
  }

  renderSubjects();
  renderSkillsList();
  renderSpacedReview();
  renderMistakeBank();
  renderSkillsSnapshot();
  renderMeSkills();
  renderTodayTasks();
  renderAlarms();
  drawStudyDonut();
  drawSkillsBar();
  saveData();
}


/* ─────────────────────────────────────────────────
   7. CANVAS CHARTS
───────────────────────────────────────────────────*/
function drawStudyDonut() {
  const canvas = document.getElementById('donut-chart');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const w = canvas.width, h = canvas.height;
  ctx.clearRect(0, 0, w, h);

  const cx = w / 2, cy = h / 2;
  const r  = Math.min(cx, cy) - 3;
  const ir = r * 0.56;

  const segs  = DATA.subjects.map(s => ({ color: s.color, val: Math.max(subjectProgress(s), 1), name: s.name, pct: subjectProgress(s) }));
  const total = segs.reduce((a, x) => a + x.val, 0);

  let ang = -Math.PI / 2;
  for (const seg of segs) {
    const a = (seg.val / total) * 2 * Math.PI;
    ctx.beginPath(); ctx.moveTo(cx, cy);
    ctx.arc(cx, cy, r, ang, ang + a);
    ctx.closePath(); ctx.fillStyle = seg.color; ctx.fill();
    ang += a;
  }

  ctx.beginPath(); ctx.arc(cx, cy, ir, 0, 2 * Math.PI);
  ctx.fillStyle = cssVar('--card') || '#fff'; ctx.fill();

  const ov = overallProgress();
  ctx.fillStyle = cssVar('--text') || '#1c1c1e';
  ctx.font = 'bold 11px -apple-system,sans-serif';
  ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  ctx.fillText(ov + '%', cx, cy);

  const legend = document.getElementById('donut-legend');
  if (legend) {
    legend.innerHTML = DATA.subjects.map(s =>
      `<div class="chart-legend-item">
         <div class="chart-legend-dot" style="background:${s.color}"></div>
         <span>${s.name} ${subjectProgress(s)}%</span>
       </div>`
    ).join('');
  }
}

function drawSkillsBar() {
  const canvas = document.getElementById('bar-chart');
  if (!canvas) return;
  const ctx    = canvas.getContext('2d');
  const w = canvas.width, h = canvas.height;
  ctx.clearRect(0, 0, w, h);

  const active = DATA.skills.filter(s => !s.comingSoon);
  if (!active.length) return;

  const barH  = 12;
  const gap   = (h - active.length * barH) / (active.length + 1);
  const maxBW = w - 36;
  const bgCol = cssVar('--border') || '#e5e5ea';
  const txCol = cssVar('--text')   || '#1c1c1e';

  active.forEach((sk, i) => {
    const pct = skillProgress(sk);
    const y   = gap + i * (barH + gap);
    ctx.fillStyle = bgCol; fillRR(ctx, 0, y, maxBW, barH, barH / 2);
    if (pct > 0) { ctx.fillStyle = sk.color; fillRR(ctx, 0, y, (pct / 100) * maxBW, barH, barH / 2); }
    ctx.fillStyle = txCol; ctx.font = 'bold 9px -apple-system,sans-serif';
    ctx.textAlign = 'left'; ctx.textBaseline = 'middle';
    ctx.fillText(pct + '%', maxBW + 4, y + barH / 2);
  });
}


/* ─────────────────────────────────────────────────
   8. RENDER FUNCTIONS
───────────────────────────────────────────────────*/
function renderSubjects() {
  const el = document.getElementById('subjects-list'); if (!el) return;
  el.innerHTML = DATA.subjects.map(s => {
    const pct  = subjectProgress(s);
    const chs  = subjectChapters(s);
    const done = chs.filter(c => c.status === 'done').length;
    return `<div class="row row-sep row-item" style="cursor:pointer" onclick="openSubjectSheet('${s.name}')">
      <div class="dot" style="background:${s.color}"></div>
      <div class="cell-body">
        <div class="cell-title">${s.name}${s.hasPapers ? '<span style="font-size:10px;color:var(--text3);margin-left:6px">I & II Paper</span>' : ''}</div>
        <div class="cell-sub">${done}/${chs.length} ${t('chapters')}</div>
        <div class="prog-bar"><div class="prog-fill" style="width:${pct}%;background:${s.color}"></div></div>
      </div>
      <div style="font-size:13px;font-weight:700;color:${s.color};margin-right:4px">${pct}%</div>
      <i class="fa-solid fa-chevron-right chevron"></i>
    </div>`;
  }).join('');
}

function renderSkillsList() {
  const el = document.getElementById('skills-list'); if (!el) return;
  el.innerHTML = DATA.skills.map(sk => {
    const pct  = skillProgress(sk);
    const els  = skillElements(sk);
    const done = els.filter(e => e.status === 'done').length;
    if (sk.comingSoon) return `<div class="row row-sep row-item coming-soon">
      <div class="cell-icon" style="background:#f2f2f7"><i class="fa-solid ${sk.icon}" style="color:var(--text3)"></i></div>
      <div class="cell-body"><div class="cell-title">${sk.name}<span class="cs-badge">Coming soon</span></div><div class="cell-sub">Not yet available</div></div>
    </div>`;
    return `<div class="row row-sep row-item" style="cursor:pointer" onclick="openSkillSheet('${sk.name}')">
      <div class="cell-icon" style="background:${sk.color}22"><i class="fa-solid ${sk.icon}" style="color:${sk.color}"></i></div>
      <div class="cell-body">
        <div class="cell-title">${sk.name}</div>
        <div class="cell-sub">${done}/${els.length} elements</div>
        <div class="prog-bar"><div class="prog-fill" style="width:${pct}%;background:${sk.color}"></div></div>
      </div>
      <div style="font-size:13px;font-weight:700;color:${sk.color};margin-right:4px">${pct}%</div>
      <i class="fa-solid fa-chevron-right chevron"></i>
    </div>`;
  }).join('');
}

function renderSpacedReview() {
  const el = document.getElementById('spaced-list'); if (!el) return;
  const due = [];
  DATA.subjects.forEach(s => subjectChapters(s).forEach(c => { if (c.status === 'active') due.push({ sub: s.name, color: s.color, ch: c.name }); }));
  if (!due.length) { el.innerHTML = '<div class="empty"><i class="fa-regular fa-clock"></i><div class="empty-title">No reviews due</div><div class="empty-sub">Add & activate chapters</div></div>'; return; }
  el.innerHTML = due.slice(0, 6).map(d => `<div class="row row-sep row-item">
    <div class="dot" style="background:${d.color}"></div>
    <div class="cell-body"><div class="cell-title">${d.sub} · ${d.ch}</div><div class="cell-sub">Due for review</div></div>
    <span class="badge badge-orange">Review</span>
  </div>`).join('');
}

function renderMistakeBank() {
  const el = document.getElementById('mistake-list'); if (!el) return;
  el.innerHTML = DATA.mistakeCards && DATA.mistakeCards.length
    ? DATA.mistakeCards.slice(-8).reverse().map(m => `<div class="row row-sep row-item">
        <div class="cell-icon" style="background:#ffeef0"><i class="fa-solid fa-xmark" style="color:var(--red);font-size:13px"></i></div>
        <div class="cell-body"><div class="cell-title">${m.sub} · ${m.q.substring(0,40)}…</div><div class="cell-sub">Wrong answer recorded</div></div>
      </div>`).join('')
    : '<div style="font-size:12px;color:var(--text3);padding:4px 0">Wrong flashcard answers appear here automatically.</div>';
}

function renderSkillsSnapshot() {
  const el = document.getElementById('skills-snapshot'); if (!el) return;
  const list = DATA.skills.filter(s => !s.comingSoon);
  if (!list.length) { el.innerHTML = '<div class="empty" style="padding:20px"><div class="empty-title">No skills data</div></div>'; return; }
  el.innerHTML = list.map((sk, i, arr) => {
    const pct  = skillProgress(sk);
    const isLast = i === arr.length - 1;
    const statusBadge = pct >= 80 ? `<div class="badge badge-green">Strong</div>` : pct >= 40 ? `<div class="badge badge-orange">Active</div>` : `<div class="badge badge-blue">Learning</div>`;
    return `<div class="row ${isLast ? '' : 'row-sep'} row-item">
      <div class="cell-icon" style="background:${sk.color}22"><i class="fa-solid ${sk.icon}" style="color:${sk.color}"></i></div>
      <div class="cell-body"><div class="cell-title">${sk.name}</div><div class="cell-sub">${skillElements(sk).length} elements · ${pct}%</div></div>
      ${statusBadge}
    </div>`;
  }).join('');
}

function renderMeSkills() {
  const el = document.getElementById('me-skills-card'); if (!el) return;
  const active = DATA.skills.filter(s => !s.comingSoon);
  if (active.every(s => skillElements(s).length === 0)) {
    el.innerHTML = '<div class="empty"><i class="fa-solid fa-bolt-lightning"></i><div class="empty-title">No skill data yet</div><div class="empty-sub">Go to Skills tab to add elements</div></div>';
    return;
  }
  el.innerHTML = active.map((sk, i) => {
    const pct = skillProgress(sk); const els = skillElements(sk);
    return `${i > 0 ? '<div style="height:.5px;background:var(--border);margin:2px 0 10px"></div>' : ''}
    <div style="margin-bottom:${i < active.length - 1 ? 14 : 0}px">
      <div class="row" style="margin-bottom:8px">
        <div class="cell-icon" style="background:${sk.color}22"><i class="fa-solid ${sk.icon}" style="color:${sk.color}"></i></div>
        <div class="cell-body"><div class="cell-title" style="font-weight:600">${sk.name}</div><div class="cell-sub">${els.length} elements</div></div>
        <div style="font-size:16px;font-weight:700;color:${sk.color}">${pct}%</div>
      </div>
      ${els.slice(0, 3).map(e => `<div style="margin-bottom:6px">
        <div class="row" style="margin-bottom:2px">
          <div style="font-size:11px;font-weight:500;flex:1">${e.name}</div>
          <div style="font-size:11px;font-weight:700;color:${sk.color}">${e.marks || 0}%</div>
        </div>
        <div class="prog-bar"><div class="prog-fill" style="width:${e.marks||0}%;background:${sk.color}"></div></div>
      </div>`).join('')}
      ${els.length > 3 ? `<div style="font-size:11px;color:var(--text3);margin-top:4px">+${els.length - 3} more in Skills tab</div>` : ''}
    </div>`;
  }).join('');
}

function renderTodayTasks() {
  const el = document.getElementById('today-tasks'); if (!el) return;
  const tasks = [];
  DATA.subjects.forEach(s => subjectChapters(s).forEach(c => { if (c.status === 'active') tasks.push({ sub: s.name, color: s.color, ch: c.name }); }));
  if (!tasks.length) { el.innerHTML = '<div style="font-size:12px;color:var(--text3);padding:4px 0">No active chapters. Open Study tab to activate chapters.</div>'; return; }
  el.innerHTML = tasks.slice(0, 5).map((task, i) => `<div class="row row-sep row-item" style="${i === Math.min(tasks.length, 5) - 1 ? 'border-bottom:none' : ''}">
    <div class="dot" style="background:${task.color}"></div>
    <div class="cell-body cell-title">${task.sub} · ${task.ch}</div>
    <div class="cell-right">${t('active')}</div>
  </div>`).join('');
}

function renderSources() {
  const el = document.getElementById('sources-list'); if (!el) return;
  el.innerHTML = DATA.sources.map((s, i) => `<div class="row row-sep row-item">
    <div class="cell-icon" style="background:#f2f2f7;width:28px;height:28px;border-radius:7px;font-size:12px"><i class="fa-solid fa-globe" style="color:var(--blue)"></i></div>
    <div class="cell-body"><div class="cell-title" style="font-size:12px">${s}</div></div>
    <span onclick="removeSource(${i})" style="color:var(--red);font-size:13px;cursor:pointer;padding:4px 6px"><i class="fa-solid fa-xmark"></i></span>
  </div>`).join('');
}

function renderAlarms() {
  const el = document.getElementById('alarms-list'); if (!el) return;
  el.innerHTML = DATA.alarms.map((a, i) => `<div class="row row-sep row-item">
    <div class="cell-icon" style="background:var(--bg);width:28px;height:28px;border-radius:8px">
      <i class="fa-solid fa-bell" style="font-size:13px;color:${a.color}"></i>
    </div>
    <div class="cell-body">
      <div class="cell-title">${a.label}</div>
      <div class="cell-sub">${a.time} · ${a.repeat}</div>
    </div>
    <div class="toggle ${a.on ? 'on' : 'off'}" onclick="toggleAlarm(${i})"><div class="toggle-thumb"></div></div>
  </div>`).join('');
}

function toggleAlarm(i) {
  DATA.alarms[i].on = !DATA.alarms[i].on;
  renderAlarms(); saveData();
  if (DATA.alarms[i].on) requestNotificationPermission();
}

function requestNotificationPermission() {
  if ('Notification' in window && Notification.permission === 'default') {
    Notification.requestPermission();
  }
}


/* ─────────────────────────────────────────────────
   9. FLASHCARDS / MCQ
───────────────────────────────────────────────────*/
let currentCard   = 0;
let cardFlipped   = false;
let mcqAnswered   = false;
let currentFilter = 'All';

function renderCardsFilter() {
  const el = document.getElementById('cards-filter'); if (!el) return;
  const items = ['All', ...DATA.subjects.map(s => s.name)];
  el.innerHTML = items.map((s, i) =>
    `<button class="pill ${i === 0 ? 'active' : ''}" onclick="filterCards(this,'${s}')">${s}</button>`
  ).join('');
}

function filterCards(btn, sub) {
  document.querySelectorAll('#cards-filter .pill').forEach(p => p.classList.remove('active'));
  btn.classList.add('active');
  currentFilter = sub;
  currentCard = 0;
  updateCard();
}

function filteredCards() {
  return currentFilter === 'All' ? DATA.flashcards : DATA.flashcards.filter(c => c.sub === currentFilter);
}

function updateCard() {
  const cards = filteredCards();
  if (!cards.length) {
    setText('fc-question', 'No cards for this subject.');
    const opts = document.getElementById('fc-options'); if (opts) opts.style.display = 'none';
    const ans  = document.getElementById('fc-answer');  if (ans)  ans.style.display  = 'none';
    setText('fc-src', ''); setText('card-count', '0 cards'); return;
  }
  if (currentCard >= cards.length) currentCard = 0;
  const c  = cards[currentCard];
  const fc = document.getElementById('flashcard');
  setText('fc-question', c.q);
  const ansEl = document.getElementById('fc-answer');
  if (ansEl) { ansEl.textContent = c.a || ''; ansEl.style.display = 'none'; }
  setText('fc-src', c.src ? 'Source: ' + c.src : '');
  if (fc) fc.classList.remove('flipped');
  cardFlipped = false; mcqAnswered = false;

  const optsEl = document.getElementById('fc-options');
  if (c.options) {
    if (optsEl) {
      optsEl.style.display = 'grid';
      optsEl.innerHTML = c.options.map((opt, i) => `<button class="mcq-opt" onclick="selectMCQ(${i})">
        <span class="mcq-letter">${['A','B','C','D'][i]}</span>
        <span style="flex:1">${opt}</span>
      </button>`).join('');
    }
    setText('card-count', `Card ${currentCard + 1} of ${cards.length} · ${t('sel_ans')}`);
    if (fc) fc.onclick = null;
  } else {
    if (optsEl) optsEl.style.display = 'none';
    setText('card-count', `Card ${currentCard + 1} of ${cards.length} · ${t('tap_flip')}`);
    if (fc) fc.onclick = () => flipCard();
  }
}

function selectMCQ(i) {
  if (mcqAnswered) return;
  mcqAnswered = true;
  const cards = filteredCards(); const c = cards[currentCard];
  const opts  = document.querySelectorAll('.mcq-opt');
  opts.forEach((btn, idx) => {
    if (idx === c.correct) btn.classList.add('reveal-correct');
    else if (idx === i && i !== c.correct) btn.classList.add('wrong-pick');
    if (idx === i && i === c.correct) btn.classList.add('correct-pick');
  });
  if (i !== c.correct) {
    DATA.stats.mistakeBank = (DATA.stats.mistakeBank || 0) + 1;
    DATA.mistakeCards.push({ sub: c.sub, q: c.q });
    if (DATA.mistakeCards.length > 50) DATA.mistakeCards.shift();
    setText('stat-mistake', DATA.stats.mistakeBank);
    setText('prof-mistake', DATA.stats.mistakeBank);
    saveData();
  }
  setText('card-count', i === c.correct ? '✓ Correct!' : '✗ Wrong — correct answer highlighted');
}

function flipCard() {
  const c = filteredCards()[currentCard];
  if (c && c.options) return;
  cardFlipped = !cardFlipped;
  const fc = document.getElementById('flashcard');
  if (fc) fc.classList.toggle('flipped', cardFlipped);
  const ans = document.getElementById('fc-answer');
  if (ans) ans.style.display = cardFlipped ? 'block' : 'none';
}

function cardResult(r) {
  if (r === 'wrong' && !filteredCards()[currentCard]?.options) {
    DATA.stats.mistakeBank = (DATA.stats.mistakeBank || 0) + 1;
    const c = filteredCards()[currentCard];
    DATA.mistakeCards.push({ sub: c.sub, q: c.q });
    if (DATA.mistakeCards.length > 50) DATA.mistakeCards.shift();
    setText('stat-mistake', DATA.stats.mistakeBank);
    saveData();
  }
  currentCard = (currentCard + 1) % filteredCards().length;
  updateCard();
}

function saveCustomCard() {
  const sub = document.getElementById('ac-sub')?.value;
  const q   = document.getElementById('ac-q')?.value?.trim();
  const a   = document.getElementById('ac-a')?.value?.trim();
  if (!q) return;
  DATA.flashcards.push({ q, a, sub, src: 'custom' });
  renderCardsFilter(); updateCard(); closeSheet(); saveData();
}

function switchCT(tp, btn) {
  document.querySelectorAll('#sheet-content .pill').forEach(p => p.classList.remove('active'));
  btn.classList.add('active');
}

function loadMCQFromSources() {
  const extra = [
    {q:'Which is an example of external liability?',  options:['Capital','Creditors','Owner drawings','Reserves'],              correct:1, sub:'Accounting', src:'sattacademy.com'},
    {q:'Mode is the value that:',                      options:['Occurs most often','Is in the middle','Is the average','Has the highest'], correct:0, sub:'Statistics', src:'sattacademy.com'},
    {q:'Which topology connects all devices in a circle?', options:['Bus','Star','Ring','Mesh'],                                 correct:2, sub:'ICT',        src:'10minuteschool.com'},
    {q:'Span of control refers to:',                   options:['Authority of a manager','Number of subordinates managed','Company size','Dept budget'], correct:1, sub:'BOM', src:'nctb.gov.bd'},
    {q:'Which pricing strategy sets initial price low?',options:['Skimming','Penetration','Premium','Bundle'],                  correct:1, sub:'PMM',        src:'sattacademy.com'},
    {q:'NIC stands for:',                              options:['National Identity Card','Network Interface Card','New Internet Connection','No Input Card'], correct:1, sub:'ICT', src:'10minuteschool.com'}
  ];
  let added = 0;
  extra.forEach(card => { if (!DATA.flashcards.find(f => f.q === card.q)) { DATA.flashcards.push(card); added++; } });
  renderCardsFilter(); updateCard(); saveData();
  alert(`Loaded ${added} new MCQ from trusted HSC sources! Total: ${DATA.flashcards.length} cards`);
}


/* ─────────────────────────────────────────────────
   10. SUBJECT & CHAPTER MANAGEMENT
───────────────────────────────────────────────────*/
function getChaptersRef(subName, paperKey) {
  const s = DATA.subjects.find(x => x.name === subName);
  if (!s) return null;
  return paperKey ? s.papers[paperKey].chapters : s.chapters;
}

function addChapter() {
  const subName  = document.getElementById('ch-subject')?.value;
  const s        = DATA.subjects.find(x => x.name === subName);
  if (!s) return;
  const paperKey = s.hasPapers ? (document.getElementById('ch-paper')?.value || 'I') : null;
  const name     = document.getElementById('ch-name')?.value?.trim() || 'Chapter';
  const marks    = Math.min(100, Math.max(0, parseInt(document.getElementById('ch-marks')?.value) || 0));
  const status   = document.getElementById('ch-status')?.value || 'pending';
  const ch       = { id: uid(), name, marks, status };
  const chs      = getChaptersRef(subName, paperKey);
  if (chs) { chs.push(ch); updateStats(); closeSheet(); }
}

function cycleChapterStatus(subName, paperKey, idx) {
  const chs = getChaptersRef(subName, paperKey); if (!chs) return;
  const c   = chs[idx]; if (!c) return;
  const cycle = { pending:'active', active:'done', done:'pending' };
  c.status = cycle[c.status || 'pending'] || 'pending';
  updateStats();
  openPaperSheet(subName, paperKey || null);
}

function saveEditChapter(subName, paperKey, idx) {
  const chs = getChaptersRef(subName, paperKey); if (!chs) return;
  const c   = chs[idx]; if (!c) return;
  c.name   = document.getElementById('ec-name')?.value?.trim() || c.name;
  c.marks  = Math.min(100, Math.max(0, parseInt(document.getElementById('ec-marks')?.value) || 0));
  c.status = document.getElementById('ec-status')?.value || 'pending';
  updateStats(); popSheet();
}

function deleteChapter(subName, paperKey, idx) {
  if (!confirm('Delete this chapter?')) return;
  const chs = getChaptersRef(subName, paperKey);
  if (chs) { chs.splice(idx, 1); updateStats(); popSheet(); }
}

function paperProgress(s, p) {
  const chs = s.papers[p].chapters;
  if (!chs.length) return 0;
  return Math.round(chs.reduce((a, c) => a + (c.marks || 0), 0) / chs.length);
}


/* ─────────────────────────────────────────────────
   11. SKILL & ELEMENT MANAGEMENT
───────────────────────────────────────────────────*/
function getElsRef(skName, partId) {
  const sk   = DATA.skills.find(x => x.name === skName); if (!sk) return null;
  const part = sk.parts.find(p => p.id === partId);
  return part ? part.elements : null;
}

function addSkillElement() {
  const skName = document.getElementById('el-skill')?.value;
  const partId = document.getElementById('el-part')?.value;
  const name   = document.getElementById('el-name')?.value?.trim() || 'Element';
  const marks  = Math.min(100, Math.max(0, parseInt(document.getElementById('el-marks')?.value) || 0));
  const status = document.getElementById('el-status')?.value || 'pending';
  const els    = getElsRef(skName, partId);
  if (els) { els.push({ id: uid(), name, marks, status }); updateStats(); closeSheet(); }
}

function cycleElStatus(skName, partId, idx) {
  const els = getElsRef(skName, partId); if (!els) return;
  const e   = els[idx]; if (!e) return;
  const cy  = { pending:'active', active:'done', done:'pending' };
  e.status  = cy[e.status || 'pending'];
  updateStats(); openPartSheet(skName, partId);
}

function saveEditEl(skName, partId, idx) {
  const els = getElsRef(skName, partId); if (!els) return;
  const e   = els[idx]; if (!e) return;
  e.name   = document.getElementById('ee-name')?.value?.trim() || e.name;
  e.marks  = Math.min(100, Math.max(0, parseInt(document.getElementById('ee-marks')?.value) || 0));
  e.status = document.getElementById('ee-status')?.value || 'pending';
  updateStats(); popSheet();
}

function deleteEl(skName, partId, idx) {
  if (!confirm('Delete this element?')) return;
  const els = getElsRef(skName, partId);
  if (els) { els.splice(idx, 1); updateStats(); popSheet(); }
}

function partProgress(p) {
  if (!p.elements.length) return 0;
  return Math.round(p.elements.reduce((a, e) => a + (e.marks || 0), 0) / p.elements.length);
}


/* ─────────────────────────────────────────────────
   12. SHEET SYSTEM
───────────────────────────────────────────────────*/
let _sheetStack = [];

function openSheet(id) {
  _sheetStack = [];
  document.getElementById('sheet-content').innerHTML = sheetHTML(id);
  document.getElementById('overlay').classList.add('show');
  if (id === 'sheet-biodata') prefillBiodata();
}

function pushSheet(html) {
  _sheetStack.push(document.getElementById('sheet-content').innerHTML);
  document.getElementById('sheet-content').innerHTML = html;
  document.getElementById('overlay').classList.add('show');
}

function popSheet() {
  if (_sheetStack.length > 0) document.getElementById('sheet-content').innerHTML = _sheetStack.pop();
  else closeSheet();
}

function closeSheet() {
  document.getElementById('overlay').classList.remove('show');
  _sheetStack = [];
}

/* ── Subject / paper sheets ── */
function openSubjectSheet(name) {
  const s = DATA.subjects.find(x => x.name === name); if (!s) return;
  if (s.hasPapers) {
    const pct = subjectProgress(s);
    const chs = subjectChapters(s);
    pushSheet(`
      <div class="sheet-title" style="color:${s.color}">${s.name}</div>
      <div class="row" style="gap:10px;margin-bottom:12px">
        <div style="flex:1;background:var(--bg);border-radius:10px;padding:10px;text-align:center"><div style="font-size:20px;font-weight:700;color:${s.color}">${pct}%</div><div style="font-size:10px;color:var(--text3)">Progress</div></div>
        <div style="flex:1;background:var(--bg);border-radius:10px;padding:10px;text-align:center"><div style="font-size:20px;font-weight:700;color:var(--green)">${chs.filter(c=>c.status==='done').length}</div><div style="font-size:10px;color:var(--text3)">Done</div></div>
        <div style="flex:1;background:var(--bg);border-radius:10px;padding:10px;text-align:center"><div style="font-size:20px;font-weight:700;color:var(--text3)">${chs.length}</div><div style="font-size:10px;color:var(--text3)">Total</div></div>
      </div>
      <div class="prog-bar" style="height:6px;margin-bottom:16px"><div class="prog-fill" style="width:${pct}%;background:${s.color}"></div></div>
      <div style="font-size:12px;font-weight:600;color:var(--text3);margin-bottom:8px;text-transform:uppercase;letter-spacing:.4px">Select Paper</div>
      <div class="paper-item" style="border-left:4px solid ${s.color}" onclick="openPaperSheet('${s.name}','I')">
        <div style="flex:1"><div style="font-size:14px;font-weight:600">${t('i_paper')}</div><div style="font-size:11px;color:var(--text3)">${s.papers.I.chapters.length} chapters</div></div>
        <span style="font-size:13px;font-weight:700;color:${s.color}">${paperProgress(s,'I')}%</span>
        <i class="fa-solid fa-chevron-right chevron"></i>
      </div>
      <div class="paper-item" style="border-left:4px solid ${s.color};margin-bottom:0" onclick="openPaperSheet('${s.name}','II')">
        <div style="flex:1"><div style="font-size:14px;font-weight:600">${t('ii_paper')}</div><div style="font-size:11px;color:var(--text3)">${s.papers.II.chapters.length} chapters</div></div>
        <span style="font-size:13px;font-weight:700;color:${s.color}">${paperProgress(s,'II')}%</span>
        <i class="fa-solid fa-chevron-right chevron"></i>
      </div>
      <div style="margin-top:10px;display:flex;gap:8px">
        <button class="btn btn-blue btn-sm" style="flex:1" onclick="openSheet('sheet-add-chapter')"><i class="fa-solid fa-plus"></i> Add chapter</button>
        <button class="btn btn-ghost btn-sm" style="flex:1" onclick="popSheet()">Back</button>
      </div>`);
  } else {
    openPaperSheet(s.name, null);
  }
}

function openPaperSheet(subName, paperKey) {
  const s = DATA.subjects.find(x => x.name === subName); if (!s) return;
  const chs        = paperKey ? s.papers[paperKey].chapters : s.chapters;
  const paperLabel = paperKey ? (paperKey === 'I' ? t('i_paper') : t('ii_paper')) : '';
  const pct        = chs.length ? Math.round(chs.reduce((a, c) => a + (c.marks || 0), 0) / chs.length) : 0;
  pushSheet(`
    <div style="display:flex;align-items:center;gap:10px;margin-bottom:14px">
      ${s.hasPapers ? `<div class="sheet-back" onclick="popSheet()"><i class="fa-solid fa-chevron-left"></i> ${s.name}</div>` : ''}
      <div style="font-size:17px;font-weight:700;color:${s.color};flex:1">${s.name}${paperLabel ? ' · ' + paperLabel : ''}</div>
    </div>
    <div class="prog-bar" style="height:5px;margin-bottom:12px"><div class="prog-fill" style="width:${pct}%;background:${s.color}"></div></div>
    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px">
      <div style="font-size:11px;font-weight:600;color:var(--text3);text-transform:uppercase">${t('chapters')} (${chs.length})</div>
      <button class="btn btn-blue btn-sm" onclick="openAddChapterHere('${subName}','${paperKey||''}')"><i class="fa-solid fa-plus"></i> Add</button>
    </div>
    ${chs.length === 0 ? `<div class="empty"><i class="fa-regular fa-folder-open"></i><div class="empty-title">No chapters yet</div><div class="empty-sub">Tap + Add to get started</div></div>` : ''}
    <div id="chapter-list-inner">
      ${chs.map((c, i) => chapterRowHTML(c, i, subName, paperKey, s.color)).join('')}
    </div>`);
}

function chapterRowHTML(c, i, subName, paperKey, color) {
  const statusBadge = {
    pending: `<span class="badge badge-gray"  onclick="cycleChapterStatus('${subName}','${paperKey||''}',${i})">${t('pending')}</span>`,
    active:  `<span class="badge badge-blue"  onclick="cycleChapterStatus('${subName}','${paperKey||''}',${i})">${t('active')}</span>`,
    done:    `<span class="badge badge-green" onclick="cycleChapterStatus('${subName}','${paperKey||''}',${i})">${t('done')}</span>`
  };
  return `<div style="background:var(--bg);border-radius:10px;padding:10px 12px;margin-bottom:8px">
    <div class="row" style="margin-bottom:6px">
      <div style="flex:1">
        <div style="font-size:13px;font-weight:500">${c.name}</div>
        <div style="font-size:11px;color:var(--text3);margin-top:2px">${t('marks')}: ${c.marks||0}/100</div>
      </div>
      ${statusBadge[c.status || 'pending']}
      <button class="btn btn-ghost btn-sm" style="padding:4px 8px;min-height:30px;margin-left:4px" onclick="openEditChapter('${subName}','${paperKey||''}',${i})"><i class="fa-solid fa-pen" style="font-size:11px"></i></button>
      <button class="btn btn-red btn-sm"   style="padding:4px 8px;min-height:30px;margin-left:2px" onclick="deleteChapter('${subName}','${paperKey||''}',${i})"><i class="fa-solid fa-trash" style="font-size:11px"></i></button>
    </div>
    <div class="prog-bar"><div class="prog-fill" style="width:${c.marks||0}%;background:${color}"></div></div>
  </div>`;
}

function openAddChapterHere(subName, paperKey) {
  _sheetStack.push(document.getElementById('sheet-content').innerHTML);
  document.getElementById('sheet-content').innerHTML = sheetHTML('sheet-add-chapter');
  setTimeout(() => {
    const sel = document.getElementById('ch-subject'); if (sel) sel.value = subName;
    const pSel = document.getElementById('ch-paper'); if (pSel && paperKey) pSel.value = paperKey;
    const pr = document.getElementById('ch-paper-row');
    const s  = DATA.subjects.find(x => x.name === subName);
    if (pr) pr.style.display = (s && s.hasPapers) ? 'block' : 'none';
  }, 50);
}

function openEditChapter(subName, paperKey, idx) {
  const chs = getChaptersRef(subName, paperKey); if (!chs) return;
  const c   = chs[idx]; if (!c) return;
  _sheetStack.push(document.getElementById('sheet-content').innerHTML);
  document.getElementById('sheet-content').innerHTML = `
    <div class="sheet-back" onclick="popSheet()"><i class="fa-solid fa-chevron-left"></i> Back</div>
    <div class="sheet-title">Edit Chapter</div>
    <label style="font-size:12px;color:var(--text3);display:block;margin-bottom:4px">Chapter name</label>
    <input class="inp" id="ec-name" style="margin-bottom:10px" value="${c.name}">
    <label style="font-size:12px;color:var(--text3);display:block;margin-bottom:4px">${t('marks')} (0–100)</label>
    <input class="inp" type="number" min="0" max="100" id="ec-marks" style="margin-bottom:4px" value="${c.marks||0}">
    <input type="range" min="0" max="100" id="ec-slider" class="marks-slider" value="${c.marks||0}" oninput="document.getElementById('ec-marks').value=this.value">
    <label style="font-size:12px;color:var(--text3);display:block;margin-bottom:4px;margin-top:10px">Status</label>
    <select class="inp" style="margin-bottom:14px" id="ec-status">
      <option value="pending" ${c.status==='pending'?'selected':''}>Pending</option>
      <option value="active"  ${c.status==='active' ?'selected':''}>Active</option>
      <option value="done"    ${c.status==='done'   ?'selected':''}>Done</option>
    </select>
    <button class="btn btn-blue" style="width:100%" onclick="saveEditChapter('${subName}','${paperKey||''}',${idx})"><i class="fa-solid fa-floppy-disk"></i> Save</button>`;
  setTimeout(() => {
    const slider = document.getElementById('ec-slider'), marks = document.getElementById('ec-marks');
    if (slider && marks) marks.addEventListener('input', () => slider.value = marks.value);
  }, 50);
}

/* ── Skill sheets ── */
function openSkillSheet(name) {
  const sk = DATA.skills.find(x => x.name === name);
  if (!sk || sk.comingSoon) return;
  const pct = skillProgress(sk); const els = skillElements(sk);
  pushSheet(`
    <div class="sheet-title" style="color:${sk.color}">${sk.name}</div>
    <div class="row" style="gap:10px;margin-bottom:12px">
      <div style="flex:1;background:var(--bg);border-radius:10px;padding:10px;text-align:center"><div style="font-size:20px;font-weight:700;color:${sk.color}">${pct}%</div><div style="font-size:10px;color:var(--text3)">Progress</div></div>
      <div style="flex:1;background:var(--bg);border-radius:10px;padding:10px;text-align:center"><div style="font-size:20px;font-weight:700;color:var(--green)">${els.filter(e=>e.status==='done').length}</div><div style="font-size:10px;color:var(--text3)">Done</div></div>
      <div style="flex:1;background:var(--bg);border-radius:10px;padding:10px;text-align:center"><div style="font-size:20px;font-weight:700;color:var(--text3)">${els.length}</div><div style="font-size:10px;color:var(--text3)">Total</div></div>
    </div>
    <div class="prog-bar" style="height:6px;margin-bottom:16px"><div class="prog-fill" style="width:${pct}%;background:${sk.color}"></div></div>
    <div style="font-size:12px;font-weight:600;color:var(--text3);margin-bottom:8px;text-transform:uppercase;letter-spacing:.4px">Select Part</div>
    ${sk.parts.map(p => `<div class="paper-item" style="border-left:4px solid ${sk.color}" onclick="openPartSheet('${sk.name}','${p.id}')">
      <div style="flex:1"><div style="font-size:14px;font-weight:600">${p.name}</div><div style="font-size:11px;color:var(--text3)">${p.elements.length} elements</div></div>
      <span style="font-size:13px;font-weight:700;color:${sk.color}">${partProgress(p)}%</span>
      <i class="fa-solid fa-chevron-right chevron"></i>
    </div>`).join('')}
    <div style="margin-top:10px;display:flex;gap:8px">
      <button class="btn btn-blue btn-sm" style="flex:1" onclick="openSheet('sheet-add-skill-el')"><i class="fa-solid fa-plus"></i> Add element</button>
      <button class="btn btn-ghost btn-sm" style="flex:1" onclick="popSheet()">Back</button>
    </div>`);
}

function openPartSheet(skName, partId) {
  const sk   = DATA.skills.find(x => x.name === skName); if (!sk) return;
  const part = sk.parts.find(p => p.id === partId); if (!part) return;
  const pct  = partProgress(part);
  pushSheet(`
    <div style="display:flex;align-items:center;gap:10px;margin-bottom:14px">
      <div class="sheet-back" onclick="popSheet()"><i class="fa-solid fa-chevron-left"></i> ${sk.name}</div>
    </div>
    <div style="font-size:17px;font-weight:700;color:${sk.color};margin-bottom:8px">${part.name}</div>
    <div class="prog-bar" style="height:5px;margin-bottom:12px"><div class="prog-fill" style="width:${pct}%;background:${sk.color}"></div></div>
    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px">
      <div style="font-size:11px;font-weight:600;color:var(--text3);text-transform:uppercase">Elements (${part.elements.length})</div>
      <button class="btn btn-blue btn-sm" onclick="openSheet('sheet-add-skill-el')"><i class="fa-solid fa-plus"></i> Add</button>
    </div>
    ${part.elements.length === 0 ? `<div class="empty"><i class="fa-regular fa-folder-open"></i><div class="empty-title">No elements yet</div><div class="empty-sub">Tap + Add to get started</div></div>` : ''}
    ${part.elements.map((e, i) => elRowHTML(e, i, skName, partId, sk.color)).join('')}`);
}

function elRowHTML(e, i, skName, partId, color) {
  const sb = {
    pending: `<span class="badge badge-gray"  onclick="cycleElStatus('${skName}','${partId}',${i})">${t('pending')}</span>`,
    active:  `<span class="badge badge-blue"  onclick="cycleElStatus('${skName}','${partId}',${i})">${t('active')}</span>`,
    done:    `<span class="badge badge-green" onclick="cycleElStatus('${skName}','${partId}',${i})">${t('done')}</span>`
  };
  return `<div style="background:var(--bg);border-radius:10px;padding:10px 12px;margin-bottom:8px">
    <div class="row" style="margin-bottom:6px">
      <div style="flex:1"><div style="font-size:13px;font-weight:500">${e.name}</div><div style="font-size:11px;color:var(--text3);margin-top:2px">${t('marks')}: ${e.marks||0}/100</div></div>
      ${sb[e.status || 'pending']}
      <button class="btn btn-ghost btn-sm" style="padding:4px 8px;min-height:30px;margin-left:4px" onclick="openEditEl('${skName}','${partId}',${i})"><i class="fa-solid fa-pen" style="font-size:11px"></i></button>
      <button class="btn btn-red btn-sm"   style="padding:4px 8px;min-height:30px;margin-left:2px" onclick="deleteEl('${skName}','${partId}',${i})"><i class="fa-solid fa-trash" style="font-size:11px"></i></button>
    </div>
    <div class="prog-bar"><div class="prog-fill" style="width:${e.marks||0}%;background:${color}"></div></div>
  </div>`;
}

function openEditEl(skName, partId, idx) {
  const els = getElsRef(skName, partId); if (!els) return;
  const e   = els[idx]; if (!e) return;
  _sheetStack.push(document.getElementById('sheet-content').innerHTML);
  document.getElementById('sheet-content').innerHTML = `
    <div class="sheet-back" onclick="popSheet()"><i class="fa-solid fa-chevron-left"></i> Back</div>
    <div class="sheet-title">Edit Element</div>
    <label style="font-size:12px;color:var(--text3);display:block;margin-bottom:4px">Element name</label>
    <input class="inp" id="ee-name" style="margin-bottom:10px" value="${e.name}">
    <label style="font-size:12px;color:var(--text3);display:block;margin-bottom:4px">${t('marks')} (0–100)</label>
    <input class="inp" type="number" min="0" max="100" id="ee-marks" style="margin-bottom:4px" value="${e.marks||0}">
    <input type="range" min="0" max="100" id="ee-slider" class="marks-slider" value="${e.marks||0}" oninput="document.getElementById('ee-marks').value=this.value">
    <label style="font-size:12px;color:var(--text3);display:block;margin-bottom:4px;margin-top:10px">Status</label>
    <select class="inp" style="margin-bottom:14px" id="ee-status">
      <option value="pending" ${e.status==='pending'?'selected':''}>Pending</option>
      <option value="active"  ${e.status==='active' ?'selected':''}>Active</option>
      <option value="done"    ${e.status==='done'   ?'selected':''}>Done</option>
    </select>
    <button class="btn btn-blue" style="width:100%" onclick="saveEditEl('${skName}','${partId}',${idx})"><i class="fa-solid fa-floppy-disk"></i> Save</button>`;
  setTimeout(() => {
    const sl = document.getElementById('ee-slider'), mk = document.getElementById('ee-marks');
    if (sl && mk) mk.addEventListener('input', () => sl.value = mk.value);
  }, 50);
}

/* ── Static sheet HTML builder ── */
function sheetHTML(id) {
  const sheets = {
    'sheet-weekly': `
      <div class="sheet-title">Weekly Review</div>
      <label style="font-size:12px;color:var(--text3);display:block;margin-bottom:4px">What improved this week?</label>
      <textarea class="inp" style="height:70px;margin-bottom:10px" id="sw-improved" placeholder="e.g. Got better at Statistics…"></textarea>
      <label style="font-size:12px;color:var(--text3);display:block;margin-bottom:4px">What failed or was missed?</label>
      <textarea class="inp" style="height:70px;margin-bottom:10px" id="sw-failed"   placeholder="e.g. Didn't finish BOM chapter…"></textarea>
      <label style="font-size:12px;color:var(--text3);display:block;margin-bottom:4px">Plan for next week</label>
      <textarea class="inp" style="height:70px;margin-bottom:14px" id="sw-plan"     placeholder="e.g. Focus on Accounting + mock test…"></textarea>
      <button class="btn btn-blue" style="width:100%" onclick="saveWeeklyReview()"><i class="fa-solid fa-floppy-disk"></i> Save review</button>`,

    'sheet-add-chapter': `
      <div class="sheet-title">${t('add_chapter')}</div>
      <label style="font-size:12px;color:var(--text3);display:block;margin-bottom:4px">Subject</label>
      <select class="inp" style="margin-bottom:10px" id="ch-subject">${DATA.subjects.map(s => `<option>${s.name}</option>`).join('')}</select>
      <div id="ch-paper-row" style="margin-bottom:10px">
        <label style="font-size:12px;color:var(--text3);display:block;margin-bottom:4px">Paper</label>
        <select class="inp" id="ch-paper"><option value="I">${t('i_paper')}</option><option value="II">${t('ii_paper')}</option></select>
      </div>
      <label style="font-size:12px;color:var(--text3);display:block;margin-bottom:4px">Chapter name</label>
      <input class="inp" style="margin-bottom:10px" id="ch-name" placeholder="e.g. Depreciation">
      <label style="font-size:12px;color:var(--text3);display:block;margin-bottom:4px">${t('marks')} (0–100)</label>
      <input class="inp" type="number" min="0" max="100" style="margin-bottom:10px" id="ch-marks" placeholder="0" value="0">
      <label style="font-size:12px;color:var(--text3);display:block;margin-bottom:4px">Status</label>
      <select class="inp" style="margin-bottom:14px" id="ch-status">
        <option value="pending">${t('pending')}</option>
        <option value="active">${t('active')}</option>
        <option value="done">${t('done')}</option>
      </select>
      <button class="btn btn-blue" style="width:100%" onclick="addChapter()"><i class="fa-solid fa-plus"></i> ${t('add_chapter')}</button>
      <script>(function(){const sel=document.getElementById('ch-subject');const pr=document.getElementById('ch-paper-row');function chk(){const s=DATA.subjects.find(x=>x.name===sel.value);pr.style.display=s&&s.hasPapers?'block':'none';}sel.addEventListener('change',chk);chk();})()\x3c/script>`,

    'sheet-add-skill-el': `
      <div class="sheet-title">${t('add_el')}</div>
      <label style="font-size:12px;color:var(--text3);display:block;margin-bottom:4px">Skill</label>
      <select class="inp" style="margin-bottom:10px" id="el-skill">${DATA.skills.filter(s=>!s.comingSoon).map(s=>`<option>${s.name}</option>`).join('')}</select>
      <label style="font-size:12px;color:var(--text3);display:block;margin-bottom:4px">Part</label>
      <select class="inp" style="margin-bottom:10px" id="el-part"></select>
      <label style="font-size:12px;color:var(--text3);display:block;margin-bottom:4px">Element name</label>
      <input class="inp" style="margin-bottom:10px" id="el-name" placeholder="e.g. Keyframing">
      <label style="font-size:12px;color:var(--text3);display:block;margin-bottom:4px">${t('marks')} (0–100)</label>
      <input class="inp" type="number" min="0" max="100" style="margin-bottom:10px" id="el-marks" placeholder="0" value="0">
      <label style="font-size:12px;color:var(--text3);display:block;margin-bottom:4px">Status</label>
      <select class="inp" style="margin-bottom:14px" id="el-status">
        <option value="pending">${t('pending')}</option>
        <option value="active">${t('active')}</option>
        <option value="done">${t('done')}</option>
      </select>
      <button class="btn btn-blue" style="width:100%" onclick="addSkillElement()"><i class="fa-solid fa-plus"></i> Add element</button>
      <script>(function(){const ss=document.getElementById('el-skill');const sp=document.getElementById('el-part');function up(){const sk=DATA.skills.find(x=>x.name===ss.value);sp.innerHTML=sk?sk.parts.map(p=>'<option value="'+p.id+'">'+p.name+'</option>').join(''):'<option>No parts</option>';}ss.addEventListener('change',up);up();})()\x3c/script>`,

    'sheet-add-card': `
      <div class="sheet-title">Add to Cards</div>
      <div style="display:flex;gap:8px;margin-bottom:12px">
        <button class="pill active" onclick="switchCT('flash',this)">Flashcard</button>
        <button class="pill" onclick="switchCT('formula',this)">Formula</button>
        <button class="pill" onclick="switchCT('note',this)">Note</button>
      </div>
      <label style="font-size:12px;color:var(--text3);display:block;margin-bottom:4px">Subject</label>
      <select class="inp" style="margin-bottom:10px" id="ac-sub">${DATA.subjects.map(s=>`<option>${s.name}</option>`).join('')}</select>
      <label style="font-size:12px;color:var(--text3);display:block;margin-bottom:4px">Question / Title</label>
      <input class="inp" style="margin-bottom:10px" id="ac-q" placeholder="e.g. What is depreciation?">
      <label style="font-size:12px;color:var(--text3);display:block;margin-bottom:4px">Answer / Content</label>
      <textarea class="inp" style="height:80px;margin-bottom:14px" id="ac-a" placeholder="e.g. Decrease in asset value…"></textarea>
      <button class="btn btn-blue" style="width:100%" onclick="saveCustomCard()"><i class="fa-solid fa-plus"></i> Save card</button>`,

    'sheet-formulas': `
      <div class="sheet-title">Formulas</div>
      ${[
        {sub:'Accounting',f:'Assets = Liabilities + Capital'},
        {sub:'Accounting',f:'Net Profit = Revenue − Expenses'},
        {sub:'Accounting',f:'Gross Profit = Revenue − COGS'},
        {sub:'Statistics', f:'Mean = Σx ÷ n'},
        {sub:'Statistics', f:'SD = √[Σ(x−μ)² ÷ n]'},
        {sub:'Statistics', f:'Variance = SD²'},
        {sub:'ICT',f:'Bandwidth = Data ÷ Time'},
        {sub:'ICT',f:'Binary: 2⁷+2⁶+…+2⁰'}
      ].map(i=>`<div class="card card-sm" style="margin:0 0 8px"><div style="font-size:10px;color:var(--text3);margin-bottom:3px">${i.sub}</div><div style="font-family:monospace;font-size:13px;font-weight:600">${i.f}</div></div>`).join('')}
      <button class="btn btn-ghost" style="width:100%;margin-top:4px" onclick="openSheet('sheet-add-card')"><i class="fa-solid fa-plus"></i> Add formula</button>`,

    'sheet-notes': `
      <div class="sheet-title">Cornell Notes</div>
      <div style="background:var(--bg);border-radius:12px;padding:12px;font-size:12px;margin-bottom:10px">
        <div style="display:grid;grid-template-columns:90px 1fr;gap:8px;min-height:80px">
          <div style="border-right:.5px solid var(--border);padding-right:8px"><div style="font-weight:600;color:var(--text3);font-size:10px;text-transform:uppercase;margin-bottom:4px">Cue</div><div>What is depreciation?</div></div>
          <div><div style="font-weight:600;color:var(--text3);font-size:10px;text-transform:uppercase;margin-bottom:4px">Notes</div><div>Loss of value of a fixed asset over time. Types: straight line, reducing balance.</div></div>
        </div>
        <div style="border-top:.5px solid var(--border);padding-top:8px;margin-top:8px"><div style="font-weight:600;color:var(--text3);font-size:10px;text-transform:uppercase;margin-bottom:4px">Summary</div><div>Depreciation reduces book value annually. Used in profit calculation.</div></div>
      </div>
      <button class="btn btn-ghost" style="width:100%" onclick="openSheet('sheet-add-card')"><i class="fa-solid fa-plus"></i> Add note</button>`,

    'sheet-dyk': `
      <div class="sheet-title">Did You Know?</div>
      ${['Accounting was first formalised by Luca Pacioli in 1494 (Father of Accounting).','The word "Statistics" comes from German "Statistik" meaning state data.','The first web browser was "WorldWideWeb" created by Tim Berners-Lee in 1990.','Bangladesh ranks among the top garment exporters globally.','BODMAS = Brackets, Orders, Division, Multiplication, Addition, Subtraction.','RAM is volatile memory — data is lost when power is off.','The 4 Ps of marketing: Product, Price, Place, Promotion.']
        .map(f=>`<div class="alert-card alert-info" style="margin:0 0 8px"><div style="font-size:12px">💡 ${f}</div></div>`).join('')}`,

    'sheet-add-source': `
      <div class="sheet-title">Add web source</div>
      <input class="inp" style="margin-bottom:14px" placeholder="e.g. exambd.net" id="new-source">
      <button class="btn btn-blue" style="width:100%" onclick="addSource()"><i class="fa-solid fa-plus"></i> Add source</button>`,

    'sheet-pdf': `
      <div class="sheet-title">Upload PDF</div>
      <div style="position:relative;border:2px dashed var(--border);border-radius:12px;padding:32px;text-align:center;color:var(--text3);margin-bottom:14px">
        <i class="fa-solid fa-file-pdf" style="font-size:36px;color:var(--red);margin-bottom:10px;display:block"></i>
        <div style="font-size:14px;font-weight:600;color:var(--text2)">Tap to select PDF</div>
        <div style="font-size:12px;margin-top:4px">HSC books, notes, question papers</div>
        <input type="file" accept=".pdf" style="opacity:0;position:absolute;inset:0" onchange="pdfSelected(this)">
      </div>
      <div style="font-size:12px;color:var(--text3);text-align:center">AI will answer from your uploaded book chapter.</div>`,

    'sheet-biodata': `
      <div class="sheet-title">Edit Biodata</div>
      <label style="font-size:12px;color:var(--text3);display:block;margin-bottom:4px">Full name</label>
      <input class="inp" id="bd-name" style="margin-bottom:10px" placeholder="Your full name">
      <label style="font-size:12px;color:var(--text3);display:block;margin-bottom:4px">Nickname (shown after greeting)</label>
      <input class="inp" id="bd-nick" style="margin-bottom:10px" placeholder="e.g. Rafi">
      <label style="font-size:12px;color:var(--text3);display:block;margin-bottom:4px">College / Institution</label>
      <input class="inp" id="bd-college" style="margin-bottom:10px" placeholder="e.g. Sylhet Government College">
      <label style="font-size:12px;color:var(--text3);display:block;margin-bottom:4px">Phone</label>
      <input class="inp" id="bd-phone" style="margin-bottom:10px" placeholder="+880 …" type="tel">
      <label style="font-size:12px;color:var(--text3);display:block;margin-bottom:4px">Email</label>
      <input class="inp" id="bd-email" style="margin-bottom:10px" placeholder="you@email.com" type="email">
      <label style="font-size:12px;color:var(--text3);display:block;margin-bottom:4px">Location</label>
      <input class="inp" id="bd-location" style="margin-bottom:14px" placeholder="Sylhet, Bangladesh">
      <button class="btn btn-blue" style="width:100%" onclick="saveBiodata()"><i class="fa-solid fa-floppy-disk"></i> Save biodata</button>`,

    'sheet-api-key': `
      <div class="sheet-title">Connect AI Model</div>
      <div class="alert-card alert-info" style="margin-bottom:12px">
        <div class="alert-title">Your key stays on your device</div>
        <div class="alert-sub">Keys are saved in your browser's local storage only — never sent to any server other than the AI provider.</div>
      </div>
      <label style="font-size:12px;color:var(--text3);display:block;margin-bottom:4px">Model</label>
      <select class="inp" style="margin-bottom:10px" id="ak-model">
        <option value="gpt">ChatGPT (OpenAI)</option>
        <option value="gemini">Gemini (Google AI Studio)</option>
        <option value="perp">Perplexity</option>
      </select>
      <label style="font-size:12px;color:var(--text3);display:block;margin-bottom:4px">API Key</label>
      <input class="inp" style="margin-bottom:6px" id="ak-key" placeholder="Paste your API key here" type="password">
      <div style="font-size:11px;color:var(--text3);margin-bottom:14px">Get keys: <a href="https://platform.openai.com" target="_blank" style="color:var(--blue)">OpenAI</a> · <a href="https://aistudio.google.com" target="_blank" style="color:var(--blue)">Google AI Studio</a> · <a href="https://www.perplexity.ai/settings/api" target="_blank" style="color:var(--blue)">Perplexity</a></div>
      <button class="btn btn-blue" style="width:100%" onclick="saveApiKey()"><i class="fa-solid fa-plug"></i> Connect</button>
      <button class="btn btn-red btn-sm" style="width:100%;margin-top:8px" onclick="clearApiKey()"><i class="fa-solid fa-trash"></i> Clear key</button>`
  };
  return sheets[id] || '<p style="color:var(--text3);font-size:13px">Content coming soon.</p>';
}


/* ─────────────────────────────────────────────────
   13. AI CHAT (MULTI-MODEL)
───────────────────────────────────────────────────*/
const modelColors = { claude:'#7c3aed', gpt:'#10a37f', gemini:'#4285f4', perp:'#1c64f2', meta:'#0866ff' };
const modelNames  = { claude:'Claude', gpt:'ChatGPT', gemini:'Gemini', perp:'Perplexity', meta:'Meta AI' };
const modeNames   = { tutor:'Tutor', exam:'Exam evaluator', revision:'Rapid revision', simplify:'Simplify it', deep:'Deep explanation' };
let currentModel = 'claude', currentMode = 'tutor', chatHistory = [];

function selectModel(m, btn) {
  currentModel = m;
  document.querySelectorAll('#ai-model-row .pill').forEach(p => { p.classList.remove('active'); p.style.background=''; p.style.color=''; p.style.borderColor=''; });
  btn.classList.add('active'); btn.style.background = modelColors[m]; btn.style.color = '#fff'; btn.style.borderColor = modelColors[m];

  const kr = document.getElementById('ai-key-row');
  const kl = document.getElementById('ai-key-label');
  const ks = document.getElementById('ai-key-sub');
  const kd = document.getElementById('ai-key-dot');

  if (m === 'claude') { if (kr) kr.style.display = 'none'; }
  else if (m === 'meta') {
    if (kr) kr.style.display = 'flex';
    if (kl) kl.textContent = 'Meta AI — No public API';
    if (ks) ks.textContent = 'Meta AI does not have a public API. Chat will show info.';
    if (kd) kd.className = 'api-dot no';
  } else {
    if (kr) kr.style.display = 'flex';
    const hasKey = DATA.apiKeys[m] && DATA.apiKeys[m].length > 0;
    if (kl) kl.textContent = `${modelNames[m]} API Key`;
    if (ks) ks.textContent = hasKey ? 'Connected — messages sent directly to ' + modelNames[m] : 'Not connected · Tap to add your API key';
    if (kd) kd.className = 'api-dot ' + (hasKey ? 'ok' : 'no');
  }
  const bubble = document.getElementById('chat-messages')?.querySelector('.ai-bubble.ai strong');
  if (bubble) bubble.textContent = `${modelNames[m]} — ${modeNames[currentMode] || 'Tutor'} mode`;
}

function selectMode(m, btn) {
  currentMode = m;
  document.querySelectorAll('#screen-ai .pill-row:nth-child(3) .pill').forEach(p => p.classList.remove('active'));
  btn.classList.add('active');
}

async function sendChat() {
  const input = document.getElementById('chat-input');
  const msg   = input.value.trim(); if (!msg) return;
  input.value = '';
  addBubble(msg, 'user');
  chatHistory.push({ role:'user', content:msg });
  const thinkBubble = addBubble('<div class="spinner"></div>', 'ai');

  try {
    if (currentModel === 'claude') {
      const sys  = `You are a smart HSC study assistant for a Bangladesh Commerce student (HSC 2027). Mode: ${modeNames[currentMode]}. Subjects: Accounting, ICT, Statistics, Bangla, English, BOM, PMM. Be concise, exam-focused, use simple language. Current language preference: ${DATA.settings.language === 'bn' ? 'Bangla (respond in Bangla)' : 'English'}.`;
      const resp = await fetch('https://api.anthropic.com/v1/messages', { method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify({ model:'claude-sonnet-4-20250514', max_tokens:1000, system:sys, messages:chatHistory }) });
      const data = await resp.json();
      const reply = data.content?.map(b => b.text || '').join('') || 'Sorry, could not get a response.';
      chatHistory.push({ role:'assistant', content:reply });
      thinkBubble.innerHTML = reply.replace(/\n/g, '<br>');

    } else if (currentModel === 'gpt') {
      const key = DATA.apiKeys.gpt;
      if (!key) { thinkBubble.textContent = 'Please add your OpenAI API key in the Connect button above.'; return; }
      const resp = await fetch('https://api.openai.com/v1/chat/completions', { method:'POST', headers:{'Content-Type':'application/json','Authorization':'Bearer '+key}, body:JSON.stringify({ model:'gpt-4o', messages:[{role:'system',content:'You are an HSC Commerce study assistant for Bangladesh.'},...chatHistory] }) });
      const data = await resp.json();
      if (data.error) { thinkBubble.textContent = 'OpenAI error: ' + data.error.message; return; }
      const reply = data.choices?.[0]?.message?.content || 'No response.';
      chatHistory.push({ role:'assistant', content:reply });
      thinkBubble.innerHTML = reply.replace(/\n/g, '<br>');

    } else if (currentModel === 'gemini') {
      const key = DATA.apiKeys.gemini;
      if (!key) { thinkBubble.textContent = 'Please add your Google Gemini API key in the Connect button above.'; return; }
      const msgs = chatHistory.map(m => ({ role: m.role === 'assistant' ? 'model' : 'user', parts:[{text:m.content}] }));
      const resp = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${key}`, { method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify({ contents:msgs }) });
      const data = await resp.json();
      if (data.error) { thinkBubble.textContent = 'Gemini error: ' + data.error.message; return; }
      const reply = data.candidates?.[0]?.content?.parts?.[0]?.text || 'No response.';
      chatHistory.push({ role:'assistant', content:reply });
      thinkBubble.innerHTML = reply.replace(/\n/g, '<br>');

    } else if (currentModel === 'perp') {
      const key = DATA.apiKeys.perp;
      if (!key) { thinkBubble.textContent = 'Please add your Perplexity API key in the Connect button above.'; return; }
      const resp = await fetch('https://api.perplexity.ai/chat/completions', { method:'POST', headers:{'Content-Type':'application/json','Authorization':'Bearer '+key}, body:JSON.stringify({ model:'llama-3.1-sonar-small-128k-online', messages:[{role:'system',content:'HSC Commerce study assistant for Bangladesh.'},...chatHistory] }) });
      const data = await resp.json();
      if (data.error) { thinkBubble.textContent = 'Perplexity error: ' + JSON.stringify(data.error); return; }
      const reply = data.choices?.[0]?.message?.content || 'No response.';
      chatHistory.push({ role:'assistant', content:reply });
      thinkBubble.innerHTML = reply.replace(/\n/g, '<br>');

    } else if (currentModel === 'meta') {
      thinkBubble.textContent = 'Meta AI does not provide a public API. To use Meta AI, visit meta.ai directly. You can continue using Claude, ChatGPT, Gemini, or Perplexity here with their API keys.';
    }
  } catch(e) {
    thinkBubble.textContent = 'Connection error: ' + e.message + '. Check your internet and API key.';
  }

  const area = document.getElementById('chat-messages');
  if (area) area.scrollTop = area.scrollHeight;
}

function addBubble(text, role) {
  const area = document.getElementById('chat-messages');
  const el   = document.createElement('div');
  el.className = 'ai-bubble ' + role;
  el.innerHTML  = text;
  area.appendChild(el);
  area.scrollTop = area.scrollHeight;
  return el;
}

function saveApiKey() {
  const model = document.getElementById('ak-model')?.value;
  const key   = document.getElementById('ak-key')?.value?.trim();
  if (!model || !key) return;
  DATA.apiKeys[model] = key; saveData(); closeSheet();
  const btn = document.getElementById('m-' + model);
  if (btn) selectModel(model, btn);
}

function clearApiKey() {
  const model = document.getElementById('ak-model')?.value; if (!model) return;
  DATA.apiKeys[model] = ''; saveData(); closeSheet();
}

function connectGoogle() {
  const status = document.getElementById('google-status');
  const btn    = document.getElementById('google-btn');
  if (status) status.textContent = 'Sync notes & history (configure Google OAuth to enable)';
  if (btn)    btn.textContent    = 'Sync';
  alert('Google Sync requires OAuth configuration. This feature is ready to activate once you add a Google Client ID to the app settings.');
}


/* ─────────────────────────────────────────────────
   14. SOURCES
───────────────────────────────────────────────────*/
function addSource() {
  const v = document.getElementById('new-source')?.value?.trim();
  if (v) { DATA.sources.push(v); closeSheet(); renderSources(); saveData(); }
}

function removeSource(i) {
  DATA.sources.splice(i, 1); renderSources(); saveData();
}


/* ─────────────────────────────────────────────────
   15. BIODATA & PROFILE
───────────────────────────────────────────────────*/
function prefillBiodata() {
  setTimeout(() => {
    const b = DATA.profile;
    const fields = { name:'bd-name', nickname:'bd-nick', college:'bd-college', phone:'bd-phone', email:'bd-email', location:'bd-location' };
    Object.entries(fields).forEach(([key, id]) => {
      const el = document.getElementById(id); if (el) el.value = b[key] || '';
    });
  }, 50);
}

function saveBiodata() {
  const g = id => document.getElementById(id)?.value || '';
  DATA.profile.name     = g('bd-name');
  DATA.profile.nickname = g('bd-nick');
  DATA.profile.college  = g('bd-college');
  DATA.profile.phone    = g('bd-phone');
  DATA.profile.email    = g('bd-email');
  DATA.profile.location = g('bd-location') || 'Sylhet, Bangladesh';
  const name = DATA.profile.name;
  if (name) {
    setText('prof-name', name);
    setText('av-letter', name[0].toUpperCase());
    setText('prof-sub', (DATA.profile.college || 'HSC-27 Commerce') + ' · ' + (DATA.profile.location || 'Sylhet'));
  }
  saveData(); closeSheet(); tick();
}

function saveWeeklyReview() {
  DATA.weeklyReview = {
    improved: document.getElementById('sw-improved')?.value,
    failed:   document.getElementById('sw-failed')?.value,
    plan:     document.getElementById('sw-plan')?.value,
    date:     new Date().toISOString()
  };
  saveData(); closeSheet();
}

function pdfSelected(input) {
  const file = input?.files?.[0]; if (!file) return;
  closeSheet();
  setTimeout(() => { addBubble(`PDF uploaded: <strong>${file.name}</strong><br>Ask me anything from it!`, 'ai'); goTo('ai'); }, 300);
}


/* ─────────────────────────────────────────────────
   16. DARK MODE
───────────────────────────────────────────────────*/
function toggleDark() {
  const t   = document.getElementById('dark-toggle');
  const on  = t.classList.toggle('on'); t.classList.toggle('off', !on);
  DATA.settings.darkMode = on;
  applyDarkTokens(on);
  drawStudyDonut(); drawSkillsBar();
  saveData();
}

function applyDarkTokens(on) {
  const r = document.documentElement.style;
  if (on) {
    r.setProperty('--bg',    '#1c1c1e'); r.setProperty('--card',   '#2c2c2e');
    r.setProperty('--text',  '#ffffff'); r.setProperty('--text2',  '#ebebf5');
    r.setProperty('--text3', '#aeaeb2'); r.setProperty('--border', '#3a3a3c');
    r.setProperty('--border2','#48484a');
    document.body.style.background = '#000';
    document.querySelectorAll('.status-bar').forEach(sb => sb.style.background = 'rgba(28,28,30,.88)');
    document.querySelectorAll('#bottom-nav').forEach(n  => n.style.background  = 'rgba(28,28,30,.94)');
  } else {
    r.setProperty('--bg',    '#f2f2f7'); r.setProperty('--card',   '#ffffff');
    r.setProperty('--text',  '#1c1c1e'); r.setProperty('--text2',  '#3c3c43');
    r.setProperty('--text3', '#8e8e93'); r.setProperty('--border', '#e5e5ea');
    r.setProperty('--border2','#d1d1d6');
    document.body.style.background = '#f2f2f7';
    document.querySelectorAll('.status-bar').forEach(sb => sb.style.background = '');
    document.querySelectorAll('#bottom-nav').forEach(n  => n.style.background  = '');
  }
}


/* ─────────────────────────────────────────────────
   17. LANGUAGE
───────────────────────────────────────────────────*/
function setLang(lang) {
  DATA.settings.language = lang;
  document.getElementById('lang-en')?.classList.toggle('active', lang === 'en');
  document.getElementById('lang-bn')?.classList.toggle('active', lang === 'bn');
  document.body.classList.toggle('lang-bn', lang === 'bn');
  applyTranslations(); saveData();
}

function applyTranslations() {
  const ids = {
    'nl-home':'home','nl-study':'study','nl-cards':'cards','nl-ai':'ai','nl-me':'me',
    'lbl-insights':'insights','lbl-today-study':'today_study','lbl-skills-today':'skills_today',
    'lbl-subjects':'subjects','lbl-weekly':'weekly','lbl-mistake-bank':'mistake_bank',
    'lbl-streak':'day_streak','lbl-mistake':'mistake_count','lbl-due':'due','lbl-overall':'overall',
    'lbl-add-chapter':'add_chapter','lbl-skills-title':'skills','lbl-study-title':'study',
    'lbl-skill-areas':'skill_areas','lbl-add-el':'add_el','lbl-cards-title':'cards',
    'lbl-fc-session':'fc_session','lbl-ref-boxes':'ref_boxes','lbl-add-card':'add_card',
    'lbl-app-settings':'app','lbl-dark-mode':'dark_mode','lbl-edit-bio':'edit_bio',
    'lbl-language':'language','lbl-study-chart':'study_chart','lbl-skills-chart':'skills_chart'
  };
  Object.entries(ids).forEach(([id, key]) => { const el = document.getElementById(id); if (el) el.textContent = t(key); });
}


/* ─────────────────────────────────────────────────
   18. PWA HELPERS
───────────────────────────────────────────────────*/
let _installPrompt = null;

window.addEventListener('beforeinstallprompt', e => {
  e.preventDefault();
  _installPrompt = e;
  const banner = document.getElementById('install-banner');
  if (banner) banner.classList.add('show');
});

function installApp() {
  if (_installPrompt) {
    _installPrompt.prompt();
    _installPrompt.userChoice.then(() => {
      _installPrompt = null;
      const banner = document.getElementById('install-banner');
      if (banner) banner.classList.remove('show');
    });
  }
}

function dismissInstall() {
  const banner = document.getElementById('install-banner');
  if (banner) banner.classList.remove('show');
}

window.addEventListener('appinstalled', () => {
  const banner = document.getElementById('install-banner');
  if (banner) banner.classList.remove('show');
});


/* ─────────────────────────────────────────────────
   19. BOOT / INIT
───────────────────────────────────────────────────*/
(function boot() {
  // 1. Load persisted data
  loadData();

  // 2. Register service worker
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('sw.js').then(reg => {
      // Check for updates and notify the SW to skip waiting
      reg.addEventListener('updatefound', () => {
        const nw = reg.installing;
        nw.addEventListener('statechange', () => {
          if (nw.state === 'installed' && navigator.serviceWorker.controller) {
            // New SW available — silently activate
            nw.postMessage({ type: 'SKIP_WAITING' });
          }
        });
      });
    }).catch(() => {});
  }

  // 3. Apply saved dark mode
  if (DATA.settings.darkMode) {
    applyDarkTokens(true);
    setTimeout(() => {
      const dt = document.getElementById('dark-toggle');
      if (dt) { dt.classList.remove('off'); dt.classList.add('on'); }
    }, 0);
  }

  // 4. Apply saved language
  if (DATA.settings.language === 'bn') {
    document.body.classList.add('lang-bn');
    setTimeout(() => {
      document.getElementById('lang-bn')?.classList.add('active');
      document.getElementById('lang-en')?.classList.remove('active');
    }, 0);
  }

  // 5. Apply saved profile display
  if (DATA.profile.name) {
    const el = document.getElementById('prof-name'); if (el) el.textContent = DATA.profile.name;
    const av = document.getElementById('av-letter'); if (av) av.textContent = DATA.profile.name[0].toUpperCase();
    const ps = document.getElementById('prof-sub');
    if (ps) ps.textContent = (DATA.profile.college || 'HSC-27 Commerce') + ' · ' + (DATA.profile.location || 'Sylhet');
  }

  // 6. First render
  tick();
  setInterval(tick, 15000);
  renderCardsFilter();
  updateCard();
  renderSources();
  renderAlarms();
  updateStats();
  applyTranslations();

  // 7. Draw charts after DOM settles
  setTimeout(() => { drawStudyDonut(); drawSkillsBar(); }, 120);

  // 8. Streak logic (increment if new day)
  const today     = new Date().toDateString();
  const lastOpen  = localStorage.getItem('lumio_last_open');
  if (lastOpen !== today) {
    localStorage.setItem('lumio_last_open', today);
    if (lastOpen) {
      const diff = (new Date(today) - new Date(lastOpen)) / 86400000;
      DATA.stats.streak = diff === 1 ? (DATA.stats.streak || 0) + 1 : 1;
      saveData();
    }
  }

  // 9. Request notification permission on first alarm enable
  // (called lazily inside toggleAlarm)
})();
