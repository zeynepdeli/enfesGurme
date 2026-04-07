import { useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '@/lib/api'
import { OrderStatus } from '@/types'

export function useOrderMutations() {
  const queryClient = useQueryClient()

  const updateStatus = useMutation({
    mutationFn: ({ id, status }: { id: string; status: OrderStatus }) =>
      api.put(`/api/orders/${id}/status`, { status }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] })
    }
  })

  return { 
    updateStatus: updateStatus.mutate,
    isUpdating: updateStatus.isPending
  }
}
