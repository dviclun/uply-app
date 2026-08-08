import { StyleSheet, View } from "react-native";

import { colors } from "@/theme";

import { DividerProps } from "./types";

export function Divider({ style, ...props }: DividerProps) {
  return <View style={[styles.divider, style]} {...props} />;
}

const styles = StyleSheet.create({
  divider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: colors.border,
    width: "100%",
  },
});
