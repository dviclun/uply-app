import { Pressable, View } from "react-native";

import { Icon } from "../Icon";
import { Text } from "../Text";

import { formatDateField } from "@/utils";

import { styles } from "./styles";
import { DateFieldProps } from "./types";

export function DateField({ label, value, onPress }: DateFieldProps) {
  return (
    <View style={styles.container}>
      <Text variant="bodyMedium">{label}</Text>

      <Pressable
        onPress={onPress}
        style={({ pressed }) => [styles.field, pressed && styles.pressed]}
      >
        <Text variant="body">{formatDateField(value)}</Text>

        <Icon name="calendar-outline" size="md" />
      </Pressable>
    </View>
  );
}
