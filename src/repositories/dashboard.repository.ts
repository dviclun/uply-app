import { dashboard } from "@/data";
import type { Dashboard } from "@/models";

export class DashboardRepository {
  getDashboard(): Dashboard {
    return dashboard;
  }
}
