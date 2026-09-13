import { IMAGES } from '../lib/assets.js';

/**
 * Single source of truth for business identity and page copy.
 *
 * NOTE: no social profiles were supplied, so `socials` is empty and every
 * social block in the UI renders nothing until you add URLs here.
 */
export const SITE = {
  name: 'Jammu Makrana Transport',
  subName: 'Komal Minerals Supplier',
  legalName: 'Jammu Makrana Transport & Komal Minerals Supplier',
  proprietor: 'Ramakishan Prajapat',
  since: 1985,
  gst: '08DJQPP5480R1ZX',
  businessType: 'Stone & Mineral Supplier',
  supplyArea: 'All India',

  tagline: 'Marble, Granite & Mineral Supplier in Makrana, Rajasthan',

  // Two lines, as provided. `phone` is the primary used for the tap-to-call button.
  phones: [
    { label: '+91 98295 75967', href: 'tel:+919829575967' },
    { label: '+91 70145 08778', href: 'tel:+917014508778' },
  ],
  phone: '+91 98295 75967',
  phoneHref: 'tel:+919829575967',
  whatsappNumber: '919829575967',

  // TODO: replace with the real business address before launch.
  email: 'info@example.com',
  emailHref: 'mailto:info@example.com',

  office: {
    label: 'Office',
    lines: ['Jammu Makrana Transport Co.', 'Near Girdhar Gas Agency, Makrana', 'Rajasthan, India'],
    short: 'Near Girdhar Gas Agency, Makrana, Rajasthan',
  },
  works: {
    label: 'Factory & Mines',
    lines: ['RIICO Area, Bidyand Road', 'Makrana, Rajasthan, India'],
    short: 'RIICO Area, Bidyand Road, Makrana, Rajasthan',
  },

  maps: 'https://www.google.com/maps/search/?api=1&query=RIICO+Area+Bidyand+Road+Makrana+Rajasthan',
  whatsapp: 'https://wa.me/919829575967?text=Hi,%20I%20Want%20To%20Enquire%20About',
  whatsappApi: 'https://api.whatsapp.com/send?phone=919829575967',

  /** Empty until profiles are supplied — UI hides social blocks when empty. */
  socials: [],
};

export const NAV_LINKS = [
  { label: 'Home', to: '/' },
  { label: 'About', to: '/about' },
  { label: 'Transportation', to: '/transportation' },
  { label: 'Stone Range', to: '/stone-range' },
  { label: 'Stone Products', to: '/stone-products' },
  { label: 'Contact', to: '/contact' },
];

export const FOOTER_TEXT =
  'Jammu Makrana Transport & Komal Minerals Supplier has been supplying natural stone and minerals from Makrana, Rajasthan since 1985. We source at the quarry, process in our own RIICO Area unit, and deliver across India on our own transport fleet — so quality and timelines stay in our hands from pit to project.';

export const FOOTER_LINKS = [
  { label: 'Home', to: '/' },
  { label: 'About Us', to: '/about' },
  { label: 'Transportation', to: '/transportation' },
  { label: 'Stone Range', to: '/stone-range' },
  { label: 'Stone Products', to: '/stone-products' },
  { label: 'Contact', to: '/contact' },
];

export const HERO_SUBTITLE = 'Marble, granite and minerals supplied across India since 1985.';

export const HERO_SLIDES = [
  {
    kicker: 'Serving India since 1985',
    script: 'Makrana Marble',
    title: 'Stone Straight from the Source',
    image: IMAGES.sliders[0],
  },
  {
    kicker: 'Marble · Granite · Minerals',
    script: 'Komal Minerals',
    title: 'A Range for Every Project',
    image: IMAGES.sliders[1],
  },
  {
    kicker: 'Our Own Transport Division',
    script: 'All India Delivery',
    title: 'Moved on Our Own Wheels',
    image: IMAGES.sliders[2],
  },
];

export const HOME_SERVICES = [
  {
    title: 'Mining & Sourcing',
    icon: 'factory',
    text: "Raw blocks are selected at Makrana's quarries and our partner mines across Rajasthan, then graded before they leave the pit.",
  },
  {
    title: 'Processing & Finishing',
    icon: 'badge',
    text: 'Cutting, calibrating and polishing take place in our own RIICO Area unit, checked at every stage by experienced supervisors.',
  },
  {
    title: 'Transport & Delivery',
    icon: 'handshake',
    text: 'Our transport division loads, documents and moves every consignment nationwide, so one team answers for the whole order.',
  },
];

