import { TransactionItem } from "@/components/features/transactions/components/TransactionItem";
import { Card, Stack, Text } from "@/components/ui";
import { useTransactions } from "@/hooks";

export function RecentTransactionsCard() {
  const transactions = useTransactions();
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
