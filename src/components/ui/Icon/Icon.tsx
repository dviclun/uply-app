import { Ionicons } from "@expo/vector-icons";

import { tokens } from "@/theme";

import { IconProps } from "./types";

const ICON_SIZES = {
  sm: 18,
  md: 24,
  lg: 32,
};

export function Icon({
  name,
  size = "md",
  color = tokens.text.primary,
}: IconProps) {
  return <Ionicons name={name} size={ICON_SIZES[size]} color={color} />;
}
