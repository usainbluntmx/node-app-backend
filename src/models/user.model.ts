// src/models/user.model.ts
export interface User {
  id?: number;
  name: string;
  email: string;
  password?: string; // Opcional para evitar exponerla en respuestas

  role: 'buyer' | 'seller' | 'admin';

  birth_date?: string | null;        // formato 'YYYY-MM-DD'
  phone?: string | null;
  referral_code?: string | null;

  gender?: string | null; // Nuevo campo
  qr?: string | null;                                // Nuevo campo para código QR

  created_at?: Date;
}