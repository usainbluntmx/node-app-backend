// src/routes/branch.routes.ts
import { Router } from 'express';
import {
  createBranch,
  getBranchesByBrand,
  updateBranch,
  deleteBranch,
  getAllPublicBranches
} from '../controllers/branch.controller';
import { verifyToken } from '../middlewares/verifyToken';
import { checkRole } from '../middlewares/checkRole';

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Branches
 *   description: Endpoints para gestión de sucursales (branches)
 */

/**
 * @swagger
 * /branches/public:
 *   get:
 *     summary: Obtener todas las sucursales públicas (para Google Maps)
 *     tags: [Branches]
 *     responses:
 *       200:
 *         description: Lista de sucursales públicas
 */
router.get('/public', getAllPublicBranches);

/**
 * @swagger
 * /branches:
 *   post:
 *     summary: Crear una nueva sucursal
 *     tags: [Branches]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - brandId
 *               - name
 *               - latitude
 *               - longitude
 *             properties:
 *               brandId:
 *                 type: string
 *               name:
 *                 type: string
 *               latitude:
 *                 type: number
 *               longitude:
 *                 type: number
 *     responses:
 *       201:
 *         description: Sucursal creada exitosamente
 */
router.post('/', verifyToken, checkRole('seller'), createBranch);

/**
 * @swagger
 * /branches/{brandId}:
 *   get:
 *     summary: Obtener las sucursales de una marca
 *     tags: [Branches]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: brandId
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Lista de sucursales de la marca
 *       404:
 *         description: Marca no encontrada o sin sucursales
 */
router.get('/:brandId', verifyToken, getBranchesByBrand);

/**
 * @swagger
 * /branches/{id}:
 *   put:
 *     summary: Actualizar una sucursal
 *     tags: [Branches]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               latitude:
 *                 type: number
 *               longitude:
 *                 type: number
 *     responses:
 *       200:
 *         description: Sucursal actualizada correctamente
 *       404:
 *         description: Sucursal no encontrada
 */
router.put('/:id', verifyToken, checkRole('seller'), updateBranch);

/**
 * @swagger
 * /branches/{id}:
 *   delete:
 *     summary: Eliminar una sucursal
 *     tags: [Branches]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Sucursal eliminada correctamente
 *       404:
 *         description: Sucursal no encontrada
 */
router.delete('/:id', verifyToken, checkRole('seller'), deleteBranch);

export default router;
