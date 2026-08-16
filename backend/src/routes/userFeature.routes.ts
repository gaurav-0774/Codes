import { Router } from 'express';
import { UserFeatureController } from '../controllers/userFeature.controller';
import { authenticateUser } from '../middleware/auth.middleware';

const router = Router();

// Wishlist Routes
router.get('/wishlist', authenticateUser, UserFeatureController.getWishlist);
router.post('/wishlist', authenticateUser, UserFeatureController.addToWishlist);
router.delete('/wishlist/:productId', authenticateUser, UserFeatureController.removeFromWishlist);

// Recently Viewed Routes
router.get('/recently-viewed', authenticateUser, UserFeatureController.getRecentlyViewed);
router.post('/recently-viewed', authenticateUser, UserFeatureController.addRecentlyViewed);

export default router;
