import { Stack } from "expo-router";
import { useCallback, useEffect, useRef, useState } from "react";

import { AuthDeepLinkHandler } from "@/features/auth";
import { useAuth } from "@/hooks";
import { CurrencyProvider, ToastProvider } from "@/providers";
import { SavingsGoalRepository } from "@/repositories";
import { ErrorState, LoadingScreen } from "./ui";

import { initializeI18n } from "@/i18n";

const savingsGoalRepository = new SavingsGoalRepository();

export function AppContent() {
  const { session, loading, passwordRecoveryActive, authDeepLinkReady } =
    useAuth();

  const [initializedUserId, setInitializedUserId] = useState<string | null>(
    null,
  );

  const [i18nReady, setI18nReady] = useState(false);

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
    let mounted = true;

    const initialize = async () => {
      try {
        await initializeI18n();

        if (mounted) {
          setI18nReady(true);
        }
      } catch (error) {
        console.error("I18N INITIALIZATION ERROR:", error);

        if (mounted) {
          setI18nReady(true);
        }
      }
    };

    initialize();

    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    if (loading || !authDeepLinkReady) {
      return;
    }

    if (!session) {
      initializingUserId.current = null;
      setInitializedUserId(null);
      setInitializationError(null);

      return;
    }

    if (passwordRecoveryActive) {
      return;
    }

    const userId = session.user.id;

    if (initializedUserId === userId) {
      return;
    }

    initializeGoals(userId);
  }, [
    loading,
    authDeepLinkReady,
    session,
    passwordRecoveryActive,
    initializedUserId,
    initializeGoals,
  ]);

  const goalsLoading =
    Boolean(session) &&
    !passwordRecoveryActive &&
    initializedUserId !== session?.user.id;

  const handleInitializationRetry = () => {
    if (!session) {
      return;
    }

    initializeGoals(session.user.id);
  };

  const isRecoveryFlow = passwordRecoveryActive;

  return (
    <ToastProvider>
      <CurrencyProvider>
        <AuthDeepLinkHandler />

        {i18nReady === false || loading || !authDeepLinkReady ? (
          <LoadingScreen message="" />
        ) : initializationError ? (
          <ErrorState
            message="No hemos podido preparar tu espacio."
            onRetry={handleInitializationRetry}
          />
        ) : goalsLoading && !isRecoveryFlow ? (
          <LoadingScreen message="Preparando tu espacio..." />
        ) : (
          <Stack screenOptions={{ headerShown: false }}>
            <Stack.Protected guard={!session && !isRecoveryFlow}>
              <Stack.Screen name="(auth)" />
            </Stack.Protected>

            <Stack.Protected guard={!!session && !isRecoveryFlow}>
              <Stack.Screen name="(app)" />
            </Stack.Protected>

            <Stack.Screen name="auth/callback" />
            <Stack.Screen name="auth/reset-password" />
          </Stack>
        )}
      </CurrencyProvider>
    </ToastProvider>
  );
}
