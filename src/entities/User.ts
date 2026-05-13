import type { EntityConfig } from "../hooks/useEntity";

export const userEntityConfig: EntityConfig = {
  name: "User",
  orderBy: "created_at DESC",
  properties: {
    email: { type: "string", description: "User email address" },
    password: { type: "string", description: "Hashed password" },
    name: { type: "string", description: "Full name" },
    subscriptionPlan: {
      type: "string",
      enum: ["free", "professional", "enterprise"],
      default: "free",
      description: "Current subscription plan",
    },
    subscriptionStatus: {
      type: "string",
      enum: ["active", "canceled", "expired", "trial"],
      default: "trial",
      description: "Subscription status",
    },
    billingCycle: {
      type: "string",
      enum: ["monthly", "annual"],
      default: "monthly",
      description: "Billing cycle",
    },
    nextBillingDate: { type: "string", description: "Next billing date (ISO string)" },
    trialEndsAt: { type: "string", description: "Trial end date (ISO string)" },
  },
  required: ["email", "password", "name"],
};
