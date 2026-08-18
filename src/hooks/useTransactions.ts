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

export function useTransaction(id: string | undefined) {
  return useQuery({
    queryKey: queryKeys.transaction(id ?? ""),
    queryFn: async () => {
      const transaction = await repository.getTransactionById(id!);

      return transaction ?? null;
    },
    enabled: Boolean(id),
  });
}

export function useDashboardTransactions() {
  return useQuery({
    queryKey: queryKeys.dashboardTransactions,
    queryFn: () => repository.getDashboardTransactions(),
  });
}
