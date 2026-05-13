import type { EntityConfig } from "../hooks/useEntity";

export const forumVoteEntityConfig: EntityConfig = {
  name: "ForumVote",
  orderBy: "created_at DESC",
  properties: {
    postId: { type: "integer", description: "ID of the post being voted on (0 for comment votes)" },
    commentId: { type: "integer", default: "0", description: "ID of the comment being voted on (0 for post votes)" },
    voterEmail: { type: "string", description: "Email of the voter (to prevent duplicate votes)" },
    voteType: {
      type: "string",
      enum: ["upvote", "downvote"],
      description: "Type of vote",
    },
  },
  required: ["voterEmail", "voteType"],
};
