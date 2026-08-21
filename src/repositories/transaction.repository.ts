import { supabase } from "@/lib/supabase";
import type { Transaction } from "@/models";

import type { TransactionRow } from "@/lib/database";
import { toTransaction } from "@/lib/database";

export class TransactionRepository {
  private async getCurrentUserId(): Promise<string> {
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();

    if (error) {
      throw error;
    }

    if (!user) {
      throw new Error("User is not authenticated.");
    }

    console.log("TRANSACTION USER:", {
      id: user.id,
      email: user.email,
    });

    return user.id;
  }

  async getRecentTransactions(): Promise<Transaction[]> {
    const userId = await this.getCurrentUserId();

    const { data, error } = await supabase
      .from("transactions")
      .select("*")
      .eq("user_id", userId)
      .order("date", { ascending: false });

    if (error) {
      throw error;
    }

    return (data as TransactionRow[]).map(toTransaction);
  }

  async getDashboardTransactions(): Promise<Transaction[]> {
    const userId = await this.getCurrentUserId();

    const { data, error } = await supabase
      .from("transactions")
      .select("*")
      .eq("user_id", userId)
      .order("date", { ascending: false })
      .limit(3);

    if (error) {
      throw error;
    }

    return (data as TransactionRow[]).map(toTransaction);
  }

  async getTransactionById(id: string): Promise<Transaction | undefined> {
    const userId = await this.getCurrentUserId();

    const { data, error } = await supabase
      .from("transactions")
      .select("*")
      .eq("id", id)
      .eq("user_id", userId)
      .maybeSingle();

    if (error) {
      throw error;
    }

    return data ? toTransaction(data as TransactionRow) : undefined;
  }

  async create(transaction: Transaction): Promise<Transaction> {
    const userId = await this.getCurrentUserId();

    const { data, error } = await supabase
      .from("transactions")
      .insert({
        id: transaction.id,
        user_id: userId,
        title: transaction.title,
        amount: transaction.amount,
        type: transaction.type,
        date: transaction.date.toISOString(),
      })
      .select()
      .single();

    if (error) {
      throw error;
    }

    return toTransaction(data as TransactionRow);
  }

  async update(transaction: Transaction): Promise<Transaction> {
    const userId = await this.getCurrentUserId();

    const { data, error } = await supabase
      .from("transactions")
      .update({
        title: transaction.title,
        amount: transaction.amount,
        type: transaction.type,
        date: transaction.date.toISOString(),
      })
      .eq("id", transaction.id)
      .eq("user_id", userId)
      .select()
      .single();

    if (error) {
      throw error;
    }

    return toTransaction(data as TransactionRow);
  }

  async delete(id: string): Promise<void> {
    const userId = await this.getCurrentUserId();

    const { error } = await supabase
      .from("transactions")
      .delete()
      .eq("id", id)
      .eq("user_id", userId);

    if (error) {
      throw error;
    }
  }

  async getSummary(
    from: Date,
    to: Date,
  ): Promise<{
    income: number;
    expense: number;
  }> {
    const userId = await this.getCurrentUserId();

    const { data, error } = await supabase
      .from("transactions")
      .select("amount, type")
      .eq("user_id", userId)
      .gte("date", from.toISOString())
      .lte("date", to.toISOString());

    if (error) {
      throw error;
    }

    let income = 0;
    let expense = 0;

    for (const transaction of data ?? []) {
      const amount = Number(transaction.amount);

      if (transaction.type === "income") {
        income += amount;
      } else {
        expense += amount;
      }
    }

    return {
      income,
      expense,
    };
  }
}
