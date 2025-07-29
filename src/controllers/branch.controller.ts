// src/controllers/branch.controller.ts
import { Request, Response } from 'express';
import { ResultSetHeader, RowDataPacket } from 'mysql2';
import pool from '../config/db';
import { Branch } from '../models/branch.model';
import { asyncHandler } from '../middlewares/asyncHandler';

// Crear una sucursal
export const createBranch = asyncHandler(async (req: Request, res: Response): Promise<Response> => {
  const {
    brand_id,
    name,
    address,
    latitude,
    longitude,
    services,
    average_spend,
    phone,
    website,
    opening_hours,
    images
  } = req.body as Branch;

  const ownerId = req.user?.userId;

  const [brandRows] = await pool.query<RowDataPacket[]>(
    'SELECT id FROM brands WHERE id = ? AND owner_id = ?',
    [brand_id, ownerId]
  );
  if (brandRows.length === 0) {
    return res.status(403).json({ message: 'No tienes permiso para agregar sucursales a esta marca' });
  }

  const [membershipRows] = await pool.query<RowDataPacket[]>(
    'SELECT id FROM seller_memberships WHERE user_id = ? AND is_active = true LIMIT 1',
    [ownerId]
  );
  if (membershipRows.length === 0) {
    return res.status(403).json({ message: 'Necesitas una membresía activa para agregar sucursales' });
  }

  const membershipId = membershipRows[0].id;

  const [result] = await pool.query<ResultSetHeader>(
    `INSERT INTO branches (brand_id, membership_id, name, address, latitude, longitude, services, average_spend, phone, website, opening_hours, images)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      brand_id,
      membershipId,
      name,
      address ?? null,
      latitude ?? null,
      longitude ?? null,
      services ?? null,
      average_spend ?? null,
      phone ?? null,
      website ?? null,
      opening_hours ?? null,
      JSON.stringify(images ?? [])
    ]
  );

  return res.status(201).json({
    message: 'Sucursal creada con éxito',
    data: {
      id: result.insertId,
      brand_id,
      membership_id: membershipId,
      name,
      address,
      latitude,
      longitude,
      services,
      average_spend,
      phone,
      website,
      opening_hours,
      images
    }
  });
});

// Obtener todas las sucursales de una marca
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

// Obtener sucursal por ID (detalle público)
export const getBranchById = asyncHandler(async (req: Request, res: Response): Promise<Response> => {
  const { id } = req.params;

  const [rows] = await pool.query<RowDataPacket[]>(
    `SELECT 
      b.id AS branch_id,
      b.name AS branch_name,
      b.address,
      b.latitude,
      b.longitude,
      b.services,
      b.average_spend,
      b.phone,
      b.website,
      b.opening_hours,
      b.images,
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
      services: branch.services,
      average_spend: branch.average_spend,
      phone: branch.phone,
      website: branch.website,
      opening_hours: branch.opening_hours,
      images: JSON.parse(branch.images || '[]'),
      brand: {
        id: branch.brand_id,
        name: branch.brand_name,
        logo_url: branch.logo_url
      }
    }
  });
});

// Obtener todas las sucursales para vista pública (mapa)
export const getAllPublicBranches = asyncHandler(async (_req: Request, res: Response): Promise<Response> => {
  const [branches] = await pool.query<RowDataPacket[]>(
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
    JOIN brands br ON b.brand_id = br.id`
  );

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

// Actualizar una sucursal
export const updateBranch = asyncHandler(async (req: Request, res: Response): Promise<Response> => {
  const { id } = req.params;
  const {
    name,
    address,
    latitude,
    longitude,
    services,
    average_spend,
    phone,
    website,
    opening_hours,
    images
  } = req.body as Partial<Branch>;
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
    `UPDATE branches SET 
      name = ?, 
      address = ?, 
      latitude = ?, 
      longitude = ?, 
      services = ?, 
      average_spend = ?, 
      phone = ?, 
      website = ?, 
      opening_hours = ?, 
      images = ? 
     WHERE id = ?`,
    [
      name ?? null,
      address ?? null,
      latitude ?? null,
      longitude ?? null,
      services ?? null,
      average_spend ?? null,
      phone ?? null,
      website ?? null,
      opening_hours ?? null,
      JSON.stringify(images ?? []),
      id
    ]
  );

  return res.status(200).json({ message: 'Sucursal actualizada con éxito' });
});

// Eliminar una sucursal
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
