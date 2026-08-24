'use strict';

/* ==========================================================================
   Theme toggle
   ========================================================================== */
(function themeInit(){
  const root = document.documentElement;
  const saved = localStorage.getItem('theme');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const initial = saved || (prefersDark ? 'dark' : 'light');
  root.setAttribute('data-theme', initial);

  const toggle = document.getElementById('themeToggle');
  toggle.addEventListener('click', () => {
    const current = root.getAttribute('data-theme');
    const next = current === 'dark' ? 'light' : 'dark';
    root.setAttribute('data-theme', next);
    localStorage.setItem('theme', next);
  });
})();

/* ==========================================================================
   Header scroll state + scroll progress bar
   ========================================================================== */
(function headerScroll(){
  const header = document.getElementById('siteHeader');
  const progress = document.getElementById('progressBar');
  const backToTop = document.getElementById('backToTop');

  function onScroll(){
    const y = window.scrollY || document.documentElement.scrollTop;
    header.classList.toggle('scrolled', y > 12);
    backToTop.classList.toggle('show', y > 480);

    const doc = document.documentElement;
    const height = doc.scrollHeight - doc.clientHeight;
    const pct = height > 0 ? (y / height) * 100 : 0;
    progress.style.width = pct + '%';
  }
  document.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  backToTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
})();

/* ==========================================================================
   Mobile nav
   ========================================================================== */
(function mobileNav(){
  const hamburger = document.getElementById('hamburger');
  const nav = document.getElementById('primaryNav');

  function close(){
    hamburger.classList.remove('open');
    nav.classList.remove('open');
    hamburger.setAttribute('aria-expanded', 'false');
  }

  hamburger.addEventListener('click', () => {
    const open = nav.classList.toggle('open');
    hamburger.classList.toggle('open', open);
    hamburger.setAttribute('aria-expanded', String(open));
  });

  nav.querySelectorAll('[data-nav]').forEach(link => link.addEventListener('click', close));
  document.addEventListener('keydown', e => { if (e.key === 'Escape') close(); });
})();

/* ==========================================================================
   Active nav link on scroll (IntersectionObserver)
   ========================================================================== */
(function activeNav(){
  const links = Array.from(document.querySelectorAll('[data-nav]'));
  const sections = links
    .map(l => document.querySelector(l.getAttribute('href')))
    .filter(Boolean);

  if (!('IntersectionObserver' in window) || !sections.length) return;

  const obs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const id = '#' + entry.target.id;
      links.forEach(l => l.classList.toggle('active', l.getAttribute('href') === id));
    });
  }, { rootMargin: '-40% 0px -55% 0px', threshold: 0 });

  sections.forEach(s => obs.observe(s));
})();

/* ==========================================================================
   Reveal-on-scroll animations
   ========================================================================== */
(function revealOnScroll(){
  const items = document.querySelectorAll('.reveal');
  if (!('IntersectionObserver' in window)) {
    items.forEach(i => i.classList.add('in-view'));
    return;
  }
  const obs = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.14 });
  items.forEach((item, i) => {
    item.style.transitionDelay = ((i % 4) * 70) + 'ms';
    obs.observe(item);
  });
})();

/* ==========================================================================
   Hero typewriter
   ========================================================================== */
(function typewriter(){
  const el = document.getElementById('typewriter');
  if (!el) return;
  const phrases = [
    'Head of IT',
    'Systems Analyst',
    'UI/UX Designer',
    'IT Support Specialist',
    'Machine Learning Enthusiast'
  ];
  let phraseIdx = 0, charIdx = 0, deleting = false;

  function tick(){
    const phrase = phrases[phraseIdx];
    if (!deleting) {
      charIdx++;
      el.textContent = phrase.slice(0, charIdx);
      if (charIdx === phrase.length) {
        deleting = true;
        return setTimeout(tick, 1600);
      }
    } else {
      charIdx--;
      el.textContent = phrase.slice(0, charIdx);
      if (charIdx === 0) {
        deleting = false;
        phraseIdx = (phraseIdx + 1) % phrases.length;
      }
    }
    setTimeout(tick, deleting ? 35 : 65);
  }
  tick();
})();

