import AsyncStorage from '@react-native-async-storage/async-storage';
import { createApi } from '@reduxjs/toolkit/query/react';

const mockAccountData = require('../../assets/mockAccountInfo.json');

export const accountApi = createApi({
  reducerPath: 'accountApi',
  baseQuery: async () => {
    const token = await AsyncStorage.getItem('authToken');

    if (!token) {
      return {
        error: {
          status: 401,
          data: { message: 'Not authenticated' },
        },
      };
    }

    const userAccount = mockAccountData.find((acc: any) => acc.token === token);
    if (userAccount) {
      return { data: userAccount };
    } else {
      return {
        error: {
          status: 404,
          data: { message: 'Account not found' },
        },
      };
    }
  },
  endpoints: (builder) => ({
    getAccountInfo: builder.query<any, void>({
      query: () => '',
    }),
  }),
});

export const { useGetAccountInfoQuery } = accountApi;
