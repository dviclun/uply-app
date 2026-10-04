import type { BalanceAdjustment } from "@/models";
import { BalanceAdjustmentRepository } from "@/repositories";

export class UpdateBalanceUseCase {
  constructor(
    private readonly balanceAdjustmentRepository: BalanceAdjustmentRepository,
  ) {}

  async execute(amount: number): Promise<BalanceAdjustment> {
    if (amount < 0) {
      throw new Error("Balance cannot be negative.");
    }

    return this.balanceAdjustmentRepository.create(amount);
  }
}