import type { EntityConfig } from "../hooks/useEntity";

export const forumCommentEntityConfig: EntityConfig = {
  name: "ForumComment",
  orderBy: "created_at ASC",
  properties: {
    postId: { type: "integer", description: "ID of the parent post" },
    content: { type: "string", description: "Comment content" },
    author: { type: "string", description: "Author name" },
    authorEmail: { type: "string", description: "Author email (optional)" },
    upvotes: { type: "integer", default: "0", description: "Number of upvotes" },
    downvotes: { type: "integer", default: "0", description: "Number of downvotes" },
    isModerated: { type: "string", default: "false", description: "Whether comment is moderated" },
  },
  required: ["postId", "content", "author"],
};
