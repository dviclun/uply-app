import { Button, Card, EmptyState, Stack, Text } from "@/components/ui";

import { useDashboardTransactions } from "@/hooks";
import { router } from "expo-router";

import { TransactionItem } from "@/features/transactions";
import { StyleSheet, View } from "react-native";

export function RecentTransactionsCard() {
  const { data: transactions = [] } = useDashboardTransactions();

  const handleViewAll = () => {
    router.push("/(app)/(tabs)/transactions");
  };

  const handleCreateTransaction = () => {
    router.push("/(app)/transaction/add");
  };

  return (
    <Card>
      <Stack spacing="md">
        <View style={styles.header}>
          <Text variant="bodyMedium">Últimos movimientos</Text>

          <Button
            variant="ghost"
            compact
            fullWidth={false}
            onPress={handleViewAll}
          >
            Ver todos
          </Button>
        </View>

        {transactions.length === 0 ? (
          <EmptyState
            message="Añade tu primer ingreso o gasto para empezar a controlar tus finanzas."
            action={
              <Button onPress={handleCreateTransaction}>
                Añadir movimiento
              </Button>
            }
          />
        ) : (
          transactions.map((transaction) => (
            <TransactionItem key={transaction.id} transaction={transaction} />
          ))
        )}
      </Stack>
    </Card>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
});