/* ==========================================================================
   Animated stat counters
   ========================================================================== */
(function statCounters(){
  const stats = document.querySelectorAll('.stat-num');
  if (!stats.length || !('IntersectionObserver' in window)) return;

  function animate(el){
    const target = parseInt(el.getAttribute('data-count'), 10) || 0;
    const duration = 1400;
    const start = performance.now();
    function frame(now){
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.round(eased * target);
      if (progress < 1) requestAnimationFrame(frame);
      else el.textContent = target;
    }
    requestAnimationFrame(frame);
  }

  const obs = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animate(entry.target);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  stats.forEach(s => obs.observe(s));
})();

/* ==========================================================================
   Skill bar fill animation
   ========================================================================== */
(function skillBars(){
  const bars = document.querySelectorAll('.bar-fill');
  if (!bars.length || !('IntersectionObserver' in window)) {
    bars.forEach(b => b.classList.add('animate'));
    return;
  }
  const obs = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animate');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.4 });
  bars.forEach(b => obs.observe(b));
})();

/* ==========================================================================
   Work Gallery — data, render, filter, modal
   ========================================================================== */
const PROJECTS = [
  {
    id: 'primaland',
    category: 'system-analysis',
    categoryLabel: 'System Analysis',
    title: 'Primaland Digital Transformation',
    desc: 'Leading system analysis and project management across Primaland’s flagship initiatives — the MyCozyKos application, cross-divisional system integration, an investor-facing fintech platform, and AI-based dynamic pricing for Villa Hirai Hills.',
    role: 'Head of IT — System Analyst & Project Manager',
    timeline: 'Mar 2026 — Present',
    impact: 'Unified platform spanning MyCozyKos, finance & AI pricing',
    tags: ['MyCozyKos', 'System Integration', 'FinTech', 'AI Pricing'],
    grad: 'linear-gradient(135deg,#6c4bff,#ec4899)',
    accent: '#6c4bff',
    chip: 'IT',
    icon: 'hub',
    photo: 'assets/img/projects/primaland.jpg',
    photoPosition: 'center'
  },
  {
    id: 'toast',
    category: 'system-analysis',
    categoryLabel: 'System Analysis',
    title: 'TOAST — Two-Way Ticketing System',
    desc: 'Designed the UML architecture and UI/UX prototypes for a digital ticketing platform built for Keraton Kasepuhan Cirebon.',
    role: 'System Analyst & UI/UX Designer',
    timeline: 'Jul 2024 – Jul 2025',
    impact: 'Deployed for Keraton Kasepuhan Cirebon w/ PT Curaweda',
    tags: ['UML', 'SRS', 'Figma', 'Admin Module'],
    grad: 'linear-gradient(135deg,#2f6fed,#6c4bff)',
    accent: '#2f6fed',
    chip: 'UML',
    icon: 'ticket',
    photo: 'assets/img/projects/toast.jpg',
    photoPosition: 'center'
  },
  {
    id: 'waste-management',
    category: 'iot',
    categoryLabel: 'IoT & Smart Systems',
    title: 'Smart Waste Management System',
    desc: 'Analyzed system requirements and simulated Raspberry Pi and camera placement for an AI-based (YOLO) waste classification system.',
    role: 'Data & System Analyst',
    timeline: '2024 – 2025',
    impact: 'Automated waste-sorting prototype for Smart Environment research',
    tags: ['YOLO', 'Raspberry Pi', 'IoT', 'Requirements Analysis'],
    grad: 'linear-gradient(135deg,#17c3b2,#0ea5e9)',
    accent: '#0ea5e9',
    chip: 'AI',
    icon: 'iot',
    photo: 'assets/img/projects/waste-management.jpg',
    photoPosition: 'center 40%'
  },
  {
    id: 'tanela',
    category: 'ml',
    categoryLabel: 'Machine Learning',
    title: 'TANELA — Tanah Sejahtera',
    desc: 'Built the data model and system documentation for a machine-learning app classifying soil suitability for BPP Selaawi, Garut.',
    role: 'Machine Learning & System Analyst',
    timeline: 'Student Creativity Program (PKM-PI)',
    impact: 'Funded national student research program',
    tags: ['Machine Learning', 'Data Modeling', 'Documentation'],
    grad: 'linear-gradient(135deg,#22c55e,#84cc16)',
    accent: '#22c55e',
    chip: 'ML',
    icon: 'ml',
    photo: 'assets/img/projects/tanela.jpg',
    photoPosition: 'center'
  },
  {
    id: 'uiux-competition',
    category: 'uiux',
    categoryLabel: 'UI/UX Design',
    title: 'National UI/UX Design Competition',
    desc: 'Designed a mobile app prototype using Design Thinking and UX principles for a social-impact problem statement.',
    role: 'UI/UX Designer',
    timeline: 'Nov 2024',
    impact: '2nd Place — Universitas Sebelas Maret (UNS), national level',
    tags: ['Design Thinking', 'Figma', 'Prototyping'],
    grad: 'linear-gradient(135deg,#f59e0b,#ef4444)',
    accent: '#f59e0b',
    chip: 'UI',
    icon: 'trophy',
    photo: 'assets/img/projects/uiux-competition.jpg',
    photoPosition: 'center'
  }
];

