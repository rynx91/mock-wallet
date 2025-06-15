import { configureStore } from '@reduxjs/toolkit';
import accountReducer from './accountSlice';
import { accountApi } from './api/accountApi';
import { authApi } from './api/authApi';
import { transactionApi } from './api/transactionApi';
import { transferApi } from './api/transferApi';
import favouriteReducer from './favouriteSlice';
import recentTransferReducer from './recentTransferSlice';
import transferReducer from './transferSlice';

export const store = configureStore({
    reducer: {
      transfer: transferReducer,
      recentTransfer: recentTransferReducer,
      account: accountReducer,
      favourite: favouriteReducer,
      [transactionApi.reducerPath]: transactionApi.reducer,
      [authApi.reducerPath]: authApi.reducer,
      [accountApi.reducerPath]: accountApi.reducer,
      [transferApi.reducerPath]: transferApi.reducer,
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().concat(
        transactionApi.middleware,
        authApi.middleware,
        accountApi.middleware,
        transferApi.middleware
      ),
  });

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
