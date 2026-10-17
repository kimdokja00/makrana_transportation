/**
 * Asset URLs.
 *
 * ⚠️  EVERYTHING HERE IS STILL HOT-LINKED FROM melangestones.com
 * ---------------------------------------------------------------------------
 * These are Melange Stones' photographs of their own stock, served from their
 * server at their bandwidth cost. They are kept temporarily so the design can be
 * reviewed, and MUST be replaced before this site goes live:
 *
 *   1. Put your own photos in `client/public/assets/images/`
 *   2. Change ASSET_BASE to '/assets/images'
 *   3. Delete this comment
 *
 * Melange Stones' logo, favicons, partner/client logos and testimonial
 * attributions have already been removed — they cannot be reused at all.
 */
export const ASSET_BASE = 'https://melangestones.com/assets/images';

export function asset(path) {
  if (!path) return '';
  if (/^https?:\/\//i.test(path)) return path;
  if (path.startsWith('/')) return path;
  if (/^products\//i.test(path)) return `/${path}`;
  return `${ASSET_BASE}/${String(path).replace(/^\/+/, '')}`;
}

/** Generic UI icons that carry no third-party branding. */
export const UI_ASSETS = {
  call: `${ASSET_BASE}/call.png`,
  whatsapp: `${ASSET_BASE}/whatsapp.png`,
};

/** Background and lifestyle photography — all placeholders, see the note above. */
export const IMAGES = {
  pageHeaderBg: `${ASSET_BASE}/backgrounds/page-header-bg.jpg`,
  footerPattern: `${ASSET_BASE}/pattern/pattern-1.webp`,
  call: UI_ASSETS.call,
  whatsapp: UI_ASSETS.whatsapp,
  sliders: [
    `${ASSET_BASE}/backgrounds/main-slider-2-1.webp`,
    `${ASSET_BASE}/backgrounds/main-slider-2-2.webp`,
    `${ASSET_BASE}/backgrounds/main-slider-2-3.webp`,
  ],
  welcome: [
    `${ASSET_BASE}/resources/welcome-two-img-1.webp`,
    `${ASSET_BASE}/resources/welcome-two-img-2.webp`,
  ],
  welcomeBg: `${ASSET_BASE}/backgrounds/welcome-two-bg.png`,
  trustExpertsBg: `${ASSET_BASE}/backgrounds/trust-experts-bg.webp`,
  counterPattern: `${ASSET_BASE}/pattern/counter-one-pattern.webp`,
  projectsImg: `${ASSET_BASE}/resources/they-trusted__projects-complete-img.webp`,
};

export default asset;
