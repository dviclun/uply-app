import { supabase } from "@/lib/supabase";

export class ProfileRepository {
  
  async isUsernameAvailable(username: string): Promise<boolean> {
    const { data, error } = await supabase.rpc("is_username_available", {
      requested_username: username,
    });

    if (error) {
      throw error;
    }

    return data;
  }
}
