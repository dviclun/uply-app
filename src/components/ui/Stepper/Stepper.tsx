import { StyleSheet, View } from "react-native";

import { colors, radius, spacing } from "@/theme";
import { Text } from "../Text";

import { StepperProps } from "./types";

export function Stepper({ currentStep, steps }: StepperProps) {
  return (
    <View style={styles.container}>
      {steps.map((label, index) => {
        const stepNumber = index + 1;
        const isActive = stepNumber === currentStep;
        const isCompleted = stepNumber < currentStep;
        const isLast = index === steps.length - 1;

        return (
          <View key={label} style={styles.stepWrapper}>
            <View style={styles.step}>
              <View
                style={[
                  styles.circle,
                  (isActive || isCompleted) && styles.activeCircle,
                ]}
              >
                <Text
                  variant="small"
                  style={[
                    styles.circleText,
                    (isActive || isCompleted) && styles.activeCircleText,
                  ]}
                >
                  {stepNumber}
                </Text>
              </View>

              <Text
                variant="small"
                style={[
                  styles.label,
                  (isActive || isCompleted) && styles.activeLabel,
                ]}
              >
                {label}
              </Text>
            </View>

            {!isLast && (
              <View style={[styles.line, isCompleted && styles.activeLine]} />
            )}
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "flex-start",
    alignSelf: "center",
  },

  stepWrapper: {
    flexDirection: "row",
    alignItems: "center",
  },

  step: {
    alignItems: "center",
    gap: spacing.xs,
  },

  circle: {
    width: 32,
    height: 32,
    borderRadius: radius.full,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.surfaceSecondary,
    borderWidth: 1,
    borderColor: colors.border,
  },

  activeCircle: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },

  circleText: {
    color: colors.textSecondary,
  },

  activeCircleText: {
    color: colors.inverse,
  },

  label: {
    color: colors.textSecondary,
  },

  activeLabel: {
    color: colors.primary,
  },

  line: {
    width: 48,
    height: 2,
    marginHorizontal: spacing.sm,
    marginTop: -spacing.lg,
    backgroundColor: colors.border,
  },

  activeLine: {
    backgroundColor: colors.primary,
  },
});
