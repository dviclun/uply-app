import { ActivityIndicator, Pressable, StyleSheet } from "react-native";

import { Text } from "../Text";

import { buttonStyles } from "@/theme";
import { ButtonProps } from "./types";

export function Button({
  children,
  variant = "primary",
  fullWidth = true,
  compact = false,
  flex,
  style,
  disabled,
  loading,
  ...props
}: ButtonProps) {
  return (
    <Pressable
      disabled={disabled || loading}
      style={({ pressed }) => [
        styles.pressable,
        fullWidth && styles.fullWidth,
        flex !== undefined && { flex },

        buttonStyles.base.container,
        buttonStyles[variant].container,

        compact && styles.compact,

        pressed && styles.pressed,
        disabled && styles.disabled,

        style,
      ]}
      {...props}
    >
      {loading ? (
        <ActivityIndicator
          size="small"
          color={buttonStyles[variant].loadingColor}
        />
      ) : (
        <Text
          variant={buttonStyles.base.text.variant}
          tone={buttonStyles[variant].text.tone}
          style={{ textAlign: "center" }}
        >
          {children}
        </Text>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  pressable: {},

  fullWidth: {
    width: "100%",
  },

  pressed: {
    opacity: 0.9,
  },

  disabled: {
    opacity: 0.5,
  },
  compact: {
    minHeight: 0,
    paddingVertical: 0,
    paddingHorizontal: 0,
  },
});
