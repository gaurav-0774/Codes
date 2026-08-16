import { Request, Response, NextFunction } from 'express';
import { PriceService } from '../services/price.service';

export class PriceController {
  static async getProductPrices(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const productId = String(req.params.productId);
      const prices = await PriceService.getProductPrices(productId);

      res.status(200).json({
        success: true,
        data: prices,
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message || 'Failed to fetch product prices',
      });
    }
  }

  static async getPriceHistory(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const productId = String(req.params.productId);
      const history = await PriceService.getPriceHistory(productId);

      res.status(200).json({
        success: true,
        data: history,
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message || 'Failed to fetch price history',
      });
    }
  }
}
