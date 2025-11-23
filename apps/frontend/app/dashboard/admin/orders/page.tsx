'use client';

import { useState } from 'react';
import { useAdminOrders } from '@/hooks/useAdminOrders';
import { OrderStatus } from '@/types';

const STATUS_COLORS: Record<OrderStatus, string> = {
  PLACED: 'bg-yellow-100 text-yellow-800',
  ACCEPTED: 'bg-blue-100 text-blue-800',
  PREPARING: 'bg-purple-100 text-purple-800',
  READY: 'bg-green-100 text-green-800',
  OUT_FOR_DELIVERY: 'bg-indigo-100 text-indigo-800',
  DELIVERED: 'bg-teal-100 text-teal-800',
  COMPLETED: 'bg-gray-100 text-gray-800',
  CANCELLED: 'bg-red-100 text-red-800',
};

export default function AdminOrdersPage() {
  const [statusFilter, setStatusFilter] = useState('');

  const { data: orders, isLoading } = useAdminOrders(statusFilter);

  if (isLoading) {
    return <div className="text-center py-12">Loading orders...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">All Platform Orders</h1>
          <p className="text-gray-600">View orders across all vendors</p>
        </div>

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
          <option value="CANCELLED">Cancelled</option>
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

            {/* Vendor Info */}
            <div className="mb-4 p-3 bg-blue-50 rounded-lg">
              <p className="text-sm font-medium text-gray-700">Vendor:</p>
              <p className="text-sm text-gray-900">{order.vendor.shopName}</p>
              <p className="text-xs text-gray-600">{order.vendor.user.email}</p>
            </div>

            {/* Customer Info */}
            <div className="mb-4 p-3 bg-purple-50 rounded-lg">
              <p className="text-sm font-medium text-gray-700">Customer:</p>
              <p className="text-sm text-gray-900">{order.customer.user.name}</p>
              <p className="text-xs text-gray-600">{order.customer.user.email}</p>
              {order.deliveryAddress && (
                <p className="text-xs text-gray-600">Delivery: {order.deliveryAddress}</p>
              )}
            </div>

            {/* Stepper Info */}
            {order.stepper && (
              <div className="mb-4 p-3 bg-green-50 rounded-lg">
                <p className="text-sm font-medium text-gray-700">Stepper:</p>
                <p className="text-sm text-gray-900">{order.stepper.user.name}</p>
                <p className="text-xs text-gray-600">{order.stepper.user.phone}</p>
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
