import { Stack } from "expo-router";

import { Container, Screen, Text } from "@/components/ui";
import { AuthDeepLinkHandler } from "@/features/auth";
import { useAuth } from "@/hooks";

export function AppContent() {
  const { session, loading } = useAuth();

  if (loading) {
    return (
      <Screen>
        <Container>
          <Text textAlign="center">Cargando...</Text>
        </Container>
      </Screen>
    );
  }

  return (
    <>
      <AuthDeepLinkHandler />

      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Protected guard={!session}>
          <Stack.Screen name="(auth)" />
        </Stack.Protected>

        <Stack.Protected guard={!!session}>
          <Stack.Screen name="(app)" />
        </Stack.Protected>

        <Stack.Screen name="auth/callback" />
      </Stack>
    </>
  );
}
