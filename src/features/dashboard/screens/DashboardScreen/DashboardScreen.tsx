import { useState } from "react";

import {
  ConfirmationModal,
  Container,
  ScrollScreen,
  Stack,
} from "@/components/ui";

import { useAuth } from "@/providers";
import { BalanceCard } from "../../components/BalanceCard";
import { DashboardHeader } from "../../components/DashboardHeader";
import { InsightCard } from "../../components/InsightCard";
import { MonthlySummaryCard } from "../../components/MonthlySummaryCard";
import { RecentTransactionsCard } from "../../components/RecentTransactionsCard";
import { SavingGoalCard } from "../../components/SavingsGoalCard";

export function DashboardScreen() {
  const [menuVisible, setMenuVisible] = useState(false);
  const [logoutModalVisible, setLogoutModalVisible] = useState(false);
  const [logoutLoading, setLogoutLoading] = useState(false);
  const [logoutError, setLogoutError] = useState<string | null>(null);

  const { signOut } = useAuth();

  const handleSignOutPress = () => {
    setMenuVisible(false);
    setLogoutError(null);
    setLogoutModalVisible(true);
  };

  const handleSignOutConfirm = async () => {
    try {
      setLogoutLoading(true);
      setLogoutError(null);

      await signOut();

      setLogoutModalVisible(false);
    } catch (error) {
      console.error("SIGN OUT ERROR:", error);

      setLogoutError(
        error instanceof Error
          ? error.message
          : "No se ha podido cerrar la sesión.",
      );
    } finally {
      setLogoutLoading(false);
    }
  };

  const handleLogoutModalClose = () => {
    if (logoutLoading) return;

    setLogoutModalVisible(false);
    setLogoutError(null);
  };

  return (
    <>
      <ScrollScreen>
        <Container>
          <Stack spacing="xl">
            <DashboardHeader
              menuVisible={menuVisible}
              onMenuPress={() => setMenuVisible((visible) => !visible)}
              onSignOut={handleSignOutPress}
            />

            <BalanceCard />

            <InsightCard />

            <MonthlySummaryCard />

            <SavingGoalCard />

            <RecentTransactionsCard />
          </Stack>
        </Container>
      </ScrollScreen>

      <ConfirmationModal
        visible={logoutModalVisible}
        title="Cerrar sesión"
        message="¿Estás seguro de que quieres cerrar sesión?"
        confirmText="Salir"
        loading={logoutLoading}
        error={logoutError ?? undefined}
        onClose={handleLogoutModalClose}
        onConfirm={handleSignOutConfirm}
      />
    </>
  );
}
