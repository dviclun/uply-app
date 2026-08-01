import { Card, Stack, Text } from "@/components/ui";
import { useDashboard } from "@/hooks";
import { spacing } from "@/theme";
import { formatCurrency } from "@/utils";
import { StyleSheet, View } from "react-native";

export function MonthlySummaryCard() {
  const { data: dashboard } = useDashboard();

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
                {formatCurrency(income, { showSign: true })}
              </Text>
            </Stack>
          </View>

          <View style={styles.column}>
            <Stack spacing="sm">
              <Text tone="secondary">Gastos</Text>

              <Text variant="h3" tone="danger">
                {formatCurrency(expense, { showSign: true })}
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
