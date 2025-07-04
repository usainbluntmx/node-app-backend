// src/routes/sellerProfile.routes.ts
import { Router } from 'express';
import {
  createOrUpdateBillingInfo,
  getBillingInfo,
  createMembership,
  getMembership,
  getMembershipHistory,
  getActiveMembershipStatus
} from '../controllers/sellerProfile.controller';
import { verifyToken } from '../middlewares/verifyToken';
import { checkRole } from '../middlewares/checkRole';

const router = Router();

/**
 * @swagger
 * tags:
 *   name: SellerProfile
 *   description: Gestión de datos fiscales y membresías del vendedor
 */

/**
 * @swagger
 * /seller/billing:
 *   post:
 *     summary: Crear o actualizar datos fiscales del vendedor
 *     tags: [SellerProfile]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - full_name
 *               - tax_id
 *               - email
 *               - phone
 *               - cfdi_usage
 *             properties:
 *               full_name:
 *                 type: string
 *               tax_id:
 *                 type: string
 *               email:
 *                 type: string
 *               phone:
 *                 type: string
 *               cfdi_usage:
 *                 type: string
 *     responses:
 *       201:
 *         description: Datos fiscales registrados
 *       200:
 *         description: Datos fiscales actualizados
 */
router.post('/billing', verifyToken, checkRole('seller'), createOrUpdateBillingInfo);

/**
 * @swagger
 * /seller/billing:
 *   get:
 *     summary: Obtener los datos fiscales del vendedor
 *     tags: [SellerProfile]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Datos fiscales obtenidos correctamente
 *       404:
 *         description: No se encontraron datos fiscales
 */
router.get('/billing', verifyToken, checkRole('seller'), getBillingInfo);

/**
 * @swagger
 * /seller/membership:
 *   post:
 *     summary: Registrar una nueva membresía del vendedor
 *     tags: [SellerProfile]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - payment_method
 *             properties:
 *               payment_method:
 *                 type: string
 *                 enum: [card, bank_transfer, oxxo]
 *               payment_reference:
 *                 type: string
 *     responses:
 *       201:
 *         description: Membresía registrada correctamente
 *       409:
 *         description: Ya existe una membresía para este vendedor
 */
router.post('/membership', verifyToken, checkRole('seller'), createMembership);

/**
 * @swagger
 * /seller/membership:
 *   get:
 *     summary: Obtener la membresía actual del vendedor
 *     tags: [SellerProfile]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Membresía actual obtenida correctamente
 *       404:
 *         description: No se ha registrado una membresía aún
 */
router.get('/membership', verifyToken, checkRole('seller'), getMembership);

/**
 * @swagger
 * /seller/membership/history:
 *   get:
 *     summary: Obtener el historial de membresías del vendedor
 *     tags: [SellerProfile]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Historial de membresías obtenido correctamente
 */
router.get('/membership/history', verifyToken, checkRole('seller'), getMembershipHistory);

/**
 * @swagger
 * /seller/membership/status:
 *   get:
 *     summary: Consultar estado de membresía activa actual
 *     tags: [SellerProfile]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Estado de membresía obtenido correctamente
 */
router.get('/membership/status', verifyToken, checkRole('seller'), getActiveMembershipStatus);

export default router;