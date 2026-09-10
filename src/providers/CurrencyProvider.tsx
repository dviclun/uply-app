import {
  createContext,
  useContext,
  useEffect,
  useState,
  type PropsWithChildren,
} from "react";

import { getCurrency, setSavedCurrency, type Currency } from "@/currency";

type CurrencyContextValue = {
  currency: Currency;
  setCurrency: (currency: Currency) => Promise<void>;
};

const CurrencyContext = createContext<CurrencyContextValue | undefined>(
  undefined,
);

export function CurrencyProvider({ children }: PropsWithChildren) {
  const [currency, setCurrencyState] = useState<Currency>("EUR");

  useEffect(() => {
    const loadCurrency = async () => {
      try {
        const savedCurrency = await getCurrency();
        setCurrencyState(savedCurrency);
      } catch (error) {
        console.error("CURRENCY INITIALIZATION ERROR:", error);
      }
    };

    loadCurrency();
  }, []);

  const setCurrency = async (newCurrency: Currency) => {
    await setSavedCurrency(newCurrency);
    setCurrencyState(newCurrency);
  };

  return (
    <CurrencyContext.Provider value={{ currency, setCurrency }}>
      {children}
    </CurrencyContext.Provider>
  );
}

export function useCurrency(): CurrencyContextValue {
  const context = useContext(CurrencyContext);

  if (!context) {
    throw new Error("useCurrency must be used within CurrencyProvider");
  }

  return context;
}
