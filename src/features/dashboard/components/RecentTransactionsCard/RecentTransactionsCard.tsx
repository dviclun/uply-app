import { Card, Stack, Text } from "@/components/ui";
import { TransactionItem } from "@/features/transactions";

import { useDashboardTransactions } from "@/hooks";

export function RecentTransactionsCard() {
  const { data: transactions = [] } = useDashboardTransactions();
  return (
    <Card>
      <Stack spacing="md">
        <Text variant="bodyMedium">Últimos movimientos</Text>
        {transactions.map((transaction) => (
          <TransactionItem key={transaction.id} transaction={transaction} />
        ))}
      </Stack>
    </Card>
  );
}
