// src/controllers/brand.controller.ts
import { Request, Response } from 'express';
import { ResultSetHeader, RowDataPacket } from 'mysql2';
import pool from '../config/db';
import { Brand } from '../models/brand.model';
import { asyncHandler } from '../middlewares/asyncHandler';

// Crear una nueva marca
export const createBrand = asyncHandler(async (req: Request, res: Response): Promise<Response> => {
  const {
    name,
    description,
    logo_url,
    business_type,
    business_size,
    website,
    social_links
  } = req.body as Brand;

  const ownerId = req.user?.userId;

  if (!name || !ownerId) {
    return res.status(400).json({ message: 'Faltan datos obligatorios' });
  }

  const [result] = await pool.query<ResultSetHeader>(
    'INSERT INTO brands (name, description, logo_url, owner_id, business_type, business_size, website, social_links) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
    [
      name,
      description ?? null,
      logo_url ?? null,
      ownerId,
      business_type ?? null,
      business_size ?? null,
      website ?? null,
      social_links ? JSON.stringify(social_links) : null
    ]
  );

  return res.status(201).json({
    message: 'Marca creada correctamente',
    brand: {
      id: result.insertId,
      name,
      description: description ?? null,
      logo_url: logo_url ?? null,
      owner_id: ownerId,
      business_type: business_type ?? null,
      business_size: business_size ?? null,
      website: website ?? null,
      social_links: social_links ?? []
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
    data: (brands as Brand[]).map(brand => ({
      ...brand,
      social_links: brand.social_links ?? []
    }))
  });
});

// Obtener una marca por ID
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

  const brand = brands[0] as Brand;
  return res.status(200).json({
    message: 'Marca encontrada',
    data: {
      ...brand,
      social_links: brand.social_links ?? []
    }
  });
});

// Actualizar una marca
export const updateBrand = asyncHandler(async (req: Request, res: Response): Promise<Response> => {
  const { id } = req.params;
  const {
    name,
    description,
    logo_url,
    business_type,
    business_size,
    website,
    social_links
  } = req.body as Partial<Brand>;

  const ownerId = req.user?.userId;

  const [brands] = await pool.query<RowDataPacket[]>(
    'SELECT * FROM brands WHERE id = ? AND owner_id = ?',
    [id, ownerId]
  );

  if (brands.length === 0) {
    return res.status(404).json({ message: 'Marca no encontrada o no autorizada' });
  }

  const current = brands[0];

  await pool.query(
    'UPDATE brands SET name = ?, description = ?, logo_url = ?, business_type = ?, business_size = ?, website = ?, social_links = ? WHERE id = ? AND owner_id = ?',
    [
      name ?? current.name,
      description ?? current.description,
      logo_url ?? current.logo_url,
      business_type ?? current.business_type,
      business_size ?? current.business_size,
      website ?? current.website,
      social_links ? JSON.stringify(social_links) : current.social_links,
      id,
      ownerId
    ]
  );

  return res.status(200).json({
    message: 'Marca actualizada correctamente',
    data: {
      id,
      name: name ?? current.name,
      description: description ?? current.description,
      logo_url: logo_url ?? current.logo_url,
      business_type: business_type ?? current.business_type,
      business_size: business_size ?? current.business_size,
      website: website ?? current.website,
      social_links: social_links ?? JSON.parse(current.social_links || '[]')
    }
  });
});

// Eliminar una marca
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

// Registrar marca con sucursal inicial
export const registerBrandWithBranch = asyncHandler(async (req: Request, res: Response): Promise<Response> => {
  const {
    name,
    description,
    logo_url,
    business_type,
    business_size,
    website,
    social_links,
    branch
  } = req.body;

  const ownerId = req.user?.userId;

  if (!name || !branch?.name || !branch?.address) {
    return res.status(400).json({ message: 'Faltan datos obligatorios para la marca o la sucursal' });
  }

  const [brandResult] = await pool.query<ResultSetHeader>(
    'INSERT INTO brands (name, description, logo_url, owner_id, business_type, business_size, website, social_links) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
    [
      name,
      description ?? null,
      logo_url ?? null,
      ownerId,
      business_type ?? null,
      business_size ?? null,
      website ?? null,
      social_links ? JSON.stringify(social_links) : null
    ]
  );

  const brandId = brandResult.insertId;

  await pool.query(
    'INSERT INTO branches (name, address, latitude, longitude, brand_id) VALUES (?, ?, ?, ?, ?)',
    [branch.name, branch.address, branch.latitude ?? null, branch.longitude ?? null, brandId]
  );

  return res.status(201).json({
    message: 'Marca y sucursal registradas exitosamente',
    brandId
  });
});