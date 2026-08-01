import { useQuery } from "@tanstack/react-query";

import { queryKeys } from "@/lib/react-query";
import { DashboardRepository } from "@/repositories";

const repository = new DashboardRepository();

export function useDashboard() {
  return useQuery({
    queryKey: queryKeys.dashboard,
    queryFn: () => repository.getDashboard(),
  });
}
