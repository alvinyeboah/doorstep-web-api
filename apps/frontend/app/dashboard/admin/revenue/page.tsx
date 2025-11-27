'use client';

import { useAdminRevenue } from '@/hooks/useAdminRevenue';
import { VendorRevenue } from '@/types';

export default function AdminRevenuePage() {
  const { data: revenueData, isLoading } = useAdminRevenue();

  const totalRevenue = revenueData?.reduce((sum: number, vendor: VendorRevenue) => sum + vendor.totalRevenue, 0) || 0;
  const totalOrders = revenueData?.reduce((sum: number, vendor: VendorRevenue) => sum + vendor.totalOrders, 0) || 0;

  if (isLoading) {
    return <div className="text-center py-12">Loading revenue data...</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Revenue Analytics</h1>
        <p className="text-gray-600">Track earnings across all vendors</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-6 rounded-lg shadow text-white">
          <div className="text-sm font-medium opacity-90">Total Platform Revenue</div>
          <div className="mt-2 text-3xl font-bold">${totalRevenue.toFixed(2)}</div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="text-sm font-medium text-gray-500">Total Completed Orders</div>
          <div className="mt-2 text-3xl font-bold text-gray-900">{totalOrders}</div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="text-sm font-medium text-gray-500">Average Order Value</div>
          <div className="mt-2 text-3xl font-bold text-gray-900">
            ${totalOrders > 0 ? (totalRevenue / totalOrders).toFixed(2) : '0.00'}
          </div>
        </div>
      </div>

      {/* Revenue by Vendor Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="p-6 border-b">
          <h2 className="text-lg font-semibold text-gray-900">Revenue by Vendor</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Rank
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Vendor Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Owner
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total Orders
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total Revenue
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Avg Order
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {revenueData?.map((vendor: VendorRevenue, index: number) => (
                <tr key={vendor.vendorId} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <span
                        className={`text-sm font-semibold ${index === 0
                            ? 'text-yellow-600'
                            : index === 1
                              ? 'text-gray-400'
                              : index === 2
                                ? 'text-orange-600'
                                : 'text-gray-600'
                          }`}
                      >
                        #{index + 1}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{vendor.vendorName}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-600">{vendor.ownerName}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <div className="text-sm text-gray-900">{vendor.totalOrders}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <div className="text-sm font-semibold text-green-600">
                      ${vendor.totalRevenue.toFixed(2)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <div className="text-sm text-gray-600">
                      ${vendor.totalOrders > 0 ? (vendor.totalRevenue / vendor.totalOrders).toFixed(2) : '0.00'}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {revenueData?.length === 0 && (
        <div className="text-center py-12 bg-white rounded-lg shadow">
          <p className="text-gray-500">No revenue data available</p>
        </div>
      )}
    </div>
  );
}
