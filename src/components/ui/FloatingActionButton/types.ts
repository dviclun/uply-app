import type { IconName } from "../Icon";

export interface FloatingActionButtonProps {
  onPress: () => void;
  icon?: IconName;
  accessibilityLabel?: string;
}
