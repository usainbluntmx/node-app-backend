import { Router } from 'express';
import {
  createEmployee,
  getEmployeesByBranch,
  updateEmployee,
  deleteEmployee
} from '../controllers/employee.controller';
import { verifyToken } from '../middlewares/verifyToken';
import { checkRole } from '../middlewares/checkRole';

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Employees
 *   description: Endpoints para gestión de colaboradores
 */

/**
 * @swagger
 * /employees:
 *   post:
 *     summary: Crear un nuevo colaborador
 *     tags: [Employees]
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
 *               - email
 *               - permissions
 *               - branch_id
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               permissions:
 *                 type: array
 *                 items:
 *                   type: string
 *               branch_id:
 *                 type: integer
 *     responses:
 *       201:
 *         description: Colaborador creado exitosamente
 *       403:
 *         description: No autorizado para agregar colaboradores
 */
router.post('/', verifyToken, checkRole('seller'), createEmployee);

/**
 * @swagger
 * /employees/branch/{branchId}:
 *   get:
 *     summary: Obtener colaboradores por sucursal
 *     tags: [Employees]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: branchId
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Lista de colaboradores obtenida correctamente
 *       403:
 *         description: No autorizado para ver los colaboradores
 */
router.get('/branch/:branchId', verifyToken, checkRole('seller'), getEmployeesByBranch);

/**
 * @swagger
 * /employees/{id}:
 *   put:
 *     summary: Actualizar un colaborador
 *     tags: [Employees]
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
 *               email:
 *                 type: string
 *               permissions:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       200:
 *         description: Colaborador actualizado correctamente
 *       403:
 *         description: No autorizado
 */
router.put('/:id', verifyToken, checkRole('seller'), updateEmployee);

/**
 * @swagger
 * /employees/{id}:
 *   delete:
 *     summary: Eliminar un colaborador
 *     tags: [Employees]
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
 *         description: Colaborador eliminado correctamente
 *       403:
 *         description: No autorizado
 */
router.delete('/:id', verifyToken, checkRole('seller'), deleteEmployee);

export default router;