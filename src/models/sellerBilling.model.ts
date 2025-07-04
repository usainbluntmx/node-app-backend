// src/models/sellerBilling.model.ts
export interface SellerBillingInfo {
  id?: number;
  user_id: number; // FK al usuario (rol: seller)
  full_name: string; // Nombre completo fiscal
  tax_id: string;    // RFC
  email: string;     // Correo de facturación
  phone: string;     // Teléfono de contacto
  cfdi_usage: string; // Uso del CFDI
  created_at?: Date;  // Fecha de registro
}