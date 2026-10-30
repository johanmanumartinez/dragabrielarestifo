const ORBES = {
  '01': 'radial-gradient(ellipse 65% 55% at 65% 50%, rgba(201,161,138,.22) 0%, transparent 70%)',
  '02': 'radial-gradient(ellipse 65% 55% at 65% 50%, rgba(232,213,168,.18) 0%, transparent 70%)',
  '03': 'radial-gradient(ellipse 65% 55% at 65% 50%, rgba(107,74,43,.28) 0%, transparent 70%)',
  '04': 'radial-gradient(ellipse 65% 55% at 65% 50%, rgba(154,91,20,.26) 0%, transparent 70%)',
};

export function initCarousel() {
  const cards  = [...document.querySelectorAll('.treat-card')];
  const videos = [...document.querySelectorAll('.treat-panel-video')];
  const dots   = [...document.querySelectorAll('.treat-dot')];
  const orbe   = document.querySelector('.treatments-orbe');
  const tag    = document.getElementById('active-tag');
  let activeCard = 0;
  let curVid     = 0;
  let cardTimer  = null;
  let vidTimer   = null;

  // ── B-roll de videos (ciclo independiente) ──────────────────────────────────
  function nextVideo() {
    videos[curVid].style.opacity = '0';
    videos[curVid].pause?.();
    curVid = (curVid + 1) % videos.length;
    videos[curVid].style.opacity = '1';
    videos[curVid].play?.().catch(() => {});
    if (tag) tag.textContent = videos[curVid].dataset.label || '';
  }

  if (videos.length) {
    videos[0].play?.().catch(() => {});
    vidTimer = setInterval(nextVideo, 4500);
  }

  // ── Cards con timer (ciclo automático) ─────────────────────────────────────
  function activateCard(idx) {
    activeCard = idx;
    cards.forEach((c, i) => c.classList.toggle('active', i === idx));
    dots.forEach((d, i)  => d.classList.toggle('active', i === idx));
    const num = cards[idx]?.dataset.num;
    if (orbe && num) orbe.style.background = ORBES[num] || '';
    clearInterval(cardTimer);
    cardTimer = setInterval(() => activateCard((activeCard + 1) % cards.length), 5000);
  }

  cards.forEach((c, i) => c.addEventListener('click', () => activateCard(i)));
  dots.forEach((d, i)  => d.addEventListener('click', () => activateCard(i)));

  if (cards.length) activateCard(0);
}