/**
 * Counter figures. Only "Years in Business" is derived from a known fact
 * (trading since 1985). The rest are PLACEHOLDERS — confirm or correct them
 * before launch; do not publish numbers you cannot stand behind.
 */
export const COUNTERS = [
  { value: new Date().getFullYear() - SITE.since, suffix: '+', label: 'Years in Business', icon: 'factory' },
  { value: 500, suffix: '+', label: 'Consignments Delivered', icon: 'building' },
  { value: 50, suffix: '+', label: 'Stone Varieties Sourced', icon: 'globe' },
  { value: 20, suffix: '+', label: 'States Reached', icon: 'smile' },
];

export const PROJECT_STEPS = [
  { title: 'Sourced at the quarry', text: 'Blocks selected and graded where they are mined' },
  { title: 'Finished in our own unit', text: 'Cutting, polishing and quality checks under one roof' },
];

/** Why choose us — replaces the previous customer testimonials. */
export const TRUST_POINTS = [
  {
    title: 'Trading since 1985',
    text: 'Four decades of continuous supply from the Makrana belt.',
    icon: 'badge',
  },
  {
    title: 'GST registered',
    text: `GST No. ${SITE.gst} — fully compliant invoicing for every order.`,
    icon: 'check',
  },
  {
    title: 'Own transport division',
    text: 'Stone and minerals moved on our own fleet, not outsourced.',
    icon: 'building',
  },
  {
    title: 'Serving all India',
    text: 'Consignments dispatched to projects in every state.',
    icon: 'globe',
  },
];

export const ABOUT = {
  intro: `Jammu Makrana Transport & Komal Minerals Supplier is a Makrana-based house of natural stone and minerals, trading since 1985 under ${SITE.proprietor}. Makrana has supplied the world's finest white marble for centuries, and we have spent four decades sourcing, processing and moving it.`,
  intro2:
    'We select raw blocks at the quarry, finish them in our own unit at RIICO Area on Bidyand Road, and dispatch nationwide through our transport division. Because sourcing, processing and carriage all sit with one team, our customers deal with a single point of contact from enquiry to delivery. We supply marble, granite, sandstone, limestone and slate alongside the minerals we trade.',
  aspects: [
    {
      title: 'In-House Transport',
      label: 'Our Own Fleet',
      text: 'Jammu Makrana Transport moves every consignment, so loading and delivery stay under our control.',
      icon: 'building',
    },
    {
      title: 'Processing Unit',
      label: 'RIICO Area',
      text: 'Our factory and mines sit at RIICO Area, Bidyand Road, Makrana, with cutting and finishing handled on site.',
      icon: 'factory',
    },
    {
      title: 'Four Decades',
      label: 'Since 1985',
      text: 'Continuously supplying stone and minerals since 1985 — an established name in the Makrana belt.',
      icon: 'badge',
    },
  ],
  ideology: [
    {
      step: '01',
      title: 'Sourcing',
      text: "Blocks are selected directly at Makrana's quarries and partner mines across Rajasthan, and graded for tone and consistency before purchase.",
    },
    {
      step: '02',
      title: 'Processing',
      text: 'Blocks are cut, calibrated and surface-finished at our RIICO Area unit to the sizes and finishes your specification calls for.',
    },
    {
      step: '03',
      title: 'Transport',
      text: 'Finished consignments are loaded, documented and dispatched anywhere in India through our own transport division.',
    },
  ],
};

export const STONE_PRODUCTS = [
  {
    title: 'Tiles & Slabs',
    text: 'Calibrated tiles and slabs in the stones we carry, cut to your module and packed for road freight.',
  },
  {
    title: 'Blocks & Rough Stone',
    text: 'Quarry-fresh blocks and rough stone, graded at source for processors and project buyers.',
  },
  {
    title: 'Steps & Risers',
    text: 'Precision-cut stair treads with bullnose, chamfered or straight edges, supplied in matched lots.',
  },
  {
    title: 'Pebbles & Cobbles',
    text: 'Tumbled pebbles, setts and cobblestones for landscaping, driveways and water features.',
  },
  {
    title: 'Columns & Carved Work',
    text: 'Turned columns, capitals and hand-carved elements, alongside CNC-milled panels and jaalis.',
  },
  {
    title: 'Industrial Minerals',
    text: 'Mineral grades supplied in bulk to processors and manufacturers, dispatched on our own fleet.',
  },
];
