import { useEffect, useState } from "react";
import { Modal, StyleSheet, View } from "react-native";

import { Button, Card, Stack, Text, TextField } from "@/components/ui";

type BalanceAdjustmentModalProps = {
  visible: boolean;
  initialValue: number;
  loading?: boolean;
  error?: string | null;
  onClose: () => void;
  onConfirm: (amount: number) => Promise<void>;
};

export function BalanceAdjustmentModal({
  visible,
  initialValue,
  loading = false,
  error,
  onClose,
  onConfirm,
}: BalanceAdjustmentModalProps) {
  const [amount, setAmount] = useState(initialValue.toString());

  useEffect(() => {
    setAmount(initialValue.toString());
  }, [initialValue, visible]);

  const value = Number(amount);

  const isValid = Number.isInteger(value) && value >= 0;

  const handleChange = (value: string) => {
    const sanitized = value.replace(/[^0-9]/g, "");

    setAmount(sanitized);
  };

  const handleConfirm = async () => {
    if (!isValid) {
      return;
    }

    await onConfirm(Number(amount));
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <Card>
          <Stack spacing="lg">
            <Text variant="h3" textAlign="center">
              Ajustar balance
            </Text>

            <TextField
              label="Balance actual"
              keyboardType="numeric"
              value={amount}
              onChangeText={handleChange}
            />

            {error && (
              <Text tone="danger" textAlign="center">
                {error}
              </Text>
            )}

            <Stack direction="row" spacing="md">
              <Button
                variant="secondary"
                onPress={onClose}
                disabled={loading}
                flex={1}
              >
                Cancelar
              </Button>

              <Button
                disabled={!isValid || loading}
                onPress={handleConfirm}
                flex={1}
                loading={loading}
              >
                Guardar
              </Button>
            </Stack>
          </Stack>
        </Card>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: "center",
    padding: 24,
    backgroundColor: "rgba(0,0,0,0.4)",
  },
});
