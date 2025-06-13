// src/middlewares/checkRole.ts
import { Response, NextFunction } from 'express';
import { AuthRequest } from '../types/express';

export const checkRole = (role: 'buyer' | 'seller') => {
  return (req: AuthRequest, res: Response, next: NextFunction): void => {
    if (!req.user || req.user.role !== role) {
      res.status(403).json({ message: 'Acceso denegado. Usuario no autorizado.' });
      return;
    }

    next();
  };
};
