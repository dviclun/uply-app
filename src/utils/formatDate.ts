export function formatDate(date: Date): string {
  const today = new Date();

  // Eliminamos la hora para comparar únicamente la fecha
  const currentDate = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate(),
  );

  const targetDate = new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate(),
  );

  const diffInDays = Math.floor(
    (currentDate.getTime() - targetDate.getTime()) / (1000 * 60 * 60 * 24),
  );

  if (diffInDays === 0) {
    return "Hoy";
  }

  if (diffInDays === 1) {
    return "Ayer";
  }

  const isCurrentYear = date.getFullYear() === today.getFullYear();

  return new Intl.DateTimeFormat("es-ES", {
    day: "numeric",
    month: "short",
    ...(isCurrentYear ? {} : { year: "numeric" }),
  }).format(date);
}
