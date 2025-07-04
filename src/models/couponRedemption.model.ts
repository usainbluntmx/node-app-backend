// src/models/couponRedemption.model.ts
export interface CouponRedemption {
  id: number;
  user_id: number;
  discount_id: number;
  branch_id: number;
  redeemed_at: string;
}