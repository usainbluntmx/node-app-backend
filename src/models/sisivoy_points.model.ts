// src/models/sisivoy_points.model.ts
export interface SisiVoyPoints {
  id?: number;
  user_id: number;
  current_points: number;
  total_earned_points: number;
  expiration_date?: Date | null;
  coupon_id?: number | null; // cupón redimible con puntos
  created_at?: Date;
}