import { Link } from 'react-router-dom';
import PageHeader from '../components/PageHeader.jsx';
import Icon from '../components/Icon.jsx';
import SectionTitle from '../components/SectionTitle.jsx';
import { IMAGES } from '../lib/assets.js';
import { usePageMeta } from '../lib/usePageMeta.js';
import { ABOUT, SITE, TRUST_POINTS } from '../data/siteContent.js';

export default function About() {
  usePageMeta(
    `About Us | ${SITE.legalName} — Makrana, Rajasthan`,
    `${SITE.legalName} is a Makrana-based supplier of natural stone and minerals, trading since ${SITE.since}. Marble, granite, sandstone, limestone and slate, sourced at the quarry, processed in our own unit and delivered across India.`
  );

  return (
    <>
      <PageHeader title="About Us" crumbs={[{ label: 'About Us' }]} />

      <section className="profile">
        <div className="container">
          <div className="profile__grid">
            <div className="profile__body">
              <SectionTitle align="left" kicker="Our Profile" title="About Our Company" />
              <ul className="profile__tags list-unstyled">
                <li>Trading since {SITE.since}</li>
                <li>{SITE.supplyArea}</li>
                <li>{SITE.businessType}</li>
              </ul>
              <p className="profile__text">{ABOUT.intro}</p>
              <p className="profile__text">{ABOUT.intro2}</p>
              <Link to="/stone-range" className="thm-btn">
                View Stones
              </Link>
            </div>

            <div className="profile__media">
              <img src={IMAGES.welcome[0]} alt="Natural stone surfaces" loading="lazy" />
              <img src={IMAGES.welcome[1]} alt="Stone processing at the unit" loading="lazy" />
            </div>
          </div>
        </div>
      </section>

      <section className="aspects">
        <div className="container">
          <SectionTitle kicker="Our Key Aspects" title="Why Work With Us" />
          <div className="aspects__grid">
            {ABOUT.aspects.map((aspect) => (
              <article key={aspect.title} className="aspect-card">
                <span className="aspect-card__icon">
                  <Icon name={aspect.icon} size={34} />
                </span>
                <span className="aspect-card__label">{aspect.label}</span>
                <h3 className="aspect-card__title">{aspect.title}</h3>
                <p className="aspect-card__text">{aspect.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="ideology">
        <div className="container">
          <SectionTitle kicker="3 faithful ethics" title="How We Work" />
          <div className="ideology__grid">
            {ABOUT.ideology.map((item) => (
              <article key={item.title} className="ideology-card">
                <span className="ideology-card__step">{item.step}</span>
                <h3 className="ideology-card__title">{item.title}</h3>
                <p className="ideology-card__text">{item.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="advantages">
        <div className="container">
          <SectionTitle kicker="Business details" title="Registered & Compliant" />
          <div className="advantages__grid">
            {TRUST_POINTS.map((point) => (
              <article key={point.title} className="advantage-card">
                <span className="advantage-card__icon">
                  <Icon name={point.icon} size={26} />
                </span>
                <h3 className="advantage-card__title">{point.title}</h3>
                <p className="advantage-card__text">{point.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="profile-details">
        <div className="container">
          <div className="profile-details__grid">
            <div>
              <h3 className="profile-details__title">{SITE.office.label}</h3>
              {SITE.office.lines.map((line) => (
                <p key={line} className="profile-details__line">
                  {line}
                </p>
              ))}
            </div>
            <div>
              <h3 className="profile-details__title">{SITE.works.label}</h3>
              {SITE.works.lines.map((line) => (
                <p key={line} className="profile-details__line">
                  {line}
                </p>
              ))}
            </div>
            <div>
              <h3 className="profile-details__title">Registration</h3>
              <p className="profile-details__line">
                <strong>GST No.</strong> {SITE.gst}
              </p>
              <p className="profile-details__line">
                <strong>Proprietor:</strong> {SITE.proprietor}
              </p>
            </div>
            <div>
              <h3 className="profile-details__title">Contact</h3>
              {SITE.phones.map((phone) => (
                <p key={phone.href} className="profile-details__line">
                  <a href={phone.href}>{phone.label}</a>
                </p>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
