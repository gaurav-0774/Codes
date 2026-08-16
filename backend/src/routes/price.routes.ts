import { Router } from 'express';
import { PriceController } from '../controllers/price.controller';

const router = Router();

router.get('/product/:productId', PriceController.getProductPrices);
router.get('/history/:productId', PriceController.getPriceHistory);

export default router;
