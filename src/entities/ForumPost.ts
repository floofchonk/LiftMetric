import type { EntityConfig } from "../hooks/useEntity";

export const forumPostEntityConfig: EntityConfig = {
  name: "ForumPost",
  orderBy: "created_at DESC",
  properties: {
    title: { type: "string", description: "Post title" },
    content: { type: "string", description: "Post content" },
    author: { type: "string", description: "Author name" },
    authorEmail: { type: "string", description: "Author email (optional)" },
    category: {
      type: "string",
      enum: ["general", "feature-requests", "bug-reports", "tips-tricks", "announcements"],
      description: "Post category",
    },
    status: {
      type: "string",
      enum: ["open", "closed", "resolved", "archived"],
      default: "open",
      description: "Post status",
    },
    upvotes: { type: "integer", default: "0", description: "Number of upvotes" },
    downvotes: { type: "integer", default: "0", description: "Number of downvotes" },
    commentCount: { type: "integer", default: "0", description: "Number of comments" },
    isPinned: { type: "string", default: "false", description: "Whether post is pinned" },
    tags: { type: "string", description: "Comma-separated tags" },
  },
  required: ["title", "content", "author", "category"],
};
