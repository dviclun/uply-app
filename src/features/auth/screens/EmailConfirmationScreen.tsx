import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";

import { Button, Container, Screen, Stack, Text } from "@/components/ui";

import { useAuth } from "@/hooks";

const RESEND_COOLDOWN_SECONDS = 60;

function getResendError(error: unknown): {
  message: string;
  cooldown?: number;
} {
  if (!(error instanceof Error)) {
    return {
      message: "No se ha podido reenviar el correo.",
    };
  }

  const match = error.message.match(/after (\d+) seconds?/i);

  if (match) {
    return {
      message: "Todavía no puedes solicitar otro correo.",
      cooldown: Number(match[1]),
    };
  }

  return {
    message: "No se ha podido reenviar el correo. Inténtalo de nuevo.",
  };
}

export function EmailConfirmationScreen() {
  const { resendConfirmationEmail } = useAuth();

  const { email } = useLocalSearchParams<{
    email?: string;
  }>();

  const [loading, setLoading] = useState(false);
  const [cooldown, setCooldown] = useState(RESEND_COOLDOWN_SECONDS);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (cooldown <= 0) {
      return;
    }

    const timer = setInterval(() => {
      setCooldown((value) => Math.max(value - 1, 0));
    }, 1000);

    return () => clearInterval(timer);
  }, [cooldown]);

  const handleResend = async () => {
    if (!email || loading || cooldown > 0) {
      return;
    }

    try {
      setLoading(true);
      setError(null);
      setSuccess(false);

      await resendConfirmationEmail(email);

      setSuccess(true);
      setCooldown(RESEND_COOLDOWN_SECONDS);
    } catch (error) {
      const result = getResendError(error);

      setError(result.message);

      if (result.cooldown !== undefined) {
        setCooldown(result.cooldown);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Screen>
      <Container flex>
        <Stack
          spacing="lg"
          flex={1}
          alignItems="center"
          justifyContent="center"
        >
          <Text variant="h1" textAlign="center">
            ✉️
          </Text>

          <Text variant="h2" textAlign="center">
            Revisa tu email
          </Text>

          <Text tone="secondary" textAlign="center">
            Hemos enviado un correo con un enlace para confirmar tu cuenta.
          </Text>

          {email && (
            <Text variant="bodyMedium" textAlign="center">
              {email}
            </Text>
          )}

          <Text tone="secondary" textAlign="center">
            Revisa tu bandeja de entrada y, si no lo encuentras, comprueba
            también la carpeta de spam.
          </Text>

          <Stack spacing="sm" alignItems="center">
            <Text textAlign="center">¿No has recibido el correo?</Text>

            <Button
              onPress={handleResend}
              disabled={!email || loading || cooldown > 0}
              loading={loading}
            >
              {cooldown > 0
                ? `Reenviar correo en ${cooldown}s`
                : "Reenviar correo"}
            </Button>
          </Stack>

          {success && (
            <Text tone="success" textAlign="center">
              Hemos reenviado el correo de confirmación.
            </Text>
          )}

          {error && (
            <Text tone="danger" textAlign="center">
              {error}
            </Text>
          )}

          <Button
            variant="secondary"
            onPress={() => router.replace("/login")}
            disabled={loading}
          >
            Ir a iniciar sesión
          </Button>
        </Stack>
      </Container>
    </Screen>
  );
}
