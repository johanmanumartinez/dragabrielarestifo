const ORBES = {
  '01': 'radial-gradient(ellipse 65% 55% at 65% 50%, rgba(201,161,138,.22) 0%, transparent 70%)',
  '02': 'radial-gradient(ellipse 65% 55% at 65% 50%, rgba(232,213,168,.18) 0%, transparent 70%)',
  '03': 'radial-gradient(ellipse 65% 55% at 65% 50%, rgba(107,74,43,.28) 0%, transparent 70%)',
  '04': 'radial-gradient(ellipse 65% 55% at 65% 50%, rgba(154,91,20,.26) 0%, transparent 70%)',
};

export function initCarousel() {
  const cards  = [...document.querySelectorAll('.treat-card')];
  const videos = document.querySelectorAll('.treat-panel-video');
  const dots   = document.querySelectorAll('.treat-dot');
  const orbe   = document.querySelector('.treatments-orbe');
  let active   = 0;
  let timer    = null;

  function activate(idx) {
    active = idx;
    cards.forEach((c, i) => c.classList.toggle('active', i === idx));
    dots.forEach((d, i)  => d.classList.toggle('active', i === idx));

    videos.forEach((v, i) => {
      if (i === idx) {
        v.style.opacity = '1';
        v.play?.().catch(() => {});
      } else {
        v.style.opacity = '0';
        v.pause?.();
        v.currentTime = 0;
      }
    });

    const num = cards[idx]?.dataset.num;
    if (orbe && num) orbe.style.background = ORBES[num] || '';

    // Reinicia el timer desde esta card
    clearInterval(timer);
    timer = setInterval(() => activate((active + 1) % cards.length), 5000);
  }

  // Click abre esa card y reinicia el timer desde ahí
  cards.forEach((c, i) => c.addEventListener('click', () => activate(i)));
  dots.forEach((d, i)  => d.addEventListener('click', () => activate(i)));

  if (cards.length) activate(0);
}
