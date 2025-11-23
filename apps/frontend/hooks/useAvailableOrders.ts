import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';
import { Order } from '@/types';

export function useAvailableOrders(refetchInterval?: number) {
  return useQuery<Order[]>({
    queryKey: ['available-orders'],
    queryFn: async () => {
      const res = await api.get('/api/orders/available/list');
      return res.data;
    },
    refetchInterval,
  });
}
