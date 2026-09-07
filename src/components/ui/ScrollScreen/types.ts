import { PropsWithChildren } from "react";
import {
  NativeScrollEvent,
  NativeSyntheticEvent,
  StyleProp,
  ViewStyle,
} from "react-native";

export interface ScrollScreenProps extends PropsWithChildren {
  style?: StyleProp<ViewStyle>;
  stickyHeaderIndices?: number[];
  onScroll?: (event: NativeSyntheticEvent<NativeScrollEvent>) => void;
}
