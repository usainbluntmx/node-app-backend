// src/controllers/redemption.controller.ts
import { Request, Response } from 'express';
import { ResultSetHeader, RowDataPacket } from 'mysql2';
import pool from '../config/db';
import { asyncHandler } from '../middlewares/asyncHandler';

// Canjear descuento
export const redeemCoupon = asyncHandler(async (req: Request, res: Response): Promise<Response> => {
  const userId = req.user?.userId;
  const { discount_id } = req.body;

  if (!discount_id) {
    return res.status(400).json({ message: 'El campo discount_id es obligatorio' });
  }

  // Verificar si el descuento existe y está activo
  const [discounts] = await pool.query<RowDataPacket[]>(
    'SELECT * FROM discounts WHERE id = ? AND is_active = true',
    [discount_id]
  );

  if (discounts.length === 0) {
    return res.status(404).json({ message: 'Descuento no encontrado o inactivo' });
  }

  // Verificar si ya fue canjeado por el mismo usuario
  const [existing] = await pool.query<RowDataPacket[]>(
    'SELECT * FROM coupon_redemptions WHERE user_id = ? AND discount_id = ?',
    [userId, discount_id]
  );

  if (existing.length > 0) {
    return res.status(409).json({ message: 'Ya has canjeado este descuento' });
  }

  // Registrar la redención
  await pool.query<ResultSetHeader>(
    'INSERT INTO coupon_redemptions (user_id, discount_id) VALUES (?, ?)',
    [userId, discount_id]
  );

  return res.status(201).json({ message: 'Descuento canjeado exitosamente' });
});

// Consultar historial de redenciones del usuario
export const getMyRedemptions = asyncHandler(async (req: Request, res: Response): Promise<Response> => {
  const userId = req.user?.userId;

  const [redemptions] = await pool.query<RowDataPacket[]>(
    `SELECT cr.id, cr.redeemed_at,
            d.id AS discount_id, d.title, d.description, d.type, d.value,
            b.id AS branch_id, b.name AS branch_name,
            br.id AS brand_id, br.name AS brand_name
     FROM coupon_redemptions cr
     JOIN discounts d ON cr.discount_id = d.id
     JOIN branches b ON d.branch_id = b.id
     JOIN brands br ON d.brand_id = br.id
     WHERE cr.user_id = ?
     ORDER BY cr.redeemed_at DESC`,
    [userId]
  );

  return res.status(200).json({
    message: 'Historial de cupones canjeados',
    data: redemptions
  });
});