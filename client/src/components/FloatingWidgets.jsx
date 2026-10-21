import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Icon from './Icon.jsx';
import { IMAGES } from '../lib/assets.js';
import { SITE } from '../data/siteContent.js';

function ScrollToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 400);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  if (!visible) return null;

  return (
    <button
      type="button"
      className="scroll-to-top"
      aria-label="Scroll to top"
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
    >
      <Icon name="angleUp" size={20} />
    </button>
  );
}

export function FloatingWidgets() {
  return (
    <>
      <Link to="/contact" className="quote-tab" title="Contact">
        Contact
      </Link>

      <div className="float-actions">
        <a href={SITE.phoneHref} className="float-action float-action--call" title="Call us">
          <img src={IMAGES.call} alt={`Call ${SITE.name}`} width="64" height="64" />
        </a>
        <a
          href={SITE.whatsapp}
          className="float-action float-action--whatsapp"
          title="WhatsApp us"
          target="_blank"
          rel="noopener noreferrer"
        >
          <img src={IMAGES.whatsapp} alt={`WhatsApp ${SITE.name}`} width="64" height="64" />
        </a>
      </div>

      <div className="bottom-contact-bar">
        <a
          href={SITE.whatsappApi}
          className="btns btns--whatsapp"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="WhatsApp us"
        >
          <Icon name="whatsapp" size={18} />
        </a>
        <a href={SITE.phoneHref} className="btns btns--call">
          <Icon name="phone" size={16} />
          Call Us
        </a>
        <Link to="/contact" className="btns btns--quote">
          Contact
        </Link>
      </div>

      <ScrollToTop />
    </>
  );
}

export default FloatingWidgets;
