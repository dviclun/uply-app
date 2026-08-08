import { PropsWithChildren } from "react";
import { StyleProp, ViewProps, ViewStyle } from "react-native";

import { Direction, Spacing } from "@/theme/types";
export interface StackProps
  extends PropsWithChildren, Omit<ViewProps, "style"> {
  spacing?: Spacing;
  direction?: Direction;

  justifyContent?: ViewStyle["justifyContent"];
  alignItems?: ViewStyle["alignItems"];
  flex?: number;

  style?: StyleProp<ViewStyle>;
}
