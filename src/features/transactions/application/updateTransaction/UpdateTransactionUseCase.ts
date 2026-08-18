import type { Transaction } from "@/models";
import type { TransactionRepository } from "@/repositories";

export class UpdateTransactionUseCase {
  constructor(private readonly transactionRepository: TransactionRepository) {}

  async execute(transaction: Transaction): Promise<Transaction> {
    return this.transactionRepository.update(transaction);
  }
}
