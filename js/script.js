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
    'Systems Analyst',
    'UI/UX Designer',
    'Junior System Analyst',
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
    icon: 'ticket'
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
    icon: 'iot'
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
    icon: 'ml'
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
    icon: 'trophy'
  }
];

const ICONS = {
  ticket: '<path d="M4 8a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v2a2 2 0 0 0 0 4v2a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-2a2 2 0 0 0 0-4V8Z" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/><path d="M14 6v12" stroke="currentColor" stroke-width="1.6" stroke-dasharray="2 2"/>',
  iot: '<rect x="7" y="7" width="10" height="10" rx="1.5" fill="none" stroke="currentColor" stroke-width="1.6"/><path d="M9 3v4M15 3v4M9 17v4M15 17v4M3 9h4M3 15h4M17 9h4M17 15h4" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/>',
  ml: '<path d="M12 21c0-6 4-9 8-10-1 6-4 9-8 10Z" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/><path d="M12 21c0-6-4-9-8-10 1 6 4 9 8 10Z" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/>',
  trophy: '<path d="M8 4h8v4a4 4 0 0 1-8 0V4Z" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/><path d="M8 5H5v2a3 3 0 0 0 3 3M16 5h3v2a3 3 0 0 1-3 3M10 15h4v3h-4zM8 20h8" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/>'
};

(function gallery(){
  const galleryEl = document.getElementById('gallery');
  const filterBar = document.getElementById('filterBar');
  if (!galleryEl) return;

  function cardHTML(p){
    return `
      <article class="g-card reveal in-view" data-category="${p.category}" data-id="${p.id}" tabindex="0" role="button" aria-haspopup="dialog">
        <div class="g-thumb" style="--grad:${p.grad}">
          <svg viewBox="0 0 24 24">${ICONS[p.icon] || ICONS.ticket}</svg>
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
    document.getElementById('modalThumb').style.setProperty('--grad', p.grad);
    document.getElementById('modalThumb').innerHTML = `<svg viewBox="0 0 24 24">${ICONS[p.icon] || ICONS.ticket}</svg>`;
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
