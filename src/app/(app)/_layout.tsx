import { Stack } from "expo-router";

import { ErrorState, LoadingScreen } from "@/components/ui";
import { useDashboardData } from "@/hooks";

export default function AppLayout() {
  const { isInitialLoading, isError, retry } = useDashboardData();

  if (isInitialLoading) {
    return <LoadingScreen message="Preparando tu espacio..." />;
  }

  if (isError) {
    return (
      <ErrorState
        message="No hemos podido preparar tu espacio."
        onRetry={retry}
      />
    );
  }

  return <Stack screenOptions={{ headerShown: false }} />;
}
