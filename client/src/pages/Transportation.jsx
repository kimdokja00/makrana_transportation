import { useState } from 'react';
import PageHeader from '../components/PageHeader.jsx';
import Icon from '../components/Icon.jsx';
import BrandMark from '../components/BrandMark.jsx';
import { submitOrder } from '../lib/api.js';
import { usePageMeta } from '../lib/usePageMeta.js';
import { SITE } from '../data/siteContent.js';

const INITIAL_FORM = {
  fullName: '',
  phone: '',
  email: '',
  companyName: '',
  pickupCity: 'Makrana',
  pickupAddress: 'RIICO Industrial Area, Bidyand Road',
  pickupPin: '341505',
  dropCity: '',
  dropState: '',
  dropAddress: '',
  dropPin: '',
  materialType: 'Makrana White Marble Slabs / Tiles',
  quantity: '',
  weightTonnes: '',
  vehicleType: '12 Wheeler Truck (21 - 25 Tonnes)',
  pickupDate: '',
  specialInstructions: '',
  website: '', // honeypot
};

const MATERIAL_OPTIONS = [
  'Makrana White Marble Slabs / Tiles',
  'Granite Slabs & Tiles',
  'Sandstone / Kota Stone / Slate',
  'Quarry Raw Stone & Marble Blocks',
  'Industrial Minerals (Calcite, Dolomite, Quartz)',
  'Heavy Machinery & Quarry Equipment',
  'General Freight / Other Cargo',
];

