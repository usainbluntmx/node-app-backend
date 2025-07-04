// src/models/brand.model.ts
export interface Brand {
  id?: number;
  name: string;
  description?: string | null;
  logo_url?: string | null;
  owner_id: number;
  created_at?: Date;
}