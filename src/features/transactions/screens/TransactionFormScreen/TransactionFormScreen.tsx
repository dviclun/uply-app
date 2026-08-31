import {
  Button,
  Container,
  DateField,
  Screen,
  ScreenHeader,
  ScrollScreen,
  SegmentedControl,
  Stack,
  Text,
  TextField,
} from "@/components/ui";
import { useEffect, useState } from "react";
import { TransactionType } from "../../components/TransactionItem";

import { ErrorState } from "@/components/ui/ErrorState";
import { LoadingState } from "@/components/ui/LoadingState";
import {
  useCategories,
  useCreateTransaction,
  useTransaction,
  useUpdateTransaction,
} from "@/hooks";
import { useToast } from "@/providers";
import DateTimePicker from "@react-native-community/datetimepicker";
import { router, useLocalSearchParams } from "expo-router";
import { CategorySelector } from "../../components/CategorySelector";
import { TransactionFormScreenProps } from "./types";

export function TransactionFormScreen({ mode }: TransactionFormScreenProps) {
  const { id } = useLocalSearchParams<{ id?: string }>();
  const isEditMode = mode === "edit";

  const [amount, setAmount] = useState("");
  const [title, setTitle] = useState("");
  const [type, setType] = useState<TransactionType>("expense");
  const [categoryId, setCategoryId] = useState<string | null>(null);
  const [date, setDate] = useState(new Date());
  const [showPicker, setShowPicker] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createTransaction = useCreateTransaction();
  const updateTransaction = useUpdateTransaction();
  const {
    data: categories = [],
    isLoading: categoriesLoading,
    isError: categoriesError,
    refetch: refetchCategories,
  } = useCategories();

  const { showToast } = useToast();

  const isValid =
    title.trim().length > 0 &&
    !Number.isNaN(Number(amount.replace(",", "."))) &&
    Number(amount.replace(",", ".")) > 0;

  if (isEditMode && !id) {
    return null;
  }

  const { data: transaction, isLoading } = useTransaction(id);

  const handleSave = async () => {
    if (!isValid) {
      return;
    }

    const parsedAmount = Number(amount.replace(",", "."));

    try {
      setError(null);

      if (isEditMode && transaction) {
        await updateTransaction.mutateAsync({
          ...transaction,
          title: title.trim(),
          amount: parsedAmount,
          type,
          date,
          categoryId,
        });

        showToast({
          message: "Movimiento actualizado correctamente.",
          variant: "success",
        });
      } else {
        await createTransaction.mutateAsync({
          title: title.trim(),
          amount: parsedAmount,
          type,
          date,
          categoryId,
        });

        showToast({
          message: "Movimiento creado correctamente.",
          variant: "success",
        });
      }

      router.back();
    } catch (error) {
      console.error("TRANSACTION SAVE ERROR:", error);

      setError(
        error instanceof Error
          ? "No se ha podido guardar el movimiento. Inténtalo de nuevo."
          : "No se ha podido guardar el movimiento. Inténtalo de nuevo.",
      );
    }
  };

  useEffect(() => {
    if (!transaction || !isEditMode) {
      return;
    }

    setAmount(transaction.amount.toString());
    setTitle(transaction.title);
    setType(transaction.type);
    setDate(transaction.date);
    setCategoryId(transaction.categoryId);
  }, [transaction, isEditMode]);

  if (categoriesError) {
    return (
      <Screen>
        <Container flex>
          <ErrorState
            message="No hemos podido cargar las categorías."
            onRetry={refetchCategories}
          />
        </Container>
      </Screen>
    );
  }

  if (categoriesLoading || (isEditMode && isLoading)) {
    return <LoadingState message="Cargando formulario..." />;
  }

  if (isEditMode && !transaction) {
    return null;
  }

  return (
    <ScrollScreen>
      <Container>
        <ScreenHeader
          title={isEditMode ? "Editar movimiento" : "Nuevo movimiento"}
          showBackButton
        />

        <Stack spacing="lg">
          <TextField
            label="Importe"
            placeholder="0,00 €"
            keyboardType="decimal-pad"
            value={amount}
            onChangeText={setAmount}
          />

          <SegmentedControl
            label="Tipo"
            value={type}
            onValueChange={(newType) => {
              setType(newType);
              setCategoryId(null);
            }}
            options={[
              {
                label: "Gasto",
                value: "expense",
              },
              {
                label: "Ingreso",
                value: "income",
              },
            ]}
          />

          <TextField
            label="Título"
            placeholder="Titulo del movimiento. Ej: Netflix"
            onChangeText={setTitle}
            value={title}
          />

          <CategorySelector
            categories={categories}
            type={type}
            value={categoryId}
            onChange={setCategoryId}
          />

          <DateField
            label="Fecha"
            value={date}
            onPress={() => setShowPicker(true)}
          />

          {showPicker && (
            <DateTimePicker
              value={date}
              mode="date"
              onValueChange={(_, selectedDate) => {
                if (selectedDate) {
                  setDate(selectedDate);
                }

                setShowPicker(false);
              }}
              onDismiss={() => {
                setShowPicker(false);
              }}
            />
          )}

          {error && <Text tone="danger">{error}</Text>}

          <Button
            onPress={handleSave}
            disabled={
              !isValid ||
              createTransaction.isPending ||
              updateTransaction.isPending
            }
            loading={
              isEditMode
                ? updateTransaction.isPending
                : createTransaction.isPending
            }
          >
            {isEditMode ? "Guardar cambios" : "Guardar"}
          </Button>
        </Stack>
      </Container>
    </ScrollScreen>
  );
}
