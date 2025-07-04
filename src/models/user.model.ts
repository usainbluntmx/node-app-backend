// src/models/user.model.ts
export interface User {
  id?: number;
  name: string;
  email: string;
  password: string;
  role: 'buyer' | 'seller';
  created_at?: Date;
}