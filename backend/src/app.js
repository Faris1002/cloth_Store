import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { env } from './config/env.js';
import { apiRateLimiter } from './middleware/rateLimiter.js';
import { errorHandler, notFoundHandler } from './middleware/errorHandler.js';

// Route imports
import healthRoutes from './routes/healthRoutes.js';
import authRoutes from './routes/authRoutes.js';
import productRoutes from './routes/productRoutes.js';
import cartRoutes from './routes/cartRoutes.js';

const app = express();

// Trust reverse proxy (required for Render, Heroku, Cloudflare for real client IP and rate limiting)
app.set('trust proxy', 1);

// Security middleware
app.use(helmet());

// CORS configuration
const cleanFrontendUrl = env.FRONTEND_URL ? env.FRONTEND_URL.replace(/\/+$/, '') : '';
const allowedOrigins = [
  env.FRONTEND_URL,
  cleanFrontendUrl,
  'http://localhost:5173',
  'http://127.0.0.1:5173',
  'http://localhost:3000',
].filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps, curl, postman)
      if (!origin) return callback(null, true);
      const cleanOrigin = origin.replace(/\/+$/, '');
      if (
        allowedOrigins.includes(origin) ||
        allowedOrigins.includes(cleanOrigin) ||
        origin.startsWith('http://localhost:') ||
        origin.endsWith('.vercel.app')
      ) {
        return callback(null, true);
      }
      return callback(new Error('CORS policy does not allow access from the specified Origin.'));
    },
    credentials: true,
    methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  })
);

// Body parsing with size limits
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true, limit: '1mb' }));

// Logging
if (env.NODE_ENV !== 'test') {
  app.use(morgan(env.NODE_ENV === 'production' ? 'combined' : 'dev'));
}

// Root & Health endpoints for Render health checks and uptime monitors
app.get(['/', '/health'], (req, res) => {
  res.status(200).json({
    status: 'ok',
    service: 'clothing-store-backend',
    message: 'ModernWear API is running',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

// Global API rate limiting
app.use('/api', apiRateLimiter);

// API Routes
app.use('/api', healthRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/cart', cartRoutes);

// Catch-all 404 handler for undefined API routes
app.use(notFoundHandler);

// Centralized error handler
app.use(errorHandler);

export default app;
