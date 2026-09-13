import express from 'express';
import cors from 'cors';

import { isDbConfigured, connectDb } from './lib/db.js';
import stonesRouter from './routes/stones.js';
import enquiriesRouter from './routes/enquiries.js';
import ordersRouter from './routes/orders.js';

const app = express();

app.disable('x-powered-by');
app.use(cors());
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true }));

/**
 * On Vercel the request is rewritten to `/api/index.js`, and depending on the
 * runtime the original path may or may not survive. Normalise both shapes so
 * the routers below always see paths without the `/api` prefix.
 *   - http://localhost:5000/api/stones  ->  /stones
 *   - /api/index.js?path=/api/stones    ->  /stones
 */
app.use((req, _res, next) => {
  req.url = req.url.replace(/^\/api\/index\.js/, '/').replace(/^\/api(?=\/|$)/, '') || '/';
  next();
});

app.get('/health', async (_req, res) => {
  let database = 'not-configured';
  if (isDbConfigured()) {
    try {
      await connectDb();
      database = 'connected';
    } catch (err) {
      database = `error: ${err.message}`;
    }
  }
  res.json({ status: 'ok', database, time: new Date().toISOString() });
});

app.use('/stones', stonesRouter);
app.use('/enquiries', enquiriesRouter);
app.use('/orders', ordersRouter);

app.use((req, res) => {
  res.status(404).json({ error: 'Not found', path: req.originalUrl });
});

// eslint-disable-next-line no-unused-vars
app.use((err, _req, res, _next) => {
  console.error('[api] unhandled error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

export default app;
