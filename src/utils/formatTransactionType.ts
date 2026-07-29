import type { TransactionType } from "@/models";

export function formatTransactionType(type: TransactionType): string {
  switch (type) {
    case "income":
      return "Ingreso";

    case "expense":
      return "Gasto";

    default:
      return type;
  }
}
