import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface AccountState {
  balance: number;
  interestEarned: number;
  received: number;
  spent: number;
}

const initialState: AccountState = {
  balance: 0,
  interestEarned: 0,
  received: 0,
  spent: 0,
};

const accountSlice = createSlice({
  name: 'account',
  initialState,
  reducers: {
    setAccount: (_, action: PayloadAction<AccountState>) => action.payload,
    deductBalance(state, action: PayloadAction<number>) {
        state.balance -= action.payload;
        state.spent += action.payload;
    },
    resetAccount: () => initialState,
  },
});

export const { setAccount, deductBalance, resetAccount } = accountSlice.actions;
export default accountSlice.reducer;
