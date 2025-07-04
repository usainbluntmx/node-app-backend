// src/controllers/analytics.controller.ts
import { RequestHandler } from 'express';
import { RowDataPacket } from 'mysql2';
import pool from '../config/db';
import { asyncHandler } from '../middlewares/asyncHandler';

// Obtener número total de visitas por local
export const getVisitsByBranch: RequestHandler = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const [result] = await pool.query<RowDataPacket[]>(
    `SELECT COUNT(*) as visit_count FROM user_visits WHERE branch_id = ?`,
    [id]
  );

  return res.status(200).json({
    message: 'Visitas encontradas',
    data: result[0]
  });
});

// Obtener número total de redenciones por descuento
export const getRedemptionsByDiscount: RequestHandler = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const [result] = await pool.query<RowDataPacket[]>(
    `SELECT COUNT(*) as redemption_count FROM coupon_redemptions WHERE discount_id = ?`,
    [id]
  );

  return res.status(200).json({
    message: 'Número de redenciones',
    data: result[0]
  });
});