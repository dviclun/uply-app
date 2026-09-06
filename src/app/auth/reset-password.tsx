import { useState } from "react";
import { StyleSheet, View } from "react-native";

import {
  Button,
  Container,
  Screen,
  Stack,
  Text,
  TextField,
} from "@/components/ui";
import { useAuth } from "@/hooks";
import { setPasswordRecoveryMode } from "@/utils";
import { getAuthErrorMessage } from "@/utils/authErrors";
import { router } from "expo-router";

export default function ResetPasswordScreen() {
  const { updatePassword, signOut, setPasswordRecoveryActive } = useAuth();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [success, setSuccess] = useState(false);

  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const isValid =
    password.length >= 6 &&
    confirmPassword.length > 0 &&
    password === confirmPassword;

  const handleUpdatePassword = async () => {
    if (!isValid) {
      return;
    }

    try {
      setError(null);
      setLoading(true);

      await updatePassword(password);

      setSuccess(true);
    } catch (error) {
      console.error("PASSWORD UPDATE ERROR:", error);

      setError(getAuthErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  const handleContinue = async () => {
    try {
      setLoading(true);

      await setPasswordRecoveryMode(false);

      await signOut();

      setPasswordRecoveryActive(false);

      router.replace("/login");
    } catch (error) {
      console.error("SIGN OUT AFTER PASSWORD RESET ERROR:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Screen>
      <Container flex paddingTop="none">
        <View style={styles.content}>
          {success ? (
            <Stack spacing="lg">
              <Text variant="h1" textAlign="center">
                ¡Contraseña cambiada!
              </Text>

              <Text tone="secondary" textAlign="center">
                Tu contraseña se ha actualizado correctamente. Ya puedes iniciar
                sesión con tu nueva contraseña.
              </Text>

              <Button onPress={handleContinue}>Ir a iniciar sesión</Button>
            </Stack>
          ) : (
            <Stack spacing="lg">
              <Text variant="h1" textAlign="center">
                Nueva contraseña
              </Text>

              <Text tone="secondary" variant="small" textAlign="center">
                Mínimo 6 caracteres y diferente de tu contraseña anterior.
              </Text>

              <Stack spacing="lg">
                <TextField
                  label="Nueva contraseña"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry
                  placeholder="Mínimo 6 caracteres"
                />

                <TextField
                  label="Confirmar contraseña"
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  secureTextEntry
                  placeholder="Repite tu contraseña"
                />

                {error && <Text tone="danger">{error}</Text>}

                <Button
                  onPress={handleUpdatePassword}
                  disabled={!isValid || loading}
                  loading={loading}
                >
                  Cambiar contraseña
                </Button>
              </Stack>
            </Stack>
          )}
        </View>
      </Container>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: {
    flex: 1,
    justifyContent: "center",
  },
});
