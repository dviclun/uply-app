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
import { getAuthErrorMessage } from "@/utils/authErrors";

export function LoginScreen() {
  const { signIn } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const isValid = email.trim().length > 0 && password.length > 0;

  const handleLogin = async () => {
    if (!isValid) {
      return;
    }

    try {
      setError(null);
      setLoading(true);

      await signIn(email.trim(), password);

      router.replace("/(app)/(tabs)");
    } catch (error) {
      setError(getAuthErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Screen>
      <Container flex paddingTop="none">
        <View style={styles.content}>
          <Stack spacing="lg">
            <Text variant="h1" textAlign="center">
              Iniciar sesión
            </Text>

            <TextField
              label="Email"
              placeholder="tu@email.com"
              keyboardType="email-address"
              autoCapitalize="none"
              value={email}
              onChangeText={(value) => {
                setEmail(value);
                setError(null);
              }}
            />

            <TextField
              label="Contraseña"
              placeholder="Tu contraseña"
              secureTextEntry
              value={password}
              onChangeText={(value) => {
                setPassword(value);
                setError(null);
              }}
            />

            {error && <Text tone="danger">{error}</Text>}

            <Button onPress={handleLogin} disabled={!isValid} loading={loading}>
              Iniciar sesión
            </Button>

            <View style={styles.registerContainer}>
              <Text tone="secondary">¿Aún no tienes cuenta?</Text>

              <Pressable
                disabled={loading}
                onPress={() => router.push("/register")}
                style={({ pressed }) => [pressed && styles.linkPressed]}
              >
                <Text style={styles.link}>¡Regístrate!</Text>
              </Pressable>
            </View>
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

  registerContainer: {
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
