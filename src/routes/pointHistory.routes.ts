// src/routes/pointHistory.routes.ts
import { Router } from 'express';
import { getPointHistory } from '../controllers/pointHistory.controller';
import { verifyToken } from '../middlewares/verifyToken';

const router = Router();

/**
 * @swagger
 * tags:
 *   name: PointHistory
 *   description: Historial de puntos del usuario (SISI VOY)
 */

/**
 * @swagger
 * /points/history:
 *   get:
 *     summary: Obtener el historial de puntos del usuario autenticado
 *     tags: [PointHistory]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Historial de puntos obtenido exitosamente
 *       401:
 *         description: No autorizado
 */
router.get('/history', verifyToken, getPointHistory);

export default router;