import { useQuery } from "@tanstack/react-query";

import { queryKeys } from "@/lib/react-query";
import { CategoryRepository } from "@/repositories";
import { useAuth } from "./useAuth";

const repository = new CategoryRepository();

export function useCategories() {
  const { user } = useAuth();

  return useQuery({
    queryKey: queryKeys.categories(),
    queryFn: () => repository.getAll(),
    enabled: Boolean(user),
  });
}
