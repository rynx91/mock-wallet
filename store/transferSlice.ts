import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface TransferState {
  referenceId: string;
  accountNumber: string;
  amount: string;
  note: string;
  dateTime: string;
}

const initialState: TransferState = {
  referenceId: '',
  accountNumber: '',
  amount: '',
  note: '',
  dateTime: '',
};

const transferSlice = createSlice({
  name: 'transfer',
  initialState,
  reducers: {
    setTransferDetails(state, action: PayloadAction<TransferState>) {
      return action.payload;
    },
    clearTransferDetails() {
      return initialState;
    },
  },
});

export const { setTransferDetails, clearTransferDetails } = transferSlice.actions;
export default transferSlice.reducer;
