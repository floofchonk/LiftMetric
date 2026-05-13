import type { EntityConfig } from "../hooks/useEntity";

export const feedbackEntityConfig: EntityConfig = {
  name: "Feedback",
  orderBy: "created_at DESC",
  properties: {
    category: {
      type: "string",
      enum: ["bug", "feature", "suggestion", "praise", "other"],
      description: "Feedback category",
    },
    message: {
      type: "string",
      description: "Feedback message text",
    },
    email: {
      type: "string",
      description: "User email for follow-up (optional)",
    },
    status: {
      type: "string",
      enum: ["new", "reviewed", "in-progress", "resolved", "closed"],
      default: "new",
      description: "Feedback status",
    },
    userAgent: {
      type: "string",
      description: "Browser user agent",
    },
    url: {
      type: "string",
      description: "Page URL where feedback was submitted",
    },
  },
  required: ["category", "message"],
};
