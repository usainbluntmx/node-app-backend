// src/controllers/brand.controller.ts
import { Response } from 'express';
import { AuthRequest } from '../types/express';
import pool from '../config/db';

export const createBrand = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { name, description, logo_url } = req.body;
    const ownerId = req.user?.userId;

    if (!name || !ownerId) {
      res.status(400).json({ message: 'Faltan datos' });
      return;
    }

    const [result] = await pool.query(
      'INSERT INTO brands (name, description, logo_url, owner_id) VALUES (?, ?, ?, ?)',
      [name, description || null, logo_url || null, ownerId]
    );

    res.status(201).json({
      message: 'Marca creada correctamente',
      brand: {
        id: (result as any).insertId,
        name,
        description,
        logo_url,
        owner_id: ownerId
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al crear la marca' });
  }
};

export const getAllBrands = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const ownerId = req.user?.userId;
    const [brands] = await pool.query(
      'SELECT * FROM brands WHERE owner_id = ?',
      [ownerId]
    );
    res.status(200).json(brands);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al obtener marcas' });
  }
};

export const getBrandById = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const ownerId = req.user?.userId;

    const [brands] = await pool.query(
      'SELECT * FROM brands WHERE id = ? AND owner_id = ?',
      [id, ownerId]
    );

    if ((brands as any).length === 0) {
      res.status(404).json({ message: 'Marca no encontrada' });
      return;
    }

    res.status(200).json((brands as any)[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al obtener la marca' });
  }
};

export const updateBrand = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { name, description, logo_url } = req.body;
    const ownerId = req.user?.userId;

    const [result] = await pool.query(
      'UPDATE brands SET name = ?, description = ?, logo_url = ? WHERE id = ? AND owner_id = ?',
      [name, description || null, logo_url || null, id, ownerId]
    );

    if ((result as any).affectedRows === 0) {
      res.status(404).json({ message: 'Marca no encontrada o no autorizada' });
      return;
    }

    res.status(200).json({ message: 'Marca actualizada correctamente' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al actualizar la marca' });
  }
};

export const deleteBrand = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const ownerId = req.user?.userId;

    const [result] = await pool.query(
      'DELETE FROM brands WHERE id = ? AND owner_id = ?',
      [id, ownerId]
    );

    if ((result as any).affectedRows === 0) {
      res.status(404).json({ message: 'Marca no encontrada o no autorizada' });
      return;
    }

    res.status(200).json({ message: 'Marca eliminada correctamente' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al eliminar la marca' });
  }
};