const ICONS = {
  ticket: '<path d="M4 8a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v2a2 2 0 0 0 0 4v2a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-2a2 2 0 0 0 0-4V8Z" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/><path d="M14 6v12" stroke="currentColor" stroke-width="1.6" stroke-dasharray="2 2"/>',
  iot: '<rect x="7" y="7" width="10" height="10" rx="1.5" fill="none" stroke="currentColor" stroke-width="1.6"/><path d="M9 3v4M15 3v4M9 17v4M15 17v4M3 9h4M3 15h4M17 9h4M17 15h4" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/>',
  ml: '<path d="M12 21c0-6 4-9 8-10-1 6-4 9-8 10Z" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/><path d="M12 21c0-6-4-9-8-10 1 6 4 9 8 10Z" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/>',
  trophy: '<path d="M8 4h8v4a4 4 0 0 1-8 0V4Z" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/><path d="M8 5H5v2a3 3 0 0 0 3 3M16 5h3v2a3 3 0 0 1-3 3M10 15h4v3h-4zM8 20h8" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/>',
  hub: '<circle cx="12" cy="12" r="2.6" fill="none" stroke="currentColor" stroke-width="1.6"/><circle cx="5" cy="6" r="2" fill="none" stroke="currentColor" stroke-width="1.6"/><circle cx="19" cy="6" r="2" fill="none" stroke="currentColor" stroke-width="1.6"/><circle cx="5" cy="18" r="2" fill="none" stroke="currentColor" stroke-width="1.6"/><circle cx="19" cy="18" r="2" fill="none" stroke="currentColor" stroke-width="1.6"/><path d="M9.8 10.2 6.6 7.6M14.2 10.2l3.2-2.6M9.8 13.8l-3.2 2.6M14.2 13.8l3.2 2.6" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>'
};

const DEFAULT_ACCENT = '#2f6fed';

