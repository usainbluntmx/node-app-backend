// src/index.ts
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';

import swaggerUi from 'swagger-ui-express';
import { swaggerSpec } from './config/swagger';

import authRoutes from './routes/auth.routes';
import protectedRoutes from './routes/protected.routes';
import brandRoutes from './routes/brand.routes';
import branchRoutes from './routes/branch.routes';
import discountRoutes from './routes/discount.routes'; // ✅ Nueva ruta de descuentos

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(cors());
app.use(helmet());
app.use(morgan('dev'));
app.use(express.json());

// Rutas de la API
app.use('/api/auth', authRoutes);
app.use('/api/protected', protectedRoutes);
app.use('/api/brands', brandRoutes);
app.use('/api/branches', branchRoutes);
app.use('/api/discounts', discountRoutes); // ✅ Montamos la nueva ruta

// Documentación Swagger
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Servidor
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📚 Swagger docs at http://localhost:${PORT}/api-docs`);
});
