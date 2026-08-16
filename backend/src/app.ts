import express, { Express, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.routes';
import productRoutes from './routes/product.routes';
import categoryRoutes from './routes/category.routes';
import brandRoutes from './routes/brand.routes';
import storeRoutes from './routes/store.routes';
import priceRoutes from './routes/price.routes';
import userFeatureRoutes from './routes/userFeature.routes';
import adminRoutes from './routes/admin.routes';

dotenv.config();

const app: Express = express();

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true,
}));
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/brands', brandRoutes);
app.use('/api/stores', storeRoutes);
app.use('/api/prices', priceRoutes);
app.use('/api/user', userFeatureRoutes);
app.use('/api/admin', adminRoutes);

// Health Check API
app.get('/api/health', (req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: 'PricePilot API Service Operational',
    timestamp: new Date().toISOString(),
  });
});

// Centralized Error Handling Middleware
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error('[Unhandled Error]:', err.stack || err.message);
  res.status(500).json({
    success: false,
    message: err.message || 'Internal Server Error',
  });
});

export default app;
