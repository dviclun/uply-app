import { useEffect, useState } from "react";
import { Modal, StyleSheet, View } from "react-native";

import { Button, Card, Stack, Text, TextField } from "@/components/ui";

type SavingsGoalModalProps = {
  visible: boolean;
  title: string;
  initialValue: number;
  confirmText: string;
  loading?: boolean;
  error?: string | null;
  onClose: () => void;
  onConfirm: (target: number) => Promise<void>;
};

export function SavingsGoalModal({
  visible,
  title,
  initialValue,
  confirmText,
  loading = false,
  error,
  onClose,
  onConfirm,
}: SavingsGoalModalProps) {
  const [target, setTarget] = useState(initialValue.toString());

  useEffect(() => {
    setTarget(initialValue.toString());
  }, [initialValue, visible]);

  const value = Number(target);

  const isValid = Number.isInteger(value) && value > 0;

  const handleChange = (value: string) => {
    const sanitized = value.replace(/[^0-9]/g, "");

    setTarget(sanitized);
  };

  const handleConfirm = async () => {
    if (!isValid) {
      return;
    }

    await onConfirm(Number(target));
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
              {title}
            </Text>

            <TextField
              label="Objetivo (€)"
              keyboardType="numeric"
              value={target}
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
                {confirmText}
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
