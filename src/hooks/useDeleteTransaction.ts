import { useMutation, useQueryClient } from "@tanstack/react-query";

import { DeleteTransactionUseCase } from "@/features/transactions/application/deleteTransaction";
import { queryKeys } from "@/lib/react-query/queryKeys";
import { TransactionRepository } from "@/repositories";

const repository = new TransactionRepository();
const deleteTransactionUseCase = new DeleteTransactionUseCase(repository);

export function useDeleteTransaction() {
  const queryClient = useQueryClient();

  return useMutation<void, Error, string>({
    mutationFn: deleteTransactionUseCase.execute.bind(deleteTransactionUseCase),

    onSuccess: async (_, id) => {
      queryClient.removeQueries({
        queryKey: queryKeys.transaction(id),
      });

      await queryClient.invalidateQueries({
        queryKey: queryKeys.transactions,
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
