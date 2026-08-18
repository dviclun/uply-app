import {
  Button,
  Container,
  Screen,
  ScreenHeader,
  Stack,
  Text,
} from "@/components/ui";
import { useDeleteTransaction, useTransaction } from "@/hooks";
import { router, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import { DeleteTransactionModal } from "../../components/DeleteTransactionModal";
import { TransactionDetailsCard } from "../../components/TransactionDetailsCard";
import { TransactionSummaryCard } from "../../components/TransactionSummaryCard";

export function TransactionDetailScreen() {
  const { id } = useLocalSearchParams<{
    id: string;
  }>();

  const { data: transaction } = useTransaction(id);
  const deleteTransaction = useDeleteTransaction();

  const [deleteModalVisible, setDeleteModalVisible] = useState(false);

  if (!transaction) {
    return (
      <Screen>
        <Container>
          <Text>Transacción no encontrada</Text>
        </Container>
      </Screen>
    );
  }

  const handleDelete = async () => {
    if (!transaction) return;

    await deleteTransaction.mutateAsync(transaction.id);
    setDeleteModalVisible(false);
    router.back();
  };

  return (
    <Screen>
      <Container>
        <Stack spacing="lg">
          <ScreenHeader title="Detalle" showBackButton />

          <TransactionSummaryCard transaction={transaction} />

          <TransactionDetailsCard transaction={transaction} />

          <Stack direction="row" spacing="md">
            <Button
              flex={1}
              variant="primary"
              onPress={() =>
                router.push({
                  pathname: "/transaction/edit",
                  params: {
                    id: transaction.id,
                  },
                })
              }
            >
              Editar
            </Button>
            <Button
              flex={1}
              variant="secondary"
              onPress={() => setDeleteModalVisible(true)}
              disabled={deleteTransaction.isPending}
            >
              Eliminar
            </Button>
          </Stack>
        </Stack>
        <DeleteTransactionModal
          visible={deleteModalVisible}
          loading={deleteTransaction.isPending}
          onClose={() => setDeleteModalVisible(false)}
          onConfirm={handleDelete}
        />
      </Container>
    </Screen>
  );
}
