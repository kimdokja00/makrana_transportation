import { useEffect, useState } from 'react';
import { Navigate, useParams } from 'react-router-dom';
import { fetchStones } from '../lib/api.js';
import { stones as fallbackStones } from '../data/stonesFallback.js';
import { findStoneBySlug } from '../lib/stoneSlug.js';

/**
 * Legacy/alternate stone URLs (e.g. /stones/marbles) resolve to the canonical
 * /stone-range/<slug> page instead of falling through to the 404 route.
 */
export default function LegacyStoneRedirect({ to = '/stone-range' }) {
  const { slug } = useParams();
  const [target, setTarget] = useState(() => {
    const stone = findStoneBySlug(fallbackStones, slug);
    return stone ? `/stone-range/${stone.slug}` : null;
  });

  useEffect(() => {
    if (target) return undefined;

    let active = true;
    fetchStones()
      .then(({ data }) => {
        if (!active) return;
        const stone = findStoneBySlug(data, slug);
        setTarget(stone ? `/stone-range/${stone.slug}` : to);
      })
      .catch(() => {
        if (active) setTarget(to);
      });

    return () => {
      active = false;
    };
  }, [slug, target, to]);

  if (target) return <Navigate to={target} replace />;

  return (
    <section className="empty-state-section">
      <div className="container">
        <div className="stone-range__loading" role="status">
          <span className="spinner" aria-hidden="true" />
          Loading&hellip;
        </div>
      </div>
    </section>
  );
}
