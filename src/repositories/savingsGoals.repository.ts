import { db } from "@/lib/database";
import { savingsGoalStatus, SavingsGoalStatus } from "@/models";
import { generateId } from "@/utils/generateId";
import { TransactionRepository } from "./transaction.repository";

type SavingsGoalRow = {
  id: string;
  period: string;
  target: number;
  status: SavingsGoalStatus;
};

export class SavingsGoalRepository {
  private readonly transactionRepository = new TransactionRepository();

  private getCurrentPeriod(): string {
    return this.dateToPeriod(new Date());
  }

  private getNextPeriod(): string {
    const date = new Date();

    date.setMonth(date.getMonth() + 1);

    return this.dateToPeriod(date);
  }

  private periodToDate(period: string): Date {
    const [year, month] = period.split("-").map(Number);

    return new Date(year, month - 1, 1);
  }

  private dateToPeriod(date: Date): string {
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
      2,
      "0",
    )}`;
  }

  private getPeriodRange(period: string): {
    from: Date;
    to: Date;
  } {
    const from = this.periodToDate(period);

    const to = new Date(
      from.getFullYear(),
      from.getMonth() + 1,
      0,
      23,
      59,
      59,
      999,
    );

    return {
      from,
      to,
    };
  }

  private async updateGoalStatus(
    id: string,
    status: SavingsGoalStatus,
  ): Promise<void> {
    await db.runAsync(
      `
      UPDATE savings_goals
      SET status = ?
      WHERE id = ?;
    `,
      status,
      id,
    );
  }

  private async createGoal(
    period: string,
    target: number,
    status: SavingsGoalStatus,
  ): Promise<void> {
    console.log("CREATE GOAL:", period, status);
    await db.runAsync(
      `
      INSERT INTO savings_goals (
        id,
        period,
        target,
        status
      )
      VALUES (?, ?, ?, ?);
    `,
      generateId(),
      period,
      target,
      status,
    );
  }

  private async synchronizePreviousGoals(): Promise<void> {
    const goals = await this.getGoals();

    const currentPeriod = this.getCurrentPeriod();

    for (const goal of goals) {
      if (goal.period >= currentPeriod) {
        continue;
      }

      if (goal.status === savingsGoalStatus.pending) {
        await this.updateGoalStatus(goal.id, savingsGoalStatus.notActivated);

        continue;
      }

      if (goal.status === savingsGoalStatus.active) {
        const { from, to } = this.getPeriodRange(goal.period);

        const summary = await this.transactionRepository.getSummary(from, to);

        const current = summary.income - summary.expense;

        await this.updateGoalStatus(
          goal.id,
          current >= goal.target
            ? savingsGoalStatus.completed
            : savingsGoalStatus.failed,
        );
      }
    }
  }

  private async activateCurrentGoal(): Promise<void> {
    const currentGoal = await this.getCurrentGoal();

    if (!currentGoal) {
      return;
    }

    if (currentGoal.status !== savingsGoalStatus.pending) {
      return;
    }

    await this.updateGoalStatus(currentGoal.id, savingsGoalStatus.active);
  }

  private async createMissingGoals(lastGoal: SavingsGoalRow): Promise<void> {
    console.log("Current:", this.getCurrentPeriod());
    console.log("Next:", this.getNextPeriod());
    console.log("Last goal:", lastGoal.period);
    const lastGoalDate = this.periodToDate(lastGoal.period);

    const nextRequiredDate = this.periodToDate(this.getNextPeriod());

    while (lastGoalDate < nextRequiredDate) {
      lastGoalDate.setMonth(lastGoalDate.getMonth() + 1);

      const period = this.dateToPeriod(lastGoalDate);

      let status: SavingsGoalStatus = savingsGoalStatus.notActivated;

      console.log("Creating:", period, status);

      if (period === this.getCurrentPeriod()) {
        status = savingsGoalStatus.active;
      } else if (period === this.getNextPeriod()) {
        status = savingsGoalStatus.pending;
      }

      await this.createGoal(period, lastGoal.target, status);
    }
  }

  private async getGoals(): Promise<SavingsGoalRow[]> {
    return db.getAllAsync<SavingsGoalRow>(`
    SELECT
      id,
      period,
      target,
      status
    FROM savings_goals
    ORDER BY period ASC;
  `);
  }

  async createFirstGoal(target: number): Promise<void> {
    const currentPeriod = this.getCurrentPeriod();
    const nextPeriod = this.getNextPeriod();

    await this.createGoal(currentPeriod, target, savingsGoalStatus.active);

    await this.createGoal(nextPeriod, target, savingsGoalStatus.pending);
  }

  async hasGoals(): Promise<boolean> {
    const result = await db.getFirstAsync<{
      count: number;
    }>(`
    SELECT COUNT(*) as count
    FROM savings_goals;
  `);

    return (result?.count ?? 0) > 0;
  }

  async getCurrentGoal(): Promise<SavingsGoalRow | null> {
    const currentPeriod = this.getCurrentPeriod();

    const goal = await db.getFirstAsync<SavingsGoalRow>(
      `
      SELECT
        id,
        period,
        target,
        status
      FROM savings_goals
      WHERE period = ?;
      `,
      currentPeriod,
    );

    return goal ?? null;
  }

  async getNextGoal(): Promise<SavingsGoalRow | null> {
    const nextPeriod = this.getNextPeriod();

    const goal = await db.getFirstAsync<SavingsGoalRow>(
      `
      SELECT
        id,
        period,
        target,
        status
      FROM savings_goals
      WHERE period = ?;
      `,
      nextPeriod,
    );

    return goal ?? null;
  }

  async getLastGoal(): Promise<SavingsGoalRow | null> {
    const goal = await db.getFirstAsync<SavingsGoalRow>(`
    SELECT
      id,
      period,
      target,
      status
    FROM savings_goals
    ORDER BY period DESC
    LIMIT 1;
  `);

    return goal ?? null;
  }

  async initializeGoals(): Promise<void> {
    const lastGoal = await this.getLastGoal();

    if (!lastGoal) {
      return;
    }

    await this.synchronizePreviousGoals();

    await this.activateCurrentGoal();

    await this.createMissingGoals(lastGoal);
  }

  async updateNextGoalTarget(target: number): Promise<void> {
    const nextGoal = await this.getNextGoal();

    if (!nextGoal) {
      throw new Error("No next savings goal found.");
    }

    await db.runAsync(
      `
      UPDATE savings_goals
      SET target = ?
      WHERE id = ?;
    `,
      target,
      nextGoal.id,
    );
  }

  async debugGoals(): Promise<void> {
    const goals = await this.getGoals();

    console.log(JSON.stringify(goals, null, 2));
  }

  async seedDebugGoals() {
    await this.createGoal("2026-03", 500, savingsGoalStatus.active);

    await this.createGoal("2026-04", 500, savingsGoalStatus.pending);
  }
}
