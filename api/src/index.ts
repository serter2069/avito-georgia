import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { startCleanupCron } from './cron/cleanup';
import authRouter from './routes/auth';

dotenv.config();

const app = express();
const PORT = parseInt(process.env.PORT || '3813', 10);

app.use(cors());
app.use(express.json({ limit: '10mb' }));

app.use('/api/auth', authRouter);

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.use((err: Error, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error('Unhandled error:', err.message);
  res.status(500).json({ error: 'Internal server error' });
});

app.listen(PORT, () => {
  console.log(`Avito Georgia API running on port ${PORT}`);
  startCleanupCron();
});

export default app;
