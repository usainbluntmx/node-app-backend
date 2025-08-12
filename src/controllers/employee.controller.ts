// src/controllers/employee.controller.ts
import { Request, Response } from 'express';
import { ResultSetHeader, RowDataPacket } from 'mysql2';
import pool from '../config/db';
import { asyncHandler } from '../middlewares/asyncHandler';

interface Employee {
  id?: number;
  name: string;
  email: string;
  permissions: string[]; // Array de strings como: ['ver_descuentos', 'editar']
  branch_id: number;
}

// Crear colaborador
export const createEmployee = asyncHandler(async (req: Request, res: Response): Promise<Response> => {
  const { name, email, permissions, branch_id } = req.body as Employee;
  const ownerId = req.user?.userId;

  // Verificar si el usuario es dueño de la sucursal
  const [rows] = await pool.query<RowDataPacket[]>(
    `SELECT b.id FROM branches b 
     JOIN brands br ON b.brand_id = br.id 
     WHERE b.id = ? AND br.owner_id = ?`,
    [branch_id, ownerId]
  );

  if (rows.length === 0) {
    return res.status(403).json({ message: 'No autorizado para agregar empleados a esta sucursal' });
  }

  const [result] = await pool.query<ResultSetHeader>(
    `INSERT INTO employees (name, email, permissions, branch_id) 
     VALUES (?, ?, ?, ?)`,
    [name, email, JSON.stringify(permissions), branch_id]
  );

  return res.status(201).json({
    message: 'Colaborador creado exitosamente',
    data: { id: result.insertId, name, email, permissions, branch_id }
  });
});

// Obtener todos los empleados de una sucursal
export const getEmployeesByBranch = asyncHandler(async (req: Request, res: Response): Promise<Response> => {
  const { branchId } = req.params;
  const ownerId = req.user?.userId;

  const [rows] = await pool.query<RowDataPacket[]>(
    `SELECT e.* FROM employees e
     JOIN branches b ON e.branch_id = b.id
     JOIN brands br ON b.brand_id = br.id
     WHERE e.branch_id = ? AND br.owner_id = ?`,
    [branchId, ownerId]
  );

  const employees = rows.map(emp => ({
    ...emp,
    permissions: emp.permissions ? JSON.parse(emp.permissions) : []
  }));

  return res.status(200).json({
    message: 'Colaboradores encontrados',
    data: employees
  });
});

// Actualizar colaborador
export const updateEmployee = asyncHandler(async (req: Request, res: Response): Promise<Response> => {
  const { id } = req.params;
  const { name, email, permissions } = req.body as Partial<Employee>;
  const ownerId = req.user?.userId;

  const [rows] = await pool.query<RowDataPacket[]>(
    `SELECT e.id, e.branch_id FROM employees e
     JOIN branches b ON e.branch_id = b.id
     JOIN brands br ON b.brand_id = br.id
     WHERE e.id = ? AND br.owner_id = ?`,
    [id, ownerId]
  );

  if (rows.length === 0) {
    return res.status(403).json({ message: 'No autorizado para editar este colaborador' });
  }

  const current = rows[0];

  await pool.query(
    `UPDATE employees SET name = ?, email = ?, permissions = ? WHERE id = ?`,
    [
      name ?? current.name,
      email ?? current.email,
      permissions ? JSON.stringify(permissions) : current.permissions,
      id
    ]
  );

  return res.status(200).json({ message: 'Colaborador actualizado correctamente' });
});

// Eliminar colaborador
export const deleteEmployee = asyncHandler(async (req: Request, res: Response): Promise<Response> => {
  const { id } = req.params;
  const ownerId = req.user?.userId;

  const [rows] = await pool.query<RowDataPacket[]>(
    `SELECT e.id FROM employees e
     JOIN branches b ON e.branch_id = b.id
     JOIN brands br ON b.brand_id = br.id
     WHERE e.id = ? AND br.owner_id = ?`,
    [id, ownerId]
  );

  if (rows.length === 0) {
    return res.status(403).json({ message: 'No autorizado para eliminar este colaborador' });
  }

  await pool.query('DELETE FROM employees WHERE id = ?', [id]);

  return res.status(200).json({ message: 'Colaborador eliminado correctamente' });
});