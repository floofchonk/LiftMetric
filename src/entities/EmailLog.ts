import type { EntityConfig } from "../hooks/useEntity";

export const emailLogEntityConfig: EntityConfig = {
  name: "EmailLog",
  orderBy: "created_at DESC",
  properties: {
    recipientEmail: { type: "string", description: "Recipient email address" },
    recipientUserId: { type: "integer", description: "Recipient user ID (if applicable)" },
    subject: { type: "string", description: "Email subject line" },
    emailType: {
      type: "string",
      enum: ["welcome", "inactivity_reminder", "scenario_update", "calculation_summary", "feature_announcement", "weekly_digest"],
      description: "Email template type",
    },
    userId: { type: "string", description: "User ID" },
    status: {
      type: "string",
      enum: ["sent", "failed", "pending"],
      default: "pending",
      description: "Email delivery status",
    },
    sentAt: { type: "string", format: "date", description: "Sent timestamp" },
    errorMessage: { type: "string", description: "Error message if failed" },
  },
  required: ["recipientEmail", "subject", "emailType"],
};
