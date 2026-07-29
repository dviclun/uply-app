import { Card, Stack, Text } from "@/components/ui";

import { formatCurrency } from "@/utils";

import { TransactionSummaryCardProps } from "./types";

export function TransactionSummaryCard({
  transaction,
}: TransactionSummaryCardProps) {
  const signedAmount =
    transaction.type === "expense" ? -transaction.amount : transaction.amount;
  return (
    <Card>
      <Stack spacing="sm">
        <Text variant="h2">{transaction.title}</Text>

        <Text
          variant="h1"
          tone={transaction.type === "income" ? "success" : "danger"}
        >
          {formatCurrency(signedAmount, {
            showSign: true,
          })}
        </Text>
      </Stack>
    </Card>
  );
}
