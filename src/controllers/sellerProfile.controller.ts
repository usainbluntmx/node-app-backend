// src/controllers/sellerProfile.controller.ts
import { Request, Response } from 'express';
import { ResultSetHeader, RowDataPacket } from 'mysql2';
import pool from '../config/db';
import { asyncHandler } from '../middlewares/asyncHandler';
import { SellerBillingInfo } from '../models/sellerBilling.model';
import { SellerMembership } from '../models/sellerMembership.model';

// Guardar datos fiscales
export const createOrUpdateBillingInfo = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user?.userId;
  const { full_name, tax_id, email, phone, cfdi_usage } = req.body as SellerBillingInfo;

  if (!full_name || !tax_id || !email || !phone || !cfdi_usage) {
    return res.status(400).json({ message: 'Todos los campos fiscales son obligatorios' });
  }

  const [existing] = await pool.query<RowDataPacket[]>(
    'SELECT id FROM seller_billing_info WHERE user_id = ?',
    [userId]
  );

  if (existing.length > 0) {
    await pool.query(
      'UPDATE seller_billing_info SET full_name = ?, tax_id = ?, email = ?, phone = ?, cfdi_usage = ? WHERE user_id = ?',
      [full_name, tax_id, email, phone, cfdi_usage, userId]
    );
    return res.status(200).json({ message: 'Datos fiscales actualizados correctamente' });
  }

  await pool.query<ResultSetHeader>(
    'INSERT INTO seller_billing_info (user_id, full_name, tax_id, email, phone, cfdi_usage) VALUES (?, ?, ?, ?, ?, ?)',
    [userId, full_name, tax_id, email, phone, cfdi_usage]
  );

  return res.status(201).json({ message: 'Datos fiscales registrados correctamente' });
});

// Obtener datos fiscales
export const getBillingInfo = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user?.userId;

  const [rows] = await pool.query<RowDataPacket[]>(
    'SELECT * FROM seller_billing_info WHERE user_id = ?',
    [userId]
  );

  if (rows.length === 0) {
    return res.status(404).json({ message: 'Datos fiscales no encontrados' });
  }

  return res.status(200).json({ data: rows[0] as SellerBillingInfo });
});

// Registrar membresía
export const createMembership = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user?.userId;
  const { payment_method, payment_reference } = req.body as SellerMembership;

  if (!payment_method || !['card', 'bank_transfer', 'oxxo'].includes(payment_method)) {
    return res.status(400).json({ message: 'Método de pago inválido' });
  }

  const [existing] = await pool.query<RowDataPacket[]>(
    'SELECT id FROM seller_memberships WHERE user_id = ?',
    [userId]
  );

  if (existing.length > 0) {
    return res.status(409).json({ message: 'La membresía ya ha sido registrada previamente' });
  }

  await pool.query<ResultSetHeader>(
    'INSERT INTO seller_memberships (user_id, is_active, payment_method, payment_reference, membership_start) VALUES (?, ?, ?, ?, NOW())',
    [userId, true, payment_method, payment_reference ?? null]
  );

  return res.status(201).json({ message: 'Membresía registrada correctamente' });
});

// Obtener membresía actual
export const getMembership = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user?.userId;

  const [rows] = await pool.query<RowDataPacket[]>(
    'SELECT * FROM seller_memberships WHERE user_id = ? ORDER BY membership_start DESC LIMIT 1',
    [userId]
  );

  if (rows.length === 0) {
    return res.status(404).json({ message: 'Membresía no registrada' });
  }

  return res.status(200).json({ data: rows[0] as SellerMembership });
});

// Obtener historial de membresías
export const getMembershipHistory = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user?.userId;

  const [rows] = await pool.query<RowDataPacket[]>(
    'SELECT * FROM seller_memberships WHERE user_id = ? ORDER BY membership_start DESC',
    [userId]
  );

  return res.status(200).json({ data: rows as SellerMembership[] });
});

// Obtener membresía activa actual con tipo
export const getActiveMembershipStatus = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user?.userId;

  const [rows] = await pool.query<RowDataPacket[]>(
    'SELECT membership_type, is_active FROM seller_memberships WHERE user_id = ? AND is_active = true ORDER BY membership_start DESC LIMIT 1',
    [userId]
  );

  if (rows.length === 0) {
    return res.status(200).json({ is_active: false });
  }

  return res.status(200).json({ is_active: true, membership_type: rows[0].membership_type });
});