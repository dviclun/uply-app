import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { queryKeys } from "@/lib/react-query";
import { SavingsGoalRepository } from "@/repositories";
import { useAuth } from "./useAuth";

const repository = new SavingsGoalRepository();

export function useSavingsGoal() {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  const invalidateSavingsGoals = async () => {
    if (!user) {
      return;
    }

    await queryClient.invalidateQueries({
      queryKey: queryKeys.dashboard(user.id),
    });

    await queryClient.invalidateQueries({
      queryKey: queryKeys.savingsGoal(user.id),
    });
  };

  const query = useQuery({
    queryKey: queryKeys.savingsGoal(user?.id ?? ""),
    queryFn: async () => {
      const hasGoals = await repository.hasGoals();

      if (!hasGoals) {
        return {
          hasGoals: false,
          currentGoal: null,
          nextGoal: null,
        };
      }

      const [currentGoal, nextGoal] = await Promise.all([
        repository.getCurrentGoal(),
        repository.getNextGoal(),
      ]);

      return {
        hasGoals: true,
        currentGoal,
        nextGoal,
      };
    },
    enabled: Boolean(user),
  });

  const createFirstGoal = useMutation({
    mutationFn: (target: number) => repository.createFirstGoal(target),

    onSuccess: invalidateSavingsGoals,

    onError: (error) => {
      console.error(error);
    },
  });

  const updateNextGoalTarget = useMutation({
    mutationFn: (target: number) => repository.updateNextGoalTarget(target),

    onSuccess: invalidateSavingsGoals,

    onError: (error) => {
      console.error(error);
    },
  });

  return {
    ...query,
    createFirstGoal,
    updateNextGoalTarget,
  };
}
