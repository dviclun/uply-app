import {
  BalanceCard,
  DashboardHeader,
  InsightCard,
  MonthlySummaryCard,
  RecentTransactionsCard,
  SavingGoalCard,
} from "@/components/features/dashboard";
import { Container, ScrollScreen, Stack } from "@/components/ui";

export default function HomeScreen() {
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
