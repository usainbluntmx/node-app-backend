// src/routes/userVisit.routes.ts
import { Router } from 'express';
import { registerVisit, getMyVisits } from '../controllers/userVisit.controller';
import { verifyToken } from '../middlewares/verifyToken';
import { checkRole } from '../middlewares/checkRole';

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Visits
 *   description: Endpoints para registrar y consultar visitas a sucursales
 */

/**
 * @swagger
 * /visits:
 *   post:
 *     summary: Registrar visita a una sucursal
 *     tags: [Visits]
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
 *                 example: 5
 *     responses:
 *       201:
 *         description: Visita registrada
 *       400:
 *         description: Faltan campos requeridos
 *       404:
 *         description: Sucursal no encontrada
 */
router.post('/', verifyToken, checkRole('buyer'), registerVisit);

/**
 * @swagger
 * /visits:
 *   get:
 *     summary: Obtener historial de visitas del usuario autenticado
 *     tags: [Visits]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de visitas registradas
 */
router.get('/', verifyToken, checkRole('buyer'), getMyVisits);

export default router;