/**
 * Client-side mirror of `api/data/stones.js`.
 *
 * Used only when /api/stones cannot be reached (e.g. the Express function has
 * not been wired to MongoDB yet), so the Stone Range page always renders.
 * Keep it in sync with the API seed data.
 */
export const stones = [
  { name: 'Marble', slug: 'marble-manufacturer-in-india', tagline: 'Komal Minerals Supplier', category: 'Marble', image: 'products/Marble.jpg', origin: 'Rajasthan, India', order: 1, featured: true },
  { name: 'Sandstone', slug: 'sandstone-manufacturer-in-india', tagline: 'Komal Minerals Supplier', category: 'Sandstone', image: 'products/Sandstone.png', origin: 'Rajasthan, India', order: 2, featured: true },
  { name: 'Limestone', slug: 'limestone-manufacturer-in-india', tagline: 'Komal Minerals Supplier', category: 'Limestone', image: 'products/Limestone.png', origin: 'Rajasthan, India', order: 3, featured: true },
  { name: 'Cobblestone', slug: 'cobblestone-manufacturer-in-india', tagline: 'Komal Minerals Supplier', category: 'Stone Products', image: 'products/cobblestone.jpg', origin: 'Rajasthan, India', order: 4, featured: true },
];

export default stones;
