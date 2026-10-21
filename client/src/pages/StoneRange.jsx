import { useEffect, useState } from 'react';
import PageHeader from '../components/PageHeader.jsx';
import StoneCard from '../components/StoneCard.jsx';
import { fetchStones } from '../lib/api.js';
import { usePageMeta } from '../lib/usePageMeta.js';
import { stones as fallbackStones } from '../data/stonesFallback.js';
import { SITE } from '../data/siteContent.js';

export default function StoneRange() {
  usePageMeta(
    `Stones | Marble, Sandstone, Limestone & Cobblestone in Makrana, Rajasthan`,
    `Explore the natural stones from ${SITE.legalName} — marble, sandstone, limestone and cobblestone supplied across India from Makrana, Rajasthan.`
  );

  const [stones, setStones] = useState(fallbackStones);
  const [source, setSource] = useState('loading');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    fetchStones()
      .then(({ data, source: from }) => {
        if (!active) return;
        if (Array.isArray(data) && data.length) setStones(data);
        setSource(from);
      })
      .finally(() => active && setLoading(false));

    return () => {
      active = false;
    };
  }, []);

  return (
    <>
      <PageHeader title="Stones" crumbs={[{ label: 'Stones' }]} />

      <section className="stone-range">
        <div className="container">
          <div className="section-title section-title--center">
            <span className="section-title__kicker">what we&rsquo;re offering</span>
            <h2 className="section-title__title">Our Stones</h2>
            <p className="section-title__text">
              Natural stone sourced at the quarry, finished in our own Makrana unit, and delivered anywhere in
              India on our own transport fleet &mdash; supplied as blocks, slabs, tiles, steps, columns and
              carved work in the sizes and finishes your project calls for.
            </p>
          </div>

          {loading ? (
            <div className="stone-range__loading" role="status">
              <span className="spinner" aria-hidden="true" />
              Loading the stone range&hellip;
            </div>
          ) : null}

          <div className="stone-grid">
            {stones.map((stone, index) => (
              <StoneCard key={stone.slug} stone={stone} delay={index * 70} />
            ))}
          </div>

          {source === 'client-fallback' ? (
            <p className="stone-range__note">
              Showing the bundled catalogue &mdash; connect MongoDB and run <code>npm run seed</code> to serve
              this list from the database.
            </p>
          ) : null}
        </div>
      </section>
    </>
  );
}
