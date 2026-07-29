import { generateId } from "@/utils/generateId";
import type { Transaction } from "./transaction";

import type { CreateTransactionDto } from "@/features/transactions";

export function createTransaction(dto: CreateTransactionDto): Transaction {
  return {
    id: generateId(),
    ...dto,
  };
}
