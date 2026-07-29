import { useMutation, useQueryClient } from "@tanstack/react-query";

import { CreateTransactionUseCase } from "@/features/transactions/application/createTransaction";
import { queryKeys } from "@/lib/react-query/queryKeys";
import { TransactionRepository } from "@/repositories";

const repository = new TransactionRepository();
const createTransactionUseCase = new CreateTransactionUseCase(repository);

export function useCreateTransaction() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createTransactionUseCase.execute.bind(createTransactionUseCase),

    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: queryKeys.transactions,
      });

      await queryClient.invalidateQueries({
        queryKey: queryKeys.dashboardTransactions,
      });
    },
  });
}
