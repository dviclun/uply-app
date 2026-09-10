import { Card, Stack, Text } from "@/components/ui";
import { useDashboard } from "@/hooks";
import { getLocale, Language } from "@/i18n";
import { useCurrency } from "@/providers";
import { spacing } from "@/theme";
import { formatCurrency } from "@/utils";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";

export function MonthlySummaryCard() {
  const { data: dashboard } = useDashboard();
  const { currency } = useCurrency();
  const { i18n } = useTranslation();
  const locale = getLocale(i18n.language as Language);

  if (!dashboard) {
    return null;
  }

  const income = dashboard.monthlySummary.income;

  const expense = -dashboard.monthlySummary.expense;
  return (
    <Card>
      <Stack spacing="md">
        <Text variant="bodyMedium">Resumen del mes</Text>

        <View style={styles.row}>
          <View style={styles.column}>
            <Stack spacing="sm">
              <Text tone="secondary">Ingresos</Text>

              <Text variant="h3" tone="success">
                {formatCurrency(income, { showSign: true, currency, locale })}
              </Text>
            </Stack>
          </View>

          <View style={styles.column}>
            <Stack spacing="sm">
              <Text tone="secondary">Gastos</Text>

              <Text variant="h3" tone="danger">
                {formatCurrency(expense, { showSign: true, currency, locale })}
              </Text>
            </Stack>
          </View>
        </View>
      </Stack>
    </Card>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    gap: spacing.lg,
  },

  column: {
    flex: 1,
  },
});
