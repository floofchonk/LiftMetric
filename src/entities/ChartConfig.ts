import type { EntityConfig } from "../hooks/useEntity";

export const chartConfigEntityConfig: EntityConfig = {
  name: "ChartConfig",
  orderBy: "created_at DESC",
  properties: {
    name: { type: "string", description: "Chart name" },
    description: { type: "string", description: "Chart description" },
    chartType: {
      type: "string",
      enum: ["line", "bar", "pie", "area", "scatter"],
      description: "Type of chart",
    },
    dataSource: {
      type: "string",
      enum: ["npv", "irr", "cashflow", "roi", "breakdown", "revenue"],
      description: "Financial data source",
    },
    xAxisKey: { type: "string", description: "X-axis data key" },
    yAxisKey: { type: "string", description: "Y-axis data key" },
    title: { type: "string", description: "Chart title" },
    colors: {
      type: "string",
      description: "Comma-separated color palette",
      default: "#3b82f6,#8b5cf6,#ec4899,#10b981,#f59e0b",
    },
    showGrid: {
      type: "string",
      enum: ["true", "false"],
      default: "true",
      description: "Show grid lines",
    },
    showLegend: {
      type: "string",
      enum: ["true", "false"],
      default: "true",
      description: "Show legend",
    },
    enableZoom: {
      type: "string",
      enum: ["true", "false"],
      default: "true",
      description: "Enable zoom functionality",
    },
    enableAnimation: {
      type: "string",
      enum: ["true", "false"],
      default: "true",
      description: "Enable chart animations",
    },
  },
  required: ["name", "chartType", "dataSource", "title"],
};
