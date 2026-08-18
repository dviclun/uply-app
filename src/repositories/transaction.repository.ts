import {
  db,
  toTransaction,
  toTransactionRow,
  TransactionRow,
} from "@/lib/database";
import type { Transaction } from "@/models";

type TransactionSummaryRow = {
  income: number | null;
  expense: number | null;
};

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

  async update(transaction: Transaction): Promise<Transaction> {
    const row = toTransactionRow(transaction);

    await db.runAsync(
      `
    UPDATE transactions
    SET
      title = ?,
      amount = ?,
      type = ?,
      date = ?
    WHERE id = ?;
  `,
      row.title,
      row.amount,
      row.type,
      row.date,
      row.id,
    );

    return transaction;
  }

  async delete(id: string): Promise<void> {
    await db.runAsync(
      `
    DELETE FROM transactions
    WHERE id = ?;
  `,
      id,
    );
  }

  async getSummary(
    from: Date,
    to: Date,
  ): Promise<{
    income: number;
    expense: number;
  }> {
    const result = await db.getFirstAsync<TransactionSummaryRow>(
      `
      SELECT
        SUM(CASE WHEN type = 'income' THEN amount ELSE 0 END) AS income,
        SUM(CASE WHEN type = 'expense' THEN amount ELSE 0 END) AS expense
      FROM transactions
      WHERE date BETWEEN ? AND ?;
    `,
      from.toISOString(),
      to.toISOString(),
    );

    return {
      income: result?.income ?? 0,
      expense: result?.expense ?? 0,
    };
  }
}
