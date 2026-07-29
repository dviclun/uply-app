import { Card, Stack } from "@/components/ui";

import { formatDate, formatTransactionType } from "@/utils";

import { DetailRow } from "../DetailRow";
import { TransactionDetailsCardProps } from "./types";

export function TransactionDetailsCard({
  transaction,
}: TransactionDetailsCardProps) {
  return (
    <Card>
      <Stack spacing="md">
        <DetailRow
          label="Tipo"
          value={formatTransactionType(transaction.type)}
        />

        <DetailRow label="Fecha" value={formatDate(transaction.date)} />
      </Stack>
    </Card>
  );
}
