import type { EntityConfig } from "../hooks/useEntity";

export const calculationExportEntityConfig: EntityConfig = {
  name: "CalculationExport",
  orderBy: "created_at DESC",
  properties: {
    userId: { type: "string", description: "User ID" },
    calculationIds: { type: "string", description: "Comma-separated calculation IDs" },
    exportType: {
      type: "string",
      enum: ["pdf", "csv", "png"],
      description: "Export format type",
    },
    exportData: { type: "string", description: "JSON data of the export" },
    fileName: { type: "string", description: "Generated file name" },
    fileSize: { type: "integer", description: "File size in bytes" },
    status: {
      type: "string",
      enum: ["pending", "completed", "failed"],
      default: "pending",
      description: "Export status",
    },
  },
  required: ["userId", "calculationIds", "exportType"],
};
