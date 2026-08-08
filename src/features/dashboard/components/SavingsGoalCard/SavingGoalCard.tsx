import { Button, Card, ProgressBar, Stack, Text } from "@/components/ui";
import { Divider } from "@/components/ui/Divider";
import { useDashboard, useSavingsGoal } from "@/hooks";
import { capitalize, formatCurrency, formatSavingsGoalPeriod } from "@/utils";
import { useState } from "react";
import { SavingsGoalModal } from "../SavingsGoalModal/SavingsGoalModal";

export function SavingGoalCard() {
  const { data, createFirstGoal, updateNextGoalTarget } = useSavingsGoal();
  const { data: dashboard } = useDashboard();
  const [modalMode, setModalMode] = useState<"create" | "edit" | null>(null);

  if (!dashboard) {
    return null;
  }

  if (!data) {
    return null;
  }

  let content: React.ReactNode;

  if (!data.hasGoals) {
    content = (
      <Card>
        <Stack spacing="md">
          <Text variant="bodyMedium">Objetivo de ahorro</Text>

          <Text tone="secondary">
            Todavía no has creado tu primer objetivo de ahorro.
          </Text>

          <Button onPress={() => setModalMode("create")}>Crear objetivo</Button>
        </Stack>
      </Card>
    );
  } else {
    if (!data.currentGoal || !data.nextGoal) {
      return null;
    }

    const progress =
      dashboard.savingsGoal.target > 0
        ? Math.min(
            (dashboard.savingsGoal.current / dashboard.savingsGoal.target) *
              100,
            100,
          )
        : 0;

    const remaining =
      dashboard.savingsGoal.target - dashboard.savingsGoal.current;

    content = (
      <Card>
        <Stack spacing="md">
          <Stack spacing="xs">
            <Text variant="bodyMedium">Objetivo de ahorro</Text>

            <Text tone="secondary">
              {capitalize(formatSavingsGoalPeriod(data.currentGoal.period))}
            </Text>
          </Stack>

          <Text variant="h3">
            {formatCurrency(dashboard.savingsGoal.current, {
              decimals: false,
              showSign: dashboard.savingsGoal.current < 0,
            })}
            {" de "}
            {formatCurrency(dashboard.savingsGoal.target, {
              decimals: false,
            })}
          </Text>

          <ProgressBar value={progress} />

          <Text tone="secondary">
            {remaining > 0
              ? `Te quedan ${formatCurrency(remaining, {
                  decimals: false,
                })} para conseguirlo 💪`
              : `¡Estás superando tu objetivo, sigue así! 🎉`}
          </Text>

          <Divider />

          <Stack spacing="xs" direction="row" alignItems="center">
            <Stack spacing="xs" flex={1}>
              <Text variant="bodyMedium">Próximo objetivo</Text>

              <Text tone="secondary">
                {capitalize(formatSavingsGoalPeriod(data.nextGoal.period))}
              </Text>

              <Text variant="h4">
                {formatCurrency(data.nextGoal.target, {
                  decimals: false,
                })}
              </Text>
            </Stack>
            <Button
              variant="secondary"
              onPress={() => setModalMode("edit")}
              fullWidth={false}
            >
              Modificar
            </Button>
          </Stack>
        </Stack>
      </Card>
    );
  }

  return (
    <>
      {content}

      <SavingsGoalModal
        visible={modalMode !== null}
        title={
          modalMode === "create"
            ? "Crear objetivo de ahorro"
            : "Modificar objetivo"
        }
        initialValue={
          modalMode === "create" ? 500 : (data.nextGoal?.target ?? 500)
        }
        confirmText={modalMode === "create" ? "Crear" : "Guardar"}
        onClose={() => setModalMode(null)}
        onConfirm={(target) => {
          if (modalMode === "create") {
            createFirstGoal.mutate(target);
            return;
          }
          updateNextGoalTarget.mutate(target);
        }}
        loading={
          modalMode === "create"
            ? createFirstGoal.isPending
            : updateNextGoalTarget.isPending
        }
      />
    </>
  );
}
