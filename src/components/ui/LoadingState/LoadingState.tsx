import { ActivityIndicator, StyleSheet, View } from "react-native";

import { spacing } from "@/theme";
import { Text } from "../Text";

type LoadingStateProps = {
  message: string;
};

export function LoadingState({ message }: LoadingStateProps) {
  return (
    <View style={styles.container}>
      <ActivityIndicator size="small" />

      <Text tone="secondary" textAlign="center">
        {message}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: spacing.md,
  },
});
