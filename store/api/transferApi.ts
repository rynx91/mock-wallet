import AsyncStorage from '@react-native-async-storage/async-storage';
import { createApi } from '@reduxjs/toolkit/query/react';

export const transferApi = createApi({
  reducerPath: 'transferApi',
  baseQuery: async ({ url, method = 'GET', body }) => {
    const token = await AsyncStorage.getItem('authToken');
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    // Mocked API logic
    if (url === '/process-transaction' && method === 'POST') {
      if (body?.amount >= 999) {
        return { error: { status: 400, data: { message: 'Insufficient funds' } } };
      }
      if (body?.accountNumber?.startsWith('999')) {
        return { error: { status: 500, data: { message: 'Network error occurred' } } };
      }
      return {
        data: {
          status: 'success',
          transactionId: `TXN${Date.now()}`,
        },
      };
    }

    if (url === '/bank-list') {
      const mockBankList = require('../../assets/mockBanks.json');
      return { data: mockBankList };
    }

    if (url === '/favourite-transfers') {
      const mockFavourites = require('../../assets/mockFavourites.json');
      const matched = mockFavourites.find((entry: any) => entry.token === token);
      return { data: matched?.items || [] };
    }
    
    if (url === '/recent-transfers') {
      const mockRecents = require('../../assets/mockRecents.json');
      const matched = mockRecents.find((entry: any) => entry.token === token);
      return { data: matched?.items || [] };
    }

    return { error: { status: 404, data: { message: 'Unknown endpoint' } } };
  },
  endpoints: (builder) => ({
    processTransaction: builder.mutation<any, { amount: number; accountNumber: string }>({
      query: (body) => ({
        url: '/process-transaction',
        method: 'POST',
        body,
      }),
    }),
    getBankList: builder.query<any, void>({
      query: () => ({ url: '/bank-list' }),
    }),
    getRecentTransfers: builder.query<any, void>({
      query: () => ({ url: '/recent-transfers' }),
    }),
    getFavouriteTransfers: builder.query<any, void>({
      query: () => ({ url: '/favourite-transfers' }),
    }),
    
  }),
});

export const {
  useProcessTransactionMutation,
  useGetBankListQuery,
  useGetRecentTransfersQuery,
  useGetFavouriteTransfersQuery,
} = transferApi;
