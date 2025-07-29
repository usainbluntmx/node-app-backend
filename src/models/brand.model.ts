// src/models/brand.model.ts

// Estructura esperada para cada red social
export interface SocialLink {
  platform: string;   // ejemplo: "facebook", "instagram"
  url: string;
}

// Estructura de una marca
export interface Brand {
  id?: number;
  name: string;
  description?: string | null;
  logo_url?: string | null;
  owner_id: number;

  business_type?: string | null;     // tipo de negocio o categoría (ej: restaurante, barbería, etc.)
  business_size?: string | null;     // tamaño del negocio (ej: pequeño, mediano, grande)
  website?: string | null;

  /**
   * social_links puede venir como:
   * - array (ya parseado desde JSON)
   * - string (sin parsear desde base de datos si usas tipo TEXT)
   */
  social_links?: SocialLink[] | string | null;

  created_at?: Date;
}