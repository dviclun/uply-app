import { useMutation, useQueryClient } from "@tanstack/react-query";

import { CreateTransactionUseCase } from "@/features/transactions/application/createTransaction";
import { queryKeys } from "@/lib/react-query/queryKeys";
import { TransactionRepository } from "@/repositories";
import { useAuth } from "./useAuth";

const repository = new TransactionRepository();
const createTransactionUseCase = new CreateTransactionUseCase(repository);

export function useCreateTransaction() {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: createTransactionUseCase.execute.bind(createTransactionUseCase),

    onSuccess: async () => {
      if (!user) {
        return;
      }

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
