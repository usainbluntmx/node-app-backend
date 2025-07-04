// src/models/user.model.ts
export interface User {
  id?: number;
  name: string;
  email: string;
  password: string;
  role: 'buyer' | 'seller';

  birth_date?: string;      // formato 'YYYY-MM-DD'
  phone?: string;
  referral_code?: string;

  created_at?: Date;
}