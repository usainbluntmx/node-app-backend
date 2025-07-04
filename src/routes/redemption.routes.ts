// src/routes/redemption.routes.ts
import { Router } from 'express';
import { redeemCoupon, getMyRedemptions } from '../controllers/redemption.controller';
import { verifyToken } from '../middlewares/verifyToken';
import { checkRole } from '../middlewares/checkRole';

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Redemptions
 *   description: Endpoints para redención de descuentos
 */

/**
 * @swagger
 * /redemptions:
 *   post:
 *     summary: Canjear un descuento por el usuario autenticado
 *     tags: [Redemptions]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - discount_id
 *             properties:
 *               discount_id:
 *                 type: integer
 *                 example: 7
 *     responses:
 *       201:
 *         description: Descuento canjeado exitosamente
 *       400:
 *         description: Campo faltante
 *       404:
 *         description: Descuento no encontrado o inactivo
 *       409:
 *         description: Ya fue canjeado previamente
 *       401:
 *         description: No autorizado
 */
router.post('/', verifyToken, checkRole('buyer'), redeemCoupon);

/**
 * @swagger
 * /redemptions:
 *   get:
 *     summary: Obtener historial de redenciones del usuario autenticado
 *     tags: [Redemptions]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de redenciones del usuario
 *       401:
 *         description: No autorizado
 */
router.get('/', verifyToken, checkRole('buyer'), getMyRedemptions);

export default router;