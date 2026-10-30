import { initGlass }   from './glass.js';
import { initBooking }  from './booking.js';
import { initCarousel } from './carousel.js';
import { track }        from './track.js';
import { WHATSAPP_URL, INSTAGRAM_URL, GOOGLE_MAPS } from './config.js';

// ─── APERTURA ────────────────────────────────────────────────────────────────
function runApertura() {
  const el  = document.getElementById('apertura');
  if (!el) return Promise.resolve();
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    el.remove(); return Promise.resolve();
  }
  const path1 = el.querySelector('#ap-path1');
  const path2 = el.querySelector('#ap-path2');
  const len1  = path1?.getTotalLength?.() ?? 120;
  const len2  = path2?.getTotalLength?.() ?? 140;
  if (path1) { path1.style.strokeDasharray = len1; path1.style.strokeDashoffset = len1; }
  if (path2) { path2.style.strokeDasharray = len2; path2.style.strokeDashoffset = len2; }

  return new Promise(res => {
    requestAnimationFrame(() => {
      if (path1) path1.style.transition = `stroke-dashoffset .7s ease`;
      if (path2) path2.style.transition = `stroke-dashoffset .7s ease .15s`;
      requestAnimationFrame(() => {
        if (path1) path1.style.strokeDashoffset = 0;
        if (path2) path2.style.strokeDashoffset = 0;
      });
    });
    setTimeout(() => el.classList.add('text-in'), 700);
    setTimeout(() => {
      el.classList.add('out');
      setTimeout(() => { el.remove(); res(); }, 500);
    }, 1600);
  });
}

// ─── REVEAL ───────────────────────────────────────────────────────────────────
function initReveal() {
  const obs = new IntersectionObserver(entries => {
    entries.forEach((e, i) => {
      if (e.isIntersecting) {
        setTimeout(() => e.target.classList.add('in'), i * 80);
        obs.unobserve(e.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
  document.querySelectorAll('.reveal').forEach(el => obs.observe(el));
}

// ─── VIDEOS EN PANTALLA ───────────────────────────────────────────────────────
function initVideos() {
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      const v = e.target;
      if (e.isIntersecting) v.play().catch(() => {});
      else { v.pause(); }
    });
  }, { threshold: 0.1 });
  document.querySelectorAll('video[data-autoplay]').forEach(v => {
    v.muted = true;
    obs.observe(v);
  });
}

// ─── HEADER SCROLL ────────────────────────────────────────────────────────────
function initHeader() {
  const header = document.getElementById('site-header');
  if (!header) return;
  window.addEventListener('scroll', () => {
    header.style.top = window.scrollY > 60 ? '10px' : '16px';
  }, { passive: true });
}

// ─── DOCK ─────────────────────────────────────────────────────────────────────
function initDock() {
  const dock = document.getElementById('dock');
  if (!dock) return;
  let lastY = 0;
  window.addEventListener('scroll', () => {
    const y = window.scrollY;
    dock.classList.toggle('hidden', y > lastY && y > 120);
    lastY = y;
  }, { passive: true });

  // Links externos
  dock.querySelector('[data-wa]')?.addEventListener('click', () => track('whatsapp_clic'));
  dock.querySelector('[data-ig]')?.addEventListener('click', () => track('instagram_clic'));
}

// ─── PROCESO — HILO DORADO ────────────────────────────────────────────────────
function initProcess() {
  const line = document.querySelector('.process-line');
  if (!line) return;
  const obs = new IntersectionObserver(entries => {
    if (entries[0].isIntersecting) { line.classList.add('drawn'); obs.disconnect(); }
  }, { threshold: 0.2 });
  obs.observe(line.parentElement);
}

// ─── ABOUT VIDEO ──────────────────────────────────────────────────────────────
function initAboutVideo() {
  const v = document.getElementById('about-video');
  if (!v) return;
  const obs = new IntersectionObserver(entries => {
    if (entries[0].isIntersecting) v.play().catch(() => {});
    else v.pause();
  }, { threshold: 0.2 });
  obs.observe(v);
}

// ─── TRACKING EXTERNO ─────────────────────────────────────────────────────────
function initTracking() {
  document.querySelectorAll('[data-track]').forEach(el => {
    el.addEventListener('click', () => track(el.dataset.track, { label: el.dataset.label }));
  });
}

// ─── LENIS SCROLL SUAVE ──────────────────────────────────────────────────────
async function initLenis() {
  try {
    const { default: Lenis } = await import('https://unpkg.com/lenis@1.1.14/dist/lenis.mjs');
    const lenis = new Lenis({ lerp: 0.08, smoothWheel: true });
    const raf = t => { lenis.raf(t); requestAnimationFrame(raf); };
    requestAnimationFrame(raf);
  } catch(e) { /* sin lenis, scroll nativo igual */ }
}

// ─── INIT ─────────────────────────────────────────────────────────────────────
async function init() {
  await initGlass();
  await runApertura();
  initReveal();
  initVideos();
  initHeader();
  initDock();
  initBooking();
  initCarousel();
  initProcess();
  initAboutVideo();
  initTracking();
  initLenis();
}

document.readyState === 'loading'
  ? document.addEventListener('DOMContentLoaded', init)
  : init();
