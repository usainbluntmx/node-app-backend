// src/routes/me.routes.ts
import { Router } from 'express';
import { getMyProfile, updateMyProfile } from '../controllers/me.controller';
import { verifyToken } from '../middlewares/verifyToken';
import { asyncHandler } from '../middlewares/asyncHandler';

const router = Router();

/**
 * @swagger
 * /me:
 *   get:
 *     summary: Obtener el perfil del usuario autenticado
 *     tags: [Perfil]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Perfil del usuario
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 */
router.get('/', verifyToken, asyncHandler(getMyProfile));

/**
 * @swagger
 * /me:
 *   put:
 *     summary: Actualizar perfil del usuario autenticado
 *     tags: [Perfil]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: Nuevo Nombre
 *               password:
 *                 type: string
 *                 example: nueva_contrasena123
 *     responses:
 *       200:
 *         description: Perfil actualizado correctamente
 *       400:
 *         description: Solicitud inválida
 */
router.put('/', verifyToken, asyncHandler(updateMyProfile));

export default router;