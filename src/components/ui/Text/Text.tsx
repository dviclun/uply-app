import { Text as RNText } from "react-native";

import { textStyles, tokens } from "@/theme";

import { TextTone } from "@/theme/types";
import { TextProps } from "./types";

const toneMap: Record<TextTone, string> = {
  primary: tokens.text.primary,
  secondary: tokens.text.secondary,
  inverse: tokens.text.inverse,
  brand: tokens.text.brand,
  success: tokens.status.success.foreground,
  danger: tokens.status.danger.foreground,
  warning: tokens.status.warning.foreground,
};

export function Text({
  variant = "body",
  tone = "primary",
  textAlign,
  style,
  children,
  ...props
}: TextProps) {
  return (
    <RNText
      style={[
        textStyles[variant],
        {
          color: toneMap[tone],
          textAlign,
        },
        style,
      ]}
      {...props}
    >
      {children}
    </RNText>
  );
}
