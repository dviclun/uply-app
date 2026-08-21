import { useMutation, useQueryClient } from "@tanstack/react-query";

import { UpdateTransactionUseCase } from "@/features/transactions/application/updateTransaction";
import { queryKeys } from "@/lib/react-query/queryKeys";
import type { Transaction } from "@/models";
import { TransactionRepository } from "@/repositories";
import { useAuth } from "./useAuth";

const repository = new TransactionRepository();
const updateTransactionUseCase = new UpdateTransactionUseCase(repository);

export function useUpdateTransaction() {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: updateTransactionUseCase.execute.bind(updateTransactionUseCase),

    onSuccess: async (_, transaction: Transaction) => {
      if (!user) {
        return;
      }

      await queryClient.invalidateQueries({
        queryKey: queryKeys.transactions(user.id),
      });

      await queryClient.invalidateQueries({
        queryKey: queryKeys.transaction(user.id, transaction.id),
      });

      await queryClient.invalidateQueries({
        queryKey: queryKeys.dashboard(user.id),
      });

      await queryClient.invalidateQueries({
        queryKey: queryKeys.dashboardTransactions(user.id),
      });

      await queryClient.invalidateQueries({
        queryKey: queryKeys.savingsGoal(user.id),
      });
    },
  });
}
