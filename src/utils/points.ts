// src/utils/points.ts
import pool from '../config/db';
import { ResultSetHeader, RowDataPacket } from 'mysql2';

export const addPointsToUser = async (
  userId: number,
  pointsToAdd: number,
  expirationDays: number = 180 // Por defecto, los puntos expiran en 6 meses
): Promise<void> => {
  // Consultar si ya existe un historial para este usuario
  const [rows] = await pool.query<RowDataPacket[]>(
    'SELECT * FROM point_history WHERE user_id = ?',
    [userId]
  );

  const expirationDate = new Date();
  expirationDate.setDate(expirationDate.getDate() + expirationDays);

  if (rows.length === 0) {
    // Crear nuevo registro de historial
    await pool.query<ResultSetHeader>(
      `INSERT INTO point_history (user_id, current_points, total_points, expiration_date)
       VALUES (?, ?, ?, ?)`,
      [userId, pointsToAdd, pointsToAdd, expirationDate]
    );
  } else {
    // Actualizar el registro existente
    const current = rows[0];
    const updatedPoints = current.current_points + pointsToAdd;
    const updatedTotal = current.total_points + pointsToAdd;

    await pool.query(
      `UPDATE point_history
       SET current_points = ?, total_points = ?, expiration_date = ?
       WHERE user_id = ?`,
      [updatedPoints, updatedTotal, expirationDate, userId]
    );
  }
};