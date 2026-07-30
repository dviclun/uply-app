import type { Transaction } from "@/models";
import type { TransactionRow } from "../models/TransactionRow";

export function toTransaction(row: TransactionRow): Transaction {
  return {
    ...row,
    date: new Date(row.date),
  };
}

export function toTransactionRow(transaction: Transaction): TransactionRow {
  return {
    ...transaction,
    date: transaction.date.toISOString(),
  };
}
