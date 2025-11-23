'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useSession } from '@/lib/auth-client';
import api from '@/lib/api';

const STATUS_COLORS: Record<string, string> = {
  PLACED: 'bg-yellow-100 text-yellow-800',
  ACCEPTED: 'bg-blue-100 text-blue-800',
  PREPARING: 'bg-purple-100 text-purple-800',
  READY: 'bg-green-100 text-green-800',
  OUT_FOR_DELIVERY: 'bg-indigo-100 text-indigo-800',
  DELIVERED: 'bg-teal-100 text-teal-800',
  COMPLETED: 'bg-gray-100 text-gray-800',
  CANCELLED: 'bg-red-100 text-red-800',
};

export default function OrdersPage() {
  const { data: session } = useSession();
  const queryClient = useQueryClient();
  const [statusFilter, setStatusFilter] = useState('');

  const { data: orders, isLoading } = useQuery({
    queryKey: ['orders', statusFilter],
    queryFn: async () => {
      let endpoint = '/api';

      if (session?.user.role === 'VENDOR') {
        endpoint += `/vendor/orders${statusFilter ? `?status=${statusFilter}` : ''}`;
      } else if (session?.user.role === 'STEPPER') {
        endpoint += `/stepper/orders${statusFilter ? `?status=${statusFilter}` : ''}`;
      } else if (session?.user.role === 'CUSTOMER') {
        endpoint += `/customer/orders${statusFilter ? `?status=${statusFilter}` : ''}`;
      }

      const res = await api.get(endpoint);
      return res.data;
    },
    enabled: !!session,
  });

  const updateStatusMutation = useMutation({
    mutationFn: async ({ orderId, status }: { orderId: string; status: string }) => {
      const res = await api.put(`/api/orders/${orderId}/status`, { status });
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
    },
  });

  const acceptOrderMutation = useMutation({
    mutationFn: async (orderId: string) => {
      const res = await api.post(`/api/orders/${orderId}/accept`);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      queryClient.invalidateQueries({ queryKey: ['available-orders'] });
    },
  });

  const handleStatusUpdate = (orderId: string, status: string) => {
    updateStatusMutation.mutate({ orderId, status });
  };

  if (isLoading) {
    return <div className="text-center py-12">Loading orders...</div>;
  }

  const getAvailableStatuses = (currentStatus: string, role: string) => {
    if (role === 'VENDOR') {
      const vendorStatuses = {
        PLACED: ['ACCEPTED', 'CANCELLED'],
        ACCEPTED: ['PREPARING'],
        PREPARING: ['READY'],
        READY: [],
        OUT_FOR_DELIVERY: [],
        DELIVERED: ['COMPLETED'],
      };
      return vendorStatuses[currentStatus as keyof typeof vendorStatuses] || [];
    } else if (role === 'STEPPER') {
      const stepperStatuses = {
        READY: ['OUT_FOR_DELIVERY'],
        OUT_FOR_DELIVERY: ['DELIVERED'],
      };
      return stepperStatuses[currentStatus as keyof typeof stepperStatuses] || [];
    }
    return [];
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Orders</h1>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">All Orders</option>
          <option value="PLACED">Placed</option>
          <option value="ACCEPTED">Accepted</option>
          <option value="PREPARING">Preparing</option>
          <option value="READY">Ready</option>
          <option value="OUT_FOR_DELIVERY">Out for Delivery</option>
          <option value="DELIVERED">Delivered</option>
          <option value="COMPLETED">Completed</option>
        </select>
      </div>

      {/* Orders List */}
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
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${STATUS_COLORS[order.status]}`}>
                {order.status.replace(/_/g, ' ')}
              </span>
            </div>

            {/* Customer/Vendor Info */}
            {session?.user.role === 'VENDOR' && order.customer && (
              <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                <p className="text-sm font-medium text-gray-700">Customer:</p>
                <p className="text-sm text-gray-900">{order.customer.user.name}</p>
                {order.customer.user.phone && (
                  <p className="text-sm text-gray-600">{order.customer.user.phone}</p>
                )}
                {order.deliveryAddress && (
                  <p className="text-sm text-gray-600">Delivery: {order.deliveryAddress}</p>
                )}
              </div>
            )}

            {session?.user.role === 'CUSTOMER' && order.vendor && (
              <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                <p className="text-sm font-medium text-gray-700">Vendor:</p>
                <p className="text-sm text-gray-900">{order.vendor.shopName}</p>
                <p className="text-sm text-gray-600">{order.vendor.address}</p>
              </div>
            )}

            {session?.user.role === 'STEPPER' && (
              <div className="mb-4 p-3 bg-gray-50 rounded-lg grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-gray-700">Pickup:</p>
                  <p className="text-sm text-gray-900">{order.vendor?.shopName}</p>
                  <p className="text-sm text-gray-600">{order.vendor?.address}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-700">Delivery:</p>
                  <p className="text-sm text-gray-900">{order.customer?.user.name}</p>
                  <p className="text-sm text-gray-600">{order.customer?.hall || order.deliveryAddress}</p>
                </div>
              </div>
            )}

            {/* Order Items */}
            <div className="mb-4">
              <p className="text-sm font-medium text-gray-700 mb-2">Items:</p>
              <div className="space-y-1">
                {order.items?.map((item: any) => (
                  <div key={item.id} className="flex justify-between text-sm">
                    <span className="text-gray-900">
                      {item.quantity}x {item.product.name}
                    </span>
                    <span className="text-gray-600">${(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>
              <div className="flex justify-between font-semibold text-gray-900 mt-2 pt-2 border-t">
                <span>Total:</span>
                <span>${order.total.toFixed(2)}</span>
              </div>
            </div>

            {/* Actions */}
            {getAvailableStatuses(order.status, session?.user.role || '').length > 0 && (
              <div className="flex space-x-2">
                {getAvailableStatuses(order.status, session?.user.role || '').map((status) => (
                  <button
                    key={status}
                    onClick={() => handleStatusUpdate(order.id, status)}
                    disabled={updateStatusMutation.isPending}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                  >
                    {updateStatusMutation.isPending ? 'Updating...' : `Mark as ${status.replace(/_/g, ' ')}`}
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      {orders?.length === 0 && (
        <div className="text-center py-12 bg-white rounded-lg shadow">
          <p className="text-gray-500">No orders found</p>
        </div>
      )}
    </div>
  );
}
