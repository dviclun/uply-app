import { useEffect, useState } from "react";
import { Modal, StyleSheet, View } from "react-native";

import { Button, Card, Stack, Text, TextField } from "@/components/ui";

type ChangePasswordStep = "password" | "code";

type ChangePasswordModalProps = {
  visible: boolean;
  email?: string;
  loading?: boolean;
  error?: string | null;
  onChangePassword: (
    currentPassword: string,
    newPassword: string,
  ) => Promise<void>;
  onSubmitCode: (code: string) => Promise<void>;
  onClose: () => void;
  codeStep?: boolean;
};

export function ChangePasswordModal({
  visible,
  email,
  loading = false,
  error,
  onChangePassword,
  onSubmitCode,
  onClose,
  codeStep = false,
}: ChangePasswordModalProps) {
  const [currentPassword, setCurrentPassword] = useState("");
  const [password, setPassword] = useState("");
  const [confirmation, setConfirmation] = useState("");
  const [code, setCode] = useState("");

  const step: ChangePasswordStep = codeStep ? "code" : "password";

  useEffect(() => {
    if (!visible) {
      setCurrentPassword("");
      setPassword("");
      setConfirmation("");
      setCode("");
      return;
    }

    if (!codeStep) {
      setCode("");
    }
  }, [visible, codeStep]);

  const isCodeValid = code.length === 8;

  const isPasswordValid = password.length >= 6;
  const passwordsMatch = password.length > 0 && password === confirmation;

  const passwordsAreDifferent =
    password.length === 0 || password !== currentPassword;

  const isPasswordFormValid =
    currentPassword.length > 0 &&
    isPasswordValid &&
    passwordsMatch &&
    passwordsAreDifferent;

  const handleChangePassword = async () => {
    if (!isPasswordFormValid) {
      return;
    }

    try {
      await onChangePassword(currentPassword, password);
    } catch {
      // El componente padre gestiona el error.
    }
  };

  const handleSubmitCode = async () => {
    if (!isCodeValid) {
      return;
    }

    try {
      await onSubmitCode(code);
    } catch {
      // El componente padre gestiona el error.
    }
  };

  const handleClose = () => {
    if (loading) {
      return;
    }

    onClose();
  };

  const maskedEmail = email
    ? email.replace(
        /^(.)(.*)(@.*)$/,
        (_, first, middle, domain) =>
          `${first}${"*".repeat(Math.min(middle.length, 4))}${domain}`,
      )
    : undefined;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={handleClose}
    >
      <View style={styles.overlay}>
        <Card>
          <Stack spacing="lg">
            {step === "password" && (
              <>
                <Text variant="h3" textAlign="center">
                  Cambiar contraseña
                </Text>

                <Text textAlign="center">
                  Introduce tu contraseña actual y la nueva contraseña.
                </Text>

                <TextField
                  label="Contraseña actual"
                  secureTextEntry
                  value={currentPassword}
                  onChangeText={setCurrentPassword}
                  editable={!loading}
                />

                <TextField
                  label="Nueva contraseña"
                  secureTextEntry
                  value={password}
                  onChangeText={setPassword}
                  editable={!loading}
                />

                <TextField
                  label="Repetir nueva contraseña"
                  secureTextEntry
                  value={confirmation}
                  onChangeText={setConfirmation}
                  editable={!loading}
                />

                {password.length > 0 && !isPasswordValid && (
                  <Text tone="danger" textAlign="center">
                    La contraseña debe tener al menos 6 caracteres.
                  </Text>
                )}

                {password.length > 0 &&
                  currentPassword.length > 0 &&
                  password === currentPassword && (
                    <Text tone="danger" textAlign="center">
                      La nueva contraseña no puede ser igual a la actual.
                    </Text>
                  )}

                {confirmation.length > 0 && !passwordsMatch && (
                  <Text tone="danger" textAlign="center">
                    Las contraseñas no coinciden.
                  </Text>
                )}

                {error && (
                  <Text tone="danger" textAlign="center">
                    {error}
                  </Text>
                )}

                <Stack direction="row" spacing="md">
                  <Button
                    variant="secondary"
                    onPress={handleClose}
                    disabled={loading}
                    flex={1}
                  >
                    Cancelar
                  </Button>

                  <Button
                    onPress={handleChangePassword}
                    disabled={!isPasswordFormValid || loading}
                    loading={loading}
                    flex={1}
                  >
                    Cambiar
                  </Button>
                </Stack>
              </>
            )}

            {step === "code" && (
              <>
                <Text variant="h3" textAlign="center">
                  Verificar identidad
                </Text>

                <Text textAlign="center">
                  Hemos enviado un código a tu correo
                  {maskedEmail ? ` ${maskedEmail}` : ""}. Introdúcelo para
                  continuar.
                </Text>

                <TextField
                  label="Código"
                  keyboardType="number-pad"
                  value={code}
                  onChangeText={setCode}
                  editable={!loading}
                  maxLength={8}
                />

                {error && (
                  <Text tone="danger" textAlign="center">
                    {error}
                  </Text>
                )}

                <Stack direction="row" spacing="md">
                  <Button
                    variant="secondary"
                    onPress={handleClose}
                    disabled={loading}
                    flex={1}
                  >
                    Cancelar
                  </Button>

                  <Button
                    onPress={handleSubmitCode}
                    disabled={!isCodeValid || loading}
                    loading={loading}
                    flex={1}
                  >
                    Confirmar
                  </Button>
                </Stack>
              </>
            )}
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
