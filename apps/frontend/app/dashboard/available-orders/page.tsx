'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';

export default function AvailableOrdersPage() {
  const queryClient = useQueryClient();

  const { data: orders, isLoading } = useQuery({
    queryKey: ['available-orders'],
    queryFn: async () => {
      const res = await api.get('/api/orders/available/list');
      return res.data;
    },
    refetchInterval: 10000, // Refresh every 10 seconds
  });

  const acceptMutation = useMutation({
    mutationFn: async (orderId: string) => {
      const res = await api.post(`/api/orders/${orderId}/accept`);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['available-orders'] });
      queryClient.invalidateQueries({ queryKey: ['orders'] });
    },
  });

  if (isLoading) {
    return <div className="text-center py-12">Loading available orders...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Available Deliveries</h1>
        <div className="text-sm text-gray-600">
          Auto-refreshes every 10 seconds
        </div>
      </div>

      <div className="space-y-4">
        {orders?.map((order: any) => (
          <div key={order.id} className="bg-white rounded-lg shadow p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  Order #{order.id.substring(0, 8)}
                </h3>
                <p className="text-sm text-gray-600">
                  {new Date(order.createdAt).toLocaleString()}
                </p>
              </div>
              <span className="text-xl font-bold text-blue-600">
                ${order.total.toFixed(2)}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="p-3 bg-gray-50 rounded-lg">
                <p className="text-sm font-medium text-gray-700 mb-1">Pickup Location:</p>
                <p className="text-sm text-gray-900">{order.vendor.shopName}</p>
                <p className="text-sm text-gray-600">{order.vendor.address}</p>
              </div>
              <div className="p-3 bg-gray-50 rounded-lg">
                <p className="text-sm font-medium text-gray-700 mb-1">Delivery Location:</p>
                <p className="text-sm text-gray-900">{order.customer.hall || 'Address provided'}</p>
                {order.customer.address && (
                  <p className="text-sm text-gray-600">{order.customer.address}</p>
                )}
              </div>
            </div>

            <button
              onClick={() => acceptMutation.mutate(order.id)}
              disabled={acceptMutation.isPending}
              className="w-full px-4 py-3 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 disabled:opacity-50"
            >
              {acceptMutation.isPending ? 'Accepting...' : 'Accept Delivery'}
            </button>
          </div>
        ))}
      </div>

      {orders?.length === 0 && (
        <div className="text-center py-12 bg-white rounded-lg shadow">
          <p className="text-gray-500 text-lg mb-2">No available deliveries right now</p>
          <p className="text-sm text-gray-400">Check back soon!</p>
        </div>
      )}
    </div>
  );
}
