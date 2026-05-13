import type { EntityConfig } from "../hooks/useEntity";

export const emailAutomationLogEntityConfig: EntityConfig = {
  name: "EmailAutomationLog",
  orderBy: "created_at DESC",
  properties: {
    campaignId: { type: "integer", description: "Email campaign ID" },
    campaignName: { type: "string", description: "Campaign name" },
    userId: { type: "string", description: "Recipient user ID" },
    email: { type: "string", description: "Recipient email address" },
    username: { type: "string", description: "Recipient username" },
    emailType: { type: "string", description: "Type of email sent" },
    subject: { type: "string", description: "Email subject" },
    status: {
      type: "string",
      enum: ["queued", "sent", "failed", "bounced"],
      default: "queued",
      description: "Email delivery status",
    },
    sentAt: { type: "string", description: "When email was sent" },
    openedAt: { type: "string", description: "When email was opened" },
    clickedAt: { type: "string", description: "When links were clicked" },
    errorMessage: { type: "string", description: "Error details if failed" },
  },
  required: ["userId", "email", "emailType", "subject"],
};
