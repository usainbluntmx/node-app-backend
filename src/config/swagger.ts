// src/config/swagger.ts
import { Express } from 'express';
import swaggerUi from 'swagger-ui-express';
import swaggerJsdoc from 'swagger-jsdoc'; // requiere esModuleInterop en tsconfig
import { OpenAPIV3 } from 'openapi-types';

/**
 * Esquemas OpenAPI (tipados como OpenAPIV3.SchemaObject para conservar literales)
 */
const schemas: Record<string, OpenAPIV3.SchemaObject> = {
  User: {
    type: 'object',
    properties: {
      id: { type: 'integer', example: 1 },
      name: { type: 'string', example: 'Juan Pérez' },
      email: { type: 'string', example: 'juan@example.com' },
      role: { type: 'string', enum: ['buyer', 'seller', 'admin'] },
      created_at: { type: 'string', format: 'date-time', example: '2025-08-01T12:00:00Z' },
    },
    required: ['id', 'name', 'email', 'role', 'created_at'],
  },
  Brand: {
    type: 'object',
    properties: {
      id: { type: 'integer', example: 1 },
      name: { type: 'string', example: 'Cafetería Central' },
      business_type: { type: 'string', example: 'Restaurante' },
      business_size: { type: 'string', example: 'PyME' },
      website: { type: 'string', nullable: true, example: 'https://cafecentral.mx' },
      social_links: { type: 'string', nullable: true, example: '[{"type":"twitter","url":"https://x.com/cafe"}]' },
      created_at: { type: 'string', format: 'date-time' },
    },
    required: ['id', 'name'],
  },
  Branch: {
    type: 'object',
    properties: {
      id: { type: 'integer', example: 10 },
      brand_id: { type: 'integer', example: 1 },
      name: { type: 'string', example: 'Sucursal Centro' },
      address: { type: 'string', nullable: true, example: 'Av. Siempre Viva 123' },
      latitude: { type: 'number', nullable: true, example: 19.4326 },
      longitude: { type: 'number', nullable: true, example: -99.1332 },
      services: { type: 'string', nullable: true, example: 'WiFi, Terraza' },
      average_spend: { type: 'number', nullable: true, example: 150 },
      website: { type: 'string', nullable: true, example: 'https://cafecentral.mx/centro' },
      phone: { type: 'string', nullable: true, example: '+52 55 1234 5678' },
      opening_hours: { type: 'string', nullable: true, example: 'Lun-Dom 9:00-21:00' },
      images: { type: 'array', items: { type: 'string' }, nullable: true, example: ['https://.../1.jpg'] },
      created_at: { type: 'string', format: 'date-time' },
    },
    required: ['id', 'brand_id', 'name'],
  },
  Discount: {
    type: 'object',
    properties: {
      id: { type: 'integer', example: 100 },
      brand_id: { type: 'integer', example: 1 },
      branch_id: { type: 'integer', nullable: true, example: 10 },
      title: { type: 'string', example: '2x1 en bebidas' },
      type: { type: 'string', example: 'product|service|amount|free' },
      description: { type: 'string', nullable: true, example: 'Válido de lunes a jueves' },
      is_active: { type: 'boolean', example: true },
      numero_de_usos: { type: 'integer', nullable: true, example: 50 },
      created_at: { type: 'string', format: 'date-time' },
    },
    required: ['id', 'brand_id', 'title', 'is_active'],
  },
};

/**
 * Documento base OpenAPI 3.0.0
 * Tiparlo como OpenAPIV3.Document evita el error de schemas/NonArraySchemaObject.
 */
const definition: OpenAPIV3.Document = {
  openapi: '3.0.0',
  info: {
    title: 'API de Descuentos',
    version: '1.0.0',
    description: 'Documentación de la API para la aplicación de descuentos móviles',
  },
  servers: [
    {
      url: 'http://localhost:3000/api',
      description: 'Servidor de desarrollo local',
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
    schemas,
  },
  security: [{ bearerAuth: [] }],
  paths: {}, // swagger-jsdoc lo completa con las anotaciones de las rutas
};

/**
 * Tipo local minimalista para las opciones, compatible con cualquier versión de swagger-jsdoc.
 */
type JsDocOptions = {
  definition: OpenAPIV3.Document;
  apis: string[];
};

/**
 * Opciones para swagger-jsdoc.
 * Nota: si usas rutas fuera de src/routes, ajusta el patrón de globs.
 */
const options: JsDocOptions = {
  definition,
  apis: ['./src/routes/*.ts'],
};

/**
 * Registra Swagger en la app Express.
 */
const swaggerDocs = (app: Express) => {
  const specs = swaggerJsdoc(options as any); // `as any` por compatibilidad amplia entre versiones
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));
  console.log('Documentación Swagger disponible en http://localhost:3000/api-docs');
};

export default swaggerDocs;

/**
 * Si tu entorno NO tiene "esModuleInterop": true, usa esta importación alternativa:
 *
 * import * as swaggerJsdocNS from 'swagger-jsdoc';
 * const swaggerDocs = (app: Express) => {
 *   const specs = swaggerJsdocNS.default ? swaggerJsdocNS.default(options as any) : (swaggerJsdocNS as any)(options);
 *   app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));
 * };
 */