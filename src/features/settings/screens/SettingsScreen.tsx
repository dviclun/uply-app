import { setLanguage, type Language } from "@/i18n";
import { useTranslation } from "react-i18next";
import { Modal, Pressable, StyleSheet, View } from "react-native";

import { Container, Screen, ScreenHeader, Stack, Text } from "@/components/ui";

import { Currency } from "@/currency";
import { useCurrency } from "@/providers";
import { tokens } from "@/theme";
import { useState } from "react";

export function SettingsScreen() {
  const { t, i18n } = useTranslation();
  const [languageModalVisible, setLanguageModalVisible] = useState(false);
  const [languageLoading, setLanguageLoading] = useState(false);

  const [currencyModalVisible, setCurrencyModalVisible] = useState(false);

  const { currency: currentCurrency, setCurrency } = useCurrency();

  const currentLanguage = i18n.language as Language;

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
                <Pressable style={styles.row}>
                  <Text>{t("settings.changePassword")}</Text>
                </Pressable>

                <View style={styles.separator} />

                <Pressable style={styles.row}>
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
});
