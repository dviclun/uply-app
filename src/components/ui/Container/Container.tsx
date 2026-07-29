import { StyleSheet, View } from "react-native";

import { spacing } from "@/theme";

import { ContainerProps } from "./types";

const styles = StyleSheet.create({
  container: {
    width: "100%",
  },
});

export function Container({
  children,
  padding = "md",
  paddingTop = "lg",
  flex = false,
  style,
  ...props
}: ContainerProps) {
  return (
    <View
      style={[
        styles.container,
        {
          flex: flex ? 1 : undefined,
          paddingHorizontal: spacing[padding],
          paddingTop: spacing[paddingTop],
        },
        style,
      ]}
      {...props}
    >
      {children}
    </View>
  );
}
