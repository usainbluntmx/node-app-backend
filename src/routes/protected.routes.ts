// src/routes/protected.routes.ts
import { Router } from 'express';
import { verifyToken } from '../middlewares/verifyToken';

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Protected
 *   description: Rutas protegidas que requieren autenticación
 */

/**
 * @swagger
 * /protected:
 *   get:
 *     summary: Verifica el acceso a una ruta protegida
 *     tags: [Protected]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Acceso autorizado
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
 *                     email:
 *                       type: string
 *                     role:
 *                       type: string
 *       401:
 *         description: Token inválido o ausente
 */
router.get('/', verifyToken, (req, res) => {
  res.status(200).json({
    message: 'Acceso autorizado',
    user: (req as any).user
  });
});

export default router;