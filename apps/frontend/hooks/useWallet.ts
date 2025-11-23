import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import { Wallet, Commission, Withdrawal } from '@/types';

export function useWallet() {
  return useQuery<Wallet>({
    queryKey: ['wallet'],
    queryFn: async () => {
      const res = await api.get('/api/stepper/wallet');
      return res.data;
    },
  });
}

export function useCommissionHistory() {
  return useQuery<Commission[]>({
    queryKey: ['commission-history'],
    queryFn: async () => {
      const res = await api.get('/api/stepper/commission-history');
      return res.data;
    },
  });
}

export function useWithdrawals() {
  return useQuery<Withdrawal[]>({
    queryKey: ['withdrawals'],
    queryFn: async () => {
      const res = await api.get('/api/stepper/withdrawals');
      return res.data;
    },
  });
}

export function useDeposit() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (amount: number) => {
      const res = await api.post('/api/stepper/deposit', { amount });
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['wallet'] });
    },
  });
}

export function useWithdraw() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (amount: number) => {
      const res = await api.post('/api/stepper/withdraw', { amount });
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['wallet'] });
      queryClient.invalidateQueries({ queryKey: ['withdrawals'] });
    },
  });
}