(function gallery(){
  const galleryEl = document.getElementById('gallery');
  const filterBar = document.getElementById('filterBar');
  if (!galleryEl) return;

  function sceneSVG(p){
    const accent = p.accent || DEFAULT_ACCENT;
    const chip = p.chip || '';
    const icon = ICONS[p.icon] || ICONS.ticket;
    return `
      <svg class="g-scene" viewBox="0 0 220 140" preserveAspectRatio="xMidYMid meet" aria-hidden="true">
        <!-- monitor / screen -->
        <rect x="30" y="10" width="160" height="76" rx="10" fill="rgba(255,255,255,.14)" stroke="rgba(255,255,255,.35)" stroke-width="1.2"/>
        <circle cx="44" cy="23" r="2.6" fill="rgba(255,255,255,.55)"/>
        <circle cx="53" cy="23" r="2.6" fill="rgba(255,255,255,.4)"/>
        <circle cx="62" cy="23" r="2.6" fill="rgba(255,255,255,.25)"/>
        <rect x="44" y="34" width="80" height="6.5" rx="3.2" fill="rgba(255,255,255,.45)"/>
        <rect x="44" y="47" width="112" height="6.5" rx="3.2" fill="rgba(255,255,255,.26)"/>
        <rect x="44" y="60" width="58" height="6.5" rx="3.2" fill="rgba(255,255,255,.26)"/>
        <rect x="44" y="73" width="90" height="6.5" rx="3.2" fill="rgba(255,255,255,.18)"/>

        <!-- desk -->
        <rect x="14" y="119" width="192" height="6" rx="3" fill="rgba(255,255,255,.3)"/>
        <rect x="96" y="113" width="30" height="6" rx="2" fill="rgba(255,255,255,.5)"/>

        <!-- person, seen from behind, at the desk -->
        <path d="M83 122 Q83 93 110 93 Q137 93 137 122 Z" fill="rgba(255,255,255,.94)"/>
        <circle cx="110" cy="79" r="13.5" fill="rgba(255,255,255,.94)"/>

        ${chip ? `<g>
          <rect x="158" y="9" width="40" height="22" rx="11" fill="rgba(255,255,255,.94)"/>
          <text x="178" y="24" text-anchor="middle" font-family="Sora, sans-serif" font-size="10" font-weight="700" fill="${accent}">${chip}</text>
        </g>` : ''}
        <circle cx="187" cy="112" r="23" fill="#ffffff"/>
        <g style="color:${accent}" transform="translate(174,99) scale(1.1)">${icon}</g>
      </svg>`;
  }

  function photoHTML(p){
    const accent = p.accent || DEFAULT_ACCENT;
    const chip = p.chip || '';
    const pos = p.photoPosition || 'center';
    return `
      <img class="g-photo" src="${p.photo}" alt="${p.title}" loading="lazy" style="object-position:${pos}">
      ${chip ? `<span class="g-photochip" style="color:${accent}">${chip}</span>` : ''}`;
  }

  function cardHTML(p){
    return `
      <article class="g-card reveal in-view" data-category="${p.category}" data-id="${p.id}" tabindex="0" role="button" aria-haspopup="dialog">
        <div class="g-thumb${p.photo ? ' has-photo' : ''}" style="--grad:${p.grad}">
          ${p.photo ? photoHTML(p) : sceneSVG(p)}
          <span class="g-view">
            <svg viewBox="0 0 24 24"><path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7-10-7-10-7Z" fill="none" stroke="currentColor" stroke-width="2"/><circle cx="12" cy="12" r="2.6" fill="none" stroke="currentColor" stroke-width="2"/></svg>
            View Details
          </span>
        </div>
        <div class="g-body">
          <span class="g-cat">${p.categoryLabel}</span>
          <h3>${p.title}</h3>
          <p>${p.desc}</p>
          <div class="g-tags">${p.tags.map(t => `<span>${t}</span>`).join('')}</div>
        </div>
      </article>`;
  }

  galleryEl.innerHTML = PROJECTS.map(cardHTML).join('');

  const cards = Array.from(galleryEl.querySelectorAll('.g-card'));

  function openModal(id){
    const p = PROJECTS.find(x => x.id === id);
    if (!p) return;
    const modalThumb = document.getElementById('modalThumb');
    modalThumb.style.setProperty('--grad', p.grad);
    modalThumb.classList.toggle('has-photo', !!p.photo);
    modalThumb.innerHTML = p.photo
      ? `<img src="${p.photo}" alt="${p.title}" style="object-position:${p.photoPosition || 'center'}">`
      : `<svg viewBox="0 0 24 24">${ICONS[p.icon] || ICONS.ticket}</svg>`;
    document.getElementById('modalCategory').textContent = p.categoryLabel;
    document.getElementById('modalTitle').textContent = p.title;
    document.getElementById('modalDesc').textContent = p.desc;
    document.getElementById('modalRole').textContent = p.role;
    document.getElementById('modalTimeline').textContent = p.timeline;
    document.getElementById('modalImpact').textContent = p.impact;
    document.getElementById('modalTags').innerHTML = p.tags.map(t => `<span>${t}</span>`).join('');

    const overlay = document.getElementById('modalOverlay');
    overlay.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeModal(){
    document.getElementById('modalOverlay').classList.remove('open');
    document.body.style.overflow = '';
  }

  cards.forEach(card => {
    card.addEventListener('click', () => openModal(card.dataset.id));
    card.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openModal(card.dataset.id); }
    });
  });

  document.getElementById('modalClose').addEventListener('click', closeModal);
  document.getElementById('modalOverlay').addEventListener('click', e => {
    if (e.target.id === 'modalOverlay') closeModal();
  });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });

  /* Filtering */
  filterBar.addEventListener('click', e => {
    const btn = e.target.closest('.filter-btn');
    if (!btn) return;

    filterBar.querySelectorAll('.filter-btn').forEach(b => {
      b.classList.remove('active');
      b.setAttribute('aria-selected', 'false');
    });
    btn.classList.add('active');
    btn.setAttribute('aria-selected', 'true');

    const filter = btn.dataset.filter;
    cards.forEach(card => {
      const match = filter === 'all' || card.dataset.category === filter;
      card.classList.toggle('hide', !match);
    });
  });
})();

