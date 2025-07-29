// src/routes/loyaltyCard.routes.ts
import { Router } from 'express';
import {
  createLoyaltyCard,
  getLoyaltyCards,
  getLoyaltyCardById,
  updateLoyaltyCard,
  deleteLoyaltyCard
} from '../controllers/loyaltyCard.controller';
import { verifyToken } from '../middlewares/verifyToken';
import { checkRole } from '../middlewares/checkRole';
import { asyncHandler } from '../middlewares/asyncHandler';

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Tarjetas de Lealtad
 *   description: Gestión de tarjetas de lealtad
 */

/**
 * @swagger
 * /loyalty-cards:
 *   get:
 *     summary: Obtener todas las tarjetas de lealtad activas
 *     tags: [Tarjetas de Lealtad]
 *     responses:
 *       200:
 *         description: Lista de tarjetas
 */
router.get('/', asyncHandler(getLoyaltyCards));

/**
 * @swagger
 * /loyalty-cards/{id}:
 *   get:
 *     summary: Obtener tarjeta por ID
 *     tags: [Tarjetas de Lealtad]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Tarjeta encontrada
 *       404:
 *         description: No encontrada
 */
router.get('/:id', asyncHandler(getLoyaltyCardById));

/**
 * @swagger
 * /loyalty-cards:
 *   post:
 *     summary: Crear tarjeta de lealtad
 *     tags: [Tarjetas de Lealtad]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - brand_id
 *               - total_visits_required
 *               - expiration_date
 *             properties:
 *               brand_id:
 *                 type: integer
 *               coupon_id:
 *                 type: integer
 *                 nullable: true
 *               total_visits_required:
 *                 type: integer
 *               expiration_date:
 *                 type: string
 *                 format: date
 *     responses:
 *       201:
 *         description: Creada exitosamente
 */
router.post('/', verifyToken, checkRole('seller'), asyncHandler(createLoyaltyCard));

/**
 * @swagger
 * /loyalty-cards/{id}:
 *   put:
 *     summary: Actualizar tarjeta de lealtad
 *     tags: [Tarjetas de Lealtad]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               coupon_id:
 *                 type: integer
 *                 nullable: true
 *               total_visits_required:
 *                 type: integer
 *               expiration_date:
 *                 type: string
 *                 format: date
 *               is_active:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Actualizada correctamente
 */
router.put('/:id', verifyToken, checkRole('seller'), asyncHandler(updateLoyaltyCard));

/**
 * @swagger
 * /loyalty-cards/{id}:
 *   delete:
 *     summary: Desactivar tarjeta de lealtad
 *     tags: [Tarjetas de Lealtad]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Desactivada exitosamente
 */
router.delete('/:id', verifyToken, checkRole('seller'), asyncHandler(deleteLoyaltyCard));

export default router;