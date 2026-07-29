import { StyleSheet } from "react-native";

import { radius, spacing, tokens } from "@/theme";

export const styles = StyleSheet.create({
  container: {
    gap: spacing.xs,
  },

  input: {
    minHeight: 48,

    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,

    borderRadius: radius.md,

    borderWidth: 1,
    borderColor: tokens.border.default,

    backgroundColor: tokens.background.secondary,
  },

  error: {
    marginTop: spacing.xs,
  },

  focused: {
    borderColor: tokens.brand.primary,
  },
});
