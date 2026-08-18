import { Pressable, StyleSheet, View } from "react-native";

import { router } from "expo-router";

import { spacing } from "@/theme";
import { Text } from "../Text";

import { Icon } from "../Icon";
import { ScreenHeaderProps } from "./types";

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: spacing.lg,
  },

  backButton: {
    padding: spacing.xs,
    marginRight: spacing.sm,
  },

  title: {
    flex: 1,
  },
});

export function ScreenHeader({
  title,
  showBackButton = false,
}: ScreenHeaderProps) {
  return (
    <View style={styles.container}>
      {showBackButton && (
        <Pressable
          style={styles.backButton}
          onPress={() => {
            if (router.canGoBack()) {
              router.back();
            }
          }}
        >
          <Icon name="chevron-back" size="md" />
        </Pressable>
      )}

      <Text variant="h2" style={styles.title}>
        {title}
      </Text>
    </View>
  );
}
