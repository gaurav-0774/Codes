import { Router } from 'express';
import { AuthController } from '../controllers/auth.controller';
import { authenticateUser } from '../middleware/auth.middleware';

const router = Router();

// Public routes
router.post('/register', AuthController.register);
router.post('/login', AuthController.login);

// Protected routes
router.get('/me', authenticateUser, AuthController.getMe);

export default router;
