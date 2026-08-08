import { db } from "./database";

export async function initializeDatabase() {
  await db.withTransactionAsync(async () => {
    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS transactions (
        id TEXT PRIMARY KEY NOT NULL,
        title TEXT NOT NULL,
        amount REAL NOT NULL,
        type TEXT NOT NULL,
        date TEXT NOT NULL
      );

    `);

    await db.execAsync(`
    CREATE TABLE IF NOT EXISTS settings (
      id TEXT PRIMARY KEY NOT NULL,
      initialBalance REAL NOT NULL
    );
  `);

    await db.execAsync(`
   CREATE TABLE IF NOT EXISTS savings_goals (
      id TEXT PRIMARY KEY NOT NULL,
      period TEXT NOT NULL UNIQUE,
      target REAL NOT NULL,
      status TEXT NOT NULL
    );
  `);

    await db.execAsync(`
     DELETE FROM savings_goals;
    `);

    //     await db.execAsync(`
    //       UPDATE savings_goals
    // SET period = '2026-07'
    // WHERE period = '2026-08';

    // UPDATE savings_goals
    // SET period = '2026-08'
    // WHERE period = '2026-09';
    //       `);
  });
}
