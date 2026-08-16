import { Router } from 'express';
import { BrandController } from '../controllers/brand.controller';

const router = Router();

router.get('/', BrandController.getAll);
router.get('/:slug', BrandController.getBySlug);

export default router;
