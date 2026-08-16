import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../types';
import { AuthService } from '../services/auth.service';
import { registerSchema, loginSchema } from '../validators/auth.validator';

export class AuthController {
  static async register(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const validatedData = registerSchema.parse(req.body);
      const result = await AuthService.register(validatedData);

      res.status(201).json({
        success: true,
        message: 'Account created successfully!',
        data: result,
      });
    } catch (error: any) {
      if (error.name === 'ZodError') {
        res.status(400).json({
          success: false,
          message: error.errors[0]?.message || 'Validation Error',
          errors: error.errors,
        });
        return;
      }
      res.status(400).json({
        success: false,
        message: error.message || 'Registration failed.',
      });
    }
  }

  static async login(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const validatedData = loginSchema.parse(req.body);
      const result = await AuthService.login(validatedData);

      res.status(200).json({
        success: true,
        message: 'Logged in successfully!',
        data: result,
      });
    } catch (error: any) {
      if (error.name === 'ZodError') {
        res.status(400).json({
          success: false,
          message: error.errors[0]?.message || 'Validation Error',
          errors: error.errors,
        });
        return;
      }
      res.status(401).json({
        success: false,
        message: error.message || 'Authentication failed.',
      });
    }
  }

  static async getMe(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user?.userId) {
        res.status(401).json({
          success: false,
          message: 'Unauthorized request.',
        });
        return;
      }

      const user = await AuthService.getUserById(req.user.userId);

      res.status(200).json({
        success: true,
        data: user,
      });
    } catch (error: any) {
      res.status(404).json({
        success: false,
        message: error.message || 'User profile not found.',
      });
    }
  }
}
