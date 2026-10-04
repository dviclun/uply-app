import { setLanguage, type Language } from "@/i18n";
import { useTranslation } from "react-i18next";
import { Modal, Pressable, StyleSheet, View } from "react-native";

import {
  Button,
  ConfirmationModal,
  Container,
  Screen,
  ScreenHeader,
  Stack,
  Text,
  TextField,
} from "@/components/ui";
import { ChangePasswordModal } from "@/features/auth";
import { useAuth } from "@/hooks";

import { Currency } from "@/currency";
import { useCurrency, useToast } from "@/providers";
import { tokens } from "@/theme";
import { getAuthErrorMessage } from "@/utils/authErrors";
import { useState } from "react";

export function SettingsScreen() {
  const { t, i18n } = useTranslation();
  const { showToast } = useToast();
  const [languageModalVisible, setLanguageModalVisible] = useState(false);
  const [languageLoading, setLanguageLoading] = useState(false);

  const [currencyModalVisible, setCurrencyModalVisible] = useState(false);

  const { currency: currentCurrency, setCurrency } = useCurrency();

  const currentLanguage = i18n.language as Language;

  const [changePasswordModalVisible, setChangePasswordModalVisible] =
    useState(false);

  const [changePasswordLoading, setChangePasswordLoading] = useState(false);

  const [changePasswordError, setChangePasswordError] = useState<string | null>(
    null,
  );

  const [changePasswordCodeStep, setChangePasswordCodeStep] = useState(false);

  const [pendingCurrentPassword, setPendingCurrentPassword] = useState("");

  const [pendingNewPassword, setPendingNewPassword] = useState("");

  const [deleteAccountModalVisible, setDeleteAccountModalVisible] =
    useState(false);
  const [deleteAccountLoading, setDeleteAccountLoading] = useState(false);
  const [deleteAccountError, setDeleteAccountError] = useState<string | null>(
    null,
  );

  const [deleteAccountPassword, setDeleteAccountPassword] = useState("");

  const [
    deleteAccountPasswordModalVisible,
    setDeleteAccountPasswordModalVisible,
  ] = useState(false);

  const {
    user,
    changePassword,
    reauthenticate,
    updatePasswordAfterReauthentication,
    deleteAccount,
    verifyCurrentPassword,
  } = useAuth();

  const handleDeleteAccount = () => {
    setDeleteAccountError(null);
    setDeleteAccountModalVisible(true);
  };

  const handleConfirmDeleteAccount = () => {
    setDeleteAccountModalVisible(false);
    setDeleteAccountError(null);
    setDeleteAccountPassword("");
    setDeleteAccountPasswordModalVisible(true);
  };

  const handleChangePassword = async (
    currentPassword: string,
    newPassword: string,
  ) => {
    try {
      setChangePasswordLoading(true);
      setChangePasswordError(null);

      await changePassword(currentPassword, newPassword);

      showToast({
        variant: "success",
        message: "Contraseña cambiada correctamente.",
      });

      setChangePasswordModalVisible(false);
      setChangePasswordCodeStep(false);
    } catch (error) {
      const authError = error as {
        code?: string;
        message?: string;
      };

      if (authError.code === "reauthentication_needed") {
        try {
          setPendingCurrentPassword(currentPassword);
          setPendingNewPassword(newPassword);

          await reauthenticate();

          setChangePasswordCodeStep(true);
          return;
        } catch (reauthError) {
          console.error("PASSWORD REAUTHENTICATION ERROR:", reauthError);

          setChangePasswordError(
            "No se ha podido enviar el código de verificación.",
          );
        }
      }

      setChangePasswordError(getAuthErrorMessage(error));
    } finally {
      setChangePasswordLoading(false);
    }
  };

  const handleSubmitPasswordChangeCode = async (code: string) => {
    try {
      setChangePasswordLoading(true);
      setChangePasswordError(null);

      await updatePasswordAfterReauthentication(
        pendingCurrentPassword,
        pendingNewPassword,
        code,
      );

      showToast({
        variant: "success",
        message: "Contraseña cambiada correctamente.",
      });

      setChangePasswordModalVisible(false);
      setChangePasswordCodeStep(false);
      setPendingCurrentPassword("");
      setPendingNewPassword("");
    } catch (error) {
      const authError = error as {
        message?: string;
      };

      if (
        authError.message ===
        "Current password required when setting new password."
      ) {
        setChangePasswordCodeStep(false);
        setChangePasswordError(getAuthErrorMessage(error));

        return;
      }

      setChangePasswordError(getAuthErrorMessage(error));
    } finally {
      setChangePasswordLoading(false);
    }
  };

  const handleVerifyDeleteAccountPassword = async () => {
    if (!deleteAccountPassword) {
      setDeleteAccountError("Introduce tu contraseña actual.");
      return;
    }

    if (!user?.email) {
      setDeleteAccountError("No se ha podido verificar la cuenta.");
      return;
    }

    try {
      setDeleteAccountLoading(true);
      setDeleteAccountError(null);

      await verifyCurrentPassword(user.email, deleteAccountPassword);

      setDeleteAccountPasswordModalVisible(false);
      await deleteAccount();
    } catch (error) {
      setDeleteAccountError("Contraseña incorrecta.");
    } finally {
      setDeleteAccountLoading(false);
    }
  };

  const handleLanguageChange = async (language: Language) => {
    try {
      setLanguageLoading(true);
      await setLanguage(language);
      setLanguageModalVisible(false);
    } catch (error) {
      console.error("LANGUAGE CHANGE ERROR:", error);
    } finally {
      setLanguageLoading(false);
    }
  };

  const handleCurrencyChange = async (currency: Currency) => {
    try {
      await setCurrency(currency);
      setCurrencyModalVisible(false);
    } catch (error) {
      console.error("CURRENCY CHANGE ERROR:", error);
    }
  };
  return (
    <>
      <Screen>
        <Container>
          <Stack spacing="lg">
            <ScreenHeader title={t("settings.title")} showBackButton />

            <Stack spacing="lg">
              <Text variant="h3">{t("settings.appearance")}</Text>

              <View style={styles.section}>
                <Pressable
                  style={styles.row}
                  onPress={() => setLanguageModalVisible(true)}
                  disabled={languageLoading}
                >
                  <Text>{t("settings.language")}</Text>
                  <View style={styles.languageValue}>
                    <Text style={styles.screenFlag}>
                      {currentLanguage === "es" ? "🇪🇸" : "🇬🇧"}
                    </Text>

                    <Text tone="secondary">
                      {currentLanguage === "es" ? "Español" : "English"}
                    </Text>
                  </View>
                </Pressable>

                <View style={styles.separator} />

                <Pressable
                  style={styles.row}
                  onPress={() => setCurrencyModalVisible(true)}
                >
                  <Text>{t("settings.currency")}</Text>

                  <Text tone="secondary">
                    {currentCurrency === "EUR"
                      ? t("currency.eur")
                      : currentCurrency === "USD"
                        ? t("currency.usd")
                        : t("currency.gbp")}
                  </Text>
                </Pressable>
              </View>
            </Stack>

            <Stack spacing="lg">
              <Text variant="h3">{t("settings.security")}</Text>

              <View style={styles.section}>
                <Pressable
                  style={styles.row}
                  onPress={() => {
                    setChangePasswordError(null);
                    setChangePasswordModalVisible(true);
                  }}
                >
                  <Text>{t("settings.changePassword")}</Text>
                </Pressable>

                <View style={styles.separator} />

                <Pressable
                  style={styles.row}
                  onPress={() => {
                    handleDeleteAccount();
                  }}
                >
                  <Text tone="danger">{t("settings.deleteAccount")}</Text>
                </Pressable>
              </View>
            </Stack>

            <Stack spacing="lg">
              <Text variant="h3">{t("settings.about")}</Text>

              <View style={styles.section}>
                <View style={styles.row}>
                  <Text>{t("settings.version")}</Text>
                  <Text tone="secondary">1.0.0</Text>
                </View>

                <View style={styles.separator} />

                <Pressable style={styles.row}>
                  <Text>{t("settings.terms")}</Text>
                </Pressable>

                <View style={styles.separator} />

                <Pressable style={styles.row}>
                  <Text>{t("settings.privacy")}</Text>
                </Pressable>

                <View style={styles.separator} />

                <Pressable style={styles.row}>
                  <Text>{t("settings.contact")}</Text>
                </Pressable>
              </View>
            </Stack>
          </Stack>
        </Container>
      </Screen>
      <Modal
        visible={languageModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setLanguageModalVisible(false)}
      >
        <Pressable
          style={styles.modalOverlay}
          onPress={() => setLanguageModalVisible(false)}
        >
          <Pressable style={styles.modal} onPress={() => undefined}>
            <Text variant="h3">{t("settings.language")}</Text>

            <Pressable
              style={styles.languageOption}
              onPress={() => handleLanguageChange("es")}
              disabled={languageLoading}
            >
              <View style={styles.languageInfo}>
                <Text style={styles.flag}>🇪🇸</Text>
                <Text>Español</Text>
              </View>

              {currentLanguage === "es" && <Text>✓</Text>}
            </Pressable>

            <View style={styles.separator} />

            <Pressable
              style={styles.languageOption}
              onPress={() => handleLanguageChange("en")}
              disabled={languageLoading}
            >
              <View style={styles.languageInfo}>
                <Text style={styles.flag}>🇬🇧</Text>
                <Text>English</Text>
              </View>

              {currentLanguage === "en" && <Text>✓</Text>}
            </Pressable>
          </Pressable>
        </Pressable>
      </Modal>
      <Modal
        visible={currencyModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setCurrencyModalVisible(false)}
      >
        <Pressable
          style={styles.modalOverlay}
          onPress={() => setCurrencyModalVisible(false)}
        >
          <Pressable style={styles.modal} onPress={() => undefined}>
            <Text variant="h3">{t("settings.currency")}</Text>

            <Pressable
              style={styles.languageOption}
              onPress={() => handleCurrencyChange("EUR")}
            >
              <View style={styles.languageInfo}>
                <Text style={styles.flag}>🇪🇺</Text>
                <Text>{t("currency.eur")}</Text>
              </View>

              {currentCurrency === "EUR" && <Text>✓</Text>}
            </Pressable>

            <View style={styles.separator} />

            <Pressable
              style={styles.languageOption}
              onPress={() => handleCurrencyChange("USD")}
            >
              <View style={styles.languageInfo}>
                <Text style={styles.flag}>🇺🇸</Text>
                <Text>{t("currency.usd")}</Text>
              </View>

              {currentCurrency === "USD" && <Text>✓</Text>}
            </Pressable>

            <View style={styles.separator} />

            <Pressable
              style={styles.languageOption}
              onPress={() => handleCurrencyChange("GBP")}
            >
              <View style={styles.languageInfo}>
                <Text style={styles.flag}>🇬🇧</Text>
                <Text>{t("currency.gbp")}</Text>
              </View>

              {currentCurrency === "GBP" && <Text>✓</Text>}
            </Pressable>
          </Pressable>
        </Pressable>
      </Modal>
      <ChangePasswordModal
        visible={changePasswordModalVisible}
        email={user?.email}
        loading={changePasswordLoading}
        error={changePasswordError}
        codeStep={changePasswordCodeStep}
        onChangePassword={handleChangePassword}
        onSubmitCode={handleSubmitPasswordChangeCode}
        onClose={() => {
          if (changePasswordLoading) {
            return;
          }

          setChangePasswordModalVisible(false);
          setChangePasswordCodeStep(false);
          setChangePasswordError(null);
          setPendingCurrentPassword("");
          setPendingNewPassword("");
        }}
      />
      <ConfirmationModal
        visible={deleteAccountModalVisible}
        title={t("settings.deleteAccount")}
        message="Esta acción es permanente. Se eliminarán tu cuenta y todos tus datos."
        confirmText="Eliminar"
        loading={deleteAccountLoading}
        error={deleteAccountError}
        onClose={() => {
          if (deleteAccountLoading) {
            return;
          }

          setDeleteAccountModalVisible(false);
          setDeleteAccountError(null);
        }}
        onConfirm={handleConfirmDeleteAccount}
      />
      <Modal
        visible={deleteAccountPasswordModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => {
          if (deleteAccountLoading) {
            return;
          }

          setDeleteAccountPasswordModalVisible(false);
          setDeleteAccountPassword("");
          setDeleteAccountError(null);
        }}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modal}>
            <Stack spacing="lg">
              <Text variant="h3" textAlign="center">
                Confirmar contraseña
              </Text>

              <Text tone="secondary" textAlign="center">
                Introduce tu contraseña actual para continuar.
              </Text>

              <TextField
                label="Contraseña actual"
                secureTextEntry
                value={deleteAccountPassword}
                onChangeText={setDeleteAccountPassword}
                editable={!deleteAccountLoading}
                error={deleteAccountError ?? undefined}
              />

              <Stack direction="row" spacing="md">
                <Button
                  variant="secondary"
                  onPress={() => {
                    if (deleteAccountLoading) {
                      return;
                    }

                    setDeleteAccountPasswordModalVisible(false);
                    setDeleteAccountPassword("");
                    setDeleteAccountError(null);
                  }}
                  disabled={deleteAccountLoading}
                  flex={1}
                >
                  Cancelar
                </Button>

                <Button
                  variant="danger"
                  onPress={handleVerifyDeleteAccountPassword}
                  loading={deleteAccountLoading}
                  disabled={deleteAccountLoading}
                  flex={1}
                >
                  Eliminar
                </Button>
              </Stack>
            </Stack>
          </View>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  section: {
    borderWidth: 1,
    borderColor: tokens.border.default,
    borderRadius: 14,
    overflow: "hidden",
  },
  row: {
    minHeight: 52,
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  separator: {
    height: 1,
    marginHorizontal: 16,
    backgroundColor: tokens.border.default,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
    backgroundColor: "rgba(0, 0, 0, 0.4)",
  },

  modal: {
    width: "100%",
    maxWidth: 360,
    padding: 20,
    borderRadius: 16,
    backgroundColor: tokens.background.primary,
    borderWidth: 1,
    borderColor: tokens.border.default,
  },

  languageOption: {
    minHeight: 52,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  languageInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },

  flag: {
    fontSize: 22,
  },
  screenFlag: {
    fontSize: 16,
  },
  languageValue: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  deleteAccountActions: {
    marginTop: 20,
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
    gap: 20,
  },
});
