import {
  db,
  toTransaction,
  toTransactionRow,
  TransactionRow,
} from "@/lib/database";
import type { Transaction } from "@/models";

export class TransactionRepository {
  async getRecentTransactions(): Promise<Transaction[]> {
    const rows = await db.getAllAsync<TransactionRow>(`
      SELECT *
      FROM transactions
      ORDER BY date DESC;
    `);

    return rows.map(toTransaction);
  }

  async getDashboardTransactions(): Promise<Transaction[]> {
    const rows = await db.getAllAsync<TransactionRow>(`
      SELECT *
      FROM transactions
      ORDER BY date DESC
      LIMIT 3;
    `);

    return rows.map(toTransaction);
  }

  async getTransactionById(id: string): Promise<Transaction | undefined> {
    const row = await db.getFirstAsync<TransactionRow>(
      `
        SELECT *
        FROM transactions
        WHERE id = ?;
      `,
      id,
    );

    return row ? toTransaction(row) : undefined;
  }

  async create(transaction: Transaction): Promise<Transaction> {
    const row = toTransactionRow(transaction);

    await db.runAsync(
      `
      INSERT INTO transactions (
        id,
        title,
        amount,
        type,
        date
      )
      VALUES (?, ?, ?, ?, ?);
    `,
      row.id,
      row.title,
      row.amount,
      row.type,
      row.date,
    );

    return transaction;
  }
}
