import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Counter from '../components/Counter.jsx';
import Icon from '../components/Icon.jsx';
import SectionTitle from '../components/SectionTitle.jsx';
import { IMAGES } from '../lib/assets.js';
import { usePageMeta } from '../lib/usePageMeta.js';
import {
  COUNTERS,
  HERO_SLIDES,
  HERO_SUBTITLE,
  HOME_SERVICES,
  PROJECT_STEPS,
  SITE,
  TRUST_POINTS,
} from '../data/siteContent.js';

function HeroSlider() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => setIndex((i) => (i + 1) % HERO_SLIDES.length), 6000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="hero">
      {HERO_SLIDES.map((slide, i) => (
        <div
          key={slide.title}
          className={`hero__slide${i === index ? ' is-active' : ''}`}
          style={{ backgroundImage: `url(${slide.image})` }}
          aria-hidden={i !== index}
        >
          <span className="hero__overlay" aria-hidden="true" />
          <div className="container">
            <div className="hero__content">
              <p className="hero__kicker">{slide.kicker}</p>
              <p className="hero__script">{slide.script}</p>
              <h1 className="hero__title">{slide.title}</h1>
              <p className="hero__subtitle">{HERO_SUBTITLE}</p>
              <Link to="/stone-range" className="thm-btn">
                Learn more
              </Link>
            </div>
          </div>
        </div>
      ))}

      <div className="hero__dots">
        {HERO_SLIDES.map((slide, i) => (
          <button
            key={slide.title}
            type="button"
            className={`hero__dot${i === index ? ' is-active' : ''}`}
            aria-label={`Show slide ${i + 1}`}
            onClick={() => setIndex(i)}
          />
        ))}
      </div>
    </section>
  );
}

export default function Home() {
  usePageMeta(
    `Marble, Granite & Mineral Supplier in Makrana, Rajasthan | ${SITE.name}`,
    `${SITE.legalName} — supplying marble, granite, sandstone, limestone and industrial minerals from Makrana, Rajasthan since ${SITE.since}. Sourcing, processing and all-India transport under one roof. Call ${SITE.phone} for a quote.`
  );

  return (
    <>
      <HeroSlider />

      {/* About / welcome */}
      <section className="welcome" style={{ backgroundImage: `url(${IMAGES.welcomeBg})` }}>
        <div className="container">
          <div className="welcome__grid">
            <div className="welcome__media">
              <img className="welcome__img welcome__img--one" src={IMAGES.welcome[0]} alt="Natural stone surfaces" loading="lazy" />
              <img className="welcome__img welcome__img--two" src={IMAGES.welcome[1]} alt="Stone processing unit" loading="lazy" />
              <span className="welcome__badge">
                <span className="welcome__badge-script">Since</span>
                <strong>{SITE.since}</strong>
              </span>
            </div>

            <div className="welcome__body">
              <SectionTitle
                align="left"
                kicker="About Company"
                title="Stone & Minerals from the Makrana Belt"
              />
              <p className="welcome__text">
                {SITE.legalName} is a Makrana-based house of natural stone and minerals, trading since{' '}
                {SITE.since}. Makrana has supplied the world&rsquo;s finest white marble for centuries, and we
                have spent four decades sourcing, processing and moving it. We select blocks at the quarry,
                finish them in our own unit at {SITE.works.short.split(',')[0]}, and dispatch across India
                through our transport division &mdash; so one team answers for the whole order.
              </p>

              <ul className="welcome__points list-unstyled">
                <li>
                  <Icon name="check" size={14} /> Sourced directly at the quarry
                </li>
                <li>
                  <Icon name="check" size={14} /> Our own processing unit and transport fleet
                </li>
                <li>
                  <Icon name="check" size={14} /> GST registered &mdash; fully compliant invoicing
                </li>
              </ul>

              <div className="welcome__actions">
                <Link to="/about" className="thm-btn">
                  Learn more
                </Link>
                <a href={SITE.phoneHref} className="welcome__call">
                  <Icon name="phone" size={16} />
                  <span>
                    Call us today
                    <strong>{SITE.phone}</strong>
                  </span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="services">
        <div className="container">
          <SectionTitle kicker="what we do" title="From Quarry to Site" />
          <div className="services__grid">
            {HOME_SERVICES.map((service) => (
              <article key={service.title} className="service-card">
                <span className="service-card__icon">
                  <Icon name={service.icon} size={34} />
                </span>
                <h3 className="service-card__title">{service.title}</h3>
                <p className="service-card__text">{service.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Counters */}
      <section className="counters">
        <div className="container">
          <ul className="counters__grid list-unstyled">
            {COUNTERS.map((counter) => (
              <li key={counter.label} className="counter">
                <span className="counter__icon">
                  <Icon name={counter.icon} size={34} />
                </span>
                <h3 className="counter__heading">
                  <Counter value={counter.value} suffix={counter.suffix} />
                </h3>
                <p className="counter__label">{counter.label}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Advantages — replaces the previous testimonials and client-logo strip */}
      <section className="advantages">
        <div className="container">
          <SectionTitle kicker="Why buy from us" title="Four Decades in the Trade" />
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

      {/* Process */}
      <section className="steps">
        <div className="container">
          <div className="steps__grid">
            <div className="steps__media">
              <img src={IMAGES.projectsImg} alt="Stone consignments ready for dispatch" loading="lazy" />
            </div>
            <div className="steps__body">
              <SectionTitle align="left" kicker="How we work" title="One Team, Pit to Project" />
              <ul className="steps__list list-unstyled">
                {PROJECT_STEPS.map((step) => (
                  <li key={step.title}>
                    <Icon name="check" size={14} />
                    <span>
                      <strong>{step.title}</strong>
                      {step.text}
                    </span>
                  </li>
                ))}
                <li>
                  <Icon name="check" size={14} />
                  <span>
                    <strong>Dispatched on our own fleet</strong>
                    Consignments delivered anywhere in India
                  </span>
                </li>
              </ul>
              <div className="steps__actions">
                <Link to="/stone-products" className="thm-btn">
                  See what we supply
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust band */}
      <section className="trust" style={{ backgroundImage: `url(${IMAGES.trustExpertsBg})` }}>
        <span className="trust__overlay" aria-hidden="true" />
        <div className="container">
          <div className="trust__inner">
            <p className="trust__kicker">Trust the source, not the middleman</p>
            <h2 className="trust__title">Buy Direct from Makrana</h2>
            <Link to="/contact" className="thm-btn thm-btn--light">
              Get a Quote
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
