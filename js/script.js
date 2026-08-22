'use strict';

/* ==========================================================================
   Theme toggle
   ========================================================================== */
(function themeInit(){
  const root = document.documentElement;
  const saved = localStorage.getItem('ar-theme');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const initial = saved || (prefersDark ? 'dark' : 'light');
  root.setAttribute('data-theme', initial);

  const toggle = document.getElementById('themeToggle');
  toggle.addEventListener('click', () => {
    const current = root.getAttribute('data-theme');
    const next = current === 'dark' ? 'light' : 'dark';
    root.setAttribute('data-theme', next);
    localStorage.setItem('ar-theme', next);
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
    'Senior Systems Analyst',
    'Enterprise Architect',
    'Cloud Migration Lead',
    'Process Automation Specialist',
    'Data Strategy Consultant'
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
    id: 'core-banking',
    category: 'architecture',
    categoryLabel: 'Enterprise Architecture',
    title: 'Core-Banking Platform Modernization',
    desc: 'Re-architected a 20-year-old core-banking monolith into a modular, API-first platform spanning 12 business units.',
    role: 'Lead Systems Analyst',
    timeline: '14 months',
    impact: '99.98% uptime, 40% faster releases',
    tags: ['TOGAF', 'Microservices', 'API Gateway', 'Oracle'],
    grad: 'linear-gradient(135deg,#2f6fed,#6c4bff)',
    icon: 'architecture'
  },
  {
    id: 'ehr-migration',
    category: 'data',
    categoryLabel: 'Data & BI',
    title: 'HIPAA-Compliant EHR Data Migration',
    desc: 'Directed migration of patient records across a 40-site hospital network with zero data-integrity incidents.',
    role: 'Data Migration Analyst',
    timeline: '9 months',
    impact: '68% faster record retrieval',
    tags: ['HIPAA', 'ETL', 'SQL Server', 'Data Governance'],
    grad: 'linear-gradient(135deg,#17c3b2,#2f6fed)',
    icon: 'data'
  },
  {
    id: 'bi-dashboard',
    category: 'data',
    categoryLabel: 'Data & BI',
    title: 'Enterprise BI &amp; Reporting Suite'.replace('&amp;','&'),
    desc: 'Built a unified Power BI reporting layer consolidating 14 disparate data sources into real-time executive dashboards.',
    role: 'BI Systems Analyst',
    timeline: '5 months',
    impact: '$380K annual reporting savings',
    tags: ['Power BI', 'DAX', 'Data Warehouse', 'SSAS'],
    grad: 'linear-gradient(135deg,#f59e0b,#ef4444)',
    icon: 'chart'
  },
  {
    id: 'cloud-migration',
    category: 'cloud',
    categoryLabel: 'Cloud Infrastructure',
    title: 'Multi-Region AWS Cloud Migration',
    desc: 'Migrated on-prem infrastructure for a logistics network to a multi-region AWS architecture with automated failover.',
    role: 'Cloud Solutions Analyst',
    timeline: '11 months',
    impact: '35% infra cost reduction',
    tags: ['AWS', 'Terraform', 'Kubernetes', 'CI/CD'],
    grad: 'linear-gradient(135deg,#0ea5e9,#22d3ee)',
    icon: 'cloud'
  },
  {
    id: 'disaster-recovery',
    category: 'cloud',
    categoryLabel: 'Cloud Infrastructure',
    title: 'Disaster Recovery &amp; Business Continuity'.replace('&amp;','&'),
    desc: 'Designed a cross-region DR strategy with automated backups and a tested RTO of under 15 minutes.',
    role: 'Infrastructure Analyst',
    timeline: '4 months',
    impact: 'RTO reduced from 6h to 15m',
    tags: ['Azure', 'Backup Automation', 'Runbooks'],
    grad: 'linear-gradient(135deg,#22d3ee,#17c3b2)',
    icon: 'shield'
  },
  {
    id: 'rpa-finance',
    category: 'automation',
    categoryLabel: 'Process Automation',
    title: 'Finance Operations RPA Rollout',
    desc: 'Automated invoice reconciliation and month-end close workflows across finance and procurement teams.',
    role: 'Automation Analyst',
    timeline: '6 months',
    impact: '4,200 manual hours saved / yr',
    tags: ['RPA', 'Python', 'REST APIs', 'Workflow'],
    grad: 'linear-gradient(135deg,#a855f7,#6c4bff)',
    icon: 'automation'
  },
  {
    id: 'warehouse-tracking',
    category: 'automation',
    categoryLabel: 'Process Automation',
    title: 'Warehouse &amp; Fleet Tracking System'.replace('&amp;','&'),
    desc: 'Designed a real-time inventory and fleet-tracking system replacing manual spreadsheets across 18 warehouses.',
    role: 'Business Systems Analyst',
    timeline: '8 months',
    impact: '$1.2M annual overhead cut',
    tags: ['IoT', 'PostgreSQL', 'Dashboards', 'Scripting'],
    grad: 'linear-gradient(135deg,#f97316,#f59e0b)',
    icon: 'truck'
  },
  {
    id: 'soc2-audit',
    category: 'security',
    categoryLabel: 'Security & Compliance',
    title: 'SOC 2 Type II Readiness Program',
    desc: 'Led a company-wide SOC 2 readiness initiative, mapping controls, closing gaps and preparing audit evidence.',
    role: 'Security & Compliance Analyst',
    timeline: '5 months',
    impact: 'Passed audit, zero exceptions',
    tags: ['SOC 2', 'Risk Assessment', 'IAM', 'Policy'],
    grad: 'linear-gradient(135deg,#ef4444,#f97316)',
    icon: 'security'
  },
  {
    id: 'iam-overhaul',
    category: 'security',
    categoryLabel: 'Security & Compliance',
    title: 'Enterprise Identity &amp; Access Overhaul'.replace('&amp;','&'),
    desc: 'Consolidated fragmented identity systems into a unified SSO / IAM model with role-based access control.',
    role: 'Security Systems Analyst',
    timeline: '7 months',
    impact: '60% fewer access-related tickets',
    tags: ['SSO', 'RBAC', 'Okta', 'Active Directory'],
    grad: 'linear-gradient(135deg,#6c4bff,#ef4444)',
    icon: 'key'
  },
  {
    id: 'erp-rollout',
    category: 'architecture',
    categoryLabel: 'Enterprise Architecture',
    title: 'Global ERP Rollout & Integration',
    desc: 'Managed requirements and integration architecture for a phased SAP rollout across five country operations.',
    role: 'Lead Business Analyst',
    timeline: '18 months',
    impact: 'On-time, on-budget across 5 sites',
    tags: ['SAP', 'Integration', 'Change Mgmt', 'UML'],
    grad: 'linear-gradient(135deg,#2f6fed,#17c3b2)',
    icon: 'architecture'
  },
  {
    id: 'data-lake',
    category: 'data',
    categoryLabel: 'Data & BI',
    title: 'Enterprise Data Lake Foundation',
    desc: 'Architected a governed data lake on Azure to unify analytics across marketing, sales and operations.',
    role: 'Data Architecture Analyst',
    timeline: '10 months',
    impact: '3x faster analytics turnaround',
    tags: ['Azure Data Lake', 'Data Governance', 'Spark'],
    grad: 'linear-gradient(135deg,#17c3b2,#0ea5e9)',
    icon: 'data'
  },
  {
    id: 'incident-response',
    category: 'security',
    categoryLabel: 'Security & Compliance',
    title: 'Incident Response Framework',
    desc: 'Built an incident classification, escalation and response framework adopted across the technology org.',
    role: 'Security Analyst',
    timeline: '3 months',
    impact: 'Mean response time cut 55%',
    tags: ['ISO 27001', 'Runbooks', 'SIEM'],
    grad: 'linear-gradient(135deg,#ef4444,#a855f7)',
    icon: 'shield'
  }
];

const ICONS = {
  architecture: '<path d="M4 5h16v10H4z" fill="none" stroke="currentColor" stroke-width="1.6"/><path d="M9 20h6M12 15v5" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/>',
  data: '<ellipse cx="12" cy="6" rx="7.5" ry="3" fill="none" stroke="currentColor" stroke-width="1.6"/><path d="M4.5 6v6c0 1.7 3.4 3 7.5 3s7.5-1.3 7.5-3V6M4.5 12v6c0 1.7 3.4 3 7.5 3s7.5-1.3 7.5-3v-6" fill="none" stroke="currentColor" stroke-width="1.6"/>',
  chart: '<path d="M4 19V5m5 14v-9m5 9V9m5 10V4" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/>',
  cloud: '<path d="M7 17.5a4.5 4.5 0 0 1-.5-8.97A5.5 5.5 0 0 1 17.4 8.1 4 4 0 0 1 17 16H7Z" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/>',
  shield: '<path d="M12 3 4 7v5c0 4.6 3.2 7.6 8 9 4.8-1.4 8-4.4 8-9V7l-8-4Z" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/>',
  automation: '<path d="M8 9l-4 3 4 3m8-6 4 3-4 3M13.5 5 10.5 19" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/>',
  truck: '<path d="M3 6h11v10H3zM14 10h4l3 3v3h-7z" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/><circle cx="7.5" cy="18" r="1.7" fill="none" stroke="currentColor" stroke-width="1.6"/><circle cx="17.5" cy="18" r="1.7" fill="none" stroke="currentColor" stroke-width="1.6"/>',
  security: '<path d="M12 3 4 7v5c0 4.6 3.2 7.6 8 9 4.8-1.4 8-4.4 8-9V7l-8-4Z" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/><path d="m9 12 2 2 4-4" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/>',
  key: '<circle cx="8" cy="15" r="3.4" fill="none" stroke="currentColor" stroke-width="1.6"/><path d="m10.4 12.6 8.1-8.1M16 6l2 2M18.5 3.5l2 2" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/>'
};

(function gallery(){
  const galleryEl = document.getElementById('gallery');
  const filterBar = document.getElementById('filterBar');
  if (!galleryEl) return;

  function cardHTML(p){
    return `
      <article class="g-card reveal in-view" data-category="${p.category}" data-id="${p.id}" tabindex="0" role="button" aria-haspopup="dialog">
        <div class="g-thumb" style="--grad:${p.grad}">
          <svg viewBox="0 0 24 24">${ICONS[p.icon] || ICONS.architecture}</svg>
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
    document.getElementById('modalThumb').innerHTML = `<svg viewBox="0 0 24 24">${ICONS[p.icon] || ICONS.architecture}</svg>`;
    document.getElementById('modalCategory').textContent = p.categoryLabel;
    document.getElementById('modalTitle').textContent = p.title;
    document.getElementById('modalDesc').textContent = p.desc + ' This engagement involved close collaboration with stakeholders across the organization, structured discovery, and a phased rollout designed to minimize operational risk.';
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
    const to = 'contact@alexanderreed.dev';
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
