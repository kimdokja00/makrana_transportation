import { useState } from 'react';
import PageHeader from '../components/PageHeader.jsx';
import Icon from '../components/Icon.jsx';
import BrandMark from '../components/BrandMark.jsx';
import { submitOrder } from '../lib/api.js';
import { usePageMeta } from '../lib/usePageMeta.js';
import { SITE } from '../data/siteContent.js';

const STONE_OPTIONS = [
  'Makrana Marble',
  'Sandstone',
  'Limestone',
  'Cobblestone',
  'Other Stone / Minerals',
];

const DEFAULT_STONE_ITEM = {
  stoneName: 'Makrana Marble',
  slabSize: '',
  slabCount: '',
  quantityTonnes: '',
};

const INITIAL_FORM = {
  fullName: '',
  phone: '',
  email: '',
  companyName: '',
  dropCity: '',
  dropState: '',
  dropAddress: '',
  dropPin: '',
  stones: [{ ...DEFAULT_STONE_ITEM }],
  arrivedByDate: '',
  specialInstructions: '',
  website: '', // honeypot
};

const INDIAN_STATES = [
  'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
  'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jammu & Kashmir',
  'Jharkhand', 'Karnataka', 'Kerala', 'Madhya Pradesh', 'Maharashtra',
  'Manipur', 'Meghalaya', 'Mizoram', 'Nagaland', 'Odisha', 'Punjab',
  'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana', 'Tripura',
  'Uttar Pradesh', 'Uttarakhand', 'West Bengal', 'Delhi NCR', 'Ladakh'
];

const FLEET_HIGHLIGHTS = [
  {
    title: 'Multi-Axle Heavy Trucks',
    capacity: '16 to 35 Tonnes',
    desc: 'High-payload multi-axle fleet equipped with heavy chassis suspension, ideal for finished marble slabs and bulk mineral haulage.',
    badge: 'High Capacity',
  },
  {
    title: 'Flatbed & Low-Bed Trailers',
    capacity: 'Up to 45 Tonnes',
    desc: 'Heavy-duty open flatbeds purpose-built for loading oversized raw marble and granite quarry blocks directly from the pit.',
    badge: 'Block Carriers',
  },
  {
    title: 'Covered & Containerized Trucks',
    capacity: '7 to 20 Tonnes',
    desc: 'Weather-protected closed containers providing complete protection against moisture and dust for polished tiles and fine minerals.',
    badge: 'Weatherproof',
  },
  {
    title: 'Dedicated Stone Logistics',
    capacity: 'Pan-India Permits',
    desc: 'Drivers and crew specifically trained in marble padding, timber bracing, and securing fragile stone loads across national highways.',
    badge: 'Safe Transit',
  },
];

const KEY_ROUTES = [
  { from: 'Makrana', to: 'Jammu & Kashmir (Jammu / Srinagar / Katra)', duration: '2 - 3 Days' },
  { from: 'Makrana', to: 'Delhi NCR (Delhi / Gurugram / Noida / Faridabad)', duration: '12 - 18 Hours' },
  { from: 'Makrana', to: 'Punjab & Haryana (Amritsar / Ludhiana / Chandigarh)', duration: '24 - 36 Hours' },
  { from: 'Makrana', to: 'Maharashtra (Mumbai / Pune / Nagpur)', duration: '2 - 3 Days' },
  { from: 'Makrana', to: 'South India (Bengaluru / Hyderabad / Chennai)', duration: '3 - 4 Days' },
  { from: 'Makrana', to: 'Eastern India (Kolkata / Patna / Ranchi)', duration: '3 - 4 Days' },
];

