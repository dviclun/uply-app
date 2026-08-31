export const queryKeys = {
  dashboard: (userId: string) => ["dashboard", userId] as const,

  transactions: (userId: string) => ["transactions", userId] as const,

  dashboardTransactions: (userId: string) =>
    ["dashboard-transactions", userId] as const,

  transaction: (userId: string, id: string) =>
    ["transactions", userId, id] as const,

  savingsGoal: (userId: string) => ["savings-goal", userId] as const,
  categories: () => ["categories"] as const,
};
