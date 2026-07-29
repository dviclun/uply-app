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
import { useState } from "react";
import { TransactionType } from "../../components/TransactionItem";

import { useCreateTransaction } from "@/hooks/useCreateTransactions";
import DateTimePicker from "@react-native-community/datetimepicker";
import { router } from "expo-router";

export function AddTransactionScreen() {
  const [amount, setAmount] = useState("");
  const [title, setTitle] = useState("");
  const [type, setType] = useState<TransactionType>("expense");
  const [date, setDate] = useState(new Date());
  const [showPicker, setShowPicker] = useState(false);

  const createTransaction = useCreateTransaction();

  const isValid =
    title.trim().length > 0 && !Number.isNaN(amount) && parseFloat(amount) > 0;

  const handleSave = async () => {
    const parsedAmount = Number(amount.replace(",", "."));

    await createTransaction.mutateAsync({
      title: title.trim(),
      amount: parsedAmount,
      type,
      date,
    });

    router.back();
  };

  return (
    <Screen>
      <Container>
        <ScreenHeader title="Nuevo movimiento" showBackButton />

        <Stack spacing="lg">
          <TextField
            label="Importe"
            placeholder="0,00 €"
            keyboardType="decimal-pad"
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

          <Button onPress={handleSave} disabled={!isValid}>
            Guardar
          </Button>
        </Stack>
      </Container>
    </Screen>
  );
}
