// src/routes/couponRedemption.routes.ts
import { Router } from 'express';
import { verifyToken } from '../middlewares/verifyToken';
import { checkRole } from '../middlewares/checkRole';
import { redeemCoupon, getMyRedemptions } from '../controllers/couponRedemption.controller';

const router = Router();

/**
 * @swagger
 * tags:
 *   name: CouponRedemptions
 *   description: Registro de redenciones de cupones (QR)
 */

/**
 * @swagger
 * /redemptions:
 *   post:
 *     summary: Registrar la redención de un cupón (escaneo QR)
 *     tags: [CouponRedemptions]
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
 *               - branch_id
 *             properties:
 *               discount_id:
 *                 type: integer
 *               branch_id:
 *                 type: integer
 *     responses:
 *       201:
 *         description: Cupón redimido correctamente
 *       400:
 *         description: Faltan campos requeridos
 *       409:
 *         description: Cupón ya redimido
 *       401:
 *         description: No autorizado
 */
router.post('/', verifyToken, checkRole('buyer'), redeemCoupon);

/**
 * @swagger
 * /redemptions:
 *   get:
 *     summary: Obtener historial de cupones redimidos por el usuario autenticado
 *     tags: [CouponRedemptions]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de redenciones realizadas por el usuario
 *       401:
 *         description: No autorizado
 */
router.get('/', verifyToken, checkRole('buyer'), getMyRedemptions);

export default router;