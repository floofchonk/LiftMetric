import type { EntityConfig } from "../hooks/useEntity";

export const featureSuggestionEntityConfig: EntityConfig = {
  name: "FeatureSuggestion",
  orderBy: "created_at DESC",
  properties: {
    featureName: { type: "string", description: "Name of the suggested feature" },
    description: { type: "string", description: "Detailed description of the feature" },
    email: { type: "string", description: "User's email for follow-up (optional)" },
    userTier: { type: "string", enum: ["Free", "Basic", "Pro", "Enterprise"], description: "Current user tier" },
    wouldPay: { type: "string", enum: ["Yes", "No", "Maybe"], description: "Would user pay for this feature" },
    category: { type: "string", description: "Feature category" },
    status: { type: "string", enum: ["new", "reviewed", "in_progress", "completed"], default: "new", description: "Review status" },
  },
  required: ["featureName", "description"],
};
