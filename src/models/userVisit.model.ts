// src/models/userVisit.model.ts
export interface UserVisit {
  id: number;
  user_id: number;
  branch_id: number;
  visited_at: Date;
}