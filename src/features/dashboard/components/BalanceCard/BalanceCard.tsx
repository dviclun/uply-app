import { Card, Stack, Text } from "@/components/ui";
import { useDashboard } from "@/hooks";
import { formatCurrency } from "@/utils";

export function BalanceCard() {
  const dashboard = useDashboard();
  return (
    <Card>
      <Stack spacing="sm">
        <Text variant="bodyMedium" tone="secondary">
          Balance actual
        </Text>

        <Text variant="h1">
          <Text variant="h1">{formatCurrency(dashboard.balance)}</Text>
        </Text>
      </Stack>
    </Card>
  );
}
