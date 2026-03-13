import express, { Express } from 'express';
import cors from 'cors';
import { apiRouter } from '../../adapters/inbound/http';

const app: Express = express();

// Middleware
app.use(cors());
app.use(express.json()); // Parse JSON bodies

// Register all modular REST API routes
app.use(apiRouter);

// Health check endpoint
app.get('/health', (_req, res) => {
  res.status(200).json({ status: 'ok', message: 'FuelEU Maritime Compliance Platform API is running' });
});

// Error handling middleware
app.use((err: any, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal Server Error' });
});

export { app };
