import type { EntityConfig } from "../hooks/useEntity";

export const onboardingTourEntityConfig: EntityConfig = {
  name: "OnboardingTour",
  orderBy: "created_at DESC",
  properties: {
    userId: { type: "string", description: "User ID" },
    tourType: {
      type: "string",
      enum: ["basic_mode", "scientific_mode", "history_panel", "full_tour"],
      description: "Type of tour",
    },
    currentStep: { type: "integer", description: "Current step in tour" },
    totalSteps: { type: "integer", description: "Total steps in tour" },
    completedAt: { type: "string", description: "ISO timestamp when tour completed", default: "" },
    droppedAt: { type: "string", description: "ISO timestamp when user dropped off", default: "" },
    status: {
      type: "string",
      enum: ["in_progress", "completed", "skipped", "dropped_off"],
      description: "Tour status",
    },
    sessionId: { type: "string", description: "Browser session ID" },
  },
  required: ["userId", "tourType", "currentStep", "status"],
};
