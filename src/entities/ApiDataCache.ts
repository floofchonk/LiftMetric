import type { EntityConfig } from "../hooks/useEntity";

export const apiDataCacheEntityConfig: EntityConfig = {
  name: "ApiDataCache",
  orderBy: "created_at DESC",
  properties: {
    connectionId: { type: "string", description: "Reference to API connection" },
    dataType: {
      type: "string",
      enum: ["stock", "forex", "crypto", "commodity", "index", "custom"],
      description: "Type of financial data"
    },
    symbol: { type: "string", description: "Stock symbol, currency pair, etc." },
    dataValue: { type: "string", description: "JSON data from API" },
    price: { type: "number", description: "Current price/rate" },
    change: { type: "number", description: "Price change" },
    changePercent: { type: "number", description: "Percentage change" },
    volume: { type: "number", description: "Trading volume" },
    timestamp: { type: "string", description: "Data timestamp from provider" },
    expiresAt: { type: "string", description: "Cache expiration timestamp" },
    isValid: { type: "string", default: "true", description: "Whether data is still valid" },
  },
  required: ["connectionId", "dataType", "symbol", "dataValue"]
};
