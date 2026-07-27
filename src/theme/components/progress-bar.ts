import { radius } from "../radius";
import { spacing } from "../spacing";
import { tokens } from "../tokens";

export const progressBarStyles = {
  container: {
    height: spacing.sm,
    borderRadius: radius.full,
    backgroundColor: tokens.background.secondary,
    overflow: "hidden" as const,
  },

  progress: {
    height: "100%" as const,
    borderRadius: radius.full,
    backgroundColor: tokens.brand.primary,
  },
};
