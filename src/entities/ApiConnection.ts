import type { EntityConfig } from "../hooks/useEntity";

export const apiConnectionEntityConfig: EntityConfig = {
  name: "ApiConnection",
  orderBy: "created_at DESC",
  properties: {
    userId: { type: "string", description: "User ID who owns this connection" },
    connectionName: { type: "string", description: "User-friendly connection name" },
    provider: {
      type: "string",
      enum: ["alphavantage", "finnhub", "exchangerate", "coinbase", "yahoo", "custom"],
      description: "API provider"
    },
    apiKey: { type: "string", description: "API key or token (encrypted)" },
    baseUrl: { type: "string", description: "Base API URL for custom providers" },
    status: {
      type: "string",
      enum: ["connected", "disconnected", "error", "testing"],
      default: "disconnected",
      description: "Connection status"
    },
    lastSync: { type: "string", description: "Last successful sync timestamp" },
    errorMessage: { type: "string", description: "Last error message if any" },
    syncFrequency: {
      type: "string",
      enum: ["realtime", "1min", "5min", "15min", "1hour", "manual"],
      default: "manual",
      description: "Data sync frequency"
    },
    dataTypes: { type: "string", description: "JSON array of data types enabled" },
    isActive: { type: "string", default: "true", description: "Whether connection is active" },
    requestCount: { type: "integer", default: 0, description: "Total API requests made" },
    lastRequestTime: { type: "string", description: "Last request timestamp" },
  },
  required: ["userId", "connectionName", "provider"]
};
