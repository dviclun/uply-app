import type { TransactionRepository } from "@/repositories";

export class DeleteTransactionUseCase {
  constructor(private readonly transactionRepository: TransactionRepository) {}

  async execute(id: string): Promise<void> {
    await this.transactionRepository.delete(id);
  }
}
