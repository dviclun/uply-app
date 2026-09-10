import { StyleSheet, View } from "react-native";

import { IconButton, Text } from "@/components/ui";
import { spacing } from "@/theme";
import { AccountMenu } from "../AccountMenu";

type DashboardHeaderProps = {
  menuVisible: boolean;
  onMenuPress: () => void;
  onSignOut: () => void;
  onSettings: () => void;
};

export function DashboardHeader({
  menuVisible,
  onMenuPress,
  onSignOut,
  onSettings,
}: DashboardHeaderProps) {
  return (
    <>
      <View style={styles.container}>
        <View style={styles.textContainer}>
          <Text variant="h1" style={{ paddingBottom: spacing.md }}>
            Hola 👋
          </Text>

          <Text tone="secondary">Este es tu resumen de hoy</Text>
        </View>

        <IconButton
          name={menuVisible ? "close" : "menu"}
          onPress={onMenuPress}
          accessibilityLabel={menuVisible ? "Cerrar menú" : "Abrir menú"}
        />
      </View>

      <AccountMenu
        visible={menuVisible}
        onClose={onMenuPress}
        onSettings={onSettings}
        onSignOut={onSignOut}
      />
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  textContainer: {
    flex: 1,
  },
});
