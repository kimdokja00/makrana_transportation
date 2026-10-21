import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import PageHeader from '../components/PageHeader.jsx';
import Icon from '../components/Icon.jsx';
import StoneCard from '../components/StoneCard.jsx';
import { fetchStone, fetchStones } from '../lib/api.js';
import { asset } from '../lib/assets.js';
import { usePageMeta } from '../lib/usePageMeta.js';
import { SITE } from '../data/siteContent.js';

export default function StoneDetail() {
  const { slug } = useParams();
  const [stone, setStone] = useState(null);
  const [others, setOthers] = useState([]);
  const [status, setStatus] = useState('loading');

  useEffect(() => {
    let active = true;
    setStatus('loading');

    fetchStone(slug)
      .then(({ data }) => {
        if (!active) return;
        setStone(data);
        setStatus('ready');
      })
      .catch(() => active && setStatus('missing'));

    fetchStones().then(({ data }) => {
      if (active) setOthers(data.filter((s) => s.slug !== slug).slice(0, 3));
    });

    return () => {
      active = false;
    };
  }, [slug]);

  usePageMeta(
    stone ? `${stone.name} | ${SITE.name} — Makrana, Rajasthan` : `Stones | ${SITE.name}`,
    stone?.description
  );

  if (status === 'missing') {
    return (
      <>
        <PageHeader title="Stone Not Found" crumbs={[{ label: 'Stones', to: '/stone-range' }]} />
        <section className="stone-detail">
          <div className="container">
            <div className="empty-state">
              <h2>We couldn&rsquo;t find that stone.</h2>
              <p>It may have been renamed. Browse the full range instead.</p>
              <Link to="/stone-range" className="thm-btn">
                Back to Stones
              </Link>
            </div>
          </div>
        </section>
      </>
    );
  }

  if (!stone) {
    return (
      <>
        <PageHeader title="Stones" crumbs={[{ label: 'Stones', to: '/stone-range' }]} />
        <section className="stone-detail">
          <div className="container">
            <div className="stone-range__loading" role="status">
              <span className="spinner" aria-hidden="true" />
              Loading&hellip;
            </div>
          </div>
        </section>
      </>
    );
  }

  return (
    <>
      <PageHeader
        title={stone.name}
        crumbs={[{ label: 'Stones', to: '/stone-range' }, { label: stone.name }]}
      />

      <section className="stone-detail">
        <div className="container">
          <div className="stone-detail__grid">
            <div className="stone-detail__media">
              <div className="stone-card__frame">
                <div className="stone-card__img">
                  <img src={asset(stone.image)} alt={stone.name} />
                </div>
              </div>
            </div>

            <div className="stone-detail__body">
              <span className="section-title__kicker">{stone.category}</span>
              <h2 className="stone-detail__title">{stone.name}</h2>
              {stone.description ? <p className="stone-detail__text">{stone.description}</p> : null}

              <dl className="stone-detail__specs">
                <div>
                  <dt>Origin</dt>
                  <dd>{stone.origin || 'India'}</dd>
                </div>
                <div>
                  <dt>Finishes</dt>
                  <dd>{(stone.finishes || []).join(', ') || 'On request'}</dd>
                </div>
                <div>
                  <dt>Applications</dt>
                  <dd>{(stone.applications || []).join(', ') || 'Interior & exterior'}</dd>
                </div>
              </dl>

              <div className="stone-detail__actions">
                <Link to={`/contact?stone=${encodeURIComponent(stone.name)}`} className="thm-btn">
                  Request a Quote
                </Link>
                <a href={SITE.phoneHref} className="thm-btn thm-btn--outline">
                  <Icon name="phone" size={15} /> {SITE.phone}
                </a>
              </div>
            </div>
          </div>

          {others.length ? (
            <div className="stone-detail__others">
              <div className="section-title section-title--center">
                <span className="section-title__kicker">explore more</span>
                <h2 className="section-title__title">Other Stones</h2>
              </div>
              <div className="stone-grid">
                {others.map((item, index) => (
                  <StoneCard key={item.slug} stone={item} delay={index * 70} />
                ))}
              </div>
            </div>
          ) : null}
        </div>
      </section>
    </>
  );
}
