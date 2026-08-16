import { Request, Response, NextFunction } from 'express';
import { ProductService } from '../services/product.service';
import { SmartBuyScoreService } from '../services/smartBuyScore.service';
import { productQuerySchema } from '../validators/product.validator';

export class ProductController {
  static async getProducts(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const validatedQuery = productQuerySchema.parse(req.query);
      const result = await ProductService.getProducts(validatedQuery);

      res.status(200).json({
        success: true,
        data: result.products,
        pagination: result.pagination,
      });
    } catch (error: any) {
      if (error.name === 'ZodError') {
        res.status(400).json({
          success: false,
          message: error.errors[0]?.message || 'Invalid query parameters',
        });
        return;
      }
      res.status(500).json({
        success: false,
        message: error.message || 'Failed to fetch products',
      });
    }
  }

  static async getFeatured(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const featured = await ProductService.getFeaturedProducts();
      res.status(200).json({
        success: true,
        data: featured,
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message || 'Failed to fetch featured products',
      });
    }
  }

  static async getProductBySlug(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const slug = String(req.params.slug);
      const product = await ProductService.getProductBySlug(slug);

      // Compute dynamic score & recommendation
      const smartBuyScore = SmartBuyScoreService.calculateScore(
        product,
        product.prices,
        product.priceHistories
      );
      const buyWaitRecommendation = SmartBuyScoreService.getBuyOrWaitRecommendation(
        product.prices,
        product.priceHistories
      );

      res.status(200).json({
        success: true,
        data: {
          ...product,
          smartBuyScore,
          buyWaitRecommendation,
        },
      });
    } catch (error: any) {
      res.status(404).json({
        success: false,
        message: error.message || 'Product not found',
      });
    }
  }

  static async getSmartBuyScore(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const productId = String(req.params.id);
      const product = await ProductService.getProductBySlug(productId);
      const score = SmartBuyScoreService.calculateScore(product, product.prices, product.priceHistories);

      res.status(200).json({
        success: true,
        data: score,
      });
    } catch (error: any) {
      res.status(404).json({
        success: false,
        message: error.message || 'Product not found',
      });
    }
  }

  static async getBuyWaitRecommendation(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const productId = String(req.params.id);
      const product = await ProductService.getProductBySlug(productId);
      const rec = SmartBuyScoreService.getBuyOrWaitRecommendation(product.prices, product.priceHistories);

      res.status(200).json({
        success: true,
        data: rec,
      });
    } catch (error: any) {
      res.status(404).json({
        success: false,
        message: error.message || 'Product not found',
      });
    }
  }

  static async getBetterAlternatives(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const productId = String(req.params.id);
      const alternatives = await SmartBuyScoreService.getBetterAlternatives(productId);

      res.status(200).json({
        success: true,
        data: alternatives,
      });
    } catch (error: any) {
      res.status(404).json({
        success: false,
        message: error.message || 'Failed to fetch alternative products',
      });
    }
  }

  static async addReview(req: any, res: Response, next: NextFunction): Promise<void> {
    try {
      const productId = String(req.params.id);
      const userId = req.user?.userId;
      const { rating, title, content } = req.body;

      if (!rating || !title || !content) {
        res.status(400).json({
          success: false,
          message: 'Rating, title, and content are required.',
        });
        return;
      }

      const review = await ProductService.addReview(productId, userId, Number(rating), title, content);

      res.status(201).json({
        success: true,
        message: 'Review submitted successfully!',
        data: review,
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message || 'Failed to submit review.',
      });
    }
  }
}
