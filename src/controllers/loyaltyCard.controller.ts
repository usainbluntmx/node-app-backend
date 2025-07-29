// src/controllers/loyaltyCard.controller.ts
import { Request, Response } from 'express';
import pool from '../config/db';
import { LoyaltyCard } from '../models/loyaltyCard.model';
import { RowDataPacket } from 'mysql2';

export const createLoyaltyCard = async (req: Request, res: Response): Promise<Response> => {
  const { brand_id, coupon_id, total_visits_required, expiration_date } = req.body;

  if (!brand_id || !total_visits_required || !expiration_date) {
    return res.status(400).json({ message: 'Faltan campos obligatorios' });
  }

  await pool.query(
    `INSERT INTO loyalty_cards (brand_id, coupon_id, total_visits_required, expiration_date) VALUES (?, ?, ?, ?)`,
    [brand_id, coupon_id || null, total_visits_required, expiration_date]
  );

  return res.status(201).json({ message: 'Tarjeta de lealtad creada correctamente' });
};

export const getLoyaltyCards = async (_: Request, res: Response): Promise<Response> => {
  const [rows] = await pool.query<RowDataPacket[]>('SELECT * FROM loyalty_cards WHERE is_active = true');
  return res.status(200).json({ loyalty_cards: rows });
};

export const getLoyaltyCardById = async (req: Request, res: Response): Promise<Response> => {
  const { id } = req.params;
  const [rows] = await pool.query<RowDataPacket[]>('SELECT * FROM loyalty_cards WHERE id = ?', [id]);

  if (rows.length === 0) {
    return res.status(404).json({ message: 'Tarjeta de lealtad no encontrada' });
  }

  return res.status(200).json({ loyalty_card: rows[0] });
};

export const updateLoyaltyCard = async (req: Request, res: Response): Promise<Response> => {
  const { id } = req.params;
  const { coupon_id, total_visits_required, expiration_date, is_active } = req.body;

  await pool.query(
    `UPDATE loyalty_cards SET coupon_id = ?, total_visits_required = ?, expiration_date = ?, is_active = ? WHERE id = ?`,
    [coupon_id || null, total_visits_required, expiration_date, is_active, id]
  );

  return res.status(200).json({ message: 'Tarjeta de lealtad actualizada correctamente' });
};

export const deleteLoyaltyCard = async (req: Request, res: Response): Promise<Response> => {
  const { id } = req.params;
  await pool.query('UPDATE loyalty_cards SET is_active = false WHERE id = ?', [id]);
  return res.status(200).json({ message: 'Tarjeta de lealtad desactivada correctamente' });
};