import type { CategoryRow } from "@/lib/database";
import { toCategory } from "@/lib/database";
import { supabase } from "@/lib/supabase";
import type { Category } from "@/models";

export class CategoryRepository {
  async getAll(): Promise<Category[]> {
    const { data, error } = await supabase
      .from("categories")
      .select("id, user_id, name, type, icon, color, created_at")
      .order("type", { ascending: true })
      .order("name", { ascending: true });

    if (error) {
      throw error;
    }

    return (data as CategoryRow[]).map(toCategory);
  }
}
