import { View } from "react-native";

import { progressBarStyles } from "@/theme";
import { ProgressBarProps } from "./types";

export function ProgressBar({ value, style }: ProgressBarProps) {
  const progress = Math.min(Math.max(value, 0), 100);

  return (
    <View style={[progressBarStyles.container, style]}>
      <View
        style={[
          progressBarStyles.progress,
          {
            width: `${progress}%`,
          },
        ]}
      />
    </View>
  );
}
