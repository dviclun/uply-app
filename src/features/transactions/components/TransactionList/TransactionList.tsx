import { FlatList } from "react-native";

import { View } from "react-native";

import { TransactionListProps } from "./types";

import { spacing } from "@/theme";
import { TransactionItem } from "../TransactionItem";

export function TransactionList({ transactions }: TransactionListProps) {
  return (
    <FlatList
      data={transactions}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => <TransactionItem transaction={item} />}
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
