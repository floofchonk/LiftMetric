import { useState, useEffect } from "react";
import { useEntity } from "../hooks/useEntity";
import { apiConnectionEntityConfig } from "../entities/ApiConnection";
import { apiDataCacheEntityConfig } from "../entities/ApiDataCache";
import { RefreshCw, TrendingUp, TrendingDown, ArrowRight } from "lucide-react";

type ApiConnection = {
  id: number;
  userId: string;
  connectionName: string;
  provider: string;
  status: string;
  isActive: string;
  created_at: string;
  updated_at: string;
};

type ApiDataCache = {
  id: number;
  connectionId: string;
  dataType: string;
  symbol: string;
  dataValue: string;
  price: number;
  change: number;
  changePercent: number;
  volume: number;
  timestamp: string;
  expiresAt: string;
  isValid: string;
  created_at: string;
  updated_at: string;
};

export default function LiveDataFeed() {
  const { items: connections } = useEntity<ApiConnection>(apiConnectionEntityConfig);
  const { items: cachedData, loading, create, update } = useEntity<ApiDataCache>(apiDataCacheEntityConfig);
  const [selectedConnection, setSelectedConnection] = useState<number | null>(null);
  const [symbol, setSymbol] = useState("");
  const [dataType, setDataType] = useState("stock");
  const [fetching, setFetching] = useState(false);

  const activeConnections = connections.filter(c => c.status === "connected" && c.isActive === "true");
  const validData = cachedData.filter(d => d.isValid === "true");

  const handleFetchData = async () => {
    if (!selectedConnection || !symbol) {
      alert("Please select a connection and enter a symbol");
      return;
    }

    setFetching(true);

    // Simulate API fetch (in production, this would call the actual API)
    setTimeout(async () => {
      const mockPrice = 100 + Math.random() * 500;
      const mockChange = (Math.random() - 0.5) * 20;
      const mockChangePercent = (mockChange / mockPrice) * 100;
      const mockVolume = Math.floor(Math.random() * 10000000);

      const now = new Date();
      const expiresAt = new Date(now.getTime() + 5 * 60000); // 5 minutes from now

      const mockData = {
        price: mockPrice,
        change: mockChange,
        changePercent: mockChangePercent,
        volume: mockVolume,
        open: mockPrice - Math.random() * 10,
        high: mockPrice + Math.random() * 10,
        low: mockPrice - Math.random() * 15,
        close: mockPrice,
      };

      // Check if data already exists for this symbol
      const existing = cachedData.find(
        d => d.connectionId === String(selectedConnection) && d.symbol === symbol.toUpperCase()
      );

      if (existing) {
        await update(existing.id, {
          dataValue: JSON.stringify(mockData),
          price: mockPrice,
          change: mockChange,
          changePercent: mockChangePercent,
          volume: mockVolume,
          timestamp: now.toISOString(),
          expiresAt: expiresAt.toISOString(),
          isValid: "true",
        });
      } else {
        await create({
          connectionId: String(selectedConnection),
          dataType,
          symbol: symbol.toUpperCase(),
          dataValue: JSON.stringify(mockData),
          price: mockPrice,
          change: mockChange,
          changePercent: mockChangePercent,
          volume: mockVolume,
          timestamp: now.toISOString(),
          expiresAt: expiresAt.toISOString(),
          isValid: "true",
        });
      }

      setFetching(false);
      setSymbol("");
    }, 1500);
  };

  const handleRefresh = async (dataItem: ApiDataCache) => {
    // Simulate refresh
    const mockPrice = dataItem.price + (Math.random() - 0.5) * 5;
    const mockChange = mockPrice - dataItem.price;
    const mockChangePercent = (mockChange / dataItem.price) * 100;

    const now = new Date();
    const expiresAt = new Date(now.getTime() + 5 * 60000);

    const updatedData = JSON.parse(dataItem.dataValue);
    updatedData.price = mockPrice;
    updatedData.change = mockChange;

    await update(dataItem.id, {
      dataValue: JSON.stringify(updatedData),
      price: mockPrice,
      change: mockChange,
      changePercent: mockChangePercent,
      timestamp: now.toISOString(),
      expiresAt: expiresAt.toISOString(),
    });
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);
  };

  const formatNumber = (value: number) => {
    return new Intl.NumberFormat('en-US').format(value);
  };

  const formatPercent = (value: number) => {
    return `${value >= 0 ? '+' : ''}${value.toFixed(2)}%`;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-600" />
          <p className="text-gray-600">Loading live data feed...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">📡 Live Data Feed</h1>
          <p className="text-gray-600">Fetch and monitor real-time financial data from connected APIs</p>
        </div>

        {activeConnections.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-xl shadow-md">
            <div className="text-6xl mb-4">🔌</div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">No Active API Connections</h3>
            <p className="text-gray-600 mb-6">Please connect to at least one API provider first</p>
            <a
              href="#"
              className="inline-block px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg shadow-md hover:shadow-xl transform hover:scale-105 transition-all duration-200 font-semibold"
            >
              Go to API Integrations
            </a>
          </div>
        ) : (
          <>
            {/* Fetch Data Form */}
            <div className="bg-white rounded-xl shadow-md p-6 mb-8 border border-gray-100">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Fetch New Data</h2>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Connection
                  </label>
                  <select
                    value={selectedConnection || ""}
                    onChange={(e) => setSelectedConnection(Number(e.target.value))}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Select connection...</option>
                    {activeConnections.map(conn => (
                      <option key={conn.id} value={conn.id}>
                        {conn.connectionName}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Data Type
                  </label>
                  <select
                    value={dataType}
                    onChange={(e) => setDataType(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="stock">Stock Price</option>
                    <option value="forex">Currency Exchange</option>
                    <option value="crypto">Cryptocurrency</option>
                    <option value="commodity">Commodity</option>
                    <option value="index">Market Index</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Symbol
                  </label>
                  <input
                    type="text"
                    value={symbol}
                    onChange={(e) => setSymbol(e.target.value)}
                    placeholder="e.g., AAPL, EUR/USD"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent uppercase"
                  />
                </div>
                <div className="flex items-end">
                  <button
                    onClick={handleFetchData}
                    disabled={fetching || !selectedConnection || !symbol}
                    className="w-full px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:shadow-lg transform hover:scale-105 transition-all duration-200 font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {fetching ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        Fetching...
                      </>
                    ) : (
                      <>
                        <ArrowRight className="w-4 h-4" />
                        Fetch Data
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* Live Data Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {validData.map(dataItem => {
                const connection = connections.find(c => c.id === Number(dataItem.connectionId));
                const parsedData = JSON.parse(dataItem.dataValue);
                const isPositive = dataItem.change >= 0;

                return (
                  <div key={dataItem.id} className="bg-white rounded-xl shadow-md p-6 border border-gray-100 hover:shadow-xl transition-shadow duration-300">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <div className="text-2xl font-bold text-gray-900">{dataItem.symbol}</div>
                        <div className="text-sm text-gray-600">{connection?.connectionName}</div>
                      </div>
                      <button
                        onClick={() => handleRefresh(dataItem)}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200"
                        title="Refresh data"
                      >
                        <RefreshCw className="w-4 h-4 text-gray-600" />
                      </button>
                    </div>

                    {/* Price */}
                    <div className="mb-4">
                      <div className="text-3xl font-bold text-gray-900">
                        {formatCurrency(dataItem.price)}
                      </div>
                      <div className={`flex items-center gap-1 text-sm font-semibold ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
                        {isPositive ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                        {formatCurrency(Math.abs(dataItem.change))} ({formatPercent(dataItem.changePercent)})
                      </div>
                    </div>

                    {/* Additional Data */}
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div>
                        <div className="text-gray-600">Open</div>
                        <div className="font-semibold text-gray-900">{formatCurrency(parsedData.open)}</div>
                      </div>
                      <div>
                        <div className="text-gray-600">High</div>
                        <div className="font-semibold text-gray-900">{formatCurrency(parsedData.high)}</div>
                      </div>
                      <div>
                        <div className="text-gray-600">Low</div>
                        <div className="font-semibold text-gray-900">{formatCurrency(parsedData.low)}</div>
                      </div>
                      <div>
                        <div className="text-gray-600">Volume</div>
                        <div className="font-semibold text-gray-900">{formatNumber(dataItem.volume)}</div>
                      </div>
                    </div>

                    {/* Timestamp */}
                    <div className="mt-4 pt-4 border-t text-xs text-gray-500">
                      Updated: {new Date(dataItem.timestamp).toLocaleString()}
                    </div>
                  </div>
                );
              })}
            </div>

            {validData.length === 0 && (
              <div className="text-center py-12 bg-white rounded-xl shadow-md">
                <div className="text-6xl mb-4">📊</div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">No Data Yet</h3>
                <p className="text-gray-600">Fetch your first financial data using the form above</p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
