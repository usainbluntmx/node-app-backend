// src/controllers/auth.controller.ts
import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import pool from '../config/db';
import { ResultSetHeader, RowDataPacket } from 'mysql2';
import { User } from '../models/user.model';

const JWT_SECRET = process.env.JWT_SECRET || 'default_secret';
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'refresh_secret';

const generateAccessToken = (user: User) => {
  return jwt.sign(
    { userId: user.id, email: user.email, role: user.role },
    JWT_SECRET,
    { expiresIn: '1h' }
  );
};

const generateRefreshToken = (userId: number) => {
  return jwt.sign({ userId }, JWT_REFRESH_SECRET, { expiresIn: '7d' });
};

// Registro de nuevo usuario
export const registerUser = async (req: Request, res: Response): Promise<Response> => {
  try {
    const {
      email,
      password,
      name,
      role,
      birth_date,
      phone,
      referral_code
    } = req.body as Partial<User>;

    if (!email || !password || !name || !role) {
      return res.status(400).json({ message: 'Todos los campos son requeridos: email, password, name y role' });
    }

    if (!['buyer', 'seller'].includes(role)) {
      return res.status(400).json({ message: 'Rol inválido. Debe ser buyer o seller' });
    }

    const [existing] = await pool.query<RowDataPacket[]>('SELECT id FROM users WHERE email = ?', [email]);

    if (existing.length > 0) {
      return res.status(409).json({ message: 'El correo ya está registrado' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const [result] = await pool.query<ResultSetHeader>(
      `INSERT INTO users (name, email, password, role, birth_date, phone, referral_code)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        name,
        email,
        hashedPassword,
        role,
        birth_date || null,
        phone || null,
        referral_code || null
      ]
    );

    const accessToken = generateAccessToken({ id: result.insertId, email, role, name } as User);
    const refreshToken = generateRefreshToken(result.insertId);

    await pool.query<ResultSetHeader>(
      'INSERT INTO refresh_tokens (user_id, token) VALUES (?, ?)',
      [result.insertId, refreshToken]
    );

    return res.status(201).json({
      message: 'Usuario registrado con éxito',
      accessToken,
      refreshToken
    });
  } catch (error) {
    console.error('Error en registerUser:', error);
    return res.status(500).json({ message: 'Error en el servidor al registrar usuario' });
  }
};

// Inicio de sesión
export const loginUser = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { email, password } = req.body as { email: string; password: string };

    if (!email || !password) {
      return res.status(400).json({ message: 'Email y password son requeridos' });
    }

    const [rows] = await pool.query<RowDataPacket[]>('SELECT * FROM users WHERE email = ?', [email]);
    const users = rows as User[];

    if (users.length === 0) {
      return res.status(401).json({ message: 'Credenciales inválidas' });
    }

    const user = users[0];
    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return res.status(401).json({ message: 'Credenciales inválidas' });
    }

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

    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user.id!);

    await pool.query<ResultSetHeader>(
      'INSERT INTO refresh_tokens (user_id, token) VALUES (?, ?)',
      [user.id, refreshToken]
    );

    return res.status(200).json({
      message: 'Login exitoso',
      accessToken,
      refreshToken,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        birth_date: user.birth_date,
        phone: user.phone,
        referral_code: user.referral_code,
        membership_type
      }
    });
  } catch (error) {
    console.error('Error en loginUser:', error);
    return res.status(500).json({ message: 'Error en el servidor al iniciar sesión' });
  }
};

// Refresh token
export const refreshToken = async (req: Request, res: Response): Promise<Response> => {
  const { token } = req.body as { token: string };
  if (!token) return res.status(401).json({ message: 'Token de actualización requerido' });

  const [rows] = await pool.query<RowDataPacket[]>(
    'SELECT * FROM refresh_tokens WHERE token = ?',
    [token]
  );

  if (rows.length === 0) {
    return res.status(403).json({ message: 'Refresh token inválido' });
  }

  try {
    const payload = jwt.verify(token, JWT_REFRESH_SECRET) as { userId: number };
    const newAccessToken = generateAccessToken({ id: payload.userId } as User);
    return res.status(200).json({ accessToken: newAccessToken });
  } catch (error) {
    return res.status(403).json({ message: 'Refresh token inválido o expirado' });
  }
};

// Logout (revocar refresh token)
export const logoutUser = async (req: Request, res: Response): Promise<Response> => {
  const { token } = req.body as { token: string };
  if (!token) return res.status(400).json({ message: 'Token requerido para cerrar sesión' });

  await pool.query<ResultSetHeader>('DELETE FROM refresh_tokens WHERE token = ?', [token]);
  return res.status(200).json({ message: 'Sesión cerrada correctamente' });
};
