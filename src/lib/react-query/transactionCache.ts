import type { QueryClient } from "@tanstack/react-query";

import type { Transaction, TransactionFilter } from "@/models";
import { queryKeys } from "./queryKeys";

export function updateTransactionsCache(
  queryClient: QueryClient,
  userId: string,
  transaction: Transaction,
) {
  const filters: TransactionFilter[] = ["all", "expense", "income"];

  filters.forEach((filter) => {
    queryClient.setQueryData<Transaction[]>(
      queryKeys.transactions(userId, filter),
      (currentTransactions) => {
        if (!currentTransactions) {
          return currentTransactions;
        }

        const shouldBeInFilter =
          filter === "all" || transaction.type === filter;

        const existingIndex = currentTransactions.findIndex(
          (item) => item.id === transaction.id,
        );

        if (!shouldBeInFilter) {
          if (existingIndex === -1) {
            return currentTransactions;
          }

          return currentTransactions.filter(
            (item) => item.id !== transaction.id,
          );
        }

        if (existingIndex === -1) {
          return [transaction, ...currentTransactions];
        }

        return currentTransactions.map((item) =>
          item.id === transaction.id ? transaction : item,
        );
      },
    );
  });
}
