import { useMutation } from "@tanstack/react-query";

import { ProfileRepository } from "@/repositories";

const repository = new ProfileRepository();

export function useCheckUsernameAvailability() {
  return useMutation({
    mutationFn: (username: string) => repository.isUsernameAvailable(username),
  });
}
