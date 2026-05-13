import type { EntityConfig } from "../hooks/useEntity";

export const calculationEntityConfig: EntityConfig = {
  name: "Calculation",
  properties: {
    userId: { type: "string", description: "User ID who created the calculation" },
    expression: { type: "string", description: "Calculation expression" },
    result: { type: "number", description: "Calculation result" },
    mode: { type: "string", description: "Calculator mode (basic or scientific)" },
    tags: { type: "string", description: "Comma-separated tags" },
    notes: { type: "string", description: "User notes about the calculation" },
  },
  required: ["expression", "result"],
};
