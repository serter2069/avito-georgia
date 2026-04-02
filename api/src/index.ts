import express from 'express';
import http from 'http';
import cors from 'cors';
import dotenv from 'dotenv';
import { startCleanupCron } from './cron/cleanup';
import { setupSocket } from './socket';
import authRouter from './routes/auth';
import listingsRouter from './routes/listings';
import favoritesRouter from './routes/favorites';
import categoriesRouter from './routes/categories';
import chatRouter from './routes/chat';
import reportsRouter from './routes/reports';

dotenv.config();

const app = express();
const httpServer = http.createServer(app);
const PORT = parseInt(process.env.PORT || '3813', 10);

app.use(cors());
app.use(express.json({ limit: '10mb' }));

app.use('/api/auth', authRouter);
app.use('/api/listings', listingsRouter);
app.use('/api/favorites', favoritesRouter);
app.use('/api/categories', categoriesRouter);
app.use('/api', chatRouter);
app.use('/api/reports', reportsRouter);

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
