'use client';

import Link from 'next/link';
import { useAdminAnalytics } from '@/hooks/useAdminAnalytics';

export default function SuperAdminDashboard() {
  const { data: analytics, isLoading } = useAdminAnalytics();

  if (isLoading) {
    return <div className="text-center py-12">Loading analytics...</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Platform Overview</h1>
        <p className="text-gray-600">Super Admin Dashboard</p>
      </div>

      {/* Main Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="text-sm font-medium text-gray-500">Total Vendors</div>
          <div className="mt-2 text-3xl font-bold text-blue-600">
            {analytics?.totalVendors || 0}
          </div>
          <Link href="/dashboard/admin/vendors" className="text-sm text-blue-600 hover:text-blue-700 mt-2 inline-block">
            View all →
          </Link>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="text-sm font-medium text-gray-500">Total Steppers</div>
          <div className="mt-2 text-3xl font-bold text-green-600">
            {analytics?.totalSteppers || 0}
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="text-sm font-medium text-gray-500">Total Customers</div>
          <div className="mt-2 text-3xl font-bold text-purple-600">
            {analytics?.totalCustomers || 0}
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="text-sm font-medium text-gray-500">Total Orders</div>
          <div className="mt-2 text-3xl font-bold text-gray-900">
            {analytics?.totalOrders || 0}
          </div>
          <Link href="/dashboard/admin/orders" className="text-sm text-blue-600 hover:text-blue-700 mt-2 inline-block">
            View all →
          </Link>
        </div>
      </div>

      {/* Revenue & Orders Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-6 rounded-lg shadow text-white">
          <div className="text-sm font-medium opacity-90">Total Platform Revenue</div>
          <div className="mt-2 text-4xl font-bold">
            ${analytics?.totalRevenue?.toFixed(2) || '0.00'}
          </div>
          <Link href="/dashboard/admin/revenue" className="text-sm opacity-90 hover:opacity-100 mt-2 inline-block">
            View breakdown →
          </Link>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="text-sm font-medium text-gray-500 mb-4">Order Status</div>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Pending</span>
              <span className="text-lg font-semibold text-yellow-600">
                {analytics?.pendingOrders || 0}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Active</span>
              <span className="text-lg font-semibold text-blue-600">
                {analytics?.activeOrders || 0}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Completed</span>
              <span className="text-lg font-semibold text-green-600">
                {analytics?.completedOrders || 0}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow">
        <div className="p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-900">Quick Actions</h2>
        </div>
        <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link
            href="/dashboard/admin/vendors"
            className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition"
          >
            <div className="font-medium text-gray-900">Manage Vendors</div>
            <div className="text-sm text-gray-500">View and approve vendor registrations</div>
          </Link>

          <Link
            href="/dashboard/admin/orders"
            className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition"
          >
            <div className="font-medium text-gray-900">View All Orders</div>
            <div className="text-sm text-gray-500">Monitor orders across all vendors</div>
          </Link>

          <Link
            href="/dashboard/admin/revenue"
            className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition"
          >
            <div className="font-medium text-gray-900">Revenue Analytics</div>
            <div className="text-sm text-gray-500">Track earnings by vendor</div>
          </Link>
        </div>
      </div>
    </div>
  );
}
