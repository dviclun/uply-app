import { Stack } from "expo-router";
import { useEffect, useRef, useState } from "react";

import { Container, Screen, Text } from "@/components/ui";
import { AuthDeepLinkHandler } from "@/features/auth";
import { useAuth } from "@/hooks";
import { SavingsGoalRepository } from "@/repositories";

const savingsGoalRepository = new SavingsGoalRepository();

export function AppContent() {
  const { session, loading } = useAuth();

  const [initializedUserId, setInitializedUserId] = useState<string | null>(
    null,
  );

  const initializingUserId = useRef<string | null>(null);

  useEffect(() => {
    if (!session) {
      initializingUserId.current = null;
      setInitializedUserId(null);
      return;
    }

    const userId = session.user.id;

    if (initializedUserId === userId || initializingUserId.current === userId) {
      return;
    }

    initializingUserId.current = userId;

    const initializeGoals = async () => {
      try {
        await savingsGoalRepository.initializeGoals();

        setInitializedUserId(userId);
      } catch (error) {
        console.error("SAVINGS GOALS INITIALIZATION ERROR:", error);

        // Permitimos volver a intentarlo si falla.
        initializingUserId.current = null;
      }
    };

    initializeGoals();
  }, [session, initializedUserId]);

  const goalsLoading =
    Boolean(session) && initializedUserId !== session?.user.id;

  if (loading || goalsLoading) {
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
