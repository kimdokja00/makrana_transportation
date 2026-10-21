import { useEffect, useState } from 'react';
import { NavLink, Link, useLocation } from 'react-router-dom';
import Icon from './Icon.jsx';
import BrandMark from './BrandMark.jsx';
import { NAV_LINKS, SITE } from '../data/siteContent.js';

export function Header() {
  const [stuck, setStuck] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setStuck(window.scrollY > 60);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Close the drawer whenever the route changes.
  useEffect(() => setMenuOpen(false), [location.pathname]);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [menuOpen]);

  const renderLink = (link, className, onClick) => {
    if (link.href) {
      return (
        <a
          key={link.label}
          href={link.href}
          className={className}
          target="_blank"
          rel="noopener noreferrer"
          onClick={onClick}
        >
          {link.label}
        </a>
      );
    }
    return (
      <NavLink
        key={link.label}
        to={link.to}
        onClick={onClick}
        className={({ isActive }) => `${className}${isActive ? ' current' : ''}`}
      >
        {link.label}
      </NavLink>
    );
  };

  return (
    <>
      <header className={`main-header clearfix${stuck ? ' is-stuck' : ''}`}>
        <div className="main-header__top">
          <div className="container">
            <div className="main-header__top-inner">
              <ul className="main-header__contact list-unstyled">
                {SITE.phones.map((phone) => (
                  <li key={phone.href}>
                    <Icon name="phone" size={15} />
                    <a href={phone.href}>{phone.label}</a>
                  </li>
                ))}
              </ul>

              <div className="main-header__meta">
                <span className="main-header__since">Trading since {SITE.since}</span>
                {SITE.socials.length ? (
                  <div className="main-header__social">
                    {SITE.socials.map((social) => (
                      <a
                        key={social.href}
                        href={social.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={social.label}
                      >
                        <Icon name={social.icon} size={15} />
                      </a>
                    ))}
                  </div>
                ) : null}
              </div>
            </div>
          </div>
        </div>

        <div className="container">
          <div className="main-menu-wrapper">
            <BrandMark />

            <nav className="main-menu" aria-label="Main navigation">
              <ul className="main-menu__list list-unstyled">
                {NAV_LINKS.map((link) => renderLink(link, 'main-menu__link'))}
              </ul>

              <div className="main-menu__right">
                <Link to="/contact" className="thm-btn thm-btn--sm">
                  Contact
                </Link>
                <button
                  type="button"
                  className="mobile-nav__toggler"
                  aria-label="Open menu"
                  aria-expanded={menuOpen}
                  onClick={() => setMenuOpen(true)}
                >
                  <Icon name="bars" size={22} />
                </button>
              </div>
            </nav>
          </div>
        </div>
      </header>

      <div className={`mobile-nav${menuOpen ? ' is-open' : ''}`}>
        <div className="mobile-nav__overlay" onClick={() => setMenuOpen(false)} />
        <div className="mobile-nav__content">
          <button
            type="button"
            className="mobile-nav__close"
            aria-label="Close menu"
            onClick={() => setMenuOpen(false)}
          >
            <Icon name="close" size={20} />
          </button>

          <div className="mobile-nav__logo">
            <BrandMark />
          </div>

          <ul className="mobile-nav__list list-unstyled">
            {NAV_LINKS.map((link) => renderLink(link, 'mobile-nav__link', () => setMenuOpen(false)))}
          </ul>

          <div className="mobile-nav__action">
            <Link
              to="/contact"
              className="thm-btn thm-btn--sm"
              onClick={() => setMenuOpen(false)}
            >
              Contact
            </Link>
          </div>

          <ul className="mobile-nav__contact list-unstyled">
            {SITE.phones.map((phone) => (
              <li key={phone.href}>
                <Icon name="phone" size={15} />
                <a href={phone.href}>{phone.label}</a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </>
  );
}

export default Header;
