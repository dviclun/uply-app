import { useQuery } from "@tanstack/react-query";

import { queryKeys } from "@/lib/react-query";
import { TransactionRepository } from "@/repositories";

const repository = new TransactionRepository();

export function useTransactions() {
  return useQuery({
    queryKey: queryKeys.transactions,
    queryFn: () => repository.getRecentTransactions(),
  });
}

export function useTransaction(id: string) {
  return useQuery({
    queryKey: queryKeys.transaction(id),
    queryFn: () => repository.getTransactionById(id),
  });
}

export function useDashboardTransactions() {
  return useQuery({
    queryKey: queryKeys.dashboardTransactions,
    queryFn: () => repository.getDashboardTransactions(),
  });
}
