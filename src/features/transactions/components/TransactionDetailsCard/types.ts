import type { Category, Transaction } from "@/models";

export interface TransactionDetailsCardProps {
  transaction: Transaction;
  category?: Category;
}
