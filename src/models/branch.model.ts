// src/models/branch.model.ts
export interface Branch {
  id?: number;
  brand_id: number;
  name: string;
  address?: string;
  latitude?: number;
  longitude?: number;
  membership_id?: number | null; // 🔗 Nueva relación con membresía
  created_at?: Date;
}