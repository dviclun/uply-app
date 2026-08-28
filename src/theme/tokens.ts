import { colors } from "./colors";

export const tokens = {
  text: {
    primary: colors.text,
    secondary: colors.textSecondary,
    inverse: colors.inverse,
    brand: colors.primary,
  },

  background: {
    primary: colors.background,
    surface: colors.surface,
    secondary: colors.surfaceSecondary,
  },

  border: {
    default: colors.border,
  },

  status: {
    success: {
      foreground: colors.success,
      background: colors.successBackground,
    },
    danger: {
      foreground: colors.danger,
      background: colors.dangerBackground,
    },
    warning: {
      foreground: colors.warning,
      background: colors.warningBackground,
    },
  },

  brand: {
    primary: colors.primary,
    secondary: colors.secondary,
  },
};
