import type { Transaction } from "@/models";

import type { TransactionRow } from "../models/TransactionRow";

export function toTransaction(row: TransactionRow): Transaction {
  return {
    id: row.id,
    title: row.title,
    amount: row.amount,
    type: row.type,
    date: new Date(row.date),
    categoryId: row.category_id,
  };
}
