import { supabase } from "@/lib/supabase";
import type { BalanceAdjustment } from "@/models";

export class BalanceAdjustmentRepository {
  private async getCurrentUserId(): Promise<string> {
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();

    if (error) throw error;
    if (!user) throw new Error("User is not authenticated.");

    return user.id;
  }

  async getLatest(): Promise<BalanceAdjustment | undefined> {
    const userId = await this.getCurrentUserId();

    const { data, error } = await supabase
      .from("balance_adjustments")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (error) throw error;

    if (!data) {
      return undefined;
    }

    return {
      id: data.id,
      userId: data.user_id,
      amount: Number(data.amount),
      createdAt: new Date(data.created_at),
    };
  }

  async create(amount: number): Promise<BalanceAdjustment> {
    const userId = await this.getCurrentUserId();

    const { data, error } = await supabase
      .from("balance_adjustments")
      .insert({
        user_id: userId,
        amount,
      })
      .select()
      .single();

    if (error) throw error;

    return {
      id: data.id,
      userId: data.user_id,
      amount: Number(data.amount),
      createdAt: new Date(data.created_at),
    };
  }
}