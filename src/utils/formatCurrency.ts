import type { Currency } from "@/currency";

interface FormatCurrencyOptions {
  decimals?: boolean;
  showSign?: boolean;
  currency?: Currency;
  locale?: string;
}

const currencySymbols: Record<Currency, string> = {
  EUR: "€",
  USD: "$",
  GBP: "£",
};

export function formatCurrency(
  value: number,
  options?: FormatCurrencyOptions,
): string {
  const decimals = options?.decimals ?? true;
  const showSign = options?.showSign ?? false;
  const currency = options?.currency ?? "EUR";
  const locale = options?.locale ?? "es-ES";

  const formattedNumber = new Intl.NumberFormat(locale, {
    minimumFractionDigits: decimals ? 2 : 0,
    maximumFractionDigits: decimals ? 2 : 0,
  }).format(Math.abs(value));

  const symbol = currencySymbols[currency];

  const formatted =
    locale === "en-US"
      ? `${symbol}${formattedNumber}`
      : `${formattedNumber} ${symbol}`;

  if (!showSign) {
    return formatted;
  }

  const sign = value >= 0 ? "+" : "-";

  return `${sign}${formatted}`;
}
