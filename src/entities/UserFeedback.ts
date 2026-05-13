import type { EntityConfig } from "../hooks/useEntity";

export const userFeedbackEntityConfig: EntityConfig = {
  name: "UserFeedback",
  orderBy: "created_at DESC",
  properties: {
    userId: { type: "string", description: "User ID or session ID" },
    feedbackType: {
      type: "string",
      enum: ["bug_report", "feature_suggestion", "general_feedback"],
      description: "Type of feedback",
    },
    message: { type: "string", description: "Feedback message content" },
    email: { type: "string", description: "User email for follow-up" },
    rating: { type: "integer", description: "Optional satisfaction rating 1-5" },
    sessionId: { type: "string", description: "Browser session ID" },
    pageUrl: { type: "string", description: "Page where feedback was submitted" },
    status: {
      type: "string",
      enum: ["new", "reviewed", "in_progress", "resolved", "closed"],
      default: "new",
      description: "Feedback status",
    },
    adminNotes: { type: "string", description: "Internal admin notes", default: "" },
  },
  required: ["userId", "feedbackType", "message"],
};
