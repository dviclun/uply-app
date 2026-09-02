import { useMutation, useQueryClient } from "@tanstack/react-query";

import { DeleteTransactionUseCase } from "@/features/transactions/application/deleteTransaction";
import { queryKeys } from "@/lib/react-query/queryKeys";
import type { Transaction, TransactionFilter } from "@/models";
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

      // queryClient.removeQueries({
      //   queryKey: queryKeys.transaction(user.id, id),
      // });

      const filters: TransactionFilter[] = ["all", "expense", "income"];

      filters.forEach((filter) => {
        queryClient.setQueryData<Transaction[]>(
          queryKeys.transactions(user.id, filter),
          (currentTransactions) => {
            if (!currentTransactions) {
              return currentTransactions;
            }

            return currentTransactions.filter(
              (transaction) => transaction.id !== id,
            );
          },
        );
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
