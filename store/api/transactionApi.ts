import { createApi } from '@reduxjs/toolkit/query/react';

export const transactionApi = createApi({
  reducerPath: 'transactionApi',
  baseQuery: async ({ url, body }) => {
    const mockData = require('../../assets/mockTransaction.json');

    return { data: mockData.success };
  },
  endpoints: (builder) => ({
    processTransaction: builder.mutation<any, { amount: number; accountNumber: string }>({
      query: (body) => ({
        url: 'mock',
        method: 'POST',
        body,
      }),
    }),
  }),
});

export const { useProcessTransactionMutation } = transactionApi;
