// src/controllers/discount.controller.ts
import { Request, Response } from 'express';
import pool from '../config/db';
import QRCode from 'qrcode';

// Crear descuento con QR
export const createDiscount = async (req: Request, res: Response): Promise<void> => {
  try {
    const {
      brand_id,
      branch_id,
      title,
      type,
      description,
      value,
      min_purchase,
      product_or_service_name,
    } = req.body;

    if (!brand_id || !branch_id || !title || !type) {
      res.status(400).json({ message: 'Faltan campos obligatorios' });
      return;
    }

    const qrData = `Descuento: ${title} (${type})`;
    const qrCode = await QRCode.toDataURL(qrData);

    const [result] = await pool.execute(
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
        qrCode,
      ]
    );

    res.status(201).json({
      message: 'Descuento creado con éxito',
      data: {
        id: (result as any).insertId,
        brand_id,
        branch_id,
        title,
        type,
        description,
        value,
        min_purchase,
        product_or_service_name,
        qr_code: qrCode,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al crear el descuento' });
  }
};

// Obtener todos los descuentos activos (con filtros opcionales)
export const getAllDiscounts = async (req: Request, res: Response): Promise<void> => {
  try {
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

    const params: any[] = [];

    if (brand_id) {
      query += ' AND d.brand_id = ?';
      params.push(brand_id);
    }

    if (branch_id) {
      query += ' AND d.branch_id = ?';
      params.push(branch_id);
    }

    if (type) {
      query += ' AND d.type = ?';
      params.push(type);
    }

    const [rows] = await pool.execute(query, params);

    res.status(200).json({ message: 'Descuentos encontrados', data: rows });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al obtener los descuentos' });
  }
};

// Eliminar (lógicamente) un descuento
export const deleteDiscount = async (req: Request, res: Response): Promise<void> => {
  try {
    const discountId = req.params.id;

    // Validar existencia y estado activo
    const [existing]: any = await pool.execute(
      'SELECT * FROM discounts WHERE id = ? AND is_active = true',
      [discountId]
    );

    if (existing.length === 0) {
      res.status(404).json({ message: 'Descuento no encontrado o ya inactivo' });
      return;
    }

    // Eliminación lógica
    await pool.execute(
      'UPDATE discounts SET is_active = false WHERE id = ?',
      [discountId]
    );

    res.status(200).json({ message: 'Descuento eliminado (lógicamente)' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al eliminar el descuento' });
  }
};

export const getDiscountById = async (req: Request, res: Response): Promise<void> => {
  try {
    const discountId = req.params.id;

    const [rows]: any = await pool.execute(
      `SELECT d.id, d.title, d.description, d.type, d.value, d.qr_code,
              d.brand_id, d.branch_id, d.min_purchase, d.product_or_service_name,
              b.name AS brand_name, s.name AS branch_name
       FROM discounts d
       JOIN brands b ON d.brand_id = b.id
       JOIN branches s ON d.branch_id = s.id
       WHERE d.id = ? AND d.is_active = true
       LIMIT 1`,
      [discountId]
    );

    if (rows.length === 0) {
      res.status(404).json({ message: 'Descuento no encontrado o inactivo' });
      return;
    }

    res.status(200).json({ message: 'Descuento encontrado', data: rows[0] });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al obtener el descuento' });
  }
};
