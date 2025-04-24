import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import helmet from 'helmet';
import xss from 'xss-clean';
import mongoSanitize from 'express-mongo-sanitize';
import cookieParser from 'cookie-parser';
import rateLimit from 'express-rate-limit';
import morgan from 'morgan';

import userRoutes from './src/features/user/user.routes.js';
import { notFound, errorHandler } from './src/middleware/error.middleware.js';

dotenv.config();

const app = express();

// Security Middleware
app.use(helmet());
app.use(xss());
app.use(mongoSanitize());
app.use(cookieParser());

// CORS Configuration
const allowedOrigins = [process.env.CLIENT_URL || 'http://localhost:3000'];
app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

// Rate Limiter
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 min
  max: 100, // limit each IP
});
app.use(limiter);

// Dev Logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Body parser
app.use(express.json());

app.get('/', (req, res) => {
    res.status(200).json({
      message: '👋 Welcome to the SkillSwap API!',
      version: '1.0.0',
    });
  });
  

// Routes
app.use('/api/users', userRoutes);

// 404 Handler
app.use(notFound);

// Error Handler
app.use(errorHandler);

export default app;
