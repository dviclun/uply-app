import { useState } from "react";
import { StyleSheet, View } from "react-native";

import { Button, Card, Stack, Text } from "@/components/ui";
import { useDashboard, useUpdateBalance } from "@/hooks";
import { getLocale, Language } from "@/i18n";
import { useCurrency } from "@/providers";
import { formatCurrency } from "@/utils";
import { useTranslation } from "react-i18next";
import { BalanceAdjustmentModal } from "../BalanceAdjustmentModal";

export function BalanceCard() {
  const { data: dashboard } = useDashboard();
  const { currency } = useCurrency();
  const { i18n } = useTranslation();
  const locale = getLocale(i18n.language as Language);

  const [isModalVisible, setIsModalVisible] = useState(false);

  const updateBalance = useUpdateBalance();

  if (!dashboard) {
    return null;
  }

  const handleUpdateBalance = async (amount: number) => {
    if (amount === dashboard.balance) {
      setIsModalVisible(false);
      return;
    }

    await updateBalance.mutateAsync(amount);
    setIsModalVisible(false);
  };

  return (
    <>
      <Card>
        <Stack spacing="sm">
          <View style={styles.header}>
            <Text variant="bodyMedium" tone="secondary">
              Balance actual
            </Text>

            <Button
              variant="ghost"
              compact
              fullWidth={false}
              onPress={() => setIsModalVisible(true)}
            >
              Ajustar
            </Button>
          </View>

          <Text variant="h1">
            {formatCurrency(dashboard.balance, { currency, locale })}
          </Text>
        </Stack>
      </Card>

      <BalanceAdjustmentModal
        visible={isModalVisible}
        initialValue={dashboard.balance}
        loading={updateBalance.isPending}
        error={updateBalance.error?.message}
        onClose={() => setIsModalVisible(false)}
        onConfirm={handleUpdateBalance}
      />
    </>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
});
