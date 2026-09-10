import AsyncStorage from "@react-native-async-storage/async-storage";
import { getLocales } from "expo-localization";

export type Language = "es" | "en";

const LANGUAGE_STORAGE_KEY = "uply:language";

const isSupportedLanguage = (language: string | null): language is Language => {
  return language === "es" || language === "en";
};

export async function getSavedLanguage(): Promise<Language | null> {
  const savedLanguage = await AsyncStorage.getItem(LANGUAGE_STORAGE_KEY);

  if (isSupportedLanguage(savedLanguage)) {
    return savedLanguage;
  }

  return null;
}

export async function setSavedLanguage(language: Language): Promise<void> {
  await AsyncStorage.setItem(LANGUAGE_STORAGE_KEY, language);
}

export function getDeviceLanguage(): Language {
  const deviceLanguage = getLocales()[0]?.languageCode;

  return deviceLanguage === "es" ? "es" : "en";
}

export function getLocale(language: Language): string {
  return language === "es" ? "es-ES" : "en-US";
}
