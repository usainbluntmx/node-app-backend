// src/controllers/me.controller.ts
import { Request, Response } from 'express';
import pool from '../config/db';
import { RowDataPacket, ResultSetHeader } from 'mysql2';
import { User } from '../models/user.model';
import bcrypt from 'bcryptjs';

/**
 * GET /me - Retorna el perfil del usuario autenticado
 */
export const getMyProfile = async (req: Request, res: Response): Promise<Response> => {
  const { userId } = req.user!;

  const [rows] = await pool.query<RowDataPacket[]>(
    'SELECT * FROM users WHERE id = ?',
    [userId]
  );

  const users = rows as User[];

  if (users.length === 0) {
    return res.status(404).json({ message: 'Usuario no encontrado' });
  }

  const user = users[0];
  let membership_type: string | null = null;

  if (user.role === 'seller') {
    const [membershipRows] = await pool.query<RowDataPacket[]>(
      'SELECT id FROM seller_memberships WHERE user_id = ? AND is_active = true LIMIT 1',
      [user.id]
    );

    if (membershipRows.length > 0) {
      membership_type = 'basic';
    }
  }

  return res.status(200).json({
    message: 'Perfil obtenido correctamente',
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      birth_date: user.birth_date,
      phone: user.phone,
      referral_code: user.referral_code,
      gender: user.gender,
      qr: user.qr,
      created_at: user.created_at,
      membership_type
    }
  });
};

/**
 * PUT /me - Permite al usuario actualizar su perfil (nombre, teléfono, fecha de nacimiento, género, QR o contraseña)
 */
export const updateMyProfile = async (req: Request, res: Response): Promise<Response> => {
  const { userId } = req.user!;
  const {
    name,
    phone,
    birth_date,
    gender,
    qr,
    password
  } = req.body as Partial<User> & { password?: string };

  if (!name && !phone && !birth_date && !gender && !qr && !password) {
    return res.status(400).json({ message: 'Debes proporcionar al menos un campo para actualizar' });
  }

  const updates: string[] = [];
  const values: any[] = [];

  if (name) {
    updates.push('name = ?');
    values.push(name);
  }

  if (phone) {
    updates.push('phone = ?');
    values.push(phone);
  }

  if (birth_date) {
    updates.push('birth_date = ?');
    values.push(birth_date);
  }

  if (gender) {
    updates.push('gender = ?');
    values.push(gender);
  }

  if (qr) {
    updates.push('qr = ?');
    values.push(qr);
  }

  if (password) {
    const hashedPassword = await bcrypt.hash(password, 10);
    updates.push('password = ?');
    values.push(hashedPassword);
  }

  values.push(userId);

  const sql = `UPDATE users SET ${updates.join(', ')} WHERE id = ?`;
  await pool.query<ResultSetHeader>(sql, values);

  return res.status(200).json({ message: 'Perfil actualizado correctamente' });
};