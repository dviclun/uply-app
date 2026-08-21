import { useQuery } from "@tanstack/react-query";

import { queryKeys } from "@/lib/react-query";
import { TransactionRepository } from "@/repositories";
import { useAuth } from "./useAuth";

const repository = new TransactionRepository();

export function useTransactions() {
  const { user } = useAuth();

  return useQuery({
    queryKey: queryKeys.transactions(user?.id ?? ""),
    queryFn: () => repository.getRecentTransactions(),
    enabled: Boolean(user),
  });
}

export function useTransaction(id: string | undefined) {
  const { user } = useAuth();

  return useQuery({
    queryKey: queryKeys.transaction(user?.id ?? "", id ?? ""),
    queryFn: async () => {
      const transaction = await repository.getTransactionById(id!);

      return transaction ?? null;
    },
    enabled: Boolean(user && id),
  });
}

export function useDashboardTransactions() {
  const { user } = useAuth();

  return useQuery({
    queryKey: queryKeys.dashboardTransactions(user?.id ?? ""),
    queryFn: () => repository.getDashboardTransactions(),
    enabled: Boolean(user),
  });
}
