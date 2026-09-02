import { router } from "expo-router";
import { Pressable, StyleSheet, View } from "react-native";

import { Text } from "@/components/ui";

import { formatCurrency, formatDate, strengthenColor } from "@/utils";
import { TransactionItemProps } from "./types";

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  left: {
    flex: 1,
  },

  pressed: {
    opacity: 0.7,
  },
});

export function TransactionItem({
  transaction,
  category,
  ...props
}: TransactionItemProps) {
  const amountTone = transaction.type === "income" ? "success" : "danger";
  const signedAmount =
    transaction.type === "expense" ? -transaction.amount : transaction.amount;

  const amount = formatCurrency(signedAmount, {
    showSign: true,
  });
  const date = formatDate(transaction.date);
  return (
    <Pressable
      style={({ pressed }) => [styles.container, pressed && styles.pressed]}
      onPress={() => router.push(`/transaction/${transaction.id}`)}
      {...props}
    >
      <View style={styles.left}>
        <Text variant="bodyMedium">{transaction.title}</Text>

        {category && (
          <Text
            variant="small"
            style={{
              color: strengthenColor(category.color),
            }}
          >
            {category.name}
          </Text>
        )}
        <Text variant="caption" tone="secondary">
          {date}
        </Text>
      </View>

      <Text variant="bodyMedium" tone={amountTone}>
        {amount}
      </Text>
    </Pressable>
  );
}
