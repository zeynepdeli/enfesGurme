import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";

export function useBestsellerCardMutations() {
  const queryClient = useQueryClient();
  const invalidate = () =>
    queryClient.invalidateQueries({ queryKey: ["bestseller-cards"] });

  const create = useMutation({
    mutationFn: (data: any) => api.post("/api/bestseller-cards", data),
    onSuccess: invalidate,
    onError: console.error,
  });

  const update = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) =>
      api.put(`/api/bestseller-cards/${id}`, data),
    onSuccess: invalidate,
    onError: console.error,
  });

  const remove = useMutation({
    mutationFn: (id: string) => api.delete(`/api/bestseller-cards/${id}`),
    onSuccess: invalidate,
    onError: console.error,
  });

  return { create, update, remove };
}
