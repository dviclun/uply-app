import { StyleSheet, View } from "react-native";

import { spacing } from "@/theme";

import { StackProps } from "./types";

export function Stack({
  children,
  spacing: spacingSize = "md",
  direction = "column",
  justifyContent,
  alignItems,
  flex,
  style,
  ...props
}: StackProps) {
  return (
    <View
      style={[
        styles.container,
        {
          flexDirection: direction,
          gap: spacing[spacingSize],
          justifyContent,
          alignItems,
          flex,
        },
        style,
      ]}
      {...props}
    >
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "column",
  },
});
