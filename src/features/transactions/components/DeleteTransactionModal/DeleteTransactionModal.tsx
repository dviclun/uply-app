import { Modal, StyleSheet, View } from "react-native";

import { Button, Card, Stack, Text } from "@/components/ui";
import { DeleteTransactionModalProps } from "./types";

export function DeleteTransactionModal({
  visible,
  loading,
  onClose,
  onConfirm,
}: DeleteTransactionModalProps) {
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
              Eliminar movimiento
            </Text>

            <Text tone="secondary" textAlign="center">
              ¿Estás seguro de que quieres eliminar este movimiento? Esta acción
              no se puede deshacer.
            </Text>

            <Stack direction="row" spacing="md">
              <Button
                variant="secondary"
                onPress={onClose}
                flex={1}
                disabled={loading}
              >
                Cancelar
              </Button>

              <Button
                variant="danger"
                onPress={onConfirm}
                flex={1}
                loading={loading}
              >
                Eliminar
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
