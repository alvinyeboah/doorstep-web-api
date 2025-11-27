'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  useCart,
  useUpdateCartItem,
  useClearCart,
  useCheckout,
} from '@/hooks/useCart';
import Image from 'next/image';
import { CartItem } from '@/types';

export default function CartPage() {
  const router = useRouter();
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [customerNotes, setCustomerNotes] = useState('');

  const { data: cart, isLoading } = useCart();
  const updateQuantityMutation = useUpdateCartItem();
  const clearCartMutation = useClearCart();
  const createOrderMutation = useCheckout();

  const handleCheckout = () => {
    if (!cart?.items || cart.items.length === 0) {
      alert('Cart is empty');
      return;
    }

    createOrderMutation.mutate({
      deliveryAddress,
      customerNotes,
    }, {
      onSuccess: () => {
        router.push('/dashboard/orders');
      }
    });
  };

  if (isLoading) {
    return <div className="text-center py-12">Loading cart...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Shopping Cart</h1>
        {cart?.items && cart.items.length > 0 && (
          <button
            onClick={() => {
              if (confirm('Clear entire cart?')) {
                clearCartMutation.mutate();
              }
            }}
            className="text-red-600 hover:text-red-700"
          >
            Clear Cart
          </button>
        )}
      </div>

      {cart?.items && cart.items.length > 0 ? (
        <>
          {/* Cart Items */}
          <div className="bg-white rounded-lg shadow divide-y">
            {cart.items.map((item: CartItem) => (
              <div key={item.id} className="p-6 flex items-center space-x-4">
                {item.product.photoUrl && (
                  <div className="relative w-20 h-20">
                    <Image
                      src={item.product.photoUrl}
                      alt={item.product.name}
                      fill
                      className="object-cover rounded"
                    />
                  </div>
                )}
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900">{item.product.name}</h3>
                  <p className="text-sm text-gray-600">{item.product.vendor?.shopName}</p>
                  <p className="text-sm text-gray-900 mt-1">
                    ${item.product.price.toFixed(2)} each
                  </p>
                </div>
                <div className="flex items-center space-x-3">
                  <button
                    onClick={() =>
                      updateQuantityMutation.mutate({
                        itemId: item.id,
                        quantity: item.quantity - 1,
                      })
                    }
                    className="w-8 h-8 flex items-center justify-center bg-gray-100 rounded hover:bg-gray-200"
                  >
                    -
                  </button>
                  <span className="w-8 text-center font-medium">{item.quantity}</span>
                  <button
                    onClick={() =>
                      updateQuantityMutation.mutate({
                        itemId: item.id,
                        quantity: item.quantity + 1,
                      })
                    }
                    className="w-8 h-8 flex items-center justify-center bg-gray-100 rounded hover:bg-gray-200"
                  >
                    +
                  </button>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-gray-900">
                    ${(item.product.price * item.quantity).toFixed(2)}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Order Details */}
          <div className="bg-white rounded-lg shadow p-6 space-y-4">
            <h2 className="text-lg font-semibold text-gray-900">Delivery Details</h2>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Delivery Address
              </label>
              <input
                type="text"
                value={deliveryAddress}
                onChange={(e) => setDeliveryAddress(e.target.value)}
                placeholder="Enter delivery address"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Notes (Optional)
              </label>
              <textarea
                value={customerNotes}
                onChange={(e) => setCustomerNotes(e.target.value)}
                rows={3}
                placeholder="Special instructions..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Checkout Summary */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="space-y-2 mb-4">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal</span>
                <span>${cart.total?.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Delivery Fee</span>
                <span>$0.00</span>
              </div>
              <div className="border-t pt-2 flex justify-between text-lg font-semibold text-gray-900">
                <span>Total</span>
                <span>${cart.total?.toFixed(2)}</span>
              </div>
            </div>
            <button
              onClick={handleCheckout}
              disabled={createOrderMutation.isPending}
              className="w-full px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              {createOrderMutation.isPending ? 'Placing Order...' : 'Place Order'}
            </button>
          </div>
        </>
      ) : (
        <div className="text-center py-12 bg-white rounded-lg shadow">
          <p className="text-gray-500 mb-4">Your cart is empty</p>
          <button
            onClick={() => router.push('/dashboard/browse')}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Browse Vendors
          </button>
        </div>
      )}
    </div>
  );
}
