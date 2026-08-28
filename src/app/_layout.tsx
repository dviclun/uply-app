import { QueryClientProvider } from "@tanstack/react-query";

import { useAppFonts } from "@/hooks";
import { queryClient } from "@/lib/react-query";

import { AppContent } from "@/components/AppContent";
import { AuthProvider } from "@/providers";

export default function RootLayout() {
  const [fontsLoaded] = useAppFonts();

  if (!fontsLoaded) {
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
