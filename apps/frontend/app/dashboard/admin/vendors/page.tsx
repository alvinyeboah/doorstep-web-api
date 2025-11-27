'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAdminVendors, useUpdateVendorStatus } from '@/hooks/useAdminVendors';
import Image from 'next/image';
import { Vendor } from '@/types';

export default function AdminVendorsPage() {
  const router = useRouter();
  const [filter, setFilter] = useState<'all' | 'verified' | 'unverified'>('all');

  const { data: vendors, isLoading } = useAdminVendors(filter);
  const updateStatusMutation = useUpdateVendorStatus();

  const handleApprove = (vendorId: string) => {
    if (confirm('Approve this vendor?')) {
      updateStatusMutation.mutate({ vendorId, verified: true });
    }
  };

  const handleReject = (vendorId: string) => {
    if (confirm('Reject this vendor?')) {
      updateStatusMutation.mutate({ vendorId, verified: false });
    }
  };

  if (isLoading) {
    return <div className="text-center py-12">Loading vendors...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Vendor Management</h1>
          <p className="text-gray-600">Manage all companies on the platform</p>
        </div>

        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value as 'all' | 'verified' | 'unverified')}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="all">All Vendors</option>
          <option value="verified">Verified Only</option>
          <option value="unverified">Pending Approval</option>
        </select>
      </div>

      {/* Vendors Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {vendors?.map((vendor: Vendor) => (
          <div key={vendor.id} className="bg-white rounded-lg shadow p-6">
            {vendor.logoUrl && (
              <div className="relative w-full h-32 mb-4">
                <Image
                  src={vendor.logoUrl}
                  alt={vendor.shopName}
                  fill
                  className="object-cover rounded-lg"
                />
              </div>
            )}

            <div className="space-y-3">
              <div className="flex justify-between items-start">
                <h3 className="text-lg font-semibold text-gray-900">{vendor.shopName}</h3>
                <span
                  className={`px-2 py-1 text-xs rounded-full ${vendor.verified
                    ? 'bg-green-100 text-green-800'
                    : 'bg-yellow-100 text-yellow-800'
                    }`}
                >
                  {vendor.verified ? 'Verified' : 'Pending'}
                </span>
              </div>

              {vendor.businessType && (
                <div className="text-sm text-gray-600">{vendor.businessType}</div>
              )}

              <div className="text-sm text-gray-500">
                <div>Owner: {vendor.user.name}</div>
                <div>Email: {vendor.user.email}</div>
                {vendor.user.phone && <div>Phone: {vendor.user.phone}</div>}
              </div>

              {vendor.address && (
                <div className="text-sm text-gray-600">{vendor.address}</div>
              )}

              <div className="flex justify-between text-sm text-gray-500 pt-3 border-t">
                <span>{vendor._count?.products || 0} Products</span>
                <span>{vendor._count?.orders || 0} Orders</span>
              </div>

              <div className="flex space-x-2 pt-3">
                <button
                  onClick={() => router.push(`/dashboard/admin/vendors/${vendor.id}`)}
                  className="flex-1 px-3 py-2 bg-blue-100 text-blue-700 rounded hover:bg-blue-200"
                >
                  View Details
                </button>

                {!vendor.verified ? (
                  <button
                    onClick={() => handleApprove(vendor.id)}
                    disabled={updateStatusMutation.isPending}
                    className="flex-1 px-3 py-2 bg-green-100 text-green-700 rounded hover:bg-green-200 disabled:opacity-50"
                  >
                    Approve
                  </button>
                ) : (
                  <button
                    onClick={() => handleReject(vendor.id)}
                    disabled={updateStatusMutation.isPending}
                    className="flex-1 px-3 py-2 bg-red-100 text-red-700 rounded hover:bg-red-200 disabled:opacity-50"
                  >
                    Revoke
                  </button>
                )}
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
