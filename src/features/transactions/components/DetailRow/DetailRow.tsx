import { View } from "react-native";

import { Text } from "@/components/ui";

import { DetailRowProps } from "./types";

export function DetailRow({ label, value }: DetailRowProps) {
  return (
    <View
      style={{
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      <Text tone="secondary">{label}</Text>

      <Text variant="bodyMedium">{value}</Text>
    </View>
  );
}
