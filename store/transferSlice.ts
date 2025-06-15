import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface TransferState {
  referenceId: string;
  accountNumber: string;
  name: string;
  amount: string;
  note: string;
  dateTime: string;
  method?: string;
  bank?: {
    code: string;
    name: string;
    accountLength: number;
  };
}


const initialState: TransferState = {
  referenceId: '',
  accountNumber: '',
  name: '',
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
