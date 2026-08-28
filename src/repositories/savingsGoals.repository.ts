import { supabase } from "@/lib/supabase";
import { savingsGoalStatus, SavingsGoalStatus } from "@/models";
import { generateId } from "@/utils/generateId";
import { TransactionRepository } from "./transaction.repository";

type SavingsGoalRow = {
  id: string;
  user_id: string;
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

  private async getCurrentUserId(): Promise<string> {
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();

    if (error) {
      throw error;
    }

    if (!user) {
      throw new Error("User is not authenticated.");
    }

    return user.id;
  }

  private async updateGoalStatus(
    id: string,
    status: SavingsGoalStatus,
  ): Promise<void> {
    const userId = await this.getCurrentUserId();

    const { error } = await supabase
      .from("savings_goals")
      .update({
        status,
      })
      .eq("id", id)
      .eq("user_id", userId);

    if (error) {
      throw error;
    }
  }

  private async createGoal(
    period: string,
    target: number,
    status: SavingsGoalStatus,
  ): Promise<void> {
    const userId = await this.getCurrentUserId();

    const { error } = await supabase.from("savings_goals").insert({
      id: generateId(),
      user_id: userId,
      period,
      target,
      status,
    });

    if (error) {
      throw error;
    }
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

  private async getGoalByPeriod(
    period: string,
  ): Promise<SavingsGoalRow | null> {
    const userId = await this.getCurrentUserId();

    const { data, error } = await supabase
      .from("savings_goals")
      .select("id, user_id, period, target, status")
      .eq("user_id", userId)
      .eq("period", period)
      .maybeSingle();

    if (error) {
      throw error;
    }

    return data ? (data as SavingsGoalRow) : null;
  }

  private async createMissingGoals(lastGoal: SavingsGoalRow): Promise<void> {
    const lastGoalDate = this.periodToDate(lastGoal.period);

    const nextRequiredDate = this.periodToDate(this.getNextPeriod());

    while (lastGoalDate < nextRequiredDate) {
      lastGoalDate.setMonth(lastGoalDate.getMonth() + 1);

      const period = this.dateToPeriod(lastGoalDate);

      const existingGoal = await this.getGoalByPeriod(period);

      if (existingGoal) {
        continue;
      }

      let status: SavingsGoalStatus = savingsGoalStatus.notActivated;

      if (period === this.getCurrentPeriod()) {
        status = savingsGoalStatus.active;
      } else if (period === this.getNextPeriod()) {
        status = savingsGoalStatus.pending;
      }

      await this.createGoal(period, lastGoal.target, status);
    }
  }

  private async getGoals(): Promise<SavingsGoalRow[]> {
    const userId = await this.getCurrentUserId();

    const { data, error } = await supabase
      .from("savings_goals")
      .select("id, user_id, period, target, status")
      .eq("user_id", userId)
      .order("period", { ascending: true });

    if (error) {
      throw error;
    }

    return (data ?? []) as SavingsGoalRow[];
  }

  async createFirstGoal(target: number): Promise<void> {
    const currentPeriod = this.getCurrentPeriod();
    const nextPeriod = this.getNextPeriod();

    await this.createGoal(currentPeriod, target, savingsGoalStatus.active);

    await this.createGoal(nextPeriod, target, savingsGoalStatus.pending);
  }

  async hasGoals(): Promise<boolean> {
    const goals = await this.getGoals();

    return goals.length > 0;
  }

  async getCurrentGoal(): Promise<SavingsGoalRow | null> {
    const userId = await this.getCurrentUserId();
    const currentPeriod = this.getCurrentPeriod();

    const { data, error } = await supabase
      .from("savings_goals")
      .select("id, user_id, period, target, status")
      .eq("user_id", userId)
      .eq("period", currentPeriod)
      .maybeSingle();

    if (error) {
      throw error;
    }

    return data ? (data as SavingsGoalRow) : null;
  }

  async getNextGoal(): Promise<SavingsGoalRow | null> {
    const userId = await this.getCurrentUserId();
    const nextPeriod = this.getNextPeriod();

    const { data, error } = await supabase
      .from("savings_goals")
      .select("id, user_id, period, target, status")
      .eq("user_id", userId)
      .eq("period", nextPeriod)
      .maybeSingle();

    if (error) {
      throw error;
    }

    return data ? (data as SavingsGoalRow) : null;
  }

  async getLastGoal(): Promise<SavingsGoalRow | null> {
    const userId = await this.getCurrentUserId();

    const { data, error } = await supabase
      .from("savings_goals")
      .select("id, user_id, period, target, status")
      .eq("user_id", userId)
      .order("period", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (error) {
      throw error;
    }

    return data ? (data as SavingsGoalRow) : null;
  }

  async initializeGoals(): Promise<void> {
    const lastGoal = await this.getLastGoal();

    if (!lastGoal) {
      return;
    }

    await this.synchronizePreviousGoals();

    await this.activateCurrentGoal();

    const updatedLastGoal = await this.getLastGoal();

    if (!updatedLastGoal) {
      return;
    }

    await this.createMissingGoals(updatedLastGoal);
  }

  async updateNextGoalTarget(target: number): Promise<void> {
    const userId = await this.getCurrentUserId();
    const nextGoal = await this.getNextGoal();

    if (!nextGoal) {
      throw new Error("No next savings goal found.");
    }

    const { error } = await supabase
      .from("savings_goals")
      .update({
        target,
      })
      .eq("id", nextGoal.id)
      .eq("user_id", userId);

    if (error) {
      throw error;
    }
  }
}
