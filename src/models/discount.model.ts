// src/models/discount.model.ts
export interface Discount {
  id?: number;

  brand_id: number;
  branch_id: number;

  type: 'product' | 'service' | 'amount' | 'free';
  title: string;
  description?: string | null;
  value?: number | null;
  min_purchase?: number | null;
  product_or_service_name?: string | null;

  qr_code?: string | null;
  created_at?: Date;
  is_active?: boolean;
}