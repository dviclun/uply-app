import { Ionicons } from "@expo/vector-icons";
import { Pressable, StyleSheet, View } from "react-native";

import { Text } from "@/components/ui";
import { tokens } from "@/theme";

type AccountMenuProps = {
  visible: boolean;
  onClose: () => void;
  onSettings: () => void;
  onSignOut: () => void;
};

export function AccountMenu({
  visible,
  onClose,
  onSettings,
  onSignOut,
}: AccountMenuProps) {
  if (!visible) {
    return null;
  }

  return (
    <View style={styles.overlay}>
      <Pressable style={styles.backdrop} onPress={onClose} />

      <View style={styles.menu}>
        <Pressable style={styles.item} onPress={onSettings}>
          <Ionicons
            name="settings-outline"
            size={21}
            color={tokens.text.primary}
          />

          <Text>Ajustes</Text>
        </Pressable>

        <View style={styles.separator} />
        <Pressable style={styles.item} onPress={onSignOut}>
          <Ionicons
            name="log-out-outline"
            size={21}
            color={tokens.text.primary}
          />

          <Text>Cerrar sesión</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFill,
    zIndex: 100,
  },
  backdrop: {
    ...StyleSheet.absoluteFill,
  },
  menu: {
    position: "absolute",
    top: 52,
    right: 0,
    minWidth: 190,
    paddingVertical: 8,
    borderRadius: 14,
    backgroundColor: tokens.background.primary,
    borderWidth: 1,
    borderColor: tokens.border.default,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 6,
  },
  item: {
    minHeight: 48,
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  separator: {
    height: 1,
    marginVertical: 6,
    marginHorizontal: 12,
    backgroundColor: tokens.border.default,
  },
});
