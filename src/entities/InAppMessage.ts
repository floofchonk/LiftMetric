import type { EntityConfig } from "../hooks/useEntity";

export const inAppMessageEntityConfig: EntityConfig = {
  name: "InAppMessage",
  orderBy: "created_at DESC",
  properties: {
    title: { type: "string", description: "Message title" },
    content: { type: "string", description: "Message content" },
    type: {
      type: "string",
      enum: ["info", "success", "warning", "upgrade", "feature", "tip"],
      description: "Message type",
    },
    style: {
      type: "string",
      enum: ["banner", "toast", "modal", "inline"],
      default: "banner",
      description: "Display style",
    },
    priority: {
      type: "string",
      enum: ["low", "medium", "high"],
      default: "medium",
      description: "Message priority",
    },
    triggerCondition: {
      type: "string",
      description: "JSON string of trigger conditions",
    },
    targetPage: { type: "string", description: "Target page or 'all'" },
    ctaText: { type: "string", description: "Call-to-action button text" },
    ctaAction: { type: "string", description: "CTA action type or URL" },
    isActive: { type: "string", default: "true", description: "Active status" },
    startDate: { type: "string", description: "Start date for display" },
    endDate: { type: "string", description: "End date for display" },
    maxDisplays: { type: "integer", description: "Max times to show per user" },
  },
  required: ["title", "content", "type"],
};
