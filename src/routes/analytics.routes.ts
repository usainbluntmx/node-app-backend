// src/routes/analytics.routes.ts
import { Router } from 'express';
import {
  getVisitsByBranch,
  getRedemptionsByDiscount
} from '../controllers/analytics.controller';
import { verifyToken } from '../middlewares/verifyToken';
import { checkRole } from '../middlewares/checkRole';

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Analytics
 *   description: Estadísticas y reportes para administradores o vendedores
 */

/**
 * @swagger
 * /analytics/branches/{id}/visits:
 *   get:
 *     summary: Obtener número total de visitas a una sucursal
 *     tags: [Analytics]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID de la sucursal
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Número de visitas encontrado
 *       401:
 *         description: No autorizado
 */
router.get('/branches/:id/visits', verifyToken, checkRole('seller'), getVisitsByBranch);

/**
 * @swagger
 * /analytics/discounts/{id}/redemptions:
 *   get:
 *     summary: Obtener número de redenciones de un descuento
 *     tags: [Analytics]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID del descuento
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Número de redenciones encontrado
 *       401:
 *         description: No autorizado
 */
router.get('/discounts/:id/redemptions', verifyToken, checkRole('seller'), getRedemptionsByDiscount);

export default router;