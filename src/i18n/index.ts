import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import {
  getDeviceLanguage,
  getSavedLanguage,
  setSavedLanguage,
} from "./language";
import { en } from "./locales/en";
import { es } from "./locales/es";

async function initializeI18n() {
  const savedLanguage = await getSavedLanguage();
  const initialLanguage = savedLanguage ?? getDeviceLanguage();

  await i18n.use(initReactI18next).init({
    compatibilityJSON: "v4",
    lng: initialLanguage,
    fallbackLng: "en",
    resources: {
      es,
      en,
    },
    interpolation: {
      escapeValue: false,
    },
  });
}

async function setLanguage(language: "es" | "en"): Promise<void> {
  await setSavedLanguage(language);
  await i18n.changeLanguage(language);
}

export { getLocale } from "./language";
export type { Language } from "./language";
export { i18n, initializeI18n, setLanguage };
