// Punto único de analítica — conectar después con Meta Pixel o GA4
export function track(event, data = {}) {
  // TODO: window.fbq?.('track', event, data);
  // TODO: window.gtag?.('event', event, data);
  if (location.hostname === 'localhost' || location.hostname === '127.0.0.1') {
    console.log('[track]', event, data);
  }
}
