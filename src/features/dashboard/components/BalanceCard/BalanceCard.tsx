import { Card, Stack, Text } from "@/components/ui";
import { useDashboard } from "@/hooks";
import { getLocale, Language } from "@/i18n";
import { useCurrency } from "@/providers";
import { formatCurrency } from "@/utils";
import { useTranslation } from "react-i18next";

export function BalanceCard() {
  const { data: dashboard } = useDashboard();
  const { currency } = useCurrency();
  const { i18n } = useTranslation();
  const locale = getLocale(i18n.language as Language);

  if (!dashboard) {
    return null;
  }

  return (
    <Card>
      <Stack spacing="sm">
        <Text variant="bodyMedium" tone="secondary">
          Balance actual
        </Text>

        <Text variant="h1">
          <Text variant="h1">
            {formatCurrency(dashboard.balance, { currency, locale })}
          </Text>
        </Text>
      </Stack>
    </Card>
  );
}
