import { dashboard } from "@/data";
import { db } from "@/lib/database";
import type { Dashboard } from "@/models";

import { SettingsRepository } from "./settings.repository";

type DashboardSummaryRow = {
  income: number | null;
  expense: number | null;
};

export class DashboardRepository {
  private readonly settingsRepository = new SettingsRepository();
  async getDashboard(): Promise<Dashboard> {
    const { balanceIncome, balanceExpense } = await this.getBalanceSummary();
    const { income, expense } = await this.getMonthlySummary();

    const initialBalance = await this.settingsRepository.getInitialBalance();

    return {
      balance: initialBalance + balanceIncome - balanceExpense,

      monthlySummary: {
        income,
        expense,
      },

      savingsGoal: dashboard.savingsGoal,

      insight: dashboard.insight,
    };
  }

  private async getMonthlySummary() {
    const result = await db.getFirstAsync<DashboardSummaryRow>(`
    SELECT
      SUM(CASE WHEN type = 'income' THEN amount ELSE 0 END) AS income,
      SUM(CASE WHEN type = 'expense' THEN amount ELSE 0 END) AS expense
    FROM transactions
    WHERE strftime('%Y-%m', date) = strftime('%Y-%m', 'now', 'localtime');
  `);

    return {
      income: result?.income ?? 0,
      expense: result?.expense ?? 0,
    };
  }

  private async getBalanceSummary() {
    const result = await db.getFirstAsync<DashboardSummaryRow>(`
    SELECT
      SUM(CASE WHEN type = 'income' THEN amount ELSE 0 END) AS income,
      SUM(CASE WHEN type = 'expense' THEN amount ELSE 0 END) AS expense
    FROM transactions;
  `);

    return {
      balanceIncome: result?.income ?? 0,
      balanceExpense: result?.expense ?? 0,
    };
  }
}
