// src/routes/branch.routes.ts
import { Router } from 'express';
import {
  createBranch,
  getBranchesByBrand,
  getBranchById,
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
 *     summary: Obtener todas las sucursales públicas (para el mapa)
 *     tags: [Branches]
 *     responses:
 *       200:
 *         description: Lista de sucursales públicas obtenida correctamente
 */
router.get('/public', getAllPublicBranches);

/**
 * @swagger
 * /branches:
 *   post:
 *     summary: Crear una nueva sucursal (requiere membresía activa)
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
 *       403:
 *         description: Permiso denegado o sin membresía activa
 */
router.post('/', verifyToken, checkRole('seller'), createBranch);

/**
 * @swagger
 * /branches/{brandId}:
 *   get:
 *     summary: Obtener todas las sucursales de una marca
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
 *         description: Lista de sucursales obtenida correctamente
 */
router.get('/:brandId', verifyToken, getBranchesByBrand);

/**
 * @swagger
 * /branches/detail/{id}:
 *   get:
 *     summary: Obtener detalle de una sucursal
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
 *       403:
 *         description: No autorizado para editar la sucursal
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
 *           type: integer
 *     responses:
 *       200:
 *         description: Sucursal eliminada correctamente
 *       403:
 *         description: No autorizado para eliminar la sucursal
 *       404:
 *         description: Sucursal no encontrada
 */
router.delete('/:id', verifyToken, checkRole('seller'), deleteBranch);

export default router;