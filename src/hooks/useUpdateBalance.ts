import { useMutation, useQueryClient } from "@tanstack/react-query";


import { UpdateBalanceUseCase } from "@/features/dashboard/application/updateBalance/UpdateBalanceUseCase";
import { queryKeys } from "@/lib/react-query/queryKeys";
import type { BalanceAdjustment } from "@/models";
import { BalanceAdjustmentRepository } from "@/repositories";
import { useAuth } from "./useAuth";

const repository = new BalanceAdjustmentRepository();
const updateBalanceUseCase = new UpdateBalanceUseCase(repository);

export function useUpdateBalance() {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation<BalanceAdjustment | undefined, Error, number>({
    mutationFn: updateBalanceUseCase.execute.bind(updateBalanceUseCase),

    onSuccess: async () => {
      if (!user) {
        return;
      }

      await queryClient.invalidateQueries({
        queryKey: queryKeys.dashboard(user.id),
      });
    },
  });
}