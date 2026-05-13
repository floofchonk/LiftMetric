import type { EntityConfig } from "../hooks/useEntity";

export const announcementDismissalEntityConfig: EntityConfig = {
  name: "AnnouncementDismissal",
  orderBy: "created_at DESC",
  properties: {
    userId: {
      type: "integer",
      description: "User who dismissed the announcement"
    },
    announcementId: {
      type: "integer",
      description: "Dismissed announcement ID"
    }
  },
  required: ["userId", "announcementId"]
};