const VEHICLE_OPTIONS = [
  '10 Wheeler Truck (16 - 20 Tonnes)',
  '12 Wheeler Truck (21 - 25 Tonnes)',
  '14 / 16 Wheeler Multi-Axle (28 - 35 Tonnes)',
  'Heavy Flatbed Trailer (35 - 45 Tonnes)',
  '6 Wheeler LCV (7 - 10 Tonnes)',
  'Open High-Side Body Truck',
];

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

  const validate = () => {
    const nextErrors = {};
    if (!form.fullName.trim()) nextErrors.fullName = 'Please enter your full name';
    if (!form.phone.trim()) nextErrors.phone = 'Please enter your 10-digit mobile number';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
      nextErrors.email = 'Please enter a valid email address';
    }

    if (!form.pickupCity.trim()) nextErrors.pickupCity = 'Pickup city is required';
    if (!form.pickupAddress.trim()) nextErrors.pickupAddress = 'Pickup address is required';

    if (!form.dropCity.trim()) nextErrors.dropCity = 'Destination city is required';
    if (!form.dropState.trim()) nextErrors.dropState = 'Destination state is required';
    if (!form.dropAddress.trim()) nextErrors.dropAddress = 'Destination address is required';

    if (!form.materialType.trim()) nextErrors.materialType = 'Material type is required';
    if (!form.quantity.trim()) nextErrors.quantity = 'Please specify quantity or volume';
    if (!form.vehicleType.trim()) nextErrors.vehicleType = 'Please select a vehicle type';
    if (!form.pickupDate.trim()) nextErrors.pickupDate = 'Please select dispatch / pickup date';

    return nextErrors;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    // Honeypot spam check
    if (form.website) {
      setStatus('submitted');
      return;
    }

    const validationErrors = validate();
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) {
      // Scroll to the first error
      const firstErrorKey = Object.keys(validationErrors)[0];
      const elem = document.querySelector(`[name="${firstErrorKey}"]`);
      if (elem) elem.focus();
      return;
    }

    setStatus('submitting');
    setServerError('');

    try {
      const response = await submitOrder({
        fullName: form.fullName,
        phone: form.phone,
        email: form.email,
        companyName: form.companyName,
        pickupCity: form.pickupCity,
        pickupAddress: form.pickupAddress,
        pickupPin: form.pickupPin,
        dropCity: form.dropCity,
        dropState: form.dropState,
        dropAddress: form.dropAddress,
        dropPin: form.dropPin,
        materialType: form.materialType,
        quantity: form.quantity,
        weightTonnes: form.weightTonnes,
        vehicleType: form.vehicleType,
        pickupDate: form.pickupDate,
        specialInstructions: form.specialInstructions,
      });

      const orderData = response?.data || {
        orderNumber: `JMT-${Date.now().toString(36).toUpperCase()}`,
        ...form,
      };

      setConfirmedOrder(orderData);
      setStatus('submitted');
      setForm(INITIAL_FORM);
    } catch (err) {
      console.error('[Transportation] Order submission failed:', err);
      setStatus('error');
      setServerError(err.message || 'Unable to submit your transport order. Please contact us directly.');
      setErrors(err.errors || {});
    }
  };

  const createWhatsAppOrderLink = (order) => {
    const text = encodeURIComponent(
      `*New Transport Booking Request - Jammu Makrana Transport*\n` +
      `-----------------------------------------\n` +
      `*Booking Ref:* ${order?.orderNumber || 'Pending'}\n` +
      `*Customer:* ${order?.fullName || form.fullName}\n` +
      `*Phone:* ${order?.phone || form.phone}\n` +
      (order?.companyName ? `*Company:* ${order.companyName}\n` : '') +
      `*From:* ${order?.pickupCity || form.pickupCity}\n` +
      `*To:* ${order?.dropCity || form.dropCity}, ${order?.dropState || form.dropState}\n` +
      `*Material:* ${order?.materialType || form.materialType}\n` +
      `*Quantity/Weight:* ${order?.quantity || form.quantity} (${order?.weightTonnes || form.weightTonnes || 'As specified'})\n` +
      `*Vehicle Type:* ${order?.vehicleType || form.vehicleType}\n` +
      `*Dispatch Date:* ${order?.pickupDate || form.pickupDate}\n` +
      (order?.specialInstructions ? `*Notes:* ${order.specialInstructions}\n` : '') +
      `-----------------------------------------\n` +
      `Please confirm truck availability and freight rate.`
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
                moving marble blocks, calibrated tiles, minerals, and industrial cargo since 1985.
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
                  <span>Serving Since 1985</span>
                </div>
                <div className="transport-feature-pill">
                  <Icon name="shield" size={18} />
                  <span>Fragile Stone Care</span>
                </div>
              </div>
            </div>

            <div className="transport-overview__card">
              <div className="transport-card__header">
                <BrandMark light />
                <h3>Fast Freight Assistance</h3>
                <p>Need urgent truck placement or a custom project quote?</p>
              </div>
              <div className="transport-card__body">
                <div className="transport-card__call-box">
                  <Icon name="phone" size={20} />
                  <div>
                    <span className="label">Call Logistics Desk:</span>
                    <a href={SITE.phoneHref} className="number">{SITE.phone}</a>
                  </div>
                </div>
                <a
                  href={SITE.whatsapp}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="thm-btn thm-btn--whatsapp"
                >
                  <Icon name="whatsapp" size={18} /> Chat on WhatsApp
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Fleet Capabilities Section */}
      <section className="transport-fleet">
        <div className="container">
          <div className="section-title text-center">
            <span className="section-title__tagline">Vehicles & Payload</span>
            <h2 className="section-title__title">Our Transport Fleet Capabilities</h2>
            <p className="section-title__desc">
              Tailored carriage solutions for rough quarry blocks, polished tiles, granular minerals, and heavy machinery.
            </p>
          </div>

          <div className="transport-fleet__grid">
            {FLEET_HIGHLIGHTS.map((vehicle) => (
              <div key={vehicle.title} className="fleet-card">
                <div className="fleet-card__top">
                  <span className="fleet-card__badge">{vehicle.badge}</span>
                  <div className="fleet-card__icon">
                    <Icon name="truck" size={26} />
                  </div>
                </div>
                <h3 className="fleet-card__title">{vehicle.title}</h3>
                <div className="fleet-card__capacity">
                  <Icon name="weight" size={14} />
                  <span>Capacity: <strong>{vehicle.capacity}</strong></span>
                </div>
                <p className="fleet-card__desc">{vehicle.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Main Order Placement Section */}
      <section className="transport-booking" id="book-order">
        <div className="container">
          <div className="transport-booking__wrapper">
            <div className="section-title text-center">
              <span className="section-title__tagline">Online Booking</span>
              <h2 className="section-title__title">Place Your Transportation Order</h2>
              <p className="section-title__desc">
                Fill in your pickup, destination, and cargo requirements below. Our dispatch team
                will review your request, assign the right vehicle, and contact you with confirmation.
              </p>
            </div>

            {status === 'submitted' && confirmedOrder ? (
              <div className="order-success-card" role="status">
                <div className="order-success-card__icon">
                  <Icon name="check" size={36} />
                </div>
                <h3 className="order-success-card__title">Transportation Order Placed Successfully!</h3>
                <p className="order-success-card__subtitle">
                  Thank you, <strong>{confirmedOrder.fullName}</strong>. Your transport booking reference is:
                </p>

                <div className="order-ref-badge">
                  <span>Booking Reference:</span>
                  <strong>{confirmedOrder.orderNumber}</strong>
                </div>

                <div className="order-summary-grid">
                  <div className="order-summary-item">
                    <span className="label">Origin</span>
                    <strong>{confirmedOrder.pickupCity}</strong>
                  </div>
                  <div className="order-summary-item">
                    <span className="label">Destination</span>
                    <strong>{confirmedOrder.dropCity}, {confirmedOrder.dropState}</strong>
                  </div>
                  <div className="order-summary-item">
                    <span className="label">Material</span>
                    <strong>{confirmedOrder.materialType}</strong>
                  </div>
                  <div className="order-summary-item">
                    <span className="label">Vehicle Required</span>
                    <strong>{confirmedOrder.vehicleType}</strong>
                  </div>
                  <div className="order-summary-item">
                    <span className="label">Quantity / Weight</span>
                    <strong>{confirmedOrder.quantity} {confirmedOrder.weightTonnes ? `(${confirmedOrder.weightTonnes})` : ''}</strong>
                  </div>
                  <div className="order-summary-item">
                    <span className="label">Scheduled Date</span>
                    <strong>{confirmedOrder.pickupDate}</strong>
                  </div>
                </div>

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
              <form className="transport-form" onSubmit={handleSubmit} noValidate>
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

                {/* Section 2: Pickup & Delivery Locations */}
                <div className="form-section">
                  <h4 className="form-section__title">
                    <span className="form-section__step">2</span>
                    Pickup & Delivery Route
                  </h4>

                  <div className="form-route-grid">
                    {/* Pickup Box */}
                    <div className="form-route-box">
                      <h5>
                        <Icon name="mapPin" size={15} /> Pickup Location (Origin)
                      </h5>
                      <div className="form-field">
                        <label htmlFor="pickupCity">Pickup City *</label>
                        <input
                          id="pickupCity"
                          type="text"
                          name="pickupCity"
                          placeholder="e.g. Makrana"
                          value={form.pickupCity}
                          onChange={update('pickupCity')}
                          required
                        />
                        {errors.pickupCity && <span className="form-error">{errors.pickupCity}</span>}
                      </div>
                      <div className="form-field">
                        <label htmlFor="pickupAddress">Pickup Address / Quarry Site *</label>
                        <input
                          id="pickupAddress"
                          type="text"
                          name="pickupAddress"
                          placeholder="e.g. RIICO Industrial Area, Bidyand Road"
                          value={form.pickupAddress}
                          onChange={update('pickupAddress')}
                          required
                        />
                        {errors.pickupAddress && <span className="form-error">{errors.pickupAddress}</span>}
                      </div>
                      <div className="form-field">
                        <label htmlFor="pickupPin">Pincode</label>
                        <input
                          id="pickupPin"
                          type="text"
                          name="pickupPin"
                          placeholder="e.g. 341505"
                          maxLength={6}
                          value={form.pickupPin}
                          onChange={update('pickupPin')}
                        />
                      </div>
                    </div>

                    {/* Destination Box */}
                    <div className="form-route-box">
                      <h5>
                        <Icon name="target" size={15} /> Delivery Location (Destination)
                      </h5>
                      <div className="form-row">
                        <div className="form-field">
                          <label htmlFor="dropCity">Destination City *</label>
                          <input
                            id="dropCity"
                            type="text"
                            name="dropCity"
                            placeholder="e.g. Jammu / Delhi / Bengaluru"
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
                      <div className="form-field">
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
                      <div className="form-field">
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

                {/* Section 3: Cargo & Vehicle Specifications */}
                <div className="form-section">
                  <h4 className="form-section__title">
                    <span className="form-section__step">3</span>
                    Cargo Details & Vehicle Preference
                  </h4>

                  <div className="form-row">
                    <div className="form-field">
                      <label htmlFor="materialType">Material / Cargo Type *</label>
                      <select
                        id="materialType"
                        name="materialType"
                        value={form.materialType}
                        onChange={update('materialType')}
                        required
                      >
                        {MATERIAL_OPTIONS.map((mat) => (
                          <option key={mat} value={mat}>{mat}</option>
                        ))}
                      </select>
                      {errors.materialType && <span className="form-error">{errors.materialType}</span>}
                    </div>

                    <div className="form-field">
                      <label htmlFor="vehicleType">Preferred Vehicle Type *</label>
                      <select
                        id="vehicleType"
                        name="vehicleType"
                        value={form.vehicleType}
                        onChange={update('vehicleType')}
                        required
                      >
                        {VEHICLE_OPTIONS.map((veh) => (
                          <option key={veh} value={veh}>{veh}</option>
                        ))}
                      </select>
                      {errors.vehicleType && <span className="form-error">{errors.vehicleType}</span>}
                    </div>
                  </div>

                  <div className="form-row">
                    <div className="form-field">
                      <label htmlFor="quantity">Quantity / Volume *</label>
                      <input
                        id="quantity"
                        type="text"
                        name="quantity"
                        placeholder="e.g. 4,500 Sq Ft / 2 Raw Blocks / 800 Bags"
                        value={form.quantity}
                        onChange={update('quantity')}
                        required
                      />
                      {errors.quantity && <span className="form-error">{errors.quantity}</span>}
                    </div>

                    <div className="form-field">
                      <label htmlFor="weightTonnes">Estimated Total Weight (Tonnes)</label>
                      <input
                        id="weightTonnes"
                        type="text"
                        name="weightTonnes"
                        placeholder="e.g. 24 Tonnes"
                        value={form.weightTonnes}
                        onChange={update('weightTonnes')}
                      />
                    </div>

                    <div className="form-field">
                      <label htmlFor="pickupDate">Preferred Dispatch Date *</label>
                      <input
                        id="pickupDate"
                        type="date"
                        name="pickupDate"
                        value={form.pickupDate}
                        onChange={update('pickupDate')}
                        required
                      />
                      {errors.pickupDate && <span className="form-error">{errors.pickupDate}</span>}
                    </div>
                  </div>

                  <div className="form-field">
                    <label htmlFor="specialInstructions">Special Instructions / Handling Notes</label>
                    <textarea
                      id="specialInstructions"
                      name="specialInstructions"
                      rows={3}
                      placeholder="e.g. Requires waterproof tarpaulin cover, crane loading assistance, delicate polished marble requiring wooden spacers..."
                      value={form.specialInstructions}
                      onChange={update('specialInstructions')}
                    />
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
                  <button
                    type="submit"
                    className="thm-btn thm-btn--lg"
                    disabled={status === 'submitting'}
                  >
                    <Icon name="truck" size={18} />
                    {status === 'submitting' ? 'Submitting Booking Order…' : 'Submit Transportation Order'}
                  </button>

                  <a
                    href={createWhatsAppOrderLink(form)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="thm-btn thm-btn--whatsapp thm-btn--lg"
                  >
                    <Icon name="whatsapp" size={18} /> Book via WhatsApp
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
              <p>Submit your pickup location, cargo size, and destination through our form or WhatsApp.</p>
            </div>
            <div className="step-card">
              <span className="step-card__num">02</span>
              <h4>Vehicle Allocation</h4>
              <p>Our fleet manager assigns the ideal truck, confirms freight charges, and schedules arrival.</p>
            </div>
            <div className="step-card">
              <span className="step-card__num">03</span>
              <h4>Safe Loading & Transit</h4>
              <p>Stone is securely packed, braced with timber, covered, and dispatched with e-way documentation.</p>
            </div>
            <div className="step-card">
              <span className="step-card__num">04</span>
              <h4>On-Time Delivery</h4>
              <p>Direct doorstep unloading at your warehouse, quarry, or construction project site across India.</p>
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
