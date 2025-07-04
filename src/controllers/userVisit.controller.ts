// src/controllers/userVisit.controller.ts
import { Request, Response } from 'express';
import { ResultSetHeader, RowDataPacket } from 'mysql2';
import pool from '../config/db';
import { asyncHandler } from '../middlewares/asyncHandler';

// Registrar visita
export const registerVisit = asyncHandler(async (req: Request, res: Response): Promise<Response> => {
  const userId = req.user?.userId;
  const { branch_id } = req.body;

  if (!branch_id) {
    return res.status(400).json({ message: 'El campo branch_id es obligatorio' });
  }

  // Validar existencia de sucursal
  const [branches] = await pool.query<RowDataPacket[]>(
    'SELECT id FROM branches WHERE id = ?',
    [branch_id]
  );

  if (branches.length === 0) {
    return res.status(404).json({ message: 'Sucursal no encontrada' });
  }

  await pool.query<ResultSetHeader>(
    'INSERT INTO user_visits (user_id, branch_id) VALUES (?, ?)',
    [userId, branch_id]
  );

  return res.status(201).json({ message: 'Visita registrada exitosamente' });
});

// Obtener historial de visitas del usuario
export const getMyVisits = asyncHandler(async (req: Request, res: Response): Promise<Response> => {
  const userId = req.user?.userId;

  const [visits] = await pool.query<RowDataPacket[]>(
    `SELECT uv.id, uv.visited_at, b.id AS branch_id, b.name AS branch_name, b.address, b.latitude, b.longitude,
            br.id AS brand_id, br.name AS brand_name, br.logo_url
     FROM user_visits uv
     JOIN branches b ON uv.branch_id = b.id
     JOIN brands br ON b.brand_id = br.id
     WHERE uv.user_id = ?
     ORDER BY uv.visited_at DESC`,
    [userId]
  );

  return res.status(200).json({
    message: 'Historial de visitas obtenido',
    data: visits
  });
});