import { Request, Response, NextFunction } from 'express';
import { StoreService } from '../services/store.service';

export class StoreController {
  static async getAllStores(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const stores = await StoreService.getAllStores();
      res.status(200).json({
        success: true,
        data: stores,
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message || 'Failed to fetch stores',
      });
    }
  }

  static async getStoreById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = String(req.params.id);
      const store = await StoreService.getStoreById(id);
      res.status(200).json({
        success: true,
        data: store,
      });
    } catch (error: any) {
      res.status(404).json({
        success: false,
        message: error.message || 'Store not found',
      });
    }
  }
}
