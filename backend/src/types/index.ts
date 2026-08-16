import { Request } from 'express';
import { JwtPayload } from '../utils/jwt.util';

export interface AuthenticatedRequest extends Request {
  user?: JwtPayload;
}
