export interface SavingsGoal {
  current: number;
  target: number;
}

export interface MonthlySummary {
  income: number;
  expense: number;
}

export interface Insight {
  title: string;
  message: string;
}

export interface Dashboard {
  balance: number;
  monthlySummary: MonthlySummary;
  savingsGoal: SavingsGoal;
  insight: Insight;
}