/* ==========================================================================
   Contact form — client-side validation + mailto handoff
   ========================================================================== */
(function contactForm(){
  const form = document.getElementById('contactForm');
  if (!form) return;

  const fields = ['name', 'email', 'subject', 'message'];
  const note = document.getElementById('formNote');
  const submitBtn = document.getElementById('submitBtn');

  function setError(field, message){
    const group = document.getElementById(field).closest('.form-group');
    const errorEl = form.querySelector(`[data-error-for="${field}"]`);
    if (message) {
      group.classList.add('invalid');
      errorEl.textContent = message;
    } else {
      group.classList.remove('invalid');
      errorEl.textContent = '';
    }
  }

  function validate(){
    let valid = true;
    const values = {};

    fields.forEach(f => { values[f] = form.elements[f].value.trim(); });

    if (!values.name) { setError('name', 'Please enter your name.'); valid = false; }
    else setError('name', '');

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!values.email) { setError('email', 'Please enter your email.'); valid = false; }
    else if (!emailPattern.test(values.email)) { setError('email', 'Please enter a valid email address.'); valid = false; }
    else setError('email', '');

    if (!values.subject) { setError('subject', 'Please add a subject.'); valid = false; }
    else setError('subject', '');

    if (!values.message || values.message.length < 10) {
      setError('message', 'Message should be at least 10 characters.');
      valid = false;
    } else setError('message', '');

    return { valid, values };
  }

  fields.forEach(f => {
    form.elements[f].addEventListener('blur', validate);
    form.elements[f].addEventListener('input', () => {
      if (form.elements[f].closest('.form-group').classList.contains('invalid')) validate();
    });
  });

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    const { valid, values } = validate();

    note.className = 'form-note';
    if (!valid) {
      note.textContent = 'Please fix the highlighted fields and try again.';
      note.classList.add('error');
      return;
    }

    submitBtn.disabled = true;
    submitBtn.querySelector('.btn-label').textContent = 'Sending...';

    // No backend is wired up — this opens the visitor's email client with the
    // message pre-filled, addressed to the contact email below. Replace this
    // with a real API/Formspree/EmailJS call to submit silently instead.
    const to = 'ovasyadira.p@gmail.com';
    const subject = encodeURIComponent(`[Portfolio] ${values.subject}`);
    const body = encodeURIComponent(
      `Name: ${values.name}\nEmail: ${values.email}\n\n${values.message}`
    );

    setTimeout(() => {
      window.location.href = `mailto:${to}?subject=${subject}&body=${body}`;
      submitBtn.disabled = false;
      submitBtn.querySelector('.btn-label').textContent = 'Send Message';
      note.textContent = 'Your email client should now open with the message ready to send.';
      note.classList.add('success');
      form.reset();
    }, 500);
  });
})();

/* ==========================================================================
   Footer year
   ========================================================================== */
document.getElementById('year').textContent = new Date().getFullYear();
