import type { TransactionType } from "@/models";

export type TransactionRow = {
  id: string;
  user_id: string;
  title: string;
  amount: number;
  type: TransactionType;
  date: string;
  category_id: string | null;
};
