'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';

export default function BrowseVendorsPage() {
  const router = useRouter();
  const [search, setSearch] = useState('');

  const { data: vendors, isLoading } = useQuery({
    queryKey: ['vendors', search],
    queryFn: async () => {
      const res = await api.get(`/api/vendor/list${search ? `?search=${search}` : ''}`);
      return res.data;
    },
  });

  if (isLoading) {
    return <div className="text-center py-12">Loading vendors...</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Browse Vendors</h1>
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search vendors..."
          className="w-full max-w-md px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {vendors?.map((vendor: any) => (
          <div
            key={vendor.id}
            onClick={() => router.push(`/dashboard/vendor/${vendor.id}`)}
            className="bg-white rounded-lg shadow hover:shadow-lg transition cursor-pointer"
          >
            {vendor.logoUrl && (
              <img
                src={vendor.logoUrl}
                alt={vendor.shopName}
                className="w-full h-48 object-cover rounded-t-lg"
              />
            )}
            <div className="p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {vendor.shopName}
              </h3>
              {vendor.businessType && (
                <span className="inline-block px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded mb-2">
                  {vendor.businessType}
                </span>
              )}
              {vendor.description && (
                <p className="text-sm text-gray-600 mb-3">{vendor.description}</p>
              )}
              {vendor.address && (
                <p className="text-sm text-gray-500 mb-2">{vendor.address}</p>
              )}
              {vendor.hours && (
                <p className="text-sm text-gray-500">
                  {vendor.hours.open} - {vendor.hours.close}
                </p>
              )}
              <div className="mt-4 pt-4 border-t flex justify-between items-center text-sm text-gray-600">
                <span>{vendor._count?.products || 0} Products</span>
                <button className="text-blue-600 hover:text-blue-700 font-medium">
                  View Menu →
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {vendors?.length === 0 && (
        <div className="text-center py-12 bg-white rounded-lg shadow">
          <p className="text-gray-500">No vendors found</p>
        </div>
      )}
    </div>
  );
}
