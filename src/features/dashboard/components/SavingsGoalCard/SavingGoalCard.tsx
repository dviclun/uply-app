import { Card, ProgressBar, Stack, Text } from "@/components/ui";
import { useDashboard } from "@/hooks";
import { formatCurrency } from "@/utils";

export function SavingGoalCard() {
  const { data: dashboard } = useDashboard();

  if (!dashboard) {
    return null;
  }

  const progress =
    (dashboard.savingsGoal.current / dashboard.savingsGoal.target) * 100;

  const remaining =
    dashboard.savingsGoal.target - dashboard.savingsGoal.current;
  return (
    <Card>
      <Stack spacing="md">
        <Text variant="bodyMedium">Objetivo de ahorro</Text>

        <Text variant="h3">
          {formatCurrency(dashboard.savingsGoal.current, {
            decimals: false,
          })}
          {" de "}
          {formatCurrency(dashboard.savingsGoal.target, {
            decimals: false,
          })}
        </Text>

        <ProgressBar value={progress} />

        <Text tone="secondary">
          Te quedan{" "}
          {formatCurrency(remaining, {
            decimals: false,
          })}{" "}
          para conseguirlo 🎉
        </Text>
      </Stack>
    </Card>
  );
}
