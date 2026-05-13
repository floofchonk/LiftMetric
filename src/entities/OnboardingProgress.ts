import type { EntityConfig } from "../hooks/useEntity";

export const onboardingProgressConfig: EntityConfig = {
  name: "OnboardingProgress",
  properties: {
    userId: { type: "string", description: "User ID" },
    currentStep: { type: "integer", description: "Current step index" },
    completedSteps: { type: "string", description: "JSON array of completed step IDs" },
    dismissed: { type: "string", description: "Whether onboarding was dismissed" },
    completed: { type: "string", description: "Whether all steps completed" },
    lastViewedAt: { type: "string", description: "Last time onboarding was viewed" },
  },
  required: ["userId"],
};
