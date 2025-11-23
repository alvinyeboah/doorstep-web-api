'use client';

import { useSession } from '@/lib/auth-client';
import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';

export default function DashboardPage() {
  const { data: session } = useSession();

  const { data: stats } = useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: async () => {
      if (session?.user.role === 'VENDOR') {
        const res = await api.get('/api/vendor/analytics');
        return res.data;
      } else if (session?.user.role === 'CUSTOMER') {
        const res = await api.get('/api/customer/orders');
        return { totalOrders: res.data.length };
      } else if (session?.user.role === 'STEPPER') {
        const res = await api.get('/api/stepper/wallet');
        return res.data;
      }
      return {};
    },
    enabled: !!session,
  });

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900">
        Welcome, {session?.user.name}!
      </h1>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {session?.user.role === 'VENDOR' && stats && (
          <>
            <div className="bg-white p-6 rounded-lg shadow">
              <div className="text-sm font-medium text-gray-500">Total Orders</div>
              <div className="mt-2 text-3xl font-semibold text-gray-900">
                {stats.totalOrders || 0}
              </div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
              <div className="text-sm font-medium text-gray-500">Total Revenue</div>
              <div className="mt-2 text-3xl font-semibold text-gray-900">
                ${stats.totalRevenue?.toFixed(2) || '0.00'}
              </div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
              <div className="text-sm font-medium text-gray-500">Total Products</div>
              <div className="mt-2 text-3xl font-semibold text-gray-900">
                {stats.totalProducts || 0}
              </div>
            </div>
          </>
        )}

        {session?.user.role === 'STEPPER' && stats && (
          <>
            <div className="bg-white p-6 rounded-lg shadow">
              <div className="text-sm font-medium text-gray-500">Wallet Balance</div>
              <div className="mt-2 text-3xl font-semibold text-gray-900">
                ${stats.balance?.toFixed(2) || '0.00'}
              </div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
              <div className="text-sm font-medium text-gray-500">Total Earned</div>
              <div className="mt-2 text-3xl font-semibold text-gray-900">
                ${stats.totalEarned?.toFixed(2) || '0.00'}
              </div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
              <div className="text-sm font-medium text-gray-500">Deposit Amount</div>
              <div className="mt-2 text-3xl font-semibold text-gray-900">
                ${stats.depositAmount?.toFixed(2) || '0.00'}
              </div>
            </div>
          </>
        )}

        {session?.user.role === 'CUSTOMER' && stats && (
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="text-sm font-medium text-gray-500">Total Orders</div>
            <div className="mt-2 text-3xl font-semibold text-gray-900">
              {stats.totalOrders || 0}
            </div>
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {session?.user.role === 'VENDOR' && (
            <>
              <a
                href="/dashboard/products"
                className="block p-4 border border-gray-200 rounded-lg hover:bg-gray-50"
              >
                <div className="font-medium text-gray-900">Manage Products</div>
                <div className="text-sm text-gray-500">Add, edit, or remove menu items</div>
              </a>
              <a
                href="/dashboard/orders"
                className="block p-4 border border-gray-200 rounded-lg hover:bg-gray-50"
              >
                <div className="font-medium text-gray-900">View Orders</div>
                <div className="text-sm text-gray-500">Manage incoming orders</div>
              </a>
            </>
          )}

          {session?.user.role === 'STEPPER' && (
            <>
              <a
                href="/dashboard/orders"
                className="block p-4 border border-gray-200 rounded-lg hover:bg-gray-50"
              >
                <div className="font-medium text-gray-900">Available Orders</div>
                <div className="text-sm text-gray-500">Browse and accept deliveries</div>
              </a>
              <a
                href="/dashboard/wallet"
                className="block p-4 border border-gray-200 rounded-lg hover:bg-gray-50"
              >
                <div className="font-medium text-gray-900">Manage Wallet</div>
                <div className="text-sm text-gray-500">View earnings and withdraw</div>
              </a>
            </>
          )}

          {session?.user.role === 'CUSTOMER' && (
            <a
              href="/dashboard/orders"
              className="block p-4 border border-gray-200 rounded-lg hover:bg-gray-50"
            >
              <div className="font-medium text-gray-900">Browse Vendors</div>
              <div className="text-sm text-gray-500">Order food from campus shops</div>
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
