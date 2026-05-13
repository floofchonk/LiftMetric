import type { EntityConfig } from "../hooks/useEntity";

export const emailCampaignEntityConfig: EntityConfig = {
  name: "EmailCampaign",
  orderBy: "created_at DESC",
  properties: {
    name: { type: "string", description: "Campaign name" },
    type: {
      type: "string",
      enum: ["welcome", "inactivity", "newsletter", "announcement", "promotional"],
      description: "Campaign type",
    },
    subject: { type: "string", description: "Email subject line" },
    templateName: { type: "string", description: "Email template identifier" },
    triggerType: {
      type: "string",
      enum: ["immediate", "scheduled", "event-based"],
      description: "When to send the email",
    },
    triggerCondition: { 
      type: "string", 
      description: "JSON string of trigger conditions (e.g., inactivity days, user signup)" 
    },
    status: {
      type: "string",
      enum: ["draft", "active", "paused", "completed"],
      default: "draft",
      description: "Campaign status",
    },
    sentCount: { type: "integer", default: "0", description: "Number of emails sent" },
    openRate: { type: "number", default: "0", description: "Email open rate percentage" },
    clickRate: { type: "number", default: "0", description: "Email click rate percentage" },
    lastRunAt: { type: "string", description: "Last time campaign was executed" },
    createdBy: { type: "string", description: "Admin user who created the campaign" },
  },
  required: ["name", "type", "subject", "templateName", "triggerType"],
};
