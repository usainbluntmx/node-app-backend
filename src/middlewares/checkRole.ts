// src/middlewares/checkRole.ts
import { Request, Response, NextFunction } from 'express';

/**
 * Middleware para validar el rol del usuario autenticado
 */
export const checkRole = (role: 'buyer' | 'seller') => {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({ message: 'No autenticado' });
      return;
    }

    if (req.user.role !== role) {
      res.status(403).json({ message: `Acceso denegado. Rol requerido: ${role}` });
      return;
    }

    next();
  };
};