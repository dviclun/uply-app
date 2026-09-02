import {
  Container,
  EmptyState,
  ErrorState,
  FloatingActionButton,
  LoadingState,
  Screen,
  ScreenHeader,
  SegmentedControl,
  Stack,
} from "@/components/ui";

import { useFocusEffect, useLocalSearchParams } from "expo-router";

import { useCategories, useTransactions } from "@/hooks";

import { router } from "expo-router";
import { TransactionList } from "../../components/TransactionList";

import type { TransactionFilter } from "@/models";
import { spacing } from "@/theme";
import { useCallback, useState } from "react";

export function TransactionsScreen() {
  const [filter, setFilter] = useState<TransactionFilter>("all");
  const { resetFilter } = useLocalSearchParams<{
    resetFilter?: string;
  }>();

  const emptyStateContent = {
    all: {
      title: "Todavía no tienes movimientos",
      message:
        "Añade tu primer ingreso o gasto para empezar a controlar tus finanzas.",
    },
    expense: {
      title: "Todavía no tienes gastos",
      message: "Añade tu primer gasto para empezar a controlar tus finanzas.",
    },
    income: {
      title: "Todavía no tienes ingresos",
      message: "Añade tu primer ingreso para empezar a controlar tus finanzas.",
    },
  }[filter];
  useFocusEffect(
    useCallback(() => {
      if (resetFilter === "true") {
        setFilter("all");

        router.setParams({
          resetFilter: undefined,
        });
      }
    }, [resetFilter]),
  );

  const {
    data: transactions = [],
    isPending,
    isError,
    refetch,
  } = useTransactions(filter);

  const { data: categories = [] } = useCategories();

  return (
    <Screen>
      <Container flex>
        <Stack spacing="xs">
          <ScreenHeader title="Movimientos" />
        </Stack>
        <Stack spacing="sm" style={{ marginBottom: spacing.lg }}>
          <SegmentedControl
            value={filter}
            onValueChange={setFilter}
            options={[
              {
                label: "Todos",
                value: "all",
              },
              {
                label: "Gastos",
                value: "expense",
              },
              {
                label: "Ingresos",
                value: "income",
              },
            ]}
          />
        </Stack>

        {isPending ? (
          <LoadingState message="Cargando movimientos..." />
        ) : isError ? (
          <ErrorState
            message="No hemos podido cargar tus movimientos."
            onRetry={refetch}
          />
        ) : transactions.length === 0 ? (
          <EmptyState
            title={emptyStateContent.title}
            message={emptyStateContent.message}
          />
        ) : (
          <TransactionList
            transactions={transactions}
            categories={categories}
          />
        )}

        <FloatingActionButton
          onPress={() =>
            router.push({
              pathname: "/transaction/add",
              params: {
                type: filter === "income" ? "income" : "expense",
              },
            })
          }
          accessibilityLabel="Añadir nuevo movimiento"
        />
      </Container>
    </Screen>
  );
}
