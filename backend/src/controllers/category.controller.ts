import { Request, Response, NextFunction } from 'express';
import { CategoryService } from '../services/category.service';

export class CategoryController {
  static async getAll(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const categories = await CategoryService.getAllCategories();
      res.status(200).json({
        success: true,
        data: categories,
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message || 'Failed to fetch categories',
      });
    }
  }

  static async getBySlug(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const slug = String(req.params.slug);
      const category = await CategoryService.getCategoryBySlug(slug);
      res.status(200).json({
        success: true,
        data: category,
      });
    } catch (error: any) {
      res.status(404).json({
        success: false,
        message: error.message || 'Category not found',
      });
    }
  }
}
