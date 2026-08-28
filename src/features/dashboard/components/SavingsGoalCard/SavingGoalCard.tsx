import {
  Button,
  Card,
  ConfirmationModal,
  ProgressBar,
  Stack,
  Text,
} from "@/components/ui";
import { Divider } from "@/components/ui/Divider";
import { useDashboard, useSavingsGoal } from "@/hooks";
import { useToast } from "@/providers";
import { capitalize, formatCurrency, formatSavingsGoalPeriod } from "@/utils";
import { useState } from "react";
import { SavingsGoalModal } from "../SavingsGoalModal/SavingsGoalModal";

export function SavingGoalCard() {
  const { data, createFirstGoal, updateNextGoalTarget } = useSavingsGoal();
  const { data: dashboard } = useDashboard();
  const { showToast } = useToast();

  const [modalMode, setModalMode] = useState<"create" | "edit" | null>(null);
  const [confirmationVisible, setConfirmationVisible] = useState(false);
  const [pendingTarget, setPendingTarget] = useState<number | null>(null);
  const [confirmationError, setConfirmationError] = useState<string | null>(
    null,
  );
  const [goalError, setGoalError] = useState<string | null>(null);

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

          <Button onPress={handleOpenCreateModal}>Crear objetivo</Button>
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
              onPress={() => {
                setGoalError(null);
                setModalMode("edit");
              }}
              fullWidth={false}
            >
              Modificar
            </Button>
          </Stack>
        </Stack>
      </Card>
    );
  }

  function handleOpenCreateModal() {
    setConfirmationError(null);
    setGoalError(null);
    setPendingTarget(null);
    setModalMode("create");
  }

  const handleCloseGoalModal = () => {
    if (createFirstGoal.isPending || updateNextGoalTarget.isPending) {
      return;
    }

    setModalMode(null);
    setGoalError(null);
  };

  const handleGoalConfirm = async (target: number) => {
    if (modalMode === "create") {
      setPendingTarget(target);
      setConfirmationError(null);
      setConfirmationVisible(true);

      return;
    }

    setGoalError(null);

    try {
      await updateNextGoalTarget.mutateAsync(target);

      showToast({
        message: "Objetivo actualizado correctamente.",
        variant: "success",
      });

      setModalMode(null);
    } catch (error) {
      console.error("SAVINGS GOAL UPDATE ERROR:", error);

      setGoalError(
        "No se ha podido actualizar el objetivo. Inténtalo de nuevo.",
      );
    }
  };

  const handleCloseConfirmation = () => {
    if (createFirstGoal.isPending) {
      return;
    }

    setConfirmationVisible(false);
    setConfirmationError(null);
    setPendingTarget(null);
  };

  const handleConfirmCreation = async () => {
    if (pendingTarget === null) {
      return;
    }

    setConfirmationError(null);

    try {
      await createFirstGoal.mutateAsync(pendingTarget);

      showToast({
        message: "Objetivo creado correctamente.",
        variant: "success",
      });

      setConfirmationVisible(false);
      setPendingTarget(null);
      setModalMode(null);
    } catch (error) {
      console.error("SAVINGS GOAL CREATION ERROR:", error);

      setConfirmationError(
        "No se ha podido crear el objetivo. Inténtalo de nuevo.",
      );
    }
  };

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
        onClose={handleCloseGoalModal}
        onConfirm={handleGoalConfirm}
        error={modalMode === "edit" ? goalError : null}
        loading={
          modalMode === "create" ? false : updateNextGoalTarget.isPending
        }
      />

      <ConfirmationModal
        visible={confirmationVisible}
        title="Confirmar creación"
        message="Una vez crees tu primer objetivo, solo podrás modificar el objetivo del próximo mes. ¿Estás seguro de que quieres continuar?"
        confirmText="Crear objetivo"
        loading={createFirstGoal.isPending}
        error={confirmationError}
        onClose={handleCloseConfirmation}
        onConfirm={handleConfirmCreation}
      />
    </>
  );
}
