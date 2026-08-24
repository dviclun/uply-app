import { dashboard } from "@/data";
import type { Dashboard } from "@/models";

import { ProfileRepository } from "./profile.repository";
import { SavingsGoalRepository } from "./savingsGoals.repository";
import { TransactionRepository } from "./transaction.repository";

export class DashboardRepository {
  private readonly profileRepository = new ProfileRepository();
  private readonly savingsGoalRepository = new SavingsGoalRepository();
  private readonly transactionRepository = new TransactionRepository();

  async getDashboard(): Promise<Dashboard> {
    const { income: balanceIncome, expense: balanceExpense } =
      await this.getBalanceSummary();
    const { income, expense } = await this.getMonthlySummary();

    const initialBalance = await this.profileRepository.getInitialBalance();

    const currentGoal = await this.savingsGoalRepository.getCurrentGoal();

    const savingsGoalTarget = currentGoal?.target ?? 0;

    return {
      balance: initialBalance + balanceIncome - balanceExpense,

      monthlySummary: {
        income,
        expense,
      },

      savingsGoal: {
        current: income - expense,
        target: savingsGoalTarget,
      },

      insight: dashboard.insight,
    };
  }

  private async getMonthlySummary() {
    const now = new Date();

    const from = new Date(now.getFullYear(), now.getMonth(), 1);

    const to = new Date(
      now.getFullYear(),
      now.getMonth() + 1,
      0,
      23,
      59,
      59,
      999,
    );

    return this.transactionRepository.getSummary(from, to);
  }

  private async getBalanceSummary() {
    return this.transactionRepository.getSummary(new Date(0), new Date());
  }
}
