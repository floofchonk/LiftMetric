import type { EntityConfig } from "../hooks/useEntity";

export const scenarioModelEntityConfig: EntityConfig = {
  name: "ScenarioModel",
  orderBy: "created_at DESC",
  properties: {
    userId: { type: "string", description: "User who created the scenario" },
    name: { type: "string", description: "Scenario name" },
    baseCalculation: { type: "string", description: "JSON of base calculation data" },
    variables: { type: "string", description: "JSON of adjustable variables" },
    results: { type: "string", description: "JSON of scenario results" },
    notes: { type: "string", description: "User notes about scenario" },
  },
  required: ["userId", "name", "baseCalculation"],
};
