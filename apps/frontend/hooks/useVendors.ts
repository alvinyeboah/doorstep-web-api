import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';
import { Vendor, Product } from '@/types';

export function useVendors(search: string = '') {
  return useQuery<Vendor[]>({
    queryKey: ['vendors', search],
    queryFn: async () => {
      const res = await api.get(`/api/vendor/list${search ? `?search=${search}` : ''}`);
      return res.data;
    },
  });
}

export function useVendorDetails(vendorId: string) {
  return useQuery<Vendor>({
    queryKey: ['vendor', vendorId],
    queryFn: async () => {
      const res = await api.get(`/api/vendor/profile/${vendorId}`);
      return res.data;
    },
    enabled: !!vendorId,
  });
}

export function useVendorProducts(vendorId: string) {
  return useQuery<Product[]>({
    queryKey: ['vendor-products', vendorId],
    queryFn: async () => {
      const res = await api.get(`/api/products/vendor/${vendorId}`);
      return res.data;
    },
    enabled: !!vendorId,
  });
}
