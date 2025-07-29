// src/controllers/pointHistory.controller.ts
import { Request, Response } from 'express';
import { ResultSetHeader, RowDataPacket } from 'mysql2';
import pool from '../config/db';
import { asyncHandler } from '../middlewares/asyncHandler';

// Obtener historial de puntos de un usuario
export const getPointHistory = asyncHandler(async (req: Request, res: Response): Promise<Response> => {
  const userId = req.user?.userId;

  const [rows] = await pool.query<RowDataPacket[]>(
    `SELECT ph.id, ph.action, ph.points, ph.created_at, ph.description
     FROM point_history ph
     WHERE ph.user_id = ?
     ORDER BY ph.created_at DESC`,
    [userId]
  );

  return res.status(200).json({
    message: 'Historial de puntos obtenido correctamente',
    data: rows
  });
});

// Registrar acción en el historial de puntos (utilidad interna)
export const registerPointAction = async (
  userId: number,
  action: 'earned' | 'redeemed' | 'adjusted',
  points: number,
  description: string
): Promise<void> => {
  await pool.query<ResultSetHeader>(
    'INSERT INTO point_history (user_id, action, points, description) VALUES (?, ?, ?, ?)',
    [userId, action, points, description]
  );
};