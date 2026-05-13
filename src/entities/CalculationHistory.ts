import type { EntityConfig } from "../hooks/useEntity";

export const calculationHistoryEntityConfig: EntityConfig = {
  name: "CalculationHistory",
  orderBy: "created_at DESC",
  properties: {
    userId: { type: "string", description: "User ID who performed the calculation" },
    calculationType: { type: "string", description: "Type of calculation performed" },
    inputs: { type: "string", description: "JSON string of input parameters" },
    outputs: { type: "string", description: "JSON string of calculation results" },
    scenarioName: { type: "string", description: "Optional scenario name" },
    notes: { type: "string", description: "Optional user notes" },
  },
  required: ["userId", "calculationType", "inputs", "outputs"],
};
