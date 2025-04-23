import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import userRoutes from './src/features/user/user.routes.js';
import { notFound, errorHandler } from './src/middleware/error.middleware.js';

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/users', userRoutes);

// Error handling
app.use(notFound);
app.use(errorHandler);

export default app;
