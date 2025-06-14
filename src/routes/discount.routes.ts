// src/routes/discount.routes.ts
import { Router } from 'express';
import {
  createDiscount,
  getAllDiscounts,
  deleteDiscount,
  getDiscountById
} from '../controllers/discount.controller';
import { verifyToken } from '../middlewares/verifyToken';
import { checkRole } from '../middlewares/checkRole';

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Discounts
 *   description: Endpoints para gestionar descuentos
 */

/**
 * @swagger
 * /discounts:
 *   get:
 *     summary: Obtener todos los descuentos activos
 *     tags: [Discounts]
 *     parameters:
 *       - in: query
 *         name: brand_id
 *         schema:
 *           type: integer
 *         description: Filtrar por ID de marca
 *       - in: query
 *         name: branch_id
 *         schema:
 *           type: integer
 *         description: Filtrar por ID de sucursal
 *       - in: query
 *         name: type
 *         schema:
 *           type: string
 *           enum: [product, service, amount, free]
 *         description: Filtrar por tipo de descuento
 *     responses:
 *       200:
 *         description: Lista de descuentos activos
 *       500:
 *         description: Error interno del servidor
 */
router.get('/', getAllDiscounts);

/**
 * @swagger
 * /discounts:
 *   post:
 *     summary: Crear un nuevo descuento
 *     tags: [Discounts]
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
 *               - branch_id
 *               - title
 *               - type
 *             properties:
 *               brand_id:
 *                 type: integer
 *                 example: 1
 *               branch_id:
 *                 type: integer
 *                 example: 3
 *               title:
 *                 type: string
 *                 example: "10% en hamburguesas"
 *               type:
 *                 type: string
 *                 enum: [product, service, amount, free]
 *                 example: product
 *               description:
 *                 type: string
 *                 example: "Solo los viernes"
 *               value:
 *                 type: number
 *                 example: 10
 *               min_purchase:
 *                 type: number
 *                 example: 100
 *               product_or_service_name:
 *                 type: string
 *                 example: "Hamburguesa clásica"
 *     responses:
 *       201:
 *         description: Descuento creado exitosamente
 *       400:
 *         description: Datos inválidos o faltantes
 *       401:
 *         description: No autorizado
 *       500:
 *         description: Error interno del servidor
 */
router.post('/', verifyToken, checkRole('seller'), createDiscount);

/**
 * @swagger
 * /discounts/{id}:
 *   get:
 *     summary: Obtener un descuento específico por ID
 *     tags: [Discounts]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del descuento a consultar
 *     responses:
 *       200:
 *         description: Descuento encontrado
 *       404:
 *         description: Descuento no encontrado o inactivo
 *       500:
 *         description: Error interno del servidor
 */
router.get('/:id', getDiscountById);

/**
 * @swagger
 * /discounts/{id}:
 *   delete:
 *     summary: Eliminar (lógicamente) un descuento por ID
 *     tags: [Discounts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID del descuento a eliminar
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Descuento eliminado lógicamente
 *       404:
 *         description: Descuento no encontrado o ya inactivo
 *       401:
 *         description: No autorizado
 *       500:
 *         description: Error interno del servidor
 */
router.delete('/:id', verifyToken, checkRole('seller'), deleteDiscount);

export default router;
