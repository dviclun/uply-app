import { ScrollView, StyleSheet } from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";

import { spacing, tokens } from "@/theme";

import { ScrollScreenProps } from "./types";

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: tokens.background.primary,
  },

  content: {
    flexGrow: 1,
    paddingBottom: spacing.xl,
  },
});

export function ScrollScreen({
  children,
  style,
  stickyHeaderIndices,
  onScroll,
}: ScrollScreenProps) {
  return (
    <SafeAreaView edges={["top", "left", "right"]} style={styles.safeArea}>
      <ScrollView
        contentContainerStyle={[styles.content, style]}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        stickyHeaderIndices={stickyHeaderIndices}
        onScroll={onScroll}
        scrollEventThrottle={16}
      >
        {children}
      </ScrollView>
    </SafeAreaView>
  );
}
