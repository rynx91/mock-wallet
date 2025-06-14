import { configureStore } from '@reduxjs/toolkit';
import { authApi } from './api/authApi';
import { transactionApi } from './api/transactionApi';
import transferReducer from './transferSlice';

export const store = configureStore({
    reducer: {
      transfer: transferReducer,
      [transactionApi.reducerPath]: transactionApi.reducer,
      [authApi.reducerPath]: authApi.reducer,
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().concat(
        transactionApi.middleware,
        authApi.middleware
      ),
  });

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
