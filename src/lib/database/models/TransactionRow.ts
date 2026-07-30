import type { TransactionType } from "@/models";

export type TransactionRow = {
  id: string;
  title: string;
  amount: number;
  type: TransactionType;
  date: string;
};
