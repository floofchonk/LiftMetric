import type { EntityConfig } from "../hooks/useEntity";

export const helpArticleEntityConfig: EntityConfig = {
  name: "HelpArticle",
  orderBy: "created_at DESC",
  properties: {
    title: { type: "string", description: "Article title" },
    slug: { type: "string", description: "URL-friendly slug" },
    category: {
      type: "string",
      enum: ["getting-started", "basic-mode", "scientific-mode", "history", "reports", "advanced-features"],
      description: "Article category",
    },
    content: { type: "string", description: "Article content in markdown" },
    excerpt: { type: "string", description: "Short summary for search results" },
    videoUrl: { type: "string", description: "Optional tutorial video URL" },
    tags: { type: "string", description: "Comma-separated tags for search" },
    views: { type: "integer", default: "0", description: "View count" },
    helpful: { type: "integer", default: "0", description: "Helpful votes" },
    notHelpful: { type: "integer", default: "0", description: "Not helpful votes" },
    featured: { type: "string", default: "false", description: "Featured article" },
    published: { type: "string", default: "true", description: "Published status" },
  },
  required: ["title", "slug", "category", "content", "excerpt"],
};
