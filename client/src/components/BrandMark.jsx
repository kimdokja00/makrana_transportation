import { Link } from 'react-router-dom';
import { asset } from '../lib/assets.js';
import { SITE } from '../data/siteContent.js';

/**
 * Brand lockup rendering the company emblem and trading title.
 */
export function BrandMark({ light = false, asLink = true }) {
  const className = `brand-mark${light ? ' brand-mark--light' : ''}`;

  const content = (
    <>
      <img
        src={asset('jmtc-logo.jpg')}
        alt="Jammu Makrana Transport Company"
        className="brand-mark__img"
      />
      <span className="brand-mark__text">
        <span className="brand-mark__name">Jammu Makrana</span>
        <span className="brand-mark__sub">Transport &amp; Komal Minerals</span>
      </span>
    </>
  );

  if (!asLink) return <span className={className}>{content}</span>;

  return (
    <Link to="/" className={className} aria-label={`${SITE.legalName} — home`}>
      {content}
    </Link>
  );
}

export default BrandMark;
