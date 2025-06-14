import { configureStore } from '@reduxjs/toolkit';
import { accountApi } from './api/accountApi';
import { authApi } from './api/authApi';
import { transactionApi } from './api/transactionApi';
import transferReducer from './transferSlice';

export const store = configureStore({
    reducer: {
      transfer: transferReducer,
      [transactionApi.reducerPath]: transactionApi.reducer,
      [authApi.reducerPath]: authApi.reducer,
      [accountApi.reducerPath]: accountApi.reducer,
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().concat(
        transactionApi.middleware,
        authApi.middleware,
        accountApi.middleware
      ),
  });

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
