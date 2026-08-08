const formatter = new Intl.DateTimeFormat("es-ES", {
  month: "long",
  year: "numeric",
});

export function formatSavingsGoalPeriod(period: string): string {
  const [year, month] = period.split("-").map(Number);

  return formatter.format(new Date(year, month - 1, 1));
}
