import {
  Button,
  Container,
  DateField,
  Screen,
  ScreenHeader,
  SegmentedControl,
  Stack,
  TextField,
} from "@/components/ui";
import { useEffect, useState } from "react";
import { TransactionType } from "../../components/TransactionItem";

import {
  useCreateTransaction,
  useTransaction,
  useUpdateTransaction,
} from "@/hooks";
import DateTimePicker from "@react-native-community/datetimepicker";
import { router, useLocalSearchParams } from "expo-router";
import { TransactionFormScreenProps } from "./types";

export function TransactionFormScreen({ mode }: TransactionFormScreenProps) {
  const { id } = useLocalSearchParams<{ id?: string }>();
  const isEditMode = mode === "edit";

  const [amount, setAmount] = useState("");
  const [title, setTitle] = useState("");
  const [type, setType] = useState<TransactionType>("expense");
  const [date, setDate] = useState(new Date());
  const [showPicker, setShowPicker] = useState(false);

  const createTransaction = useCreateTransaction();
  const updateTransaction = useUpdateTransaction();

  const isValid =
    title.trim().length > 0 && !Number.isNaN(amount) && parseFloat(amount) > 0;

  if (isEditMode && !id) {
    return null;
  }

  const { data: transaction, isLoading } = useTransaction(id);

  const handleSave = async () => {
    const parsedAmount = Number(amount.replace(",", "."));

    if (isEditMode && transaction) {
      await updateTransaction.mutateAsync({
        ...transaction,
        title: title.trim(),
        amount: parsedAmount,
        type,
        date,
      });
    } else {
      await createTransaction.mutateAsync({
        title: title.trim(),
        amount: parsedAmount,
        type,
        date,
      });
    }

    router.back();
  };

  useEffect(() => {
    if (!transaction || !isEditMode) {
      return;
    }

    setAmount(transaction.amount.toString());
    setTitle(transaction.title);
    setType(transaction.type);
    setDate(transaction.date);
  }, [transaction, mode]);

  if (isEditMode && isLoading) {
    return null;
  }

  if (isEditMode && !transaction) {
    return null;
  }

  return (
    <Screen>
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
            onValueChange={setType}
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

          <Button
            onPress={handleSave}
            disabled={!isValid}
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
    </Screen>
  );
}
