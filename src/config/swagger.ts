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
        User: {
          type: 'object',
          properties: {
            id: { type: 'integer', example: 1 },
            name: { type: 'string', example: 'Juan Pérez' },
            email: { type: 'string', example: 'user@example.com' },
            role: { type: 'string', enum: ['buyer', 'seller'] },
            created_at: { type: 'string', format: 'date-time' },
          },
        },
        Brand: {
          type: 'object',
          properties: {
            id: { type: 'integer', example: 1 },
            name: { type: 'string', example: 'Mi Marca' },
            description: { type: 'string', example: 'Tienda de productos orgánicos' },
            logo_url: { type: 'string', example: 'https://example.com/logo.png' },
            owner_id: { type: 'integer', example: 5 },
          },
        },
        Branch: {
          type: 'object',
          properties: {
            id: { type: 'integer', example: 10 },
            name: { type: 'string', example: 'Sucursal Centro' },
            address: { type: 'string', example: 'Calle Falsa 123' },
            latitude: { type: 'number', example: 19.4326 },
            longitude: { type: 'number', example: -99.1332 },
            brand_id: { type: 'integer', example: 1 },
          },
        },
        Discount: {
          type: 'object',
          required: ['brand_id', 'branch_id', 'type', 'title'],
          properties: {
            id: { type: 'integer', example: 100 },
            brand_id: { type: 'integer', example: 1 },
            branch_id: { type: 'integer', example: 10 },
            type: {
              type: 'string',
              enum: ['product', 'service', 'amount', 'free'],
              example: 'amount',
            },
            title: { type: 'string', example: '10% de descuento' },
            description: { type: 'string', example: 'Solo válido en fin de semana' },
            value: { type: 'number', example: 10 },
            min_purchase: { type: 'number', example: 100 },
            product_or_service_name: { type: 'string', example: 'Hamburguesa Clásica' },
            qr_code: { type: 'string', example: 'data:image/png;base64,...' },
            is_active: { type: 'boolean', example: true },
            created_at: { type: 'string', format: 'date-time' },
          },
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
    // ⚠️ Requerido por tipado estricto
    paths: {},
  },
  apis: ['src/routes/*.ts'],
};

const swaggerSpec = swaggerJSDoc(options);
export default swaggerSpec;