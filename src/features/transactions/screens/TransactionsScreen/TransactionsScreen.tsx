import {
  Container,
  FloatingActionButton,
  Screen,
  ScreenHeader,
  Stack,
} from "@/components/ui";

import { useTransactions } from "@/hooks";

import { router } from "expo-router";
import { TransactionList } from "../../components/TransactionList";

export function TransactionsScreen() {
  const { data: transactions = [] } = useTransactions();
  return (
    <Screen>
      <Container flex>
        <Stack spacing="lg">
          <ScreenHeader title="Movimientos" />
        </Stack>

        <TransactionList transactions={transactions} />
        <FloatingActionButton
          onPress={() => router.push("/transaction/add")}
          accessibilityLabel="Añadir nuevo movimiento"
        />
      </Container>
    </Screen>
  );
}
