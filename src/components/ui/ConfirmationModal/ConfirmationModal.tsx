import { Modal, StyleSheet, View } from "react-native";

import { Button } from "../Button";
import { Card } from "../Card";
import { Stack } from "../Stack";
import { Text } from "../Text";
import { ConfirmationModalProps } from "./types";

export function ConfirmationModal({
  visible,
  title,
  message,
  confirmText,
  loading = false,
  error,
  onClose,
  onConfirm,
}: ConfirmationModalProps) {
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

            <Text tone="secondary" textAlign="center">
              {message}
            </Text>

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
                onPress={onConfirm}
                loading={loading}
                disabled={loading}
                flex={1}
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
