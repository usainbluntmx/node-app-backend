// src/config/swagger.ts
import swaggerJSDoc from 'swagger-jsdoc';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API de Descuentos',
      version: '1.0.0',
      description: 'Documentación de la API para compradores y vendedores',
    },
    servers: [
      {
        url: 'http://localhost:3000/api',
        description: 'Servidor local',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
      schemas: {
        // Aqui podemos ir agregando los modelos si los utilizamos
        User: {
          type: 'object',
          properties: {
            id: { type: 'integer', example: 1 },
            email: { type: 'string', example: 'user@example.com' },
            role: { type: 'string', enum: ['buyer', 'seller'] },
          },
        },
        Brand: {
          type: 'object',
          properties: {
            id: { type: 'integer' },
            name: { type: 'string' },
            description: { type: 'string' },
          },
        },
        Branch: {
          type: 'object',
          properties: {
            id: { type: 'integer' },
            address: { type: 'string' },
            latitude: { type: 'number' },
            longitude: { type: 'number' },
            brandId: { type: 'integer' },
          },
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis: ['src/routes/*.ts'],
};

export const swaggerSpec = swaggerJSDoc(options);
