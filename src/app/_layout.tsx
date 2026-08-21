import { useEffect, useState } from "react";

import { QueryClientProvider } from "@tanstack/react-query";

import { useAppFonts } from "@/hooks";
import { initializeApp } from "@/lib/app/app";
import { queryClient } from "@/lib/react-query";

import { AuthProvider } from "@/features/auth";

import { AppContent } from "@/components/AppContent";

export default function RootLayout() {
  const [fontsLoaded] = useAppFonts();
  const [databaseReady, setDatabaseReady] = useState(false);

  useEffect(() => {
    async function initialize() {
      await initializeApp();

      setDatabaseReady(true);
    }

    initialize();
  }, []);

  if (!fontsLoaded || !databaseReady) {
    return null;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </QueryClientProvider>
  );
}
