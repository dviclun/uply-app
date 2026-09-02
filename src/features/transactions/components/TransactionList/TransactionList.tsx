import { FlatList, View } from "react-native";

import { spacing } from "@/theme";

import { TransactionItem } from "../TransactionItem";
import { TransactionListProps } from "./types";

export function TransactionList({
  transactions,
  categories,
}: TransactionListProps) {
  return (
    <FlatList
      data={transactions}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => {
        const category = item.categoryId
          ? categories.find((category) => category.id === item.categoryId)
          : undefined;

        return <TransactionItem transaction={item} category={category} />;
      }}
      ItemSeparatorComponent={() => (
        <View
          style={{
            height: spacing.md,
          }}
        />
      )}
      contentContainerStyle={{
        paddingBottom: spacing.xl,
      }}
    />
  );
}
