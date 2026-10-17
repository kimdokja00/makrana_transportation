/**
 * Stone range catalogue.
 *
 * Images are referenced by path only; the client prefixes the asset base URL
 * (see client/src/lib/assets.js — those images still point at the previous
 * site and must be replaced with your own photography before launch).
 */
export const stones = [
  {
    name: 'Marble',
    slug: 'marble-manufacturer-in-india',
    tagline: 'Komal Minerals Supplier',
    category: 'Marble',
    image: 'products/Marble.jpg',
    origin: 'Rajasthan, India',
    order: 1,
    featured: true,
    description:
      'Our marble is quarried from the finest belts of Rajasthan and finished to a mirror polish. Each block is graded for vein consistency, so every slab carries the same depth of character across your project.',
    finishes: ['Polished', 'Honed', 'Sandblasted', 'Brushed'],
    applications: ['Flooring', 'Cladding', 'Countertops', 'Staircases'],
  },
  {
    name: 'Sandstone',
    slug: 'sandstone-manufacturer-in-india',
    tagline: 'Komal Minerals Supplier',
    category: 'Sandstone',
    image: 'products/Sandstone.png',
    origin: 'Rajasthan, India',
    order: 2,
    featured: true,
    description:
      'Warm, tactile and naturally split, sandstone is the material of courtyards and colonnades. We supply paving, cladding and carved elements in matched batches for large elevations.',
    finishes: ['Natural split', 'Honed', 'Sandblasted', 'Rough'],
    applications: ['Paving', 'Wall cladding', 'Jali screens', 'Landscaping'],
  },
  {
    name: 'Limestone',
    slug: 'limestone-manufacturer-in-india',
    tagline: 'Komal Minerals Supplier',
    category: 'Limestone',
    image: 'products/Limestone.png',
    origin: 'Rajasthan, India',
    order: 3,
    featured: true,
    description:
      'Limestone offers a quiet, even surface with subtle fossil detail. It is a favourite for expansive flooring where consistency matters more than drama.',
    finishes: ['Honed', 'Polished', 'Tumbled', 'Brushed'],
    applications: ['Flooring', 'Cladding', 'Coping', 'Pool surrounds'],
  },
  {
    name: 'Cobblestone',
    slug: 'cobblestone-manufacturer-in-india',
    tagline: 'Komal Minerals Supplier',
    category: 'Stone Products',
    image: 'products/cobblestone.jpg',
    origin: 'Rajasthan, India',
    order: 4,
    featured: true,
    description:
      'Hand-finished cobblestones and setts in granite, sandstone and basalt. Tumbled or riven, they bring a settled, pedestrian-scale texture to drives, plazas and garden walks.',
    finishes: ['Tumbled', 'Natural', 'Split face'],
    applications: ['Driveways', 'Plazas', 'Garden paths', 'Edging'],
  },
];

export default stones;
