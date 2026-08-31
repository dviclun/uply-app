import type { Category } from "@/models";
import type { CategoryRow } from "../models/CategoryRow";

export function toCategory(row: CategoryRow): Category {
  return {
    id: row.id,
    name: row.name,
    type: row.type,
    icon: row.icon ?? "ellipsis",
    color: row.color,
  };
}
