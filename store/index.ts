import { configureStore } from '@reduxjs/toolkit';
import { transactionApi } from './api/transactionApi';
import transferReducer from './transferSlice';

export const store = configureStore({
    reducer: {
      transfer: transferReducer,
      [transactionApi.reducerPath]: transactionApi.reducer,
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().concat(
        transactionApi.middleware,
      ),
  });

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
