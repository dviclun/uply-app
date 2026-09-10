import AsyncStorage from "@react-native-async-storage/async-storage";

export type Currency = "EUR" | "USD" | "GBP";

const CURRENCY_STORAGE_KEY = "uply:currency";

const isSupportedCurrency = (currency: string | null): currency is Currency => {
  return currency === "EUR" || currency === "USD" || currency === "GBP";
};

export async function getSavedCurrency(): Promise<Currency | null> {
  const savedCurrency = await AsyncStorage.getItem(CURRENCY_STORAGE_KEY);

  if (isSupportedCurrency(savedCurrency)) {
    return savedCurrency;
  }

  return null;
}

export async function setSavedCurrency(currency: Currency): Promise<void> {
  await AsyncStorage.setItem(CURRENCY_STORAGE_KEY, currency);
}

export async function getCurrency(): Promise<Currency> {
  const savedCurrency = await getSavedCurrency();

  return savedCurrency ?? "EUR";
}
