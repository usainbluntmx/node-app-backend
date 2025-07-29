// src/models/loyaltyCard.model.ts
export interface LoyaltyCard {
  id?: number;
  brand_id: number;
  coupon_id?: number | null;
  total_visits_required: number;
  current_visits?: number;
  expiration_date: string; // formato YYYY-MM-DD
  is_active?: boolean;
  created_at?: Date;
  updated_at?: Date;
}