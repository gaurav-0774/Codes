import { Router } from 'express';
import { ProductController } from '../controllers/product.controller';
import { authenticateUser } from '../middleware/auth.middleware';

const router = Router();

router.get('/', ProductController.getProducts);
router.get('/search', ProductController.getProducts);
router.get('/featured', ProductController.getFeatured);
router.get('/:slug', ProductController.getProductBySlug);
router.get('/:id/score', ProductController.getSmartBuyScore);
router.get('/:id/recommendation', ProductController.getBuyWaitRecommendation);
router.get('/:id/alternatives', ProductController.getBetterAlternatives);
router.post('/:id/reviews', authenticateUser, ProductController.addReview);

export default router;
