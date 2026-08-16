import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../types';
import { UserFeatureService } from '../services/userFeature.service';

export class UserFeatureController {
  // Wishlist Handlers
  static async getWishlist(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user?.userId;
      if (!userId) {
        res.status(401).json({ success: false, message: 'Unauthorized' });
        return;
      }

      const wishlist = await UserFeatureService.getWishlist(userId);
      res.status(200).json({ success: true, data: wishlist });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message || 'Failed to fetch wishlist' });
    }
  }

  static async addToWishlist(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user?.userId;
      const { productId } = req.body;

      if (!userId || !productId) {
        res.status(400).json({ success: false, message: 'Product ID is required.' });
        return;
      }

      const item = await UserFeatureService.addToWishlist(userId, productId);
      res.status(201).json({ success: true, message: 'Added to wishlist', data: item });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message || 'Failed to add to wishlist' });
    }
  }

  static async removeFromWishlist(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user?.userId;
      const productId = String(req.params.productId);

      if (!userId || !productId) {
        res.status(400).json({ success: false, message: 'Product ID is required.' });
        return;
      }

      await UserFeatureService.removeFromWishlist(userId, productId);
      res.status(200).json({ success: true, message: 'Removed from wishlist' });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message || 'Failed to remove from wishlist' });
    }
  }

  // Recently Viewed Handlers
  static async getRecentlyViewed(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user?.userId;
      if (!userId) {
        res.status(401).json({ success: false, message: 'Unauthorized' });
        return;
      }

      const items = await UserFeatureService.getRecentlyViewed(userId);
      res.status(200).json({ success: true, data: items });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message || 'Failed to fetch recently viewed' });
    }
  }

  static async addRecentlyViewed(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user?.userId;
      const { productId } = req.body;

      if (!userId || !productId) {
        res.status(400).json({ success: false, message: 'Product ID is required.' });
        return;
      }

      await UserFeatureService.addRecentlyViewed(userId, productId);
      res.status(200).json({ success: true, message: 'Recorded view' });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message || 'Failed to record view' });
    }
  }
}
