import { Router } from 'express';
import { connectDb, isDbConfigured } from '../lib/db.js';
import Enquiry from '../models/Enquiry.js';

const router = Router();

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// In-memory fallback so the contact form still works before Atlas is wired up.
// Serverless instances are short-lived, so this is a dev convenience only.
const memory = globalThis.__jmtEnquiries || (globalThis.__jmtEnquiries = []);

/**
 * POST /api/enquiries
 * Body: { name, email, phone, subject, message, stoneOfInterest? }
 */
router.post('/', async (req, res) => {
  const { name, email, phone, subject, message, stoneOfInterest } = req.body ?? {};

  const errors = {};
  if (!name?.trim()) errors.name = 'Name is required';
  if (!email?.trim() || !EMAIL_RE.test(email.trim())) errors.email = 'A valid email is required';
  if (!phone?.trim()) errors.phone = 'Phone is required';
  if (!subject?.trim()) errors.subject = 'Subject is required';
  if (!message?.trim() || message.trim().length < 10) {
    errors.message = 'Please tell us a little more (10+ characters)';
  }

  if (Object.keys(errors).length) {
    return res.status(400).json({ error: 'Validation failed', errors });
  }

  const payload = {
    name: name.trim(),
    email: email.trim().toLowerCase(),
    phone: phone.trim(),
    subject: subject.trim(),
    message: message.trim(),
    stoneOfInterest: stoneOfInterest?.trim() || '',
  };

  try {
    if (isDbConfigured()) {
      await connectDb();
      const created = await Enquiry.create(payload);
      return res.status(201).json({ source: 'mongodb', data: created });
    }
  } catch (err) {
    console.error('[enquiries] MongoDB write failed:', err.message);
    return res.status(503).json({ error: 'Could not save your enquiry. Please call or email us.' });
  }

  memory.push({ ...payload, id: `local-${memory.length + 1}`, createdAt: new Date().toISOString() });
  return res.status(201).json({ source: 'memory', data: payload });
});

/**
 * GET /api/enquiries
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
    const data = await Enquiry.find().sort({ createdAt: -1 }).limit(200).lean({ virtuals: false });
    return res.json({ count: data.length, data });
  }

  return res.json({ count: memory.length, data: [...memory].reverse() });
});

export default router;
