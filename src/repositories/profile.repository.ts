import { supabase } from "@/lib/supabase";

export class ProfileRepository {
  async getInitialBalance(): Promise<number> {
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError) {
      throw userError;
    }

    if (!user) {
      throw new Error("User is not authenticated.");
    }

    const { data, error } = await supabase
      .from("profiles")
      .select("initial_balance")
      .eq("id", user.id)
      .single();

    if (error) {
      throw error;
    }

    return Number(data.initial_balance);
  }
}
