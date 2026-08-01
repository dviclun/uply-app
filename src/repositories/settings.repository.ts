import { db } from "@/lib/database";

type SettingsRow = {
  initialBalance: number;
};

export class SettingsRepository {
  async getInitialBalance(): Promise<number> {
    const settings = await db.getFirstAsync<SettingsRow>(
      `
        SELECT initialBalance
        FROM settings
        WHERE id = ?;
      `,
      "default",
    );

    return settings?.initialBalance ?? 0;
  }
}
