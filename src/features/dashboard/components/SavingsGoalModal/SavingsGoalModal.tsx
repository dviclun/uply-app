import { useEffect, useState } from "react";
import { Modal, StyleSheet, View } from "react-native";

import { Button, Card, Stack, Text, TextField } from "@/components/ui";

type SavingsGoalModalProps = {
  visible: boolean;
  title: string;
  initialValue: number;
  confirmText: string;
  loading?: boolean;
  onClose: () => void;
  onConfirm: (target: number) => void;
};

export function SavingsGoalModal({
  visible,
  title,
  initialValue,
  confirmText,
  loading,
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

  const handleConfirm = () => {
    if (!isValid) {
      return;
    }

    onConfirm(Number(target));
    onClose();
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

            <Stack direction="row" spacing="md">
              <Button variant="secondary" onPress={onClose} flex={1}>
                Cancelar
              </Button>

              <Button
                disabled={!isValid}
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
