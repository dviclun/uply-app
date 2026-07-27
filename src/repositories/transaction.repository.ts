import { transactions } from "@/data";
import type { Transaction } from "@/models";

export class TransactionRepository {
  getRecentTransactions(): Transaction[] {
    return transactions;
  }
}
