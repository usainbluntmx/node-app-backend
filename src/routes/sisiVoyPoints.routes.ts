// src/routes/sisiVoyPoints.routes.ts
import { Router } from 'express';
import {
  getMyPoints,
  assignPoints,
  redeemPoints
} from '../controllers/sisiVoyPoints.controller';
import { verifyToken } from '../middlewares/verifyToken';
import { checkRole } from '../middlewares/checkRole';

const router = Router();

/**
 * @swagger
 * tags:
 *   name: SisiVoyPoints
 *   description: Endpoints para gestión de puntos SISI VOY
 */

/**
 * @swagger
 * /me/points:
 *   get:
 *     summary: Obtener mis puntos acumulados
 *     tags: [SisiVoyPoints]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Puntos del usuario obtenidos correctamente
 */
router.get('/me/points', verifyToken, checkRole('buyer'), getMyPoints);

/**
 * @swagger
 * /me/points:
 *   post:
 *     summary: Asignar puntos al usuario (interno/backend)
 *     tags: [SisiVoyPoints]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               user_id:
 *                 type: integer
 *               points:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Puntos asignados correctamente
 */
router.post('/me/points', assignPoints);

/**
 * @swagger
 * /me/points/redeem:
 *   post:
 *     summary: Redimir puntos por cupón
 *     tags: [SisiVoyPoints]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - coupon_id
 *               - points_required
 *             properties:
 *               coupon_id:
 *                 type: integer
 *               points_required:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Cupón redimido correctamente
 *       400:
 *         description: Fondos insuficientes o datos inválidos
 */
router.post('/me/points/redeem', verifyToken, checkRole('buyer'), redeemPoints);

export default router;