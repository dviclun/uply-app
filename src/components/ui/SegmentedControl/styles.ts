import { StyleSheet } from "react-native";

import { radius, spacing, tokens } from "@/theme";

export const styles = StyleSheet.create({
  container: {
    gap: spacing.xs,
  },

  segmentContainer: {
    flexDirection: "row",

    // padding: spacing.xs,

    borderRadius: radius.md,

    backgroundColor: tokens.background.secondary,

    gap: spacing.xs,

    borderWidth: 1,
    borderColor: tokens.border.default,
  },

  option: {
    flex: 1,

    minHeight: 48,

    justifyContent: "center",
    alignItems: "center",

    borderRadius: radius.sm,
  },

  selectedOption: {
    backgroundColor: tokens.brand.primary,
  },

  pressedOption: {
    opacity: 0.8,
  },
});
