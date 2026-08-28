import { Button, Container, ScrollScreen, Stack } from "@/components/ui";

import { useAuth } from "@/hooks";

import { BalanceCard } from "../../components/BalanceCard";
import { DashboardHeader } from "../../components/DashboardHeader";
import { InsightCard } from "../../components/InsightCard";
import { MonthlySummaryCard } from "../../components/MonthlySummaryCard";
import { RecentTransactionsCard } from "../../components/RecentTransactionsCard";
import { SavingGoalCard } from "../../components/SavingsGoalCard";

export function DashboardScreen() {
  const { signOut } = useAuth();

  return (
    <ScrollScreen>
      <Container>
        <Stack spacing="xl">
          <DashboardHeader />

          <BalanceCard />

          <InsightCard />

          <MonthlySummaryCard />

          <SavingGoalCard />

          <RecentTransactionsCard />

          <Button onPress={signOut} variant="secondary">
            Cerrar sesión
          </Button>
        </Stack>
      </Container>
    </ScrollScreen>
  );
}
