import type { Transaction } from "@/models";
import { PressableProps } from "react-native";

export type TransactionType = "income" | "expense";

export interface TransactionItemProps extends Omit<PressableProps, "children"> {
  transaction: Transaction;
}
