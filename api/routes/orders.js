import { Router } from 'express';
import { connectDb, isDbConfigured } from '../lib/db.js';
import Order from '../models/Order.js';

const router = Router();

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// In-memory fallback so orders still work before Atlas is wired up.
const memory = globalThis.__jmtOrders || (globalThis.__jmtOrders = []);

function generateOrderNumber() {
  const prefix = 'JMT';
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.floor(1000 + Math.random() * 9000);
  return `${prefix}-${timestamp}-${random}`;
}

/**
 * POST /api/orders
 * Body: {
 *   fullName, phone, email, companyName?,
 *   dropCity, dropState, dropAddress, dropPin?,
 *   stones: [{ stoneName, slabSize?, slabCount?, quantityTonnes? }],
 *   arrivedByDate, specialInstructions?,
 *   pickupCity?, pickupAddress?, pickupPin?, vehicleType?
 * }
 */
router.post('/', async (req, res) => {
  const {
    fullName,
    phone,
    email,
    companyName,
    dropCity,
    dropState,
    dropAddress,
    dropPin,
    stones,
    arrivedByDate,
    pickupDate,
    specialInstructions,
    // Optional / legacy fields
    pickupCity,
    pickupAddress,
    pickupPin,
    vehicleType,
    materialType,
    quantity,
    weightTonnes,
  } = req.body ?? {};

  const errors = {};
  if (!fullName?.trim()) errors.fullName = 'Full name is required';
  if (!phone?.trim()) errors.phone = 'Phone number is required';
  if (!email?.trim() || !EMAIL_RE.test(email.trim())) errors.email = 'A valid email is required';

  if (!dropCity?.trim()) errors.dropCity = 'Destination city is required';
  if (!dropState?.trim()) errors.dropState = 'Destination state is required';
  if (!dropAddress?.trim()) errors.dropAddress = 'Destination address is required';

  const effectiveArrivalDate = (arrivedByDate || pickupDate || '').trim();
  if (!effectiveArrivalDate) {
    errors.arrivedByDate = 'Arrived by date is required';
  }

  // Parse and validate stones array
  let parsedStones = [];
  if (Array.isArray(stones) && stones.length > 0) {
    parsedStones = stones
      .map((item) => ({
        stoneName: String(item.stoneName || '').trim(),
        slabSize: String(item.slabSize || '').trim(),
        slabCount: String(item.slabCount || '').trim(),
        quantityTonnes: String(item.quantityTonnes || '').trim(),
      }))
      .filter((item) => item.stoneName);

    if (!parsedStones.length) {
      errors.stones = 'Please select at least one stone and specify slab size, slab count, or tonnes';
    }
  } else if (materialType?.trim()) {
    // Backwards compatibility with legacy single material payload
    parsedStones = [
      {
        stoneName: materialType.trim(),
        slabSize: '',
        slabCount: quantity?.trim() || '',
        quantityTonnes: weightTonnes?.trim() || '',
      },
    ];
  } else {
    errors.stones = 'Please add at least one stone to your cargo details';
  }

  if (Object.keys(errors).length) {
    return res.status(400).json({ error: 'Validation failed', errors });
  }

  const orderNumber = generateOrderNumber();

  // Generate convenient summary strings for quick view
  const summaryMaterial = parsedStones.map((s) => s.stoneName).join(', ');
  const summaryQuantity = parsedStones
    .map((s) => {
      const parts = [];
      if (s.slabSize) parts.push(`Size: ${s.slabSize}`);
      if (s.slabCount) parts.push(`${s.slabCount} Slabs`);
      if (s.quantityTonnes) parts.push(`${s.quantityTonnes} Tonnes`);
      return `${s.stoneName}${parts.length ? ` (${parts.join(', ')})` : ''}`;
    })
    .join('; ');

  const summaryWeight = parsedStones
    .map((s) => s.quantityTonnes)
    .filter(Boolean)
    .join(' + ');

  const payload = {
    orderNumber,
    fullName: fullName.trim(),
    phone: phone.trim(),
    email: email.trim().toLowerCase(),
    companyName: companyName?.trim() || '',

    dropCity: dropCity.trim(),
    dropState: dropState.trim(),
    dropAddress: dropAddress.trim(),
    dropPin: dropPin?.trim() || '',

    pickupCity: pickupCity?.trim() || 'Makrana',
    pickupAddress: pickupAddress?.trim() || '',
    pickupPin: pickupPin?.trim() || '',

    stones: parsedStones,
    materialType: summaryMaterial,
    quantity: summaryQuantity,
    weightTonnes: summaryWeight || weightTonnes?.trim() || '',

    arrivedByDate: effectiveArrivalDate,
    pickupDate: effectiveArrivalDate,

    vehicleType: vehicleType?.trim() || '',
    specialInstructions: specialInstructions?.trim() || '',
    status: 'new',
  };

  try {
    if (isDbConfigured()) {
      await connectDb();
      const created = await Order.create(payload);
      return res.status(201).json({ source: 'mongodb', data: created });
    }
  } catch (err) {
    console.error('[orders] MongoDB write failed:', err.message);
    return res.status(503).json({ error: 'Could not save your order. Please call or WhatsApp us directly.' });
  }

  const record = {
    ...payload,
    id: `local-${memory.length + 1}`,
    createdAt: new Date().toISOString(),
  };
  memory.push(record);
  return res.status(201).json({ source: 'memory', data: record });
});

/**
 * GET /api/orders
 * Requires the `x-admin-token` header to match ADMIN_TOKEN when set.
 */
router.get('/', async (req, res) => {
  const token = process.env.ADMIN_TOKEN;
  if (!token) {
    return res.status(403).json({ error: 'Set ADMIN_TOKEN to enable this endpoint' });
  }
  if (req.get('x-admin-token') !== token) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  if (isDbConfigured()) {
    await connectDb();
    const data = await Order.find().sort({ createdAt: -1 }).limit(200).lean({ virtuals: false });
    return res.json({ count: data.length, data });
  }

  return res.json({ count: memory.length, data: [...memory].reverse() });
});

export default router;
