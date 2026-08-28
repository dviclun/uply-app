import { useDashboard } from "./useDashboard";
import { useSavingsGoal } from "./useSavingGoals";
import { useDashboardTransactions } from "./useTransactions";

export function useDashboardData() {
  const dashboard = useDashboard();
  const transactions = useDashboardTransactions();
  const savingsGoal = useSavingsGoal();

  const isInitialLoading =
    dashboard.isPending || transactions.isPending || savingsGoal.isPending;

  const isError =
    dashboard.isError || transactions.isError || savingsGoal.isError;

  const error =
    dashboard.error ?? transactions.error ?? savingsGoal.error ?? null;

  const retry = async () => {
    await Promise.all([
      dashboard.refetch(),
      transactions.refetch(),
      savingsGoal.refetch(),
    ]);
  };

  return {
    isInitialLoading,
    isError,
    error,
    retry,
  };
}
