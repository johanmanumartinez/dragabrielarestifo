import { GLASS_OVER_VIDEO } from './config.js';

function measureFPS(ms = 900) {
  return new Promise(resolve => {
    let f = 0, start = performance.now();
    const tick = () => {
      f++;
      performance.now() - start < ms ? requestAnimationFrame(tick) : resolve(Math.round(f * 1000 / ms));
    };
    requestAnimationFrame(tick);
  });
}

export async function initGlass() {
  if (GLASS_OVER_VIDEO === 'off') { document.documentElement.classList.add('glass-b'); return; }
  if (GLASS_OVER_VIDEO === 'on')  { document.documentElement.classList.add('glass-a'); return; }

  const mem   = navigator.deviceMemory   ?? 4;
  const cores = navigator.hardwareConcurrency ?? 4;
  const mobile = window.innerWidth < 768;

  if (mem <= 1 || cores <= 2) {
    document.documentElement.classList.add('glass-b');
    return;
  }

  const fps = await measureFPS();
  if (fps < 30 || (fps < 45 && mobile)) {
    document.documentElement.classList.add('glass-b');
    // Pausar videos secundarios si fps muy bajo
    if (fps < 30) {
      document.querySelectorAll('video:not(#hero-video)').forEach(v => { v.pause(); v.removeAttribute('autoplay'); });
    }
  } else {
    document.documentElement.classList.add('glass-a');
  }
}