export default function Transportation() {
  usePageMeta(
    `Transportation & Logistics | ${SITE.legalName} — All India Transport Fleet`,
    `Book heavy stone and cargo transport directly with ${SITE.legalName}. Established in 1985 in Makrana, Rajasthan with our own fleet of multi-axle trucks and trailers serving all India.`
  );

  const [form, setForm] = useState(INITIAL_FORM);
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState('idle'); // idle | submitting | submitted | error
  const [serverError, setServerError] = useState('');
  const [confirmedOrder, setConfirmedOrder] = useState(null);

  const update = (field) => (event) => {
    setForm((prev) => ({ ...prev, [field]: event.target.value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const handleStoneChange = (index, field, value) => {
    setForm((prev) => {
      const nextStones = [...prev.stones];
      nextStones[index] = { ...nextStones[index], [field]: value };
      return { ...prev, stones: nextStones };
    });
    if (errors.stones) {
      setErrors((prev) => ({ ...prev, stones: undefined }));
    }
  };

  const addStone = () => {
    setForm((prev) => ({
      ...prev,
      stones: [...prev.stones, { ...DEFAULT_STONE_ITEM, stoneName: STONE_OPTIONS[0] }],
    }));
  };

  const removeStone = (index) => {
    setForm((prev) => ({
      ...prev,
      stones: prev.stones.filter((_, i) => i !== index),
    }));
  };

  const validate = () => {
    const nextErrors = {};
    if (!form.fullName.trim()) nextErrors.fullName = 'Please enter your full name';
    if (!form.phone.trim()) nextErrors.phone = 'Please enter your 10-digit mobile number';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
      nextErrors.email = 'Please enter a valid email address';
    }

    if (!form.dropCity.trim()) nextErrors.dropCity = 'Destination city is required';
    if (!form.dropState.trim()) nextErrors.dropState = 'Destination state is required';
    if (!form.dropAddress.trim()) nextErrors.dropAddress = 'Destination address is required';

    if (!form.arrivedByDate.trim()) nextErrors.arrivedByDate = 'Please select arrived by date';

    if (!form.stones || form.stones.length === 0) {
      nextErrors.stones = 'Please add at least one stone to your order';
    } else {
      const hasEmpty = form.stones.some(
        (s) => !s.stoneName.trim() || (!s.slabSize.trim() && !s.slabCount.trim() && !s.quantityTonnes.trim())
      );
      if (hasEmpty) {
        nextErrors.stones = 'Please mention slab size, slab count, or quantity in tonnes for each stone';
      }
    }

    return nextErrors;
  };

  const handleWhatsAppBooking = (event) => {
    if (form.website) {
      if (event) event.preventDefault();
      return;
    }

    const validationErrors = validate();
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) {
      if (event) event.preventDefault();
      const firstErrorKey = Object.keys(validationErrors)[0];
      const elem = document.querySelector(`[name="${firstErrorKey}"]`);
      if (elem) elem.focus();
      return false;
    }

    // Record order in MongoDB in background so no customer booking is lost
    submitOrder({
      fullName: form.fullName,
      phone: form.phone,
      email: form.email,
      companyName: form.companyName,
      dropCity: form.dropCity,
      dropState: form.dropState,
      dropAddress: form.dropAddress,
      dropPin: form.dropPin,
      stones: form.stones,
      arrivedByDate: form.arrivedByDate,
      specialInstructions: form.specialInstructions,
    }).catch((err) => {
      console.warn('[Transportation] Background order recording skipped:', err.message);
    });

  };

  const createWhatsAppOrderLink = (order) => {
    const activeStones = order?.stones || form.stones || [];
    const stonesSummary = activeStones
      .map((s, idx) => {
        const details = [];
        if (s.slabSize) details.push(`Size: ${s.slabSize}`);
        if (s.slabCount) details.push(`Slabs: ${s.slabCount}`);
        if (s.quantityTonnes) details.push(`Weight: ${s.quantityTonnes}`);
        return `   ${idx + 1}. *${s.stoneName}* ${details.length ? `(${details.join(', ')})` : ''}`;
      })
      .join('\n');

    const text = encodeURIComponent(
      `*New Transport Booking Request - Jammu Makrana Transport*\n` +
      `-----------------------------------------\n` +
      `*Booking Ref:* ${order?.orderNumber || 'Pending'}\n` +
      `*Customer:* ${order?.fullName || form.fullName}\n` +
      `*Phone:* ${order?.phone || form.phone}\n` +
      (order?.companyName || form.companyName ? `*Company:* ${order?.companyName || form.companyName}\n` : '') +
      `*Destination:* ${order?.dropCity || form.dropCity}, ${order?.dropState || form.dropState}\n` +
      `*Delivery Address:* ${order?.dropAddress || form.dropAddress}\n` +
      `*Arrived By Date:* ${order?.arrivedByDate || form.arrivedByDate}\n\n` +
      `*Cargo Stones Ordered:*\n${stonesSummary}\n\n` +
      (order?.specialInstructions || form.specialInstructions ? `*Notes:* ${order?.specialInstructions || form.specialInstructions}\n` : '') +
      `-----------------------------------------\n` +
      `Please confirm freight quotation and vehicle schedule.`
    );
    return `https://wa.me/${SITE.whatsappNumber}?text=${text}`;
  };

  return (
    <div className="transport-page">
      <PageHeader
        title="Transportation & Freight Logistics"
        crumbs={[{ label: 'Transportation' }]}
      />

      {/* Hero Overview Section */}
      <section className="transport-overview">
        <div className="container">
          <div className="transport-overview__inner">
            <div className="transport-overview__content">
              <span className="section-title__tagline">Our Own Transport Fleet</span>
              <h2 className="section-title__title">
                Reliable Stone & Heavy Freight Carriage Across India
              </h2>
              <p className="transport-overview__desc">
                Under <strong>{SITE.legalName}</strong>, our dedicated logistics division has been
                moving marble slabs, sandstone, limestone, cobblestone, minerals, and industrial cargo since 1985.
                With our own fleet of heavy-duty multi-axle trucks and flatbed trailers stationed in
                Makrana, Rajasthan, we guarantee direct point-to-point transit without third-party
                delays.
              </p>

              <div className="transport-overview__features">
                <div className="transport-feature-pill">
                  <Icon name="truck" size={18} />
                  <span>Own Heavy Fleet</span>
                </div>
                <div className="transport-feature-pill">
                  <Icon name="globe" size={18} />
                  <span>All India Permits</span>
                </div>
                <div className="transport-feature-pill">
                  <Icon name="badge" size={18} />
                  <span>Since 1985</span>
                </div>
                <div className="transport-feature-pill">
                  <Icon name="check" size={18} />
                  <span>GST & E-Way Ready</span>
                </div>
              </div>
            </div>

            <div className="transport-overview__card">
              <div className="transport-card-stat">
                <span className="stat-number">40+</span>
                <span className="stat-label">Years of Heavy Freight Logistics</span>
              </div>
              <div className="transport-card-stat">
                <span className="stat-number">100%</span>
                <span className="stat-label">In-House Fleet Ownership</span>
              </div>
              <div className="transport-card-stat">
                <span className="stat-number">Pan-India</span>
                <span className="stat-label">Doorstep Delivery to 28+ States</span>
              </div>
              <div className="transport-card-stat">
                <span className="stat-number">Makrana</span>
                <span className="stat-label">Primary Dispatch & Logistics Hub</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Fleet Capabilities Grid */}
      <section className="transport-fleet">
        <div className="container">
          <div className="section-title text-center">
            <span className="section-title__tagline">Engineered for Heavy Stone</span>
            <h2 className="section-title__title">Our Heavy Commercial Fleet</h2>
            <p className="section-title__desc">
              Every truck in our fleet is maintained, insured, and operated by veteran long-haul
              drivers trained specifically in natural stone handling, lashing, and interstate documentation.
            </p>
          </div>

          <div className="transport-fleet__grid">
            {FLEET_HIGHLIGHTS.map((item) => (
              <div key={item.title} className="fleet-card">
                <div className="fleet-card__header">
                  <span className="fleet-badge">{item.badge}</span>
                  <span className="fleet-capacity">{item.capacity}</span>
                </div>
                <h3 className="fleet-card__title">{item.title}</h3>
                <p className="fleet-card__desc">{item.desc}</p>
                <div className="fleet-card__footer">
                  <Icon name="check" size={16} />
                  <span>All-India Carriage Ready</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Main Order Placement Form Section */}
      <section className="transport-order-section" id="booking-form">
        <div className="container">
          <div className="transport-order__box">
            <div className="transport-order__header">
              <span className="section-title__tagline">Direct Fleet Booking</span>
              <h3 className="transport-order__title">Place Transportation Order</h3>
              <p className="transport-order__subtitle">
                Fill out the delivery destination and specify your stone requirements. You can select
                multiple stones in a single booking and mention slab sizes, slab counts, or tonnage.
              </p>
            </div>

            {status === 'submitted' && confirmedOrder ? (
              <div className="order-success-card">
                <div className="order-success-card__icon">
                  <Icon name="check" size={38} />
                </div>
                <h3 className="order-success-card__title">Transport Order Placed Successfully!</h3>
                <p className="order-success-card__subtitle">
                  Thank you, <strong>{confirmedOrder.fullName}</strong>. Your transport booking reference is:
                </p>

                <div className="order-ref-badge">
                  <span>Booking Reference:</span>
                  <strong>{confirmedOrder.orderNumber}</strong>
                </div>

                <div className="order-summary-grid">
                  <div className="order-summary-item">
                    <span className="label">Destination</span>
                    <strong>{confirmedOrder.dropCity}, {confirmedOrder.dropState}</strong>
                  </div>
                  <div className="order-summary-item">
                    <span className="label">Delivery Address</span>
                    <strong>{confirmedOrder.dropAddress}</strong>
                  </div>
                  <div className="order-summary-item">
                    <span className="label">Arrived By Date</span>
                    <strong>{confirmedOrder.arrivedByDate}</strong>
                  </div>
                </div>

                {/* Stones Summary Table */}
                {confirmedOrder.stones && confirmedOrder.stones.length > 0 && (
                  <div className="order-stones-summary">
                    <h5>Ordered Stone Cargo Details</h5>
                    <div className="order-stones-table-wrap">
                      <table className="order-stones-table">
                        <thead>
                          <tr>
                            <th>#</th>
                            <th>Stone Type</th>
                            <th>Size of Slabs</th>
                            <th>Slab Count</th>
                            <th>Quantity in Tonne</th>
                          </tr>
                        </thead>
                        <tbody>
                          {confirmedOrder.stones.map((st, idx) => (
                            <tr key={idx}>
                              <td>{idx + 1}</td>
                              <td><strong>{st.stoneName}</strong></td>
                              <td>{st.slabSize || 'Standard / On Spec'}</td>
                              <td>{st.slabCount || '—'}</td>
                              <td>{st.quantityTonnes || '—'}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                <div className="order-success-card__actions">
                  <a
                    href={createWhatsAppOrderLink(confirmedOrder)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="thm-btn thm-btn--whatsapp"
                  >
                    <Icon name="whatsapp" size={18} /> Confirm Instantly on WhatsApp
                  </a>
                  <button
                    type="button"
                    className="thm-btn thm-btn--outline"
                    onClick={() => {
                      setStatus('idle');
                      setConfirmedOrder(null);
                    }}
                  >
                    Book Another Shipment
                  </button>
                </div>
              </div>
            ) : (
              <form
                className="transport-form"
                onSubmit={(e) => {
                  e.preventDefault();
                  const ok = handleWhatsAppBooking(e);
                  if (ok) window.open(createWhatsAppOrderLink(form), '_blank');
                }}
                noValidate
              >
                {status === 'error' && (
                  <div className="alert alert--error" role="alert">
                    <Icon name="close" size={16} />
                    <span>{serverError}</span>
                  </div>
                )}

                {/* Section 1: Customer & Business Details */}
                <div className="form-section">
                  <h4 className="form-section__title">
                    <span className="form-section__step">1</span>
                    Customer & Contact Information
                  </h4>

                  <div className="form-row">
                    <div className="form-field">
                      <label htmlFor="fullName">Full Name *</label>
                      <input
                        id="fullName"
                        type="text"
                        name="fullName"
                        placeholder="e.g. Ramesh Sharma"
                        value={form.fullName}
                        onChange={update('fullName')}
                        required
                      />
                      {errors.fullName && <span className="form-error">{errors.fullName}</span>}
                    </div>

                    <div className="form-field">
                      <label htmlFor="phone">Phone Number (10 digits) *</label>
                      <input
                        id="phone"
                        type="tel"
                        name="phone"
                        placeholder="e.g. 9829575967"
                        maxLength={12}
                        value={form.phone}
                        onChange={update('phone')}
                        required
                      />
                      {errors.phone && <span className="form-error">{errors.phone}</span>}
                    </div>
                  </div>

                  <div className="form-row">
                    <div className="form-field">
                      <label htmlFor="email">Email Address *</label>
                      <input
                        id="email"
                        type="email"
                        name="email"
                        placeholder="e.g. contact@example.com"
                        value={form.email}
                        onChange={update('email')}
                        required
                      />
                      {errors.email && <span className="form-error">{errors.email}</span>}
                    </div>

                    <div className="form-field">
                      <label htmlFor="companyName">Company / Business Name (Optional)</label>
                      <input
                        id="companyName"
                        type="text"
                        name="companyName"
                        placeholder="e.g. Sharma Marbles & Builders"
                        value={form.companyName}
                        onChange={update('companyName')}
                      />
                    </div>
                  </div>
                </div>

                {/* Section 2: Delivery Destination */}
                <div className="form-section">
                  <h4 className="form-section__title">
                    <span className="form-section__step">2</span>
                    Delivery Destination
                  </h4>

                  <div className="delivery-route-box">
                    <h5>
                      <Icon name="target" size={16} /> Unloading / Site Delivery Address
                    </h5>

                    <div className="form-row">
                      <div className="form-field">
                        <label htmlFor="dropCity">Destination City *</label>
                        <input
                          id="dropCity"
                          type="text"
                          name="dropCity"
                          placeholder="e.g. Jammu, Delhi, Bengaluru, Mumbai"
                          value={form.dropCity}
                          onChange={update('dropCity')}
                          required
                        />
                        {errors.dropCity && <span className="form-error">{errors.dropCity}</span>}
                      </div>

                      <div className="form-field">
                        <label htmlFor="dropState">Destination State *</label>
                        <select
                          id="dropState"
                          name="dropState"
                          value={form.dropState}
                          onChange={update('dropState')}
                          required
                        >
                          <option value="">-- Select State --</option>
                          {INDIAN_STATES.map((st) => (
                            <option key={st} value={st}>{st}</option>
                          ))}
                        </select>
                        {errors.dropState && <span className="form-error">{errors.dropState}</span>}
                      </div>
                    </div>

                    <div className="form-row">
                      <div className="form-field" style={{ flex: 2 }}>
                        <label htmlFor="dropAddress">Complete Delivery Address *</label>
                        <input
                          id="dropAddress"
                          type="text"
                          name="dropAddress"
                          placeholder="Site address, Plot / Godown / Shop No., Landmark"
                          value={form.dropAddress}
                          onChange={update('dropAddress')}
                          required
                        />
                        {errors.dropAddress && <span className="form-error">{errors.dropAddress}</span>}
                      </div>

                      <div className="form-field" style={{ flex: 1 }}>
                        <label htmlFor="dropPin">Destination Pincode</label>
                        <input
                          id="dropPin"
                          type="text"
                          name="dropPin"
                          placeholder="e.g. 180001"
                          maxLength={6}
                          value={form.dropPin}
                          onChange={update('dropPin')}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Section 3: Cargo Details (Multiple Stones) */}
                <div className="form-section">
                  <h4 className="form-section__title">
                    <span className="form-section__step">3</span>
                    Cargo Details (Select Multiple Stones)
                  </h4>
                  <p style={{ fontSize: '14px', color: 'var(--thm-gray)', marginBottom: '16px' }}>
                    Select the stones you wish to include in this order. For each stone, mention the slab dimensions,
                    total slab count, or total quantity in tonnes.
                  </p>

                  {errors.stones && (
                    <div className="alert alert--error" style={{ marginBottom: '16px' }}>
                      <Icon name="close" size={14} />
                      <span>{errors.stones}</span>
                    </div>
                  )}

                  <div className="cargo-stones-container">
                    <div className="cargo-stones-list">
                      {form.stones.map((stoneItem, index) => (
                        <div key={index} className="cargo-stone-card">
                          <div className="cargo-stone-card__header">
                            <span className="cargo-stone-card__title">
                              <span className="cargo-stone-card__badge">{index + 1}</span>
                              Stone #{index + 1}
                            </span>
                            {form.stones.length > 1 && (
                              <button
                                type="button"
                                className="cargo-stone-card__remove"
                                onClick={() => removeStone(index)}
                                aria-label={`Remove Stone ${index + 1}`}
                              >
                                <Icon name="close" size={12} /> Remove
                              </button>
                            )}
                          </div>

                          <div className="cargo-stone-grid">
                            <div className="form-field">
                              <label htmlFor={`stoneName-${index}`}>Stone Type *</label>
                              <select
                                id={`stoneName-${index}`}
                                value={stoneItem.stoneName}
                                onChange={(e) => handleStoneChange(index, 'stoneName', e.target.value)}
                              >
                                {STONE_OPTIONS.map((opt) => (
                                  <option key={opt} value={opt}>{opt}</option>
                                ))}
                              </select>
                            </div>

                            <div className="form-field">
                              <label htmlFor={`slabSize-${index}`}>Size of Slabs</label>
                              <input
                                id={`slabSize-${index}`}
                                type="text"
                                placeholder="e.g. 8x4 ft, 10x6 ft, 18mm"
                                value={stoneItem.slabSize}
                                onChange={(e) => handleStoneChange(index, 'slabSize', e.target.value)}
                              />
                            </div>

                            <div className="form-field">
                              <label htmlFor={`slabCount-${index}`}>Slab Count</label>
                              <input
                                id={`slabCount-${index}`}
                                type="text"
                                placeholder="e.g. 120 Slabs"
                                value={stoneItem.slabCount}
                                onChange={(e) => handleStoneChange(index, 'slabCount', e.target.value)}
                              />
                            </div>

                            <div className="form-field">
                              <label htmlFor={`quantityTonnes-${index}`}>Quantity in Tonne</label>
                              <input
                                id={`quantityTonnes-${index}`}
                                type="text"
                                placeholder="e.g. 15 Tonnes"
                                value={stoneItem.quantityTonnes}
                                onChange={(e) => handleStoneChange(index, 'quantityTonnes', e.target.value)}
                              />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div>
                      <button
                        type="button"
                        className="btn-add-stone"
                        onClick={addStone}
                      >
                        <Icon name="check" size={14} /> ＋ Add Another Stone to Order
                      </button>
                    </div>
                  </div>

                  <div className="form-row" style={{ marginTop: '24px' }}>
                    <div className="form-field" style={{ flex: 1 }}>
                      <label htmlFor="arrivedByDate">Arrived By Date *</label>
                      <input
                        id="arrivedByDate"
                        type="date"
                        name="arrivedByDate"
                        min={new Date().toISOString().split('T')[0]}
                        value={form.arrivedByDate}
                        onChange={update('arrivedByDate')}
                        required
                      />
                      <small style={{ fontSize: '12px', color: 'var(--thm-muted)', marginTop: '4px', display: 'block' }}>
                        Target date by which your shipment needs to arrive at the destination
                      </small>
                      {errors.arrivedByDate && <span className="form-error">{errors.arrivedByDate}</span>}
                    </div>

                    <div className="form-field" style={{ flex: 2 }}>
                      <label htmlFor="specialInstructions">Special Instructions / Handling Notes</label>
                      <textarea
                        id="specialInstructions"
                        name="specialInstructions"
                        rows={2}
                        placeholder="e.g. Need wooden spacers for polished slabs, crane unloading required, specific site contact..."
                        value={form.specialInstructions}
                        onChange={update('specialInstructions')}
                      />
                    </div>
                  </div>
                </div>

                {/* Honeypot for spam bots */}
                <input
                  type="text"
                  name="website"
                  value={form.website}
                  onChange={update('website')}
                  autoComplete="off"
                  tabIndex={-1}
                  className="hp-field"
                  aria-hidden="true"
                />

                <div className="form-submit-row">
                  <a
                    href={createWhatsAppOrderLink(form)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="thm-btn thm-btn--whatsapp thm-btn--lg"
                    onClick={handleWhatsAppBooking}
                  >
                    <Icon name="whatsapp" size={20} /> Book via WhatsApp
                  </a>
                </div>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* Process Section: How It Works */}
      <section className="transport-steps">
        <div className="container">
          <div className="section-title text-center">
            <span className="section-title__tagline">Seamless Freight Process</span>
            <h2 className="section-title__title">How Your Order Moves from Pit to Site</h2>
          </div>

          <div className="transport-steps__grid">
            <div className="step-card">
              <span className="step-card__num">01</span>
              <h4>Place Your Order</h4>
              <p>Select your stones, slab sizes or tonnage, destination, and target arrival date through our form or WhatsApp.</p>
            </div>
            <div className="step-card">
              <span className="step-card__num">02</span>
              <h4>Vehicle Allocation</h4>
              <p>Our fleet manager assigns the ideal truck, confirms freight charges, and schedules transit to meet your arrival date.</p>
            </div>
            <div className="step-card">
              <span className="step-card__num">03</span>
              <h4>Safe Loading & Transit</h4>
              <p>Stone is securely packed, braced with timber, covered, and dispatched with e-way documentation.</p>
            </div>
            <div className="step-card">
              <span className="step-card__num">04</span>
              <h4>On-Time Delivery</h4>
              <p>Direct doorstep unloading at your warehouse, site, or project location across India by the promised arrival date.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Major Routes & Corridors */}
      <section className="transport-routes">
        <div className="container">
          <div className="section-title text-center">
            <span className="section-title__tagline">National Connectivity</span>
            <h2 className="section-title__title">Popular Haulage Routes from Makrana</h2>
          </div>

          <div className="routes-table-wrap">
            <table className="routes-table">
              <thead>
                <tr>
                  <th>Origin Hub</th>
                  <th>Destination Corridor</th>
                  <th>Typical Transit Time</th>
                  <th>Fleet Frequency</th>
                </tr>
              </thead>
              <tbody>
                {KEY_ROUTES.map((route) => (
                  <tr key={route.to}>
                    <td><strong>{route.from}, Rajasthan</strong></td>
                    <td>{route.to}</td>
                    <td><span className="route-tag">{route.duration}</span></td>
                    <td>Daily Dispatches</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Call To Action Banner */}
      <section className="transport-cta">
        <div className="container">
          <div className="transport-cta__inner">
            <div className="transport-cta__content">
              <h3>Have Bulk Stone or Continuous Factory Supply Needs?</h3>
              <p>Speak directly with our transport dispatchers for monthly contractual rates and dedicated fleet deployment.</p>
            </div>
            <div className="transport-cta__actions">
              <a href={SITE.phoneHref} className="thm-btn thm-btn--white">
                <Icon name="phone" size={16} /> Call {SITE.phone}
              </a>
              <a href={SITE.whatsapp} target="_blank" rel="noopener noreferrer" className="thm-btn thm-btn--whatsapp">
                <Icon name="whatsapp" size={16} /> WhatsApp Dispatch
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
