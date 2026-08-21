import { useMutation, useQueryClient } from "@tanstack/react-query";

import { DeleteTransactionUseCase } from "@/features/transactions/application/deleteTransaction";
import { queryKeys } from "@/lib/react-query/queryKeys";
import { TransactionRepository } from "@/repositories";
import { useAuth } from "./useAuth";

const repository = new TransactionRepository();
const deleteTransactionUseCase = new DeleteTransactionUseCase(repository);

export function useDeleteTransaction() {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation<void, Error, string>({
    mutationFn: deleteTransactionUseCase.execute.bind(deleteTransactionUseCase),

    onSuccess: async (_, id) => {
      if (!user) {
        return;
      }

      queryClient.removeQueries({
        queryKey: queryKeys.transaction(user.id, id),
      });

      await queryClient.invalidateQueries({
        queryKey: queryKeys.transactions(user.id),
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
