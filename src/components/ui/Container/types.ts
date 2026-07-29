import { PropsWithChildren } from "react";
import { StyleProp, ViewProps, ViewStyle } from "react-native";

import { Spacing } from "@/theme/types";

export interface ContainerProps
  extends PropsWithChildren, Omit<ViewProps, "style"> {
  padding?: Spacing;
  paddingTop?: Spacing;
  style?: StyleProp<ViewStyle>;
  flex?: boolean;
}
