import { Router } from 'express';
import { AdminController } from '../controllers/admin.controller';
import { authenticateUser, requireAdmin } from '../middleware/auth.middleware';

const router = Router();

// Apply auth & admin protection to all admin endpoints
router.use(authenticateUser, requireAdmin);

router.get('/dashboard', AdminController.getDashboard);
router.post('/products', AdminController.createProduct);
router.put('/products/:id', AdminController.updateProduct);
router.delete('/products/:id', AdminController.deleteProduct);

router.post('/prices', AdminController.upsertPrice);
router.delete('/prices/:id', AdminController.deletePrice);

export default router;
