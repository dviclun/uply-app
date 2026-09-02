import { Card, Stack, Text } from "@/components/ui";

import { formatDate, formatTransactionType, strengthenColor } from "@/utils";

import { View } from "react-native";
import { DetailRow } from "../DetailRow";
import { TransactionDetailsCardProps } from "./types";

const NO_CATEGORY_COLOR = "#e1e3e5";

export function TransactionDetailsCard({
  transaction,
  category,
}: TransactionDetailsCardProps) {
  const categoryColor = category?.color ?? NO_CATEGORY_COLOR;
  const categoryName = category?.name ?? "Sin categoría";
  const categoryTextColor = strengthenColor(categoryColor);
  return (
    <Card>
      <Stack spacing="md">
        <DetailRow
          label="Tipo"
          value={formatTransactionType(transaction.type)}
        />

        <DetailRow
          label="Categoría"
          value={
            <View
              style={{
                backgroundColor: categoryColor,
                paddingHorizontal: 8,
                paddingVertical: 2,
                borderRadius: 6,
              }}
            >
              <Text
                variant="small"
                style={{
                  color: categoryTextColor,
                }}
              >
                {categoryName}
              </Text>
            </View>
          }
        />

        <DetailRow label="Fecha" value={formatDate(transaction.date)} />
      </Stack>
    </Card>
  );
}
