import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { startCleanupCron } from './cron/cleanup';
import authRouter from './auth/auth.router';

dotenv.config();

const app = express();
const PORT = parseInt(process.env.PORT || '3813', 10);

app.use(cors());
app.use(express.json({ limit: '10mb' }));

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.use('/api/auth', authRouter);

// Error handler — must be last, after all routes
app.use((err: Error & { statusCode?: number }, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  const status = err.statusCode || 500;
  const message = status < 500 ? err.message : 'Internal server error';
  if (status >= 500) console.error('Unhandled error:', err.message);
  res.status(status).json({ error: message });
});

app.listen(PORT, () => {
  console.log(`Avito Georgia API running on port ${PORT}`);
  startCleanupCron();
});

export default app;
