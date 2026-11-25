/**
 * Self-hosted site asset URLs served from `client/public/assets/images/`
 * and resolved relative to Vite's `BASE_URL`.
 */
function resolveBase() {
  const base = import.meta.env.BASE_URL || '/';
  return base.endsWith('/') ? base : `${base}/`;
}

export const ASSET_BASE = `${resolveBase()}assets/images`;

export function asset(path) {
  if (!path) return '';
  if (/^https?:\/\//i.test(path) || path.startsWith('data:')) return path;
  const cleanBase = resolveBase();
  const cleanPath = String(path).replace(/^\/+/, '');
  if (/^(products|assets|jmtc-logo\.jpg)/i.test(cleanPath)) {
    return `${cleanBase}${cleanPath}`;
  }
  return `${ASSET_BASE}/${cleanPath}`;
}

export const UI_ASSETS = {
  call: `${ASSET_BASE}/call.svg`,
  whatsapp: `${ASSET_BASE}/whatsapp.svg`,
};

export const IMAGES = {
  pageHeaderBg: `${ASSET_BASE}/backgrounds/page-header-bg.jpg`,
  footerPattern: `${ASSET_BASE}/pattern/pattern-1.svg`,
  call: UI_ASSETS.call,
  whatsapp: UI_ASSETS.whatsapp,
  sliders: [
    `${ASSET_BASE}/backgrounds/main-slider-2-1.jpg`,
    `${ASSET_BASE}/backgrounds/main-slider-2-2.jpg`,
    `${ASSET_BASE}/backgrounds/main-slider-2-3.jpg`,
  ],
  welcome: [
    `${ASSET_BASE}/resources/welcome-two-img-1.jpg`,
    `${ASSET_BASE}/resources/welcome-two-img-2.jpg`,
  ],
  welcomeBg: `${ASSET_BASE}/backgrounds/welcome-two-bg.svg`,
  trustExpertsBg: `${ASSET_BASE}/backgrounds/trust-experts-bg.jpg`,
  counterPattern: `${ASSET_BASE}/pattern/counter-one-pattern.svg`,
  projectsImg: `${ASSET_BASE}/resources/they-trusted__projects-complete-img.jpg`,
};

export default asset;
