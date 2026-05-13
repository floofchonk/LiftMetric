import type { EntityConfig } from "../hooks/useEntity";

export const emailNotificationPreferenceEntityConfig: EntityConfig = {
  name: "EmailNotificationPreference",
  orderBy: "created_at DESC",
  properties: {
    userId: { type: "string", description: "User ID" },
    scenarioUpdates: { type: "string", default: "true", description: "Notify on scenario updates" },
    calculationSummaries: { type: "string", default: "true", description: "Notify on calculation completion" },
    featureAnnouncements: { type: "string", default: "true", description: "Notify on new features" },
    weeklyDigest: { type: "string", default: "false", description: "Send weekly digest" },
    marketingEmails: { type: "string", default: "false", description: "Marketing and promotional emails" },
  },
  required: ["userId"],
};
