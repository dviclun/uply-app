import { Container, Screen, ScreenHeader, Stack, Text } from "@/components/ui";
import { useTransaction } from "@/hooks";
import { useLocalSearchParams } from "expo-router";
import { TransactionDetailsCard } from "../../components/TransactionDetailsCard";
import { TransactionSummaryCard } from "../../components/TransactionSummaryCard";

export function TransactionDetailScreen() {
  const { id } = useLocalSearchParams<{
    id: string;
  }>();

  const { data: transaction } = useTransaction(id);

  if (!transaction) {
    return (
      <Screen>
        <Container>
          <Text>Transacción no encontrada</Text>
        </Container>
      </Screen>
    );
  }

  return (
    <Screen>
      <Container>
        <Stack spacing="lg">
          <ScreenHeader title="Detalle" showBackButton />

          <TransactionSummaryCard transaction={transaction} />

          <TransactionDetailsCard transaction={transaction} />
        </Stack>
      </Container>
    </Screen>
  );
}
