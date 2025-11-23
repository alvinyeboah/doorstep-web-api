import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';
import { PlatformAnalytics } from '@/types';

export function useAdminAnalytics() {
  return useQuery<PlatformAnalytics>({
    queryKey: ['super-admin-analytics'],
    queryFn: async () => {
      const res = await api.get('/api/super-admin/analytics');
      return res.data;
    },
  });
}
