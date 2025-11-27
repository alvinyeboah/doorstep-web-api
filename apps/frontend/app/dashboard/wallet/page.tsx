'use client';

import { useState } from 'react';
import {
  useWallet,
  useCommissionHistory,
  useWithdrawals,
  useDeposit,
  useWithdraw,
} from '@/hooks/useWallet';
import { Commission, Withdrawal } from '@/types';

export default function WalletPage() {
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [depositAmount, setDepositAmount] = useState('');

  const { data: wallet } = useWallet();
  const { data: commissionHistory } = useCommissionHistory();
  const { data: withdrawals } = useWithdrawals();
  const depositMutation = useDeposit();
  const withdrawMutation = useWithdraw();

  const handleDeposit = () => {
    const amount = parseFloat(depositAmount);
    if (amount > 0) {
      depositMutation.mutate(amount, {
        onSuccess: () => {
          setDepositAmount('');
        },
      });
    }
  };

  const handleWithdraw = () => {
    const amount = parseFloat(withdrawAmount);
    if (amount > 0 && wallet && amount <= wallet.balance) {
      withdrawMutation.mutate(amount, {
        onSuccess: (data: { twoFactorCode: string }) => {
          setWithdrawAmount('');
          alert(`Withdrawal request created! 2FA Code: ${data.twoFactorCode}`);
        },
      });
    } else {
      alert('Insufficient balance or invalid amount');
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Wallet</h1>

      {/* Wallet Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="text-sm font-medium text-gray-500">Available Balance</div>
          <div className="mt-2 text-3xl font-bold text-green-600">
            ${wallet?.balance?.toFixed(2) || '0.00'}
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="text-sm font-medium text-gray-500">Total Earned</div>
          <div className="mt-2 text-3xl font-bold text-gray-900">
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

      {/* Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Deposit</h2>
          <input
            type="number"
            value={depositAmount}
            onChange={(e) => setDepositAmount(e.target.value)}
            placeholder="Enter amount"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg mb-4"
          />
          <button
            onClick={handleDeposit}
            disabled={depositMutation.isPending}
            className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            {depositMutation.isPending ? 'Processing...' : 'Deposit'}
          </button>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Withdraw</h2>
          <input
            type="number"
            value={withdrawAmount}
            onChange={(e) => setWithdrawAmount(e.target.value)}
            placeholder="Enter amount"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg mb-4"
          />
          <button
            onClick={handleWithdraw}
            disabled={withdrawMutation.isPending}
            className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
          >
            {withdrawMutation.isPending ? 'Processing...' : 'Withdraw'}
          </button>
        </div>
      </div>

      {/* Commission History */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Commission History</h2>
        <div className="space-y-2">
          {commissionHistory?.map((commission: Commission) => (
            <div key={commission.id} className="flex justify-between items-center border-b pb-2">
              <div>
                <div className="text-sm text-gray-600">Order: {commission.orderId.substring(0, 8)}</div>
                <div className="text-xs text-gray-500">{new Date(commission.createdAt).toLocaleDateString()}</div>
              </div>
              <div className="text-sm font-semibold text-green-600">
                +${commission.amount.toFixed(2)}
              </div>
            </div>
          ))}
          {(!commissionHistory || commissionHistory.length === 0) && (
            <div className="text-center text-gray-500 py-4">No commission history</div>
          )}
        </div>
      </div>

      {/* Withdrawal Requests */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Withdrawal Requests</h2>
        <div className="space-y-2">
          {withdrawals?.map((withdrawal: Withdrawal) => (
            <div key={withdrawal.id} className="flex justify-between items-center border-b pb-2">
              <div>
                <div className="text-sm font-medium text-gray-900">${withdrawal.amount.toFixed(2)}</div>
                <div className="text-xs text-gray-500">{new Date(withdrawal.createdAt).toLocaleDateString()}</div>
              </div>
              <span className={`px-2 py-1 text-xs rounded-full ${withdrawal.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                withdrawal.status === 'APPROVED' ? 'bg-green-100 text-green-800' :
                  'bg-red-100 text-red-800'
                }`}>
                {withdrawal.status}
              </span>
            </div>
          ))}
          {(!withdrawals || withdrawals.length === 0) && (
            <div className="text-center text-gray-500 py-4">No withdrawal requests</div>
          )}
        </div>
      </div>
    </div>
  );
}
