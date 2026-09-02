import {
  Button,
  Container,
  ErrorState,
  LoadingState,
  Screen,
  ScreenHeader,
  Stack,
} from "@/components/ui";
import { useCategories, useDeleteTransaction, useTransaction } from "@/hooks";
import { useToast } from "@/providers";
import { router, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import { DeleteTransactionModal } from "../../components/DeleteTransactionModal";
import { TransactionDetailsCard } from "../../components/TransactionDetailsCard";
import { TransactionSummaryCard } from "../../components/TransactionSummaryCard";

export function TransactionDetailScreen() {
  const { id } = useLocalSearchParams<{
    id: string;
  }>();

  const {
    data: transaction,
    isLoading: transactionLoading,
    isError,
    refetch,
  } = useTransaction(id);
  const { data: categories = [], isLoading: categoriesLoading } =
    useCategories();

  const deleteTransaction = useDeleteTransaction();
  const { showToast } = useToast();

  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const isLoading = transactionLoading || categoriesLoading;

  if (isLoading) {
    return <LoadingState message="Cargando movimiento..." />;
  }

  if (isError) {
    return (
      <ErrorState
        message="No hemos podido cargar este movimiento."
        onRetry={refetch}
      />
    );
  }

  if (!transaction) {
    return (
      <ErrorState
        title="Movimiento no encontrado"
        message="Puede que haya sido eliminado o ya no esté disponible."
        onRetry={() => router.back()}
        retryLabel="Volver"
      />
    );
  }

  const category = transaction.categoryId
    ? categories.find((category) => category.id === transaction.categoryId)
    : undefined;

  const handleDelete = async () => {
    setDeleteError(null);

    try {
      await deleteTransaction.mutateAsync(transaction.id);

      showToast({
        message: "Movimiento eliminado correctamente.",
        variant: "success",
      });

      setDeleteModalVisible(false);
      router.back();
    } catch (error) {
      console.error("TRANSACTION DELETE ERROR:", error);

      setDeleteError(
        "No se ha podido eliminar el movimiento. Inténtalo de nuevo.",
      );
    }
  };

  const handleOpenDeleteModal = () => {
    setDeleteError(null);
    setDeleteModalVisible(true);
  };

  const handleCloseDeleteModal = () => {
    if (deleteTransaction.isPending) {
      return;
    }

    setDeleteModalVisible(false);
    setDeleteError(null);
  };

  return (
    <Screen>
      <Container>
        <Stack spacing="lg">
          <ScreenHeader title="Detalle" showBackButton />

          <TransactionSummaryCard transaction={transaction} />

          <TransactionDetailsCard
            transaction={transaction}
            category={category}
          />

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
              onPress={handleOpenDeleteModal}
              disabled={deleteTransaction.isPending}
            >
              Eliminar
            </Button>
          </Stack>
        </Stack>

        <DeleteTransactionModal
          visible={deleteModalVisible}
          loading={deleteTransaction.isPending}
          error={deleteError}
          onClose={handleCloseDeleteModal}
          onConfirm={handleDelete}
        />
      </Container>
    </Screen>
  );
}
