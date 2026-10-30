import { GOCELEBR_EMBED, WHATSAPP_URL } from './config.js';
import { track } from './track.js';

function renderEmbed(container) {
  if (GOCELEBR_EMBED) {
    container.innerHTML = `<iframe src="${GOCELEBR_EMBED}" loading="lazy" title="Reservar cita — Dra. Gabriela Restifo"></iframe>`;
  } else {
    container.innerHTML = `
      <div class="booking-fallback">
        <p class="eyebrow" style="color:var(--dorado)">Reservar cita</p>
        <p style="color:rgba(243,235,221,.5);font-size:15px;margin-top:8px">El sistema de turnos estará disponible pronto.</p>
        <a href="${WHATSAPP_URL}" target="_blank" rel="noopener" class="btn-cta" style="margin-top:12px" onclick="track('whatsapp_clic')">Consultar por WhatsApp</a>
      </div>`;
  }
}

export function initBooking() {
  // Embeds inline (hero + sección reserva)
  document.querySelectorAll('.booking-embed').forEach(el => {
    const obs = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting) { renderEmbed(el); obs.disconnect(); }
    }, { threshold: 0.1 });
    obs.observe(el);
  });

  // Panel modal
  const panel   = document.getElementById('booking-panel');
  const backdrop = panel?.querySelector('.backdrop');
  const closeBtn = panel?.querySelector('.panel-close');
  const panelEmbed = panel?.querySelector('.booking-embed');

  function openPanel() {
    if (!panel) return;
    track('calendario_abierto');
    document.body.style.overflow = 'hidden';
    panel.classList.add('open');
    if (panelEmbed && !panelEmbed.hasChildNodes()) renderEmbed(panelEmbed);
  }
  function closePanel() {
    if (!panel) return;
    document.body.style.overflow = '';
    panel.classList.remove('open');
  }

  backdrop?.addEventListener('click', closePanel);
  closeBtn?.addEventListener('click', closePanel);
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closePanel(); });

  // Todos los botones "Reservar cita" que no sean links a #reservar
  document.querySelectorAll('[data-reservar]').forEach(btn => {
    btn.addEventListener('click', e => {
      e.preventDefault();
      track('reservar_clic', { desde: btn.dataset.desde || 'desconocido' });
      const isMobile = window.innerWidth < 768;
      if (isMobile) {
        document.getElementById('booking-calendar')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      } else {
        openPanel();
      }
    });
  });
}
