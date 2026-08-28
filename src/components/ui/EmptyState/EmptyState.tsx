import { StyleSheet, View } from "react-native";

import { Text } from "../Text";

import { spacing } from "@/theme";

type EmptyStateProps = {
  title?: string;
  message: string;
  action?: React.ReactNode;
};

export function EmptyState({ title, message, action }: EmptyStateProps) {
  return (
    <View style={styles.container}>
      {title && (
        <Text variant="h3" textAlign="center">
          {title}
        </Text>
      )}

      <Text tone="secondary" textAlign="center">
        {message}
      </Text>

      {action}
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
