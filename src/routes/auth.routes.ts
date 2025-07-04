// src/routes/auth.routes.ts
import express from 'express';
import {
  registerUser,
  loginUser,
  refreshToken,
  logoutUser
} from '../controllers/auth.controller';
import { asyncHandler } from '../middlewares/asyncHandler';

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Endpoints de autenticación (registro, login, renovación de token y logout)
 */

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Registrar un nuevo usuario
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *               - name
 *               - role
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *               name:
 *                 type: string
 *               role:
 *                 type: string
 *                 enum: [buyer, seller]
 *               birth_date:
 *                 type: string
 *                 format: date
 *               phone:
 *                 type: string
 *               referral_code:
 *                 type: string
 *     responses:
 *       201:
 *         description: Usuario registrado exitosamente
 */
router.post('/register', asyncHandler(registerUser));

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Iniciar sesión
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Inicio de sesión exitoso
 */
router.post('/login', asyncHandler(loginUser));

/**
 * @swagger
 * /auth/refresh:
 *   post:
 *     summary: Renovar token de acceso usando refresh token
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - token
 *             properties:
 *               token:
 *                 type: string
 *     responses:
 *       200:
 *         description: Token renovado exitosamente
 *       401:
 *         description: Refresh token requerido
 *       403:
 *         description: Refresh token inválido o expirado
 */
router.post('/refresh', asyncHandler(refreshToken));

/**
 * @swagger
 * /auth/logout:
 *   post:
 *     summary: Cerrar sesión (revoca refresh token)
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - token
 *             properties:
 *               token:
 *                 type: string
 *     responses:
 *       200:
 *         description: Sesión cerrada correctamente
 *       400:
 *         description: Token no proporcionado
 */
router.post('/logout', asyncHandler(logoutUser));

export default router;