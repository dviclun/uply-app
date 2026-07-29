import { StyleSheet } from "react-native";

import { radius, spacing, tokens } from "@/theme";

export const styles = StyleSheet.create({
  container: {
    gap: spacing.xs,
  },

  field: {
    minHeight: 48,

    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",

    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,

    borderRadius: radius.md,

    borderWidth: 1,
    borderColor: tokens.border.default,

    backgroundColor: tokens.background.secondary,
  },

  pressed: {
    opacity: 0.8,
  },
});
