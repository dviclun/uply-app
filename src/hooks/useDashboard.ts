import { useQuery } from "@tanstack/react-query";

import { queryKeys } from "@/lib/react-query";
import { useAuth } from "./useAuth";

import { DashboardRepository } from "@/repositories";

const repository = new DashboardRepository();

export function useDashboard() {
  const { user } = useAuth();

  return useQuery({
    queryKey: queryKeys.dashboard(user?.id ?? ""),
    queryFn: () => repository.getDashboard(),
    enabled: Boolean(user),
  });
}
