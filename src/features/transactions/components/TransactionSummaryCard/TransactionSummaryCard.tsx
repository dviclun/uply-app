import { Card, Stack, Text } from "@/components/ui";

import { formatCurrency } from "@/utils";

import { getLocale, Language } from "@/i18n";
import { useCurrency } from "@/providers";
import { useTranslation } from "react-i18next";
import { TransactionSummaryCardProps } from "./types";

export function TransactionSummaryCard({
  transaction,
}: TransactionSummaryCardProps) {
  const { currency } = useCurrency();
  const { i18n } = useTranslation();
  const locale = getLocale(i18n.language as Language);
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
            currency,
            locale,
          })}
        </Text>
      </Stack>
    </Card>
  );
}
