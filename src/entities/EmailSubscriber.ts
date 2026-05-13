import type { EntityConfig } from "../hooks/useEntity";

export const emailSubscriberEntityConfig: EntityConfig = {
  name: "EmailSubscriber",
  orderBy: "created_at DESC",
  properties: {
    email: { type: "string", description: "Subscriber email address" },
    name: { type: "string", description: "Subscriber name (optional)" },
    source: { type: "string", description: "Source of subscription (landing page, newsletter, etc.)" },
    status: {
      type: "string",
      enum: ["active", "unsubscribed"],
      default: "active",
      description: "Subscription status",
    },
    subscribedAt: { type: "string", format: "date", description: "Subscription date" },
  },
  required: ["email", "source"],
};
