import { useEffect, useRef } from "react";
import { Animated, Easing, StyleSheet } from "react-native";

import { tokens } from "@/theme";
import { Screen } from "../Screen";
import { Text } from "../Text";

type LoadingScreenProps = {
  message: string;
};

export function LoadingScreen({ message }: LoadingScreenProps) {
  const opacity = useRef(new Animated.Value(0.35)).current;

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, {
          toValue: 1,
          duration: 900,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0.35,
          duration: 900,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ]),
    );

    animation.start();

    return () => {
      animation.stop();
    };
  }, [opacity]);

  return (
    <Screen style={styles.screen}>
      <Animated.View style={[styles.content, { opacity }]}>
        <Text variant="h1" style={styles.logo}>
          UPLY
        </Text>

        <Text tone="secondary" style={styles.message}>
          {message}
        </Text>
      </Animated.View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  screen: {
    justifyContent: "center",
    alignItems: "center",
  },

  content: {
    alignItems: "center",
  },

  logo: {
    color: tokens.brand.primary,
    letterSpacing: 2,
  },

  message: {
    marginTop: 12,
  },
});
