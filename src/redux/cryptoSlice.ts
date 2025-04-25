import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface CryptoData {
  price: number;
  change: number;
  percent: number;
  volume: number;
  marketCap?: number;
  circulatingSupply?: number;
  maxSupply?: number | null;
  change1h?: number;
  change7d?: number;
  logo?: string;
  name?: string;
  symbol?: string;
sparkline_in_7d?: {
    price: number[];
  };
}

interface CryptoState {
  data: Record<string, CryptoData>;
}

const initialState: CryptoState = {
  data: {},
};

const cryptoSlice = createSlice({
  name: 'crypto',
  initialState,
  reducers: {
    updateCrypto: (
      state,
      action: PayloadAction<{ symbol: string; data: Partial<CryptoData> }>
    ) => {
      const { symbol, data } = action.payload;
      if (!state.data[symbol]) {
        state.data[symbol] = data as CryptoData;
      } else {
        state.data[symbol] = { ...state.data[symbol], ...data };
      }
    },
  },
});

export const { updateCrypto } = cryptoSlice.actions;
export default cryptoSlice.reducer;