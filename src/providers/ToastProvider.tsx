import {
  createContext,
  type ReactNode,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import {
  Animated,
  Easing,
  StyleSheet,
  useWindowDimensions,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { Text } from "@/components/ui/Text";
import { radius, spacing, tokens } from "@/theme";

type ToastVariant = "success" | "error" | "warning";

type ToastData = {
  message: string;
  variant: ToastVariant;
};

type ToastContextValue = {
  showToast: (toast: ToastData) => void;
};

const ToastContext = createContext<ToastContextValue | undefined>(undefined);

type ToastProviderProps = {
  children: ReactNode;
};

const TOAST_DURATION = 3000;
const ANIMATION_DURATION = 250;

export function ToastProvider({ children }: ToastProviderProps) {
  const { width } = useWindowDimensions();

  const [toast, setToast] = useState<ToastData | null>(null);

  const translateX = useRef(new Animated.Value(-width)).current;
  const opacity = useRef(new Animated.Value(1)).current;

  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const showToast = useCallback(
    (newToast: ToastData) => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }

      translateX.stopAnimation();
      opacity.stopAnimation();

      translateX.setValue(-width);
      opacity.setValue(1);

      setToast(newToast);

      Animated.timing(translateX, {
        toValue: 0,
        duration: ANIMATION_DURATION,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }).start();

      timeoutRef.current = setTimeout(() => {
        Animated.timing(opacity, {
          toValue: 0,
          duration: ANIMATION_DURATION,
          easing: Easing.out(Easing.ease),
          useNativeDriver: true,
        }).start(({ finished }) => {
          if (finished) {
            setToast(null);
          }
        });

        timeoutRef.current = null;
      }, TOAST_DURATION);
    },
    [opacity, translateX, width],
  );

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      translateX.stopAnimation();
      opacity.stopAnimation();
    };
  }, [opacity, translateX]);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}

      {toast && (
        <SafeAreaView
          edges={["top"]}
          pointerEvents="none"
          style={styles.container}
        >
          <Animated.View
            style={{
              opacity,
              transform: [{ translateX }],
            }}
          >
            <View
              style={[
                styles.toast,
                toast.variant === "success" && styles.success,
                toast.variant === "error" && styles.error,
                toast.variant === "warning" && styles.warning,
              ]}
            >
              <Text
                variant="bodyMedium"
                tone={
                  toast.variant === "success"
                    ? "success"
                    : toast.variant === "error"
                      ? "danger"
                      : "warning"
                }
              >
                {toast.message}
              </Text>
            </View>
          </Animated.View>
        </SafeAreaView>
      )}
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);

  if (!context) {
    throw new Error("useToast must be used inside a ToastProvider.");
  }

  return context;
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: 0,
    left: spacing.lg,
    right: spacing.lg,
    zIndex: 999,
  },

  toast: {
    width: "100%",
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderRadius: radius.lg,
    borderLeftWidth: 4,
  },

  success: {
    backgroundColor: tokens.status.success.background,
    borderLeftColor: tokens.status.success.foreground,
  },

  error: {
    backgroundColor: tokens.status.danger.background,
    borderLeftColor: tokens.status.danger.foreground,
  },

  warning: {
    backgroundColor: tokens.status.warning.background,
    borderLeftColor: tokens.status.warning.foreground,
  },
});
