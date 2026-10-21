import { Link } from 'react-router-dom';
import PageHeader from '../components/PageHeader.jsx';
import { usePageMeta } from '../lib/usePageMeta.js';

export default function NotFound() {
  usePageMeta('Page not found | Jammu Makrana Transport');

  return (
    <>
      <PageHeader title="404" crumbs={[{ label: 'Page not found' }]} />

      <section className="empty-state-section">
        <div className="container">
          <div className="empty-state">
            <h2>This page could not be found.</h2>
            <p>The link may be out of date. Start from the stones instead.</p>
            <div className="empty-state__actions">
              <Link to="/stone-range" className="thm-btn">
                Stones
              </Link>
              <Link to="/" className="thm-btn thm-btn--outline">
                Back Home
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
