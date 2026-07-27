interface FormatCurrencyOptions {
  decimals?: boolean;
  showSign?: boolean;
}

export function formatCurrency(
  value: number,
  options?: FormatCurrencyOptions,
): string {
  const decimals = options?.decimals ?? true;
  const showSign = options?.showSign ?? false;

  const formatted = new Intl.NumberFormat("es-ES", {
    style: "currency",
    currency: "EUR",
    minimumFractionDigits: decimals ? 2 : 0,
    maximumFractionDigits: decimals ? 2 : 0,
  }).format(Math.abs(value));

  if (!showSign) {
    return formatted;
  }

  const sign = value >= 0 ? "+" : "-";

  return `${sign}${formatted}`;
}
