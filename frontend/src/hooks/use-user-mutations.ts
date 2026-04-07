import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";

export function useUserMutations() {
  const queryClient = useQueryClient();

  const updateRole = useMutation({
    mutationFn: ({ id, role }: { id: string; role: "USER" | "ADMIN" }) =>
      api.put(`/api/users/admin/${id}/role`, { role }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });

  return {
    updateRole: updateRole.mutate,
    isUpdating: updateRole.isPending,
  };
}
