// src/routes/favorite.routes.ts
import { Router } from 'express';
import {
  addFavorite,
  getFavorites,
  deleteFavorite
} from '../controllers/favorite.controller';
import { verifyToken } from '../middlewares/verifyToken';
import { checkRole } from '../middlewares/checkRole';

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Favorites
 *   description: Endpoints para gestionar favoritos de sucursales
 */

/**
 * @swagger
 * /favorites:
 *   post:
 *     summary: Agregar una sucursal a favoritos
 *     tags: [Favorites]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - branch_id
 *             properties:
 *               branch_id:
 *                 type: integer
 *                 example: 3
 *     responses:
 *       201:
 *         description: Sucursal agregada a favoritos
 *       400:
 *         description: Faltan campos requeridos
 *       404:
 *         description: Sucursal no encontrada
 *       409:
 *         description: Ya es un favorito
 *       401:
 *         description: No autorizado
 */
router.post('/', verifyToken, checkRole('buyer'), addFavorite);

/**
 * @swagger
 * /favorites:
 *   get:
 *     summary: Obtener sucursales favoritas del usuario autenticado
 *     tags: [Favorites]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de sucursales favoritas
 *       401:
 *         description: No autorizado
 */
router.get('/', verifyToken, checkRole('buyer'), getFavorites);

/**
 * @swagger
 * /favorites/{id}:
 *   delete:
 *     summary: Eliminar una sucursal de favoritos por ID
 *     tags: [Favorites]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la sucursal a eliminar de favoritos
 *     responses:
 *       200:
 *         description: Sucursal eliminada de favoritos
 *       404:
 *         description: Favorito no encontrado
 *       401:
 *         description: No autorizado
 */
router.delete('/:id', verifyToken, checkRole('buyer'), deleteFavorite);

export default router;