import { Pressable, StyleSheet } from "react-native";

import { Text } from "../Text";

import { buttonStyles } from "@/theme";
import { ButtonProps } from "./types";

export function Button({
  children,
  variant = "primary",
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
        buttonStyles.base.container,
        buttonStyles[variant].container,

        pressed && styles.pressed,
        disabled && styles.disabled,

        style,
      ]}
      {...props}
    >
      <Text
        variant={buttonStyles.base.text.variant}
        tone={buttonStyles[variant].text.tone}
      >
        {children}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  pressable: {},

  pressed: {
    opacity: 0.9,
  },

  disabled: {
    opacity: 0.5,
  },
});
