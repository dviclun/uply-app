import { router } from "expo-router";
import { useState } from "react";

import {
  Button,
  Container,
  Screen,
  Stack,
  Text,
  TextField,
} from "@/components/ui";

import { useAuth } from "@/hooks";

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
      setError(
        error instanceof Error
          ? error.message
          : "No se ha podido iniciar sesión.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Screen>
      <Container>
        <Stack spacing="lg">
          <Text variant="h1">Iniciar sesión</Text>

          <TextField
            label="Email"
            placeholder="tu@email.com"
            keyboardType="email-address"
            autoCapitalize="none"
            value={email}
            onChangeText={setEmail}
          />

          <TextField
            label="Contraseña"
            placeholder="Tu contraseña"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />

          {error && <Text>{error}</Text>}

          <Button
            onPress={handleLogin}
            disabled={!isValid || loading}
            loading={loading}
          >
            Iniciar sesión
          </Button>

          <Button variant="secondary" onPress={() => router.push("/register")}>
            Crear cuenta
          </Button>
        </Stack>
      </Container>
    </Screen>
  );
}
