// src/models/employee.model.ts

export interface Employee {
  id?: number;
  name: string;
  email: string;
  permissions: string[];      // lista de permisos como array
  branch_id: number;          // sucursal a la que pertenece
  created_at?: Date;
  updated_at?: Date;
}