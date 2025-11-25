import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';
import { Order } from '@/types';

export function useAdminOrders(statusFilter: string = '') {
  return useQuery<Order[]>({
    queryKey: ['admin-orders', statusFilter],
    queryFn: async () => {
      const res = await api.get(`/api/super-admin/orders${statusFilter ? `?status=${statusFilter}` : ''}`);
      return res.data;
    },
  });
}
