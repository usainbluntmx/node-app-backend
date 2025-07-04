// src/controllers/favorite.controller.ts
import { RequestHandler } from 'express';
import { ResultSetHeader, RowDataPacket } from 'mysql2';
import pool from '../config/db';
import { asyncHandler } from '../middlewares/asyncHandler';

// Agregar sucursal a favoritos
export const addFavorite: RequestHandler = asyncHandler(async (req, res) => {
  const userId = req.user?.userId;
  const { branch_id } = req.body;

  if (!userId || !branch_id) {
    return res.status(400).json({ message: 'Faltan datos requeridos' });
  }

  // Verificar que la sucursal exista
  const [branchRows] = await pool.query<RowDataPacket[]>(
    'SELECT id FROM branches WHERE id = ?',
    [branch_id]
  );

  if (branchRows.length === 0) {
    return res.status(404).json({ message: 'Sucursal no encontrada' });
  }

  // Evitar duplicados
  const [existingRows] = await pool.query<RowDataPacket[]>(
    'SELECT * FROM favorites WHERE user_id = ? AND branch_id = ?',
    [userId, branch_id]
  );

  if (existingRows.length > 0) {
    return res.status(409).json({ message: 'Ya es un favorito' });
  }

  await pool.query<ResultSetHeader>(
    'INSERT INTO favorites (user_id, branch_id) VALUES (?, ?)',
    [userId, branch_id]
  );

  return res.status(201).json({ message: 'Sucursal agregada a favoritos' });
});

// Obtener sucursales favoritas del usuario
export const getFavorites: RequestHandler = asyncHandler(async (req, res) => {
  const userId = req.user?.userId;

  const [rows] = await pool.query<RowDataPacket[]>(
    `SELECT f.branch_id, b.name AS branch_name, b.address, b.latitude, b.longitude,
            br.id AS brand_id, br.name AS brand_name, br.logo_url
     FROM favorites f
     JOIN branches b ON f.branch_id = b.id
     JOIN brands br ON b.brand_id = br.id
     WHERE f.user_id = ?`,
    [userId]
  );

  return res.status(200).json({
    message: 'Favoritos obtenidos exitosamente',
    data: rows
  });
});

// Eliminar sucursal de favoritos
export const deleteFavorite: RequestHandler = asyncHandler(async (req, res) => {
  const userId = req.user?.userId;
  const { id } = req.params;

  const [existing] = await pool.query<RowDataPacket[]>(
    'SELECT * FROM favorites WHERE user_id = ? AND branch_id = ?',
    [userId, id]
  );

  if (existing.length === 0) {
    return res.status(404).json({ message: 'Favorito no encontrado' });
  }

  await pool.query('DELETE FROM favorites WHERE user_id = ? AND branch_id = ?', [userId, id]);

  return res.status(200).json({ message: 'Sucursal eliminada de favoritos' });
});