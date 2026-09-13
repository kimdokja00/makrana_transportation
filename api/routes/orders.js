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
 *   pickupCity, pickupAddress, pickupPin?,
 *   dropCity, dropState, dropAddress, dropPin?,
 *   materialType, quantity, weightTonnes?,
 *   vehicleType, pickupDate, specialInstructions?
 * }
 */
router.post('/', async (req, res) => {
  const {
    fullName,
    phone,
    email,
    companyName,
    pickupCity,
    pickupAddress,
    pickupPin,
    dropCity,
    dropState,
    dropAddress,
    dropPin,
    materialType,
    quantity,
    weightTonnes,
    vehicleType,
    pickupDate,
    specialInstructions,
  } = req.body ?? {};

  const errors = {};
  if (!fullName?.trim()) errors.fullName = 'Full name is required';
  if (!phone?.trim()) errors.phone = 'Phone number is required';
  if (!email?.trim() || !EMAIL_RE.test(email.trim())) errors.email = 'A valid email is required';

  if (!pickupCity?.trim()) errors.pickupCity = 'Pickup city is required';
  if (!pickupAddress?.trim()) errors.pickupAddress = 'Pickup address is required';

  if (!dropCity?.trim()) errors.dropCity = 'Destination city is required';
  if (!dropState?.trim()) errors.dropState = 'Destination state is required';
  if (!dropAddress?.trim()) errors.dropAddress = 'Destination address is required';

  if (!materialType?.trim()) errors.materialType = 'Material/Cargo type is required';
  if (!quantity?.trim()) errors.quantity = 'Quantity or volume is required';
  if (!vehicleType?.trim()) errors.vehicleType = 'Vehicle type is required';
  if (!pickupDate?.trim()) errors.pickupDate = 'Pickup date is required';

  if (Object.keys(errors).length) {
    return res.status(400).json({ error: 'Validation failed', errors });
  }

  const orderNumber = generateOrderNumber();

  const payload = {
    orderNumber,
    fullName: fullName.trim(),
    phone: phone.trim(),
    email: email.trim().toLowerCase(),
    companyName: companyName?.trim() || '',

    pickupCity: pickupCity.trim(),
    pickupAddress: pickupAddress.trim(),
    pickupPin: pickupPin?.trim() || '',

    dropCity: dropCity.trim(),
    dropState: dropState.trim(),
    dropAddress: dropAddress.trim(),
    dropPin: dropPin?.trim() || '',

    materialType: materialType.trim(),
    quantity: quantity.trim(),
    weightTonnes: weightTonnes?.trim() || '',

    vehicleType: vehicleType.trim(),
    pickupDate: pickupDate.trim(),
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
