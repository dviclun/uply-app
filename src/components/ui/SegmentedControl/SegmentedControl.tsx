import { Pressable, View } from "react-native";

import { Text } from "../Text";

import { styles } from "./styles";
import { SegmentedControlProps } from "./types";

export function SegmentedControl<T extends string>({
  label,
  options,
  value,
  onValueChange,
}: SegmentedControlProps<T>) {
  return (
    <View style={styles.container}>
      {label && <Text variant="bodyMedium">{label}</Text>}

      <View style={styles.segmentContainer}>
        {options.map((option) => {
          const isSelected = option.value === value;

          return (
            <Pressable
              key={option.value}
              onPress={() => onValueChange(option.value)}
              style={({ pressed }) => [
                styles.option,
                isSelected && styles.selectedOption,
                pressed && !isSelected && styles.pressedOption,
              ]}
            >
              <Text
                variant="bodyMedium"
                tone={isSelected ? "inverse" : "primary"}
              >
                {option.label}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}
