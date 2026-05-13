import type { EntityConfig } from "../hooks/useEntity";

export const announcementEntityConfig: EntityConfig = {
  name: "Announcement",
  orderBy: "priority DESC, created_at DESC",
  properties: {
    title: {
      type: "string",
      description: "Announcement title"
    },
    message: {
      type: "string",
      description: "Announcement message content"
    },
    type: {
      type: "string",
      enum: ["feature", "update", "maintenance", "news", "alert"],
      default: "news",
      description: "Type of announcement"
    },
    priority: {
      type: "integer",
      default: 0,
      description: "Priority level (higher = more important)"
    },
    linkText: {
      type: "string",
      description: "Call-to-action link text"
    },
    linkUrl: {
      type: "string",
      description: "Link URL for more details"
    },
    targetPages: {
      type: "string",
      description: "JSON array of pages where announcement should show (e.g., ['/', '/calculator'])"
    },
    status: {
      type: "string",
      enum: ["draft", "active", "scheduled", "expired"],
      default: "draft",
      description: "Announcement status"
    },
    startDate: {
      type: "string",
      format: "date",
      description: "Start date for display"
    },
    endDate: {
      type: "string",
      format: "date",
      description: "End date for display"
    },
    dismissible: {
      type: "string",
      default: "true",
      description: "Whether users can dismiss this announcement"
    },
    showOnce: {
      type: "string",
      default: "false",
      description: "Show only once per user"
    },
    icon: {
      type: "string",
      description: "Icon name or emoji"
    }
  },
  required: ["title", "message", "type"]
};
