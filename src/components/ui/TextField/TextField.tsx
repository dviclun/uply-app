import { TextInput, View } from "react-native";

import { Text } from "../Text";

import { tokens } from "@/theme";
import { useState } from "react";
import { styles } from "./styles";
import { TextFieldProps } from "./types";

export function TextField({ label, error, ...props }: TextFieldProps) {
  const { style, ...textInputProps } = props;

  const [isFocused, setIsFocused] = useState(false);
  return (
    <View style={styles.container}>
      <Text variant="bodyMedium">{label}</Text>

      <TextInput
        {...textInputProps}
        placeholderTextColor={tokens.text.secondary}
        selectionColor={tokens.brand.primary}
        style={[styles.input, isFocused && styles.focused, style]}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
      />

      {error && (
        <Text tone="danger" variant="small" style={styles.error}>
          {error}
        </Text>
      )}
    </View>
  );
}
