import { SavingsGoalRepository } from "@/repositories";
import { initializeDatabase } from "../database";

export async function initializeApp() {
  await initializeDatabase();

  const savingsGoalRepository = new SavingsGoalRepository();

  await savingsGoalRepository.initializeGoals();
}
