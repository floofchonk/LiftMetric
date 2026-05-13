import type { EntityConfig } from "../hooks/useEntity";

export const benchmarkDataEntityConfig: EntityConfig = {
  name: "BenchmarkData",
  orderBy: "industry ASC",
  properties: {
    industry: { type: "string", description: "Industry category" },
    metric: { type: "string", description: "Metric name (e.g., avgROI, avgCost)" },
    value: { type: "number", description: "Benchmark value" },
    percentile25: { type: "number", description: "25th percentile" },
    percentile50: { type: "number", description: "50th percentile (median)" },
    percentile75: { type: "number", description: "75th percentile" },
    sampleSize: { type: "integer", description: "Number of companies in benchmark" },
    description: { type: "string", description: "Metric description" },
  },
  required: ["industry", "metric", "value"],
};
