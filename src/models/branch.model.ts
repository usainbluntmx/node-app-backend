// src/models/branch.model.ts
export interface Branch {
  id?: number;
  brand_id: number;
  name: string;
  address?: string;
  latitude?: number;
  longitude?: number;
  created_at?: Date;
}