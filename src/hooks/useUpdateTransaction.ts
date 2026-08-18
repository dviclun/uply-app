import { useMutation, useQueryClient } from "@tanstack/react-query";

import { UpdateTransactionUseCase } from "@/features/transactions/application/updateTransaction";
import { queryKeys } from "@/lib/react-query/queryKeys";
import type { Transaction } from "@/models";
import { TransactionRepository } from "@/repositories";

const repository = new TransactionRepository();
const updateTransactionUseCase = new UpdateTransactionUseCase(repository);

export function useUpdateTransaction() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateTransactionUseCase.execute.bind(updateTransactionUseCase),

    onSuccess: async (_, transaction: Transaction) => {
      await queryClient.invalidateQueries({
        queryKey: queryKeys.transactions,
      });

      await queryClient.invalidateQueries({
        queryKey: queryKeys.transaction(transaction.id),
      });

      await queryClient.invalidateQueries({
        queryKey: queryKeys.dashboard,
      });

      await queryClient.invalidateQueries({
        queryKey: queryKeys.dashboardTransactions,
      });

      await queryClient.invalidateQueries({
        queryKey: queryKeys.savingsGoal,
      });
    },
  });
}
