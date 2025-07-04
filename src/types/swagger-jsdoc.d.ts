// src/types/swagger-jsdoc.d.ts
declare module 'swagger-jsdoc' {
  import { OpenAPIV3 } from 'openapi-types';

  export interface SwaggerJSDocOptions {
    definition: OpenAPIV3.Document;
    apis: string[];
  }

  export default function swaggerJSDoc(options: SwaggerJSDocOptions): object;
}