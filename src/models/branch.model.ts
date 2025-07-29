// src/models/branch.model.ts
export interface Branch {
  id?: number;
  brand_id: number;
  name: string;
  address?: string;
  latitude?: number;
  longitude?: number;
  membership_id?: number | null; // 🔗 Nueva relación con membresía
  services?: string;
  average_spend?: number;
  phone?: string;
  website?: string;
  opening_hours?: string;
  images?: string[];
  created_at?: Date;
}