// src/models/favorite.model.ts
export interface Favorite {
  id?: number;
  user_id: number;
  branch_id: number;
  created_at?: Date;
}