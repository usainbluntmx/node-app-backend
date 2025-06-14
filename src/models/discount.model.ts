// src/models/discount.model.ts
export interface Discount {
  id?: number;
  brand_id: number;
  branch_id: number;
  type: 'product' | 'service' | 'amount' | 'free';
  title: string;
  description?: string;
  value?: number;
  min_purchase?: number;
  product_or_service_name?: string;
  qr_code?: string;
  created_at?: Date;
}
