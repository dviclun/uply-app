import { DashboardRepository } from "@/repositories";

const repository = new DashboardRepository();

export function useDashboard() {
  const dashboard = repository.getDashboard();

  return dashboard;
}
