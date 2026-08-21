import { Button, Container, ScrollScreen, Stack } from "@/components/ui";
import { useAuth } from "@/hooks";
import { BalanceCard } from "../../components/BalanceCard";
import { DashboardHeader } from "../../components/DashboardHeader";
import { InsightCard } from "../../components/InsightCard";
import { MonthlySummaryCard } from "../../components/MonthlySummaryCard";
import { RecentTransactionsCard } from "../../components/RecentTransactionsCard";
import { SavingGoalCard } from "../../components/SavingsGoalCard";

export function DashboardScreen() {
  const { user, loading, signOut } = useAuth();

  console.log("AUTH:", {
    loading,
    userId: user?.id,
    email: user?.email,
  });
  return (
    <ScrollScreen>
      <Container>
        <Stack spacing="xl">
          {/* Header */}
          <DashboardHeader />

          {/* Balance */}
          <BalanceCard />

          {/* Insight */}
          <InsightCard />

          {/* Monthly Summary */}
          <MonthlySummaryCard />

          {/* Savings Goal */}
          <SavingGoalCard />

          {/* Recent Expenses */}
          <RecentTransactionsCard />

          <Button onPress={signOut}>Cerrar sesión</Button>
        </Stack>
      </Container>
    </ScrollScreen>
  );
}
