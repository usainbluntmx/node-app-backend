// src/models/sellerMembership.model.ts
export interface SellerMembership {
  id?: number;
  user_id: number; // FK al usuario (rol: seller)
  is_active: boolean; // Indica si la membresía está vigente
  payment_method: 'card' | 'bank_transfer' | 'oxxo'; // Método de pago
  payment_reference?: string | null; // Folio u orden de pago
  start_date?: Date; // Fecha de inicio de la membresía
}