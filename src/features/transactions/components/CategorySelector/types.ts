import type { Category, TransactionType } from "@/models";

export type CategorySelectorProps = {
  categories: Category[];
  type: TransactionType;
  value: string | null;
  onChange: (categoryId: string | null) => void;
  disabled?: boolean;
};
