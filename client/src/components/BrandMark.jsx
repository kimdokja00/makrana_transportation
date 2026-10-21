import { Link } from 'react-router-dom';
import { SITE } from '../data/siteContent.js';

/**
 * Text lockup used in place of a logo image.
 *
 * The previous build hot-linked Melange Stones' own logo file, which cannot
 * appear on a different business's site. This renders the trading name in the
 * site's typography until a real logo is supplied — at which point drop the
 * file into client/public and swap this for an <img>.
 */
export function BrandMark({ light = false, asLink = true }) {
  const className = `brand-mark${light ? ' brand-mark--light' : ''}`;

  const content = (
    <>
      <img
        src="/jmtc-logo.jpg"
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
