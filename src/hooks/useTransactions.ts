import { TransactionRepository } from "@/repositories";

const repository = new TransactionRepository();

export function useTransactions() {
  const transactions = repository.getRecentTransactions();
  return transactions;
}
