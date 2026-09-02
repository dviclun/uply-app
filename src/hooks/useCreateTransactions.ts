import { useMutation, useQueryClient } from "@tanstack/react-query";

import {
  CreateTransactionDto,
  CreateTransactionUseCase,
} from "@/features/transactions/application/createTransaction";
import { queryKeys } from "@/lib/react-query/queryKeys";
import { updateTransactionsCache } from "@/lib/react-query/transactionCache";
import type { Transaction } from "@/models";
import { TransactionRepository } from "@/repositories";
import { useAuth } from "./useAuth";

const repository = new TransactionRepository();
const createTransactionUseCase = new CreateTransactionUseCase(repository);

export function useCreateTransaction() {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation<Transaction, Error, CreateTransactionDto>({
    mutationFn: createTransactionUseCase.execute.bind(createTransactionUseCase),

    onSuccess: async (transaction) => {
      if (!user) {
        return;
      }

      updateTransactionsCache(queryClient, user.id, transaction);

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
