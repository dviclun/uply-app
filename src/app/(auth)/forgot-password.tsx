import { router } from "expo-router";
import { useState } from "react";
import { Pressable, StyleSheet, View } from "react-native";

import {
  Button,
  Container,
  Screen,
  Stack,
  Text,
  TextField,
} from "@/components/ui";
import { useAuth } from "@/hooks";
import { colors, spacing } from "@/theme";

export default function ForgotPasswordScreen() {
  const { resetPassword } = useAuth();

  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const isValid = email.trim().length > 0;

  const handleResetPassword = async () => {
    if (!isValid) {
      return;
    }

    try {
      setError(null);
      setLoading(true);

      await resetPassword(email.trim());

      setSuccess(true);
    } catch (error) {
      console.error("PASSWORD RESET ERROR:", error);

      setError("No hemos podido enviar el correo de recuperación.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Screen>
      <Container flex paddingTop="none">
        <View style={styles.content}>
          <Stack spacing="lg">
            {!success ? (
              <Stack spacing="lg">
                <Text variant="h1" textAlign="center">
                  Recuperar contraseña
                </Text>
                <Text tone="secondary" textAlign="center">
                  Introduce tu correo electrónico y te enviaremos un enlace para
                  restablecer tu contraseña.
                </Text>

                <TextField
                  label="Correo electrónico"
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                  placeholder="tu@email.com"
                />

                {error && <Text tone="danger">{error}</Text>}

                <Button
                  onPress={handleResetPassword}
                  disabled={!isValid || loading}
                  loading={loading}
                >
                  Enviar enlace
                </Button>
              </Stack>
            ) : (
              <Stack
                spacing="lg"
                flex={1}
                alignItems="center"
                justifyContent="center"
              >
                <Text variant="h1" textAlign="center">
                  Recuperar contraseña
                </Text>
                <Text variant="h1" textAlign="center">
                  ✉️
                </Text>

                <Text variant="h2" textAlign="center">
                  Revisa tu email
                </Text>

                <Text tone="secondary" textAlign="center">
                  Si existe una cuenta asociada a este correo, recibirás un
                  enlace para restablecer tu contraseña.
                </Text>

                <Text tone="secondary" textAlign="center">
                  Revisa tu bandeja de entrada y, si no lo encuentras, comprueba
                  también la carpeta de spam.
                </Text>

                <Button onPress={() => router.replace("/login")}>
                  Volver a iniciar sesión
                </Button>
              </Stack>
            )}

            {!success && (
              <View style={styles.loginContainer}>
                <Pressable
                  disabled={loading}
                  onPress={() => router.back()}
                  style={({ pressed }) => [pressed && styles.linkPressed]}
                >
                  <Text style={styles.link}>Volver a iniciar sesión</Text>
                </Pressable>
              </View>
            )}
          </Stack>
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

  loginContainer: {
    alignItems: "center",
    marginTop: spacing.sm,
  },

  link: {
    color: colors.primary,
  },

  linkPressed: {
    opacity: 0.7,
  },
});
