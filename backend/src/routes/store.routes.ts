import { Router } from 'express';
import { StoreController } from '../controllers/store.controller';

const router = Router();

router.get('/', StoreController.getAllStores);
router.get('/:id', StoreController.getStoreById);

export default router;
