import express from 'express';
import http from 'http';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';
import { startCleanupCron } from './cron/cleanup';
import { setupSocket } from './socket';
import authRouter from './routes/auth';
import listingsRouter from './routes/listings';
import favoritesRouter from './routes/favorites';
import categoriesRouter from './routes/categories';
import citiesRouter from './routes/cities';
import chatRouter from './routes/chat';
import reportsRouter from './routes/reports';
import promotionsRouter from './routes/promotions';
import stripeWebhookRouter from './routes/stripe-webhook';
import adminPaymentsRouter from './routes/admin-payments';
import usersRouter from './routes/users';

dotenv.config();

const app = express();
const httpServer = http.createServer(app);
const PORT = parseInt(process.env.PORT || '3813', 10);

app.use(cors({
  origin: [
    'https://avito-georgia.smartlaunchhub.com',
    'http://localhost:8081',
    'http://localhost:19006',
  ],
  credentials: true,
}));

const otpLimiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 5, message: { error: 'Too many requests, try again later' } });
const verifyLimiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 10, message: { error: 'Too many attempts' } });
app.use('/api/auth/request-otp', otpLimiter);
app.use('/api/auth/verify-otp', verifyLimiter);

// Stripe webhook needs raw body — MUST be before express.json()
app.use('/api/stripe-webhook', express.raw({ type: 'application/json' }), stripeWebhookRouter);

app.use(express.json({ limit: '10mb' }));

app.use('/api/auth', authRouter);
app.use('/api/listings', listingsRouter);
app.use('/api/favorites', favoritesRouter);
app.use('/api/categories', categoriesRouter);
app.use('/api/cities', citiesRouter);
app.use('/api', chatRouter);
app.use('/api/reports', reportsRouter);
app.use('/api/promotions', promotionsRouter);
app.use('/api/admin/payments', adminPaymentsRouter);
app.use('/api/users', usersRouter);

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.use((err: Error, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error('Unhandled error:', err.message);
  res.status(500).json({ error: 'Internal server error' });
});

// Setup Socket.io on the HTTP server
setupSocket(httpServer);

httpServer.listen(PORT, () => {
  console.log(`Avito Georgia API running on port ${PORT}`);
  startCleanupCron();
});

export default app;
