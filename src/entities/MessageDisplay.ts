import type { EntityConfig } from "../hooks/useEntity";

export const messageDisplayEntityConfig: EntityConfig = {
  name: "MessageDisplay",
  orderBy: "created_at DESC",
  properties: {
    messageId: { type: "integer", description: "Reference to InAppMessage" },
    userId: { type: "string", description: "User identifier" },
    displayCount: { type: "integer", default: "0", description: "Times displayed" },
    lastDisplayed: { type: "string", description: "Last display timestamp" },
    dismissed: { type: "string", default: "false", description: "User dismissed" },
    ctaClicked: { type: "string", default: "false", description: "CTA clicked" },
  },
  required: ["messageId", "userId"],
};
