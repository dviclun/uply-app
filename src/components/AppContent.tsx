import { Stack } from "expo-router";
import { useCallback, useEffect, useRef, useState } from "react";

import { AuthDeepLinkHandler } from "@/features/auth";
import { useAuth } from "@/hooks";
import { ToastProvider } from "@/providers";
import { SavingsGoalRepository } from "@/repositories";
import { ErrorState, LoadingScreen } from "./ui";

const savingsGoalRepository = new SavingsGoalRepository();

export function AppContent() {
  const { session, loading } = useAuth();

  const [initializedUserId, setInitializedUserId] = useState<string | null>(
    null,
  );

  const [initializationError, setInitializationError] = useState<Error | null>(
    null,
  );

  const initializingUserId = useRef<string | null>(null);

  const initializeGoals = useCallback(async (userId: string) => {
    if (initializingUserId.current === userId) {
      return;
    }

    initializingUserId.current = userId;
    setInitializationError(null);

    try {
      await savingsGoalRepository.initializeGoals();

      setInitializedUserId(userId);
    } catch (error) {
      console.error("SAVINGS GOALS INITIALIZATION ERROR:", error);

      initializingUserId.current = null;

      setInitializationError(
        error instanceof Error
          ? error
          : new Error("No se ha podido inicializar la aplicación."),
      );
    }
  }, []);

  useEffect(() => {
    if (loading) {
      return;
    }

    if (!session) {
      initializingUserId.current = null;
      setInitializedUserId(null);
      setInitializationError(null);
      return;
    }

    const userId = session.user.id;

    if (initializedUserId === userId) {
      return;
    }

    initializeGoals(userId);
  }, [loading, session, initializedUserId, initializeGoals]);

  const goalsLoading =
    Boolean(session) && initializedUserId !== session?.user.id;

  const handleInitializationRetry = () => {
    if (!session) {
      return;
    }

    initializeGoals(session.user.id);
  };

  if (loading) {
    return <LoadingScreen message="Inicializando aplicación..." />;
  }

  if (initializationError) {
    return (
      <ErrorState
        message="No hemos podido preparar tu espacio."
        onRetry={handleInitializationRetry}
      />
    );
  }

  if (goalsLoading) {
    return <LoadingScreen message="Preparando tu espacio..." />;
  }

  return (
    <ToastProvider>
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
    </ToastProvider>
  );
}
