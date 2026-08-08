import { SavingsGoalRepository } from "@/repositories";
import { initializeDatabase } from "../database";

export async function initializeApp() {
  await initializeDatabase();

  const savingsGoalRepository = new SavingsGoalRepository();

  await savingsGoalRepository.debugGoals();

  await savingsGoalRepository.seedDebugGoals();

  await savingsGoalRepository.initializeGoals();

  await savingsGoalRepository.debugGoals();
}
