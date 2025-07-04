// src/controllers/brand.controller.ts
import { Request, Response } from 'express';
import { ResultSetHeader, RowDataPacket } from 'mysql2';
import pool from '../config/db';
import { Brand } from '../models/brand.model';
import { asyncHandler } from '../middlewares/asyncHandler';

// Crear una nueva marca
export const createBrand = asyncHandler(async (req: Request, res: Response): Promise<Response> => {
  const { name, description, logo_url } = req.body as Brand;
  const ownerId = req.user?.userId;

  if (!name || !ownerId) {
    return res.status(400).json({ message: 'Faltan datos obligatorios' });
  }

  const [result] = await pool.query<ResultSetHeader>(
    'INSERT INTO brands (name, description, logo_url, owner_id) VALUES (?, ?, ?, ?)',
    [name, description ?? null, logo_url ?? null, ownerId]
  );

  return res.status(201).json({
    message: 'Marca creada correctamente',
    brand: {
      id: result.insertId,
      name,
      description: description ?? null,
      logo_url: logo_url ?? null,
      owner_id: ownerId
    }
  });
});

// Obtener todas las marcas del usuario autenticado
export const getAllBrands = asyncHandler(async (req: Request, res: Response): Promise<Response> => {
  const ownerId = req.user?.userId;

  const [brands] = await pool.query<RowDataPacket[]>(
    'SELECT * FROM brands WHERE owner_id = ?',
    [ownerId]
  );

  return res.status(200).json({
    message: 'Marcas encontradas',
    data: brands as Brand[]
  });
});

// Obtener una marca por su ID (propiedad del usuario)
export const getBrandById = asyncHandler(async (req: Request, res: Response): Promise<Response> => {
  const { id } = req.params;
  const ownerId = req.user?.userId;

  const [brands] = await pool.query<RowDataPacket[]>(
    'SELECT * FROM brands WHERE id = ? AND owner_id = ?',
    [id, ownerId]
  );

  if (brands.length === 0) {
    return res.status(404).json({ message: 'Marca no encontrada o no autorizada' });
  }

  return res.status(200).json({
    message: 'Marca encontrada',
    data: brands[0] as Brand
  });
});

// Actualizar una marca (solo del usuario autenticado)
export const updateBrand = asyncHandler(async (req: Request, res: Response): Promise<Response> => {
  const { id } = req.params;
  const { name, description, logo_url } = req.body as Partial<Brand>;
  const ownerId = req.user?.userId;

  const [result] = await pool.query<ResultSetHeader>(
    'UPDATE brands SET name = ?, description = ?, logo_url = ? WHERE id = ? AND owner_id = ?',
    [name, description ?? null, logo_url ?? null, id, ownerId]
  );

  if (result.affectedRows === 0) {
    return res.status(404).json({ message: 'Marca no encontrada o no autorizada' });
  }

  return res.status(200).json({ message: 'Marca actualizada correctamente' });
});

// Eliminar una marca (propiedad del usuario autenticado)
export const deleteBrand = asyncHandler(async (req: Request, res: Response): Promise<Response> => {
  const { id } = req.params;
  const ownerId = req.user?.userId;

  const [result] = await pool.query<ResultSetHeader>(
    'DELETE FROM brands WHERE id = ? AND owner_id = ?',
    [id, ownerId]
  );

  if (result.affectedRows === 0) {
    return res.status(404).json({ message: 'Marca no encontrada o no autorizada' });
  }

  return res.status(200).json({ message: 'Marca eliminada correctamente' });
});