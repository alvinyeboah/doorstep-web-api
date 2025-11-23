import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';
import { VendorRevenue } from '@/types';

export function useAdminRevenue() {
  return useQuery<VendorRevenue[]>({
    queryKey: ['admin-revenue'],
    queryFn: async () => {
      const res = await api.get('/api/super-admin/revenue/by-vendor');
      return res.data;
    },
  });
}
