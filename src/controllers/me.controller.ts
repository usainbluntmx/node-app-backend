// src/controllers/me.controller.ts
import { Request, Response } from 'express';
import pool from '../config/db';

/**
 * GET /me - Retorna el perfil del usuario autenticado
 */
export const getMyProfile = async (req: Request, res: Response): Promise<void> => {
  const { userId } = req.user!;

  const [rows] = await pool.query('SELECT id, name, email, role, created_at FROM users WHERE id = ?', [userId]);

  const user = Array.isArray(rows) && rows.length > 0 ? rows[0] : null;

  if (!user) {
    res.status(404).json({ message: 'Usuario no encontrado' });
    return;
  }

  res.json(user);
};

/**
 * PUT /me - Permite al usuario actualizar su nombre y/o contraseña
 */
export const updateMyProfile = async (req: Request, res: Response): Promise<void> => {
  const { userId } = req.user!;
  const { name, password } = req.body;

  if (!name && !password) {
    res.status(400).json({ message: 'Debes proporcionar al menos un campo para actualizar' });
    return;
  }

  const updates: string[] = [];
  const values: any[] = [];

  if (name) {
    updates.push('name = ?');
    values.push(name);
  }

  if (password) {
    const bcrypt = await import('bcryptjs');
    const hashedPassword = await bcrypt.hash(password, 10);
    updates.push('password = ?');
    values.push(hashedPassword);
  }

  values.push(userId);

  const sql = `UPDATE users SET ${updates.join(', ')} WHERE id = ?`;
  await pool.query(sql, values);

  res.json({ message: 'Perfil actualizado correctamente' });
};