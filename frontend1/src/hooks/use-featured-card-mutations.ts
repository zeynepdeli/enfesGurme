import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";

export function useFeaturedCardMutations() {
  const queryClient = useQueryClient();
  const invalidate = () =>
    queryClient.invalidateQueries({ queryKey: ["featured-cards"] });

  const create = useMutation({
    mutationFn: (data: any) => api.post("/api/featured-cards", data),
    onSuccess: () => invalidate(),
  });

  const update = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) =>
      api.put(`/api/featured-cards/${id}`, data),
    onSuccess: () => invalidate(),
  });

  const remove = useMutation({
    mutationFn: (id: string) => api.delete(`/api/featured-cards/${id}`),
  });

  return { create, update, remove };
}
