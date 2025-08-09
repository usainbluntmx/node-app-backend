// src/controllers/sisiVoyPoints.controller.ts
import { Request, Response } from 'express';
import { RowDataPacket, ResultSetHeader } from 'mysql2';
import pool from '../config/db';
import { asyncHandler } from '../middlewares/asyncHandler';

// Obtener puntos del usuario actual
export const getMyPoints = asyncHandler(async (req: Request, res: Response): Promise<Response> => {
  const userId = req.user?.userId;

  const [rows] = await pool.query<RowDataPacket[]>(
    'SELECT * FROM sisi_voy_points WHERE user_id = ? LIMIT 1',
    [userId]
  );

  if (rows.length === 0) {
    return res.status(200).json({ message: 'Sin puntos registrados', data: null });
  }

  return res.status(200).json({ message: 'Puntos obtenidos correctamente', data: rows[0] });
});

// Asignar puntos al usuario (por sistema: visitas/redenciones)
export const assignPoints = asyncHandler(async (req: Request, res: Response): Promise<Response> => {
  const userId = req.user?.userId;
  const { points } = req.body;

  if (!points || typeof points !== 'number' || points <= 0) {
    return res.status(400).json({ message: 'Cantidad de puntos inválida' });
  }

  const [existing] = await pool.query<RowDataPacket[]>(
    'SELECT * FROM sisi_voy_points WHERE user_id = ? LIMIT 1',
    [userId]
  );

  if (existing.length > 0) {
    await pool.query(
      `UPDATE sisi_voy_points
       SET current_points = current_points + ?,
           total_points = total_points + ?
       WHERE user_id = ?`,
      [points, points, userId]
    );
  } else {
    await pool.query<ResultSetHeader>(
      'INSERT INTO sisi_voy_points (user_id, current_points, total_points) VALUES (?, ?, ?)',
      [userId, points, points]
    );
  }

  return res.status(200).json({ message: 'Puntos asignados correctamente' });
});

// Redimir puntos por cupón
export const redeemPoints = asyncHandler(async (req: Request, res: Response): Promise<Response> => {
  const userId = req.user?.userId;
  const { coupon_id, required_points } = req.body;

  if (!coupon_id || !required_points || typeof required_points !== 'number') {
    return res.status(400).json({ message: 'Datos de redención incompletos o inválidos' });
  }

  const [rows] = await pool.query<RowDataPacket[]>(
    'SELECT current_points FROM sisi_voy_points WHERE user_id = ?',
    [userId]
  );

  if (rows.length === 0 || rows[0].current_points < required_points) {
    return res.status(400).json({ message: 'Puntos insuficientes para redimir este cupón' });
  }

  await pool.query(
    'UPDATE sisi_voy_points SET current_points = current_points - ?, coupon_id = ? WHERE user_id = ?',
    [required_points, coupon_id, userId]
  );

  return res.status(200).json({ message: 'Cupón redimido con éxito' });
});