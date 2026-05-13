import type { EntityConfig } from "../hooks/useEntity";

export const feedbackSubmissionEntityConfig: EntityConfig = {
  name: "FeedbackSubmission",
  orderBy: "created_at DESC",
  properties: {
    userId: { type: "string", description: "User ID (optional for guests)" },
    userName: { type: "string", description: "User name" },
    email: { type: "string", description: "User email for follow-up" },
    category: {
      type: "string",
      enum: ["feature_request", "bug_report", "general_feedback", "improvement"],
      description: "Feedback category",
    },
    subject: { type: "string", description: "Feedback subject/title" },
    message: { type: "string", description: "Detailed feedback message" },
    priority: {
      type: "string",
      enum: ["low", "medium", "high", "critical"],
      default: "medium",
      description: "Priority level",
    },
    status: {
      type: "string",
      enum: ["new", "in_review", "in_progress", "resolved", "closed"],
      default: "new",
      description: "Feedback status",
    },
    assignedTo: { type: "string", description: "Admin user assigned to this feedback" },
    adminNotes: { type: "string", description: "Internal admin notes" },
    resolvedAt: { type: "string", description: "Resolution timestamp" },
    attachmentUrl: { type: "string", description: "Optional attachment URL" },
  },
  required: ["category", "message"],
};
