// src/controllers/branch.controller.ts
import { Request, Response } from 'express';
import pool from '../config/db';

// Crear una sucursal
export const createBranch = async (req: Request, res: Response): Promise<void> => {
  try {
    const { brand_id, name, address, latitude, longitude } = req.body;
    const userId = (req as any).user?.userId;

    // Verifica que el usuario es el dueño de la marca
    const [brands] = await pool.query(
      'SELECT * FROM brands WHERE id = ? AND owner_id = ?',
      [brand_id, userId]
    );

    if ((brands as any[]).length === 0) {
      res.status(403).json({ message: 'No tienes permiso para agregar sucursales a esta marca' });
      return;
    }

    const [result] = await pool.query(
      'INSERT INTO branches (brand_id, name, address, latitude, longitude) VALUES (?, ?, ?, ?, ?)',
      [brand_id, name, address, latitude, longitude]
    );

    res.status(201).json({
      message: 'Sucursal creada con éxito',
      branchId: (result as any).insertId
    });
  } catch (error) {
    console.error('Error al crear sucursal:', error);
    res.status(500).json({ message: 'Error del servidor' });
  }
};

// Obtener las sucursales por el brandId (privado)
export const getBranchesByBrand = async (req: Request, res: Response): Promise<void> => {
  try {
    const { brandId } = req.params;
    const [branches] = await pool.query('SELECT * FROM branches WHERE brand_id = ?', [brandId]);
    res.status(200).json(branches);
  } catch (error) {
    console.error('Error al obtener sucursales:', error);
    res.status(500).json({ message: 'Error del servidor' });
  }
};

// Editar la sucursal
export const updateBranch = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { name, address, latitude, longitude } = req.body;
    const userId = (req as any).user?.userId;

    const [branchRows] = await pool.query(
      `SELECT b.id FROM branches b
       JOIN brands br ON b.brand_id = br.id
       WHERE b.id = ? AND br.owner_id = ?`,
      [id, userId]
    );

    if ((branchRows as any[]).length === 0) {
      res.status(403).json({ message: 'No tienes permiso para editar esta sucursal' });
      return;
    }

    await pool.query(
      `UPDATE branches SET name = ?, address = ?, latitude = ?, longitude = ? WHERE id = ?`,
      [name, address, latitude, longitude, id]
    );

    res.status(200).json({ message: 'Sucursal actualizada con éxito' });
  } catch (error) {
    console.error('Error al actualizar sucursal:', error);
    res.status(500).json({ message: 'Error del servidor' });
  }
};

// Eliminar la sucursal
export const deleteBranch = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const userId = (req as any).user?.userId;

    const [branchRows] = await pool.query(
      `SELECT b.id FROM branches b
       JOIN brands br ON b.brand_id = br.id
       WHERE b.id = ? AND br.owner_id = ?`,
      [id, userId]
    );

    if ((branchRows as any[]).length === 0) {
      res.status(403).json({ message: 'No tienes permiso para eliminar esta sucursal' });
      return;
    }

    await pool.query('DELETE FROM branches WHERE id = ?', [id]);
    res.status(200).json({ message: 'Sucursal eliminada con éxito' });
  } catch (error) {
    console.error('Error al eliminar sucursal:', error);
    res.status(500).json({ message: 'Error del servidor' });
  }
};

// Obtener todas las sucursales publicas para el mapa (en formato estructurado)
export const getAllPublicBranches = async (req: Request, res: Response): Promise<void> => {
  try {
    const [branches] = await pool.query(`
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

    const formatted = (branches as any[]).map(branch => ({
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

    res.status(200).json(formatted);
  } catch (error) {
    console.error('Error al obtener sucursales públicas:', error);
    res.status(500).json({ message: 'Error al obtener sucursales públicas' });
  }
};
