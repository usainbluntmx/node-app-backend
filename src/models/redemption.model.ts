// src/models/redemption.model.ts
export interface CouponRedemption {
  id: number;
  user_id: number;
  discount_id: number;
  redeemed_at: Date;
}