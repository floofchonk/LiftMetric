import type { EntityConfig } from "../hooks/useEntity";

export const helpContactEntityConfig: EntityConfig = {
  name: "HelpContact",
  orderBy: "created_at DESC",
  properties: {
    userId: { type: "integer", description: "User ID who submitted" },
    name: { type: "string", description: "Contact name" },
    email: { type: "string", description: "Contact email" },
    subject: { type: "string", description: "Message subject" },
    message: { type: "string", description: "Message content" },
    category: {
      type: "string",
      enum: ["technical", "billing", "feature-request", "general"],
      description: "Contact category",
    },
    status: {
      type: "string",
      enum: ["new", "in-progress", "resolved", "closed"],
      default: "new",
      description: "Ticket status",
    },
    priority: {
      type: "string",
      enum: ["low", "medium", "high", "urgent"],
      default: "medium",
      description: "Priority level",
    },
    resolvedAt: { type: "string", description: "Resolution timestamp" },
    adminNotes: { type: "string", description: "Internal admin notes" },
  },
  required: ["name", "email", "subject", "message", "category"],
};
