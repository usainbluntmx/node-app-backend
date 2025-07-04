// src/routes/branch.routes.ts
import { Router } from 'express';
import {
  createBranch,
  getBranchesByBrand,
  getBranchById, // nuevo
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
 *               - brand_id
 *               - name
 *               - latitude
 *               - longitude
 *             properties:
 *               brand_id:
 *                 type: integer
 *               name:
 *                 type: string
 *               address:
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
 *           type: integer
 *     responses:
 *       200:
 *         description: Lista de sucursales de la marca
 */
router.get('/:brandId', verifyToken, getBranchesByBrand);

/**
 * @swagger
 * /branches/detail/{id}:
 *   get:
 *     summary: Ver detalle de una sucursal (branch)
 *     tags: [Branches]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Detalle de sucursal encontrado
 *       404:
 *         description: Sucursal no encontrada
 */
router.get('/detail/:id', getBranchById);

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
 *           type: integer
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               address:
 *                 type: string
 *               latitude:
 *                 type: number
 *               longitude:
 *                 type: number
 *     responses:
 *       200:
 *         description: Sucursal actualizada correctamente
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
 *           type: integer
 *     responses:
 *       200:
 *         description: Sucursal eliminada correctamente
 */
router.delete('/:id', verifyToken, checkRole('seller'), deleteBranch);

export default router;