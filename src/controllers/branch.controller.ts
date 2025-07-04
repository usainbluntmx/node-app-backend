// src/controllers/branch.controller.ts
import { Request, Response, NextFunction } from 'express';
import { ResultSetHeader, RowDataPacket } from 'mysql2';
import pool from '../config/db';
import { Branch } from '../models/branch.model';
import { asyncHandler } from '../middlewares/asyncHandler';

// Crear una sucursal (verifica propiedad de la marca)
export const createBranch = asyncHandler(async (req: Request, res: Response): Promise<Response> => {
  const { brand_id, name, address, latitude, longitude } = req.body as Branch;
  const ownerId = req.user?.userId;

  const [brands] = await pool.query<RowDataPacket[]>(
    'SELECT id FROM brands WHERE id = ? AND owner_id = ?',
    [brand_id, ownerId]
  );

  if (brands.length === 0) {
    return res.status(403).json({ message: 'No tienes permiso para agregar sucursales a esta marca' });
  }

  const [result] = await pool.query<ResultSetHeader>(
    'INSERT INTO branches (brand_id, name, address, latitude, longitude) VALUES (?, ?, ?, ?, ?)',
    [brand_id, name, address ?? null, latitude ?? null, longitude ?? null]
  );

  return res.status(201).json({
    message: 'Sucursal creada con éxito',
    data: {
      id: result.insertId,
      brand_id,
      name,
      address,
      latitude,
      longitude
    }
  });
});

// Obtener sucursales de una marca específica
export const getBranchesByBrand = asyncHandler(async (req: Request, res: Response): Promise<Response> => {
  const { brandId } = req.params;

  const [branches] = await pool.query<RowDataPacket[]>(
    'SELECT * FROM branches WHERE brand_id = ?',
    [brandId]
  );

  return res.status(200).json({
    message: 'Sucursales encontradas',
    data: branches as Branch[]
  });
});

// Actualizar una sucursal (verificando propiedad)
export const updateBranch = asyncHandler(async (req: Request, res: Response): Promise<Response> => {
  const { id } = req.params;
  const { name, address, latitude, longitude } = req.body as Partial<Branch>;
  const ownerId = req.user?.userId;

  const [rows] = await pool.query<RowDataPacket[]>(
    `SELECT b.id FROM branches b
     JOIN brands br ON b.brand_id = br.id
     WHERE b.id = ? AND br.owner_id = ?`,
    [id, ownerId]
  );

  if (rows.length === 0) {
    return res.status(403).json({ message: 'No tienes permiso para editar esta sucursal' });
  }

  await pool.query(
    'UPDATE branches SET name = ?, address = ?, latitude = ?, longitude = ? WHERE id = ?',
    [name, address ?? null, latitude ?? null, longitude ?? null, id]
  );

  return res.status(200).json({ message: 'Sucursal actualizada con éxito' });
});

// Eliminar una sucursal (verificando propiedad)
export const deleteBranch = asyncHandler(async (req: Request, res: Response): Promise<Response> => {
  const { id } = req.params;
  const ownerId = req.user?.userId;

  const [rows] = await pool.query<RowDataPacket[]>(
    `SELECT b.id FROM branches b
     JOIN brands br ON b.brand_id = br.id
     WHERE b.id = ? AND br.owner_id = ?`,
    [id, ownerId]
  );

  if (rows.length === 0) {
    return res.status(403).json({ message: 'No tienes permiso para eliminar esta sucursal' });
  }

  await pool.query('DELETE FROM branches WHERE id = ?', [id]);

  return res.status(200).json({ message: 'Sucursal eliminada con éxito' });
});

// Obtener todas las sucursales públicas estructuradas (para mapas)
export const getAllPublicBranches = asyncHandler(async (_req: Request, res: Response): Promise<Response> => {
  const [branches] = await pool.query<RowDataPacket[]>(`
    SELECT 
      b.id AS branch_id,
      b.name AS branch_name,
      b.address,
      b.latitude,
      b.longitude,
      br.id AS brand_id,
      br.name AS brand_name,
      br.logo_url
    FROM branches b
    JOIN brands br ON b.brand_id = br.id
  `);

  const formatted = branches.map(branch => ({
    id: branch.branch_id,
    name: branch.branch_name,
    address: branch.address,
    latitude: branch.latitude,
    longitude: branch.longitude,
    brand: {
      id: branch.brand_id,
      name: branch.brand_name,
      logo_url: branch.logo_url
    }
  }));

  return res.status(200).json({
    message: 'Sucursales públicas cargadas correctamente',
    data: formatted
  });
});

// ✅ Nuevo controlador: obtener detalle de una sucursal específica
export const getBranchById = asyncHandler(async (req: Request, res: Response): Promise<Response> => {
  const { id } = req.params;

  const [rows] = await pool.query<RowDataPacket[]>(
    `SELECT 
      b.id AS branch_id,
      b.name AS branch_name,
      b.address,
      b.latitude,
      b.longitude,
      br.id AS brand_id,
      br.name AS brand_name,
      br.logo_url
    FROM branches b
    JOIN brands br ON b.brand_id = br.id
    WHERE b.id = ?`,
    [id]
  );

  if (rows.length === 0) {
    return res.status(404).json({ message: 'Sucursal no encontrada' });
  }

  const branch = rows[0];
  return res.status(200).json({
    message: 'Detalle de sucursal',
    data: {
      id: branch.branch_id,
      name: branch.branch_name,
      address: branch.address,
      latitude: branch.latitude,
      longitude: branch.longitude,
      brand: {
        id: branch.brand_id,
        name: branch.brand_name,
        logo_url: branch.logo_url
      }
    }
  });
});