import { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from './redux/store';
import { fetchCoinGeckoData, initializeBinanceWebSocket } from './utils/fetchData.ts';
import { formatNumber, formatCompactNumber } from './utils/formatNumber';

const CRYPTO_SYMBOLS = ['BTCUSDT', 'ETHUSDT', 'BNBUSDT', 'SOLUSDT', 'XRPUSDT'];

const SimpleChart: React.FC<{ data: number[], positive: boolean }> = ({ data, positive }) => {
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;

  const points = data.map((val, i) =>
    `${(i / (data.length - 1)) * 100},${100 - ((val - min) / range) * 80}`
  ).join(' ');

  return (
    <svg viewBox="0 0 100 100" className="h-10 w-32">
      <polyline
        points={points}
        fill="none"
        stroke={positive ? "#22c55e" : "#ef4444"}
        strokeWidth="3"
      />
    </svg>
  );
};

const App = () => {
  const dispatch = useDispatch();
  const cryptoData = useSelector((state: RootState) => state.crypto.data);
  const wsRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    fetchCoinGeckoData(dispatch);
    wsRef.current = initializeBinanceWebSocket(dispatch, CRYPTO_SYMBOLS);

    return () => {
      if (wsRef.current) {
        wsRef.current.close();
        wsRef.current = null;
      }
    };
  }, [dispatch]);

  return (
    <div className="min-h-screen bg-zinc-900 text-gray-100 flex items-start justify-center p-6">
      <div className="w-full max-w-7xl">
        <h1 className="text-3xl md:text-4xl font-bold mb-6 text-center text-teal-400">
          🚀 Crypto Price Tracker
        </h1>

        <div className="overflow-x-auto rounded-lg shadow-lg">
          <table className="min-w-full bg-zinc-800 border border-zinc-700 rounded-lg overflow-hidden">
            <thead className="bg-zinc-700">
              <tr>
                {[
                  '#', 'Name', 'Price', '1h %', '24h %', '7d %',
                  'Market Cap', '24h Volume', 'Circulating Supply',
                  'Max Supply', '7D Chart'
                ].map((header, idx) => (
                  <th key={idx}
                    className={`px-2 md:px-4 py-3 text-sm font-semibold text-left ${
                      idx > 1 ? 'text-right' : ''
                    } ${idx >= 6 ? 'hidden md:table-cell' : ''} ${
                      idx >= 8 ? 'hidden lg:table-cell' : ''
                    }`}
                  >
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {Object.entries(cryptoData).map(([symbol, data], index) => {
                const chartData = data.sparkline_in_7d?.price || [];

                return (
                  <tr
                    key={symbol}
                    className="border-t border-zinc-700 hover:bg-zinc-700 transition-colors"
                  >
                    <td className="px-2 md:px-4 py-3">{index + 1}</td>
                    <td className="px-2 md:px-4 py-3">
                      <div className="flex items-center">
                        {data.logo && (
                          <img
                            src={data.logo}
                            alt={data.name || symbol}
                            className="w-6 h-6 mr-2"
                          />
                        )}
                        <div>
                          <div className="font-medium">{data.name || symbol}</div>
                          <div className="text-xs text-gray-400">{data.symbol || symbol.replace('USDT', '')}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-2 md:px-4 py-3 text-right font-medium">
                      ${data.price?.toFixed(2)}
                    </td>
                    <td className={`px-2 md:px-4 py-3 text-right ${
                      (data.change1h || 0) >= 0 ? 'text-green-400' : 'text-red-400'
                    }`}>
                      {(data.change1h || 0).toFixed(2)}%
                    </td>
                    <td className={`px-2 md:px-4 py-3 text-right ${
                      (data.percent || 0) >= 0 ? 'text-green-400' : 'text-red-400'
                    }`}>
                      {(data.percent || 0).toFixed(2)}%
                    </td>
                    <td className={`px-2 md:px-4 py-3 text-right ${
                      (data.change7d || 0) >= 0 ? 'text-green-400' : 'text-red-400'
                    }`}>
                      {(data.change7d || 0).toFixed(2)}%
                    </td>
                    <td className="px-2 md:px-4 py-3 text-right hidden md:table-cell">
                      {formatNumber(data.marketCap || 0)}
                    </td>
                    <td className="px-2 md:px-4 py-3 text-right hidden md:table-cell">
                      {formatNumber(data.volume || 0)}
                    </td>
                    <td className="px-2 md:px-4 py-3 text-right hidden lg:table-cell">
                      {formatCompactNumber(data.circulatingSupply || 0)} {data.symbol || symbol.replace('USDT', '')}
                    </td>
                    <td className="px-2 md:px-4 py-3 text-right hidden lg:table-cell">
                      {data.maxSupply === null
                        ? '∞'
                        : data.maxSupply
                          ? `${formatCompactNumber(data.maxSupply)} ${data.symbol || symbol.replace('USDT', '')}`
                          : '?'}
                    </td>
                    <td className="px-2 md:px-4 py-3 text-center hidden md:table-cell">
                      <SimpleChart
                        data={chartData}
                        positive={(data.change7d || 0) >= 0}
                      />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default App;
