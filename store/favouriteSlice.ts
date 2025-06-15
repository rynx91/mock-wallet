import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface FavouriteItem {
  name: string;
  type: 'account' | 'mobile';
  accountNumber?: string;
  phone?: string;
  bankCode?: string;
  bankName?: string;
}

const favouriteSlice = createSlice({
  name: 'favourite',
  initialState: [] as FavouriteItem[],
  reducers: {
    setFavourite: (_, action: PayloadAction<FavouriteItem[]>) => action.payload,
    addFavourite(state, action: PayloadAction<FavouriteItem>) {
      const exists = state.find((item) =>
        item.type === action.payload.type &&
        ((item.type === 'account' &&
          item.accountNumber === action.payload.accountNumber &&
          item.bankCode === action.payload.bankCode) ||
         (item.type === 'mobile' && item.phone === action.payload.phone))
      );
      if (!exists) state.unshift(action.payload);
    },
    removeFavourite(state, action: PayloadAction<{ type: 'account' | 'mobile'; phone?: string; accountNumber?: string }>) {
      return state.filter((item) =>
        !(item.type === action.payload.type &&
        ((item.type === 'mobile' && item.phone === action.payload.phone) ||
         (item.type === 'account' && item.accountNumber === action.payload.accountNumber)))
      );
    },
    resetFavourite: () => [],
  },
});

export const { setFavourite, addFavourite, removeFavourite, resetFavourite } = favouriteSlice.actions;
export default favouriteSlice.reducer;
