import type { Request, Response, NextFunction } from 'express';
import { verifyToken } from './auth.controllers';

// Extend Request interface to include user
declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        username: string;
        email: string;
      };
    }
  }
}

export function authenticateToken(req: Request, res: Response, next: NextFunction) {
  // Try to get token from Authorization header first
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

  // If no token in header, try cookie
  const cookieToken = req.cookies?.token;

  const authToken = token || cookieToken;

  if (!authToken) {
    return res.status(401).json({ error: 'Access token required' });
  }

  const decoded = verifyToken(authToken);
  if (!decoded) {
    return res.status(403).json({ error: 'Invalid or expired token' });
  }

  req.user = decoded;
  next();
}
