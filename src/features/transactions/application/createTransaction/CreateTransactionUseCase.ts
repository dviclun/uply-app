import { createTransaction, Transaction } from "@/models";
import { TransactionRepository } from "@/repositories";

import type { CreateTransactionDto } from "./dto";

export class CreateTransactionUseCase {
  constructor(private repository: TransactionRepository) {}

  async execute(dto: CreateTransactionDto): Promise<Transaction> {
    const transaction = createTransaction(dto);

    return this.repository.create(transaction);
  }
}
