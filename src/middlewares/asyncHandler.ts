// src/middlewares/asyncHandler.ts
import { Request, Response, NextFunction, RequestHandler } from 'express';

/**
 * Envuelve un controlador asincrono para capturar errores y evitar romper el tipado de Express
 */
export const asyncHandler = (
  fn: (req: Request, res: Response, next: NextFunction) => Promise<Response>
): RequestHandler => {
  return (req, res, next) => {
    fn(req, res, next).catch(next);
  };
};
