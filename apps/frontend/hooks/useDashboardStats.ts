import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';
import { DashboardStats } from '@/types';

export function useDashboardStats(role?: string) {
  return useQuery<DashboardStats>({
    queryKey: ['dashboard-stats', role],
    queryFn: async () => {
      if (role === 'VENDOR') {
        const res = await api.get('/api/vendor/analytics');
        return res.data;
      } else if (role === 'CUSTOMER') {
        const res = await api.get('/api/customer/orders');
        return { totalOrders: res.data.length };
      } else if (role === 'STEPPER') {
        const res = await api.get('/api/stepper/wallet');
        return res.data;
      }
      return {};
    },
    enabled: !!role,
  });
}
