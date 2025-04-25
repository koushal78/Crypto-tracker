import { Dispatch } from 'redux';
import { updateCrypto } from '../redux/cryptoSlice';
import { RootState, store } from '../redux/store';

// Local store for immutable change7d per coin
const cachedChange7d: Record<string, number> = {};

// Function to fetch CoinGecko data
export const fetchCoinGeckoData = async (dispatch: Dispatch) => {
  try {
    const res = await fetch(
      'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=bitcoin,ethereum,binancecoin,solana,ripple&sparkline=true&price_change_percentage=1h,24h,7d'
    );
    const data = await res.json();

    data.forEach((coin: any) => {
      const symbol = coin.symbol.toUpperCase() + 'USDT';

      // Freeze 7d change value
      cachedChange7d[symbol] = coin.price_change_percentage_7d_in_currency;

      dispatch(
        updateCrypto({
          symbol,
          data: {
            price: coin.current_price,
            percent: coin.price_change_percentage_24h,
            change: coin.price_change_24h,
            volume: coin.total_volume,
            marketCap: coin.market_cap,
            circulatingSupply: coin.circulating_supply,
            maxSupply: coin.max_supply,
            change1h: coin.price_change_percentage_1h_in_currency,
            change7d: coin.price_change_percentage_7d_in_currency, // Initial snapshot
            logo: coin.image,
            sparkline_in_7d: coin.sparkline_in_7d,
          },
        })
      );
    });
  } catch (error) {
    console.error('Error fetching CoinGecko data:', error);
  }
};

// WebSocket debouncing per symbol
const updateTimers: Record<string, NodeJS.Timeout> = {};

export const initializeBinanceWebSocket = (dispatch: Dispatch, symbols: string[]) => {
  const socket = new WebSocket('wss://stream.binance.com:9443/ws');

  const message = {
    method: 'SUBSCRIBE',
    params: symbols.map((symbol) => `${symbol.toLowerCase()}@trade`),
    id: 1,
  };

  socket.onopen = () => {
    socket.send(JSON.stringify(message));
  };

  socket.onmessage = (event) => {
    const data = JSON.parse(event.data);

    if (data.e === 'trade') {
      const symbol = data.s.toUpperCase();
      const price = parseFloat(data.p);

      // Debounce updates per symbol
      if (updateTimers[symbol]) clearTimeout(updateTimers[symbol]);

      updateTimers[symbol] = setTimeout(() => {
        const currentState: RootState = store.getState();
        const existingData = currentState.crypto[symbol as keyof typeof currentState.crypto] || {};

        dispatch(
          updateCrypto({
            symbol: symbol,
            data: {
              ...existingData,
              price: parseFloat(price.toFixed(2)),
              change7d: cachedChange7d[symbol] ?? existingData.change7d, // ensure 7D remains frozen
            },
          })
        );
      }, 300);
    }
  };

  socket.onerror = (error) => {
    console.error('WebSocket error:', error);
  };

  return socket;
};
