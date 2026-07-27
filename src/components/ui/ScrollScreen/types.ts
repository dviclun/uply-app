import { PropsWithChildren } from "react";
import { StyleProp, ViewStyle } from "react-native";

export interface ScrollScreenProps extends PropsWithChildren {
  style?: StyleProp<ViewStyle>;
}
