import {
  Container,
  EmptyState,
  ErrorState,
  FloatingActionButton,
  LoadingState,
  Screen,
  ScreenHeader,
  Stack
} from "@/components/ui";

import { useTransactions } from "@/hooks";

import { router } from "expo-router";
import { TransactionList } from "../../components/TransactionList";


export function TransactionsScreen() {
  const {
    data: transactions = [],
    isPending,
    isError,
    refetch,
  } = useTransactions();

  return (
    <Screen>
      <Container flex>
        <Stack spacing="lg">
          <ScreenHeader title="Movimientos" />
        </Stack>

        {isPending ? (
          <LoadingState message="Cargando movimientos..." />
        ) : isError ? (
          <ErrorState
            message="No hemos podido cargar tus movimientos."
            onRetry={refetch}
          />
        ) : transactions.length === 0 ? (
          <EmptyState
            title="Todavía no tienes movimientos"
            message="Añade tu primer ingreso o gasto para empezar a controlar tus finanzas."
          />
        ) : (
          <TransactionList transactions={transactions} />
        )}

        <FloatingActionButton
          onPress={() => router.push("/transaction/add")}
          accessibilityLabel="Añadir nuevo movimiento"
        />
      </Container>
    </Screen>
  );
}
