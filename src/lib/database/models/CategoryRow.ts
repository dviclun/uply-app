import type { TransactionType } from "@/models";

export type CategoryRow = {
  id: string;
  user_id: string | null;
  name: string;
  type: TransactionType;
  icon: string | null;
  color: string;
  created_at: string;
};
