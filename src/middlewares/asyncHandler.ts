// src/middlewares/asyncHandler.ts
import { Request, Response, NextFunction, RequestHandler } from 'express';

/**
 * Envuelve un controlador async y captura errores automáticamente
 */
export const asyncHandler = (
  fn: (req: Request, res: Response, next: NextFunction) => Promise<any>
): RequestHandler => {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};