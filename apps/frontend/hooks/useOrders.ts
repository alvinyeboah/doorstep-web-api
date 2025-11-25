import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import { Order } from '@/types';

export function useOrders(role?: string, statusFilter: string = '') {
  return useQuery<Order[]>({
    queryKey: ['orders', role, statusFilter],
    queryFn: async () => {
      let endpoint = '/api';

      if (role === 'VENDOR') {
        endpoint += `/vendor/orders${statusFilter ? `?status=${statusFilter}` : ''}`;
      } else if (role === 'STEPPER') {
        endpoint += `/stepper/orders${statusFilter ? `?status=${statusFilter}` : ''}`;
      } else if (role === 'CUSTOMER') {
        endpoint += `/customer/orders${statusFilter ? `?status=${statusFilter}` : ''}`;
      } else {
        return [];
      }

      const res = await api.get(endpoint);
      return res.data;
    },
    enabled: !!role,
  });
}

export function useUpdateOrderStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ orderId, status }: { orderId: string; status: string }) => {
      const res = await api.put(`/api/orders/${orderId}/status`, { status });
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
    },
  });
}

export function useAcceptOrder() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (orderId: string) => {
      const res = await api.post(`/api/stepper/orders/${orderId}/accept`);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      queryClient.invalidateQueries({ queryKey: ['available-orders'] });
    },
  });
}
