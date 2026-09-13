import { stones as fallbackStones } from '../data/stonesFallback.js';

const BASE = '/api';

async function request(path, options) {
  const res = await fetch(`${BASE}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });

  const body = await res.json().catch(() => null);

  if (!res.ok) {
    const error = new Error(body?.error || `Request failed with status ${res.status}`);
    error.status = res.status;
    error.errors = body?.errors;
    throw error;
  }

  return body;
}

/** GET /api/stones — falls back to the bundled catalogue if the API is asleep. */
export async function fetchStones(params = {}) {
  const query = new URLSearchParams(
    Object.entries(params).filter(([, value]) => value !== undefined && value !== '')
  ).toString();

  try {
    const body = await request(`/stones${query ? `?${query}` : ''}`);
    return { data: body.data, source: body.source };
  } catch (err) {
    console.warn('Stone range API unavailable, using bundled catalogue:', err.message);
    return { data: fallbackStones, source: 'client-fallback', offline: true };
  }
}

/** GET /api/stones/:slug */
export async function fetchStone(slug) {
  try {
    const body = await request(`/stones/${slug}`);
    return { data: body.data, source: body.source };
  } catch (err) {
    const stone = fallbackStones.find((s) => s.slug === slug);
    if (stone) return { data: stone, source: 'client-fallback', offline: true };
    throw err;
  }
}

/** POST /api/enquiries */
export function submitEnquiry(payload) {
  return request('/enquiries', { method: 'POST', body: JSON.stringify(payload) });
}

/** POST /api/orders */
export function submitOrder(payload) {
  return request('/orders', { method: 'POST', body: JSON.stringify(payload) });
}

export default { fetchStones, fetchStone, submitEnquiry, submitOrder };
