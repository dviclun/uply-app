import { ButtonVariant } from "@/theme/types";
import { ReactNode } from "react";
import { PressableProps } from "react-native";

export interface ButtonProps extends PressableProps {
  children: ReactNode;
  variant?: ButtonVariant;
  loading?: boolean;
  fullWidth?: boolean;
  flex?: number;
  compact?: boolean;
}
