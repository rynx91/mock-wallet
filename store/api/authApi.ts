import { createApi } from '@reduxjs/toolkit/query/react';

const mockUsers = require('../../assets/mockUsers.json');

export const authApi = createApi({
  reducerPath: 'authApi',
  baseQuery: async ({ body }) => {
    const foundUser = mockUsers.find(
      (u: any) => u.phone === body.phone && u.pin === body.pin
    );

    if (foundUser) {
      return { data: { token: foundUser.token, user: foundUser } };
    } else {
      return { error: { status: 401, data: { message: 'Invalid login' } } };
    }
  },
  endpoints: (builder) => ({
    login: builder.mutation<any, { phone: string; pin: string }>({
      query: (body) => ({ body }),
    }),
  }),
});

export const { useLoginMutation } = authApi;
