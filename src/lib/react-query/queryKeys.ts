export const queryKeys = {
  dashboard: ["dashboard"] as const,
  transactions: ["transactions"] as const,
  dashboardTransactions: ["dashboard-transactions"] as const,
  transaction: (id: string) => ["transactions", id] as const,
};
