export type TransactionType = "income" | "expense";

export interface Transaction {
  id: string;

  title: string;

  amount: number;

  date: Date;

  type: TransactionType;
}
