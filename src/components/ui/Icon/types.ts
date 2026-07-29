import { Ionicons } from "@expo/vector-icons";
import type { ComponentProps } from "react";

type IoniconsProps = ComponentProps<typeof Ionicons>;

export type IconName = IoniconsProps["name"];

export interface IconProps extends Omit<IoniconsProps, "size"> {
  size?: "sm" | "md" | "lg";
}
