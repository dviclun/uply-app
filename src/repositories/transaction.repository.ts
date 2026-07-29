import { transactions } from "@/data";
import type { Transaction } from "@/models";

export class TransactionRepository {
  getRecentTransactions(): Transaction[] {
    return [...transactions];
  }

  getDashboardTransactions(): Transaction[] {
    return transactions.slice(0, 3);
  }

  getTransactionById(id: string) {
    return transactions.find((transaction) => transaction.id === id);
  }

  async create(transaction: Transaction): Promise<Transaction> {
    transactions.unshift(transaction);

    return transaction;
  }
}
