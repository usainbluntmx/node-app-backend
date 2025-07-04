// src/controllers/couponRedemption.controller.ts
import { Request, Response } from 'express';
import { ResultSetHeader, RowDataPacket } from 'mysql2';
import pool from '../config/db';
import { asyncHandler } from '../middlewares/asyncHandler';

interface RedemptionInput {
  discount_id: number;
  branch_id: number;
}

export const redeemCoupon = asyncHandler(async (req: Request<{}, {}, RedemptionInput>, res: Response): Promise<Response> => {
  const userId = req.user?.userId;
  const { discount_id, branch_id } = req.body;

  if (!discount_id || !branch_id) {
    return res.status(400).json({ message: 'Faltan campos requeridos' });
  }

  // Validar duplicado
  const [existing] = await pool.query<RowDataPacket[]>(
    `SELECT id FROM coupon_redemptions WHERE user_id = ? AND discount_id = ? AND branch_id = ?`,
    [userId, discount_id, branch_id]
  );

  if (existing.length > 0) {
    return res.status(409).json({ message: 'Este cupón ya fue redimido anteriormente en esta sucursal' });
  }

  const [result] = await pool.query<ResultSetHeader>(
    `INSERT INTO coupon_redemptions (user_id, discount_id, branch_id) VALUES (?, ?, ?)`,
    [userId, discount_id, branch_id]
  );

  return res.status(201).json({
    message: 'Cupón redimido correctamente',
    data: {
      id: result.insertId,
      user_id: userId,
      discount_id,
      branch_id
    }
  });
});

// Obtener historial de cupones redimidos por el usuario autenticado
export const getMyRedemptions = asyncHandler(async (req: Request, res: Response): Promise<Response> => {
  const userId = req.user?.userId;

  const [rows] = await pool.query<RowDataPacket[]>(
    `SELECT cr.id, cr.redeemed_at,
            d.id AS discount_id, d.title, d.type, d.value, d.description,
            b.id AS branch_id, b.name AS branch_name, b.address, b.latitude, b.longitude,
            br.id AS brand_id, br.name AS brand_name, br.logo_url
     FROM coupon_redemptions cr
     JOIN discounts d ON cr.discount_id = d.id
     JOIN branches b ON cr.branch_id = b.id
     JOIN brands br ON b.brand_id = br.id
     WHERE cr.user_id = ?
     ORDER BY cr.redeemed_at DESC`,
    [userId]
  );

  return res.status(200).json({
    message: 'Historial de redenciones obtenido correctamente',
    data: rows
  });
});