import { Container, ScrollScreen, Stack } from "@/components/ui";
import { BalanceCard } from "../../components/BalanceCard";
import { DashboardHeader } from "../../components/DashboardHeader";
import { InsightCard } from "../../components/InsightCard";
import { MonthlySummaryCard } from "../../components/MonthlySummaryCard";
import { RecentTransactionsCard } from "../../components/RecentTransactionsCard";
import { SavingGoalCard } from "../../components/SavingsGoalCard";

export function DashboardScreen() {
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
        </Stack>
      </Container>
    </ScrollScreen>
  );
}
