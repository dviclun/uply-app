import { Stack } from "expo-router";
import { useEffect, useState } from "react";

import { QueryClientProvider } from "@tanstack/react-query";

import { useAppFonts } from "@/hooks";
import { initializeDatabase } from "@/lib/database";
import { queryClient } from "@/lib/react-query";

export default function RootLayout() {
  const [fontsLoaded] = useAppFonts();
  const [databaseReady, setDatabaseReady] = useState(false);

  useEffect(() => {
    async function initialize() {
      await initializeDatabase();
      setDatabaseReady(true);
    }

    initialize();
  }, []);

  if (!fontsLoaded || !databaseReady) {
    return null;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <Stack screenOptions={{ headerShown: false }} />
    </QueryClientProvider>
  );
}
