import { StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { tokens } from "@/theme";

import { ScreenProps } from "./types";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: tokens.background.primary,
  },
});

export function Screen({ children, style }: ScreenProps) {
  return (
    <SafeAreaView
      edges={["top", "left", "right"]}
      style={[styles.container, style]}
    >
      {children}
    </SafeAreaView>
  );
}
