import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface RecentItem {
  name: string;
  type: 'account' | 'mobile';
  accountNumber?: string;
  phone?: string;
  bankCode?: string;
  bankName?: string;
}

const recentTransferSlice = createSlice({
  name: 'recentTransfer',
  initialState: [] as RecentItem[],
  reducers: {
    setRecentTransfers: (_, action: PayloadAction<RecentItem[]>) => action.payload,
    addRecentTransfer(state, action: PayloadAction<RecentItem>) {
      const existing = state.find((item) =>
        item.type === action.payload.type &&
        ((item.type === 'account' && item.accountNumber === action.payload.accountNumber) ||
         (item.type === 'mobile' && item.phone === action.payload.phone))
      );
      if (!existing) {
        state.unshift(action.payload);
      }
    },
    resetRecentTransfers: () => [],
  },
});

export const { setRecentTransfers, addRecentTransfer, resetRecentTransfers } = recentTransferSlice.actions;
export default recentTransferSlice.reducer;
