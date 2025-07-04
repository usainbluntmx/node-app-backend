// src/controllers/auth.controller.ts
import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import pool from '../config/db';
import { ResultSetHeader, RowDataPacket } from 'mysql2';
import { User } from '../models/user.model';

const JWT_SECRET = process.env.JWT_SECRET || 'default_secret';

// Registro de nuevo usuario
export const registerUser = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { email, password, name, role } = req.body as Partial<User>;

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
      'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)',
      [name, email, hashedPassword, role]
    );

    const token = jwt.sign({ userId: result.insertId, email, role }, JWT_SECRET, { expiresIn: '1h' });

    return res.status(201).json({
      message: 'Usuario registrado con éxito',
      token
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

    const token = jwt.sign(
      { userId: user.id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: '1h' }
    );

    return res.status(200).json({
      message: 'Login exitoso',
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Error en loginUser:', error);
    return res.status(500).json({ message: 'Error en el servidor al iniciar sesión' });
  }
};