import { spacing } from "@/theme";
import { StyleSheet, View } from "react-native";

import { Button } from "../Button";
import { Text } from "../Text";

type ErrorStateProps = {
  title?: string;
  message?: string;
  onRetry?: () => void;
  retryLabel?: string;
};

export function ErrorState({
  title = "Algo ha salido mal",
  message = "No hemos podido cargar la información.",
  onRetry,
  retryLabel = "Reintentar",
}: ErrorStateProps) {
  return (
    <View style={styles.container}>
      <Text variant="h3" textAlign="center">
        {title}
      </Text>

      <Text tone="secondary" textAlign="center">
        {message}
      </Text>

      {onRetry && <Button onPress={onRetry}>{retryLabel}</Button>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: spacing.md,
    paddingHorizontal: spacing.xl,
  },
});
