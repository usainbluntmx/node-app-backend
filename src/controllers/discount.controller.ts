// src/controllers/discount.controller.ts
import { Request, Response, RequestHandler } from 'express';
import { ResultSetHeader, RowDataPacket } from 'mysql2';
import QRCode from 'qrcode';

import pool from '../config/db';
import { Discount } from '../models/discount.model';
import { asyncHandler } from '../middlewares/asyncHandler';

interface DiscountInput extends Omit<Discount, 'id' | 'created_at' | 'qr_code' | 'is_active'> {}
interface DiscountUpdateInput extends Partial<DiscountInput> {}
interface DiscountFilters {
  brand_id?: string;
  branch_id?: string;
  type?: string;
}

// Crear descuento con generación de QR
export const createDiscount = asyncHandler(async (req: Request<{}, {}, DiscountInput>, res: Response): Promise<Response> => {
  const {
    brand_id,
    branch_id,
    title,
    type,
    description,
    value,
    min_purchase,
    product_or_service_name
  } = req.body;

  if (!brand_id || !branch_id || !title || !type) {
    return res.status(400).json({ message: 'Faltan campos obligatorios' });
  }

  if (value !== undefined && isNaN(Number(value))) {
    return res.status(400).json({ message: 'El valor debe ser numérico' });
  }

  if (min_purchase !== undefined && isNaN(Number(min_purchase))) {
    return res.status(400).json({ message: 'El monto mínimo debe ser numérico' });
  }

  const qrContent = `Descuento: ${title} (${type})`;
  const qrCode = await QRCode.toDataURL(qrContent);

  const [result] = await pool.query<ResultSetHeader>(
    `INSERT INTO discounts 
     (brand_id, branch_id, type, title, description, value, min_purchase, product_or_service_name, qr_code)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      brand_id,
      branch_id,
      type,
      title,
      description ?? null,
      value ?? null,
      min_purchase ?? null,
      product_or_service_name ?? null,
      qrCode
    ]
  );

  return res.status(201).json({
    message: 'Descuento creado exitosamente',
    data: {
      id: result.insertId,
      brand_id,
      branch_id,
      title,
      type,
      description,
      value,
      min_purchase,
      product_or_service_name,
      qr_code: qrCode
    }
  });
});

// Obtener todos los descuentos activos
export const getAllDiscounts = asyncHandler(async (req: Request<{}, {}, {}, DiscountFilters>, res: Response): Promise<Response> => {
  const { brand_id, branch_id, type } = req.query;

  let query = `
    SELECT d.id, d.title, d.description, d.type, d.value, d.qr_code,
           d.brand_id, d.branch_id, d.min_purchase, d.product_or_service_name,
           b.name AS brand_name, s.name AS branch_name
    FROM discounts d
    JOIN brands b ON d.brand_id = b.id
    JOIN branches s ON d.branch_id = s.id
    WHERE d.is_active = true
  `;

  const params: (string | number)[] = [];

  if (brand_id) {
    query += ' AND d.brand_id = ?';
    params.push(Number(brand_id));
  }

  if (branch_id) {
    query += ' AND d.branch_id = ?';
    params.push(Number(branch_id));
  }

  if (type) {
    query += ' AND d.type = ?';
    params.push(type);
  }

  const [rows] = await pool.query<RowDataPacket[]>(query, params);

  return res.status(200).json({ message: 'Descuentos encontrados', data: rows });
});

// Obtener descuento por ID
export const getDiscountById: RequestHandler = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const [rows] = await pool.query<RowDataPacket[]>(
    `SELECT d.id, d.title, d.description, d.type, d.value, d.qr_code,
            d.brand_id, d.branch_id, d.min_purchase, d.product_or_service_name,
            b.name AS brand_name, s.name AS branch_name
     FROM discounts d
     JOIN brands b ON d.brand_id = b.id
     JOIN branches s ON d.branch_id = s.id
     WHERE d.id = ? AND d.is_active = true
     LIMIT 1`,
    [id]
  );

  if (rows.length === 0) {
    return res.status(404).json({ message: 'Descuento no encontrado o inactivo' });
  }

  return res.status(200).json({ message: 'Descuento encontrado', data: rows[0] });
});

// Actualizar descuento
export const updateDiscount: RequestHandler = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const {
    title,
    type,
    description,
    value,
    min_purchase,
    product_or_service_name
  } = req.body as DiscountUpdateInput;

  const [existingRows] = await pool.query<RowDataPacket[]>(
    'SELECT * FROM discounts WHERE id = ? AND is_active = true',
    [id]
  );

  if (existingRows.length === 0) {
    return res.status(404).json({ message: 'Descuento no encontrado o inactivo' });
  }

  const current = existingRows[0];

  if (value !== undefined && isNaN(Number(value))) {
    return res.status(400).json({ message: 'El valor debe ser numérico' });
  }

  if (min_purchase !== undefined && isNaN(Number(min_purchase))) {
    return res.status(400).json({ message: 'El monto mínimo debe ser numérico' });
  }

  let updatedQRCode = current.qr_code;
  if (title !== undefined || type !== undefined) {
    const newTitle = title ?? current.title;
    const newType = type ?? current.type;
    updatedQRCode = await QRCode.toDataURL(`Descuento: ${newTitle} (${newType})`);
  }

  await pool.query(
    `UPDATE discounts SET
      title = ?, type = ?, description = ?, value = ?,
      min_purchase = ?, product_or_service_name = ?, qr_code = ?
     WHERE id = ?`,
    [
      title ?? current.title,
      type ?? current.type,
      description ?? current.description,
      value ?? current.value,
      min_purchase ?? current.min_purchase,
      product_or_service_name ?? current.product_or_service_name,
      updatedQRCode,
      id
    ]
  );

  return res.status(200).json({
    message: 'Descuento actualizado correctamente',
    data: {
      id,
      title: title ?? current.title,
      type: type ?? current.type,
      description: description ?? current.description,
      value: value ?? current.value,
      min_purchase: min_purchase ?? current.min_purchase,
      product_or_service_name: product_or_service_name ?? current.product_or_service_name,
      qr_code: updatedQRCode
    }
  });
});

// Eliminar lógicamente un descuento
export const deleteDiscount: RequestHandler = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const [existing] = await pool.query<RowDataPacket[]>(
    'SELECT * FROM discounts WHERE id = ? AND is_active = true',
    [id]
  );

  if (existing.length === 0) {
    return res.status(404).json({ message: 'Descuento no encontrado o ya eliminado' });
  }

  await pool.query('UPDATE discounts SET is_active = false WHERE id = ?', [id]);

  return res.status(200).json({ message: 'Descuento eliminado (lógicamente)' });
});