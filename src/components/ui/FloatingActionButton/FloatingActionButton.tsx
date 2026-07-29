import { Pressable, StyleSheet } from "react-native";

import { shadows, spacing, tokens } from "@/theme";

import { Icon } from "../Icon";
import { FloatingActionButtonProps } from "./types";

const styles = StyleSheet.create({
  button: {
    ...shadows.sm,
    position: "absolute",

    right: spacing.lg,
    bottom: spacing.lg,

    width: 60,
    height: 60,
    borderRadius: 30,

    justifyContent: "center",
    alignItems: "center",

    backgroundColor: tokens.background.primary,
  },
  buttonPressed: {
    transform: [
      {
        scale: 0.96,
      },
    ],
  },
});

export function FloatingActionButton({
  onPress,
  icon = "add",
  accessibilityLabel,
}: FloatingActionButtonProps) {
  return (
    <Pressable
      style={({ pressed }) => [styles.button, pressed && styles.buttonPressed]}
      onPress={onPress}
      hitSlop={12}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
    >
      <Icon name={icon} size="lg" color={tokens.text.secondary} />
    </Pressable>
  );
}
