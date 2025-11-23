'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';

export default function WalletPage() {
  const queryClient = useQueryClient();
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [depositAmount, setDepositAmount] = useState('');

  const { data: wallet } = useQuery({
    queryKey: ['wallet'],
    queryFn: async () => {
      const res = await api.get('/api/stepper/wallet');
      return res.data;
    },
  });

  const { data: commissionHistory } = useQuery({
    queryKey: ['commission-history'],
    queryFn: async () => {
      const res = await api.get('/api/stepper/commission-history');
      return res.data;
    },
  });

  const { data: withdrawals } = useQuery({
    queryKey: ['withdrawals'],
    queryFn: async () => {
      const res = await api.get('/api/stepper/withdrawals');
      return res.data;
    },
  });

  const depositMutation = useMutation({
    mutationFn: async (amount: number) => {
      const res = await api.post('/api/stepper/deposit', { amount });
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['wallet'] });
      setDepositAmount('');
    },
  });

  const withdrawMutation = useMutation({
    mutationFn: async (amount: number) => {
      const res = await api.post('/api/stepper/withdrawal', { amount });
      return res.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['wallet'] });
      queryClient.invalidateQueries({ queryKey: ['withdrawals'] });
      setWithdrawAmount('');
      alert(`Withdrawal request created! 2FA Code: ${data.twoFactorCode}`);
    },
  });

  const handleDeposit = (e: React.FormEvent) => {
    e.preventDefault();
    const amount = parseFloat(depositAmount);
    if (amount > 0) {
      depositMutation.mutate(amount);
    }
  };

  const handleWithdraw = (e: React.FormEvent) => {
    e.preventDefault();
    const amount = parseFloat(withdrawAmount);
    if (amount > 0 && amount <= (wallet?.balance || 0)) {
      withdrawMutation.mutate(amount);
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Wallet</h1>

      {/* Wallet Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="text-sm font-medium text-gray-500">Available Balance</div>
          <div className="mt-2 text-3xl font-bold text-gray-900">
            ${wallet?.balance?.toFixed(2) || '0.00'}
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="text-sm font-medium text-gray-500">Total Earned</div>
          <div className="mt-2 text-3xl font-bold text-green-600">
            ${wallet?.totalEarned?.toFixed(2) || '0.00'}
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="text-sm font-medium text-gray-500">Deposit Amount</div>
          <div className="mt-2 text-3xl font-bold text-blue-600">
            ${wallet?.depositAmount?.toFixed(2) || '0.00'}
          </div>
        </div>
      </div>

      {/* Deposit & Withdraw Forms */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Make Deposit</h2>
          <form onSubmit={handleDeposit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Amount
              </label>
              <input
                type="number"
                step="0.01"
                min="0"
                value={depositAmount}
                onChange={(e) => setDepositAmount(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="0.00"
              />
            </div>
            <button
              type="submit"
              disabled={depositMutation.isPending || !depositAmount}
              className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              {depositMutation.isPending ? 'Processing...' : 'Deposit'}
            </button>
          </form>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Request Withdrawal</h2>
          <form onSubmit={handleWithdraw} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Amount
              </label>
              <input
                type="number"
                step="0.01"
                min="0"
                max={wallet?.balance || 0}
                value={withdrawAmount}
                onChange={(e) => setWithdrawAmount(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="0.00"
              />
              <p className="text-xs text-gray-500 mt-1">
                Available: ${wallet?.balance?.toFixed(2) || '0.00'}
              </p>
            </div>
            <button
              type="submit"
              disabled={withdrawMutation.isPending || !withdrawAmount}
              className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
            >
              {withdrawMutation.isPending ? 'Processing...' : 'Request Withdrawal'}
            </button>
          </form>
        </div>
      </div>

      {/* Commission History */}
      <div className="bg-white rounded-lg shadow">
        <div className="p-6 border-b">
          <h2 className="text-lg font-semibold text-gray-900">Commission History</h2>
        </div>
        <div className="divide-y">
          {commissionHistory?.slice(0, 10).map((item: any) => (
            <div key={item.id} className="p-4 flex justify-between items-center">
              <div>
                <p className="text-sm font-medium text-gray-900">
                  Order #{item.order.id.substring(0, 8)}
                </p>
                <p className="text-xs text-gray-500">
                  {new Date(item.createdAt).toLocaleString()}
                </p>
              </div>
              <span className="text-sm font-semibold text-green-600">
                +${item.amount.toFixed(2)}
              </span>
            </div>
          ))}
          {(!commissionHistory || commissionHistory.length === 0) && (
            <div className="p-8 text-center text-gray-500">
              No commission history yet
            </div>
          )}
        </div>
      </div>

      {/* Withdrawal Requests */}
      <div className="bg-white rounded-lg shadow">
        <div className="p-6 border-b">
          <h2 className="text-lg font-semibold text-gray-900">Withdrawal Requests</h2>
        </div>
        <div className="divide-y">
          {withdrawals?.slice(0, 10).map((item: any) => (
            <div key={item.id} className="p-4 flex justify-between items-center">
              <div>
                <p className="text-sm font-medium text-gray-900">
                  ${item.amount.toFixed(2)}
                </p>
                <p className="text-xs text-gray-500">
                  {new Date(item.createdAt).toLocaleString()}
                </p>
              </div>
              <span
                className={`text-sm font-medium ${
                  item.status === 'APPROVED'
                    ? 'text-green-600'
                    : item.status === 'REJECTED'
                    ? 'text-red-600'
                    : 'text-yellow-600'
                }`}
              >
                {item.status}
              </span>
            </div>
          ))}
          {(!withdrawals || withdrawals.length === 0) && (
            <div className="p-8 text-center text-gray-500">
              No withdrawal requests yet
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
