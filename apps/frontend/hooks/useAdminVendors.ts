import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import { Vendor } from '@/types';

export function useAdminVendors(filter: 'all' | 'verified' | 'unverified' = 'all') {
  return useQuery<Vendor[]>({
    queryKey: ['admin-vendors', filter],
    queryFn: async () => {
      const verified = filter === 'verified' ? 'true' : filter === 'unverified' ? 'false' : '';
      const res = await api.get(`/api/super-admin/vendors${verified ? `?verified=${verified}` : ''}`);
      return res.data;
    },
  });
}

export function useUpdateVendorStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ vendorId, verified }: { vendorId: string; verified: boolean }) => {
      const res = await api.put(`/api/super-admin/vendors/${vendorId}/status`, { verified });
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-vendors'] });
    },
  });
}
