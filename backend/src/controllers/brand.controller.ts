import { Request, Response, NextFunction } from 'express';
import { BrandService } from '../services/brand.service';

export class BrandController {
  static async getAll(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const brands = await BrandService.getAllBrands();
      res.status(200).json({
        success: true,
        data: brands,
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message || 'Failed to fetch brands',
      });
    }
  }

  static async getBySlug(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const slug = String(req.params.slug);
      const brand = await BrandService.getBrandBySlug(slug);
      res.status(200).json({
        success: true,
        data: brand,
      });
    } catch (error: any) {
      res.status(404).json({
        success: false,
        message: error.message || 'Brand not found',
      });
    }
  }
}
