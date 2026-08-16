import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../types';
import { AdminService } from '../services/admin.service';

export class AdminController {
  static async getDashboard(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const stats = await AdminService.getDashboardStats();
      res.status(200).json({ success: true, data: stats });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message || 'Failed to fetch dashboard stats' });
    }
  }

  static async createProduct(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const product = await AdminService.createProduct(req.body);
      res.status(201).json({ success: true, message: 'Product created successfully', data: product });
    } catch (error: any) {
      res.status(400).json({ success: false, message: error.message || 'Failed to create product' });
    }
  }

  static async updateProduct(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = String(req.params.id);
      const product = await AdminService.updateProduct(id, req.body);
      res.status(200).json({ success: true, message: 'Product updated successfully', data: product });
    } catch (error: any) {
      res.status(400).json({ success: false, message: error.message || 'Failed to update product' });
    }
  }

  static async deleteProduct(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = String(req.params.id);
      await AdminService.deleteProduct(id);
      res.status(200).json({ success: true, message: 'Product deleted successfully' });
    } catch (error: any) {
      res.status(400).json({ success: false, message: error.message || 'Failed to delete product' });
    }
  }

  static async upsertPrice(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const priceRecord = await AdminService.upsertPrice(req.body);
      res.status(200).json({
        success: true,
        message: 'Price updated and logged to PriceHistory successfully!',
        data: priceRecord,
      });
    } catch (error: any) {
      res.status(400).json({ success: false, message: error.message || 'Failed to update price' });
    }
  }

  static async deletePrice(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = String(req.params.id);
      await AdminService.deletePrice(id);
      res.status(200).json({ success: true, message: 'Price deleted successfully' });
    } catch (error: any) {
      res.status(400).json({ success: false, message: error.message || 'Failed to delete price' });
    }
  }
}
