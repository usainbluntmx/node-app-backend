// src/routes/me.routes.ts
import { Router } from 'express';
import { getMyProfile, updateMyProfile } from '../controllers/me.controller';
import { verifyToken } from '../middlewares/verifyToken';
import { asyncHandler } from '../middlewares/asyncHandler';

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Perfil
 *   description: Endpoints relacionados al perfil del usuario autenticado
 */

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
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 user:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                     name:
 *                       type: string
 *                     email:
 *                       type: string
 *                     role:
 *                       type: string
 *                       enum: [buyer, seller]
 *                     birth_date:
 *                       type: string
 *                       format: date
 *                       nullable: true
 *                     phone:
 *                       type: string
 *                       nullable: true
 *                     referral_code:
 *                       type: string
 *                       nullable: true
 *                     created_at:
 *                       type: string
 *                       format: date-time
 *                     membership_type:
 *                       type: string
 *                       nullable: true
 *                       description: Tipo de membresía activa (si es seller), o null
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