import type { EntityConfig } from "../hooks/useEntity";

export const analyticsEventEntityConfig: EntityConfig = {
  name: "AnalyticsEvent",
  orderBy: "created_at DESC",
  properties: {
    eventType: {
      type: "string",
      description: "Type of event (page_view, feature_use, conversion, etc.)",
    },
    eventName: {
      type: "string",
      description: "Specific event name (calculator_used, scenario_saved, etc.)",
    },
    category: {
      type: "string",
      description: "Event category (engagement, monetization, conversion)",
    },
    userId: {
      type: "string",
      description: "User identifier (session-based or account-based)",
    },
    userPlan: {
      type: "string",
      description: "User's subscription plan",
      default: "free",
    },
    metadata: {
      type: "string",
      description: "JSON string with additional event data",
    },
    value: {
      type: "number",
      description: "Numeric value associated with event",
    },
    sessionId: {
      type: "string",
      description: "Session identifier for tracking user sessions",
    },
  },
  required: ["eventType", "eventName", "category", "userId"],
};
