import { TransactionType } from "../../components/TransactionItem";

export interface CreateTransactionDto {
  title: string;
  amount: number;
  type: TransactionType;
  date: Date;
  categoryId: string | null;
}
