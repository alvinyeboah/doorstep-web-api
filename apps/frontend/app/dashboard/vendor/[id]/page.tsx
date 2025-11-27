'use client';

import { useParams, useRouter } from 'next/navigation';
import { useVendorDetails, useVendorProducts } from '@/hooks/useVendors';
import { useAddToCart } from '@/hooks/useCart';
import Image from 'next/image';
import { Product } from '@/types';

export default function VendorProductsPage() {
  const router = useRouter();
  const params = useParams();
  const vendorId = params.id as string;

  const { data: vendor } = useVendorDetails(vendorId);
  const { data: products, isLoading } = useVendorProducts(vendorId);
  const addToCartMutation = useAddToCart();

  const handleAddToCart = (productId: string) => {
    addToCartMutation.mutate(
      { productId, quantity: 1 },
      {
        onSuccess: () => {
          alert('Added to cart!');
        },
      }
    );
  };

  if (isLoading) {
    return <div className="text-center py-12">Loading menu...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Vendor Header */}
      {vendor && (
        <div className="bg-white rounded-lg shadow p-6">
          <button
            onClick={() => router.back()}
            className="text-blue-600 hover:text-blue-700 mb-4"
          >
            ← Back to Vendors
          </button>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{vendor.shopName}</h1>
          {vendor.description && (
            <p className="text-gray-600 mb-4">{vendor.description}</p>
          )}
          {vendor.address && (
            <p className="text-sm text-gray-500">{vendor.address}</p>
          )}
          {vendor.hours && (
            <p className="text-sm text-gray-500">
              Hours: {vendor.hours.open} - {vendor.hours.close}
            </p>
          )}
        </div>
      )}

      {/* Products Grid */}
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Menu</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products?.map((product: Product) => (
            <div key={product.id} className="bg-white rounded-lg shadow overflow-hidden">
              {product.photoUrl && (
                <div className="relative w-full h-48">
                  <Image
                    src={product.photoUrl}
                    alt={product.name}
                    fill
                    className="object-cover"
                  />
                </div>
              )}
              <div className="p-6">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-lg font-semibold text-gray-900">{product.name}</h3>
                  <span className="text-lg font-bold text-blue-600">
                    ${product.price.toFixed(2)}
                  </span>
                </div>
                {product.category && (
                  <span className="inline-block px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded mb-2">
                    {product.category}
                  </span>
                )}
                {product.description && (
                  <p className="text-sm text-gray-600 mb-4">{product.description}</p>
                )}
                <button
                  onClick={() => handleAddToCart(product.id)}
                  disabled={!product.available || addToCartMutation.isPending}
                  className={`w-full px-4 py-2 rounded-lg font-medium ${product.available
                    ? 'bg-blue-600 text-white hover:bg-blue-700'
                    : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                    } disabled:opacity-50`}
                >
                  {addToCartMutation.isPending
                    ? 'Adding...'
                    : product.available
                      ? 'Add to Cart'
                      : 'Unavailable'}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {products?.length === 0 && (
        <div className="text-center py-12 bg-white rounded-lg shadow">
          <p className="text-gray-500">No products available</p>
        </div>
      )}
    </div>
  );
}
