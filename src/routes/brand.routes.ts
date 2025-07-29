// src/routes/brand.routes.ts
import { Router } from 'express';
import {
  createBrand,
  getAllBrands,
  getBrandById,
  updateBrand,
  deleteBrand,
  registerBrandWithBranch,
} from '../controllers/brand.controller';
import { verifyToken } from '../middlewares/verifyToken';
import { checkRole } from '../middlewares/checkRole';

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Brands
 *   description: Endpoints para gestión de marcas
 */

/**
 * @swagger
 * /brands:
 *   post:
 *     summary: Crear una nueva marca
 *     tags: [Brands]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               logo_url:
 *                 type: string
 *               business_type:
 *                 type: string
 *               business_size:
 *                 type: string
 *               website:
 *                 type: string
 *               social_links:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       201:
 *         description: Marca creada correctamente
 *       400:
 *         description: Datos inválidos o faltantes
 */
router.post('/', verifyToken, checkRole('seller'), createBrand);

/**
 * @swagger
 * /brands/register-full:
 *   post:
 *     summary: Registrar una nueva marca junto con la sucursal inicial
 *     tags: [Brands]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - branch
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               logo_url:
 *                 type: string
 *               business_type:
 *                 type: string
 *               business_size:
 *                 type: string
 *               website:
 *                 type: string
 *               social_links:
 *                 type: array
 *                 items:
 *                   type: string
 *               branch:
 *                 type: object
 *                 required:
 *                   - name
 *                   - address
 *                 properties:
 *                   name:
 *                     type: string
 *                   address:
 *                     type: string
 *                   latitude:
 *                     type: number
 *                   longitude:
 *                     type: number
 *     responses:
 *       201:
 *         description: Marca y sucursal registradas exitosamente
 *       400:
 *         description: Datos faltantes o inválidos
 */
router.post('/register-full', verifyToken, checkRole('seller'), registerBrandWithBranch);

/**
 * @swagger
 * /brands:
 *   get:
 *     summary: Obtener todas las marcas del usuario autenticado
 *     tags: [Brands]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de marcas obtenida correctamente
 */
router.get('/', verifyToken, checkRole('seller'), getAllBrands);

/**
 * @swagger
 * /brands/{id}:
 *   get:
 *     summary: Obtener una marca por su ID
 *     tags: [Brands]
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
 *         description: Marca encontrada
 *       404:
 *         description: Marca no encontrada o no autorizada
 */
router.get('/:id', verifyToken, checkRole('seller'), getBrandById);

/**
 * @swagger
 * /brands/{id}:
 *   put:
 *     summary: Actualizar una marca
 *     tags: [Brands]
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
 *               description:
 *                 type: string
 *               logo_url:
 *                 type: string
 *               business_type:
 *                 type: string
 *               business_size:
 *                 type: string
 *               website:
 *                 type: string
 *               social_links:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       200:
 *         description: Marca actualizada correctamente
 *       404:
 *         description: Marca no encontrada o no autorizada
 */
router.put('/:id', verifyToken, checkRole('seller'), updateBrand);

/**
 * @swagger
 * /brands/{id}:
 *   delete:
 *     summary: Eliminar una marca
 *     tags: [Brands]
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
 *         description: Marca eliminada correctamente
 *       404:
 *         description: Marca no encontrada o no autorizada
 */
router.delete('/:id', verifyToken, checkRole('seller'), deleteBrand);

export default router;