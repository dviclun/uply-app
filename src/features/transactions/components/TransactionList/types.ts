import type { Category, Transaction } from "@/models";

export interface TransactionListProps {
  transactions: Transaction[];
  categories: Category[];
}
