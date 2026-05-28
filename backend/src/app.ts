import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import { assignmentRouter } from './routes/assignments';
import { errorHandler } from './middleware/errorHandler';

const app = express();

// Security
app.use(helmet());
app.use(
  cors({
    origin: process.env.FRONTEND_URL ?? 'http://localhost:3000',
    credentials: true,
  })
);

// Rate limiting
app.set('trust proxy', 1); // Trust first proxy (Render)
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
});
app.use('/api', limiter);

// Logging
if (process.env.NODE_ENV !== 'test') {
  app.use(morgan('combined'));
}

// Body parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/assignments', assignmentRouter);

// Health check
app.get('/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Error handler (must be last)
app.use(errorHandler);

export default app;
