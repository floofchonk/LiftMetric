import type { EntityConfig } from "../hooks/useEntity";

export const shareCommentEntityConfig: EntityConfig = {
  name: "ShareComment",
  orderBy: "created_at ASC",
  properties: {
    sharedCalculationId: {
      type: "string",
      description: "Reference to the shared calculation",
    },
    userId: {
      type: "string",
      description: "User ID of commenter",
    },
    userName: {
      type: "string",
      description: "Display name of commenter",
    },
    userEmail: {
      type: "string",
      description: "Email of commenter",
    },
    comment: {
      type: "string",
      description: "Comment text",
    },
    isResolved: {
      type: "string",
      default: "false",
      description: "Whether the comment is resolved",
    },
    parentCommentId: {
      type: "string",
      description: "Reference to parent comment for threading",
    },
  },
  required: ["sharedCalculationId", "userId", "userName", "comment"],
};
