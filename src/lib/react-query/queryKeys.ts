export const queryKeys = {
  transactions: ["transactions"] as const,
  dashboardTransactions: ["dashboard-transactions"] as const,
  transaction: (id: string) => ["transactions", id] as const,
};
