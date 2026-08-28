import { Button, Container, Screen, Stack, Text } from "@/components/ui";
import { useAuth } from "@/hooks";
import { router } from "expo-router";

export default function NotFoundScreen() {
  const { session } = useAuth();

  const handleGoBack = () => {
    if (session) {
      router.replace("/");
      return;
    }

    router.replace("/login");
  };

  return (
    <Screen>
      <Container flex>
        <Stack
          flex={1}
          alignItems="center"
          justifyContent="center"
          spacing="lg"
        >
          <Text variant="h1" textAlign="center">
            404
          </Text>

          <Stack spacing="xs" alignItems="center">
            <Text variant="h3" textAlign="center">
              Página no encontrada
            </Text>

            <Text tone="secondary" textAlign="center">
              La página que buscas no existe o ya no está disponible.
            </Text>
          </Stack>

          <Button onPress={handleGoBack}>
            {session ? "Volver al inicio" : "Volver al inicio de sesión"}
          </Button>
        </Stack>
      </Container>
    </Screen>
  );
}
