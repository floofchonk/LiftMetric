import type { EntityConfig } from "../hooks/useEntity";

export const scenarioEntityConfig: EntityConfig = {
  name: "Scenario",
  orderBy: "created_at DESC",
  properties: {
    name: { type: "string", description: "Scenario name" },
    companySize: { type: "string", description: "Company size" },
    industry: { type: "string", description: "Industry" },
    projectScope: { type: "string", description: "Project scope" },
    projectVolume: { type: "string", description: "Project volume" },
    customCosts: { type: "string", description: "JSON string of custom costs" },
    customBenefits: { type: "string", description: "JSON string of custom benefits" },
    totalCost: { type: "number", description: "Total cost" },
    totalBenefit: { type: "number", description: "Total benefit" },
    roiPercentage: { type: "number", description: "ROI percentage" },
    netBenefit: { type: "number", description: "Net benefit" },
    paybackPeriod: { type: "number", description: "Payback period in months" },
    efficiencyScore: { type: "number", description: "Efficiency score" },
    rating: { type: "integer", description: "Star rating 1-5", default: "0" },
    feedback: { type: "string", description: "User feedback text", default: "" },
  },
  required: ["name", "companySize", "industry", "projectScope", "projectVolume"],
};
