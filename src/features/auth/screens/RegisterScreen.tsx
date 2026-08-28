import { useState } from "react";

import {
  Button,
  Container,
  Screen,
  ScreenHeader,
  Stack,
  Text,
  TextField,
} from "@/components/ui";

import { useAuth } from "@/hooks";
import { getAuthErrorMessage } from "@/utils/authErrors";
import { router } from "expo-router";

export function RegisterScreen() {
  const { signUp } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [initialBalance, setInitialBalance] = useState("");

  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const parsedBalance = Number(initialBalance.replace(",", "."));

  const isValid =
    email.trim().length > 0 &&
    password.length >= 6 &&
    !Number.isNaN(parsedBalance);

  const handleRegister = async () => {
    if (!isValid) {
      return;
    }

    try {
      setError(null);
      setLoading(true);

      const result = await signUp(email.trim(), password, parsedBalance);

      if (result.requiresEmailConfirmation) {
        router.replace({
          pathname: "/email-confirmation",
          params: {
            email: result.email,
          },
        });

        return;
      }

      router.replace("/(app)/(tabs)");
    } catch (error) {
      setError(getAuthErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Screen>
      <Container>
        <Stack spacing="lg">
          <ScreenHeader title="Crear cuenta" showBackButton />

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
            placeholder="Mínimo 6 caracteres"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />

          <TextField
            label="Balance inicial"
            placeholder="0,00 €"
            keyboardType="decimal-pad"
            value={initialBalance}
            onChangeText={setInitialBalance}
          />

          {error && <Text tone="danger">{error}</Text>}

          <Button
            onPress={handleRegister}
            disabled={!isValid || loading}
            loading={loading}
          >
            Crear cuenta
          </Button>
        </Stack>
      </Container>
    </Screen>
  );
}
