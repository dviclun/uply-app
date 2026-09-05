import { router } from "expo-router";
import { useState } from "react";
import { Pressable, StyleSheet, View } from "react-native";

import {
  Button,
  Container,
  Screen,
  Stack,
  Stepper,
  Text,
  TextField,
} from "@/components/ui";
import { useAuth, useCheckUsernameAvailability } from "@/hooks";
import { colors, spacing } from "@/theme";
import { getAuthErrorMessage } from "@/utils/authErrors";

type RegisterStep = 1 | 2 | 3;

export function RegisterScreen() {
  const { signUp } = useAuth();
  const checkUsernameAvailability = useCheckUsernameAvailability();

  const [step, setStep] = useState<RegisterStep>(1);

  const [username, setUsername] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");

  const [initialBalance, setInitialBalance] = useState("");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const parsedBalance = Number(initialBalance.replace(",", "."));

  const isStepOneValid =
    username.trim().length > 0 &&
    firstName.trim().length > 0 &&
    lastName.trim().length > 0;

  const isStepTwoValid =
    initialBalance.trim().length > 0 &&
    !Number.isNaN(parsedBalance) &&
    parsedBalance >= 0;

  const isStepThreeValid =
    email.trim().length > 0 &&
    password.length >= 6 &&
    confirmPassword === password;

  const handleStepOne = async () => {
    if (!isStepOneValid) return;

    try {
      setError(null);
      setLoading(true);

      const available = await checkUsernameAvailability.mutateAsync(
        username.trim(),
      );

      if (!available) {
        setError("Este nombre de usuario ya está en uso.");
        return;
      }

      setStep(2);
    } catch {
      setError("No hemos podido comprobar el nombre de usuario.");
    } finally {
      setLoading(false);
    }
  };

  const handleStepTwo = () => {
    if (!isStepTwoValid) return;

    setError(null);
    setStep(3);
  };

  const handleBack = () => {
    setError(null);

    if (step === 2) {
      setStep(1);
      return;
    }

    if (step === 3) {
      setStep(2);
    }
  };

  const handleRegister = async () => {
    if (!isStepThreeValid) return;

    try {
      setError(null);
      setLoading(true);

      const result = await signUp({
        email: email.trim(),
        password,
        username: username.trim(),
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        initialBalance: parsedBalance,
      });

      if (result.requiresEmailConfirmation) {
        router.replace({
          pathname: "/email-confirmation",
          params: { email: result.email },
        });
        return;
      }

      router.replace("/(app)/(tabs)");
    } catch (error) {
      setError(getAuthErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Screen>
      <Container flex paddingTop="none">
        <View style={styles.content}>
          <Stack spacing="lg">
            <Text variant="h1" textAlign="center">
              Registrarse
            </Text>

            <View style={styles.stepperContainer}>
              <Stepper
                currentStep={step}
                steps={["Perfil", "Balance", "Cuenta"]}
              />
            </View>

            <View style={styles.formContainer}>
              {step === 1 && (
                <View style={styles.formStep}>
                  <Stack spacing="lg">
                    <TextField
                      label="Nombre de usuario"
                      value={username}
                      onChangeText={setUsername}
                      autoCapitalize="none"
                      autoCorrect={false}
                      placeholder="Tu nombre de usuario"
                    />

                    <TextField
                      label="Nombre"
                      value={firstName}
                      onChangeText={setFirstName}
                      placeholder="Tu nombre"
                    />

                    <TextField
                      label="Apellidos"
                      value={lastName}
                      onChangeText={setLastName}
                      placeholder="Tus apellidos"
                    />
                  </Stack>

                  <View>
                    {error && (
                      <View style={styles.errorContainer}>
                        <Text tone="danger">{error}</Text>
                      </View>
                    )}

                    <Button
                      onPress={handleStepOne}
                      disabled={!isStepOneValid || loading}
                      loading={loading}
                    >
                      Continuar
                    </Button>
                  </View>
                </View>
              )}

              {step === 2 && (
                <View style={styles.formStep}>
                  <Stack spacing="lg">
                    <TextField
                      label="Balance inicial"
                      value={initialBalance}
                      onChangeText={setInitialBalance}
                      keyboardType="decimal-pad"
                      placeholder="0,00 €"
                    />
                  </Stack>

                  <View>
                    {error && (
                      <View style={styles.errorContainer}>
                        <Text tone="danger">{error}</Text>
                      </View>
                    )}

                    <View style={styles.buttonRow}>
                      <View style={styles.buttonWrapper}>
                        <Button
                          onPress={handleBack}
                          variant="secondary"
                          disabled={loading}
                        >
                          Atrás
                        </Button>
                      </View>

                      <View style={styles.buttonWrapper}>
                        <Button
                          onPress={handleStepTwo}
                          disabled={!isStepTwoValid}
                        >
                          Continuar
                        </Button>
                      </View>
                    </View>
                  </View>
                </View>
              )}

              {step === 3 && (
                <View style={styles.formStep}>
                  <Stack spacing="lg">
                    <TextField
                      label="Correo electrónico"
                      value={email}
                      onChangeText={setEmail}
                      keyboardType="email-address"
                      autoCapitalize="none"
                      autoCorrect={false}
                      placeholder="tu@email.com"
                    />

                    <TextField
                      label="Contraseña"
                      value={password}
                      onChangeText={setPassword}
                      secureTextEntry
                      placeholder="Mínimo 6 caracteres"
                    />

                    <TextField
                      label="Confirmar contraseña"
                      value={confirmPassword}
                      onChangeText={setConfirmPassword}
                      secureTextEntry
                      placeholder="Repite tu contraseña"
                    />
                  </Stack>

                  <View>
                    {error && (
                      <View style={styles.errorContainer}>
                        <Text tone="danger">{error}</Text>
                      </View>
                    )}

                    <View style={styles.buttonRow}>
                      <View style={styles.buttonWrapper}>
                        <Button
                          onPress={handleBack}
                          variant="secondary"
                          disabled={loading}
                        >
                          Atrás
                        </Button>
                      </View>

                      <View style={styles.buttonWrapper}>
                        <Button
                          onPress={handleRegister}
                          disabled={!isStepThreeValid || loading}
                          loading={loading}
                        >
                          Crear cuenta
                        </Button>
                      </View>
                    </View>
                  </View>
                </View>
              )}
            </View>

            <View style={styles.loginContainer}>
              <Text tone="secondary">¿Ya tienes una cuenta?</Text>

              <Pressable
                disabled={loading}
                onPress={() => router.push("/login")}
                style={({ pressed }) => [pressed && styles.linkPressed]}
              >
                <Text style={styles.link}>¡Inicia sesión!</Text>
              </Pressable>
            </View>
          </Stack>
        </View>
      </Container>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: {
    flex: 1,
    justifyContent: "center",
  },

  stepperContainer: {
    alignItems: "center",
  },

  formContainer: {
    height: 360,
  },

  formStep: {
    flex: 1,
    justifyContent: "space-between",
  },

  errorContainer: {
    marginBottom: spacing.sm,
  },

  buttonRow: {
    flexDirection: "row",
    gap: spacing.sm,
  },

  buttonWrapper: {
    flex: 1,
  },

  loginContainer: {
    alignItems: "center",
    marginTop: spacing.sm,
  },

  link: {
    color: colors.primary,
  },

  linkPressed: {
    opacity: 0.7,
  },
});
